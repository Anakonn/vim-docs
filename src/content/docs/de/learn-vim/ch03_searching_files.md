---
description: Dieser Abschnitt bietet eine Einführung in die schnelle Suche in Vim,
  sowohl ohne Plugins als auch mit dem fzf.vim-Plugin, um die Produktivität zu steigern.
title: Ch03. Searching Files
---

Das Ziel dieses Kapitels ist es, Ihnen eine Einführung zu geben, wie Sie schnell in Vim suchen können. Schnell suchen zu können, ist eine großartige Möglichkeit, Ihre Produktivität in Vim zu steigern. Als ich herausfand, wie man Dateien schnell durchsucht, wechselte ich zu Vim für die Vollzeitarbeit.

Dieses Kapitel ist in zwei Teile unterteilt: wie man ohne Plugins sucht und wie man mit dem [fzf.vim](https://github.com/junegunn/fzf.vim) Plugin sucht. Lass uns anfangen!

## Öffnen und Bearbeiten von Dateien

Um eine Datei in Vim zu öffnen, können Sie `:edit` verwenden.

```shell
:edit file.txt
```

Wenn `file.txt` existiert, wird der `file.txt`-Puffer geöffnet. Wenn `file.txt` nicht existiert, wird ein neuer Puffer für `file.txt` erstellt.

Die Autovervollständigung mit `<Tab>` funktioniert mit `:edit`. Wenn Ihre Datei beispielsweise in einem [Rails](https://rubyonrails.org/) *a*pp *c*ontroller *u*sers-Controller-Verzeichnis `./app/controllers/users_controllers.rb` liegt, können Sie `<Tab>` verwenden, um die Begriffe schnell zu erweitern:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` akzeptiert Wildcard-Argumente. `*` entspricht jeder Datei im aktuellen Verzeichnis. Wenn Sie nur nach Dateien mit der `.yml`-Erweiterung im aktuellen Verzeichnis suchen:

```shell
:edit *.yml<Tab>
```

Vim gibt Ihnen eine Liste aller `.yml`-Dateien im aktuellen Verzeichnis zur Auswahl.

Sie können `**` verwenden, um rekursiv zu suchen. Wenn Sie nach allen `*.md`-Dateien in Ihrem Projekt suchen möchten, aber nicht sicher sind, in welchen Verzeichnissen, können Sie dies tun:

```shell
:edit **/*.md<Tab>
```

`:edit` kann verwendet werden, um `netrw`, Vims integrierten Dateiexplorer, auszuführen. Dazu geben Sie `:edit` ein Verzeichnisargument anstelle einer Datei:

```shell
:edit .
:edit test/unit/
```

## Dateien mit Find suchen

Sie können Dateien mit `:find` finden. Zum Beispiel:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

Die Autovervollständigung funktioniert auch mit `:find`:

```shell
:find p<Tab>                " um package.json zu finden
:find a<Tab>c<Tab>u<Tab>    " um app/controllers/users_controller.rb zu finden
```

Sie werden vielleicht bemerken, dass `:find` wie `:edit` aussieht. Was ist der Unterschied?

## Finden und Pfad

Der Unterschied besteht darin, dass `:find` Dateien im `path` findet, `:edit` nicht. Lassen Sie uns ein wenig über `path` lernen. Sobald Sie gelernt haben, wie Sie Ihre Pfade ändern können, kann `:find` ein leistungsstarkes Suchwerkzeug werden. Um zu überprüfen, was Ihre Pfade sind, tun Sie:

```shell
:set path?
```

Standardmäßig sehen Ihre wahrscheinlich so aus:

```shell
path=.,/usr/include,,
```

- `.` bedeutet, im Verzeichnis der aktuell geöffneten Datei zu suchen.
- `,` bedeutet, im aktuellen Verzeichnis zu suchen.
- `/usr/include` ist das typische Verzeichnis für C-Bibliotheken Header-Dateien.

Die ersten beiden sind in unserem Kontext wichtig, und die dritte kann vorerst ignoriert werden. Die Erkenntnis hier ist, dass Sie Ihre eigenen Pfade ändern können, wo Vim nach Dateien suchen wird. Angenommen, dies ist Ihre Projektstruktur:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Wenn Sie von dem Stammverzeichnis zu `users_controller.rb` gelangen möchten, müssen Sie durch mehrere Verzeichnisse gehen (und eine beträchtliche Anzahl von Tabs drücken). Oft verbringen Sie beim Arbeiten mit einem Framework 90 % Ihrer Zeit in einem bestimmten Verzeichnis. In dieser Situation interessiert es Sie nur, mit der geringsten Anzahl von Tastenanschlägen in das Verzeichnis `controllers/` zu gelangen. Die `path`-Einstellung kann diese Reise verkürzen.

Sie müssen `app/controllers/` zum aktuellen `path` hinzufügen. So können Sie es tun:

```shell
:set path+=app/controllers/
```

Jetzt, da Ihr Pfad aktualisiert ist, wenn Sie `:find u<Tab>` eingeben, wird Vim jetzt im Verzeichnis `app/controllers/` nach Dateien suchen, die mit "u" beginnen.

Wenn Sie ein verschachteltes `controllers/`-Verzeichnis haben, wie `app/controllers/account/users_controller.rb`, wird Vim `users_controllers` nicht finden. Stattdessen müssen Sie `:set path+=app/controllers/**` hinzufügen, damit die Autovervollständigung `users_controller.rb` findet. Das ist großartig! Jetzt können Sie den Users-Controller mit einem Druck auf die Tabulatortaste anstelle von drei finden.

Sie denken vielleicht daran, die gesamten Projektverzeichnisse hinzuzufügen, damit Vim beim Drücken von `tab` überall nach dieser Datei sucht, so:

```shell
:set path+=$PWD/**
```

`$PWD` ist das aktuelle Arbeitsverzeichnis. Wenn Sie versuchen, Ihr gesamtes Projekt zum `path` hinzuzufügen, in der Hoffnung, dass alle Dateien bei einem `tab`-Druck erreichbar sind, mag dies für ein kleines Projekt funktionieren, aber dies wird Ihre Suche erheblich verlangsamen, wenn Sie eine große Anzahl von Dateien in Ihrem Projekt haben. Ich empfehle, nur den `path` Ihrer am häufigsten besuchten Dateien / Verzeichnisse hinzuzufügen.

Sie können `set path+={your-path-here}` in Ihre vimrc hinzufügen. Das Aktualisieren von `path` dauert nur wenige Sekunden und kann Ihnen viel Zeit sparen.

## In Dateien mit Grep suchen

Wenn Sie in Dateien suchen müssen (Phrasen in Dateien finden), können Sie grep verwenden. Vim hat zwei Möglichkeiten, dies zu tun:

- Internes grep (`:vim`. Ja, es wird `:vim` geschrieben. Es ist eine Abkürzung für `:vimgrep`).
- Externes grep (`:grep`).

Lassen Sie uns zuerst das interne grep durchgehen. `:vim` hat die folgende Syntax:

```shell
:vim /pattern/ file
```

- `/pattern/` ist ein Regex-Muster Ihres Suchbegriffs.
- `file` ist das Dateiargument. Sie können mehrere Argumente übergeben. Vim sucht nach dem Muster innerhalb des Dateiarguments. Ähnlich wie bei `:find` können Sie `*` und `**` Wildcards übergeben.

Zum Beispiel, um nach allen Vorkommen des Strings "breakfast" in allen Ruby-Dateien (`.rb`) im Verzeichnis `app/controllers/` zu suchen:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Nachdem Sie das ausgeführt haben, werden Sie zum ersten Ergebnis weitergeleitet. Vims `vim`-Suchbefehl verwendet die `quickfix`-Operation. Um alle Suchergebnisse zu sehen, führen Sie `:copen` aus. Dies öffnet ein `quickfix`-Fenster. Hier sind einige nützliche `quickfix`-Befehle, um Sie sofort produktiv zu machen:

```shell
:copen        Öffne das quickfix-Fenster
:cclose       Schließe das quickfix-Fenster
:cnext        Gehe zum nächsten Fehler
:cprevious    Gehe zum vorherigen Fehler
:colder       Gehe zur älteren Fehlerliste
:cnewer       Gehe zur neueren Fehlerliste
```

Um mehr über quickfix zu erfahren, schauen Sie sich `:h quickfix` an.

Sie werden vielleicht bemerken, dass das Ausführen von internem grep (`:vim`) langsam werden kann, wenn Sie eine große Anzahl von Übereinstimmungen haben. Dies liegt daran, dass Vim jede übereinstimmende Datei in den Speicher lädt, als ob sie bearbeitet wird. Wenn Vim eine große Anzahl von Dateien findet, die Ihrer Suche entsprechen, lädt es sie alle und verbraucht daher eine große Menge an Speicher.

Lassen Sie uns über externes grep sprechen. Standardmäßig verwendet es den `grep`-Terminalbefehl. Um nach "lunch" in einer Ruby-Datei im Verzeichnis `app/controllers/` zu suchen, können Sie dies tun:

```shell
:grep -R "lunch" app/controllers/
```

Beachten Sie, dass es anstelle von `/pattern/` der Terminalgrep-Syntax `"pattern"` folgt. Es zeigt auch alle Übereinstimmungen mit `quickfix` an.

Vim definiert die Variable `grepprg`, um zu bestimmen, welches externe Programm ausgeführt werden soll, wenn der `:grep`-Vim-Befehl ausgeführt wird, sodass Sie Vim nicht schließen und den Terminalbefehl `grep` aufrufen müssen. Später zeige ich Ihnen, wie Sie das Standardprogramm ändern können, das beim Verwenden des `:grep`-Vim-Befehls aufgerufen wird.

## Dateien mit Netrw durchsuchen

`netrw` ist Vims integrierter Dateiexplorer. Es ist nützlich, um die Hierarchie eines Projekts zu sehen. Um `netrw` auszuführen, benötigen Sie diese beiden Einstellungen in Ihrer `.vimrc`:

```shell
set nocp
filetype plugin on
```

Da `netrw` ein umfangreiches Thema ist, werde ich nur die grundlegende Verwendung behandeln, aber das sollte ausreichen, um Ihnen den Einstieg zu erleichtern. Sie können `netrw` starten, wenn Sie Vim starten, indem Sie ihm ein Verzeichnis als Parameter anstelle einer Datei übergeben. Zum Beispiel:

```shell
vim .
vim src/client/
vim app/controllers/
```

Um `netrw` von innerhalb von Vim zu starten, können Sie den Befehl `:edit` verwenden und ihm ein Verzeichnisparameter anstelle eines Dateinamens übergeben:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Es gibt andere Möglichkeiten, das `netrw`-Fenster zu starten, ohne ein Verzeichnis zu übergeben:

```shell
:Explore     Startet netrw mit der aktuellen Datei
:Sexplore    Kein Scherz. Startet netrw im oberen Teil des Bildschirms
:Vexplore    Startet netrw im linken Teil des Bildschirms
```

Sie können `netrw` mit Vim-Bewegungen navigieren (Bewegungen werden in einem späteren Kapitel ausführlich behandelt). Wenn Sie eine Datei oder ein Verzeichnis erstellen, löschen oder umbenennen müssen, hier ist eine Liste nützlicher `netrw`-Befehle:

```shell
%    Erstelle eine neue Datei
d    Erstelle ein neues Verzeichnis
R    Benenne eine Datei oder ein Verzeichnis um
D    Lösche eine Datei oder ein Verzeichnis
```

`:h netrw` ist sehr umfassend. Schauen Sie es sich an, wenn Sie Zeit haben.

Wenn Sie `netrw` zu fad finden und mehr Geschmack benötigen, ist [vim-vinegar](https://github.com/tpope/vim-vinegar) ein gutes Plugin, um `netrw` zu verbessern. Wenn Sie nach einem anderen Dateiexplorer suchen, ist [NERDTree](https://github.com/preservim/nerdtree) eine gute Alternative. Schauen Sie sich diese an!

## Fzf

Jetzt, da Sie gelernt haben, wie man in Vim mit integrierten Werkzeugen nach Dateien sucht, lassen Sie uns lernen, wie man es mit Plugins macht.

Eine Sache, die moderne Texteditoren richtig machen und die Vim nicht hat, ist, wie einfach es ist, Dateien zu finden, insbesondere über eine unscharfe Suche. In der zweiten Hälfte dieses Kapitels werde ich Ihnen zeigen, wie Sie [fzf.vim](https://github.com/junegunn/fzf.vim) verwenden, um die Suche in Vim einfach und leistungsstark zu gestalten.

## Einrichtung

Zuerst stellen Sie sicher, dass Sie [fzf](https://github.com/junegunn/fzf) und [ripgrep](https://github.com/BurntSushi/ripgrep) heruntergeladen haben. Befolgen Sie die Anweisungen in ihrem GitHub-Repo. Die Befehle `fzf` und `rg` sollten nach erfolgreicher Installation jetzt verfügbar sein.

Ripgrep ist ein Suchwerkzeug, das dem grep ähnelt (daher der Name). Es ist im Allgemeinen schneller als grep und hat viele nützliche Funktionen. Fzf ist ein allgemeines Befehlszeilen-Unscharf-Suchwerkzeug. Sie können es mit beliebigen Befehlen verwenden, einschließlich ripgrep. Zusammen bilden sie eine leistungsstarke Kombination von Suchwerkzeugen.

Fzf verwendet standardmäßig nicht ripgrep, daher müssen wir fzf mitteilen, dass es ripgrep verwenden soll, indem wir eine `FZF_DEFAULT_COMMAND`-Variable definieren. In meiner `.zshrc` (`.bashrc`, wenn Sie bash verwenden), habe ich diese:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Achten Sie auf `-m` in `FZF_DEFAULT_OPTS`. Diese Option ermöglicht es uns, mehrere Auswahlen mit `<Tab>` oder `<Shift-Tab>` zu treffen. Sie benötigen diese Zeile nicht, um fzf mit Vim zum Laufen zu bringen, aber ich denke, es ist eine nützliche Option. Sie wird nützlich sein, wenn Sie in mehreren Dateien suchen und ersetzen möchten, was ich gleich behandeln werde. Der fzf-Befehl akzeptiert viele weitere Optionen, aber ich werde sie hier nicht behandeln. Um mehr zu erfahren, schauen Sie sich das [fzf-Repo](https://github.com/junegunn/fzf#usage) oder `man fzf` an. Mindestens sollten Sie `export FZF_DEFAULT_COMMAND='rg'` haben.

Nachdem Sie fzf und ripgrep installiert haben, lassen Sie uns das fzf-Plugin einrichten. Ich verwende in diesem Beispiel den [vim-plug](https://github.com/junegunn/vim-plug) Plugin-Manager, aber Sie können jeden Plugin-Manager verwenden.

Fügen Sie diese in Ihre `.vimrc`-Plugins ein. Sie müssen das [fzf.vim](https://github.com/junegunn/fzf.vim) Plugin (erstellt vom gleichen fzf-Autor) verwenden.

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Nachdem Sie diese Zeilen hinzugefügt haben, müssen Sie `vim` öffnen und `:PlugInstall` ausführen. Es werden alle Plugins installiert, die in Ihrer `vimrc`-Datei definiert sind und nicht installiert sind. In unserem Fall wird `fzf.vim` und `fzf` installiert.

Für weitere Informationen zu diesem Plugin können Sie das [fzf.vim-Repo](https://github.com/junegunn/fzf/blob/master/README-VIM.md) überprüfen.
## Fzf-Syntax

Um fzf effizient zu nutzen, sollten Sie einige grundlegende fzf-Syntax lernen. Glücklicherweise ist die Liste kurz:

- `^` ist ein Präfix-Exaktvergleich. Um nach einem Satz zu suchen, der mit "willkommen" beginnt: `^willkommen`.
- `$` ist ein Suffix-Exaktvergleich. Um nach einem Satz zu suchen, der mit "meine Freunde" endet: `Freunde$`.
- `'` ist ein Exaktvergleich. Um nach dem Satz "willkommen meine Freunde" zu suchen: `'willkommen meine Freunde`.
- `|` ist ein "oder"-Vergleich. Um nach entweder "Freunde" oder "Feinde" zu suchen: `Freunde | Feinde`.
- `!` ist ein inverser Vergleich. Um nach einem Satz zu suchen, der "willkommen" enthält und nicht "Freunde": `willkommen !Freunde`

Sie können diese Optionen mischen und anpassen. Zum Beispiel wird `^hallo | ^willkommen Freunde$` nach dem Satz suchen, der entweder mit "willkommen" oder "hallo" beginnt und mit "Freunde" endet.

## Dateien Finden

Um Dateien innerhalb von Vim mit dem fzf.vim-Plugin zu suchen, können Sie die Methode `:Files` verwenden. Führen Sie `:Files` von Vim aus und Sie werden mit der fzf-Suchaufforderung aufgefordert.

Da Sie diesen Befehl häufig verwenden werden, ist es gut, ihn auf eine Tastenkombination zu mappen. Ich habe ihn auf `Ctrl-f` gemappt. In meiner vimrc habe ich das:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## In Dateien Suchen

Um innerhalb von Dateien zu suchen, können Sie den Befehl `:Rg` verwenden.

Da Sie dies wahrscheinlich häufig verwenden werden, lassen Sie uns das auf eine Tastenkombination mappen. Ich habe es auf `<Leader>f` gemappt. Die `<Leader>`-Taste ist standardmäßig auf `\` gemappt.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Andere Suchen

Fzf.vim bietet viele andere Suchbefehle. Ich werde hier nicht jeden einzelnen durchgehen, aber Sie können sie [hier](https://github.com/junegunn/fzf.vim#commands) einsehen.

So sehen meine fzf-Mappings aus:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Grep Durch Rg Ersetzen

Wie bereits erwähnt, hat Vim zwei Möglichkeiten, in Dateien zu suchen: `:vim` und `:grep`. `:grep` verwendet ein externes Suchwerkzeug, das Sie mit dem Schlüsselwort `grepprg` neu zuweisen können. Ich werde Ihnen zeigen, wie Sie Vim so konfigurieren, dass es ripgrep anstelle von terminal grep verwendet, wenn Sie den Befehl `:grep` ausführen.

Lassen Sie uns jetzt `grepprg` so einrichten, dass der `:grep`-Vim-Befehl ripgrep verwendet. Fügen Sie dies in Ihre vimrc ein:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Fühlen Sie sich frei, einige der oben genannten Optionen zu ändern! Für weitere Informationen darüber, was die oben genannten Optionen bedeuten, schauen Sie sich `man rg` an.

Nachdem Sie `grepprg` aktualisiert haben, führt der Befehl `:grep` jetzt `rg --vimgrep --smart-case --follow` anstelle von `grep` aus. Wenn Sie nach "donut" mit ripgrep suchen möchten, können Sie jetzt einen prägnanteren Befehl `:grep "donut"` anstelle von `:grep "donut" . -R` ausführen.

So wie das alte `:grep`, verwendet auch dieses neue `:grep` quickfix, um die Ergebnisse anzuzeigen.

Sie fragen sich vielleicht: "Nun, das ist schön, aber ich habe `:grep` in Vim nie verwendet, außerdem kann ich nicht einfach `:Rg` verwenden, um Phrasen in Dateien zu finden? Wann werde ich jemals `:grep` verwenden müssen?"

Das ist eine sehr gute Frage. Sie müssen möglicherweise `:grep` in Vim verwenden, um Suchen und Ersetzen in mehreren Dateien durchzuführen, was ich als Nächstes behandeln werde.

## Suchen und Ersetzen in Mehreren Dateien

Moderne Texteditoren wie VSCode machen es sehr einfach, einen String in mehreren Dateien zu suchen und zu ersetzen. In diesem Abschnitt werde ich Ihnen zwei verschiedene Methoden zeigen, um dies in Vim einfach zu tun.

Die erste Methode besteht darin, *alle* übereinstimmenden Phrasen in Ihrem Projekt zu ersetzen. Sie müssen `:grep` verwenden. Wenn Sie alle Vorkommen von "pizza" durch "donut" ersetzen möchten, gehen Sie folgendermaßen vor:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Lassen Sie uns die Befehle aufschlüsseln:

1. `:grep pizza` verwendet ripgrep, um nach allen Vorkommen von "pizza" zu suchen (übrigens würde dies auch funktionieren, wenn Sie `grepprg` nicht auf ripgrep umgestellt haben. Sie müssten stattdessen `:grep "pizza" . -R` verwenden).
2. `:cfdo` führt jeden Befehl aus, den Sie an alle Dateien in Ihrer Quickfix-Liste übergeben. In diesem Fall ist Ihr Befehl der Ersetzungsbefehl `%s/pizza/donut/g`. Die Pipe (`|`) ist ein Verknüpfungsoperator. Der Befehl `update` speichert jede Datei nach der Ersetzung. Ich werde den Ersetzungsbefehl in einem späteren Kapitel ausführlicher behandeln.

Die zweite Methode besteht darin, in ausgewählten Dateien zu suchen und zu ersetzen. Mit dieser Methode können Sie manuell auswählen, in welchen Dateien Sie die Auswahl-und-Ersetzen-Funktion ausführen möchten. Hier ist, was Sie tun:

1. Löschen Sie zuerst Ihre Puffer. Es ist wichtig, dass Ihre Pufferliste nur die Dateien enthält, auf die Sie die Ersetzung anwenden möchten. Sie können entweder Vim neu starten oder den Befehl `:%bd | e#` ausführen (`%bd` löscht alle Puffer und `e#` öffnet die Datei, an der Sie gerade waren).
2. Führen Sie `:Files` aus.
3. Wählen Sie alle Dateien aus, auf denen Sie die Suche-und-Ersetzen-Funktion ausführen möchten. Um mehrere Dateien auszuwählen, verwenden Sie `<Tab>` / `<Shift-Tab>`. Dies ist nur möglich, wenn Sie die Mehrfachflagge (`-m`) in `FZF_DEFAULT_OPTS` haben.
4. Führen Sie `:bufdo %s/pizza/donut/g | update` aus. Der Befehl `:bufdo %s/pizza/donut/g | update` sieht ähnlich aus wie der vorherige Befehl `:cfdo %s/pizza/donut/g | update`. Der Unterschied besteht darin, dass Sie anstelle von allen Quickfix-Einträgen (`:cfdo`) alle Puffer-Einträge (`:bufdo`) ersetzen.

## Lernen Sie, auf die Smarte Weise zu Suchen

Suchen ist das Brot und Butter des Texteditierens. Zu lernen, wie man gut in Vim sucht, wird Ihren Textbearbeitungsworkflow erheblich verbessern.

Fzf.vim ist ein Wendepunkt. Ich kann mir nicht vorstellen, Vim ohne es zu verwenden. Ich halte es für sehr wichtig, ein gutes Suchwerkzeug zu haben, wenn man mit Vim anfängt. Ich habe gesehen, wie Menschen Schwierigkeiten hatten, zu Vim zu wechseln, weil es scheint, dass es kritische Funktionen moderner Texteditoren vermisst, wie eine einfache und leistungsstarke Suchfunktion. Ich hoffe, dieses Kapitel wird Ihnen helfen, den Übergang zu Vim zu erleichtern.

Sie haben auch gerade die Erweiterbarkeit von Vim in Aktion gesehen - die Fähigkeit, die Suchfunktionalität mit einem Plugin und einem externen Programm zu erweitern. Denken Sie in Zukunft daran, welche anderen Funktionen Sie Vim erweitern möchten. Die Chancen stehen gut, dass es bereits in Vim vorhanden ist, jemand ein Plugin dafür erstellt hat oder es bereits ein Programm dafür gibt. Als Nächstes werden Sie ein sehr wichtiges Thema in Vim kennenlernen: die Grammatik von Vim.