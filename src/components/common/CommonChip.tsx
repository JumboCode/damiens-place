/**
 * CommonChip.tsx
 *
 * Small rounded label used for roles and statuses, e.g. "Super Volunteer",
 * "+2" or "onboarded".
 *
 * Author: Natalie Phua
 * Date Created: 11/22/2026
 */

type CommonChipProps = {
  label: string;
  /** Background color class. Defaults to the light primary color. */
  bgColor?: string;
  /** Text color class. Defaults to the primary color. */
  textColor?: string;
};

/**
 * CommonChip
 *
 * Shows a short piece of text in a colored pill.
 *
 * @param label - the text to show
 * @param bgColor - background color class (e.g. "bg-muted-green")
 * @param textColor - text color class (e.g. "text-green")
 */
export default function CommonChip({
  label,
  bgColor = "bg-muted-primary",
  textColor = "text-primary",
}: CommonChipProps) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded px-2 py-0.5 ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
}
