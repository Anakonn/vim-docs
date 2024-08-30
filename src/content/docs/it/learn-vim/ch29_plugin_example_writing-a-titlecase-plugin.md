---
description: Scopri come ho creato il plugin Vim "totitle-vim" per automatizzare la
  capitalizzazione dei titoli e migliorare la scrittura degli articoli.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Quando inizi a diventare bravo con Vim, potresti voler scrivere i tuoi plugin. Recentemente ho scritto il mio primo plugin Vim, [totitle-vim](https://github.com/iggredible/totitle-vim). È un plugin operatore per il titlecase, simile agli operatori maiuscolo `gU`, minuscolo `gu` e togglecase `g~` di Vim.

In questo capitolo, presenterò la suddivisione del plugin `totitle-vim`. Spero di fare luce sul processo e magari ispirarti a creare il tuo plugin unico!

## Il Problema

Uso Vim per scrivere i miei articoli, incluso questo stesso guida.

Un problema principale era creare un titolo appropriato per le intestazioni. Un modo per automatizzare questo è capitalizzare ogni parola nell'intestazione con `g/^#/ s/\<./\u\0/g`. Per un uso base, questo comando era abbastanza buono, ma non è ancora paragonabile a un vero title case. Le parole "The" e "Of" in "Capitalize The First Letter Of Each Word" dovrebbero essere capitalizzate. Senza una corretta capitalizzazione, la frase appare leggermente stonata.

All'inizio, non avevo intenzione di scrivere un plugin. Inoltre, si scopre che esiste già un plugin per il titlecase: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Tuttavia, c'erano alcune cose che non funzionavano proprio come volevo. La principale era il comportamento della modalità visiva a blocchi. Se ho la frase:

```shell
test title one
test title two
test title three
```

Se utilizzo un evidenziatore visivo a blocchi su "tle":

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Se premo `gt`, il plugin non lo capitalizzerà. Lo trovo incoerente con i comportamenti di `gu`, `gU` e `g~`. Così ho deciso di lavorare su quel repository del plugin titlecase e usarlo per creare un plugin titlecase che fosse coerente con `gu`, `gU` e `g~`! Ancora una volta, il plugin vim-titlecase stesso è un ottimo plugin e merita di essere usato da solo (la verità è che, forse in fondo, volevo solo scrivere il mio plugin Vim. Non riesco davvero a vedere la funzionalità di titlecasing a blocchi utilizzata così spesso nella vita reale, a parte casi limite).

### Pianificazione del Plugin

Prima di scrivere la prima riga di codice, devo decidere quali sono le regole del titlecase. Ho trovato una bella tabella di diverse regole di capitalizzazione dal sito [titlecaseconverter](https://titlecaseconverter.com/rules/). Sapevi che ci sono almeno 8 diverse regole di capitalizzazione nella lingua inglese? *Gasp!*

Alla fine, ho usato i denominatori comuni da quella lista per arrivare a una regola di base abbastanza buona per il plugin. Inoltre, dubito che le persone si lamenteranno: "Ehi, amico, stai usando AMA, perché non usi APA?". Ecco le regole di base:
- La prima parola è sempre in maiuscolo.
- Alcuni avverbi, congiunzioni e preposizioni sono in minuscolo.
- Se la parola di input è completamente in maiuscolo, allora non fare nulla (potrebbe essere un'abbreviazione).

Per quanto riguarda quali parole sono in minuscolo, diverse regole hanno liste diverse. Ho deciso di attenersi a `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Pianificazione dell'Interfaccia Utente

Voglio che il plugin sia un operatore per completare gli operatori di caso esistenti di Vim: `gu`, `gU` e `g~`. Essendo un operatore, deve accettare sia un movimento che un oggetto di testo (`gtw` dovrebbe titlecase la prossima parola, `gtiw` dovrebbe titlecase la parola interna, `gt$` dovrebbe titlecase le parole dalla posizione attuale fino alla fine della riga, `gtt` dovrebbe titlecase la riga corrente, `gti(` dovrebbe titlecase le parole all'interno delle parentesi, ecc.). Voglio anche che sia mappato a `gt` per una facile memorizzazione. Inoltre, dovrebbe funzionare con tutte le modalità visive: `v`, `V` e `Ctrl-V`. Dovrei essere in grado di evidenziarlo in *qualsiasi* modalità visiva, premere `gt`, quindi tutti i testi evidenziati saranno in titlecase.

## Runtime di Vim

La prima cosa che vedi quando guardi il repository è che ha due directory: `plugin/` e `doc/`. Quando avvii Vim, cerca file e directory speciali all'interno della directory `~/.vim` ed esegue tutti i file di script all'interno di quella directory. Per ulteriori informazioni, rivedi il capitolo sul Runtime di Vim.

Il plugin utilizza due directory di runtime di Vim: `doc/` e `plugin/`. `doc/` è un luogo per mettere la documentazione di aiuto (così puoi cercare parole chiave in seguito, come `:h totitle`). Parlerò di come creare una pagina di aiuto più avanti. Per ora, concentriamoci su `plugin/`. La directory `plugin/` viene eseguita una sola volta quando Vim si avvia. C'è un file all'interno di questa directory: `totitle.vim`. Il nome non importa (avrei potuto chiamarlo `whatever.vim` e funzionerebbe comunque). Tutto il codice responsabile del funzionamento del plugin è all'interno di questo file.

## Mappature

Esaminiamo il codice!

All'inizio del file, hai:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Quando avvii Vim, `g:totitle_default_keys` non esisterà ancora, quindi `!exists(...)` restituisce vero. In tal caso, definisci `g:totitle_default_keys` per essere uguale a 1. In Vim, 0 è falso e non zero è vero (usa 1 per indicare vero).

Passiamo alla fine del file. Vedrai questo:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Qui viene definita la mappatura principale `gt`. In questo caso, quando arrivi alle condizioni `if` in fondo al file, `if g:totitle_default_keys` restituirebbe 1 (vero), quindi Vim esegue le seguenti mappature:
- `nnoremap <expr> gt ToTitle()` mappa l'operatore della modalità normale. Questo ti consente di eseguire operatore + movimento/oggetto di testo come `gtw` per titlecase la prossima parola o `gtiw` per titlecase la parola interna. Esaminerò i dettagli di come funziona la mappatura dell'operatore più avanti.
- `xnoremap <expr> gt ToTitle()` mappa gli operatori della modalità visiva. Questo ti consente di titlecase i testi che sono evidenziati visivamente.
- `nnoremap <expr> gtt ToTitle() .. '_'` mappa l'operatore della modalità normale a livello di riga (analogo a `guu` e `gUU`). Ti starai chiedendo cosa fa `.. '_'` alla fine. `..` è l'operatore di interpolazione delle stringhe di Vim. `_` è usato come movimento con un operatore. Se guardi in `:help _`, dice che l'underscore è usato per contare 1 riga verso il basso. Esegue un operatore sulla riga corrente (prova con altri operatori, prova a eseguire `gU_` o `d_`, nota che fa lo stesso di `gUU` o `dd`).
- Infine, l'argomento `<expr>` ti consente di specificare il conteggio, quindi puoi fare `3gtw` per togglecase le prossime 3 parole.

E se non vuoi usare la mappatura predefinita `gt`? Dopotutto, stai sovrascrivendo la mappatura predefinita di Vim `gt` (tab successivo). Cosa succede se vuoi usare `gz` invece di `gt`? Ricordi prima come hai controllato `if !exists('g:totitle_default_keys')` e `if g:totitle_default_keys`? Se metti `let g:totitle_default_keys = 0` nel tuo vimrc, allora `g:totitle_default_keys` esisterebbe già quando il plugin viene eseguito (i codici nel tuo vimrc vengono eseguiti prima dei file di runtime `plugin/`), quindi `!exists('g:totitle_default_keys')` restituisce falso. Inoltre, `if g:totitle_default_keys` sarebbe falso (perché avrebbe il valore di 0), quindi non eseguirà nemmeno la mappatura `gt`! Questo ti consente effettivamente di definire la tua mappatura personalizzata nel Vimrc.

Per definire la tua mappatura titlecase a `gz`, aggiungi questo nel tuo vimrc:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Facile facile.

## La Funzione ToTitle

La funzione `ToTitle()` è facilmente la funzione più lunga in questo file.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " invoca questo quando chiami la funzione ToTitle()
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " salva le impostazioni correnti
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

    " quando l'utente chiama un'operazione a blocchi
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

    " quando l'utente chiama un'operazione di carattere o riga
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

    " ripristina le impostazioni
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Questo è molto lungo, quindi scomponiamolo.

*Potrei rifattorizzarlo in sezioni più piccole, ma per il bene di completare questo capitolo, l'ho lasciato così com'è.*
## La Funzione Operatore

Ecco la prima parte del codice:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

Che diavolo è `opfunc`? Perché sta restituendo `g@`?

Vim ha un operatore speciale, la funzione operatore, `g@`. Questo operatore ti consente di usare *qualsiasi* funzione assegnata all'opzione `opfunc`. Se ho la funzione `Foo()` assegnata a `opfunc`, allora quando eseguo `g@w`, sto eseguendo `Foo()` sulla prossima parola. Se eseguo `g@i(`, allora sto eseguendo `Foo()` sulle parentesi interne. Questa funzione operatore è fondamentale per creare il tuo operatore Vim personalizzato.

La riga seguente assegna `opfunc` alla funzione `ToTitle`.

```shell
set opfunc=ToTitle
```

La riga successiva restituisce letteralmente `g@`:

```shell
return g@
```

Quindi, come funzionano esattamente queste due righe e perché restituiscono `g@`?

Supponiamo che tu abbia la seguente mappatura:

```shell
nnoremap <expr> gt ToTitle()`
```

Poi premi `gtw` (cambia in maiuscolo la prossima parola). La prima volta che esegui `gtw`, Vim chiama il metodo `ToTitle()`. Ma in questo momento `opfunc` è ancora vuoto. Non stai nemmeno passando alcun argomento a `ToTitle()`, quindi avrà un valore di `a:type` di `''`. Questo fa sì che l'espressione condizionale controlli l'argomento `a:type`, `if a:type ==# ''`, per essere vera. All'interno, assegni `opfunc` alla funzione `ToTitle` con `set opfunc=ToTitle`. Ora `opfunc` è assegnato a `ToTitle`. Infine, dopo aver assegnato `opfunc` alla funzione `ToTitle`, restituisci `g@`. Spiegherò perché restituisce `g@` di seguito.

Non hai ancora finito. Ricorda, hai appena premuto `gtw`. Premere `gt` ha fatto tutte le cose sopra, ma hai ancora `w` da elaborare. Restituendo `g@`, a questo punto, hai ora tecnicamente `g@w` (è per questo che hai `return g@`). Poiché `g@` è l'operatore funzione, lo stai passando il movimento `w`. Quindi Vim, una volta ricevuto `g@w`, chiama `ToTitle` *un'altra volta* (non preoccuparti, non finirai in un ciclo infinito come vedrai tra poco).

Per riassumere, premendo `gtw`, Vim controlla se `opfunc` è vuoto o meno. Se è vuoto, Vim lo assegnerà a `ToTitle`. Poi restituisce `g@`, essenzialmente chiamando `ToTitle` un'altra volta in modo che tu possa usarlo come operatore. Questa è la parte più complicata per creare un operatore personalizzato e ce l'hai fatta! Ora devi costruire la logica per `ToTitle()` per effettivamente cambiare in maiuscolo l'input.

## Elaborazione dell'Input

Ora hai `gt` che funge da operatore che esegue `ToTitle()`. Ma cosa fai dopo? Come fai effettivamente a cambiare in maiuscolo il testo?

Ogni volta che esegui un operatore in Vim, ci sono tre diversi tipi di movimento d'azione: carattere, riga e blocco. `g@w` (parola) è un esempio di operazione carattere. `g@j` (una riga sotto) è un esempio di operazione riga. L'operazione a blocco è rara, ma tipicamente quando esegui l'operazione `Ctrl-V` (blocco visivo), verrà conteggiata come un'operazione a blocco. Le operazioni che mirano a pochi caratteri avanti / indietro sono generalmente considerate operazioni carattere (`b`, `e`, `w`, `ge`, ecc.). Le operazioni che mirano a poche righe verso il basso / verso l'alto sono generalmente considerate operazioni riga (`j`, `k`). Le operazioni che mirano a colonne avanti, indietro, verso l'alto o verso il basso sono generalmente considerate operazioni a blocco (di solito sono un movimento forzato colonnare o una modalità visiva a blocchi; per ulteriori informazioni: `:h forced-motion`).

Questo significa che, se premi `g@w`, `g@` passerà una stringa letterale `"char"` come argomento a `ToTitle()`. Se fai `g@j`, `g@` passerà una stringa letterale `"line"` come argomento a `ToTitle()`. Questa stringa è ciò che verrà passato alla funzione `ToTitle` come argomento `type`.

## Creare il Proprio Operatore Funzione Personalizzato

Facciamo una pausa e giochiamo con `g@` scrivendo una funzione fittizia:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Ora assegna quella funzione a `opfunc` eseguendo:

```shell
:set opfunc=Test
```

L'operatore `g@` eseguirà `Test(some_arg)` e lo passerà con `"char"`, `"line"` o `"block"` a seconda di quale operazione esegui. Esegui diverse operazioni come `g@iw` (parola interna), `g@j` (una riga sotto), `g@$` (fino alla fine della riga), ecc. Vedi quali valori diversi vengono visualizzati. Per testare l'operazione a blocco, puoi usare il movimento forzato di Vim per le operazioni a blocco: `g@Ctrl-Vj` (operazione a blocco una colonna sotto).

Puoi anche usarlo con la modalità visiva. Usa i vari evidenziamenti visivi come `v`, `V` e `Ctrl-V`, poi premi `g@` (stai attento, mostrerà l'output dell'eco molto rapidamente, quindi devi avere un occhio veloce - ma l'eco è sicuramente lì. Inoltre, poiché stai usando `echom`, puoi controllare i messaggi di eco registrati con `:messages`).

Abbastanza interessante, vero? Le cose che puoi programmare con Vim! Perché non hanno insegnato questo a scuola? Continuiamo con il nostro plugin.

## ToTitle Come Funzione

Passando alle prossime righe:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Questa riga in realtà non ha nulla a che fare con il comportamento di `ToTitle()` come operatore, ma per abilitarlo come funzione TitleCase chiamabile (sì, so che sto violando il Principio di Responsabilità Unica). La motivazione è che Vim ha le funzioni native `toupper()` e `tolower()` che convertiranno in maiuscolo e in minuscolo qualsiasi stringa data. Ad esempio: `:echo toupper('hello')` restituisce `'HELLO'` e `:echo tolower('HELLO')` restituisce `'hello'`. Voglio che questo plugin abbia la capacità di eseguire `ToTitle` in modo che tu possa fare `:echo ToTitle('una volta c'era')` e ottenere un valore di ritorno `'Una Volta C'era'`.

Ormai sai che quando chiami `ToTitle(type)` con `g@`, l'argomento `type` avrà un valore di `'block'`, `'line'` o `'char'`. Se l'argomento non è né `'block'` né `'line'` né `'char'`, puoi presumere in sicurezza che `ToTitle()` venga chiamato al di fuori di `g@`. In tal caso, li dividi per spazi bianchi (`\s\+`) con:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Poi capitalizzi ogni elemento:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Prima di unirli di nuovo insieme:

```shell
l:wordsArr->join(' ')
```

La funzione `capitalize()` sarà trattata più avanti.

## Variabili Temporanee

Le prossime righe:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Queste righe preservano vari stati correnti in variabili temporanee. Più avanti in questo utilizzerai modalità visive, segni e registri. Fare ciò influenzerà alcuni stati. Poiché non vuoi rivedere la cronologia, devi salvarli in variabili temporanee in modo da poter ripristinare gli stati in seguito.
## Capitalizzare le Selezioni

Le prossime righe sono importanti:

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
Esaminiamole in piccoli pezzi. Questa riga:

```shell
set clipboard= selection=inclusive
```

Imposti prima l'opzione `selection` per essere inclusiva e il `clipboard` per essere vuoto. L'attributo di selezione è tipicamente usato con la modalità visiva e ci sono tre possibili valori: `old`, `inclusive` e `exclusive`. Impostarlo come inclusivo significa che l'ultimo carattere della selezione è incluso. Non ne parlerò qui, ma il punto è che sceglierlo come inclusivo lo fa comportare in modo coerente nella modalità visiva. Per impostazione predefinita, Vim lo imposta come inclusivo, ma lo imposti qui comunque nel caso in cui uno dei tuoi plugin lo imposti su un valore diverso. Dai un'occhiata a `:h 'clipboard'` e `:h 'selection'` se sei curioso di sapere cosa fanno realmente.

Successivamente hai questo hash dall'aspetto strano seguito da un comando di esecuzione:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Prima di tutto, la sintassi `#{}` è il tipo di dato dizionario di Vim. La variabile locale `l:commands` è un hash con 'lines', 'char' e 'block' come chiavi. Il comando `silent exe '...'` esegue qualsiasi comando all'interno della stringa silenziosamente (altrimenti visualizzerà notifiche nella parte inferiore dello schermo).

In secondo luogo, i comandi eseguiti sono `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. Il primo, `noautocmd`, eseguirà il comando successivo senza attivare alcun autocomando. Il secondo, `keepjumps`, serve a non registrare il movimento del cursore mentre ci si sposta. In Vim, alcuni movimenti vengono automaticamente registrati nella lista delle modifiche, nella lista dei salti e nella lista dei segni. Questo lo previene. Il punto di avere `noautocmd` e `keepjumps` è prevenire effetti collaterali. Infine, il comando `normal` esegue le stringhe come comandi normali. Il `..` è la sintassi di interpolazione delle stringhe di Vim. `get()` è un metodo getter che accetta un elenco, un blob o un dizionario. In questo caso, stai passando il dizionario `l:commands`. La chiave è `a:type`. Hai appreso in precedenza che `a:type` è uno dei tre valori di stringa: 'char', 'line' o 'block'. Quindi, se `a:type` è 'line', eseguirai `"noautocmd keepjumps normal! '[V']y"` (per ulteriori informazioni, controlla `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal` e `:h get()`).

Esaminiamo cosa fa `'[V']y`. Prima di tutto, supponi di avere questo corpo di testo:

```shell
the second breakfast
is better than the first breakfast
```
Supponi che il cursore sia sulla prima riga. Poi premi `g@j` (esegui la funzione operatore, `g@`, una riga sotto, con `j`). `'[` sposta il cursore all'inizio del testo precedentemente cambiato o yanked. Anche se tecnicamente non hai cambiato o yanked alcun testo con `g@j`, Vim ricorda le posizioni dei movimenti di inizio e fine del comando `g@` con `'[` e `']` (per ulteriori informazioni, controlla `:h g@`). Nel tuo caso, premere `'[` sposta il cursore sulla prima riga perché è lì che hai iniziato quando hai eseguito `g@`. `V` è un comando della modalità visiva a livello di riga. Infine, `']` sposta il cursore alla fine del testo precedentemente cambiato o yanked, ma in questo caso, sposta il cursore alla fine della tua ultima operazione `g@`. Infine, `y` yanks il testo selezionato.

Quello che hai appena fatto è stato yankare lo stesso corpo di testo su cui hai eseguito `g@`.

Se guardi gli altri due comandi qui:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Eseguono tutti azioni simili, tranne che invece di utilizzare azioni a livello di riga, utilizzeresti azioni a livello di carattere o a livello di blocco. Suonerò ridondante, ma in tutti e tre i casi stai effettivamente yankando lo stesso corpo di testo su cui hai eseguito `g@`.

Guardiamo la riga successiva:

```shell
let l:selected_phrase = getreg('"')
```

Questa riga ottiene il contenuto del registro non nominato (`"`) e lo memorizza all'interno della variabile `l:selected_phrase`. Aspetta un attimo... non hai appena yankato un corpo di testo? Il registro non nominato contiene attualmente il testo che hai appena yankato. Questo è il modo in cui questo plugin è in grado di ottenere una copia del testo.

La riga successiva è un pattern di espressione regolare:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` e `\>` sono pattern di confine di parola. Il carattere che segue `\<` corrisponde all'inizio di una parola e il carattere che precede `\>` corrisponde alla fine di una parola. `\k` è il pattern della parola chiave. Puoi controllare quali caratteri Vim accetta come parole chiave con `:set iskeyword?`. Ricorda che il movimento `w` in Vim sposta il cursore a livello di parola. Vim ha una nozione preconcetta di cosa sia una "parola chiave" (puoi persino modificarle alterando l'opzione `iskeyword`). Dai un'occhiata a `:h /\<`, `:h /\>`, `:h /\k`, e `:h 'iskeyword'` per ulteriori informazioni. Infine, `*` significa zero o più del pattern successivo.

Nel grande schema delle cose, `'\<\k*\>'` corrisponde a una parola. Se hai una stringa:

```shell
one two three
```

Corrispondere a questo pattern ti darà tre corrispondenze: "one", "two" e "three".

Infine, hai un altro pattern:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Ricorda che il comando di sostituzione di Vim può essere utilizzato con un'espressione con `\={your-expression}`. Ad esempio, se vuoi maiuscolare la stringa "donut" nella riga corrente, puoi usare la funzione `toupper()` di Vim. Puoi ottenere questo eseguendo `:%s/donut/\=toupper(submatch(0))/g`. `submatch(0)` è un'espressione speciale utilizzata nel comando di sostituzione. Restituisce l'intero testo corrispondente.

Le due righe successive:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

L'espressione `line()` restituisce un numero di riga. Qui lo passi con il segno `'<`, che rappresenta la prima riga dell'ultima area visiva selezionata. Ricorda che hai usato la modalità visiva per yankare il testo. `'<` restituisce il numero di riga dell'inizio di quella selezione dell'area visiva. L'espressione `virtcol()` restituisce un numero di colonna del cursore corrente. Ti muoverai con il cursore in giro tra poco, quindi devi memorizzare la posizione del cursore in modo da poter tornare qui più tardi.

Fai una pausa qui e rivedi tutto finora. Assicurati di seguire ancora. Quando sei pronto, continuiamo.
## Gestire un'Operazione a Blocchi

Esaminiamo questa sezione:

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

È tempo di capitalizzare effettivamente il tuo testo. Ricorda che hai `a:type` che può essere 'char', 'line' o 'block'. Nella maggior parte dei casi, probabilmente riceverai 'char' e 'line'. Ma occasionalmente potresti ottenere un blocco. È raro, ma deve essere affrontato comunque. Sfortunatamente, gestire un blocco non è semplice come gestire char e line. Ci vorrà un po' di impegno extra, ma è fattibile.

Prima di iniziare, prendiamo un esempio di come potresti ottenere un blocco. Supponi di avere questo testo:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner
```

Supponi che il tuo cursore sia sulla "c" di "pancake" sulla prima riga. Poi usi il blocco visivo (`Ctrl-V`) per selezionare verso il basso e in avanti per selezionare il "cake" in tutte e tre le righe:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner
```

Quando premi `gt`, vuoi ottenere:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

```
Ecco le tue assunzioni di base: quando evidenzi i tre "cake" in "pancakes", stai dicendo a Vim che hai tre righe di parole che vuoi evidenziare. Queste parole sono "cake", "cake" e "cake". Ti aspetti di ottenere "Cake", "Cake" e "Cake".

Passiamo ai dettagli dell'implementazione. Le prossime righe hanno:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

La prima riga:

```shell
sil! keepj norm! gv"ad
```

Ricorda che `sil!` viene eseguito silenziosamente e `keepj` mantiene la cronologia dei salti durante il movimento. Poi esegui il comando normale `gv"ad`. `gv` seleziona l'ultimo testo evidenziato visivamente (nell'esempio dei pancake, ri-evidenzierà tutti e tre i 'cake'). `"ad` elimina i testi evidenziati visivamente e li memorizza nel registro a. Di conseguenza, ora hai:

```shell
pan for breakfast
pan for lunch
pan for dinner
```

Ora hai 3 *blocchi* (non righe) di 'cake' memorizzati nel registro a. Questa distinzione è importante. Copiare un testo con la modalità visiva per righe è diverso dal copiare un testo con la modalità visiva a blocchi. Tieni presente questo perché lo vedrai di nuovo più avanti.

Poi hai:

```shell
keepj $
keepj pu_
```

`$` ti sposta all'ultima riga del tuo file. `pu_` inserisce una riga sotto dove si trova il cursore. Vuoi eseguirli con `keepj` in modo da non alterare la cronologia dei salti.

Poi memorizzi il numero di riga della tua ultima riga (`line("$")`) nella variabile locale `lastLine`.

```shell
let l:lastLine = line("$")
```

Poi incolli il contenuto dal registro con `norm "ap`.

```shell
sil! keepj norm "ap
```

Tieni presente che questo sta accadendo sulla nuova riga che hai creato sotto l'ultima riga del file - attualmente sei in fondo al file. Incollare ti dà questi testi *a blocchi*:

```shell
cake
cake
cake
```

Successivamente, memorizzi la posizione della riga corrente in cui si trova il cursore.

```shell
let l:curLine = line(".")
```

Ora andiamo alle prossime righe:

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

Questa riga:

```shell
sil! keepj norm! VGg@
```

`VG` evidenzia visivamente con la modalità visiva per righe dalla riga corrente fino alla fine del file. Quindi qui stai evidenziando i tre blocchi di testi 'cake' con evidenziazione per righe (ricorda la distinzione tra blocco e riga). Nota che la prima volta che hai incollato i tre testi "cake", li stavi incollando come blocchi. Ora li stai evidenziando come righe. Possono sembrare uguali dall'esterno, ma internamente, Vim conosce la differenza tra incollare blocchi di testi e incollare righe di testi.

```shell
cake
cake
cake
```

`g@` è l'operatore di funzione, quindi stai essenzialmente facendo una chiamata ricorsiva a se stesso. Ma perché? Cosa ottieni da questo?

Stai facendo una chiamata ricorsiva a `g@` e passando tutte e 3 le righe (dopo averlo eseguito con `V`, ora hai righe, non blocchi) di testi 'cake' in modo che vengano gestite dall'altra parte del codice (ci passerai sopra più tardi). Il risultato dell'esecuzione di `g@` è tre righe di testi correttamente capitalizzati:

```shell
Cake
Cake
Cake
```

La prossima riga:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Questo esegue il comando della modalità normale per andare all'inizio della riga (`0`), usa l'evidenziazione visiva a blocchi per andare all'ultima riga e all'ultimo carattere di quella riga (`<c-v>G$`). L'`h` serve ad aggiustare il cursore (quando si fa `$`, Vim si sposta di una riga in più a destra). Infine, elimini il testo evidenziato e lo memorizzi nel registro a (`"ad`).

La prossima riga:

```shell
exe "keepj " . l:startLine
```

Ti sposti di nuovo dove si trovava `startLine`.

Successivamente:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

Essendo nella posizione `startLine`, ora salti alla colonna contrassegnata da `startCol`. `\<bar>\` è il movimento della barra `|`. Il movimento della barra in Vim sposta il cursore alla n-esima colonna (diciamo che `startCol` era 4. Eseguire `4|` farà saltare il cursore alla posizione della colonna 4). Ricorda che `startCol` era la posizione in cui hai memorizzato la posizione della colonna del testo che volevi capitalizzare. Infine, `"aP` incolla i testi memorizzati nel registro a. Questo rimette il testo dove era stato eliminato prima.

Esaminiamo le prossime 4 righe:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` sposta il cursore di nuovo nella posizione `lastLine` di prima. `sil! keepj norm! "_dG` elimina lo spazio extra che è stato creato utilizzando il registro blackhole (`"_dG`) in modo che il tuo registro non nominato rimanga pulito. `exe "keepj " . l:startLine` sposta il cursore di nuovo a `startLine`. Infine, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` sposta il cursore alla colonna `startCol`.

Queste sono tutte le azioni che avresti potuto fare manualmente in Vim. Tuttavia, il vantaggio di trasformare queste azioni in funzioni riutilizzabili è che ti risparmieranno dall'eseguire 30+ righe di istruzioni ogni volta che hai bisogno di capitalizzare qualcosa. La lezione qui è che qualsiasi cosa tu possa fare manualmente in Vim, puoi trasformarla in una funzione riutilizzabile, quindi in un plugin!

Ecco come apparirebbe.

Dato un testo:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner

... qualche testo
```

Prima, evidenziarlo visivamente a blocchi:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner

... qualche testo
```

Poi lo elimini e memorizzi quel testo nel registro a:

```shell
pan for breakfast
pan for lunch
pan for dinner

... qualche testo
```

Poi lo incolli in fondo al file:

```shell
pan for breakfast
pan for lunch
pan for dinner

... qualche testo
cake
cake
cake
```

Poi lo capitalizzi:

```shell
pan for breakfast
pan for lunch
pan for dinner

... qualche testo
Cake
Cake
Cake
```

Infine, rimetti il testo capitalizzato:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

... qualche testo
```

## Gestire Operazioni su Righe e Caratteri

Non hai ancora finito. Hai solo affrontato il caso limite quando esegui `gt` su testi a blocchi. Devi ancora gestire le operazioni 'line' e 'char'. Esaminiamo il codice `else` per vedere come viene fatto.

Ecco i codici:

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

Esaminiamoli riga per riga. La salsa segreta di questo plugin è effettivamente su questa riga:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` contiene il testo dal registro non nominato da capitalizzare. `l:WORD_PATTERN` è la corrispondenza della parola individuale. `l:UPCASE_REPLACEMENT` è la chiamata al comando `capitalize()` (che vedrai più tardi). Il `'g'` è il flag globale che istruisce il comando di sostituzione a sostituire tutte le parole date, non solo la prima parola.

La riga successiva:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Questo garantisce che la prima parola sarà sempre capitalizzata. Se hai una frase come "una mela al giorno toglie il medico di torno", poiché la prima parola, "una", è una parola speciale, il tuo comando di sostituzione non la capitalizzerà. Hai bisogno di un metodo che capitalizzi sempre il primo carattere indipendentemente da tutto. Questa funzione fa proprio questo (vedrai i dettagli di questa funzione più tardi). Il risultato di questi metodi di capitalizzazione è memorizzato nella variabile locale `l:titlecased`.

La riga successiva:

```shell
call setreg('"', l:titlecased)
```

Questo mette la stringa capitalizzata nel registro non nominato (`"`).

Successivamente, le due righe seguenti:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Ehi, questo sembra familiare! Hai visto un modello simile prima con `l:commands`. Invece di yank, qui usi incolla (`p`). Controlla la sezione precedente dove ho esaminato `l:commands` per un ripasso.

Infine, queste due righe:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Ti stai spostando di nuovo alla riga e alla colonna da cui sei partito. Questo è tutto!

Ricapitoliamo. Il metodo di sostituzione sopra è abbastanza intelligente da capitalizzare i testi dati e saltare le parole speciali (di più su questo più tardi). Dopo aver ottenuto una stringa capitalizzata, la memorizzi nel registro non nominato. Poi evidenzi visivamente esattamente lo stesso testo su cui hai operato `g@` prima, quindi incolli dal registro non nominato (questo sostituisce effettivamente i testi non capitalizzati con la versione capitalizzata). Infine, muovi il cursore di nuovo dove sei partito.
## Pulizie

Sei tecnicamente a posto. I testi sono ora in formato titlecase. Tutto ciò che resta da fare è ripristinare i registri e le impostazioni.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Questi ripristinano:
- il registro non nominato.
- i segni `<` e `>`.
- le opzioni `'clipboard'` e `'selection'`.

Uff, hai finito. È stata una lunga funzione. Avrei potuto rendere la funzione più corta suddividendola in parti più piccole, ma per ora, questo dovrà bastare. Ora rivediamo brevemente le funzioni di capitalizzazione.

## La Funzione di Capitalizzazione

In questa sezione, rivediamo la funzione `s:capitalize()`. Ecco come appare la funzione:

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

Ricorda che l'argomento per la funzione `capitalize()`, `a:string`, è la singola parola passata dall'operatore `g@`. Quindi, se sto eseguendo `gt` sul testo "pancake for breakfast", `ToTitle` chiamerà `capitalize(string)` *tre* volte, una per "pancake", una per "for" e una per "breakfast".

La prima parte della funzione è:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

La prima condizione (`toupper(a:string) ==# a:string`) verifica se la versione maiuscola dell'argomento è la stessa della stringa e se la stringa stessa è "A". Se queste sono vere, restituisci quella stringa. Questo si basa sull'assunzione che se una data parola è già completamente maiuscola, allora è un'abbreviazione. Ad esempio, la parola "CEO" altrimenti verrebbe convertita in "Ceo". Hmm, il tuo CEO non sarà felice. Quindi è meglio lasciare qualsiasi parola completamente maiuscola così com'è. La seconda condizione, `a:string != 'A'`, affronta un caso limite per un carattere "A" maiuscolo. Se `a:string` è già una "A" maiuscola, sarebbe accidentalmente passata al test `toupper(a:string) ==# a:string`. Poiché "a" è un articolo indeterminato in inglese, deve essere scritto in minuscolo.

La parte successiva forza la stringa a essere convertita in minuscolo:

```shell
let l:str = tolower(a:string)
```

La parte successiva è una regex di un elenco di tutte le esclusioni delle parole. Le ho ottenute da https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

La parte successiva:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Prima, controlla se la tua stringa è parte dell'elenco delle parole escluse (`l:exclusions`). Se lo è, non capitalizzarla. Poi controlla se la tua stringa è parte dell'elenco di esclusione locale (`s:local_exclusion_list`). Questo elenco di esclusione è un elenco personalizzato che l'utente può aggiungere in vimrc (nel caso in cui l'utente abbia requisiti aggiuntivi per parole speciali).

L'ultima parte restituisce la versione capitalizzata della parola. Il primo carattere è maiuscolo mentre il resto rimane così com'è.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Rivediamo la seconda funzione di capitalizzazione. La funzione appare così:

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

Questa funzione è stata creata per gestire un caso limite se hai una frase che inizia con una parola esclusa, come "an apple a day keeps the doctor away". In base alle regole di capitalizzazione della lingua inglese, tutte le prime parole in una frase, indipendentemente dal fatto che siano parole speciali o meno, devono essere capitalizzate. Con il tuo comando `substitute()` da solo, "an" nella tua frase verrebbe scritto in minuscolo. Devi forzare il primo carattere a essere maiuscolo.

In questa funzione `capitalizeFirstWord`, l'argomento `a:string` non è una singola parola come `a:string` all'interno della funzione `capitalize`, ma piuttosto l'intero testo. Quindi, se hai "pancake for breakfast", il valore di `a:string` è "pancake for breakfast". Viene eseguita `capitalizeFirstWord` una sola volta per l'intero testo.

Uno scenario a cui devi prestare attenzione è se hai una stringa multi-linea come `"an apple a day\nkeeps the doctor away"`. Vuoi maiuscolare il primo carattere di tutte le righe. Se non hai nuove righe, allora semplicemente maiuscola il primo carattere.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Se hai nuove righe, devi maiuscolare tutti i primi caratteri in ogni riga, quindi le dividi in un array separate da nuove righe:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Poi mappi ogni elemento nell'array e maiuscoli il primo word di ogni elemento:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Infine, metti insieme gli elementi dell'array:

```shell
return l:lineArr->join("\n")
```

E hai finito!

## Documenti

La seconda directory nel repository è la directory `docs/`. È utile fornire al plugin una documentazione completa. In questa sezione, rivedrò brevemente come creare la tua documentazione per il plugin.

La directory `docs/` è uno dei percorsi speciali di runtime di Vim. Vim legge tutti i file all'interno di `docs/`, quindi quando cerchi una parola chiave speciale e quella parola chiave è trovata in uno dei file nella directory `docs/`, verrà visualizzata nella pagina di aiuto. Qui hai un `totitle.txt`. L'ho chiamato in questo modo perché è il nome del plugin, ma puoi chiamarlo come vuoi.

Un file di documentazione di Vim è fondamentalmente un file txt. La differenza tra un file txt normale e un file di aiuto di Vim è che quest'ultimo utilizza sintassi speciali "di aiuto". Ma prima, devi dire a Vim di trattarlo non come un tipo di file di testo, ma come un tipo di file `help`. Per dire a Vim di interpretare questo `totitle.txt` come un file *di aiuto*, esegui `:set ft=help` (`:h 'filetype'` per ulteriori informazioni). A proposito, se vuoi dire a Vim di interpretare questo `totitle.txt` come un file txt *normale*, esegui `:set ft=txt`.

### La Sintassi Speciale del File di Aiuto

Per rendere una parola chiave scoperta, circondala con asterischi. Per rendere la parola chiave `totitle` scoperta quando l'utente cerca `:h totitle`, scrivila come `*totitle*` nel file di aiuto.

Ad esempio, ho queste righe in cima al mio indice:

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

// più cose TOC
```

Nota che ho usato due parole chiave: `*totitle*` e `*totitle-toc*` per contrassegnare la sezione dell'indice. Puoi usare quante più parole chiave vuoi. Questo significa che ogni volta che cerchi `:h totitle` o `:h totitle-toc`, Vim ti porterà a questa posizione.

Ecco un altro esempio, da qualche parte nel file:

```shell
2. Uso                                                       *totitle-usage*

// uso
```

Se cerchi `:h totitle-usage`, Vim ti porterà a questa sezione.

Puoi anche usare collegamenti interni per riferirti a un'altra sezione nel file di aiuto circondando una parola chiave con la sintassi della barra `|`. Nella sezione TOC, vedi parole chiave circondate dalle barre, come `|totitle-intro|`, `|totitle-usage|`, ecc.

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

    1. Introduzione ........................... |totitle-intro|
    2. Uso ........................... |totitle-usage|
    3. Parole da capitalizzare ............. |totitle-words|
    4. Operatore ........................ |totitle-operator|
    5. Associazione tasti ..................... |totitle-keybinding|
    6. Bug ............................ |totitle-bug-report|
    7. Contribuire .................... |totitle-contributing|
    8. Crediti ......................... |totitle-credits|

```
Questo ti consente di saltare alla definizione. Se metti il cursore da qualche parte su `|totitle-intro|` e premi `Ctrl-]`, Vim salterà alla definizione di quella parola. In questo caso, salterà alla posizione `*totitle-intro*`. Questo è il modo in cui puoi collegarti a parole chiave diverse in un documento di aiuto.

Non c'è un modo giusto o sbagliato per scrivere un file di documentazione in Vim. Se guardi diversi plugin di autori diversi, molti di loro usano formati diversi. L'importante è creare un documento di aiuto facile da capire per i tuoi utenti.

Infine, se stai scrivendo il tuo plugin localmente all'inizio e vuoi testare la pagina di documentazione, semplicemente aggiungere un file txt all'interno di `~/.vim/docs/` non renderà automaticamente le tue parole chiave ricercabili. Devi istruire Vim ad aggiungere la tua pagina di documentazione. Esegui il comando helptags: `:helptags ~/.vim/doc` per creare nuovi file di tag. Ora puoi iniziare a cercare le tue parole chiave.

## Conclusione

Sei arrivato alla fine! Questo capitolo è l'amalgama di tutti i capitoli di Vimscript. Qui stai finalmente mettendo in pratica ciò che hai imparato finora. Speriamo che, dopo aver letto questo, tu abbia capito non solo come creare plugin Vim, ma anche che ti abbia incoraggiato a scrivere il tuo plugin.

Ogni volta che ti trovi a ripetere la stessa sequenza di azioni più volte, dovresti provare a creare il tuo! È stato detto che non dovresti reinventare la ruota. Tuttavia, penso che possa essere utile reinventare la ruota per il bene dell'apprendimento. Leggi i plugin di altre persone. Ricreali. Impara da loro. Scrivi il tuo! Chissà, magari scriverai il prossimo fantastico plugin super popolare dopo aver letto questo. Magari sarai il prossimo leggendario Tim Pope. Quando ciò accadrà, fammi sapere!