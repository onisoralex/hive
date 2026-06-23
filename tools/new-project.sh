#!/usr/bin/env bash
# new-project.sh
# Creates a new project by copying the template under projects/<name>/
# Usage: ./new-project.sh <project-name>
#
# To add files or folders to all future projects, edit projects/template/ instead of this script.

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
TEMPLATE="$ROOT/projects/template"
PROJECT="$ROOT/projects/$NAME"

if [ ! -d "$TEMPLATE" ]; then
  echo "Template not found at projects/template — cannot create project." >&2
  exit 1
fi

if [ -d "$PROJECT" ]; then
  echo "Project '$NAME' already exists at projects/$NAME" >&2
  exit 1
fi

cp -r "$TEMPLATE" "$PROJECT"

echo "Created projects/$NAME"
echo "Next:"
echo "  1. Set the repo path in projects/$NAME/project.md"
echo "  2. Fill in project brief in projects/$NAME/project.md"
echo "  3. Add spawning notes to projects/$NAME/CLAUDE.md"
echo "  4. Initialize the project repo: git init C:/repos/$NAME"
echo "     Copy projects/repo-template/ into it as a starting point"
