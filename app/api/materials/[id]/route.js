import { createRouteHandler } from "@/lib/server/handler";
import { deleteMaterial, getMaterialById, updateMaterial } from "@/lib/server/controllers/materialController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getMaterialById, { auth: true });
export const PUT = createRouteHandler(updateMaterial, { auth: true });
export const DELETE = createRouteHandler(deleteMaterial, { auth: true });
