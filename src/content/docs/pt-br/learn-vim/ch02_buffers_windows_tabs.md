---
description: Este documento explica os conceitos de buffers, janelas e abas no Vim,
  além de como configurar o arquivo vimrc para uma experiência de edição mais eficiente.
title: Ch02. Buffers, Windows, and Tabs
---

Se você usou um editor de texto moderno antes, provavelmente está familiarizado com janelas e abas. O Vim usa três abstrações de exibição em vez de duas: buffers, janelas e abas. Neste capítulo, vou explicar o que são buffers, janelas e abas e como funcionam no Vim.

Antes de começar, certifique-se de que você tem a opção `set hidden` no seu vimrc. Sem isso, sempre que você alternar entre buffers e seu buffer atual não estiver salvo, o Vim irá solicitar que você salve o arquivo (você não quer isso se quiser se mover rapidamente). Eu ainda não cobri o vimrc. Se você não tiver um vimrc, crie um. Ele geralmente é colocado no seu diretório home e é nomeado como `.vimrc`. Eu tenho o meu em `~/.vimrc`. Para ver onde você deve criar seu vimrc, consulte `:h vimrc`. Dentro dele, adicione:

```shell
set hidden
```

Salve-o, então faça o source (execute `:source %` de dentro do vimrc).

## Buffers

O que é um *buffer*?

Um buffer é um espaço na memória onde você pode escrever e editar algum texto. Quando você abre um arquivo no Vim, os dados são vinculados a um buffer. Quando você abre 3 arquivos no Vim, você tem 3 buffers.

Tenha dois arquivos vazios, `file1.js` e `file2.js` disponíveis (se possível, crie-os com o Vim). Execute isso no terminal:

```bash
vim file1.js
```

O que você está vendo é o *buffer* de `file1.js`. Sempre que você abre um novo arquivo, o Vim cria um novo buffer.

Saia do Vim. Desta vez, abra dois novos arquivos:

```bash
vim file1.js file2.js
```

O Vim atualmente exibe o buffer de `file1.js`, mas na verdade cria dois buffers: o buffer de `file1.js` e o buffer de `file2.js`. Execute `:buffers` para ver todos os buffers (alternativamente, você pode usar `:ls` ou `:files` também). Você deve ver *ambos* `file1.js` e `file2.js` listados. Executar `vim file1 file2 file3 ... filen` cria n quantidades de buffers. Cada vez que você abre um novo arquivo, o Vim cria um novo buffer para esse arquivo.

Existem várias maneiras de você navegar entre buffers:
- `:bnext` para ir para o próximo buffer (`:bprevious` para ir para o buffer anterior).
- `:buffer` + nome do arquivo. O Vim pode autocompletar o nome do arquivo com `<Tab>`.
- `:buffer` + `n`, onde `n` é o número do buffer. Por exemplo, digitando `:buffer 2` levará você ao buffer #2.
- Salte para a posição mais antiga na lista de saltos com `Ctrl-O` e para a posição mais nova com `Ctrl-I`. Esses não são métodos específicos de buffer, mas podem ser usados para saltar entre diferentes buffers. Eu explicarei saltos em mais detalhes no Capítulo 5.
- Vá para o buffer editado anteriormente com `Ctrl-^`.

Uma vez que o Vim cria um buffer, ele permanecerá na sua lista de buffers. Para removê-lo, você pode digitar `:bdelete`. Ele também pode aceitar um número de buffer como parâmetro (`:bdelete 3` para deletar o buffer #3) ou um nome de arquivo (`:bdelete` e então use `<Tab>` para autocompletar).

A coisa mais difícil para mim ao aprender sobre buffers foi visualizar como eles funcionavam porque minha mente estava acostumada a janelas de quando usava um editor de texto convencional. Uma boa analogia é um baralho de cartas. Se eu tenho 2 buffers, eu tenho uma pilha de 2 cartas. A carta no topo é a única carta que vejo, mas sei que há cartas abaixo dela. Se vejo o buffer de `file1.js` exibido, então a carta de `file1.js` está no topo do baralho. Eu não posso ver a outra carta, `file2.js` aqui, mas ela está lá. Se eu alternar os buffers para `file2.js`, essa carta de `file2.js` agora está no topo do baralho e a carta de `file1.js` está abaixo dela.

Se você nunca usou o Vim antes, esse é um novo conceito. Leve seu tempo para entendê-lo.

## Saindo do Vim

A propósito, se você tiver múltiplos buffers abertos, pode fechar todos eles com quit-all:

```shell
:qall
```

Se você quiser fechar sem salvar suas alterações, basta adicionar `!` no final:

```shell
:qall!
```

Para salvar e sair de todos, execute:

```shell
:wqall
```

## Janelas

Uma janela é uma área de visualização em um buffer. Se você vem de um editor convencional, esse conceito pode ser familiar para você. A maioria dos editores de texto tem a capacidade de exibir várias janelas. No Vim, você também pode ter várias janelas.

Vamos abrir `file1.js` do terminal novamente:

```bash
vim file1.js
```

Antes eu escrevi que você está olhando para o buffer de `file1.js`. Embora isso estivesse correto, essa afirmação estava incompleta. Você está olhando para o buffer de `file1.js`, exibido através de **uma janela**. Uma janela é como você está visualizando um buffer.

Não saia do Vim ainda. Execute:

```shell
:split file2.js
```

Agora você está olhando para dois buffers através de **duas janelas**. A janela superior exibe o buffer de `file2.js`. A janela inferior exibe o buffer de `file1.js`.

Se você quiser navegar entre janelas, use esses atalhos:

```shell
Ctrl-W H    Move o cursor para a janela à esquerda
Ctrl-W J    Move o cursor para a janela abaixo
Ctrl-W K    Move o cursor para a janela acima
Ctrl-W L    Move o cursor para a janela à direita
```

Agora execute:

```shell
:vsplit file3.js
```

Você agora está vendo três janelas exibindo três buffers. Uma janela exibe o buffer de `file3.js`, outra janela exibe o buffer de `file2.js`, e outra janela exibe o buffer de `file1.js`.

Você pode ter várias janelas exibindo o mesmo buffer. Enquanto você está na janela superior esquerda, digite:

```shell
:buffer file2.js
```

Agora ambas as janelas estão exibindo o buffer de `file2.js`. Se você começar a digitar em uma janela de `file2.js`, verá que ambas as janelas que exibem os buffers de `file2.js` estão sendo atualizadas em tempo real.

Para fechar a janela atual, você pode executar `Ctrl-W C` ou digitar `:quit`. Quando você fecha uma janela, o buffer ainda estará lá (execute `:buffers` para confirmar isso).

Aqui estão alguns comandos úteis de janela no modo normal:

```shell
Ctrl-W V    Abre uma nova divisão vertical
Ctrl-W S    Abre uma nova divisão horizontal
Ctrl-W C    Fecha uma janela
Ctrl-W O    Faz com que a janela atual seja a única na tela e fecha outras janelas
```

E aqui está uma lista de comandos úteis de linha de comando para janelas:

```shell
:vsplit filename    Divide a janela verticalmente
:split filename     Divide a janela horizontalmente
:new filename       Cria uma nova janela
```

Leve seu tempo para entendê-los. Para mais informações, consulte `:h window`.

## Abas

Uma aba é uma coleção de janelas. Pense nisso como um layout para janelas. Na maioria dos editores de texto modernos (e navegadores de internet modernos), uma aba significa um arquivo / página aberta e quando você a fecha, esse arquivo / página desaparece. No Vim, uma aba não representa um arquivo aberto. Quando você fecha uma aba no Vim, você não está fechando um arquivo. Você está apenas fechando o layout. Os arquivos abertos nesse layout ainda não estão fechados, eles ainda estão abertos em seus buffers.

Vamos ver as abas do Vim em ação. Abra `file1.js`:

```bash
vim file1.js
```

Para abrir `file2.js` em uma nova aba:

```shell
:tabnew file2.js
```

Você também pode deixar o Vim autocompletar o arquivo que deseja abrir em uma *nova aba* pressionando `<Tab>` (sem trocadilho).

Abaixo está uma lista de navegações úteis de abas:

```shell
:tabnew file.txt    Abre file.txt em uma nova aba
:tabclose           Fecha a aba atual
:tabnext            Vai para a próxima aba
:tabprevious        Vai para a aba anterior
:tablast            Vai para a última aba
:tabfirst           Vai para a primeira aba
```

Você também pode executar `gt` para ir para a próxima página de aba (você pode ir para a aba anterior com `gT`). Você pode passar um número como argumento para `gt`, onde o número é o número da aba. Para ir para a terceira aba, faça `3gt`.

Uma vantagem de ter várias abas é que você pode ter diferentes arranjos de janelas em diferentes abas. Talvez você queira que sua primeira aba tenha 3 janelas verticais e a segunda aba tenha um layout misto de janelas horizontais e verticais. A aba é a ferramenta perfeita para o trabalho!

Para iniciar o Vim com várias abas, você pode fazer isso a partir do terminal:

```bash
vim -p file1.js file2.js file3.js
```

## Movendo-se em 3D

Mover-se entre janelas é como viajar bidimensionalmente ao longo do eixo X-Y em coordenadas cartesianas. Você pode mover-se para a janela de cima, direita, abaixo e esquerda com `Ctrl-W H/J/K/L`.

Mover-se entre buffers é como viajar ao longo do eixo Z em coordenadas cartesianas. Imagine seus arquivos de buffer se alinhando ao longo do eixo Z. Você pode atravessar o eixo Z um buffer de cada vez com `:bnext` e `:bprevious`. Você pode saltar para qualquer coordenada no eixo Z com `:buffer filename/buffernumber`.

Você pode se mover em *espaço tridimensional* combinando movimentos de janelas e buffers. Você pode mover-se para a janela de cima, direita, abaixo ou esquerda (navegações X-Y) com movimentos de janela. Como cada janela contém buffers, você pode se mover para frente e para trás (navegações Z) com movimentos de buffer.

## Usando Buffers, Janelas e Abas de Forma Inteligente

Você aprendeu o que são buffers, janelas e abas e como funcionam no Vim. Agora que você os entende melhor, pode usá-los em seu próprio fluxo de trabalho.

Todo mundo tem um fluxo de trabalho diferente, aqui está o meu, por exemplo:
- Primeiro, uso buffers para armazenar todos os arquivos necessários para a tarefa atual. O Vim pode lidar com muitos buffers abertos antes de começar a desacelerar. Além disso, ter muitos buffers abertos não vai lotar minha tela. Estou vendo apenas um buffer (supondo que eu tenha apenas uma janela) a qualquer momento, permitindo-me focar em uma tela. Quando preciso ir a algum lugar, posso rapidamente voar para qualquer buffer aberto a qualquer momento.
- Uso várias janelas para visualizar múltiplos buffers ao mesmo tempo, geralmente ao comparar arquivos, ler documentos ou seguir um fluxo de código. Tento manter o número de janelas abertas em no máximo três porque minha tela ficará lotada (uso um laptop pequeno). Quando termino, fecho qualquer janela extra. Menos janelas significam menos distrações.
- Em vez de abas, uso janelas do [tmux](https://github.com/tmux/tmux/wiki). Geralmente uso várias janelas do tmux ao mesmo tempo. Por exemplo, uma janela do tmux para códigos do lado do cliente e outra para códigos de backend.

Meu fluxo de trabalho pode parecer diferente do seu, com base no seu estilo de edição, e isso é normal. Experimente para descobrir seu próprio fluxo, adequando-se ao seu estilo de codificação.