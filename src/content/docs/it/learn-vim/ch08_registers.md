---
description: Impara a utilizzare i registri di Vim, scopri i 10 tipi e come possono
  semplificare il tuo lavoro, evitando la digitazione ripetitiva.
title: Ch08. Registers
---

Imparare i registri di Vim è come imparare l'algebra per la prima volta. Non pensavi di averne bisogno fino a quando non ne hai avuto bisogno.

Probabilmente hai usato i registri di Vim quando hai copiato o eliminato un testo e poi l'hai incollato con `p` o `P`. Tuttavia, sapevi che Vim ha 10 diversi tipi di registri? Usati correttamente, i registri di Vim possono salvarti dalla digitazione ripetitiva.

In questo capitolo, esaminerò tutti i tipi di registri di Vim e come usarli in modo efficiente.

## I Dieci Tipi di Registro

Ecco i 10 tipi di registri di Vim:

1. Il registro senza nome (`""`).
2. I registri numerati (`"0-9`).
3. Il registro di cancellazione piccolo (`"-`).
4. I registri nominati (`"a-z`).
5. I registri di sola lettura (`":`, `".`, e `"%`).
6. Il registro del file alternativo (`"#`).
7. Il registro delle espressioni (`"=`).
8. I registri di selezione (`"*` e `"+`).
9. Il registro del buco nero (`"_`).
10. Il registro dell'ultimo modello di ricerca (`"/`).

## Operatori di Registro

Per usare i registri, devi prima memorizzarli con gli operatori. Ecco alcuni operatori che memorizzano valori nei registri:

```shell
y    Copia (yank)
c    Elimina il testo e inizia la modalità di inserimento
d    Elimina il testo
```

Ci sono più operatori (come `s` o `x`), ma quelli sopra sono i più utili. La regola generale è che, se un operatore può rimuovere un testo, probabilmente memorizza il testo nei registri.

Per incollare un testo dai registri, puoi usare:

```shell
p    Incolla il testo dopo il cursore
P    Incolla il testo prima del cursore
```

Sia `p` che `P` accettano un conteggio e un simbolo di registro come argomenti. Ad esempio, per incollare dieci volte, fai `10p`. Per incollare il testo dal registro a, fai `"ap`. Per incollare il testo dal registro a dieci volte, fai `10"ap`. A proposito, `p` in realtà sta tecnicamente per "put", non "paste", ma penso che "incolla" sia una parola più convenzionale.

La sintassi generale per ottenere il contenuto da un registro specifico è `"a`, dove `a` è il simbolo del registro.

## Chiamare i Registri dalla Modalità di Inserimento

Tutto ciò che impari in questo capitolo può essere eseguito anche in modalità di inserimento. Per ottenere il testo dal registro a, normalmente fai `"ap`. Ma se sei in modalità di inserimento, esegui `Ctrl-R a`. La sintassi per chiamare i registri dalla modalità di inserimento è:

```shell
Ctrl-R a
```

Dove `a` è il simbolo del registro. Ora che sai come memorizzare e recuperare i registri, tuffiamoci!

## Il Registro Senza Nome

Per ottenere il testo dal registro senza nome, fai `""p`. Memorizza l'ultimo testo che hai copiato, modificato o eliminato. Se fai un'altra copia, modifica o elimina, Vim sostituirà automaticamente il vecchio testo. Il registro senza nome è come l'operazione standard di copia / incolla di un computer.

Per impostazione predefinita, `p` (o `P`) è collegato al registro senza nome (d'ora in poi mi riferirò al registro senza nome con `p` invece di `""p`).

## I Registri Numerati

I registri numerati si riempiono automaticamente in ordine crescente. Ci sono 2 diversi registri numerati: il registro copiato (`0`) e i registri numerati (`1-9`). Discutiamo prima del registro copiato.

### Il Registro Copiato

Se copi un'intera riga di testo (`yy`), Vim salva effettivamente quel testo in due registri:

1. Il registro senza nome (`p`).
2. Il registro copiato (`"0p`).

Quando copi un testo diverso, Vim aggiornerà sia il registro copiato che il registro senza nome. Qualsiasi altra operazione (come l'eliminazione) non verrà memorizzata nel registro 0. Questo può essere usato a tuo favore, perché a meno che tu non faccia un'altra copia, il testo copiato sarà sempre lì, indipendentemente da quante modifiche ed eliminazioni fai.

Ad esempio, se:
1. Copi una riga (`yy`)
2. Elimini una riga (`dd`)
3. Elimini un'altra riga (`dd`)

Il registro copiato avrà il testo dal primo passo.

Se:
1. Copi una riga (`yy`)
2. Elimini una riga (`dd`)
3. Copi un'altra riga (`yy`)

Il registro copiato avrà il testo dal terzo passo.

Un ultimo consiglio, mentre sei in modalità di inserimento, puoi incollare rapidamente il testo che hai appena copiato usando `Ctrl-R 0`.

### I Registri Numerati Non Zero

Quando cambi o elimini un testo lungo almeno una riga, quel testo verrà memorizzato nei registri numerati 1-9 ordinati per il più recente.

Ad esempio, se hai queste righe:

```shell
line tre
line due
line uno
```

Con il cursore su "line tre", eliminale una alla volta con `dd`. Una volta eliminate tutte le righe, il registro 1 dovrebbe contenere "line uno" (il più recente), il registro due "line due" (secondo più recente), e il registro tre "line tre" (il più vecchio). Per ottenere il contenuto dal registro uno, fai `"1p`.

A proposito, questi registri numerati vengono automaticamente incrementati quando usi il comando punto. Se il tuo registro numerato uno (`"1`) contiene "line uno", il registro due (`"2`) "line due", e il registro tre (`"3`) "line tre", puoi incollarli sequenzialmente con questo trucco:
- Fai `"1P` per incollare il contenuto dal registro numerato uno ("1).
- Fai `.` per incollare il contenuto dal registro numerato due ("2).
- Fai `.` per incollare il contenuto dal registro numerato tre ("3).

Questo trucco funziona con qualsiasi registro numerato. Se inizi con `"5P`,  `.`  farebbe `"6P`, `.` di nuovo farebbe `"7P`, e così via.

Piccole eliminazioni come l'eliminazione di una parola (`dw`) o la modifica di una parola (`cw`) non vengono memorizzate nei registri numerati. Vengono memorizzate nel registro di cancellazione piccolo (`"-`), di cui parlerò ora.

## Il Registro di Cancellazione Piccolo

Modifiche o eliminazioni inferiori a una riga non vengono memorizzate nei registri numerati 0-9, ma nel registro di cancellazione piccolo (`"-`).

Ad esempio:
1. Elimina una parola (`diw`)
2. Elimina una riga (`dd`)
3. Elimina una riga (`dd`)

`"-p` ti darà la parola eliminata dal primo passo.

Un altro esempio:
1. Elimino una parola (`diw`)
2. Elimino una riga (`dd`)
3. Elimino una parola (`diw`)

`"-p` ti darà la parola eliminata dal terzo passo. `"1p` ti darà la riga eliminata dal secondo passo. Sfortunatamente, non c'è modo di recuperare la parola eliminata dal primo passo perché il registro di cancellazione piccolo memorizza solo un elemento. Tuttavia, se vuoi preservare il testo dal primo passo, puoi farlo con i registri nominati.

## Il Registro Nominato

I registri nominati sono il registro più versatile di Vim. Possono memorizzare testi copiati, modificati ed eliminati nei registri a-z. A differenza dei precedenti 3 tipi di registri che hai visto, che memorizzano automaticamente i testi nei registri, devi esplicitamente dire a Vim di usare il registro nominato, dandoti pieno controllo.

Per copiare una parola nel registro a, puoi farlo con `"ayiw`.
- `"a` dice a Vim che la prossima azione (elimina / modifica / copia) sarà memorizzata nel registro a.
- `yiw` copia la parola.

Per ottenere il testo dal registro a, esegui `"ap`. Puoi usare tutti e ventisei i caratteri alfabetici per memorizzare ventisei testi diversi con i registri nominati.

A volte potresti voler aggiungere al tuo registro nominato esistente. In questo caso, puoi aggiungere il tuo testo invece di ricominciare da capo. Per farlo, puoi usare la versione maiuscola di quel registro. Ad esempio, supponiamo che tu abbia già memorizzato la parola "Ciao " nel registro a. Se vuoi aggiungere "mondo" nel registro a, puoi trovare il testo "mondo" e copiarlo usando il registro A (`"Ayiw`).

## I Registri di Sola Lettura

Vim ha tre registri di sola lettura: `.`, `:`, e `%`. Sono abbastanza semplici da usare:

```shell
.    Memorizza l'ultimo testo inserito
:    Memorizza l'ultimo comando eseguito
%    Memorizza il nome del file corrente
```

Se l'ultimo testo che hai scritto era "Ciao Vim", eseguendo `".p` stamperà il testo "Ciao Vim". Se vuoi ottenere il nome del file corrente, esegui `"%p`. Se esegui il comando `:s/foo/bar/g`, eseguendo `":p` stamperà il testo letterale "s/foo/bar/g".

## Il Registro del File Alternativo

In Vim, `#` rappresenta solitamente il file alternativo. Un file alternativo è l'ultimo file che hai aperto. Per inserire il nome del file alternativo, puoi usare `"#p`.

## Il Registro delle Espressioni

Vim ha un registro delle espressioni, `"=`, per valutare espressioni.

Per valutare espressioni matematiche `1 + 1`, esegui:

```shell
"=1+1<Enter>p
```

Qui, stai dicendo a Vim che stai usando il registro delle espressioni con `"=`. La tua espressione è (`1 + 1`). Devi digitare `p` per ottenere il risultato. Come accennato in precedenza, puoi anche accedere al registro dalla modalità di inserimento. Per valutare l'espressione matematica dalla modalità di inserimento, puoi fare:

```shell
Ctrl-R =1+1
```

Puoi anche ottenere i valori da qualsiasi registro tramite il registro delle espressioni quando è appeso con `@`. Se desideri ottenere il testo dal registro a:

```shell
"=@a
```

Poi premi `<Enter>`, poi `p`. Allo stesso modo, per ottenere valori dal registro a mentre sei in modalità di inserimento:

```shell
Ctrl-r =@a
```

Le espressioni sono un argomento vasto in Vim, quindi coprirò solo le basi qui. Affronterò le espressioni in modo più dettagliato nei successivi capitoli di Vimscript.

## I Registri di Selezione

Non desideri a volte poter copiare un testo da programmi esterni e incollarlo localmente in Vim, e viceversa? Con i registri di selezione di Vim, puoi. Vim ha due registri di selezione: `quotestar` (`"*`) e `quoteplus` (`"+`). Puoi usarli per accedere al testo copiato da programmi esterni.

Se sei su un programma esterno (come il browser Chrome) e copi un blocco di testo con `Ctrl-C` (o `Cmd-C`, a seconda del tuo sistema operativo), normalmente non saresti in grado di usare `p` per incollare il testo in Vim. Tuttavia, sia `"+` che `"*` di Vim sono collegati al tuo appunti, quindi puoi effettivamente incollare il testo con `"+p` o `"*p`. Al contrario, se copi una parola da Vim con `"+yiw` o `"*yiw`, puoi incollare quel testo nel programma esterno con `Ctrl-V` (o `Cmd-V`). Nota che questo funziona solo se il tuo programma Vim è dotato dell'opzione `+clipboard` (per controllarlo, esegui `:version`).

Potresti chiederti se `"*` e `"+` fanno la stessa cosa, perché Vim ha due registri diversi? Alcune macchine utilizzano il sistema di finestre X11. Questo sistema ha 3 tipi di selezioni: primaria, secondaria e appunti. Se la tua macchina utilizza X11, Vim utilizza la selezione *primaria* di X11 con il registro `quotestar` (`"*`) e la selezione *appunti* di X11 con il registro `quoteplus` (`"+`). Questo è applicabile solo se hai l'opzione `+xterm_clipboard` disponibile nella tua build di Vim. Se il tuo Vim non ha `xterm_clipboard`, non è un grosso problema. Significa solo che sia `quotestar` che `quoteplus` sono intercambiabili (neanche il mio ce l'ha).

Trovo che fare `=*p` o `=+p` (o `"*p` o `"+p`) sia scomodo. Per far sì che Vim incolli il testo copiato dal programma esterno con solo `p`, puoi aggiungere questo nel tuo vimrc:

```shell
set clipboard=unnamed
```

Ora, quando copio un testo da un programma esterno, posso incollarlo con il registro senza nome, `p`. Posso anche copiare un testo da Vim e incollarlo in un programma esterno. Se hai `+xterm_clipboard` attivo, potresti voler usare entrambe le opzioni di appunti `unnamed` e `unnamedplus`.

## Il Registro del Buco Nero

Ogni volta che elimini o cambi un testo, quel testo viene memorizzato automaticamente nel registro di Vim. Ci saranno momenti in cui non vuoi salvare nulla nel registro. Come puoi fare?

Puoi usare il registro del buco nero (`"_`). Per eliminare una riga e non far memorizzare a Vim la riga eliminata in alcun registro, usa `"_dd`.

Il registro del buco nero è come il `/dev/null` dei registri.

## Il Registro dell'Ultimo Modello di Ricerca

Per incollare la tua ultima ricerca (`/` o `?`), puoi usare il registro dell'ultimo modello di ricerca (`"/`). Per incollare l'ultimo termine di ricerca, usa `"/p`.

## Visualizzare i Registri

Per visualizzare tutti i tuoi registri, usa il comando `:register`. Per visualizzare solo i registri "a, "1, e "-, usa `:register a 1 -`.

C'è un plugin chiamato [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) che ti consente di dare un'occhiata ai contenuti dei registri quando premi `"` o `@` in modalità normale e `Ctrl-R` in modalità di inserimento. Trovo questo plugin molto utile perché molte volte non riesco a ricordare il contenuto nei miei registri. Provalo!

## Eseguire un Registro

I registri nominati non servono solo per memorizzare testi. Possono anche eseguire macro con `@`. Affronterò le macro nel prossimo capitolo.

Tieni presente che poiché le macro sono memorizzate all'interno dei registri di Vim, puoi accidentalmente sovrascrivere il testo memorizzato con le macro. Se memorizzi il testo "Ciao Vim" nel registro a e successivamente registri una macro nello stesso registro (`qa{sequenza-macro}q`), quella macro sovrascriverà il tuo testo "Ciao Vim" memorizzato in precedenza.
## Cancellare un Registro

Tecnicamente, non c'è bisogno di cancellare alcun registro perché il prossimo testo che memorizzi sotto lo stesso nome di registro lo sovrascriverà. Tuttavia, puoi cancellare rapidamente un registro nominato registrando una macro vuota. Ad esempio, se esegui `qaq`, Vim registrerà una macro vuota nel registro a.

Un'altra alternativa è eseguire il comando `:call setreg('a', 'hello register a')` dove a è il registro a e "hello register a" è il testo che desideri memorizzare.

Un altro modo per cancellare un registro è impostare il contenuto del "registro a su una stringa vuota con l'espressione `:let @a = ''`.

## Inserire il Contenuto di un Registro

Puoi usare il comando `:put` per incollare il contenuto di un qualsiasi registro. Ad esempio, se esegui `:put a`, Vim stamperà il contenuto del registro a sotto la riga corrente. Questo si comporta molto come `"ap`, con la differenza che il comando in modalità normale `p` stampa il contenuto del registro dopo il cursore e il comando `:put` stampa il contenuto del registro a una nuova riga.

Poiché `:put` è un comando da riga di comando, puoi passarvi un indirizzo. `:10put a` incollerà il testo dal registro a sotto la riga 10.

Un trucco interessante è passare `:put` con il registro del buco nero (`"_`). Poiché il registro del buco nero non memorizza alcun testo, `:put _` inserirà una riga vuota invece. Puoi combinare questo con il comando globale per inserire più righe vuote. Ad esempio, per inserire righe vuote sotto tutte le righe che contengono il testo "end", esegui `:g/end/put _`. Imparerai a conoscere il comando globale più avanti.

## Imparare i Registri nel Modo Intelligente

Sei arrivato alla fine. Congratulazioni! Se ti senti sopraffatto dalla quantità di informazioni, non sei solo. Quando ho iniziato a imparare sui registri di Vim, c'era davvero troppa informazione da assimilare in una volta.

Non penso che tu debba memorizzare tutti i registri immediatamente. Per diventare produttivo, puoi iniziare usando solo questi 3 registri:
1. Il registro non nominato (`""`).
2. I registri nominati (`"a-z`).
3. I registri numerati (`"0-9`).

Poiché il registro non nominato predefinito è `p` e `P`, devi solo imparare due registri: i registri nominati e i registri numerati. Impara gradualmente più registri quando ne hai bisogno. Prenditi il tuo tempo.

L'essere umano medio ha una capacità limitata di memoria a breve termine, circa 5 - 7 elementi alla volta. Ecco perché nella mia modifica quotidiana, uso solo circa 5 - 7 registri nominati. Non c'è modo che io possa ricordare tutte e ventisei a memoria. Di solito inizio con il registro a, poi b, seguendo l'ordine alfabetico. Provalo e sperimenta per vedere quale tecnica funziona meglio per te.

I registri di Vim sono potenti. Usati strategicamente, possono salvarti dal digitare innumerevoli testi ripetitivi. Ora, impariamo a conoscere le macro.