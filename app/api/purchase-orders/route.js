import { createRouteHandler } from "@/lib/server/handler";
import { createPurchaseOrder, getAllPurchaseOrders } from "@/lib/server/controllers/purchaseOrderController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getAllPurchaseOrders, { auth: true });
export const POST = createRouteHandler(createPurchaseOrder, { auth: true });
