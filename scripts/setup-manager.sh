#!/usr/bin/env bash
# Manager entry point for agentic-os-company first-time setup.
# Run this on the manager's machine to configure the shared company layer.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -f "${PROJECT_DIR}/context/SETUP.md" ]]; then
  echo ""
  echo "  agentic-os-company is already configured."
  echo "  To update company settings, edit brand_context/ and context/SOUL.md"
  echo "  then commit and push. Employees get changes on next update.sh."
  echo ""
  exit 0
fi

echo ""
echo "  agentic-os-company — Manager Setup"
echo "  ====================================="
echo ""
echo "  Claude will walk you through configuring the company layer:"
echo "  brand context, agent identity, and skills."
echo ""
echo "  This runs once. Employees inherit everything you set up."
echo ""

cd "$PROJECT_DIR"
exec claude
