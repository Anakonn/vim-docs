---
description: Questo capitolo introduce come cercare rapidamente in Vim, migliorando
  la produttività. Include metodi di ricerca senza plugin e con il plugin fzf.vim.
title: Ch03. Searching Files
---

L'obiettivo di questo capitolo è darti un'introduzione su come cercare rapidamente in Vim. Essere in grado di cercare rapidamente è un ottimo modo per dare una spinta alla tua produttività in Vim. Quando ho scoperto come cercare file rapidamente, ho deciso di usare Vim a tempo pieno.

Questo capitolo è diviso in due parti: come cercare senza plugin e come cercare con il plugin [fzf.vim](https://github.com/junegunn/fzf.vim). Iniziamo!

## Apertura e Modifica di File

Per aprire un file in Vim, puoi usare `:edit`.

```shell
:edit file.txt
```

Se `file.txt` esiste, apre il buffer `file.txt`. Se `file.txt` non esiste, crea un nuovo buffer per `file.txt`.

L'autocompletamento con `<Tab>` funziona con `:edit`. Ad esempio, se il tuo file si trova all'interno di un *a*pp *c*ontroller *u*sers directory `./app/controllers/users_controllers.rb`, puoi usare `<Tab>` per espandere rapidamente i termini:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` accetta argomenti con caratteri jolly. `*` corrisponde a qualsiasi file nella directory corrente. Se stai cercando solo file con estensione `.yml` nella directory corrente:

```shell
:edit *.yml<Tab>
```

Vim ti darà un elenco di tutti i file `.yml` nella directory corrente tra cui scegliere.

Puoi usare `**` per cercare ricorsivamente. Se vuoi cercare tutti i file `*.md` nel tuo progetto, ma non sei sicuro in quali directory, puoi fare così:

```shell
:edit **/*.md<Tab>
```

`:edit` può essere usato per eseguire `netrw`, l'esploratore di file integrato di Vim. Per farlo, dai a `:edit` un argomento directory invece di un file:

```shell
:edit .
:edit test/unit/
```

## Ricerca di File Con Find

Puoi trovare file con `:find`. Ad esempio:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

L'autocompletamento funziona anche con `:find`:

```shell
:find p<Tab>                " per trovare package.json
:find a<Tab>c<Tab>u<Tab>    " per trovare app/controllers/users_controller.rb
```

Potresti notare che `:find` sembra simile a `:edit`. Qual è la differenza?

## Find e Path

La differenza è che `:find` trova file nel `path`, `:edit` no. Impariamo un po' di più sul `path`. Una volta che impari a modificare i tuoi percorsi, `:find` può diventare uno strumento di ricerca potente. Per controllare quali sono i tuoi percorsi, fai:

```shell
:set path?
```

Per impostazione predefinita, i tuoi probabilmente appariranno così:

```shell
path=.,/usr/include,,
```

- `.` significa cercare nella directory del file attualmente aperto.
- `,` significa cercare nella directory corrente.
- `/usr/include` è la directory tipica per i file di intestazione delle librerie C.

I primi due sono importanti nel nostro contesto e il terzo può essere ignorato per ora. La cosa importante qui è che puoi modificare i tuoi percorsi, dove Vim cercherà i file. Supponiamo che questa sia la struttura del tuo progetto:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Se vuoi andare a `users_controller.rb` dalla directory radice, devi passare attraverso diverse directory (e premere un considerevole numero di tab). Spesso, quando lavori con un framework, trascorri il 90% del tuo tempo in una directory particolare. In questa situazione, ti interessa solo andare alla directory `controllers/` con il minor numero di tasti possibile. L'impostazione `path` può accorciare quel viaggio.

Devi aggiungere `app/controllers/` al `path` corrente. Ecco come puoi farlo:

```shell
:set path+=app/controllers/
```

Ora che il tuo percorso è aggiornato, quando digiti `:find u<Tab>`, Vim cercherà ora all'interno della directory `app/controllers/` per i file che iniziano con "u".

Se hai una directory `controllers/` annidata, come `app/controllers/account/users_controller.rb`, Vim non troverà `users_controllers`. Invece, devi aggiungere `:set path+=app/controllers/**` affinché l'autocompletamento trovi `users_controller.rb`. Questo è fantastico! Ora puoi trovare il controller degli utenti con 1 pressione di tab invece di 3.

Potresti pensare di aggiungere tutte le directory del progetto in modo che quando premi `tab`, Vim cerchi ovunque quel file, in questo modo:

```shell
:set path+=$PWD/**
```

`$PWD` è la directory di lavoro corrente. Se provi ad aggiungere l'intero progetto al `path` sperando di rendere tutti i file raggiungibili con una pressione di `tab`, anche se questo potrebbe funzionare per un piccolo progetto, farlo rallenterà significativamente la tua ricerca se hai un gran numero di file nel tuo progetto. Ti consiglio di aggiungere solo il `path` dei tuoi file / directory più visitati.

Puoi aggiungere `set path+={tuo-percorso-qui}` nel tuo vimrc. Aggiornare il `path` richiede solo pochi secondi e farlo può farti risparmiare molto tempo.

## Ricerca in File Con Grep

Se hai bisogno di cercare nei file (trovare frasi nei file), puoi usare grep. Vim ha due modi per farlo:

- Grep interno (`:vim`. Sì, si scrive `:vim`. È l'abbreviazione di `:vimgrep`).
- Grep esterno (`:grep`).

Iniziamo con il grep interno. `:vim` ha la seguente sintassi:

```shell
:vim /pattern/ file
```

- `/pattern/` è un pattern regex del tuo termine di ricerca.
- `file` è l'argomento file. Puoi passare più argomenti. Vim cercherà il pattern all'interno dell'argomento file. Simile a `:find`, puoi passargli caratteri jolly `*` e `**`.

Ad esempio, per cercare tutte le occorrenze della stringa "breakfast" all'interno di tutti i file ruby (`.rb`) nella directory `app/controllers/`:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Dopo aver eseguito questo, verrai reindirizzato al primo risultato. Il comando di ricerca `vim` di Vim utilizza l'operazione `quickfix`. Per vedere tutti i risultati della ricerca, esegui `:copen`. Questo apre una finestra `quickfix`. Ecco alcuni comandi `quickfix` utili per farti diventare produttivo immediatamente:

```shell
:copen        Apri la finestra quickfix
:cclose       Chiudi la finestra quickfix
:cnext        Vai al prossimo errore
:cprevious    Vai all'errore precedente
:colder       Vai all'elenco degli errori più vecchi
:cnewer       Vai all'elenco degli errori più recenti
```

Per saperne di più su quickfix, dai un'occhiata a `:h quickfix`.

Potresti notare che l'esecuzione del grep interno (`:vim`) può diventare lenta se hai un gran numero di corrispondenze. Questo perché Vim carica ogni file corrispondente in memoria, come se fosse in fase di modifica. Se Vim trova un gran numero di file che corrispondono alla tua ricerca, li caricherà tutti e quindi consumerà una grande quantità di memoria.

Parliamo ora del grep esterno. Per impostazione predefinita, utilizza il comando terminale `grep`. Per cercare "lunch" all'interno di un file ruby nella directory `app/controllers/`, puoi fare così:

```shell
:grep -R "lunch" app/controllers/
```

Nota che invece di usare `/pattern/`, segue la sintassi del terminale grep `"pattern"`. Mostra anche tutte le corrispondenze utilizzando `quickfix`.

Vim definisce la variabile `grepprg` per determinare quale programma esterno eseguire quando si utilizza il comando `:grep` di Vim, in modo da non dover chiudere Vim e invocare il comando `grep` del terminale. Più avanti, ti mostrerò come cambiare il programma predefinito invocato quando si utilizza il comando `:grep` di Vim.

## Navigazione nei File Con Netrw

`netrw` è l'esploratore di file integrato di Vim. È utile per vedere la gerarchia di un progetto. Per eseguire `netrw`, hai bisogno di queste due impostazioni nel tuo `.vimrc`:

```shell
set nocp
filetype plugin on
```

Poiché `netrw` è un argomento vasto, coprirò solo l'uso di base, ma dovrebbe essere sufficiente per farti iniziare. Puoi avviare `netrw` quando lanci Vim passando una directory come parametro invece di un file. Ad esempio:

```shell
vim .
vim src/client/
vim app/controllers/
```

Per avviare `netrw` dall'interno di Vim, puoi usare il comando `:edit` e passargli un parametro directory invece di un nome file:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Ci sono altri modi per avviare la finestra `netrw` senza passare una directory:

```shell
:Explore     Avvia netrw sul file corrente
:Sexplore    Non sto scherzando. Avvia netrw sulla parte superiore della schermata divisa
:Vexplore    Avvia netrw sulla parte sinistra della schermata divisa
```

Puoi navigare in `netrw` con i movimenti di Vim (i movimenti saranno trattati in dettaglio in un capitolo successivo). Se hai bisogno di creare, eliminare o rinominare un file o una directory, ecco un elenco di comandi `netrw` utili:

```shell
%    Crea un nuovo file
d    Crea una nuova directory
R    Rinomina un file o una directory
D    Elimina un file o una directory
```

`:h netrw` è molto completo. Controllalo se hai tempo.

Se trovi `netrw` troppo banale e hai bisogno di più sapore, [vim-vinegar](https://github.com/tpope/vim-vinegar) è un buon plugin per migliorare `netrw`. Se stai cercando un diverso esploratore di file, [NERDTree](https://github.com/preservim/nerdtree) è una buona alternativa. Controllali!

## Fzf

Ora che hai imparato come cercare file in Vim con strumenti integrati, impariamo come farlo con i plugin.

Una cosa che i moderni editor di testo fanno bene e che Vim non ha fatto è quanto sia facile trovare file, specialmente tramite ricerca fuzzy. In questa seconda metà del capitolo, ti mostrerò come usare [fzf.vim](https://github.com/junegunn/fzf.vim) per rendere la ricerca in Vim facile e potente.

## Configurazione

Per prima cosa, assicurati di avere scaricato [fzf](https://github.com/junegunn/fzf) e [ripgrep](https://github.com/BurntSushi/ripgrep). Segui le istruzioni nel loro repository github. I comandi `fzf` e `rg` dovrebbero ora essere disponibili dopo installazioni riuscite.

Ripgrep è uno strumento di ricerca molto simile a grep (da qui il nome). È generalmente più veloce di grep e ha molte funzionalità utili. Fzf è un cercatore fuzzy da riga di comando di uso generale. Puoi usarlo con qualsiasi comando, incluso ripgrep. Insieme, formano una combinazione di strumenti di ricerca potente.

Fzf non utilizza ripgrep per impostazione predefinita, quindi dobbiamo dire a fzf di usare ripgrep definendo una variabile `FZF_DEFAULT_COMMAND`. Nel mio `.zshrc` (`.bashrc` se usi bash), ho queste:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Fai attenzione a `-m` in `FZF_DEFAULT_OPTS`. Questa opzione ci consente di effettuare selezioni multiple con `<Tab>` o `<Shift-Tab>`. Non hai bisogno di questa riga per far funzionare fzf con Vim, ma penso che sia un'opzione utile da avere. Sarà utile quando vorrai eseguire ricerca e sostituzione in più file, di cui parlerò tra poco. Il comando fzf accetta molte altre opzioni, ma non le tratterò qui. Per saperne di più, dai un'occhiata al [repository di fzf](https://github.com/junegunn/fzf#usage) o `man fzf`. Al minimo dovresti avere `export FZF_DEFAULT_COMMAND='rg'`.

Dopo aver installato fzf e ripgrep, impostiamo il plugin fzf. Sto usando il gestore di plugin [vim-plug](https://github.com/junegunn/vim-plug) in questo esempio, ma puoi usare qualsiasi gestore di plugin.

Aggiungi questi all'interno dei tuoi plugin `.vimrc`. Devi usare il plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (creato dallo stesso autore di fzf).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Dopo aver aggiunto queste righe, dovrai aprire `vim` e eseguire `:PlugInstall`. Installerà tutti i plugin definiti nel tuo file `vimrc` e non installati. Nel nostro caso, installerà `fzf.vim` e `fzf`.

Per ulteriori informazioni su questo plugin, puoi controllare il [repository di fzf.vim](https://github.com/junegunn/fzf/blob/master/README-VIM.md).
## Sintassi Fzf

Per utilizzare fzf in modo efficiente, dovresti imparare alcune sintassi di base di fzf. Fortunatamente, l'elenco è breve:

- `^` è una corrispondenza esatta con prefisso. Per cercare una frase che inizia con "welcome": `^welcome`.
- `$` è una corrispondenza esatta con suffisso. Per cercare una frase che termina con "my friends": `friends$`.
- `'` è una corrispondenza esatta. Per cercare la frase "welcome my friends": `'welcome my friends`.
- `|` è una corrispondenza "o". Per cercare "friends" o "foes": `friends | foes`.
- `!` è una corrispondenza inversa. Per cercare una frase contenente "welcome" e non "friends": `welcome !friends`

Puoi mescolare e abbinare queste opzioni. Ad esempio, `^hello | ^welcome friends$` cercherà la frase che inizia con "welcome" o "hello" e termina con "friends".

## Trovare File

Per cercare file all'interno di Vim utilizzando il plugin fzf.vim, puoi usare il metodo `:Files`. Esegui `:Files` da Vim e ti verrà presentato il prompt di ricerca fzf.

Poiché utilizzerai frequentemente questo comando, è utile mappare questo a una scorciatoia da tastiera. Io lo mappo a `Ctrl-f`. Nel mio vimrc, ho questo:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Trovare nei File

Per cercare all'interno dei file, puoi usare il comando `:Rg`.

Ancora una volta, poiché probabilmente utilizzerai questo frequentemente, mappiamolo a una scorciatoia da tastiera. Io lo mappo a `<Leader>f`. Il tasto `<Leader>` è mappato a `\` per impostazione predefinita.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Altre Ricerche

Fzf.vim fornisce molti altri comandi di ricerca. Non passerò attraverso ciascuno di essi qui, ma puoi consultarli [qui](https://github.com/junegunn/fzf.vim#commands).

Ecco come appaiono le mie mappature fzf:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Sostituire Grep con Rg

Come accennato in precedenza, Vim ha due modi per cercare nei file: `:vim` e `:grep`. `:grep` utilizza uno strumento di ricerca esterno che puoi riassegnare utilizzando la parola chiave `grepprg`. Ti mostrerò come configurare Vim per utilizzare ripgrep invece di grep del terminale quando esegui il comando `:grep`.

Ora configuriamo `grepprg` affinché il comando `:grep` di Vim utilizzi ripgrep. Aggiungi questo nel tuo vimrc:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Sentiti libero di modificare alcune delle opzioni sopra! Per ulteriori informazioni su cosa significano le opzioni sopra, consulta `man rg`.

Dopo aver aggiornato `grepprg`, ora quando esegui `:grep`, esegue `rg --vimgrep --smart-case --follow` invece di `grep`. Se vuoi cercare "donut" utilizzando ripgrep, ora puoi eseguire un comando più conciso `:grep "donut"` invece di `:grep "donut" . -R`.

Proprio come il vecchio `:grep`, questo nuovo `:grep` utilizza anche quickfix per visualizzare i risultati.

Potresti chiederti: "Bene, questo è bello, ma non ho mai usato `:grep` in Vim, inoltre non posso semplicemente usare `:Rg` per trovare frasi nei file? Quando avrò mai bisogno di usare `:grep`?"

Questa è una domanda molto valida. Potresti dover usare `:grep` in Vim per eseguire ricerca e sostituzione in più file, cosa che tratterò nel prossimo paragrafo.

## Ricerca e Sostituzione in Più File

Editor di testo moderni come VSCode rendono molto facile cercare e sostituire una stringa in più file. In questa sezione, ti mostrerò due metodi diversi per farlo facilmente in Vim.

Il primo metodo è sostituire *tutte* le frasi corrispondenti nel tuo progetto. Dovrai usare `:grep`. Se vuoi sostituire tutte le istanze di "pizza" con "donut", ecco cosa devi fare:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Analizziamo i comandi:

1. `:grep pizza` utilizza ripgrep per cercare tutte le istanze di "pizza" (tra l'altro, questo funzionerebbe ancora anche se non avessi riassegnato `grepprg` per usare ripgrep. Dovresti eseguire `:grep "pizza" . -R` invece di `:grep "pizza"`).
2. `:cfdo` esegue qualsiasi comando tu passi a tutti i file nella tua lista quickfix. In questo caso, il tuo comando è il comando di sostituzione `%s/pizza/donut/g`. La pipe (`|`) è un operatore di concatenazione. Il comando `update` salva ogni file dopo la sostituzione. Tratterò il comando di sostituzione in modo più approfondito in un capitolo successivo.

Il secondo metodo è cercare e sostituire in file selezionati. Con questo metodo, puoi scegliere manualmente quali file vuoi modificare. Ecco cosa devi fare:

1. Pulisci prima i tuoi buffer. È imperativo che la tua lista di buffer contenga solo i file su cui vuoi applicare la sostituzione. Puoi riavviare Vim o eseguire il comando `:%bd | e#` (`%bd` elimina tutti i buffer e `e#` apre il file su cui eri appena).
2. Esegui `:Files`.
3. Seleziona tutti i file su cui vuoi eseguire la ricerca e sostituzione. Per selezionare più file, usa `<Tab>` / `<Shift-Tab>`. Questo è possibile solo se hai il flag multiplo (`-m`) in `FZF_DEFAULT_OPTS`.
4. Esegui `:bufdo %s/pizza/donut/g | update`. Il comando `:bufdo %s/pizza/donut/g | update` appare simile al precedente comando `:cfdo %s/pizza/donut/g | update`. La differenza è che invece di sostituire tutte le voci di quickfix (`:cfdo`), stai sostituendo tutte le voci di buffer (`:bufdo`).

## Impara a Cercare nel Modo Intelligente

Cercare è il pane e burro dell'editing di testo. Imparare a cercare bene in Vim migliorerà significativamente il tuo flusso di lavoro di editing di testo.

Fzf.vim è un cambiamento radicale. Non riesco a immaginare di usare Vim senza di esso. Penso sia molto importante avere un buon strumento di ricerca quando si inizia a usare Vim. Ho visto persone lottare per passare a Vim perché sembra mancare di funzionalità critiche che gli editor di testo moderni hanno, come una funzione di ricerca facile e potente. Spero che questo capitolo ti aiuti a rendere la transizione a Vim più semplice.

Hai anche appena visto l'estensibilità di Vim in azione: la capacità di estendere la funzionalità di ricerca con un plugin e un programma esterno. In futuro, tieni presente quali altre funzionalità desideri estendere in Vim. È probabile che sia già in Vim, qualcuno ha creato un plugin o c'è già un programma per questo. Nel prossimo capitolo, imparerai un argomento molto importante in Vim: la grammatica di Vim.