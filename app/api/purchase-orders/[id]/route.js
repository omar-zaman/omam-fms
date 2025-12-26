import * as purchaseOrderController from "@/backend/src/controllers/purchaseOrderController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request, { params }) {
  return handleController(purchaseOrderController.getPurchaseOrderById, request, { params });
}

export async function PUT(request, { params }) {
  return handleController(purchaseOrderController.updatePurchaseOrder, request, { params });
}

export async function DELETE(request, { params }) {
  return handleController(purchaseOrderController.deletePurchaseOrder, request, { params });
}
