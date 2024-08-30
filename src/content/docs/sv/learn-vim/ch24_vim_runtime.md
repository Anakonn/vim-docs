---
description: Denna kapitel ger en översikt över Vims runtime-sökvägar, deras funktion
  och hur man kan anpassa Vim för att förbättra användarupplevelsen.
title: Ch24. Vim Runtime
---

I de tidigare kapitlen nämnde jag att Vim automatiskt letar efter speciella sökvägar som `pack/` (Kap. 22) och `compiler/` (Kap. 19) inuti `~/.vim/`-katalogen. Dessa är exempel på Vims körsökvägar.

Vim har fler körsökvägar än dessa två. I det här kapitlet kommer du att lära dig en översikt över dessa körsökvägar. Målet med detta kapitel är att visa dig när de kallas. Att veta detta kommer att göra att du kan förstå och anpassa Vim ytterligare.

## Körsökväg

På en Unix-maskin är en av dina Vims körsökvägar `$HOME/.vim/` (om du har ett annat operativsystem som Windows, kan din sökväg vara annorlunda). För att se vilka körsökvägar som finns för olika operativsystem, kolla in `:h 'runtimepath'`. I det här kapitlet kommer jag att använda `~/.vim/` som standard körsökväg.

## Plugin-skript

Vim har en plugin-körsökväg som kör alla skript i denna katalog en gång varje gång Vim startar. Förväxla inte namnet "plugin" med Vims externa plugins (som NERDTree, fzf.vim, etc).

Gå till `~/.vim/`-katalogen och skapa en `plugin/`-katalog. Skapa två filer: `donut.vim` och `chocolate.vim`.

Inuti `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

Inuti `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Stäng nu Vim. Nästa gång du startar Vim kommer du att se både `"donut!"` och `"chocolate!"` ekade. Plugin-körsökvägen kan användas för initialiseringsskript.

## Filtypdetektering

Innan du börjar, för att säkerställa att dessa detektioner fungerar, se till att din vimrc innehåller åtminstone följande rad:

```shell
filetype plugin indent on
```

Kolla in `:h filetype-overview` för mer kontext. I huvudsak aktiverar detta Vims filtypdetektering.

När du öppnar en ny fil vet Vim vanligtvis vilken typ av fil det är. Om du har en fil `hello.rb`, returnerar kommandot `:set filetype?` det korrekta svaret `filetype=ruby`.

Vim vet hur man detekterar "vanliga" filtyper (Ruby, Python, Javascript, etc). Men vad händer om du har en anpassad fil? Du behöver lära Vim att detektera den och tilldela den rätt filtyp.

Det finns två metoder för detektion: använda filnamn och filinnehåll.

### Filnamnsdetektering

Filnamnsdetektering detekterar en filtyp med hjälp av namnet på den filen. När du öppnar filen `hello.rb` vet Vim att det är en Ruby-fil från `.rb`-tillägget.

Det finns två sätt att göra filnamnsdetektering: använda `ftdetect/` körkatalog och använda `filetype.vim` körfil. Låt oss utforska båda.

#### `ftdetect/`

Låt oss skapa en obskyr (men ändå läcker) fil, `hello.chocodonut`. När du öppnar den och kör `:set filetype?`, eftersom det inte är en vanlig filnamnstillägg vet Vim inte vad den ska göra med den. Den returnerar `filetype=`.

Du behöver instruera Vim att sätta alla filer som slutar med `.chocodonut` som en "chocodonut" filtyp. Skapa en katalog som heter `ftdetect/` i körrotkatalogen (`~/.vim/`). Inuti, skapa en fil och namnge den `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). Inuti denna fil, lägg till:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` och `BufRead` utlöses när du skapar en ny buffert och öppnar en ny buffert. `*.chocodonut` betyder att denna händelse endast kommer att utlösas om den öppnade bufferten har ett `.chocodonut` filnamnstillägg. Slutligen sätter kommandot `set filetype=chocodonut` filtypen till att vara en chocodonut-typ.

Starta om Vim. Öppna nu filen `hello.chocodonut` och kör `:set filetype?`. Den returnerar `filetype=chocodonut`.

Läckert! Du kan lägga så många filer du vill inuti `ftdetect/`. I framtiden kan du kanske lägga till `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, etc., om du någonsin bestämmer dig för att utöka dina donutfiltyper.

Det finns faktiskt två sätt att ställa in en filtyp i Vim. Det ena är vad du just använde `set filetype=chocodonut`. Det andra sättet är att köra `setfiletype chocodonut`. Den första kommandot `set filetype=chocodonut` kommer *alltid* att ställa in filtypen till chocodonut-typ, medan det senare kommandot `setfiletype chocodonut` endast kommer att ställa in filtypen om ingen filtyp har ställts in ännu.

#### Filtypfil

Den andra fildetekteringsmetoden kräver att du skapar en `filetype.vim` i rotkatalogen (`~/.vim/filetype.vim`). Lägg till detta inuti:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Skapa en fil `hello.plaindonut`. När du öppnar den och kör `:set filetype?`, visar Vim den korrekta anpassade filtypen `filetype=plaindonut`.

Heliga bakverk, det fungerar! Förresten, om du leker med `filetype.vim`, kan du märka att denna fil körs flera gånger när du öppnar `hello.plaindonut`. För att förhindra detta kan du lägga till en skyddsmekanism så att huvudskriptet körs endast en gång. Uppdatera `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` är ett Vim-kommando för att stoppa körningen av resten av skriptet. Uttrycket `"did_load_filetypes"` är *inte* en inbyggd Vim-funktion. Det är faktiskt en global variabel från `$VIMRUNTIME/filetype.vim`. Om du är nyfiken, kör `:e $VIMRUNTIME/filetype.vim`. Du kommer att hitta dessa rader inuti:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

När Vim anropar denna fil definierar den variabeln `did_load_filetypes` och sätter den till 1. 1 är sanningsenlig i Vim. Du bör läsa resten av `filetype.vim` också. Se om du kan förstå vad den gör när Vim anropar den.

### Filtypsskript

Låt oss lära oss hur man detekterar och tilldelar en filtyp baserat på filinnehåll.

Anta att du har en samling filer utan ett överenskommet tillägg. Det enda som dessa filer har gemensamt är att de alla börjar med ordet "donutify" på den första raden. Du vill tilldela dessa filer en `donut` filtyp. Skapa nya filer som heter `sugardonut`, `glazeddonut` och `frieddonut` (utan tillägg). Inuti varje fil, lägg till denna rad:

```shell
donutify
```

När du kör `:set filetype?` från inuti `sugardonut`, vet Vim inte vilken filtyp som ska tilldelas denna fil. Den returnerar `filetype=`.

I körrotkatalogen, lägg till en `scripts.vim`-fil (`~/.vim/scripts.vim`). Inuti den, lägg till dessa:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

Funktionen `getline(1)` returnerar texten på den första raden. Den kontrollerar om den första raden börjar med ordet "donutify". Funktionen `did_filetype()` är en inbyggd Vim-funktion. Den kommer att returnera sant när en filtyprelaterad händelse har utlösts minst en gång. Den används som en skyddsmekanism för att stoppa omkörning av filtyp-händelsen.

Öppna filen `sugardonut` och kör `:set filetype?`, Vim returnerar nu `filetype=donut`. Om du öppnar andra donut-filer (`glazeddonut` och `frieddonut`), identifierar Vim också deras filtyper som `donut`-typer.

Observera att `scripts.vim` endast körs när Vim öppnar en fil med en okänd filtyp. Om Vim öppnar en fil med en känd filtyp, kommer `scripts.vim` inte att köras.

## Filtyp-plugin

Vad händer om du vill att Vim ska köra skript specifika för chocodonut när du öppnar en chocodonut-fil och inte köra dessa skript när du öppnar en plaindonut-fil?

Du kan göra detta med filtyp-plugin-körsökvägen (`~/.vim/ftplugin/`). Vim letar inuti denna katalog efter en fil med samma namn som den filtyp du just öppnade. Skapa en `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

Skapa en annan ftplugin-fil, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

Nu varje gång du öppnar en filtyp av chocodonut, kör Vim skripten från `~/.vim/ftplugin/chocodonut.vim`. Varje gång du öppnar en filtyp av plaindonut, kör Vim skripten från `~/.vim/ftplugin/plaindonut.vim`.

En varning: dessa filer körs varje gång en buffertfiltyp sätts (`set filetype=chocodonut` till exempel). Om du öppnar 3 olika chocodonut-filer, kommer skripten att köras *totalt* tre gånger.

## Indentfiler

Vim har en indenteringskörsökväg som fungerar på liknande sätt som ftplugin, där Vim letar efter en fil med samma namn som den öppnade filtypen. Syftet med dessa indenteringskörsökvägar är att lagra indenteringsrelaterad kod. Om du har filen `~/.vim/indent/chocodonut.vim`, kommer den endast att köras när du öppnar en filtyp av chocodonut. Du kan lagra indenteringsrelaterad kod för chocodonut-filer här.

## Färger

Vim har en färgkörsökväg (`~/.vim/colors/`) för att lagra färgscheman. Alla filer som går in i katalogen kommer att visas i kommandorads kommandot `:color`.

Om du har en `~/.vim/colors/beautifulprettycolors.vim`-fil, när du kör `:color` och trycker på Tab, kommer du att se `beautifulprettycolors` som ett av färgalternativen. Om du föredrar att lägga till ditt eget färgschema, är detta platsen att gå till.

Om du vill kolla in färgscheman som andra har gjort, är en bra plats att besöka [vimcolors](https://vimcolors.com/).

## Syntaxmarkering

Vim har en syntaxkörsökväg (`~/.vim/syntax/`) för att definiera syntaxmarkering.

Anta att du har en `hello.chocodonut`-fil, inuti den har du följande uttryck:

```shell
(donut "tasty")
(donut "savory")
```

Även om Vim nu vet den korrekta filtypen, har all text samma färg. Låt oss lägga till en syntaxmarkeringregel för att markera "donut"-nyckelordet. Skapa en ny chocodonut-syntaxfil, `~/.vim/syntax/chocodonut.vim`. Inuti den lägger du till:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Öppna nu filen `hello.chocodonut` igen. Nyckelorden `donut` är nu markerade.

Detta kapitel kommer inte att gå igenom syntaxmarkering i detalj. Det är ett stort ämne. Om du är nyfiken, kolla in `:h syntax.txt`.

Pluginet [vim-polyglot](https://github.com/sheerun/vim-polyglot) är ett utmärkt plugin som tillhandahåller markeringar för många populära programmeringsspråk.

## Dokumentation

Om du skapar ett plugin, måste du skapa din egen dokumentation. Du använder körsökvägen doc för det.

Låt oss skapa en grundläggande dokumentation för chocodonut och plaindonut-nyckelord. Skapa en `donut.txt` (`~/.vim/doc/donut.txt`). Inuti, lägg till dessa texter:

```shell
*chocodonut* Läckert chokladdonut

*plaindonut* Ingen choco-godhet men fortfarande läcker ändå
```

Om du försöker söka efter `chocodonut` och `plaindonut` (`:h chocodonut` och `:h plaindonut`), kommer du inte att hitta något.

Först måste du köra `:helptags` för att generera nya hjälpavsnitt. Kör `:helptags ~/.vim/doc/`

Nu om du kör `:h chocodonut` och `:h plaindonut`, kommer du att hitta dessa nya hjälpavsnitt. Observera att filen nu är skrivskyddad och har en "hjälp"-filtyp.
## Lazy Loading Scripts

Alla runtime-sökvägar som du lärde dig i det här kapitlet kördes automatiskt. Om du vill ladda ett skript manuellt, använd autoload-runtime-sökvägen.

Skapa en autoload-katalog (`~/.vim/autoload/`). Inuti den katalogen, skapa en ny fil och namnge den `tasty.vim` (`~/.vim/autoload/tasty.vim`). Inuti den:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Observera att funktionsnamnet är `tasty#donut`, inte `donut()`. Pundtecknet (`#`) är nödvändigt när du använder autoload-funktionen. Namngivningskonventionen för autoload-funktionen är:

```shell
function fileName#functionName()
  ...
endfunction
```

I det här fallet är filnamnet `tasty.vim` och funktionsnamnet är (tekniskt sett) `donut`.

För att anropa en funktion behöver du kommandot `call`. Låt oss kalla den funktionen med `:call tasty#donut()`.

Första gången du anropar funktionen, bör du se *båda* echo-meddelandena ("tasty.vim global" och "tasty#donut"). De efterföljande anropen till `tasty#donut`-funktionen kommer endast att visa "testy#donut" echo.

När du öppnar en fil i Vim, till skillnad från de tidigare runtime-sökvägarna, laddas autoload-skript inte automatiskt. Endast när du uttryckligen anropar `tasty#donut()`, letar Vim efter filen `tasty.vim` och laddar allt inuti den, inklusive funktionen `tasty#donut()`. Autoload är den perfekta mekanismen för funktioner som använder omfattande resurser men som du inte använder ofta.

Du kan lägga till så många nästlade kataloger med autoload som du vill. Om du har runtime-sökvägen `~/.vim/autoload/one/two/three/tasty.vim`, kan du anropa funktionen med `:call one#two#three#tasty#donut()`.

## After Scripts

Vim har en efter-runtime-sökväg (`~/.vim/after/`) som speglar strukturen av `~/.vim/`. Allt i denna sökväg körs sist, så utvecklare använder vanligtvis dessa sökvägar för skriptöverskrivningar.

Till exempel, om du vill skriva över skripten från `plugin/chocolate.vim`, kan du skapa `~/.vim/after/plugin/chocolate.vim` för att lägga in överskrivningsskripten. Vim kommer att köra `~/.vim/after/plugin/chocolate.vim` *efter* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

Vim har en miljövariabel `$VIMRUNTIME` för standard skript och stödfiler. Du kan kolla det genom att köra `:e $VIMRUNTIME`.

Strukturen bör se bekant ut. Den innehåller många runtime-sökvägar du lärde dig i det här kapitlet.

Kom ihåg i kapitel 21, lärde du dig att när du öppnar Vim, letar den efter vimrc-filer på sju olika platser. Jag sa att den sista platsen Vim kontrollerar är `$VIMRUNTIME/defaults.vim`. Om Vim misslyckas med att hitta några användar-vimrc-filer, använder Vim en `defaults.vim` som vimrc.

Har du någonsin försökt köra Vim utan syntax-plugin som vim-polyglot och ändå är din fil fortfarande syntaktiskt markerad? Det beror på att när Vim misslyckas med att hitta en syntaxfil från runtime-sökvägen, letar Vim efter en syntaxfil från `$VIMRUNTIME` syntaxkatalogen.

För att lära dig mer, kolla in `:h $VIMRUNTIME`.

## Runtimepath Option

För att kontrollera din runtimepath, kör `:set runtimepath?`

Om du använder Vim-Plug eller populära externa pluginhanterare, bör det visa en lista över kataloger. Till exempel, min visar:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

En av de saker pluginhanterare gör är att lägga till varje plugin i runtime-sökvägen. Varje runtime-sökväg kan ha sin egen katalogstruktur liknande `~/.vim/`.

Om du har en katalog `~/box/of/donuts/` och du vill lägga till den katalogen till din runtime-sökväg, kan du lägga till detta till din vimrc:

```shell
set rtp+=$HOME/box/of/donuts/
```

Om du har en plugin-katalog (`~/box/of/donuts/plugin/hello.vim`) och en ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`) inuti `~/box/of/donuts/`, kommer Vim att köra alla skript från `plugin/hello.vim` när du öppnar Vim. Vim kommer också att köra `ftplugin/chocodonut.vim` när du öppnar en chocodonut-fil.

Prova detta själv: skapa en godtycklig sökväg och lägg till den i din runtimepath. Lägg till några av de runtime-sökvägar du lärde dig från det här kapitlet. Se till att de fungerar som förväntat.

## Learn Runtime the Smart Way

Ta din tid att läsa det och experimentera med dessa runtime-sökvägar. För att se hur runtime-sökvägar används i verkligheten, gå till repositoryn för en av dina favorit Vim-plugins och studera dess katalogstruktur. Du bör nu kunna förstå de flesta av dem. Försök att följa med och urskilja den stora bilden. Nu när du förstår Vims katalogstruktur, är du redo att lära dig Vimscript.