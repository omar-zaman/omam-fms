import { handleController, runtime } from "@/lib/apiHandler";
const authController = require("@/backend/src/controllers/authController");

export { runtime };

export async function POST(request) {
  return handleController(request, authController.register, { requireAuth: false });
}
