---
description: Niniejszy dokument przedstawia, jak kompilować kod w Vimie, wykorzystując
  polecenia `:make` oraz skrypty makefile do uproszczenia procesu kompilacji.
title: Ch19. Compile
---

Kompilacja jest ważnym tematem dla wielu języków. W tym rozdziale nauczysz się, jak kompilować z Vim. Przyjrzysz się również sposobom wykorzystania polecenia `:make` w Vim.

## Kompilacja z Linii Poleceń

Możesz użyć operatora bang (`!`), aby skompilować. Jeśli musisz skompilować swój plik `.cpp` za pomocą `g++`, uruchom:

```shell
:!g++ hello.cpp -o hello
```

Jednak ręczne wpisywanie nazwy pliku i nazwy pliku wyjściowego za każdym razem jest podatne na błędy i nużące. Plik makefile to właściwe rozwiązanie.

## Polecenie Make

Vim ma polecenie `:make`, aby uruchomić plik makefile. Kiedy je uruchomisz, Vim szuka pliku makefile w bieżącym katalogu do wykonania.

Utwórz plik o nazwie `makefile` w bieżącym katalogu i umieść w nim to:

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Uruchom to z Vim:

```shell
:make
```

Vim wykonuje to w ten sam sposób, jak gdybyś uruchamiał to z terminala. Polecenie `:make` akceptuje parametry tak samo jak polecenie make w terminalu. Uruchom:

```shell
:make foo
" Wyjście "Hello foo"

:make list_pls
" Wyjście wyniku polecenia ls
```

Polecenie `:make` używa quickfix w Vim do przechowywania wszelkich błędów, jeśli uruchomisz złe polecenie. Uruchommy nieistniejący cel:

```shell
:make dontexist
```

Powinieneś zobaczyć błąd podczas uruchamiania tego polecenia. Aby zobaczyć ten błąd, uruchom polecenie quickfix `:copen`, aby wyświetlić okno quickfix:

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Kompilacja z Make

Użyjmy pliku makefile do skompilowania podstawowego programu `.cpp`. Najpierw utwórz plik `hello.cpp`:

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Zaktualizuj swój plik makefile, aby zbudować i uruchomić plik `.cpp`:

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Teraz uruchom:

```shell
:make build
```

`g++` kompiluje `./hello.cpp` i tworzy `./hello`. Następnie uruchom:

```shell
:make run
```

Powinieneś zobaczyć `"Hello!"` wydrukowane w terminalu.

## Inny Program Make

Kiedy uruchamiasz `:make`, Vim faktycznie uruchamia dowolne polecenie, które jest ustawione w opcji `makeprg`. Jeśli uruchomisz `:set makeprg?`, zobaczysz:

```shell
makeprg=make
```

Domyślne polecenie `:make` to zewnętrzne polecenie `make`. Aby zmienić polecenie `:make`, aby za każdym razem wykonywało `g++ {nazwa-twojego-pliku}`, uruchom:

```shell
:set makeprg=g++\ %
```

` \` jest używane do ucieczki przed spacją po `g++`. Symbol `%` w Vim reprezentuje bieżący plik. Polecenie `g++\\ %` jest równoważne z uruchomieniem `g++ hello.cpp`.

Przejdź do `./hello.cpp`, a następnie uruchom `:make`. Vim kompiluje `hello.cpp` i tworzy `a.out`, ponieważ nie określiłeś wyjścia. Przeorganizujmy to, aby nazwa skompilowanego wyjścia była taka sama jak oryginalny plik bez rozszerzenia. Uruchom lub dodaj to do vimrc:

```shell
set makeprg=g++\ %\ -o\ %<
```

Rozbicie:
- `g++\ %` jest takie samo jak powyżej. Jest równoważne z uruchomieniem `g++ <twój-plik>`.
- `-o` to opcja wyjścia.
- `%<` w Vim reprezentuje nazwę bieżącego pliku bez rozszerzenia (`hello.cpp` staje się `hello`).

Kiedy uruchomisz `:make` z wnętrza `./hello.cpp`, jest kompilowane do `./hello`. Aby szybko wykonać `./hello` z wnętrza `./hello.cpp`, uruchom `:!./%<`. Ponownie, to jest to samo, co uruchomienie `:!./{nazwa-bieżącego-pliku-bez-rozszerzenia}`.

Aby uzyskać więcej informacji, sprawdź `:h :compiler` i `:h write-compiler-plugin`.

## Automatyczna Kompilacja przy Zapisie

Możesz ułatwić sobie życie, automatyzując kompilację. Przypomnij sobie, że możesz użyć `autocmd` w Vim, aby wywołać automatyczne akcje na podstawie określonych zdarzeń. Aby automatycznie kompilować pliki `.cpp` przy każdym zapisie, dodaj to do swojego vimrc:

```shell
autocmd BufWritePost *.cpp make
```

Za każdym razem, gdy zapisujesz w pliku `.cpp`, Vim wykonuje polecenie `make`.

## Zmiana Kompilatora

Vim ma polecenie `:compiler`, aby szybko zmieniać kompilatory. Twoja wersja Vim prawdopodobnie zawiera kilka wstępnie skonfigurowanych konfiguracji kompilatorów. Aby sprawdzić, jakie kompilatory masz, uruchom:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Powinieneś zobaczyć listę kompilatorów dla różnych języków programowania.

Aby użyć polecenia `:compiler`, załóżmy, że masz plik ruby, `hello.rb`, a w środku ma:

```shell
puts "Hello ruby"
```

Przypomnij sobie, że jeśli uruchomisz `:make`, Vim wykonuje dowolne polecenie przypisane do `makeprg` (domyślnie to `make`). Jeśli uruchomisz:

```shell
:compiler ruby
```

Vim uruchomi skrypt `$VIMRUNTIME/compiler/ruby.vim` i zmieni `makeprg`, aby używało polecenia `ruby`. Teraz, jeśli uruchomisz `:set makeprg?`, powinno powiedzieć `makeprg=ruby` (to zależy od tego, co jest w twoim `$VIMRUNTIME/compiler/ruby.vim` lub jeśli masz inne niestandardowe kompilatory ruby. Twoje mogą być inne). Polecenie `:compiler {twój-język}` pozwala szybko przełączać się między różnymi kompilatorami. To jest przydatne, jeśli twój projekt używa wielu języków.

Nie musisz używać `:compiler` i `makeprg`, aby skompilować program. Możesz uruchomić skrypt testowy, sprawdzić plik, wysłać sygnał lub cokolwiek chcesz.

## Tworzenie Niestandardowego Kompilatora

Utwórzmy prosty kompilator Typescript. Zainstaluj Typescript (`npm install -g typescript`) na swoim komputerze. Powinieneś teraz mieć polecenie `tsc`. Jeśli wcześniej nie bawiłeś się Typescriptem, `tsc` kompiluje plik Typescript do pliku Javascript. Załóżmy, że masz plik `hello.ts`:

```shell
const hello = "hello";
console.log(hello);
```

Jeśli uruchomisz `tsc hello.ts`, skompiluje to do `hello.js`. Jednak jeśli masz następujące wyrażenia w `hello.ts`:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

To spowoduje błąd, ponieważ nie możesz modyfikować zmiennej `const`. Uruchomienie `tsc hello.ts` spowoduje błąd:

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

Aby stworzyć prosty kompilator Typescript, w swoim katalogu `~/.vim/` dodaj katalog `compiler` (`~/.vim/compiler/`), a następnie utwórz plik `typescript.vim` (`~/.vim/compiler/typescript.vim`). Umieść w nim to:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

Pierwsza linia ustawia `makeprg` na uruchomienie polecenia `tsc`. Druga linia ustawia format błędu, aby wyświetlał plik (`%f`), po którym następuje dosłowny dwukropek (`:`) i ucieczka przed spacją (`\ `), a następnie komunikat o błędzie (`%m`). Aby dowiedzieć się więcej o formatowaniu błędów, sprawdź `:h errorformat`.

Powinieneś również przeczytać kilka wstępnie przygotowanych kompilatorów, aby zobaczyć, jak inni to robią. Sprawdź `:e $VIMRUNTIME/compiler/<jakikolwiek-język>.vim`.

Ponieważ niektóre wtyczki mogą zakłócać plik Typescript, otwórz `hello.ts` bez żadnej wtyczki, używając flagi `--noplugin`:

```shell
vim --noplugin hello.ts
```

Sprawdź `makeprg`:

```shell
:set makeprg?
```

Powinno powiedzieć domyślne program `make`. Aby użyć nowego kompilatora Typescript, uruchom:

```shell
:compiler typescript
```

Kiedy uruchomisz `:set makeprg?`, powinno teraz powiedzieć `tsc`. Przetestujmy to. Uruchom:

```shell
:make %
```

Przypomnij sobie, że `%` oznacza bieżący plik. Obserwuj, jak twój kompilator Typescript działa zgodnie z oczekiwaniami! Aby zobaczyć listę błędów, uruchom `:copen`.

## Kompilator Asynchroniczny

Czasami kompilacja może zająć dużo czasu. Nie chcesz wpatrywać się w zamrożony Vim, czekając na zakończenie procesu kompilacji. Czyż nie byłoby miło, gdybyś mógł kompilować asynchronicznie, aby nadal korzystać z Vima podczas kompilacji?

Na szczęście są wtyczki do uruchamiania procesów asynchronicznych. Dwie główne to:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

W pozostałej części tego rozdziału omówię vim-dispatch, ale zdecydowanie zachęcam cię do wypróbowania wszystkich dostępnych.

*Vim i NeoVim faktycznie obsługują asynchroniczne zadania, ale wykracza to poza zakres tego rozdziału. Jeśli jesteś ciekawy, sprawdź `:h job-channel-overview.txt`.*

## Wtyczka: Vim-dispatch

Vim-dispatch ma kilka poleceń, ale dwa główne to polecenia `:Make` i `:Dispatch`.

### Asynchroniczna Kompilacja

Polecenie `:Make` w vim-dispatch jest podobne do `:make` w Vim, ale działa asynchronicznie. Jeśli jesteś w projekcie Javascript i musisz uruchomić `npm t`, możesz spróbować ustawić swój makeprg na:

```shell
:set makeprg=npm\\ t
```

Jeśli uruchomisz:

```shell
:make
```

Vim wykona `npm t`, ale będziesz patrzył na zamrożony ekran, podczas gdy twoje testy JavaScript będą się uruchamiać. Z vim-dispatch możesz po prostu uruchomić:

```shell
:Make
```

Vim uruchomi `npm t` asynchronicznie. W ten sposób, podczas gdy `npm t` działa w tle, możesz kontynuować to, co robiłeś. Niesamowite!

### Asynchroniczny Dispatch

Polecenie `:Dispatch` jest jak `:compiler` i polecenie `:!`. Może uruchomić dowolne zewnętrzne polecenie asynchronicznie w Vim.

Załóżmy, że jesteś w pliku spec ruby i musisz uruchomić test. Uruchom:

```shell
:Dispatch bundle exec rspec %
```

Vim asynchronicznie uruchomi polecenie `rspec` dla bieżącego pliku (`%`).

### Automatyzacja Dispatch

Vim-dispatch ma zmienną bufora `b:dispatch`, którą możesz skonfigurować, aby automatycznie oceniać konkretne polecenie. Możesz to wykorzystać z `autocmd`. Jeśli dodasz to do swojego vimrc:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Teraz za każdym razem, gdy wejdziesz do pliku (`BufEnter`), który kończy się na `_spec.rb`, uruchomienie `:Dispatch` automatycznie wykonuje `bundle exec rspec {twój-bieżący-pliki-spec-ruby}`.

## Naucz się Kompilować w Mądry Sposób

W tym rozdziale nauczyłeś się, że możesz używać poleceń `make` i `compiler`, aby uruchamiać *jakikolwiek* proces z wnętrza Vim asynchronicznie, aby uzupełnić swój workflow programistyczny. Zdolność Vima do rozszerzania się o inne programy czyni go potężnym.