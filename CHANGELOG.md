# Changelog

## [1.1.0] — 2026-05-09

### Added
- **Session recovery** — Mind checks `mind/state.md` at session start and surfaces any interrupted Active tasks to the user before accepting new work
- **Artifact naming convention** — each worker now writes a predictable primary file (`report.md`, `summary.md`, `spec.md`, `model.md`, `brief.md`, `draft.md`, `analysis.md`), making worker chaining more reliable
- **Log viewer auto-refresh** — toggle with configurable interval (5–300 s); re-reads the file without re-picking it
- **Workspace archive scripts** — `tools/archive-workspace.ps1` and `tools/archive-workspace.sh` move all task folders into a timestamped `archive/` directory

---

## [1.0.0] — 2026-05-09

Initial Hive framework release.

### Framework
- Mind orchestrator with spawn protocol, worker registry, and state management
- Worker output contract (`---HIVE OUTPUT---` block)
- Consistent log schema: every entry requires `ts`, `type`, and `msg`
- Worker chaining via `context:` field in task prompts
- Timestamped task slugs (`topic-YYYYMMDD-HHMMSS`)
- `project.md` brief injected into every worker spawn

### Workers
- Researcher, Developer, Tech Specialist, Finance Specialist, Marketer, Writer, Data Analyst
- Worker template (`workers/_template/CLAUDE.md`)

### Tools
- Log viewer (`tools/log-viewer.html`) with time filtering, type chips, dark theme, and File System Access API support
- Three mind state files: `state.md`, `decisions.md`, `log.jsonl`
