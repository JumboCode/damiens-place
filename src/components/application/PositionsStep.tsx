// TODO: FILE HEADER
// This line is needed because the page reacts to clicks and loads data
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

  const POSITION_OPTIONS = positions.map((position) => ({
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
      <h2>Part 2: Volunteer Positions</h2>
 
      <section className="flex flex-col gap-4">
        <h3>All Volunteer Positions</h3>
        {/* TODO: show "Loading positions..." while loading, a clear error message if loadError
            (something like "We couldn't load the positions. Please refresh the page."), and
            otherwise the <PositionsTable /> */}
        
        {loading && 
          <span>
            Loading positions...
          </span>
        }

       {loadError && (
          <p>
            We couldnt load the positions. Please refresh the page.
          </p>     
      )} 

      {!loading && !loadError && <PositionsTable positions={positions}/>}
        
        {/* TODO: a label saying "Position of Interest" with a red *, then <CommonDropdown /> under it.
            Turn each position into an option: { value: position.id, label: position.name }. Every position is an option, including the ones with available: false.
            selectedValues is values.positionIds, and its onChange should call onChange({ positionIds: newIds }).
            Show errors.positionIds in red under the dropdown, like FormField does. */}

      <label> Position of Interest <span>*</span></label>
      

      <CommonDropdown 
          options={POSITION_OPTIONS}
          selectedValues={values.positionIds}
          onChange={(newIDs: string[]) => onChange({positionIds : newIDs})}
      />

      {loadError && (
        <p className="text-sm text-error-msg">
          {errors.positionIds}
        </p>
      )}
      </section>
 
      <section className="flex flex-col gap-4">
        <h3>Time Available</h3>
        {/* TODO: a label saying "Days of Week Available" with a red *, then <CommonDropdown /> under it.
            The options are DAY_OPTIONS. selectedValues is values.availableDays, and its onChange
            should call onChange({ availableDays: newDays }).
            Show errors.availableDays in red under the dropdown. */}
        <label>Days of Week Available<span>*</span></label>

        <CommonDropdown 
          options={DAY_OPTIONS}
          selectedValues={values.availableDays}
          onChange={(newDays: string[]) => onChange({ availableDays: newDays})}
        />

        {loadError && (
          <p className="text-sm text-error-msg">
            {errors.availableDays}
          </p>
        )}

        {/* TODO: a <FormTextArea /> labeled "Hours available on those days", required, with the helper text
            "Besides hours available, feel free to enter any comments too."
            Its value is values.availableHours and typing calls onChange({ availableHours: newText }).
            Pass errors.availableHours as its error. */}
      </section>
 
      <section className="flex flex-col gap-4">
        <h3>Disability</h3>
        {/* TODO: "Disability Report" with a red *, then the two checkboxes from the Figma:
              "Yes, I have a disability that I want to report." and "No, I don't have a disability."
            They work as a pair: checking one unchecks the other, and unchecking the one you checked
            leaves the question unanswered again (hasDisability: null).
            Hint: onChange({ hasDisability: true, ... }) can change two fields at once.
            Show errors.hasDisability in red under the checkboxes. */}
        {/* TODO: a <FormTextArea /> for the details, with hideLabel and a label like "Disability details"
            (the Figma shows no label). It's disabled (grayed out) unless "Yes" is checked,
            and picking "No" or unchecking clears it, so it never keeps old text:
              onChange({ hasDisability: false, disabilityDetails: "" })
            Its value is values.disabilityDetails. */}
      </section>
    </div>
  );
}