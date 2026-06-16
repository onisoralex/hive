---
name: hive-archive
description: Archive the workspace for a Hive project, moving completed task folders into a timestamped archive subfolder.
argument-hint: "Project name to archive (leave blank to be prompted)"
---

Archive the workspace for a Hive project. Use at the end of a significant phase or when the workspace is cluttered with completed task folders.

## Step 1 — Identify the project

If the user didn't specify a project, list the active projects from the registry in `CLAUDE.md` and ask which one to archive.

## Step 2 — Check what's in the workspace

List `projects/<name>/workspace/` to see what task folders exist (ignore `.gitkeep`). If the workspace is empty, tell the user and stop — nothing to archive.

Show the user what will be moved before proceeding.

## Step 3 — Run the archive script

```
tools/archive-workspace.sh <project-name>
```

On Windows, use `tools/archive-workspace.ps1 <project-name>` if the `.sh` script is unavailable.

This moves all task folders from `projects/<name>/workspace/` into a timestamped subfolder at `projects/<name>/archive/<timestamp>/`.

## Step 4 — Update state

Open `projects/<name>/mind/state.md`. Move any tasks that correspond to the archived folders from `## Active` or `## Done` into a note referencing the archive path, or remove them if they're fully complete and logged.

## Step 5 — Log the archive

Append to `projects/<name>/mind/log.jsonl`:

```json
{"ts":"<ISO 8601>","type":"note","msg":"Workspace archived to archive/<timestamp>/. Folders moved: <list>.","project":"<name>"}
```

## Step 6 — Confirm

Tell the user what was archived and where it now lives.
