---
description: Scopri come utilizzare le pieghe in Vim per nascondere testi irrilevanti,
  migliorando la leggibilità dei file senza eliminare il contenuto.
title: Ch17. Fold
---

Quando leggi un file, spesso ci sono molti testi irrilevanti che ostacolano la comprensione di cosa faccia quel file. Per nascondere il rumore inutile, usa Vim fold.

In questo capitolo, imparerai diversi modi per piegare un file.

## Piegatura Manuale

Immagina di piegare un foglio di carta per coprire del testo. Il testo effettivo non scompare, è ancora lì. La piegatura di Vim funziona allo stesso modo. Piega un intervallo di testo, nascondendolo dalla visualizzazione senza eliminarlo effettivamente.

L'operatore di piegatura è `z` (quando un foglio è piegato, assume la forma della lettera z).

Supponi di avere questo testo:

```shell
Fold me
Hold me
```

Con il cursore sulla prima riga, digita `zfj`. Vim piega entrambe le righe in una. Dovresti vedere qualcosa del genere:

```shell
+-- 2 lines: Fold me -----
```

Ecco la suddivisione:
- `zf` è l'operatore di piegatura.
- `j` è il movimento per l'operatore di piegatura.

Puoi aprire un testo piegato con `zo`. Per chiudere la piegatura, usa `zc`.

La piegatura è un operatore, quindi segue la regola grammaticale (`verbo + sostantivo`). Puoi passare l'operatore di piegatura con un movimento o un oggetto di testo. Per piegare un paragrafo interno, esegui `zfip`. Per piegare fino alla fine di un file, esegui `zfG`. Per piegare i testi tra `{` e `}`, esegui `zfa{`.

Puoi piegare dalla modalità visiva. Evidenzia l'area che desideri piegare (`v`, `V` o `Ctrl-v`), quindi esegui `zf`.

Puoi eseguire una piegatura dalla modalità della riga di comando con il comando `:fold`. Per piegare la riga corrente e la riga successiva, esegui:

```shell
:,+1fold
```

`,+1` è l'intervallo. Se non passi parametri all'intervallo, predefinito è la riga corrente. `+1` è l'indicatore di intervallo per la riga successiva. Per piegare le righe da 5 a 10, esegui `:5,10fold`. Per piegare dalla posizione corrente fino alla fine della riga, esegui `:,$fold`.

Ci sono molti altri comandi di piegatura e dispiegatura. Ne trovo troppi da ricordare quando si inizia. I più utili sono:
- `zR` per aprire tutte le piegature.
- `zM` per chiudere tutte le piegature.
- `za` per attivare/disattivare una piegatura.

Puoi eseguire `zR` e `zM` su qualsiasi riga, ma `za` funziona solo quando sei su una riga piegata / dispiegata. Per saperne di più sui comandi di piegatura, controlla `:h fold-commands`.

## Metodi di Piegatura Diversi

La sezione sopra copre la piegatura manuale di Vim. Ci sono sei diversi metodi di piegatura in Vim:
1. Manuale
2. Indentazione
3. Espressione
4. Sintassi
5. Diff
6. Marker

Per vedere quale metodo di piegatura stai attualmente utilizzando, esegui `:set foldmethod?`. Per impostazione predefinita, Vim utilizza il metodo `manual`.

Nel resto del capitolo, imparerai gli altri cinque metodi di piegatura. Iniziamo con la piegatura per indentazione.

## Piegatura per Indentazione

Per utilizzare una piegatura per indentazione, cambia il `'foldmethod'` in indentazione:

```shell
:set foldmethod=indent
```

Supponi di avere il testo:

```shell
One
  Two
  Two again
```

Se esegui `:set foldmethod=indent`, vedrai:

```shell
One
+-- 2 lines: Two -----
```

Con la piegatura per indentazione, Vim guarda quanti spazi ha ogni riga all'inizio e lo confronta con l'opzione `'shiftwidth'` per determinare la sua piegabilità. `'shiftwidth'` restituisce il numero di spazi richiesti per ogni passo dell'indentazione. Se esegui:

```shell
:set shiftwidth?
```

Il valore predefinito di `'shiftwidth'` di Vim è 2. Nel testo sopra, ci sono due spazi tra l'inizio della riga e il testo "Two" e "Two again". Quando Vim vede il numero di spazi e che il valore di `'shiftwidth'` è 2, considera che quella riga abbia un livello di piegatura di uno.

Supponi che questa volta tu abbia solo uno spazio tra l'inizio della riga e il testo:

```shell
One
 Two
 Two again
```

In questo momento se esegui `:set foldmethod=indent`, Vim non piega la riga indentata perché non c'è spazio sufficiente su ciascuna riga. Uno spazio non è considerato un'indentazione. Tuttavia, se cambi il `'shiftwidth'` in 1:

```shell
:set shiftwidth=1
```

Il testo è ora piegabile. Ora è considerato un'indentazione.

Ripristina il `shiftwidth` a 2 e gli spazi tra i testi a due di nuovo. Inoltre, aggiungi due testi aggiuntivi:

```shell
One
  Two
  Two again
    Three
    Three again
```

Esegui la piegatura (`zM`), vedrai:

```shell
One
+-- 4 lines: Two -----
```

Dispiega le righe piegate (`zR`), quindi posiziona il cursore su "Three" e attiva/disattiva lo stato di piegatura del testo (`za`):

```shell
One
  Two
  Two again
+-- 2 lines: Three -----
```

Che cos'è questo? Una piegatura all'interno di una piegatura?

Le piegature annidate sono valide. Il testo "Two" e "Two again" hanno un livello di piegatura di uno. Il testo "Three" e "Three again" hanno un livello di piegatura di due. Se hai un testo piegabile con un livello di piegatura più alto all'interno di un testo piegabile, avrai più livelli di piegatura.

## Piegatura per Espressione

La piegatura per espressione ti consente di definire un'espressione da abbinare per una piegatura. Dopo aver definito le espressioni di piegatura, Vim esamina ogni riga per il valore di `'foldexpr'`. Questa è la variabile che devi configurare per restituire il valore appropriato. Se il `'foldexpr'` restituisce 0, allora la riga non è piegata. Se restituisce 1, allora quella riga ha un livello di piegatura di 1. Se restituisce 2, allora quella riga ha un livello di piegatura di 2. Ci sono più valori oltre agli interi, ma non li esaminerò. Se sei curioso, controlla `:h fold-expr`.

Prima, cambiamo il metodo di piegatura:

```shell
:set foldmethod=expr
```

Supponi di avere un elenco di cibi per colazione e vuoi piegare tutti gli elementi della colazione che iniziano con "p":

```shell
donut
pancake
pop-tarts
protein bar
salmon
scrambled eggs
```

Successivamente, cambia il `foldexpr` per catturare le espressioni che iniziano con "p":

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

L'espressione sopra sembra complicata. Scomponiamola:
- `:set foldexpr` imposta l'opzione `'foldexpr'` per accettare un'espressione personalizzata.
- `getline()` è una funzione Vimscript che restituisce il contenuto di una riga qualsiasi. Se esegui `:echo getline(5)`, restituirà il contenuto della riga 5.
- `v:lnum` è la variabile speciale di Vim per l'espressione `'foldexpr'`. Vim esamina ogni riga e in quel momento memorizza il numero di ogni riga nella variabile `v:lnum`. Nella riga 5, `v:lnum` ha valore 5. Nella riga 10, `v:lnum` ha valore 10.
- `[0]` nel contesto di `getline(v:lnum)[0]` è il primo carattere di ogni riga. Quando Vim esamina una riga, `getline(v:lnum)` restituisce il contenuto di ogni riga. `getline(v:lnum)[0]` restituisce il primo carattere di ogni riga. Nella prima riga della nostra lista, "donut", `getline(v:lnum)[0]` restituisce "d". Nella seconda riga della nostra lista, "pancake", `getline(v:lnum)[0]` restituisce "p".
- `==\\"p\\"` è la seconda metà dell'espressione di uguaglianza. Controlla se l'espressione che hai appena valutato è uguale a "p". Se è vero, restituisce 1. Se è falso, restituisce 0. In Vim, 1 è vero e 0 è falso. Quindi sulle righe che iniziano con una "p", restituisce 1. Ricorda se un `'foldexpr'` ha un valore di 1, allora ha un livello di piegatura di 1.

Dopo aver eseguito questa espressione, dovresti vedere:

```shell
donut
+-- 3 lines: pancake -----
salmon
scrambled eggs
```

## Piegatura per Sintassi

La piegatura per sintassi è determinata dall'evidenziazione della sintassi del linguaggio. Se utilizzi un plugin di sintassi del linguaggio come [vim-polyglot](https://github.com/sheerun/vim-polyglot), la piegatura per sintassi funzionerà immediatamente. Basta cambiare il metodo di piegatura in sintassi:

```shell
:set foldmethod=syntax
```

Supponiamo che tu stia modificando un file JavaScript e abbia installato vim-polyglot. Se hai un array come il seguente:

```shell
const nums = [
  one,
  two,
  three,
  four
]
```

Sarà piegato con una piegatura per sintassi. Quando definisci un'evidenziazione della sintassi per un linguaggio particolare (tipicamente all'interno della directory `syntax/`), puoi aggiungere un attributo `fold` per renderlo piegabile. Qui sotto c'è un frammento dal file di sintassi JavaScript di vim-polyglot. Nota la parola chiave `fold` alla fine.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Questa guida non tratterà la funzionalità `syntax`. Se sei curioso, controlla `:h syntax.txt`.

## Piegatura Diff

Vim può eseguire una procedura di diff per confrontare due o più file.

Se hai `file1.txt`:

```shell
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
```

E `file2.txt`:

```shell
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
emacs is ok
```

Esegui `vimdiff file1.txt file2.txt`:

```shell
+-- 3 lines: vim is awesome -----
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
[vim is awesome] / [emacs is ok]
```

Vim piega automaticamente alcune delle righe identiche. Quando esegui il comando `vimdiff`, Vim utilizza automaticamente `foldmethod=diff`. Se esegui `:set foldmethod?`, restituirà `diff`.

## Piegatura Marker

Per utilizzare una piegatura marker, esegui:

```shell
:set foldmethod=marker
```

Supponi di avere il testo:

```shell
Hello

{{{
world
vim
}}}
```

Esegui `zM`, vedrai:

```shell
hello

+-- 4 lines: -----
```

Vim vede `{{{` e `}}}` come indicatori di piegatura e piega i testi tra di essi. Con la piegatura marker, Vim cerca marker speciali, definiti dall'opzione `'foldmarker'`, per contrassegnare le aree di piegatura. Per vedere quali marker utilizza Vim, esegui:

```shell
:set foldmarker?
```

Per impostazione predefinita, Vim utilizza `{{{` e `}}}` come indicatori. Se desideri cambiare l'indicatore in altri testi, come "coffee1" e "coffee2":

```shell
:set foldmarker=coffee1,coffee2
```

Se hai il testo:

```shell
hello

coffee1
world
vim
coffee2
```

Ora Vim utilizza `coffee1` e `coffee2` come i nuovi marker di piegatura. Come nota a margine, un indicatore deve essere una stringa letterale e non può essere una regex.

## Persistenza della Piegatura

Perdi tutte le informazioni sulla piegatura quando chiudi la sessione di Vim. Se hai questo file, `count.txt`:

```shell
one
two
three
four
five
```

Quindi fai una piegatura manuale dalla riga "three" in giù (`:3,$fold`):

```shell
one
two
+-- 3 lines: three ---
```

Quando esci da Vim e riapri `count.txt`, le piegature non ci sono più!

Per preservare le piegature, dopo aver piegato, esegui:

```shell
:mkview
```

Poi quando apri `count.txt`, esegui:

```shell
:loadview
```

Le tue piegature vengono ripristinate. Tuttavia, devi eseguire manualmente `mkview` e `loadview`. So che un giorno dimenticherò di eseguire `mkview` prima di chiudere il file e perderò tutte le piegature. Come possiamo automatizzare questo processo?

Per eseguire automaticamente `mkview` quando chiudi un file `.txt` e eseguire `loadview` quando apri un file `.txt`, aggiungi questo nel tuo vimrc:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Ricorda che `autocmd` viene utilizzato per eseguire un comando su un evento di attivazione. I due eventi qui sono:
- `BufWinLeave` per quando rimuovi un buffer da una finestra.
- `BufWinEnter` per quando carichi un buffer in una finestra.

Ora dopo aver piegato all'interno di un file `.txt` ed essere uscito da Vim, la prossima volta che apri quel file, le informazioni sulla tua piegatura verranno ripristinate.

Per impostazione predefinita, Vim salva le informazioni sulla piegatura quando esegue `mkview` all'interno di `~/.vim/view` per il sistema Unix. Per ulteriori informazioni, controlla `:h 'viewdir'`.
## Impara a Piegare nel Modo Intelligente

Quando ho iniziato a usare Vim, ho trascurato di imparare a piegare perché non pensavo fosse utile. Tuttavia, più codice scrivo, più trovo utile il folding. I piegamenti strategicamente posizionati possono darti una migliore panoramica della struttura del testo, come il sommario di un libro.

Quando impari a piegare, inizia con il piegamento manuale perché può essere utilizzato in movimento. Poi impara gradualmente diversi trucchi per fare piegamenti di indentazione e marcatori. Infine, impara come fare piegamenti di sintassi ed espressione. Puoi persino usare quest'ultimi due per scrivere i tuoi plugin Vim.