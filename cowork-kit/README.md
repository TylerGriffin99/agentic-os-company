# {Company Name} — Claude Cowork Kit

This is a **Cowork plugin** — a self-contained package that gives employees
access to the company's shared AI skills, brand context, and agent identity
inside Claude's Cowork mode.

## What is Cowork?

Claude Desktop has three modes: **Chat**, **Cowork**, and **Code**.

- **Chat** — standard conversation, no tools or file access.
- **Cowork** — collaborative mode with file access, web fetches, code execution
  in an isolated VM, and plugin support. Designed for knowledge work.
- **Code** — full Claude Code experience with terminal, git, and direct
  filesystem access. Used for development and system administration.

Cowork runs an agent loop natively on the device and executes code inside an
isolated VM (Apple Virtualization on macOS, Hyper-V on Windows). It extends
its capabilities through **plugins**.

## How Plugins Work

A Cowork plugin bundles skills, agents, hooks, MCP servers, and commands into
a single installable package. This cowork-kit is structured as a plugin:

```
cowork-kit/
├── .claude-plugin/
│   └── plugin.json          ← manifest (name, version, author)
├── skills/                  ← company skills (SKILL.md format)
│   ├── mkt-brand-voice/
│   ├── mkt-copywriting/
│   ├── ops-github-sync/
│   └── ...
├── context/
│   ├── SOUL.md              ← agent identity (company-wide)
│   ├── USER.md              ← personal profile (gitignored, per-employee)
│   └── memory/              ← session logs (gitignored, per-employee)
├── brand_context/           ← voice profile, positioning, ICP
├── cron/
│   └── templates/           ← scheduled job templates (e.g. daily sync)
└── project-instructions.md  ← project-level instructions for Cowork
```

### Skill discovery

Skills inside a plugin are **namespaced**. If the plugin is named
`acme-cowork`, skills appear as `/acme-cowork:mkt-brand-voice`,
`/acme-cowork:ops-github-sync`, etc. The SKILL.md format is identical to
Claude Code — same YAML frontmatter, same markdown body, same trigger phrases.

### Plugin manifest

The `.claude-plugin/plugin.json` file is required for Cowork to recognise this
folder as a plugin. It is generated automatically by `build-cowork-kit.sh`
using the company name from `context/SETUP.md`.

## Setup (one time)

Employees complete onboarding in **Code mode** first (run `/start-here` in
Claude Code Desktop). This writes `context/USER.md` and offers to sync the
latest skills. Then switch to **Cowork mode**:

1. Open Claude Desktop → switch to Cowork
2. Install this folder as a plugin (via the plugin manager or `--plugin-dir`)
3. All company skills, brand context, and agent identity are immediately available

## Staying Current

The `ops-github-sync` skill pulls the latest company skills and brand context
from GitHub. It runs automatically each weekday at 8am via the included cron
template (`cron/templates/daily-sync.json`), or manually any time.

When run from **Code mode**, the sync does two things:
- Copies `skills/` → `.claude/skills/` (so Code mode discovers them natively)
- Updates the local `cowork-kit/` plugin (so Cowork mode gets the changes too)

**Personal files are never overwritten** — `context/USER.md` and
`context/memory/` are excluded from every sync.

## Dual-mode compatibility

| | Code mode | Cowork mode |
|---|---|---|
| Skills path | `.claude/skills/` (auto-discovered) | `skills/` inside plugin |
| Discovery | Directory scan | Plugin manager |
| Namespace | flat (`/skill-name`) | namespaced (`/plugin:skill-name`) |
| Sync target | `.claude/skills/` | `cowork-kit/` (entire plugin) |

The same SKILL.md files work in both modes. `ops-github-sync` keeps both
paths current from a single source.

## Support

Contact your manager to request new company-wide skills or report issues.
