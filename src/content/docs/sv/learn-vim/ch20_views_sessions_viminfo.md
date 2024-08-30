---
description: Lär dig hur du bevarar inställningar, vikningar och buffertar i Vim med
  hjälp av View, Session och Viminfo för att återfå ditt arbetsflöde.
title: Ch20. Views, Sessions, and Viminfo
---

Efter att du har arbetat med ett projekt ett tag, kan du märka att projektet gradvis tar form med sina egna inställningar, vikningar, buffertar, layouter, etc. Det är som att dekorera din lägenhet efter att ha bott i den ett tag. Problemet är att när du stänger Vim, förlorar du dessa ändringar. Skulle det inte vara trevligt om du kunde behålla dessa ändringar så att nästa gång du öppnar Vim, ser det ut som om du aldrig hade lämnat?

I detta kapitel kommer du att lära dig hur man använder View, Session och Viminfo för att bevara en "snapshot" av dina projekt.

## View

En View är den minsta delmängden av de tre (View, Session, Viminfo). Det är en samling av inställningar för ett fönster. Om du spenderar lång tid på att arbeta med ett fönster och vill bevara kartorna och vikningarna, kan du använda en View.

Låt oss skapa en fil som heter `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

I denna fil, gör tre ändringar:
1. På rad 1, skapa en manuell vikning `zf4j` (vik de nästa 4 raderna).
2. Ändra inställningen `number`: `setlocal nonumber norelativenumber`. Detta kommer att ta bort nummerindikatorerna på vänster sida av fönstret.
3. Skapa en lokal mappning för att gå ner två rader varje gång du trycker på `j` istället för en: `:nnoremap <buffer> j jj`.

Din fil bör se ut så här:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Konfigurera View-attribut

Kör:

```shell
:set viewoptions?
```

Som standard bör det säga (din kan se annorlunda ut beroende på din vimrc):

```shell
viewoptions=folds,cursor,curdir
```

Låt oss konfigurera `viewoptions`. De tre attributen du vill bevara är vikningarna, kartorna och de lokala inställningsalternativen. Om din inställning ser ut som min, har du redan `folds` alternativet. Du behöver berätta för View att komma ihåg `localoptions`. Kör:

```shell
:set viewoptions+=localoptions
```

För att lära dig vilka andra alternativ som finns tillgängliga för `viewoptions`, kolla in `:h viewoptions`. Nu om du kör `:set viewoptions?`, bör du se:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Spara View

Med `foo.txt` fönstret korrekt vikt och med `nonumber norelativenumber` alternativ, låt oss spara View. Kör:

```shell
:mkview
```

Vim skapar en View-fil.

### View-filer

Du kanske undrar, "Var sparade Vim denna View-fil?" För att se var Vim sparar den, kör:

```shell
:set viewdir?
```

I Unix-baserade OS bör standardinställningen säga `~/.vim/view` (om du har ett annat OS, kan det visa en annan sökväg. Kolla in `:h viewdir` för mer). Om du kör ett Unix-baserat OS och vill ändra det till en annan sökväg, lägg till detta i din vimrc:

```shell
set viewdir=$HOME/else/where
```

### Ladda View-filen

Stäng `foo.txt` om du inte har gjort det, öppna sedan `foo.txt` igen. **Du bör se den ursprungliga texten utan ändringar.** Det är förväntat.

För att återställa tillståndet, behöver du ladda View-filen. Kör:

```shell
:loadview
```

Nu bör du se:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Vikningarna, lokala inställningar och lokala mappningar återställs. Om du märker, bör din markör också vara på den rad där du lämnade den när du körde `:mkview`. Så länge du har `cursor` alternativet, kommer View också ihåg din markörposition.

### Flera Views

Vim låter dig spara 9 numrerade Views (1-9).

Anta att du vill göra en ytterligare vikning (låt oss säga att du vill vika de sista två raderna) med `:9,10 fold`. Låt oss spara detta som View 1. Kör:

```shell
:mkview 1
```

Om du vill göra en vikning till med `:6,7 fold` och spara den som en annan View, kör:

```shell
:mkview 2
```

Stäng filen. När du öppnar `foo.txt` och vill ladda View 1, kör:

```shell
:loadview 1
```

För att ladda View 2, kör:

```shell
:loadview 2
```

För att ladda den ursprungliga View, kör:

```shell
:loadview
```

### Automatisera View-skapande

En av de värsta sakerna som kan hända är, efter att ha spenderat otaliga timmar på att organisera en stor fil med vikningar, att du av misstag stänger fönstret och förlorar all vikningsinformation. För att förhindra detta, kanske du vill automatiskt skapa en View varje gång du stänger en buffert. Lägg till detta i din vimrc:

```shell
autocmd BufWinLeave *.txt mkview
```

Dessutom kan det vara trevligt att ladda View när du öppnar en buffert:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Nu behöver du inte oroa dig för att skapa och ladda View längre när du arbetar med `txt`-filer. Tänk på att över tid kan din `~/.vim/view` börja ackumulera View-filer. Det är bra att städa upp det en gång var några månader.

## Sessions

Om en View sparar inställningarna för ett fönster, sparar en Session informationen för alla fönster (inklusive layouten).

### Skapa en ny Session

Anta att du arbetar med dessa 3 filer i ett `foobarbaz` projekt:

Inuti `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Inuti `bar.txt`:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

Inuti `baz.txt`:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Nu låt oss säga att du delade dina fönster med `:split` och `:vsplit`. För att bevara detta utseende, behöver du spara Sessionen. Kör:

```shell
:mksession
```

Till skillnad från `mkview` där det sparar till `~/.vim/view` som standard, sparar `mksession` en Session-fil (`Session.vim`) i den aktuella katalogen. Kolla in filen om du är nyfiken på vad som finns inuti.

Om du vill spara Session-filen någon annanstans, kan du skicka ett argument till `mksession`:

```shell
:mksession ~/some/where/else.vim
```

Om du vill skriva över den befintliga Session-filen, kalla kommandot med ett `!` (`:mksession! ~/some/where/else.vim`).

### Ladda en Session

För att ladda en Session, kör:

```shell
:source Session.vim
```

Nu ser Vim ut precis som du lämnade det, inklusive de delade fönstren! Alternativt kan du också ladda en Session-fil från terminalen:

```shell
vim -S Session.vim
```

### Konfigurera Session-attribut

Du kan konfigurera de attribut som Session sparar. För att se vad som för närvarande sparas, kör:

```shell
:set sessionoptions?
```

Min säger:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Om du inte vill spara `terminal` när du sparar en Session, ta bort den från sessionalternativen. Kör:

```shell
:set sessionoptions-=terminal
```

Om du vill lägga till ett `options` när du sparar en Session, kör:

```shell
:set sessionoptions+=options
```

Här är några attribut som `sessionoptions` kan lagra:
- `blank` lagrar tomma fönster
- `buffers` lagrar buffertar
- `folds` lagrar vikningar
- `globals` lagrar globala variabler (måste börja med en versal och innehålla minst en gemen bokstav)
- `options` lagrar alternativ och mappningar
- `resize` lagrar fönsterlinjer och kolumner
- `winpos` lagrar fönsterposition
- `winsize` lagrar fönsterstorlekar
- `tabpages` lagrar flikar
- `unix` lagrar filer i Unix-format

För den kompletta listan, kolla in `:h 'sessionoptions'`.

Session är ett användbart verktyg för att bevara dina projekts externa attribut. Men vissa interna attribut sparas inte av Session, som lokala märken, register, historik, etc. För att spara dem, behöver du använda Viminfo!

## Viminfo

Om du märker, efter att ha yankat ett ord till register a och avslutat Vim, har du fortfarande den texten lagrad i register a nästa gång du öppnar Vim. Detta är faktiskt ett verk av Viminfo. Utan det kommer Vim inte att komma ihåg registret efter att du stänger Vim.

Om du använder Vim 8 eller högre, aktiverar Vim Viminfo som standard, så du kanske har använt Viminfo hela tiden utan att veta om det!

Du kanske frågar: "Vad sparar Viminfo? Hur skiljer det sig från Session?"

För att använda Viminfo, behöver du först ha `+viminfo` funktionen tillgänglig (`:version`). Viminfo lagrar:
- Kommandoradshistorik.
- Söksträngshistorik.
- Inmatningslinjehistorik.
- Innehåll av icke-tomma register.
- Märken för flera filer.
- Filmärken, som pekar på platser i filer.
- Senaste sök-/ersättningsmönster (för 'n' och '&').
- Buffertlistan.
- Globala variabler.

Generellt lagrar Session de "externa" attributen och Viminfo de "interna" attributen.

Till skillnad från Session där du kan ha en Session-fil per projekt, kommer du normalt att använda en Viminfo-fil per dator. Viminfo är projektagnostisk.

Den standardmässiga Viminfo-platsen för Unix är `$HOME/.viminfo` (`~/.viminfo`). Om du använder ett annat OS, kan din Viminfo-plats vara annorlunda. Kolla in `:h viminfo-file-name`. Varje gång du gör "interna" ändringar, som att yank ett textstycke till ett register, uppdaterar Vim automatiskt Viminfo-filen.

*Se till att du har `nocompatible` alternativet inställt (`set nocompatible`), annars kommer din Viminfo inte att fungera.*

### Skriva och läsa Viminfo

Även om du kommer att använda endast en Viminfo-fil, kan du skapa flera Viminfo-filer. För att skriva en Viminfo-fil, använd kommandot `:wviminfo` (`:wv` för kort).

```shell
:wv ~/.viminfo_extra
```

För att skriva över en befintlig Viminfo-fil, lägg till ett utropstecken till `wv` kommandot:

```shell
:wv! ~/.viminfo_extra
```

Som standard kommer Vim att läsa från `~/.viminfo` filen. För att läsa från en annan Viminfo-fil, kör `:rviminfo`, eller `:rv` för kort:

```shell
:rv ~/.viminfo_extra
```

För att starta Vim med en annan Viminfo-fil från terminalen, använd `i` flaggan:

```shell
vim -i viminfo_extra
```

Om du använder Vim för olika uppgifter, som kodning och skrivande, kan du skapa en Viminfo optimerad för skrivande och en annan för kodning.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Starta Vim utan Viminfo

För att starta Vim utan Viminfo, kan du köra från terminalen:

```shell
vim -i NONE
```

För att göra det permanent, kan du lägga till detta i din vimrc-fil:

```shell
set viminfo="NONE"
```

### Konfigurera Viminfo-attribut

Likt `viewoptions` och `sessionoptions`, kan du instruera vilka attribut som ska sparas med `viminfo` alternativet. Kör:

```shell
:set viminfo?
```

Du kommer att få:

```shell
!,'100,<50,s10,h
```

Detta ser kryptiskt ut. Låt oss bryta ner det:
- `!` sparar globala variabler som börjar med en versal och inte innehåller gemena bokstäver. Kom ihåg att `g:` indikerar en global variabel. Till exempel, om du vid något tillfälle skrev tilldelningen `let g:FOO = "foo"`, kommer Viminfo att spara den globala variabeln `FOO`. Men om du gjorde `let g:Foo = "foo"`, kommer Viminfo inte att spara denna globala variabel eftersom den innehåller gemena bokstäver. Utan `!`, kommer Vim inte att spara dessa globala variabler.
- `'100` representerar märken. I detta fall kommer Viminfo att spara de lokala märkena (a-z) för de senaste 100 filerna. Var medveten om att om du ber Viminfo att spara för många filer, kan Vim börja sakta ner. 1000 är ett bra antal att ha.
- `<50` berättar för Viminfo hur många maximala rader som sparas för varje register (50 i detta fall). Om jag yankar 100 rader text till register a (`"ay99j`) och stänger Vim, kommer nästa gång jag öppnar Vim och klistrar in från register a (`"ap`), Vim endast att klistra in 50 rader max. Om du inte ger ett maximalt radnummer, *alla* rader kommer att sparas. Om du ger det 0, kommer inget att sparas.
- `s10` sätter en storleksgräns (i kb) för ett register. I detta fall kommer alla register som är större än 10kb att uteslutas.
- `h` inaktiverar markering (från `hlsearch`) när Vim startar.

Det finns andra alternativ som du kan ange. För att lära dig mer, kolla in `:h 'viminfo'`.
## Använda Views, Sessions och Viminfo på ett Smart Sätt

Vim har View, Session och Viminfo för att ta olika nivåer av dina Vim-miljösnapshotar. För mikroprojekt, använd Views. För större projekt, använd Sessions. Du bör ta dig tid att kolla in alla alternativ som View, Session och Viminfo erbjuder.

Skapa din egen View, Session och Viminfo för din egen redigeringsstil. Om du någonsin behöver använda Vim utanför din dator kan du bara ladda dina inställningar och du kommer omedelbart att känna dig hemma!