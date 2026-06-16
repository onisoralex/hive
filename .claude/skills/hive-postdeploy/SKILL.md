---
name: hive-postdeploy
description: Run a post-deploy monitoring check-in for a Hive project, evaluating traction and deciding whether to iterate, kill, or scale.
argument-hint: "Project name to evaluate (leave blank to be prompted)"
---

Run a post-deploy monitoring check-in for a Hive project. Use after a project has shipped to production — weekly for the first four weeks, monthly thereafter. The user can override this cadence per project.

## Step 1 — Identify the project

If the user didn't specify a project, ask which deployed project to evaluate.

Read `projects/<name>/project.md` to load the project's success criteria before proceeding.

## Step 2 — Gather analytics data

Ask the user to provide current data, or confirm it is already available:
- PostHog or Plausible export (user activity, retention)
- Stripe revenue summary (if applicable)
- Error logs or uptime data

If the user cannot provide any data, note this as a blocker and stop. A check-in without data produces no signal.

## Step 3 — Spawn a Data Analyst

Read `workers/data-analyst/CLAUDE.md`. Generate a task slug: `postdeploy-<project>-<YYYYMMDD-HHMMSS>`.

Spawn the Data Analyst with the analytics data as context. Task: evaluate traction against the project's success criteria from `project.md` and return a signal.

Log the spawn in `projects/<name>/mind/log.jsonl`.

## Step 4 — Synthesize the signal

Parse the Data Analyst's output and map it to one of three signals:

- **Iterate** — traction exists but there is room to improve. Spawn a Developer or Researcher for the next improvement.
- **Kill** — no meaningful traction after a reasonable window. Document the decision in `projects/<name>/mind/decisions.md` and vault the project in the registry.
- **Scale** — exceeding expectations. Surface to the user for a reinvestment discussion.

## Step 5 — Log the decision

Append to `projects/<name>/mind/log.jsonl`:

```json
{"ts":"<ISO 8601>","type":"decision","msg":"Post-deploy check-in: <signal>. <one sentence rationale>.","project":"<name>"}
```

## Step 6 — Report to the user

Present the signal, the rationale, and the next action clearly. Do not dump raw analyst output.
