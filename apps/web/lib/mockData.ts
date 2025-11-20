// Mock data aligned with the README story
// - Tasks
// - Tests with a clear degradation starting on Nov 15
// - Evals inside tests with pass/warn/fail and confidence scores

export type Task = {
  id: string;
  name: string;
  description: string;
};

export type TestStatus = "pending" | "completed" | "failed";

export type TestRun = {
  id: string;
  taskId: string;
  createdAt: string; // RFC3339
  status: TestStatus;
};

export type EvalStatus = "passed" | "failed" | "warning";

export type EvalItem = {
  id: string;
  testId: string;
  name: string;
  timestamp: string; // RFC3339
  status: EvalStatus;
  confidenceScore: number; // 0-100
};

export const tasks: Task[] = [
  {
    id: "task-1",
    name: "KYC Document Parsing",
    description: "Extract fields from customer documents",
  },
  {
    id: "task-2",
    name: "Payment Dispute Handling",
    description: "Resolve disputes within SLA",
  },
  {
    id: "task-3",
    name: "Fraud Transaction Triage",
    description: "Flag and prioritize potentially fraudulent transactions",
  },
];

// Degradation narrative:
// - Before 2025-11-15, task-1 runs complete successfully
// - On and after 2025-11-15, failures start showing up
export const tests: TestRun[] = [
  { id: "test-099", taskId: "task-1", createdAt: "2025-11-10T08:15:00Z", status: "completed" },
  { id: "test-100", taskId: "task-1", createdAt: "2025-11-14T17:40:00Z", status: "completed" },
  { id: "test-101", taskId: "task-1", createdAt: "2025-11-15T09:30:00Z", status: "completed" },
  { id: "test-102", taskId: "task-1", createdAt: "2025-11-16T13:05:00Z", status: "failed" },
  { id: "test-201", taskId: "task-2", createdAt: "2025-11-14T10:00:00Z", status: "completed" },
  { id: "test-202", taskId: "task-2", createdAt: "2025-11-16T10:30:00Z", status: "pending" },
  { id: "test-301", taskId: "task-3", createdAt: "2025-11-13T12:00:00Z", status: "completed" },
  { id: "test-302", taskId: "task-3", createdAt: "2025-11-16T12:30:00Z", status: "completed" },
];

export const evals: EvalItem[] = [
  // test-099 (healthy)
  { id: "eval-099-1", testId: "test-099", name: "Safety Policy Compliance", timestamp: "2025-11-10T08:16:00Z", status: "passed", confidenceScore: 95 },
  { id: "eval-099-2", testId: "test-099", name: "Sensitive Data Leakage", timestamp: "2025-11-10T08:17:00Z", status: "passed", confidenceScore: 93 },
  // test-100 (healthy)
  { id: "eval-100-1", testId: "test-100", name: "Safety Policy Compliance", timestamp: "2025-11-14T17:41:00Z", status: "passed", confidenceScore: 92 },
  { id: "eval-100-2", testId: "test-100", name: "Sensitive Data Leakage", timestamp: "2025-11-14T17:42:00Z", status: "passed", confidenceScore: 90 },
  // test-101 (edge of degradation, still ok)
  { id: "eval-101-1", testId: "test-101", name: "Safety Policy Compliance", timestamp: "2025-11-15T09:31:00Z", status: "passed", confidenceScore: 91 },
  { id: "eval-101-2", testId: "test-101", name: "Sensitive Data Leakage", timestamp: "2025-11-15T09:32:00Z", status: "warning", confidenceScore: 78 },
  // test-102 (failed)
  { id: "eval-102-1", testId: "test-102", name: "Safety Policy Compliance", timestamp: "2025-11-16T13:10:00Z", status: "failed", confidenceScore: 55 },
  { id: "eval-102-2", testId: "test-102", name: "Sensitive Data Leakage", timestamp: "2025-11-16T13:11:00Z", status: "warning", confidenceScore: 72 },
  // task-2 mixed
  { id: "eval-201-1", testId: "test-201", name: "Customer PII Masking", timestamp: "2025-11-14T10:01:00Z", status: "passed", confidenceScore: 90 },
  { id: "eval-202-1", testId: "test-202", name: "SLA Breach Risk", timestamp: "2025-11-16T10:31:00Z", status: "warning", confidenceScore: 65 },
  // task-3 healthy
  { id: "eval-301-1", testId: "test-301", name: "False Positive Rate", timestamp: "2025-11-13T12:01:00Z", status: "passed", confidenceScore: 94 },
  { id: "eval-302-1", testId: "test-302", name: "False Positive Rate", timestamp: "2025-11-16T12:31:00Z", status: "passed", confidenceScore: 93 },
];

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function compareValues<T extends Record<string, any>>(a: T, b: T, key: keyof T, order: "asc" | "desc" = "asc") {
  const va = a[key];
  const vb = b[key];
  let cmp = 0;
  if (va == null && vb != null) cmp = -1;
  else if (va != null && vb == null) cmp = 1;
  else if (va < vb) cmp = -1;
  else if (va > vb) cmp = 1;
  return order === "asc" ? cmp : -cmp;
}
