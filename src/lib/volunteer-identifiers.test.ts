/**
 * volunteer-identifiers.test.ts
 *
 * Tests for the normalizeEmail and normalizeCellPhone functions.
 *
 * Author: Adrien and Elijah
 * Date Created: 10/12/2026
 */

import { describe, expect, it } from "@jest/globals";
import { normalizeEmail, normalizeCellPhone } from "./volunteer-identifiers";

describe("normalizeEmail", () => {
  it("trims whitespace and lowercases the email", () => {
    expect(normalizeEmail("  Jane@X.COM ")).toBe("jane@x.com");
  });

  it("trims extra trailing whitespace", () => {
    expect(normalizeEmail("  John@gmail.com     ")).toBe("john@gmail.com");
  });

  it("lowercases mixed-case usernames", () => {
    expect(normalizeEmail("  FrankM@outlook.com ")).toBe("frankm@outlook.com");
  });
});

describe("normalizeCellPhone", () => {
  it("strips parentheses, spaces, and dashes", () => {
    expect(normalizeCellPhone("(617) 555-0123")).toBe("6175550123");
  });

  it("strips dashes", () => {
    expect(normalizeCellPhone("617-555-0123")).toBe("6175550123");
  });

  it("removes the +1 country code and spaces", () => {
    expect(normalizeCellPhone("+1 617 555 0123")).toBe("6175550123");
  });

  it("removes the +1 country code and parentheses", () => {
    expect(normalizeCellPhone("+1 (617)5550123")).toBe("6175550123");
  });
});
