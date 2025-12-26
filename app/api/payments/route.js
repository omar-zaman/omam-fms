import * as paymentController from "@/backend/src/controllers/paymentController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(paymentController.getAllPayments, request);
}

export async function POST(request) {
  return handleController(paymentController.createPayment, request);
}
