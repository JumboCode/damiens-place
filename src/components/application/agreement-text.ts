/**
 * agreement-text.ts
 *
 * All of the long text shown on Step 3 (Onboarding Materials), copied
 * word-for-word from the Figma. Kept here so it's easy to find and edit
 * without digging through OnboardingStep.tsx.
 */
 
export const HANDBOOK_TITLE = ""; // TODO: from the Figma
export const HANDBOOK_INSTRUCTIONS = ""; // TODO: from the Figma
 
// The numbered statements of the Volunteer Waiver, one string per number
export const WAIVER_ITEMS: string[] = [
  // TODO: every numbered statement, in order
];
 
// The Volunteer Agreement is a mix of short paragraphs and bulleted lists, so describe it as a list of blocks
export type AgreementBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };
 
export const AGREEMENT_BLOCKS: AgreementBlock[] = [
  // TODO: every paragraph and list in the Volunteer Agreement, in order
];
 
// The release text for minors (the paragraph above the signature boxes)
export const MINORS_RELEASE_TEXT = ""; // TODO: from the Figma