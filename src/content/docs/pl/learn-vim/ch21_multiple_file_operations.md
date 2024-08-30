---
description: Niniejszy dokument przedstawia różne sposoby edytowania wielu plików
  w Vim, w tym komendy takie jak `argdo`, `bufdo` i `cdo`, ułatwiające pracę.
title: Ch21. Multiple File Operations
---

Możliwość aktualizacji w wielu plikach to kolejne przydatne narzędzie edycyjne. Wcześniej nauczyłeś się, jak aktualizować wiele tekstów za pomocą `cfdo`. W tym rozdziale dowiesz się o różnych sposobach edytowania wielu plików w Vimie.

## Różne sposoby wykonywania polecenia w wielu plikach

Vim ma osiem sposobów na wykonywanie poleceń w wielu plikach:
- lista argumentów (`argdo`)
- lista buforów (`bufdo`)
- lista okien (`windo`)
- lista zakładek (`tabdo`)
- lista szybkich poprawek (`cdo`)
- lista szybkich poprawek według plików (`cfdo`)
- lista lokalizacji (`ldo`)
- lista lokalizacji według plików (`lfdo`)

Praktycznie rzecz biorąc, prawdopodobnie będziesz używać tylko jednego lub dwóch z nich przez większość czasu (osobiście używam `cdo` i `argdo` częściej niż innych), ale dobrze jest poznać wszystkie dostępne opcje i używać tych, które pasują do twojego stylu edycji.

Nauka ośmiu poleceń może brzmieć przytłaczająco. Ale w rzeczywistości te polecenia działają podobnie. Po nauczeniu się jednego, nauka pozostałych stanie się łatwiejsza. Wszystkie dzielą ten sam główny pomysł: stwórz listę ich odpowiednich kategorii, a następnie przekaż im polecenie, które chcesz wykonać.

## Lista argumentów

Lista argumentów to najprostsza lista. Tworzy listę plików. Aby stworzyć listę `file1`, `file2` i `file3`, możesz wykonać:

```shell
:args file1 file2 file3
```

Możesz również przekazać jej znak wieloznaczny (`*`), więc jeśli chcesz stworzyć listę wszystkich plików `.js` w bieżącym katalogu, uruchom:

```shell
:args *.js
```

Jeśli chcesz stworzyć listę wszystkich plików Javascript, które zaczynają się na "a" w bieżącym katalogu, uruchom:

```shell
:args a*.js
```

Znak wieloznaczny pasuje do jednego lub więcej dowolnych znaków nazwy pliku w bieżącym katalogu, ale co jeśli musisz przeszukać rekurencyjnie w dowolnym katalogu? Możesz użyć podwójnego znaku wieloznacznego (`**`). Aby uzyskać wszystkie pliki Javascript w katalogach w twojej bieżącej lokalizacji, uruchom:

```shell
:args **/*.js
```

Gdy uruchomisz polecenie `args`, twój bieżący bufor zostanie przełączony na pierwszy element na liście. Aby zobaczyć listę plików, które właśnie stworzyłeś, uruchom `:args`. Gdy już stworzysz swoją listę, możesz po niej przechodzić. `:first` przeniesie cię na pierwszy element listy. `:last` przeniesie cię na ostatni element listy. Aby przejść do następnego pliku, uruchom `:next`. Aby przejść do poprzedniego pliku, uruchom `:prev`. Aby przejść do przodu / do tyłu jeden plik na raz i zapisać zmiany, uruchom `:wnext` i `:wprev`. Jest wiele innych poleceń nawigacyjnych. Sprawdź `:h arglist` po więcej.

Lista argumentów jest przydatna, jeśli musisz celować w konkretny typ pliku lub kilka plików. Może potrzebujesz zaktualizować wszystkie "donuty" na "naleśniki" w wszystkich plikach `yml`, możesz to zrobić:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Jeśli ponownie uruchomisz polecenie `args`, zastąpi ono poprzednią listę. Na przykład, jeśli wcześniej uruchomiłeś:

```shell
:args file1 file2 file3
```

Zakładając, że te pliki istnieją, teraz masz listę `file1`, `file2` i `file3`. Następnie uruchamiasz to:

```shell
:args file4 file5
```

Twoja początkowa lista `file1`, `file2` i `file3` zostaje zastąpiona przez `file4` i `file5`. Jeśli masz `file1`, `file2` i `file3` w swojej liście argumentów i chcesz *dodać* `file4` i `file5` do swojej początkowej listy plików, użyj polecenia `:arga`. Uruchom:

```shell
:arga file4 file5
```

Teraz masz `file1`, `file2`, `file3`, `file4` i `file5` w swojej liście argumentów.

Jeśli uruchomisz `:arga` bez żadnego argumentu, Vim doda twój bieżący bufor do bieżącej listy argumentów. Jeśli już masz `file1`, `file2` i `file3` w swojej liście argumentów, a twój bieżący bufor jest na `file5`, uruchomienie `:arga` doda `file5` do listy.

Gdy masz listę, możesz przekazać ją z dowolnymi poleceniami wiersza poleceń, które wybierzesz. Widziałeś to w przypadku substytucji (`:argdo %s/donut/pancake/g`). Oto kilka innych przykładów:
- Aby usunąć wszystkie linie, które zawierają "deser" w liście argumentów, uruchom `:argdo g/dessert/d`.
- Aby wykonać makro a (zakładając, że nagrałeś coś w makrze a) w liście argumentów, uruchom `:argdo norm @a`.
- Aby napisać "hello " po którym następuje nazwa pliku w pierwszej linii, uruchom `:argdo 0put='hello ' .. @:`.

Gdy skończysz, nie zapomnij ich zapisać za pomocą `:update`.

Czasami musisz uruchomić polecenia tylko na pierwszych n elementach listy argumentów. Jeśli tak jest, po prostu przekaż poleceniu `argdo` adres. Na przykład, aby uruchomić polecenie substytucji tylko na pierwszych 3 elementach z listy, uruchom `:1,3argdo %s/donut/pancake/g`.

## Lista buforów

Lista buforów zostanie organicznie stworzona, gdy edytujesz nowe pliki, ponieważ za każdym razem, gdy tworzysz nowy plik / otwierasz plik, Vim zapisuje go w buforze (chyba że go jawnie usuniesz). Więc jeśli już otworzyłeś 3 pliki: `file1.rb file2.rb file3.rb`, już masz 3 elementy w swojej liście buforów. Aby wyświetlić listę buforów, uruchom `:buffers` (alternatywnie: `:ls` lub `:files`). Aby przechodzić do przodu i do tyłu, użyj `:bnext` i `:bprev`. Aby przejść do pierwszego i ostatniego bufora z listy, użyj `:bfirst` i `:blast` (czy już się bawisz? :D).

Przy okazji, oto fajny trik z buforami niezwiązany z tym rozdziałem: jeśli masz wiele elementów w swojej liście buforów, możesz pokazać je wszystkie za pomocą `:ball` (bufor wszystkich). Polecenie `ball` wyświetla wszystkie bufory poziomo. Aby wyświetlić je pionowo, uruchom `:vertical ball`.

Wracając do tematu, mechanika wykonywania operacji w wszystkich buforach jest podobna do listy argumentów. Gdy już stworzysz swoją listę buforów, wystarczy, że poprzedzisz polecenie, które chcesz wykonać, poleceniem `:bufdo` zamiast `:argdo`. Więc jeśli chcesz zastąpić wszystkie "donuty" na "naleśniki" w wszystkich buforach, a następnie zapisać zmiany, uruchom `:bufdo %s/donut/pancake/g | update`.

## Lista okien i zakładek

Listy okien i zakładek są również podobne do listy argumentów i buforów. Jedynymi różnicami są ich kontekst i składnia.

Operacje na oknach są wykonywane w każdym otwartym oknie i realizowane za pomocą `:windo`. Operacje na zakładkach są wykonywane w każdej otwartej zakładce i realizowane za pomocą `:tabdo`. Po więcej informacji sprawdź `:h list-repeat`, `:h :windo` i `:h :tabdo`.

Na przykład, jeśli masz otwarte trzy okna (możesz otworzyć nowe okna za pomocą `Ctrl-W v` dla okna pionowego i `Ctrl-W s` dla okna poziomego) i uruchomisz `:windo 0put ='hello' . @%`, Vim wyświetli "hello" + nazwa pliku we wszystkich otwartych oknach.

## Lista szybkich poprawek

W poprzednich rozdziałach (Rozdz. 3 i 19) mówiłem o szybkich poprawkach. Szybkie poprawki mają wiele zastosowań. Wiele popularnych wtyczek korzysta z szybkich poprawek, więc warto poświęcić więcej czasu na ich zrozumienie.

Jeśli jesteś nowy w Vimie, szybkie poprawki mogą być nowym pojęciem. W dawnych czasach, gdy rzeczywiście musiałeś jawnie kompilować swój kod, podczas fazy kompilacji napotykałeś błędy. Aby wyświetlić te błędy, potrzebujesz specjalnego okna. I tu pojawiają się szybkie poprawki. Gdy kompilujesz swój kod, Vim wyświetla komunikaty o błędach w oknie szybkich poprawek, abyś mógł je później naprawić. Wiele nowoczesnych języków nie wymaga już jawnej kompilacji, ale to nie czyni szybkich poprawek przestarzałymi. Obecnie ludzie używają szybkich poprawek do różnych rzeczy, takich jak wyświetlanie wyjścia z wirtualnego terminala i przechowywanie wyników wyszukiwania. Skupmy się na tym ostatnim, przechowywaniu wyników wyszukiwania.

Oprócz poleceń kompilacji, niektóre polecenia Vim opierają się na interfejsach szybkich poprawek. Jednym z typów poleceń, które intensywnie korzystają z szybkich poprawek, są polecenia wyszukiwania. Zarówno `:vimgrep`, jak i `:grep` domyślnie używają szybkich poprawek.

Na przykład, jeśli musisz wyszukać "donut" we wszystkich plikach Javascript rekurencyjnie, możesz uruchomić:

```shell
:vimgrep /donut/ **/*.js
```

Wynik wyszukiwania "donut" jest przechowywany w oknie szybkich poprawek. Aby zobaczyć wyniki wyszukiwania w oknie szybkich poprawek, uruchom:

```shell
:copen
```

Aby je zamknąć, uruchom:

```shell
:cclose
```

Aby przechodzić w liście szybkich poprawek do przodu i do tyłu, uruchom:

```shell
:cnext
:cprev
```

Aby przejść do pierwszego i ostatniego elementu w dopasowaniu, uruchom:

```shell
:cfirst
:clast
```

Wcześniej wspomniałem, że są dwa polecenia szybkich poprawek: `cdo` i `cfdo`. Jak się różnią? `cdo` wykonuje polecenie dla każdego elementu w liście szybkich poprawek, podczas gdy `cfdo` wykonuje polecenie dla każdego *pliku* w liście szybkich poprawek.

Pozwól, że to wyjaśnię. Załóżmy, że po uruchomieniu powyższego polecenia `vimgrep` znalazłeś:
- 1 wynik w `file1.js`
- 10 wyników w `file2.js`

Jeśli uruchomisz `:cfdo %s/donut/pancake/g`, to efektywnie wykona `%s/donut/pancake/g` raz w `file1.js` i raz w `file2.js`. Wykonuje to *tyle razy, ile jest plików w dopasowaniu.* Ponieważ są dwa pliki w wynikach, Vim wykonuje polecenie substytucji raz na `file1.js` i jeszcze raz na `file2.js`, mimo że w drugim pliku jest 10 dopasowań. `cfdo` interesuje się tylko tym, ile plików jest w liście szybkich poprawek.

Jeśli uruchomisz `:cdo %s/donut/pancake/g`, to efektywnie wykona `%s/donut/pancake/g` raz w `file1.js` i *dziesięć razy* w `file2.js`. Wykonuje to tyle razy, ile jest rzeczywistych elementów w liście szybkich poprawek. Ponieważ w `file1.js` znaleziono tylko jedno dopasowanie, a w `file2.js znaleziono 10 dopasowań, wykona to łącznie 11 razy.

Ponieważ uruchomiłeś `%s/donut/pancake/g`, sensowne byłoby użycie `cfdo`. Nie miało sensu używać `cdo`, ponieważ wykonałoby to `%s/donut/pancake/g` dziesięć razy w `file2.js` ( `%s` to substytucja na poziomie pliku). Wykonanie `%s` raz na plik wystarczy. Jeśli użyłbyś `cdo`, bardziej sensowne byłoby przekazać to z `s/donut/pancake/g`.

Decydując, czy użyć `cfdo`, czy `cdo`, pomyśl o zakresie polecenia, które przekazujesz. Czy jest to polecenie na poziomie pliku (jak `:%s` lub `:g`), czy polecenie na poziomie linii (jak `:s` lub `:!`)?

## Lista lokalizacji

Lista lokalizacji jest podobna do listy szybkich poprawek w tym sensie, że Vim również używa specjalnego okna do wyświetlania komunikatów. Różnica między listą szybkich poprawek a listą lokalizacji polega na tym, że w dowolnym momencie możesz mieć tylko jedną listę szybkich poprawek, podczas gdy możesz mieć tyle list lokalizacji, ile okien.

Załóżmy, że masz otwarte dwa okna, jedno wyświetlające `food.txt`, a drugie wyświetlające `drinks.txt`. Z wnętrza `food.txt` uruchamiasz polecenie wyszukiwania w liście lokalizacji `:lvimgrep` (lokalna wersja polecenia `:vimgrep`):

```shell
:lvim /bagel/ **/*.md
```

Vim stworzy listę lokalizacji wszystkich dopasowań wyszukiwania bagli dla tego okna `food.txt`. Możesz zobaczyć listę lokalizacji za pomocą `:lopen`. Teraz przejdź do drugiego okna `drinks.txt` i uruchom:

```shell
:lvimgrep /milk/ **/*.md
```

Vim stworzy *oddzielną* listę lokalizacji ze wszystkimi wynikami wyszukiwania mleka dla tego okna `drinks.txt`.

Dla każdego polecenia lokalizacji, które uruchamiasz w każdym oknie, Vim tworzy odrębną listę lokalizacji. Jeśli masz 10 różnych okien, możesz mieć do 10 różnych list lokalizacji. W przeciwieństwie do listy szybkich poprawek, gdzie możesz mieć tylko jedną w danym momencie. Jeśli masz 10 różnych okien, nadal masz tylko jedną listę szybkich poprawek.

Większość poleceń listy lokalizacji jest podobna do poleceń szybkich poprawek, z tą różnicą, że są one poprzedzone `l-`. Na przykład: `:lvimgrep`, `:lgrep` i `:lmake` w porównaniu do `:vimgrep`, `:grep` i `:make`. Aby manipulować oknem listy lokalizacji, polecenia wyglądają podobnie do poleceń szybkich poprawek: `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext` i `:lprev` w porównaniu do `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext` i `:cprev`.

Dwa polecenia wieloplikowe listy lokalizacji są również podobne do poleceń wieloplikowych listy szybkich poprawek: `:ldo` i `:lfdo`. `:ldo` wykonuje polecenie lokalizacji w każdej liście lokalizacji, podczas gdy `:lfdo` wykonuje polecenie listy lokalizacji dla każdego pliku w liście lokalizacji. Po więcej informacji sprawdź `:h location-list`.
## Wykonywanie operacji na wielu plikach w Vim

Znajomość sposobu wykonywania operacji na wielu plikach to przydatna umiejętność w edytowaniu. Kiedy potrzebujesz zmienić nazwę zmiennej w wielu plikach, chcesz to zrobić za jednym zamachem. Vim oferuje osiem różnych sposobów, aby to zrobić.

Praktycznie rzecz biorąc, prawdopodobnie nie będziesz używać wszystkich ośmiu w równym stopniu. Będziesz skłaniać się ku jednemu lub dwóm. Kiedy zaczynasz, wybierz jeden (osobiście sugeruję rozpoczęcie od listy argumentów `:argdo`) i opanuj go. Gdy poczujesz się komfortowo z jednym, naucz się następnego. Zauważysz, że nauka drugiego, trzeciego, czwartego staje się łatwiejsza. Bądź kreatywny. Używaj tego w różnych kombinacjach. Ćwicz, aż będziesz mógł to robić bez wysiłku i bez zbytniego myślenia. Uczyń to częścią swojej pamięci mięśniowej.

Mając to na uwadze, opanowałeś edytowanie w Vim. Gratulacje!