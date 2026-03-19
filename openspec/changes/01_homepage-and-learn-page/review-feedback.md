# Review Feedback — Task 4.2 (Write Playwright test: switching language shows translations in NL, DE, EN)
## Status: FAIL
## Findings

### codestyle-reviewer
- **Severity**: Low
- **Finding**: `page.locator('.learn__heading')` used on lines 67, 78, 86 of the E2E test instead of `getByTestId()`, inconsistent with the rest of the test suite.
- **Fix**: Add `data-testid="learn-heading"` to the `<h2>` in `learn.html` and use `page.getByTestId('learn-heading')`.

- **Severity**: Low
- **Finding**: Multiple uses of `(o: any)` type in `header.spec.ts` filter callbacks (lines 89, 113, 114, 130, 131).
- **Fix**: Replace `(o: any)` with `(o: Element)` or `(o: HTMLButtonElement)`.

- **Severity**: Low (Nitpick)
- **Finding**: Regex patterns like `/\/nl\//` repeated throughout the test file without constants.
- **Fix**: Extract into named constants at the top of the file.

- **Severity**: Low (Nitpick)
- **Finding**: Variables like `nlButton`, `deButton` are created and used only once.
- **Fix**: Consider inlining or keep as-is for readability.

### security-reviewer
- **Severity**: High
- **Finding**: Path traversal vulnerability in `serve-i18n.mjs` line 56. A request like `/en/../../../etc/passwd` resolves outside `DIST_DIR` via `resolve()`. The `existsSync` fallback only applies when the path does not exist — if the traversed path exists, it is served directly.
- **Fix**: After computing `fullPath`, assert it starts with `DIST_DIR + '/'` before reading. Return 400 if the check fails.

- **Severity**: Medium
- **Finding**: Open redirect via `window.location.href` in `header.ts` `selectLanguage`. The `lang` parameter is an unconstrained `string`. While currently called only from UI buttons, the API contract allows arbitrary strings including `//evil.com` or `javascript:` URIs.
- **Fix**: Validate `targetLocale` against a known locale allowlist (`['en', 'nl', 'de']`) before constructing the URL. Also guard `NAVIGATE_FN` factory to reject non-relative or `//`-prefixed URLs.

- **Severity**: Low
- **Finding**: Missing security headers (`X-Content-Type-Options`, `X-Frame-Options`) in `serve-i18n.mjs`.
- **Fix**: Add `nosniff` and `DENY` headers. Minor since this is a test-only server.

### performance-reviewer
- **Severity**: Warning
- **Finding**: `existsSync` (synchronous) on the hot path of the async server in `serve-i18n.mjs` line 59, plus no HTTP cache headers causing repeated disk reads per asset per page load.
- **Fix**: Remove `existsSync`, rely on `readFile` catch block for SPA fallback. Add `Cache-Control` headers for hashed static assets.

- **Severity**: Warning
- **Finding**: All locale assertions chained in single tests (5 full-page navigations run serially), preventing parallel execution.
- **Fix**: Split into independent per-locale-pair tests so Playwright workers can parallelize.

- **Severity**: Low (Info)
- **Finding**: Missing `stdout` match on i18n webServer in `playwright.config.ts`; unclear failures when dist build is absent.
- **Fix**: Add `stdout: 'i18n server listening'` to the webServer config.

- **Severity**: Low (Info)
- **Finding**: Redundant `document.defaultView` access in `selectLanguage` — `DOCUMENT` injection could be removed from the component.
- **Fix**: Move all window access behind the `NAVIGATE_FN` token.

### architect-reviewer
- **Severity**: Warning
- **Finding**: `selectLanguage` accesses `document.defaultView` directly to read `pathname` after injecting `NAVIGATE_FN` for testability. The abstraction is incomplete — `pathname` still comes from the real window in tests.
- **Fix**: Extract a `LOCATION_FN` injectable or keep reading directly but document the limitation.

- **Severity**: Warning
- **Finding**: The i18n project routing in `playwright.config.ts` is built on a filename convention (`testMatch: /language-switching/`) with no documentation. A developer adding a second i18n test file with a different name will silently run against the wrong server.
- **Fix**: Add comments in both `playwright.config.ts` and `language-switching.spec.ts` explaining the convention and the port 4201 requirement.

- **Severity**: Warning
- **Finding**: CSS class selector `.learn__heading` used in E2E test instead of `data-testid`, inconsistent with project pattern.
- **Fix**: Add `data-testid="learn-heading"` to the element and use `getByTestId`.

- **Severity**: Low (Suggestion)
- **Finding**: `LANGUAGES` and `LOCALE_TO_LANGUAGE` are two separate structures that must be kept in sync manually.
- **Fix**: Derive one from the other to establish a single source of truth.

- **Severity**: Low (Suggestion)
- **Finding**: German translations contain missing diacritics: "Aufwarmubungen" → "Aufwärmübungen", "fur" → "für", "spater" → "später", "Aufwarmspiele" → "Aufwärmspiele".
- **Fix**: Correct the German translation strings in `messages.de.xlf`.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### security-reviewer — Path traversal in serve-i18n.mjs
- **Decision**: Fix
- **Reasoning**: This is a real vulnerability. Although `serve-i18n.mjs` is only used for E2E tests and never deployed to production, the fix is trivial (a single `startsWith` check after `resolve`) and prevents accidental misuse if someone ever runs this server in a less controlled context. The regex on line 41 already constrains the locale prefix to `en|nl|de`, which limits the attack surface to the sub-path portion, but a crafted request like `/en/../../../etc/passwd` would still resolve outside `DIST_DIR`. Worth fixing for defense-in-depth.

#### security-reviewer — Open redirect via window.location.href in header.ts
- **Decision**: Fix
- **Reasoning**: The `selectLanguage` method accepts an unconstrained `string`. While the callers are currently only the three UI buttons, the method is `public` (no access modifier means package-default in TypeScript context) and could be called programmatically. The fix is minimal: validate `targetLocale` against the known set `['en', 'nl', 'de']` and return early if it does not match. This also makes the code more self-documenting. Worth doing.

#### architect-reviewer — Incomplete abstraction (document.defaultView for pathname)
- **Decision**: Defer
- **Reasoning**: The `selectLanguage` method reads `window.location.pathname` directly while using `NAVIGATE_FN` for the write side. This is an incomplete abstraction, but unit tests currently work around it by testing the navigate call output rather than the pathname read. Introducing a `LOCATION_FN` injectable adds complexity for a scenario that is already covered. If a future test needs to mock the pathname, this can be addressed then. Adding a brief code comment documenting the limitation is sufficient for now.

#### architect-reviewer — Filename convention for i18n project routing in playwright.config.ts
- **Decision**: Fix
- **Reasoning**: The `testMatch: /language-switching/` and `testIgnore: /language-switching/` convention is non-obvious. A developer adding a second i18n E2E test with a different filename would silently run it against port 4200 (no i18n server). Adding explanatory comments to both `playwright.config.ts` and the test file is zero-risk and prevents real confusion.

#### architect-reviewer — CSS class selector .learn__heading in E2E test
- **Decision**: Fix
- **Reasoning**: The rest of the E2E test consistently uses `getByTestId`. Three occurrences of `.learn__heading` via `page.locator` are inconsistent and fragile (tied to CSS class names). Adding `data-testid="learn-heading"` to the template and switching to `getByTestId` is a small, safe change that improves consistency and resilience.

#### architect-reviewer — LANGUAGES and LOCALE_TO_LANGUAGE kept in sync manually
- **Decision**: Defer
- **Reasoning**: These are two small constants with three entries each. The risk of them drifting is very low and the refactor adds abstraction without meaningful benefit at this scale. Can be revisited when more locales are added.

#### architect-reviewer — German translation diacritics (Aufwarmubungen, fur, spater, etc.)
- **Decision**: Fix
- **Reasoning**: These are plain content bugs. "Aufwarmubungen" is not a German word; the correct form is "Aufwärmübungen". Same for "fur" (für), "spater" (später), "Aufwarmspiele" (Aufwärmspiele). Fixing them is zero-risk and improves quality for German-speaking users.

#### codestyle-reviewer — (o: any) type in header.spec.ts filter callbacks
- **Decision**: Fix
- **Reasoning**: Replacing `(o: any)` with a proper type is trivial and removes `any` usage. Since we are already touching these files, this is worth cleaning up alongside the other changes.

#### Low-severity / Nitpick findings
- **codestyle-reviewer — .learn__heading in E2E**: already covered above under the architect-reviewer finding (same issue). Will fix.
- **codestyle-reviewer — regex constants**: Accept. The regexes `/\/nl\//` are used in assertions that are self-explanatory in context. Extracting them into constants would add indirection without improving readability.
- **codestyle-reviewer — inlining nlButton/deButton variables**: Accept. The named variables improve readability; the reviewer themselves noted "keep as-is for readability" as an option.
- **security-reviewer — missing security headers in serve-i18n.mjs**: Accept. This is a test-only server that only runs locally or in CI. Adding security headers provides no meaningful protection.
- **performance-reviewer — existsSync on hot path**: Defer. This is a test-only server serving a handful of requests during E2E runs. Performance is irrelevant here.
- **performance-reviewer — serial locale assertions**: Accept. The test represents a single user journey (switch EN -> NL -> DE -> EN) which is inherently sequential. Splitting it would test isolated locale switches, not the journey. This aligns with the project's e2e philosophy of testing user journeys.
- **performance-reviewer — missing stdout match on webServer**: Fix. Adding `stdout: 'pipe'` or a stdout match string is trivial and improves debugging when the dist build is absent. Will include this alongside the comment fix for playwright.config.ts.
- **performance-reviewer — redundant document.defaultView access**: Same issue as the architect-reviewer abstraction finding. Deferred.
