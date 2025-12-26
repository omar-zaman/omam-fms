import { handleController, runtime } from "@/lib/apiHandler";
const itemController = require("@/backend/src/controllers/itemController");

export { runtime };

export async function GET(request, { params }) {
  return handleController(request, itemController.getItemById, {
    params,
    parseBody: false,
  });
}

export async function PUT(request, { params }) {
  return handleController(request, itemController.updateItem, { params });
}

export async function DELETE(request, { params }) {
  return handleController(request, itemController.deleteItem, {
    params,
    parseBody: false,
  });
}
