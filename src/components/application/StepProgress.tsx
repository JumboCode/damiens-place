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
      <div className="md:hidden">
        <text>{currentStep + 1} of 6</text>
        {/*gray progress bar */}
        <div className="h-2 w-full rounded-full bg-gray-300">
          {/*filled up part of progress bar */}
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: percent + "%" }}
          />
        </div>
      </div>

      {/*computer version*/}
      <ol className="hidden md:flex justify-between">
        {steps.map((step, index) => (
          <li
            key={step.id}
            aria-current={index == currentStep ? "step" : undefined}
            className={
              index == currentStep
                ? "font-bold text-primary"
                : index < currentStep
                  ? "text-foreground"
                  : "text-gray-300"
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
