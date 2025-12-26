import { createRouteHandler } from "@/lib/server/handler";
import { getSalesOrderReport } from "@/lib/server/controllers/reportController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getSalesOrderReport, { auth: true });
