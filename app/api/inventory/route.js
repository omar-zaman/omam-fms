import * as inventoryController from "@/backend/src/controllers/inventoryController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(inventoryController.getAllInventory, request);
}
