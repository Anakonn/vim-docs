---
description: Leer verschillende manieren om meerdere bestanden in Vim te bewerken,
  inclusief commando's zoals `argdo`, `bufdo` en `cdo` voor efficiënte bewerking.
title: Ch21. Multiple File Operations
---

In staat zijn om meerdere bestanden bij te werken is een andere nuttige bewerkingstool. Eerder heb je geleerd hoe je meerdere teksten kunt bijwerken met `cfdo`. In dit hoofdstuk leer je de verschillende manieren waarop je meerdere bestanden in Vim kunt bewerken.

## Verschillende manieren om een opdracht in meerdere bestanden uit te voeren

Vim heeft acht manieren om opdrachten uit te voeren in meerdere bestanden:
- arg-lijst (`argdo`)
- buffer-lijst (`bufdo`)
- venster-lijst (`windo`)
- tab-lijst (`tabdo`)
- quickfix-lijst (`cdo`)
- quickfix-lijst per bestand (`cfdo`)
- locatie-lijst (`ldo`)
- locatie-lijst per bestand (`lfdo`)

Praktisch gezien zul je waarschijnlijk maar één of twee van deze het meest gebruiken (persoonlijk gebruik ik `cdo` en `argdo` vaker dan anderen), maar het is goed om te leren over alle beschikbare opties en de opties te gebruiken die passen bij jouw bewerkingsstijl.

Acht opdrachten leren kan ontmoedigend klinken. Maar in werkelijkheid werken deze opdrachten op een vergelijkbare manier. Na het leren van één, zal het leren van de rest gemakkelijker worden. Ze delen allemaal hetzelfde grote idee: maak een lijst van hun respectieve categorieën en geef ze de opdracht die je wilt uitvoeren.

## Argumentlijst

De argumentlijst is de meest basale lijst. Het creëert een lijst van bestanden. Om een lijst van file1, file2 en file3 te maken, kun je uitvoeren:

```shell
:args file1 file2 file3
```

Je kunt ook een wildcard (`*`) doorgeven, dus als je een lijst wilt maken van alle `.js`-bestanden in de huidige directory, voer dan uit:

```shell
:args *.js
```

Als je een lijst wilt maken van alle Javascript-bestanden die beginnen met "a" in de huidige directory, voer dan uit:

```shell
:args a*.js
```

De wildcard matcht één of meer van elk bestandsnaamteken in de huidige directory, maar wat als je recursief in een directory moet zoeken? Je kunt de dubbele wildcard (`**`) gebruiken. Om alle Javascript-bestanden binnen de directories in je huidige locatie te krijgen, voer uit:

```shell
:args **/*.js
```

Zodra je de `args`-opdracht uitvoert, wordt je huidige buffer omgeschakeld naar het eerste item in de lijst. Om de lijst van bestanden die je net hebt gemaakt te bekijken, voer `:args` uit. Zodra je je lijst hebt gemaakt, kun je ze doorlopen. `:first` brengt je naar het eerste item in de lijst. `:last` brengt je naar het laatste item in de lijst. Om de lijst één bestand tegelijk vooruit te bewegen, voer `:next` uit. Om de lijst één bestand tegelijk achteruit te bewegen, voer `:prev` uit. Om één bestand tegelijk vooruit/achteruit te bewegen en de wijzigingen op te slaan, voer `:wnext` en `:wprev` uit. Er zijn nog veel meer navigatieopdrachten. Bekijk `:h arglist` voor meer.

De arg-lijst is nuttig als je een specifiek type bestand of een paar bestanden moet targeten. Misschien moet je alle "donut" vervangen door "pancake" in alle `yml`-bestanden, je kunt doen:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Als je de `args`-opdracht opnieuw uitvoert, vervangt het de vorige lijst. Bijvoorbeeld, als je eerder uitvoerde:

```shell
:args file1 file2 file3
```

Aangenomen dat deze bestanden bestaan, heb je nu een lijst van `file1`, `file2` en `file3`. Dan voer je dit uit:

```shell
:args file4 file5
```

Je oorspronkelijke lijst van `file1`, `file2` en `file3` wordt vervangen door `file4` en `file5`. Als je `file1`, `file2` en `file3` in je arg-lijst hebt en je wilt `file4` en `file5` aan je oorspronkelijke bestandenlijst *toevoegen*, gebruik dan de `:arga`-opdracht. Voer uit:

```shell
:arga file4 file5
```

Nu heb je `file1`, `file2`, `file3`, `file4` en `file5` in je arg-lijst.

Als je `:arga` zonder argument uitvoert, zal Vim je huidige buffer aan de huidige arg-lijst toevoegen. Als je al `file1`, `file2` en `file3` in je arg-lijst hebt en je huidige buffer zich op `file5` bevindt, zal het uitvoeren van `:arga` `file5` aan de lijst toevoegen.

Zodra je de lijst hebt, kun je deze doorgeven met elke opdrachtregelopdracht naar keuze. Je hebt gezien dat dit gedaan wordt met substitutie (`:argdo %s/donut/pancake/g`). Enkele andere voorbeelden:
- Om alle regels die "dessert" bevatten in de arg-lijst te verwijderen, voer `:argdo g/dessert/d` uit.
- Om macro a uit te voeren (ervan uitgaande dat je iets in macro a hebt opgenomen) in de arg-lijst, voer `:argdo norm @a` uit.
- Om "hello " gevolgd door de bestandsnaam op de eerste regel te schrijven, voer `:argdo 0put='hello ' .. @:` uit.

Vergeet niet om ze op te slaan met `:update`.

Soms moet je de opdrachten alleen uitvoeren op de eerste n items van de argumentlijst. Als dat het geval is, geef dan gewoon een adres door aan de `argdo`-opdracht. Bijvoorbeeld, om de vervangopdracht alleen op de eerste 3 items van de lijst uit te voeren, voer `:1,3argdo %s/donut/pancake/g` uit.

## Bufferlijst

De bufferlijst wordt organisch aangemaakt wanneer je nieuwe bestanden bewerkt, omdat elke keer dat je een nieuw bestand aanmaakt of een bestand opent, Vim het in een buffer opslaat (tenzij je het expliciet verwijdert). Dus als je al 3 bestanden hebt geopend: `file1.rb file2.rb file3.rb`, heb je al 3 items in je bufferlijst. Om de bufferlijst weer te geven, voer `:buffers` uit (alternatief: `:ls` of `:files`). Om vooruit en achteruit te navigeren, gebruik `:bnext` en `:bprev`. Om naar de eerste en laatste buffer van de lijst te gaan, gebruik `:bfirst` en `:blast` (heb je het naar je zin? :D).

Trouwens, hier is een coole buffertruc die niet gerelateerd is aan dit hoofdstuk: als je een aantal items in je bufferlijst hebt, kun je ze allemaal weergeven met `:ball` (buffer all). De `ball`-opdracht toont alle buffers horizontaal. Om ze verticaal weer te geven, voer `:vertical ball` uit.

Terug naar het onderwerp, de mechanica om bewerkingen uit te voeren over alle buffers is vergelijkbaar met de arg-lijst. Zodra je je bufferlijst hebt aangemaakt, hoef je alleen maar de opdracht(en) die je wilt uitvoeren voor te laten gaan met `:bufdo` in plaats van `:argdo`. Dus als je alle "donut" wilt vervangen door "pancake" in alle buffers en de wijzigingen wilt opslaan, voer dan `:bufdo %s/donut/pancake/g | update` uit.

## Venster- en tablijst

De venster- en tablijst zijn ook vergelijkbaar met de arg- en bufferlijst. De enige verschillen zijn hun context en syntaxis.

Vensteroperaties worden uitgevoerd op elk geopend venster en uitgevoerd met `:windo`. Taboperaties worden uitgevoerd op elke tab die je hebt geopend en uitgevoerd met `:tabdo`. Voor meer informatie, kijk naar `:h list-repeat`, `:h :windo` en `:h :tabdo`.

Bijvoorbeeld, als je drie vensters geopend hebt (je kunt nieuwe vensters openen met `Ctrl-W v` voor een verticaal venster en `Ctrl-W s` voor een horizontaal venster) en je voert `:windo 0put ='hello' . @%` uit, zal Vim "hello" + bestandsnaam naar alle open vensters uitvoeren.

## Quickfix-lijst

In de vorige hoofdstukken (Ch3 en Ch19) heb ik gesproken over quickfixes. Quickfix heeft veel toepassingen. Veel populaire plugins gebruiken quickfixes, dus het is goed om meer tijd te besteden aan het begrijpen ervan.

Als je nieuw bent in Vim, kan quickfix een nieuw concept zijn. In de oude dagen, toen je je code daadwerkelijk expliciet moest compileren, zou je tijdens de compilatiefase fouten tegenkomen. Om deze fouten weer te geven, heb je een speciaal venster nodig. Dat is waar quickfix om de hoek komt kijken. Wanneer je je code compileert, toont Vim foutmeldingen in het quickfix-venster, zodat je ze later kunt oplossen. Veel moderne talen vereisen geen expliciete compilatie meer, maar dat maakt quickfix niet obsoleet. Tegenwoordig gebruiken mensen quickfix voor allerlei dingen, zoals het weergeven van een virtuele terminaluitvoer en het opslaan van zoekresultaten. Laten we ons concentreren op de laatste, het opslaan van zoekresultaten.

Naast de compileeropdrachten, vertrouwen bepaalde Vim-opdrachten op quickfixinterfaces. Een type opdracht dat veel gebruik maakt van quickfixes zijn de zoekopdrachten. Zowel `:vimgrep` als `:grep` gebruiken standaard quickfixes.

Bijvoorbeeld, als je moet zoeken naar "donut" in alle Javascript-bestanden recursief, kun je uitvoeren:

```shell
:vimgrep /donut/ **/*.js
```

Het resultaat van de "donut" zoekopdracht wordt opgeslagen in het quickfix-venster. Om deze overeenkomsten in het quickfix-venster te zien, voer uit:

```shell
:copen
```

Om het te sluiten, voer uit:

```shell
:cclose
```

Om de quickfix-lijst vooruit en achteruit te doorlopen, voer uit:

```shell
:cnext
:cprev
```

Om naar het eerste en het laatste item in de overeenkomst te gaan, voer uit:

```shell
:cfirst
:clast
```

Eerder heb ik vermeld dat er twee quickfix-opdrachten zijn: `cdo` en `cfdo`. Hoe verschillen ze? `cdo` voert de opdracht uit voor elk item in de quickfix-lijst, terwijl `cfdo` de opdracht uitvoert voor elk *bestand* in de quickfix-lijst.

Laat me het verduidelijken. Stel dat je na het uitvoeren van de bovenstaande `vimgrep`-opdracht hebt gevonden:
- 1 resultaat in `file1.js`
- 10 resultaten in `file2.js`

Als je `:cfdo %s/donut/pancake/g` uitvoert, zal dit effectief `%s/donut/pancake/g` eenmaal uitvoeren in `file1.js` en eenmaal in `file2.js`. Het wordt *zoveel keer uitgevoerd als er bestanden in de overeenkomst zijn.* Aangezien er twee bestanden in de resultaten zijn, voert Vim de vervangopdracht eenmaal uit op `file1.js` en nogmaals op `file2.js`, ondanks het feit dat er 10 overeenkomsten in het tweede bestand zijn. `cfdo` houdt alleen rekening met het aantal totale bestanden in de quickfix-lijst.

Als je `:cdo %s/donut/pancake/g` uitvoert, zal dit effectief `%s/donut/pancake/g` eenmaal uitvoeren in `file1.js` en *tien keer* in `file2.js`. Het wordt uitgevoerd zoveel keer als er daadwerkelijke items in de quickfix-lijst zijn. Aangezien er slechts één overeenkomst is gevonden in `file1.js` en 10 overeenkomsten in `file2.js`, zal het in totaal 11 keer worden uitgevoerd.

Aangezien je `%s/donut/pancake/g` hebt uitgevoerd, zou het logisch zijn om `cfdo` te gebruiken. Het zou niet logisch zijn om `cdo` te gebruiken omdat het `%s/donut/pancake/g` tien keer in `file2.js` zou uitvoeren (`%s` is een bestand-brede vervangopdracht). Het uitvoeren van `%s` eenmaal per bestand is voldoende. Als je `cdo` zou gebruiken, zou het logischer zijn om het door te geven met `s/donut/pancake/g` in plaats van.

Bij het beslissen of je `cfdo` of `cdo` moet gebruiken, denk aan de opdrachtscope die je doorgeeft. Is dit een bestand-brede opdracht (zoals `:%s` of `:g`) of is dit een regelgewijze opdracht (zoals `:s` of `:!`)?

## Locatielijst

De locatielijst is vergelijkbaar met de quickfix-lijst in die zin dat Vim ook een speciaal venster gebruikt om berichten weer te geven. Het verschil tussen een quickfix-lijst en een locatielijst is dat je op elk moment slechts één quickfix-lijst kunt hebben, terwijl je zoveel locatielijsten kunt hebben als vensters.

Stel dat je twee vensters hebt geopend, één venster dat `food.txt` weergeeft en een ander dat `drinks.txt` weergeeft. Vanuit `food.txt` voer je een locatielijst zoekopdracht uit `:lvimgrep` (de locatievariant voor de `:vimgrep`-opdracht):

```shell
:lvim /bagel/ **/*.md
```

Vim zal een locatielijst maken van alle bagel zoekovereenkomsten voor dat `food.txt` *venster*. Je kunt de locatielijst zien met `:lopen`. Ga nu naar het andere venster `drinks.txt` en voer uit:

```shell
:lvimgrep /milk/ **/*.md
```

Vim zal een *gescheiden* locatielijst maken met alle melk zoekresultaten voor dat `drinks.txt` *venster*.

Voor elke locatie-opdracht die je in elk venster uitvoert, maakt Vim een aparte locatielijst aan. Als je 10 verschillende vensters hebt, kun je tot 10 verschillende locatielijsten hebben. Dit staat in contrast met de quickfix-lijst waar je er op elk moment maar één kunt hebben. Als je 10 verschillende vensters hebt, heb je nog steeds maar één quickfix-lijst.

De meeste locatielijstopdrachten zijn vergelijkbaar met quickfix-opdrachten, behalve dat ze in plaats daarvan zijn voorafgegaan door `l-`. Bijvoorbeeld: `:lvimgrep`, `:lgrep`, en `:lmake` versus `:vimgrep`, `:grep`, en `:make`. Om het locatielijstvenster te manipuleren, zien de opdrachten er weer vergelijkbaar uit met de quickfix-opdrachten `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext`, en `:lprev` versus `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext`, en `:cprev`.

De twee locatielijst multi-bestandsopdrachten zijn ook vergelijkbaar met quickfix multi-bestandsopdrachten: `:ldo` en `:lfdo`. `:ldo` voert de locatieopdracht uit in elke locatielijst, terwijl `:lfdo` de locatielijstopdracht uitvoert voor elk bestand in de locatielijst. Voor meer informatie, kijk naar `:h location-list`.
## Meerdere Bestandsbewerkingen Uitvoeren in Vim

Weten hoe je een bewerking op meerdere bestanden kunt uitvoeren is een nuttige vaardigheid in het bewerken. Telkens wanneer je een variabele naam in meerdere bestanden moet wijzigen, wil je dit in één keer doen. Vim heeft acht verschillende manieren waarop je dit kunt doen.

Praktisch gezien, zul je waarschijnlijk niet alle acht evenveel gebruiken. Je zult neigen naar één of twee. Wanneer je begint, kies er één (ik stel persoonlijk voor om te beginnen met de arg list `:argdo`) en beheers deze. Zodra je je comfortabel voelt met één, leer dan de volgende. Je zult merken dat het leren van de tweede, derde, vierde gemakkelijker wordt. Wees creatief. Gebruik het met verschillende combinaties. Blijf oefenen totdat je dit moeiteloos en zonder veel nadenken kunt doen. Maak het een onderdeel van je spiergeheugen.

Dat gezegd hebbende, je hebt Vim-bewerking meester gemaakt. Gefeliciteerd!