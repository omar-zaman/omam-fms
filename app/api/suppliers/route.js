import * as supplierController from "@/backend/src/controllers/supplierController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(supplierController.getAllSuppliers, request);
}

export async function POST(request) {
  return handleController(supplierController.createSupplier, request);
}
