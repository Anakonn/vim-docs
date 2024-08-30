---
description: In questo capitolo, imparerai come organizzare e configurare il file
  vimrc, esplorando i vari percorsi in cui Vim cerca il file di configurazione.
title: Ch22. Vimrc
---

Nei capitoli precedenti, hai imparato come usare Vim. In questo capitolo, imparerai come organizzare e configurare vimrc.

## Come Vim Trova Vimrc

La saggezza convenzionale per vimrc è di aggiungere un file dot `.vimrc` nella directory home `~/.vimrc` (potrebbe essere diverso a seconda del tuo sistema operativo).

Dietro le quinte, Vim controlla in più posizioni per un file vimrc. Ecco i luoghi che Vim verifica:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Quando avvii Vim, controllerà i sei luoghi sopra in quest'ordine per un file vimrc. Il primo file vimrc trovato sarà utilizzato e gli altri verranno ignorati.

Per prima cosa Vim cercherà un `$VIMINIT`. Se non c'è nulla lì, Vim controllerà `$HOME/.vimrc`. Se non c'è nulla lì, Vim controllerà `$HOME/.vim/vimrc`. Se Vim lo trova, smetterà di cercare e utilizzerà `$HOME/.vim/vimrc`.

La prima posizione, `$VIMINIT`, è una variabile d'ambiente. Per impostazione predefinita è indefinita. Se vuoi usare `~/dotfiles/testvimrc` come valore di `$VIMINIT`, puoi creare una variabile d'ambiente contenente il percorso di quel vimrc. Dopo aver eseguito `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`, Vim utilizzerà ora `~/dotfiles/testvimrc` come tuo file vimrc.

La seconda posizione, `$HOME/.vimrc`, è il percorso convenzionale per molti utenti di Vim. `$HOME` in molti casi è la tua directory home (`~`). Se hai un file `~/.vimrc`, Vim utilizzerà questo come tuo file vimrc.

La terza, `$HOME/.vim/vimrc`, si trova all'interno della directory `~/.vim`. Potresti avere già la directory `~/.vim` per i tuoi plugin, script personalizzati o file View. Nota che non c'è un punto nel nome del file vimrc (`$HOME/.vim/.vimrc` non funzionerà, ma `$HOME/.vim/vimrc` sì).

La quarta, `$EXINIT`, funziona in modo simile a `$VIMINIT`.

La quinta, `$HOME/.exrc`, funziona in modo simile a `$HOME/.vimrc`.

La sesta, `$VIMRUNTIME/defaults.vim`, è il vimrc predefinito che viene fornito con la tua build di Vim. Nel mio caso, ho installato Vim 8.2 utilizzando Homebrew, quindi il mio percorso è (`/usr/local/share/vim/vim82`). Se Vim non trova nessuno dei sei file vimrc precedenti, utilizzerà questo file.

Per il resto di questo capitolo, presumo che il vimrc utilizzi il percorso `~/.vimrc`.

## Cosa Mettere nel Mio Vimrc?

Una domanda che mi sono posto quando ho iniziato è stata: "Cosa dovrei mettere nel mio vimrc?"

La risposta è: "qualsiasi cosa tu voglia". La tentazione di copiare e incollare il vimrc di altre persone è reale, ma dovresti resistere. Se insisti nell'usare il vimrc di qualcun altro, assicurati di sapere cosa fa, perché e come lo usa, e soprattutto, se è rilevante per te. Solo perché qualcuno lo usa non significa che lo userai anche tu.

## Contenuto di Base del Vimrc

In sintesi, un vimrc è una raccolta di:
- Plugin
- Impostazioni
- Funzioni Personalizzate
- Comandi Personalizzati
- Mappature

Ci sono altre cose non menzionate sopra, ma in generale, questo copre la maggior parte dei casi d'uso.

### Plugin

Nei capitoli precedenti, ho menzionato diversi plugin, come [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo) e [vim-fugitive](https://github.com/tpope/vim-fugitive).

Dieci anni fa, gestire i plugin era un incubo. Tuttavia, con l'ascesa dei moderni gestori di plugin, installare plugin ora può essere fatto in pochi secondi. Attualmente sto usando [vim-plug](https://github.com/junegunn/vim-plug) come mio gestore di plugin, quindi lo userò in questa sezione. Il concetto dovrebbe essere simile con altri gestori di plugin popolari. Ti consiglio vivamente di dare un'occhiata a diversi, come:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Ci sono più gestori di plugin rispetto a quelli elencati sopra, sentiti libero di esplorare. Per installare vim-plug, se hai una macchina Unix, esegui:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Per aggiungere nuovi plugin, inserisci i nomi dei tuoi plugin (`Plug 'github-username/repository-name'`) tra le righe `call plug#begin()` e `call plug#end()`. Quindi, se vuoi installare `emmet-vim` e `nerdtree`, metti il seguente frammento nel tuo vimrc:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Salva le modifiche, sorgenti (`:source %`), e esegui `:PlugInstall` per installarli.

In futuro, se hai bisogno di rimuovere plugin non utilizzati, devi solo rimuovere i nomi dei plugin dal blocco `call`, salvare e sorgenti, e eseguire il comando `:PlugClean` per rimuoverlo dalla tua macchina.

Vim 8 ha i propri gestori di pacchetti integrati. Puoi controllare `:h packages` per ulteriori informazioni. Nel prossimo capitolo, ti mostrerò come usarlo.

### Impostazioni

È comune vedere molte opzioni `set` in qualsiasi vimrc. Se esegui il comando set dalla modalità della riga di comando, non è permanente. Lo perderai quando chiudi Vim. Ad esempio, invece di eseguire `:set relativenumber number` dalla modalità della riga di comando ogni volta che esegui Vim, potresti semplicemente mettere queste righe dentro vimrc:

```shell
set relativenumber number
```

Alcune impostazioni richiedono di passare un valore, come `set tabstop=2`. Controlla la pagina di aiuto per ciascuna impostazione per sapere quali tipi di valori accetta.

Puoi anche usare `let` invece di `set` (assicurati di anteporre `&`). Con `let`, puoi usare un'espressione come valore. Ad esempio, per impostare l'opzione `'dictionary'` su un percorso solo se il percorso esiste:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Imparerai a conoscere le assegnazioni e le condizioni di Vimscript nei capitoli successivi.

Per un elenco di tutte le possibili opzioni in Vim, controlla `:h E355`.

### Funzioni Personalizzate

Il vimrc è un buon posto per funzioni personalizzate. Imparerai a scrivere le tue funzioni Vimscript in un capitolo successivo.

### Comandi Personalizzati

Puoi creare un comando personalizzato della riga di comando con `command`.

Per creare un comando di base `GimmeDate` per visualizzare la data di oggi:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Quando esegui `:GimmeDate`, Vim visualizzerà una data come "2021-01-1".

Per creare un comando di base con un input, puoi usare `<args>`. Se vuoi passare a `GimmeDate` un formato di data/ora specifico:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Se vuoi limitare il numero di argomenti, puoi passare il flag `-nargs`. Usa `-nargs=0` per non passare argomenti, `-nargs=1` per passare un argomento, `-nargs=+` per passare almeno un argomento, `-nargs=*` per passare un numero qualsiasi di argomenti, e `-nargs=?` per passare 0 o un argomento. Se vuoi passare l'n-esimo argomento, usa `-nargs=n` (dove `n` è un qualsiasi intero).

`<args>` ha due varianti: `<f-args>` e `<q-args>`. La prima viene utilizzata per passare argomenti a funzioni Vimscript. La seconda viene utilizzata per convertire automaticamente l'input dell'utente in stringhe.

Usando `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" restituisce 'Hello Iggy'

:Hello Iggy
" Errore di variabile indefinita
```

Usando `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" restituisce 'Hello Iggy'
```

Usando `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" restituisce "Hello Iggy1 and Iggy2"
```

Le funzioni sopra avranno molto più senso una volta che arriverai al capitolo sulle funzioni Vimscript.

Per saperne di più su comandi e argomenti, controlla `:h command` e `:args`.
### Mappe

Se ti trovi a eseguire ripetutamente lo stesso compito complesso, è un buon indicatore che dovresti creare una mappatura per quel compito.

Ad esempio, ho queste due mappature nel mio vimrc:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Nella prima, mappo `Ctrl-F` al comando `:Gfiles` del plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (cerca rapidamente i file Git). Nella seconda, mappo `<Leader>tn` per chiamare una funzione personalizzata `ToggleNumber` (commuta le opzioni `norelativenumber` e `relativenumber`). La mappatura `Ctrl-F` sovrascrive lo scorrimento della pagina nativo di Vim. La tua mappatura sovrascriverà i controlli di Vim se si sovrappongono. Poiché quasi non usavo quella funzione, ho deciso che era sicuro sovrascriverla.

A proposito, cos'è questo tasto "leader" in `<Leader>tn`?

Vim ha un tasto leader per aiutare con le mappature. Ad esempio, ho mappato `<Leader>tn` per eseguire la funzione `ToggleNumber()`. Senza il tasto leader, userei `tn`, ma Vim ha già `t` (la navigazione di ricerca "till"). Con il tasto leader, ora posso premere il tasto assegnato come leader, quindi `tn` senza interferire con i comandi esistenti. Il tasto leader è un tasto che puoi configurare per avviare la tua combinazione di mappature. Per impostazione predefinita, Vim usa il backslash come tasto leader (quindi `<Leader>tn` diventa "backslash-t-n").

Personalmente, mi piace usare `<Space>` come tasto leader invece del predefinito backslash. Per cambiare il tuo tasto leader, aggiungi questo nel tuo vimrc:

```shell
let mapleader = "\<space>"
```

Il comando `nnoremap` utilizzato sopra può essere suddiviso in tre parti:
- `n` rappresenta la modalità normale.
- `nore` significa non ricorsivo.
- `map` è il comando di mappatura.

Al minimo, avresti potuto usare `nmap` invece di `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). Tuttavia, è una buona pratica utilizzare la variante non ricorsiva per evitare potenziali loop infiniti.

Ecco cosa potrebbe succedere se non mappi in modo non ricorsivo. Supponi di voler aggiungere una mappatura a `B` per aggiungere un punto e virgola alla fine della riga, quindi tornare indietro di una PAROLA (ricorda che `B` in Vim è un tasto di navigazione in modalità normale per tornare indietro di una PAROLA).

```shell
nmap B A;<esc>B
```

Quando premi `B`... oh no! Vim aggiunge `;` in modo incontrollato (interrompilo con `Ctrl-C`). Perché è successo? Perché nella mappatura `A;<esc>B`, il `B` non si riferisce alla funzione nativa di Vim `B` (tornare indietro di una PAROLA), ma si riferisce alla funzione mappata. Quello che hai è in realtà questo:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Per risolvere questo problema, devi aggiungere una mappatura non ricorsiva:

```shell
nnoremap B A;<esc>B
```

Ora prova a chiamare di nuovo `B`. Questa volta aggiunge con successo un `;` alla fine della riga e torna indietro di una PAROLA. Il `B` in questa mappatura rappresenta la funzionalità originale di `B` di Vim.

Vim ha diverse mappature per diverse modalità. Se vuoi creare una mappatura per la modalità di inserimento per uscire dalla modalità di inserimento quando premi `jk`:

```shell
inoremap jk <esc>
```

Le altre modalità di mappatura sono: `map` (Normale, Visiva, Seleziona e Operatore-in-attesa), `vmap` (Visiva e Seleziona), `smap` (Seleziona), `xmap` (Visiva), `omap` (Operatore-in-attesa), `map!` (Inserisci e Riga di comando), `lmap` (Inserisci, Riga di comando, Lang-arg), `cmap` (Riga di comando) e `tmap` (lavoro terminale). Non le tratterò in dettaglio. Per saperne di più, controlla `:h map.txt`.

Crea una mappatura che sia più intuitiva, coerente e facile da ricordare.

## Organizzazione del Vimrc

Col passare del tempo, il tuo vimrc crescerà e diventerà complicato. Ci sono due modi per mantenere il tuo vimrc pulito:
- Dividi il tuo vimrc in più file.
- Piega il tuo file vimrc.

### Divisione del tuo Vimrc

Puoi dividere il tuo vimrc in più file utilizzando il comando `source` di Vim. Questo comando legge i comandi della riga di comando dall'argomento file fornito.

Creiamo un file all'interno della directory `~/.vim` e chiamiamolo `/settings` (`~/.vim/settings`). Il nome stesso è arbitrario e puoi chiamarlo come vuoi.

Lo dividerai in quattro componenti:
- Plugin di terze parti (`~/.vim/settings/plugins.vim`).
- Impostazioni generali (`~/.vim/settings/configs.vim`).
- Funzioni personalizzate (`~/.vim/settings/functions.vim`).
- Mappature di tasti (`~/.vim/settings/mappings.vim`).

All'interno di `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Puoi modificare questi file posizionando il cursore sotto il percorso e premendo `gf`.

All'interno di `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

All'interno di `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

All'interno di `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

All'interno di `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Il tuo vimrc dovrebbe funzionare come al solito, ma ora è lungo solo quattro righe!

Con questa configurazione, sai facilmente dove andare. Se hai bisogno di aggiungere più mappature, aggiungile al file `/mappings.vim`. In futuro, puoi sempre aggiungere più directory man mano che il tuo vimrc cresce. Ad esempio, se hai bisogno di creare un'impostazione per i tuoi temi di colore, puoi aggiungere un `~/.vim/settings/themes.vim`.

### Mantenere un solo file Vimrc

Se preferisci mantenere un solo file vimrc per tenerlo portatile, puoi usare le pieghe dei marcatori per mantenerlo organizzato. Aggiungi questo all'inizio del tuo vimrc:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim può rilevare che tipo di file ha il buffer corrente (`:set filetype?`). Se è un file di tipo `vim`, puoi usare un metodo di piegatura a marcatori. Ricorda che una piegatura a marcatori usa `{{{` e `}}}` per indicare l'inizio e la fine delle pieghe.

Aggiungi pieghe `{{{` e `}}}` al resto del tuo vimrc (non dimenticare di commentarle con `"`):

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

Il tuo vimrc dovrebbe apparire così:

```shell
+-- 6 righe: setup folds -----

+-- 6 righe: plugins ---------

+-- 5 righe: configs ---------

+-- 9 righe: functions -------

+-- 5 righe: mappings --------
```

## Eseguire Vim Con o Senza Vimrc e Plugin

Se hai bisogno di eseguire Vim senza sia vimrc che plugin, esegui:

```shell
vim -u NONE
```

Se hai bisogno di avviare Vim senza vimrc ma con plugin, esegui:

```shell
vim -u NORC
```

Se hai bisogno di eseguire Vim con vimrc ma senza plugin, esegui:

```shell
vim --noplugin
```

Se hai bisogno di eseguire Vim con un *diverso* vimrc, ad esempio `~/.vimrc-backup`, esegui:

```shell
vim -u ~/.vimrc-backup
```

Se hai bisogno di eseguire Vim con solo `defaults.vim` e senza plugin, il che è utile per riparare un vimrc rotto, esegui:

```shell
vim --clean
```

## Configurare Vimrc nel Modo Intelligente

Vimrc è un componente importante della personalizzazione di Vim. Un buon modo per iniziare a costruire il tuo vimrc è leggere i vimrc di altre persone e costruirlo gradualmente nel tempo. Il miglior vimrc non è quello che usa lo sviluppatore X, ma quello che è progettato esattamente per adattarsi al tuo framework di pensiero e al tuo stile di editing.