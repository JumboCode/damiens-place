
/**
 * step-3-test/page.tsx
 *
 * Temporary test page for the OnboardingStep component.
 * Tests form values, validation, and the minor release section.
 *
 * Author: Adrien and Luisa
 * Date Created: 10/27/2026
 */

"use client";

import { useState } from "react";
import CommonButton from "@/components/common/CommonButton";
import OnboardingStep from "@/components/application/OnboardingStep";
import {
  emptyOnboarding,
  validateOnboarding,
} from "@/components/application/onboarding";
import type {
  OnboardingErrors,
  OnboardingValues,
} from "@/components/application/onboarding";

export default function Step3TestPage() {
  // Store the current onboarding form values
  const [values, setValues] = useState<OnboardingValues>(emptyOnboarding);

  // Store validation errors
  const [errors, setErrors] = useState<OnboardingErrors>({});

  // Determine whether to show the minor release section
  const [isMinor, setIsMinor] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8"> 
      {/* Display the onboarding form and update only changed fields */}
      <OnboardingStep
        values={values}
        errors={errors}
        isMinor={isMinor}
        onChange={(changes) =>
          setValues((current) => ({ ...current, ...changes }))
        }
      />

      {/* Toggle the minor release section */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isMinor}
          onChange={(event) => setIsMinor(event.target.checked)}
        />
        Applicant is under 18
      </label>

      {/* Validate the form and display any errors */}
      <CommonButton
        title="Validate"
        onClick={() => setErrors(validateOnboarding(values, isMinor))}
      />
    </main>
  );
}
