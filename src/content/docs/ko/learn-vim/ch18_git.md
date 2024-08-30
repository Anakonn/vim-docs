---
description: 이 문서는 Vim과 Git의 통합 방법을 다루며, 특히 파일 간의 차이를 비교하는 방법인 `vimdiff` 사용법을 설명합니다.
title: Ch18. Git
---

Vim과 git은 서로 다른 두 가지 훌륭한 도구입니다. Git은 버전 관리 도구입니다. Vim은 텍스트 편집기입니다.

이 장에서는 Vim과 git을 통합하는 다양한 방법을 배웁니다.

## Diffing

이전 장에서 여러 파일 간의 차이를 보여주기 위해 `vimdiff` 명령을 실행할 수 있음을 기억하세요.

`file1.txt`와 `file2.txt`라는 두 개의 파일이 있다고 가정해 보겠습니다.

`file1.txt` 내부:

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

`file2.txt` 내부:

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

두 파일 간의 차이를 보려면 다음을 실행하세요:

```shell
vimdiff file1.txt file2.txt
```

또는 다음을 실행할 수도 있습니다:

```shell
vim -d file1.txt file2.txt
```

`vimdiff`는 두 개의 버퍼를 나란히 표시합니다. 왼쪽은 `file1.txt`이고 오른쪽은 `file2.txt`입니다. 첫 번째 차이(사과와 오렌지)는 두 줄 모두 강조 표시됩니다.

두 번째 버퍼에 오렌지가 아닌 사과를 넣고 싶다고 가정해 보겠습니다. 현재 위치(현재 `file1.txt`에 있음)에서 `file2.txt`로 내용을 전송하려면 먼저 `]c`로 다음 차이로 이동합니다(이전 차이 창으로 이동하려면 `[c`를 사용). 이제 커서는 사과에 있어야 합니다. `:diffput`을 실행하세요. 이제 두 파일 모두 사과를 가져야 합니다.

다른 버퍼(오렌지 주스, `file2.txt`)에서 현재 버퍼(사과 주스, `file1.txt`)의 텍스트를 교체하려면, 커서를 여전히 `file1.txt` 창에 두고 `]c`로 다음 차이로 이동합니다. 이제 커서는 사과 주스에 있어야 합니다. `:diffget`을 실행하여 다른 버퍼에서 오렌지 주스를 가져와 사과 주스를 교체합니다.

`:diffput`은 현재 버퍼의 텍스트를 다른 버퍼로 *내보냅니다*. `:diffget`은 다른 버퍼의 텍스트를 현재 버퍼로 *가져옵니다*.

여러 개의 버퍼가 있는 경우 `:diffput fileN.txt` 및 `:diffget fileN.txt`를 실행하여 fileN 버퍼를 대상으로 지정할 수 있습니다.

## Vim을 병합 도구로 사용하기

> "나는 병합 충돌을 해결하는 것을 좋아해!" - 아무도

병합 충돌을 해결하는 것을 좋아하는 사람은 모릅니다. 그러나 그것은 불가피합니다. 이 섹션에서는 Vim을 병합 충돌 해결 도구로 활용하는 방법을 배웁니다.

먼저 기본 병합 도구를 `vimdiff`로 변경하려면 다음을 실행하세요:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

또는 `~/.gitconfig`를 직접 수정할 수 있습니다(기본적으로 루트에 있어야 하지만 다른 위치에 있을 수 있습니다). 위의 명령은 gitconfig를 아래 설정처럼 수정해야 하며, 이미 실행하지 않았다면 수동으로 gitconfig를 편집할 수도 있습니다.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

이것을 테스트하기 위해 가짜 병합 충돌을 만들어 보겠습니다. `/food`라는 디렉토리를 만들고 git 저장소로 만드세요:

```shell
git init
```

`breakfast.txt`라는 파일을 추가합니다. 내부:

```shell
pancakes
waffles
oranges
```

파일을 추가하고 커밋합니다:

```shell
git add .
git commit -m "Initial breakfast commit"
```

다음으로 새로운 브랜치를 만들고 이를 사과 브랜치라고 부릅니다:

```shell
git checkout -b apples
```

`breakfast.txt`를 변경합니다:

```shell
pancakes
waffles
apples
```

파일을 저장한 후 변경 사항을 추가하고 커밋합니다:

```shell
git add .
git commit -m "Apples not oranges"
```

좋습니다. 이제 마스터 브랜치에는 오렌지가 있고 사과 브랜치에는 사과가 있습니다. 마스터 브랜치로 돌아가겠습니다:

```shell
git checkout master
```

`breakfast.txt` 내부에는 기본 텍스트인 오렌지가 있어야 합니다. 지금 제철인 포도로 변경해 보겠습니다:

```shell
pancakes
waffles
grapes
```

저장하고 추가한 후 커밋합니다:

```shell
git add .
git commit -m "Grapes not oranges"
```

이제 사과 브랜치를 마스터 브랜치에 병합할 준비가 되었습니다:

```shell
git merge apples
```

다음과 같은 오류가 표시됩니다:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

충돌이 발생했습니다! 이제 새로 구성한 `mergetool`을 사용하여 충돌을 해결해 보겠습니다. 다음을 실행하세요:

```shell
git mergetool
```

Vim은 네 개의 창을 표시합니다. 상단 세 개에 주목하세요:

- `LOCAL`에는 `grapes`가 포함되어 있습니다. 이는 "로컬"에서의 변경 사항으로, 병합하려는 내용입니다.
- `BASE`에는 `oranges`가 포함되어 있습니다. 이는 `LOCAL`과 `REMOTE` 간의 공통 조상으로, 어떻게 분기되었는지 비교합니다.
- `REMOTE`에는 `apples`가 포함되어 있습니다. 이는 병합되는 내용입니다.

하단(네 번째 창)에는 다음과 같은 내용이 표시됩니다:

```shell
pancakes
waffles
<<<<<<< HEAD
grapes
||||||| db63958
oranges
=======
apples
>>>>>>> apples
```

네 번째 창에는 병합 충돌 텍스트가 포함되어 있습니다. 이 설정으로 각 환경의 변경 사항을 쉽게 확인할 수 있습니다. `LOCAL`, `BASE`, `REMOTE`의 내용을 동시에 볼 수 있습니다.

커서는 네 번째 창의 강조된 영역에 있어야 합니다. `LOCAL`에서 변경 사항(포도)을 가져오려면 `:diffget LOCAL`을 실행합니다. `BASE`에서 변경 사항(오렌지)을 가져오려면 `:diffget BASE`를 실행하고, `REMOTE`에서 변경 사항(사과)을 가져오려면 `:diffget REMOTE`를 실행합니다.

이 경우 `LOCAL`에서 변경 사항을 가져오겠습니다. `:diffget LOCAL`을 실행하세요. 이제 네 번째 창에는 포도가 표시됩니다. 완료되면 모든 파일을 저장하고 종료하세요(`:wqall`). 나쁘지 않았죠?

또한 이제 `breakfast.txt.orig`라는 파일이 생성된 것을 알 수 있습니다. Git은 문제가 발생할 경우를 대비하여 백업 파일을 생성합니다. 병합 중에 git이 백업을 생성하지 않도록 하려면 다음을 실행하세요:

```shell
git config --global mergetool.keepBackup false
```

## Vim 내에서 Git 사용하기

Vim에는 기본적으로 내장된 git 기능이 없습니다. Vim에서 git 명령을 실행하는 한 가지 방법은 명령 모드에서 bang 연산자 `!`를 사용하는 것입니다.

모든 git 명령은 `!`와 함께 실행할 수 있습니다:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Vim의 `%`(현재 버퍼) 또는 `#`(다른 버퍼) 관례를 사용할 수도 있습니다:

```shell
:!git add %         " 현재 파일을 git에 추가
:!git checkout #    " 다른 파일을 git 체크아웃
```

여러 개의 Vim 창에서 여러 파일을 추가하는 데 사용할 수 있는 Vim 트릭은 다음과 같습니다:

```shell
:windo !git add %
```

그런 다음 커밋합니다:

```shell
:!git commit "Just git-added everything in my Vim window, cool"
```

`windo` 명령은 Vim의 "do" 명령 중 하나로, 이전에 본 `argdo`와 유사합니다. `windo`는 각 창에서 명령을 실행합니다.

또는 `bufdo !git add %`를 사용하여 모든 버퍼를 git에 추가하거나, `argdo !git add %`를 사용하여 모든 파일 인수를 git에 추가할 수 있습니다. 이는 작업 흐름에 따라 다릅니다.

## 플러그인

git 지원을 위한 많은 Vim 플러그인이 있습니다. 아래는 Vim의 인기 있는 git 관련 플러그인 목록입니다(읽을 때 더 있을 수 있습니다):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

가장 인기 있는 것 중 하나는 vim-fugitive입니다. 이 장의 나머지 부분에서는 이 플러그인을 사용한 여러 git 작업 흐름을 살펴보겠습니다.

## Vim-fugitive

vim-fugitive 플러그인을 사용하면 Vim 편집기를 떠나지 않고도 git CLI를 실행할 수 있습니다. 일부 명령은 Vim 내부에서 실행할 때 더 좋습니다.

시작하려면 Vim 플러그인 관리자를 사용하여 vim-fugitive를 설치하세요([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim) 등).

## Git 상태

`:Git` 명령을 매개변수 없이 실행하면 vim-fugitive는 git 요약 창을 표시합니다. 추적되지 않은 파일, 스테이지되지 않은 파일 및 스테이지된 파일을 보여줍니다. 이 "`git status`" 모드에서는 여러 가지 작업을 수행할 수 있습니다:
- `Ctrl-N` / `Ctrl-P`로 파일 목록을 위아래로 이동합니다.
- `-`로 커서 아래의 파일 이름을 스테이지하거나 언스테이지합니다.
- `s`로 커서 아래의 파일 이름을 스테이지합니다.
- `u`로 커서 아래의 파일 이름을 언스테이지합니다.
- `>` / `<`로 커서 아래의 파일 이름의 인라인 diff를 표시하거나 숨깁니다.

자세한 내용은 `:h fugitive-staging-maps`를 확인하세요.

## Git Blame

현재 파일에서 `:Git blame` 명령을 실행하면 vim-fugitive는 분할된 blame 창을 표시합니다. 이는 버그가 있는 코드 줄을 작성한 사람을 찾는 데 유용할 수 있습니다.

이 `"git blame"` 모드에서 수행할 수 있는 작업은 다음과 같습니다:
- `q`로 blame 창을 닫습니다.
- `A`로 작성자 열의 크기를 조정합니다.
- `C`로 커밋 열의 크기를 조정합니다.
- `D`로 날짜/시간 열의 크기를 조정합니다.

자세한 내용은 `:h :Git_blame`을 확인하세요.

## Gdiffsplit

`:Gdiffsplit` 명령을 실행하면 vim-fugitive는 현재 파일의 최신 변경 사항을 인덱스 또는 작업 트리와 비교하여 `vimdiff`를 실행합니다. `:Gdiffsplit <commit>`을 실행하면 vim-fugitive는 `<commit>` 내부의 해당 파일에 대해 `vimdiff`를 실행합니다.

`vimdiff` 모드에 있으므로 `:diffput` 및 `:diffget`으로 diff를 *가져오거나* *내보낼* 수 있습니다.

## Gwrite 및 Gread

파일에서 변경한 후 `:Gwrite` 명령을 실행하면 vim-fugitive는 변경 사항을 스테이지합니다. 이는 `git add <current-file>`를 실행하는 것과 같습니다.

파일에서 변경한 후 `:Gread` 명령을 실행하면 vim-fugitive는 파일을 변경 전 상태로 복원합니다. 이는 `git checkout <current-file>`을 실행하는 것과 같습니다. `:Gread`를 실행하는 장점 중 하나는 이 작업이 실행 취소 가능하다는 것입니다. `:Gread`를 실행한 후 마음이 바뀌어 이전 변경 사항을 유지하고 싶다면 단순히 실행 취소(`u`)를 실행하면 Vim이 `:Gread` 작업을 실행 취소합니다. 이는 CLI에서 `git checkout <current-file>`을 실행했다면 불가능했을 것입니다.

## Gclog

`:Gclog` 명령을 실행하면 vim-fugitive는 커밋 기록을 표시합니다. 이는 `git log` 명령을 실행하는 것과 같습니다. vim-fugitive는 Vim의 quickfix를 사용하여 이를 수행하므로 `:cnext` 및 `:cprevious`를 사용하여 다음 또는 이전 로그 정보를 탐색할 수 있습니다. 로그 목록은 `:copen` 및 `:cclose`로 열고 닫을 수 있습니다.

이 `"git log"` 모드에서는 두 가지 작업을 수행할 수 있습니다:
- 트리를 보기.
- 부모(이전 커밋)를 방문하기.

`:Gclog`에 인수를 전달할 수 있습니다. 프로젝트에 긴 커밋 기록이 있고 마지막 세 개의 커밋만 보려면 `:Gclog -3`을 실행할 수 있습니다. 커밋 날짜를 기준으로 필터링해야 하는 경우 `:Gclog --after="January 1" --before="March 14"`와 같은 명령을 실행할 수 있습니다.

## 더 많은 Vim-fugitive

이것들은 vim-fugitive가 할 수 있는 몇 가지 예일 뿐입니다. vim-fugitive에 대해 더 배우려면 `:h fugitive.txt`를 확인하세요. 대부분의 인기 있는 git 명령은 아마도 vim-fugitive로 최적화되어 있을 것입니다. 문서에서 찾아보면 됩니다.

vim-fugitive의 "특수 모드"(예: `:Git` 또는 `:Git blame` 모드) 내부에 있을 때 사용 가능한 단축키를 알고 싶다면 `g?`를 누르세요. vim-fugitive는 현재 모드에 적합한 `:help` 창을 표시합니다. 멋지죠!
## 똑똑하게 Vim과 Git 배우기

vim-fugitive가 당신의 워크플로우에 좋은 보완이 될 수 있습니다 (아니면 아닐 수도 있습니다). 그럼에도 불구하고, 위에 나열된 모든 플러그인을 확인해 보시기를 강력히 권장합니다. 제가 나열하지 않은 다른 플러그인도 있을 것입니다. 가서 사용해 보세요.

Vim-git 통합을 개선하는 한 가지 분명한 방법은 git에 대해 더 많이 읽는 것입니다. Git 자체는 방대한 주제이며, 저는 그 중 일부만 보여주고 있습니다. 그럼 이제 *git going* (말장난을 용서해 주세요) 하면서 Vim을 사용하여 코드를 컴파일하는 방법에 대해 이야기해 봅시다!