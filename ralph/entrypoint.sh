#!/bin/bash
set -e

# Copy deploy key with correct ownership (we're root here)
if [ -f /tmp/ralph_deploy_key ]; then
    cp /tmp/ralph_deploy_key /home/ralph/.ssh/ralph_deploy_key
    chown ralph:ralph /home/ralph/.ssh/ralph_deploy_key
    chmod 600 /home/ralph/.ssh/ralph_deploy_key
fi

# Copy Claude OAuth credentials for Max plan auth
if [ -f /tmp/claude-credentials.json ]; then
    mkdir -p /home/ralph/.claude
    cp /tmp/claude-credentials.json /home/ralph/.claude/.credentials.json
    chown -R ralph:ralph /home/ralph/.claude
    chmod 600 /home/ralph/.claude/.credentials.json
fi

# Fix Maven repo ownership so ralph can write lock files and download deps
if [ -d /home/ralph/.m2/repository ]; then
    chown -R ralph:ralph /home/ralph/.m2
fi

# Drop to ralph and exec the command
exec gosu ralph "$@"
