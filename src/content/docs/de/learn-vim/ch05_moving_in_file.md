---
description: In diesem Kapitel lernen Sie die grundlegenden Bewegungen in Vim kennen,
  um effizienter in Dateien zu navigieren und produktiver zu arbeiten.
title: Ch05. Moving in a File
---

Am Anfang fühlt es sich langsam und unbeholfen an, mit einer Tastatur zu navigieren, aber gib nicht auf! Sobald du dich daran gewöhnt hast, kannst du schneller in einer Datei navigieren als mit einer Maus.

In diesem Kapitel wirst du die grundlegenden Bewegungen lernen und wie du sie effizient nutzen kannst. Beachte, dass dies **nicht** die gesamte Bewegung ist, die Vim bietet. Das Ziel hier ist, nützliche Bewegungen vorzustellen, um schnell produktiv zu werden. Wenn du mehr lernen möchtest, schau dir `:h motion.txt` an.

## Zeichen-Navigation

Die grundlegendste Bewegungseinheit ist das Bewegen eines Zeichens nach links, unten, oben und rechts.

```shell
h   Links
j   Unten
k   Oben
l   Rechts
gj  Unten in einer weich umgebrochenen Zeile
gk  Oben in einer weich umgebrochenen Zeile
```

Du kannst auch mit den Richtungstasten navigieren. Wenn du gerade anfängst, kannst du jede Methode verwenden, mit der du dich am wohlsten fühlst.

Ich bevorzuge `hjkl`, weil meine rechte Hand auf der Grundreihe bleiben kann. Dadurch habe ich einen kürzeren Zugang zu den umliegenden Tasten. Um mich an `hjkl` zu gewöhnen, habe ich tatsächlich die Pfeiltasten deaktiviert, als ich anfing, indem ich Folgendes in `~/.vimrc` hinzugefügt habe:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Es gibt auch Plugins, die helfen, diese schlechte Gewohnheit abzulegen. Eines davon ist [vim-hardtime](https://github.com/takac/vim-hardtime). Zu meiner Überraschung hat es weniger als eine Woche gedauert, um mich an `hjkl` zu gewöhnen.

Wenn du dich fragst, warum Vim `hjkl` verwendet, liegt das daran, dass das Lear-Siegler ADM-3A-Terminal, in dem Bill Joy Vi schrieb, keine Pfeiltasten hatte und `hjkl` als links/unten/oben/rechts verwendete.*

## Relative Nummerierung

Ich halte es für hilfreich, `number` und `relativenumber` einzustellen. Du kannst dies in `.vimrc` tun:

```shell
set relativenumber number
```

Dies zeigt meine aktuelle Zeilennummer und relative Zeilennummern an.

Es ist leicht zu verstehen, warum eine Nummer in der linken Spalte nützlich ist, aber einige von euch könnten sich fragen, wie relative Zahlen in der linken Spalte nützlich sein können. Eine relative Nummer ermöglicht es mir, schnell zu sehen, wie viele Zeilen mein Cursor vom Zieltext entfernt ist. Damit kann ich leicht erkennen, dass mein Zieltext 12 Zeilen unter mir ist, sodass ich `d12j` verwenden kann, um sie zu löschen. Andernfalls, wenn ich in Zeile 69 bin und mein Ziel in Zeile 81 ist, muss ich eine mentale Berechnung durchführen (81 - 69 = 12). Während des Editierens Mathematik zu machen, kostet zu viele geistige Ressourcen. Je weniger ich darüber nachdenken muss, wo ich hin muss, desto besser.

Das ist 100% persönliche Präferenz. Experimentiere mit `relativenumber` / `norelativenumber`, `number` / `nonumber` und benutze, was du am nützlichsten findest!

## Zähle deine Bewegung

Lass uns über das "Zähl"-Argument sprechen. Vim-Bewegungen akzeptieren ein vorangestelltes numerisches Argument. Ich habe oben erwähnt, dass du mit `12j` 12 Zeilen nach unten gehen kannst. Die 12 in `12j` ist die Zählnummer.

Die Syntax zur Verwendung von Zähl mit deiner Bewegung ist:

```shell
[count] + motion
```

Du kannst dies auf alle Bewegungen anwenden. Wenn du 9 Zeichen nach rechts bewegen möchtest, anstatt `l` 9 Mal zu drücken, kannst du `9l` verwenden.

## Wort-Navigation

Lass uns zu einer größeren Bewegungseinheit übergehen: *Wort*. Du kannst zum Anfang des nächsten Wortes (`w`), zum Ende des nächsten Wortes (`e`), zum Anfang des vorherigen Wortes (`b`) und zum Ende des vorherigen Wortes (`ge`) navigieren.

Darüber hinaus gibt es *WORD*, das sich von Wort unterscheidet. Du kannst zum Anfang des nächsten WORD (`W`), zum Ende des nächsten WORD (`E`), zum Anfang des vorherigen WORD (`B`) und zum Ende des vorherigen WORD (`gE`) navigieren. Um es einfach zu merken, verwendet WORD die gleichen Buchstaben wie Wort, nur in Großbuchstaben.

```shell
w     Vorwärts zum Anfang des nächsten Wortes
W     Vorwärts zum Anfang des nächsten WORD
e     Vorwärts ein Wort zum Ende des nächsten Wortes
E     Vorwärts ein Wort zum Ende des nächsten WORD
b     Rückwärts zum Anfang des vorherigen Wortes
B     Rückwärts zum Anfang des vorherigen WORD
ge    Rückwärts zum Ende des vorherigen Wortes
gE    Rückwärts zum Ende des vorherigen WORD
```

Was sind also die Ähnlichkeiten und Unterschiede zwischen einem Wort und einem WORD? Sowohl Wort als auch WORD sind durch Leerzeichen getrennt. Ein Wort ist eine Zeichenfolge, die *nur* `a-zA-Z0-9_` enthält. Ein WORD ist eine Zeichenfolge aller Zeichen außer Leerzeichen (ein Leerzeichen bedeutet entweder ein Leerzeichen, einen Tabulator oder EOL). Um mehr zu lernen, schau dir `:h word` und `:h WORD` an.

Zum Beispiel, wenn du hast:

```shell
const hello = "world";
```

Mit deinem Cursor am Anfang der Zeile benötigst du 21 Tastendrücke, um zum Ende der Zeile mit `l` zu gelangen. Mit `w` benötigst du 6. Mit `W` benötigst du nur 4. Sowohl Wort als auch WORD sind gute Optionen, um kurze Distanzen zurückzulegen.

Du kannst jedoch mit einem Tastendruck von "c" zu ";" gelangen, wenn du die aktuelle Zeilen-Navigation verwendest.

## Aktuelle Zeilen-Navigation

Beim Bearbeiten musst du oft horizontal in einer Zeile navigieren. Um zum ersten Zeichen in der aktuellen Zeile zu springen, verwende `0`. Um zum letzten Zeichen in der aktuellen Zeile zu gelangen, verwende `$`. Zusätzlich kannst du `^` verwenden, um zum ersten nicht-leeren Zeichen in der aktuellen Zeile zu gelangen, und `g_`, um zum letzten nicht-leeren Zeichen in der aktuellen Zeile zu gelangen. Wenn du zur Spalte `n` in der aktuellen Zeile gehen möchtest, kannst du `n|` verwenden.

```shell
0     Gehe zum ersten Zeichen in der aktuellen Zeile
^     Gehe zum ersten nicht-leeren Zeichen in der aktuellen Zeile
g_    Gehe zum letzten nicht-leeren Zeichen in der aktuellen Zeile
$     Gehe zum letzten Zeichen in der aktuellen Zeile
n|    Gehe zur Spalte n in der aktuellen Zeile
```

Du kannst die aktuelle Zeilensuche mit `f` und `t` durchführen. Der Unterschied zwischen `f` und `t` besteht darin, dass `f` dich zum ersten Buchstaben des Treffers bringt und `t` dich bis (kurz vor) den ersten Buchstaben des Treffers bringt. Wenn du nach "h" suchen und auf "h" landen möchtest, verwende `fh`. Wenn du nach dem ersten "h" suchen und direkt vor dem Treffer landen möchtest, verwende `th`. Wenn du zur *nächsten* Vorkommen der letzten aktuellen Zeilensuche gehen möchtest, verwende `;`. Um zur vorherigen Vorkommen der letzten aktuellen Zeilenübereinstimmung zu gelangen, verwende `,`.

`F` und `T` sind die rückwärts gerichteten Gegenstücke von `f` und `t`. Um rückwärts nach "h" zu suchen, führe `Fh` aus. Um weiterhin nach "h" in die gleiche Richtung zu suchen, verwende `;`. Beachte, dass `;` nach einem `Fh` rückwärts sucht und `,` nach `Fh` vorwärts sucht.

```shell
f    Suche vorwärts nach einem Treffer in der gleichen Zeile
F    Suche rückwärts nach einem Treffer in der gleichen Zeile
t    Suche vorwärts nach einem Treffer in der gleichen Zeile, stoppe vor dem Treffer
T    Suche rückwärts nach einem Treffer in der gleichen Zeile, stoppe vor dem Treffer
;    Wiederhole die letzte Suche in der gleichen Zeile in die gleiche Richtung
,    Wiederhole die letzte Suche in der gleichen Zeile in die entgegengesetzte Richtung
```

Zurück zum vorherigen Beispiel:

```shell
const hello = "world";
```

Mit deinem Cursor am Anfang der Zeile kannst du mit einem Tastendruck zum letzten Zeichen in der aktuellen Zeile (";") gelangen: `$`. Wenn du zum "w" in "world" gelangen möchtest, kannst du `fw` verwenden. Ein guter Tipp, um überall in einer Zeile zu gelangen, ist, nach den am wenigsten häufigen Buchstaben wie "j", "x", "z" in der Nähe deines Ziels zu suchen.

## Satz- und Absatznavigation

Die nächsten beiden Navigationseinheiten sind Satz und Absatz.

Lass uns zuerst darüber sprechen, was ein Satz ist. Ein Satz endet entweder mit `. ! ?`, gefolgt von einem EOL, einem Leerzeichen oder einem Tabulator. Du kannst mit `)` zum nächsten Satz und mit `(` zum vorherigen Satz springen.

```shell
(    Springe zum vorherigen Satz
)    Springe zum nächsten Satz
```

Schauen wir uns einige Beispiele an. Welche Phrasen denkst du, sind Sätze und welche nicht? Versuche, mit `(` und `)` in Vim zu navigieren!

```shell
Ich bin ein Satz. Ich bin ein weiterer Satz, weil ich mit einem Punkt ende. Ich bin immer noch ein Satz, wenn ich mit einem Ausrufezeichen ende! Was ist mit dem Fragezeichen? Ich bin kein richtiger Satz wegen des Bindestrichs - und auch nicht das Semikolon ; oder der Doppelpunkt :

Es gibt eine leere Zeile über mir.
```

Übrigens, wenn du ein Problem mit Vim hast, dass es einen Satz für Phrasen, die durch `.` gefolgt von einer einzelnen Zeile getrennt sind, nicht zählt, könntest du im `'compatible'`-Modus sein. Füge `set nocompatible` in vimrc ein. In Vi ist ein Satz ein `.` gefolgt von **zwei** Leerzeichen. Du solltest `nocompatible` immer gesetzt haben.

Lass uns darüber sprechen, was ein Absatz ist. Ein Absatz beginnt nach jeder leeren Zeile und auch bei jedem Satz von Absatzmakros, die durch die Zeichenpaare in der Absatzoption angegeben sind.

```shell
{    Springe zum vorherigen Absatz
}    Springe zum nächsten Absatz
```

Wenn du dir nicht sicher bist, was ein Absatzmakro ist, mach dir keine Sorgen. Das Wichtige ist, dass ein Absatz nach einer leeren Zeile beginnt und endet. Dies sollte die meiste Zeit zutreffen.

Schauen wir uns dieses Beispiel an. Versuche, mit `}` und `{` herum zu navigieren (spiele auch mit den Satznavigationen `( )`, um dich auch zu bewegen!)

```shell
Hallo. Wie geht es dir? Mir geht es gut, danke!
Vim ist großartig.
Es mag am Anfang nicht einfach sein, es zu lernen...- aber wir sind gemeinsam dabei. Viel Glück!

Hallo nochmal.

Versuche, dich mit ), (, }, und { zu bewegen. Fühle, wie sie funktionieren.
Du schaffst das.
```

Schau dir `:h sentence` und `:h paragraph` an, um mehr zu lernen.

## Übereinstimmungsnavigation

Programmierer schreiben und bearbeiten Codes. Codes verwenden typischerweise Klammern, geschweifte Klammern und eckige Klammern. Du kannst dich leicht darin verlieren. Wenn du dich in einer befindest, kannst du mit `%` zum anderen Paar springen (wenn es existiert). Du kannst dies auch verwenden, um herauszufinden, ob du übereinstimmende Klammern, geschweifte Klammern und eckige Klammern hast.

```shell
%    Navigiere zu einer anderen Übereinstimmung, funktioniert normalerweise für (), [], {}
```

Schauen wir uns ein Beispiel aus Scheme an, da es Klammern intensiv verwendet. Bewege dich mit `%` in verschiedenen Klammern.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Ich persönlich mag es, `%` mit visuellen Indikatoren-Plugins wie [vim-rainbow](https://github.com/frazrepo/vim-rainbow) zu ergänzen. Für mehr, schau dir `:h %` an.

## Zeilennummern-Navigation

Du kannst mit `nG` zur Zeilennummer `n` springen. Zum Beispiel, wenn du zu Zeile 7 springen möchtest, verwende `7G`. Um zur ersten Zeile zu springen, verwende entweder `1G` oder `gg`. Um zur letzten Zeile zu springen, verwende `G`.

Oft weißt du nicht genau, welche Zeilennummer dein Ziel hat, aber du weißt, dass es ungefähr bei 70% der gesamten Datei liegt. In diesem Fall kannst du `70%` verwenden. Um zur Mitte der Datei zu springen, kannst du `50%` verwenden.

```shell
gg    Gehe zur ersten Zeile
G     Gehe zur letzten Zeile
nG    Gehe zu Zeile n
n%    Gehe zu n% in der Datei
```

Übrigens, wenn du die Gesamtanzahl der Zeilen in einer Datei sehen möchtest, kannst du `Ctrl-g` verwenden.

## Fenster-Navigation

Um schnell zum oberen, mittleren oder unteren Teil deines *Fensters* zu gelangen, kannst du `H`, `M` und `L` verwenden.

Du kannst auch eine Zählung an `H` und `L` übergeben. Wenn du `10H` verwendest, gehst du 10 Zeilen unterhalb des oberen Fensters. Wenn du `3L` verwendest, gehst du 3 Zeilen oberhalb der letzten Zeile des Fensters.

```shell
H     Gehe zum oberen Bildschirm
M     Gehe zum mittleren Bildschirm
L     Gehe zum unteren Bildschirm
nH    Gehe n Zeilen vom oberen
nL    Gehe n Zeilen vom unteren
```

## Scrollen

Zum Scrollen hast du 3 Geschwindigkeitsstufen: Vollbild (`Ctrl-F/Ctrl-B`), Halbbildschirm (`Ctrl-D/Ctrl-U`) und Zeile (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Scrolle eine Zeile nach unten
Ctrl-D    Scrolle eine halbe Seite nach unten
Ctrl-F    Scrolle eine ganze Seite nach unten
Ctrl-Y    Scrolle eine Zeile nach oben
Ctrl-U    Scrolle eine halbe Seite nach oben
Ctrl-B    Scrolle eine ganze Seite nach oben
```

Du kannst auch relativ zur aktuellen Zeile scrollen (Bildschirmansicht zoomen):

```shell
zt    Bringe die aktuelle Zeile nahe an den oberen Bildschirmrand
zz    Bringe die aktuelle Zeile in die Mitte deines Bildschirms
zb    Bringe die aktuelle Zeile nahe an den unteren Bildschirmrand
```
## Suchnavigation

Oft weißt du, dass ein Satz in einer Datei existiert. Du kannst die Suchnavigation verwenden, um sehr schnell dein Ziel zu erreichen. Um nach einem Satz zu suchen, kannst du `/` verwenden, um vorwärts zu suchen, und `?`, um rückwärts zu suchen. Um die letzte Suche zu wiederholen, kannst du `n` verwenden. Um die letzte Suche in die entgegengesetzte Richtung zu wiederholen, kannst du `N` verwenden.

```shell
/    Suche vorwärts nach einem Treffer
?    Suche rückwärts nach einem Treffer
n    Wiederhole die letzte Suche in derselben Richtung wie die vorherige Suche
N    Wiederhole die letzte Suche in entgegengesetzter Richtung zur vorherigen Suche
```

Angenommen, du hast diesen Text:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Wenn du nach "let" suchst, führe `/let` aus. Um schnell erneut nach "let" zu suchen, kannst du einfach `n` machen. Um erneut nach "let" in die entgegengesetzte Richtung zu suchen, führe `N` aus. Wenn du `?let` ausführst, wird nach "let" rückwärts gesucht. Wenn du `n` verwendest, wird jetzt rückwärts nach "let" gesucht (`N` wird jetzt vorwärts nach "let" suchen).

Du kannst die Suchhervorhebung mit `set hlsearch` aktivieren. Jetzt wird bei der Suche nach `/let` *alle* übereinstimmenden Sätze in der Datei hervorgehoben. Darüber hinaus kannst du die inkrementelle Suche mit `set incsearch` aktivieren. Dies wird das Muster während des Tippens hervorheben. Standardmäßig bleiben deine übereinstimmenden Sätze hervorgehoben, bis du nach einem anderen Satz suchst. Dies kann schnell lästig werden. Um die Hervorhebung zu deaktivieren, kannst du `:nohlsearch` oder einfach `:noh` ausführen. Da ich diese No-Highlight-Funktion häufig benutze, habe ich eine Zuordnung in vimrc erstellt:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Du kannst schnell nach dem Text unter dem Cursor mit `*` vorwärts und mit `#` rückwärts suchen. Wenn sich der Cursor auf dem String "one" befindet, ist das Drücken von `*` dasselbe, als hättest du `/\<one\>` eingegeben.

Sowohl `\<` als auch `\>` in `/\<one\>` bedeuten eine Suche nach dem gesamten Wort. Es wird nicht "one" übereinstimmen, wenn es Teil eines größeren Wortes ist. Es wird für das Wort "one" übereinstimmen, aber nicht für "onetwo". Wenn sich dein Cursor über "one" befindet und du vorwärts nach ganzen oder teilweisen Wörtern wie "one" und "onetwo" suchen möchtest, musst du stattdessen `g*` verwenden.

```shell
*     Suche nach dem gesamten Wort unter dem Cursor vorwärts
#     Suche nach dem gesamten Wort unter dem Cursor rückwärts
g*    Suche nach dem Wort unter dem Cursor vorwärts
g#    Suche nach dem Wort unter dem Cursor rückwärts
```

## Position markieren

Du kannst Marken verwenden, um deine aktuelle Position zu speichern und später zu dieser Position zurückzukehren. Es ist wie ein Lesezeichen für die Textbearbeitung. Du kannst eine Marke mit `mx` setzen, wobei `x` jeder alphabetische Buchstabe `a-zA-Z` sein kann. Es gibt zwei Möglichkeiten, zur Marke zurückzukehren: genau (Zeile und Spalte) mit `` `x `` und zeilenweise (`'x`).

```shell
ma    Markiere die Position mit der Marke "a"
`a    Springe zu Zeile und Spalte "a"
'a    Springe zu Zeile "a"
```

Es gibt einen Unterschied zwischen der Markierung mit Kleinbuchstaben (a-z) und Großbuchstaben (A-Z). Kleinbuchstaben sind lokale Marken und Großbuchstaben sind globale Marken (manchmal auch als Dateimarken bekannt).

Lass uns über lokale Marken sprechen. Jeder Puffer kann sein eigenes Set lokaler Marken haben. Wenn ich zwei Dateien geöffnet habe, kann ich eine Marke "a" (`ma`) in der ersten Datei und eine andere Marke "a" (`ma`) in der zweiten Datei setzen.

Im Gegensatz zu lokalen Marken, bei denen du in jedem Puffer ein Set von Marken haben kannst, erhältst du nur ein Set globaler Marken. Wenn du `mA` in `myFile.txt` setzt, wird beim nächsten Ausführen von `mA` in einer anderen Datei die erste "A"-Marke überschrieben. Ein Vorteil globaler Marken ist, dass du zu jeder globalen Marke springen kannst, selbst wenn du dich in einem völlig anderen Projekt befindest. Globale Marken können über Dateien hinweg reisen.

Um alle Marken anzuzeigen, verwende `:marks`. Du wirst feststellen, dass es aus der Markierungsliste mehr Marken gibt als `a-zA-Z`. Einige davon sind:

```shell
''    Springe zurück zur letzten Zeile im aktuellen Puffer vor dem Sprung
``    Springe zurück zur letzten Position im aktuellen Puffer vor dem Sprung
`[    Springe zum Anfang des zuvor geänderten / kopierten Texts
`]    Springe zum Ende des zuvor geänderten / kopierten Texts
`<    Springe zum Anfang der letzten visuellen Auswahl
`>    Springe zum Ende der letzten visuellen Auswahl
`0    Springe zurück zur zuletzt bearbeiteten Datei beim Verlassen von vim
```

Es gibt mehr Marken als die oben aufgeführten. Ich werde sie hier nicht behandeln, da ich denke, dass sie selten verwendet werden, aber wenn du neugierig bist, schau dir `:h marks` an.

## Sprung

In Vim kannst du zu einer anderen Datei oder einem anderen Teil einer Datei mit einigen Bewegungen "springen". Nicht alle Bewegungen zählen jedoch als Sprung. Das Heruntergehen mit `j` zählt nicht als Sprung. Das Springen zu Zeile 10 mit `10G` zählt als Sprung.

Hier sind die Befehle, die Vim als "Sprung"-Befehle betrachtet:

```shell
'       Gehe zur markierten Zeile
`       Gehe zur markierten Position
G       Gehe zur Zeile
/       Suche vorwärts
?       Suche rückwärts
n       Wiederhole die letzte Suche, gleiche Richtung
N       Wiederhole die letzte Suche, entgegengesetzte Richtung
%       Finde Übereinstimmung
(       Gehe zum letzten Satz
)       Gehe zum nächsten Satz
{       Gehe zum letzten Absatz
}       Gehe zum nächsten Absatz
L       Gehe zur letzten Zeile des angezeigten Fensters
M       Gehe zur mittleren Zeile des angezeigten Fensters
H       Gehe zur obersten Zeile des angezeigten Fensters
[[      Gehe zum vorherigen Abschnitt
]]      Gehe zum nächsten Abschnitt
:s      Ersetzen
:tag    Springe zur Tag-Definition
```

Ich empfehle nicht, diese Liste auswendig zu lernen. Eine gute Faustregel ist, dass jede Bewegung, die weiter als ein Wort und die aktuelle Zeilenavigation hinausgeht, wahrscheinlich ein Sprung ist. Vim verfolgt, wo du gewesen bist, wenn du dich bewegst, und du kannst diese Liste innerhalb von `:jumps` sehen.

Für mehr Informationen, schau dir `:h jump-motions` an.

Warum sind Sprünge nützlich? Weil du die Sprungliste mit `Ctrl-O` nach oben und mit `Ctrl-I` nach unten navigieren kannst. `hjkl` sind keine "Sprung"-Befehle, aber du kannst den aktuellen Standort manuell zur Sprungliste mit `m'` vor der Bewegung hinzufügen. Zum Beispiel fügt `m'5j` den aktuellen Standort zur Sprungliste hinzu und geht 5 Zeilen nach unten, und du kannst mit `Ctrl-O` zurückkommen. Du kannst über verschiedene Dateien springen, was ich im nächsten Teil näher erläutern werde.

## Lerne Navigation auf die smarte Weise

Wenn du neu bei Vim bist, gibt es viel zu lernen. Ich erwarte nicht, dass jemand sofort alles auswendig weiß. Es braucht Zeit, bis du sie ohne Nachdenken ausführen kannst.

Ich denke, der beste Weg, um anzufangen, ist, ein paar wesentliche Bewegungen auswendig zu lernen. Ich empfehle, mit diesen 10 Bewegungen zu beginnen: `h, j, k, l, w, b, G, /, ?, n`. Wiederhole sie ausreichend, bis du sie ohne Nachdenken verwenden kannst.

Um deine Navigationsfähigkeiten zu verbessern, sind hier meine Vorschläge:
1. Achte auf wiederholte Aktionen. Wenn du feststellst, dass du `l` wiederholt machst, suche nach einer Bewegung, die dich schneller vorwärts bringt. Du wirst feststellen, dass du `w` verwenden kannst. Wenn du dich dabei ertappst, wiederholt `w` zu machen, schaue, ob es eine Bewegung gibt, die dich schnell über die aktuelle Zeile bringt. Du wirst feststellen, dass du `f` verwenden kannst. Wenn du dein Bedürfnis prägnant beschreiben kannst, gibt es eine gute Chance, dass Vim einen Weg hat, dies zu tun.
2. Wann immer du eine neue Bewegung lernst, verbringe etwas Zeit damit, bis du sie ohne Nachdenken ausführen kannst.

Schließlich erkenne, dass du nicht jeden einzelnen Vim-Befehl kennen musst, um produktiv zu sein. Die meisten Vim-Nutzer tun das nicht. Ich auch nicht. Lerne die Befehle, die dir helfen, deine Aufgabe in diesem Moment zu erfüllen.

Nimm dir Zeit. Navigationsfähigkeiten sind eine sehr wichtige Fähigkeit in Vim. Lerne jeden Tag eine kleine Sache und lerne sie gut.