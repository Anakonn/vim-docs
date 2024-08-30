---
description: 이 문서는 Vim의 내장 플러그인 관리자인 패키지를 사용하여 플러그인을 설치하는 방법에 대해 설명합니다.
title: Ch23. Vim Packages
---

이전 장에서 외부 플러그인 관리자를 사용하여 플러그인을 설치하는 방법에 대해 언급했습니다. 8버전부터 Vim은 *packages*라는 자체 내장 플러그인 관리자를 제공합니다. 이 장에서는 Vim 패키지를 사용하여 플러그인을 설치하는 방법을 배울 것입니다.

Vim 빌드가 패키지를 사용할 수 있는지 확인하려면 `:version`을 실행하고 `+packages` 속성을 찾아보세요. 또는 `:echo has('packages')`를 실행할 수도 있습니다(1이 반환되면 패키지 기능이 있는 것입니다).

## 패크 디렉토리

루트 경로에 `~/.vim/` 디렉토리가 있는지 확인하세요. 없다면 하나 생성하세요. 그 안에 `pack`이라는 디렉토리(`~/.vim/pack/`)를 만드세요. Vim은 자동으로 이 디렉토리에서 패키지를 검색합니다.

## 두 가지 로딩 방식

Vim 패키지는 자동 로딩과 수동 로딩 두 가지 로딩 메커니즘을 가지고 있습니다.

### 자동 로딩

Vim이 시작할 때 플러그인을 자동으로 로드하려면 `start/` 디렉토리에 넣어야 합니다. 경로는 다음과 같습니다:

```shell
~/.vim/pack/*/start/
```

이제 "pack/와 start/ 사이의 `*`는 무엇인가요?"라고 물어볼 수 있습니다. `*`는 임의의 이름이며 원하는 어떤 것이든 될 수 있습니다. 이를 `packdemo/`라고 이름 지어 보겠습니다:

```shell
~/.vim/pack/packdemo/start/
```

`pack/`와 `start/` 사이에 이름을 넣지 않고 다음과 같이 하면:

```shell
~/.vim/pack/start/
```

패키지 시스템이 작동하지 않습니다. `pack/`와 `start/` 사이에 이름을 넣는 것이 중요합니다.

이 데모에서는 [NERDTree](https://github.com/preservim/nerdtree) 플러그인을 설치해 보겠습니다. `start/` 디렉토리로 이동(`cd ~/.vim/pack/packdemo/start/`)하여 NERDTree 리포지토리를 클론합니다:

```shell
git clone https://github.com/preservim/nerdtree.git
```

그게 전부입니다! 이제 다음 번에 Vim을 시작할 때 `:NERDTreeToggle`과 같은 NERDTree 명령을 즉시 실행할 수 있습니다.

`~/.vim/pack/*/start/` 경로 안에 원하는 만큼 플러그인 리포지토리를 클론할 수 있습니다. Vim은 각 플러그인을 자동으로 로드합니다. 클론한 리포지토리를 제거하면(`rm -rf nerdtree/`) 해당 플러그인은 더 이상 사용할 수 없습니다.

### 수동 로딩

Vim이 시작할 때 플러그인을 수동으로 로드하려면 `opt/` 디렉토리에 넣어야 합니다. 자동 로딩과 유사하게, 경로는 다음과 같습니다:

```shell
~/.vim/pack/*/opt/
```

이전에 사용한 `packdemo/` 디렉토리를 사용해 보겠습니다:

```shell
~/.vim/pack/packdemo/opt/
```

이번에는 [killersheep](https://github.com/vim/killersheep) 게임을 설치해 보겠습니다(이것은 Vim 8.2가 필요합니다). `opt/` 디렉토리로 이동(`cd ~/.vim/pack/packdemo/opt/`)하여 리포지토리를 클론합니다:

```shell
git clone https://github.com/vim/killersheep.git
```

Vim을 시작하세요. 게임을 실행하는 명령은 `:KillKillKill`입니다. 실행해 보세요. Vim은 유효한 편집기 명령이 아니라고 불평할 것입니다. 먼저 플러그인을 *수동으로* 로드해야 합니다. 그렇게 해보겠습니다:

```shell
:packadd killersheep
```

이제 다시 명령을 실행해 보세요 `:KillKillKill`. 이제 명령이 작동해야 합니다.

"왜 패키지를 수동으로 로드해야 할까요? 모든 것을 시작할 때 자동으로 로드하는 것이 더 낫지 않나요?"라고 궁금할 수 있습니다.

좋은 질문입니다. 때때로 KillerSheep 게임과 같이 항상 사용하지 않을 플러그인이 있습니다. 아마도 10개의 다른 게임을 로드할 필요는 없고 Vim 시작 시간을 느리게 할 필요는 없습니다. 그러나 가끔 지루할 때 몇 게임을 하고 싶을 수 있습니다. 비필수 플러그인에 대해서는 수동 로딩을 사용하세요.

이것을 사용하여 조건부로 플러그인을 추가할 수도 있습니다. 아마도 Neovim과 Vim을 모두 사용하고 Neovim에 최적화된 플러그인이 있을 것입니다. vimrc에 다음과 같이 추가할 수 있습니다:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## 패키지 정리

Vim의 패키지 시스템을 사용하기 위한 요구 사항은 다음 중 하나입니다:

```shell
~/.vim/pack/*/start/
```

또는:

```shell
~/.vim/pack/*/opt/
```

`*`가 *어떤* 이름이든 될 수 있다는 사실은 패키지를 정리하는 데 사용될 수 있습니다. 플러그인을 카테고리(색상, 구문, 게임)별로 그룹화하고 싶다고 가정해 보겠습니다:

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

각 디렉토리 안에서도 여전히 `start/`와 `opt/`를 사용할 수 있습니다.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## 스마트한 방식으로 패키지 추가하기

Vim 패키지가 vim-pathogen, vundle.vim, dein.vim, vim-plug와 같은 인기 있는 플러그인 관리자를 구식으로 만들 것인지 궁금할 수 있습니다.

답은 항상 "상황에 따라 다르다"입니다.

저는 여전히 vim-plug를 사용합니다. 플러그인을 추가, 제거 또는 업데이트하는 것이 쉽기 때문입니다. 많은 플러그인을 사용하는 경우 동시에 여러 개를 업데이트하기가 더 편리할 수 있습니다. 일부 플러그인 관리자는 비동기 기능도 제공합니다.

미니멀리스트라면 Vim 패키지를 시도해 보세요. 플러그인을 많이 사용하는 경우 플러그인 관리자를 사용하는 것을 고려할 수 있습니다.