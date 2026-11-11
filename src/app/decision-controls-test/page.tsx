/**
 * page.tsx
 *
 * tests the controls and decision flow
 *
 * Author: Abby, Alex
 * Date Created: 11/06/26
 */
"use client";

import { useState } from "react";
import ApplicantDecisionControls from "@/components/admin/ApplicantDecisionControls";
import type { DecisionStatus } from "@/components/admin/ApplicantDecisionControls";

const TEST_APPLICANTS = [
  { id: "test-applicant-five", note: "approve works" },
  { id: "test-applicant-six", note: "reject works" },
  { id: "test-applicant-seven", note: "approve fails after Five (409)" },
  { id: "test-applicant-three", note: "already rejected on the server (409)" },
  { id: "nope", note: "doesn't exist (404)" },
];

const STATUSES: DecisionStatus[] = ["SUBMITTED", "APPROVED", "REJECTED"];

export default function DecisionControlsTestPage() {
  const [applicantId, setApplicantId] = useState(TEST_APPLICANTS[0].id);
  const [status, setStatus] = useState<DecisionStatus>("SUBMITTED");
  const [lastDecided, setLastDecided] = useState("nothing yet");

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <section className="flex flex-col gap-3 rounded-lg border p-4">
        <h1 className="text-xl font-bold">Decision controls test</h1>
        <p>Sign in at /admin/sign-in as the admin first.</p>
        <label className="flex flex-col gap-1">
          Applicant
          <select
            className="rounded border p-1"
            value={applicantId}
            onChange={(e) => setApplicantId(e.target.value)}
          >
            {TEST_APPLICANTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id}: {a.note}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Status the page loaded with
          <select
            className="rounded border p-1"
            value={status}
            onChange={(e) => setStatus(e.target.value as DecisionStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <p>onDecided was last called with: {lastDecided}</p>
      </section>

      {/* The key makes it start fresh whenever you change a choice above */}
      <ApplicantDecisionControls
        key={`${applicantId}-${status}`}
        applicantId={applicantId}
        status={status}
        onDecided={setLastDecided}
      />
    </main>
  );
}
