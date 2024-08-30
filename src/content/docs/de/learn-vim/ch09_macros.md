---
description: Erlernen Sie, wie Sie mit Vim-Makros wiederkehrende Aktionen automatisieren
  können, um Ihre Datei effizienter zu bearbeiten und Zeit zu sparen.
title: Ch09. Macros
---

Beim Bearbeiten von Dateien kann es vorkommen, dass Sie dieselben Aktionen wiederholt ausführen. Wäre es nicht schön, wenn Sie diese Aktionen einmal ausführen und sie jederzeit wiederholen könnten? Mit Vim-Makros können Sie Aktionen aufzeichnen und in Vim-Registrierungen speichern, um sie bei Bedarf auszuführen.

In diesem Kapitel lernen Sie, wie Sie Makros verwenden, um alltägliche Aufgaben zu automatisieren (außerdem sieht es cool aus, wenn sich Ihre Datei selbst bearbeitet).

## Grundlegende Makros

Hier ist die grundlegende Syntax eines Vim-Makros:

```shell
qa                     Beginne mit der Aufnahme eines Makros in der Registrierung a
q (während der Aufnahme)    Stoppe die Aufnahme des Makros
```

Sie können beliebige Kleinbuchstaben (a-z) wählen, um Makros zu speichern. So führen Sie ein Makro aus:

```shell
@a    Führe das Makro aus der Registrierung a aus
@@    Führe die zuletzt ausgeführten Makros aus
```

Angenommen, Sie haben diesen Text und möchten alles in jeder Zeile in Großbuchstaben umwandeln:

```shell
hallo
vim
makros
sind
toll
```

Mit dem Cursor am Anfang der Zeile "hallo", führen Sie aus:

```shell
qa0gU$jq
```

Die Aufschlüsselung:
- `qa` beginnt mit der Aufnahme eines Makros in der Registrierung a.
- `0` geht zum Anfang der Zeile.
- `gU$` macht den Text von Ihrer aktuellen Position bis zum Ende der Zeile groß.
- `j` geht eine Zeile nach unten.
- `q` stoppt die Aufnahme.

Um es wieder abzuspielen, führen Sie `@a` aus. Wie viele andere Vim-Befehle können Sie auch einen Zählwert an Makros übergeben. Zum Beispiel führt `3@a` das Makro dreimal aus.

## Sicherheitsvorkehrung

Die Ausführung von Makros endet automatisch, wenn ein Fehler auftritt. Angenommen, Sie haben diesen Text:

```shell
a. Schokoladendonut
b. Mochidonat
c. Puderzucker-Donut
d. einfacher Donut
```

Wenn Sie das erste Wort in jeder Zeile in Großbuchstaben umwandeln möchten, sollte dieses Makro funktionieren:

```shell
qa0W~jq
```

Hier ist die Aufschlüsselung des obigen Befehls:
- `qa` beginnt mit der Aufnahme eines Makros in der Registrierung a.
- `0` geht zum Anfang der Zeile.
- `W` geht zum nächsten WORT.
- `~` wechselt die Groß- und Kleinschreibung des Zeichens unter dem Cursor.
- `j` geht eine Zeile nach unten.
- `q` stoppt die Aufnahme.

Ich ziehe es vor, meine Makroausführung zu überzählen, als sie zu unterzählen, also rufe ich es normalerweise neunundneunzigmal auf (`99@a`). Mit diesem Befehl führt Vim dieses Makro nicht tatsächlich neunundneunzigmal aus. Wenn Vim die letzte Zeile erreicht und die Bewegung `j` ausführt, findet es keine weitere Zeile, in die es nach unten gehen kann, wirft einen Fehler und stoppt die Makroausführung.

Die Tatsache, dass die Makroausführung beim ersten Fehler stoppt, ist eine gute Funktion, andernfalls würde Vim dieses Makro neunundneunzigmal ausführen, obwohl es bereits das Ende der Zeile erreicht hat.

## Kommandozeilen-Makro

Das Ausführen von `@a` im normalen Modus ist nicht die einzige Möglichkeit, Makros in Vim auszuführen. Sie können auch den Befehl `:normal @a` in der Kommandozeile ausführen. `:normal` ermöglicht es dem Benutzer, jeden normalen Modus-Befehl auszuführen, der als Argument übergeben wird. Im obigen Fall ist es dasselbe wie das Ausführen von `@a` im normalen Modus.

Der Befehl `:normal` akzeptiert Bereiche als Argumente. Sie können dies verwenden, um Makros in ausgewählten Bereichen auszuführen. Wenn Sie Ihr Makro zwischen den Zeilen 2 und 3 ausführen möchten, können Sie `:2,3 normal @a` ausführen.

## Ausführen eines Makros über mehrere Dateien

Angenommen, Sie haben mehrere `.txt`-Dateien, die jeweils einige Texte enthalten. Ihre Aufgabe besteht darin, das erste Wort nur in den Zeilen, die das Wort "Donut" enthalten, in Großbuchstaben umzuwandeln. Angenommen, Sie haben `0W~j` in der Registrierung a (das gleiche Makro wie zuvor). Wie können Sie dies schnell erledigen?

Erste Datei:

```shell
## herzhaft.txt
a. Cheddar-Jalapeno-Donut
b. Mac n Cheese Donut
c. Gebratene Teigtasche
```

Zweite Datei:

```shell
## süß.txt
a. Schokoladendonut
b. Schokoladenpfannkuchen
c. Puderzucker-Donut
```

Dritte Datei:

```shell
## einfach.txt
a. Weizenbrot
b. einfacher Donut
```

So können Sie es tun:
- `:args *.txt` um alle `.txt`-Dateien in Ihrem aktuellen Verzeichnis zu finden.
- `:argdo g/donut/normal @a` führt den globalen Befehl `g/donut/normal @a` in jeder Datei innerhalb von `:args` aus.
- `:argdo update` führt den Befehl `update` aus, um jede Datei innerhalb von `:args` zu speichern, wenn der Puffer geändert wurde.

Wenn Sie mit dem globalen Befehl `:g/donut/normal @a` nicht vertraut sind, führt er den Befehl aus, den Sie angeben (`normal @a`), in den Zeilen, die dem Muster (`/donut/`) entsprechen. Ich werde den globalen Befehl in einem späteren Kapitel behandeln.

## Rekursives Makro

Sie können ein Makro rekursiv ausführen, indem Sie die gleiche Makro-Registrierung während der Aufnahme dieses Makros aufrufen. Angenommen, Sie haben diese Liste erneut und müssen die Groß- und Kleinschreibung des ersten Wortes umschalten:

```shell
a. Schokoladendonut
b. Mochidonat
c. Puderzucker-Donut
d. einfacher Donut
```

Lassen Sie es uns diesmal rekursiv tun. Führen Sie aus:

```shell
qaqqa0W~j@aq
```

Hier ist die Aufschlüsselung der Schritte:
- `qaq` zeichnet ein leeres Makro a auf. Es ist notwendig, mit einer leeren Registrierung zu beginnen, da das rekursive Aufrufen des Makros alles aus dieser Registrierung ausführt.
- `qa` beginnt mit der Aufnahme in der Registrierung a.
- `0` geht zum ersten Zeichen in der aktuellen Zeile.
- `W` geht zum nächsten WORT.
- `~` wechselt die Groß- und Kleinschreibung des Zeichens unter dem Cursor.
- `j` geht eine Zeile nach unten.
- `@a` führt das Makro a aus.
- `q` stoppt die Aufnahme.

Jetzt können Sie einfach `@a` ausführen und beobachten, wie Vim das Makro rekursiv ausführt.

Wie wusste das Makro, wann es stoppen sollte? Als das Makro in der letzten Zeile war, versuchte es, `j` auszuführen. Da es keine weitere Zeile gab, in die es gehen konnte, stoppte es die Makroausführung.

## Anhängen eines Makros

Wenn Sie Aktionen zu einem bestehenden Makro hinzufügen müssen, anstatt das Makro von Grund auf neu zu erstellen, können Sie Aktionen an ein bestehendes anhängen. Im Kapitel über Registrierungen haben Sie gelernt, dass Sie eine benannte Registrierung anhängen können, indem Sie ihr Großbuchstabensymbol verwenden. Die gleiche Regel gilt. Um Aktionen an ein Makro in der Registrierung a anzuhängen, verwenden Sie die Registrierung A.

Nehmen Sie ein Makro in der Registrierung a auf: `qa0W~q` (diese Sequenz wechselt die Groß- und Kleinschreibung des nächsten WORTS in einer Zeile). Wenn Sie eine neue Sequenz anhängen möchten, um auch einen Punkt am Ende der Zeile hinzuzufügen, führen Sie aus:

```shell
qAA.<Esc>q
```

Die Aufschlüsselung:
- `qA` beginnt mit der Aufnahme des Makros in der Registrierung A.
- `A.<Esc>` fügt am Ende der Zeile (hier ist `A` der Befehl für den Einfügemodus, nicht zu verwechseln mit dem Makro A) einen Punkt ein und verlässt dann den Einfügemodus.
- `q` stoppt die Aufnahme des Makros.

Jetzt, wenn Sie `@a` ausführen, wechselt es nicht nur die Groß- und Kleinschreibung des nächsten WORTS, sondern fügt auch einen Punkt am Ende der Zeile hinzu.

## Ändern eines Makros

Was ist, wenn Sie neue Aktionen in der Mitte eines Makros hinzufügen müssen?

Angenommen, Sie haben ein Makro, das das erste tatsächliche Wort umschaltet und einen Punkt am Ende der Zeile hinzufügt, `0W~A.<Esc>` in der Registrierung a. Angenommen, dass Sie zwischen dem Großschreiben des ersten Wortes und dem Hinzufügen eines Punktes am Ende der Zeile das Wort "frittiert" direkt vor dem Wort "Donut" hinzufügen müssen *(denn das einzige, was besser ist als normale Donuts, sind frittierte Donuts)*.

Ich werde den Text aus dem vorherigen Abschnitt wiederverwenden:
```shell
a. Schokoladendonut
b. Mochidonat
c. Puderzucker-Donut
d. einfacher Donut
```

Zuerst rufen wir das vorhandene Makro auf (nehmen wir an, Sie haben das Makro aus dem vorherigen Abschnitt in der Registrierung a behalten) mit `:put a`:

```shell
0W~A.^[
```

Was ist dieses `^[`? Haben Sie nicht `0W~A.<Esc>` gemacht? Wo ist das `<Esc>`? `^[` ist die *interne Code*-Darstellung von Vim für `<Esc>`. Bei bestimmten Sondertasten gibt Vim die Darstellung dieser Tasten in Form interner Codes aus. Einige gängige Tasten, die interne Code-Darstellungen haben, sind `<Esc>`, `<Backspace>` und `<Enter>`. Es gibt noch mehr spezielle Tasten, aber diese liegen nicht im Rahmen dieses Kapitels.

Zurück zum Makro, direkt nach dem Großschreiboperator (`~`), fügen wir die Anweisungen hinzu, um zum Ende der Zeile (`$`) zu gehen, ein Wort zurückzugehen (`b`), in den Einfügemodus zu wechseln (`i`), "frittiert " einzugeben (vergessen Sie nicht das Leerzeichen nach "frittiert "), und den Einfügemodus zu verlassen (`<Esc>`).

Hier ist, was Sie am Ende haben werden:

```shell
0W~$bifrittiert <Esc>A.^[
```

Es gibt ein kleines Problem. Vim versteht `<Esc>` nicht. Sie können `<Esc>` nicht wörtlich eingeben. Sie müssen die interne Code-Darstellung für die `<Esc>`-Taste schreiben. Während Sie im Einfügemodus sind, drücken Sie `Ctrl-V`, gefolgt von `<Esc>`. Vim wird `^[` ausgeben. `Ctrl-V` ist ein Einfügemodus-Befehl, um das nächste Nicht-Zahlenzeichen *wörtlich* einzufügen. Ihr Makrocode sollte jetzt so aussehen:

```shell
0W~$bifrittiert ^[A.^[
```

Um die geänderte Anweisung in die Registrierung a einzufügen, können Sie es auf die gleiche Weise tun, wie Sie einen neuen Eintrag in eine benannte Registrierung einfügen. Am Anfang der Zeile führen Sie `"ay$` aus, um den kopierten Text in der Registrierung a zu speichern.

Jetzt, wenn Sie `@a` ausführen, wird Ihr Makro die Groß- und Kleinschreibung des ersten Wortes umschalten, "frittiert " vor "Donut" hinzufügen und einen "." am Ende der Zeile hinzufügen. Lecker!

Eine alternative Möglichkeit, ein Makro zu ändern, besteht darin, einen Kommandozeilen-Ausdruck zu verwenden. Machen Sie `:let @a="`, dann drücken Sie `Ctrl-R a`, um den Inhalt der Registrierung a wörtlich einzufügen. Vergessen Sie schließlich nicht, die Anführungszeichen (`"`) zu schließen. Sie könnten etwas haben wie `:let @a="0W~$bifrittiert ^[A.^["`.

## Makro-Redundanz

Sie können Makros leicht von einer Registrierung in eine andere duplizieren. Zum Beispiel, um ein Makro in der Registrierung a in die Registrierung z zu duplizieren, können Sie `:let @z = @a` machen. `@a` repräsentiert den Inhalt der Registrierung a. Jetzt, wenn Sie `@z` ausführen, führt es genau die gleichen Aktionen wie `@a` aus.

Ich finde es nützlich, eine Redundanz bei meinen am häufigsten verwendeten Makros zu erstellen. In meinem Arbeitsablauf zeichne ich normalerweise Makros in den ersten sieben Buchstaben des Alphabets (a-g) auf und ersetze sie oft ohne viel nachzudenken. Wenn ich die nützlichen Makros weiter hinten im Alphabet platziere, kann ich sie bewahren, ohne mir Sorgen machen zu müssen, dass ich sie versehentlich ersetze.

## Serien- vs. Parallel-Makro

Vim kann Makros in Serie und parallel ausführen. Angenommen, Sie haben diesen Text:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Wenn Sie ein Makro aufzeichnen möchten, um alle großgeschriebenen "FUNC" in Kleinbuchstaben umzuwandeln, sollte dieses Makro funktionieren:

```shell
qa0f{gui{jq
```

Die Aufschlüsselung:
- `qa` beginnt mit der Aufnahme in der Registrierung a.
- `0` geht zur ersten Zeile.
- `f{` findet die erste Instanz von "{".
- `gui{` macht den Text innerhalb des Klammertextobjekts (`i{`) klein.
- `j` geht eine Zeile nach unten.
- `q` stoppt die Makroaufnahme.

Jetzt können Sie `99@a` ausführen, um es auf die verbleibenden Zeilen anzuwenden. Was ist jedoch, wenn Sie diesen Importausdruck in Ihrer Datei haben?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Wenn Sie `99@a` ausführen, wird das Makro nur dreimal ausgeführt. Es wird nicht auf die letzten beiden Zeilen ausgeführt, da die Ausführung bei der Ausführung von `f{` in der Zeile "foo" fehlschlägt. Dies ist zu erwarten, wenn Sie das Makro in Serie ausführen. Sie können immer zur nächsten Zeile gehen, in der "FUNC4" steht, und dieses Makro erneut abspielen. Aber was ist, wenn Sie alles auf einmal erledigen möchten?

Führen Sie das Makro parallel aus.

Erinnern Sie sich aus dem vorherigen Abschnitt, dass Makros auch mit dem Kommandozeilenbefehl `:normal` ausgeführt werden können (z. B. `:3,5 normal @a` führt das Makro a in den Zeilen 3-5 aus). Wenn Sie `:1,$ normal @a` ausführen, werden Sie sehen, dass das Makro in allen Zeilen außer der "foo"-Zeile ausgeführt wird. Es funktioniert!

Obwohl Vim intern die Makros nicht tatsächlich parallel ausführt, verhält es sich nach außen so. Vim führt `@a` *unabhängig* in jeder Zeile von der ersten bis zur letzten Zeile (`1,$`) aus. Da Vim diese Makros unabhängig ausführt, weiß jede Zeile nicht, dass eine der Makroausführungen in der "foo"-Zeile fehlgeschlagen ist.
## Lerne Makros auf die smarte Art

Viele Dinge, die du beim Bearbeiten tust, sind repetitiv. Um besser im Bearbeiten zu werden, gewöhne dir an, repetitive Aktionen zu erkennen. Nutze Makros (oder den Punktbefehl), damit du die gleiche Aktion nicht zweimal ausführen musst. Fast alles, was du in Vim tun kannst, kann mit Makros repliziert werden.

Am Anfang finde ich es sehr unangenehm, Makros zu schreiben, aber gib nicht auf. Mit genug Übung wirst du dir angewöhnen, alles zu automatisieren.

Es könnte hilfreich sein, Eselsbrücken zu verwenden, um dir deine Makros zu merken. Wenn du ein Makro hast, das eine Funktion erstellt, verwende das "f Register (`qf`). Wenn du ein Makro für numerische Operationen hast, sollte das "n Register funktionieren (`qn`). Nenne es mit dem *ersten benannten Register*, das dir in den Sinn kommt, wenn du an diese Operation denkst. Ich finde auch, dass das "q Register ein gutes Standard-Makro-Register ist, weil `qq` weniger geistige Energie erfordert, um darauf zu kommen. Schließlich mag ich es auch, meine Makros in alphabetischer Reihenfolge zu inkrementieren, wie `qa`, dann `qb`, dann `qc` und so weiter.

Finde eine Methode, die am besten für dich funktioniert.