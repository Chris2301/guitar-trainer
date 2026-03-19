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
- **Severity**: Warning
- **Finding**: The spec file `fretboard-image.spec.ts` is placed under `src/app/learn/fretboard-flash/` but tests a static asset in `public/images/`, not an Angular module. It uses Node.js `fs` APIs directly. Every other `.spec.ts` in that folder tests a concrete TypeScript module.
- **Fix**: Move the spec to a dedicated `tests/assets/` directory or add a comment clarifying it is an asset validation test.

- **Severity**: Warning
- **Finding**: The SVG uses absolute pixel coordinates in a 1000-unit viewBox while `note-data.ts` returns percentages. The coordinate systems are inconsistent — dot overlays placed at percentage positions will only coincide with SVG fret lines if the overlay container matches the viewBox dimensions proportionally.
- **Fix**: Either change `note-data.ts` to return raw viewBox coordinates, or confirm the mapping with a comment and add a test to catch drift.

- **Severity**: Low
- **Finding**: The fret position formula is duplicated between `fretboard.svg` and `note-data.ts` with no cross-reference. If one is updated without the other, overlays will diverge.
- **Fix**: Add a cross-reference comment in both files pointing to the other location.

- **Severity**: Low
- **Finding**: `tsconfig.spec.json` adds `"node"` to types globally for all spec files, but only one spec file needs it.
- **Fix**: Acceptable for now; moving the asset spec out of the feature folder would allow narrower scoping.

## Engineer Assessment
### Overall Decision: ACCEPT
### Reasoning per finding
#### architect-reviewer — Spec file placement in Angular feature folder
- **Decision**: Accept
- **Reasoning**: The spec validates that the SVG asset meets structural requirements needed by the feature (correct number of strings, frets, markers). Placing it alongside the feature code that depends on the asset is a reasonable choice — it makes clear which feature owns and depends on this asset. Moving it to a separate `tests/assets/` directory would scatter related concerns. The Node.js `fs` usage is already accommodated by `tsconfig.spec.json` and does not cause issues. This is a stylistic preference, not a defect.

#### architect-reviewer — Coordinate system inconsistency between SVG and note-data.ts
- **Decision**: Accept
- **Reasoning**: This is intentional by design, not an inconsistency. The SVG uses absolute viewBox coordinates (0-1000 range) because that is how SVG works internally. The `note-data.ts` returns percentages because note overlays will be positioned using CSS percentage-based positioning on the container element that wraps the SVG image. Since the SVG uses `preserveAspectRatio="xMidYMid meet"`, a CSS overlay container that matches the SVG's rendered dimensions will have its percentage positions align correctly with the SVG fret lines. The SVG comments already document the percentage-to-pixel mapping explicitly (e.g., `y=8% => 16`, `x = 3 + (fret/15)*94 mapped to 1000-unit viewBox`), and the same formula is used in both files. The two coordinate systems serve different layers (SVG rendering vs. CSS overlay positioning) and are correctly related.

#### Low-severity / Nitpick findings
- **Duplicated fret formula**: Accept. The SVG already contains comments documenting the formula (`x = 3 + (fret/15)*94 mapped to 1000-unit viewBox`) and `note-data.ts` uses the same formula in code. A formal cross-reference comment could help but the risk of drift is low given the formula is simple and already documented in SVG comments. Not worth a refactor cycle.
- **Global "node" types in tsconfig.spec.json**: Accept. The reviewer themselves notes this is acceptable. Only one spec uses Node APIs and the global scope addition has no negative side effects on other tests. If more asset specs appear later this can be revisited.
