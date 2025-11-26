# Avido Technical Interview Assignment

## Overview

Welcome to the Avido Experiments MVP take-home assignment! This repository contains everything you need to build a feature that helps customers test different configurations of their AI applications.

**What you're building**: An Experiments feature that allows users to systematically test variations in LLM configuration (temperature, prompts, models) and compare results across multiple evaluation metrics.

**Time expectation**: ~3 hours focused work

**Deliverable**: Working frontend implementation + discussion of architectural decisions

## What's Included

This Turborepo provides:

- **Mock API** - RESTful endpoints serving experiment, variant, task, test, and evaluation data
- **Type Definitions** - Comprehensive TypeScript types aligned with production schema
- **Mock Data** - Realistic experiments with baseline variants, improvements, and regressions
- **Design System** - shadcn/ui components pre-configured
- **Testing Setup** - Vitest for unit tests
- **Documentation** - Storybook for component documentation
- **OpenAPI Spec** - Complete API documentation in [openapi.json](openapi.json)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

The mock API will be available at `http://localhost:3000/api/*`

## Understanding the Assignment

Read the complete assignment details in [ASSIGNMENT.md](ASSIGNMENT.md).

## Data Model Quick Reference

```
Experiment (e.g., "Improve Response Quality")
  └── Variants (Baseline, Lower Temp, Enhanced Prompt, etc.)
      └── Tests (one per task)
          └── Evals (one per eval definition)
```

**Key relationships:**

- Each experiment tests a fixed set of tasks
- Each variant runs the same tasks for fair comparison
- Tests are tagged with `experimentId` and `variantId`
- Evals measure different aspects (naturalness, accuracy, policy compliance, etc.)

See [apps/web/README.md](apps/web/README.md) for comprehensive data model documentation.

## Mock Data Highlights

The dataset includes three experiments demonstrating:

### Obvious Regression

**Experiment 1, Variant 3** - High temperature (0.9) causes:

- Test failures
- Hallucinations detected
- Low faithfulness scores
- Easy to spot in aggregate metrics

### Subtle Regression

**Experiment 2, Variant 3** - Over-empathetic prompt causes:

- Good naturalness scores
- **But**: Policy compliance failures
- Tests still pass overall
- Requires drilling into specific eval types

### Improvements

**Experiment 1, Variants 1-2** show progressive improvements in consistency and accuracy.

## API Overview

In order to mock authentication, all endpoints require an `orgId` query parameter:

```bash
# List experiments
GET /api/experiments?orgId=org-avido-demo

# Get variants with metrics
GET /api/experiments/{id}/variants?orgId=org-avido-demo

# List available steps (LLM keys)
GET /api/steps?orgId=org-avido-demo

# List tasks
GET /api/tasks?orgId=org-avido-demo

# List tests (with experiment/variant filtering)
GET /api/tests?orgId=org-avido-demo&variantId=var-1-1

# List evaluations
GET /api/evals?orgId=org-avido-demo&testId=test-1-1
```

See [openapi.json](openapi.json) for complete API specification.

## Workspace Structure

```
.
├── apps/
│   └── web/                 # Main Next.js application
│       ├── app/api/        # Mock API endpoints
│       ├── lib/            # Types and mock data
│       └── README.md       # Detailed setup guide
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── eslint-config/      # Shared ESLint config
│   └── typescript-config/  # Shared TypeScript config
├── openapi.json            # API specification
└── ASSIGNMENT.md          # Full assignment details
```

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/):

```bash
cd apps/web
pnpm dlx shadcn@latest add <component-name>
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm --filter web test
```

## Documentation & Storybook

```bash
# Start Storybook (if you add stories)
pnpm storybook
```

## Next Steps

1. **Read the assignment**: [ASSIGNMENT.md](ASSIGNMENT.md)
2. **Review the data model**: [apps/web/README.md](apps/web/README.md)
3. **Explore the API**: Check [openapi.json](openapi.json) or make test requests
4. **Start building**: `pnpm dev` and create your solution

## Resources

- [Assignment Details](ASSIGNMENT.md) - Full requirements and context
- [Web App README](apps/web/README.md) - Data model, setup, and tips
- [OpenAPI Spec](openapi.json) - Complete API documentation
- [shadcn/ui Docs](https://ui.shadcn.com/) - Component library
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation

## Questions?

For any questions about the assignment, reach out to [alex@avidoai.com](mailto:alex@avidoai.com).
