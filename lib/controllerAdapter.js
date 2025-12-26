import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import connectDB from "./db";

function createExpressLikeResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

async function parseRequestBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function authenticateRequest(requireAuth) {
  if (!requireAuth) return undefined;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const unauthorizedError = new Error("Not authenticated");
    unauthorizedError.status = 401;
    throw unauthorizedError;
  }

  return {
    userId: session.user.id,
    username: session.user.username,
    role: session.user.role,
  };
}

export async function handleController(controller, request, { params = {}, requireAuth = true } = {}) {
  try {
    await connectDB();

    const user = await authenticateRequest(requireAuth);
    const shouldParseBody = request.method !== "GET" && request.method !== "DELETE";
    const body = shouldParseBody ? await parseRequestBody(request) : undefined;

    const req = {
      params,
      query: Object.fromEntries(request.nextUrl.searchParams.entries()),
      body,
      headers: Object.fromEntries(request.headers.entries()),
      user,
    };

    const res = createExpressLikeResponse();

    await controller(req, res, (err) => {
      if (err) {
        throw err;
      }
    });

    const status = res.statusCode || 200;
    const payload = res.body ?? {};
    return NextResponse.json(payload, { status });
  } catch (error) {
    console.error("API handler error", error);
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    return NextResponse.json({ message }, { status });
  }
}
