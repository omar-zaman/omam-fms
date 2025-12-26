import { handleController, runtime } from "@/lib/apiHandler";
const supplierController = require("@/backend/src/controllers/supplierController");

export { runtime };

export async function GET(request) {
  return handleController(request, supplierController.getAllSuppliers, { parseBody: false });
}

export async function POST(request) {
  return handleController(request, supplierController.createSupplier);
}
