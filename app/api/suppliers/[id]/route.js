import { handleController, runtime } from "@/lib/apiHandler";
const supplierController = require("@/backend/src/controllers/supplierController");

export { runtime };

export async function GET(request, { params }) {
  return handleController(request, supplierController.getSupplierById, {
    params,
    parseBody: false,
  });
}

export async function PUT(request, { params }) {
  return handleController(request, supplierController.updateSupplier, { params });
}

export async function DELETE(request, { params }) {
  return handleController(request, supplierController.deleteSupplier, {
    params,
    parseBody: false,
  });
}
