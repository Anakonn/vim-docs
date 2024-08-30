---
description: Niniejszy dokument przedstawia różne tryby wizualne w Vimie, umożliwiające
  efektywne manipulowanie tekstem poprzez zaznaczanie i wprowadzanie zmian.
title: Ch11. Visual Mode
---

Podświetlanie i stosowanie zmian w tekście to powszechna funkcja w wielu edytorach tekstu i procesorach tekstu. Vim potrafi to zrobić, używając trybu wizualnego. W tym rozdziale nauczysz się, jak efektywnie manipulować tekstami za pomocą trybu wizualnego.

## Trzy rodzaje trybów wizualnych

Vim ma trzy różne tryby wizualne. Są to:

```shell
v         Tryb wizualny na poziomie znaków
V         Tryb wizualny na poziomie linii
Ctrl-V    Tryb wizualny na poziomie bloków
```

Jeśli masz tekst:

```shell
one
two
three
```

Tryb wizualny na poziomie znaków działa na pojedynczych znakach. Naciśnij `v` na pierwszym znaku. Następnie przejdź w dół do następnej linii za pomocą `j`. Podświetla cały tekst od "one" do miejsca kursora. Jeśli naciśniesz `gU`, Vim zamienia podświetlone znaki na wielkie litery.

Tryb wizualny na poziomie linii działa na liniach. Naciśnij `V` i zobacz, jak Vim wybiera całą linię, na której znajduje się kursor. Tak jak w trybie wizualnym na poziomie znaków, jeśli uruchomisz `gU`, Vim zamienia podświetlone znaki na wielkie litery.

Tryb wizualny na poziomie bloków działa na wierszach i kolumnach. Daje ci więcej swobody ruchu niż dwa pozostałe tryby. Jeśli naciśniesz `Ctrl-V`, Vim podświetli znak pod kursorem, tak jak w trybie wizualnym na poziomie znaków, z tą różnicą, że zamiast podświetlać każdy znak aż do końca linii przed przejściem do następnej linii, przechodzi do następnej linii z minimalnym podświetleniem. Spróbuj poruszać się za pomocą `h/j/k/l` i obserwuj ruch kursora.

W lewym dolnym rogu okna Vima zobaczysz `-- VISUAL --`, `-- VISUAL LINE --` lub `-- VISUAL BLOCK --`, co wskazuje, w którym trybie wizualnym się znajdujesz.

Będąc w trybie wizualnym, możesz przełączyć się na inny tryb wizualny, naciskając `v`, `V` lub `Ctrl-V`. Na przykład, jeśli jesteś w trybie wizualnym na poziomie linii i chcesz przełączyć się na tryb wizualny na poziomie bloków, uruchom `Ctrl-V`. Spróbuj!

Istnieją trzy sposoby na wyjście z trybu wizualnego: `<Esc>`, `Ctrl-C` oraz ten sam klawisz, co twój aktualny tryb wizualny. Oznacza to, że jeśli obecnie jesteś w trybie wizualnym na poziomie linii (`V`), możesz z niego wyjść, naciskając `V` ponownie. Jeśli jesteś w trybie wizualnym na poziomie znaków, możesz z niego wyjść, naciskając `v`.

Jest jeszcze jeden sposób na wejście w tryb wizualny:

```shell
gv    Przejdź do poprzedniego trybu wizualnego
```

Rozpocznie to ten sam tryb wizualny na tym samym podświetlonym bloku tekstu, co ostatnio.

## Nawigacja w trybie wizualnym

Będąc w trybie wizualnym, możesz rozszerzyć podświetlony blok tekstu za pomocą ruchów Vima.

Użyjmy tego samego tekstu, którego używałeś wcześniej:

```shell
one
two
three
```

Tym razem zacznijmy od linii "two". Naciśnij `v`, aby przejść do trybu wizualnego na poziomie znaków (tutaj kwadratowe nawiasy `[]` reprezentują podświetlenia znaków):

```shell
one
[t]wo
three
```

Naciśnij `j`, a Vim podświetli cały tekst od linii "two" w dół do pierwszego znaku linii "three".

```shell
one
[two
t]hree
```

Załóżmy, że z tej pozycji chcesz dodać również linię "one". Jeśli naciśniesz `k`, ku swojemu zaskoczeniu, podświetlenie przesunie się z linii "three". 

```shell
one
[t]wo
three
```

Czy jest sposób, aby swobodnie rozszerzyć wybór wizualny w dowolnym kierunku? Zdecydowanie. Cofnijmy się trochę do momentu, gdy masz podświetlone linie "two" i "three".

```shell
one
[two
t]hree    <-- kursor
```

Podświetlenie wizualne podąża za ruchem kursora. Jeśli chcesz rozszerzyć je w górę do linii "one", musisz przesunąć kursor w górę do linii "two". Teraz kursor znajduje się na linii "three". Możesz przełączać lokalizację kursora za pomocą `o` lub `O`.

```shell
one
[two     <-- kursor
t]hree
```

Teraz, gdy naciśniesz `k`, nie zmniejsza już wyboru, ale rozszerza go w górę.

```shell
[one
two
t]hree
```

Z `o` lub `O` w trybie wizualnym kursor przeskakuje z początku do końca podświetlonego bloku, co pozwala ci rozszerzyć obszar podświetlenia.

## Gramatyka trybu wizualnego

Tryb wizualny dzieli wiele operacji z trybem normalnym.

Na przykład, jeśli masz następujący tekst i chcesz usunąć pierwsze dwie linie z trybu wizualnego:

```shell
one
two
three
```

Podświetl linie "one" i "two" w trybie wizualnym na poziomie linii (`V`):

```shell
[one
two]
three
```

Naciśnięcie `d` usunie wybór, podobnie jak w trybie normalnym. Zauważ, że zasada gramatyczna z trybu normalnego, czasownik + rzeczownik, nie ma zastosowania. Ten sam czasownik nadal tam jest (`d`), ale nie ma rzeczownika w trybie wizualnym. Zasada gramatyczna w trybie wizualnym to rzeczownik + czasownik, gdzie rzeczownikiem jest podświetlony tekst. Najpierw wybierz blok tekstu, a następnie wykonaj polecenie.

W trybie normalnym istnieją niektóre polecenia, które nie wymagają ruchu, takie jak `x` do usunięcia pojedynczego znaku pod kursorem i `r` do zastąpienia znaku pod kursorem (`rx` zastępuje znak pod kursorem znakiem "x"). W trybie wizualnym te polecenia są teraz stosowane do całego podświetlonego tekstu zamiast pojedynczego znaku. Wracając do podświetlonego tekstu:

```shell
[one
two]
three
```

Uruchomienie `x` usuwa wszystkie podświetlone teksty.

Możesz użyć tego zachowania, aby szybko utworzyć nagłówek w tekście markdown. Załóżmy, że musisz szybko zamienić następujący tekst w nagłówek markdown pierwszego poziomu ("==="):

```shell
Chapter One
```

Najpierw skopiuj tekst za pomocą `yy`, a następnie wklej go za pomocą `p`:

```shell
Chapter One
Chapter One
```

Teraz przejdź do drugiej linii i wybierz ją w trybie wizualnym na poziomie linii:

```shell
Chapter One
[Chapter One]
```

Nagłówek pierwszego poziomu to seria "=" poniżej tekstu. Uruchom `r=`, voila! To oszczędza ci ręcznego wpisywania "=".

```shell
Chapter One
===========
```

Aby dowiedzieć się więcej o operatorach w trybie wizualnym, sprawdź `:h visual-operators`.

## Tryb wizualny i polecenia wiersza poleceń

Możesz selektywnie stosować polecenia wiersza poleceń na podświetlonym bloku tekstu. Jeśli masz te instrukcje i chcesz zastąpić "const" "let" tylko w pierwszych dwóch liniach:

```shell
const one = "one";
const two = "two";
const three = "three";
```

Podświetl pierwsze dwie linie w *dowolnym* trybie wizualnym i uruchom polecenie zastąpienia `:s/const/let/g`:

```shell
let one = "one";
let two = "two";
const three = "three";
```

Zauważ, że powiedziałem, że możesz to zrobić w *dowolnym* trybie wizualnym. Nie musisz podświetlać całej linii, aby uruchomić polecenie na tej linii. Tak długo, jak wybierzesz przynajmniej jeden znak w każdej linii, polecenie zostanie zastosowane.

## Dodawanie tekstu w wielu liniach

Możesz dodać tekst w wielu liniach w Vimie, używając trybu wizualnego na poziomie bloków. Jeśli musisz dodać średnik na końcu każdej linii:

```shell
const one = "one"
const two = "two"
const three = "three"
```

Z kursorem na pierwszej linii:
- Uruchom tryb wizualny na poziomie bloków i przejdź w dół o dwie linie (`Ctrl-V jj`).
- Podświetl do końca linii (`$`).
- Dodaj (`A`), a następnie wpisz ";".
- Wyjdź z trybu wizualnego (`<Esc>`).

Powinieneś teraz zobaczyć dodany ";" na każdej linii. Całkiem fajnie! Istnieją dwa sposoby na wejście w tryb wstawiania z trybu wizualnego na poziomie bloków: `A`, aby wprowadzić tekst po kursorem lub `I`, aby wprowadzić tekst przed kursorem. Nie myl ich z `A` (dodaj tekst na końcu linii) i `I` (wstaw tekst przed pierwszą niepustą linią) z trybu normalnego.

Alternatywnie, możesz również użyć polecenia `:normal`, aby dodać tekst w wielu liniach:
- Podświetl wszystkie 3 linie (`vjj`).
- Wpisz `:normal! A;`.

Pamiętaj, że polecenie `:normal` wykonuje polecenia z trybu normalnego. Możesz nakazać mu uruchomienie `A;`, aby dodać tekst ";" na końcu linii.

## Inkrementacja liczb

Vim ma polecenia `Ctrl-X` i `Ctrl-A` do dekrementacji i inkrementacji liczb. Gdy są używane z trybem wizualnym, możesz inkrementować liczby w wielu liniach.

Jeśli masz te elementy HTML:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

To zła praktyka, aby mieć kilka identyfikatorów o tej samej nazwie, więc zwiększmy je, aby były unikalne:
- Przesuń kursor na "1" w drugiej linii.
- Rozpocznij tryb wizualny na poziomie bloków i przejdź w dół o 3 linie (`Ctrl-V 3j`). To podświetli pozostałe "1". Teraz wszystkie "1" powinny być podświetlone (z wyjątkiem pierwszej linii).
- Uruchom `g Ctrl-A`.

Powinieneś zobaczyć ten wynik:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` inkrementuje liczby w wielu liniach. `Ctrl-X/Ctrl-A` może również inkrementować litery, z opcją formatów liczbowych:

```shell
set nrformats+=alpha
```

Opcja `nrformats` instruuje Vima, które podstawy są uważane za "liczby" dla `Ctrl-A` i `Ctrl-X`, aby je inkrementować i dekrementować. Dodając `alpha`, znak alfabetyczny jest teraz uważany za liczbę. Jeśli masz następujące elementy HTML:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Umieść kursor na drugim "app-a". Użyj tej samej techniki, co powyżej (`Ctrl-V 3j`, a następnie `g Ctrl-A`), aby inkrementować identyfikatory.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Wybieranie ostatniego obszaru trybu wizualnego

Wcześniej w tym rozdziale wspomniałem, że `gv` może szybko podświetlić ostatnie podświetlenie trybu wizualnego. Możesz również przejść do lokalizacji początku i końca ostatniego podświetlenia trybu wizualnego za pomocą tych dwóch specjalnych znaczników:

```shell
`<    Przejdź do pierwszego miejsca poprzedniego podświetlenia trybu wizualnego
`>    Przejdź do ostatniego miejsca poprzedniego podświetlenia trybu wizualnego
```

Wcześniej wspomniałem również, że możesz selektywnie wykonywać polecenia wiersza poleceń na podświetlonym tekście, takie jak `:s/const/let/g`. Kiedy to zrobiłeś, zobaczysz to poniżej:

```shell
:`<,`>s/const/let/g
```

W rzeczywistości wykonywałeś polecenie `s/const/let/g` *w zakresie* (z dwoma znacznikami jako adresami). Interesujące!

Możesz zawsze edytować te znaczniki, kiedy tylko chcesz. Jeśli zamiast tego potrzebujesz zastąpić tekst od początku podświetlonego tekstu do końca pliku, wystarczy zmienić polecenie na:

```shell
:`<,$s/const/let/g
```

## Wchodzenie w tryb wizualny z trybu wstawiania

Możesz również wejść w tryb wizualny z trybu wstawiania. Aby przejść do trybu wizualnego na poziomie znaków, będąc w trybie wstawiania:

```shell
Ctrl-O v
```

Przypomnij, że uruchomienie `Ctrl-O` podczas w trybie wstawiania pozwala ci wykonać polecenie z trybu normalnego. Będąc w tym trybie oczekiwania na polecenie z trybu normalnego, uruchom `v`, aby wejść w tryb wizualny na poziomie znaków. Zauważ, że w lewym dolnym rogu ekranu widnieje `--(insert) VISUAL--`. Ta sztuczka działa z każdym operatorem trybu wizualnego: `v`, `V` i `Ctrl-V`.

## Tryb wyboru

Vim ma tryb podobny do trybu wizualnego, zwany trybem wyboru. Podobnie jak tryb wizualny, ma również trzy różne tryby:

```shell
gh         Tryb wyboru na poziomie znaków
gH         Tryb wyboru na poziomie linii
gCtrl-h    Tryb wyboru na poziomie bloków
```

Tryb wyboru emuluje zachowanie podświetlania tekstu w zwykłym edytorze bardziej niż tryb wizualny Vima.

W zwykłym edytorze, po podświetleniu bloku tekstu i wpisaniu litery, powiedzmy litery "y", usunie to podświetlony tekst i wstawi literę "y". Jeśli podświetlisz linię w trybie wyboru na poziomie linii (`gH`) i wpiszesz "y", usunie to podświetlony tekst i wstawi literę "y".

Porównaj ten tryb wyboru z trybem wizualnym: jeśli podświetlisz linię tekstu w trybie wizualnym na poziomie linii (`V`) i wpiszesz "y", podświetlony tekst nie zostanie usunięty i zastąpiony dosłowną literą "y", zostanie skopiowany. Nie możesz wykonywać poleceń z trybu normalnego na podświetlonym tekście w trybie wyboru.

Osobiście nigdy nie używałem trybu wyboru, ale dobrze wiedzieć, że istnieje.

## Ucz się trybu wizualnego w mądry sposób

Tryb wizualny to reprezentacja procedury podświetlania tekstu w Vimie.

Jeśli zauważysz, że używasz operacji w trybie wizualnym znacznie częściej niż operacji w trybie normalnym, bądź ostrożny. To jest antywzorzec. Wykonanie operacji w trybie wizualnym wymaga więcej naciśnięć klawiszy niż jej odpowiednik w trybie normalnym. Na przykład, jeśli musisz usunąć wewnętrzne słowo, dlaczego używać czterech naciśnięć klawiszy, `viwd` (