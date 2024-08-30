---
description: 이 문서는 Vim 태그를 사용하여 코드베이스에서 정의를 빠르게 찾는 방법을 설명합니다. 효율적인 코드 탐색을 위한 유용한 기능입니다.
title: Ch16. Tags
---

하나의 유용한 기능은 텍스트 편집에서 정의로 빠르게 이동할 수 있는 것입니다. 이 장에서는 Vim 태그를 사용하는 방법을 배웁니다.

## 태그 개요

누군가 새로운 코드베이스를 건네주었다고 가정해 보십시오:

```shell
one = One.new
one.donut
```

`One`? `donut`? 글쎄요, 이들은 예전 코드를 작성한 개발자들에게는 명백했을지 모르지만, 이제 그 개발자들은 더 이상 존재하지 않으며, 이러한 모호한 코드를 이해하는 것은 당신의 몫입니다. 이를 이해하는 한 가지 방법은 `One`과 `donut`이 정의된 소스 코드를 따라가는 것입니다.

`fzf` 또는 `grep`(또는 `vimgrep`)을 사용하여 검색할 수 있지만, 이 경우 태그가 더 빠릅니다.

태그를 주소록처럼 생각해 보십시오:

```shell
Name    Address
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

이름-주소 쌍 대신, 태그는 정의와 주소를 쌍으로 저장합니다.

같은 디렉토리에 다음 두 개의 Ruby 파일이 있다고 가정해 보겠습니다:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "Bar"
  end
end
```

그리고

```shell
## two.rb
require './one'

one = One.new
one.donut
```

정의로 점프하려면 일반 모드에서 `Ctrl-]`를 사용할 수 있습니다. `two.rb`에서 `one.donut`가 있는 줄로 가서 커서를 `donut` 위로 이동합니다. `Ctrl-]`를 누릅니다.

어이쿠, Vim이 태그 파일을 찾을 수 없습니다. 먼저 태그 파일을 생성해야 합니다.

## 태그 생성기

현대 Vim에는 태그 생성기가 포함되어 있지 않으므로 외부 태그 생성기를 다운로드해야 합니다. 선택할 수 있는 여러 옵션이 있습니다:

- ctags = C 전용. 거의 모든 곳에서 사용 가능.
- exuberant ctags = 가장 인기 있는 것 중 하나. 많은 언어 지원.
- universal ctags = exuberant ctags와 유사하지만 최신.
- etags = Emacs용. 음...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

온라인 Vim 튜토리얼을 살펴보면 많은 사람들이 [exuberant ctags](http://ctags.sourceforge.net/)를 추천합니다. [41개 프로그래밍 언어](http://ctags.sourceforge.net/languages.html)를 지원합니다. 저는 사용해봤고 잘 작동했습니다. 그러나 2009년 이후로 유지 관리되지 않았기 때문에 Universal ctags가 더 나은 선택이 될 것입니다. 이것은 exuberant ctags와 유사하게 작동하며 현재 유지 관리되고 있습니다.

universal ctags 설치 방법에 대한 자세한 내용은 [universal ctags](https://github.com/universal-ctags/ctags) 저장소를 확인하십시오.

universal ctags가 설치되었다고 가정하고, 기본 태그 파일을 생성해 보겠습니다. 다음을 실행합니다:

```shell
ctags -R .
```

`R` 옵션은 ctags에게 현재 위치(`.`)에서 재귀적으로 스캔하라고 지시합니다. 현재 디렉토리에서 `tags` 파일을 볼 수 있어야 합니다. 내부에는 다음과 같은 내용이 있을 것입니다:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

당신의 것은 Vim 설정 및 ctags 생성기에 따라 약간 다를 수 있습니다. 태그 파일은 두 부분으로 구성됩니다: 태그 메타데이터와 태그 목록. 이러한 메타데이터(`!TAG_FILE...`)는 일반적으로 ctags 생성기에 의해 제어됩니다. 여기서는 논의하지 않겠지만, 더 많은 내용을 확인하고 싶다면 그들의 문서를 자유롭게 확인하세요! 태그 목록은 ctags에 의해 색인화된 모든 정의의 목록입니다.

이제 `two.rb`로 가서 `donut` 위에 커서를 두고 `Ctrl-]`를 입력합니다. Vim은 `def donut`가 있는 `one.rb` 파일의 줄로 이동합니다. 성공입니다! 하지만 Vim은 어떻게 이 작업을 수행했을까요?

## 태그 구조

`donut` 태그 항목을 살펴보겠습니다:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

위의 태그 항목은 네 가지 구성 요소로 구성됩니다: `tagname`, `tagfile`, `tagaddress`, 및 태그 옵션.
- `donut`는 `tagname`입니다. 커서가 "donut"에 있을 때, Vim은 태그 파일에서 "donut" 문자열이 포함된 줄을 검색합니다.
- `one.rb`는 `tagfile`입니다. Vim은 `one.rb` 파일을 찾습니다.
- `/^ def donut$/`는 `tagaddress`입니다. `/.../`는 패턴 지시자입니다. `^`는 줄의 첫 번째 요소에 대한 패턴입니다. 두 개의 공백이 뒤따르고, 그 다음에 문자열 `def donut`이 있습니다. 마지막으로, `$`는 줄의 마지막 요소에 대한 패턴입니다.
- `f class:One`은 Vim에게 `donut` 함수가 함수(`f`)이며 `One` 클래스의 일부임을 알려주는 태그 옵션입니다.

태그 목록의 다른 항목을 살펴보겠습니다:

```shell
One	one.rb	/^class One$/;"	c
```

이 줄은 `donut` 패턴과 동일한 방식으로 작동합니다:

- `One`은 `tagname`입니다. 태그의 경우, 첫 번째 스캔은 대소문자를 구분합니다. 목록에 `One`과 `one`이 있으면, Vim은 `One`을 `one`보다 우선시합니다.
- `one.rb`는 `tagfile`입니다. Vim은 `one.rb` 파일을 찾습니다.
- `/^class One$/`는 `tagaddress` 패턴입니다. Vim은 `class`로 시작하고(`^`) `One`으로 끝나는 줄을 찾습니다(`$`).
- `c`는 가능한 태그 옵션 중 하나입니다. `One`은 루비 클래스이며 절차가 아니므로 `c`로 표시됩니다.

사용하는 태그 생성기에 따라 태그 파일의 내용은 다르게 보일 수 있습니다. 최소한 태그 파일은 다음 형식 중 하나를 가져야 합니다:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## 태그 파일

`ctags -R .`를 실행한 후 새로운 파일 `tags`가 생성된 것을 배웠습니다. Vim은 태그 파일을 어디에서 찾는지 어떻게 알까요?

`:set tags?`를 실행하면 `tags=./tags,tags`와 같은 결과를 볼 수 있습니다(당신의 Vim 설정에 따라 다를 수 있습니다). 여기서 Vim은 현재 파일의 경로에서 `./tags`의 경우 모든 태그를 찾고, `tags`의 경우 현재 디렉토리(프로젝트 루트)에서 찾습니다.

또한 `./tags`의 경우, Vim은 현재 파일의 경로 내에서 태그 파일을 먼저 찾고, 그 다음 현재 디렉토리(프로젝트 루트)의 태그 파일을 찾습니다. Vim은 첫 번째 일치를 찾으면 중지합니다.

당신의 `'tags'` 파일이 `tags=./tags,tags,/user/iggy/mytags/tags`라고 말했다면, Vim은 `./tags`와 `tags` 디렉토리 검색이 끝난 후 `/user/iggy/mytags` 디렉토리에서도 태그 파일을 찾습니다. 태그 파일을 프로젝트 내에 저장할 필요는 없으며, 별도로 보관할 수 있습니다.

새 태그 파일 위치를 추가하려면 다음을 사용하십시오:

```shell
set tags+=path/to/my/tags/file
```

## 대규모 프로젝트에 대한 태그 생성

대규모 프로젝트에서 ctags를 실행하려고 하면 시간이 오래 걸릴 수 있습니다. Vim은 모든 중첩된 디렉토리 내에서도 검색하기 때문입니다. 자바스크립트 개발자라면 `node_modules`가 매우 클 수 있다는 것을 알고 있습니다. 다섯 개의 하위 프로젝트가 있고 각 프로젝트에 자체 `node_modules` 디렉토리가 있다고 상상해 보십시오. `ctags -R .`를 실행하면 ctags는 모든 5개의 `node_modules`를 스캔하려고 시도합니다. `node_modules`에서 ctags를 실행할 필요는 없을 것입니다.

`node_modules`를 제외하고 ctags를 실행하려면 다음을 실행합니다:

```shell
ctags -R --exclude=node_modules .
```

이번에는 1초도 걸리지 않아야 합니다. 참고로 `exclude` 옵션을 여러 번 사용할 수 있습니다:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

요점은, 디렉토리를 생략하고 싶다면 `--exclude`가 가장 좋은 친구라는 것입니다.

## 태그 탐색

`Ctrl-]`만 사용해도 좋은 효과를 볼 수 있지만, 몇 가지 더 많은 요령을 배워봅시다. 태그 점프 키인 `Ctrl-]`에는 명령줄 모드 대안이 있습니다: `:tag {tag-name}`. 다음을 실행하면:

```shell
:tag donut
```

Vim은 "donut" 문자열에서 `Ctrl-]`를 누른 것처럼 `donut` 메서드로 점프합니다. `<Tab>`으로 인수를 자동 완성할 수도 있습니다:

```shell
:tag d<Tab>
```

Vim은 "d"로 시작하는 모든 태그를 나열합니다. 이 경우 "donut"입니다.

실제 프로젝트에서는 동일한 이름을 가진 여러 메서드를 만날 수 있습니다. 이전의 두 Ruby 파일을 업데이트해 보겠습니다. `one.rb` 내부에서:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "one donut"
  end

  def pancake
    puts "one pancake"
  end
end
```

`two.rb` 내부에서:

```shell
## two.rb
require './one.rb'

def pancake
  "Two pancakes"
end

one = One.new
one.donut
puts pancake
```

코딩을 따라하고 있다면, 이제 여러 새로운 절차가 생겼으므로 `ctags -R .`를 다시 실행하는 것을 잊지 마세요. `pancake` 절차의 두 인스턴스가 있습니다. `two.rb` 내부에 있고 `Ctrl-]`를 누르면 어떻게 될까요?

Vim은 `two.rb` 내부의 `def pancake`로 점프할 것이며, `one.rb` 내부의 `def pancake`로는 점프하지 않을 것입니다. 이는 Vim이 `two.rb` 내부의 `pancake` 절차를 다른 `pancake` 절차보다 우선시하기 때문입니다.

## 태그 우선순위

모든 태그가 동일한 것은 아닙니다. 일부 태그는 더 높은 우선순위를 가집니다. Vim이 중복 항목 이름을 만났을 때, Vim은 키워드의 우선순위를 확인합니다. 우선순위의 순서는 다음과 같습니다:

1. 현재 파일의 완전 일치하는 정적 태그.
2. 현재 파일의 완전 일치하는 전역 태그.
3. 다른 파일의 완전 일치하는 전역 태그.
4. 다른 파일의 완전 일치하는 정적 태그.
5. 현재 파일의 대소문자를 구분하지 않는 정적 태그.
6. 현재 파일의 대소문자를 구분하지 않는 전역 태그.
7. 다른 파일의 대소문자를 구분하지 않는 전역 태그.
8. 현재 파일의 대소문자를 구분하지 않는 정적 태그.

우선순위 목록에 따르면, Vim은 동일한 파일에서 발견된 정확한 일치를 우선시합니다. 그래서 Vim은 `one.rb` 내부의 `pancake` 절차보다 `two.rb` 내부의 `pancake` 절차를 선택합니다. 위의 우선순위 목록에는 `'tagcase'`, `'ignorecase'`, 및 `'smartcase'` 설정에 따라 몇 가지 예외가 있지만, 여기서는 논의하지 않겠습니다. 관심이 있다면 `:h tag-priority`를 확인해 보세요.

## 선택적 태그 점프

항상 가장 높은 우선순위의 태그 항목으로 이동하는 대신, 어떤 태그 항목으로 점프할지 선택할 수 있다면 좋을 것입니다. 아마도 당신은 `two.rb`의 `pancake` 메서드가 아니라 `one.rb`의 `pancake` 메서드로 점프하고 싶을 것입니다. 그렇게 하려면 `:tselect`를 사용할 수 있습니다. 다음을 실행합니다:

```shell
:tselect pancake
```

화면 하단에 다음과 같은 내용이 표시됩니다:
## pri kind tag               file
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

2를 입력하면 Vim은 `one.rb`의 프로시저로 이동합니다. 1을 입력하면 Vim은 `two.rb`의 프로시저로 이동합니다.

`pri` 열에 주목하세요. 첫 번째 일치 항목에는 `F C`가 있고 두 번째 일치 항목에는 `F`가 있습니다. 이것이 Vim이 태그 우선 순위를 결정하는 데 사용하는 것입니다. `F C`는 현재(`C`) 파일의 완전 일치(`F`) 글로벌 태그를 의미합니다. `F`는 완전 일치(`F`) 글로벌 태그만을 의미합니다. `F C`는 항상 `F`보다 높은 우선 순위를 가집니다.

`:tselect donut`를 실행하면 Vim은 선택할 태그 항목을 묻지만, 선택할 옵션이 하나뿐입니다. 여러 개의 일치 항목이 있을 때만 Vim이 태그 목록을 묻고, 하나의 태그가 발견되면 즉시 점프할 수 있는 방법이 있을까요?

물론입니다! Vim에는 `:tjump` 메서드가 있습니다. 실행하세요:

```shell
:tjump donut
```

Vim은 `one.rb`의 `donut` 프로시저로 즉시 점프합니다. 마치 `:tag donut`을 실행하는 것과 같습니다. 이제 실행하세요:

```shell
:tjump pancake
```

Vim은 선택할 태그 옵션을 묻습니다. 마치 `:tselect pancake`를 실행하는 것과 같습니다. `tjump`를 사용하면 두 방법의 장점을 모두 얻을 수 있습니다.

Vim에는 `tjump`를 위한 일반 모드 키가 있습니다: `g Ctrl-]`. 개인적으로 `g Ctrl-]`가 `Ctrl-]`보다 더 좋습니다.

## 태그로 자동 완성하기

태그는 자동 완성을 도와줄 수 있습니다. 6장, 삽입 모드에서 `Ctrl-X` 하위 모드를 사용하여 다양한 자동 완성을 수행할 수 있음을 기억하세요. 제가 언급하지 않은 자동 완성 하위 모드 중 하나는 `Ctrl-]`입니다. 삽입 모드에서 `Ctrl-X Ctrl-]`를 수행하면 Vim은 자동 완성을 위해 태그 파일을 사용합니다.

삽입 모드로 들어가서 `Ctrl-x Ctrl-]`를 입력하면 다음과 같은 결과를 볼 수 있습니다:

```shell
One
donut
initialize
pancake
```

## 태그 스택

Vim은 태그 스택에서 이동한 모든 태그의 목록을 유지합니다. `:tags`로 이 스택을 볼 수 있습니다. 처음에 `pancake`로 태그 점프한 다음 `donut`으로 점프하고 `:tags`를 실행하면 다음과 같은 결과를 볼 수 있습니다:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

위의 `>` 기호에 주목하세요. 현재 스택에서의 위치를 나타냅니다. 스택에서 하나의 이전 스택으로 "팝"하려면 `:pop`을 실행하면 됩니다. 시도해보고, 다시 `:tags`를 실행하세요:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

이제 `>` 기호가 `donut`이 있는 두 번째 줄에 있습니다. 한 번 더 `pop`한 다음 `:tags`를 다시 실행하세요:

```shell
  # TO tag         FROM line  in file/text
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

일반 모드에서 `Ctrl-t`를 실행하면 `:pop`과 동일한 효과를 얻을 수 있습니다.

## 자동 태그 생성

Vim 태그의 가장 큰 단점 중 하나는 중요한 변경을 할 때마다 태그 파일을 다시 생성해야 한다는 것입니다. 최근에 `pancake` 프로시저의 이름을 `waffle` 프로시저로 변경했다면, 태그 파일은 `pancake` 프로시저의 이름이 변경되었다는 것을 알지 못합니다. 여전히 태그 목록에 `pancake`를 저장하고 있습니다. `ctags -R .`를 실행하여 업데이트된 태그 파일을 생성해야 합니다. 이렇게 새로운 태그 파일을 다시 만드는 것은 번거로울 수 있습니다.

다행히도 태그를 자동으로 생성하는 여러 가지 방법이 있습니다.

## 저장 시 태그 생성

Vim에는 이벤트 트리거 시 모든 명령을 실행하는 자동 명령(`autocmd`) 방법이 있습니다. 이를 사용하여 각 저장 시 태그를 생성할 수 있습니다. 실행하세요:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

분해:
- `autocmd`는 명령줄 명령입니다. 이벤트, 파일 패턴 및 명령을 수락합니다.
- `BufWritePost`는 버퍼를 저장하는 이벤트입니다. 파일을 저장할 때마다 `BufWritePost` 이벤트를 트리거합니다.
- `.rb`는 루비 파일의 파일 패턴입니다.
- `silent`는 실제로 전달하는 명령의 일부입니다. 이를 생략하면 Vim은 자동 명령을 트리거할 때마다 `press ENTER or type command to continue`를 표시합니다.
- `!ctags -R .`는 실행할 명령입니다. Vim 내부에서 `!cmd`는 터미널 명령을 실행합니다.

이제 루비 파일 내부에서 저장할 때마다 Vim은 `ctags -R .`를 실행합니다.

## 플러그인 사용하기

자동으로 ctags를 생성하는 여러 플러그인이 있습니다:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

저는 vim-gutentags를 사용합니다. 사용하기 간단하고 바로 사용할 수 있습니다.

## Ctags 및 Git Hooks

많은 훌륭한 Vim 플러그인의 저자 Tim Pope는 git hooks를 사용하는 것을 제안하는 블로그를 작성했습니다. [확인해보세요](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## 스마트한 방법으로 태그 배우기

태그는 적절히 구성되면 유용합니다. 새로운 코드베이스에 직면하고 `functionFood`가 무엇을 하는지 이해하고 싶다면, 정의로 점프하여 쉽게 읽을 수 있습니다. 그 안에서 `functionBreakfast`를 호출한다는 것을 알게 됩니다. 이를 따라가면 `functionPancake`를 호출한다는 것을 알게 됩니다. 함수 호출 그래프는 다음과 같습니다:

```shell
functionFood -> functionBreakfast -> functionPancake
```

이것은 이 코드 흐름이 아침에 팬케이크를 먹는 것과 관련이 있음을 보여줍니다.

태그에 대해 더 배우려면 `:h tags`를 확인하세요. 이제 태그를 사용하는 방법을 알았으니, 다른 기능인 폴딩을 탐색해 보겠습니다.