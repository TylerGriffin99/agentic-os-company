---
name: ops-github-sync
description: >
  Pulls the latest company skills and brand context from the company GitHub repo
  into this Cowork workspace. Use when you want to sync to the latest company
  configuration, when prompted by the daily cron schedule, or after your manager
  announces a skills update. Never overwrites personal files (USER.md, memory/).
  Triggers on: "sync skills", "pull latest", "update company skills",
  "ops-github-sync", or from the daily-sync cron job.
---

# ops-github-sync

Pulls the latest `cowork-kit/` from the company GitHub repo. Updates skills and
brand context. Skips all personal files.

## Outcome

Updated `skills/`, `brand_context/`, and `context/SOUL.md` in the current workspace.
`context/USER.md` and `context/memory/` are never touched.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/SETUP.md` | company field only | Confirm company context |
| `context/learnings.md` | `## ops-github-sync` section | Prior sync learnings |

## Before You Start

Check for the company repo URL. Look in order:
1. `context/SETUP.md` for a `github_repo:` field
2. Run `git remote get-url origin` in the workspace directory

If no URL found, ask: "What is the company GitHub repo URL?
(e.g. https://github.com/acme/agentic-os-company)"

## Step 1: Identify What to Pull

The sync pulls only the `cowork-kit/` folder from the company repo. Specifically:
- `cowork-kit/skills/` → local `skills/`
- `cowork-kit/brand_context/` → local `brand_context/`
- `cowork-kit/context/SOUL.md` → local `context/SOUL.md`

**Never pull or overwrite:**
- `context/USER.md`
- `context/memory/`
- Any `skills/personal-*/` directories

## Step 2: Pull and Apply

Run via Bash:

```bash
# Fetch just the cowork-kit/ subtree from the company repo
COMPANY_REPO="<URL from Before You Start>"
TEMP_DIR=$(mktemp -d)

git clone --depth 1 --filter=blob:none --sparse "$COMPANY_REPO" "$TEMP_DIR"
cd "$TEMP_DIR"
git sparse-checkout set cowork-kit/

# Copy skills (skip personal-*)
rsync -av --delete \
  --exclude='personal-*' \
  "${TEMP_DIR}/cowork-kit/skills/" \
  "./skills/"

# Copy brand_context
rsync -av --delete \
  "${TEMP_DIR}/cowork-kit/brand_context/" \
  "./brand_context/"

# Copy SOUL.md
cp "${TEMP_DIR}/cowork-kit/context/SOUL.md" "./context/SOUL.md"

rm -rf "$TEMP_DIR"
```

## Step 3: Report

Tell the user:
- How many skills were updated or added
- Whether brand_context changed
- That USER.md and memory/ were not touched

Example: "Sync complete — 12 skills updated, brand context refreshed.
Your personal files were not touched."

## Rules
- Never overwrite context/USER.md under any circumstances
- Never delete context/memory/ or its contents
- If the clone fails (network error, auth), report clearly and stop — do not
  partially apply changes
- If rsync is not available, fall back to cp -R with manual excludes

## Self-Update
If a sync step fails in a way not covered here, add the fix to `## Rules`.
