/**
 * CommonFileViewer.tsx
 *
 * Common file viewer card to be used across the application. Shows a PDF
 * symbol, the file's name, and an optional file size. Clicking the eye icon
 * opens the file in a new tab.
 *
 * Author: Natalie Phua
 * Date Created: 11/19/2026
 */

import Image from "next/image";
import { Eye } from "lucide-react";
import PdfSymbol from "@/assets/icons/pdf-symbol.svg";

type CommonFileViewerProps = {
  url: string;
  fileName?: string;
  fileSize?: string;
  // Hide the eye icon for viewers who aren't allowed to open the file
  canOpen?: boolean;
};

/**
 * Pulls the file name out of an upload url.
 *
 * @param url - The url of the uploaded file.
 * @returns The decoded file name, or the whole url if it can't be parsed.
 */
function fileNameFromUrl(url: string): string {
  try {
    const lastSegment = new URL(url).pathname.split("/").pop() ?? "";
    return decodeURIComponent(lastSegment) || url;
  } catch {
    return url;
  }
}

/**
 * CommonFileViewer
 *
 * @param url - The file's url, opened in a new tab by the eye icon.
 * @param fileName - Name to display, defaults to the name found in the url.
 * @param fileSize - Optional size label shown under the name.
 * @param canOpen - Whether to show the eye icon, defaults to true.
 * @returns A bordered card showing the file with a view button.
 */
export default function CommonFileViewer({
  url,
  fileName,
  fileSize,
  canOpen = true,
}: CommonFileViewerProps) {
  const name = fileName ?? fileNameFromUrl(url);

  return (
    <div className="flex w-full items-center gap-2 mt-2 rounded-lg border border-gray-300 bg-white px-4 py-4">
      <Image src={PdfSymbol} alt="" className="h-12 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-lg font-medium"> {name} </p>
        {fileSize && <p className="text-sm text-gray-500">{fileSize}</p>}
      </div>
      {canOpen && (
        <a
          href={`/api/uploads/file-view?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${name}`}
          className="shrink-0 text-gray-500 transition-colors duration-200 hover:text-black"
        >
          <Eye size={20} />
        </a>
      )}
    </div>
  );
}
