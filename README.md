# Hive

A multi-agent AI orchestration system built on Claude Code. One central agent (the Mind) coordinates a team of specialized workers to complete complex tasks — in parallel when possible, sequentially when needed.

## Concept

**The Mind** is the orchestrator. It talks to you, breaks down goals, decides which workers to use, spawns them with focused tasks, and synthesizes their output. It never accumulates worker context — only results — so it stays lean across long sessions.

**Workers** are stateless and disposable. Each one receives a clear task, executes it, returns a structured result, and closes. Their behavior is defined entirely by their `CLAUDE.md` file, which the Mind reads and injects at spawn time. To change a worker's behavior, edit its file.

## Workers

| Worker | Role |
|---|---|
| Researcher | Information gathering, competitive analysis, source synthesis |
| Developer | Writing and running code, implementing features, debugging |
| Tech Specialist | Tool/framework evaluation, architecture decisions, technical specs |
| Finance Specialist | Financial modeling, unit economics, pricing analysis, cash flow |
| Marketer | Positioning, messaging strategy, go-to-market planning |
| Writer | Long-form content: blog posts, documentation, case studies, proposals |
| Data Analyst | Analyzing datasets, identifying patterns, producing structured insights |

To add a new worker: create a folder under `workers/` with a `CLAUDE.md` file. Use `workers/_template/CLAUDE.md` as the starting point.

## How it works

1. You give the Mind a goal.
2. The Mind selects workers, generates a timestamped task slug, reads each worker's `CLAUDE.md`, and spawns agents with injected instructions and task details.
3. Independent tasks run in parallel. The Mind waits for all results.
4. The Mind synthesizes the output and presents it to you — never raw worker transcripts.

Every worker returns a structured `---HIVE OUTPUT---` block so the Mind can parse results consistently regardless of worker type.

## Worker chaining

When tasks depend on each other, the Mind passes prior worker artifacts as context to the next spawn. The receiving worker reads those files before starting. This keeps prompts lean while maintaining continuity across multi-step pipelines.

Example: Researcher produces a market report → Marketer receives the report path as context → Marketer produces positioning grounded in the research.

## project.md

Fill in `project.md` at the root when starting a new project. The Mind reads it at the start of every session and injects relevant context into every worker spawn — so you never have to repeat yourself.

Include: what you're building, target audience, tech stack, key constraints, decisions already made, and any relevant background. Leave blank what doesn't apply.

## Log viewer

Open `tools/log-viewer.html` directly in any browser — no server needed. Load `mind/log.jsonl` from your project folder using the file picker.

Filter by:
- **Time range** — "last X minutes" with a live Now ceiling, or custom from/to
- **Type** — toggle individual entry types (spawn, result, decision, note, synthesis, error, user)

Click any row to expand its raw JSON. Entries are shown newest-first. Use the Reload button to refresh after a session without re-picking the file.

## Using Hive

### Start a new project

```bash
git clone <this-repo> my-project
cd my-project
```

Open the folder in Claude Code. The Mind starts automatically from `CLAUDE.md`. Fill in `project.md` before your first real session. The mind state files (`mind/state.md`, `mind/decisions.md`, `mind/log.jsonl`) come with their scaffolds and accumulate project history as you work.

### Update prompts

When worker or Mind definitions improve, pull without touching your project state:

```bash
git pull
```

Only `CLAUDE.md` files, `project.md` template, and framework structure update. Mind state and workspace outputs are unaffected.

### Run multiple projects simultaneously

Each clone is fully independent.

```bash
git clone <this-repo> project-alpha
git clone <this-repo> project-beta
```

## File structure

```
hive/
├── CLAUDE.md                       # Mind identity, worker registry, spawn protocol
├── project.md                      # Project brief — fill in when starting a project
├── mind/
│   ├── state.md                    # Live task board (Active / Done / Blocked)
│   ├── decisions.md                # Append-only decision log
│   └── log.jsonl                   # Structured event log (JSON Lines)
├── workers/
│   ├── _template/CLAUDE.md         # Starting point for new workers
│   ├── researcher/CLAUDE.md
│   ├── developer/CLAUDE.md
│   ├── tech-specialist/CLAUDE.md
│   ├── finance-specialist/CLAUDE.md
│   ├── marketer/CLAUDE.md
│   ├── writer/CLAUDE.md
│   └── data-analyst/CLAUDE.md
├── tools/
│   └── log-viewer.html             # Browser-based log viewer — open locally, no server needed
└── workspace/                      # Worker output (content gitignored per subdirectory)
    ├── researcher/
    ├── developer/
    ├── tech-specialist/
    ├── finance-specialist/
    ├── marketer/
    ├── writer/
    └── data-analyst/
```

## What is and isn't tracked in git

| Path | Tracked | Note |
|---|---|---|
| `CLAUDE.md` (all) | Yes | Framework — improves over time via `git pull` |
| `project.md` | Yes | Fill in per project |
| `mind/state.md` | Yes | Scaffold committed; accumulates project state |
| `mind/decisions.md` | Yes | Scaffold committed; accumulates decisions |
| `mind/log.jsonl` | Yes | Scaffold committed; accumulates session events |
| `workspace/*/` (directories) | Yes | Structure is part of the framework |
| `workspace/*/*` (files) | No | Worker output — gitignored per subdirectory |
| `tools/` | Yes | Framework utilities — improves over time |
