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
RALPH_LOG_DIR="${RALPH_LOG_DIR:-$SCRIPT_DIR/logs}"
mkdir -p "$RALPH_LOG_DIR"

docker build -t ralph-agent "$SCRIPT_DIR"

# Remove any previous ralph-agent container
docker rm -f ralph-agent 2>/dev/null || true

# Run detached (-d) so closing the terminal won't kill the container.
# Logs are volume-mounted to $RALPH_LOG_DIR for persistence.
# Container is kept after exit (no --rm) so docker logs stays available.
docker run -d \
  --name ralph-agent \
  --stop-signal SIGTERM \
  --stop-timeout 30 \
  -v "${DEPLOY_KEY}":/tmp/ralph_deploy_key:ro \
  -v "${CLAUDE_CREDENTIALS}":/tmp/claude-credentials.json:ro \
  -v ~/.m2/repository:/home/ralph/.m2/repository \
  -v "${RALPH_LOG_DIR}":/workspace/logs \
  -e REPO_URL="$REPO_URL" \
  -e GIT_EMAIL="$GIT_EMAIL" \
  -e GIT_USER="$GIT_USER" \
  ralph-agent \
  ralph-loop.sh

echo ""
echo "Ralph is running in the background."
echo "  Container:  ralph-agent"
echo "  Log dir:    $RALPH_LOG_DIR"
echo ""
echo "Commands:"
echo "  docker logs -f ralph-agent     # follow live output"
echo "  docker stop ralph-agent        # graceful stop (pushes state)"
echo "  docker rm ralph-agent          # cleanup after stopped"
echo "  ls $RALPH_LOG_DIR              # browse persistent logs"
