// TODO: FILE HEADER
// This line is needed because the page remembers what you type
"use client";
 
import { useState } from "react";
import CommonButton from "@/components/common/CommonButton";
import {
  emptyOnboarding,
  validateOnboarding,
} from "@/components/application/onboarding";
import type {
  OnboardingErrors,
  OnboardingValues,
} from "@/components/application/onboarding";
// TODO: import OnboardingStep
 
export default function Step3TestPage() {
  const [values, setValues] = useState<OnboardingValues>(emptyOnboarding);
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const [isMinor, setIsMinor] = useState(false);
 
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      {/* TODO: drop in <OnboardingStep /> here. Pass values, errors, and isMinor.
          For onChange, merge the changes into the old values:
          (changes) => setValues((current) => ({ ...current, ...changes })) */}
 
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isMinor}
          onChange={(event) => setIsMinor(event.target.checked)}
        />
        Applicant is under 18
      </label>
 
      <CommonButton
        title="Validate"
        onClick={() => setErrors(validateOnboarding(values, isMinor))}
      />
 
      {/* Shows what the page is holding, so you can check it as you type */}
      <pre className="rounded-md bg-gray-100 p-4 text-sm">
        {JSON.stringify(values, null, 2)}
      </pre>
    </main>
  );
}