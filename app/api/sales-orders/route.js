import { createRouteHandler } from "@/lib/server/handler";
import { createSalesOrder, getAllSalesOrders } from "@/lib/server/controllers/salesOrderController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getAllSalesOrders, { auth: true });
export const POST = createRouteHandler(createSalesOrder, { auth: true });
