---
description: Ten rozdział omawia wyszukiwanie i zastępowanie w Vimie, koncentrując
  się na używaniu wyrażeń regularnych oraz opcji ignorowania wielkości liter.
title: Ch12. Search and Substitute
---

Ten rozdział obejmuje dwa oddzielne, ale powiązane pojęcia: wyszukiwanie i zastępowanie. Często podczas edytowania musisz przeszukiwać wiele tekstów na podstawie ich wspólnych wzorców. Ucząc się, jak używać wyrażeń regularnych w wyszukiwaniu i zastępowaniu zamiast dosłownych ciągów, będziesz w stanie szybko celować w dowolny tekst.

Na marginesie, w tym rozdziale będę używał `/` mówiąc o wyszukiwaniu. Wszystko, co możesz zrobić z `/`, można również zrobić z `?`.

## Inteligentna wrażliwość na wielkość liter

Może być trudno dopasować wielkość liter w wyszukiwanym terminie. Jeśli szukasz tekstu "Learn Vim", łatwo możesz pomylić wielkość jednej litery i uzyskać fałszywy wynik wyszukiwania. Czy nie byłoby łatwiej i bezpieczniej, gdybyś mógł dopasować dowolną wielkość liter? Tutaj opcja `ignorecase` błyszczy. Wystarczy dodać `set ignorecase` do swojego vimrc, a wszystkie Twoje terminy wyszukiwania staną się niewrażliwe na wielkość liter. Teraz nie musisz już pisać `/Learn Vim`, `/learn vim` zadziała.

Jednak są sytuacje, kiedy musisz wyszukiwać frazę z określoną wielkością liter. Jednym ze sposobów jest wyłączenie opcji `ignorecase`, uruchamiając `set noignorecase`, ale to dużo pracy, aby włączać i wyłączać za każdym razem, gdy musisz wyszukiwać frazę z wrażliwością na wielkość liter.

Aby uniknąć przełączania `ignorecase`, Vim ma opcję `smartcase`, aby wyszukiwać ciąg niewrażliwy na wielkość liter, jeśli wzorzec wyszukiwania *zawiera przynajmniej jeden znak wielkiej litery*. Możesz połączyć zarówno `ignorecase`, jak i `smartcase`, aby przeprowadzić wyszukiwanie niewrażliwe na wielkość liter, gdy wprowadzisz same małe litery, oraz wyszukiwanie wrażliwe na wielkość liter, gdy wprowadzisz jedną lub więcej wielkich liter.

W swoim vimrc dodaj:

```shell
set ignorecase smartcase
```

Jeśli masz te teksty:

```shell
hello
HELLO
Hello
```

- `/hello` dopasowuje "hello", "HELLO" i "Hello".
- `/HELLO` dopasowuje tylko "HELLO".
- `/Hello` dopasowuje tylko "Hello".

Jest jeden minus. Co jeśli musisz wyszukiwać tylko mały ciąg? Kiedy robisz `/hello`, Vim teraz wykonuje wyszukiwanie niewrażliwe na wielkość liter. Możesz użyć wzorca `\C` w dowolnym miejscu w swoim terminie wyszukiwania, aby powiedzieć Vimowi, że następny termin wyszukiwania będzie wrażliwy na wielkość liter. Jeśli zrobisz `/\Chello`, dopasuje to ściśle "hello", a nie "HELLO" czy "Hello".

## Pierwszy i ostatni znak w linii

Możesz użyć `^`, aby dopasować pierwszy znak w linii, a `$`, aby dopasować ostatni znak w linii.

Jeśli masz ten tekst:

```shell
hello hello
```

Możesz celować w pierwsze "hello" za pomocą `/^hello`. Znak, który następuje po `^`, musi być pierwszym znakiem w linii. Aby celować w ostatnie "hello", uruchom `/hello$`. Znak przed `$` musi być ostatnim znakiem w linii.

Jeśli masz ten tekst:

```shell
hello hello friend
```

Uruchomienie `/hello$` nie dopasuje niczego, ponieważ "friend" jest ostatnim terminem w tej linii, a nie "hello".

## Powtarzające się wyszukiwanie

Możesz powtórzyć poprzednie wyszukiwanie za pomocą `//`. Jeśli właśnie wyszukiwałeś `/hello`, uruchomienie `//` jest równoważne z uruchomieniem `/hello`. Ta skrótowa metoda może zaoszczędzić Ci kilka naciśnięć klawiszy, szczególnie jeśli właśnie wyszukiwałeś długi ciąg. Przypomnij również, że możesz użyć `n` i `N`, aby powtórzyć ostatnie wyszukiwanie w tym samym kierunku i w przeciwnym kierunku, odpowiednio.

Co jeśli chcesz szybko przypomnieć sobie *n* ostatnich terminów wyszukiwania? Możesz szybko przeszukiwać historię wyszukiwania, najpierw naciskając `/`, a następnie klawisze strzałek `w górę`/`w dół` (lub `Ctrl-N`/`Ctrl-P`), aż znajdziesz potrzebny termin wyszukiwania. Aby zobaczyć całą swoją historię wyszukiwania, możesz uruchomić `:history /`.

Kiedy dotrzesz do końca pliku podczas wyszukiwania, Vim zgłasza błąd: `"Search hit the BOTTOM without match for: {your-search}"`. Czasami może to być dobry zabezpieczenie przed nadmiernym wyszukiwaniem, ale innym razem chcesz cyklicznie wrócić do początku. Możesz użyć opcji `set wrapscan`, aby Vim mógł wyszukiwać z powrotem na górę pliku, gdy dotrzesz do końca pliku. Aby wyłączyć tę funkcję, zrób `set nowrapscan`.

## Wyszukiwanie alternatywnych słów

Często zdarza się, że musisz wyszukiwać wiele słów jednocześnie. Jeśli musisz wyszukiwać *albo* "hello vim", albo "hola vim", ale nie "salve vim" czy "bonjour vim", możesz użyć wzorca `|`.

Dany jest ten tekst:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Aby dopasować zarówno "hello", jak i "hola", możesz zrobić `/hello\|hola`. Musisz uciec (`\`) operatora lub (`|`), w przeciwnym razie Vim dosłownie wyszuka ciąg "|".

Jeśli nie chcesz za każdym razem wpisywać `\|`, możesz użyć składni `magic` (`\v`) na początku wyszukiwania: `/\vhello|hola`. Nie będę omawiać `magic` w tym przewodniku, ale z `\v` nie musisz już uciekać specjalnych znaków. Aby dowiedzieć się więcej o `\v`, możesz sprawdzić `:h \v`.

## Ustawianie początku i końca dopasowania

Może musisz wyszukiwać tekst, który jest częścią złożonego słowa. Jeśli masz te teksty:

```shell
11vim22
vim22
11vim
vim
```

Jeśli musisz wybrać "vim", ale tylko wtedy, gdy zaczyna się od "11" i kończy na "22", możesz użyć operatorów `\zs` (początek dopasowania) i `\ze` (koniec dopasowania). Uruchom:

```shell
/11\zsvim\ze22
```

Vim nadal musi dopasować cały wzór "11vim22", ale tylko podświetla wzór umieszczony między `\zs` i `\ze`. Inny przykład:

```shell
foobar
foobaz
```

Jeśli musisz dopasować "foo" w "foobaz", ale nie w "foobar", uruchom:

```shell
/foo\zebaz
```

## Wyszukiwanie zakresów znaków

Wszystkie Twoje terminy wyszukiwania do tej pory były dosłownym wyszukiwaniem słów. W prawdziwym życiu możesz musieć użyć ogólnego wzoru, aby znaleźć swój tekst. Najbardziej podstawowym wzorem jest zakres znaków, `[ ]`.

Jeśli musisz wyszukiwać jakąkolwiek cyfrę, prawdopodobnie nie chcesz za każdym razem wpisywać `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0`. Zamiast tego użyj `/[0-9]`, aby dopasować pojedynczą cyfrę. Wyrażenie `0-9` reprezentuje zakres liczb 0-9, które Vim spróbuje dopasować, więc jeśli szukasz cyfr od 1 do 5, użyj `/[1-5]`.

Cyfry nie są jedynymi typami danych, które Vim może wyszukiwać. Możesz również użyć `/[a-z]`, aby wyszukiwać małe litery, i `/[A-Z]`, aby wyszukiwać wielkie litery.

Możesz łączyć te zakresy razem. Jeśli musisz wyszukiwać cyfry 0-9 oraz zarówno małe, jak i wielkie litery od "a" do "f" (jak w heksadecymalnych), możesz zrobić `/[0-9a-fA-F]`.

Aby wykonać wyszukiwanie negatywne, możesz dodać `^` wewnątrz nawiasów zakresu znaków. Aby wyszukiwać nie-cyfrę, uruchom `/[^0-9]`. Vim dopasuje dowolny znak, o ile nie jest cyfrą. Uważaj, że daszek (`^`) wewnątrz nawiasów jest inny niż daszek na początku linii (np. `/^hello`). Jeśli daszek znajduje się na początku terminu wyszukiwania, oznacza to "pierwszy znak w linii". Jeśli daszek znajduje się wewnątrz pary nawiasów i jest pierwszym znakiem wewnątrz nawiasów, oznacza to operator wyszukiwania negatywnego. `/^abc` dopasowuje pierwsze "abc" w linii, a `/[^abc]` dopasowuje dowolny znak z wyjątkiem "a", "b" lub "c".

## Wyszukiwanie powtarzających się znaków

Jeśli musisz wyszukiwać podwójne cyfry w tym tekście:

```shell
1aa
11a
111
```

Możesz użyć `/[0-9][0-9]`, aby dopasować dwucyfrowy znak, ale ta metoda jest nieefektywna. Co jeśli musisz dopasować dwadzieścia cyfr? Wpisywanie `[0-9]` dwadzieścia razy nie jest przyjemnym doświadczeniem. Dlatego potrzebujesz argumentu `count`.

Możesz przekazać `count` do swojego wyszukiwania. Ma on następującą składnię:

```shell
{n,m}
```

Przy okazji, te nawiasy `count` muszą być ucieczone, gdy używasz ich w Vimie. Operator `count` jest umieszczany po pojedynczym znaku, który chcesz zwiększyć.

Oto cztery różne warianty składni `count`:
- `{n}` to dokładne dopasowanie. `/[0-9]\{2\}` dopasowuje dwucyfrowe liczby: "11" i "11" w "111".
- `{n,m}` to dopasowanie w zakresie. `/[0-9]\{2,3\}` dopasowuje liczby od 2 do 3 cyfr: "11" i "111".
- `{,m}` to dopasowanie do. `/[0-9]\{,3\}` dopasowuje liczby do 3 cyfr: "1", "11" i "111".
- `{n,}` to dopasowanie przynajmniej. `/[0-9]\{2,\}` dopasowuje przynajmniej liczby 2 lub więcej cyfr: "11" i "111".

Argumenty count `\{0,\}` (zero lub więcej) i `\{1,\}` (jeden lub więcej) są powszechnymi wzorami wyszukiwania, a Vim ma dla nich specjalne operatory: `*` i `+` ( `+` musi być ucieczone, podczas gdy `*` działa dobrze bez ucieczki). Jeśli zrobisz `/[0-9]*`, to jest to samo co `/[0-9]\{0,\}`. Wyszukuje zero lub więcej cyfr. Dopasuje "", "1", "123". Przy okazji, dopasuje również nie-cyfry, takie jak "a", ponieważ technicznie rzecz biorąc, w literze "a" nie ma cyfry. Zastanów się dobrze przed użyciem `*`. Jeśli zrobisz `/[0-9]\+`, to jest to samo co `/[0-9]\{1,\}`. Wyszukuje jedną lub więcej cyfr. Dopasuje "1" i "12".

## Zdefiniowane zakresy znaków

Vim ma zdefiniowane zakresy dla powszechnych znaków, takich jak cyfry i litery. Nie będę omawiać każdego z nich tutaj, ale możesz znaleźć pełną listę w `:h /character-classes`. Oto przydatne:

```shell
\d    Cyfra [0-9]
\D    Nie-cyfra [^0-9]
\s    Znak białej przestrzeni (spacja i tabulator)
\S    Nie-znak białej przestrzeni (wszystko oprócz spacji i tabulatora)
\w    Znak słowa [0-9A-Za-z_]
\l    Małe litery [a-z]
\u    Wielka litera [A-Z]
```

Możesz ich używać tak, jak używałbyś zakresów znaków. Aby wyszukiwać dowolną pojedynczą cyfrę, zamiast używać `/[0-9]`, możesz użyć `/\d` dla bardziej zwięzłej składni.

## Przykład wyszukiwania: Łapanie tekstu między parą podobnych znaków

Jeśli chcesz wyszukiwać frazę otoczoną parą podwójnych cudzysłowów:

```shell
"Vim is awesome!"
```

Uruchom to:

```shell
/"[^"]\+"
```

Rozłóżmy to:
- `"` to dosłowny podwójny cudzysłów. Dopasowuje pierwszy podwójny cudzysłów.
- `[^"]` oznacza dowolny znak z wyjątkiem podwójnego cudzysłowu. Dopasowuje dowolny znak alfanumeryczny i biały znak, o ile nie jest podwójnym cudzysłowem.
- `\+` oznacza jeden lub więcej. Ponieważ jest poprzedzone przez `[^"]`, Vim szuka jednego lub więcej znaków, które nie są podwójnym cudzysłowem.
- `"` to dosłowny podwójny cudzysłów. Dopasowuje zamykający podwójny cudzysłów.

Kiedy Vim widzi pierwszy `"`, zaczyna przechwytywanie wzoru. W momencie, gdy widzi drugi podwójny cudzysłów w linii, dopasowuje drugi wzór `"` i zatrzymuje przechwytywanie wzoru. W międzyczasie wszystkie znaki, które nie są podwójnymi cudzysłowami, są przechwytywane przez wzór `[^"]\+`, w tym przypadku fraza `Vim is awesome!`. To powszechny wzór do przechwytywania frazy otoczonej parą podobnych ograniczników.

- Aby przechwycić frazę otoczoną pojedynczymi cudzysłowami, możesz użyć `/'[^']\+'`.
- Aby przechwycić frazę otoczoną zerami, możesz użyć `/0[^0]\+0`.

## Przykład wyszukiwania: Łapanie numeru telefonu

Jeśli chcesz dopasować amerykański numer telefonu oddzielony myślnikiem (`-`), jak `123-456-7890`, możesz użyć:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Amerykański numer telefonu składa się z zestawu trzech cyfr, po którym następują kolejne trzy cyfry, a na końcu cztery cyfry. Rozłóżmy to:
- `\d\{3\}` dopasowuje cyfrę powtórzoną dokładnie trzy razy
- `-` to dosłowny myślnik

Możesz uniknąć wpisywania ucieczek z `\v`:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Ten wzór jest również przydatny do przechwytywania dowolnych powtarzających się cyfr, takich jak adresy IP i kody pocztowe.

To kończy część wyszukiwania tego rozdziału. Teraz przejdźmy do zastępowania.

## Podstawowe zastępowanie

Polecenie zastępowania w Vimie jest przydatnym poleceniem do szybkiego znajdowania i zastępowania dowolnego wzoru. Składnia zastępowania to:

```shell
:s/{stary-wzór}/{nowy-wzór}/
```

Zacznijmy od podstawowego użycia. Jeśli masz ten tekst:

```shell
vim is good
```

Zastąpmy "good" "awesome", ponieważ Vim jest niesamowity. Uruchom `:s/good/awesome/`. Powinieneś zobaczyć:

```shell
vim is awesome
```
## Powtarzanie Ostatniej Zmiany

Możesz powtórzyć ostatnie polecenie zamiany za pomocą normalnego polecenia `&` lub uruchamiając `:s`. Jeśli właśnie wykonałeś `:s/good/awesome/`, uruchomienie `&` lub `:s` powtórzy to.

Wcześniej w tym rozdziale wspomniałem, że możesz użyć `//`, aby powtórzyć poprzedni wzór wyszukiwania. Ten trik działa z poleceniem zamiany. Jeśli `/good` zostało niedawno wykonane, a pierwszy argument wzoru zamiany pozostawisz pusty, jak w `:s//awesome/`, zadziała to tak samo jak uruchomienie `:s/good/awesome/`.

## Zakres Zamiany

Podobnie jak wiele poleceń Ex, możesz przekazać argument zakresu do polecenia zamiany. Składnia to:

```shell
:[zakres]s/stary/nowy/
```

Jeśli masz te wyrażenia:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Aby zamienić "let" na "const" w liniach od trzeciej do piątej, możesz zrobić:

```shell
:3,5s/let/const/
```

Oto kilka wariantów zakresu, które możesz przekazać:

- `:,3s/let/const/` - jeśli nic nie jest podane przed przecinkiem, reprezentuje bieżącą linię. Zamień od bieżącej linii do linii 3.
- `:1,s/let/const/` - jeśli nic nie jest podane po przecinku, również reprezentuje bieżącą linię. Zamień od linii 1 do bieżącej linii.
- `:3s/let/const/` - jeśli tylko jedna wartość jest podana jako zakres (bez przecinka), dokonuje zamiany tylko w tej linii.

W Vimie `%` zazwyczaj oznacza cały plik. Jeśli uruchomisz `:%s/let/const/`, zamieni to we wszystkich liniach. Pamiętaj o tej składni zakresu. Wiele poleceń wiersza poleceń, które nauczysz się w nadchodzących rozdziałach, będzie podążać za tym wzorem.

## Dopasowywanie Wzorów

Następne kilka sekcji omówi podstawowe wyrażenia regularne. Silna znajomość wzorów jest niezbędna do opanowania polecenia zamiany.

Jeśli masz następujące wyrażenia:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Aby dodać parę podwójnych cudzysłowów wokół cyfr:

```shell
:%s/\d/"\0"/
```

Wynik:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Rozłóżmy to polecenie:
- `:%s` celuje w cały plik, aby wykonać zamianę.
- `\d` to zdefiniowany zakres Vima dla cyfr (podobnie jak użycie `[0-9]`).
- `"\0"` tutaj podwójne cudzysłowy są dosłownymi podwójnymi cudzysłowami. `\0` to specjalny znak reprezentujący "cały dopasowany wzór". Dopasowany wzór tutaj to pojedyncza cyfra, `\d`.

Alternatywnie, `&` również reprezentuje cały dopasowany wzór jak `\0`. `:s/\d/"&"/` również by zadziałało.

Rozważmy inny przykład. Mając te wyrażenia i potrzebując zamienić wszystkie "let" z nazwami zmiennych.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Aby to zrobić, uruchom:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

Powyższe polecenie zawiera zbyt wiele ukośników i jest trudne do odczytania. W takim przypadku bardziej wygodne jest użycie operatora `\v`:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Wynik:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Świetnie! Rozłóżmy to polecenie:
- `:%s` celuje we wszystkie linie w pliku, aby wykonać zamianę.
- `(\w+) (\w+)` to dopasowanie grupowe. `\w` to jeden z zdefiniowanych zakresów Vima dla znaku słowa (`[0-9A-Za-z_]`). `(\ )` otaczające to przechwytuje dopasowanie znaku słowa w grupie. Zauważ spację między dwoma grupami. `(\w+) (\w+)` przechwytuje dwie grupy. Pierwsza grupa przechwytuje "one", a druga grupa przechwytuje "two".
- `\2 \1` zwraca przechwyconą grupę w odwróconej kolejności. `\2` zawiera przechwycony ciąg "let", a `\1` ciąg "one". Mając `\2 \1`, zwraca ciąg "let one".

Przypomnij, że `\0` reprezentuje cały dopasowany wzór. Możesz podzielić dopasowany ciąg na mniejsze grupy za pomocą `( )`. Każda grupa jest reprezentowana przez `\1`, `\2`, `\3` itd.

Zróbmy jeszcze jeden przykład, aby utrwalić tę koncepcję dopasowania grup. Jeśli masz te liczby:

```shell
123
456
789
```

Aby odwrócić kolejność, uruchom:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Wynik to:

```shell
321
654
987
```

Każde `(\d)` dopasowuje każdą cyfrę i tworzy grupę. W pierwszej linii pierwsze `(\d)` ma wartość 1, drugie `(\d)` ma wartość 2, a trzecie `(\d)` ma wartość 3. Są one przechowywane w zmiennych `\1`, `\2` i `\3`. W drugiej połowie twojej zamiany nowy wzór `\3\2\1` skutkuje wartością "321" w pierwszej linii.

Gdybyś zamiast tego uruchomił:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Otrzymałbyś inny wynik:

```shell
312
645
978
```

Dzieje się tak, ponieważ masz teraz tylko dwie grupy. Pierwsza grupa, przechwycona przez `(\d\d)`, jest przechowywana w `\1` i ma wartość 12. Druga grupa, przechwycona przez `(\d)`, jest przechowywana w `\2` i ma wartość 3. `\2\1` zwraca więc 312.

## Flagi Zamiany

Jeśli masz zdanie:

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

Aby zamienić wszystkie naleśniki na pączki, nie możesz po prostu uruchomić:

```shell
:s/pancake/donut
```

Powyższe polecenie zamieni tylko pierwsze dopasowanie, dając ci:

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Są dwa sposoby, aby to rozwiązać. Możesz albo uruchomić polecenie zamiany jeszcze dwa razy, albo możesz przekazać mu globalną flagę (`g`), aby zamienić wszystkie dopasowania w linii.

Porozmawiajmy o globalnej fladze. Uruchom:

```shell
:s/pancake/donut/g
```

Vim zamienia wszystkie naleśniki na pączki w jednym szybkim poleceniu. Komenda globalna jest jedną z kilku flag, które akceptuje polecenie zamiany. Przekazujesz flagi na końcu polecenia zamiany. Oto lista przydatnych flag:

```shell
&    Ponownie użyj flag z poprzedniego polecenia zamiany.
g    Zastąp wszystkie dopasowania w linii.
c    Zapytaj o potwierdzenie zamiany.
e    Zapobiegaj wyświetlaniu komunikatu o błędzie, gdy zamiana się nie powiedzie.
i    Wykonaj zamianę bez rozróżniania wielkości liter.
I    Wykonaj zamianę z rozróżnieniem wielkości liter.
```

Są inne flagi, których nie wymieniam powyżej. Aby przeczytać o wszystkich flagach, sprawdź `:h s_flags`.

Przy okazji, polecenia powtarzania zamiany (`&` i `:s`) nie zachowują flag. Uruchomienie `&` powtórzy tylko `:s/pancake/donut/` bez `g`. Aby szybko powtórzyć ostatnie polecenie zamiany ze wszystkimi flagami, uruchom `:&&`.

## Zmiana Delimitera

Jeśli musisz zastąpić URL długą ścieżką:

```shell
https://mysite.com/a/b/c/d/e
```

Aby zamienić go na słowo "hello", uruchom:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

Jednak trudno jest określić, które ukośniki (`/`) są częścią wzoru zamiany, a które są delimiterami. Możesz zmienić delimiter na dowolny znak jednobajtowy (z wyjątkiem liter, cyfr, lub `"`, `|`, i `\`). Zastąpmy je `+`. Powyższe polecenie zamiany można zatem przepisać jako:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Teraz łatwiej zobaczyć, gdzie są delimitery.

## Specjalna Zamiana

Możesz również zmienić wielkość liter tekstu, który zamieniasz. Mając następujące wyrażenia i twoim zadaniem jest zamienić zmienne "one", "two", "three" itd. na wielkie litery.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Uruchom:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Otrzymasz:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

Rozkład:
- `(\w+) (\w+)` przechwytuje pierwsze dwa dopasowane grupy, takie jak "let" i "one".
- `\1` zwraca wartość pierwszej grupy, "let".
- `\U\2` zamienia na wielkie litery (`\U`) drugą grupę (`\2`).

Sztuczka tego polecenia to wyrażenie `\U\2`. `\U` instruuje, aby następny znak był zamieniony na wielką literę.

Zróbmy jeszcze jeden przykład. Załóżmy, że piszesz przewodnik po Vimie i musisz zamienić pierwszą literę każdego słowa w linii na wielką literę.

```shell
vim is the greatest text editor in the whole galaxy
```

Możesz uruchomić:

```shell
:s/\<./\U&/g
```

Wynik:

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Oto rozkład:
- `:s` zamienia bieżącą linię.
- `\<.` składa się z dwóch części: `\<`, aby dopasować początek słowa, i `.` aby dopasować dowolny znak. Operator `\<` sprawia, że następny znak jest pierwszym znakiem słowa. Ponieważ `.` jest następnym znakiem, dopasuje pierwszy znak każdego słowa.
- `\U&` zamienia na wielką literę następny symbol, `&`. Przypomnij, że `&` (lub `\0`) reprezentuje całe dopasowanie. Dopasowuje pierwszy znak każdego słowa.
- `g` flaga globalna. Bez niej to polecenie zamienia tylko pierwsze dopasowanie. Musisz zamienić każde dopasowanie w tej linii.

Aby dowiedzieć się więcej o specjalnych symbolach zamiany, takich jak `\U`, sprawdź `:h sub-replace-special`.

## Alternatywne Wzory

Czasami musisz dopasować wiele wzorów jednocześnie. Jeśli masz następujące powitania:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Musisz zamienić słowo "vim" na "friend", ale tylko w liniach zawierających słowo "hello" lub "hola". Przypomnij sobie z wcześniejszej części tego rozdziału, że możesz użyć `|` do wielu alternatywnych wzorów.

```shell
:%s/\v(hello|hola) vim/\1 friend/g
```

Wynik:

```shell
hello friend
hola friend
salve vim
bonjour vim
```

Oto rozkład:
- `%s` uruchamia polecenie zamiany na każdej linii w pliku.
- `(hello|hola)` dopasowuje *lub* "hello", *lub* "hola" i traktuje to jako grupę.
- `vim` to dosłowne słowo "vim".
- `\1` to pierwsza grupa, która jest tekstem "hello" lub "hola".
- `friend` to dosłowne słowo "friend".

## Zamiana Początku i Końca Wzoru

Przypomnij, że możesz użyć `\zs` i `\ze`, aby zdefiniować początek i koniec dopasowania. Ta technika działa również w zamianie. Jeśli masz:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

Aby zamienić "cake" w "hotcake" na "dog", aby uzyskać "hotdog":

```shell
:%s/hot\zscake/dog/g
```

Wynik:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Chciwy i Niechciwy

Możesz zastąpić n-te dopasowanie w linii tym trikiem:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Aby zastąpić trzecie "Mississippi" na "Arkansas", uruchom:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

Rozbicie:
- `:s/` polecenie zastąpienia.
- `\v` to magiczne słowo kluczowe, dzięki któremu nie musisz uciekać specjalnych słów kluczowych.
- `.` dopasowuje dowolny pojedynczy znak.
- `{-}` wykonuje niechciwe dopasowanie 0 lub więcej poprzedzającego atomu.
- `\zsMississippi` sprawia, że "Mississippi" jest początkiem dopasowania.
- `(...){3}` szuka trzeciego dopasowania.

Widziałeś składnię `{3}` wcześniej w tym rozdziale. W tym przypadku `{3}` dopasuje dokładnie trzecie dopasowanie. Nowym trikiem tutaj jest `{-}`. To jest niechciwe dopasowanie. Znajduje najkrótsze dopasowanie danego wzorca. W tym przypadku `(.{-}Mississippi)` dopasowuje najmniejszą ilość "Mississippi" poprzedzoną dowolnym znakiem. Porównaj to z `(.*Mississippi)`, gdzie znajduje najdłuższe dopasowanie danego wzorca.

Jeśli użyjesz `(.{-}Mississippi)`, otrzymasz pięć dopasowań: "One Mississippi", "Two Mississippi" itd. Jeśli użyjesz `(.*Mississippi)`, otrzymasz jedno dopasowanie: ostatnie "Mississippi". `*` to chciwy matcher, a `{-}` to niechciwy matcher. Aby dowiedzieć się więcej, sprawdź `:h /\{-` i `:h non-greedy`.

Zróbmy prostszy przykład. Jeśli masz ciąg:

```shell
abc1de1
```

Możesz dopasować "abc1de1" (chciwie) za pomocą:

```shell
/a.*1
```

Możesz dopasować "abc1" (niechciwie) za pomocą:

```shell
/a.\{-}1
```

Więc jeśli potrzebujesz zamienić na wielkie litery najdłuższe dopasowanie (chciwie), uruchom:

```shell
:s/a.*1/\U&/g
```

Aby uzyskać:

```shell
ABC1DEFG1
```

Jeśli potrzebujesz zamienić na wielkie litery najkrótsze dopasowanie (niechciwie), uruchom:

```shell
:s/a.\{-}1/\U&/g
```

Aby uzyskać:

```shell
ABC1defg1
```

Jeśli jesteś nowy w koncepcji chciwy vs niechciwy, może być trudno to zrozumieć. Eksperymentuj z różnymi kombinacjami, aż to zrozumiesz.

## Zastępowanie w Wielu Plikach

Na koniec nauczmy się, jak zastępować frazy w wielu plikach. W tej sekcji załóżmy, że masz dwa pliki: `food.txt` i `animal.txt`.

W pliku `food.txt`:

```shell
corndog
hotdog
chilidog
```

W pliku `animal.txt`:

```shell
large dog
medium dog
small dog
```

Załóżmy, że twoja struktura katalogów wygląda tak:

```shell
- food.txt
- animal.txt
```

Najpierw uchwyć oba pliki `food.txt` i `animal.txt` w `:args`. Przypomnij sobie z wcześniejszych rozdziałów, że `:args` można użyć do stworzenia listy nazw plików. Istnieje kilka sposobów, aby to zrobić z wnętrza Vima, jednym z nich jest uruchomienie tego z wnętrza Vima:

```shell
:args *.txt                  uchwyca wszystkie pliki txt w bieżącej lokalizacji
```

Aby to przetestować, gdy uruchomisz `:args`, powinieneś zobaczyć:

```shell
[food.txt] animal.txt
```

Teraz, gdy wszystkie odpowiednie pliki są przechowywane w liście argumentów, możesz wykonać zastąpienie w wielu plikach za pomocą polecenia `:argdo`. Uruchom:

```shell
:argdo %s/dog/chicken/
```

To wykonuje zastąpienie we wszystkich plikach w liście `:args`. Na koniec zapisz zmienione pliki za pomocą:

```shell
:argdo update
```

`:args` i `:argdo` to przydatne narzędzia do stosowania poleceń wiersza poleceń w wielu plikach. Spróbuj z innymi poleceniami!

## Zastępowanie w Wielu Plikach Z Makrami

Alternatywnie, możesz również uruchomić polecenie zastąpienia w wielu plikach za pomocą makr. Uruchom:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

Rozbicie:
- `:args *.txt` dodaje wszystkie pliki tekstowe do listy `:args`.
- `qq` rozpoczyna makro w rejestrze "q".
- `:%s/dog/chicken/g` zastępuje "dog" na "chicken" we wszystkich liniach w bieżącym pliku.
- `:wnext` zapisuje plik, a następnie przechodzi do następnego pliku na liście `args`.
- `q` zatrzymuje nagrywanie makra.
- `99@q` wykonuje makro dziewięćdziesiąt dziewięć razy. Vim zatrzyma wykonanie makra po napotkaniu pierwszego błędu, więc Vim nie wykona faktycznie makra dziewięćdziesiąt dziewięć razy.

## Uczenie się Wyszukiwania i Zastępowania w Mądry Sposób

Umiejętność dobrego wyszukiwania jest niezbędną umiejętnością w edytowaniu. Opanowanie wyszukiwania pozwala na wykorzystanie elastyczności wyrażeń regularnych do wyszukiwania dowolnego wzorca w pliku. Poświęć czas na naukę tych umiejętności. Aby poprawić swoje umiejętności w zakresie wyrażeń regularnych, musisz aktywnie korzystać z wyrażeń regularnych. Kiedyś przeczytałem książkę o wyrażeniach regularnych, nie robiąc tego, i zapomniałem prawie wszystko, co przeczytałem później. Aktywne kodowanie to najlepszy sposób na opanowanie jakiejkolwiek umiejętności.

Dobrym sposobem na poprawę umiejętności dopasowywania wzorców jest, gdy musisz wyszukać wzorzec (np. "hello 123"), zamiast zapytania o dosłowny termin wyszukiwania (`/hello 123`), spróbuj wymyślić wzorzec dla niego (coś w stylu `/\v(\l+) (\d+)`). Wiele z tych koncepcji wyrażeń regularnych ma również zastosowanie w ogólnym programowaniu, nie tylko podczas korzystania z Vima.

Teraz, gdy nauczyłeś się o zaawansowanym wyszukiwaniu i zastępowaniu w Vimie, nauczmy się jednego z najbardziej wszechstronnych poleceń, polecenia globalnego.