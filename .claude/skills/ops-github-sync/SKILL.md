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

Updated `.claude/skills/`, `brand_context/`, and `context/SOUL.md` in the current workspace.
Also updates the Cowork plugin at `cowork-kit/` if it exists locally.
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

The sync pulls only the `cowork-kit/` folder from the company repo. The cowork-kit
is a Cowork plugin (skills at `skills/`, manifest at `.claude-plugin/plugin.json`).

Mapping:
- `cowork-kit/skills/` → local `.claude/skills/` (for Code mode)
- `cowork-kit/brand_context/` → local `brand_context/`
- `cowork-kit/context/SOUL.md` → local `context/SOUL.md`
- `cowork-kit/` (entire plugin) → local `cowork-kit/` (for Cowork mode, if it exists)

**Never pull or overwrite:**
- `context/USER.md`
- `context/memory/`
- Any `.claude/skills/personal-*/` directories

## Step 2: Pull and Apply

Run via Bash:

```bash
# Fetch just the cowork-kit/ subtree from the company repo
COMPANY_REPO="<URL from Before You Start>"
TEMP_DIR=$(mktemp -d)

git clone --depth 1 --filter=blob:none --sparse "$COMPANY_REPO" "$TEMP_DIR"
cd "$TEMP_DIR"
git sparse-checkout set cowork-kit/

# Copy plugin skills/ into .claude/skills/ for Code mode (skip personal-*)
mkdir -p ".claude/skills"
rsync -av --delete \
  --exclude='personal-*' \
  "${TEMP_DIR}/cowork-kit/skills/" \
  "./.claude/skills/"

# Update the local cowork-kit plugin if it exists (for Cowork mode)
if [[ -d "./cowork-kit" ]]; then
  rsync -av --delete \
    --exclude='context/USER.md' \
    --exclude='context/memory/' \
    "${TEMP_DIR}/cowork-kit/" \
    "./cowork-kit/"
fi

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
