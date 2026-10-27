/**
 * PdfViewer.tsx
 *
 * Shows a PDF in the page, plus a link to open it in a new tab
 * (some browsers, especially phones, can't show PDFs inside a page).
 */

type PdfViewerProps = {
  src: string; // the PDF's address, like "/documents/handbook.pdf"
  title: string; // describes the PDF for screen readers
};

export default function PdfViewer({ src, title }: PdfViewerProps) {
  return (
    <div className="flex flex-col gap-2">
      <iframe
        src={src}
        title={title}
        className="h-96 w-full border md:h-[600px]"
      />
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Open {title} in a new tab
      </a>
    </div>
  );
}
