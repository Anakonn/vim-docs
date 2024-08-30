---
description: Lär dig om Vim-register och deras användning för att effektivisera ditt
  arbete. Upptäck de tio registertyperna och hur de kan spara tid vid redigering.
title: Ch08. Registers
---

Att lära sig Vim-register är som att lära sig algebra för första gången. Du trodde inte att du behövde det förrän du behövde det.

Du har förmodligen använt Vim-register när du kopierade eller raderade en text och sedan klistrade in den med `p` eller `P`. Men visste du att Vim har 10 olika typer av register? Använda på rätt sätt kan Vim-register rädda dig från repetitivt skrivande.

I detta kapitel kommer jag att gå igenom alla Vim-registertyper och hur man använder dem effektivt.

## De Tio Registertyperna

Här är de 10 Vim-registertyperna:

1. Det namnlösa registret (`""`).
2. De numrerade registren (`"0-9`).
3. Det lilla raderingsregistret (`"-`).
4. De namngivna registren (`"a-z`).
5. De skrivskyddade registren (`":`, `".`, och `"%`).
6. Det alternativa filregistret (`"#`).
7. Uttrycksregistret (`"=`).
8. Urvalregistren (`"*` och `"+`).
9. Svart hål-register (`"_`).
10. Det sista sökmönsterregistret (`"/`).

## Registeroperatörer

För att använda register måste du först lagra dem med operatörer. Här är några operatörer som lagrar värden i register:

```shell
y    Yank (kopiera)
c    Radera text och starta insättningsläge
d    Radera text
```

Det finns fler operatörer (som `s` eller `x`), men ovanstående är de användbara. Tumregeln är att om en operatör kan ta bort en text, lagrar den förmodligen texten i register.

För att klistra in en text från register kan du använda:

```shell
p    Klistra in texten efter markören
P    Klistra in texten före markören
```

Både `p` och `P` accepterar ett antal och ett registersymbol som argument. Till exempel, för att klistra in tio gånger, gör `10p`. För att klistra in texten från register a, gör `"ap`. För att klistra in texten från register a tio gånger, gör `10"ap`. Förresten, `p` står faktiskt tekniskt sett för "put", inte "paste", men jag tycker att "paste" är ett mer konventionellt ord.

Den allmänna syntaxen för att hämta innehållet från ett specifikt register är `"a`, där `a` är registersymbolen.

## Anropa Register Från Insättningsläge

Allt du lär dig i detta kapitel kan också utföras i insättningsläge. För att få texten från register a gör du normalt `"ap`. Men om du är i insättningsläge, kör `Ctrl-R a`. Syntaxen för att anropa register från insättningsläge är:

```shell
Ctrl-R a
```

Där `a` är registersymbolen. Nu när du vet hur man lagrar och hämtar register, låt oss dyka in!

## Det Namnlösa Registret

För att få texten från det namnlösa registret, gör `""p`. Det lagrar den senaste text du kopierade, ändrade eller raderade. Om du gör en annan kopiering, ändring eller radering, kommer Vim automatiskt att ersätta den gamla texten. Det namnlösa registret är som en dators standardkopiera / klistra in-operation.

Som standard är `p` (eller `P`) kopplad till det namnlösa registret (från och med nu kommer jag att referera till det namnlösa registret med `p` istället för `""p`).

## De Numrerade Registren

Numrerade register fylls automatiskt i stigande ordning. Det finns 2 olika numrerade register: det kopierade registret (`0`) och de numrerade registren (`1-9`). Låt oss diskutera det kopierade registret först.

### Det Kopierade Registret

Om du kopierar en hel rad text (`yy`), sparar Vim faktiskt den texten i två register:

1. Det namnlösa registret (`p`).
2. Det kopierade registret (`"0p`).

När du kopierar en annan text, kommer Vim att uppdatera både det kopierade registret och det namnlösa registret. Eventuella andra operationer (som radering) kommer inte att lagras i register 0. Detta kan användas till din fördel, eftersom om du inte gör en annan kopiering, kommer den kopierade texten alltid att finnas där, oavsett hur många ändringar och raderingar du gör.

Till exempel, om du:
1. Kopierar en rad (`yy`)
2. Raderar en rad (`dd`)
3. Raderar en annan rad (`dd`)

Det kopierade registret kommer att ha texten från steg ett.

Om du:
1. Kopierar en rad (`yy`)
2. Raderar en rad (`dd`)
3. Kopierar en annan rad (`yy`)

Det kopierade registret kommer att ha texten från steg tre.

Ett sista tips, medan du är i insättningsläge kan du snabbt klistra in den text du just kopierade med `Ctrl-R 0`.

### De Icke-noll Numrerade Registren

När du ändrar eller raderar en text som är minst en rad lång, kommer den texten att lagras i de numrerade registren 1-9 sorterade efter den senaste.

Till exempel, om du har dessa rader:

```shell
rad tre
rad två
rad ett
```

Med markören på "rad tre", radera dem en efter en med `dd`. När alla rader är raderade, bör register 1 innehålla "rad ett" (senaste), register två "rad två" (näst senaste), och register tre "rad tre" (äldsta). För att få innehållet från register ett, gör `"1p`.

Som en sidoanteckning, dessa numrerade register ökas automatiskt när du använder punktkommandot. Om ditt numrerade register ett (`"1`) innehåller "rad ett", register två (`"2`) "rad två", och register tre (`"3`) "rad tre", kan du klistra in dem sekventiellt med detta trick:
- Gör `"1P` för att klistra in innehållet från det numrerade registret ett ("1).
- Gör `.` för att klistra in innehållet från det numrerade registret två ("2).
- Gör `.` för att klistra in innehållet från det numrerade registret tre ("3).

Detta trick fungerar med vilket numrerat register som helst. Om du började med `"5P`,  `.`  skulle göra `"6P`, `.` igen skulle göra `"7P`, och så vidare.

Små raderingar som en ord-radering (`dw`) eller ord-ändring (`cw`) lagras inte i de numrerade registren. De lagras i det lilla raderingsregistret (`"-`), vilket jag kommer att diskutera härnäst.

## Det Lilla Raderingsregistret

Ändringar eller raderingar som är mindre än en rad lagras inte i de numrerade registren 0-9, utan i det lilla raderingsregistret (`"-`).

Till exempel:
1. Radera ett ord (`diw`)
2. Radera en rad (`dd`)
3. Radera en rad (`dd`)

`"-p` ger dig det raderade ordet från steg ett.

Ett annat exempel:
1. Jag raderar ett ord (`diw`)
2. Jag raderar en rad (`dd`)
3. Jag raderar ett ord (`diw`)

`"-p` ger dig det raderade ordet från steg tre. `"1p` ger dig den raderade raden från steg två. Tyvärr finns det inget sätt att hämta det raderade ordet från steg ett eftersom det lilla raderingsregistret bara lagrar ett objekt. Men om du vill bevara texten från steg ett kan du göra det med de namngivna registren.

## Det Namngivna Registret

De namngivna registren är Vims mest mångsidiga register. Det kan lagra kopierade, ändrade och raderade texter i registren a-z. Till skillnad från de tidigare 3 registertyperna du har sett som automatiskt lagrar texter i register, måste du uttryckligen tala om för Vim att använda det namngivna registret, vilket ger dig full kontroll.

För att kopiera ett ord till register a, kan du göra det med `"ayiw`.
- `"a` talar om för Vim att nästa åtgärd (radera / ändra / kopiera) kommer att lagras i register a.
- `yiw` kopierar ordet.

För att få texten från register a, kör `"ap`. Du kan använda alla tjugosex alfabetiska tecken för att lagra tjugosex olika texter med namngivna register.

Ibland kanske du vill lägga till i ditt befintliga namngivna register. I så fall kan du lägga till din text istället för att börja om. För att göra det kan du använda den stora versionen av det registret. Till exempel, anta att du har ordet "Hello " redan lagrat i register a. Om du vill lägga till "world" i register a, kan du hitta texten "world" och kopiera den med A-registret (`"Ayiw`).

## De Skrivskyddade Registren

Vim har tre skrivskyddade register: `.`, `:`, och `%`. De är ganska enkla att använda:

```shell
.    Lagrar den senaste insatta texten
:    Lagrar den senaste utförda kommandoraden
%    Lagrar namnet på den aktuella filen
```

Om den senaste text du skrev var "Hello Vim", kommer körning av `".p` att skriva ut texten "Hello Vim". Om du vill få namnet på den aktuella filen, kör `"%p`. Om du kör `:s/foo/bar/g` kommandot, kommer körning av `":p` att skriva ut den bokstavliga texten "s/foo/bar/g".

## Det Alternativa Filregistret

I Vim representerar `#` vanligtvis den alternativa filen. En alternativ fil är den senaste filen du öppnade. För att infoga namnet på den alternativa filen kan du använda `"#p`.

## Uttrycksregistret

Vim har ett uttrycksregister, `"=`, för att utvärdera uttryck.

För att utvärdera matematiska uttryck `1 + 1`, kör:

```shell
"=1+1<Enter>p
```

Här talar du om för Vim att du använder uttrycksregistret med `"=`. Ditt uttryck är (`1 + 1`). Du behöver skriva `p` för att få resultatet. Som nämnts tidigare kan du också komma åt registret från insättningsläge. För att utvärdera matematiska uttryck från insättningsläge kan du göra:

```shell
Ctrl-R =1+1
```

Du kan också få värden från vilket register som helst via uttrycksregistret när det är kopplat med `@`. Om du vill få texten från register a:

```shell
"=@a
```

Tryck sedan `<Enter>`, sedan `p`. På liknande sätt, för att få värden från register a medan du är i insättningsläge:

```shell
Ctrl-r =@a
```

Uttryck är ett stort ämne i Vim, så jag kommer bara att täcka grunderna här. Jag kommer att ta upp uttryck mer i detalj i senare Vimscript-kapitel.

## Urvalregistren

Önskar du ibland att du kunde kopiera en text från externa program och klistra in den lokalt i Vim, och vice versa? Med Vims urvalregister kan du. Vim har två urvalregister: `quotestar` (`"*`) och `quoteplus` (`"+`). Du kan använda dem för att komma åt kopierad text från externa program.

Om du är i ett externt program (som Chrome-webbläsaren) och kopierar en textblock med `Ctrl-C` (eller `Cmd-C`, beroende på ditt operativsystem), skulle du normalt inte kunna använda `p` för att klistra in texten i Vim. Men både Vims `"+` och `"*` är kopplade till ditt urklipp, så du kan faktiskt klistra in texten med `"+p` eller `"*p`. Omvänt, om du kopierar ett ord från Vim med `"+yiw` eller `"*yiw`, kan du klistra in den texten i det externa programmet med `Ctrl-V` (eller `Cmd-V`). Observera att detta bara fungerar om ditt Vim-program har `+clipboard` alternativet (för att kontrollera det, kör `:version`).

Du kanske undrar om `"*` och `"+` gör samma sak, varför har Vim två olika register? Vissa maskiner använder X11-fönstersystemet. Detta system har 3 typer av urval: primärt, sekundärt och urklipp. Om din maskin använder X11, använder Vim X11:s *primära* urval med `quotestar` (`"*`) registret och X11:s *urklipp* urval med `quoteplus` (`"+`) registret. Detta gäller endast om du har `+xterm_clipboard` alternativet tillgängligt i din Vim-version. Om din Vim inte har `xterm_clipboard`, är det inte en stor sak. Det betyder bara att både `quotestar` och `quoteplus` är utbytbara (min har inte heller det).

Jag tycker att göra `=*p` eller `=+p` (eller `"*p` eller `"+p`) är besvärligt. För att få Vim att klistra in kopierad text från det externa programmet med bara `p`, kan du lägga till detta i din vimrc:

```shell
set clipboard=unnamed
```

Nu när jag kopierar en text från ett externt program kan jag klistra in den med det namnlösa registret, `p`. Jag kan också kopiera en text från Vim och klistra in den i ett externt program. Om du har `+xterm_clipboard` aktiverat, kanske du vill använda både `unnamed` och `unnamedplus` urklippsalternativ.

## Svart Hål-Register

Varje gång du raderar eller ändrar en text, lagras den texten automatiskt i Vim-registret. Det kommer att finnas tillfällen när du inte vill spara något i registret. Hur kan du göra det?

Du kan använda det svarta hål-registret (`"_`). För att radera en rad och inte låta Vim lagra den raderade raden i något register, använd `"_dd`.

Det svarta hål-registret är som `/dev/null` för register.

## Det Sista Sökmönsterregistret

För att klistra in din senaste sökning (`/` eller `?`), kan du använda det sista sökmönsterregistret (`"/`). För att klistra in den senaste sökterm, använd `"/p`.

## Visa Registren

För att visa alla dina register, använd kommandot `:register`. För att visa endast registren "a, "1, och "-, använd `:register a 1 -`.

Det finns ett plugin som heter [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) som låter dig kika in i innehållet i registren när du trycker på `"` eller `@` i normal läge och `Ctrl-R` i insättningsläge. Jag tycker att detta plugin är mycket användbart eftersom jag oftast inte kan komma ihåg innehållet i mina register. Ge det en chans!

## Utföra ett Register

De namngivna registren är inte bara för att lagra texter. De kan också utföra makron med `@`. Jag kommer att gå igenom makron i nästa kapitel.

Tänk på att eftersom makron lagras i Vim-register, kan du av misstag skriva över den lagrade texten med makron. Om du lagrar texten "Hello Vim" i register a och senare spelar in ett makro i samma register (`qa{macro-sequence}q`), kommer det makrot att skriva över din "Hello Vim"-text som lagrades tidigare.
## Rensa ett register

Tekniskt sett finns det inget behov av att rensa något register eftersom den nästa texten som du lagrar under samma registernamn kommer att skriva över det. Men du kan snabbt rensa ett namngivet register genom att spela in en tom makro. Till exempel, om du kör `qaq`, kommer Vim att spela in en tom makro i register a.

Ett annat alternativ är att köra kommandot `:call setreg('a', 'hello register a')` där a är register a och "hello register a" är texten som du vill lagra.

Ett sätt till att rensa register är att ställa in innehållet i "a register till en tom sträng med uttrycket `:let @a = ''`.

## Sätta innehållet i ett register

Du kan använda kommandot `:put` för att klistra in innehållet i något register. Till exempel, om du kör `:put a`, kommer Vim att skriva ut innehållet i register a under den aktuella raden. Detta fungerar mycket som `"ap`, med skillnaden att kommandot i normalt läge `p` skriver ut registerinnehållet efter markören och kommandot `:put` skriver ut registerinnehållet på en ny rad.

Eftersom `:put` är ett kommandorads kommando kan du skicka det en adress. `:10put a` kommer att klistra in text från register a under rad 10.

Ett cool trick är att använda `:put` med svarta hålet register (`"_`). Eftersom det svarta hålet register inte lagrar någon text, kommer `:put _` att infoga en tom rad istället. Du kan kombinera detta med det globala kommandot för att infoga flera tomma rader. Till exempel, för att infoga tomma rader under alla rader som innehåller texten "end", kör `:g/end/put _`. Du kommer att lära dig om det globala kommandot senare.

## Lära sig register på det smarta sättet

Du har kommit till slutet. Grattis! Om du känner dig överväldigad av den stora mängden information, är du inte ensam. När jag först började lära mig om Vim-register, fanns det alldeles för mycket information att ta in på en gång.

Jag tror inte att du ska memorera alla register omedelbart. För att bli produktiv kan du börja med att använda endast dessa 3 register:
1. Det namnlösa registret (`""`).
2. De namngivna registren (`"a-z`).
3. De numrerade registren (`"0-9`).

Eftersom det namnlösa registret som standard är `p` och `P`, behöver du bara lära dig två register: de namngivna registren och de numrerade registren. Lär dig gradvis fler register när du behöver dem. Ta din tid.

Den genomsnittliga människan har en begränsad korttidsminneskapacitet, cirka 5 - 7 objekt åt gången. Det är därför jag i min vardagliga redigering endast använder cirka 5 - 7 namngivna register. Det finns inget sätt jag kan komma ihåg alla tjugosex i huvudet. Jag börjar normalt med register a, sedan b, i stigande alfabetisk ordning. Prova det och experimentera för att se vilken teknik som fungerar bäst för dig.

Vim-register är kraftfulla. Använda strategiskt kan det rädda dig från att skriva oändliga upprepande texter. Nästa, låt oss lära oss om makron.