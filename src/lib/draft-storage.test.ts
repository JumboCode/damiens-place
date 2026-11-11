/**
 * draft-storage.test.ts
 *
 * Tests draft-storage
 *
 * Author: Luisa and Rim
 * Date Created: 11/08/2026
 */

import { describe, expect, it } from "@jest/globals";
import { clearDraftId, loadDraftId, saveDraftId } from "./draft-storage";
import type { DraftStorage } from "./draft-storage";

// A tiny stand-in for localStorage that keeps its values in a plain object
function makeFakeStorage(): DraftStorage {
  const values: Record<string, string> = {};
  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value;
    },
    removeItem: (key) => {
      delete values[key];
    },
  };
}

// A stand-in for a browser that blocks storage: every call throws
const blockedStorage: DraftStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};

describe("draft storage", () => {
  it("returns null when nothing is saved", () => {
    expect(loadDraftId(makeFakeStorage())).toBeNull();
  });

  it("loads the id that was saved", () => {
    const storage = makeFakeStorage();
    saveDraftId("draft-1", storage);
    expect(loadDraftId(storage)).toBe("draft-1");
  });

  it("forgets the id after it is cleared", () => {
    const storage = makeFakeStorage();
    saveDraftId("draft-1", storage);
    clearDraftId(storage);
    expect(loadDraftId(storage)).toBeNull();
  });

  it("never throws when storage is blocked or missing", () => {
    for (const storage of [blockedStorage, null]) {
      expect(() => saveDraftId("draft-1", storage)).not.toThrow();
      expect(() => clearDraftId(storage)).not.toThrow();
      expect(loadDraftId(storage)).toBeNull();
    }
  });
});
