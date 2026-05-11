#!/usr/bin/env bash
# new-project.sh
# Creates a new project under projects/<name>/
# Usage: ./new-project.sh <project-name>

set -e

NAME="$1"

if [ -z "$NAME" ]; then
  echo "Usage: $0 <project-name>" >&2
  exit 1
fi

if ! echo "$NAME" | grep -qE '^[a-z0-9][a-z0-9-]*$'; then
  echo "Project name must be lowercase alphanumeric with hyphens (e.g. 'my-startup')" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
PROJECT="$ROOT/projects/$NAME"

if [ -d "$PROJECT" ]; then
  echo "Project '$NAME' already exists at projects/$NAME" >&2
  exit 1
fi

WORKERS=(researcher developer tech-specialist finance-specialist marketer writer data-analyst)

mkdir -p "$PROJECT/mind"
mkdir -p "$PROJECT/archive"

for w in "${WORKERS[@]}"; do
  mkdir -p "$PROJECT/workspace/$w"
  touch "$PROJECT/workspace/$w/.gitkeep"
done

cat > "$PROJECT/project.md" << 'EOF'
# Project Brief

The Mind reads this file at the start of every session. Fill in the sections relevant to your project. Leave blank what does not apply — do not invent details.

---

## What we're building
<!-- Describe the product, service, initiative, or goal -->

## Target audience
<!-- Who is this for? Be specific — role, context, needs -->

## Tech stack
<!-- Languages, frameworks, platforms, existing infrastructure -->

## Key constraints
<!-- Budget, timeline, non-negotiables, known limitations -->

## Decisions already made
<!-- Anything locked in that workers should not re-open -->

## Background context
<!-- Links to prior research, relevant artifacts, or external references -->
EOF

cat > "$PROJECT/mind/state.md" << 'EOF'
# Hive State

## Active

_No active tasks._

## Done

_No completed tasks._

## Blocked

_No blocked tasks._
EOF

cat > "$PROJECT/mind/decisions.md" << 'EOF'
# Decisions

Append-only. One entry per significant decision.

Format:
```
## <slug or topic> — <date>
**Decision:** <what was decided>
**Rejected:** <what was considered and not chosen>
**Why:** <rationale>
```

---
EOF

touch "$PROJECT/mind/log.jsonl"

echo "Created projects/$NAME"
echo "Next: fill in projects/$NAME/project.md"
