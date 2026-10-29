/**
 * email.test.ts
 *
 * Tests for the email sender
 *
 * By Nirvaan Govind and Alex Li
 * Date Created: 10/25/2026
 */

import { sendEmail, type EmailProvider } from "./email";
import { describe, it, expect, jest } from "@jest/globals";

const validMessage = {
  to: "jane@x.com",
  subject: "Hello",
  text: "Hi Jane",
};

const badRecipient = {
  to: "nope",
  subject: "Hello",
  text: "Hi Jane",
};

const blankSubject = {
  to: "jane@x.com",
  subject: "",
  text: "Hi Jane",
};

const blankSubject_whiteSpaces = {
  to: "jane@x.com",
  subject: "   ",
  text: "Hi Jane",
};

const blankText = {
  to: "jane@x.com",
  subject: "Hello",
  text: "",
};

const blankText_whiteSpaces = {
  to: "jane@x.com",
  subject: "Hello",
  text: "   ",
};

// provided test: checks that a valid email returns {ok: true} and is passed to provider
describe("sendEmail", () => {
  it("sends a valid message through the provider", async () => {
    const provider = jest.fn<EmailProvider>().mockResolvedValue(undefined);
    const result = await sendEmail(validMessage, provider);
    expect(result).toEqual({ ok: true });
    expect(provider).toHaveBeenCalledWith(validMessage);
  });
});

// email with invalid recipient returns {ok: false} and provider is never called
describe("badRecipient", () => {
  it("bad recipient returns {ok: false} and provider is not called", async () => {
    const provider = jest.fn<EmailProvider>().mockResolvedValue(undefined);
    const result = await sendEmail(badRecipient, provider);
    expect(result).toEqual({ ok: false, error: "invalid email" });
    expect(provider).not.toHaveBeenCalled();
  });
});

// email with blank subject returns {ok: false}
// subject = ""
describe("blankSubject", () => {
  it("blank subject returns {ok: false}", async () => {
    const provider = jest.fn<EmailProvider>().mockResolvedValue(undefined);
    const result = await sendEmail(blankSubject, provider);
    expect(result).toEqual({ ok: false, error: "empty email subject" });
    expect(provider).not.toHaveBeenCalled();
  });
});

// email with blank subject returns {ok: false}
// subject = "   "
describe("blankSubject_whiteSpaces", () => {
  it("blank subject returns {ok: false}", async () => {
    const provider = jest.fn<EmailProvider>().mockResolvedValue(undefined);
    const result = await sendEmail(blankSubject_whiteSpaces, provider);
    expect(result).toEqual({ ok: false, error: "empty email subject" });
    expect(provider).not.toHaveBeenCalled();
  });
});

// email with blank text returns {ok: false}
// text = ""
describe("blankText", () => {
  it("blank text returns {ok: false}", async () => {
    const provider = jest.fn<EmailProvider>().mockResolvedValue(undefined);
    const result = await sendEmail(blankText, provider);
    expect(result).toEqual({ ok: false, error: "empty email text" });
    expect(provider).not.toHaveBeenCalled();
  });
});

// email with blank text returns {ok: false}
// text = "   "
describe("blankText_whiteSpaces", () => {
  it("blank text returns {ok: false}", async () => {
    const provider = jest.fn<EmailProvider>().mockResolvedValue(undefined);
    const result = await sendEmail(blankText_whiteSpaces, provider);
    expect(result).toEqual({ ok: false, error: "empty email text" });
    expect(provider).not.toHaveBeenCalled();
  });
});

// provider that throws "boom" gives {ok: false} and sendEmail never throws
describe("provider failure", () => {
  it("returns providers error without throwing", async () => {
    const provider = jest
      .fn<EmailProvider>()
      .mockRejectedValue(new Error("boom"));
    const result = await sendEmail(validMessage, provider);
    expect(result).toEqual({ ok: false, error: "boom" });
    expect(provider).toHaveBeenCalledWith(validMessage);
  });
});
