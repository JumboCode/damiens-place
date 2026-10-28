/**
 * FormField.tsx
 *
 * Displays a single field in the volunteer application form.
 *
 * Author: Luisa and Jeremiah
 * Date Created: 10/15/2026
 */
import "@/app/globals.css";

type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "numeric" | "tel" | "email";
  // Lets browsers fill in saved info, like "given-name" or "postal-code"
  autoComplete?: string;
};

export default function FormField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  inputMode,
  autoComplete,
}: FormFieldProps) {
  // The error message gets this id so the input can point to it for screen readers
  const errorId = `${name}-error`;

  // Notice the UI/UX spec in the Figma, next to the Volunteer Sign In Page.
  // Our input colors live in globals.css. Use these theme classes on the <input>:
  //   bg-input-box                      the fill of the box
  //   border-input-regular-frame        the border normally
  //   hover:border-input-hover-frame    the border when the mouse is over it
  //   focus:border-input-focus-frame    the border when you click or Tab into it
  // The box should visibly change in each of those three states.

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-base">
        {label} {required && <span className="text-error-msg">*</span>}
      </label>
      <input
        id={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={
          "w-full rounded-md border bg-input-box px-3 py-2 text-sm font-normal text-foreground focus:outline-none " +
          (error
            ? "border-error-msg hover:border-error-msg focus:border-error-msg"
            : "border-input-regular-frame hover:border-input-hover-frame focus:border-2 focus:px-2.75 focus:py-1.75 focus:border-input-focus-frame")
        }
      />
      {error && (
        <p id={errorId} className="text-md text-error-msg">
          {error}
        </p>
      )}
    </div>
  );
}
