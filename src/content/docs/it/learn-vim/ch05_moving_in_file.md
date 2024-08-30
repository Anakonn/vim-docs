---
description: Scopri come navigare rapidamente in Vim utilizzando le principali funzioni
  di movimento. Impara a muoverti nel testo senza l'uso del mouse.
title: Ch05. Moving in a File
---

All'inizio, muoversi con una tastiera sembra lento e scomodo, ma non arrenderti! Una volta che ti abitui, puoi andare ovunque in un file più velocemente rispetto all'uso di un mouse.

In questo capitolo, imparerai i movimenti essenziali e come usarli in modo efficiente. Tieni presente che questo **non** è l'intero insieme di movimenti che Vim offre. L'obiettivo qui è introdurre movimenti utili per diventare produttivi rapidamente. Se hai bisogno di imparare di più, dai un'occhiata a `:h motion.txt`.

## Navigazione per Carattere

L'unità di movimento più basilare è spostarsi di un carattere a sinistra, giù, su e a destra.

```shell
h   Sinistra
j   Giù
k   Su
l   Destra
gj  Giù in una riga avvolta dolcemente
gk  Su in una riga avvolta dolcemente
```

Puoi anche muoverti con le frecce direzionali. Se stai appena iniziando, sentiti libero di usare qualsiasi metodo ti faccia sentire più a tuo agio.

Preferisco `hjkl` perché la mia mano destra può rimanere sulla fila principale. Fare questo mi dà un raggio d'azione più corto per i tasti circostanti. Per abituarmi a `hjkl`, ho effettivamente disabilitato i tasti freccia quando ho iniziato aggiungendo queste righe in `~/.vimrc`:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Ci sono anche plugin per aiutare a rompere questa cattiva abitudine. Uno di essi è [vim-hardtime](https://github.com/takac/vim-hardtime). Con mia sorpresa, ci è voluto meno di una settimana per abituarmi a `hjkl`.

Se ti chiedi perché Vim usa `hjkl` per muoversi, questo è perché il terminale Lear-Siegler ADM-3A, dove Bill Joy scrisse Vi, non aveva tasti freccia e usava `hjkl` come sinistra/giù/su/destra.*

## Numerazione Relativa

Penso sia utile avere `number` e `relativenumber impostati. Puoi farlo aggiungendo questo in `.vimrc`:

```shell
set relativenumber number
```

Questo visualizza il numero della mia riga corrente e i numeri di riga relativi.

È facile capire perché avere un numero nella colonna di sinistra sia utile, ma alcuni di voi potrebbero chiedere come possa essere utile avere numeri relativi nella colonna di sinistra. Avere un numero relativo mi consente di vedere rapidamente quante righe separano il mio cursore dal testo target. Con questo, posso facilmente notare che il mio testo target è 12 righe sotto di me, quindi posso fare `d12j` per eliminarle. Altrimenti, se sono sulla riga 69 e il mio target è sulla riga 81, devo fare un calcolo mentale (81 - 69 = 12). Fare matematica mentre si modifica richiede troppe risorse mentali. Meno devo pensare a dove devo andare, meglio è.

Questa è una preferenza personale al 100%. Sperimenta con `relativenumber` / `norelativenumber`, `number` / `nonumber` e usa ciò che trovi più utile!

## Conta il Tuo Movimento

Parliamo dell'argomento "count". I movimenti di Vim accettano un argomento numerico precedente. Ho menzionato sopra che puoi scendere di 12 righe con `12j`. Il 12 in `12j` è il numero di conteggio.

La sintassi per usare il conteggio con il tuo movimento è:

```shell
[count] + motion
```

Puoi applicare questo a tutti i movimenti. Se vuoi muoverti di 9 caratteri a destra, invece di premere `l` 9 volte, puoi fare `9l`.

## Navigazione per Parola

Passiamo a un'unità di movimento più grande: *parola*. Puoi muoverti all'inizio della parola successiva (`w`), alla fine della parola successiva (`e`), all'inizio della parola precedente (`b`), e alla fine della parola precedente (`ge`).

Inoltre, c'è *WORD*, distinto da parola. Puoi muoverti all'inizio della prossima WORD (`W`), alla fine della prossima WORD (`E`), all'inizio della WORD precedente (`B`), e alla fine della WORD precedente (`gE`). Per facilitarne la memorizzazione, WORD usa le stesse lettere di parola, solo maiuscole.

```shell
w     Muovi in avanti all'inizio della parola successiva
W     Muovi in avanti all'inizio della prossima WORD
e     Muovi in avanti di una parola alla fine della parola successiva
E     Muovi in avanti di una parola alla fine della prossima WORD
b     Muovi indietro all'inizio della parola precedente
B     Muovi indietro all'inizio della WORD precedente
ge    Muovi indietro alla fine della parola precedente
gE    Muovi indietro alla fine della WORD precedente
```

Quindi, quali sono le somiglianze e le differenze tra una parola e una WORD? Sia parola che WORD sono separate da caratteri vuoti. Una parola è una sequenza di caratteri che contiene *solo* `a-zA-Z0-9_`. Una WORD è una sequenza di tutti i caratteri tranne gli spazi bianchi (uno spazio bianco significa spazio, tab e EOL). Per saperne di più, dai un'occhiata a `:h word` e `:h WORD`.

Ad esempio, supponiamo di avere:

```shell
const hello = "world";
```

Con il cursore all'inizio della riga, per andare alla fine della riga con `l`, ci vorranno 21 pressioni di tasti. Usando `w`, ci vorranno 6. Usando `W`, ci vorranno solo 4. Sia parola che WORD sono buone opzioni per viaggiare a breve distanza.

Tuttavia, puoi passare da "c" a ";" in un solo colpo di tasto con la navigazione della riga corrente.

## Navigazione della Riga Corrente

Quando modifichi, spesso hai bisogno di navigare orizzontalmente in una riga. Per saltare al primo carattere nella riga corrente, usa `0`. Per andare all'ultimo carattere nella riga corrente, usa `$`. Inoltre, puoi usare `^` per andare al primo carattere non vuoto nella riga corrente e `g_` per andare all'ultimo carattere non vuoto nella riga corrente. Se vuoi andare alla colonna `n` nella riga corrente, puoi usare `n|`.

```shell
0     Vai al primo carattere nella riga corrente
^     Vai al primo carattere non vuoto nella riga corrente
g_    Vai all'ultimo carattere non vuoto nella riga corrente
$     Vai all'ultimo carattere nella riga corrente
n|    Vai alla colonna n nella riga corrente
```

Puoi fare una ricerca nella riga corrente con `f` e `t`. La differenza tra `f` e `t` è che `f` ti porta alla prima lettera della corrispondenza e `t` ti porta fino (proprio prima) alla prima lettera della corrispondenza. Quindi, se vuoi cercare "h" e atterrare su "h", usa `fh`. Se vuoi cercare il primo "h" e atterrare proprio prima della corrispondenza, usa `th`. Se vuoi andare alla *prossima* occorrenza dell'ultima ricerca nella riga corrente, usa `;`. Per andare all'occorrenza precedente dell'ultima corrispondenza nella riga corrente, usa `,`.

`F` e `T` sono i corrispondenti all'indietro di `f` e `t`. Per cercare all'indietro "h", esegui `Fh`. Per continuare a cercare "h" nella stessa direzione, usa `;`. Nota che `;` dopo un `Fh` cerca all'indietro e `,` dopo `Fh` cerca in avanti. 

```shell
f    Cerca in avanti per una corrispondenza nella stessa riga
F    Cerca all'indietro per una corrispondenza nella stessa riga
t    Cerca in avanti per una corrispondenza nella stessa riga, fermandosi prima della corrispondenza
T    Cerca all'indietro per una corrispondenza nella stessa riga, fermandosi prima della corrispondenza
;    Ripeti l'ultima ricerca nella stessa riga usando la stessa direzione
,    Ripeti l'ultima ricerca nella stessa riga usando la direzione opposta
```

Tornando all'esempio precedente:

```shell
const hello = "world";
```

Con il cursore all'inizio della riga, puoi andare all'ultimo carattere nella riga corrente (";") con una pressione di tasto: `$`. Se vuoi andare a "w" in "world", puoi usare `fw`. Un buon consiglio per andare ovunque in una riga è cercare lettere meno comuni come "j", "x", "z" vicino al tuo obiettivo.

## Navigazione di Frasi e Paragrafi

Le prossime due unità di navigazione sono frase e paragrafo.

Parliamo prima di cosa sia una frase. Una frase termina con `. ! ?` seguita da un EOL, uno spazio o un tab. Puoi saltare alla frase successiva con `)` e alla frase precedente con `(`.

```shell
(    Salta alla frase precedente
)    Salta alla frase successiva
```

Diamo un'occhiata ad alcuni esempi. Quali frasi pensi siano frasi e quali no? Prova a navigare con `(` e `)` in Vim!

```shell
Io sono una frase. Io sono un'altra frase perché finisco con un punto. Io sono ancora una frase quando finisco con un punto esclamativo! E per quanto riguarda il punto interrogativo? Non sono proprio una frase a causa del trattino - e né il punto e virgola ; né i due punti :

C'è una riga vuota sopra di me.
```

A proposito, se hai problemi con Vim che non conta una frase per frasi separate da `.` seguite da una singola riga, potresti essere in modalità `'compatible'`. Aggiungi `set nocompatible` nel vimrc. In Vi, una frase è un `.` seguito da **due** spazi. Dovresti avere `nocompatible` impostato in ogni momento.

Parliamo di cosa sia un paragrafo. Un paragrafo inizia dopo ogni riga vuota e anche in ogni insieme di una macro di paragrafo specificata dalle coppie di caratteri nell'opzione paragrafi.

```shell
{    Salta al paragrafo precedente
}    Salta al paragrafo successivo
```

Se non sei sicuro di cosa sia una macro di paragrafo, non preoccuparti. L'importante è che un paragrafo inizia e finisce dopo una riga vuota. Questo dovrebbe essere vero la maggior parte delle volte.

Diamo un'occhiata a questo esempio. Prova a navigare con `}` e `{` (inoltre, gioca con le navigazioni delle frasi `( )` per muoverti anche tu!)

```shell
Ciao. Come stai? Io sto bene, grazie!
Vim è fantastico.
Potrebbe non essere facile impararlo all'inizio...- ma siamo in questo insieme. Buona fortuna!

Ciao di nuovo.

Prova a muoverti con ), (, }, e {. Senti come funzionano.
Ce la fai.
```

Controlla `:h sentence` e `:h paragraph` per saperne di più.

## Navigazione delle Corrispondenze

I programmatori scrivono e modificano codici. I codici utilizzano tipicamente parentesi, parentesi graffe e quadre. Puoi facilmente perderti in esse. Se sei dentro una di esse, puoi saltare all'altra coppia (se esiste) con `%`. Puoi anche usare questo per scoprire se hai parentesi, parentesi graffe e quadre corrispondenti.

```shell
%    Naviga a un'altra corrispondenza, di solito funziona per (), [], {}
```

Diamo un'occhiata a un esempio di codice Scheme perché utilizza ampiamente le parentesi. Muoviti con `%` all'interno di diverse parentesi.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Personalmente, mi piace completare `%` con plugin di indicatori visivi come [vim-rainbow](https://github.com/frazrepo/vim-rainbow). Per saperne di più, controlla `:h %`.

## Navigazione per Numero di Riga

Puoi saltare al numero di riga `n` con `nG`. Ad esempio, se vuoi saltare alla riga 7, usa `7G`. Per saltare alla prima riga, usa `1G` o `gg`. Per saltare all'ultima riga, usa `G`.

Spesso non sai esattamente quale sia il numero di riga del tuo target, ma sai che è approssimativamente al 70% dell'intero file. In questo caso, puoi fare `70%`. Per saltare a metà del file, puoi fare `50%`.

```shell
gg    Vai alla prima riga
G     Vai all'ultima riga
nG    Vai alla riga n
n%    Vai a n% nel file
```

A proposito, se vuoi vedere il numero totale di righe in un file, puoi usare `Ctrl-g`.

## Navigazione delle Finestre

Per andare rapidamente in cima, al centro o in fondo alla tua *finestra*, puoi usare `H`, `M`, e `L`.

Puoi anche passare un conteggio a `H` e `L`. Se usi `10H`, andrai a 10 righe sotto la parte superiore della finestra. Se usi `3L`, andrai a 3 righe sopra l'ultima riga della finestra.

```shell
H     Vai in cima allo schermo
M     Vai al centro dello schermo
L     Vai in fondo allo schermo
nH    Vai n righe dall'alto
nL    Vai n righe dal basso
```

## Scorrimento

Per scorrere, hai 3 incrementi di velocità: schermo intero (`Ctrl-F/Ctrl-B`), metà schermo (`Ctrl-D/Ctrl-U`), e riga (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Scorri giù di una riga
Ctrl-D    Scorri giù di metà schermo
Ctrl-F    Scorri giù di tutto lo schermo
Ctrl-Y    Scorri su di una riga
Ctrl-U    Scorri su di metà schermo
Ctrl-B    Scorri su di tutto lo schermo
```

Puoi anche scorrere relativamente alla riga corrente (zoom della vista dello schermo):

```shell
zt    Porta la riga corrente vicino alla parte superiore dello schermo
zz    Porta la riga corrente al centro dello schermo
zb    Porta la riga corrente vicino alla parte inferiore dello schermo
```
## Navigazione della Ricerca

Spesso sai che una frase esiste all'interno di un file. Puoi usare la navigazione della ricerca per raggiungere molto rapidamente il tuo obiettivo. Per cercare una frase, puoi usare `/` per cercare in avanti e `?` per cercare all'indietro. Per ripetere l'ultima ricerca puoi usare `n`. Per ripetere l'ultima ricerca nella direzione opposta, puoi usare `N`.

```shell
/    Cerca in avanti un match
?    Cerca all'indietro un match
n    Ripeti l'ultima ricerca nella stessa direzione della ricerca precedente
N    Ripeti l'ultima ricerca nella direzione opposta della ricerca precedente
```

Supponiamo di avere questo testo:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Se stai cercando "let", esegui `/let`. Per cercare rapidamente "let" di nuovo, puoi semplicemente fare `n`. Per cercare di nuovo "let" nella direzione opposta, esegui `N`. Se esegui `?let`, cercherà "let" all'indietro. Se usi `n`, ora cercherà "let" all'indietro (`N` cercherà "let" in avanti ora).

Puoi abilitare l'evidenziazione della ricerca con `set hlsearch`. Ora quando cerchi `/let`, evidenzierà *tutte* le frasi corrispondenti nel file. Inoltre, puoi impostare la ricerca incrementale con `set incsearch`. Questo evidenzierà il modello mentre digiti. Per impostazione predefinita, le tue frasi corrispondenti rimarranno evidenziate fino a quando non cerchi un'altra frase. Questo può rapidamente trasformarsi in un fastidio. Per disabilitare l'evidenziazione, puoi eseguire `:nohlsearch` o semplicemente `:noh`. Poiché utilizzo frequentemente questa funzione senza evidenziazione, ho creato una mappatura nel vimrc:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Puoi cercare rapidamente il testo sotto il cursore con `*` per cercare in avanti e `#` per cercare all'indietro. Se il tuo cursore è sulla stringa "one", premere `*` sarà come se avessi fatto `/\<one\>`.

Entrambi `\<` e `\>` in `/\<one\>` significano ricerca di parola intera. Non corrisponde a "one" se è parte di una parola più grande. Corrisponderà alla parola "one" ma non a "onetwo". Se il tuo cursore è su "one" e vuoi cercare in avanti per corrispondere a parole intere o parziali come "one" e "onetwo", devi usare `g*` invece di `*`.

```shell
*     Cerca la parola intera sotto il cursore in avanti
#     Cerca la parola intera sotto il cursore all'indietro
g*    Cerca la parola sotto il cursore in avanti
g#    Cerca la parola sotto il cursore all'indietro
```

## Marcatura della Posizione

Puoi usare i segni per salvare la tua posizione attuale e tornare a questa posizione in seguito. È come un segnalibro per la modifica del testo. Puoi impostare un segno con `mx`, dove `x` può essere qualsiasi lettera alfabetica `a-zA-Z`. Ci sono due modi per tornare al segno: esatto (linea e colonna) con `` `x `` e per linea (`'x`).

```shell
ma    Segna la posizione con il segno "a"
`a    Salta alla linea e colonna "a"
'a    Salta alla linea "a"
```

C'è una differenza tra la marcatura con lettere minuscole (a-z) e lettere maiuscole (A-Z). Gli alfabeti minuscoli sono segni locali e gli alfabeti maiuscoli sono segni globali (a volte noti come segni di file).

Parliamo dei segni locali. Ogni buffer può avere il proprio set di segni locali. Se ho due file aperti, posso impostare un segno "a" (`ma`) nel primo file e un altro segno "a" (`ma`) nel secondo file.

A differenza dei segni locali, dove puoi avere un set di segni in ogni buffer, ottieni solo un set di segni globali. Se imposti `mA` all'interno di `myFile.txt`, la prossima volta che esegui `mA` in un file diverso, sovrascriverà il primo segno "A". Un vantaggio dei segni globali è che puoi saltare a qualsiasi segno globale anche se sei all'interno di un progetto completamente diverso. I segni globali possono viaggiare tra i file.

Per visualizzare tutti i segni, usa `:marks`. Potresti notare dalla lista dei segni che ci sono più segni oltre a `a-zA-Z`. Alcuni di essi sono:

```shell
''    Torna all'ultima linea nel buffer corrente prima del salto
``    Torna all'ultima posizione nel buffer corrente prima del salto
`[    Salta all'inizio del testo precedentemente cambiato / copiato
`]    Salta alla fine del testo precedentemente cambiato / copiato
`<    Salta all'inizio dell'ultima selezione visiva
`>    Salta alla fine dell'ultima selezione visiva
`0    Torna all'ultimo file modificato quando esci da vim
```

Ci sono più segni di quelli elencati sopra. Non li tratterò qui perché penso che siano raramente usati, ma se sei curioso, controlla `:h marks`.

## Salto

In Vim, puoi "saltare" a un file diverso o a una parte diversa di un file con alcuni movimenti. Non tutti i movimenti contano come un salto, però. Andare giù con `j` non conta come un salto. Andare alla linea 10 con `10G` conta come un salto.

Ecco i comandi che Vim considera come comandi di "salto":

```shell
'       Vai alla linea contrassegnata
`       Vai alla posizione contrassegnata
G       Vai alla linea
/       Cerca in avanti
?       Cerca all'indietro
n       Ripeti l'ultima ricerca, stessa direzione
N       Ripeti l'ultima ricerca, direzione opposta
%       Trova corrispondenza
(       Vai all'ultima frase
)       Vai alla frase successiva
{       Vai all'ultimo paragrafo
}       Vai al paragrafo successivo
L       Vai all'ultima linea della finestra visualizzata
M       Vai alla linea centrale della finestra visualizzata
H       Vai alla prima linea della finestra visualizzata
[[      Vai alla sezione precedente
]]      Vai alla sezione successiva
:s      Sostituisci
:tag    Salta alla definizione del tag
```

Non consiglio di memorizzare questa lista. Una buona regola generale è che qualsiasi movimento che si sposta più lontano di una parola e la navigazione della linea corrente è probabilmente un salto. Vim tiene traccia di dove sei stato quando ti muovi e puoi vedere questa lista all'interno di `:jumps`.

Per ulteriori informazioni, controlla `:h jump-motions`.

Perché i salti sono utili? Perché puoi navigare nella lista dei salti con `Ctrl-O` per muoverti verso l'alto nella lista dei salti e `Ctrl-I` per muoverti verso il basso nella lista dei salti. `hjkl` non sono comandi di "salto", ma puoi aggiungere manualmente la posizione corrente alla lista dei salti con `m'` prima del movimento. Ad esempio, `m'5j` aggiunge la posizione corrente alla lista dei salti e scende di 5 righe, e puoi tornare con `Ctrl-O`. Puoi saltare tra file diversi, di cui parlerò di più nella prossima parte.

## Impara a Navigare nel Modo Intelligente

Se sei nuovo in Vim, c'è molto da imparare. Non mi aspetto che qualcuno ricordi tutto immediatamente. Ci vuole tempo prima di poterli eseguire senza pensare.

Penso che il modo migliore per iniziare sia memorizzare alcuni movimenti essenziali. Ti consiglio di iniziare con questi 10 movimenti: `h, j, k, l, w, b, G, /, ?, n`. Ripetili sufficientemente fino a quando non puoi usarli senza pensare.

Per migliorare le tue abilità di navigazione, ecco i miei suggerimenti:
1. Fai attenzione alle azioni ripetute. Se ti trovi a fare `l` ripetutamente, cerca un movimento che ti porterà avanti più velocemente. Scoprirai che puoi usare `w`. Se ti accorgi di fare ripetutamente `w`, guarda se c'è un movimento che ti porterà rapidamente attraverso la linea corrente. Scoprirai che puoi usare `f`. Se riesci a descrivere la tua necessità in modo conciso, c'è una buona possibilità che Vim abbia un modo per farlo.
2. Ogni volta che impari un nuovo movimento, trascorri del tempo finché non riesci a farlo senza pensare.

Infine, renditi conto che non hai bisogno di conoscere ogni singolo comando di Vim per essere produttivo. La maggior parte degli utenti di Vim non lo fa. Io non lo faccio. Impara i comandi che ti aiuteranno a portare a termine il tuo compito in quel momento.

Prenditi il tuo tempo. L'abilità di navigazione è un'abilità molto importante in Vim. Impara una piccola cosa ogni giorno e imparala bene.