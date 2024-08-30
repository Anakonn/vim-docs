---
description: 'Leer hoe je de visuele modus in Vim gebruikt om tekst efficiënt te manipuleren
  met drie verschillende modi: karakter-, regel- en blokgewijs.'
title: Ch11. Visual Mode
---

Het markeren en aanbrengen van wijzigingen in een tekst is een veelvoorkomende functie in veel tekstverwerkers en teksteditors. Vim kan dit doen met behulp van de visuele modus. In dit hoofdstuk leer je hoe je de visuele modus kunt gebruiken om teksten efficiënt te manipuleren.

## De Drie Soorten Visuele Modus

Vim heeft drie verschillende visuele modi. Ze zijn:

```shell
v         Karaktergewijze visuele modus
V         Regelgewijze visuele modus
Ctrl-V    Blokgewijze visuele modus
```

Als je de tekst hebt:

```shell
een
twee
drie
```

Werkt de karaktergewijze visuele modus met individuele karakters. Druk op `v` op het eerste karakter. Ga dan naar beneden naar de volgende regel met `j`. Het markeert alle teksten van "een" tot aan de locatie van je cursor. Als je `gU` drukt, maakt Vim de gemarkeerde karakters hoofdletters.

De regelgewijze visuele modus werkt met regels. Druk op `V` en kijk hoe Vim de hele regel selecteert waarop je cursor zich bevindt. Net als bij de karaktergewijze visuele modus, als je `gU` uitvoert, maakt Vim de gemarkeerde karakters hoofdletters.

De blokgewijze visuele modus werkt met rijen en kolommen. Het geeft je meer bewegingsvrijheid dan de andere twee modi. Als je `Ctrl-V` drukt, markeert Vim het karakter onder de cursor, net als de karaktergewijze visuele modus, behalve dat het in plaats van elk karakter te markeren tot het einde van de regel voordat het naar de volgende regel gaat, het naar de volgende regel gaat met minimale markering. Probeer rond te bewegen met `h/j/k/l` en kijk hoe de cursor beweegt.

Linksonder in je Vim-venster zie je ofwel `-- VISUAL --`, `-- VISUAL LINE --`, of `-- VISUAL BLOCK --` weergegeven om aan te geven in welke visuele modus je je bevindt.

Terwijl je in een visuele modus bent, kun je naar een andere visuele modus schakelen door op `v`, `V` of `Ctrl-V` te drukken. Bijvoorbeeld, als je in de regelgewijze visuele modus bent en je wilt overschakelen naar de blokgewijze visuele modus, voer dan `Ctrl-V` uit. Probeer het!

Er zijn drie manieren om de visuele modus te verlaten: `<Esc>`, `Ctrl-C`, en dezelfde toets als je huidige visuele modus. Wat de laatste betekent is dat als je momenteel in de regelgewijze visuele modus (`V`) bent, je deze kunt verlaten door opnieuw op `V` te drukken. Als je in de karaktergewijze visuele modus bent, kun je deze verlaten door op `v` te drukken.

Er is eigenlijk nog een manier om de visuele modus in te voeren:

```shell
gv    Ga naar de vorige visuele modus
```

Het start dezelfde visuele modus op hetzelfde gemarkeerde tekstblok als de laatste keer.

## Navigatie in de Visuele Modus

Terwijl je in een visuele modus bent, kun je het gemarkeerde tekstblok uitbreiden met Vim-bewegingen.

Laten we dezelfde tekst gebruiken die je eerder gebruikte:

```shell
een
twee
drie
```

Deze keer beginnen we vanaf de regel "twee". Druk op `v` om naar de karaktergewijze visuele modus te gaan (hier vertegenwoordigen de vierkante haken `[]` de karaktermarkeringen):

```shell
een
[t]wee
drie
```

Druk op `j` en Vim zal alle tekst van de regel "twee" naar het eerste karakter van de regel "drie" markeren.

```shell
een
[twee
t]rie
```

Stel dat je vanuit deze positie ook de regel "een" wilt toevoegen. Als je `k` drukt, verplaatst de markering zich tot je teleurstelling weg van de regel "drie".

```shell
een
[t]wee
drie
```

Is er een manier om de visuele selectie vrij uit te breiden om in elke gewenste richting te bewegen? Zeker. Laten we een beetje teruggaan naar waar je de regel "twee" en "drie" hebt gemarkeerd.

```shell
een
[twee
t]rie    <-- cursor
```

De visuele markering volgt de cursorbeweging. Als je het omhoog wilt uitbreiden naar de regel "een", moet je de cursor omhoog bewegen naar de regel "twee". Op dit moment bevindt de cursor zich op de regel "drie". Je kunt de cursorlocatie omwisselen met `o` of `O`.

```shell
een
[twee     <-- cursor
t]rie
```

Nu, wanneer je `k` drukt, vermindert het de selectie niet meer, maar breidt het deze omhoog uit.

```shell
[een
twee
t]rie
```

Met `o` of `O` in de visuele modus springt de cursor van het begin naar het einde van het gemarkeerde blok, waardoor je het gemarkeerde gebied kunt uitbreiden.

## Grammatica van de Visuele Modus

De visuele modus deelt veel bewerkingen met de normale modus.

Bijvoorbeeld, als je de volgende tekst hebt en je wilt de eerste twee regels vanuit de visuele modus verwijderen:

```shell
een
twee
drie
```

Markeer de regels "een" en "twee" met de regelgewijze visuele modus (`V`):

```shell
[een
twee]
drie
```

Drukken op `d` verwijdert de selectie, vergelijkbaar met de normale modus. Merk op dat de grammaticaregel van de normale modus, werkwoord + zelfstandig naamwoord, niet van toepassing is. Hetzelfde werkwoord is er nog steeds (`d`), maar er is geen zelfstandig naamwoord in de visuele modus. De grammaticaregel in de visuele modus is zelfstandig naamwoord + werkwoord, waarbij het zelfstandig naamwoord de gemarkeerde tekst is. Selecteer eerst het tekstblok, dan volgt de opdracht.

In de normale modus zijn er enkele opdrachten die geen beweging vereisen, zoals `x` om een enkel karakter onder de cursor te verwijderen en `r` om het karakter onder de cursor te vervangen (`rx` vervangt het karakter onder de cursor door "x"). In de visuele modus worden deze opdrachten nu toegepast op de gehele gemarkeerde tekst in plaats van op een enkel karakter. Terug bij de gemarkeerde tekst:

```shell
[een
twee]
drie
```

Het uitvoeren van `x` verwijdert alle gemarkeerde teksten.

Je kunt dit gedrag gebruiken om snel een koptekst in markdown-tekst te maken. Stel dat je de volgende tekst snel wilt omzetten in een eerste-niveau markdown-koptekst ("==="):

```shell
Hoofdstuk Eén
```

Kopieer eerst de tekst met `yy`, plak het dan met `p`:

```shell
Hoofdstuk Eén
Hoofdstuk Eén
```

Ga nu naar de tweede regel en selecteer deze met de regelgewijze visuele modus:

```shell
Hoofdstuk Eén
[Hoofdstuk Eén]
```

Een eerste-niveau koptekst is een reeks "=" onder een tekst. Voer `r=` uit, voila! Dit bespaart je het handmatig typen van "=".

```shell
Hoofdstuk Eén
===========
```

Om meer te leren over operators in de visuele modus, kijk naar `:h visual-operators`.

## Visuele Modus en Opdrachten van de Opdrachtregel

Je kunt selectief opdrachten van de opdrachtregel toepassen op een gemarkeerd tekstblok. Als je deze uitspraken hebt en je wilt "const" vervangen door "let" alleen op de eerste twee regels:

```shell
const een = "een";
const twee = "twee";
const drie = "drie";
```

Markeer de eerste twee regels met *eender welke* visuele modus en voer de vervangopdracht `:s/const/let/g` uit:

```shell
let een = "een";
let twee = "twee";
const drie = "drie";
```

Merk op dat ik zei dat je dit kunt doen met *eender welke* visuele modus. Je hoeft de hele regel niet te markeren om de opdracht op die regel uit te voeren. Zolang je ten minste één karakter op elke regel selecteert, wordt de opdracht toegepast.

## Tekst Toevoegen op Meerdere Regels

Je kunt tekst op meerdere regels in Vim toevoegen met de blokgewijze visuele modus. Als je een puntkomma aan het einde van elke regel wilt toevoegen:

```shell
const een = "een"
const twee = "twee"
const drie = "drie"
```

Met je cursor op de eerste regel:
- Voer de blokgewijze visuele modus uit en ga naar beneden over twee regels (`Ctrl-V jj`).
- Markeer tot het einde van de regel (`$`).
- Voeg toe (`A`) en typ ";".
- Verlaat de visuele modus (`<Esc>`).

Je zou nu de toegevoegde ";" op elke regel moeten zien. Best cool! Er zijn twee manieren om de invoegmodus vanuit de blokgewijze visuele modus in te voeren: `A` om de tekst na de cursor in te voeren of `I` om de tekst voor de cursor in te voeren. Verwar ze niet met `A` (voeg tekst aan het einde van de regel toe) en `I` (voeg tekst voor de eerste niet-lege regel in) vanuit de normale modus.

Alternatief kun je ook het `:normal` commando gebruiken om tekst op meerdere regels toe te voegen:
- Markeer alle 3 regels (`vjj`).
- Typ `:normal! A;`.

Vergeet niet dat het `:normal` commando normale moduscommando's uitvoert. Je kunt het instrueren om `A;` uit te voeren om tekst ";" aan het einde van de regel toe te voegen.

## Getallen Incrementeer

Vim heeft de commando's `Ctrl-X` en `Ctrl-A` om getallen te verlagen en te verhogen. Wanneer ze worden gebruikt met de visuele modus, kun je getallen over meerdere regels verhogen.

Als je deze HTML-elementen hebt:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

Het is een slechte praktijk om meerdere id's met dezelfde naam te hebben, dus laten we ze verhogen om ze uniek te maken:
- Verplaats je cursor naar de "1" op de tweede regel.
- Start de blokgewijze visuele modus en ga naar beneden over 3 regels (`Ctrl-V 3j`). Dit markeert de resterende "1"s. Nu zouden alle "1" gemarkeerd moeten zijn (behalve de eerste regel).
- Voer `g Ctrl-A` uit.

Je zou dit resultaat moeten zien:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` verhoogt getallen over meerdere regels. `Ctrl-X/Ctrl-A` kan ook letters verhogen, met de optie voor nummerformaten:

```shell
set nrformats+=alpha
```

De optie `nrformats` instrueert Vim welke bases als "getallen" worden beschouwd voor `Ctrl-A` en `Ctrl-X` om te verhogen en te verlagen. Door `alpha` toe te voegen, wordt een alfabetisch teken nu als een getal beschouwd. Als je de volgende HTML-elementen hebt:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Plaats je cursor op de tweede "app-a". Gebruik dezelfde techniek als hierboven (`Ctrl-V 3j` en dan `g Ctrl-A`) om de id's te verhogen.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## De Laatste Visuele Modus Gebied Selecteren

Eerder in dit hoofdstuk heb ik vermeld dat `gv` snel de laatste visuele modus markering kan markeren. Je kunt ook naar de locatie van het begin en het einde van de laatste visuele modus gaan met deze twee speciale markeringen:

```shell
`<    Ga naar de eerste plaats van de vorige visuele modus markering
`>    Ga naar de laatste plaats van de vorige visuele modus markering
```

Eerder heb ik ook vermeld dat je selectief opdrachten van de opdrachtregel kunt uitvoeren op een gemarkeerde tekst, zoals `:s/const/let/g`. Wanneer je dat deed, zou je dit hieronder zien:

```shell
:`<,`>s/const/let/g
```

Je voerde eigenlijk een *bereik* `s/const/let/g` opdracht uit (met de twee markeringen als adressen). Interessant!

Je kunt deze markeringen altijd bewerken wanneer je maar wilt. Als je in plaats daarvan van het begin van de gemarkeerde tekst tot het einde van het bestand wilt vervangen, wijzig je gewoon de opdracht in:

```shell
:`<,$s/const/let/g
```

## De Visuele Modus Invoeren Vanuit de Invoegmodus

Je kunt ook de visuele modus vanuit de invoegmodus invoeren. Om naar de karaktergewijze visuele modus te gaan terwijl je in de invoegmodus bent:

```shell
Ctrl-O v
```

Vergeet niet dat het uitvoeren van `Ctrl-O` terwijl je in de invoegmodus bent je in staat stelt om een normaal moduscommando uit te voeren. Terwijl je in deze normale-modus-commando-in-afwachting modus bent, voer je `v` uit om naar de karaktergewijze visuele modus te gaan. Merk op dat linksonder op het scherm staat `--(invoeg) VISUAL--`. Deze truc werkt met elke visuele modusoperator: `v`, `V`, en `Ctrl-V`.

## Select Modus

Vim heeft een modus die lijkt op de visuele modus, genaamd de select modus. Net als de visuele modus heeft het ook drie verschillende modi:

```shell
gh         Karaktergewijze select modus
gH         Regelgewijze select modus
gCtrl-h    Blokgewijze select modus
```

Select modus emuleert het tekstmarkeren gedrag van een reguliere editor dichterbij dan de visuele modus van Vim.

In een reguliere editor, nadat je een tekstblok hebt gemarkeerd en een letter typt, laten we zeggen de letter "y", zal het de gemarkeerde tekst verwijderen en de letter "y" invoegen. Als je een regel markeert met de regelgewijze select modus (`gH`) en "y" typt, zal het de gemarkeerde tekst verwijderen en de letter "y" invoegen.

Vergelijk deze select modus met de visuele modus: als je een regel tekst markeert met de regelgewijze visuele modus (`V`) en "y" typt, zal de gemarkeerde tekst niet worden verwijderd en vervangen door de letter "y", het zal worden gekopieerd. Je kunt geen normale moduscommando's uitvoeren op gemarkeerde tekst in de select modus.

Persoonlijk heb ik select modus nooit gebruikt, maar het is goed om te weten dat het bestaat.

## Leer Visuele Modus op de Slimme Manier

De visuele modus is de representatie van Vim van de tekstmarkeerprocedure.

Als je merkt dat je de visuele modusoperatie veel vaker gebruikt dan normale modusoperaties, wees dan voorzichtig. Dit is een anti-patroon. Het kost meer toetsaanslagen om een visuele modusoperatie uit te voeren dan de tegenhanger in de normale modus. Bijvoorbeeld, als je een binnenwoord wilt verwijderen, waarom vier toetsaanslagen gebruiken, `viwd` (visueel een binnenwoord markeren en dan verwijderen), als je het met slechts drie toetsaanslagen (`diw`) kunt bereiken? De laatste is directer en beknopter. Natuurlijk zijn er momenten waarop visuele modi geschikt zijn, maar over het algemeen, geef de voorkeur aan een meer directe benadering.