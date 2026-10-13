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
  // calculate how full the bar should be and save it in a const percent var
  const percent = ((currentStep + 1) / 6) * 100;

  return (
    <nav aria-label="Application progress">
      {/*phone version */}

      <div className="md:hidden px-4 mt-8">
        <ol className="flex items-center">
          {steps.map((step, index) => (
            <li
              key={step.id}
              aria-label={step.label}
              aria-current={index === currentStep ? "step" : undefined}
              className="flex flex-1 items-center last:flex-none"
            >
              <div
                className={
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white " +
                  (index <= currentStep
                    ? "bg-primary"
                    : index === currentStep + 1
                      ? "bg-gray-400"
                      : "bg-gray-300")
                }
              >
                {index + 1}
              </div>

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
      </div>

      {/*computer version*/}
      <ol className="hidden md:flex justify-between gap-4 px-8 mt-8">
        {steps.map((step, index) => (
          <li
            key={step.id}
            aria-current={index === currentStep ? "step" : undefined}
            className={
              index === currentStep
                ? "font-bold text-primary"
                : index < currentStep
                  ? "text-foreground"
                  : "text-gray-400"
            }
          >
            <div>{index + 1}</div>
            <div>{step.label}</div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
