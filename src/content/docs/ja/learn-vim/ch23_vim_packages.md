---
description: Vimの組み込みプラグインマネージャー「パッケージ」を使って、プラグインのインストール方法を学ぶ章です。
title: Ch23. Vim Packages
---

前の章では、外部プラグインマネージャを使用してプラグインをインストールする方法について言及しました。バージョン8以降、Vimには*packages*という独自の組み込みプラグインマネージャが付属しています。この章では、Vimパッケージを使用してプラグインをインストールする方法を学びます。

Vimビルドがパッケージを使用する能力を持っているかどうかを確認するには、`:version`を実行し、`+packages`属性を探します。あるいは、`:echo has('packages')`を実行することもできます（1が返されれば、パッケージ機能があります）。

## パックディレクトリ

ルートパスに`~/.vim/`ディレクトリがあるか確認してください。ない場合は作成します。その中に`pack`というディレクトリを作成します（`~/.vim/pack/`）。Vimは自動的にこのディレクトリ内をパッケージの検索対象とします。

## 2種類のロード

Vimパッケージには、自動ロードと手動ロードの2つのロードメカニズムがあります。

### 自動ロード

Vim起動時にプラグインを自動的にロードするには、`start/`ディレクトリに置く必要があります。パスは次のようになります：

```shell
~/.vim/pack/*/start/
```

ここで、「`*`は`pack/`と`start/`の間に何ですか？」と聞くかもしれません。`*`は任意の名前で、好きな名前にできます。`packdemo/`と名付けてみましょう：

```shell
~/.vim/pack/packdemo/start/
```

`pack/`と`start/`の間に名前を入れずに次のようにすると：

```shell
~/.vim/pack/start/
```

パッケージシステムは機能しません。`pack/`と`start/`の間に名前を入れることが重要です。

このデモでは、[NERDTree](https://github.com/preservim/nerdtree)プラグインをインストールしてみましょう。`start/`ディレクトリに移動します（`cd ~/.vim/pack/packdemo/start/`）そしてNERDTreeリポジトリをクローンします：

```shell
git clone https://github.com/preservim/nerdtree.git
```

これで完了です！次回Vimを起動すると、`:NERDTreeToggle`のようなNERDTreeコマンドをすぐに実行できます。

`~/.vim/pack/*/start/`パス内に好きなだけプラグインリポジトリをクローンできます。Vimは自動的にそれぞれをロードします。クローンしたリポジトリを削除すると（`rm -rf nerdtree/`）、そのプラグインはもう利用できなくなります。

### 手動ロード

Vim起動時にプラグインを手動でロードするには、`opt/`ディレクトリに置く必要があります。自動ロードと同様に、パスは次のようになります：

```shell
~/.vim/pack/*/opt/
```

先ほどの`packdemo/`ディレクトリを使いましょう：

```shell
~/.vim/pack/packdemo/opt/
```

今回は、[killersheep](https://github.com/vim/killersheep)ゲームをインストールします（これはVim 8.2が必要です）。`opt/`ディレクトリに移動します（`cd ~/.vim/pack/packdemo/opt/`）そしてリポジトリをクローンします：

```shell
git clone https://github.com/vim/killersheep.git
```

Vimを起動します。ゲームを実行するコマンドは`:KillKillKill`です。実行してみてください。Vimはそれが有効なエディタコマンドではないと文句を言います。最初にプラグインを*手動*でロードする必要があります。それを行いましょう：

```shell
:packadd killersheep
```

もう一度コマンドを実行してみてください`:KillKillKill`。コマンドは今は機能するはずです。

「なぜ手動でパッケージをロードする必要があるのか？すべてを自動的にロードする方が良くないか？」と思うかもしれません。

良い質問です。時には、KillerSheepゲームのように、常に使用しないプラグインがあります。10個の異なるゲームをロードしてVimの起動時間を遅くする必要はないでしょう。しかし、たまには退屈なときにいくつかのゲームをプレイしたくなるかもしれません。非必須プラグインには手動ロードを使用してください。

これを使用してプラグインを条件付きで追加することもできます。NeovimとVimの両方を使用していて、Neovim向けに最適化されたプラグインがある場合、vimrcに次のように追加できます：

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## パッケージの整理

Vimのパッケージシステムを使用するための要件は、次のいずれかです：

```shell
~/.vim/pack/*/start/
```

または：

```shell
~/.vim/pack/*/opt/
```

`*`が*任意の*名前であることは、パッケージを整理するために使用できます。プラグインをカテゴリ（色、構文、ゲーム）に基づいてグループ化したいとします：

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

各ディレクトリ内で`start/`と`opt/`を使用することもできます。

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## スマートな方法でパッケージを追加する

Vimパッケージがvim-pathogen、vundle.vim、dein.vim、vim-plugのような人気のプラグインマネージャを時代遅れにするかどうか疑問に思うかもしれません。

答えは、常に「それは状況次第です」。

私はまだvim-plugを使用しています。なぜなら、プラグインの追加、削除、更新が簡単だからです。多くのプラグインを使用している場合、同時に多くを更新するのが簡単なので、プラグインマネージャを使用する方が便利かもしれません。一部のプラグインマネージャは非同期機能も提供しています。

ミニマリストであれば、Vimパッケージを試してみてください。重いプラグインユーザーであれば、プラグインマネージャの使用を検討するかもしれません。