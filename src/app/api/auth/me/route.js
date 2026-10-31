import { requireUser, publicUser } from "@/lib/auth";
import { success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";

export const GET = withApi(async (request) => {
  await connectToDatabase();
  return success({ user: publicUser(await requireUser(request)) });
});
