---
description: Questo capitolo esplora le funzionalità di ricerca e sostituzione in
  Vim, utilizzando espressioni regolari per migliorare l'efficienza nell'editing del
  testo.
title: Ch12. Search and Substitute
---

Questo capitolo tratta due concetti separati ma correlati: ricerca e sostituzione. Spesso, durante la modifica, è necessario cercare più testi in base ai loro modelli di minimo comune denominatore. Imparando a utilizzare le espressioni regolari nella ricerca e nella sostituzione invece di stringhe letterali, sarai in grado di mirare rapidamente a qualsiasi testo.

A proposito, in questo capitolo userò `/` quando parlerò di ricerca. Tutto ciò che puoi fare con `/` può essere fatto anche con `?`.

## Sensibilità al Caso Intelligente

Può essere complicato cercare di abbinare il caso del termine di ricerca. Se stai cercando il testo "Learn Vim", puoi facilmente digitare male il caso di una lettera e ottenere un risultato di ricerca falso. Non sarebbe più facile e sicuro se potessi abbinare qualsiasi caso? Qui è dove l'opzione `ignorecase` brilla. Basta aggiungere `set ignorecase` nel tuo vimrc e tutti i tuoi termini di ricerca diventano insensibili al caso. Ora non devi più fare `/Learn Vim`, `/learn vim` funzionerà.

Tuttavia, ci sono momenti in cui è necessario cercare una frase specifica per il caso. Un modo per farlo è disattivare l'opzione `ignorecase` eseguendo `set noignorecase`, ma è un gran lavoro accenderla e spegnerla ogni volta che hai bisogno di cercare una frase sensibile al caso.

Per evitare di attivare e disattivare `ignorecase`, Vim ha un'opzione `smartcase` per cercare stringhe insensibili al caso se il modello di ricerca *contiene almeno un carattere maiuscolo*. Puoi combinare sia `ignorecase` che `smartcase` per eseguire una ricerca insensibile al caso quando inserisci tutti i caratteri minuscoli e una ricerca sensibile al caso quando inserisci uno o più caratteri maiuscoli.

All'interno del tuo vimrc, aggiungi:

```shell
set ignorecase smartcase
```

Se hai questi testi:

```shell
hello
HELLO
Hello
```

- `/hello` corrisponde a "hello", "HELLO" e "Hello".
- `/HELLO` corrisponde solo a "HELLO".
- `/Hello` corrisponde solo a "Hello".

C'è un inconveniente. E se hai bisogno di cercare solo una stringa minuscola? Quando fai `/hello`, Vim ora esegue una ricerca insensibile al caso. Puoi utilizzare il modello `\C` ovunque nel tuo termine di ricerca per dire a Vim che il termine di ricerca successivo sarà sensibile al caso. Se fai `/\Chello`, corrisponderà rigorosamente a "hello", non a "HELLO" o "Hello".

## Primo e Ultimo Carattere in una Riga

Puoi usare `^` per corrispondere al primo carattere in una riga e `$` per corrispondere all'ultimo carattere in una riga.

Se hai questo testo:

```shell
hello hello
```

Puoi mirare al primo "hello" con `/^hello`. Il carattere che segue `^` deve essere il primo carattere in una riga. Per mirare all'ultimo "hello", esegui `/hello$`. Il carattere prima di `$` deve essere l'ultimo carattere in una riga.

Se hai questo testo:

```shell
hello hello friend
```

Eseguendo `/hello$` non corrisponderà a nulla perché "friend" è l'ultimo termine in quella riga, non "hello".

## Ricerca Ripetuta

Puoi ripetere la ricerca precedente con `//`. Se hai appena cercato `/hello`, eseguire `//` è equivalente a eseguire `/hello`. Questo collegamento può farti risparmiare alcuni tasti, specialmente se hai appena cercato una stringa lunga. Ricorda anche che puoi usare `n` e `N` per ripetere l'ultima ricerca nella stessa direzione e nella direzione opposta, rispettivamente.

E se vuoi richiamare rapidamente *n* ultimi termini di ricerca? Puoi attraversare rapidamente la cronologia delle ricerche premendo prima `/`, quindi premi i tasti freccia `su`/`giù` (o `Ctrl-N`/`Ctrl-P`) fino a trovare il termine di ricerca di cui hai bisogno. Per vedere tutta la tua cronologia delle ricerche, puoi eseguire `:history /`.

Quando raggiungi la fine di un file durante la ricerca, Vim restituisce un errore: `"Search hit the BOTTOM without match for: {your-search}"`. A volte questo può essere un buon salvaguardia contro la ricerca eccessiva, ma altre volte vuoi ciclare la ricerca di nuovo in cima. Puoi usare l'opzione `set wrapscan` per far sì che Vim cerchi di nuovo in cima al file quando raggiungi la fine del file. Per disattivare questa funzione, esegui `set nowrapscan`.

## Ricerca di Parole Alternative

È comune cercare più parole contemporaneamente. Se hai bisogno di cercare *o* "hello vim" o "hola vim", ma non "salve vim" o "bonjour vim", puoi usare il modello `|`.

Dato questo testo:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Per corrispondere sia a "hello" che a "hola", puoi fare `/hello\|hola`. Devi eseguire l'escape (`\`) dell'operatore o (`|`), altrimenti Vim cercherà letteralmente la stringa "|".

Se non vuoi digitare `\|` ogni volta, puoi usare la sintassi `magic` (`\v`) all'inizio della ricerca: `/\vhello|hola`. Non tratterò `magic` in questa guida, ma con `\v`, non devi più eseguire l'escape dei caratteri speciali. Per saperne di più su `\v`, sentiti libero di controllare `:h \v`.

## Impostare l'Inizio e la Fine di un Abbinamento

Forse hai bisogno di cercare un testo che fa parte di una parola composta. Se hai questi testi:

```shell
11vim22
vim22
11vim
vim
```

Se hai bisogno di selezionare "vim" ma solo quando inizia con "11" e finisce con "22", puoi usare gli operatori `\zs` (inizio abbinamento) e `\ze` (fine abbinamento). Esegui:

```shell
/11\zsvim\ze22
```

Vim deve comunque abbinare l'intero modello "11vim22", ma evidenzia solo il modello racchiuso tra `\zs` e `\ze`. Un altro esempio:

```shell
foobar
foobaz
```

Se hai bisogno di abbinare "foo" in "foobaz" ma non in "foobar", esegui:

```shell
/foo\zebaz
```

## Ricerca di Intervalli di Caratteri

Tutti i tuoi termini di ricerca fino a questo punto sono stati una ricerca di parole letterali. Nella vita reale, potresti dover utilizzare un modello generale per trovare il tuo testo. Il modello più basilare è l'intervallo di caratteri, `[ ]`.

Se hai bisogno di cercare qualsiasi cifra, probabilmente non vuoi digitare `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` ogni singola volta. Invece, usa `/[0-9]` per corrispondere a una singola cifra. L'espressione `0-9` rappresenta un intervallo di numeri da 0 a 9 che Vim cercherà di abbinare, quindi se stai cercando cifre tra 1 e 5, usa `/[1-5]`.

Le cifre non sono gli unici tipi di dati che Vim può cercare. Puoi anche fare `/[a-z]` per cercare alfabeto minuscolo e `/[A-Z]` per cercare alfabeto maiuscolo.

Puoi combinare questi intervalli insieme. Se hai bisogno di cercare cifre da 0 a 9 e sia alfabeto minuscolo che maiuscolo da "a" a "f" (come un esadecimale), puoi fare `/[0-9a-fA-F]`.

Per eseguire una ricerca negativa, puoi aggiungere `^` all'interno delle parentesi quadre dell'intervallo. Per cercare un non-digit, esegui `/[^0-9]`. Vim abbinerà qualsiasi carattere purché non sia una cifra. Fai attenzione che il caret (`^`) all'interno delle parentesi quadre è diverso dal caret all'inizio di una riga (es: `/^hello`). Se un caret è all'esterno di una coppia di parentesi quadre ed è il primo carattere nel termine di ricerca, significa "il primo carattere in una riga". Se un caret è all'interno di una coppia di parentesi quadre ed è il primo carattere all'interno delle parentesi, significa un operatore di ricerca negativa. `/^abc` corrisponde al primo "abc" in una riga e `/[^abc]` corrisponde a qualsiasi carattere tranne "a", "b" o "c".

## Ricerca di Caratteri Ripetuti

Se hai bisogno di cercare cifre doppie in questo testo:

```shell
1aa
11a
111
```

Puoi usare `/[0-9][0-9]` per corrispondere a un carattere di due cifre, ma questo metodo non è scalabile. E se hai bisogno di abbinare venti cifre? Digitare `[0-9]` venti volte non è un'esperienza divertente. Ecco perché hai bisogno di un argomento `count`.

Puoi passare `count` alla tua ricerca. Ha la seguente sintassi:

```shell
{n,m}
```

A proposito, queste parentesi graffe `count` devono essere eseguite in escape quando le usi in Vim. L'operatore `count` è posizionato dopo un singolo carattere che desideri incrementare.

Ecco le quattro diverse varianti della sintassi `count`:
- `{n}` è un abbinamento esatto. `/[0-9]\{2\}` corrisponde ai numeri a due cifre: "11" e "11" in "111".
- `{n,m}` è un abbinamento di intervallo. `/[0-9]\{2,3\}` corrisponde a numeri tra 2 e 3 cifre: "11" e "111".
- `{,m}` è un abbinamento fino a. `/[0-9]\{,3\}` corrisponde a numeri fino a 3 cifre: "1", "11" e "111".
- `{n,}` è un abbinamento di almeno. `/[0-9]\{2,\}` corrisponde a numeri di almeno 2 o più cifre: "11" e "111".

Gli argomenti di conteggio `\{0,\}` (zero o più) e `\{1,\}` (uno o più) sono modelli di ricerca comuni e Vim ha operatori speciali per essi: `*` e `+` (`+` deve essere eseguito in escape mentre `*` funziona bene senza escape). Se fai `/[0-9]*`, è lo stesso di `/[0-9]\{0,\}`. Cerca zero o più cifre. Corrisponderà a "", "1", "123". A proposito, corrisponderà anche a non-cifre come "a", perché tecnicamente c'è zero cifra nella lettera "a". Pensa attentamente prima di usare `*`. Se fai `/[0-9]\+`, è lo stesso di `/[0-9]\{1,\}`. Cerca una o più cifre. Corrisponderà a "1" e "12".

## Intervalli di Caratteri Predefiniti

Vim ha intervalli predefiniti per caratteri comuni come cifre e alfabeto. Non passerò in rassegna ognuno di essi qui, ma puoi trovare l'elenco completo all'interno di `:h /character-classes`. Ecco quelli utili:

```shell
\d    Cifra [0-9]
\D    Non cifra [^0-9]
\s    Carattere di spazio (spazio e tab)
\S    Carattere non di spazio (tutto tranne spazio e tab)
\w    Carattere di parola [0-9A-Za-z_]
\l    Alfabeto minuscolo [a-z]
\u    Carattere maiuscolo [A-Z]
```

Puoi usarli come useresti gli intervalli di caratteri. Per cercare qualsiasi singola cifra, invece di usare `/[0-9]`, puoi usare `/\d` per una sintassi più concisa.

## Esempio di Ricerca: Catturare un Testo Tra una Coppia di Caratteri Simili

Se vuoi cercare una frase circondata da una coppia di virgolette:

```shell
"Vim is awesome!"
```

Esegui questo:

```shell
/"[^"]\+"
```

Analizziamo:
- `"` è una virgoletta doppia letterale. Corrisponde alla prima virgoletta doppia.
- `[^"]` significa qualsiasi carattere tranne una virgoletta doppia. Corrisponde a qualsiasi carattere alfanumerico e di spazio purché non sia una virgoletta doppia.
- `\+` significa uno o più. Poiché è preceduto da `[^"]`, Vim cerca uno o più caratteri che non siano una virgoletta doppia.
- `"` è una virgoletta doppia letterale. Corrisponde alla virgoletta doppia di chiusura.

Quando Vim vede la prima `"`, inizia la cattura del modello. Non appena vede la seconda virgoletta doppia in una riga, corrisponde al secondo modello `"` e interrompe la cattura del modello. Nel frattempo, tutti i caratteri non virgolette doppi in mezzo sono catturati dal modello `[^"]\+`, in questo caso, la frase `Vim is awesome!`. Questo è un modello comune per catturare una frase circondata da una coppia di delimitatori simili.

- Per catturare una frase circondata da virgolette singole, puoi usare `/'[^']\+'`.
- Per catturare una frase circondata da zeri, puoi usare `/0[^0]\+0`.

## Esempio di Ricerca: Catturare un Numero di Telefono

Se vuoi abbinare un numero di telefono statunitense separato da un trattino (`-`), come `123-456-7890`, puoi usare:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Il numero di telefono statunitense consiste in un insieme di tre cifre, seguito da altre tre cifre e infine da quattro cifre. Analizziamo:
- `\d\{3\}` corrisponde a una cifra ripetuta esattamente tre volte
- `-` è un trattino letterale

Puoi evitare di digitare gli escape con `\v`:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Questo modello è utile anche per catturare qualsiasi cifra ripetuta, come indirizzi IP e codici postali.

Questo copre la parte di ricerca di questo capitolo. Ora passiamo alla sostituzione.

## Sostituzione di Base

Il comando di sostituzione di Vim è un comando utile per trovare e sostituire rapidamente qualsiasi modello. La sintassi di sostituzione è:

```shell
:s/{old-pattern}/{new-pattern}/
```

Iniziamo con un uso di base. Se hai questo testo:

```shell
vim is good
```

Sostituiamo "good" con "awesome" perché Vim è fantastico. Esegui `:s/good/awesome/`. Dovresti vedere:

```shell
vim is awesome
```
## Ripetere l'Ultima Sostituzione

Puoi ripetere l'ultimo comando di sostituzione con il comando normale `&` o eseguendo `:s`. Se hai appena eseguito `:s/bene/ottimo/`, eseguire `&` o `:s` lo ripeterà.

Inoltre, all'inizio di questo capitolo ho menzionato che puoi usare `//` per ripetere il modello di ricerca precedente. Questo trucco funziona con il comando di sostituzione. Se `/bene` è stato eseguito di recente e lasci il primo argomento del modello di sostituzione vuoto, come in `:s//ottimo/`, funziona allo stesso modo di eseguire `:s/bene/ottimo/`.

## Intervallo di Sostituzione

Proprio come molti comandi Ex, puoi passare un argomento di intervallo nel comando di sostituzione. La sintassi è:

```shell
:[intervallo]s/vecchio/nuovo/
```

Se hai queste espressioni:

```shell
let uno = 1;
let due = 2;
let tre = 3;
let quattro = 4;
let cinque = 5;
```

Per sostituire "let" con "const" nelle righe tre a cinque, puoi fare:

```shell
:3,5s/let/const/
```

Ecco alcune variazioni di intervallo che puoi passare:

- `:,3s/let/const/` - se non viene fornito nulla prima della virgola, rappresenta la riga corrente. Sostituisci dalla riga corrente alla riga 3.
- `:1,s/let/const/` - se non viene fornito nulla dopo la virgola, rappresenta anche la riga corrente. Sostituisci dalla riga 1 alla riga corrente.
- `:3s/let/const/` - se viene fornito solo un valore come intervallo (senza virgola), esegue la sostituzione solo su quella riga.

In Vim, `%` di solito significa l'intero file. Se esegui `:%s/let/const/`, eseguirà la sostituzione su tutte le righe. Tieni presente questa sintassi di intervallo. Molti comandi della riga di comando che imparerai nei capitoli a venire seguiranno questa forma.

## Corrispondenza dei Modelli

Le prossime sezioni tratteranno le espressioni regolari di base. Una solida conoscenza dei modelli è essenziale per padroneggiare il comando di sostituzione.

Se hai le seguenti espressioni:

```shell
let uno = 1;
let due = 2;
let tre = 3;
let quattro = 4;
let cinque = 5;
```

Per aggiungere un paio di virgolette attorno alle cifre:

```shell
:%s/\d/"\0"/
```

Il risultato:

```shell
let uno = "1";
let due = "2";
let tre = "3";
let quattro = "4";
let cinque = "5";
```

Analizziamo il comando:
- `:%s` mira all'intero file per eseguire la sostituzione.
- `\d` è l'intervallo predefinito di Vim per le cifre (simile all'uso di `[0-9]`).
- `"\0"` qui le virgolette doppie sono virgolette letterali. `\0` è un carattere speciale che rappresenta "l'intero modello corrispondente". Il modello corrispondente qui è un numero a cifra singola, `\d`.

In alternativa, `&` rappresenta anche l'intero modello corrispondente come `\0`. `:s/\d/"&"/` avrebbe funzionato anche.

Consideriamo un altro esempio. Date queste espressioni e hai bisogno di scambiare tutti i "let" con i nomi delle variabili.

```shell
uno let = "1";
due let = "2";
tre let = "3";
quattro let = "4";
cinque let = "5";
```

Per farlo, esegui:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

Il comando sopra contiene troppi caratteri di escape ed è difficile da leggere. In questo caso è più conveniente utilizzare l'operatore `\v`:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Il risultato:

```shell
let uno = "1";
let due = "2";
let tre = "3";
let quattro = "4";
let cinque = "5";
```

Ottimo! Analizziamo quel comando:
- `:%s` mira a tutte le righe nel file per eseguire la sostituzione.
- `(\w+) (\w+)` è una corrispondenza di gruppo. `\w` è uno degli intervalli predefiniti di Vim per un carattere di parola (`[0-9A-Za-z_]`). Le `( )` circostanti catturano una corrispondenza di carattere di parola in un gruppo. Nota lo spazio tra i due gruppi. `(\w+) (\w+)` cattura due gruppi. Il primo gruppo cattura "uno" e il secondo gruppo cattura "due".
- `\2 \1` restituisce il gruppo catturato in ordine inverso. `\2` contiene la stringa catturata "let" e `\1` la stringa "uno". Avere `\2 \1` restituisce la stringa "let uno".

Ricorda che `\0` rappresenta l'intero modello corrispondente. Puoi suddividere la stringa corrispondente in gruppi più piccoli con `( )`. Ogni gruppo è rappresentato da `\1`, `\2`, `\3`, ecc.

Facciamo un altro esempio per consolidare questo concetto di corrispondenza di gruppo. Se hai questi numeri:

```shell
123
456
789
```

Per invertire l'ordine, esegui:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Il risultato è:

```shell
321
654
987
```

Ogni `(\d)` corrisponde a ogni cifra e crea un gruppo. Nella prima riga, il primo `(\d)` ha un valore di 1, il secondo `(\d)` ha un valore di 2 e il terzo `(\d)` ha un valore di 3. Sono memorizzati nelle variabili `\1`, `\2` e `\3`. Nella seconda metà della tua sostituzione, il nuovo modello `\3\2\1` risulta nel valore "321" sulla riga uno.

Se avessi eseguito invece:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Avresti ottenuto un risultato diverso:

```shell
312
645
978
```

Questo perché ora hai solo due gruppi. Il primo gruppo, catturato da `(\d\d)`, è memorizzato in `\1` e ha il valore di 12. Il secondo gruppo, catturato da `(\d)`, è memorizzato in `\2` e ha il valore di 3. `\2\1` quindi restituisce 312.

## Flag di Sostituzione

Se hai la frase:

```shell
pancake al cioccolato, pancake alla fragola, pancake ai mirtilli
```

Per sostituire tutti i pancake con i donut, non puoi semplicemente eseguire:

```shell
:s/pancake/donut
```

Il comando sopra sostituirà solo la prima corrispondenza, dandoti:

```shell
donut al cioccolato, pancake alla fragola, pancake ai mirtilli
```

Ci sono due modi per risolvere questo. Puoi eseguire il comando di sostituzione altre due volte oppure puoi passargli un flag globale (`g`) per sostituire tutte le corrispondenze in una riga.

Parliamo del flag globale. Esegui:

```shell
:s/pancake/donut/g
```

Vim sostituisce tutti i pancake con i donut in un solo comando. Il comando globale è uno dei diversi flag che il comando di sostituzione accetta. Passi i flag alla fine del comando di sostituzione. Ecco un elenco di flag utili:

```shell
&    Riutilizza i flag dal comando di sostituzione precedente.
g    Sostituisci tutte le corrispondenze nella riga.
c    Chiedi conferma per la sostituzione.
e    Impedisce che venga visualizzato un messaggio di errore quando la sostituzione fallisce.
i    Esegui la sostituzione senza distinzione tra maiuscole e minuscole.
I    Esegui la sostituzione con distinzione tra maiuscole e minuscole.
```

Ci sono più flag che non elenco sopra. Per leggere tutti i flag, controlla `:h s_flags`.

A proposito, i comandi di ripetizione della sostituzione (`&` e `:s`) non mantengono i flag. Eseguire `&` ripeterà solo `:s/pancake/donut/` senza `g`. Per ripetere rapidamente l'ultimo comando di sostituzione con tutti i flag, esegui `:&&`.

## Cambiare il Delimitatore

Se hai bisogno di sostituire un URL con un lungo percorso:

```shell
https://mysite.com/a/b/c/d/e
```

Per sostituirlo con la parola "ciao", esegui:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/ciao/
```

Tuttavia, è difficile capire quali barre oblique (`/`) fanno parte del modello di sostituzione e quali sono i delimitatori. Puoi cambiare il delimitatore con qualsiasi carattere a byte singolo (eccetto per alfabeti, numeri, o `"`, `|`, e `\`). Sostituiamoli con `+`. Il comando di sostituzione sopra può quindi essere riscritto come:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+ciao+
```

Ora è più facile vedere dove sono i delimitatori.

## Sostituzione Speciale

Puoi anche modificare il caso del testo che stai sostituendo. Date le seguenti espressioni e il tuo compito è quello di rendere maiuscole le variabili "uno", "due", "tre", ecc.

```shell
let uno = "1";
let due = "2";
let tre = "3";
let quattro = "4";
let cinque = "5";
```

Esegui:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Otterrai:

```shell
let UNO = "1";
let DUE = "2";
let TRE = "3";
let QUATTRO = "4";
let CINQUE = "5";
```

L'analisi:
- `(\w+) (\w+)` cattura i primi due gruppi corrispondenti, come "let" e "uno".
- `\1` restituisce il valore del primo gruppo, "let".
- `\U\2` rende maiuscolo (`\U`) il secondo gruppo (`\2`).

Il trucco di questo comando è l'espressione `\U\2`. `\U` istruisce il carattere successivo a essere reso maiuscolo.

Facciamo un altro esempio. Supponiamo che tu stia scrivendo una guida Vim e hai bisogno di capitalizzare la prima lettera di ogni parola in una riga.

```shell
vim è il miglior editor di testo dell'intera galassia
```

Puoi eseguire:

```shell
:s/\<./\U&/g
```

Il risultato:

```shell
Vim È Il Miglior Editor Di Testo Dell'Intera Galassia
```

Ecco le analisi:
- `:s` sostituisce la riga corrente.
- `\<.` è composto da due parti: `\<` per corrispondere all'inizio di una parola e `.` per corrispondere a qualsiasi carattere. L'operatore `\<` fa sì che il carattere successivo sia il primo carattere di una parola. Poiché `.` è il carattere successivo, corrisponderà al primo carattere di qualsiasi parola.
- `\U&` rende maiuscolo il simbolo successivo, `&`. Ricorda che `&` (o `\0`) rappresenta l'intera corrispondenza. Corrisponde al primo carattere di qualsiasi parola.
- `g` il flag globale. Senza di esso, questo comando sostituisce solo la prima corrispondenza. Devi sostituire ogni corrispondenza su questa riga.

Per saperne di più sui simboli di sostituzione speciale come `\U`, controlla `:h sub-replace-special`.

## Modelli Alternativi

A volte hai bisogno di corrispondere a più modelli contemporaneamente. Se hai i seguenti saluti:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Devi sostituire la parola "vim" con "amico" ma solo sulle righe contenenti la parola "hello" o "hola". Ricorda da prima di questo capitolo, puoi usare `|` per più modelli alternativi.

```shell
:%s/\v(hello|hola) vim/\1 amico/g
```

Il risultato:

```shell
hello amico
hola amico
salve vim
bonjour vim
```

Ecco l'analisi:
- `%s` esegue il comando di sostituzione su ogni riga in un file.
- `(hello|hola)` corrisponde *o* "hello" o "hola" e lo considera come un gruppo.
- `vim` è la parola letterale "vim".
- `\1` è il primo gruppo, che è o il testo "hello" o "hola".
- `amico` è la parola letterale "amico".

## Sostituire l'Inizio e la Fine di un Modello

Ricorda che puoi usare `\zs` e `\ze` per definire l'inizio e la fine di una corrispondenza. Questa tecnica funziona anche nella sostituzione. Se hai:

```shell
pancake al cioccolato
sweetcake alla fragola
hotcake ai mirtilli
```

Per sostituire "cake" in "hotcake" con "dog" per ottenere un "hotdog":

```shell
:%s/hot\zscake/dog/g
```

Risultato:

```shell
pancake al cioccolato
sweetcake alla fragola
blueberry hotdog
```
## Avido e Non Avido

Puoi sostituire la n-esima corrispondenza in una riga con questo trucco:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Per sostituire il terzo "Mississippi" con "Arkansas", esegui:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

La scomposizione:
- `:s/` il comando di sostituzione.
- `\v` è la parola magica così non devi scappare le parole chiave speciali.
- `.` corrisponde a qualsiasi singolo carattere.
- `{-}` esegue una corrispondenza non avida di 0 o più dell'atomo precedente.
- `\zsMississippi` rende "Mississippi" l'inizio della corrispondenza.
- `(...){3}` cerca la terza corrispondenza.

Hai visto la sintassi `{3}` in precedenza in questo capitolo. In questo caso, `{3}` corrisponderà esattamente alla terza corrispondenza. Il nuovo trucco qui è `{-}`. È una corrispondenza non avida. Trova la corrispondenza più breve del modello dato. In questo caso, `(.{-}Mississippi)` corrisponde alla minima quantità di "Mississippi" preceduta da qualsiasi carattere. Contrasta questo con `(.*Mississippi)` dove trova la corrispondenza più lunga del modello dato.

Se usi `(.{-}Mississippi)`, ottieni cinque corrispondenze: "One Mississippi", "Two Mississippi", ecc. Se usi `(.*Mississippi)`, ottieni una corrispondenza: l'ultimo "Mississippi". `*` è un corrispondente avido e `{-}` è un corrispondente non avido. Per saperne di più, controlla `:h /\{-` e `:h non-greedy`.

Facciamo un esempio più semplice. Se hai la stringa:

```shell
abc1de1
```

Puoi corrispondere "abc1de1" (avido) con:

```shell
/a.*1
```

Puoi corrispondere "abc1" (non avido) con:

```shell
/a.\{-}1
```

Quindi, se hai bisogno di maiuscolare la corrispondenza più lunga (avida), esegui:

```shell
:s/a.*1/\U&/g
```

Per ottenere:

```shell
ABC1DEFG1
```

Se hai bisogno di maiuscolare la corrispondenza più breve (non avida), esegui:

```shell
:s/a.\{-}1/\U&/g
```

Per ottenere:

```shell
ABC1defg1
```

Se sei nuovo al concetto di avido vs non avido, può essere difficile da comprendere. Sperimenta con diverse combinazioni fino a quando non lo capisci.

## Sostituzione Attraverso Più File

Infine, impariamo come sostituire frasi attraverso più file. Per questa sezione, supponi di avere due file: `food.txt` e `animal.txt`.

Dentro `food.txt`:

```shell
corndog
hotdog
chilidog
```

Dentro `animal.txt`:

```shell
large dog
medium dog
small dog
```

Supponi che la tua struttura di directory assomigli a questa:

```shell
- food.txt
- animal.txt
```

Per prima cosa, cattura entrambi `food.txt` e `animal.txt` dentro `:args`. Ricorda dai capitoli precedenti che `:args` può essere usato per creare un elenco di nomi di file. Ci sono diversi modi per farlo all'interno di Vim, uno di questi è eseguire questo da dentro Vim:

```shell
:args *.txt                  cattura tutti i file txt nella posizione attuale
```

Per testarlo, quando esegui `:args`, dovresti vedere:

```shell
[food.txt] animal.txt
```

Ora che tutti i file rilevanti sono memorizzati nell'elenco degli argomenti, puoi eseguire una sostituzione su più file con il comando `:argdo`. Esegui:

```shell
:argdo %s/dog/chicken/
```

Questo esegue la sostituzione contro tutti i file all'interno dell'elenco `:args`. Infine, salva i file modificati con:

```shell
:argdo update
```

`:args` e `:argdo` sono strumenti utili per applicare comandi da riga di comando attraverso più file. Provalo con altri comandi!

## Sostituzione Attraverso Più File Con Macro

In alternativa, puoi anche eseguire il comando di sostituzione attraverso più file con le macro. Esegui:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

La scomposizione:
- `:args *.txt` aggiunge tutti i file di testo nell'elenco `:args`.
- `qq` inizia la macro nel registro "q".
- `:%s/dog/chicken/g` sostituisce "dog" con "chicken" su tutte le righe nel file corrente.
- `:wnext` salva il file e poi passa al file successivo nell'elenco `args`.
- `q` ferma la registrazione della macro.
- `99@q` esegue la macro novantanove volte. Vim fermerà l'esecuzione della macro dopo aver incontrato il primo errore, quindi Vim non eseguirà effettivamente la macro novantanove volte.

## Imparare Ricerca e Sostituzione nel Modo Intelligente

La capacità di cercare bene è una competenza necessaria nell'editing. Padroneggiare la ricerca ti consente di utilizzare la flessibilità delle espressioni regolari per cercare qualsiasi modello in un file. Prenditi il tuo tempo per imparare queste. Per migliorare con le espressioni regolari, devi usarle attivamente. Una volta ho letto un libro sulle espressioni regolari senza effettivamente farlo e ho dimenticato quasi tutto ciò che ho letto dopo. La codifica attiva è il modo migliore per padroneggiare qualsiasi abilità.

Un buon modo per migliorare la tua abilità di corrispondenza dei modelli è ogni volta che hai bisogno di cercare un modello (come "hello 123"), invece di interrogare il termine di ricerca letterale (`/hello 123`), prova a trovare un modello per esso (qualcosa come `/\v(\l+) (\d+)`). Molti di questi concetti delle espressioni regolari sono anche applicabili nella programmazione generale, non solo quando si utilizza Vim.

Ora che hai imparato riguardo alla ricerca avanzata e alla sostituzione in Vim, impariamo uno dei comandi più versatili, il comando globale.