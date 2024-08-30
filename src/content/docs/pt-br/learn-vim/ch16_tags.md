---
description: Aprenda a usar tags no Vim para navegar rapidamente por definições em
  um código, facilitando a compreensão de bases de código desconhecidas.
title: Ch16. Tags
---

Um recurso útil na edição de texto é a capacidade de ir rapidamente a qualquer definição. Neste capítulo, você aprenderá como usar tags do Vim para fazer isso.

## Visão Geral das Tags

Suponha que alguém lhe entregou uma nova base de código:

```shell
one = One.new
one.donut
```

`One`? `donut`? Bem, isso pode ter sido óbvio para os desenvolvedores que escreveram o código naquela época, mas agora esses desenvolvedores não estão mais aqui e cabe a você entender esses códigos obscuros. Uma maneira de ajudar a entender isso é seguir o código-fonte onde `One` e `donut` são definidos.

Você pode procurá-los com `fzf` ou `grep` (ou `vimgrep`), mas neste caso, as tags são mais rápidas.

Pense nas tags como um catálogo de endereços:

```shell
Nome    Endereço
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Em vez de ter um par nome-endereço, as tags armazenam definições emparelhadas com endereços.

Vamos supor que você tenha esses dois arquivos Ruby dentro do mesmo diretório:

```shell
## one.rb
class One
  def initialize
    puts "Inicializado"
  end

  def donut
    puts "Bar"
  end
end
```

e

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Para pular para uma definição, você pode usar `Ctrl-]` no modo normal. Dentro de `two.rb`, vá para a linha onde `one.donut` está e mova o cursor sobre `donut`. Pressione `Ctrl-]`.

Ops, o Vim não conseguiu encontrar o arquivo de tags. Você precisa gerar o arquivo de tags primeiro.

## Gerador de Tags

O Vim moderno não vem com gerador de tags, então você terá que baixar um gerador de tags externo. Existem várias opções para escolher:

- ctags = Apenas C. Disponível em quase todos os lugares.
- exuberant ctags = Um dos mais populares. Tem suporte para muitas linguagens.
- universal ctags = Semelhante ao exuberant ctags, mas mais novo.
- etags = Para Emacs. Hmm...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Se você olhar tutoriais do Vim online, muitos recomendarão [exuberant ctags](http://ctags.sourceforge.net/). Ele suporta [41 linguagens de programação](http://ctags.sourceforge.net/languages.html). Eu usei e funcionou muito bem. No entanto, como não é mantido desde 2009, o Universal ctags seria uma escolha melhor. Ele funciona de forma semelhante ao exuberant ctags e está sendo mantido atualmente.

Não vou entrar em detalhes sobre como instalar o universal ctags. Confira o repositório [universal ctags](https://github.com/universal-ctags/ctags) para mais instruções.

Supondo que você tenha o universal ctags instalado, vamos gerar um arquivo de tags básico. Execute:

```shell
ctags -R .
```

A opção `R` diz ao ctags para executar uma varredura recursiva a partir da sua localização atual (`.`). Você deve ver um arquivo `tags` no seu diretório atual. Dentro dele, você verá algo como isto:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

O seu pode parecer um pouco diferente dependendo da sua configuração do Vim e do gerador de ctags. Um arquivo de tags é composto de duas partes: os metadados da tag e a lista de tags. Esses metadados (`!TAG_FILE...`) são geralmente controlados pelo gerador de ctags. Não vou discutir isso aqui, mas sinta-se à vontade para conferir a documentação deles para mais informações! A lista de tags é uma lista de todas as definições indexadas pelo ctags.

Agora vá para `two.rb`, coloque o cursor em `donut` e digite `Ctrl-]`. O Vim irá levá-lo ao arquivo `one.rb` na linha onde `def donut` está. Sucesso! Mas como o Vim fez isso?

## Anatomia das Tags

Vamos olhar o item de tag `donut`:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

O item de tag acima é composto por quatro componentes: um `tagname`, um `tagfile`, um `tagaddress` e opções de tag.
- `donut` é o `tagname`. Quando seu cursor está em "donut", o Vim procura no arquivo de tags por uma linha que contém a string "donut".
- `one.rb` é o `tagfile`. O Vim procura por um arquivo `one.rb`.
- `/^ def donut$/` é o `tagaddress`. `/.../` é um indicador de padrão. `^` é um padrão para o primeiro elemento em uma linha. É seguido por dois espaços, então a string `def donut`. Finalmente, `$` é um padrão para o último elemento em uma linha.
- `f class:One` é a opção de tag que diz ao Vim que a função `donut` é uma função (`f`) e faz parte da classe `One`.

Vamos olhar outro item na lista de tags:

```shell
One	one.rb	/^class One$/;"	c
```

Esta linha funciona da mesma forma que o padrão `donut`:

- `One` é o `tagname`. Note que com tags, a primeira busca é sensível a maiúsculas e minúsculas. Se você tiver `One` e `one` na lista, o Vim priorizará `One` sobre `one`.
- `one.rb` é o `tagfile`. O Vim procura por um arquivo `one.rb`.
- `/^class One$/` é o padrão `tagaddress`. O Vim procura por uma linha que começa com (`^`) `class` e termina com (`$`) `One`.
- `c` é uma das possíveis opções de tag. Como `One` é uma classe Ruby e não um procedimento, é marcada com um `c`.

Dependendo de qual gerador de tags você usa, o conteúdo do seu arquivo de tags pode parecer diferente. No mínimo, um arquivo de tags deve ter um destes formatos:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## O Arquivo de Tags

Você aprendeu que um novo arquivo, `tags`, é criado após executar `ctags -R .`. Como o Vim sabe onde procurar o arquivo de tags?

Se você executar `:set tags?`, pode ver `tags=./tags,tags` (dependendo das suas configurações do Vim, pode ser diferente). Aqui o Vim procura todas as tags no caminho do arquivo atual no caso de `./tags` e no diretório atual (raiz do seu projeto) no caso de `tags`.

Além disso, no caso de `./tags`, o Vim primeiro procurará um arquivo de tags dentro do caminho do seu arquivo atual, independentemente de quão aninhado ele esteja, depois procurará um arquivo de tags do diretório atual (raiz do projeto). O Vim para após encontrar a primeira correspondência.

Se o seu arquivo `'tags'` dissesse `tags=./tags,tags,/user/iggy/mytags/tags`, então o Vim também procuraria no diretório `/user/iggy/mytags` por um arquivo de tags após o Vim terminar de procurar nos diretórios `./tags` e `tags`. Você não precisa armazenar seu arquivo de tags dentro do seu projeto, pode mantê-los separados.

Para adicionar um novo local de arquivo de tags, use o seguinte:

```shell
set tags+=path/to/my/tags/file
```

## Gerando Tags para um Grande Projeto

Se você tentar executar ctags em um grande projeto, pode demorar muito porque o Vim também olha dentro de todos os diretórios aninhados. Se você é um desenvolvedor Javascript, sabe que `node_modules` pode ser muito grande. Imagine se você tiver cinco subprojetos e cada um contém seu próprio diretório `node_modules`. Se você executar `ctags -R .`, o ctags tentará escanear todos os 5 `node_modules`. Provavelmente você não precisa executar ctags em `node_modules`.

Para executar ctags excluindo o `node_modules`, execute:

```shell
ctags -R --exclude=node_modules .
```

Desta vez deve levar menos de um segundo. A propósito, você pode usar a opção `exclude` várias vezes:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

A questão é que, se você quiser omitir um diretório, `--exclude` é seu melhor amigo.

## Navegação entre Tags

Você pode obter um bom desempenho usando apenas `Ctrl-]`, mas vamos aprender mais algumas dicas. A tecla de salto de tag `Ctrl-]` tem uma alternativa no modo de linha de comando: `:tag {tag-name}`. Se você executar:

```shell
:tag donut
```

O Vim irá pular para o método `donut`, assim como fazer `Ctrl-]` na string "donut". Você também pode autocompletar o argumento, com `<Tab>`:

```shell
:tag d<Tab>
```

O Vim lista todas as tags que começam com "d". Neste caso, "donut".

Em um projeto real, você pode encontrar vários métodos com o mesmo nome. Vamos atualizar os dois arquivos Ruby de antes. Dentro de `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Inicializado"
  end

  def donut
    puts "um donut"
  end

  def pancake
    puts "uma panqueca"
  end
end
```

Dentro de `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Duas panquecas"
end

one = One.new
one.donut
puts pancake
```

Se você estiver codificando junto, não se esqueça de executar `ctags -R .` novamente, pois agora você tem vários novos procedimentos. Você tem duas instâncias do procedimento `pancake`. Se você estiver dentro de `two.rb` e pressionar `Ctrl-]`, o que aconteceria?

O Vim irá pular para `def pancake` dentro de `two.rb`, não para `def pancake` dentro de `one.rb`. Isso ocorre porque o Vim vê o procedimento `pancake` dentro de `two.rb` como tendo uma prioridade maior do que o outro procedimento `pancake`.

## Prioridade das Tags

Nem todas as tags são iguais. Algumas tags têm prioridades mais altas. Se o Vim se deparar com nomes de itens duplicados, o Vim verifica a prioridade da palavra-chave. A ordem é:

1. Uma tag estática totalmente correspondente no arquivo atual.
2. Uma tag global totalmente correspondente no arquivo atual.
3. Uma tag global totalmente correspondente em um arquivo diferente.
4. Uma tag estática totalmente correspondente em outro arquivo.
5. Uma tag estática correspondente sem diferenciar maiúsculas e minúsculas no arquivo atual.
6. Uma tag global correspondente sem diferenciar maiúsculas e minúsculas no arquivo atual.
7. Uma tag global correspondente sem diferenciar maiúsculas e minúsculas em um arquivo diferente.
8. Uma tag estática correspondente sem diferenciar maiúsculas e minúsculas no arquivo atual.

De acordo com a lista de prioridades, o Vim prioriza a correspondência exata encontrada no mesmo arquivo. É por isso que o Vim escolhe o procedimento `pancake` dentro de `two.rb` em vez do procedimento `pancake` dentro de `one.rb`. Existem algumas exceções à lista de prioridades acima, dependendo das suas configurações de `'tagcase'`, `'ignorecase'` e `'smartcase'`, mas não vou discutir isso aqui. Se você estiver interessado, confira `:h tag-priority`.

## Saltos de Tag Seletivos

Seria bom se você pudesse escolher quais itens de tag pular em vez de sempre ir para o item de tag de maior prioridade. Talvez você realmente precise pular para o método `pancake` em `one.rb` e não para o de `two.rb`. Para fazer isso, você pode usar `:tselect`. Execute:

```shell
:tselect pancake
```

Você verá, na parte inferior da tela:
## pri kind tag               file
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Se você digitar 2, o Vim irá pular para o procedimento em `one.rb`. Se você digitar 1, o Vim irá pular para o procedimento em `two.rb`.

Preste atenção na coluna `pri`. Você tem `F C` na primeira correspondência e `F` na segunda correspondência. É isso que o Vim usa para determinar a prioridade da tag. `F C` significa uma tag global totalmente correspondente (`F`) no arquivo atual (`C`). `F` significa apenas uma tag global totalmente correspondente (`F`). `F C` sempre tem uma prioridade maior do que `F`.

Se você executar `:tselect donut`, o Vim também solicitará que você selecione qual item da tag pular, mesmo que haja apenas uma opção para escolher. Existe uma maneira de o Vim solicitar a lista de tags apenas se houver várias correspondências e pular imediatamente se apenas uma tag for encontrada?

Claro! O Vim tem um método `:tjump`. Execute:

```shell
:tjump donut
```

O Vim irá imediatamente pular para o procedimento `donut` em `one.rb`, muito parecido com a execução de `:tag donut`. Agora execute:

```shell
:tjump pancake
```

O Vim irá solicitar opções de tags para escolher, muito parecido com a execução de `:tselect pancake`. Com `tjump` você obtém o melhor de ambos os métodos.

O Vim tem uma tecla de modo normal para `tjump`: `g Ctrl-]`. Pessoalmente, gosto mais de `g Ctrl-]` do que de `Ctrl-]`.

## Autocompletar Com Tags

As tags podem ajudar nos autocompletamentos. Lembre-se do capítulo 6, Modo de Inserção, que você pode usar o sub-modo `Ctrl-X` para fazer vários autocompletamentos. Um sub-modo de autocompletar que eu não mencionei foi `Ctrl-]`. Se você fizer `Ctrl-X Ctrl-]` enquanto estiver no modo de inserção, o Vim usará o arquivo de tags para autocompletar.

Se você entrar no modo de inserção e digitar `Ctrl-x Ctrl-]`, você verá:

```shell
One
donut
initialize
pancake
```

## Pilha de Tags

O Vim mantém uma lista de todas as tags que você pulou para e de uma pilha de tags. Você pode ver essa pilha com `:tags`. Se você primeiro pulou para `pancake`, seguido de `donut`, e executou `:tags`, você verá:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Note o símbolo `>` acima. Ele mostra sua posição atual na pilha. Para "desempilhar" a pilha e voltar uma pilha anterior, você pode executar `:pop`. Tente, depois execute `:tags` novamente:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Note que o símbolo `>` agora está na linha dois, onde está o `donut`. Desempilhe mais uma vez, depois execute `:tags` novamente:

```shell
  # TO tag         FROM line  in file/text
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

No modo normal, você pode executar `Ctrl-t` para alcançar o mesmo efeito que `:pop`.

## Geração Automática de Tags

Uma das maiores desvantagens das tags do Vim é que cada vez que você faz uma mudança significativa, precisa regenerar o arquivo de tags. Se você renomeou recentemente o procedimento `pancake` para o procedimento `waffle`, o arquivo de tags não sabia que o procedimento `pancake` havia sido renomeado. Ele ainda armazenava `pancake` na lista de tags. Você precisa executar `ctags -R .` para criar um arquivo de tags atualizado. Recriar um novo arquivo de tags dessa maneira pode ser trabalhoso.

Felizmente, existem vários métodos que você pode empregar para gerar tags automaticamente.

## Gerar uma Tag ao Salvar

O Vim tem um método de autocomando (`autocmd`) para executar qualquer comando em um evento disparador. Você pode usar isso para gerar tags a cada salvamento. Execute:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Divisão:
- `autocmd` é um comando da linha de comando. Aceita um evento, padrão de arquivo e um comando.
- `BufWritePost` é um evento para salvar um buffer. Cada vez que você salva um arquivo, você dispara um evento `BufWritePost`.
- `.rb` é um padrão de arquivo para arquivos ruby.
- `silent` é na verdade parte do comando que você está passando. Sem isso, o Vim exibirá `pressione ENTER ou digite o comando para continuar` cada vez que você disparar o autocomando.
- `!ctags -R .` é o comando a ser executado. Lembre-se que `!cmd` de dentro do Vim executa um comando de terminal.

Agora, cada vez que você salvar de dentro de um arquivo ruby, o Vim executará `ctags -R .`.

## Usando Plugins

Existem vários plugins para gerar ctags automaticamente:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Eu uso o vim-gutentags. É simples de usar e funcionará imediatamente.

## Ctags e Hooks do Git

Tim Pope, autor de muitos ótimos plugins do Vim, escreveu um blog sugerindo o uso de hooks do git. [Confira aqui](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Aprenda Tags da Maneira Inteligente

Uma tag é útil uma vez configurada corretamente. Suponha que você esteja diante de uma nova base de código e queira entender o que `functionFood` faz, você pode facilmente lê-la pulando para sua definição. Dentro dela, você aprende que também chama `functionBreakfast`. Você a segue e aprende que chama `functionPancake`. Seu gráfico de chamadas de função se parece com isso:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Isso lhe dá uma visão de que esse fluxo de código está relacionado a ter uma panqueca no café da manhã.

Para aprender mais sobre tags, consulte `:h tags`. Agora que você sabe como usar tags, vamos explorar um recurso diferente: dobradura.