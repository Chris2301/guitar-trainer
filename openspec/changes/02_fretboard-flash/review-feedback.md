# Review Feedback — Task 3.2: Timer Logic
## Status: FAIL
## Findings

### codestyle-reviewer
No issues found.

### security-reviewer
No issues found.

### performance-reviewer
- **Severity**: Warning
- **Finding**: `setTimeout` runs inside Angular's zone, triggering redundant change detection on every timer callback. The design doc explicitly flagged this: "Use `NgZone.runOutsideAngular` for timers if needed." Each callback fires an extra CD tick before the signal update.
- **Fix**: Inject `NgZone` and wrap `setTimeout` in `ngZone.runOutsideAngular()`, calling `ngZone.run(callback)` inside the timeout to ensure signal writes trigger CD properly.

- **Severity**: Warning
- **Finding**: No `OnDestroy` cleanup hook. The service is component-scoped (`@Injectable()` without `providedIn`), so if the component is destroyed while the game is running (e.g. route navigation), the pending `setTimeout` callback will still fire against a destroyed service instance — silent state mutation and minor memory leak.
- **Fix**: Implement `OnDestroy` and call `clearTimer()` from `ngOnDestroy()`.

### architect-reviewer
- **Severity**: Warning
- **Finding**: `setTimeout` callbacks may not trigger Angular change detection if the app uses zone-based CD (default). Signal writes inside `setTimeout` may not update the UI until the next CD cycle is triggered by something else.
- **Fix**: Inject `NgZone` and wrap the callback in `ngZone.run(...)`, or confirm the app is fully zoneless.

- **Severity**: Warning
- **Finding**: No `ngOnDestroy` — timer leaks on service destruction when route navigates away mid-game.
- **Fix**: Implement `OnDestroy` and call `clearTimer()` from `ngOnDestroy()`.

- **Severity**: Warning
- **Finding**: Tests use `vi` (Vitest) APIs (`vi.useFakeTimers()`, `vi.spyOn()`, `vi.advanceTimersByTime()`) but `CLAUDE.md` specifies "Angular test framework for unit" tests. If the project runs Karma/Jasmine, these calls will fail.
- **Fix**: Verify which test runner is configured. If Vitest is the confirmed runner, this is fine (existing codebase already uses Vitest).

- **Severity**: Suggestion
- **Finding**: Manual transition methods (`showAnswer`, `nextNote`) are public but redundant for the normal timer-driven flow. Guard conditions handle races correctly — no change required, just noting.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### performance-reviewer — setTimeout runs inside Angular's zone, triggering redundant CD
- **Decision**: Accept
- **Reasoning**: This app is zoneless. Angular v21 defaults to zoneless change detection, and this project confirms it: there is no `zone.js` in polyfills, no zone.js import in `main.ts`, and no `provideZoneChangeDetection()` in `app.config.ts`. In a zoneless app, `NgZone` is a no-op and `setTimeout` does not trigger change detection cycles. Signal writes are what drive the UI updates. The reviewer's concern is based on an incorrect assumption that the app uses zone-based CD. No fix needed.

#### performance-reviewer — No OnDestroy cleanup hook for timer
- **Decision**: Fix
- **Reasoning**: This is a legitimate issue. The service is `@Injectable()` without `providedIn`, meaning it is component-scoped. If the user navigates away while the game is running, the component (and its injector) is destroyed, but the pending `setTimeout` callback still holds a reference to the service and will fire. This causes a silent state mutation on a detached service instance and keeps the service alive in memory until the timer completes. Implementing `OnDestroy` with `clearTimer()` is a small, clean fix with no downside.

#### architect-reviewer — setTimeout callbacks may not trigger Angular CD
- **Decision**: Accept
- **Reasoning**: Same as the performance-reviewer finding above. The app is zoneless. Signal writes in `setTimeout` callbacks work correctly in zoneless Angular because signals notify the framework's change detection scheduler directly, regardless of where the write occurs. No `NgZone` wrapper is needed.

#### architect-reviewer — No ngOnDestroy, timer leaks on navigation
- **Decision**: Fix
- **Reasoning**: Duplicate of the performance-reviewer finding. Same conclusion: implement `OnDestroy` to clean up timers.

#### architect-reviewer — Tests use Vitest APIs but CLAUDE.md says "Angular test framework"
- **Decision**: Accept
- **Reasoning**: Verified the actual project configuration. The project uses `@angular/build:unit-test` (which uses Vitest under the hood in Angular v21), `vitest` v4.0.8 is in devDependencies, and `tsconfig.spec.json` includes `vitest/globals` in its types. Vitest IS the Angular test framework for this project. The `vi.*` API calls are correct and will work. This is a false positive.

#### Low-severity / Nitpick findings
- **architect-reviewer suggestion** about public `showAnswer`/`nextNote` methods: Accepted as-is. These methods are intentionally public to allow manual user interaction (e.g., tapping to reveal the answer early). The guard conditions prevent invalid state transitions. No change needed.
- **codestyle-reviewer** and **security-reviewer**: No issues found, nothing to address.

## Re-review (Cycle 2)
### Status: PASS
All four reviewers confirmed the OnDestroy fix was applied correctly:
- **codestyle-reviewer**: No issues found
- **security-reviewer**: No issues found
- **performance-reviewer**: OnDestroy fix verified — `ngOnDestroy()` calls `clearTimer()`, timer leak resolved
- **architect-reviewer**: OnDestroy fix verified — `OnDestroy` imported, implemented, and properly clears timers

### Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT
The single Fix finding (missing OnDestroy) has been correctly addressed. No new issues raised.
