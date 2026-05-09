#!/usr/bin/env bash
# archive-workspace.sh
# Moves all task folders from workspace/ into archive/<timestamp>/
# Run from any location — paths are resolved relative to this script.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARCHIVE="$ROOT/archive/$TIMESTAMP"
WORKSPACE="$ROOT/workspace"

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
    ((moved++))
  done
done

if [ "$moved" -gt 0 ]; then
  echo "Archived $moved task(s) to archive/$TIMESTAMP"
else
  echo "Nothing to archive."
fi
