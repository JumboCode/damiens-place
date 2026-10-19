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
import type { PersonalInfoErrors, PersonalInfoValues } from "./personal-info";

type PersonalInfoStepProps = {
  values: PersonalInfoValues;
  errors: PersonalInfoErrors;
  onChange: (field: keyof PersonalInfoValues, value: string) => void;
};

export default function PersonalInfoStep({
  values,
  errors,
  onChange,
}: PersonalInfoStepProps) {
  return (
    <div className="flex flex-col gap-10">
      <h2>Part 1: Basic Information</h2>

      <section className="flex flex-col gap-4">
        <h3>Personal Information</h3>
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
            name="lastname"
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
            label="Phone Number"
            name="phonenumber"
            value={values.homePhone}
            error={errors.homePhone}
            onChange={(value) => onChange("homePhone", value)}
            type="tel"
            inputMode="tel"
            autoComplete="email"
          />
        </div>
      </section>



       <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 md:max-w-3xl">
        <div className="flex h-full min-h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400">
          <p className="text-center text-sm">
            Proof of Residence
          </p>
        </div>
      </main>

      <section className="flex flex-col gap-4">
        <h3>Home Address</h3>

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
            label="State"
            name="state"
            value={values.state}
            onChange={(value) => onChange("state", value)}
            error={errors.state}
            required
          />
          <FormField
            label="ZIP Code"
            name="zip"
            value={values.street}
            onChange={(value) => onChange("zip", value)}
            error={errors.zip}
            required
          />
        </div>
      </section>

      {/* Emergency Contact section */}
      <section className="flex flex-col gap-4">
        <h3>Emergency Contact</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            label="Last Name"
            name="emergencyContactLastName"
            value={values.emergencyContactLastName}
            onChange={(value) => onChange("emergencyContactLastName", value)}
            error={errors.emergencyContactLastName}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            label="Phone Number"
            name="emergencyContactPhone"
            value={values.emergencyContactPhone}
            onChange={(value) => onChange("emergencyContactPhone", value)}
            error={errors.emergencyContactPhone}
            required
          />
        </div>
        <FormField
          label="Relationship"
          name="emergencyContactRelationship"
          value={values.emergencyContactRelationship}
          onChange={(value) => onChange("emergencyContactRelationship", value)}
          error={errors.emergencyContactRelationship}
        />
      </section>
    </div>
  );
}
