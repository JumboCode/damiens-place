/**
 * ApplicationFormShell.tsx
 *
 * Displays the volunteer application with a progress indicator,
 * placeholder content, and navigation buttons.
 *
 * Author: Luisa and Jeremiah
 * Date Created: 10/09/2026
 */

// This line is needed because this component reacts to clicks
"use client";

import Image from "next/image";
import { useState } from "react";
import { steps } from "./steps";
import StepProgress from "./StepProgress";
import logo from "@/assets/images/logo.png";
import CommonButton from "@/components/common/CommonButton";
import PersonalInfoStep from "@/components/application/PersonalInfoStep";
import { PersonalInfoValues, PersonalInfoErrors } from "./personal-info";
import PositionsStep from "@/components/application/PositionsStep";
import { PositionsStepValues, PositionsStepErrors } from "./positions-step";
import OnboardingStep from "@/components/application/OnboardingStep";
import { OnboardingValues, OnboardingErrors } from "./onboarding";
// import application-state
import { createApplicant, updateApplicant } from "@/lib/application-api";


export default function ApplicationFormShell() {
 
  // useState = a box that remembers a value. 0 means the first step.
  const [currentStep, setCurrentStep] = useState(0);
  // const [state, setState] = useState<ApplicationFormState>(
  //   emptyApplicationFormState,
  // );
  
  const [personalInfoErrors, setPersonalInfoErrors] = useState<PersonalInfoErrors>({});
  const [positionsErrors, setPositionsErrors] = useState<PositionsStepErrors>({});
  const [onboardingErrors, setOnboardingErrors] = useState<OnboardingErrors>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);

  // TODO: function contract
  // Validates one step with its validate function, saves that step's errors, and returns true if there are none.
  // Steps 4 and 5 have nothing to check yet, so they return true.
  // TODO: for Step 1, also require state.proofOfResidenceUrl. If it's empty, set proofError to a message like
  //   "Please upload your proof of residence." and return false. Clear proofError once it's there.
  function validateStep(step: number): boolean {
    // TODO
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function goBack() {
    setCurrentStep(currentStep - 1);
  }

    // TODO: do nothing if already saving (this stops a double-click from creating two drafts) or if validateStep fails.
    // TODO: save the current step. Step 1: createApplicant the first time (remember the returned id in draftId),
    //   updateApplicant after that. Steps 2 and 3: updateApplicant. Steps 4 and 5: nothing to save yet.
    // TODO: if the save fails, stay on this step and show the error message (saveError). Otherwise move to the next step.
    //   Make sure `saving` goes back to false either way.
  
  function goNext() {
    setCurrentStep(currentStep + 1);
  }

   // TODO: in the middle box, show the real step for Steps 1 to 3 and keep the placeholder for 4 and 5.
  //   PersonalInfoStep's onChange gives you one field and value, so update only that field of state.personalInfo.
  //   Its onProofUploaded gives you the file's URL: save it as state.proofOfResidenceUrl (and clear proofError).
  //   PositionsStep and OnboardingStep give you `changes`, so merge them into state.positions / state.onboarding.
  //   OnboardingStep also needs isMinor={isMinor(state)}.
  // TODO: disable Next and show "Saving..." while saving, and show saveError near the buttons.
  //   On Step 1, show proofError (in the error red) right under the form.


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
        <div className="flex h-full min-h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400">
          {steps[currentStep].label}
        </div>
      </main>

      <div className="mx-auto flex w-full max-w-lg justify-end gap-2 pb-4 md:max-w-5xl">
        {!isFirstStep ? (
          <CommonButton onClick={goBack} altStyle title="Back" />
        ) : null}

        {isLastStep ? (
          <CommonButton type="button" title="Submit" />
        ) : (
          <CommonButton onClick={goNext} title="Next" />
        )}
      </div>
    </div>
  );
}
