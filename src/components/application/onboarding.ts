/**
 * onboarding.ts
 *
 * Defines the data types and default values for the onboarding forms.
 * Validates waiver, agreement, and minor release acceptance and signatures.
 *
 *
 * Author: Adrien and Luisa
 * Date Created: <10/25/2026>
 */

// Every signature is the full legal name the person typed
export type OnboardingValues = {
  waiverAccepted: boolean; // the checkbox
  waiverSignature: string;
  agreementAccepted: boolean; // the checkbox
  agreementSignature: string;
  // The next three are only used when the applicant is under 18
  minorReleaseAccepted: boolean; // the checkbox
  minorGuardianSignature: string;
  minorSignature: string;
};

// One error message per field that has a problem. Fields with no problem are left out.
export type OnboardingErrors = Partial<Record<keyof OnboardingValues, string>>;

export const emptyOnboarding: OnboardingValues = {
  waiverAccepted: false,
  waiverSignature: "",
  agreementAccepted: false,
  agreementSignature: "",
  minorReleaseAccepted: false,
  minorGuardianSignature: "",
  minorSignature: "",
};

/**
 * validateOnboarding
 *
 * Checks whether the applicant has accepted and signed the required
 * onboarding agreements, including the minor release when applicable.
 *
 * @param values - The applicant's checkbox responses and typed signatures.
 * @param isMinor - Whether the applicant is under 18.
 * @returns An object containing error messages for invalid fields,
 * or an empty object if all required fields are valid.
 */
export function validateOnboarding(
  values: OnboardingValues,
  isMinor: boolean,
): OnboardingErrors {
  const errors: OnboardingErrors = {};

  if (!values.waiverAccepted) {
    errors.waiverAccepted = "You must agree to the waiver to continue.";
  }

  if (!values.agreementAccepted) {
    errors.agreementAccepted = "You must agree to the agreement to continue.";
  }

  if (values.waiverSignature.trim() == "") {
    errors.waiverSignature =
      "Please type your full legal name to sign the waiver.";
  }
  //agreementSignature
  if (values.agreementSignature.trim() == "") {
    errors.agreementSignature =
      "Please type your full legal name to sign the agreement.";
  }

  // Validate the release form only for applicants under 18
  if (isMinor) {
    if (!values.minorReleaseAccepted) {
      errors.minorReleaseAccepted =
        "You must agree to the minor release to continue.";
    }

    if (values.minorGuardianSignature.trim() === "") {
      errors.minorGuardianSignature =
        "Please enter the parent or legal guardian's full legal name.";
    }

    if (values.minorSignature.trim() === "") {
      errors.minorSignature = "Please enter the minor's full legal name.";
    }
  }

  return errors;
}
