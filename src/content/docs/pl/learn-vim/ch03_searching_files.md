---
description: Ten rozdział wprowadza w szybkie wyszukiwanie w Vim, omawiając metody
  bez wtyczek oraz z użyciem wtyczki fzf.vim, aby zwiększyć produktywność.
title: Ch03. Searching Files
---

Celem tego rozdziału jest wprowadzenie do szybkiego wyszukiwania w Vimie. Umiejętność szybkiego wyszukiwania to doskonały sposób na zwiększenie swojej produktywności w Vimie. Kiedy odkryłem, jak szybko przeszukiwać pliki, zdecydowałem się na pełnoetatowe korzystanie z Vima.

Rozdział ten dzieli się na dwie części: jak wyszukiwać bez wtyczek i jak wyszukiwać z wtyczką [fzf.vim](https://github.com/junegunn/fzf.vim). Zaczynajmy!

## Otwieranie i edytowanie plików

Aby otworzyć plik w Vimie, możesz użyć `:edit`.

```shell
:edit file.txt
```

Jeśli `file.txt` istnieje, otworzy bufor `file.txt`. Jeśli `file.txt` nie istnieje, utworzy nowy bufor dla `file.txt`.

Autouzupełnianie za pomocą `<Tab>` działa z `:edit`. Na przykład, jeśli twój plik znajduje się w katalogu kontrolera *u*żytkowników *a*pp *c*ontroller [Rails](https://rubyonrails.org/) `./app/controllers/users_controllers.rb`, możesz użyć `<Tab>`, aby szybko rozszerzyć terminy:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` akceptuje argumenty z użyciem symboli wieloznacznych. `*` pasuje do dowolnego pliku w bieżącym katalogu. Jeśli szukasz tylko plików z rozszerzeniem `.yml` w bieżącym katalogu:

```shell
:edit *.yml<Tab>
```

Vim wyświetli listę wszystkich plików `.yml` w bieżącym katalogu do wyboru.

Możesz użyć `**`, aby przeszukiwać rekurencyjnie. Jeśli chcesz znaleźć wszystkie pliki `*.md` w swoim projekcie, ale nie jesteś pewien, w których katalogach, możesz to zrobić:

```shell
:edit **/*.md<Tab>
```

`:edit` można użyć do uruchomienia `netrw`, wbudowanego eksploratora plików Vima. Aby to zrobić, podaj argument katalogu zamiast pliku:

```shell
:edit .
:edit test/unit/
```

## Wyszukiwanie plików z Find

Możesz znaleźć pliki za pomocą `:find`. Na przykład:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

Autouzupełnianie również działa z `:find`:

```shell
:find p<Tab>                " aby znaleźć package.json
:find a<Tab>c<Tab>u<Tab>    " aby znaleźć app/controllers/users_controller.rb
```

Możesz zauważyć, że `:find` wygląda jak `:edit`. Jaka jest różnica?

## Find i Path

Różnica polega na tym, że `:find` znajduje plik w `path`, a `:edit` tego nie robi. Dowiedzmy się trochę o `path`. Gdy nauczysz się, jak modyfikować swoje ścieżki, `:find` może stać się potężnym narzędziem wyszukiwania. Aby sprawdzić, jakie są twoje ścieżki, wykonaj:

```shell
:set path?
```

Domyślnie twoje prawdopodobnie wyglądają tak:

```shell
path=.,/usr/include,,
```

- `.` oznacza przeszukiwanie w katalogu aktualnie otwartego pliku.
- `,` oznacza przeszukiwanie w bieżącym katalogu.
- `/usr/include` to typowy katalog dla nagłówków bibliotek C.

Pierwsze dwa są ważne w naszym kontekście, a trzeci można na razie zignorować. Kluczowe jest to, że możesz modyfikować swoje własne ścieżki, w których Vim będzie szukał plików. Załóżmy, że to jest struktura twojego projektu:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Jeśli chcesz przejść do `users_controller.rb` z katalogu głównego, musisz przejść przez kilka katalogów (i nacisnąć znaczną ilość tabów). Często pracując z frameworkiem, spędzasz 90% swojego czasu w określonym katalogu. W tej sytuacji zależy ci tylko na przejściu do katalogu `controllers/` z jak najmniejszą liczbą naciśnięć klawiszy. Ustawienie `path` może skrócić tę podróż.

Musisz dodać `app/controllers/` do bieżącego `path`. Oto jak możesz to zrobić:

```shell
:set path+=app/controllers/
```

Teraz, gdy twoja ścieżka jest zaktualizowana, gdy wpiszesz `:find u<Tab>`, Vim teraz będzie szukał w katalogu `app/controllers/` plików zaczynających się na "u".

Jeśli masz zagnieżdżony katalog `controllers/`, jak `app/controllers/account/users_controller.rb`, Vim nie znajdzie `users_controllers`. Zamiast tego musisz dodać `:set path+=app/controllers/**`, aby autouzupełnianie znalazło `users_controller.rb`. To świetnie! Teraz możesz znaleźć kontroler użytkowników za pomocą 1 naciśnięcia tab zamiast 3.

Możesz myśleć o dodaniu całych katalogów projektu, aby po naciśnięciu `tab` Vim przeszukiwał wszędzie w poszukiwaniu tego pliku, jak to:

```shell
:set path+=$PWD/**
```

`$PWD` to bieżący katalog roboczy. Jeśli spróbujesz dodać cały swój projekt do `path`, mając nadzieję, że wszystkie pliki będą dostępne po naciśnięciu `tab`, chociaż może to działać w małym projekcie, zrobienie tego znacznie spowolni twoje wyszukiwanie, jeśli masz dużą liczbę plików w swoim projekcie. Zalecam dodanie tylko `path` najczęściej odwiedzanych plików/katalogów.

Możesz dodać `set path+={twoja-ścieżka-tutaj}` w swoim vimrc. Aktualizacja `path` zajmuje tylko kilka sekund, a zrobienie tego może zaoszczędzić ci dużo czasu.

## Wyszukiwanie w plikach za pomocą Grep

Jeśli musisz wyszukiwać w plikach (znajdować frazy w plikach), możesz użyć grep. Vim ma dwa sposoby na to:

- Wewnętrzny grep (`:vim`. Tak, to jest napisane `:vim`. To skrót od `:vimgrep`).
- Zewnętrzny grep (`:grep`).

Zacznijmy od wewnętrznego grepa. `:vim` ma następującą składnię:

```shell
:vim /pattern/ file
```

- `/pattern/` to wzór regex twojego terminu wyszukiwania.
- `file` to argument pliku. Możesz przekazać wiele argumentów. Vim będzie szukał wzoru wewnątrz argumentu pliku. Podobnie jak w `:find`, możesz przekazać mu symbole wieloznaczne `*` i `**`.

Na przykład, aby znaleźć wszystkie wystąpienia ciągu "breakfast" we wszystkich plikach ruby (`.rb`) w katalogu `app/controllers/`:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Po uruchomieniu tego zostaniesz przekierowany do pierwszego wyniku. Komenda wyszukiwania Vima `vim` używa operacji `quickfix`. Aby zobaczyć wszystkie wyniki wyszukiwania, uruchom `:copen`. To otworzy okno `quickfix`. Oto kilka przydatnych komend quickfix, które pomogą ci szybko zacząć:

```shell
:copen        Otwórz okno quickfix
:cclose       Zamknij okno quickfix
:cnext        Przejdź do następnego błędu
:cprevious    Przejdź do poprzedniego błędu
:colder       Przejdź do starszej listy błędów
:cnewer       Przejdź do nowszej listy błędów
```

Aby dowiedzieć się więcej o quickfix, sprawdź `:h quickfix`.

Możesz zauważyć, że uruchamianie wewnętrznego grepa (`:vim`) może być wolne, jeśli masz dużą liczbę dopasowań. Dzieje się tak, ponieważ Vim ładuje każdy dopasowany plik do pamięci, jakby był edytowany. Jeśli Vim znajdzie dużą liczbę plików pasujących do twojego wyszukiwania, załaduje je wszystkie i tym samym zużyje dużą ilość pamięci.

Porozmawiajmy teraz o zewnętrznym grepie. Domyślnie używa on polecenia terminalowego `grep`. Aby wyszukać "lunch" w pliku ruby w katalogu `app/controllers/`, możesz to zrobić:

```shell
:grep -R "lunch" app/controllers/
```

Zauważ, że zamiast używać `/pattern/`, stosuje składnię terminalowego grepa `"pattern"`. Wyświetla również wszystkie dopasowania za pomocą `quickfix`.

Vim definiuje zmienną `grepprg`, aby określić, który zewnętrzny program uruchomić podczas wykonywania polecenia `:grep` w Vimie, aby nie musieć zamykać Vima i wywoływać polecenia terminalowego `grep`. Później pokażę ci, jak zmienić domyślny program wywoływany podczas używania polecenia `:grep` w Vimie.

## Przeglądanie plików z Netrw

`netrw` to wbudowany eksplorator plików Vima. Jest przydatny do zobaczenia hierarchii projektu. Aby uruchomić `netrw`, potrzebujesz tych dwóch ustawień w swoim `.vimrc`:

```shell
set nocp
filetype plugin on
```

Ponieważ `netrw` to obszerny temat, omówię tylko podstawowe użycie, ale powinno to wystarczyć, abyś mógł zacząć. Możesz uruchomić `netrw`, gdy uruchamiasz Vima, przekazując mu katalog jako parametr zamiast pliku. Na przykład:

```shell
vim .
vim src/client/
vim app/controllers/
```

Aby uruchomić `netrw` z wnętrza Vima, możesz użyć polecenia `:edit` i przekazać mu parametr katalogu zamiast nazwy pliku:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Są inne sposoby na uruchomienie okna `netrw` bez przekazywania katalogu:

```shell
:Explore     Uruchamia netrw na aktualnym pliku
:Sexplore    Nie żartuję. Uruchamia netrw w górnej połowie ekranu
:Vexplore    Uruchamia netrw w lewej połowie ekranu
```

Możesz nawigować w `netrw` za pomocą ruchów Vima (ruchy będą omówione szczegółowo w późniejszym rozdziale). Jeśli musisz utworzyć, usunąć lub zmienić nazwę pliku lub katalogu, oto lista przydatnych komend `netrw`:

```shell
%    Utwórz nowy plik
d    Utwórz nowy katalog
R    Zmień nazwę pliku lub katalogu
D    Usuń plik lub katalog
```

`:h netrw` jest bardzo obszerne. Sprawdź to, jeśli masz czas.

Jeśli uznasz `netrw` za zbyt nudne i potrzebujesz więcej smaku, [vim-vinegar](https://github.com/tpope/vim-vinegar) to dobra wtyczka, aby poprawić `netrw`. Jeśli szukasz innego eksploratora plików, [NERDTree](https://github.com/preservim/nerdtree) to dobra alternatywa. Sprawdź je!

## Fzf

Teraz, gdy nauczyłeś się, jak wyszukiwać pliki w Vimie za pomocą wbudowanych narzędzi, nauczmy się, jak to robić za pomocą wtyczek.

Jedną z rzeczy, które nowoczesne edytory tekstu robią dobrze, a których Vim nie robi, jest to, jak łatwo znaleźć pliki, szczególnie za pomocą fuzzy search. W drugiej części tego rozdziału pokażę ci, jak używać [fzf.vim](https://github.com/junegunn/fzf.vim), aby ułatwić i wzmocnić wyszukiwanie w Vimie.

## Ustawienia

Najpierw upewnij się, że masz pobrane [fzf](https://github.com/junegunn/fzf) i [ripgrep](https://github.com/BurntSushi/ripgrep). Postępuj zgodnie z instrukcjami na ich repozytorium github. Polecenia `fzf` i `rg` powinny być teraz dostępne po pomyślnym zainstalowaniu.

Ripgrep to narzędzie do wyszukiwania, podobne do grepa (stąd nazwa). Jest ogólnie szybszy niż grep i ma wiele przydatnych funkcji. Fzf to ogólne narzędzie do wyszukiwania wierszowego. Możesz go używać z dowolnymi poleceniami, w tym ripgrep. Razem tworzą potężne połączenie narzędzi do wyszukiwania.

Fzf domyślnie nie używa ripgrep, więc musimy powiedzieć fzf, aby używał ripgrep, definiując zmienną `FZF_DEFAULT_COMMAND`. W moim `.zshrc` (`.bashrc`, jeśli używasz basha), mam to:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Zwróć uwagę na `-m` w `FZF_DEFAULT_OPTS`. Ta opcja pozwala nam na dokonanie wielu wyborów za pomocą `<Tab>` lub `<Shift-Tab>`. Nie potrzebujesz tej linii, aby fzf działał z Vimem, ale uważam, że to przydatna opcja. Przyda się, gdy chcesz przeprowadzić wyszukiwanie i zamianę w wielu plikach, co omówię za chwilę. Komenda fzf akceptuje wiele innych opcji, ale nie omówię ich tutaj. Aby dowiedzieć się więcej, sprawdź [repozytorium fzf](https://github.com/junegunn/fzf#usage) lub `man fzf`. Minimum, co powinieneś mieć, to `export FZF_DEFAULT_COMMAND='rg'`.

Po zainstalowaniu fzf i ripgrep, skonfigurujmy wtyczkę fzf. W tym przykładzie używam menedżera wtyczek [vim-plug](https://github.com/junegunn/vim-plug), ale możesz używać dowolnego menedżera wtyczek.

Dodaj te linie do swoich wtyczek w `.vimrc`. Musisz użyć wtyczki [fzf.vim](https://github.com/junegunn/fzf.vim) (stworzona przez tego samego autora fzf).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Po dodaniu tych linii musisz otworzyć `vim` i uruchomić `:PlugInstall`. Zainstaluje to wszystkie wtyczki zdefiniowane w twoim pliku `vimrc`, które nie są zainstalowane. W naszym przypadku zainstaluje `fzf.vim` i `fzf`.

Aby uzyskać więcej informacji na temat tej wtyczki, możesz sprawdzić [repozytorium fzf.vim](https://github.com/junegunn/fzf/blob/master/README-VIM.md).
## Składnia Fzf

Aby efektywnie korzystać z fzf, powinieneś nauczyć się podstawowej składni fzf. Na szczęście lista jest krótka:

- `^` to prefiksowe dopasowanie dokładne. Aby wyszukać frazę zaczynającą się od "welcome": `^welcome`.
- `$` to sufiksowe dopasowanie dokładne. Aby wyszukać frazę kończącą się na "my friends": `friends$`.
- `'` to dopasowanie dokładne. Aby wyszukać frazę "welcome my friends": `'welcome my friends`.
- `|` to dopasowanie "lub". Aby wyszukać "friends" lub "foes": `friends | foes`.
- `!` to dopasowanie odwrotne. Aby wyszukać frazę zawierającą "welcome" i nie zawierającą "friends": `welcome !friends`

Możesz łączyć te opcje. Na przykład, `^hello | ^welcome friends$` będzie wyszukiwać frazę zaczynającą się od "welcome" lub "hello" i kończącą się na "friends".

## Wyszukiwanie plików

Aby wyszukiwać pliki w Vimie za pomocą wtyczki fzf.vim, możesz użyć metody `:Files`. Uruchom `:Files` z Vima, a pojawi się monit wyszukiwania fzf.

Ponieważ będziesz często używać tej komendy, dobrze jest przypisać ją do skrótu klawiszowego. Ja przypisałem to do `Ctrl-f`. W moim vimrc mam to:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Wyszukiwanie w plikach

Aby wyszukiwać wewnątrz plików, możesz użyć komendy `:Rg`.

Ponownie, ponieważ prawdopodobnie będziesz to często używać, przypiszmy to do skrótu klawiszowego. Ja przypisałem to do `<Leader>f`. Klawisz `<Leader>` jest domyślnie przypisany do `\`.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Inne wyszukiwania

Fzf.vim oferuje wiele innych komend wyszukiwania. Nie będę omawiać każdej z nich tutaj, ale możesz je sprawdzić [tutaj](https://github.com/junegunn/fzf.vim#commands).

Oto jak wyglądają moje mapy fzf:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Zastępowanie Grep przez Rg

Jak wspomniano wcześniej, Vim ma dwa sposoby wyszukiwania w plikach: `:vim` i `:grep`. `:grep` używa zewnętrznego narzędzia do wyszukiwania, które możesz przypisać ponownie za pomocą słowa kluczowego `grepprg`. Pokażę ci, jak skonfigurować Vim, aby używał ripgrep zamiast terminal grep podczas uruchamiania komendy `:grep`.

Teraz skonfigurujmy `grepprg`, aby komenda `:grep` w Vimie używała ripgrep. Dodaj to do swojego vimrc:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Nie krępuj się modyfikować niektórych z powyższych opcji! Aby uzyskać więcej informacji na temat tego, co oznaczają powyższe opcje, sprawdź `man rg`.

Po zaktualizowaniu `grepprg`, teraz gdy uruchomisz `:grep`, uruchomi `rg --vimgrep --smart-case --follow` zamiast `grep`. Jeśli chcesz wyszukać "donut" używając ripgrep, możesz teraz uruchomić bardziej zwięzłą komendę `:grep "donut"` zamiast `:grep "donut" . -R`.

Podobnie jak w starym `:grep`, nowy `:grep` również używa quickfix do wyświetlania wyników.

Możesz się zastanawiać: "Cóż, to miłe, ale nigdy nie używałem `:grep` w Vimie, a czy nie mogę po prostu użyć `:Rg`, aby znaleźć frazy w plikach? Kiedy kiedykolwiek będę musiał używać `:grep`?"

To bardzo dobre pytanie. Możesz potrzebować użyć `:grep` w Vimie, aby przeprowadzić wyszukiwanie i zastępowanie w wielu plikach, co omówię w następnej części.

## Wyszukiwanie i zastępowanie w wielu plikach

Nowoczesne edytory tekstu, takie jak VSCode, ułatwiają wyszukiwanie i zastępowanie ciągu w wielu plikach. W tej sekcji pokażę ci dwie różne metody, aby łatwo to zrobić w Vimie.

Pierwsza metoda polega na zastąpieniu *wszystkich* dopasowanych fraz w twoim projekcie. Będziesz musiał użyć `:grep`. Jeśli chcesz zastąpić wszystkie wystąpienia "pizza" na "donut", oto co robisz:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Rozłóżmy te komendy:

1. `:grep pizza` używa ripgrep do wyszukiwania wszystkich wystąpień "pizza" (przy okazji, to nadal działałoby, nawet jeśli nie przypisałeś `grepprg`, aby używać ripgrep. Musiałbyś użyć `:grep "pizza" . -R` zamiast `:grep "pizza"`).
2. `:cfdo` wykonuje dowolną komendę, którą przekażesz do wszystkich plików w twojej liście quickfix. W tym przypadku twoja komenda to komenda zastąpienia `%s/pizza/donut/g`. Rura (`|`) jest operatorem łańcuchowym. Komenda `update` zapisuje każdy plik po zastąpieniu. Omówię komendę zastąpienia bardziej szczegółowo w późniejszym rozdziale.

Druga metoda polega na wyszukiwaniu i zastępowaniu w wybranych plikach. Dzięki tej metodzie możesz ręcznie wybrać, w których plikach chcesz przeprowadzić operację zastąpienia. Oto co robisz:

1. Najpierw wyczyść swoje bufory. Ważne jest, aby twoja lista buforów zawierała tylko pliki, na których chcesz przeprowadzić zastąpienie. Możesz albo ponownie uruchomić Vima, albo uruchomić komendę `:%bd | e#` (`%bd` usuwa wszystkie bufory, a `e#` otwiera plik, na którym właśnie byłeś).
2. Uruchom `:Files`.
3. Wybierz wszystkie pliki, na których chcesz przeprowadzić wyszukiwanie i zastąpienie. Aby wybrać wiele plików, użyj `<Tab>` / `<Shift-Tab>`. To jest możliwe tylko wtedy, gdy masz flagę wielokrotności (`-m`) w `FZF_DEFAULT_OPTS`.
4. Uruchom `:bufdo %s/pizza/donut/g | update`. Komenda `:bufdo %s/pizza/donut/g | update` wygląda podobnie do wcześniejszej komendy `:cfdo %s/pizza/donut/g | update`. Różnica polega na tym, że zamiast zastępować wszystkie wpisy quickfix (`:cfdo`), zastępujesz wszystkie wpisy buforów (`:bufdo`).

## Ucz się wyszukiwania w inteligentny sposób

Wyszukiwanie to chleb i masło edytowania tekstu. Nauka, jak dobrze wyszukiwać w Vimie, znacznie poprawi twój workflow edytowania tekstu.

Fzf.vim to zmiana gry. Nie mogę sobie wyobrazić korzystania z Vima bez niego. Uważam, że bardzo ważne jest posiadanie dobrego narzędzia do wyszukiwania, gdy zaczynasz korzystać z Vima. Widziałem ludzi mających trudności z przejściem na Vima, ponieważ wydaje się, że brakuje mu krytycznych funkcji, które mają nowoczesne edytory tekstu, takich jak łatwa i potężna funkcja wyszukiwania. Mam nadzieję, że ten rozdział pomoże ci ułatwić przejście do Vima.

Właśnie zobaczyłeś również, jak działa rozszerzalność Vima - zdolność do rozszerzania funkcjonalności wyszukiwania za pomocą wtyczki i zewnętrznego programu. W przyszłości pamiętaj o innych funkcjach, które chciałbyś rozszerzyć w Vimie. Prawdopodobnie już są w Vimie, ktoś stworzył wtyczkę lub jest już program do tego. Następnie nauczysz się o bardzo ważnym temacie w Vimie: gramatyka Vima.