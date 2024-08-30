---
description: In questo capitolo, imparerai diversi modi per avviare Vim dal terminale,
  con informazioni utili per l'installazione e l'uso di Vim 8.2.
title: Ch01. Starting Vim
---

In questo capitolo, imparerai diversi modi per avviare Vim dal terminale. Stavo usando Vim 8.2 quando ho scritto questa guida. Se utilizzi Neovim o una versione precedente di Vim, dovresti andare bene, ma fai attenzione che alcuni comandi potrebbero non essere disponibili.

## Installazione

Non passerò attraverso le istruzioni dettagliate su come installare Vim su una macchina specifica. La buona notizia è che la maggior parte dei computer basati su Unix dovrebbe avere Vim installato. Se non è così, la maggior parte delle distribuzioni dovrebbe avere alcune istruzioni per installare Vim.

Per scaricare ulteriori informazioni sul processo di installazione di Vim, visita il sito ufficiale di download di Vim o il repository ufficiale di Vim su github:
- [Sito di Vim](https://www.vim.org/download.php)
- [Vim github](https://github.com/vim/vim)

## Il Comando Vim

Ora che hai installato Vim, esegui questo dal terminale:

```bash
vim
```

Dovresti vedere una schermata introduttiva. Questo è il luogo in cui lavorerai sul tuo nuovo file. A differenza della maggior parte degli editor di testo e IDE, Vim è un editor modale. Se vuoi digitare "hello", devi passare alla modalità di inserimento con `i`. Premi `ihello<Esc>` per inserire il testo "hello".

## Uscire da Vim

Ci sono diversi modi per uscire da Vim. Il più comune è digitare:

```shell
:quit
```

Puoi digitare `:q` per abbreviare. Quel comando è un comando della modalità della riga di comando (un'altra delle modalità di Vim). Se digiti `:` in modalità normale, il cursore si sposterà in fondo allo schermo dove puoi digitare alcuni comandi. Imparerai a conoscere la modalità della riga di comando più avanti nel capitolo 15. Se sei in modalità di inserimento, digitare `:` produrrà letteralmente il carattere ":" sullo schermo. In questo caso, devi tornare alla modalità normale. Digita `<Esc>` per passare alla modalità normale. A proposito, puoi anche tornare alla modalità normale dalla modalità della riga di comando premendo `<Esc>`. Noterai che puoi "uscire" da diverse modalità di Vim tornando alla modalità normale premendo `<Esc>`.

## Salvare un File

Per salvare le tue modifiche, digita:

```shell
:write
```

Puoi anche digitare `:w` per abbreviare. Se questo è un nuovo file, devi dargli un nome prima di poterlo salvare. Chiamiamolo `file.txt`. Esegui:

```shell
:w file.txt
```

Per salvare e uscire, puoi combinare i comandi `:w` e `:q`:

```shell
:wq
```

Per uscire senza salvare alcuna modifica, aggiungi `!` dopo `:q` per forzare l'uscita:

```shell
:q!
```

Ci sono altri modi per uscire da Vim, ma questi sono quelli che utilizzerai quotidianamente.

## Aiuto

Durante questa guida, ti rimanderò a varie pagine di aiuto di Vim. Puoi andare alla pagina di aiuto digitando `:help {some-command}` (`:h` per abbreviare). Puoi passare al comando `:h` un argomento che rappresenta un argomento o un nome di comando. Ad esempio, per scoprire diversi modi per uscire da Vim, digita:

```shell
:h write-quit
```

Come ho fatto a sapere di cercare "write-quit"? In realtà non lo sapevo. Ho semplicemente digitato `:h`, poi "quit", poi `<Tab>`. Vim ha visualizzato parole chiave pertinenti tra cui scegliere. Se hai mai bisogno di cercare qualcosa ("Vorrei che Vim potesse fare questo..."), basta digitare `:h` e provare alcune parole chiave, poi `<Tab>`.

## Aprire un File

Per aprire un file (`hello1.txt`) su Vim dal terminale, esegui:

```bash
vim hello1.txt
```

Puoi anche aprire più file contemporaneamente:

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim apre `hello1.txt`, `hello2.txt` e `hello3.txt` in buffer separati. Imparerai a conoscere i buffer nel capitolo successivo.

## Argomenti

Puoi passare il comando terminale `vim` con diversi flag e opzioni.

Per controllare la versione corrente di Vim, esegui:

```bash
vim --version
```

Questo ti dice la versione corrente di Vim e tutte le funzionalità disponibili contrassegnate con `+` o `-`. Alcune di queste funzionalità in questa guida richiedono che certe funzionalità siano disponibili. Ad esempio, esplorerai la cronologia della riga di comando di Vim in un capitolo successivo con il comando `:history`. Il tuo Vim deve avere la funzionalità `+cmdline_history` affinché il comando funzioni. È molto probabile che il Vim che hai appena installato abbia tutte le funzionalità necessarie, specialmente se proviene da una fonte di download popolare.

Molte cose che fai dal terminale possono essere fatte anche all'interno di Vim. Per vedere la versione dall'*interno* di Vim, puoi eseguire questo: 

```shell
:version
```

Se vuoi aprire il file `hello.txt` ed eseguire immediatamente un comando Vim, puoi passare al comando `vim` l'opzione `+{cmd}`.

In Vim, puoi sostituire le stringhe con il comando `:s` (abbreviazione di `:substitute`). Se vuoi aprire `hello.txt` e sostituire tutte le occorrenze di "pancake" con "bagel", esegui:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Questi comandi Vim possono essere impilati:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim sostituirà tutte le istanze di "pancake" con "bagel", poi sostituirà "bagel" con "egg", poi sostituirà "egg" con "donut" (imparerai la sostituzione in un capitolo successivo).

Puoi anche passare l'opzione `-c` seguita da un comando Vim invece della sintassi `+`:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Aprire Finestre Multiple

Puoi avviare Vim in finestre orizzontali e verticali divise con le opzioni `-o` e `-O`, rispettivamente.

Per aprire Vim con due finestre orizzontali, esegui:

```bash
vim -o2
```

Per aprire Vim con 5 finestre orizzontali, esegui:

```bash
vim -o5
```

Per aprire Vim con 5 finestre orizzontali e riempire le prime due con `hello1.txt` e `hello2.txt`, esegui:

```bash
vim -o5 hello1.txt hello2.txt
```

Per aprire Vim con due finestre verticali, 5 finestre verticali e 5 finestre verticali con 2 file:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Sospendere

Se hai bisogno di sospendere Vim mentre stai modificando, puoi premere `Ctrl-z`. Puoi anche eseguire il comando `:stop` o `:suspend`. Per tornare a Vim sospeso, esegui `fg` dal terminale.

## Avviare Vim nel Modo Intelligente

Il comando `vim` può accettare molte opzioni diverse, proprio come qualsiasi altro comando del terminale. Due opzioni ti consentono di passare un comando Vim come parametro: `+{cmd}` e `-c cmd`. Man mano che impari più comandi in questa guida, verifica se puoi applicarli quando avvii Vim. Essendo anche un comando del terminale, puoi combinare `vim` con molti altri comandi del terminale. Ad esempio, puoi reindirizzare l'output del comando `ls` per essere modificato in Vim con `ls -l | vim -`.

Per saperne di più sul comando `vim` nel terminale, controlla `man vim`. Per saperne di più sull'editor Vim, continua a leggere questa guida insieme al comando `:help`.