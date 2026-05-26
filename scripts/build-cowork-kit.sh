#!/usr/bin/env bash
# Assembles cowork-kit/ from the current company layer.
# Run after making changes to brand_context/, SOUL.md, or skills.
# Output: cowork-kit/ (git-tracked, employees pull via ops-github-sync)
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
KIT_DIR="${PROJECT_DIR}/cowork-kit"

echo "Building cowork-kit/..."

# Clean previous build (preserve context/memory/ if it exists)
rm -rf "${KIT_DIR}/skills"
rm -rf "${KIT_DIR}/brand_context"
rm -f  "${KIT_DIR}/context/SOUL.md"

# 1. Copy company skills (exclude personal-* and _catalog)
mkdir -p "${KIT_DIR}/skills"
for skill_dir in "${PROJECT_DIR}/.claude/skills"/*/; do
  skill_name=$(basename "$skill_dir")
  [[ "$skill_name" == _catalog ]] && continue
  [[ "$skill_name" == personal-* ]] && continue
  cp -R "$skill_dir" "${KIT_DIR}/skills/${skill_name}"
done
echo "  ✓ skills/ ($(ls "${KIT_DIR}/skills" | wc -l | tr -d ' ') skills)"

# 2. Copy brand_context/
if [[ -d "${PROJECT_DIR}/brand_context" ]]; then
  cp -R "${PROJECT_DIR}/brand_context" "${KIT_DIR}/brand_context"
  echo "  ✓ brand_context/"
fi

# 3. Copy SOUL.md
mkdir -p "${KIT_DIR}/context"
if [[ -f "${PROJECT_DIR}/context/SOUL.md" ]]; then
  cp "${PROJECT_DIR}/context/SOUL.md" "${KIT_DIR}/context/SOUL.md"
  echo "  ✓ context/SOUL.md"
fi

# 4. Write USER.md template (only if not already customised)
if [[ ! -f "${KIT_DIR}/context/USER.md" ]]; then
  cat > "${KIT_DIR}/context/USER.md" <<'USERMD'
# USER.md — Who You're Helping

## About
- Name:
- Role:
- Team:
- Company:

## Preferences
- Communication style:
- Output format: markdown unless specified
- Preferred output length:

## External Systems
-

## Working Style
-

## Notes
-
USERMD
  echo "  ✓ context/USER.md (template)"
fi

# 5. Ensure memory/ dir exists
mkdir -p "${KIT_DIR}/context/memory"
touch "${KIT_DIR}/context/memory/.gitkeep"

# 6. Copy cron template
mkdir -p "${KIT_DIR}/cron/templates"
if [[ -f "${KIT_DIR}/cron/templates/daily-sync.json" ]]; then
  echo "  ✓ cron/templates/daily-sync.json (existing)"
else
  echo "  ⚠ cron/templates/daily-sync.json not yet created — run Task 10"
fi

echo ""
echo "  cowork-kit/ built. Commit and push for Cowork users to sync."
