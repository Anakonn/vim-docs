---
description: Przewodnik ten ułatwia naukę Vima, koncentrując się na kluczowych funkcjach,
  które pozwolą stać się efektywnym użytkownikiem w krótkim czasie.
title: Ch00. Read This First
---

## Dlaczego ten przewodnik został napisany

Jest wiele miejsc, gdzie można nauczyć się Vima: `vimtutor` to świetne miejsce na początek, a podręcznik `:help` zawiera wszystkie odniesienia, których kiedykolwiek będziesz potrzebować.

Jednak przeciętny użytkownik potrzebuje czegoś więcej niż `vimtutor` i mniej niż podręcznik `:help`. Ten przewodnik stara się wypełnić tę lukę, podkreślając tylko kluczowe funkcje, aby nauczyć się najbardziej przydatnych części Vima w jak najkrótszym czasie.

Prawdopodobnie nie będziesz potrzebować 100% funkcji Vima. Prawdopodobnie wystarczy, że poznasz około 20% z nich, aby stać się potężnym Vimmerem. Ten przewodnik pokaże ci, które funkcje Vima będą dla ciebie najbardziej przydatne.

To jest przewodnik subiektywny. Zawiera techniki, które często stosuję podczas korzystania z Vima. Rozdziały są uporządkowane w sposób, który, moim zdaniem, ma największy sens logiczny dla początkującego uczącego się Vima.

Ten przewodnik jest bogaty w przykłady. Podczas nauki nowej umiejętności przykłady są niezbędne, a liczne przykłady skuteczniej utrwalają te koncepcje.

Niektórzy z was mogą się zastanawiać, dlaczego trzeba uczyć się Vimscript? W moim pierwszym roku korzystania z Vima byłem zadowolony, wiedząc tylko, jak korzystać z Vima. Czas mijał, a ja coraz bardziej potrzebowałem Vimscript do pisania niestandardowych poleceń dla moich specyficznych potrzeb edycyjnych. Kiedy opanujesz Vima, prędzej czy później będziesz musiał nauczyć się Vimscript. Więc dlaczego nie wcześniej? Vimscript to mały język. Możesz nauczyć się jego podstaw w zaledwie czterech rozdziałach tego przewodnika.

Możesz daleko zajść, używając Vima bez znajomości Vimscript, ale jego znajomość pomoże ci osiągnąć jeszcze więcej.

Ten przewodnik jest napisany zarówno dla początkujących, jak i zaawansowanych Vimmerów. Zaczyna się od szerokich i prostych koncepcji, a kończy na specyficznych i zaawansowanych koncepcjach. Jeśli już jesteś zaawansowanym użytkownikiem, zachęcam cię do przeczytania tego przewodnika od początku do końca, ponieważ nauczysz się czegoś nowego!

## Jak przejść na Vima z innego edytora tekstu

Nauka Vima to satysfakcjonujące doświadczenie, chociaż trudne. Istnieją dwa główne podejścia do nauki Vima:

1. Zimny indyk
2. Stopniowe

Zimny indyk oznacza zaprzestanie korzystania z dowolnego edytora / IDE, którego używałeś i rozpoczęcie korzystania z Vima wyłącznie od teraz. Wadą tej metody jest to, że będziesz miał poważny spadek wydajności przez pierwszy tydzień lub dwa. Jeśli jesteś programistą na pełen etat, ta metoda może być niepraktyczna. Dlatego dla większości ludzi uważam, że najlepszym sposobem na przejście na Vima jest stopniowe korzystanie z niego.

Aby stopniowo korzystać z Vima, przez pierwsze dwa tygodnie spędź godzinę dziennie, używając Vima jako swojego edytora, podczas gdy resztę czasu możesz korzystać z innych edytorów. Wiele nowoczesnych edytorów ma wtyczki Vima. Kiedy zaczynałem, używałem popularnej wtyczki Vima dla VSCode przez godzinę dziennie. Stopniowo zwiększałem czas korzystania z wtyczki Vima, aż w końcu używałem jej przez cały dzień. Pamiętaj, że te wtyczki mogą emulować tylko część funkcji Vima. Aby doświadczyć pełnej mocy Vima, takiej jak Vimscript, polecenia wiersza poleceń (Ex) i integracja poleceń zewnętrznych, będziesz musiał używać samego Vima.

Były dwa kluczowe momenty, które sprawiły, że zacząłem używać Vima w 100%: kiedy zrozumiałem, że Vim ma strukturę przypominającą gramatykę (zobacz rozdział 4) oraz wtyczkę [fzf.vim](https://github.com/junegunn/fzf.vim) (zobacz rozdział 3).

Pierwszy moment, kiedy zdałem sobie sprawę z gramatycznej struktury Vima, był decydującym momentem, w którym w końcu zrozumiałem, o czym mówili ci użytkownicy Vima. Nie musiałem uczyć się setek unikalnych poleceń. Musiałem tylko nauczyć się małej garstki poleceń, które mogłem łączyć w bardzo intuicyjny sposób, aby robić wiele rzeczy.

Drugi moment, możliwość szybkiego uruchamiania fuzzy file-search, była funkcją IDE, którą używałem najczęściej. Kiedy nauczyłem się, jak to zrobić w Vimie, zyskałem ogromny wzrost prędkości i od tego czasu nigdy nie spojrzałem wstecz.

Każdy programuje inaczej. Po introspekcji odkryjesz, że istnieje jedna lub dwie funkcje z twojego ulubionego edytora / IDE, które używasz cały czas. Może to była fuzzy-search, skok do definicji lub szybka kompilacja. Cokolwiek to jest, zidentyfikuj je szybko i naucz się, jak je zaimplementować w Vimie (prawdopodobnie Vim również może je zrobić). Twoja prędkość edycji znacznie wzrośnie.

Gdy możesz edytować z prędkością 50% oryginalnej prędkości, nadszedł czas, aby przejść na pełnoetatowego Vima.

## Jak czytać ten przewodnik

To jest praktyczny przewodnik. Aby stać się dobrym w Vimie, musisz rozwijać swoją pamięć mięśniową, a nie wiedzę teoretyczną.

Nie uczysz się jeździć na rowerze, czytając przewodnik o tym, jak jeździć na rowerze. Musisz faktycznie jeździć na rowerze.

Musisz wpisać każde polecenie, o którym mowa w tym przewodniku. Nie tylko to, ale musisz powtarzać je kilka razy i próbować różnych kombinacji. Sprawdź, jakie inne funkcje ma polecenie, które właśnie nauczyłeś się. Polecenie `:help` i wyszukiwarki internetowe są twoimi najlepszymi przyjaciółmi. Twoim celem nie jest wiedzieć wszystko o poleceniu, ale być w stanie wykonać to polecenie naturalnie i instynktownie.

Ile razy staram się, aby ten przewodnik był liniowy, niektóre koncepcje w tym przewodniku muszą być przedstawione w nieodpowiedniej kolejności. Na przykład w rozdziale 1 wspominam o poleceniu substytucji (`:s`), mimo że nie będzie ono omawiane aż do rozdziału 12. Aby to naprawić, za każdym razem, gdy nowa koncepcja, która nie została jeszcze omówiona, jest wspomniana wcześniej, podam szybki przewodnik, jak to zrobić, bez szczegółowego wyjaśnienia. Więc proszę, miejcie cierpliwość :).

## Więcej pomocy

Oto dodatkowa wskazówka dotycząca korzystania z podręcznika pomocy: załóżmy, że chcesz dowiedzieć się więcej o tym, co robi `Ctrl-P` w trybie wstawiania. Jeśli po prostu wyszukasz `:h CTRL-P`, zostaniesz skierowany do `Ctrl-P` w trybie normalnym. To nie jest pomoc `Ctrl-P`, której szukasz. W takim przypadku wyszukaj zamiast tego `:h i_CTRL-P`. Dodane `i_` oznacza tryb wstawiania. Zwróć uwagę, do którego trybu to należy.

## Składnia

Większość fraz związanych z poleceniami lub kodem jest w formacie kodu (`tak jak to`).

Ciągi są otoczone parą podwójnych cudzysłowów ("tak jak to").

Polecenia Vima mogą być skracane. Na przykład, `:join` można skrócić do `:j`. W całym przewodniku będę mieszał skrócone i pełne opisy. Dla poleceń, które nie są często używane w tym przewodniku, użyję wersji pełnej. Dla poleceń, które są często używane, użyję wersji skróconej. Przepraszam za niespójności. Ogólnie rzecz biorąc, za każdym razem, gdy zauważysz nowe polecenie, zawsze sprawdzaj je w `:help`, aby zobaczyć jego skróty.

## Vimrc

W różnych miejscach w przewodniku będę odnosił się do opcji vimrc. Jeśli jesteś nowy w Vimie, vimrc jest jak plik konfiguracyjny.

Vimrc nie będzie omawiane aż do rozdziału 21. Dla jasności, pokażę krótko, jak go skonfigurować.

Załóżmy, że musisz ustawić opcję numerów (`set number`). Jeśli nie masz jeszcze vimrc, stwórz jeden. Zwykle znajduje się w twoim katalogu domowym i nosi nazwę `.vimrc`. W zależności od twojego systemu operacyjnego, lokalizacja może się różnić. W macOS mam go w `~/.vimrc`. Aby zobaczyć, gdzie powinieneś umieścić swój, sprawdź `:h vimrc`.

Wewnątrz dodaj `set number`. Zapisz to (`:w`), a następnie załaduj (`:source %`). Powinieneś teraz zobaczyć numery linii wyświetlane po lewej stronie.

Alternatywnie, jeśli nie chcesz wprowadzać trwałej zmiany ustawienia, zawsze możesz uruchomić polecenie `set` w linii, wykonując `:set number`. Wadą tego podejścia jest to, że to ustawienie jest tymczasowe. Gdy zamkniesz Vima, opcja znika.

Ponieważ uczymy się o Vimie, a nie o Vi, ustawieniem, które musisz mieć, jest opcja `nocompatible`. Dodaj `set nocompatible` do swojego vimrc. Wiele funkcji specyficznych dla Vima jest wyłączonych, gdy działa w trybie `compatible`.

Ogólnie rzecz biorąc, za każdym razem, gdy fragment tekstu wspomina o opcji vimrc, po prostu dodaj tę opcję do vimrc, zapisz to i załaduj.

## Przyszłość, błędy, pytania

Oczekuj więcej aktualizacji w przyszłości. Jeśli znajdziesz jakieś błędy lub masz pytania, nie wahaj się skontaktować.

Mam także zaplanowane kilka kolejnych rozdziałów, więc bądź na bieżąco!

## Chcę więcej sztuczek Vima

Aby dowiedzieć się więcej o Vimie, śledź [@learnvim](https://twitter.com/learnvim).

## Podziękowania

Ten przewodnik nie byłby możliwy bez Brama Moleenara za stworzenie Vima, mojej żony, która była bardzo cierpliwa i wspierająca przez całą tę podróż, wszystkich [współtwórców](https://github.com/iggredible/Learn-Vim/graphs/contributors) projektu learn-vim, społeczności Vima oraz wielu, wielu innych, którzy nie zostali wymienieni.

Dziękuję. Wszyscy pomagacie uczynić edytowanie tekstu zabawnym :)