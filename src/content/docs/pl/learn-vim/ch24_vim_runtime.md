---
description: Ten rozdział przedstawia przegląd ścieżek runtime w Vim, wyjaśniając
  ich zastosowanie i umożliwiając dalszą personalizację edytora.
title: Ch24. Vim Runtime
---

W poprzednich rozdziałach wspomniałem, że Vim automatycznie szuka specjalnych ścieżek, takich jak `pack/` (Rozdz. 22) i `compiler/` (Rozdz. 19) w katalogu `~/.vim/`. To przykłady ścieżek uruchomieniowych Vima.

Vim ma więcej ścieżek uruchomieniowych niż te dwie. W tym rozdziale poznasz ogólny przegląd tych ścieżek uruchomieniowych. Celem tego rozdziału jest pokazanie, kiedy są one wywoływane. Znajomość tego pozwoli ci lepiej zrozumieć i dostosować Vima.

## Ścieżka Uruchomieniowa

Na maszynie Unix jedną z twoich ścieżek uruchomieniowych Vima jest `$HOME/.vim/` (jeśli masz inny system operacyjny, jak Windows, twoja ścieżka może być inna). Aby zobaczyć, jakie są ścieżki uruchomieniowe dla różnych systemów operacyjnych, sprawdź `:h 'runtimepath'`. W tym rozdziale użyję `~/.vim/` jako domyślnej ścieżki uruchomieniowej.

## Skrypty Wtyczek

Vim ma ścieżkę uruchomieniową wtyczek, która wykonuje wszelkie skrypty w tym katalogu za każdym razem, gdy Vim się uruchamia. Nie myl nazwy "wtyczka" z zewnętrznymi wtyczkami Vima (takimi jak NERDTree, fzf.vim itp.).

Przejdź do katalogu `~/.vim/` i utwórz katalog `plugin/`. Utwórz dwa pliki: `donut.vim` i `chocolate.vim`.

Wewnątrz `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

Wewnątrz `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Teraz zamknij Vima. Następnym razem, gdy uruchomisz Vima, zobaczysz zarówno `"donut!"`, jak i `"chocolate!"` wyświetlone. Ścieżka uruchomieniowa wtyczek może być używana do skryptów inicjalizacyjnych.

## Wykrywanie Typu Pliku

Zanim zaczniesz, aby upewnić się, że te wykrycia działają, upewnij się, że twój vimrc zawiera przynajmniej następującą linię:

```shell
filetype plugin indent on
```

Sprawdź `:h filetype-overview`, aby uzyskać więcej kontekstu. Zasadniczo włącza to wykrywanie typu pliku w Vimie.

Kiedy otwierasz nowy plik, Vim zazwyczaj wie, jakiego rodzaju plik to jest. Jeśli masz plik `hello.rb`, uruchomienie `:set filetype?` zwraca poprawną odpowiedź `filetype=ruby`.

Vim wie, jak wykrywać "powszechne" typy plików (Ruby, Python, Javascript itp.). Ale co jeśli masz niestandardowy plik? Musisz nauczyć Vima, jak go wykrywać i przypisywać mu odpowiedni typ pliku.

Istnieją dwie metody wykrywania: użycie nazwy pliku i zawartości pliku.

### Wykrywanie Nazwy Pliku

Wykrywanie nazwy pliku wykrywa typ pliku na podstawie nazwy tego pliku. Kiedy otwierasz plik `hello.rb`, Vim wie, że jest to plik Ruby na podstawie rozszerzenia `.rb`.

Istnieją dwa sposoby, aby wykonać wykrywanie nazwy pliku: używając katalogu uruchomieniowego `ftdetect/` i używając pliku uruchomieniowego `filetype.vim`. Zbadajmy obie metody.

#### `ftdetect/`

Utwórzmy niejasny (ale smaczny) plik, `hello.chocodonut`. Kiedy go otworzysz i uruchomisz `:set filetype?`, ponieważ nie jest to powszechnie znane rozszerzenie pliku, Vim nie wie, co z tym zrobić. Zwraca `filetype=`.

Musisz poinstruować Vima, aby ustawił wszystkie pliki kończące się na `.chocodonut` jako typ pliku "chocodonut". Utwórz katalog o nazwie `ftdetect/` w katalogu uruchomieniowym (`~/.vim/`). Wewnątrz utwórz plik i nazwij go `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). Wewnątrz tego pliku dodaj:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` i `BufRead` są wywoływane za każdym razem, gdy tworzysz nowy bufor i otwierasz nowy bufor. `*.chocodonut` oznacza, że to zdarzenie zostanie wywołane tylko wtedy, gdy otwarty bufor ma rozszerzenie nazwy pliku `.chocodonut`. Na koniec, polecenie `set filetype=chocodonut` ustawia typ pliku na typ chocodonut.

Uruchom ponownie Vima. Teraz otwórz plik `hello.chocodonut` i uruchom `:set filetype?`. Zwraca `filetype=chocodonut`.

Pyszne! Możesz umieścić tyle plików, ile chcesz, w `ftdetect/`. W przyszłości możesz dodać `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim` itp., jeśli zdecydujesz się rozszerzyć swoje typy plików donut.

W rzeczywistości istnieją dwa sposoby ustawienia typu pliku w Vimie. Jednym jest to, co właśnie użyłeś `set filetype=chocodonut`. Drugim sposobem jest uruchomienie `setfiletype chocodonut`. Pierwsze polecenie `set filetype=chocodonut` *zawsze* ustawi typ pliku na typ chocodonut, podczas gdy drugie polecenie `setfiletype chocodonut` ustawi typ pliku tylko wtedy, gdy jeszcze nie został ustawiony.

#### Plik Typu Pliku

Druga metoda wykrywania pliku wymaga utworzenia pliku `filetype.vim` w katalogu głównym (`~/.vim/filetype.vim`). Dodaj to wewnątrz:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Utwórz plik `hello.plaindonut`. Kiedy go otworzysz i uruchomisz `:set filetype?`, Vim wyświetli poprawny niestandardowy typ pliku `filetype=plaindonut`.

Święty wypiek, działa! Przy okazji, jeśli bawisz się z `filetype.vim`, możesz zauważyć, że ten plik jest uruchamiany wielokrotnie, gdy otwierasz `hello.plaindonut`. Aby temu zapobiec, możesz dodać zabezpieczenie, aby główny skrypt był uruchamiany tylko raz. Zaktualizuj `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` to polecenie Vima, które zatrzymuje wykonywanie reszty skryptu. Wyrażenie `"did_load_filetypes"` *nie* jest wbudowaną funkcją Vima. Jest to w rzeczywistości zmienna globalna z `$VIMRUNTIME/filetype.vim`. Jeśli jesteś ciekawy, uruchom `:e $VIMRUNTIME/filetype.vim`. Znajdziesz te linie wewnątrz:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Kiedy Vim wywołuje ten plik, definiuje zmienną `did_load_filetypes` i ustawia ją na 1. 1 jest prawdziwe w Vimie. Powinieneś również przeczytać resztę `filetype.vim`. Zobacz, czy możesz zrozumieć, co robi, gdy Vim go wywołuje.

### Skrypt Typu Pliku

Nauczmy się, jak wykrywać i przypisywać typ pliku na podstawie zawartości pliku.

Załóżmy, że masz kolekcję plików bez akceptowalnego rozszerzenia. Jedyną rzeczą, którą te pliki mają wspólną, jest to, że wszystkie zaczynają się od słowa "donutify" w pierwszej linii. Chcesz przypisać tym plikom typ pliku `donut`. Utwórz nowe pliki o nazwach `sugardonut`, `glazeddonut` i `frieddonut` (bez rozszerzenia). W każdym pliku dodaj tę linię:

```shell
donutify
```

Kiedy uruchomisz `:set filetype?` z wnętrza `sugardonut`, Vim nie wie, jaki typ pliku przypisać temu plikowi. Zwraca `filetype=`.

W katalogu głównym uruchomieniowym dodaj plik `scripts.vim` (`~/.vim/scripts.vim`). Wewnątrz dodaj te:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

Funkcja `getline(1)` zwraca tekst z pierwszej linii. Sprawdza, czy pierwsza linia zaczyna się od słowa "donutify". Funkcja `did_filetype()` jest wbudowaną funkcją Vima. Zwraca prawdę, gdy zdarzenie związane z typem pliku zostanie wywołane przynajmniej raz. Jest używana jako zabezpieczenie, aby zatrzymać ponowne uruchamianie zdarzenia typu pliku.

Otwórz plik `sugardonut` i uruchom `:set filetype?`, Vim teraz zwraca `filetype=donut`. Jeśli otworzysz inne pliki donut (`glazeddonut` i `frieddonut`), Vim również identyfikuje ich typy plików jako typy donut.

Zauważ, że `scripts.vim` jest uruchamiany tylko wtedy, gdy Vim otwiera plik z nieznanym typem pliku. Jeśli Vim otwiera plik z znanym typem pliku, `scripts.vim` nie zostanie uruchomiony.

## Wtyczka Typu Pliku

Co jeśli chcesz, aby Vim uruchamiał skrypty specyficzne dla chocodonut, gdy otwierasz plik chocodonut, a nie uruchamiał tych skryptów przy otwieraniu pliku plaindonut?

Możesz to zrobić za pomocą ścieżki uruchomieniowej wtyczek typu pliku (`~/.vim/ftplugin/`). Vim przeszukuje ten katalog w poszukiwaniu pliku o tej samej nazwie, co właśnie otwarty typ pliku. Utwórz plik `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

Utwórz inny plik ftplugin, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

Teraz za każdym razem, gdy otwierasz plik typu chocodonut, Vim uruchamia skrypty z `~/.vim/ftplugin/chocodonut.vim`. Za każdym razem, gdy otwierasz plik typu plaindonut, Vim uruchamia skrypty z `~/.vim/ftplugin/plaindonut.vim`.

Jedno ostrzeżenie: te pliki są uruchamiane za każdym razem, gdy ustawiany jest typ pliku bufora (`set filetype=chocodonut`, na przykład). Jeśli otworzysz 3 różne pliki chocodonut, skrypty zostaną uruchomione *łącznie* trzy razy.

## Pliki Wcięć

Vim ma ścieżkę uruchomieniową wcięć, która działa podobnie do ftplugin, gdzie Vim szuka pliku o tej samej nazwie, co otwarty typ pliku. Celem tych ścieżek uruchomieniowych wcięć jest przechowywanie kodów związanych z wcięciami. Jeśli masz plik `~/.vim/indent/chocodonut.vim`, zostanie on wykonany tylko wtedy, gdy otworzysz plik typu chocodonut. Możesz przechowywać kody związane z wcięciami dla plików chocodonut tutaj.

## Kolory

Vim ma ścieżkę uruchomieniową kolorów (`~/.vim/colors/`), aby przechowywać schematy kolorów. Każdy plik, który znajduje się w tym katalogu, będzie wyświetlany w poleceniu `:color`.

Jeśli masz plik `~/.vim/colors/beautifulprettycolors.vim`, gdy uruchomisz `:color` i naciśniesz Tab, zobaczysz `beautifulprettycolors` jako jedną z opcji kolorów. Jeśli wolisz dodać własny schemat kolorów, to jest miejsce, do którego należy się udać.

Jeśli chcesz sprawdzić schematy kolorów stworzone przez innych, dobrym miejscem do odwiedzenia jest [vimcolors](https://vimcolors.com/).

## Podświetlanie Składni

Vim ma ścieżkę uruchomieniową składni (`~/.vim/syntax/`), aby zdefiniować podświetlanie składni.

Załóżmy, że masz plik `hello.chocodonut`, w którym masz następujące wyrażenia:

```shell
(donut "tasty")
(donut "savory")
```

Chociaż Vim teraz zna poprawny typ pliku, wszystkie teksty mają ten sam kolor. Dodajmy regułę podświetlania składni, aby podświetlić słowo kluczowe "donut". Utwórz nowy plik składni chocodonut, `~/.vim/syntax/chocodonut.vim`. Wewnątrz dodaj:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Teraz ponownie otwórz plik `hello.chocodonut`. Słowa kluczowe `donut` są teraz podświetlone.

Ten rozdział nie omówi podświetlania składni w szczegółach. To obszerny temat. Jeśli jesteś ciekawy, sprawdź `:h syntax.txt`.

Wtyczka [vim-polyglot](https://github.com/sheerun/vim-polyglot) to świetna wtyczka, która zapewnia podświetlanie dla wielu popularnych języków programowania.

## Dokumentacja

Jeśli tworzysz wtyczkę, będziesz musiał stworzyć własną dokumentację. Używasz do tego ścieżki uruchomieniowej doc.

Utwórzmy podstawową dokumentację dla słów kluczowych chocodonut i plaindonut. Utwórz plik `donut.txt` (`~/.vim/doc/donut.txt`). Wewnątrz dodaj te teksty:

```shell
*chocodonut* Pyszny czekoladowy donut

*plaindonut* Brak dobroci czekoladowej, ale wciąż pyszny
```

Jeśli spróbujesz wyszukać `chocodonut` i `plaindonut` (`:h chocodonut` i `:h plaindonut`), nie znajdziesz nic.

Najpierw musisz uruchomić `:helptags`, aby wygenerować nowe wpisy pomocy. Uruchom `:helptags ~/.vim/doc/`

Teraz, jeśli uruchomisz `:h chocodonut` i `:h plaindonut`, znajdziesz te nowe wpisy pomocy. Zauważ, że plik jest teraz tylko do odczytu i ma typ pliku "pomoc".
## Lazy Loading Scripts

Wszystkie ścieżki runtime, które poznałeś w tym rozdziale, były uruchamiane automatycznie. Jeśli chcesz ręcznie załadować skrypt, użyj ścieżki runtime autoload.

Utwórz katalog autoload (`~/.vim/autoload/`). Wewnątrz tego katalogu stwórz nowy plik i nazwij go `tasty.vim` (`~/.vim/autoload/tasty.vim`). Wewnątrz niego:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Zauważ, że nazwa funkcji to `tasty#donut`, a nie `donut()`. Znak krzyżyka (`#`) jest wymagany przy używaniu funkcji autoload. Konwencja nazewnictwa funkcji dla funkcji autoload to:

```shell
function fileName#functionName()
  ...
endfunction
```

W tym przypadku nazwa pliku to `tasty.vim`, a nazwa funkcji to (technicznie) `donut`.

Aby wywołać funkcję, potrzebujesz komendy `call`. Wywołajmy tę funkcję za pomocą `:call tasty#donut()`.

Za pierwszym razem, gdy wywołasz funkcję, powinieneś zobaczyć *obie* wiadomości echo ("tasty.vim global" i "tasty#donut"). Kolejne wywołania funkcji `tasty#donut` będą wyświetlały tylko wiadomość "testy#donut".

Kiedy otwierasz plik w Vimie, w przeciwieństwie do poprzednich ścieżek runtime, skrypty autoload nie są ładowane automatycznie. Tylko gdy wyraźnie wywołasz `tasty#donut()`, Vim szuka pliku `tasty.vim` i ładuje wszystko, co się w nim znajduje, w tym funkcję `tasty#donut()`. Autoload to idealny mechanizm dla funkcji, które używają dużych zasobów, ale nie są często używane.

Możesz dodać tyle zagnieżdżonych katalogów z autoload, ile chcesz. Jeśli masz ścieżkę runtime `~/.vim/autoload/one/two/three/tasty.vim`, możesz wywołać funkcję za pomocą `:call one#two#three#tasty#donut()`.

## After Scripts

Vim ma ścieżkę runtime after (`~/.vim/after/`), która odzwierciedla strukturę `~/.vim/`. Cokolwiek znajduje się w tej ścieżce, jest wykonywane na końcu, więc deweloperzy zazwyczaj używają tych ścieżek do nadpisywania skryptów.

Na przykład, jeśli chcesz nadpisać skrypty z `plugin/chocolate.vim`, możesz utworzyć `~/.vim/after/plugin/chocolate.vim`, aby umieścić skrypty nadpisujące. Vim uruchomi `~/.vim/after/plugin/chocolate.vim` *po* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

Vim ma zmienną środowiskową `$VIMRUNTIME` dla domyślnych skryptów i plików wsparcia. Możesz to sprawdzić, uruchamiając `:e $VIMRUNTIME`.

Struktura powinna wyglądać znajomo. Zawiera wiele ścieżek runtime, które poznałeś w tym rozdziale.

Przypomnij sobie, w Rozdziale 21, nauczyłeś się, że gdy otwierasz Vima, szuka plików vimrc w siedmiu różnych lokalizacjach. Powiedziałem, że ostatnią lokalizacją, którą sprawdza Vim, jest `$VIMRUNTIME/defaults.vim`. Jeśli Vim nie znajdzie żadnych plików vimrc użytkownika, używa `defaults.vim` jako vimrc.

Czy kiedykolwiek próbowałeś uruchomić Vima bez wtyczki składniowej, takiej jak vim-polyglot, a mimo to twój plik nadal był podświetlany składniowo? To dlatego, że gdy Vim nie może znaleźć pliku składniowego w ścieżce runtime, Vim szuka pliku składniowego w katalogu składni `$VIMRUNTIME`.

Aby dowiedzieć się więcej, sprawdź `:h $VIMRUNTIME`.

## Opcja Runtimepath

Aby sprawdzić swoją ścieżkę runtime, uruchom `:set runtimepath?`

Jeśli używasz Vim-Plug lub popularnych menedżerów wtyczek, powinno to wyświetlić listę katalogów. Na przykład, moja pokazuje:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Jedną z rzeczy, które robią menedżery wtyczek, jest dodawanie każdej wtyczki do ścieżki runtime. Każda ścieżka runtime może mieć swoją własną strukturę katalogów podobną do `~/.vim/`.

Jeśli masz katalog `~/box/of/donuts/` i chcesz dodać ten katalog do swojej ścieżki runtime, możesz dodać to do swojego vimrc:

```shell
set rtp+=$HOME/box/of/donuts/
```

Jeśli w `~/box/of/donuts/` masz katalog wtyczek (`~/box/of/donuts/plugin/hello.vim`) i ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), Vim uruchomi wszystkie skrypty z `plugin/hello.vim`, gdy otworzysz Vima. Vim również uruchomi `ftplugin/chocodonut.vim`, gdy otworzysz plik chocodonut.

Spróbuj tego sam: utwórz dowolną ścieżkę i dodaj ją do swojej ścieżki runtime. Dodaj niektóre z ścieżek runtime, które poznałeś w tym rozdziale. Upewnij się, że działają zgodnie z oczekiwaniami.

## Ucz się Runtime w Mądry Sposób

Poświęć czas na przeczytanie tego i zabawę z tymi ścieżkami runtime. Aby zobaczyć, jak ścieżki runtime są używane w praktyce, przejdź do repozytorium jednej z ulubionych wtyczek Vima i zbadaj jej strukturę katalogów. Powinieneś być w stanie zrozumieć większość z nich teraz. Spróbuj podążać za tym i dostrzegać szerszy obraz. Teraz, gdy rozumiesz strukturę katalogów Vima, jesteś gotowy, aby nauczyć się Vimscript.