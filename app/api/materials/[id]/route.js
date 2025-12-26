import { handleController, runtime } from "@/lib/apiHandler";
const materialController = require("@/backend/src/controllers/materialController");

export { runtime };

export async function GET(request, { params }) {
  return handleController(request, materialController.getMaterialById, {
    params,
    parseBody: false,
  });
}

export async function PUT(request, { params }) {
  return handleController(request, materialController.updateMaterial, { params });
}

export async function DELETE(request, { params }) {
  return handleController(request, materialController.deleteMaterial, {
    params,
    parseBody: false,
  });
}
