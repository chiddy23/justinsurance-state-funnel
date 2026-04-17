#!/bin/bash
# SEO preflight checks — run in CI on every PR
# Fails the build if any forbidden string is found in src/

set -e

SEARCH_DIR="src"
FAIL=0

check_string() {
  local string="$1"
  local exclude_pattern="${2:-}"

  if [ -n "$exclude_pattern" ]; then
    matches=$(grep -rn -i --include="*.tsx" --include="*.ts" --include="*.md" --include="*.mdx" "$string" "$SEARCH_DIR" 2>/dev/null | grep -v "$exclude_pattern" || true)
  else
    matches=$(grep -rn -i --include="*.tsx" --include="*.ts" --include="*.md" --include="*.mdx" "$string" "$SEARCH_DIR" 2>/dev/null || true)
  fi

  if [ -n "$matches" ]; then
    echo "FAIL: '$string'"
    echo "$matches"
    echo ""
    FAIL=1
  fi
}

# Brand name violations (the OLD company name used as a brand, not natural language)
check_string "JustLicense"
check_string "support@yourinsurancelicense.com"
check_string "100 Carr 115"

# Student count violations
check_string "15,000+"
check_string "15000 students"

# State count violations (skip NAIC legal references)
check_string "all 50 states" "non-resident-insurance-license"

if [ $FAIL -eq 1 ]; then
  echo ""
  echo "SEO preflight FAILED. Remove forbidden strings before merging."
  exit 1
fi

echo "SEO preflight passed."
