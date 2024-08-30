---
description: W tym rozdziale poznasz różne sposoby uruchamiania Vima z terminala oraz
  podstawowe informacje o instalacji i korzystaniu z edytora.
title: Ch01. Starting Vim
---

W tym rozdziale nauczysz się różnych sposobów uruchamiania Vima z terminala. Używałem Vima 8.2 podczas pisania tego przewodnika. Jeśli używasz Neovim lub starszej wersji Vima, powinno być w porządku, ale pamiętaj, że niektóre polecenia mogą być niedostępne.

## Instalacja

Nie będę przechodził przez szczegółowe instrukcje, jak zainstalować Vima na konkretnej maszynie. Dobrą wiadomością jest to, że większość komputerów opartych na Uniksie powinna mieć zainstalowanego Vima. Jeśli nie, większość dystrybucji powinna mieć jakieś instrukcje dotyczące instalacji Vima.

Aby pobrać więcej informacji na temat procesu instalacji Vima, sprawdź oficjalną stronę pobierania Vima lub oficjalne repozytorium Vima na githubie:
- [Strona Vima](https://www.vim.org/download.php)
- [Github Vima](https://github.com/vim/vim)

## Polecenie Vim

Teraz, gdy masz zainstalowanego Vima, uruchom to z terminala:

```bash
vim
```

Powinieneś zobaczyć ekran powitalny. To jest miejsce, w którym będziesz pracować nad swoim nowym plikiem. W przeciwieństwie do większości edytorów tekstu i IDE, Vim jest edytorem modalnym. Jeśli chcesz wpisać "hello", musisz przełączyć się w tryb wstawiania za pomocą `i`. Naciśnij `ihello<Esc>`, aby wstawić tekst "hello".

## Wyjście z Vima

Istnieje kilka sposobów na wyjście z Vima. Najczęściej używaną metodą jest wpisanie:

```shell
:quit
```

Możesz wpisać `:q` w skrócie. To polecenie jest poleceniem w trybie linii poleceń (innym z trybów Vima). Jeśli wpiszesz `:` w trybie normalnym, kursor przesunie się na dół ekranu, gdzie możesz wpisać jakieś polecenia. Dowiesz się o trybie linii poleceń później w rozdziale 15. Jeśli jesteś w trybie wstawiania, wpisanie `:` dosłownie wyprodukuje znak ":" na ekranie. W takim przypadku musisz przełączyć się z powrotem do trybu normalnego. Naciśnij `<Esc>`, aby przełączyć się do trybu normalnego. Przy okazji, możesz również wrócić do trybu normalnego z trybu linii poleceń, naciskając `<Esc>`. Zauważysz, że możesz "uciec" z kilku trybów Vima z powrotem do trybu normalnego, naciskając `<Esc>`.

## Zapisywanie pliku

Aby zapisać swoje zmiany, wpisz:

```shell
:write
```

Możesz również wpisać `:w` w skrócie. Jeśli to jest nowy plik, musisz nadać mu nazwę, zanim będziesz mógł go zapisać. Nazwijmy go `file.txt`. Wykonaj:

```shell
:w file.txt
```

Aby zapisać i wyjść, możesz połączyć polecenia `:w` i `:q`:

```shell
:wq
```

Aby wyjść bez zapisywania jakichkolwiek zmian, dodaj `!` po `:q`, aby wymusić wyjście:

```shell
:q!
```

Istnieją inne sposoby na wyjście z Vima, ale te są tymi, których będziesz używać na co dzień.

## Pomoc

W trakcie tego przewodnika będę odsyłał cię do różnych stron pomocy Vima. Możesz przejść do strony pomocy, wpisując `:help {some-command}` (`:h` w skrócie). Możesz przekazać do polecenia `:h` temat lub nazwę polecenia jako argument. Na przykład, aby dowiedzieć się o różnych sposobach wyjścia z Vima, wpisz:

```shell
:h write-quit
```

Jak wiedziałem, aby szukać "write-quit"? Właściwie nie wiedziałem. Po prostu wpisałem `:h`, potem "quit", a następnie `<Tab>`. Vim wyświetlił odpowiednie słowa kluczowe do wyboru. Jeśli kiedykolwiek będziesz musiał coś sprawdzić ("Chciałbym, aby Vim mógł to zrobić..."), po prostu wpisz `:h` i spróbuj kilku słów kluczowych, a następnie `<Tab>`.

## Otwieranie pliku

Aby otworzyć plik (`hello1.txt`) w Vimie z terminala, uruchom:

```bash
vim hello1.txt
```

Możesz również otworzyć wiele plików jednocześnie:

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim otworzy `hello1.txt`, `hello2.txt` i `hello3.txt` w oddzielnych buforach. Dowiesz się o buforach w następnym rozdziale.

## Argumenty

Możesz przekazać polecenie terminala `vim` z różnymi flagami i opcjami.

Aby sprawdzić aktualną wersję Vima, uruchom:

```bash
vim --version
```

To powie ci aktualną wersję Vima i wszystkie dostępne funkcje oznaczone `+` lub `-`. Niektóre z tych funkcji w tym przewodniku wymagają, aby pewne funkcje były dostępne. Na przykład, będziesz badać historię linii poleceń Vima w późniejszym rozdziale za pomocą polecenia `:history`. Twój Vim musi mieć funkcję `+cmdline_history`, aby polecenie działało. Istnieje duża szansa, że Vim, którego właśnie zainstalowałeś, ma wszystkie niezbędne funkcje, szczególnie jeśli pochodzi z popularnego źródła pobierania.

Wiele rzeczy, które robisz z terminala, można również zrobić z wnętrza Vima. Aby zobaczyć wersję z *wnętrza* Vima, możesz uruchomić to:

```shell
:version
```

Jeśli chcesz otworzyć plik `hello.txt` i natychmiast wykonać polecenie Vima, możesz przekazać do polecenia `vim` opcję `+{cmd}`.

W Vimie możesz zastępować ciągi za pomocą polecenia `:s` (krótkie dla `:substitute`). Jeśli chcesz otworzyć `hello.txt` i zastąpić wszystkie "pancake" na "bagel", uruchom:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Te polecenia Vima mogą być łączone:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim zastąpi wszystkie wystąpienia "pancake" na "bagel", następnie zastąpi "bagel" na "egg", a następnie "egg" na "donut" (dowiesz się o zastępowaniu w późniejszym rozdziale).

Możesz również przekazać opcję `-c` po której następuje polecenie Vima zamiast składni `+`:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Otwieranie wielu okien

Możesz uruchomić Vima w podzielonych oknach poziomych i pionowych za pomocą opcji `-o` i `-O`, odpowiednio.

Aby otworzyć Vima z dwoma poziomymi oknami, uruchom:

```bash
vim -o2
```

Aby otworzyć Vima z 5 poziomymi oknami, uruchom:

```bash
vim -o5
```

Aby otworzyć Vima z 5 poziomymi oknami i wypełnić pierwsze dwa plikami `hello1.txt` i `hello2.txt`, uruchom:

```bash
vim -o5 hello1.txt hello2.txt
```

Aby otworzyć Vima z dwoma pionowymi oknami, 5 pionowymi oknami i 5 pionowymi oknami z 2 plikami:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Zawieszanie

Jeśli musisz zawiesić Vima w trakcie edytowania, możesz nacisnąć `Ctrl-z`. Możesz również uruchomić polecenie `:stop` lub `:suspend`. Aby wrócić do zawieszonego Vima, uruchom `fg` z terminala.

## Uruchamianie Vima w inteligentny sposób

Polecenie `vim` może przyjmować wiele różnych opcji, tak jak każde inne polecenie terminala. Dwie opcje pozwalają na przekazanie polecenia Vima jako parametru: `+{cmd}` i `-c cmd`. W miarę jak będziesz uczyć się więcej poleceń w tym przewodniku, sprawdź, czy możesz je zastosować podczas uruchamiania Vima. Będąc poleceniem terminala, możesz również łączyć `vim` z wieloma innymi poleceniami terminala. Na przykład, możesz przekierować wynik polecenia `ls`, aby edytować go w Vimie za pomocą `ls -l | vim -`.

Aby dowiedzieć się więcej o poleceniu `vim` w terminalu, sprawdź `man vim`. Aby dowiedzieć się więcej o edytorze Vim, kontynuuj czytanie tego przewodnika wraz z poleceniem `:help`.