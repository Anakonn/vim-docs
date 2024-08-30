---
description: Denna kapitel ger en introduktion till snabb sökning i Vim, både utan
  och med fzf.vim-plugin, för att öka din produktivitet i redigeringsarbetet.
title: Ch03. Searching Files
---

Målet med detta kapitel är att ge dig en introduktion till hur man söker snabbt i Vim. Att kunna söka snabbt är ett utmärkt sätt att kickstarta din produktivitet i Vim. När jag kom på hur man snabbt söker i filer, bytte jag till att använda Vim på heltid.

Detta kapitel är indelat i två delar: hur man söker utan plugins och hur man söker med [fzf.vim](https://github.com/junegunn/fzf.vim) plugin. Låt oss börja!

## Öppna och redigera filer

För att öppna en fil i Vim kan du använda `:edit`.

```shell
:edit file.txt
```

Om `file.txt` finns, öppnas `file.txt`-buffern. Om `file.txt` inte finns, skapas en ny buffer för `file.txt`.

Autocompletion med `<Tab>` fungerar med `:edit`. Till exempel, om din fil ligger i en [Rails](https://rubyonrails.org/) *a*pp *c*ontroller *u*sers controller-katalog `./app/controllers/users_controllers.rb`, kan du använda `<Tab>` för att snabbt expandera termerna:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` accepterar wildcard-argument. `*` matchar alla filer i den aktuella katalogen. Om du bara letar efter filer med `.yml`-ändelse i den aktuella katalogen:

```shell
:edit *.yml<Tab>
```

Vim ger dig en lista över alla `.yml`-filer i den aktuella katalogen att välja mellan.

Du kan använda `**` för att söka rekursivt. Om du vill leta efter alla `*.md`-filer i ditt projekt, men du är osäker på i vilka kataloger, kan du göra så här:

```shell
:edit **/*.md<Tab>
```

`:edit` kan användas för att köra `netrw`, Vims inbyggda filutforskare. För att göra det, ge `:edit` ett katalogargument istället för en fil:

```shell
:edit .
:edit test/unit/
```

## Söka filer med Find

Du kan hitta filer med `:find`. Till exempel:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

Autocompletion fungerar också med `:find`:

```shell
:find p<Tab>                " för att hitta package.json
:find a<Tab>c<Tab>u<Tab>    " för att hitta app/controllers/users_controller.rb
```

Du kanske märker att `:find` ser ut som `:edit`. Vad är skillnaden?

## Find och Path

Skillnaden är att `:find` hittar filer i `path`, `:edit` gör det inte. Låt oss lära oss lite om `path`. När du lär dig hur du modifierar dina sökvägar kan `:find` bli ett kraftfullt sökverktyg. För att kontrollera vad dina sökvägar är, gör:

```shell
:set path?
```

Som standard ser dina förmodligen ut så här:

```shell
path=.,/usr/include,,
```

- `.` betyder att söka i katalogen för den för närvarande öppna filen.
- `,` betyder att söka i den aktuella katalogen.
- `/usr/include` är den typiska katalogen för C-bibliotekets headerfiler.

De två första är viktiga i vårt sammanhang och den tredje kan ignoreras för tillfället. Det viktiga här är att du kan modifiera dina egna sökvägar, där Vim kommer att leta efter filer. Låt oss anta att detta är din projektstruktur:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Om du vill gå till `users_controller.rb` från rotkatalogen, måste du gå igenom flera kataloger (och trycka på en betydande mängd tabbar). Ofta när du arbetar med ett ramverk spenderar du 90% av din tid i en viss katalog. I denna situation bryr du dig bara om att gå till `controllers/`-katalogen med minsta möjliga tangenttryckningar. Inställningen `path` kan förkorta den resan.

Du behöver lägga till `app/controllers/` till den aktuella `path`. Här är hur du kan göra det:

```shell
:set path+=app/controllers/
```

Nu när din sökväg är uppdaterad, när du skriver `:find u<Tab>`, kommer Vim nu att söka i `app/controllers/`-katalogen efter filer som börjar med "u".

Om du har en nästlad `controllers/`-katalog, som `app/controllers/account/users_controller.rb`, kommer Vim inte att hitta `users_controllers`. Istället behöver du lägga till `:set path+=app/controllers/**` för att autocompletion ska hitta `users_controller.rb`. Det här är bra! Nu kan du hitta användarkontrollern med 1 tryck på tab istället för 3.

Du kanske tänker på att lägga till hela projektkatalogerna så att när du trycker på `tab`, kommer Vim att söka överallt efter den filen, så här:

```shell
:set path+=$PWD/**
```

`$PWD` är den aktuella arbetskatalogen. Om du försöker lägga till hela ditt projekt till `path` i hopp om att göra alla filer nåbara vid ett `tab`-tryck, även om detta kan fungera för ett litet projekt, kommer detta att sakta ner din sökning avsevärt om du har ett stort antal filer i ditt projekt. Jag rekommenderar att du bara lägger till `path` för dina mest besökta filer/kataloger.

Du kan lägga till `set path+={din-sökväg-här}` i din vimrc. Att uppdatera `path` tar bara några sekunder och att göra det kan spara dig mycket tid.

## Söka i filer med Grep

Om du behöver söka i filer (hitta fraser i filer), kan du använda grep. Vim har två sätt att göra det:

- Intern grep (`:vim`. Ja, det stavas `:vim`. Det är en förkortning för `:vimgrep`).
- Extern grep (`:grep`).

Låt oss gå igenom intern grep först. `:vim` har följande syntax:

```shell
:vim /mönster/ fil
```

- `/mönster/` är ett regex-mönster för din sökterm.
- `fil` är filargumentet. Du kan skicka flera argument. Vim kommer att söka efter mönstret inuti filargumentet. Liknande som `:find`, kan du skicka det `*` och `**` wildcards.

Till exempel, för att leta efter alla förekomster av strängen "frukost" inuti alla ruby-filer (`.rb`) i `app/controllers/`-katalogen:

```shell
:vim /frukost/ app/controllers/**/*.rb
```

Efter att ha kört det, kommer du att omdirigeras till det första resultatet. Vims `vim` sökkommando använder `quickfix`-operationen. För att se alla sökresultat, kör `:copen`. Detta öppnar ett `quickfix`-fönster. Här är några användbara quickfix-kommandon för att få dig produktiv direkt:

```shell
:copen        Öppna quickfix-fönstret
:cclose       Stäng quickfix-fönstret
:cnext        Gå till nästa fel
:cprevious    Gå till föregående fel
:colder       Gå till den äldre fel-listan
:cnewer       Gå till den nyare fel-listan
```

För att lära dig mer om quickfix, kolla in `:h quickfix`.

Du kanske märker att körning av intern grep (`:vim`) kan bli långsam om du har ett stort antal träffar. Detta beror på att Vim laddar varje matchande fil i minnet, som om den redigerades. Om Vim hittar ett stort antal filer som matchar din sökning, kommer den att ladda dem alla och därmed konsumera en stor mängd minne.

Låt oss prata om extern grep. Som standard använder den terminalkommandot `grep`. För att söka efter "lunch" inuti en ruby-fil i `app/controllers/`-katalogen kan du göra så här:

```shell
:grep -R "lunch" app/controllers/
```

Observera att istället för att använda `/mönster/`, följer den terminalgrep-syntaxen `"mönster"`. Den visar också alla träffar med hjälp av `quickfix`.

Vim definierar variabeln `grepprg` för att bestämma vilket externt program som ska köras när man kör `:grep` Vim-kommandot så att du inte behöver stänga Vim och anropa terminalens `grep`-kommando. Senare kommer jag att visa dig hur du ändrar det standardprogram som anropas när du använder `:grep` Vim-kommandot.

## Bläddra i filer med Netrw

`netrw` är Vims inbyggda filutforskare. Det är användbart för att se en projekts hierarki. För att köra `netrw`, behöver du dessa två inställningar i din `.vimrc`:

```shell
set nocp
filetype plugin on
```

Eftersom `netrw` är ett stort ämne, kommer jag bara att täcka grundläggande användning, men det borde vara tillräckligt för att få dig igång. Du kan starta `netrw` när du startar Vim genom att ge den en katalog som parameter istället för en fil. Till exempel:

```shell
vim .
vim src/client/
vim app/controllers/
```

För att starta `netrw` inifrån Vim kan du använda kommandot `:edit` och ge den ett katalogargument istället för ett filnamn:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Det finns andra sätt att starta `netrw`-fönstret utan att ge en katalog:

```shell
:Explore     Startar netrw på den aktuella filen
:Sexplore    Ingen skämt. Startar netrw på den övre halvan av skärmen
:Vexplore    Startar netrw på den vänstra halvan av skärmen
```

Du kan navigera i `netrw` med Vims rörelser (rörelser kommer att täckas ingående i ett senare kapitel). Om du behöver skapa, ta bort eller döpa om en fil eller katalog, här är en lista över användbara `netrw`-kommandon:

```shell
%    Skapa en ny fil
d    Skapa en ny katalog
R    Döp om en fil eller katalog
D    Ta bort en fil eller katalog
```

`:h netrw` är mycket omfattande. Kolla in det om du har tid.

Om du tycker att `netrw` är för trist och behöver mer smak, är [vim-vinegar](https://github.com/tpope/vim-vinegar) en bra plugin för att förbättra `netrw`. Om du letar efter en annan filutforskare, är [NERDTree](https://github.com/preservim/nerdtree) ett bra alternativ. Kolla in dem!

## Fzf

Nu när du har lärt dig hur man söker filer i Vim med inbyggda verktyg, låt oss lära oss hur man gör det med plugins.

En sak som moderna textredigerare gör rätt och som Vim inte gör är hur enkelt det är att hitta filer, särskilt via fuzzy search. I denna andra halva av kapitlet kommer jag att visa dig hur du använder [fzf.vim](https://github.com/junegunn/fzf.vim) för att göra sökningen i Vim enkel och kraftfull.

## Installation

Först, se till att du har laddat ner [fzf](https://github.com/junegunn/fzf) och [ripgrep](https://github.com/BurntSushi/ripgrep). Följ instruktionerna på deras github-repo. Kommandona `fzf` och `rg` bör nu vara tillgängliga efter lyckad installation.

Ripgrep är ett sökverktyg mycket likt grep (därav namnet). Det är generellt snabbare än grep och har många användbara funktioner. Fzf är en allmän kommandorads fuzzy finder. Du kan använda det med alla kommandon, inklusive ripgrep. Tillsammans utgör de en kraftfull kombination av sökverktyg.

Fzf använder inte ripgrep som standard, så vi behöver berätta för fzf att använda ripgrep genom att definiera en variabel `FZF_DEFAULT_COMMAND`. I min `.zshrc` (`.bashrc` om du använder bash), har jag dessa:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Lägg märke till `-m` i `FZF_DEFAULT_OPTS`. Denna option tillåter oss att göra flera val med `<Tab>` eller `<Shift-Tab>`. Du behöver inte denna rad för att få fzf att fungera med Vim, men jag tycker att det är en användbar option att ha. Det kommer att komma till nytta när du vill utföra sök och ersätt i flera filer, vilket jag kommer att täcka strax. Fzf-kommandot accepterar många fler alternativ, men jag kommer inte att täcka dem här. För att lära dig mer, kolla in [fzf:s repo](https://github.com/junegunn/fzf#usage) eller `man fzf`. Som minimum bör du ha `export FZF_DEFAULT_COMMAND='rg'`.

Efter att ha installerat fzf och ripgrep, låt oss ställa in fzf-pluginet. Jag använder [vim-plug](https://github.com/junegunn/vim-plug) pluginhanterare i detta exempel, men du kan använda vilken pluginhanterare som helst.

Lägg till dessa i din `.vimrc` plugins. Du behöver använda [fzf.vim](https://github.com/junegunn/fzf.vim) plugin (skapad av samma fzf-författare).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Efter att ha lagt till dessa rader, behöver du öppna `vim` och köra `:PlugInstall`. Det kommer att installera alla plugins som är definierade i din `vimrc`-fil och som inte är installerade. I vårt fall kommer det att installera `fzf.vim` och `fzf`.

För mer information om denna plugin kan du kolla in [fzf.vim repo](https://github.com/junegunn/fzf/blob/master/README-VIM.md).
## Fzf Syntax

För att använda fzf effektivt bör du lära dig lite grundläggande fzf-syntax. Lyckligtvis är listan kort:

- `^` är en prefix exakt matchning. För att söka efter en fras som börjar med "välkommen": `^välkommen`.
- `$` är en suffix exakt matchning. För att söka efter en fras som slutar med "mina vänner": `vänner$`.
- `'` är en exakt matchning. För att söka efter frasen "välkommen mina vänner": `'välkommen mina vänner`.
- `|` är en "eller" matchning. För att söka efter antingen "vänner" eller "fiender": `vänner | fiender`.
- `!` är en invers matchning. För att söka efter fras som innehåller "välkommen" men inte "vänner": `välkommen !vänner`

Du kan blanda och matcha dessa alternativ. Till exempel, `^hej | ^välkommen vänner$` kommer att söka efter frasen som börjar med antingen "välkommen" eller "hej" och slutar med "vänner".

## Hitta Filer

För att söka efter filer inuti Vim med hjälp av fzf.vim-pluginet kan du använda metoden `:Files`. Kör `:Files` från Vim och du kommer att bli ombedd med fzf sökprompt.

Eftersom du kommer att använda detta kommando ofta är det bra att ha detta mappat till en tangentbordsgenväg. Jag mappar min till `Ctrl-f`. I min vimrc har jag detta:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Hitta i Filer

För att söka inuti filer kan du använda kommandot `:Rg`.

Återigen, eftersom du förmodligen kommer att använda detta ofta, låt oss mappa det till en tangentbordsgenväg. Jag mappar min till `<Leader>f`. `<Leader>`-tangenten är mappad till `\` som standard.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Andra Sökningar

Fzf.vim tillhandahåller många andra sökkommandon. Jag kommer inte att gå igenom var och en av dem här, men du kan kolla in dem [här](https://github.com/junegunn/fzf.vim#commands).

Här är hur mina fzf-mappningar ser ut:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Ersätta Grep Med Rg

Som nämnts tidigare har Vim två sätt att söka i filer: `:vim` och `:grep`. `:grep` använder ett externt sökverktyg som du kan omdefiniera med hjälp av nyckelordet `grepprg`. Jag kommer att visa dig hur du konfigurerar Vim för att använda ripgrep istället för terminalgrep när du kör kommandot `:grep`.

Nu låt oss ställa in `grepprg` så att kommandot `:grep` i Vim använder ripgrep. Lägg till detta i din vimrc:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Känn dig fri att modifiera några av alternativen ovan! För mer information om vad alternativen ovan betyder, kolla in `man rg`.

Efter att du har uppdaterat `grepprg`, nu när du kör `:grep`, körs `rg --vimgrep --smart-case --follow` istället för `grep`. Om du vill söka efter "donut" med hjälp av ripgrep kan du nu köra ett mer koncist kommando `:grep "donut"` istället för `:grep "donut" . -R`.

Precis som det gamla `:grep`, använder detta nya `:grep` också quickfix för att visa resultat.

Du kanske undrar, "Nåväl, detta är trevligt men jag har aldrig använt `:grep` i Vim, plus kan jag inte bara använda `:Rg` för att hitta fraser i filer? När kommer jag någonsin att behöva använda `:grep`?

Det är en mycket bra fråga. Du kan behöva använda `:grep` i Vim för att göra sök och ersätt i flera filer, vilket jag kommer att täcka nästa.

## Sök och Ersätt i Flera Filer

Moderna textredigerare som VSCode gör det mycket enkelt att söka och ersätta en sträng över flera filer. I denna sektion kommer jag att visa dig två olika metoder för att enkelt göra det i Vim.

Den första metoden är att ersätta *alla* matchande fraser i ditt projekt. Du kommer att behöva använda `:grep`. Om du vill ersätta alla instanser av "pizza" med "donut", här är vad du gör:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Låt oss bryta ner kommandona:

1. `:grep pizza` använder ripgrep för att söka efter alla instanser av "pizza" (förresten, detta skulle fortfarande fungera även om du inte omdefinierade `grepprg` för att använda ripgrep. Du skulle behöva göra `:grep "pizza" . -R` istället för `:grep "pizza"`).
2. `:cfdo` utför vilket kommando du än skickar till alla filer i din quickfix-lista. I detta fall är ditt kommando substitutionskommandot `%s/pizza/donut/g`. Röret (`|`) är en kedjeoperatör. Kommandot `update` sparar varje fil efter substitution. Jag kommer att täcka substitutionskommandot mer ingående i ett senare kapitel.

Den andra metoden är att söka och ersätta i valda filer. Med denna metod kan du manuellt välja vilka filer du vill utföra sök-och-ersätt på. Här är vad du gör:

1. Rensa dina buffertar först. Det är avgörande att din buffertlista endast innehåller de filer du vill tillämpa ersättningen på. Du kan antingen starta om Vim eller köra kommandot `:%bd | e#` (`%bd` raderar alla buffertar och `e#` öppnar filen du just var på).
2. Kör `:Files`.
3. Välj alla filer du vill utföra sök-och-ersätt på. För att välja flera filer, använd `<Tab>` / `<Shift-Tab>`. Detta är endast möjligt om du har flaggan för flera (`-m`) i `FZF_DEFAULT_OPTS`.
4. Kör `:bufdo %s/pizza/donut/g | update`. Kommandot `:bufdo %s/pizza/donut/g | update` ser liknande ut som det tidigare `:cfdo %s/pizza/donut/g | update` kommandot. Skillnaden är att istället för att substituera alla quickfix-poster (`:cfdo`), substituerar du alla buffertposter (`:bufdo`).

## Lär Dig Söka på Det Smarta Sättet

Sökning är brödet och smöret i textredigering. Att lära sig att söka bra i Vim kommer att förbättra din textredigeringsarbetsflöde avsevärt.

Fzf.vim är en spelväxlare. Jag kan inte föreställa mig att använda Vim utan det. Jag tycker att det är mycket viktigt att ha ett bra sökverktyg när man börjar med Vim. Jag har sett människor kämpa med att övergå till Vim eftersom det verkar sakna kritiska funktioner som moderna textredigerare har, som en enkel och kraftfull sökfunktion. Jag hoppas att detta kapitel hjälper dig att göra övergången till Vim enklare.

Du har också just sett Vims utbyggbarhet i aktion - förmågan att utöka sökfunktionalitet med ett plugin och ett externt program. I framtiden, kom ihåg vilka andra funktioner du vill utöka Vim med. Sannolikheten är stor att det redan finns i Vim, någon har skapat ett plugin eller det finns ett program för det redan. Nästa kommer du att lära dig om ett mycket viktigt ämne i Vim: Vims grammatik.