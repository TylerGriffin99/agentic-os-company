---
name: connector-m365-docs
description: >
  TEMPLATE — configure via /meta-skill-creator to create your personal Microsoft 365
  document connector. Fetches files from SharePoint and OneDrive at inference time
  so Claude has the relevant contracts, briefs, and templates when you need them.
  Do NOT invoke this template directly — use /meta-skill-creator to generate
  personal-connector-m365-docs configured for your SharePoint site.
---

# M365 Documents Connector Template

Fetches SharePoint and OneDrive files at inference time. Configure via
`/meta-skill-creator` to create `personal-connector-m365-docs`.

## What to Configure (meta-skill-creator will ask)

- SharePoint site URL or OneDrive path
- Which document libraries or folders to search
- File types to surface (Word, Excel, PDF)
- How to match: by project name, client name, or keyword from task

## What a Configured Connector Does

1. Reads current task context for project or client name
2. Searches the configured SharePoint/OneDrive location for matching files
3. Returns file names, links, and key excerpts as context
4. Claude uses these to inform its response without the employee manually locating files

## Outcome

Document list with links and excerpts injected into task context.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/USER.md` | External Systems field | Confirms M365 is configured |
| `context/learnings.md` | `## connector-m365-docs` section | Prior usage notes |

## Rules
- Template only — do not run directly
- Requires Microsoft Graph API access or OneDrive CLI configured on the machine
- Never store document contents to disk — surface as ephemeral context only

## Self-Update
Add auth failure patterns to Rules as they are encountered.
