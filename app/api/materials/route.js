import { handleController, runtime } from "@/lib/apiHandler";
const materialController = require("@/backend/src/controllers/materialController");

export { runtime };

export async function GET(request) {
  return handleController(request, materialController.getAllMaterials, { parseBody: false });
}

export async function POST(request) {
  return handleController(request, materialController.createMaterial);
}
