---
description: Leer de basis van Vimscript, inclusief primitieve datatypes en het gebruik
  van Ex-modus voor interactieve codering in deze inleidende hoofdstukken.
title: Ch25. Vimscript Basic Data Types
---

In de volgende hoofdstukken leer je over Vimscript, de ingebouwde programmeertaal van Vim.

Bij het leren van een nieuwe taal zijn er drie basis elementen om op te letten:
- Primitieven
- Combinatiemiddelen
- Abstractiemiddelen

In dit hoofdstuk leer je de primitieve datatypes van Vim.

## Datatypes

Vim heeft 10 verschillende datatypes:
- Nummer
- Float
- String
- Lijst
- Woordenboek
- Speciaal
- Funcref
- Taak
- Kanaal
- Blob

Ik zal hier de eerste zes datatypes behandelen. In Hoofdstuk 27 leer je over Funcref. Voor meer informatie over Vim datatypes, kijk in `:h variables`.

## Volgen met Ex Mode

Vim heeft technisch gezien geen ingebouwde REPL, maar het heeft een modus, Ex mode, die als zodanig kan worden gebruikt. Je kunt naar de Ex mode gaan met `Q` of `gQ`. De Ex mode is als een uitgebreide opdrachtregelmodus (het is alsof je non-stop opdrachten in de opdrachtregelmodus typt). Om de Ex mode te verlaten, typ je `:visual`.

Je kunt ofwel `:echo` of `:echom` gebruiken in dit hoofdstuk en de daaropvolgende Vimscript hoofdstukken om mee te coderen. Ze zijn als `console.log` in JS of `print` in Python. De `:echo` opdracht print de geëvalueerde expressie die je geeft. De `:echom` opdracht doet hetzelfde, maar slaat daarnaast het resultaat op in de berichtgeschiedenis.

```viml
:echom "hello echo message"
```

Je kunt de berichtgeschiedenis bekijken met:

```shell
:messages
```

Om je berichtgeschiedenis te wissen, voer je uit:

```shell
:messages clear
```

## Nummer

Vim heeft 4 verschillende nummer types: decimaal, hexadecimaal, binair en octaal. Trouwens, wanneer ik zeg nummer datatype, betekent dit vaak een geheel getal datatype. In deze gids zal ik de termen nummer en geheel getal door elkaar gebruiken.

### Decimaal

Je zou bekend moeten zijn met het decimale systeem. Vim accepteert positieve en negatieve decimalen. 1, -1, 10, enz. In Vimscript programmeren, zul je waarschijnlijk het decimale type het vaakst gebruiken.

### Hexadecimaal

Hexadecimals beginnen met `0x` of `0X`. Mnemonic: He**x**adecimaal.

### Binair

Binaries beginnen met `0b` of `0B`. Mnemonic: **B**inair.

### Octaal

Octals beginnen met `0`, `0o`, en `0O`. Mnemonic: **O**ctaal.

### Nummer Afdrukken

Als je `echo` een hexadecimaal, binair of octaal nummer, dan converteert Vim deze automatisch naar decimalen.

```viml
:echo 42
" retourneert 42

:echo 052
" retourneert 42

:echo 0b101010
" retourneert 42

:echo 0x2A
" retourneert 42
```

### Waarachtig en Onwaarachtig

In Vim is een waarde van 0 onwaarachtig en zijn alle niet-0 waarden waarachtig.

Het volgende zal niets echoën.

```viml
:if 0
:  echo "Nee"
:endif
```

Echter, dit zal dat wel doen:

```viml
:if 1
:  echo "Ja"
:endif
```

Alle waarden anders dan 0 zijn waarachtig, inclusief negatieve getallen. 100 is waarachtig. -1 is waarachtig.

### Nummer Aritmetiek

Nummers kunnen worden gebruikt om aritmetische expressies uit te voeren:

```viml
:echo 3 + 1
" retourneert 4

: echo 5 - 3
" retourneert 2

:echo 2 * 2
" retourneert 4

:echo 4 / 2
" retourneert 2
```

Bij het delen van een nummer met een restwaarde, laat Vim de restwaarde vallen.

```viml
:echo 5 / 2
" retourneert 2 in plaats van 2.5
```

Om een nauwkeuriger resultaat te krijgen, moet je een float nummer gebruiken.

## Float

Floats zijn nummers met achterliggende decimalen. Er zijn twee manieren om drijvende nummers weer te geven: puntnotatie (zoals 31.4) en exponent (3.14e01). Net als bij nummers, kun je positieve en negatieve tekens gebruiken:

```viml
:echo +123.4
" retourneert 123.4

:echo -1.234e2
" retourneert -123.4

:echo 0.25
" retourneert 0.25

:echo 2.5e-1
" retourneert 0.25
```

Je moet een float een punt en achterliggende cijfers geven. `25e-2` (geen punt) en `1234.` (heeft een punt, maar geen achterliggende cijfers) zijn beide ongeldige float nummers.

### Float Aritmetiek

Bij het uitvoeren van een aritmetische expressie tussen een nummer en een float, dwingt Vim het resultaat naar een float.

```viml
:echo 5 / 2.0
" retourneert 2.5
```

Float en float aritmetiek geeft je een andere float.

```shell
:echo 1.0 + 1.0
" retourneert 2.0
```

## String

Strings zijn tekens omgeven door dubbele aanhalingstekens (`""`) of enkele aanhalingstekens (`''`). "Hallo", "123", en '123.4' zijn voorbeelden van strings.

### String Concatenatie

Om een string in Vim te concatenëren, gebruik je de `.` operator.

```viml
:echo "Hallo" . " wereld"
" retourneert "Hallo wereld"
```

### String Aritmetiek

Wanneer je aritmetische operatoren (`+ - * /`) uitvoert met een nummer en een string, dwingt Vim de string naar een nummer.

```viml
:echo "12 donuts" + 3
" retourneert 15
```

Wanneer Vim "12 donuts" ziet, haalt het de 12 uit de string en converteert het naar het nummer 12. Vervolgens voert het de optelling uit, wat 15 retourneert. Voor deze string-naar-nummer coercie om te werken, moet het nummerteken het *eerste teken* in de string zijn.

Het volgende zal niet werken omdat 12 niet het eerste teken in de string is:

```viml
:echo "donuts 12" + 3
" retourneert 3
```

Dit zal ook niet werken omdat een spatie het eerste teken van de string is:

```viml
:echo " 12 donuts" + 3
" retourneert 3
```

Deze coercie werkt zelfs met twee strings:

```shell
:echo "12 donuts" + "6 pastries"
" retourneert 18
```

Dit werkt met elke aritmetische operator, niet alleen `+`:

```viml
:echo "12 donuts" * "5 boxes"
" retourneert 60

:echo "12 donuts" - 5
" retourneert 7

:echo "12 donuts" / "3 people"
" retourneert 4
```

Een handige truc om een string-naar-nummer conversie af te dwingen is om gewoon 0 op te tellen of met 1 te vermenigvuldigen:

```viml
:echo "12" + 0
" retourneert 12

:echo "12" * 1
" retourneert 12
```

Wanneer aritmetiek wordt uitgevoerd tegen een float in een string, behandelt Vim het als een geheel getal, niet als een float:

```shell
:echo "12.0 donuts" + 12
" retourneert 24, niet 24.0
```

### Nummer en String Concatenatie

Je kunt een nummer naar een string dwingen met een puntoperator (`.`):

```viml
:echo 12 . "donuts"
" retourneert "12donuts"
```

De coercie werkt alleen met het nummer datatype, niet met float. Dit zal niet werken:

```shell
:echo 12.0 . "donuts"
" retourneert niet "12.0donuts" maar geeft een foutmelding
```

### String Conditionals

Vergeet niet dat 0 onwaarachtig is en alle niet-0 nummers waarachtig zijn. Dit is ook waar bij het gebruik van strings als conditionals.

In de volgende if-statement dwingt Vim "12donuts" naar 12, wat waarachtig is:

```viml
:if "12donuts"
:  echo "Jammie"
:endif
" retourneert "Jammie"
```

Aan de andere kant is dit onwaarachtig:

```viml
:if "donuts12"
:  echo "Nee"
:endif
" retourneert niets
```

Vim dwingt "donuts12" naar 0, omdat het eerste teken geen nummer is.

### Dubbele vs Enkele Aanhalingstekens

Dubbele aanhalingstekens gedragen zich anders dan enkele aanhalingstekens. Enkele aanhalingstekens tonen tekens letterlijk terwijl dubbele aanhalingstekens speciale tekens accepteren.

Wat zijn speciale tekens? Kijk naar de weergave van nieuwe regels en dubbele aanhalingstekens:

```viml
:echo "hello\nworld"
" retourneert
" hello
" world

:echo "hello \"world\""
" retourneert "hello "world""
```

Vergelijk dat met enkele aanhalingstekens:

```shell
:echo 'hello\nworld'
" retourneert 'hello\nworld'

:echo 'hello \"world\"'
" retourneert 'hello \"world\"'
```

Speciale tekens zijn speciale stringtekens die, wanneer ze worden ontsnapt, zich anders gedragen. `\n` gedraagt zich als een nieuwe regel. `\"` gedraagt zich als een letterlijke `"`. Voor een lijst van andere speciale tekens, kijk in `:h expr-quote`.

### String Procedures

Laten we kijken naar enkele ingebouwde stringprocedures.

Je kunt de lengte van een string krijgen met `strlen()`.

```shell
:echo strlen("choco")
" retourneert 5
```

Je kunt een string naar een nummer converteren met `str2nr()`:

```shell
:echo str2nr("12donuts")
" retourneert 12

:echo str2nr("donuts12")
" retourneert 0
```

Vergelijkbaar met de string-naar-nummer coercie eerder, als het nummer niet het eerste teken is, zal Vim het niet oppikken.

Het goede nieuws is dat Vim een methode heeft die een string naar een float transformeert, `str2float()`:

```shell
:echo str2float("12.5donuts")
" retourneert 12.5
```

Je kunt een patroon in een string vervangen met de `substitute()` methode:

```shell
:echo substitute("sweet", "e", "o", "g")
" retourneert "swoot"
```

De laatste parameter, "g", is de globale vlag. Hiermee zal Vim alle overeenkomende gevallen vervangen. Zonder deze zal Vim alleen de eerste match vervangen.

```shell
:echo substitute("sweet", "e", "o", "")
" retourneert "swoet"
```

De substitute-opdracht kan worden gecombineerd met `getline()`. Vergeet niet dat de functie `getline()` de tekst op het gegeven regelnummer haalt. Stel dat je de tekst "chocolate donut" op regel 5 hebt. Je kunt de procedure gebruiken:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" retourneert glazed donut
```

Er zijn veel andere stringprocedures. Kijk in `:h string-functions`.

## Lijst

Een Vimscript lijst is als een Array in Javascript of een Lijst in Python. Het is een *geordende* reeks items. Je kunt de inhoud mixen en matchen met verschillende datatypes:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Sublijsten

Vim-lijsten zijn nul-geïndexeerd. Je kunt een bepaald item in een lijst bereiken met `[n]`, waar n de index is.

```shell
:echo ["a", "sweet", "dessert"][0]
" retourneert "a"

:echo ["a", "sweet", "dessert"][2]
" retourneert "dessert"
```

Als je over het maximale indexnummer gaat, zal Vim een foutmelding geven dat de index buiten bereik is:

```shell
:echo ["a", "sweet", "dessert"][999]
" retourneert een fout
```

Wanneer je onder nul gaat, begint Vim de index vanaf het laatste element. Voorbij het minimale indexnummer zal ook een foutmelding geven:

```shell
:echo ["a", "sweet", "dessert"][-1]
" retourneert "dessert"

:echo ["a", "sweet", "dessert"][-3]
" retourneert "a"

:echo ["a", "sweet", "dessert"][-999]
" retourneert een fout
```

Je kunt "slicen" verschillende elementen uit een lijst met `[n:m]`, waar `n` de startindex is en `m` de eindindex.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" retourneert ["plain", "strawberry", "lemon"]
```

Als je `m` niet doorgeeft (`[n:]`), retourneert Vim de rest van de elementen vanaf het n-de element. Als je `n` niet doorgeeft (`[:m]`), retourneert Vim het eerste element tot het m-de element.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" retourneert ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" retourneert ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

Je kunt een index doorgeven die het maximale aantal items overschrijdt bij het slicen van een array.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" retourneert ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### String Snijden

Je kunt strings snijden en richten zoals lijsten:

```viml
:echo "choco"[0]
" retourneert "c"

:echo "choco"[1:3]
" retourneert "hoc"

:echo "choco"[:3]
" retourneert choc

:echo "choco"[1:]
" retourneert hoco
```

### Lijst Aritmetiek

Je kunt `+` gebruiken om een lijst samen te voegen en te muteren:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" retourneert ["chocolate", "strawberry", "sugar"]
```

### Lijst Functies

Laten we de ingebouwde lijstfuncties van Vim verkennen.

Om de lengte van een lijst te krijgen, gebruik `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" retourneert 2
```

Om een element aan een lijst toe te voegen, kun je `insert()` gebruiken:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" retourneert ["glazed", "chocolate", "strawberry"]
```

Je kunt `insert()` ook de index geven waar je het element wilt toevoegen. Als je een item voor het tweede element (index 1) wilt toevoegen:

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" retourneert ['glazed', 'cream', 'chocolate', 'strawberry']
```

Om een lijstitem te verwijderen, gebruik `remove()`. Het accepteert een lijst en de index van het element dat je wilt verwijderen.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" retourneert ['glazed', 'strawberry']
```

Je kunt `map()` en `filter()` op een lijst gebruiken. Om elementen te filteren die de zin "choco" bevatten:

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" retourneert ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" retourneert ['chocolate donut', 'glazed donut', 'sugar donut']
```

De `v:val` variabele is een speciale Vim variabele. Het is beschikbaar wanneer je door een lijst of een woordenboek iterates met `map()` of `filter()`. Het vertegenwoordigt elk iterated item.

Voor meer, kijk naar `:h list-functions`.

### Lijst Uitpakken

Je kunt een lijst uitpakken en variabelen toewijzen aan de lijstitems:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" retourneert "chocolate"

:echo flavor2
" retourneert "glazed"
```

Om de rest van de lijstitems toe te wijzen, kun je `;` gevolgd door een variabelenaam gebruiken:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" retourneert "apple"

:echo restFruits
" retourneert ['lemon', 'blueberry', 'raspberry']
```

### Lijst Wijzigen

Je kunt een lijstitem direct wijzigen:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" retourneert ['sugar', 'glazed', 'plain']
```

Je kunt meerdere lijstitems direct muteren:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" retourneert ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## Woordenboek

Een Vimscript woordenboek is een associatieve, ongeordende lijst. Een niet-lege woordenboek bestaat uit ten minste één sleutel-waarde paar.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Een Vim woordenboek data-object gebruikt een string voor de sleutel. Als je probeert een nummer te gebruiken, zal Vim het omzetten naar een string.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" retourneert {'1': '7am', '2': '9am', '11ses': '11am'}
```

Als je te lui bent om aanhalingstekens om elke sleutel te plaatsen, kun je de `#{}` notatie gebruiken:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" retourneert {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

De enige vereiste voor het gebruik van de `#{}` syntaxis is dat elke sleutel moet zijn:

- ASCII-teken.
- Cijfer.
- Een underscore (`_`).
- Een koppelteken (`-`).

Net als bij lijsten kun je elk datatype als waarden gebruiken.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### Toegang tot Woordenboek

Om een waarde uit een woordenboek te krijgen, kun je de sleutel aanroepen met ofwel de vierkante haken (`['key']`) of de puntnotatie (`.key`).

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" retourneert "gruel omelettes"

:echo lunch
" retourneert "gruel sandwiches"
```

### Woordenboek Wijzigen

Je kunt de inhoud van een woordenboek wijzigen of zelfs toevoegen:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" retourneert {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### Woordenboek Functies

Laten we enkele van de ingebouwde functies van Vim verkennen om met woordenboeken om te gaan.

Om de lengte van een woordenboek te controleren, gebruik `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" retourneert 3
```

Om te zien of een woordenboek een specifieke sleutel bevat, gebruik `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" retourneert 1

:echo has_key(mealPlans, "dessert")
" retourneert 0
```

Om te zien of een woordenboek een item heeft, gebruik `empty()`. De `empty()` procedure werkt met alle datatypes: lijst, woordenboek, string, nummer, float, enz.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" retourneert 1

:echo empty(mealPlans)
" retourneert 0
```

Om een invoer uit een woordenboek te verwijderen, gebruik `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "verwijderen ontbijt: " . remove(mealPlans, "breakfast")
" retourneert "verwijderen ontbijt: 'waffles'""

:echo mealPlans
" retourneert {'lunch': 'pancakes', 'dinner': 'donuts'}
```

Om een woordenboek om te zetten in een lijst van lijsten, gebruik `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" retourneert [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` en `map()` zijn ook beschikbaar.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" retourneert {'2': '9am', '11ses': '11am'}
```

Aangezien een woordenboek sleutel-waarde paren bevat, biedt Vim de `v:key` speciale variabele die werkt zoals `v:val`. Wanneer je door een woordenboek iterates, zal `v:key` de waarde van de huidige iterated sleutel bevatten.

Als je een `mealPlans` woordenboek hebt, kun je het mappen met `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " en melk"')

:echo mealPlans
" retourneert {'lunch': 'lunch en melk', 'breakfast': 'breakfast en melk', 'dinner': 'dinner en melk'}
```

Evenzo kun je het mappen met `v:val`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " en melk"')

:echo mealPlans
" retourneert {'lunch': 'pancakes en melk', 'breakfast': 'waffles en melk', 'dinner': 'donuts en melk'}
```

Om meer woordenboekfuncties te zien, kijk naar `:h dict-functions`.

## Speciale Primitieven

Vim heeft speciale primitieven:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

Trouwens, `v:` is de ingebouwde variabele van Vim. Ze zullen later in een volgend hoofdstuk uitgebreider worden behandeld.

Uit mijn ervaring gebruik je deze speciale primitieven niet vaak. Als je een waarheidsgetrouwe / onwaarheidsgetrouwe waarde nodig hebt, kun je gewoon 0 (onwaar) en niet-0 (waar) gebruiken. Als je een lege string nodig hebt, gebruik dan gewoon `""`. Maar het is nog steeds goed om te weten, dus laten we ze snel doornemen.

### Waar

Dit is gelijk aan `true`. Het is gelijk aan een nummer met een waarde van niet-0. Bij het decoderen van json met `json_encode()`, wordt het geïnterpreteerd als "waar".

```shell
:echo json_encode({"test": v:true})
" retourneert {"test": true}
```

### Onwaar

Dit is gelijk aan `false`. Het is gelijk aan een nummer met een waarde van 0. Bij het decoderen van json met `json_encode()`, wordt het geïnterpreteerd als "onwaar".

```shell
:echo json_encode({"test": v:false})
" retourneert {"test": false}
```

### Geen

Het is gelijk aan een lege string. Bij het decoderen van json met `json_encode()`, wordt het geïnterpreteerd als een leeg item (`null`).

```shell
:echo json_encode({"test": v:none})
" retourneert {"test": null}
```

### Null

Vergelijkbaar met `v:none`.

```shell
:echo json_encode({"test": v:null})
" retourneert {"test": null}
```

## Leer Datatypes op de Slimme Manier

In dit hoofdstuk heb je geleerd over de basisdatatypes van Vimscript: nummer, float, string, lijst, woordenboek en speciaal. Het leren van deze is de eerste stap om Vimscript-programmering te starten.

In het volgende hoofdstuk leer je hoe je ze kunt combineren om expressies te schrijven zoals gelijkheden, conditionals en lussen.