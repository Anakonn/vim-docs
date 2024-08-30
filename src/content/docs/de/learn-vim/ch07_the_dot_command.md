---
description: In diesem Kapitel lernen Sie, wie Sie den Punktbefehl in Vim verwenden,
  um vorherige Änderungen einfach zu wiederholen und Eingaben zu optimieren.
title: Ch07. the Dot Command
---

Im Allgemeinen sollten Sie versuchen, das, was Sie gerade getan haben, wann immer möglich zu vermeiden. In diesem Kapitel lernen Sie, wie Sie den Punktbefehl verwenden, um die vorherige Änderung einfach wiederherzustellen. Es ist ein vielseitiger Befehl zur Reduzierung einfacher Wiederholungen.

## Verwendung

So wie sein Name, können Sie den Punktbefehl verwenden, indem Sie die Punkt-Taste (`.`) drücken.

Wenn Sie beispielsweise alle "let" durch "const" in den folgenden Ausdrücken ersetzen möchten:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Suchen Sie mit `/let`, um zum Treffer zu gelangen.
- Ändern Sie mit `cwconst<Esc>`, um "let" durch "const" zu ersetzen.
- Navigieren Sie mit `n`, um den nächsten Treffer mit der vorherigen Suche zu finden.
- Wiederholen Sie, was Sie gerade getan haben, mit dem Punktbefehl (`.`).
- Drücken Sie weiter `n . n .`, bis Sie jedes Wort ersetzt haben.

Hier hat der Punktbefehl die Sequenz `cwconst<Esc>` wiederholt. Es hat Sie davor bewahrt, acht Tastenanschläge für nur einen einzugeben.

## Was ist eine Änderung?

Wenn Sie sich die Definition des Punktbefehls (`:h .`) ansehen, steht dort, dass der Punktbefehl die letzte Änderung wiederholt. Was ist eine Änderung?

Jedes Mal, wenn Sie den Inhalt des aktuellen Puffers aktualisieren (hinzufügen, ändern oder löschen), machen Sie eine Änderung. Die Ausnahmen sind Aktualisierungen, die durch Befehlszeilenbefehle (die Befehle, die mit `:` beginnen) durchgeführt werden, zählen nicht als Änderung.

Im ersten Beispiel war `cwconst<Esc>` die Änderung. Angenommen, Sie haben diesen Text:

```shell
pancake, potatoes, fruit-juice,
```

Um den Text vom Anfang der Zeile bis zur nächsten Vorkommen eines Kommas zu löschen, löschen Sie zuerst bis zum Komma, dann wiederholen Sie es zweimal mit `df,..`. 

Versuchen wir ein weiteres Beispiel:

```shell
pancake, potatoes, fruit-juice,
```

Diesmal besteht Ihre Aufgabe darin, das Komma zu löschen, nicht die Frühstücksartikel. Mit dem Cursor am Anfang der Zeile, gehen Sie zum ersten Komma, löschen Sie es, und wiederholen Sie dann zweimal mit `f,x..` Einfach, oder? Einen Moment, es hat nicht funktioniert! Warum?

Eine Änderung schließt Bewegungen aus, da sie den Pufferinhalt nicht aktualisiert. Der Befehl `f,x` bestand aus zwei Aktionen: dem Befehl `f,` um den Cursor zu "," zu bewegen und `x` um ein Zeichen zu löschen. Nur letzteres, `x`, verursachte eine Änderung. Im Gegensatz dazu war `df,` aus dem vorherigen Beispiel. Darin ist `f,` eine Anweisung an den Löschoperator `d`, kein Bewegung, um den Cursor zu bewegen. Das `f,` in `df,` und `f,x` haben zwei sehr unterschiedliche Rollen.

Lassen Sie uns die letzte Aufgabe beenden. Nachdem Sie `f,` dann `x` ausgeführt haben, gehen Sie mit `;` zum nächsten Komma, um das letzte `f` zu wiederholen. Schließlich verwenden Sie `.` um das Zeichen unter dem Cursor zu löschen. Wiederholen Sie `; . ; .`, bis alles gelöscht ist. Der vollständige Befehl ist `f,x;.;.`.

Versuchen wir noch eines:

```shell
pancake
potatoes
fruit-juice
```

Fügen wir am Ende jeder Zeile ein Komma hinzu. Beginnen Sie mit der ersten Zeile, machen Sie `A,<Esc>j`. Bis jetzt haben Sie erkannt, dass `j` keine Änderung verursacht. Die Änderung hier ist nur `A,`. Sie können sich bewegen und die Änderung mit `j . j .` wiederholen. Der vollständige Befehl ist `A,<Esc>j.j.`.

Jede Aktion von dem Moment an, in dem Sie den Einfügebefehl-Operator (`A`) drücken, bis Sie den Einfügebefehl verlassen (`<Esc>`), wird als Änderung betrachtet.

## Mehrzeilige Wiederholung

Angenommen, Sie haben diesen Text:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Ihr Ziel ist es, alle Zeilen außer der "foo"-Zeile zu löschen. Zuerst löschen Sie die ersten drei Zeilen mit `d2j`, dann zur Zeile unterhalb der "foo"-Zeile. In der nächsten Zeile verwenden Sie den Punktbefehl zweimal. Der vollständige Befehl ist `d2jj..`.

Hier war die Änderung `d2j`. In diesem Kontext war `2j` keine Bewegung, sondern ein Teil des Löschoperators.

Schauen wir uns ein weiteres Beispiel an:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Lassen Sie uns alle z's entfernen. Beginnen Sie vom ersten Zeichen in der ersten Zeile, wählen Sie visuell nur das erste z aus den ersten drei Zeilen mit dem blockweisen visuellen Modus (`Ctrl-Vjj`). Wenn Sie mit dem blockweisen visuellen Modus nicht vertraut sind, werde ich sie in einem späteren Kapitel behandeln. Sobald Sie die drei z's visuell ausgewählt haben, löschen Sie sie mit dem Löschoperator (`d`). Bewegen Sie sich dann zum nächsten Wort (`w`) zum nächsten z. Wiederholen Sie die Änderung zwei weitere Male (`..`). Der vollständige Befehl ist `Ctrl-vjjdw..`.

Als Sie eine Spalte von drei z's gelöscht haben (`Ctrl-vjjd`), wurde dies als Änderung gezählt. Der visuelle Modus kann verwendet werden, um mehrere Zeilen als Teil einer Änderung anzusprechen.

## Eine Bewegung in eine Änderung einbeziehen

Lassen Sie uns das erste Beispiel in diesem Kapitel erneut betrachten. Erinnern Sie sich, dass der Befehl `/letcwconst<Esc>` gefolgt von `n . n .` alle "let" durch "const" in den folgenden Ausdrücken ersetzt hat:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Es gibt einen schnelleren Weg, dies zu erreichen. Nachdem Sie `/let` gesucht haben, führen Sie `cgnconst<Esc>` aus und dann `. .`.

`gn` ist eine Bewegung, die vorwärts nach dem letzten Suchmuster (in diesem Fall `/let`) sucht und automatisch eine visuelle Hervorhebung vornimmt. Um das nächste Vorkommen zu ersetzen, müssen Sie sich nicht mehr bewegen und die Änderung wiederholen (`n . n .`), sondern nur wiederholen (`. .`). Sie müssen keine Suchbewegungen mehr verwenden, da die Suche nach dem nächsten Treffer jetzt Teil der Änderung ist!

Wenn Sie bearbeiten, achten Sie immer auf Bewegungen, die mehrere Dinge gleichzeitig tun können, wie `gn`, wann immer möglich.

## Lernen Sie den Punktbefehl auf die smarte Weise

Die Kraft des Punktbefehls kommt von dem Austausch mehrerer Tastenanschläge gegen einen. Es ist wahrscheinlich kein profitabler Austausch, den Punktbefehl für Einzel-Tastenoperationen wie `x` zu verwenden. Wenn Ihre letzte Änderung einen komplexen Vorgang wie `cgnconst<Esc>` erfordert, reduziert der Punktbefehl neun Tasteneingaben auf eine, ein sehr profitabler Tausch.

Beim Bearbeiten sollten Sie über Wiederholbarkeit nachdenken. Zum Beispiel, wenn ich die nächsten drei Wörter entfernen muss, ist es wirtschaftlicher, `d3w` zu verwenden oder `dw` dann `.` zwei Mal zu machen? Werden Sie ein Wort wieder löschen? Wenn ja, dann macht es Sinn, `dw` zu verwenden und es mehrere Male zu wiederholen, anstatt `d3w`, weil `dw` wiederverwendbarer ist als `d3w`. 

Der Punktbefehl ist ein vielseitiger Befehl zur Automatisierung einzelner Änderungen. In einem späteren Kapitel werden Sie lernen, wie Sie komplexere Aktionen mit Vim-Makros automatisieren können. Aber zuerst lernen wir über Register, um Text zu speichern und abzurufen.