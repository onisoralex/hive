# Battleplan — coffee-shop → Hive migration

## Goal

Move `C:\coffee-shop` into the Hive as `projects/coffee-shop`, add the Mind scaffolding around it, and register it in the project registry. The app itself does not change; only the project wrapper is added.

## Context

- **Server deployment is unaffected.** The Linux server runs the app from `/opt/coffee-shop`. That path is hardcoded in `setup.sh`, `autoupdate.sh`, and `startupscript.service` — all on the server, not in the dev directory. Moving the Windows dev root does not touch it.
- **Git history is preserved.** Moving the directory moves the `.git` folder with it. No re-cloning, no history loss.
- **The app code itself is not restructured.** Only the Hive scaffolding layer wraps it.

---

## Steps

### Step 1 — Create the Hive project folder

Create `C:\hive\projects\coffee-shop\` with all required Hive subdirectories:

```
projects/coffee-shop/
├── app/              ← app code lands here (Step 2)
├── archive/
│   └── .gitkeep
├── docs/
│   └── architecture.md    ← copy/move from app's docs/ARCHITECTURE.md
├── mind/
│   ├── state.md
│   ├── decisions.md
│   ├── log.jsonl
│   ├── backlog.md
│   ├── open-questions.md
│   └── roadmap.md
├── workspace/
│   ├── developer/
│   ├── researcher/
│   ├── tech-specialist/
│   ├── qa/
│   ├── marketer/
│   ├── writer/
│   └── data-analyst/
└── project.md
```

### Step 2 — Move the app code

Move `C:\coffee-shop\` → `C:\hive\projects\coffee-shop\app\`

```powershell
Move-Item C:\coffee-shop C:\hive\projects\coffee-shop\app
```

The `.git` inside moves with it. Git operates on the tree from wherever `.git` lives — no impact.

### Step 3 — Populate mind/

Migrate content from the app's existing docs into the Hive mind layer. **Do not duplicate** — move or reference, then delete the source.

| Source (inside `app/`) | Destination |
|---|---|
| `docs/TRACKER.md` — current task board section | `mind/state.md` |
| `docs/TRACKER.md` — decision log entries | `mind/decisions.md` |
| `docs/PLANNING.md` | `mind/roadmap.md` |
| CLAUDE.md "Open decisions" section | `mind/open-questions.md` |
| `docs/TRACKER.md` historical entries (if any) | `mind/log.jsonl` (converted to JSON Lines) |

`mind/backlog.md` starts empty — populate from the "Next up" section of TRACKER.md.

`mind/log.jsonl` starts with a single bootstrap entry:

```json
{"ts":"<ISO timestamp>","type":"note","msg":"Project migrated into Hive from C:\\coffee-shop","project":"coffee-shop"}
```

### Step 4 — Write project.md and projects/coffee-shop/CLAUDE.md

**`project.md`** — the Mind's entry brief (non-technical, what + why). Source material is in `app/CLAUDE.md` ("What this project is" section and domain context). Keep it in the style of `projects/oikos/project.md` — high-level only; technical decisions stay in `mind/decisions.md`.

**`projects/coffee-shop/CLAUDE.md`** — the Mind-facing context file that bridges the Hive session (started at `C:\hive\`) to the app's AI context. Claude Code traverses CLAUDE.md files upward from CWD only — it does not descend into subdirectories. Starting from the hive root, `app/AGENTS.md` is never auto-loaded. This file fixes that.

Contents:

```markdown
# coffee-shop — Hive context

This project has its own app repo at `app/`. The Hive Mind must read both layers:

1. `projects/coffee-shop/project.md` — project brief (what and why)
2. `projects/coffee-shop/mind/state.md` — current task board
3. `projects/coffee-shop/app/AGENTS.md` — full app context: tech stack, domain logic,
   coding rules, conventions. Workers need this. Read it before spawning any Developer or QA worker.

The `app/` directory is the organisation's git repo. Do not commit Hive files (mind/,
workspace/, archive/, this file) into it — they live outside `app/` intentionally.
```

This file is tracked by the Hive root git, not the coffee-shop org repo.

### Step 5 — Rename app/CLAUDE.md → app/AGENTS.md, add stub CLAUDE.md

**Why:** `AGENTS.md` is a tool-agnostic name that other AI agents recognize directly. Claude Code only auto-loads `CLAUDE.md`, so a one-liner stub makes both work off a single source of truth.

```
git mv CLAUDE.md AGENTS.md
```

Then create `app/CLAUDE.md` with exactly one line:

```
@./AGENTS.md
```

Claude Code auto-loads `CLAUDE.md` → imports `AGENTS.md` → full context. Other AI tools read `AGENTS.md` directly. The Hive bridge reads `app/AGENTS.md` explicitly. All three paths resolve to the same content; nothing is duplicated.

**Content edits to AGENTS.md** (formerly CLAUDE.md): remove the "Session continuity" section at the bottom (replaced by `mind/state.md`) and the "Open decisions" section (migrated to `mind/open-questions.md`). Everything else stays as-is.

Also remove `app/.claude/commands/close-session.md` from the org repo — it is a Hive command, not an app command. Move it to `C:\hive\.claude\commands\` (or confirm it already exists there).

### Step 6 — Register in Hive

Add `coffee-shop` to the project registry table in `C:\hive\CLAUDE.md`:

```markdown
| coffee-shop | active |
```

### Step 7 — Add to Hive's .gitignore

The coffee-shop app has its own `.git`. The Hive root repo should ignore it to avoid treating it as a submodule:

Add to `C:\hive\.gitignore`:
```
projects/coffee-shop/app/
```

(Same pattern as other projects — check how `projects/tone/app/` and `projects/oikos/app/` are handled.)

### Step 8 — Verify

- [ ] `C:\hive\projects\coffee-shop\app\.git` exists and `git log` shows full history
- [ ] `docker compose up -d` still works from inside `app/`
- [ ] `mind/state.md` reflects current project state accurately
- [ ] `project.md` is readable as a standalone brief (no code, no stack details)
- [ ] Hive CLAUDE.md registry shows `coffee-shop | active`
- [ ] No duplicate content between `app/CLAUDE.md` and the mind files

---

## What does NOT change

- The app code, folder structure, and file contents inside `app/`
- The server deployment at `/opt/coffee-shop`
- The coffee-shop git history and remote
- `app/docs/ARCHITECTURE.md`, `app/docs/SOUL.md`, `app/docs/manual/` — these stay in the app; they are app-facing docs, not Mind-facing state

---

## Estimated effort

Low. No code changes, no schema changes, no deployments. Purely structural + document work. Could be done in a single session.
