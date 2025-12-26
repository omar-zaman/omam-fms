import { NextResponse } from "next/server";
import connectDB from "@/lib/server/mongodb";
import { verifyAuth } from "@/lib/server/auth";

async function parseRequestBody(request) {
  const method = request.method?.toUpperCase();
  if (method === "GET" || method === "HEAD") {
    return {};
  }

  try {
    return await request.json();
  } catch (_error) {
    return {};
  }
}

function buildRequest(request, context) {
  const url = new URL(request.url);
  return {
    method: request.method,
    headers: Object.fromEntries(request.headers),
    query: Object.fromEntries(url.searchParams.entries()),
    params: context?.params || {},
  };
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function handleError(error) {
  console.error("API Error:", error);
  const status = error.status || (error.message?.includes("Unauthorized") ? 401 : 500);
  const message = error.message || "Internal server error";
  return NextResponse.json({ message }, { status });
}

export function createRouteHandler(controller, { auth = false } = {}) {
  return async (request, context) => {
    try {
      await connectDB();
      const req = buildRequest(request, context);
      req.body = await parseRequestBody(request);

      if (auth) {
        req.user = verifyAuth(request);
      }

      const res = createResponse();
      await controller(req, res, (error) => {
        if (error) {
          throw error;
        }
      });

      const status = res.statusCode || 200;
      const body = res.body ?? { message: "OK" };
      return NextResponse.json(body, { status });
    } catch (error) {
      return handleError(error);
    }
  };
}
