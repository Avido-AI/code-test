import { NextResponse } from "next/server";
import { steps, compareValues } from "@/lib/mockData";
import { StepType } from "@/lib/types";

function normalize(s: string) {
  return s.toLowerCase();
}

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

  const q = url.searchParams.get("q");
  const type = url.searchParams.get("type") as StepType | null;
  const sort = (url.searchParams.get("sort") as "name" | "externalId" | "type" | null) ?? null;
  const order = (url.searchParams.get("order") as "asc" | "desc" | null) ?? "asc";

  let result = steps.slice();

  // Filter by orgId
  result = result.filter((step) => step.orgId === orgId);

  // Filter by search query
  if (q && q.trim()) {
    const qq = normalize(q);
    result = result.filter(
      (step) =>
        normalize(step.name).includes(qq) ||
        normalize(step.externalId).includes(qq) ||
        (step.description && normalize(step.description).includes(qq))
    );
  }

  // Filter by type
  if (type) {
    result = result.filter((step) => step.type === type);
  }

  // Sort
  if (sort) {
    result.sort((a, b) => compareValues(a, b, sort, order));
  }

  return NextResponse.json(result);
}

