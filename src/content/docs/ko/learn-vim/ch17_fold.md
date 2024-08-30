---
description: Vim에서 파일의 불필요한 텍스트를 숨기기 위해 폴드를 사용하는 방법을 배우는 장입니다. 다양한 폴드 기법을 소개합니다.
title: Ch17. Fold
---

파일을 읽을 때, 종종 파일의 기능을 이해하는 데 방해가 되는 많은 불필요한 텍스트가 있습니다. 불필요한 소음을 숨기기 위해 Vim fold를 사용하세요.

이 장에서는 파일을 접는 다양한 방법을 배웁니다.

## 수동 접기

종이를 접어서 일부 텍스트를 가리는 것을 상상해 보세요. 실제 텍스트는 사라지지 않고 여전히 존재합니다. Vim fold도 같은 방식으로 작동합니다. 텍스트 범위를 접어 화면에서 숨기지만 실제로 삭제하지는 않습니다.

접기 연산자는 `z`입니다(종이가 접히면 z자 모양이 됩니다).

다음과 같은 텍스트가 있다고 가정해 보겠습니다:

```shell
Fold me
Hold me
```

커서가 첫 번째 줄에 있을 때 `zfj`를 입력하세요. Vim은 두 줄을 하나로 접습니다. 다음과 같은 결과를 볼 수 있습니다:

```shell
+-- 2 lines: Fold me -----
```

여기서 설명은 다음과 같습니다:
- `zf`는 접기 연산자입니다.
- `j`는 접기 연산자의 동작입니다.

접힌 텍스트는 `zo`로 열 수 있습니다. 접기를 닫으려면 `zc`를 사용하세요.

접기는 연산자이므로 문법 규칙(`동사 + 명사`)을 따릅니다. 접기 연산자는 동작이나 텍스트 객체와 함께 사용할 수 있습니다. 내부 단락을 접으려면 `zfip`를 실행하세요. 파일 끝까지 접으려면 `zfG`를 실행하세요. `{`와 `}` 사이의 텍스트를 접으려면 `zfa{`를 실행하세요.

비주얼 모드에서 접을 수 있습니다. 접고 싶은 영역을 강조 표시한 후(`v`, `V` 또는 `Ctrl-v`), `zf`를 실행하세요.

명령 모드에서 `:fold` 명령으로 접기를 실행할 수 있습니다. 현재 줄과 그 다음 줄을 접으려면 다음을 실행하세요:

```shell
:,+1fold
```

`,+1`은 범위입니다. 범위에 매개변수를 전달하지 않으면 기본적으로 현재 줄로 설정됩니다. `+1`은 다음 줄에 대한 범위 지시자입니다. 5번에서 10번 줄까지 접으려면 `:5,10fold`를 실행하세요. 현재 위치에서 줄 끝까지 접으려면 `:,$fold`를 실행하세요.

다른 많은 접기 및 펼치기 명령이 있습니다. 시작할 때 기억하기에는 너무 많다고 생각합니다. 가장 유용한 것들은 다음과 같습니다:
- `zR`: 모든 접기 열기.
- `zM`: 모든 접기 닫기.
- `za`: 접기 전환.

`zR`과 `zM`은 어떤 줄에서든 실행할 수 있지만, `za`는 접힌/펼쳐진 줄에 있을 때만 작동합니다. 더 많은 접기 명령을 배우려면 `:h fold-commands`를 확인하세요.

## 다양한 접기 방법

위 섹션에서는 Vim의 수동 접기를 다루었습니다. Vim에는 여섯 가지 접기 방법이 있습니다:
1. 수동
2. 들여쓰기
3. 표현식
4. 구문
5. 차이
6. 마커

현재 사용 중인 접기 방법을 보려면 `:set foldmethod?`를 실행하세요. 기본적으로 Vim은 `manual` 방법을 사용합니다.

이 장의 나머지 부분에서는 다른 다섯 가지 접기 방법을 배웁니다. 들여쓰기 접기부터 시작해 보겠습니다.

## 들여쓰기 접기

들여쓰기 접기를 사용하려면 `'foldmethod'`를 들여쓰기로 변경하세요:

```shell
:set foldmethod=indent
```

다음과 같은 텍스트가 있다고 가정해 보겠습니다:

```shell
One
  Two
  Two again
```

`:set foldmethod=indent`를 실행하면 다음과 같은 결과를 볼 수 있습니다:

```shell
One
+-- 2 lines: Two -----
```

들여쓰기 접기에서는 Vim이 각 줄의 시작 부분에 몇 개의 공백이 있는지를 보고, `'shiftwidth'` 옵션과 비교하여 접기 가능성을 결정합니다. `'shiftwidth'`는 각 들여쓰기 단계에 필요한 공백 수를 반환합니다. 다음을 실행하면:

```shell
:set shiftwidth?
```

Vim의 기본 `'shiftwidth'` 값은 2입니다. 위 텍스트에서 "Two"와 "Two again" 사이에는 줄의 시작과 텍스트 사이에 두 개의 공백이 있습니다. Vim은 공백 수와 `'shiftwidth'` 값이 2인 것을 보고 해당 줄이 들여쓰기 접기 수준이 하나라고 간주합니다.

이번에는 줄의 시작과 텍스트 사이에 공백이 하나만 있다고 가정해 보겠습니다:

```shell
One
 Two
 Two again
```

현재 `:set foldmethod=indent`를 실행하면, Vim은 각 줄에 충분한 공백이 없기 때문에 들여진 줄을 접지 않습니다. 하나의 공백은 들여쓰기로 간주되지 않습니다. 그러나 `'shiftwidth'`를 1로 변경하면:

```shell
:set shiftwidth=1
```

이제 텍스트가 접힐 수 있습니다. 이제 들여쓰기로 간주됩니다.

`shiftwidth`를 다시 2로 복원하고 텍스트 사이의 공백을 다시 두 개로 설정하세요. 또한 두 개의 추가 텍스트를 추가하세요:

```shell
One
  Two
  Two again
    Three
    Three again
```

접기를 실행(`zM`)하면 다음과 같은 결과를 볼 수 있습니다:

```shell
One
+-- 4 lines: Two -----
```

접힌 줄을 펼치고(`zR`), "Three"에 커서를 두고 텍스트의 접기 상태를 전환하세요(`za`):

```shell
One
  Two
  Two again
+-- 2 lines: Three -----
```

이게 뭐죠? 접기 안에 접기가 있나요?

중첩 접기는 유효합니다. "Two"와 "Two again" 텍스트는 접기 수준이 하나입니다. "Three"와 "Three again" 텍스트는 접기 수준이 두입니다. 접기 가능한 텍스트 안에 더 높은 접기 수준의 접기 가능한 텍스트가 있는 경우 여러 접기 레이어가 생깁니다.

## 표현식 접기

표현식 접기는 접기를 위한 표현식을 정의할 수 있게 해줍니다. 접기 표현식을 정의한 후, Vim은 각 줄에서 `'foldexpr'`의 값을 스캔합니다. 이것은 적절한 값을 반환하도록 구성해야 하는 변수입니다. `'foldexpr'`가 0을 반환하면 해당 줄은 접히지 않습니다. 1을 반환하면 해당 줄은 접기 수준이 1입니다. 2를 반환하면 해당 줄은 접기 수준이 2입니다. 정수 외에도 더 많은 값이 있지만, 그에 대해서는 다루지 않겠습니다. 궁금하다면 `:h fold-expr`를 확인하세요.

먼저, 접기 방법을 변경해 보겠습니다:

```shell
:set foldmethod=expr
```

아침 식사 음식 목록이 있고 "p"로 시작하는 모든 아침 식사 항목을 접고 싶다고 가정해 보겠습니다:

```shell
donut
pancake
pop-tarts
protein bar
salmon
scrambled eggs
```

다음으로, "p"로 시작하는 표현식을 캡처하도록 `foldexpr`를 변경하세요:

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

위의 표현식은 복잡해 보입니다. 분해해 보겠습니다:
- `:set foldexpr`는 `'foldexpr'` 옵션을 사용자 정의 표현식을 수용하도록 설정합니다.
- `getline()`은 주어진 줄의 내용을 반환하는 Vimscript 함수입니다. `:echo getline(5)`를 실행하면 5번 줄의 내용을 반환합니다.
- `v:lnum`은 `'foldexpr'` 표현식에 대한 Vim의 특수 변수입니다. Vim은 각 줄을 스캔하고 그 순간 각 줄의 번호를 `v:lnum` 변수에 저장합니다. 5번 줄에서 `v:lnum`의 값은 5입니다. 10번 줄에서 `v:lnum`의 값은 10입니다.
- `getline(v:lnum)[0]`의 `[0]`는 각 줄의 첫 번째 문자를 나타냅니다. Vim이 줄을 스캔할 때 `getline(v:lnum)`은 각 줄의 내용을 반환합니다. `getline(v:lnum)[0]`은 각 줄의 첫 번째 문자를 반환합니다. 목록의 첫 번째 줄 "donut"에서 `getline(v:lnum)[0]`은 "d"를 반환합니다. 목록의 두 번째 줄 "pancake"에서 `getline(v:lnum)[0]`은 "p"를 반환합니다.
- `==\\"p\\"`는 동등성 표현식의 두 번째 절입니다. 방금 평가한 표현식이 "p"와 같은지 확인합니다. 참이면 1을 반환하고, 거짓이면 0을 반환합니다. Vim에서 1은 참이고 0은 거짓입니다. 따라서 "p"로 시작하는 줄에서는 1을 반환합니다. `'foldexpr'`의 값이 1이면 접기 수준이 1입니다.

이 표현식을 실행한 후 다음과 같은 결과를 볼 수 있습니다:

```shell
donut
+-- 3 lines: pancake -----
salmon
scrambled eggs
```

## 구문 접기

구문 접기는 구문 언어 강조에 의해 결정됩니다. [vim-polyglot](https://github.com/sheerun/vim-polyglot)와 같은 언어 구문 플러그인을 사용하면 구문 접기가 즉시 작동합니다. 접기 방법을 구문으로 변경하기만 하면 됩니다:

```shell
:set foldmethod=syntax
```

JavaScript 파일을 편집하고 vim-polyglot이 설치되어 있다고 가정해 보겠습니다. 다음과 같은 배열이 있다고 가정해 보세요:

```shell
const nums = [
  one,
  two,
  three,
  four
]
```

구문 접기로 접힐 것입니다. 특정 언어에 대한 구문 강조를 정의할 때(일반적으로 `syntax/` 디렉토리 내에서), 접기 가능하도록 `fold` 속성을 추가할 수 있습니다. 아래는 vim-polyglot JavaScript 구문 파일의 스니펫입니다. 끝에 `fold` 키워드가 있는 것을 주목하세요.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

이 가이드는 `syntax` 기능을 다루지 않습니다. 궁금하다면 `:h syntax.txt`를 확인하세요.

## 차이 접기

Vim은 두 개 이상의 파일을 비교하기 위한 차이 절차를 수행할 수 있습니다.

`file1.txt`가 다음과 같다고 가정해 보겠습니다:

```shell
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
```

그리고 `file2.txt`가 다음과 같다고 가정해 보겠습니다:

```shell
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
emacs is ok
```

`vimdiff file1.txt file2.txt`를 실행하세요:

```shell
+-- 3 lines: vim is awesome -----
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
vim is awesome
[vim is awesome] / [emacs is ok]
```

Vim은 동일한 줄 중 일부를 자동으로 접습니다. `vimdiff` 명령을 실행할 때 Vim은 자동으로 `foldmethod=diff`를 사용합니다. `:set foldmethod?`를 실행하면 `diff`가 반환됩니다.

## 마커 접기

마커 접기를 사용하려면 다음을 실행하세요:

```shell
:set foldmethod=marker
```

다음과 같은 텍스트가 있다고 가정해 보겠습니다:

```shell
Hello

{{{
world
vim
}}}
```

`zM`을 실행하면 다음과 같은 결과를 볼 수 있습니다:

```shell
hello

+-- 4 lines: -----
```

Vim은 `{{{`와 `}}}`를 접기 지시자로 보고 그 사이의 텍스트를 접습니다. 마커 접기에서는 Vim이 `'foldmarker'` 옵션으로 정의된 특별한 마커를 찾아 접기 영역을 표시합니다. Vim이 사용하는 마커를 보려면 다음을 실행하세요:

```shell
:set foldmarker?
```

기본적으로 Vim은 `{{{`와 `}}}`를 지시자로 사용합니다. 지시자를 "coffee1"과 "coffee2"와 같은 다른 텍스트로 변경하려면:

```shell
:set foldmarker=coffee1,coffee2
```

다음과 같은 텍스트가 있다고 가정해 보겠습니다:

```shell
hello

coffee1
world
vim
coffee2
```

이제 Vim은 `coffee1`과 `coffee2`를 새로운 접기 마커로 사용합니다. 참고로, 지시자는 리터럴 문자열이어야 하며 정규 표현식일 수 없습니다.

## 접기 유지

Vim 세션을 닫으면 모든 접기 정보가 사라집니다. `count.txt`라는 파일이 있다고 가정해 보겠습니다:

```shell
one
two
three
four
five
```

그런 다음 "three" 줄부터 수동으로 접기를 수행합니다(`:3,$fold`):

```shell
one
two
+-- 3 lines: three ---
```

Vim을 종료하고 `count.txt`를 다시 열면 접기가 더 이상 없습니다!

접기를 유지하려면, 접기 후 다음을 실행하세요:

```shell
:mkview
```

그런 다음 `count.txt`를 열 때 다음을 실행하세요:

```shell
:loadview
```

접기가 복원됩니다. 그러나 `mkview`와 `loadview`를 수동으로 실행해야 합니다. 언젠가는 파일을 닫기 전에 `mkview`를 실행하는 것을 잊어버릴 것이고 모든 접기를 잃게 될 것입니다. 이 과정을 자동화할 수 있는 방법은 무엇일까요?

`.txt` 파일을 닫을 때 자동으로 `mkview`를 실행하고, `.txt` 파일을 열 때 `loadview`를 실행하려면, vimrc에 다음을 추가하세요:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

`autocmd`는 이벤트 트리거에 따라 명령을 실행하는 데 사용됩니다. 여기서 두 이벤트는 다음과 같습니다:
- `BufWinLeave`: 버퍼를 창에서 제거할 때.
- `BufWinEnter`: 버퍼를 창에 로드할 때.

이제 `.txt` 파일 내에서 접기를 수행하고 Vim을 종료한 후, 다음에 해당 파일을 열 때 접기 정보가 복원됩니다.

기본적으로 Vim은 `mkview`를 실행할 때 `~/.vim/view`에 접기 정보를 저장합니다. 더 많은 정보는 `:h 'viewdir'`를 확인하세요.
## 스마트한 방법으로 접기 배우기

제가 처음 Vim을 시작했을 때, 접기를 배우는 것을 소홀히 했습니다. 왜냐하면 그것이 유용하다고 생각하지 않았기 때문입니다. 그러나 코드를 작성할수록 접기가 더 유용하다는 것을 알게 되었습니다. 전략적으로 배치된 접기는 텍스트 구조에 대한 더 나은 개요를 제공할 수 있습니다. 마치 책의 목차와 같습니다.

접기를 배울 때는 수동 접기부터 시작하세요. 이는 이동 중에도 사용할 수 있습니다. 그런 다음 점차적으로 들여쓰기 및 마커 접기를 하는 다양한 요령을 배우세요. 마지막으로, 구문 및 표현 접기를 배우세요. 후자의 두 가지를 사용하여 자신의 Vim 플러그인을 작성할 수도 있습니다.