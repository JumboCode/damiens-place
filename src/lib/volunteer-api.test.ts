/**
 * volunteer-api.test.ts
 *
 * Tests volunteer profile requests and logout with mocked fetch responses
 *
 * Author: William
 * Date created: 15 November 2026
 */
import {
  fetchVolunteer,
  logoutVolunteer,
  type Volunteer,
} from "./volunteer-api";

const originalFetch = global.fetch;

// Replaces fetch with one that answers with a made-up response.
function mockFetch(status: number, json: () => Promise<unknown>) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json,
  }) as unknown as typeof fetch;
}

afterEach(() => {
  global.fetch = originalFetch;
});

describe("fetchVolunteer", () => {
  it("returns the volunteer for a 200 response", async () => {
    const volunteer: Volunteer = {
      id: "v1",
      status: "ACTIVE",
      firstName: "Sam",
      lastName: "Taylor",
      email: "sam@example.com",
      cellPhone: "5551234567",
      homePhone: null,
      photoUrl: null,
      photoConsent: true,
      emergencyContactName: "Alex Taylor",
      emergencyContactPhone: "5559876543",
      emergencyContactRelationship: "Sibling",
      positions: [{ id: "p1", name: "Food distribution" }],
    };
    mockFetch(200, async () => ({ volunteer }));

    expect(await fetchVolunteer("v1")).toEqual({ ok: true, volunteer });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/volunteers/v1",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("encodes the id in the address", async () => {
    mockFetch(404, async () => ({ error: "Volunteer not found" }));
    await fetchVolunteer("a/b?c#d");

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/volunteers/a%2Fb%3Fc%23d",
      expect.anything(),
    );
  });

  it("returns notFound true and the server's message for a 404", async () => {
    mockFetch(404, async () => ({ error: "Volunteer not found" }));

    expect(await fetchVolunteer("v1")).toEqual({
      ok: false,
      message: "Volunteer not found",
      notFound: true,
    });
  });

  it("returns notFound false and the server's message for a 500", async () => {
    mockFetch(500, async () => ({ error: "Internal server error" }));

    expect(await fetchVolunteer("v1")).toEqual({
      ok: false,
      message: "Internal server error",
      notFound: false,
    });
  });

  it("returns a fallback message when an error has no message", async () => {
    mockFetch(500, async () => ({}));

    expect(await fetchVolunteer("v1")).toEqual({
      ok: false,
      message: expect.stringMatching(/\S/),
      notFound: false,
    });
  });

  it.each([200, 404, 500])(
    "returns a failure when a %i response isn't JSON",
    async (status) => {
      mockFetch(status, async () => {
        throw new Error("not json");
      });

      expect(await fetchVolunteer("v1")).toEqual({
        ok: false,
        message: expect.stringMatching(/\S/),
        notFound: status === 404,
      });
    },
  );

  it("doesn't throw when fetch fails", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("offline")) as unknown as typeof fetch;

    expect(await fetchVolunteer("v1")).toEqual({
      ok: false,
      message: expect.stringMatching(/\S/),
      notFound: false,
    });
  });
});

describe("logoutVolunteer", () => {
  it.each([200, 204])(
    "posts to logout and returns true for a %i",
    async (status) => {
      // Logout succeeds even if the response has no JSON body.
      const json = jest.fn().mockRejectedValue(new Error("no body"));
      mockFetch(status, json);

      expect(await logoutVolunteer()).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/volunteer/logout",
        expect.objectContaining({ method: "POST" }),
      );
      expect(json).not.toHaveBeenCalled();
    },
  );

  it.each([401, 500])("returns false for a %i response", async (status) => {
    mockFetch(status, async () => ({ error: "Logout failed" }));

    expect(await logoutVolunteer()).toBe(false);
  });

  it("returns false without throwing when fetch fails", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("offline")) as unknown as typeof fetch;

    expect(await logoutVolunteer()).toBe(false);
  });
});
