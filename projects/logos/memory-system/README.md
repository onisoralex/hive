# Logos Memory System

A self-hosted, local-first personal memory system for Claude Code. Runs entirely on your machine — no external API calls, no cloud dependencies.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Qdrant and the embedding service)
- [Node.js](https://nodejs.org/) v18 or later (for the MCP server)
- npm (included with Node.js)

---

## First-time setup

Run these commands in order from inside the `memory-system/` directory:

### 1. Copy the environment file

```bash
cp .env.example .env
```

The defaults work as-is for local use. Edit `.env` only if you need to change ports.

### 2. Start the Docker services

```bash
docker compose up -d
```

This starts Qdrant (vector database) and the BGE-M3 embedding service. The first startup will download the BGE-M3 model (~2 GB) into `./data/models/`. This only happens once — subsequent starts are fast.

### 3. Install MCP server dependencies

```bash
cd mcp-server
npm install
```

### 4. Register the MCP server with Claude Code

Add the following to your `.claude/settings.json` (create the file if it doesn't exist):

```json
{
  "mcpServers": {
    "logos-memory": {
      "command": "node",
      "args": ["C:/hive/projects/logos/memory-system/mcp-server/index.js"],
      "env": {
        "QDRANT_HOST": "localhost",
        "QDRANT_PORT": "6333",
        "EMBEDDING_HOST": "localhost",
        "EMBEDDING_PORT": "8000",
        "MEMORY_COLLECTION": "personal_memory",
        "SCORE_THRESHOLD": "0.72",
        "DEFAULT_LIMIT": "10"
      }
    }
  }
}
```

Replace the path in `args` with the actual absolute path to `mcp-server/index.js` on your machine.

### 5. Restart Claude Code

The MCP server connects via stdio when Claude Code starts. Restart Claude Code after updating `settings.json`.

---

## Verifying everything is running

**Check Docker services:**
```bash
docker compose ps
```
Both `logos-qdrant` and `logos-embedding` should show as `running`.

**Check Qdrant:**
```bash
curl http://localhost:6333/collections
```
Should return a JSON response with a `collections` array.

**Check embedding service:**
```bash
curl -X POST http://localhost:8000/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "test"}'
```
Should return a JSON object with `dense` (array of 1024 floats) and `sparse` (dict).

**Check MCP server (in Claude Code):**
After restarting Claude Code, open a new conversation and ask Claude to call `list_projects(domain="code")`. If it returns a result (even an empty one), the MCP server is connected.

---

## Backing up your memories

All memory data is stored in `./data/qdrant/`. To back up:

```bash
cp -r ./data/qdrant /path/to/your/backup/location
```

That's it. No database export needed — Qdrant stores data as plain files on disk.

---

## Using on a second device

1. Clone or copy the `memory-system/` directory to the second device.
2. Copy your `./data/` directory to the same location on the second device.
3. Follow the first-time setup steps from step 2 onward (skip step 1 if you already have a `.env`).
4. The MCP server path in `.claude/settings.json` will need to reflect the path on the new device.

---

## How it works

- **Qdrant** stores memories as vector points with metadata (domain, project, category, scope, tags).
- **BGE-M3** converts text to dense + sparse vectors, enabling hybrid semantic search.
- **The MCP server** bridges Claude Code to Qdrant and the embedding service via five tools: `save_memory`, `search_memory`, `get_rules`, `delete_memory`, and `list_projects`.
- The MCP server runs as a local process (not in Docker) and communicates with Claude Code over stdio.

See `MEMORY_PROTOCOL.md` for when and how to use each tool.
