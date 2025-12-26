import { createRouteHandler } from "@/lib/server/handler";
import { deleteItem, getItemById, updateItem } from "@/lib/server/controllers/itemController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getItemById, { auth: true });
export const PUT = createRouteHandler(updateItem, { auth: true });
export const DELETE = createRouteHandler(deleteItem, { auth: true });
