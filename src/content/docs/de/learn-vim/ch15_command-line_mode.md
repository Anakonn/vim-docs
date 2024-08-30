---
description: In diesem Kapitel lernen Sie Tipps und Tricks für den Befehlszeilenmodus
  in Vim, einschließlich Eingabe, Ausgabe und verschiedene Befehle.
title: Ch15. Command-line Mode
---

In den letzten drei Kapiteln haben Sie gelernt, wie man die Suchbefehle (`/`, `?`), den Ersetzungsbefehl (`:s`), den globalen Befehl (`:g`) und den externen Befehl (`!`) verwendet. Dies sind Beispiele für Befehle im Befehlszeilenmodus.

In diesem Kapitel lernen Sie verschiedene Tipps und Tricks für den Befehlszeilenmodus.

## Eingabe und Verlassen des Befehlszeilenmodus

Der Befehlszeilenmodus ist ein Modus für sich, genau wie der normale Modus, der Einfügemodus und der visuelle Modus. Wenn Sie sich in diesem Modus befinden, springt der Cursor an den unteren Bildschirmrand, wo Sie verschiedene Befehle eingeben können.

Es gibt 4 verschiedene Befehle, mit denen Sie in den Befehlszeilenmodus gelangen können:
- Suchmuster (`/`, `?`)
- Befehlszeilenbefehle (`:`)
- Externe Befehle (`!`)

Sie können den Befehlszeilenmodus aus dem normalen Modus oder dem visuellen Modus betreten.

Um den Befehlszeilenmodus zu verlassen, können Sie `<Esc>`, `Ctrl-C` oder `Ctrl-[` verwenden.

*Andere Literatur könnte den "Befehlszeilenbefehl" als "Ex-Befehl" und den "externen Befehl" als "Filterbefehl" oder "Bang-Operator" bezeichnen.*

## Wiederholen des vorherigen Befehls

Sie können den vorherigen Befehlszeilenbefehl oder externen Befehl mit `@:` wiederholen.

Wenn Sie gerade `:s/foo/bar/g` ausgeführt haben, wiederholt das Ausführen von `@:` diese Ersetzung. Wenn Sie gerade `:.!tr '[a-z]' '[A-Z]'` ausgeführt haben, wiederholt das Ausführen von `@:` den letzten externen Befehlsübersetzungsfilter.

## Tastenkombinationen im Befehlszeilenmodus

Während Sie sich im Befehlszeilenmodus befinden, können Sie sich mit den Pfeiltasten `Links` oder `Rechts` zeichenweise nach links oder rechts bewegen.

Wenn Sie sich wortweise bewegen müssen, verwenden Sie `Shift-Links` oder `Shift-Rechts` (in einigen Betriebssystemen müssen Sie möglicherweise `Ctrl` anstelle von `Shift` verwenden).

Um zum Anfang der Zeile zu gelangen, verwenden Sie `Ctrl-B`. Um zum Ende der Zeile zu gelangen, verwenden Sie `Ctrl-E`.

Ähnlich wie im Einfügemodus haben Sie im Befehlszeilenmodus drei Möglichkeiten, Zeichen zu löschen:

```shell
Ctrl-H    Löscht ein Zeichen
Ctrl-W    Löscht ein Wort
Ctrl-U    Löscht die gesamte Zeile
```
Wenn Sie den Befehl wie eine normale Textdatei bearbeiten möchten, verwenden Sie `Ctrl-F`.

Dies ermöglicht es Ihnen auch, durch die vorherigen Befehle zu suchen, sie zu bearbeiten und sie erneut auszuführen, indem Sie `<Enter>` im "Befehlszeilenbearbeitungsnormalmodus" drücken.

## Register und Autocomplete

Während Sie sich im Befehlszeilenmodus befinden, können Sie Texte aus dem Vim-Register mit `Ctrl-R` auf die gleiche Weise wie im Einfügemodus einfügen. Wenn Sie den String "foo" im Register a gespeichert haben, können Sie ihn mit `Ctrl-R a` einfügen. Alles, was Sie im Einfügemodus aus dem Register abrufen können, können Sie auch im Befehlszeilenmodus tun.

Darüber hinaus können Sie auch das Wort unter dem Cursor mit `Ctrl-R Ctrl-W` abrufen (`Ctrl-R Ctrl-A` für das WORD unter dem Cursor). Um die Zeile unter dem Cursor abzurufen, verwenden Sie `Ctrl-R Ctrl-L`. Um den Dateinamen unter dem Cursor abzurufen, verwenden Sie `Ctrl-R Ctrl-F`.

Sie können auch vorhandene Befehle automatisch vervollständigen. Um den `echo`-Befehl automatisch zu vervollständigen, geben Sie im Befehlszeilenmodus "ec" ein und drücken Sie dann `<Tab>`. Sie sollten unten links Vim-Befehle sehen, die mit "ec" beginnen (Beispiel: `echo echoerr echohl echomsg econ`). Um zur nächsten Option zu gelangen, drücken Sie entweder `<Tab>` oder `Ctrl-N`. Um zur vorherigen Option zu gelangen, drücken Sie entweder `<Shift-Tab>` oder `Ctrl-P`.

Einige Befehlszeilenbefehle akzeptieren Dateinamen als Argumente. Ein Beispiel ist `edit`. Sie können hier auch automatisch vervollständigen. Nachdem Sie den Befehl `:e ` eingegeben haben (vergessen Sie nicht das Leerzeichen), drücken Sie `<Tab>`. Vim listet alle relevanten Dateinamen auf, aus denen Sie wählen können, sodass Sie sie nicht von Grund auf neu eingeben müssen.

## Verlauffenster und Befehlszeilenfenster

Sie können den Verlauf der Befehlszeilenbefehle und Suchbegriffe anzeigen (dies erfordert die Funktion `+cmdline_hist`).

Um den Befehlszeilenverlauf zu öffnen, führen Sie `:his :` aus. Sie sollten etwas sehen, das wie folgt aussieht:

```shell
## Cmd Verlauf
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim listet den Verlauf aller `:`-Befehle auf, die Sie ausgeführt haben. Standardmäßig speichert Vim die letzten 50 Befehle. Um die Anzahl der Einträge, die Vim sich merkt, auf 100 zu ändern, führen Sie `set history=100` aus.

Eine nützlichere Verwendung des Befehlszeilenverlaufs erfolgt über das Befehlszeilenfenster, `q:`. Dies öffnet ein durchsuchbares, bearbeitbares Verlauffenster. Angenommen, Sie haben diese Ausdrücke im Verlauf, wenn Sie `q:` drücken:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Wenn Ihre aktuelle Aufgabe darin besteht, `s/verylongsubstitutionpattern/donut/g` auszuführen, warum tippen Sie den Befehl nicht von Grund auf neu, anstatt `s/verylongsubstitutionpattern/pancake/g` wiederzuverwenden? Schließlich ist das einzige, was anders ist, das Wort, das ersetzt wird, "donut" vs "pancake". Alles andere ist gleich.

Nachdem Sie `q:` ausgeführt haben, suchen Sie `s/verylongsubstitutionpattern/pancake/g` im Verlauf (Sie können die Vim-Navigation in dieser Umgebung verwenden) und bearbeiten Sie es direkt! Ändern Sie "pancake" in "donut" im Verlauffenster und drücken Sie dann `<Enter>`. Boom! Vim führt `s/verylongsubstitutionpattern/donut/g` für Sie aus. Super praktisch!

Ebenso können Sie den Suchverlauf anzeigen, indem Sie `:his /` oder `:his ?` ausführen. Um das Suchverlauffenster zu öffnen, in dem Sie durch die vergangene Historie suchen und sie bearbeiten können, führen Sie `q/` oder `q?` aus.

Um dieses Fenster zu schließen, drücken Sie `Ctrl-C`, `Ctrl-W C` oder geben Sie `:quit` ein.

## Weitere Befehlszeilenbefehle

Vim hat Hunderte von integrierten Befehlen. Um alle Befehle zu sehen, die Vim hat, schauen Sie sich `:h ex-cmd-index` oder `:h :index` an.

## Lernen Sie den Befehlszeilenmodus auf die smarte Weise

Im Vergleich zu den anderen drei Modi ist der Befehlszeilenmodus wie das Schweizer Taschenmesser der Textbearbeitung. Sie können Text bearbeiten, Dateien modifizieren und Befehle ausführen, um nur einige zu nennen. Dieses Kapitel ist eine Sammlung von verschiedenen Aspekten des Befehlszeilenmodus. Es bringt auch die Vim-Modi zum Abschluss. Jetzt, da Sie wissen, wie man den normalen, den Einfüge-, den visuellen und den Befehlszeilenmodus verwendet, können Sie Texte mit Vim schneller als je zuvor bearbeiten.

Es ist Zeit, sich von den Vim-Modi zu entfernen und zu lernen, wie man mit Vim-Tags noch schneller navigiert.