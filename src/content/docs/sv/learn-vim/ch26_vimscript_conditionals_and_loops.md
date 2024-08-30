---
description: Lär dig använda Vimscript datatyper för att skriva villkor och loopar,
  inklusive relationella operatorer och hur strängar omvandlas till nummer.
title: Ch26. Vimscript Conditionals and Loops
---

Efter att ha lärt sig vad de grundläggande datatyperna är, är nästa steg att lära sig hur man kombinerar dem för att börja skriva ett grundläggande program. Ett grundläggande program består av villkor och loopar.

I detta kapitel kommer du att lära dig hur man använder Vimscript datatyper för att skriva villkor och loopar.

## Relationella Operatorer

Vimscript relationella operatorer liknar många programmeringsspråk:

```shell
a == b		equal to
a != b		not equal to
a >  b		greater than
a >= b		greater than or equal to
a <  b		less than
a <= b		less than or equal to
```

Till exempel:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Kom ihåg att strängar omvandlas till siffror i ett aritmetiskt uttryck. Här omvandlar Vim också strängar till siffror i ett likhetsuttryck. "5foo" omvandlas till 5 (sant):

```shell
:echo 5 == "5foo"
" returns true
```

Kom också ihåg att om du börjar en sträng med ett icke-numeriskt tecken som "foo5", så omvandlas strängen till siffran 0 (falskt).

```shell
echo 5 == "foo5"
" returns false
```

### Stränglogiska Operatorer

Vim har fler relationella operatorer för att jämföra strängar:

```shell
a =~ b
a !~ b
```

Till exempel:

```shell
let str = "hearty breakfast"

echo str =~ "hearty"
" returns true

echo str =~ "dinner"
" returns false

echo str !~ "dinner"
" returns true
```

Operatorn `=~` utför en regex-matchning mot den angivna strängen. I exemplet ovan returnerar `str =~ "hearty"` true eftersom `str` *innehåller* "hearty"-mönstret. Du kan alltid använda `==` och `!=`, men att använda dem kommer att jämföra uttrycket mot hela strängen. `=~` och `!~` är mer flexibla alternativ.

```shell
echo str == "hearty"
" returns false

echo str == "hearty breakfast"
" returns true
```

Låt oss prova detta. Notera det stora "H":

```shell
echo str =~ "Hearty"
" true
```

Det returnerar true även om "Hearty" är med stort begynnelsebokstav. Intressant... Det visar sig att mina Vim-inställningar är inställda på att ignorera versaler (`set ignorecase`), så när Vim kontrollerar för likhet, använder den mina Vim-inställningar och ignorerar versaler. Om jag skulle stänga av ignorera versaler (`set noignorecase`), returnerar jämförelsen nu false.

```shell
set noignorecase
echo str =~ "Hearty"
" returns false because case matters

set ignorecase
echo str =~ "Hearty"
" returns true because case doesn't matter
```

Om du skriver ett plugin för andra, är detta en knepig situation. Använder användaren `ignorecase` eller `noignorecase`? Du vill definitivt *inte* tvinga dina användare att ändra sina alternativ för att ignorera versaler. Så vad gör du?

Lyckligtvis har Vim en operator som alltid kan ignorera eller matcha versaler. För att alltid matcha versaler, lägg till en `#` i slutet.

```shell
set ignorecase
echo str =~# "hearty"
" returns true

echo str =~# "HearTY"
" returns false

set noignorecase
echo str =~# "hearty"
" true

echo str =~# "HearTY"
" false

echo str !~# "HearTY"
" true
```

För att alltid ignorera versaler vid jämförelse, lägg till `?`:

```shell
set ignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

set noignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

echo str !~? "HearTY"
" false
```

Jag föredrar att använda `#` för att alltid matcha versaler och vara på den säkra sidan.

## If

Nu när du har sett Vims likhetsuttryck, låt oss beröra en grundläggande villkorsoperator, `if`-satsen.

Minst, syntaxen är:

```shell
if {clause}
  {some expression}
endif
```

Du kan utöka fallanalysen med `elseif` och `else`.

```shell
if {predicate1}
  {expression1}
elseif {predicate2}
  {expression2}
elseif {predicate3}
  {expression3}
else
  {expression4}
endif
```

Till exempel, pluginet [vim-signify](https://github.com/mhinz/vim-signify) använder en annan installationsmetod beroende på dina Vim-inställningar. Nedan är installationsinstruktionen från deras `readme`, med hjälp av `if`-satsen:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Ternär Uttryck

Vim har ett ternärt uttryck för en enradig fallanalys:

```shell
{predicate} ? expressiontrue : expressionfalse
```

Till exempel:

```shell
echo 1 ? "I am true" : "I am false"
```

Eftersom 1 är sant, ekar Vim "I am true". Anta att du vill villkorligt ställa in `background` till mörk om du använder Vim efter en viss timme. Lägg till detta i vimrc:

```shell
let &background = strftime("%H") < 18 ? "light" : "dark"
```

`&background` är alternativet `'background'` i Vim. `strftime("%H")` returnerar den aktuella tiden i timmar. Om det inte är ännu 18:00, använd en ljus bakgrund. Annars, använd en mörk bakgrund.

## eller

Den logiska "eller" (`||`) fungerar som i många programmeringsspråk.

```shell
{Falskt uttryck}  || {Falskt uttryck}   false
{Falskt uttryck}  || {Sant uttryck}  true
{Sant uttryck} || {Falskt uttryck}   true
{Sant uttryck} || {Sant uttryck}  true
```

Vim utvärderar uttrycket och returnerar antingen 1 (sant) eller 0 (falskt).

```shell
echo 5 || 0
" returns 1

echo 5 || 5
" returns 1

echo 0 || 0
" returns 0

echo "foo5" || "foo5"
" returns 0

echo "5foo" || "foo5"
" returns 1
```

Om det aktuella uttrycket utvärderas till sant, kommer det efterföljande uttrycket inte att utvärderas.

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" returns 1

echo two_dozen || one_dozen
" returns error
```

Observera att `two_dozen` aldrig definieras. Uttrycket `one_dozen || two_dozen` kastar inget fel eftersom `one_dozen` utvärderas först och visar sig vara sant, så Vim utvärderar inte `two_dozen`.

## och

Den logiska "och" (`&&`) är komplementet till den logiska eller.

```shell
{Falskt Uttryck}  && {Falskt Uttryck}   false
{Falskt uttryck}  && {Sant uttryck}  false
{Sant Uttryck} && {Falskt Uttryck}   false
{Sant uttryck} && {Sant uttryck}  true
```

Till exempel:

```shell
echo 0 && 0
" returns 0

echo 0 && 10
" returns 0
```

`&&` utvärderar ett uttryck tills det ser det första falska uttrycket. Till exempel, om du har `true && true`, kommer det att utvärdera båda och returnera `true`. Om du har `true && false && true`, kommer det att utvärdera den första `true` och stoppa vid den första `false`. Det kommer inte att utvärdera den tredje `true`.

```shell
let one_dozen = 12
echo one_dozen && 10
" returns 1

echo one_dozen && v:false
" returns 0

echo one_dozen && two_dozen
" returns error

echo exists("one_dozen") && one_dozen == 12
" returns 1
```

## för

`for`-loopen används vanligtvis med listdatatypen.

```shell
let breakfasts = ["pancakes", "waffles", "eggs"]

for breakfast in breakfasts
  echo breakfast
endfor
```

Den fungerar med nästlade listor:

```shell
let meals = [["breakfast", "pancakes"], ["lunch", "fish"], ["dinner", "pasta"]]

for [meal_type, food] in meals
  echo "I am having " . food . " for " . meal_type
endfor
```

Du kan tekniskt använda `for`-loopen med en ordbok med hjälp av `keys()`-metoden.

```shell
let beverages = #{breakfast: "milk", lunch: "orange juice", dinner: "water"}
for beverage_type in keys(beverages)
  echo "I am drinking " . beverages[beverage_type] . " for " . beverage_type
endfor
```

## Medan

En annan vanlig loop är `while`-loopen.

```shell
let counter = 1
while counter < 5
  echo "Counter is: " . counter
  let counter += 1
endwhile
```

För att få innehållet från den aktuella raden till den sista raden:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## Felhantering

Ofta körs ditt program inte som du förväntar dig. Som ett resultat kastar det dig för en loop (ordlek avsedd). Vad du behöver är en ordentlig felhantering.

### Bryt

När du använder `break` inuti en `while`- eller `for`-loop, stoppar det loopen.

För att få texterna från början av filen till den aktuella raden, men stoppa när du ser ordet "donut":

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

Om du har texten:

```shell
one
two
three
donut
four
five
```

Att köra ovanstående `while`-loop ger "one two three" och inte resten av texten eftersom loopen bryter när den matchar "donut".

### Fortsätt

`continue`-metoden är liknande `break`, där den anropas under en loop. Skillnaden är att istället för att bryta ut ur loopen, hoppar den bara över den aktuella iterationen.

Anta att du har samma text men istället för `break`, använder du `continue`:

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

Denna gång returnerar den `one two three four five`. Den hoppar över raden med ordet "donut", men loopen fortsätter.
### try, finally, och catch

Vim har en `try`, `finally` och `catch` för att hantera fel. För att simulera ett fel kan du använda kommandot `throw`.

```shell
try
  echo "Försök"
  throw "Nej"
endtry
```

Kör detta. Vim kommer att klaga med `"Exception not caught: Nej` fel.

Lägg nu till en catch-block:

```shell
try
  echo "Försök"
  throw "Nej"
catch
  echo "Fångade det"
endtry
```

Nu finns det inte längre något fel. Du bör se "Försök" och "Fångade det" visas.

Låt oss ta bort `catch` och lägga till en `finally`:

```shell
try
  echo "Försök"
  throw "Nej"
  echo "Du kommer inte att se mig"
finally
  echo "Slutligen"
endtry
```

Kör detta. Nu visar Vim felet och "Slutligen".

Låt oss sätta ihop alla:

```shell
try
  echo "Försök"
  throw "Nej"
catch
  echo "Fångade det"
finally
  echo "Slutligen"
endtry
```

Denna gång visar Vim både "Fångade det" och "Slutligen". Inget fel visas eftersom Vim fångade det.

Fel kommer från olika källor. En annan källa till fel är att anropa en icke-existerande funktion, som `Nej()` nedan:

```shell
try
  echo "Försök"
  call Nej()
catch
  echo "Fångade det"
finally
  echo "Slutligen"
endtry
```

Skillnaden mellan `catch` och `finally` är att `finally` alltid körs, oavsett fel eller inte, medan en catch endast körs när din kod får ett fel.

Du kan fånga specifika fel med `:catch`. Enligt `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " fånga avbrott (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " fånga alla Vim-fel
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " fånga fel och avbrott
catch /^Vim(write):/.                " fånga alla fel i :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " fånga fel E123
catch /my-exception/.                " fånga användarfel
catch /.*/                           " fånga allt
catch.                               " samma som /.*/
```

Inuti en `try`-block anses ett avbrott vara ett fångbart fel.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

I din vimrc, om du använder ett anpassat färgschema, som [gruvbox](https://github.com/morhetz/gruvbox), och du av misstag raderar färgschemadirektoriet men fortfarande har raden `colorscheme gruvbox` i din vimrc, kommer Vim att kasta ett fel när du `source` det. För att åtgärda detta, lade jag till detta i min vimrc:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Nu, om du `source` vimrc utan `gruvbox`-direktoriet, kommer Vim att använda `colorscheme default`.

## Lär dig villkor på det smarta sättet

I det föregående kapitlet lärde du dig om Vims grundläggande datatyper. I detta kapitel lärde du dig hur man kombinerar dem för att skriva grundläggande program med hjälp av villkor och loopar. Dessa är byggstenarna i programmering.

Nästa, låt oss lära oss om variabelscope.