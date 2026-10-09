/**
 * StepProgress.tsx
 *
 * <1-3 sentences: what this file does and why it exists.>
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
    const percent = (currentStep/6)
  
    return (
      <nav aria-label="Application progress">

        <div className="md:hidden">  
           
           <text >
                { currentStep } of 6
           </text>
           
        </div> 
        {/* TODO (phone): a <div> that's hidden on medium screens and up
            ("md:hidden"). Inside: "Step X of Y" text, and a gray bar with a
            bg-primary fill whose width comes from `percent` (use style={{ }}). */}

        <ol className="hidden md:flex">

                 <text >
                { currentStep } of 6
           </text>
            
        </ol>



        
        {/* TODO (computer): an <ol> that's hidden on phones and a row on medium
            screens and up ("hidden md:flex"). .map() over `steps` to make an <li>
            per step, like "2. Positions". Style each one as done, current (bold),
            or upcoming (gray), and set aria-current="step" on the current one only. */}
      </nav>
    );
  }