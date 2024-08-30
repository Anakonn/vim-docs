---
description: VimとGitの統合方法を学び、diffコマンドを使用してファイルの違いを確認する方法を紹介します。
title: Ch18. Git
---

Vimとgitは異なる目的のための2つの優れたツールです。Gitはバージョン管理ツールであり、Vimはテキストエディタです。

この章では、Vimとgitを統合するさまざまな方法を学びます。

## Diffing

前の章を思い出してください。複数のファイル間の違いを表示するために`vimdiff`コマンドを実行できます。

`file1.txt`と`file2.txt`という2つのファイルがあるとします。

`file1.txt`の中身：

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

`file2.txt`の中身：

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

両方のファイルの違いを確認するには、次のコマンドを実行します：

```shell
vimdiff file1.txt file2.txt
```

または、次のように実行することもできます：

```shell
vim -d file1.txt file2.txt
```

`vimdiff`は2つのバッファを横に並べて表示します。左側が`file1.txt`、右側が`file2.txt`です。最初の違い（applesとoranges）が両方の行で強調表示されます。

2番目のバッファにorangesではなくapplesを持たせたいとします。現在の位置（`file1.txt`にいる）から`file2.txt`に内容を転送するには、まず`]c`で次のdiffに移動します（前のdiffウィンドウにジャンプするには`[c`を使用します）。カーソルは現在applesの上にあるはずです。`:diffput`を実行します。両方のファイルにapplesが追加されるはずです。

他のバッファ（orange juice、`file2.txt`）から現在のバッファ（apple juice、`file1.txt`）のテキストを置き換える必要がある場合、カーソルがまだ`file1.txt`ウィンドウにある状態で、まず`]c`で次のdiffに移動します。カーソルは現在apple juiceの上にあるはずです。`:diffget`を実行して、他のバッファからorange juiceを取得し、私たちのバッファのapple juiceを置き換えます。

`:diffput`は現在のバッファから他のバッファにテキストを*出力*します。`:diffget`は他のバッファから現在のバッファにテキストを*取得*します。

複数のバッファがある場合、`:diffput fileN.txt`や`:diffget fileN.txt`を実行してfileNバッファをターゲットにできます。

## Vim As a Merge Tool

> "マージコンフリクトを解決するのが大好きです！" - 誰も

マージコンフリクトを解決するのが好きな人を知りません。しかし、それは避けられません。このセクションでは、Vimをマージコンフリクト解決ツールとして活用する方法を学びます。

まず、デフォルトのマージツールを`vimdiff`に変更するには、次のコマンドを実行します：

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

または、`~/.gitconfig`を直接修正することもできます（デフォルトではルートにあるはずですが、あなたのものは異なる場所にあるかもしれません）。上記のコマンドは、まだ実行していない場合、あなたのgitconfigを以下の設定のように変更するはずです。手動でgitconfigを編集することもできます。

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

これをテストするために、偽のマージコンフリクトを作成しましょう。`/food`というディレクトリを作成し、gitリポジトリにします：

```shell
git init
```

`breakfast.txt`というファイルを追加します。その中身は：

```shell
pancakes
waffles
oranges
```

ファイルを追加してコミットします：

```shell
git add .
git commit -m "Initial breakfast commit"
```

次に、新しいブランチを作成し、applesブランチと呼びます：

```shell
git checkout -b apples
```

`breakfast.txt`を変更します：

```shell
pancakes
waffles
apples
```

ファイルを保存し、変更を追加してコミットします：

```shell
git add .
git commit -m "Apples not oranges"
```

素晴らしい。これで、masterブランチにはorangesがあり、applesブランチにはapplesがあります。masterブランチに戻りましょう：

```shell
git checkout master
```

`breakfast.txt`の中には、ベースのテキストであるorangesが表示されるはずです。これを現在の季節にあるgrapesに変更しましょう：

```shell
pancakes
waffles
grapes
```

保存して、追加してコミットします：

```shell
git add .
git commit -m "Grapes not oranges"
```

これで、applesブランチをmasterブランチにマージする準備が整いました：

```shell
git merge apples
```

エラーが表示されるはずです：

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

コンフリクト、素晴らしい！新しく設定した`mergetool`を使用してコンフリクトを解決しましょう。次のコマンドを実行します：

```shell
git mergetool
```

Vimは4つのウィンドウを表示します。上の3つに注意してください：

- `LOCAL`には`grapes`が含まれています。これは「ローカル」の変更で、マージ先のものです。
- `BASE`には`oranges`が含まれています。これは`LOCAL`と`REMOTE`の共通の祖先で、どのように分岐したかを比較します。
- `REMOTE`には`apples`が含まれています。これはマージされるものです。

下の4つ目のウィンドウには次のように表示されます：

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

4つ目のウィンドウにはマージコンフリクトのテキストが含まれています。この設定では、各環境がどのような変更を持っているかを確認しやすくなります。`LOCAL`、`BASE`、`REMOTE`の内容を同時に見ることができます。

カーソルは4つ目のウィンドウの強調表示された部分にあるはずです。`LOCAL`（grapes）から変更を取得するには、`:diffget LOCAL`を実行します。`BASE`（oranges）から変更を取得するには、`:diffget BASE`を実行し、`REMOTE`（apples）から変更を取得するには、`:diffget REMOTE`を実行します。

この場合、`LOCAL`から変更を取得しましょう。`:diffget LOCAL`を実行します。4つ目のウィンドウにはgrapesが表示されるようになります。作業が完了したら、すべてのファイルを保存して終了します（`:wqall`）。それほど悪くはなかったでしょう？

注意してください、今は`breakfast.txt.orig`というファイルもあります。Gitは、うまくいかない場合に備えてバックアップファイルを作成します。マージ中にgitがバックアップを作成しないようにするには、次のコマンドを実行します：

```shell
git config --global mergetool.keepBackup false
```

## Git Inside Vim

Vimにはネイティブのgit機能は組み込まれていません。Vimからgitコマンドを実行する1つの方法は、コマンドラインモードでバングオペレーター`!`を使用することです。

任意のgitコマンドは`!`を使って実行できます：

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Vimの`%`（現在のバッファ）や`#`（他のバッファ）を使った書き方もできます：

```shell
:!git add %         " 現在のファイルをgit add
:!git checkout #    " 他のファイルをgit checkout
```

異なるVimウィンドウで複数のファイルを追加するためのトリックとして、次のコマンドを実行できます：

```shell
:windo !git add %
```

その後、コミットします：

```shell
:!git commit "Just git-added everything in my Vim window, cool"
```

`windo`コマンドはVimの「do」コマンドの1つで、以前に見た`argdo`に似ています。`windo`は各ウィンドウでコマンドを実行します。

また、`bufdo !git add %`を使用してすべてのバッファをgit addしたり、`argdo !git add %`を使用してすべてのファイル引数をgit addしたりすることもできます。これはあなたのワークフローによります。

## Plugins

gitサポートのための多くのVimプラグインがあります。以下はVimの人気のあるgit関連プラグインのリストです（あなたがこれを読む時点でさらに多くあるかもしれません）：

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

最も人気のあるものの1つはvim-fugitiveです。この章の残りでは、このプラグインを使用したいくつかのgitワークフローについて説明します。

## Vim-fugitive

vim-fugitiveプラグインを使用すると、Vimエディタを離れることなくgit CLIを実行できます。いくつかのコマンドはVim内で実行する方が良いことがわかるでしょう。

まず、Vimプラグインマネージャー（[vim-plug](https://github.com/junegunn/vim-plug)、[vundle](https://github.com/VundleVim/Vundle.vim)、[dein.vim](https://github.com/Shougo/dein.vim)など）を使用してvim-fugitiveをインストールします。

## Git Status

`:Git`コマンドをパラメータなしで実行すると、vim-fugitiveはgitサマリーウィンドウを表示します。未追跡、未ステージ、ステージされたファイルが表示されます。この「`git status`」モードでは、いくつかのことができます：
- `Ctrl-N` / `Ctrl-P`でファイルリストを上下に移動します。
- `-`でカーソルの下にあるファイル名をステージまたはアンステージします。
- `s`でカーソルの下にあるファイル名をステージします。
- `u`でカーソルの下にあるファイル名をアンステージします。
- `>` / `<`でカーソルの下にあるファイル名のインラインdiffを表示または非表示にします。

詳細については、`:h fugitive-staging-maps`を確認してください。

## Git Blame

現在のファイルから`:Git blame`コマンドを実行すると、vim-fugitiveは分割されたblameウィンドウを表示します。これは、そのバグのあるコード行を書いた責任者を見つけるのに役立ちます（冗談です）。

この「`git blame`」モードでできること：
- `q`でblameウィンドウを閉じます。
- `A`で著者列のサイズを変更します。
- `C`でコミット列のサイズを変更します。
- `D`で日付/時間列のサイズを変更します。

詳細については、`:h :Git_blame`を確認してください。

## Gdiffsplit

`:Gdiffsplit`コマンドを実行すると、vim-fugitiveは現在のファイルの最新の変更をインデックスまたは作業ツリーと比較して`vimdiff`を実行します。`:Gdiffsplit <commit>`を実行すると、vim-fugitiveはその`<commit>`内のファイルに対して`vimdiff`を実行します。

`vimdiff`モードにいるため、`:diffput`や`:diffget`を使用してdiffを*取得*または*出力*できます。

## Gwrite and Gread

ファイルで変更を加えた後、`:Gwrite`コマンドを実行すると、vim-fugitiveは変更をステージします。これは`git add <current-file>`を実行するのと同じです。

ファイルで変更を加えた後、`:Gread`コマンドを実行すると、vim-fugitiveはファイルを変更前の状態に戻します。これは`git checkout <current-file>`を実行するのと同じです。`:Gread`を実行する利点の1つは、このアクションが元に戻せることです。`:Gread`を実行した後に気が変わって古い変更を保持したい場合は、単に元に戻す（`u`）を実行すれば、Vimは`:Gread`アクションを元に戻します。これはCLIから`git checkout <current-file>`を実行した場合には不可能でした。

## Gclog

`:Gclog`コマンドを実行すると、vim-fugitiveはコミット履歴を表示します。これは`git log`コマンドを実行するのと同じです。vim-fugitiveはVimのクイックフィックスを使用してこれを実現しているため、`:cnext`や`:cprevious`を使用して次または前のログ情報に移動できます。`:copen`と`:cclose`でログリストを開いたり閉じたりできます。

この「`git log`」モードでは、次の2つのことができます：
- ツリーを表示します。
- 親（前のコミット）を訪れます。

`:Gclog`には、`git log`コマンドと同様に引数を渡すことができます。プロジェクトに長いコミット履歴があり、最後の3つのコミットだけを表示したい場合は、`:Gclog -3`を実行できます。コミッターの日付に基づいてフィルタリングする必要がある場合は、`:Gclog --after="January 1" --before="March 14"`のように実行できます。

## More Vim-fugitive

これらはvim-fugitiveができることのほんの一例です。vim-fugitiveについてもっと学ぶには、`:h fugitive.txt`を確認してください。人気のあるgitコマンドのほとんどは、vim-fugitiveで最適化されている可能性があります。ドキュメントでそれらを探すだけです。

vim-fugitiveの「特別モード」（たとえば、`:Git`や`:Git blame`モード）にいる場合、使用可能なショートカットを学びたい場合は、`g?`を押してください。vim-fugitiveは、現在いるモードに適した`:help`ウィンドウを表示します。素晴らしいですね！
## VimとGitをスマートに学ぶ

vim-fugitiveはあなたのワークフローに良い補完となるかもしれません（そうでないかもしれません）。それに関わらず、上記にリストされたすべてのプラグインをチェックすることを強くお勧めします。私がリストしなかった他のプラグインもおそらくあります。ぜひ試してみてください。

VimとGitの統合を改善する明白な方法の一つは、Gitについてもっと読むことです。Git自体は広範なトピックであり、私はその一部しか示していません。それでは、*git going*（ダジャレをお許しください）して、Vimを使ってコードをコンパイルする方法について話しましょう！