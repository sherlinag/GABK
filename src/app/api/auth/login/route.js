import bcrypt from "bcryptjs";
import { z } from "zod";
import { createAccessToken, publicUser } from "@/lib/auth";
import { ApiError, readJson, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import User from "@/models/User";

const schema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(72)
});

export const POST = withApi(async (request) => {
  enforceRateLimit(request, "login", 10);
  const input = schema.parse(await readJson(request));
  await connectToDatabase();
  const user = await User.findOne({ email: input.email.trim().toLowerCase() }).select("+passwordHash");
  const matches = user && await bcrypt.compare(input.password, user.passwordHash);
  if (!matches || !user.isActive) {
    throw new ApiError(401, "Email or password is incorrect.", "INVALID_CREDENTIALS");
  }
  return success({ user: publicUser(user), accessToken: createAccessToken(user), tokenType: "Bearer" });
});
