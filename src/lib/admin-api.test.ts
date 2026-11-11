/**
 * admin-api.test.ts
 *
 * tests admin-api.ts
 *
 * Author: Abby, Alex
 * Date Created: 11/06/26
 */
import { decideApplicant } from "./admin-api";

const originalFetch = global.fetch;

// Replaces fetch with one that answers with a made-up response
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

describe("decideApplicant", () => {
  it("posts to the approve endpoint", async () => {
    mockFetch(200, async () => ({ applicant: { id: "a1" } }));
    expect(await decideApplicant("a1", "approve")).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/applicants/a1/approve",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("posts to the reject endpoint", async () => {
    mockFetch(200, async () => ({ applicant: { id: "a1" } }));
    expect(await decideApplicant("a1", "reject")).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/applicants/a1/reject",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("encodes the id in the address", async () => {
    mockFetch(200, async () => ({}));
    await decideApplicant("a/b", "approve");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/applicants/a%2Fb/approve",
      expect.anything(),
    );
  });

  it("returns the server's message on an error", async () => {
    mockFetch(409, async () => ({}));
    expect(await decideApplicant("a1", "approve")).toEqual({
      ok: false,
      message: expect.stringMatching("sometthing went wrong"),
    });
  });

  it("returns a message for a 403 with no body message", async () => {
    mockFetch(403, async () => ({}));
    expect(await decideApplicant("a1", "approve")).toEqual({
      ok: false,
      message: expect.stringMatching(/\S/),
    });
  });

  it("returns a message when the body isn't JSON", async () => {
    mockFetch(500, async () => {
      throw new Error("not json");
    });
    expect(await decideApplicant("a1", "reject")).toEqual({
      ok: false,
      message: expect.stringMatching(/\S/),
    });
  });

  it("doesn't throw when fetch fails", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("offline")) as unknown as typeof fetch;
    expect(await decideApplicant("a1", "reject")).toEqual({
      ok: false,
      message: expect.stringMatching(/\S/),
    });
  });
});
