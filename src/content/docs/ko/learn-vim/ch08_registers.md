---
description: Vim 레지스터의 10가지 유형과 효율적인 사용법을 배워 반복적인 입력을 줄이고 작업을 간소화하세요.
title: Ch08. Registers
---

Vim 레지스터를 배우는 것은 처음으로 대수를 배우는 것과 같습니다. 필요할 때까지 필요하다고 생각하지 않았습니다.

아마도 텍스트를 복사하거나 삭제한 후 `p` 또는 `P`로 붙여넣을 때 Vim 레지스터를 사용했을 것입니다. 그러나 Vim에는 10가지 유형의 레지스터가 있다는 것을 알고 있었나요? 올바르게 사용하면 Vim 레지스터는 반복적인 타이핑에서 구해줄 수 있습니다.

이 장에서는 모든 Vim 레지스터 유형과 이를 효율적으로 사용하는 방법을 살펴보겠습니다.

## 10가지 레지스터 유형

다음은 10가지 Vim 레지스터 유형입니다:

1. 이름 없는 레지스터 (`""`).
2. 번호가 매겨진 레지스터 (`"0-9`).
3. 작은 삭제 레지스터 (`"-`).
4. 이름이 있는 레지스터 (`"a-z`).
5. 읽기 전용 레지스터 (`":`, `".`, 및 `"%`).
6. 대체 파일 레지스터 (`"#`).
7. 표현식 레지스터 (`"=`).
8. 선택 레지스터 (`"*` 및 `"+`).
9. 블랙홀 레지스터 (`"_`).
10. 마지막 검색 패턴 레지스터 (`"/`).

## 레지스터 연산자

레지스터를 사용하려면 먼저 연산자를 사용하여 값을 저장해야 합니다. 다음은 레지스터에 값을 저장하는 몇 가지 연산자입니다:

```shell
y    Yank (복사)
c    텍스트 삭제 후 삽입 모드 시작
d    텍스트 삭제
```

더 많은 연산자(예: `s` 또는 `x`)가 있지만, 위의 것들이 유용합니다. 일반적인 규칙은, 연산자가 텍스트를 제거할 수 있다면, 아마도 텍스트를 레지스터에 저장할 것입니다.

레지스터에서 텍스트를 붙여넣으려면 다음을 사용할 수 있습니다:

```shell
p    커서 뒤에 텍스트 붙여넣기
P    커서 앞에 텍스트 붙여넣기
```

`p`와 `P` 모두 카운트와 레지스터 기호를 인수로 받습니다. 예를 들어, 10번 붙여넣으려면 `10p`를 입력합니다. 레지스터 a에서 텍스트를 붙여넣으려면 `"ap`를 입력합니다. 레지스터 a에서 텍스트를 10번 붙여넣으려면 `10"ap`를 입력합니다. 참고로, `p`는 기술적으로 "put"을 의미하지만, "paste"가 더 일반적인 단어라고 생각합니다.

특정 레지스터에서 내용을 가져오는 일반적인 구문은 `"a`이며, 여기서 `a`는 레지스터 기호입니다.

## 삽입 모드에서 레지스터 호출하기

이 장에서 배운 모든 것은 삽입 모드에서도 실행할 수 있습니다. 레지스터 a에서 텍스트를 가져오려면 일반적으로 `"ap`를 입력합니다. 그러나 삽입 모드에서는 `Ctrl-R a`를 실행합니다. 삽입 모드에서 레지스터를 호출하는 구문은 다음과 같습니다:

```shell
Ctrl-R a
```

여기서 `a`는 레지스터 기호입니다. 이제 레지스터를 저장하고 검색하는 방법을 알았으니, 본론으로 들어갑시다!

## 이름 없는 레지스터

이름 없는 레지스터에서 텍스트를 가져오려면 `""p`를 입력합니다. 이는 마지막으로 복사, 변경 또는 삭제한 텍스트를 저장합니다. 다른 복사, 변경 또는 삭제를 수행하면 Vim은 자동으로 이전 텍스트를 대체합니다. 이름 없는 레지스터는 컴퓨터의 표준 복사/붙여넣기 작업과 같습니다.

기본적으로 `p`(또는 `P`)는 이름 없는 레지스터에 연결되어 있습니다(이제부터는 `""p` 대신 `p`로 이름 없는 레지스터를 지칭하겠습니다).

## 번호가 매겨진 레지스터

번호가 매겨진 레지스터는 자동으로 오름차순으로 채워집니다. 두 가지 유형의 번호가 매겨진 레지스터가 있습니다: 복사된 레지스터(`0`)와 번호가 매겨진 레지스터(`1-9`). 먼저 복사된 레지스터에 대해 논의해 보겠습니다.

### 복사된 레지스터

전체 텍스트 한 줄을 복사하면(`yy`), Vim은 실제로 그 텍스트를 두 개의 레지스터에 저장합니다:

1. 이름 없는 레지스터 (`p`).
2. 복사된 레지스터 (`"0p`).

다른 텍스트를 복사하면 Vim은 복사된 레지스터와 이름 없는 레지스터를 모두 업데이트합니다. 다른 작업(예: 삭제)은 레지스터 0에 저장되지 않습니다. 이는 당신에게 유리하게 사용될 수 있습니다. 다른 복사를 수행하지 않는 한, 복사된 텍스트는 항상 거기에 있으며, 얼마나 많은 변경 및 삭제를 하더라도 변하지 않습니다.

예를 들어, 다음과 같이 수행하면:
1. 한 줄 복사(`yy`)
2. 한 줄 삭제(`dd`)
3. 또 다른 줄 삭제(`dd`)

복사된 레지스터에는 첫 번째 단계의 텍스트가 있습니다.

다음과 같이 수행하면:
1. 한 줄 복사(`yy`)
2. 한 줄 삭제(`dd`)
3. 또 다른 줄 복사(`yy`)

복사된 레지스터에는 세 번째 단계의 텍스트가 있습니다.

마지막으로, 삽입 모드에서는 방금 복사한 텍스트를 `Ctrl-R 0`을 사용하여 빠르게 붙여넣을 수 있습니다.

### 0이 아닌 번호가 매겨진 레지스터

최소 한 줄 이상의 텍스트를 변경하거나 삭제하면, 해당 텍스트는 가장 최근의 것으로 정렬된 번호가 매겨진 레지스터 1-9에 저장됩니다.

예를 들어, 다음과 같은 줄이 있다고 가정해 보겠습니다:

```shell
line three
line two
line one
```

커서가 "line three"에 있을 때, `dd`로 하나씩 삭제합니다. 모든 줄이 삭제되면, 레지스터 1에는 "line one"(가장 최근), 레지스터 2에는 "line two"(두 번째로 최근), 레지스터 3에는 "line three"(가장 오래된)가 있어야 합니다. 레지스터 1의 내용을 가져오려면 `"1p`를 입력합니다.

부가적으로, 이러한 번호가 매겨진 레지스터는 점 명령을 사용할 때 자동으로 증가합니다. 만약 번호가 매겨진 레지스터 1(`"1`)에 "line one"이 있고, 레지스터 2(`"2`)에 "line two", 레지스터 3(`"3`)에 "line three"가 있다면, 다음과 같은 방법으로 순차적으로 붙여넣을 수 있습니다:
- `"1P`를 입력하여 번호가 매겨진 레지스터 1의 내용을 붙여넣습니다.
- `.`를 입력하여 번호가 매겨진 레지스터 2의 내용을 붙여넣습니다.
- `.`를 입력하여 번호가 매겨진 레지스터 3의 내용을 붙여넣습니다.

이 트릭은 모든 번호가 매겨진 레지스터에서 작동합니다. 만약 `"5P`로 시작했다면, `.`는 `"6P`를 수행하고, 다시 `.`를 입력하면 `"7P`가 수행됩니다.

단어 삭제(`dw`)나 단어 변경(`cw`)과 같은 작은 삭제는 번호가 매겨진 레지스터에 저장되지 않습니다. 이는 작은 삭제 레지스터(`"-`)에 저장됩니다. 다음에서 논의하겠습니다.

## 작은 삭제 레지스터

한 줄보다 적은 변경이나 삭제는 번호가 매겨진 레지스터 0-9에 저장되지 않고, 작은 삭제 레지스터(`"-`)에 저장됩니다.

예를 들어:
1. 단어 삭제(`diw`)
2. 한 줄 삭제(`dd`)
3. 한 줄 삭제(`dd`)

`"-p`는 첫 번째 단계에서 삭제된 단어를 제공합니다.

또 다른 예:
1. 단어 삭제(`diw`)
2. 한 줄 삭제(`dd`)
3. 단어 삭제(`diw`)

`"-p`는 세 번째 단계에서 삭제된 단어를 제공합니다. `"1p`는 두 번째 단계에서 삭제된 줄을 제공합니다. 불행히도, 작은 삭제 레지스터는 하나의 항목만 저장하므로 첫 번째 단계에서 삭제된 단어를 검색할 방법은 없습니다. 그러나 첫 번째 단계의 텍스트를 보존하고 싶다면, 이름이 있는 레지스터를 사용할 수 있습니다.

## 이름이 있는 레지스터

이름이 있는 레지스터는 Vim의 가장 다재다능한 레지스터입니다. 이는 복사, 변경 및 삭제된 텍스트를 레지스터 a-z에 저장할 수 있습니다. 이전에 본 3가지 레지스터 유형과 달리, 이름이 있는 레지스터를 사용하도록 Vim에 명시적으로 지시해야 하므로 완전한 제어가 가능합니다.

단어를 레지스터 a에 복사하려면, `"ayiw`를 사용할 수 있습니다.
- `"a`는 다음 작업(삭제/변경/복사)이 레지스터 a에 저장될 것임을 Vim에 알립니다.
- `yiw`는 단어를 복사합니다.

레지스터 a에서 텍스트를 가져오려면 `"ap`를 실행합니다. 이름이 있는 레지스터를 사용하여 26개의 알파벳 문자를 모두 사용하여 26개의 서로 다른 텍스트를 저장할 수 있습니다.

때때로 기존의 이름이 있는 레지스터에 추가하고 싶을 수 있습니다. 이 경우, 처음부터 다시 시작하는 대신 텍스트를 추가할 수 있습니다. 그렇게 하려면 해당 레지스터의 대문자 버전을 사용할 수 있습니다. 예를 들어, 레지스터 a에 "Hello "라는 단어가 이미 저장되어 있다고 가정해 보겠습니다. "world"를 레지스터 a에 추가하고 싶다면, "world"라는 텍스트를 찾아서 A 레지스터(`"Ayiw`)를 사용하여 복사할 수 있습니다.

## 읽기 전용 레지스터

Vim에는 세 가지 읽기 전용 레지스터가 있습니다: `.`, `:`, 및 `%`. 사용하기 매우 간단합니다:

```shell
.    마지막으로 삽입한 텍스트 저장
:    마지막으로 실행된 명령어 저장
%    현재 파일의 이름 저장
```

마지막으로 작성한 텍스트가 "Hello Vim"이었다면, `".p`를 실행하면 "Hello Vim"이라는 텍스트가 출력됩니다. 현재 파일의 이름을 가져오려면 `"%p`를 실행합니다. `:s/foo/bar/g` 명령을 실행하면, `":p`를 실행하면 "s/foo/bar/g"라는 리터럴 텍스트가 출력됩니다.

## 대체 파일 레지스터

Vim에서 `#`는 일반적으로 대체 파일을 나타냅니다. 대체 파일은 마지막으로 열린 파일입니다. 대체 파일의 이름을 삽입하려면 `"#p`를 사용할 수 있습니다.

## 표현식 레지스터

Vim에는 표현식을 평가하기 위한 표현식 레지스터 `"=`가 있습니다.

수학적 표현식 `1 + 1`을 평가하려면 다음을 실행합니다:

```shell
"=1+1<Enter>p
```

여기서, `"=`를 사용하여 표현식 레지스터를 사용하고 있음을 Vim에 알리고 있습니다. 당신의 표현식은 (`1 + 1`)입니다. 결과를 얻으려면 `p`를 입력해야 합니다. 앞서 언급했듯이, 삽입 모드에서도 레지스터에 접근할 수 있습니다. 삽입 모드에서 수학적 표현식을 평가하려면 다음을 수행할 수 있습니다:

```shell
Ctrl-R =1+1
```

또한, `@`와 함께 추가하여 어떤 레지스터에서든 값을 가져올 수 있습니다. 레지스터 a에서 텍스트를 가져오려면:

```shell
"=@a
```

그런 다음 `<Enter>`를 누르고 `p`를 누릅니다. 마찬가지로, 삽입 모드에서 레지스터 a의 값을 가져오려면:

```shell
Ctrl-r =@a
```

표현식은 Vim에서 방대한 주제이므로 여기서는 기본 사항만 다루겠습니다. 이후 Vimscript 장에서 표현식에 대해 더 자세히 다룰 것입니다.

## 선택 레지스터

때때로 외부 프로그램에서 텍스트를 복사하고 Vim에 붙여넣고 싶지 않으신가요? Vim의 선택 레지스터를 사용하면 가능합니다. Vim에는 두 개의 선택 레지스터가 있습니다: `quotestar` (`"*`)와 `quoteplus` (`"+`). 이를 사용하여 외부 프로그램에서 복사한 텍스트에 접근할 수 있습니다.

외부 프로그램(예: Chrome 브라우저)에서 `Ctrl-C`(또는 OS에 따라 `Cmd-C`)로 텍스트 블록을 복사하면, 일반적으로 Vim에서 `p`로 텍스트를 붙여넣을 수 없습니다. 그러나 Vim의 `"+`와 `"*`는 클립보드에 연결되어 있으므로, 실제로 `"+p` 또는 `"*p`로 텍스트를 붙여넣을 수 있습니다. 반대로, Vim에서 `"+yiw` 또는 `"*yiw`로 단어를 복사하면, 외부 프로그램에서 `Ctrl-V`(또는 `Cmd-V`)로 그 텍스트를 붙여넣을 수 있습니다. 이 기능은 Vim 프로그램에 `+clipboard` 옵션이 있는 경우에만 작동합니다(확인하려면 `:version`을 실행하세요).

`"*`와 `"+`가 같은 기능을 수행한다면, 왜 Vim에는 두 개의 다른 레지스터가 있을까요? 일부 머신은 X11 윈도우 시스템을 사용합니다. 이 시스템에는 기본, 보조 및 클립보드의 세 가지 유형의 선택이 있습니다. 머신이 X11을 사용하면 Vim은 X11의 *기본* 선택을 `quotestar` (`"*`) 레지스터와 함께 사용하고, X11의 *클립보드* 선택을 `quoteplus` (`"+`) 레지스터와 함께 사용합니다. 이는 Vim 빌드에 `+xterm_clipboard` 옵션이 있는 경우에만 적용됩니다. 만약 Vim에 `xterm_clipboard`가 없다면, 큰 문제는 아닙니다. 이는 단지 `quotestar`와 `quoteplus`가 서로 교환 가능하다는 것을 의미합니다(저도 그렇습니다).

`=*p` 또는 `=+p`(또는 `"*p` 또는 `"+p`)를 사용하는 것이 번거롭다고 느낍니다. 외부 프로그램에서 복사한 텍스트를 `p`로 붙여넣기 위해, vimrc에 다음을 추가할 수 있습니다:

```shell
set clipboard=unnamed
```

이제 외부 프로그램에서 텍스트를 복사하면 이름 없는 레지스터 `p`로 붙여넣을 수 있습니다. 또한 Vim에서 텍스트를 복사하여 외부 프로그램에 붙여넣을 수 있습니다. `+xterm_clipboard`가 있다면, `unnamed`와 `unnamedplus` 클립보드 옵션을 모두 사용할 수 있습니다.

## 블랙홀 레지스터

텍스트를 삭제하거나 변경할 때마다 해당 텍스트는 Vim 레지스터에 자동으로 저장됩니다. 레지스터에 아무것도 저장하고 싶지 않은 경우가 있을 수 있습니다. 어떻게 해야 할까요?

블랙홀 레지스터(`"_`)를 사용할 수 있습니다. 한 줄을 삭제하고 Vim이 삭제된 줄을 어떤 레지스터에도 저장하지 않도록 하려면 `"_dd`를 사용합니다.

블랙홀 레지스터는 레지스터의 `/dev/null`과 같습니다.

## 마지막 검색 패턴 레지스터

마지막 검색(``/`` 또는 ``?``)을 붙여넣으려면, 마지막 검색 패턴 레지스터(`"/`)를 사용할 수 있습니다. 마지막 검색어를 붙여넣으려면 `"/p`를 사용합니다.

## 레지스터 보기

모든 레지스터를 보려면 `:register` 명령을 사용합니다. "a", "1", 및 "-" 레지스터만 보려면 `:register a 1 -`을 사용합니다.

레지스터의 내용을 확인할 수 있는 플러그인인 [vim-peekaboo](https://github.com/junegunn/vim-peekaboo)가 있습니다. 일반 모드에서 `"` 또는 `@`를 누르거나 삽입 모드에서 `Ctrl-R`을 누르면 레지스터의 내용을 엿볼 수 있습니다. 이 플러그인은 매우 유용하다고 생각합니다. 대부분의 경우, 레지스터의 내용을 기억할 수 없기 때문입니다. 한 번 사용해 보세요!

## 레지스터 실행하기

이름이 있는 레지스터는 단순히 텍스트를 저장하는 것만이 아닙니다. 매크로를 실행할 수도 있습니다(`@`). 매크로에 대해서는 다음 장에서 다루겠습니다.

매크로가 Vim 레지스터에 저장되므로, 매크로로 저장된 텍스트를 실수로 덮어쓸 수 있다는 점을 기억하세요. 만약 레지스터 a에 "Hello Vim"이라는 텍스트를 저장하고 나중에 같은 레지스터에 매크로를 기록하면(`qa{macro-sequence}q`), 그 매크로는 이전에 저장된 "Hello Vim" 텍스트를 덮어쓰게 됩니다.
## 레지스터 지우기

기술적으로, 같은 레지스터 이름 아래에 저장하는 다음 텍스트가 이를 덮어쓰므로 어떤 레지스터도 지울 필요는 없습니다. 그러나 빈 매크로를 기록하여 이름이 지정된 레지스터를 빠르게 지울 수 있습니다. 예를 들어, `qaq`를 실행하면 Vim은 레지스터 a에 빈 매크로를 기록합니다.

또 다른 대안은 `:call setreg('a', 'hello register a')` 명령을 실행하는 것입니다. 여기서 a는 레지스터 a이고 "hello register a"는 저장하고 싶은 텍스트입니다.

레지스터를 지우는 또 다른 방법은 `:let @a = ''` 표현식을 사용하여 "a 레지스터"의 내용을 빈 문자열로 설정하는 것입니다.

## 레지스터의 내용 넣기

`:put` 명령을 사용하여 어떤 레지스터의 내용을 붙여넣을 수 있습니다. 예를 들어, `:put a`를 실행하면 Vim은 현재 줄 아래에 레지스터 a의 내용을 출력합니다. 이는 `"ap`와 매우 비슷하게 작동하지만, 일반 모드 명령 `p`는 커서 뒤에 레지스터 내용을 출력하고, `:put` 명령은 레지스터 내용을 새 줄에 출력하는 차이가 있습니다.

`:put`은 명령줄 명령이므로 주소를 전달할 수 있습니다. `:10put a`는 레지스터 a의 텍스트를 10번째 줄 아래에 붙여넣습니다.

`:put`을 블랙홀 레지스터(`"_`)와 함께 사용하는 멋진 트릭이 있습니다. 블랙홀 레지스터는 어떤 텍스트도 저장하지 않기 때문에, `:put _`는 빈 줄을 삽입합니다. 이를 전역 명령과 결합하여 여러 빈 줄을 삽입할 수 있습니다. 예를 들어, "end"라는 텍스트가 포함된 모든 줄 아래에 빈 줄을 삽입하려면 `:g/end/put _`를 실행합니다. 전역 명령에 대해서는 나중에 배우게 될 것입니다.

## 스마트하게 레지스터 배우기

끝까지 도달했습니다. 축하합니다! 방대한 정보에 압도당하고 있다면, 당신만 그런 것이 아닙니다. 제가 처음 Vim 레지스터에 대해 배우기 시작했을 때, 한 번에 너무 많은 정보를 받아들이기 어려웠습니다.

모든 레지스터를 즉시 암기할 필요는 없다고 생각합니다. 생산성을 높이기 위해서는 다음 3개의 레지스터만 사용하여 시작할 수 있습니다:
1. 이름이 없는 레지스터 (`""`).
2. 이름이 지정된 레지스터 (`"a-z`).
3. 번호가 매겨진 레지스터 (`"0-9`).

이름이 없는 레지스터는 기본적으로 `p`와 `P`로 설정되므로, 이름이 지정된 레지스터와 번호가 매겨진 레지스터 두 개만 배우면 됩니다. 필요할 때 점진적으로 더 많은 레지스터를 배우세요. 천천히 하세요.

평균적인 인간은 제한된 단기 기억 용량을 가지고 있으며, 한 번에 약 5 - 7개의 항목을 기억할 수 있습니다. 그래서 일상적인 편집에서는 약 5 - 7개의 이름이 지정된 레지스터만 사용합니다. 모든 스물여섯 개를 머릿속에 기억할 수는 없습니다. 보통 레지스터 a부터 시작하여 b로 올라가며 알파벳 순서로 진행합니다. 시도해보고 어떤 기술이 가장 잘 맞는지 실험해 보세요.

Vim 레지스터는 강력합니다. 전략적으로 사용하면 수없이 반복되는 텍스트를 입력하는 것을 피할 수 있습니다. 다음으로 매크로에 대해 배워봅시다.