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


export default function ApplicationFormShell() {
  // useState = a box that remembers a value. 0 means the first step.
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function goBack() {
    setCurrentStep(currentStep - 1);
  }

  function goNext() {
    setCurrentStep(currentStep + 1);
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

      <main className="flex-1 py-6"> {/* placeholder */} </main>

      <div className="mx-auto flex w-full max-w-lg justify-end gap-2 pb-4 md:max-w-5xl">
        <button
          onClick={goBack}
          disabled={isFirstStep}
          className="rounded-full border border-primary px-8 py-2 text-primary disabled:opacity-0 flex"
        >
          Back
        </button>

        {isLastStep ? (
          <button
            type="button"
            className="rounded-full bg-primary px-8 py-2 text-white"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={goNext}
            className="rounded-full bg-primary px-8 py-2 text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
