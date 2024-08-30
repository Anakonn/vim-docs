---
description: Lär dig använda Vim-makron för att automatisera repetitiva uppgifter
  och effektivisera din redigering av filer på ett imponerande sätt.
title: Ch09. Macros
---

När du redigerar filer kan du upptäcka att du upprepar samma åtgärder. Skulle det inte vara trevligt om du kunde göra dessa åtgärder en gång och spela upp dem när du behöver? Med Vim-makron kan du spela in åtgärder och lagra dem i Vim-register för att köras när du behöver dem.

I det här kapitlet kommer du att lära dig hur du använder makron för att automatisera tråkiga uppgifter (plus att det ser coolt ut när din fil redigerar sig själv).

## Grundläggande Makron

Här är den grundläggande syntaxen för ett Vim-makro:

```shell
qa                     Börja spela in ett makro i register a
q (under inspelning)   Stoppa inspelningen av makrot
```

Du kan välja valfria små bokstäver (a-z) för att lagra makron. Här är hur du kan köra ett makro:

```shell
@a    Kör makrot från register a
@@    Kör det senast körda makrot
```

Anta att du har denna text och du vill göra allt på varje rad versaler:

```shell
hello
vim
macros
are
awesome
```

Med din markör i början av raden "hello", kör:

```shell
qa0gU$jq
```

Brytningen:
- `qa` börjar spela in ett makro i register a.
- `0` går till början av raden.
- `gU$` gör texten versal från din nuvarande position till slutet av raden.
- `j` går ner en rad.
- `q` stoppar inspelningen.

För att spela upp det, kör `@a`. Precis som många andra Vim-kommandon kan du skicka ett räkneargument till makron. Till exempel, att köra `3@a` kör makrot tre gånger.

## Säkerhetsvakt

Makrokörning avslutas automatiskt när det stöter på ett fel. Anta att du har denna text:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Om du vill göra det första ordet på varje rad till versaler, bör detta makro fungera:

```shell
qa0W~jq
```

Här är brytningen av kommandot ovan:
- `qa` börjar spela in ett makro i register a.
- `0` går till början av raden.
- `W` går till nästa ORD.
- `~` växlar fallet på tecknet under markören.
- `j` går ner en rad.
- `q` stoppar inspelningen.

Jag föredrar att överskatta min makrokörning än att underskatta den, så jag brukar kalla det nittionio gånger (`99@a`). Med detta kommando kör Vim faktiskt inte detta makro nittionio gånger. När Vim når den sista raden och kör `j`-rörelsen, hittar den ingen rad att gå ner till, kastar ett fel och stoppar makrokörningen.

Det faktum att makrokörningen stoppas vid första fel är en bra funktion, annars skulle Vim fortsätta att köra detta makro nittionio gånger även om det redan har nått slutet av raden.

## Kommandorads-Makro

Att köra `@a` i normalt läge är inte det enda sättet att köra makron i Vim. Du kan också köra `:normal @a` kommandoraden. `:normal` gör det möjligt för användaren att köra vilket normalt läge kommando som helst som skickas som argument. I det här fallet är det samma som att köra `@a` från normalt läge.

Kommandot `:normal` accepterar intervall som argument. Du kan använda detta för att köra makro i valda intervall. Om du vill köra ditt makro mellan raderna 2 och 3 kan du köra `:2,3 normal @a`.

## Köra ett Makro över Flera Filer

Anta att du har flera `.txt`-filer, var och en innehåller lite text. Din uppgift är att göra det första ordet på rader som innehåller ordet "donut" till versaler. Anta att du har `0W~j` i register a (samma makro som tidigare). Hur kan du snabbt åstadkomma detta?

Första filen:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

Andra filen:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

Tredje filen:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

Här är hur du kan göra det:
- `:args *.txt` för att hitta alla `.txt`-filer i din aktuella katalog.
- `:argdo g/donut/normal @a` kör det globala kommandot `g/donut/normal @a` på varje fil inuti `:args`.
- `:argdo update` kör kommandot `update` för att spara varje fil inuti `:args` när bufferten har ändrats.

Om du inte är bekant med det globala kommandot `:g/donut/normal @a`, kör det kommandot du ger (`normal @a`) på rader som matchar mönstret (`/donut/`). Jag kommer att gå igenom det globala kommandot i ett senare kapitel.

## Rekursivt Makro

Du kan rekursivt köra ett makro genom att kalla samma makroregister medan du spelar in det makrot. Anta att du har denna lista igen och du behöver växla fallet på det första ordet:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Denna gång, låt oss göra det rekursivt. Kör:

```shell
qaqqa0W~j@aq
```

Här är brytningen av stegen:
- `qaq` spelar in ett tomt makro a. Det är nödvändigt att börja med ett tomt register eftersom när du rekursivt kallar makrot, kommer det att köra vad som finns i det registret.
- `qa` börjar spela in i register a.
- `0` går till det första tecknet i den aktuella raden.
- `W` går till nästa ORD.
- `~` växlar fallet på tecknet under markören.
- `j` går ner en rad.
- `@a` kör makro a.
- `q` stoppar inspelningen.

Nu kan du bara köra `@a` och se Vim köra makrot rekursivt.

Hur visste makrot när det skulle stoppa? När makrot var på den sista raden försökte det köra `j`, och eftersom det inte fanns fler rader att gå ner till, stoppade det makrokörningen.

## Lägga till ett Makro

Om du behöver lägga till åtgärder till ett befintligt makro, istället för att återskapa makrot från grunden, kan du lägga till åtgärder till ett befintligt. I kapitlet om register lärde du dig att du kan lägga till en namngiven register genom att använda dess versal. Samma regel gäller. För att lägga till åtgärder till register a-makrot, använd register A.

Spela in ett makro i register a: `qa0W~q` (denna sekvens växlar fallet på nästa ORD i en rad). Om du vill lägga till en ny sekvens för att också lägga till en punkt i slutet av raden, kör:

```shell
qAA.<Esc>q
```

Brytningen:
- `qA` börjar spela in makrot i register A.
- `A.<Esc>` infogar i slutet av raden (här är `A` kommandot för insättningsläge, inte att förväxla med makro A) en punkt, och avslutar sedan insättningsläget.
- `q` stoppar inspelningen av makrot.

Nu när du kör `@a`, växlar det inte bara fallet på nästa ORD, det lägger också till en punkt i slutet av raden.

## Ändra ett Makro

Vad händer om du behöver lägga till nya åtgärder i mitten av ett makro?

Anta att du har ett makro som växlar det första faktiska ordet och lägger till en punkt i slutet av raden, `0W~A.<Esc>` i register a. Anta att mellan att göra det första ordet till versaler och lägga till en punkt i slutet av raden, behöver du lägga till ordet "deep fried" precis före ordet "donut" *(för det enda som är bättre än vanliga donuts är deep fried donuts)*.

Jag kommer att återanvända texten från tidigare avsnitt:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Först, låt oss kalla det befintliga makrot (anta att du har behållit makrot från föregående avsnitt i register a) med `:put a`:

```shell
0W~A.^[
```

Vad är detta `^[`? Gjorde du inte `0W~A.<Esc>`? Var är `<Esc>`? `^[` är Vims *interna kod* representation av `<Esc>`. Med vissa specialtangenter skriver Vim representationen av dessa tangenter i form av interna koder. Några vanliga tangenter som har interna kodrepresentationer är `<Esc>`, `<Backspace>` och `<Enter>`. Det finns fler specialtangenter, men de ligger inte inom ramen för detta kapitel.

Tillbaka till makrot, precis efter växlingsfallets operator (`~`), låt oss lägga till instruktionerna för att gå till slutet av raden (`$`), gå tillbaka ett ord (`b`), gå till insättningsläge (`i`), skriva "deep fried " (glöm inte mellanrummet efter "fried "), och avsluta insättningsläget (`<Esc>`).

Här är vad du kommer att få:

```shell
0W~$bideep fried <Esc>A.^[
```

Det finns ett litet problem. Vim förstår inte `<Esc>`. Du kan inte bokstavligen skriva `<Esc>`. Du måste skriva den interna kodrepresentationen för `<Esc>`-tangenten. Medan du är i insättningsläge trycker du `Ctrl-V` följt av `<Esc>`. Vim skriver `^[`. `Ctrl-V` är en insättningslägeoperator för att infoga nästa icke-siffriga tecken *bokstavligen*. Din makrokod bör se ut så här nu:

```shell
0W~$bideep fried ^[A.^[
```

För att lägga till den ändrade instruktionen i register a kan du göra det på samma sätt som att lägga till en ny post i en namngiven register. I början av raden, kör `"ay$` för att lagra den kopierade texten i register a.

Nu när du kör `@a`, kommer ditt makro att växla fallet på det första ordet, lägga till "deep fried " före "donut", och lägga till en "." i slutet av raden. Mums!

Ett alternativt sätt att ändra ett makro är att använda ett kommandoradsuttryck. Gör `:let @a="`, och gör sedan `Ctrl-R a`, detta kommer bokstavligen att klistra in innehållet i register a. Slutligen, glöm inte att stänga citattecknen (`"`). Du kan ha något som `:let @a="0W~$bideep fried ^[A.^["`.

## Makro Redundans

Du kan enkelt duplicera makron från ett register till ett annat. Till exempel, för att duplicera ett makro i register a till register z, kan du göra `:let @z = @a`. `@a` representerar innehållet i register a. Nu om du kör `@z`, gör det exakt samma åtgärder som `@a`.

Jag tycker att det är användbart att skapa en redundans på mina mest frekvent använda makron. I mitt arbetsflöde spelar jag vanligtvis in makron i de första sju alfabetiska bokstäverna (a-g) och jag ersätter dem ofta utan mycket eftertanke. Om jag flyttar de användbara makron mot slutet av alfabetet kan jag bevara dem utan att oroa mig för att jag av misstag kan ersätta dem.

## Serie vs Parallell Makro

Vim kan köra makron i serie och parallellt. Anta att du har denna text:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Om du vill spela in ett makro för att göra alla versaler "FUNC", bör detta makro fungera:

```shell
qa0f{gui{jq
```

Brytningen:
- `qa` börjar spela in i register a.
- `0` går till första raden.
- `f{` hittar den första instansen av "{".
- `gui{` gör texten inuti klamrarna till gemener (`gu`).
- `j` går ner en rad.
- `q` stoppar makroinspelningen.

Nu kan du köra `99@a` för att köra det på de återstående raderna. Men vad händer om du har detta importuttryck inuti din fil?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Att köra `99@a` kör bara makrot tre gånger. Det kör inte makrot på de sista två raderna eftersom körningen misslyckas med att köra `f{` på "foo"-raden. Detta är förväntat när man kör makrot i serie. Du kan alltid gå till nästa rad där "FUNC4" är och spela upp det makrot igen. Men vad händer om du vill få allt gjort på en gång?

Kör makrot parallellt.

Kom ihåg från tidigare avsnitt att makron kan köras med kommandorads kommandot `:normal` (ex: `:3,5 normal @a` kör makro a på rader 3-5). Om du kör `:1,$ normal @a`, kommer du att se att makrot körs på alla rader utom "foo"-raden. Det fungerar!

Även om Vim internt faktiskt inte kör makron parallellt, beter det sig utåt som om det gör det. Vim kör `@a` *oberoende* på varje rad från första till sista raden (`1,$`). Eftersom Vim kör dessa makron oberoende, vet inte varje rad att en av makrokörningarna hade misslyckats på "foo"-raden.
## Lär dig makron på det smarta sättet

Många saker du gör i redigering är repetitiva. För att bli bättre på redigering, skaffa dig vanan att upptäcka repetitiva åtgärder. Använd makron (eller punktkommandon) så att du inte behöver utföra samma åtgärd två gånger. Nästan allt du kan göra i Vim kan repliceras med makron.

I början tycker jag att det är väldigt besvärligt att skriva makron, men ge inte upp. Med tillräcklig träning kommer du att få vanan att automatisera allt.

Du kanske tycker att det är hjälpsamt att använda mnemonik för att komma ihåg dina makron. Om du har ett makro som skapar en funktion, använd "f-registret (`qf`). Om du har ett makro för numeriska operationer, bör "n-registret fungera (`qn`). Namnge det med det *första namngivna registret* som kommer till ditt sinne när du tänker på den operationen. Jag tycker också att "q-registret gör ett bra standardmakroregister eftersom `qq` kräver mindre hjärnkraft att komma på. Slutligen gillar jag också att öka mina makron i alfabetisk ordning, som `qa`, sedan `qb`, sedan `qc`, och så vidare.

Hitta en metod som fungerar bäst för dig.