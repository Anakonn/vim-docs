---
description: Aprenda a usar o comando ponto (.) no Vim para repetir alterações de
  forma eficiente, economizando tempo e esforço em edições simples.
title: Ch07. the Dot Command
---

Em geral, você deve tentar evitar refazer o que acabou de fazer sempre que possível. Neste capítulo, você aprenderá a usar o comando ponto para refazer facilmente a alteração anterior. É um comando versátil para reduzir repetições simples.

## Uso

Assim como seu nome, você pode usar o comando ponto pressionando a tecla ponto (`.`).

Por exemplo, se você quiser substituir todos "let" por "const" nas seguintes expressões:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Pesquise com `/let` para ir até a correspondência.
- Altere com `cwconst<Esc>` para substituir "let" por "const".
- Navegue com `n` para encontrar a próxima correspondência usando a pesquisa anterior.
- Repita o que você acabou de fazer com o comando ponto (`.`).
- Continue pressionando `n . n .` até substituir cada palavra.

Aqui o comando ponto repetiu a sequência `cwconst<Esc>`. Ele salvou você de digitar oito toques de tecla em troca de apenas um.

## O Que É uma Alteração?

Se você olhar a definição do comando ponto (`:h .`), diz que o comando ponto repete a última alteração. O que é uma alteração?

Toda vez que você atualiza (adiciona, modifica ou exclui) o conteúdo do buffer atual, você está fazendo uma alteração. As exceções são atualizações feitas por comandos de linha de comando (os comandos que começam com `:`) que não contam como uma alteração.

No primeiro exemplo, `cwconst<Esc>` foi a alteração. Agora suponha que você tenha este texto:

```shell
pancake, potatoes, fruit-juice,
```

Para excluir o texto do início da linha até a próxima ocorrência de uma vírgula, primeiro exclua até a vírgula, depois repita duas vezes com `df,..`. 

Vamos tentar outro exemplo:

```shell
pancake, potatoes, fruit-juice,
```

Desta vez, sua tarefa é excluir a vírgula, não os itens do café da manhã. Com o cursor no início da linha, vá até a primeira vírgula, exclua-a, depois repita mais duas vezes com `f,x..` Fácil, certo? Espere um minuto, não funcionou! Por quê?

Uma alteração exclui movimentos porque não atualiza o conteúdo do buffer. O comando `f,x` consistiu em duas ações: o comando `f,` para mover o cursor para "," e `x` para excluir um caractere. Somente o último, `x`, causou uma alteração. Contraste isso com `df,` do exemplo anterior. Nele, `f,` é uma diretiva para o operador de exclusão `d`, não um movimento para mover o cursor. O `f,` em `df,` e `f,x` têm dois papéis muito diferentes.

Vamos terminar a última tarefa. Depois de executar `f,` e depois `x`, vá até a próxima vírgula com `;` para repetir o último `f`. Finalmente, use `.` para excluir o caractere sob o cursor. Repita `; . ; .` até que tudo seja excluído. O comando completo é `f,x;.;.`.

Vamos tentar outro:

```shell
pancake
potatoes
fruit-juice
```

Vamos adicionar uma vírgula no final de cada linha. Começando na primeira linha, faça `A,<Esc>j`. Até agora, você percebe que `j` não causa uma alteração. A alteração aqui é apenas `A,`. Você pode mover e repetir a alteração com `j . j .`. O comando completo é `A,<Esc>j.j.`.

Cada ação desde o momento em que você pressiona o operador de comando de inserção (`A`) até sair do comando de inserção (`<Esc>`) é considerada uma alteração.

## Repetição em Múltiplas Linhas

Suponha que você tenha este texto:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Seu objetivo é excluir todas as linhas, exceto a linha "foo". Primeiro, exclua as três primeiras linhas com `d2j`, depois vá até a linha abaixo da linha "foo". Na próxima linha, use o comando ponto duas vezes. O comando completo é `d2jj..`.

Aqui a alteração foi `d2j`. Neste contexto, `2j` não foi um movimento, mas parte do operador de exclusão.

Vamos olhar outro exemplo:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Vamos remover todos os z's. Começando do primeiro caractere na primeira linha, selecione visualmente apenas o primeiro z das três primeiras linhas com o modo visual em bloco (`Ctrl-Vjj`). Se você não está familiarizado com o modo visual em bloco, eu vou cobri-los em um capítulo posterior. Uma vez que você tenha os três z's selecionados visualmente, exclua-os com o operador de exclusão (`d`). Depois, mova-se para a próxima palavra (`w`) até o próximo z. Repita a alteração mais duas vezes (`..`). O comando completo é `Ctrl-vjjdw..`.

Quando você excluiu uma coluna de três z's (`Ctrl-vjjd`), isso foi contado como uma alteração. A operação no modo visual pode ser usada para direcionar várias linhas como parte de uma alteração.

## Incluindo um Movimento em uma Alteração

Vamos revisitar o primeiro exemplo neste capítulo. Lembre-se de que o comando `/letcwconst<Esc>` seguido de `n . n .` substituiu todos "let" por "const" nas seguintes expressões:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Há uma maneira mais rápida de realizar isso. Depois de pesquisar `/let`, execute `cgnconst<Esc>` e depois `. .`.

`gn` é um movimento que busca para frente o último padrão de pesquisa (neste caso, `/let`) e automaticamente faz um destaque visual. Para substituir a próxima ocorrência, você não precisa mais se mover e repetir a alteração (`n . n .`), mas apenas repetir (`. .`). Você não precisa mais usar movimentos de pesquisa porque buscar a próxima correspondência agora faz parte da alteração!

Quando você estiver editando, esteja sempre atento a movimentos que podem fazer várias coisas ao mesmo tempo, como `gn`, sempre que possível.

## Aprenda o Comando Ponto da Maneira Inteligente

O poder do comando ponto vem da troca de várias teclas por uma. Provavelmente não é uma troca lucrativa usar o comando ponto para operações de tecla única como `x`. Se sua última alteração requer uma operação complexa como `cgnconst<Esc>`, o comando ponto reduz nove toques de tecla em um, uma troca muito lucrativa.

Ao editar, pense sobre repetibilidade. Por exemplo, se eu precisar remover as próximas três palavras, é mais econômico usar `d3w` ou fazer `dw` e depois `.` duas vezes? Você vai excluir uma palavra novamente? Se sim, então faz sentido usar `dw` e repeti-lo várias vezes em vez de `d3w`, porque `dw` é mais reutilizável do que `d3w`. 

O comando ponto é um comando versátil para automatizar alterações únicas. Em um capítulo posterior, você aprenderá como automatizar ações mais complexas com macros do Vim. Mas primeiro, vamos aprender sobre registros para armazenar e recuperar texto.