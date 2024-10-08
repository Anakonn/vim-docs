---
description: Vimのバッファ、ウィンドウ、タブの使い方を解説します。効率的な編集のための設定方法も紹介しています。
title: Ch02. Buffers, Windows, and Tabs
---

もし以前にモダンなテキストエディタを使用していたなら、ウィンドウとタブに慣れているでしょう。Vimは、2つの代わりに3つの表示抽象を使用します：バッファ、ウィンドウ、タブ。この章では、バッファ、ウィンドウ、タブが何であるか、そしてそれらがVimでどのように機能するかを説明します。

始める前に、vimrcに`set hidden`オプションがあることを確認してください。これがないと、バッファを切り替えるたびに、現在のバッファが保存されていない場合、Vimはファイルを保存するように促します（迅速に移動したい場合は望ましくありません）。まだvimrcについては触れていません。vimrcがない場合は作成してください。通常はホームディレクトリに置かれ、名前は`.vimrc`です。私のは`~/.vimrc`にあります。vimrcを作成する場所を確認するには、`:h vimrc`を参照してください。その中に以下を追加します：

```shell
set hidden
```

保存してから、ソースを実行します（vimrcの中で`:source %`を実行）。

## バッファ

*バッファ*とは何ですか？

バッファは、テキストを書いたり編集したりするためのメモリ内のスペースです。Vimでファイルを開くと、そのデータはバッファにバインドされます。Vimで3つのファイルを開くと、3つのバッファがあります。

2つの空のファイル、`file1.js`と`file2.js`を用意してください（可能であれば、Vimで作成してください）。ターミナルでこれを実行します：

```bash
vim file1.js
```

今見ているのは`file1.js` *バッファ*です。新しいファイルを開くたびに、Vimは新しいバッファを作成します。

Vimを終了します。今度は、2つの新しいファイルを開きます：

```bash
vim file1.js file2.js
```

現在、Vimは`file1.js`バッファを表示していますが、実際には2つのバッファを作成しています：`file1.js`バッファと`file2.js`バッファです。`:buffers`を実行してすべてのバッファを確認します（または、`:ls`や`:files`を使用することもできます）。*両方*の`file1.js`と`file2.js`がリストされているのを見るべきです。`vim file1 file2 file3 ... filen`を実行すると、n個のバッファが作成されます。新しいファイルを開くたびに、Vimはそのファイルのために新しいバッファを作成します。

バッファを移動する方法はいくつかあります：
- `:bnext`で次のバッファに移動します（`:bprevious`で前のバッファに移動）。
- `:buffer` + ファイル名。Vimはファイル名を`<Tab>`で自動補完できます。
- `:buffer` + `n`、ここで`n`はバッファ番号です。例えば、`:buffer 2`と入力すると、バッファ#2に移動します。
- ジャンプリスト内の古い位置に`Ctrl-O`でジャンプし、新しい位置に`Ctrl-I`でジャンプします。これらはバッファ特有の方法ではありませんが、異なるバッファ間をジャンプするために使用できます。ジャンプについては第5章で詳しく説明します。
- 前回編集したバッファに`Ctrl-^`で移動します。

Vimがバッファを作成すると、それはバッファリストに残ります。削除するには、`:bdelete`と入力します。バッファ番号をパラメータとして受け付けることもできます（`:bdelete 3`でバッファ#3を削除）またはファイル名（`:bdelete`の後に`<Tab>`を使用して自動補完）。

バッファについて学ぶ際、私にとって最も難しかったのは、どのように機能するかを視覚化することでした。なぜなら、私の頭は主流のテキストエディタを使用していたときのウィンドウに慣れていたからです。良いアナロジーは、トランプのデッキです。もし私が2つのバッファを持っているなら、2枚のカードの束があります。一番上のカードだけが見えますが、その下にカードがあることはわかっています。`file1.js`バッファが表示されている場合、その`file1.js`カードはデッキの一番上にあります。他のカード、`file2.js`はここには見えませんが、そこにあります。バッファを`file2.js`に切り替えると、その`file2.js`カードは今やデッキの一番上にあり、`file1.js`カードはその下にあります。

Vimを使ったことがない場合、これは新しい概念です。理解するまで時間をかけてください。

## Vimを終了する

ところで、複数のバッファが開いている場合、すべてを閉じるにはquit-allを使用できます：

```shell
:qall
```

変更を保存せずに閉じたい場合は、末尾に`!`を追加します：

```shell
:qall!
```

すべてを保存して終了するには、次を実行します：

```shell
:wqall
```

## ウィンドウ

ウィンドウはバッファのビューポートです。主流のエディタから来た場合、この概念はあなたにとって馴染みがあるかもしれません。ほとんどのテキストエディタは、複数のウィンドウを表示する機能を持っています。Vimでも複数のウィンドウを持つことができます。

ターミナルから再度`file1.js`を開きましょう：

```bash
vim file1.js
```

以前、あなたが`file1.js`バッファを見ていると書きました。それは正しかったですが、その表現は不完全でした。あなたは**ウィンドウ**を通して表示される`file1.js`バッファを見ています。ウィンドウはバッファを表示する方法です。

まだVimを終了しないでください。次を実行します：

```shell
:split file2.js
```

これで、**2つのウィンドウ**を通して2つのバッファを見ています。上のウィンドウは`file2.js`バッファを表示し、下のウィンドウは`file1.js`バッファを表示します。

ウィンドウ間を移動するには、以下のショートカットを使用します：

```shell
Ctrl-W H    左のウィンドウにカーソルを移動
Ctrl-W J    下のウィンドウにカーソルを移動
Ctrl-W K    上のウィンドウにカーソルを移動
Ctrl-W L    右のウィンドウにカーソルを移動
```

次を実行します：

```shell
:vsplit file3.js
```

これで、3つのウィンドウが3つのバッファを表示しています。1つのウィンドウは`file3.js`バッファを表示し、別のウィンドウは`file2.js`バッファを表示し、もう1つのウィンドウは`file1.js`バッファを表示します。

同じバッファを表示する複数のウィンドウを持つことができます。左上のウィンドウにいるとき、次を入力します：

```shell
:buffer file2.js
```

これで、2つのウィンドウが`file2.js`バッファを表示しています。`file2.js`ウィンドウで入力を開始すると、`file2.js`バッファを表示する両方のウィンドウがリアルタイムで更新されるのがわかります。

現在のウィンドウを閉じるには、`Ctrl-W C`を実行するか、`:quit`と入力します。ウィンドウを閉じると、バッファはまだそこにあります（`:buffers`を実行して確認できます）。

以下は、役立つ通常モードのウィンドウコマンドです：

```shell
Ctrl-W V    新しい垂直分割を開く
Ctrl-W S    新しい水平分割を開く
Ctrl-W C    ウィンドウを閉じる
Ctrl-W O    現在のウィンドウを画面上の唯一のウィンドウにし、他のウィンドウを閉じる
```

そして、以下は役立つウィンドウコマンドラインコマンドのリストです：

```shell
:vsplit filename    ウィンドウを垂直に分割
:split filename     ウィンドウを水平に分割
:new filename       新しいウィンドウを作成
```

理解するまで時間をかけてください。詳細については、`:h window`を参照してください。

## タブ

タブはウィンドウのコレクションです。ウィンドウのレイアウトのように考えてください。ほとんどのモダンなテキストエディタ（およびモダンなインターネットブラウザ）では、タブは開いているファイル/ページを意味し、それを閉じるとそのファイル/ページは消えます。Vimでは、タブは開いているファイルを表しません。Vimでタブを閉じると、ファイルを閉じているわけではありません。レイアウトを閉じているだけです。そのレイアウトで開いているファイルはまだ閉じられておらず、バッファ内で開いたままです。

Vimのタブを実際に見てみましょう。`file1.js`を開きます：

```bash
vim file1.js
```

新しいタブで`file2.js`を開くには：

```shell
:tabnew file2.js
```

新しいタブで開きたいファイルをVimに自動補完させることもできます（冗談ではありませんが）`<Tab>`を押すことで。

以下は役立つタブナビゲーションのリストです：

```shell
:tabnew file.txt    file.txtを新しいタブで開く
:tabclose           現在のタブを閉じる
:tabnext            次のタブに移動
:tabprevious        前のタブに移動
:tablast            最後のタブに移動
:tabfirst           最初のタブに移動
```

`gt`を実行して次のタブページに移動することもできます（前のタブには`gT`で移動できます）。`gt`に数を引数として渡すことができ、数はタブ番号です。3番目のタブに移動するには、`3gt`を実行します。

複数のタブを持つ利点の1つは、異なるタブで異なるウィンドウの配置を持つことができることです。たとえば、最初のタブには3つの垂直ウィンドウを持ち、2番目のタブには混合の水平および垂直ウィンドウのレイアウトを持たせたいかもしれません。タブはその仕事に最適なツールです！

複数のタブでVimを起動するには、ターミナルから次のように実行できます：

```bash
vim -p file1.js file2.js file3.js
```

## 3Dでの移動

ウィンドウ間の移動は、デカルト座標のX-Y軸に沿って2次元的に移動するようなものです。`Ctrl-W H/J/K/L`で上、右、下、左のウィンドウに移動できます。

バッファ間の移動は、デカルト座標のZ軸に沿って移動するようなものです。バッファファイルがZ軸に沿って並んでいると想像してください。`:bnext`と`:bprevious`で1つずつZ軸を横断できます。`:buffer filename/buffernumber`でZ軸の任意の座標にジャンプできます。

ウィンドウとバッファの移動を組み合わせることで、*三次元空間*で移動できます。ウィンドウの移動で上、右、下、または左のウィンドウ（X-Yナビゲーション）に移動できます。各ウィンドウにはバッファが含まれているため、バッファの移動で前後（Zナビゲーション）に移動できます。

## バッファ、ウィンドウ、タブを賢く使う

バッファ、ウィンドウ、タブが何であるか、そしてそれらがVimでどのように機能するかを学びました。これらをよりよく理解したので、あなた自身のワークフローで使用できます。

誰もが異なるワークフローを持っています。例えば、私のワークフローは次のようなものです：
- 最初に、バッファを使用して現在のタスクに必要なすべてのファイルを保存します。Vimは、遅くなる前に多くのバッファを開くことができます。さらに、多くのバッファを開いていても、画面が混雑することはありません。私は常に1つのバッファしか見ていないため（1つのウィンドウしかないと仮定）、1つの画面に集中できます。どこかに移動する必要があるときは、いつでも開いているバッファにすぐに飛ぶことができます。
- 複数のウィンドウを使用して、通常はファイルの差分を取ったり、ドキュメントを読んだり、コードのフローを追ったりする際に、複数のバッファを同時に表示します。私の画面が混雑しないように、開いているウィンドウの数を3つ以下に保つようにしています（私は小さなノートパソコンを使用しています）。終わったら、余分なウィンドウを閉じます。ウィンドウが少ないほど、気が散ることが少なくなります。
- タブの代わりに、[tmux](https://github.com/tmux/tmux/wiki)ウィンドウを使用します。通常、私は複数のtmuxウィンドウを同時に使用します。例えば、クライアントサイドのコード用の1つのtmuxウィンドウと、バックエンドコード用の別のウィンドウです。

私のワークフローは、あなたの編集スタイルに基づいて異なるかもしれませんが、それは問題ありません。自分のコーディングスタイルに合った自分自身の流れを発見するために、実験してみてください。