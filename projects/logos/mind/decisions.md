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

## architecture — 2026-05-16
**Decision:** MCP server runs as a local Node.js stdio process, not in Docker.
**Rejected:** Running the MCP server as a Docker container.
**Why:** Claude Code connects to MCP servers via stdio — the server must be a local process it can spawn directly. A containerized process can't use stdio transport.

## embedding-backend — 2026-05-16
**Decision:** sentence-transformers (Python) for BGE-M3 embeddings, not llama.cpp.
**Rejected:** llama.cpp GGUF-based embedding.
**Why:** The original spec mentioned llama.cpp but sentence-transformers has first-class BGE-M3 support including native sparse vector output. Simpler, more reliable, and CPU-only works fine.

## storage — 2026-05-16
**Decision:** Qdrant data mounted to `./data/qdrant` on host, not a Docker named volume.
**Rejected:** Docker named volumes.
**Why:** User needs to be able to back up and copy memories to a second device by just copying a folder. Named volumes are opaque and harder to move.

## domain-model — 2026-05-16
**Decision:** domain + project as required filters on every query; scope as optional.
**Rejected:** Flat tag-only filtering.
**Why:** Keeps memories from different contexts from polluting each other's search results. The hierarchy (domain → project → scope) matches how the user actually thinks about their work.

## collection-setup — 2026-05-16
**Decision:** MCP server auto-creates the Qdrant collection and payload indexes on startup if missing.
**Rejected:** Requiring a manual setup script.
**Why:** Single-command startup is a stated goal. The server is idempotent — if the collection exists, it skips creation.

## implementation-pivot — 2026-05-28
**Decision:** Replace the custom Logos stack (Qdrant + BGE-M3 embedding service + Node.js MCP server) with MemPalace.
**Rejected:** Testing and deploying the custom-built Logos system.
**Why:** MemPalace meets all core requirements (fully local, MCP-native, semantic search, persistent, hierarchical scoping) with a pip install and no Docker stack. Logos was never tested. Maintenance overhead of a custom Docker+Python+Node stack is not worth the retrieval quality improvement (BGE-M3 vs all-MiniLM-L6-v2) given personal use cases. User wants to focus effort on project/code creation, not memory infrastructure.

## memory-system-cleanup — 2026-08-11
**Decision:** Delete the `memory-system/` folder (abandoned custom Qdrant + BGE-M3 + Node.js MCP implementation).
**Rejected:** Keeping it on disk as a historical record.
**Why:** Superseded by the MemPalace pivot and never deployed. Full history remains recoverable via git; no reason to keep it taking up disk space.

## scaffold-cleanup — 2026-08-11
**Decision:** Delete `docs/architecture.md`, `docs/specs/spec.md`, `mind/backlog.md`, `mind/roadmap.md`, `mind/open-questions.md`.
**Rejected:** Keeping them as unused placeholders.
**Why:** All five were untouched Hive scaffolding templates (byte-identical to `projects/template/`), never filled in because logos was a setup/config project, not a code build. `architecture.md` and `spec.md` in particular described a web-app stack (API endpoints, Postgres tables, Express files) that never applied here. Removing them reduces clutter with no information loss — full history recoverable via git.
