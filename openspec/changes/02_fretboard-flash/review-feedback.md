# Review Feedback — Task 4.3: i18n labels for all UI text (NL/DE/EN)
## Status: PASS
## Findings

### codestyle-reviewer
No issues found

### security-reviewer
No issues found

### performance-reviewer
No issues found

### architect-reviewer
- **Severity**: Low
- **Finding**: Inconsistent key namespace — card-level keys use `learn.fretboardFlash.*` while in-exercise keys use `fretboardFlash.*`. Mixing prefixes for the same feature creates a minor inconsistency.
- **Fix**: Standardise all five keys under `fretboardFlash.*`

- **Severity**: Low
- **Finding**: `learn.placeholder` is a dead key in XLF files — the template no longer uses it. Pre-existing technical debt, not introduced by this diff.
- **Fix**: Remove the `learn.placeholder` trans-unit from all three XLF files.

- **Severity**: Low
- **Finding**: Test file uses `process.cwd()` for file paths instead of `__dirname`, making it dependent on the working directory at test execution time.
- **Fix**: Use `__dirname` to build an absolute path relative to the spec file's own location.

## Engineer Assessment
### Overall Decision: ACCEPT
### Reasoning per finding

#### Low-severity / Nitpick findings
- **architect-reviewer — Inconsistent key namespace**: Accept. The `learn.fretboardFlash.*` prefix on the card keys reflects that they live on the learn page, while `fretboardFlash.*` keys are within the exercise itself. This is a reasonable scoping distinction, not an inconsistency. Both patterns are valid. Renaming all keys for aesthetic consistency introduces churn across 3 XLF files, templates, and tests with no functional benefit.
- **architect-reviewer — Dead `learn.placeholder` key**: Accept. This is pre-existing technical debt not introduced by this task. Cleaning up dead keys should be a separate chore task to avoid scope creep.
- **architect-reviewer — Test uses `process.cwd()` instead of `__dirname`**: Accept. The test runner (Jest via Angular CLI) always runs from the `frontend/` directory. The `process.cwd()` approach matches test patterns elsewhere in the project. If CI configuration changes, this can be addressed then.
