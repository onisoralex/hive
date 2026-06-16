Perform an end-of-session handoff for the Hive. Work through these steps in order. Do not skip steps, even if a project had little activity.

## Step 1 — Scope the session

- List the `projects/` directory to identify all projects.
- For each project, read `mind/state.md` and the last 20 lines of `mind/log.jsonl` to determine which projects were active this session.
- Run `git log --oneline -10` and `git diff --stat HEAD~5..HEAD` to see what files actually changed.
- Work only on projects that had activity. List them before proceeding.

## Step 2 — Update state

For each active project, update `projects/<name>/mind/state.md`:
- Move tasks that completed this session from Active to Done.
- Update any tasks that are partially done with a one-line status note.
- Add anything newly blocked to Blocked with a reason.
- If Active is now empty, say so explicitly — don't leave stale tasks there.

## Step 3 — Record decisions

For each active project, open `projects/<name>/mind/decisions.md`. For every significant decision made this session that is not already recorded, append an entry:

```
## <topic> — <date>
**Decision:** <what was decided>
**Rejected:** <what was considered and not chosen, or "nothing significant">
**Why:** <rationale>
```

Skip decisions that are already captured or that are obvious from the code.

## Step 4 — Close the log

For each active project, append a session-close entry to `projects/<name>/mind/log.jsonl`:

```json
{"ts":"<ISO 8601>","type":"note","msg":"Session closed. <one sentence on what was accomplished and what is next.>","project":"<name>"}
```

## Step 5 — Flag archive candidates

For each active project, check whether `projects/<name>/workspace/<worker>/` contains any task folders (not just `.gitkeep`). If so, list them and note they are candidates for archiving via `tools/archive-workspace.sh <project>`. Do not run the script.

## Step 6 — Spawn developer for code comments

Read `workers/developer/CLAUDE.md`. Then, from the git diff in Step 1, collect all source code files that were added or modified this session (exclude markdown, JSON config, `.env`, `.gitignore`, and lockfiles).

If there are any such files, generate a task slug `code-comments-<YYYYMMDD-HHMMSS>` and spawn a Developer agent with this prompt structure:

```
[full workers/developer/CLAUDE.md contents]

---TASK---
slug: code-comments-<slug>
output: projects/<project>/workspace/developer/code-comments-<slug>/
context: none

Review the following files that were modified or created this session. For each file, add comments only where the WHY behind a decision is non-obvious — a hidden constraint, a subtle invariant, a workaround, behavior that would surprise a reader. Do not comment what the code does. Do not add docstrings or block comments. One short inline comment per non-obvious point, maximum.

Files to review:
<list of files with absolute paths>
```

Spawn with `run_in_background: true`. Log the spawn in `mind/log.jsonl`. You do not need to wait for the result before proceeding to Step 7.

## Step 7 — Report

Output a structured summary:

**Projects touched:** list  
**Completed this session:** bullet list  
**Still active / in progress:** bullet list  
**Blocked:** bullet list or "none"  
**Archive candidates:** list or "none"  
**Developer spawned for:** list of files sent for comment review, or "none"  
**Next session should start with:** 2–3 bullets on where to pick up
