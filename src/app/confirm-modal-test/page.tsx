/**
 * page.tsx (confirm-modal-test)
 *
 * Temporary test page for ConfirmModal. Delete when ConfirmModal is merged.
 *
 * Author: Natalie Phua
 * Date Created: 10/28/2026
 */
"use client";

import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import Check from "@/assets/icons/check.svg";
import Image from "next/image";

type Open = "confirm" | "result" | null;

export default function ConfirmModalTestPage() {
  const [open, setOpen] = useState<Open>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failNext, setFailNext] = useState(false);
  const [log, setLog] = useState("Nothing yet");

  // Pretends to be a request that takes 1.5 seconds
  function handleConfirm() {
    setBusy(true);
    setError(null);
    setTimeout(() => {
      setBusy(false);
      if (failNext) {
        setError("Something went wrong. Try again.");
        return;
      }
      setLog("Confirmed");
      setOpen("result");
    }, 1500);
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <h1 className="text-xl font-bold">ConfirmModal test</h1>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={failNext}
          onChange={(e) => setFailNext(e.target.checked)}
        />
        Make Confirm fail (shows the error, popup stays open)
      </label>
      <button
        type="button"
        className="w-fit rounded border px-3 py-1"
        onClick={() => {
          setError(null);
          setOpen("confirm");
        }}
      >
        Show confirm popup
      </button>
      <p>Last thing that happened: {log}</p>

      {open === "confirm" && (
        <ConfirmModal
          title="Are you sure?"
          content="This decision cannot be undone."
          onConfirm={handleConfirm}
          onCancel={() => {
            setLog("Cancelled");
            setError(null);
            setOpen(null);
          }}
          busy={busy}
          error={error}
        />
      )}

      {open === "result" && (
        <ConfirmModal
          title="yay the modal works"
          content="test modal"
          confirmTitle="Close"
          icon={
            <Image
              src={Check}
              alt="Check"
              className="w-1/3 h-auto object-contain mx-auto"
            />
          }
          onConfirm={() => {
            setLog("Closed the result popup");
            setOpen(null);
          }}
        />
      )}
    </main>
  );
}
