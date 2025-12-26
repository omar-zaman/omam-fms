import * as inventoryController from "@/backend/src/controllers/inventoryController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request, { params }) {
  return handleController(inventoryController.getInventoryByItemId, request, { params });
}
