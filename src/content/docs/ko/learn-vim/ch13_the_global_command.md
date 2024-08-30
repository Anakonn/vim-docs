---
description: 이 문서는 Vim의 글로벌 명령어 사용법을 설명하며, 여러 줄에서 명령어를 동시에 실행하는 방법을 배울 수 있습니다.
title: Ch13. the Global Command
---

지금까지 마지막 변경 사항을 점 명령어(`.`)로 반복하는 방법, 매크로(`q`)로 작업을 재생하는 방법, 그리고 레지스터(`"`)에 텍스트를 저장하는 방법을 배웠습니다.

이번 장에서는 글로벌 명령어로 명령줄 명령어를 반복하는 방법을 배웁니다.

## 글로벌 명령어 개요

Vim의 글로벌 명령어는 여러 줄에서 동시에 명령줄 명령어를 실행하는 데 사용됩니다.

그런데 "Ex 명령어"라는 용어를 들어본 적이 있을 것입니다. 이 가이드에서는 이를 명령줄 명령어라고 부릅니다. Ex 명령어와 명령줄 명령어는 동일합니다. 둘 다 콜론(`:`)으로 시작하는 명령어입니다. 지난 장의 치환 명령어는 Ex 명령어의 예였습니다. Ex는 원래 Ex 텍스트 편집기에서 유래되었기 때문에 붙여진 이름입니다. 이 가이드에서는 계속해서 이를 명령줄 명령어라고 부르겠습니다. Ex 명령어의 전체 목록은 `:h ex-cmd-index`를 확인하세요.

글로벌 명령어의 구문은 다음과 같습니다:

```shell
:g/pattern/command
```

`pattern`은 치환 명령어의 패턴과 유사하게 해당 패턴을 포함하는 모든 줄과 일치합니다. `command`는 어떤 명령줄 명령어든 될 수 있습니다. 글로벌 명령어는 `pattern`과 일치하는 각 줄에 대해 `command`를 실행하여 작동합니다.

다음과 같은 표현이 있다고 가정해 보겠습니다:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

"console"을 포함하는 모든 줄을 제거하려면 다음을 실행할 수 있습니다:

```shell
:g/console/d
```

결과:

```shell
const one = 1;

const two = 2;

const three = 3;
```

글로벌 명령어는 "console" 패턴과 일치하는 모든 줄에 대해 삭제 명령어(`d`)를 실행합니다.

`g` 명령어를 실행할 때, Vim은 파일을 두 번 스캔합니다. 첫 번째 실행에서 각 줄을 스캔하고 `/console/` 패턴과 일치하는 줄을 표시합니다. 모든 일치하는 줄이 표시되면 두 번째로 가서 표시된 줄에 대해 `d` 명령어를 실행합니다.

대신 "const"를 포함하는 모든 줄을 삭제하려면 다음을 실행합니다:

```shell
:g/const/d
```

결과:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## 반전 일치

일치하지 않는 줄에서 글로벌 명령어를 실행하려면 다음을 실행할 수 있습니다:

```shell
:g!/pattern/command
```

또는

```shell
:v/pattern/command
```

`:v/console/d`를 실행하면 "console"을 포함하지 않는 모든 줄을 삭제합니다.

## 패턴

글로벌 명령어는 치환 명령어와 동일한 패턴 시스템을 사용하므로 이 섹션은 복습 역할을 합니다. 다음 섹션으로 건너뛰어도 좋고 함께 읽어도 좋습니다!

다음과 같은 표현이 있다고 가정해 보겠습니다:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

"one" 또는 "two"를 포함하는 줄을 삭제하려면 다음을 실행합니다:

```shell
:g/one\|two/d
```

단일 숫자를 포함하는 줄을 삭제하려면 다음 중 하나를 실행합니다:

```shell
:g/[0-9]/d
```

또는

```shell
:g/\d/d
```

다음과 같은 표현이 있다고 가정해 보겠습니다:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

세 개에서 여섯 개의 0을 포함하는 줄과 일치시키려면 다음을 실행합니다:

```shell
:g/0\{3,6\}/d
```

## 범위 전달

`g` 명령어 앞에 범위를 전달할 수 있습니다. 다음은 이를 수행하는 몇 가지 방법입니다:
- `:1,5g/console/d`는 1행과 5행 사이의 "console" 문자열과 일치하여 삭제합니다.
- `:,5g/console/d`는 쉼표 앞에 주소가 없으면 현재 행에서 시작합니다. 현재 행과 5행 사이의 "console" 문자열을 찾고 삭제합니다.
- `:3,g/console/d`는 쉼표 뒤에 주소가 없으면 현재 행에서 끝납니다. 3행과 현재 행 사이의 "console" 문자열을 찾고 삭제합니다.
- `:3g/console/d`는 쉼표 없이 주소 하나만 전달하면 3행에서만 명령어를 실행합니다. 3행을 확인하고 "console" 문자열이 있으면 삭제합니다.

숫자 외에도 다음 기호를 범위로 사용할 수 있습니다:
- `.`는 현재 행을 의미합니다. `.,3` 범위는 현재 행과 3행 사이를 의미합니다.
- `$`는 파일의 마지막 행을 의미합니다. `3,$` 범위는 3행과 마지막 행 사이를 의미합니다.
- `+n`은 현재 행 이후 n행을 의미합니다. `.`와 함께 사용하거나 없이 사용할 수 있습니다. `3,+1` 또는 `3,.+1`은 3행과 현재 행 이후의 행 사이를 의미합니다.

범위를 지정하지 않으면 기본적으로 전체 파일에 영향을 미칩니다. 이는 사실 일반적이지 않습니다. 대부분의 Vim 명령줄 명령어는 범위를 전달하지 않으면 현재 행에서만 실행됩니다. 두 가지 주목할 만한 예외는 글로벌(`:g`) 및 저장(`:w`) 명령어입니다.

## 일반 명령어

글로벌 명령어로 일반 명령어를 실행할 수 있습니다. `:normal` 명령줄 명령어로 실행합니다.

다음과 같은 텍스트가 있다고 가정해 보겠습니다:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

각 줄 끝에 ";"를 추가하려면 다음을 실행합니다:

```shell
:g/./normal A;
```

다음과 같이 분석해 보겠습니다:
- `:g`는 글로벌 명령어입니다.
- `/./`는 "비어 있지 않은 줄"에 대한 패턴입니다. 최소한 하나의 문자가 있는 줄과 일치하므로 "const"와 "console"이 있는 줄과 일치하고 비어 있는 줄과는 일치하지 않습니다.
- `normal A;`는 `:normal` 명령줄 명령어를 실행합니다. `A;`는 줄 끝에 ";"를 삽입하는 일반 모드 명령입니다.

## 매크로 실행

글로벌 명령어로 매크로를 실행할 수도 있습니다. 매크로는 `normal` 명령어로 실행할 수 있습니다. 다음과 같은 표현이 있다고 가정해 보겠습니다:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

"const"가 있는 줄에는 세미콜론이 없음을 주목하세요. 레지스터 a에 해당 줄 끝에 세미콜론을 추가하는 매크로를 생성해 보겠습니다:

```shell
qaA;<Esc>q
```

복습이 필요하다면 매크로 장을 확인하세요. 이제 다음을 실행합니다:

```shell
:g/const/normal @a
```

이제 "const"가 있는 모든 줄 끝에 ";"가 추가됩니다.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

이 단계별로 진행했다면 첫 번째 줄에 세미콜론이 두 개 생겼을 것입니다. 이를 피하려면 두 번째 줄부터 글로벌 명령어를 실행하세요, `:2,$g/const/normal @a`.

## 재귀 글로벌 명령어

글로벌 명령어 자체가 명령줄 명령어의 일종이므로 기술적으로 글로벌 명령어 안에서 글로벌 명령어를 실행할 수 있습니다.

다음과 같은 표현이 있을 때, 두 번째 `console.log` 문을 삭제하고 싶다면:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

다음과 같이 실행합니다:

```shell
:g/console/g/two/d
```

첫 번째 `g`는 "console" 패턴을 포함하는 줄을 찾고 3개의 일치를 찾습니다. 그런 다음 두 번째 `g`는 이 3개의 일치 중 "two" 패턴을 포함하는 줄을 찾습니다. 마지막으로 그 일치를 삭제합니다.

`g`와 `v`를 결합하여 긍정적 및 부정적 패턴을 찾을 수도 있습니다. 예를 들어:

```shell
:g/console/v/two/d
```

"two" 패턴을 포함하는 줄을 찾는 대신 "two" 패턴을 포함하지 않는 줄을 찾습니다.

## 구분 기호 변경

치환 명령어와 마찬가지로 글로벌 명령어의 구분 기호를 변경할 수 있습니다. 규칙은 동일합니다: 알파벳, 숫자, `"`, `|`, 및 `\`를 제외한 모든 단일 바이트 문자를 사용할 수 있습니다.

"console"을 포함하는 줄을 삭제하려면:

```shell
:g@console@d
```

글로벌 명령어와 함께 치환 명령어를 사용하는 경우 두 개의 서로 다른 구분 기호를 가질 수 있습니다:

```shell
g@one@s+const+let+g
```

여기서 글로벌 명령어는 "one"을 포함하는 모든 줄을 찾습니다. 치환 명령어는 이러한 일치 중 "const" 문자열을 "let"으로 대체합니다.

## 기본 명령어

글로벌 명령어에서 명령줄 명령어를 지정하지 않으면 어떻게 될까요?

글로벌 명령어는 현재 줄의 텍스트를 인쇄하는 인쇄(`:p`) 명령어를 사용합니다. 다음을 실행하면:

```shell
:g/console
```

"console"을 포함하는 모든 줄이 화면 하단에 인쇄됩니다.

그런데 여기 흥미로운 사실이 있습니다. 글로벌 명령어에서 사용하는 기본 명령어가 `p`이기 때문에 `g` 구문은 다음과 같습니다:

```shell
:g/re/p
```

- `g` = 글로벌 명령어
- `re` = 정규 표현식 패턴
- `p` = 인쇄 명령어

이것은 *"grep"*을 철자합니다. 명령줄의 동일한 `grep`입니다. 이는 **우연이 아닙니다**. `g/re/p` 명령어는 원래 Ed 편집기에서 유래된 것으로, 원래의 라인 텍스트 편집기 중 하나입니다. `grep` 명령어는 Ed에서 이름을 따왔습니다.

여러분의 컴퓨터에는 아마도 Ed 편집기가 여전히 있을 것입니다. 터미널에서 `ed`를 실행해 보세요 (힌트: 종료하려면 `q`를 입력하세요).

## 전체 버퍼 반전

전체 파일을 반전하려면 다음을 실행합니다:

```shell
:g/^/m 0
```

`^`는 줄의 시작에 대한 패턴입니다. 빈 줄을 포함하여 모든 줄과 일치시키기 위해 `^`를 사용합니다.

몇 개의 줄만 반전하려면 범위를 전달하세요. 5행에서 10행 사이의 줄을 반전하려면 다음을 실행합니다:

```shell
:5,10g/^/m 0
```

이동 명령어에 대해 더 알아보려면 `:h :move`를 확인하세요.

## 모든 TODO 집계

코딩할 때 가끔 편집 중인 파일에 TODO를 작성하곤 합니다:

```shell
const one = 1;
console.log("one: ", one);
// TODO: feed the puppy

const two = 2;
// TODO: feed the puppy automatically
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: create a startup selling an automatic puppy feeder
```

작성한 모든 TODO를 추적하는 것이 어려울 수 있습니다. Vim에는 모든 일치를 주소로 복사하는 `:t` (복사) 방법이 있습니다. 복사 방법에 대해 더 알아보려면 `:h :copy`를 확인하세요.

모든 TODO를 파일 끝으로 복사하여 쉽게 검토할 수 있도록 하려면 다음을 실행합니다:

```shell
:g/TODO/t $
```

결과:

```shell
const one = 1;
console.log("one: ", one);
// TODO: feed the puppy

const two = 2;
// TODO: feed the puppy automatically
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: create a startup selling an automatic puppy feeder

// TODO: feed the puppy
// TODO: feed the puppy automatically
// TODO: create a startup selling an automatic puppy feeder
```

이제 내가 작성한 모든 TODO를 검토하고, 이를 수행할 시간을 찾거나 다른 사람에게 위임하고, 다음 작업을 계속 진행할 수 있습니다.

복사하는 대신 모든 TODO를 끝으로 이동하고 싶다면 이동 명령어인 `:m`을 사용하세요:

```shell
:g/TODO/m $
```

결과:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: feed the puppy
// TODO: feed the puppy automatically
// TODO: create a startup selling an automatic puppy feeder
```

## 블랙홀 삭제

레지스터 장에서 삭제된 텍스트는 번호가 매겨진 레지스터에 저장된다는 것을 기억하세요 (충분히 큰 경우). `:g/console/d`를 실행할 때마다 Vim은 삭제된 줄을 번호가 매겨진 레지스터에 저장합니다. 많은 줄을 삭제하면 모든 번호가 매겨진 레지스터가 빠르게 채워질 수 있습니다. 이를 피하려면 항상 블랙홀 레지스터(`"_`)를 사용하여 삭제된 줄을 레지스터에 저장하지 않도록 할 수 있습니다. 다음을 실행합니다:

```shell
:g/console/d_
```

`d` 뒤에 `_`를 전달하면 Vim은 스크래치 레지스터를 사용하지 않습니다.
## 여러 개의 빈 줄을 하나의 빈 줄로 줄이기

여러 개의 빈 줄이 있는 텍스트가 있을 경우:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

다음과 같이 빈 줄을 하나의 빈 줄로 빠르게 줄일 수 있습니다:

```shell
:g/^$/,/./-1j
```

결과:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

일반적으로 전역 명령은 다음 형식을 사용합니다: `:g/pattern/command`. 그러나 다음 형식으로 전역 명령을 실행할 수도 있습니다: `:g/pattern1/,/pattern2/command`. 이렇게 하면 Vim은 `pattern1`과 `pattern2` 사이에서 `command`를 적용합니다.

이 점을 염두에 두고 `:g/^$/,/./-1j` 명령을 `:g/pattern1/,/pattern2/command`에 따라 분해해 보겠습니다:
- `/pattern1/`는 `/^$/`입니다. 이는 빈 줄(문자가 없는 줄)을 나타냅니다.
- `/pattern2/`는 `/./`와 `-1` 줄 수정자를 사용합니다. `/./`는 비어 있지 않은 줄(최소한 하나의 문자가 있는 줄)을 나타냅니다. `-1`은 그 위의 줄을 의미합니다.
- `command`는 `j`, 즉 조인 명령(`:j`)입니다. 이 맥락에서 이 전역 명령은 주어진 모든 줄을 결합합니다.

그런데 여러 개의 빈 줄을 아예 없애고 싶다면 대신 다음을 실행하세요:

```shell
:g/^$/,/./j
```

더 간단한 대안:

```shell
:g/^$/-j
```

이제 텍스트는 다음과 같이 줄어들었습니다:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## 고급 정렬

Vim에는 범위 내의 줄을 정렬하는 `:sort` 명령이 있습니다. 예를 들어:

```shell
d
b
a
e
c
```

`:sort`를 실행하면 정렬됩니다. 범위를 지정하면 해당 범위 내의 줄만 정렬됩니다. 예를 들어, `:3,5sort`는 세 번째와 다섯 번째 줄만 정렬합니다.

다음과 같은 표현이 있을 경우:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

배열 내부의 요소를 정렬해야 하지만 배열 자체는 정렬하지 않으려면 다음을 실행할 수 있습니다:

```shell
:g/\[/+1,/\]/-1sort
```

결과:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

좋습니다! 하지만 명령이 복잡해 보입니다. 이를 분해해 보겠습니다. 이 명령도 `:g/pattern1/,/pattern2/command` 형식을 따릅니다.

- `:g`는 전역 명령 패턴입니다.
- `/\[/+1`은 첫 번째 패턴입니다. 이는 리터럴 왼쪽 대괄호 "["와 일치합니다. `+1`은 그 아래의 줄을 의미합니다.
- `/\]/-1`은 두 번째 패턴입니다. 이는 리터럴 오른쪽 대괄호 "]"와 일치합니다. `-1`은 그 위의 줄을 의미합니다.
- `/\[/+1,/\]/-1`은 "["와 "]" 사이의 모든 줄을 참조합니다.
- `sort`는 정렬을 위한 명령줄 명령입니다.

## 스마트한 방법으로 전역 명령 배우기

전역 명령은 모든 일치하는 줄에 대해 명령줄 명령을 실행합니다. 이를 통해 한 번만 명령을 실행하면 Vim이 나머지를 처리합니다. 전역 명령에 능숙해지려면 두 가지가 필요합니다: 명령줄 명령에 대한 좋은 어휘와 정규 표현식에 대한 지식입니다. Vim을 사용할수록 자연스럽게 더 많은 명령줄 명령을 배우게 될 것입니다. 정규 표현식에 대한 지식은 더 적극적인 접근이 필요합니다. 하지만 정규 표현식에 익숙해지면 많은 사람들보다 앞서 나갈 수 있습니다.

여기 있는 몇 가지 예제는 복잡합니다. 겁먹지 마세요. 정말 시간을 들여 이해하세요. 패턴을 읽는 법을 배우세요. 포기하지 마세요.

여러 개의 명령을 실행해야 할 때마다 잠시 멈추고 `g` 명령을 사용할 수 있는지 확인하세요. 작업에 가장 적합한 명령을 식별하고 한 번에 최대한 많은 것을 목표로 하는 패턴을 작성하세요.

이제 전역 명령이 얼마나 강력한지 알았으니, 외부 명령을 사용하여 도구를 늘리는 방법을 배워봅시다.