// TODO: FILE HEADER

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
    <div className="flex min-h-[100dvh] flex-col gap-6">
      <Image
        src={logo}
        alt="Damien's Place Logo"
        className="mx-auto mb-2 h-auto w-20"
        priority
      />
      <StepProgress currentStep={currentStep} />
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">
          Part {currentStep + 1}: {steps[currentStep].label}
        </h2>

        <p>Content goes here</p>
      </div>

      <div className="mt-auto flex justify-end gap-2 pb-4 pr-12">
        <button
          onClick={goBack}
          disabled={isFirstStep}
          className="rounded-full border border-primary px-8 py-2 text-primary disabled:opacity-0"
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
  );
}
