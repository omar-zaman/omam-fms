import * as salesOrderController from "@/backend/src/controllers/salesOrderController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request, { params }) {
  return handleController(salesOrderController.getSalesOrderById, request, { params });
}

export async function PUT(request, { params }) {
  return handleController(salesOrderController.updateSalesOrder, request, { params });
}

export async function DELETE(request, { params }) {
  return handleController(salesOrderController.deleteSalesOrder, request, { params });
}
