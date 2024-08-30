---
description: In diesem Kapitel wird die Entwicklung des Vim-Plugins "totitle-vim"
  vorgestellt, das eine Titelcase-Operator-Funktion für Überschriften bietet.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Wenn du anfängst, gut in Vim zu werden, möchtest du vielleicht deine eigenen Plugins schreiben. Ich habe kürzlich mein erstes Vim-Plugin, [totitle-vim](https://github.com/iggredible/totitle-vim), geschrieben. Es ist ein Titelcase-Operator-Plugin, ähnlich wie Vims Großbuchstaben-`gU`, Kleinbuchstaben-`gu` und Togglecase-`g~` Operatoren.

In diesem Kapitel werde ich die Aufschlüsselung des `totitle-vim` Plugins vorstellen. Ich hoffe, einige Einblicke in den Prozess zu geben und dich vielleicht zu inspirieren, dein eigenes einzigartiges Plugin zu erstellen!

## Das Problem

Ich benutze Vim, um meine Artikel zu schreiben, einschließlich dieses Leitfadens.

Ein Hauptproblem war, eine ordentliche Titelcase für die Überschriften zu erstellen. Eine Möglichkeit, dies zu automatisieren, besteht darin, jedes Wort im Header mit `g/^#/ s/\<./\u\0/g` zu kapitalisieren. Für die grundlegende Verwendung war dieser Befehl gut genug, aber es ist immer noch nicht so gut wie eine tatsächliche Titelcase. Die Wörter "The" und "Of" in "Capitalize The First Letter Of Each Word" sollten großgeschrieben werden. Ohne eine ordentliche Großschreibung sieht der Satz etwas seltsam aus.

Zunächst hatte ich nicht vor, ein Plugin zu schreiben. Außerdem stellte sich heraus, dass es bereits ein Titelcase-Plugin gibt: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Es gab jedoch einige Dinge, die nicht ganz so funktionierten, wie ich es wollte. Das Hauptproblem war das Verhalten des blockweisen visuellen Modus. Wenn ich den Satz habe:

```shell
test title one
test title two
test title three
```

Wenn ich eine blockweise visuelle Hervorhebung auf das "tle" verwende:

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Wenn ich `gt` drücke, wird es vom Plugin nicht kapitalisiert. Ich finde es inkonsistent mit den Verhaltensweisen von `gu`, `gU` und `g~`. Also beschloss ich, von diesem Titelcase-Plugin-Repo aus zu arbeiten und ein Titelcase-Plugin zu erstellen, das konsistent mit `gu`, `gU` und `g~` ist! Nochmals, das vim-titlecase Plugin selbst ist ein ausgezeichnetes Plugin und es ist wert, allein verwendet zu werden (die Wahrheit ist, vielleicht wollte ich tief im Inneren einfach mein eigenes Vim-Plugin schreiben. Ich kann mir wirklich nicht vorstellen, dass die blockweise Titelcase-Funktion im echten Leben oft verwendet wird, außer in Ausnahmefällen).

### Planung für das Plugin

Bevor ich die erste Codezeile schreibe, muss ich entscheiden, welche Regeln für die Titelcase gelten. Ich fand eine nette Tabelle mit verschiedenen Großschreibungsregeln von der [titlecaseconverter-Seite](https://titlecaseconverter.com/rules/). Wusstest du, dass es mindestens 8 verschiedene Großschreibungsregeln in der englischen Sprache gibt? *Schnappatmung!*

Am Ende verwendete ich die gemeinsamen Nenner aus dieser Liste, um eine ausreichend gute Grundregel für das Plugin zu entwickeln. Außerdem bezweifle ich, dass sich jemand beschwert: "Hey Mann, du benutzt AMA, warum benutzt du nicht APA?". Hier sind die grundlegenden Regeln:
- Das erste Wort wird immer großgeschrieben.
- Einige Adverbien, Konjunktionen und Präpositionen werden kleingeschrieben.
- Wenn das Eingabewort vollständig großgeschrieben ist, dann mache nichts (es könnte eine Abkürzung sein).

Was die kleingeschriebenen Wörter betrifft, haben verschiedene Regeln unterschiedliche Listen. Ich entschied mich, bei `a an and at but by en for in nor of off on or out per so the to up yet vs via` zu bleiben.

### Planung für die Benutzeroberfläche

Ich möchte, dass das Plugin ein Operator ist, um die bestehenden Falloperatoren von Vim zu ergänzen: `gu`, `gU` und `g~`. Als Operator muss es entweder eine Bewegung oder ein Textelement akzeptieren (`gtw` sollte das nächste Wort in Titelcase setzen, `gtiw` sollte das innere Wort in Titelcase setzen, `gt$` sollte die Wörter vom aktuellen Standort bis zum Ende der Zeile in Titelcase setzen, `gtt` sollte die aktuelle Zeile in Titelcase setzen, `gti(` sollte die Wörter innerhalb der Klammern in Titelcase setzen usw.). Ich möchte auch, dass es auf `gt` für einfache Merkhilfen abgebildet wird. Darüber hinaus sollte es auch mit allen visuellen Modi funktionieren: `v`, `V` und `Ctrl-V`. Ich sollte in *irgendeinem* visuellen Modus markieren können, `gt` drücken und dann sollten alle markierten Texte in Titelcase gesetzt werden.

## Vim Runtime

Das erste, was du siehst, wenn du das Repo ansiehst, ist, dass es zwei Verzeichnisse hat: `plugin/` und `doc/`. Wenn du Vim startest, sucht es nach speziellen Dateien und Verzeichnissen im `~/.vim` Verzeichnis und führt alle Skriptdateien in diesem Verzeichnis aus. Für mehr Informationen, siehe das Kapitel über Vim Runtime.

Das Plugin nutzt zwei Vim-Runtime-Verzeichnisse: `doc/` und `plugin/`. `doc/` ist ein Ort, um die Hilfsdokumentation zu speichern (damit du später nach Schlüsselwörtern suchen kannst, wie `:h totitle`). Ich werde später erläutern, wie man eine Hilfeseite erstellt. Für jetzt konzentrieren wir uns auf `plugin/`. Das `plugin/` Verzeichnis wird einmal ausgeführt, wenn Vim hochfährt. Es gibt eine Datei in diesem Verzeichnis: `totitle.vim`. Der Name spielt keine Rolle (ich hätte es auch `whatever.vim` nennen können und es würde immer noch funktionieren). Der gesamte Code, der für das Funktionieren des Plugins verantwortlich ist, befindet sich in dieser Datei.

## Mappings

Lass uns den Code durchgehen!

Am Anfang der Datei hast du:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Wenn du Vim startest, existiert `g:totitle_default_keys` noch nicht, also gibt `!exists(...)` true zurück. In diesem Fall wird `g:totitle_default_keys` auf 1 gesetzt. In Vim ist 0 falsy und nicht null ist truthy (verwende 1, um truthy anzuzeigen).

Lass uns zum Ende der Datei springen. Du wirst dies sehen:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Hier wird das Hauptmapping für `gt` definiert. In diesem Fall würde `if g:totitle_default_keys` am Ende der Datei 1 (truthy) zurückgeben, also führt Vim die folgenden Mappings aus:
- `nnoremap <expr> gt ToTitle()` mappt den normalen Modus *Operator*. Dies ermöglicht es dir, Operator + Bewegung/Textobjekt wie `gtw` zu verwenden, um das nächste Wort in Titelcase zu setzen oder `gtiw`, um das innere Wort in Titelcase zu setzen. Ich werde später die Details des Operator-Mappings erläutern.
- `xnoremap <expr> gt ToTitle()` mappt die visuellen Modus-Operatoren. Dies ermöglicht es dir, die Texte, die visuell hervorgehoben sind, in Titelcase zu setzen.
- `nnoremap <expr> gtt ToTitle() .. '_'` mappt den normalen Modus zeilenweisen Operator (analog zu `guu` und `gUU`). Du fragst dich vielleicht, was `.. '_'` am Ende macht. `..` ist Vims String-Interpolationsoperator. `_` wird als Bewegung mit einem Operator verwendet. Wenn du in `:help _` schaust, steht dort, dass der Unterstrich verwendet wird, um 1 Zeile nach unten zu zählen. Es führt einen Operator in der aktuellen Zeile aus (versuche es mit anderen Operatoren, versuche `gU_` oder `d_` auszuführen, bemerke, dass es dasselbe wie `gUU` oder `dd` macht).
- Schließlich ermöglicht das `<expr>` Argument, die Anzahl anzugeben, sodass du `3gtw` verwenden kannst, um die nächsten 3 Wörter in Titelcase zu setzen.

Was ist, wenn du das Standardmapping `gt` nicht verwenden möchtest? Schließlich überschreibst du Vims Standardmapping `gt` (Tabulator nach vorne). Was ist, wenn du stattdessen `gz` verwenden möchtest? Erinnerst du dich, wie du zuvor die Mühe hattest, `if !exists('g:totitle_default_keys')` und `if g:totitle_default_keys` zu überprüfen? Wenn du `let g:totitle_default_keys = 0` in deiner vimrc einfügst, dann würde `g:totitle_default_keys` bereits existieren, wenn das Plugin ausgeführt wird (Codes in deiner vimrc werden vor den `plugin/` Runtime-Dateien ausgeführt), sodass `!exists('g:totitle_default_keys')` false zurückgibt. Darüber hinaus wäre `if g:totitle_default_keys` falsy (weil es den Wert 0 hätte), also würde es auch das `gt` Mapping nicht ausführen! Dies ermöglicht es dir effektiv, dein eigenes benutzerdefiniertes Mapping in der Vimrc zu definieren.

Um dein eigenes Titelcase-Mapping auf `gz` zu definieren, füge dies in deine vimrc ein:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Ganz einfach.

## Die ToTitle Funktion

Die `ToTitle()` Funktion ist leicht die längste Funktion in dieser Datei.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " invoke this when calling the ToTitle() function
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " save the current settings
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " when user calls a block operation
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " when user calls a char or line operation
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " restore the settings
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Das ist sehr lang, also lass uns es aufteilen.

*Ich könnte dies in kleinere Abschnitte umstrukturieren, aber um dieses Kapitel abzuschließen, habe ich es einfach so gelassen.*
## Die Operatorfunktion

Hier ist der erste Teil des Codes:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

Was zur Hölle ist `opfunc`? Warum gibt es `g@` zurück?

Vim hat einen speziellen Operator, die Operatorfunktion, `g@`. Dieser Operator ermöglicht es dir, *jede* Funktion zu verwenden, die der `opfunc`-Option zugewiesen ist. Wenn ich die Funktion `Foo()` der `opfunc` zugewiesen habe, dann führe ich beim Ausführen von `g@w` die `Foo()` auf dem nächsten Wort aus. Wenn ich `g@i(` ausführe, führe ich `Foo()` auf den inneren Klammern aus. Diese Operatorfunktion ist entscheidend, um deinen eigenen Vim-Operator zu erstellen.

Die folgende Zeile weist die `opfunc` der Funktion `ToTitle` zu.

```shell
set opfunc=ToTitle
```

Die nächste Zeile gibt buchstäblich `g@` zurück:

```shell
return g@
```

Wie funktionieren also diese beiden Zeilen und warum gibt es `g@` zurück?

Nehmen wir an, du hast die folgende Zuordnung:

```shell
nnoremap <expr> gt ToTitle()`
```

Dann drückst du `gtw` (Titel des nächsten Wortes). Das erste Mal, wenn du `gtw` ausführst, ruft Vim die Methode `ToTitle()` auf. Aber im Moment ist `opfunc` noch leer. Du übergibst auch kein Argument an `ToTitle()`, sodass es den Wert `a:type` von `''` haben wird. Dies führt dazu, dass der bedingte Ausdruck das Argument `a:type`, `if a:type ==# ''`, als wahr betrachtet. Innerhalb dessen weist du `opfunc` mit `set opfunc=ToTitle` der Funktion `ToTitle` zu. Jetzt ist `opfunc` der `ToTitle` zugewiesen. Schließlich, nachdem du `opfunc` der Funktion `ToTitle` zugewiesen hast, gibst du `g@` zurück. Ich werde erklären, warum es `g@` zurückgibt.

Du bist noch nicht fertig. Denk daran, du hast gerade `gtw` gedrückt. Das Drücken von `gt` hat all die oben genannten Dinge getan, aber du hast immer noch `w` zu verarbeiten. Indem du `g@` zurückgibst, hast du zu diesem Zeitpunkt technisch `g@w` (deshalb hast du `return g@`). Da `g@` der Funktionsoperator ist, übergibst du ihm die `w`-Bewegung. Wenn Vim also `g@w` erhält, ruft es die `ToTitle` *einmal mehr* auf (keine Sorge, du wirst nicht in einer Endlosschleife enden, wie du gleich sehen wirst).

Zusammenfassend lässt sich sagen, dass Vim beim Drücken von `gtw` überprüft, ob `opfunc` leer ist oder nicht. Wenn es leer ist, wird es mit `ToTitle` belegt. Dann gibt es `g@` zurück, was im Wesentlichen die `ToTitle` ein weiteres Mal aufruft, sodass du es jetzt als Operator verwenden kannst. Dies ist der kniffligste Teil der Erstellung eines benutzerdefinierten Operators, und du hast es geschafft! Als Nächstes musst du die Logik für `ToTitle()` erstellen, um tatsächlich den Eingabetext in Titelcase zu konvertieren.

## Verarbeitung der Eingabe

Du hast jetzt `gt`, das als Operator fungiert, der `ToTitle()` ausführt. Aber was machst du als Nächstes? Wie konvertierst du tatsächlich den Text in Titelcase?

Wann immer du einen Operator in Vim ausführst, gibt es drei verschiedene Aktionsbewegungstypen: Zeichen, Zeile und Block. `g@w` (Wort) ist ein Beispiel für eine Zeichenoperation. `g@j` (eine Zeile darunter) ist ein Beispiel für eine Zeilenoperation. Blockoperationen sind selten, aber typischerweise, wenn du eine `Ctrl-V` (visuelle Block) Operation machst, wird dies als Blockoperation gezählt. Operationen, die sich auf einige Zeichen vorwärts / rückwärts richten, werden allgemein als Zeichenoperationen betrachtet (`b`, `e`, `w`, `ge` usw.). Operationen, die sich auf einige Zeilen nach unten / oben richten, werden allgemein als Zeilenoperationen betrachtet (`j`, `k`). Operationen, die sich auf Spalten vorwärts, rückwärts, nach oben oder nach unten richten, werden allgemein als Blockoperationen betrachtet (sie sind normalerweise entweder eine spaltenweise erzwungene Bewegung oder ein blockweiser visueller Modus; für mehr: `:h forced-motion`).

Das bedeutet, wenn du `g@w` drückst, wird `g@` einen Literalstring `"char"` als Argument an `ToTitle()` übergeben. Wenn du `g@j` machst, wird `g@` einen Literalstring `"line"` als Argument an `ToTitle()` übergeben. Dieser String ist das, was als `type`-Argument in die `ToTitle`-Funktion übergeben wird.

## Erstellen deines eigenen benutzerdefinierten Funktionsoperators

Lass uns eine Pause machen und mit `g@` spielen, indem wir eine Dummy-Funktion schreiben:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Weise jetzt diese Funktion `opfunc` zu, indem du ausführst:

```shell
:set opfunc=Test
```

Der `g@`-Operator wird `Test(some_arg)` ausführen und es mit entweder `"char"`, `"line"` oder `"block"` übergeben, abhängig von der Operation, die du machst. Führe verschiedene Operationen wie `g@iw` (inneres Wort), `g@j` (eine Zeile darunter), `g@$` (bis zum Ende der Zeile) usw. aus. Sieh dir an, welche verschiedenen Werte ausgegeben werden. Um die Blockoperation zu testen, kannst du Vims erzwungene Bewegung für Blockoperationen verwenden: `g@Ctrl-Vj` (Blockoperation eine Spalte darunter).

Du kannst es auch mit dem visuellen Modus verwenden. Verwende die verschiedenen visuellen Hervorhebungen wie `v`, `V` und `Ctrl-V` und drücke dann `g@` (sei gewarnt, es wird die Ausgabe sehr schnell blitzen, also musst du ein schnelles Auge haben - aber die Ausgabe ist definitiv da. Außerdem kannst du, da du `echom` verwendest, die aufgezeichneten Echo-Nachrichten mit `:messages` überprüfen).

Ziemlich cool, oder? Die Dinge, die du mit Vim programmieren kannst! Warum haben sie das nicht in der Schule beigebracht? Lass uns mit unserem Plugin fortfahren.

## ToTitle als Funktion

Weiter zu den nächsten Zeilen:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Diese Zeile hat tatsächlich nichts mit dem Verhalten von `ToTitle()` als Operator zu tun, sondern um es in eine aufrufbare TitleCase-Funktion zu aktivieren (ja, ich weiß, dass ich das Prinzip der Einzelverantwortung verletze). Die Motivation ist, dass Vim native `toupper()` und `tolower()` Funktionen hat, die jeden gegebenen String in Groß- und Kleinbuchstaben umwandeln. Beispiel: `:echo toupper('hello')` gibt `'HELLO'` zurück und `:echo tolower('HELLO')` gibt `'hello'` zurück. Ich möchte, dass dieses Plugin die Fähigkeit hat, `ToTitle` auszuführen, sodass du `:echo ToTitle('once upon a time')` machen und einen Rückgabewert von `'Once Upon a Time'` erhalten kannst.

Bis jetzt weißt du, dass, wenn du `ToTitle(type)` mit `g@` aufrufst, das `type`-Argument den Wert entweder `'block'`, `'line'` oder `'char'` haben wird. Wenn das Argument weder `'block'` noch `'line'` noch `'char'` ist, kannst du sicher annehmen, dass `ToTitle()` außerhalb von `g@` aufgerufen wird. In diesem Fall teilst du sie durch Leerzeichen (`\s\+`) mit:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Dann kapitalisierst du jedes Element:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Bevor du sie wieder zusammenfügst:

```shell
l:wordsArr->join(' ')
```

Die Funktion `capitalize()` wird später behandelt.

## Temporäre Variablen

Die nächsten Zeilen:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Diese Zeilen bewahren verschiedene aktuelle Zustände in temporären Variablen. Später in diesem Abschnitt wirst du visuelle Modi, Markierungen und Register verwenden. Diese Operationen werden einige Zustände beeinflussen. Da du die Historie nicht überarbeiten möchtest, musst du sie in temporären Variablen speichern, damit du die Zustände später wiederherstellen kannst.
## Großschreibung der Auswahlen

Die nächsten Zeilen sind wichtig:

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
Lass uns diese in kleinen Abschnitten durchgehen. Diese Zeile:

```shell
set clipboard= selection=inclusive
```

Du setzt zuerst die `selection`-Option auf inklusiv und die `clipboard` auf leer. Das Auswahlattribut wird typischerweise im visuellen Modus verwendet und es gibt drei mögliche Werte: `old`, `inclusive` und `exclusive`. Es auf inklusiv zu setzen bedeutet, dass das letzte Zeichen der Auswahl einbezogen wird. Ich werde sie hier nicht behandeln, aber der Punkt ist, dass die Wahl, es inklusiv zu machen, es im visuellen Modus konsistent macht. Standardmäßig setzt Vim es auf inklusiv, aber du setzt es hier trotzdem, falls eines deiner Plugins es auf einen anderen Wert setzt. Schau dir `:h 'clipboard'` und `:h 'selection'` an, wenn du neugierig bist, was sie wirklich tun.

Als nächstes hast du diesen seltsam aussehenden Hash gefolgt von einem Ausführungsbefehl:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Zuerst ist die `#{}`-Syntax der Dictionary-Datentyp von Vim. Die lokale Variable `l:commands` ist ein Hash mit 'lines', 'char' und 'block' als Schlüssel. Der Befehl `silent exe '...'` führt jeden Befehl innerhalb des Strings still aus (ansonsten werden Benachrichtigungen am unteren Bildschirmrand angezeigt).

Zweitens sind die ausgeführten Befehle `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. Der erste, `noautocmd`, führt den nachfolgenden Befehl aus, ohne irgendeinen Autocommand auszulösen. Der zweite, `keepjumps`, sorgt dafür, dass die Cursorbewegung beim Bewegen nicht aufgezeichnet wird. In Vim werden bestimmte Bewegungen automatisch in der Änderungs-, Sprung- und Markierungsliste aufgezeichnet. Das verhindert dies. Der Punkt, `noautocmd` und `keepjumps` zu haben, ist, um Nebeneffekte zu vermeiden. Schließlich führt der `normal`-Befehl die Strings als normale Befehle aus. Das `..` ist die String-Interpolation-Syntax von Vim. `get()` ist eine Getter-Methode, die entweder eine Liste, ein Blob oder ein Dictionary akzeptiert. In diesem Fall übergibst du das Dictionary `l:commands`. Der Schlüssel ist `a:type`. Du hast zuvor gelernt, dass `a:type` einer der drei Stringwerte ist: 'char', 'line' oder 'block'. Wenn also `a:type` 'line' ist, führst du `"noautocmd keepjumps normal! '[V']y"` aus (für mehr Informationen, siehe `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal` und `:h get()`).

Lass uns ansehen, was `'[V']y` macht. Angenommen, du hast diesen Textkörper:

```shell
das zweite Frühstück
ist besser als das erste Frühstück
```
Angenommen, dein Cursor befindet sich in der ersten Zeile. Dann drückst du `g@j` (führe die Operatorfunktion `g@` eine Zeile nach unten mit `j` aus). `'[` bewegt den Cursor zum Anfang des zuvor geänderten oder yankierten Textes. Obwohl du technisch gesehen keinen Text mit `g@j` geändert oder yankiert hast, merkt sich Vim die Positionen der Start- und Endbewegungen des `g@`-Befehls mit `'[` und `']` (für mehr, siehe `:h g@`). In deinem Fall bewegt das Drücken von `'[` deinen Cursor zur ersten Zeile, weil das der Punkt ist, an dem du gestartet hast, als du `g@` ausgeführt hast. `V` ist ein zeilenweises visuelles Moduskommando. Schließlich bewegt `']` deinen Cursor zum Ende des vorherigen geänderten oder yankierten Textes, aber in diesem Fall bewegt es deinen Cursor zum Ende deiner letzten `g@`-Operation. Schließlich yankiert `y` den ausgewählten Text.

Was du gerade getan hast, war das Yankieren desselben Textkörpers, auf den du `g@` angewendet hast.

Wenn du dir die anderen beiden Befehle hier ansiehst:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Führen sie alle ähnliche Aktionen aus, nur dass anstelle von zeilenweisen Aktionen zeichenweise oder blockweise Aktionen verwendet werden. Ich werde redundant klingen, aber in allen drei Fällen yankierst du effektiv denselben Textkörper, auf den du `g@` angewendet hast.

Schauen wir uns die nächste Zeile an:

```shell
let l:selected_phrase = getreg('"')
```

Diese Zeile erhält den Inhalt des unbenannten Registers (`"`) und speichert ihn in der Variablen `l:selected_phrase`. Warte mal... hast du nicht gerade einen Textkörper yankiert? Das unbenannte Register enthält derzeit den Text, den du gerade yankiert hast. So kann dieses Plugin eine Kopie des Textes erhalten.

Die nächste Zeile ist ein regulärer Ausdruck:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` und `\>` sind Muster für Wortgrenzen. Das Zeichen, das `\<` folgt, entspricht dem Anfang eines Wortes und das Zeichen, das `\>` vorangeht, entspricht dem Ende eines Wortes. `\k` ist das Schlüsselwortmuster. Du kannst überprüfen, welche Zeichen Vim als Schlüsselwörter akzeptiert, mit `:set iskeyword?`. Erinnere dich, dass die `w`-Bewegung in Vim den Cursor wortweise bewegt. Vim hat eine vorgefasste Vorstellung davon, was ein "Schlüsselwort" ist (du kannst sie sogar bearbeiten, indem du die `iskeyword`-Option änderst). Sieh dir `:h /\<`, `:h /\>`, `:h /\k` und `:h 'iskeyword'` für mehr Informationen an. Schließlich bedeutet `*`, dass null oder mehr des nachfolgenden Musters übereinstimmen.

Im Großen und Ganzen entspricht `'\<\k*\>'` einem Wort. Wenn du einen String hast:

```shell
eins zwei drei
```

Wird das Abgleichen mit dem Muster drei Übereinstimmungen ergeben: "eins", "zwei" und "drei".

Schließlich hast du ein weiteres Muster:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Erinnere dich, dass Vims Ersetzungsbefehl mit einem Ausdruck verwendet werden kann mit `\={dein-Ausdruck}`. Zum Beispiel, wenn du den String "donut" in der aktuellen Zeile großschreiben möchtest, kannst du Vims `toupper()`-Funktion verwenden. Du kannst dies erreichen, indem du `:%s/donut/\=toupper(submatch(0))/g` ausführst. `submatch(0)` ist ein spezieller Ausdruck, der im Ersetzungsbefehl verwendet wird. Er gibt den gesamten übereinstimmenden Text zurück.

Die nächsten beiden Zeilen:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

Der Ausdruck `line()` gibt eine Zeilennummer zurück. Hier übergibst du es mit dem Markierung `'<`, die die erste Zeile des zuletzt ausgewählten visuellen Bereichs darstellt. Erinnere dich, dass du den visuellen Modus verwendet hast, um den Text zu yankieren. `'<` gibt die Zeilennummer des Beginns dieser visuellen Bereichsauswahl zurück. Der Ausdruck `virtcol()` gibt eine Spaltennummer des aktuellen Cursors zurück. Du wirst deinen Cursor gleich überall hin bewegen, also musst du deinen Cursorstandort speichern, damit du später hierher zurückkehren kannst.

Mach hier eine Pause und überprüfe alles bisher. Stelle sicher, dass du noch mitkommst. Wenn du bereit bist, lass uns fortfahren.
## Umgang mit einer Blockoperation

Lass uns diesen Abschnitt durchgehen:

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Es ist an der Zeit, deinen Text tatsächlich zu kapitalisieren. Denke daran, dass du den `a:type` entweder 'char', 'line' oder 'block' haben kannst. In den meisten Fällen wirst du wahrscheinlich 'char' und 'line' erhalten. Aber gelegentlich kannst du auch einen Block erhalten. Es ist selten, aber es muss dennoch behandelt werden. Leider ist der Umgang mit einem Block nicht so einfach wie der Umgang mit Zeichen und Zeilen. Es wird ein wenig mehr Aufwand erfordern, aber es ist machbar.

Bevor du anfängst, lass uns ein Beispiel ansehen, wie du einen Block erhalten könntest. Angenommen, du hast diesen Text:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner
```

Angenommen, dein Cursor befindet sich auf dem "c" in "pancake" in der ersten Zeile. Du verwendest dann den visuellen Block (`Ctrl-V`), um nach unten und vorwärts zu wählen, um das "cake" in allen drei Zeilen auszuwählen:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner
```

Wenn du `gt` drückst, möchtest du folgendes erhalten:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

```
Hier sind deine grundlegenden Annahmen: Wenn du die drei "cakes" in "pancakes" hervorhebst, sagst du Vim, dass du drei Zeilen von Wörtern hast, die du hervorheben möchtest. Diese Wörter sind "cake", "cake" und "cake". Du erwartest "Cake", "Cake" und "Cake" zu erhalten.

Lass uns zu den Implementierungsdetails übergehen. Die nächsten paar Zeilen haben:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

Die erste Zeile:

```shell
sil! keepj norm! gv"ad
```

Denke daran, dass `sil!` still ausgeführt wird und `keepj` die Sprunghistorie beim Bewegen beibehält. Du führst dann den normalen Befehl `gv"ad` aus. `gv` wählt den zuletzt visuell hervorgehobenen Text aus (im Beispiel mit den Pfannkuchen wird es alle drei 'cakes' erneut hervorheben). `"ad` löscht die visuell hervorgehobenen Texte und speichert sie im Register a. Das Ergebnis ist:

```shell
pan for breakfast
pan for lunch
pan for dinner
```

Jetzt hast du 3 *Blöcke* (nicht Zeilen) von 'cakes', die im Register a gespeichert sind. Diese Unterscheidung ist wichtig. Das Kopieren eines Textes im zeilenweisen visuellen Modus ist anders als das Kopieren eines Textes im blockweisen visuellen Modus. Behalte dies im Hinterkopf, denn du wirst dies später wieder sehen.

Als nächstes hast du:

```shell
keepj $
keepj pu_
```

`$` bewegt dich zur letzten Zeile in deiner Datei. `pu_` fügt eine Zeile unterhalb der aktuellen Cursorposition ein. Du möchtest sie mit `keepj` ausführen, damit du die Sprunghistorie nicht veränderst.

Dann speicherst du die Zeilennummer deiner letzten Zeile (`line("$")`) in der lokalen Variablen `lastLine`.

```shell
let l:lastLine = line("$")
```

Dann fügst du den Inhalt aus dem Register mit `norm "ap` ein.

```shell
sil! keepj norm "ap
```

Denke daran, dass dies in der neuen Zeile geschieht, die du unterhalb der letzten Zeile der Datei erstellt hast - du befindest dich derzeit am Ende der Datei. Das Einfügen gibt dir diese *Block* Texte:

```shell
cake
cake
cake
```

Als nächstes speicherst du die Position der aktuellen Zeile, in der sich dein Cursor befindet.

```shell
let l:curLine = line(".")
```

Jetzt lass uns zu den nächsten paar Zeilen gehen:

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Diese Zeile:

```shell
sil! keepj norm! VGg@
```

`VG` hebt sie visuell im zeilenweisen Modus von der aktuellen Zeile bis zum Ende der Datei hervor. Hier hebst du also die drei Blöcke von 'cake' Texten mit zeilenweiser Hervorhebung hervor (denke an die Unterscheidung zwischen Block und Zeile). Beachte, dass du beim ersten Einfügen der drei "cake" Texte sie als Blöcke eingefügt hast. Jetzt hebst du sie als Zeilen hervor. Sie mögen von außen gleich aussehen, aber intern weiß Vim den Unterschied zwischen dem Einfügen von Textblöcken und dem Einfügen von Textzeilen.

```shell
cake
cake
cake
```

`g@` ist der Funktionsoperator, also machst du im Grunde einen rekursiven Aufruf an sich selbst. Aber warum? Was erreicht das?

Du machst einen rekursiven Aufruf an `g@` und übergibst ihm alle 3 Zeilen (nachdem du es mit `V` ausgeführt hast, hast du jetzt Zeilen, keine Blöcke) von 'cake' Texten, damit sie vom anderen Teil des Codes behandelt werden (darüber werden wir später sprechen). Das Ergebnis des Ausführens von `g@` sind drei Zeilen von richtig titelisierten Texten:

```shell
Cake
Cake
Cake
```

Die nächste Zeile:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Dies führt den normalen Modusbefehl aus, um zum Anfang der Zeile zu gehen (`0`), verwendet die blockweise visuelle Hervorhebung, um zur letzten Zeile und zum letzten Zeichen in dieser Zeile zu gelangen (`<c-v>G$`). Das `h` dient dazu, den Cursor anzupassen (wenn du `$` machst, bewegt sich Vim eine Zeile zu weit nach rechts). Schließlich löschst du den hervorgehobenen Text und speicherst ihn im Register a (`"ad`).

Die nächste Zeile:

```shell
exe "keepj " . l:startLine
```

Du bewegst deinen Cursor zurück zu der Stelle, wo die `startLine` war.

Als nächstes:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

An der Stelle der `startLine` springst du jetzt zur Spalte, die durch `startCol` markiert ist. `\<bar>\` ist die Bewegungsanweisung für die Bar `|`. Die Barbewegung in Vim bewegt deinen Cursor zur n-ten Spalte (nehmen wir an, `startCol` war 4. Das Ausführen von `4|` bringt deinen Cursor zur Spaltenposition 4). Denke daran, dass du `startCol` als die Position gespeichert hast, an der sich der Text befindet, den du titelisieren möchtest. Schließlich fügt `"aP` die Texte ein, die im Register a gespeichert sind. Dies bringt den Text zurück, wo er zuvor gelöscht wurde.

Schauen wir uns die nächsten 4 Zeilen an:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` bewegt deinen Cursor zurück zur `lastLine` von zuvor. `sil! keepj norm! "_dG` löscht die zusätzlichen Leerzeichen, die mit dem Blackhole-Register (`"_dG`) erstellt wurden, damit dein unbenanntes Register sauber bleibt. `exe "keepj " . l:startLine` bewegt deinen Cursor zurück zur `startLine`. Schließlich bewegt `exe "sil! keepj norm! " . l:startCol . "\<bar>"` deinen Cursor zur `startCol` Spalte.

Dies sind alle Aktionen, die du manuell in Vim hättest ausführen können. Der Vorteil, diese Aktionen in wiederverwendbare Funktionen umzuwandeln, besteht jedoch darin, dass sie dich davor bewahren, jedes Mal 30+ Zeilen Anweisungen ausführen zu müssen, wenn du etwas titelisieren möchtest. Die Quintessenz ist, alles, was du manuell in Vim tun kannst, kannst du in eine wiederverwendbare Funktion umwandeln, also ein Plugin!

So würde es aussehen.

Gegebenenfalls etwas Text:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner

... etwas Text
```

Zuerst hebst du es blockweise visuell hervor:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner

... etwas Text
```

Dann löschst du es und speicherst diesen Text im Register a:

```shell
pan for breakfast
pan for lunch
pan for dinner

... etwas Text
```

Dann fügst du es am Ende der Datei ein:

```shell
pan for breakfast
pan for lunch
pan for dinner

... etwas Text
cake
cake
cake
```

Dann kapitalisierst du es:

```shell
pan for breakfast
pan for lunch
pan for dinner

... etwas Text
Cake
Cake
Cake
```

Schließlich legst du den kapitalisierten Text zurück:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

... etwas Text
```

## Umgang mit Zeilen- und Zeichenoperationen

Du bist noch nicht fertig. Du hast nur den Sonderfall behandelt, wenn du `gt` auf Blocktexten ausführst. Du musst noch die 'Zeilen'- und 'Zeichen'-Operationen behandeln. Lass uns den `else`-Code ansehen, um zu sehen, wie das gemacht wird.

Hier sind die Codes:

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

Lass uns sie zeilenweise durchgehen. Die geheime Zutat dieses Plugins befindet sich tatsächlich in dieser Zeile:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` enthält den Text aus dem unbenannten Register, der titelisiert werden soll. `l:WORD_PATTERN` ist das individuelle Schlüsselwortmuster. `l:UPCASE_REPLACEMENT` ist der Aufruf des Befehls `capitalize()` (den du später sehen wirst). Das `'g'` ist das globale Flag, das dem Ersetzungsbefehl anweist, alle gegebenen Wörter zu ersetzen, nicht nur das erste Wort.

Die nächste Zeile:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Dies stellt sicher, dass das erste Wort immer kapitalisiert wird. Wenn du einen Satz wie "an apple a day keeps the doctor away" hast, wird das erste Wort, "an", da es ein Sonderwort ist, von deinem Ersetzungsbefehl nicht kapitalisiert. Du benötigst eine Methode, die immer das erste Zeichen unabhängig von dem, was es ist, kapitalisiert. Diese Funktion tut genau das (du wirst diese Funktionsdetails später sehen). Das Ergebnis dieser Kapitalisierungsmethoden wird in der lokalen Variablen `l:titlecased` gespeichert.

Die nächste Zeile:

```shell
call setreg('"', l:titlecased)
```

Dies legt den kapitalisierten String in das unbenannte Register (`"`).

Als nächstes die folgenden zwei Zeilen:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Hey, das sieht vertraut aus! Du hast ein ähnliches Muster zuvor mit `l:commands` gesehen. Anstelle von yank verwendest du hier paste (`p`). Schau dir den vorherigen Abschnitt an, wo ich die `l:commands` behandelt habe, um eine Auffrischung zu erhalten.

Schließlich diese beiden Zeilen:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Du bewegst deinen Cursor zurück zu der Zeile und Spalte, wo du angefangen hast. Das ist es!

Lass uns zusammenfassen. Die oben genannte Ersetzungsmethode ist clever genug, um die gegebenen Texte zu kapitalisieren und die Sonderwörter zu überspringen (darüber später mehr). Nachdem du einen titelisierten String hast, speicherst du ihn im unbenannten Register. Dann hebst du den exakt gleichen Text visuell hervor, auf den du zuvor `g@` angewendet hast, und fügst dann aus dem unbenannten Register ein (dies ersetzt effektiv die nicht titelisierten Texte durch die titelisierten Versionen). Schließlich bewegst du deinen Cursor zurück zu der Stelle, wo du angefangen hast.
## Bereinigungen

Technisch gesehen sind Sie fertig. Die Texte sind jetzt in Titel-Schreibweise. Alles, was noch zu tun bleibt, ist, die Register und Einstellungen wiederherzustellen.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Diese stellen wieder her:
- das unbenannte Register.
- die `<` und `>` Marken.
- die Optionen `'clipboard'` und `'selection'`.

Puh, Sie sind fertig. Das war eine lange Funktion. Ich hätte die Funktion kürzer machen können, indem ich sie in kleinere aufteile, aber für jetzt muss das genügen. Lassen Sie uns nun kurz die Kapitalisierungsfunktionen durchgehen.

## Die Kapitalisierungsfunktion

In diesem Abschnitt gehen wir die `s:capitalize()` Funktion durch. So sieht die Funktion aus:

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

Denken Sie daran, dass das Argument für die `capitalize()` Funktion, `a:string`, das einzelne Wort ist, das vom `g@` Operator übergeben wird. Wenn ich also `gt` auf den Text "pancake for breakfast" ausführe, wird `ToTitle` die Funktion `capitalize(string)` *drei* Mal aufrufen, einmal für "pancake", einmal für "for" und einmal für "breakfast".

Der erste Teil der Funktion ist:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

Die erste Bedingung (`toupper(a:string) ==# a:string`) überprüft, ob die großgeschriebene Version des Arguments mit dem String übereinstimmt und ob der String selbst "A" ist. Wenn dies zutrifft, wird dieser String zurückgegeben. Dies basiert auf der Annahme, dass, wenn ein gegebenes Wort bereits vollständig großgeschrieben ist, es sich um eine Abkürzung handelt. Zum Beispiel würde das Wort "CEO" andernfalls in "Ceo" umgewandelt werden. Hmm, Ihr CEO wird nicht glücklich sein. Es ist also am besten, jedes vollständig großgeschriebene Wort in Ruhe zu lassen. Die zweite Bedingung, `a:string != 'A'`, behandelt einen Sonderfall für ein kapitalisiertes "A"-Zeichen. Wenn `a:string` bereits ein kapitalisiertes "A" ist, hätte es versehentlich den Test `toupper(a:string) ==# a:string` bestanden. Da "a" ein unbestimmter Artikel im Englischen ist, muss es kleingeschrieben werden.

Der nächste Teil zwingt den String, kleingeschrieben zu werden:

```shell
let l:str = tolower(a:string)
```

Der nächste Teil ist ein Regex einer Liste aller Wortausnahmen. Ich habe sie von https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

Der nächste Teil:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Zuerst wird überprüft, ob Ihr String Teil der ausgeschlossenen Wortliste (`l:exclusions`) ist. Wenn ja, kapitalisieren Sie ihn nicht. Dann wird überprüft, ob Ihr String Teil der lokalen Ausschlussliste (`s:local_exclusion_list`) ist. Diese Ausschlussliste ist eine benutzerdefinierte Liste, die der Benutzer in vimrc hinzufügen kann (falls der Benutzer zusätzliche Anforderungen für spezielle Wörter hat).

Der letzte Teil gibt die kapitalisierte Version des Wortes zurück. Das erste Zeichen wird großgeschrieben, während der Rest unverändert bleibt.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Lassen Sie uns die zweite Kapitalisierungsfunktion durchgehen. Die Funktion sieht so aus:

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

Diese Funktion wurde erstellt, um einen Sonderfall zu behandeln, wenn Sie einen Satz haben, der mit einem ausgeschlossenen Wort beginnt, wie "an apple a day keeps the doctor away". Basierend auf den Regeln der Großschreibung der englischen Sprache müssen alle ersten Wörter in einem Satz, unabhängig davon, ob es sich um ein spezielles Wort handelt oder nicht, großgeschrieben werden. Mit Ihrem `substitute()` Befehl allein würde das "an" in Ihrem Satz kleingeschrieben werden. Sie müssen das erste Zeichen zwingend großschreiben.

In dieser `capitalizeFirstWord` Funktion ist das Argument `a:string` kein einzelnes Wort wie `a:string` innerhalb der `capitalize` Funktion, sondern der gesamte Text. Wenn Sie also "pancake for breakfast" haben, ist der Wert von `a:string` "pancake for breakfast". Es wird nur einmal für den gesamten Text `capitalizeFirstWord` ausgeführt.

Ein Szenario, auf das Sie achten müssen, ist, wenn Sie einen mehrzeiligen String wie `"an apple a day\nkeeps the doctor away"` haben. Sie möchten das erste Zeichen aller Zeilen großschreiben. Wenn Sie keine Zeilenumbrüche haben, dann einfach das erste Zeichen großschreiben.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Wenn Sie Zeilenumbrüche haben, müssen Sie alle ersten Zeichen in jeder Zeile großschreiben, also teilen Sie sie in ein Array auf, das durch Zeilenumbrüche getrennt ist:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Dann mappen Sie jedes Element im Array und kapitalisieren das erste Wort jedes Elements:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Schließlich fügen Sie die Array-Elemente zusammen:

```shell
return l:lineArr->join("\n")
```

Und Sie sind fertig!

## Dokumente

Das zweite Verzeichnis im Repository ist das `docs/` Verzeichnis. Es ist gut, dem Plugin eine umfassende Dokumentation bereitzustellen. In diesem Abschnitt werde ich kurz erläutern, wie Sie Ihre eigenen Plugin-Dokumente erstellen.

Das `docs/` Verzeichnis ist einer von Vims speziellen Laufzeitpfaden. Vim liest alle Dateien im `docs/` Verzeichnis, sodass, wenn Sie nach einem speziellen Schlüsselwort suchen und dieses Schlüsselwort in einer der Dateien im `docs/` Verzeichnis gefunden wird, es auf der Hilfeseite angezeigt wird. Hier haben Sie eine `totitle.txt`. Ich habe es so genannt, weil das der Name des Plugins ist, aber Sie können es nennen, wie Sie möchten.

Eine Vim-Dokumentdatei ist im Grunde eine txt-Datei. Der Unterschied zwischen einer regulären txt-Datei und einer Vim-Hilfedatei besteht darin, dass letztere spezielle "Hilfe"-Syntaxen verwendet. Aber zuerst müssen Sie Vim sagen, dass es die Datei nicht als Textdateityp, sondern als `help`-Dateityp behandeln soll. Um Vim zu sagen, dass es diese `totitle.txt` als *Hilfe*-Datei interpretieren soll, führen Sie `:set ft=help` aus (`:h 'filetype'` für mehr). Übrigens, wenn Sie Vim sagen möchten, dass es diese `totitle.txt` als *reguläre* txt-Datei interpretieren soll, führen Sie `:set ft=txt` aus.

### Die spezielle Syntax der Hilfedatei

Um ein Schlüsselwort auffindbar zu machen, umgeben Sie dieses Schlüsselwort mit Sternchen. Um das Schlüsselwort `totitle` auffindbar zu machen, wenn der Benutzer nach `:h totitle` sucht, schreiben Sie es als `*totitle*` in die Hilfedatei.

Zum Beispiel habe ich diese Zeilen oben in meinem Inhaltsverzeichnis:

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

// mehr TOC Zeug
```

Beachten Sie, dass ich zwei Schlüsselwörter verwendet habe: `*totitle*` und `*totitle-toc*`, um den Abschnitt des Inhaltsverzeichnisses zu kennzeichnen. Sie können so viele Schlüsselwörter verwenden, wie Sie möchten. Das bedeutet, dass, wann immer Sie nach `:h totitle` oder `:h totitle-toc` suchen, Vim Sie an diesen Ort bringt.

Hier ist ein weiteres Beispiel, irgendwo im Dokument:

```shell
2. Verwendung                                                       *totitle-usage*

// Verwendung
```

Wenn Sie nach `:h totitle-usage` suchen, bringt Sie Vim zu diesem Abschnitt.

Sie können auch interne Links verwenden, um auf einen anderen Abschnitt in der Hilfedatei zu verweisen, indem Sie ein Schlüsselwort mit der Strich-Syntax `|` umgeben. Im TOC-Bereich sehen Sie Schlüsselwörter, die von den Strichen umgeben sind, wie `|totitle-intro|`, `|totitle-usage|` usw.

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

    1. Einführung ........................... |totitle-intro|
    2. Verwendung ........................... |totitle-usage|
    3. Wörter zu kapitalisieren ............. |totitle-words|
    4. Operator ........................ |totitle-operator|
    5. Tastenkombination ..................... |totitle-keybinding|
    6. Fehler ............................ |totitle-bug-report|
    7. Mitwirken .................... |totitle-contributing|
    8. Danksagungen ......................... |totitle-credits|

```
Dies ermöglicht es Ihnen, zur Definition zu springen. Wenn Sie den Cursor irgendwo auf `|totitle-intro|` setzen und `Ctrl-]` drücken, springt Vim zur Definition dieses Wortes. In diesem Fall springt es zur `*totitle-intro*` Stelle. So können Sie auf verschiedene Schlüsselwörter in einem Hilfedokument verlinken.

Es gibt keinen richtigen oder falschen Weg, eine Dokumentdatei in Vim zu schreiben. Wenn Sie sich verschiedene Plugins von verschiedenen Autoren ansehen, verwenden viele von ihnen unterschiedliche Formate. Der Punkt ist, eine leicht verständliche Hilfedokumentation für Ihre Benutzer zu erstellen.

Schließlich, wenn Sie Ihr eigenes Plugin zunächst lokal schreiben und die Dokumentationsseite testen möchten, reicht es nicht aus, einfach eine txt-Datei im `~/.vim/docs/` hinzuzufügen, um Ihre Schlüsselwörter durchsuchbar zu machen. Sie müssen Vim anweisen, Ihre Dokumentseite hinzuzufügen. Führen Sie den `helptags` Befehl aus: `:helptags ~/.vim/doc`, um neue Tag-Dateien zu erstellen. Jetzt können Sie mit der Suche nach Ihren Schlüsselwörtern beginnen.

## Fazit

Sie haben es bis zum Ende geschafft! Dieses Kapitel ist die Zusammenfassung aller Vimscript-Kapitel. Hier setzen Sie endlich das um, was Sie bisher gelernt haben. Hoffentlich haben Sie durch das Lesen dieses Kapitels nicht nur verstanden, wie man Vim-Plugins erstellt, sondern wurden auch ermutigt, Ihr eigenes Plugin zu schreiben.

Wann immer Sie feststellen, dass Sie dieselbe Abfolge von Aktionen mehrfach wiederholen, sollten Sie versuchen, Ihr eigenes zu erstellen! Es wurde gesagt, dass man das Rad nicht neu erfinden sollte. Ich denke jedoch, dass es vorteilhaft sein kann, das Rad zum Lernen neu zu erfinden. Lesen Sie die Plugins anderer Leute. Stellen Sie sie nach. Lernen Sie von ihnen. Schreiben Sie Ihr eigenes! Wer weiß, vielleicht schreiben Sie das nächste großartige, super-populäre Plugin, nachdem Sie dies gelesen haben. Vielleicht werden Sie der nächste legendäre Tim Pope. Wenn das passiert, lassen Sie es mich wissen!