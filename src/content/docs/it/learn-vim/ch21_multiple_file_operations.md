---
description: Scopri come modificare più file in Vim utilizzando comandi come `argdo`,
  `bufdo` e `cdo`, per migliorare la tua efficienza di editing.
title: Ch21. Multiple File Operations
---

Essere in grado di aggiornare più file è un altro strumento di editing utile da avere. In precedenza hai imparato come aggiornare più testi con `cfdo`. In questo capitolo, imparerai i diversi modi in cui puoi modificare più file in Vim.

## Modi diversi per eseguire un comando in più file

Vim ha otto modi per eseguire comandi su più file:
- arg list (`argdo`)
- buffer list (`bufdo`)
- window list (`windo`)
- tab list (`tabdo`)
- quickfix list (`cdo`)
- quickfix list filewise (`cfdo`)
- location list (`ldo`)
- location list filewise (`lfdo`)

Praticamente parlando, probabilmente utilizzerai solo uno o due la maggior parte del tempo (personalmente utilizzo `cdo` e `argdo` più degli altri), ma è utile conoscere tutte le opzioni disponibili e utilizzare quelle che si adattano al tuo stile di editing.

Imparare otto comandi potrebbe sembrare scoraggiante. Ma in realtà, questi comandi funzionano in modo simile. Dopo averne imparato uno, imparare gli altri diventerà più facile. Condividono tutti la stessa grande idea: creare un elenco delle rispettive categorie e poi passare il comando che desideri eseguire.

## Elenco degli argomenti

L'elenco degli argomenti è l'elenco più basilare. Crea un elenco di file. Per creare un elenco di file1, file2 e file3, puoi eseguire:

```shell
:args file1 file2 file3
```

Puoi anche passarci un carattere jolly (`*`), quindi se vuoi creare un elenco di tutti i file `.js` nella directory corrente, esegui:

```shell
:args *.js
```

Se vuoi creare un elenco di tutti i file Javascript che iniziano con "a" nella directory corrente, esegui:

```shell
:args a*.js
```

Il carattere jolly corrisponde a uno o più caratteri di nome file nella directory corrente, ma cosa succede se devi cercare ricorsivamente in qualsiasi directory? Puoi usare il doppio carattere jolly (`**`). Per ottenere tutti i file Javascript all'interno delle directory nella tua posizione attuale, esegui:

```shell
:args **/*.js
```

Una volta eseguito il comando `args`, il tuo buffer corrente verrà cambiato al primo elemento dell'elenco. Per visualizzare l'elenco dei file che hai appena creato, esegui `:args`. Una volta creato il tuo elenco, puoi attraversarli. `:first` ti porterà al primo elemento dell'elenco. `:last` ti porterà all'ultimo elemento dell'elenco. Per spostare l'elenco in avanti un file alla volta, esegui `:next`. Per spostare l'elenco all'indietro un file alla volta, esegui `:prev`. Per muoverti avanti / indietro un file alla volta e salvare le modifiche, esegui `:wnext` e `:wprev`. Ci sono molti altri comandi di navigazione. Controlla `:h arglist` per ulteriori informazioni.

L'elenco degli argomenti è utile se hai bisogno di mirare a un tipo specifico di file o a pochi file. Forse hai bisogno di aggiornare tutti i "donut" in "pancake" all'interno di tutti i file `yml`, puoi fare:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Se esegui di nuovo il comando `args`, sostituirà l'elenco precedente. Ad esempio, se in precedenza hai eseguito:

```shell
:args file1 file2 file3
```

Assumendo che questi file esistano, ora hai un elenco di `file1`, `file2` e `file3`. Poi esegui questo:

```shell
:args file4 file5
```

Il tuo elenco iniziale di `file1`, `file2` e `file3` viene sostituito con `file4` e `file5`. Se hai `file1`, `file2` e `file3` nel tuo elenco di argomenti e vuoi *aggiungere* `file4` e `file5` nel tuo elenco iniziale, usa il comando `:arga`. Esegui:

```shell
:arga file4 file5
```

Ora hai `file1`, `file2`, `file3`, `file4` e `file5` nel tuo elenco di argomenti.

Se esegui `:arga` senza alcun argomento, Vim aggiungerà il tuo buffer corrente nell'elenco di argomenti corrente. Se hai già `file1`, `file2` e `file3` nel tuo elenco di argomenti e il tuo buffer corrente è su `file5`, eseguendo `:arga` aggiunge `file5` nell'elenco.

Una volta che hai l'elenco, puoi passarci qualsiasi comando della riga di comando a tua scelta. Hai visto come farlo con la sostituzione (`:argdo %s/donut/pancake/g`). Alcuni altri esempi:
- Per eliminare tutte le righe che contengono "dessert" nell'elenco degli argomenti, esegui `:argdo g/dessert/d`.
- Per eseguire la macro a (supponendo che tu abbia registrato qualcosa nella macro a) nell'elenco degli argomenti, esegui `:argdo norm @a`.
- Per scrivere "hello " seguito dal nome del file sulla prima riga, esegui `:argdo 0put='hello ' .. @:`.

Una volta terminato, non dimenticare di salvarli con `:update`.

A volte hai bisogno di eseguire i comandi solo sui primi n elementi dell'elenco degli argomenti. Se è così, basta passare al comando `argdo` un indirizzo. Ad esempio, per eseguire il comando di sostituzione solo sui primi 3 elementi dell'elenco, esegui `:1,3argdo %s/donut/pancake/g`.

## Elenco dei buffer

L'elenco dei buffer verrà creato organicamente quando modifichi nuovi file perché ogni volta che crei un nuovo file / apri un file, Vim lo salva in un buffer (a meno che tu non lo elimini esplicitamente). Quindi, se hai già aperto 3 file: `file1.rb file2.rb file3.rb`, hai già 3 elementi nel tuo elenco di buffer. Per visualizzare l'elenco dei buffer, esegui `:buffers` (in alternativa: `:ls` o `:files`). Per attraversare avanti e indietro, usa `:bnext` e `:bprev`. Per andare al primo e all'ultimo buffer dall'elenco, usa `:bfirst` e `:blast` (ti stai divertendo? :D).

A proposito, ecco un trucco interessante sui buffer non correlato a questo capitolo: se hai un numero di elementi nel tuo elenco di buffer, puoi mostrarli tutti con `:ball` (buffer all). Il comando `ball` visualizza tutti i buffer orizzontalmente. Per visualizzarli verticalmente, esegui `:vertical ball`.

Tornando all'argomento, la meccanica per eseguire operazioni su tutti i buffer è simile all'elenco degli argomenti. Una volta creato il tuo elenco di buffer, devi solo anteporre il/i comando/i che desideri eseguire con `:bufdo` invece di `:argdo`. Quindi, se desideri sostituire tutti i "donut" con "pancake" in tutti i buffer e poi salvare le modifiche, esegui `:bufdo %s/donut/pancake/g | update`.

## Elenco delle finestre e delle schede

L'elenco delle finestre e delle schede è anche simile all'elenco degli argomenti e dei buffer. Le uniche differenze sono il loro contesto e la sintassi.

Le operazioni sulle finestre vengono eseguite su ogni finestra aperta e vengono eseguite con `:windo`. Le operazioni sulle schede vengono eseguite su ogni scheda che hai aperto e vengono eseguite con `:tabdo`. Per ulteriori informazioni, controlla `:h list-repeat`, `:h :windo` e `:h :tabdo`.

Ad esempio, se hai tre finestre aperte (puoi aprire nuove finestre con `Ctrl-W v` per una finestra verticale e `Ctrl-W s` per una finestra orizzontale) e esegui `:windo 0put ='hello' . @%`, Vim stamperà "hello" + nome del file in tutte le finestre aperte.

## Elenco Quickfix

Nei capitoli precedenti (Ch3 e Ch19), ho parlato dei quickfix. I quickfix hanno molti usi. Molti plugin popolari utilizzano i quickfix, quindi è utile dedicare più tempo a comprenderli.

Se sei nuovo in Vim, il quickfix potrebbe essere un concetto nuovo. Nei vecchi tempi, quando dovevi effettivamente compilare il tuo codice, durante la fase di compilazione avresti incontrato errori. Per visualizzare questi errori, hai bisogno di una finestra speciale. È qui che entra in gioco il quickfix. Quando compili il tuo codice, Vim visualizza i messaggi di errore nella finestra quickfix in modo da poterli correggere in seguito. Molti linguaggi moderni non richiedono più una compilazione esplicita, ma questo non rende il quickfix obsoleto. Oggi, le persone usano il quickfix per tutti i tipi di cose, come visualizzare un output di terminale virtuale e memorizzare i risultati di ricerca. Concentrati su quest'ultimo, memorizzare i risultati di ricerca.

Oltre ai comandi di compilazione, alcuni comandi Vim si basano sulle interfacce quickfix. Un tipo di comando che utilizza pesantemente i quickfix sono i comandi di ricerca. Sia `:vimgrep` che `:grep` utilizzano i quickfix per impostazione predefinita.

Ad esempio, se hai bisogno di cercare "donut" in tutti i file Javascript in modo ricorsivo, puoi eseguire:

```shell
:vimgrep /donut/ **/*.js
```

Il risultato della ricerca per "donut" è memorizzato nella finestra quickfix. Per vedere i risultati di corrispondenza nella finestra quickfix, esegui:

```shell
:copen
```

Per chiuderla, esegui:

```shell
:cclose
```

Per attraversare l'elenco quickfix avanti e indietro, esegui:

```shell
:cnext
:cprev
```

Per andare al primo e all'ultimo elemento nella corrispondenza, esegui:

```shell
:cfirst
:clast
```

In precedenza ho menzionato che ci sono due comandi quickfix: `cdo` e `cfdo`. Qual è la differenza? `cdo` esegue il comando per ogni elemento nell'elenco quickfix mentre `cfdo` esegue il comando per ogni *file* nell'elenco quickfix.

Lasciami chiarire. Supponi che dopo aver eseguito il comando `vimgrep` sopra, tu abbia trovato:
- 1 risultato in `file1.js`
- 10 risultati in `file2.js`

Se esegui `:cfdo %s/donut/pancake/g`, questo eseguirà effettivamente `%s/donut/pancake/g` una volta in `file1.js` e una volta in `file2.js`. Viene eseguito *tante volte quanto ci sono file nella corrispondenza.* Poiché ci sono due file nei risultati, Vim esegue il comando di sostituzione una volta su `file1.js` e una volta di più su `file2.js`, nonostante ci siano 10 corrispondenze nel secondo file. `cfdo` si preoccupa solo di quanti file totali ci sono nell'elenco quickfix.

Se esegui `:cdo %s/donut/pancake/g`, questo eseguirà effettivamente `%s/donut/pancake/g` una volta in `file1.js` e *dieci volte* in `file2.js`. Viene eseguito tante volte quanto ci sono elementi effettivi nell'elenco quickfix. Poiché è stata trovata solo una corrispondenza in `file1.js` e 10 corrispondenze in `file2.js`, verrà eseguito un totale di 11 volte.

Poiché hai eseguito `%s/donut/pancake/g`, avrebbe senso usare `cfdo`. Non avrebbe avuto senso usare `cdo` perché eseguirebbe `%s/donut/pancake/g` dieci volte in `file2.js` (`%s` è una sostituzione a livello di file). Eseguire `%s` una volta per file è sufficiente. Se avessi usato `cdo`, avrebbe avuto più senso passarci `s/donut/pancake/g` invece.

Quando decidi se utilizzare `cfdo` o `cdo`, pensa all'ambito del comando che stai passando. È un comando a livello di file (come `:%s` o `:g`) o è un comando a livello di riga (come `:s` o `:!`)?

## Elenco delle posizioni

L'elenco delle posizioni è simile all'elenco quickfix in un certo senso, poiché Vim utilizza anche una finestra speciale per visualizzare i messaggi. La differenza tra un elenco quickfix e un elenco delle posizioni è che in qualsiasi momento, puoi avere solo un elenco quickfix, mentre puoi avere quanti più elenchi delle posizioni quante finestre hai.

Supponi di avere due finestre aperte, una finestra che visualizza `food.txt` e un'altra che visualizza `drinks.txt`. Dall'interno di `food.txt`, esegui un comando di ricerca dell'elenco delle posizioni `:lvimgrep` (la variante di posizione per il comando `:vimgrep`):

```shell
:lvim /bagel/ **/*.md
```

Vim creerà un elenco delle posizioni di tutte le corrispondenze di ricerca per bagel per quella finestra di `food.txt`. Puoi vedere l'elenco delle posizioni con `:lopen`. Ora vai all'altra finestra `drinks.txt` e esegui:

```shell
:lvimgrep /milk/ **/*.md
```

Vim creerà un elenco delle posizioni *separato* con tutti i risultati di ricerca per il latte per quella finestra di `drinks.txt`.

Per ogni comando di posizione che esegui in ogni finestra, Vim crea un elenco delle posizioni distinto. Se hai 10 finestre diverse, puoi avere fino a 10 elenchi delle posizioni diversi. Contrasta questo con l'elenco quickfix dove puoi avere solo uno in qualsiasi momento. Se hai 10 finestre diverse, hai comunque solo un elenco quickfix.

La maggior parte dei comandi dell'elenco delle posizioni è simile ai comandi quickfix, tranne che sono prefissati con `l-` invece. Ad esempio: `:lvimgrep`, `:lgrep` e `:lmake` vs `:vimgrep`, `:grep` e `:make`. Per manipolare la finestra dell'elenco delle posizioni, di nuovo, i comandi sembrano simili ai comandi quickfix `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext` e `:lprev` vs `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext` e `:cprev`.

I due comandi multi-file dell'elenco delle posizioni sono anche simili ai comandi multi-file quickfix: `:ldo` e `:lfdo`. `:ldo` esegue il comando di posizione in ciascun elenco delle posizioni mentre `:lfdo` esegue il comando dell'elenco delle posizioni per ogni file nell'elenco delle posizioni. Per ulteriori informazioni, controlla `:h location-list`.
## Eseguire Operazioni su Più File in Vim

Sapere come eseguire un'operazione su più file è un'abilità utile nell'editing. Ogni volta che hai bisogno di cambiare un nome di variabile in più file, vuoi eseguirli in un colpo solo. Vim ha otto modi diversi per farlo.

Praticamente parlando, probabilmente non utilizzerai tutti e otto in modo uguale. Ti orienterai verso uno o due. Quando inizi, scegli uno (personalmente suggerisco di iniziare con l'elenco degli argomenti `:argdo`) e padroneggialo. Una volta che ti senti a tuo agio con uno, allora impara il successivo. Scoprirai che imparare il secondo, il terzo, il quarto diventa più facile. Sii creativo. Usalo con diverse combinazioni. Continua a praticare fino a poterlo fare senza sforzo e senza troppo pensare. Fanne parte della tua memoria muscolare.

Detto ciò, hai padroneggiato l'editing in Vim. Congratulazioni!