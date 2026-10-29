/**
 * ConfirmModal.tsx
 *
 * Common pop-up that asks the user to confirm something (Cancel / Confirm).
 *
 * Author: Natalie Phua
 * Date Created: 10/28/2026
 */
"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import CommonButton from "./CommonButton";
import Check from "@/assets/icons/check.svg";

type ConfirmModalProps = {
  title: string;
  content?: ReactNode;
  confirmTitle?: string;
  cancelTitle?: string;
  onConfirm: () => void;
  // If left out, there is no Cancel button and Escape does nothing
  onCancel?: () => void;
  // Shown above the title, like a check mark
  icon?: ReactNode;
  // True while the parent is working (like waiting on a request). Disables both buttons.
  busy?: boolean;
  // An error message to show under the content, like "Something went wrong."
  error?: string | null;
};

/**
 * ConfirmModal
 *
 * A pop-up over a dark layer with a title, optional content, and a Confirm button.
 * A Cancel button shows too when onCancel is given.
 *
 * @param title - the heading
 * @param content - the text (or anything else) under the heading
 * @param confirmTitle - the text on the confirm button (default "Confirm")
 * @param cancelTitle - the text on the cancel button (default "Cancel")
 * @param onConfirm - called when the confirm button is clicked
 * @param onCancel - called when the cancel button is clicked or Escape is pressed
 * @param icon - something to show above the title
 * @param busy - disables both buttons while true
 * @param error - an error message to show, or null for none
 * @returns the modal
 */
export default function ConfirmModal({
  title,
  content,
  confirmTitle = "Confirm",
  cancelTitle = "Cancel",
  onConfirm,
  onCancel,
  icon,
  busy = false,
  error = null,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  // Unique ids so the dialog can point to its title and content for screen readers
  const titleId = useId();
  const contentId = useId();

  // Move keyboard focus into the dialog when it appears
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Escape cancels, unless there is no Cancel button or a request is running
  useEffect(() => {
    if (!onCancel || busy) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel?.();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, busy]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={content ? contentId : undefined}
        tabIndex={-1}
        className="relative flex max-h-full w-full max-w-md flex-col items-center gap-6 overflow-y-auto rounded-3xl bg-white p-8 text-center shadow-lg outline-none"
      >
        {icon}
        <h2 id={titleId} className="text-2xl font-bold text-text-primary">
          {title}
        </h2>
        {content && (
          <div id={contentId} className="text-md text-text-primary/70">
            {content}
          </div>
        )}
        {error && (
          <p role="alert" className="text-md font-medium text-error-msg">
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {onCancel && (
            <CommonButton
              title={cancelTitle}
              altStyle
              disabled={busy}
              onClick={onCancel}
            />
          )}
          <CommonButton
            title={confirmTitle}
            disabled={busy}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
}