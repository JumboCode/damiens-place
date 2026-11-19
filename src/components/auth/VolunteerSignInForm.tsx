/**
 * VolunteerSignInForm.tsx
 *
 * Basic volunteer sign in page with email and phone number input
 * boxes, as well as input validation. Attaches to AuthPageLayout.
 *
 * Author: Rim and Abby
 * Date Created: 10/10/26
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/application/FormField";
import CommonButton from "@/components/common/CommonButton";

export default function VolunteerSignInForm() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setphoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  // This runs when the person clicks "Sign in"
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // stops the browser from reloading the page
    if (submitting) return;

    let hasError = false;

    // check the phone number
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setphoneError("Please enter a valid phone number.");
      hasError = true;
    } else {
      setphoneError("");
    }

    // now check the email!
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (EMAIL_REGEX.test(email)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email.");
      hasError = true;
    }
    // Only call the login endpoint if everything looked okay
    if (hasError) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/volunteer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cellPhone: phone }),
      });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.volunteer?.id) {
        router.push(`/volunteer/${result.volunteer.id}`);
        return;
      }
      setSubmitError(
        response.status === 401
          ? "We couldn't find an active volunteer with that email and phone number."
          : "Something went wrong. Please try again.",
      );
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField
        labelClassName="text-xl font-medium"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        error={emailError}
      />
      <FormField
        labelClassName="text-xl font-medium"
        label="Phone Number"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={setPhone}
        error={phoneError}
      />

      {submitError && (
        <p
          className="self-stretch font-normal leading-normal text-error-msg"
          role="alert"
        >
          {submitError}
        </p>
      )}

      <div className="flex justify-center mt-4">
        <CommonButton
          type="submit"
          id="submit-button"
          size="lg"
          title={submitting ? "Logging in..." : "Login"}
        />
      </div>
    </form>
  );
}
