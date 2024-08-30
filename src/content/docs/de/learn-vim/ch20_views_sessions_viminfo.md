---
description: In diesem Kapitel lernen Sie, wie Sie mit View, Session und Viminfo eine
  "Momentaufnahme" Ihrer Projekte in Vim speichern können.
title: Ch20. Views, Sessions, and Viminfo
---

Nachdem Sie eine Weile an einem Projekt gearbeitet haben, stellen Sie möglicherweise fest, dass das Projekt allmählich Gestalt annimmt mit eigenen Einstellungen, Faltungen, Puffern, Layouts usw. Es ist, als würde man seine Wohnung nach einer gewissen Zeit dekorieren. Das Problem ist, dass Sie beim Schließen von Vim diese Änderungen verlieren. Wäre es nicht schön, wenn Sie diese Änderungen behalten könnten, sodass Vim beim nächsten Öffnen genau so aussieht, als hätten Sie nie verlassen?

In diesem Kapitel lernen Sie, wie Sie View, Session und Viminfo verwenden, um einen "Schnappschuss" Ihrer Projekte zu bewahren.

## View

Eine View ist die kleinste Teilmenge der drei (View, Session, Viminfo). Es ist eine Sammlung von Einstellungen für ein Fenster. Wenn Sie lange an einem Fenster gearbeitet haben und die Karten und Faltungen bewahren möchten, können Sie eine View verwenden.

Lassen Sie uns eine Datei namens `foo.txt` erstellen:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

In dieser Datei erstellen Sie drei Änderungen:
1. Erstellen Sie in Zeile 1 eine manuelle Faltung `zf4j` (falten Sie die nächsten 4 Zeilen).
2. Ändern Sie die Einstellung `number`: `setlocal nonumber norelativenumber`. Dies entfernt die Zahlenanzeigen auf der linken Seite des Fensters.
3. Erstellen Sie eine lokale Zuordnung, um bei jedem Drücken von `j` zwei Zeilen nach unten zu gehen, anstatt nur eine: `:nnoremap <buffer> j jj`.

Ihre Datei sollte so aussehen:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Konfigurieren von View-Attributen

Führen Sie aus:

```shell
:set viewoptions?
```

Standardmäßig sollte es sagen (Ihre könnte je nach Ihrer vimrc anders aussehen):

```shell
viewoptions=folds,cursor,curdir
```

Lassen Sie uns `viewoptions` konfigurieren. Die drei Attribute, die Sie bewahren möchten, sind die Faltungen, die Karten und die lokalen Setoptionen. Wenn Ihre Einstellung wie meine aussieht, haben Sie bereits die Option `folds`. Sie müssen View mitteilen, dass es die `localoptions` speichern soll. Führen Sie aus:

```shell
:set viewoptions+=localoptions
```

Um zu erfahren, welche anderen Optionen für `viewoptions` verfügbar sind, schauen Sie sich `:h viewoptions` an. Wenn Sie jetzt `:set viewoptions?` ausführen, sollten Sie sehen:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Speichern der View

Mit dem korrekt gefalteten `foo.txt`-Fenster und den Optionen `nonumber norelativenumber` lassen Sie uns die View speichern. Führen Sie aus:

```shell
:mkview
```

Vim erstellt eine View-Datei.

### View-Dateien

Sie fragen sich vielleicht: "Wo hat Vim diese View-Datei gespeichert?" Um zu sehen, wo Vim sie speichert, führen Sie aus:

```shell
:set viewdir?
```

In Unix-basierten Betriebssystemen sollte standardmäßig `~/.vim/view` angezeigt werden (wenn Sie ein anderes Betriebssystem haben, könnte ein anderer Pfad angezeigt werden. Schauen Sie sich `:h viewdir` für mehr Informationen an). Wenn Sie ein Unix-basiertes Betriebssystem verwenden und es auf einen anderen Pfad ändern möchten, fügen Sie dies in Ihre vimrc ein:

```shell
set viewdir=$HOME/else/where
```

### Laden der View-Datei

Schließen Sie `foo.txt`, falls Sie dies noch nicht getan haben, und öffnen Sie `foo.txt` erneut. **Sie sollten den ursprünglichen Text ohne die Änderungen sehen.** Das ist zu erwarten.

Um den Zustand wiederherzustellen, müssen Sie die View-Datei laden. Führen Sie aus:

```shell
:loadview
```

Jetzt sollten Sie sehen:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Die Faltungen, lokalen Einstellungen und lokalen Zuordnungen sind wiederhergestellt. Wenn Sie bemerken, sollte sich Ihr Cursor auch auf der Zeile befinden, wo Sie ihn gelassen haben, als Sie `:mkview` ausgeführt haben. Solange Sie die Option `cursor` haben, merkt sich View auch Ihre Cursorposition.

### Mehrere Views

Vim erlaubt es Ihnen, 9 nummerierte Views (1-9) zu speichern.

Angenommen, Sie möchten eine zusätzliche Faltung erstellen (sagen wir, Sie möchten die letzten beiden Zeilen falten) mit `:9,10 fold`. Lassen Sie uns dies als View 1 speichern. Führen Sie aus:

```shell
:mkview 1
```

Wenn Sie eine weitere Faltung mit `:6,7 fold` erstellen und sie als eine andere View speichern möchten, führen Sie aus:

```shell
:mkview 2
```

Schließen Sie die Datei. Wenn Sie `foo.txt` öffnen und View 1 laden möchten, führen Sie aus:

```shell
:loadview 1
```

Um View 2 zu laden, führen Sie aus:

```shell
:loadview 2
```

Um die ursprüngliche View zu laden, führen Sie aus:

```shell
:loadview
```

### Automatisierung der View-Erstellung

Eine der schlimmsten Dinge, die passieren können, ist, dass Sie nach unzähligen Stunden, in denen Sie eine große Datei mit Faltungen organisiert haben, versehentlich das Fenster schließen und alle Faltinformationen verlieren. Um dies zu verhindern, möchten Sie möglicherweise automatisch eine View erstellen, jedes Mal, wenn Sie einen Puffer schließen. Fügen Sie dies in Ihre vimrc ein:

```shell
autocmd BufWinLeave *.txt mkview
```

Zusätzlich könnte es schön sein, die View zu laden, wenn Sie einen Puffer öffnen:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Jetzt müssen Sie sich keine Sorgen mehr machen, eine View zu erstellen und zu laden, wenn Sie mit `txt`-Dateien arbeiten. Denken Sie daran, dass im Laufe der Zeit Ihr `~/.vim/view` möglicherweise anfängt, View-Dateien anzusammeln. Es ist gut, es alle paar Monate aufzuräumen.

## Sessions

Wenn eine View die Einstellungen eines Fensters speichert, speichert eine Session die Informationen aller Fenster (einschließlich des Layouts).

### Erstellen einer neuen Session

Angenommen, Sie arbeiten mit diesen 3 Dateien in einem `foobarbaz`-Projekt:

In `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

In `bar.txt`:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

In `baz.txt`:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Jetzt sagen wir, dass Sie Ihre Fenster mit `:split` und `:vsplit` geteilt haben. Um dieses Aussehen zu bewahren, müssen Sie die Session speichern. Führen Sie aus:

```shell
:mksession
```

Im Gegensatz zu `mkview`, das standardmäßig in `~/.vim/view` speichert, speichert `mksession` eine Session-Datei (`Session.vim`) im aktuellen Verzeichnis. Überprüfen Sie die Datei, wenn Sie neugierig sind, was darin steht.

Wenn Sie die Session-Datei an einem anderen Ort speichern möchten, können Sie ein Argument an `mksession` übergeben:

```shell
:mksession ~/some/where/else.vim
```

Wenn Sie die vorhandene Session-Datei überschreiben möchten, rufen Sie den Befehl mit einem `!` auf (`:mksession! ~/some/where/else.vim`).

### Laden einer Session

Um eine Session zu laden, führen Sie aus:

```shell
:source Session.vim
```

Jetzt sieht Vim genau so aus, wie Sie es verlassen haben, einschließlich der geteilten Fenster! Alternativ können Sie auch eine Session-Datei vom Terminal aus laden:

```shell
vim -S Session.vim
```

### Konfigurieren von Session-Attributen

Sie können die Attribute konfigurieren, die die Session speichert. Um zu sehen, was derzeit gespeichert wird, führen Sie aus:

```shell
:set sessionoptions?
```

Meine sagt:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Wenn Sie `terminal` nicht speichern möchten, wenn Sie eine Session speichern, entfernen Sie es aus den Sitzungsoptionen. Führen Sie aus:

```shell
:set sessionoptions-=terminal
```

Wenn Sie eine `options` hinzufügen möchten, wenn Sie eine Session speichern, führen Sie aus:

```shell
:set sessionoptions+=options
```

Hier sind einige Attribute, die `sessionoptions` speichern kann:
- `blank` speichert leere Fenster
- `buffers` speichert Puffer
- `folds` speichert Faltungen
- `globals` speichert globale Variablen (müssen mit einem Großbuchstaben beginnen und mindestens einen Kleinbuchstaben enthalten)
- `options` speichert Optionen und Zuordnungen
- `resize` speichert Fensterzeilen und -spalten
- `winpos` speichert die Fensterposition
- `winsize` speichert die Fenstergrößen
- `tabpages` speichert Tabs
- `unix` speichert Dateien im Unix-Format

Für die vollständige Liste schauen Sie sich `:h 'sessionoptions'` an.

Session ist ein nützliches Werkzeug, um die externen Attribute Ihres Projekts zu bewahren. Einige interne Attribute werden jedoch nicht von der Session gespeichert, wie lokale Marken, Register, Historien usw. Um sie zu speichern, müssen Sie Viminfo verwenden!

## Viminfo

Wenn Sie bemerken, dass Sie nach dem Yanking eines Wortes in das Register a und dem Beenden von Vim beim nächsten Öffnen von Vim diesen Text immer noch im Register a gespeichert haben, ist das tatsächlich ein Werk von Viminfo. Ohne es würde Vim das Register nach dem Schließen von Vim nicht speichern.

Wenn Sie Vim 8 oder höher verwenden, ist Viminfo standardmäßig aktiviert, sodass Sie möglicherweise die ganze Zeit über Viminfo verwendet haben, ohne es zu wissen!

Sie könnten fragen: "Was speichert Viminfo? Wie unterscheidet es sich von Session?"

Um Viminfo zu verwenden, müssen Sie zuerst die `+viminfo`-Funktion verfügbar haben (`:version`). Viminfo speichert:
- Die Befehlszeilenhistorie.
- Die Suchbegriffhistorie.
- Die Eingabezeilenhistorie.
- Inhalte nicht leerer Register.
- Marken für mehrere Dateien.
- Dateimarken, die auf Positionen in Dateien verweisen.
- Letztes Such- / Ersetzungs-Muster (für 'n' und '&').
- Die Pufferliste.
- Globale Variablen.

Im Allgemeinen speichert die Session die "externen" Attribute und Viminfo die "internen" Attribute.

Im Gegensatz zur Session, bei der Sie eine Session-Datei pro Projekt haben können, verwenden Sie normalerweise eine Viminfo-Datei pro Computer. Viminfo ist projektunabhängig.

Der Standard-Viminfo-Speicherort für Unix ist `$HOME/.viminfo` (`~/.viminfo`). Wenn Sie ein anderes Betriebssystem verwenden, könnte Ihr Viminfo-Speicherort anders sein. Schauen Sie sich `:h viminfo-file-name` an. Jedes Mal, wenn Sie "interne" Änderungen vornehmen, wie das Yanking eines Textes in ein Register, aktualisiert Vim automatisch die Viminfo-Datei.

*Stellen Sie sicher, dass Sie die Option `nocompatible` gesetzt haben (`set nocompatible`), andernfalls funktioniert Ihr Viminfo nicht.*

### Schreiben und Lesen von Viminfo

Obwohl Sie nur eine Viminfo-Datei verwenden, können Sie mehrere Viminfo-Dateien erstellen. Um eine Viminfo-Datei zu schreiben, verwenden Sie den Befehl `:wviminfo` (`:wv` als Kurzform).

```shell
:wv ~/.viminfo_extra
```

Um eine vorhandene Viminfo-Datei zu überschreiben, fügen Sie ein Ausrufezeichen zum `wv`-Befehl hinzu:

```shell
:wv! ~/.viminfo_extra
```

Standardmäßig liest Vim aus der Datei `~/.viminfo`. Um aus einer anderen Viminfo-Datei zu lesen, führen Sie `:rviminfo` aus, oder `:rv` als Kurzform:

```shell
:rv ~/.viminfo_extra
```

Um Vim mit einer anderen Viminfo-Datei vom Terminal aus zu starten, verwenden Sie das `i`-Flag:

```shell
vim -i viminfo_extra
```

Wenn Sie Vim für verschiedene Aufgaben verwenden, wie Programmieren und Schreiben, können Sie eine Viminfo für das Schreiben und eine andere für das Programmieren erstellen.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Vim ohne Viminfo starten

Um Vim ohne Viminfo zu starten, können Sie vom Terminal aus ausführen:

```shell
vim -i NONE
```

Um es dauerhaft zu machen, können Sie dies in Ihre vimrc-Datei einfügen:

```shell
set viminfo="NONE"
```

### Konfigurieren von Viminfo-Attributen

Ähnlich wie bei `viewoptions` und `sessionoptions` können Sie anweisen, welche Attribute mit der `viminfo`-Option gespeichert werden sollen. Führen Sie aus:

```shell
:set viminfo?
```

Sie erhalten:

```shell
!,'100,<50,s10,h
```

Das sieht kryptisch aus. Lassen Sie es uns aufschlüsseln:
- `!` speichert globale Variablen, die mit einem Großbuchstaben beginnen und keine Kleinbuchstaben enthalten. Denken Sie daran, dass `g:` eine globale Variable angibt. Zum Beispiel, wenn Sie irgendwann die Zuweisung `let g:FOO = "foo"` geschrieben haben, wird Viminfo die globale Variable `FOO` speichern. Wenn Sie jedoch `let g:Foo = "foo"` gemacht haben, wird Viminfo diese globale Variable nicht speichern, da sie Kleinbuchstaben enthält. Ohne `!` speichert Vim diese globalen Variablen nicht.
- `'100` repräsentiert Marken. In diesem Fall speichert Viminfo die lokalen Marken (a-z) der letzten 100 Dateien. Seien Sie sich bewusst, dass, wenn Sie Viminfo anweisen, zu viele Dateien zu speichern, Vim langsamer werden kann. 1000 ist eine gute Zahl.
- `<50` sagt Viminfo, wie viele maximale Zeilen für jedes Register gespeichert werden (in diesem Fall 50). Wenn ich 100 Zeilen Text in das Register a yankiere (`"ay99j`) und Vim schließe, wird Vim beim nächsten Öffnen und Einfügen aus dem Register a (`"ap`) nur maximal 50 Zeilen einfügen. Wenn Sie keine maximale Zeilenzahl angeben, werden *alle* Zeilen gespeichert. Wenn Sie 0 angeben, wird nichts gespeichert.
- `s10` setzt eine Größenbeschränkung (in kb) für ein Register. In diesem Fall wird jedes Register, das größer als 10 kb ist, ausgeschlossen.
- `h` deaktiviert die Hervorhebung (von `hlsearch`), wenn Vim startet.

Es gibt andere Optionen, die Sie übergeben können. Um mehr zu erfahren, schauen Sie sich `:h 'viminfo'` an.
## Verwendung von Views, Sessions und Viminfo auf intelligente Weise

Vim verfügt über View, Session und Viminfo, um verschiedene Ebenen von Schnappschüssen Ihrer Vim-Umgebung zu erstellen. Für Mikroprojekte verwenden Sie Views. Für größere Projekte verwenden Sie Sessions. Sie sollten sich die Zeit nehmen, um alle Optionen zu überprüfen, die View, Session und Viminfo bieten.

Erstellen Sie Ihre eigene View, Session und Viminfo für Ihren eigenen Bearbeitungsstil. Wenn Sie Vim jemals außerhalb Ihres Computers verwenden müssen, können Sie einfach Ihre Einstellungen laden und Sie werden sich sofort wie zu Hause fühlen!