---
description: Leer hoe je met View, Session en Viminfo een "snapshot" van je projecten
  in Vim kunt behouden, zodat je wijzigingen niet verloren gaan bij het afsluiten.
title: Ch20. Views, Sessions, and Viminfo
---

Nadat je een tijdje aan een project hebt gewerkt, merk je misschien dat het project geleidelijk vorm begint te krijgen met zijn eigen instellingen, vouwen, buffers, lay-outs, enzovoort. Het is alsof je je appartement decoreert nadat je er een tijdje in hebt gewoond. Het probleem is, wanneer je Vim sluit, verlies je die wijzigingen. Zou het niet fijn zijn als je die wijzigingen kunt behouden zodat de volgende keer dat je Vim opent, het eruitziet alsof je nooit weg bent geweest?

In dit hoofdstuk leer je hoe je View, Session en Viminfo kunt gebruiken om een "snapshot" van je projecten te bewaren.

## View

Een View is de kleinste subset van de drie (View, Session, Viminfo). Het is een verzameling van instellingen voor één venster. Als je lange tijd aan een venster werkt en je wilt de mappen en vouwen behouden, kun je een View gebruiken.

Laten we een bestand genaamd `foo.txt` maken:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

In dit bestand, maak drie wijzigingen:
1. Maak op regel 1 een handmatige vouw `zf4j` (vouw de volgende 4 regels).
2. Verander de `number` instelling: `setlocal nonumber norelativenumber`. Dit verwijdert de nummerindicatoren aan de linkerkant van het venster.
3. Maak een lokale mapping om elke keer dat je `j` indrukt, twee regels naar beneden te gaan in plaats van één: `:nnoremap <buffer> j jj`.

Je bestand zou er als volgt uit moeten zien:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Configureren van View-attributen

Voer uit:

```shell
:set viewoptions?
```

Standaard zou het moeten zeggen (jouw versie kan er anders uitzien, afhankelijk van je vimrc):

```shell
viewoptions=folds,cursor,curdir
```

Laten we `viewoptions` configureren. De drie attributen die je wilt behouden zijn de vouwen, de mappen en de lokale setopties. Als jouw instelling eruitziet zoals de mijne, heb je al de `folds` optie. Je moet View vertellen om de `localoptions` te onthouden. Voer uit:

```shell
:set viewoptions+=localoptions
```

Om te leren welke andere opties beschikbaar zijn voor `viewoptions`, kijk bij `:h viewoptions`. Nu als je `:set viewoptions?` uitvoert, zou je moeten zien:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### De View opslaan

Met het `foo.txt` venster dat goed is gevouwen en de `nonumber norelativenumber` opties, laten we de View opslaan. Voer uit:

```shell
:mkview
```

Vim maakt een View-bestand aan.

### View-bestanden

Je vraagt je misschien af: "Waar heeft Vim dit View-bestand opgeslagen?" Om te zien waar Vim het opslaat, voer uit:

```shell
:set viewdir?
```

In Unix-gebaseerde besturingssystemen zou de standaard moeten zeggen `~/.vim/view` (als je een ander besturingssysteem hebt, kan het een ander pad tonen. Kijk bij `:h viewdir` voor meer). Als je een Unix-gebaseerd besturingssysteem gebruikt en je wilt het naar een ander pad veranderen, voeg dit toe aan je vimrc:

```shell
set viewdir=$HOME/else/where
```

### Het View-bestand laden

Sluit `foo.txt` als je dat nog niet hebt gedaan, open dan `foo.txt` opnieuw. **Je zou de originele tekst zonder de wijzigingen moeten zien.** Dat is te verwachten.

Om de staat te herstellen, moet je het View-bestand laden. Voer uit:

```shell
:loadview
```

Nu zou je moeten zien:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

De vouwen, lokale instellingen en lokale mappings zijn hersteld. Als je goed kijkt, zou je cursor ook op de regel moeten staan waar je het achterliet toen je `:mkview` uitvoerde. Zolang je de `cursor` optie hebt, onthoudt View ook je cursorpositie.

### Meerdere Views

Vim laat je 9 genummerde Views opslaan (1-9).

Stel dat je een extra vouw wilt maken (laten we zeggen dat je de laatste twee regels wilt vouwen) met `:9,10 fold`. Laten we dit opslaan als View 1. Voer uit:

```shell
:mkview 1
```

Als je nog een vouw wilt maken met `:6,7 fold` en het als een andere View wilt opslaan, voer uit:

```shell
:mkview 2
```

Sluit het bestand. Wanneer je `foo.txt` opent en je wilt View 1 laden, voer uit:

```shell
:loadview 1
```

Om View 2 te laden, voer uit:

```shell
:loadview 2
```

Om de originele View te laden, voer uit:

```shell
:loadview
```

### Automatiseren van View-creatie

Een van de ergste dingen die kan gebeuren is, nadat je talloze uren hebt besteed aan het organiseren van een groot bestand met vouwen, dat je per ongeluk het venster sluit en alle vouwinformatie verliest. Om dit te voorkomen, wil je misschien automatisch een View maken elke keer dat je een buffer sluit. Voeg dit toe aan je vimrc:

```shell
autocmd BufWinLeave *.txt mkview
```

Bovendien kan het fijn zijn om de View te laden wanneer je een buffer opent:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Nu hoef je je geen zorgen te maken over het creëren en laden van Views meer wanneer je met `txt`-bestanden werkt. Houd er rekening mee dat in de loop van de tijd je `~/.vim/view` kan beginnen te accumuleren met View-bestanden. Het is goed om het eens in de paar maanden op te ruimen.

## Sessies

Als een View de instellingen van een venster opslaat, slaat een Session de informatie van alle vensters op (inclusief de lay-out).

### Een nieuwe sessie maken

Stel dat je met deze 3 bestanden werkt in een `foobarbaz` project:

Binnen `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Binnen `bar.txt`:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

Binnen `baz.txt`:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Laten we zeggen dat je je vensters hebt gesplitst met `:split` en `:vsplit`. Om deze look te behouden, moet je de sessie opslaan. Voer uit:

```shell
:mksession
```

In tegenstelling tot `mkview`, waar het standaard opslaat in `~/.vim/view`, slaat `mksession` een sessiebestand (`Session.vim`) op in de huidige directory. Bekijk het bestand als je nieuwsgierig bent naar wat erin staat.

Als je het sessiebestand ergens anders wilt opslaan, kun je een argument aan `mksession` doorgeven:

```shell
:mksession ~/some/where/else.vim
```

Als je het bestaande sessiebestand wilt overschrijven, roep je de opdracht aan met een `!` (`:mksession! ~/some/where/else.vim`).

### Een sessie laden

Om een sessie te laden, voer uit:

```shell
:source Session.vim
```

Nu ziet Vim eruit zoals je het achterliet, inclusief de gesplitste vensters! Als alternatief kun je ook een sessiebestand vanuit de terminal laden:

```shell
vim -S Session.vim
```

### Configureren van sessie-attributen

Je kunt de attributen configureren die de sessie opslaat. Om te zien wat momenteel wordt opgeslagen, voer uit:

```shell
:set sessionoptions?
```

De mijne zegt:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Als je `terminal` niet wilt opslaan wanneer je een sessie opslaat, verwijder het dan uit de sessieopties. Voer uit:

```shell
:set sessionoptions-=terminal
```

Als je een `options` wilt toevoegen wanneer je een sessie opslaat, voer uit:

```shell
:set sessionoptions+=options
```

Hier zijn enkele attributen die `sessionoptions` kan opslaan:
- `blank` slaat lege vensters op
- `buffers` slaat buffers op
- `folds` slaat vouwen op
- `globals` slaat globale variabelen op (moet beginnen met een hoofdletter en ten minste één kleine letter bevatten)
- `options` slaat opties en mappings op
- `resize` slaat vensterlijnen en -kolommen op
- `winpos` slaat vensterpositie op
- `winsize` slaat venstergroottes op
- `tabpages` slaat tabbladen op
- `unix` slaat bestanden op in Unix-formaat

Voor de volledige lijst kijk bij `:h 'sessionoptions'`.

Sessies zijn een nuttig hulpmiddel om de externe attributen van je project te behouden. Sommige interne attributen worden echter niet door een sessie opgeslagen, zoals lokale markeringen, registers, geschiedenissen, enzovoort. Om ze op te slaan, moet je Viminfo gebruiken!

## Viminfo

Als je opmerkt, na het yanken van een woord in register a en het afsluiten van Vim, heb je de volgende keer dat je Vim opent nog steeds die tekst opgeslagen in register a. Dit is eigenlijk het werk van Viminfo. Zonder het zal Vim het register niet onthouden nadat je Vim sluit.

Als je Vim 8 of hoger gebruikt, is Viminfo standaard ingeschakeld, dus je hebt misschien de hele tijd al gebruik gemaakt van Viminfo zonder het te weten!

Je zou kunnen vragen: "Wat slaat Viminfo op? Hoe verschilt het van een sessie?"

Om Viminfo te gebruiken, moet je eerst de `+viminfo` functie beschikbaar hebben (`:version`). Viminfo slaat op:
- De opdrachtregel geschiedenis.
- De zoekstring geschiedenis.
- De invoerlijn geschiedenis.
- Inhoud van niet-lege registers.
- Markeringen voor verschillende bestanden.
- Bestandsmarkeringen, die naar locaties in bestanden wijzen.
- Laatste zoek-/substitutiepatroon (voor 'n' en '&').
- De bufferlijst.
- Globale variabelen.

In het algemeen slaat een sessie de "externe" attributen op en Viminfo de "interne" attributen.

In tegenstelling tot een sessie waar je één sessiebestand per project kunt hebben, gebruik je normaal gesproken één Viminfo-bestand per computer. Viminfo is project-onafhankelijk.

De standaardlocatie voor Viminfo voor Unix is `$HOME/.viminfo` (`~/.viminfo`). Als je een ander besturingssysteem gebruikt, kan je Viminfo-locatie anders zijn. Kijk bij `:h viminfo-file-name`. Elke keer dat je "interne" wijzigingen aanbrengt, zoals het yanken van een tekst in een register, werkt Vim automatisch het Viminfo-bestand bij.

*Zorg ervoor dat je de `nocompatible` optie hebt ingesteld (`set nocompatible`), anders werkt je Viminfo niet.*

### Schrijven en lezen van Viminfo

Hoewel je slechts één Viminfo-bestand zult gebruiken, kun je meerdere Viminfo-bestanden maken. Om een Viminfo-bestand te schrijven, gebruik de `:wviminfo` opdracht (`:wv` voor kort).

```shell
:wv ~/.viminfo_extra
```

Om een bestaand Viminfo-bestand te overschrijven, voeg een uitroepteken toe aan de `wv` opdracht:

```shell
:wv! ~/.viminfo_extra
```

Standaard leest Vim van het `~/.viminfo` bestand. Om van een ander Viminfo-bestand te lezen, voer `:rviminfo` uit, of `:rv` voor kort:

```shell
:rv ~/.viminfo_extra
```

Om Vim te starten met een ander Viminfo-bestand vanuit de terminal, gebruik de `i` vlag:

```shell
vim -i viminfo_extra
```

Als je Vim voor verschillende taken gebruikt, zoals coderen en schrijven, kun je een Viminfo maken die geoptimaliseerd is voor schrijven en een andere voor coderen.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Vim starten zonder Viminfo

Om Vim zonder Viminfo te starten, kun je vanuit de terminal uitvoeren:

```shell
vim -i NONE
```

Om het permanent te maken, kun je dit toevoegen aan je vimrc-bestand:

```shell
set viminfo="NONE"
```

### Configureren van Viminfo-attributen

Net als bij `viewoptions` en `sessionoptions`, kun je instructies geven over welke attributen moeten worden opgeslagen met de `viminfo` optie. Voer uit:

```shell
:set viminfo?
```

Je krijgt:

```shell
!,'100,<50,s10,h
```

Dit ziet er cryptisch uit. Laten we het opsplitsen:
- `!` slaat globale variabelen op die beginnen met een hoofdletter en geen kleine letters bevatten. Herinner je dat `g:` een globale variabele aangeeft. Bijvoorbeeld, als je op een gegeven moment de toewijzing `let g:FOO = "foo"` hebt geschreven, zal Viminfo de globale variabele `FOO` opslaan. Maar als je `let g:Foo = "foo"` deed, zal Viminfo deze globale variabele niet opslaan omdat deze kleine letters bevat. Zonder `!` zal Vim deze globale variabelen niet opslaan.
- `'100` vertegenwoordigt markeringen. In dit geval zal Viminfo de lokale markeringen (a-z) van de laatste 100 bestanden opslaan. Wees je ervan bewust dat als je Viminfo vertelt om te veel bestanden op te slaan, Vim kan beginnen te vertragen. 1000 is een goed aantal om te hebben.
- `<50` vertelt Viminfo hoeveel maximale regels er voor elk register worden opgeslagen (50 in dit geval). Als ik 100 regels tekst in register a yank (`"ay99j`) en Vim sluit, zal Vim de volgende keer dat ik Vim open en plak vanuit register a (`"ap`), slechts maximaal 50 regels plakken. Als je geen maximumregelnummer opgeeft, *worden alle* regels opgeslagen. Als je 0 opgeeft, wordt er niets opgeslagen.
- `s10` stelt een limiet in grootte (in kb) voor een register in. In dit geval zal elke register groter dan 10kb worden uitgesloten.
- `h` schakelt de markering uit (van `hlsearch`) wanneer Vim start.

Er zijn andere opties die je kunt doorgeven. Om meer te leren, kijk bij `:h 'viminfo'`.
## Het Slim Gebruik van Views, Sessions en Viminfo

Vim heeft View, Session en Viminfo om verschillende niveaus van snapshots van je Vim-omgeving te maken. Voor microprojecten, gebruik Views. Voor grotere projecten, gebruik Sessions. Neem de tijd om alle opties te bekijken die View, Session en Viminfo bieden.

Maak je eigen View, Session en Viminfo voor je eigen bewerkingsstijl. Als je ooit Vim buiten je computer moet gebruiken, kun je gewoon je instellingen laden en je zult je meteen thuis voelen!