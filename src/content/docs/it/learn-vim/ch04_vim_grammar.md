---
description: Questo capitolo spiega la struttura grammaticale dei comandi Vim, aiutando
  gli utenti a comprendere e utilizzare il linguaggio di Vim con facilità.
title: Ch04. Vim Grammar
---

È facile sentirsi intimiditi dalla complessità dei comandi di Vim. Se vedi un utente di Vim fare `gUfV` o `1GdG`, potresti non sapere immediatamente cosa fanno questi comandi. In questo capitolo, scomporrò la struttura generale dei comandi di Vim in una semplice regola grammaticale.

Questo è il capitolo più importante dell'intera guida. Una volta che comprenderai la struttura grammaticale sottostante, sarai in grado di "parlare" con Vim. A proposito, quando dico *lingua Vim* in questo capitolo, non sto parlando del linguaggio Vimscript (il linguaggio di programmazione integrato di Vim, che imparerai nei capitoli successivi).

## Come Imparare una Lingua

Non sono un madrelingua inglese. Ho imparato l'inglese quando avevo 13 anni, quando mi sono trasferito negli Stati Uniti. Ci sono tre cose che devi fare per imparare a parlare una nuova lingua:

1. Imparare le regole grammaticali.
2. Aumentare il vocabolario.
3. Praticare, praticare, praticare.

Allo stesso modo, per parlare la lingua di Vim, devi imparare le regole grammaticali, aumentare il vocabolario e praticare fino a poter eseguire i comandi senza pensare.

## Regola Grammaticale

C'è solo una regola grammaticale nella lingua di Vim:

```shell
verbo + sostantivo
```

Ecco tutto!

È come dire queste frasi in inglese:

- *"Mangiare (verbo) una ciambella (sostantivo)"*
- *"Calciare (verbo) una palla (sostantivo)"*
- *"Imparare (verbo) l'editor Vim (sostantivo)"*

Ora devi costruire il tuo vocabolario con verbi e sostantivi di base di Vim.

## Sostantivi (Movimenti)

I sostantivi sono i movimenti di Vim. I movimenti vengono utilizzati per muoversi all'interno di Vim. Di seguito è riportato un elenco di alcuni movimenti di Vim:

```shell
h    Sinistra
j    Giù
k    Su
l    Destra
w    Muoviti in avanti all'inizio della prossima parola
}    Salta al prossimo paragrafo
$    Vai alla fine della riga
```

Imparerai di più sui movimenti nel capitolo successivo, quindi non preoccuparti troppo se non ne comprendi alcuni.

## Verbi (Operatori)

Secondo `:h operator`, Vim ha 16 operatori. Tuttavia, nella mia esperienza, imparare questi 3 operatori è sufficiente per l'80% delle mie esigenze di editing:

```shell
y    Copia il testo (yank)
d    Elimina il testo e salva nel registro
c    Elimina il testo, salva nel registro e avvia la modalità di inserimento
```

A proposito, dopo aver copiato un testo, puoi incollarlo con `p` (dopo il cursore) o `P` (prima del cursore).

## Verbo e Sostantivo

Ora che conosci i sostantivi e i verbi di base, applichiamo la regola grammaticale, verbo + sostantivo! Supponiamo che tu abbia questa espressione:

```javascript
const learn = "vim";
```

- Per copiare tutto dalla tua posizione attuale fino alla fine della riga: `y$`.
- Per eliminare dalla tua posizione attuale all'inizio della prossima parola: `dw`.
- Per cambiare dalla tua posizione attuale alla fine del paragrafo corrente, digita `c}`.

I movimenti accettano anche numeri di conteggio come argomenti (ne parlerò nel capitolo successivo). Se devi andare su per 3 righe, invece di premere `k` 3 volte, puoi fare `3k`. Il conteggio funziona con la grammatica di Vim.
- Per copiare due caratteri a sinistra: `y2h`.
- Per eliminare le prossime due parole: `d2w`.
- Per cambiare le prossime due righe: `c2j`.

In questo momento, potresti dover pensare a lungo e duramente per eseguire anche un semplice comando. Non sei solo. Quando ho iniziato, ho avuto difficoltà simili, ma sono diventato più veloce col tempo. Anche tu lo sarai. Ripetizione, ripetizione, ripetizione.

A proposito, le operazioni su righe (operazioni che influenzano l'intera riga) sono operazioni comuni nell'editing di testo. In generale, digitando un comando operatore due volte, Vim esegue un'operazione su riga per quell'azione. Ad esempio, `dd`, `yy` e `cc` eseguono **eliminazione**, **copia** e **cambio** sull'intera riga. Prova questo con altri operatori!

Questo è davvero interessante. Sto vedendo un modello qui. Ma non ho ancora finito. Vim ha un altro tipo di sostantivo: oggetti di testo.

## Altri Sostantivi (Oggetti di Testo)

Immagina di essere da qualche parte all'interno di una coppia di parentesi come `(hello Vim)` e devi eliminare l'intera frase all'interno delle parentesi. Come puoi farlo rapidamente? C'è un modo per eliminare il "gruppo" in cui ti trovi?

La risposta è sì. I testi spesso sono strutturati. Contengono spesso parentesi, virgolette, parentesi quadre, parentesi graffe e altro. Vim ha un modo per catturare questa struttura con gli oggetti di testo.

Gli oggetti di testo vengono utilizzati con gli operatori. Ci sono due tipi di oggetti di testo: oggetti di testo interni ed esterni.

```shell
i + oggetto    Oggetto di testo interno
a + oggetto    Oggetto di testo esterno
```

L'oggetto di testo interno seleziona l'oggetto all'interno *senza* gli spazi bianchi o gli oggetti circostanti. L'oggetto di testo esterno seleziona l'oggetto all'interno *includendo* gli spazi bianchi o gli oggetti circostanti. In generale, un oggetto di testo esterno seleziona sempre più testo di un oggetto di testo interno. Se il tuo cursore si trova da qualche parte all'interno delle parentesi nell'espressione `(hello Vim)`:
- Per eliminare il testo all'interno delle parentesi senza eliminare le parentesi: `di(`.
- Per eliminare le parentesi e il testo all'interno: `da(`.

Vediamo un esempio diverso. Supponiamo che tu abbia questa funzione Javascript e il tuo cursore sia sulla "H" di "Hello":

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Per eliminare l'intero "Hello Vim": `di(`.
- Per eliminare il contenuto della funzione (circondato da `{}`): `di{`.
- Per eliminare la stringa "Hello": `diw`.

Gli oggetti di testo sono potenti perché puoi mirare a diversi oggetti da una posizione. Puoi eliminare gli oggetti all'interno delle parentesi, il blocco della funzione o la parola corrente. Mnemonicamente, quando vedi `di(`, `di{` e `diw`, hai un'idea piuttosto chiara di quali oggetti di testo rappresentano: una coppia di parentesi, una coppia di parentesi graffe e una parola.

Vediamo un ultimo esempio. Supponiamo che tu abbia questi tag HTML:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Se il tuo cursore è sul testo "Header1":
- Per eliminare "Header1": `dit`.
- Per eliminare `<h1>Header1</h1>`: `dat`.

Se il tuo cursore è su "div":
- Per eliminare `h1` e entrambe le righe `p`: `dit`.
- Per eliminare tutto: `dat`.
- Per eliminare "div": `di<`.

Di seguito è riportato un elenco di oggetti di testo comuni:

```shell
w         Una parola
p         Un paragrafo
s         Una frase
( o )     Una coppia di ( )
{ o }     Una coppia di { }
[ o ]     Una coppia di [ ]
< o >     Una coppia di < >
t         Tag XML
"         Una coppia di " "
'         Una coppia di ' '
`         Una coppia di ` `
```

Per saperne di più, controlla `:h text-objects`.

## Componibilità e Grammatica

La grammatica di Vim è un sottoinsieme della funzionalità di componibilità di Vim. Discutiamo della componibilità in Vim e perché questa è una grande caratteristica da avere in un editor di testo.

La componibilità significa avere un insieme di comandi generali che possono essere combinati (composti) per eseguire comandi più complessi. Proprio come nella programmazione, dove puoi creare astrazioni più complesse da astrazioni più semplici, in Vim puoi eseguire comandi complessi da comandi più semplici. La grammatica di Vim è la manifestazione della natura componibile di Vim.

Il vero potere della componibilità di Vim si manifesta quando si integra con programmi esterni. Vim ha un operatore di filtro (`!`) per utilizzare programmi esterni come filtri per i nostri testi. Supponiamo che tu abbia questo testo disordinato qui sotto e vuoi tabularizzarlo:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Questo non può essere facilmente fatto con i comandi di Vim, ma puoi farlo rapidamente con il comando terminale `column` (supponendo che il tuo terminale abbia il comando `column`). Con il cursore su "Id", esegui `!}column -t -s "|"`. Voila! Ora hai questi dati tabulari carini con un solo comando veloce.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Scomponiamo il comando. Il verbo era `!` (operatore di filtro) e il sostantivo era `}` (vai al prossimo paragrafo). L'operatore di filtro `!` ha accettato un altro argomento, un comando terminale, quindi gli ho dato `column -t -s "|"`. Non spiegherò come ha funzionato `column`, ma in effetti, ha tabularizzato il testo.

Supponiamo che tu voglia non solo tabularizzare il tuo testo, ma anche visualizzare solo le righe con "Ok". Sai che `awk` può svolgere facilmente il compito. Puoi fare invece:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Risultato:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Ottimo! L'operatore di comando esterno può anche utilizzare la pipe (`|`).

Questo è il potere della componibilità di Vim. Più conosci i tuoi operatori, movimenti e comandi terminali, la tua capacità di comporre azioni complesse è *moltiplicata*.

Supponiamo che tu conosca solo quattro movimenti, `w, $, }, G` e solo un operatore, `d`. Puoi fare 8 azioni: *muovere* in 4 modi diversi (`w, $, }, G`) e *eliminare* 4 obiettivi diversi (`dw, d$, d}, dG`). Poi un giorno impari a conoscere l'operatore maiuscolo (`gU`). Hai aggiunto non solo una nuova abilità al tuo arsenale di Vim, ma *quattro*: `gUw, gU$, gU}, gUG`. Questo porta a 12 strumenti nel tuo arsenale di Vim. Ogni nuova conoscenza è un moltiplicatore delle tue attuali abilità. Se conosci 10 movimenti e 5 operatori, hai 60 mosse (50 operazioni + 10 movimenti) nel tuo arsenale. Vim ha un movimento di numero di riga (`nG`) che ti dà `n` movimenti, dove `n` è quante righe hai nel tuo file (per andare alla riga 5, esegui `5G`). Il movimento di ricerca (`/`) ti dà praticamente un numero illimitato di movimenti perché puoi cercare qualsiasi cosa. L'operatore di comando esterno (`!`) ti offre tanti strumenti di filtraggio quanti sono i comandi terminali che conosci. Utilizzando uno strumento componibile come Vim, tutto ciò che sai può essere collegato insieme per eseguire operazioni con complessità crescente. Più sai, più potente diventi.

Questo comportamento componibile riecheggia la filosofia Unix: *fai una cosa bene*. Un operatore ha un compito: fare Y. Un movimento ha un compito: andare a X. Combinando un operatore con un movimento, ottieni prevedibilmente YX: fare Y su X.

I movimenti e gli operatori sono estendibili. Puoi creare movimenti e operatori personalizzati da aggiungere al tuo arsenale di Vim. Il plugin [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) ti consente di creare i tuoi oggetti di testo. Contiene anche un [elenco](https://github.com/kana/vim-textobj-user/wiki) di oggetti di testo personalizzati creati dagli utenti.

## Impara la Grammatica di Vim in Modo Intelligente

Hai appena appreso la regola della grammatica di Vim: `verbo + sostantivo`. Uno dei miei più grandi momenti "AHA!" con Vim è stato quando avevo appena imparato a conoscere l'operatore maiuscolo (`gU`) e volevo mettere in maiuscolo la parola corrente, ho *istintivamente* eseguito `gUiw` ed ha funzionato! La parola è stata messa in maiuscolo. In quel momento, ho finalmente iniziato a comprendere Vim. La mia speranza è che tu abbia il tuo momento "AHA!" presto, se non l'hai già avuto.

L'obiettivo di questo capitolo è mostrarti il modello `verbo + sostantivo` in Vim in modo che tu possa affrontare l'apprendimento di Vim come l'apprendimento di una nuova lingua invece di memorizzare ogni combinazione di comandi.

Impara il modello e comprendi le implicazioni. Questo è il modo intelligente per imparare.