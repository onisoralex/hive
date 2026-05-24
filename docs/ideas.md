# Product Ideas Backlog

Sourced from research into the AI-assisted micro-venture studio concept. All ideas are **unvalidated** unless marked otherwise. Status progresses to a project once an idea is selected and scoped.

Last updated: 2026-05-23

---

## Mobile Apps (Android-first)

### M-001 — Niche Offline Calculator / Trades Tool
Offline calculator for a specific trade: construction, tiling, flooring, paint. Computes material quantities, area, cost estimates. No server cost ever. AdMob banner + rewarded ad for project-save feature.
- Revenue model: AdMob ads
- Effort: Low
- Source: Conversation 1 & 2

### M-002 — Shop Offers Aggregator + Shopping List Manager
Aggregates current promotions/offers from supermarkets and stores. User searches for a product and sees which store has it cheapest (e.g., "chicken breast is cheapest at Billa this week"). Built as an API so it integrates with Oikos pantry/shopping features — the Oikos project calls the same endpoint to optimize shopping lists. Consumer-facing: standalone Android app. API: integration layer for Oikos.
- Revenue model: AdMob or freemium (basic free, premium store coverage)
- Effort: Medium (scraping or partnership with stores is the hard part)
- Integration: Oikos pantry endpoint
- Source: Alex (this conversation)

### M-003 — Personal Tool (TBD)
Alex has at least one personal utility need identified. To be specified before scoping.
- Status: Needs definition

### M-004 — Church Community Toolkit
Gather from the community what practical tools would simplify daily life. Likely multiple small tools. Evaluate per tool whether to ship individually or combine into a "community toolkit" app. Ad-monetized.
- Revenue model: AdMob
- Next step: Community feedback round
- Source: Alex (this conversation)

---

## Web Tools / Micro-SaaS

### W-001 — Hyper-Niche AI Tool (e.g., Resume Tailor)
User pastes a job description and their resume, receives a tailored version. Charge ~€7/month or offer 3 free uses then paywall. Target one specific profession or job type (nurses, engineers, teachers) rather than "everyone."
- Revenue model: Subscription (Stripe)
- Time to first revenue: 1–2 weeks
- Source: Conversation 1

### W-002 — Document Workflow Toolkit
Set of small tools around document handling: PDF extraction, invoice parsing, contract summarization, CSV cleanup, screenshot annotation, QA documentation helpers. Each tool is tiny; shared infrastructure across all.
- Revenue model: Subscription or pay-per-use
- Fits: Alex's software testing background lends authenticity to the QA-adjacent tools
- Source: Conversation 2

### W-003 — SEO Utility Sites
Individual web pages targeting high-search-volume utility queries: invoice generator, regex tester, legal template helper, résumé bullet improver, tax calculators, CSV cleaner, image converter, subtitle tools. Low AI compute, high organic traffic potential.
- Revenue model: Display ads / light subscription for exports
- Effort per tool: Very low (1–2 days each)
- Source: Conversation 2

### W-004 — B2B Micro-Automation SaaS
Appointment reminders, auto-report generation, PDF processing, email parsing, form-to-database workflows, inventory sync, AI summarization for a specific profession. Sticky once integrated into a business workflow.
- Revenue model: Recurring subscription
- Risk: Requires direct outreach to land first customers
- Source: Conversation 2

### W-005 — Marketplace Data Intelligence
Tools for online sellers: Etsy trend tracker, Amazon keyword analyzer, eBay arbitrage finder, used car pricing helpers. Users pay for money-making insights.
- Revenue model: Subscription or one-time purchase
- Source: Conversation 2

### W-006 — AI-Assisted QA / Developer Helpers
QA note generators, bug report formatter, regression checklist assistant, API testing helpers, test case generator. Alex's tester background makes this authentic to build and credible to market to the QA community.
- Revenue model: Subscription or freemium
- Competitive advantage: Built by a tester, for testers
- Source: Conversation 2

### W-007 — Automated Niche Newsletter
Claude generates a weekly digest on a narrow topic (AI tools for a specific profession, local market summaries, etc.). Monetize via Beehiiv's built-in ad network once past ~500 subscribers. Nearly zero maintenance after setup.
- Revenue model: Newsletter ad network
- Effort: Very low (automated after initial setup)
- Source: Conversation 1

### W-008 — Digital Template Store
AI-generated Notion templates, Figma UI kits, or Excel dashboards for a specific niche. Listed on Gumroad. No recurring infrastructure cost.
- Revenue model: One-time purchases
- Effort: Low (generation) + listing
- Source: Conversation 1

---

## Strategic Notes

**Single app vs. multi-function app (ad monetization):**
Single-function apps rank independently in the Play Store for their specific search terms — better organic discovery. Multi-function apps increase retention (users discover related tools) and reduce the user's app management overhead. Recommended approach: launch individual apps first, validate each independently, then combine related winners into a toolkit app with a freemium tier.

**M-002 (Shop Offers Aggregator)** has the highest near-term integration value because of the Oikos connection. Building it as an API from day one rather than retrofitting is important.

**W-006 (QA Helpers)** is the strongest fit for authentic marketing — building a QA tool as someone who actually works in QA is a genuine differentiator in a crowded AI tools market.

**First revenue target:** W-001 or W-003 are the fastest paths to initial revenue (1–2 weeks to launch). M-001 is the most realistic first Android project.
