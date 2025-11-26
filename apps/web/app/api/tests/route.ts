import { NextResponse } from "next/server";
import { tests, compareValues, parseDate } from "@/lib/mockData";
import { TestStatus } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orgId = url.searchParams.get("orgId");

  // Enforce orgId requirement for security
  if (!orgId) {
    return NextResponse.json(
      { error: "orgId query parameter is required" },
      { status: 400 }
    );
  }

  const taskId = url.searchParams.get("taskId");
  const experimentId = url.searchParams.get("experimentId");
  const variantId = url.searchParams.get("variantId");
  const status = url.searchParams.get("status") as TestStatus | null;
  const createdAtFrom = parseDate(url.searchParams.get("createdAtFrom"));
  const createdAtTo = parseDate(url.searchParams.get("createdAtTo"));
  const sort = (url.searchParams.get("sort") as "createdAt" | "status" | "id" | null) ?? null;
  const order = (url.searchParams.get("order") as "asc" | "desc" | null) ?? "desc";

  let result = tests.slice();

  // Filter by orgId
  result = result.filter((t) => t.orgId === orgId);

  // Filter by taskId
  if (taskId) {
    result = result.filter((t) => t.taskId === taskId);
  }

  // Filter by experimentId
  if (experimentId) {
    result = result.filter((t) => t.experimentId === experimentId);
  }

  // Filter by variantId
  if (variantId) {
    result = result.filter((t) => t.variantId === variantId);
  }

  // Filter by status
  if (status) {
    result = result.filter((t) => t.status === status);
  }

  // Filter by date range
  if (createdAtFrom) {
    result = result.filter((t) => new Date(t.createdAt).getTime() >= createdAtFrom.getTime());
  }
  if (createdAtTo) {
    result = result.filter((t) => new Date(t.createdAt).getTime() <= createdAtTo.getTime());
  }

  // Sort
  if (sort) {
    result.sort((a, b) => compareValues(a, b, sort, order));
  }

  return NextResponse.json(result);
}
