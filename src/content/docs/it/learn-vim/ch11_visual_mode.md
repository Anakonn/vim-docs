---
description: Questo documento spiega come utilizzare la modalità visiva in Vim per
  evidenziare e modificare testi in modo efficiente, descrivendo i tre tipi di modalità
  visiva.
title: Ch11. Visual Mode
---

Evidenziare e applicare modifiche a un corpo di testo è una caratteristica comune in molti editor di testo e processori di parole. Vim può farlo utilizzando la modalità visiva. In questo capitolo, imparerai come utilizzare la modalità visiva per manipolare i testi in modo efficiente.

## I Tre Tipi di Modalità Visiva

Vim ha tre diverse modalità visive. Esse sono:

```shell
v         Modalità visiva a carattere
V         Modalità visiva a linea
Ctrl-V    Modalità visiva a blocco
```

Se hai il testo:

```shell
one
two
three
```

La modalità visiva a carattere lavora con i singoli caratteri. Premi `v` sul primo carattere. Poi scendi alla riga successiva con `j`. Evidenzia tutto il testo da "one" fino alla posizione del cursore. Se premi `gU`, Vim trasforma in maiuscolo i caratteri evidenziati.

La modalità visiva a linea lavora con le righe. Premi `V` e guarda Vim selezionare l'intera riga su cui si trova il cursore. Proprio come nella modalità visiva a carattere, se esegui `gU`, Vim trasforma in maiuscolo i caratteri evidenziati.

La modalità visiva a blocco lavora con righe e colonne. Ti offre più libertà di movimento rispetto alle altre due modalità. Se premi `Ctrl-V`, Vim evidenzia il carattere sotto il cursore proprio come nella modalità visiva a carattere, tranne che invece di evidenziare ogni carattere fino alla fine della riga prima di scendere alla riga successiva, passa alla riga successiva con un'evidenziazione minima. Prova a muoverti con `h/j/k/l` e guarda il cursore muoversi.

In basso a sinistra della finestra di Vim, vedrai visualizzato `-- VISUAL --`, `-- VISUAL LINE --` o `-- VISUAL BLOCK --` per indicare in quale modalità visiva ti trovi.

Mentre sei all'interno di una modalità visiva, puoi passare a un'altra modalità visiva premendo `v`, `V` o `Ctrl-V`. Ad esempio, se sei nella modalità visiva a linea e vuoi passare alla modalità visiva a blocco, esegui `Ctrl-V`. Provalo!

Ci sono tre modi per uscire dalla modalità visiva: `<Esc>`, `Ctrl-C` e lo stesso tasto della tua attuale modalità visiva. Ciò che significa quest'ultimo è che se attualmente sei nella modalità visiva a linea (`V`), puoi uscirne premendo di nuovo `V`. Se sei nella modalità visiva a carattere, puoi uscirne premendo `v`.

C'è in realtà un altro modo per entrare nella modalità visiva:

```shell
gv    Vai alla precedente modalità visiva
```

Inizierà la stessa modalità visiva sullo stesso blocco di testo evidenziato come hai fatto l'ultima volta.

## Navigazione nella Modalità Visiva

Mentre sei in modalità visiva, puoi espandere il blocco di testo evidenziato con i movimenti di Vim.

Usiamo lo stesso testo che hai usato in precedenza:

```shell
one
two
three
```

Questa volta iniziamo dalla riga "two". Premi `v` per andare nella modalità visiva a carattere (qui le parentesi quadre `[]` rappresentano i caratteri evidenziati):

```shell
one
[t]wo
three
```

Premi `j` e Vim evidenzierà tutto il testo dalla riga "two" fino al primo carattere della riga "three".

```shell
one
[two
t]hree
```

Assumi che da questa posizione, tu voglia aggiungere anche la riga "one". Se premi `k`, con tua sorpresa, l'evidenziazione si sposta dalla riga "three".

```shell
one
[t]wo
three
```

C'è un modo per espandere liberamente la selezione visiva per muoverti in qualsiasi direzione tu voglia? Certamente. Torniamo un po' indietro a dove hai evidenziato la riga "two" e "three".

```shell
one
[two
t]hree    <-- cursore
```

L'evidenziazione visiva segue il movimento del cursore. Se vuoi espanderla verso l'alto fino alla riga "one", devi spostare il cursore verso l'alto fino alla riga "two". In questo momento il cursore è sulla riga "three". Puoi alternare la posizione del cursore con `o` o `O`.

```shell
one
[two     <-- cursore
t]hree
```

Ora quando premi `k`, non riduce più la selezione, ma la espande verso l'alto.

```shell
[one
two
t]hree
```

Con `o` o `O` in modalità visiva, il cursore salta dall'inizio alla fine del blocco evidenziato, permettendoti di espandere l'area di evidenziazione.

## Grammatica della Modalità Visiva

La modalità visiva condivide molte operazioni con la modalità normale.

Ad esempio, se hai il seguente testo e vuoi eliminare le prime due righe dalla modalità visiva:

```shell
one
two
three
```

Evidenzia le righe "one" e "two" con la modalità visiva a linea (`V`):

```shell
[one
two]
three
```

Premere `d` eliminerà la selezione, simile alla modalità normale. Nota che la regola grammaticale dalla modalità normale, verbo + sostantivo, non si applica. Lo stesso verbo è ancora presente (`d`), ma non c'è sostantivo nella modalità visiva. La regola grammaticale nella modalità visiva è sostantivo + verbo, dove il sostantivo è il testo evidenziato. Seleziona prima il blocco di testo, poi il comando segue.

Nella modalità normale, ci sono alcuni comandi che non richiedono un movimento, come `x` per eliminare un singolo carattere sotto il cursore e `r` per sostituire il carattere sotto il cursore (`rx` sostituisce il carattere sotto il cursore con "x"). Nella modalità visiva, questi comandi vengono ora applicati all'intero testo evidenziato invece che a un singolo carattere. Tornando al testo evidenziato:

```shell
[one
two]
three
```

Eseguire `x` elimina tutti i testi evidenziati.

Puoi utilizzare questo comportamento per creare rapidamente un'intestazione nel testo markdown. Supponi di dover trasformare rapidamente il seguente testo in un'intestazione markdown di primo livello ("==="):

```shell
Chapter One
```

Prima, copia il testo con `yy`, poi incollalo con `p`:

```shell
Chapter One
Chapter One
```

Ora, vai alla seconda riga e selezionala con la modalità visiva a linea:

```shell
Chapter One
[Chapter One]
```

Un'intestazione di primo livello è una serie di "=" sotto un testo. Esegui `r=`, voilà! Questo ti salva dalla digitazione manuale di "=".

```shell
Chapter One
===========
```

Per saperne di più sugli operatori nella modalità visiva, controlla `:h visual-operators`.

## Modalità Visiva e Comandi della Riga di Comando

Puoi applicare selettivamente comandi della riga di comando su un blocco di testo evidenziato. Se hai queste dichiarazioni e vuoi sostituire "const" con "let" solo sulle prime due righe:

```shell
const one = "one";
const two = "two";
const three = "three";
```

Evidenzia le prime due righe con *qualsiasi* modalità visiva e esegui il comando di sostituzione `:s/const/let/g`:

```shell
let one = "one";
let two = "two";
const three = "three";
```

Nota che ho detto che puoi farlo con *qualsiasi* modalità visiva. Non devi evidenziare l'intera riga per eseguire il comando su quella riga. Finché selezioni almeno un carattere su ogni riga, il comando viene applicato.

## Aggiungere Testo su Più Righe

Puoi aggiungere testo su più righe in Vim utilizzando la modalità visiva a blocco. Se hai bisogno di aggiungere un punto e virgola alla fine di ogni riga:

```shell
const one = "one"
const two = "two"
const three = "three"
```

Con il cursore sulla prima riga:
- Esegui la modalità visiva a blocco e scendi di due righe (`Ctrl-V jj`).
- Evidenzia fino alla fine della riga (`$`).
- Aggiungi (`A`) poi digita ";".
- Esci dalla modalità visiva (`<Esc>`).

Dovresti vedere il punto e virgola aggiunto su ogni riga ora. Molto interessante! Ci sono due modi per entrare nella modalità di inserimento dalla modalità visiva a blocco: `A` per inserire il testo dopo il cursore o `I` per inserire il testo prima del cursore. Non confonderli con `A` (aggiungere testo alla fine della riga) e `I` (inserire testo prima della prima riga non vuota) dalla modalità normale.

In alternativa, puoi anche utilizzare il comando `:normal` per aggiungere testo su più righe:
- Evidenzia tutte e 3 le righe (`vjj`).
- Digita `:normal! A;`.

Ricorda, il comando `:normal` esegue comandi della modalità normale. Puoi istruirlo a eseguire `A;` per aggiungere il testo ";" alla fine della riga.

## Incrementare Numeri

Vim ha i comandi `Ctrl-X` e `Ctrl-A` per decrementare e incrementare numeri. Quando usati con la modalità visiva, puoi incrementare numeri su più righe.

Se hai questi elementi HTML:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

È una cattiva pratica avere diversi id con lo stesso nome, quindi incrementiamoli per renderli unici:
- Sposta il cursore sul "1" della seconda riga.
- Inizia la modalità visiva a blocco e scendi di 3 righe (`Ctrl-V 3j`). Questo evidenzia i restanti "1". Ora tutti i "1" dovrebbero essere evidenziati (eccetto la prima riga).
- Esegui `g Ctrl-A`.

Dovresti vedere questo risultato:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` incrementa i numeri su più righe. `Ctrl-X/Ctrl-A` può incrementare anche le lettere, con l'opzione di formati numerici:

```shell
set nrformats+=alpha
```

L'opzione `nrformats` istruisce Vim su quali basi sono considerate "numeri" per `Ctrl-A` e `Ctrl-X` per incrementare e decrementare. Aggiungendo `alpha`, un carattere alfabetico è ora considerato come un numero. Se hai i seguenti elementi HTML:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Metti il cursore sul secondo "app-a". Usa la stessa tecnica di sopra (`Ctrl-V 3j` poi `g Ctrl-A`) per incrementare gli id.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Selezionare l'Ultima Area della Modalità Visiva

In precedenza in questo capitolo, ho menzionato che `gv` può evidenziare rapidamente l'ultima evidenziazione della modalità visiva. Puoi anche andare alla posizione dell'inizio e della fine dell'ultima modalità visiva con questi due segni speciali:

```shell
`<    Vai al primo punto dell'evidenziazione della modalità visiva precedente
`>    Vai all'ultimo punto dell'evidenziazione della modalità visiva precedente
```

In precedenza, ho anche menzionato che puoi eseguire selettivamente comandi della riga di comando su un testo evidenziato, come `:s/const/let/g`. Quando lo hai fatto, avresti visto questo sotto:

```shell
:`<,`>s/const/let/g
```

In realtà stavi eseguendo un comando `s/const/let/g` *a intervallo* (con i due segni come indirizzi). Interessante!

Puoi sempre modificare questi segni in qualsiasi momento desideri. Se invece avessi bisogno di sostituire dall'inizio del testo evidenziato fino alla fine del file, devi solo cambiare il comando in:

```shell
:`<,$s/const/let/g
```

## Entrare in Modalità Visiva dalla Modalità di Inserimento

Puoi anche entrare in modalità visiva dalla modalità di inserimento. Per andare nella modalità visiva a carattere mentre sei in modalità di inserimento:

```shell
Ctrl-O v
```

Ricorda che eseguire `Ctrl-O` mentre sei in modalità di inserimento ti consente di eseguire un comando della modalità normale. Mentre sei in questa modalità in attesa di comando della modalità normale, esegui `v` per entrare nella modalità visiva a carattere. Nota che in basso a sinistra dello schermo, dice `--(insert) VISUAL--`. Questo trucco funziona con qualsiasi operatore della modalità visiva: `v`, `V` e `Ctrl-V`.

## Modalità Selezione

Vim ha una modalità simile alla modalità visiva chiamata modalità selezione. Come la modalità visiva, ha anche tre modalità diverse:

```shell
gh         Modalità selezione a carattere
gH         Modalità selezione a linea
gCtrl-h    Modalità selezione a blocco
```

La modalità selezione emula il comportamento di evidenziazione del testo di un editor normale più da vicino rispetto alla modalità visiva di Vim.

In un editor normale, dopo aver evidenziato un blocco di testo e digitato una lettera, diciamo la lettera "y", eliminerà il testo evidenziato e inserirà la lettera "y". Se evidenzi una riga con la modalità selezione a linea (`gH`) e digiti "y", eliminerà il testo evidenziato e inserirà la lettera "y".

Contrasta questa modalità selezione con la modalità visiva: se evidenzi una riga di testo con la modalità visiva a linea (`V`) e digiti "y", il testo evidenziato non verrà eliminato e sostituito dalla lettera "y", verrà copiato. Non puoi eseguire comandi della modalità normale sul testo evidenziato nella modalità selezione.

Personalmente non ho mai usato la modalità selezione, ma è bene sapere che esiste.

## Impara la Modalità Visiva nel Modo Giusto

La modalità visiva è la rappresentazione di Vim della procedura di evidenziazione del testo.

Se ti trovi ad utilizzare l'operazione della modalità visiva molto più spesso delle operazioni della modalità normale, fai attenzione. Questo è un anti-pattern. Ci vogliono più tasti per eseguire un'operazione della modalità visiva rispetto al suo equivalente nella modalità normale. Ad esempio, se devi eliminare una parola interna, perché usare quattro tasti, `viwd` (evidenziare visivamente una parola interna e poi eliminarla), se puoi farlo con solo tre tasti (`diw`)? Quest'ultimo è più diretto e conciso. Certamente, ci saranno momenti in cui le modalità visive sono appropriate, ma in generale, preferisci un approccio più diretto.