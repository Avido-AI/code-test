import { NextResponse } from "next/server";
import { evals, compareValues, parseDate } from "@/lib/mockData";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const testId = url.searchParams.get("testId");

  const status = url.searchParams.get("status") as "passed" | "failed" | "warning" | null;
  const nameQ = url.searchParams.get("name");
  const timestampFrom = parseDate(url.searchParams.get("timestampFrom"));
  const timestampTo = parseDate(url.searchParams.get("timestampTo"));
  const scoreMinRaw = url.searchParams.get("confidenceScoreMin");
  const scoreMaxRaw = url.searchParams.get("confidenceScoreMax");
  const scoreMin = scoreMinRaw != null ? Number(scoreMinRaw) : null;
  const scoreMax = scoreMaxRaw != null ? Number(scoreMaxRaw) : null;
  const sort = (url.searchParams.get("sort") as
    | "timestamp"
    | "confidenceScore"
    | "status"
    | "id"
    | null) ?? null;
  const order = (url.searchParams.get("order") as "asc" | "desc" | null) ?? "desc";

  // Start from all evals; if testId provided, filter down to that test
  let result = evals.slice();
  if (testId) {
    result = result.filter((e) => e.testId === testId);
  }

  if (status) {
    result = result.filter((e) => e.status === status);
  }
  if (nameQ && nameQ.trim()) {
    const n = nameQ.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(n));
  }
  if (timestampFrom) {
    result = result.filter((e) => new Date(e.timestamp).getTime() >= timestampFrom.getTime());
  }
  if (timestampTo) {
    result = result.filter((e) => new Date(e.timestamp).getTime() <= timestampTo.getTime());
  }
  if (typeof scoreMin === "number" && !Number.isNaN(scoreMin)) {
    result = result.filter((e) => e.confidenceScore >= scoreMin);
  }
  if (typeof scoreMax === "number" && !Number.isNaN(scoreMax)) {
    result = result.filter((e) => e.confidenceScore <= scoreMax);
  }

  if (sort) {
    result.sort((a, b) => compareValues(a as any, b as any, sort as any, order));
  }

  return NextResponse.json(result);
}
