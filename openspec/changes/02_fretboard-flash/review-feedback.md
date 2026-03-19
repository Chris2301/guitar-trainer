# Review Feedback
## Status: PASS
## Findings
### codestyle-reviewer
No issues found.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Low
- **Finding**: The `src` attribute uses a bare relative path `images/fretboard.svg`. A bare `images/` path resolves relative to the page URL, which could break under sub-routes.
- **Fix**: Use root-relative path or proper asset configuration.

- **Severity**: Low
- **Finding**: Tests assert `getComputedStyle` values for CSS properties. `getComputedStyle` in jsdom may not process actual CSS stylesheets — assertions may not actually verify the SCSS rules are applied.
- **Fix**: Assert class names are present on elements instead, or keep CSS verification as a visual/E2E concern.

- **Severity**: Low
- **Finding**: All four tests repeat `TestBed.createComponent` and `fixture.detectChanges()` independently instead of hoisting to `beforeEach`.
- **Fix**: Extract shared fixture variable into `beforeEach`.

## Engineer Assessment
### Overall Decision: ACCEPT
### Reasoning per finding
#### Low-severity / Nitpick findings
- **Bare relative image path**: Valid observation. In Angular, assets referenced via `src` in templates resolve relative to the base href, not the component URL, so this works correctly for a single-route SPA served at `/`. However, switching to a root-relative path (`/images/fretboard.svg`) is a trivial improvement that prevents future breakage if base href changes. Will address in a follow-up commit.
- **getComputedStyle in jsdom**: Correct — jsdom does not process SCSS or linked stylesheets, so `getComputedStyle` assertions are effectively no-ops in unit tests. These should be replaced with class-presence assertions or moved to E2E tests. Will address in a follow-up commit.
- **Repeated TestBed setup across tests**: Standard test hygiene issue. Extracting the fixture into a `beforeEach` reduces duplication and is straightforward. Will address in a follow-up commit.
