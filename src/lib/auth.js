import jwt from "jsonwebtoken";
import { ApiError } from "@/lib/api";
import User from "@/models/User";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }
  return secret;
}

export function createAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, getSecret(), { expiresIn: "7d" });
}

export async function requireUser(request) {
  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new ApiError(401, "A bearer access token is required.", "UNAUTHENTICATED");

  let claims;
  try {
    claims = jwt.verify(token, getSecret());
  } catch {
    throw new ApiError(401, "The access token is invalid or expired.", "INVALID_TOKEN");
  }

  const user = await User.findById(claims.sub).select("_id name email phone role isActive");
  if (!user || !user.isActive) {
    throw new ApiError(401, "This account is unavailable.", "ACCOUNT_UNAVAILABLE");
  }
  return user;
}

export async function requireAdmin(request) {
  const user = await requireUser(request);
  if (user.role !== "admin") throw new ApiError(403, "Administrator access is required.", "FORBIDDEN");
  return user;
}

export function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
}
