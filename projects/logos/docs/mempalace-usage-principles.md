# MemPalace Usage Principles

When to use MemPalace, what belongs where, and what it is not for.

---

## The three-layer context system

| Layer | What goes here | When Claude sees it |
|---|---|---|
| **Global CLAUDE.md** | Behavioral rules, always-on preferences, coding style | Every session, automatically |
| **Project CLAUDE.md / Hive files** | Project conventions, decisions, architecture, state | Every session for that project, automatically |
| **MemPalace** | Accumulated knowledge too voluminous, informal, or cross-cutting for structured files | Only when Claude actively searches it |

The key difference between CLAUDE.md and MemPalace: **CLAUDE.md is always loaded; MemPalace only contributes if searched.** Design around that.

---

## What belongs in each layer

**Global CLAUDE.md** — behavioral rules and compact, always-relevant preferences:
- Communication style ("be direct", "explain the why")
- Coding style (quotes, function style, CSS conventions)
- Units, formatting, and other universal preferences

**Project CLAUDE.md / Hive files** — anything specific to a project that is always relevant when working on it:
- Architecture decisions and their rationale (`decisions.md`)
- Active state and task tracking (`state.md`)
- Project conventions that differ from global defaults

**MemPalace** — knowledge that accumulates over time and benefits from fuzzy retrieval:
- Lessons from past debugging sessions
- Cross-project patterns noticed only after several projects
- Domain knowledge built up gradually through sessions
- Informal notes too lightweight for Hive files but worth remembering

---

## The upfront vs. accumulated distinction

This is the clearest rule for deciding where something belongs:

- **Can you write it upfront?** → CLAUDE.md
- **Does it accumulate over time through sessions?** → MemPalace

Coding preferences are known upfront — they belong in CLAUDE.md regardless of how topic-specific they are. MemPalace is not a more granular CLAUDE.md; it is a different kind of thing.

---

## The trigger problem

A natural idea is: "put a rule in CLAUDE.md to search MemPalace when certain topics come up." This works in principle but creates coordination overhead — you must maintain a topic list in CLAUDE.md and keep it in sync with what is actually in MemPalace. The list goes stale. Avoid designing around this unless the value is clear and the topic list is stable.

Better approach: let Claude search MemPalace on explicit request ("check your memory for anything relevant to X") or when starting a session on a domain you know has accumulated context.

---

## When MemPalace earns its place

MemPalace adds real value when:
- You want to ask "what do I know about X?" without knowing which file to look in
- The volume of accumulated knowledge exceeds what fits in context or structured files
- Retrieval needs to be fuzzy — you don't remember the exact words used

It adds little value when:
- Knowledge is compact and can be written directly into CLAUDE.md
- The project already has well-kept Hive files that Claude can navigate
- Content is structured (e.g. DnD NPC files) — structured files are more navigable than drawers for this

---

## Feeding MemPalace

Nothing is saved automatically. Two ways to populate it:

- **On demand:** ask Claude explicitly ("save this decision to memory", "remember that X approach caused Y problem")
- **Standing instruction:** add a rule to a CLAUDE.md file (e.g. "at the end of sessions where a notable cross-project lesson was learned, save it to the `coding/lessons` room")

Treat it as a passive accumulator rather than something you architect upfront. Let it fill organically and evaluate whether retrieval proves useful over time.

---

## RAG / document ingestion

MemPalace is not a RAG pipeline. Do not use it to ingest manuals, documentation, or large static corpora. It has no bulk ingestion tooling, no chunking control, and the drawer model is designed for discrete memories, not document chunks. For document retrieval, use a purpose-built RAG stack (LlamaIndex, LangChain, or Qdrant directly with an ingestion pipeline).
