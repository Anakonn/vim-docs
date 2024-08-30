---
description: In diesem Kapitel lernen Sie, wie Sie Vim und Git integrieren können,
  insbesondere durch das Vergleichen von Dateien mit `vimdiff`.
title: Ch18. Git
---

Vim und Git sind zwei großartige Werkzeuge für zwei verschiedene Dinge. Git ist ein Versionskontrollwerkzeug. Vim ist ein Texteditor.

In diesem Kapitel lernen Sie verschiedene Möglichkeiten kennen, Vim und Git zusammen zu integrieren.

## Diffing

Erinnern Sie sich an das vorherige Kapitel, in dem Sie den Befehl `vimdiff` ausführen können, um die Unterschiede zwischen mehreren Dateien anzuzeigen.

Angenommen, Sie haben zwei Dateien, `file1.txt` und `file2.txt`.

In `file1.txt`:

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

In `file2.txt`:

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

Um die Unterschiede zwischen beiden Dateien zu sehen, führen Sie aus:

```shell
vimdiff file1.txt file2.txt
```

Alternativ könnten Sie ausführen:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` zeigt zwei Puffer nebeneinander an. Links ist `file1.txt` und rechts ist `file2.txt`. Die ersten Unterschiede (Äpfel und Orangen) sind auf beiden Zeilen hervorgehoben.

Angenommen, Sie möchten, dass der zweite Puffer Äpfel hat, nicht Orangen. Um den Inhalt von Ihrer aktuellen Position (Sie sind derzeit auf `file1.txt`) nach `file2.txt` zu übertragen, gehen Sie zuerst mit `]c` zum nächsten Diff (um zum vorherigen Diff-Fenster zu springen, verwenden Sie `[c`). Der Cursor sollte jetzt auf Äpfel stehen. Führen Sie `:diffput` aus. Beide Dateien sollten jetzt Äpfel haben.

Wenn Sie den Text aus dem anderen Puffer (Orangensaft, `file2.txt`) übertragen möchten, um den Text im aktuellen Puffer (Apfelsaft, `file1.txt`) zu ersetzen, gehen Sie mit Ihrem Cursor, der sich noch im `file1.txt`-Fenster befindet, zuerst mit `]c` zum nächsten Diff. Ihr Cursor sollte jetzt auf Apfelsaft stehen. Führen Sie `:diffget` aus, um den Orangensaft aus einem anderen Puffer zu holen, um den Apfelsaft in unserem Puffer zu ersetzen.

`:diffput` *gibt* den Text aus dem aktuellen Puffer an einen anderen Puffer aus. `:diffget` *holt* den Text aus einem anderen Puffer in den aktuellen Puffer.

Wenn Sie mehrere Puffer haben, können Sie `:diffput fileN.txt` und `:diffget fileN.txt` ausführen, um den fileN-Puffer anzusprechen.

## Vim als Merge-Tool

> "Ich liebe es, Merge-Konflikte zu lösen!" - Niemand

Ich kenne niemanden, der es mag, Merge-Konflikte zu lösen. Sie sind jedoch unvermeidlich. In diesem Abschnitt lernen Sie, wie Sie Vim als Werkzeug zur Lösung von Merge-Konflikten nutzen können.

Ändern Sie zunächst das Standard-Merge-Tool auf `vimdiff`, indem Sie ausführen:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Alternativ können Sie die `~/.gitconfig` direkt ändern (standardmäßig sollte sie im Root-Verzeichnis sein, aber Ihre könnte an einem anderen Ort sein). Die obigen Befehle sollten Ihre gitconfig so ändern, dass sie wie die folgende Einstellung aussieht. Wenn Sie sie noch nicht ausgeführt haben, können Sie auch Ihre gitconfig manuell bearbeiten.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Lassen Sie uns einen gefälschten Merge-Konflikt erstellen, um dies zu testen. Erstellen Sie ein Verzeichnis `/food` und machen Sie es zu einem Git-Repository:

```shell
git init
```

Fügen Sie eine Datei `breakfast.txt` hinzu. Darin:

```shell
pancakes
waffles
oranges
```

Fügen Sie die Datei hinzu und committen Sie sie:

```shell
git add .
git commit -m "Initial breakfast commit"
```

Erstellen Sie als Nächstes einen neuen Branch und nennen Sie ihn Äpfel-Branch:

```shell
git checkout -b apples
```

Ändern Sie die `breakfast.txt`:

```shell
pancakes
waffles
apples
```

Speichern Sie die Datei, fügen Sie die Änderung hinzu und committen Sie:

```shell
git add .
git commit -m "Äpfel, nicht Orangen"
```

Super. Jetzt haben Sie Orangen im Master-Branch und Äpfel im Äpfel-Branch. Lassen Sie uns zum Master-Branch zurückkehren:

```shell
git checkout master
```

In `breakfast.txt` sollten Sie den Basistext, Orangen, sehen. Lassen Sie uns das in Trauben ändern, da sie gerade Saison haben:

```shell
pancakes
waffles
grapes
```

Speichern, hinzufügen und committen:

```shell
git add .
git commit -m "Trauben, nicht Orangen"
```

Jetzt sind Sie bereit, den Äpfel-Branch in den Master-Branch zu mergen:

```shell
git merge apples
```

Sie sollten einen Fehler sehen:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Ein Konflikt, großartig! Lassen Sie uns den Konflikt mit unserem neu konfigurierten `mergetool` lösen. Führen Sie aus:

```shell
git mergetool
```

Vim zeigt vier Fenster an. Achten Sie auf die oberen drei:

- `LOCAL` enthält `grapes`. Dies ist die Änderung in "local", in die Sie mergen.
- `BASE` enthält `oranges`. Dies ist der gemeinsame Vorfahr zwischen `LOCAL` und `REMOTE`, um zu vergleichen, wie sie divergieren.
- `REMOTE` enthält `apples`. Das ist das, was gemerged wird.

Unten (im vierten Fenster) sehen Sie:

```shell
pancakes
waffles
<<<<<<< HEAD
grapes
||||||| db63958
oranges
=======
apples
>>>>>>> apples
```

Das vierte Fenster enthält die Texte des Merge-Konflikts. Mit dieser Einrichtung ist es einfacher zu sehen, welche Änderung jede Umgebung hat. Sie können den Inhalt von `LOCAL`, `BASE` und `REMOTE` gleichzeitig sehen.

Ihr Cursor sollte sich im vierten Fenster im hervorgehobenen Bereich befinden. Um die Änderung von `LOCAL` (Trauben) zu übernehmen, führen Sie `:diffget LOCAL` aus. Um die Änderung von `BASE` (Orangen) zu übernehmen, führen Sie `:diffget BASE` aus und um die Änderung von `REMOTE` (Äpfel) zu übernehmen, führen Sie `:diffget REMOTE` aus.

In diesem Fall lassen Sie uns die Änderung von `LOCAL` übernehmen. Führen Sie `:diffget LOCAL` aus. Das vierte Fenster wird jetzt Trauben enthalten. Speichern und beenden Sie alle Dateien (`:wqall`), wenn Sie fertig sind. Das war doch nicht schlecht, oder?

Wenn Sie bemerken, haben Sie jetzt auch eine Datei `breakfast.txt.orig`. Git erstellt eine Sicherungsdatei, falls etwas schiefgeht. Wenn Sie nicht möchten, dass Git während eines Merges eine Sicherung erstellt, führen Sie aus:

```shell
git config --global mergetool.keepBackup false
```

## Git in Vim

Vim hat keine native Git-Funktionalität integriert. Eine Möglichkeit, Git-Befehle aus Vim auszuführen, besteht darin, den Bang-Operator `!` im Befehlsmodus zu verwenden.

Jeder Git-Befehl kann mit `!` ausgeführt werden:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Sie können auch die Vim-Konventionen `%` (aktueller Puffer) oder `#` (anderer Puffer) verwenden:

```shell
:!git add %         " git add aktuelle Datei
:!git checkout #    " git checkout die andere Datei
```

Ein Vim-Trick, den Sie verwenden können, um mehrere Dateien in verschiedenen Vim-Fenstern hinzuzufügen, besteht darin, auszuführen:

```shell
:windo !git add %
```

Dann machen Sie einen Commit:

```shell
:!git commit "Gerade alles in meinem Vim-Fenster hinzugefügt, cool"
```

Der Befehl `windo` ist einer von Vims "do" Befehlen, ähnlich wie `argdo`, das Sie zuvor gesehen haben. `windo` führt den Befehl in jedem Fenster aus.

Alternativ können Sie auch `bufdo !git add %` verwenden, um alle Puffer hinzuzufügen, oder `argdo !git add %`, um alle Dateiargumente hinzuzufügen, je nach Ihrem Workflow.

## Plugins

Es gibt viele Vim-Plugins zur Unterstützung von Git. Nachfolgend finden Sie eine Liste einiger beliebter git-bezogener Plugins für Vim (es gibt wahrscheinlich mehr, wenn Sie dies lesen):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

Eines der beliebtesten ist vim-fugitive. Im Rest des Kapitels werde ich mehrere Git-Workflows mit diesem Plugin durchgehen.

## Vim-fugitive

Das vim-fugitive Plugin ermöglicht es Ihnen, die Git-CLI zu verwenden, ohne den Vim-Editor zu verlassen. Sie werden feststellen, dass einige Befehle besser sind, wenn sie aus Vim heraus ausgeführt werden.

Um zu beginnen, installieren Sie vim-fugitive mit einem Vim-Plugin-Manager ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim) usw.).

## Git-Status

Wenn Sie den Befehl `:Git` ohne Parameter ausführen, zeigt vim-fugitive ein Git-Zusammenfassungsfenster an. Es zeigt die nicht verfolgten, nicht gestagten und gestagten Datei(en) an. Während Sie sich im "`git status`" Modus befinden, können Sie mehrere Dinge tun:
- `Ctrl-N` / `Ctrl-P`, um in der Dateiliste nach oben oder unten zu gehen.
- `-`, um den Dateinamen unter dem Cursor zu stagen oder zu unstagen.
- `s`, um den Dateinamen unter dem Cursor zu stagen.
- `u`, um den Dateinamen unter dem Cursor zu unstagen.
- `>` / `<`, um einen Inline-Diff des Dateinamens unter dem Cursor anzuzeigen oder auszublenden.

Für mehr Informationen, schauen Sie sich `:h fugitive-staging-maps` an.

## Git Blame

Wenn Sie den Befehl `:Git blame` aus der aktuellen Datei ausführen, zeigt vim-fugitive ein geteiltes Blame-Fenster an. Dies kann nützlich sein, um die Person zu finden, die diese fehlerhafte Codezeile geschrieben hat, damit Sie sie anschreien können (nur ein Scherz).

Einige Dinge, die Sie im `"git blame"` Modus tun können:
- `q`, um das Blame-Fenster zu schließen.
- `A`, um die Autorenspalte zu ändern.
- `C`, um die Commit-Spalte zu ändern.
- `D`, um die Datum-/Uhrzeit-Spalte zu ändern.

Für mehr Informationen, schauen Sie sich `:h :Git_blame` an.

## Gdiffsplit

Wenn Sie den Befehl `:Gdiffsplit` ausführen, führt vim-fugitive ein `vimdiff` der neuesten Änderungen der aktuellen Datei gegen den Index oder den Arbeitsbaum aus. Wenn Sie `:Gdiffsplit <commit>` ausführen, führt vim-fugitive ein `vimdiff` gegen diese Datei innerhalb von `<commit>` aus.

Da Sie sich im `vimdiff` Modus befinden, können Sie den Diff mit `:diffput` und `:diffget` *holen* oder *geben*.

## Gwrite und Gread

Wenn Sie den Befehl `:Gwrite` in einer Datei nach Änderungen ausführen, stagiert vim-fugitive die Änderungen. Es ist wie das Ausführen von `git add <aktuelle-Datei>`.

Wenn Sie den Befehl `:Gread` in einer Datei nach Änderungen ausführen, stellt vim-fugitive die Datei in den Zustand vor den Änderungen zurück. Es ist wie das Ausführen von `git checkout <aktuelle-Datei>`. Ein Vorteil von `:Gread` ist, dass die Aktion rückgängig gemacht werden kann. Wenn Sie nach dem Ausführen von `:Gread` Ihre Meinung ändern und die alte Änderung behalten möchten, können Sie einfach rückgängig machen (`u`), und Vim wird die `:Gread`-Aktion rückgängig machen. Dies wäre nicht möglich gewesen, wenn Sie `git checkout <aktuelle-Datei>` von der CLI ausgeführt hätten.

## Gclog

Wenn Sie den Befehl `:Gclog` ausführen, zeigt vim-fugitive die Commit-Historie an. Es ist wie das Ausführen des `git log` Befehls. Vim-fugitive verwendet Vims Quickfix, um dies zu erreichen, sodass Sie `:cnext` und `:cprevious` verwenden können, um zur nächsten oder vorherigen Protokollinformation zu navigieren. Sie können die Protokollliste mit `:copen` und `:cclose` öffnen und schließen.

Während Sie sich im `"git log"` Modus befinden, können Sie zwei Dinge tun:
- Den Baum anzeigen.
- Den Elternteil besuchen (den vorherigen Commit).

Sie können `:Gclog` Argumente übergeben, genau wie beim `git log` Befehl. Wenn Ihr Projekt eine lange Commit-Historie hat und Sie nur die letzten drei Commits anzeigen möchten, können Sie `:Gclog -3` ausführen. Wenn Sie es nach dem Datum des Committers filtern müssen, können Sie etwas wie `:Gclog --after="1. Januar" --before="14. März"` ausführen.

## Mehr Vim-fugitive

Dies sind nur einige Beispiele dafür, was vim-fugitive tun kann. Um mehr über vim-fugitive zu erfahren, schauen Sie sich `:h fugitive.txt` an. Die meisten der beliebten Git-Befehle sind wahrscheinlich mit vim-fugitive optimiert. Sie müssen nur in der Dokumentation danach suchen.

Wenn Sie sich in einem der "Sondermodi" von vim-fugitive befinden (zum Beispiel im `:Git` oder `:Git blame` Modus) und Sie möchten erfahren, welche Tastenkombinationen verfügbar sind, drücken Sie `g?`. Vim-fugitive zeigt das entsprechende `:help`-Fenster für den Modus an, in dem Sie sich befinden. Cool!
## Lerne Vim und Git auf die smarte Weise

Du wirst vim-fugitive als eine gute Ergänzung zu deinem Workflow empfinden (oder auch nicht). Unabhängig davon möchte ich dich dringend ermutigen, alle oben aufgeführten Plugins auszuprobieren. Es gibt wahrscheinlich noch andere, die ich nicht aufgelistet habe. Probiere sie aus.

Eine offensichtliche Möglichkeit, besser mit der Vim-Git-Integration umzugehen, ist, mehr über Git zu lesen. Git ist für sich genommen ein umfangreiches Thema, und ich zeige nur einen Bruchteil davon. Damit lass uns *git going* (verzeih den Wortwitz) und darüber sprechen, wie man Vim verwendet, um deinen Code zu kompilieren!