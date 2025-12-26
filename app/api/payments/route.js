import { createRouteHandler } from "@/lib/server/handler";
import { createPayment, getAllPayments } from "@/lib/server/controllers/paymentController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getAllPayments, { auth: true });
export const POST = createRouteHandler(createPayment, { auth: true });
