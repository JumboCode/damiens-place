/**
 * admin-tabs.test.ts
 *
 * Tests for isActiveTab: own page, a page under the tab, a different tab, and
 * a path that only shares the same starting letters.
 *
 * Author: Jeremiah and Carter
 * Date Created: 11/8/26
 */
import { describe, expect, it } from "@jest/globals";
import { isActiveTab } from "./admin-tabs";

describe("isActiveTab", () => {
  it("is active on the tab's own page", () => {
    expect(isActiveTab("/admin/applicants", "/admin/applicants")).toBe(true);
  });

  it("is active on a page under the tab", () => {
    expect(isActiveTab("/admin/applicants/abc123", "/admin/applicants")).toBe(
      true,
    );
  });

  it("is not active on a different tab", () => {
    expect(isActiveTab("/admin/volunteers", "/admin/applicants")).toBe(false);
  });

  it("doesn't match a path that only starts with the same letters", () => {
    expect(isActiveTab("/admin/applicants-old", "/admin/applicants")).toBe(
      false,
    );
  });
});
