/**
 * resource.ts
 *
 * Validates resource fields and returns
 * a new body with trimmed values
 *
 * Author: Carter & Adrien
 * Date Created: Nov/27/2026
 */

// Resources the app finds by a fixed id. These can be edited, but never deleted.
// TODO(natalie): final list of protected ids (BE-resources-api)
export const PROTECTED_RESOURCE_IDS = ["handbook"];

/**
 * resource.ts /src/lib
 *
 * @param body - The parsed JSON request body.
 * @param requireAll - Boolean to determine if both fields are required
 * @returns a new body with trimmed values or an error
 */
export function validateResourceFields(body: unknown, requireAll: boolean) {
  // TODO: the body must be a plain object. Every key must be title or fileUrl.
  if (typeof body !== "object" || body === null) {
    return false;
  }
  const keys = Object.entries(body);
  const trimmed_data: Record<string, string> = {};
  for (const [key, value] of keys) {
    if (key !== "title" && key !== "fileUrl") {
        return { error: `Field ${key} must be 'title or 'fileUrl'` };
    }
    const trimmed = value.trim();
    if (trimmed === "") {
        return { error: `Value for ${key} must be a non-empty string` };
    }
    trimmed_data[key] = trimmed;
    if (requireAll && (!("title" in body)) || (!("fileUrl" in body))) {
        return { error: "Resource fields must contain 'title' & 'fileUrl if requireAll" };
    }
  }

  return { trimmed_data };
  // TODO: each field sent is a non-empty string once trimmed.
  // TODO: requireAll (POST) needs both fields. Otherwise (PATCH) at least one.
  // TODO: return { data } with the trimmed values, or { error } naming the bad field. Never throws.
}