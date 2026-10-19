/**
 * ProofOfResidenceUpload.tsx
 *
 * Handles the file upload feature, ensuring  that files are the correct type
 * and size.
 *
 * Author: Rim, Abby
 * Date Created: 10/14/2026
 */
"use client";

import { upload } from "@vercel/blob/client";
import { CloudUpload } from "lucide-react";
import { useState } from "react";

type ProofOfResidenceUploadProps = {
  // Called with the uploaded file's URL once the upload succeeds
  onUploaded: (url: string) => void;
};

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export default function ProofOfResidenceUpload({
  onUploaded,
}: ProofOfResidenceUploadProps) {
  const [fileName, setFileName] = useState("");
  const [fileUploadError, setFileUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileUploadError("Please upload a PDF, JPG, or PNG file.");
      input.value = "";
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setFileUploadError(
        "That file is too big. Please upload one under 10 MB.",
      );
      input.value = "";
      return;
    }

    setFileUploadError("");
    setIsUploading(true);
    try {
      const blob = await upload(`proof-of-residence/${file.name}`, file, {
        access: "private",
        handleUploadUrl: "/api/uploads/proof-of-residence",
      });
      setFileName(file.name);
      onUploaded(blob.url);
    } catch {
      setFileUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      // Clear the input so picking the same file again still counts as a change
      input.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-base font-medium">
        Proof of Residence <span className="text-error-msg">*</span>
      </p>
      <p id="proof-of-residence-help" className="text-sm">
        Volunteers should live within 25-mile radius from Damien&apos;s Food
        Pantry, upload relevant documents that prove that you meet the
        requirement.
      </p>

      {/* The whole dashed box is the label, so clicking anywhere in it opens the file picker */}
      <label
        htmlFor="proofOfResidence"
        className="flex h-32 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-input-regular-frame bg-input-box text-muted-foreground hover:border-input-hover-frame focus-within:border-input-focus-frame focus-within:ring-2 focus-within:ring-input-focus-frame"
      >
        <CloudUpload className="size-4" aria-hidden="true" />
        <span aria-live="polite">
          {isUploading ? "Uploading..." : fileName || "Upload document"}
        </span>
        {/* sr-only hides the input but keeps it reachable with the Tab key */}
        <input
          id="proofOfResidence"
          className="sr-only"
          type="file"
          accept=".pdf,image/jpeg,image/png"
          disabled={isUploading}
          onChange={handleFileChange}
          aria-describedby={
            fileUploadError
              ? "proof-of-residence-help proof-of-residence-error"
              : "proof-of-residence-help"
          }
        />
      </label>

      {fileUploadError ? (
        <p
          id="proof-of-residence-error"
          role="alert"
          className="text-sm text-error-msg"
        >
          {fileUploadError}
        </p>
      ) : null}
    </div>
  );
}
