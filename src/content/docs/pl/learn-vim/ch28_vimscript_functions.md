---
description: Funkcje w Vimscript to kluczowy element abstrakcji. Dowiedz się, jak
  definiować i używać funkcji, przestrzegając zasad składni.
title: Ch28. Vimscript Functions
---

Funkcje są środkami abstrakcji, trzecim elementem w nauce nowego języka.

W poprzednich rozdziałach widziałeś natywne funkcje Vimscript (`len()`, `filter()`, `map()`, itd.) oraz funkcje niestandardowe w akcji. W tym rozdziale zagłębisz się, aby dowiedzieć się, jak działają funkcje.

## Zasady składni funkcji

W istocie funkcja Vimscript ma następującą składnię:

```shell
function {NazwaFunkcji}()
  {zrób-coś}
endfunction
```

Definicja funkcji musi zaczynać się od wielkiej litery. Zaczyna się od słowa kluczowego `function` i kończy na `endfunction`. Poniżej znajduje się poprawna funkcja:

```shell
function! Smaczne()
  echo "Smaczne"
endfunction
```

Poniższa definicja nie jest poprawną funkcją, ponieważ nie zaczyna się od wielkiej litery.

```shell
function smaczne()
  echo "Smaczne"
endfunction
```

Jeśli poprzedzisz funkcję zmienną skryptową (`s:`), możesz używać jej z małymi literami. `function s:smaczne()` jest poprawną nazwą. Powód, dla którego Vim wymaga użycia wielkiej litery, to zapobieganie pomyłkom z wbudowanymi funkcjami Vima (wszystkie małe litery).

Nazwa funkcji nie może zaczynać się od cyfry. `1Smaczne()` nie jest poprawną nazwą funkcji, ale `Smaczne1()` jest. Funkcja nie może również zawierać znaków niealfanumerycznych oprócz `_`. `Smaczne-jedzenie()`, `Smaczne&jedzenie()` i `Smaczne.jedzenie()` nie są poprawnymi nazwami funkcji. `Smaczne_jedzenie()` *jest*.

Jeśli zdefiniujesz dwie funkcje o tej samej nazwie, Vim zgłosi błąd, informując, że funkcja `Smaczne` już istnieje. Aby nadpisać poprzednią funkcję o tej samej nazwie, dodaj `!` po słowie kluczowym `function`.

```shell
function! Smaczne()
  echo "Smaczne"
endfunction
```

## Wyświetlanie dostępnych funkcji

Aby zobaczyć wszystkie wbudowane i niestandardowe funkcje w Vim, możesz uruchomić polecenie `:function`. Aby zobaczyć zawartość funkcji `Smaczne`, możesz uruchomić `:function Smaczne`.

Możesz również wyszukiwać funkcje z wzorcem za pomocą `:function /wzorzec`, podobnie jak w nawigacji wyszukiwania Vima (`/wzorzec`). Aby wyszukać wszystkie funkcje zawierające frazę "map", uruchom `:function /map`. Jeśli używasz zewnętrznych wtyczek, Vim wyświetli funkcje zdefiniowane w tych wtyczkach.

Jeśli chcesz sprawdzić, skąd pochodzi funkcja, możesz użyć polecenia `:verbose` z poleceniem `:function`. Aby zobaczyć, skąd pochodzą wszystkie funkcje zawierające słowo "map", uruchom:

```shell
:verbose function /map
```

Kiedy to uruchomiłem, otrzymałem kilka wyników. Ten mówi mi, że funkcja `fzf#vim#maps` autoload (aby przypomnieć, odwołaj się do rozdz. 23) jest napisana w pliku `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, w linii 1263. To jest przydatne do debugowania.

```shell
function fzf#vim#maps(mode, ...)
        Ostatnio ustawione w ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim linia 1263
```

## Usuwanie funkcji

Aby usunąć istniejącą funkcję, użyj `:delfunction {Nazwa_funkcji}`. Aby usunąć `Smaczne`, uruchom `:delfunction Smaczne`.

## Wartość zwracana funkcji

Aby funkcja zwróciła wartość, musisz przekazać jej wyraźną wartość `return`. W przeciwnym razie Vim automatycznie zwraca niejawnie wartość 0.

```shell
function! Smaczne()
  echo "Smaczne"
endfunction
```

Pusty `return` jest również równoważny wartości 0.

```shell
function! Smaczne()
  echo "Smaczne"
  return
endfunction
```

Jeśli uruchomisz `:echo Smaczne()` używając powyższej funkcji, po tym jak Vim wyświetli "Smaczne", zwróci 0, nieimplicitna wartość zwrotna. Aby `Smaczne()` zwróciło wartość "Smaczne", możesz to zrobić:

```shell
function! Smaczne()
  return "Smaczne"
endfunction
```

Teraz, gdy uruchomisz `:echo Smaczne()`, zwróci ciąg "Smaczne".

Możesz używać funkcji wewnątrz wyrażenia. Vim użyje wartości zwracanej przez tę funkcję. Wyrażenie `:echo Smaczne() . " Jedzenie!"` wyświetla "Smaczne Jedzenie!"

## Argumenty formalne

Aby przekazać argument formalny `jedzenie` do swojej funkcji `Smaczne`, możesz to zrobić:

```shell
function! Smaczne(jedzenie)
  return "Smaczne " . a:jedzenie
endfunction

echo Smaczne("ciastko")
" zwraca "Smaczne ciastko"
```

`a:` to jeden z zakresów zmiennych wspomnianych w poprzednim rozdziale. To zmienna parametru formalnego. To sposób Vima na uzyskanie wartości parametru formalnego w funkcji. Bez tego Vim zgłosi błąd:

```shell
function! Smaczne(jedzenie)
  return "Smaczne " . jedzenie
endfunction

echo Smaczne("makaron")
" zwraca "niezdefiniowana nazwa zmiennej" błąd
```

## Zmienna lokalna funkcji

Zajmijmy się inną zmienną, której nie nauczyłeś się w poprzednim rozdziale: zmienną lokalną funkcji (`l:`).

Pisząc funkcję, możesz zdefiniować zmienną wewnątrz:

```shell
function! Pyszne()
  let lokalizacja = "brzuch"
  return "Pyszne w moim " . lokalizacja
endfunction

echo Pyszne()
" zwraca "Pyszne w moim brzuchu"
```

W tym kontekście zmienna `lokalizacja` jest taka sama jak `l:lokalizacja`. Kiedy definiujesz zmienną w funkcji, ta zmienna jest *lokalna* dla tej funkcji. Kiedy użytkownik widzi `lokalizacja`, łatwo można to pomylić z zmienną globalną. Wolę być bardziej precyzyjny, więc wolę używać `l:`, aby wskazać, że to jest zmienna funkcji.

Innym powodem używania `l:licznik` jest to, że Vim ma specjalne zmienne z aliasami, które wyglądają jak zwykłe zmienne. `v:licznik` to jeden przykład. Ma alias `licznik`. W Vimie wywołanie `licznik` jest tym samym, co wywołanie `v:licznik`. Łatwo jest przypadkowo wywołać jedną z tych specjalnych zmiennych.

```shell
function! Kalorie()
  let licznik = "licznik"
  return "Nie liczę " . licznik . " moich kalorii"
endfunction

echo Kalorie()
" zgłasza błąd
```

Powyższe wykonanie zgłasza błąd, ponieważ `let licznik = "Licznik"` niejawnie próbuje zdefiniować na nowo specjalną zmienną Vima `v:licznik`. Przypomnij, że specjalne zmienne (`v:`) są tylko do odczytu. Nie możesz ich modyfikować. Aby to naprawić, użyj `l:licznik`:

```shell
function! Kalorie()
  let l:licznik = "licznik"
  return "Nie liczę " . l:licznik . " moich kalorii"
endfunction

echo Kalorie()
" zwraca "Nie liczę licznik moich kalorii"
```

## Wywoływanie funkcji

Vim ma polecenie `:call`, aby wywołać funkcję.

```shell
function! Smaczne(jedzenie)
  return "Smaczne " . a:jedzenie
endfunction

call Smaczne("sos")
```

Polecenie `call` nie wyświetla wartości zwracanej. Wywołajmy to z `echo`.

```shell
echo call Smaczne("sos")
```

Ups, otrzymujesz błąd. Polecenie `call` powyżej jest poleceniem wiersza poleceń (`:call`). Polecenie `echo` powyżej jest również poleceniem wiersza poleceń (`:echo`). Nie możesz wywołać polecenia wiersza poleceń z innym poleceniem wiersza poleceń. Spróbujmy innej wersji polecenia `call`:

```shell
echo call("Smaczne", ["sos"])
" zwraca "Smaczne sos"
```

Aby wyjaśnić wszelkie nieporozumienia, użyłeś właśnie dwóch różnych poleceń `call`: polecenia wiersza poleceń `:call` i funkcji `call()`. Funkcja `call()` przyjmuje jako pierwszy argument nazwę funkcji (ciąg) i jako drugi argument parametry formalne (lista).

Aby dowiedzieć się więcej o `:call` i `call()`, sprawdź `:h call()` i `:h :call`.

## Domyślny argument

Możesz dostarczyć parametr funkcji z domyślną wartością za pomocą `=`. Jeśli wywołasz `Sniadanie` z tylko jednym argumentem, argument `napój` użyje domyślnej wartości "mleko".

```shell
function! Sniadanie(posiłek, napój = "Mleko")
  return "Miałem " . a:posiłek . " i " . a:napój . " na śniadanie"
endfunction

echo Sniadanie("Ziemniaki")
" zwraca "Miałem ziemniaki i mleko na śniadanie"

echo Sniadanie("Płatki", "Sok pomarańczowy")
" zwraca "Miałem Płatki i Sok pomarańczowy na śniadanie"
```

## Argumenty zmienne

Możesz przekazać argument zmienny za pomocą trzech kropek (`...`). Argument zmienny jest przydatny, gdy nie wiesz, ile zmiennych użytkownik przekaże.

Załóżmy, że tworzysz bufet "wszystko, co możesz zjeść" (nigdy nie wiesz, ile jedzenia zje twój klient):

```shell
function! Bufet(...)
  return a:1
endfunction
```

Jeśli uruchomisz `echo Bufet("Makaron")`, wyświetli "Makaron". Vim używa `a:1`, aby wydrukować *pierwszy* argument przekazany do `...`, do 20 (`a:1` to pierwszy argument, `a:2` to drugi argument, itd.). Jeśli uruchomisz `echo Bufet("Makaron", "Sushi")`, nadal wyświetli tylko "Makaron", zaktualizujmy to:

```shell
function! Bufet(...)
  return a:1 . " " . a:2
endfunction

echo Bufet("Makaron", "Sushi")
" zwraca "Makaron Sushi"
```

Problem z tym podejściem polega na tym, że jeśli teraz uruchomisz `echo Bufet("Makaron")` (z tylko jedną zmienną), Vim narzeka, że ma niezdefiniowaną zmienną `a:2`. Jak możesz to uczynić wystarczająco elastycznym, aby wyświetlić dokładnie to, co użytkownik podaje?

Na szczęście Vim ma specjalną zmienną `a:0`, aby wyświetlić *liczbę* argumentów przekazanych do `...`.

```shell
function! Bufet(...)
  return a:0
endfunction

echo Bufet("Makaron")
" zwraca 1

echo Bufet("Makaron", "Sushi")
" zwraca 2

echo Bufet("Makaron", "Sushi", "Lody", "Tofu", "Mochi")
" zwraca 5
```

Dzięki temu możesz iterować, używając długości argumentu.

```shell
function! Bufet(...)
  let l:licznik_jedzenia = 1
  let l:jedzenie = ""
  while l:licznik_jedzenia <= a:0
    let l:jedzenie .= a:{l:licznik_jedzenia} . " "
    let l:licznik_jedzenia += 1
  endwhile
  return l:jedzenie
endfunction
```

Klasyczne nawiasy `a:{l:licznik_jedzenia}` to interpolacja ciągu, używa wartości licznika `licznik_jedzenia`, aby wywołać argumenty formalne `a:1`, `a:2`, `a:3`, itd.

```shell
echo Bufet("Makaron")
" zwraca "Makaron"

echo Bufet("Makaron", "Sushi", "Lody", "Tofu", "Mochi")
" zwraca wszystko, co podałeś: "Makaron Sushi Lody Tofu Mochi"
```

Argument zmienny ma jeszcze jedną specjalną zmienną: `a:000`. Ma wartość wszystkich argumentów zmiennych w formacie listy.

```shell
function! Bufet(...)
  return a:000
endfunction

echo Bufet("Makaron")
" zwraca ["Makaron"]

echo Bufet("Makaron", "Sushi", "Lody", "Tofu", "Mochi")
" zwraca ["Makaron", "Sushi", "Lody", "Tofu", "Mochi"]
```

Zrefaktoryzujmy funkcję, aby użyć pętli `for`:

```shell
function! Bufet(...)
  let l:jedzenie = ""
  for pozycja_jedzenia in a:000
    let l:jedzenie .= pozycja_jedzenia . " "
  endfor
  return l:jedzenie
endfunction

echo Bufet("Makaron", "Sushi", "Lody", "Tofu", "Mochi")
" zwraca Makaron Sushi Lody Tofu Mochi
```
## Zakres

Możesz zdefiniować funkcję Vimscript *z zakresem* dodając słowo kluczowe `range` na końcu definicji funkcji. Funkcja z zakresem ma dostępne dwie specjalne zmienne: `a:firstline` i `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Jeśli jesteś na linii 100 i uruchomisz `call Breakfast()`, wyświetli 100 zarówno dla `firstline`, jak i `lastline`. Jeśli wizualnie zaznaczysz (`v`, `V` lub `Ctrl-V`) linie od 101 do 105 i uruchomisz `call Breakfast()`, `firstline` wyświetli 101, a `lastline` wyświetli 105. `firstline` i `lastline` wyświetlają minimalny i maksymalny zakres, w którym funkcja jest wywoływana.

Możesz także użyć `:call` i przekazać zakres. Jeśli uruchomisz `:11,20call Breakfast()`, wyświetli 11 dla `firstline` i 20 dla `lastline`.

Możesz zapytać: "To miłe, że funkcja Vimscript akceptuje zakres, ale czy nie mogę uzyskać numeru linii za pomocą `line(".")`? Czy to nie zrobiłoby tego samego?"

Dobre pytanie. Jeśli to masz na myśli:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Wywołanie `:11,20call Breakfast()` wykonuje funkcję `Breakfast` 10 razy (raz dla każdej linii w zakresie). Porównaj to z przekazaniem argumentu `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Wywołanie `11,20call Breakfast()` wykonuje funkcję `Breakfast` *raz*.

Jeśli przekażesz słowo kluczowe `range` i przekażesz zakres numeryczny (jak `11,20`) w `call`, Vim wykonuje tę funkcję tylko raz. Jeśli nie przekażesz słowa kluczowego `range` i przekażesz zakres numeryczny (jak `11,20`) w `call`, Vim wykonuje tę funkcję N razy w zależności od zakresu (w tym przypadku N = 10).

## Słownik

Możesz dodać funkcję jako element słownika, dodając słowo kluczowe `dict` podczas definiowania funkcji.

Jeśli masz funkcję `SecondBreakfast`, która zwraca dowolny element `breakfast`, który masz:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Dodajmy tę funkcję do słownika `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" zwraca "pancakes"
```

Z słowem kluczowym `dict`, zmienna kluczowa `self` odnosi się do słownika, w którym funkcja jest przechowywana (w tym przypadku do słownika `meals`). Wyrażenie `self.breakfast` jest równe `meals.breakfast`.

Alternatywnym sposobem dodania funkcji do obiektu słownika jest użycie przestrzeni nazw.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" zwraca "pasta"
```

Z przestrzenią nazw nie musisz używać słowa kluczowego `dict`.

## Funcref

Funcref to odniesienie do funkcji. Jest to jeden z podstawowych typów danych Vimscript, o którym mowa w rozdziale 24.

Wyrażenie `function("SecondBreakfast")` powyżej jest przykładem funcref. Vim ma wbudowaną funkcję `function()`, która zwraca funcref, gdy przekażesz jej nazwę funkcji (ciąg).

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" zwraca błąd

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" zwraca "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" zwraca "I am having pancake for breakfast"
```

W Vim, jeśli chcesz przypisać funkcję do zmiennej, nie możesz po prostu przypisać jej bezpośrednio, jak `let MyVar = MyFunc`. Musisz użyć funkcji `function()`, jak `let MyVar = function("MyFunc")`.

Możesz używać funcref z mapami i filtrami. Zauważ, że mapy i filtry przekażą indeks jako pierwszy argument, a iterowaną wartość jako drugi argument.

```shell
function! Breakfast(index, item)
  return "I am having " . a:item . " for breakfast"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Lepszym sposobem na użycie funkcji w mapach i filtrach jest użycie wyrażenia lambda (czasami znanego jako funkcja bez nazwy). Na przykład:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" zwraca 3

let Tasty = { -> 'tasty'}
echo Tasty()
" zwraca "tasty"
```

Możesz wywołać funkcję z wnętrza wyrażenia lambda:

```shell
function! Lunch(item)
  return "I am having " . a:item . " for lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Jeśli nie chcesz wywoływać funkcji z wnętrza lambda, możesz ją zrefaktoryzować:

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## Łańcuchowanie metod

Możesz łączyć kilka funkcji Vimscript i wyrażeń lambda sekwencyjnie za pomocą `->`. Pamiętaj, że `->` musi być poprzedzone nazwą metody *bez spacji*.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Aby przekonwertować liczbę zmiennoprzecinkową na liczbę za pomocą łańcuchowania metod:

```shell
echo 3.14->float2nr()
" zwraca 3
```

Zróbmy bardziej skomplikowany przykład. Załóżmy, że musisz zamienić pierwszą literę każdego elementu na liście na wielką literę, a następnie posortować listę, a następnie połączyć listę, aby utworzyć ciąg.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" zwraca "Antipasto, Bruschetta, Calzone"
```

Dzięki łańcuchowaniu metod sekwencja jest łatwiejsza do odczytania i zrozumienia. Mogę tylko rzucić okiem na `dinner_items->CapitalizeList()->sort()->join(", ")` i dokładnie wiedzieć, co się dzieje.

## Zamknięcie

Kiedy definiujesz zmienną wewnątrz funkcji, ta zmienna istnieje w granicach tej funkcji. Nazywa się to zakresem leksykalnym.

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` jest zdefiniowane wewnątrz funkcji `Lunch`, która zwraca funcref `SecondLunch`. Zauważ, że `SecondLunch` używa `appetizer`, ale w Vimscript nie ma dostępu do tej zmiennej. Jeśli spróbujesz uruchomić `echo Lunch()()`, Vim zgłosi błąd niezdefiniowanej zmiennej.

Aby naprawić ten problem, użyj słowa kluczowego `closure`. Zrefaktoryzujmy:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Teraz, jeśli uruchomisz `echo Lunch()()`, Vim zwróci "shrimp".

## Ucz się funkcji Vimscript w inteligentny sposób

W tym rozdziale nauczyłeś się anatomii funkcji Vim. Nauczyłeś się, jak używać różnych specjalnych słów kluczowych `range`, `dict` i `closure`, aby zmodyfikować zachowanie funkcji. Nauczyłeś się także, jak używać lambdy i łączyć wiele funkcji razem. Funkcje są ważnymi narzędziami do tworzenia złożonych abstrakcji.

Teraz połączmy wszystko, czego się nauczyłeś, aby stworzyć własny plugin.