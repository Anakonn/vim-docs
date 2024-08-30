---
description: Vimでの迅速な検索方法を紹介します。プラグインなしとfzf.vimを使った検索方法を学び、生産性を向上させましょう。
title: Ch03. Searching Files
---

この章の目標は、Vimで迅速に検索する方法を紹介することです。迅速に検索できることは、Vimの生産性を高める素晴らしい方法です。ファイルを迅速に検索する方法を理解したとき、私はVimをフルタイムで使用するようになりました。

この章は、プラグインなしで検索する方法と、[fzf.vim](https://github.com/junegunn/fzf.vim)プラグインを使用して検索する方法の2つの部分に分かれています。それでは始めましょう！

## ファイルのオープンと編集

Vimでファイルを開くには、`:edit`を使用します。

```shell
:edit file.txt
```

`file.txt`が存在する場合、`file.txt`バッファが開きます。`file.txt`が存在しない場合は、`file.txt`の新しいバッファが作成されます。

`<Tab>`によるオートコンプリートは`:edit`でも機能します。たとえば、ファイルが[Rails](https://rubyonrails.org/)の*アプリ*コントローラー*ユーザーコントローラー*ディレクトリ`./app/controllers/users_controllers.rb`内にある場合、`<Tab>`を使用して用語を迅速に展開できます：

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit`はワイルドカード引数を受け入れます。`*`は現在のディレクトリ内の任意のファイルに一致します。現在のディレクトリ内で`.yml`拡張子のファイルのみを探している場合：

```shell
:edit *.yml<Tab>
```

Vimは、現在のディレクトリ内のすべての`.yml`ファイルのリストを表示します。

`**`を使用して再帰的に検索できます。プロジェクト内のすべての`*.md`ファイルを探したいが、どのディレクトリにあるかわからない場合、次のようにします：

```shell
:edit **/*.md<Tab>
```

`:edit`はVimの組み込みファイルエクスプローラー`netrw`を実行するためにも使用できます。そのためには、ファイルの代わりにディレクトリ引数を指定します：

```shell
:edit .
:edit test/unit/
```

## ファイルを探すためのFind

`:find`を使用してファイルを見つけることができます。たとえば：

```shell
:find package.json
:find app/controllers/users_controller.rb
```

オートコンプリートも`:find`で機能します：

```shell
:find p<Tab>                " package.jsonを見つける
:find a<Tab>c<Tab>u<Tab>    " app/controllers/users_controller.rbを見つける
```

`:find`は`:edit`に似ていることに気付くかもしれません。違いは何ですか？

## FindとPath

違いは、`:find`が`path`内のファイルを見つけるのに対し、`:edit`はそうではないことです。`path`を少し学びましょう。パスを変更する方法を学ぶと、`:find`は強力な検索ツールになります。パスを確認するには、次のようにします：

```shell
:set path?
```

デフォルトでは、あなたのパスはおそらく次のようになります：

```shell
path=.,/usr/include,,
```

- `.`は現在開いているファイルのディレクトリ内を検索することを意味します。
- `,`は現在のディレクトリ内を検索することを意味します。
- `/usr/include`はCライブラリのヘッダーファイルの典型的なディレクトリです。

最初の2つは私たちの文脈では重要で、3つ目は今のところ無視できます。ここでのポイントは、Vimがファイルを探す場所である自分のパスを変更できるということです。これがあなたのプロジェクト構造だと仮定しましょう：

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

ルートディレクトリから`users_controller.rb`に移動したい場合、いくつかのディレクトリを経由しなければなりません（かなりの量のタブを押す必要があります）。フレームワークで作業しているときは、特定のディレクトリで90％の時間を費やします。この状況では、最小限のキーストロークで`controllers/`ディレクトリに移動することだけが重要です。`path`設定はその旅を短縮できます。

現在の`path`に`app/controllers/`を追加する必要があります。次のようにできます：

```shell
:set path+=app/controllers/
```

パスが更新されたので、`u<Tab>`と入力すると、Vimは`app/controllers/`ディレクトリ内で「u」で始まるファイルを検索します。

ネストされた`controllers/`ディレクトリがある場合、たとえば`app/controllers/account/users_controller.rb`のように、Vimは`users_controllers`を見つけません。代わりに、オートコンプリートが`users_controller.rb`を見つけるために、`:set path+=app/controllers/**`を追加する必要があります。これは素晴らしいです！これで、3回のタブを押す代わりに1回のタブでユーザーコントローラーを見つけることができます。

タブを押すとVimがそのファイルをどこでも検索するように、プロジェクト全体のディレクトリを追加しようと思っているかもしれません。次のように：

```shell
:set path+=$PWD/**
```

`$PWD`は現在の作業ディレクトリです。プロジェクト全体を`path`に追加して、タブを押すとすべてのファイルにアクセスできるようにしようとすると、小さなプロジェクトではこれが機能するかもしれませんが、プロジェクト内に多数のファイルがある場合、検索が大幅に遅くなります。最も訪問するファイル/ディレクトリの`path`のみを追加することをお勧めします。

`set path+={your-path-here}`をvimrcに追加できます。`path`の更新は数秒で済み、これにより多くの時間を節約できます。

## Grepを使用したファイル内検索

ファイル内でフレーズを見つける必要がある場合は、grepを使用できます。Vimにはこれを行う2つの方法があります：

- 内部grep（`:vim`。はい、`：vim`と綴ります。`：vimgrep`の略です）。
- 外部grep（`:grep`）。

まず内部grepについて見てみましょう。`:vim`の構文は次のとおりです：

```shell
:vim /pattern/ file
```

- `/pattern/`は検索用語の正規表現パターンです。
- `file`はファイル引数です。複数の引数を渡すことができます。Vimはファイル引数内でパターンを検索します。`:find`と同様に、`*`や`**`のワイルドカードを渡すことができます。

たとえば、`app/controllers/`ディレクトリ内のすべてのRubyファイル（`.rb`）内で「breakfast」文字列のすべての出現を探すには：

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

これを実行すると、最初の結果にリダイレクトされます。Vimの`vim`検索コマンドは`quickfix`操作を使用します。すべての検索結果を見るには、`:copen`を実行します。これにより`quickfix`ウィンドウが開きます。ここに、すぐに生産的になるためのいくつかの便利なquickfixコマンドがあります：

```shell
:copen        quickfixウィンドウを開く
:cclose       quickfixウィンドウを閉じる
:cnext        次のエラーに移動
:cprevious    前のエラーに移動
:colder       古いエラーリストに移動
:cnewer       新しいエラーリストに移動
```

quickfixについてもっと学ぶには、`:h quickfix`を確認してください。

内部grep（`:vim`）を実行すると、多くの一致がある場合に遅くなることに気付くかもしれません。これは、Vimが各一致するファイルをメモリに読み込むためです。もしVimが検索に一致するファイルを大量に見つけると、それらすべてを読み込むため、大量のメモリを消費します。

外部grepについて話しましょう。デフォルトでは、`grep`ターミナルコマンドを使用します。`app/controllers/`ディレクトリ内のRubyファイルで「lunch」を検索するには、次のようにします：

```shell
:grep -R "lunch" app/controllers/
```

`/pattern/`の代わりに、ターミナルgrep構文の`"pattern"`を使用することに注意してください。また、すべての一致を`quickfix`を使用して表示します。

Vimは、`:grep` Vimコマンドを実行するときにどの外部プログラムを実行するかを決定するために`grepprg`変数を定義しています。これにより、Vimを閉じてターミナルの`grep`コマンドを呼び出す必要がなくなります。後で、`:grep` Vimコマンドを使用する際に呼び出されるデフォルトのプログラムを変更する方法をお見せします。

## Netrwを使用したファイルのブラウジング

`netrw`はVimの組み込みファイルエクスプローラーです。プロジェクトの階層を確認するのに便利です。`netrw`を実行するには、`.vimrc`に次の2つの設定が必要です：

```shell
set nocp
filetype plugin on
```

`netrw`は広範なトピックなので、基本的な使用法のみをカバーしますが、始めるには十分です。ファイルの代わりにディレクトリをパラメータとして渡すことで、Vimを起動するときに`netrw`を開始できます。たとえば：

```shell
vim .
vim src/client/
vim app/controllers/
```

Vim内から`netrw`を起動するには、`:edit`コマンドを使用し、ファイル名の代わりにディレクトリパラメータを渡すことができます：

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

ディレクトリを渡さずに`netrw`ウィンドウを起動する他の方法もあります：

```shell
:Explore     現在のファイルでnetrwを開始
:Sexplore    冗談ではありません。画面の上半分でnetrwを開始
:Vexplore    画面の左半分でnetrwを開始
```

Vimの動作で`netrw`をナビゲートできます（動作については後の章で詳しく説明します）。ファイルやディレクトリを作成、削除、または名前変更する必要がある場合、便利な`netrw`コマンドのリストは次のとおりです：

```shell
%    新しいファイルを作成
d    新しいディレクトリを作成
R    ファイルまたはディレクトリの名前を変更
D    ファイルまたはディレクトリを削除
```

`:h netrw`は非常に包括的です。時間があれば確認してください。

`netrw`があまりにも単調で、もっと風味が必要な場合は、[vim-vinegar](https://github.com/tpope/vim-vinegar)は`netrw`を改善するための良いプラグインです。異なるファイルエクスプローラーを探している場合は、[NERDTree](https://github.com/preservim/nerdtree)が良い代替手段です。ぜひチェックしてください！

## Fzf

Vimでの組み込みツールを使用したファイル検索方法を学んだので、プラグインを使用してそれを行う方法を学びましょう。

現代のテキストエディターが正しく実装していることの1つは、特にファジー検索を介してファイルを見つけることがどれほど簡単かということです。この章の後半では、Vimでの検索を簡単かつ強力にするために、[fzf.vim](https://github.com/junegunn/fzf.vim)の使用方法を示します。

## セットアップ

まず、[fzf](https://github.com/junegunn/fzf)と[ripgrep](https://github.com/BurntSushi/ripgrep)をダウンロードしていることを確認してください。彼らのGitHubリポジトリの指示に従ってください。コマンド`fzf`と`rg`は、インストールが成功した後に使用できるようになります。

Ripgrepはgrepに似た検索ツールです（その名の通り）。一般的にgrepよりも速く、多くの便利な機能があります。Fzfは一般的なコマンドラインファジーファインダーです。ripgrepを含む任意のコマンドで使用できます。一緒に、強力な検索ツールの組み合わせを作ります。

Fzfはデフォルトでripgrepを使用しないため、`FZF_DEFAULT_COMMAND`変数を定義してfzfにripgrepを使用するように指示する必要があります。私の`.zshrc`（bashを使用している場合は`.bashrc`）には次のように記述しています：

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

`FZF_DEFAULT_OPTS`の`-m`に注意してください。このオプションにより、`<Tab>`または`<Shift-Tab>`で複数の選択を行うことができます。Vimでfzfを機能させるためにこの行は必要ありませんが、便利なオプションだと思います。これは、後で説明する複数のファイルで検索と置換を行いたいときに役立ちます。fzfコマンドはさらに多くのオプションを受け入れますが、ここではカバーしません。詳細については、[fzfのリポジトリ](https://github.com/junegunn/fzf#usage)や`man fzf`を確認してください。少なくとも`export FZF_DEFAULT_COMMAND='rg'`を持っているべきです。

fzfとripgrepをインストールした後、fzfプラグインをセットアップしましょう。この例では[vim-plug](https://github.com/junegunn/vim-plug)プラグインマネージャーを使用していますが、任意のプラグインマネージャーを使用できます。

これらを`.vimrc`プラグイン内に追加してください。`fzf`の作者が作成した[fzf.vim](https://github.com/junegunn/fzf.vim)プラグインを使用する必要があります。

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

これらの行を追加した後、`vim`を開いて`:PlugInstall`を実行する必要があります。これにより、`vimrc`ファイルに定義されていて、インストールされていないすべてのプラグインがインストールされます。この場合、`fzf.vim`と`fzf`がインストールされます。

このプラグインについての詳細は、[fzf.vimリポジトリ](https://github.com/junegunn/fzf/blob/master/README-VIM.md)を確認できます。
## Fzfの構文

fzfを効率的に使用するには、基本的なfzfの構文を学ぶ必要があります。幸い、リストは短いです：

- `^` は接頭辞の完全一致です。「welcome」で始まるフレーズを検索するには： `^welcome`。
- `$` は接尾辞の完全一致です。「my friends」で終わるフレーズを検索するには： `friends$`。
- `'` は完全一致です。「welcome my friends」というフレーズを検索するには： `'welcome my friends`。
- `|` は「または」の一致です。「friends」または「foes」を検索するには： `friends | foes`。
- `!` は逆一致です。「welcome」を含み「friends」を含まないフレーズを検索するには： `welcome !friends`。

これらのオプションを組み合わせることができます。例えば、 `^hello | ^welcome friends$` は「welcome」または「hello」で始まり「friends」で終わるフレーズを検索します。

## ファイルの検索

fzf.vimプラグインを使用してVim内でファイルを検索するには、 `:Files` メソッドを使用します。Vimから `:Files` を実行すると、fzf検索プロンプトが表示されます。

このコマンドを頻繁に使用するため、キーボードショートカットにマッピングするのが良いでしょう。私は `Ctrl-f` にマッピングしています。私のvimrcには次のように記述しています：

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## ファイル内の検索

ファイル内を検索するには、 `:Rg` コマンドを使用します。

再度、これを頻繁に使用すると思われるので、キーボードショートカットにマッピングしましょう。私は `<Leader>f` にマッピングしています。 `<Leader>` キーはデフォルトで `\` にマッピングされています。

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## その他の検索

Fzf.vimは他にも多くの検索コマンドを提供しています。ここでそれぞれを説明することはしませんが、[こちら](https://github.com/junegunn/fzf.vim#commands)で確認できます。

私のfzfマッピングは次のようになっています：

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## GrepをRgに置き換える

前述のように、Vimにはファイル内を検索するための2つの方法があります： `:vim` と `:grep`。 `:grep` は外部検索ツールを使用し、 `grepprg` キーワードを使用して再割り当てできます。 `:grep` コマンドを実行する際に、Vimがripgrepを使用するように設定する方法を示します。

では、 `grepprg` を設定して、 `:grep` Vimコマンドがripgrepを使用するようにしましょう。これをvimrcに追加します：

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

上記のオプションを自由に変更してください！上記のオプションの意味については、 `man rg` を確認してください。

`grepprg`を更新した後、 `:grep` を実行すると、 `grep` の代わりに `rg --vimgrep --smart-case --follow` が実行されます。「donut」をripgrepを使用して検索したい場合、 `:grep "donut"` というより簡潔なコマンドを実行できます。

古い `:grep` と同様に、この新しい `:grep` もクイックフィックスを使用して結果を表示します。

「これは良いけれど、私はVimで `:grep` を使ったことがないし、ファイル内のフレーズを見つけるために `:Rg` を使えばいいのでは？ いつ `:grep` を使う必要があるのか？」と思うかもしれません。

それは非常に良い質問です。複数のファイルで検索と置換を行うためにVimで `:grep` を使用する必要があるかもしれません。次にそれについて説明します。

## 複数ファイルでの検索と置換

VSCodeのような現代的なテキストエディタは、複数のファイルにわたって文字列を検索して置換するのを非常に簡単にします。このセクションでは、Vimでそれを簡単に行うための2つの異なる方法を示します。

最初の方法は、プロジェクト内の*すべての*一致するフレーズを置換することです。 `:grep` を使用する必要があります。「pizza」を「donut」に置換したい場合、次のようにします：

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

コマンドを分解してみましょう：

1. `:grep pizza` はripgrepを使用して「pizza」のすべてのインスタンスを検索します（ちなみに、 `grepprg` をripgrepに再割り当てしなくてもこれが機能します。 `:grep "pizza" . -R` を実行する必要があります）。
2. `:cfdo` は、クイックフィックスリスト内のすべてのファイルに対して渡したコマンドを実行します。この場合、コマンドは置換コマンド `%s/pizza/donut/g` です。パイプ（ `|` ）はチェーンオペレーターです。 `update` コマンドは、置換後に各ファイルを保存します。置換コマンドについては、後の章で詳しく説明します。

2番目の方法は、選択したファイル内で検索と置換を行うことです。この方法では、手動でどのファイルに対して選択と置換を行うかを選択できます。次のようにします：

1. まず、バッファをクリアします。バッファリストには、置換を適用したいファイルのみが含まれていることが重要です。Vimを再起動するか、 `:%bd | e#` コマンドを実行します（ `%bd` はすべてのバッファを削除し、 `e#` は直前に開いていたファイルを開きます）。
2. `:Files` を実行します。
3. 検索と置換を実行したいすべてのファイルを選択します。複数のファイルを選択するには、 `<Tab>` / `<Shift-Tab>` を使用します。これは、 `FZF_DEFAULT_OPTS` に複数フラグ（ `-m` ）がある場合のみ可能です。
4. `:bufdo %s/pizza/donut/g | update` を実行します。コマンド `:bufdo %s/pizza/donut/g | update` は、以前の `:cfdo %s/pizza/donut/g | update` コマンドに似ています。違いは、すべてのクイックフィックスエントリ（ `:cfdo` ）を置換するのではなく、すべてのバッファエントリ（ `:bufdo` ）を置換することです。

## スマートな方法で検索を学ぶ

検索はテキスト編集の基本です。Vimでうまく検索する方法を学ぶことで、テキスト編集のワークフローが大幅に改善されます。

Fzf.vimはゲームチェンジャーです。私はそれなしでVimを使うことは想像できません。Vimを始めるときに良い検索ツールを持つことは非常に重要だと思います。私は、現代のテキストエディタが持つような簡単で強力な検索機能が欠けているために、Vimへの移行に苦労している人々を見てきました。この章がVimへの移行を容易にする手助けになることを願っています。

あなたはまた、プラグインと外部プログラムを使用して検索機能を拡張するVimの拡張性を実際に目にしました。将来的には、Vimをどのような他の機能で拡張したいかを考えてみてください。おそらく、それはすでにVimに存在するか、誰かがプラグインを作成したか、すでにプログラムが存在します。次に、Vimの非常に重要なトピックについて学びます：Vimの文法。