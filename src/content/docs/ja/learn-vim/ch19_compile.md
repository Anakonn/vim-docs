---
description: この章では、Vimを使用してコンパイルする方法と、Vimの`:make`コマンドを活用する方法について学びます。
title: Ch19. Compile
---

コンパイルは多くの言語にとって重要なテーマです。この章では、Vimからコンパイルする方法を学びます。また、Vimの`:make`コマンドを活用する方法も見ていきます。

## コマンドラインからのコンパイル

バン操作子（`!`）を使用してコンパイルできます。`.cpp`ファイルを`g++`でコンパイルする必要がある場合は、次のように実行します：

```shell
:!g++ hello.cpp -o hello
```

ただし、毎回手動でファイル名と出力ファイル名を入力するのはエラーが発生しやすく、面倒です。Makefileを使用するのが良いでしょう。

## Makeコマンド

VimにはMakefileを実行するための`:make`コマンドがあります。これを実行すると、Vimは現在のディレクトリにMakefileを探して実行します。

現在のディレクトリに`makefile`という名前のファイルを作成し、以下の内容を入れます：

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Vimからこれを実行します：

```shell
:make
```

Vimは、ターミナルから実行するのと同じ方法でこれを実行します。`:make`コマンドは、ターミナルのmakeコマンドと同様にパラメータを受け取ります。実行します：

```shell
:make foo
" 出力 "Hello foo"

:make list_pls
" lsコマンドの結果を出力
```

`:make`コマンドは、悪いコマンドを実行した場合にエラーを保存するためにVimのクイックフィックスを使用します。存在しないターゲットを実行してみましょう：

```shell
:make dontexist
```

そのコマンドを実行するとエラーが表示されるはずです。そのエラーを表示するには、クイックフィックスコマンド`:copen`を実行してクイックフィックスウィンドウを表示します：

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Makeを使用したコンパイル

Makefileを使用して基本的な`.cpp`プログラムをコンパイルしてみましょう。まず、`hello.cpp`というファイルを作成します：

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Makefileを更新して`.cpp`ファイルをビルドして実行します：

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

次に実行します：

```shell
:make build
```

`g++`は`./hello.cpp`をコンパイルして`./hello`を作成します。次に実行します：

```shell
:make run
```

ターミナルに`"Hello!"`と表示されるはずです。

## 異なるMakeプログラム

`:make`を実行すると、Vimは実際に`makeprg`オプションの下に設定されているコマンドを実行します。`:set makeprg?`を実行すると、次のように表示されます：

```shell
makeprg=make
```

デフォルトの`:make`コマンドは`make`外部コマンドです。`:make`コマンドを実行するたびに`g++ {your-file-name}`を実行するように変更するには、次のように実行します：

```shell
:set makeprg=g++\ %
```

`\`は`g++`の後のスペースをエスケープするためのものです。`%`記号はVimで現在のファイルを表します。コマンド`g++\\ %`は`g++ hello.cpp`を実行するのと同じです。

`./hello.cpp`に移動してから`:make`を実行します。Vimは`hello.cpp`をコンパイルし、出力を指定しなかったため`a.out`を作成します。これをリファクタリングして、コンパイルされた出力の名前を元のファイル名から拡張子を除いたものにするようにします。次のようにvimrcに追加または実行します：

```shell
set makeprg=g++\ %\ -o\ %<
```

内訳：
- `g++\ %`は上記と同じです。`g++ <your-file>`を実行するのと同じです。
- `-o`は出力オプションです。
- `%<`はVimで拡張子なしの現在のファイル名を表します（`hello.cpp`は`hello`になります）。

`./hello.cpp`の中から`:make`を実行すると、`./hello`にコンパイルされます。`./hello.cpp`の中から`./hello`をすぐに実行するには、`:!./%<`を実行します。これもまた、`:!./{current-file-name-minus-the-extension}`を実行するのと同じです。

詳細については、`:h :compiler`と`:h write-compiler-plugin`を確認してください。

## 保存時の自動コンパイル

コンパイルを自動化することで、さらに便利にできます。特定のイベントに基づいて自動的なアクションをトリガーするためにVimの`autocmd`を使用できることを思い出してください。`.cpp`ファイルを保存するたびに自動的にコンパイルするには、vimrcに次のように追加します：

```shell
autocmd BufWritePost *.cpp make
```

`.cpp`ファイル内で保存するたびに、Vimは`make`コマンドを実行します。

## コンパイラの切り替え

Vimにはコンパイラを迅速に切り替えるための`:compiler`コマンドがあります。おそらく、あなたのVimビルドにはいくつかの事前構築されたコンパイラ設定が含まれています。どのコンパイラがあるかを確認するには、次のように実行します：

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

さまざまなプログラミング言語のコンパイラのリストが表示されるはずです。

`:compiler`コマンドを使用するには、例えば、`hello.rb`というRubyファイルがあり、その中に次のような内容があるとします：

```shell
puts "Hello ruby"
```

`:make`を実行すると、Vimは`makeprg`に割り当てられたコマンドを実行します（デフォルトは`make`です）。次のように実行します：

```shell
:compiler ruby
```

Vimは`$VIMRUNTIME/compiler/ruby.vim`スクリプトを実行し、`makeprg`を`ruby`コマンドを使用するように変更します。今、`:set makeprg?`を実行すると、`makeprg=ruby`と表示されるはずです（これは`$VIMRUNTIME/compiler/ruby.vim`ファイルの内容や、他のカスタムRubyコンパイラによって異なる場合があります）。`:compiler {your-lang}`コマンドを使用すると、異なるコンパイラに迅速に切り替えることができます。これは、プロジェクトが複数の言語を使用している場合に便利です。

プログラムをコンパイルするために`:compiler`や`makeprg`を使用する必要はありません。テストスクリプトを実行したり、ファイルをリンティングしたり、シグナルを送信したり、何でもできます。

## カスタムコンパイラの作成

シンプルなTypescriptコンパイラを作成しましょう。Typescriptをマシンにインストールします（`npm install -g typescript`）。これで`tsc`コマンドが使えるようになります。Typescriptを使ったことがない場合、`tsc`はTypescriptファイルをJavascriptファイルにコンパイルします。例えば、`hello.ts`というファイルがあるとします：

```shell
const hello = "hello";
console.log(hello);
```

`tsc hello.ts`を実行すると、`hello.js`にコンパイルされます。ただし、`hello.ts`内に次のような式がある場合：

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

これはエラーを引き起こします。なぜなら、`const`変数を変更することはできないからです。`tsc hello.ts`を実行すると、次のようなエラーが表示されます：

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

シンプルなTypescriptコンパイラを作成するには、`~/.vim/`ディレクトリに`compiler`ディレクトリ（`~/.vim/compiler/`）を追加し、次に`typescript.vim`ファイル（`~/.vim/compiler/typescript.vim`）を作成します。以下の内容を入れます：

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

最初の行は`makeprg`を`tsc`コマンドを実行するように設定します。2行目は、エラーフォーマットをファイル（`%f`）、リテラルコロン（`:`）、エスケープされたスペース（`\ `）、エラーメッセージ（`%m`）を表示するように設定します。エラーフォーマットの詳細については、`:h errorformat`を確認してください。

他の人がどのようにやっているかを見るために、いくつかの事前に作成されたコンパイラを読むこともお勧めします。`:e $VIMRUNTIME/compiler/<some-language>.vim`を確認してください。

一部のプラグインがTypescriptファイルに干渉する可能性があるため、`--noplugin`フラグを使用してプラグインなしで`hello.ts`を開きます：

```shell
vim --noplugin hello.ts
```

`makeprg`を確認します：

```shell
:set makeprg?
```

デフォルトの`make`プログラムと表示されるはずです。新しいTypescriptコンパイラを使用するには、次のように実行します：

```shell
:compiler typescript
```

`:set makeprg?`を実行すると、`tsc`と表示されるはずです。テストしてみましょう。次のように実行します：

```shell
:make %
```

`%`は現在のファイルを意味します。あなたのTypescriptコンパイラが期待通りに動作するのを見てください！エラーのリストを表示するには、`:copen`を実行します。

## 非同期コンパイラ

時には、コンパイルに時間がかかることがあります。コンパイルプロセスが終了するまで、フリーズしたVimを見つめているのは嫌ですよね。非同期にコンパイルできれば、コンパイル中もVimを使用できるのは素晴らしいことです。

幸いなことに、非同期プロセスを実行するためのプラグインがあります。主なものは次の2つです：

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

この章の残りではvim-dispatchについて説明しますが、すべてのプラグインを試してみることを強くお勧めします。

*VimとNeoVimは実際に非同期ジョブをサポートしていますが、これはこの章の範囲を超えています。興味がある場合は、`:h job-channel-overview.txt`を確認してください。*

## プラグイン：Vim-dispatch

Vim-dispatchにはいくつかのコマンドがありますが、主なものは`:Make`と`:Dispatch`コマンドです。

### 非同期Make

Vim-dispatchの`:Make`コマンドはVimの`:make`に似ていますが、非同期で実行されます。Javascriptプロジェクトにいて、`npm t`を実行する必要がある場合、次のようにmakeprgを設定するかもしれません：

```shell
:set makeprg=npm\\ t
```

次のように実行します：

```shell
:make
```

Vimは`npm t`を実行しますが、JavaScriptテストが実行されている間、フリーズした画面を見つめることになります。vim-dispatchを使用すると、次のように実行できます：

```shell
:Make
```

Vimは`npm t`を非同期に実行します。このようにして、`npm t`がバックグラウンドプロセスで実行されている間、あなたは他の作業を続けることができます。素晴らしいですね！

### 非同期Dispatch

`:Dispatch`コマンドは`:compiler`や`:!`コマンドのようなもので、Vim内で任意の外部コマンドを非同期に実行できます。

Rubyのspecファイルの中にいて、テストを実行する必要があると仮定します。次のように実行します：

```shell
:Dispatch bundle exec rspec %
```

Vimは現在のファイル（`%`）に対して`rspec`コマンドを非同期に実行します。

### Dispatchの自動化

Vim-dispatchには、特定のコマンドを自動的に評価するために設定できる`b:dispatch`バッファ変数があります。これを`autocmd`と組み合わせて利用できます。vimrcに次のように追加します：

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

これにより、`_spec.rb`で終わるファイルに入るたびに、`:Dispatch`を実行すると自動的に`bundle exec rspec {your-current-ruby-spec-file}`が実行されます。

## スマートな方法でコンパイルを学ぶ

この章では、`make`と`compiler`コマンドを使用してVim内から*任意の*プロセスを非同期に実行し、プログラミングワークフローを補完する方法を学びました。Vimの他のプログラムとの拡張能力は、その強力さを示しています。