import * as supplierController from "@/backend/src/controllers/supplierController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request, { params }) {
  return handleController(supplierController.getSupplierById, request, { params });
}

export async function PUT(request, { params }) {
  return handleController(supplierController.updateSupplier, request, { params });
}

export async function DELETE(request, { params }) {
  return handleController(supplierController.deleteSupplier, request, { params });
}
