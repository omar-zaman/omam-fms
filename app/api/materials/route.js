import { createRouteHandler } from "@/lib/server/handler";
import { createMaterial, getAllMaterials } from "@/lib/server/controllers/materialController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getAllMaterials, { auth: true });
export const POST = createRouteHandler(createMaterial, { auth: true });
