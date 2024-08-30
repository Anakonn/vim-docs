---
description: Naucz się podstawowych ruchów w Vim, aby szybko poruszać się po plikach.
  Odkryj efektywne nawyki, które zwiększą Twoją produktywność.
title: Ch05. Moving in a File
---

Na początku poruszanie się za pomocą klawiatury wydaje się wolne i niezgrabne, ale nie poddawaj się! Gdy się do tego przyzwyczaisz, możesz poruszać się po pliku szybciej niż używając myszy.

W tym rozdziale nauczysz się podstawowych ruchów i jak ich efektywnie używać. Pamiętaj, że to **nie** są wszystkie ruchy, które oferuje Vim. Celem jest wprowadzenie przydatnych ruchów, aby szybko stać się produktywnym. Jeśli chcesz dowiedzieć się więcej, sprawdź `:h motion.txt`.

## Nawigacja po znakach

Najbardziej podstawową jednostką ruchu jest przesunięcie o jeden znak w lewo, w dół, w górę i w prawo.

```shell
h   W lewo
j   W dół
k   W górę
l   W prawo
gj  W dół w miękko zawiniętej linii
gk  W górę w miękko zawiniętej linii
```

Możesz również poruszać się za pomocą strzałek kierunkowych. Jeśli dopiero zaczynasz, śmiało używaj dowolnej metody, z którą czujesz się najwygodniej.

Preferuję `hjkl`, ponieważ moja prawa ręka może pozostać na domowej linii. Dzięki temu mam krótszy zasięg do otaczających klawiszy. Aby przyzwyczaić się do `hjkl`, faktycznie wyłączyłem przyciski strzałek na początku, dodając te linie do `~/.vimrc`:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Są również wtyczki, które pomagają przełamać ten zły nawyk. Jedną z nich jest [vim-hardtime](https://github.com/takac/vim-hardtime). Ku mojemu zaskoczeniu, przyzwyczaiłem się do `hjkl` w mniej niż tydzień.

Jeśli zastanawiasz się, dlaczego Vim używa `hjkl` do poruszania się, to dlatego, że terminal Lear-Siegler ADM-3A, w którym Bill Joy napisał Vi, nie miał klawiszy strzałek i używał `hjkl` jako lewo/dół/góra/prawo.*

## Numeracja względna

Uważam, że pomocne jest ustawienie `number` i `relativenumber`. Możesz to zrobić, dodając to do `.vimrc`:

```shell
set relativenumber number
```

To wyświetla mój aktualny numer linii oraz numery linii względnych.

Łatwo zrozumieć, dlaczego posiadanie numeru w lewej kolumnie jest przydatne, ale niektórzy z was mogą zapytać, jak posiadanie numerów względnych w lewej kolumnie może być użyteczne. Posiadanie numeru względnego pozwala mi szybko zobaczyć, ile linii dzieli mój kursor od docelowego tekstu. Dzięki temu mogę łatwo zauważyć, że mój docelowy tekst znajduje się 12 linii poniżej mnie, więc mogę wykonać `d12j`, aby je usunąć. W przeciwnym razie, jeśli jestem na linii 69, a mój cel jest na linii 81, muszę wykonać obliczenia mentalne (81 - 69 = 12). Robienie matematyki podczas edytowania zajmuje zbyt dużo zasobów mentalnych. Im mniej muszę myśleć o tym, gdzie muszę iść, tym lepiej.

To jest 100% kwestia osobistych preferencji. Eksperymentuj z `relativenumber` / `norelativenumber`, `number` / `nonumber` i używaj tego, co uważasz za najbardziej przydatne!

## Licz swoje ruchy

Porozmawiajmy o argumencie "licz". Ruchy w Vim akceptują poprzedzający argument liczbowy. Wspomniałem wcześniej, że możesz zejść 12 linii w dół za pomocą `12j`. Liczba 12 w `12j` to liczba.

Składnia do użycia liczby z ruchem to:

```shell
[count] + motion
```

Możesz to zastosować do wszystkich ruchów. Jeśli chcesz przesunąć się o 9 znaków w prawo, zamiast naciskać `l` 9 razy, możesz użyć `9l`.

## Nawigacja po słowach

Przejdźmy do większej jednostki ruchu: *słowo*. Możesz przejść do początku następnego słowa (`w`), do końca następnego słowa (`e`), do początku poprzedniego słowa (`b`) oraz do końca poprzedniego słowa (`ge`).

Dodatkowo istnieje *WORD*, różniące się od słowa. Możesz przejść do początku następnego WORD (`W`), do końca następnego WORD (`E`), do początku poprzedniego WORD (`B`) oraz do końca poprzedniego WORD (`gE`). Aby łatwiej zapamiętać, WORD używa tych samych liter co słowo, tylko w wersji wielkiej.

```shell
w     Przesuń się do początku następnego słowa
W     Przesuń się do początku następnego WORD
e     Przesuń się o jedno słowo do końca następnego słowa
E     Przesuń się o jedno słowo do końca następnego WORD
b     Przesuń się wstecz do początku poprzedniego słowa
B     Przesuń się wstecz do początku poprzedniego WORD
ge    Przesuń się wstecz do końca poprzedniego słowa
gE    Przesuń się wstecz do końca poprzedniego WORD
```

Jakie są więc podobieństwa i różnice między słowem a WORD? Zarówno słowo, jak i WORD są oddzielone białymi znakami. Słowo to sekwencja znaków zawierająca *tylko* `a-zA-Z0-9_`. WORD to sekwencja wszystkich znaków z wyjątkiem białych znaków (biały znak oznacza spację, tabulator i EOL). Aby dowiedzieć się więcej, sprawdź `:h word` i `:h WORD`.

Na przykład, załóżmy, że masz:

```shell
const hello = "world";
```

Z kursorem na początku linii, aby przejść do końca linii za pomocą `l`, zajmie to 21 naciśnięć klawiszy. Używając `w`, zajmie to 6. Używając `W`, zajmie to tylko 4. Zarówno słowo, jak i WORD są dobrymi opcjami do podróży na krótkie odległości.

Jednak możesz przejść z "c" do ";" w jednym naciśnięciu klawisza przy nawigacji w bieżącej linii.

## Nawigacja w bieżącej linii

Podczas edytowania często musisz nawigować poziomo w linii. Aby przeskoczyć do pierwszego znaku w bieżącej linii, użyj `0`. Aby przejść do ostatniego znaku w bieżącej linii, użyj `$`. Dodatkowo możesz użyć `^`, aby przejść do pierwszego znaku niebiałego w bieżącej linii oraz `g_`, aby przejść do ostatniego znaku niebiałego w bieżącej linii. Jeśli chcesz przejść do kolumny `n` w bieżącej linii, możesz użyć `n|`.

```shell
0     Przejdź do pierwszego znaku w bieżącej linii
^     Przejdź do pierwszego znaku niebiałego w bieżącej linii
g_    Przejdź do ostatniego znaku niebiałego w bieżącej linii
$     Przejdź do ostatniego znaku w bieżącej linii
n|    Przejdź do kolumny n w bieżącej linii
```

Możesz przeprowadzić wyszukiwanie w bieżącej linii za pomocą `f` i `t`. Różnica między `f` a `t` polega na tym, że `f` przenosi cię do pierwszej litery dopasowania, a `t` przenosi cię do (tuż przed) pierwszej litery dopasowania. Więc jeśli chcesz wyszukiwać "h" i wylądować na "h", użyj `fh`. Jeśli chcesz wyszukiwać pierwsze "h" i wylądować tuż przed dopasowaniem, użyj `th`. Jeśli chcesz przejść do *następnego* wystąpienia ostatniego wyszukiwania w bieżącej linii, użyj `;`. Aby przejść do poprzedniego wystąpienia ostatniego dopasowania w bieżącej linii, użyj `,`.

`F` i `T` są odwrotnymi odpowiednikami `f` i `t`. Aby wyszukiwać wstecz "h", użyj `Fh`. Aby kontynuować wyszukiwanie "h" w tym samym kierunku, użyj `;`. Zauważ, że `;` po `Fh` wyszukuje wstecz, a `,` po `Fh` wyszukuje do przodu.

```shell
f    Wyszukaj do przodu w celu dopasowania w tej samej linii
F    Wyszukaj wstecz w celu dopasowania w tej samej linii
t    Wyszukaj do przodu w celu dopasowania w tej samej linii, zatrzymując się przed dopasowaniem
T    Wyszukaj wstecz w celu dopasowania w tej samej linii, zatrzymując się przed dopasowaniem
;    Powtórz ostatnie wyszukiwanie w tej samej linii, używając tego samego kierunku
,    Powtórz ostatnie wyszukiwanie w tej samej linii, używając przeciwnego kierunku
```

Wracając do poprzedniego przykładu:

```shell
const hello = "world";
```

Z kursorem na początku linii, możesz przejść do ostatniego znaku w bieżącej linii (";") jednym naciśnięciem klawisza: `$`. Jeśli chcesz przejść do "w" w "world", możesz użyć `fw`. Dobrym sposobem na poruszanie się w linii jest szukanie najmniej powszechnych liter, takich jak "j", "x", "z" w pobliżu celu.

## Nawigacja po zdaniach i akapitach

Dwie następne jednostki nawigacji to zdanie i akapit.

Najpierw porozmawiajmy o tym, czym jest zdanie. Zdanie kończy się na `. ! ?` po którym następuje EOL, spacja lub tabulator. Możesz przeskoczyć do następnego zdania za pomocą `)` i do poprzedniego zdania za pomocą `(`.

```shell
(    Przeskocz do poprzedniego zdania
)    Przeskocz do następnego zdania
```

Przyjrzyjmy się kilku przykładom. Które frazy uważasz za zdania, a które nie? Spróbuj nawigować za pomocą `(` i `)` w Vimie!

```shell
Jestem zdaniem. Jestem kolejnym zdaniem, ponieważ kończę się kropką. Nadal jestem zdaniem, gdy kończę się wykrzyknikiem! A co z znakiem zapytania? Nie jestem do końca zdaniem z powodu myślnika - ani średnik ; ani dwukropek :

Jest nad mną pusta linia.
```

Przy okazji, jeśli masz problem z tym, że Vim nie liczy zdania dla fraz oddzielonych `.` i następującą po nich pojedynczą linią, możesz być w trybie `'compatible'`. Dodaj `set nocompatible` do vimrc. W Vi zdanie to `.` po którym następują **dwie** spacje. Powinieneś mieć ustawione `nocompatible` przez cały czas.

Porozmawiajmy, czym jest akapit. Akapit zaczyna się po każdej pustej linii oraz w każdym zestawie makr akapitów określonych przez pary znaków w opcji akapitów.

```shell
{    Przeskocz do poprzedniego akapitu
}    Przeskocz do następnego akapitu
```

Jeśli nie jesteś pewien, czym jest makro akapitu, nie martw się. Ważne jest, że akapit zaczyna się i kończy po pustej linii. To powinno być prawdą w większości przypadków.

Przyjrzyjmy się temu przykładzie. Spróbuj nawigować za pomocą `}` i `{` (a także pobaw się nawigacją po zdaniach `( )`, aby poruszać się również!)

```shell
Cześć. Jak się masz? Jestem świetnie, dziękuję!
Vim jest niesamowity.
Może nie jest łatwo go nauczyć na początku... - ale jesteśmy w tym razem. Powodzenia!

Cześć ponownie.

Spróbuj poruszać się za pomocą ), (, }, i {. Poczuj, jak działają.
Dasz radę.
```

Sprawdź `:h sentence` i `:h paragraph`, aby dowiedzieć się więcej.

## Nawigacja po dopasowaniach

Programiści piszą i edytują kody. Kody zazwyczaj używają nawiasów, klamer i bracketów. Możesz łatwo się w nich zgubić. Jeśli jesteś w jednym, możesz przeskoczyć do drugiej pary (jeśli istnieje) za pomocą `%`. Możesz również użyć tego, aby sprawdzić, czy masz dopasowane nawiasy, klamry i bracket.

```shell
%    Nawiguj do innego dopasowania, zazwyczaj działa dla (), [], {}
```

Przyjrzyjmy się przykładowi kodu Scheme, ponieważ intensywnie używa nawiasów. Poruszaj się za pomocą `%` wewnątrz różnych nawiasów.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Osobiście lubię uzupełniać `%` wizualnymi wskaźnikami, takimi jak wtyczka [vim-rainbow](https://github.com/frazrepo/vim-rainbow). Aby dowiedzieć się więcej, sprawdź `:h %`.

## Nawigacja po numerach linii

Możesz przeskoczyć do numeru linii `n` za pomocą `nG`. Na przykład, jeśli chcesz przeskoczyć do linii 7, użyj `7G`. Aby przeskoczyć do pierwszej linii, użyj `1G` lub `gg`. Aby przeskoczyć do ostatniej linii, użyj `G`.

Często nie wiesz dokładnie, jaki numer linii ma twój cel, ale wiesz, że jest mniej więcej na 70% całego pliku. W takim przypadku możesz użyć `70%`. Aby przeskoczyć w połowie pliku, możesz użyć `50%`.

```shell
gg    Przejdź do pierwszej linii
G     Przejdź do ostatniej linii
nG    Przejdź do linii n
n%    Przejdź do n% w pliku
```

Przy okazji, jeśli chcesz zobaczyć całkowitą liczbę linii w pliku, możesz użyć `Ctrl-g`.

## Nawigacja po oknach

Aby szybko przejść do góry, środka lub dołu swojego *okna*, możesz użyć `H`, `M` i `L`.

Możesz również podać liczbę do `H` i `L`. Jeśli użyjesz `10H`, przejdziesz 10 linii poniżej górnej części okna. Jeśli użyjesz `3L`, przejdziesz 3 linie powyżej ostatniej linii okna.

```shell
H     Przejdź do góry ekranu
M     Przejdź do środka ekranu
L     Przejdź do dołu ekranu
nH    Przejdź n linii od góry
nL    Przejdź n linii od dołu
```

## Przewijanie

Aby przewijać, masz 3 prędkości: pełny ekran (`Ctrl-F/Ctrl-B`), pół ekranu (`Ctrl-D/Ctrl-U`) i linia (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Przewiń w dół o linię
Ctrl-D    Przewiń w dół o pół ekranu
Ctrl-F    Przewiń w dół o cały ekran
Ctrl-Y    Przewiń w górę o linię
Ctrl-U    Przewiń w górę o pół ekranu
Ctrl-B    Przewiń w górę o cały ekran
```

Możesz również przewijać względnie do bieżącej linii (powiększając widok ekranu):

```shell
zt    Przenieś bieżącą linię blisko góry ekranu
zz    Przenieś bieżącą linię do środka ekranu
zb    Przenieś bieżącą linię blisko dołu ekranu
```
## Nawigacja w wyszukiwaniu

Często wiesz, że fraza istnieje w pliku. Możesz użyć nawigacji w wyszukiwaniu, aby bardzo szybko dotrzeć do celu. Aby wyszukać frazę, możesz użyć `/` do wyszukiwania w przód i `?` do wyszukiwania w tył. Aby powtórzyć ostatnie wyszukiwanie, możesz użyć `n`. Aby powtórzyć ostatnie wyszukiwanie w przeciwnym kierunku, możesz użyć `N`.

```shell
/    Wyszukaj do przodu dopasowanie
?    Wyszukaj do tyłu dopasowanie
n    Powtórz ostatnie wyszukiwanie w tym samym kierunku
N    Powtórz ostatnie wyszukiwanie w przeciwnym kierunku
```

Załóżmy, że masz ten tekst:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Jeśli szukasz "let", uruchom `/let`. Aby szybko ponownie wyszukać "let", możesz po prostu użyć `n`. Aby ponownie wyszukać "let" w przeciwnym kierunku, uruchom `N`. Jeśli uruchomisz `?let`, wyszuka "let" wstecz. Jeśli użyjesz `n`, teraz będzie wyszukiwać "let" wstecz (`N` będzie teraz wyszukiwać "let" do przodu).

Możesz włączyć podświetlenie wyszukiwania za pomocą `set hlsearch`. Teraz, gdy wyszukasz `/let`, podświetli *wszystkie* dopasowane frazy w pliku. Dodatkowo możesz ustawić wyszukiwanie inkrementalne za pomocą `set incsearch`. To podświetli wzór podczas pisania. Domyślnie, twoje dopasowane frazy pozostaną podświetlone, dopóki nie wyszukasz innej frazy. Może to szybko stać się irytujące. Aby wyłączyć podświetlenie, możesz uruchomić `:nohlsearch` lub po prostu `:noh`. Ponieważ często korzystam z tej funkcji bez podświetlenia, stworzyłem mapę w vimrc:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Możesz szybko wyszukiwać tekst pod kursorem za pomocą `*` do wyszukiwania do przodu i `#` do wyszukiwania w tył. Jeśli twój kursor jest na ciągu "one", naciśnięcie `*` będzie tym samym, co zrobienie `/\<one\>`.

Zarówno `\<` jak i `\>` w `/\<one\>` oznaczają wyszukiwanie całego słowa. Nie dopasuje "one", jeśli jest częścią większego słowa. Dopasuje słowo "one", ale nie "onetwo". Jeśli twój kursor jest nad "one" i chcesz wyszukiwać do przodu, aby dopasować całe lub częściowe słowa, takie jak "one" i "onetwo", musisz użyć `g*` zamiast `*`.

```shell
*     Wyszukaj całe słowo pod kursorem do przodu
#     Wyszukaj całe słowo pod kursorem w tył
g*    Wyszukaj słowo pod kursorem do przodu
g#    Wyszukaj słowo pod kursorem w tył
```

## Oznaczanie pozycji

Możesz używać znaczników, aby zapisać swoją aktualną pozycję i wrócić do niej później. To jak zakładka w edytowaniu tekstu. Możesz ustawić znacznik za pomocą `mx`, gdzie `x` może być dowolną literą alfabetu `a-zA-Z`. Istnieją dwa sposoby powrotu do znacznika: dokładny (linia i kolumna) za pomocą `` `x `` i wierszowy (`'x`).

```shell
ma    Oznacz pozycję znacznikiem "a"
`a    Skocz do linii i kolumny "a"
'a    Skocz do linii "a"
```

Istnieje różnica między oznaczaniem małymi literami (a-z) a dużymi literami (A-Z). Małe litery to znaczniki lokalne, a duże litery to znaczniki globalne (czasami znane jako znaczniki pliku).

Porozmawiajmy o znacznikach lokalnych. Każdy bufor może mieć własny zestaw znaczników lokalnych. Jeśli mam otwarte dwa pliki, mogę ustawić znacznik "a" (`ma`) w pierwszym pliku i inny znacznik "a" (`ma`) w drugim pliku.

W przeciwieństwie do znaczników lokalnych, gdzie możesz mieć zestaw znaczników w każdym buforze, masz tylko jeden zestaw znaczników globalnych. Jeśli ustawisz `mA` w `myFile.txt`, następnym razem, gdy uruchomisz `mA` w innym pliku, nadpisze pierwszy znacznik "A". Jedną z zalet znaczników globalnych jest to, że możesz skakać do dowolnego znacznika globalnego, nawet jeśli jesteś w zupełnie innym projekcie. Znaczniki globalne mogą podróżować między plikami.

Aby wyświetlić wszystkie znaczniki, użyj `:marks`. Możesz zauważyć z listy znaczników, że istnieje więcej znaczników niż `a-zA-Z`. Niektóre z nich to:

```shell
''    Skocz z powrotem do ostatniej linii w bieżącym buforze przed skokiem
``    Skocz z powrotem do ostatniej pozycji w bieżącym buforze przed skokiem
`[    Skocz do początku wcześniej zmienionego / skopiowanego tekstu
`]    Skocz do końca wcześniej zmienionego / skopiowanego tekstu
`<    Skocz do początku ostatniego wyboru wizualnego
`>    Skocz do końca ostatniego wyboru wizualnego
`0    Skocz z powrotem do ostatnio edytowanego pliku przy wychodzeniu z vim
```

Jest więcej znaczników niż te wymienione powyżej. Nie będę ich tutaj omawiać, ponieważ uważam, że są rzadko używane, ale jeśli jesteś ciekawy, sprawdź `:h marks`.

## Skok

W Vimie możesz "skakać" do innego pliku lub innej części pliku za pomocą niektórych ruchów. Nie wszystkie ruchy liczą się jako skok. Przechodzenie w dół za pomocą `j` nie liczy się jako skok. Przechodzenie do linii 10 za pomocą `10G` liczy się jako skok.

Oto polecenia, które Vim uznaje za polecenia "skoku":

```shell
'       Idź do oznaczonej linii
`       Idź do oznaczonej pozycji
G       Idź do linii
/       Wyszukaj do przodu
?       Wyszukaj w tył
n       Powtórz ostatnie wyszukiwanie, w tym samym kierunku
N       Powtórz ostatnie wyszukiwanie, w przeciwnym kierunku
%       Znajdź dopasowanie
(       Idź do ostatniego zdania
)       Idź do następnego zdania
{       Idź do ostatniego akapitu
}       Idź do następnego akapitu
L       Idź do ostatniej linii wyświetlanego okna
M       Idź do środkowej linii wyświetlanego okna
H       Idź do górnej linii wyświetlanego okna
[[      Idź do poprzedniej sekcji
]]      Idź do następnej sekcji
:s      Zastąp
:tag    Skocz do definicji tagu
```

Nie polecam zapamiętywania tej listy. Dobrym ogólnym zaleceniem jest to, że każdy ruch, który przemieszcza się dalej niż słowo i bieżąca nawigacja linii, prawdopodobnie jest skokiem. Vim śledzi, gdzie byłeś, gdy się poruszasz, a tę listę możesz zobaczyć wewnątrz `:jumps`.

Aby uzyskać więcej informacji, sprawdź `:h jump-motions`.

Dlaczego skoki są przydatne? Ponieważ możesz nawigować po liście skoków za pomocą `Ctrl-O`, aby przejść w górę listy skoków i `Ctrl-I`, aby przejść w dół listy skoków. `hjkl` nie są poleceniami "skoku", ale możesz ręcznie dodać bieżącą lokalizację do listy skoków za pomocą `m'` przed ruchem. Na przykład `m'5j` dodaje bieżącą lokalizację do listy skoków i schodzi 5 linii w dół, a możesz wrócić za pomocą `Ctrl-O`. Możesz skakać między różnymi plikami, co omówię bardziej w następnej części.

## Naucz się nawigacji w inteligentny sposób

Jeśli jesteś nowy w Vimie, to dużo do nauki. Nie oczekuję, że ktokolwiek zapamięta wszystko od razu. Zajmuje to czas, zanim będziesz mógł je wykonywać bez myślenia.

Uważam, że najlepszym sposobem na rozpoczęcie jest zapamiętanie kilku niezbędnych ruchów. Polecam rozpocząć od tych 10 ruchów: `h, j, k, l, w, b, G, /, ?, n`. Powtarzaj je wystarczająco, aż będziesz mógł ich używać bez myślenia.

Aby poprawić swoje umiejętności nawigacji, oto moje sugestie:
1. Zwracaj uwagę na powtarzające się działania. Jeśli zauważysz, że wielokrotnie wykonujesz `l`, poszukaj ruchu, który pozwoli ci szybciej przejść do przodu. Odkryjesz, że możesz użyć `w`. Jeśli złapiesz się na wielokrotnym wykonywaniu `w`, sprawdź, czy istnieje ruch, który szybko przeniesie cię przez bieżącą linię. Odkryjesz, że możesz użyć `f`. Jeśli potrafisz zwięźle opisać swoją potrzebę, istnieje duża szansa, że Vim ma sposób, aby to zrobić.
2. Kiedy tylko nauczysz się nowego ruchu, poświęć trochę czasu, aż będziesz mógł go wykonać bez myślenia.

Na koniec, zdobądź świadomość, że nie musisz znać każdego pojedynczego polecenia Vima, aby być produktywnym. Większość użytkowników Vima tego nie robi. Ja też nie. Naucz się poleceń, które pomogą ci zrealizować twoje zadanie w danym momencie.

Nie spiesz się. Umiejętność nawigacji to bardzo ważna umiejętność w Vimie. Ucz się jednej małej rzeczy każdego dnia i ucz się jej dobrze.