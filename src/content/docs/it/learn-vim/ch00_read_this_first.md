---
description: Questa guida offre un'introduzione pratica a Vim, evidenziando le funzionalità
  chiave per diventare un Vimmer efficace in poco tempo.
title: Ch00. Read This First
---

## Perché è stata scritta questa guida

Ci sono molti posti per imparare Vim: il `vimtutor` è un ottimo punto di partenza e il manuale `:help` ha tutti i riferimenti di cui avrai mai bisogno.

Tuttavia, l'utente medio ha bisogno di qualcosa di più del `vimtutor` e di meno del manuale `:help`. Questa guida cerca di colmare quel divario evidenziando solo le caratteristiche chiave per imparare le parti più utili di Vim nel minor tempo possibile.

È probabile che tu non abbia bisogno del 100% delle funzionalità di Vim. Probabilmente hai solo bisogno di conoscere circa il 20% di esse per diventare un Vimmer potente. Questa guida ti mostrerà quali funzionalità di Vim troverai più utili.

Questa è una guida opinativa. Copre tecniche che uso spesso quando utilizzo Vim. I capitoli sono sequenziati in base a ciò che penso abbia più senso logico per un principiante che impara Vim.

Questa guida è ricca di esempi. Quando si impara una nuova abilità, gli esempi sono indispensabili; avere numerosi esempi solidificherà questi concetti in modo più efficace.

Alcuni di voi potrebbero chiedersi perché sia necessario imparare Vimscript? Nel mio primo anno di utilizzo di Vim, ero contento di sapere solo come usare Vim. Il tempo passò e iniziai a necessitare sempre di più di Vimscript per scrivere comandi personalizzati per le mie esigenze di editing specifiche. Mentre padroneggi Vim, prima o poi dovrai imparare Vimscript. Allora perché non prima? Vimscript è un linguaggio piccolo. Puoi impararne le basi in appena quattro capitoli di questa guida.

Puoi andare lontano usando Vim senza conoscere alcun Vimscript, ma conoscerlo ti aiuterà a eccellere ancora di più.

Questa guida è scritta sia per Vimmer principianti che avanzati. Inizia con concetti ampi e semplici e termina con concetti specifici e avanzati. Se sei già un utente avanzato, ti incoraggio a leggere questa guida dall'inizio alla fine comunque, perché imparerai qualcosa di nuovo!

## Come passare a Vim da un altro editor di testo

Imparare Vim è un'esperienza soddisfacente, sebbene difficile. Ci sono due approcci principali per imparare Vim:

1. Smettere di colpo
2. Graduale

Smettere di colpo significa smettere di usare qualsiasi editor / IDE tu stessi usando e utilizzare Vim esclusivamente da ora in poi. Lo svantaggio di questo metodo è che avrai una seria perdita di produttività durante la prima settimana o due. Se sei un programmatore a tempo pieno, questo metodo potrebbe non essere fattibile. Ecco perché per la maggior parte delle persone, credo che il modo migliore per passare a Vim sia usarlo gradualmente.

Per utilizzare Vim gradualmente, durante le prime due settimane, dedica un'ora al giorno a usare Vim come tuo editor mentre nel resto del tempo puoi usare altri editor. Molti editor moderni vengono forniti con plugin Vim. Quando ho iniziato, usavo il popolare plugin Vim di VSCode per un'ora al giorno. Ho gradualmente aumentato il tempo con il plugin Vim fino a usarlo tutto il giorno. Tieni presente che questi plugin possono solo emulare una frazione delle funzionalità di Vim. Per sperimentare la piena potenza di Vim come Vimscript, comandi della riga di comando (Ex) e integrazione di comandi esterni, dovrai usare Vim stesso.

Ci sono stati due momenti cruciali che mi hanno fatto iniziare a usare Vim al 100%: quando ho capito che Vim ha una struttura simile a una grammatica (vedi capitolo 4) e il plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (vedi capitolo 3).

Il primo, quando ho realizzato la struttura simile a una grammatica di Vim, è stato il momento decisivo in cui ho finalmente capito di cosa parlavano quegli utenti di Vim. Non avevo bisogno di imparare centinaia di comandi unici. Dovevo solo imparare un piccolo numero di comandi e potevo concatenarli in modo molto intuitivo per fare molte cose.

Il secondo, la possibilità di eseguire rapidamente una ricerca fuzzy di file, era la funzionalità dell'IDE che usavo di più. Quando ho imparato a farlo in Vim, ho guadagnato un notevole aumento di velocità e non ho mai guardato indietro da allora.

Ognuno programma in modo diverso. Dopo un'autoanalisi, scoprirai che ci sono una o due funzionalità del tuo editor / IDE preferito che usi sempre. Forse era la ricerca fuzzy, il salto alla definizione o la compilazione rapida. Qualunque esse siano, identificale rapidamente e impara come implementarle in Vim (è probabile che Vim possa farle anche). La tua velocità di editing riceverà un enorme impulso.

Una volta che puoi modificare al 50% della velocità originale, è tempo di passare a Vim a tempo pieno.

## Come leggere questa guida

Questa è una guida pratica. Per diventare bravi in Vim devi sviluppare la tua memoria muscolare, non solo conoscenze teoriche.

Non impari a andare in bicicletta leggendo una guida su come andare in bicicletta. Devi effettivamente andare in bicicletta.

Devi digitare ogni comando menzionato in questa guida. Non solo, ma devi ripeterli più volte e provare diverse combinazioni. Scopri quali altre funzionalità ha il comando che hai appena imparato. Il comando `:help` e i motori di ricerca sono i tuoi migliori amici. Il tuo obiettivo non è conoscere tutto su un comando, ma essere in grado di eseguire quel comando in modo naturale e istintivo.

Per quanto cerchi di rendere questa guida lineare, alcuni concetti in essa devono essere presentati in modo non sequenziale. Ad esempio, nel capitolo 1, menziono il comando di sostituzione (`:s`), anche se non verrà trattato fino al capitolo 12. Per rimediare a ciò, ogni volta che viene menzionato un nuovo concetto che non è stato ancora trattato, fornirò una rapida guida su come fare senza una spiegazione dettagliata. Quindi per favore abbi pazienza :).

## Ulteriore aiuto

Ecco un ulteriore consiglio su come utilizzare il manuale di aiuto: supponiamo che tu voglia saperne di più su cosa fa `Ctrl-P` in modalità di inserimento. Se cerchi semplicemente `:h CTRL-P`, verrai indirizzato a `Ctrl-P` in modalità normale. Questo non è l'aiuto di `Ctrl-P` che stai cercando. In questo caso, cerca invece `:h i_CTRL-P`. L'aggiunta di `i_` rappresenta la modalità di inserimento. Fai attenzione a quale modalità appartiene.

## Sintassi

La maggior parte delle frasi relative a comandi o codice sono in formato codice (`come questo`).

Le stringhe sono circondate da una coppia di virgolette doppie ("come questo").

I comandi Vim possono essere abbreviati. Ad esempio, `:join` può essere abbreviato come `:j`. In tutta la guida, mescolerò le descrizioni abbreviate e quelle lunghe. Per i comandi che non sono frequentemente usati in questa guida, utilizzerò la versione lunga. Per i comandi che sono frequentemente usati, utilizzerò la versione abbreviata. Mi scuso per le incoerenze. In generale, ogni volta che noti un nuovo comando, controlla sempre su `:help` per vedere le sue abbreviazioni.

## Vimrc

In vari punti della guida, farò riferimento alle opzioni vimrc. Se sei nuovo a Vim, un vimrc è come un file di configurazione.

Il vimrc non verrà trattato fino al capitolo 21. Per chiarezza, mostrerò brevemente qui come impostarlo.

Supponiamo che tu debba impostare l'opzione numero (`set number`). Se non hai già un vimrc, creane uno. Di solito si trova nella tua home directory e si chiama `.vimrc`. A seconda del tuo sistema operativo, la posizione potrebbe differire. Su macOS, lo tengo in `~/.vimrc`. Per vedere dove dovresti mettere il tuo, controlla `:h vimrc`.

All'interno, aggiungi `set number`. Salvalo (`:w`), quindi sorgente (`:source %`). Dovresti ora vedere i numeri di riga visualizzati sul lato sinistro.

In alternativa, se non vuoi apportare una modifica permanente alle impostazioni, puoi sempre eseguire il comando `set` in linea, eseguendo `:set number`. Lo svantaggio di questo approccio è che questa impostazione è temporanea. Quando chiudi Vim, l'opzione scompare.

Poiché stiamo imparando su Vim e non su Vi, un'impostazione che devi avere è l'opzione `nocompatible`. Aggiungi `set nocompatible` nel tuo vimrc. Molte funzionalità specifiche di Vim sono disabilitate quando viene eseguito con l'opzione `compatible`.

In generale, ogni volta che un passaggio menziona un'opzione vimrc, aggiungi semplicemente quell'opzione nel vimrc, salvala e sorgente.

## Futuro, errori, domande

Aspettati ulteriori aggiornamenti in futuro. Se trovi errori o hai domande, sentiti libero di contattarmi.

Ho anche pianificato alcuni capitoli futuri, quindi resta sintonizzato!

## Voglio più trucchi di Vim

Per saperne di più su Vim, segui [@learnvim](https://twitter.com/learnvim).

## Ringraziamenti

Questa guida non sarebbe stata possibile senza Bram Moleenar per aver creato Vim, mia moglie che è stata molto paziente e di supporto durante il percorso, tutti i [contributori](https://github.com/iggredible/Learn-Vim/graphs/contributors) del progetto learn-vim, la comunità di Vim e molti, molti altri che non sono stati menzionati.

Grazie. Tutti voi aiutate a rendere l'editing di testo divertente :)