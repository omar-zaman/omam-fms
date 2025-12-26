import { handleController, runtime } from "@/lib/apiHandler";
const paymentController = require("@/backend/src/controllers/paymentController");

export { runtime };

export async function PUT(request, { params }) {
  return handleController(request, paymentController.updatePayment, { params });
}

export async function DELETE(request, { params }) {
  return handleController(request, paymentController.deletePayment, {
    params,
    parseBody: false,
  });
}
