---
description: Este capítulo ensina a estrutura gramatical dos comandos do Vim, facilitando
  a compreensão e prática da linguagem do editor para usuários iniciantes.
title: Ch04. Vim Grammar
---

É fácil ficar intimidado pela complexidade dos comandos do Vim. Se você vê um usuário do Vim fazendo `gUfV` ou `1GdG`, pode não saber imediatamente o que esses comandos fazem. Neste capítulo, vou desmembrar a estrutura geral dos comandos do Vim em uma regra gramatical simples.

Este é o capítulo mais importante de todo o guia. Uma vez que você entender a estrutura gramatical subjacente, você será capaz de "falar" com o Vim. A propósito, quando eu digo *linguagem Vim* neste capítulo, não estou falando sobre a linguagem Vimscript (a linguagem de programação integrada do Vim, você aprenderá isso em capítulos posteriores).

## Como Aprender uma Língua

Eu não sou um falante nativo de inglês. Aprendi inglês quando tinha 13 anos, quando me mudei para os EUA. Existem três coisas que você precisa fazer para aprender a falar uma nova língua:

1. Aprender regras gramaticais.
2. Aumentar o vocabulário.
3. Praticar, praticar, praticar.

Da mesma forma, para falar a linguagem Vim, você precisa aprender as regras gramaticais, aumentar o vocabulário e praticar até que você possa executar os comandos sem pensar.

## Regra Gramatical

Há apenas uma regra gramatical na linguagem Vim:

```shell
verbo + substantivo
```

É isso!

Isso é como dizer essas frases em inglês:

- *"Comer (verbo) um donut (substantivo)"*
- *"Chutar (verbo) uma bola (substantivo)"*
- *"Aprender (verbo) o editor Vim (substantivo)"*

Agora você precisa aumentar seu vocabulário com verbos e substantivos básicos do Vim.

## Substantivos (Movimentos)

Substantivos são movimentos do Vim. Movimentos são usados para se mover no Vim. Abaixo está uma lista de alguns dos movimentos do Vim:

```shell
h    Esquerda
j    Baixo
k    Cima
l    Direita
w    Mover para o início da próxima palavra
}    Pular para o próximo parágrafo
$    Ir para o final da linha
```

Você aprenderá mais sobre movimentos no próximo capítulo, então não se preocupe muito se não entender alguns deles.

## Verbos (Operadores)

De acordo com `:h operator`, o Vim tem 16 operadores. No entanto, na minha experiência, aprender esses 3 operadores é suficiente para 80% das minhas necessidades de edição:

```shell
y    Copiar texto (yank)
d    Deletar texto e salvar no registro
c    Deletar texto, salvar no registro e iniciar o modo de inserção
```

A propósito, depois de copiar um texto, você pode colá-lo com `p` (depois do cursor) ou `P` (antes do cursor).

## Verbo e Substantivo

Agora que você conhece os substantivos e verbos básicos, vamos aplicar a regra gramatical, verbo + substantivo! Suponha que você tenha esta expressão:

```javascript
const learn = "vim";
```

- Para copiar tudo da sua localização atual até o final da linha: `y$`.
- Para deletar da sua localização atual até o início da próxima palavra: `dw`.
- Para mudar da sua localização atual até o final do parágrafo atual, digamos `c}`.

Movimentos também aceitam números como argumentos (discutirei isso no próximo capítulo). Se você precisar subir 3 linhas, em vez de pressionar `k` 3 vezes, você pode fazer `3k`. O número funciona com a gramática do Vim.
- Para copiar dois caracteres à esquerda: `y2h`.
- Para deletar as próximas duas palavras: `d2w`.
- Para mudar as próximas duas linhas: `c2j`.

Neste momento, você pode ter que pensar muito para executar até mesmo um comando simples. Você não está sozinho. Quando comecei, tive dificuldades semelhantes, mas fui ficando mais rápido com o tempo. Você também ficará. Repetição, repetição, repetição.

Como uma observação, operações de linha (operações que afetam toda a linha) são operações comuns na edição de texto. Em geral, digitando um comando de operador duas vezes, o Vim executa uma operação de linha para essa ação. Por exemplo, `dd`, `yy` e `cc` realizam **deleção**, **cópia** e **mudança** na linha inteira. Tente isso com outros operadores!

Isso é realmente legal. Estou vendo um padrão aqui. Mas ainda não terminei. O Vim tem mais um tipo de substantivo: objetos de texto.

## Mais Substantivos (Objetos de Texto)

Imagine que você está em algum lugar dentro de um par de parênteses como `(hello Vim)` e precisa deletar toda a frase dentro dos parênteses. Como você pode fazer isso rapidamente? Existe uma maneira de deletar o "grupo" em que você está?

A resposta é sim. Os textos frequentemente vêm estruturados. Eles frequentemente contêm parênteses, aspas, colchetes, chaves e mais. O Vim tem uma maneira de capturar essa estrutura com objetos de texto.

Objetos de texto são usados com operadores. Existem dois tipos de objetos de texto: objetos de texto internos e externos.

```shell
i + objeto    Objeto de texto interno
a + objeto    Objeto de texto externo
```

O objeto de texto interno seleciona o objeto dentro *sem* o espaço em branco ou os objetos circundantes. O objeto de texto externo seleciona o objeto dentro *incluindo* o espaço em branco ou os objetos circundantes. Geralmente, um objeto de texto externo sempre seleciona mais texto do que um objeto de texto interno. Se o seu cursor estiver em algum lugar dentro dos parênteses na expressão `(hello Vim)`:
- Para deletar o texto dentro dos parênteses sem deletar os parênteses: `di(`.
- Para deletar os parênteses e o texto dentro: `da(`.

Vamos olhar para um exemplo diferente. Suponha que você tenha esta função Javascript e seu cursor esteja no "H" de "Hello":

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Para deletar todo o "Hello Vim": `di(`.
- Para deletar o conteúdo da função (cercado por `{}`): `di{`.
- Para deletar a string "Hello": `diw`.

Objetos de texto são poderosos porque você pode direcionar diferentes objetos de um local. Você pode deletar os objetos dentro dos parênteses, o bloco da função ou a palavra atual. Mnemonicamente, quando você vê `di(`, `di{` e `diw`, você tem uma boa ideia de quais objetos de texto eles representam: um par de parênteses, um par de chaves e uma palavra.

Vamos olhar para um último exemplo. Suponha que você tenha essas tags HTML:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Se o seu cursor estiver no texto "Header1":
- Para deletar "Header1": `dit`.
- Para deletar `<h1>Header1</h1>`: `dat`.

Se o seu cursor estiver em "div":
- Para deletar `h1` e ambas as linhas `p`: `dit`.
- Para deletar tudo: `dat`.
- Para deletar "div": `di<`.

Abaixo está uma lista de objetos de texto comuns:

```shell
w         Uma palavra
p         Um parágrafo
s         Uma frase
( ou )    Um par de ( )
{ ou }    Um par de { }
[ ou ]    Um par de [ ]
< ou >    Um par de < >
t         Tags XML
"         Um par de " "
'         Um par de ' '
`         Um par de ` `
```

Para aprender mais, confira `:h text-objects`.

## Componibilidade e Gramática

A gramática do Vim é um subconjunto do recurso de componibilidade do Vim. Vamos discutir a componibilidade no Vim e por que isso é um ótimo recurso a ter em um editor de texto.

Componibilidade significa ter um conjunto de comandos gerais que podem ser combinados (compostos) para realizar comandos mais complexos. Assim como na programação, onde você pode criar abstrações mais complexas a partir de abstrações mais simples, no Vim você pode executar comandos complexos a partir de comandos mais simples. A gramática do Vim é a manifestação da natureza composicional do Vim.

O verdadeiro poder da componibilidade do Vim brilha quando ele se integra a programas externos. O Vim tem um operador de filtro (`!`) para usar programas externos como filtros para nossos textos. Suponha que você tenha este texto bagunçado abaixo e queira tabular:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Isso não pode ser facilmente feito com comandos do Vim, mas você pode fazer isso rapidamente com o comando de terminal `column` (supondo que seu terminal tenha o comando `column`). Com o cursor em "Id", execute `!}column -t -s "|"`. Voilà! Agora você tem esses dados tabulares bonitos com apenas um comando rápido.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Vamos desmembrar o comando. O verbo foi `!` (operador de filtro) e o substantivo foi `}` (ir para o próximo parágrafo). O operador de filtro `!` aceitou outro argumento, um comando de terminal, então eu dei a ele `column -t -s "|"`. Não vou explicar como o `column` funcionou, mas, em efeito, ele tabulou o texto.

Suponha que você queira não apenas tabular seu texto, mas exibir apenas as linhas com "Ok". Você sabe que `awk` pode fazer isso facilmente. Você pode fazer isso assim:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Resultado:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Ótimo! O operador de comando externo também pode usar pipe (`|`).

Esse é o poder da componibilidade do Vim. Quanto mais você conhece seus operadores, movimentos e comandos de terminal, sua capacidade de compor ações complexas é *multiplicada*.

Suponha que você só conheça quatro movimentos, `w, $, }, G` e apenas um operador, `d`. Você pode fazer 8 ações: *mover* 4 maneiras diferentes (`w, $, }, G`) e *deletar* 4 alvos diferentes (`dw, d$, d}, dG`). Então, um dia você aprende sobre o operador maiúsculo (`gU`). Você não adicionou apenas uma nova habilidade ao seu cinto de ferramentas do Vim, mas *quatro*: `gUw, gU$, gU}, gUG`. Isso faz com que você tenha 12 ferramentas em seu cinto de ferramentas do Vim. Cada novo conhecimento é um multiplicador para suas habilidades atuais. Se você conhece 10 movimentos e 5 operadores, você tem 60 movimentos (50 operações + 10 movimentos) em seu arsenal. O Vim tem um movimento de número de linha (`nG`) que lhe dá `n` movimentos, onde `n` é quantas linhas você tem no seu arquivo (para ir para a linha 5, execute `5G`). O movimento de busca (`/`) praticamente lhe dá um número ilimitado de movimentos porque você pode buscar por qualquer coisa. O operador de comando externo (`!`) lhe dá tantas ferramentas de filtragem quanto o número de comandos de terminal que você conhece. Usando uma ferramenta composicional como o Vim, tudo o que você sabe pode ser ligado para realizar operações com complexidade crescente. Quanto mais você sabe, mais poderoso você se torna.

Esse comportamento composicional ecoa a filosofia Unix: *faça uma coisa bem feita*. Um operador tem uma função: fazer Y. Um movimento tem uma função: ir para X. Ao combinar um operador com um movimento, você previsivelmente obtém YX: fazer Y em X.

Movimentos e operadores são extensíveis. Você pode criar movimentos e operadores personalizados para adicionar ao seu cinto de ferramentas do Vim. O plugin [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) permite que você crie seus próprios objetos de texto. Ele também contém uma [lista](https://github.com/kana/vim-textobj-user/wiki) de objetos de texto personalizados feitos por usuários.

## Aprenda a Gramática do Vim da Maneira Inteligente

Você acabou de aprender sobre a regra da gramática do Vim: `verbo + substantivo`. Um dos meus maiores momentos "AHA!" no Vim foi quando eu tinha acabado de aprender sobre o operador maiúsculo (`gU`) e queria colocar a palavra atual em maiúsculas, eu *instintivamente* executei `gUiw` e funcionou! A palavra foi colocada em maiúsculas. Naquele momento, finalmente comecei a entender o Vim. Minha esperança é que você tenha seu próprio momento "AHA!" em breve, se ainda não tiver.

O objetivo deste capítulo é mostrar a você o padrão `verbo + substantivo` no Vim para que você aborde o aprendizado do Vim como aprender uma nova língua, em vez de memorizar cada combinação de comandos.

Aprenda o padrão e entenda as implicações. Essa é a maneira inteligente de aprender.