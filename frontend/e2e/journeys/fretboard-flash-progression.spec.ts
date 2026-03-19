import { test, expect } from '@playwright/test';

/**
 * Open string notes (fret 0): E, A, D, G, B, E (6 notes, 5 unique names).
 * Fret 1 natural notes: F (string 1, high E + 1 semitone) and C (string 2, B + 1 semitone).
 *
 * F and C never appear on open strings, so seeing either in the note display
 * proves the pool has expanded beyond fret 0.
 */
const FRET_1_ONLY_NOTES = new Set(['F', 'C']);

test.describe('Fretboard Flash progression: pool expands after all open notes are shown', () => {
  test('should start at fret 0 and expand to fret 1 after cycling through open notes', async ({ page }) => {
    // Use fake timers to fast-forward through the 5s note + 3s answer cycle
    await page.clock.install();

    await page.goto('/learn/fretboard-flash');
    await expect(page.getByTestId('fretboard-flash-page')).toBeVisible();

    const currentFretDisplay = page.getByTestId('current-fret');

    // Start the game
    await page.getByTestId('start-button').click();

    // Game starts with open strings only (fret 0)
    await expect(currentFretDisplay).toHaveText('0');

    // Fast-forward through enough cycles for all 6 open notes to be drawn randomly.
    // Coupon collector problem: expected ~14.7 draws for 6 items; 60 cycles gives
    // near-certain coverage even with unlucky random draws.
    let expandedToFret1 = false;

    for (let cycle = 0; cycle < 60; cycle++) {
      const noteDisplay = page.getByTestId('note-display');
      await expect(noteDisplay).toBeVisible();
      const noteName = (await noteDisplay.textContent())!.trim();

      // F or C only exist from fret 1 onward, so seeing one proves expansion
      if (FRET_1_ONLY_NOTES.has(noteName)) {
        expandedToFret1 = true;
        break;
      }

      // Advance through SHOW_NOTE (5s) then SHOW_ANSWER (3s) to reach next cycle
      await page.clock.fastForward(5000);
      await page.clock.fastForward(3000);
    }

    // Verify the pool expanded: the fret indicator must have moved past 0
    const finalFret = parseInt((await currentFretDisplay.textContent())!.trim(), 10);
    expect(finalFret).toBeGreaterThanOrEqual(1);

    // At least one fret-1-only note (F or C) should have appeared, confirming
    // the progression system added higher-fret notes to the pool
    expect(expandedToFret1).toBe(true);
  });
});
