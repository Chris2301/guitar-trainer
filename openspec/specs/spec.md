
### Requirement: Homepage
De applicatie MOET een homepage tonen die bezoekers verwelkomt en uitlegt dat learn2play-guitar.com een gratis, advertentievrije webapp is voor gegamificeerde gitaartheorie en oefeningen.

#### Scenario: Bezoeker opent de homepage
- GIVEN een bezoeker die de applicatie opent
- WHEN de root URL (`/`) wordt geladen
- THEN wordt een hero-sectie getoond met de tagline van de applicatie
- AND worden feature highlights getoond die uitleggen wat de app biedt
- AND is er een call-to-action knop die naar de learn page navigeert

#### Scenario: Bezoeker klikt op call-to-action
- GIVEN een bezoeker op de homepage
- WHEN de bezoeker op de "Start leren" knop klikt
- THEN wordt de bezoeker naar de learn page (`/learn`) genavigeerd

### Requirement: Learn Page
De applicatie MOET een learn page tonen als placeholder voor toekomstige gitaartrainingen.

#### Scenario: Bezoeker opent de learn page
- GIVEN een bezoeker die naar `/learn` navigeert
- WHEN de pagina is geladen
- THEN wordt placeholder content getoond die aangeeft dat trainingen binnenkort beschikbaar zijn

### Requirement: Navigatie
De applicatie MOET een consistente header-navigatie tonen op alle pagina's.

#### Scenario: Navigatie is zichtbaar
- GIVEN een bezoeker op een willekeurige pagina
- WHEN de pagina is geladen
- THEN is een header zichtbaar met links naar Home en Learn, een theme toggle (light/dark) en een taalkeuze (NL, DE, EN)

### Requirement: Dark/Light Theme
De applicatie MOET een light en dark theme ondersteunen, schakelbaar via de UI.

#### Scenario: Theme wisselen
- GIVEN een bezoeker met het light theme actief
- WHEN de bezoeker op de theme toggle klikt
- THEN schakelt de applicatie naar het dark theme
- AND worden alle kleuren en stijlen correct aangepast

### Requirement: Internationalisatie
De applicatie MOET beschikbaar zijn in het Nederlands, Duits en Engels.

#### Scenario: Taal wisselen
- GIVEN een bezoeker met Engels als actieve taal
- WHEN de bezoeker Nederlands selecteert in de taalkeuze
- THEN worden alle zichtbare teksten op de pagina in het Nederlands getoond
