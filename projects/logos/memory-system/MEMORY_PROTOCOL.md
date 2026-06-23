# Memory Protocol

This document defines how Claude Code should interact with the Logos memory system across all tasks and domains.

---

## Tool call order at the start of every task

1. **`get_rules`** — always first. Fetch all rules applicable to the current domain and project. Rules are absolute constraints; they must be loaded before any work begins, not after.
2. **`search_memory`** — second. Retrieve relevant context, prior decisions, and notes. Use the task description or user's request as the query.

Never skip either step. Rules that are not loaded at the start of a task may be violated inadvertently.

---

## When to call `save_memory`

Call `save_memory` at the **end of every task**, before responding to the user. Save:
- Any decision made during the task (`category: "decision"`)
- Any constraint discovered or confirmed (`category: "rule"`)
- Any significant context that would be useful in a future session (`category: "context"`)
- Any reasoning behind a non-obvious choice (`category: "reasoning"`)

Do not save trivial steps, file contents, or information that is already captured in the codebase itself. Save the *why*, not the *what*.

---

## Detecting domain and scope automatically

### Domain
Infer from the active project or conversation context:

| Signal | Domain |
|---|---|
| Code files, git repos, terminals | `code` |
| Campaign notes, session prep, character sheets | `dnd` |
| Schematics, components, breadboards | `electronics` |
| Recipes, meal planning, ingredients | `cooking` |
| People, relationships, social context | `friends` |
| Personal goals, habits, finances | `life` |

When ambiguous, ask the user once and save their answer as a `rule` with `scope: "global"`.

### Scope
Infer from the specific file type or technology in use:

| Context | Scope |
|---|---|
| `.js`, `.ts`, `.jsx` files | `javascript` |
| `.java` files | `java` |
| `.py` files | `python` |
| `.go` files | `go` |
| Campaign world-building | `world-building` |
| NPC or faction details | `npcs` |
| Rules-as-written | `rules` |

Use `"global"` as scope for rules that apply across all scopes in a domain/project.

---

## Category usage guide

| Category | Use for | Example |
|---|---|---|
| `rule` | Non-negotiable constraints, conventions, or preferences | "Always use double quotes in TypeScript" |
| `decision` | A choice made during a task, with the alternatives considered | "Chose Prisma over raw SQL — rationale: type safety and migration tooling" |
| `context` | Background that is necessary to understand future tasks | "The auth system uses JWT stored in httpOnly cookies, not localStorage" |
| `reasoning` | Why something non-obvious was done the way it was | "Used polling instead of WebSockets because the hosting environment doesn't support long-lived connections" |
| `note` | General observations that don't fit the above | "The client prefers minimal UI changes in sprint 3" |
| `task` | An outstanding or completed task logged for continuity | "TODO: migrate legacy user table to new schema after v2 launch" |

---

## Score threshold guidance

The default threshold is **0.72**. This is intentionally conservative to avoid noisy results.

- **Lower the threshold (e.g. 0.6)** when you need broader recall — for example, when exploring what has been done before in a domain with sparse memory.
- **Raise the threshold (e.g. 0.85)** when you need high-precision results and know there should be a close match.
- **Do not lower below 0.5** — results below that score are rarely semantically related.

Pass `score_threshold` explicitly to `search_memory` when you need to override the default.

---

## Example: Coding task sequence

**Scenario:** User asks to add a new API endpoint to the `oikos` project (domain: `code`).

```
1. get_rules(domain="code", project="oikos", scope="javascript")
   → Loads all rules for this project; scope also pulls in "global" rules

2. search_memory(domain="code", project="oikos", query="API endpoint structure and patterns")
   → Retrieves prior decisions about routing conventions, auth middleware, response format

3. ... implement the endpoint ...

4. save_memory(
     domain="code",
     project="oikos",
     category="decision",
     scope="javascript",
     content="New /api/households endpoint uses PATCH for partial updates, not PUT — decided because existing endpoints follow PATCH convention and the client sends partial payloads",
     tags=["api", "rest", "households"]
   )
```

---

## Example: DnD session prep sequence

**Scenario:** User asks to prep the next session for the `thornwall` campaign (domain: `dnd`).

```
1. get_rules(domain="dnd", project="thornwall")
   → Loads campaign rules, session conventions, player agreements

2. search_memory(domain="dnd", project="thornwall", query="last session events and player choices")
   → Retrieves prior session notes and unresolved plot threads

3. ... prepare session content ...

4. save_memory(
     domain="dnd",
     project="thornwall",
     category="context",
     scope="world-building",
     content="The players allied with the Ashen Hand in session 7. They do not yet know the Hand is working against the Thornwall Council.",
     tags=["faction", "ashen-hand", "session-7"]
   )

5. save_memory(
     domain="dnd",
     project="thornwall",
     category="note",
     content="Session 8 prep complete. Key scene: confrontation at the docks. Fallback: NPC Eryn can redirect if players go off-script.",
     tags=["session-8", "prep"]
   )
```
