/**
 * personal-info.ts
 *
 * Defines the data types and default values for the Personal Info form.
 * Validates user inputs to ensure required fields are completed and correctly formatted.
 *
 * Author: Luisa and Jeremiah
 * Date Created: 10/16/2026
 */

// Every answer is text while the person is typing, even Age. Validation checks it's a number.
export type PersonalInfoValues = {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  cellPhone: string;
  homePhone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  emergencyContactFirstName: string;
  emergencyContactLastName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
};

// One error message per field that has a problem. Fields with no problem are left out.
export type PersonalInfoErrors = Partial<
  Record<keyof PersonalInfoValues, string>
>;

export const emptyPersonalInfo: PersonalInfoValues = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  cellPhone: "",
  homePhone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  emergencyContactFirstName: "",
  emergencyContactLastName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
};

/**
 * validatePersonalInfo
 *
 * Checks the Personal Info form for missing required fields and invalid
 * email, phone number, or age formats.
 *
 * @param values - The applicant's answers to all Personal Info fields, stored as strings.
 * @returns An object containing error messages for invalid fields, or an empty object if all fields are valid.
 */
export function validatePersonalInfo(
  values: PersonalInfoValues,
): PersonalInfoErrors {
  const errors: PersonalInfoErrors = {};

  // Required fields: blank (or only spaces) counts as missing
  const requiredFields: (keyof PersonalInfoValues)[] = [
    "firstName",
    "lastName",
    "age",
    "email",
    "cellPhone",
    "street",
    "city",
    "state",
    "zip",
    "emergencyContactFirstName",
    "emergencyContactLastName",
    "emergencyContactPhone",
  ];
  for (const field of requiredFields) {
    if (values[field].trim() === "") {
      errors[field] = "This field is required";
    }
  }

  // email: if it's filled in, it has to look like something@something.something
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (values.email.trim() !== "" && !EMAIL_REGEX.test(values.email)) {
    errors.email = "Please enter a valid email.";
  }

  // cellPhone at least 10 digits
  if (
    values.cellPhone.trim() !== "" &&
    values.cellPhone.replace(/\D/g, "").length < 10
  ) {
    errors.cellPhone = "Phone number must have at least 10 digits.";
  }
  //emergencyContactPhone at least 10 digits
  if (
    values.emergencyContactPhone.trim() !== "" &&
    values.emergencyContactPhone.replace(/\D/g, "").length < 10
  ) {
    errors.emergencyContactPhone = "Phone number must have at least 10 digits.";
  }
  //homePhone at least 10 digits check
  if (
    values.homePhone.trim() !== "" &&
    values.homePhone.replace(/\D/g, "").length < 10
  ) {
    errors.homePhone = "Phone number must have at least 10 digits.";
  }

  //age: if it's filled in, a whole number from 1 to 120 (Number.isInteger)
  if (values.age.trim() !== "") {
    const age = Number(values.age);

    if (!Number.isInteger(age) || age < 1 || age > 120) {
      errors.age = "Please enter a valid age between 1 and 120.";
    }
  }

  return errors;
}
