---
description: In questo capitolo, scoprirai come utilizzare i tag di Vim per navigare
  rapidamente tra le definizioni nel codice, facilitando la comprensione del codice
  sorgente.
title: Ch16. Tags
---

Una funzionalità utile nell'editing di testo è la possibilità di andare rapidamente a qualsiasi definizione. In questo capitolo, imparerai come utilizzare i tag di Vim per farlo.

## Panoramica dei Tag

Supponiamo che qualcuno ti abbia dato una nuova base di codice:

```shell
one = One.new
one.donut
```

`One`? `donut`? Beh, questi potrebbero essere stati ovvi per gli sviluppatori che scrivevano il codice tanto tempo fa, ma ora quegli sviluppatori non ci sono più e spetta a te capire questi codici oscuri. Un modo per aiutarti a comprendere questo è seguire il codice sorgente dove `One` e `donut` sono definiti.

Puoi cercarli con `fzf` o `grep` (o `vimgrep`), ma in questo caso, i tag sono più veloci.

Pensa ai tag come a un elenco telefonico:

```shell
Nome    Indirizzo
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Invece di avere una coppia nome-indirizzo, i tag memorizzano definizioni abbinate a indirizzi.

Supponiamo di avere questi due file Ruby all'interno della stessa directory:

```shell
## one.rb
class One
  def initialize
    puts "Inizializzato"
  end

  def donut
    puts "Bar"
  end
end
```

e

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Per saltare a una definizione, puoi usare `Ctrl-]` in modalità normale. All'interno di `two.rb`, vai alla riga dove si trova `one.donut` e sposta il cursore su `donut`. Premi `Ctrl-]`.

Oops, Vim non è riuscito a trovare il file dei tag. Devi prima generare il file dei tag.

## Generatore di Tag

Il Vim moderno non viene fornito con un generatore di tag, quindi dovrai scaricare un generatore di tag esterno. Ci sono diverse opzioni tra cui scegliere:

- ctags = Solo C. Disponibile quasi ovunque.
- exuberant ctags = Uno dei più popolari. Ha supporto per molti linguaggi.
- universal ctags = Simile a exuberant ctags, ma più recente.
- etags = Per Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Se guardi i tutorial di Vim online, molti consiglieranno [exuberant ctags](http://ctags.sourceforge.net/). Supporta [41 linguaggi di programmazione](http://ctags.sourceforge.net/languages.html). L'ho usato e ha funzionato alla grande. Tuttavia, poiché non è stato mantenuto dal 2009, Universal ctags sarebbe una scelta migliore. Funziona in modo simile a exuberant ctags ed è attualmente mantenuto.

Non entrerò nei dettagli su come installare universal ctags. Controlla il repository [universal ctags](https://github.com/universal-ctags/ctags) per ulteriori istruzioni.

Assumendo che tu abbia installato universal ctags, generiamo un file di tag di base. Esegui:

```shell
ctags -R .
```

L'opzione `R` dice a ctags di eseguire una scansione ricorsiva dalla tua posizione attuale (`.`). Dovresti vedere un file `tags` nella tua directory attuale. All'interno vedrai qualcosa di simile:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Il tuo potrebbe apparire un po' diverso a seconda delle impostazioni di Vim e del generatore di ctags. Un file di tag è composto da due parti: i metadati dei tag e l'elenco dei tag. Questi metadati (`!TAG_FILE...`) sono solitamente controllati dal generatore di ctags. Non ne parlerò qui, ma sentiti libero di controllare la loro documentazione per ulteriori informazioni! L'elenco dei tag è un elenco di tutte le definizioni indicizzate da ctags.

Ora vai a `two.rb`, metti il cursore su `donut` e digita `Ctrl-]`. Vim ti porterà al file `one.rb` sulla riga dove si trova `def donut`. Successo! Ma come ha fatto Vim a farlo?

## Anatomia dei Tag

Diamo un'occhiata all'elemento tag `donut`:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

L'elemento tag sopra è composto da quattro componenti: un `tagname`, un `tagfile`, un `tagaddress`, e opzioni tag.
- `donut` è il `tagname`. Quando il tuo cursore è su "donut", Vim cerca nel file dei tag una riga che contiene la stringa "donut".
- `one.rb` è il `tagfile`. Vim cerca un file `one.rb`.
- `/^ def donut$/` è il `tagaddress`. `/.../` è un indicatore di pattern. `^` è un pattern per il primo elemento su una riga. È seguito da due spazi, poi dalla stringa `def donut`. Infine, `$` è un pattern per l'ultimo elemento su una riga.
- `f class:One` è l'opzione tag che dice a Vim che la funzione `donut` è una funzione (`f`) ed è parte della classe `One`.

Diamo un'occhiata a un altro elemento nell'elenco dei tag:

```shell
One	one.rb	/^class One$/;"	c
```

Questa riga funziona allo stesso modo del pattern `donut`:

- `One` è il `tagname`. Nota che con i tag, la prima scansione è sensibile al maiuscolo. Se hai `One` e `one` nell'elenco, Vim darà priorità a `One` rispetto a `one`.
- `one.rb` è il `tagfile`. Vim cerca un file `one.rb`.
- `/^class One$/` è il pattern `tagaddress`. Vim cerca una riga che inizia con (`^`) `class` e termina con (`$`) `One`.
- `c` è una delle possibili opzioni tag. Poiché `One` è una classe Ruby e non una procedura, viene contrassegnata con un `c`.

A seconda del generatore di tag che utilizzi, il contenuto del tuo file di tag potrebbe apparire diverso. Al minimo, un file di tag deve avere uno di questi formati:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## Il File dei Tag

Hai appreso che un nuovo file, `tags`, viene creato dopo aver eseguito `ctags -R .`. Come fa Vim a sapere dove cercare il file dei tag?

Se esegui `:set tags?`, potresti vedere `tags=./tags,tags` (a seconda delle impostazioni di Vim, potrebbe essere diverso). Qui Vim cerca tutti i tag nel percorso del file corrente nel caso di `./tags` e nella directory corrente (la radice del tuo progetto) nel caso di `tags`.

Inoltre, nel caso di `./tags`, Vim cercherà prima un file di tag all'interno del percorso del tuo file corrente, indipendentemente da quanto sia annidato, poi cercherà un file di tag nella directory corrente (radice del progetto). Vim si ferma dopo aver trovato la prima corrispondenza.

Se il tuo file `'tags'` avesse detto `tags=./tags,tags,/user/iggy/mytags/tags`, allora Vim cercherà anche nella directory `/user/iggy/mytags` per un file di tag dopo aver terminato la ricerca nelle directory `./tags` e `tags`. Non è necessario memorizzare il file dei tag all'interno del tuo progetto, puoi tenerli separati.

Per aggiungere una nuova posizione del file di tag, usa il seguente comando:

```shell
set tags+=path/to/my/tags/file
```

## Generazione di Tag per un Grande Progetto

Se hai provato a eseguire ctags in un grande progetto, potrebbe richiedere molto tempo perché Vim cerca anche all'interno di ogni directory annidata. Se sei uno sviluppatore Javascript, sai che `node_modules` può essere molto grande. Immagina di avere cinque sotto-progetti e ognuno contiene la propria directory `node_modules`. Se esegui `ctags -R .`, ctags cercherà di scansionare tutte e 5 le directory `node_modules`. Probabilmente non hai bisogno di eseguire ctags su `node_modules`.

Per eseguire ctags escludendo `node_modules`, esegui:

```shell
ctags -R --exclude=node_modules .
```

Questa volta dovrebbe richiedere meno di un secondo. A proposito, puoi usare l'opzione `exclude` più volte:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Il punto è, se vuoi omettere una directory, `--exclude` è il tuo migliore amico.

## Navigazione nei Tag

Puoi ottenere buoni risultati usando solo `Ctrl-]`, ma impariamo qualche trucco in più. Il tasto di salto ai tag `Ctrl-]` ha un'alternativa in modalità riga di comando: `:tag {tag-name}`. Se esegui:

```shell
:tag donut
```

Vim salterà al metodo `donut`, proprio come fare `Ctrl-]` sulla stringa "donut". Puoi anche completare l'argomento con `<Tab>`:

```shell
:tag d<Tab>
```

Vim elenca tutti i tag che iniziano con "d". In questo caso, "donut".

In un progetto reale, potresti incontrare più metodi con lo stesso nome. Aggiorniamo i due file Ruby di prima. All'interno di `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Inizializzato"
  end

  def donut
    puts "uno donut"
  end

  def pancake
    puts "uno pancake"
  end
end
```

All'interno di `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Due pancakes"
end

one = One.new
one.donut
puts pancake
```

Se stai programmando insieme, non dimenticare di eseguire di nuovo `ctags -R .` poiché ora hai diverse nuove procedure. Hai due istanze della procedura `pancake`. Se ti trovi all'interno di `two.rb` e premi `Ctrl-]`, cosa succederebbe?

Vim salterà a `def pancake` all'interno di `two.rb`, non a `def pancake` all'interno di `one.rb`. Questo perché Vim vede la procedura `pancake` all'interno di `two.rb` come avente una priorità più alta rispetto all'altra procedura `pancake`.

## Priorità dei Tag

Non tutti i tag sono uguali. Alcuni tag hanno priorità più alte. Se Vim si trova di fronte a nomi di elementi duplicati, Vim controlla la priorità della parola chiave. L'ordine è:

1. Un tag statico completamente corrispondente nel file corrente.
2. Un tag globale completamente corrispondente nel file corrente.
3. Un tag globale completamente corrispondente in un file diverso.
4. Un tag statico completamente corrispondente in un altro file.
5. Un tag statico corrispondente senza distinzione di maiuscole nel file corrente.
6. Un tag globale corrispondente senza distinzione di maiuscole nel file corrente.
7. Un tag globale corrispondente senza distinzione di maiuscole in un file diverso.
8. Un tag statico corrispondente senza distinzione di maiuscole nel file corrente.

Secondo l'elenco di priorità, Vim dà priorità alla corrispondenza esatta trovata nello stesso file. Ecco perché Vim sceglie la procedura `pancake` all'interno di `two.rb` rispetto alla procedura `pancake` all'interno di `one.rb`. Ci sono alcune eccezioni all'elenco di priorità sopra a seconda delle impostazioni di `'tagcase'`, `'ignorecase'`, e `'smartcase'`, ma non ne parlerò qui. Se sei interessato, controlla `:h tag-priority`.

## Salti Selettivi ai Tag

Sarebbe bello se potessi scegliere quali elementi tag saltare invece di andare sempre all'elemento tag con la priorità più alta. Forse hai effettivamente bisogno di saltare al metodo `pancake` in `one.rb` e non a quello in `two.rb`. Per farlo, puoi usare `:tselect`. Esegui:

```shell
:tselect pancake
```

Vedrai, in basso allo schermo:
## pri kind tag               file
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Se digiti 2, Vim salterà alla procedura in `one.rb`. Se digiti 1, Vim salterà alla procedura in `two.rb`.

Fai attenzione alla colonna `pri`. Hai `F C` nella prima corrispondenza e `F` nella seconda corrispondenza. Questo è ciò che Vim utilizza per determinare la priorità del tag. `F C` significa un tag globale completamente corrispondente (`F`) nel file corrente (`C`). `F` significa solo un tag globale completamente corrispondente (`F`). `F C` ha sempre una priorità più alta rispetto a `F`.

Se esegui `:tselect donut`, Vim ti chiede anche di selezionare quale elemento del tag saltare, anche se c'è solo un'opzione da scegliere. C'è un modo per far sì che Vim mostri l'elenco dei tag solo se ci sono più corrispondenze e salti immediatamente se viene trovato solo un tag?

Certo! Vim ha un metodo `:tjump`. Esegui:

```shell
:tjump donut
```

Vim salterà immediatamente alla procedura `donut` in `one.rb`, proprio come eseguire `:tag donut`. Ora esegui:

```shell
:tjump pancake
```

Vim ti presenterà le opzioni dei tag tra cui scegliere, proprio come eseguire `:tselect pancake`. Con `tjump` ottieni il meglio di entrambi i metodi.

Vim ha una chiave in modalità normale per `tjump`: `g Ctrl-]`. Personalmente preferisco `g Ctrl-]` rispetto a `Ctrl-]`.

## Completamento Automatico Con I Tag

I tag possono assistere i completamenti automatici. Ricorda dal capitolo 6, Modalità di Inserimento, che puoi usare il sottocomando `Ctrl-X` per fare vari completamenti automatici. Un sottocomando di completamento automatico che non ho menzionato era `Ctrl-]`. Se fai `Ctrl-X Ctrl-]` mentre sei in modalità di inserimento, Vim utilizzerà il file dei tag per il completamento automatico.

Se entri in modalità di inserimento e digiti `Ctrl-x Ctrl-]`, vedrai:

```shell
One
donut
initialize
pancake
```

## Stack Dei Tag

Vim tiene un elenco di tutti i tag a cui hai saltato e da cui sei tornato in uno stack dei tag. Puoi vedere questo stack con `:tags`. Se prima hai saltato al tag `pancake`, seguito da `donut`, e hai eseguito `:tags`, vedrai:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Nota il simbolo `>` sopra. Mostra la tua posizione attuale nello stack. Per "pop" lo stack e tornare a uno stack precedente, puoi eseguire `:pop`. Provalo, poi esegui di nuovo `:tags`:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Nota che il simbolo `>` ora è sulla linea due, dove si trova `donut`. Fai `pop` un'altra volta, poi esegui di nuovo `:tags`:

```shell
  # TO tag         FROM line  in file/text
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

In modalità normale, puoi eseguire `Ctrl-t` per ottenere lo stesso effetto di `:pop`.

## Generazione Automatica Dei Tag

Uno dei maggiori svantaggi dei tag di Vim è che ogni volta che apporti una modifica significativa, devi rigenerare il file dei tag. Se hai recentemente rinominato la procedura `pancake` nella procedura `waffle`, il file dei tag non sapeva che la procedura `pancake` era stata rinominata. Continuava a memorizzare `pancake` nell'elenco dei tag. Devi eseguire `ctags -R .` per creare un file dei tag aggiornato. Ricreare un nuovo file dei tag in questo modo può essere scomodo.

Fortunatamente, ci sono diversi metodi che puoi utilizzare per generare i tag automaticamente.

## Genera Un Tag Al Salvataggio

Vim ha un metodo di autocomando (`autocmd`) per eseguire qualsiasi comando su un evento di attivazione. Puoi usare questo per generare i tag ad ogni salvataggio. Esegui:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Analisi:
- `autocmd` è un comando della riga di comando. Accetta un evento, un modello di file e un comando.
- `BufWritePost` è un evento per il salvataggio di un buffer. Ogni volta che salvi un file, attivi un evento `BufWritePost`.
- `.rb` è un modello di file per i file ruby.
- `silent` è in realtà parte del comando che stai passando. Senza questo, Vim mostrerà `premi ENTER o digita un comando per continuare` ogni volta che attivi l'autocomando.
- `!ctags -R .` è il comando da eseguire. Ricorda che `!cmd` dall'interno di Vim esegue un comando del terminale.

Ora ogni volta che salvi da un file ruby, Vim eseguirà `ctags -R .`.

## Utilizzo Di Plugin

Ci sono diversi plugin per generare ctags automaticamente:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Io uso vim-gutentags. È semplice da usare e funzionerà subito.

## Ctags E Git Hooks

Tim Pope, autore di molti ottimi plugin Vim, ha scritto un blog suggerendo di utilizzare i git hooks. [Dai un'occhiata](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Impara I Tag Nel Modo Intelligente

Un tag è utile una volta configurato correttamente. Supponiamo che tu ti trovi di fronte a un nuovo codice e vuoi capire cosa fa `functionFood`, puoi leggerlo facilmente saltando alla sua definizione. All'interno, scopri che chiama anche `functionBreakfast`. Lo segui e scopri che chiama `functionPancake`. Il tuo grafo delle chiamate di funzione appare così:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Questo ti dà un'idea che questo flusso di codice è correlato ad avere un pancake per colazione.

Per saperne di più sui tag, controlla `:h tags`. Ora che sai come usare i tag, esploriamo una funzionalità diversa: il folding.