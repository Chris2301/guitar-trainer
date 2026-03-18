# Delta for UI

## ADDED Requirements

### Requirement: Fretboard Flash Game Page
The system MUST provide a flashcard-style game at `/learn/fretboard-flash` where users learn note positions on the guitar fretboard.

#### Scenario: Game page loads
- GIVEN a user navigates to `/learn/fretboard-flash`
- WHEN the page loads
- THEN a note letter MUST be displayed prominently in the center of the screen
- AND the fretboard image MUST NOT yet show any note position

#### Scenario: Note display phase
- GIVEN the game is running
- WHEN a new note is presented
- THEN the note letter (e.g. "E", "A", "G") MUST be shown for 5 seconds
- AND a countdown or visual indicator SHOULD show the remaining time

#### Scenario: Answer display phase
- GIVEN the note display phase has ended (5 seconds elapsed)
- WHEN the answer phase begins
- THEN the fretboard image MUST be shown with a dot at the correct x/y position of the note
- AND the note letter MUST remain visible
- AND the answer MUST be displayed for 3 seconds before advancing

#### Scenario: Automatic progression to next note
- GIVEN the answer display phase has ended (3 seconds elapsed)
- WHEN the next round begins
- THEN a new random note from the current pool MUST be selected
- AND the note display phase MUST restart

### Requirement: Fretboard Visualization
The system MUST display a guitar fretboard as a background image with note overlays.

#### Scenario: Fretboard orientation
- GIVEN the fretboard is displayed
- THEN it MUST be oriented vertically with fret 1 on the left
- AND strings MUST be ordered E A D G B E from bottom to top (low E at bottom)
- AND frets 1 through 15 MUST be visible

#### Scenario: Note position indicator
- GIVEN a note answer is being shown
- WHEN the note position is displayed on the fretboard
- THEN a dot/marker MUST be placed at the correct x/y coordinate on the fretboard image
- AND the marker MUST be clearly visible against the fretboard background

### Requirement: Progressive Note Pool
The system MUST progressively expand the pool of notes asked during a session.

#### Scenario: Initial pool — open strings
- GIVEN the game starts
- THEN the note pool MUST contain only the 6 open string notes (E, A, D, G, B, E)
- AND notes MUST be selected randomly from this pool

#### Scenario: Pool expansion
- GIVEN all notes in the current pool have been presented
- WHEN the pool expands
- THEN natural notes (C D E F G A B) from the next fret MUST be added to the pool
- AND previously learned notes MUST remain in the pool
- AND notes MUST continue to be selected randomly, including earlier notes

#### Scenario: Maximum pool
- GIVEN the pool has expanded through all frets
- THEN the pool MUST contain natural notes from open strings through fret 15

### Requirement: Learn Page Navigation
The Learn page MUST provide access to the Fretboard Flash game.

#### Scenario: Navigate to Fretboard Flash
- GIVEN a user is on the Learn page (`/learn`)
- WHEN the user clicks the "Fretboard Flash" button/card
- THEN the user MUST be navigated to `/learn/fretboard-flash`

### Requirement: i18n and Theming Support
The Fretboard Flash game MUST support internationalization and theming.

#### Scenario: Language support
- GIVEN the game is displayed
- THEN all UI text (labels, buttons) MUST be available in NL, DE, and EN

#### Scenario: Theme support
- GIVEN the user has selected a theme (light or dark)
- THEN the game page MUST render correctly in both light and dark mode
