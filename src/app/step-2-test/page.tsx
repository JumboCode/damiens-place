"use client";
import { useState, useEffect } from "react";
import PositionsStep from "@/components/application/PositionsStep";

import {
  emptyPositionsStep,
  validatePositionsStep,
  type PositionsStepValues,
  type PositionsStepErrors,
} from "@/components/application/positions-step";

export default function Step2TestPage() {
  const [values, setValues] = useState<PositionsStepValues>(emptyPositionsStep);
  const [errors, setErrors] = useState<PositionsStepErrors>({});
  const valuesJSON = JSON.stringify(values);

  return (
    <div className="flex flex-col gap-6 p-20">
      <PositionsStep
        values={values}
        errors={errors}
        onChange={(changes) =>
          setValues((current) => ({ ...current, ...changes }))
        }
      />
      <button
        onClick={() => setErrors(validatePositionsStep(values))}
        className="rounded-full bg-primary px-6 py-2 text-white"
      >
        Test Validation
      </button>
      <pre className="text-xs whitespace-pre-wrap">{valuesJSON}</pre>
    </div>
  );
}
