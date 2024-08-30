---
description: Naucz się, jak używać View, Session i Viminfo w Vimie, aby zachować ustawienia,
  złożenia i układy projektów po zamknięciu edytora.
title: Ch20. Views, Sessions, and Viminfo
---

Po pewnym czasie pracy nad projektem, możesz zauważyć, że projekt stopniowo nabiera kształtu z własnymi ustawieniami, złożeniami, buforami, układami itp. To jak dekorowanie swojego mieszkania po pewnym czasie w nim spędzonym. Problem polega na tym, że po zamknięciu Vima tracisz te zmiany. Czy nie byłoby miło, gdybyś mógł zachować te zmiany, aby następnym razem, gdy otworzysz Vima, wyglądał tak, jakbyś nigdy nie wyszedł?

W tym rozdziale nauczysz się, jak używać View, Session i Viminfo, aby zachować "zrzut" swoich projektów.

## View

View to najmniejszy podzbiór trzech (View, Session, Viminfo). To zbiór ustawień dla jednego okna. Jeśli spędzasz długi czas pracując w oknie i chcesz zachować mapy i złożenia, możesz użyć View.

Stwórz plik o nazwie `foo.txt`:

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

W tym pliku wprowadź trzy zmiany:
1. W linii 1 stwórz ręczne złożenie `zf4j` (złóż następne 4 linie).
2. Zmień ustawienie `number`: `setlocal nonumber norelativenumber`. To usunie wskaźniki numerów po lewej stronie okna.
3. Stwórz lokalne mapowanie, aby przechodzić w dół o dwie linie za każdym razem, gdy naciśniesz `j`, zamiast jednej: `:nnoremap <buffer> j jj`.

Twój plik powinien wyglądać tak:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Konfigurowanie atrybutów View

Uruchom:

```shell
:set viewoptions?
```

Domyślnie powinno to wyglądać tak (twoje może wyglądać inaczej w zależności od twojego vimrc):

```shell
viewoptions=folds,cursor,curdir
```

Skonfigurujmy `viewoptions`. Trzy atrybuty, które chcesz zachować, to złożenia, mapy i lokalne opcje ustawień. Jeśli twoje ustawienie wygląda jak moje, już masz opcję `folds`. Musisz powiedzieć View, aby zapamiętało `localoptions`. Uruchom:

```shell
:set viewoptions+=localoptions
```

Aby dowiedzieć się, jakie inne opcje są dostępne dla `viewoptions`, sprawdź `:h viewoptions`. Teraz, jeśli uruchomisz `:set viewoptions?`, powinieneś zobaczyć:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Zapisywanie View

Z oknem `foo.txt` odpowiednio złożonym i mającym opcje `nonumber norelativenumber`, zapiszmy View. Uruchom:

```shell
:mkview
```

Vim tworzy plik View.

### Pliki View

Możesz się zastanawiać, "Gdzie Vim zapisał ten plik View?" Aby zobaczyć, gdzie Vim go zapisuje, uruchom:

```shell
:set viewdir?
```

W systemach operacyjnych opartych na Unixie domyślnie powinno to mówić `~/.vim/view` (jeśli masz inny system operacyjny, może pokazywać inną ścieżkę. Sprawdź `:h viewdir`, aby uzyskać więcej informacji). Jeśli używasz systemu operacyjnego opartego na Unixie i chcesz zmienić to na inną ścieżkę, dodaj to do swojego vimrc:

```shell
set viewdir=$HOME/else/where
```

### Ładowanie pliku View

Zamknij `foo.txt`, jeśli jeszcze tego nie zrobiłeś, a następnie otwórz `foo.txt` ponownie. **Powinieneś zobaczyć oryginalny tekst bez zmian.** To jest oczekiwane.

Aby przywrócić stan, musisz załadować plik View. Uruchom:

```shell
:loadview
```

Teraz powinieneś zobaczyć:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Złożenia, lokalne ustawienia i lokalne mapowania zostały przywrócone. Jeśli zauważysz, kursor powinien być również na linii, na której go zostawiłeś, gdy uruchomiłeś `:mkview`. Tak długo, jak masz opcję `cursor`, View również zapamiętuje pozycję kursora.

### Wiele Views

Vim pozwala na zapisanie 9 numerowanych Views (1-9).

Załóżmy, że chcesz zrobić dodatkowe złożenie (powiedzmy, że chcesz złożyć ostatnie dwie linie) za pomocą `:9,10 fold`. Zapiszmy to jako View 1. Uruchom:

```shell
:mkview 1
```

Jeśli chcesz zrobić jeszcze jedno złożenie za pomocą `:6,7 fold` i zapisać je jako inny View, uruchom:

```shell
:mkview 2
```

Zamknij plik. Gdy otworzysz `foo.txt` i chcesz załadować View 1, uruchom:

```shell
:loadview 1
```

Aby załadować View 2, uruchom:

```shell
:loadview 2
```

Aby załadować oryginalny View, uruchom:

```shell
:loadview
```

### Automatyzacja tworzenia View

Jedną z najgorszych rzeczy, które mogą się zdarzyć, jest to, że po spędzeniu niezliczonych godzin na organizowaniu dużego pliku z złożeniami, przypadkowo zamykasz okno i tracisz wszystkie informacje o złożeniach. Aby temu zapobiec, możesz chcieć automatycznie tworzyć View za każdym razem, gdy zamykasz bufor. Dodaj to do swojego vimrc:

```shell
autocmd BufWinLeave *.txt mkview
```

Dodatkowo, może być miło załadować View, gdy otwierasz bufor:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Teraz nie musisz się martwić o tworzenie i ładowanie View, gdy pracujesz z plikami `txt`. Pamiętaj, że z biegiem czasu twój `~/.vim/view` może zacząć gromadzić pliki View. Dobrze jest je posprzątać co kilka miesięcy.

## Sesje

Jeśli View zapisuje ustawienia okna, Sesja zapisuje informacje o wszystkich oknach (w tym układzie).

### Tworzenie nowej sesji

Załóżmy, że pracujesz z tymi 3 plikami w projekcie `foobarbaz`:

W pliku `foo.txt`:

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

W pliku `bar.txt`:

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

W pliku `baz.txt`:

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

Teraz powiedzmy, że podzieliłeś swoje okna za pomocą `:split` i `:vsplit`. Aby zachować ten wygląd, musisz zapisać Sesję. Uruchom:

```shell
:mksession
```

W przeciwieństwie do `mkview`, które domyślnie zapisuje do `~/.vim/view`, `mksession` zapisuje plik Sesji (`Session.vim`) w bieżącym katalogu. Sprawdź plik, jeśli jesteś ciekaw, co jest w środku.

Jeśli chcesz zapisać plik Sesji gdzie indziej, możesz przekazać argument do `mksession`:

```shell
:mksession ~/some/where/else.vim
```

Jeśli chcesz nadpisać istniejący plik Sesji, wywołaj polecenie z `!` (`:mksession! ~/some/where/else.vim`).

### Ładowanie sesji

Aby załadować Sesję, uruchom:

```shell
:source Session.vim
```

Teraz Vim wygląda dokładnie tak, jak go zostawiłeś, w tym podzielone okna! Alternatywnie, możesz również załadować plik Sesji z terminala:

```shell
vim -S Session.vim
```

### Konfigurowanie atrybutów sesji

Możesz skonfigurować atrybuty, które Sesja zapisuje. Aby zobaczyć, co jest obecnie zapisywane, uruchom:

```shell
:set sessionoptions?
```

Moje mówi:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Jeśli nie chcesz zapisywać `terminal`, gdy zapisujesz Sesję, usuń go z opcji sesji. Uruchom:

```shell
:set sessionoptions-=terminal
```

Jeśli chcesz dodać `options`, gdy zapisujesz Sesję, uruchom:

```shell
:set sessionoptions+=options
```

Oto niektóre atrybuty, które `sessionoptions` może przechowywać:
- `blank` przechowuje puste okna
- `buffers` przechowuje bufory
- `folds` przechowuje złożenia
- `globals` przechowuje zmienne globalne (muszą zaczynać się od wielkiej litery i zawierać przynajmniej jedną małą literę)
- `options` przechowuje opcje i mapowania
- `resize` przechowuje linie i kolumny okna
- `winpos` przechowuje pozycję okna
- `winsize` przechowuje rozmiary okien
- `tabpages` przechowuje zakładki
- `unix` przechowuje pliki w formacie Unix

Aby uzyskać pełną listę, sprawdź `:h 'sessionoptions'`.

Sesja to przydatne narzędzie do zachowania zewnętrznych atrybutów twojego projektu. Jednak niektóre wewnętrzne atrybuty nie są zapisywane przez Sesję, takie jak lokalne oznaczenia, rejestry, historie itp. Aby je zapisać, musisz użyć Viminfo!

## Viminfo

Jeśli zauważysz, po skopiowaniu słowa do rejestru a i zamknięciu Vima, następnym razem, gdy otworzysz Vima, nadal masz ten tekst zapisany w rejestrze a. To jest właściwie dzieło Viminfo. Bez niego Vim nie zapamięta rejestru po zamknięciu Vima.

Jeśli używasz Vima 8 lub wyższego, Vim domyślnie włącza Viminfo, więc mogłeś używać Viminfo przez cały czas, nie wiedząc o tym!

Możesz zapytać: "Co zapisuje Viminfo? Jak różni się od Sesji?"

Aby używać Viminfo, najpierw musisz mieć dostępny feature `+viminfo` (`:version`). Viminfo przechowuje:
- Historię poleceń.
- Historię ciągów wyszukiwania.
- Historię linii wejściowych.
- Zawartość niepustych rejestrów.
- Oznaczenia dla kilku plików.
- Oznaczenia plików, wskazujące na lokalizacje w plikach.
- Ostatni wzór wyszukiwania / zastąpienia (dla 'n' i '&').
- Listę buforów.
- Zmienne globalne.

Ogólnie rzecz biorąc, Sesja przechowuje "zewnętrzne" atrybuty, a Viminfo "wewnętrzne" atrybuty.

W przeciwieństwie do Sesji, gdzie możesz mieć jeden plik Sesji na projekt, zazwyczaj używasz jednego pliku Viminfo na komputer. Viminfo jest niezależne od projektu.

Domyślna lokalizacja Viminfo dla systemów Unix to `$HOME/.viminfo` (`~/.viminfo`). Jeśli używasz innego systemu operacyjnego, twoja lokalizacja Viminfo może być inna. Sprawdź `:h viminfo-file-name`. Za każdym razem, gdy dokonujesz "wewnętrznych" zmian, takich jak skopiowanie tekstu do rejestru, Vim automatycznie aktualizuje plik Viminfo.

*Upewnij się, że masz ustawioną opcję `nocompatible` (`set nocompatible`), w przeciwnym razie twoje Viminfo nie będzie działać.*

### Zapisywanie i odczytywanie Viminfo

Chociaż będziesz używać tylko jednego pliku Viminfo, możesz tworzyć wiele plików Viminfo. Aby zapisać plik Viminfo, użyj polecenia `:wviminfo` (`:wv` w skrócie).

```shell
:wv ~/.viminfo_extra
```

Aby nadpisać istniejący plik Viminfo, dodaj wykrzyknik do polecenia `wv`:

```shell
:wv! ~/.viminfo_extra
```

Domyślnie Vim będzie czytać z pliku `~/.viminfo`. Aby odczytać z innego pliku Viminfo, uruchom `:rviminfo`, lub `:rv` w skrócie:

```shell
:rv ~/.viminfo_extra
```

Aby uruchomić Vima z innym plikiem Viminfo z terminala, użyj flagi `i`:

```shell
vim -i viminfo_extra
```

Jeśli używasz Vima do różnych zadań, takich jak kodowanie i pisanie, możesz stworzyć Viminfo zoptymalizowane do pisania i inne do kodowania.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Uruchamianie Vima bez Viminfo

Aby uruchomić Vima bez Viminfo, możesz uruchomić z terminala:

```shell
vim -i NONE
```

Aby to uczynić trwałym, możesz dodać to do swojego pliku vimrc:

```shell
set viminfo="NONE"
```

### Konfigurowanie atrybutów Viminfo

Podobnie jak `viewoptions` i `sessionoptions`, możesz określić, jakie atrybuty zapisać za pomocą opcji `viminfo`. Uruchom:

```shell
:set viminfo?
```

Otrzymasz:

```shell
!,'100,<50,s10,h
```

To wygląda na tajemnicze. Rozłóżmy to:
- `!` zapisuje zmienne globalne, które zaczynają się od wielkiej litery i nie zawierają małych liter. Przypomnij sobie, że `g:` wskazuje na zmienną globalną. Na przykład, jeśli w pewnym momencie napisałeś przypisanie `let g:FOO = "foo"`, Viminfo zapisze zmienną globalną `FOO`. Jednak jeśli zrobiłeś `let g:Foo = "foo"`, Viminfo nie zapisze tej zmiennej globalnej, ponieważ zawiera małe litery. Bez `!`, Vim nie zapisze tych zmiennych globalnych.
- `'100` reprezentuje oznaczenia. W tym przypadku Viminfo zapisze lokalne oznaczenia (a-z) ostatnich 100 plików. Uważaj, że jeśli powiesz Viminfo, aby zapisało zbyt wiele plików, Vim może zacząć zwalniać. 1000 to dobra liczba do posiadania.
- `<50` mówi Viminfo, ile maksymalnych linii jest zapisywanych dla każdego rejestru (50 w tym przypadku). Jeśli skopiuję 100 linii tekstu do rejestru a (`"ay99j`) i zamknę Vima, następnym razem, gdy otworzę Vima i wkleję z rejestru a (`"ap`), Vim wkleje tylko maksymalnie 50 linii. Jeśli nie podasz maksymalnej liczby linii, *wszystkie* linie będą zapisane. Jeśli podasz 0, nic nie zostanie zapisane.
- `s10` ustawia limit rozmiaru (w kb) dla rejestru. W tym przypadku, każdy rejestr większy niż 10kb zostanie wykluczony.
- `h` wyłącza podświetlenie (z `hlsearch`) po uruchomieniu Vima.

Są inne opcje, które możesz przekazać. Aby dowiedzieć się więcej, sprawdź `:h 'viminfo'`.
## Używanie Widoków, Sesji i Viminfo w Inteligentny Sposób

Vim ma Widok, Sesję i Viminfo, aby uchwycić różne poziomy zrzutów środowiska Vim. Dla mikro projektów używaj Widoków. Dla większych projektów używaj Sesji. Powinieneś poświęcić czas na zapoznanie się ze wszystkimi opcjami, które oferują Widok, Sesja i Viminfo.

Stwórz własny Widok, Sesję i Viminfo zgodnie ze swoim stylem edytowania. Jeśli kiedykolwiek będziesz musiał używać Vima poza swoim komputerem, możesz po prostu załadować swoje ustawienia i natychmiast poczujesz się jak w domu!