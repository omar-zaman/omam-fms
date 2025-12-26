import { handleController, runtime } from "@/lib/apiHandler";
const salesOrderController = require("@/backend/src/controllers/salesOrderController");

export { runtime };

export async function GET(request, { params }) {
  return handleController(request, salesOrderController.getSalesOrderById, {
    params,
    parseBody: false,
  });
}

export async function PUT(request, { params }) {
  return handleController(request, salesOrderController.updateSalesOrder, { params });
}

export async function DELETE(request, { params }) {
  return handleController(request, salesOrderController.deleteSalesOrder, {
    params,
    parseBody: false,
  });
}
