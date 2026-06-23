# AI Memory Tools Evaluation -- Alternatives to Logos

**Date:** 2026-05-27
**Purpose:** Assess existing MCP-native AI memory tools as potential alternatives to Logos.

---

## Evaluation Criteria

1. Fully local -- no external API calls, no cloud, no API keys
2. MCP-native -- exposes tools via MCP (stdio or HTTP)
3. Semantic search -- vector/embedding-based, not just keyword
4. Persistent -- memories survive restarts
5. Structured filtering -- scope by context (project, domain, etc.)
6. Maintenance burden -- actively maintained; reasonable setup

---

## Comparison Table

| Tool | Fully local | MCP-native | Semantic search | Persistent | Filtering | Maintenance |
|---|---|---|---|---|---|---|
| MemPalace | YES No API keys; CPU-only; pip install | YES 29 MCP tools stdio | YES ChromaDB + sentence-transformers | YES ChromaDB + SQLite | YES Wing/room/drawer hierarchy | YES v3.3.5 May 2026 active |
| Basic Memory | YES no API keys; cloud optional | YES works with Claude Code | PARTIAL Hybrid full-text + FastEmbed; not pure semantic | YES Markdown on disk | PARTIAL Project-level only; no domain/scope sub-hierarchy | YES v0.21.5 May 2026 active |
| mem0 OpenMemory | PARTIAL Designed local but defaults OpenAI; needs Ollama workaround | YES MCP server included | YES Vector via configurable provider | YES Postgres + Qdrant Docker | NO No project/scope filtering documented | PARTIAL Active but Docker-heavy; local config is workaround |
| mcp-memory-service | YES ONNX MiniLM no API keys | YES MCP server REST-primary | YES 384-dim ONNX vectors | YES SQLite or Milvus | PARTIAL Agent-ID + tag AND/OR; no named hierarchy | PARTIAL Less known; REST-first adds friction |
| Qdrant MCP Server | YES local Qdrant no API key | YES Official Qdrant MCP | YES FastEmbed all-MiniLM-L6-v2 | YES Qdrant on disk | PARTIAL Collection-level only; no sub-hierarchy | YES Official Qdrant project |

---

## Per-Tool Detail

### 1. MemPalace

What it is: Open-source Python AI memory system inspired by the method-of-loci technique. Stores verbatim conversation content (no summarization) and retrieves by semantic search.

Tech stack: Python 3.9+, ChromaDB (vector store), SQLite (temporal knowledge graph), sentence-transformers (embedding-gemma-300m recommended or all-MiniLM-L6-v2). CPU-only. No Docker required.

Local credentials: Zero API keys. Fully offline after pip install. ~300 MB disk for model weights.

MCP integration: 29 MCP tools covering palace reads/writes, knowledge graph ops, cross-wing navigation, drawer management, agent diaries. Supports Claude Code, Claude Desktop, ChatGPT, Cursor, Windsurf.

Filtering: Hierarchical -- wings (projects/people) > halls > rooms (topics) > drawers (verbatim content). Searches scoped by --wing and --room. Granularity is comparable to Logos domain/project/scope hierarchy.

Author note: "Mila Jovovich" as supposed author is incorrect -- she is an actress. Real maintainers are the MemPalace GitHub organization; no individual author is prominently named. The user's source for that name is a garbled reference.

Benchmark claim: 96.6% R@5 on LongMemEval with zero API calls. Not independently verified; treat as marketing claim.

Last updated: v3.3.5, May 10, 2026. Active. 1,124 commits.

Sources: https://github.com/MemPalace/mempalace | https://www.mempalace.tech/guides/setup

---

### 2. Basic Memory

What it is: Knowledge management system storing memories as human-readable Markdown files. Builds a semantic graph from AI conversations; both human and AI can read/write the same files.

Tech stack: Python, FastEmbed (local embeddings), SQLite or Postgres. Markdown is the canonical format -- vector index is derived.

Local credentials: Fully local by default. No API keys. Cloud sync is optional and off by default.

MCP integration: MCP-native. Configured via uvx or pip. Works with Claude Code and Claude Desktop.

Search quality: Hybrid -- full-text search + FastEmbed vector ranking. Not pure semantic. For queries where exact terms are absent from stored text, recall is weaker than a pure embedding system.

Filtering: Project-level isolation (separate projects = separate instances). No domain/scope sub-hierarchy within a project. Coarser than Logos.

Obsidian fit: Strong. Plain Markdown files are directly compatible with the user's existing Obsidian workflow.

Last updated: v0.21.5, May 26, 2026. Active. 1,345 commits.

Sources: https://github.com/basicmachines-co/basic-memory

---

### 3. mem0 OpenMemory

What it is: mem0's self-hosted MCP memory server. Docker Compose stack running API server, Qdrant vector database, and MCP server.

Tech stack: Docker-based; Qdrant for vectors; Postgres for structured data; configurable LLM and embedding provider.

Local credentials: CRITICAL CAVEAT -- out of the box, requires OPENAI_API_KEY. Fully local operation requires manually configuring Ollama as both LLM and embedder, setting a dummy OpenAI key, and editing provider config. This is documented only in GitHub Discussion #2811, not the official quickstart. It works but is not the default path.

Embedding dimensions caveat: Local models with dimensions different from OpenAI default (1536) require manual Qdrant collection config adjustments -- not UI-handled.

MCP integration: MCP server included in Docker stack. Tools: add, search, list, delete memories.

Filtering: No documented project/scope filtering. Memory scoped per connected client; no domain or project hierarchy found.

Setup burden: Docker Compose + manual config edits to go fully local. Heavier than MemPalace or Basic Memory.

Sources: https://mem0.ai/blog/introducing-openmemory-mcp | https://github.com/mem0ai/mem0/discussions/2811

---

### 4. mcp-memory-service (doobidoo)

What it is: Open-source persistent memory for multi-agent pipelines (LangGraph, CrewAI, AutoGen) and Claude. REST API + MCP server. Includes autonomous memory consolidation.

Tech stack: Python, ONNX MiniLM-L6-v2 (no API calls), SQLite or Milvus.

Local credentials: Fully local. ONNX inference; no external services.

MCP integration: MCP server included. Primary interface is REST -- adds indirection vs. pure stdio tools.

Filtering: Agent-ID scoping (HTTP header) + tag-based AND/OR filtering. No named project/domain hierarchy.

Fit note: Designed for multi-agent orchestration. REST-first architecture is a less natural fit for personal single-user Claude Code use.

Sources: https://github.com/doobidoo/mcp-memory-service

---

### 5. Qdrant Official MCP Server

What it is: Official MCP server by Qdrant. A thin wrapper exposing Qdrant vector search and storage to any MCP client.

Tech stack: Python, FastEmbed (all-MiniLM-L6-v2 default; other FastEmbed models via env var), Qdrant.

Local credentials: No API keys needed with a local Qdrant instance. Fully local.

MCP integration: Official, maintained by Qdrant. Configured via uvx mcp-server-qdrant with env vars.

Filtering: Collection-level scoping only. No sub-collection hierarchy. Replicating Logos domain/project/scope requires separate collections managed manually.

Assessment: This is Qdrant + a generic MCP wrapper. It lacks the application-layer filtering and memory management that Logos provides. It is a building block, not a drop-in replacement.

Sources: https://github.com/qdrant/mcp-server-qdrant

---

## Summary: How Each Stacks Up Against Logos

Logos priorities: fully local + CPU-only, MCP stdio, BGE-M3 embeddings, domain/project/scope payload-filtered hierarchy, Qdrant storage, single docker compose up.

| Tool | Key match | Key gap vs. Logos |
|---|---|---|
| MemPalace | Best overall. Local, no API keys, real hierarchical scoping, active, no Docker | Weaker embeddings (all-MiniLM vs. BGE-M3); no sparse vectors; ChromaDB not Qdrant |
| Basic Memory | Best for Markdown/Obsidian integration; local; active | Hybrid not pure-semantic; project-level filtering only; not vector-first |
| mem0 OpenMemory | Closest infrastructure match (also uses Qdrant) | Defaults to OpenAI; local config is a workaround; no domain/project scoping; Docker-heavy |
| mcp-memory-service | Fully local; solid ONNX embeddings | Flat tag filtering; REST-first friction; multi-agent framing mismatch |
| Qdrant MCP server | Same storage engine as Logos | Collection-level scoping only; no memory management logic |

Bottom line: MemPalace is the strongest ready-made alternative across the six criteria. Fully local, MCP-native, real semantic search, persists, hierarchical filtering, actively maintained as of May 2026. Main trade-off vs. Logos: embedding quality. all-MiniLM-L6-v2 at 384 dimensions is materially weaker than BGE-M3 dense+sparse hybrid for technical jargon, code queries, and multilingual content. If embedding quality at the margin is not critical, MemPalace could replace Logos with significantly less infrastructure.

Basic Memory is worth considering if Markdown portability and Obsidian integration are priorities, but its retrieval is hybrid rather than vector-first.

Logos's architecture is not redundant. BGE-M3 + Qdrant + payload-indexed domain/project/scope filtering is better than any off-the-shelf option on retrieval quality and filtering precision. The question is whether MemPalace's simpler setup and good-enough retrieval is worth the embedding quality regression.
