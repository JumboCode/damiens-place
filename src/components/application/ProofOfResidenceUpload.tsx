/**
 * ProofOfResidenceUpload.tsx
 *
 * Handles the file upload feature, ensuring  that files are the correct type
 * and size.
 *
 * Author: Rim, Abby
 * Date Created: 10/14/2026
 */

// This line is needed because the component reacts to clicks and uploads
"use client";

import { upload } from "@vercel/blob/client";
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
  // useState's for file name, file upload error, and whether we're uploading
  const [fileName, setFileName] = useState("");
  const [fileUploadError, setFileUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // if file is no one of the accepted types or is too big, set an error
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE_BYTES) {
      setFileUploadError("wrong file type or file size");
    }

    // clear any old errors and start uploading
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
    }
  }

  return (
    <div>
      {/* label "Proof of Residence" with the red asterisk, plus the helper text (see Figma) */}
      <div className="upload-field">
        <p className="upload-label">
          Proof of Residence
          <span className="required">*</span>
        </p>
        <div className="header-helper-space"></div>
        <p className="helper-text">
          Volunteers should live within 25-mile radius from Damien&apos;s Food
          Pantry, upload relevant documents that prove that you meet the
          requirement.
        </p>
        <div className="helper-upload-space"></div>
        <label htmlFor="fileInput" className="uploadLabel">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8.00001 10.0002C8.00001 8.93931 8.42143 7.9219 9.17158 7.17175C9.92172 6.4216 10.9391 6.00018 12 6.00018C13.0609 6.00018 14.0783 6.4216 14.8284 7.17175C15.5786 7.9219 16 8.93931 16 10.0002V11.0002H17C17.4596 11.0002 17.9148 11.0907 18.3394 11.2666C18.764 11.4425 19.1499 11.7003 19.4749 12.0253C19.7999 12.3503 20.0577 12.7361 20.2336 13.1608C20.4095 13.5854 20.5 14.0406 20.5 14.5002C20.5 14.9598 20.4095 15.4149 20.2336 15.8396C20.0577 16.2642 19.7999 16.65 19.4749 16.9751C19.1499 17.3001 18.764 17.5579 18.3394 17.7338C17.9148 17.9096 17.4596 18.0002 17 18.0002H16C15.7348 18.0002 15.4804 18.1055 15.2929 18.2931C15.1054 18.4806 15 18.735 15 19.0002C15 19.2654 15.1054 19.5197 15.2929 19.7073C15.4804 19.8948 15.7348 20.0002 16 20.0002H17C18.3791 20.0019 19.7086 19.4855 20.7249 18.5533C21.7412 17.621 22.3702 16.341 22.4872 14.9668C22.6042 13.5927 22.2007 12.2247 21.3566 11.134C20.5126 10.0434 19.2896 9.30961 17.93 9.07818C17.7104 7.66306 16.9919 6.37314 15.9044 5.44141C14.8169 4.50968 13.4321 3.99756 12 3.99756C10.5679 3.99756 9.1831 4.50968 8.0956 5.44141C7.0081 6.37314 6.28964 7.66306 6.07001 9.07818C4.71489 9.31475 3.49755 10.0504 2.65794 11.14C1.81833 12.2297 1.41736 13.5943 1.53407 14.965C1.65078 16.3357 2.2767 17.6129 3.28846 18.5449C4.30021 19.4769 5.6244 19.9961 7.00001 20.0002H8.00001C8.26522 20.0002 8.51958 19.8948 8.70711 19.7073C8.89465 19.5197 9.00001 19.2654 9.00001 19.0002C9.00001 18.735 8.89465 18.4806 8.70711 18.2931C8.51958 18.1055 8.26522 18.0002 8.00001 18.0002H7.00001C6.54038 18.0002 6.08525 17.9096 5.66061 17.7338C5.23597 17.5579 4.85014 17.3001 4.52513 16.9751C4.20013 16.65 3.94232 16.2642 3.76643 15.8396C3.59054 15.4149 3.50001 14.9598 3.50001 14.5002C3.50001 14.0406 3.59054 13.5854 3.76643 13.1608C3.94232 12.7361 4.20013 12.3503 4.52513 12.0253C4.85014 11.7003 5.23597 11.4425 5.66061 11.2666C6.08525 11.0907 6.54038 11.0002 7.00001 11.0002H8.00001V10.0002ZM15.707 13.2932L12.707 10.2932C12.5195 10.1057 12.2652 10.0004 12 10.0004C11.7348 10.0004 11.4805 10.1057 11.293 10.2932L8.29301 13.2932C8.1975 13.3854 8.12131 13.4958 8.0689 13.6178C8.01649 13.7398 7.98891 13.871 7.98776 14.0038C7.9866 14.1366 8.0119 14.2682 8.06218 14.3911C8.11247 14.514 8.18672 14.6257 8.28061 14.7196C8.3745 14.8135 8.48616 14.8877 8.60905 14.938C8.73195 14.9883 8.86363 15.0136 8.99641 15.0124C9.12919 15.0113 9.26041 14.9837 9.38241 14.9313C9.50441 14.8789 9.61476 14.8027 9.70701 14.7072L11 13.4142V19.0002C11 19.2654 11.1054 19.5197 11.2929 19.7073C11.4804 19.8948 11.7348 20.0002 12 20.0002C12.2652 20.0002 12.5196 19.8948 12.7071 19.7073C12.8946 19.5197 13 19.2654 13 19.0002V13.4142L14.293 14.7072C14.4816 14.8893 14.7342 14.9901 14.9964 14.9879C15.2586 14.9856 15.5094 14.8804 15.6948 14.695C15.8802 14.5096 15.9854 14.2588 15.9877 13.9966C15.99 13.7344 15.8892 13.4818 15.707 13.2932V13.2932Z"
              fillRule="evenodd"
              clipRule="evenodd"
              fill="#949BA8"
            />
          </svg>
          {isUploading ? "Uploading..." : fileName || "Upload Document"}
        </label>
        <input
          className="hidden"
          id="fileInput"
          type="file"
          accept=".pdf,image/jpeg,image/png"
          onChange={handleFileChange}
        ></input>
      </div>

      {/*  show each state: "Upload document", "Uploading...", the file name when it's done,
          and the error message (give it role="alert") */}
      <div id="uploadingState">{isUploading}</div>
      <div id="fileState">{fileName}</div>
      <div id="UploadError">{fileUploadError}</div>
    </div>
  );
}
