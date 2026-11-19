/**
 * FormField.tsx
 *
 * Displays a single field in the volunteer application form.
 *
 * Author: Luisa and Jeremiah
 * Date Created: 10/15/2026
 */
import "@/app/globals.css";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "password";
  inputMode?: "text" | "numeric" | "tel" | "email";
  // Lets browsers fill in saved info, like "given-name" or "postal-code"
  autoComplete?: string;
  // Override the label text size (defaults to text-base)
  labelClassName?: string;
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
  labelClassName = "text-base",
}: FormFieldProps) {
  // The error message gets this id so the input can point to it for screen readers
  const errorId = `${name}-error`;
  // Password fields get an eye button that toggles visibility
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  // Notice the UI/UX spec in the Figma, next to the Volunteer Sign In Page.
  // Our input colors live in globals.css. Use these theme classes on the <input>:
  //   bg-input-box                      the fill of the box
  //   border-input-regular-frame        the border normally
  //   hover:border-input-hover-frame    the border when the mouse is over it
  //   focus:border-input-focus-frame    the border when you click or Tab into it
  // The box should visibly change in each of those three states.

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className={labelClassName}>
        {label} {required && <span className="text-error-msg">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={
            "w-full rounded-md border bg-input-box px-3 py-2 text-md font-normal text-foreground focus:outline-none " +
            (isPassword ? "pr-10 focus:pr-9.5 " : "") +
            (error
              ? "border-error-msg hover:border-error-msg focus:border-error-msg"
              : "border-input-regular-frame hover:border-input-hover-frame focus:border-2 focus:px-2.75 focus:py-1.75 focus:border-input-focus-frame")
          }
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-error-msg">
          {error}
        </p>
      )}
    </div>
  );
}
