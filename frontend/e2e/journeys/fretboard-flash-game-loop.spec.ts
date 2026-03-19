import { test, expect } from '@playwright/test';

const VALID_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

test.describe('Fretboard Flash game loop: note appears, answer shown on fretboard, next note', () => {
  test('should cycle through SHOW_NOTE, SHOW_ANSWER, and advance to the next note', async ({ page }) => {
    // Navigate to the Fretboard Flash game page
    await page.goto('/learn/fretboard-flash');
    const gamePage = page.getByTestId('fretboard-flash-page');
    await expect(gamePage).toBeVisible();

    // The game starts in IDLE state: Start button visible, no note displayed, no marker
    const startButton = page.getByTestId('start-button');
    await expect(startButton).toBeVisible();
    await expect(page.getByTestId('note-display')).not.toBeVisible();
    await expect(page.getByTestId('note-marker')).not.toBeVisible();

    // --- Step 1: Start the game ---
    await startButton.click();

    // SHOW_NOTE state: note letter appears, start button is replaced by stop button
    const noteDisplay = page.getByTestId('note-display');
    await expect(noteDisplay).toBeVisible();
    await expect(page.getByTestId('stop-button')).toBeVisible();

    // The displayed note must be a valid natural note
    const firstNote = (await noteDisplay.textContent())!.trim();
    expect(VALID_NOTES).toContain(firstNote);

    // During SHOW_NOTE, the fretboard marker should NOT be visible yet
    await expect(page.getByTestId('note-marker')).not.toBeVisible();

    // --- Step 2: Wait for SHOW_ANSWER state (after ~5 seconds) ---
    // The note marker appears on the fretboard when the answer is shown
    const noteMarker = page.getByTestId('note-marker');
    await expect(noteMarker).toBeVisible({ timeout: 7000 });

    // The note letter should still be displayed during SHOW_ANSWER
    await expect(noteDisplay).toBeVisible();
    const noteStillShown = (await noteDisplay.textContent())!.trim();
    expect(noteStillShown).toBe(firstNote);

    // --- Step 3: Wait for next note (after ~3 more seconds, the cycle advances) ---
    // The marker should disappear as we transition back to SHOW_NOTE with a new note
    await expect(noteMarker).not.toBeVisible({ timeout: 5000 });

    // A note letter should still be displayed (the next note in the cycle)
    await expect(noteDisplay).toBeVisible();

    // The game is still running: stop button should remain visible
    await expect(page.getByTestId('stop-button')).toBeVisible();
  });
});
