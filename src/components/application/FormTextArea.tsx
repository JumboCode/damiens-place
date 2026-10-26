/**
 * FormTextArea.tsx
 *
 * Displays a single text area in the Positions step form.
 *
 * Carter & Rim
 * Date Created: 10/26/2026
 */

type FormTextAreaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  helperText?: string; // a small note under the label (see the Figma)
  rows?: number;
  disabled?: boolean;
  // Hides the label from the screen but keeps it for screen readers (for when the Figma has no visible label)
  hideLabel?: boolean;
};

/**
 * FormTextArea
 *
 * Shows a labeled text area with an optional helper note and error message.
 *
 * @param label - the label text
 * @param name - used for the textarea's id and name, and for the helper and error ids
 * @param value - the current text
 * @param onChange - called with the new text whenever the person types
 * @param error - an error message to show under the text area
 * @param required - shows a red * after the label
 * @param helperText - a small note under the label
 * @param rows - how tall the text area is
 * @param disabled - grays the text area out and stops typing
 * @param hideLabel - hides the label visually but keeps it for screen readers
 * @returns the labeled text area
 */
export default function FormTextArea({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  helperText,
  rows = 5,
  disabled = false,
  hideLabel = false,
}: FormTextAreaProps) {
  // The helper note and the error message get ids so the text area can point to them for screen readers
  const helperId = `${name}-helper`;
  const errorId = `${name}-error`;

  // Only point to the helper note and the error message when they are actually shown
  const describedBy =
    [helperText ? helperId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className={hideLabel ? "sr-only" : "text-base font-medium"}
      >
        {label}
        {required && <span className="text-error-msg"> *</span>}
      </label>

      {helperText && (
        <p id={helperId} className="text-sm">
          {helperText}
        </p>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        disabled={disabled}
        // Our own validation shows the errors, so we don't use the browser's `required`
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={
          "w-full resize-y rounded-md border bg-input-box px-3 py-2 text-sm font-normal text-foreground focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 " +
          (error
            ? "border-error-msg hover:border-error-msg focus:border-error-msg"
            : "border-input-regular-frame enabled:hover:border-input-hover-frame focus:border-2 focus:px-2.75 focus:py-1.75 focus:border-input-focus-frame")
        }
      />

      {error && (
        <p id={errorId} className="text-sm text-error-msg">
          {error}
        </p>
      )}
    </div>
  );
}
