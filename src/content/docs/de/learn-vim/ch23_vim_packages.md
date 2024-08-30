---
description: In diesem Kapitel lernen Sie, wie Sie Vim-Pakete nutzen, um Plugins zu
  installieren, einschließlich automatischer und manueller Ladeoptionen.
title: Ch23. Vim Packages
---

Im vorherigen Kapitel habe ich erwähnt, dass man einen externen Plugin-Manager verwenden kann, um Plugins zu installieren. Seit Version 8 kommt Vim mit einem eigenen integrierten Plugin-Manager namens *packages*. In diesem Kapitel lernen Sie, wie Sie Vim-Pakete verwenden, um Plugins zu installieren.

Um zu überprüfen, ob Ihre Vim-Version die Verwendung von Paketen unterstützt, führen Sie `:version` aus und suchen Sie nach dem Attribut `+packages`. Alternativ können Sie auch `:echo has('packages')` ausführen (wenn es 1 zurückgibt, hat es die Pakete-Funktionalität).

## Pack-Verzeichnis

Überprüfen Sie, ob Sie ein Verzeichnis `~/.vim/` im Stammverzeichnis haben. Wenn nicht, erstellen Sie eines. Erstellen Sie darin ein Verzeichnis namens `pack` (`~/.vim/pack/`). Vim weiß automatisch, dass es in diesem Verzeichnis nach Paketen suchen soll.

## Zwei Arten des Ladens

Vim-Pakete haben zwei Lademechanismen: automatisches und manuelles Laden.

### Automatisches Laden

Um Plugins automatisch zu laden, wenn Vim startet, müssen Sie sie im Verzeichnis `start/` ablegen. Der Pfad sieht so aus:

```shell
~/.vim/pack/*/start/
```

Jetzt könnten Sie fragen: "Was ist das `*` zwischen `pack/` und `start/`?" `*` ist ein beliebiger Name und kann alles sein, was Sie möchten. Nennen wir es `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

Beachten Sie, dass das Paket-System nicht funktioniert, wenn Sie es überspringen und stattdessen so etwas tun:

```shell
~/.vim/pack/start/
```

Es ist zwingend erforderlich, einen Namen zwischen `pack/` und `start/` zu setzen.

Für dieses Demo versuchen wir, das Plugin [NERDTree](https://github.com/preservim/nerdtree) zu installieren. Gehen Sie in das `start/`-Verzeichnis (`cd ~/.vim/pack/packdemo/start/`) und klonen Sie das NERDTree-Repository:

```shell
git clone https://github.com/preservim/nerdtree.git
```

Das war's! Sie sind bereit. Das nächste Mal, wenn Sie Vim starten, können Sie sofort NERDTree-Befehle wie `:NERDTreeToggle` ausführen.

Sie können so viele Plugin-Repositories klonen, wie Sie möchten, im Pfad `~/.vim/pack/*/start/`. Vim wird jedes davon automatisch laden. Wenn Sie das geklonte Repository entfernen (`rm -rf nerdtree/`), wird dieses Plugin nicht mehr verfügbar sein.

### Manuelles Laden

Um Plugins manuell zu laden, wenn Vim startet, müssen Sie sie im Verzeichnis `opt/` ablegen. Ähnlich wie beim automatischen Laden sieht der Pfad so aus:

```shell
~/.vim/pack/*/opt/
```

Verwenden wir dasselbe `packdemo/`-Verzeichnis von zuvor:

```shell
~/.vim/pack/packdemo/opt/
```

Dieses Mal installieren wir das Spiel [killersheep](https://github.com/vim/killersheep) (dies erfordert Vim 8.2). Gehen Sie in das `opt/`-Verzeichnis (`cd ~/.vim/pack/packdemo/opt/`) und klonen Sie das Repository:

```shell
git clone https://github.com/vim/killersheep.git
```

Starten Sie Vim. Der Befehl zum Ausführen des Spiels ist `:KillKillKill`. Versuchen Sie, ihn auszuführen. Vim wird sich beschweren, dass es sich nicht um einen gültigen Editorbefehl handelt. Sie müssen das Plugin zuerst *manuell* laden. Lassen Sie uns das tun:

```shell
:packadd killersheep
```

Versuchen Sie nun, den Befehl erneut auszuführen `:KillKillKill`. Der Befehl sollte jetzt funktionieren.

Sie fragen sich vielleicht: "Warum sollte ich Pakete manuell laden wollen? Ist es nicht besser, alles automatisch beim Start zu laden?"

Eine großartige Frage. Manchmal gibt es Plugins, die Sie nicht ständig verwenden, wie das KillerSheep-Spiel. Sie müssen wahrscheinlich nicht 10 verschiedene Spiele laden und die Startzeit von Vim verlangsamen. Aber ab und zu, wenn Ihnen langweilig ist, möchten Sie vielleicht ein paar Spiele spielen. Verwenden Sie manuelles Laden für nicht wesentliche Plugins.

Sie können dies auch verwenden, um Plugins bedingt hinzuzufügen. Vielleicht verwenden Sie sowohl Neovim als auch Vim und es gibt Plugins, die für Neovim optimiert sind. Sie können etwas wie dies in Ihre vimrc einfügen:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Organisieren von Paketen

Denken Sie daran, dass die Voraussetzung für die Verwendung des Paket-Systems von Vim entweder ist:

```shell
~/.vim/pack/*/start/
```

Oder:

```shell
~/.vim/pack/*/opt/
```

Die Tatsache, dass `*` *jeder* Name sein kann, kann verwendet werden, um Ihre Pakete zu organisieren. Angenommen, Sie möchten Ihre Plugins nach Kategorien gruppieren (Farben, Syntax und Spiele):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Sie können weiterhin `start/` und `opt/` in jedem der Verzeichnisse verwenden.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Pakete auf die smarte Art hinzufügen

Sie fragen sich vielleicht, ob Vim-Pakete beliebte Plugin-Manager wie vim-pathogen, vundle.vim, dein.vim und vim-plug obsolet machen werden.

Die Antwort ist, wie immer: "Es kommt darauf an".

Ich verwende immer noch vim-plug, weil es einfach ist, Plugins hinzuzufügen, zu entfernen oder zu aktualisieren. Wenn Sie viele Plugins verwenden, kann es praktischer sein, Plugin-Manager zu verwenden, da es einfach ist, viele gleichzeitig zu aktualisieren. Einige Plugin-Manager bieten auch asynchrone Funktionen an.

Wenn Sie minimalist sind, probieren Sie Vim-Pakete aus. Wenn Sie ein intensiver Plugin-Nutzer sind, sollten Sie in Betracht ziehen, einen Plugin-Manager zu verwenden.