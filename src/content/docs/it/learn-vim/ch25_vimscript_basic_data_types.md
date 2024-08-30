---
description: In questo capitolo, scoprirai i tipi di dati primitivi di Vimscript,
  il linguaggio di programmazione di Vim, e come utilizzare la modalità Ex per praticare.
title: Ch25. Vimscript Basic Data Types
---

Nei prossimi capitoli, imparerai a conoscere Vimscript, il linguaggio di programmazione integrato di Vim.

Quando si impara una nuova lingua, ci sono tre elementi di base da cercare:
- Primitivi
- Mezzi di Combinazione
- Mezzi di Astrazione

In questo capitolo, imparerai i tipi di dati primitivi di Vim.

## Tipi di Dati

Vim ha 10 tipi di dati diversi:
- Numero
- Float
- Stringa
- Lista
- Dizionario
- Speciale
- Funcref
- Job
- Channel
- Blob

Tratterò i primi sei tipi di dati qui. Nel capitolo 27, imparerai a conoscere Funcref. Per ulteriori informazioni sui tipi di dati di Vim, dai un'occhiata a `:h variables`.

## Seguire con la Modalità Ex

Vim tecnicamente non ha un REPL integrato, ma ha una modalità, la modalità Ex, che può essere utilizzata come tale. Puoi accedere alla modalità Ex con `Q` o `gQ`. La modalità Ex è come una modalità della riga di comando estesa (è come digitare comandi della modalità della riga di comando senza sosta). Per uscire dalla modalità Ex, digita `:visual`.

Puoi usare sia `:echo` che `:echom` in questo capitolo e nei successivi capitoli di Vimscript per programmare insieme. Sono come `console.log` in JS o `print` in Python. Il comando `:echo` stampa l'espressione valutata che fornisci. Il comando `:echom` fa lo stesso, ma in aggiunta, memorizza il risultato nella cronologia dei messaggi.

```viml
:echom "messaggio di echo hello"
```

Puoi visualizzare la cronologia dei messaggi con:

```shell
:messages
```

Per cancellare la tua cronologia dei messaggi, esegui:

```shell
:messages clear
```

## Numero

Vim ha 4 tipi di numeri diversi: decimale, esadecimale, binario e ottale. A proposito, quando dico tipo di dato numero, spesso questo significa un tipo di dato intero. In questa guida, userò i termini numero e intero in modo intercambiabile.

### Decimale

Dovresti essere familiare con il sistema decimale. Vim accetta decimali positivi e negativi. 1, -1, 10, ecc. Nella programmazione Vimscript, probabilmente utilizzerai il tipo decimale la maggior parte del tempo.

### Esadecimale

Gli esadecimali iniziano con `0x` o `0X`. Mnemonico: He**x**adecimale.

### Binario

I binari iniziano con `0b` o `0B`. Mnemonico: **B**inario.

### Ottale

Gli ottali iniziano con `0`, `0o` e `0O`. Mnemonico: **O**ttale.

### Stampa dei Numeri

Se `echo` un numero esadecimale, binario o ottale, Vim li converte automaticamente in decimali.

```viml
:echo 42
" restituisce 42

:echo 052
" restituisce 42

:echo 0b101010
" restituisce 42

:echo 0x2A
" restituisce 42
```

### Vero e Falso

In Vim, un valore 0 è falso e tutti i valori non 0 sono veri.

Il seguente non restituirà nulla.

```viml
:if 0
:  echo "Nope"
:endif
```

Tuttavia, questo lo farà:

```viml
:if 1
:  echo "Sì"
:endif
```

Qualsiasi valore diverso da 0 è vero, compresi i numeri negativi. 100 è vero. -1 è vero.

### Aritmetica dei Numeri

I numeri possono essere utilizzati per eseguire espressioni aritmetiche:

```viml
:echo 3 + 1
" restituisce 4

: echo 5 - 3
" restituisce 2

:echo 2 * 2
" restituisce 4

:echo 4 / 2
" restituisce 2
```

Quando si divide un numero con un resto, Vim scarta il resto.

```viml
:echo 5 / 2
" restituisce 2 invece di 2.5
```

Per ottenere un risultato più accurato, è necessario utilizzare un numero float.

## Float

I float sono numeri con decimali finali. Ci sono due modi per rappresentare i numeri floating: notazione a punto decimale (come 31.4) ed esponente (3.14e01). Simile ai numeri, puoi usare segni positivi e negativi:

```viml
:echo +123.4
" restituisce 123.4

:echo -1.234e2
" restituisce -123.4

:echo 0.25
" restituisce 0.25

:echo 2.5e-1
" restituisce 0.25
```

Devi dare a un float un punto e cifre finali. `25e-2` (senza punto) e `1234.` (ha un punto, ma nessuna cifra finale) sono entrambi numeri float non validi.

### Aritmetica dei Float

Quando si esegue un'espressione aritmetica tra un numero e un float, Vim costringe il risultato a un float.

```viml
:echo 5 / 2.0
" restituisce 2.5
```

Float e aritmetica float ti danno un altro float.

```shell
:echo 1.0 + 1.0
" restituisce 2.0
```

## Stringa

Le stringhe sono caratteri circondati da virgolette doppie (`""`) o virgolette singole (`''`). "Ciao", "123" e '123.4' sono esempi di stringhe.

### Concatenazione di Stringhe

Per concatenare una stringa in Vim, usa l'operatore `.`.

```viml
:echo "Ciao" . " mondo"
" restituisce "Ciao mondo"
```

### Aritmetica delle Stringhe

Quando esegui operatori aritmetici (`+ - * /`) con un numero e una stringa, Vim costringe la stringa in un numero.

```viml
:echo "12 donuts" + 3
" restituisce 15
```

Quando Vim vede "12 donuts", estrae il 12 dalla stringa e lo converte nel numero 12. Poi esegue l'addizione, restituendo 15. Perché questa coercizione da stringa a numero funzioni, il carattere numerico deve essere il *primo carattere* nella stringa.

Il seguente non funzionerà perché 12 non è il primo carattere nella stringa:

```viml
:echo "donuts 12" + 3
" restituisce 3
```

Questo non funzionerà nemmeno perché uno spazio vuoto è il primo carattere della stringa:

```viml
:echo " 12 donuts" + 3
" restituisce 3
```

Questa coercizione funziona anche con due stringhe:

```shell
:echo "12 donuts" + "6 pastries"
" restituisce 18
```

Questo funziona con qualsiasi operatore aritmetico, non solo `+`:

```viml
:echo "12 donuts" * "5 boxes"
" restituisce 60

:echo "12 donuts" - 5
" restituisce 7

:echo "12 donuts" / "3 people"
" restituisce 4
```

Un trucco utile per forzare una conversione da stringa a numero è semplicemente aggiungere 0 o moltiplicare per 1:

```viml
:echo "12" + 0
" restituisce 12

:echo "12" * 1
" restituisce 12
```

Quando l'aritmetica è eseguita contro un float in una stringa, Vim lo tratta come un intero, non come un float:

```shell
:echo "12.0 donuts" + 12
" restituisce 24, non 24.0
```

### Concatenazione di Numero e Stringa

Puoi costringere un numero in una stringa con un operatore punto (`.`):

```viml
:echo 12 . "donuts"
" restituisce "12donuts"
```

La coercizione funziona solo con il tipo di dato numero, non con il float. Questo non funzionerà:

```shell
:echo 12.0 . "donuts"
" non restituisce "12.0donuts" ma genera un errore
```

### Condizionali delle Stringhe

Ricorda che 0 è falso e tutti i numeri non 0 sono veri. Questo è vero anche quando si utilizzano stringhe come condizionali.

Nel seguente statement if, Vim costringe "12donuts" in 12, che è vero:

```viml
:if "12donuts"
:  echo "Yum"
:endif
" restituisce "Yum"
```

D'altra parte, questo è falso:

```viml
:if "donuts12"
:  echo "Nope"
:endif
" restituisce nulla
```

Vim costringe "donuts12" in 0, perché il primo carattere non è un numero.

### Virgolette Doppie vs Singole

Le virgolette doppie si comportano in modo diverso rispetto alle virgolette singole. Le virgolette singole visualizzano i caratteri letteralmente mentre le virgolette doppie accettano caratteri speciali.

Cosa sono i caratteri speciali? Dai un'occhiata alla visualizzazione della nuova riga e delle virgolette doppie:

```viml
:echo "hello\nworld"
" restituisce
" hello
" world

:echo "hello \"world\""
" restituisce "hello "world""
```

Confronta questo con le virgolette singole:

```shell
:echo 'hello\nworld'
" restituisce 'hello\nworld'

:echo 'hello \"world\"'
" restituisce 'hello \"world\"'
```

I caratteri speciali sono caratteri di stringa speciali che, quando scappati, si comportano in modo diverso. `\n` agisce come una nuova riga. `\"` si comporta come un `"`. Per un elenco di altri caratteri speciali, dai un'occhiata a `:h expr-quote`.

### Procedure delle Stringhe

Diamo un'occhiata ad alcune procedure di stringa integrate.

Puoi ottenere la lunghezza di una stringa con `strlen()`.

```shell
:echo strlen("choco")
" restituisce 5
```

Puoi convertire una stringa in un numero con `str2nr()`:

```shell
:echo str2nr("12donuts")
" restituisce 12

:echo str2nr("donuts12")
" restituisce 0
```

Simile alla coercizione da stringa a numero precedente, se il numero non è il primo carattere, Vim non lo catturerà.

La buona notizia è che Vim ha un metodo che trasforma una stringa in un float, `str2float()`:

```shell
:echo str2float("12.5donuts")
" restituisce 12.5
```

Puoi sostituire un modello in una stringa con il metodo `substitute()`:

```shell
:echo substitute("sweet", "e", "o", "g")
" restituisce "swoot"
```

L'ultimo parametro, "g", è il flag globale. Con esso, Vim sostituirà tutte le occorrenze corrispondenti. Senza di esso, Vim sostituirà solo la prima corrispondenza.

```shell
:echo substitute("sweet", "e", "o", "")
" restituisce "swoet"
```

Il comando substitute può essere combinato con `getline()`. Ricorda che la funzione `getline()` ottiene il testo sul numero di riga dato. Supponi di avere il testo "ciambella al cioccolato" sulla riga 5. Puoi usare la procedura:

```shell
:echo substitute(getline(5), "cioccolato", "glassa", "g")
" restituisce ciambella glassata
```

Ci sono molte altre procedure di stringa. Dai un'occhiata a `:h string-functions`.

## Lista

Una lista Vimscript è come un Array in Javascript o una Lista in Python. È una sequenza *ordinata* di elementi. Puoi mescolare e abbinare il contenuto con diversi tipi di dati:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Sottoliste

La lista di Vim è indicizzata da zero. Puoi accedere a un elemento particolare in una lista con `[n]`, dove n è l'indice.

```shell
:echo ["a", "sweet", "dessert"][0]
" restituisce "a"

:echo ["a", "sweet", "dessert"][2]
" restituisce "dessert"
```

Se superi il numero massimo dell'indice, Vim genererà un errore dicendo che l'indice è fuori intervallo:

```shell
:echo ["a", "sweet", "dessert"][999]
" restituisce un errore
```

Quando scendi sotto zero, Vim inizierà l'indice dall'ultimo elemento. Andare oltre il numero minimo dell'indice genererà anche un errore:

```shell
:echo ["a", "sweet", "dessert"][-1]
" restituisce "dessert"

:echo ["a", "sweet", "dessert"][-3]
" restituisce "a"

:echo ["a", "sweet", "dessert"][-999]
" restituisce un errore
```

Puoi "affettare" diversi elementi da una lista con `[n:m]`, dove `n` è l'indice di partenza e `m` è l'indice finale.

```shell
:echo ["cioccolato", "glassa", "naturale", "fragola", "limone", "zucchero", "crema"][2:4]
" restituisce ["naturale", "fragola", "limone"]
```

Se non passi `m` (`[n:]`), Vim restituirà il resto degli elementi a partire dal n-esimo elemento. Se non passi `n` (`[:m]`), Vim restituirà il primo elemento fino al m-esimo elemento.

```shell
:echo ["cioccolato", "glassa", "naturale", "fragola", "limone", "zucchero", "crema"][2:]
" restituisce ['naturale', 'fragola', 'limone', 'zucchero', 'crema']

:echo ["cioccolato", "glassa", "naturale", "fragola", "limone", "zucchero", "crema"][:4]
" restituisce ['cioccolato', 'glassa', 'naturale', 'fragola', 'limone']
```

Puoi passare un indice che supera il numero massimo degli elementi quando affetti un array.

```viml
:echo ["cioccolato", "glassa", "naturale", "fragola", "limone", "zucchero", "crema"][2:999]
" restituisce ['naturale', 'fragola', 'limone', 'zucchero', 'crema']
```
### Slicing String

Puoi affettare e mirare a stringhe proprio come le liste:

```viml
:echo "choco"[0]
" restituisce "c"

:echo "choco"[1:3]
" restituisce "hoc"

:echo "choco"[:3]
" restituisce choc

:echo "choco"[1:]
" restituisce hoco
```

### List Arithmetic

Puoi usare `+` per concatenare e mutare una lista:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" restituisce ["chocolate", "strawberry", "sugar"]
```

### List Functions

Esploriamo le funzioni di lista integrate di Vim.

Per ottenere la lunghezza di una lista, usa `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" restituisce 2
```

Per aggiungere un elemento all'inizio di una lista, puoi usare `insert()`:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" restituisce ["glazed", "chocolate", "strawberry"]
```

Puoi anche passare a `insert()` l'indice dove vuoi aggiungere l'elemento. Se vuoi aggiungere un elemento prima del secondo elemento (indice 1):

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" restituisce ['glazed', 'cream', 'chocolate', 'strawberry']
```

Per rimuovere un elemento dalla lista, usa `remove()`. Accetta una lista e l'indice dell'elemento che vuoi rimuovere.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" restituisce ['glazed', 'strawberry']
```

Puoi usare `map()` e `filter()` su una lista. Per filtrare gli elementi contenenti la frase "choco":

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" restituisce ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" restituisce ['chocolate donut', 'glazed donut', 'sugar donut']
```

La variabile `v:val` è una variabile speciale di Vim. È disponibile quando si itera su una lista o un dizionario usando `map()` o `filter()`. Rappresenta ciascun elemento iterato.

Per ulteriori informazioni, controlla `:h list-functions`.

### List Unpacking

Puoi decomprimere una lista e assegnare variabili agli elementi della lista:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" restituisce "chocolate"

:echo flavor2
" restituisce "glazed"
```

Per assegnare il resto degli elementi della lista, puoi usare `;` seguito da un nome di variabile:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" restituisce "apple"

:echo restFruits
" restituisce ['lemon', 'blueberry', 'raspberry']
```

### Modifying List

Puoi modificare direttamente un elemento della lista:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" restituisce ['sugar', 'glazed', 'plain']
```

Puoi mutare direttamente più elementi della lista:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" restituisce ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## Dictionary

Un dizionario Vimscript è una lista associativa e non ordinata. Un dizionario non vuoto consiste in almeno una coppia chiave-valore.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Un oggetto dati dizionario di Vim usa stringhe per le chiavi. Se provi a usare un numero, Vim lo convertirà in una stringa.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" restituisce {'1': '7am', '2': '9am', '11ses': '11am'}
```

Se sei troppo pigro per mettere le virgolette attorno a ogni chiave, puoi usare la notazione `#{}`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" restituisce {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

L'unico requisito per usare la sintassi `#{}` è che ogni chiave deve essere:

- Carattere ASCII.
- Cifra.
- Un trattino basso (`_`).
- Un trattino (`-`).

Proprio come le liste, puoi usare qualsiasi tipo di dato come valori.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### Accessing Dictionary

Per accedere a un valore da un dizionario, puoi chiamare la chiave con le parentesi quadre (`['key']`) o la notazione a punto (`.key`).

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" restituisce "gruel omelettes"

:echo lunch
" restituisce "gruel sandwiches"
```

### Modifying Dictionary

Puoi modificare o persino aggiungere contenuti a un dizionario:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" restituisce {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### Dictionary Functions

Esploriamo alcune delle funzioni integrate di Vim per gestire i dizionari.

Per controllare la lunghezza di un dizionario, usa `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" restituisce 3
```

Per vedere se un dizionario contiene una chiave specifica, usa `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" restituisce 1

:echo has_key(mealPlans, "dessert")
" restituisce 0
```

Per vedere se un dizionario ha qualche elemento, usa `empty()`. La procedura `empty()` funziona con tutti i tipi di dati: lista, dizionario, stringa, numero, float, ecc.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" restituisce 1

:echo empty(mealPlans)
" restituisce 0
```

Per rimuovere un'entrata da un dizionario, usa `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "rimuovendo breakfast: " . remove(mealPlans, "breakfast")
" restituisce "rimuovendo breakfast: 'waffles'""

:echo mealPlans
" restituisce {'lunch': 'pancakes', 'dinner': 'donuts'}
```

Per convertire un dizionario in una lista di liste, usa `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" restituisce [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` e `map()` sono anche disponibili.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" restituisce {'2': '9am', '11ses': '11am'}
```

Poiché un dizionario contiene coppie chiave-valore, Vim fornisce la variabile speciale `v:key` che funziona in modo simile a `v:val`. Quando si itera attraverso un dizionario, `v:key` conterrà il valore della chiave attualmente iterata.

Se hai un dizionario `mealPlans`, puoi mappare usando `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " and milk"')

:echo mealPlans
" restituisce {'lunch': 'lunch and milk', 'breakfast': 'breakfast and milk', 'dinner': 'dinner and milk'}
```

Allo stesso modo, puoi mappare usando `v:val`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " and milk"')

:echo mealPlans
" restituisce {'lunch': 'pancakes and milk', 'breakfast': 'waffles and milk', 'dinner': 'donuts and milk'}
```

Per vedere altre funzioni del dizionario, controlla `:h dict-functions`.

## Special Primitives

Vim ha primitivi speciali:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

A proposito, `v:` è la variabile incorporata di Vim. Saranno trattati più in dettaglio in un capitolo successivo.

Dalla mia esperienza, non utilizzerai spesso questi primitivi speciali. Se hai bisogno di un valore veritiero / non veritiero, puoi semplicemente usare 0 (non veritiero) e non-0 (veritiero). Se hai bisogno di una stringa vuota, usa semplicemente `""`. Ma è comunque utile saperlo, quindi diamo un'occhiata veloce a loro.

### True

Questo è equivalente a `true`. È equivalente a un numero con valore diverso da 0. Quando decodifichi json con `json_encode()`, è interpretato come "true".

```shell
:echo json_encode({"test": v:true})
" restituisce {"test": true}
```

### False

Questo è equivalente a `false`. È equivalente a un numero con valore di 0. Quando decodifichi json con `json_encode()`, è interpretato come "false".

```shell
:echo json_encode({"test": v:false})
" restituisce {"test": false}
```

### None

È equivalente a una stringa vuota. Quando decodifichi json con `json_encode()`, è interpretato come un elemento vuoto (`null`).

```shell
:echo json_encode({"test": v:none})
" restituisce {"test": null}
```

### Null

Simile a `v:none`.

```shell
:echo json_encode({"test": v:null})
" restituisce {"test": null}
```

## Learn Data Types the Smart Way

In questo capitolo, hai appreso i tipi di dati di base di Vimscript: numero, float, stringa, lista, dizionario e speciale. Imparare questi è il primo passo per iniziare a programmare in Vimscript.

Nel prossimo capitolo, imparerai come combinarli per scrivere espressioni come uguaglianze, condizioni e cicli.