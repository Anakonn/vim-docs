---
description: Questo capitolo offre una panoramica dei percorsi di runtime di Vim,
  spiegando come personalizzarli e quando vengono utilizzati per migliorare l'esperienza
  utente.
title: Ch24. Vim Runtime
---

Nei capitoli precedenti, ho menzionato che Vim cerca automaticamente percorsi speciali come `pack/` (Cap. 22) e `compiler/` (Cap. 19) all'interno della directory `~/.vim/`. Questi sono esempi di percorsi di runtime di Vim.

Vim ha più percorsi di runtime di questi due. In questo capitolo, imparerai una panoramica ad alto livello di questi percorsi di runtime. L'obiettivo di questo capitolo è mostrarti quando vengono chiamati. Conoscere questo ti permetterà di comprendere e personalizzare ulteriormente Vim.

## Percorso di Runtime

In una macchina Unix, uno dei tuoi percorsi di runtime di Vim è `$HOME/.vim/` (se hai un sistema operativo diverso come Windows, il tuo percorso potrebbe essere diverso). Per vedere quali sono i percorsi di runtime per diversi sistemi operativi, controlla `:h 'runtimepath'`. In questo capitolo, userò `~/.vim/` come percorso di runtime predefinito.

## Script di Plugin

Vim ha un percorso di runtime per i plugin che esegue qualsiasi script in questa directory ogni volta che Vim si avvia. Non confondere il nome "plugin" con i plugin esterni di Vim (come NERDTree, fzf.vim, ecc.).

Vai nella directory `~/.vim/` e crea una directory `plugin/`. Crea due file: `donut.vim` e `chocolate.vim`.

Dentro `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

Dentro `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Ora chiudi Vim. La prossima volta che avvii Vim, vedrai sia `"donut!"` che `"chocolate!"` stampati. Il percorso di runtime del plugin può essere utilizzato per gli script di inizializzazione.

## Rilevamento del Tipo di File

Prima di iniziare, per assicurarti che questi rilevamenti funzionino, assicurati che il tuo vimrc contenga almeno la seguente riga:

```shell
filetype plugin indent on
```

Controlla `:h filetype-overview` per ulteriori dettagli. Essenzialmente, questo attiva il rilevamento del tipo di file di Vim.

Quando apri un nuovo file, Vim di solito sa che tipo di file è. Se hai un file `hello.rb`, eseguendo `:set filetype?` restituisce la risposta corretta `filetype=ruby`.

Vim sa come rilevare i tipi di file "comuni" (Ruby, Python, Javascript, ecc.). Ma cosa succede se hai un file personalizzato? Devi insegnare a Vim a rilevarlo e assegnargli il tipo di file corretto.

Ci sono due metodi di rilevamento: utilizzare il nome del file e il contenuto del file.

### Rilevamento del Nome del File

Il rilevamento del nome del file rileva un tipo di file utilizzando il nome di quel file. Quando apri il file `hello.rb`, Vim sa che è un file Ruby dall'estensione `.rb`.

Ci sono due modi per fare il rilevamento del nome del file: utilizzando la directory di runtime `ftdetect/` e utilizzando il file di runtime `filetype.vim`. Esploriamo entrambi.

#### `ftdetect/`

Creiamo un file oscuro (ma gustoso), `hello.chocodonut`. Quando lo apri e esegui `:set filetype?`, poiché non è un'estensione di nome file comune, Vim non sa come interpretarlo. Restituisce `filetype=`.

Devi istruire Vim a impostare tutti i file che terminano con `.chocodonut` come un tipo di file "chocodonut". Crea una directory chiamata `ftdetect/` nella radice di runtime (`~/.vim/`). All'interno, crea un file e chiamalo `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). All'interno di questo file, aggiungi:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` e `BufRead` vengono attivati ogni volta che crei un nuovo buffer e apri un nuovo buffer. `*.chocodonut` significa che questo evento verrà attivato solo se il buffer aperto ha un'estensione di nome file `.chocodonut`. Infine, il comando `set filetype=chocodonut` imposta il tipo di file come tipo chocodonut.

Riavvia Vim. Ora apri il file `hello.chocodonut` e esegui `:set filetype?`. Restituisce `filetype=chocodonut`.

Delizioso! Puoi mettere quanti più file vuoi all'interno di `ftdetect/`. In futuro, potresti aggiungere `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, ecc., se decidi mai di espandere i tuoi tipi di file donut.

Ci sono in realtà due modi per impostare un tipo di file in Vim. Uno è quello che hai appena usato `set filetype=chocodonut`. L'altro modo è eseguire `setfiletype chocodonut`. Il primo comando `set filetype=chocodonut` *imposterà sempre* il tipo di file come tipo chocodonut, mentre il secondo comando `setfiletype chocodonut` imposterà il tipo di file solo se non era già stato impostato.

#### File di Tipo di File

Il secondo metodo di rilevamento dei file richiede di creare un `filetype.vim` nella directory radice (`~/.vim/filetype.vim`). Aggiungi questo all'interno:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Crea un file `hello.plaindonut`. Quando lo apri e esegui `:set filetype?`, Vim visualizza il corretto tipo di file personalizzato `filetype=plaindonut`.

Holy pastry, funziona! A proposito, se giochi con `filetype.vim`, potresti notare che questo file viene eseguito più volte quando apri `hello.plaindonut`. Per evitare ciò, puoi aggiungere una guardia in modo che lo script principale venga eseguito solo una volta. Aggiorna il `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` è un comando di Vim per interrompere l'esecuzione del resto dello script. L'espressione `"did_load_filetypes"` *non è* una funzione incorporata di Vim. È in realtà una variabile globale all'interno di `$VIMRUNTIME/filetype.vim`. Se sei curioso, esegui `:e $VIMRUNTIME/filetype.vim`. Troverai queste righe all'interno:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Quando Vim chiama questo file, definisce la variabile `did_load_filetypes` e la imposta a 1. 1 è vero in Vim. Dovresti leggere anche il resto di `filetype.vim`. Vedi se riesci a capire cosa fa quando Vim lo chiama.

### Script di Tipo di File

Impariamo come rilevare e assegnare un tipo di file in base al contenuto del file.

Supponiamo di avere una collezione di file senza un'estensione accettabile. L'unica cosa che questi file hanno in comune è che iniziano tutti con la parola "donutify" sulla prima riga. Vuoi assegnare a questi file un tipo di file `donut`. Crea nuovi file chiamati `sugardonut`, `glazeddonut` e `frieddonut` (senza estensione). All'interno di ciascun file, aggiungi questa riga:

```shell
donutify
```

Quando esegui `:set filetype?` all'interno di `sugardonut`, Vim non sa quale tipo di file assegnare a questo file. Restituisce `filetype=`.

Nella radice di runtime, aggiungi un file `scripts.vim` (`~/.vim/scripts.vim`). All'interno, aggiungi questi:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

La funzione `getline(1)` restituisce il testo sulla prima riga. Controlla se la prima riga inizia con la parola "donutify". La funzione `did_filetype()` è una funzione incorporata di Vim. Restituirà vero quando un evento relativo al tipo di file viene attivato almeno una volta. Viene utilizzata come guardia per fermare la riesecuzione dell'evento di tipo di file.

Apri il file `sugardonut` e esegui `:set filetype?`, Vim ora restituisce `filetype=donut`. Se apri altri file donut (`glazeddonut` e `frieddonut`), Vim identifica anche i loro tipi di file come tipi `donut`.

Nota che `scripts.vim` viene eseguito solo quando Vim apre un file con un tipo di file sconosciuto. Se Vim apre un file con un tipo di file noto, `scripts.vim` non verrà eseguito.

## Plugin di Tipo di File

Cosa succede se vuoi che Vim esegua script specifici per chocodonut quando apri un file chocodonut e non esegua quegli script quando apri un file plaindonut?

Puoi fare questo con il percorso di runtime del plugin di tipo di file (`~/.vim/ftplugin/`). Vim cerca all'interno di questa directory un file con lo stesso nome del tipo di file che hai appena aperto. Crea un `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

Crea un altro file ftplugin, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

Ora ogni volta che apri un file di tipo chocodonut, Vim esegue gli script da `~/.vim/ftplugin/chocodonut.vim`. Ogni volta che apri un file di tipo plaindonut, Vim esegue gli script da `~/.vim/ftplugin/plaindonut.vim`.

Un avvertimento: questi file vengono eseguiti ogni volta che viene impostato un tipo di file per un buffer (`set filetype=chocodonut`, ad esempio). Se apri 3 file chocodonut diversi, gli script verranno eseguiti un *totale* di tre volte.

## File di Indentazione

Vim ha un percorso di runtime di indentazione che funziona in modo simile a ftplugin, dove Vim cerca un file con lo stesso nome del tipo di file aperto. Lo scopo di questi percorsi di runtime di indentazione è memorizzare codici relativi all'indentazione. Se hai il file `~/.vim/indent/chocodonut.vim`, verrà eseguito solo quando apri un file di tipo chocodonut. Puoi memorizzare qui i codici relativi all'indentazione per i file chocodonut.

## Colori

Vim ha un percorso di runtime per i colori (`~/.vim/colors/`) per memorizzare temi di colore. Qualsiasi file che va all'interno della directory verrà visualizzato nel comando della riga di comando `:color`.

Se hai un file `~/.vim/colors/beautifulprettycolors.vim`, quando esegui `:color` e premi Tab, vedrai `beautifulprettycolors` come una delle opzioni di colore. Se preferisci aggiungere il tuo tema di colore, questo è il posto giusto.

Se vuoi controllare i temi di colore creati da altre persone, un buon posto da visitare è [vimcolors](https://vimcolors.com/).

## Evidenziazione della Sintassi

Vim ha un percorso di runtime per la sintassi (`~/.vim/syntax/`) per definire l'evidenziazione della sintassi.

Supponiamo di avere un file `hello.chocodonut`, all'interno del quale hai le seguenti espressioni:

```shell
(donut "tasty")
(donut "savory")
```

Sebbene Vim ora conosca il tipo di file corretto, tutti i testi hanno lo stesso colore. Aggiungiamo una regola di evidenziazione della sintassi per evidenziare la parola chiave "donut". Crea un nuovo file di sintassi chocodonut, `~/.vim/syntax/chocodonut.vim`. All'interno, aggiungi:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Ora riapri il file `hello.chocodonut`. Le parole chiave `donut` sono ora evidenziate.

Questo capitolo non approfondirà l'evidenziazione della sintassi. È un argomento vasto. Se sei curioso, controlla `:h syntax.txt`.

Il plugin [vim-polyglot](https://github.com/sheerun/vim-polyglot) è un ottimo plugin che fornisce evidenziazioni per molti linguaggi di programmazione popolari.

## Documentazione

Se crei un plugin, dovrai creare la tua documentazione. Utilizzi il percorso di runtime doc per questo.

Creiamo una documentazione di base per le parole chiave chocodonut e plaindonut. Crea un `donut.txt` (`~/.vim/doc/donut.txt`). All'interno, aggiungi questi testi:

```shell
*chocodonut* Delizioso donut al cioccolato

*plaindonut* Nessuna bontà al cioccolato ma comunque delizioso
```

Se provi a cercare `chocodonut` e `plaindonut` (`:h chocodonut` e `:h plaindonut`), non troverai nulla.

Prima, devi eseguire `:helptags` per generare nuove voci di aiuto. Esegui `:helptags ~/.vim/doc/`

Ora se esegui `:h chocodonut` e `:h plaindonut`, troverai queste nuove voci di aiuto. Nota che il file è ora di sola lettura e ha un tipo di file "help".
## Lazy Loading Scripts

Tutti i percorsi di runtime che hai appreso in questo capitolo sono stati eseguiti automaticamente. Se vuoi caricare manualmente uno script, usa il percorso di runtime autoload.

Crea una directory autoload (`~/.vim/autoload/`). All'interno di quella directory, crea un nuovo file e chiamalo `tasty.vim` (`~/.vim/autoload/tasty.vim`). All'interno:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Nota che il nome della funzione è `tasty#donut`, non `donut()`. Il simbolo di cancelletto (`#`) è richiesto quando si utilizza la funzione autoload. La convenzione di denominazione delle funzioni per la funzione autoload è:

```shell
function fileName#functionName()
  ...
endfunction
```

In questo caso, il nome del file è `tasty.vim` e il nome della funzione è (tecnicamente) `donut`.

Per invocare una funzione, hai bisogno del comando `call`. Chiamiamo quella funzione con `:call tasty#donut()`.

La prima volta che chiami la funzione, dovresti vedere *entrambi* i messaggi echo ("tasty.vim global" e "tasty#donut"). Le chiamate successive alla funzione `tasty#donut` mostreranno solo "testy#donut" echo.

Quando apri un file in Vim, a differenza dei percorsi di runtime precedenti, gli script autoload non vengono caricati automaticamente. Solo quando chiami esplicitamente `tasty#donut()`, Vim cerca il file `tasty.vim` e carica tutto ciò che contiene, inclusa la funzione `tasty#donut()`. Autoload è il meccanismo perfetto per le funzioni che utilizzano risorse estese ma che non usi spesso.

Puoi aggiungere quanti più directory nidificati con autoload desideri. Se hai il percorso di runtime `~/.vim/autoload/one/two/three/tasty.vim`, puoi chiamare la funzione con `:call one#two#three#tasty#donut()`.

## After Scripts

Vim ha un percorso di runtime after (`~/.vim/after/`) che rispecchia la struttura di `~/.vim/`. Qualsiasi cosa in questo percorso viene eseguita per ultima, quindi gli sviluppatori di solito usano questi percorsi per sovrascrivere script.

Ad esempio, se vuoi sovrascrivere gli script da `plugin/chocolate.vim`, puoi creare `~/.vim/after/plugin/chocolate.vim` per mettere gli script di sovrascrittura. Vim eseguirà `~/.vim/after/plugin/chocolate.vim` *dopo* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

Vim ha una variabile d'ambiente `$VIMRUNTIME` per script predefiniti e file di supporto. Puoi controllarlo eseguendo `:e $VIMRUNTIME`.

La struttura dovrebbe sembrarti familiare. Contiene molti percorsi di runtime che hai appreso in questo capitolo.

Ricorda che nel Capitolo 21, hai appreso che quando apri Vim, cerca i file vimrc in sette diverse posizioni. Ho detto che l'ultima posizione che Vim controlla è `$VIMRUNTIME/defaults.vim`. Se Vim non riesce a trovare alcun file vimrc utente, Vim utilizza un `defaults.vim` come vimrc.

Hai mai provato a eseguire Vim senza un plugin di sintassi come vim-polyglot eppure il tuo file è ancora evidenziato sintatticamente? Questo perché quando Vim non riesce a trovare un file di sintassi dal percorso di runtime, Vim cerca un file di sintassi dalla directory di sintassi di `$VIMRUNTIME`.

Per saperne di più, controlla `:h $VIMRUNTIME`.

## Runtimepath Option

Per controllare il tuo runtimepath, esegui `:set runtimepath?`

Se usi Vim-Plug o popolari gestori di plugin esterni, dovrebbe visualizzare un elenco di directory. Ad esempio, il mio mostra:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Una delle cose che i gestori di plugin fanno è aggiungere ogni plugin nel percorso di runtime. Ogni percorso di runtime può avere la propria struttura di directory simile a `~/.vim/`.

Se hai una directory `~/box/of/donuts/` e vuoi aggiungere quella directory al tuo percorso di runtime, puoi aggiungere questo al tuo vimrc:

```shell
set rtp+=$HOME/box/of/donuts/
```

Se all'interno di `~/box/of/donuts/`, hai una directory plugin (`~/box/of/donuts/plugin/hello.vim`) e un ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), Vim eseguirà tutti gli script da `plugin/hello.vim` quando apri Vim. Vim eseguirà anche `ftplugin/chocodonut.vim` quando apri un file chocodonut.

Prova tu stesso: crea un percorso arbitrario e aggiungilo al tuo runtimepath. Aggiungi alcuni dei percorsi di runtime che hai appreso in questo capitolo. Assicurati che funzionino come previsto.

## Learn Runtime the Smart Way

Prenditi il tuo tempo per leggerlo e gioca con questi percorsi di runtime. Per vedere come i percorsi di runtime vengono utilizzati nel mondo reale, vai al repository di uno dei tuoi plugin Vim preferiti e studia la sua struttura di directory. Dovresti essere in grado di capire la maggior parte di essi ora. Prova a seguire e discernere il quadro generale. Ora che comprendi la struttura delle directory di Vim, sei pronto per imparare Vimscript.