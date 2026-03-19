# Review Feedback — Task 3.4: FretboardFlashPageComponent
## Status: FAIL
## Findings

### codestyle-reviewer
- **Severity**: Medium
- **Finding**: Hard-coded color values (`#fd8d32`, `#979797`, `#fff`) in SCSS instead of using theme variables. The project uses `@use` imports for SCSS variables and CSS custom properties like `var(--gt-accent)`. The `@use` import is missing entirely.
- **Fix**: Add `@use '../../theme/variables' as gt;` at top of SCSS file and replace hard-coded colors with CSS custom properties (`var(--gt-accent)` for start button, `var(--gt-neutral-mid)` for stop button).

- **Severity**: Low
- **Finding**: TypeScript component property grouping could be slightly clearer (direct proxies vs computed signals).
- **Fix**: Optional — add blank line between proxy signals and computed signals.

### security-reviewer
- **Severity**: Low
- **Finding**: No CSP headers configured at application level.
- **Fix**: Infrastructure-level concern — configure at Traefik ingress layer. Out of scope for this component task.

- **Severity**: Low
- **Finding**: Dependencies use `^` semver ranges in package.json.
- **Fix**: Infrastructure/project-level concern. Out of scope for this task.

- **Severity**: Low
- **Finding**: SVG image loaded without SRI. Minimal risk in self-hosted setup.
- **Fix**: No action needed currently.

- **Severity**: Low
- **Finding**: Timer duration constants are exported (potential future risk if made configurable without validation).
- **Fix**: Minor concern, no current exploitability.

### performance-reviewer
- **Severity**: Low
- **Finding**: Fretboard flash feature not yet lazy-loaded (no route registered).
- **Fix**: Routing is task 4.1, out of scope for this task.

- **Severity**: Low
- **Finding**: `NoteDataService.getNotesInFretRange` filters full array on every call without memoization.
- **Fix**: Pre-group by fret in a Map. Minor optimization, not part of this task's scope.

- **Severity**: Low
- **Finding**: Signal called multiple times in `fretboard-display.html` template.
- **Fix**: Use `@if (note(); as n)` pattern. Existing code from previous task, out of scope.

- **Severity**: Low
- **Finding**: Fretboard SVG image has no explicit dimensions (CLS risk).
- **Fix**: Add width/height attributes. Existing code from task 2.x, out of scope.

### architect-reviewer
- **Severity**: Medium
- **Finding**: Button colors hardcoded as hex literals instead of using CSS custom properties or SCSS variables. Bypasses the theming system and won't respond to light/dark theme switching.
- **Fix**: Use `var(--gt-accent)` for start button and `var(--gt-neutral-mid)` for stop button.

- **Severity**: Low
- **Finding**: `NoteDataService` is stateless and side-effect-free but scoped to component. Could be `providedIn: 'root'`.
- **Fix**: Move to `providedIn: 'root'` and remove from component providers. Minor architectural preference.

- **Severity**: Low
- **Finding**: No route registered for the page component.
- **Fix**: Out of scope — routing is task 4.1.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### codestyle-reviewer — Hard-coded color values in SCSS instead of theme variables
- **Decision**: Fix
- **Reasoning**: This is a real issue. The project has a well-established theming system with CSS custom properties (`--gt-accent`, `--gt-neutral-mid`) defined in `_theme.scss` for both light and dark themes. The hard-coded hex values `#fd8d32`, `#979797`, and `#fff` in `fretboard-flash-page.scss` are exact duplicates of `$accent-orange`, `$neutral-mid`, and `$neutral-white` from `_variables.scss`. Replacing them with `var(--gt-accent)`, `var(--gt-neutral-mid)`, and `var(--gt-surface)` (or `var(--gt-hero-text)` for white text) is a trivial change that ensures the component participates in theme switching. The fix is low-risk, low-effort, and directly within scope of task 3.4 since this SCSS file was created as part of this task. Not fixing it would create a known regression when task 5.2 (light/dark theme support) is implemented.

#### architect-reviewer — Button colors hardcoded, bypasses theming system
- **Decision**: Fix
- **Reasoning**: This is the same underlying issue as the codestyle-reviewer finding above. Both reviewers independently identified the same problem, which reinforces that it is a legitimate concern. The theming infrastructure already exists and is in active use across the project. Using it here is the correct approach and requires no new complexity — just replacing three hex values with three CSS custom property references. This is squarely within the scope of task 3.4.

#### Low-severity / Nitpick findings
- **codestyle-reviewer** (property grouping): Will not address. The current grouping is readable enough and adding blank lines is pure cosmetic preference.
- **security-reviewer** (CSP headers, semver ranges, SVG SRI, exported constants): All correctly identified as out of scope for this component task. No action needed.
- **performance-reviewer** (lazy loading, memoization, signal calls in template, SVG dimensions): All correctly identified as either out of scope (task 4.1) or belonging to prior tasks (2.x). No action needed.
- **architect-reviewer** (NoteDataService providedIn scope, no route): The service scoping is a minor architectural preference that does not affect correctness. The route is task 4.1. No action needed for either.

## Re-review (Cycle 2)
### Status: PASS
All four reviewers confirmed the fixes were applied correctly:
- **codestyle-reviewer**: Hard-coded colors fixed correctly. Noted a pre-existing hard-coded color in `fretboard-display.scss` (from task 2.x) — out of scope for this re-review.
- **security-reviewer**: No issues found. No security-relevant changes.
- **performance-reviewer**: No issues found. No performance-relevant changes.
- **architect-reviewer**: All three CSS custom properties (`--gt-accent`, `--gt-neutral-mid`, `--gt-hero-text`) verified as real and defined in both light and dark theme blocks in `_theme.scss`. Fix applied correctly.

### Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT
Both Fix findings from cycle 1 have been correctly addressed. The codestyle-reviewer's note about `fretboard-display.scss` is a pre-existing issue from task 2.x, not introduced by this task and not in scope for this re-review. All Low-severity findings remain correctly deferred. Proceeding to wrap up.
