import { handleController, runtime } from "@/lib/apiHandler";
const salesOrderController = require("@/backend/src/controllers/salesOrderController");

export { runtime };

export async function GET(request) {
  return handleController(request, salesOrderController.getAllSalesOrders, { parseBody: false });
}

export async function POST(request) {
  return handleController(request, salesOrderController.createSalesOrder);
}
