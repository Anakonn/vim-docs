---
description: Dit document legt de werking van buffers, vensters en tabbladen in Vim
  uit, en hoe je snel kunt navigeren zonder bestanden op te slaan.
title: Ch02. Buffers, Windows, and Tabs
---

Als je eerder een moderne teksteditor hebt gebruikt, ben je waarschijnlijk bekend met vensters en tabbladen. Vim gebruikt drie weergave-abstraheringen in plaats van twee: buffers, vensters en tabbladen. In dit hoofdstuk zal ik uitleggen wat buffers, vensters en tabbladen zijn en hoe ze werken in Vim.

Voordat je begint, zorg ervoor dat je de optie `set hidden` in vimrc hebt. Zonder deze optie, wanneer je van buffer wisselt en je huidige buffer niet is opgeslagen, zal Vim je vragen om het bestand op te slaan (dat wil je niet als je snel wilt bewegen). Ik heb vimrc nog niet behandeld. Als je geen vimrc hebt, maak er dan een aan. Het wordt meestal in je home directory geplaatst en heet `.vimrc`. Ik heb de mijne op `~/.vimrc`. Om te zien waar je je vimrc moet aanmaken, kijk naar `:h vimrc`. Voeg hierin toe:

```shell
set hidden
```

Sla het op en laad het vervolgens (voer `:source %` uit vanuit de vimrc).

## Buffers

Wat is een *buffer*?

Een buffer is een in-geheugen ruimte waar je tekst kunt schrijven en bewerken. Wanneer je een bestand in Vim opent, is de data gebonden aan een buffer. Wanneer je 3 bestanden in Vim opent, heb je 3 buffers.

Zorg ervoor dat je twee lege bestanden, `file1.js` en `file2.js`, beschikbaar hebt (indien mogelijk, maak ze met Vim). Voer dit uit in de terminal:

```bash
vim file1.js
```

Wat je ziet is de `file1.js` *buffer*. Wanneer je een nieuw bestand opent, maakt Vim een nieuwe buffer aan.

Verlaat Vim. Open deze keer twee nieuwe bestanden:

```bash
vim file1.js file2.js
```

Vim toont momenteel de `file1.js` buffer, maar het maakt eigenlijk twee buffers aan: de `file1.js` buffer en de `file2.js` buffer. Voer `:buffers` uit om alle buffers te zien (alternatief kun je ook `:ls` of `:files` gebruiken). Je zou *beide* `file1.js` en `file2.js` vermeld moeten zien. Het uitvoeren van `vim file1 file2 file3 ... filen` creëert n aantal buffers. Elke keer dat je een nieuw bestand opent, maakt Vim een nieuwe buffer voor dat bestand.

Er zijn verschillende manieren om door buffers te navigeren:
- `:bnext` om naar de volgende buffer te gaan (`:bprevious` om naar de vorige buffer te gaan).
- `:buffer` + bestandsnaam. Vim kan de bestandsnaam automatisch aanvullen met `<Tab>`.
- `:buffer` + `n`, waarbij `n` het buffer nummer is. Bijvoorbeeld, door `:buffer 2` in te typen ga je naar buffer #2.
- Spring naar de oudere positie in de springlijst met `Ctrl-O` en naar de nieuwere positie met `Ctrl-I`. Dit zijn geen buffer-specifieke methoden, maar ze kunnen worden gebruikt om tussen verschillende buffers te springen. Ik zal sprongen in meer detail uitleggen in Hoofdstuk 5.
- Ga naar de eerder bewerkte buffer met `Ctrl-^`.

Zodra Vim een buffer aanmaakt, blijft deze in je bufferslijst. Om het te verwijderen, kun je `:bdelete` typen. Het kan ook een buffer nummer als parameter accepteren (`:bdelete 3` om buffer #3 te verwijderen) of een bestandsnaam (`:bdelete` en gebruik dan `<Tab>` om automatisch aan te vullen).

Het moeilijkste voor mij toen ik over buffers leerde, was visualiseren hoe ze werkten omdat mijn geest gewend was aan vensters van het gebruik van een gangbare teksteditor. Een goede analogie is een stapel speelkaarten. Als ik 2 buffers heb, heb ik een stapel van 2 kaarten. De kaart bovenop is de enige kaart die ik zie, maar ik weet dat er kaarten onder zitten. Als ik de `file1.js` buffer zie weergegeven, dan is de `file1.js` kaart bovenop de stapel. Ik kan de andere kaart, `file2.js`, hier niet zien, maar hij is er. Als ik van buffer wissel naar `file2.js`, is die `file2.js` kaart nu bovenop de stapel en is de `file1.js` kaart eronder.

Als je Vim nog niet eerder hebt gebruikt, is dit een nieuw concept. Neem de tijd om het te begrijpen.

## Vim verlaten

Trouwens, als je meerdere buffers geopend hebt, kun je ze allemaal sluiten met quit-all:

```shell
:qall
```

Als je wilt sluiten zonder je wijzigingen op te slaan, voeg dan gewoon `!` aan het einde toe:

```shell
:qall!
```

Om alles op te slaan en te sluiten, voer je uit:

```shell
:wqall
```

## Vensters

Een venster is een viewport op een buffer. Als je van een gangbare editor komt, kan dit concept je bekend voorkomen. De meeste teksteditors hebben de mogelijkheid om meerdere vensters weer te geven. In Vim kun je ook meerdere vensters hebben.

Laten we `file1.js` opnieuw vanuit de terminal openen:

```bash
vim file1.js
```

Eerder schreef ik dat je naar de `file1.js` buffer kijkt. Hoewel dat correct was, was die uitspraak onvolledig. Je kijkt naar de `file1.js` buffer, weergegeven door **een venster**. Een venster is hoe je een buffer bekijkt.

Verlaat Vim nog niet. Voer uit:

```shell
:split file2.js
```

Nu kijk je naar twee buffers door **twee vensters**. Het bovenste venster toont de `file2.js` buffer. Het onderste venster toont de `file1.js` buffer.

Als je tussen vensters wilt navigeren, gebruik dan deze sneltoetsen:

```shell
Ctrl-W H    Verplaatst de cursor naar het linker venster
Ctrl-W J    Verplaatst de cursor naar het venster eronder
Ctrl-W K    Verplaatst de cursor naar het bovenste venster
Ctrl-W L    Verplaatst de cursor naar het rechter venster
```

Voer nu uit:

```shell
:vsplit file3.js
```

Je ziet nu drie vensters die drie buffers weergeven. Eén venster toont de `file3.js` buffer, een ander venster toont de `file2.js` buffer, en een ander venster toont de `file1.js` buffer.

Je kunt meerdere vensters hebben die dezelfde buffer weergeven. Terwijl je in het bovenste linker venster bent, typ:

```shell
:buffer file2.js
```

Nu tonen beide vensters de `file2.js` buffer. Als je begint te typen in een `file2.js` venster, zie je dat beide vensters die de `file2.js` buffers weergeven in realtime worden bijgewerkt.

Om het huidige venster te sluiten, kun je `Ctrl-W C` uitvoeren of `:quit` typen. Wanneer je een venster sluit, blijft de buffer daar (voeg `:buffers` uit om dit te bevestigen).

Hier zijn enkele nuttige normale modus venstercommando's:

```shell
Ctrl-W V    Opent een nieuwe verticale splitsing
Ctrl-W S    Opent een nieuwe horizontale splitsing
Ctrl-W C    Sluit een venster
Ctrl-W O    Maakt het huidige venster het enige venster op het scherm en sluit andere vensters
```

En hier is een lijst van nuttige venster commandoregelcommando's:

```shell
:vsplit bestandsnaam    Split venster verticaal
:split bestandsnaam     Split venster horizontaal
:new bestandsnaam       Maak nieuw venster
```

Neem de tijd om ze te begrijpen. Voor meer informatie, kijk naar `:h window`.

## Tabbladen

Een tabblad is een verzameling vensters. Denk eraan als een lay-out voor vensters. In de meeste moderne teksteditors (en moderne internetbrowsers) betekent een tabblad een geopend bestand / pagina en wanneer je het sluit, verdwijnt dat bestand / pagina. In Vim vertegenwoordigt een tabblad geen geopend bestand. Wanneer je een tabblad in Vim sluit, sluit je geen bestand. Je sluit alleen de lay-out. De bestanden die in die lay-out zijn geopend, zijn nog steeds niet gesloten, ze zijn nog steeds geopend in hun buffers.

Laten we Vim tabbladen in actie zien. Open `file1.js`:

```bash
vim file1.js
```

Om `file2.js` in een nieuw tabblad te openen:

```shell
:tabnew file2.js
```

Je kunt ook Vim de bestandsnaam laten aanvullen die je wilt openen in een *nieuw tabblad* door `<Tab>` in te drukken (geen woordspeling bedoeld).

Hieronder staat een lijst met nuttige tabbladnavigaties:

```shell
:tabnew file.txt    Open file.txt in een nieuw tabblad
:tabclose           Sluit het huidige tabblad
:tabnext            Ga naar het volgende tabblad
:tabprevious        Ga naar het vorige tabblad
:tablast            Ga naar het laatste tabblad
:tabfirst           Ga naar het eerste tabblad
```

Je kunt ook `gt` uitvoeren om naar de volgende tabpagina te gaan (je kunt naar het vorige tabblad gaan met `gT`). Je kunt een aantal als argument aan `gt` doorgeven, waarbij het aantal het tabbladnummer is. Om naar het derde tabblad te gaan, doe `3gt`.

Een voordeel van meerdere tabbladen is dat je verschillende vensterindelingen in verschillende tabbladen kunt hebben. Misschien wil je dat je eerste tabblad 3 verticale vensters heeft en het tweede tabblad een gemengde horizontale en verticale vensterindeling heeft. Tabblad is het perfecte hulpmiddel voor deze taak!

Om Vim met meerdere tabbladen te starten, kun je dit vanuit de terminal doen:

```bash
vim -p file1.js file2.js file3.js
```

## Bewegen in 3D

Bewegen tussen vensters is als reizen in twee dimensies langs de X-Y-as in cartesische coördinaten. Je kunt naar het bovenste, rechter, onderste en linker venster bewegen met `Ctrl-W H/J/K/L`.

Bewegen tussen buffers is als reizen over de Z-as in cartesische coördinaten. Stel je voor dat je bufferbestanden zich langs de Z-as uitlijnen. Je kunt de Z-as één buffer tegelijk doorkruisen met `:bnext` en `:bprevious`. Je kunt naar elke coördinaat in de Z-as springen met `:buffer bestandsnaam/buffer nummer`.

Je kunt je in *drie-dimensionale ruimte* bewegen door venster- en bufferbewegingen te combineren. Je kunt naar het bovenste, rechter, onderste of linker venster (X-Y navigaties) bewegen met vensterbewegingen. Aangezien elk venster buffers bevat, kun je vooruit en achteruit (Z navigaties) bewegen met bufferbewegingen.

## Buffers, Vensters en Tabbladen Slim Gebruiken

Je hebt geleerd wat buffers, vensters en tabbladen zijn en hoe ze werken in Vim. Nu je ze beter begrijpt, kun je ze in je eigen workflow gebruiken.

Iedereen heeft een andere workflow, hier is de mijne als voorbeeld:
- Eerst gebruik ik buffers om alle benodigde bestanden voor de huidige taak op te slaan. Vim kan veel geopende buffers aan voordat het begint te vertragen. Bovendien zal het openen van veel buffers mijn scherm niet rommelig maken. Ik zie op elk moment slechts één buffer (ervan uitgaande dat ik slechts één venster heb), waardoor ik me op één scherm kan concentreren. Wanneer ik ergens naartoe moet, kan ik snel naar elke geopende buffer vliegen wanneer ik maar wil.
- Ik gebruik meerdere vensters om meerdere buffers tegelijk te bekijken, meestal wanneer ik bestanden vergelijk, documentatie lees of een codeflow volg. Ik probeer het aantal geopende vensters tot niet meer dan drie te beperken omdat mijn scherm anders rommelig wordt (ik gebruik een kleine laptop). Wanneer ik klaar ben, sluit ik eventuele extra vensters. Minder vensters betekent minder afleidingen.
- In plaats van tabbladen gebruik ik [tmux](https://github.com/tmux/tmux/wiki) vensters. Ik gebruik meestal meerdere tmux-vensters tegelijk. Bijvoorbeeld, één tmux-venster voor client-side codes en een ander voor backend codes.

Mijn workflow kan er anders uitzien dan die van jou, afhankelijk van je bewerkingsstijl en dat is prima. Experimenteer om je eigen flow te ontdekken, passend bij jouw codestijl.