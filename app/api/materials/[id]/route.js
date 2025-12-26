import * as materialController from "@/backend/src/controllers/materialController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request, { params }) {
  return handleController(materialController.getMaterialById, request, { params });
}

export async function PUT(request, { params }) {
  return handleController(materialController.updateMaterial, request, { params });
}

export async function DELETE(request, { params }) {
  return handleController(materialController.deleteMaterial, request, { params });
}
