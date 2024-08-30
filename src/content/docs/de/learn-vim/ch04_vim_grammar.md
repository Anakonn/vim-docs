---
description: In diesem Kapitel lernen Sie die grundlegende Grammatik der Vim-Befehle,
  um die Sprache von Vim zu verstehen und sicher zu verwenden.
title: Ch04. Vim Grammar
---

Es ist leicht, von der Komplexität der Vim-Befehle eingeschüchtert zu werden. Wenn Sie einen Vim-Benutzer sehen, der `gUfV` oder `1GdG` eingibt, wissen Sie möglicherweise nicht sofort, was diese Befehle bewirken. In diesem Kapitel werde ich die allgemeine Struktur der Vim-Befehle in eine einfache Grammatikregel zerlegen.

Dies ist das wichtigste Kapitel im gesamten Leitfaden. Sobald Sie die zugrunde liegende grammatikalische Struktur verstehen, werden Sie in der Lage sein, mit Vim zu "sprechen". Übrigens, wenn ich in diesem Kapitel von *Vim-Sprache* spreche, meine ich nicht die Vimscript-Sprache (Vims eingebaute Programmiersprache, die Sie in späteren Kapiteln lernen werden).

## Wie man eine Sprache lernt

Ich bin kein Muttersprachler des Englischen. Ich habe Englisch gelernt, als ich 13 war und in die USA gezogen bin. Es gibt drei Dinge, die Sie tun müssen, um eine neue Sprache zu lernen:

1. Grammatikregeln lernen.
2. Wortschatz erweitern.
3. Üben, üben, üben.

Ebenso müssen Sie, um die Vim-Sprache zu sprechen, die Grammatikregeln lernen, den Wortschatz erweitern und üben, bis Sie die Befehle ohne Nachdenken ausführen können.

## Grammatikregel

Es gibt nur eine Grammatikregel in der Vim-Sprache:

```shell
verb + noun
```

Das ist alles!

Das ist so, als würde man diese englischen Phrasen sagen:

- *"Essen (verb) einen Donut (noun)"*
- *"Treten (verb) einen Ball (noun)"*
- *"Lernen (verb) den Vim-Editor (noun)"*

Jetzt müssen Sie Ihren Wortschatz mit grundlegenden Vim-Verben und -Nomen aufbauen.

## Nomen (Bewegungen)

Nomen sind Vim-Bewegungen. Bewegungen werden verwendet, um sich in Vim zu bewegen. Unten finden Sie eine Liste einiger Vim-Bewegungen:

```shell
h    Links
j    Nach unten
k    Nach oben
l    Nach rechts
w    Vorwärts zum Anfang des nächsten Wortes
}    Zum nächsten Absatz springen
$    Zum Ende der Zeile gehen
```

Sie werden im nächsten Kapitel mehr über Bewegungen lernen, also machen Sie sich keine allzu großen Sorgen, wenn Sie einige davon nicht verstehen.

## Verben (Operatoren)

Laut `:h operator` hat Vim 16 Operatoren. In meiner Erfahrung reicht es jedoch, diese 3 Operatoren zu lernen, um 80 % meiner Bearbeitungsbedürfnisse zu decken:

```shell
y    Text yank (kopieren)
d    Text löschen und im Register speichern
c    Text löschen, im Register speichern und den Einfügemodus starten
```

Übrigens, nachdem Sie einen Text yanked haben, können Sie ihn mit `p` (nach dem Cursor) oder `P` (vor dem Cursor) einfügen.

## Verb und Noun

Jetzt, da Sie die grundlegenden Nomen und Verben kennen, wenden wir die Grammatikregel an, verb + noun! Angenommen, Sie haben diesen Ausdruck:

```javascript
const learn = "vim";
```

- Um alles von Ihrem aktuellen Standort bis zum Ende der Zeile zu yank: `y$`.
- Um von Ihrem aktuellen Standort bis zum Anfang des nächsten Wortes zu löschen: `dw`.
- Um von Ihrem aktuellen Standort bis zum Ende des aktuellen Absatzes zu ändern, sagen Sie `c}`.

Bewegungen akzeptieren auch eine Zählzahl als Argumente (ich werde dies im nächsten Kapitel besprechen). Wenn Sie 3 Zeilen nach oben gehen müssen, anstatt `k` 3 Mal zu drücken, können Sie `3k` tun. Die Zählung funktioniert mit der Vim-Grammatik.
- Um zwei Zeichen nach links zu yank: `y2h`.
- Um die nächsten zwei Wörter zu löschen: `d2w`.
- Um die nächsten zwei Zeilen zu ändern: `c2j`.

Im Moment müssen Sie vielleicht lange und gründlich nachdenken, um selbst einen einfachen Befehl auszuführen. Sie sind nicht allein. Als ich anfing, hatte ich ähnliche Schwierigkeiten, aber ich wurde mit der Zeit schneller. So werden Sie es auch. Wiederholung, Wiederholung, Wiederholung.

Als Randnotiz: Zeilenoperationen (Operationen, die die gesamte Zeile betreffen) sind gängige Operationen beim Textbearbeiten. Im Allgemeinen führt Vim durch zweimaliges Eingeben eines Operatorbefehls eine zeilenweise Operation für diese Aktion aus. Zum Beispiel führen `dd`, `yy` und `cc` **Löschung**, **Yank** und **Änderung** an der gesamten Zeile aus. Versuchen Sie dies mit anderen Operatoren!

Das ist wirklich cool. Ich sehe hier ein Muster. Aber ich bin noch nicht ganz fertig. Vim hat eine weitere Art von Nomen: Textobjekte.

## Weitere Nomen (Textobjekte)

Stellen Sie sich vor, Sie befinden sich irgendwo innerhalb eines Paar von Klammern wie `(hello Vim)` und müssen den gesamten Satz innerhalb der Klammern löschen. Wie können Sie das schnell tun? Gibt es eine Möglichkeit, die "Gruppe", in der Sie sich befinden, zu löschen?

Die Antwort ist ja. Texte sind oft strukturiert. Sie enthalten oft Klammern, Anführungszeichen, eckige Klammern, geschweifte Klammern und mehr. Vim hat eine Möglichkeit, diese Struktur mit Textobjekten zu erfassen.

Textobjekte werden mit Operatoren verwendet. Es gibt zwei Arten von Textobjekten: innere und äußere Textobjekte.

```shell
i + object    Inneres Textobjekt
a + object    Äußeres Textobjekt
```

Ein inneres Textobjekt wählt das Objekt innerhalb *ohne* den Leerraum oder die umgebenden Objekte aus. Ein äußeres Textobjekt wählt das Objekt innerhalb *einschließlich* des Leerraums oder der umgebenden Objekte aus. Im Allgemeinen wählt ein äußeres Textobjekt immer mehr Text aus als ein inneres Textobjekt. Wenn sich Ihr Cursor irgendwo innerhalb der Klammern im Ausdruck `(hello Vim)` befindet:
- Um den Text innerhalb der Klammern zu löschen, ohne die Klammern zu löschen: `di(`.
- Um die Klammern und den Text darin zu löschen: `da(`.

Schauen wir uns ein anderes Beispiel an. Angenommen, Sie haben diese Javascript-Funktion und Ihr Cursor befindet sich auf dem "H" in "Hello":

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Um das gesamte "Hello Vim" zu löschen: `di(`.
- Um den Inhalt der Funktion (umgeben von `{}`) zu löschen: `di{`.
- Um den String "Hello" zu löschen: `diw`.

Textobjekte sind mächtig, weil Sie verschiedene Objekte von einem Standort aus anvisieren können. Sie können die Objekte innerhalb der Klammern, den Funktionsblock oder das aktuelle Wort löschen. Mnemonisch, wenn Sie `di(`, `di{` und `diw` sehen, haben Sie eine ziemlich gute Vorstellung davon, welche Textobjekte sie repräsentieren: ein Paar Klammern, ein Paar geschweifte Klammern und ein Wort.

Schauen wir uns ein letztes Beispiel an. Angenommen, Sie haben diese HTML-Tags:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Wenn sich Ihr Cursor auf dem Text "Header1" befindet:
- Um "Header1" zu löschen: `dit`.
- Um `<h1>Header1</h1>` zu löschen: `dat`.

Wenn sich Ihr Cursor auf "div" befindet:
- Um `h1` und beide `p`-Zeilen zu löschen: `dit`.
- Um alles zu löschen: `dat`.
- Um "div" zu löschen: `di<`.

Unten finden Sie eine Liste gängiger Textobjekte:

```shell
w         Ein Wort
p         Ein Absatz
s         Ein Satz
( oder )  Ein Paar von ( )
{ oder }  Ein Paar von { }
[ oder ]  Ein Paar von [ ]
< oder >  Ein Paar von < >
t         XML-Tags
"         Ein Paar von " "
'         Ein Paar von ' '
`         Ein Paar von ` `
```

Um mehr zu erfahren, schauen Sie sich `:h text-objects` an.

## Kombinierbarkeit und Grammatik

Die Vim-Grammatik ist ein Teil der Kombinierbarkeitsfunktion von Vim. Lassen Sie uns die Kombinierbarkeit in Vim besprechen und warum dies eine großartige Funktion in einem Texteditor ist.

Kombinierbarkeit bedeutet, eine Reihe von allgemeinen Befehlen zu haben, die kombiniert (kombiniert) werden können, um komplexere Befehle auszuführen. Genau wie in der Programmierung, wo Sie komplexere Abstraktionen aus einfacheren Abstraktionen erstellen können, können Sie in Vim komplexe Befehle aus einfacheren Befehlen ausführen. Die Vim-Grammatik ist die Manifestation der kombinierbaren Natur von Vim.

Die wahre Kraft der Kombinierbarkeit von Vim zeigt sich, wenn sie mit externen Programmen integriert wird. Vim hat einen Filteroperator (`!`), um externe Programme als Filter für unsere Texte zu verwenden. Angenommen, Sie haben den folgenden unordentlichen Text und möchten ihn tabellarisch darstellen:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Dies kann nicht einfach mit Vim-Befehlen erledigt werden, aber Sie können es schnell mit dem Terminalbefehl `column` erledigen (vorausgesetzt, Ihr Terminal hat den Befehl `column`). Mit Ihrem Cursor auf "Id" führen Sie `!}column -t -s "|"` aus. Voila! Jetzt haben Sie diese hübschen tabellarischen Daten mit nur einem schnellen Befehl.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Lassen Sie uns den Befehl aufschlüsseln. Das Verb war `!` (Filteroperator) und das Nomen war `}` (zum nächsten Absatz gehen). Der Filteroperator `!` akzeptierte ein weiteres Argument, einen Terminalbefehl, also gab ich ihm `column -t -s "|"`. Ich werde nicht erklären, wie `column` funktioniert hat, aber im Effekt hat es den Text tabellarisch dargestellt.

Angenommen, Sie möchten nicht nur Ihren Text tabellarisch darstellen, sondern auch nur die Zeilen mit "Ok" anzeigen. Sie wissen, dass `awk` den Job leicht erledigen kann. Sie können stattdessen dies tun:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Ergebnis:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Großartig! Der externe Befehlsoperator kann auch die Pipe (`|`) verwenden.

Dies ist die Kraft der Kombinierbarkeit von Vim. Je mehr Sie über Ihre Operatoren, Bewegungen und Terminalbefehle wissen, desto mehr wird Ihre Fähigkeit, komplexe Aktionen zu kombinieren, *multipliziert*.

Angenommen, Sie kennen nur vier Bewegungen, `w, $, }, G` und nur einen Operator, `d`. Sie können 8 Aktionen durchführen: *bewegen* Sie sich auf 4 verschiedene Arten (`w, $, }, G`) und *löschen* Sie 4 verschiedene Ziele (`dw, d$, d}, dG`). Dann lernen Sie eines Tages über den Großbuchstaben (`gU`) Operator. Sie haben nicht nur eine neue Fähigkeit zu Ihrem Vim-Werkzeugkasten hinzugefügt, sondern *vier*: `gUw, gU$, gU}, gUG`. Das macht insgesamt 12 Werkzeuge in Ihrem Vim-Werkzeugkasten. Jedes neue Wissen ist ein Multiplikator für Ihre aktuellen Fähigkeiten. Wenn Sie 10 Bewegungen und 5 Operatoren kennen, haben Sie 60 Bewegungen (50 Operationen + 10 Bewegungen) in Ihrem Arsenal. Vim hat eine Zeilennummerbewegung (`nG`), die Ihnen `n` Bewegungen gibt, wobei `n` die Anzahl der Zeilen in Ihrer Datei ist (um zur Zeile 5 zu gelangen, führen Sie `5G` aus). Die Suchbewegung (`/`) gibt Ihnen praktisch eine unbegrenzte Anzahl von Bewegungen, weil Sie nach allem suchen können. Der externe Befehlsoperator (`!`) gibt Ihnen so viele Filterwerkzeuge, wie Sie Terminalbefehle kennen. Mit einem kombinierbaren Werkzeug wie Vim kann alles, was Sie wissen, miteinander verknüpft werden, um Operationen mit zunehmender Komplexität durchzuführen. Je mehr Sie wissen, desto mächtiger werden Sie.

Dieses kombinierbare Verhalten spiegelt die Unix-Philosophie wider: *eine Sache gut machen*. Ein Operator hat eine Aufgabe: Y tun. Eine Bewegung hat eine Aufgabe: zu X gehen. Durch die Kombination eines Operators mit einer Bewegung erhalten Sie vorhersehbar YX: Y auf X anwenden.

Bewegungen und Operatoren sind erweiterbar. Sie können benutzerdefinierte Bewegungen und Operatoren erstellen, die Sie zu Ihrem Vim-Werkzeugkasten hinzufügen. Das [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) Plugin ermöglicht es Ihnen, Ihre eigenen Textobjekte zu erstellen. Es enthält auch eine [Liste](https://github.com/kana/vim-textobj-user/wiki) von benutzerdefinierten Textobjekten.

## Lernen Sie Vim-Grammatik auf intelligente Weise

Sie haben gerade die Regel der Vim-Grammatik gelernt: `verb + noun`. Einer meiner größten "AHA!"-Momente mit Vim war, als ich gerade den Großbuchstaben (`gU`) Operator gelernt hatte und das aktuelle Wort in Großbuchstaben umwandeln wollte, ich *instinktiv* `gUiw` eingab und es funktionierte! Das Wort wurde in Großbuchstaben umgewandelt. In diesem Moment begann ich endlich, Vim zu verstehen. Ich hoffe, dass Sie bald Ihren eigenen "AHA!"-Moment haben werden, wenn nicht schon.

Das Ziel dieses Kapitels ist es, Ihnen das Muster `verb + noun` in Vim zu zeigen, damit Sie das Lernen von Vim wie das Lernen einer neuen Sprache angehen, anstatt jede Befehlskombination auswendig zu lernen.

Lernen Sie das Muster und verstehen Sie die Implikationen. Das ist der intelligente Weg zu lernen.