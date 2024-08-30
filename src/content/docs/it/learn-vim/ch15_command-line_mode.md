---
description: Questo documento fornisce suggerimenti e trucchi per utilizzare la modalità
  della riga di comando in Vim, inclusi comandi di ricerca e sostituzione.
title: Ch15. Command-line Mode
---

Negli ultimi tre capitoli, hai imparato a usare i comandi di ricerca (`/`, `?`), il comando di sostituzione (`:s`), il comando globale (`:g`) e il comando esterno (`!`). Questi sono esempi di comandi in modalità linea di comando.

In questo capitolo, imparerai vari suggerimenti e trucchi per la modalità linea di comando.

## Entrare e Uscire dalla Modalità Linea di Comando

La modalità linea di comando è una modalità a sé stante, proprio come la modalità normale, la modalità di inserimento e la modalità visiva. Quando sei in questa modalità, il cursore si sposta in fondo allo schermo dove puoi digitare diversi comandi.

Ci sono 4 comandi diversi che puoi usare per entrare nella modalità linea di comando:
- Modelli di ricerca (`/`, `?`)
- Comandi della linea di comando (`:`)
- Comandi esterni (`!`)

Puoi entrare nella modalità linea di comando dalla modalità normale o dalla modalità visiva.

Per uscire dalla modalità linea di comando, puoi usare `<Esc>`, `Ctrl-C` o `Ctrl-[`.

*Altre letterature potrebbero riferirsi al "Comando della linea di comando" come "Comando Ex" e al "Comando esterno" come "comando filtro" o "operatore bang".*

## Ripetere il Comando Precedente

Puoi ripetere il comando della linea di comando precedente o il comando esterno con `@:`.

Se hai appena eseguito `:s/foo/bar/g`, eseguire `@:` ripete quella sostituzione. Se hai appena eseguito `:.!tr '[a-z]' '[A-Z]'`, eseguire `@:` ripete l'ultimo comando esterno del filtro di traduzione.

## Scorciatoie della Modalità Linea di Comando

Mentre sei in modalità linea di comando, puoi spostarti a sinistra o a destra, un carattere alla volta, con le frecce `Sinistra` o `Destra`.

Se hai bisogno di spostarti a livello di parola, usa `Shift-Sinistra` o `Shift-Destra` (in alcuni sistemi operativi, potresti dover usare `Ctrl` invece di `Shift`).

Per andare all'inizio della riga, usa `Ctrl-B`. Per andare alla fine della riga, usa `Ctrl-E`.

Simile alla modalità di inserimento, all'interno della modalità linea di comando, hai tre modi per eliminare caratteri:

```shell
Ctrl-H    Elimina un carattere
Ctrl-W    Elimina una parola
Ctrl-U    Elimina l'intera riga
```
Infine, se vuoi modificare il comando come faresti con un normale file di testo, usa `Ctrl-F`.

Questo ti consente anche di cercare tra i comandi precedenti, modificarli e rieseguirli premendo `<Enter>` in "modalità normale di modifica della linea di comando".

## Registro e Autocompletamento

Mentre sei in modalità linea di comando, puoi inserire testi dal registro di Vim con `Ctrl-R` nello stesso modo della modalità di inserimento. Se hai la stringa "foo" salvata nel registro a, puoi inserirla eseguendo `Ctrl-R a`. Tutto ciò che puoi ottenere dal registro nella modalità di inserimento, puoi farlo anche dalla modalità linea di comando.

Inoltre, puoi anche ottenere la parola sotto il cursore con `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` per la WORD sotto il cursore). Per ottenere la riga sotto il cursore, usa `Ctrl-R Ctrl-L`. Per ottenere il nome del file sotto il cursore, usa `Ctrl-R Ctrl-F`.

Puoi anche completare automaticamente i comandi esistenti. Per completare automaticamente il comando `echo`, mentre sei in modalità linea di comando, digita "ec", poi premi `<Tab>`. Dovresti vedere in basso a sinistra i comandi Vim che iniziano con "ec" (esempio: `echo echoerr echohl echomsg econ`). Per andare all'opzione successiva, premi `<Tab>` o `Ctrl-N`. Per andare all'opzione precedente, premi `<Shift-Tab>` o `Ctrl-P`.

Alcuni comandi della linea di comando accettano nomi di file come argomenti. Un esempio è `edit`. Puoi completare automaticamente anche qui. Dopo aver digitato il comando, `:e ` (non dimenticare lo spazio), premi `<Tab>`. Vim elencherà tutti i nomi di file pertinenti tra cui puoi scegliere, così non devi digitarli da zero.

## Finestra della Storia e Finestra della Linea di Comando

Puoi visualizzare la storia dei comandi della linea di comando e dei termini di ricerca (questo richiede la funzionalità `+cmdline_hist`).

Per aprire la cronologia della linea di comando, esegui `:his :`. Dovresti vedere qualcosa di simile al seguente:

```shell
## Cronologia Cmd
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim elenca la cronologia di tutti i comandi `:` che hai eseguito. Per impostazione predefinita, Vim memorizza gli ultimi 50 comandi. Per cambiare il numero di voci che Vim ricorda a 100, esegui `set history=100`.

Un uso più utile della cronologia della linea di comando è attraverso la finestra della linea di comando, `q:`. Questo aprirà una finestra di cronologia ricercabile e modificabile. Supponiamo che tu abbia queste espressioni nella cronologia quando premi `q:`:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Se il tuo compito attuale è fare `s/verylongsubstitutionpattern/donut/g`, invece di digitare il comando da zero, perché non riutilizzi `s/verylongsubstitutionpattern/pancake/g`? Dopotutto, l'unica cosa che è diversa è la parola sostituita, "donut" contro "pancake". Tutto il resto è lo stesso.

Dopo aver eseguito `q:`, trova `s/verylongsubstitutionpattern/pancake/g` nella cronologia (puoi usare la navigazione di Vim in questo ambiente) e modificalo direttamente! Cambia "pancake" in "donut" all'interno della finestra della cronologia, poi premi `<Enter>`. Boom! Vim esegue `s/verylongsubstitutionpattern/donut/g` per te. Super conveniente!

Allo stesso modo, per visualizzare la cronologia delle ricerche, esegui `:his /` o `:his ?`. Per aprire la finestra della cronologia delle ricerche dove puoi cercare e modificare la cronologia passata, esegui `q/` o `q?`.

Per uscire da questa finestra, premi `Ctrl-C`, `Ctrl-W C`, o digita `:quit`.

## Altri Comandi della Linea di Comando

Vim ha centinaia di comandi incorporati. Per vedere tutti i comandi che Vim ha, controlla `:h ex-cmd-index` o `:h :index`.

## Impara la Modalità Linea di Comando nel Modo Intelligente

Rispetto alle altre tre modalità, la modalità linea di comando è come il coltellino svizzero dell'editing di testo. Puoi modificare testo, modificare file ed eseguire comandi, solo per citarne alcuni. Questo capitolo è una raccolta di vari aspetti della modalità linea di comando. Porta anche a conclusione le modalità di Vim. Ora che sai come usare la modalità normale, di inserimento, visiva e linea di comando, puoi modificare testo con Vim più velocemente che mai.

È tempo di allontanarsi dalle modalità di Vim e imparare a fare una navigazione ancora più veloce con i tag di Vim.