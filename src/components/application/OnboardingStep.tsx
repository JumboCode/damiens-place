/**
 * OnboardingStep.tsx
 *
 * Displays the volunteer handbook, waiver, agreement, and minor release.
 * Uses controlled inputs to track acceptance and e-signatures.
 *
 * Author: Adrien and Luisa
 * Date Created: 10/27/2026
 */

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

// Information passed from the parent component
type OnboardingStepProps = {
  values: OnboardingValues;
  errors: OnboardingErrors;
  // Update only the fields that changed
  onChange: (changes: Partial<OnboardingValues>) => void;
  // Whether the applicant is under 18
  isMinor: boolean;
};

export default function OnboardingStep({
  values,
  errors,
  onChange,
  isMinor,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-10 text-base leading-relaxed">
      <h2>Part 3: Onboarding Materials</h2>

      {/* Display the handbook instructions and embedded PDF */}
      <section className="flex flex-col gap-4">
        <h3 className="text-2xl font-semibold">{HANDBOOK_TITLE}</h3>

        <p>{HANDBOOK_INSTRUCTIONS}</p>

        <PdfViewer src="/documents/handbook.pdf" title={HANDBOOK_TITLE} />
      </section>

      {/* Volunteer waiver and agreement sections */}
      <section className="flex flex-col gap-6">
        <h3>Volunteer Agreement</h3>

        {/* Volunteer Waiver */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-semibold">
            Volunteer Waiver <span className="text-error-msg">*</span>
          </h4>

          {/* Display waiver statements as a numbered list */}
          <ol className="list-decimal space-y-2 pl-6">
            {WAIVER_ITEMS.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>

          {/* Controlled checkbox for accepting the waiver */}
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={values.waiverAccepted}
              onChange={(event) =>
                onChange({ waiverAccepted: event.target.checked })
              }
            />
            <span>
              I have read, understand, and agree with Damien&apos;s Food
              Pantry&apos;s volunteer waiver.
            </span>
          </label>

          {/* Show an error if the waiver has not been accepted */}
          {errors.waiverAccepted && (
            <p className="text-error-msg">{errors.waiverAccepted}</p>
          )}

          {/* Save the typed legal name as the waiver signature */}
          <FormField
            label="E-Signature"
            name="waiverSignature"
            value={values.waiverSignature}
            onChange={(newText) => onChange({ waiverSignature: newText })}
            error={errors.waiverSignature}
            required
          />

          <p className="text-sm text-gray-500">
            Type your full legal name here to confirm.
          </p>
        </div>

        {/* Volunteer Agreement */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-semibold">
            Volunteer Agreement <span className="text-error-msg">*</span>
          </h4>

          {/* Display paragraphs and lists in their original order */}
          {AGREEMENT_BLOCKS.map((block, index) =>
            block.type === "paragraph" ? (
              <p key={index}>{block.text}</p>
            ) : (
              <ul
                key={index}
                className={`space-y-2 pl-6 ${
                  block.items[0]?.startsWith("1.") ? "list-none" : "list-disc"
                }`}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            ),
          )}

          {/* Controlled checkbox for accepting the agreement */}
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={values.agreementAccepted}
              onChange={(event) =>
                onChange({ agreementAccepted: event.target.checked })
              }
            />
            <span>
              I have read, understand, and agree with Damien&apos;s Food Pantry
              policy. As a volunteer, I do not expect to be compensated.
            </span>
          </label>

          {/* Show an error if the agreement has not been accepted */}
          {errors.agreementAccepted && (
            <p className="text-error-msg">{errors.agreementAccepted}</p>
          )}

          {/* Save the typed legal name as the agreement signature */}
          <FormField
            label="E-Signature"
            name="agreementSignature"
            value={values.agreementSignature}
            onChange={(newText) => onChange({ agreementSignature: newText })}
            error={errors.agreementSignature}
            required
          />

          {/* Instructions for signing the agreement */}
          <p className="text-sm text-gray-500">
            Type your full legal name here to confirm.
          </p>
        </div>
      </section>

      {/* Only show the minor release if the applicant is under 18 */}
      {isMinor && (
        <section className="flex flex-col gap-6">
          <h3 className="text-2xl font-semibold">
            Volunteer Release Form for Minors
          </h3>

          {/* Instructions and release text */}
          <p>Sign ONLY if the volunteer is less than 18 years old.</p>
          <p>{MINORS_RELEASE_TEXT}</p>

          {/* Checkbox for accepting the minor release */}
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={values.minorReleaseAccepted}
              onChange={(event) =>
                onChange({ minorReleaseAccepted: event.target.checked })
              }
            />
            <span>
              I have read, understand, and agree with Damien&apos;s Food
              Pantry&apos;s policy on minor volunteers.
            </span>
          </label>

          {/* Show an error if the release has not been accepted */}
          {errors.minorReleaseAccepted && (
            <p className="text-error-msg">{errors.minorReleaseAccepted}</p>
          )}

          {/* Parent or guardian signature */}
          <div className="flex flex-col gap-2">
            <FormField
              label="Parent/Legal Guardian E-Signature"
              name="minorGuardianSignature"
              value={values.minorGuardianSignature}
              onChange={(newText) =>
                onChange({ minorGuardianSignature: newText })
              }
              error={errors.minorGuardianSignature}
              required
            />
            <p className="text-sm text-gray-500">
              Type your full legal name here to confirm.
            </p>
          </div>

          {/* Minor's signature */}
          <div className="flex flex-col gap-2">
            <FormField
              label="Minor E-Signature"
              name="minorSignature"
              value={values.minorSignature}
              onChange={(newText) => onChange({ minorSignature: newText })}
              error={errors.minorSignature}
              required
            />
            <p className="text-sm text-gray-500">
              Type the volunteer&apos;s full legal name here to confirm.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
