/**
 * step-3-test/page.tsx
 *
 * Temporary test page for OnboardingStep. Deleted when the PR is merged.
 */
// This line is needed because the page reacts to typing
"use client";

import FormField from "./FormField";
import PdfViewer from "./PdfViewer";
import type { OnboardingErrors, OnboardingValues } from "./onboarding";
import {
  AGREEMENT_BLOCKS,
  HANDBOOK_INSTRUCTIONS,
  HANDBOOK_TITLE,
  MINORS_RELEASE_TEXT,
  WAIVER_ITEMS,
} from "./agreement-text";

type OnboardingStepProps = {
  values: OnboardingValues;
  errors: OnboardingErrors;
  // Pass only the fields that changed
  onChange: (changes: Partial<OnboardingValues>) => void;
  // True when the applicant is under 18
  isMinor: boolean;
};

export default function OnboardingStep({
  values,
  errors,
  onChange,
  isMinor,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-10">
      <h2>Part 3: Onboarding Materials</h2>

      <section className="flex flex-col gap-4">
        {/* TODO: the handbook title and instructions, then <PdfViewer src="/documents/handbook.pdf" ... /> */}
      </section>

      <section className="flex flex-col gap-6">
        <h3>Volunteer Agreement</h3>
        {/* TODO: "Volunteer Waiver" with a red *, the numbered WAIVER_ITEMS (use a real <ol>),
            then the checkbox with its label from the Figma. Checking it calls
            onChange({ waiverAccepted: event.target.checked }), and show errors.waiverAccepted under it.
            Then the E-Signature input (a FormField). Label and helper text from the Figma.
            Typing calls onChange({ waiverSignature: newText }).
            Show errors.waiverSignature under the input. */}
        {/* TODO: "Volunteer Agreement" with a red *, the AGREEMENT_BLOCKS (paragraphs as <p>, lists as <ul>),
            then the checkbox and the E-Signature input. Same idea, with agreementAccepted
            and agreementSignature. */}
      </section>

      {/* TODO: only when isMinor is true, show the "Volunteer Release Form for Minors" section:
            - the heading and instructions from the Figma, then MINORS_RELEASE_TEXT
            - the checkbox (minorReleaseAccepted)
            - the Parent/Legal Guardian E-Signature input (minorGuardianSignature)
            - the Minor E-Signature input (minorSignature)
            Show each field's error under it. */}
    </div>
  );
}
