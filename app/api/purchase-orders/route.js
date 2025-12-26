import { handleController, runtime } from "@/lib/apiHandler";
const purchaseOrderController = require("@/backend/src/controllers/purchaseOrderController");

export { runtime };

export async function GET(request) {
  return handleController(request, purchaseOrderController.getAllPurchaseOrders, { parseBody: false });
}

export async function POST(request) {
  return handleController(request, purchaseOrderController.createPurchaseOrder);
}
