---
description: I denna dokumentation lär du dig om Vimscript, Vim's inbyggda programmeringsspråk,
  inklusive dess primitiva datatyper och användning av Ex-läget.
title: Ch25. Vimscript Basic Data Types
---

I de kommande kapitlen kommer du att lära dig om Vimscript, Vims inbyggda programmeringsspråk.

När du lär dig ett nytt språk finns det tre grundläggande element att se efter:
- Primitiver
- Kombinationsmedel
- Abstraktionsmedel

I detta kapitel kommer du att lära dig Vims primitiva datatyper.

## Datatyper

Vim har 10 olika datatyper:
- Nummer
- Flyttal
- Sträng
- Lista
- Ordbok
- Speciell
- Funcref
- Jobb
- Kanal
- Blob

Jag kommer att täcka de första sex datatyperna här. I kapitel 27 kommer du att lära dig om Funcref. För mer information om Vims datatyper, kolla in `:h variables`.

## Följ med i Ex-läge

Vim har tekniskt sett inte en inbyggd REPL, men det har ett läge, Ex-läge, som kan användas som en. Du kan gå till Ex-läget med `Q` eller `gQ`. Ex-läget är som ett utökat kommandoradsläge (det är som att skriva kommandorads kommandon oavbrutet). För att avsluta Ex-läget, skriv `:visual`.

Du kan använda antingen `:echo` eller `:echom` i detta kapitel och de efterföljande Vimscript-kapitlen för att koda med. De är som `console.log` i JS eller `print` i Python. Kommandot `:echo` skriver ut det utvärderade uttrycket du ger. Kommandot `:echom` gör samma sak, men dessutom lagrar det resultatet i meddelandehistoriken.

```viml
:echom "hello echo message"
```

Du kan se meddelandehistoriken med:

```shell
:messages
```

För att rensa din meddelandehistorik, kör:

```shell
:messages clear
```

## Nummer

Vim har 4 olika numTyper: decimal, hexadecimala, binära och oktala. Förresten, när jag säger nummer datatyp, betyder detta ofta en heltalsdatatyp. I denna guide kommer jag att använda termerna nummer och heltal omväxlande.

### Decimal

Du bör vara bekant med decimalsystemet. Vim accepterar positiva och negativa decimaler. 1, -1, 10, osv. I Vimscript-programmering kommer du förmodligen att använda decimaltypen mestadels.

### Hexadecimal

Hexadecimala börjar med `0x` eller `0X`. Mnemonik: He**x**adecimal.

### Binär

Binärer börjar med `0b` eller `0B`. Mnemonik: **B**inär.

### Oktal

Oktaler börjar med `0`, `0o` och `0O`. Mnemonik: **O**ktal.

### Utskrift av nummer

Om du `echo` antingen ett hexadecimalt, ett binärt eller ett oktalt nummer, konverterar Vim automatiskt dem till decimaler.

```viml
:echo 42
" returnerar 42

:echo 052
" returnerar 42

:echo 0b101010
" returnerar 42

:echo 0x2A
" returnerar 42
```

### Sanningsenliga och falska värden

I Vim är ett 0-värde falskt och alla icke-0-värden är sanna.

Följande kommer inte att echo något.

```viml
:if 0
:  echo "Nej"
:endif
```

Men detta kommer att:

```viml
:if 1
:  echo "Ja"
:endif
```

Alla värden som inte är 0 är sanna, inklusive negativa tal. 100 är sant. -1 är sant.

### Nummeraritmetik

Nummer kan användas för att köra aritmetiska uttryck:

```viml
:echo 3 + 1
" returnerar 4

: echo 5 - 3
" returnerar 2

:echo 2 * 2
" returnerar 4

:echo 4 / 2
" returnerar 2
```

När du delar ett nummer med en rest, släpper Vim resten.

```viml
:echo 5 / 2
" returnerar 2 istället för 2.5
```

För att få ett mer exakt resultat behöver du använda ett flyttal.

## Flyttal

Flyttal är nummer med efterföljande decimaler. Det finns två sätt att representera flyttal: punktnotation (som 31.4) och exponent (3.14e01). Likt nummer kan du använda positiva och negativa tecken:

```viml
:echo +123.4
" returnerar 123.4

:echo -1.234e2
" returnerar -123.4

:echo 0.25
" returnerar 0.25

:echo 2.5e-1
" returnerar 0.25
```

Du behöver ge ett flyttal en punkt och efterföljande siffror. `25e-2` (ingen punkt) och `1234.` (har en punkt, men inga efterföljande siffror) är båda ogiltiga flyttal.

### Flyttalsaritmetik

När du gör ett aritmetiskt uttryck mellan ett nummer och ett flyttal, tvingar Vim resultatet till ett flyttal.

```viml
:echo 5 / 2.0
" returnerar 2.5
```

Flyttal och flyttalsaritmetik ger dig ett annat flyttal.

```shell
:echo 1.0 + 1.0
" returnerar 2.0
```

## Sträng

Strängar är tecken omgivna av antingen dubbla citattecken (`""`) eller enkla citattecken (`''`). "Hello", "123" och '123.4' är exempel på strängar.

### Strängkonkatenering

För att konkatenera en sträng i Vim, använd `.`-operatorn.

```viml
:echo "Hello" . " world"
" returnerar "Hello world"
```

### Strängaritmetik

När du kör aritmetiska operatorer (`+ - * /`) med ett nummer och en sträng, tvingar Vim strängen till ett nummer.

```viml
:echo "12 donuts" + 3
" returnerar 15
```

När Vim ser "12 donuts", extraherar den 12 från strängen och konverterar den till numret 12. Sedan utför den addition, vilket ger 15. För att denna sträng-till-nummer tvingning ska fungera, behöver siffra-tecknet vara det *första tecknet* i strängen.

Följande kommer inte att fungera eftersom 12 inte är det första tecknet i strängen:

```viml
:echo "donuts 12" + 3
" returnerar 3
```

Detta kommer inte heller att fungera eftersom ett tomt utrymme är det första tecknet i strängen:

```viml
:echo " 12 donuts" + 3
" returnerar 3
```

Denna tvingning fungerar även med två strängar:

```shell
:echo "12 donuts" + "6 pastries"
" returnerar 18
```

Detta fungerar med vilken aritmetisk operator som helst, inte bara `+`:

```viml
:echo "12 donuts" * "5 boxes"
" returnerar 60

:echo "12 donuts" - 5
" returnerar 7

:echo "12 donuts" / "3 people"
" returnerar 4
```

Ett smart trick för att tvinga en sträng-till-nummer konvertering är att bara lägga till 0 eller multiplicera med 1:

```viml
:echo "12" + 0
" returnerar 12

:echo "12" * 1
" returnerar 12
```

När aritmetik görs mot ett flyttal i en sträng, behandlar Vim det som ett heltal, inte ett flyttal:

```shell
:echo "12.0 donuts" + 12
" returnerar 24, inte 24.0
```

### Nummer och strängkonkatenering

Du kan tvinga ett nummer till en sträng med en punktoperator (`.`):

```viml
:echo 12 . "donuts"
" returnerar "12donuts"
```

Tvingningen fungerar endast med heltalsdatatyp, inte flyttal. Detta kommer inte att fungera:

```shell
:echo 12.0 . "donuts"
" returnerar inte "12.0donuts" utan kastar ett fel
```

### Strängvillkor

Kom ihåg att 0 är falskt och alla icke-0 nummer är sanna. Detta gäller även när man använder strängar som villkor.

I följande if-sats tvingar Vim "12donuts" till 12, vilket är sant:

```viml
:if "12donuts"
:  echo "Mums"
:endif
" returnerar "Mums"
```

Å andra sidan är detta falskt:

```viml
:if "donuts12"
:  echo "Nej"
:endif
" returnerar inget
```

Vim tvingar "donuts12" till 0, eftersom det första tecknet inte är ett nummer.

### Dubbel- vs enkla citattecken

Dubbla citattecken beter sig annorlunda än enkla citattecken. Enkla citattecken visar tecken bokstavligt medan dubbla citattecken accepterar specialtecken.

Vad är specialtecken? Kolla in ny rad och dubbla citattecken:

```viml
:echo "hello\nworld"
" returnerar
" hello
" world

:echo "hello \"world\""
" returnerar "hello "world""
```

Jämför det med enkla citattecken:

```shell
:echo 'hello\nworld'
" returnerar 'hello\nworld'

:echo 'hello \"world\"'
" returnerar 'hello \"world\"'
```

Specialtecken är speciella strängtecken som när de är undantagna, beter sig annorlunda. `\n` fungerar som en ny rad. `\"` beter sig som ett bokstavligt `"`. För en lista över andra specialtecken, kolla in `:h expr-quote`.

### Strängprocedurer

Låt oss titta på några inbyggda strängprocedurer.

Du kan få längden på en sträng med `strlen()`.

```shell
:echo strlen("choco")
" returnerar 5
```

Du kan konvertera en sträng till ett nummer med `str2nr()`:

```shell
:echo str2nr("12donuts")
" returnerar 12

:echo str2nr("donuts12")
" returnerar 0
```

Likt sträng-till-nummer tvingningen tidigare, om numret inte är det första tecknet, kommer Vim inte att fånga det.

Den goda nyheten är att Vim har en metod som omvandlar en sträng till ett flyttal, `str2float()`:

```shell
:echo str2float("12.5donuts")
" returnerar 12.5
```

Du kan ersätta ett mönster i en sträng med metoden `substitute()`:

```shell
:echo substitute("sweet", "e", "o", "g")
" returnerar "swoot"
```

Den sista parametern, "g", är den globala flaggan. Med den kommer Vim att ersätta alla matchande förekomster. Utan den kommer Vim endast att ersätta den första matchningen.

```shell
:echo substitute("sweet", "e", "o", "")
" returnerar "swoet"
```

Ersättningskommandot kan kombineras med `getline()`. Kom ihåg att funktionen `getline()` hämtar texten på det angivna radnumret. Anta att du har texten "chocolate donut" på rad 5. Du kan använda proceduren:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" returnerar glazed donut
```

Det finns många andra strängprocedurer. Kolla in `:h string-functions`.

## Lista

En Vimscript-lista är som en Array i Javascript eller Lista i Python. Det är en *ordnad* sekvens av objekt. Du kan blanda och matcha innehållet med olika datatyper:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Sublister

Vim-listan är nollindexerad. Du kan komma åt ett särskilt objekt i en lista med `[n]`, där n är indexet.

```shell
:echo ["a", "sweet", "dessert"][0]
" returnerar "a"

:echo ["a", "sweet", "dessert"][2]
" returnerar "dessert"
```

Om du går över det maximala indexnumret, kommer Vim att kasta ett fel som säger att indexet är utanför intervallet:

```shell
:echo ["a", "sweet", "dessert"][999]
" returnerar ett fel
```

När du går under noll kommer Vim att börja indexera från det sista elementet. Att gå förbi det minimi indexnumret kommer också att kasta ett fel:

```shell
:echo ["a", "sweet", "dessert"][-1]
" returnerar "dessert"

:echo ["a", "sweet", "dessert"][-3]
" returnerar "a"

:echo ["a", "sweet", "dessert"][-999]
" returnerar ett fel
```

Du kan "skiva" flera element från en lista med `[n:m]`, där `n` är startindexet och `m` är slutindexet.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" returnerar ["plain", "strawberry", "lemon"]
```

Om du inte skickar `m` (`[n:]`), kommer Vim att returnera resten av elementen som börjar från det n:te elementet. Om du inte skickar `n` (`[:m]`), kommer Vim att returnera det första elementet upp till det m:te elementet.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" returnerar ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" returnerar ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

Du kan skicka ett index som överskrider det maximala antalet objekt när du skivar en array.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" returnerar ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### Skärning av Sträng

Du kan skära och rikta strängar precis som listor:

```viml
:echo "choco"[0]
" returnerar "c"

:echo "choco"[1:3]
" returnerar "hoc"

:echo "choco"[:3]
" returnerar choc

:echo "choco"[1:]
" returnerar hoco
```

### Lista Aritmetik

Du kan använda `+` för att sammanfoga och mutera en lista:

```viml
:let sweetList = ["choklad", "jordgubbe"]
:let sweetList += ["socker"]
:echo sweetList
" returnerar ["choklad", "jordgubbe", "socker"]
```

### Lista Funktioner

Låt oss utforska Vims inbyggda listfunktioner.

För att få längden på en lista, använd `len()`:

```shell
:echo len(["choklad", "jordgubbe"])
" returnerar 2
```

För att lägga till ett element i början av en lista kan du använda `insert()`:

```shell
:let sweetList = ["choklad", "jordgubbe"]
:call insert(sweetList, "glaserad")

:echo sweetList
" returnerar ["glaserad", "choklad", "jordgubbe"]
```

Du kan också skicka `insert()` indexet där du vill lägga till elementet. Om du vill lägga till ett objekt före det andra elementet (index 1):

```shell
:let sweeterList = ["glaserad", "choklad", "jordgubbe"]
:call insert(sweeterList, "grädde", 1)

:echo sweeterList
" returnerar ['glaserad', 'grädde', 'choklad', 'jordgubbe']
```

För att ta bort ett listobjekt, använd `remove()`. Den accepterar en lista och elementindexet du vill ta bort.

```shell
:let sweeterList = ["glaserad", "choklad", "jordgubbe"]
:call remove(sweeterList, 1)

:echo sweeterList
" returnerar ['glaserad', 'jordgubbe']
```

Du kan använda `map()` och `filter()` på en lista. För att filtrera bort element som innehåller frasen "choco":

```shell
:let sweeterList = ["glaserad", "choklad", "jordgubbe"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" returnerar ["glaserad", "jordgubbe"]

:let sweetestList = ["choklad", "glaserad", "socker"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" returnerar ['choklad donut', 'glaserad donut', 'socker donut']
```

Variabeln `v:val` är en speciell Vim-variabel. Den är tillgänglig när du itererar över en lista eller en ordbok med `map()` eller `filter()`. Den representerar varje itererat objekt.

För mer, kolla in `:h list-functions`.

### Lista Avpackning

Du kan avpacka en lista och tilldela variabler till listobjekten:

```shell
:let favoriteFlavor = ["choklad", "glaserad", "naturell"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" returnerar "choklad"

:echo flavor2
" returnerar "glaserad"
```

För att tilldela resten av listobjekten kan du använda `;` följt av ett variabelnamn:

```shell
:let favoriteFruits = ["äpple", "banan", "citron", "blåbär", "hallon"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" returnerar "äpple"

:echo restFruits
" returnerar ['citron', 'blåbär', 'hallon']
```

### Modifiera Lista

Du kan modifiera ett listobjekt direkt:

```shell
:let favoriteFlavor = ["choklad", "glaserad", "naturell"]
:let favoriteFlavor[0] = "socker"
:echo favoriteFlavor
" returnerar ['socker', 'glaserad', 'naturell']
```

Du kan mutera flera listobjekt direkt:

```shell
:let favoriteFlavor = ["choklad", "glaserad", "naturell"]
:let favoriteFlavor[2:] = ["jordgubbe", "choklad"]
:echo favoriteFlavor
" returnerar ['choklad', 'glaserad', 'jordgubbe', 'choklad']
```

## Ordbok

En Vimscript-ordbok är en associativ, oordnad lista. En icke-tom ordbok består av minst ett nyckel-värde-par.

```shell
{"frukost": "våfflor", "lunch": "pannkakor"}
{"måltid": ["frukost", "andra frukost", "tredje frukost"]}
{"middag": 1, "efterrätt": 2}
```

Ett Vim-ordbokdataobjekt använder strängar för nycklar. Om du försöker använda ett nummer kommer Vim att omvandla det till en sträng.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" returnerar {'1': '7am', '2': '9am', '11ses': '11am'}
```

Om du är för lat för att sätta citat runt varje nyckel, kan du använda `#{}`-notationen:

```shell
:let mealPlans = #{frukost: "våfflor", lunch: "pannkakor", middag: "donuts"}

:echo mealPlans
" returnerar {'lunch': 'pannkakor', 'frukost': 'våfflor', 'middag': 'donuts'}
```

Det enda kravet för att använda `#{}`-syntaxen är att varje nyckel måste vara antingen:

- ASCII-tecken.
- Siffra.
- Ett understreck (`_`).
- Ett bindestreck (`-`).

Precis som listor kan du använda vilken datatyp som helst som värden.

```shell
:let mealPlan = {"frukost": ["pannkaka", "våffla", "hash brown"], "lunch": WhatsForLunch(), "middag": {"förrätt": "gruel", "huvudrätt": "mer gruel"}}
```

### Åtkomst till Ordbok

För att få åtkomst till ett värde från en ordbok kan du anropa nyckeln med antingen hakparenteser (`['nyckel']`) eller punktnotation (`.nyckel`).

```shell
:let meal = {"frukost": "gruel omeletter", "lunch": "gruel smörgåsar", "middag": "mer gruel"}

:let breakfast = meal['frukost']
:let lunch = meal.lunch

:echo breakfast
" returnerar "gruel omeletter"

:echo lunch
" returnerar "gruel smörgåsar"
```

### Modifiera Ordbok

Du kan modifiera eller till och med lägga till innehåll i en ordbok:

```shell
:let meal = {"frukost": "gruel omeletter", "lunch": "gruel smörgåsar"}

:let meal.frukost = "frukost tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["middag"] = "quesadillas"

:echo meal
" returnerar {'lunch': 'tacos al pastor', 'frukost': 'frukost tacos', 'middag': 'quesadillas'}
```

### Ordbok Funktioner

Låt oss utforska några av Vims inbyggda funktioner för att hantera ordböcker.

För att kontrollera längden på en ordbok, använd `len()`.

```shell
:let mealPlans = #{frukost: "våfflor", lunch: "pannkakor", middag: "donuts"}

:echo len(mealPlans)
" returnerar 3
```

För att se om en ordbok innehåller en specifik nyckel, använd `has_key()`.

```shell
:let mealPlans = #{frukost: "våfflor", lunch: "pannkakor", middag: "donuts"}

:echo has_key(mealPlans, "frukost")
" returnerar 1

:echo has_key(mealPlans, "efterrätt")
" returnerar 0
```

För att se om en ordbok har något objekt, använd `empty()`. `empty()`-proceduren fungerar med alla datatyper: lista, ordbok, sträng, nummer, flyttal, etc.

```shell
:let mealPlans = #{frukost: "våfflor", lunch: "pannkakor", middag: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" returnerar 1

:echo empty(mealPlans)
" returnerar 0
```

För att ta bort en post från en ordbok, använd `remove()`.

```shell
:let mealPlans = #{frukost: "våfflor", lunch: "pannkakor", middag: "donuts"}

:echo "tar bort frukost: " . remove(mealPlans, "frukost")
" returnerar "tar bort frukost: 'våfflor'"

:echo mealPlans
" returnerar {'lunch': 'pannkakor', 'middag': 'donuts'}
```

För att konvertera en ordbok till en lista av listor, använd `items()`:

```shell
:let mealPlans = #{frukost: "våfflor", lunch: "pannkakor", middag: "donuts"}

:echo items(mealPlans)
" returnerar [['lunch', 'pannkakor'], ['frukost', 'våfflor'], ['middag', 'donuts']]
```

`filter()` och `map()` är också tillgängliga.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" returnerar {'2': '9am', '11ses': '11am'}
```

Eftersom en ordbok innehåller nyckel-värde-par, tillhandahåller Vim den speciella variabeln `v:key` som fungerar liknande `v:val`. När du itererar genom en ordbok kommer `v:key` att hålla värdet av den aktuella itererade nyckeln.

Om du har en `mealPlans` ordbok kan du mappa den med `v:key`.

```shell
:let mealPlans = #{frukost: "våfflor", lunch: "pannkakor", middag: "donuts"}
:call map(mealPlans, 'v:key . " och mjölk"')

:echo mealPlans
" returnerar {'lunch': 'lunch och mjölk', 'frukost': 'frukost och mjölk', 'middag': 'middag och mjölk'}
```

På liknande sätt kan du mappa den med `v:val`:

```shell
:let mealPlans = #{frukost: "våfflor", lunch: "pannkakor", middag: "donuts"}
:call map(mealPlans, 'v:val . " och mjölk"')

:echo mealPlans
" returnerar {'lunch': 'pannkakor och mjölk', 'frukost': 'våfflor och mjölk', 'middag': 'donuts och mjölk'}
```

För att se fler ordboksfunktioner, kolla in `:h dict-functions`.

## Speciella Primitiver

Vim har speciella primitiva:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

För övrigt, `v:` är Vims inbyggda variabel. De kommer att täckas mer i ett senare kapitel.

Enligt min erfarenhet kommer du inte att använda dessa speciella primitiva ofta. Om du behöver ett sanningsenligt / falskt värde kan du bara använda 0 (falskt) och icke-0 (sanningsenligt). Om du behöver en tom sträng, använd bara `""`. Men det är fortfarande bra att veta, så låt oss snabbt gå igenom dem.

### Sant

Detta är ekvivalent med `true`. Det är ekvivalent med ett nummer med värdet icke-0. När du avkodar json med `json_encode()`, tolkas det som "sant".

```shell
:echo json_encode({"test": v:true})
" returnerar {"test": true}
```

### Falskt

Detta är ekvivalent med `false`. Det är ekvivalent med ett nummer med värdet 0. När du avkodar json med `json_encode()`, tolkas det som "falskt".

```shell
:echo json_encode({"test": v:false})
" returnerar {"test": false}
```

### Ingen

Det är ekvivalent med en tom sträng. När du avkodar json med `json_encode()`, tolkas det som en tom post (`null`).

```shell
:echo json_encode({"test": v:none})
" returnerar {"test": null}
```

### Null

Liknande `v:none`.

```shell
:echo json_encode({"test": v:null})
" returnerar {"test": null}
```

## Lär dig Datatyper på ett Smart Sätt

I detta kapitel har du lärt dig om Vimscript's grundläggande datatyper: nummer, flyttal, sträng, lista, ordbok och speciella. Att lära sig dessa är det första steget för att börja programmera i Vimscript.

I nästa kapitel kommer du att lära dig hur man kombinerar dem för att skriva uttryck som likheter, villkor och loopar.