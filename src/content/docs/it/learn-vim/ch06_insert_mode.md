---
description: Questo documento esplora le funzionalità della modalità di inserimento
  in Vim, fornendo diverse modalità per accedervi e migliorare l'efficienza di digitazione.
title: Ch06. Insert Mode
---

La modalità di inserimento è la modalità predefinita di molti editor di testo. In questa modalità, ciò che digiti è ciò che ottieni.

Tuttavia, ciò non significa che non ci sia molto da imparare. La modalità di inserimento di Vim contiene molte funzionalità utili. In questo capitolo, imparerai come utilizzare queste funzionalità della modalità di inserimento in Vim per migliorare la tua efficienza di digitazione.

## Modi per Accedere alla Modalità di Inserimento

Ci sono molti modi per entrare nella modalità di inserimento dalla modalità normale. Ecco alcuni di essi:

```shell
i    Inserisci testo prima del cursore
I    Inserisci testo prima del primo carattere non vuoto della riga
a    Aggiungi testo dopo il cursore
A    Aggiungi testo alla fine della riga
o    Inizia una nuova riga sotto il cursore e inserisci testo
O    Inizia una nuova riga sopra il cursore e inserisci testo
s    Elimina il carattere sotto il cursore e inserisci testo
S    Elimina la riga corrente e inserisci testo, sinonimo di "cc"
gi   Inserisci testo nella stessa posizione in cui è stata interrotta l'ultima modalità di inserimento
gI   Inserisci testo all'inizio della riga (colonna 1)
```

Nota il pattern tra minuscole e maiuscole. Per ogni comando in minuscolo, c'è un corrispondente in maiuscolo. Se sei nuovo, non preoccuparti se non ricordi l'intero elenco sopra. Inizia con `i` e `o`. Dovrebbero essere sufficienti per iniziare. Impara gradualmente di più nel tempo.

## Modi Diversi per Uscire dalla Modalità di Inserimento

Ci sono alcuni modi diversi per tornare alla modalità normale mentre sei in modalità di inserimento:

```shell
<Esc>     Esce dalla modalità di inserimento e torna alla modalità normale
Ctrl-[    Esce dalla modalità di inserimento e torna alla modalità normale
Ctrl-C    Come Ctrl-[ e <Esc>, ma non controlla le abbreviazioni
```

Trovo il tasto `<Esc>` troppo lontano da raggiungere, quindi mappo il mio computer `<Caps-Lock>` per comportarsi come `<Esc>`. Se cerchi la tastiera ADM-3A di Bill Joy (creatore di Vi), vedrai che il tasto `<Esc>` non si trova in alto a sinistra come nelle tastiere moderne, ma a sinistra del tasto `q`. Ecco perché penso che abbia senso mappare `<Caps lock>` su `<Esc>`.

Un'altra convenzione comune che ho visto fare agli utenti di Vim è mappare `<Esc>` su `jj` o `jk` in modalità di inserimento. Se preferisci questa opzione, aggiungi una di queste righe (o entrambe) nel tuo file vimrc.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Ripetere la Modalità di Inserimento

Puoi passare un parametro di conteggio prima di entrare nella modalità di inserimento. Ad esempio:

```shell
10i
```

Se digiti "hello world!" e esci dalla modalità di inserimento, Vim ripeterà il testo 10 volte. Questo funzionerà con qualsiasi metodo della modalità di inserimento (es: `10I`, `11a`, `12o`).

## Eliminare Blocchi in Modalità di Inserimento

Quando commetti un errore di battitura, può essere scomodo digitare `<Backspace>` ripetutamente. Può avere più senso passare alla modalità normale ed eliminare il tuo errore. Puoi anche eliminare diversi caratteri alla volta mentre sei in modalità di inserimento.

```shell
Ctrl-h    Elimina un carattere
Ctrl-w    Elimina una parola
Ctrl-u    Elimina l'intera riga
```

## Inserire da Registro

I registri di Vim possono memorizzare testi per un uso futuro. Per inserire un testo da un registro nominato mentre sei in modalità di inserimento, digita `Ctrl-R` più il simbolo del registro. Ci sono molti simboli che puoi usare, ma per questa sezione, copriamo solo i registri nominati (a-z).

Per vederlo in azione, prima devi yankare una parola nel registro a. Sposta il cursore su qualsiasi parola. Poi digita:

```shell
"ayiw
```

- `"a` dice a Vim che l'obiettivo della tua prossima azione andrà nel registro a.
- `yiw` yank il termine interno. Rivedi il capitolo sulla grammatica di Vim per un ripasso.

Il registro a ora contiene la parola che hai appena yankato. Mentre sei in modalità di inserimento, per incollare il testo memorizzato nel registro a:

```shell
Ctrl-R a
```

Ci sono più tipi di registri in Vim. Li tratterò in maggiore dettaglio in un capitolo successivo.

## Scorrimento

Sapevi che puoi scorrere mentre sei in modalità di inserimento? Mentre sei in modalità di inserimento, se vai nella sottocategoria `Ctrl-X`, puoi fare operazioni aggiuntive. Lo scorrimento è una di esse.

```shell
Ctrl-X Ctrl-Y    Scorri verso l'alto
Ctrl-X Ctrl-E    Scorri verso il basso
```

## Completamento Automatico

Come accennato sopra, se premi `Ctrl-X` dalla modalità di inserimento, Vim entrerà in una sottocategoria. Puoi fare il completamento automatico del testo mentre sei in questa sottocategoria della modalità di inserimento. Anche se non è buono come [intellisense](https://code.visualstudio.com/docs/editor/intellisense) o qualsiasi altro Protocollo di Linguaggio (LSP), ma per qualcosa che è disponibile subito, è una funzionalità molto capace.

Ecco alcuni comandi di completamento automatico utili per iniziare:

```shell
Ctrl-X Ctrl-L	   Inserisci un'intera riga
Ctrl-X Ctrl-N	   Inserisci un testo dal file corrente
Ctrl-X Ctrl-I	   Inserisci un testo dai file inclusi
Ctrl-X Ctrl-F	   Inserisci un nome di file
```

Quando attivi il completamento automatico, Vim mostrerà una finestra pop-up. Per navigare su e giù nella finestra pop-up, usa `Ctrl-N` e `Ctrl-P`.

Vim ha anche due scorciatoie di completamento automatico che non coinvolgono la sottocategoria `Ctrl-X`:

```shell
Ctrl-N             Trova la corrispondenza della parola successiva
Ctrl-P             Trova la corrispondenza della parola precedente
```

In generale, Vim guarda il testo in tutti i buffer disponibili per la fonte di completamento automatico. Se hai un buffer aperto con una riga che dice "I donuts al cioccolato sono i migliori":
- Quando digiti "Choco" e fai `Ctrl-X Ctrl-L`, corrisponderà e stamperà l'intera riga.
- Quando digiti "Choco" e fai `Ctrl-P`, corrisponderà e stamperà la parola "Cioccolato".

Il completamento automatico è un argomento vasto in Vim. Questo è solo la punta dell'iceberg. Per saperne di più, controlla `:h ins-completion`.

## Eseguire un Comando della Modalità Normale

Sapevi che Vim può eseguire un comando della modalità normale mentre sei in modalità di inserimento?

Mentre sei in modalità di inserimento, se premi `Ctrl-O`, entrerai nella sottocategoria inserisci-normale. Se guardi l'indicatore di modalità in basso a sinistra, normalmente vedrai `-- INSERT --`, ma premendo `Ctrl-O` cambia in `-- (insert) --`. In questa modalità, puoi eseguire *un* comando della modalità normale. Alcune cose che puoi fare:

**Centrare e saltare**

```shell
Ctrl-O zz       Centra la finestra
Ctrl-O H/M/L    Salta in cima/centro/fondo della finestra
Ctrl-O 'a       Salta al segno a
```

**Ripetere testo**

```shell
Ctrl-O 100ihello    Inserisci "hello" 100 volte
```

**Eseguire comandi terminali**

```shell
Ctrl-O !! curl https://google.com    Esegui curl
Ctrl-O !! pwd                        Esegui pwd
```

**Eliminare più velocemente**

```shell
Ctrl-O dtz    Elimina dalla posizione attuale fino alla lettera "z"
Ctrl-O D      Elimina dalla posizione attuale fino alla fine della riga
```

## Impara la Modalità di Inserimento nel Modo Intelligente

Se sei come me e provieni da un altro editor di testo, può essere allettante rimanere in modalità di inserimento. Tuttavia, rimanere in modalità di inserimento quando non stai inserendo testo è un anti-pattern. Sviluppa l'abitudine di passare alla modalità normale quando le tue dita non stanno digitando nuovo testo.

Quando hai bisogno di inserire un testo, chiediti prima se quel testo esiste già. Se sì, prova a yankare o spostare quel testo invece di digitarlo. Se devi usare la modalità di inserimento, verifica se puoi completare automaticamente quel testo ogni volta che è possibile. Evita di digitare la stessa parola più di una volta, se puoi.