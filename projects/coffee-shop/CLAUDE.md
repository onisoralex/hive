# coffee-shop — Hive context

This project has its own app repo at `app/`. The Hive Mind must read both layers at session start:

1. `projects/coffee-shop/project.md` — project brief (what and why)
2. `projects/coffee-shop/mind/state.md` — current task board
3. `projects/coffee-shop/app/AGENTS.md` — full app context: tech stack, domain logic, coding rules, conventions. Always read this. It is the essential reference for anyone working on this project.

The `app/` directory is the organisation's git repo. Do not commit Hive files (`mind/`, `workspace/`, `archive/`, this file) into it — they live outside `app/` intentionally.
