/**
 * clerk-appearances.ts
 *
 * styling for clerk sign-in
 *
 * Author: William Balz and Nirvaan Govind
 * Date created: 8 October 2026
 */

export const clerkAppearance = {
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
    rootBox: {
      width: "100%",
    },

    cardBox: {
      width: "100%",
      boxShadow: "none",
      border: "none",
      borderRadius: "5px",
    },

    card: {
      width: "100%",
      padding: "0px 16px 32px",
      border: "none",
      borderRadius: "0",
      backgroundColor: "transparent",
      boxShadow: "none",
    },

    headerTitle: {
      display: "none",
    },

    header: {
      ".cl-signIn-start &": {
        display: "none",
      },
    },
    headerSubtitle: {
      display: "none",
    },

    formFieldErrorText: {
      color: "var(--error-msg)",
      fontSize: "14px",
      lineHeight: "20px",
    },

    formFieldLabel: {
      fontSize: "18px",
      fontWeight: 500,
      lineHeight: "24px",
      color: "var(--foreground)",
      backgroundColor: "transparent",
    },

    formFieldInput: {
      minHeight: "48px",
      fontSize: "18px",
      backgroundColor: "var(--input-box)",
      border: "1px solid var(--input-regular-frame)",
      borderRadius: "6px",
      boxShadow: "none",

      //hovering over box when not disabled
      "&:hover:not:(:disabled):not([aria-invalid='true'])": {
        borderColor: "var(--input-hover-frame)",
      },

      //clicking on the box with no error
      "&:focus:not([aria-invalid='true'])": {
        borderColor: "var(--input-hover-frame)",
        boxShadow: "none",
      },

      //clear for keyboard navigation
      "&:focus-visible": {
        outline: "2px solid var(--primary)",
        outlineOffset: "2px",
      },

      //if error keep red even during hover/focus
      "&[aria-invalid='true'], &[aria-invalid='true']:hover, &[aria-invalid='true']:focus":
        {
          borderColor: "var(--error-msg)",
          boxShadow: "none",
        },

      "&:disabled": {
        backgroundColor: "var(--input-box)",
        borderColor: "var(--input-regular-frame)",
        opacity: 0.6,
        cursor: "not-allowed",
      },

      //placeholder text not in figma so let's cut
      "&::placeholder": {
        color: "transparent",
        opacity: 0,
      },
    },

    formButtonPrimary: {
      width: "16rem",
      maxWidth: "100%",
      minHeight: "48px",
      marginInline: "auto",
      borderRadius: "9999px",
      backgroundColor: "var(--primary)",
      backgroundImage: "none",
      boxShadow: "none",
      fontSize: "20px",
      fontWeight: 500,
      textTransform: "none",
    },

    footer: {
      backgroundColor: "var(--background)",
      backgroundImage: "none",
      boxShadow: "none",
      border: "none",
    },
    footerAction: {
      display: "none",
    },
  },
};
