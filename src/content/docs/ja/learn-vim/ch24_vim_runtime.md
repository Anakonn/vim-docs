---
description: この章では、Vimのランタイムパスの概要を説明し、カスタマイズや使用方法を理解するための情報を提供します。
title: Ch24. Vim Runtime
---

前の章で、Vimが`~/.vim/`ディレクトリ内の`pack/`（第22章）や`compiler/`（第19章）のような特別なパスを自動的に探すことを述べました。これらはVimのランタイムパスの例です。

Vimにはこれらの2つ以上のランタイムパスがあります。この章では、これらのランタイムパスの高レベルの概要を学びます。この章の目標は、これらがいつ呼び出されるかを示すことです。これを知ることで、Vimをさらに理解し、カスタマイズできるようになります。

## ランタイムパス

Unixマシンでは、Vimのランタイムパスの1つは`$HOME/.vim/`です（Windowsのような異なるOSを使用している場合、パスは異なる場合があります）。異なるOSのランタイムパスを確認するには、`:h 'runtimepath'`をチェックしてください。この章では、`~/.vim/`をデフォルトのランタイムパスとして使用します。

## プラグインスクリプト

Vimには、Vimが起動するたびにこのディレクトリ内のスクリプトを1回実行するプラグインランタイムパスがあります。「プラグイン」という名前をVimの外部プラグイン（NERDTree、fzf.vimなど）と混同しないでください。

`~/.vim/`ディレクトリに移動し、`plugin/`ディレクトリを作成します。`donut.vim`と`chocolate.vim`の2つのファイルを作成します。

`~/.vim/plugin/donut.vim`の中：

```shell
echo "donut!"
```

`~/.vim/plugin/chocolate.vim`の中：

```shell
echo "chocolate!"
```

今、Vimを閉じます。次回Vimを起動すると、`"donut!"`と`"chocolate!"`の両方が表示されます。プラグインランタイムパスは初期化スクリプトに使用できます。

## ファイルタイプ検出

始める前に、これらの検出が機能することを確認するために、vimrcに少なくとも次の行が含まれていることを確認してください：

```shell
filetype plugin indent on
```

詳細については`:h filetype-overview`をチェックしてください。基本的に、これはVimのファイルタイプ検出をオンにします。

新しいファイルを開くと、Vimは通常、そのファイルがどのような種類のものであるかを知っています。`hello.rb`というファイルがある場合、`:set filetype?`を実行すると、正しい応答`filetype=ruby`が返されます。

Vimは「一般的な」ファイルタイプ（Ruby、Python、Javascriptなど）を検出する方法を知っています。しかし、カスタムファイルがある場合はどうでしょうか？Vimにそれを検出させ、正しいファイルタイプを割り当てる必要があります。

検出には2つの方法があります：ファイル名を使用する方法とファイル内容を使用する方法です。

### ファイル名検出

ファイル名検出は、そのファイルの名前を使用してファイルタイプを検出します。`hello.rb`ファイルを開くと、Vimは`.rb`拡張子からそれがRubyファイルであることを知っています。

ファイル名検出を行う方法は2つあります：`ftdetect/`ランタイムディレクトリを使用する方法と、`filetype.vim`ランタイムファイルを使用する方法です。両方を探ってみましょう。

#### `ftdetect/`

 obscure（しかし美味しい）ファイル`hello.chocodonut`を作成しましょう。これを開いて`:set filetype?`を実行すると、一般的なファイル名拡張子ではないため、Vimはそれをどう扱うかわかりません。`filetype=`が返されます。

Vimに`.chocodonut`で終わるすべてのファイルを「chocodonut」ファイルタイプとして設定するよう指示する必要があります。ランタイムルート（`~/.vim/`）に`ftdetect/`という名前のディレクトリを作成します。その中にファイルを作成し、`chocodonut.vim`と名付けます（`~/.vim/ftdetect/chocodonut.vim`）。このファイルの中に次を追加します：

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile`と`BufRead`は、新しいバッファを作成したり、新しいバッファを開いたりするたびにトリガーされます。`*.chocodonut`は、開いたバッファが`.chocodonut`ファイル名拡張子を持っている場合にのみこのイベントがトリガーされることを意味します。最後に、`set filetype=chocodonut`コマンドはファイルタイプをchocodonutタイプに設定します。

Vimを再起動します。今、`hello.chocodonut`ファイルを開き、`:set filetype?`を実行します。`filetype=chocodonut`が返されます。

美味しい！`ftdetect/`内に好きなだけファイルを入れることができます。将来的には、`ftdetect/strawberrydonut.vim`、`ftdetect/plaindonut.vim`などを追加することもできるでしょう。

実際、Vimでファイルタイプを設定する方法は2つあります。1つは、あなたがちょうど使用した`set filetype=chocodonut`です。もう1つの方法は、`setfiletype chocodonut`を実行することです。前者のコマンド`set filetype=chocodonut`は*常に*ファイルタイプをchocodonutタイプに設定しますが、後者のコマンド`setfiletype chocodonut`は、まだファイルタイプが設定されていない場合にのみファイルタイプを設定します。

#### ファイルタイプファイル

2つ目のファイル検出方法は、ルートディレクトリ（`~/.vim/filetype.vim`）に`filetype.vim`を作成する必要があります。これを追加します：

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

`hello.plaindonut`ファイルを作成します。これを開いて`:set filetype?`を実行すると、Vimは正しいカスタムファイルタイプ`filetype=plaindonut`を表示します。

おお、ペイストリー、うまくいきました！ちなみに、`filetype.vim`をいじっていると、`hello.plaindonut`を開くときにこのファイルが何度も実行されることに気付くかもしれません。これを防ぐために、メインスクリプトが1回だけ実行されるようにガードを追加できます。`filetype.vim`を更新します：

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish`は、残りのスクリプトの実行を停止するVimコマンドです。`"did_load_filetypes"`式は*組み込みのVim関数ではありません。実際には、`$VIMRUNTIME/filetype.vim`内のグローバル変数です。興味があれば、`:e $VIMRUNTIME/filetype.vim`を実行してください。これらの行が見つかります：

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Vimがこのファイルを呼び出すと、`did_load_filetypes`変数が定義され、1に設定されます。1はVimでは真と見なされます。`filetype.vim`の残りも読むべきです。Vimがそれを呼び出すときに何をするか理解できるか見てみてください。

### ファイルタイプスクリプト

ファイル内容に基づいてファイルタイプを検出し、割り当てる方法を学びましょう。

合意された拡張子のないファイルのコレクションがあるとします。これらのファイルに共通する唯一のことは、すべてのファイルが最初の行に「donutify」という単語で始まることです。これらのファイルに`donut`ファイルタイプを割り当てたいと考えています。拡張子なしで`sugardonut`、`glazeddonut`、`frieddonut`という名前の新しいファイルを作成します。それぞれのファイルにこの行を追加します：

```shell
donutify
```

`sugardonut`内で`:set filetype?`を実行すると、Vimはこのファイルにどのファイルタイプを割り当てるべきかわかりません。`filetype=`が返されます。

ランタイムルートパスに`scripts.vim`ファイル（`~/.vim/scripts.vim`）を追加します。その中に次を追加します：

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

関数`getline(1)`は最初の行のテキストを返します。それが「donutify」という単語で始まるかどうかをチェックします。関数`did_filetype()`はVimの組み込み関数です。ファイルタイプ関連のイベントが少なくとも1回トリガーされると真を返します。これはファイルタイプイベントの再実行を防ぐためのガードとして使用されます。

`sugardonut`ファイルを開いて`:set filetype?`を実行すると、Vimは今や`filetype=donut`を返します。他のドーナツファイル（`glazeddonut`と`frieddonut`）を開くと、Vimもそれらのファイルタイプを`donut`タイプとして識別します。

`scripts.vim`は、Vimが未知のファイルタイプのファイルを開くときにのみ実行されることに注意してください。Vimが既知のファイルタイプのファイルを開くと、`scripts.vim`は実行されません。

## ファイルタイププラグイン

Vimがchocodonutファイルを開いたときにchocodonut特有のスクリプトを実行し、plaindonutファイルを開いたときにはそれらのスクリプトを実行しないようにしたい場合はどうでしょうか？

これをファイルタイププラグインランタイムパス（`~/.vim/ftplugin/`）で行うことができます。Vimはこのディレクトリ内で、開いたファイルタイプと同じ名前のファイルを探します。`chocodonut.vim`を作成します（`~/.vim/ftplugin/chocodonut.vim`）：

```shell
echo "Calling from chocodonut ftplugin"
```

もう1つのftpluginファイル、`plaindonut.vim`（`~/.vim/ftplugin/plaindonut.vim`）を作成します：

```shell
echo "Calling from plaindonut ftplugin"
```

これで、chocodonutファイルタイプを開くたびに、Vimは`~/.vim/ftplugin/chocodonut.vim`からスクリプトを実行します。plaindonutファイルタイプを開くたびに、Vimは`~/.vim/ftplugin/plaindonut.vim`からスクリプトを実行します。

1つ警告があります：これらのファイルは、バッファファイルタイプが設定されるたびに実行されます（例えば`set filetype=chocodonut`）。3つの異なるchocodonutファイルを開くと、スクリプトは*合計*で3回実行されます。

## インデントファイル

Vimには、ftpluginと似たように動作するインデントランタイムパスがあります。Vimは開いたファイルタイプと同じ名前のファイルを探します。これらのインデントランタイムパスの目的は、インデント関連のコードを格納することです。`~/.vim/indent/chocodonut.vim`というファイルがある場合、chocodonutファイルタイプを開いたときにのみ実行されます。ここにchocodonutファイルのインデント関連のコードを格納できます。

## カラー

Vimには、カラースキームを格納するためのカラーランタイムパス（`~/.vim/colors/`）があります。このディレクトリ内にあるファイルは、`:color`コマンドラインコマンドで表示されます。

`~/.vim/colors/beautifulprettycolors.vim`ファイルがある場合、`:color`を実行してTabを押すと、`beautifulprettycolors`が色のオプションの1つとして表示されます。独自のカラースキームを追加したい場合は、ここがその場所です。

他の人が作成したカラースキームを確認したい場合は、[vimcolors](https://vimcolors.com/)を訪れるのが良い場所です。

## 構文ハイライト

Vimには、構文ハイライトを定義するための構文ランタイムパス（`~/.vim/syntax/`）があります。

`hello.chocodonut`ファイルがあり、その中に次の式があるとします：

```shell
(donut "tasty")
(donut "savory")
```

Vimは今や正しいファイルタイプを知っていますが、すべてのテキストは同じ色です。「donut」キーワードをハイライトするための構文ハイライトルールを追加しましょう。新しいchocodonut構文ファイル`~/.vim/syntax/chocodonut.vim`を作成します。その中に次を追加します：

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

今、`hello.chocodonut`ファイルを再度開きます。`donut`キーワードがハイライトされます。

この章では構文ハイライトについて詳しく説明しません。これは広範なトピックです。興味があれば、`:h syntax.txt`をチェックしてください。

[vim-polyglot](https://github.com/sheerun/vim-polyglot)プラグインは、多くの人気プログラミング言語のハイライトを提供する素晴らしいプラグインです。

## ドキュメント

プラグインを作成する場合は、自分のドキュメントを作成する必要があります。そのためにdocランタイムパスを使用します。

chocodonutとplaindonutキーワードの基本的なドキュメントを作成しましょう。`donut.txt`（`~/.vim/doc/donut.txt`）を作成します。その中に次のテキストを追加します：

```shell
*chocodonut* Delicious chocolate donut

*plaindonut* No choco goodness but still delicious nonetheless
```

`chocodonut`と`plaindonut`を検索しようとすると（`:h chocodonut`と`:h plaindonut`）、何も見つかりません。

まず、`:helptags`を実行して新しいヘルプエントリを生成する必要があります。`:helptags ~/.vim/doc/`を実行します。

今、`:h chocodonut`と`:h plaindonut`を実行すると、これらの新しいヘルプエントリが見つかります。ファイルは現在読み取り専用で、「help」ファイルタイプがあります。
## レイジーローディングスクリプト

この章で学んだすべてのランタイムパスは自動的に実行されました。スクリプトを手動で読み込む場合は、オートロードランタイムパスを使用します。

オートロードディレクトリを作成します（`~/.vim/autoload/`）。そのディレクトリ内に新しいファイルを作成し、`tasty.vim`という名前を付けます（`~/.vim/autoload/tasty.vim`）。その中に：

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

関数名は`tasty#donut`であり、`donut()`ではないことに注意してください。オートロード機能を使用する際には、シャープ記号（`#`）が必要です。オートロード機能の関数命名規則は次のとおりです：

```shell
function fileName#functionName()
  ...
endfunction
```

この場合、ファイル名は`tasty.vim`で、関数名は（技術的には）`donut`です。

関数を呼び出すには、`call`コマンドが必要です。その関数を`:call tasty#donut()`で呼び出しましょう。

関数を初めて呼び出すと、*両方*のエコーメッセージ（"tasty.vim global"と"tasty#donut"）が表示されるはずです。その後の`tasty#donut`関数への呼び出しでは、"testy#donut"エコーのみが表示されます。

Vimでファイルを開くと、前のランタイムパスとは異なり、オートロードスクリプトは自動的に読み込まれません。明示的に`tasty#donut()`を呼び出すときのみ、Vimは`tasty.vim`ファイルを探し、その中のすべてを読み込みます。オートロードは、リソースを多く使用する関数に最適なメカニズムですが、頻繁には使用しません。

オートロードでネストされたディレクトリを好きなだけ追加できます。ランタイムパス`~/.vim/autoload/one/two/three/tasty.vim`がある場合、関数を`:call one#two#three#tasty#donut()`で呼び出すことができます。

## アフタースクリプト

Vimにはアフターランタイムパス（`~/.vim/after/`）があり、`~/.vim/`の構造を反映しています。このパス内のすべては最後に実行されるため、開発者は通常、スクリプトのオーバーライドにこれらのパスを使用します。

たとえば、`plugin/chocolate.vim`のスクリプトを上書きしたい場合は、`~/.vim/after/plugin/chocolate.vim`を作成してオーバーライドスクリプトを配置できます。Vimは`~/.vim/plugin/chocolate.vim`の*後*に`~/.vim/after/plugin/chocolate.vim`を実行します。

## $VIMRUNTIME

Vimにはデフォルトのスクリプトとサポートファイル用の環境変数`$VIMRUNTIME`があります。`：e $VIMRUNTIME`を実行することで確認できます。

その構造はおそらく馴染みがあるでしょう。この章で学んだ多くのランタイムパスが含まれています。

第21章で、Vimを開くときに7つの異なる場所でvimrcファイルを探すことを学びました。Vimが最後に確認する場所は`$VIMRUNTIME/defaults.vim`であると述べました。Vimがユーザーのvimrcファイルを見つけられない場合、Vimは`defaults.vim`をvimrcとして使用します。

vim-polyglotのような構文プラグインなしでVimを実行しても、ファイルが依然として構文的にハイライトされていることを試したことがありますか？それは、Vimがランタイムパスから構文ファイルを見つけられないとき、Vimが`$VIMRUNTIME`の構文ディレクトリから構文ファイルを探すためです。

詳細を学ぶには、`:h $VIMRUNTIME`を確認してください。

## ランタイムパスオプション

ランタイムパスを確認するには、`:set runtimepath?`を実行します。

Vim-Plugや人気のある外部プラグインマネージャーを使用している場合、ディレクトリのリストが表示されるはずです。たとえば、私のものは次のように表示されます：

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

プラグインマネージャーの1つの機能は、各プラグインをランタイムパスに追加することです。各ランタイムパスは、`~/.vim/`に似た独自のディレクトリ構造を持つことができます。

`~/box/of/donuts/`というディレクトリがあり、そのディレクトリをランタイムパスに追加したい場合は、vimrcに次のように追加できます：

```shell
set rtp+=$HOME/box/of/donuts/
```

`~/box/of/donuts/`内にプラグインディレクトリ（`~/box/of/donuts/plugin/hello.vim`）とftplugin（`~/box/of/donuts/ftplugin/chocodonut.vim`）がある場合、VimはVimを開くときに`plugin/hello.vim`からすべてのスクリプトを実行します。また、チョコドーナツファイルを開くときに`ftplugin/chocodonut.vim`も実行します。

これを自分で試してみてください：任意のパスを作成し、それをランタイムパスに追加します。この章で学んだランタイムパスのいくつかを追加してください。期待通りに動作することを確認してください。

## スマートな方法でランタイムを学ぶ

これらのランタイムパスを読みながら、時間をかけて遊んでみてください。ランタイムパスが実際にどのように使用されているかを見るために、お気に入りのVimプラグインのリポジトリに行き、そのディレクトリ構造を研究してください。今ではほとんどのものを理解できるはずです。ついていって全体像を把握してみてください。Vimのディレクトリ構造を理解したので、Vimscriptを学ぶ準備が整いました。