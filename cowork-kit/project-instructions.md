# Project Instructions — {Company Name} Cowork Workspace

These instructions tell Claude how to behave in this workspace.

## Who You Are
Read `context/SOUL.md` at session start for the company agent identity.

## Who You're Helping
Read `context/USER.md` at session start for the employee's personal preferences and role.

## Memory
- Daily session log: `context/memory/{YYYY-MM-DD}.md`
- Working scratchpad: `context/MEMORY.md` (max 2,500 chars)

## Brand Context
Read `brand_context/` files (voice-profile, positioning) before producing any
external-facing content.

## Skills
Skills live in `.claude/skills/`. Use them when the task matches. Type `/` to browse.

## External Systems
If USER.md lists external systems and matching `skills/connector-*` folders exist,
suggest running `/meta-skill-creator` to configure a personal connector.

## Rules
- Never overwrite brand_context/ or SOUL.md
- Personal files (USER.md, memory/) are gitignored — do not commit them
- Ask for feedback after major deliverables
