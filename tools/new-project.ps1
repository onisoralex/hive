# new-project.ps1
# Creates a new project under projects/<name>/
# Usage: .\new-project.ps1 -Name <project-name>

param(
    [Parameter(Mandatory)][string]$Name
)

if ($Name -notmatch '^[a-z0-9][a-z0-9-]*$') {
    Write-Error "Project name must be lowercase alphanumeric with hyphens (e.g. 'my-startup')"
    exit 1
}

$root    = Split-Path $PSScriptRoot -Parent
$project = Join-Path $root "projects\$Name"

if (Test-Path $project) {
    Write-Error "Project '$Name' already exists at projects/$Name"
    exit 1
}

$workers = @('researcher','developer','tech-specialist','finance-specialist','marketer','writer','data-analyst')

New-Item -ItemType Directory -Path "$project\mind"    -Force | Out-Null
New-Item -ItemType Directory -Path "$project\archive" -Force | Out-Null

foreach ($w in $workers) {
    New-Item -ItemType Directory -Path "$project\workspace\$w" -Force | Out-Null
    New-Item -ItemType File      -Path "$project\workspace\$w\.gitkeep" -Force | Out-Null
}

Set-Content "$project\project.md" -Encoding UTF8 -Value @'
# Project Brief

The Mind reads this file at the start of every session. Fill in the sections relevant to your project. Leave blank what does not apply — do not invent details.

---

## What we're building
<!-- Describe the product, service, initiative, or goal -->

## Target audience
<!-- Who is this for? Be specific — role, context, needs -->

## Tech stack
<!-- Languages, frameworks, platforms, existing infrastructure -->

## Key constraints
<!-- Budget, timeline, non-negotiables, known limitations -->

## Decisions already made
<!-- Anything locked in that workers should not re-open -->

## Background context
<!-- Links to prior research, relevant artifacts, or external references -->
'@

Set-Content "$project\mind\state.md" -Encoding UTF8 -Value @'
# Hive State

## Active

_No active tasks._

## Done

_No completed tasks._

## Blocked

_No blocked tasks._
'@

Set-Content "$project\mind\decisions.md" -Encoding UTF8 -Value @'
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
'@

New-Item -ItemType File -Path "$project\mind\log.jsonl" -Force | Out-Null

Write-Host "Created projects/$Name"
Write-Host "Next: fill in projects/$Name/project.md"
