import { createRouteHandler } from "@/lib/server/handler";
import { getCurrentUser } from "@/lib/server/controllers/authController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getCurrentUser, { auth: true });
