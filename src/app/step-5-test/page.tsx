"use client";

import { useState } from "react";
import ReviewStep from "@/components/application/ReviewStep";
import type { ReviewData } from "@/components/application/review-step";

const sampleData: ReviewData = {
  firstName: "Jane",
  lastName: "Doe",
  age: "34",
  email: "jane@example.com",
  cellPhone: "6175550123",
  homePhone: "",
  street: "1 Main St",
  city: "Medford",
  state: "MA",
  zip: "02155",
  emergencyContactName: "John Doe",
  emergencyContactPhone: "6175550124",
  emergencyContactRelationship: "",
  proofUploaded: true,
  positionNames: ["Guest Intake", "Translator"],
  availableDays: ["Monday", "Wednesday"],
  availableHours: "Mornings, 9am to noon",
  hasDisability: true,
  disabilityDetails: "Needs a chair",
  waiverSignature: "Jane Doe",
  agreementSignature: "Jane Doe",
  isMinor: false,
  minorGuardianSignature: "John Doe",
  minorSignature: "Janie Doe",
  onboardingAvailability: "Weekday afternoons work best.",
};

export default function Step5TestPage() {
  const [data, setData] = useState<ReviewData>(sampleData);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
      {/* Display the review page */}
      <ReviewStep data={data} onEdit={(step) => alert(`Edit step ${step}`)} />

      {/* Toggle whether the applicant is a minor */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.isMinor}
          onChange={(event) =>
            setData((current) => ({
              ...current,
              isMinor: event.target.checked,
            }))
          }
        />
        Applicant is a minor
      </label>

      {/* Clear optional answers to test empty fields */}
      <button
        type="button"
        className="w-fit rounded-md bg-primary px-4 py-2 text-white"
        onClick={() =>
          setData((current) => ({
            ...current,
            homePhone: "",
            emergencyContactRelationship: "",
            positionNames: [],
            availableDays: [],
            availableHours: "",
            hasDisability: null,
            disabilityDetails: "",
            onboardingAvailability: "",
          }))
        }
      >
        Clear optional answers
      </button>
    </main>
  );
}
