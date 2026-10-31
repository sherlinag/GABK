import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(status, message, code = "REQUEST_FAILED") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function success(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function withApi(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed.",
            details: error.issues.map(({ path, message }) => ({
              path: path.join("."),
              message
            }))
          }
        }, { status: 400 });
      }
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: { code: error.code, message: error.message }
        }, { status: error.status });
      }
      if (error?.code === 11000) {
        return NextResponse.json({
          success: false,
          error: { code: "DUPLICATE_RESOURCE", message: "That resource already exists." }
        }, { status: 409 });
      }
      console.error("API request failed:", error);
      return NextResponse.json({
        success: false,
        error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." }
      }, { status: 500 });
    }
  };
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON.", "INVALID_JSON");
  }
}
