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
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { steps } from "./steps";
import StepProgress from "./StepProgress";
import CommonButton from "@/components/common/CommonButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import Check from "@/assets/icons/check.svg";
import PersonalInfoStep from "@/components/application/PersonalInfoStep";
import { validatePersonalInfo, type PersonalInfoErrors } from "./personal-info";
import PositionsStep from "@/components/application/PositionsStep";
import {
  validatePositionsStep,
  type PositionsStepErrors,
} from "./positions-step";
import OnboardingStep from "@/components/application/OnboardingStep";
import { validateOnboarding, type OnboardingErrors } from "./onboarding";
import AppointmentStep from "@/components/application/AppointmentStep";
import {
  validateAppointmentStep,
  type AppointmentStepErrors,
} from "./appointment-step";
import ReviewStep from "@/components/application/ReviewStep";
import type { Position } from "./positions-step";
import {
  emptyApplicationFormState,
  isMinor,
  buildPersonalInfoPayload,
  buildPositionsPayload,
  buildOnboardingPayload,
  buildAppointmentPayload,
  buildReviewData,
  firstStepWithMissingFields,
  draftToFormState,
  firstIncompleteStep,
  type ApplicationFormState,
} from "@/components/application/application-state";
import {
  createApplicant,
  updateApplicant,
  submitApplicant,
  getDraft,
} from "@/lib/application-api";
import NavBar from "@/components/common/NavBar";

// DONE: add the imports you need
import { loadDraftId, saveDraftId, clearDraftId } from "@/lib/draft-storage";

// DONE: tryAgain, and startOver (clears the saved id and the error)

// DONE: in goNext, saveDraftId right after createApplicant succeeds
// TODO: while `resuming`, show only "Loading your saved application...". If `resumeError`, show it with two
//   CommonButtons: "Try again" and "Start a new application" (altStyle). Otherwise the form, as it is today.

export default function ApplicationFormShell() {
  const router = useRouter();
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

  const [appointmentErrors, setAppointmentErrors] =
    useState<AppointmentStepErrors>({});

  // The positions Step 2 loaded, used to show names on the review page
  const [positions, setPositions] = useState<Position[]>([]);

  // True after the applicant clicks an Edit button on Review, so Next goes straight back to Review
  const [returnToReview, setReturnToReview] = useState(false);

  // Set once the application is submitted (or the server says it already was)
  const [submitted, setSubmitted] = useState<{
    emailSent: boolean;
    alreadySubmitted: boolean;
  } | null>(null);

  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const savingRef = useRef(false);
  // True until we've checked for a saved draft
  const [resuming, setResuming] = useState(true);
  const [resumeError, setResumeError] = useState<string | null>(null);
  // Changing this runs the check again (the "Try again" button)
  const [resumeAttempt, setResumeAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function resume() {
      const savedId = loadDraftId();
      if (!savedId) {
        setResuming(false);
        return;
      }

      try {
        const result = await getDraft(savedId);

        if (cancelled) {
          return;
        }

        if (result.ok) {
          const restored = draftToFormState(result.data.applicant);
          setDraftId(savedId);
          setState(restored);
          setCurrentStep(firstIncompleteStep(restored));
        } else if (result.status === 404) {
          clearDraftId();
        } else {
          setResumeError("We couldn't load your saved application.");
        }
      } catch {
        if (!cancelled) {
          setResumeError("We couldn't load your saved application.");
        }
      } finally {
        if (!cancelled) {
          setResuming(false);
        }
      }
    }
    resume();

    return () => {
      cancelled = true;
    };
  }, [resumeAttempt]);

  /**
   * validateStep
   *
   * Validates one step with its validate function, saves that step's errors,
   * and returns true if there are none.
   *
   * Step 5 (Review) has nothing to check, so it returns true.
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

    if (step === 3) {
      const errors = validateAppointmentStep(state.appointment);
      setAppointmentErrors(errors);
      return Object.keys(errors).length === 0;
    }

    return true;
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function goBack() {
    if (returnToReview) {
      setReturnToReview(false);
      setCurrentStep(steps.length - 1);
      return;
    }

    setCurrentStep(currentStep - 1);
  }

  // Review's Edit buttons: jump to that step, and come straight back to Review after saving it
  function editStep(step: number) {
    setSaveError(null);
    setReturnToReview(true);
    setCurrentStep(step);
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
          saveDraftId(result.data.applicant.id);
        }
      } else if (currentStep >= 1 && currentStep <= 3) {
        if (draftId === null) {
          setSaveError(
            "Your application draft could not be found. Please go back and try again.",
          );
          return;
        }

        const payload =
          currentStep === 1
            ? buildPositionsPayload(state)
            : currentStep === 2
              ? buildOnboardingPayload(state)
              : buildAppointmentPayload(state);
        const result = await updateApplicant(draftId, payload);

        if (!result.ok) {
          setSaveError(result.error);
          return;
        }
      }

      if (returnToReview) {
        setReturnToReview(false);
        setCurrentStep(steps.length - 1);
      } else {
        setCurrentStep((step) => step + 1);
      }
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

  async function submit() {
    if (savingRef.current) {
      return;
    }

    if (draftId === null) {
      setSaveError(
        "Your application draft could not be found. Please go back and try again.",
      );
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      const result = await submitApplicant(draftId);

      if (result.ok) {
        setSubmitted({
          emailSent: result.data.emailSent,
          alreadySubmitted: false,
        });
        return;
      }

      if (result.status === 409) {
        setSubmitted({ emailSent: true, alreadySubmitted: true });
        return;
      }

      if (result.status === 422 && result.missingFields) {
        const step = firstStepWithMissingFields(result.missingFields);

        if (step !== null) {
          setReturnToReview(true);
          setCurrentStep(step);
          setSaveError(
            `Your application is missing some answers (${steps[step].label}). Please fill them in, then submit again.`,
          );
          return;
        }
      }

      setSaveError(result.error);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to submit your application.",
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  // TODO: while `resuming`, show only "Loading your saved application...". If `resumeError`, show it with two
  //   CommonButtons: "Try again" and "Start a new application" (altStyle). Otherwise the form, as it is today.
  if (resuming) {
    return <p>Loading your saved application...</p>;
  }
  if (resumeError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p role="alert">{resumeError}</p>
        <CommonButton onClick={startOver} title="Start a new application" />
        <CommonButton onClick={tryAgain} altStyle title="Try again" />
      </div>
    );
  }

  /**
   * tryAgain
   *
   * Triggers another attempt to load the applicant's saved draft.
   */
  function tryAgain() {
    setResumeAttempt((previous) => previous + 1);
  }

  /**
   * startOver
   *
   * Clears the saved draft ID and resets the application so the applicant can start a new application.
   */
  function startOver() {
    clearDraftId();
    setDraftId(null);
    setState(emptyApplicationFormState);
    setCurrentStep(0);
    setResumeError(null);
    setResuming(false);
  }

  return (
    <div>
      <NavBar />
      <div className="flex min-h-screen flex-col px-6 mb-10 md:px-12">
        <h1 className="text-center">Volunteer Application Form</h1>

        <div className="mt-6">
          <StepProgress currentStep={currentStep} />
        </div>

        <main className="mx-auto mt-6 w-full max-w-xl flex-1 px-4 py-6 md:max-w-5xl">
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
                <p className="text-error-msg" role="alert">
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
              onPositionsLoaded={setPositions}
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
          ) : currentStep === 3 ? (
            <AppointmentStep
              values={state.appointment}
              errors={appointmentErrors}
              onChange={(changes) =>
                setState((previous) => ({
                  ...previous,
                  appointment: { ...previous.appointment, ...changes },
                }))
              }
            />
          ) : (
            <ReviewStep
              data={buildReviewData(state, positions)}
              onEdit={editStep}
            />
          )}
        </main>

        <div className="mx-auto flex w-full max-w-lg flex-col items-end gap-2 pb-4 md:max-w-5xl">
          {saveError && (
            <p className="text-error-msg" role="alert">
              {saveError}
            </p>
          )}
          <div className="flex flex-row items-center gap-2 mt-10">
            {!isFirstStep ? (
              <CommonButton
                onClick={goBack}
                altStyle
                title="Back"
                disabled={saving}
              />
            ) : null}

            {isLastStep ? (
              <CommonButton
                onClick={submit}
                title={saving ? "Submitting..." : "Submit"}
                disabled={saving}
              />
            ) : (
              <CommonButton
                onClick={goNext}
                title={saving ? "Saving..." : "Next"}
                disabled={saving}
              />
            )}
          </div>
        </div>

        {submitted && (
          <ConfirmModal
            title={
              submitted.alreadySubmitted
                ? "You're already registered!"
                : "You're registered!"
            }
            content={
              <>
                <p>
                  You will receive a message from staff in your inbox to
                  schedule onboarding.
                </p>
                {!submitted.emailSent && (
                  <p className="mt-2 font-medium text-error-msg">
                    We couldn&apos;t send the confirmation email, but your
                    application was received. You don&apos;t need to submit
                    again.
                  </p>
                )}
              </>
            }
            confirmTitle="Close"
            icon={
              <Image
                src={Check}
                alt="Check"
                className="mx-auto h-auto w-1/3 object-contain"
              />
            }
            onConfirm={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
}
