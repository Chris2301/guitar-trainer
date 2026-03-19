# Delta for UI

## ADDED Requirements

### Requirement: Homepage
The application MUST show a homepage that welcomes visitors and explains that learn2play-guitar.com is a free, ad-free web app for gamified guitar theory and exercises.

#### Scenario: Visitor opens the homepage
- GIVEN a visitor opens the application
- WHEN the root URL (`/`) is loaded
- THEN a hero section is shown with the application's tagline
- AND feature highlights are shown explaining what the app offers
- AND there is a call-to-action button that navigates to the learn page

#### Scenario: Visitor clicks on call-to-action
- GIVEN a visitor on the homepage
- WHEN the visitor clicks the "Start learning" button
- THEN the visitor is navigated to the learn page (`/learn`)

### Requirement: Learn Page
The application MUST show a learn page as a placeholder for future guitar training exercises.

#### Scenario: Visitor opens the learn page
- GIVEN a visitor navigates to `/learn`
- WHEN the page has loaded
- THEN placeholder content is shown indicating that training exercises will be available soon

### Requirement: Navigation
The application MUST show consistent header navigation on all pages.

#### Scenario: Navigation is visible
- GIVEN a visitor on any page
- WHEN the page has loaded
- THEN a header is visible with links to Home and Learn, a theme toggle (light/dark) and a language selector (NL, DE, EN)

### Requirement: Dark/Light Theme
The application MUST support a light and dark theme, switchable via the UI.

#### Scenario: Theme switching
- GIVEN a visitor with the light theme active
- WHEN the visitor clicks the theme toggle
- THEN the application switches to the dark theme
- AND all colors and styles are correctly adjusted

### Requirement: Internationalization
The application MUST be available in Dutch, German and English.

#### Scenario: Language switching
- GIVEN a visitor with English as the active language
- WHEN the visitor selects Dutch in the language selector
- THEN all visible text on the page is shown in Dutch
