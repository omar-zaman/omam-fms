import { createRouteHandler } from "@/lib/server/handler";
import { getAllInventory } from "@/lib/server/controllers/inventoryController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getAllInventory, { auth: true });
