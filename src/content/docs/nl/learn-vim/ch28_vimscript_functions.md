---
description: Deze document behandelt functies in Vimscript, inclusief syntaxisregels
  en voorbeelden van geldige en ongeldige functie-definities.
title: Ch28. Vimscript Functions
---

Functies zijn middelen van abstractie, het derde element in het leren van een nieuwe taal.

In de vorige hoofdstukken heb je de native functies van Vimscript (`len()`, `filter()`, `map()`, enz.) en aangepaste functies in actie gezien. In dit hoofdstuk ga je dieper in op hoe functies werken.

## Functie Syntax Regels

In de kern heeft een Vimscript functie de volgende syntax:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Een functiedefinitie moet beginnen met een hoofdletter. Het begint met het sleutelwoord `function` en eindigt met `endfunction`. Hieronder staat een geldige functie:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Het volgende is geen geldige functie omdat het niet met een hoofdletter begint.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Als je een functie voorafgaat met de scriptvariabele (`s:`), kun je deze met een kleine letter gebruiken. `function s:tasty()` is een geldige naam. De reden waarom Vim vereist dat je een hoofdletter gebruikt, is om verwarring met de ingebouwde functies van Vim (allemaal kleine letters) te voorkomen.

Een functienaam kan niet met een cijfer beginnen. `1Tasty()` is geen geldige functienaam, maar `Tasty1()` is dat wel. Een functie kan ook geen niet-alfanumerieke tekens bevatten behalve `_`. `Tasty-food()`, `Tasty&food()` en `Tasty.food()` zijn geen geldige functienamen. `Tasty_food()` *is* dat wel.

Als je twee functies met dezelfde naam definieert, zal Vim een foutmelding geven dat de functie `Tasty` al bestaat. Om de vorige functie met dezelfde naam te overschrijven, voeg je een `!` toe na het sleutelwoord `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Beschikbare Functies Lijsten

Om alle ingebouwde en aangepaste functies in Vim te zien, kun je het commando `:function` uitvoeren. Om de inhoud van de functie `Tasty` te bekijken, kun je `:function Tasty` uitvoeren.

Je kunt ook naar functies zoeken met een patroon met `:function /pattern`, vergelijkbaar met de zoeknavigatie van Vim (`/pattern`). Om te zoeken naar alle functies die de zin "map" bevatten, voer je `:function /map` uit. Als je externe plugins gebruikt, zal Vim de functies tonen die in die plugins zijn gedefinieerd.

Als je wilt zien waar een functie vandaan komt, kun je het `:verbose` commando gebruiken met het `:function` commando. Om te kijken waar alle functies die het woord "map" bevatten vandaan komen, voer je uit:

```shell
:verbose function /map
```

Toen ik het uitvoerde, kreeg ik een aantal resultaten. Deze vertelt me dat de functie `fzf#vim#maps` autoload functie (ter herinnering, zie Hoofdstuk 23) is geschreven in het bestand `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, op regel 1263. Dit is nuttig voor debugging.

```shell
function fzf#vim#maps(mode, ...)
        Laatste set van ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim regel 1263
```

## Een Functie Verwijderen

Om een bestaande functie te verwijderen, gebruik je `:delfunction {Function_name}`. Om `Tasty` te verwijderen, voer je `:delfunction Tasty` uit.

## Functie Retourwaarde

Voor een functie om een waarde terug te geven, moet je het een expliciete `return` waarde geven. Anders geeft Vim automatisch een impliciete waarde van 0 terug.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Een lege `return` is ook gelijk aan een waarde van 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Als je `:echo Tasty()` uitvoert met de bovenstaande functie, geeft Vim na "Tasty" 0 terug, de impliciete retourwaarde. Om `Tasty()` "Tasty" waarde te laten retourneren, kun je dit doen:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Nu, wanneer je `:echo Tasty()` uitvoert, geeft het de string "Tasty" terug.

Je kunt een functie binnen een expressie gebruiken. Vim zal de retourwaarde van die functie gebruiken. De expressie `:echo Tasty() . " Food!"` geeft "Tasty Food!" weer.

## Formele Argumenten

Om een formeel argument `food` aan je `Tasty` functie door te geven, kun je dit doen:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("gebak")
" retourneert "Tasty gebak"
```

`a:` is een van de variabele scopes die in het vorige hoofdstuk zijn genoemd. Het is de formele parameter variabele. Het is de manier van Vim om een formele parameterwaarde in een functie te krijgen. Zonder het zal Vim een foutmelding geven:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" retourneert "ongedefinieerde variabele naam" fout
```

## Functie Lokale Variabele

Laten we het hebben over de andere variabele die je in het vorige hoofdstuk niet hebt geleerd: de functie lokale variabele (`l:`).

Bij het schrijven van een functie kun je een variabele binnenin definiëren:

```shell
function! Yummy()
  let location = "buik"
  return "Yummy in mijn " . location
endfunction

echo Yummy()
" retourneert "Yummy in mijn buik"
```

In deze context is de variabele `location` hetzelfde als `l:location`. Wanneer je een variabele in een functie definieert, is die variabele *lokaal* voor die functie. Wanneer een gebruiker `location` ziet, kan dit gemakkelijk worden verward met een globale variabele. Ik geef de voorkeur aan meer explicietheid, dus ik geef de voorkeur aan het gebruik van `l:` om aan te geven dat dit een functievariabele is.

Een andere reden om `l:count` te gebruiken is dat Vim speciale variabelen heeft met aliassen die eruitzien als reguliere variabelen. `v:count` is een voorbeeld. Het heeft een alias van `count`. In Vim is het aanroepen van `count` hetzelfde als het aanroepen van `v:count`. Het is gemakkelijk om per ongeluk een van die speciale variabelen aan te roepen.

```shell
function! Calories()
  let count = "count"
  return "Ik tel mijn " . count . " calorieën niet"
endfunction

echo Calories()
" gooit een fout
```

De bovenstaande uitvoering gooit een fout omdat `let count = "Count"` impliciet probeert de speciale variabele `v:count` van Vim opnieuw te definiëren. Onthoud dat speciale variabelen (`v:`) alleen-lezen zijn. Je kunt het niet muteren. Om dit op te lossen, gebruik je `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "Ik tel mijn " . l:count . " calorieën niet"
endfunction

echo Calories()
" retourneert "Ik tel mijn calorieën niet"
```

## Een Functie Aanroepen

Vim heeft een `:call` commando om een functie aan te roepen.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("jus")
```

Het `call` commando geeft de retourwaarde niet weer. Laten we het aanroepen met `echo`.

```shell
echo call Tasty("jus")
```

Oeps, je krijgt een fout. Het `call` commando hierboven is een commando-regelcommando (`:call`). Het `echo` commando hierboven is ook een commando-regelcommando (`:echo`). Je kunt een commando-regelcommando niet aanroepen met een ander commando-regelcommando. Laten we een andere variant van het `call` commando proberen:

```shell
echo call("Tasty", ["jus"])
" retourneert "Tasty jus"
```

Om enige verwarring te voorkomen, heb je zojuist twee verschillende `call` commando's gebruikt: het `:call` commando-regelcommando en de `call()` functie. De `call()` functie accepteert als eerste argument de functienaam (string) en als tweede argument de formele parameters (lijst).

Om meer te leren over `:call` en `call()`, kijk naar `:h call()` en `:h :call`.

## Standaard Argument

Je kunt een functieparameter een standaardwaarde geven met `=`. Als je `Breakfast` met slechts één argument aanroept, zal het `beverage` argument de standaardwaarde "melk" gebruiken.

```shell
function! Breakfast(meal, beverage = "Melk")
  return "Ik had " . a:meal . " en " . a:beverage . " voor ontbijt"
endfunction

echo Breakfast("Hash Browns")
" retourneert Ik had hash browns en melk voor ontbijt

echo Breakfast("Cereal", "Sinaasappelsap")
" retourneert Ik had Cereal en Sinaasappelsap voor ontbijt
```

## Variabele Argumenten

Je kunt een variabel argument doorgeven met drie puntjes (`...`). Een variabel argument is nuttig wanneer je niet weet hoeveel variabelen een gebruiker zal geven.

Stel dat je een all-you-can-eat buffet creëert (je weet nooit hoeveel voedsel je klant zal eten):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Als je `echo Buffet("Noodles")` uitvoert, geeft het "Noodles" weer. Vim gebruikt `a:1` om het *eerste* argument dat aan `...` is doorgegeven weer te geven, tot 20 (`a:1` is het eerste argument, `a:2` is het tweede argument, enz.). Als je `echo Buffet("Noodles", "Sushi")` uitvoert, geeft het nog steeds alleen "Noodles" weer, laten we het bijwerken:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" retourneert "Noodles Sushi"
```

Het probleem met deze aanpak is dat als je nu `echo Buffet("Noodles")` (met slechts één variabele) uitvoert, Vim klaagt dat het een ongedefinieerde variabele `a:2` heeft. Hoe kun je het flexibel genoeg maken om precies weer te geven wat de gebruiker geeft?

Gelukkig heeft Vim een speciale variabele `a:0` om het *aantal* argumenten dat in `...` is doorgegeven weer te geven.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" retourneert 1

echo Buffet("Noodles", "Sushi")
" retourneert 2

echo Buffet("Noodles", "Sushi", "IJs", "Tofu", "Mochi")
" retourneert 5
```

Met dit kun je itereren met de lengte van het argument.

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

De accolades `a:{l:food_counter}` is een stringinterpolatie, het gebruikt de waarde van de `food_counter` teller om de formele parameterargumenten `a:1`, `a:2`, `a:3`, enz. aan te roepen.

```shell
echo Buffet("Noodles")
" retourneert "Noodles"

echo Buffet("Noodles", "Sushi", "IJs", "Tofu", "Mochi")
" retourneert alles wat je hebt doorgegeven: "Noodles Sushi IJs Tofu Mochi"
```

Het variabele argument heeft nog een speciale variabele: `a:000`. Het heeft de waarde van alle variabele argumenten in een lijstformaat.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" retourneert ["Noodles"]

echo Buffet("Noodles", "Sushi", "IJs", "Tofu", "Mochi")
" retourneert ["Noodles", "Sushi", "IJs", "Tofu", "Mochi"]
```

Laten we de functie refactoren om een `for`-lus te gebruiken:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "IJs", "Tofu", "Mochi")
" retourneert Noodles Sushi IJs Tofu Mochi
```
## Bereik

Je kunt een *bereik* Vimscript-functie definiëren door een `range`-sleutelwoord aan het einde van de functiedefinitie toe te voegen. Een bereikfunctie heeft twee speciale variabelen beschikbaar: `a:firstline` en `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Als je op regel 100 bent en je voert `call Breakfast()` uit, wordt 100 weergegeven voor zowel `firstline` als `lastline`. Als je visueel regels 101 tot 105 markeert (`v`, `V` of `Ctrl-V`) en `call Breakfast()` uitvoert, toont `firstline` 101 en `lastline` 105. `firstline` en `lastline` tonen het minimum en maximum bereik waar de functie wordt aangeroepen.

Je kunt ook `:call` gebruiken en een bereik doorgeven. Als je `:11,20call Breakfast()` uitvoert, wordt 11 weergegeven voor `firstline` en 20 voor `lastline`.

Je zou kunnen vragen: "Dat is leuk dat de Vimscript-functie een bereik accepteert, maar kan ik het lijnnummer niet krijgen met `line(".")`? Doet dat niet hetzelfde?"

Goede vraag. Als dit is wat je bedoelt:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Het aanroepen van `:11,20call Breakfast()` voert de `Breakfast`-functie 10 keer uit (één voor elke regel in het bereik). Vergelijk dat met het doorgeven van het `range`-argument:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Het aanroepen van `11,20call Breakfast()` voert de `Breakfast`-functie *een keer* uit.

Als je een `range`-sleutelwoord doorgeeft en je geeft een numeriek bereik (zoals `11,20`) door aan `call`, voert Vim die functie slechts één keer uit. Als je geen `range`-sleutelwoord doorgeeft en je geeft een numeriek bereik (zoals `11,20`) door aan `call`, voert Vim die functie N keer uit, afhankelijk van het bereik (in dit geval, N = 10).

## Woordenboek

Je kunt een functie als een woordenboekitem toevoegen door een `dict`-sleutelwoord toe te voegen bij het definiëren van een functie.

Als je een functie `SecondBreakfast` hebt die wat `breakfast`-item teruggeeft dat je hebt:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Laten we deze functie toevoegen aan het `meals`-woordenboek:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" retourneert "pancakes"
```

Met het `dict`-sleutelwoord verwijst de sleutelvariabele `self` naar het woordenboek waar de functie is opgeslagen (in dit geval, het `meals`-woordenboek). De expressie `self.breakfast` is gelijk aan `meals.breakfast`.

Een alternatieve manier om een functie in een woordenboekobject toe te voegen, is het gebruik van een namespace.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" retourneert "pasta"
```

Met een namespace hoef je het `dict`-sleutelwoord niet te gebruiken.

## Funcref

Een funcref is een verwijzing naar een functie. Het is een van de basisdatatypes van Vimscript die in Hoofdstuk 24 worden genoemd.

De expressie `function("SecondBreakfast")` hierboven is een voorbeeld van funcref. Vim heeft een ingebouwde functie `function()` die een funcref retourneert wanneer je het een functienaam (string) doorgeeft.

```shell
function! Breakfast(item)
  return "Ik heb " . a:item . " voor ontbijt"
endfunction

let Breakfastify = Breakfast
" retourneert fout

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" retourneert "Ik heb oatmeal voor ontbijt"

echo Breakfastify("pancake")
" retourneert "Ik heb pancake voor ontbijt"
```

In Vim, als je een functie aan een variabele wilt toewijzen, kun je het niet gewoon direct toewijzen zoals `let MyVar = MyFunc`. Je moet de functie `function()` gebruiken, zoals `let MyVar = function("MyFunc")`.

Je kunt funcref gebruiken met maps en filters. Merk op dat maps en filters een index als het eerste argument en de iteratieve waarde als het tweede argument doorgeven.

```shell
function! Breakfast(index, item)
  return "Ik heb " . a:item . " voor ontbijt"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Een betere manier om functies in maps en filters te gebruiken, is door een lambda-expressie (soms bekend als een naamloze functie) te gebruiken. Bijvoorbeeld:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" retourneert 3

let Tasty = { -> 'tasty'}
echo Tasty()
" retourneert "tasty"
```

Je kunt een functie vanuit een lambda-expressie aanroepen:

```shell
function! Lunch(item)
  return "Ik heb " . a:item . " voor lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Als je de functie niet vanuit de lambda wilt aanroepen, kun je het refactoren:

```shell
let day_meals = map(lunch_items, {index, item -> "Ik heb " . item . " voor lunch"})
```

## Methode Keten

Je kunt verschillende Vimscript-functies en lambda-expressies sequentieel aan elkaar koppelen met `->`. Houd er rekening mee dat `->` moet worden gevolgd door een methodenaam *zonder spaties*.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Om een float naar een nummer te converteren met behulp van methodeketen:

```shell
echo 3.14->float2nr()
" retourneert 3
```

Laten we een meer gecompliceerd voorbeeld doen. Stel dat je de eerste letter van elk item in een lijst wilt kapitaliseren, de lijst wilt sorteren en vervolgens de lijst wilt samenvoegen tot een string.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" retourneert "Antipasto, Bruschetta, Calzone"
```

Met methodeketen is de volgorde gemakkelijker te lezen en te begrijpen. Ik kan gewoon een blik werpen op `dinner_items->CapitalizeList()->sort()->join(", ")` en precies weten wat er aan de hand is.

## Sluiting

Wanneer je een variabele binnen een functie definieert, bestaat die variabele binnen de grenzen van die functie. Dit wordt een lexicale scope genoemd.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` is gedefinieerd binnen de `Lunch`-functie, die de `SecondLunch` funcref retourneert. Merk op dat `SecondLunch` de `appetizer` gebruikt, maar in Vimscript heeft het geen toegang tot die variabele. Als je probeert `echo Lunch()()` uit te voeren, zal Vim een foutmelding geven voor een niet-gedefinieerde variabele.

Om dit probleem op te lossen, gebruik je het `closure`-sleutelwoord. Laten we het refactoren:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Nu, als je `echo Lunch()()` uitvoert, retourneert Vim "shrimp".

## Leer Vimscript-functies op de Slimme Manier

In dit hoofdstuk heb je de anatomie van een Vim-functie geleerd. Je hebt geleerd hoe je verschillende speciale sleutelwoorden `range`, `dict` en `closure` kunt gebruiken om het gedrag van functies te wijzigen. Je hebt ook geleerd hoe je lambda kunt gebruiken en meerdere functies samen kunt ketenen. Functies zijn belangrijke hulpmiddelen voor het creëren van complexe abstracties.

Laten we nu alles wat je hebt geleerd samenvoegen om je eigen plugin te maken.