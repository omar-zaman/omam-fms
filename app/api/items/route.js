import { handleController, runtime } from "@/lib/apiHandler";
const itemController = require("@/backend/src/controllers/itemController");

export { runtime };

export async function GET(request) {
  return handleController(request, itemController.getAllItems, { parseBody: false });
}

export async function POST(request) {
  return handleController(request, itemController.createItem);
}
