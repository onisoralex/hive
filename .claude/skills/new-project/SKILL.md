---
name: new-project
description: Create a new Hive project by running the creation script, filling in the project file, and registering it.
argument-hint: "Project name (lowercase alphanumeric with hyphens)"
---

Create a new Hive project. Follow these steps in order.

## Step 1 — Validate the name

Check that the project name supplied by the user is lowercase alphanumeric with hyphens only (e.g. `my-project`). If it isn't, stop and ask for a valid name before proceeding.

Check the project registry in `CLAUDE.md` to confirm the name is not already taken.

## Step 2 — Run the creation script

```
tools/new-project.sh <project-name>
```

On Windows, use `tools/new-project.ps1 <project-name>` if the `.sh` script is unavailable.

This copies the template from `projects/template/` into `projects/<name>/`.

## Step 3 — Fill in the project file

Open `projects/<name>/project.md` and fill in:
- Project name and one-line description
- Goals and success criteria
- Known constraints or decisions already made
- Stack / tooling if already decided

Ask the user for any details that are missing.

## Step 4 — Update the registry

Add a row to the project registry table in `CLAUDE.md`:

```
| <name> | active |
```

## Step 5 — Log the creation

Append to `projects/<name>/mind/log.jsonl`:

```json
{"ts":"<ISO 8601>","type":"note","msg":"Project created.","project":"<name>"}
```

## Step 6 — Confirm

Tell the user the project is ready, list the path, and ask what to work on first.
