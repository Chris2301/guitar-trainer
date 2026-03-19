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
