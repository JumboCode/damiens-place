/**
 * proof-of-residence/route.ts
 *
 * Checks the allowed content types and ensures it has the correct pathname start. Uploads to Vercel blob
 *
 * Author: Rim, Abby
 * Date Created: 10/14/2026
 */
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

/**
 * <METHOD> /api/uploads/proof-of-residence
 *
 * Authenticating and authorizing the user making the upload request. As well as generating tokens for client uploads. Finally, will upload the database with the URL of the uploaded.
 *
 * Auth: public
 * Params:
 *   none
 * Body:
 *   Vercel blob token request (HandleUploadedBody)
 * Returns:
 *    200 - JSON response handled by HandleUpload
 * Errors:
 *   400 - upload rejected
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    // handleUpload does the token handshake with Vercel Blob for us. We only decide the rules.
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // throw an Error if the pathname doesn't start with "proof-of-residence/".
        if (!pathname.startsWith("proof-of-residence")) {
          throw new Error("Invalid upload location");
        }
        return {
          // allowedContentTypes: only PDF, JPEG, and PNG
          allowedContentTypes: ["image/jpeg", "image/png", "application/pdf"],
          // maximumSizeInBytes: 10 MB
          maximumSizeInBytes: 10 * 1024 * 1024,
          // Adds random characters to the file name so two people can upload "bill.pdf"
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    // The Blob library expects a 400 when we reject an upload
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
