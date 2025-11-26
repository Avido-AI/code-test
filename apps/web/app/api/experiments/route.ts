import { NextResponse } from "next/server";
import { experiments, compareValues } from "@/lib/mockData";
import { ExperimentStatus } from "@/lib/types";

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
  const status = url.searchParams.get("status") as ExperimentStatus | null;
  const sort = (url.searchParams.get("sort") as "name" | "createdAt" | "status" | null) ?? null;
  const order = (url.searchParams.get("order") as "asc" | "desc" | null) ?? "desc";

  let result = experiments.slice();

  // Filter by orgId
  result = result.filter((exp) => exp.orgId === orgId);

  // Filter by search query
  if (q && q.trim()) {
    const qq = normalize(q);
    result = result.filter(
      (exp) =>
        normalize(exp.name).includes(qq) ||
        (exp.description && normalize(exp.description).includes(qq))
    );
  }

  // Filter by status
  if (status) {
    result = result.filter((exp) => exp.status === status);
  }

  // Sort
  if (sort) {
    result.sort((a, b) => compareValues(a, b, sort, order));
  }

  return NextResponse.json(result);
}

