import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function forwardConsumer(
  request: ZuploRequest,
  context: ZuploContext,
) {
  const user = context.user as
    | { sub?: string; data?: { customerId?: string } }
    | undefined;
  const customerId = user?.data?.customerId || user?.sub || "";

  // TEMP DEBUG headers (named x-joy-* so the gateway log filter catches them).
  request.headers.set("x-joy-dbg-ran", "1");
  request.headers.set("x-joy-dbg-sub", String(user?.sub ?? "none"));
  request.headers.set("x-joy-dbg-data", JSON.stringify(user?.data ?? null));

  if (customerId) {
    request.headers.set("x-joy-customer", String(customerId));
  }
  return request;
}
