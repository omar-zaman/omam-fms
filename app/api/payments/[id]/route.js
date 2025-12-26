import * as paymentController from "@/backend/src/controllers/paymentController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request, { params }) {
  return handleController(paymentController.getPaymentById, request, { params });
}

export async function PUT(request, { params }) {
  return handleController(paymentController.updatePayment, request, { params });
}

export async function DELETE(request, { params }) {
  return handleController(paymentController.deletePayment, request, { params });
}
