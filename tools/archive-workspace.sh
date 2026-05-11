#!/usr/bin/env bash
# archive-workspace.sh
# Moves all task folders from a project's workspace/ into its archive/<timestamp>/
# Usage: ./archive-workspace.sh <project-name>

set -e

PROJECT="$1"

if [ -z "$PROJECT" ]; then
  echo "Usage: $0 <project-name>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
WORKSPACE="$ROOT/projects/$PROJECT/workspace"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARCHIVE="$ROOT/projects/$PROJECT/archive/$TIMESTAMP"

if [ ! -d "$WORKSPACE" ]; then
  echo "Project '$PROJECT' not found or has no workspace at projects/$PROJECT/workspace" >&2
  exit 1
fi

moved=0

for worker_dir in "$WORKSPACE"/*/; do
  [ -d "$worker_dir" ] || continue
  worker=$(basename "$worker_dir")
  for task_dir in "$worker_dir"*/; do
    [ -d "$task_dir" ] || continue
    task=$(basename "$task_dir")
    dest="$ARCHIVE/$worker"
    mkdir -p "$dest"
    mv "$task_dir" "$dest/"
    ((moved++)) || true
  done
done

if [ "$moved" -gt 0 ]; then
  echo "Archived $moved task(s) to projects/$PROJECT/archive/$TIMESTAMP"
else
  echo "Nothing to archive."
fi
