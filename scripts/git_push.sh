#!/usr/bin/env bash
set -euo pipefail

# Push helper:
# - Ensures we're inside a git repo
# - Switches origin remote from HTTPS -> SSH (GitHub) when needed
# - Pushes current branch (or a branch passed as $1)

cd "$(git rev-parse --show-toplevel 2>/dev/null || true)" || {
  echo "Error: not inside a git repository." >&2
  exit 1
}

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git working tree." >&2
  exit 1
fi

BRANCH="${1:-$(git branch --show-current)}"
if [[ -z "${BRANCH}" ]]; then
  echo "Error: could not determine current branch. Pass it explicitly: $0 <branch>" >&2
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Error: remote 'origin' not found." >&2
  exit 1
fi

ORIGIN_URL="$(git remote get-url origin)"

if [[ "${ORIGIN_URL}" =~ ^https://github\.com/([^/]+)/([^/]+)(\.git)?$ ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
  SSH_URL="git@github.com:${OWNER}/${REPO}.git"

  echo "Switching origin from HTTPS to SSH:"
  echo "  ${ORIGIN_URL}"
  echo "  -> ${SSH_URL}"
  git remote set-url origin "${SSH_URL}"
else
  echo "Origin remote is already non-HTTPS:"
  echo "  ${ORIGIN_URL}"
fi

echo "Pushing branch: ${BRANCH}"
git push -u origin "${BRANCH}"

echo "Done."


