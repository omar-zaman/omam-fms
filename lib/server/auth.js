import jwt from "jsonwebtoken";

export function verifyAuth(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.split(" ")[1];

  if (!token) {
    const error = new Error("No token provided, authorization denied");
    error.status = 401;
    throw error;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (_err) {
    const error = new Error("Token is not valid");
    error.status = 401;
    throw error;
  }
}

export function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}
