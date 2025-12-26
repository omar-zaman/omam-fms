import { handleController, runtime } from "@/lib/apiHandler";
const customerController = require("@/backend/src/controllers/customerController");

export { runtime };

export async function GET(request) {
  return handleController(request, customerController.getAllCustomers, { parseBody: false });
}

export async function POST(request) {
  return handleController(request, customerController.createCustomer);
}
