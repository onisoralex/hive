# Project Brief

---

## What this is

Logos is the setup and configuration of a personal memory system for Claude Code, built on MemPalace. The goal is to give Claude persistent, searchable context across coding projects, hobbies, and life notes — without sending data to any external service.

This is not a development project. The deliverable is a working MemPalace installation, wired into Claude Code, with full documentation for reproducing the setup on any machine.

## Who it's for

Personal use only (Alex). Covers coding projects, DnD campaigns, electronics projects, cooking, and any future hobby or topic.

## Goals

- MemPalace installed and running locally (pip-based, no Docker)
- Claude Code configured to use MemPalace via MCP
- Memory hierarchy (wings/rooms) defined to match real use cases
- Full setup documentation: step-by-step, with all config files in copy-paste code blocks, reproducible on a new machine without googling
- Documentation suitable for export to Obsidian

## Key constraints

- CPU-only (no CUDA, no GPU dependencies)
- No external API calls — fully local, no API keys
- No Docker — MemPalace runs as a local pip-installed process
- Windows-compatible (primary machine is Windows)

## Out of scope

- Custom code or modifications to MemPalace
- Web UI
- Multi-user support

## Current state — complete as of 2026-05-28

All goals met. MemPalace is installed and running. Setup and usage are fully documented. No further development needed.

The `memory-system/` folder (abandoned custom Qdrant + BGE-M3 + Node.js MCP implementation, built but never deployed) was deleted on 2026-08-11 — superseded by the MemPalace pivot, no longer needed as a record.

## References

- Decision log (Qdrant → MemPalace pivot): `mind/decisions.md`
- Setup guide (new machine or reinstall): `docs/mempalace-setup.md`
- Memory strategy (what goes where): `docs/mempalace-usage-principles.md`
- MemPalace repo: https://github.com/MemPalace/mempalace
