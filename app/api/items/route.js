import { createRouteHandler } from "@/lib/server/handler";
import { createItem, getAllItems } from "@/lib/server/controllers/itemController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getAllItems, { auth: true });
export const POST = createRouteHandler(createItem, { auth: true });
