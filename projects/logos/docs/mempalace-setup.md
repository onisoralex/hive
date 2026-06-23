# MemPalace Setup

Local AI memory system for Claude Code. No API keys, no Docker, no internet after install.

**Stack:** MemPalace 3.3.5 · ChromaDB · ONNX (all-MiniLM-L6-v2 embeddings) · SQLite knowledge graph · stdio MCP

---

## 1. Prerequisites

- Python 3.9 or later (tested on 3.14.3)
- pip (comes with Python)
- Claude Code installed

Verify:

```powershell
python --version
pip --version
```

---

## 2. Installation

```powershell
pip install mempalace
```

This installs MemPalace and all dependencies (ChromaDB, ONNX Runtime, tokenizers, etc.). Total download is roughly 50–60 MB; first run downloads the embedding model weights (~90 MB) on demand.

Verify the install:

```powershell
pip show mempalace
```

Expected output includes `Version: 3.3.5` and `Requires: chromadb, pyyaml`.

---

## 3. First-Time Initialization

MemPalace has no mandatory initialization step. The palace directory and ChromaDB collection are created automatically when the MCP server starts and first receives a write request.

The palace lives at `~/.mempalace/palace` by default, which expands to:

```
C:\Users\<username>\.mempalace\palace
```

If you want to create an explicit config file (optional — useful if you want to customize the palace path or topic wings), run:

```python
python -c "from mempalace.config import MempalaceConfig; MempalaceConfig().init(); print('Config written')"
```

This creates `~/.mempalace/config.json` with defaults. You can edit it to change `palace_path` or `topic_wings`.

The `mempalace init <dir>` command is for a different purpose — it scans a project directory and detects entities (people, projects) to build wing/room metadata. It requires interactive input and is not required for basic operation.

---

## 4. Starting the MCP Server

The MCP server is not started manually. Claude Code spawns it automatically using the configured command. If you want to test it in isolation:

```powershell
& "C:\Users\aonisor\AppData\Local\Python\pythoncore-3.14-64\Scripts\mempalace-mcp.exe"
```

It will print `MemPalace MCP Server starting...` and then wait for JSON-RPC input on stdin. Press Ctrl+C to stop. This is the correct behavior for a stdio server.

To find where pip installed the scripts on your machine:

```powershell
python -c "import sysconfig; print(sysconfig.get_path('scripts'))"
```

---

## 5. Claude Code Configuration

MCP servers for Claude Code are stored in `~\.claude.json` (the user-level file at `C:\Users\<username>\.claude.json`), not in `settings.json`.

### Adding via CLI (recommended)

Run this once from any terminal:

```powershell
claude mcp add --scope user mempalace "C:\Users\aonisor\AppData\Local\Python\pythoncore-3.14-64\Scripts\mempalace-mcp.exe"
```

Replace `aonisor` with your Windows username and adjust the Python path if your Python is installed elsewhere (see Section 4 for how to find the scripts path).

Verify it was added and is reachable:

```powershell
claude mcp list
```

Expected output:

```
mempalace: C:\Users\aonisor\AppData\Local\Python\...\mempalace-mcp.exe  - ✓ Connected
```

### What the CLI writes

For reference, the entry in `~\.claude.json` looks like this:

```json
{
  "mcpServers": {
    "mempalace": {
      "type": "stdio",
      "command": "C:\\Users\\aonisor\\AppData\\Local\\Python\\pythoncore-3.14-64\\Scripts\\mempalace-mcp.exe",
      "args": [],
      "env": {}
    }
  }
}
```

Do not add `mcpServers` to `~\.claude\settings.json` — that file has a strict schema that rejects unknown fields.

### Custom palace path (optional)

If you want memories stored somewhere other than the default (`~/.mempalace/palace`), pass `--palace`:

```powershell
claude mcp remove mempalace
claude mcp add --scope user mempalace "C:\Users\aonisor\AppData\Local\Python\pythoncore-3.14-64\Scripts\mempalace-mcp.exe" -- --palace "D:\my-palace"
```

---

## 6. Memory Hierarchy

MemPalace organizes memories as **wing > room > drawer**.

- **Wing** — a project, person, or major topic. Analogous to a separate notebook.
- **Room** — an aspect or sub-topic within a wing (decisions, architecture, bugs, recipes, etc.).
- **Drawer** — a single piece of verbatim content, stored with a vector embedding. The atomic unit of memory.

### Default wings for this setup

| Wing | What goes here |
|---|---|
| `coding` | General programming notes not tied to a specific project |
| `hive` | Hive multi-agent system decisions, architecture, session notes |
| `coffee_shop` | Coffee Shop project (use the project name as wing when project-specific) |
| `dnd` | D&D campaigns — NPCs, lore, session notes, world-building |
| `electronics` | Circuit designs, component notes, project builds |
| `cooking` | Recipes, techniques, ingredient notes |
| `hobbies` | Calisthenics, Wing Chun, photography, Blender — anything that doesn't fit above |

Wing names are slugified (lowercase, spaces and hyphens become underscores). Create a wing by filing a drawer into it — no pre-registration needed.

### Room conventions

Rooms are free-form. Suggested starting rooms per wing:

- **coding / hive / project wings:** `decisions`, `architecture`, `bugs`, `notes`
- **dnd:** `npcs`, `lore`, `sessions`, `world`
- **electronics:** `components`, `schematics`, `builds`
- **cooking:** `recipes`, `techniques`
- **hobbies:** one room per activity (`calisthenics`, `wing_chun`, `photography`, `blender`)

You are not locked into these. Add rooms as you need them.

---

## 7. Usage

The MCP tools are available in Claude Code once the server is connected. The tools Claude Code calls are prefixed with `mempalace_`. You can also ask Claude Code directly in natural language — it will call the appropriate tools.

### Save a memory

```
mempalace_add_drawer
  wing: "hive"
  room: "decisions"
  content: "Decided to use MemPalace over a custom Qdrant stack. Lower maintenance, pip install, good enough retrieval for personal use."
```

Content is stored verbatim. Do not summarize — store the actual text you want to retrieve later.

### Search

```
mempalace_search
  query: "MemPalace vs Qdrant decision"
  wing: "hive"       (optional — omit to search all wings)
  room: "decisions"  (optional — omit to search all rooms in the wing)
  limit: 5
```

Results include the verbatim content and a cosine distance score. Lower distance = closer match.

### Check what's stored

```
mempalace_status          — total drawer count, wing/room breakdown
mempalace_list_wings      — all wings with drawer counts
mempalace_list_rooms      — rooms within a specific wing
mempalace_get_taxonomy    — full wing → room → count tree
```

### Retrieve a specific drawer

```
mempalace_get_drawer
  drawer_id: "<id from search results>"
```

### Delete a drawer

```
mempalace_delete_drawer
  drawer_id: "<id>"
```

### Before filing — check for duplicates

```
mempalace_check_duplicate
  content: "..."
```

Returns a similarity score. If it's above ~0.9, the content is already there.

---

## 8. Data Location and Backup

### Where data lives

| File/directory | What's in it |
|---|---|
| `~\.mempalace\palace\` | ChromaDB vector store (embeddings + content) |
| `~\.mempalace\palace\chroma.sqlite3` | ChromaDB metadata and the collection |
| `~\.mempalace\palace\<uuid>\` | HNSW index segments for fast vector search |
| `~\.mempalace\config.json` | MemPalace config (palace path, topic wings, etc.) |

The knowledge graph (for `mempalace_kg_*` tools) lives inside the same palace directory.

On Windows:

```
C:\Users\aonisor\.mempalace\palace\
```

### Backup

Copy the entire `~\.mempalace\` folder. Everything needed to restore is in there.

```powershell
# Example: copy to an external drive
robocopy "$env:USERPROFILE\.mempalace" "D:\backups\mempalace" /MIR /XA:H
```

### Moving to another machine

1. Install MemPalace on the new machine (Section 2).
2. Copy `~\.mempalace\` from the old machine to the same path on the new machine.
3. Add the MCP server to Claude Code (Section 5).

If the Python Scripts path is different on the new machine, adjust the `command` in `~\.claude.json` accordingly. The palace data itself is portable and path-independent (unless you set a custom `--palace` path).

---

## 9. Reinstall Checklist

For a fresh Windows machine:

- [ ] Install Python 3.9+ from python.org (check "Add to PATH" during install)
- [ ] `pip install mempalace`
- [ ] Find the scripts path: `python -c "import sysconfig; print(sysconfig.get_path('scripts'))"`
- [ ] Add MCP server: `claude mcp add --scope user mempalace "<scripts-path>\mempalace-mcp.exe"`
- [ ] Verify: `claude mcp list` — expect `✓ Connected`
- [ ] If migrating: copy `~\.mempalace\` from old machine before first use
- [ ] Optional: copy `~\.claude.json` `mcpServers` section if migrating full config
