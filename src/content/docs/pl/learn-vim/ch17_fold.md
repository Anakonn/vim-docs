---
description: Niniejszy dokument przedstawia różne metody składania tekstu w Vimie,
  umożliwiające ukrywanie nieistotnych informacji w plikach.
title: Ch17. Fold
---

Kiedy czytasz plik, często jest wiele nieistotnych tekstów, które utrudniają zrozumienie, co ten plik robi. Aby ukryć zbędny hałas, użyj Vim fold.

W tym rozdziale nauczysz się różnych sposobów składania pliku.

## Ręczne składanie

Wyobraź sobie, że składasz arkusz papieru, aby zakryć jakiś tekst. Faktyczny tekst nie znika, wciąż tam jest. Vim fold działa w ten sam sposób. Składa zakres tekstu, ukrywając go z wyświetlania bez faktycznego usuwania.

Operatorem składania jest `z` (gdy papier jest złożony, ma kształt litery z).

Załóżmy, że masz ten tekst:

```shell
Fold me
Hold me
```

Z kursorem na pierwszej linii, wpisz `zfj`. Vim składa obie linie w jedną. Powinieneś zobaczyć coś takiego:

```shell
+-- 2 lines: Fold me -----
```

Oto szczegóły:
- `zf` to operator składania.
- `j` to ruch dla operatora składania.

Możesz otworzyć złożony tekst za pomocą `zo`. Aby zamknąć składanie, użyj `zc`.

Składanie jest operatorem, więc podlega regule gramatycznej (`czasownik + rzeczownik`). Możesz przekazać operator składania z ruchem lub obiektem tekstowym. Aby złożyć wewnętrzny akapit, uruchom `zfip`. Aby złożyć do końca pliku, uruchom `zfG`. Aby złożyć teksty między `{` a `}`, uruchom `zfa{`.

Możesz składać z trybu wizualnego. Podświetl obszar, który chcesz złożyć (`v`, `V` lub `Ctrl-v`), a następnie uruchom `zf`.

Możesz wykonać składanie z trybu wiersza poleceń za pomocą polecenia `:fold`. Aby złożyć bieżącą linię i linię po niej, uruchom:

```shell
:,+1fold
```

`,+1` to zakres. Jeśli nie przekażesz parametrów do zakresu, domyślnie odnosi się do bieżącej linii. `+1` to wskaźnik zakresu dla następnej linii. Aby złożyć linie od 5 do 10, uruchom `:5,10fold`. Aby złożyć od bieżącej pozycji do końca linii, uruchom `:,$fold`.

Istnieje wiele innych poleceń składania i rozwijania. Uważam, że jest ich za dużo, aby zapamiętać, gdy zaczynasz. Najbardziej przydatne to:
- `zR` aby otworzyć wszystkie składania.
- `zM` aby zamknąć wszystkie składania.
- `za` przełącz składanie.

Możesz uruchomić `zR` i `zM` na dowolnej linii, ale `za` działa tylko wtedy, gdy jesteś na złożonej / rozwiniętej linii. Aby dowiedzieć się więcej o poleceniach składania, sprawdź `:h fold-commands`.

## Różne metody składania

Sekcja powyżej dotyczy ręcznego składania w Vimie. Istnieje sześć różnych metod składania w Vimie:
1. Ręczne
2. Wcięcie
3. Wyrażenie
4. Składnia
5. Różnice
6. Znacznik

Aby zobaczyć, którą metodę składania aktualnie używasz, uruchom `:set foldmethod?`. Domyślnie Vim używa metody `manual`.

W pozostałej części rozdziału nauczysz się pozostałych pięciu metod składania. Zacznijmy od składania wcięć.

## Składanie wcięć

Aby użyć składania wcięć, zmień `'foldmethod'` na wcięcie:

```shell
:set foldmethod=indent
```

Załóżmy, że masz tekst:

```shell
One
  Two
  Two again
```

Jeśli uruchomisz `:set foldmethod=indent`, zobaczysz:

```shell
One
+-- 2 lines: Two -----
```

Przy składaniu wcięć Vim patrzy na to, ile spacji ma każda linia na początku i porównuje to z opcją `'shiftwidth'`, aby określić, czy można ją złożyć. `'shiftwidth'` zwraca liczbę spacji wymaganą dla każdego kroku wcięcia. Jeśli uruchomisz:

```shell
:set shiftwidth?
```

Domyślna wartość `'shiftwidth'` w Vimie to 2. W powyższym tekście są dwie spacje między początkiem linii a tekstem "Two" i "Two again". Gdy Vim widzi liczbę spacji i że wartość `'shiftwidth'` wynosi 2, Vim uważa, że ta linia ma poziom wcięcia równy jeden.

Załóżmy, że tym razem masz tylko jedną spację między początkiem linii a tekstem:

```shell
One
 Two
 Two again
```

W tej chwili, jeśli uruchomisz `:set foldmethod=indent`, Vim nie składa wciętej linii, ponieważ nie ma wystarczającej ilości spacji w każdej linii. Jedna spacja nie jest uważana za wcięcie. Jednak jeśli zmienisz `'shiftwidth'` na 1:

```shell
:set shiftwidth=1
```

Tekst jest teraz składany. Jest teraz uważany za wcięcie.

Przywróć `shiftwidth` z powrotem na 2 i spacje między tekstami na dwie ponownie. Dodatkowo dodaj dwa dodatkowe teksty:

```shell
One
  Two
  Two again
    Three
    Three again
```

Uruchom składanie (`zM`), zobaczysz:

```shell
One
+-- 4 lines: Two -----
```

Rozwiń złożone linie (`zR`), a następnie umieść kursor na "Three" i przełącz stan składania tekstu (`za`):

```shell
One
  Two
  Two again
+-- 2 lines: Three -----
```

Co to? Składanie w składaniu?

Zagnieżdżone składania są ważne. Tekst "Two" i "Two again" mają poziom składania równy jeden. Tekst "Three" i "Three again" mają poziom składania równy dwa. Jeśli masz złożony tekst z wyższym poziomem składania w złożonym tekście, będziesz miał wiele warstw składania.

## Składanie wyrażeń

Składanie wyrażeń pozwala zdefiniować wyrażenie do dopasowania dla składania. Po zdefiniowaniu wyrażeń składania, Vim przeszukuje każdą linię w poszukiwaniu wartości `'foldexpr'`. To jest zmienna, którą musisz skonfigurować, aby zwrócić odpowiednią wartość. Jeśli `'foldexpr'` zwraca 0, to linia nie jest składana. Jeśli zwraca 1, to ta linia ma poziom składania równy 1. Jeśli zwraca 2, to ta linia ma poziom składania równy 2. Istnieją inne wartości poza liczbami całkowitymi, ale nie będę ich omawiać. Jeśli jesteś ciekawy, sprawdź `:h fold-expr`.

Najpierw zmień metodę składania:

```shell
:set foldmethod=expr
```

Załóżmy, że masz listę jedzenia na śniadanie i chcesz złożyć wszystkie pozycje śniadaniowe zaczynające się na "p":

```shell
donut
pancake
pop-tarts
protein bar
salmon
scrambled eggs
```

Następnie zmień `foldexpr`, aby uchwycić wyrażenia zaczynające się na "p":

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

Wyrażenie powyżej wygląda skomplikowanie. Rozłóżmy to:
- `:set foldexpr` ustawia opcję `'foldexpr'`, aby akceptować niestandardowe wyrażenie.
- `getline()` to funkcja Vimscript, która zwraca zawartość dowolnej danej linii. Jeśli uruchomisz `:echo getline(5)`, zwróci to zawartość linii 5.
- `v:lnum` to specjalna zmienna Vim dla wyrażenia `'foldexpr'`. Vim przeszukuje każdą linię i w tym momencie przechowuje numer każdej linii w zmiennej `v:lnum`. W linii 5 `v:lnum` ma wartość 5. W linii 10 `v:lnum` ma wartość 10.
- `[0]` w kontekście `getline(v:lnum)[0]` to pierwszy znak każdej linii. Gdy Vim przeszukuje linię, `getline(v:lnum)` zwraca zawartość każdej linii. `getline(v:lnum)[0]` zwraca pierwszy znak każdej linii. W pierwszej linii naszej listy, "donut", `getline(v:lnum)[0]` zwraca "d". W drugiej linii naszej listy, "pancake", `getline(v:lnum)[0]` zwraca "p".
- `==\\"p\\"` to druga część wyrażenia równości. Sprawdza, czy wyrażenie, które właśnie oceniłeś, jest równe "p". Jeśli jest prawdziwe, zwraca 1. Jeśli jest fałszywe, zwraca 0. W Vimie 1 jest prawdziwe, a 0 fałszywe. Tak więc w liniach, które zaczynają się na "p", zwraca 1. Przypomnij sobie, jeśli `'foldexpr'` ma wartość 1, to ma poziom składania równy 1.

Po uruchomieniu tego wyrażenia powinieneś zobaczyć:

```shell
donut
+-- 3 lines: pancake -----
salmon
scrambled eggs
```

## Składanie składni

Składanie składni jest określane przez podświetlanie składni języka. Jeśli używasz wtyczki składni języka, takiej jak [vim-polyglot](https://github.com/sheerun/vim-polyglot), składanie składni będzie działać od razu. Wystarczy zmienić metodę składania na składnię:

```shell
:set foldmethod=syntax
```

Załóżmy, że edytujesz plik JavaScript i masz zainstalowaną vim-polyglot. Jeśli masz tablicę jak poniżej:

```shell
const nums = [
  one,
  two,
  three,
  four
]
```

Zostanie ona złożona za pomocą składania składni. Gdy definiujesz podświetlanie składni dla danego języka (zwykle w katalogu `syntax/`), możesz dodać atrybut `fold`, aby uczynić go składanym. Poniżej znajduje się fragment z pliku składni JavaScript vim-polyglot. Zauważ słowo kluczowe `fold` na końcu.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Ten przewodnik nie obejmie funkcji `składnia`. Jeśli jesteś ciekawy, sprawdź `:h syntax.txt`.

## Składanie różnic

Vim może wykonać procedurę różnicową, aby porównać dwa lub więcej plików.

Jeśli masz `file1.txt`:

```shell
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
```

I `file2.txt`:

```shell
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
emacs is ok
```

Uruchom `vimdiff file1.txt file2.txt`:

```shell
+-- 3 lines: vim is awesome -----
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
[vim is awesome] / [emacs is ok]
```

Vim automatycznie składa niektóre identyczne linie. Gdy uruchamiasz polecenie `vimdiff`, Vim automatycznie używa `foldmethod=diff`. Jeśli uruchomisz `:set foldmethod?`, zwróci `diff`.

## Składanie znaczników

Aby użyć składania znaczników, uruchom:

```shell
:set foldmethod=marker
```

Załóżmy, że masz tekst:

```shell
Hello

{{{
world
vim
}}}
```

Uruchom `zM`, zobaczysz:

```shell
hello

+-- 4 lines: -----
```

Vim widzi `{{{` i `}}}` jako wskaźniki składania i składa teksty między nimi. Przy składaniu znaczników Vim szuka specjalnych znaczników, zdefiniowanych przez opcję `'foldmarker'`, aby oznaczyć obszary składania. Aby zobaczyć, jakie znaczniki używa Vim, uruchom:

```shell
:set foldmarker?
```

Domyślnie Vim używa `{{{` i `}}}` jako wskaźników. Jeśli chcesz zmienić wskaźnik na inne teksty, takie jak "coffee1" i "coffee2":

```shell
:set foldmarker=coffee1,coffee2
```

Jeśli masz tekst:

```shell
hello

coffee1
world
vim
coffee2
```

Teraz Vim używa `coffee1` i `coffee2` jako nowe znaczniki składania. Na marginesie, wskaźnik musi być dosłownym ciągiem i nie może być wyrażeniem regularnym.

## Utrzymywanie składania

Tracisz wszystkie informacje o składaniu, gdy zamykasz sesję Vim. Jeśli masz ten plik, `count.txt`:

```shell
one
two
three
four
five
```

Następnie wykonaj ręczne składanie od linii "three" w dół (`:3,$fold`):

```shell
one
two
+-- 3 lines: three ---
```

Gdy wyjdziesz z Vima i ponownie otworzysz `count.txt`, składania już nie ma!

Aby zachować składania, po złożeniu uruchom:

```shell
:mkview
```

Następnie, gdy otworzysz `count.txt`, uruchom:

```shell
:loadview
```

Twoje składania zostaną przywrócone. Musisz jednak ręcznie uruchomić `mkview` i `loadview`. Wiem, że któregoś dnia zapomnę uruchomić `mkview` przed zamknięciem pliku i stracę wszystkie składania. Jak możemy zautomatyzować ten proces?

Aby automatycznie uruchomić `mkview`, gdy zamykasz plik `.txt` i uruchomić `loadview`, gdy otwierasz plik `.txt`, dodaj to do swojego vimrc:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Przypomnij sobie, że `autocmd` jest używane do wykonywania polecenia po wyzwoleniu zdarzenia. Dwa zdarzenia tutaj to:
- `BufWinLeave` dla momentu, gdy usuwasz bufor z okna.
- `BufWinEnter` dla momentu, gdy ładujesz bufor w oknie.

Teraz po złożeniu wewnątrz pliku `.txt` i wyjściu z Vima, następnym razem, gdy otworzysz ten plik, informacje o składaniu zostaną przywrócone.

Domyślnie Vim zapisuje informacje o składaniu, gdy uruchamiasz `mkview` w `~/.vim/view` dla systemu Unix. Aby uzyskać więcej informacji, sprawdź `:h 'viewdir'`.
## Ucz się składania w mądry sposób

Kiedy po raz pierwszy zacząłem używać Vima, zignorowałem naukę składania, ponieważ nie uważałem, że jest to przydatne. Jednak im dłużej koduję, tym bardziej przydatne wydaje mi się składanie. Strategicznie umieszczone składki mogą dać lepszy przegląd struktury tekstu, jak spis treści w książce.

Kiedy uczysz się składania, zacznij od ręcznego składania, ponieważ można je stosować w ruchu. Następnie stopniowo ucz się różnych sztuczek do składania wcięć i znaczników. Na koniec naucz się, jak robić składanie składni i wyrażeń. Możesz nawet użyć tych dwóch ostatnich do pisania własnych wtyczek Vim.