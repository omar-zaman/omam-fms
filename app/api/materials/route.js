import * as materialController from "@/backend/src/controllers/materialController";
import { handleController } from "@/lib/controllerAdapter";

export async function GET(request) {
  return handleController(materialController.getAllMaterials, request);
}

export async function POST(request) {
  return handleController(materialController.createMaterial, request);
}
