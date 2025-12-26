import { createRouteHandler } from "@/lib/server/handler";
import {
  deletePurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrder,
} from "@/lib/server/controllers/purchaseOrderController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getPurchaseOrderById, { auth: true });
export const PUT = createRouteHandler(updatePurchaseOrder, { auth: true });
export const DELETE = createRouteHandler(deletePurchaseOrder, { auth: true });
