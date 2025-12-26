import { createRouteHandler } from "@/lib/server/handler";
import { login } from "@/lib/server/controllers/authController";

export const dynamic = "force-dynamic";

export const POST = createRouteHandler(login);
