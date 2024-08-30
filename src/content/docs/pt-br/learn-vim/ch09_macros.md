---
description: Aprenda a usar macros no Vim para automatizar tarefas repetitivas, gravando
  ações e executando-as facilmente sempre que necessário.
title: Ch09. Macros
---

Ao editar arquivos, você pode se encontrar repetindo as mesmas ações. Não seria bom se você pudesse fazer essas ações uma vez e repeti-las sempre que precisar? Com as macros do Vim, você pode gravar ações e armazená-las dentro dos registros do Vim para serem executadas sempre que precisar.

Neste capítulo, você aprenderá como usar macros para automatizar tarefas mundanas (além de parecer legal ver seu arquivo se editar sozinho).

## Macros Básicas

Aqui está a sintaxe básica de uma macro do Vim:

```shell
qa                     Começar a gravar uma macro no registro a
q (enquanto grava)     Parar a gravação da macro
```

Você pode escolher qualquer letra minúscula (a-z) para armazenar macros. Aqui está como você pode executar uma macro:

```shell
@a    Executar a macro do registro a
@@    Executar as últimas macros executadas
```

Suponha que você tenha este texto e queira colocar tudo em maiúsculas em cada linha:

```shell
hello
vim
macros
are
awesome
```

Com o cursor no início da linha "hello", execute:

```shell
qa0gU$jq
```

A explicação:
- `qa` começa a gravar uma macro no registro a.
- `0` vai para o início da linha.
- `gU$` coloca em maiúsculas o texto da sua localização atual até o final da linha.
- `j` desce uma linha.
- `q` para a gravação.

Para reproduzi-la, execute `@a`. Assim como muitos outros comandos do Vim, você pode passar um argumento de contagem para as macros. Por exemplo, executar `3@a` executa a macro três vezes.

## Guarda de Segurança

A execução de macros termina automaticamente quando encontra um erro. Suponha que você tenha este texto:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Se você quiser colocar em maiúsculas a primeira palavra de cada linha, esta macro deve funcionar:

```shell
qa0W~jq
```

Aqui está a explicação do comando acima:
- `qa` começa a gravar uma macro no registro a.
- `0` vai para o início da linha.
- `W` vai para a próxima PALAVRA.
- `~` alterna o caso do caractere sob o cursor.
- `j` desce uma linha.
- `q` para a gravação.

Prefiro contar a execução da minha macro em excesso do que em falta, então geralmente a chamo noventa e nove vezes (`99@a`). Com este comando, o Vim não executa realmente essa macro noventa e nove vezes. Quando o Vim chega à última linha e executa o movimento `j`, ele não encontra mais linhas para descer, lança um erro e para a execução da macro.

O fato de a execução da macro parar ao primeiro erro encontrado é um bom recurso, caso contrário, o Vim continuaria a executar essa macro noventa e nove vezes, mesmo que já tivesse chegado ao final da linha.

## Macro de Linha de Comando

Executar `@a` no modo normal não é a única maneira de executar macros no Vim. Você também pode executar o comando `:normal @a` na linha de comando. `:normal` permite ao usuário executar qualquer comando do modo normal passado como argumento. No caso acima, é o mesmo que executar `@a` a partir do modo normal.

O comando `:normal` aceita intervalo como argumentos. Você pode usar isso para executar a macro em intervalos selecionados. Se você quiser executar sua macro entre as linhas 2 e 3, pode executar `:2,3 normal @a`.

## Executando uma Macro em Vários Arquivos

Suponha que você tenha vários arquivos `.txt`, cada um contendo alguns textos. Sua tarefa é colocar em maiúsculas a primeira palavra apenas nas linhas que contêm a palavra "donut". Suponha que você tenha `0W~j` no registro a (a mesma macro de antes). Como você pode realizar isso rapidamente?

Primeiro arquivo:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

Segundo arquivo:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

Terceiro arquivo:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

Aqui está como você pode fazer isso:
- `:args *.txt` para encontrar todos os arquivos `.txt` no seu diretório atual.
- `:argdo g/donut/normal @a` executa o comando global `g/donut/normal @a` em cada arquivo dentro de `:args`.
- `:argdo update` executa o comando `update` para salvar cada arquivo dentro de `:args` quando o buffer foi modificado.

Se você não está familiarizado com o comando global `:g/donut/normal @a`, ele executa o comando que você dá (`normal @a`) nas linhas que correspondem ao padrão (`/donut/`). Eu falarei sobre o comando global em um capítulo posterior.

## Macro Recursiva

Você pode executar uma macro recursivamente chamando o mesmo registro de macro enquanto grava essa macro. Suponha que você tenha esta lista novamente e precise alternar o caso da primeira palavra:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Desta vez, vamos fazer isso recursivamente. Execute:

```shell
qaqqa0W~j@aq
```

Aqui está a explicação dos passos:
- `qaq` grava uma macro vazia a. É necessário começar com um registro vazio porque, ao chamar a macro recursivamente, ela executará o que estiver nesse registro.
- `qa` começa a gravar no registro a.
- `0` vai para o primeiro caractere na linha atual.
- `W` vai para a próxima PALAVRA.
- `~` alterna o caso do caractere sob o cursor.
- `j` desce uma linha.
- `@a` executa a macro a.
- `q` para a gravação.

Agora você pode apenas executar `@a` e assistir o Vim executar a macro recursivamente.

Como a macro soube quando parar? Quando a macro estava na última linha, tentou executar `j`, e como não havia mais linha para descer, parou a execução da macro.

## Anexando uma Macro

Se você precisar adicionar ações a uma macro existente, em vez de recriar a macro do zero, você pode anexar ações a uma já existente. No capítulo de registros, você aprendeu que pode anexar um registro nomeado usando seu símbolo em maiúscula. A mesma regra se aplica. Para anexar ações a uma macro de registro, use o registro A.

Grave uma macro no registro a: `qa0W~q` (essa sequência alterna o caso da próxima PALAVRA em uma linha). Se você quiser anexar uma nova sequência para também adicionar um ponto no final da linha, execute:

```shell
qAA.<Esc>q
```

A explicação:
- `qA` começa a gravar a macro no registro A.
- `A.<Esc>` insere no final da linha (aqui `A` é o comando do modo de inserção, não deve ser confundido com a macro A) um ponto, e então sai do modo de inserção.
- `q` para a gravação da macro.

Agora, quando você executar `@a`, não apenas alterna o caso da próxima PALAVRA, mas também adiciona um ponto no final da linha.

## Alterando uma Macro

E se você precisar adicionar novas ações no meio de uma macro?

Suponha que você tenha uma macro que alterna a primeira palavra real e adiciona um ponto no final da linha, `0W~A.<Esc>` no registro a. Suponha que, entre colocar em maiúsculas a primeira palavra e adicionar um ponto no final da linha, você precise adicionar a palavra "deep fried" logo antes da palavra "donut" *(porque a única coisa melhor do que donuts normais são donuts fritos)*.

Vou reutilizar o texto da seção anterior:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Primeiro, vamos chamar a macro existente (suponha que você tenha mantido a macro da seção anterior no registro a) com `:put a`:

```shell
0W~A.^[
```

O que é esse `^[`? Você não fez `0W~A.<Esc>`? Onde está o `<Esc>`? `^[` é a representação do *código interno* do Vim para `<Esc>`. Com certas teclas especiais, o Vim imprime a representação dessas teclas na forma de códigos internos. Algumas teclas comuns que têm representações de código interno são `<Esc>`, `<Backspace>` e `<Enter>`. Existem mais teclas especiais, mas elas não estão dentro do escopo deste capítulo.

Voltando à macro, logo após o operador de alternância de caso (`~`), vamos adicionar as instruções para ir ao final da linha (`$`), voltar uma palavra (`b`), ir para o modo de inserção (`i`), digitar "deep fried " (não se esqueça do espaço após "fried "), e sair do modo de inserção (`<Esc>`).

Aqui está o que você acabará tendo:

```shell
0W~$bideep fried <Esc>A.^[
```

Há um pequeno problema. O Vim não entende `<Esc>`. Você não pode digitar literalmente `<Esc>`. Você terá que escrever a representação do código interno para a tecla `<Esc>`. Enquanto estiver no modo de inserção, pressione `Ctrl-V` seguido de `<Esc>`. O Vim imprimirá `^[`. `Ctrl-V` é um operador do modo de inserção para inserir o próximo caractere não numérico *literalmente*. Seu código de macro deve ficar assim agora:

```shell
0W~$bideep fried ^[A.^[
```

Para adicionar a instrução alterada no registro a, você pode fazer da mesma forma que adicionar uma nova entrada em um registro nomeado. No início da linha, execute `"ay$` para armazenar o texto copiado no registro a.

Agora, quando você executar `@a`, sua macro alternará o caso da primeira palavra, adicionará "deep fried " antes de "donut" e adicionará um "." no final da linha. Delicioso!

Uma maneira alternativa de alterar uma macro é usar uma expressão de linha de comando. Faça `:let @a="`, depois faça `Ctrl-R a`, isso colará literalmente o conteúdo do registro a. Finalmente, não se esqueça de fechar as aspas duplas (`"`). Você pode ter algo como `:let @a="0W~$bideep fried ^[A.^["`.

## Redundância de Macro

Você pode facilmente duplicar macros de um registro para outro. Por exemplo, para duplicar uma macro do registro a para o registro z, você pode fazer `:let @z = @a`. `@a` representa o conteúdo do registro a. Agora, se você executar `@z`, ele fará exatamente as mesmas ações que `@a`.

Eu acho útil criar uma redundância em minhas macros mais frequentemente usadas. No meu fluxo de trabalho, geralmente gravo macros nas primeiras sete letras do alfabeto (a-g) e frequentemente as substituo sem pensar muito. Se eu mover as macros úteis para o final do alfabeto, posso preservá-las sem me preocupar que posso acidentalmente substituí-las.

## Macro em Série vs Paralela

O Vim pode executar macros em série e em paralelo. Suponha que você tenha este texto:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Se você quiser gravar uma macro para colocar em minúsculas todos os "FUNC" em maiúsculas, esta macro deve funcionar:

```shell
qa0f{gui{jq
```

A explicação:
- `qa` começa a gravar no registro a.
- `0` vai para a primeira linha.
- `f{` encontra a primeira instância de "{".
- `gui{` coloca em minúsculas (`gu`) o texto dentro do objeto de texto entre colchetes (`i{`).
- `j` desce uma linha.
- `q` para a gravação da macro.

Agora você pode executar `99@a` para executá-la nas linhas restantes. No entanto, e se você tiver esta expressão de importação dentro do seu arquivo?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Executar `99@a` executa a macro apenas três vezes. Não executa a macro nas duas últimas linhas porque a execução falha ao executar `f{` na linha "foo". Isso é esperado ao executar a macro em série. Você sempre pode ir para a próxima linha onde está "FUNC4" e reproduzir essa macro novamente. Mas e se você quiser fazer tudo de uma vez?

Execute a macro em paralelo.

Lembre-se da seção anterior que as macros podem ser executadas usando o comando de linha de comando `:normal` (ex: `:3,5 normal @a` executa a macro a nas linhas 3-5). Se você executar `:1,$ normal @a`, verá que a macro está sendo executada em todas as linhas, exceto na linha "foo". Funciona!

Embora internamente o Vim não execute realmente as macros em paralelo, externamente, ele se comporta como se o fizesse. O Vim executa `@a` *independentemente* em cada linha da primeira até a última linha (`1,$`). Como o Vim executa essas macros de forma independente, cada linha não sabe que uma das execuções da macro falhou na linha "foo".
## Aprenda Macros da Maneira Inteligente

Muitas coisas que você faz na edição são repetitivas. Para melhorar na edição, acostume-se a detectar ações repetitivas. Use macros (ou comando ponto) para não ter que realizar a mesma ação duas vezes. Quase tudo que você pode fazer no Vim pode ser replicado com macros.

No começo, achei muito estranho escrever macros, mas não desista. Com prática suficiente, você se acostumará a automatizar tudo.

Você pode achar útil usar mnemônicos para ajudar a lembrar suas macros. Se você tiver uma macro que cria uma função, use o registro "f (`qf`). Se você tiver uma macro para operações numéricas, o registro "n deve funcionar (`qn`). Nomeie-a com o *primeiro registro nomeado* que vier à sua mente quando você pensar nessa operação. Também acho que o registro "q faz um bom registro padrão de macro porque `qq` exige menos esforço mental para ser lembrado. Por último, também gosto de incrementar minhas macros em ordem alfabética, como `qa`, depois `qb`, depois `qc`, e assim por diante.

Encontre um método que funcione melhor para você.