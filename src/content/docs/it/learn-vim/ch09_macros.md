---
description: Scopri come utilizzare le macro in Vim per automatizzare azioni ripetitive,
  registrando e riproducendo le modifiche per un editing più efficiente.
title: Ch09. Macros
---

Quando modifichi file, potresti trovarti a ripetere le stesse azioni. Non sarebbe bello se potessi eseguire quelle azioni una volta e ripeterle ogni volta che ne hai bisogno? Con le macro di Vim, puoi registrare azioni e memorizzarle all'interno dei registri di Vim per essere eseguite ogni volta che ne hai bisogno.

In questo capitolo, imparerai come utilizzare le macro per automatizzare compiti noiosi (inoltre sembra fantastico vedere il tuo file modificarsi da solo).

## Macro di Base

Ecco la sintassi di base di una macro di Vim:

```shell
qa                     Inizia a registrare una macro nel registro a
q (mentre registri)    Ferma la registrazione della macro
```

Puoi scegliere qualsiasi lettera minuscola (a-z) per memorizzare le macro. Ecco come puoi eseguire una macro:

```shell
@a    Esegui la macro dal registro a
@@    Esegui l'ultima macro eseguita
```

Supponiamo di avere questo testo e di voler mettere in maiuscolo tutto su ogni riga:

```shell
hello
vim
macros
are
awesome
```

Con il cursore all'inizio della riga "hello", esegui:

```shell
qa0gU$jq
```

La suddivisione:
- `qa` inizia a registrare una macro nel registro a.
- `0` va all'inizio della riga.
- `gU$` mette in maiuscolo il testo dalla tua posizione attuale fino alla fine della riga.
- `j` scende di una riga.
- `q` ferma la registrazione.

Per ripeterla, esegui `@a`. Proprio come molti altri comandi di Vim, puoi passare un argomento di conteggio alle macro. Ad esempio, eseguendo `3@a` esegue la macro tre volte.

## Sicurezza

L'esecuzione della macro termina automaticamente quando incontra un errore. Supponiamo di avere questo testo:

```shell
a. ciambella al cioccolato
b. ciambella mochi
c. ciambella con zucchero a velo
d. ciambella semplice
```

Se vuoi mettere in maiuscolo la prima parola su ogni riga, questa macro dovrebbe funzionare:

```shell
qa0W~jq
```

Ecco la suddivisione del comando sopra:
- `qa` inizia a registrare una macro nel registro a.
- `0` va all'inizio della riga.
- `W` va alla prossima PAROLA.
- `~` alterna il caso del carattere sotto il cursore.
- `j` scende di una riga.
- `q` ferma la registrazione.

Preferisco sovrastimare l'esecuzione della mia macro piuttosto che sottostimarla, quindi di solito la chiamo novantanove volte (`99@a`). Con questo comando, Vim non esegue effettivamente questa macro novantanove volte. Quando Vim raggiunge l'ultima riga e esegue il movimento `j`, non trova più righe da scendere, genera un errore e ferma l'esecuzione della macro.

Il fatto che l'esecuzione della macro si fermi al primo errore incontrato è una buona caratteristica, altrimenti Vim continuerebbe a eseguire questa macro novantanove volte anche se ha già raggiunto la fine della riga.

## Macro da Riga di Comando

Eseguire `@a` in modalità normale non è l'unico modo per eseguire macro in Vim. Puoi anche eseguire `:normal @a` dalla riga di comando. `:normal` consente all'utente di eseguire qualsiasi comando in modalità normale passato come argomento. Nel caso sopra, è lo stesso che eseguire `@a` dalla modalità normale.

Il comando `:normal` accetta intervalli come argomenti. Puoi usarlo per eseguire macro in intervalli selezionati. Se vuoi eseguire la tua macro tra le righe 2 e 3, puoi eseguire `:2,3 normal @a`.

## Esecuzione di una Macro su Più File

Supponiamo di avere più file `.txt`, ognuno contenente del testo. Il tuo compito è mettere in maiuscolo solo la prima parola sulle righe che contengono la parola "ciambella". Supponi di avere `0W~j` nel registro a (la stessa macro di prima). Come puoi completare rapidamente questo compito?

Primo file:

```shell
## savory.txt
a. ciambella al cheddar jalapeno
b. ciambella mac n cheese
c. raviolo fritto
```

Secondo file:

```shell
## sweet.txt
a. ciambella al cioccolato
b. pancake al cioccolato
c. ciambella con zucchero a velo
```

Terzo file:

```shell
## plain.txt
a. pane di grano
b. ciambella semplice
```

Ecco come puoi farlo:
- `:args *.txt` per trovare tutti i file `.txt` nella tua directory corrente.
- `:argdo g/ciambella/normal @a` esegue il comando globale `g/ciambella/normal @a` su ogni file all'interno di `:args`.
- `:argdo update` esegue il comando `update` per salvare ogni file all'interno di `:args` quando il buffer è stato modificato.

Se non sei familiare con il comando globale `:g/ciambella/normal @a`, esegue il comando che dai (`normal @a`) sulle righe che corrispondono al modello (`/ciambella/`). Tratterò il comando globale in un capitolo successivo.

## Macro Ricorsive

Puoi eseguire ricorsivamente una macro chiamando lo stesso registro macro mentre registri quella macro. Supponiamo di avere di nuovo questa lista e di dover alternare il caso della prima parola:

```shell
a. ciambella al cioccolato
b. ciambella mochi
c. ciambella con zucchero a velo
d. ciambella semplice
```

Questa volta, facciamolo ricorsivamente. Esegui:

```shell
qaqqa0W~j@aq
```

Ecco la suddivisione dei passaggi:
- `qaq` registra una macro vuota a. È necessario iniziare con un registro vuoto perché quando chiami ricorsivamente la macro, eseguirà tutto ciò che è in quel registro.
- `qa` inizia a registrare nel registro a.
- `0` va al primo carattere nella riga corrente.
- `W` va alla prossima PAROLA.
- `~` alterna il caso del carattere sotto il cursore.
- `j` scende di una riga.
- `@a` esegue la macro a.
- `q` ferma la registrazione.

Ora puoi semplicemente eseguire `@a` e guardare Vim eseguire la macro ricorsivamente.

Come ha fatto la macro a sapere quando fermarsi? Quando la macro era sull'ultima riga, ha provato a eseguire `j`, e poiché non c'era più una riga da cui scendere, ha fermato l'esecuzione della macro.

## Aggiungere una Macro

Se hai bisogno di aggiungere azioni a una macro esistente, invece di ricreare la macro da zero, puoi aggiungere azioni a una già esistente. Nel capitolo sui registri, hai imparato che puoi aggiungere a un registro nominato usando il suo simbolo maiuscolo. La stessa regola si applica. Per aggiungere azioni a una macro di registro, usa il registro A.

Registra una macro nel registro a: `qa0W~q` (questa sequenza alterna il caso della prossima PAROLA in una riga). Se vuoi aggiungere una nuova sequenza per aggiungere anche un punto alla fine della riga, esegui:

```shell
qAA.<Esc>q
```

La suddivisione:
- `qA` inizia a registrare la macro nel registro A.
- `A.<Esc>` inserisce alla fine della riga (qui `A` è il comando della modalità di inserimento, non deve essere confuso con la macro A) un punto, quindi esce dalla modalità di inserimento.
- `q` ferma la registrazione della macro.

Ora quando esegui `@a`, non solo alterna il caso della prossima PAROLA, ma aggiunge anche un punto alla fine della riga.

## Modificare una Macro

E se hai bisogno di aggiungere nuove azioni nel mezzo di una macro?

Supponi di avere una macro che alterna la prima parola effettiva e aggiunge un punto alla fine della riga, `0W~A.<Esc>` nel registro a. Supponiamo che tra il mettere in maiuscolo la prima parola e l'aggiungere un punto alla fine della riga, tu debba aggiungere la parola "fritta" proprio prima della parola "ciambella" *(perché l'unica cosa migliore delle ciambelle normali sono le ciambelle fritte)*.

Riutilizzerò il testo dalla sezione precedente:
```shell
a. ciambella al cioccolato
b. ciambella mochi
c. ciambella con zucchero a velo
d. ciambella semplice
```

Prima, chiamiamo la macro esistente (supponi di aver mantenuto la macro dalla sezione precedente nel registro a) con `:put a`:

```shell
0W~A.^[
```

Cos'è questo `^[`? Non hai fatto `0W~A.<Esc>`? Dov'è il `<Esc>`? `^[` è la rappresentazione del *codice interno* di Vim per `<Esc>`. Con alcuni tasti speciali, Vim stampa la rappresentazione di quei tasti sotto forma di codici interni. Alcuni tasti comuni che hanno rappresentazioni di codici interni sono `<Esc>`, `<Backspace>` e `<Enter>`. Ci sono più tasti speciali, ma non rientrano nell'ambito di questo capitolo.

Tornando alla macro, subito dopo l'operatore di alternanza del caso (`~`), aggiungiamo le istruzioni per andare alla fine della riga (`$`), tornare indietro di una parola (`b`), andare in modalità di inserimento (`i`), digitare "fritta " (non dimenticare lo spazio dopo "fritta "), e uscire dalla modalità di inserimento (`<Esc>`).

Ecco come finirai:

```shell
0W~$bifritta <Esc>A.^[
```

C'è un piccolo problema. Vim non capisce `<Esc>`. Non puoi digitare letteralmente `<Esc>`. Dovrai scrivere la rappresentazione del codice interno per il tasto `<Esc>`. Mentre sei in modalità di inserimento, premi `Ctrl-V` seguito da `<Esc>`. Vim stamperà `^[`. `Ctrl-V` è un operatore della modalità di inserimento per inserire il prossimo carattere non numerico *letteralmente*. Il tuo codice macro dovrebbe ora apparire così:

```shell
0W~$bifritta ^[A.^[
```

Per aggiungere l'istruzione modificata nel registro a, puoi farlo allo stesso modo in cui aggiungi una nuova voce a un registro nominato. All'inizio della riga, esegui `"ay$` per memorizzare il testo copiato nel registro a.

Ora quando esegui `@a`, la tua macro alterna il caso della prima parola, aggiunge "fritta " prima di "ciambella", e aggiunge un "." alla fine della riga. Yum!

Un modo alternativo per modificare una macro è utilizzare un'espressione da riga di comando. Fai `:let @a="`, poi fai `Ctrl-R a`, questo incollerà letteralmente il contenuto del registro a. Infine, non dimenticare di chiudere le virgolette doppie (`"`). Potresti avere qualcosa come `:let @a="0W~$bifritta ^[A.^["`.

## Ridondanza delle Macro

Puoi facilmente duplicare le macro da un registro a un altro. Ad esempio, per duplicare una macro nel registro a nel registro z, puoi fare `:let @z = @a`. `@a` rappresenta il contenuto del registro a. Ora se esegui `@z`, eseguirà esattamente le stesse azioni di `@a`.

Trovo utile creare una ridondanza sulle mie macro più frequentemente utilizzate. Nel mio flusso di lavoro, di solito registro macro nelle prime sette lettere alfabetiche (a-g) e spesso le sostituisco senza pensarci troppo. Se sposto le macro utili verso la fine dell'alfabeto, posso preservarle senza preoccuparmi di sostituirle accidentalmente.

## Macro in Serie vs in Parallelo

Vim può eseguire macro in serie e in parallelo. Supponiamo di avere questo testo:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Se vuoi registrare una macro per mettere in minuscolo tutti i "FUNC" in maiuscolo, questa macro dovrebbe funzionare:

```shell
qa0f{gui{jq
```

La suddivisione:
- `qa` inizia a registrare nel registro a.
- `0` va alla prima riga.
- `f{` trova la prima istanza di "{".
- `gui{` mette in minuscolo (`gu`) il testo all'interno dell'oggetto di testo tra parentesi (`i{`).
- `j` scende di una riga.
- `q` ferma la registrazione della macro.

Ora puoi eseguire `99@a` per eseguirla sulle righe rimanenti. Tuttavia, cosa succede se hai questa espressione di importazione all'interno del tuo file?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Eseguendo `99@a`, esegue la macro solo tre volte. Non esegue la macro sulle ultime due righe perché l'esecuzione non riesce a eseguire `f{` sulla riga "foo". Questo è previsto quando si esegue la macro in serie. Puoi sempre andare alla riga successiva dove si trova "FUNC4" e ripetere di nuovo quella macro. Ma cosa succede se vuoi completare tutto in un colpo solo?

Esegui la macro in parallelo.

Ricorda dalla sezione precedente che le macro possono essere eseguite utilizzando il comando da riga di comando `:normal` (es: `:3,5 normal @a` esegue la macro a sulle righe 3-5). Se esegui `:1,$ normal @a`, vedrai che la macro viene eseguita su tutte le righe tranne la riga "foo". Funziona!

Anche se internamente Vim non esegue effettivamente le macro in parallelo, esternamente si comporta come se lo facesse. Vim esegue `@a` *indipendentemente* su ogni riga dalla prima all'ultima riga (`1,$`). Poiché Vim esegue queste macro in modo indipendente, ogni riga non sa che una delle esecuzioni della macro è fallita sulla riga "foo".
## Impara le Macro nel Modo Intelligente

Molte cose che fai durante la modifica sono ripetitive. Per migliorare nella modifica, abituati a rilevare azioni ripetitive. Usa le macro (o il comando punto) in modo da non dover eseguire la stessa azione due volte. Quasi tutto ciò che puoi fare in Vim può essere replicato con le macro.

All'inizio, trovo molto scomodo scrivere macro, ma non arrenderti. Con abbastanza pratica, ti abituerai ad automatizzare tutto.

Potresti trovare utile usare mnemonici per aiutarti a ricordare le tue macro. Se hai una macro che crea una funzione, usa il "f register (`qf`). Se hai una macro per operazioni numeriche, il "n register dovrebbe funzionare (`qn`). Nominalo con il *primo registro nominato* che ti viene in mente quando pensi a quell'operazione. Trovo anche che il "q register sia un buon registro di macro predefinito perché `qq` richiede meno energia mentale per essere ideato. Infine, mi piace anche incrementare le mie macro in ordine alfabetico, come `qa`, poi `qb`, poi `qc`, e così via.

Trova un metodo che funzioni meglio per te.