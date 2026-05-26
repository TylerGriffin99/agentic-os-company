---
name: connector-m365-email
description: >
  TEMPLATE — configure via /meta-skill-creator to create your personal Outlook
  email connector. Fetches recent email threads and calendar events at inference time
  so Claude has communication context when drafting replies or preparing for meetings.
  Do NOT invoke this template directly — use /meta-skill-creator to generate
  personal-connector-m365-email.
---

# M365 Email Connector Template

Fetches Outlook email threads and calendar events at inference time. Configure via
`/meta-skill-creator` to create `personal-connector-m365-email`.

## What to Configure (meta-skill-creator will ask)

- Outlook account (personal or shared mailbox)
- How many recent threads to surface (default: 5)
- Filter: by sender, subject keyword, or date range
- Whether to include calendar events for today/this week

## What a Configured Connector Does

1. Reads task context for sender names, subject keywords, or meeting references
2. Fetches matching Outlook threads and upcoming calendar events
3. Returns thread summaries and event details as context
4. Claude uses these for drafting replies, meeting prep, or follow-up tasks

## Outcome

Email thread summaries and calendar events injected into task context.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/USER.md` | External Systems field | Confirms Outlook is configured |
| `context/learnings.md` | `## connector-m365-email` section | Prior usage notes |

## Rules
- Template only — do not run directly
- Requires Microsoft Graph API access or Outlook CLI auth on the machine
- Never store email content to disk — surface as ephemeral context only

## Self-Update
Add auth and rate-limit patterns to Rules as encountered.
