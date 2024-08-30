---
description: この章では、Vimの設定ファイル（vimrc）の整理と構成方法について学びます。Vimがvimrcを見つける方法も解説します。
title: Ch22. Vimrc
---

前の章では、Vimの使い方を学びました。この章では、vimrcの整理と設定方法を学びます。

## VimがVimrcを見つける方法

vimrcに関する一般的な知識は、ホームディレクトリに`.vimrc`というドットファイルを追加することです `~/.vimrc`（OSによって異なる場合があります）。

裏では、Vimはvimrcファイルを探すために複数の場所を確認します。Vimがチェックする場所は以下の通りです：
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Vimを起動すると、上記の6つの場所をその順番でvimrcファイルを探します。最初に見つかったvimrcファイルが使用され、残りは無視されます。

まず、Vimは`$VIMINIT`を探します。そこに何もなければ、Vimは`$HOME/.vimrc`を確認します。さらに何もなければ、Vimは`$HOME/.vim/vimrc`を確認します。Vimが見つけた場合、探すのを止めて`$HOME/.vim/vimrc`を使用します。

最初の場所である`$VIMINIT`は環境変数です。デフォルトでは未定義です。`~/dotfiles/testvimrc`を`$VIMINIT`の値として使用したい場合は、そのvimrcのパスを含む環境変数を作成できます。`export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`を実行すると、Vimは`~/dotfiles/testvimrc`をvimrcファイルとして使用します。

2番目の場所である`$HOME/.vimrc`は、多くのVimユーザーにとって一般的なパスです。`$HOME`は多くの場合、あなたのホームディレクトリ（`~`）です。`~/.vimrc`ファイルがある場合、Vimはこれをvimrcファイルとして使用します。

3番目の`$HOME/.vim/vimrc`は、`~/.vim`ディレクトリの中にあります。プラグイン、カスタムスクリプト、またはViewファイルのために`~/.vim`ディレクトリをすでに持っているかもしれません。vimrcファイル名にはドットがないことに注意してください（`$HOME/.vim/.vimrc`は機能しませんが、`$HOME/.vim/vimrc`は機能します）。

4番目の`$EXINIT`は`$VIMINIT`と似たように機能します。

5番目の`$HOME/.exrc`は`$HOME/.vimrc`と似たように機能します。

6番目の`$VIMRUNTIME/defaults.vim`は、Vimビルドに付属するデフォルトのvimrcです。私の場合、Homebrewを使用してVim 8.2をインストールしているので、私のパスは（`/usr/local/share/vim/vim82`）です。Vimが前述の6つのvimrcファイルのいずれも見つけられない場合、これを使用します。

この章の残りでは、vimrcが`~/.vimrc`パスを使用していると仮定します。

## 私のVimrcに何を入れるべきか？

私が始めたときに自問した質問は、「私のvimrcに何を入れるべきか？」でした。

答えは「あなたが望むものは何でも」です。他の人のvimrcをコピー＆ペーストしたくなる誘惑は本物ですが、あなたはそれに抵抗すべきです。誰かのvimrcを使用することを強く望む場合は、それが何をするのか、なぜ、どのように彼/彼女がそれを使用するのか、そして最も重要なことに、それがあなたに関連しているかどうかを理解していることを確認してください。誰かがそれを使用しているからといって、あなたもそれを使用するとは限りません。

## 基本的なVimrcの内容

要するに、vimrcは以下のコレクションです：
- プラグイン
- 設定
- カスタム関数
- カスタムコマンド
- マッピング

上記に挙げられていない他のこともありますが、一般的にはこれがほとんどの使用ケースをカバーしています。

### プラグイン

前の章で、[fzf.vim](https://github.com/junegunn/fzf.vim)、[vim-mundo](https://github.com/simnalamburt/vim-mundo)、および[vim-fugitive](https://github.com/tpope/vim-fugitive)のようなさまざまなプラグインについて言及しました。

10年前、プラグインの管理は悪夢でした。しかし、現代のプラグインマネージャーの台頭により、プラグインのインストールは数秒で行えるようになりました。私は現在、[vim-plug](https://github.com/junegunn/vim-plug)をプラグインマネージャーとして使用しているので、このセクションではそれを使用します。他の人気のあるプラグインマネージャーでも概念は似ています。以下のようなさまざまなものをチェックすることを強くお勧めします：
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

上記に挙げたプラグインマネージャー以外にも多くのプラグインマネージャーがありますので、自由に探してみてください。vim-plugをインストールするには、Unixマシンがある場合、次のコマンドを実行します：

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

新しいプラグインを追加するには、プラグイン名（`Plug 'github-username/repository-name'`）を`call plug#begin()`と`call plug#end()`の行の間に置きます。したがって、`emmet-vim`と`nerdtree`をインストールしたい場合は、vimrcに次のスニペットを追加します：

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

変更を保存し、ソースを取得（`:source %`）し、`:PlugInstall`を実行してインストールします。

将来的に未使用のプラグインを削除する必要がある場合は、`call`ブロックからプラグイン名を削除し、保存してソースを取得し、`:PlugClean`コマンドを実行してマシンから削除するだけです。

Vim 8には独自の組み込みパッケージマネージャーがあります。詳細については`:h packages`を確認してください。次の章では、これを使用する方法を示します。

### 設定

どのvimrcでも多くの`set`オプションを見るのは一般的です。コマンドラインモードからsetコマンドを実行すると、それは永続的ではありません。Vimを閉じると失われます。たとえば、Vimを実行するたびにコマンドラインモードから`:set relativenumber number`を実行する代わりに、これをvimrcに入れることができます：

```shell
set relativenumber number
```

一部の設定では、値を渡す必要があります。たとえば、`set tabstop=2`のようにです。各設定が受け入れる値の種類を学ぶには、ヘルプページを確認してください。

`set`の代わりに`let`を使用することもできます（`&`で前置することを確認してください）。`let`を使用すると、値として式を使用できます。たとえば、パスが存在する場合のみ`'dictionary'`オプションを設定するには：

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Vimscriptの代入と条件文については、後の章で学びます。

Vimで利用可能なすべてのオプションのリストについては、`:h E355`を確認してください。

### カスタム関数

Vimrcはカスタム関数に適した場所です。独自のVimscript関数の書き方については、後の章で学びます。

### カスタムコマンド

`command`を使用してカスタムコマンドラインコマンドを作成できます。

今日の日付を表示する基本的なコマンド`GimmeDate`を作成するには：

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

`:GimmeDate`を実行すると、Vimは「2021-01-1」のような日付を表示します。

入力を伴う基本的なコマンドを作成するには、`<args>`を使用できます。特定の時間/日付形式を`GimmeDate`に渡したい場合：

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

引数の数を制限したい場合は、`-nargs`フラグを渡すことができます。引数を渡さないには`-nargs=0`、1つの引数を渡すには`-nargs=1`、少なくとも1つの引数を渡すには`-nargs=+`、任意の数の引数を渡すには`-nargs=*`、0または1つの引数を渡すには`-nargs=?`を使用します。n番目の引数を渡したい場合は、`-nargs=n`（ここで`n`は任意の整数）を使用します。

`<args>`には2つのバリアントがあります：`<f-args>`と`<q-args>`。前者はVimscript関数に引数を渡すために使用され、後者はユーザー入力を自動的に文字列に変換するために使用されます。

`args`を使用する場合：

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" returns 'Hello Iggy'

:Hello Iggy
" Undefined variable error
```

`q-args`を使用する場合：

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" returns 'Hello Iggy'
```

`f-args`を使用する場合：

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" returns "Hello Iggy1 and Iggy2"
```

上記の関数は、Vimscript関数の章に進むとより理解できるようになります。

コマンドと引数について詳しく学ぶには、`:h command`と`:args`を確認してください。
### マップ

同じ複雑なタスクを繰り返し実行している場合、それに対してマッピングを作成すべき良い指標です。

例えば、私のvimrcには次の2つのマッピングがあります：

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

最初のマッピングでは、`Ctrl-F`を[fzf.vim](https://github.com/junegunn/fzf.vim)プラグインの`:Gfiles`コマンド（Gitファイルを迅速に検索）にマッピングしています。2つ目では、`<Leader>tn`をカスタム関数`ToggleNumber`を呼び出すようにマッピングしています（`norelativenumber`と`relativenumber`オプションを切り替えます）。`Ctrl-F`のマッピングはVimのネイティブなページスクロールを上書きします。マッピングが衝突する場合、あなたのマッピングはVimのコントロールを上書きします。私はその機能をほとんど使わないので、上書きするのは安全だと判断しました。

ところで、`<Leader>tn`の「リーダー」キーとは何ですか？

Vimにはマッピングを助けるためのリーダーキーがあります。例えば、私は`<Leader>tn`を`ToggleNumber()`関数を実行するようにマッピングしました。リーダーキーがなければ、`tn`を使用することになりますが、Vimにはすでに`t`（「till」検索ナビゲーション）が存在します。リーダーキーを使うことで、既存のコマンドに干渉することなく、リーダーとして割り当てられたキーを押してから`tn`を押すことができます。リーダーキーは、マッピングコンボを開始するために設定できるキーです。デフォルトでは、Vimはバックスラッシュをリーダーキーとして使用します（したがって、`<Leader>tn`は「バックスラッシュ-t-n」になります）。

私は個人的に、デフォルトのバックスラッシュの代わりに`<Space>`をリーダーキーとして使用するのが好きです。リーダーキーを変更するには、vimrcに次のように追加します：

```shell
let mapleader = "\<space>"
```

上記で使用した`nnoremap`コマンドは3つの部分に分解できます：
- `n`はノーマルモードを表します。
- `nore`は非再帰的を意味します。
- `map`はマップコマンドです。

最小限、`nnoremap`の代わりに`nmap`を使用することもできます（`nmap <silent> <C-f> :Gfiles<CR>`）。ただし、潜在的な無限ループを避けるために、非再帰的なバリアントを使用することが良い習慣です。

非再帰的にマッピングしないとどうなるかというと、例えば`B`にマッピングを追加して行の末尾にセミコロンを追加し、その後1単語戻るとします（`B`はVimのノーマルモードのナビゲーションキーで1単語戻ることを思い出してください）。

```shell
nmap B A;<esc>B
```

`B`を押すと…ああ、ダメだ！Vimは制御不能に`;`を追加します（`Ctrl-C`で中断してください）。なぜそうなったのでしょうか？マッピング`A;<esc>B`では、`B`はVimのネイティブな`B`機能（1単語戻る）を指しているのではなく、マッピングされた関数を指しています。実際にあるのはこれです：

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

この問題を解決するには、非再帰的なマップを追加する必要があります：

```shell
nnoremap B A;<esc>B
```

もう一度`B`を呼び出してみてください。今度は行の末尾に`；`が正常に追加され、1単語戻ります。このマッピングの`B`はVimの元の`B`機能を表しています。

Vimには異なるモード用の異なるマップがあります。挿入モード用のマップを作成して、`jk`を押すと挿入モードを終了する場合：

```shell
inoremap jk <esc>
```

他のマップモードは：`map`（ノーマル、ビジュアル、選択、オペレータ待機）、`vmap`（ビジュアルと選択）、`smap`（選択）、`xmap`（ビジュアル）、`omap`（オペレータ待機）、`map!`（挿入とコマンドライン）、`lmap`（挿入、コマンドライン、Lang-arg）、`cmap`（コマンドライン）、`tmap`（ターミナルジョブ）です。詳細には触れません。もっと学びたい場合は、`:h map.txt`を参照してください。

最も直感的で、一貫性があり、覚えやすいマップを作成してください。

## Vimrcの整理

時間が経つにつれて、あなたのvimrcは大きくなり、複雑になります。vimrcをきれいに保つ方法は2つあります：
- vimrcを複数のファイルに分割する。
- vimrcファイルを折りたたむ。

### Vimrcの分割

Vimの`source`コマンドを使用してvimrcを複数のファイルに分割できます。このコマンドは、指定されたファイル引数からコマンドラインコマンドを読み取ります。

`~/.vim`ディレクトリ内にファイルを作成し、`/settings`（`~/.vim/settings`）と名付けましょう。名前自体は任意で、好きな名前を付けることができます。

これを4つのコンポーネントに分割します：
- サードパーティプラグイン（`~/.vim/settings/plugins.vim`）。
- 一般設定（`~/.vim/settings/configs.vim`）。
- カスタム関数（`~/.vim/settings/functions.vim`）。
- キーマッピング（`~/.vim/settings/mappings.vim`）。

`~/.vimrc`内：

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

これらのファイルは、パスの下にカーソルを置いて`gf`を押すことで編集できます。

`~/.vim/settings/plugins.vim`内：

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

`~/.vim/settings/configs.vim`内：

```shell
set nocompatible
set relativenumber
set number
```

`~/.vim/settings/functions.vim`内：

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

`~/.vim/settings/mappings.vim`内：

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

あなたのvimrcは通常通り動作しますが、今ではわずか4行です！

この設定により、どこに行くべきかを簡単に知ることができます。さらにマッピングを追加する必要がある場合は、`/mappings.vim`ファイルに追加してください。将来的には、vimrcが成長するにつれて、さらに多くのディレクトリを追加できます。例えば、カラースキームの設定を作成する必要がある場合、`~/.vim/settings/themes.vim`を追加できます。

### 1つのVimrcファイルを保持する

ポータブルに保つために1つのvimrcファイルを保持したい場合、マーカーフォールドを使用して整理できます。vimrcの先頭にこれを追加します：

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vimは現在のバッファがどのようなファイルタイプであるかを検出できます（`:set filetype?`）。それが`vim`ファイルタイプであれば、マーカーフォールドメソッドを使用できます。マーカーフォールドは、開始と終了のフォールドを示すために`{{{`と`}}}`を使用します。

残りのvimrcに`{{{`と`}}}`のフォールドを追加します（`"`でコメントするのを忘れないでください）：

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

あなたのvimrcは次のようになります：

```shell
+-- 6行: setup folds -----

+-- 6行: plugins ---------

+-- 5行: configs ---------

+-- 9行: functions -------

+-- 5行: mappings --------
```

## Vimをvimrcとプラグインなしで実行する

vimrcとプラグインの両方なしでVimを実行する必要がある場合は、次のように実行します：

```shell
vim -u NONE
```

vimrcなしでプラグインありでVimを起動する必要がある場合は、次のように実行します：

```shell
vim -u NORC
```

vimrcありでプラグインなしでVimを実行する必要がある場合は、次のように実行します：

```shell
vim --noplugin
```

異なるvimrc、例えば`~/.vimrc-backup`でVimを実行する必要がある場合は、次のように実行します：

```shell
vim -u ~/.vimrc-backup
```

`defaults.vim`のみでプラグインなしでVimを実行する必要がある場合、これは壊れたvimrcを修正するのに役立ちます：

```shell
vim --clean
```

## スマートな方法でVimrcを設定する

vimrcはVimのカスタマイズの重要な要素です。vimrcを構築する良い方法は、他の人のvimrcを読み、徐々に構築していくことです。最高のvimrcは、開発者Xが使用しているものではなく、あなたの思考フレームワークと編集スタイルに正確に合わせたものです。