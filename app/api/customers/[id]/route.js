import { handleController, runtime } from "@/lib/apiHandler";
const customerController = require("@/backend/src/controllers/customerController");

export { runtime };

export async function GET(request, { params }) {
  return handleController(request, customerController.getCustomerById, {
    params,
    parseBody: false,
  });
}

export async function PUT(request, { params }) {
  return handleController(request, customerController.updateCustomer, { params });
}

export async function DELETE(request, { params }) {
  return handleController(request, customerController.deleteCustomer, {
    params,
    parseBody: false,
  });
}
