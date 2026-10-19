"use client";

import { useState } from "react";
import PersonalInfoStep from "@/components/application/PersonalInfoStep";

import {
  emptyPersonalInfo,
  validatePersonalInfo,
  type PersonalInfoValues,
} from "@/components/application/personal-info";

// Give it useState for the values (start with emptyPersonalInfo) and for the errors,
// render your form, and add a button that sets the errors to
// validatePersonalInfo(values)

export default function Step1TestPage() {
  const [values, setValues] = useState<PersonalInfoValues>(emptyPersonalInfo);
  const [errors, setErrors] = useState<

  return <PersonalInfoStep></PersonalInfoStep>;
}
