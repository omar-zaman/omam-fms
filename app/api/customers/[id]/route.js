import * as customerController from "@/backend/src/controllers/customerController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request, { params }) {
  return handleController(customerController.getCustomerById, request, { params });
}

export async function PUT(request, { params }) {
  return handleController(customerController.updateCustomer, request, { params });
}

export async function DELETE(request, { params }) {
  return handleController(customerController.deleteCustomer, request, { params });
}
