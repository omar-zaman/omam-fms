import { handleController, runtime } from "@/lib/apiHandler";
const paymentController = require("@/backend/src/controllers/paymentController");

export { runtime };

export async function GET(request) {
  return handleController(request, paymentController.getAllPayments, { parseBody: false });
}

export async function POST(request) {
  return handleController(request, paymentController.createPayment);
}
