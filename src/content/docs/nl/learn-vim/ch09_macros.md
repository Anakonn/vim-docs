---
description: Leer hoe je Vim-macro's kunt gebruiken om repetitieve taken te automatiseren
  en je bewerkingen efficiënter te maken met handige registraties.
title: Ch09. Macros
---

Wanneer je bestanden bewerkt, kan het zijn dat je dezelfde acties herhaaldelijk uitvoert. Zou het niet fijn zijn als je die acties één keer kunt uitvoeren en ze telkens kunt herhalen wanneer je ze nodig hebt? Met Vim-macro's kun je acties opnemen en ze opslaan in Vim-registers om ze uit te voeren wanneer je maar wilt.

In dit hoofdstuk leer je hoe je macro's kunt gebruiken om alledaagse taken te automatiseren (plus het ziet er cool uit om je bestand zichzelf te laten bewerken).

## Basis Macro's

Hier is de basis syntaxis van een Vim-macro:

```shell
qa                     Begin met opnemen van een macro in register a
q (terwijl opnemen)    Stop met opnemen van de macro
```

Je kunt elke kleine letter (a-z) kiezen om macro's op te slaan. Hier is hoe je een macro kunt uitvoeren:

```shell
@a    Voer macro uit vanuit register a
@@    Voer de laatst uitgevoerde macro's uit
```

Stel dat je deze tekst hebt en je wilt alles op elke regel hoofdletters geven:

```shell
hello
vim
macros
are
awesome
```

Met je cursor aan het begin van de regel "hello", voer je uit:

```shell
qa0gU$jq
```

De uitleg:
- `qa` begint met opnemen van een macro in register a.
- `0` gaat naar het begin van de regel.
- `gU$` zet de tekst van je huidige locatie tot het einde van de regel in hoofdletters.
- `j` gaat één regel naar beneden.
- `q` stopt met opnemen.

Om het opnieuw af te spelen, voer je `@a` uit. Net als bij veel andere Vim-commando's, kun je een telargument doorgeven aan macro's. Bijvoorbeeld, door `3@a` uit te voeren, wordt de macro drie keer uitgevoerd.

## Veiligheidsmechanisme

De uitvoering van de macro eindigt automatisch wanneer er een fout optreedt. Stel dat je deze tekst hebt:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Als je het eerste woord op elke regel in hoofdletters wilt zetten, zou deze macro moeten werken:

```shell
qa0W~jq
```

Hier is de uitleg van het bovenstaande commando:
- `qa` begint met opnemen van een macro in register a.
- `0` gaat naar het begin van de regel.
- `W` gaat naar het volgende WOORD.
- `~` wisselt de hoofdlettergevoeligheid van het teken onder de cursor.
- `j` gaat één regel naar beneden.
- `q` stopt met opnemen.

Ik geef er de voorkeur aan om mijn macro-uitvoering te overcounten dan te ondercounten, dus ik noem het meestal negenennegentig keer (`99@a`). Met dit commando voert Vim deze macro niet daadwerkelijk negenennegentig keer uit. Wanneer Vim de laatste regel bereikt en de `j`-beweging uitvoert, vindt het geen regel meer om naar beneden te gaan, gooit een fout en stopt de uitvoering van de macro.

Het feit dat de uitvoering van de macro stopt bij de eerste fout is een goede functie, anders zou Vim deze macro negenennegentig keer blijven uitvoeren, ook al heeft het al het einde van de regel bereikt.

## Commandoregel Macro

Het uitvoeren van `@a` in de normale modus is niet de enige manier waarop je macro's in Vim kunt uitvoeren. Je kunt ook het commando `:normal @a` in de commandoregel uitvoeren. `:normal` stelt de gebruiker in staat om elk normaal modus commando uit te voeren dat als argument wordt doorgegeven. In het bovenstaande geval is het hetzelfde als het uitvoeren van `@a` vanuit de normale modus.

Het `:normal` commando accepteert reeksen als argumenten. Je kunt dit gebruiken om macro's in geselecteerde reeksen uit te voeren. Als je je macro tussen regels 2 en 3 wilt uitvoeren, kun je `:2,3 normal @a` uitvoeren.

## Een Macro Uitvoeren Over Meerdere Bestanden

Stel dat je meerdere `.txt`-bestanden hebt, elk met wat tekst. Jouw taak is om alleen het eerste woord op regels die het woord "donut" bevatten in hoofdletters te zetten. Stel dat je `0W~j` in register a hebt (dezelfde macro als eerder). Hoe kun je dit snel doen?

Eerste bestand:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

Tweede bestand:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

Derde bestand:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

Hier is hoe je het kunt doen:
- `:args *.txt` om alle `.txt`-bestanden in je huidige directory te vinden.
- `:argdo g/donut/normal @a` voert het globale commando `g/donut/normal @a` uit op elk bestand binnen `:args`.
- `:argdo update` voert het `update`-commando uit om elk bestand binnen `:args` op te slaan wanneer de buffer is gewijzigd.

Als je niet bekend bent met het globale commando `:g/donut/normal @a`, het voert het commando dat je geeft (`normal @a`) uit op regels die overeenkomen met het patroon (`/donut/`). Ik zal het globale commando in een later hoofdstuk behandelen.

## Recursieve Macro

Je kunt een macro recursief uitvoeren door dezelfde macro-register aan te roepen terwijl je die macro opneemt. Stel dat je deze lijst weer hebt en je de hoofdlettergevoeligheid van het eerste woord moet wisselen:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Laten we het deze keer recursief doen. Voer uit:

```shell
qaqqa0W~j@aq
```

Hier is de uitleg van de stappen:
- `qaq` registreert een lege macro a. Het is noodzakelijk om met een leeg register te beginnen omdat wanneer je de macro recursief aanroept, het alles in dat register zal uitvoeren.
- `qa` begint met opnemen in register a.
- `0` gaat naar het eerste teken in de huidige regel.
- `W` gaat naar het volgende WOORD.
- `~` wisselt de hoofdlettergevoeligheid van het teken onder de cursor.
- `j` gaat één regel naar beneden.
- `@a` voert macro a uit.
- `q` stopt met opnemen.

Nu kun je gewoon `@a` uitvoeren en kijken hoe Vim de macro recursief uitvoert.

Hoe wist de macro wanneer hij moest stoppen? Toen de macro op de laatste regel was, probeerde hij `j` uit te voeren; aangezien er geen regel meer was om naar beneden te gaan, stopte hij de uitvoering van de macro.

## Een Macro Toevoegen

Als je acties aan een bestaande macro moet toevoegen, in plaats van de macro helemaal opnieuw te maken, kun je acties aan een bestaande toevoegen. In het registerhoofdstuk heb je geleerd dat je een benoemd register kunt aanvullen door de hoofdletterversie van het symbool te gebruiken. Dezelfde regel geldt. Om acties aan register a macro toe te voegen, gebruik register A.

Neem een macro op in register a: `qa0W~q` (deze reeks wisselt de hoofdlettergevoeligheid van het volgende WOORD in een regel). Als je een nieuwe reeks wilt toevoegen om ook een punt aan het einde van de regel toe te voegen, voer dan uit:

```shell
qAA.<Esc>q
```

De uitleg:
- `qA` begint met opnemen van de macro in register A.
- `A.<Esc>` voegt aan het einde van de regel (hier is `A` het invoermoduscommando, niet te verwarren met de macro A) een punt toe, en verlaat vervolgens de invoermodus.
- `q` stopt met opnemen van de macro.

Nu, wanneer je `@a` uitvoert, wisselt het niet alleen de hoofdlettergevoeligheid van het volgende WOORD, maar voegt het ook een punt aan het einde van de regel toe.

## Een Macro Wijzigen

Wat als je nieuwe acties in het midden van een macro moet toevoegen?

Stel dat je een macro hebt die het eerste werkelijke woord wisselt en een punt aan het einde van de regel toevoegt, `0W~A.<Esc>` in register a. Stel dat je tussen het hoofdletters geven van het eerste woord en het toevoegen van een punt aan het einde van de regel het woord "deep fried" moet toevoegen, net voor het woord "donut" *(want het enige dat beter is dan gewone donuts zijn deep fried donuts)*.

Ik zal de tekst uit het eerdere gedeelte hergebruiken:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Laten we eerst de bestaande macro aanroepen (stel dat je de macro uit het vorige gedeelte in register a hebt bewaard) met `:put a`:

```shell
0W~A.^[
```

Wat is deze `^[`? Heb je niet `0W~A.<Esc>` gedaan? Waar is de `<Esc>`? `^[` is de *interne code* representatie van Vim voor `<Esc>`. Met bepaalde speciale toetsen drukt Vim de representatie van die toetsen af in de vorm van interne codes. Enkele veelvoorkomende toetsen die interne code representaties hebben zijn `<Esc>`, `<Backspace>` en `<Enter>`. Er zijn meer speciale toetsen, maar die vallen buiten de reikwijdte van dit hoofdstuk.

Terug naar de macro, direct na de hoofdlettergevoeligheid wisselende operator (`~`), laten we de instructies toevoegen om naar het einde van de regel te gaan (`$`), één woord terug te gaan (`b`), naar de invoermodus te gaan (`i`), "deep fried " te typen (vergeet de spatie na "fried " niet), en de invoermodus te verlaten (`<Esc>`).

Hier is wat je uiteindelijk zult krijgen:

```shell
0W~$bideep fried <Esc>A.^[
```

Er is een klein probleem. Vim begrijpt `<Esc>` niet. Je kunt letterlijk `<Esc>` niet typen. Je moet de interne code representatie voor de `<Esc>`-toets schrijven. Terwijl je in de invoermodus bent, druk je op `Ctrl-V` gevolgd door `<Esc>`. Vim zal `^[` afdrukken. `Ctrl-V` is een invoermodusoperator om het volgende niet-cijfer karakter *letterlijk* in te voegen. Je macrocode zou er nu zo uit moeten zien:

```shell
0W~$bideep fried ^[A.^[
```

Om de gewijzigde instructie in register a toe te voegen, kun je het op dezelfde manier doen als het toevoegen van een nieuwe invoer in een benoemd register. Aan het begin van de regel voer je `"ay$` uit om de gekopieerde tekst in register a op te slaan.

Nu, wanneer je `@a` uitvoert, zal je macro de hoofdlettergevoeligheid van het eerste woord wisselen, "deep fried " vóór "donut" toevoegen, en een "." aan het einde van de regel toevoegen. Yum!

Een alternatieve manier om een macro te wijzigen is door een commandoregeluitdrukking te gebruiken. Voer `:let @a="`, dan `Ctrl-R a`, dit zal letterlijk de inhoud van register a plakken. Vergeet tenslotte niet de dubbele aanhalingstekens (`"`) te sluiten. Je zou iets kunnen hebben als `:let @a="0W~$bideep fried ^[A.^["`.

## Macro Redundantie

Je kunt gemakkelijk macro's van het ene register naar het andere dupliceren. Bijvoorbeeld, om een macro in register a naar register z te dupliceren, kun je `:let @z = @a` doen. `@a` vertegenwoordigt de inhoud van register a. Nu, als je `@z` uitvoert, voert het exact dezelfde acties uit als `@a`.

Ik vind het nuttig om een redundantie te creëren voor mijn meest gebruikte macro's. In mijn workflow neem ik meestal macro's op in de eerste zeven alfabetische letters (a-g) en vervang ik ze vaak zonder veel na te denken. Als ik de nuttige macro's naar het einde van het alfabet verplaats, kan ik ze behouden zonder me zorgen te maken dat ik ze per ongeluk vervang.

## Serie vs Parallel Macro

Vim kan macro's in serie en parallel uitvoeren. Stel dat je deze tekst hebt:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Als je een macro wilt opnemen om alle hoofdletters "FUNC" in kleine letters te zetten, zou deze macro moeten werken:

```shell
qa0f{gui{jq
```

De uitleg:
- `qa` begint met opnemen in register a.
- `0` gaat naar de eerste regel.
- `f{` vindt de eerste instantie van "{".
- `gui{` zet de tekst binnen het haakje tekstobject (`i{`) in kleine letters.
- `j` gaat één regel naar beneden.
- `q` stopt met opnemen van de macro.

Nu kun je `99@a` uitvoeren om het op de resterende regels uit te voeren. Maar wat als je deze importexpressie in je bestand hebt?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Door `99@a` uit te voeren, voert het de macro slechts drie keer uit. Het voert de macro niet uit op de laatste twee regels omdat de uitvoering niet kan worden uitgevoerd op de regel "foo". Dit is te verwachten bij het uitvoeren van de macro in serie. Je kunt altijd naar de volgende regel waar "FUNC4" is gaan en die macro opnieuw afspelen. Maar wat als je alles in één keer wilt doen?

Voer de macro parallel uit.

Vergeet niet dat macro's kunnen worden uitgevoerd met het commando `:normal` (bijv. `:3,5 normal @a` voert macro a uit op regels 3-5). Als je `:1,$ normal @a` uitvoert, zie je dat de macro op alle regels wordt uitgevoerd, behalve de regel "foo". Het werkt!

Hoewel Vim intern de macro's niet daadwerkelijk parallel uitvoert, gedraagt het zich naar buiten toe alsof het dat doet. Vim voert `@a` *onafhankelijk* uit op elke regel van de eerste tot de laatste regel (`1,$`). Aangezien Vim deze macro's onafhankelijk uitvoert, weet elke regel niet dat een van de macro-uitvoeringen is mislukt op de regel "foo".
## Leer Macros op de Slimme Manier

Veel dingen die je doet bij het bewerken zijn repetitief. Om beter te worden in bewerken, krijg de gewoonte om repetitieve acties te detecteren. Gebruik macro's (of puntcommando) zodat je dezelfde actie niet twee keer hoeft uit te voeren. Bijna alles wat je in Vim kunt doen, kan worden gerepliceerd met macro's.

In het begin vind ik het erg ongemakkelijk om macro's te schrijven, maar geef niet op. Met genoeg oefening krijg je de gewoonte om alles te automatiseren.

Je kunt het nuttig vinden om ezelsbruggetjes te gebruiken om je macro's te onthouden. Als je een macro hebt die een functie aanmaakt, gebruik dan het "f register (`qf`). Als je een macro hebt voor numerieke bewerkingen, zou het "n register moeten werken (`qn`). Noem het met het *eerste benoemde register* dat in je opkomt als je aan die bewerking denkt. Ik vind ook dat het "q register een goede standaard macro-register is omdat `qq` minder denkvermogen vereist om op te komen. Ten slotte vind ik het ook leuk om mijn macro's in alfabetische volgorde te verhogen, zoals `qa`, dan `qb`, dan `qc`, enzovoort.

Vind een methode die het beste voor jou werkt.