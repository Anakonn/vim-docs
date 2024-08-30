---
description: Vim's ångra-system låter dig ångra och göra om ändringar, navigera i
  ändringshistorik och spara ändringar för att enkelt hantera text.
title: Ch10. Undo
---

Vi gör alla sorters skrivfel. Det är därför ångra är en väsentlig funktion i all modern mjukvara. Vims ångrasystem kan inte bara ångra och göra om enkla misstag, utan också få tillgång till olika texttillstånd, vilket ger dig kontroll över all text du någonsin har skrivit. I detta kapitel kommer du att lära dig hur man ångrar, gör om, navigerar i en ångra-gren, bevarar ångra och reser genom tiden.

## Ångra, Gör om och ÅNGRA

För att utföra en grundläggande ångra kan du använda `u` eller köra `:undo`.

Om du har denna text (notera den tomma raden under "one"):

```shell
one

```

Då lägger du till en annan text:

```shell
one
two
```

Om du trycker på `u`, ångrar Vim texten "two".

Hur vet Vim hur mycket som ska ångras? Vim ångrar en enda "ändring" åt gången, liknande en punktkommando-ändring (till skillnad från punktkommandot räknas kommandorads-kommandon också som en ändring).

För att göra om den senaste ändringen, tryck på `Ctrl-R` eller kör `:redo`. Efter att du har ångrat texten ovan för att ta bort "two", kommer `Ctrl-R` att återfå den borttagna texten.

Vim har också ÅNGRA som du kan köra med `U`. Det ångrar alla senaste ändringar.

Hur skiljer sig `U` från `u`? Först, `U` tar bort *alla* ändringar på den senaste ändrade raden, medan `u` bara tar bort en ändring i taget. För det andra, medan `u` inte räknas som en ändring, räknas `U` som en ändring.

Tillbaka till detta exempel:

```shell
one
two
```

Ändra den andra raden till "three":

```shell
one
three
```

Ändra den andra raden igen och ersätt den med "four":

```shell
one
four
```

Om du trycker på `u`, kommer du att se "three". Om du trycker på `u` igen, kommer du att se "two". Om du istället för att trycka på `u` när du fortfarande hade texten "four", hade tryckt på `U`, skulle du se:

```shell
one

```

`U` kringgår alla mellanliggande ändringar och går tillbaka till det ursprungliga tillståndet när du började (en tom rad). Dessutom, eftersom ÅNGRA faktiskt skapar en ny ändring i Vim, kan du ÅNGRA din ÅNGRA. `U` följt av `U` kommer att ångra sig själv. Du kan trycka på `U`, sedan `U`, sedan `U`, osv. Du kommer att se samma två texttillstånd växla fram och tillbaka.

Jag personligen använder inte `U` eftersom det är svårt att komma ihåg det ursprungliga tillståndet (jag behöver sällan det).

Vim sätter ett maximalt antal gånger du kan ångra i variabeln `undolevels`. Du kan kontrollera det med `:echo &undolevels`. Jag har min inställd på 1000. För att ändra din till 1000, kör `:set undolevels=1000`. Känn dig fri att ställa in det på valfritt nummer.

## Bryta Blocken

Jag nämnde tidigare att `u` ångrar en enda "ändring" liknande punktkommando-ändringen: texterna som infogas från det ögonblick du går in i insättningsläge tills du lämnar det räknas som en ändring.

Om du gör `ione two three<Esc>` och sedan trycker på `u`, tar Vim bort hela texten "one two three" eftersom hela saken räknas som en ändring. Detta är inte ett stort problem om du har skrivit korta texter, men vad händer om du har skrivit flera stycken inom en insättningslägesession utan att lämna och senare inser att du gjorde ett misstag? Om du trycker på `u`, skulle allt du hade skrivit tas bort. Skulle det inte vara användbart om du kunde trycka på `u` för att ta bort endast en del av din text?

Lyckligtvis kan du bryta ångra-blocken. När du skriver i insättningsläge, skapar du en ångra-punkt genom att trycka på `Ctrl-G u`. Till exempel, om du gör `ione <Ctrl-G u>two <Ctrl-G u>three<Esc>`, och sedan trycker på `u`, kommer du bara att förlora texten "three" (tryck på `u` en gång till för att ta bort "two"). När du skriver en lång text, använd `Ctrl-G u` strategiskt. Slutet av varje mening, mellan två stycken, eller efter varje kodrad är prime platser att lägga till ångra-punkter för att göra det lättare att ångra dina misstag om du någonsin gör ett.

Det är också användbart att skapa en ångra-punkt när du tar bort block i insättningsläge med `Ctrl-W` (ta bort ordet före markören) och `Ctrl-U` (ta bort all text före markören). En vän föreslog att använda följande kartor:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Med dessa kan du enkelt återfå de borttagna texterna.

## Ångra Träd

Vim lagrar varje ändring som någonsin har skrivits i ett ångra-träd. Starta en ny tom fil. Lägg sedan till en ny text:

```shell
one

```

Lägg till en ny text:

```shell
one
two
```

Ångra en gång:

```shell
one

```

Lägg till en annan text:

```shell
one
three
```

Ångra igen:

```shell
one

```

Och lägg till en annan annan text:

```shell
one
four
```

Nu, om du ångrar, kommer du att förlora texten "four" som du just lade till:

```shell
one

```

Om du ångrar en gång till:

```shell

```

Kommer du att förlora texten "one". I de flesta textredigerare skulle det ha varit omöjligt att få tillbaka texterna "two" och "three", men inte med Vim! Tryck på `g+` så får du tillbaka din text "one":

```shell
one

```

Skriv `g+` igen så ser du en gammal vän:

```shell
one
two
```

Låt oss fortsätta. Tryck på `g+` igen:

```shell
one
three
```

Tryck på `g+` en gång till:

```shell
one
four
```

I Vim, varje gång du trycker på `u` och sedan gör en annan ändring, lagrar Vim den tidigare tillståndets text genom att skapa en "ångra-gren". I detta exempel, efter att du skrivit "two", tryckte på `u`, och sedan skrev "three", skapade du en bladgren som lagrar tillståndet som innehåller texten "two". Vid det tillfället innehöll ångra-trädet minst två bladnoder: huvudnoden som innehåller texten "three" (senaste) och ångra-gren-noden som innehåller texten "two". Om du hade gjort en annan ångra och skrivit texten "four", skulle du ha haft tre noder: en huvudnod som innehåller texten "four" och två noder som innehåller texterna "three" och "two".

För att navigera mellan varje ångra-trädnod kan du använda `g+` för att gå till ett nyare tillstånd och `g-` för att gå till ett äldre tillstånd. Skillnaden mellan `u`, `Ctrl-R`, `g+` och `g-` är att både `u` och `Ctrl-R` endast navigerar genom *huvud* noder i ångra-trädet medan `g+` och `g-` navigerar genom *alla* noder i ångra-trädet.

Ångra-trädet är inte lätt att visualisera. Jag tycker att [vim-mundo](https://github.com/simnalamburt/vim-mundo) plugin är mycket användbar för att hjälpa till att visualisera Vims ångra-träd. Ge det lite tid att leka med det.

## Beständig Ångra

Om du startar Vim, öppnar en fil och omedelbart trycker på `u`, kommer Vim förmodligen att visa "*Already at oldest change*" varning. Det finns inget att ångra eftersom du inte har gjort några ändringar.

För att rulla tillbaka ångra-historiken från den senaste redigeringssessionen kan Vim bevara din ångra-historik med en ångra-fil med `:wundo`.

Skapa en fil `mynumbers.txt`. Skriv:

```shell
one
```

Skriv sedan en annan rad (se till att varje rad räknas som en ändring):

```shell
one
two
```

Skriv en annan rad:

```shell
one
two
three
```

Nu skapa din ångra-fil med `:wundo {my-undo-file}`. Om du behöver skriva över en befintlig ångra-fil kan du lägga till `!` efter `wundo`.

```shell
:wundo! mynumbers.undo
```

Stäng sedan Vim.

Vid det här laget bör du ha `mynumbers.txt` och `mynumbers.undo` filer i din katalog. Öppna `mynumbers.txt` igen och försök trycka på `u`. Det kan du inte. Du har inte gjort några ändringar sedan du öppnade filen. Ladda nu din ångra-historik genom att läsa ångra-filen med `:rundo`:

```shell
:rundo mynumbers.undo
```

Nu, om du trycker på `u`, tar Vim bort "three". Tryck på `u` igen för att ta bort "two". Det är som om du aldrig ens stängde Vim!

Om du vill ha en automatisk ångra-beständighet, är ett sätt att göra det genom att lägga till detta i vimrc:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

Inställningen ovan kommer att placera alla ångra-filer i en centraliserad katalog, `~/.vim` katalogen. Namnet `undo_dir` är godtyckligt. `set undofile` säger till Vim att slå på `undofile`-funktionen eftersom den är avstängd som standard. Nu, när du sparar, skapar och uppdaterar Vim automatiskt den relevanta filen inuti `undo_dir` katalogen (se till att du skapar den faktiska `undo_dir` katalogen inuti `~/.vim` katalogen innan du kör detta).

## Tidsresor

Vem säger att tidsresor inte existerar? Vim kan resa till ett texttillstånd i det förflutna med `:earlier` kommandorads-kommandot.

Om du har denna text:

```shell
one

```
Sedan senare lägger du till:

```shell
one
two
```

Om du hade skrivit "two" för mindre än tio sekunder sedan, kan du gå tillbaka till det tillstånd där "two" inte fanns för tio sekunder sedan med:

```shell
:earlier 10s
```

Du kan använda `:undolist` för att se när den senaste ändringen gjordes. `:earlier` accepterar också olika argument:

```shell
:earlier 10s    Gå till tillståndet 10 sekunder tidigare
:earlier 10m    Gå till tillståndet 10 minuter tidigare
:earlier 10h    Gå till tillståndet 10 timmar tidigare
:earlier 10d    Gå till tillståndet 10 dagar tidigare
```

Dessutom accepterar det också en vanlig `count` som argument för att säga till Vim att gå till det äldre tillståndet `count` gånger. Till exempel, om du gör `:earlier 2`, kommer Vim att gå tillbaka till ett äldre texttillstånd två ändringar tillbaka. Det är samma sak som att göra `g-` två gånger. Du kan också be den att gå till det äldre texttillståndet 10 sparningar tillbaka med `:earlier 10f`.

Samma uppsättning argument fungerar med `:earlier` motsvarighet: `:later`.

```shell
:later 10s    gå till tillståndet 10 sekunder senare
:later 10m    gå till tillståndet 10 minuter senare
:later 10h    gå till tillståndet 10 timmar senare
:later 10d    gå till tillståndet 10 dagar senare
:later 10     gå till det nyare tillståndet 10 gånger
:later 10f    gå till tillståndet 10 sparningar senare
```

## Lär dig Ångra på det Smartaste Sättet

`u` och `Ctrl-R` är två oumbärliga Vim-kommandon för att rätta till misstag. Lär dig dem först. Nästa, lär dig hur man använder `:earlier` och `:later` med tidsargumenten först. Efter det, ta dig tid att förstå ångra-trädet. [vim-mundo](https://github.com/simnalamburt/vim-mundo) plugin hjälpte mig mycket. Skriv tillsammans med texterna i detta kapitel och kontrollera ångra-trädet när du gör varje ändring. När du väl har förstått det kommer du aldrig att se ångrasystemet på samma sätt igen.

Före detta kapitel lärde du dig hur man hittar vilken text som helst i ett projektutrymme, med ångra kan du nu hitta vilken text som helst i en tidsdimension. Du kan nu söka efter vilken text som helst efter dess plats och tid den skrevs. Du har uppnått Vim-omnipresens.