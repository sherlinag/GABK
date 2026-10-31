import { success, withApi } from "@/lib/api";
import connectToDatabase from "@/lib/mongodb";

export const GET = withApi(async () => {
  await connectToDatabase();
  return success({ status: "ok", service: "g-arasu-bakery-api" });
});
