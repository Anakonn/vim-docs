---
description: Leer hoe je de puntcommando (`.`) in Vim gebruikt om eenvoudig eerdere
  wijzigingen te herhalen en tijd te besparen bij het bewerken van tekst.
title: Ch07. the Dot Command
---

In het algemeen moet je proberen te voorkomen dat je opnieuw doet wat je net hebt gedaan, wanneer dat mogelijk is. In dit hoofdstuk leer je hoe je het puntcommando kunt gebruiken om de vorige wijziging eenvoudig opnieuw uit te voeren. Het is een veelzijdig commando voor het verminderen van eenvoudige herhalingen.

## Gebruik

Net als de naam al aangeeft, kun je het puntcommando gebruiken door op de punttoets (`.`) te drukken.

Bijvoorbeeld, als je alle "let" wilt vervangen door "const" in de volgende expressies:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Zoek met `/let` om naar de overeenkomst te gaan.
- Verander met `cwconst<Esc>` om "let" te vervangen door "const".
- Navigeer met `n` om de volgende overeenkomst te vinden met behulp van de vorige zoekopdracht.
- Herhaal wat je net deed met het puntcommando (`.`).
- Blijf drukken op `n . n .` totdat je elk woord hebt vervangen.

Hier herhaalde het puntcommando de `cwconst<Esc>`-reeks. Het bespaarde je acht toetsaanslagen in ruil voor slechts één.

## Wat Is een Wijziging?

Als je kijkt naar de definitie van het puntcommando (`:h .`), staat er dat het puntcommando de laatste wijziging herhaalt. Wat is een wijziging?

Elke keer dat je de inhoud van de huidige buffer bijwerkt (toevoegen, wijzigen of verwijderen), maak je een wijziging. De uitzonderingen zijn updates die zijn uitgevoerd door commando's in de opdrachtregel (de commando's die beginnen met `:`) tellen niet als een wijziging.

In het eerste voorbeeld was `cwconst<Esc>` de wijziging. Stel nu dat je deze tekst hebt:

```shell
pancake, potatoes, fruit-juice,
```

Om de tekst van het begin van de regel tot de volgende komma te verwijderen, verwijder je eerst tot de komma, en herhaal het dan twee keer met `df,..`. 

Laten we een ander voorbeeld proberen:

```shell
pancake, potatoes, fruit-juice,
```

Deze keer is je taak om de komma te verwijderen, niet de ontbijtitems. Met de cursor aan het begin van de regel, ga naar de eerste komma, verwijder deze, en herhaal het dan nog twee keer met `f,x..` Makkelijk, toch? Wacht even, het werkte niet! Waarom?

Een wijziging sluit bewegingen uit omdat het de bufferinhoud niet bijwerkt. Het commando `f,x` bestond uit twee acties: het commando `f,` om de cursor naar "," te verplaatsen en `x` om een teken te verwijderen. Alleen de laatste, `x`, veroorzaakte een wijziging. Vergelijk dat met `df,` uit het eerdere voorbeeld. Daarin is `f,` een richtlijn voor de verwijderoperator `d`, geen beweging om de cursor te verplaatsen. De `f,` in `df,` en `f,x` hebben twee heel verschillende rollen.

Laten we de laatste taak afronden. Nadat je `f,` en dan `x` hebt uitgevoerd, ga naar de volgende komma met `;` om de laatste `f` te herhalen. Gebruik tenslotte `.` om het teken onder de cursor te verwijderen. Herhaal `; . ; .` totdat alles is verwijderd. Het volledige commando is `f,x;.;.`.

Laten we nog een proberen:

```shell
pancake
potatoes
fruit-juice
```

Laten we een komma aan het einde van elke regel toevoegen. Begin bij de eerste regel, doe `A,<Esc>j`. Tegenwoordig realiseer je je dat `j` geen wijziging veroorzaakt. De wijziging hier is alleen `A,`. Je kunt de wijziging verplaatsen en herhalen met `j . j .`. Het volledige commando is `A,<Esc>j.j.`.

Elke actie vanaf het moment dat je de invoercommando-operator (`A`) indrukt tot je de invoercommando verlaat (`<Esc>`) wordt beschouwd als een wijziging.

## Meerdere Regels Herhalen

Stel dat je deze tekst hebt:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Je doel is om alle regels te verwijderen, behalve de "foo" regel. Verwijder eerst de eerste drie regels met `d2j`, ga dan naar de regel onder de "foo" regel. Gebruik op de volgende regel het puntcommando twee keer. Het volledige commando is `d2jj..`.

Hier was de wijziging `d2j`. In deze context was `2j` geen beweging, maar een onderdeel van de verwijderoperator.

Laten we naar een ander voorbeeld kijken:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Laten we alle z's verwijderen. Begin vanaf het eerste teken op de eerste regel, selecteer visueel alleen de eerste z van de eerste drie regels met blokgewijze visuele modus (`Ctrl-Vjj`). Als je niet bekend bent met blokgewijze visuele modus, zal ik ze in een later hoofdstuk behandelen. Zodra je de drie z's visueel hebt geselecteerd, verwijder ze dan met de verwijderoperator (`d`). Ga dan naar het volgende woord (`w`) naar de volgende z. Herhaal de wijziging nog twee keer (`..`). Het volledige commando is `Ctrl-vjjdw..`.

Wanneer je een kolom van drie z's verwijderde (`Ctrl-vjjd`), werd dit geteld als een wijziging. De visuele modusoperatie kan worden gebruikt om meerdere regels als onderdeel van een wijziging te targeten.

## Een Beweging In Een Wijziging Inbegrepen

Laten we het eerste voorbeeld in dit hoofdstuk opnieuw bekijken. Herinner je je dat het commando `/letcwconst<Esc>` gevolgd door `n . n .` alle "let" verving door "const" in de volgende expressies:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Er is een snellere manier om dit te bereiken. Nadat je `/let` hebt gezocht, voer je `cgnconst<Esc>` uit en dan `. .`.

`gn` is een beweging die vooruit zoekt naar het laatste zoekpatroon (in dit geval, `/let`) en automatisch een visuele markering doet. Om de volgende overeenkomst te vervangen, hoef je niet langer te verplaatsen en de wijziging te herhalen (`n . n .`), maar alleen te herhalen (`. .`). Je hoeft geen zoekbewegingen meer te gebruiken omdat het zoeken naar de volgende overeenkomst nu deel uitmaakt van de wijziging!

Wanneer je aan het bewerken bent, wees altijd op zoek naar bewegingen die meerdere dingen tegelijk kunnen doen, zoals `gn`, wanneer dat mogelijk is.

## Leer het Puntcommando op de Slimme Manier

De kracht van het puntcommando komt voort uit het ruilen van meerdere toetsaanslagen voor één. Het is waarschijnlijk geen winstgevende ruil om het puntcommando te gebruiken voor enkele toetsoperaties zoals `x`. Als je laatste wijziging een complexe operatie vereist zoals `cgnconst<Esc>`, reduceert het puntcommando negen toetsaanslagen tot één, een zeer winstgevende ruil.

Denk bij het bewerken na over herhaalbaarheid. Bijvoorbeeld, als ik de volgende drie woorden moet verwijderen, is het dan economischer om `d3w` te gebruiken of om `dw` te doen en dan twee keer `.`? Ga je een woord opnieuw verwijderen? Als dat zo is, dan is het logisch om `dw` te gebruiken en het meerdere keren te herhalen in plaats van `d3w`, omdat `dw` herbruikbaarder is dan `d3w`. 

Het puntcommando is een veelzijdig commando voor het automatiseren van enkele wijzigingen. In een later hoofdstuk leer je hoe je complexere acties kunt automatiseren met Vim-macro's. Maar eerst, laten we leren over registers om tekst op te slaan en op te halen.