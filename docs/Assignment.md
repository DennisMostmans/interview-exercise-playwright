# Take-home opdracht — SDET bol.com automatisering

Voor deze opdracht vragen we je om zelf een klein testautomatiseringsproject op te zetten tegen de live website van [bol.com](https://www.bol.com).

Het doel is om te laten zien:
- hoe jij een testproject structureert
- hoe jij met Playwright (TypeScript) werkt
- hoe jij best practices toepast in je code en je CI/CD pipeline.  

---

## Belangrijk

- Dit is een oefenopdracht en staat **volledig los van bol.com**.  
- Voer alleen de gevraagde scenario’s uit en respecteer de site:  
  - **geen bestellingen plaatsen**  
  - **geen accounts aanmaken**  
  - **geen persoonlijke data gebruiken**  

---

## Wat verwachten we van jou?

Je zet vanuit nul een **Node.js + Playwright project** op. In dit project automatiseer je **vier scenario’s**:

### 1. Homepage en zoekfunctie

- Open de homepage, sluit of accepteer de cookiebanner.  
- Controleer dat de zoekbalk zichtbaar is.  
- Zoek op bijvoorbeeld **“lego”**.  
- Controleer dat er resultaten verschijnen met **titel en prijs**.  
- Maak een screenshot van de resultatenpagina.  

### 2. Filteren en sorteren

- Pas een filter toe (bijvoorbeeld categorie of prijs).  
- Controleer dat de filter zichtbaar is (chip of breadcrumb).  
- Sorteer resultaten op **laagste prijs**.  
- Controleer dat de eerste drie prijzen correct oplopend zijn.  
- Maak een screenshot van de gesorteerde pagina.  

### 3. Productdetailpagina (PDP)

- Open het eerste zoekresultaat in een nieuwe tab.  
- Controleer dat **titel, prijs, beschikbaarheid en add-to-cart-knop** zichtbaar zijn.  
- **Intercepteer en blokkeer calls** naar cart/checkout zodat er geen echte acties gebeuren.  
- Klik veilig op add-to-cart en controleer dat je op de PDP blijft.  
- Maak screenshots vóór en na de klik.  

### 4. Paginering

- Verzamel de eerste vijf titels op pagina 1.  
- Ga naar pagina 2 en controleer dat de URL dit weerspiegelt.  
- Verzamel nu ook de eerste vijf titels van pagina 2 en controleer dat de titels uniek zijn op pagina 2 tegenover pagina 1.  
- Maak screenshots van beide pagina’s.  

Naast het automatiseren van de 4 gevraagde scenario’s, verwachten we dat je aandacht besteedt aan **hoe** je je oplossing opzet:

### Structuur

- Gebruik een duidelijke en consistente **projectstructuur**.
- Splits je code op in logische delen (bv. pages, helpers, flows).
- Houd tests klein en leesbaar; plaats logica in Page Objects of helpers.

### Codekwaliteit

- Pas het **Page Object Model (POM)** toe.
- Vermijd duplicatie door **herbruikbare functies** te maken.
- Gebruik **robuuste selectors** (bv. rol-gebaseerd).
- Naming conventions (tests, pages, helpers). 
- Andere optimalisaties? Noteer ze in de [docs/README.md](./README.md)  

---

## Oplevering

De repo bevat:
- De code (**tests, pages, helpers**)  
- `README.md` met installatie- en run-instructies [docs/README.md](./README.md)  
- `strategy.md` waarin je kort uitlegt hoe je de tests hebt opgezet, welke risico’s je zag, en hoe je flaky tests vermeden hebt  [docs/strategy.md](./strategy.md)  

Daarnaast configureer je een **CI/CD pipeline** (bijv. GitHub Actions) die:  
- Dependencies installeert  
- Playwright installeert  
- De tests uitvoert  
- Het **HTML-rapport en screenshots** als artifact publiceert  
- Gebruikt maakt van environment variabelen

Note: het is voldoende om een .yml te maken die interactie kan maken met een pipeline naar keuze.

---

## Checklist

Duid hieronder aan wat je hebt afgerond:

### Structuur & Setup

- [x] Fork deze repository
- [x] Project opgezet en Playwright geïnstalleerd
- [x] Page Object Model toegepast
- [x] Helpers / utilities toegevoegd waar nodig
- [x] Duidelijke projectstructuur gebruikt

### Scenario’s

- [x] Homepage & zoekfunctie geautomatiseerd
- [x] Filteren & sorteren geautomatiseerd
- [x] Productdetailpagina (PDP) geautomatiseerd
- [x] Paginering geautomatiseerd

### Best Practices

- [x] Robuuste selectors gebruikt
- [x] `expect` assertions toegepast
- [x] Screenshots toegevoegd
- [x] HTML-rapportage aanwezig
- [x] Stabiele tests (bv. geen `page.waitForTimeout(1_000)`)

### Documentatie

- [x] README.md met installatie- en run-instructies
- [x] strategy.md met uitleg aanpak, risico’s & flaky test preventie

### CI/CD

- [x] Pipeline ingesteld (GitHub Actions / GitLab CI / Bitbucket Pipelines)
- [x] Tests draaien automatisch in CI
- [x] HTML-rapport en screenshots worden als artifact gepubliceerd

### Oplevering

- [x] Bezorg ons een link en toegang naar jouw repository 
- [x] Zorg dat docs/Strategy.md leesbaar is 
- [x] Indien je niet verder geraakt zorg dat docs/README.md de reden bevat onder een extra topic 'Additionele informatie'