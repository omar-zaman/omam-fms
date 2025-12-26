import { createRouteHandler } from "@/lib/server/handler";
import { deletePayment, getPaymentById, updatePayment } from "@/lib/server/controllers/paymentController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getPaymentById, { auth: true });
export const PUT = createRouteHandler(updatePayment, { auth: true });
export const DELETE = createRouteHandler(deletePayment, { auth: true });
