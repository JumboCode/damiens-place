// TODO: FILE HEADER
// This line is needed because the form reacts to typing
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
        <div className="{/* TODO: styling here! */}">
          <FormField
            label="First Name"
            name="firstName"
            required
            value={values.firstName}
            error={errors.firstName}
            onChange={(value) => onChange("firstName", value)}
            autoComplete="given-name"
          />
          {/* TODO: the rest of the Personal Information fields (see Figma).
              Use type="email" for email, type="tel" + inputMode="tel" for phones,
              and inputMode="numeric" for age. */}
        </div>
      </section>

      {/* TODO: a clearly marked placeholder for the Proof of Residence upload, i.e.
      text saying "Proof of residence upload goes here". Don't build the upload. */}

      {/* TODO: the Home Address section (2 columns on bigger screens) */}

      {/* TODO: the Emergency Contact section (3 columns on bigger screens) */}
    </div>
  );
}
