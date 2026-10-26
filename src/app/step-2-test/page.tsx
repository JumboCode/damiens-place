"use client";
import { useState, useEffect } from "react";
import PositionsStep from "@/components/application/PositionsStep"
import PositionsTable from "@/components/application/PositionsTable";

import {
        emptyPositionsStep, 
        validatePositionsStep, 
        type PositionsStepValues,
        type PositionsStepErrors,
} from "@/components/application/positions-step"


export default function Step2TestPage() {

const [values, setValues] = useState<PositionsStepValues>(emptyPositionsStep);
const [errors, setErrors] = useState<PositionsStepErrors>({});
const valuesJSON = JSON.stringify(values);

const [positions, setPositions] = useState<Position[]>([]);

    useEffect(() => {
        async function loadPositions() {
        const response = await fetch("/api/positions");
        const data = await response.json();
        setPositions(data.positions);
        }
        loadPositions();
    }, []);  

return (
        <div className="flex flex-col gap-6 p-6">
            <PositionsTable
                positions={positions}
            />
            <PositionsStep
                values={values}
                errors={errors}
                onChange={(changes) => setValues((current) => ({ ...current, ...changes }))}               
            />
            <button onClick={() => setErrors(validatePositionsStep(values))}
                    className="rounded-full bg-primary px-6 py-2 text-white">
                Test Validation
            </button>
            <pre className="text-xs whitespace-pre-wrap">{valuesJSON}</pre>
        </div>
    );
}