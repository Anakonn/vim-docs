---
description: In dit hoofdstuk leer je hoe je vimrc kunt organiseren en configureren,
  en ontdek je waar Vim zoekt naar de vimrc-bestanden.
title: Ch22. Vimrc
---

In de vorige hoofdstukken heb je geleerd hoe je Vim kunt gebruiken. In dit hoofdstuk leer je hoe je vimrc kunt organiseren en configureren.

## Hoe Vim Vimrc Vindt

De gangbare wijsheid voor vimrc is om een `.vimrc` dotfile toe te voegen in de home directory `~/.vimrc` (dit kan verschillen afhankelijk van je besturingssysteem).

Achter de schermen kijkt Vim op verschillende plaatsen naar een vimrc-bestand. Hier zijn de plaatsen die Vim controleert:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Wanneer je Vim start, controleert het de bovenstaande zes locaties in die volgorde op een vimrc-bestand. Het eerste gevonden vimrc-bestand wordt gebruikt en de rest wordt genegeerd.

Eerst kijkt Vim naar een `$VIMINIT`. Als daar niets is, controleert Vim op `$HOME/.vimrc`. Als daar niets is, controleert Vim op `$HOME/.vim/vimrc`. Als Vim het vindt, stopt het met zoeken en gebruikt het `$HOME/.vim/vimrc`.

De eerste locatie, `$VIMINIT`, is een omgevingsvariabele. Standaard is deze niet gedefinieerd. Als je `~/dotfiles/testvimrc` wilt gebruiken als je `$VIMINIT` waarde, kun je een omgevingsvariabele maken met het pad naar dat vimrc. Nadat je `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'` hebt uitgevoerd, zal Vim nu `~/dotfiles/testvimrc` gebruiken als je vimrc-bestand.

De tweede locatie, `$HOME/.vimrc`, is het gangbare pad voor veel Vim-gebruikers. `$HOME` is in veel gevallen je home directory (`~`). Als je een `~/.vimrc`-bestand hebt, zal Vim dit gebruiken als je vimrc-bestand.

De derde, `$HOME/.vim/vimrc`, bevindt zich in de `~/.vim` directory. Je hebt misschien al de `~/.vim` directory voor je plugins, aangepaste scripts of View-bestanden. Let op dat er geen punt in de naam van het vimrc-bestand staat (`$HOME/.vim/.vimrc` werkt niet, maar `$HOME/.vim/vimrc` wel).

De vierde, `$EXINIT` werkt vergelijkbaar met `$VIMINIT`.

De vijfde, `$HOME/.exrc` werkt vergelijkbaar met `$HOME/.vimrc`.

De zesde, `$VIMRUNTIME/defaults.vim` is de standaard vimrc die bij je Vim-build wordt geleverd. In mijn geval heb ik Vim 8.2 geïnstalleerd met Homebrew, dus mijn pad is (`/usr/local/share/vim/vim82`). Als Vim geen van de vorige zes vimrc-bestanden vindt, zal het dit bestand gebruiken.

Voor de rest van dit hoofdstuk ga ik ervan uit dat de vimrc het `~/.vimrc` pad gebruikt.

## Wat Moet Ik In Mijn Vimrc Zetten?

Een vraag die ik stelde toen ik begon was: "Wat moet ik in mijn vimrc zetten?"

Het antwoord is: "alles wat je wilt". De verleiding om de vimrc van anderen te kopiëren is reëel, maar je moet het weerstaan. Als je erop staat om de vimrc van iemand anders te gebruiken, zorg er dan voor dat je weet wat het doet, waarom en hoe hij/zij het gebruikt, en vooral of het relevant voor jou is. Alleen omdat iemand het gebruikt, betekent niet dat jij het ook zult gebruiken.

## Basisinhoud Voor Vimrc

In het kort is een vimrc een verzameling van:
- Plugins
- Instellingen
- Aangepaste Functies
- Aangepaste Commando's
- Mappings

Er zijn andere dingen die hierboven niet zijn genoemd, maar over het algemeen dekt dit de meeste gebruiksgevallen.

### Plugins

In de vorige hoofdstukken heb ik verschillende plugins genoemd, zoals [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo), en [vim-fugitive](https://github.com/tpope/vim-fugitive).

Tien jaar geleden was het beheren van plugins een nachtmerrie. Echter, met de opkomst van moderne pluginmanagers kan het installeren van plugins nu in enkele seconden worden gedaan. Ik gebruik momenteel [vim-plug](https://github.com/junegunn/vim-plug) als mijn pluginmanager, dus ik zal het in deze sectie gebruiken. Het concept zou vergelijkbaar moeten zijn met andere populaire pluginmanagers. Ik raad je sterk aan om verschillende te bekijken, zoals:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Er zijn meer pluginmanagers dan de hierboven genoemde, voel je vrij om rond te kijken. Om vim-plug te installeren, als je een Unix-machine hebt, voer je uit:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Om nieuwe plugins toe te voegen, plaats je je plugin-namen (`Plug 'github-username/repository-name'`) tussen de `call plug#begin()` en de `call plug#end()` regels. Dus als je `emmet-vim` en `nerdtree` wilt installeren, zet je de volgende snippet in je vimrc:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Sla de wijzigingen op, source het (`:source %`), en voer `:PlugInstall` uit om ze te installeren.

In de toekomst, als je ongebruikte plugins wilt verwijderen, hoef je alleen maar de plugin-namen uit het `call` blok te verwijderen, op te slaan en te sourcen, en de `:PlugClean` opdracht uit te voeren om het van je machine te verwijderen.

Vim 8 heeft zijn eigen ingebouwde package managers. Je kunt `:h packages` bekijken voor meer informatie. In het volgende hoofdstuk zal ik je laten zien hoe je het kunt gebruiken.

### Instellingen

Het is gebruikelijk om veel `set` opties in een vimrc te zien. Als je het set-commando vanuit de commandoregelmodus uitvoert, is het niet permanent. Je verliest het wanneer je Vim sluit. Bijvoorbeeld, in plaats van `:set relativenumber number` uit te voeren vanuit de Commandoregelmodus elke keer dat je Vim uitvoert, kun je deze gewoon in de vimrc plaatsen:

```shell
set relativenumber number
```

Sommige instellingen vereisen dat je er een waarde aan doorgeeft, zoals `set tabstop=2`. Bekijk de help-pagina voor elke instelling om te leren welke waarden het accepteert.

Je kunt ook een `let` gebruiken in plaats van `set` (zorg ervoor dat je het voorafgaat met `&`). Met `let` kun je een expressie als waarde gebruiken. Bijvoorbeeld, om de optie `'dictionary'` in te stellen op een pad alleen als het pad bestaat:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Je zult leren over Vimscript-toewijzingen en conditionals in latere hoofdstukken.

Voor een lijst van alle mogelijke opties in Vim, kijk naar `:h E355`.

### Aangepaste Functies

Vimrc is een goede plek voor aangepaste functies. Je leert hoe je je eigen Vimscript-functies schrijft in een later hoofdstuk.

### Aangepaste Commando's

Je kunt een aangepast commandoregelcommando maken met `command`.

Om een basiscommando `GimmeDate` te maken om de datum van vandaag weer te geven:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Wanneer je `:GimmeDate` uitvoert, zal Vim een datum weergeven zoals "2021-01-1".

Om een basiscommando met een invoer te maken, kun je `<args>` gebruiken. Als je een specifieke tijd/datumnotatie aan `GimmeDate` wilt doorgeven:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Als je het aantal argumenten wilt beperken, kun je de `-nargs` vlag doorgeven. Gebruik `-nargs=0` om geen argument door te geven, `-nargs=1` om één argument door te geven, `-nargs=+` om minstens één argument door te geven, `-nargs=*` om een willekeurig aantal argumenten door te geven, en `-nargs=?` om 0 of één argument door te geven. Als je het n-de argument wilt doorgeven, gebruik dan `-nargs=n` (waarbij `n` een geheel getal is).

`<args>` heeft twee varianten: `<f-args>` en `<q-args>`. De eerste wordt gebruikt om argumenten door te geven aan Vimscript-functies. De laatste wordt gebruikt om gebruikersinvoer automatisch naar strings te converteren.

Gebruik `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" retourneert 'Hello Iggy'

:Hello Iggy
" Ongedefinieerde variabele fout
```

Gebruik `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" retourneert 'Hello Iggy'
```

Gebruik `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" retourneert "Hello Iggy1 and Iggy2"
```

De bovenstaande functies zullen veel meer zinvol zijn zodra je bij het hoofdstuk over Vimscript-functies komt.

Om meer te leren over commando's en args, kijk naar `:h command` en `:args`.
### Kaarten

Als je jezelf herhaaldelijk dezelfde complexe taak ziet uitvoeren, is dat een goede indicatie dat je een mapping voor die taak moet maken.

Bijvoorbeeld, ik heb deze twee mappings in mijn vimrc:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Bij de eerste map ik `Ctrl-F` naar het `:Gfiles` commando van de [fzf.vim](https://github.com/junegunn/fzf.vim) plugin (snel zoeken naar Git-bestanden). Bij de tweede map ik `<Leader>tn` om een aangepaste functie `ToggleNumber` aan te roepen (wisselt `norelativenumber` en `relativenumber` opties). De `Ctrl-F` mapping overschrijft de native pagina-scroll van Vim. Jouw mapping zal de Vim-controles overschrijven als ze in conflict komen. Omdat ik die functie bijna nooit gebruikte, besloot ik dat het veilig was om deze te overschrijven.

Trouwens, wat is deze "leider" toets in `<Leader>tn`?

Vim heeft een leider toets om te helpen met mappings. Bijvoorbeeld, ik heb `<Leader>tn` gemapt om de `ToggleNumber()` functie uit te voeren. Zonder de leider toets zou ik `tn` gebruiken, maar Vim heeft al `t` (de "tot" zoeknavigatie). Met de leider toets kan ik nu de toets indrukken die als leider is toegewezen, en dan `tn` zonder bestaande commando's te verstoren. De leider toets is een toets die je kunt instellen om je mapping combo te starten. Standaard gebruikt Vim de backslash als de leider toets (dus `<Leader>tn` wordt "backslash-t-n").

Persoonlijk gebruik ik liever `<Space>` als de leider toets in plaats van de standaard backslash. Om je leider toets te veranderen, voeg dit toe aan je vimrc:

```shell
let mapleader = "\<space>"
```

De `nnoremap` opdracht die hierboven is gebruikt kan worden opgesplitst in drie delen:
- `n` staat voor de normale modus.
- `nore` betekent niet-recursief.
- `map` is het map commando.

Minimaal zou je `nmap` in plaats van `nnoremap` kunnen gebruiken (`nmap <silent> <C-f> :Gfiles<CR>`). Het is echter een goede praktijk om de niet-recursieve variant te gebruiken om potentiële oneindige lussen te vermijden.

Dit is wat er kan gebeuren als je niet niet-recursief map. Stel dat je een mapping wilt toevoegen aan `B` om een puntkomma aan het einde van de regel toe te voegen, en dan één WORD terug te gaan (vergeet niet dat `B` in Vim een normale navigatietoets is om één WORD terug te gaan).

```shell
nmap B A;<esc>B
```

Wanneer je `B` indrukt... oh nee! Vim voegt `;` oncontroleerbaar toe (onderbreek het met `Ctrl-C`). Waarom gebeurde dat? Omdat in de mapping `A;<esc>B`, de `B` niet verwijst naar de native `B` functie van Vim (ga één WORD terug), maar verwijst naar de gemapte functie. Wat je hebt is eigenlijk dit:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Om dit probleem op te lossen, moet je een niet-recursieve map toevoegen:

```shell
nnoremap B A;<esc>B
```

Probeer nu opnieuw `B` aan te roepen. Deze keer voegt het succesvol een `;` toe aan het einde van de regel en gaat het één WORD terug. De `B` in deze mapping vertegenwoordigt de originele `B` functionaliteit van Vim.

Vim heeft verschillende mappen voor verschillende modi. Als je een map wilt maken voor de invoermodus om de invoermodus te verlaten wanneer je `jk` indrukt:

```shell
inoremap jk <esc>
```

De andere mapmodi zijn: `map` (Normaal, Visueel, Selectie, en Operator-wachtend), `vmap` (Visueel en Selectie), `smap` (Selectie), `xmap` (Visueel), `omap` (Operator-wachtend), `map!` (Invoeren en Opdrachtregel), `lmap` (Invoeren, Opdrachtregel, Lang-arg), `cmap` (Opdrachtregel), en `tmap` (terminal-taak). Ik zal ze niet in detail behandelen. Voor meer informatie, kijk in `:h map.txt`.

Maak een map die het meest intuïtief, consistent en gemakkelijk te onthouden is.

## Organiseren van Vimrc

In de loop van de tijd zal je vimrc groot worden en convoluut raken. Er zijn twee manieren om je vimrc er schoon uit te laten zien:
- Splits je vimrc in verschillende bestanden.
- Vouw je vimrc-bestand.

### Het splitsen van je Vimrc

Je kunt je vimrc splitsen in meerdere bestanden met behulp van de `source` opdracht van Vim. Deze opdracht leest commandoregelcommando's uit het opgegeven bestand.

Laten we een bestand maken in de `~/.vim` directory en het `/settings` noemen (`~/.vim/settings`). De naam zelf is willekeurig en je kunt het noemen wat je wilt.

Je gaat het splitsen in vier componenten:
- Derde partij plugins (`~/.vim/settings/plugins.vim`).
- Algemene instellingen (`~/.vim/settings/configs.vim`).
- Aangepaste functies (`~/.vim/settings/functions.vim`).
- Toets mappings (`~/.vim/settings/mappings.vim`).

Binnen `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Je kunt deze bestanden bewerken door je cursor onder het pad te plaatsen en `gf` in te drukken.

Binnen `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Binnen `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

Binnen `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

Binnen `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Je vimrc zou zoals gewoonlijk moeten werken, maar nu is het slechts vier regels lang!

Met deze setup weet je gemakkelijk waar je naartoe moet. Als je meer mappings wilt toevoegen, voeg ze dan toe aan het `/mappings.vim` bestand. In de toekomst kun je altijd meer directories toevoegen naarmate je vimrc groeit. Bijvoorbeeld, als je een instelling voor je kleurenpaletten wilt maken, kun je een `~/.vim/settings/themes.vim` toevoegen.

### Eén Vimrc-bestand behouden

Als je liever één vimrc-bestand wilt behouden om het draagbaar te houden, kun je de marker folds gebruiken om het georganiseerd te houden. Voeg dit toe aan de bovenkant van je vimrc:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim kan detecteren welk soort bestandstype de huidige buffer heeft (`:set filetype?`). Als het een `vim` bestandstype is, kun je een marker fold methode gebruiken. Vergeet niet dat een marker fold `{{{` en `}}}` gebruikt om de start- en eindvouwen aan te geven.

Voeg `{{{` en `}}}` vouwen toe aan de rest van je vimrc (vergeet niet ze te commentariëren met `"`):

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

Je vimrc zou er nu zo uit moeten zien:

```shell
+-- 6 regels: setup folds -----

+-- 6 regels: plugins ---------

+-- 5 regels: configs ---------

+-- 9 regels: functies -------

+-- 5 regels: mappings --------
```

## Vim uitvoeren met of zonder Vimrc en Plugins

Als je Vim zonder zowel vimrc als plugins wilt uitvoeren, voer dan uit:

```shell
vim -u NONE
```

Als je Vim zonder vimrc maar met plugins wilt starten, voer dan uit:

```shell
vim -u NORC
```

Als je Vim met vimrc maar zonder plugins wilt uitvoeren, voer dan uit:

```shell
vim --noplugin
```

Als je Vim met een *ander* vimrc wilt uitvoeren, zeg `~/.vimrc-backup`, voer dan uit:

```shell
vim -u ~/.vimrc-backup
```

Als je Vim alleen met `defaults.vim` en zonder plugins wilt uitvoeren, wat nuttig is om een beschadigde vimrc te repareren, voer dan uit:

```shell
vim --clean
```

## Configureer Vimrc op de Slimme Manier

Vimrc is een belangrijk onderdeel van de aanpassing van Vim. Een goede manier om te beginnen met het bouwen van je vimrc is door de vimrcs van andere mensen te lezen en deze geleidelijk in de loop van de tijd op te bouwen. De beste vimrc is niet degene die ontwikkelaar X gebruikt, maar degene die precies is afgestemd op jouw denkframework en bewerkingsstijl.