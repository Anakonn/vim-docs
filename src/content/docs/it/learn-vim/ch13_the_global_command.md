---
description: Questo documento spiega come utilizzare il comando globale in Vim per
  eseguire comandi su più righe contemporaneamente, migliorando l'efficienza.
title: Ch13. the Global Command
---

Fino ad ora hai imparato come ripetere l'ultima modifica con il comando punto (`.`), riprodurre azioni con le macro (`q`) e memorizzare testi nei registri (`"`).

In questo capitolo, imparerai come ripetere un comando della riga di comando con il comando globale.

## Panoramica del Comando Globale

Il comando globale di Vim viene utilizzato per eseguire un comando della riga di comando su più righe contemporaneamente.

A proposito, potresti aver sentito il termine "Comandi Ex" prima. In questa guida, li chiamo comandi della riga di comando. Sia i comandi Ex che i comandi della riga di comando sono la stessa cosa. Sono i comandi che iniziano con due punti (`:`). Il comando di sostituzione nell'ultimo capitolo era un esempio di comando Ex. Si chiamano Ex perché provengono originariamente dall'editor di testo Ex. Continuerò a riferirmi a loro come comandi della riga di comando in questa guida. Per un elenco completo dei comandi Ex, controlla `:h ex-cmd-index`.

Il comando globale ha la seguente sintassi:

```shell
:g/pattern/command
```

Il `pattern` corrisponde a tutte le righe che contengono quel pattern, simile al pattern nel comando di sostituzione. Il `command` può essere qualsiasi comando della riga di comando. Il comando globale funziona eseguendo `command` su ogni riga che corrisponde al `pattern`.

Se hai le seguenti espressioni:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Per rimuovere tutte le righe contenenti "console", puoi eseguire:

```shell
:g/console/d
```

Risultato:

```shell
const one = 1;

const two = 2;

const three = 3;
```

Il comando globale esegue il comando di eliminazione (`d`) su tutte le righe che corrispondono al pattern "console".

Quando esegui il comando `g`, Vim effettua due scansioni del file. Alla prima esecuzione, scansiona ogni riga e contrassegna la riga che corrisponde al pattern `/console/`. Una volta che tutte le righe corrispondenti sono contrassegnate, esegue per la seconda volta e applica il comando `d` sulle righe contrassegnate.

Se vuoi eliminare tutte le righe contenenti "const", esegui:

```shell
:g/const/d
```

Risultato:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Corrispondenza Inversa

Per eseguire il comando globale sulle righe non corrispondenti, puoi eseguire:

```shell
:g!/pattern/command
```

oppure

```shell
:v/pattern/command
```

Se esegui `:v/console/d`, eliminerà tutte le righe *non* contenenti "console".

## Pattern

Il comando globale utilizza lo stesso sistema di pattern del comando di sostituzione, quindi questa sezione servirà come ripasso. Sentiti libero di saltare alla sezione successiva o di leggere insieme!

Se hai queste espressioni:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Per eliminare le righe contenenti "one" o "two", esegui:

```shell
:g/one\|two/d
```

Per eliminare le righe contenenti qualsiasi cifra singola, esegui:

```shell
:g/[0-9]/d
```

oppure

```shell
:g/\d/d
```

Se hai l'espressione:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Per corrispondere alle righe contenenti da tre a sei zeri, esegui:

```shell
:g/0\{3,6\}/d
```

## Passare un Intervallo

Puoi passare un intervallo prima del comando `g`. Ecco alcuni modi per farlo:
- `:1,5g/console/d` corrisponde alla stringa "console" tra le righe 1 e 5 e le elimina.
- `:,5g/console/d` se non c'è indirizzo prima della virgola, allora inizia dalla riga corrente. Cerca la stringa "console" tra la riga corrente e la riga 5 e le elimina.
- `:3,g/console/d` se non c'è indirizzo dopo la virgola, allora termina alla riga corrente. Cerca la stringa "console" tra la riga 3 e la riga corrente e le elimina.
- `:3g/console/d` se passi solo un indirizzo senza virgola, esegue il comando solo sulla riga 3. Cerca sulla riga 3 e la elimina se contiene la stringa "console".

Oltre ai numeri, puoi anche usare questi simboli come intervallo:
- `.` significa la riga corrente. Un intervallo di `.,3` significa tra la riga corrente e la riga 3.
- `$` significa l'ultima riga nel file. L'intervallo `3,$` significa tra la riga 3 e l'ultima riga.
- `+n` significa n righe dopo la riga corrente. Puoi usarlo con `.` o senza. `3,+1` o `3,.+1` significa tra la riga 3 e la riga dopo la riga corrente.

Se non dai alcun intervallo, per impostazione predefinita influisce sull'intero file. Questo non è in realtà la norma. La maggior parte dei comandi della riga di comando di Vim viene eseguita solo sulla riga corrente se non gli passi alcun intervallo. Le due eccezioni notevoli sono i comandi globali (`:g`) e di salvataggio (`:w`).

## Comando Normale

Puoi eseguire un comando normale con il comando globale usando il comando della riga di comando `:normal`.

Se hai questo testo:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Per aggiungere un ";" alla fine di ogni riga, esegui:

```shell
:g/./normal A;
```

Analizziamo:
- `:g` è il comando globale.
- `/./` è un pattern per "righe non vuote". Corrisponde alle righe con almeno un carattere, quindi corrisponde alle righe con "const" e "console" e non corrisponde alle righe vuote.
- `normal A;` esegue il comando della riga di comando `:normal`. `A;` è il comando in modalità normale per inserire un ";" alla fine della riga.

## Esecuzione di una Macro

Puoi anche eseguire una macro con il comando globale. Una macro può essere eseguita con il comando `normal`. Se hai le espressioni:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Nota che le righe con "const" non hanno punti e virgola. Creiamo una macro per aggiungere un punto e virgola alla fine di quelle righe nel registro a:

```shell
qaA;<Esc>q
```

Se hai bisogno di un ripasso, controlla il capitolo sulle macro. Ora esegui:

```shell
:g/const/normal @a
```

Ora tutte le righe con "const" avranno un ";" alla fine.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Se hai seguito questo passo dopo passo, avrai due punti e virgola sulla prima riga. Per evitare ciò, esegui il comando globale dalla riga due in poi, `:2,$g/const/normal @a`.

## Comando Globale Ricorsivo

Il comando globale stesso è un tipo di comando della riga di comando, quindi tecnicamente puoi eseguire il comando globale all'interno di un comando globale.

Date le seguenti espressioni, se vuoi eliminare la seconda istruzione `console.log`:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Se esegui:

```shell
:g/console/g/two/d
```

Per prima cosa, `g` cercherà le righe contenenti il pattern "console" e troverà 3 corrispondenze. Poi il secondo `g` cercherà la riga contenente il pattern "two" tra quelle tre corrispondenze. Infine, eliminerà quella corrispondenza.

Puoi anche combinare `g` con `v` per trovare pattern positivi e negativi. Ad esempio:

```shell
:g/console/v/two/d
```

Invece di cercare la riga contenente il pattern "two", cercherà le righe *non* contenenti il pattern "two".

## Cambiare il Delimitatore

Puoi cambiare il delimitatore del comando globale come nel comando di sostituzione. Le regole sono le stesse: puoi usare qualsiasi carattere a byte singolo tranne lettere, numeri, `"`, `|` e `\`.

Per eliminare le righe contenenti "console":

```shell
:g@console@d
```

Se stai usando il comando di sostituzione con il comando globale, puoi avere due delimitatori diversi:

```shell
g@one@s+const+let+g
```

Qui il comando globale cercherà tutte le righe contenenti "one". Il comando di sostituzione sostituirà, tra quelle corrispondenze, la stringa "const" con "let".

## Il Comando Predefinito

Cosa succede se non specifichi alcun comando della riga di comando nel comando globale?

Il comando globale utilizzerà il comando di stampa (`:p`) per stampare il testo della riga corrente. Se esegui:

```shell
:g/console
```

Stamperà in fondo allo schermo tutte le righe contenenti "console".

A proposito, ecco un fatto interessante. Poiché il comando predefinito utilizzato dal comando globale è `p`, questo rende la sintassi `g`:

```shell
:g/re/p
```

- `g` = il comando globale
- `re` = il pattern regex
- `p` = il comando di stampa

Forma *"grep"*, lo stesso `grep` della riga di comando. Questo **non** è un caso. Il comando `g/re/p` proviene originariamente dall'editor Ed, uno dei primi editor di testo a riga. Il comando `grep` ha preso il suo nome da Ed.

Il tuo computer probabilmente ha ancora l'editor Ed. Esegui `ed` dal terminale (suggerimento: per uscire, digita `q`).

## Invertire l'Intero Buffer

Per invertire l'intero file, esegui:

```shell
:g/^/m 0
```

`^` è un pattern per l'inizio di una riga. Usa `^` per corrispondere a tutte le righe, comprese le righe vuote.

Se hai bisogno di invertire solo alcune righe, passagli un intervallo. Per invertire le righe tra la riga cinque e la riga dieci, esegui:

```shell
:5,10g/^/m 0
```

Per saperne di più sul comando di spostamento, controlla `:h :move`.

## Aggregare Tutti i Todo

Quando codice, a volte scrivo TODO nei file che sto modificando:

```shell
const one = 1;
console.log("one: ", one);
// TODO: dare da mangiare al cucciolo

const two = 2;
// TODO: dare da mangiare al cucciolo automaticamente
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: creare una startup che venda un distributore automatico di cuccioli
```

Può essere difficile tenere traccia di tutti i TODO creati. Vim ha un metodo `:t` (copia) per copiare tutte le corrispondenze in un indirizzo. Per saperne di più sul metodo di copia, controlla `:h :copy`.

Per copiare tutti i TODO alla fine del file per una più facile introspezione, esegui:

```shell
:g/TODO/t $
```

Risultato:

```shell
const one = 1;
console.log("one: ", one);
// TODO: dare da mangiare al cucciolo

const two = 2;
// TODO: dare da mangiare al cucciolo automaticamente
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: creare una startup che venda un distributore automatico di cuccioli

// TODO: dare da mangiare al cucciolo
// TODO: dare da mangiare al cucciolo automaticamente
// TODO: creare una startup che venda un distributore automatico di cuccioli
```

Ora posso rivedere tutti i TODO che ho creato, trovare un momento per farli o delegarli a qualcun altro e continuare a lavorare sul mio prossimo compito.

Se invece di copiarli vuoi spostare tutti i TODO alla fine, usa il comando di spostamento, `:m`:

```shell
:g/TODO/m $
```

Risultato:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: dare da mangiare al cucciolo
// TODO: dare da mangiare al cucciolo automaticamente
// TODO: creare una startup che venda un distributore automatico di cuccioli
```

## Eliminazione nel Buco Nero

Ricorda dal capitolo sui registri che i testi eliminati vengono memorizzati all'interno dei registri numerati (a condizione che siano sufficientemente grandi). Ogni volta che esegui `:g/console/d`, Vim memorizza le righe eliminate nei registri numerati. Se elimini molte righe, puoi rapidamente riempire tutti i registri numerati. Per evitare ciò, puoi sempre usare il registro del buco nero (`"_`) per *non* memorizzare le righe eliminate nei registri. Esegui:

```shell
:g/console/d_
```

Passando `_` dopo `d`, Vim non utilizzerà i tuoi registri di appunto.
## Ridurre più righe vuote a una riga vuota

Se hai un testo con più righe vuote:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Puoi ridurre rapidamente le righe vuote a una riga vuota con:

```shell
:g/^$/,/./-1j
```

Risultato:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normalmente, il comando globale accetta la seguente forma: `:g/pattern/command`. Tuttavia, puoi anche eseguire il comando globale con la seguente forma: `:g/pattern1/,/pattern2/command`. Con questo, Vim applicherà il `command` all'interno di `pattern1` e `pattern2`.

Tenendo presente ciò, analizziamo il comando `:g/^$/,/./-1j` secondo `:g/pattern1/,/pattern2/command`:
- `/pattern1/` è `/^$/`. Rappresenta una riga vuota (una riga con zero caratteri).
- `/pattern2/` è `/./` con il modificatore di riga `-1`. `/./` rappresenta una riga non vuota (una riga con almeno un carattere). Il `-1` significa la riga sopra di essa.
- `command` è `j`, il comando di unione (`:j`). In questo contesto, questo comando globale unisce tutte le righe date.

A proposito, se vuoi ridurre più righe vuote a zero righe, esegui invece questo:

```shell
:g/^$/,/./j
```

Un'alternativa più semplice:

```shell
:g/^$/-j
```

Il tuo testo è ora ridotto a:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Ordinamento Avanzato

Vim ha un comando `:sort` per ordinare le righe all'interno di un intervallo. Ad esempio:

```shell
d
b
a
e
c
```

Puoi ordinarli eseguendo `:sort`. Se gli dai un intervallo, ordinerà solo le righe all'interno di quell'intervallo. Ad esempio, `:3,5sort` ordina solo le righe tre e cinque.

Se hai le seguenti espressioni:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Se hai bisogno di ordinare gli elementi all'interno degli array, ma non gli array stessi, puoi eseguire questo:

```shell
:g/\[/+1,/\]/-1sort
```

Risultato:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

Ottimo! Ma il comando sembra complicato. Analizziamolo. Questo comando segue anche la forma `:g/pattern1/,/pattern2/command`.

- `:g` è il pattern del comando globale.
- `/\[/+1` è il primo pattern. Corrisponde a una parentesi quadra sinistra "[". Il `+1` si riferisce alla riga sottostante.
- `/\]/-1` è il secondo pattern. Corrisponde a una parentesi quadra destra "]". Il `-1` si riferisce alla riga sopra di essa.
- `/\[/+1,/\]/-1` si riferisce quindi a tutte le righe tra "[" e "]".
- `sort` è un comando della riga di comando per ordinare.

## Impara il Comando Globale nel Modo Intelligente

Il comando globale esegue il comando della riga di comando su tutte le righe corrispondenti. Con esso, devi solo eseguire un comando una volta e Vim farà il resto per te. Per diventare esperto nel comando globale, sono richieste due cose: un buon vocabolario di comandi della riga di comando e una conoscenza delle espressioni regolari. Man mano che trascorri più tempo a usare Vim, imparerai naturalmente più comandi della riga di comando. Una conoscenza delle espressioni regolari richiederà un approccio più attivo. Ma una volta che ti sentirai a tuo agio con le espressioni regolari, sarai avanti rispetto a molti.

Alcuni degli esempi qui sono complicati. Non lasciarti intimidire. Prenditi davvero il tuo tempo per capirli. Impara a leggere i pattern. Non arrenderti.

Ogni volta che hai bisogno di eseguire più comandi, fermati e vedi se puoi usare il comando `g`. Identifica il miglior comando per il lavoro e scrivi un pattern per mirare a quante più cose possibile contemporaneamente.

Ora che sai quanto è potente il comando globale, impariamo come usare i comandi esterni per aumentare il tuo arsenale di strumenti.