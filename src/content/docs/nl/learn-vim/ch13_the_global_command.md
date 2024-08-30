---
description: In dit document leer je hoe je de globale opdracht in Vim gebruikt om
  commando's op meerdere regels tegelijk uit te voeren.
title: Ch13. the Global Command
---

Tot nu toe heb je geleerd hoe je de laatste wijziging kunt herhalen met het puntcommando (`.`), hoe je acties kunt herhalen met macro's (`q`), en hoe je teksten kunt opslaan in de registers (`"`).

In dit hoofdstuk leer je hoe je een opdrachtregelcommando kunt herhalen met het globale commando.

## Overzicht van het Globale Commando

Het globale commando van Vim wordt gebruikt om een opdrachtregelcommando tegelijkertijd op meerdere regels uit te voeren.

Overigens heb je misschien eerder de term "Ex Commands" gehoord. In deze gids noem ik ze opdrachtregelcommando's. Zowel Ex-commando's als opdrachtregelcommando's zijn hetzelfde. Het zijn de commando's die beginnen met een dubbele punt (`:`). Het vervangcommando in het vorige hoofdstuk was een voorbeeld van een Ex-commando. Ze worden Ex genoemd omdat ze oorspronkelijk afkomstig zijn van de Ex-teksteditor. Ik zal ze in deze gids blijven aanduiden als opdrachtregelcommando's. Voor een volledige lijst van Ex-commando's, kijk naar `:h ex-cmd-index`.

Het globale commando heeft de volgende syntaxis:

```shell
:g/patroon/opdracht
```

De `patroon` komt overeen met alle regels die dat patroon bevatten, vergelijkbaar met het patroon in het vervangcommando. De `opdracht` kan elk opdrachtregelcommando zijn. Het globale commando werkt door `opdracht` uit te voeren op elke regel die overeenkomt met het `patroon`.

Als je de volgende expressies hebt:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Om alle regels die "console" bevatten te verwijderen, kun je uitvoeren:

```shell
:g/console/d
```

Resultaat:

```shell
const one = 1;

const two = 2;

const three = 3;
```

Het globale commando voert het verwijdercommando (`d`) uit op alle regels die overeenkomen met het "console" patroon.

Bij het uitvoeren van het `g` commando, maakt Vim twee scans door het bestand. Bij de eerste run scant het elke regel en markeert de regel die overeenkomt met het `/console/` patroon. Zodra alle overeenkomende regels zijn gemarkeerd, gaat het voor de tweede keer en voert het het `d` commando uit op de gemarkeerde regels.

Als je in plaats daarvan alle regels wilt verwijderen die "const" bevatten, voer dan uit:

```shell
:g/const/d
```

Resultaat:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Inverse Match

Om het globale commando op niet-overeenkomende regels uit te voeren, kun je uitvoeren:

```shell
:g!/patroon/opdracht
```

of

```shell
:v/patroon/opdracht
```

Als je `:v/console/d` uitvoert, worden alle regels *niet* met "console" verwijderd.

## Patroon

Het globale commando gebruikt hetzelfde patroon systeem als het vervangcommando, dus deze sectie dient als een opfrisser. Voel je vrij om naar de volgende sectie te springen of mee te lezen!

Als je deze expressies hebt:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Om de regels te verwijderen die "one" of "two" bevatten, voer je uit:

```shell
:g/one\|two/d
```

Om de regels te verwijderen die enige enkele cijfers bevatten, voer je een van de volgende uit:

```shell
:g/[0-9]/d
```

of

```shell
:g/\d/d
```

Als je de expressie hebt:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Om de regels te matchen die tussen de drie en zes nullen bevatten, voer je uit:

```shell
:g/0\{3,6\}/d
```

## Een Bereik Doorgeven

Je kunt een bereik doorgeven voor het `g` commando. Hier zijn enkele manieren waarop je dit kunt doen:
- `:1,5g/console/d` matcht de string "console" tussen regels 1 en 5 en verwijdert deze.
- `:,5g/console/d` als er geen adres voor de komma staat, begint het vanaf de huidige regel. Het zoekt naar de string "console" tussen de huidige regel en regel 5 en verwijdert deze.
- `:3,g/console/d` als er geen adres na de komma staat, eindigt het op de huidige regel. Het zoekt naar de string "console" tussen regel 3 en de huidige regel en verwijdert deze.
- `:3g/console/d` als je slechts één adres zonder een komma doorgeeft, voert het commando alleen uit op regel 3. Het kijkt op regel 3 en verwijdert deze als deze de string "console" heeft.

Naast nummers kun je ook deze symbolen als bereik gebruiken:
- `.` betekent de huidige regel. Een bereik van `.,3` betekent tussen de huidige regel en regel 3.
- `$` betekent de laatste regel in het bestand. `3,$` bereik betekent tussen regel 3 en de laatste regel.
- `+n` betekent n regels na de huidige regel. Je kunt het gebruiken met `.` of zonder. `3,+1` of `3,.+1` betekent tussen regel 3 en de regel na de huidige regel.

Als je geen bereik opgeeft, heeft het standaard invloed op het hele bestand. Dit is eigenlijk niet de norm. De meeste opdrachtregelcommando's van Vim worden alleen op de huidige regel uitgevoerd als je er geen bereik aan doorgeeft. De twee opmerkelijke uitzonderingen zijn de globale (`:g`) en de opslaan (`:w`) commando's.

## Normaal Commando

Je kunt een normaal commando uitvoeren met het globale commando met het `:normal` opdrachtregelcommando.

Als je deze tekst hebt:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Om een ";" aan het einde van elke regel toe te voegen, voer je uit:

```shell
:g/./normal A;
```

Laten we het opsplitsen:
- `:g` is het globale commando.
- `/./` is een patroon voor "niet-lege regels". Het komt overeen met de regels met ten minste één teken, dus het komt overeen met de regels met "const" en "console" en het komt niet overeen met lege regels.
- `normal A;` voert het `:normal` opdrachtregelcommando uit. `A;` is het normale moduscommando om een ";" aan het einde van de regel in te voegen.

## Een Macro Uitvoeren

Je kunt ook een macro uitvoeren met het globale commando. Een macro kan worden uitgevoerd met het `normal` commando. Als je de expressies hebt:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Merk op dat de regels met "const" geen puntkomma's hebben. Laten we een macro maken om een puntkomma aan het einde van die regels in het register a toe te voegen:

```shell
qaA;<Esc>q
```

Als je een opfrisser nodig hebt, kijk dan naar het hoofdstuk over macro's. Voer nu uit:

```shell
:g/const/normal @a
```

Nu hebben alle regels met "const" een ";" aan het einde.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Als je deze stap-voor-stap hebt gevolgd, heb je twee puntkomma's op de eerste regel. Om dat te voorkomen, voer je het globale commando uit vanaf regel twee, `:2,$g/const/normal @a`.

## Recursief Globaal Commando

Het globale commando zelf is een soort opdrachtregelcommando, dus je kunt technisch gezien het globale commando binnen een globaal commando uitvoeren.

Gegeven de volgende expressies, als je de tweede `console.log` verklaring wilt verwijderen:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Als je uitvoert:

```shell
:g/console/g/two/d
```

Eerst zal `g` zoeken naar de regels die het patroon "console" bevatten en zal 3 overeenkomsten vinden. Vervolgens zal de tweede `g` zoeken naar de regel die het patroon "two" bevat uit die drie overeenkomsten. Ten slotte zal het die overeenkomst verwijderen.

Je kunt ook `g` combineren met `v` om positieve en negatieve patronen te vinden. Bijvoorbeeld:

```shell
:g/console/v/two/d
```

In plaats van te zoeken naar de regel die het patroon "two" bevat, zal het zoeken naar de regels *niet* die het patroon "two" bevatten.

## De Scheidingsteken Wijzigen

Je kunt de scheidingsteken van het globale commando wijzigen zoals bij het vervangcommando. De regels zijn hetzelfde: je kunt elk enkel byte-teken gebruiken, behalve voor letters, cijfers, `"`, `|`, en `\`.

Om de regels te verwijderen die "console" bevatten:

```shell
:g@console@d
```

Als je het vervangcommando met het globale commando gebruikt, kun je twee verschillende scheidingstekens hebben:

```shell
g@one@s+const+let+g
```

Hier zal het globale commando zoeken naar alle regels die "one" bevatten. Het vervangcommando zal, uit die overeenkomsten, de string "const" vervangen door "let".

## Het Standaard Commando

Wat gebeurt er als je geen opdrachtregelcommando opgeeft in het globale commando?

Het globale commando zal het print (`:p`) commando gebruiken om de tekst van de huidige regel af te drukken. Als je uitvoert:

```shell
:g/console
```

Zal het onderaan het scherm alle regels afdrukken die "console" bevatten.

Overigens, hier is een interessant feit. Omdat het standaardcommando dat door het globale commando wordt gebruikt `p` is, maakt dit de `g` syntaxis:

```shell
:g/re/p
```

- `g` = het globale commando
- `re` = het regex patroon
- `p` = het printcommando

Het spelt *"grep"*, dezelfde `grep` van de opdrachtregel. Dit is **geen** toeval. Het `g/re/p` commando kwam oorspronkelijk van de Ed Editor, een van de oorspronkelijke lijn teksteditors. Het `grep` commando heeft zijn naam te danken aan Ed.

Je computer heeft waarschijnlijk nog steeds de Ed editor. Voer `ed` uit vanuit de terminal (tip: om te stoppen, typ `q`).

## Het Omkeren van de Hele Buffer

Om het hele bestand om te keren, voer je uit:

```shell
:g/^/m 0
```

`^` is een patroon voor het begin van een regel. Gebruik `^` om alle regels te matchen, inclusief lege regels.

Als je alleen een paar regels wilt omkeren, geef dan een bereik door. Om de regels tussen regel vijf en regel tien om te keren, voer je uit:

```shell
:5,10g/^/m 0
```

Om meer te leren over het verplaatscommando, kijk naar `:h :move`.

## Alle Todo's Aggregateren

Bij het coderen schrijf ik soms TODO's in het bestand dat ik aan het bewerken ben:

```shell
const one = 1;
console.log("one: ", one);
// TODO: feed the puppy

const two = 2;
// TODO: feed the puppy automatically
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: create a startup selling an automatic puppy feeder
```

Het kan moeilijk zijn om al de gemaakte TODO's bij te houden. Vim heeft een `:t` (kopieer) methode om alle overeenkomsten naar een adres te kopiëren. Om meer te leren over de kopiemethode, kijk naar `:h :copy`.

Om alle TODO's naar het einde van het bestand te kopiëren voor gemakkelijkere inspectie, voer je uit:

```shell
:g/TODO/t $
```

Resultaat:

```shell
const one = 1;
console.log("one: ", one);
// TODO: feed the puppy

const two = 2;
// TODO: feed the puppy automatically
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: create a startup selling an automatic puppy feeder

// TODO: feed the puppy
// TODO: feed the puppy automatically
// TODO: create a startup selling an automatic puppy feeder
```

Nu kan ik alle TODO's die ik heb gemaakt bekijken, een tijd vinden om ze te doen of ze aan iemand anders delegeren, en doorgaan met mijn volgende taak.

Als je in plaats van ze te kopiëren, alle TODO's naar het einde wilt verplaatsen, gebruik dan het verplaatscommando, `:m`:

```shell
:g/TODO/m $
```

Resultaat:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: feed the puppy
// TODO: feed the puppy automatically
// TODO: create a startup selling an automatic puppy feeder
```

## Black Hole Verwijdering

Vergeet niet uit het registerhoofdstuk dat verwijderde teksten worden opgeslagen in de genummerde registers (mits ze groot genoeg zijn). Wanneer je `:g/console/d` uitvoert, slaat Vim de verwijderde regels op in de genummerde registers. Als je veel regels verwijdert, kun je snel al je genummerde registers vullen. Om dit te voorkomen, kun je altijd het black hole register (`"_`) gebruiken om *niet* je verwijderde regels in de registers op te slaan. Voer uit:

```shell
:g/console/d_
```

Door `_` na `d` door te geven, zal Vim je scratch registers niet gebruiken.
## Verminder Meerdere Lege Regels tot Eén Lege Regel

Als je een tekst hebt met meerdere lege regels:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Je kunt de lege regels snel verminderen tot één lege regel met:

```shell
:g/^$/,/./-1j
```

Resultaat:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normaal accepteert het globale commando de volgende vorm: `:g/pattern/command`. Je kunt het globale commando echter ook uitvoeren met de volgende vorm: `:g/pattern1/,/pattern2/command`. Hiermee past Vim het `command` toe binnen `pattern1` en `pattern2`.

Met dat in gedachten, laten we het commando `:g/^$/,/./-1j` ontleden volgens `:g/pattern1/,/pattern2/command`:
- `/pattern1/` is `/^$/`. Het vertegenwoordigt een lege regel (een regel zonder karakters).
- `/pattern2/` is `/./` met de `-1` regelmodifier. `/./` vertegenwoordigt een niet-lege regel (een regel met ten minste één karakter). De `-1` betekent de regel erboven.
- `command` is `j`, het samenvoegcommando (`:j`). In deze context voegt dit globale commando alle gegeven regels samen.

Trouwens, als je meerdere lege regels wilt verminderen tot geen regels, voer dan dit in plaats daarvan uit:

```shell
:g/^$/,/./j
```

Een eenvoudigere alternatieve:

```shell
:g/^$/-j
```

Je tekst is nu verminderd tot:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Geavanceerd Sorteren

Vim heeft een `:sort` commando om de regels binnen een bereik te sorteren. Bijvoorbeeld:

```shell
d
b
a
e
c
```

Je kunt ze sorteren door `:sort` uit te voeren. Als je een bereik opgeeft, sorteert het alleen de regels binnen dat bereik. Bijvoorbeeld, `:3,5sort` sorteert alleen de regels drie en vijf.

Als je de volgende expressies hebt:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Als je de elementen binnen de arrays wilt sorteren, maar niet de arrays zelf, kun je dit uitvoeren:

```shell
:g/\[/+1,/\]/-1sort
```

Resultaat:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

Dit is geweldig! Maar het commando lijkt ingewikkeld. Laten we het ontleden. Dit commando volgt ook de vorm `:g/pattern1/,/pattern2/command`.

- `:g` is het globale commando patroon.
- `/\[/+1` is het eerste patroon. Het matcht een letterlijke linker haakje "[". De `+1` verwijst naar de regel eronder.
- `/\]/-1` is het tweede patroon. Het matcht een letterlijke rechter haakje "]". De `-1` verwijst naar de regel erboven.
- `/\[/+1,/\]/-1` verwijst dan naar alle regels tussen "[" en "]".
- `sort` is een commandoregelcommando om te sorteren.

## Leer het Globale Commando op de Slimme Manier

Het globale commando voert het commandoregelcommando uit tegen alle overeenkomende regels. Hiermee hoef je slechts één keer een commando uit te voeren en zal Vim de rest voor je doen. Om bedreven te worden in het globale commando, zijn twee dingen vereist: een goede woordenschat van commandoregelcommando's en kennis van reguliere expressies. Naarmate je meer tijd met Vim doorbrengt, zul je van nature meer commandoregelcommando's leren. Kennis van reguliere expressies vereist een actievere benadering. Maar zodra je je comfortabel voelt met reguliere expressies, ben je vele anderen voor.

Sommige van de voorbeelden hier zijn ingewikkeld. Laat je niet intimideren. Neem echt de tijd om ze te begrijpen. Leer de patronen lezen. Geef niet op.

Wanneer je meerdere commando's moet uitvoeren, pauzeer en kijk of je het `g` commando kunt gebruiken. Identificeer het beste commando voor de klus en schrijf een patroon om zoveel mogelijk dingen tegelijk te targeten.

Nu je weet hoe krachtig het globale commando is, laten we leren hoe we de externe commando's kunnen gebruiken om je gereedschapsarsenaal te vergroten.