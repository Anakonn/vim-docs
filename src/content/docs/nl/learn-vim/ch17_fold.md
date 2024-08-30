---
description: Leer hoe je met Vim tekst kunt vouwen om onnodige informatie te verbergen,
  zodat je je beter kunt concentreren op de relevante inhoud van een bestand.
title: Ch17. Fold
---

Wanneer je een bestand leest, zijn er vaak veel irrelevante teksten die je hinderen om te begrijpen wat dat bestand doet. Om de onnodige ruis te verbergen, gebruik je Vim fold.

In dit hoofdstuk leer je verschillende manieren om een bestand te vouwen.

## Handmatige Vouw

Stel je voor dat je een vel papier vouwt om wat tekst te bedekken. De daadwerkelijke tekst verdwijnt niet, deze is er nog steeds. Vim fold werkt op dezelfde manier. Het vouwt een reeks tekst, verbergt deze voor weergave zonder deze daadwerkelijk te verwijderen.

De vouwoperator is `z` (wanneer een papier is gevouwen, heeft het de vorm van de letter z).

Stel dat je deze tekst hebt:

```shell
Vouw mij
Houd mij vast
```

Met de cursor op de eerste regel, typ `zfj`. Vim vouwt beide regels in één. Je zou iets als dit moeten zien:

```shell
+-- 2 regels: Vouw mij -----
```

Hier is de uitleg:
- `zf` is de vouwoperator.
- `j` is de beweging voor de vouwoperator.

Je kunt een gevouwen tekst openen met `zo`. Om de vouw te sluiten, gebruik `zc`.

Vouw is een operator, dus het volgt de grammaticaregels (`werkwoord + zelfstandig naamwoord`). Je kunt de vouwoperator doorgeven met een beweging of tekstobject. Om een interne alinea te vouwen, voer je `zfip` uit. Om tot het einde van een bestand te vouwen, voer je `zfG` uit. Om de teksten tussen `{` en `}` te vouwen, voer je `zfa{` uit.

Je kunt vouwen vanuit de visuele modus. Markeer het gebied dat je wilt vouwen (`v`, `V`, of `Ctrl-v`), en voer dan `zf` uit.

Je kunt een vouw uitvoeren vanuit de opdrachtregelmodus met het `:fold` commando. Om de huidige regel en de regel erna te vouwen, voer je uit:

```shell
:,+1fold
```

`,+1` is het bereik. Als je geen parameters aan het bereik doorgeeft, is het standaard de huidige regel. `+1` is de bereikindicator voor de volgende regel. Om de regels 5 tot 10 te vouwen, voer je `:5,10fold` uit. Om vanaf de huidige positie tot het einde van de regel te vouwen, voer je `:,$fold` uit.

Er zijn veel andere vouw- en ontvouwcommando's. Ik vind ze te veel om te onthouden als je begint. De meest nuttige zijn:
- `zR` om alle vouwen te openen.
- `zM` om alle vouwen te sluiten.
- `za` om een vouw om te schakelen.

Je kunt `zR` en `zM` op elke regel uitvoeren, maar `za` werkt alleen wanneer je op een gevouwen / ontvouwde regel staat. Om meer vouwcommando's te leren, kijk naar `:h fold-commands`.

## Verschillende Vouwmethoden

De bovenstaande sectie behandelt de handmatige vouw van Vim. Er zijn zes verschillende vouwmethoden in Vim:
1. Handmatig
2. Inspringen
3. Expressie
4. Syntax
5. Diff
6. Marker

Om te zien welke vouwmethode je momenteel gebruikt, voer je `:set foldmethod?` uit. Standaard gebruikt Vim de `handmatige` methode.

In de rest van het hoofdstuk leer je de andere vijf vouwmethoden. Laten we beginnen met de inspringvouw.

## Inspring Vouw

Om een inspringvouw te gebruiken, verander je de `'foldmethod'` naar inspringen:

```shell
:set foldmethod=indent
```

Stel dat je de tekst hebt:

```shell
Eén
  Twee
  Twee opnieuw
```

Als je `:set foldmethod=indent` uitvoert, zie je:

```shell
Eén
+-- 2 regels: Twee -----
```

Met inspringvouw kijkt Vim naar hoeveel spaties elke regel aan het begin heeft en vergelijkt dit met de optie `'shiftwidth'` om de vouwbaarheid te bepalen. `'shiftwidth'` geeft het aantal spaties dat nodig is voor elke stap van de inspringing terug. Als je uitvoert:

```shell
:set shiftwidth?
```

De standaardwaarde van Vim voor `'shiftwidth'` is 2. In de bovenstaande tekst zijn er twee spaties tussen het begin van de regel en de tekst "Twee" en "Twee opnieuw". Wanneer Vim het aantal spaties ziet en dat de waarde van `'shiftwidth'` 2 is, beschouwt Vim die regel als een inspringvouwniveau van één.

Stel dat je deze keer slechts één spatie tussen het begin van de regel en de tekst hebt:

```shell
Eén
 Twee
 Twee opnieuw
```

Op dit moment, als je `:set foldmethod=indent` uitvoert, vouwt Vim de ingesprongen regel niet omdat er niet voldoende ruimte op elke regel is. Eén spatie wordt niet beschouwd als een inspringing. Maar als je de `'shiftwidth'` verandert naar 1:

```shell
:set shiftwidth=1
```

De tekst is nu vouwbaar. Het wordt nu beschouwd als een inspringing.

Herstel de `shiftwidth` terug naar 2 en de spaties tussen de teksten naar twee opnieuw. Voeg daarnaast twee extra teksten toe:

```shell
Eén
  Twee
  Twee opnieuw
    Drie
    Drie opnieuw
```

Voer de vouw uit (`zM`), je zult zien:

```shell
Eén
+-- 4 regels: Twee -----
```

Ontvouw de gevouwen regels (`zR`), zet dan je cursor op "Drie" en schakel de vouwstatus van de tekst om (`za`):

```shell
Eén
  Twee
  Twee opnieuw
+-- 2 regels: Drie -----
```

Wat is dit? Een vouw binnen een vouw?

Geneste vouwen zijn geldig. De tekst "Twee" en "Twee opnieuw" hebben een vouwniveau van één. De tekst "Drie" en "Drie opnieuw" hebben een vouwniveau van twee. Als je een vouwbare tekst met een hoger vouwniveau binnen een vouwbare tekst hebt, heb je meerdere vouwlagen.

## Expressie Vouw

Expressievouw stelt je in staat om een expressie te definiëren om naar te matchen voor een vouw. Nadat je de vouwexpressies hebt gedefinieerd, scant Vim elke regel naar de waarde van `'foldexpr'`. Dit is de variabele die je moet configureren om de juiste waarde terug te geven. Als de `'foldexpr'` 0 retourneert, wordt de regel niet gevouwen. Als het 1 retourneert, heeft die regel een vouwniveau van 1. Als het 2 retourneert, heeft die regel een vouwniveau van 2. Er zijn meer waarden dan alleen gehele getallen, maar ik zal ze niet doornemen. Als je nieuwsgierig bent, kijk dan naar `:h fold-expr`.

Laten we eerst de vouwmethode veranderen:

```shell
:set foldmethod=expr
```

Stel dat je een lijst hebt van ontbijtproducten en je wilt alle ontbijtitems vouwen die beginnen met "p":

```shell
donut
pannenkoek
pop-tarts
eiwitreep
zalm
roerei
```

Verander vervolgens de `foldexpr` om de expressies vast te leggen die beginnen met "p":

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

De bovenstaande expressie ziet er ingewikkeld uit. Laten we het opsplitsen:
- `:set foldexpr` stelt de optie `'foldexpr'` in om een aangepaste expressie te accepteren.
- `getline()` is een Vimscript-functie die de inhoud van een gegeven regel retourneert. Als je `:echo getline(5)` uitvoert, retourneert het de inhoud van regel 5.
- `v:lnum` is de speciale variabele van Vim voor de `'foldexpr'` expressie. Vim scant elke regel en slaat op dat moment het nummer van elke regel op in de variabele `v:lnum`. Op regel 5 heeft `v:lnum` de waarde 5. Op regel 10 heeft `v:lnum` de waarde 10.
- `[0]` in de context van `getline(v:lnum)[0]` is het eerste teken van elke regel. Wanneer Vim een regel scant, retourneert `getline(v:lnum)` de inhoud van elke regel. `getline(v:lnum)[0]` retourneert het eerste teken van elke regel. Op de eerste regel van onze lijst, "donut", retourneert `getline(v:lnum)[0]` "d". Op de tweede regel van onze lijst, "pannenkoek", retourneert `getline(v:lnum)[0]` "p".
- `==\\"p\\"` is de tweede helft van de gelijkheidsuitdrukking. Het controleert of de expressie die je net hebt geëvalueerd gelijk is aan "p". Als het waar is, retourneert het 1. Als het onwaar is, retourneert het 0. In Vim is 1 waarachtig en 0 onwaarachtig. Dus op de regels die beginnen met een "p", retourneert het 1. Herinner je je dat als een `'foldexpr'` een waarde van 1 heeft, het een vouwniveau van 1 heeft.

Na het uitvoeren van deze expressie, zou je moeten zien:

```shell
donut
+-- 3 regels: pannenkoek -----
zalm
roerei
```

## Syntax Vouw

Syntaxvouw wordt bepaald door de syntaxis van de taalhighlighting. Als je een taal syntaxisplugin zoals [vim-polyglot](https://github.com/sheerun/vim-polyglot) gebruikt, werkt de syntaxvouw direct uit de doos. Verander gewoon de vouwmethode naar syntax:

```shell
:set foldmethod=syntax
```

Laten we aannemen dat je een JavaScript-bestand bewerkt en je hebt vim-polyglot geïnstalleerd. Als je een array hebt zoals de volgende:

```shell
const nums = [
  één,
  twee,
  drie,
  vier
]
```

Het zal worden gevouwen met een syntaxvouw. Wanneer je een syntaxishighlighting voor een bepaalde taal definieert (typisch binnen de `syntax/` directory), kun je een `fold` attribuut toevoegen om het vouwbaar te maken. Hieronder staat een snippet uit het JavaScript-syntaxisbestand van vim-polyglot. Let op het `fold`-woord aan het einde.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Deze gids behandelt de `syntax` functie niet. Als je nieuwsgierig bent, kijk dan naar `:h syntax.txt`.

## Diff Vouw

Vim kan een diff-procedure uitvoeren om twee of meer bestanden te vergelijken.

Als je `file1.txt` hebt:

```shell
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
```

En `file2.txt`:

```shell
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
emacs is ok
```

Voer `vimdiff file1.txt file2.txt` uit:

```shell
+-- 3 regels: vim is geweldig -----
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
vim is geweldig
[vim is geweldig] / [emacs is ok]
```

Vim vouwt automatisch enkele van de identieke regels. Wanneer je het `vimdiff` commando uitvoert, gebruikt Vim automatisch `foldmethod=diff`. Als je `:set foldmethod?` uitvoert, retourneert het `diff`.

## Marker Vouw

Om een marker vouw te gebruiken, voer je uit:

```shell
:set foldmethod=marker
```

Stel dat je de tekst hebt:

```shell
Hallo

{{{
wereld
vim
}}}
```

Voer `zM` uit, je zult zien:

```shell
hallo

+-- 4 regels: -----
```

Vim ziet `{{{` en `}}}` als vouwindicatoren en vouwt de teksten ertussen. Met de marker vouw kijkt Vim naar speciale markeringen, gedefinieerd door de optie `'foldmarker'`, om vouwgebieden aan te geven. Om te zien welke markeringen Vim gebruikt, voer je uit:

```shell
:set foldmarker?
```

Standaard gebruikt Vim `{{{` en `}}}` als indicatoren. Als je de indicator wilt veranderen naar andere teksten, zoals "koffie1" en "koffie2":

```shell
:set foldmarker=koffie1,koffie2
```

Als je de tekst hebt:

```shell
hallo

koffie1
wereld
vim
koffie2
```

Nu gebruikt Vim `koffie1` en `koffie2` als de nieuwe vouwmarkeringen. Terzijde, een indicator moet een letterlijke string zijn en kan geen regex zijn.

## Vouw Bewaren

Je verliest alle vouwinformatie wanneer je de Vim-sessie sluit. Als je dit bestand hebt, `count.txt`:

```shell
één
twee
drie
vier
vijf
```

Doe dan een handmatige vouw vanaf regel "drie" naar beneden (`:3,$fold`):

```shell
één
twee
+-- 3 regels: drie ---
```

Wanneer je Vim verlaat en `count.txt` opnieuw opent, zijn de vouwen er niet meer!

Om de vouwen te behouden, voer je na het vouwen uit:

```shell
:mkview
```

Wanneer je `count.txt` opent, voer je uit:

```shell
:loadview
```

Je vouwen zijn hersteld. Je moet echter handmatig `mkview` en `loadview` uitvoeren. Ik weet dat ik op een dag zal vergeten om `mkview` uit te voeren voordat ik het bestand sluit en al mijn vouwen zal verliezen. Hoe kunnen we dit proces automatiseren?

Om automatisch `mkview` uit te voeren wanneer je een `.txt` bestand sluit en `loadview` uit te voeren wanneer je een `.txt` bestand opent, voeg dit toe aan je vimrc:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Vergeet niet dat `autocmd` wordt gebruikt om een commando uit te voeren bij een gebeurtenistrigger. De twee gebeurtenissen hier zijn:
- `BufWinLeave` voor wanneer je een buffer uit een venster verwijdert.
- `BufWinEnter` voor wanneer je een buffer in een venster laadt.

Nu, nadat je binnen een `.txt` bestand hebt gevouwen en Vim hebt verlaten, zal de volgende keer dat je dat bestand opent, je vouwinformatie worden hersteld.

Standaard slaat Vim de vouwinformatie op wanneer `mkview` wordt uitgevoerd in `~/.vim/view` voor het Unix-systeem. Voor meer informatie, kijk naar `:h 'viewdir'`.
## Leer Vouwen op de Slimme Manier

Toen ik voor het eerst met Vim begon, verwaarloosde ik het leren van vouwen omdat ik dacht dat het niet nuttig was. Hoe langer ik codeer, hoe nuttiger ik vouwen vind. Strategisch geplaatste vouwen kunnen je een beter overzicht geven van de tekststructuur, zoals de inhoudsopgave van een boek.

Wanneer je vouwen leert, begin dan met de handmatige vouw omdat die onderweg kan worden gebruikt. Leer vervolgens geleidelijk verschillende trucs om inspring- en markervouwen te maken. Leer tenslotte hoe je syntaxis- en expressievouwen kunt maken. Je kunt zelfs de laatste twee gebruiken om je eigen Vim-plugins te schrijven.