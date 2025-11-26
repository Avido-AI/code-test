// Type definitions for Avido Experiments MVP
// Aligned with Prisma schema and eval result schemas

// ============ Enums ============

export enum TestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

export enum EvalType {
  NATURALNESS = "NATURALNESS",
  STYLE = "STYLE",
  RECALL = "RECALL",
  CUSTOM = "CUSTOM",
  FACT = "FACT",
  OUTPUT_MATCH = "OUTPUT_MATCH",
}

export enum ExperimentStatus {
  DRAFT = "DRAFT",
  BASELINE_PENDING = "BASELINE_PENDING",
  BASELINE_RUNNING = "BASELINE_RUNNING",
  BASELINE_COMPLETED = "BASELINE_COMPLETED",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export enum VariantStatus {
  DRAFT = "DRAFT",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REJECTED = "REJECTED",
}

export enum StepType {
  LLM = "LLM",
  RETRIEVAL = "RETRIEVAL",
  TOOL = "TOOL",
  PROCESSING = "PROCESSING",
}

export enum TaskType {
  ADVERSARY = "ADVERSARY",
  NORMAL = "NORMAL",
}

// ============ Core Types ============

export interface Step {
  id: string;
  orgId: string;
  externalId: string; // Used in webhook (e.g., "input_moderator", "response_generator")
  name: string;
  description?: string;
  type: StepType;
  createdAt: string;
  modifiedAt: string;
}

export interface Task {
  id: string;
  orgId: string;
  title: string;
  description: string;
  type: TaskType;
  baseline?: number;
  metadata?: Record<string, any>;
  applicationId: string;
  topicId?: string;
  createdAt: string;
  modifiedAt: string;
  lastTest?: string;
  inputExamples?: string[];
}

export interface EvalDefinition {
  id: string;
  orgId: string;
  type: EvalType;
  name: string;
  globalConfig?: Record<string, any>;
  applicationId: string;
  styleGuideId?: string;
  createdAt: string;
  modifiedAt: string;
}

export interface Experiment {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  status: ExperimentStatus;
  stepIds: string[]; // Steps in scope for this experiment
  taskIds: string[]; // Fixed task set for this experiment
  createdBy: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ConfigPatch {
  system_prompt?: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  model?: string;
}

export interface Variant {
  id: string;
  orgId: string;
  experimentId: string;
  previousVariantId?: string; // Variant this was inherited from
  name: string;
  status: VariantStatus;
  targetStepId?: string; // Which step this variant modifies (null for baseline)
  configPatch: ConfigPatch; // The actual override payload
  description?: string;
  createdBy: string;
  createdAt: string;
  modifiedAt: string;
}

export interface Run {
  id: string;
  orgId: string;
  experimentId?: string; // null for regular runs
  variantId?: string; // null for regular runs
  applicationId: string;
  taskId: string;
  createdAt: string;
  modifiedAt: string;
}

export interface Test {
  id: string;
  orgId: string;
  applicationId: string;
  taskId: string;
  runId?: string;
  experimentId?: string; // null for regular tests
  variantId?: string; // null for regular tests
  traceId?: string;
  status: TestStatus;
  createdAt: string;
  modifiedAt: string;
}

export interface Eval {
  id: string;
  orgId: string;
  applicationId: string;
  testId: string;
  definitionId: string;
  status: TestStatus;
  results: EvalResults;
  score: number; // 0-1 for most types, 0-5 for naturalness
  passed: boolean;
  scoreComputedAt: string;
  createdAt: string;
  modifiedAt: string;
}

// ============ Eval Result Types ============

export interface CustomEvalConfig {
  criterion: string;
}

export interface CustomEvalResult {
  name: string;
  score: number;
  error?: string;
  metadata?: {
    rationale: string;
  };
}

export interface FactCheckerEvalConfig {
  groundTruth: string;
}

export interface FactCheckerEvalResult {
  score: number; // F1 score 0-1
  classification: {
    TP: string[]; // True positives
    FP: string[]; // False positives
    FN: string[]; // False negatives
  };
  error?: string;
  metadata?: any;
}

export interface GEvalResults {
  coherence: number; // 1-5
  engagingness: number; // 1-5
  naturalness: number; // 1-5
  relevance: number; // 1-5
  clarity: number; // 1-5
  analysis: string;
}

export interface RecallScorerResult {
  name: string;
  score: number;
  error?: string;
}

export interface RecallContextRelevancyResult extends RecallScorerResult {
  metadata?: {
    relevantSentences: Array<{
      sentence: string;
      reasons: string[];
    }>;
  };
}

export interface RecallContextPrecisionResult extends RecallScorerResult {
  metadata?: {
    verdict: number;
    reason: string;
  };
}

export enum HallucinationClassification {
  UNSUPPORTED_CLAIM = "UNSUPPORTED_CLAIM",
  CONTRADICTION = "CONTRADICTION",
  PARTIAL_HALLUCINATION = "PARTIAL_HALLUCINATION",
  SCOPE_DRIFT = "SCOPE_DRIFT",
}

export interface RecallFaithfulnessResult extends RecallScorerResult {
  metadata?: {
    statements: string[];
    faithfulness: Array<{
      statement: string;
      reason: string;
      verdict: number;
      classification?: HallucinationClassification;
    }>;
  };
}

export interface RecallAnswerRelevancyResult extends RecallScorerResult {
  metadata?: {
    questions: Array<{ question: string }>;
    similarity: Array<{ question: string; score: number }>;
  };
}

export interface RecallEvalResults {
  ContextRelevancy: RecallContextRelevancyResult;
  ContextPrecision: RecallContextPrecisionResult;
  Faithfulness: RecallFaithfulnessResult;
  AnswerRelevancy: RecallAnswerRelevancyResult;
}

export interface StyleEvalConfig {
  styleGuideId: string;
}

export interface StyleEvalResults {
  score: number; // 1-5
  analysis: string;
}

// Union type for all possible eval results
export type EvalResults =
  | CustomEvalResult
  | FactCheckerEvalResult
  | GEvalResults
  | RecallEvalResults
  | StyleEvalResults;

// ============ API Response Types with Aggregations ============

export interface VariantWithMetrics extends Variant {
  metrics?: {
    totalTests: number;
    completedTests: number;
    failedTests: number;
    avgScore: number;
    passRate: number; // Percentage of tests passed
    evalBreakdown: Array<{
      definitionId: string;
      name: string;
      avgScore: number;
      passRate: number;
    }>;
  };
}

export interface TaskWithEvalDefinitions extends Task {
  evalDefinitions?: EvalDefinition[];
}

export interface EvalWithDefinition extends Eval {
  definition?: EvalDefinition;
}

