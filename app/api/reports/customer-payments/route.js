import * as reportController from "@/backend/src/controllers/reportController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(reportController.getCustomerPaymentReport, request);
}
