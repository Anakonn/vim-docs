---
description: Lär dig om mitt första Vim-plugin, totitle-vim, som automatiskt formaterar
  rubriker i titelstil och förbättrar ditt skrivande i Vim.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

När du börjar bli bra på Vim, kanske du vill skriva dina egna plugins. Jag skrev nyligen min första Vim-plugin, [totitle-vim](https://github.com/iggredible/totitle-vim). Det är en titelcase-operator-plugin, liknande Vims versal `gU`, gemen `gu`, och togglecase `g~` operatorer.

I det här kapitlet kommer jag att presentera en nedbrytning av `totitle-vim` pluginen. Jag hoppas kunna belysa processen och kanske inspirera dig att skapa din egen unika plugin!

## Problemet

Jag använder Vim för att skriva mina artiklar, inklusive denna guide.

Ett huvudproblem var att skapa en korrekt titelcase för rubrikerna. Ett sätt att automatisera detta är att kapitalisera varje ord i rubriken med `g/^#/ s/\<./\u\0/g`. För grundläggande användning var detta kommando tillräckligt bra, men det är fortfarande inte lika bra som att ha en faktisk titelcase. Orden "The" och "Of" i "Capitalize The First Letter Of Each Word" bör kapitaliseras. Utan korrekt kapitalisering ser meningen lite felaktig ut.

Till en början planerade jag inte att skriva en plugin. Det visar sig också att det redan finns en titelcase-plugin: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Men det fanns några saker som inte fungerade riktigt som jag ville. Den främsta var blockvisuellt läge beteende. Om jag har frasen:

```shell
test title one
test title two
test title three
```

Om jag använder en blockvisuell markering på "tle":

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Om jag trycker på `gt`, kommer pluginen inte att kapitalisera det. Jag tycker att det är inkonsekvent med beteendena hos `gu`, `gU`, och `g~`. Så jag bestämde mig för att arbeta utifrån det titelcase-plugin-repot och använda det till en titelcase-plugin själv som är konsekvent med `gu`, `gU`, och `g~`!. Återigen, vim-titlecase pluginen i sig är en utmärkt plugin och värd att användas på egen hand (sanningen är, kanske ville jag djupt inne bara skriva min egen Vim-plugin. Jag kan verkligen inte se blockvisuellt titelcase-funktion användas så ofta i verkliga livet förutom i undantagsfall).

### Planering för pluginen

Innan jag skriver den första raden kod, behöver jag bestämma vad titelcase-reglerna är. Jag hittade en snygg tabell med olika kapitaliseringsregler från [titlecaseconverter-sidan](https://titlecaseconverter.com/rules/). Visste du att det finns minst 8 olika kapitaliseringsregler på engelska? *Gasp!*

I slutändan använde jag de gemensamma nämnarna från den listan för att komma upp med en tillräckligt bra grundregel för pluginen. Dessutom tvivlar jag på att folk kommer att klaga, "Hej man, du använder AMA, varför använder du inte APA?". Här är de grundläggande reglerna:
- Första ordet är alltid versal.
- Vissa adverb, konjunktioner och prepositioner skrivs med gemen.
- Om det inmatade ordet är helt versalt, gör då ingenting (det kan vara en förkortning).

När det gäller vilka ord som skrivs med gemen, har olika regler olika listor. Jag bestämde mig för att hålla mig till `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Planering för användargränssnittet

Jag vill att pluginen ska vara en operator för att komplettera Vims befintliga case-operatörer: `gu`, `gU`, och `g~`. Som en operator måste den acceptera antingen en rörelse eller ett textobjekt (`gtw` bör titelcase nästa ord, `gtiw` bör titelcase det inre ordet, `gt$` bör titelcase orden från nuvarande plats till slutet av raden, `gtt` bör titelcase den aktuella raden, `gti(` bör titelcase orden inuti parenteser, etc). Jag vill också att den ska mappas till `gt` för enkel mnemonik. Dessutom bör den också fungera med alla visuella lägen: `v`, `V`, och `Ctrl-V`. Jag ska kunna markera det i *vilket som helst* visuellt läge, trycka på `gt`, så kommer all den markerade texten att bli titelcase.

## Vim Runtime

Det första du ser när du tittar på repot är att det har två kataloger: `plugin/` och `doc/`. När du startar Vim, letar den efter speciella filer och kataloger inuti `~/.vim` katalogen och kör alla skriptfiler inuti den katalogen. För mer, granska Vim Runtime-kapitlet.

Pluginen använder två Vim runtime-kataloger: `doc/` och `plugin/`. `doc/` är en plats för att lägga hjälp-dokumentationen (så du kan söka efter nyckelord senare, som `:h totitle`). Jag kommer att gå igenom hur man skapar en hjälpsida senare. För nu, låt oss fokusera på `plugin/`. Katalogen `plugin/` körs en gång när Vim startar. Det finns en fil inuti denna katalog: `totitle.vim`. Namnet spelar ingen roll (jag kunde ha döpt den till `whatever.vim` och den skulle fortfarande fungera). All koden som är ansvarig för att pluginen ska fungera finns inuti denna fil.

## Mappningar

Låt oss gå igenom koden!

I början av filen har du:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

När du startar Vim, kommer `g:totitle_default_keys` ännu inte att existera, så `!exists(...)` returnerar sant. I det fallet definiera `g:totitle_default_keys` till att vara 1. I Vim är 0 falskt och icke-noll är sant (använd 1 för att indikera sant).

Låt oss hoppa till botten av filen. Du kommer att se detta:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Detta är där den huvudsakliga `gt` mappningen definieras. I det här fallet, vid tidpunkten du kommer till `if` villkoren i botten av filen, skulle `if g:totitle_default_keys` returnera 1 (sant), så Vim utför följande kartor:
- `nnoremap <expr> gt ToTitle()` mappar normal läge *operator*. Detta låter dig köra operator + rörelse/text-objekt som `gtw` för att titelcase nästa ord eller `gtiw` för att titelcase det inre ordet. Jag kommer att gå igenom detaljerna om hur operator-mappningen fungerar senare.
- `xnoremap <expr> gt ToTitle()` mappar de visuella läge-operatörerna. Detta låter dig titelcase den text som är visuellt markerad.
- `nnoremap <expr> gtt ToTitle() .. '_'` mappar normal läge linjeoperator (analogt med `guu` och `gUU`). Du kanske undrar vad `.. '_'` gör i slutet. `..` är Vims stränginterpolationsoperator. `_` används som en rörelse med en operator. Om du tittar i `:help _`, står det att understreck används för att räkna 1 rad nedåt. Det utför en operator på den aktuella raden (försök med andra operatorer, försök köra `gU_` eller `d_`, märker att det gör samma sak som `gUU` eller `dd`).
- Slutligen, `<expr>` argumentet låter dig specificera räkningen, så du kan göra `3gtw` för att toggla case de nästa 3 orden.

Vad händer om du inte vill använda den förvalda `gt` mappningen? I slutändan, du åsidosätter Vims standard `gt` (tab nästa) mappning. Vad händer om du vill använda `gz` istället för `gt`? Kommer du ihåg tidigare hur du gick igenom besväret med att kontrollera `if !exists('g:totitle_default_keys')` och `if g:totitle_default_keys`? Om du lägger `let g:totitle_default_keys = 0` i din vimrc, då skulle `g:totitle_default_keys` redan existera när pluginen körs (koder i din vimrc körs innan `plugin/` runtime-filerna), så `!exists('g:totitle_default_keys')` returnerar falskt. Dessutom skulle `if g:totitle_default_keys` vara falskt (eftersom det skulle ha värdet 0), så det kommer inte heller att utföra `gt` mappningen! Detta låter dig effektivt definiera din egen anpassade mappning i Vimrc.

För att definiera din egen titelcase-mappning till `gz`, lägg till detta i din vimrc:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Lätt som en plätt.

## ToTitle-funktionen

`ToTitle()` funktionen är utan tvekan den längsta funktionen i denna fil.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " anropa detta när du kallar ToTitle() funktionen
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " spara de aktuella inställningarna
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " när användaren anropar en blockoperation
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " när användaren anropar en tecken- eller radoperation
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " återställ inställningarna
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Detta är väldigt långt, så låt oss bryta ner det.

*Jag skulle kunna refaktorera detta i mindre sektioner, men för att slutföra detta kapitel, lämnade jag det som det är.*
## Operatörsfunktionen

Här är den första delen av koden:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

Vad är egentligen `opfunc`? Varför returnerar det `g@`?

Vim har en speciell operator, operatörsfunktionen, `g@`. Denna operator låter dig använda *vilken som helst* funktion som tilldelas `opfunc`-alternativet. Om jag har funktionen `Foo()` tilldelad `opfunc`, då när jag kör `g@w`, kör jag `Foo()` på nästa ord. Om jag kör `g@i(`, kör jag `Foo()` på de inre parenteserna. Denna operatörsfunktion är avgörande för att skapa din egen Vim-operatör.

Följande rad tilldelar `opfunc` till `ToTitle`-funktionen.

```shell
set opfunc=ToTitle
```

Den nästa raden returnerar bokstavligen `g@`:

```shell
return g@
```

Så exakt hur fungerar dessa två rader och varför returnerar den `g@`?

Låt oss anta att du har följande mappning:

```shell
nnoremap <expr> gt ToTitle()`
```

Då trycker du på `gtw` (titla nästa ord). Första gången du kör `gtw`, anropar Vim `ToTitle()`-metoden. Men just nu är `opfunc` fortfarande tom. Du skickar inte heller något argument till `ToTitle()`, så den kommer att ha värdet `a:type` som `''`. Detta gör att det villkorliga uttrycket kontrollerar argumentet `a:type`, `if a:type ==# ''`, för att vara sant. Inuti tilldelar du `opfunc` till `ToTitle`-funktionen med `set opfunc=ToTitle`. Nu är `opfunc` tilldelad `ToTitle`. Slutligen, efter att du har tilldelat `opfunc` till `ToTitle`-funktionen, returnerar du `g@`. Jag kommer att förklara varför det returnerar `g@` nedan.

Du är inte klar än. Kom ihåg, du tryckte just på `gtw`. Att trycka på `gt` gjorde allt ovanstående, men du har fortfarande `w` att bearbeta. Genom att returnera `g@`, har du nu tekniskt sett `g@w` (detta är varför du har `return g@`). Eftersom `g@` är funktionsoperatören, skickar du `w`-rörelsen till den. Så Vim, när den får `g@w`, anropar `ToTitle` *en gång till* (oroa dig inte, du kommer inte att hamna i en oändlig loop som du kommer att se om en liten stund).

För att sammanfatta, genom att trycka på `gtw`, kontrollerar Vim om `opfunc` är tom eller inte. Om den är tom, kommer Vim att tilldela den till `ToTitle`. Sedan returnerar den `g@`, vilket i grunden anropar `ToTitle` en gång till så att du nu kan använda den som en operator. Detta är den knepigaste delen av att skapa en anpassad operator och du gjorde det! Nästa steg är att bygga logiken för `ToTitle()` för att faktiskt titla inmatningen.

## Bearbeta Inmatningen

Du har nu `gt` som fungerar som en operator som kör `ToTitle()`. Men vad gör du härnäst? Hur titlar du faktiskt texten?

När du kör någon operator i Vim, finns det tre olika typer av åtgärdsrörelser: tecken, rad och block. `g@w` (ord) är ett exempel på en teckenoperation. `g@j` (en rad ned) är ett exempel på en radoperation. Blockoperation är sällsynt, men typiskt när du gör `Ctrl-V` (visuellt block) operation, kommer det att räknas som en blockoperation. Operationer som riktar sig mot några tecken framåt / bakåt betraktas vanligtvis som teckenoperationer (`b`, `e`, `w`, `ge`, etc). Operationer som riktar sig mot några rader nedåt / uppåt betraktas vanligtvis som radoperationer (`j`, `k`). Operationer som riktar sig mot kolumner framåt, bakåt, uppåt eller nedåt betraktas vanligtvis som blockoperationer (de är vanligtvis antingen en kolumnär tvångsrörelse eller ett blockvisuellt läge; för mer: `:h forced-motion`).

Detta betyder, om du trycker på `g@w`, kommer `g@` att skicka en bokstavlig sträng `"char"` som ett argument till `ToTitle()`. Om du gör `g@j`, kommer `g@` att skicka en bokstavlig sträng `"line"` som ett argument till `ToTitle()`. Denna sträng är vad som kommer att skickas in i `ToTitle`-funktionen som `type`-argument.

## Skapa Din Egen Anpassade Funktionsoperator

Låt oss pausa och leka med `g@` genom att skriva en dummyfunktion:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Nu tilldela den funktionen till `opfunc` genom att köra:

```shell
:set opfunc=Test
```

Operatorn `g@` kommer att köra `Test(some_arg)` och skicka den med antingen `"char"`, `"line"` eller `"block"` beroende på vilken operation du gör. Kör olika operationer som `g@iw` (inre ord), `g@j` (en rad ned), `g@$` (till slutet av raden), etc. Se vilka olika värden som ekas. För att testa blockoperationen kan du använda Vims tvångsrörelse för blockoperationer: `g@Ctrl-Vj` (blockoperation en kolumn ned).

Du kan också använda det med det visuella läget. Använd de olika visuella markeringarna som `v`, `V` och `Ctrl-V` och tryck sedan på `g@` (var försiktig, det kommer att blinka utdataekot väldigt snabbt, så du behöver ha ett snabbt öga - men ekot är definitivt där. Dessutom, eftersom du använder `echom`, kan du kontrollera de inspelade ekomeddelandena med `:messages`).

Ganska coolt, eller hur? Det du kan programmera med Vim! Varför lärde de inte ut detta i skolan? Låt oss fortsätta med vår plugin.

## ToTitle Som en Funktion

Vi går vidare till de nästa raderna:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Denna rad har faktiskt ingenting att göra med `ToTitle()`-beteendet som en operator, utan för att möjliggöra det som en anropbar TitleCase-funktion (ja, jag vet att jag bryter mot principen om enstaka ansvar). Motivationen är, Vim har inbyggda `toupper()` och `tolower()`-funktioner som kommer att göra alla givna strängar versaler och gemener. Ex: `:echo toupper('hello')` returnerar `'HELLO'` och `:echo tolower('HELLO')` returnerar `'hello'`. Jag vill att denna plugin ska ha förmågan att köra `ToTitle` så att du kan göra `:echo ToTitle('once upon a time')` och få ett `'Once Upon a Time'` returvärde.

Vid det här laget vet du att när du anropar `ToTitle(type)` med `g@`, kommer `type`-argumentet att ha värdet antingen `'block'`, `'line'` eller `'char'`. Om argumentet varken är `'block'`, `'line'` eller `'char'`, kan du säkert anta att `ToTitle()` anropas utanför `g@`. I så fall delar du dem med vita utrymmen (`\s\+`) med:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Sedan kapitaliserar du varje element:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Innan du sätter ihop dem igen:

```shell
l:wordsArr->join(' ')
```

Funktionen `capitalize()` kommer att täckas senare.

## Temporära Variabler

De nästa raderna:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Dessa rader bevarar olika aktuella tillstånd i temporära variabler. Senare i detta kommer du att använda visuella lägen, markeringar och register. Att göra dessa kommer att påverka några tillstånd. Eftersom du inte vill revidera historien, behöver du spara dem i temporära variabler så att du kan återställa tillstånden senare.
## Stora valen

De följande raderna är viktiga:

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
Låt oss gå igenom dem i små bitar. Denna rad:

```shell
set clipboard= selection=inclusive
```

Du ställer först in `selection`-alternativet till att vara inkluderande och `clipboard` till att vara tom. Attributet för urval används vanligtvis med visuell läge och det finns tre möjliga värden: `old`, `inclusive` och `exclusive`. Att ställa in det som inkluderande innebär att den sista tecknet i urvalet inkluderas. Jag kommer inte att gå in på dem här, men poängen är att välja det som inkluderande gör att det beter sig konsekvent i visuell läge. Som standard ställer Vim in det som inkluderande, men du ställer in det här ändå ifall någon av dina plugins ställer in det till ett annat värde. Kolla in `:h 'clipboard'` och `:h 'selection'` om du är nyfiken på vad de verkligen gör.

Nästa har du denna konstiga hash följt av ett exekveringskommando:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Först, `#{}`-syntaxen är Vims ordboksdatatyp. Den lokala variabeln `l:commands` är en hash med 'lines', 'char' och 'block' som sina nycklar. Kommandot `silent exe '...'` exekverar vilket kommando som helst inuti strängen tyst (annars kommer det att visa meddelanden längst ner på din skärm).

För det andra, de exekverade kommandona är `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. Den första, `noautocmd`, kommer att exekvera det efterföljande kommandot utan att utlösa någon autokommand. Den andra, `keepjumps`, är för att inte registrera musrörelsen medan du rör dig. I Vim registreras vissa rörelser automatiskt i ändringslistan, hopp-listan och mark-listan. Detta förhindrar det. Poängen med att ha `noautocmd` och `keepjumps` är att förhindra bieffekter. Slutligen exekverar kommandot `normal` strängarna som normala kommandon. `..` är Vims stränginterpolationssyntax. `get()` är en getter-metod som accepterar antingen en lista, blob eller ordbok. I det här fallet skickar du den ordboken `l:commands`. Nyckeln är `a:type`. Du lärde dig tidigare att `a:type` är antingen en av de tre strängvärdena: 'char', 'line' eller 'block'. Så om `a:type` är 'line', kommer du att exekvera `"noautocmd keepjumps normal! '[V']y"` (för mer, kolla in `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal`, och `:h get()`).

Låt oss gå över vad `'[V']y` gör. Anta först att du har denna text:

```shell
den andra frukosten
är bättre än den första frukosten
```
Anta att din markör är på den första raden. Då trycker du `g@j` (kör operatorfunktionen, `g@`, en rad nedåt, med `j`). `'[` flyttar markören till början av den tidigare ändrade eller yankade texten. Även om du tekniskt sett inte ändrade eller yankade någon text med `g@j`, kommer Vim ihåg platserna för början och slutet av rörelserna i `g@`-kommandot med `'[` och `']` (för mer, kolla in `:h g@`). I ditt fall, när du trycker på `'[` flyttar din markör till den första raden eftersom det är där du började när du körde `g@`. `V` är ett kommandon för linjevisuellt läge. Slutligen flyttar `']` din markör till slutet av den tidigare ändrade eller yankade texten, men i det här fallet flyttar den din markör till slutet av din senaste `g@`-operation. Slutligen yankar `y` den valda texten.

Vad du just gjorde var att yankade samma text som du utförde `g@` på.

Om du tittar på de andra två kommandona här:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

De utför alla liknande åtgärder, förutom att istället för att använda linjevisa åtgärder, skulle du använda teckenvise eller blockvisa åtgärder. Jag kommer att låta som en upprepning, men i alla tre fallen yankar du effektivt samma text som du utförde `g@` på.

Låt oss titta på nästa rad:

```shell
let l:selected_phrase = getreg('"')
```

Denna rad hämtar innehållet i den namnlösa registret (`"`) och lagrar det i variabeln `l:selected_phrase`. Vänta lite... yankade du inte just en text? Det namnlösa registret innehåller för närvarande texten som du just yankade. Så här kan denna plugin få en kopia av texten.

Den nästa raden är ett reguljärt uttrycksmönster:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` och `\>` är mönster för ordgränser. Tecknet som följer `\<` matchar början av ett ord och tecknet som föregår `\>` matchar slutet av ett ord. `\k` är mönstret för nyckelord. Du kan kontrollera vilka tecken Vim accepterar som nyckelord med `:set iskeyword?`. Kom ihåg att `w`-rörelsen i Vim flyttar din markör ordvis. Vim kommer med en förutbestämd uppfattning om vad ett "nyckelord" är (du kan till och med redigera dem genom att ändra `iskeyword`-alternativet). Kolla in `:h /\<`, `:h /\>`, och `:h /\k`, och `:h 'iskeyword'` för mer. Slutligen betyder `*` noll eller fler av det efterföljande mönstret.

I det stora hela matchar `'\<\k*\>'` ett ord. Om du har en sträng:

```shell
ett två tre
```

Att matcha den mot mönstret kommer att ge dig tre träffar: "ett", "två" och "tre".

Slutligen har du ett annat mönster:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Kom ihåg att Vims ersättningskommando kan användas med ett uttryck med `\={ditt-uttryck}`. Till exempel, om du vill göra strängen "donut" versal i den aktuella raden, kan du använda Vims `toupper()`-funktion. Du kan uppnå detta genom att köra `:%s/donut/\=toupper(submatch(0))/g`. `submatch(0)` är ett speciellt uttryck som används i ersättningskommandot. Det returnerar hela den matchade texten.

De nästa två raderna:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

`line()`-uttrycket returnerar ett radnummer. Här skickar du det med markeringen `'<`, som representerar den första raden av det senaste valda visuella området. Kom ihåg att du använde visuell läge för att yankade texten. `'<` returnerar radnumret för början av det visuella urvalet. `virtcol()`-uttrycket returnerar ett kolumnnummer för den aktuella markören. Du kommer att flytta din markör överallt om en liten stund, så du behöver lagra din markörsposition så att du kan återvända hit senare.

Ta en paus här och gå igenom allt hittills. Se till att du fortfarande hänger med. När du är redo, låt oss fortsätta.
## Hantera en Blockoperation

Låt oss gå igenom denna sektion:

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Det är dags att faktiskt kapitalisera din text. Kom ihåg att du har `a:type` som antingen 'char', 'line' eller 'block'. I de flesta fall får du förmodligen 'char' och 'line'. Men ibland kan du få en block. Det är sällsynt, men det måste hanteras ändå. Tyvärr är hanteringen av en block inte lika enkel som hanteringen av char och line. Det kommer att ta lite extra ansträngning, men det är genomförbart.

Innan du börjar, låt oss ta ett exempel på hur du kan få en block. Anta att du har denna text:

```shell
pannkaka till frukost
pannkaka till lunch
pannkaka till middag
```

Anta att din markör är på "c" i "pannkaka" på den första raden. Du använder sedan den visuella blocken (`Ctrl-V`) för att välja neråt och framåt för att välja "kaka" i alla tre rader:

```shell
pan[kaka] till frukost
pan[kaka] till lunch
pan[kaka] till middag
```

När du trycker på `gt`, vill du få:

```shell
panKaka till frukost
panKaka till lunch
panKaka till middag

```
Här är dina grundläggande antaganden: när du markerar de tre "kakorna" i "pannkakor", säger du till Vim att du har tre rader av ord som du vill markera. Dessa ord är "kaka", "kaka" och "kaka". Du förväntar dig att få "Kaka", "Kaka" och "Kaka".

Låt oss gå vidare till implementationsdetaljerna. De nästa raderna har:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

Den första raden:

```shell
sil! keepj norm! gv"ad
```

Kom ihåg att `sil!` körs tyst och `keepj` behåller hopphistoriken när du rör dig. Du utför sedan kommandot norm `gv"ad`. `gv` markerar den senaste visuellt markerade texten (i pannkakeexemplet kommer det att återmarkera alla tre 'kakor'). `"ad` tar bort de visuellt markerade texterna och lagrar dem i register a. Som ett resultat har du nu:

```shell
pan till frukost
pan till lunch
pan till middag
```

Nu har du 3 *block* (inte rader) av 'kakor' lagrade i register a. Denna distinktion är viktig. Att yank en text med linjevisuellt läge är annorlunda än att yank en text med blockvisuellt läge. Håll detta i åtanke eftersom du kommer att se detta igen senare.

Nästa har du:

```shell
keepj $
keepj pu_
```

`$` flyttar dig till den sista raden i din fil. `pu_` infogar en rad under där din markör är. Du vill köra dem med `keepj` så att du inte ändrar hopphistoriken.

Sedan lagrar du radnumret för din sista rad (`line("$")`) i den lokala variabeln `lastLine`.

```shell
let l:lastLine = line("$")
```

Sedan klistrar du in innehållet från registret med `norm "ap`.

```shell
sil! keepj norm "ap
```

Tänk på att detta händer på den nya raden du skapade under den sista raden i filen - du är för närvarande i botten av filen. Klistra in ger dig dessa *block* texter:

```shell
kaka
kaka
kaka
```

Nästa, lagrar du platsen för den aktuella raden där din markör är.

```shell
let l:curLine = line(".")
```

Nu låt oss gå till de nästa raderna:

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Denna rad:

```shell
sil! keepj norm! VGg@
```

`VG` markerar dem visuellt med linjevisuellt läge från den aktuella raden till slutet av filen. Så här markerar du de tre blocken av 'kaka' texter med linjevisuellt markering (kom ihåg distinktionen mellan block och linje). Notera att första gången du klistrade in de tre "kaka" texterna, klistrade du in dem som block. Nu markerar du dem som rader. De kan se likadana ut utifrån, men internt vet Vim skillnaden mellan att klistra in block av texter och att klistra in rader av texter.

```shell
kaka
kaka
kaka
```

`g@` är funktionsoperatören, så du gör i grunden ett rekursivt anrop till sig själv. Men varför? Vad uppnår detta?

Du gör ett rekursivt anrop till `g@` och skickar det med alla 3 rader (efter att ha kört det med `V`, har du nu rader, inte block) av 'kaka' texter så att det kommer att hanteras av den andra delen av koden (du kommer att gå över detta senare). Resultatet av att köra `g@` är tre rader av korrekt titulerade texter:

```shell
Kaka
Kaka
Kaka
```

Den nästa raden:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Detta kör kommandot i normalt läge för att gå till början av raden (`0`), använda blockvisuellt markering för att gå till den sista raden och sista tecknet på den raden (`<c-v>G$`). `h` är för att justera markören (när du gör `$` flyttar Vim en extra rad till höger). Slutligen tar du bort den markerade texten och lagrar den i register a (`"ad`).

Den nästa raden:

```shell
exe "keepj " . l:startLine
```

Du flyttar din markör tillbaka till där `startLine` var.

Nästa:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

När du är i `startLine`-platsen, hoppar du nu till kolumnen markerad av `startCol`. `\<bar>\` är bar `|` rörelsen. Bar rörelsen i Vim flyttar din markör till den n:te kolumnen (låt oss säga att `startCol` var 4. Att köra `4|` kommer att få din markör att hoppa till kolumnpositionen 4). Kom ihåg att du `startCol` var platsen där du lagrade kolumnpositionen för texten du ville tituleras. Slutligen, `"aP` klistrar in texterna som lagrats i register a. Detta sätter tillbaka texten där den togs bort tidigare.

Låt oss titta på de nästa 4 raderna:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` flyttar din markör tillbaka till `lastLine`-platsen från tidigare. `sil! keepj norm! "_dG` tar bort det extra utrymmet som skapades med blackhole-registret (`"_dG`) så att ditt namnlösa register förblir rent. `exe "keepj " . l:startLine` flyttar din markör tillbaka till `startLine`. Slutligen, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` flyttar din markör till `startCol` kolumnen.

Detta är alla åtgärder du skulle ha kunnat göra manuellt i Vim. Men fördelen med att göra dessa åtgärder till återanvändbara funktioner är att de kommer att spara dig från att köra 30+ rader av instruktioner varje gång du behöver tituleras något. Poängen här är, allt som du kan göra manuellt i Vim, kan du göra till en återanvändbar funktion, därmed ett plugin!

Här är hur det skulle se ut.

Givet lite text:

```shell
pannkaka till frukost
pannkaka till lunch
pannkaka till middag

... lite text
```

Först markerar du det visuellt blockvis:

```shell
pan[kaka] till frukost
pan[kaka] till lunch
pan[kaka] till middag

... lite text
```

Sedan tar du bort det och lagrar den texten i register a:

```shell
pan till frukost
pan till lunch
pan till middag

... lite text
```

Sedan klistrar du in det i botten av filen:

```shell
pan till frukost
pan till lunch
pan till middag

... lite text
kaka
kaka
kaka
```

Sedan kapitaliserar du det:

```shell
pan till frukost
pan till lunch
pan till middag

... lite text
Kaka
Kaka
Kaka
```

Slutligen sätter du tillbaka den kapitaliserade texten:

```shell
panKaka till frukost
panKaka till lunch
panKaka till middag

... lite text
```

## Hantera Rad- och Teckenoperationer

Du är inte klar än. Du har bara adresserat det speciella fallet när du kör `gt` på blocktexter. Du måste fortfarande hantera 'rad' och 'tecken' operationer. Låt oss titta på `else`-koden för att se hur detta görs.

Här är koderna:

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

Låt oss gå igenom dem rad för rad. Den hemliga såsen i detta plugin ligger faktiskt på denna rad:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` innehåller texten från det namnlösa registret som ska tituleras. `l:WORD_PATTERN` är den individuella nyckelordmatchningen. `l:UPCASE_REPLACEMENT` är anropet till kommandot `capitalize()` (som du kommer att se senare). Den `'g'` är den globala flaggan som instruerar substitueringskommandot att ersätta alla givna ord, inte bara det första ordet.

Den nästa raden:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Detta säkerställer att det första ordet alltid kommer att kapitaliseras. Om du har en fras som "ett äpple om dagen håller doktorn borta", eftersom det första ordet, "ett", är ett speciellt ord, kommer ditt substitueringskommando inte att kapitalisera det. Du behöver en metod som alltid kapitaliserar den första karaktären oavsett vad. Denna funktion gör just det (du kommer att se denna funktionsdetalj senare). Resultatet av dessa kapitaliseringsmetoder lagras i den lokala variabeln `l:titlecased`.

Den nästa raden:

```shell
call setreg('"', l:titlecased)
```

Detta sätter den kapitaliserade strängen i det namnlösa registret (`"`).

Nästa, följande två rader:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Hej, det där ser bekant ut! Du har sett ett liknande mönster tidigare med `l:commands`. Istället för yank, här använder du klistra in (`p`). Kolla in den tidigare sektionen där jag gick över `l:commands` för en påminnelse.

Slutligen, dessa två rader:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Du flyttar din markör tillbaka till raden och kolumnen där du började. Det är allt!

Låt oss sammanfatta. Den ovanstående substitueringsmetoden är smart nog att kapitalisera de givna texterna och hoppa över de speciella orden (mer om detta senare). Efter att du har en titulerad sträng, lagrar du dem i det namnlösa registret. Sedan markerar du exakt samma text som du opererade `g@` på tidigare, och klistrar sedan in från det namnlösa registret (detta ersätter effektivt de icke-titulerade texterna med den titulerade versionen). Slutligen flyttar du din markör tillbaka till där du började.
## Rensningar

Du är tekniskt klar. Texterna är nu titulerade. Allt som återstår är att återställa registren och inställningarna.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Dessa återställer:
- det namnlösa registret.
- `<` och `>` markeringarna.
- `'clipboard'` och `'selection'` alternativen.

Puh, du är klar. Det var en lång funktion. Jag skulle ha kunnat göra funktionen kortare genom att dela upp den i mindre, men för nu får det räcka. Låt oss nu kort gå igenom kapitaliseringsfunktionerna.

## Kapitaliseringsfunktionen

I detta avsnitt går vi igenom `s:capitalize()` funktionen. Så här ser funktionen ut:

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

Kom ihåg att argumentet för `capitalize()` funktionen, `a:string`, är det individuella ordet som skickas av `g@` operatören. Så om jag kör `gt` på texten "pannkaka till frukost", kommer `ToTitle` att anropa `capitalize(string)` *tre* gånger, en gång för "pannkaka", en gång för "till", och en gång för "frukost".

Den första delen av funktionen är:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

Det första villkoret (`toupper(a:string) ==# a:string`) kontrollerar om den versaliserade versionen av argumentet är densamma som strängen och om strängen själv är "A". Om dessa är sanna, returnera den strängen. Detta baseras på antagandet att om ett givet ord redan är helt versaliserat, så är det en förkortning. Till exempel, ordet "VD" skulle annars konverteras till "Vd". Hmm, din VD kommer inte att vara glad. Så det är bäst att lämna alla helt versaliserade ord ifred. Det andra villkoret, `a:string != 'A'`, tar upp ett specialfall för ett kapitaliserat "A" tecken. Om `a:string` redan är ett kapitaliserat "A", skulle det av misstag ha passerat testet `toupper(a:string) ==# a:string`. Eftersom "a" är en obestämd artikel på engelska, behöver det vara gemener.

Nästa del tvingar strängen att bli gemener:

```shell
let l:str = tolower(a:string)
```

Nästa del är en regex av en lista över alla ord som ska uteslutas. Jag fick dem från https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

Nästa del:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Först, kontrollera om din sträng är en del av den uteslutna ordlistan (`l:exclusions`). Om den är det, kapitalisera den inte. Kontrollera sedan om din sträng är en del av den lokala uteslutningslistan (`s:local_exclusion_list`). Denna uteslutningslista är en anpassad lista som användaren kan lägga till i vimrc (om användaren har ytterligare krav på speciella ord).

Den sista delen returnerar den kapitaliserade versionen av ordet. Den första karaktären görs versal medan resten förblir som den är.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Låt oss gå igenom den andra kapitaliseringsfunktionen. Funktionen ser ut så här:

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

Denna funktion skapades för att hantera ett specialfall om du har en mening som börjar med ett uteslutet ord, som "en äpple om dagen håller doktorn borta". Baserat på engelska språkets kapitaliseringsregler måste alla första ord i en mening, oavsett om det är ett speciellt ord eller inte, kapitaliseras. Med din `substitute()` kommando ensam, skulle "en" i din mening bli gemener. Du behöver tvinga den första karaktären att bli versal.

I denna `capitalizeFirstWord` funktion är argumentet `a:string` inte ett individuellt ord som `a:string` inuti `capitalize` funktionen, utan istället hela texten. Så om du har "pannkaka till frukost", är värdet av `a:string` "pannkaka till frukost". Den kör endast `capitalizeFirstWord` en gång för hela texten.

Ett scenario du behöver vara uppmärksam på är om du har en fler-radig sträng som "en äpple om dagen\nhåller doktorn borta". Du vill kapitalisera den första karaktären i alla rader. Om du inte har radbrytningar, kapitalisera helt enkelt den första karaktären.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Om du har radbrytningar, behöver du kapitalisera alla första karaktärer i varje rad, så du delar dem i en array separerad av radbrytningar:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Sedan mappar du varje element i arrayen och kapitaliserar det första ordet i varje element:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Slutligen sätter du ihop arrayens element:

```shell
return l:lineArr->join("\n")
```

Och du är klar!

## Dokumentation

Den andra katalogen i arkivet är `docs/` katalogen. Det är bra att ge pluginet en grundlig dokumentation. I detta avsnitt går jag kort igenom hur man gör sin egen plugin-dokumentation.

`docs/` katalogen är en av Vims speciella körvägar. Vim läser alla filer inuti `docs/`, så när du söker efter ett speciellt nyckelord och det nyckelordet hittas i en av filerna i `docs/` katalogen, kommer det att visas på hjälpsidan. Här har du en `totitle.txt`. Jag namnger den så eftersom det är pluginets namn, men du kan namnge den vad du vill.

En Vim-dokumentsfil är i grunden en txt-fil. Skillnaden mellan en vanlig txt-fil och en Vim-hjälpfiler är att den senare använder speciella "hjälp"-syntaxer. Men först måste du berätta för Vim att behandla den som en `help` filtyp, inte som en textfiltyp. För att berätta för Vim att tolka denna `totitle.txt` som en *hjälp* fil, kör `:set ft=help` (`:h 'filetype'` för mer). Förresten, om du vill berätta för Vim att tolka denna `totitle.txt` som en *vanlig* txt-fil, kör `:set ft=txt`.

### Den speciella syntaxen för hjälpfiler

För att göra ett nyckelord sökbart, omge det nyckelordet med asterisker. För att göra nyckelordet `totitle` sökbart när användaren söker efter `:h totitle`, skriv det som `*totitle*` i hjälpfilen.

Till exempel, jag har dessa rader högst upp på min innehållsförteckning:

```shell
INNEHÅLLSFÖRTECKNING                                     *totitle*  *totitle-toc*

// mer TOC-grejer
```

Observera att jag använde två nyckelord: `*totitle*` och `*totitle-toc*` för att markera avsnittet för innehållsförteckningen. Du kan använda så många nyckelord du vill. Detta betyder att när du söker efter antingen `:h totitle` eller `:h totitle-toc`, tar Vim dig till denna plats.

Här är ett annat exempel, någonstans längre ner i filen:

```shell
2. Användning                                                       *totitle-usage*

// användning
```

Om du söker efter `:h totitle-usage`, tar Vim dig till detta avsnitt.

Du kan också använda interna länkar för att hänvisa till ett annat avsnitt i hjälpfilerna genom att omge ett nyckelord med bar-syntaxen `|`. I TOC-avsnittet ser du nyckelord omgivna av staplar, som `|totitle-intro|`, `|totitle-usage|`, etc.

```shell
INNEHÅLLSFÖRTECKNING                                     *totitle*  *totitle-toc*

    1. Introduktion ........................... |totitle-intro|
    2. Användning ........................... |totitle-usage|
    3. Ord att kapitalisera ............. |totitle-words|
    4. Operatör ........................ |totitle-operator|
    5. Tangentbindning ..................... |totitle-keybinding|
    6. Buggar ............................ |totitle-bug-report|
    7. Bidragande .................... |totitle-contributing|
    8. Tack ......................... |totitle-credits|

```
Detta låter dig hoppa till definitionen. Om du sätter din markör någonstans på `|totitle-intro|` och trycker på `Ctrl-]`, kommer Vim att hoppa till definitionen av det ordet. I detta fall kommer det att hoppa till `*totitle-intro*` platsen. Så här kan du länka till olika nyckelord i en hjälpdok.

Det finns inget rätt eller fel sätt att skriva en dokumentsfil i Vim. Om du tittar på olika plugins av olika författare, använder många av dem olika format. Poängen är att göra en lättförståelig hjälpdok för dina användare.

Slutligen, om du skriver din egen plugin lokalt först och vill testa dokumentationssidan, kommer det helt enkelt att lägga till en txt-fil inuti `~/.vim/docs/` inte automatiskt göra dina nyckelord sökbara. Du behöver instruera Vim att lägga till din dok-sida. Kör kommandot helptags: `:helptags ~/.vim/doc` för att skapa nya taggfiler. Nu kan du börja söka efter dina nyckelord.

## Slutsats

Du har nått slutet! Detta kapitel är en sammanställning av alla Vimscript-kapitel. Här sätter du äntligen i praktik vad du har lärt dig hittills. Förhoppningsvis har du efter att ha läst detta förstått inte bara hur man skapar Vim-plugins, utan också uppmuntrat dig att skriva din egen plugin.

När du finner dig själv upprepa samma sekvens av åtgärder flera gånger, bör du försöka skapa din egen! Det har sagts att man inte ska återuppfinna hjulet. Men jag tror att det kan vara fördelaktigt att återuppfinna hjulet för lärandets skull. Läs andras plugins. Återskapa dem. Lär dig av dem. Skriv din egen! Vem vet, kanske kommer du att skriva den nästa fantastiska, superpopulära plugin efter att ha läst detta. Kanske kommer du att bli den nästa legendariska Tim Pope. När det händer, låt mig veta!