---
description: Denna dokumentation förklarar hur funktioner i Vimscript fungerar, inklusive
  syntaxregler och exempel på giltiga och ogiltiga funktioner.
title: Ch28. Vimscript Functions
---

Funktioner är medel för abstraktion, det tredje elementet i att lära sig ett nytt språk.

I de föregående kapitlen har du sett Vimscript inbyggda funktioner (`len()`, `filter()`, `map()`, etc.) och anpassade funktioner i aktion. I detta kapitel kommer du att gå djupare för att lära dig hur funktioner fungerar.

## Funktionssyntaxregler

I grunden har en Vimscript-funktion följande syntax:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

En funktionsdefinition måste börja med en versal. Den börjar med nyckelordet `function` och slutar med `endfunction`. Nedan är en giltig funktion:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Följande är inte en giltig funktion eftersom den inte börjar med en versal.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Om du föregår en funktion med skriptvariabeln (`s:`), kan du använda den med gemener. `function s:tasty()` är ett giltigt namn. Anledningen till att Vim kräver att du använder ett versalt namn är för att förhindra förvirring med Vims inbyggda funktioner (alla gemener).

Ett funktionsnamn kan inte börja med en siffra. `1Tasty()` är inte ett giltigt funktionsnamn, men `Tasty1()` är det. En funktion kan heller inte innehålla icke-alfanumeriska tecken förutom `_`. `Tasty-food()`, `Tasty&food()` och `Tasty.food()` är inte giltiga funktionsnamn. `Tasty_food()` *är*.

Om du definierar två funktioner med samma namn, kommer Vim att kasta ett fel som klagar på att funktionen `Tasty` redan finns. För att skriva över den tidigare funktionen med samma namn, lägg till ett `!` efter nyckelordet `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Lista tillgängliga funktioner

För att se alla inbyggda och anpassade funktioner i Vim kan du köra kommandot `:function`. För att titta på innehållet i funktionen `Tasty`, kan du köra `:function Tasty`.

Du kan också söka efter funktioner med mönster med `:function /pattern`, liknande Vims söknavigering (`/pattern`). För att söka efter alla funktioner som innehåller frasen "map", kör `:function /map`. Om du använder externa plugins kommer Vim att visa de funktioner som definieras i dessa plugins.

Om du vill se var en funktion härstammar ifrån kan du använda kommandot `:verbose` med kommandot `:function`. För att se var alla funktioner som innehåller ordet "map" härstammar ifrån, kör:

```shell
:verbose function /map
```

När jag körde det fick jag ett antal resultat. Denna säger mig att funktionen `fzf#vim#maps` autoload-funktion (för att sammanfatta, se kap. 23) är skriven i filen `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, på rad 1263. Detta är användbart för felsökning.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Ta bort en funktion

För att ta bort en befintlig funktion, använd `:delfunction {Function_name}`. För att ta bort `Tasty`, kör `:delfunction Tasty`.

## Funktionsreturvärde

För att en funktion ska returnera ett värde måste du ge den ett explicit `return`-värde. Annars returnerar Vim automatiskt ett implicit värde av 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Ett tomt `return` är också likvärdigt med ett 0-värde.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Om du kör `:echo Tasty()` med funktionen ovan, efter att Vim visar "Tasty", returnerar den 0, det implicita returvärdet. För att få `Tasty()` att returnera "Tasty"-värdet kan du göra så här:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Nu när du kör `:echo Tasty()`, returnerar den strängen "Tasty".

Du kan använda en funktion inuti ett uttryck. Vim kommer att använda returvärdet av den funktionen. Uttrycket `:echo Tasty() . " Food!"` ger "Tasty Food!"

## Formella argument

För att skicka ett formellt argument `food` till din `Tasty`-funktion kan du göra så här:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" returnerar "Tasty pastry"
```

`a:` är en av variabelscopena som nämndes i det senaste kapitlet. Det är den formella parametervariabeln. Det är Vims sätt att få ett formellt parametervärde i en funktion. Utan det kommer Vim att kasta ett fel:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" returnerar "undefined variable name" fel
```

## Funktionslokal variabel

Låt oss ta upp den andra variabeln som du inte lärde dig i det föregående kapitlet: den funktionslokala variabeln (`l:`).

När du skriver en funktion kan du definiera en variabel inuti:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" returnerar "Yummy in my tummy"
```

I detta sammanhang är variabeln `location` densamma som `l:location`. När du definierar en variabel i en funktion är den variabeln *lokal* för den funktionen. När en användare ser `location`, kan det lätt misstolkas som en global variabel. Jag föredrar att vara mer utförlig än att inte vara det, så jag föredrar att sätta `l:` för att indikera att detta är en funktionsvariabel.

En annan anledning att använda `l:count` är att Vim har speciella variabler med alias som ser ut som vanliga variabler. `v:count` är ett exempel. Det har ett alias av `count`. I Vim är det samma att kalla `count` som att kalla `v:count`. Det är lätt att av misstag kalla en av dessa speciella variabler.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" kastar ett fel
```

Körningen ovan kastar ett fel eftersom `let count = "Count"` implicit försöker återskapa Vims speciella variabel `v:count`. Kom ihåg att speciella variabler (`v:`) är skrivskyddade. Du kan inte ändra dem. För att åtgärda det, använd `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" returnerar "I do not count my calories"
```

## Anropa en funktion

Vim har ett `:call`-kommando för att anropa en funktion.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

`call`-kommandot ger inte ut returvärdet. Låt oss anropa det med `echo`.

```shell
echo call Tasty("gravy")
```

Oj, du får ett fel. `call`-kommandot ovan är ett kommandorads kommando (`:call`). `echo`-kommandot ovan är också ett kommandorads kommando (`:echo`). Du kan inte anropa ett kommandorads kommando med ett annat kommandorads kommando. Låt oss prova en annan variant av `call`-kommandot:

```shell
echo call("Tasty", ["gravy"])
" returnerar "Tasty gravy"
```

För att klargöra eventuell förvirring har du just använt två olika `call`-kommandon: kommandorads kommandot `:call` och funktionen `call()`. Funktionen `call()` accepterar som sitt första argument funktionsnamnet (sträng) och som sitt andra argument de formella parametrarna (lista).

För att lära dig mer om `:call` och `call()`, kolla in `:h call()` och `:h :call`.

## Standardargument

Du kan ge en funktionsparameter ett standardvärde med `=`. Om du anropar `Breakfast` med endast ett argument, kommer `beverage`-argumentet att använda standardvärdet "milk".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" returnerar I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" returnerar I had Cereal and Orange Juice for breakfast
```

## Variabla argument

Du kan skicka ett variabelargument med tre punkter (`...`). Variabelargument är användbara när du inte vet hur många variabler en användare kommer att ge.

Anta att du skapar en buffé där man kan äta hur mycket man vill (du vet aldrig hur mycket mat din kund kommer att äta):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Om du kör `echo Buffet("Noodles")`, kommer det att ge "Noodles". Vim använder `a:1` för att skriva ut det *första* argumentet som skickas till `...`, upp till 20 (`a:1` är det första argumentet, `a:2` är det andra argumentet, osv). Om du kör `echo Buffet("Noodles", "Sushi")`, kommer det fortfarande att visa bara "Noodles", låt oss uppdatera det:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" returnerar "Noodles Sushi"
```

Problemet med detta tillvägagångssätt är att om du nu kör `echo Buffet("Noodles")` (med endast en variabel), klagar Vim på att det har en icke-definierad variabel `a:2`. Hur kan du göra det tillräckligt flexibelt för att exakt visa vad användaren ger?

Lyckligtvis har Vim en speciell variabel `a:0` för att visa *antalet* argument som skickas in till `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" returnerar 1

echo Buffet("Noodles", "Sushi")
" returnerar 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returnerar 5
```

Med detta kan du iterera med längden på argumentet.

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

De klamrar `{a:food_counter}` är en stränginterpolering, den använder värdet av `food_counter` för att kalla på de formella parameterargumenten `a:1`, `a:2`, `a:3`, osv.

```shell
echo Buffet("Noodles")
" returnerar "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returnerar allt du skickade: "Noodles Sushi Ice cream Tofu Mochi"
```

Variabelargumentet har en speciell variabel till: `a:000`. Den har värdet av alla variabelargument i lista format.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" returnerar ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returnerar ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

Låt oss refaktorera funktionen för att använda en `for`-loop:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returnerar Noodles Sushi Ice cream Tofu Mochi
```
## Omfång

Du kan definiera en *omfattad* Vimscript-funktion genom att lägga till ett `range`-nyckelord i slutet av funktionsdefinitionen. En omfattad funktion har två speciella variabler tillgängliga: `a:firstline` och `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Om du är på rad 100 och kör `call Breakfast()`, kommer det att visa 100 för både `firstline` och `lastline`. Om du visuellt markerar (`v`, `V` eller `Ctrl-V`) raderna 101 till 105 och kör `call Breakfast()`, visar `firstline` 101 och `lastline` visar 105. `firstline` och `lastline` visar det minimi- och maximala omfånget där funktionen anropas.

Du kan också använda `:call` och skicka det ett omfång. Om du kör `:11,20call Breakfast()`, kommer det att visa 11 för `firstline` och 20 för `lastline`.

Du kanske frågar, "Det är trevligt att Vimscript-funktionen accepterar omfång, men kan jag inte få radnumret med `line(".")`? Kommer det inte att göra samma sak?"

Bra fråga. Om detta är vad du menar:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Att kalla `:11,20call Breakfast()` kör `Breakfast`-funktionen 10 gånger (en för varje rad i omfånget). Jämför det om du hade skickat `range`-argumentet:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Att kalla `11,20call Breakfast()` kör `Breakfast`-funktionen *en gång*.

Om du skickar ett `range`-nyckelord och du skickar ett numeriskt omfång (som `11,20`) på `call`, kör Vim endast den funktionen en gång. Om du inte skickar ett `range`-nyckelord och du skickar ett numeriskt omfång (som `11,20`) på `call`, kör Vim den funktionen N gånger beroende på omfånget (i detta fall, N = 10).

## Ordbok

Du kan lägga till en funktion som ett ordboksobjekt genom att lägga till ett `dict`-nyckelord när du definierar en funktion.

Om du har en funktion `SecondBreakfast` som returnerar vilket `breakfast`-objekt du har:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Låt oss lägga till denna funktion i `meals`-ordboken:

```shell
let meals = {"breakfast": "pannkakor", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" returnerar "pannkakor"
```

Med `dict`-nyckelordet refererar nyckelvariabeln `self` till ordboken där funktionen är lagrad (i detta fall, `meals`-ordboken). Uttrycket `self.breakfast` är lika med `meals.breakfast`.

Ett alternativt sätt att lägga till en funktion i ett ordboksobjekt är att använda ett namnrum.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" returnerar "pasta"
```

Med namnrum behöver du inte använda `dict`-nyckelordet.

## Funcref

En funcref är en referens till en funktion. Det är en av Vimscript's grundläggande datatyper som nämns i kap. 24.

Uttrycket `function("SecondBreakfast")` ovan är ett exempel på funcref. Vim har en inbyggd funktion `function()` som returnerar en funcref när du skickar den ett funktionsnamn (sträng).

```shell
function! Breakfast(item)
  return "Jag äter " . a:item . " till frukost"
endfunction

let Breakfastify = Breakfast
" returnerar fel

let Breakfastify = function("Breakfast")

echo Breakfastify("havregryn")
" returnerar "Jag äter havregryn till frukost"

echo Breakfastify("pannkaka")
" returnerar "Jag äter pannkaka till frukost"
```

I Vim, om du vill tilldela en funktion till en variabel, kan du inte bara tilldela den direkt som `let MyVar = MyFunc`. Du behöver använda `function()`-funktionen, som `let MyVar = function("MyFunc")`.

Du kan använda funcref med mappar och filter. Observera att mappar och filter kommer att skicka ett index som det första argumentet och det itererade värdet som det andra argumentet.

```shell
function! Breakfast(index, item)
  return "Jag äter " . a:item . " till frukost"
endfunction

let breakfast_items = ["pannkakor", "hash browns", "våfflor"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Ett bättre sätt att använda funktioner i mappar och filter är att använda lambda-uttryck (ibland kända som namnlösa funktioner). Till exempel:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" returnerar 3

let Tasty = { -> 'läcker'}
echo Tasty()
" returnerar "läcker"
```

Du kan kalla en funktion från insidan av ett lambda-uttryck:

```shell
function! Lunch(item)
  return "Jag äter " . a:item . " till lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Om du inte vill kalla funktionen från insidan av lambda, kan du refaktorera den:

```shell
let day_meals = map(lunch_items, {index, item -> "Jag äter " . item . " till lunch"})
```

## Metodkedjning

Du kan kedja flera Vimscript-funktioner och lambda-uttryck sekventiellt med `->`. Tänk på att `->` måste följas av ett metodnamn *utan mellanslag.*

```shell
Source->Method1()->Method2()->...->MethodN()
```

För att konvertera ett flyttal till ett heltal med metodkedjning:

```shell
echo 3.14->float2nr()
" returnerar 3
```

Låt oss göra ett mer komplicerat exempel. Anta att du behöver kapitalisera den första bokstaven i varje objekt i en lista, sedan sortera listan, och sedan sammanfoga listan för att bilda en sträng.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" returnerar "Antipasto, Bruschetta, Calzone"
```

Med metodkedjning är sekvensen lättare att läsa och förstå. Jag kan bara kasta ett öga på `dinner_items->CapitalizeList()->sort()->join(", ")` och veta exakt vad som pågår.

## Stängning

När du definierar en variabel inuti en funktion, existerar den variabeln inom den funktionens gränser. Detta kallas ett lexikalt omfång.

```shell
function! Lunch()
  let appetizer = "räkor"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` definieras inuti `Lunch`-funktionen, som returnerar `SecondLunch` funcref. Observera att `SecondLunch` använder `appetizer`, men i Vimscript har den inte tillgång till den variabeln. Om du försöker köra `echo Lunch()()`, kommer Vim att kasta ett fel om en icke-definierad variabel.

För att åtgärda detta problem, använd `closure`-nyckelordet. Låt oss refaktorera:

```shell
function! Lunch()
  let appetizer = "räkor"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Nu, om du kör `echo Lunch()()`, kommer Vim att returnera "räkor".

## Lär dig Vimscript-funktioner på ett smart sätt

I detta kapitel lärde du dig anatomien av en Vim-funktion. Du lärde dig hur man använder olika speciella nyckelord `range`, `dict` och `closure` för att modifiera funktionsbeteende. Du lärde dig också hur man använder lambda och kedjar flera funktioner tillsammans. Funktioner är viktiga verktyg för att skapa komplexa abstraktioner.

Nästa steg är att sätta ihop allt du har lärt dig för att skapa din egen plugin.