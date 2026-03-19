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
- **Severity**: Medium
- **Finding**: The marker width of `2%` is a magic number hardcoded in the template as `[style.width.%]="2"`. No named constant, no comment, no connection to design spec.
- **Fix**: Extract to a named constant in the component class, e.g. `readonly markerSizePercent = 2`, and reference in template as `[style.width.%]="markerSizePercent"`.

- **Severity**: Medium
- **Finding**: The first responsive-scaling test ("should constrain the fretboard image to its container width via max-width") only checks that the element has the `fretboard-image` CSS class. It does not verify any `max-width` or `width: 100%` constraint. The test always passes regardless of whether the behaviour it describes is implemented.
- **Fix**: Rename the test description to match the actual assertion (e.g. "should apply the fretboard-image class to the image element"), or replace with an assertion that checks style constraints.

- **Severity**: Low
- **Finding**: The `aspect-ratio: 1` rule works because width is set as percentage of overlay width. This layout assumption is worth documenting since dot proportionality depends on overlay width resolution.
- **Fix**: Add a brief SCSS comment above `.note-marker` explaining the width/aspect-ratio relationship. Documentation only.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — Magic number `2` for marker width in template
- **Decision**: Fix
- **Reasoning**: This is a legitimate code quality issue. The literal `2` in `[style.width.%]="2"` has no semantic meaning to a reader. Extracting it to a named constant like `markerSizePercent` is trivial, improves readability, and makes future adjustments easier (e.g., if marker size needs to change per context). The existing unit test already asserts `marker.style.width` equals `'2%'`, so the refactor is safely covered. Low effort, clear benefit.

#### architect-reviewer — Misleading responsive-scaling test description
- **Decision**: Fix
- **Reasoning**: The test named "should constrain the fretboard image to its container width via max-width" only asserts `img.classList.contains('fretboard-image')`. This is a false-positive test: it claims to verify responsive scaling behavior but actually only checks CSS class presence, which will always pass regardless of actual styling. This is exactly the kind of test our guidelines warn against ("test behavior, not existence"). The test should either be renamed to match what it actually asserts, or replaced with a meaningful assertion. Given that the actual responsive constraint (`width: 100%`) is applied via SCSS and JSDOM does not compute styles, renaming the test to accurately describe the class-presence check is the pragmatic fix. Alternatively, the test could be removed entirely since class application is implicitly covered by other tests and is framework-level boilerplate.

#### Low-severity / Nitpick findings
- The suggestion to add a SCSS comment documenting the `aspect-ratio: 1` / percentage-width relationship on `.note-marker` will be addressed. It is a one-line comment that helps future developers understand a non-obvious layout dependency. Zero risk, small documentation benefit.

## Re-review (Cycle 2)
### Status: PASS
All four reviewers confirmed the fixes were applied correctly:
- **codestyle-reviewer**: No issues found
- **security-reviewer**: No issues found
- **performance-reviewer**: No issues found
- **architect-reviewer**: All three fixes verified as correctly applied (named constant, test rename, SCSS comment)

### Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT
All findings from cycle 1 have been addressed. No new issues raised.
