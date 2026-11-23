import { describe, expect, it } from "@jest/globals";
import { parseVolunteerListQuery } from "./admin-volunteers";

describe("parseVolunteerListQuery", () => {
  it("returns defaults when no parameters are provided", () => {
    const result = parseVolunteerListQuery(new URLSearchParams());

    expect(result).toEqual({
      data: {
        q: null,
        sort: "name",
        order: "asc",
      },
    });
  });
  it("rejects bad sort", () => {
    const result = parseVolunteerListQuery(new URLSearchParams("sort=x"));

    expect(result).toEqual({
      error: "sort",
    });
  });
  it("rejects bad order", () => {
    const result = parseVolunteerListQuery(new URLSearchParams("order=x"));

    expect(result).toEqual({
      error: "order",
    });
  });

  it("accepts valid sort values", () => {
    expect(parseVolunteerListQuery(new URLSearchParams("sort=name"))).toEqual({
      data: {
        q: null,
        sort: "name",
        order: "asc",
      },
    });
    expect(parseVolunteerListQuery(new URLSearchParams("sort=hours"))).toEqual({
      data: {
        q: null,
        sort: "hours",
        order: "asc",
      },
    });
  });
  it("accepts valid order values", () => {
    expect(parseVolunteerListQuery(new URLSearchParams("order=asc"))).toEqual({
      data: {
        q: null,
        sort: "name",
        order: "asc",
      },
    });
    expect(parseVolunteerListQuery(new URLSearchParams("order=desc"))).toEqual({
      data: {
        q: null,
        sort: "name",
        order: "desc",
      },
    });
  });
});
