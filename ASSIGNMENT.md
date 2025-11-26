# Technical Interview Assignment

## Overview

Welcome! We know your time is valuable. This assignment is designed to take about 3 hours, and we're much more interested in your thought process than in a perfect product. If you don't finish everything, that's completely fine — just be ready to walk us through what you'd do next.

What we're looking for: How you think about building features, and make architectural decisions.

Presentation: 1 hour (demo + discussion)

## Context

You have a Turborepo with everything ready:

- **Design system**: a handful of shadcn components alongside the shadcn registry
- **Testing**: Vitest for unit tests
- **Documentation**: Storybook for keeping components organized
- **Backend**: Mock API serving data

Available endpoints:

- `GET /api/experiments` — Returns experiments with fields: `id`, `name`, `description`, `status`, `createdAt`, `taskIds`, `stepIds`
- `GET /api/experiments/{id}/variants` — Returns variants for an experiment with fields: `id`, `name`, `status`, `configPatch`, `previousVariantId`, `description`
- `GET /api/steps` — Returns available steps (LLM keys) with fields: `id`, `externalId`, `name`, `type`, `description`
- `GET /api/tasks` — Returns a list of tasks with fields: `id`, `title`, `description`, `evalDefinitions`
- `GET /api/tests` — Returns test executions with fields: `id`, `taskId`, `runId`, `experimentId`, `variantId`, `createdAt`, `status`
- `GET /api/evals` — Returns evaluations with fields: `id`, `testId`, `definitionId`, `status`, `score`, `results`

The endpoints are also available in the [API spec](openapi.json). For detailed setup instructions and data model documentation, see the [Web App README](apps/web/README.md).

### Build an Experiments MVP

You're building the first version of a new Experiments feature in Avido. The Experiments feature is meant to help customers seamlessly test different configurations of their AI application without touching code.

A configuration, in our scenario, can include the following dimensions:

- The model (ie. "gpt-4o")
- The temperature (ie. 0.5)
- A system prompt (ie. "You are an expert code interviewer...")

We have some user feedback, but we need you to help define what the MVP should look like.

**User feedback we've received:**

- "I want to test different models without including anyone from engineering"
- "I'm not confident in good testing methodology, so I need the system to guide me well"
- "I want to see how specific eval performance changed across iterations"
- "Sometimes I need to annotate the data for other stakeholders to see"
- "All the variants can quickly get messy, so it would be good if I can discard those that are not working"
- "It would be nice if I could see which variant is winning"
- "In the future, I might want to include team members to discuss and annotate"

**Core requirements:**
You already have all the data, and will only need to display it, not manipulate it. You can assume, that no further variantions or tests need to be triggered. You decide what to include, and how, based on the feedback above. Think about what's essential for an MVP vs. what can wait for v2.

**Design for the future:**
Keep in mind that users will eventually want to collaborate on Experiments with team members. You don't need to implement this, but your choices should make it possible without a major rewrite. Be ready to discuss how you would approach this in the next iteration.

## What to Prioritize

**Focus on:**

- Clear, readable code
- Core functionality that works end-to-end
- Thoughtful decisions about what to include/exclude and why
- Security and performance (especially around data access)

**Don't worry about:**

- Pixel-perfect design
- Extensive testing (though illustrating your testing strategy is great)

## Deliverables

- Working implementation - A functional experiments feature
- Your reasoning - Notes or comments explaining key decisions (can be verbal during the presentation)

## Presentation Format (1 hour)

### Demo & Walkthrough (30 minutes)

- Show what you built and how it works
- Walk through your code and key decisions
- Explain what you'd do with more time

### AI-Driven Development (15 minutes)

- Show how you used AI tools during implementation
- Discuss your workflow and best practices
- Share where AI helped most vs. where you relied on your own judgment

### Technical Discussion (15 minutes)

- Your approach to the collaboration requirement
- Alternative implementations you considered
- Trade-offs and architectural decisions

If anything is unclear, make a reasonable assumption and be ready to explain your reasoning. We want to see how you handle ambiguity.

Good luck! We're excited to dive into your solution together.

PS. For any questions, please email [alex@avidoai.com](mailto:alex@avidoai.com)
