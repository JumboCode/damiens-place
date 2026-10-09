// TODO: FILE HEADER

// This line is needed because this component reacts to clicks
"use client";

import { useState } from "react";
// import your steps and StepProgress
import { steps } from "./steps";
import StepProgress from "./StepProgress";


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
        <StepProgress currentStep={currentStep} steps={steps} />

     <div className="flex flex-col gap-6">
        { currentStep } out of 6
        </div>

      {/* TODO: back and next buttons */}
      {/* use the isFirstStep and isLastStep booleans to determine if 
      a button appears, or if it needs to show "Submit" rather than
      Next! */}
    </div>
  );
}