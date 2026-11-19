/**
 * AdminSignInForm.tsx
 *
 * Logic for AdminSignInForm to be able to have email and password fields on the
 * same card
 *
 * Author: William Balz and Nirvaan Govind
 * Date Created: 14 October 2026
 */

"use client";
import { useState, type FormEvent } from "react";
import { SignIn, useSession, useSignIn } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import FormField from "@/components/application/FormField";
import CommonButton from "@/components/common/CommonButton";
import { clerkAppearance } from "@/lib/clerk-appearance";

const signInPath = "/admin/sign-in";

export default function AdminSignInForm() {
  const { signIn } = useSignIn();
  const { session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signIn || isSubmitting) return;

    const emailAddress = emailValue.trim();
    const password = passwordValue;

    // Show errors for empty fields instead of disabling the button
    const missingEmail = emailAddress === "";
    const missingPassword = password.length === 0;
    setEmailError(missingEmail ? "Please enter your email." : "");
    setPasswordError(missingPassword ? "Please enter your password." : "");
    if (missingEmail || missingPassword) return;

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
      noValidate
      aria-label="Admin sign in"
      aria-busy={isSubmitting}
      className="w-full rounded-md bg-background"
    >
      <div className="flex flex-col gap-5">
        <FormField
          labelClassName="text-xl font-medium"
          label="Email"
          name="email"
          type="email"
          autoComplete="username"
          value={emailValue}
          onChange={setEmailValue}
          error={emailError}
        />
        <FormField
          labelClassName="text-xl font-medium"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={passwordValue}
          onChange={setPasswordValue}
          error={passwordError}
        />

        {errorMessage && (
          <p role="alert" className="font-normal text-error-msg">
            {errorMessage}
          </p>
        )}
        <div className="mt-2 flex justify-center">
          <CommonButton
            type="submit"
            size="lg"
            title={isSubmitting ? "Signing in..." : "Sign in"}
          />
        </div>
      </div>
    </form>
  );
}
