#!/usr/bin/env bash
# Toggle manager mode on/off for agentic-os-company.
# Usage:
#   bash scripts/manager-mode.sh on   — enables manager mode (can edit brand context)
#   bash scripts/manager-mode.sh off  — returns to employee mode
#   bash scripts/manager-mode.sh      — shows current status
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${PROJECT_DIR}/.env"

# Create .env if it doesn't exist
touch "$ENV_FILE"

current_mode() {
  grep -q "^MANAGER=true" "$ENV_FILE" 2>/dev/null && echo "manager" || echo "employee"
}

case "${1:-status}" in
  on)
    if grep -q "^MANAGER=" "$ENV_FILE" 2>/dev/null; then
      sed -i.bak 's/^MANAGER=.*/MANAGER=true/' "$ENV_FILE" && rm -f "${ENV_FILE}.bak"
    else
      echo "MANAGER=true" >> "$ENV_FILE"
    fi
    # Unlock brand_context/, SOUL.md, and cowork-kit company files so manager can edit
    find "${PROJECT_DIR}/brand_context" -type f -exec chmod 644 {} \; 2>/dev/null || true
    chmod 644 "${PROJECT_DIR}/context/SOUL.md" 2>/dev/null || true
    chmod 644 "${PROJECT_DIR}/context/SETUP.md" 2>/dev/null || true
    chmod 644 "${PROJECT_DIR}/cowork-kit/context/SOUL.md" 2>/dev/null || true
    find "${PROJECT_DIR}/cowork-kit/skills" -type f -exec chmod 644 {} \; 2>/dev/null || true
    echo ""
    echo "  ✓ Manager mode ON"
    echo "    brand_context/, SOUL.md, SETUP.md, and cowork-kit company files are now writable."
    echo "    Run 'bash scripts/manager-mode.sh off' when done."
    echo "    Remember to commit and push your changes."
    echo ""
    ;;
  off)
    if grep -q "^MANAGER=" "$ENV_FILE" 2>/dev/null; then
      sed -i.bak 's/^MANAGER=.*/MANAGER=false/' "$ENV_FILE" && rm -f "${ENV_FILE}.bak"
    else
      echo "MANAGER=false" >> "$ENV_FILE"
    fi
    # Re-lock brand_context/, SOUL.md, and cowork-kit company files
    find "${PROJECT_DIR}/brand_context" -type f -exec chmod 444 {} \; 2>/dev/null || true
    chmod 444 "${PROJECT_DIR}/context/SOUL.md" 2>/dev/null || true
    chmod 444 "${PROJECT_DIR}/context/SETUP.md" 2>/dev/null || true
    chmod 444 "${PROJECT_DIR}/cowork-kit/context/SOUL.md" 2>/dev/null || true
    find "${PROJECT_DIR}/cowork-kit/skills" -type f -exec chmod 444 {} \; 2>/dev/null || true
    echo ""
    echo "  ✓ Manager mode OFF — returned to employee mode."
    echo "    Company files are locked again."
    echo ""
    ;;
  status|*)
    echo ""
    echo "  Current mode: $(current_mode)"
    echo "  Usage: bash scripts/manager-mode.sh [on|off]"
    echo ""
    ;;
esac
