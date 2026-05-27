---
name: ops-m365-sync
description: >
  Syncs content from Microsoft 365 (SharePoint, OneDrive, Outlook, Teams) into
  the current workspace for use as task context. Use when you want to pull recent
  documents, emails, or team updates before starting work. Triggers on:
  "sync from SharePoint", "pull M365 content", "sync Teams", "ops-m365-sync",
  "get latest from OneDrive". Works in both Cowork and full OS installs.
---

# ops-m365-sync

Fetches content from Microsoft 365 services and surfaces it as context for
the current task. Covers SharePoint documents, OneDrive files, Outlook threads,
and Teams channel updates.

## Outcome

A structured context block written to `context/m365-sync-{YYYY-MM-DD}.md`
(gitignored) and loaded into the current session.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/USER.md` | External Systems field | Determine which M365 services to sync |
| `context/learnings.md` | `## ops-m365-sync` section | Prior sync patterns |

## Before You Start

Check `context/USER.md` External Systems field. Ask the employee which service
to sync if not already clear from the task context:

1. SharePoint / OneDrive — documents and files
2. Outlook — email threads
3. Teams — channel messages and meeting notes

If this is the first run, ask for auth setup guidance and refer to:
- SharePoint: Microsoft Graph API (`MICROSOFT_GRAPH_TOKEN` in `.env`)
- Or: `m365` CLI tool (`m365 login` — runs interactively)

## Step 1: Determine Sync Scope

Read the current task or goal to determine what to fetch:
- Project or client name → search SharePoint/OneDrive for matching files
- Contact name → search Outlook for recent threads
- Meeting name → search Teams for channel or meeting notes

Ask if scope is ambiguous.

## Step 2: Fetch Content

For each service in scope, fetch via the `m365` CLI or Microsoft Graph API:

**SharePoint/OneDrive:**
```bash
m365 spo file list --webUrl "https://{tenant}.sharepoint.com/sites/{site}" \
  --query "{project or client name}" --output json
```

**Outlook (recent threads):**
```bash
m365 outlook message list --mailbox "{email}" \
  --subject "{keyword}" --output json | head -20
```

**Teams:**
```bash
m365 teams message list --teamId "{team-id}" \
  --channelId "{channel-id}" --output json | tail -20
```

## Step 3: Write Context File

Write fetched content to `context/m365-sync-{YYYY-MM-DD}.md`:

```markdown
# M365 Sync — {YYYY-MM-DD}

## SharePoint Documents
{file list with links}

## Recent Email Threads
{thread summaries}

## Teams Updates
{channel message excerpts}
```

Tell the employee: "M365 content synced. This context file is loaded for your
current session — it won't be committed to git."

## Rules
- Add `context/m365-sync-*.md` to .gitignore if not already present
- Never commit synced M365 content — it may contain sensitive business data
- If `m365` CLI is not installed, tell the employee:
  "Install it with: npm install -g @pnp/cli-microsoft365, then run m365 login"
- Fetch no more than 20 items per service without asking the employee to filter

## Self-Update
Add auth failure patterns and service-specific quirks to Rules as encountered.
