---
description: Dokument przedstawia różnice między zmiennymi mutowalnymi a niemutowalnymi
  w Vim, omawiając ich źródła, zakresy oraz sposób przypisywania wartości.
title: Ch27. Vimscript Variable Scopes
---

Zanim zanurzymy się w funkcje Vimscript, poznajmy różne źródła i zakresy zmiennych Vim.

## Zmienne Mutowalne i Niemutowalne

Możesz przypisać wartość do zmiennej w Vim za pomocą `let`:

```shell
let pancake = "pancake"
```

Później możesz wywołać tę zmienną w dowolnym momencie.

```shell
echo pancake
" zwraca "pancake"
```

`let` jest mutowalne, co oznacza, że możesz zmienić wartość w dowolnym momencie w przyszłości.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" zwraca "not waffles"
```

Zauważ, że gdy chcesz zmienić wartość ustawionej zmiennej, nadal musisz użyć `let`.

```shell
let beverage = "milk"

beverage = "orange juice"
" zgłasza błąd
```

Możesz zdefiniować zmienną niemutowalną za pomocą `const`. Będąc niemutowalną, po przypisaniu wartości do zmiennej, nie możesz przypisać jej innej wartości.

```shell
const waffle = "waffle"
const waffle = "pancake"
" zgłasza błąd
```

## Źródła Zmiennych

Istnieją trzy źródła dla zmiennych: zmienna środowiskowa, zmienna opcji i zmienna rejestru.

### Zmienna Środowiskowa

Vim może uzyskać dostęp do zmiennej środowiskowej twojego terminala. Na przykład, jeśli masz zmienną środowiskową `SHELL` dostępną w swoim terminalu, możesz uzyskać do niej dostęp z Vima za pomocą:

```shell
echo $SHELL
" zwraca wartość $SHELL. W moim przypadku zwraca /bin/bash
```

### Zmienna Opcji

Możesz uzyskać dostęp do opcji Vima za pomocą `&` (są to ustawienia, do których uzyskujesz dostęp za pomocą `set`).

Na przykład, aby zobaczyć, jakie tło używa Vim, możesz uruchomić:

```shell
echo &background
" zwraca "light" lub "dark"
```

Alternatywnie, zawsze możesz uruchomić `set background?`, aby zobaczyć wartość opcji `background`.

### Zmienna Rejestru

Możesz uzyskać dostęp do rejestrów Vima (Rozdz. 08) za pomocą `@`.

Załóżmy, że wartość "chocolate" jest już zapisana w rejestrze a. Aby uzyskać do niej dostęp, możesz użyć `@a`. Możesz również ją zaktualizować za pomocą `let`.

```shell
echo @a
" zwraca chocolate

let @a .= " donut"

echo @a
" zwraca "chocolate donut"
```

Teraz, gdy wkleisz z rejestru `a` (`"ap`), zwróci "chocolate donut". Operator `.=` konkatenatuje dwa ciągi. Wyrażenie `let @a .= " donut"` jest takie samo jak `let @a = @a . " donut"`

## Zakresy Zmiennych

Istnieje 9 różnych zakresów zmiennych w Vim. Możesz je rozpoznać po ich wstępnym znaku:

```shell
g:           Zmienna globalna
{nic}       Zmienna globalna
b:           Zmienna lokalna w buforze
w:           Zmienna lokalna w oknie
t:           Zmienna lokalna w karcie
s:           Zmienna skryptowa Vimscript
l:           Zmienna lokalna funkcji
a:           Zmienna formalna funkcji
v:           Wbudowana zmienna Vima
```

### Zmienna Globalna

Kiedy deklarujesz "zwykłą" zmienną:

```shell
let pancake = "pancake"
```

`pancake` jest w rzeczywistości zmienną globalną. Kiedy definiujesz zmienną globalną, możesz je wywołać z dowolnego miejsca.

Dodanie `g:` do zmiennej również tworzy zmienną globalną.

```shell
let g:waffle = "waffle"
```

W tym przypadku zarówno `pancake`, jak i `g:waffle` mają ten sam zakres. Możesz wywołać każdą z nich z lub bez `g:`.

```shell
echo pancake
" zwraca "pancake"

echo g:pancake
" zwraca "pancake"

echo waffle
" zwraca "waffle"

echo g:waffle
" zwraca "waffle"
```

### Zmienna Bufora

Zmienna poprzedzona `b:` jest zmienną bufora. Zmienna bufora jest zmienną, która jest lokalna dla bieżącego bufora (Rozdz. 02). Jeśli masz otwarte wiele buforów, każdy bufor będzie miał swoją własną oddzielną listę zmiennych bufora.

W buforze 1:

```shell
const b:donut = "chocolate donut"
```

W buforze 2:

```shell
const b:donut = "blueberry donut"
```

Jeśli uruchomisz `echo b:donut` z bufora 1, zwróci "chocolate donut". Jeśli uruchomisz to z bufora 2, zwróci "blueberry donut".

Na marginesie, Vim ma *specjalną* zmienną bufora `b:changedtick`, która śledzi wszystkie zmiany dokonane w bieżącym buforze.

1. Uruchom `echo b:changedtick` i zanotuj liczbę, którą zwraca.
2. Wprowadź zmiany w Vim.
3. Uruchom `echo b:changedtick` ponownie i zanotuj liczbę, którą teraz zwraca.

### Zmienna Okna

Zmienna poprzedzona `w:` jest zmienną okna. Istnieje tylko w tym oknie.

W oknie 1:

```shell
const w:donut = "chocolate donut"
```

W oknie 2:

```shell
const w:donut = "raspberry donut"
```

W każdym oknie możesz wywołać `echo w:donut`, aby uzyskać unikalne wartości.

### Zmienna Karty

Zmienna poprzedzona `t:` jest zmienną karty. Istnieje tylko w tej karcie.

W karcie 1:

```shell
const t:donut = "chocolate donut"
```

W karcie 2:

```shell
const t:donut = "blackberry donut"
```

W każdej karcie możesz wywołać `echo t:donut`, aby uzyskać unikalne wartości.

### Zmienna Skryptowa

Zmienna poprzedzona `s:` jest zmienną skryptową. Te zmienne mogą być dostępne tylko z wnętrza tego skryptu.

Jeśli masz dowolny plik `dozen.vim` i w środku masz:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " pozostało"
endfunction
```

Załaduj plik za pomocą `:source dozen.vim`. Teraz wywołaj funkcję `Consume`:

```shell
:call Consume()
" zwraca "11 pozostało"

:call Consume()
" zwraca "10 pozostało"

:echo s:dozen
" Błąd: niezdefiniowana zmienna
```

Kiedy wywołujesz `Consume`, widzisz, że zmniejsza wartość `s:dozen` zgodnie z oczekiwaniami. Kiedy próbujesz uzyskać wartość `s:dozen` bezpośrednio, Vim jej nie znajdzie, ponieważ jesteś poza zakresem. `s:dozen` jest dostępna tylko z wnętrza `dozen.vim`.

Za każdym razem, gdy ładujesz plik `dozen.vim`, resetuje licznik `s:dozen`. Jeśli jesteś w trakcie zmniejszania wartości `s:dozen` i uruchomisz `:source dozen.vim`, licznik resetuje się z powrotem do 12. Może to być problem dla nieświadomych użytkowników. Aby rozwiązać ten problem, przekształć kod:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Teraz, gdy ładujesz `dozen.vim`, będąc w trakcie zmniejszania, Vim odczytuje `!exists("s:dozen")`, stwierdza, że jest to prawda i nie resetuje wartości z powrotem do 12.

### Zmienna Lokalna Funkcji i Zmienna Formalna Funkcji

Zarówno zmienna lokalna funkcji (`l:`), jak i zmienna formalna funkcji (`a:`) będą omówione w następnym rozdziale.

### Wbudowane Zmienne Vima

Zmienna poprzedzona `v:` jest specjalną wbudowaną zmienną Vima. Nie możesz definiować tych zmiennych. Niektóre z nich już widziałeś.
- `v:version` mówi, jaką wersję Vima używasz.
- `v:key` zawiera bieżącą wartość elementu podczas iteracji przez słownik.
- `v:val` zawiera bieżącą wartość elementu podczas wykonywania operacji `map()` lub `filter()`.
- `v:true`, `v:false`, `v:null` i `v:none` to specjalne typy danych.

Istnieją inne zmienne. Aby uzyskać listę wbudowanych zmiennych Vima, sprawdź `:h vim-variable` lub `:h v:`.

## Używanie Zakresów Zmiennych Vima w Inteligentny Sposób

Możliwość szybkiego dostępu do zmiennych środowiskowych, opcji i rejestrów daje ci dużą elastyczność w dostosowywaniu swojego edytora i środowiska terminalowego. Dowiedziałeś się również, że Vim ma 9 różnych zakresów zmiennych, z których każdy istnieje pod pewnymi ograniczeniami. Możesz skorzystać z tych unikalnych typów zmiennych, aby odseparować swój program.

Dotarłeś aż tutaj. Dowiedziałeś się o typach danych, sposobach łączenia i zakresach zmiennych. Pozostała tylko jedna rzecz: funkcje.