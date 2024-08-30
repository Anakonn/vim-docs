---
description: Questo documento esplora come integrare Vim e Git, concentrandosi su
  tecniche di diffing per confrontare e gestire file in modo efficace.
title: Ch18. Git
---

Vim e git sono due ottimi strumenti per due cose diverse. Git è uno strumento di controllo versione. Vim è un editor di testo.

In questo capitolo, imparerai diversi modi per integrare Vim e git insieme.

## Diffing

Ricorda nel capitolo precedente, puoi eseguire un comando `vimdiff` per mostrare le differenze tra più file.

Supponi di avere due file, `file1.txt` e `file2.txt`. 

Dentro `file1.txt`:

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

Dentro `file2.txt`:

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

Per vedere le differenze tra entrambi i file, esegui:

```shell
vimdiff file1.txt file2.txt
```

In alternativa, puoi eseguire:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` visualizza due buffer affiancati. A sinistra c'è `file1.txt` e a destra c'è `file2.txt`. Le prime differenze (apples e oranges) sono evidenziate su entrambe le righe.

Supponiamo che tu voglia fare in modo che il secondo buffer abbia apples, non oranges. Per trasferire il contenuto dalla tua posizione attuale (sei attualmente su `file1.txt`) a `file2.txt`, prima vai alla differenza successiva con `]c` (per saltare alla finestra di differenza precedente, usa `[c`). Il cursore dovrebbe ora essere su apples. Esegui `:diffput`. Entrambi i file dovrebbero ora avere apples.

Se hai bisogno di trasferire il testo dall'altro buffer (orange juice, `file2.txt`) per sostituire il testo nel buffer attuale (apple juice, `file1.txt`), con il cursore ancora sulla finestra di `file1.txt`, prima vai alla differenza successiva con `]c`. Il cursore ora dovrebbe essere su apple juice. Esegui `:diffget` per ottenere l'orange juice da un altro buffer per sostituire apple juice nel nostro buffer.

`:diffput` *trasferisce* il testo dal buffer attuale a un altro buffer. `:diffget` *ottiene* il testo da un altro buffer al buffer attuale.

Se hai più buffer, puoi eseguire `:diffput fileN.txt` e `:diffget fileN.txt` per mirare al buffer fileN.

## Vim Come Strumento di Merge

> "Adoro risolvere i conflitti di merge!" - Nessuno

Non conosco nessuno che ami risolvere i conflitti di merge. Tuttavia, sono inevitabili. In questa sezione, imparerai come sfruttare Vim come strumento di risoluzione dei conflitti di merge.

Prima, cambia lo strumento di merge predefinito per utilizzare `vimdiff` eseguendo:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

In alternativa, puoi modificare direttamente il `~/.gitconfig` (per impostazione predefinita dovrebbe trovarsi nella root, ma il tuo potrebbe trovarsi in un posto diverso). I comandi sopra dovrebbero modificare il tuo gitconfig per apparire come l'impostazione qui sotto, se non li hai già eseguiti, puoi anche modificare manualmente il tuo gitconfig.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Creiamo un conflitto di merge fittizio per testare questo. Crea una directory `/food` e rendila un repository git:

```shell
git init
```

Aggiungi un file, `breakfast.txt`. Dentro:

```shell
pancakes
waffles
oranges
```

Aggiungi il file e impegnati:

```shell
git add .
git commit -m "Initial breakfast commit"
```

Successivamente, crea un nuovo branch e chiamalo branch apples:

```shell
git checkout -b apples
```

Modifica `breakfast.txt`:

```shell
pancakes
waffles
apples
```

Salva il file, poi aggiungi e impegnati:

```shell
git add .
git commit -m "Apples not oranges"
```

Ottimo. Ora hai oranges nel branch master e apples nel branch apples. Torniamo al branch master:

```shell
git checkout master
```

Dentro `breakfast.txt`, dovresti vedere il testo di base, oranges. Cambiamolo in grapes perché sono di stagione in questo momento:

```shell
pancakes
waffles
grapes
```

Salva, aggiungi e impegnati:

```shell
git add .
git commit -m "Grapes not oranges"
```

Ora sei pronto per unire il branch apples nel branch master:

```shell
git merge apples
```

Dovresti vedere un errore:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Un conflitto, ottimo! Risolviamo il conflitto utilizzando il nostro `mergetool` appena configurato. Esegui:

```shell
git mergetool
```

Vim visualizza quattro finestre. Presta attenzione alle prime tre:

- `LOCAL` contiene `grapes`. Questa è la modifica in "locale", ciò in cui stai unendo.
- `BASE` contiene `oranges`. Questo è l'antenato comune tra `LOCAL` e `REMOTE` per confrontare come divergono.
- `REMOTE` contiene `apples`. Questo è ciò che viene unito.

In fondo (la quarta finestra) vedi:

```shell
pancakes
waffles
<<<<<<< HEAD
grapes
||||||| db63958
oranges
=======
apples
>>>>>>> apples
```

La quarta finestra contiene i testi del conflitto di merge. Con questa configurazione, è più facile vedere quale modifica ha ciascun ambiente. Puoi vedere il contenuto di `LOCAL`, `BASE` e `REMOTE` contemporaneamente. 

Il tuo cursore dovrebbe essere sulla quarta finestra, nell'area evidenziata. Per ottenere la modifica da `LOCAL` (grapes), esegui `:diffget LOCAL`. Per ottenere la modifica da `BASE` (oranges), esegui `:diffget BASE` e per ottenere la modifica da `REMOTE` (apples), esegui `:diffget REMOTE`.

In questo caso, otteniamo la modifica da `LOCAL`. Esegui `:diffget LOCAL`. La quarta finestra avrà ora grapes. Salva e chiudi tutti i file (`:wqall`) quando hai finito. Non è stato male, giusto?

Se noti, hai anche un file `breakfast.txt.orig` ora. Git crea un file di backup nel caso in cui le cose non vadano bene. Se non vuoi che git crei un backup durante un merge, esegui:

```shell
git config --global mergetool.keepBackup false
```

## Git Dentro Vim

Vim non ha una funzionalità git nativa integrata. Un modo per eseguire comandi git da Vim è utilizzare l'operatore bang, `!`, in modalità linea di comando.

Qualsiasi comando git può essere eseguito con `!`:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Puoi anche utilizzare le convenzioni di Vim `%` (buffer corrente) o `#` (altro buffer):

```shell
:!git add %         " git add file corrente
:!git checkout #    " git checkout l'altro file
```

Un trucco di Vim che puoi usare per aggiungere più file in diverse finestre di Vim è eseguire:

```shell
:windo !git add %
```

Poi fai un commit:

```shell
:!git commit "Ho appena aggiunto tutto nel mio Vim, figo"
```

Il comando `windo` è uno dei comandi "fare" di Vim, simile a `argdo` che hai visto in precedenza. `windo` esegue il comando su ogni finestra.

In alternativa, puoi anche usare `bufdo !git add %` per git aggiungere tutti i buffer o `argdo !git add %` per git aggiungere tutti gli argomenti dei file, a seconda del tuo flusso di lavoro.

## Plugin

Ci sono molti plugin Vim per il supporto git. Di seguito è riportato un elenco di alcuni dei plugin git più popolari per Vim (probabilmente ce ne sono di più al momento in cui leggi questo):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

Uno dei più popolari è vim-fugitive. Per il resto del capitolo, passerò attraverso diversi flussi di lavoro git utilizzando questo plugin.

## Vim-fugitive

Il plugin vim-fugitive ti consente di eseguire la CLI di git senza lasciare l'editor Vim. Scoprirai che alcuni comandi sono migliori quando eseguiti dall'interno di Vim.

Per iniziare, installa il vim-fugitive con un gestore di plugin Vim ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim), ecc).

## Git Status

Quando esegui il comando `:Git` senza parametri, vim-fugitive visualizza una finestra di riepilogo git. Mostra i file non tracciati, non messi in scena e messi in scena. Mentre sei in questa modalità "`git status`", puoi fare diverse cose:
- `Ctrl-N` / `Ctrl-P` per andare su o giù nella lista dei file.
- `-` per mettere in scena o rimuovere dalla scena il nome del file sotto il cursore.
- `s` per mettere in scena il nome del file sotto il cursore.
- `u` per rimuovere dalla scena il nome del file sotto il cursore.
- `>` / `<` per visualizzare o nascondere un diff inline del nome del file sotto il cursore.

Per ulteriori informazioni, controlla `:h fugitive-staging-maps`.

## Git Blame

Quando esegui il comando `:Git blame` dal file corrente, vim-fugitive visualizza una finestra di blame divisa. Questo può essere utile per trovare la persona responsabile della scrittura di quella riga di codice difettosa così puoi urlargli contro (sto scherzando).

Alcune cose che puoi fare mentre sei in questa modalità `"git blame"`:
- `q` per chiudere la finestra di blame.
- `A` per ridimensionare la colonna dell'autore.
- `C` per ridimensionare la colonna del commit.
- `D` per ridimensionare la colonna della data / ora.

Per ulteriori informazioni, controlla `:h :Git_blame`.

## Gdiffsplit

Quando esegui il comando `:Gdiffsplit`, vim-fugitive esegue un `vimdiff` delle ultime modifiche del file corrente rispetto all'indice o al work tree. Se esegui `:Gdiffsplit <commit>`, vim-fugitive esegue un `vimdiff` contro quel file all'interno di `<commit>`.

Poiché sei in modalità `vimdiff`, puoi *ottenere* o *trasferire* il diff con `:diffput` e `:diffget`.

## Gwrite e Gread

Quando esegui il comando `:Gwrite` in un file dopo aver apportato modifiche, vim-fugitive mette in scena le modifiche. È come eseguire `git add <file-corrente>`.

Quando esegui il comando `:Gread` in un file dopo aver apportato modifiche, vim-fugitive ripristina il file allo stato precedente alle modifiche. È come eseguire `git checkout <file-corrente>`. Un vantaggio dell'esecuzione di `:Gread` è che l'azione è annullabile. Se, dopo aver eseguito `:Gread`, cambi idea e vuoi mantenere la vecchia modifica, puoi semplicemente eseguire l'annullamento (`u`) e Vim annullerà l'azione `:Gread`. Questo non sarebbe stato possibile se avessi eseguito `git checkout <file-corrente>` dalla CLI.

## Gclog

Quando esegui il comando `:Gclog`, vim-fugitive visualizza la cronologia dei commit. È come eseguire il comando `git log`. Vim-fugitive utilizza il quickfix di Vim per realizzare questo, quindi puoi usare `:cnext` e `:cprevious` per passare alla successiva o precedente informazione di log. Puoi aprire e chiudere la lista dei log con `:copen` e `:cclose`.

Mentre sei in questa modalità `"git log"`, puoi fare due cose:
- Visualizzare l'albero.
- Visitare il genitore (il commit precedente).

Puoi passare a `:Gclog` argomenti proprio come il comando `git log`. Se il tuo progetto ha una lunga cronologia di commit e hai solo bisogno di visualizzare gli ultimi tre commit, puoi eseguire `:Gclog -3`. Se hai bisogno di filtrarlo in base alla data del committente, puoi eseguire qualcosa come `:Gclog --after="1 Gennaio" --before="14 Marzo"`.

## Più Vim-fugitive

Questi sono solo alcuni esempi di ciò che vim-fugitive può fare. Per saperne di più su vim-fugitive, controlla `:h fugitive.txt`. La maggior parte dei comandi git popolari sono probabilmente ottimizzati con vim-fugitive. Devi solo cercarli nella documentazione.

Se sei all'interno di una delle "modalità speciali" di vim-fugitive (ad esempio, all'interno della modalità `:Git` o `:Git blame`) e vuoi sapere quali scorciatoie sono disponibili, premi `g?`. Vim-fugitive visualizzerà la finestra di `:help` appropriata per la modalità in cui ti trovi. Figo!
## Impara Vim e Git nel Modo Intelligente

Potresti trovare vim-fugitive un buon complemento al tuo flusso di lavoro (o no). In ogni caso, ti incoraggio vivamente a dare un'occhiata a tutti i plugin elencati sopra. Probabilmente ce ne sono altri che non ho elencato. Provali.

Un modo ovvio per migliorare con l'integrazione di Vim e Git è leggere di più su git. Git, di per sé, è un argomento vasto e sto mostrando solo una frazione di esso. Detto ciò, iniziamo a *git going* (scusa il gioco di parole) e parliamo di come usare Vim per compilare il tuo codice!