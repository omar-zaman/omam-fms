import { createRouteHandler } from "@/lib/server/handler";
import { deleteCustomer, getCustomerById, updateCustomer } from "@/lib/server/controllers/customerController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getCustomerById, { auth: true });
export const PUT = createRouteHandler(updateCustomer, { auth: true });
export const DELETE = createRouteHandler(deleteCustomer, { auth: true });
