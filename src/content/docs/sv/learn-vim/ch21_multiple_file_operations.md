---
description: Lär dig olika sätt att redigera flera filer i Vim med kommandon som `argdo`,
  `bufdo` och `cdo` för effektivare redigering och hantering.
title: Ch21. Multiple File Operations
---

Att kunna uppdatera i flera filer är ett annat användbart redigeringsverktyg att ha. Tidigare lärde du dig hur man uppdaterar flera texter med `cfdo`. I det här kapitlet kommer du att lära dig de olika sätten du kan redigera flera filer i Vim.

## Olika sätt att köra ett kommando i flera filer

Vim har åtta sätt att köra kommandon över flera filer:
- arg-lista (`argdo`)
- buffer-lista (`bufdo`)
- fönsterlista (`windo`)
- fliklista (`tabdo`)
- quickfix-lista (`cdo`)
- quickfix-lista filvis (`cfdo`)
- platslista (`ldo`)
- platslista filvis (`lfdo`)

Praktiskt sett kommer du förmodligen bara att använda en eller två av dem mestadels (jag använder personligen `cdo` och `argdo` mer än andra), men det är bra att lära sig om alla tillgängliga alternativ och använda de som passar din redigeringsstil.

Att lära sig åtta kommandon kan låta överväldigande. Men i verkligheten fungerar dessa kommandon på liknande sätt. Efter att ha lärt dig ett, blir det lättare att lära sig resten. De delar alla samma stora idé: skapa en lista över sina respektive kategorier och skicka dem kommandot som du vill köra.

## Argumentlista

Argumentlistan är den mest grundläggande listan. Den skapar en lista över filer. För att skapa en lista över file1, file2 och file3 kan du köra:

```shell
:args file1 file2 file3
```

Du kan också skicka den ett wildcard (`*`), så om du vill göra en lista över alla `.js`-filer i den aktuella katalogen, kör:

```shell
:args *.js
```

Om du vill göra en lista över alla Javascript-filer som börjar med "a" i den aktuella katalogen, kör:

```shell
:args a*.js
```

Wildcardet matchar ett eller flera av alla filnamnstecken i den aktuella katalogen, men vad händer om du behöver söka rekursivt i vilken katalog som helst? Du kan använda det dubbla wildcardet (`**`). För att få alla Javascript-filer inuti katalogerna inom din nuvarande plats, kör:

```shell
:args **/*.js
```

När du kör kommandot `args` kommer din aktuella buffer att bytas till det första objektet i listan. För att visa listan över filer du just har skapat, kör `:args`. När du har skapat din lista kan du navigera i dem. `:first` kommer att sätta dig på det första objektet i listan. `:last` kommer att sätta dig på den sista listan. För att flytta listan framåt en fil i taget, kör `:next`. För att flytta listan bakåt en fil i taget, kör `:prev`. För att flytta framåt/bakåt en fil i taget och spara ändringarna, kör `:wnext` och `:wprev`. Det finns många fler navigeringskommandon. Kolla in `:h arglist` för mer.

Arg-listan är användbar om du behöver rikta in dig på en specifik typ av fil eller några få filer. Kanske behöver du uppdatera alla "donut" till "pancake" i alla `yml`-filer, du kan göra:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Om du kör kommandot `args` igen, kommer det att ersätta den tidigare listan. Till exempel, om du tidigare körde:

```shell
:args file1 file2 file3
```

Förutsatt att dessa filer finns, har du nu en lista över `file1`, `file2` och `file3`. Sedan kör du detta:

```shell
:args file4 file5
```

Din ursprungliga lista över `file1`, `file2` och `file3` ersätts med `file4` och `file5`. Om du har `file1`, `file2` och `file3` i din arg-lista och du vill *lägga till* `file4` och `file5` i din ursprungliga fillista, använd kommandot `:arga`. Kör:

```shell
:arga file4 file5
```

Nu har du `file1`, `file2`, `file3`, `file4` och `file5` i din arg-lista.

Om du kör `:arga` utan några argument, kommer Vim att lägga till din aktuella buffer i den aktuella arg-listan. Om du redan har `file1`, `file2` och `file3` i din arg-lista och din aktuella buffer är på `file5`, kommer körning av `:arga` att lägga till `file5` i listan.

När du har listan kan du skicka den med valfria kommandorads kommandon av ditt val. Du har sett det göras med substitution (`:argdo %s/donut/pancake/g`). Några andra exempel:
- För att ta bort alla rader som innehåller "dessert" över arg-listan, kör `:argdo g/dessert/d`.
- För att köra makro a (förutsatt att du har spelat in något i makro a) över arg-listan, kör `:argdo norm @a`.
- För att skriva "hello " följt av filnamnet på den första raden, kör `:argdo 0put='hello ' .. @:`.

När du är klar, glöm inte att spara dem med `:update`.

Ibland behöver du köra kommandona endast på de första n objekten i argumentlistan. Om det är fallet, skicka bara till `argdo`-kommandot en adress. Till exempel, för att köra substitueringskommandot endast på de första 3 objekten från listan, kör `:1,3argdo %s/donut/pancake/g`.

## Bufferlista

Bufferlistan kommer att skapas organiskt när du redigerar nya filer eftersom varje gång du skapar en ny fil / öppnar en fil, sparar Vim den i en buffer (om du inte uttryckligen tar bort den). Så om du redan har öppnat 3 filer: `file1.rb file2.rb file3.rb`, har du redan 3 objekt i din bufferlista. För att visa bufferlistan, kör `:buffers` (alternativt: `:ls` eller `:files`). För att navigera framåt och bakåt, använd `:bnext` och `:bprev`. För att gå till den första och sista buffern från listan, använd `:bfirst` och `:blast` (har du kul än? :D).

Förresten, här är ett coolt buffertips som inte är relaterat till det här kapitlet: om du har ett antal objekt i din bufferlista kan du visa alla med `:ball` (buffer all). Kommandot `ball` visar alla buffrar horisontellt. För att visa dem vertikalt, kör `:vertical ball`.

Tillbaka till ämnet, mekaniken för att köra operationer över alla buffrar är liknande arg-listan. När du har skapat din bufferlista behöver du bara föra in de kommandon som du vill köra med `:bufdo` istället för `:argdo`. Så om du vill ersätta alla "donut" med "pancake" över alla buffrar och sedan spara ändringarna, kör `:bufdo %s/donut/pancake/g | update`.

## Fönster- och fliklista

Fönster- och fliklistor är också liknande arg- och bufferlistor. De enda skillnaderna är deras sammanhang och syntax.

Fönsteroperationer utförs på varje öppet fönster och utförs med `:windo`. Flikoperationer utförs på varje flik du har öppnat och utförs med `:tabdo`. För mer, kolla in `:h list-repeat`, `:h :windo`, och `:h :tabdo`.

Till exempel, om du har tre fönster öppna (du kan öppna nya fönster med `Ctrl-W v` för ett vertikalt fönster och `Ctrl-W s` för ett horisontellt fönster) och du kör `:windo 0put ='hello' . @%`, kommer Vim att skriva ut "hello" + filnamn till alla öppna fönster.

## Quickfix-lista

I de tidigare kapitlen (Ch3 och Ch19) har jag pratat om quickfixar. Quickfix har många användningsområden. Många populära plugins använder quickfixar, så det är bra att spendera mer tid på att förstå dem.

Om du är ny på Vim kan quickfix vara ett nytt koncept. På gamla dagar när du faktiskt var tvungen att kompilera din kod uttryckligen, skulle du under kompilationsfasen stöta på fel. För att visa dessa fel behöver du ett speciellt fönster. Det är där quickfix kommer in. När du kompilerar din kod visar Vim felmeddelanden i quickfix-fönstret så att du kan åtgärda dem senare. Många moderna språk kräver inte längre en uttrycklig kompilering, men det gör inte quickfix obsolet. Numera använder folk quickfix för alla möjliga saker, som att visa en virtuell terminalutgång och lagra sökresultat. Låt oss fokusera på det senare, att lagra sökresultat.

Förutom kompilationskommandona, är vissa Vim-kommandon beroende av quickfix-gränssnitt. En typ av kommando som använder quickfixar mycket är sökkommandona. Både `:vimgrep` och `:grep` använder quickfixar som standard.

Till exempel, om du behöver söka efter "donut" i alla Javascript-filer rekursivt, kan du köra:

```shell
:vimgrep /donut/ **/*.js
```

Resultatet för "donut"-sökningen lagras i quickfix-fönstret. För att se dessa matchresultat i quickfix-fönstret, kör:

```shell
:copen
```

För att stänga det, kör:

```shell
:cclose
```

För att navigera i quickfix-listan framåt och bakåt, kör:

```shell
:cnext
:cprev
```

För att gå till det första och sista objektet i matchningen, kör:

```shell
:cfirst
:clast
```

Tidigare nämnde jag att det fanns två quickfix-kommandon: `cdo` och `cfdo`. Hur skiljer de sig? `cdo` kör kommandot för varje objekt i quickfix-listan medan `cfdo` kör kommandot för varje *fil* i quickfix-listan.

Låt mig förtydliga. Anta att efter att ha kört kommandot `vimgrep` ovan, har du funnit:
- 1 resultat i `file1.js`
- 10 resultat i `file2.js`

Om du kör `:cfdo %s/donut/pancake/g`, kommer detta effektivt att köra `%s/donut/pancake/g` en gång i `file1.js` och en gång i `file2.js`. Det körs *lika många gånger som det finns filer i matchningen.* Eftersom det finns två filer i resultaten, kör Vim substitueringskommandot en gång på `file1.js` och en gång till på `file2.js`, trots att det finns 10 träffar i den andra filen. `cfdo` bryr sig bara om hur många totala filer som finns i quickfix-listan.

Om du kör `:cdo %s/donut/pancake/g`, kommer detta effektivt att köra `%s/donut/pancake/g` en gång i `file1.js` och *tio gånger* i `file2.js`. Det körs lika många gånger som det finns faktiska objekt i quickfix-listan. Eftersom det bara finns en träff i `file1.js` och 10 träffar i `file2.js`, kommer det att köras totalt 11 gånger.

Eftersom du körde `%s/donut/pancake/g`, skulle det vara logiskt att använda `cfdo`. Det skulle inte vara logiskt att använda `cdo` eftersom det skulle köra `%s/donut/pancake/g` tio gånger i `file2.js` (`%s` är en filomfattande substitution). Att köra `%s` en gång per fil är tillräckligt. Om du använde `cdo`, skulle det vara mer meningsfullt att skicka det med `s/donut/pancake/g` istället.

När du bestämmer om du ska använda `cfdo` eller `cdo`, tänk på kommandoomfånget som du skickar det till. Är detta ett filomfattande kommando (som `:%s` eller `:g`) eller är detta ett radomfattande kommando (som `:s` eller `:!`)?

## Platslista

Platslistan liknar quickfix-listan i den meningen att Vim också använder ett speciellt fönster för att visa meddelanden. Skillnaden mellan en quickfix-lista och en platslista är att du när som helst bara kan ha en quickfix-lista, medan du kan ha så många platslistor som fönster.

Anta att du har två fönster öppna, ett fönster som visar `food.txt` och ett annat som visar `drinks.txt`. Från insidan av `food.txt`, kör du ett platslista-sökommandot `:lvimgrep` (den platsvariant för kommandot `:vimgrep`):

```shell
:lvim /bagel/ **/*.md
```

Vim kommer att skapa en platslista över alla bagel-sökträffar för det `food.txt` *fönstret*. Du kan se platslistan med `:lopen`. Gå nu till det andra fönstret `drinks.txt` och kör:

```shell
:lvimgrep /milk/ **/*.md
```

Vim kommer att skapa en *separat* platslista med alla mjölksökträffar för det `drinks.txt` *fönstret*.

För varje platskommando du kör i varje fönster skapar Vim en distinkt platslista. Om du har 10 olika fönster kan du ha upp till 10 olika platslistor. Jämför detta med quickfix-listan där du bara kan ha en åt gången. Om du har 10 olika fönster får du fortfarande bara en quickfix-lista.

De flesta av platslistans kommandon liknar quickfix-kommandon förutom att de är prefixade med `l-` istället. Till exempel: `:lvimgrep`, `:lgrep`, och `:lmake` vs `:vimgrep`, `:grep`, och `:make`. För att manipulera platslistfönstret ser kommandona återigen liknande ut som quickfix-kommandona `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext`, och `:lprev` vs `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext`, och `:cprev`.

De två platslista-multifilkommandona är också liknande quickfix multifilkommandon: `:ldo` och `:lfdo`. `:ldo` kör platskommandot i varje platslista medan `:lfdo` kör platslistkommandot för varje fil i platslistan. För mer, kolla in `:h location-list`.
## Köra flera filoperationer i Vim

Att veta hur man gör en flera filoperation är en användbar färdighet att ha när man redigerar. När du behöver ändra ett variabelnamn i flera filer vill du utföra dem i ett svep. Vim har åtta olika sätt att göra detta.

Praktiskt taget kommer du förmodligen inte att använda alla åtta lika mycket. Du kommer att luta dig mot ett eller två. När du börjar, välj ett (jag föreslår personligen att börja med arg list `:argdo`) och behärska det. När du känner dig bekväm med ett, lär dig nästa. Du kommer att upptäcka att det blir lättare att lära sig det andra, tredje, fjärde. Var kreativ. Använd det med olika kombinationer. Fortsätt öva tills du kan göra detta utan ansträngning och utan mycket eftertanke. Gör det till en del av ditt muskelminne.

Med det sagt, du har bemästrat Vim-redigering. Grattis!