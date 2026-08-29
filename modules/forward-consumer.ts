import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

// Runs after api-key-inbound. That policy sets the authenticated identity on `request.user`
// ({ sub, data }). We mint one consumer per Superjoy customer (name = customer id, with
// { customerId } in metadata → request.user.data.customerId). The Joy gateway attributes usage
// from the `x-joy-customer` header, so we set it here from the VERIFIED identity — edge-enforced
// attribution the caller cannot spoof.
export default async function forwardConsumer(
  request: ZuploRequest,
  _context: ZuploContext,
) {
  const user = request.user as
    | { sub?: string; data?: { customerId?: string } }
    | undefined;
  const customerId = user?.data?.customerId || user?.sub || "";
  if (customerId) {
    request.headers.set("x-joy-customer", String(customerId));
  }
  return request;
}
