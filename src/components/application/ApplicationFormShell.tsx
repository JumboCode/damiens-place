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
    <div className="flex flex-col gap-6">
      <Image
        src={logo}
        alt="Damien's Place Logo"
        className="mx-auto mb-2 h-auto w-20"
        priority
      />
      <StepProgress currentStep={currentStep} />

      {!isFirstStep && <button onClick={goBack}>Back</button>}

      {isLastStep ? (
        <button>Submit</button>
      ) : (
        <button onClick={goNext}>
          Next
        </button>
      )}
    </div>
  );
}
