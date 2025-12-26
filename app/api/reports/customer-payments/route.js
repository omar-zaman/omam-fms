import { createRouteHandler } from "@/lib/server/handler";
import { getCustomerPaymentReport } from "@/lib/server/controllers/reportController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getCustomerPaymentReport, { auth: true });
