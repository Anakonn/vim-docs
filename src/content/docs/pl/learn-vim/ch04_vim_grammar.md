---
description: Niniejszy rozdział wyjaśnia podstawowe zasady gramatyki poleceń Vim,
  pomagając zrozumieć i płynnie korzystać z tego edytora tekstu.
title: Ch04. Vim Grammar
---

Łatwo jest poczuć się onieśmielonym złożonością poleceń Vim. Jeśli zobaczysz użytkownika Vima wykonującego `gUfV` lub `1GdG`, możesz nie od razu wiedzieć, co te polecenia robią. W tym rozdziale rozłożę ogólną strukturę poleceń Vim na prostą regułę gramatyczną.

To jest najważniejszy rozdział w całym przewodniku. Gdy zrozumiesz podstawową strukturę gramatyczną, będziesz mógł "rozmawiać" z Vimem. Przy okazji, kiedy mówię o *języku Vima* w tym rozdziale, nie mam na myśli języka Vimscript (wbudowanego języka programowania Vima, którego nauczysz się w późniejszych rozdziałach).

## Jak nauczyć się języka

Nie jestem rodzimym użytkownikiem języka angielskiego. Nauczyłem się angielskiego, gdy miałem 13 lat, kiedy przeprowadziłem się do USA. Są trzy rzeczy, które musisz zrobić, aby nauczyć się mówić w nowym języku:

1. Nauczyć się reguł gramatycznych.
2. Zwiększyć słownictwo.
3. Ćwiczyć, ćwiczyć, ćwiczyć.

Podobnie, aby mówić w języku Vima, musisz nauczyć się reguł gramatycznych, zwiększyć słownictwo i ćwiczyć, aż będziesz mógł uruchamiać polecenia bez myślenia.

## Reguła gramatyczna

W języku Vima istnieje tylko jedna reguła gramatyczna:

```shell
czasownik + rzeczownik
```

To wszystko!

To jak powiedzenie tych angielskich fraz:

- *"Zjeść (czasownik) pączka (rzeczownik)"*
- *"Kopać (czasownik) piłkę (rzeczownik)"*
- *"Nauczyć się (czasownik) edytora Vima (rzeczownik)"*

Teraz musisz zbudować swoje słownictwo z podstawowych czasowników i rzeczowników Vima.

## Rzeczowniki (Ruchy)

Rzeczowniki to ruchy Vima. Ruchy są używane do poruszania się w Vimie. Poniżej znajduje się lista niektórych ruchów Vima:

```shell
h    W lewo
j    W dół
k    W górę
l    W prawo
w    Przejdź do początku następnego słowa
}    Skocz do następnego akapitu
$    Przejdź do końca linii
```

Dowiesz się więcej o ruchach w następnym rozdziale, więc nie martw się zbytnio, jeśli nie rozumiesz niektórych z nich.

## Czasowniki (Operatory)

Według `:h operator`, Vim ma 16 operatorów. Jednak z mojego doświadczenia, nauczenie się tych 3 operatorów wystarczy na 80% moich potrzeb edycyjnych:

```shell
y    Skopiuj tekst (yank)
d    Usuń tekst i zapisz do rejestru
c    Usuń tekst, zapisz do rejestru i rozpocznij tryb wstawiania
```

Przy okazji, po skopiowaniu tekstu, możesz wkleić go za pomocą `p` (po kursorze) lub `P` (przed kursorem).

## Czasownik i Rzeczownik

Teraz, gdy znasz podstawowe rzeczowniki i czasowniki, zastosujmy regułę gramatyczną, czasownik + rzeczownik! Załóżmy, że masz ten wyraz:

```javascript
const learn = "vim";
```

- Aby skopiować wszystko z twojej aktualnej lokalizacji do końca linii: `y$`.
- Aby usunąć od twojej aktualnej lokalizacji do początku następnego słowa: `dw`.
- Aby zmienić od twojej aktualnej lokalizacji do końca aktualnego akapitu, powiedz `c}`.

Ruchy również akceptują liczby jako argumenty (omówię to w następnym rozdziale). Jeśli musisz przejść w górę o 3 linie, zamiast naciskać `k` 3 razy, możesz zrobić `3k`. Liczba działa z gramatyką Vima.
- Aby skopiować dwa znaki w lewo: `y2h`.
- Aby usunąć następne dwa słowa: `d2w`.
- Aby zmienić następne dwie linie: `c2j`.

W tej chwili możesz musieć długo myśleć, aby wykonać nawet proste polecenie. Nie jesteś sam. Kiedy zaczynałem, miałem podobne trudności, ale z czasem stałem się szybszy. Ty również. Powtarzanie, powtarzanie, powtarzanie.

Na marginesie, operacje liniowe (operacje wpływające na całą linię) są powszechnymi operacjami w edytowaniu tekstu. Ogólnie rzecz biorąc, wpisując polecenie operatora dwa razy, Vim wykonuje operację liniową dla tej akcji. Na przykład, `dd`, `yy` i `cc` wykonują **usunięcie**, **skopiowanie** i **zmianę** na całej linii. Spróbuj tego z innymi operatorami!

To naprawdę fajne. Widzę tutaj wzór. Ale jeszcze nie skończyłem. Vim ma jeszcze jeden typ rzeczownika: obiekty tekstowe.

## Więcej Rzeczowników (Obiekty Tekstowe)

Wyobraź sobie, że jesteś gdzieś wewnątrz pary nawiasów, jak `(hello Vim)` i musisz usunąć całe wyrażenie wewnątrz nawiasów. Jak możesz to szybko zrobić? Czy jest sposób na usunięcie "grupy", w której się znajdujesz?

Odpowiedź brzmi tak. Teksty często mają strukturę. Często zawierają nawiasy, cudzysłowy, nawiasy kwadratowe, klamry i inne. Vim ma sposób na uchwycenie tej struktury za pomocą obiektów tekstowych.

Obiekty tekstowe są używane z operatorami. Istnieją dwa typy obiektów tekstowych: wewnętrzne i zewnętrzne obiekty tekstowe.

```shell
i + obiekt    Wewnętrzny obiekt tekstowy
a + obiekt    Zewnętrzny obiekt tekstowy
```

Wewnętrzny obiekt tekstowy wybiera obiekt wewnątrz *bez* białych znaków lub otaczających obiektów. Zewnętrzny obiekt tekstowy wybiera obiekt wewnątrz *w tym* białe znaki lub otaczające obiekty. Ogólnie rzecz biorąc, zewnętrzny obiekt tekstowy zawsze wybiera więcej tekstu niż wewnętrzny obiekt tekstowy. Jeśli twój kursor znajduje się gdzieś wewnątrz nawiasów w wyrażeniu `(hello Vim)`:
- Aby usunąć tekst wewnątrz nawiasów, nie usuwając nawiasów: `di(`.
- Aby usunąć nawiasy i tekst wewnątrz: `da(`.

Spójrzmy na inny przykład. Załóżmy, że masz tę funkcję JavaScript, a twój kursor jest na "H" w "Hello":

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Aby usunąć całe "Hello Vim": `di(`.
- Aby usunąć zawartość funkcji (otoczoną przez `{}`): `di{`.
- Aby usunąć ciąg "Hello": `diw`.

Obiekty tekstowe są potężne, ponieważ możesz celować w różne obiekty z jednego miejsca. Możesz usunąć obiekty wewnątrz nawiasów, blok funkcji lub bieżące słowo. Mnemonicznie, gdy widzisz `di(`, `di{` i `diw`, masz dość dobry pomysł, które obiekty tekstowe one reprezentują: para nawiasów, para klamer i słowo.

Spójrzmy na jeszcze jeden przykład. Załóżmy, że masz te tagi HTML:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Jeśli twój kursor znajduje się na tekście "Header1":
- Aby usunąć "Header1": `dit`.
- Aby usunąć `<h1>Header1</h1>`: `dat`.

Jeśli twój kursor znajduje się na "div":
- Aby usunąć `h1` i obie linie `p`: `dit`.
- Aby usunąć wszystko: `dat`.
- Aby usunąć "div": `di<`.

Poniżej znajduje się lista powszechnych obiektów tekstowych:

```shell
w         Słowo
p         Akapit
s         Zdanie
( lub )   Para ( )
{ lub }   Para { }
[ lub ]   Para [ ]
< lub >   Para < >
t         Tagi XML
"         Para " "
'         Para ' '
`         Para ` `
```

Aby dowiedzieć się więcej, sprawdź `:h text-objects`.

## Kompozycyjność i Gramatyka

Gramatyka Vima jest podzbiorem cechy kompozycyjności Vima. Porozmawiajmy o kompozycyjności w Vimie i dlaczego to świetna cecha w edytorze tekstu.

Kompozycyjność oznacza posiadanie zestawu ogólnych poleceń, które można łączyć (komponować), aby wykonać bardziej złożone polecenia. Podobnie jak w programowaniu, gdzie możesz tworzyć bardziej złożone abstrakcje z prostszych abstrakcji, w Vimie możesz wykonywać złożone polecenia z prostszych poleceń. Gramatyka Vima jest manifestacją kompozycyjnej natury Vima.

Prawdziwa moc kompozycyjności Vima ujawnia się, gdy integruje się z zewnętrznymi programami. Vim ma operator filtru (`!`), aby używać zewnętrznych programów jako filtrów dla naszych tekstów. Załóżmy, że masz ten bałagan tekstowy poniżej i chcesz go zorganizować w tabelę:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Nie można tego łatwo zrobić za pomocą poleceń Vima, ale możesz to szybko zrobić za pomocą polecenia terminala `column` (zakładając, że twój terminal ma polecenie `column`). Z kursorem na "Id", uruchom `!}column -t -s "|"`. Voilà! Teraz masz te ładne dane tabelaryczne za pomocą jednego szybkiego polecenia.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Rozłóżmy to polecenie. Czasownikiem był `!` (operator filtru), a rzeczownikiem był `}` (przejdź do następnego akapitu). Operator filtru `!` zaakceptował inny argument, polecenie terminala, więc podałem `column -t -s "|"`. Nie będę omawiać, jak działa `column`, ale w efekcie zorganizował tekst w tabelę.

Załóżmy, że chcesz nie tylko zorganizować swój tekst w tabelę, ale także wyświetlić tylko wiersze z "Ok". Wiesz, że `awk` może to łatwo zrobić. Możesz to zrobić zamiast tego:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Wynik:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Świetnie! Operator zewnętrznego polecenia może również używać potoku (`|`).

To jest moc kompozycyjności Vima. Im więcej znasz swoich operatorów, ruchów i poleceń terminala, tym bardziej twoja zdolność do komponowania złożonych działań jest *pomnożona*.

Załóżmy, że znasz tylko cztery ruchy, `w, $, }, G` i tylko jeden operator, `d`. Możesz wykonać 8 działań: *przesunąć* się 4 różnymi sposobami (`w, $, }, G`) i *usunąć* 4 różne cele (`dw, d$, d}, dG`). Potem pewnego dnia uczysz się o operatorze wielkiej litery (`gU`). Dodałeś nie tylko jedną nową umiejętność do swojego zestawu narzędzi Vima, ale *cztery*: `gUw, gU$, gU}, gUG`. To daje ci 12 narzędzi w twoim zestawie narzędzi Vima. Każda nowa wiedza jest mnożnikiem twoich obecnych umiejętności. Jeśli znasz 10 ruchów i 5 operatorów, masz 60 ruchów (50 operacji + 10 ruchów) w swoim arsenale. Vim ma ruch numeru linii (`nG`), który daje ci `n` ruchów, gdzie `n` to liczba linii w twoim pliku (aby przejść do linii 5, uruchom `5G`). Ruch wyszukiwania (`/`) praktycznie daje ci prawie nieograniczoną liczbę ruchów, ponieważ możesz wyszukiwać cokolwiek. Operator zewnętrznego polecenia (`!`) daje ci tyle narzędzi filtrujących, ile znasz poleceń terminala. Używając narzędzia kompozycyjnego, takiego jak Vim, wszystko, co wiesz, można połączyć, aby wykonywać operacje o rosnącej złożoności. Im więcej wiesz, tym potężniejszy się stajesz.

To zachowanie kompozycyjne odzwierciedla filozofię Uniksa: *rób jedną rzecz dobrze*. Operator ma jedną rolę: zrobić Y. Ruch ma jedną rolę: przejść do X. Łącząc operator z ruchem, przewidywalnie otrzymujesz YX: zrób Y na X.

Ruchy i operatory są rozszerzalne. Możesz tworzyć niestandardowe ruchy i operatory, aby dodać je do swojego zestawu narzędzi Vima. Wtyczka [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) pozwala tworzyć własne obiekty tekstowe. Zawiera również [listę](https://github.com/kana/vim-textobj-user/wiki) niestandardowych obiektów tekstowych stworzonych przez użytkowników.

## Naucz się gramatyki Vima w inteligentny sposób

Właśnie nauczyłeś się reguły gramatycznej Vima: `czasownik + rzeczownik`. Jednym z moich największych momentów "AHA!" w Vimie było, gdy właśnie nauczyłem się o operatorze wielkiej litery (`gU`) i chciałem zmienić na wielkie litery bieżące słowo, *instynktownie* wpisałem `gUiw` i zadziałało! Słowo zostało napisane wielkimi literami. W tym momencie w końcu zacząłem rozumieć Vim. Mam nadzieję, że wkrótce będziesz miał swój własny moment "AHA!", jeśli jeszcze go nie miałeś.

Celem tego rozdziału jest pokazanie ci wzoru `czasownik + rzeczownik` w Vimie, abyś podszedł do nauki Vima jak do nauki nowego języka, zamiast zapamiętywać każdą kombinację poleceń.

Naucz się wzoru i zrozum jego implikacje. To inteligentny sposób nauki.