---
description: Leer hoe je Vimscript-datatypes kunt combineren om basisprogramma's te
  schrijven met conditionals en loops, inclusief relationele operatoren.
title: Ch26. Vimscript Conditionals and Loops
---

Na het leren van de basisgegevens typen, is de volgende stap om te leren hoe je ze samen kunt combineren om een basisprogramma te schrijven. Een basisprogramma bestaat uit conditionals en loops.

In dit hoofdstuk leer je hoe je Vimscript-gegevens typen kunt gebruiken om conditionals en loops te schrijven.

## Relationale Operatoren

Vimscript relationele operatoren zijn vergelijkbaar met veel programmeertalen:

```shell
a == b		gelijk aan
a != b		niet gelijk aan
a >  b		groter dan
a >= b		groter dan of gelijk aan
a <  b		kleiner dan
a <= b		kleiner dan of gelijk aan
```

Bijvoorbeeld:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Vergeet niet dat strings worden omgezet in getallen in een rekenkundige expressie. Hier coerced Vim ook strings in getallen in een gelijkheidsexpressie. "5foo" wordt omgezet in 5 (waar):

```shell
:echo 5 == "5foo"
" retourneert waar
```

Vergeet ook niet dat als je een string begint met een niet-numeriek teken zoals "foo5", de string wordt omgezet in het getal 0 (onwaar).

```shell
echo 5 == "foo5"
" retourneert onwaar
```

### String Logica Operatoren

Vim heeft meer relationele operatoren voor het vergelijken van strings:

```shell
a =~ b
a !~ b
```

Voorbeelden:

```shell
let str = "hearty breakfast"

echo str =~ "hearty"
" retourneert waar

echo str =~ "dinner"
" retourneert onwaar

echo str !~ "dinner"
" retourneert waar
```

De `=~` operator voert een regex-matching uit tegen de gegeven string. In het bovenstaande voorbeeld retourneert `str =~ "hearty"` waar omdat `str` *bevat* het "hearty" patroon. Je kunt altijd `==` en `!=` gebruiken, maar het gebruik ervan vergelijkt de expressie met de gehele string. `=~` en `!~` zijn meer flexibele keuzes.

```shell
echo str == "hearty"
" retourneert onwaar

echo str == "hearty breakfast"
" retourneert waar
```

Laten we deze proberen. Let op de hoofdletter "H":

```shell
echo str =~ "Hearty"
" waar
```

Het retourneert waar, ook al is "Hearty" met een hoofdletter. Interessant... Het blijkt dat mijn Vim-instelling is ingesteld om hoofdletters te negeren (`set ignorecase`), dus wanneer Vim controleert op gelijkheid, gebruikt het mijn Vim-instelling en negeert het de hoofdletters. Als ik de negering van hoofdletters uitschakel (`set noignorecase`), retourneert de vergelijking nu onwaar.

```shell
set noignorecase
echo str =~ "Hearty"
" retourneert onwaar omdat hoofdletters belangrijk zijn

set ignorecase
echo str =~ "Hearty"
" retourneert waar omdat hoofdletters niet belangrijk zijn
```

Als je een plugin voor anderen schrijft, is dit een lastige situatie. Gebruikt de gebruiker `ignorecase` of `noignorecase`? Je wilt absoluut niet dat je gebruikers hun negering van hoofdletters-optie moeten wijzigen. Wat doe je dan?

Gelukkig heeft Vim een operator die *altijd* hoofdletters kan negeren of overeenkomen. Om altijd hoofdletters te laten overeenkomen, voeg je een `#` aan het einde toe.

```shell
set ignorecase
echo str =~# "hearty"
" retourneert waar

echo str =~# "HearTY"
" retourneert onwaar

set noignorecase
echo str =~# "hearty"
" waar

echo str =~# "HearTY"
" onwaar

echo str !~# "HearTY"
" waar
```

Om altijd hoofdletters te negeren bij het vergelijken, voeg je het toe met `?`:

```shell
set ignorecase
echo str =~? "hearty"
" waar

echo str =~? "HearTY"
" waar

set noignorecase
echo str =~? "hearty"
" waar

echo str =~? "HearTY"
" waar

echo str !~? "HearTY"
" onwaar
```

Ik geef de voorkeur aan het gebruik van `#` om altijd de hoofdletters te laten overeenkomen en aan de veilige kant te zijn.

## If

Nu je de gelijkheidsexpressies van Vim hebt gezien, laten we een fundamentele conditionele operator aanraken, de `if`-instructie.

Minimaal is de syntaxis:

```shell
if {clausule}
  {enige expressie}
endif
```

Je kunt de case-analyse uitbreiden met `elseif` en `else`.

```shell
if {predikaat1}
  {expressie1}
elseif {predikaat2}
  {expressie2}
elseif {predikaat3}
  {expressie3}
else
  {expressie4}
endif
```

Bijvoorbeeld, de plugin [vim-signify](https://github.com/mhinz/vim-signify) gebruikt een andere installatiemethode afhankelijk van je Vim-instellingen. Hieronder staat de installatie-instructie uit hun `readme`, met gebruik van de `if`-instructie:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Ternary Expressie

Vim heeft een ternary expressie voor een eenregelige case-analyse:

```shell
{predikaat} ? expressiontrue : expressionfalse
```

Bijvoorbeeld:

```shell
echo 1 ? "Ik ben waar" : "Ik ben onwaar"
```

Aangezien 1 waar is, echoot Vim "Ik ben waar". Stel dat je de `background` conditioneel wilt instellen op donker als je Vim na een bepaald uur gebruikt. Voeg dit toe aan vimrc:

```shell
let &background = strftime("%H") < 18 ? "licht" : "donker"
```

`&background` is de `'background'` optie in Vim. `strftime("%H")` retourneert de huidige tijd in uren. Als het nog niet 18:00 uur is, gebruik dan een lichte achtergrond. Anders, gebruik een donkere achtergrond.

## of

De logische "of" (`||`) werkt zoals veel programmeertalen.

```shell
{Onwaar expressie}  || {Onwaar expressie}   onwaar
{Onwaar expressie}  || {Waar expressie}  waar
{Waar expressie} || {Onwaar expressie}   waar
{Waar expressie} || {Waar expressie}  waar
```

Vim evalueert de expressie en retourneert ofwel 1 (waar) of 0 (onwaar).

```shell
echo 5 || 0
" retourneert 1

echo 5 || 5
" retourneert 1

echo 0 || 0
" retourneert 0

echo "foo5" || "foo5"
" retourneert 0

echo "5foo" || "foo5"
" retourneert 1
```

Als de huidige expressie evalueert naar waar, wordt de daaropvolgende expressie niet geëvalueerd.

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" retourneert 1

echo two_dozen || one_dozen
" retourneert fout
```

Let op dat `two_dozen` nooit is gedefinieerd. De expressie `one_dozen || two_dozen` gooit geen fout omdat `one_dozen` eerst wordt geëvalueerd en waar blijkt te zijn, dus Vim evalueert `two_dozen` niet.

## en

De logische "en" (`&&`) is het complement van de logische of.

```shell
{Onwaar Expressie}  && {Onwaar Expressie}   onwaar
{Onwaar expressie}  && {Waar expressie}  onwaar
{Waar Expressie} && {Onwaar Expressie}   onwaar
{Waar expressie} && {Waar expressie}  waar
```

Bijvoorbeeld:

```shell
echo 0 && 0
" retourneert 0

echo 0 && 10
" retourneert 0
```

`&&` evalueert een expressie totdat het de eerste onware expressie ziet. Bijvoorbeeld, als je `waar && waar` hebt, evalueert het beide en retourneert `waar`. Als je `waar && onwaar && waar` hebt, evalueert het de eerste `waar` en stopt bij de eerste `onwaar`. Het zal de derde `waar` niet evalueren.

```shell
let one_dozen = 12
echo one_dozen && 10
" retourneert 1

echo one_dozen && v:false
" retourneert 0

echo one_dozen && two_dozen
" retourneert fout

echo exists("one_dozen") && one_dozen == 12
" retourneert 1
```

## voor

De `for`-lus wordt vaak gebruikt met het lijstgegevens type.

```shell
let breakfasts = ["pannenkoeken", "wafels", "eieren"]

for breakfast in breakfasts
  echo breakfast
endfor
```

Het werkt met geneste lijsten:

```shell
let meals = [["ontbijt", "pannenkoeken"], ["lunch", "vis"], ["diner", "pasta"]]

for [meal_type, food] in meals
  echo "Ik heb " . food . " voor " . meal_type
endfor
```

Je kunt technisch de `for`-lus gebruiken met een woordenboek met de `keys()`-methode.

```shell
let beverages = #{ontbijt: "melk", lunch: "sinaasappelsap", diner: "water"}
for beverage_type in keys(beverages)
  echo "Ik drink " . beverages[beverage_type] . " voor " . beverage_type
endfor
```

## Terwijl

Een andere veelvoorkomende lus is de `while`-lus.

```shell
let counter = 1
while counter < 5
  echo "Counter is: " . counter
  let counter += 1
endwhile
```

Om de inhoud van de huidige regel tot de laatste regel te krijgen:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## Foutafhandeling

Vaak draait je programma niet zoals je verwacht. Als gevolg daarvan gooit het je voor een lus (grap bedoeld). Wat je nodig hebt, is een goede foutafhandeling.

### Break

Wanneer je `break` gebruikt binnen een `while` of `for`-lus, stopt het de lus.

Om de teksten van het begin van het bestand tot de huidige regel te krijgen, maar stop wanneer je het woord "donut" ziet:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    break
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

Als je de tekst hebt:

```shell
een
twee
drie
donut
vier
vijf
```

Het uitvoeren van de bovenstaande `while`-lus geeft "een twee drie" en niet de rest van de tekst omdat de lus breekt zodra het "donut" matcht.

### Doorgaan

De `continue`-methode is vergelijkbaar met `break`, waar het wordt aangeroepen tijdens een lus. Het verschil is dat in plaats van uit de lus te breken, het gewoon die huidige iteratie overslaat.

Stel dat je dezelfde tekst hebt, maar in plaats van `break`, gebruik je `continue`:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    continue
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

Deze keer retourneert het `een twee drie vier vijf`. Het slaat de regel met het woord "donut" over, maar de lus gaat door.
### probeer, eindelijk en vangen

Vim heeft een `try`, `finally` en `catch` om fouten af te handelen. Om een fout te simuleren, kun je het `throw`-commando gebruiken.

```shell
try
  echo "Probeer"
  throw "Nee"
endtry
```

Voer dit uit. Vim zal klagen met de foutmelding `"Exception not caught: Nee`.

Voeg nu een catch-blok toe:

```shell
try
  echo "Probeer"
  throw "Nee"
catch
  echo "Vangen"
endtry
```

Nu is er geen fout meer. Je zou "Probeer" en "Vangen" moeten zien weergegeven.

Laten we de `catch` verwijderen en een `finally` toevoegen:

```shell
try
  echo "Probeer"
  throw "Nee"
  echo "Je zult mij niet zien"
finally
  echo "Eindelijk"
endtry
```

Voer dit uit. Nu toont Vim de fout en "Eindelijk".

Laten we ze allemaal samenvoegen:

```shell
try
  echo "Probeer"
  throw "Nee"
catch
  echo "Vangen"
finally
  echo "Eindelijk"
endtry
```

Deze keer toont Vim zowel "Vangen" als "Eindelijk". Er wordt geen fout weergegeven omdat Vim deze heeft gevangen.

Fouten komen uit verschillende bronnen. Een andere bron van fouten is het aanroepen van een niet-bestaande functie, zoals `Nee()` hieronder:

```shell
try
  echo "Probeer"
  call Nee()
catch
  echo "Vangen"
finally
  echo "Eindelijk"
endtry
```

Het verschil tussen `catch` en `finally` is dat `finally` altijd wordt uitgevoerd, ongeacht of er een fout is, terwijl een catch alleen wordt uitgevoerd wanneer je code een fout krijgt.

Je kunt specifieke fouten vangen met `:catch`. Volgens `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " vang onderbrekingen (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " vang alle Vim-fouten
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " vang fouten en onderbrekingen
catch /^Vim(write):/.                " vang alle fouten in :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " vang fout E123
catch /mijn-uitzondering/.            " vang gebruikersuitzondering
catch /.*/                           " vang alles
catch.                               " hetzelfde als /.*/
```

Binnen een `try`-blok wordt een onderbreking beschouwd als een vangbare fout.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

In je vimrc, als je een aangepaste kleurenpalet gebruikt, zoals [gruvbox](https://github.com/morhetz/gruvbox), en je per ongeluk de kleurenpalet-directory verwijdert maar nog steeds de regel `colorscheme gruvbox` in je vimrc hebt staan, zal Vim een fout geven wanneer je het `source`. Om dit op te lossen, heb ik dit in mijn vimrc toegevoegd:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Nu, als je `source` vimrc zonder de `gruvbox`-directory, zal Vim het `colorscheme default` gebruiken.

## Leer Voorwaardelijke Structuren op de Slimme Manier

In het vorige hoofdstuk heb je geleerd over de basisdatatypes van Vim. In dit hoofdstuk heb je geleerd hoe je ze kunt combineren om basisprogramma's te schrijven met behulp van voorwaardelijke structuren en lussen. Dit zijn de bouwstenen van programmeren.

Laten we nu leren over variabele scopes.