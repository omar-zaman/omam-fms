import * as itemController from "@/backend/src/controllers/itemController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request, { params }) {
  return handleController(itemController.getItemById, request, { params });
}

export async function PUT(request, { params }) {
  return handleController(itemController.updateItem, request, { params });
}

export async function DELETE(request, { params }) {
  return handleController(itemController.deleteItem, request, { params });
}
