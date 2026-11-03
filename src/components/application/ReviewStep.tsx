/**
 * ReviewStep.tsx
 *
 * Displays the applicant's answers in four sections:
 * Personal Information, Positions, Materials, and Appointment.
 *
 * Author: Adrien and Luisa
 * Date Created: 11/03/2026
 */

import ReviewSection from "./ReviewSection";
import { REVIEW_EDIT_STEPS } from "./review-step";
import type { ReviewData } from "./review-step";

type ReviewStepProps = {
  data: ReviewData;
  // Called with the step number to go back to
  onEdit: (step: number) => void;
};

/**
 * Row
 *
 * Displays a label and its corresponding answer on the review page.
 * Shows a dash when the answer is empty and a red asterisk for required fields.
 *
 * @param label - The label describing the applicant's answer.
 * @param value - The applicant's answer as a string, which may be empty.
 * @param required - Whether to display a red asterisk, defaults to true.
 * @returns A label and answer pair, displaying "—" for empty answers.
 */
function Row({
  label,
  value,
  required = true,
}: {
  label: string;
  value: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-base font-medium">
        {label} {required && <span className="text-error-msg">*</span>}
      </dt>
      <dd className="text-base">{value.trim() || "—"}</dd>
    </div>
  );
}

/**
 * ReviewStep
 *
 * Displays the applicant's answers in the four sections and allows them
 * to return to a section by clicking its Edit button.
 *
 * @param data - The applicant's information to display on the review page.
 * @param onEdit - Function called with the step number when Edit is clicked.
 * @returns The review page containing all four sections and their answers.
 */
export default function ReviewStep({ data, onEdit }: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Page heading from Figma */}
      <h2 className="text-2xl font-semibold">Part 5: Review</h2>

      {/* Personal Information section */}
      <ReviewSection
        title="Personal Information"
        onEdit={() => onEdit(REVIEW_EDIT_STEPS.personalInfo)}
      >
        {/* Personal information */}
        <Row label="First Name" value={data.firstName} />
        <Row label="Last Name" value={data.lastName} />
        <Row label="Age" value={data.age} />
        <Row label="Email" value={data.email} />
        <Row label="Cell Phone" value={data.cellPhone} />
        <Row label="Home Phone" value={data.homePhone} required={false} />

        {/* Proof of residence */}
        <div className="col-span-full mt-4 flex flex-col gap-2">
          <h4 className="text-base font-medium">
            Proof of Residence <span className="text-error-msg">*</span>
          </h4>
          <p>{data.proofUploaded ? "Uploaded" : "—"}</p>
        </div>

        {/* Home address */}
        <h4 className="col-span-full mt-4 text-lg font-semibold">
          Home Address
        </h4>
        <Row label="Street Address" value={data.street} />
        <Row label="City" value={data.city} />
        <Row label="State / Province / Region" value={data.state} />
        <Row label="ZIP / Postal Code" value={data.zip} />

        {/* Emergency contact */}
        <h4 className="col-span-full mt-4 text-lg font-semibold">
          Emergency Contact
        </h4>
        <Row label="Emergency Contact Name" value={data.emergencyContactName} />
        <Row
          label="Emergency Contact Phone"
          value={data.emergencyContactPhone}
        />
        <Row
          label="Relationship to Volunteer"
          value={data.emergencyContactRelationship}
          required={false}
        />
      </ReviewSection>

      {/* Positions section */}
      <ReviewSection
        title="Positions"
        onEdit={() => onEdit(REVIEW_EDIT_STEPS.positions)}
      >
        {/* Selected positions and availability */}
        <Row
          label="Volunteer Positions"
          value={data.positionNames.join(", ")}
        />
        <Row label="Available Days" value={data.availableDays.join(", ")} />
        <Row label="Available Hours" value={data.availableHours} />

        {/* Disability answer and additional details */}
        <Row
          label="Disability"
          value={
            data.hasDisability === null
              ? "—"
              : data.hasDisability
                ? "Yes"
                : "No"
          }
        />

        {data.hasDisability === true && (
          <Row
            label="Disability Details"
            value={data.disabilityDetails}
            required={false}
          />
        )}
      </ReviewSection>

      {/* Materials section */}
      <ReviewSection
        title="Materials"
        onEdit={() => onEdit(REVIEW_EDIT_STEPS.materials)}
      >
        {/* Volunteer Waiver and Agreement signatures */}
        <Row label="Volunteer Waiver" value={data.waiverSignature} />
        <Row label="Volunteer Agreement" value={data.agreementSignature} />

        {/* Only display minor signatures if the applicant is under 18 */}
        {data.isMinor && (
          <>
            <Row
              label="Parent/Legal Guardian E-Signature"
              value={data.minorGuardianSignature}
              required={false}
            />
            <Row
              label="Minor E-Signature"
              value={data.minorSignature}
              required={false}
            />
          </>
        )}
      </ReviewSection>

      {/* Appointment section */}
      <ReviewSection
        title="Appointment"
        onEdit={() => onEdit(REVIEW_EDIT_STEPS.appointment)}
      >
        {/* Display the applicant's onboarding availability */}
        <Row
          label="Onboarding Availability"
          value={data.onboardingAvailability}
        />
      </ReviewSection>
    </div>
  );
}
