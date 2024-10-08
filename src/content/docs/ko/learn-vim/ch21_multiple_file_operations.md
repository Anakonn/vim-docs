---
description: 여러 파일에서 명령을 실행하는 다양한 방법을 배우고, Vim에서 효율적으로 편집하는 도구를 익혀보세요.
title: Ch21. Multiple File Operations
---

여러 파일에서 업데이트할 수 있는 기능은 유용한 편집 도구입니다. 이전에 `cfdo`를 사용하여 여러 텍스트를 업데이트하는 방법을 배웠습니다. 이 장에서는 Vim에서 여러 파일을 편집하는 다양한 방법을 배웁니다.

## 여러 파일에서 명령을 실행하는 다양한 방법

Vim에는 여러 파일에서 명령을 실행하는 여덟 가지 방법이 있습니다:
- 인수 목록 (`argdo`)
- 버퍼 목록 (`bufdo`)
- 창 목록 (`windo`)
- 탭 목록 (`tabdo`)
- 퀵픽스 목록 (`cdo`)
- 퀵픽스 목록 파일 단위 (`cfdo`)
- 위치 목록 (`ldo`)
- 위치 목록 파일 단위 (`lfdo`)

실제로는 대부분의 경우 한두 가지 방법만 사용할 것입니다(저는 개인적으로 `cdo`와 `argdo`를 더 많이 사용합니다), 하지만 사용 가능한 모든 옵션에 대해 배우고 자신의 편집 스타일에 맞는 것을 사용하는 것이 좋습니다.

여덟 개의 명령을 배우는 것은 벅차게 느껴질 수 있습니다. 하지만 실제로 이 명령들은 비슷하게 작동합니다. 하나를 배우면 나머지를 배우는 것이 더 쉬워집니다. 이들은 모두 같은 큰 아이디어를 공유합니다: 각 카테고리의 목록을 만들고 실행할 명령을 전달하는 것입니다.

## 인수 목록

인수 목록은 가장 기본적인 목록입니다. 파일 목록을 생성합니다. file1, file2, file3의 목록을 만들려면 다음을 실행합니다:

```shell
:args file1 file2 file3
```

와일드카드(`*`)를 전달할 수도 있습니다. 현재 디렉토리의 모든 `.js` 파일 목록을 만들고 싶다면 다음을 실행합니다:

```shell
:args *.js
```

현재 디렉토리에서 "a"로 시작하는 모든 Javascript 파일 목록을 만들고 싶다면 다음을 실행합니다:

```shell
:args a*.js
```

와일드카드는 현재 디렉토리의 파일 이름 문자 중 하나 이상과 일치하지만, 모든 디렉토리에서 재귀적으로 검색해야 한다면 어떻게 해야 할까요? 이 경우 이중 와일드카드(`**`)를 사용할 수 있습니다. 현재 위치의 디렉토리 내 모든 Javascript 파일을 가져오려면 다음을 실행합니다:

```shell
:args **/*.js
```

`args` 명령을 실행하면 현재 버퍼가 목록의 첫 번째 항목으로 전환됩니다. 방금 생성한 파일 목록을 보려면 `:args`를 실행합니다. 목록을 생성한 후에는 탐색할 수 있습니다. `:first`는 목록의 첫 번째 항목으로 이동하고, `:last`는 마지막 항목으로 이동합니다. 목록을 한 파일씩 앞으로 이동하려면 `:next`를 실행하고, 한 파일씩 뒤로 이동하려면 `:prev`를 실행합니다. 한 파일씩 앞으로/뒤로 이동하고 변경 사항을 저장하려면 `:wnext`와 `:wprev`를 실행합니다. 탐색 명령은 더 많이 있습니다. 더 많은 정보를 원하면 `:h arglist`를 확인하세요.

인수 목록은 특정 유형의 파일이나 몇 개의 파일을 대상으로 해야 할 때 유용합니다. 모든 `yml` 파일 내의 "donut"를 "pancake"로 업데이트해야 한다면 다음을 실행할 수 있습니다:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

`args` 명령을 다시 실행하면 이전 목록이 대체됩니다. 예를 들어, 이전에 다음을 실행했다면:

```shell
:args file1 file2 file3
```

이 파일들이 존재한다고 가정하면, 이제 `file1`, `file2`, `file3`의 목록이 있습니다. 그런 다음 다음을 실행합니다:

```shell
:args file4 file5
```

`file1`, `file2`, `file3`의 초기 목록은 `file4`와 `file5`로 대체됩니다. 인수 목록에 `file1`, `file2`, `file3`이 있고 초기 파일 목록에 `file4`와 `file5`를 *추가*하고 싶다면 `:arga` 명령을 사용하세요. 다음을 실행합니다:

```shell
:arga file4 file5
```

이제 인수 목록에 `file1`, `file2`, `file3`, `file4`, `file5`가 있습니다.

`:arga`를 인수 없이 실행하면 Vim은 현재 버퍼를 현재 인수 목록에 추가합니다. 이미 `file1`, `file2`, `file3`이 인수 목록에 있고 현재 버퍼가 `file5`에 있다면, `:arga`를 실행하면 `file5`가 목록에 추가됩니다.

목록을 생성한 후에는 원하는 명령줄 명령과 함께 전달할 수 있습니다. 대체로 치환(`:argdo %s/donut/pancake/g`)으로 수행되는 것을 보았습니다. 다른 예시로는:
- 인수 목록에서 "dessert"를 포함하는 모든 줄을 삭제하려면 `:argdo g/dessert/d`를 실행합니다.
- 인수 목록에서 매크로 a를 실행하려면 `:argdo norm @a`를 실행합니다.
- 첫 번째 줄에 "hello "와 파일 이름을 쓰려면 `:argdo 0put='hello ' .. @:`를 실행합니다.

작업이 끝나면 `:update`로 저장하는 것을 잊지 마세요.

때때로 인수 목록의 처음 n 항목에서만 명령을 실행해야 할 수도 있습니다. 그런 경우 `argdo` 명령에 주소를 전달하면 됩니다. 예를 들어, 목록의 처음 3 항목에서만 치환 명령을 실행하려면 `:1,3argdo %s/donut/pancake/g`를 실행합니다.

## 버퍼 목록

버퍼 목록은 새로운 파일을 편집할 때 자연스럽게 생성됩니다. 새 파일을 만들거나 파일을 열 때마다 Vim은 이를 버퍼에 저장합니다(명시적으로 삭제하지 않는 한). 따라서 이미 3개의 파일(`file1.rb file2.rb file3.rb`)을 열었다면, 버퍼 목록에 3개의 항목이 있습니다. 버퍼 목록을 표시하려면 `:buffers`를 실행합니다(대안으로 `:ls` 또는 `:files`를 사용할 수 있습니다). 앞으로와 뒤로 탐색하려면 `:bnext`와 `:bprev`를 사용합니다. 목록에서 첫 번째와 마지막 버퍼로 이동하려면 `:bfirst`와 `:blast`를 사용합니다(재미있나요? :D).

그런데 이 장과 관련 없는 멋진 버퍼 트릭이 있습니다: 버퍼 목록에 항목이 여러 개 있을 경우 `:ball`로 모두 표시할 수 있습니다(모든 버퍼). `ball` 명령은 모든 버퍼를 수평으로 표시합니다. 수직으로 표시하려면 `:vertical ball`을 실행합니다.

주제로 돌아가서, 모든 버퍼에서 작업을 실행하는 메커니즘은 인수 목록과 비슷합니다. 버퍼 목록을 생성한 후에는 실행할 명령 앞에 `:bufdo`를 붙이면 됩니다. 모든 버퍼에서 "donut"를 "pancake"로 치환하고 변경 사항을 저장하려면 `:bufdo %s/donut/pancake/g | update`를 실행합니다.

## 창 및 탭 목록

창과 탭 목록은 인수 및 버퍼 목록과 유사합니다. 유일한 차이점은 그들의 맥락과 구문입니다.

창 작업은 열린 각 창에서 수행되며 `:windo`로 수행됩니다. 탭 작업은 열린 각 탭에서 수행되며 `:tabdo`로 수행됩니다. 더 많은 정보를 원하면 `:h list-repeat`, `:h :windo`, 및 `:h :tabdo`를 확인하세요.

예를 들어, 세 개의 창이 열려 있고(세로 창은 `Ctrl-W v`, 가로 창은 `Ctrl-W s`로 열 수 있습니다) `:windo 0put ='hello' . @%`를 실행하면 Vim은 모든 열린 창에 "hello" + 파일 이름을 출력합니다.

## 퀵픽스 목록

이전 장(Ch3 및 Ch19)에서 퀵픽스에 대해 이야기했습니다. 퀵픽스는 여러 용도가 있습니다. 많은 인기 있는 플러그인이 퀵픽스를 사용하므로 이를 이해하는 데 더 많은 시간을 할애하는 것이 좋습니다.

Vim이 처음이라면 퀵픽스는 새로운 개념일 수 있습니다. 예전에는 코드를 명시적으로 컴파일해야 했던 시절, 컴파일 단계에서 오류를 만났습니다. 이러한 오류를 표시하려면 특별한 창이 필요했습니다. 그게 바로 퀵픽스입니다. 코드를 컴파일할 때 Vim은 오류 메시지를 퀵픽스 창에 표시하여 나중에 수정할 수 있도록 합니다. 많은 현대 언어는 더 이상 명시적인 컴파일을 요구하지 않지만, 그렇다고 해서 퀵픽스가 쓸모없어지지는 않습니다. 요즘 사람들은 퀵픽스를 가상 터미널 출력 표시 및 검색 결과 저장 등 다양한 용도로 사용합니다. 후자의 경우, 검색 결과 저장에 집중해 보겠습니다.

컴파일 명령 외에도 특정 Vim 명령은 퀵픽스 인터페이스에 의존합니다. 퀵픽스를 많이 사용하는 명령 유형 중 하나는 검색 명령입니다. `:vimgrep`와 `:grep`은 기본적으로 퀵픽스를 사용합니다.

예를 들어, 모든 Javascript 파일에서 "donut"를 재귀적으로 검색해야 한다면 다음을 실행할 수 있습니다:

```shell
:vimgrep /donut/ **/*.js
```

"donut" 검색 결과는 퀵픽스 창에 저장됩니다. 이 일치 결과의 퀵픽스 창을 보려면 다음을 실행합니다:

```shell
:copen
```

닫으려면 다음을 실행합니다:

```shell
:cclose
```

퀵픽스 목록을 앞으로와 뒤로 탐색하려면 다음을 실행합니다:

```shell
:cnext
:cprev
```

일치 항목의 첫 번째 및 마지막 항목으로 이동하려면 다음을 실행합니다:

```shell
:cfirst
:clast
```

앞서 두 개의 퀵픽스 명령이 있다고 언급했습니다: `cdo`와 `cfdo`. 이들은 어떻게 다를까요? `cdo`는 퀵픽스 목록의 각 항목에 대해 명령을 실행하는 반면, `cfdo`는 퀵픽스 목록의 각 *파일*에 대해 명령을 실행합니다.

명확히 하겠습니다. 위의 `vimgrep` 명령을 실행한 후 다음과 같은 결과가 있다고 가정해 보겠습니다:
- `file1.js`에서 1개의 결과
- `file2.js`에서 10개의 결과

`:cfdo %s/donut/pancake/g`를 실행하면, 이는 `file1.js`에서 한 번, `file2.js`에서 한 번 `%s/donut/pancake/g`를 실행합니다. 이는 일치하는 파일 수만큼 실행됩니다. 결과에 두 개의 파일이 있으므로 Vim은 `file1.js`에서 한 번, `file2.js`에서 한 번 치환 명령을 실행합니다. 두 번째 파일에 10개의 일치가 있음에도 불구하고 `cfdo`는 퀵픽스 목록에 있는 총 파일 수만 신경 씁니다.

`:cdo %s/donut/pancake/g`를 실행하면, 이는 `file1.js`에서 한 번, `file2.js`에서 *열 번* 실행됩니다. 이는 퀵픽스 목록의 실제 항목 수만큼 실행됩니다. `file1.js`에서 1개의 일치가 발견되고 `file2.js`에서 10개의 일치가 발견되므로 총 11번 실행됩니다.

`%s/donut/pancake/g`를 실행했으므로 `cfdo`를 사용하는 것이 합리적입니다. `cdo`를 사용하는 것은 의미가 없었습니다. 왜냐하면 `file2.js`에서 `%s/donut/pancake/g`를 열 번 실행하게 되기 때문입니다(`%s`는 파일 전체 치환입니다). 파일당 한 번 `%s`를 실행하는 것으로 충분합니다. `cdo`를 사용했다면 `s/donut/pancake/g`로 전달하는 것이 더 의미가 있을 것입니다.

`cfdo` 또는 `cdo`를 사용할지 결정할 때는 전달하는 명령의 범위를 생각하세요. 이것이 파일 전체 명령인지(`:%s` 또는 `:g`와 같은) 아니면 줄 단위 명령인지(`:s` 또는 `:!`와 같은) 확인하세요.

## 위치 목록

위치 목록은 퀵픽스 목록과 유사하게 Vim이 메시지를 표시하기 위해 특별한 창을 사용하는 점에서 유사합니다. 퀵픽스 목록과 위치 목록의 차이점은 언제든지 하나의 퀵픽스 목록만 가질 수 있는 반면, 여러 개의 위치 목록을 가질 수 있다는 점입니다.

두 개의 창이 열려 있다고 가정해 보겠습니다. 하나의 창은 `food.txt`를 표시하고 다른 하나는 `drinks.txt`를 표시합니다. `food.txt` 내부에서 위치 목록 검색 명령 `:lvimgrep`(`:vimgrep` 명령의 위치 변형)을 실행합니다:

```shell
:lvim /bagel/ **/*.md
```

Vim은 해당 `food.txt` *창*에 대한 모든 bagel 검색 일치를 위한 위치 목록을 생성합니다. 위치 목록을 보려면 `:lopen`을 실행합니다. 이제 다른 창인 `drinks.txt`로 이동하여 다음을 실행합니다:

```shell
:lvimgrep /milk/ **/*.md
```

Vim은 해당 `drinks.txt` *창*에 대한 모든 milk 검색 결과를 위한 *별도의* 위치 목록을 생성합니다.

각 창에서 실행하는 위치 명령마다 Vim은 별개의 위치 목록을 생성합니다. 10개의 서로 다른 창이 있다면 최대 10개의 서로 다른 위치 목록을 가질 수 있습니다. 반면 퀵픽스 목록은 언제든지 하나만 가질 수 있습니다. 10개의 서로 다른 창이 있어도 여전히 퀵픽스 목록은 하나뿐입니다.

대부분의 위치 목록 명령은 퀵픽스 명령과 유사하지만 대신 `l-`로 접두사가 붙습니다. 예를 들어: `:lvimgrep`, `:lgrep`, 및 `:lmake`는 `:vimgrep`, `:grep`, 및 `:make`와 같습니다. 위치 목록 창을 조작하는 명령도 퀵픽스 명령과 유사하게 `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext`, 및 `:lprev`는 `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext`, 및 `:cprev`와 같습니다.

두 개의 위치 목록 다중 파일 명령도 퀵픽스 다중 파일 명령과 유사합니다: `:ldo` 및 `:lfdo`. `:ldo`는 각 위치 목록에서 위치 명령을 실행하고, `:lfdo`는 위치 목록의 각 파일에 대해 위치 목록 명령을 실행합니다. 더 많은 정보를 원하면 `:h location-list`를 확인하세요.
## Vim에서 여러 파일 작업 실행하기

여러 파일 작업을 수행하는 방법을 아는 것은 편집에서 유용한 기술입니다. 여러 파일에서 변수 이름을 변경해야 할 때, 한 번에 실행하고 싶습니다. Vim에는 이를 수행할 수 있는 여덟 가지 방법이 있습니다.

실제로, 아마도 여덟 가지를 모두 똑같이 사용하지는 않을 것입니다. 한두 가지에 더 끌리게 될 것입니다. 시작할 때는 하나를 선택하세요(저는 개인적으로 `:argdo`를 시작하는 것을 추천합니다) 그리고 그것을 마스터하세요. 하나에 익숙해지면 다음 것을 배우세요. 두 번째, 세 번째, 네 번째를 배우는 것이 더 쉬워질 것입니다. 창의적으로 사용하세요. 다양한 조합으로 사용하세요. 이것을 수월하게 생각 없이 할 수 있을 때까지 계속 연습하세요. 당신의 근육 기억의 일부로 만드세요.

그렇게 말했으니, 당신은 Vim 편집을 마스터했습니다. 축하합니다!