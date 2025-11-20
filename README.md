# Mission: AI Safety Dashboard

## Welcome to Avido

You've just joined the evaluation team at Avido. Our mission is to enable safe AI for better financial wellness, and you're building the interface that helps risk, legal, and compliance teams trust AI systems going into production.

Your task: Build a **Real-World Scenario Evaluation Dashboard** that surfaces test results and helps teams quickly understand whether an AI system is ready to go live.

## The Scenario

An AI chat assistant for a European fintech is being tested across thousands of real-world scenarios. The evaluation engine has run the tests and generated results. Your job is to build the interface that lets compliance teams see what happened, filter the noise, and make confident sign-off decisions.

**Think of it like a mission control dashboard.** Pilots need to know if all systems are go before takeoff. Your interface is their instrument panel.

## The Setup

You have a turborepo with everything ready:

- **Design system**: shadcn components pre-configured for building trustworthy interfaces
- **Testing**: Vitest for quality assurance (we care about safe code!)
- **Documentation**: Storybook for keeping your components organized
- **Backend**: Mock API serving evaluation scenario results

Available endpoints:

- `GET /api/tasks` — Returns a list of task definitions with fields: `id`, `name`, `description`
- `GET /api/tests` — Returns test executions for a specific task with fields: `id`, `taskId`, `createdAt`, `status` (pending/completed/failed)
- `GET /api/evals` — Returns evaluations for a specific test with fields: `id`, `name`, `timestamp`, `status` (passed/failed/warning), `confidenceScore` (0-100)

The endpoints are also available in the api spec [here](openapi.json)

## Mission Briefing: User Feedback from Compliance Teams

Three things the compliance team desperately needs:

1. **See all test runs and evaluations at a glance** — Display tasks, their test executions, and the evaluations within each test. A clear, hierarchical view where they can see which test runs passed, which had warnings, and which failed. Red flags should be obvious
2. **Detect degradation in live AI systems** — "The system started failing on November 15th, which task degraded?" When monitoring a production AI system, teams need to quickly identify which specific tasks started underperforming after a given date. This helps them isolate the root cause and take action before it impacts customers
3. **Export evidence for audit trails** — When they approve an AI system, they need proof. Export the filtered test runs and their evaluations so legal and risk teams have documentation they can reference later

## What We're Looking For

We evaluate candidates the same way we evaluate AI systems: we look for **safety, clarity, and confidence**.

- **Safe code** — Handles edge cases, graceful error states, doesn't break under load
- **Clarity** — The interface tells a clear story. A compliance officer should understand what they're looking at in seconds
- **Confidence** — Does the code feel solid? Would you trust this in production?

## Getting Started

1. Start the dev server and navigate to the dashboard package
2. Mock evaluation data is available immediately
3. Build using the design system components

## Guidance

- **Ruthless prioritization** — A rock-solid core feature beats three half-baked ones
- **Tell the story** — What did you prioritize and why? Leave notes for the live review
- **Use your tools** — AI is part of how we work here. We're interested in your thinking, not whether you hand-wrote every line
- **Make bold choices** — When requirements are ambiguous, make a reasonable assumption and document it. We value your judgment

## Success Criteria

You don't need to build everything, but here's what would make this shine:

- [ ]  Core dashboard displays scenario results clearly
- [ ]  Filtering works and respects user intent
- [ ]  Export feature works and includes filtered data
- [ ]  Edge cases are handled gracefully (empty states, loading, errors)
- [ ]  Code is clean and would survive a code review

Nice-to-haves:

- Tests that catch regressions
- Storybook stories that document your components
- Thoughtful polish that feels intentional

## After You're Done

Send your work via email and we'll review it together in a 1-hour call. Come ready to walk us through your decisions, explain your priorities, and chat about what you'd build next if you had unlimited time.

**Remember:** We're not looking for perfection. We're looking for how you think, how you ship, and whether you care about quality. All of those things matter at Avido.

Good luck, agent. Mission awaits. 🚀