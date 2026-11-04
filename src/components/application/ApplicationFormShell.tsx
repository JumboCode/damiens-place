/**
 * ApplicationFormShell.tsx
 *
 * Displays the volunteer application with a progress indicator,
 * placeholder content, and navigation buttons. Holds every answer in one state
 * object and saves each step to the API when the user clicks Next.
 *
 * Author: Luisa, Jeremiah, Elijah
 * Date Created: 10/09/2026
 */

// This line is needed because this component reacts to clicks
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { steps } from "./steps";
import StepProgress from "./StepProgress";
import logo from "@/assets/images/logo.png";
import CommonButton from "@/components/common/CommonButton";
import PersonalInfoStep from "@/components/application/PersonalInfoStep";
import {
  validatePersonalInfo,
  type PersonalInfoErrors,
} from "./personal-info";
import PositionsStep from "@/components/application/PositionsStep";
import {
  validatePositionsStep,
  type PositionsStepErrors,
} from "./positions-step";
import OnboardingStep from "@/components/application/OnboardingStep";
import {
  validateOnboarding,
  type OnboardingErrors,
} from "./onboarding";
import {
  emptyApplicationFormState,
  isMinor,
  buildPersonalInfoPayload,
  buildPositionsPayload,
  buildOnboardingPayload,
  type ApplicationFormState,
} from "@/components/application/application-state";
import {
  createApplicant,
  updateApplicant,
} from "@/lib/application-api";

export default function ApplicationFormShell() {
  // useState = a box that remembers a value. 0 means the first step.
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<ApplicationFormState>(
    emptyApplicationFormState,
  );

  const [personalInfoErrors, setPersonalInfoErrors] =
    useState<PersonalInfoErrors>({});

  const [positionsErrors, setPositionsErrors] = useState<PositionsStepErrors>(
    {},
  );

  const [onboardingErrors, setOnboardingErrors] = useState<OnboardingErrors>(
    {},
  );

  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const savingRef = useRef(false);

  /**
   * validateStep
   *
   * Validates one step with its validate function, saves that step's errors,
   * and returns true if there are none.
   *
   * Steps 4 and 5 have nothing to check yet, so they return true.
   *
   * @param step - The step number to validate.
   * @returns An object containing error messages for invalid fields, or an empty object if all fields are valid.
   */
  function validateStep(step: number): boolean {
    if (step === 0) {
      const errors = validatePersonalInfo(state.personalInfo);
      setPersonalInfoErrors(errors);

      const proofMissing = !state.proofOfResidenceUrl;

      setProofError(
        proofMissing ? "Please upload your proof of residence." : null,
      );

      return Object.keys(errors).length === 0 && !proofMissing;
    }

    if (step === 1) {
      const errors = validatePositionsStep(state.positions);
      setPositionsErrors(errors);
      return Object.keys(errors).length === 0;
    }

    if (step === 2) {
      const errors = validateOnboarding(state.onboarding, isMinor(state));
      setOnboardingErrors(errors);
      return Object.keys(errors).length === 0;
    }

    return true;
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function goBack() {
    setCurrentStep(currentStep - 1);
  }

  async function goNext() {
    if (savingRef.current || !validateStep(currentStep)) {
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      if (currentStep === 0) {
        const payload = buildPersonalInfoPayload(state);
        const result =
          draftId === null
            ? await createApplicant(payload)
            : await updateApplicant(draftId, payload);

        if (!result.ok) {
          setSaveError(result.error);
          return;
        }

        if (draftId === null) {
          setDraftId(result.data.applicant.id);
        }
      } else if (currentStep === 1 || currentStep === 2) {
        if (draftId === null) {
          setSaveError(
            "Your application draft could not be found. Please go back and try again.",
          );
          return;
        }

        const payload =
          currentStep === 1
            ? buildPositionsPayload(state)
            : buildOnboardingPayload(state);
        const result = await updateApplicant(draftId, payload);

        if (!result.ok) {
          setSaveError(result.error);
          return;
        }
      }

      setCurrentStep((step) => step + 1);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save your application.",
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col px-6 md:px-12">
      <div className="flex justify-end pt-2">
        <Image
          src={logo}
          alt="Damien's Place Logo"
          className="h-10 w-auto object-contain"
          priority
        />
      </div>

      <h1 className="mt-5 text-center text-base text-black font-bold text-xl">
        Volunteer Application Form
      </h1>

      <div className="mt-6">
        <StepProgress currentStep={currentStep} />
      </div>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 md:max-w-3xl">
        {currentStep === 0 ? (
          <div className="space-y-2">
            <PersonalInfoStep
              values={state.personalInfo}
              errors={personalInfoErrors}
              onChange={(field, value) =>
                setState((previous) => ({
                  ...previous,
                  personalInfo: {
                    ...previous.personalInfo,
                    [field]: value,
                  },
                }))
              }
              onProofUploaded={(url) => {
                setState((previous) => ({
                  ...previous,
                  proofOfResidenceUrl: url,
                }));
                setProofError(null);
              }}
            />
            {proofError && (
              <p className="text-sm text-error-msg" role="alert">
                {proofError}
              </p>
            )}
          </div>
        ) : currentStep === 1 ? (
          <PositionsStep
            values={state.positions}
            errors={positionsErrors}
            onChange={(changes) =>
              setState((previous) => ({
                ...previous,
                positions: { ...previous.positions, ...changes },
              }))
            }
          />
        ) : currentStep === 2 ? (
          <OnboardingStep
            values={state.onboarding}
            errors={onboardingErrors}
            onChange={(changes) =>
              setState((previous) => ({
                ...previous,
                onboarding: { ...previous.onboarding, ...changes },
              }))
            }
            isMinor={isMinor(state)}
          />
        ) : (
          <div className="flex h-full min-h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400">
            {steps[currentStep].label}
          </div>
        )}
      </main>

      <div className="mx-auto flex w-full max-w-lg flex-col items-end gap-2 pb-4 md:max-w-5xl">
        {saveError && (
          <p className="text-sm text-error-msg" role="alert">
            {saveError}
          </p>
        )}
        {!isFirstStep ? (
          <CommonButton
            onClick={goBack}
            altStyle
            title="Back"
            disabled={saving}
          />
        ) : null}

        {isLastStep ? (
          <CommonButton type="button" title="Submit" />
        ) : (
          <CommonButton
            onClick={goNext}
            title={saving ? "Saving..." : "Next"}
            disabled={saving}
          />
        )}
      </div>
    </div>
  );
}
