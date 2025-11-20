import { NextResponse } from "next/server";
import { tests, compareValues, parseDate } from "@/lib/mockData";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const taskId = url.searchParams.get("taskId");

  const status = url.searchParams.get("status") as
    | "pending"
    | "completed"
    | "failed"
    | null;
  const createdAtFrom = parseDate(url.searchParams.get("createdAtFrom"));
  const createdAtTo = parseDate(url.searchParams.get("createdAtTo"));
  const sort = (url.searchParams.get("sort") as "createdAt" | "status" | "id" | null) ?? null;
  const order = (url.searchParams.get("order") as "asc" | "desc" | null) ?? "desc";

  // Start from all tests; if taskId provided, filter down to that task
  let result = tests.slice();
  if (taskId) {
    result = result.filter((t) => t.taskId === taskId);
  }

  if (status) {
    result = result.filter((t) => t.status === status);
  }
  if (createdAtFrom) {
    result = result.filter((t) => new Date(t.createdAt).getTime() >= createdAtFrom.getTime());
  }
  if (createdAtTo) {
    result = result.filter((t) => new Date(t.createdAt).getTime() <= createdAtTo.getTime());
  }

  if (sort) {
    result.sort((a, b) => compareValues(a, b, sort, order));
  }

  return NextResponse.json(result);
}
