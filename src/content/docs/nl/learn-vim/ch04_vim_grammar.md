---
description: Deze gids helpt je de basisstructuur van Vim-commando's te begrijpen,
  zodat je de 'Vim-taal' kunt leren en effectief kunt communiceren met Vim.
title: Ch04. Vim Grammar
---

Het is gemakkelijk om geïntimideerd te raken door de complexiteit van Vim-commando's. Als je een Vim-gebruiker `gUfV` of `1GdG` ziet doen, weet je misschien niet meteen wat deze commando's doen. In dit hoofdstuk zal ik de algemene structuur van Vim-commando's opsplitsen in een eenvoudige grammaticaregel.

Dit is het belangrijkste hoofdstuk in de hele gids. Zodra je de onderliggende grammaticale structuur begrijpt, kun je "spreken" met Vim. Trouwens, wanneer ik in dit hoofdstuk *Vim-taal* zeg, heb ik het niet over de Vimscript-taal (de ingebouwde programmeertaal van Vim, die je in latere hoofdstukken zult leren).

## Hoe een Taal te Leren

Ik ben geen native Engelse spreker. Ik leerde Engels toen ik 13 was en naar de VS verhuisde. Er zijn drie dingen die je moet doen om een nieuwe taal te leren spreken:

1. Leer grammaticaregels.
2. Vergroot je vocabulaire.
3. Oefen, oefen, oefen.

Evenzo, om de Vim-taal te spreken, moet je de grammaticaregels leren, je vocabulaire vergroten en oefenen totdat je de commando's kunt uitvoeren zonder na te denken.

## Grammaticaregel

Er is maar één grammaticaregel in de Vim-taal:

```shell
werkwoord + zelfstandig naamwoord
```

Dat is het!

Dit is als het zeggen van deze Engelse zinnen:

- *"Eet (werkwoord) een donut (zelfstandig naamwoord)"*
- *"Trap (werkwoord) een bal (zelfstandig naamwoord)"*
- *"Leer (werkwoord) de Vim-editor (zelfstandig naamwoord)"*

Nu moet je je vocabulaire opbouwen met basis Vim-werkwoorden en -zelfstandige naamwoorden.

## Zelfstandige Naamwoorden (Bewegingen)

Zelfstandige naamwoorden zijn Vim-bewegingen. Bewegingen worden gebruikt om je in Vim te verplaatsen. Hieronder staat een lijst van enkele Vim-bewegingen:

```shell
h    Links
j    Beneden
k    Boven
l    Rechts
w    Vooruit bewegen naar het begin van het volgende woord
}    Spring naar de volgende alinea
$    Ga naar het einde van de regel
```

Je leert meer over bewegingen in het volgende hoofdstuk, dus maak je niet te veel zorgen als je sommige ervan niet begrijpt.

## Werkwoorden (Operatoren)

Volgens `:h operator` heeft Vim 16 operatoren. Echter, uit mijn ervaring is het leren van deze 3 operatoren voldoende voor 80% van mijn bewerkingsbehoeften:

```shell
y    Yank tekst (kopiëren)
d    Verwijder tekst en sla op in register
c    Verwijder tekst, sla op in register en start de invoegmodus
```

Trouwens, nadat je een tekst hebt gekopieerd, kun je deze plakken met `p` (na de cursor) of `P` (voor de cursor).

## Werkwoord en Zelfstandig Naamwoord

Nu je de basis zelfstandige naamwoorden en werkwoorden kent, laten we de grammaticaregel toepassen, werkwoord + zelfstandig naamwoord! Stel dat je deze expressie hebt:

```javascript
const learn = "vim";
```

- Om alles van je huidige locatie naar het einde van de regel te kopiëren: `y$`.
- Om van je huidige locatie naar het begin van het volgende woord te verwijderen: `dw`.
- Om van je huidige locatie naar het einde van de huidige alinea te veranderen, zeg `c}`.

Bewegingen accepteren ook een telnummer als argumenten (hierover zal ik in het volgende hoofdstuk praten). Als je 3 regels omhoog moet, in plaats van 3 keer `k` te drukken, kun je `3k` doen. Tel werkt met de Vim-grammatica.
- Om twee tekens naar links te kopiëren: `y2h`.
- Om de volgende twee woorden te verwijderen: `d2w`.
- Om de volgende twee regels te veranderen: `c2j`.

Op dit moment moet je misschien lang en hard nadenken om zelfs een eenvoudig commando uit te voeren. Je bent niet alleen. Toen ik begon, had ik vergelijkbare worstelingen, maar ik werd na verloop van tijd sneller. Dat zul jij ook. Herhaling, herhaling, herhaling.

Als een zijopmerking, lijngewijze bewerkingen (bewerkingen die de hele regel beïnvloeden) zijn gebruikelijke bewerkingen in tekstbewerking. Over het algemeen, door een operatorcommando twee keer in te voeren, voert Vim een lijngewijze bewerking uit voor die actie. Bijvoorbeeld, `dd`, `yy` en `cc` voeren **verwijdering**, **kopiëren** en **verandering** uit op de hele regel. Probeer dit met andere operatoren!

Dit is echt cool. Ik zie hier een patroon. Maar ik ben nog niet klaar. Vim heeft nog een type zelfstandig naamwoord: tekstobjecten.

## Meer Zelfstandige Naamwoorden (Tekstobjecten)

Stel je voor dat je ergens binnen een paar haakjes bent, zoals `(hello Vim)`, en je moet de hele zin binnen de haakjes verwijderen. Hoe kun je dit snel doen? Is er een manier om de "groep" waar je in zit te verwijderen?

Het antwoord is ja. Teksten komen vaak gestructureerd. Ze bevatten vaak haakjes, aanhalingstekens, haken, accolades en meer. Vim heeft een manier om deze structuur vast te leggen met tekstobjecten.

Tekstobjecten worden gebruikt met operatoren. Er zijn twee soorten tekstobjecten: binnenste en buitenste tekstobjecten.

```shell
i + object    Binnenste tekstobject
a + object    Buitenste tekstobject
```

Een binnenste tekstobject selecteert het object binnen *zonder* de witruimte of de omringende objecten. Een buitenste tekstobject selecteert het object binnen *inclusief* de witruimte of de omringende objecten. Over het algemeen selecteert een buitenste tekstobject altijd meer tekst dan een binnenste tekstobject. Als je cursor ergens binnen de haakjes in de expressie `(hello Vim)` staat:
- Om de tekst binnen de haakjes te verwijderen zonder de haakjes te verwijderen: `di(`.
- Om de haakjes en de tekst binnenin te verwijderen: `da(`.

Laten we naar een ander voorbeeld kijken. Stel dat je deze Javascript-functie hebt en je cursor staat op de "H" in "Hello":

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Om de hele "Hello Vim" te verwijderen: `di(`.
- Om de inhoud van de functie (omgeven door `{}`) te verwijderen: `di{`.
- Om de string "Hello" te verwijderen: `diw`.

Tekstobjecten zijn krachtig omdat je verschillende objecten vanuit één locatie kunt targeten. Je kunt de objecten binnen de haakjes, het functieblok of het huidige woord verwijderen. Mnemonisch, wanneer je `di(`, `di{` en `diw` ziet, krijg je een behoorlijk goed idee welke tekstobjecten ze vertegenwoordigen: een paar haakjes, een paar accolades en een woord.

Laten we naar een laatste voorbeeld kijken. Stel dat je deze HTML-tags hebt:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Als je cursor op de tekst "Header1" staat:
- Om "Header1" te verwijderen: `dit`.
- Om `<h1>Header1</h1>` te verwijderen: `dat`.

Als je cursor op "div" staat:
- Om `h1` en beide `p`-regels te verwijderen: `dit`.
- Om alles te verwijderen: `dat`.
- Om "div" te verwijderen: `di<`.

Hieronder staat een lijst van veelvoorkomende tekstobjecten:

```shell
w         Een woord
p         Een alinea
s         Een zin
( of )    Een paar ( )
{ of }    Een paar { }
[ of ]    Een paar [ ]
< of >    Een paar < >
t         XML-tags
"         Een paar " "
'         Een paar ' '
`         Een paar ` `
```

Om meer te leren, kijk op `:h text-objects`.

## Compositie en Grammatica

De Vim-grammatica is een subset van de compositie-functie van Vim. Laten we de compositie in Vim bespreken en waarom dit een geweldige functie is om in een teksteditor te hebben.

Compositie betekent het hebben van een set algemene commando's die kunnen worden gecombineerd (samengesteld) om complexere commando's uit te voeren. Net als in programmeren, waar je complexere abstracties kunt creëren vanuit eenvoudigere abstracties, kun je in Vim complexe commando's uitvoeren vanuit eenvoudigere commando's. De Vim-grammatica is de manifestatie van de samenstelbare aard van Vim.

De ware kracht van de samenstelbaarheid van Vim komt naar voren wanneer het integreert met externe programma's. Vim heeft een filteroperator (`!`) om externe programma's als filters voor onze teksten te gebruiken. Stel dat je deze rommelige tekst hieronder hebt en je wilt deze in een tabelvorm brengen:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Dit kan niet gemakkelijk worden gedaan met Vim-commando's, maar je kunt het snel doen met het `column` terminalcommando (ervan uitgaande dat je terminal het `column` commando heeft). Met je cursor op "Id", voer `!}column -t -s "|"` uit. Voilà! Nu heb je deze mooie tabelgegevens met slechts één snel commando.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Laten we het commando opsplitsen. Het werkwoord was `!` (filteroperator) en het zelfstandig naamwoord was `}` (ga naar de volgende alinea). De filteroperator `!` accepteerde een ander argument, een terminalcommando, dus gaf ik het `column -t -s "|"`. Ik zal niet uitleggen hoe `column` werkte, maar in feite heeft het de tekst in tabelvorm gebracht.

Stel dat je niet alleen je tekst in tabelvorm wilt brengen, maar ook alleen de rijen met "Ok" wilt weergeven. Je weet dat `awk` de klus gemakkelijk kan klaren. Je kunt dit in plaats daarvan doen:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Resultaat:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Geweldig! De externe commando-operator kan ook een pijp (`|`) gebruiken.

Dit is de kracht van de samenstelbaarheid van Vim. Hoe meer je weet over je operatoren, bewegingen en terminalcommando's, hoe meer je in staat bent om complexe acties te *vermenigvuldigen*.

Stel dat je slechts vier bewegingen kent, `w, $, }, G` en slechts één operator, `d`. Je kunt 8 acties uitvoeren: *verplaatsen* op 4 verschillende manieren (`w, $, }, G`) en *verwijderen* van 4 verschillende doelen (`dw, d$, d}, dG`). Dan leer je op een dag over de hoofdletter (`gU`) operator. Je hebt niet alleen één nieuwe vaardigheid aan je Vim-gereedschapsriem toegevoegd, maar *vier*: `gUw, gU$, gU}, gUG`. Dit maakt het 12 tools in je Vim-gereedschapsriem. Elke nieuwe kennis is een vermenigvuldiger voor je huidige vaardigheden. Als je 10 bewegingen en 5 operatoren kent, heb je 60 bewegingen (50 bewerkingen + 10 bewegingen) in je arsenaal. Vim heeft een lijnnummerbeweging (`nG`) die je `n` bewegingen geeft, waar `n` het aantal regels in je bestand is (om naar regel 5 te gaan, voer je `5G` uit). De zoekbeweging (`/`) geeft je praktisch een onbeperkt aantal bewegingen omdat je naar alles kunt zoeken. De externe commando-operator (`!`) geeft je net zoveel filtertools als het aantal terminalcommando's dat je kent. Met een samenstelbaar hulpmiddel zoals Vim kan alles wat je weet met elkaar worden verbonden om bewerkingen met toenemende complexiteit uit te voeren. Hoe meer je weet, hoe krachtiger je wordt.

Dit samenstelbare gedrag weerspiegelt de Unix-filosofie: *doe één ding goed*. Een operator heeft één taak: doe Y. Een beweging heeft één taak: ga naar X. Door een operator met een beweging te combineren, krijg je voorspelbaar YX: doe Y op X.

Bewegingen en operatoren zijn uitbreidbaar. Je kunt aangepaste bewegingen en operatoren maken om aan je Vim-gereedschapsriem toe te voegen. De [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) plugin stelt je in staat om je eigen tekstobjecten te maken. Het bevat ook een [lijst](https://github.com/kana/vim-textobj-user/wiki) van door gebruikers gemaakte aangepaste tekstobjecten.

## Leer Vim-Grammatica op de Slimme Manier

Je hebt zojuist geleerd over de grammaticaregel van Vim: `werkwoord + zelfstandig naamwoord`. Een van mijn grootste "AHA!" momenten met Vim was toen ik net had geleerd over de hoofdletter (`gU`) operator en de huidige woord wilde hoofdletteren, ik *instinctief* `gUiw` uitvoerde en het werkte! Het woord werd in hoofdletters gezet. Op dat moment begon ik eindelijk Vim te begrijpen. Mijn hoop is dat jij binnenkort je eigen "AHA!" moment zult hebben, als dat nog niet het geval is.

Het doel van dit hoofdstuk is om je het `werkwoord + zelfstandig naamwoord` patroon in Vim te laten zien, zodat je het leren van Vim benadert als het leren van een nieuwe taal in plaats van het uit je hoofd leren van elke combinatie van commando's.

Leer het patroon en begrijp de implicaties. Dat is de slimme manier om te leren.