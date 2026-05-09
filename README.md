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
| Marketer | Positioning, messaging strategy, copywriting, go-to-market |

## How it works

1. You give the Mind a goal.
2. The Mind selects workers, generates a task slug, reads each worker's `CLAUDE.md`, and spawns agents with the injected instructions + task.
3. Independent tasks run in parallel. The Mind waits for all results.
4. The Mind synthesizes the output and presents it to you — never raw worker transcripts.

Every worker returns a structured `---HIVE OUTPUT---` block so the Mind can parse results consistently regardless of worker type.

## Using Hive

### Start a new project

```bash
git clone <this-repo> my-project
cd my-project
```

Open the folder in Claude Code. The Mind starts automatically from `CLAUDE.md`. Project state (`mind/state.md`, decisions, logs, workspace outputs) is gitignored — it lives only in your project folder.

### Update prompts

When worker or Mind definitions improve, pull without touching your project state:

```bash
git pull
```

Only the `CLAUDE.md` files update. Your runtime state is untouched.

### Run multiple projects simultaneously

Each clone is independent. Project state never leaves the folder it was created in.

```bash
git clone <this-repo> project-alpha
git clone <this-repo> project-beta
```

## File structure

```
hive/
├── CLAUDE.md                    # Mind identity, worker registry, spawn protocol
├── mind/
│   ├── state.md                 # Live task board (gitignored — per project)
│   ├── decisions.md             # Decision log (gitignored — per project)
│   └── log.md                   # Session activity (gitignored — per project)
├── workers/
│   ├── researcher/CLAUDE.md
│   ├── developer/CLAUDE.md
│   ├── tech-specialist/CLAUDE.md
│   ├── finance-specialist/CLAUDE.md
│   └── marketer/CLAUDE.md
└── workspace/                   # Worker output lives here (gitignored — per project)
    ├── researcher/
    ├── developer/
    ├── tech-specialist/
    ├── finance-specialist/
    └── marketer/
```

## What is and isn't tracked in git

| Path | Tracked | Why |
|---|---|---|
| `CLAUDE.md` (all) | Yes | Framework — improves over time |
| `mind/state.md` | No | Per-project runtime state |
| `mind/decisions.md` | No | Per-project runtime state |
| `mind/log.md` | No | Per-project runtime state |
| `workspace/*/` (directories) | Yes | Structure is part of the framework |
| `workspace/*/*` (files) | No | Worker output belongs to the project |
