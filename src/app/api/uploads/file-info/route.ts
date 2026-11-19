/**
 * file-info/route.ts
 *
 * Looks up the size of an uploaded proof of residence file in Vercel Blob.
 *
 * Author: Natalie Phua
 * Date Created: 11/19/2026
 */
import { head } from "@vercel/blob";
import { NextResponse } from "next/server";

/**
 * GET /api/uploads/file-info?url=<blob url>
 *
 * Auth: public
 * Params:
 *   url - the Vercel Blob url of the uploaded file
 * Returns:
 *   200 - { size: number } in bytes
 * Errors:
 *   400 - url missing or not a proof of residence upload
 *   404 - file not found in Blob
 */
export async function GET(request: Request) {
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
    const blob = await head(url);
    return NextResponse.json({ size: blob.size });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
