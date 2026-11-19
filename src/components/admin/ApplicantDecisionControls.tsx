/**
 * ApplicantDecisionControls.tsx
 *
 * Admin can approve/reject submitted applicants.
 * Display confirm modal and updates applicant status.
 *
 * Author: Abby, Alex
 * Date Created: 11/06/26
 */
"use client";

import { useState } from "react";
import Image from "next/image";
import Check from "@/assets/icons/check.svg";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommonButton from "@/components/common/CommonButton";
import { decideApplicant } from "@/lib/admin-api";
import type { Decision } from "@/lib/admin-api";

export type DecisionStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

type ApplicantDecisionControlsProps = {
  applicantId: string;
  // The applicant's status when the page loaded
  status: DecisionStatus;
  // Called when the admin closes the result pop-up, so the page can refresh its own data
  onDecided?: (status: "APPROVED" | "REJECTED") => void;
};

/**
 * ApplicantDecisionControls /src/components/admin/
 *
 * Admin can approve/reject submitted applicants.
 * Display confirm modal while updating applicant status.
 *
 * @param applicantId - id of applicant
 * @param status - applicants inital status
 * @param onDecided - optional callback
 * @returns buttons and status
 *
 */
export default function ApplicantDecisionControls({
  applicantId,
  status,
  onDecided,
}: ApplicantDecisionControlsProps) {
  const [currentStatus, setCurrentStatus] = useState<DecisionStatus>(status);
  // Which decision the "Are you sure?" pop-up is open for (null means it's closed)
  const [pending, setPending] = useState<Decision | null>(null);
  // Which decision the result pop-up is open for (null means it's closed)
  const [result, setResult] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!pending) {
      return;
    }
    setBusy(true);
    setError(null);

    const response = await decideApplicant(applicantId, pending);
    setBusy(false);
    if (!response.ok) {
      setError(response.message);
      return;
    }

    const newStatus = pending === "approve" ? "APPROVED" : "REJECTED";
    setCurrentStatus(newStatus);
    setPending(null);
    setResult(newStatus);
  }

  function handleCancel() {
    setPending(null);
    setError(null);
  }

  function handleResultClose() {
    if (result != null) {
      onDecided?.(result);
    }
    setResult(null);
  }

  return (
    <>
      {currentStatus === "SUBMITTED" ? (
        <div className="flex w-full flex-col gap-3">
          <CommonButton
            title="Mark as Onboarded"
            fullWidth
            onClick={() => setPending("approve")}
          />
          <CommonButton
            title="Mark as Rejected"
            altStyle
            fullWidth
            onClick={() => setPending("reject")}
          />
        </div>
      ) : (
        <button
          type="button"
          disabled
          className={`min-h-12 w-full cursor-not-allowed rounded-full px-12 text-xl font-semibold ${
            currentStatus === "APPROVED"
              ? "bg-muted-green text-green"
              : "bg-muted-red text-red"
          }`}
        >
          {currentStatus === "APPROVED" ? "Volunteer Onboarded" : "Rejected"}
        </button>
      )}

      {pending && (
        <ConfirmModal
          title="Are you sure?"
          content={`Are you sure you want to ${pending} this applicant? This decision cannot be undone. `}
          confirmTitle={pending === "approve" ? "Approve" : "Reject"}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          busy={busy}
          error={error}
        />
      )}

      {result && (
        <ConfirmModal
          icon={
            <Image
              src={Check}
              alt=""
              className="mx-auto h-auto w-1/3 object-contain"
            />
          }
          title={
            result === "APPROVED"
              ? "Volunteer On-boarded"
              : "Volunteer Rejected"
          }
          content={
            result === "APPROVED"
              ? "A volunteer profile has been created. Check it at volunteer management page."
              : "Please contact the applicant through email."
          }
          confirmTitle="Close"
          fullWidthButtons
          onConfirm={handleResultClose}
        />
      )}
    </>
  );
}
