---
description: Questo documento spiega i concetti di buffer, finestre e schede in Vim,
  fornendo istruzioni su come configurare l'opzione `set hidden` nel vimrc.
title: Ch02. Buffers, Windows, and Tabs
---

Se hai usato un editor di testo moderno prima, probabilmente sei familiare con finestre e schede. Vim utilizza tre astrazioni di visualizzazione invece di due: buffer, finestre e schede. In questo capitolo, spiegherò cosa sono i buffer, le finestre e le schede e come funzionano in Vim.

Prima di iniziare, assicurati di avere l'opzione `set hidden` nel vimrc. Senza di essa, ogni volta che cambi buffer e il tuo buffer attuale non è salvato, Vim ti chiederà di salvare il file (non vuoi questo se desideri muoverti rapidamente). Non ho ancora trattato vimrc. Se non hai un vimrc, creane uno. Di solito si trova nella tua home directory e si chiama `.vimrc`. Io ho il mio in `~/.vimrc`. Per vedere dove dovresti creare il tuo vimrc, controlla `:h vimrc`. All'interno, aggiungi:

```shell
set hidden
```

Salvalo, poi sorgente (esegui `:source %` dall'interno del vimrc).

## Buffer

Cos'è un *buffer*?

Un buffer è uno spazio in memoria dove puoi scrivere e modificare del testo. Quando apri un file in Vim, i dati sono legati a un buffer. Quando apri 3 file in Vim, hai 3 buffer.

Avere due file vuoti, `file1.js` e `file2.js` disponibili (se possibile, creali con Vim). Esegui questo nel terminale:

```bash
vim file1.js
```

Quello che stai vedendo è il *buffer* di `file1.js`. Ogni volta che apri un nuovo file, Vim crea un nuovo buffer.

Esci da Vim. Questa volta, apri due nuovi file:

```bash
vim file1.js file2.js
```

Vim attualmente visualizza il buffer di `file1.js`, ma in realtà crea due buffer: il buffer di `file1.js` e il buffer di `file2.js`. Esegui `:buffers` per vedere tutti i buffer (in alternativa, puoi usare anche `:ls` o `:files`). Dovresti vedere *entrambi* `file1.js` e `file2.js` elencati. Eseguire `vim file1 file2 file3 ... filen` crea n buffer. Ogni volta che apri un nuovo file, Vim crea un nuovo buffer per quel file.

Ci sono diversi modi per navigare tra i buffer:
- `:bnext` per andare al buffer successivo (`:bprevious` per andare al buffer precedente).
- `:buffer` + nomefile. Vim può completare automaticamente il nomefile con `<Tab>`.
- `:buffer` + `n`, dove `n` è il numero del buffer. Ad esempio, digitando `:buffer 2` ti porterà al buffer #2.
- Salta alla posizione più vecchia nella lista dei salti con `Ctrl-O` e alla posizione più recente con `Ctrl-I`. Questi non sono metodi specifici per i buffer, ma possono essere usati per saltare tra diversi buffer. Spiegherò i salti in ulteriori dettagli nel Capitolo 5.
- Vai al buffer precedentemente modificato con `Ctrl-^`.

Una volta che Vim crea un buffer, rimarrà nella tua lista di buffer. Per rimuoverlo, puoi digitare `:bdelete`. Può anche accettare un numero di buffer come parametro (`:bdelete 3` per eliminare il buffer #3) o un nomefile (`:bdelete` poi usa `<Tab>` per completare automaticamente).

La cosa più difficile per me quando ho imparato sui buffer è stata visualizzare come funzionassero perché la mia mente era abituata alle finestre quando usavo un editor di testo mainstream. Una buona analogia è un mazzo di carte da gioco. Se ho 2 buffer, ho un mazzo di 2 carte. La carta in cima è l'unica carta che vedo, ma so che ci sono carte sotto di essa. Se vedo il buffer di `file1.js` visualizzato, allora la carta di `file1.js` è in cima al mazzo. Non posso vedere l'altra carta, `file2.js` qui, ma è lì. Se cambio buffer a `file2.js`, quella carta di `file2.js` è ora in cima al mazzo e la carta di `file1.js` è sotto di essa.

Se non hai mai usato Vim prima, questo è un concetto nuovo. Prenditi il tuo tempo per capirlo.

## Uscire da Vim

A proposito, se hai più buffer aperti, puoi chiuderli tutti con quit-all:

```shell
:qall
```

Se vuoi chiudere senza salvare le tue modifiche, aggiungi semplicemente `!` alla fine:

```shell
:qall!
```

Per salvare e chiudere tutto, esegui:

```shell
:wqall
```

## Finestre

Una finestra è un'area di visualizzazione su un buffer. Se provieni da un editor mainstream, questo concetto potrebbe esserti familiare. La maggior parte degli editor di testo ha la capacità di visualizzare più finestre. In Vim, puoi anche avere più finestre.

Apriamo di nuovo `file1.js` dal terminale:

```bash
vim file1.js
```

In precedenza ho scritto che stai guardando il buffer di `file1.js`. Anche se era corretto, quella affermazione era incompleta. Stai guardando il buffer di `file1.js`, visualizzato attraverso **una finestra**. Una finestra è come stai visualizzando un buffer.

Non uscire ancora da Vim. Esegui:

```shell
:split file2.js
```

Ora stai guardando due buffer attraverso **due finestre**. La finestra superiore visualizza il buffer di `file2.js`. La finestra inferiore visualizza il buffer di `file1.js`.

Se vuoi navigare tra le finestre, usa queste scorciatoie:

```shell
Ctrl-W H    Sposta il cursore nella finestra a sinistra
Ctrl-W J    Sposta il cursore nella finestra sottostante
Ctrl-W K    Sposta il cursore nella finestra superiore
Ctrl-W L    Sposta il cursore nella finestra a destra
```

Ora esegui:

```shell
:vsplit file3.js
```

Ora stai vedendo tre finestre che visualizzano tre buffer. Una finestra visualizza il buffer di `file3.js`, un'altra finestra visualizza il buffer di `file2.js` e un'altra finestra visualizza il buffer di `file1.js`.

Puoi avere più finestre che visualizzano lo stesso buffer. Mentre sei sulla finestra in alto a sinistra, digita:

```shell
:buffer file2.js
```

Ora entrambe le finestre visualizzano il buffer di `file2.js`. Se inizi a digitare in una finestra di `file2.js`, vedrai che entrambe le finestre che visualizzano i buffer di `file2.js` vengono aggiornate in tempo reale.

Per chiudere la finestra corrente, puoi eseguire `Ctrl-W C` o digitare `:quit`. Quando chiudi una finestra, il buffer sarà ancora lì (esegui `:buffers` per confermare questo).

Ecco alcuni comandi utili per le finestre in modalità normale:

```shell
Ctrl-W V    Apre un nuovo split verticale
Ctrl-W S    Apre un nuovo split orizzontale
Ctrl-W C    Chiude una finestra
Ctrl-W O    Rende la finestra corrente l'unica sullo schermo e chiude le altre finestre
```

Ecco un elenco di comandi utili per la riga di comando delle finestre:

```shell
:vsplit nomefile    Dividi la finestra verticalmente
:split nomefile     Dividi la finestra orizzontalmente
:new nomefile       Crea una nuova finestra
```

Prenditi il tuo tempo per comprenderli. Per ulteriori informazioni, controlla `:h window`.

## Schede

Una scheda è una raccolta di finestre. Pensala come un layout per finestre. Nella maggior parte degli editor di testo moderni (e nei moderni browser internet), una scheda significa un file / pagina aperta e quando la chiudi, quel file / pagina scompare. In Vim, una scheda non rappresenta un file aperto. Quando chiudi una scheda in Vim, non stai chiudendo un file. Stai solo chiudendo il layout. I file aperti in quel layout non sono ancora chiusi, sono ancora aperti nei loro buffer.

Vediamo le schede di Vim in azione. Apri `file1.js`:

```bash
vim file1.js
```

Per aprire `file2.js` in una nuova scheda:

```shell
:tabnew file2.js
```

Puoi anche lasciare che Vim completi automaticamente il file che desideri aprire in una *nuova scheda* premendo `<Tab>` (senza doppi sensi).

Di seguito è riportato un elenco di utili navigazioni delle schede:

```shell
:tabnew file.txt    Apri file.txt in una nuova scheda
:tabclose           Chiudi la scheda corrente
:tabnext            Vai alla scheda successiva
:tabprevious        Vai alla scheda precedente
:tablast            Vai all'ultima scheda
:tabfirst           Vai alla prima scheda
```

Puoi anche eseguire `gt` per andare alla pagina della scheda successiva (puoi andare alla scheda precedente con `gT`). Puoi passare un conteggio come argomento a `gt`, dove il conteggio è il numero della scheda. Per andare alla terza scheda, fai `3gt`.

Un vantaggio di avere più schede è che puoi avere diverse disposizioni delle finestre in diverse schede. Forse vuoi che la tua prima scheda abbia 3 finestre verticali e la seconda scheda abbia un layout misto di finestre orizzontali e verticali. La scheda è lo strumento perfetto per il lavoro!

Per avviare Vim con più schede, puoi farlo dal terminale:

```bash
vim -p file1.js file2.js file3.js
```

## Muoversi in 3D

Muoversi tra le finestre è come viaggiare in due dimensioni lungo l'asse X-Y nelle coordinate cartesiane. Puoi muoverti verso la finestra superiore, destra, inferiore e sinistra con `Ctrl-W H/J/K/L`.

Muoversi tra i buffer è come viaggiare lungo l'asse Z nelle coordinate cartesiane. Immagina i tuoi file buffer allineati lungo l'asse Z. Puoi attraversare l'asse Z un buffer alla volta con `:bnext` e `:bprevious`. Puoi saltare a qualsiasi coordinata nell'asse Z con `:buffer nomefile/numerobuffer`.

Puoi muoverti in *spazio tridimensionale* combinando i movimenti delle finestre e dei buffer. Puoi muoverti verso la finestra superiore, destra, inferiore o sinistra (navigazioni X-Y) con i movimenti delle finestre. Poiché ogni finestra contiene buffer, puoi muoverti avanti e indietro (navigazioni Z) con i movimenti dei buffer.

## Usare Buffer, Finestre e Schede in Modo Intelligente

Hai appreso cosa sono i buffer, le finestre e le schede e come funzionano in Vim. Ora che li comprendi meglio, puoi usarli nel tuo flusso di lavoro.

Ognuno ha un flusso di lavoro diverso, ecco il mio ad esempio:
- Prima di tutto, uso i buffer per memorizzare tutti i file necessari per il compito attuale. Vim può gestire molti buffer aperti prima di iniziare a rallentare. Inoltre, avere molti buffer aperti non affollerà il mio schermo. Vedo solo un buffer (supponendo di avere solo una finestra) in qualsiasi momento, permettendomi di concentrarmi su uno schermo. Quando ho bisogno di andare da qualche parte, posso rapidamente volare a qualsiasi buffer aperto in qualsiasi momento.
- Uso più finestre per visualizzare più buffer contemporaneamente, di solito quando confronto file, leggo documenti o seguo un flusso di codice. Cerco di mantenere il numero di finestre aperte a non più di tre perché il mio schermo si affollerà (uso un laptop piccolo). Quando ho finito, chiudo eventuali finestre extra. Meno finestre significano meno distrazioni.
- Invece delle schede, uso le finestre di [tmux](https://github.com/tmux/tmux/wiki). Di solito uso più finestre tmux contemporaneamente. Ad esempio, una finestra tmux per il codice lato client e un'altra per il codice backend.

Il mio flusso di lavoro potrebbe apparire diverso dal tuo in base al tuo stile di modifica e va bene. Sperimenta per scoprire il tuo flusso, adatto al tuo stile di codifica.