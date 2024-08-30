---
description: 이 문서는 Vim에서 컴파일하는 방법과 `:make` 명령어를 활용하는 방법에 대해 설명합니다. 효율적인 빌드를 위한 기초를
  제공합니다.
title: Ch19. Compile
---

컴파일은 많은 언어중에서 중요한 주제입니다. 이 장에서는 Vim에서 컴파일하는 방법을 배우게 됩니다. 또한 Vim의 `:make` 명령을 활용하는 방법도 살펴보겠습니다.

## 커맨드 라인에서 컴파일하기

bang 연산자(`!`)를 사용하여 컴파일할 수 있습니다. `.cpp` 파일을 `g++`로 컴파일해야 하는 경우, 다음을 실행하세요:

```shell
:!g++ hello.cpp -o hello
```

하지만 매번 파일 이름과 출력 파일 이름을 수동으로 입력해야 하는 것은 오류가 발생하기 쉽고 지루합니다. makefile을 사용하는 것이 좋습니다.

## Make 명령

Vim에는 makefile을 실행하기 위한 `:make` 명령이 있습니다. 이를 실행하면 Vim은 현재 디렉토리에서 makefile을 찾아 실행합니다.

현재 디렉토리에 `makefile`이라는 파일을 만들고 다음 내용을 넣으세요:

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Vim에서 다음을 실행하세요:

```shell
:make
```

Vim은 터미널에서 실행할 때와 동일한 방식으로 이를 실행합니다. `:make` 명령은 터미널 make 명령과 마찬가지로 매개변수를 받습니다. 다음을 실행하세요:

```shell
:make foo
" 출력 "Hello foo"

:make list_pls
" ls 명령 결과 출력
```

`:make` 명령은 잘못된 명령을 실행하면 Vim의 quickfix를 사용하여 오류를 저장합니다. 존재하지 않는 대상을 실행해 보겠습니다:

```shell
:make dontexist
```

해당 명령을 실행할 때 오류가 발생하는 것을 볼 수 있어야 합니다. 그 오류를 보려면 quickfix 명령 `:copen`을 실행하여 quickfix 창을 열어보세요:

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Make로 컴파일하기

makefile을 사용하여 기본 `.cpp` 프로그램을 컴파일해 보겠습니다. 먼저 `hello.cpp` 파일을 생성합시다:

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

makefile을 업데이트하여 `.cpp` 파일을 빌드하고 실행하도록 하세요:

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

이제 다음을 실행하세요:

```shell
:make build
```

`g++`가 `./hello.cpp`를 컴파일하고 `./hello`를 생성합니다. 그런 다음 실행하세요:

```shell
:make run
```

터미널에 `"Hello!"`가 출력되는 것을 볼 수 있어야 합니다.

## 다른 Make 프로그램

`:make`를 실행하면 Vim은 실제로 `makeprg` 옵션 아래 설정된 모든 명령을 실행합니다. `:set makeprg?`를 실행하면 다음과 같은 결과를 볼 수 있습니다:

```shell
makeprg=make
```

기본 `:make` 명령은 `make` 외부 명령입니다. `:make` 명령을 실행할 때마다 `g++ {your-file-name}`을 실행하도록 변경하려면 다음을 실행하세요:

```shell
:set makeprg=g++\ %
```

`\`는 `g++` 뒤의 공백을 이스케이프하기 위한 것입니다. Vim의 `%` 기호는 현재 파일을 나타냅니다. `g++\\ %` 명령은 `g++ hello.cpp`를 실행하는 것과 동일합니다.

`./hello.cpp`로 이동한 다음 `:make`를 실행하세요. Vim은 `hello.cpp`를 컴파일하고 출력 파일을 지정하지 않았기 때문에 `a.out`을 생성합니다. 이를 리팩토링하여 컴파일된 출력의 이름을 원본 파일의 확장자를 제외한 이름으로 지정하도록 합시다. 다음을 vimrc에 추가하거나 실행하세요:

```shell
set makeprg=g++\ %\ -o\ %<
```

세부 사항:
- `g++\ %`는 위와 동일합니다. `<your-file>`를 실행하는 것과 같습니다.
- `-o`는 출력 옵션입니다.
- `%<`는 Vim에서 확장자를 제외한 현재 파일 이름을 나타냅니다(`hello.cpp`는 `hello`가 됩니다).

`./hello.cpp`에서 `:make`를 실행하면 `./hello`로 컴파일됩니다. `./hello.cpp`에서 `./hello`를 빠르게 실행하려면 `:!./%<`를 실행하세요. 다시 말해, 이는 `:!./{current-file-name-minus-the-extension}`을 실행하는 것과 동일합니다.

자세한 내용은 `:h :compiler` 및 `:h write-compiler-plugin`을 확인하세요.

## 저장 시 자동 컴파일

컴파일을 자동화하여 삶을 더욱 편리하게 만들 수 있습니다. Vim의 `autocmd`를 사용하여 특정 이벤트에 따라 자동 작업을 트리거할 수 있습니다. 각 저장 시 `.cpp` 파일을 자동으로 컴파일하려면 vimrc에 다음을 추가하세요:

```shell
autocmd BufWritePost *.cpp make
```

`.cpp` 파일 내에서 저장할 때마다 Vim은 `make` 명령을 실행합니다.

## 컴파일러 전환

Vim에는 컴파일러를 빠르게 전환할 수 있는 `:compiler` 명령이 있습니다. 귀하의 Vim 빌드는 아마도 여러 개의 미리 빌드된 컴파일러 구성을 포함하고 있을 것입니다. 어떤 컴파일러가 있는지 확인하려면 다음을 실행하세요:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

다양한 프로그래밍 언어에 대한 컴파일러 목록이 표시되어야 합니다.

`:compiler` 명령을 사용하려면, `hello.rb`라는 루비 파일이 있고 그 안에 다음이 있다고 가정합니다:

```shell
puts "Hello ruby"
```

`:make`를 실행하면 Vim은 `makeprg`에 할당된 모든 명령을 실행합니다(기본값은 `make`입니다). 다음을 실행하세요:

```shell
:compiler ruby
```

Vim은 `$VIMRUNTIME/compiler/ruby.vim` 스크립트를 실행하고 `makeprg`를 `ruby` 명령을 사용하도록 변경합니다. 이제 `:set makeprg?`를 실행하면 `makeprg=ruby`라고 표시되어야 합니다(이는 `$VIMRUNTIME/compiler/ruby.vim` 파일의 내용이나 다른 사용자 정의 루비 컴파일러에 따라 다를 수 있습니다). `:compiler {your-lang}` 명령은 다른 컴파일러로 빠르게 전환할 수 있게 해줍니다. 이는 프로젝트가 여러 언어를 사용하는 경우 유용합니다.

프로그램을 컴파일하기 위해 반드시 `:compiler`와 `makeprg`를 사용할 필요는 없습니다. 테스트 스크립트를 실행하거나 파일을 린트하거나 신호를 보내거나 원하는 모든 작업을 수행할 수 있습니다.

## 사용자 정의 컴파일러 만들기

간단한 Typescript 컴파일러를 만들어 보겠습니다. Typescript를 설치하세요(`npm install -g typescript`). 이제 `tsc` 명령을 사용할 수 있어야 합니다. Typescript를 사용해본 적이 없다면, `tsc`는 Typescript 파일을 Javascript 파일로 컴파일합니다. `hello.ts`라는 파일이 있다고 가정해 보겠습니다:

```shell
const hello = "hello";
console.log(hello);
```

`tsc hello.ts`를 실행하면 `hello.js`로 컴파일됩니다. 그러나 `hello.ts` 안에 다음과 같은 표현이 있다면:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

이는 `const` 변수를 변경할 수 없기 때문에 오류가 발생합니다. `tsc hello.ts`를 실행하면 오류가 발생합니다:

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

간단한 Typescript 컴파일러를 만들기 위해 `~/.vim/` 디렉토리에 `compiler` 디렉토리(`~/.vim/compiler/`)를 추가한 다음 `typescript.vim` 파일(`~/.vim/compiler/typescript.vim`)을 생성합니다. 다음 내용을 넣으세요:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

첫 번째 줄은 `makeprg`를 `tsc` 명령을 실행하도록 설정합니다. 두 번째 줄은 오류 형식을 파일(`%f`), 그 뒤에 리터럴 콜론(`:`)과 이스케이프된 공백(`\ `), 그리고 오류 메시지(`%m`)로 표시하도록 설정합니다. 오류 형식에 대해 더 알아보려면 `:h errorformat`을 확인하세요.

다른 사람들이 어떻게 하는지 보려면 미리 만들어진 컴파일러를 읽어보는 것도 좋습니다. `:e $VIMRUNTIME/compiler/<some-language>.vim`을 확인하세요.

일부 플러그인이 Typescript 파일에 간섭할 수 있으므로, `--noplugin` 플래그를 사용하여 플러그인 없이 `hello.ts`를 열어보겠습니다:

```shell
vim --noplugin hello.ts
```

`makeprg`를 확인하세요:

```shell
:set makeprg?
```

기본 `make` 프로그램이라고 표시되어야 합니다. 새 Typescript 컴파일러를 사용하려면 다음을 실행하세요:

```shell
:compiler typescript
```

`:set makeprg?`를 실행하면 이제 `tsc`라고 표시되어야 합니다. 테스트해 보겠습니다. 다음을 실행하세요:

```shell
:make %
```

`%`는 현재 파일을 의미합니다. Typescript 컴파일러가 예상대로 작동하는 것을 지켜보세요! 오류 목록을 보려면 `:copen`을 실행하세요.

## 비동기 컴파일러

가끔 컴파일하는 데 오랜 시간이 걸릴 수 있습니다. 컴파일 프로세스가 완료될 때까지 멈춘 Vim을 바라보고 싶지 않을 것입니다. 비동기적으로 컴파일할 수 있다면 컴파일 중에도 Vim을 계속 사용할 수 있을 것입니다.

다행히도 비동기 프로세스를 실행할 수 있는 플러그인이 있습니다. 두 가지 주요 플러그인은 다음과 같습니다:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

이 장의 나머지 부분에서는 vim-dispatch에 대해 다룰 것이지만, 모든 플러그인을 시도해 보시기를 강력히 권장합니다.

*Vim과 NeoVim은 실제로 비동기 작업을 지원하지만, 이는 이 장의 범위를 벗어납니다. 궁금하다면 `:h job-channel-overview.txt`를 확인하세요.*

## 플러그인: Vim-dispatch

Vim-dispatch에는 여러 명령이 있지만, 두 가지 주요 명령은 `:Make`와 `:Dispatch`입니다.

### 비동기 Make

Vim-dispatch의 `:Make` 명령은 Vim의 `:make`와 유사하지만 비동기적으로 실행됩니다. Javascript 프로젝트에 있고 `npm t`를 실행해야 하는 경우, makeprg를 다음과 같이 설정할 수 있습니다:

```shell
:set makeprg=npm\\ t
```

다음과 같이 실행하면:

```shell
:make
```

Vim은 `npm t`를 실행하지만, JavaScript 테스트가 실행되는 동안 멈춘 화면을 바라보게 됩니다. vim-dispatch를 사용하면 다음과 같이 실행할 수 있습니다:

```shell
:Make
```

Vim은 `npm t`를 비동기적으로 실행합니다. 이렇게 하면 `npm t`가 백그라운드 프로세스에서 실행되는 동안 계속해서 다른 작업을 수행할 수 있습니다. 멋지죠!

### 비동기 Dispatch

`:Dispatch` 명령은 `:compiler` 및 `:!` 명령과 유사합니다. Vim에서 외부 명령을 비동기적으로 실행할 수 있습니다.

루비 스펙 파일 안에 있고 테스트를 실행해야 하는 경우, 다음을 실행하세요:

```shell
:Dispatch bundle exec rspec %
```

Vim은 현재 파일(`%`)에 대해 `rspec` 명령을 비동기적으로 실행합니다.

### Dispatch 자동화

Vim-dispatch에는 특정 명령을 자동으로 평가하도록 구성할 수 있는 `b:dispatch` 버퍼 변수가 있습니다. 이를 `autocmd`와 함께 활용할 수 있습니다. vimrc에 다음을 추가하세요:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

이제 `_spec.rb`로 끝나는 파일에 들어갈 때마다(`BufEnter`) `:Dispatch`를 실행하면 자동으로 `bundle exec rspec {your-current-ruby-spec-file}`가 실행됩니다.

## 스마트하게 컴파일 배우기

이 장에서는 `make` 및 `compiler` 명령을 사용하여 Vim 내부에서 *모든* 프로세스를 비동기적으로 실행하여 프로그래밍 워크플로를 보완할 수 있다는 것을 배웠습니다. Vim이 다른 프로그램과 함께 확장할 수 있는 능력은 매우 강력합니다.