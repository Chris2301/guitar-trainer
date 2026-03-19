#!/usr/bin/env bash
set -eo pipefail

REPO_URL="${REPO_URL:?REPO_URL must be set}"
REPO_DIR=/workspace/repo
HOST_LOG_DIR=/workspace/logs

# Tee all stdout/stderr to a persistent log file on the mounted volume
RUN_LOG="$HOST_LOG_DIR/ralph-run-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$RUN_LOG") 2>&1

echo "Starting Ralph autonomous loop"
echo "Persistent log: $RUN_LOG"

# Graceful shutdown: push current branch state before exiting
CURRENT_BRANCH=""
cleanup() {
    local exit_code=$?
    echo ""
    echo "Caught shutdown signal (exit code: $exit_code)"

    # Kill heartbeat if running
    kill $HEARTBEAT_PID 2>/dev/null || true

    if [ -n "$CURRENT_BRANCH" ] && [ -d "$REPO_DIR/.git" ]; then
        cd "$REPO_DIR"
        echo "Saving state before exit..."

        # Commit any uncommitted work
        git add . 2>/dev/null || true
        git diff --cached --quiet 2>/dev/null || \
            git commit -m "Ralph: auto-save on shutdown ($(date -Iseconds))" 2>/dev/null || true

        # Push current branch so work is not lost
        echo "Pushing $CURRENT_BRANCH to origin..."
        git push origin "$CURRENT_BRANCH" 2>/dev/null || \
            echo "WARNING: failed to push $CURRENT_BRANCH on shutdown"
    fi

    # Copy session logs to host volume
    if [ -d "$REPO_DIR/openspec/ralph_logs" ]; then
        cp -r "$REPO_DIR/openspec/ralph_logs/"* "$HOST_LOG_DIR/" 2>/dev/null || true
    fi

    echo "Shutdown complete."
    exit $exit_code
}
trap cleanup SIGTERM SIGINT EXIT

# Clone fresh copy inside container
if [ ! -d "$REPO_DIR/.git" ]; then
    echo "Cloning $REPO_URL (branch: develop)"
    git clone -b develop "$REPO_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"

git config user.email "${GIT_EMAIL:-ralph@bot}"
git config user.name "${GIT_USER:-Ralph}"

CHANGE_DIR="$REPO_DIR/openspec/changes"

# Session-level logging
SESSION_ID=$(date +%Y%m%d_%H%M%S)
LOG_DIR="$REPO_DIR/openspec/ralph_logs/${SESSION_ID}"
mkdir -p "$LOG_DIR"

SESSION_LOG="$LOG_DIR/session_${SESSION_ID}.json"

# Initialize session log
init_session_log() {
    local feature="$1"
    cat > "$SESSION_LOG" <<ENDJSON
{
  "session": "$SESSION_ID",
  "feature": "$feature",
  "started": "$(date -Iseconds)",
  "iterations": []
}
ENDJSON
}

# Append iteration to session log
append_session_iteration() {
    local iteration="$1"
    local task="$2"
    local duration="$3"
    local input_tokens="$4"
    local output_tokens="$5"
    local cache_read="$6"
    local total_tokens="$7"
    local cost="$8"
    local completed="$9"

    local entry
    entry=$(cat <<ENDJSON
{
      "iteration": $iteration,
      "task_assigned": $(echo "$task" | jq -Rs .),
      "duration_seconds": $duration,
      "tokens": {
        "input": $input_tokens,
        "output": $output_tokens,
        "cache_read": $cache_read,
        "total": $total_tokens
      },
      "cost_usd": $cost,
      "completed": $completed
    }
ENDJSON
)

    # Append to iterations array in session log
    jq --argjson entry "$entry" '.iterations += [$entry]' "$SESSION_LOG" > "${SESSION_LOG}.tmp" \
        && mv "${SESSION_LOG}.tmp" "$SESSION_LOG"
}

# Finalize session log with end time
finalize_session_log() {
    jq --arg ended "$(date -Iseconds)" '. + {ended: $ended}' "$SESSION_LOG" > "${SESSION_LOG}.tmp" \
        && mv "${SESSION_LOG}.tmp" "$SESSION_LOG"
}

# Parse token usage from raw stream-json output
parse_tokens() {
    local raw_file="$1"
    local field="$2"
    local result
    result=$(grep '"type":"result"' "$raw_file" 2>/dev/null | tail -1 | jq -r ".usage.${field} // 0" 2>/dev/null) || true
    echo "${result:-0}"
}

# Parse cost from raw stream-json output
parse_cost() {
    local raw_file="$1"
    local result
    result=$(grep '"type":"result"' "$raw_file" 2>/dev/null | tail -1 | jq -r '.total_cost_usd // 0' 2>/dev/null) || true
    echo "${result:-0}"
}

# Display parsed stream-json line
display_stream_line() {
    local line="$1"
    echo "$line" | jq -r '
        if .type == "assistant" then
            .message.content[]? |
            if .type == "text" then .text
            elif .type == "tool_use" then
                if .name == "Agent" then
                    "\u0001[36m\u0001[0m " + (.input.subagent_type // "agent") + ": " + .input.description
                elif .name == "Bash" then
                    "\u0001[33m\u0001[0m " + (.input.description // .input.command[:60])
                elif .name == "Read" then
                    "\u0001[34m\u0001[0m Read: " + .input.file_path
                elif .name == "Edit" then
                    "\u0001[32m\u0001[0m Edit: " + .input.file_path
                elif .name == "Write" then
                    "\u0001[32m\u0001[0m Write: " + .input.file_path
                elif .name == "Glob" then
                    "\u0001[34m\u0001[0m Glob: " + .input.pattern
                elif .name == "Grep" then
                    "\u0001[34m\u0001[0m Grep: " + .input.pattern
                else
                    "\u0001[35m\u0001[0m " + .name
                end
            else empty
            end
        else empty
        end
    ' 2>/dev/null || true
}

# Generate iteration report markdown
generate_iteration_report() {
    local report_file="$1"
    local iteration="$2"
    local feature="$3"
    local start_iso="$4"
    local duration="$5"
    local task="$6"
    local input_tokens="$7"
    local output_tokens="$8"
    local cache_read="$9"
    local cost="${10}"
    local completed="${11}"

    local status
    if [ "$completed" = "true" ]; then
        status="[x] COMPLETE  [ ] BLOCKED"
    else
        status="[ ] COMPLETE  [x] BLOCKED"
    fi

    cat > "$report_file" <<EOF
## Metadata
- Iteration: $iteration
- Feature: $feature
- Started: $start_iso
- Duration: ${duration}s

## Token Usage
- Input: $input_tokens
- Output: $output_tokens
- Cache read: $cache_read
- Cost: \$${cost}

## Task
**From tasks.md:** $task

## Result
**Status:** $status
EOF
}

# Create a run branch from develop — develop stays untouched
git fetch origin
git checkout develop
git pull origin develop

RUN_BRANCH="ralph/run-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$RUN_BRANCH"
CURRENT_BRANCH="$RUN_BRANCH"

echo "Created run branch: $RUN_BRANCH"

while true; do

  echo "Scanning $CHANGE_DIR"

  FEATURE=$(ls $CHANGE_DIR | grep -v '\.gitkeep' | head -n 1)

  if [ -z "$FEATURE" ]; then
      echo "No more open features found. All done."
      echo "Run branch $RUN_BRANCH is ready for manual merge into develop."
      finalize_session_log
      git push origin "$RUN_BRANCH"
      exit 0
  fi

  echo "Working on feature: $FEATURE"

  cd $REPO_DIR

  # Start feature branch from the run branch
  git checkout "$RUN_BRANCH"

  BRANCH="feature/${FEATURE}"
  ITERATION=0

  # If branch already exists remotely, add a timestamp suffix
  if git ls-remote --heads origin "$BRANCH" | grep -q .; then
      BRANCH="feature/${FEATURE}-$(date +%Y%m%d-%H%M%S)"
      echo "Remote branch feature/${FEATURE} already exists, using: $BRANCH"
  fi

  git checkout -b "$BRANCH"
  CURRENT_BRANCH="$BRANCH"

  # Initialize session log for this feature
  init_session_log "$FEATURE"

  PREV_REMAINING=$(grep -c "\[ \]" openspec/changes/$FEATURE/tasks.md || true)

  while true; do

      TASK=$(grep -m1 "\[ \]" openspec/changes/$FEATURE/tasks.md || true)

      if [ -z "$TASK" ]; then
          echo "All tasks complete for $FEATURE"
          break
      fi

      ITERATION=$((ITERATION + 1))
      ITER_START=$(date +%s)
      ITER_START_ISO=$(date -Iseconds)

      # Log file paths
      RAW_OUTPUT="$LOG_DIR/raw_${SESSION_ID}_iter${ITERATION}.json"
      ITER_REPORT="$LOG_DIR/iter_${SESSION_ID}_${ITERATION}.md"

      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      echo "  ITERATION $ITERATION"
      echo "  Task: $TASK"
      echo "  $ITER_START_ISO"
      echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

      FEATURE_DIR="openspec/changes/$FEATURE"

      # Heartbeat: print timestamp every 10s so we know it's alive
      ( while true; do sleep 10; echo "[heartbeat] $(date -Iseconds) — iteration $ITERATION still running..."; done ) &
      HEARTBEAT_PID=$!

      FEEDBACK_FILE="$FEATURE_DIR/review-feedback.md"

      # Run claude with stream-json output, save raw output and display live
      claude -p \
        --verbose \
        --dangerously-skip-permissions \
        --output-format stream-json \
        "Read .claude/agents/orchestrator.md for your role and workflow instructions. Follow them exactly.

## Context for this iteration

- **FEATURE**: $FEATURE
- **FEATURE_DIR**: $FEATURE_DIR
- **TASK**: $TASK
- **FEEDBACK_FILE**: $FEEDBACK_FILE

Replace all \`<FEATURE>\`, \`<FEATURE_DIR>\`, \`<TASK>\`, and \`<FEEDBACK_FILE>\` placeholders in the orchestrator instructions with the values above." \
        2>&1 | tee "$RAW_OUTPUT" | while IFS= read -r line; do
          display_stream_line "$line"
        done

      kill $HEARTBEAT_PID 2>/dev/null || true

      ITER_DURATION=$(( $(date +%s) - ITER_START ))

      # Parse token usage from raw output
      INPUT_TOKENS=$(parse_tokens "$RAW_OUTPUT" "input_tokens")
      OUTPUT_TOKENS=$(parse_tokens "$RAW_OUTPUT" "output_tokens")
      CACHE_READ=$(parse_tokens "$RAW_OUTPUT" "cache_read_input_tokens")
      TOTAL_TOKENS=$((INPUT_TOKENS + OUTPUT_TOKENS + CACHE_READ))
      COST=$(parse_cost "$RAW_OUTPUT")

      # Warn if token parsing failed on first iteration
      if [ "$TOTAL_TOKENS" -eq 0 ] && [ "$ITERATION" -eq 1 ]; then
          echo "WARNING: Could not parse token usage from raw output"
          echo "Raw output saved to: $RAW_OUTPUT"
      fi

      REMAINING=$(grep -c "\[ \]" openspec/changes/$FEATURE/tasks.md || true)
      if [ "$REMAINING" -lt "$PREV_REMAINING" ]; then
          TASK_COMPLETED=true
          echo "Task completed ($REMAINING remaining, ${ITER_DURATION}s, \$${COST})"
          PREV_REMAINING=$REMAINING
      else
          TASK_COMPLETED=false
          echo "Task not marked done, stopping loop"

          # Still log the failed iteration
          generate_iteration_report "$ITER_REPORT" "$ITERATION" "$FEATURE" "$ITER_START_ISO" \
              "$ITER_DURATION" "$TASK" "$INPUT_TOKENS" "$OUTPUT_TOKENS" "$CACHE_READ" "$COST" "false"
          append_session_iteration "$ITERATION" "$TASK" "$ITER_DURATION" \
              "$INPUT_TOKENS" "$OUTPUT_TOKENS" "$CACHE_READ" "$TOTAL_TOKENS" "$COST" "false"
          finalize_session_log
          git add openspec/ralph_logs/
          git commit -m "Ralph: save logs for failed iteration $ITERATION of $FEATURE"
          git push origin "$BRANCH"

          # Copy logs to host volume so they survive container removal
          cp -r "$LOG_DIR/"* "$HOST_LOG_DIR/" 2>/dev/null || true
          exit 1
      fi

      # Generate iteration report markdown
      generate_iteration_report "$ITER_REPORT" "$ITERATION" "$FEATURE" "$ITER_START_ISO" \
          "$ITER_DURATION" "$TASK" "$INPUT_TOKENS" "$OUTPUT_TOKENS" "$CACHE_READ" "$COST" "true"

      # Append to session log
      append_session_iteration "$ITERATION" "$TASK" "$ITER_DURATION" \
          "$INPUT_TOKENS" "$OUTPUT_TOKENS" "$CACHE_READ" "$TOTAL_TOKENS" "$COST" "true"

      git add .

      git commit -m "Ralph: completed task for $FEATURE"

      # Push after each task so work is never lost
      echo "Pushing $BRANCH after task completion..."
      git push origin "$BRANCH" || echo "WARNING: push failed after task, will retry at end"

  done

  # Finalize session log for this feature
  finalize_session_log

  # Copy logs to host volume so they survive container removal
  cp -r "$LOG_DIR/"* "$HOST_LOG_DIR/" 2>/dev/null || true

  # Commit finalized session log before switching branches
  git add openspec/ralph_logs/
  git commit -m "Ralph: finalize session log for $FEATURE"

  echo "Applying feature spec deltas to openspec/specs/spec.md"

  SPEC_DIR="openspec/changes/$FEATURE/specs"
  TARGET_SPEC="openspec/specs/spec.md"

  if [ -d "$SPEC_DIR" ]; then
      find "$SPEC_DIR" -name 'spec.md' -type f | sort | while IFS= read -r delta_file; do
          echo "  Processing delta: $delta_file"

          # --- REMOVED: delete matching requirement blocks from spec.md ---
          awk '
              /^## REMOVED Requirements$/ { in_section = 1; next }
              /^## / && in_section { exit }
              in_section && /^### Requirement: / { sub(/^### Requirement: /, ""); print }
          ' "$delta_file" | while IFS= read -r req_name; do
              [ -z "$req_name" ] || [ "$req_name" = "(none)" ] && continue
              echo "    Removing requirement: $req_name"
              awk -v name="### Requirement: $req_name" '
                  $0 == name { skip = 1; next }
                  skip && /^---$/ { skip = 0; next }
                  skip && /^### Requirement: / { skip = 0 }
                  skip && /^## / { skip = 0 }
                  !skip { print }
              ' "$TARGET_SPEC" > "${TARGET_SPEC}.tmp" && mv "${TARGET_SPEC}.tmp" "$TARGET_SPEC"
          done

          # --- MODIFIED: remove old block, then append new version ---
          awk '
              /^## MODIFIED Requirements$/ { in_section = 1; next }
              /^## / && in_section { exit }
              in_section && /^### Requirement: / { sub(/^### Requirement: /, ""); print }
          ' "$delta_file" | while IFS= read -r req_name; do
              [ -z "$req_name" ] || [ "$req_name" = "(none)" ] && continue
              echo "    Updating requirement: $req_name"
              awk -v name="### Requirement: $req_name" '
                  $0 == name { skip = 1; next }
                  skip && /^---$/ { skip = 0; next }
                  skip && /^### Requirement: / { skip = 0 }
                  skip && /^## / { skip = 0 }
                  !skip { print }
              ' "$TARGET_SPEC" > "${TARGET_SPEC}.tmp" && mv "${TARGET_SPEC}.tmp" "$TARGET_SPEC"
          done

          MODIFIED_CONTENT=$(awk '
              /^## MODIFIED Requirements$/ { in_section = 1; next }
              /^## / && in_section { exit }
              in_section && /^\(none\)$/ { next }
              in_section && /^### Requirement: / { found = 1 }
              in_section && found { print }
          ' "$delta_file")

          if [ -n "$MODIFIED_CONTENT" ]; then
              echo "" >> "$TARGET_SPEC"
              echo "$MODIFIED_CONTENT" >> "$TARGET_SPEC"
          fi

          # --- ADDED: append new requirement blocks ---
          ADDED_CONTENT=$(awk '
              /^## ADDED Requirements$/ { in_section = 1; next }
              /^## / && in_section { exit }
              in_section && /^\(none\)$/ { next }
              in_section && /^### Requirement: / { found = 1 }
              in_section && found { print }
          ' "$delta_file")

          if [ -n "$ADDED_CONTENT" ]; then
              echo "" >> "$TARGET_SPEC"
              echo "$ADDED_CONTENT" >> "$TARGET_SPEC"
          fi

      done
      echo "Spec deltas applied to $TARGET_SPEC"
  else
      echo "No specs directory found for $FEATURE, skipping spec merge"
  fi

  echo "Archiving feature $FEATURE"

  mkdir -p openspec/archive
  mv "openspec/changes/$FEATURE" "openspec/archive/$FEATURE"
  git add .
  git commit -m "Ralph: archive completed feature $FEATURE"

  echo "Feature $FEATURE complete, pushing branch"

  git push origin "$BRANCH"

  echo "Merging $BRANCH into run branch $RUN_BRANCH"

  git checkout "$RUN_BRANCH"
  CURRENT_BRANCH="$RUN_BRANCH"
  git merge "$BRANCH" --no-edit

  git push origin "$RUN_BRANCH"

  echo "Feature $FEATURE merged into $RUN_BRANCH and archived"

done
