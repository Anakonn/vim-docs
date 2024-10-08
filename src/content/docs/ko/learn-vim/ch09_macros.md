---
description: Vim 매크로를 사용하여 반복 작업을 자동화하는 방법을 배우고, 파일 편집을 쉽게 만드는 기술을 익혀보세요.
title: Ch09. Macros
---

파일을 편집할 때, 동일한 작업을 반복하게 되는 경우가 있습니다. 이러한 작업을 한 번 수행하고 필요할 때마다 재생할 수 있다면 좋지 않을까요? Vim 매크로를 사용하면 작업을 기록하고 이를 Vim 레지스터에 저장하여 필요할 때마다 실행할 수 있습니다.

이 장에서는 매크로를 사용하여 일상적인 작업을 자동화하는 방법을 배우게 됩니다 (파일이 스스로 편집되는 모습을 보는 것도 멋집니다).

## 기본 매크로

Vim 매크로의 기본 구문은 다음과 같습니다:

```shell
qa                     레지스터 a에 매크로 녹음 시작
q (녹음 중)           매크로 녹음 중지
```

매크로를 저장하기 위해 소문자(a-z)를 선택할 수 있습니다. 매크로를 실행하는 방법은 다음과 같습니다:

```shell
@a    레지스터 a에서 매크로 실행
@@    마지막으로 실행된 매크로 실행
```

다음과 같은 텍스트가 있다고 가정하고 각 줄의 모든 내용을 대문자로 바꾸고 싶습니다:

```shell
hello
vim
macros
are
awesome
```

커서를 "hello" 줄의 시작 부분에 두고 다음을 실행합니다:

```shell
qa0gU$jq
```

세부 사항:
- `qa`는 a 레지스터에 매크로 녹음을 시작합니다.
- `0`은 줄의 시작으로 이동합니다.
- `gU$`는 현재 위치에서 줄의 끝까지 텍스트를 대문자로 변환합니다.
- `j`는 한 줄 아래로 이동합니다.
- `q`는 녹음을 중지합니다.

재생하려면 `@a`를 실행합니다. 다른 많은 Vim 명령어와 마찬가지로, 매크로에 카운트 인수를 전달할 수 있습니다. 예를 들어, `3@a`를 실행하면 매크로가 세 번 실행됩니다.

## 안전 장치

매크로 실행은 오류가 발생하면 자동으로 종료됩니다. 다음과 같은 텍스트가 있다고 가정해 보겠습니다:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

각 줄의 첫 번째 단어를 대문자로 바꾸고 싶다면, 다음 매크로가 작동해야 합니다:

```shell
qa0W~jq
```

위 명령어의 세부 사항은 다음과 같습니다:
- `qa`는 a 레지스터에 매크로 녹음을 시작합니다.
- `0`은 줄의 시작으로 이동합니다.
- `W`는 다음 단어로 이동합니다.
- `~`는 커서 아래의 문자의 대소문자를 전환합니다.
- `j`는 한 줄 아래로 이동합니다.
- `q`는 녹음을 중지합니다.

저는 매크로 실행을 과도하게 카운트하는 것을 선호하므로 보통 99번(`99@a`) 실행합니다. 이 명령으로 Vim은 실제로 매크로를 99번 실행하지 않습니다. Vim이 마지막 줄에 도달하고 `j` 동작을 실행할 때 더 이상 아래로 갈 줄이 없으면 오류가 발생하고 매크로 실행이 중지됩니다.

매크로 실행이 첫 번째 오류 발생 시 중지되는 것은 좋은 기능입니다. 그렇지 않으면 Vim은 이미 줄의 끝에 도달했음에도 불구하고 이 매크로를 99번 계속 실행할 것입니다.

## 명령줄 매크로

정상 모드에서 `@a`를 실행하는 것 외에도 Vim에서 매크로를 실행할 수 있는 방법이 있습니다. `:normal @a` 명령줄을 실행할 수도 있습니다. `:normal`은 사용자가 인수로 전달된 모든 정상 모드 명령을 실행할 수 있게 해줍니다. 위의 경우, 이는 정상 모드에서 `@a`를 실행하는 것과 동일합니다.

`:normal` 명령은 범위를 인수로 받을 수 있습니다. 이를 사용하여 선택한 범위에서 매크로를 실행할 수 있습니다. 예를 들어, 2번 줄과 3번 줄 사이에서 매크로를 실행하려면 `:2,3 normal @a`를 실행할 수 있습니다.

## 여러 파일에서 매크로 실행

여러 개의 `.txt` 파일이 있다고 가정해 보겠습니다. 각 파일에는 일부 텍스트가 포함되어 있습니다. 당신의 작업은 "donut"라는 단어가 포함된 줄의 첫 번째 단어만 대문자로 바꾸는 것입니다. 레지스터 a에 `0W~j`가 있다고 가정합니다 (이전과 동일한 매크로). 어떻게 빠르게 이를 수행할 수 있을까요?

첫 번째 파일:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

두 번째 파일:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

세 번째 파일:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

다음과 같이 할 수 있습니다:
- `:args *.txt`를 사용하여 현재 디렉토리의 모든 `.txt` 파일을 찾습니다.
- `:argdo g/donut/normal @a`는 `:args` 내의 각 파일에서 글로벌 명령 `g/donut/normal @a`를 실행합니다.
- `:argdo update`는 버퍼가 수정되었을 때 `:args` 내의 각 파일을 저장하기 위해 `update` 명령을 실행합니다.

글로벌 명령 `:g/donut/normal @a`에 익숙하지 않다면, 이는 패턴(`donut/`)과 일치하는 줄에서 제공한 명령(`normal @a`)을 실행합니다. 글로벌 명령에 대해서는 나중 장에서 다룰 것입니다.

## 재귀 매크로

매크로를 녹음하는 동안 동일한 매크로 레지스터를 호출하여 재귀적으로 실행할 수 있습니다. 다음 목록이 있다고 가정하고 첫 번째 단어의 대소문자를 전환해야 합니다:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

이번에는 재귀적으로 해보겠습니다. 다음을 실행합니다:

```shell
qaqqa0W~j@aq
```

단계의 세부 사항은 다음과 같습니다:
- `qaq`는 빈 매크로 a를 기록합니다. 재귀적으로 매크로를 호출할 때 그 레지스터에 있는 내용을 실행하기 위해 빈 레지스터로 시작하는 것이 필요합니다.
- `qa`는 a 레지스터에 녹음을 시작합니다.
- `0`은 현재 줄의 첫 번째 문자로 이동합니다.
- `W`는 다음 단어로 이동합니다.
- `~`는 커서 아래의 문자의 대소문자를 전환합니다.
- `j`는 한 줄 아래로 이동합니다.
- `@a`는 매크로 a를 실행합니다.
- `q`는 녹음을 중지합니다.

이제 `@a`를 실행하면 Vim이 매크로를 재귀적으로 실행하는 모습을 볼 수 있습니다.

매크로가 언제 중지해야 하는지 어떻게 알았을까요? 매크로가 마지막 줄에 있을 때 `j`를 실행하려고 했고, 더 이상 아래로 갈 줄이 없으므로 매크로 실행이 중지되었습니다.

## 매크로 추가

기존 매크로에 작업을 추가해야 하는 경우, 매크로를 처음부터 다시 만들지 않고 기존 매크로에 작업을 추가할 수 있습니다. 레지스터 장에서 배운 바와 같이, 대문자 기호를 사용하여 이름이 지정된 레지스터에 추가할 수 있습니다. 같은 규칙이 적용됩니다. 레지스터 a 매크로에 작업을 추가하려면 레지스터 A를 사용합니다.

레지스터 a에 매크로를 기록합니다: `qa0W~q` (이 시퀀스는 줄의 다음 단어의 대소문자를 전환합니다). 줄 끝에 점을 추가하는 새로운 시퀀스를 추가하려면 다음을 실행합니다:

```shell
qAA.<Esc>q
```

세부 사항:
- `qA`는 레지스터 A에 매크로 녹음을 시작합니다.
- `A.<Esc>`는 줄 끝에 (여기서 `A`는 삽입 모드 명령으로 매크로 A와 혼동하지 마십시오) 점을 삽입한 후 삽입 모드를 종료합니다.
- `q`는 매크로 녹음을 중지합니다.

이제 `@a`를 실행하면 다음 단어의 대소문자를 전환할 뿐만 아니라 줄 끝에 점도 추가됩니다.

## 매크로 수정

매크로 중간에 새로운 작업을 추가해야 한다면 어떻게 해야 할까요?

첫 번째 실제 단어를 대문자로 전환하고 줄 끝에 마침표를 추가하는 매크로가 있다고 가정합니다. 레지스터 a에 `0W~A.<Esc>`가 있습니다. 첫 번째 단어를 대문자로 바꾸고 줄 끝에 마침표를 추가하는 것 사이에 "deep fried"라는 단어를 "donut" 앞에 추가해야 한다고 가정합니다 *(일반 도넛보다 더 좋은 것은 깊이 튀긴 도넛입니다)*.

이전 섹션의 텍스트를 재사용하겠습니다:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

먼저 기존 매크로를 호출합니다 (이전 섹션에서 매크로를 레지스터 a에 저장했다고 가정합니다) `:put a`로:

```shell
0W~A.^[
```

이 `^[`는 무엇인가요? `0W~A.<Esc>`를 하지 않았나요? `<Esc>`는 어디에 있나요? `^[`는 Vim의 *내부 코드* 표현으로 `<Esc>`를 나타냅니다. 특정 특수 키와 함께, Vim은 이러한 키의 표현을 내부 코드 형태로 출력합니다. `<Esc>`, `<Backspace>`, `<Enter>`와 같은 일반적인 키는 내부 코드 표현이 있습니다. 더 많은 특수 키가 있지만, 이는 이 장의 범위를 벗어납니다.

매크로로 돌아가서, 대소문자 전환 연산자(`~`) 바로 뒤에 줄 끝으로 이동하는 명령(`$`), 한 단어 뒤로 이동하는 명령(`b`), 삽입 모드로 이동하는 명령(`i`), "deep fried "를 입력하는 명령(공백을 잊지 마세요), 그리고 삽입 모드를 종료하는 명령(`<Esc>`)을 추가해 보겠습니다.

결과적으로 다음과 같이 될 것입니다:

```shell
0W~$bideep fried <Esc>A.^[
```

작은 문제가 있습니다. Vim은 `<Esc>`를 이해하지 못합니다. `<Esc>`를 문자 그대로 입력할 수는 없습니다. `<Esc>` 키의 내부 코드 표현을 작성해야 합니다. 삽입 모드에서 `Ctrl-V`를 누른 후 `<Esc>`를 누르면 Vim이 `^[`을 출력합니다. `Ctrl-V`는 다음 비숫자 문자를 *문자 그대로* 삽입하는 삽입 모드 연산자입니다. 이제 매크로 코드는 다음과 같아야 합니다:

```shell
0W~$bideep fried ^[A.^[
```

수정된 명령을 레지스터 a에 추가하려면, 이름이 지정된 레지스터에 새 항목을 추가하는 것과 동일한 방법으로 할 수 있습니다. 줄의 시작 부분에서 `“ay$`를 실행하여 복사한 텍스트를 레지스터 a에 저장합니다.

이제 `@a`를 실행하면 매크로가 첫 번째 단어의 대소문자를 전환하고, "donut" 앞에 "deep fried "를 추가하고, 줄 끝에 "."를 추가합니다. 맛있네요!

매크로를 수정하는 또 다른 방법은 명령줄 표현을 사용하는 것입니다. `:let @a="`를 입력한 후 `Ctrl-R a`를 입력하면 레지스터 a의 내용을 문자 그대로 붙여넣습니다. 마지막으로 큰따옴표(`"`)를 닫는 것을 잊지 마세요. 다음과 같은 내용이 있을 것입니다: `:let @a="0W~$bideep fried ^[A.^["`.

## 매크로 중복

매크로를 한 레지스터에서 다른 레지스터로 쉽게 복제할 수 있습니다. 예를 들어, 레지스터 a의 매크로를 레지스터 z로 복제하려면 `:let @z = @a`를 입력하면 됩니다. `@a`는 레지스터 a의 내용을 나타냅니다. 이제 `@z`를 실행하면 `@a`와 동일한 작업을 수행합니다.

저는 가장 자주 사용하는 매크로에 중복성을 만드는 것이 유용하다고 생각합니다. 제 작업 흐름에서는 보통 첫 번째 7개의 알파벳(a-g)에 매크로를 기록하고, 자주 생각 없이 교체합니다. 유용한 매크로를 알파벳의 끝으로 이동시키면, 실수로 교체할 걱정 없이 보존할 수 있습니다.

## 시리즈 대 병렬 매크로

Vim은 매크로를 시리즈와 병렬로 실행할 수 있습니다. 다음과 같은 텍스트가 있다고 가정해 보겠습니다:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

모든 대문자 "FUNC"를 소문자로 바꾸는 매크로를 기록하려면, 다음 매크로가 작동해야 합니다:

```shell
qa0f{gui{jq
```

세부 사항:
- `qa`는 a 레지스터에 녹음을 시작합니다.
- `0`은 첫 번째 줄로 이동합니다.
- `f{`는 "{"의 첫 번째 인스턴스를 찾습니다.
- `gui{`는 괄호 텍스트 객체(`i{`) 내의 텍스트를 소문자로 변환합니다.
- `j`는 한 줄 아래로 이동합니다.
- `q`는 매크로 녹음을 중지합니다.

이제 `99@a`를 실행하여 나머지 줄에서 실행할 수 있습니다. 그러나 파일 내에 다음과 같은 import 표현이 있다면 어떻게 될까요?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

`99@a`를 실행하면 매크로가 세 번만 실행됩니다. "foo" 줄에서 `f{`를 실행할 수 없기 때문에 마지막 두 줄에서 매크로가 실행되지 않습니다. 이는 시리즈로 매크로를 실행할 때 예상되는 결과입니다. "FUNC4"가 있는 다음 줄로 이동하여 매크로를 다시 재생할 수 있습니다. 그러나 모든 작업을 한 번에 끝내고 싶다면 어떻게 해야 할까요?

병렬로 매크로를 실행합니다.

이전 섹션에서 매크로는 명령줄 명령 `:normal`을 사용하여 실행할 수 있다고 언급했습니다 (예: `:3,5 normal @a`는 3-5 줄에서 매크로 a를 실행합니다). `:1,$ normal @a`를 실행하면 "foo" 줄을 제외한 모든 줄에서 매크로가 실행되는 것을 볼 수 있습니다. 작동합니다!

비록 내부적으로 Vim이 실제로 매크로를 병렬로 실행하지는 않지만, 외부적으로는 그렇게 작동합니다. Vim은 첫 번째 줄에서 마지막 줄(`1,$`)까지 각 줄에서 `@a`를 *독립적으로* 실행합니다. 각 줄은 매크로 실행 중 "foo" 줄에서 하나의 실행이 실패했다는 사실을 알지 못합니다.
## 스마트한 방법으로 매크로 배우기

편집에서 하는 많은 일들은 반복적입니다. 편집 실력을 향상시키기 위해 반복적인 행동을 감지하는 습관을 들이세요. 매크로(또는 점 명령)를 사용하여 같은 행동을 두 번 수행하지 않도록 하세요. Vim에서 할 수 있는 거의 모든 것은 매크로로 복제할 수 있습니다.

처음에는 매크로를 작성하는 것이 매우 어색하게 느껴지지만 포기하지 마세요. 충분한 연습을 통해 모든 것을 자동화하는 습관을 들일 수 있습니다.

매크로를 기억하는 데 도움이 되는 기억술을 사용하는 것이 유용할 수 있습니다. 함수를 생성하는 매크로가 있다면 "f 레지스터(`qf`)를 사용하세요. 수치 연산을 위한 매크로가 있다면 "n 레지스터를 사용해야 합니다(`qn`). 그 작업을 생각할 때 떠오르는 *첫 번째 명명된 레지스터*로 이름을 짓세요. 또한 "q 레지스터는 기본 매크로 레지스터로 좋다고 생각합니다. 왜냐하면 `qq`는 생각하는 데 더 적은 뇌의 힘이 필요하기 때문입니다. 마지막으로, 매크로를 알파벳 순서로 증가시키는 것도 좋아합니다. 예를 들어 `qa`, 그 다음 `qb`, 그 다음 `qc` 등으로 말이죠.

자신에게 가장 잘 맞는 방법을 찾으세요.