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
      <StepProgress currentStep={currentStep} />
      <div className="flex flex-col gap-6">{currentStep + 1} out of 6</div>
   
      {/* use the isFirstStep and isLastStep booleans to determine if 
      a button appears, or if it needs to show "Submit" rather than
      Next! */}


      
      {/* {isFirstStep && <button onClick={goBack} disabled={isFirstStep}>Back</button>}
      
        {isLastStep ? (
          
          <button onClick={goNext} disabled={isLastStep}>
            Next
          </button>
        ) : (
          <button onClick={goNext} disabled={currentStep !== steps.length - 1}>
            Submit
          </button>
        )} */}


       <button onClick={goBack} disabled={isFirstStep}>
        Back
      </button>

      

      <button onClick={goNext} disabled={isLastStep}>
        Next
      </button>
    
      <button onClick={goNext} disabled={currentStep !== steps.length - 1}>
        Submit
      </button> 

    </div>
  );
}
