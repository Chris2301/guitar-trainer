# Review Feedback — Task 4.3 (Add translations for all visible text on homepage and learn page)
## Status: PASS
## Findings

### codestyle-reviewer
- **Severity**: Low (Nitpick)
- **Finding**: Test names in header.spec.ts (lines 156, 165) reference "translatable" when they only verify the English source strings, not actual translation output.
- **Fix**: Remove "translatable" from test descriptions for clarity.

- **Severity**: Low
- **Finding**: Reviewer claimed missing `computed` import in header.ts line 1. However, the diff shows `computed` IS present in the import. This is a false positive.
- **Fix**: No action needed.

### security-reviewer
- **Severity**: Low
- **Finding**: All `<trans-unit>` elements carry `datatype="html"`. If translation strings were ever bound via `[innerHTML]`, this could be a stored XSS vector. Not exploitable today — all bindings are text/attribute bindings.
- **Fix**: Policy note: never use `[innerHTML]` with translation strings.

- **Severity**: Low
- **Finding**: Pre-existing locale prefix stripping in selectLanguage could theoretically allow `..` segments if XSS already exists. Not introduced by this diff.
- **Fix**: No action required.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Warning
- **Finding**: Language button `aria-label` in header.html uses raw `lang` string (`NL`, `DE`, `EN`). Not translated and not descriptive for screen reader users. Inconsistent with the just-improved theme toggle aria-label.
- **Fix**: Add translated aria-labels for language buttons using `$localize` pattern.

- **Severity**: Low (Suggestion)
- **Finding**: `$localize` inside `computed` is the only place in the codebase using this pattern outside tests. May confuse future contributors.
- **Fix**: Add a short comment explaining why `$localize` is used here instead of the template `i18n` attribute.

## Engineer Assessment
### Overall Decision: ACCEPT
### Reasoning per finding

#### architect-reviewer — Language button aria-label uses raw lang string, not translated
- **Decision**: Defer
- **Reasoning**: This is the only Warning-level finding. The architect is correct that `[attr.aria-label]="lang"` produces bare strings like "NL", "DE", "EN" which are not descriptive for screen readers (e.g., "Switch to Dutch" would be better). However, task 4.3 is scoped to "Add translations for all visible text on homepage and learn page." The aria-labels on language buttons are not visible text — they are accessibility attributes. The language buttons already display the correct visible text ("NL", "DE", "EN") via `{{ lang }}`, and that text is inherently language-neutral (ISO-style codes). Improving aria-labels for screen readers is a valid accessibility improvement, but it is out of scope for this translation task. It should be tracked as a separate accessibility task. Additionally, the `aria-label` on the language selector group div is already translated via `i18n-aria-label`, so the group-level accessibility is addressed. The individual button labels are a refinement, not a gap introduced by this task.

#### Low-severity / Nitpick findings
- **codestyle-reviewer — test names reference "translatable"**: Accept as-is. The test names are slightly imprecise but not misleading. The tests verify that the source strings (which are the translatable strings) render correctly in the default locale. The word "translatable" is arguably accurate — it describes the nature of the text being tested. Renaming would be cosmetic.
- **codestyle-reviewer — missing computed import**: Confirmed false positive, no action needed.
- **security-reviewer — trans-unit datatype="html"**: Accept. This is standard Angular i18n output. The policy note about avoiding `[innerHTML]` with translation strings is sound general advice but not actionable for this diff.
- **security-reviewer — locale prefix stripping**: Accept. Pre-existing code, not introduced by this diff, and already mitigated by the `VALID_LOCALES` allowlist check.
- **architect-reviewer — $localize in computed pattern**: Accept. The pattern is straightforward and idiomatic for dynamic aria-labels that depend on signal state. A comment would add noise to a small, readable computed signal. Future contributors familiar with Angular i18n will recognize the pattern.
