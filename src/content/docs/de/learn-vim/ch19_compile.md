---
description: In diesem Kapitel lernen Sie, wie Sie in Vim kompilieren und die Vorteile
  des `:make`-Befehls nutzen können, um den Kompilierungsprozess zu optimieren.
title: Ch19. Compile
---

Compilieren ist ein wichtiges Thema für viele Sprachen. In diesem Kapitel lernen Sie, wie man aus Vim heraus kompiliert. Sie werden auch Möglichkeiten betrachten, wie Sie den `:make` Befehl von Vim nutzen können.

## Kompilieren von der Kommandozeile

Sie können den Bang-Operator (`!`) verwenden, um zu kompilieren. Wenn Sie Ihre `.cpp`-Datei mit `g++` kompilieren müssen, führen Sie aus:

```shell
:!g++ hello.cpp -o hello
```

Es ist jedoch fehleranfällig und mühsam, den Dateinamen und den Ausgabedateinamen jedes Mal manuell einzugeben. Eine Makefile ist der richtige Weg.

## Der Make-Befehl

Vim hat einen `:make` Befehl, um eine Makefile auszuführen. Wenn Sie ihn ausführen, sucht Vim im aktuellen Verzeichnis nach einer Makefile, um sie auszuführen.

Erstellen Sie eine Datei mit dem Namen `makefile` im aktuellen Verzeichnis und fügen Sie Folgendes ein:

```shell
all:
	echo "Hallo alle"
foo:
	echo "Hallo foo"
list_pls:
	ls
```

Führen Sie dies aus Vim heraus aus:

```shell
:make
```

Vim führt es auf die gleiche Weise aus, wie wenn Sie es im Terminal ausführen. Der `:make` Befehl akzeptiert Parameter wie der Terminal-Make-Befehl. Führen Sie aus:

```shell
:make foo
" Gibt "Hallo foo" aus

:make list_pls
" Gibt das Ergebnis des ls-Befehls aus
```

Der `:make` Befehl verwendet Vims Quickfix, um einen Fehler zu speichern, wenn Sie einen fehlerhaften Befehl ausführen. Lassen Sie uns ein nicht vorhandenes Ziel ausführen:

```shell
:make dontexist
```

Sie sollten einen Fehler beim Ausführen dieses Befehls sehen. Um diesen Fehler anzuzeigen, führen Sie den Quickfix-Befehl `:copen` aus, um das Quickfix-Fenster anzuzeigen:

```shell
|| make: *** Keine Regel zum Erstellen des Ziels `dontexist'.  Stop.
```

## Kompilieren mit Make

Lassen Sie uns die Makefile verwenden, um ein einfaches `.cpp` Programm zu kompilieren. Zuerst erstellen wir eine `hello.cpp` Datei:

```shell
#include <iostream>

int main() {
    std::cout << "Hallo!\n";
    return 0;
}
```

Aktualisieren Sie Ihre Makefile, um eine `.cpp` Datei zu erstellen und auszuführen:

```shell
all:
	echo "bauen, ausführen"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Führen Sie nun aus:

```shell
:make build
```

Der `g++` kompiliert `./hello.cpp` und erstellt `./hello`. Führen Sie dann aus:

```shell
:make run
```

Sie sollten `"Hallo!"` im Terminal sehen.

## Anderes Make-Programm

Wenn Sie `:make` ausführen, führt Vim tatsächlich den Befehl aus, der unter der `makeprg` Option festgelegt ist. Wenn Sie `:set makeprg?` ausführen, sehen Sie:

```shell
makeprg=make
```

Der Standard-`:make` Befehl ist der externe Befehl `make`. Um den `:make` Befehl so zu ändern, dass er bei jedem Ausführen `g++ {Ihr-Dateiname}` ausführt, führen Sie aus:

```shell
:set makeprg=g++\ %
```

Das `\` dient dazu, das Leerzeichen nach `g++` zu maskieren. Das `%` Symbol in Vim steht für die aktuelle Datei. Der Befehl `g++\\ %` ist äquivalent zu `g++ hello.cpp` auszuführen.

Gehen Sie zu `./hello.cpp` und führen Sie dann `:make` aus. Vim kompiliert `hello.cpp` und erstellt `a.out`, weil Sie die Ausgabe nicht angegeben haben. Lassen Sie uns das so umgestalten, dass die kompilierte Ausgabe den Namen der ursprünglichen Datei ohne die Erweiterung trägt. Führen Sie dies aus oder fügen Sie es zu vimrc hinzu:

```shell
set makeprg=g++\ %\ -o\ %<
```

Die Aufschlüsselung:
- `g++\ %` ist dasselbe wie oben. Es ist äquivalent zu `g++ <Ihre-Datei>`.
- `-o` ist die Ausgabeoption.
- `%<` in Vim steht für den aktuellen Dateinamen ohne Erweiterung (`hello.cpp` wird `hello`).

Wenn Sie `:make` von innerhalb von `./hello.cpp` ausführen, wird es in `./hello` kompiliert. Um `./hello` schnell von innerhalb von `./hello.cpp` auszuführen, führen Sie `:!./%<` aus. Dies ist wiederum dasselbe wie `:!./{aktueller-Dateiname-ohne-Erweiterung}` auszuführen.

Für mehr Informationen, schauen Sie sich `:h :compiler` und `:h write-compiler-plugin` an.

## Automatisches Kompilieren beim Speichern

Sie können das Leben noch einfacher machen, indem Sie die Kompilierung automatisieren. Denken Sie daran, dass Sie Vims `autocmd` verwenden können, um automatische Aktionen basierend auf bestimmten Ereignissen auszulösen. Um `.cpp` Dateien bei jedem Speichern automatisch zu kompilieren, fügen Sie dies in Ihre vimrc ein:

```shell
autocmd BufWritePost *.cpp make
```

Jedes Mal, wenn Sie in einer `.cpp` Datei speichern, führt Vim den `make` Befehl aus.

## Compiler wechseln

Vim hat einen `:compiler` Befehl, um schnell Compiler zu wechseln. Ihre Vim-Version enthält wahrscheinlich mehrere vorgefertigte Compiler-Konfigurationen. Um zu überprüfen, welche Compiler Sie haben, führen Sie aus:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Sie sollten eine Liste von Compilern für verschiedene Programmiersprachen sehen.

Um den `:compiler` Befehl zu verwenden, nehmen wir an, Sie haben eine Ruby-Datei, `hello.rb`, die Folgendes enthält:

```shell
puts "Hallo Ruby"
```

Denken Sie daran, dass wenn Sie `:make` ausführen, Vim jeden Befehl ausführt, der `makeprg` zugewiesen ist (Standard ist `make`). Wenn Sie ausführen:

```shell
:compiler ruby
```

Vim führt das `$VIMRUNTIME/compiler/ruby.vim` Skript aus und ändert `makeprg`, um den `ruby` Befehl zu verwenden. Wenn Sie jetzt `:set makeprg?` ausführen, sollte es `makeprg=ruby` anzeigen (dies hängt davon ab, was in Ihrer `$VIMRUNTIME/compiler/ruby.vim` Datei steht oder ob Sie andere benutzerdefinierte Ruby-Compiler haben. Ihre könnten unterschiedlich sein). Der Befehl `:compiler {Ihre-Sprache}` ermöglicht es Ihnen, schnell zwischen verschiedenen Compilern zu wechseln. Dies ist nützlich, wenn Ihr Projekt mehrere Sprachen verwendet.

Sie müssen nicht den `:compiler` und `makeprg` verwenden, um ein Programm zu kompilieren. Sie können ein Testskript ausführen, eine Datei linten, ein Signal senden oder alles tun, was Sie möchten.

## Einen benutzerdefinierten Compiler erstellen

Lassen Sie uns einen einfachen Typescript-Compiler erstellen. Installieren Sie Typescript (`npm install -g typescript`) auf Ihrem Computer. Sie sollten jetzt den `tsc` Befehl haben. Wenn Sie zuvor nicht mit Typescript gearbeitet haben, kompiliert `tsc` eine Typescript-Datei in eine Javascript-Datei. Angenommen, Sie haben eine Datei, `hello.ts`:

```shell
const hello = "hallo";
console.log(hello);
```

Wenn Sie `tsc hello.ts` ausführen, wird es in `hello.js` kompiliert. Wenn Sie jedoch die folgenden Ausdrücke in `hello.ts` haben:

```shell
const hello = "hallo";
hello = "hallo nochmal";
console.log(hello);
```

Wird dies einen Fehler auslösen, da Sie eine `const`-Variable nicht ändern können. Das Ausführen von `tsc hello.ts` wird einen Fehler auslösen:

```shell
hello.ts:2:1 - Fehler TS2588: Kann 'person' nicht zuweisen, da es konstant ist.

2 person = "hallo nochmal";
  ~~~~~~


1 Fehler gefunden.
```

Um einen einfachen Typescript-Compiler zu erstellen, fügen Sie in Ihrem `~/.vim/` Verzeichnis ein `compiler` Verzeichnis hinzu (`~/.vim/compiler/`), und erstellen Sie dann eine `typescript.vim` Datei (`~/.vim/compiler/typescript.vim`). Fügen Sie Folgendes ein:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

Die erste Zeile setzt `makeprg`, um den `tsc` Befehl auszuführen. Die zweite Zeile setzt das Fehlerformat, um die Datei (`%f`), gefolgt von einem literalen Doppelpunkt (`:`) und einem maskierten Leerzeichen (`\ `), gefolgt von der Fehlermeldung (`%m`) anzuzeigen. Um mehr über das Fehlerformat zu erfahren, schauen Sie sich `:h errorformat` an.

Sie sollten auch einige der vorgefertigten Compiler lesen, um zu sehen, wie andere es machen. Schauen Sie sich `:e $VIMRUNTIME/compiler/<eine-Sprache>.vim` an.

Da einige Plugins möglicherweise mit der Typescript-Datei interferieren, lassen Sie uns die `hello.ts` ohne Plugins öffnen, indem wir den `--noplugin`-Schalter verwenden:

```shell
vim --noplugin hello.ts
```

Überprüfen Sie `makeprg`:

```shell
:set makeprg?
```

Es sollte das Standard-`make` Programm anzeigen. Um den neuen Typescript-Compiler zu verwenden, führen Sie aus:

```shell
:compiler typescript
```

Wenn Sie `:set makeprg?` ausführen, sollte es jetzt `tsc` anzeigen. Lassen Sie uns das testen. Führen Sie aus:

```shell
:make %
```

Denken Sie daran, dass `%` die aktuelle Datei bedeutet. Sehen Sie zu, wie Ihr Typescript-Compiler wie erwartet funktioniert! Um die Liste der Fehler anzuzeigen, führen Sie `:copen` aus.

## Asynchroner Compiler

Manchmal kann das Kompilieren lange dauern. Sie möchten nicht auf einem eingefrorenen Vim starren, während Sie auf den Abschluss Ihres Kompilierungsprozesses warten. Wäre es nicht schön, wenn Sie asynchron kompilieren könnten, sodass Sie Vim während der Kompilierung weiterhin verwenden können?

Glücklicherweise gibt es Plugins, um asynchrone Prozesse auszuführen. Die beiden großen sind:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

Im Rest dieses Kapitels werde ich vim-dispatch behandeln, aber ich würde Ihnen dringend empfehlen, alle verfügbaren Plugins auszuprobieren.

*Vim und NeoVim unterstützen tatsächlich asynchrone Jobs, aber das liegt außerhalb des Rahmens dieses Kapitels. Wenn Sie neugierig sind, schauen Sie sich `:h job-channel-overview.txt` an.*

## Plugin: Vim-dispatch

Vim-dispatch hat mehrere Befehle, aber die beiden Hauptbefehle sind `:Make` und `:Dispatch`.

### Asynchrones Make

Der `:Make` Befehl von Vim-dispatch ist ähnlich wie Vims `:make`, aber er läuft asynchron. Wenn Sie sich in einem Javascript-Projekt befinden und `npm t` ausführen müssen, könnten Sie versuchen, Ihr makeprg so einzustellen:

```shell
:set makeprg=npm\\ t
```

Wenn Sie ausführen:

```shell
:make
```

Wird Vim `npm t` ausführen, aber Sie werden auf dem eingefrorenen Bildschirm starren, während Ihr JavaScript-Test läuft. Mit vim-dispatch können Sie einfach ausführen:

```shell
:Make
```

Vim wird `npm t` asynchron ausführen. Auf diese Weise können Sie während der Ausführung von `npm t` im Hintergrundprozess weiterhin alles tun, was Sie gerade tun. Großartig!

### Asynchrones Dispatch

Der `:Dispatch` Befehl ist wie der `:compiler` und der `:!` Befehl. Er kann jeden externen Befehl asynchron in Vim ausführen.

Angenommen, Sie befinden sich in einer Ruby-Spezifikationsdatei und müssen einen Test ausführen. Führen Sie aus:

```shell
:Dispatch bundle exec rspec %
```

Vim wird den `rspec` Befehl asynchron gegen die aktuelle Datei (`%`) ausführen.

### Automatisierung des Dispatch

Vim-dispatch hat die `b:dispatch` Puffer-Variable, die Sie konfigurieren können, um einen bestimmten Befehl automatisch auszuführen. Sie können dies mit `autocmd` nutzen. Wenn Sie dies in Ihre vimrc einfügen:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Jetzt wird jedes Mal, wenn Sie eine Datei (`BufEnter`) betreten, die mit `_spec.rb` endet, das Ausführen von `:Dispatch` automatisch `bundle exec rspec {Ihre-aktuelle-Ruby-Spezifikationsdatei}` ausführen.

## Lernen Sie, auf die smarte Art zu kompilieren

In diesem Kapitel haben Sie gelernt, dass Sie die `make` und `compiler` Befehle verwenden können, um *jeden* Prozess von innerhalb von Vim asynchron auszuführen, um Ihren Programmierworkflow zu ergänzen. Vims Fähigkeit, sich mit anderen Programmen zu erweitern, macht es mächtig.