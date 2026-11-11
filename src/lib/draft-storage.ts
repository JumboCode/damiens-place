/**
 * draft-storage.ts
 *
 * Helper functions for storing a user's draft ID in local storage.
 *
 * Author: Luisa and Rim
 * Date Created: 11/08/2026
 */

// The only part of localStorage we use. The tests pass in a fake with just these three.
export type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const DRAFT_ID_KEY = "damiens-place-draft-id";

/**
 * getBrowserStorage
 *
 * Returns windows.localStorage if windows exists and is not blocked by the browser.
 *
 * @param DraftStorage - inputted information stored in localStorage
 * @returns windows.localStorage if window exists, otherwise null
 * @throws if window does not exist or the browser blocks it
 */
function getBrowserStorage(): DraftStorage | null {
  // ASK: window.localStorage, or null if there's no `window` or the browser blocks it (it can throw)
  let storage;
  try {
    storage = window.localStorage;
    return storage;
  } catch {
    return null;
  }
}

/**
 * saveDraftId
 *
 * Saves the applicant's draft ID in localStorage so they can return to it later.
 *
 * @param id - The draft ID to save in localStorage.
 * @param storage - The storage to use, or null if not available.
 * @returns nothing - storage errors are ignored.
 */
export function saveDraftId(
  id: string,
  storage: DraftStorage | null = getBrowserStorage(),
): void {
  // setItem inside a try/catch (broken storage must never break the form)
  try {
    storage?.setItem(DRAFT_ID_KEY, id);
  } catch {
    // ignore storage errors.
  }
}

/**
 * loadDraftId
 *
 * Gets the applicant's draft ID from localStorage so they can return to it later.
 *
 * @param storage - The storage to use, or null if not available.
 * @returns the saved draft ID, or null if not found or storage is unavailable.
 */
export function loadDraftId(
  storage: DraftStorage | null = getBrowserStorage(),
): string | null {
  // getItem inside a try/catch. null if nothing is saved
  try {
    return storage?.getItem(DRAFT_ID_KEY) ?? null;
  } catch {
    return null;
  }
}

/**
 * clearDraftId
 *
 * Removes the applicant's draft ID from localStorage.
 *
 * @param storage - The storage to use, or null if not available.
 * @returns nothing, storage errors are ignored.
 */
export function clearDraftId(
  storage: DraftStorage | null = getBrowserStorage(),
): void {
  // removeItem inside a try/catch
  try {
    storage?.removeItem(DRAFT_ID_KEY);
  } catch {
    // ignore storage errors.
  }
}
