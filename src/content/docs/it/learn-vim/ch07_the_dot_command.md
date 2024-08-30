---
description: Questo documento spiega come utilizzare il comando punto in Vim per ripetere
  facilmente le modifiche precedenti, rendendo le operazioni più efficienti.
title: Ch07. the Dot Command
---

In generale, dovresti cercare di evitare di rifare ciò che hai appena fatto ogni volta che è possibile. In questo capitolo, imparerai come usare il comando punto per ripetere facilmente la modifica precedente. È un comando versatile per ridurre le semplici ripetizioni.

## Utilizzo

Proprio come il suo nome, puoi usare il comando punto premendo il tasto punto (`.`).

Ad esempio, se vuoi sostituire tutte le occorrenze di "let" con "const" nelle seguenti espressioni:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Cerca con `/let` per andare all'abbinamento.
- Cambia con `cwconst<Esc>` per sostituire "let" con "const".
- Naviga con `n` per trovare la prossima corrispondenza usando la ricerca precedente.
- Ripeti ciò che hai appena fatto con il comando punto (`.`).
- Continua a premere `n . n .` fino a sostituire ogni parola.

Qui il comando punto ha ripetuto la sequenza `cwconst<Esc>`. Ti ha risparmiato di digitare otto tasti in cambio di solo uno.

## Cos'è una Modifica?

Se guardi la definizione del comando punto (`:h .`), dice che il comando punto ripete l'ultima modifica. Cos'è una modifica?

Ogni volta che aggiorni (aggiungi, modifica o elimini) il contenuto del buffer corrente, stai facendo una modifica. Le eccezioni sono gli aggiornamenti effettuati da comandi della riga di comando (i comandi che iniziano con `:`) che non contano come una modifica.

Nel primo esempio, `cwconst<Esc>` era la modifica. Ora supponi di avere questo testo:

```shell
pancake, potatoes, fruit-juice,
```

Per eliminare il testo dall'inizio della riga fino alla prossima occorrenza di una virgola, prima elimina fino alla virgola, poi ripeti due volte con `df,..`. 

Proviamo un altro esempio:

```shell
pancake, potatoes, fruit-juice,
```

Questa volta, il tuo compito è eliminare la virgola, non gli elementi della colazione. Con il cursore all'inizio della riga, vai alla prima virgola, eliminala, poi ripeti altre due volte con `f,x..` Facile, giusto? Aspetta un attimo, non ha funzionato! Perché?

Una modifica esclude i movimenti perché non aggiorna il contenuto del buffer. Il comando `f,x` consisteva di due azioni: il comando `f,` per muovere il cursore su "," e `x` per eliminare un carattere. Solo quest'ultimo, `x`, ha causato una modifica. Contrasta questo con `df,` dall'esempio precedente. In esso, `f,` è una direttiva per l'operatore di eliminazione `d`, non un movimento per muovere il cursore. Il `f,` in `df,` e `f,x` hanno due ruoli molto diversi.

Finisci l'ultimo compito. Dopo aver eseguito `f,` poi `x`, vai alla prossima virgola con `;` per ripetere l'ultimo `f`. Infine, usa `.` per eliminare il carattere sotto il cursore. Ripeti `; . ; .` fino a quando tutto è eliminato. Il comando completo è `f,x;.;.`.

Proviamo un altro:

```shell
pancake
potatoes
fruit-juice
```

Aggiungiamo una virgola alla fine di ogni riga. Partendo dalla prima riga, fai `A,<Esc>j`. Ormai, ti rendi conto che `j` non causa una modifica. La modifica qui è solo `A,`. Puoi muoverti e ripetere la modifica con `j . j .`. Il comando completo è `A,<Esc>j.j.`.

Ogni azione dal momento in cui premi l'operatore del comando di inserimento (`A`) fino a quando esci dal comando di inserimento (`<Esc>`) è considerata come una modifica.

## Ripetizione su più righe

Supponi di avere questo testo:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Il tuo obiettivo è eliminare tutte le righe tranne la riga "foo". Prima, elimina le prime tre righe con `d2j`, poi vai alla riga sotto la riga "foo". Nella riga successiva, usa il comando punto due volte. Il comando completo è `d2jj..`.

Qui la modifica era `d2j`. In questo contesto, `2j` non era un movimento, ma una parte dell'operatore di eliminazione.

Guardiamo un altro esempio:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Rimuoviamo tutte le z. Partendo dal primo carattere sulla prima riga, seleziona visivamente solo la prima z dalle prime tre righe con la modalità visiva a blocchi (`Ctrl-Vjj`). Se non sei familiare con la modalità visiva a blocchi, ne parlerò in un capitolo successivo. Una volta selezionate visivamente le tre z, eliminale con l'operatore di eliminazione (`d`). Poi spostati alla parola successiva (`w`) per la prossima z. Ripeti la modifica altre due volte (`..`). Il comando completo è `Ctrl-vjjdw..`.

Quando hai eliminato una colonna di tre z (`Ctrl-vjjd`), è stata conteggiata come una modifica. L'operazione in modalità visiva può essere utilizzata per mirare a più righe come parte di una modifica.

## Includere un Movimento in una Modifica

Rivisitiamo il primo esempio in questo capitolo. Ricorda che il comando `/letcwconst<Esc>` seguito da `n . n .` ha sostituito tutte le occorrenze di "let" con "const" nelle seguenti espressioni:

```shell
let one = "1";
let two = "2";
let three = "3";
```

C'è un modo più veloce per farlo. Dopo aver cercato `/let`, esegui `cgnconst<Esc>` poi `. .`.

`gn` è un movimento che cerca in avanti l'ultima corrispondenza di ricerca (in questo caso, `/let`) e evidenzia automaticamente. Per sostituire la prossima occorrenza, non devi più muoverti e ripetere la modifica (`n . n .`), ma solo ripetere (`. .`). Non devi più usare i movimenti di ricerca perché cercare la prossima corrispondenza è ora parte della modifica!

Quando stai modificando, sii sempre alla ricerca di movimenti che possono fare diverse cose contemporaneamente come `gn` ogni volta che è possibile.

## Impara il Comando Punto nel Modo Intelligente

La potenza del comando punto deriva dallo scambio di diversi tasti per uno. Probabilmente non è uno scambio proficuo usare il comando punto per operazioni con un solo tasto come `x`. Se la tua ultima modifica richiede un'operazione complessa come `cgnconst<Esc>`, il comando punto riduce nove pressioni di tasti in una, uno scambio molto proficuo.

Quando modifichi, pensa alla ripetibilità. Ad esempio, se devo rimuovere le prossime tre parole, è più economico usare `d3w` o fare `dw` poi `.` due volte? Stai per eliminare di nuovo una parola? Se sì, allora ha senso usare `dw` e ripeterlo più volte invece di `d3w` perché `dw` è più riutilizzabile di `d3w`. 

Il comando punto è un comando versatile per automatizzare modifiche singole. In un capitolo successivo, imparerai come automatizzare azioni più complesse con le macro di Vim. Ma prima, impariamo a conoscere i registri per memorizzare e recuperare testo.