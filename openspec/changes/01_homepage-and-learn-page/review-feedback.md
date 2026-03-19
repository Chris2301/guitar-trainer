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
