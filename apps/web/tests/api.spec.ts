import { describe, it, expect } from "vitest";
import { GET as getTasks } from "@/app/api/tasks/route";
import { GET as getTests } from "@/app/api/tests/route";
import { GET as getEvals } from "@/app/api/evals/route";

async function json<T = any>(res: Response): Promise<T> {
  const data = await res.json();
  return data as T;
}

describe("API: /api/tasks", () => {
  it("returns all tasks and supports search + sorting", async () => {
    const res = await getTasks(new Request("http://localhost/api/tasks?q=payment&sort=name&order=desc"));
    expect(res.ok).toBe(true);
    const data = await json<any[]>(res as unknown as Response);
    expect(Array.isArray(data)).toBe(true);
    // Should find the Payment Dispute Handling task
    expect(data.length).toBe(1);
    expect(data[0].id).toBe("task-2");
  });
});

describe("API: /api/tests", () => {
  it("requires taskId", async () => {
    const res = await getTests(new Request("http://localhost/api/tests"));
    expect(res.status).toBe(400);
  });

  it("filters by status", async () => {
    const res = await getTests(new Request("http://localhost/api/tests?taskId=task-1&status=failed"));
    expect(res.ok).toBe(true);
    const data = await json<any[]>(res as unknown as Response);
    expect(data.map((t) => t.id)).toEqual(["test-102"]);
  });

  it("filters by createdAt range and sorts", async () => {
    const res = await getTests(
      new Request(
        "http://localhost/api/tests?taskId=task-1&createdAtFrom=2025-11-15T00:00:00Z&sort=createdAt&order=asc",
      ),
    );
    expect(res.ok).toBe(true);
    const data = await json<any[]>(res as unknown as Response);
    // From Nov 15 should include test-101 and test-102 only (for task-1)
    expect(data.map((t) => t.id)).toEqual(["test-101", "test-102"]);
  });
});

describe("API: /api/evals", () => {
  it("requires testId", async () => {
    const res = await getEvals(new Request("http://localhost/api/evals"));
    expect(res.status).toBe(400);
  });

  it("filters by status", async () => {
    const res = await getEvals(new Request("http://localhost/api/evals?testId=test-102&status=warning"));
    expect(res.ok).toBe(true);
    const data = await json<any[]>(res as unknown as Response);
    expect(data.length).toBe(1);
    expect(data[0].id).toBe("eval-102-2");
  });

  it("filters by name contains and score range, sorts by confidence", async () => {
    const res1 = await getEvals(
      new Request("http://localhost/api/evals?testId=test-101&name=Safety"),
    );
    expect(res1.ok).toBe(true);
    const nameData = await json<any[]>(res1 as unknown as Response);
    expect(nameData.map((e) => e.id)).toEqual(["eval-101-1"]);

    const res2 = await getEvals(
      new Request(
        "http://localhost/api/evals?testId=test-102&sort=confidenceScore&order=asc",
      ),
    );
    expect(res2.ok).toBe(true);
    const sorted = await json<any[]>(res2 as unknown as Response);
    expect(sorted[0].confidenceScore).toBe(55);

    const res3 = await getEvals(
      new Request(
        "http://localhost/api/evals?testId=test-099&confidenceScoreMin=90",
      ),
    );
    const minData = await json<any[]>(res3 as unknown as Response);
    expect(minData.length).toBe(2);
  });
});
