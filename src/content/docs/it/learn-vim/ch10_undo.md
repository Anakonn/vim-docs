---
description: Scopri come utilizzare il sistema di annullamento di Vim per gestire
  modifiche, navigare tra stati di testo e ripristinare contenuti in modo efficace.
title: Ch10. Undo
---

Facciamo tutti vari errori di battitura. Ecco perché l'annullamento è una funzione essenziale in qualsiasi software moderno. Il sistema di annullamento di Vim non è solo in grado di annullare e ripetere errori semplici, ma anche di accedere a diversi stati di testo, dandoti il controllo su tutti i testi che hai mai digitato. In questo capitolo, imparerai come annullare, ripetere, navigare in un ramo di annullamento, persistere nell'annullamento e viaggiare nel tempo.

## Annulla, Ripeti e ANNULLA

Per eseguire un annullamento di base, puoi usare `u` o eseguire `:undo`.

Se hai questo testo (nota la riga vuota sotto "uno"):

```shell
uno

```

Poi aggiungi un altro testo:

```shell
uno
due
```

Se premi `u`, Vim annulla il testo "due".

Come fa Vim a sapere quanto annullare? Vim annulla un singolo "cambiamento" alla volta, simile al cambiamento di un comando punto (a differenza del comando punto, i comandi della riga di comando contano anche come un cambiamento).

Per ripetere l'ultimo cambiamento, premi `Ctrl-R` o esegui `:redo`. Dopo aver annullato il testo sopra per rimuovere "due", eseguendo `Ctrl-R` riporterai il testo rimosso.

Vim ha anche ANNULLA che puoi eseguire con `U`. Annulla tutti gli ultimi cambiamenti.

In cosa è diverso `U` da `u`? Prima di tutto, `U` rimuove *tutti* i cambiamenti sull'ultima riga modificata, mentre `u` rimuove solo un cambiamento alla volta. In secondo luogo, mentre eseguire `u` non conta come un cambiamento, eseguire `U` conta come un cambiamento.

Tornando a questo esempio:

```shell
uno
due
```

Cambia la seconda riga in "tre":

```shell
uno
tre
```

Cambia di nuovo la seconda riga e sostituiscila con "quattro":

```shell
uno
quattro
```

Se premi `u`, vedrai "tre". Se premi `u` di nuovo, vedrai "due". Se invece di premere `u` quando avevi ancora il testo "quattro", avessi premuto `U`, vedresti:

```shell
uno

```

`U` salta tutti i cambiamenti intermedi e torna allo stato originale quando hai iniziato (una riga vuota). Inoltre, poiché ANNULLA crea effettivamente un nuovo cambiamento in Vim, puoi ANNULLARE il tuo ANNULLA. `U` seguito da `U` annullerà se stesso. Puoi premere `U`, poi `U`, poi `U`, ecc. Vedrai gli stessi due stati di testo alternarsi.

Personalmente non uso `U` perché è difficile ricordare lo stato originale (raramente ne ho bisogno).

Vim imposta un numero massimo di quante volte puoi annullare nella variabile di opzione `undolevels`. Puoi controllarlo con `:echo &undolevels`. Io ho impostato il mio a 1000. Per cambiare il tuo a 1000, esegui `:set undolevels=1000`. Sentiti libero di impostarlo a qualsiasi numero tu voglia.

## Rompere i Blocchi

Ho menzionato prima che `u` annulla un singolo "cambiamento" simile al cambiamento del comando punto: i testi inseriti da quando entri in modalità di inserimento fino a quando esci contano come un cambiamento.

Se fai `ione due tre<Esc>` poi premi `u`, Vim rimuove l'intero testo "uno due tre" perché tutto conta come un cambiamento. Questo non è un grosso problema se hai scritto testi brevi, ma cosa succede se hai scritto diversi paragrafi all'interno di una sessione di modalità di inserimento senza uscire e poi ti sei reso conto di aver commesso un errore? Se premi `u`, tutto ciò che avevi scritto verrebbe rimosso. Non sarebbe utile se potessi premere `u` per rimuovere solo una sezione del tuo testo?

Fortunatamente, puoi rompere i blocchi di annullamento. Quando stai digitando in modalità di inserimento, premere `Ctrl-G u` crea un punto di interruzione per l'annullamento. Ad esempio, se fai `ione <Ctrl-G u>due <Ctrl-G u>tre<Esc>`, poi premi `u`, perderai solo il testo "tre" (premi `u` un'altra volta per rimuovere "due"). Quando scrivi un lungo testo, usa `Ctrl-G u` in modo strategico. La fine di ogni frase, tra due paragrafi o dopo ogni riga di codice sono posizioni prime per aggiungere punti di interruzione per l'annullamento per facilitare l'annullamento dei tuoi errori se mai ne commetti uno.

È anche utile creare un punto di interruzione per l'annullamento quando elimini porzioni in modalità di inserimento con `Ctrl-W` (elimina la parola prima del cursore) e `Ctrl-U` (elimina tutto il testo prima del cursore). Un amico ha suggerito di usare le seguenti mappature:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Con queste, puoi facilmente recuperare i testi eliminati.

## Albero di Annullamento

Vim memorizza ogni cambiamento mai scritto in un albero di annullamento. Inizia un nuovo file vuoto. Poi aggiungi un nuovo testo:

```shell
uno

```

Aggiungi un nuovo testo:

```shell
uno
due
```

Annulla una volta:

```shell
uno

```

Aggiungi un testo diverso:

```shell
uno
tre
```

Annulla di nuovo:

```shell
uno

```

E aggiungi un altro testo diverso:

```shell
uno
quattro
```

Ora se annulli, perderai il testo "quattro" che hai appena aggiunto:

```shell
uno

```

Se annulli un'altra volta:

```shell

```

Perderai il testo "uno". Nella maggior parte degli editor di testo, recuperare i testi "due" e "tre" sarebbe stato impossibile, ma non con Vim! Premi `g+` e riavrai il tuo testo "uno":

```shell
uno

```

Digita `g+` di nuovo e vedrai un vecchio amico:

```shell
uno
due
```

Continuiamo. Premi `g+` di nuovo:

```shell
uno
tre
```

Premi `g+` un'altra volta:

```shell
uno
quattro
```

In Vim, ogni volta che premi `u` e poi fai un cambiamento diverso, Vim memorizza il testo dello stato precedente creando un "ramo di annullamento". In questo esempio, dopo aver digitato "due", poi premuto `u`, poi digitato "tre", hai creato un ramo foglia che memorizza lo stato contenente il testo "due". A quel punto, l'albero di annullamento conteneva almeno due nodi foglia: il nodo principale contenente il testo "tre" (il più recente) e il nodo del ramo di annullamento contenente il testo "due". Se avessi fatto un altro annullamento e digitato il testo "quattro", avresti avuto tre nodi: un nodo principale contenente il testo "quattro" e due nodi contenenti i testi "tre" e "due".

Per attraversare ciascun nodo dell'albero di annullamento, puoi usare `g+` per andare a uno stato più recente e `g-` per andare a uno stato più vecchio. La differenza tra `u`, `Ctrl-R`, `g+` e `g-` è che sia `u` che `Ctrl-R` attraversano solo i nodi *principali* nell'albero di annullamento mentre `g+` e `g-` attraversano *tutti* i nodi nell'albero di annullamento.

L'albero di annullamento non è facile da visualizzare. Trovo il plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) molto utile per aiutare a visualizzare l'albero di annullamento di Vim. Dedicagli un po' di tempo per giocarci.

## Annullamento Persistente

Se avvii Vim, apri un file e premi immediatamente `u`, Vim probabilmente mostrerà un avviso "*Già all'ultimo cambiamento*". Non c'è nulla da annullare perché non hai apportato alcuna modifica.

Per riprendere la cronologia di annullamento dall'ultima sessione di modifica, Vim può preservare la tua cronologia di annullamento con un file di annullamento usando `:wundo`.

Crea un file `mynumbers.txt`. Digita:

```shell
uno
```

Poi digita un'altra riga (assicurati che ogni riga conti come un cambiamento):

```shell
uno
due
```

Digita un'altra riga:

```shell
uno
due
tre
```

Ora crea il tuo file di annullamento con `:wundo {my-undo-file}`. Se hai bisogno di sovrascrivere un file di annullamento esistente, puoi aggiungere `!` dopo `wundo`.

```shell
:wundo! mynumbers.undo
```

Poi esci da Vim.

A questo punto dovresti avere i file `mynumbers.txt` e `mynumbers.undo` nella tua directory. Apri di nuovo `mynumbers.txt` e prova a premere `u`. Non puoi. Non hai apportato alcuna modifica da quando hai aperto il file. Ora carica la tua cronologia di annullamento leggendo il file di annullamento con `:rundo`:

```shell
:rundo mynumbers.undo
```

Ora se premi `u`, Vim rimuove "tre". Premi `u` di nuovo per rimuovere "due". È come se non avessi mai chiuso Vim!

Se vuoi avere una persistenza automatica dell'annullamento, un modo per farlo è aggiungere queste righe nel vimrc:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

L'impostazione sopra metterà tutti i file di annullamento in una directory centralizzata, la directory `~/.vim`. Il nome `undo_dir` è arbitrario. `set undofile` dice a Vim di attivare la funzione `undofile` perché è disattivata per impostazione predefinita. Ora ogni volta che salvi, Vim crea e aggiorna automaticamente il file pertinente all'interno della directory `undo_dir` (assicurati di creare la directory `undo_dir` all'interno della directory `~/.vim` prima di eseguire questo).

## Viaggio nel Tempo

Chi dice che il viaggio nel tempo non esiste? Vim può viaggiare a uno stato di testo nel passato con il comando della riga di comando `:earlier`.

Se hai questo testo:

```shell
uno

```
Poi più tardi aggiungi:

```shell
uno
due
```

Se avessi digitato "due" meno di dieci secondi fa, puoi tornare allo stato in cui "due" non esisteva dieci secondi fa con:

```shell
:earlier 10s
```

Puoi usare `:undolist` per vedere quando è stato apportato l'ultimo cambiamento. `:earlier` accetta anche argomenti diversi:

```shell
:earlier 10s    Vai allo stato 10 secondi prima
:earlier 10m    Vai allo stato 10 minuti prima
:earlier 10h    Vai allo stato 10 ore prima
:earlier 10d    Vai allo stato 10 giorni prima
```

Inoltre, accetta anche un normale `count` come argomento per dire a Vim di tornare allo stato più vecchio `count` volte. Ad esempio, se fai `:earlier 2`, Vim tornerà a uno stato di testo più vecchio di due cambiamenti fa. È lo stesso che fare `g-` due volte. Puoi anche dirgli di tornare allo stato di testo più vecchio di 10 salvataggi fa con `:earlier 10f`.

Lo stesso insieme di argomenti funziona con il corrispondente `:later`.

```shell
:later 10s    vai allo stato 10 secondi dopo
:later 10m    vai allo stato 10 minuti dopo
:later 10h    vai allo stato 10 ore dopo
:later 10d    vai allo stato 10 giorni dopo
:later 10     vai allo stato più recente 10 volte
:later 10f    vai allo stato 10 salvataggi dopo
```

## Impara l'Annullamento nel Modo Intelligente

`u` e `Ctrl-R` sono due comandi indispensabili di Vim per correggere errori. Impara prima questi. Successivamente, impara come usare `:earlier` e `:later` utilizzando prima gli argomenti temporali. Dopo di che, prenditi il tuo tempo per comprendere l'albero di annullamento. Il plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) mi ha aiutato molto. Digita insieme ai testi in questo capitolo e controlla l'albero di annullamento man mano che apporti ogni cambiamento. Una volta che lo comprenderai, non vedrai mai più il sistema di annullamento allo stesso modo.

Prima di questo capitolo, hai imparato come trovare qualsiasi testo in uno spazio di progetto, con l'annullamento, ora puoi trovare qualsiasi testo in una dimensione temporale. Ora sei in grado di cercare qualsiasi testo in base alla sua posizione e al tempo in cui è stato scritto. Hai raggiunto l'onnipresenza di Vim.