---
description: In diesem Kapitel lernen Sie, wie Sie in Vim Änderungen rückgängig machen,
  wiederherstellen und durch verschiedene Textzustände navigieren können.
title: Ch10. Undo
---

Wir alle machen alle Arten von Tippfehlern. Deshalb ist Rückgängig ein essentielles Feature in jeder modernen Software. Vims Rückgängig-System ist nicht nur in der Lage, einfache Fehler rückgängig zu machen und wiederherzustellen, sondern auch verschiedene Textzustände abzurufen, was Ihnen die Kontrolle über alle Texte gibt, die Sie jemals eingegeben haben. In diesem Kapitel lernen Sie, wie man rückgängig macht, wiederherstellt, einen Rückgängig-Zweig navigiert, Rückgängig speichert und durch die Zeit reist.

## Rückgängig, Wiederherstellen und UNDO

Um eine grundlegende Rückgängig-Funktion auszuführen, können Sie `u` verwenden oder `:undo` ausführen.

Wenn Sie diesen Text haben (beachten Sie die leere Zeile unter "one"):

```shell
one

```

Dann fügen Sie einen weiteren Text hinzu:

```shell
one
two
```

Wenn Sie `u` drücken, macht Vim den Text "two" rückgängig.

Wie weiß Vim, wie viel es rückgängig machen soll? Vim macht eine einzelne "Änderung" auf einmal rückgängig, ähnlich wie bei einer Punktbefehl-Änderung (im Gegensatz zum Punktbefehl zählen Befehle in der Befehlszeile ebenfalls als Änderung).

Um die letzte Änderung wiederherzustellen, drücken Sie `Ctrl-R` oder führen Sie `:redo` aus. Nachdem Sie den obigen Text rückgängig gemacht haben, um "two" zu entfernen, wird das Drücken von `Ctrl-R` den entfernten Text zurückbringen.

Vim hat auch UNDO, das Sie mit `U` ausführen können. Es macht alle letzten Änderungen rückgängig.

Wie unterscheidet sich `U` von `u`? Erstens entfernt `U` *alle* Änderungen in der zuletzt geänderten Zeile, während `u` nur eine Änderung auf einmal entfernt. Zweitens zählt das Ausführen von `u` nicht als Änderung, während das Ausführen von `U` als Änderung zählt.

Zurück zu diesem Beispiel:

```shell
one
two
```

Ändern Sie die zweite Zeile in "three":

```shell
one
three
```

Ändern Sie die zweite Zeile erneut und ersetzen Sie sie durch "four":

```shell
one
four
```

Wenn Sie `u` drücken, sehen Sie "three". Wenn Sie `u` erneut drücken, sehen Sie "two". Wenn Sie anstelle von `u` drücken, während Sie noch den Text "four" hatten, `U` gedrückt hätten, würden Sie sehen:

```shell
one

```

`U` umgeht alle Zwischenänderungen und geht zum ursprünglichen Zustand zurück, als Sie begonnen haben (eine leere Zeile). Darüber hinaus, da UNDO tatsächlich eine neue Änderung in Vim erstellt, können Sie Ihr UNDO rückgängig machen. `U` gefolgt von `U` macht sich selbst rückgängig. Sie können `U`, dann `U`, dann `U` usw. drücken. Sie werden sehen, dass sich dieselben beiden Textzustände hin und her umschalten.

Ich persönlich benutze `U` nicht, weil es schwer ist, sich an den ursprünglichen Zustand zu erinnern (ich brauche es selten).

Vim setzt eine maximale Anzahl von Rückgängig-Möglichkeiten in der Option `undolevels`. Sie können dies mit `:echo &undolevels` überprüfen. Ich habe meine auf 1000 gesetzt. Um Ihre auf 1000 zu ändern, führen Sie `:set undolevels=1000` aus. Fühlen Sie sich frei, es auf eine beliebige Zahl zu setzen, die Sie möchten.

## Blöcke aufbrechen

Ich habe zuvor erwähnt, dass `u` eine einzelne "Änderung" rückgängig macht, ähnlich wie die Änderung des Punktbefehls: Die Texte, die eingefügt werden, wenn Sie den Einfügemodus betreten, bis Sie ihn verlassen, zählen als Änderung.

Wenn Sie `ione two three<Esc>` eingeben und dann `u` drücken, entfernt Vim den gesamten Text "one two three", weil das Ganze als Änderung zählt. Das ist kein großes Problem, wenn Sie kurze Texte geschrieben haben, aber was ist, wenn Sie mehrere Absätze innerhalb einer Sitzung im Einfügemodus geschrieben haben, ohne den Modus zu verlassen, und später feststellen, dass Sie einen Fehler gemacht haben? Wenn Sie `u` drücken, wird alles, was Sie geschrieben haben, entfernt. Wäre es nicht nützlich, wenn Sie `u` drücken könnten, um nur einen Abschnitt Ihres Textes zu entfernen?

Glücklicherweise können Sie die Rückgängig-Blöcke aufbrechen. Wenn Sie im Einfügemodus tippen, erstellt das Drücken von `Ctrl-G u` einen Rückgängig-Breakpoint. Wenn Sie beispielsweise `ione <Ctrl-G u>two <Ctrl-G u>three<Esc>` eingeben und dann `u` drücken, verlieren Sie nur den Text "three" (drücken Sie `u` ein weiteres Mal, um "two" zu entfernen). Wenn Sie einen langen Text schreiben, verwenden Sie `Ctrl-G u` strategisch. Das Ende jedes Satzes, zwischen zwei Absätzen oder nach jeder Codezeile sind ideale Stellen, um Rückgängig-Breakpoints hinzuzufügen, um es einfacher zu machen, Ihre Fehler rückgängig zu machen, falls Sie jemals einen machen.

Es ist auch nützlich, einen Rückgängig-Breakpoint zu erstellen, wenn Sie im Einfügemodus mit `Ctrl-W` (das Wort vor dem Cursor löschen) und `Ctrl-U` (alle Texte vor dem Cursor löschen) Blöcke löschen. Ein Freund schlug vor, die folgenden Mappings zu verwenden:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Mit diesen können Sie die gelöschten Texte leicht wiederherstellen.

## Rückgängig-Baum

Vim speichert jede Änderung, die jemals geschrieben wurde, in einem Rückgängig-Baum. Starten Sie eine neue leere Datei. Fügen Sie dann einen neuen Text hinzu:

```shell
one

```

Fügen Sie einen neuen Text hinzu:

```shell
one
two
```

Machen Sie einmal rückgängig:

```shell
one

```

Fügen Sie einen anderen Text hinzu:

```shell
one
three
```

Machen Sie erneut rückgängig:

```shell
one

```

Und fügen Sie einen weiteren anderen Text hinzu:

```shell
one
four
```

Jetzt, wenn Sie rückgängig machen, verlieren Sie den Text "four", den Sie gerade hinzugefügt haben:

```shell
one

```

Wenn Sie noch einmal rückgängig machen:

```shell

```

Verlieren Sie den Text "one". In den meisten Texteditoren wäre es unmöglich, die Texte "two" und "three" zurückzubekommen, aber nicht mit Vim! Drücken Sie `g+` und Sie erhalten Ihren Text "one" zurück:

```shell
one

```

Tippen Sie `g+` erneut und Sie werden einen alten Freund sehen:

```shell
one
two
```

Lassen Sie uns weitermachen. Drücken Sie erneut `g+`:

```shell
one
three
```

Drücken Sie ein weiteres Mal `g+`:

```shell
one
four
```

In Vim speichert Vim jedes Mal, wenn Sie `u` drücken und dann eine andere Änderung vornehmen, den Text des vorherigen Zustands, indem es einen "Rückgängig-Zweig" erstellt. In diesem Beispiel haben Sie, nachdem Sie "two" eingegeben haben, dann `u` gedrückt haben und dann "three" eingegeben haben, einen Blattzweig erstellt, der den Zustand mit dem Text "two" speichert. In diesem Moment enthielt der Rückgängig-Baum mindestens zwei Blattknoten: den Hauptknoten mit dem Text "three" (am aktuellsten) und den Rückgängig-Zweigknoten mit dem Text "two". Wenn Sie ein weiteres Rückgängig gemacht und den Text "four" eingegeben hätten, hätten Sie drei Knoten: einen Hauptknoten mit dem Text "four" und zwei Knoten mit den Texten "three" und "two".

Um durch jeden Knoten des Rückgängig-Baums zu navigieren, können Sie `g+` verwenden, um zu einem neueren Zustand zu gelangen, und `g-`, um zu einem älteren Zustand zu gelangen. Der Unterschied zwischen `u`, `Ctrl-R`, `g+` und `g-` besteht darin, dass sowohl `u` als auch `Ctrl-R` nur die *Hauptknoten* im Rückgängig-Baum durchlaufen, während `g+` und `g-` *alle* Knoten im Rückgängig-Baum durchlaufen.

Der Rückgängig-Baum ist nicht leicht zu visualisieren. Ich finde das [vim-mundo](https://github.com/simnalamburt/vim-mundo) Plugin sehr nützlich, um Vims Rückgängig-Baum zu visualisieren. Geben Sie ihm etwas Zeit, um damit zu experimentieren.

## Persistentes Rückgängig

Wenn Sie Vim starten, eine Datei öffnen und sofort `u` drücken, zeigt Vim wahrscheinlich die Warnung "*Bereits bei der ältesten Änderung*" an. Es gibt nichts, was rückgängig gemacht werden kann, weil Sie keine Änderungen vorgenommen haben.

Um die Rückgängig-Historie aus der letzten Bearbeitungssitzung zu übertragen, kann Vim Ihre Rückgängig-Historie mit einer Rückgängig-Datei mit `:wundo` speichern.

Erstellen Sie eine Datei `mynumbers.txt`. Tippen Sie:

```shell
one
```

Tippen Sie dann eine weitere Zeile (stellen Sie sicher, dass jede Zeile als Änderung zählt):

```shell
one
two
```

Tippen Sie eine weitere Zeile:

```shell
one
two
three
```

Erstellen Sie jetzt Ihre Rückgängig-Datei mit `:wundo {my-undo-file}`. Wenn Sie eine vorhandene Rückgängig-Datei überschreiben müssen, können Sie `!` nach `wundo` hinzufügen.

```shell
:wundo! mynumbers.undo
```

Verlassen Sie dann Vim.

Bis jetzt sollten Sie die Dateien `mynumbers.txt` und `mynumbers.undo` in Ihrem Verzeichnis haben. Öffnen Sie `mynumbers.txt` erneut und versuchen Sie, `u` zu drücken. Sie können nicht. Sie haben seit dem Öffnen der Datei keine Änderungen vorgenommen. Laden Sie jetzt Ihre Rückgängig-Historie, indem Sie die Rückgängig-Datei mit `:rundo` lesen:

```shell
:rundo mynumbers.undo
```

Jetzt, wenn Sie `u` drücken, entfernt Vim "three". Drücken Sie erneut `u`, um "two" zu entfernen. Es ist, als hätten Sie Vim nie geschlossen!

Wenn Sie eine automatische Rückgängig-Persistenz haben möchten, können Sie dies tun, indem Sie Folgendes in vimrc hinzufügen:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

Die obige Einstellung platziert alle Rückgängig-Dateien in einem zentralen Verzeichnis, dem Verzeichnis `~/.vim`. Der Name `undo_dir` ist willkürlich. `set undofile` sagt Vim, dass die `undofile`-Funktion aktiviert werden soll, da sie standardmäßig deaktiviert ist. Jetzt, wann immer Sie speichern, erstellt und aktualisiert Vim automatisch die relevante Datei im Verzeichnis `undo_dir` (stellen Sie sicher, dass Sie das tatsächliche Verzeichnis `undo_dir` im Verzeichnis `~/.vim` erstellen, bevor Sie dies ausführen).

## Zeitreise

Wer sagt, dass Zeitreisen nicht existieren? Vim kann zu einem Textzustand in der Vergangenheit mit dem Befehl `:earlier` reisen.

Wenn Sie diesen Text haben:

```shell
one

```
Dann fügen Sie später hinzu:

```shell
one
two
```

Wenn Sie "two" vor weniger als zehn Sekunden eingegeben haben, können Sie zu dem Zustand zurückkehren, in dem "two" vor zehn Sekunden nicht existierte, mit:

```shell
:earlier 10s
```

Sie können `:undolist` verwenden, um zu sehen, wann die letzte Änderung vorgenommen wurde. `:earlier` akzeptiert auch verschiedene Argumente:

```shell
:earlier 10s    Gehe zu dem Zustand vor 10 Sekunden
:earlier 10m    Gehe zu dem Zustand vor 10 Minuten
:earlier 10h    Gehe zu dem Zustand vor 10 Stunden
:earlier 10d    Gehe zu dem Zustand vor 10 Tagen
```

Darüber hinaus akzeptiert es auch eine reguläre `count` als Argument, um Vim zu sagen, dass es `count` Mal zu einem älteren Zustand gehen soll. Wenn Sie beispielsweise `:earlier 2` ausführen, wird Vim zu einem älteren Textzustand vor zwei Änderungen zurückkehren. Es ist dasselbe wie zweimal `g-` zu drücken. Sie können es auch anweisen, zu dem älteren Textzustand vor 10 Speichervorgängen mit `:earlier 10f` zu gehen.

Das gleiche Set von Argumenten funktioniert mit dem Gegenstück zu `:earlier`: `:later`.

```shell
:later 10s    Gehe zu dem Zustand 10 Sekunden später
:later 10m    Gehe zu dem Zustand 10 Minuten später
:later 10h    Gehe zu dem Zustand 10 Stunden später
:later 10d    Gehe zu dem Zustand 10 Tagen später
:later 10     Gehe zu dem neueren Zustand 10 Mal
:later 10f    Gehe zu dem Zustand 10 Speichervorgängen später
```

## Lernen Sie Rückgängig auf die smarte Weise

`u` und `Ctrl-R` sind zwei unverzichtbare Vim-Befehle zur Korrektur von Fehlern. Lernen Sie sie zuerst. Lernen Sie dann, wie man `:earlier` und `:later` mit den Zeitargumenten verwendet. Nehmen Sie sich danach Zeit, um den Rückgängig-Baum zu verstehen. Das [vim-mundo](https://github.com/simnalamburt/vim-mundo) Plugin hat mir sehr geholfen. Tippen Sie die Texte in diesem Kapitel mit und überprüfen Sie den Rückgängig-Baum, während Sie jede Änderung vornehmen. Sobald Sie es verstanden haben, werden Sie das Rückgängig-System nie wieder auf die gleiche Weise sehen.

Vor diesem Kapitel haben Sie gelernt, wie man jeden Text in einem Projektbereich findet. Mit Rückgängig können Sie jetzt jeden Text in einer Zeitdimension finden. Sie sind jetzt in der Lage, jeden Text nach seinem Standort und der Zeit, in der er geschrieben wurde, zu suchen. Sie haben Vim-Omnipräsenz erreicht.