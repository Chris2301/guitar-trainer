# Review Feedback
## Status: FAIL
## Findings

### codestyle-reviewer
No issues found.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Medium
- **Finding**: The design doc states "no NgRx/signals store — a simple RxJS timer flow in the component suffices." The implementation created a dedicated `GameStateService` using Angular Signals instead of component-local logic. This deviates from the approved design.
- **Fix**: Update `design.md` to reflect the chosen approach (preferred, since a service improves testability), or move the state machine logic into the page component.

- **Severity**: Medium
- **Finding**: `NoteDataService` uses `providedIn: 'root'` while `ProgressionService` and `GameStateService` use `@Injectable()` without a provider scope. Mixed registration strategy is inconsistent.
- **Fix**: Remove `providedIn: 'root'` from `NoteDataService` so all three feature-scoped services use the same strategy and are provided together at the feature component level.

- **Severity**: Low
- **Finding**: `stop()` resets game state but does not reset the `ProgressionService`. If the user stops and restarts, `ProgressionService` retains its pool and shown-note history from the previous session.
- **Fix**: Call `this.progression.reset()` in `stop()`, or document that the caller is responsible for resetting progression.

- **Severity**: Low
- **Finding**: The full cycle test only checks `not.toBeNull()` for `nextNote()` — it does not verify a new draw actually occurred. This is a weak assertion.
- **Fix**: Spy on `ProgressionService.drawNote` and assert it was called on `nextNote()`.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### architect-reviewer — Design doc deviates from implementation (GameStateService vs component-local)
- **Decision**: Fix
- **Reasoning**: The reviewer is correct that the implementation deviates from the design doc. However, the reviewer themselves notes that the service approach is preferred for testability. The right fix is to update `design.md` to reflect the actual approach, not to move logic back into the component. A dedicated service with signals is cleaner, more testable, and aligns with the project conventions (thin components, logic in services). This is a documentation update, not a code change. Since the reviewer flagged this as Medium severity and it represents a genuine inconsistency between design and implementation, it warrants a fix.

#### architect-reviewer — Mixed providedIn strategy across feature services
- **Decision**: Fix
- **Reasoning**: This is a legitimate consistency issue. `NoteDataService` is `providedIn: 'root'` which makes it a singleton, while `ProgressionService` and `GameStateService` are unscoped and expected to be provided at the feature component level. `NoteDataService` is a stateless data-access service so being a root singleton is not harmful, but the inconsistency is confusing and could cause issues if someone later provides the feature services in a different scope expecting `NoteDataService` to follow the same lifecycle. Removing `providedIn: 'root'` from `NoteDataService` and providing all three together at the feature component level is a small, clean fix that improves consistency.

#### Low-severity / Nitpick findings
- **stop() does not reset ProgressionService**: Will fix. This is a real bug. If the user stops and restarts the game, the progression pool and shown-note history should reset. The fix is a single line (`this.progression.reset()` in `stop()`), low risk, and prevents a confusing user experience.
- **Weak assertion in full cycle test**: Will fix. The reviewer is right that `not.toBeNull()` does not verify that a new draw actually happened. Adding a spy on `drawNote` and asserting it was called during `nextNote()` makes the test meaningfully stronger with minimal effort.

## Re-review (Cycle 2)
### Status: PASS
All four reviewers confirmed the fixes were applied correctly:
- **codestyle-reviewer**: No issues found
- **security-reviewer**: No issues found
- **performance-reviewer**: No issues found
- **architect-reviewer**: All four fixes verified as correctly applied (design.md updated, providedIn removed, progression.reset() added in stop(), spy assertions added in tests)

### Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT
All findings from cycle 1 have been addressed. No new issues raised.
