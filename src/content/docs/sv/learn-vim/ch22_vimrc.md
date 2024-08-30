---
description: I detta kapitel lär du dig hur du organiserar och konfigurerar din vimrc-fil
  för att optimera din Vim-användning och anpassa inställningarna.
title: Ch22. Vimrc
---

I de föregående kapitlen lärde du dig hur man använder Vim. I detta kapitel kommer du att lära dig hur man organiserar och konfigurerar vimrc.

## Hur Vim Hittar Vimrc

Den konventionella visdomen för vimrc är att lägga till en `.vimrc` dotfil i hemkatalogen `~/.vimrc` (det kan vara annorlunda beroende på ditt operativsystem).

Bakom kulisserna letar Vim på flera ställen efter en vimrc-fil. Här är de platser som Vim kontrollerar:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

När du startar Vim kommer den att kontrollera ovanstående sex platser i den ordningen för en vimrc-fil. Den första hittade vimrc-filen kommer att användas och resten ignoreras.

Först kommer Vim att leta efter en `$VIMINIT`. Om det inte finns något där, kommer Vim att kontrollera `$HOME/.vimrc`. Om det inte finns något där, kommer Vim att kontrollera `$HOME/.vim/vimrc`. Om Vim hittar det, kommer det att sluta leta och använda `$HOME/.vim/vimrc`.

Den första platsen, `$VIMINIT`, är en miljövariabel. Som standard är den odefinierad. Om du vill använda `~/dotfiles/testvimrc` som ditt `$VIMINIT`-värde kan du skapa en miljövariabel som innehåller sökvägen till den vimrc. Efter att du har kört `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`, kommer Vim nu att använda `~/dotfiles/testvimrc` som din vimrc-fil.

Den andra platsen, `$HOME/.vimrc`, är den konventionella sökvägen för många Vim-användare. `$HOME` är i många fall din hemkatalog (`~`). Om du har en `~/.vimrc`-fil kommer Vim att använda detta som din vimrc-fil.

Den tredje, `$HOME/.vim/vimrc`, ligger inuti `~/.vim`-katalogen. Du kanske redan har `~/.vim`-katalogen för dina plugins, anpassade skript eller vyfiler. Observera att det inte finns någon punkt i vimrc-filnamnet (`$HOME/.vim/.vimrc` fungerar inte, men `$HOME/.vim/vimrc` gör).

Den fjärde, `$EXINIT`, fungerar på liknande sätt som `$VIMINIT`.

Den femte, `$HOME/.exrc`, fungerar på liknande sätt som `$HOME/.vimrc`.

Den sjätte, `$VIMRUNTIME/defaults.vim`, är den standard vimrc som följer med din Vim-installation. I mitt fall har jag Vim 8.2 installerat med Homebrew, så min sökväg är (`/usr/local/share/vim/vim82`). Om Vim inte hittar någon av de tidigare sex vimrc-filerna, kommer den att använda denna fil.

För resten av detta kapitel antar jag att vimrc använder sökvägen `~/.vimrc`.

## Vad Ska Jag Sätta i Min Vimrc?

En fråga jag ställde när jag började var, "Vad ska jag sätta i min vimrc?"

Svaret är, "vad du vill". Frestelsen att kopiera och klistra in andras vimrc är verklig, men du bör motstå den. Om du insisterar på att använda någon annans vimrc, se till att du vet vad den gör, varför och hur han/hon använder den, och viktigast av allt, om den är relevant för dig. Bara för att någon använder den betyder inte att du också kommer att använda den.

## Grundläggande Vimrc Innehåll

I korthet är en vimrc en samling av:
- Plugins
- Inställningar
- Anpassade funktioner
- Anpassade kommandon
- Mappningar

Det finns andra saker som inte nämns ovan, men i allmänhet täcker detta de flesta användningsfall.

### Plugins

I de föregående kapitlen har jag nämnt olika plugins, som [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo), och [vim-fugitive](https://github.com/tpope/vim-fugitive).

För tio år sedan var hanteringen av plugins en mardröm. Men med framväxten av moderna pluginhanterare kan installation av plugins nu göras på sekunder. Jag använder för närvarande [vim-plug](https://github.com/junegunn/vim-plug) som min pluginhanterare, så jag kommer att använda den i detta avsnitt. Konceptet bör vara liknande med andra populära pluginhanterare. Jag skulle starkt rekommendera att du kollar på olika, såsom:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Det finns fler pluginhanterare än de som listas ovan, känn dig fri att titta runt. För att installera vim-plug, om du har en Unix-maskin, kör:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

För att lägga till nya plugins, lägg dina plugin-namn (`Plug 'github-användarnamn/repository-namn'`) mellan raderna `call plug#begin()` och `call plug#end()`. Så om du vill installera `emmet-vim` och `nerdtree`, sätt följande kodsnutt i din vimrc:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Spara ändringarna, källan det (`:source %`), och kör `:PlugInstall` för att installera dem.

I framtiden, om du behöver ta bort oanvända plugins, behöver du bara ta bort plugin-namnen från `call`-blocket, spara och källan, och kör kommandot `:PlugClean` för att ta bort det från din maskin.

Vim 8 har sina egna inbyggda paketförvaltare. Du kan kolla `:h packages` för mer information. I nästa kapitel kommer jag att visa dig hur du använder det.

### Inställningar

Det är vanligt att se många `set`-alternativ i vilken vimrc som helst. Om du kör set-kommandot från kommandorads-läget är det inte permanent. Du kommer att förlora det när du stänger Vim. Till exempel, istället för att köra `:set relativenumber number` från kommandorads-läget varje gång du kör Vim, kan du bara sätta dessa inuti vimrc:

```shell
set relativenumber number
```

Vissa inställningar kräver att du anger ett värde, som `set tabstop=2`. Kolla hjälp-sidan för varje inställning för att lära dig vilken typ av värden den accepterar.

Du kan också använda `let` istället för `set` (se till att föra in det med `&`). Med `let` kan du använda ett uttryck som värde. Till exempel, för att sätta `'dictionary'`-alternativet till en sökväg endast om sökvägen finns:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Du kommer att lära dig om Vimscript-tilldelningar och villkor i senare kapitel.

För en lista över alla möjliga alternativ i Vim, kolla `:h E355`.

### Anpassade Funktioner

Vimrc är en bra plats för anpassade funktioner. Du kommer att lära dig hur man skriver sina egna Vimscript-funktioner i ett senare kapitel.

### Anpassade Kommandon

Du kan skapa ett anpassat kommandorads-kommando med `command`.

För att skapa ett grundläggande kommando `GimmeDate` för att visa dagens datum:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

När du kör `:GimmeDate`, kommer Vim att visa ett datum som "2021-01-1".

För att skapa ett grundläggande kommando med en inmatning kan du använda `<args>`. Om du vill skicka till `GimmeDate` ett specifikt tids-/datumformat:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Om du vill begränsa antalet argument kan du skicka det `-nargs`-flaggan. Använd `-nargs=0` för att skicka inga argument, `-nargs=1` för att skicka ett argument, `-nargs=+` för att skicka minst ett argument, `-nargs=*` för att skicka ett valfritt antal argument, och `-nargs=?` för att skicka 0 eller ett argument. Om du vill skicka det n:te argumentet, använd `-nargs=n` (där `n` är ett heltal).

`<args>` har två varianter: `<f-args>` och `<q-args>`. Den förra används för att skicka argument till Vimscript-funktioner. Den senare används för att automatiskt konvertera användarinmatning till strängar.

Använda `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" returnerar 'Hello Iggy'

:Hello Iggy
" Odefinierad variabelfel
```

Använda `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" returnerar 'Hello Iggy'
```

Använda `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" returnerar "Hello Iggy1 and Iggy2"
```

Funktionerna ovan kommer att ge mycket mer mening när du kommer till kapitlet om Vimscript-funktioner.

För att lära dig mer om kommandon och args, kolla `:h command` och `:args`.
### Kartor

Om du upptäcker att du upprepade gånger utför samma komplexa uppgift, är det en bra indikator på att du bör skapa en mappning för den uppgiften.

Till exempel har jag dessa två mappningar i min vimrc:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

I den första mappningen kopplar jag `Ctrl-F` till [fzf.vim](https://github.com/junegunn/fzf.vim) pluginens `:Gfiles` kommando (snabbt söka efter Git-filer). I den andra kopplar jag `<Leader>tn` för att anropa en anpassad funktion `ToggleNumber` (växlar mellan `norelativenumber` och `relativenumber` alternativ). `Ctrl-F` mappningen skriver över Vims inbyggda sidscrollning. Din mappning kommer att skriva över Vims kontroller om de krockar. Eftersom jag nästan aldrig använde den funktionen, beslutade jag att det är säkert att skriva över den.

Förresten, vad är denna "leader"-tangent i `<Leader>tn`?

Vim har en leader-tangent för att hjälpa till med mappningar. Till exempel har jag kopplat `<Leader>tn` för att köra `ToggleNumber()` funktionen. Utan leader-tangenten skulle jag använda `tn`, men Vim har redan `t` (den "till" söknavigeringen). Med leader-tangenten kan jag nu trycka på tangenten som tilldelats som leader, och sedan `tn` utan att störa befintliga kommandon. Leader-tangenten är en tangent som du kan ställa in för att starta din mappningskombination. Som standard använder Vim bakslash som leader-tangent (så `<Leader>tn` blir "bakslash-t-n").

Jag personligen gillar att använda `<Space>` som leader-tangent istället för bakslash som standard. För att ändra din leader-tangent, lägg till detta i din vimrc:

```shell
let mapleader = "\<space>"
```

`nnoremap` kommandot som används ovan kan brytas ner i tre delar:
- `n` representerar normalt läge.
- `nore` betyder icke-rekursiv.
- `map` är mappningskommandot.

Minst, skulle du kunna ha använt `nmap` istället för `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). Det är dock en bra praxis att använda den icke-rekursiva varianten för att undvika potentiella oändliga loopar.

Här är vad som kan hända om du inte mappade icke-rekursivt. Anta att du vill lägga till en mappning till `B` för att lägga till ett semikolon i slutet av raden, och sedan gå tillbaka en WORD (kom ihåg att `B` i Vim är en navigeringstangent i normalt läge för att gå bakåt en WORD).

```shell
nmap B A;<esc>B
```

När du trycker på `B`... åh nej! Vim lägger till `;` okontrollerat (avbryt det med `Ctrl-C`). Varför hände det? För att i mappningen `A;<esc>B`, refererar `B` inte till Vims inbyggda `B` funktion (gå tillbaka en WORD), utan den refererar till den mappade funktionen. Vad du har är faktiskt detta:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

För att lösa detta problem, behöver du lägga till en icke-rekursiv mappning:

```shell
nnoremap B A;<esc>B
```

Försök nu att kalla på `B` igen. Denna gång lägger den framgångsrikt till ett `;` i slutet av raden och går tillbaka en WORD. `B` i denna mappning representerar Vims ursprungliga `B` funktionalitet.

Vim har olika mappningar för olika lägen. Om du vill skapa en mappning för insättningsläge för att avsluta insättningsläge när du trycker på `jk`:

```shell
inoremap jk <esc>
```

De andra mappningslägena är: `map` (Normal, Visuell, Välj och Operatör-väntande), `vmap` (Visuell och Välj), `smap` (Välj), `xmap` (Visuell), `omap` (Operatör-väntande), `map!` (Insättning och Kommandorad), `lmap` (Insättning, Kommandorad, Lang-arg), `cmap` (Kommandorad), och `tmap` (terminal-jobb). Jag kommer inte att täcka dem i detalj. För att lära dig mer, kolla in `:h map.txt`.

Skapa en mappning som är mest intuitiv, konsekvent och lätt att komma ihåg.

## Organisera Vimrc

Över tid kommer din vimrc att växa stor och bli invecklad. Det finns två sätt att hålla din vimrc ren:
- Dela upp din vimrc i flera filer.
- Fäll ihop din vimrc-fil.

### Dela Upp Din Vimrc

Du kan dela upp din vimrc i flera filer med Vims `source` kommando. Detta kommando läser kommandorads-kommandon från den angivna filargumentet.

Låt oss skapa en fil i `~/.vim` katalogen och namnge den `/settings` (`~/.vim/settings`). Namnet i sig är godtyckligt och du kan namnge den vad du vill.

Du kommer att dela upp den i fyra komponenter:
- Tredjeparts plugins (`~/.vim/settings/plugins.vim`).
- Allmänna inställningar (`~/.vim/settings/configs.vim`).
- Anpassade funktioner (`~/.vim/settings/functions.vim`).
- Tangentmappningar (`~/.vim/settings/mappings.vim`).

Inuti `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Du kan redigera dessa filer genom att placera din markör under sökvägen och trycka på `gf`.

Inuti `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Inuti `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

Inuti `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

Inuti `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Din vimrc bör fungera som vanligt, men nu är den bara fyra rader lång!

Med denna uppsättning vet du enkelt vart du ska gå. Om du behöver lägga till fler mappningar, lägg till dem i `/mappings.vim` filen. I framtiden kan du alltid lägga till fler kataloger när din vimrc växer. Till exempel, om du behöver skapa en inställning för dina färgscheman, kan du lägga till en `~/.vim/settings/themes.vim`.

### Hålla En Vimrc Fil

Om du föredrar att hålla en vimrc-fil för att hålla den portabel, kan du använda marker-fällor för att hålla den organiserad. Lägg till detta högst upp i din vimrc:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim kan upptäcka vilken typ av filtyp den aktuella bufferten har (`:set filetype?`). Om det är en `vim` filtyp, kan du använda en marker-fällmetod. Kom ihåg att en marker-fäll använder `{{{` och `}}}` för att indikera start- och slutfällor.

Lägg till `{{{` och `}}}` fällor till resten av din vimrc (glöm inte att kommentera dem med `"`):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Din vimrc bör se ut så här:

```shell
+-- 6 rader: setup folds -----

+-- 6 rader: plugins ---------

+-- 5 rader: configs ---------

+-- 9 rader: functions -------

+-- 5 rader: mappings --------
```

## Köra Vim Med eller Utan Vimrc och Plugins

Om du behöver köra Vim utan både vimrc och plugins, kör:

```shell
vim -u NONE
```

Om du behöver starta Vim utan vimrc men med plugins, kör:

```shell
vim -u NORC
```

Om du behöver köra Vim med vimrc men utan plugins, kör:

```shell
vim --noplugin
```

Om du behöver köra Vim med en *annan* vimrc, säg `~/.vimrc-backup`, kör:

```shell
vim -u ~/.vimrc-backup
```

Om du behöver köra Vim med endast `defaults.vim` och utan plugins, vilket är användbart för att fixa en trasig vimrc, kör:

```shell
vim --clean
```

## Konfigurera Vimrc På Ett Smart Sätt

Vimrc är en viktig komponent i Vims anpassning. Ett bra sätt att börja bygga din vimrc är att läsa andras vimrc:er och gradvis bygga den över tid. Den bästa vimrc:en är inte den som utvecklare X använder, utan den som är skräddarsydd exakt för att passa ditt tankesätt och redigeringsstil.