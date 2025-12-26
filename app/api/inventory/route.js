import { handleController, runtime } from "@/lib/apiHandler";
const inventoryController = require("@/backend/src/controllers/inventoryController");

export { runtime };

export async function GET(request) {
  return handleController(request, inventoryController.getAllInventory, { parseBody: false });
}
