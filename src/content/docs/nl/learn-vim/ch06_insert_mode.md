---
description: Deze gids behandelt de invoermodus in Vim, met handige functies en verschillende
  manieren om deze modus te activeren voor efficiënter typen.
title: Ch06. Insert Mode
---

Invoegmodus is de standaardmodus van veel teksteditors. In deze modus is wat je typt wat je krijgt.

Echter, dat betekent niet dat er niet veel te leren valt. Vim's invoegmodus bevat veel nuttige functies. In dit hoofdstuk leer je hoe je deze invoegmodusfuncties in Vim kunt gebruiken om je typefficiëntie te verbeteren.

## Manieren om naar Invoegmodus te gaan

Er zijn veel manieren om in invoegmodus te komen vanuit de normale modus. Hier zijn enkele daarvan:

```shell
i    Voeg tekst in vóór de cursor
I    Voeg tekst in vóór het eerste niet-lege teken van de regel
a    Voeg tekst toe na de cursor
A    Voeg tekst toe aan het einde van de regel
o    Start een nieuwe regel onder de cursor en voeg tekst in
O    Start een nieuwe regel boven de cursor en voeg tekst in
s    Verwijder het teken onder de cursor en voeg tekst in
S    Verwijder de huidige regel en voeg tekst in, synoniem voor "cc"
gi   Voeg tekst in op dezelfde positie waar de laatste invoegmodus werd gestopt
gI   Voeg tekst in aan het begin van de regel (kolom 1)
```

Let op het patroon van kleine / hoofdletters. Voor elke kleine opdracht is er een hoofdlettertegenhanger. Als je nieuw bent, maak je geen zorgen als je de hele lijst hierboven niet onthoudt. Begin met `i` en `o`. Ze zouden voldoende moeten zijn om je op weg te helpen. Leer geleidelijk meer in de loop van de tijd.

## Verschillende manieren om Invoegmodus te verlaten

Er zijn een paar verschillende manieren om terug te keren naar de normale modus terwijl je in de invoegmodus bent:

```shell
<Esc>     Verlaat de invoegmodus en ga naar de normale modus
Ctrl-[    Verlaat de invoegmodus en ga naar de normale modus
Ctrl-C    Zoals Ctrl-[ en <Esc>, maar controleert niet op afkortingen
```

Ik vind de `<Esc>`-toets te ver weg om te bereiken, dus ik map mijn computer `<Caps-Lock>` om zich te gedragen als `<Esc>`. Als je zoekt naar het ADM-3A-toetsenbord van Bill Joy (de maker van Vi), zul je zien dat de `<Esc>`-toets niet helemaal linksboven is geplaatst zoals moderne toetsenborden, maar links van de `q`-toets. Daarom denk ik dat het logisch is om `<Caps lock>` naar `<Esc>` te mappen.

Een andere veelvoorkomende conventie die ik heb gezien bij Vim-gebruikers is het mappen van `<Esc>` naar `jj` of `jk` in invoegmodus. Als je deze optie verkiest, voeg dan een van deze regels (of beide) toe aan je vimrc-bestand.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Herhalen van Invoegmodus

Je kunt een telparameter doorgeven voordat je invoegmodus ingaat. Bijvoorbeeld:

```shell
10i
```

Als je "hello world!" typt en de invoegmodus verlaat, zal Vim de tekst 10 keer herhalen. Dit werkt met elke invoegmodusmethode (bijv. `10I`, `11a`, `12o`).

## Verwijderen van stukken in Invoegmodus

Wanneer je een typefout maakt, kan het vervelend zijn om herhaaldelijk `<Backspace>` te typen. Het kan logischer zijn om naar de normale modus te gaan en je fout te verwijderen. Je kunt ook meerdere tekens tegelijk verwijderen terwijl je in invoegmodus bent.

```shell
Ctrl-h    Verwijder één teken
Ctrl-w    Verwijder één woord
Ctrl-u    Verwijder de hele regel
```

## Invoegen vanuit Register

Vim-registers kunnen teksten opslaan voor toekomstig gebruik. Om een tekst vanuit een benoemd register in te voegen terwijl je in invoegmodus bent, typ je `Ctrl-R` plus het register symbool. Er zijn veel symbolen die je kunt gebruiken, maar voor deze sectie behandelen we alleen de benoemde registers (a-z).

Om het in actie te zien, moet je eerst een woord naar register a yank. Beweeg je cursor op een willekeurig woord. Typ dan:

```shell
"ayiw
```

- `"a` vertelt Vim dat het doel van je volgende actie naar register a zal gaan.
- `yiw` yankt het binnenste woord. Bekijk het hoofdstuk over Vim-grammatica voor een opfrisser.

Register a bevat nu het woord dat je net hebt yanked. Terwijl je in invoegmodus bent, om de tekst die is opgeslagen in register a te plakken:

```shell
Ctrl-R a
```

Er zijn meerdere soorten registers in Vim. Ik zal ze in een later hoofdstuk uitgebreider behandelen.

## Scrollen

Wist je dat je kunt scrollen terwijl je in invoegmodus bent? Terwijl je in invoegmodus bent, als je naar `Ctrl-X` sub-modus gaat, kun je extra bewerkingen uitvoeren. Scrollen is er een van.

```shell
Ctrl-X Ctrl-Y    Scroll omhoog
Ctrl-X Ctrl-E    Scroll omlaag
```

## Autocompletion

Zoals hierboven vermeld, als je `Ctrl-X` indrukt vanuit invoegmodus, zal Vim een sub-modus ingaan. Je kunt tekstautomatisering doen terwijl je in deze invoegmodus sub-modus bent. Hoewel het niet zo goed is als [intellisense](https://code.visualstudio.com/docs/editor/intellisense) of enige andere Language Server Protocol (LSP), is het voor iets dat direct uit de doos beschikbaar is, een zeer capabele functie.

Hier zijn enkele nuttige autocomplete-opdrachten om mee te beginnen:

```shell
Ctrl-X Ctrl-L	   Voeg een hele regel in
Ctrl-X Ctrl-N	   Voeg een tekst in van het huidige bestand
Ctrl-X Ctrl-I	   Voeg een tekst in van opgenomen bestanden
Ctrl-X Ctrl-F	   Voeg een bestandsnaam in
```

Wanneer je autocompletion activeert, toont Vim een pop-upvenster. Om omhoog en omlaag door het pop-upvenster te navigeren, gebruik je `Ctrl-N` en `Ctrl-P`.

Vim heeft ook twee autocompletion sneltoetsen die de `Ctrl-X` sub-modus niet vereisen:

```shell
Ctrl-N             Vind de volgende woordovereenkomst
Ctrl-P             Vind de vorige woordovereenkomst
```

Over het algemeen kijkt Vim naar de tekst in alle beschikbare buffers voor de autocompletionbron. Als je een open buffer hebt met een regel die zegt "Chocolate donuts zijn de beste":
- Wanneer je "Choco" typt en `Ctrl-X Ctrl-L` doet, zal het overeenkomen en de hele regel afdrukken.
- Wanneer je "Choco" typt en `Ctrl-P` doet, zal het overeenkomen en het woord "Chocolate" afdrukken.

Autocomplete is een uitgestrekt onderwerp in Vim. Dit is slechts de top van de ijsberg. Om meer te leren, kijk naar `:h ins-completion`.

## Een Normale Modus Opdracht Uitvoeren

Wist je dat Vim een normale modus opdracht kan uitvoeren terwijl je in invoegmodus bent?

Terwijl je in invoegmodus bent, als je `Ctrl-O` indrukt, kom je in de invoeg-normale sub-modus. Als je naar de modusindicator linksonder kijkt, zie je normaal gesproken `-- INSERT --`, maar door `Ctrl-O` in te drukken verandert het in `-- (invoegen) --`. In deze modus kun je *één* normale modus opdracht uitvoeren. Enkele dingen die je kunt doen:

**Centreren en springen**

```shell
Ctrl-O zz       Centreer venster
Ctrl-O H/M/L    Spring naar boven/midden/onder venster
Ctrl-O 'a       Spring naar markering a
```

**Tekst herhalen**

```shell
Ctrl-O 100ihello    Voeg "hello" 100 keer in
```

**Terminalopdrachten uitvoeren**

```shell
Ctrl-O !! curl https://google.com    Voer curl uit
Ctrl-O !! pwd                        Voer pwd uit
```

**Sneller verwijderen**

```shell
Ctrl-O dtz    Verwijder vanaf de huidige locatie tot de letter "z"
Ctrl-O D      Verwijder vanaf de huidige locatie tot het einde van de regel
```

## Leer Invoegmodus op de Slimme Manier

Als je zoals ik bent en je komt uit een andere teksteditor, kan het verleidelijk zijn om in invoegmodus te blijven. Echter, in invoegmodus blijven wanneer je geen tekst invoert is een anti-patroon. Ontwikkel de gewoonte om naar de normale modus te gaan wanneer je vingers geen nieuwe tekst typen.

Wanneer je tekst moet invoegen, vraag jezelf dan eerst af of die tekst al bestaat. Als dat zo is, probeer dan die tekst te yank of te verplaatsen in plaats van het te typen. Als je invoegmodus moet gebruiken, kijk dan of je die tekst waar mogelijk kunt autocompleteren. Vermijd het om hetzelfde woord meer dan eens te typen als je kunt.