import { createRouteHandler } from "@/lib/server/handler";
import { getPurchaseOrderReport } from "@/lib/server/controllers/reportController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getPurchaseOrderReport, { auth: true });
