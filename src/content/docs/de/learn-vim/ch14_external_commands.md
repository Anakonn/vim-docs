---
description: In diesem Dokument lernen Sie, wie Sie Vim erweitern, um externe Unix-Befehle
  nahtlos zu nutzen und deren Ausgabe in Ihren Editor zu integrieren.
title: Ch14. External Commands
---

Innerhalb des Unix-Systems finden Sie viele kleine, hyper-spezialisierte Befehle, die eine Aufgabe erledigen (und das gut). Sie können diese Befehle verketten, um zusammenzuarbeiten und ein komplexes Problem zu lösen. Wäre es nicht großartig, wenn Sie diese Befehle von innerhalb Vim verwenden könnten?

Definitiv. In diesem Kapitel lernen Sie, wie Sie Vim erweitern, um nahtlos mit externen Befehlen zu arbeiten.

## Der Bang-Befehl

Vim hat einen Bang (`!`) Befehl, der drei Dinge tun kann:

1. Lesen Sie die STDOUT eines externen Befehls in den aktuellen Puffer.
2. Schreiben Sie den Inhalt Ihres Puffers als STDIN an einen externen Befehl.
3. Führen Sie einen externen Befehl von innerhalb Vim aus.

Lassen Sie uns jeden einzelnen durchgehen.

## Lesen der STDOUT eines Befehls in Vim

Die Syntax, um die STDOUT eines externen Befehls in den aktuellen Puffer zu lesen, lautet:

```shell
:r !cmd
```

`:r` ist Vims Lese-Befehl. Wenn Sie ihn ohne `!` verwenden, können Sie ihn verwenden, um den Inhalt einer Datei zu erhalten. Wenn Sie eine Datei `file1.txt` im aktuellen Verzeichnis haben und Sie ausführen:

```shell
:r file1.txt
```

Wird Vim den Inhalt von `file1.txt` in den aktuellen Puffer einfügen.

Wenn Sie den Befehl `:r` gefolgt von einem `!` und einem externen Befehl ausführen, wird die Ausgabe dieses Befehls in den aktuellen Puffer eingefügt. Um das Ergebnis des `ls`-Befehls zu erhalten, führen Sie aus:

```shell
:r !ls
```

Es gibt etwas zurück wie:

```shell
file1.txt
file2.txt
file3.txt
```

Sie können die Daten vom `curl`-Befehl lesen:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

Der `r`-Befehl akzeptiert auch eine Adresse:

```shell
:10r !cat file1.txt
```

Jetzt wird die STDOUT von `cat file1.txt` nach Zeile 10 eingefügt.

## Schreiben des Pufferinhalts in einen externen Befehl

Der Befehl `:w` kann zusätzlich zum Speichern einer Datei verwendet werden, um den Text im aktuellen Puffer als STDIN für einen externen Befehl zu übergeben. Die Syntax lautet:

```shell
:w !cmd
```

Wenn Sie diese Ausdrücke haben:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Stellen Sie sicher, dass Sie [node](https://nodejs.org/en/) auf Ihrem Rechner installiert haben, und führen Sie dann aus:

```shell
:w !node
```

Vim wird `node` verwenden, um die JavaScript-Ausdrücke auszuführen, um "Hello Vim" und "Vim ist großartig" auszugeben.

Beim Verwenden des `:w`-Befehls verwendet Vim alle Texte im aktuellen Puffer, ähnlich dem globalen Befehl (die meisten Befehle in der Befehlszeile führen, wenn Sie keinen Bereich angeben, nur den Befehl gegen die aktuelle Zeile aus). Wenn Sie `:w` eine spezifische Adresse übergeben:

```shell
:2w !node
```

Verwendet Vim nur den Text aus der zweiten Zeile im `node`-Interpreter.

Es gibt einen subtilen, aber bedeutenden Unterschied zwischen `:w !node` und `:w! node`. Mit `:w !node` "schreiben" Sie den Text im aktuellen Puffer in den externen Befehl `node`. Mit `:w! node` speichern Sie eine Datei zwangsweise und benennen die Datei "node".

## Ausführen eines externen Befehls

Sie können einen externen Befehl von innerhalb Vim mit dem Bang-Befehl ausführen. Die Syntax lautet:

```shell
:!cmd
```

Um den Inhalt des aktuellen Verzeichnisses im langen Format anzuzeigen, führen Sie aus:

```shell
:!ls -ls
```

Um einen Prozess mit der PID 3456 zu beenden, können Sie ausführen:

```shell
:!kill -9 3456
```

Sie können jeden externen Befehl ausführen, ohne Vim zu verlassen, sodass Sie sich auf Ihre Aufgabe konzentrieren können.

## Filtern von Texten

Wenn Sie `!` einen Bereich geben, kann es zum Filtern von Texten verwendet werden. Angenommen, Sie haben die folgenden Texte:

```shell
hello vim
hello vim
```

Lassen Sie uns die aktuelle Zeile mit dem `tr` (translate)-Befehl in Großbuchstaben umwandeln. Führen Sie aus:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Das Ergebnis:

```shell
HELLO VIM
hello vim
```

Die Aufschlüsselung:
- `.!` führt den Filterbefehl auf der aktuellen Zeile aus.
- `tr '[:lower:]' '[:upper:]'` ruft den `tr`-Befehl auf, um alle Kleinbuchstaben durch Großbuchstaben zu ersetzen.

Es ist wichtig, einen Bereich anzugeben, um den externen Befehl als Filter auszuführen. Wenn Sie versuchen, den obigen Befehl ohne den `.` auszuführen (`:!tr '[:lower:]' '[:upper:]'`), sehen Sie einen Fehler.

Angenommen, Sie müssen die zweite Spalte in beiden Zeilen mit dem `awk`-Befehl entfernen:

```shell
:%!awk "{print $1}"
```

Das Ergebnis:

```shell
hello
hello
```

Die Aufschlüsselung:
- `:%!` führt den Filterbefehl auf allen Zeilen (`%`) aus.
- `awk "{print $1}"` druckt nur die erste Spalte der Übereinstimmung.

Sie können mehrere Befehle mit dem Verknüpfungsoperator (`|`) verketten, genau wie im Terminal. Angenommen, Sie haben eine Datei mit diesen köstlichen Frühstücksartikeln:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Wenn Sie sie nach dem Preis sortieren und nur das Menü mit gleichmäßigen Abständen anzeigen möchten, können Sie ausführen:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Das Ergebnis:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

Die Aufschlüsselung:
- `:%!` wendet den Filter auf alle Zeilen (`%`) an.
- `awk 'NR > 1'` zeigt die Texte nur ab Zeilennummer zwei an.
- `|` verknüpft den nächsten Befehl.
- `sort -nk 3` sortiert numerisch (`n`) unter Verwendung der Werte aus Spalte 3 (`k 3`).
- `column -t` organisiert den Text mit gleichmäßigen Abständen.

## Normalmodus-Befehl

Vim hat einen Filteroperator (`!`) im Normalmodus. Wenn Sie die folgenden Grüße haben:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Um die aktuelle Zeile und die darunter liegende Zeile in Großbuchstaben umzuwandeln, können Sie ausführen:
```shell
!jtr '[a-z]' '[A-Z]'
```

Die Aufschlüsselung:
- `!j` führt den normalen Befehlsfilteroperator (`!`) aus, der sich auf die aktuelle Zeile und die darunter liegende Zeile bezieht. Denken Sie daran, dass aufgrund der Tatsache, dass es sich um einen Normalmodus-Befehl handelt, die Grammatikregel `Verb + Nomen` gilt. `!` ist das Verb und `j` ist das Nomen.
- `tr '[a-z]' '[A-Z]'` ersetzt die Kleinbuchstaben durch die Großbuchstaben.

Der Filter-Normalbefehl funktioniert nur bei Bewegungen / Textobjekten, die mindestens eine Zeile oder länger sind. Wenn Sie versucht hätten, `!iwtr '[a-z]' '[A-Z]'` auszuführen (führen Sie `tr` auf dem inneren Wort aus), würden Sie feststellen, dass der `tr`-Befehl auf die gesamte Zeile angewendet wird, nicht auf das Wort, auf dem sich der Cursor befindet.

## Lernen Sie externe Befehle auf die smarte Weise

Vim ist kein IDE. Es ist ein leichtgewichtiger, modal gestalteter Editor, der von Natur aus hochgradig erweiterbar ist. Aufgrund dieser Erweiterbarkeit haben Sie einfachen Zugang zu jedem externen Befehl in Ihrem System. Bewaffnet mit diesen externen Befehlen ist Vim einen Schritt näher daran, ein IDE zu werden. Jemand sagte, dass das Unix-System das erste IDE aller Zeiten ist.

Der Bang-Befehl ist so nützlich, wie viele externe Befehle Sie kennen. Machen Sie sich keine Sorgen, wenn Ihr Wissen über externe Befehle begrenzt ist. Ich habe auch noch viel zu lernen. Betrachten Sie dies als Motivation für kontinuierliches Lernen. Wann immer Sie einen Text ändern müssen, schauen Sie, ob es einen externen Befehl gibt, der Ihr Problem lösen kann. Machen Sie sich keine Sorgen, alles zu meistern, lernen Sie einfach die, die Sie benötigen, um die aktuelle Aufgabe abzuschließen.