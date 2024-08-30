---
description: Scopri come preservare le impostazioni, le pieghe e i buffer in Vim utilizzando
  View, Session e Viminfo per mantenere il tuo progetto sempre pronto.
title: Ch20. Views, Sessions, and Viminfo
---

Dopo aver lavorato a un progetto per un po', potresti scoprire che il progetto prende gradualmente forma con le proprie impostazioni, pieghe, buffer, layout, ecc. È come decorare il tuo appartamento dopo averci vissuto per un po'. Il problema è che, quando chiudi Vim, perdi quelle modifiche. Non sarebbe bello se potessi mantenere quelle modifiche in modo che la prossima volta che apri Vim, sembri proprio come se non fossi mai andato via?

In questo capitolo, imparerai come usare View, Session e Viminfo per preservare uno "snapshot" dei tuoi progetti.

## View

Una View è il sottoinsieme più piccolo dei tre (View, Session, Viminfo). È una collezione di impostazioni per una finestra. Se trascorri molto tempo a lavorare su una finestra e desideri preservare le mappe e le pieghe, puoi usare una View.

Creiamo un file chiamato `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

In questo file, crea tre modifiche:
1. Sulla riga 1, crea una piega manuale `zf4j` (piega le prossime 4 righe).
2. Cambia l'impostazione `number`: `setlocal nonumber norelativenumber`. Questo rimuoverà gli indicatori di numero sul lato sinistro della finestra.
3. Crea una mappatura locale per scendere di due righe ogni volta che premi `j` invece di una: `:nnoremap <buffer> j jj`.

Il tuo file dovrebbe apparire così:

```shell
+-- 5 righe: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Configurazione degli Attributi della View

Esegui:

```shell
:set viewoptions?
```

Per impostazione predefinita dovrebbe dire (il tuo potrebbe apparire diverso a seconda del tuo vimrc):

```shell
viewoptions=folds,cursor,curdir
```

Configuriamo `viewoptions`. I tre attributi che desideri preservare sono le pieghe, le mappe e le opzioni impostate localmente. Se la tua impostazione appare come la mia, hai già l'opzione `folds`. Devi dire a View di ricordare le `localoptions`. Esegui:

```shell
:set viewoptions+=localoptions
```

Per scoprire quali altre opzioni sono disponibili per `viewoptions`, controlla `:h viewoptions`. Ora se esegui `:set viewoptions?`, dovresti vedere:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Salvataggio della View

Con la finestra `foo.txt` correttamente piegata e con le opzioni `nonumber norelativenumber`, salviamo la View. Esegui:

```shell
:mkview
```

Vim crea un file View.

### File View

Potresti chiederti: "Dove ha salvato Vim questo file View?" Per vedere dove Vim lo salva, esegui:

```shell
:set viewdir?
```

In un sistema operativo basato su Unix, il predefinito dovrebbe dire `~/.vim/view` (se hai un sistema operativo diverso, potrebbe mostrare un percorso diverso. Controlla `:h viewdir` per ulteriori informazioni). Se stai eseguendo un sistema operativo basato su Unix e desideri cambiarlo in un percorso diverso, aggiungi questo al tuo vimrc:

```shell
set viewdir=$HOME/else/where
```

### Caricamento del File View

Chiudi `foo.txt` se non lo hai già fatto, poi apri di nuovo `foo.txt`. **Dovresti vedere il testo originale senza le modifiche.** Questo è previsto.

Per ripristinare lo stato, devi caricare il file View. Esegui:

```shell
:loadview
```

Ora dovresti vedere:

```shell
+-- 5 righe: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Le pieghe, le impostazioni locali e le mappature locali sono state ripristinate. Se noti, il cursore dovrebbe anche essere sulla riga dove lo avevi lasciato quando hai eseguito `:mkview`. Finché hai l'opzione `cursor`, View ricorda anche la posizione del cursore.

### Più Views

Vim ti consente di salvare 9 Views numerate (1-9).

Supponiamo che tu voglia fare un'ulteriore piega (diciamo che vuoi piegare le ultime due righe) con `:9,10 fold`. Salviamo questo come View 1. Esegui:

```shell
:mkview 1
```

Se vuoi fare un'altra piega con `:6,7 fold` e salvarla come una View diversa, esegui:

```shell
:mkview 2
```

Chiudi il file. Quando apri `foo.txt` e vuoi caricare la View 1, esegui:

```shell
:loadview 1
```

Per caricare la View 2, esegui:

```shell
:loadview 2
```

Per caricare la View originale, esegui:

```shell
:loadview
```

### Automazione della Creazione della View

Una delle cose peggiori che possono accadere è che, dopo aver trascorso innumerevoli ore ad organizzare un grande file con pieghe, chiudi accidentalmente la finestra e perdi tutte le informazioni sulle pieghe. Per prevenire questo, potresti voler creare automaticamente una View ogni volta che chiudi un buffer. Aggiungi questo nel tuo vimrc:

```shell
autocmd BufWinLeave *.txt mkview
```

Inoltre, potrebbe essere utile caricare la View quando apri un buffer:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Ora non devi più preoccuparti di creare e caricare la View quando lavori con file `txt`. Tieni presente che nel tempo, il tuo `~/.vim/view` potrebbe iniziare ad accumulare file View. È bene pulirlo ogni pochi mesi.

## Sessioni

Se una View salva le impostazioni di una finestra, una Sessione salva le informazioni di tutte le finestre (incluso il layout).

### Creazione di una Nuova Sessione

Supponiamo che tu stia lavorando con questi 3 file in un progetto `foobarbaz`:

Dentro `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Dentro `bar.txt`:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

Dentro `baz.txt`:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Ora diciamo che hai diviso le tue finestre con `:split` e `:vsplit`. Per preservare questo aspetto, devi salvare la Sessione. Esegui:

```shell
:mksession
```

A differenza di `mkview` che salva per impostazione predefinita in `~/.vim/view`, `mksession` salva un file di Sessione (`Session.vim`) nella directory corrente. Controlla il file se sei curioso di sapere cosa c'è dentro.

Se desideri salvare il file di Sessione in un'altra posizione, puoi passare un argomento a `mksession`:

```shell
:mksession ~/some/where/else.vim
```

Se desideri sovrascrivere il file di Sessione esistente, chiama il comando con un `!` (`:mksession! ~/some/where/else.vim`).

### Caricamento di una Sessione

Per caricare una Sessione, esegui:

```shell
:source Session.vim
```

Ora Vim appare proprio come l'avevi lasciato, comprese le finestre divise! In alternativa, puoi anche caricare un file di Sessione dal terminale:

```shell
vim -S Session.vim
```

### Configurazione degli Attributi della Sessione

Puoi configurare gli attributi che la Sessione salva. Per vedere cosa viene attualmente salvato, esegui:

```shell
:set sessionoptions?
```

La mia dice:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Se non vuoi salvare `terminal` quando salvi una Sessione, rimuovilo dalle opzioni della sessione. Esegui:

```shell
:set sessionoptions-=terminal
```

Se desideri aggiungere un `options` quando salvi una Sessione, esegui:

```shell
:set sessionoptions+=options
```

Ecco alcuni attributi che `sessionoptions` può memorizzare:
- `blank` memorizza finestre vuote
- `buffers` memorizza buffer
- `folds` memorizza pieghe
- `globals` memorizza variabili globali (devono iniziare con una lettera maiuscola e contenere almeno una lettera minuscola)
- `options` memorizza opzioni e mappature
- `resize` memorizza righe e colonne della finestra
- `winpos` memorizza la posizione della finestra
- `winsize` memorizza le dimensioni della finestra
- `tabpages` memorizza le schede
- `unix` memorizza file in formato Unix

Per l'elenco completo controlla `:h 'sessionoptions'`.

La Sessione è uno strumento utile per preservare gli attributi esterni del tuo progetto. Tuttavia, alcuni attributi interni non vengono salvati dalla Sessione, come segnalibri locali, registri, cronologie, ecc. Per salvarli, devi usare Viminfo!

## Viminfo

Se noti, dopo aver copiato una parola nel registro a e aver chiuso Vim, la prossima volta che apri Vim hai ancora quel testo memorizzato nel registro a. Questo è in realtà un lavoro di Viminfo. Senza di esso, Vim non ricorderà il registro dopo che chiudi Vim.

Se utilizzi Vim 8 o superiore, Vim abilita Viminfo per impostazione predefinita, quindi potresti aver usato Viminfo tutto questo tempo senza saperlo!

Potresti chiedere: "Cosa salva Viminfo? Come si differenzia dalla Sessione?"

Per usare Viminfo, prima devi avere la funzionalità `+viminfo` disponibile (`:version`). Viminfo memorizza:
- La cronologia della riga di comando.
- La cronologia delle stringhe di ricerca.
- La cronologia delle righe di input.
- Contenuti di registri non vuoti.
- Segnalibri per diversi file.
- Segnalibri di file, che puntano a posizioni nei file.
- Ultimo modello di ricerca/sostituzione (per 'n' e '&').
- La lista dei buffer.
- Variabili globali.

In generale, la Sessione memorizza gli attributi "esterni" e Viminfo gli attributi "interni".

A differenza della Sessione in cui puoi avere un file di Sessione per progetto, normalmente utilizzerai un file Viminfo per computer. Viminfo è agnostico rispetto al progetto.

La posizione predefinita di Viminfo per Unix è `$HOME/.viminfo` (`~/.viminfo`). Se utilizzi un sistema operativo diverso, la tua posizione Viminfo potrebbe essere diversa. Controlla `:h viminfo-file-name`. Ogni volta che apporti modifiche "interne", come copiare un testo in un registro, Vim aggiorna automaticamente il file Viminfo.

*Assicurati di avere l'opzione `nocompatible` impostata (`set nocompatible`), altrimenti il tuo Viminfo non funzionerà.*

### Scrittura e Lettura di Viminfo

Sebbene utilizzerai solo un file Viminfo, puoi creare più file Viminfo. Per scrivere un file Viminfo, usa il comando `:wviminfo` (`:wv` per abbreviare).

```shell
:wv ~/.viminfo_extra
```

Per sovrascrivere un file Viminfo esistente, aggiungi un punto esclamativo al comando `wv`:

```shell
:wv! ~/.viminfo_extra
```

Per impostazione predefinita, Vim leggerà dal file `~/.viminfo`. Per leggere da un file Viminfo diverso, esegui `:rviminfo`, o `:rv` per abbreviare:

```shell
:rv ~/.viminfo_extra
```

Per avviare Vim con un file Viminfo diverso dal terminale, usa il flag `i`:

```shell
vim -i viminfo_extra
```

Se utilizzi Vim per compiti diversi, come codifica e scrittura, puoi creare un Viminfo ottimizzato per la scrittura e un altro per la codifica.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Avvio di Vim Senza Viminfo

Per avviare Vim senza Viminfo, puoi eseguire dal terminale:

```shell
vim -i NONE
```

Per renderlo permanente, puoi aggiungere questo nel tuo file vimrc:

```shell
set viminfo="NONE"
```

### Configurazione degli Attributi di Viminfo

Simile a `viewoptions` e `sessionoptions`, puoi istruire quali attributi salvare con l'opzione `viminfo`. Esegui:

```shell
:set viminfo?
```

Otterrai:

```shell
!,'100,<50,s10,h
```

Questo sembra criptico. Rompiamolo:
- `!` salva variabili globali che iniziano con una lettera maiuscola e non contengono lettere minuscole. Ricorda che `g:` indica una variabile globale. Ad esempio, se a un certo punto hai scritto l'assegnazione `let g:FOO = "foo"`, Viminfo salverà la variabile globale `FOO`. Tuttavia, se hai fatto `let g:Foo = "foo"`, Viminfo non salverà questa variabile globale perché contiene lettere minuscole. Senza `!`, Vim non salverà quelle variabili globali.
- `'100` rappresenta i segnalibri. In questo caso, Viminfo salverà i segnalibri locali (a-z) degli ultimi 100 file. Fai attenzione che se dici a Viminfo di salvare troppi file, Vim può iniziare a rallentare. 1000 è un buon numero da avere.
- `<50` dice a Viminfo quante righe massime vengono salvate per ogni registro (50 in questo caso). Se copio 100 righe di testo nel registro a (`"ay99j`) e chiudo Vim, la prossima volta che apro Vim e incollo dal registro a (`"ap`), Vim incollerà solo un massimo di 50 righe. Se non dai un numero massimo di righe, *tutte* le righe verranno salvate. Se dai 0, nulla verrà salvato.
- `s10` imposta un limite di dimensione (in kb) per un registro. In questo caso, qualsiasi registro maggiore di 10kb verrà escluso.
- `h` disabilita l'evidenziazione (da `hlsearch`) quando Vim si avvia.

Ci sono altre opzioni che puoi passare. Per saperne di più, controlla `:h 'viminfo'`.
## Utilizzare Views, Sessions e Viminfo in modo intelligente

Vim ha View, Session e Viminfo per prendere istantanee di diversi livelli del tuo ambiente Vim. Per progetti micro, usa Views. Per progetti più grandi, usa Sessions. Dovresti prenderti del tempo per controllare tutte le opzioni che View, Session e Viminfo offrono.

Crea la tua View, Session e Viminfo per il tuo stile di editing. Se hai mai bisogno di usare Vim al di fuori del tuo computer, puoi semplicemente caricare le tue impostazioni e ti sentirai immediatamente a casa!