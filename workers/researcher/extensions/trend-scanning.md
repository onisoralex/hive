# Researcher Extension: Trend Scanning & Idea Scoring

This extension is included when the task involves scanning for market opportunities and scoring product ideas. It supplements the base Researcher instructions.

---

## Sources to Scan

Search these sources systematically. Not all are needed for every scan — the task description will indicate scope.

| Source | What to look for |
|---|---|
| Reddit (`r/SideProject`, `r/entrepreneur`, `r/smallbusiness`, `r/androidapps`, `r/nocode`, `r/<niche>`) | Recurring complaints, "is there a tool for X" posts, "I wish X existed" threads |
| Hacker News | "Ask HN: Is there a tool for..." posts, comments on Show HN tools describing missing features |
| Product Hunt | Low-rated tools in a category (gap in execution), comments requesting features that don't exist |
| Google Trends | Validate that search interest for an identified problem is stable or growing |
| App Store reviews (1–3 stars) | Unmet needs in existing tools; "why doesn't it do X" complaints |
| Stack Overflow / GitHub Issues | Technical problems people solve manually that a tool could automate |

---

## Scoring Criteria

Score each candidate idea on five dimensions, 1–5 each:

| Dimension | Score 1 | Score 5 |
|---|---|---|
| **Search demand** | No evidence people look for this | Clear high-volume, growing search intent |
| **Competition** | Dominated by well-funded incumbents | Niche is unserved or only served poorly |
| **Build complexity** | Requires novel ML, real-time infra, or large content corpus | CRUD app, API integration, templated UI, offline tool |
| **Monetization fit** | Hard to charge; ad revenue only viable at scale | Obvious willingness to pay, natural recurring utility |
| **Autonomy** | Requires ongoing human moderation, support, or content creation | Runs with no human intervention once deployed |

**Total score:** `/25`. Flag anything scoring ≥ 18 as a strong candidate.

**Bonus signal:** Score +1 if the problem area aligns with Alex's existing experience (software testing, tools, utilities) — authenticity has marketing value.

---

## What NOT to Recommend

Reject any idea that requires:
- Social features or user-generated content (moderation burden)
- Trust-sensitive domains (health diagnosis, legal advice, financial advice as primary product)
- Real-time multiplayer
- Large proprietary datasets you don't have
- Enterprise sales cycles
- iOS-only (no Apple hardware available)

---

## Output Format

Produce a `report.md` with these sections:

### 1. Scan Summary
- Sources checked
- Search terms / subreddits / app categories searched
- Total candidates considered before filtering

### 2. Scored Ideas

One block per candidate that made it past the initial filter:

```
### [Idea name]
**Problem:** one sentence describing the pain point
**Evidence:** where the demand signal was found (link or quoted snippet)
**Proposed product:** what it does in one sentence
**Target user:** who would use this and why
**Scores:** demand=X, competition=X, complexity=X, monetization=X, autonomy=X | **Total: X/25**
**Revenue model:** ads / one-time purchase / credits / subscription
**Estimated build effort:** low (<1 week) / medium (1–4 weeks) / high (>4 weeks)
**Platform:** web / Android / both
**Risks:** one or two sentences on the main risk
```

### 3. Top Recommendations

Rank the top 3 ideas with a brief rationale for each. If fewer than 3 scored ≥ 18, note that explicitly — do not inflate weaker ideas to fill three slots.

### 4. Sources
List all URLs and sources consulted.
