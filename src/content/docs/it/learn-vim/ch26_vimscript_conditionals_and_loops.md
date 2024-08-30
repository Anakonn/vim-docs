---
description: Questo documento introduce i tipi di dati Vimscript e spiega come utilizzare
  operatori relazionali per scrivere condizionali e cicli in un programma di base.
title: Ch26. Vimscript Conditionals and Loops
---

Dopo aver appreso quali sono i tipi di dati di base, il passo successivo è imparare come combinarli insieme per iniziare a scrivere un programma di base. Un programma di base consiste in condizionali e cicli.

In questo capitolo, imparerai come utilizzare i tipi di dati Vimscript per scrivere condizionali e cicli.

## Operatori Relazionali

Gli operatori relazionali di Vimscript sono simili a molti linguaggi di programmazione:

```shell
a == b		equivalente a
a != b		non equivalente a
a >  b		maggiore di
a >= b		maggiore o uguale a
a <  b		minore di
a <= b		minore o uguale a
```

Ad esempio:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Ricorda che le stringhe vengono convertite in numeri in un'espressione aritmetica. Qui Vim converte anche le stringhe in numeri in un'espressione di uguaglianza. "5foo" viene convertito in 5 (vero):

```shell
:echo 5 == "5foo"
" restituisce true
```

Ricorda anche che se inizi una stringa con un carattere non numerico come "foo5", la stringa viene convertita nel numero 0 (falso).

```shell
echo 5 == "foo5"
" restituisce false
```

### Operatori Logici per Stringhe

Vim ha più operatori relazionali per confrontare le stringhe:

```shell
a =~ b
a !~ b
```

Per esempi:

```shell
let str = "colazione abbondante"

echo str =~ "colazione"
" restituisce true

echo str =~ "cena"
" restituisce false

echo str !~ "cena"
" restituisce true
```

L'operatore `=~` esegue un confronto regex contro la stringa fornita. Nell'esempio sopra, `str =~ "colazione"` restituisce true perché `str` *contiene* il pattern "colazione". Puoi sempre usare `==` e `!=`, ma usarli confronterà l'espressione contro l'intera stringa. `=~` e `!~` sono scelte più flessibili.

```shell
echo str == "colazione"
" restituisce false

echo str == "colazione abbondante"
" restituisce true
```

Proviamo questo. Nota la "C" maiuscola:

```shell
echo str =~ "Colazione"
" true
```

Restituisce true anche se "Colazione" è maiuscola. Interessante... Si scopre che la mia impostazione di Vim è impostata per ignorare le maiuscole (`set ignorecase`), quindi quando Vim verifica l'uguaglianza, utilizza la mia impostazione di Vim e ignora il caso. Se disattivassi l'ignoranza del caso (`set noignorecase`), il confronto ora restituirebbe false.

```shell
set noignorecase
echo str =~ "Colazione"
" restituisce false perché il caso conta

set ignorecase
echo str =~ "Colazione"
" restituisce true perché il caso non conta
```

Se stai scrivendo un plugin per altri, questa è una situazione delicata. L'utente usa `ignorecase` o `noignorecase`? Non vuoi sicuramente costringere i tuoi utenti a cambiare la loro opzione di ignoranza del caso. Quindi, cosa fai?

Fortunatamente, Vim ha un operatore che può *sempre* ignorare o confrontare il caso. Per confrontare sempre il caso, aggiungi un `#` alla fine.

```shell
set ignorecase
echo str =~# "colazione"
" restituisce true

echo str =~# "ColAZione"
" restituisce false

set noignorecase
echo str =~# "colazione"
" true

echo str =~# "ColAZione"
" false

echo str !~# "ColAZione"
" true
```

Per ignorare sempre il caso quando si confronta, appendilo con `?`:

```shell
set ignorecase
echo str =~? "colazione"
" true

echo str =~? "ColAZione"
" true

set noignorecase
echo str =~? "colazione"
" true

echo str =~? "ColAZione"
" true

echo str !~? "ColAZione"
" false
```

Preferisco usare `#` per confrontare sempre il caso e stare sul sicuro.

## If

Ora che hai visto le espressioni di uguaglianza di Vim, tocchiamo un operatore condizionale fondamentale, l'istruzione `if`.

Al minimo, la sintassi è:

```shell
if {clausola}
  {alcuna espressione}
endif
```

Puoi estendere l'analisi dei casi con `elseif` e `else`.

```shell
if {predicato1}
  {espressione1}
elseif {predicato2}
  {espressione2}
elseif {predicato3}
  {espressione3}
else
  {espressione4}
endif
```

Ad esempio, il plugin [vim-signify](https://github.com/mhinz/vim-signify) utilizza un metodo di installazione diverso a seconda delle impostazioni di Vim. Di seguito sono riportate le istruzioni di installazione dal loro `readme`, utilizzando l'istruzione `if`:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Espressione Ternaria

Vim ha un'espressione ternaria per un'analisi dei casi in una sola riga:

```shell
{predicato} ? espressionevero : espressionefalso
```

Ad esempio:

```shell
echo 1 ? "Io sono vero" : "Io sono falso"
```

Poiché 1 è vero, Vim restituisce "Io sono vero". Supponiamo che tu voglia impostare condizionalmente il `background` su scuro se stai usando Vim dopo una certa ora. Aggiungi questo a vimrc:

```shell
let &background = strftime("%H") < 18 ? "chiaro" : "scuro"
```

`&background` è l'opzione `'background'` in Vim. `strftime("%H")` restituisce l'ora corrente in ore. Se non sono ancora le 18, usa uno sfondo chiaro. Altrimenti, usa uno sfondo scuro.

## or

L'operatore logico "or" (`||`) funziona come molti linguaggi di programmazione.

```shell
{Espressione Falsa}  || {Espressione Falsa}   false
{Espressione Falsa}  || {Espressione Vera}    true
{Espressione Vera}   || {Espressione Falsa}   true
{Espressione Vera}   || {Espressione Vera}    true
```

Vim valuta l'espressione e restituisce 1 (vero) o 0 (falso).

```shell
echo 5 || 0
" restituisce 1

echo 5 || 5
" restituisce 1

echo 0 || 0
" restituisce 0

echo "foo5" || "foo5"
" restituisce 0

echo "5foo" || "foo5"
" restituisce 1
```

Se l'espressione corrente viene valutata come vera, l'espressione successiva non verrà valutata.

```shell
let una_dozzina = 12

echo una_dozzina || due_dozzine
" restituisce 1

echo due_dozzine || una_dozzina
" restituisce errore
```

Nota che `due_dozzine` non è mai definito. L'espressione `una_dozzina || due_dozzine` non genera alcun errore perché `una_dozzina` viene valutata prima e risulta vera, quindi Vim non valuta `due_dozzine`.

## and

L'operatore logico "and" (`&&`) è il complemento dell'or logico.

```shell
{Espressione Falsa}  && {Espressione Falsa}   false
{Espressione Falsa}  && {Espressione Vera}    false
{Espressione Vera}   && {Espressione Falsa}   false
{Espressione Vera}   && {Espressione Vera}    true
```

Ad esempio:

```shell
echo 0 && 0
" restituisce 0

echo 0 && 10
" restituisce 0
```

`&&` valuta un'espressione fino a quando non vede la prima espressione falsa. Ad esempio, se hai `true && true`, valuterà entrambe e restituirà `true`. Se hai `true && false && true`, valuterà il primo `true` e si fermerà al primo `false`. Non valuterà il terzo `true`.

```shell
let una_dozzina = 12
echo una_dozzina && 10
" restituisce 1

echo una_dozzina && v:false
" restituisce 0

echo una_dozzina && due_dozzine
" restituisce errore

echo exists("una_dozzina") && una_dozzina == 12
" restituisce 1
```

## for

Il ciclo `for` è comunemente usato con il tipo di dato lista.

```shell
let colazioni = ["pancakes", "waffles", "uova"]

for colazione in colazioni
  echo colazione
endfor
```

Funziona con liste annidate:

```shell
let pasti = [["colazione", "pancakes"], ["pranzo", "pesce"], ["cena", "pasta"]]

for [tipo_pasto, cibo] in pasti
  echo "Sto mangiando " . cibo . " per " . tipo_pasto
endfor
```

Puoi tecnicamente usare il ciclo `for` con un dizionario utilizzando il metodo `keys()`.

```shell
let bevande = #{colazione: "latte", pranzo: "succo d'arancia", cena: "acqua"}
for tipo_bevanda in keys(bevande)
  echo "Sto bevendo " . bevande[tipo_bevanda] . " per " . tipo_bevanda
endfor
```

## While

Un altro ciclo comune è il ciclo `while`.

```shell
let contatore = 1
while contatore < 5
  echo "Il contatore è: " . contatore
  let contatore += 1
endwhile
```

Per ottenere il contenuto dalla riga corrente all'ultima riga:

```shell
let riga_corrente = line(".")
let ultima_riga = line("$")

while riga_corrente <= ultima_riga
  echo getline(riga_corrente)
  let riga_corrente += 1
endwhile
```

## Gestione degli Errori

Spesso il tuo programma non funziona come ti aspetti. Di conseguenza, ti manda in confusione (gioco di parole). Ciò di cui hai bisogno è una corretta gestione degli errori.

### Break

Quando usi `break` all'interno di un ciclo `while` o `for`, interrompe il ciclo.

Per ottenere i testi dall'inizio del file fino alla riga corrente, ma fermati quando vedi la parola "ciambella":

```shell
let riga = 0
let ultima_riga = line("$")
let totale_parole = ""

while riga <= ultima_riga
  let riga += 1
  let testo_riga = getline(riga)
  if testo_riga =~# "ciambella"
    break
  endif
  echo testo_riga
  let totale_parole .= testo_riga . " "
endwhile

echo totale_parole
```

Se hai il testo:

```shell
uno
due
tre
ciambella
quattro
cinque
```

Eseguendo il ciclo `while` sopra restituisce "uno due tre" e non il resto del testo perché il ciclo si interrompe non appena trova "ciambella".

### Continue

Il metodo `continue` è simile a `break`, dove viene invocato durante un ciclo. La differenza è che invece di interrompere il ciclo, salta semplicemente l'iterazione corrente.

Supponiamo di avere lo stesso testo ma invece di `break`, usi `continue`:

```shell
let riga = 0
let ultima_riga = line("$")
let totale_parole = ""

while riga <= ultima_riga
  let riga += 1
  let testo_riga = getline(riga)
  if testo_riga =~# "ciambella"
    continue
  endif
  echo testo_riga
  let totale_parole .= testo_riga . " "
endwhile

echo totale_parole
```

Questa volta restituisce `uno due tre quattro cinque`. Salta la riga con la parola "ciambella", ma il ciclo continua.
### try, finally e catch

Vim ha un `try`, `finally` e `catch` per gestire gli errori. Per simulare un errore, puoi usare il comando `throw`.

```shell
try
  echo "Prova"
  throw "Nope"
endtry
```

Esegui questo. Vim si lamenterà con l'errore `"Eccezione non catturata: Nope`.

Ora aggiungi un blocco catch:

```shell
try
  echo "Prova"
  throw "Nope"
catch
  echo "Catturato"
endtry
```

Ora non c'è più alcun errore. Dovresti vedere "Prova" e "Catturato" visualizzati.

Rimuoviamo il `catch` e aggiungiamo un `finally`:

```shell
try
  echo "Prova"
  throw "Nope"
  echo "Non mi vedrai"
finally
  echo "Finalmente"
endtry
```

Esegui questo. Ora Vim visualizza l'errore e "Finalmente".

Mettiamo tutto insieme:

```shell
try
  echo "Prova"
  throw "Nope"
catch
  echo "Catturato"
finally
  echo "Finalmente"
endtry
```

Questa volta Vim visualizza sia "Catturato" che "Finalmente". Non viene visualizzato alcun errore perché Vim lo ha catturato.

Gli errori provengono da posti diversi. Un'altra fonte di errore è chiamare una funzione inesistente, come `Nope()` qui sotto:

```shell
try
  echo "Prova"
  call Nope()
catch
  echo "Catturato"
finally
  echo "Finalmente"
endtry
```

La differenza tra `catch` e `finally` è che `finally` viene sempre eseguito, errore o meno, mentre un catch viene eseguito solo quando il tuo codice genera un errore.

Puoi catturare errori specifici con `:catch`. Secondo `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " cattura interruzioni (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " cattura tutti gli errori di Vim
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " cattura errori e interruzioni
catch /^Vim(write):/.                " cattura tutti gli errori in :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " cattura errore E123
catch /my-exception/.                " cattura eccezione utente
catch /.*/                           " cattura tutto
catch.                               " stesso di /.*/
```

All'interno di un blocco `try`, un'interruzione è considerata un errore catturabile.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

Nel tuo vimrc, se usi uno schema di colori personalizzato, come [gruvbox](https://github.com/morhetz/gruvbox), e accidentalmente elimini la directory dello schema di colori ma hai ancora la riga `colorscheme gruvbox` nel tuo vimrc, Vim genererà un errore quando lo `source`. Per risolvere questo, ho aggiunto questo nel mio vimrc:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Ora, se `source` il vimrc senza la directory `gruvbox`, Vim utilizzerà il `colorscheme default`.

## Impara le Condizionali in Modo Intelligente

Nel capitolo precedente, hai appreso i tipi di dati di base di Vim. In questo capitolo, hai imparato come combinarli per scrivere programmi di base utilizzando condizionali e cicli. Questi sono i mattoni della programmazione.

Successivamente, impariamo gli ambiti delle variabili.