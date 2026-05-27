---
name: connector-salesforce
description: >
  TEMPLATE — configure via /meta-skill-creator to create your personal Salesforce
  connector. Fetches CRM data (accounts, contacts, deals, tasks) at inference time
  so Claude has live context when you are working on a client or opportunity.
  Do NOT invoke this template directly — use /meta-skill-creator to generate
  personal-connector-salesforce configured for your Salesforce org.
---

# Salesforce Connector Template

Fetches Salesforce CRM data at inference time. Configure via `/meta-skill-creator`
to create your personal version (`personal-connector-salesforce`).

## What to Configure (meta-skill-creator will ask)

- Salesforce org URL (e.g. `https://acme.my.salesforce.com`)
- API credentials env var name (e.g. `SALESFORCE_TOKEN` in `.env`)
- Which objects to fetch: Accounts, Contacts, Opportunities, Tasks, Cases
- Filter: fetch by record name, account name, or current task context

## What a Configured Connector Does

When working on a client or opportunity, it:
1. Reads the task or goal title to extract entity names
2. Queries Salesforce for matching Account, Contact, and open Opportunities
3. Returns structured context: account details, recent activity, open tasks
4. Prepends this context to the current task so Claude has live CRM data

## Outcome

Structured Salesforce data block injected into task context. Not saved to disk.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/USER.md` | External Systems field | Confirms Salesforce is configured |
| `context/learnings.md` | `## connector-salesforce` section | Prior usage notes |

## Rules
- This is a template. Do not run it directly.
- The personal version (personal-connector-salesforce) stores the org URL and
  credential reference in its own SKILL.md after meta-skill-creator configuration.
- Never log Salesforce data to disk — it is injected as ephemeral context only.

## Self-Update
If meta-skill-creator cannot configure this template, add the blocker to Rules.
