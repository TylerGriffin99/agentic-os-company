# {Company Name} — Claude Cowork Kit

This folder gives you access to the company's shared AI skills, brand context,
and personal memory system inside Claude Cowork.

## Setup (one time)

1. Pull this folder from the company GitHub repo (your manager will send the URL)
2. Point your Cowork project at this folder as the workspace
3. Run `claude` — the `start-here` skill will walk you through personal setup

## Staying Current

The `ops-github-sync` skill pulls the latest company skills and brand context
each morning (via the included cron template). You can also run it manually any time.

Your personal files (`context/USER.md`, `context/memory/`) are never overwritten
by syncs.

## Skills

All company skills are in `skills/`. This folder is a Cowork plugin — install it
through the Cowork plugin manager and skills appear as `/{plugin}:{skill-name}`.
In Claude Code (Code mode), `ops-github-sync` copies these into `.claude/skills/`
where they're discovered natively.

## Support

Contact your manager to request new company-wide skills or report issues.
