import * as salesOrderController from "@/backend/src/controllers/salesOrderController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(salesOrderController.getAllSalesOrders, request);
}

export async function POST(request) {
  return handleController(salesOrderController.createSalesOrder, request);
}
