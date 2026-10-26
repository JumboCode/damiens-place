/**
 * CommonButton.tsx
 *
 * Common button component to be used across the application.
 *
 * Default styling = maroon background with white text.
 * Alt-style = white background with maroon text.
 * Size = small, medium, and large options based on exact usage.
 * Full width = stretches to fill its container instead of fitting its text.
 *
 * Author: Natalie Phua
 * Date Created: 10/14/2026
 */

import type { ButtonHTMLAttributes } from "react";

type CommonButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  title: string;
  altStyle?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export default function CommonButton({
  title,
  altStyle = false,
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...buttonProps
}: CommonButtonProps) {
  const style = altStyle
    ? "border border-primary bg-white text-primary enabled:hover:bg-gray-100"
    : "bg-primary text-primary-foreground enabled:hover:bg-primary/90";

  // Size mapping for height, padding, and text size
  const sizeStyles = {
    sm: "min-h-9 px-10 text-sm font-medium",
    md: "min-h-12 px-12 text-xl font-medium",
    lg: "min-h-14 px-18 text-2xl font-semibold",
  };

  // Fit the text by default, or fill the container when fullWidth is set
  const widthStyle = fullWidth ? "w-full" : "w-fit";

  return (
    <button
      type={type}
      className={`inline-block max-w-full rounded-full text-center shadow-sm motion-safe:transition motion-safe:duration-150 enabled:cursor-pointer enabled:active:shadow-none motion-safe:enabled:active:translate-y-0.5 motion-safe:enabled:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:border-0 disabled:shadow-none ${widthStyle} ${sizeStyles[size]} ${style} ${className}`.trim()}
      {...buttonProps}
    >
      {title}
    </button>
  );
}