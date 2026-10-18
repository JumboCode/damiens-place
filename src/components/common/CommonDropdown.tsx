/**
 * CommonDropdown.tsx
 *
 * Common multi-select dropdown to be used across the application.
 *
 * Collapsed = empty field with a right-pointing chevron.
 * Expanded = down-pointing chevron and a list of options below it.
 * Selected options = gray background, white text, and a check mark.
 * Any number of options can be selected, and clicking a selected one unselects it.
 *
 * Author: Natalie Phua
 * Date Created: 10/17/2026
 */

"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

export type DropdownOption = {
  value: string; // what gets saved, like an id
  label: string; // what the person sees
};

type CommonDropdownProps = {
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string; // shown in the field when nothing is selected
  error?: string;
  className?: string; // for the outer wrapper, like a max width
};

export default function CommonDropdown({
  options,
  selectedValues,
  onChange,
  placeholder = "",
  error,
  className = "",
}: CommonDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // useId gives every dropdown on a page its own ids, so labels and errors
  // stay connected to the right one
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;
  const errorId = `${id}-error`;

  // Close the panel when the person clicks anywhere outside the dropdown
  useEffect(() => {
    if (!open) return;

    function handleMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  function toggleOption(value: string) {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((selected) => selected !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  }

  // Escape closes the panel and puts focus back on the button
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  const fieldText =
    selectedValues.length > 0
      ? `${selectedValues.length} selected`
      : placeholder;

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative flex flex-col gap-2 ${className}`.trim()}
    >
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-describedby={error ? errorId : undefined}
        onClick={() => setOpen(!open)}
        className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-md border bg-input-box px-3 text-left text-black enabled:cursor-pointer enabled:hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          error ? "border-error-msg" : "border-input-regular-frame"
        }`}
      >
        <span className="truncate">{fieldText}</span>
        {/* Right-pointing chevron when collapsed, down-pointing when expanded */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={open ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"} />
        </svg>
      </button>

      {open ? (
        <ul
          id={panelId}
          className="absolute top-full z-10 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-input-regular-frame bg-input-box"
        >
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);

            return (
              <li
                key={option.value}
                className="border-b border-input-regular-frame last:border-b-0"
              >
                {/* The checkbox is hidden but still real, so keyboards and screen readers work.
                    Tab to an option and press Space to select it. */}
                <label
                  className={`flex min-h-12 cursor-pointer items-center justify-between gap-2 px-4 py-3 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary ${
                    isSelected
                      ? "bg-gray-400 text-white"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => toggleOption(option.value)}
                  />
                  <span>{option.label}</span>
                  {isSelected ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  ) : null}
                </label>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? (
        <p id={errorId} className="text-sm text-error-msg">
          {error}
        </p>
      ) : null}
    </div>
  );
}
