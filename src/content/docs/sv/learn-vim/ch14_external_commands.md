---
description: Lär dig hur du utökar Vim för att arbeta sömlöst med externa kommandon
  och utnyttja bang-kommandot för att läsa, skriva och köra kommandon.
title: Ch14. External Commands
---

Inuti Unix-systemet hittar du många små, hyper-specialiserade kommandon som gör en sak (och gör det bra). Du kan kedja dessa kommandon för att arbeta tillsammans för att lösa ett komplext problem. Skulle det inte vara fantastiskt om du kunde använda dessa kommandon inifrån Vim?

Definitivt. I detta kapitel kommer du att lära dig hur du utökar Vim för att arbeta sömlöst med externa kommandon.

## Bang-kommandot

Vim har ett bang (`!`) kommando som kan göra tre saker:

1. Läsa STDOUT från ett externt kommando in i den aktuella bufferten.
2. Skriva innehållet i din buffer som STDIN till ett externt kommando.
3. Utföra ett externt kommando inifrån Vim.

Låt oss gå igenom var och en av dem.

## Läsa STDOUT från ett kommando in i Vim

Syntaxen för att läsa STDOUT från ett externt kommando in i den aktuella bufferten är:

```shell
:r !cmd
```

`:r` är Vims läskommandon. Om du använder det utan `!`, kan du använda det för att hämta innehållet i en fil. Om du har en fil `file1.txt` i den aktuella katalogen och du kör:

```shell
:r file1.txt
```

Vim kommer att sätta innehållet i `file1.txt` i den aktuella bufferten.

Om du kör `:r` kommandot följt av ett `!` och ett externt kommando, kommer utdata från det kommandot att infogas i den aktuella bufferten. För att få resultatet av `ls` kommandot, kör:

```shell
:r !ls
```

Det returnerar något som:

```shell
file1.txt
file2.txt
file3.txt
```

Du kan läsa data från `curl` kommandot:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

`r` kommandot accepterar också en adress:

```shell
:10r !cat file1.txt
```

Nu kommer STDOUT från att köra `cat file1.txt` att infogas efter rad 10.

## Skriva buffertinnehållet till ett externt kommando

Kommandot `:w`, förutom att spara en fil, kan användas för att skicka texten i den aktuella bufferten som STDIN för ett externt kommando. Syntaxen är:

```shell
:w !cmd
```

Om du har dessa uttryck:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Se till att du har [node](https://nodejs.org/en/) installerat på din maskin, kör sedan:

```shell
:w !node
```

Vim kommer att använda `node` för att köra JavaScript-uttrycken för att skriva ut "Hello Vim" och "Vim is awesome".

När du använder `:w` kommandot, använder Vim all text i den aktuella bufferten, liknande det globala kommandot (de flesta kommandoradskommandon, om du inte anger ett intervall, utför bara kommandot mot den aktuella raden). Om du anger `:w` ett specifikt adress:

```shell
:2w !node
```

Vim använder endast texten från den andra raden i `node` tolken.

Det finns en subtil men betydande skillnad mellan `:w !node` och `:w! node`. Med `:w !node` "skriver" du texten i den aktuella bufferten till det externa kommandot `node`. Med `:w! node` tvingar du att spara en fil och namnger filen "node".

## Utföra ett externt kommando

Du kan utföra ett externt kommando inifrån Vim med bang-kommandot. Syntaxen är:

```shell
:!cmd
```

För att se innehållet i den aktuella katalogen i långt format, kör:

```shell
:!ls -ls
```

För att döda en process som körs på PID 3456, kan du köra:

```shell
:!kill -9 3456
```

Du kan köra vilket externt kommando som helst utan att lämna Vim så att du kan hålla fokus på din uppgift.

## Filtrera texter

Om du ger `!` ett intervall, kan det användas för att filtrera texter. Anta att du har följande texter:

```shell
hello vim
hello vim
```

Låt oss göra den aktuella raden till versaler med `tr` (översätta) kommandot. Kör:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Resultatet:

```shell
HELLO VIM
hello vim
```

Genomgången:
- `.!` utför filterkommandot på den aktuella raden.
- `tr '[:lower:]' '[:upper:]'` anropar `tr` kommandot för att ersätta alla små bokstäver med versaler.

Det är viktigt att ange ett intervall för att köra det externa kommandot som ett filter. Om du försöker köra kommandot ovan utan `.` (`:!tr '[:lower:]' '[:upper:]'`), kommer du att se ett fel.

Låt oss anta att du behöver ta bort den andra kolumnen på båda raderna med `awk` kommandot:

```shell
:%!awk "{print $1}"
```

Resultatet:

```shell
hello
hello
```

Genomgången:
- `:%!` utför filterkommandot på alla rader (`%`).
- `awk "{print $1}"` skriver endast ut den första kolumnen av matchningen.

Du kan kedja flera kommandon med kedjeoperatören (`|`) precis som i terminalen. Låt oss säga att du har en fil med dessa läckra frukostartiklar:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Om du behöver sortera dem baserat på pris och visa endast menyn med jämna mellanrum, kan du köra:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Resultatet:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

Genomgången:
- `:%!` tillämpar filtret på alla rader (`%`).
- `awk 'NR > 1'` visar texterna endast från rad nummer två och framåt.
- `|` kedjar nästa kommando.
- `sort -nk 3` sorterar numeriskt (`n`) med värdena från kolumn 3 (`k 3`).
- `column -t` organiserar texten med jämna mellanrum.

## Normal läge kommando

Vim har en filteroperator (`!`) i normalt läge. Om du har följande hälsningar:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

För att göra den aktuella raden och raden nedanför till versaler, kan du köra:
```shell
!jtr '[a-z]' '[A-Z]'
```

Genomgången:
- `!j` kör den normala kommandofilteroperatören (`!`) som riktar sig mot den aktuella raden och raden nedanför. Kom ihåg att eftersom det är en normal lägeoperator, tillämpas grammatikregeln `verb + noun`. `!` är verbet och `j` är substantivet.
- `tr '[a-z]' '[A-Z]'` ersätter de små bokstäverna med versaler.

Filterkommandot i normalt läge fungerar endast på rörelser / textobjekt som är minst en rad eller längre. Om du hade försökt köra `!iwtr '[a-z]' '[A-Z]'` (utföra `tr` på inre ord), kommer du att upptäcka att det tillämpar `tr` kommandot på hela raden, inte ordet din markör är på.

## Lär dig externa kommandon på det smarta sättet

Vim är inte en IDE. Det är en lättvikts modalredigerare som är mycket utbyggbar av design. På grund av denna utbyggbarhet har du enkel tillgång till alla externa kommandon i ditt system. Beväpnad med dessa externa kommandon är Vim ett steg närmare att bli en IDE. Någon sa att Unix-systemet är den första IDE:n någonsin.

Bang-kommandot är lika användbart som hur många externa kommandon du känner till. Oroa dig inte om din kunskap om externa kommandon är begränsad. Jag har fortfarande mycket att lära mig också. Ta detta som en motivation för kontinuerligt lärande. När du behöver modifiera en text, se om det finns ett externt kommando som kan lösa ditt problem. Oroa dig inte för att bemästra allt, lär dig bara de som du behöver för att slutföra den aktuella uppgiften.