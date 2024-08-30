---
description: Questo documento esplora le funzioni in Vimscript, illustrando la sintassi,
  le regole e l'importanza dell'astrazione nell'apprendimento di un nuovo linguaggio.
title: Ch28. Vimscript Functions
---

Le funzioni sono mezzi di astrazione, il terzo elemento nell'apprendimento di un nuovo linguaggio.

Nei capitoli precedenti, hai visto le funzioni native di Vimscript (`len()`, `filter()`, `map()`, ecc.) e le funzioni personalizzate in azione. In questo capitolo, approfondirai come funzionano le funzioni.

## Regole di Sintassi delle Funzioni

Alla base, una funzione di Vimscript ha la seguente sintassi:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Una definizione di funzione deve iniziare con una lettera maiuscola. Inizia con la parola chiave `function` e termina con `endfunction`. Di seguito è riportata una funzione valida:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

La seguente non è una funzione valida perché non inizia con una lettera maiuscola.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Se precedi una funzione con la variabile di script (`s:`), puoi usarla in minuscolo. `function s:tasty()` è un nome valido. Il motivo per cui Vim richiede di usare un nome con la lettera maiuscola è per evitare confusione con le funzioni integrate di Vim (tutte in minuscolo).

Un nome di funzione non può iniziare con un numero. `1Tasty()` non è un nome di funzione valido, ma `Tasty1()` lo è. Una funzione non può contenere caratteri non alfanumerici oltre a `_`. `Tasty-food()`, `Tasty&food()` e `Tasty.food()` non sono nomi di funzione validi. `Tasty_food()` *lo è*.

Se definisci due funzioni con lo stesso nome, Vim genererà un errore lamentandosi che la funzione `Tasty` esiste già. Per sovrascrivere la funzione precedente con lo stesso nome, aggiungi un `!` dopo la parola chiave `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Elencare le Funzioni Disponibili

Per vedere tutte le funzioni integrate e personalizzate in Vim, puoi eseguire il comando `:function`. Per guardare il contenuto della funzione `Tasty`, puoi eseguire `:function Tasty`.

Puoi anche cercare funzioni con un modello usando `:function /pattern`, simile alla navigazione di ricerca di Vim (`/pattern`). Per cercare tutte le funzioni che contengono la frase "map", esegui `:function /map`. Se utilizzi plugin esterni, Vim mostrerà le funzioni definite in quei plugin.

Se vuoi vedere da dove proviene una funzione, puoi usare il comando `:verbose` con il comando `:function`. Per vedere da dove provengono tutte le funzioni che contengono la parola "map", esegui:

```shell
:verbose function /map
```

Quando l'ho eseguito, ho ottenuto un certo numero di risultati. Questo mi dice che la funzione `fzf#vim#maps` è una funzione di autoload (per ricapitolare, fare riferimento al Capitolo 23) ed è scritta nel file `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, alla riga 1263. Questo è utile per il debug.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Rimuovere una Funzione

Per rimuovere una funzione esistente, usa `:delfunction {Function_name}`. Per eliminare `Tasty`, esegui `:delfunction Tasty`.

## Valore di Ritorno della Funzione

Affinché una funzione restituisca un valore, devi passarle un valore di `return` esplicito. Altrimenti, Vim restituisce automaticamente un valore implicito di 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Un `return` vuoto è anche equivalente a un valore 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Se esegui `:echo Tasty()` usando la funzione sopra, dopo che Vim visualizza "Tasty", restituisce 0, il valore di ritorno implicito. Per far sì che `Tasty()` restituisca il valore "Tasty", puoi fare così:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Ora quando esegui `:echo Tasty()`, restituisce la stringa "Tasty".

Puoi usare una funzione all'interno di un'espressione. Vim utilizzerà il valore di ritorno di quella funzione. L'espressione `:echo Tasty() . " Food!"` restituisce "Tasty Food!"

## Argomenti Formali

Per passare un argomento formale `food` alla tua funzione `Tasty`, puoi fare così:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" restituisce "Tasty pastry"
```

`a:` è uno degli ambiti delle variabili menzionati nel capitolo precedente. È la variabile del parametro formale. È il modo di Vim per ottenere un valore del parametro formale in una funzione. Senza di essa, Vim genererà un errore:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" restituisce "nome variabile non definito" errore
```

## Variabile Locale della Funzione

Affrontiamo l'altra variabile che non hai imparato nel capitolo precedente: la variabile locale della funzione (`l:`).

Quando scrivi una funzione, puoi definire una variabile all'interno:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" restituisce "Yummy in my tummy"
```

In questo contesto, la variabile `location` è la stessa di `l:location`. Quando definisci una variabile in una funzione, quella variabile è *locale* a quella funzione. Quando un utente vede `location`, potrebbe facilmente essere scambiata per una variabile globale. Preferisco essere più esplicito che no, quindi preferisco mettere `l:` per indicare che si tratta di una variabile di funzione.

Un altro motivo per usare `l:count` è che Vim ha variabili speciali con alias che sembrano variabili normali. `v:count` è un esempio. Ha un alias di `count`. In Vim, chiamare `count` è lo stesso che chiamare `v:count`. È facile chiamare accidentalmente una di quelle variabili speciali.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" genera un errore
```

L'esecuzione sopra genera un errore perché `let count = "Count"` tenta implicitamente di ridefinire la variabile speciale di Vim `v:count`. Ricorda che le variabili speciali (`v:`) sono di sola lettura. Non puoi modificarle. Per risolvere, usa `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" restituisce "I do not count my calories"
```

## Chiamare una Funzione

Vim ha un comando `:call` per chiamare una funzione.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

Il comando `call` non restituisce il valore di ritorno. Chiamiamolo con `echo`.

```shell
echo call Tasty("gravy")
```

Oops, ricevi un errore. Il comando `call` sopra è un comando della riga di comando (`:call`). Il comando `echo` sopra è anche un comando della riga di comando (`:echo`). Non puoi chiamare un comando della riga di comando con un altro comando della riga di comando. Proviamo un'altra variante del comando `call`:

```shell
echo call("Tasty", ["gravy"])
" restituisce "Tasty gravy"
```

Per chiarire qualsiasi confusione, hai appena usato due diversi comandi `call`: il comando della riga di comando `:call` e la funzione `call()`. La funzione `call()` accetta come primo argomento il nome della funzione (stringa) e come secondo argomento i parametri formali (lista).

Per saperne di più su `:call` e `call()`, controlla `:h call()` e `:h :call`.

## Argomento Predefinito

Puoi fornire un parametro di funzione con un valore predefinito con `=`. Se chiami `Breakfast` con solo un argomento, il parametro `beverage` utilizzerà il valore predefinito "milk".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" restituisce "I had hash browns and milk for breakfast"

echo Breakfast("Cereal", "Orange Juice")
" restituisce "I had Cereal and Orange Juice for breakfast"
```

## Argomenti Variabili

Puoi passare un argomento variabile con tre puntini (`...`). L'argomento variabile è utile quando non sai quanti variabili un utente fornirà.

Supponiamo che tu stia creando un buffet all-you-can-eat (non saprai mai quanto cibo mangerà il tuo cliente):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Se esegui `echo Buffet("Noodles")`, restituirà "Noodles". Vim usa `a:1` per stampare il *primo* argomento passato a `...`, fino a 20 (`a:1` è il primo argomento, `a:2` è il secondo argomento, ecc.). Se esegui `echo Buffet("Noodles", "Sushi")`, visualizzerà comunque solo "Noodles", aggiorniamolo:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" restituisce "Noodles Sushi"
```

Il problema con questo approccio è che se ora esegui `echo Buffet("Noodles")` (con solo una variabile), Vim si lamenta che ha una variabile non definita `a:2`. Come puoi renderlo abbastanza flessibile da visualizzare esattamente ciò che l'utente fornisce?

Fortunatamente, Vim ha una variabile speciale `a:0` per visualizzare il *numero* degli argomenti passati a `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" restituisce 1

echo Buffet("Noodles", "Sushi")
" restituisce 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" restituisce 5
```

Con questo, puoi iterare usando la lunghezza dell'argomento.

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

Le parentesi graffe `a:{l:food_counter}` sono un'interpolazione di stringa, usano il valore del contatore `food_counter` per chiamare gli argomenti del parametro formale `a:1`, `a:2`, `a:3`, ecc.

```shell
echo Buffet("Noodles")
" restituisce "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" restituisce tutto ciò che hai passato: "Noodles Sushi Ice cream Tofu Mochi"
```

L'argomento variabile ha un'altra variabile speciale: `a:000`. Ha il valore di tutti gli argomenti variabili in formato lista.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" restituisce ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" restituisce ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

Rifattoriamo la funzione per utilizzare un ciclo `for`:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" restituisce Noodles Sushi Ice cream Tofu Mochi
```
## Intervallo

Puoi definire una funzione Vimscript *ranged* aggiungendo una parola chiave `range` alla fine della definizione della funzione. Una funzione ranged ha due variabili speciali disponibili: `a:firstline` e `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Se sei sulla riga 100 e esegui `call Breakfast()`, verrà visualizzato 100 sia per `firstline` che per `lastline`. Se evidenzi visivamente (`v`, `V` o `Ctrl-V`) le righe da 101 a 105 e esegui `call Breakfast()`, `firstline` visualizza 101 e `lastline` visualizza 105. `firstline` e `lastline` mostrano l'intervallo minimo e massimo in cui viene chiamata la funzione.

Puoi anche usare `:call` passando un intervallo. Se esegui `:11,20call Breakfast()`, verrà visualizzato 11 per `firstline` e 20 per `lastline`.

Potresti chiederti: "È bello che la funzione Vimscript accetti un intervallo, ma non posso ottenere il numero di riga con `line(".")`? Non farà la stessa cosa?"

Buona domanda. Se intendi questo:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Chiamando `:11,20call Breakfast()` esegue la funzione `Breakfast` 10 volte (una per ogni riga nell'intervallo). Confronta questo se avessi passato l'argomento `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Chiamando `11,20call Breakfast()` esegue la funzione `Breakfast` *una volta*.

Se passi una parola chiave `range` e passi un intervallo numerico (come `11,20`) su `call`, Vim esegue solo quella funzione una volta. Se non passi una parola chiave `range` e passi un intervallo numerico (come `11,20`) su `call`, Vim esegue quella funzione N volte a seconda dell'intervallo (in questo caso, N = 10).

## Dizionario

Puoi aggiungere una funzione come elemento di un dizionario aggiungendo una parola chiave `dict` quando definisci una funzione.

Se hai una funzione `SecondBreakfast` che restituisce qualsiasi elemento `breakfast` tu abbia:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Aggiungiamo questa funzione al dizionario `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" restituisce "pancakes"
```

Con la parola chiave `dict`, la variabile chiave `self` si riferisce al dizionario in cui è memorizzata la funzione (in questo caso, il dizionario `meals`). L'espressione `self.breakfast` è uguale a `meals.breakfast`.

Un modo alternativo per aggiungere una funzione a un oggetto dizionario è utilizzare uno spazio dei nomi.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" restituisce "pasta"
```

Con lo spazio dei nomi, non è necessario utilizzare la parola chiave `dict`.

## Funcref

Un funcref è un riferimento a una funzione. È uno dei tipi di dati di base di Vimscript menzionati nel Capitolo 24.

L'espressione `function("SecondBreakfast")` sopra è un esempio di funcref. Vim ha una funzione incorporata `function()` che restituisce un funcref quando le passi un nome di funzione (stringa).

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" restituisce errore

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" restituisce "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" restituisce "I am having pancake for breakfast"
```

In Vim, se vuoi assegnare una funzione a una variabile, non puoi semplicemente eseguirla direttamente come `let MyVar = MyFunc`. Devi usare la funzione `function()`, come `let MyVar = function("MyFunc")`.

Puoi usare funcref con mappe e filtri. Nota che le mappe e i filtri passeranno un indice come primo argomento e il valore iterato come secondo argomento.

```shell
function! Breakfast(index, item)
  return "I am having " . a:item . " for breakfast"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Un modo migliore per utilizzare le funzioni in mappe e filtri è utilizzare l'espressione lambda (a volte nota come funzione senza nome). Ad esempio:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" restituisce 3

let Tasty = { -> 'tasty'}
echo Tasty()
" restituisce "tasty"
```

Puoi chiamare una funzione dall'interno di un'espressione lambda:

```shell
function! Lunch(item)
  return "I am having " . a:item . " for lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Se non vuoi chiamare la funzione dall'interno della lambda, puoi rifattorizzarla:

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## Chaining di Metodi

Puoi concatenare diverse funzioni Vimscript e espressioni lambda in sequenza con `->`. Tieni presente che `->` deve essere seguito da un nome di metodo *senza spazi.*

```shell
Source->Method1()->Method2()->...->MethodN()
```

Per convertire un float in un numero utilizzando il chaining di metodi:

```shell
echo 3.14->float2nr()
" restituisce 3
```

Facciamo un esempio più complicato. Supponi di dover capitalizzare la prima lettera di ciascun elemento in un elenco, quindi ordinare l'elenco, quindi unire l'elenco per formare una stringa.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" restituisce "Antipasto, Bruschetta, Calzone"
```

Con il chaining di metodi, la sequenza è più facilmente leggibile e comprensibile. Posso semplicemente dare un'occhiata a `dinner_items->CapitalizeList()->sort()->join(", ")` e sapere esattamente cosa sta succedendo.

## Chiusura

Quando definisci una variabile all'interno di una funzione, quella variabile esiste all'interno dei confini di quella funzione. Questo è chiamato ambito lessicale.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` è definito all'interno della funzione `Lunch`, che restituisce il funcref `SecondLunch`. Nota che `SecondLunch` utilizza `appetizer`, ma in Vimscript non ha accesso a quella variabile. Se provi a eseguire `echo Lunch()()`, Vim genererà un errore di variabile non definita.

Per risolvere questo problema, usa la parola chiave `closure`. Rifattorizziamo:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Ora se esegui `echo Lunch()()`, Vim restituirà "shrimp".

## Impara le Funzioni Vimscript nel Modo Intelligente

In questo capitolo, hai appreso l'anatomia della funzione Vim. Hai imparato come utilizzare diverse parole chiave speciali `range`, `dict` e `closure` per modificare il comportamento della funzione. Hai anche imparato come utilizzare le lambda e concatenare più funzioni insieme. Le funzioni sono strumenti importanti per creare astrazioni complesse.

Ora, mettiamo insieme tutto ciò che hai imparato per creare il tuo plugin.