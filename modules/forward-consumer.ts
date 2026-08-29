import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

// Runs after api-key-inbound. The authenticated consumer's name IS the Superjoy customer id
// (we mint one consumer per customer, named by id, with { customerId } in metadata). The Joy
// gateway attributes usage from the `x-joy-customer` header, so we set it here from the verified
// consumer identity — edge-enforced attribution, not a header the caller could spoof.
export default async function forwardConsumer(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const customerId =
    (context.user?.data as { customerId?: string } | undefined)?.customerId ||
    context.user?.sub;

  if (customerId) {
    const headers = new Headers(request.headers);
    headers.set("x-joy-customer", customerId);
    // Strip any inbound spoof attempt that we didn't just set.
    return new ZuploRequest(request, { headers });
  }
  return request;
}
