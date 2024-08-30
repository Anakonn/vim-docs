---
description: Nauka rejestrów Vima to klucz do efektywnej edycji tekstu. Poznaj 10
  typów rejestrów i ich zastosowanie, aby zaoszczędzić czas i uniknąć powtórzeń.
title: Ch08. Registers
---

Uczenie się rejestrów Vima jest jak nauka algebry po raz pierwszy. Nie myślałeś, że będziesz tego potrzebować, dopóki nie nastała potrzeba.

Prawdopodobnie korzystałeś z rejestrów Vima, gdy skopiowałeś lub usunąłeś tekst, a następnie wkleiłeś go za pomocą `p` lub `P`. Jednak czy wiesz, że Vim ma 10 różnych typów rejestrów? Używane prawidłowo, rejestry Vima mogą uratować cię przed powtarzalnym pisaniem.

W tym rozdziale omówię wszystkie typy rejestrów Vima i jak ich efektywnie używać.

## Dziesięć Typów Rejestrów

Oto 10 typów rejestrów Vima:

1. Rejestr bez nazwy (`""`).
2. Rejestry numerowane (`"0-9`).
3. Mały rejestr usunięcia (`"-`).
4. Rejestry nazwane (`"a-z`).
5. Rejestry tylko do odczytu (`":`, `".`, i `"%`).
6. Rejestr alternatywnego pliku (`"#`).
7. Rejestr wyrażenia (`"=`).
8. Rejestry zaznaczenia (`"*` i `"+`).
9. Rejestr czarnej dziury (`"_`).
10. Rejestr ostatniego wzorca wyszukiwania (`"/`).

## Operatory Rejestrów

Aby używać rejestrów, musisz najpierw przechować je za pomocą operatorów. Oto niektóre operatory, które przechowują wartości w rejestrach:

```shell
y    Yank (kopiuj)
c    Usuń tekst i rozpocznij tryb wstawiania
d    Usuń tekst
```

Jest więcej operatorów (jak `s` czy `x`), ale powyższe są przydatne. Zasadą jest, że jeśli operator może usunąć tekst, prawdopodobnie przechowuje tekst w rejestrach.

Aby wkleić tekst z rejestrów, możesz użyć:

```shell
p    Wklej tekst po kursorze
P    Wklej tekst przed kursorem
```

Zarówno `p`, jak i `P` akceptują liczbę i symbol rejestru jako argumenty. Na przykład, aby wkleić dziesięć razy, użyj `10p`. Aby wkleić tekst z rejestru a, użyj `"ap`. Aby wkleić tekst z rejestru a dziesięć razy, użyj `10"ap`. Przy okazji, `p` technicznie oznacza "wstaw", a nie "wklej", ale uważam, że "wklej" to bardziej konwencjonalne słowo.

Ogólna składnia, aby uzyskać zawartość z konkretnego rejestru, to `"a`, gdzie `a` to symbol rejestru.

## Wywoływanie Rejestrów z Trybu Wstawiania

Wszystko, czego uczysz się w tym rozdziale, można również wykonać w trybie wstawiania. Aby uzyskać tekst z rejestru a, zazwyczaj robisz `"ap`. Ale jeśli jesteś w trybie wstawiania, uruchom `Ctrl-R a`. Składnia do wywoływania rejestrów z trybu wstawiania to:

```shell
Ctrl-R a
```

Gdzie `a` to symbol rejestru. Teraz, gdy wiesz, jak przechowywać i odzyskiwać rejestry, zanurzmy się w temat!

## Rejestr Bez Nazwy

Aby uzyskać tekst z rejestru bez nazwy, użyj `""p`. Przechowuje ostatni tekst, który skopiowałeś, zmieniłeś lub usunąłeś. Jeśli zrobisz kolejny kopię, zmianę lub usunięcie, Vim automatycznie zastąpi stary tekst. Rejestr bez nazwy jest jak standardowa operacja kopiowania / wklejania w komputerze.

Domyślnie `p` (lub `P`) jest połączone z rejestrem bez nazwy (od teraz będę odnosić się do rejestru bez nazwy jako `p` zamiast `""p`).

## Rejestry Numerowane

Rejestry numerowane automatycznie wypełniają się w porządku rosnącym. Istnieją 2 różne rejestry numerowane: rejestr skopiowany (`0`) i rejestry numerowane (`1-9`). Najpierw omówmy rejestr skopiowany.

### Rejestr Skopiowany

Jeśli skopiujesz cały wiersz tekstu (`yy`), Vim faktycznie zapisuje ten tekst w dwóch rejestrach:

1. Rejestr bez nazwy (`p`).
2. Rejestr skopiowany (`"0p`).

Gdy skopiujesz inny tekst, Vim zaktualizuje zarówno rejestr skopiowany, jak i rejestr bez nazwy. Jakiekolwiek inne operacje (jak usunięcie) nie będą przechowywane w rejestrze 0. Można to wykorzystać na swoją korzyść, ponieważ dopóki nie zrobisz kolejnej kopii, skopiowany tekst zawsze tam będzie, niezależnie od tego, ile zmian i usunięć wykonasz.

Na przykład, jeśli:
1. Skopiujesz linię (`yy`)
2. Usuniesz linię (`dd`)
3. Usuniesz kolejną linię (`dd`)

Rejestr skopiowany będzie zawierał tekst z kroku pierwszego.

Jeśli:
1. Skopiujesz linię (`yy`)
2. Usuniesz linię (`dd`)
3. Skopiujesz kolejną linię (`yy`)

Rejestr skopiowany będzie zawierał tekst z kroku trzeciego.

Ostatnia wskazówka, będąc w trybie wstawiania, możesz szybko wkleić tekst, który właśnie skopiowałeś, używając `Ctrl-R 0`.

### Rejestry Numerowane Różne od Zera

Gdy zmieniasz lub usuwasz tekst, który ma co najmniej jedną linię długości, ten tekst będzie przechowywany w rejestrach numerowanych 1-9, sortowanych według najnowszych.

Na przykład, jeśli masz te linie:

```shell
linia trzy
linia dwa
linia jeden
```

Z kursorem na "linii trzy", usuń je jeden po drugim za pomocą `dd`. Gdy wszystkie linie zostaną usunięte, rejestr 1 powinien zawierać "linia jeden" (najbardziej aktualny), rejestr dwa "linia dwa" (drugi najnowszy), a rejestr trzy "linia trzy" (najstarszy). Aby uzyskać zawartość z rejestru pierwszego, użyj `"1p`.

Jako uwaga, te rejestry numerowane są automatycznie inkrementowane przy użyciu polecenia kropki. Jeśli twój rejestr numerowany jeden (`"1`) zawiera "linia jeden", rejestr dwa (`"2`) "linia dwa", a rejestr trzy (`"3`) "linia trzy", możesz wkleić je sekwencyjnie za pomocą tego triku:
- Zrób `"1P`, aby wkleić zawartość z rejestru numerowanego jeden ("1).
- Zrób `.` aby wkleić zawartość z rejestru numerowanego dwa ("2).
- Zrób `.` aby wkleić zawartość z rejestru numerowanego trzy ("3).

Ten trik działa z każdym rejestrem numerowanym. Jeśli zaczynasz od `"5P`, `.` zrobi `"6P`, `.` ponownie zrobi `"7P`, i tak dalej.

Małe usunięcia, takie jak usunięcie słowa (`dw`) lub zmiana słowa (`cw`), nie są przechowywane w rejestrach numerowanych. Są przechowywane w małym rejestrze usunięcia (`"-`), o którym omówię następnie.

## Mały Rejestr Usunięcia

Zmiany lub usunięcia mniejsze niż jedna linia nie są przechowywane w rejestrach numerowanych 0-9, ale w małym rejestrze usunięcia (`"-`).

Na przykład:
1. Usuwam słowo (`diw`)
2. Usuwam linię (`dd`)
3. Usuwam linię (`dd`)

`"-p` daje ci usunięte słowo z kroku pierwszego.

Inny przykład:
1. Usuwam słowo (`diw`)
2. Usuwam linię (`dd`)
3. Usuwam słowo (`diw`)

`"-p` daje ci usunięte słowo z kroku trzeciego. `"1p` daje ci usuniętą linię z kroku drugiego. Niestety, nie ma sposobu na odzyskanie usuniętego słowa z kroku pierwszego, ponieważ mały rejestr usunięcia przechowuje tylko jeden element. Jednak jeśli chcesz zachować tekst z kroku pierwszego, możesz to zrobić za pomocą rejestrów nazwanych.

## Rejestr Nazwany

Rejestry nazwane są najbardziej wszechstronnym rejestrem Vima. Mogą przechowywać skopiowane, zmienione i usunięte teksty w rejestrach a-z. W przeciwieństwie do poprzednich 3 typów rejestrów, które automatycznie przechowują teksty w rejestrach, musisz wyraźnie powiedzieć Vimowi, aby użył rejestru nazwane, co daje ci pełną kontrolę.

Aby skopiować słowo do rejestru a, możesz to zrobić za pomocą `"ayiw`.
- `"a` mówi Vimowi, że następna akcja (usunięcie / zmiana / skopiowanie) będzie przechowywana w rejestrze a.
- `yiw` kopiuje słowo.

Aby uzyskać tekst z rejestru a, uruchom `"ap`. Możesz użyć wszystkich dwudziestu sześciu liter alfabetu, aby przechować dwadzieścia sześć różnych tekstów w rejestrach nazwanych.

Czasami możesz chcieć dodać do istniejącego rejestru nazwanego. W takim przypadku możesz dodać swój tekst zamiast zaczynać od nowa. Aby to zrobić, możesz użyć wersji wielkiej tego rejestru. Na przykład, przypuśćmy, że masz słowo "Hello " już przechowane w rejestrze a. Jeśli chcesz dodać "world" do rejestru a, możesz znaleźć tekst "world" i skopiować go używając rejestru A (`"Ayiw`).

## Rejestry Tylko do Odczytu

Vim ma trzy rejestry tylko do odczytu: `.`, `:`, i `%`. Są dość proste w użyciu:

```shell
.    Przechowuje ostatnio wstawiony tekst
:    Przechowuje ostatnio wykonane polecenie
%    Przechowuje nazwę bieżącego pliku
```

Jeśli ostatni tekst, który napisałeś, brzmiał "Hello Vim", uruchomienie `".p` wydrukuje tekst "Hello Vim". Jeśli chcesz uzyskać nazwę bieżącego pliku, uruchom `"%p`. Jeśli uruchomisz polecenie `:s/foo/bar/g`, uruchomienie `":p` wydrukuje dosłowny tekst "s/foo/bar/g".

## Rejestr Alternatywnego Pliku

W Vimie `#` zazwyczaj reprezentuje alternatywny plik. Alternatywny plik to ostatni plik, który otworzyłeś. Aby wstawić nazwę alternatywnego pliku, możesz użyć `"#p`.

## Rejestr Wyrażenia

Vim ma rejestr wyrażenia, `"=`, do oceny wyrażeń.

Aby ocenić wyrażenia matematyczne `1 + 1`, uruchom:

```shell
"=1+1<Enter>p
```

Tutaj mówisz Vimowi, że używasz rejestru wyrażenia z `"=`. Twoje wyrażenie to (`1 + 1`). Musisz wpisać `p`, aby uzyskać wynik. Jak wspomniano wcześniej, możesz również uzyskać dostęp do rejestru z trybu wstawiania. Aby ocenić wyrażenie matematyczne z trybu wstawiania, możesz zrobić:

```shell
Ctrl-R =1+1
```

Możesz również uzyskać wartości z dowolnego rejestru za pomocą rejestru wyrażenia, gdy jest on dołączony z `@`. Jeśli chcesz uzyskać tekst z rejestru a:

```shell
"=@a
```

Następnie naciśnij `<Enter>`, a potem `p`. Podobnie, aby uzyskać wartości z rejestru a będąc w trybie wstawiania:

```shell
Ctrl-r =@a
```

Wyrażenia to obszerny temat w Vimie, więc omówię tylko podstawy tutaj. W późniejszych rozdziałach dotyczących Vimscriptu zajmę się wyrażeniami bardziej szczegółowo.

## Rejestry Zaznaczenia

Czy nie zdarza ci się czasami pragnąć, abyś mógł skopiować tekst z programów zewnętrznych i wkleić go lokalnie w Vimie, i odwrotnie? Dzięki rejestrom zaznaczenia Vima, możesz to zrobić. Vim ma dwa rejestry zaznaczenia: `quotestar` (`"*`) i `quoteplus` (`"+`). Możesz ich użyć, aby uzyskać dostęp do skopiowanego tekstu z programów zewnętrznych.

Jeśli jesteś w programie zewnętrznym (jak przeglądarka Chrome) i skopiujesz blok tekstu za pomocą `Ctrl-C` (lub `Cmd-C`, w zależności od systemu operacyjnego), zazwyczaj nie będziesz mógł użyć `p`, aby wkleić tekst w Vimie. Jednak zarówno `"+`, jak i `"*` Vima są połączone z twoim schowkiem, więc możesz faktycznie wkleić tekst za pomocą `"+p` lub `"*p`. Odwrotnie, jeśli skopiujesz słowo z Vima za pomocą `"+yiw` lub `"*yiw`, możesz wkleić ten tekst w programie zewnętrznym za pomocą `Ctrl-V` (lub `Cmd-V`). Zauważ, że to działa tylko wtedy, gdy twój program Vim ma opcję `+clipboard` (aby to sprawdzić, uruchom `:version`).

Możesz się zastanawiać, jeśli `"*` i `"+` robią to samo, dlaczego Vim ma dwa różne rejestry? Niektóre maszyny używają systemu okien X11. Ten system ma 3 typy zaznaczeń: podstawowe, drugorzędne i schowek. Jeśli twoja maszyna używa X11, Vim używa podstawowego zaznaczenia X11 z rejestrem `quotestar` (`"*`) oraz zaznaczenia schowka X11 z rejestrem `quoteplus` (`"+`). To dotyczy tylko wtedy, gdy masz opcję `+xterm_clipboard` dostępną w swojej wersji Vima. Jeśli twój Vim nie ma `xterm_clipboard`, to nie jest wielki problem. To po prostu oznacza, że zarówno `quotestar`, jak i `quoteplus` są wymienne (mój też nie ma).

Uważam, że robienie `=*p` lub `=+p` (lub `"*p` czy `"+p`) jest uciążliwe. Aby sprawić, by Vim wklejał skopiowany tekst z programu zewnętrznego za pomocą tylko `p`, możesz dodać to do swojego vimrc:

```shell
set clipboard=unnamed
```

Teraz, gdy skopiuję tekst z programu zewnętrznego, mogę wkleić go za pomocą rejestru bez nazwy, `p`. Mogę również skopiować tekst z Vima i wkleić go do programu zewnętrznego. Jeśli masz `+xterm_clipboard`, możesz chcieć używać zarówno opcji schowka `unnamed`, jak i `unnamedplus`.

## Rejestr Czarnej Dziury

Za każdym razem, gdy usuwasz lub zmieniasz tekst, ten tekst jest automatycznie przechowywany w rejestrze Vima. Będą czasy, kiedy nie chcesz niczego zapisywać w rejestrze. Jak możesz to zrobić?

Możesz użyć rejestru czarnej dziury (`"_`). Aby usunąć linię i nie mieć Vima, który zapisuje usuniętą linię w jakimkolwiek rejestrze, użyj `"_dd`.

Rejestr czarnej dziury jest jak `/dev/null` rejestrów.

## Rejestr Ostatniego Wzoru Wyszukiwania

Aby wkleić swoje ostatnie wyszukiwanie (`/` lub `?`), możesz użyć rejestru ostatniego wzoru wyszukiwania (`"/`). Aby wkleić ostatni termin wyszukiwania, użyj `"/p`.

## Wyświetlanie Rejestrów

Aby wyświetlić wszystkie swoje rejestry, użyj polecenia `:register`. Aby wyświetlić tylko rejestry "a, "1, i "-", użyj `:register a 1 -`.

Istnieje wtyczka o nazwie [vim-peekaboo](https://github.com/junegunn/vim-peekaboo), która pozwala zajrzeć do zawartości rejestrów, gdy naciśniesz `"` lub `@` w trybie normalnym i `Ctrl-R` w trybie wstawiania. Uważam,
## Czyszczenie rejestru

Technicznie, nie ma potrzeby czyszczenia żadnego rejestru, ponieważ następny tekst, który zapiszesz pod tą samą nazwą rejestru, go nadpisze. Możesz jednak szybko wyczyścić dowolny nazwany rejestr, nagrywając pustą makro. Na przykład, jeśli uruchomisz `qaq`, Vim nagra pustą makro w rejestrze a.

Inną alternatywą jest uruchomienie polecenia `:call setreg('a', 'hello register a')`, gdzie a to rejestr a, a "hello register a" to tekst, który chcesz zapisać.

Jeszcze jednym sposobem na wyczyszczenie rejestru jest ustawienie zawartości rejestru "a" na pusty ciąg za pomocą wyrażenia `:let @a = ''`.

## Wstawianie zawartości rejestru

Możesz użyć polecenia `:put`, aby wkleić zawartość dowolnego rejestru. Na przykład, jeśli uruchomisz `:put a`, Vim wydrukuje zawartość rejestru a poniżej bieżącej linii. Działa to podobnie do `"ap`, z tą różnicą, że polecenie w trybie normalnym `p` wstawia zawartość rejestru po kursorze, a polecenie `:put` wstawia zawartość rejestru na nowej linii.

Ponieważ `:put` jest poleceniem wiersza poleceń, możesz przekazać mu adres. `:10put a` wklei tekst z rejestru a poniżej linii 10.

Jednym fajnym trikiem jest użycie `:put` z rejestrem czarnej dziury (`"_`). Ponieważ rejestr czarnej dziury nie przechowuje żadnego tekstu, `:put _` wstawi pustą linię zamiast tego. Możesz to połączyć z poleceniem globalnym, aby wstawić wiele pustych linii. Na przykład, aby wstawić puste linie poniżej wszystkich linii, które zawierają tekst "end", uruchom `:g/end/put _`. O poleceniu globalnym dowiesz się później.

## Uczenie się rejestrów w inteligentny sposób

Dotarłeś do końca. Gratulacje! Jeśli czujesz się przytłoczony ogromem informacji, nie jesteś sam. Kiedy po raz pierwszy zacząłem uczyć się o rejestrach Vima, było zbyt wiele informacji do przyswojenia na raz.

Nie sądzę, abyś powinien od razu zapamiętywać wszystkie rejestry. Aby stać się produktywnym, możesz zacząć od używania tylko tych 3 rejestrów:
1. Nienazwany rejestr (`""`).
2. Nazwane rejestry (`"a-z`).
3. Numerowane rejestry (`"0-9`).

Ponieważ nienazwany rejestr domyślnie odpowiada `p` i `P`, musisz nauczyć się tylko dwóch rejestrów: rejestrów nazwanych i rejestrów numerowanych. Stopniowo ucz się więcej rejestrów, gdy ich potrzebujesz. Nie spiesz się.

Przeciętny człowiek ma ograniczoną pojemność pamięci krótkoterminowej, około 5 - 7 elementów na raz. Dlatego w mojej codziennej edycji używam tylko około 5 - 7 nazwanych rejestrów. Nie ma szans, żebym zapamiętał wszystkie dwadzieścia sześć w mojej głowie. Zwykle zaczynam od rejestru a, potem b, w porządku alfabetycznym. Spróbuj i eksperymentuj, aby zobaczyć, która technika działa najlepiej dla Ciebie.

Rejestry Vima są potężne. Używane strategicznie, mogą uratować Cię przed pisaniem niezliczonych powtarzających się tekstów. Następnie nauczymy się o makrach.