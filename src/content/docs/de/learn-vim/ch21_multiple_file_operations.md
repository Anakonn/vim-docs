---
description: In diesem Dokument lernen Sie verschiedene Methoden zur Bearbeitung mehrerer
  Dateien in Vim, einschließlich der Verwendung von Befehlen wie `argdo` und `cdo`.
title: Ch21. Multiple File Operations
---

In der Lage zu sein, in mehreren Dateien zu aktualisieren, ist ein weiteres nützliches Bearbeitungswerkzeug. Zuvor haben Sie gelernt, wie man mehrere Texte mit `cfdo` aktualisiert. In diesem Kapitel lernen Sie die verschiedenen Möglichkeiten kennen, wie Sie mehrere Dateien in Vim bearbeiten können.

## Verschiedene Möglichkeiten, einen Befehl in mehreren Dateien auszuführen

Vim hat acht Möglichkeiten, Befehle in mehreren Dateien auszuführen:
- arg list (`argdo`)
- buffer list (`bufdo`)
- window list (`windo`)
- tab list (`tabdo`)
- quickfix list (`cdo`)
- quickfix list filewise (`cfdo`)
- location list (`ldo`)
- location list filewise (`lfdo`)

Praktisch gesehen werden Sie wahrscheinlich nur ein oder zwei davon die meiste Zeit verwenden (ich persönlich benutze `cdo` und `argdo` mehr als andere), aber es ist gut, über alle verfügbaren Optionen Bescheid zu wissen und die zu verwenden, die zu Ihrem Bearbeitungsstil passen.

Acht Befehle zu lernen, mag entmutigend erscheinen. Aber in Wirklichkeit funktionieren diese Befehle ähnlich. Nachdem Sie einen gelernt haben, wird das Lernen der anderen einfacher. Sie teilen sich alle die gleiche große Idee: Erstellen Sie eine Liste ihrer jeweiligen Kategorien und übergeben Sie ihnen den Befehl, den Sie ausführen möchten.

## Argumentliste

Die Argumentliste ist die grundlegendste Liste. Sie erstellt eine Liste von Dateien. Um eine Liste von file1, file2 und file3 zu erstellen, können Sie Folgendes ausführen:

```shell
:args file1 file2 file3
```

Sie können auch ein Wildcard (`*`) übergeben, also wenn Sie eine Liste aller `.js`-Dateien im aktuellen Verzeichnis erstellen möchten, führen Sie Folgendes aus:

```shell
:args *.js
```

Wenn Sie eine Liste aller Javascript-Dateien erstellen möchten, die mit "a" im aktuellen Verzeichnis beginnen, führen Sie Folgendes aus:

```shell
:args a*.js
```

Das Wildcard passt zu einem oder mehreren beliebigen Dateinamenzeichen im aktuellen Verzeichnis, aber was ist, wenn Sie rekursiv in einem beliebigen Verzeichnis suchen müssen? Sie können das doppelte Wildcard (`**`) verwenden. Um alle Javascript-Dateien in den Verzeichnissen innerhalb Ihres aktuellen Standorts zu erhalten, führen Sie Folgendes aus:

```shell
:args **/*.js
```

Sobald Sie den `args`-Befehl ausführen, wird Ihr aktueller Puffer auf das erste Element in der Liste umgeschaltet. Um die Liste der Dateien anzuzeigen, die Sie gerade erstellt haben, führen Sie `:args` aus. Nachdem Sie Ihre Liste erstellt haben, können Sie sie durchlaufen. `:first` bringt Sie zum ersten Element in der Liste. `:last` bringt Sie zum letzten Element in der Liste. Um die Liste um eine Datei vorwärts zu bewegen, führen Sie `:next` aus. Um die Liste um eine Datei rückwärts zu bewegen, führen Sie `:prev` aus. Um vorwärts/rückwärts um eine Datei zu bewegen und die Änderungen zu speichern, führen Sie `:wnext` und `:wprev` aus. Es gibt viele weitere Navigationsbefehle. Schauen Sie sich `:h arglist` für mehr an.

Die Argumentliste ist nützlich, wenn Sie einen bestimmten Dateityp oder einige Dateien anvisieren müssen. Vielleicht müssen Sie alle "donut" in "pancake" in allen `yml`-Dateien aktualisieren, Sie können Folgendes tun:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Wenn Sie den `args`-Befehl erneut ausführen, wird die vorherige Liste ersetzt. Zum Beispiel, wenn Sie zuvor Folgendes ausgeführt haben:

```shell
:args file1 file2 file3
```

Vorausgesetzt, diese Dateien existieren, haben Sie jetzt eine Liste von `file1`, `file2` und `file3`. Dann führen Sie Folgendes aus:

```shell
:args file4 file5
```

Ihre ursprüngliche Liste von `file1`, `file2` und `file3` wird durch `file4` und `file5` ersetzt. Wenn Sie `file1`, `file2` und `file3` in Ihrer Argumentliste haben und `file4` und `file5` zu Ihrer ursprünglichen Dateiliste *hinzufügen* möchten, verwenden Sie den Befehl `:arga`. Führen Sie Folgendes aus:

```shell
:arga file4 file5
```

Jetzt haben Sie `file1`, `file2`, `file3`, `file4` und `file5` in Ihrer Argumentliste.

Wenn Sie `:arga` ohne Argumente ausführen, fügt Vim Ihren aktuellen Puffer zur aktuellen Argumentliste hinzu. Wenn Sie bereits `file1`, `file2` und `file3` in Ihrer Argumentliste haben und Ihr aktueller Puffer auf `file5` ist, fügt das Ausführen von `:arga` `file5` zur Liste hinzu.

Sobald Sie die Liste haben, können Sie sie mit beliebigen Befehlen Ihrer Wahl über die Befehlszeile übergeben. Sie haben gesehen, dass dies mit der Substitution (`:argdo %s/donut/pancake/g`) gemacht wurde. Einige andere Beispiele:
- Um alle Zeilen zu löschen, die "dessert" in der Argumentliste enthalten, führen Sie `:argdo g/dessert/d`.
- Um das Makro a auszuführen (vorausgesetzt, Sie haben etwas im Makro a aufgezeichnet) in der Argumentliste, führen Sie `:argdo norm @a` aus.
- Um "hello " gefolgt vom Dateinamen in der ersten Zeile zu schreiben, führen Sie `:argdo 0put='hello ' .. @:` aus.

Wenn Sie fertig sind, vergessen Sie nicht, sie mit `:update` zu speichern.

Manchmal müssen Sie die Befehle nur auf den ersten n Elementen der Argumentliste ausführen. Wenn das der Fall ist, übergeben Sie einfach dem `argdo`-Befehl eine Adresse. Zum Beispiel, um den Substitutionsbefehl nur auf den ersten 3 Elementen der Liste auszuführen, führen Sie `:1,3argdo %s/donut/pancake/g` aus.

## Bufferliste

Die Bufferliste wird organisch erstellt, wenn Sie neue Dateien bearbeiten, da Vim jedes Mal, wenn Sie eine neue Datei erstellen / eine Datei öffnen, sie in einem Puffer speichert (es sei denn, Sie löschen sie ausdrücklich). Wenn Sie also bereits 3 Dateien geöffnet haben: `file1.rb file2.rb file3.rb`, haben Sie bereits 3 Elemente in Ihrer Bufferliste. Um die Bufferliste anzuzeigen, führen Sie `:buffers` aus (alternativ: `:ls` oder `:files`). Um vorwärts und rückwärts zu navigieren, verwenden Sie `:bnext` und `:bprev`. Um zum ersten und letzten Puffer aus der Liste zu gelangen, verwenden Sie `:bfirst` und `:blast` (haben Sie schon Spaß? :D).

Übrigens, hier ist ein cooler Puffertrick, der nichts mit diesem Kapitel zu tun hat: Wenn Sie eine Anzahl von Elementen in Ihrer Bufferliste haben, können Sie alle mit `:ball` (alle Puffer) anzeigen. Der `ball`-Befehl zeigt alle Puffer horizontal an. Um sie vertikal anzuzeigen, führen Sie `:vertical ball` aus.

Zurück zum Thema, die Mechanik, um Operationen über alle Puffer auszuführen, ist ähnlich wie bei der Argumentliste. Sobald Sie Ihre Bufferliste erstellt haben, müssen Sie nur die Befehle, die Sie ausführen möchten, mit `:bufdo` anstelle von `:argdo` voranstellen. Wenn Sie also alle "donut" durch "pancake" in allen Puffern ersetzen und die Änderungen speichern möchten, führen Sie Folgendes aus:

```shell
:bufdo %s/donut/pancake/g | update
```

## Fenster- und Tabliste

Die Fenster- und Tablisten sind ebenfalls ähnlich wie die Argument- und Bufferlisten. Der einzige Unterschied sind ihr Kontext und ihre Syntax.

Fensteroperationen werden in jedem offenen Fenster durchgeführt und mit `:windo` ausgeführt. Tab-Operationen werden in jedem Tab durchgeführt, den Sie geöffnet haben, und mit `:tabdo` ausgeführt. Für mehr Informationen schauen Sie sich `:h list-repeat`, `:h :windo` und `:h :tabdo` an.

Wenn Sie beispielsweise drei Fenster geöffnet haben (Sie können neue Fenster mit `Ctrl-W v` für ein vertikales Fenster und `Ctrl-W s` für ein horizontales Fenster öffnen) und Sie führen `:windo 0put ='hello' . @%` aus, wird Vim "hello" + Dateiname in alle offenen Fenster ausgeben.

## Quickfix-Liste

In den vorherigen Kapiteln (Kapitel 3 und Kapitel 19) habe ich über Quickfixes gesprochen. Quickfix hat viele Anwendungen. Viele beliebte Plugins verwenden Quickfixes, daher ist es gut, mehr Zeit damit zu verbringen, sie zu verstehen.

Wenn Sie neu in Vim sind, könnte Quickfix ein neues Konzept sein. In den alten Tagen, als Sie Ihren Code tatsächlich explizit kompilieren mussten, würden Sie während der Kompilierungsphase auf Fehler stoßen. Um diese Fehler anzuzeigen, benötigen Sie ein spezielles Fenster. Hier kommt Quickfix ins Spiel. Wenn Sie Ihren Code kompilieren, zeigt Vim Fehlermeldungen im Quickfix-Fenster an, damit Sie sie später beheben können. Viele moderne Sprachen erfordern keine explizite Kompilierung mehr, aber das macht Quickfix nicht obsolet. Heutzutage verwenden die Leute Quickfix für alle möglichen Dinge, wie das Anzeigen einer virtuellen Terminalausgabe und das Speichern von Suchergebnissen. Lassen Sie uns auf letzteres konzentrieren, das Speichern von Suchergebnissen.

Neben den Kompilierungsbefehlen verlassen sich bestimmte Vim-Befehle auf Quickfix-Schnittstellen. Eine Art von Befehl, die Quickfixes stark nutzt, sind die Suchbefehle. Sowohl `:vimgrep` als auch `:grep` verwenden standardmäßig Quickfixes.

Wenn Sie beispielsweise nach "donut" in allen Javascript-Dateien rekursiv suchen müssen, können Sie Folgendes ausführen:

```shell
:vimgrep /donut/ **/*.js
```

Das Ergebnis der "donut"-Suche wird im Quickfix-Fenster gespeichert. Um diese Übereinstimmungsergebnisse im Quickfix-Fenster anzuzeigen, führen Sie Folgendes aus:

```shell
:copen
```

Um es zu schließen, führen Sie Folgendes aus:

```shell
:cclose
```

Um die Quickfix-Liste vorwärts und rückwärts zu durchlaufen, führen Sie Folgendes aus:

```shell
:cnext
:cprev
```

Um zum ersten und letzten Element in der Übereinstimmung zu gelangen, führen Sie Folgendes aus:

```shell
:cfirst
:clast
```

Früher habe ich erwähnt, dass es zwei Quickfix-Befehle gibt: `cdo` und `cfdo`. Wie unterscheiden sie sich? `cdo` führt den Befehl für jedes Element in der Quickfix-Liste aus, während `cfdo` den Befehl für jede *Datei* in der Quickfix-Liste ausführt.

Lassen Sie mich das klarstellen. Angenommen, nachdem Sie den oben genannten `vimgrep`-Befehl ausgeführt haben, haben Sie:
- 1 Ergebnis in `file1.js`
- 10 Ergebnisse in `file2.js`

Wenn Sie `:cfdo %s/donut/pancake/g` ausführen, wird dies effektiv `%s/donut/pancake/g` einmal in `file1.js` und einmal in `file2.js` ausführen. Es wird *so oft ausgeführt, wie es Dateien in der Übereinstimmung gibt.* Da es zwei Dateien in den Ergebnissen gibt, führt Vim den Substitutionsbefehl einmal in `file1.js` und einmal mehr in `file2.js` aus, obwohl es 10 Übereinstimmungen in der zweiten Datei gibt. `cfdo` interessiert sich nur dafür, wie viele Dateien insgesamt in der Quickfix-Liste sind.

Wenn Sie `:cdo %s/donut/pancake/g` ausführen, wird dies effektiv `%s/donut/pancake/g` einmal in `file1.js` und *zehnmal* in `file2.js` ausführen. Es wird so oft ausgeführt, wie es tatsächliche Elemente in der Quickfix-Liste gibt. Da nur eine Übereinstimmung in `file1.js` und 10 Übereinstimmungen in `file2.js` gefunden wurden, wird es insgesamt 11 Mal ausgeführt.

Da Sie `%s/donut/pancake/g` ausgeführt haben, wäre es sinnvoll, `cfdo` zu verwenden. Es machte keinen Sinn, `cdo` zu verwenden, da es `%s/donut/pancake/g` zehnmal in `file2.js` ausführen würde (`%s` ist eine dateiweite Substitution). Es reicht aus, `%s` einmal pro Datei auszuführen. Wenn Sie `cdo` verwendet hätten, wäre es sinnvoller gewesen, es mit `s/donut/pancake/g` zu übergeben.

Wenn Sie entscheiden, ob Sie `cfdo` oder `cdo` verwenden möchten, denken Sie an den Befehlsbereich, den Sie übergeben. Ist dies ein dateiweiter Befehl (wie `:%s` oder `:g`) oder ein zeilenweiser Befehl (wie `:s` oder `:!`)?

## Standortliste

Die Standortliste ist ähnlich wie die Quickfix-Liste, da Vim ebenfalls ein spezielles Fenster verwendet, um Nachrichten anzuzeigen. Der Unterschied zwischen einer Quickfix-Liste und einer Standortliste besteht darin, dass Sie zu jedem Zeitpunkt nur eine Quickfix-Liste haben können, während Sie so viele Standortlisten haben können, wie Fenster.

Angenommen, Sie haben zwei Fenster geöffnet, ein Fenster zeigt `food.txt` und ein anderes zeigt `drinks.txt`. Aus `food.txt` heraus führen Sie einen Standortlisten-Suchbefehl `:lvimgrep` (die Standortvariante des `:vimgrep`-Befehls) aus:

```shell
:lvim /bagel/ **/*.md
```

Vim erstellt eine Standortliste aller Bagel-Suchübereinstimmungen für das `food.txt` *Fenster*. Sie können die Standortliste mit `:lopen` anzeigen. Gehen Sie jetzt zum anderen Fenster `drinks.txt` und führen Sie Folgendes aus:

```shell
:lvimgrep /milk/ **/*.md
```

Vim erstellt eine *separate* Standortliste mit allen Milch-Suchergebnissen für das `drinks.txt` *Fenster*.

Für jeden Standortbefehl, den Sie in jedem Fenster ausführen, erstellt Vim eine eigene Standortliste. Wenn Sie 10 verschiedene Fenster haben, können Sie bis zu 10 verschiedene Standortlisten haben. Im Gegensatz dazu können Sie bei der Quickfix-Liste jederzeit nur eine haben. Wenn Sie 10 verschiedene Fenster haben, erhalten Sie immer noch nur eine Quickfix-Liste.

Die meisten der Standortlistenbefehle sind ähnlich wie die Quickfix-Befehle, außer dass sie stattdessen mit `l-` vorangestellt sind. Zum Beispiel: `:lvimgrep`, `:lgrep` und `:lmake` vs `:vimgrep`, `:grep` und `:make`. Um das Fenster der Standortliste zu manipulieren, sehen die Befehle wieder ähnlich aus wie die Quickfix-Befehle `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext` und `:lprev` vs `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext` und `:cprev`.

Die beiden Standortlisten-Multi-Datei-Befehle sind ebenfalls ähnlich wie die Quickfix-Multi-Datei-Befehle: `:ldo` und `:lfdo`. `:ldo` führt den Standortbefehl in jeder Standortliste aus, während `:lfdo` den Standortlistenbefehl für jede Datei in der Standortliste ausführt. Für mehr Informationen schauen Sie sich `:h location-list` an.
## Mehrere Dateioperationen in Vim ausführen

Zu wissen, wie man eine Mehrfachdateioperation durchführt, ist eine nützliche Fähigkeit beim Bearbeiten. Wann immer Sie einen Variablennamen in mehreren Dateien ändern müssen, möchten Sie dies in einem Rutsch ausführen. Vim bietet acht verschiedene Möglichkeiten, dies zu tun.

Praktisch gesehen werden Sie wahrscheinlich nicht alle acht gleich häufig nutzen. Sie werden sich zu einer oder zwei Methoden hingezogen fühlen. Wenn Sie anfangen, wählen Sie eine (ich persönlich empfehle, mit der Argumentliste `:argdo` zu beginnen) und meistern Sie sie. Sobald Sie mit einer vertraut sind, lernen Sie die nächste. Sie werden feststellen, dass das Lernen der zweiten, dritten und vierten einfacher wird. Seien Sie kreativ. Verwenden Sie es mit verschiedenen Kombinationen. Üben Sie weiter, bis Sie dies mühelos und ohne viel Nachdenken tun können. Machen Sie es zu einem Teil Ihres Muskelgedächtnisses.

Damit haben Sie das Vim-Bearbeiten gemeistert. Herzlichen Glückwunsch!