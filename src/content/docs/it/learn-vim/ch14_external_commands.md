---
description: Scopri come estendere Vim per lavorare con comandi esterni, utilizzando
  il comando bang per leggere, scrivere ed eseguire comandi Unix.
title: Ch14. External Commands
---

Dentro il sistema Unix, troverai molti piccoli comandi iper-specializzati che fanno una cosa (e la fanno bene). Puoi concatenare questi comandi per lavorare insieme e risolvere un problema complesso. Non sarebbe fantastico poter usare questi comandi dall'interno di Vim?

Assolutamente. In questo capitolo, imparerai come estendere Vim per lavorare senza problemi con comandi esterni.

## Il Comando Bang

Vim ha un comando bang (`!`) che può fare tre cose:

1. Leggere l'STDOUT di un comando esterno nel buffer corrente.
2. Scrivere il contenuto del tuo buffer come STDIN per un comando esterno.
3. Eseguire un comando esterno dall'interno di Vim.

Esaminiamo ciascuna di esse.

## Leggere l'STDOUT di un Comando in Vim

La sintassi per leggere l'STDOUT di un comando esterno nel buffer corrente è:

```shell
:r !cmd
```

`:r` è il comando di lettura di Vim. Se lo usi senza `!`, puoi usarlo per ottenere il contenuto di un file. Se hai un file `file1.txt` nella directory corrente e esegui:

```shell
:r file1.txt
```

Vim metterà il contenuto di `file1.txt` nel buffer corrente.

Se esegui il comando `:r` seguito da un `!` e un comando esterno, l'output di quel comando sarà inserito nel buffer corrente. Per ottenere il risultato del comando `ls`, esegui:

```shell
:r !ls
```

Restituisce qualcosa del tipo:

```shell
file1.txt
file2.txt
file3.txt
```

Puoi leggere i dati dal comando `curl`:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

Il comando `r` accetta anche un indirizzo:

```shell
:10r !cat file1.txt
```

Ora l'STDOUT dall'esecuzione di `cat file1.txt` sarà inserito dopo la linea 10.

## Scrivere il Contenuto del Buffer in un Comando Esterno

Il comando `:w`, oltre a salvare un file, può essere utilizzato per passare il testo nel buffer corrente come STDIN per un comando esterno. La sintassi è:

```shell
:w !cmd
```

Se hai queste espressioni:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Assicurati di avere [node](https://nodejs.org/en/) installato sulla tua macchina, poi esegui:

```shell
:w !node
```

Vim utilizzerà `node` per eseguire le espressioni JavaScript per stampare "Hello Vim" e "Vim is awesome".

Quando usi il comando `:w`, Vim utilizza tutto il testo nel buffer corrente, simile al comando globale (la maggior parte dei comandi da riga di comando, se non gli passi un intervallo, esegue solo il comando sulla linea corrente). Se passi a `:w` un indirizzo specifico:

```shell
:2w !node
```

Vim utilizza solo il testo dalla seconda linea nell'interprete `node`.

C'è una sottile ma significativa differenza tra `:w !node` e `:w! node`. Con `:w !node`, stai "scrivendo" il testo nel buffer corrente nel comando esterno `node`. Con `:w! node`, stai forzando il salvataggio di un file e nominando il file "node".

## Eseguire un Comando Esterno

Puoi eseguire un comando esterno dall'interno di Vim con il comando bang. La sintassi è:

```shell
:!cmd
```

Per vedere il contenuto della directory corrente in formato lungo, esegui:

```shell
:!ls -ls
```

Per terminare un processo che sta girando con PID 3456, puoi eseguire:

```shell
:!kill -9 3456
```

Puoi eseguire qualsiasi comando esterno senza lasciare Vim, così puoi rimanere concentrato sul tuo compito.

## Filtrare Testi

Se dai a `!` un intervallo, può essere utilizzato per filtrare testi. Supponiamo di avere i seguenti testi:

```shell
hello vim
hello vim
```

Facciamo maiuscole alla linea corrente usando il comando `tr` (translate). Esegui:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Il risultato:

```shell
HELLO VIM
hello vim
```

La spiegazione:
- `.!` esegue il comando di filtro sulla linea corrente.
- `tr '[:lower:]' '[:upper:]'` chiama il comando `tr` per sostituire tutti i caratteri minuscoli con quelli maiuscoli.

È imperativo passare un intervallo per eseguire il comando esterno come filtro. Se provi a eseguire il comando sopra senza il `.` (`:!tr '[:lower:]' '[:upper:]'`), vedrai un errore.

Supponiamo che tu debba rimuovere la seconda colonna su entrambe le righe con il comando `awk`:

```shell
:%!awk "{print $1}"
```

Il risultato:

```shell
hello
hello
```

La spiegazione:
- `:%!` esegue il comando di filtro su tutte le righe (`%`).
- `awk "{print $1}"` stampa solo la prima colonna della corrispondenza.

Puoi concatenare più comandi con l'operatore di concatenazione (`|`) proprio come nel terminale. Supponiamo di avere un file con questi deliziosi elementi per la colazione:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Se hai bisogno di ordinarli in base al prezzo e visualizzare solo il menu con uno spazio uniforme, puoi eseguire:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Il risultato:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

La spiegazione:
- `:%!` applica il filtro a tutte le righe (`%`).
- `awk 'NR > 1'` visualizza i testi solo dalla riga numero due in poi.
- `|` concatena il comando successivo.
- `sort -nk 3` ordina numericamente (`n`) utilizzando i valori dalla colonna 3 (`k 3`).
- `column -t` organizza il testo con uno spazio uniforme.

## Comando in Modalità Normale

Vim ha un operatore di filtro (`!`) nella modalità normale. Se hai i seguenti saluti:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Per maiuscolare la linea corrente e la linea sottostante, puoi eseguire:
```shell
!jtr '[a-z]' '[A-Z]'
```

La spiegazione:
- `!j` esegue l'operatore di filtro del comando normale (`!`) mirato alla linea corrente e alla linea sottostante. Ricorda che poiché è un operatore di modalità normale, la regola grammaticale `verbo + sostantivo` si applica. `!` è il verbo e `j` è il sostantivo.
- `tr '[a-z]' '[A-Z]'` sostituisce le lettere minuscole con le lettere maiuscole.

Il comando di filtro normale funziona solo su movimenti / oggetti di testo che sono almeno una riga o più lunghi. Se avessi provato a eseguire `!iwtr '[a-z]' '[A-Z]'` (eseguire `tr` su una parola interna), scoprirai che applica il comando `tr` all'intera linea, non alla parola su cui si trova il cursore.

## Impara i Comandi Esterni nel Modo Intelligente

Vim non è un IDE. È un editor modulare leggero che è altamente estensibile per design. Grazie a questa estensibilità, hai un facile accesso a qualsiasi comando esterno nel tuo sistema. Armato di questi comandi esterni, Vim è un passo più vicino a diventare un IDE. Qualcuno ha detto che il sistema Unix è il primo IDE mai esistito.

Il comando bang è utile quanto più conosci comandi esterni. Non preoccuparti se la tua conoscenza dei comandi esterni è limitata. Ho ancora molto da imparare anche io. Prendi questo come una motivazione per un apprendimento continuo. Ogni volta che hai bisogno di modificare un testo, guarda se c'è un comando esterno che può risolvere il tuo problema. Non preoccuparti di padroneggiare tutto, impara solo quelli di cui hai bisogno per completare il compito attuale.