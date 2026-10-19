
"use client";

import { useState } from "react";
import PersonalInfoStep from "@/components/application/PersonalInfoStep";

import {
  emptyPersonalInfo,
  validatePersonalInfo,
  type PersonalInfoValues,
  type PersonalInfoErrors,
} from "@/components/application/personal-info";

export default function Step1TestPage() {
  const [values, setValues] = useState<PersonalInfoValues>(emptyPersonalInfo);
  const [errors, setErrors] = useState<PersonalInfoErrors>({});

  return (
    <div className="flex flex-col gap-6 p-6">
      <PersonalInfoStep
        values={values}
        onChange={(field, value) => {
          setValues({ ...values, [field]: value });
        }}
        errors={errors}
      />

      <button
        onClick={() => setErrors(validatePersonalInfo(values))}
        className="rounded-full bg-primary px-6 py-2 text-white"
      >
        Test Validation
      </button>
    </div>
  );
}
