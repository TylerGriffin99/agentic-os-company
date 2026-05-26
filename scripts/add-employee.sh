#!/usr/bin/env bash
# Sets up an employee machine after cloning agentic-os-company.
# Run once after cloning: bash scripts/add-employee.sh
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo "  agentic-os-company — Employee Setup"
echo "  ====================================="
echo ""

# 1. Verify SETUP.md exists (means manager has configured the company layer)
if [[ ! -f "${PROJECT_DIR}/context/SETUP.md" ]]; then
  echo "  ✗ context/SETUP.md not found."
  echo "    This repo needs manager setup before employee onboarding."
  echo "    Ask your manager to run: bash scripts/setup-manager.sh"
  exit 1
fi

COMPANY=$(grep "^company:" "${PROJECT_DIR}/context/SETUP.md" | sed 's/company: *//' | tr -d '\r')
echo "  Company: ${COMPANY}"
echo ""

# 2. Lock brand_context/ files to read-only
if [[ -d "${PROJECT_DIR}/brand_context" ]]; then
  find "${PROJECT_DIR}/brand_context" -type f -exec chmod 444 {} \;
  echo "  ✓ brand_context/ locked (read-only — manager-owned)"
fi

# 3. Lock context/SOUL.md
if [[ -f "${PROJECT_DIR}/context/SOUL.md" ]]; then
  chmod 444 "${PROJECT_DIR}/context/SOUL.md"
  echo "  ✓ context/SOUL.md locked (read-only — manager-owned)"
fi

# 4. Lock context/SETUP.md
if [[ -f "${PROJECT_DIR}/context/SETUP.md" ]]; then
  chmod 444 "${PROJECT_DIR}/context/SETUP.md"
  echo "  ✓ context/SETUP.md locked (read-only — manager-owned)"
fi

# 5. Install pre-commit hook
HOOK_SRC="${PROJECT_DIR}/scripts/hooks/pre-commit"
HOOK_DST="${PROJECT_DIR}/.git/hooks/pre-commit"

if [[ -f "$HOOK_SRC" ]]; then
  cp "$HOOK_SRC" "$HOOK_DST"
  chmod +x "$HOOK_DST"
  echo "  ✓ Pre-commit hook installed"
else
  echo "  ⚠ scripts/hooks/pre-commit not found — skipping hook install"
fi

# 6. Create gitignored personal directories
mkdir -p "${PROJECT_DIR}/context/memory"
[[ -f "${PROJECT_DIR}/context/memory/.gitkeep" ]] || touch "${PROJECT_DIR}/context/memory/.gitkeep"

echo ""
echo "  Setup complete."
echo ""
echo "  Next step: run 'claude' to complete your personal onboarding."
echo ""
