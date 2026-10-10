/**
 * route.ts
 *
 * Practice GET/POST endpoint for learning Postman. Not a real feature.
 *
 * See the "Testing with Postman" page under "Dev Resources" in Notion for
 * a step-by-step guide to pair with the code below.
 *
 * This file is also useful for referencing API function contracts.
 *
 * Author: Natalie Phua
 * Date Created: 10/9/2026
 */

import { NextResponse } from "next/server";

type ExampleItem = {
  id: number;
  title: string;
  done: boolean;
};

// In-memory stand-in for a database; resets on server restart
const items: ExampleItem[] = [
  { id: 1, title: "Learn Postman", done: false },
  { id: 2, title: "Send a GET request", done: true },
];

/**
 * GET /api/example
 *
 * Lists all items, optionally filtered by completion status. Fails if the
 * `done` query param is anything other than "true" or "false".
 *
 * Auth: public
 * Params:
 *   done - filter by completion, "true" or "false" (query, optional)
 * Returns: 200 ExampleItem[]
 * Errors:
 *   400 - `done` is not "true" or "false"
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const done = searchParams.get("done"); // null when the param is absent

  if (done === null) {
    return NextResponse.json(items);
  }

  if (done !== "true" && done !== "false") {
    return NextResponse.json(
      { error: "Query param 'done' must be 'true' or 'false'" },
      { status: 400 },
    );
  }

  const filtered = items.filter((item) => item.done === (done === "true"));
  return NextResponse.json(filtered);
}

/**
 * POST /api/example
 *
 * Creates a new item. Fails if the body is not valid JSON or if `title`
 * is missing or empty.
 *
 * Auth: public
 * Body:
 *   title - text of the item, non-empty string
 *   done - whether the item is complete, defaults to false (optional)
 * Returns: 201 ExampleItem
 * Errors:
 *   400 - malformed JSON, missing or empty title, or non-boolean done
 */
export async function POST(request: Request) {
  // request.json() throws on an empty or malformed body, so catch it to return
  // a 400 instead of a 500
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const { title, done } = (body ?? {}) as { title?: unknown; done?: unknown };

  // Validate on the server because the client can send anything, including
  // via Postman
  if (typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      { error: "'title' is required and must be a non-empty string" },
      { status: 400 },
    );
  }
  if (done !== undefined && typeof done !== "boolean") {
    return NextResponse.json(
      { error: "'done' must be a boolean if provided" },
      { status: 400 },
    );
  }

  const newItem: ExampleItem = {
    id: items.length + 1,
    title: title.trim(),
    done: done ?? false,
  };
  items.push(newItem);

  return NextResponse.json(newItem, { status: 201 });
}
