# Developer Extension: N8N

This extension is included when a task involves N8N workflow automation. It supplements the base Developer instructions.

---

## When N8N Is Used

N8N is used for:
- Integration pipelines between external services (Stripe → database, GitHub → Slack, etc.)
- Scheduled automation jobs (weekly reports, data sync, analytics pulls)
- Webhook handling from third-party services
- Cross-service data flows where writing custom code would be mostly boilerplate
- Monitoring and alerting pipelines

N8N is **not** used for:
- Core product business logic — that belongs in application code
- Real-time request/response paths — N8N latency is too high
- Tasks requiring complex conditional logic better expressed in TypeScript
- Any path that users are directly waiting on

---

## Environment

- N8N runs as a Docker service. Add it to the project's `docker-compose.yml`:

```yaml
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
    volumes:
      - n8n_data:/home/node/.n8n
volumes:
  n8n_data:
```

- Accessible at `http://localhost:5678` during development.
- All credentials are configured in N8N's credential manager — never hardcoded in workflow nodes.

---

## Workflow Conventions

- **Naming:** `[project] - [trigger] → [action]`. Example: `oikos - stripe.payment → update-subscription`
- Every workflow must have a manual trigger node in addition to its live trigger. This enables testing without waiting for a real event.
- Webhook paths follow the pattern: `/webhook/<project-slug>/<event-name>`. Example: `/webhook/oikos/stripe-payment`
- All secrets (API keys, tokens) are referenced via N8N's expression syntax from credentials or environment variables, never pasted literally into nodes.

---

## Exporting & Committing Workflows

Workflows are infrastructure. Export and commit them:

1. Export from N8N: Workflow → Download (saves as JSON)
2. Save to `n8n/workflows/<workflow-name>.json` in the project repository
3. Write a `n8n/README.md` documenting each workflow:

```markdown
## Workflow: [name]
**File:** `workflows/workflow-name.json`
**Trigger:** [webhook / schedule / manual]
**What it does:** [one sentence]
**Dependencies:** [external services, credentials needed]
**Notes:** [anything a developer needs to know to re-import and run it]
```

---

## Deliverables

Every N8N task produces:
- Exported workflow JSON files in `n8n/workflows/`
- Updated `n8n/README.md`
- Any environment variable additions documented in the project's `docs/architecture.md`
