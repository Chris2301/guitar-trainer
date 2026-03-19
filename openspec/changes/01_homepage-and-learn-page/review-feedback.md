# Review Feedback — Task 3.3 (Shared header with navigation links, theme toggle and language selector)
## Status: FAIL
## Findings

### codestyle-reviewer
- **Severity**: Medium
- **Finding**: `activeLanguage` property should use Angular signals instead of a plain property for consistency with project conventions and OnPush change detection reliability.
- **Fix**: Convert to `protected readonly activeLanguage = signal<string>('EN');` and update template to `activeLanguage()`.

- **Severity**: Medium
- **Finding**: Multiple template lines in `header.html` exceed the Prettier printWidth of 100 characters (lines 3, 4, 13, 23 — up to 201 characters).
- **Fix**: Reformat multi-attribute elements to one attribute per line.

- **Severity**: Low
- **Finding**: Missing language selection click handler — buttons render but clicking does nothing.
- **Fix**: Add `selectLanguage(lang)` method and `(click)` binding on buttons.

- **Severity**: Low
- **Finding**: Line 91 in spec file slightly exceeds 100 char printWidth.
- **Fix**: Break into multiple lines.

### security-reviewer
No issues found.

### performance-reviewer
- **Severity**: Warning
- **Finding**: `themeService.isDarkMode()` signal is read twice in the template (once in `[attr.aria-label]`, once in `@if`). Each is an independent tracked read.
- **Fix**: Read signal once via `@let` or a component-level alias (e.g., `protected readonly isDark = this.themeService.isDarkMode;`).

- **Severity**: Low
- **Finding**: `languages` tuple is re-created per component instance. Static data could be a module-level constant.
- **Fix**: Move to module-level `const` or static class property.

- **Severity**: Low
- **Finding**: Barrel file `index.ts` is fine with named exports — just a note to avoid wildcard re-exports.
- **Fix**: No code change needed.

### architect-reviewer
- **Severity**: Medium
- **Finding**: Language selector is purely cosmetic — no click handler and Angular compile-time i18n cannot switch languages at runtime. UI implies functionality that doesn't exist.
- **Fix**: Either remove the language selector for now, or wire buttons to navigate to per-locale URLs (e.g., `/nl/`, `/de/`, `/en/`).

- **Severity**: Medium
- **Finding**: `toggleTheme()` is public but should be `protected` per convention. Also a thin pass-through — could call `themeService.toggleTheme()` directly in template.
- **Fix**: Mark `protected` or remove wrapper and call service directly.

- **Severity**: Low
- **Finding**: `header` has an `index.ts` barrel file but `home` and `learn` do not — inconsistent pattern.
- **Fix**: Either add barrels to other features or remove from header and import directly.

- **Severity**: Low
- **Finding**: `i18n-aria-label` annotation on a dynamic `[attr.aria-label]` binding may be silently ignored — i18n works on static attributes.
- **Fix**: Use static aria-label with i18n, or compute translated strings in the component.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### codestyle-reviewer — activeLanguage should use Angular signals
- **Decision**: Fix
- **Reasoning**: This is a legitimate consistency issue. The component uses OnPush change detection and all other reactive state in the codebase uses signals. A plain property assignment would not trigger change detection if it were ever mutated after initial render. The fix is trivial (one line change plus template update) and aligns with project conventions.

#### codestyle-reviewer — Template lines exceed 100 char printWidth
- **Decision**: Fix
- **Reasoning**: Lines up to 201 characters are genuinely hard to read and review. Reformatting multi-attribute elements to one-attribute-per-line is standard Angular practice and easy to do. This improves maintainability at zero risk.

#### architect-reviewer — Language selector is purely cosmetic
- **Decision**: Fix
- **Reasoning**: This is the most significant finding. The design document explicitly states "Multi-language support from day 1" with Angular compile-time i18n per locale. Compile-time i18n means each locale is a separate build/deploy served at a different base URL. The language buttons currently do nothing when clicked, which misleads users. The correct fix is to wire the buttons to navigate to per-locale URLs (e.g., `/en/`, `/nl/`, `/de/`). However, since the locale URL scheme is not yet configured (tasks 4.2/4.3 handle i18n wiring), the pragmatic fix for now is to make the buttons link to `window.location` with the locale prefix as a placeholder, or alternatively mark them as non-interactive with a visual disabled state. Given that task 4.2 explicitly covers language switching behavior, the simplest correct approach is to keep the selector visual but make the buttons functional with `href` navigation to locale-prefixed URLs. If the locale deployment is not ready yet, we should at minimum add click handlers that set `activeLanguage` so the UI responds to clicks, even if the actual locale switch happens in a later task.

#### architect-reviewer — toggleTheme() is public, should be protected
- **Decision**: Fix
- **Reasoning**: Valid finding. The method is only called from the template, so it should be `protected` per Angular convention. Alternatively, calling `themeService.toggleTheme()` directly in the template is cleaner since the wrapper adds no logic. Either approach is fine; I will remove the wrapper and call the service directly in the template, which also eliminates the method entirely.

#### performance-reviewer — isDarkMode() signal read twice in template
- **Decision**: Fix
- **Reasoning**: While the performance impact is negligible for a boolean signal, the fix is trivial (add a component-level `protected readonly isDark = this.themeService.isDarkMode`) and makes the template cleaner. It also follows the principle of reading signals once. Will address this alongside the toggleTheme refactor since both touch the same template area.

#### Low-severity / Nitpick findings
- **codestyle-reviewer — Missing language selection click handler**: Will be addressed as part of the architect's language selector finding above.
- **codestyle-reviewer — Line 91 in spec exceeds printWidth**: Will fix while touching the spec file, trivial.
- **performance-reviewer — languages tuple re-created per instance**: Will fix by moving to a module-level const. Trivial one-line change.
- **performance-reviewer — Barrel file note**: No action needed, acknowledged.
- **architect-reviewer — Inconsistent barrel file pattern**: Will defer. The barrel file for header exists because AppComponent imports it. Adding barrels to home/learn is out of scope for this task (they are lazy-loaded route components imported only by the router config). Removing the header barrel would be a valid alternative but is unnecessary churn.
- **architect-reviewer — i18n-aria-label on dynamic binding**: Will fix. The `i18n-aria-label` on a dynamic `[attr.aria-label]` is indeed silently ignored by Angular's i18n extractor. Will either use a static aria-label or remove the i18n annotation from the dynamic binding and handle it properly in the i18n task (4.3).

## Re-review (Cycle 2)
### Status: PASS
All four reviewers confirmed fixes were applied correctly. No new findings.
- **codestyle-reviewer**: No issues found. All 4 fixes verified correct (signal conversion, template formatting, click handler, spec line length).
- **security-reviewer**: No issues found. No regressions introduced.
- **performance-reviewer**: No issues found. Signal alias and module-level const fixes verified correct.
- **architect-reviewer**: No issues found. Language selector click handlers, toggleTheme wrapper removal, and i18n-aria-label fix all verified correct.
