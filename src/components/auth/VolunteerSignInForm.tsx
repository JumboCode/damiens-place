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

export default function VolunteerSignInForm() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setphoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const router = useRouter();

  // This runs when the person clicks "Sign in"
  function handleSubmit(event: React.FormEvent) {
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
    // Only go to the next page if everything looked okay
    if (!hasError) {
      router.push("/sign-in/confirmed");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <label htmlFor="email">Email</label>
      <input
        name="email"
        type="email"
        id="email"
        className="input-field"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-describedby="email-error"
        required
      />
      {emailError && (
        <p className="error-text" id="email-error">
          {emailError}
        </p>
      )}
      <label htmlFor="phone">Phone Number</label>
      <input
        name="phone"
        type="tel"
        id="phone"
        className="input-field"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        aria-describedby="email-error"
        required
      />
      {phoneError && (
        <p className="error-text" id="phone-error">
          {phoneError}
        </p>
      )}

      <button type="submit" id="submit-button">
        Login
      </button>
    </form>
  );
}
