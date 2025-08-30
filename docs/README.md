# Installatie en uitvoeren

Korte uitleg hoe je dit Playwright + TypeScript project lokaal draait.

Vereisten
- Node.js LTS (18+)
- Git (optioneel)

Installatie
1. Dependencies installeren:
   - npm install
2. Playwright browsers installeren:
   - npx playwright install

Tests uitvoeren
- Alle tests (headless):
  - npx playwright test
- UI-modus (debuggen):
  - npx playwright test --ui
- Headed (chromium):
  - npx playwright test --headed --project=chromium
- Enkel één spec of grep:
  - npx playwright test tests/scenarios/Pagination.spec.ts
  - npx playwright test -g "compare first 5 titles"
- Rapport openen:
  - npx playwright show-report

Handig (Windows PowerShell)
- BASE_URL instellen:
  - $env:BASE_URL = 'https://www.bol.com/be/nl/'; npx playwright test
- Trager/voorzichtig draaien (1 worker):
  - npx playwright test --workers=