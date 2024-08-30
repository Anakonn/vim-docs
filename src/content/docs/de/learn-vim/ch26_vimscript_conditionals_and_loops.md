---
description: In diesem Dokument lernen Sie, wie Sie Vimscript-Datentypen kombinieren,
  um grundlegende Programme mit Bedingungen und Schleifen zu schreiben.
title: Ch26. Vimscript Conditionals and Loops
---

Nachdem Sie gelernt haben, was die grundlegenden Datentypen sind, besteht der nächste Schritt darin, zu lernen, wie man sie kombiniert, um ein einfaches Programm zu schreiben. Ein einfaches Programm besteht aus Bedingungen und Schleifen.

In diesem Kapitel lernen Sie, wie Sie Vimscript-Datentypen verwenden, um Bedingungen und Schleifen zu schreiben.

## Relationale Operatoren

Die relationalen Operatoren von Vimscript sind ähnlich wie in vielen Programmiersprachen:

```shell
a == b		gleich
a != b		nicht gleich
a >  b		größer als
a >= b		größer oder gleich
a <  b		kleiner als
a <= b		kleiner oder gleich
```

Zum Beispiel:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Denken Sie daran, dass Strings in einem arithmetischen Ausdruck in Zahlen umgewandelt werden. Hier wandelt Vim auch Strings in Zahlen in einem Gleichheitsausdruck um. "5foo" wird in 5 (wahr) umgewandelt:

```shell
:echo 5 == "5foo"
" gibt true zurück
```

Denken Sie auch daran, dass, wenn Sie einen String mit einem nicht-numerischen Zeichen wie "foo5" beginnen, der String in die Zahl 0 (falsch) umgewandelt wird.

```shell
echo 5 == "foo5"
" gibt false zurück
```

### String-Logikoperatoren

Vim hat weitere relationale Operatoren zum Vergleichen von Strings:

```shell
a =~ b
a !~ b
```

Zum Beispiel:

```shell
let str = "herzhhaftes Frühstück"

echo str =~ "herzhhaft"
" gibt true zurück

echo str =~ "Abendessen"
" gibt false zurück

echo str !~ "Abendessen"
" gibt true zurück
```

Der `=~` Operator führt einen Regex-Vergleich mit dem gegebenen String durch. Im obigen Beispiel gibt `str =~ "herzhhaft"` true zurück, weil `str` das Muster "herzhhaft" *enthält*. Sie können immer `==` und `!=` verwenden, aber damit vergleichen Sie den Ausdruck mit dem gesamten String. `=~` und `!~` sind flexiblere Optionen.

```shell
echo str == "herzhhaft"
" gibt false zurück

echo str == "herzhhaftes Frühstück"
" gibt true zurück
```

Lassen Sie uns dies ausprobieren. Beachten Sie das große "H":

```shell
echo str =~ "Herzhhaft"
" true
```

Es gibt true zurück, obwohl "Herzhhaft" großgeschrieben ist. Interessant... Es stellt sich heraus, dass meine Vim-Einstellung so konfiguriert ist, dass sie die Groß- und Kleinschreibung ignoriert (`set ignorecase`), sodass Vim bei der Überprüfung auf Gleichheit meine Vim-Einstellung verwendet und die Groß- und Kleinschreibung ignoriert. Wenn ich die Groß- und Kleinschreibung ausschalte (`set noignorecase`), gibt der Vergleich jetzt false zurück.

```shell
set noignorecase
echo str =~ "Herzhhaft"
" gibt false zurück, weil die Groß- und Kleinschreibung zählt

set ignorecase
echo str =~ "Herzhhaft"
" gibt true zurück, weil die Groß- und Kleinschreibung keine Rolle spielt
```

Wenn Sie ein Plugin für andere schreiben, ist dies eine knifflige Situation. Verwendet der Benutzer `ignorecase` oder `noignorecase`? Sie möchten auf keinen Fall Ihre Benutzer zwingen, ihre Option zur Ignorierung der Groß- und Kleinschreibung zu ändern. Was tun Sie also?

Glücklicherweise hat Vim einen Operator, der *immer* die Groß- und Kleinschreibung ignorieren oder berücksichtigen kann. Um immer die Groß- und Kleinschreibung zu berücksichtigen, fügen Sie ein `#` am Ende hinzu.

```shell
set ignorecase
echo str =~# "herzhhaft"
" gibt true zurück

echo str =~# "HerzhhAFt"
" gibt false zurück

set noignorecase
echo str =~# "herzhhaft"
" true

echo str =~# "HerzhhAFt"
" false

echo str !~# "HerzhhAFt"
" true
```

Um die Groß- und Kleinschreibung beim Vergleichen immer zu ignorieren, fügen Sie ein `?` hinzu:

```shell
set ignorecase
echo str =~? "herzhhaft"
" true

echo str =~? "HerzhhAFt"
" true

set noignorecase
echo str =~? "herzhhaft"
" true

echo str =~? "HerzhhAFt"
" true

echo str !~? "HerzhhAFt"
" false
```

Ich bevorzuge es, `#` zu verwenden, um immer die Groß- und Kleinschreibung zu berücksichtigen und auf der sicheren Seite zu sein.

## If

Jetzt, da Sie die Gleichheitsausdrücke von Vim gesehen haben, lassen Sie uns einen grundlegenden bedingten Operator, die `if`-Anweisung, ansprechen.

Mindestens ist die Syntax:

```shell
if {Klausel}
  {ein Ausdruck}
endif
```

Sie können die Fallanalyse mit `elseif` und `else` erweitern.

```shell
if {Prädikat1}
  {Ausdruck1}
elseif {Prädikat2}
  {Ausdruck2}
elseif {Prädikat3}
  {Ausdruck3}
else
  {Ausdruck4}
endif
```

Zum Beispiel verwendet das Plugin [vim-signify](https://github.com/mhinz/vim-signify) eine andere Installationsmethode, abhängig von Ihren Vim-Einstellungen. Unten finden Sie die Installationsanweisung aus ihrem `readme`, die die `if`-Anweisung verwendet:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Ternärer Ausdruck

Vim hat einen ternären Ausdruck für eine Einzeiler-Fallanalyse:

```shell
{Prädikat} ? AusdruckWahr : AusdruckFalsch
```

Zum Beispiel:

```shell
echo 1 ? "Ich bin wahr" : "Ich bin falsch"
```

Da 1 wahr ist, gibt Vim "Ich bin wahr" aus. Angenommen, Sie möchten den `background` bedingt auf dunkel setzen, wenn Sie Vim nach einer bestimmten Uhrzeit verwenden. Fügen Sie dies zu vimrc hinzu:

```shell
let &background = strftime("%H") < 18 ? "hell" : "dunkel"
```

`&background` ist die `'background'`-Option in Vim. `strftime("%H")` gibt die aktuelle Uhrzeit in Stunden zurück. Wenn es noch nicht 18 Uhr ist, verwenden Sie einen hellen Hintergrund. Andernfalls verwenden Sie einen dunklen Hintergrund.

## oder

Das logische "oder" (`||`) funktioniert wie in vielen Programmiersprachen.

```shell
{Falscher Ausdruck}  || {Falscher Ausdruck}   falsch
{Falscher Ausdruck}  || {Wahrer Ausdruck}    wahr
{Wahrer Ausdruck} || {Falscher Ausdruck}   wahr
{Wahrer Ausdruck} || {Wahrer Ausdruck}    wahr
```

Vim bewertet den Ausdruck und gibt entweder 1 (wahr) oder 0 (falsch) zurück.

```shell
echo 5 || 0
" gibt 1 zurück

echo 5 || 5
" gibt 1 zurück

echo 0 || 0
" gibt 0 zurück

echo "foo5" || "foo5"
" gibt 0 zurück

echo "5foo" || "foo5"
" gibt 1 zurück
```

Wenn der aktuelle Ausdruck als wahr bewertet wird, wird der nachfolgende Ausdruck nicht ausgewertet.

```shell
let ein Dutzend = 12

echo ein Dutzend || zwei Dutzend
" gibt 1 zurück

echo zwei Dutzend || ein Dutzend
" gibt Fehler zurück
```

Beachten Sie, dass `zwei Dutzend` nie definiert ist. Der Ausdruck `ein Dutzend || zwei Dutzend` wirft keinen Fehler, da `ein Dutzend` zuerst ausgewertet wird und als wahr befunden wird, sodass Vim `zwei Dutzend` nicht auswertet.

## und

Das logische "und" (`&&`) ist das Gegenteil des logischen oder.

```shell
{Falscher Ausdruck}  && {Falscher Ausdruck}   falsch
{Falscher Ausdruck}  && {Wahrer Ausdruck}    falsch
{Wahrer Ausdruck} && {Falscher Ausdruck}   falsch
{Wahrer Ausdruck} && {Wahrer Ausdruck}    wahr
```

Zum Beispiel:

```shell
echo 0 && 0
" gibt 0 zurück

echo 0 && 10
" gibt 0 zurück
```

`&&` wertet einen Ausdruck aus, bis es den ersten falschen Ausdruck sieht. Wenn Sie zum Beispiel `wahr && wahr` haben, wird beides ausgewertet und gibt `wahr` zurück. Wenn Sie `wahr && falsch && wahr` haben, wird das erste `wahr` ausgewertet und beim ersten `falsch` gestoppt. Es wird das dritte `wahr` nicht ausgewertet.

```shell
let ein Dutzend = 12
echo ein Dutzend && 10
" gibt 1 zurück

echo ein Dutzend && v:false
" gibt 0 zurück

echo ein Dutzend && zwei Dutzend
" gibt Fehler zurück

echo exists("ein Dutzend") && ein Dutzend == 12
" gibt 1 zurück
```

## für

Die `for`-Schleife wird häufig mit dem Listendatentyp verwendet.

```shell
let frühstücke = ["Pfannkuchen", "Waffeln", "Eier"]

for frühstück in frühstücke
  echo frühstück
endfor
```

Es funktioniert mit geschachtelten Listen:

```shell
let mahlzeiten = [["Frühstück", "Pfannkuchen"], ["Mittagessen", "Fisch"], ["Abendessen", "Pasta"]]

for [mahlzeit_typ, essen] in mahlzeiten
  echo "Ich habe " . essen . " zum " . mahlzeit_typ
endfor
```

Technisch können Sie die `for`-Schleife auch mit einem Dictionary unter Verwendung der `keys()`-Methode verwenden.

```shell
let getränke = #{frühstück: "Milch", mittagessen: "Orangensaft", abendessen: "Wasser"}
for getränk_typ in keys(getränke)
  echo "Ich trinke " . getränke[getränk_typ] . " zum " . getränk_typ
endfor
```

## Während

Eine weitere gängige Schleife ist die `while`-Schleife.

```shell
let zähler = 1
while zähler < 5
  echo "Zähler ist: " . zähler
  let zähler += 1
endwhile
```

Um den Inhalt der aktuellen Zeile bis zur letzten Zeile zu erhalten:

```shell
let aktuelle_zeile = line(".")
let letzte_zeile = line("$")

while aktuelle_zeile <= letzte_zeile
  echo getline(aktuelle_zeile)
  let aktuelle_zeile += 1
endwhile
```

## Fehlerbehandlung

Oft läuft Ihr Programm nicht so, wie Sie es erwarten. Infolgedessen bringt es Sie durcheinander (Wortspiel beabsichtigt). Was Sie brauchen, ist eine ordnungsgemäße Fehlerbehandlung.

### Break

Wenn Sie `break` innerhalb einer `while`- oder `for`-Schleife verwenden, stoppt es die Schleife.

Um die Texte vom Anfang der Datei bis zur aktuellen Zeile zu erhalten, aber zu stoppen, wenn Sie das Wort "Donut" sehen:

```shell
let zeile = 0
let letzte_zeile = line("$")
let gesamt_wort = ""

while zeile <= letzte_zeile
  let zeile += 1
  let zeilen_text = getline(zeile)
  if zeilen_text =~# "donut"
    break
  endif
  echo zeilen_text
  let gesamt_wort .= zeilen_text . " "
endwhile

echo gesamt_wort
```

Wenn Sie den Text haben:

```shell
eins
zwei
drei
donut
vier
fünf
```

Wenn Sie die obige `while`-Schleife ausführen, gibt sie "eins zwei drei" zurück und nicht den Rest des Textes, weil die Schleife bricht, sobald sie "donut" findet.

### Continue

Die `continue`-Methode ist ähnlich wie `break`, da sie während einer Schleife aufgerufen wird. Der Unterschied besteht darin, dass sie anstelle des Abbrechens der Schleife einfach die aktuelle Iteration überspringt.

Angenommen, Sie haben denselben Text, aber anstelle von `break` verwenden Sie `continue`:

```shell
let zeile = 0
let letzte_zeile = line("$")
let gesamt_wort = ""

while zeile <= letzte_zeile
  let zeile += 1
  let zeilen_text = getline(zeile)
  if zeilen_text =~# "donut"
    continue
  endif
  echo zeilen_text
  let gesamt_wort .= zeilen_text . " "
endwhile

echo gesamt_wort
```

Diesmal gibt es `eins zwei drei vier fünf` zurück. Es überspringt die Zeile mit dem Wort "donut", aber die Schleife läuft weiter.
### try, finally und catch

Vim hat ein `try`, `finally` und `catch`, um Fehler zu behandeln. Um einen Fehler zu simulieren, kannst du den Befehl `throw` verwenden.

```shell
try
  echo "Versuch"
  throw "Nein"
endtry
```

Führe dies aus. Vim wird mit dem Fehler `"Exception not caught: Nein` meckern.

Jetzt füge einen catch-Block hinzu:

```shell
try
  echo "Versuch"
  throw "Nein"
catch
  echo "Gefangen"
endtry
```

Jetzt gibt es keinen Fehler mehr. Du solltest "Versuch" und "Gefangen" angezeigt bekommen.

Lass uns den `catch` entfernen und ein `finally` hinzufügen:

```shell
try
  echo "Versuch"
  throw "Nein"
  echo "Du wirst mich nicht sehen"
finally
  echo "Schließlich"
endtry
```

Führe dies aus. Jetzt zeigt Vim den Fehler und "Schließlich" an.

Lass uns alle zusammenfügen:

```shell
try
  echo "Versuch"
  throw "Nein"
catch
  echo "Gefangen"
finally
  echo "Schließlich"
endtry
```

Diesmal zeigt Vim sowohl "Gefangen" als auch "Schließlich" an. Es wird kein Fehler angezeigt, weil Vim ihn gefangen hat.

Fehler kommen aus verschiedenen Quellen. Eine andere Fehlerquelle ist das Aufrufen einer nicht existierenden Funktion, wie `Nein()` unten:

```shell
try
  echo "Versuch"
  call Nein()
catch
  echo "Gefangen"
finally
  echo "Schließlich"
endtry
```

Der Unterschied zwischen `catch` und `finally` ist, dass `finally` immer ausgeführt wird, ob ein Fehler auftritt oder nicht, während ein catch nur ausgeführt wird, wenn dein Code einen Fehler erhält.

Du kannst spezifische Fehler mit `:catch` abfangen. Laut `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " fange Unterbrechungen (CTRL-C) ab
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " fange alle Vim-Fehler ab
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " fange Fehler und Unterbrechungen ab
catch /^Vim(write):/.                " fange alle Fehler in :write ab
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " fange Fehler E123 ab
catch /meine-ausnahme/.               " fange Benutzer-Ausnahme ab
catch /.*/                           " fange alles ab
catch.                               " dasselbe wie /.*/
```

Innerhalb eines `try`-Blocks wird eine Unterbrechung als abfangbarer Fehler betrachtet.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

In deiner vimrc, wenn du ein benutzerdefiniertes Farbschema verwendest, wie [gruvbox](https://github.com/morhetz/gruvbox), und du versehentlich das Verzeichnis des Farbschemas löschst, aber immer noch die Zeile `colorscheme gruvbox` in deiner vimrc hast, wird Vim einen Fehler werfen, wenn du es `source`. Um dies zu beheben, habe ich dies in meine vimrc hinzugefügt:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Jetzt, wenn du die vimrc ohne das `gruvbox`-Verzeichnis `source`, wird Vim das `colorscheme default` verwenden.

## Lerne Bedingungen auf die smarte Weise

Im vorherigen Kapitel hast du die grundlegenden Datentypen von Vim kennengelernt. In diesem Kapitel hast du gelernt, wie man sie kombiniert, um grundlegende Programme mit Bedingungen und Schleifen zu schreiben. Dies sind die Bausteine der Programmierung.

Als Nächstes lernen wir über Variablenbereiche.