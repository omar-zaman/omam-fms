import * as customerController from "@/backend/src/controllers/customerController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(customerController.getAllCustomers, request);
}

export async function POST(request) {
  return handleController(customerController.createCustomer, request);
}
