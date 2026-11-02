/**
 * step-4-test/page.tsx
 *
 * Temporary test page for the step-4 page
 *
 * Author: Carter Watabe, Rim Badaoui
 * Date Created: 11/01/2026
 */
"use client";

import { useState } from "react";
import CommonButton from "@/components/common/CommonButton";
import {
  emptyAppointmentStep,
  validateAppointmentStep,
} from "@/components/application/appointment-step";
import type {
  AppointmentStepErrors,
  AppointmentStepValues,
} from "@/components/application/appointment-step";
import AppointmentStep from "@/components/application/AppointmentStep";

export default function Step4TestPage() {
  const [values, setValues] =
    useState<AppointmentStepValues>(emptyAppointmentStep);
  const [errors, setErrors] = useState<AppointmentStepErrors>({});

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <AppointmentStep
        values={values}
        errors={errors}
        onChange={(changes) =>
          setValues((current) => ({ ...current, ...changes }))
        }
      />

      <CommonButton
        title="Validate"
        onClick={() => setErrors(validateAppointmentStep(values))}
      />

      {/* Shows what the page is holding, so you can check it as you type */}
      <pre className="rounded-md bg-gray-100 p-4 text-sm">
        {JSON.stringify(values, null, 2)}
      </pre>
    </main>
  );
}
