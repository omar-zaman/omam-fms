import { createRouteHandler } from "@/lib/server/handler";
import { deleteSupplier, getSupplierById, updateSupplier } from "@/lib/server/controllers/supplierController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getSupplierById, { auth: true });
export const PUT = createRouteHandler(updateSupplier, { auth: true });
export const DELETE = createRouteHandler(deleteSupplier, { auth: true });
