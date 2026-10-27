/**
 * onboarding.ts
 *
 * <1-3 sentences: what this file does and why it exists.>
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
 * <1-2 sentences: what it does and why it exists.>
 *
 * @param <name> - <meaning and constraints>
 * @returns <what comes back, including edge cases like null>
 * @throws <when it throws, or don't include if it never does>
 */
export function validateOnboarding(
  values: OnboardingValues,
  isMinor: boolean,
): OnboardingErrors {
  const errors: OnboardingErrors = {};

  // TODO: waiverAccepted and agreementAccepted must be true. Use a clear message, like
  //   "You must agree to the waiver to continue".
  if (!values.waiverAccepted) {
    errors.waiverAccepted = "You must agree to the waiver to continue.";
  }

  if (!values.agreementAccepted) {
    errors.agreementAccepted = "You must agree to the agreement to continue.";
  }
  // TODO: waiverSignature and agreementSignature can't be empty once the spaces are trimmed off.
  //   Use a clear message, like "Please type your full legal name to sign the waiver".
  //waiver signature
  if (values.waiverSignature.trim() == "") {
    errors.waiverSignature =
      "Please type your full legal name to sign the waiver.";
  }
  //agreementSignature
  if (values.agreementSignature.trim() == "") {
    errors.agreementSignature =
      "Please type your full legal name to sign the agreement.";
  }

  // TODO: only when isMinor is true: minorReleaseAccepted must be true, and minorGuardianSignature
  //   and minorSignature can't be empty once the spaces are trimmed off.
  if isM

  return errors;
}
