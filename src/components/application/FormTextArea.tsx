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

// TODO: function contract (see api/example for an example, or the Code Style Guide in Notion for the template)
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
 
  return (
    <div className="flex flex-col gap-1">
      {/* TODO: the label (red * if required, and the `sr-only` class when hideLabel is true), the helper note,
          the <textarea>, and the error message.
          Copy FormField's colors, hover/focus/error styles, and aria-invalid / aria-describedby.
          Here aria-describedby should list the helper id (if there is helper text) and the error id (only when there's an error).
          A disabled text area should look grayed out and not react to hover. */}
        <label 
                htmlFor={name}
                className={hideLabel ? "sr-only" : ""}>
                {label}
                {required && (
                        <span className="text-[#E31A1D] font-['Inclusive_Sans'] text-[32px] font-medium leading-normal">
                        *
                        </span>
                )} 
        </label>

        {helperText && (
                <p id={helperId} className="text-[#334155] font-['Inclusive_Sans'] text-[18px] font-medium leading-normal self-stretch">
                {helperText}
                </p> 
        )}
        
        <textarea
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                required={required}
                disabled={disabled}
                aria-invalid={error ? true : undefined}
                aria-describedby={helperText ? helperId : ""}
                className={"w-full rounded-md border bg-input-box px-3 py-2 text-sm font-normal text-foreground focus:outline-none " +
                  (error
                    ? "border-error-msg hover:border-error-msg focus:border-error-msg"
                    : "border-input-regular-frame hover:border-input-hover-frame focus:border-2 focus:px-2.75 focus:py-1.75 focus:border-input-focus-frame")
                }
        />

        {error && (
            <p id={error} className="text-sm text-error-msg">
            {error}
            </p>
        )}

        
    </div>
  );
}