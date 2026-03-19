# Iteration Report
## Task
**From tasks.md:** 1.4 Logic for pool expansion: track which notes have been shown, expand when all current pool notes have been seen at least once

## Checklist
### 1. Understanding
- [x] Read spec in `openspec/changes/02_fretboard-flash/`
- [x] Read existing code that will be modified
- [x] Documented approach below

**Approach:** Extended the existing `ProgressionService` to auto-track shown notes via `drawNote()` (renamed from `getRandomNote` to signal side effects). When all notes in the current pool have been seen at least once, `expandPool()` is triggered automatically. Added `hasBeenShown()` query method. At max fret (15), shown tracking resets so the game cycles indefinitely.

### 2. TDD Implementation
- [x] Wrote failing test(s) first
- [x] Implemented minimum code to pass
- [x] All tests pass

**Test file(s):** `frontend/src/app/learn/fretboard-flash/progression.service.spec.ts` (6 new tests, 23 total)

### 3. Reviewers
- [x] `codestyle-reviewer` — passed (no issues)
- [x] `security-reviewer` — passed (no issues)
- [x] `performance-reviewer` — passed (no issues)
- [x] `architect-reviewer` — 2 Medium (rename method with side effect — fixed; misleading test title — fixed), 1 Low (expandPool asymmetry — accepted)

### 4. Engineer Assessment
- [x] Engineer reviewed findings — Decision: REFACTOR (cycle 1), PASS (cycle 2)

### 5. Completion
- [x] Updated tasks.md — marked `[x]`
- [x] Committed with conventional commit message

**Commit:** 275ad3e feat: add shown-note tracking and auto-expansion to ProgressionService

## Result
**Status:** [x] COMPLETE  [ ] BLOCKED
