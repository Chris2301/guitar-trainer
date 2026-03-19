#!/bin/bash
set -e

CLAUDE_CREDENTIALS="$HOME/.claude/.credentials.json"
REPO_URL=$(git remote get-url origin)
GIT_EMAIL=$(git config user.email)
GIT_USER=$(git config user.name)

# Derive expected deploy key name from the repo name
REPO_NAME=$(basename -s .git "$REPO_URL")
DEPLOY_KEY="${DEPLOY_KEY:-$HOME/.ssh/${REPO_NAME}_deploy_key}"

if [ ! -f "$DEPLOY_KEY" ]; then
    echo ""
    echo -e "\033[1;31m  ⛔ DEPLOY KEY MISSING: \033[1;33m${DEPLOY_KEY}\033[0m"
    echo ""
    echo -e "  \033[1;36mRepo:\033[0m ${REPO_NAME}"
    echo -e "  \033[1;36mURL:\033[0m  ${REPO_URL}"
    echo ""
    echo -e "  \033[1;37mCreate it:\033[0m"
    echo -e "    \033[0;32m1.\033[0m ssh-keygen -t ed25519 -f \033[1;33m~/.ssh/${REPO_NAME}_deploy_key\033[0m -C \"ralph@${REPO_NAME}\""
    echo -e "    \033[0;32m2.\033[0m Add the \033[1;33mpublic\033[0m key to GitHub → repo Settings → Deploy keys (enable \033[1;31mwrite access\033[0m)"
    echo -e "    \033[0;32m3.\033[0m Re-run this script"
    echo ""
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
