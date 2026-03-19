# Review Feedback — Task 4.2: Button/card on Learn page linking to Fretboard Flash
## Status: PASS
## Findings

### codestyle-reviewer
- **Severity**: Medium
- **Finding**: In the mobile media query, `gap: 1.5rem;` is hardcoded instead of using `gt.$feature-grid-gap` like the desktop version and `home.scss`.
- **Fix**: Change `gap: 1.5rem;` to `gap: gt.$feature-grid-gap;` in the mobile media query.

- **Severity**: Low
- **Finding**: E2E test name is somewhat generic ("should display exercises and allow navigation...") when it specifically tests the Fretboard Flash card.
- **Fix**: Rename test to be more specific.

- **Severity**: Low
- **Finding**: Each unit test creates its own fixture independently. Acceptable pattern but slightly inefficient.
- **Fix**: No fix required.

### security-reviewer
No issues found.

### performance-reviewer
- **Severity**: Low (Info)
- **Finding**: Duplicate `fadeInUp` animation on both `.learn` section and `.learn__card` causes unnecessary compositor layer promotion. Minor overhead that compounds as more cards are added.
- **Fix**: Remove `animation` from `.learn__card` or defer per-card animation until many cards exist.

- **Severity**: Medium (Warning)
- **Finding**: `prefers-reduced-motion` is not respected. Neither `_animations.scss` nor `learn.scss` wraps animations in a reduced-motion media query.
- **Fix**: Add `@media (prefers-reduced-motion: reduce)` suppression rule globally in `_animations.scss`.

- **Severity**: Low (Info)
- **Finding**: `:hover` `transform: translateY(-4px)` without `will-change: transform` may cause first-hover jank.
- **Fix**: Add `will-change: transform` to `.learn__card`.

### architect-reviewer
- **Severity**: Medium (Warning)
- **Finding**: Placeholder text ("Training exercises are coming soon...") still renders alongside the live exercise card, which is contradictory.
- **Fix**: Remove the placeholder paragraph now that an exercise exists, or gate it behind a condition.

- **Severity**: Medium (Warning)
- **Finding**: Exercise cards are hardcoded in the template. Won't scale as more exercises are added.
- **Fix**: Define a typed exercise metadata array in the component class and render with `@for`.

- **Severity**: Low (Suggestion)
- **Finding**: The `i18n` attribute-based extraction approach won't work with data-driven rendering if cards become dynamic later.
- **Fix**: No action now; flag for future if data-driven approach is adopted.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### codestyle-reviewer — Hardcoded gap in mobile media query
- **Decision**: Accept
- **Reasoning**: This is a false positive. The reviewer claims `home.scss` uses `gt.$feature-grid-gap` in the mobile media query, but inspection of `home.scss` line 190 shows it also uses `gap: 1.5rem;` hardcoded. Both files follow the same pattern: `$feature-grid-gap` (2rem) on desktop, `1.5rem` on mobile. The mobile value is intentionally different from the variable — it is a deliberate mobile override, not an inconsistency. Changing it to use the variable would actually make the mobile gap 2rem, which is wider than intended.

#### architect-reviewer — Contradictory placeholder text
- **Decision**: Fix
- **Reasoning**: This is a valid finding. The placeholder says "Training exercises are coming soon" while a live exercise card is displayed right below it. This is contradictory and confusing for users. The placeholder text should be removed or updated now that actual content exists. This is a real UX bug, not a style nit.

#### architect-reviewer — Hardcoded exercise cards in template
- **Decision**: Accept (YAGNI)
- **Reasoning**: There is currently exactly one exercise. Introducing a typed metadata array, data-driven rendering, and an `@for` loop for a single card adds complexity with no current benefit. When a second exercise is added, this refactor becomes worthwhile and can be done at that time. Premature abstraction creates more maintenance burden than it saves.

#### performance-reviewer — prefers-reduced-motion not respected
- **Decision**: Defer
- **Reasoning**: This is a legitimate accessibility concern, but it is a global issue affecting `_animations.scss` and every component that uses `fadeInUp` (including `home.scss` which has the same pattern). Fixing it in this task's scope would mean changing global animation infrastructure as a side effect of adding a card to the Learn page. This should be tracked as a separate accessibility task that addresses all animations consistently, not bolted onto a feature task.

#### Low-severity / Nitpick findings
- **codestyle-reviewer — Generic E2E test name**: Accept. The current name adequately describes the test behavior. Renaming it provides negligible value.
- **codestyle-reviewer — Independent fixture creation**: Accept. The reviewer already noted no fix is required.
- **performance-reviewer — Duplicate fadeInUp on section and card**: Accept. With a single card the overhead is negligible. The staggered animation delay (0.15s on the card) is intentional for visual effect. This mirrors the pattern in `home.scss` where feature items also have individual `fadeInUp` animations with staggered delays.
- **performance-reviewer — Missing will-change on hover transform**: Accept. The `will-change` property should be used sparingly; adding it permanently promotes the element to its own compositor layer at all times, which is a larger cost than occasional first-hover jank on a single card. Browsers increasingly optimize `transition` targets automatically.
- **architect-reviewer — i18n attribute approach vs data-driven**: Accept. The reviewer already suggests no action now. Agreed.
