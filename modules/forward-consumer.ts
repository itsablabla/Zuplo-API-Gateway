import { environment, ZuploContext, ZuploRequest } from "@zuplo/runtime";

// Runs after api-key-inbound. Zuplo owns both identity headers: any client-supplied values
// are removed before the authenticated consumer id and origin secret are attached.
export default async function forwardConsumer(
  request: ZuploRequest,
  _context: ZuploContext,
) {
  request.headers.delete("x-joy-customer");
  request.headers.delete("x-joy-edge-secret");

  const user = request.user as
    | { sub?: string; data?: { customerId?: string } }
    | undefined;
  const customerId = user?.data?.customerId || user?.sub || "";
  if (!customerId) {
    return new Response(
      JSON.stringify({ error: { message: "Authenticated consumer identity is required." } }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }

  const edgeSecret = environment.JOY_EDGE_SECRET;
  if (!edgeSecret) {
    throw new Error("JOY_EDGE_SECRET is not configured.");
  }

  request.headers.set("x-joy-customer", String(customerId));
  request.headers.set("x-joy-edge-secret", edgeSecret);
  return request;
}
