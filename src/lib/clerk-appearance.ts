/**
 * clerk-appearances.ts
 *
 * styling for clerk sign-in
 *
 * Author: William Balz and Nirvaan Govind
 * Date created: 8 October 2026
 */

export const clerkAppearance = {
  cssLayerName: "clerk",

  options: {
    unsafe_disableDevelopmentModeWarnings: true,
  },

  variables: {
    colorForeground: "var(--foreground)",
    colorPrimary: "var(--primary)",
    colorPrimaryForeground: "var(--primary-foreground)",
    colorBackground: "var(--background)",
    colorInput: "var(--input-box)",
    colorInputForeground: "var(--foreground)",
    colorDanger: "var(--error-msg)",
    fontFamily: "var(--font-inclusive-sans), sans-serif",
  },

  elements: {
    rootBox: "w-full",

    cardBox: "w-full rounded-[5px] border-none shadow-none",

    card: "w-full rounded-none border-none bg-transparent px-[16px] pt-0 pb-[32px] shadow-none",

    headerTitle: "hidden",

    header: "[.cl-signIn-start_&]:hidden",

    headerSubtitle: "hidden",

    formFieldErrorText: "text-[14px] leading-[20px] text-error-msg",

    formFieldLabel:
      "bg-transparent text-[18px] leading-[24px] font-medium text-foreground",

    formFieldInput: [
      "min-h-[48px] text-[18px] bg-input-box",
      "border border-solid border-input-regular-frame",
      "rounded-[6px] shadow-none",

      //hovering over box when not disabled
      "[&:hover:not(:disabled):not([aria-invalid=true])]:border-input-hover-frame",

      //clicking on the box with no error
      "[&:focus:not([aria-invalid=true])]:border-input-hover-frame",
      "[&:focus:not([aria-invalid=true])]:shadow-none",

      //clear for keyboard navigation
      "focus-visible:outline-2",
      "focus-visible:outline-solid",
      "focus-visible:outline-primary",
      "focus-visible:outline-offset-2",

      //if error keep red even during hover/focus
      "aria-invalid:border-error-msg",
      "aria-invalid:shadow-none",
      "[&[aria-invalid=true]:hover]:border-error-msg",
      "[&[aria-invalid=true]:hover]:shadow-none",
      "[&[aria-invalid=true]:focus]:border-error-msg",
      "[&[aria-invalid=true]:focus]:shadow-none",

      "disabled:bg-input-box",
      "disabled:border-input-regular-frame",
      "disabled:opacity-60",
      "disabled:cursor-not-allowed",

      //placeholder text not in figma so let's cut
      "placeholder:text-transparent",
      "placeholder:opacity-0",
    ].join(" "),

    formButtonPrimary: [
      "w-[16rem] max-w-full min-h-[48px] mx-auto",
      "rounded-[9999px] bg-primary bg-none shadow-none",
      "text-[20px] font-medium normal-case",
    ].join(" "),

    footer: "bg-background bg-none shadow-none border-none",

    footerAction: "hidden",
  },
};
