#!/usr/bin/env bash
# Brand protection: re-lock manager-owned files after a company repo pull.
# Sourced by scripts/update.sh after the pull step completes.

# Only run in company mode (SETUP.md present)
if [[ ! -f "${REPO_ROOT:-$(git rev-parse --show-toplevel)}/context/SETUP.md" ]]; then
  return 0
fi

_COMPANY_ROOT="${REPO_ROOT:-$(git rev-parse --show-toplevel)}"

# Temporarily unlock so git pull could write; now re-lock
if [[ -d "${_COMPANY_ROOT}/brand_context" ]]; then
  find "${_COMPANY_ROOT}/brand_context" -type f -exec chmod 444 {} \;
fi

for _locked_file in \
  "${_COMPANY_ROOT}/context/SOUL.md" \
  "${_COMPANY_ROOT}/context/SETUP.md"; do
  [[ -f "$_locked_file" ]] && chmod 444 "$_locked_file"
done

# Re-install pre-commit hook in case .git/hooks was reset
_HOOK_SRC="${_COMPANY_ROOT}/scripts/hooks/pre-commit"
_HOOK_DST="${_COMPANY_ROOT}/.git/hooks/pre-commit"
if [[ -f "$_HOOK_SRC" ]] && [[ ! -f "$_HOOK_DST" ]]; then
  cp "$_HOOK_SRC" "$_HOOK_DST"
  chmod +x "$_HOOK_DST"
fi

unset _COMPANY_ROOT _locked_file _HOOK_SRC _HOOK_DST
