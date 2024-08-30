---
description: Vimタグを使用して、コードベース内の定義に迅速にアクセスする方法を学び、効率的なテキスト編集を実現します。
title: Ch16. Tags
---

テキスト編集の便利な機能の一つは、任意の定義に迅速に移動できることです。この章では、Vimタグを使用してそれを行う方法を学びます。

## タグの概要

誰かが新しいコードベースを渡してきたとしましょう：

```shell
one = One.new
one.donut
```

`One`？ `donut`？ これらは、当時コードを書いていた開発者には明白だったかもしれませんが、今ではその開発者はもういなく、これらの不明瞭なコードを理解するのはあなたの役目です。これを理解する手助けの一つは、`One`と`donut`が定義されているソースコードを辿ることです。

`fzf`や`grep`（または`vimgrep`）を使用して検索できますが、この場合、タグの方が速いです。

タグを住所録のように考えてみてください：

```shell
Name    Address
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

名前-住所のペアの代わりに、タグは定義とアドレスのペアを保存します。

同じディレクトリ内に次の2つのRubyファイルがあると仮定しましょう：

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

と

```shell
## two.rb
require './one'

one = One.new
one.donut
```

定義にジャンプするには、通常モードで`Ctrl-]`を使用します。`two.rb`内で`one.donut`がある行に移動し、カーソルを`donut`の上に置きます。`Ctrl-]`を押します。

おっと、Vimはタグファイルを見つけられませんでした。最初にタグファイルを生成する必要があります。

## タグジェネレーター

現代のVimにはタグジェネレーターが付属していないため、外部のタグジェネレーターをダウンロードする必要があります。選択肢はいくつかあります：

- ctags = C専用。ほぼどこでも利用可能。
- exuberant ctags = 最も人気のあるものの一つ。多くの言語をサポート。
- universal ctags = exuberant ctagsに似ていますが、より新しい。
- etags = Emacs用。うーん...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

オンラインのVimチュートリアルを見てみると、多くが[exuberant ctags](http://ctags.sourceforge.net/)を推奨しています。これは[41のプログラミング言語](http://ctags.sourceforge.net/languages.html)をサポートしています。私も使ってみましたが、非常に良く機能しました。しかし、2009年以降メンテナンスされていないため、Universal ctagsの方が良い選択です。これはexuberant ctagsに似ており、現在もメンテナンスされています。

Universal ctagsのインストール方法については詳しく説明しません。詳細な指示については[universal ctags](https://github.com/universal-ctags/ctags)リポジトリを確認してください。

Universal ctagsがインストールされていると仮定して、基本的なタグファイルを生成しましょう。次のコマンドを実行します：

```shell
ctags -R .
```

`R`オプションは、ctagsに現在の場所（`.`）から再帰的にスキャンするよう指示します。現在のディレクトリに`tags`ファイルが表示されるはずです。その中には次のような内容が含まれています：

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

あなたのものは、Vimの設定やctagsジェネレーターによって少し異なるかもしれません。タグファイルは、タグメタデータとタグリストの2つの部分で構成されています。これらのメタデータ（`!TAG_FILE...`）は通常、ctagsジェネレーターによって制御されます。ここでは詳しく説明しませんが、興味があれば彼らのドキュメントをチェックしてください！タグリストは、ctagsによってインデックスされたすべての定義のリストです。

次に`two.rb`に移動し、カーソルを`donut`に置いて、`Ctrl-]`を入力します。Vimは`def donut`がある`one.rb`ファイルの行にジャンプします。成功！しかし、Vimはこれをどうやって行ったのでしょうか？

## タグの構造

`donut`タグアイテムを見てみましょう：

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

上記のタグアイテムは、4つのコンポーネントで構成されています：`tagname`、`tagfile`、`tagaddress`、およびタグオプション。
- `donut`は`tagname`です。カーソルが「donut」の上にあるとき、Vimはタグファイル内で「donut」文字列を含む行を検索します。
- `one.rb`は`tagfile`です。Vimは`one.rb`ファイルを探します。
- `/^ def donut$/`は`tagaddress`です。`/.../`はパターンインジケーターです。`^`は行の最初の要素のパターンです。その後に2つのスペースが続き、次に文字列`def donut`があります。最後に、`$`は行の最後の要素のパターンです。
- `f class:One`は、関数`donut`が関数（`f`）であり、`One`クラスの一部であることをVimに伝えるタグオプションです。

タグリストの別のアイテムを見てみましょう：

```shell
One	one.rb	/^class One$/;"	c
```

この行は、`donut`パターンと同じように機能します：

- `One`は`tagname`です。タグの場合、最初のスキャンは大文字と小文字を区別します。リストに`One`と`one`がある場合、Vimは`One`を`one`より優先します。
- `one.rb`は`tagfile`です。Vimは`one.rb`ファイルを探します。
- `/^class One$/`は`tagaddress`パターンです。Vimは`class`で始まり（`^`）、`One`で終わる（`$`）行を探します。
- `c`は可能なタグオプションの一つです。`One`はRubyクラスであり、手続きではないため、`c`でマークされています。

使用するタグジェネレーターによって、タグファイルの内容は異なる場合があります。最低限、タグファイルは次のいずれかの形式を持っている必要があります：

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## タグファイル

`ctags -R .`を実行した後に新しいファイル`tags`が作成されることを学びました。Vimはタグファイルをどこで探すかをどうやって知るのでしょうか？

`:set tags?`を実行すると、`tags=./tags,tags`（Vimの設定によって異なる場合があります）と表示されるかもしれません。ここでVimは、`./tags`の場合は現在のファイルのパス内のすべてのタグを探し、`tags`の場合は現在のディレクトリ（プロジェクトのルート）を探します。

また、`./tags`の場合、Vimは現在のファイルのパス内で最初にタグファイルを探し、どれだけネストされていても、次に現在のディレクトリ（プロジェクトのルート）のタグファイルを探します。Vimは最初の一致を見つけた後に停止します。

もしあなたの`'tags'`ファイルが`tags=./tags,tags,/user/iggy/mytags/tags`と言っていた場合、Vimは`./tags`と`tags`ディレクトリの検索が終わった後に`/user/iggy/mytags`ディレクトリでもタグファイルを探します。タグファイルをプロジェクト内に保存する必要はなく、別に保管することもできます。

新しいタグファイルの場所を追加するには、次のようにします：

```shell
set tags+=path/to/my/tags/file
```

## 大規模プロジェクトのためのタグ生成

大規模プロジェクトでctagsを実行しようとすると、Vimはすべてのネストされたディレクトリ内も探すため、時間がかかる場合があります。もしあなたがJavascript開発者であれば、`node_modules`が非常に大きいことを知っているでしょう。5つのサブプロジェクトがあり、それぞれに独自の`node_modules`ディレクトリがあると想像してみてください。`ctags -R .`を実行すると、ctagsはすべての5つの`node_modules`をスキャンしようとします。`node_modules`に対してctagsを実行する必要はないでしょう。

`node_modules`を除外してctagsを実行するには、次のようにします：

```shell
ctags -R --exclude=node_modules .
```

今回は1秒未満で完了するはずです。ちなみに、`exclude`オプションは複数回使用できます：

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

重要なのは、ディレクトリを省略したい場合、`--exclude`が最良の友人であるということです。

## タグナビゲーション

`Ctrl-]`だけを使用しても良い結果が得られますが、もう少しトリックを学びましょう。タグジャンプキー`Ctrl-]`には、コマンドラインモードの代替手段があります：`:tag {tag-name}`。次のように実行します：

```shell
:tag donut
```

Vimは「donut」メソッドにジャンプします。これは「donut」文字列で`Ctrl-]`を押すのと同じです。引数も`<Tab>`でオートコンプリートできます：

```shell
:tag d<Tab>
```

Vimは「d」で始まるすべてのタグをリストします。この場合、「donut」です。

実際のプロジェクトでは、同じ名前のメソッドが複数存在することがあります。以前の2つのRubyファイルを更新しましょう。`one.rb`内で：

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

`two.rb`内で：

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

もし一緒にコーディングしているなら、いくつかの新しい手続きがあるので、再度`ctags -R .`を実行することを忘れないでください。`pancake`手続きが2つあります。`two.rb`内で`Ctrl-]`を押すと、何が起こるでしょうか？

Vimは`two.rb`内の`def pancake`にジャンプし、`one.rb`内の`def pancake`にはジャンプしません。これは、Vimが`two.rb`内の`pancake`手続きを他の`pancake`手続きよりも優先しているためです。

## タグの優先順位

すべてのタグが平等ではありません。いくつかのタグはより高い優先順位を持っています。Vimが重複するアイテム名に直面した場合、Vimはキーワードの優先順位を確認します。順序は次の通りです：

1. 現在のファイル内の完全に一致した静的タグ。
2. 現在のファイル内の完全に一致したグローバルタグ。
3. 別のファイル内の完全に一致したグローバルタグ。
4. 別のファイル内の完全に一致した静的タグ。
5. 現在のファイル内の大文字と小文字を区別しない完全一致した静的タグ。
6. 現在のファイル内の大文字と小文字を区別しない完全一致したグローバルタグ。
7. 別のファイル内の大文字と小文字を区別しない完全一致したグローバルタグ。
8. 現在のファイル内の大文字と小文字を区別しない完全一致した静的タグ。

優先順位リストによれば、Vimは同じファイル内で見つかった完全一致を優先します。だからこそ、Vimは`two.rb`内の`pancake`手続きを`one.rb`内の`pancake`手続きよりも選択します。上記の優先順位リストには、`'tagcase'`、`'ignorecase'`、および`'smartcase'`設定に応じた例外がありますが、ここでは詳しく説明しません。興味がある場合は、`:h tag-priority`を確認してください。

## 選択的タグジャンプ

常に最高優先順位のタグアイテムにジャンプするのではなく、どのタグアイテムにジャンプするかを選択できれば良いでしょう。もしかしたら、`two.rb`の`pancake`メソッドではなく、`one.rb`の`pancake`メソッドにジャンプしたいかもしれません。そのためには、`:tselect`を使用できます。次のように実行します：

```shell
:tselect pancake
```

画面の下部に次のように表示されます：
## プライオリティ タグ               ファイル
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

2を入力すると、Vimは`one.rb`の手続きにジャンプします。1を入力すると、Vimは`two.rb`の手続きにジャンプします。

`pri`列に注意してください。最初のマッチには`F C`があり、2番目のマッチには`F`があります。これはVimがタグの優先順位を決定するために使用します。`F C`は、現在の（`C`）ファイル内の完全一致した（`F`）グローバルタグを意味します。`F`は、完全一致した（`F`）グローバルタグのみを意味します。`F C`は常に`F`よりも高い優先順位を持ちます。

`:tselect donut`を実行すると、Vimは選択するタグ項目を促しますが、選択肢が1つしかない場合でもです。複数のマッチがある場合にのみタグリストを促し、1つのタグが見つかった場合は即座にジャンプする方法はありますか？

もちろんです！Vimには`:tjump`メソッドがあります。次のように実行します：

```shell
:tjump donut
```

Vimは`one.rb`の`donut`手続きに即座にジャンプします。これは`:tag donut`を実行するのと似ています。次に実行します：

```shell
:tjump pancake
```

Vimは選択するタグオプションを促します。これは`:tselect pancake`を実行するのと似ています。`tjump`を使うことで、両方の方法の利点を得ることができます。

Vimには`tjump`のための通常モードキーがあります：`g Ctrl-]`。私は個人的に`Ctrl-]`よりも`g Ctrl-]`の方が好きです。

## タグによる自動補完

タグは自動補完を助けることができます。第6章、挿入モードから思い出してください。`Ctrl-X`サブモードを使用してさまざまな自動補完を行うことができます。私が言及しなかった自動補完サブモードの1つは`Ctrl-]`です。挿入モードで`Ctrl-X Ctrl-]`を実行すると、Vimはタグファイルを使用して自動補完を行います。

挿入モードに入り、`Ctrl-x Ctrl-]`を入力すると、次のようになります：

```shell
One
donut
initialize
pancake
```

## タグスタック

Vimは、ジャンプしたすべてのタグのリストをタグスタックに保持します。`:tags`を使用してこのスタックを見ることができます。最初に`pancake`にタグジャンプし、その後`donut`にジャンプし、`:tags`を実行すると、次のようになります：

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

上記の`>`記号に注意してください。これはスタック内の現在の位置を示しています。スタックを「ポップ」して1つ前のスタックに戻るには、`:pop`を実行できます。試してみて、再度`:tags`を実行してください：

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

`>`記号が現在`donut`のある2行目に移動していることに注意してください。もう一度`pop`を実行し、再度`:tags`を実行します：

```shell
  # TO tag         FROM line  in file/text
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

通常モードでは、`Ctrl-t`を実行して`:pop`と同じ効果を得ることができます。

## 自動タグ生成

Vimタグの最大の欠点の1つは、重要な変更を加えるたびにタグファイルを再生成しなければならないことです。最近`pancake`手続きを`waffle`手続きに名前を変更した場合、タグファイルは`pancake`手続きが名前を変更されたことを知りません。まだタグのリストに`pancake`を保持しています。この方法で新しいタグファイルを再作成するのは面倒です。

幸いにも、タグを自動的に生成するために使用できるいくつかの方法があります。

## 保存時にタグを生成

Vimには、イベントトリガー時に任意のコマンドを実行するための自動コマンド（`autocmd`）メソッドがあります。これを使用して、各保存時にタグを生成できます。次のように実行します：

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

内訳：
- `autocmd`はコマンドラインコマンドです。イベント、ファイルパターン、およびコマンドを受け入れます。
- `BufWritePost`はバッファを保存するためのイベントです。ファイルを保存するたびに`BufWritePost`イベントがトリガーされます。
- `.rb`はRubyファイルのファイルパターンです。
- `silent`は実際には渡しているコマンドの一部です。これがないと、Vimは自動コマンドをトリガーするたびに`press ENTER or type command to continue`を表示します。
- `!ctags -R .`は実行するコマンドです。Vim内から`!cmd`を実行すると、ターミナルコマンドが実行されます。

これで、Rubyファイル内から保存するたびに、Vimは`ctags -R .`を実行します。

## プラグインの使用

自動的にctagsを生成するためのいくつかのプラグインがあります：

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

私はvim-gutentagsを使用しています。使いやすく、すぐに動作します。

## CtagsとGitフック

多くの素晴らしいVimプラグインの作者であるTim Popeは、gitフックを使用することを提案するブログを書きました。[チェックしてみてください](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html)。

## スマートな方法でタグを学ぶ

タグは適切に設定されると便利です。新しいコードベースに直面し、`functionFood`が何をするのか理解したい場合、定義にジャンプすることで簡単に読むことができます。その中で、`functionBreakfast`も呼び出していることがわかります。それを追っていくと、`functionPancake`を呼び出していることがわかります。あなたの関数呼び出しグラフは次のようになります：

```shell
functionFood -> functionBreakfast -> functionPancake
```

これは、このコードフローが朝食にパンケーキを持つことに関連していることを示しています。

タグについてもっと学ぶには、`:h tags`をチェックしてください。タグの使い方を知ったので、別の機能である折りたたみを探求してみましょう。