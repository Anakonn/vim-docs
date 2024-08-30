---
description: Denna guide lär dig hur du använder Vim:s globala kommando för att köra
  kommandon på flera rader samtidigt, inklusive syntax och exempel.
title: Ch13. the Global Command
---

Så långt har du lärt dig hur man upprepar den senaste ändringen med punktkommandot (`.`), att återspela åtgärder med makron (`q`), och att lagra texter i registren (`"`).

I detta kapitel kommer du att lära dig hur man upprepar ett kommandoradskommando med det globala kommandot.

## Översikt av det Globala Kommandot

Vims globala kommando används för att köra ett kommandoradskommando på flera rader samtidigt.

Förresten, du kanske har hört termen "Ex Commands" tidigare. I den här guiden refererar jag till dem som kommandoradskommandon. Både Ex-kommandon och kommandoradskommandon är desamma. De är kommandon som börjar med ett kolon (`:`). Ersättningskommandot i det senaste kapitlet var ett exempel på ett Ex-kommando. De kallas Ex eftersom de ursprungligen kom från Ex-textredigeraren. Jag kommer att fortsätta referera till dem som kommandoradskommandon i denna guide. För en fullständig lista över Ex-kommandon, kolla in `:h ex-cmd-index`.

Det globala kommandot har följande syntax:

```shell
:g/pattern/command
```

`pattern` matchar alla rader som innehåller det mönstret, liknande mönstret i ersättningskommandot. `command` kan vara vilket kommandoradskommando som helst. Det globala kommandot fungerar genom att köra `command` mot varje rad som matchar `pattern`.

Om du har följande uttryck:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

För att ta bort alla rader som innehåller "console", kan du köra:

```shell
:g/console/d
```

Resultat:

```shell
const one = 1;

const two = 2;

const three = 3;
```

Det globala kommandot kör raderingskommandot (`d`) på alla rader som matchar "console"-mönstret.

När du kör `g`-kommandot, gör Vim två genomsökningar över filen. Vid första körningen genomsöker den varje rad och markerar raden som matchar `/console/`-mönstret. När alla matchande rader är markerade, går den för andra gången och kör `d`-kommandot på de markerade raderna.

Om du vill ta bort alla rader som innehåller "const" istället, kör:

```shell
:g/const/d
```

Resultat:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Invers Matchning

För att köra det globala kommandot på icke-matchande rader, kan du köra:

```shell
:g!/pattern/command
```

eller

```shell
:v/pattern/command
```

Om du kör `:v/console/d`, kommer det att ta bort alla rader *inte* innehållande "console".

## Mönster

Det globala kommandot använder samma mönstersystem som ersättningskommandot, så denna sektion kommer att fungera som en uppfriskning. Känn dig fri att hoppa till nästa avsnitt eller läsa vidare!

Om du har dessa uttryck:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

För att ta bort raderna som innehåller antingen "one" eller "two", kör:

```shell
:g/one\|two/d
```

För att ta bort raderna som innehåller några enskilda siffror, kör antingen:

```shell
:g/[0-9]/d
```

eller

```shell
:g/\d/d
```

Om du har uttrycket:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

För att matcha raderna som innehåller mellan tre till sex nollor, kör:

```shell
:g/0\{3,6\}/d
```

## Passera ett Område

Du kan passera ett område före `g`-kommandot. Här är några sätt du kan göra det på:
- `:1,5g/console/d` matchar strängen "console" mellan raderna 1 och 5 och tar bort dem.
- `:,5g/console/d` om det inte finns någon adress före kommat, börjar det från den aktuella raden. Det letar efter strängen "console" mellan den aktuella raden och rad 5 och tar bort dem.
- `:3,g/console/d` om det inte finns någon adress efter kommat, slutar det vid den aktuella raden. Det letar efter strängen "console" mellan rad 3 och den aktuella raden och tar bort dem.
- `:3g/console/d` om du bara anger en adress utan komma, körs kommandot endast på rad 3. Det letar på rad 3 och tar bort den om den har strängen "console".

Förutom siffror kan du också använda dessa symboler som område:
- `.` betyder den aktuella raden. Ett område av `.,3` betyder mellan den aktuella raden och rad 3.
- `$` betyder den sista raden i filen. `3,$` område betyder mellan rad 3 och den sista raden.
- `+n` betyder n rader efter den aktuella raden. Du kan använda det med `.` eller utan. `3,+1` eller `3,.+1` betyder mellan rad 3 och raden efter den aktuella raden.

Om du inte ger något område, påverkar det som standard hela filen. Detta är faktiskt inte normen. De flesta av Vims kommandoradskommandon körs endast på den aktuella raden om du inte anger något område. De två anmärkningsvärda undantagen är det globala (`:g`) och spara (`:w`) kommandona.

## Normalt Kommando

Du kan köra ett normalt kommando med det globala kommandot med `:normal` kommandoradskommando.

Om du har denna text:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

För att lägga till ett ";" i slutet av varje rad, kör:

```shell
:g/./normal A;
```

Låt oss bryta ner det:
- `:g` är det globala kommandot.
- `/./` är ett mönster för "icke-tomma rader". Det matchar raderna med minst ett tecken, så det matchar raderna med "const" och "console" och det matchar inte tomma rader.
- `normal A;` kör `:normal` kommandoradskommando. `A;` är kommandot i normalt läge för att infoga ett ";" i slutet av raden.

## Utföra ett Makro

Du kan också utföra ett makro med det globala kommandot. Ett makro kan utföras med `normal` kommandot. Om du har uttrycken:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Observera att raderna med "const" inte har semikolon. Låt oss skapa ett makro för att lägga till ett semikolon i slutet av dessa rader i register a:

```shell
qaA;<Esc>q
```

Om du behöver en uppfriskning, kolla in kapitlet om makron. Kör nu:

```shell
:g/const/normal @a
```

Nu kommer alla rader med "const" att ha ett ";" i slutet.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Om du följde detta steg för steg, kommer du att ha två semikolon på den första raden. För att undvika det, kör det globala kommandot från rad två och framåt, `:2,$g/const/normal @a`.

## Rekursivt Globalt Kommando

Det globala kommandot i sig är en typ av kommandoradskommando, så du kan tekniskt sett köra det globala kommandot inuti ett globalt kommando.

Givet följande uttryck, om du vill ta bort det andra `console.log`-uttalandet:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Om du kör:

```shell
:g/console/g/two/d
```

Först kommer `g` att leta efter rader som innehåller mönstret "console" och hitta 3 träffar. Sedan kommer det andra `g` att leta efter raden som innehåller mönstret "two" bland de tre träffarna. Slutligen kommer det att ta bort den träffen.

Du kan också kombinera `g` med `v` för att hitta positiva och negativa mönster. Till exempel:

```shell
:g/console/v/two/d
```

Istället för att leta efter raden som innehåller mönstret "two", kommer det att leta efter raderna *inte* innehållande mönstret "two".

## Ändra Avgränsaren

Du kan ändra det globala kommandots avgränsare som ersättningskommandot. Reglerna är desamma: du kan använda vilket enskilt byte-tecken som helst förutom alfabet, siffror, `"`, `|`, och `\`.

För att ta bort raderna som innehåller "console":

```shell
:g@console@d
```

Om du använder ersättningskommandot med det globala kommandot, kan du ha två olika avgränsare:

```shell
g@one@s+const+let+g
```

Här kommer det globala kommandot att leta efter alla rader som innehåller "one". Ersättningskommandot kommer att ersätta, från dessa träffar, strängen "const" med "let".

## Standardkommandot

Vad händer om du inte specificerar något kommandoradskommando i det globala kommandot?

Det globala kommandot kommer att använda utskriftskommandot (`:p`) för att skriva ut texten på den aktuella raden. Om du kör:

```shell
:g/console
```

Kommer det att skriva ut längst ner på skärmen alla rader som innehåller "console".

Förresten, här är en intressant fakta. Eftersom det standardkommando som används av det globala kommandot är `p`, gör detta att `g`-syntaxen blir:

```shell
:g/re/p
```

- `g` = det globala kommandot
- `re` = regex-mönstret
- `p` = utskriftskommandot

Det stavas *"grep"*, samma `grep` från kommandoraden. Detta är **inte** en tillfällighet. Kommandot `g/re/p` kom ursprungligen från Ed Editor, en av de ursprungliga linjetextredigerarna. Kommandot `grep` fick sitt namn från Ed.

Din dator har förmodligen fortfarande Ed-redigeraren. Kör `ed` från terminalen (tips: för att avsluta, skriv `q`).

## Omvända Hela Bufferten

För att omvända hela filen, kör:

```shell
:g/^/m 0
```

`^` är ett mönster för början av en rad. Använd `^` för att matcha alla rader, inklusive tomma rader.

Om du behöver omvända endast några rader, passera ett område. För att omvända raderna mellan rad fem till rad tio, kör:

```shell
:5,10g/^/m 0
```

För att lära dig mer om flyttkommandot, kolla in `:h :move`.

## Aggregating All Todos

När jag kodar, skriver jag ibland TODOs i filen jag redigerar:

```shell
const one = 1;
console.log("one: ", one);
// TODO: mata valpen

const two = 2;
// TODO: mata valpen automatiskt
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: skapa en startup som säljer en automatisk valpmatare
```

Det kan vara svårt att hålla reda på alla skapade TODOs. Vim har en `:t` (kopiera) metod för att kopiera alla träffar till en adress. För att lära dig mer om kopieringsmetoden, kolla in `:h :copy`.

För att kopiera alla TODOs till slutet av filen för enklare inspektion, kör:

```shell
:g/TODO/t $
```

Resultat:

```shell
const one = 1;
console.log("one: ", one);
// TODO: mata valpen

const two = 2;
// TODO: mata valpen automatiskt
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: skapa en startup som säljer en automatisk valpmatare

// TODO: mata valpen
// TODO: mata valpen automatiskt
// TODO: skapa en startup som säljer en automatisk valpmatare
```

Nu kan jag granska alla TODOs jag skapade, hitta tid att göra dem eller delegera dem till någon annan, och fortsätta arbeta med min nästa uppgift.

Om du istället för att kopiera dem vill flytta alla TODOs till slutet, använd flyttkommandot, `:m`:

```shell
:g/TODO/m $
```

Resultat:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: mata valpen
// TODO: mata valpen automatiskt
// TODO: skapa en startup som säljer en automatisk valpmatare
```

## Black Hole Delete

Kom ihåg från kapitlet om register att raderade texter lagras i de numrerade registren (förutsatt att de är tillräckligt stora). När du kör `:g/console/d`, lagrar Vim de rader som tas bort i de numrerade registren. Om du tar bort många rader kan du snabbt fylla alla numrerade register. För att undvika detta kan du alltid använda black hole-registret (`"_`) för att *inte* lagra dina raderade rader i registren. Kör:

```shell
:g/console/d_
```

Genom att passera `_` efter `d`, kommer Vim inte att använda upp dina scratch-register.
## Minska flera tomma rader till en tom rad

Om du har en text med flera tomma rader:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Du kan snabbt minska de tomma raderna till en tom rad med:

```shell
:g/^$/,/./-1j
```

Resultat:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normalt accepterar det globala kommandot följande form: `:g/pattern/command`. Du kan dock också köra det globala kommandot med följande form: `:g/pattern1/,/pattern2/command`. Med detta kommer Vim att tillämpa `command` inom `pattern1` och `pattern2`.

Med det i åtanke, låt oss bryta ner kommandot `:g/^$/,/./-1j` enligt `:g/pattern1/,/pattern2/command`:
- `/pattern1/` är `/^$/`. Det representerar en tom rad (en rad med noll tecken).
- `/pattern2/` är `/./` med `-1` radmodifierare. `/./` representerar en icke-tom rad (en rad med minst ett tecken). `-1` betyder raden ovanför.
- `command` är `j`, join-kommandot (`:j`). I detta sammanhang går detta globala kommando ihop alla givna rader.

Förresten, om du vill minska flera tomma rader till inga rader, kör detta istället:

```shell
:g/^$/,/./j
```

Ett enklare alternativ:

```shell
:g/^$/-j
```

Din text är nu reducerad till:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Avancerad sortering

Vim har ett `:sort`-kommando för att sortera rader inom ett intervall. Till exempel:

```shell
d
b
a
e
c
```

Du kan sortera dem genom att köra `:sort`. Om du ger det ett intervall, kommer det bara att sortera raderna inom det intervallet. Till exempel, `:3,5sort` sorterar bara rader tre och fem.

Om du har följande uttryck:

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

Om du behöver sortera elementen inuti arrayerna, men inte arrayerna själva, kan du köra detta:

```shell
:g/\[/+1,/\]/-1sort
```

Resultat:

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

Detta är bra! Men kommandot ser komplicerat ut. Låt oss bryta ner det. Detta kommando följer också formen `:g/pattern1/,/pattern2/command`.

- `:g` är det globala kommandots mönster.
- `/\[/+1` är det första mönstret. Det matchar en bokstavlig vänster hakparentes "[". `+1` hänvisar till raden under den.
- `/\]/-1` är det andra mönstret. Det matchar en bokstavlig höger hakparentes "]". `-1` hänvisar till raden ovanför den.
- `/\[/+1,/\]/-1` hänvisar då till alla rader mellan "[" och "]".
- `sort` är ett kommandorads kommando för att sortera.

## Lär dig det globala kommandot på ett smart sätt

Det globala kommandot utför kommandorads kommandot mot alla matchande rader. Med det behöver du bara köra ett kommando en gång och Vim kommer att göra resten för dig. För att bli skicklig på det globala kommandot krävs två saker: ett bra ordförråd av kommandorads kommandon och kunskap om reguljära uttryck. Ju mer tid du spenderar på att använda Vim, desto mer kommer du naturligt att lära dig om kommandorads kommandon. Kunskap om reguljära uttryck kommer att kräva en mer aktiv inställning. Men så snart du blir bekväm med reguljära uttryck, kommer du att ligga före många.

Några av exemplen här är komplicerade. Låt dig inte avskräckas. Ta verkligen din tid att förstå dem. Lär dig att läsa mönstren. Ge inte upp.

När du behöver köra flera kommandon, pausa och se om du kan använda `g`-kommandot. Identifiera det bästa kommandot för jobbet och skriv ett mönster för att rikta in så många saker som möjligt på en gång.

Nu när du vet hur kraftfullt det globala kommandot är, låt oss lära oss hur man använder externa kommandon för att öka ditt verktygsförråd.