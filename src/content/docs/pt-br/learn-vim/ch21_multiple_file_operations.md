---
description: Aprenda a editar múltiplos arquivos no Vim com diferentes comandos, como
  `argdo`, `bufdo` e `cdo`, para otimizar sua experiência de edição.
title: Ch21. Multiple File Operations
---

Ser capaz de atualizar em vários arquivos é outra ferramenta de edição útil. Anteriormente, você aprendeu como atualizar vários textos com `cfdo`. Neste capítulo, você aprenderá as diferentes maneiras de editar vários arquivos no Vim.

## Diferentes Maneiras de Executar um Comando em Vários Arquivos

O Vim tem oito maneiras de executar comandos em vários arquivos:
- lista de argumentos (`argdo`)
- lista de buffers (`bufdo`)
- lista de janelas (`windo`)
- lista de abas (`tabdo`)
- lista de quickfix (`cdo`)
- lista de quickfix por arquivo (`cfdo`)
- lista de localização (`ldo`)
- lista de localização por arquivo (`lfdo`)

Praticamente falando, você provavelmente usará apenas uma ou duas a maior parte do tempo (pessoalmente, uso `cdo` e `argdo` mais do que os outros), mas é bom aprender sobre todas as opções disponíveis e usar aquelas que combinam com seu estilo de edição.

Aprender oito comandos pode parecer assustador. Mas, na realidade, esses comandos funcionam de maneira semelhante. Depois de aprender um, aprender os outros ficará mais fácil. Todos compartilham a mesma grande ideia: faça uma lista de suas respectivas categorias e, em seguida, passe o comando que você deseja executar.

## Lista de Argumentos

A lista de argumentos é a lista mais básica. Ela cria uma lista de arquivos. Para criar uma lista de file1, file2 e file3, você pode executar:

```shell
:args file1 file2 file3
```

Você também pode passar um caractere curinga (`*`), então, se você quiser fazer uma lista de todos os arquivos `.js` no diretório atual, execute:

```shell
:args *.js
```

Se você quiser fazer uma lista de todos os arquivos Javascript que começam com "a" no diretório atual, execute:

```shell
:args a*.js
```

O caractere curinga corresponde a um ou mais caracteres de nome de arquivo no diretório atual, mas e se você precisar pesquisar recursivamente em qualquer diretório? Você pode usar o duplo curinga (`**`). Para obter todos os arquivos Javascript dentro dos diretórios em sua localização atual, execute:

```shell
:args **/*.js
```

Uma vez que você executa o comando `args`, seu buffer atual será trocado para o primeiro item da lista. Para visualizar a lista de arquivos que você acabou de criar, execute `:args`. Uma vez que você criou sua lista, você pode percorrê-los. `:first` irá colocá-lo no primeiro item da lista. `:last` irá colocá-lo no último da lista. Para mover a lista para frente um arquivo de cada vez, execute `:next`. Para mover a lista para trás um arquivo de cada vez, execute `:prev`. Para avançar / retroceder um arquivo de cada vez e salvar as alterações, execute `:wnext` e `:wprev`. Existem muitos mais comandos de navegação. Confira `:h arglist` para mais.

A lista de argumentos é útil se você precisar direcionar um tipo específico de arquivo ou alguns arquivos. Talvez você precise atualizar todos os "donuts" para "panquecas" dentro de todos os arquivos `yml`, você pode fazer:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Se você executar o comando `args` novamente, ele substituirá a lista anterior. Por exemplo, se você executou anteriormente:

```shell
:args file1 file2 file3
```

Supondo que esses arquivos existam, você agora tem uma lista de `file1`, `file2` e `file3`. Então você executa isso:

```shell
:args file4 file5
```

Sua lista inicial de `file1`, `file2` e `file3` é substituída por `file4` e `file5`. Se você tiver `file1`, `file2` e `file3` em sua lista de argumentos e quiser *adicionar* `file4` e `file5` à sua lista inicial de arquivos, use o comando `:arga`. Execute:

```shell
:arga file4 file5
```

Agora você tem `file1`, `file2`, `file3`, `file4` e `file5` em sua lista de argumentos.

Se você executar `:arga` sem nenhum argumento, o Vim adicionará seu buffer atual à lista de argumentos atual. Se você já tiver `file1`, `file2` e `file3` em sua lista de argumentos e seu buffer atual estiver em `file5`, executar `:arga` adicionará `file5` à lista.

Uma vez que você tenha a lista, pode passá-la com qualquer comando de linha de comando de sua escolha. Você já viu isso sendo feito com substituição (`:argdo %s/donut/pancake/g`). Alguns outros exemplos:
- Para deletar todas as linhas que contêm "sobremesa" na lista de argumentos, execute `:argdo g/dessert/d`.
- Para executar a macro a (supondo que você tenha gravado algo na macro a) na lista de argumentos, execute `:argdo norm @a`.
- Para escrever "olá " seguido pelo nome do arquivo na primeira linha, execute `:argdo 0put='hello ' .. @:`.

Uma vez que você terminar, não se esqueça de salvá-los com `:update`.

Às vezes, você precisa executar os comandos apenas nos primeiros n itens da lista de argumentos. Se esse for o caso, basta passar ao comando `argdo` um endereço. Por exemplo, para executar o comando de substituição apenas nos primeiros 3 itens da lista, execute `:1,3argdo %s/donut/pancake/g`.

## Lista de Buffers

A lista de buffers será criada organicamente quando você editar novos arquivos, porque cada vez que você cria um novo arquivo / abre um arquivo, o Vim o salva em um buffer (a menos que você o exclua explicitamente). Então, se você já abriu 3 arquivos: `file1.rb file2.rb file3.rb`, você já tem 3 itens em sua lista de buffers. Para exibir a lista de buffers, execute `:buffers` (alternativamente: `:ls` ou `:files`). Para percorrer para frente e para trás, use `:bnext` e `:bprev`. Para ir ao primeiro e ao último buffer da lista, use `:bfirst` e `:blast` (divertido, não? :D).

A propósito, aqui está uma dica legal de buffer não relacionada a este capítulo: se você tiver um número de itens em sua lista de buffers, pode mostrar todos eles com `:ball` (todos os buffers). O comando `ball` exibe todos os buffers horizontalmente. Para exibi-los verticalmente, execute `:vertical ball`.

Voltando ao tópico, a mecânica para executar operações em todos os buffers é semelhante à lista de argumentos. Uma vez que você criou sua lista de buffers, você só precisa preceder o(s) comando(s) que deseja executar com `:bufdo` em vez de `:argdo`. Então, se você quiser substituir todos os "donuts" por "panquecas" em todos os buffers e, em seguida, salvar as alterações, execute `:bufdo %s/donut/pancake/g | update`.

## Lista de Janelas e Abas

As listas de janelas e abas também são semelhantes à lista de argumentos e à lista de buffers. As únicas diferenças são seu contexto e sintaxe.

As operações de janela são realizadas em cada janela aberta e executadas com `:windo`. As operações de aba são realizadas em cada aba que você abriu e executadas com `:tabdo`. Para mais, confira `:h list-repeat`, `:h :windo` e `:h :tabdo`.

Por exemplo, se você tiver três janelas abertas (você pode abrir novas janelas com `Ctrl-W v` para uma janela vertical e `Ctrl-W s` para uma janela horizontal) e executar `:windo 0put ='hello' . @%`, o Vim irá exibir "hello" + nome do arquivo em todas as janelas abertas.

## Lista de Quickfix

Nos capítulos anteriores (Ch3 e Ch19), falei sobre quickfixes. Quickfix tem muitos usos. Muitos plugins populares usam quickfixes, então é bom passar mais tempo para entendê-los.

Se você é novo no Vim, quickfix pode ser um conceito novo. Nos velhos tempos, quando você realmente tinha que compilar seu código explicitamente, durante a fase de compilação você encontraria erros. Para exibir esses erros, você precisa de uma janela especial. É aí que o quickfix entra. Quando você compila seu código, o Vim exibe mensagens de erro na janela de quickfix para que você possa corrigi-las mais tarde. Muitas linguagens modernas não exigem uma compilação explícita, mas isso não torna o quickfix obsoleto. Hoje em dia, as pessoas usam quickfix para todos os tipos de coisas, como exibir a saída de um terminal virtual e armazenar resultados de pesquisa. Vamos nos concentrar neste último, armazenando resultados de pesquisa.

Além dos comandos de compilação, certos comandos do Vim dependem de interfaces de quickfix. Um tipo de comando que usa quickfixes intensamente são os comandos de pesquisa. Tanto `:vimgrep` quanto `:grep` usam quickfixes por padrão.

Por exemplo, se você precisar pesquisar "donut" em todos os arquivos Javascript recursivamente, pode executar:

```shell
:vimgrep /donut/ **/*.js
```

O resultado da pesquisa por "donut" é armazenado na janela de quickfix. Para ver os resultados dessa pesquisa na janela de quickfix, execute:

```shell
:copen
```

Para fechá-la, execute:

```shell
:cclose
```

Para percorrer a lista de quickfix para frente e para trás, execute:

```shell
:cnext
:cprev
```

Para ir ao primeiro e ao último item na correspondência, execute:

```shell
:cfirst
:clast
```

Mais cedo, mencionei que havia dois comandos de quickfix: `cdo` e `cfdo`. Como eles diferem? `cdo` executa o comando para cada item na lista de quickfix, enquanto `cfdo` executa o comando para cada *arquivo* na lista de quickfix.

Deixe-me esclarecer. Suponha que, após executar o comando `vimgrep` acima, você encontrou:
- 1 resultado em `file1.js`
- 10 resultados em `file2.js`

Se você executar `:cfdo %s/donut/pancake/g`, isso efetivamente executará `%s/donut/pancake/g` uma vez em `file1.js` e uma vez em `file2.js`. Ele é executado *tantas vezes quantos forem os arquivos na correspondência.* Como há dois arquivos nos resultados, o Vim executa o comando de substituição uma vez em `file1.js` e mais uma vez em `file2.js`, apesar do fato de haver 10 correspondências no segundo arquivo. `cfdo` só se importa com quantos arquivos estão na lista de quickfix.

Se você executar `:cdo %s/donut/pancake/g`, isso efetivamente executará `%s/donut/pancake/g` uma vez em `file1.js` e *dez vezes* em `file2.js`. Ele é executado tantas vezes quantas forem os itens reais na lista de quickfix. Como há apenas uma correspondência encontrada em `file1.js` e 10 correspondências encontradas em `file2.js`, ele será executado um total de 11 vezes.

Como você executou `%s/donut/pancake/g`, faria sentido usar `cfdo`. Não faria sentido usar `cdo` porque ele executaria `%s/donut/pancake/g` dez vezes em `file2.js` (`%s` é uma substituição em todo o arquivo). Executar `%s` uma vez por arquivo é suficiente. Se você usasse `cdo`, faria mais sentido passá-lo com `s/donut/pancake/g` em vez disso.

Ao decidir se deve usar `cfdo` ou `cdo`, pense no escopo do comando que você está passando. Este é um comando de arquivo inteiro (como `:%s` ou `:g`) ou é um comando linha a linha (como `:s` ou `:!`)?

## Lista de Localização

A lista de localização é semelhante à lista de quickfix no sentido de que o Vim também usa uma janela especial para exibir mensagens. A diferença entre uma lista de quickfix e uma lista de localização é que, a qualquer momento, você pode ter apenas uma lista de quickfix, enquanto pode ter quantas listas de localização quiser.

Suponha que você tenha duas janelas abertas, uma janela exibindo `food.txt` e outra exibindo `drinks.txt`. De dentro de `food.txt`, você executa um comando de pesquisa na lista de localização `:lvimgrep` (a variante de localização para o comando `:vimgrep`):

```shell
:lvim /bagel/ **/*.md
```

O Vim criará uma lista de localização de todas as correspondências de pesquisa de bagel para aquela *janela* `food.txt`. Você pode ver a lista de localização com `:lopen`. Agora vá para a outra janela `drinks.txt` e execute:

```shell
:lvimgrep /milk/ **/*.md
```

O Vim criará uma lista de localização *separada* com todos os resultados da pesquisa de leite para aquela *janela* `drinks.txt`.

Para cada comando de localização que você executa em cada janela, o Vim cria uma lista de localização distinta. Se você tiver 10 janelas diferentes, pode ter até 10 listas de localização diferentes. Contrastando isso com a lista de quickfix onde você só pode ter uma a qualquer momento. Se você tiver 10 janelas diferentes, ainda terá apenas uma lista de quickfix.

A maioria dos comandos da lista de localização são semelhantes aos comandos de quickfix, exceto que são prefixados com `l-`. Por exemplo: `:lvimgrep`, `:lgrep` e `:lmake` vs `:vimgrep`, `:grep` e `:make`. Para manipular a janela da lista de localização, novamente, os comandos se parecem com os comandos de quickfix `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext` e `:lprev` vs `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext` e `:cprev`.

Os dois comandos de múltiplos arquivos da lista de localização também são semelhantes aos comandos de múltiplos arquivos de quickfix: `:ldo` e `:lfdo`. `:ldo` executa o comando de localização em cada lista de localização, enquanto `:lfdo` executa o comando da lista de localização para cada arquivo na lista de localização. Para mais, confira `:h location-list`.
## Executando Operações em Múltiplos Arquivos no Vim

Saber como realizar uma operação em múltiplos arquivos é uma habilidade útil na edição. Sempre que você precisar mudar o nome de uma variável em vários arquivos, você vai querer executá-los de uma só vez. O Vim tem oito maneiras diferentes de fazer isso.

Praticamente falando, você provavelmente não usará todas as oito de forma igual. Você vai se inclinar para uma ou duas. Quando você estiver começando, escolha uma (eu pessoalmente sugiro começar com a lista de argumentos `:argdo`) e domine-a. Uma vez que você esteja confortável com uma, aprenda a próxima. Você descobrirá que aprender a segunda, terceira, quarta fica mais fácil. Seja criativo. Use-a com diferentes combinações. Continue praticando até que você consiga fazer isso sem esforço e sem muito pensamento. Faça disso parte da sua memória muscular.

Dito isso, você dominou a edição no Vim. Parabéns!