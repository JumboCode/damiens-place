/**
 * AdminSignInForm.tsx
 *
 * Logic for AdminSignInForm to be able to have email and password fields on the same card
 *
 * Author: William Balz and Nirvaan Govind
 * Date Created: 14 October 2026
 */

"use client";
import { useState, type FormEvent } from "react";
import { SignIn, useSession, useSignIn } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

import { clerkAppearance } from "@/lib/clerk-appearance";

const signInPath = "/admin/sign-in";

const inputClassName =
  "min-h-12 w-full rounded-md border border-[var(--input-regular-frame)] " +
  "bg-[var(--input-box)] px-3 text-lg text-[var(--foreground)] " +
  "hover:border-[var(--input-hover-frame)] " +
  "focus:border-[var(--input-hover-frame)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[var(--primary)]";

export default function AdminSignInForm() {
  
  const { signIn } = useSignIn();
  const { session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const isSubmitDisabled =
    !signIn ||
    isSubmitting ||
    emailValue.trim() === "" ||
    passwordValue.length === 0;
  //commenting out because alt sign in options not part of sprint 0
  //const [showClerkForm, setShowClerkForm] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signIn || isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const emailAddress = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (signIn.protectCheck) {
        router.push(`${signInPath}/protect-check`);
        return;
      }

      if (error) {
        setErrorMessage("Please check email and password.");
        return;
      }

      // we need the cases to handle situations like MFA, "client trust", and the others below.
      
      switch (signIn.status) {
        case "complete": {
          const { error: finalizeError } = await signIn.finalize({
            navigate: ({ session, decorateUrl }) => {
              const destination = session?.currentTask
                ? `${signInPath}/tasks`
                : "/admin";
              window.location.assign(decorateUrl(destination));
            },
          });
          if (finalizeError) {
            setErrorMessage(
              finalizeError.longMessage ??
                "Unable to finish signing in. Please try again.",
            );
          }
          break;
        }
        case "needs_second_factor":
          router.push(`${signInPath}/factor-two`);
          break;
        case "needs_client_trust":
          router.push(`${signInPath}/client-trust`);
          break;
        case "needs_new_password":
          router.push(`${signInPath}/reset-password`);
          break;
        case "needs_first_factor":
          router.push(`${signInPath}/factor-one`);
          break;
        default:
          setErrorMessage("Unable to complete sign in. Please try again.");
      }
    } catch {
      setErrorMessage("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  const isContinuationPage = pathname.replace(/\/$/, "") !== signInPath;

  if (isContinuationPage || session) {
    return (
      <SignIn
        routing="path"
        path={signInPath}
        forceRedirectUrl="/admin"
        appearance={clerkAppearance}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Admin sign in"
      aria-busy={isSubmitting}
      className="w-full rounded-md bg-background px-4 pb-8"
    >
      <fieldset disabled={!signIn || isSubmitting} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block font-sans text-3xl font-medium"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={emailValue}
            onChange={(event) => setEmailValue(event.currentTarget.value)}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block font-sans text-3xl medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={passwordValue}
            onChange={(event) => setPasswordValue(event.currentTarget.value)}
            className={inputClassName}
          />
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="font-normal text-sm text-[var(--error-msg)]"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="mx-auto block min-h-12 w-64 max-w-full rounded-full
                  bg-primary px-6 text-xl font-medium text-primary-foreground
                  shadow-sm
                  motion-safe:transition motion-safe:duration-150
                  enabled:cursor-pointer
                  enabled:hover:bg-primary/90
                  enabled:active:shadow-none
                  motion-safe:enabled:active:translate-y-0.5
                  motion-safe:enabled:active:scale-[0.98]
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-primary
                  disabled:cursor-not-allowed
                  disabled:bg-gray-300 disabled:text-gray-600 disabled:show-none
                  "
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </fieldset>
    </form>
  );
}