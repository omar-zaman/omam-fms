import * as purchaseOrderController from "@/backend/src/controllers/purchaseOrderController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(purchaseOrderController.getAllPurchaseOrders, request);
}

export async function POST(request) {
  return handleController(purchaseOrderController.createPurchaseOrder, request);
}
