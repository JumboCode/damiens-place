/**
 * ApplicantDetailView.tsx
 *
 * Displays applicants application for admin review.
 *
 * Author: Abby, Alex
 * Date Created: 11/18/26
 */
"use client";

import { useEffect, useState } from "react";
import {
  fetchApplicantDetail,
  type ApplicantDetail,
  type ApplicantDetailResult,
} from "@/lib/admin-api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ApplicantDecisionControls from "@/components/admin/ApplicantDecisionControls";

function Row({
  label,
  value,
  required = true,
}: {
  label: string;
  value: string | number | null;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-base font-medium">
        {label}
        {required && <span className="text-error-msg"> *</span>}
      </dt>
      <dd className="text-base">
        {value === null || value === "" ? "—" : value}
      </dd>
    </div>
  );
}

/**
 * ApplicantDetailView /src/components/admin/
 *
 * Displays applicant's application for review.
 *
 * @param applicantId - applicants id
 * @returns applicant detail view
 *
 */
export default function ApplicantDetailView({
  applicantId,
}: {
  applicantId: string;
}) {
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [error, setError] = useState<{
    message: string;
    notFound: boolean;
  } | null>(null);

  function applyResult(result: ApplicantDetailResult) {
    if (result.ok) {
      setApplicant(result.applicant);
      setError(null);
    } else {
      setApplicant(null);
      setError({
        message: result.message,
        notFound: result.notFound,
      });
    }
  }

  // Reload after a decision so the page shows the updated status
  async function loadApplicant() {
    applyResult(await fetchApplicantDetail(applicantId));
  }

  useEffect(() => {
    let cancelled = false;
    fetchApplicantDetail(applicantId).then((result) => {
      if (!cancelled) {
        applyResult(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [applicantId]);

  if (!applicant && !error) {
    return (
      <section className="py-10 text-center text-gray-500">Loading...</section>
    );
  }

  if (error?.notFound) {
    return (
      <section className="py-10 text-center text-gray-500">
        Applicant not found
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 text-center text-red-500">
        {error.message}
      </section>
    );
  }
  if (!applicant) {
    return null;
  }

  return (
    <>
      <Link
        href="/admin/applicants"
        className="group flex items-center gap-3 px-8 py-4 text-black transition-colors duration-200 hover:text-gray-600"
      >
        <ArrowLeft size={24} />
        <h3>Applicant Detail</h3>
      </Link>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-8 py-6">
        {/* TODO(natalie): Proof of residence is private and cannot be opened. */}

        <section className="w-full">
          <h2 className="mb-5">Personal Information</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            <Row label="First Name" value={applicant.firstName} />
            <Row label="Last Name" value={applicant.lastName} />
            <Row label="Age" value={applicant.age} />
            <Row label="Email" value={applicant.email} />
            <Row label="Cell Phone" value={applicant.cellPhone} />
            <Row
              label="Home Phone"
              value={applicant.homePhone}
              required={false}
            />
          </div>
          <div className="mt-10 max-w-sm">
            <Row label="Proof of Residence" value="Uploaded" />
          </div>
        </section>
        <section className="w-full">
          <h2 className="mb-5">Home Address</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
            <Row label="Street Address" value={applicant.street} />
            <Row label="City" value={applicant.city} />
            <Row label="State / Province / Region" value={applicant.state} />
            <Row label="ZIP / Postal Code" value={applicant.zip} />
          </div>
        </section>
        <section className="w-full">
          <h2 className="mb-5">Emergency Contact</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            <Row
              label="Emergency Contact Name"
              value={applicant.emergencyContactName}
            />
            <Row
              label="Emergency Contact Phone"
              value={applicant.emergencyContactPhone}
            />
            <Row
              label="Relationship to Volunteer"
              value={applicant.emergencyContactRelationship}
              required={false}
            />
          </div>
        </section>
        <section className="w-full">
          <h2 className="mb-5">All Volunteer Positions</h2>
          <div className="flex flex-col gap-4">
            <Row
              label="Position of Interest"
              value={applicant.positions
                .map((position) => position.name)
                .join(", ")}
            />
          </div>
        </section>

        <section className="w-full">
          <h2 className="mb-5">Time Available</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
            <Row
              label="Days of Week Available"
              value={applicant.availableDays
                .map((day) => day.charAt(0) + day.slice(1).toLowerCase())
                .join(", ")}
            />
            <Row
              label="Hours Available on Those Days"
              value={applicant.availableHours ?? ""}
            />
          </div>
        </section>
        <section className="w-full">
          <h2 className="mb-5">Disability</h2>
          <div className="flex flex-col gap-6">
            <Row
              label="Disability Report"
              value={
                applicant.hasDisability == null
                  ? ""
                  : applicant.hasDisability
                    ? "Yes, I have a disability."
                    : "No, I don't have a disability."
              }
            />
            {applicant.hasDisability === true && (
              <Row
                label="Disability Details"
                value={applicant.disabilityDetails}
                required={false}
              />
            )}
          </div>
        </section>
        <section className="w-full">
          <h2 className="mb-5">Volunteer Agreement</h2>
          <div className="flex flex-col gap-10">
            <Row
              label="Volunteer Waiver"
              value={applicant.waiverSignature ?? ""}
            />

            <Row
              label="Volunteer Agreement"
              value={applicant.agreementSignature ?? ""}
            />
            {applicant.age < 18 && (
              <>
                <Row
                  label="Parent/Legal Guardian E-Signature"
                  value={applicant.minorGuardianSignature}
                />
                <Row
                  label="Minor E-Signature"
                  value={applicant.minorSignature}
                />
              </>
            )}
          </div>
        </section>

        <section className="w-full mb-5">
          <ApplicantDecisionControls
            applicantId={applicant.id}
            status={applicant.status as "SUBMITTED" | "APPROVED" | "REJECTED"}
            onDecided={() => {
              loadApplicant();
            }}
          />
        </section>
      </section>
    </>
  );
}
