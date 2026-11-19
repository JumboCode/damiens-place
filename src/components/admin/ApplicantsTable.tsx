/**
 * ApplicantsTable.tsx
 *
 * Applicants table section of admin dashboard.
 *
 * Author: Carter and Jeremiah
 * Date Created: 11/17/26
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApplicantSummary, fetchApplicants } from "@/lib/admin-api";
import {
  pantryMonthKey,
  shiftMonth,
  formatMonth,
  formatPantry,
} from "@/lib/time-conversion";

import Vector from "@/assets/icons/Vector.svg";

// Styles for the status pill
const STATUS_STYLES: Record<ApplicantSummary["status"], string> = {
  REJECTED: "bg-red-100 text-error-msg text-bold",
  APPROVED: "bg-green-100 text-emerald-500 text-bold",
  SUBMITTED: "bg-amber-100 text-amber-500 text-bold",
};

// Labels for the status pill
const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "applied",
  REJECTED: "rejected",
  APPROVED: "onboarded",
};

/**
 * initials
 *
 * Returns the initials of a name, e.g. "John Doe" -> "JD".
 *
 * @param name - The name to get initials from.
 * @returns The initials of the name.
 */
function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/**
 * ApplicantsTable
 *
 * Loads all applicants once, then shows only those submitted in the selected
 * month. Each row links to the applicant's detail page.
 *
 * @returns rendered applicants table layout
 *
 */
export default function ApplicantsTable() {
  const [applicants, setApplicants] = useState<ApplicantSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // "YYYY-MM", starting on the current month
  const [month, setMonth] = useState(() => pantryMonthKey(new Date()));

  // The current month, and whether the selected month is the current month
  const atCurrentMonth = month >= pantryMonthKey(new Date());

  useEffect(() => {
    let cancelled = false;
    fetchApplicants()
      .then((result) => {
        if (cancelled) return;
        if ("applicants" in result) {
          setApplicants(result.applicants);
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError((error as Error).message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Only this month's applicants. Skip a null submittedAt.
  const visible = (applicants ?? []).filter(
    (a) => a.submittedAt && pantryMonthKey(a.submittedAt) === month,
  );

  return (
    <section className="p-6">
      {/* Note for dearest Natalie, can take out flex wrap if you want the 
      title and month selector to be on same line FOR PHONES, flex wrap stacks them */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1>Onboarding Event Tracker</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous month"
            className="rounded border border-gray-200 px-2 py-1 text-xs 
            focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-primary hover:enabled:bg-gray-50"
            onClick={() => setMonth((m) => shiftMonth(m, -1))}
          >
            &larr;
          </button>
          <span className="mx-4 whitespace-nowrap">{formatMonth(month)}</span>
          <button
            type="button"
            aria-label="Next month"
            disabled={atCurrentMonth}
            className="rounded border border-gray-200 px-2 py-1 text-xs 
            focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-primary hover:enabled:bg-gray-50 disabled:cursor-not-allowed
            disabled:opacity-50"
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
          >
            &rarr;
          </button>
        </div>
      </div>

      {error ? (
        <p className="py-10 text-center text-error-msg">{error}</p>
      ) : applicants === null ? (
        <p className="py-10 text-center text-muted-foreground">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          No applicants found
        </p>
      ) : (
        <div className="max-h-[650px] overflow-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[640px] text-left text-sm table-fixed">
            <thead className="sticky top-0 bg-gray-100 text-muted-foreground">
              <tr>
                <th
                  scope="col"
                  className="w-[28%] bg-gray-100 px-4 py-3 font-medium text-lg"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="w-[28%] bg-gray-100 px-4 py-3 font-medium text-lg"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="w-[22%] bg-gray-100 px-4 py-3 font-medium text-lg"
                >
                  Date of Submission
                </th>
                <th
                  scope="col"
                  className="w-[16%] bg-gray-100 px-4 py-3 font-medium text-lg"
                >
                  Status
                </th>
                <th scope="col" className="w-[6%] bg-gray-100 px-2 py-3">
                  <span className="sr-only">Arrow Thing</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => {
                const name = `${a.firstName} ${a.lastName}`;
                return (
                  <tr
                    key={a.id}
                    className="group relative border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/applicants/${a.id}`}
                        className="flex items-center gap-2 
                        focus-visible:outline-none after:absolute after:inset-0 
                        focus-visible:after:ring-2 focus-visible:after:ring-inset 
                        focus-visible:after:ring-primary min-w-0"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-6 shrink-0 items-center 
                          justify-center rounded-full bg-primary/10 text-sm 
                          font-medium text-primary"
                        >
                          {initials(name)}
                        </span>
                        {name}
                      </Link>
                    </td>
                    <td className="truncate px-4 py-3">{a.email}</td>
                    <td className="px-4 py-3">
                      {formatPantry(a.submittedAt!)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          STATUS_STYLES[a.status]
                        }`}
                      >
                        {STATUS_LABELS[a.status] || a.status}
                      </span>
                    </td>
                    <td className="pointer-events-none w-12 px-2 py-3">
                      <Image
                        src={Vector}
                        alt=""
                        className="h-4 w-4 opacity-0 
                        transition-opacity group-hover:opacity-100 
                        group-focus-within:opacity-100"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
