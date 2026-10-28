/**
 * agreement-text.ts
 *
 * Author: Adrien and Luisa
 * Date Created: 10/25/2026
 *
 * All of the long text shown on Step 3 (Onboarding Materials), copied
 * word-for-word from the Figma. Kept here so it's easy to find and edit
 * without digging through OnboardingStep.tsx.
 */

export const HANDBOOK_TITLE = "Volunteer Handbook";
export const HANDBOOK_INSTRUCTIONS =
  "Please read the volunteer handbook before proceeding.";

// The numbered statements of the Volunteer Waiver, one string per number

export const WAIVER_ITEMS: string[] = [
  "As a volunteer at Damien’s Food Pantry, I hereby agree to hold harmless and waive any and all claims or causes of action against Damien’s Food Pantry arising out of any cause whatsoever, including but not limited to claims arising out of negligence or intentional conduct of its volunteers or agents.",

  "I attest that I am physically fit and prepared to perform the tasks assigned to me as Damien’s Food Pantry volunteer. (Let us know if you have a disability and we will try to find an appropriate task for you.)",

  "I further agree to use my personal insurance as the primary provider in the event of injury due to my work as a volunteer for Damien’s Food Pantry.",

  "I shall not operate a personal vehicle for volunteer activities unless I have a valid Driver’s License and at least the minimum amount of liability insurance required by Massachusetts law.",

  "Damien’s Food Pantry is not responsible for loss or damage to the volunteer’s individual property",

  "I also grant Damien’s Food Pantry full permission to use photographs of me for publicity and promotional purposes.",
];

// The Volunteer Agreement is a mix of short paragraphs and bulleted lists, so describe it as a list of blocks
export type AgreementBlock =
  { type: "paragraph"; text: string } | { type: "list"; items: string[] };

export const AGREEMENT_BLOCKS: AgreementBlock[] = [
  {
    type: "paragraph",
    text: "I have read and agree to uphold the following:",
  },
  {
    type: "list",
    items: [
      "1. Volunteer Rights, Responsibilities & Principles, (page 5)",
      "2. Code of Ethics (page 6)",
      "3. Authorization for Background check (page 9)",
    ],
  },
  {
    type: "paragraph",
    text: "Misconduct will include breaches of any of Damien’s Food Pantry policies which warrant disciplinary action up to and including Termination. Examples of misconduct include:",
  },
  {
    type: "list",
    items: [
      "Theft of property, donated food, or funds from Damien’s Food Pantry",
      "Willful damage to Damien’s Food Pantry property",
      "Intoxication through alcohol or other prohibited substance",
      "Verbal or physical harassment of clients, volunteers, board members, staff members, donors, or any other person",
      "Disclosure of confidential information regarding Damien’s Food Pantry or its guests to any other party without prior permission from the Executive Director",
      "Falsification of any of Damien’s Food Pantry records for personal gain or on behalf of any other volunteer, staff member, or client",
      "Slander against Damien’s Food Pantry",
    ],
  },
  {
    type: "paragraph",
    text: "In Return, Damien’s Food Pantry will:",
  },
  {
    type: "list",
    items: [
      "Embrace Damien’s Food Pantry Mission and Vision",
      "Ensure that you have the training and necessary tools to do your work",
      "Honor and recognize your volunteer service and commitment.",
      "Always encourage open and honest feedback",
      "Provide reimbursements for all authorized Volunteer expenses",
      "Ensure a safe, clean, and volunteer-friendly environment",
    ],
  },
];

// The release text for minors (the paragraph above the signature boxes)

export const MINORS_RELEASE_TEXT =
  "I, being the parent or legal guardian of (the “Minor”) hereby consent to and authorize the Minor to act as a volunteer for Damien’s Food Pantry. I acknowledge and agree that activities performed by the Minor as a volunteer will be performed strictly on a voluntary basis, without any pay, compensation, or benefits. I agree and understand that the Minor must comply with the rules and regulations established from time to time by Damien’s Food Pantry and that failure to do so may result in the Minor’s immediate removal as a volunteer. I am aware of the nature of the activities to be performed by the Minor as a volunteer and recognize that in performing volunteer tasks, a risk of harm or injury exists. I agree that all volunteer activities are to be performed by the Minor at the Minor’s risk and I assume full responsibility, therefore. On behalf of myself, the Minor, and our respective heirs and personal representatives, I agree not to hold or attempt to hold Damien’s Food Pantry their population served, volunteers, or staff responsible for any injury or damage sustained or incurred by the Minor, arising out of or in any way connected with the Minor’s activities as a volunteer for Damien’s Food Pantry. I hereby release and discharge Damien’s Food Pantry, their employees, and their volunteers from any and all claims, demands, causes of action of any nature or cause, for any such injury or damage incurred or suffered by the Minor.";
