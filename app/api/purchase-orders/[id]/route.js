import { handleController, runtime } from "@/lib/apiHandler";
const purchaseOrderController = require("@/backend/src/controllers/purchaseOrderController");

export { runtime };

export async function GET(request, { params }) {
  return handleController(request, purchaseOrderController.getPurchaseOrderById, {
    params,
    parseBody: false,
  });
}

export async function PUT(request, { params }) {
  return handleController(request, purchaseOrderController.updatePurchaseOrder, { params });
}

export async function DELETE(request, { params }) {
  return handleController(request, purchaseOrderController.deletePurchaseOrder, {
    params,
    parseBody: false,
  });
}
