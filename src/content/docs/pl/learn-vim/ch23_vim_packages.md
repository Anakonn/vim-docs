---
description: W tym rozdziale poznasz, jak korzystać z wbudowanego menedżera pakietów
  Vim do instalacji wtyczek oraz mechanizmów ładowania pakietów.
title: Ch23. Vim Packages
---

W poprzednim rozdziale wspomniałem o używaniu zewnętrznego menedżera wtyczek do instalacji wtyczek. Od wersji 8, Vim ma własny wbudowany menedżer wtyczek zwany *packages*. W tym rozdziale nauczysz się, jak używać pakietów Vim do instalacji wtyczek.

Aby sprawdzić, czy Twoja wersja Vima ma możliwość korzystania z pakietów, uruchom `:version` i poszukaj atrybutu `+packages`. Alternatywnie, możesz również uruchomić `:echo has('packages')` (jeśli zwróci 1, to ma możliwość korzystania z pakietów).

## Katalog Pakietów

Sprawdź, czy masz katalog `~/.vim/` w głównym katalogu. Jeśli go nie masz, stwórz go. Wewnątrz utwórz katalog o nazwie `pack` (`~/.vim/pack/`). Vim automatycznie wie, aby szukać pakietów w tym katalogu.

## Dwa Typy Ładowania

Pakiet Vim ma dwa mechanizmy ładowania: automatyczne i ręczne ładowanie.

### Automatyczne Ładowanie

Aby ładować wtyczki automatycznie przy starcie Vima, musisz umieścić je w katalogu `start/`. Ścieżka wygląda tak:

```shell
~/.vim/pack/*/start/
```

Możesz zapytać, "Co to jest `*` między `pack/` a `start/`?" `*` to dowolna nazwa i może być czymkolwiek chcesz. Nazwijmy to `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

Pamiętaj, że jeśli to pominiesz i zrobisz coś takiego:

```shell
~/.vim/pack/start/
```

System pakietów nie będzie działał. Ważne jest, aby umieścić nazwę między `pack/` a `start/`.

Dla tego przykładu spróbujmy zainstalować wtyczkę [NERDTree](https://github.com/preservim/nerdtree). Przejdź do katalogu `start/` (`cd ~/.vim/pack/packdemo/start/`) i sklonuj repozytorium NERDTree:

```shell
git clone https://github.com/preservim/nerdtree.git
```

To wszystko! Jesteś gotowy. Następnym razem, gdy uruchomisz Vima, możesz natychmiast wykonać polecenia NERDTree, takie jak `:NERDTreeToggle`.

Możesz sklonować tyle repozytoriów wtyczek, ile chcesz w ścieżce `~/.vim/pack/*/start/`. Vim automatycznie załaduje każdą z nich. Jeśli usuniesz sklonowane repozytorium (`rm -rf nerdtree/`), ta wtyczka nie będzie już dostępna.

### Ręczne Ładowanie

Aby ładować wtyczki ręcznie przy starcie Vima, musisz umieścić je w katalogu `opt/`. Podobnie jak w przypadku automatycznego ładowania, ścieżka wygląda tak:

```shell
~/.vim/pack/*/opt/
```

Użyjmy tego samego katalogu `packdemo/` z wcześniejszego przykładu:

```shell
~/.vim/pack/packdemo/opt/
```

Tym razem zainstalujmy grę [killersheep](https://github.com/vim/killersheep) (to wymaga Vima 8.2). Przejdź do katalogu `opt/` (`cd ~/.vim/pack/packdemo/opt/`) i sklonuj repozytorium:

```shell
git clone https://github.com/vim/killersheep.git
```

Uruchom Vima. Polecenie do uruchomienia gry to `:KillKillKill`. Spróbuj je uruchomić. Vim zgłosi, że to nie jest prawidłowe polecenie edytora. Musisz najpierw *ręcznie* załadować wtyczkę. Zróbmy to:

```shell
:packadd killersheep
```

Teraz spróbuj ponownie uruchomić polecenie `:KillKillKill`. Polecenie powinno teraz działać.

Możesz się zastanawiać, "Dlaczego kiedykolwiek chciałbym ręcznie ładować pakiety? Czy nie lepiej automatycznie ładować wszystko na początku?"

Świetne pytanie. Czasami są wtyczki, których nie będziesz używać cały czas, jak ta gra KillerSheep. Prawdopodobnie nie musisz ładować 10 różnych gier i spowalniać czas uruchamiania Vima. Jednak od czasu do czasu, gdy się nudzisz, możesz chcieć zagrać w kilka gier. Użyj ręcznego ładowania dla wtyczek nieistotnych.

Możesz również użyć tego do warunkowego dodawania wtyczek. Może używasz zarówno Neovim, jak i Vima, a są wtyczki zoptymalizowane dla Neovim. Możesz dodać coś takiego w swoim vimrc:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Organizowanie Pakietów

Przypomnij, że wymaganiem do korzystania z systemu pakietów Vima jest posiadanie:

```shell
~/.vim/pack/*/start/
```

Lub:

```shell
~/.vim/pack/*/opt/
```

Fakt, że `*` może być *dowolną* nazwą, może być użyty do organizowania Twoich pakietów. Załóżmy, że chcesz pogrupować swoje wtyczki według kategorii (kolory, składnia i gry):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Możesz nadal używać `start/` i `opt/` wewnątrz każdego z katalogów.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Dodawanie Pakietów w Inteligentny Sposób

Możesz się zastanawiać, czy pakiety Vima uczynią popularne menedżery wtyczek, takie jak vim-pathogen, vundle.vim, dein.vim i vim-plug, przestarzałymi.

Odpowiedź brzmi, jak zawsze, "to zależy".

Nadal używam vim-plug, ponieważ ułatwia dodawanie, usuwanie lub aktualizowanie wtyczek. Jeśli używasz wielu wtyczek, może być wygodniej korzystać z menedżerów wtyczek, ponieważ łatwo jest aktualizować wiele jednocześnie. Niektóre menedżery wtyczek oferują również funkcjonalności asynchroniczne.

Jeśli jesteś minimalistą, wypróbuj pakiety Vima. Jeśli jesteś intensywnym użytkownikiem wtyczek, możesz rozważyć użycie menedżera wtyczek.