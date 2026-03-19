# Review Feedback
## Status: PASS (cycle 2)
## Findings

### codestyle-reviewer
- **Severity**: Medium
- **Finding**: Component file naming — `home.ts` and `learn.ts` lack `.component` suffix. However, the existing `app.ts` in the project also omits it, so this may be an intentional convention.
- **Fix**: Clarify convention; if `app.ts` is the pattern, this is fine. If Angular standard is desired, rename to `home.component.ts`.

- **Severity**: Medium
- **Finding**: `home.ts` uses the deprecated `styleUrl` (singular) property instead of `styleUrls` (plural array) or the newer `styles` option.
- **Fix**: Use `styleUrl: './home.scss'` (singular is valid in Angular v21 standalone) — verify it compiles correctly.

- **Severity**: Low
- **Finding**: LearnComponent uses inline template/styles while HomeComponent uses separate files — inconsistent pattern.
- **Fix**: Acceptable for a placeholder, but document or standardize when the learn page is fleshed out.

- **Severity**: Low
- **Finding**: LearnComponent hardcodes `max-width: 1140px` instead of using theme variable `gt.$max-width`.
- **Fix**: Extract to SCSS file using theme variable, or add TODO comment.

### security-reviewer
No issues found

### performance-reviewer
No issues found

### architect-reviewer
- **Severity**: Medium
- **Finding**: No `i18n` attributes on user-visible text. Design doc mandates Angular i18n from day 1 with NL, DE, EN support.
- **Fix**: Add `i18n` attributes to all user-facing elements (hero tagline, subtitle, feature titles/descriptions, CTA text).

- **Severity**: Medium
- **Finding**: CTA button uses hand-rolled `<a routerLink>` with custom SCSS instead of Taiga UI `tuiButton`. Design doc establishes Taiga UI as the component library.
- **Fix**: Replace with `<a tuiButton appearance="primary" routerLink="/learn">`.

- **Severity**: Low
- **Finding**: `data-testid="feature-item"` duplicated on three siblings — test-smell for future `querySelector` usage.
- **Fix**: Use distinct testids or query by shared class/parent container.

- **Severity**: Low
- **Finding**: LearnComponent hardcodes `max-width: 1140px` instead of using theme variable.
- **Fix**: Extract to SCSS file or add TODO comment.

## Engineer Assessment

### Overall Decision: REFACTOR

### Reasoning per finding

#### codestyle-reviewer — Component file naming lacks `.component` suffix
- **Decision**: Accept
- **Reasoning**: The existing `app.ts` already establishes the convention of omitting the `.component` suffix. This is an intentional project convention, not an oversight. Angular CLI historically generated `.component.ts` but the framework does not require it. The project is consistent: `app.ts`, `home.ts`, `learn.ts` all follow the same pattern. Renaming now would either break the convention or require renaming all files including `app.ts`, which is out of scope for this task.

#### codestyle-reviewer — `styleUrl` (singular) allegedly deprecated
- **Decision**: Accept
- **Reasoning**: This is a false positive. In Angular v17+ standalone components, `styleUrl` (singular string) is a valid and supported property — it is not deprecated. It was introduced specifically as a convenience for components with a single style file. The existing `app.ts` uses the same `styleUrl` pattern and the project compiles. The reviewer's own fix suggestion acknowledges this: "singular is valid in Angular v21 standalone". No change needed.

#### architect-reviewer — No i18n attributes on user-visible text
- **Decision**: Defer
- **Reasoning**: The task list explicitly separates i18n into task 4.3: "Add translations for all visible text on homepage and learn page." The current task (1.2) is specifically about creating the HomeComponent with the hero section. Adding i18n attributes is planned work that belongs in a later task. Adding them now would mix concerns and make the current task harder to review. This is not a missing requirement — it is a sequenced requirement.

#### architect-reviewer — CTA button uses hand-rolled styles instead of Taiga UI `tuiButton`
- **Decision**: Fix
- **Reasoning**: This is a valid finding. The design doc explicitly states "Taiga UI for all UI components" and the system prompt says "use Taiga components before building custom ones." The CTA button is a standard button/link — exactly the kind of element Taiga UI provides out of the box. Using `tuiButton` gives consistent theming (light/dark mode), accessibility, and reduces custom SCSS. The custom gradient styling can be achieved through Taiga's appearance system or a custom appearance. This should be addressed in this task.

#### Low-severity / Nitpick findings
- **LearnComponent inline vs. external files inconsistency** (codestyle-reviewer, Low): Accept. LearnComponent is a minimal placeholder with two lines of template and three lines of style. Inline is appropriate for this size. When the component grows in task 2.2 or later, it will naturally be extracted to separate files.
- **LearnComponent hardcodes `max-width: 1140px`** (codestyle-reviewer + architect-reviewer, Low): Accept for now but worth fixing when LearnComponent is properly implemented in task 2.2. The HomeComponent already correctly uses `gt.$max-width`. Since LearnComponent is a placeholder that will be reworked soon, the inconsistency is short-lived.
- **Duplicate `data-testid="feature-item"`** (architect-reviewer, Low): Accept. The current Playwright tests use `getByTestId('feature-highlights')` to scope to the parent container and then count child elements. The duplicate testid is not causing test fragility. If future tests need to target individual feature items, distinct testids can be added at that point.
