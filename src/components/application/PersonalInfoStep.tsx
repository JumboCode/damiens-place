/**
 * PersonalInfoStep.tsx
 *
 * Displays the personal information form step in the volunteer application form.
 *
 * Author: Luisa and Jeremiah
 * Date Created: 10/18/2026
 */
"use client";

import FormField from "./FormField";
import ProofOfResidenceUpload from "./ProofOfResidenceUpload";
import type { PersonalInfoErrors, PersonalInfoValues } from "./personal-info";

type PersonalInfoStepProps = {
  values: PersonalInfoValues;
  errors: PersonalInfoErrors;
  onChange: (field: keyof PersonalInfoValues, value: string) => void;
  // Called with the uploaded proof of residence file's URL
  onProofUploaded: (url: string) => void;
};

export default function PersonalInfoStep({
  values,
  errors,
  onChange,
  onProofUploaded,
}: PersonalInfoStepProps) {
  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-xl font-bold">Part 1: Basic Information</h2>
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        {/* One column on phones, three on bigger screens */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            label="First Name"
            name="firstName"
            required
            value={values.firstName}
            error={errors.firstName}
            onChange={(value) => onChange("firstName", value)}
            autoComplete="given-name"
          />
          <FormField
            label="Last Name"
            name="lastName"
            required
            value={values.lastName}
            error={errors.lastName}
            onChange={(value) => onChange("lastName", value)}
            autoComplete="given-name"
          />
          <FormField
            label="Age"
            name="age"
            required
            value={values.age}
            error={errors.age}
            onChange={(value) => onChange("age", value)}
            inputMode="numeric"
            autoComplete="age"
          />

          <FormField
            label="Email"
            name="email"
            required
            value={values.email}
            error={errors.email}
            onChange={(value) => onChange("email", value)}
            type="email"
            autoComplete="email"
          />
          <FormField
            label="Cell Phone"
            name="cellPhone"
            required
            value={values.cellPhone}
            error={errors.cellPhone}
            onChange={(value) => onChange("cellPhone", value)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
          <FormField
            label="Home Phone"
            name="homePhone"
            value={values.homePhone}
            error={errors.homePhone}
            onChange={(value) => onChange("homePhone", value)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
      </section>

      <ProofOfResidenceUpload onUploaded={onProofUploaded} />

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Home Address</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Street Address"
            name="street"
            value={values.street}
            onChange={(value) => onChange("street", value)}
            error={errors.street}
            required
          />
          <FormField
            label="City"
            name="city"
            value={values.city}
            onChange={(value) => onChange("city", value)}
            error={errors.city}
            required
          />
          <FormField
            label="State / Province / Region"
            name="state"
            value={values.state}
            onChange={(value) => onChange("state", value)}
            error={errors.state}
            required
          />
          <FormField
            label="ZIP / Postal Code"
            name="zip"
            value={values.zip}
            onChange={(value) => onChange("zip", value)}
            error={errors.zip}
            required
          />
        </div>
      </section>

      {/* Emergency Contact section */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            label="First Name"
            name="emergencyContactFirstName"
            value={values.emergencyContactFirstName}
            onChange={(value) => onChange("emergencyContactFirstName", value)}
            error={errors.emergencyContactFirstName}
            required
          />
          <FormField
            label="Last Name"
            name="emergencyContactLastName"
            value={values.emergencyContactLastName}
            onChange={(value) => onChange("emergencyContactLastName", value)}
            error={errors.emergencyContactLastName}
            required
          />
          <FormField
            label="Cell Phone"
            name="emergencyContactPhone"
            value={values.emergencyContactPhone}
            onChange={(value) => onChange("emergencyContactPhone", value)}
            error={errors.emergencyContactPhone}
            required
          />
          <FormField
            label="Relationship to Volunteer"
            name="emergencyContactRelationship"
            value={values.emergencyContactRelationship}
            onChange={(value) =>
              onChange("emergencyContactRelationship", value)
            }
            error={errors.emergencyContactRelationship}
          />
        </div>
      </section>
    </div>
  );
}
