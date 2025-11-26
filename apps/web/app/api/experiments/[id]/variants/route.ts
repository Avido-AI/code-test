import { NextResponse } from "next/server";
import { experiments, variants, tests, evals, evalDefinitions, compareValues } from "@/lib/mockData";
import { VariantStatus, VariantWithMetrics } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const url = new URL(req.url);
  const orgId = url.searchParams.get("orgId");
  const experimentId = params.id;

  // Enforce orgId requirement for security
  if (!orgId) {
    return NextResponse.json(
      { error: "orgId query parameter is required" },
      { status: 400 }
    );
  }

  // Find the experiment and verify orgId
  const experiment = experiments.find((exp) => exp.id === experimentId);
  if (!experiment) {
    return NextResponse.json(
      { error: "Experiment not found" },
      { status: 404 }
    );
  }

  if (experiment.orgId !== orgId) {
    return NextResponse.json(
      { error: "Access denied" },
      { status: 403 }
    );
  }

  const status = url.searchParams.get("status") as VariantStatus | null;
  const sort = (url.searchParams.get("sort") as "name" | "createdAt" | "status" | null) ?? null;
  const order = (url.searchParams.get("order") as "asc" | "desc" | null) ?? "asc";

  let result = variants.filter((v) => v.experimentId === experimentId);

  // Filter by status
  if (status) {
    result = result.filter((v) => v.status === status);
  }

  // Sort
  if (sort) {
    result.sort((a, b) => compareValues(a, b, sort, order));
  }

  // Compute metrics for each variant
  const variantsWithMetrics: VariantWithMetrics[] = result.map((variant) => {
    // Get all tests for this variant
    const variantTests = tests.filter((t) => t.variantId === variant.id);
    const totalTests = variantTests.length;
    const completedTests = variantTests.filter((t) => t.status === "COMPLETED").length;
    const failedTests = variantTests.filter((t) => t.status === "FAILED").length;

    // Get all evals for these tests
    const testIds = variantTests.map((t) => t.id);
    const variantEvals = evals.filter((e) => testIds.includes(e.testId));

    // Compute average score
    const avgScore =
      variantEvals.length > 0
        ? variantEvals.reduce((sum, e) => sum + e.score, 0) / variantEvals.length
        : 0;

    // Compute pass rate
    const passedEvals = variantEvals.filter((e) => e.passed).length;
    const passRate = variantEvals.length > 0 ? (passedEvals / variantEvals.length) * 100 : 0;

    // Compute eval breakdown by definition
    const evalsByDefinition = new Map<string, { scores: number[]; passed: number; total: number }>();
    
    variantEvals.forEach((evalItem) => {
      if (!evalsByDefinition.has(evalItem.definitionId)) {
        evalsByDefinition.set(evalItem.definitionId, { scores: [], passed: 0, total: 0 });
      }
      const defStats = evalsByDefinition.get(evalItem.definitionId)!;
      defStats.scores.push(evalItem.score);
      defStats.total++;
      if (evalItem.passed) defStats.passed++;
    });

    const evalBreakdown = Array.from(evalsByDefinition.entries()).map(([defId, stats]) => {
      const definition = evalDefinitions.find((d) => d.id === defId);
      return {
        definitionId: defId,
        name: definition?.name || "Unknown",
        avgScore: stats.scores.reduce((sum, s) => sum + s, 0) / stats.scores.length,
        passRate: (stats.passed / stats.total) * 100,
      };
    });

    return {
      ...variant,
      metrics: {
        totalTests,
        completedTests,
        failedTests,
        avgScore,
        passRate,
        evalBreakdown,
      },
    };
  });

  return NextResponse.json(variantsWithMetrics);
}

