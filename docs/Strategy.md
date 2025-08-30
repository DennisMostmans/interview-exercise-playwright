Hier leg ik kort uit hoe de tests zijn opgezet, welke risico’s ik zag, en hoe ik flaky tests heb vermeden.

Opzet
- Stack: Playwright + TypeScript met Page Object Model (POM).
- Structuur:
  - Pages: src/pages (homepage.ts, search-results-page.ts, product-detail-page.ts).
  - Components: src/components (language-popup.ts, cookie-banner.ts, search-component.ts, pagination.ts, filters.ts, sort-dropdown.ts).
  - Helpers: src/helpers (Prices.ts, screenshot-helper.ts).
  - Tests: tests/scenarios/*.spec.ts.
- Werkwijze:
  - test.beforeEach: Homepage.goto() navigeert, accepteert cookies en handelt de taal/land pop-up af.
  - Zoeken: SearchComponent.search() vult de input en dient in.
  - Resultaten: SearchResultsPage.verifySearchResults() controleert zichtbaarheid en (optioneel) de zoekterm.
  - Paginatie: Pagination haalt titels op, navigeert naar “Volgende”, maakt screenshots (page1 vóór, page2 na navigatie) en vergelijkt.

Belangrijkste risico’s
- Overlays/animaties blokkeren interacties (land/taal-modal).
- Header “re-render” zonder navigatie wist soms de zoekinput.
- Gesponsorde advertenties bovenaan veroorzaken verschillen in vergelijkingen.
- Anti-bot/ratelimiting bij te snelle/parallelle acties.
- Niet-deterministische prijsweergave/formatting.
- CI-public runners worden door bol.com-IP’s geblokkeerd.

Flaky-tests voorkomen (maatregelen)
- Overlays: centrale wachtconditie op .modal__overlay:visible → 0 voordat we de header (zoekveld/knop) gebruiken.
- Zoeken: input vullen + expect(toHaveValue). Net vóór submit hercontrole (inputValue), indien leeg nog één keer vullen en direct Enter gebruiken (stabieler dan klikken).
- Paginatie: screenshot “page1” vóór navigatie; klik “Volgende”; wacht op URL én content change (eerste titel zonder ('gesponsord') wijzigt) vóór “page2”-screenshot.
- Gesponsord filteren: bij het verzamelen van titels “Gesponsord” artikels overslaan.
- Anti-bot: 1 worker in CI, web-first assertions i.p.v. sleeps, geen onnodige parallelle requests.
- CI: self-hosted runner met lokaal IP; BASE_URL via env.
- Intercepts: kritieke routes niet aborten; indien nodig fulfillen met realistische stub om white pages te vermijden.
- Locators en asserts: bij voorkeur getByTestId/getByRole en web-first matchers (toBeVisible, toHaveURL, toHaveText). Geen harde timeouts.

Ervaringen/problemen en oplossingen
- Prijs testen: moeilijk om prijs te parsen en stabiliseren. Oplossing: normaliseren in Prices.ts, valuta/whitespace strippen, scheidingstekens consistent maken, waar mogelijk met “cents” als integer werken; assert op range i.p.v. exacte waarde.
- Pop-up land/taal: kwam meermaals terug, blokkeerde de zoekknop. Oplossing: test opent/handelt de modal vroeg op de homepage en wacht tot .modal__overlay weg is.
- Gesponsorde advertenties: verstoorden page1 vs page2-vergelijking. Oplossing: gesponsorde items detecteren en uitsluiten vóór titelvergelijking.
- “Rustig aan speedracer”: bol.com blokkeert bij te snelle/parallelle acties. Oplossing: 1 worker, aangepaste user agents en headers.
- bol.com blokkeert publieke CI-runners: lokale/self-hosted runner gebruikt met schema.
- Add-to-cart intercept → white page: lokaal wordt de request geintercept en geblokkeerd wat een error pop up veroorzaakt op de PDP zoals verwacht, op de CI/CD krijgen we een whitepage na de click, wat zorgt voor een false negative.

Uitvoering 
- Installeren en draaien: 
  - `npm install`
  - `npx playwright install`
  - `npx playwright test`
- Debug:
  - `npx playwright test --ui`
  - `npx playwright show-report`