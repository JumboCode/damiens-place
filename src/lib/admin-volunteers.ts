/**
 * admin-volunteers.ts
 *
 * extracts search parameters from volunteer api call
 *
 * created by William Balz and Alex Li 21 November 2026
 *
 */

/**
 * helper for volunteer query which parses parameters
 * @param searchParams - the query parameters to parse
 * @returns the data with all query parameters
 * returns error if sort or order is invalid type
 */
export function parseVolunteerListQuery(searchParams: URLSearchParams) {
  const q = searchParams.get("q")?.trim() || null;

  const sort = searchParams.get("sort") ?? "name";

  if (sort !== "name" && sort !== "hours") {
    return { error: "sort" };
  }

  const order = searchParams.get("order") ?? "asc";

  if (order !== "asc" && order !== "desc") {
    return { error: "order" };
  }

  return { data: { q, sort, order } };
}
