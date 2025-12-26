import { handleController, runtime } from "@/lib/apiHandler";
const reportController = require("@/backend/src/controllers/reportController");

export { runtime };

export async function GET(request) {
  return handleController(request, reportController.getPurchaseOrderReport, { parseBody: false });
}
