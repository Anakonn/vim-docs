---
description: Este capítulo ensina como integrar o Vim e o Git, focando em como usar
  o `vimdiff` para comparar e editar arquivos de forma eficiente.
title: Ch18. Git
---

Vim e git são duas ótimas ferramentas para duas coisas diferentes. Git é uma ferramenta de controle de versão. Vim é um editor de texto.

Neste capítulo, você aprenderá diferentes maneiras de integrar o Vim e o git juntos.

## Diferenças

Lembre-se do capítulo anterior, você pode executar um comando `vimdiff` para mostrar as diferenças entre vários arquivos.

Suponha que você tenha dois arquivos, `file1.txt` e `file2.txt`.

Dentro de `file1.txt`:

```shell
panquecas
waffles
maçãs

leite
suco de maçã

iogurte
```

Dentro de `file2.txt`:

```shell
panquecas
waffles
laranjas

leite
suco de laranja

iogurte
```

Para ver as diferenças entre os dois arquivos, execute:

```shell
vimdiff file1.txt file2.txt
```

Alternativamente, você poderia executar:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` exibe dois buffers lado a lado. À esquerda está `file1.txt` e à direita está `file2.txt`. As primeiras diferenças (maçãs e laranjas) são destacadas em ambas as linhas.

Suponha que você queira fazer com que o segundo buffer tenha maçãs, não laranjas. Para transferir o conteúdo da sua posição atual (você está atualmente em `file1.txt`) para `file2.txt`, primeiro vá para a próxima diferença com `]c` (para pular para a janela de diferença anterior, use `[c`). O cursor deve estar em maçãs agora. Execute `:diffput`. Ambos os arquivos agora devem ter maçãs.

Se você precisar transferir o texto do outro buffer (suco de laranja, `file2.txt`) para substituir o texto no buffer atual (suco de maçã, `file1.txt`), com o cursor ainda na janela `file1.txt`, primeiro vá para a próxima diferença com `]c`. Seu cursor agora deve estar em suco de maçã. Execute `:diffget` para obter o suco de laranja de outro buffer para substituir o suco de maçã em nosso buffer.

`:diffput` *coloca* o texto do buffer atual em outro buffer. `:diffget` *obtém* o texto de outro buffer para o buffer atual.

Se você tiver vários buffers, pode executar `:diffput fileN.txt` e `:diffget fileN.txt` para direcionar o buffer fileN.

## Vim Como uma Ferramenta de Mesclagem

> "Eu adoro resolver conflitos de mesclagem!" - Ninguém

Não conheço ninguém que goste de resolver conflitos de mesclagem. No entanto, eles são inevitáveis. Nesta seção, você aprenderá como aproveitar o Vim como uma ferramenta de resolução de conflitos de mesclagem.

Primeiro, mude a ferramenta de mesclagem padrão para usar `vimdiff` executando:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Alternativamente, você pode modificar o `~/.gitconfig` diretamente (por padrão, deve estar na raiz, mas o seu pode estar em um lugar diferente). Os comandos acima devem modificar seu gitconfig para parecer com a configuração abaixo, se você ainda não os executou, você também pode editar manualmente seu gitconfig.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Vamos criar um conflito de mesclagem falso para testar isso. Crie um diretório `/food` e torne-o um repositório git:

```shell
git init
```

Adicione um arquivo, `breakfast.txt`. Dentro:

```shell
panquecas
waffles
laranjas
```

Adicione o arquivo e faça o commit:

```shell
git add .
git commit -m "Commit inicial do café da manhã"
```

Em seguida, crie um novo branch e chame-o de branch de maçãs:

```shell
git checkout -b apples
```

Altere o `breakfast.txt`:

```shell
panquecas
waffles
maçãs
```

Salve o arquivo, depois adicione e faça o commit da alteração:

```shell
git add .
git commit -m "Maçãs, não laranjas"
```

Ótimo. Agora você tem laranjas no branch master e maçãs no branch de maçãs. Vamos voltar ao branch master:

```shell
git checkout master
```

Dentro de `breakfast.txt`, você deve ver o texto base, laranjas. Vamos mudá-lo para uvas porque estão na estação agora:

```shell
panquecas
waffles
uvas
```

Salve, adicione e faça o commit:

```shell
git add .
git commit -m "Uvas, não laranjas"
```

Agora você está pronto para mesclar o branch de maçãs no branch master:

```shell
git merge apples
```

Você deve ver um erro:

```shell
Mesclando automaticamente breakfast.txt
CONFLITO (conteúdo): Conflito de mesclagem em breakfast.txt
Mesclagem automática falhou; corrija os conflitos e depois faça o commit do resultado.
```

Um conflito, ótimo! Vamos resolver o conflito usando nossa `mergetool` recém-configurada. Execute:

```shell
git mergetool
```

O Vim exibe quatro janelas. Preste atenção nas três superiores:

- `LOCAL` contém `uvas`. Esta é a mudança em "local", o que você está mesclando.
- `BASE` contém `laranjas`. Este é o ancestral comum entre `LOCAL` e `REMOTE` para comparar como eles divergem.
- `REMOTE` contém `maçãs`. Isso é o que está sendo mesclado.

Na parte inferior (a quarta janela) você vê:

```shell
panquecas
waffles
<<<<<<< HEAD
uvas
||||||| db63958
laranjas
=======
maçãs
>>>>>>> apples
```

A quarta janela contém os textos de conflito de mesclagem. Com esta configuração, é mais fácil ver qual mudança cada ambiente tem. Você pode ver o conteúdo de `LOCAL`, `BASE` e `REMOTE` ao mesmo tempo.

Seu cursor deve estar na quarta janela, na área destacada. Para obter a mudança de `LOCAL` (uvas), execute `:diffget LOCAL`. Para obter a mudança de `BASE` (laranjas), execute `:diffget BASE` e para obter a mudança de `REMOTE` (maçãs), execute `:diffget REMOTE`.

Neste caso, vamos obter a mudança de `LOCAL`. Execute `:diffget LOCAL`. A quarta janela agora terá uvas. Salve e saia de todos os arquivos (`:wqall`) quando terminar. Não foi tão ruim, certo?

Se você notar, agora você também tem um arquivo `breakfast.txt.orig`. O Git cria um arquivo de backup caso as coisas não corram bem. Se você não quiser que o git crie um backup durante uma mesclagem, execute:

```shell
git config --global mergetool.keepBackup false
```

## Git Dentro do Vim

O Vim não tem um recurso git nativo embutido. Uma maneira de executar comandos git a partir do Vim é usar o operador bang, `!`, no modo de linha de comando.

Qualquer comando git pode ser executado com `!`:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Você também pode usar as convenções `%` (buffer atual) ou `#` (outro buffer) do Vim:

```shell
:!git add %         " git add arquivo atual
:!git checkout #    " git checkout o outro arquivo
```

Um truque do Vim que você pode usar para adicionar vários arquivos em diferentes janelas do Vim é executar:

```shell
:windo !git add %
```

Depois faça um commit:

```shell
:!git commit "Acabei de adicionar tudo no meu Vim, legal"
```

O comando `windo` é um dos comandos "fazer" do Vim, semelhante ao `argdo` que você viu anteriormente. `windo` executa o comando em cada janela.

Alternativamente, você também pode usar `bufdo !git add %` para git add todos os buffers ou `argdo !git add %` para git add todos os argumentos de arquivo, dependendo do seu fluxo de trabalho.

## Plugins

Existem muitos plugins do Vim para suporte ao git. Abaixo está uma lista de alguns dos plugins relacionados ao git mais populares para o Vim (provavelmente há mais no momento em que você lê isso):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

Um dos mais populares é o vim-fugitive. Para o restante do capítulo, vou abordar vários fluxos de trabalho do git usando este plugin.

## Vim-fugitive

O plugin vim-fugitive permite que você execute o CLI do git sem sair do editor Vim. Você descobrirá que alguns comandos são melhores quando executados de dentro do Vim.

Para começar, instale o vim-fugitive com um gerenciador de plugins do Vim ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim), etc).

## Status do Git

Quando você executa o comando `:Git` sem parâmetros, o vim-fugitive exibe uma janela de resumo do git. Ela mostra os arquivos não rastreados, não preparados e preparados. Enquanto estiver neste modo "`git status`", você pode fazer várias coisas:
- `Ctrl-N` / `Ctrl-P` para subir ou descer na lista de arquivos.
- `-` para preparar ou desmarcar o nome do arquivo sob o cursor.
- `s` para preparar o nome do arquivo sob o cursor.
- `u` para desmarcar o nome do arquivo sob o cursor.
- `>` / `<` para exibir ou ocultar um diff inline do nome do arquivo sob o cursor.

Para mais, confira `:h fugitive-staging-maps`.

## Git Blame

Quando você executa o comando `:Git blame` a partir do arquivo atual, o vim-fugitive exibe uma janela de blame dividida. Isso pode ser útil para encontrar a pessoa responsável por escrever aquela linha de código com erro para que você possa gritar com ele / ela (brincadeira).

Algumas coisas que você pode fazer enquanto estiver neste modo `"git blame"`:
- `q` para fechar a janela de blame.
- `A` para redimensionar a coluna do autor.
- `C` para redimensionar a coluna do commit.
- `D` para redimensionar a coluna de data / hora.

Para mais, confira `:h :Git_blame`.

## Gdiffsplit

Quando você executa o comando `:Gdiffsplit`, o vim-fugitive executa um `vimdiff` das últimas alterações do arquivo atual contra o índice ou árvore de trabalho. Se você executar `:Gdiffsplit <commit>`, o vim-fugitive executa um `vimdiff` contra esse arquivo dentro de `<commit>`.

Como você está em um modo `vimdiff`, você pode *obter* ou *colocar* o diff com `:diffput` e `:diffget`.

## Gwrite e Gread

Quando você executa o comando `:Gwrite` em um arquivo após fazer alterações, o vim-fugitive prepara as alterações. É como executar `git add <arquivo-atual>`.

Quando você executa o comando `:Gread` em um arquivo após fazer alterações, o vim-fugitive restaura o arquivo para o estado anterior às alterações. É como executar `git checkout <arquivo-atual>`. Uma vantagem de executar `:Gread` é que a ação é desfeita. Se, após executar `:Gread`, você mudar de ideia e quiser manter a alteração antiga, você pode simplesmente executar o desfazer (`u`) e o Vim desfará a ação `:Gread`. Isso não teria sido possível se você tivesse executado `git checkout <arquivo-atual>` a partir do CLI.

## Gclog

Quando você executa o comando `:Gclog`, o vim-fugitive exibe o histórico de commits. É como executar o comando `git log`. O vim-fugitive usa o quickfix do Vim para realizar isso, então você pode usar `:cnext` e `:cprevious` para navegar para a próxima ou anterior informação de log. Você pode abrir e fechar a lista de logs com `:copen` e `:cclose`.

Enquanto estiver neste modo `"git log"`, você pode fazer duas coisas:
- Ver a árvore.
- Visitar o pai (o commit anterior).

Você pode passar argumentos para `:Gclog` assim como o comando `git log`. Se seu projeto tiver um longo histórico de commits e você só precisar visualizar os últimos três commits, pode executar `:Gclog -3`. Se precisar filtrá-lo com base na data do autor, pode executar algo como `:Gclog --after="1 de Janeiro" --before="14 de Março"`.

## Mais Vim-fugitive

Esses são apenas alguns exemplos do que o vim-fugitive pode fazer. Para aprender mais sobre o vim-fugitive, confira `:h fugitive.txt`. A maioria dos comandos git populares provavelmente está otimizada com o vim-fugitive. Você só precisa procurá-los na documentação.

Se você estiver dentro de um dos "modos especiais" do vim-fugitive (por exemplo, dentro do modo `:Git` ou `:Git blame`) e quiser aprender quais atalhos estão disponíveis, pressione `g?`. O vim-fugitive exibirá a janela de `:help` apropriada para o modo em que você está. Legal!
## Aprenda Vim e Git da Maneira Inteligente

Você pode achar o vim-fugitive um bom complemento para o seu fluxo de trabalho (ou não). De qualquer forma, eu encorajaria fortemente você a conferir todos os plugins listados acima. Provavelmente há outros que eu não listei. Vá experimentá-los.

Uma maneira óbvia de melhorar a integração do Vim com o Git é ler mais sobre o git. O Git, por si só, é um tópico vasto e eu estou mostrando apenas uma fração dele. Com isso, vamos *começar com o git* (desculpe o trocadilho) e falar sobre como usar o Vim para compilar seu código!