import bcrypt from "bcryptjs";
import { z } from "zod";
import { createAccessToken, publicUser } from "@/lib/auth";
import { ApiError, readJson, success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";
import { enforceRateLimit } from "@/lib/rate-limit";
import User from "@/models/User";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(8).max(72)
});

export const POST = withApi(async (request) => {
  enforceRateLimit(request, "register", 5);
  const input = schema.parse(await readJson(request));
  await connectToDatabase();
  const email = input.email.trim().toLowerCase();
  if (await User.exists({ email })) {
    throw new ApiError(409, "An account with this email already exists.", "EMAIL_EXISTS");
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({ ...input, email, passwordHash });
  return success({ user: publicUser(user), accessToken: createAccessToken(user), tokenType: "Bearer" }, 201);
});
