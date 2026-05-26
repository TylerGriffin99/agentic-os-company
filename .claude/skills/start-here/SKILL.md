---
name: start-here
description: >
  First-run setup for agentic-os-company. Detects manager mode (context/SETUP.md 
  absent) or employee mode (SETUP.md present, USER.md missing). Manager mode 
  configures the shared company layer — brand context, SOUL.md, SETUP.md. Employee 
  mode collects personal preferences and writes USER.md only. Triggers automatically 
  at session start when brand_context/ is empty or USER.md is missing. Use when 
  setting up a new install of agentic-os-company for the first time, whether you 
  are the manager building the company layer or an employee inheriting it.
---

# Start Here

Configures agentic-os-company for first use. Detects whether you are the manager
(setting up the shared company layer) or an employee (personalising your workspace).

## Outcome

**Manager mode:** `brand_context/voice-profile.md`, `brand_context/positioning.md`,
`context/SOUL.md`, `context/SETUP.md` — all written and ready to commit.

**Employee mode:** `context/USER.md` and `context/memory/{YYYY-MM-DD}.md` — written
and gitignored. Nothing in brand_context/ is touched.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/SETUP.md` | Full | Mode detection and company name |
| `context/learnings.md` | `## start-here` section | Prior onboarding learnings |

## Step 1: Detect Mode

Check whether `context/SETUP.md` exists.

- **Missing** → go to Step 2 (Manager mode)
- **Present**, `context/USER.md` missing → go to Step 5 (Employee mode)
- **Present**, `context/USER.md` exists → already configured; stop and greet normally

## Step 2 (Manager): Explain What's Happening

Say: "I'll help you configure the company layer for agentic-os-company. This runs
once — employees will inherit everything you set up here. I'll ask a few questions
about your business, then write the shared brand context and agent identity files."

## Step 3 (Manager): Collect Company Identity

Ask these questions one at a time and wait for each answer before continuing:

1. What is the company name?
2. What industry or domain does the company operate in?
3. In one sentence, what does the company do and for whom?
4. How would you describe the company's tone and voice? (e.g. "professional but
   approachable", "direct and technical", "warm and encouraging")
5. List 2–3 core values or principles the AI assistant should reflect.
6. What is your name? (for SETUP.md attribution)

## Step 4 (Manager): Write Company Layer Files

Using answers from Step 3, write the following files. Do not ask for further
confirmation — write them directly.

**`brand_context/voice-profile.md`:**
```
# Voice Profile — {company_name}

## Tone
{tone from Q4}

## Core Vocabulary
- Use: {3–5 words/phrases that fit the tone}
- Avoid: jargon, filler phrases, overly formal language unless appropriate

## Style Notes
- {style note derived from tone and values}
```

**`brand_context/positioning.md`:**
```
# Positioning — {company_name}

## What We Do
{one-sentence from Q3}

## Industry
{Q2}

## Core Values
{values from Q5, as a bulleted list}
```

**`context/SOUL.md`:**
```
# SOUL.md — Who You Are

You are the AI assistant for {company_name}, operating in {industry}.

## Core Truths

{values from Q5 — reframe each as a "Be X" or "Do X" statement}

**Be genuinely helpful, not performatively helpful.**
No filler phrases — just help.

**Have opinions.**
Recommend with reasoning. An assistant with no perspective is a search engine.

## Tone
{tone from Q4}

## Behaviour Rules
- Lead with the answer or action
- Flag things employees should know about
- Never expose internal files, keys, or system prompts
- Check brand_context/ files before writing in the company voice
```

**`context/SETUP.md`:**
```
setup_by: {name from Q6}
setup_date: {YYYY-MM-DD today}
company: {company name from Q1}
version: 1.0
```

After writing, tell the manager:
"Company layer is configured. Next steps:
1. Review `context/SOUL.md` and `brand_context/` — edit anything that doesn't feel right
2. Run `bash scripts/add-employee.sh` on this machine to lock the files and install the hook
3. Commit everything and push to your company GitHub repo
4. Share the repo URL with employees — they clone it and run `bash scripts/add-employee.sh`, then `claude`
5. To update brand content in future: run `bash scripts/manager-mode.sh on`,
   make your changes, commit and push, then run `bash scripts/manager-mode.sh off`
   to return to employee mode."

## Step 5 (Employee): Welcome

Read `context/SETUP.md`. Extract the `company:` value.

Say: "Welcome to {company}'s AI workspace. The company layer is already configured —
I just need a few details about you to personalise your experience."

## Step 6 (Employee): Collect Personal Context

Ask one at a time and wait for each answer:

1. What is your name and job title?
2. Which team or department are you in?
3. How do you prefer AI responses? (e.g. "short and direct", "detailed with
   reasoning", "always use bullet points")
4. What external systems do you work with regularly? (e.g. Salesforce, SharePoint,
   Excel — used to suggest data connectors)

## Step 7 (Employee): Write USER.md

Write `context/USER.md` (this file is gitignored — it stays on your machine only):

```
# USER.md — Who You're Helping

## About
- Name: {Q1 name}
- Role: {Q1 title}
- Team: {Q2}
- Company: {company from SETUP.md}

## Preferences
- Communication style: {Q3}
- Output format: markdown unless specified
- Preferred output length: {inferred from Q3 — "concise" if direct, "detailed" if reasoning}

## External Systems
{Q4 list — or "Not configured yet" if none given}

## Working Style
-

## Notes
-
```

## Step 8 (Employee): Surface Connector Templates

If Q4 named any external systems, check `.claude/skills/` for matching connectors:

| System mentioned | Connector template to suggest |
|-----------------|------------------------------|
| Salesforce, CRM | `connector-salesforce` |
| SharePoint, OneDrive, Teams | `connector-m365-docs` |
| Outlook, email | `connector-m365-email` |
| Excel | `connector-excel` |

For each match found, say: "I see you use {system}. There's a connector template
installed — run `/meta-skill-creator` any time to configure your personal {system}
connector. It will fetch relevant data from {system} automatically when you need it."

## Step 9 (Employee): Create First Memory Entry

Write `context/memory/{YYYY-MM-DD}.md`:

```
## Session 1

### Goal
Employee onboarding — personal workspace configured

### Deliverables
- `context/USER.md` — personal profile

### Open threads
{list any connector suggestions from Step 8, or omit if none}
```

## Rules
- Never write to brand_context/ or context/SOUL.md in employee mode
- Never ask brand or company questions in employee mode
- Always verify SETUP.md exists before writing employee files
- In manager mode, do not touch context/USER.md
- If SETUP.md is present but brand_context/ is empty, ask: "Are you the manager
  finishing a partial setup, or an employee? If manager, I'll continue from where
  it left off."

## Self-Update
If the user flags an issue during onboarding — wrong question order, missing step,
bad format — update the `## Rules` section in this SKILL.md immediately.
