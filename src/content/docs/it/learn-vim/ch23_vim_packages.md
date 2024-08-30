---
description: In questo capitolo, imparerai a utilizzare il gestore di pacchetti integrato
  di Vim per installare plugin in modo automatico e manuale.
title: Ch23. Vim Packages
---

Nel capitolo precedente, ho menzionato l'uso di un gestore di plugin esterno per installare plugin. Dalla versione 8, Vim viene fornito con un proprio gestore di plugin integrato chiamato *packages*. In questo capitolo, imparerai come utilizzare i pacchetti di Vim per installare plugin.

Per vedere se la tua build di Vim ha la capacità di utilizzare i pacchetti, esegui `:version` e cerca l'attributo `+packages`. In alternativa, puoi anche eseguire `:echo has('packages')` (se restituisce 1, allora ha la capacità di pacchetti).

## Directory dei Pacchetti

Controlla se hai una directory `~/.vim/` nel percorso radice. Se non ce l'hai, creane una. All'interno, crea una directory chiamata `pack` (`~/.vim/pack/`). Vim sa automaticamente di cercare all'interno di questa directory per i pacchetti.

## Due Tipi di Caricamento

Il pacchetto di Vim ha due meccanismi di caricamento: caricamento automatico e manuale.

### Caricamento Automatico

Per caricare i plugin automaticamente quando Vim si avvia, devi metterli nella directory `start/`. Il percorso appare così:

```shell
~/.vim/pack/*/start/
```

Ora potresti chiederti: "Cos'è il `*` tra `pack/` e `start/`?" `*` è un nome arbitrario e può essere qualsiasi cosa tu voglia. Chiamiamolo `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

Tieni presente che se lo salti e fai qualcosa del genere invece:

```shell
~/.vim/pack/start/
```

Il sistema di pacchetti non funzionerà. È imperativo mettere un nome tra `pack/` e `start/`.

Per questa demo, proviamo a installare il plugin [NERDTree](https://github.com/preservim/nerdtree). Vai fino alla directory `start/` (`cd ~/.vim/pack/packdemo/start/`) e clona il repository di NERDTree:

```shell
git clone https://github.com/preservim/nerdtree.git
```

Ecco fatto! Sei a posto. La prossima volta che avvii Vim, puoi immediatamente eseguire i comandi di NERDTree come `:NERDTreeToggle`.

Puoi clonare quanti più repository di plugin desideri all'interno del percorso `~/.vim/pack/*/start/`. Vim caricherà automaticamente ciascuno di essi. Se rimuovi il repository clonato (`rm -rf nerdtree/`), quel plugin non sarà più disponibile.

### Caricamento Manuale

Per caricare i plugin manualmente quando Vim si avvia, devi metterli nella directory `opt/`. Simile al caricamento automatico, il percorso appare così:

```shell
~/.vim/pack/*/opt/
```

Utilizziamo la stessa directory `packdemo/` di prima:

```shell
~/.vim/pack/packdemo/opt/
```

Questa volta, installiamo il gioco [killersheep](https://github.com/vim/killersheep) (questo richiede Vim 8.2). Vai alla directory `opt/` (`cd ~/.vim/pack/packdemo/opt/`) e clona il repository:

```shell
git clone https://github.com/vim/killersheep.git
```

Avvia Vim. Il comando per eseguire il gioco è `:KillKillKill`. Prova a eseguirlo. Vim si lamenterà che non è un comando editor valido. Devi *caricare manualmente* il plugin prima. Facciamolo:

```shell
:packadd killersheep
```

Ora prova a eseguire di nuovo il comando `:KillKillKill`. Il comando dovrebbe funzionare ora.

Potresti chiederti: "Perché dovrei mai voler caricare manualmente i pacchetti? Non è meglio caricare automaticamente tutto all'inizio?"

Ottima domanda. A volte ci sono plugin che non utilizzerai sempre, come quel gioco KillerSheep. Probabilmente non hai bisogno di caricare 10 giochi diversi e rallentare il tempo di avvio di Vim. Tuttavia, di tanto in tanto, quando sei annoiato, potresti voler giocare a qualche gioco. Usa il caricamento manuale per i plugin non essenziali.

Puoi anche usare questo per aggiungere plugin in modo condizionale. Forse usi sia Neovim che Vim e ci sono plugin ottimizzati per Neovim. Puoi aggiungere qualcosa del genere nel tuo vimrc:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Organizzazione dei Pacchetti

Ricorda che il requisito per utilizzare il sistema di pacchetti di Vim è avere:

```shell
~/.vim/pack/*/start/
```

Oppure:

```shell
~/.vim/pack/*/opt/
```

Il fatto che `*` possa essere *qualsiasi* nome può essere utilizzato per organizzare i tuoi pacchetti. Supponiamo che tu voglia raggruppare i tuoi plugin in base a categorie (colori, sintassi e giochi):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Puoi comunque utilizzare `start/` e `opt/` all'interno di ciascuna delle directory.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Aggiungere Pacchetti nel Modo Intelligente

Potresti chiederti se il pacchetto di Vim renderà obsoleti gestori di plugin popolari come vim-pathogen, vundle.vim, dein.vim e vim-plug.

La risposta è, come sempre, "dipende".

Continuo a usare vim-plug perché rende facile aggiungere, rimuovere o aggiornare plugin. Se usi molti plugin, potrebbe essere più conveniente utilizzare gestori di plugin perché è facile aggiornare molti contemporaneamente. Alcuni gestori di plugin offrono anche funzionalità asincrone.

Se sei un minimalista, prova i pacchetti di Vim. Se sei un utente pesante di plugin, potresti voler considerare l'uso di un gestore di plugin.