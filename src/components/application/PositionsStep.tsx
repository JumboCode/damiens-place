/**
 * PositionsStep.tsx
 *
 * Step 2 in the application form, where the applicant selects positions
 * and availability.
 *
 * Carter & Rim & Natalie
 * Date Created: 10/26/2026
 */
"use client";

import { useEffect, useState } from "react";
import CommonDropdown from "@/components/common/CommonDropdown";
import FormTextArea from "./FormTextArea";
import PositionsTable from "./PositionsTable";
import { DAY_OPTIONS } from "./positions-step";
import type {
  Position,
  PositionsStepErrors,
  PositionsStepValues,
} from "./positions-step";

type PositionsStepProps = {
  values: PositionsStepValues;
  errors: PositionsStepErrors;
  // Pass only the fields that changed, so one click can update more than one field
  onChange: (changes: Partial<PositionsStepValues>) => void;
};

export default function PositionsStep({
  values,
  errors,
  onChange,
}: PositionsStepProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Every position is an option, including the ones with available: false
  const positionOptions = positions.map((position) => ({
    value: position.id,
    label: position.name,
  }));

  useEffect(() => {
    async function loadPositions() {
      try {
        const response = await fetch("/api/positions");
        if (!response.ok) {
          setLoadError(true);
          return;
        }
        const data = await response.json();
        setPositions(data.positions);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }
    loadPositions();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-xl font-bold">Part 2: Volunteer Positions</h2>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">All Volunteer Positions:</h3>

        {loading && <p>Loading positions...</p>}

        {loadError && (
          <p className="text-error-msg">
            We couldn&apos;t load the positions. Please refresh the page.
          </p>
        )}

        {!loading && !loadError && <PositionsTable positions={positions} />}

        <div className="flex flex-col gap-2">
          <p className="text-base font-medium">
            Position of Interest <span className="text-error-msg">*</span>
          </p>
          <CommonDropdown
            options={positionOptions}
            selectedValues={values.positionIds}
            onChange={(newIds: string[]) => onChange({ positionIds: newIds })}
          />
          {errors.positionIds && (
            <p className="text-sm text-error-msg">{errors.positionIds}</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Time Available</h3>

        <div className="flex flex-col gap-2">
          <p className="text-base font-medium">
            Days of Week Available <span className="text-error-msg">*</span>
          </p>
          <CommonDropdown
            options={DAY_OPTIONS}
            selectedValues={values.availableDays}
            onChange={(newDays: string[]) =>
              onChange({ availableDays: newDays })
            }
          />
          {errors.availableDays && (
            <p className="text-sm text-error-msg">{errors.availableDays}</p>
          )}
        </div>

        <FormTextArea
          label="Hours Available on Those Days"
          name="availableHours"
          required
          helperText="Besides hours available, feel free to enter any comments too."
          value={values.availableHours}
          error={errors.availableHours}
          onChange={(newText) => onChange({ availableHours: newText })}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Disability</h3>

        {/* A fieldset groups the two checkboxes, and the legend is their shared label */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-base font-medium">
            Disability Report <span className="text-error-msg">*</span>
          </legend>

          {/* Checking "Yes" unchecks "No". Unchecking it leaves the question unanswered and clears the details */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={values.hasDisability === true}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? { hasDisability: true }
                    : { hasDisability: null, disabilityDetails: "" },
                )
              }
              aria-invalid={errors.hasDisability ? true : undefined}
              aria-describedby={
                errors.hasDisability ? "hasDisability-error" : undefined
              }
            />
            Yes, I have a disability that I want to report.
          </label>

          {/* The details box is grayed out unless "Yes" is checked */}
          <FormTextArea
            label="Disability details"
            name="disabilityDetails"
            hideLabel
            rows={6}
            disabled={values.hasDisability !== true}
            value={values.disabilityDetails}
            onChange={(newText) => onChange({ disabilityDetails: newText })}
          />

          {/* Picking "No" clears the details so they never keep old text */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={values.hasDisability === false}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? { hasDisability: false, disabilityDetails: "" }
                    : { hasDisability: null },
                )
              }
              aria-invalid={errors.hasDisability ? true : undefined}
              aria-describedby={
                errors.hasDisability ? "hasDisability-error" : undefined
              }
            />
            No, I don&apos;t have a disability.
          </label>

          {errors.hasDisability && (
            <p id="hasDisability-error" className="text-sm text-error-msg">
              {errors.hasDisability}
            </p>
          )}
        </fieldset>
      </section>
    </div>
  );
}
