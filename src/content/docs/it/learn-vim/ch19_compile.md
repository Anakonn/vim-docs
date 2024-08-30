---
description: Questo capitolo spiega come compilare file da Vim utilizzando il comando
  `:make` e l'operatore bang, semplificando il processo di compilazione.
title: Ch19. Compile
---

Compilare è un argomento importante per molti linguaggi. In questo capitolo, imparerai come compilare da Vim. Esplorerai anche modi per sfruttare il comando `:make` di Vim.

## Compilare dalla Riga di Comando

Puoi usare l'operatore bang (`!`) per compilare. Se hai bisogno di compilare il tuo file `.cpp` con `g++`, esegui:

```shell
:!g++ hello.cpp -o hello
```

Tuttavia, dover digitare manualmente il nome del file e il nome del file di output ogni volta è soggetto a errori e noioso. Un makefile è la soluzione migliore.

## Il Comando Make

Vim ha un comando `:make` per eseguire un makefile. Quando lo esegui, Vim cerca un makefile nella directory corrente da eseguire.

Crea un file chiamato `makefile` nella directory corrente e inserisci questi comandi:

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Esegui questo da Vim:

```shell
:make
```

Vim lo esegue allo stesso modo di quando lo stai eseguendo dal terminale. Il comando `:make` accetta parametri proprio come il comando make del terminale. Esegui:

```shell
:make foo
" Stampa "Hello foo"

:make list_pls
" Stampa il risultato del comando ls
```

Il comando `:make` utilizza il quickfix di Vim per memorizzare eventuali errori se esegui un comando errato. Proviamo a eseguire un target non esistente:

```shell
:make dontexist
```

Dovresti vedere un errore nell'esecuzione di quel comando. Per visualizzare quell'errore, esegui il comando quickfix `:copen` per visualizzare la finestra quickfix:

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Compilare con Make

Utilizziamo il makefile per compilare un programma `.cpp` di base. Prima, creiamo un file `hello.cpp`:

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Aggiorna il tuo makefile per costruire ed eseguire un file `.cpp`:

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Ora esegui:

```shell
:make build
```

Il `g++` compila `./hello.cpp` e crea `./hello`. Poi esegui:

```shell
:make run
```

Dovresti vedere `"Hello!"` stampato nel terminale.

## Programma Make Diverso

Quando esegui `:make`, Vim esegue effettivamente qualsiasi comando impostato sotto l'opzione `makeprg`. Se esegui `:set makeprg?`, vedrai:

```shell
makeprg=make
```

Il comando `:make` predefinito è il comando esterno `make`. Per cambiare il comando `:make` in modo che esegua `g++ {tuo-nome-file}` ogni volta che lo esegui, esegui:

```shell
:set makeprg=g++\ %
```

Il `\` serve per eseguire l'escape dello spazio dopo `g++`. Il simbolo `%` in Vim rappresenta il file corrente. Il comando `g++\\ %` è equivalente a eseguire `g++ hello.cpp`.

Vai a `./hello.cpp` e poi esegui `:make`. Vim compila `hello.cpp` e crea `a.out` perché non hai specificato l'output. Ristrutturiamolo in modo che nomini l'output compilato con il nome del file originale meno l'estensione. Esegui o aggiungi questo al vimrc:

```shell
set makeprg=g++\ %\ -o\ %<
```

La suddivisione:
- `g++\ %` è lo stesso di sopra. È equivalente a eseguire `g++ <tuo-file>`.
- `-o` è l'opzione di output.
- `%<` in Vim rappresenta il nome del file corrente senza un'estensione (`hello.cpp` diventa `hello`).

Quando esegui `:make` da dentro `./hello.cpp`, viene compilato in `./hello`. Per eseguire rapidamente `./hello` da dentro `./hello.cpp`, esegui `:!./%<`. Anche questo è lo stesso di eseguire `:!./{nome-file-corrente-senza-l'estensione}`.

Per ulteriori informazioni, controlla `:h :compiler` e `:h write-compiler-plugin`.

## Compilazione Automatica al Salvataggio

Puoi rendere la vita ancora più facile automatizzando la compilazione. Ricorda che puoi usare `autocmd` di Vim per attivare azioni automatiche basate su determinati eventi. Per compilare automaticamente i file `.cpp` ad ogni salvataggio, aggiungi questo al tuo vimrc:

```shell
autocmd BufWritePost *.cpp make
```

Ogni volta che salvi all'interno di un file `.cpp`, Vim esegue il comando `make`.

## Cambiare Compilatore

Vim ha un comando `:compiler` per cambiare rapidamente compilatori. La tua build di Vim probabilmente include diverse configurazioni di compilatori predefiniti. Per controllare quali compilatori hai, esegui:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Dovresti vedere un elenco di compilatori per diversi linguaggi di programmazione.

Per usare il comando `:compiler`, supponi di avere un file ruby, `hello.rb`, e all'interno ha:

```shell
puts "Hello ruby"
```

Ricorda che se esegui `:make`, Vim esegue qualsiasi comando assegnato a `makeprg` (il predefinito è `make`). Se esegui:

```shell
:compiler ruby
```

Vim esegue lo script `$VIMRUNTIME/compiler/ruby.vim` e cambia `makeprg` per usare il comando `ruby`. Ora se esegui `:set makeprg?`, dovrebbe dire `makeprg=ruby` (questo dipende da cosa c'è dentro il tuo file `$VIMRUNTIME/compiler/ruby.vim` o se hai altri compilatori ruby personalizzati. I tuoi potrebbero essere diversi). Il comando `:compiler {tuo-linguaggio}` ti consente di passare rapidamente a diversi compilatori. Questo è utile se il tuo progetto utilizza più linguaggi.

Non è necessario utilizzare `:compiler` e `makeprg` per compilare un programma. Puoi eseguire uno script di test, controllare un file, inviare un segnale o qualsiasi cosa tu voglia.

## Creare un Compilatore Personalizzato

Creiamo un semplice compilatore Typescript. Installa Typescript (`npm install -g typescript`) sulla tua macchina. Ora dovresti avere il comando `tsc`. Se non hai mai lavorato con typescript prima, `tsc` compila un file Typescript in un file Javascript. Supponi di avere un file, `hello.ts`:

```shell
const hello = "hello";
console.log(hello);
```

Se esegui `tsc hello.ts`, verrà compilato in `hello.js`. Tuttavia, se hai le seguenti espressioni all'interno di `hello.ts`:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Questo genererà un errore perché non puoi mutare una variabile `const`. Eseguire `tsc hello.ts` genererà un errore:

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

Per creare un semplice compilatore Typescript, nella tua directory `~/.vim/`, aggiungi una directory `compiler` (`~/.vim/compiler/`), poi crea un file `typescript.vim` (`~/.vim/compiler/typescript.vim`). Inserisci questo all'interno:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

La prima riga imposta `makeprg` per eseguire il comando `tsc`. La seconda riga imposta il formato degli errori per visualizzare il file (`%f`), seguito da un due punti letterale (`:`) e uno spazio eseguito in escape (`\ `), seguito dal messaggio di errore (`%m`). Per saperne di più sul formato degli errori, controlla `:h errorformat`.

Dovresti anche leggere alcuni dei compilatori predefiniti per vedere come fanno gli altri. Controlla `:e $VIMRUNTIME/compiler/<qualche-linguaggio>.vim`.

Poiché alcuni plugin potrebbero interferire con il file Typescript, apriamo `hello.ts` senza alcun plugin, usando il flag `--noplugin`:

```shell
vim --noplugin hello.ts
```

Controlla il `makeprg`:

```shell
:set makeprg?
```

Dovrebbe dire il programma `make` predefinito. Per utilizzare il nuovo compilatore Typescript, esegui:

```shell
:compiler typescript
```

Quando esegui `:set makeprg?`, dovrebbe dire `tsc` ora. Mettiamolo alla prova. Esegui:

```shell
:make %
```

Ricorda che `%` significa il file corrente. Guarda il tuo compilatore Typescript funzionare come previsto! Per vedere l'elenco degli errori, esegui `:copen`.

## Compilatore Async

A volte compilare può richiedere molto tempo. Non vuoi stare a fissare un Vim bloccato mentre aspetti che il tuo processo di compilazione finisca. Non sarebbe bello poter compilare in modo asincrono così puoi continuare a usare Vim durante la compilazione?

Fortunatamente ci sono plugin per eseguire processi asincroni. I due principali sono:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

Nel resto di questo capitolo, parlerò di vim-dispatch, ma ti incoraggio vivamente a provare tutti quelli disponibili.

*Vim e NeoVim supportano effettivamente lavori asincroni, ma sono al di fuori dell'ambito di questo capitolo. Se sei curioso, controlla `:h job-channel-overview.txt`.*

## Plugin: Vim-dispatch

Vim-dispatch ha diversi comandi, ma i due principali sono i comandi `:Make` e `:Dispatch`.

### Make Asincrono

Il comando `:Make` di vim-dispatch è simile a `:make` di Vim, ma viene eseguito in modo asincrono. Se sei in un progetto Javascript e hai bisogno di eseguire `npm t`, potresti tentare di impostare il tuo makeprg su:

```shell
:set makeprg=npm\\ t
```

Se esegui:

```shell
:make
```

Vim eseguirà `npm t`, ma starai fissando lo schermo bloccato mentre il tuo test JavaScript viene eseguito. Con vim-dispatch, puoi semplicemente eseguire:

```shell
:Make
```

Vim eseguirà `npm t` in modo asincrono. In questo modo, mentre `npm t` viene eseguito in un processo in background, puoi continuare a fare qualsiasi cosa tu stessi facendo. Fantastico!

### Dispatch Asincrono

Il comando `:Dispatch` è simile al comando `:compiler` e al comando `:!`. Può eseguire qualsiasi comando esterno in modo asincrono in Vim.

Supponi di essere all'interno di un file spec ruby e hai bisogno di eseguire un test. Esegui:

```shell
:Dispatch bundle exec rspec %
```

Vim eseguirà asincronicamente il comando `rspec` contro il file corrente (`%`).

### Automazione del Dispatch

Vim-dispatch ha la variabile di buffer `b:dispatch` che puoi configurare per valutare automaticamente un comando specifico. Puoi sfruttarla con `autocmd`. Se aggiungi questo al tuo vimrc:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Ora ogni volta che entri in un file (`BufEnter`) che termina con `_spec.rb`, eseguire `:Dispatch` eseguirà automaticamente `bundle exec rspec {tuo-file-spec-ruby-corrente}`.

## Impara a Compilare nel Modo Intelligente

In questo capitolo, hai appreso che puoi usare i comandi `make` e `compiler` per eseguire *qualsiasi* processo all'interno di Vim in modo asincrono per completare il tuo flusso di lavoro di programmazione. La capacità di Vim di estendersi con altri programmi lo rende potente.