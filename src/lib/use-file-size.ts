/**
 * use-file-size.ts
 *
 * Hook that looks up an uploaded file's size and formats it for display.
 *
 * Author: Natalie Phua
 * Date Created: 11/19/2026
 */
"use client";

import { useEffect, useState } from "react";

/**
 * Formats a byte count as a short label.
 *
 * @param bytes - Size in bytes.
 * @returns A label such as "2.4 MB" or "310 KB".
 */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

/**
 * useFileSize
 *
 * @param url - The uploaded file's url, or "" if there is none.
 * @returns The formatted size, or undefined while loading or if it fails.
 */
export function useFileSize(url: string): string | undefined {
  const [result, setResult] = useState<{ url: string; label: string }>();

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(`/api/uploads/file-info?url=${encodeURIComponent(url)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { size?: number } | null) => {
        if (!cancelled && typeof data?.size === "number") {
          setResult({ url, label: formatFileSize(data.size) });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);

  return result?.url === url ? result.label : undefined;
}
