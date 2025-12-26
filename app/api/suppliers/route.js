import { createRouteHandler } from "@/lib/server/handler";
import { createSupplier, getAllSuppliers } from "@/lib/server/controllers/supplierController";

export const dynamic = "force-dynamic";

export const GET = createRouteHandler(getAllSuppliers, { auth: true });
export const POST = createRouteHandler(createSupplier, { auth: true });
