# Review Feedback (Cycle 1)
## Status: PASS
## Findings

### codestyle-reviewer
- **Severity**: Low
- **Finding**: `protected readonly themeService` in AppComponent — consider whether `protected` is appropriate vs `private` (only used in template)
- **Fix**: Keep `protected` — Angular requires at least `protected` for template-accessible members in strict mode

- **Severity**: Low
- **Finding**: Inline hardcoded colors in `_theme.scss` dark theme (`#2a5a9a`, `#0a3050`, `rgba(255,255,255,0.14)`, `rgba(255,255,255,0.1)`) not extracted to `_variables.scss`
- **Fix**: Extract to named variables in `_variables.scss`

- **Severity**: Low
- **Finding**: SCSS namespace redundancy — variables prefixed `$gt-` are accessed as `gt.$gt-*` due to `@use ... as gt`
- **Fix**: Either remove `$gt-` prefix or the namespace alias

### security-reviewer
- No issues found

### performance-reviewer
- No issues found (all info-level observations, no action needed)

### architect-reviewer
- **Severity**: Medium
- **Finding**: `[attr.tuiTheme]` binding may be redundant — Taiga UI's `tui-root` may already reflect the `tuiTheme` attribute from `TUI_DARK_MODE` internally. Risk of double-write or competing bindings.
- **Fix**: Verify whether `tui-root` already sets the attribute from `TUI_DARK_MODE`. If so, remove the explicit binding. If not, add a comment explaining why it's needed.

- **Severity**: Low
- **Finding**: `ThemeService` is a thin wrapper around `TUI_DARK_MODE` with no added logic — could be seen as redundant indirection
- **Fix**: Either inject `TUI_DARK_MODE` directly or justify the service as a future extension point with a comment

- **Severity**: Low
- **Finding**: Two hardcoded hex literals in `_theme.scss` (`#2a5a9a`, `#0a3050`) not defined in `_variables.scss`
- **Fix**: Add them as named variables in `_variables.scss`

## Engineer Assessment (Cycle 1)
### Overall Decision: REFACTOR
### Reasoning per finding
#### codestyle-reviewer — `protected readonly themeService` visibility
- **Decision**: Accept (no change needed)
- **Reasoning**: The reviewer already concluded correctly that `protected` is required for template-accessible members in Angular strict mode. No action needed.

#### codestyle-reviewer — Hardcoded colors in `_theme.scss` dark theme
- **Decision**: Fix
- **Reasoning**: There are four inline color values in `_theme.scss` that are not extracted to `_variables.scss`. This is a real consistency issue. Extracting these ensures a single source of truth for the color palette. Low effort, clear benefit.

#### codestyle-reviewer — SCSS namespace redundancy (`gt.$gt-*`)
- **Decision**: Fix
- **Reasoning**: The double prefix `gt.$gt-` is genuinely redundant and hurts readability. Removing the `$gt-` prefix from variable definitions results in `gt.$primary-blue` etc.

#### architect-reviewer — `[attr.tuiTheme]` binding may be redundant
- **Decision**: Accept (add clarifying comment)
- **Reasoning**: `tui-root` does NOT automatically set the `tuiTheme` attribute from `TUI_DARK_MODE`. The explicit binding is necessary. Added clarifying comment.

#### architect-reviewer — `ThemeService` as thin wrapper
- **Decision**: Accept (keep service, add comment)
- **Reasoning**: Provides clean API surface decoupling consumers from Taiga UI token. Added justification comment.

#### architect-reviewer — Hardcoded hex literals in `_theme.scss`
- **Decision**: Fix
- **Reasoning**: Same as codestyle-reviewer finding above.

---

# Review Feedback (Cycle 2)
## Status: PASS
## Findings

### codestyle-reviewer
- No issues found

### security-reviewer
- No issues found

### performance-reviewer
- No issues found

### architect-reviewer
- **Severity**: Low
- **Finding**: One missed hardcoded `rgba(255, 255, 255, 0.6)` value at `_theme.scss` line 60 (`--tui-border-hover`) was not extracted to `_variables.scss`
- **Fix**: Add `$dark-border-hover: rgba(255, 255, 255, 0.6)` to `_variables.scss` and reference it

- **Severity**: Low
- **Finding**: Split SCSS import path in `styles.scss` — imports both `theme` and `variables` separately
- **Fix**: Consider adding `_index.scss` barrel or moving `$font-family` to a CSS custom property

- **Severity**: Low
- **Finding**: `--gt-*` custom properties duplicate some `--tui-*` tokens for the same values
- **Fix**: No action now; decide on token strategy when building feature components

## Engineer Assessment (Cycle 2)
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — Missed hardcoded `rgba(255, 255, 255, 0.6)` in `_theme.scss`
- **Decision**: Fix
- **Reasoning**: This is a genuine consistency issue. All other rgba/hex values in `_theme.scss` were extracted to `_variables.scss` during Cycle 1 refactoring. This one was missed. Extracting it to a named variable (`$dark-border-hover`) keeps a single source of truth for the color palette. Minimal effort, clear benefit.

#### architect-reviewer — Split SCSS imports in `styles.scss`
- **Decision**: Accept (no change needed)
- **Reasoning**: There are currently only two theme-related SCSS files. Adding an `_index.scss` barrel for two files is premature abstraction. The current import structure is clear and easy to follow. Moving `$font-family` to a CSS custom property is a valid future consideration but does not solve a real problem right now. If the theme directory grows to 4+ files, a barrel would become worthwhile.

#### architect-reviewer — `--gt-*` custom properties duplicate `--tui-*` tokens
- **Decision**: Defer (no change needed)
- **Reasoning**: The reviewer already recommended deferring this. The `--gt-*` tokens exist intentionally as an app-level abstraction that decouples feature components from Taiga UI internals. While some values currently overlap, they serve different purposes and may diverge as the app evolves. This is a sound architectural choice, not accidental duplication. Revisit when building feature components.

#### Low-severity / Nitpick findings
- The hardcoded rgba value (finding 1) will be fixed as it is a straightforward consistency issue left over from Cycle 1. The other two findings are accepted as-is with no changes needed.

---

# Review Feedback (Cycle 3 — Task 1.4: i18n)
## Status: PASS
## Findings

### security-reviewer
- **Severity**: Medium
- **Finding**: Bootstrap error handler logs full error unconditionally via `console.error(err)` in `main.ts`. In production, this could expose framework internals.
- **Fix**: Guard with `ngDevMode` check.

- **Severity**: Low
- **Finding**: `@angular/localize` is in `devDependencies` but needed at build time via polyfill. CI pipelines pruning devDeps before building could fail.
- **Fix**: Move `@angular/localize` from `devDependencies` to `dependencies`.

- **Severity**: Low
- **Finding**: XLIFF `<trans-unit>` elements use `datatype="html"` but content is plain text. Invites future HTML injection via translation pipeline.
- **Fix**: Change `datatype="html"` to `datatype="plaintext"` in all XLIFF files.

- **Severity**: Low
- **Finding**: Dev/prod i18n code path difference — dev uses $localize passthrough, prod uses compile-time inlining.
- **Fix**: Acceptable for now. Document that `<target>` values must never contain HTML.

### performance-reviewer
- No issues found. Compile-time i18n is correct — zero runtime overhead.

### architect-reviewer
- **Severity**: Warning
- **Finding**: No serve configuration for testing non-English locales locally.
- **Fix**: Add named serve configurations or document how to test locale builds.

- **Severity**: Warning
- **Finding**: `@angular/localize` is in `devDependencies` but should be in `dependencies`.
- **Fix**: Move to `dependencies`.

- **Severity**: Low
- **Finding**: Source XLIFF uses format 1.2; Angular 17+ defaults to 2.0. Future `ng extract-i18n` may overwrite with 2.0 format.
- **Fix**: Pin format explicitly: `--format=xlf` in extract-i18n script.

- **Severity**: Low
- **Finding**: Triple-slash directive in `main.ts` and `types` entry in `tsconfig.app.json` are redundant.
- **Fix**: Remove triple-slash directive from `main.ts`.

- **Severity**: Low
- **Finding**: Test `'should have $localize available'` tests the framework, not the application.
- **Fix**: Remove this test.

### codestyle-reviewer
- No issues found.

## Engineer Assessment (Cycle 3 — Task 1.4)
### Overall Decision: REFACTOR
### Reasoning per finding
#### security-reviewer — Bootstrap error handler logs full error unconditionally in production
- **Decision**: Fix
- **Reasoning**: The `console.error(err)` in `main.ts` is the default Angular scaffolding, but the reviewer has a valid point. Wrapping it with an `ngDevMode` guard is a one-line change with zero downside. In production, unguarded console.error can leak stack traces and internal paths. Low effort, defensively correct.

#### architect-reviewer — No serve configuration for testing non-English locales locally
- **Decision**: Fix
- **Reasoning**: This is a real developer experience gap. Without locale-specific serve configurations, there is no easy way to verify NL or DE translations during development. The project explicitly supports three languages. Adding `nl` and `de` serve configurations in `angular.json` is straightforward and directly supports the i18n workflow. Without this, developers would need to do a full production build to verify translations, which is impractical.

#### architect-reviewer — `@angular/localize` in devDependencies instead of dependencies
- **Decision**: Fix
- **Reasoning**: Both the security-reviewer and architect-reviewer flagged this independently, which adds weight. `@angular/localize` is listed in `polyfills` in `angular.json`, meaning it is required at build time, not just for development tooling. If a CI pipeline runs `npm install --omit=dev` before building (a common pattern for production builds), the build will fail. Moving it to `dependencies` is the correct fix. This is a real risk, not theoretical -- Cloudflare Pages (the target hosting) could trigger this depending on build configuration.

#### Low-severity / Nitpick findings
- **XLIFF `datatype="html"` vs `datatype="plaintext"`** (security-reviewer): Fix. Looking at the actual XLIFF files, the `<file>` element already uses `datatype="plaintext"` correctly, but the individual `<trans-unit>` elements use `datatype="html"`. Since all current translation content is plain text, changing the trans-unit attribute to `datatype="plaintext"` is accurate and removes a misleading signal for future translation contributors. Trivial change.
- **Dev/prod i18n code path difference** (security-reviewer): Accept. The reviewer already concluded this is acceptable. Angular's compile-time i18n inherently works this way -- dev mode uses `$localize` passthrough, production inlines translations. This is by design, not a defect.
- **Pin XLIFF format in extract-i18n script** (architect-reviewer): Fix. Adding `--format=xlf` to the `extract-i18n` npm script is a one-token change that prevents a future Angular CLI update from silently switching to XLIFF 2.0 format and breaking the existing translation files. Cheap insurance.
- **Triple-slash directive redundant with tsconfig types** (architect-reviewer): Fix. The `/// <reference types="@angular/localize" />` in `main.ts` is redundant because `tsconfig.app.json` already has `"types": ["@angular/localize"]`. Having both is not harmful but violates the "no dead code" principle from CLAUDE.md. Remove the triple-slash directive.
- **Test `'should have $localize available'` tests the framework** (architect-reviewer): Fix. This test verifies that `$localize` is defined and is a function -- that is Angular framework behavior, not application behavior. The other tests in the same file (LOCALE_ID injection, tagged template resolution, rendered title verification) already implicitly prove that `$localize` works. Removing this test reduces noise without losing coverage.

---

# Review Feedback (Cycle 4 — Task 1.4: i18n, post-refactor)
## Status: PASS
## Findings

### security-reviewer
- **Severity**: Medium
- **Finding**: The `nl` and `de` build configurations have `sourceMap: true` and `optimization: false`. If used for production deployments, source maps expose full TypeScript source.
- **Fix**: Document that `ng build --configuration nl/de` is for local dev only; production uses `--configuration production` which builds all locales with optimization.

- **Severity**: Low
- **Finding**: Bootstrap errors silently swallowed in production (ngDevMode guard). No error reporting path for production failures.
- **Fix**: Add `throw err` after the ngDevMode guard, or integrate an error reporting service. Out of scope for i18n task.

- **Severity**: Low
- **Finding**: `@angular/localize` in `dependencies` vs `devDependencies` — reviewer now says it should be devDeps (contradicting previous cycle).
- **Fix**: Conflicting guidance between cycles. Keep in `dependencies` per previous consensus from 2 reviewers.

### performance-reviewer
- **Severity**: Warning
- **Finding**: Bootstrap errors silently swallowed in production — same as security finding.
- **Fix**: Same as above — out of scope for i18n task.

- **Severity**: Warning
- **Finding**: All locale data bundled into every locale build's polyfills chunk (~3.7KB extra per locale).
- **Fix**: Minor issue at current scale (3 locales). Can be optimized later with explicit `registerLocaleData` per entry point.

- **Severity**: Warning
- **Finding**: No server routing config for locale-scoped base href paths. `/nl/` and `/de/` will 404 on Cloudflare Pages.
- **Fix**: Cloudflare Pages routing is a deployment task, not an i18n configuration task. Will be addressed in a future task.

### architect-reviewer
- **Severity**: Warning
- **Finding**: `<html lang="en">` in index.html is hardcoded. NL/DE builds should have matching lang attributes (WCAG 3.1.1).
- **Fix**: Valid finding. Add `i18n-lang` attribute or verify Angular rewrites this automatically during localize build.

- **Severity**: Warning
- **Finding**: `<title>GuitarTrainer</title>` not marked for translation. Inconsistent with i18n-from-day-one approach.
- **Fix**: Valid finding. Add i18n attribute to title element.

- **Severity**: Warning
- **Finding**: extract-i18n options (format, output-path) only in npm script, not in angular.json architect target.
- **Fix**: Move options into architect target as single source of truth.

- **Severity**: Warning
- **Finding**: No Cloudflare Pages routing config (_redirects file) for locale paths.
- **Fix**: Deployment concern — out of scope for this task.

- **Severity**: Suggestion
- **Finding**: Test `h1.textContent === 'Guitar Trainer'` hard-codes English string; fragile if tests run against NL/DE builds.
- **Fix**: Acceptable for now — tests always run against source locale (en).

- **Severity**: Suggestion
- **Finding**: No xliffmerge tooling for propagating new trans-units to locale files.
- **Fix**: Valid but out of scope — can be added when more translatable strings are introduced.

### codestyle-reviewer
- Only nitpicks (array formatting inconsistencies in JSON configs). No actionable issues.

## Engineer Assessment (Cycle 4 — Task 1.4)
### Overall Decision: REFACTOR
### Reasoning per finding
#### security-reviewer — nl/de build configs have sourceMap: true and optimization: false
- **Decision**: Accept
- **Reasoning**: These configurations exist specifically for local development and were added in Cycle 3 at the architect-reviewer's request to allow developers to test locales locally. The `production` configuration already has `localize: true` with optimization enabled and no explicit sourceMap. The reviewer's own suggested fix is "document that nl/de is for local dev only", which is self-evident from the angular.json structure (production is the defaultConfiguration). No code change needed -- this is working as intended.

#### architect-reviewer — `<html lang="en">` hardcoded in index.html (WCAG 3.1.1)
- **Decision**: Fix
- **Reasoning**: This is a legitimate accessibility issue directly in scope for i18n configuration. Angular's compile-time i18n with `i18n-lang` attribute on the `<html>` element will automatically rewrite the `lang` attribute to match the target locale during localized builds. Without this, NL and DE builds serve pages with `lang="en"`, which misleads screen readers and violates WCAG 3.1.1. This is a one-line change on the `<html>` tag and directly relates to i18n correctness.

#### architect-reviewer — `<title>` not marked for translation
- **Decision**: Fix
- **Reasoning**: The page title is user-visible text and a core i18n concern. Marking `<title>` with the `i18n` attribute ensures it gets extracted and translated for NL/DE builds. This also requires adding corresponding `<trans-unit>` entries to the NL and DE XLIFF files. This is squarely within the scope of "i18n configureren" and is low effort.

#### architect-reviewer — extract-i18n options only in npm script, not in angular.json
- **Decision**: Fix
- **Reasoning**: Currently the `extract-i18n` architect target in angular.json has no options, while the npm script passes `--output-path src/locale --format=xlf` as CLI flags. This means running `ng extract-i18n` directly (without the npm script) uses different defaults. Moving these options into the architect target in angular.json creates a single source of truth. The npm script can then simplify to just `ng extract-i18n`. This is a configuration hygiene issue directly in scope for i18n setup.

#### architect-reviewer — No Cloudflare Pages routing config
- **Decision**: Defer
- **Reasoning**: Explicitly out of scope per task description. This is a deployment concern, not an i18n configuration concern.

#### security-reviewer — Bootstrap errors silently swallowed in production
- **Decision**: Defer
- **Reasoning**: Explicitly out of scope per task description. This is a general app concern, not i18n-specific. The ngDevMode guard was already added in Cycle 3. Adding error reporting is a separate task.

#### performance-reviewer — Bootstrap errors silently swallowed in production
- **Decision**: Defer
- **Reasoning**: Same as security-reviewer finding above. Out of scope.

#### performance-reviewer — All locale data bundled into polyfills chunk
- **Decision**: Accept
- **Reasoning**: ~3.7KB extra per locale is negligible at the current scale of 3 locales. The reviewer themselves notes this can be optimized later. Premature optimization with no measurable user impact.

#### performance-reviewer — No server routing for locale paths
- **Decision**: Defer
- **Reasoning**: Cloudflare Pages routing is a deployment concern, explicitly out of scope for this task.

#### Low-severity / Nitpick findings
- **`@angular/localize` in dependencies vs devDependencies** (security-reviewer, Low): Accept. The reviewer contradicts the consensus from Cycle 3 where two reviewers independently agreed it should be in `dependencies`. Keep as-is.
- **Bootstrap error reporting** (security-reviewer, Low): Defer. Out of scope for i18n task.
- **Hardcoded English string in test** (architect-reviewer, Suggestion): Accept. Tests run against the source locale (en) by design. This is standard practice for Angular i18n testing.
- **No xliffmerge tooling** (architect-reviewer, Suggestion): Defer. Valid enhancement but out of scope -- only relevant when the number of translatable strings grows significantly.
- **Array formatting in JSON configs** (codestyle-reviewer, Nitpick): Accept. No functional impact.

---

# Review Feedback (Cycle 5 — Task 1.5: Playwright setup)
## Status: FAIL

## Findings

### codestyle-reviewer
- **Severity**: Nitpick
- **Finding**: Test describe block naming style ("Smoke test - application loads") doesn't match existing project patterns (title case like "Taiga UI Configuration", "Theme Integration")
- **Fix**: Rename to "Application Smoke Test" or similar title-case format

### security-reviewer
- **Severity**: Critical
- **Finding**: Playwright UI bound to `0.0.0.0` via `--ui-host=0.0.0.0` in `e2e:ui` script. On a VPS with a public IP, this exposes the Playwright UI server on a publicly reachable port, giving remote operators full browser control.
- **Fix**: Remove `--ui-host=0.0.0.0`. Use SSH tunnel instead: `ssh -L 9323:127.0.0.1:9323 user@vps`. The default `127.0.0.1` binding restricts to localhost.

- **Severity**: High
- **Finding**: Full `process.env` spread into browser child process via `buildLaunchEnv()`. Leaks all environment variables (potentially secrets) to Chromium subprocess.
- **Fix**: Pass only `LD_LIBRARY_PATH` instead of spreading entire `process.env`. Playwright merges partial env with inherited environment automatically.

- **Severity**: Medium
- **Finding**: Unpinned Playwright version `^1.58.2` allows silent minor upgrades including bundled Chromium.
- **Fix**: Pin exact version or ensure `package-lock.json` is committed and `npm ci` used in CI.

- **Severity**: Low
- **Finding**: HTML report artifacts may be world-readable on shared VPS filesystem.
- **Fix**: Confirm restrictive filesystem permissions on report directory.

### performance-reviewer
- **Severity**: Warning
- **Finding**: Three smoke tests each call `page.goto('/')` independently, causing three full Angular bootstrap cycles where one would suffice.
- **Fix**: Consolidate into a single test with multiple assertions after one navigation.

- **Severity**: Warning
- **Finding**: `process.env` spread copies entire environment into browser process — unnecessary memory overhead.
- **Fix**: Pass only `LD_LIBRARY_PATH` (overlaps with security finding).

- **Severity**: Info
- **Finding**: `ng serve` as webServer command includes watch/HMR infrastructure unnecessary for CI.
- **Fix**: Consider `ng build` + static server for CI (future improvement).

- **Severity**: Info
- **Finding**: HTML reporter unconditionally generates report on every run including local.
- **Fix**: Use `process.env['CI'] ? 'html' : 'dot'` for conditional reporter.

### architect-reviewer
- **Severity**: Warning
- **Finding**: VPS-specific `LD_LIBRARY_PATH` logic embedded in shared config — mixes two concerns (test config + host accommodation).
- **Fix**: Remove `buildLaunchEnv` from shared config. Handle via shell/`.bashrc` on VPS, or isolate behind env var like `PLAYWRIGHT_EXTRA_LD_PATH`.

- **Severity**: Warning
- **Finding**: No dedicated `tsconfig.json` for `e2e/` directory. Playwright types not explicitly included in any tsconfig chain.
- **Fix**: Add `frontend/e2e/tsconfig.json` extending root tsconfig with `"types": ["@playwright/test"]` and add reference in root tsconfig.

- **Severity**: Suggestion
- **Finding**: `e2e:ui` binds to `0.0.0.0` unconditionally (overlaps with security finding).
- **Fix**: Same as security finding — use SSH tunnel instead.

## Engineer Assessment (Cycle 5 — Task 1.5)
### Overall Decision: REFACTOR
### Reasoning per finding
#### security-reviewer — Playwright UI bound to 0.0.0.0 exposing port publicly
- **Decision**: Fix
- **Reasoning**: This is a real and serious risk. The VPS has a public IP, and binding the Playwright UI server to `0.0.0.0` makes it reachable from the internet without authentication. Anyone who discovers the port gets full browser control. The design document explicitly states that VSCode Remote SSH forwards the port, which means SSH tunneling is already the intended access mechanism. Removing `--ui-host=0.0.0.0` and relying on the default `127.0.0.1` binding is a one-token change that eliminates the attack surface entirely. SSH port forwarding works with localhost binding -- the `0.0.0.0` was unnecessary from the start.

#### security-reviewer — Full process.env spread into browser child process
- **Decision**: Fix
- **Reasoning**: Spreading the entire `process.env` into the Chromium subprocess is a genuine security issue. Any secrets in the shell environment (API keys, tokens, database credentials) get passed to the browser process. The fix is straightforward: only pass `LD_LIBRARY_PATH` when it needs augmenting. Playwright inherits the parent process environment by default when `env` is `undefined`, so the current spread is also redundant -- it copies what would already be inherited, but makes it explicit (and therefore frozen at config-load time). Changing `buildLaunchEnv` to return only `{ LD_LIBRARY_PATH: ... }` when the extra path exists, and `undefined` otherwise, solves both the security concern and the architect-reviewer's concern about mixing VPS-specific logic into shared config. This also addresses the performance-reviewer's overlapping finding about unnecessary memory overhead.

#### security-reviewer — Unpinned Playwright version ^1.58.2
- **Decision**: Accept
- **Reasoning**: The caret range `^1.58.2` is standard for devDependencies in the JavaScript ecosystem. The real protection comes from committing `package-lock.json` and using `npm ci` in CI, which is standard practice. Pinning the exact version in `package.json` creates maintenance burden (manual bumps for every patch) without meaningful benefit when the lockfile is committed. Verify that `package-lock.json` is committed -- if it is, this finding is a non-issue.

#### performance-reviewer — Three smoke tests each navigate independently
- **Decision**: Accept
- **Reasoning**: The three tests verify three distinct concerns: page title, app-root presence, and tui-root presence. Playwright creates isolated browser contexts per test by design -- this is a feature, not a problem. Consolidating into one test with multiple assertions would couple unrelated checks and produce less informative failure messages. The overhead of three Angular bootstraps during local development is negligible (sub-second each). In CI, the `webServer` config keeps the server running across all tests, so there is no repeated build. The "three full Angular bootstrap cycles" framing overstates the cost.

#### architect-reviewer — VPS-specific LD_LIBRARY_PATH logic in shared config
- **Decision**: Fix
- **Reasoning**: This will be addressed as part of the security fix above. The refactored `buildLaunchEnv` will only return the minimal `LD_LIBRARY_PATH` override when the VPS-specific path exists, and `undefined` otherwise. This keeps the VPS accommodation contained to a small, clearly commented block rather than spreading the entire environment. An alternative approach of handling this purely in `.bashrc` would be cleaner architecturally, but the current approach with the `existsSync` guard is pragmatic -- it works on both VPS and local machines without manual setup. The fix for the `process.env` spread already addresses the main concern here.

#### architect-reviewer — No dedicated tsconfig.json for e2e/ directory
- **Decision**: Fix
- **Reasoning**: Without a dedicated `tsconfig.json`, the e2e directory relies on implicit TypeScript resolution. Adding `frontend/e2e/tsconfig.json` with `"types": ["@playwright/test"]` ensures proper type checking for Playwright tests and prevents potential conflicts with the Angular test types (Vitest/Jasmine). This is a small configuration file that follows standard Playwright project conventions and prevents type-related issues as more e2e tests are added.

#### Low-severity / Nitpick findings
- **Test describe block naming style** (codestyle-reviewer, Nitpick): Fix. The existing unit tests use title case ("Taiga UI Configuration", "Theme Integration"). Renaming to "Application Smoke Test" takes seconds and maintains consistency across the test suite.
- **HTML report artifacts permissions** (security-reviewer, Low): Accept. The report directory is gitignored and local to the developer. Filesystem permissions on the VPS are an ops concern, not a Playwright config concern.
- **ng serve includes watch/HMR for CI** (performance-reviewer, Info): Defer. Valid optimization but premature. The project has no CI pipeline yet. When CI is set up, this can be revisited.
- **HTML reporter unconditionally generates report** (performance-reviewer, Info): Defer. Minor convenience improvement. The current behavior is acceptable -- developers can ignore the report locally. Can be added later when CI is configured.

---

# Review Feedback (Cycle 6 — Task 1.5: Playwright setup, post-refactor)
## Status: PASS

## Findings

### codestyle-reviewer
- No issues found

### security-reviewer
- **Severity**: Low
- **Finding**: `package-lock.json` not committed (root `.gitignore` excludes it). Caret range on `@playwright/test` means fresh installs could pull different versions.
- **Fix**: Commit `package-lock.json` or pin exact versions. Out of scope for this task — general project concern.

- **Severity**: Low
- **Finding**: HTML reporter generates reports with screenshots/traces that could be accessible if VPS has misconfigured static file serving.
- **Fix**: Confirm `playwright-report/` is not served publicly. Already gitignored.

- **Severity**: Low
- **Finding**: `reuseExistingServer: !process.env['CI']` means local tests could run against wrong server instance.
- **Fix**: Accepted Playwright trade-off for fast local iteration.

### performance-reviewer
- No issues found

### architect-reviewer
- **Severity**: Warning
- **Finding**: `e2e/tsconfig.json` not added to `references` array in `frontend/tsconfig.json`. IDEs may not apply Playwright types when editing e2e files.
- **Fix**: Add `{ "path": "./e2e/tsconfig.json" }` to references in `frontend/tsconfig.json`.

- **Severity**: Warning
- **Finding**: `process.env['HOME']` fallback to `''` at top level could cause false-positive `existsSync` match if `HOME` is unset (resolves relative to cwd).
- **Fix**: Guard with null check — if `HOME` is not set, skip the path entirely.

- **Severity**: Suggestion
- **Finding**: `launchOptions.env` set to `undefined` vs omitting entirely — minor Playwright contract ambiguity.
- **Fix**: Accept as-is; Playwright handles this gracefully.

- **Severity**: Suggestion
- **Finding**: Tests navigate to `/` independently — negligible overhead at current scale.
- **Fix**: No action needed.

## Engineer Assessment (Cycle 6 — Task 1.5)
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — e2e/tsconfig.json not added to references in frontend/tsconfig.json
- **Decision**: Fix
- **Reasoning**: The `e2e/tsconfig.json` was created in the previous cycle but was not wired into the root `frontend/tsconfig.json` references array. Currently the references only include `tsconfig.app.json` and `tsconfig.spec.json`. Without this reference, IDEs using TypeScript project references (which is how Angular projects are structured) will not apply the correct Playwright types when editing files in `e2e/`. This means developers may get false type errors or miss real ones in e2e test files. The fix is adding one line to the references array -- trivial effort, direct benefit for developer experience and type safety.

#### architect-reviewer — process.env['HOME'] fallback to empty string causes false-positive existsSync
- **Decision**: Fix
- **Reasoning**: This is a real, if unlikely, bug. When `process.env['HOME']` is `undefined` (e.g., in some CI environments or containers running as non-login users), the nullish coalescing fallback to `''` means `resolve('', 'playwright-libs', 'lib')` resolves relative to `process.cwd()`. If a `playwright-libs/lib/` directory happens to exist in the working directory, `existsSync` returns `true` and an incorrect `LD_LIBRARY_PATH` is set. The fix is a simple null check: if `HOME` is not set, skip the path entirely and return `undefined` from `buildLaunchEnv`. One-line guard, eliminates a subtle edge case.

#### Low-severity / Nitpick findings
- **package-lock.json not committed** (security-reviewer, Low): Defer. The root `.gitignore` excluding `package-lock.json` is a project-level decision that predates this task. Changing the gitignore policy is out of scope for Playwright setup. This should be raised as a separate project hygiene concern.
- **HTML reporter accessible on misconfigured VPS** (security-reviewer, Low): Accept. The report directory is already gitignored. VPS static file serving configuration is an ops concern unrelated to Playwright config. No change needed.
- **reuseExistingServer could run against wrong server** (security-reviewer, Low): Accept. This is a standard Playwright pattern and the reviewer acknowledges it as an accepted trade-off. The behavior is intentional for fast local iteration.
- **launchOptions.env set to undefined vs omitting** (architect-reviewer, Suggestion): Accept. Playwright handles `undefined` gracefully, and the current code is explicit about the intent -- `buildLaunchEnv()` returns `undefined` when no override is needed. No change warranted.
- **Tests navigate to / independently** (architect-reviewer, Suggestion): Accept. The reviewer themselves says no action needed. Already discussed and accepted in Cycle 5.

---

# Review Feedback (Cycle 7 — Task 1.5: Playwright setup, final)
## Status: PASS

## Findings

### codestyle-reviewer
- No issues found

### security-reviewer
- No issues found

### performance-reviewer
- No issues found

### architect-reviewer
- No issues found

## Engineer Assessment (Cycle 7 — Task 1.5)
### Overall Decision: ACCEPT
### Reasoning
All previous findings have been addressed. The two fixes from Cycle 6 (tsconfig reference and HOME guard) were confirmed correct by all four reviewers. No new findings in any category.
