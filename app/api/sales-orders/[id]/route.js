import { createRouteHandler } from "@/lib/server/handler";
import { deleteSalesOrder, getSalesOrderById, updateSalesOrder } from "@/lib/server/controllers/salesOrderController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getSalesOrderById, { auth: true });
export const PUT = createRouteHandler(updateSalesOrder, { auth: true });
export const DELETE = createRouteHandler(deleteSalesOrder, { auth: true });
