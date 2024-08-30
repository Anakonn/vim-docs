---
description: Leer de 10 verschillende soorten Vim-registers en hoe je ze efficiënt
  kunt gebruiken om repetitief typen te voorkomen en je workflow te verbeteren.
title: Ch08. Registers
---

Leren over Vim-registers is als het voor de eerste keer leren van algebra. Je dacht niet dat je het nodig had totdat je het nodig had.

Je hebt waarschijnlijk Vim-registers gebruikt toen je een tekst kopieerde of verwijderde en deze vervolgens plakte met `p` of `P`. Wist je echter dat Vim 10 verschillende soorten registers heeft? Correct gebruikt, kunnen Vim-registers je behoeden voor repetitief typen.

In dit hoofdstuk zal ik alle soorten Vim-registers doornemen en hoe je ze efficiënt kunt gebruiken.

## De Tien Registertypes

Hier zijn de 10 Vim-registertypes:

1. Het onbenoemde register (`""`).
2. De genummerde registers (`"0-9`).
3. Het kleine verwijderregister (`"-`).
4. De benoemde registers (`"a-z`).
5. De alleen-lezen registers (`":`, `".`, en `"%`).
6. Het alternatieve bestandsregister (`"#`).
7. Het expressieregister (`"=`).
8. De selectieregisters (`"*` en `"+`).
9. Het zwarte gat-register (`"_`).
10. Het laatste zoekpatroonregister (`"/`).

## Registeroperators

Om registers te gebruiken, moet je ze eerst opslaan met operators. Hier zijn enkele operators die waarden in registers opslaan:

```shell
y    Yank (kopiëren)
c    Verwijder tekst en start invoegmodus
d    Verwijder tekst
```

Er zijn meer operators (zoals `s` of `x`), maar de bovenstaande zijn de nuttige. De vuistregel is: als een operator tekst kan verwijderen, slaat deze waarschijnlijk de tekst op in registers.

Om tekst uit registers te plakken, kun je gebruiken:

```shell
p    Plak de tekst na de cursor
P    Plak de tekst voor de cursor
```

Zowel `p` als `P` accepteren een tel en een register symbool als argumenten. Bijvoorbeeld, om tien keer te plakken, doe `10p`. Om de tekst uit register a te plakken, doe `"ap`. Om de tekst uit register a tien keer te plakken, doe `10"ap`. Trouwens, de `p` staat technisch gezien voor "plaatsen", niet "plakken", maar ik denk dat plakken een meer conventioneel woord is.

De algemene syntaxis om de inhoud van een specifiek register te krijgen is `"a`, waarbij `a` het register symbool is.

## Registers Aanroepen Vanuit Invoegmodus

Alles wat je in dit hoofdstuk leert, kan ook in de invoegmodus worden uitgevoerd. Om de tekst uit register a te krijgen, doe je normaal gesproken `"ap`. Maar als je in de invoegmodus bent, voer je `Ctrl-R a` uit. De syntaxis om registers vanuit de invoegmodus aan te roepen is:

```shell
Ctrl-R a
```

Waarbij `a` het register symbool is. Nu je weet hoe je registers kunt opslaan en ophalen, laten we erin duiken!

## Het Onbenoemde Register

Om de tekst uit het onbenoemde register te krijgen, doe je `""p`. Het slaat de laatste tekst op die je hebt gekopieerd, gewijzigd of verwijderd. Als je een andere yank, wijziging of verwijdering doet, zal Vim automatisch de oude tekst vervangen. Het onbenoemde register is als de standaard kopie / plak operatie van een computer.

Standaard is `p` (of `P`) verbonden met het onbenoemde register (vanaf nu zal ik naar het onbenoemde register verwijzen met `p` in plaats van `""p`).

## De Genummerde Registers

Genummerde registers vullen zichzelf automatisch in oplopende volgorde. Er zijn 2 verschillende genummerde registers: het gekopieerde register (`0`) en de genummerde registers (`1-9`). Laten we eerst het gekopieerde register bespreken.

### Het Gekopieerde Register

Als je een hele regel tekst kopieert (`yy`), slaat Vim die tekst eigenlijk op in twee registers:

1. Het onbenoemde register (`p`).
2. Het gekopieerde register (`"0p`).

Wanneer je een andere tekst kopieert, zal Vim zowel het gekopieerde register als het onbenoemde register bijwerken. Andere bewerkingen (zoals verwijderen) worden niet opgeslagen in register 0. Dit kan in je voordeel werken, want tenzij je een andere yank doet, zal de gekopieerde tekst er altijd zijn, ongeacht hoeveel wijzigingen en verwijderingen je doet.

Bijvoorbeeld, als je:
1. Een regel kopieert (`yy`)
2. Een regel verwijdert (`dd`)
3. Een andere regel verwijdert (`dd`)

Zal het gekopieerde register de tekst van stap één bevatten.

Als je:
1. Een regel kopieert (`yy`)
2. Een regel verwijdert (`dd`)
3. Een andere regel kopieert (`yy`)

Zal het gekopieerde register de tekst van stap drie bevatten.

Een laatste tip, terwijl je in de invoegmodus bent, kun je snel de tekst plakken die je net hebt gekopieerd met `Ctrl-R 0`.

### De Niet-nul Genummerde Registers

Wanneer je een tekst wijzigt of verwijdert die minstens één regel lang is, wordt die tekst opgeslagen in de genummerde registers 1-9, gesorteerd op meest recent.

Bijvoorbeeld, als je deze regels hebt:

```shell
regel drie
regel twee
regel één
```

Met je cursor op "regel drie", verwijder ze één voor één met `dd`. Zodra alle regels zijn verwijderd, zou register 1 "regel één" (meest recent) moeten bevatten, register twee "regel twee" (tweede meest recent), en register drie "regel drie" (oudste). Om de inhoud van register één te krijgen, doe je `"1p`.

Als opmerking, deze genummerde registers worden automatisch verhoogd bij het gebruik van de puntopdracht. Als je genummerd register één (`"1`) "regel één" bevat, register twee (`"2`) "regel twee", en register drie (`"3`) "regel drie", kun je ze opeenvolgend plakken met deze truc:
- Doe `"1P` om de inhoud van genummerd register één te plakken ("1).
- Doe `.` om de inhoud van genummerd register twee te plakken ("2).
- Doe `.` om de inhoud van genummerd register drie te plakken ("3).

Deze truc werkt met elk genummerd register. Als je begon met `"5P`, zou `.` `"6P` doen, `.` weer zou `"7P` doen, enzovoort.

Kleine verwijderingen zoals een woordverwijdering (`dw`) of woordwijziging (`cw`) worden niet opgeslagen in de genummerde registers. Ze worden opgeslagen in het kleine verwijderregister (`"-`), dat ik hierna zal bespreken.

## Het Kleine Verwijderregister

Wijzigingen of verwijderingen van minder dan één regel worden niet opgeslagen in de genummerde registers 0-9, maar in het kleine verwijderregister (`"-`).

Bijvoorbeeld:
1. Verwijder een woord (`diw`)
2. Verwijder een regel (`dd`)
3. Verwijder een regel (`dd`)

`"-p` geeft je het verwijderde woord van stap één.

Een ander voorbeeld:
1. Ik verwijder een woord (`diw`)
2. Ik verwijder een regel (`dd`)
3. Ik verwijder een woord (`diw`)

`"-p` geeft je het verwijderde woord van stap drie. `"1p` geeft je de verwijderde regel van stap twee. Helaas is er geen manier om het verwijderde woord van stap één terug te halen, omdat het kleine verwijderregister slechts één item opslaat. Als je echter de tekst van stap één wilt behouden, kun je dit doen met de benoemde registers.

## Het Benoemde Register

De benoemde registers zijn de meest veelzijdige registers van Vim. Ze kunnen gekopieerde, gewijzigde en verwijderde teksten opslaan in registers a-z. In tegenstelling tot de vorige 3 registertypes die je hebt gezien, die automatisch teksten opslaan in registers, moet je Vim expliciet vertellen om het benoemde register te gebruiken, waardoor je volledige controle hebt.

Om een woord in register a te kopiëren, kun je dit doen met `"ayiw`.
- `"a` vertelt Vim dat de volgende actie (verwijderen / wijzigen / kopiëren) zal worden opgeslagen in register a.
- `yiw` kopieert het woord.

Om de tekst uit register a te krijgen, voer je `"ap` uit. Je kunt alle zesentwintig alfabetische tekens gebruiken om zesentwintig verschillende teksten op te slaan met benoemde registers.

Soms wil je misschien toevoegen aan je bestaande benoemde register. In dat geval kun je je tekst toevoegen in plaats van helemaal opnieuw te beginnen. Om dat te doen, kun je de hoofdletterversie van dat register gebruiken. Bijvoorbeeld, stel dat je het woord "Hallo " al in register a hebt opgeslagen. Als je "wereld" aan register a wilt toevoegen, kun je de tekst "wereld" vinden en deze kopiëren met het A-register (`"Ayiw`).

## De Alleen-lezen Registers

Vim heeft drie alleen-lezen registers: `.`, `:`, en `%`. Ze zijn vrij eenvoudig te gebruiken:

```shell
.    Slaat de laatst ingevoerde tekst op
:    Slaat de laatst uitgevoerde opdrachtregel op
%    Slaat de naam van het huidige bestand op
```

Als de laatste tekst die je schreef "Hallo Vim" was, zal het uitvoeren van `".p` de tekst "Hallo Vim" afdrukken. Als je de naam van het huidige bestand wilt krijgen, voer je `"%p` uit. Als je de opdracht `:s/foo/bar/g` uitvoert, zal het uitvoeren van `":p` de letterlijke tekst "s/foo/bar/g" afdrukken.

## Het Alternatieve Bestandsregister

In Vim vertegenwoordigt `#` meestal het alternatieve bestand. Een alternatief bestand is het laatste bestand dat je hebt geopend. Om de naam van het alternatieve bestand in te voegen, kun je `"#p` gebruiken.

## Het Expressieregister

Vim heeft een expressieregister, `"=`, om expressies te evalueren.

Om wiskundige expressies `1 + 1` te evalueren, voer je uit:

```shell
"=1+1<Enter>p
```

Hier vertel je Vim dat je het expressieregister gebruikt met `"=`. Je expressie is (`1 + 1`). Je moet `p` typen om het resultaat te krijgen. Zoals eerder vermeld, kun je ook het register vanuit de invoegmodus benaderen. Om een wiskundige expressie vanuit de invoegmodus te evalueren, kun je doen:

```shell
Ctrl-R =1+1
```

Je kunt ook de waarden uit elk register ophalen via het expressieregister wanneer je het met `@` toevoegt. Als je de tekst uit register a wilt krijgen:

```shell
"=@a
```

Druk dan op `<Enter>`, gevolgd door `p`. Op dezelfde manier, om waarden uit register a te halen terwijl je in de invoegmodus bent:

```shell
Ctrl-r =@a
```

Expressies zijn een uitgebreid onderwerp in Vim, dus ik zal hier alleen de basis behandelen. Ik zal expressies in meer detail behandelen in latere Vimscript-hoofdstukken.

## De Selectieregisters

Heb je niet soms de wens dat je een tekst van externe programma's kunt kopiëren en lokaal in Vim kunt plakken, en vice versa? Met de selectieregisters van Vim kan dat. Vim heeft twee selectieregisters: `quotestar` (`"*`) en `quoteplus` (`"+`). Je kunt ze gebruiken om gekopieerde tekst van externe programma's te benaderen.

Als je in een extern programma (zoals de Chrome-browser) bent en je kopieert een blok tekst met `Ctrl-C` (of `Cmd-C`, afhankelijk van je besturingssysteem), zou je normaal gesproken `p` niet kunnen gebruiken om de tekst in Vim te plakken. Echter, zowel Vim's `"+` als `"*` zijn verbonden met je klembord, zodat je de tekst daadwerkelijk kunt plakken met `"+p` of `"*p`. Omgekeerd, als je een woord uit Vim kopieert met `"+yiw` of `"*yiw`, kun je die tekst in het externe programma plakken met `Ctrl-V` (of `Cmd-V`). Let op dat dit alleen werkt als je Vim-programma de optie `+clipboard` heeft (om dit te controleren, voer je `:version` uit).

Je vraagt je misschien af of `"*` en `"+` hetzelfde doen, waarom heeft Vim dan twee verschillende registers? Sommige machines gebruiken het X11-venstersysteem. Dit systeem heeft 3 soorten selecties: primair, secundair en klembord. Als je machine X11 gebruikt, gebruikt Vim X11's *primaire* selectie met het `quotestar` (`"*`) register en X11's *klembord* selectie met het `quoteplus` (`"+`) register. Dit is alleen van toepassing als je de optie `+xterm_clipboard` beschikbaar hebt in je Vim-build. Als je Vim geen `xterm_clipboard` heeft, is het geen groot probleem. Het betekent gewoon dat zowel `quotestar` als `quoteplus` verwisselbaar zijn (de mijne heeft dat ook niet).

Ik vind het doen van `=*p` of `=+p` (of `"*p` of `"+p`) omslachtig. Om Vim te laten plakken wat je van het externe programma hebt gekopieerd met alleen `p`, kun je dit in je vimrc toevoegen:

```shell
set clipboard=unnamed
```

Nu, wanneer ik een tekst kopieer van een extern programma, kan ik het plakken met het onbenoemde register, `p`. Ik kan ook een tekst uit Vim kopiëren en deze naar een extern programma plakken. Als je `+xterm_clipboard` hebt, wil je misschien zowel de opties `unnamed` als `unnamedplus` gebruiken.

## Het Zwarte Gat-register

Elke keer dat je een tekst verwijdert of wijzigt, wordt die tekst automatisch opgeslagen in een Vim-register. Er zullen momenten zijn waarop je niets in het register wilt opslaan. Hoe kun je dat doen?

Je kunt het zwarte gat-register (`"_`) gebruiken. Om een regel te verwijderen en ervoor te zorgen dat Vim de verwijderde regel niet in een register opslaat, gebruik je `"_dd`.

Het zwarte gat-register is als de `/dev/null` van registers.

## Het Laatste Zoekpatroonregister

Om je laatste zoekopdracht (`/` of `?`) te plakken, kun je het laatste zoekpatroonregister (`"/`) gebruiken. Om de laatste zoekterm te plakken, gebruik je `"/p`.

## Registers Bekijken

Om al je registers te bekijken, gebruik je de opdracht `:register`. Om alleen de registers "a, "1, en "-", te bekijken, gebruik je `:register a 1 -`.

Er is een plugin genaamd [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) die je in staat stelt om een kijkje te nemen in de inhoud van de registers wanneer je `"` of `@` in de normale modus en `Ctrl-R` in de invoegmodus indrukt. Ik vind deze plugin erg nuttig omdat ik me meestal de inhoud van mijn registers niet kan herinneren. Probeer het eens!

## Een Register Uitvoeren

De benoemde registers zijn niet alleen voor het opslaan van teksten. Ze kunnen ook macro's uitvoeren met `@`. Ik zal macro's in het volgende hoofdstuk behandelen.

Houd er rekening mee dat omdat macro's in Vim-registers worden opgeslagen, je per ongeluk de opgeslagen tekst kunt overschrijven met macro's. Als je de tekst "Hallo Vim" in register a opslaat en later een macro in hetzelfde register opneemt (`qa{macro-sequence}q`), zal die macro je eerder opgeslagen "Hallo Vim" tekst overschrijven.
## Een Register Wissen

Technisch gezien is het niet nodig om een register te wissen, omdat de volgende tekst die je onder dezelfde registratienaam opslaat, deze zal overschrijven. Je kunt echter snel een benoemd register wissen door een lege macro op te nemen. Als je bijvoorbeeld `qaq` uitvoert, zal Vim een lege macro opnemen in register a.

Een andere optie is om de opdracht `:call setreg('a', 'hello register a')` uit te voeren, waarbij a het register a is en "hello register a" de tekst is die je wilt opslaan.

Een andere manier om een register te wissen, is door de inhoud van "a register in te stellen op een lege string met de expressie `:let @a = ''`.

## De Inhoud van een Register Plaatsen

Je kunt de `:put` opdracht gebruiken om de inhoud van een register te plakken. Als je bijvoorbeeld `:put a` uitvoert, zal Vim de inhoud van register a onder de huidige regel afdrukken. Dit gedraagt zich veel zoals `"ap`, met het verschil dat de normale modusopdracht `p` de registerinhoud na de cursor afdrukt en de opdracht `:put` de registerinhoud op een nieuwe regel afdrukt.

Aangezien `:put` een opdrachtregelopdracht is, kun je het een adres meegeven. `:10put a` zal tekst uit register a onder regel 10 plakken.

Een coole truc is om `:put` te gebruiken met het zwarte gat-register (`"_`). Aangezien het zwarte gat-register geen tekst opslaat, zal `:put _` een lege regel invoegen. Je kunt dit combineren met de globale opdracht om meerdere lege regels in te voegen. Bijvoorbeeld, om lege regels in te voegen onder alle regels die de tekst "end" bevatten, voer je `:g/end/put _` uit. Je leert later over de globale opdracht.

## Registers Slim Leren

Je hebt het einde bereikt. Gefeliciteerd! Als je je overweldigd voelt door de hoeveelheid informatie, ben je niet alleen. Toen ik voor het eerst begon met leren over Vim-registers, was er veel te veel informatie om in één keer te verwerken.

Ik denk niet dat je alle registers onmiddellijk moet onthouden. Om productief te worden, kun je beginnen met het gebruik van deze 3 registers:
1. Het ongebruikte register (`""`).
2. De benoemde registers (`"a-z`).
3. De genummerde registers (`"0-9`).

Aangezien het ongebruikte register standaard is voor `p` en `P`, hoef je alleen maar twee registers te leren: de benoemde registers en de genummerde registers. Leer geleidelijk meer registers wanneer je ze nodig hebt. Neem je tijd.

De gemiddelde mens heeft een beperkte capaciteit voor kortetermijngeheugen, ongeveer 5 - 7 items tegelijk. Daarom gebruik ik in mijn dagelijkse bewerking meestal ongeveer 5 - 7 benoemde registers. Er is geen manier waarop ik alle zesentwintig in mijn hoofd kan onthouden. Ik begin normaal gesproken met register a, dan b, en ga op volgorde van het alfabet verder. Probeer het en experimenteer om te zien welke techniek het beste voor jou werkt.

Vim-registers zijn krachtig. Strategisch gebruikt, kan het je besparen van het typen van talloze herhalende teksten. Laten we nu leren over macro's.