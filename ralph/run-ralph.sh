#!/bin/bash
set -e

DEPLOY_KEY="${DEPLOY_KEY:-$HOME/.ssh/ralph_deploy_key}"
CLAUDE_CREDENTIALS="$HOME/.claude/.credentials.json"
REPO_URL=$(git remote get-url origin)
GIT_EMAIL=$(git config user.email)
GIT_USER=$(git config user.name)

if [ ! -f "$DEPLOY_KEY" ]; then
    echo "Deploy key not found at $DEPLOY_KEY"
    exit 1
fi

if [ ! -f "$CLAUDE_CREDENTIALS" ]; then
    echo "Claude OAuth credentials not found at $CLAUDE_CREDENTIALS"
    echo "Run 'claude login' first to authenticate with your Max plan."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
docker build -t ralph-agent "$SCRIPT_DIR"

docker run -it --rm \
  --name ralph-agent \
  -v "${DEPLOY_KEY}":/tmp/ralph_deploy_key:ro \
  -v "${CLAUDE_CREDENTIALS}":/tmp/claude-credentials.json:ro \
  -v ~/.m2/repository:/home/ralph/.m2/repository \
  -e REPO_URL="$REPO_URL" \
  -e GIT_EMAIL="$GIT_EMAIL" \
  -e GIT_USER="$GIT_USER" \
  ralph-agent \
  ralph-loop.sh
