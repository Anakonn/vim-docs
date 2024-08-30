---
description: In diesem Kapitel lernen Sie, wie Sie Vim konfigurieren und Ihre vimrc-Datei
  organisieren, um die Nutzung von Vim zu optimieren und anzupassen.
title: Ch22. Vimrc
---

In den vorherigen Kapiteln hast du gelernt, wie man Vim verwendet. In diesem Kapitel wirst du lernen, wie man vimrc organisiert und konfiguriert.

## Wie Vim Vimrc findet

Die allgemeine Weisheit für vimrc ist, eine `.vimrc`-Dotdatei im Home-Verzeichnis `~/.vimrc` hinzuzufügen (es könnte je nach deinem Betriebssystem anders sein).

Hinter den Kulissen sucht Vim an mehreren Orten nach einer vimrc-Datei. Hier sind die Orte, die Vim überprüft:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Wenn du Vim startest, wird es die oben genannten sechs Orte in dieser Reihenfolge auf eine vimrc-Datei überprüfen. Die zuerst gefundene vimrc-Datei wird verwendet und der Rest wird ignoriert.

Zuerst wird Vim nach einem `$VIMINIT` suchen. Wenn dort nichts ist, wird Vim nach `$HOME/.vimrc` suchen. Wenn dort nichts ist, wird Vim nach `$HOME/.vim/vimrc` suchen. Wenn Vim es findet, wird es aufhören zu suchen und `$HOME/.vim/vimrc` verwenden.

Der erste Ort, `$VIMINIT`, ist eine Umgebungsvariable. Standardmäßig ist sie undefiniert. Wenn du `~/dotfiles/testvimrc` als deinen `$VIMINIT`-Wert verwenden möchtest, kannst du eine Umgebungsvariable erstellen, die den Pfad dieser vimrc enthält. Nachdem du `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'` ausgeführt hast, wird Vim jetzt `~/dotfiles/testvimrc` als deine vimrc-Datei verwenden.

Der zweite Ort, `$HOME/.vimrc`, ist der konventionelle Pfad für viele Vim-Benutzer. `$HOME` ist in vielen Fällen dein Home-Verzeichnis (`~`). Wenn du eine `~/.vimrc`-Datei hast, wird Vim dies als deine vimrc-Datei verwenden.

Der dritte Ort, `$HOME/.vim/vimrc`, befindet sich im Verzeichnis `~/.vim`. Möglicherweise hast du das Verzeichnis `~/.vim` bereits für deine Plugins, benutzerdefinierten Skripte oder View-Dateien. Beachte, dass es keinen Punkt im Namen der vimrc-Datei gibt (`$HOME/.vim/.vimrc` funktioniert nicht, aber `$HOME/.vim/vimrc` funktioniert).

Der vierte Ort, `$EXINIT`, funktioniert ähnlich wie `$VIMINIT`.

Der fünfte Ort, `$HOME/.exrc`, funktioniert ähnlich wie `$HOME/.vimrc`.

Der sechste Ort, `$VIMRUNTIME/defaults.vim`, ist die Standard-vimrc, die mit deinem Vim-Build geliefert wird. In meinem Fall habe ich Vim 8.2 installiert, das mit Homebrew installiert wurde, also ist mein Pfad (`/usr/local/share/vim/vim82`). Wenn Vim keine der vorherigen sechs vimrc-Dateien findet, wird es diese Datei verwenden.

Für den Rest dieses Kapitels gehe ich davon aus, dass die vimrc den Pfad `~/.vimrc` verwendet.

## Was soll ich in meine Vimrc schreiben?

Eine Frage, die ich mir gestellt habe, als ich anfing, war: "Was soll ich in meine vimrc schreiben?"

Die Antwort ist: "Alles, was du möchtest." Die Versuchung, die vimrc anderer Leute zu kopieren, ist real, aber du solltest ihr widerstehen. Wenn du darauf bestehst, die vimrc eines anderen zu verwenden, stelle sicher, dass du verstehst, was sie tut, warum und wie er/sie sie verwendet, und am wichtigsten, ob sie für dich relevant ist. Nur weil jemand sie verwendet, bedeutet das nicht, dass du sie auch verwenden wirst.

## Grundlegender Inhalt der Vimrc

Kurz gesagt, eine vimrc ist eine Sammlung von:
- Plugins
- Einstellungen
- Benutzerdefinierten Funktionen
- Benutzerdefinierten Befehlen
- Zuordnungen

Es gibt noch andere Dinge, die oben nicht erwähnt wurden, aber im Allgemeinen deckt dies die meisten Anwendungsfälle ab.

### Plugins

In den vorherigen Kapiteln habe ich verschiedene Plugins erwähnt, wie [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo) und [vim-fugitive](https://github.com/tpope/vim-fugitive).

Vor zehn Jahren war das Verwalten von Plugins ein Albtraum. Mit dem Aufkommen moderner Plugin-Manager kann die Installation von Plugins jetzt in Sekunden erfolgen. Ich verwende derzeit [vim-plug](https://github.com/junegunn/vim-plug) als meinen Plugin-Manager, also werde ich es in diesem Abschnitt verwenden. Das Konzept sollte ähnlich sein wie bei anderen beliebten Plugin-Managern. Ich empfehle dir dringend, verschiedene auszuprobieren, wie:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Es gibt mehr Plugin-Manager als die oben aufgeführten, fühle dich frei, dich umzusehen. Um vim-plug zu installieren, führe, wenn du einen Unix-Rechner hast, folgendes aus:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Um neue Plugins hinzuzufügen, füge die Namen deiner Plugins (`Plug 'github-username/repository-name'`) zwischen den Zeilen `call plug#begin()` und `call plug#end()` ein. Wenn du also `emmet-vim` und `nerdtree` installieren möchtest, füge den folgenden Snippet in deine vimrc ein:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Speichere die Änderungen, lade sie neu (`:source %`) und führe `:PlugInstall` aus, um sie zu installieren.

In Zukunft, wenn du ungenutzte Plugins entfernen musst, musst du nur die Plugin-Namen aus dem `call`-Block entfernen, speichern und neu laden und den Befehl `:PlugClean` ausführen, um sie von deinem Rechner zu entfernen.

Vim 8 hat seine eigenen integrierten Paketmanager. Du kannst `:h packages` für weitere Informationen überprüfen. Im nächsten Kapitel zeige ich dir, wie du ihn verwendest.

### Einstellungen

Es ist üblich, viele `set`-Optionen in jeder vimrc zu sehen. Wenn du den set-Befehl im Befehlsmodus ausführst, ist er nicht dauerhaft. Du wirst ihn verlieren, wenn du Vim schließt. Zum Beispiel, anstatt `:set relativenumber number` jedes Mal im Befehlsmodus auszuführen, wenn du Vim startest, könntest du dies einfach in die vimrc einfügen:

```shell
set relativenumber number
```

Einige Einstellungen erfordern, dass du ihnen einen Wert übergibst, wie `set tabstop=2`. Schau dir die Hilfeseite für jede Einstellung an, um zu lernen, welche Art von Werten sie akzeptiert.

Du kannst auch `let` anstelle von `set` verwenden (stelle sicher, dass du es mit `&` voranstellst). Mit `let` kannst du einen Ausdruck als Wert verwenden. Zum Beispiel, um die `'dictionary'`-Option nur dann auf einen Pfad zu setzen, wenn der Pfad existiert:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Du wirst in späteren Kapiteln über Vimscript-Zuweisungen und Bedingungen lernen.

Für eine Liste aller möglichen Optionen in Vim, schau dir `:h E355` an.

### Benutzerdefinierte Funktionen

Die vimrc ist ein guter Ort für benutzerdefinierte Funktionen. Du wirst lernen, wie man eigene Vimscript-Funktionen in einem späteren Kapitel schreibt.

### Benutzerdefinierte Befehle

Du kannst einen benutzerdefinierten Befehlszeilenbefehl mit `command` erstellen.

Um einen einfachen Befehl `GimmeDate` zu erstellen, der das heutige Datum anzeigt:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Wenn du `:GimmeDate` ausführst, zeigt Vim ein Datum wie "2021-01-1" an.

Um einen einfachen Befehl mit einer Eingabe zu erstellen, kannst du `<args>` verwenden. Wenn du `GimmeDate` ein bestimmtes Zeit-/Datumsformat übergeben möchtest:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Wenn du die Anzahl der Argumente einschränken möchtest, kannst du das `-nargs`-Flag übergeben. Verwende `-nargs=0`, um kein Argument zu übergeben, `-nargs=1`, um ein Argument zu übergeben, `-nargs=+`, um mindestens ein Argument zu übergeben, `-nargs=*`, um beliebig viele Argumente zu übergeben, und `-nargs=?`, um 0 oder ein Argument zu übergeben. Wenn du das n-te Argument übergeben möchtest, verwende `-nargs=n` (wobei `n` eine beliebige ganze Zahl ist).

`<args>` hat zwei Varianten: `<f-args>` und `<q-args>`. Erstere wird verwendet, um Argumente an Vimscript-Funktionen zu übergeben. Letztere wird verwendet, um Benutzereingaben automatisch in Strings umzuwandeln.

Verwendung von `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" gibt 'Hello Iggy' zurück

:Hello Iggy
" Undefined variable error
```

Verwendung von `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" gibt 'Hello Iggy' zurück
```

Verwendung von `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " und " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" gibt "Hello Iggy1 und Iggy2" zurück
```

Die obigen Funktionen werden viel mehr Sinn machen, sobald du zum Kapitel über Vimscript-Funktionen kommst.

Um mehr über Befehle und Argumente zu erfahren, schau dir `:h command` und `:args` an.
### Karten

Wenn Sie feststellen, dass Sie wiederholt dieselbe komplexe Aufgabe ausführen, ist das ein gutes Indiz dafür, dass Sie eine Zuordnung für diese Aufgabe erstellen sollten.

Zum Beispiel habe ich diese beiden Zuordnungen in meiner vimrc:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Bei der ersten Zuordnung mappe ich `Ctrl-F` auf den `:Gfiles` Befehl des [fzf.vim](https://github.com/junegunn/fzf.vim) Plugins (schnelles Suchen nach Git-Dateien). Bei der zweiten Zuordnung mappe ich `<Leader>tn`, um eine benutzerdefinierte Funktion `ToggleNumber` aufzurufen (umschaltet die Optionen `norelativenumber` und `relativenumber`). Die `Ctrl-F` Zuordnung überschreibt das native Seitenrollen von Vim. Ihre Zuordnung wird die Vim-Steuerungen überschreiben, wenn sie kollidieren. Da ich diese Funktion fast nie verwendet habe, habe ich beschlossen, dass es sicher ist, sie zu überschreiben.

Übrigens, was ist dieser "Leader"-Key in `<Leader>tn`?

Vim hat einen Leader-Key, um bei Zuordnungen zu helfen. Zum Beispiel habe ich `<Leader>tn` zugeordnet, um die Funktion `ToggleNumber()` auszuführen. Ohne den Leader-Key würde ich `tn` verwenden, aber Vim hat bereits `t` (die "till" Suchnavigation). Mit dem Leader-Key kann ich jetzt die Taste drücken, die als Leader zugeordnet ist, und dann `tn`, ohne bestehende Befehle zu stören. Der Leader-Key ist eine Taste, die Sie einrichten können, um Ihre Zuordnungs-Kombination zu starten. Standardmäßig verwendet Vim den Backslash als Leader-Key (so wird `<Leader>tn` zu "Backslash-t-n").

Ich persönlich verwende lieber `<Space>` als Leader-Key anstelle des Standard-Backslash. Um Ihren Leader-Key zu ändern, fügen Sie dies in Ihre vimrc ein:

```shell
let mapleader = "\<space>"
```

Der oben verwendete Befehl `nnoremap` kann in drei Teile unterteilt werden:
- `n` steht für den normalen Modus.
- `nore` bedeutet nicht-rekursiv.
- `map` ist der Zuordnungsbefehl.

Mindestens hätten Sie `nmap` anstelle von `nnoremap` verwenden können (`nmap <silent> <C-f> :Gfiles<CR>`). Es ist jedoch eine gute Praxis, die nicht-rekursiv Variante zu verwenden, um potenzielle Endlosschleifen zu vermeiden.

Hier ist, was passieren könnte, wenn Sie nicht nicht-rekursiv zuordnen. Angenommen, Sie möchten eine Zuordnung zu `B` hinzufügen, um ein Semikolon am Ende der Zeile hinzuzufügen und dann ein WORD zurückzugehen (denken Sie daran, dass `B` in Vim eine Navigationstaste im normalen Modus ist, um ein WORD zurückzugehen).

```shell
nmap B A;<esc>B
```

Wenn Sie `B` drücken... oh nein! Vim fügt `;` unkontrolliert hinzu (unterbrechen Sie es mit `Ctrl-C`). Warum ist das passiert? Weil in der Zuordnung `A;<esc>B` das `B` nicht auf die native `B`-Funktion von Vim (ein WORD zurückgehen) verweist, sondern auf die zugeordnete Funktion. Was Sie tatsächlich haben, ist dies:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Um dieses Problem zu lösen, müssen Sie eine nicht-rekursive Zuordnung hinzufügen:

```shell
nnoremap B A;<esc>B
```

Versuchen Sie jetzt erneut, `B` aufzurufen. Diesmal fügt es erfolgreich ein `;` am Ende der Zeile hinzu und geht ein WORD zurück. Das `B` in dieser Zuordnung repräsentiert die ursprüngliche `B`-Funktionalität von Vim.

Vim hat unterschiedliche Zuordnungen für verschiedene Modi. Wenn Sie eine Zuordnung für den Einfügemodus erstellen möchten, um den Einfügemodus zu verlassen, wenn Sie `jk` drücken:

```shell
inoremap jk <esc>
```

Die anderen Zuordnungsmodi sind: `map` (Normal, Visuell, Auswählen und Operator-wartend), `vmap` (Visuell und Auswählen), `smap` (Auswählen), `xmap` (Visuell), `omap` (Operator-wartend), `map!` (Einfügen und Befehlszeile), `lmap` (Einfügen, Befehlszeile, Lang-arg), `cmap` (Befehlszeile) und `tmap` (Terminal-Job). Ich werde sie nicht im Detail behandeln. Um mehr zu erfahren, schauen Sie sich `:h map.txt` an.

Erstellen Sie eine Zuordnung, die am intuitivsten, konsistent und leicht zu merken ist.

## Organisieren der Vimrc

Im Laufe der Zeit wird Ihre vimrc groß und unübersichtlich. Es gibt zwei Möglichkeiten, Ihre vimrc sauber zu halten:
- Teilen Sie Ihre vimrc in mehrere Dateien auf.
- Falten Sie Ihre vimrc-Datei.

### Aufteilen Ihrer Vimrc

Sie können Ihre vimrc in mehrere Dateien aufteilen, indem Sie den `source` Befehl von Vim verwenden. Dieser Befehl liest Befehlszeilenbefehle aus dem angegebenen Dateipfad.

Lassen Sie uns eine Datei im Verzeichnis `~/.vim` erstellen und sie `/settings` nennen (`~/.vim/settings`). Der Name selbst ist willkürlich und Sie können ihn nennen, wie Sie möchten.

Sie werden es in vier Komponenten aufteilen:
- Drittanbieter-Plugins (`~/.vim/settings/plugins.vim`).
- Allgemeine Einstellungen (`~/.vim/settings/configs.vim`).
- Benutzerdefinierte Funktionen (`~/.vim/settings/functions.vim`).
- Tastenzuordnungen (`~/.vim/settings/mappings.vim`).

Innerhalb von `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Sie können diese Dateien bearbeiten, indem Sie den Cursor unter den Pfad setzen und `gf` drücken.

Innerhalb von `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Innerhalb von `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

Innerhalb von `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

Innerhalb von `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Ihre vimrc sollte wie gewohnt funktionieren, aber jetzt ist sie nur vier Zeilen lang!

Mit diesem Setup wissen Sie leicht, wo Sie hingehen müssen. Wenn Sie mehr Zuordnungen hinzufügen müssen, fügen Sie sie zur Datei `/mappings.vim` hinzu. In Zukunft können Sie immer mehr Verzeichnisse hinzufügen, während Ihre vimrc wächst. Wenn Sie beispielsweise eine Einstellung für Ihre Farbschemata erstellen müssen, können Sie eine `~/.vim/settings/themes.vim` hinzufügen.

### Eine Vimrc-Datei beibehalten

Wenn Sie es vorziehen, eine einzige vimrc-Datei zu behalten, um sie portabel zu halten, können Sie die Marker-Falten verwenden, um sie organisiert zu halten. Fügen Sie dies oben in Ihre vimrc ein:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim kann erkennen, welche Art von Dateityp der aktuelle Puffer hat (`:set filetype?`). Wenn es sich um einen `vim` Dateityp handelt, können Sie eine Marker-Faltmethode verwenden. Denken Sie daran, dass eine Marker-Faltung `{{{` und `}}}` verwendet, um den Beginn und das Ende der Faltungen anzuzeigen.

Fügen Sie `{{{` und `}}}` Faltungen zum Rest Ihrer vimrc hinzu (vergessen Sie nicht, sie mit `"` zu kommentieren):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Ihre vimrc sollte jetzt so aussehen:

```shell
+-- 6 Zeilen: setup folds -----

+-- 6 Zeilen: plugins ---------

+-- 5 Zeilen: configs ---------

+-- 9 Zeilen: functions -------

+-- 5 Zeilen: mappings --------
```

## Vim Mit oder Ohne Vimrc und Plugins Ausführen

Wenn Sie Vim ohne sowohl vimrc als auch Plugins ausführen müssen, führen Sie aus:

```shell
vim -u NONE
```

Wenn Sie Vim ohne vimrc, aber mit Plugins starten müssen, führen Sie aus:

```shell
vim -u NORC
```

Wenn Sie Vim mit vimrc, aber ohne Plugins ausführen müssen, führen Sie aus:

```shell
vim --noplugin
```

Wenn Sie Vim mit einer *anderen* vimrc, sagen wir `~/.vimrc-backup`, ausführen müssen, führen Sie aus:

```shell
vim -u ~/.vimrc-backup
```

Wenn Sie Vim nur mit `defaults.vim` und ohne Plugins ausführen müssen, was hilfreich ist, um eine defekte vimrc zu reparieren, führen Sie aus:

```shell
vim --clean
```

## Vimrc Auf Smarte Weise Konfigurieren

Die vimrc ist ein wichtiger Bestandteil der Vim-Anpassung. Ein guter Weg, um mit dem Aufbau Ihrer vimrc zu beginnen, besteht darin, die vimrcs anderer Leute zu lesen und sie im Laufe der Zeit schrittweise aufzubauen. Die beste vimrc ist nicht die, die Entwickler X verwendet, sondern die, die genau auf Ihr Denkgerüst und Ihren Bearbeitungsstil zugeschnitten ist.