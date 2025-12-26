import { createRouteHandler } from "@/lib/server/handler";
import { createCustomer, getAllCustomers } from "@/lib/server/controllers/customerController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getAllCustomers, { auth: true });
export const POST = createRouteHandler(createCustomer, { auth: true });
