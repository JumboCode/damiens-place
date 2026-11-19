/**
 * file-view/route.ts
 *
 * Streams a private uploaded file from Vercel Blob so signed-in admins and
 * active volunteers can open it in the browser. Private blob urls return 403
 * when opened directly.
 *
 * Author: Natalie Phua
 * Date Created: 11/19/2026
 */
import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { requireVolunteer } from "@/lib/volunteer-auth";

/**
 * GET /api/uploads/file-view?url=<blob url>
 *
 * Auth: admin or active volunteer
 * Params:
 *   url - the Vercel Blob url of the uploaded file
 * Returns:
 *   200 - the file's bytes, shown inline
 * Errors:
 *   400 - url missing or not a proof of residence upload
 *   401 - not signed in
 *   403 - signed in but not an admin or active volunteer
 *   404 - file not found in Blob
 */
export async function GET(request: Request) {
  // Admins pass first; otherwise fall back to the volunteer session
  const adminDenied = await requireAdmin();
  if (adminDenied) {
    const volunteer = await requireVolunteer();
    if ("response" in volunteer) return adminDenied;
  }

  const url = new URL(request.url).searchParams.get("url");

  let isProofUpload = false;
  try {
    isProofUpload =
      !!url && new URL(url).pathname.startsWith("/proof-of-residence/");
  } catch {
    // an unparseable url is rejected below
  }
  if (!url || !isProofUpload) {
    return NextResponse.json({ error: "Invalid file url." }, { status: 400 });
  }

  try {
    const result = await get(url, { access: "private" });
    if (!result || result.statusCode !== 200) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }
    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
