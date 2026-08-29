import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

// Runs after api-key-inbound. The authenticated consumer maps 1:1 to a Superjoy customer
// (consumer name = customer id, with { customerId } in metadata). The Joy gateway attributes
// usage from the `x-joy-customer` header, so we set it here from the VERIFIED identity —
// edge-enforced attribution the caller cannot spoof.
export default async function forwardConsumer(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const user = context.user as
    | { sub?: string; data?: { customerId?: string } }
    | undefined;
  const customerId = user?.data?.customerId || user?.sub || "";
  if (customerId) {
    // ZuploRequest headers are mutable — set directly and return the same request.
    request.headers.set("x-joy-customer", String(customerId));
  }
  return request;
}
