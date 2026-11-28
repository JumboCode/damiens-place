/**
 * route.ts
 *
 * TODO: description
 *
 * Author: Carter Watabe & 
 * Date Created: Nov/27/2026
 */

import { requireAdmin } from "@/lib/admin-auth";

type RouteContext = { params: Promise<{ id: string }> };

// TODO: function contract
export async function PATCH(request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  
  // TODO: read and validate the body, like POST
  // TODO: update the resource (404 if it doesn't exist), and return 200 with { resource }
}

// TODO: function contract
export async function DELETE(_request: Request, { params }: RouteContext) {
  // TODO: admin check first
  // TODO: 409 if the id is in PROTECTED_RESOURCE_IDS
  // TODO: delete the resource (404 if it doesn't exist), and return 204 with no body
  // TODO(natalie): delete the file from blob storage too (BE-resources-api)
}