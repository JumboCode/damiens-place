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
      console.log("valid email");
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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <label htmlFor="email">Email</label>
      <input
        name="email"
        type="email"
        id="email"
        className="flex h-[51px] flex-col items-start justify-center gap-2.5 self-stretch rounded-lg border border-[#cbd0da] bg-[#f8fafc] px-5 py-2.5 text-2xl font-normal leading-normal text-[#1c1e1f]"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-describedby="email-error"
        required
      />
      {emailError && (
        <p
          className="self-stretch font-normal leading-normal text-error-msg"
          id="email-error"
        >
          {emailError}
        </p>
      )}
      <label htmlFor="phone">Phone Number</label>
      <input
        name="phone"
        type="tel"
        id="phone"
        className="flex h-[51px] flex-col items-start justify-center gap-2.5 self-stretch rounded-lg border border-[#cbd0da] bg-[#f8fafc] px-5 py-2.5 text-2xl font-normal leading-normal text-[#1c1e1f]"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        aria-describedby="email-error"
        required
      />
      {phoneError && (
        <p
          className="self-stretch font-normal leading-normal text-error-msg"
          id="phone-error"
        >
          {phoneError}
        </p>
      )}

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
          disabled={submitting}
          size="lg"
          title="Login"
        />
      </div>
    </form>
  );
}
