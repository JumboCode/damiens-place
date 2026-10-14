/**
 * StepProgress.tsx
 *
 * Progress bar and current step for phone and computer version.
 *
 * Author: Luisa and Jeremiah
 * Date Created: 10/09/2026
 */

import { steps } from "./steps";

// "Props" are the info this component gets from whoever uses it.
// Here, it just needs to know which step we're on (0 = first step).
type StepProgressProps = {
  currentStep: number;
};

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <nav aria-label="Application progress" className="px-4">
      {/* max-w-{blank} controls spread of bubbles */}
      <ol className="flex mx-auto max-w-lg items-center md:max-w-5xl">
        {steps.map((step, index) => (
          <li
            key={step.id}
            aria-label={step.label}
            aria-current={index === currentStep ? "step" : undefined}
            className="flex flex-1 items-center last:flex-none"
          >
            {/* Step indicator */}
            <div
              className={
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white " +
                (index <= currentStep
                  ? "bg-primary"
                  : index === currentStep + 1
                    ? "bg-gray-400"
                    : "bg-gray-300")
              }
            >
              {index + 1}
            </div>

            {/* Progress line */}
            {index < steps.length - 1 && (
              <div
                className={
                  "h-1 flex-1 " +
                  (index < currentStep ? "bg-primary" : "bg-gray-300")
                }
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
