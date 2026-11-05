/**
 * ReviewSection.tsx
 *
 * Reusable component for displaying a section of the application review page.
 * Shows the section title, an Edit button, and the applicant's answers.
 *
 * Author: Adrien and Luisa
 * Date Created: 11/03/2026
 */
import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

type ReviewSectionProps = {
  title: string;
  onEdit: () => void;
  children: ReactNode; // the rows
};

/**
 * ReviewSection
 *
 * Renders a review section with a title, an Edit button, and its content.
 *
 * @param title - The heading displayed for the section.
 * @param onEdit - Function called when the Edit button is clicked.
 * @param children - The rows of applicant information displayed in the section.
 * @returns A section containing the heading, Edit button, and answer rows.
 */
export default function ReviewSection({
  title,
  onEdit,
  children,
}: ReviewSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      {/* Section title on the left and Edit button on the right */}
      {/* Section title and Edit button next to each other */}
      <div className="flex items-center gap-2">
        <h3>{title}</h3>

        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="rounded-md p-2 text-primary hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Pencil size={20} />
        </button>
      </div>
      {/* One column on phones, three on desktop */}
      <dl className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</dl>
    </section>
  );
}
