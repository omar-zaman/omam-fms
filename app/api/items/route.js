import * as itemController from "@/backend/src/controllers/itemController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(itemController.getAllItems, request);
}

export async function POST(request) {
  return handleController(itemController.createItem, request);
}
