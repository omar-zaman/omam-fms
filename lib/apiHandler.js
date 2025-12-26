import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./mongodb";

function authenticate(request) {
  const header = request.headers.get("authorization");

  if (!header) {
    const error = new Error("No token provided, authorization denied");
    error.status = 401;
    throw error;
  }

  const [, token] = header.split(" ");

  if (!token) {
    const error = new Error("No token provided, authorization denied");
    error.status = 401;
    throw error;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    const error = new Error("Token is not valid");
    error.status = 401;
    throw error;
  }
}

function mapErrorToResponse(err) {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return NextResponse.json({ message: messages.join(", ") }, { status: 400 });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return NextResponse.json({ message: `${field} already exists` }, { status: 400 });
  }

  if (err.name === "CastError") {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  if (err.name === "JsonWebTokenError") {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (err.name === "TokenExpiredError") {
    return NextResponse.json({ message: "Token expired" }, { status: 401 });
  }

  return NextResponse.json({ message: err.message || "Internal server error" }, {
    status: err.status || 500,
  });
}

function createResponseCapture() {
  let statusCode = 200;
  let response = null;

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      response = NextResponse.json(data, { status: statusCode });
      return response;
    },
    get response() {
      return response;
    },
  };

  return res;
}

function buildRequestObject(request, { params, body, user }) {
  return {
    params: params || {},
    query: Object.fromEntries(request.nextUrl.searchParams.entries()),
    body,
    headers: Object.fromEntries(request.headers.entries()),
    user,
  };
}

export async function handleController(request, controller, options = {}) {
  const { params = {}, requireAuth = true, parseBody = true } = options;

  try {
    await connectToDatabase();

    const user = requireAuth ? authenticate(request) : null;
    const body = parseBody ? await request.json().catch(() => ({})) : undefined;

    const req = buildRequestObject(request, { params, body, user });
    const res = createResponseCapture();
    const next = (err) => {
      throw err;
    };

    await controller(req, res, next);

    if (res.response) {
      return res.response;
    }

    return NextResponse.json({ message: "Success" });
  } catch (err) {
    return mapErrorToResponse(err);
  }
}

export const runtime = "nodejs";
