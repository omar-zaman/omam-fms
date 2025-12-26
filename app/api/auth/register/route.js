import { createRouteHandler } from "@/lib/server/handler";
import { register } from "@/lib/server/controllers/authController";

export const dynamic = "force-dynamic";

export const POST = createRouteHandler(register);
