# Avido Experiments MVP - Web Application

This is the web application for the Avido Experiments feature assignment. It includes a mock API serving experiment data and a development environment ready for building the frontend.

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- Run from the repository root

### Installation

```bash
# Install dependencies
pnpm install
```

### Running the Development Server

```bash
# From the repository root
pnpm dev

# Or from this directory
cd apps/web
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### API Documentation

The mock API is available at `http://localhost:3000/api/*`. See the [OpenAPI specification](../../openapi.json) for complete endpoint documentation.

## Data Model

The Experiments feature follows a hierarchical data model:

```
Organization (orgId)
  └── Experiment
      ├── Steps (LLM keys in scope)
      ├── Tasks (fixed set for experiment)
      └── Variants
          └── Runs (one per task)
              └── Tests
                  └── Evals
```

### Core Concepts

#### **Experiments**
An experiment represents a structured testing session where you test different configurations of your AI application.

- **Status Flow**: `DRAFT` → `BASELINE_PENDING` → `BASELINE_RUNNING` → `BASELINE_COMPLETED` → `RUNNING` → `COMPLETED`
- Contains a fixed set of tasks and steps (LLM keys)
- Must run baseline before creating variants

#### **Steps (LLM Keys)**
Steps represent different LLM calls in your application (e.g., `response_generator`, `input_moderator`). Each variant modifies configuration for one step.

**Step Types:**
- `LLM` - Language model calls
- `RETRIEVAL` - Vector/document retrieval
- `TOOL` - Tool/function calls
- `PROCESSING` - Data processing steps

#### **Variants**
Each variant represents a specific configuration change being tested.

- **Baseline Variant**: Snapshot of current production config
- **Test Variants**: Each changes one dimension (temperature, prompt, model, etc.)
- **Config Patch**: Only contains the fields being overridden
- **Status**: `DRAFT`, `RUNNING`, `COMPLETED`, `FAILED`, `REJECTED`

**Variant Inheritance:**
Variants can inherit from previous variants via `previousVariantId`. If a new variant is created from an earlier variant (not the latest), all intermediate variants are marked as `REJECTED`.

#### **Tasks**
Tasks define the test scenarios your AI application handles.

**Task Types:**
- `NORMAL` - Standard test cases with dynamic prompts
- `ADVERSARY` - Adversarial tests with fixed prompts

Each task can have:
- `baseline` - Baseline performance score
- `inputExamples` - Example user inputs
- `evalDefinitions` - Evals that run for this task

#### **Tests**
A test represents a single execution of a task.

- Links to a task and optionally to an experiment/variant
- Regular tests: `experimentId` and `variantId` are `null`
- Experiment tests: Tagged with `experimentId` and `variantId`
- **Status**: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `FAILED`

#### **Eval Definitions**
Define what aspects of your AI's responses to evaluate.

**Eval Types:**
- `NATURALNESS` - G-Eval metrics (coherence, naturalness, relevance, etc.) scored 1-5
- `STYLE` - Brand voice consistency against style guide, scored 1-5
- `RECALL` - RAG quality (context relevancy, precision, faithfulness, answer relevancy), scored 0-1
- `CUSTOM` - Custom criteria with pass/fail
- `FACT` - Fact checking with ground truth, scored 0-1
- `OUTPUT_MATCH` - Output matching against expected format

#### **Evals (Evaluation Results)**
Actual evaluation results for a test.

- Links to test and eval definition
- `results` - Type-specific results (varies by eval type)
- `score` - Normalized score (0-1 for most, 0-5 for naturalness/style)
- `passed` - Boolean indicating if eval passed threshold

## Understanding Tasks and Evals

### The Testing Workflow

1. **Define Tasks**: What scenarios should your AI handle?
2. **Create Eval Definitions**: What makes a good response?
3. **Run Tests**: Execute tasks against your AI
4. **Evaluate Results**: Run evals on test outputs
5. **Analyze Performance**: Review scores and identify issues

### In the Context of Experiments

Experiments add structure to this workflow:

1. **Create Experiment**: Choose tasks and steps to test
2. **Run Baseline**: Establish current performance
3. **Create Variants**: Test configuration changes one at a time
4. **Compare Results**: See which variant performs best
5. **Iterate**: Create new variants based on results

## Mock Data Overview

The mock data includes realistic scenarios demonstrating:

### Experiment 1: "Improve Response Quality"
- **Focus**: Testing temperature and prompt variations
- **Steps**: `response_generator`
- **Variants**: 
  - Baseline (temp 0.7)
  - Lower Temperature (0.3) - **Shows improvement**
  - Enhanced Prompt - **Shows further improvement**
  - Higher Temperature (0.9) - **OBVIOUS REGRESSION** with hallucinations
  - Max Tokens Limit (150)

**Key Observation**: Variant 3 (high temperature) shows obvious regression with:
- Failed tests
- Low faithfulness scores
- Hallucinations detected in Recall eval metadata

### Experiment 2: "Optimize for Empathy"
- **Focus**: Making responses more empathetic
- **Steps**: `response_generator`
- **Variants**:
  - Baseline
  - Empathy Focus
  - Empathy + Lower Temp
  - Over-Empathetic - **SUBTLE REGRESSION** in policy compliance

**Key Observation**: The over-empathetic variant scores high on naturalness but **fails policy compliance** - a subtle but important regression.

### Experiment 3: "Classifier Model Upgrade"
- **Focus**: Testing GPT-4 vs GPT-3.5 for classification
- **Steps**: `classifier`
- **Status**: `RUNNING` (in progress)

## API Authentication & Security

**All API endpoints require an `orgId` query parameter** for tenant isolation. This simulates multi-tenant security.

### Example Requests

```bash
# List experiments for organization
curl "http://localhost:3000/api/experiments?orgId=org-avido-demo"

# Get variants for an experiment
curl "http://localhost:3000/api/experiments/exp-1/variants?orgId=org-avido-demo"

# List tasks with eval definitions
curl "http://localhost:3000/api/tasks?orgId=org-avido-demo&includeEvalDefinitions=true"

# Get tests for a specific variant
curl "http://localhost:3000/api/tests?orgId=org-avido-demo&variantId=var-1-3"

# Get evals with definition metadata
curl "http://localhost:3000/api/evals?orgId=org-avido-demo&testId=test-1-1&includeDefinition=true"
```

### Error Handling

All endpoints return a 400 error if `orgId` is missing:

```json
{
  "error": "orgId query parameter is required"
}
```

## Installing Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components. To add new components:

```bash
# From the apps/web directory
pnpm dlx shadcn@latest add <component-name>

# Example: Add a data table
pnpm dlx shadcn@latest add table

# Example: Add a dialog
pnpm dlx shadcn@latest add dialog
```

Available components are defined in `components.json`.

## Project Structure

```
apps/web/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (mock backend)
│   │   ├── experiments/  # Experiment endpoints
│   │   ├── steps/        # Steps (LLM keys) endpoint
│   │   ├── tasks/        # Tasks endpoint
│   │   ├── tests/        # Tests endpoint
│   │   └── evals/        # Evaluations endpoint
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utilities and data
│   ├── types.ts         # TypeScript type definitions
│   └── mockData.ts      # Mock data with experiments, variants, etc.
├── public/              # Static assets
└── tests/               # Test files
```

## Type Definitions

All types are defined in [`lib/types.ts`](lib/types.ts) and aligned with the Prisma schema from the real Avido codebase.

Key types:
- `Experiment`, `ExperimentStatus`
- `Variant`, `VariantStatus`, `ConfigPatch`, `VariantWithMetrics`
- `Step`, `StepType`
- `Task`, `TaskType`, `TaskWithEvalDefinitions`
- `Test`, `TestStatus`
- `EvalDefinition`, `EvalType`
- `Eval`, `EvalResults`, `EvalWithDefinition`

## Tips for the Assignment

### Understanding Regressions

The mock data includes two types of regressions to help you build detection features:

1. **Obvious Regression** (Experiment 1, Variant 3):
   - Test failures
   - Low overall scores
   - Hallucinations in eval metadata
   - Easy to spot in aggregated metrics

2. **Subtle Regression** (Experiment 2, Variant 3):
   - Tests pass overall
   - Good naturalness scores
   - **But**: Policy compliance failures
   - Requires drilling into specific eval types

### API Design Patterns

The API demonstrates several patterns:

- **Filtering**: Most endpoints support multiple filter parameters
- **Sorting**: Control sort field and direction
- **Tenant Isolation**: All endpoints require `orgId`
- **Nested Resources**: `/experiments/{id}/variants` pattern
- **Optional Enrichment**: Use `includeDefinition` or `includeEvalDefinitions`
- **Metrics Computation**: Variants endpoint computes metrics on the fly

### What's Important

Focus on:
- Clear data visualization
- Easy comparison between variants
- Filtering and discovering regressions
- Security (orgId handling)

Don't worry about:
- Data mutations (POST/PUT/DELETE)
- Real authentication
- Database design
- Backend implementation details

## Resources

- [OpenAPI Specification](../../openapi.json) - Complete API documentation
- [Assignment Document](../../ASSIGNMENT.md) - Full assignment details
- [Main README](../../README.md) - Repository overview

## Questions?

For questions about the assignment, email [alex@avidoai.com](mailto:alex@avidoai.com).

