import { handleController, runtime } from "@/lib/apiHandler";
const authController = require("@/backend/src/controllers/authController");

export { runtime };

export async function GET(request) {
  return handleController(request, authController.getCurrentUser, { parseBody: false });
}
