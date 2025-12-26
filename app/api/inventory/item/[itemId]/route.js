import { handleController, runtime } from "@/lib/apiHandler";
const inventoryController = require("@/backend/src/controllers/inventoryController");

export { runtime };

export async function GET(request, { params }) {
  return handleController(request, inventoryController.getInventoryByItemId, {
    params,
    parseBody: false,
  });
}
