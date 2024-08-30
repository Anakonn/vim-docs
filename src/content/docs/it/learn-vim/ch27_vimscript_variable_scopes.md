---
description: Scopri le variabili in Vim, incluse variabili mutabili e immutabili,
  e le loro fonti e ambiti per migliorare la tua comprensione di Vimscript.
title: Ch27. Vimscript Variable Scopes
---

Prima di immergerci nelle funzioni Vimscript, impariamo a conoscere le diverse fonti e ambiti delle variabili di Vim.

## Variabili Mutabili e Immobili

Puoi assegnare un valore a una variabile in Vim con `let`:

```shell
let pancake = "pancake"
```

In seguito puoi chiamare quella variabile in qualsiasi momento.

```shell
echo pancake
" restituisce "pancake"
```

`let` è mutabile, il che significa che puoi cambiare il valore in qualsiasi momento in futuro.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" restituisce "not waffles"
```

Nota che quando vuoi cambiare il valore di una variabile impostata, devi comunque usare `let`.

```shell
let beverage = "milk"

beverage = "orange juice"
" genera un errore
```

Puoi definire una variabile immutabile con `const`. Essendo immutabile, una volta assegnato un valore a una variabile, non puoi riassegnarlo con un valore diverso.

```shell
const waffle = "waffle"
const waffle = "pancake"
" genera un errore
```

## Fonti delle Variabili

Ci sono tre fonti per le variabili: variabile di ambiente, variabile di opzione e variabile di registro.

### Variabile di Ambiente

Vim può accedere alla tua variabile di ambiente del terminale. Ad esempio, se hai la variabile di ambiente `SHELL` disponibile nel tuo terminale, puoi accedervi da Vim con:

```shell
echo $SHELL
" restituisce il valore di $SHELL. Nel mio caso, restituisce /bin/bash
```

### Variabile di Opzione

Puoi accedere alle opzioni di Vim con `&` (queste sono le impostazioni che accedi con `set`).

Ad esempio, per vedere quale sfondo usa Vim, puoi eseguire:

```shell
echo &background
" restituisce "light" o "dark"
```

In alternativa, puoi sempre eseguire `set background?` per vedere il valore dell'opzione `background`.

### Variabile di Registro

Puoi accedere ai registri di Vim (Cap. 08) con `@`.

Supponiamo che il valore "chocolate" sia già salvato nel registro a. Per accedervi, puoi usare `@a`. Puoi anche aggiornarlo con `let`.

```shell
echo @a
" restituisce chocolate

let @a .= " donut"

echo @a
" restituisce "chocolate donut"
```

Ora, quando incolli dal registro `a` (`"ap`), restituirà "chocolate donut". L'operatore `.=` concatena due stringhe. L'espressione `let @a .= " donut"` è la stessa di `let @a = @a . " donut"`

## Ambiti delle Variabili

Ci sono 9 diversi ambiti delle variabili in Vim. Puoi riconoscerli dalla lettera che li precede:

```shell
g:           Variabile globale
{nothing}    Variabile globale
b:           Variabile locale del buffer
w:           Variabile locale della finestra
t:           Variabile locale della scheda
s:           Variabile Vimscript sorgente
l:           Variabile locale della funzione
a:           Variabile parametro formale della funzione
v:           Variabile Vim incorporata
```

### Variabile Globale

Quando dichiari una variabile "normale":

```shell
let pancake = "pancake"
```

`pancake` è in realtà una variabile globale. Quando definisci una variabile globale, puoi chiamarla da qualsiasi parte.

Aggiungere `g:` a una variabile crea anche una variabile globale.

```shell
let g:waffle = "waffle"
```

In questo caso, sia `pancake` che `g:waffle` hanno lo stesso ambito. Puoi chiamarli entrambi con o senza `g:`.

```shell
echo pancake
" restituisce "pancake"

echo g:pancake
" restituisce "pancake"

echo waffle
" restituisce "waffle"

echo g:waffle
" restituisce "waffle"
```

### Variabile del Buffer

Una variabile preceduta da `b:` è una variabile del buffer. Una variabile del buffer è una variabile che è locale al buffer corrente (Cap. 02). Se hai più buffer aperti, ogni buffer avrà la propria lista separata di variabili del buffer.

Nel buffer 1:

```shell
const b:donut = "chocolate donut"
```

Nel buffer 2:

```shell
const b:donut = "blueberry donut"
```

Se esegui `echo b:donut` dal buffer 1, restituirà "chocolate donut". Se lo esegui dal buffer 2, restituirà "blueberry donut".

A proposito, Vim ha una variabile di buffer *speciale* `b:changedtick` che tiene traccia di tutte le modifiche apportate al buffer corrente.

1. Esegui `echo b:changedtick` e annota il numero che restituisce.
2. Apporta modifiche in Vim.
3. Esegui di nuovo `echo b:changedtick` e annota il numero che restituisce ora.

### Variabile della Finestra

Una variabile preceduta da `w:` è una variabile della finestra. Esiste solo in quella finestra.

Nella finestra 1:

```shell
const w:donut = "chocolate donut"
```

Nella finestra 2:

```shell
const w:donut = "raspberry donut"
```

In ogni finestra, puoi chiamare `echo w:donut` per ottenere valori unici.

### Variabile della Scheda

Una variabile preceduta da `t:` è una variabile della scheda. Esiste solo in quella scheda.

Nella scheda 1:

```shell
const t:donut = "chocolate donut"
```

Nella scheda 2:

```shell
const t:donut = "blackberry donut"
```

In ogni scheda, puoi chiamare `echo t:donut` per ottenere valori unici.

### Variabile di Script

Una variabile preceduta da `s:` è una variabile di script. Queste variabili possono essere accessibili solo dall'interno di quel script.

Se hai un file arbitrario `dozen.vim` e all'interno hai:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " rimasti"
endfunction
```

Sorgente il file con `:source dozen.vim`. Ora chiama la funzione `Consume`:

```shell
:call Consume()
" restituisce "11 rimasti"

:call Consume()
" restituisce "10 rimasti"

:echo s:dozen
" Errore di variabile non definita
```

Quando chiami `Consume`, vedi che decrementa il valore di `s:dozen` come previsto. Quando provi a ottenere direttamente il valore di `s:dozen`, Vim non lo troverà perché sei fuori ambito. `s:dozen` è accessibile solo dall'interno di `dozen.vim`.

Ogni volta che sorgenti il file `dozen.vim`, ripristina il contatore `s:dozen`. Se sei nel mezzo di un decremento del valore di `s:dozen` e esegui `:source dozen.vim`, il contatore torna a 12. Questo può essere un problema per gli utenti ignari. Per risolvere questo problema, ristruttura il codice:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Ora, quando sorgenti `dozen.vim` mentre sei nel mezzo di un decremento, Vim legge `!exists("s:dozen")`, trova che è vero e non ripristina il valore a 12.

### Variabile Locale della Funzione e Variabile Parametro Formale della Funzione

Sia la variabile locale della funzione (`l:`) che la variabile formale della funzione (`a:`) saranno trattate nel prossimo capitolo.

### Variabili Incorporate di Vim

Una variabile preceduta da `v:` è una variabile incorporata speciale di Vim. Non puoi definire queste variabili. Hai già visto alcune di esse.
- `v:version` ti dice quale versione di Vim stai usando.
- `v:key` contiene il valore dell'elemento corrente durante l'iterazione attraverso un dizionario.
- `v:val` contiene il valore dell'elemento corrente durante l'esecuzione di un'operazione `map()` o `filter()`.
- `v:true`, `v:false`, `v:null` e `v:none` sono tipi di dati speciali.

Ci sono altre variabili. Per un elenco delle variabili incorporate di Vim, controlla `:h vim-variable` o `:h v:`.

## Utilizzare gli Ambiti delle Variabili di Vim in Modo Intelligente

Essere in grado di accedere rapidamente a variabili di ambiente, opzione e registro ti offre una grande flessibilità per personalizzare il tuo editor e l'ambiente del terminale. Hai anche appreso che Vim ha 9 diversi ambiti delle variabili, ognuno esistente sotto certe restrizioni. Puoi sfruttare questi tipi di variabili uniche per disaccoppiare il tuo programma.

Sei arrivato fin qui. Hai imparato sui tipi di dati, sui mezzi di combinazione e sugli ambiti delle variabili. Rimane solo una cosa: le funzioni.