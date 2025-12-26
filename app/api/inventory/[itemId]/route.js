import { createRouteHandler } from "@/lib/server/handler";
import { getInventoryByItemId } from "@/lib/server/controllers/inventoryController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getInventoryByItemId, { auth: true });
