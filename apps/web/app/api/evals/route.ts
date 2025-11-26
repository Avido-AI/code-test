import { NextResponse } from "next/server";
import { evals, evalDefinitions, compareValues, parseDate } from "@/lib/mockData";
import { TestStatus, EvalWithDefinition } from "@/lib/types";

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

  const testId = url.searchParams.get("testId");
  const definitionId = url.searchParams.get("definitionId");
  const status = url.searchParams.get("status") as TestStatus | null;
  const passed = url.searchParams.get("passed");
  const nameQ = url.searchParams.get("name");
  const createdAtFrom = parseDate(url.searchParams.get("createdAtFrom"));
  const createdAtTo = parseDate(url.searchParams.get("createdAtTo"));
  const scoreMinRaw = url.searchParams.get("scoreMin");
  const scoreMaxRaw = url.searchParams.get("scoreMax");
  const scoreMin = scoreMinRaw != null ? Number(scoreMinRaw) : null;
  const scoreMax = scoreMaxRaw != null ? Number(scoreMaxRaw) : null;
  const sort = (url.searchParams.get("sort") as
    | "createdAt"
    | "score"
    | "status"
    | "id"
    | null) ?? null;
  const order = (url.searchParams.get("order") as "asc" | "desc" | null) ?? "desc";
  const includeDefinition = url.searchParams.get("includeDefinition") === "true";

  let result = evals.slice();

  // Filter by orgId
  result = result.filter((e) => e.orgId === orgId);

  // Filter by testId
  if (testId) {
    result = result.filter((e) => e.testId === testId);
  }

  // Filter by definitionId
  if (definitionId) {
    result = result.filter((e) => e.definitionId === definitionId);
  }

  // Filter by status
  if (status) {
    result = result.filter((e) => e.status === status);
  }

  // Filter by passed
  if (passed !== null) {
    const passedBool = passed === "true";
    result = result.filter((e) => e.passed === passedBool);
  }

  // Filter by name (search in eval definition)
  if (nameQ && nameQ.trim()) {
    const n = nameQ.toLowerCase();
    const matchingDefIds = evalDefinitions
      .filter((def) => def.name.toLowerCase().includes(n))
      .map((def) => def.id);
    result = result.filter((e) => matchingDefIds.includes(e.definitionId));
  }

  // Filter by date range
  if (createdAtFrom) {
    result = result.filter((e) => new Date(e.createdAt).getTime() >= createdAtFrom.getTime());
  }
  if (createdAtTo) {
    result = result.filter((e) => new Date(e.createdAt).getTime() <= createdAtTo.getTime());
  }

  // Filter by score range
  if (typeof scoreMin === "number" && !Number.isNaN(scoreMin)) {
    result = result.filter((e) => e.score >= scoreMin);
  }
  if (typeof scoreMax === "number" && !Number.isNaN(scoreMax)) {
    result = result.filter((e) => e.score <= scoreMax);
  }

  // Sort
  if (sort) {
    result.sort((a, b) => compareValues(a as any, b as any, sort as any, order));
  }

  // Include eval definitions if requested
  if (includeDefinition) {
    const evalsWithDef: EvalWithDefinition[] = result.map((evalItem) => ({
      ...evalItem,
      definition: evalDefinitions.find((def) => def.id === evalItem.definitionId),
    }));
    return NextResponse.json(evalsWithDef);
  }

  return NextResponse.json(result);
}
