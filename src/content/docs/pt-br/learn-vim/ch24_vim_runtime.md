---
description: Este capítulo oferece uma visão geral dos caminhos de execução do Vim,
  explicando como e quando são utilizados para personalizar sua experiência no editor.
title: Ch24. Vim Runtime
---

Nos capítulos anteriores, mencionei que o Vim procura automaticamente por caminhos especiais como `pack/` (Cap. 22) e `compiler/` (Cap. 19) dentro do diretório `~/.vim/`. Estes são exemplos de caminhos de tempo de execução do Vim.

O Vim tem mais caminhos de tempo de execução do que esses dois. Neste capítulo, você aprenderá uma visão geral de alto nível desses caminhos de tempo de execução. O objetivo deste capítulo é mostrar quando eles são chamados. Saber disso permitirá que você entenda e personalize ainda mais o Vim.

## Caminho de Tempo de Execução

Em uma máquina Unix, um dos seus caminhos de tempo de execução do Vim é `$HOME/.vim/` (se você tiver um sistema operacional diferente, como o Windows, seu caminho pode ser diferente). Para ver quais são os caminhos de tempo de execução para diferentes sistemas operacionais, consulte `:h 'runtimepath'`. Neste capítulo, usarei `~/.vim/` como o caminho de tempo de execução padrão.

## Scripts de Plugin

O Vim tem um caminho de tempo de execução de plugin que executa qualquer script neste diretório uma vez cada vez que o Vim é iniciado. Não confunda o nome "plugin" com plugins externos do Vim (como NERDTree, fzf.vim, etc).

Vá para o diretório `~/.vim/` e crie um diretório `plugin/`. Crie dois arquivos: `donut.vim` e `chocolate.vim`.

Dentro de `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

Dentro de `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Agora feche o Vim. Na próxima vez que você iniciar o Vim, verá tanto `"donut!"` quanto `"chocolate!"` ecoados. O caminho de tempo de execução do plugin pode ser usado para scripts de inicialização.

## Detecção de Tipo de Arquivo

Antes de começar, para garantir que essas detecções funcionem, certifique-se de que seu vimrc contenha pelo menos a seguinte linha:

```shell
filetype plugin indent on
```

Consulte `:h filetype-overview` para mais contexto. Essencialmente, isso ativa a detecção de tipo de arquivo do Vim.

Quando você abre um novo arquivo, o Vim geralmente sabe que tipo de arquivo é. Se você tiver um arquivo `hello.rb`, executar `:set filetype?` retorna a resposta correta `filetype=ruby`.

O Vim sabe como detectar tipos de arquivos "comuns" (Ruby, Python, Javascript, etc). Mas e se você tiver um arquivo personalizado? Você precisa ensinar o Vim a detectá-lo e atribuí-lo ao tipo de arquivo correto.

Existem dois métodos de detecção: usando o nome do arquivo e o conteúdo do arquivo.

### Detecção pelo Nome do Arquivo

A detecção pelo nome do arquivo detecta um tipo de arquivo usando o nome desse arquivo. Quando você abre o arquivo `hello.rb`, o Vim sabe que é um arquivo Ruby pela extensão `.rb`.

Existem duas maneiras de fazer a detecção pelo nome do arquivo: usando o diretório de tempo de execução `ftdetect/` e usando o arquivo de tempo de execução `filetype.vim`. Vamos explorar ambos.

#### `ftdetect/`

Vamos criar um arquivo obscuro (mas saboroso), `hello.chocodonut`. Quando você o abre e executa `:set filetype?`, como não é uma extensão de nome de arquivo comum, o Vim não sabe o que fazer com isso. Ele retorna `filetype=`.

Você precisa instruir o Vim a definir todos os arquivos que terminam com `.chocodonut` como um tipo de arquivo "chocodonut". Crie um diretório chamado `ftdetect/` na raiz do tempo de execução (`~/.vim/`). Dentro, crie um arquivo e nomeie-o `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). Dentro deste arquivo, adicione:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` e `BufRead` são acionados sempre que você cria um novo buffer e abre um novo buffer. `*.chocodonut` significa que este evento será acionado apenas se o buffer aberto tiver uma extensão de nome de arquivo `.chocodonut`. Finalmente, o comando `set filetype=chocodonut` define o tipo de arquivo como um tipo chocodonut.

Reinicie o Vim. Agora abra o arquivo `hello.chocodonut` e execute `:set filetype?`. Ele retorna `filetype=chocodonut`.

Delicioso! Você pode colocar quantos arquivos quiser dentro de `ftdetect/`. No futuro, você pode talvez adicionar `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, etc., se algum dia decidir expandir seus tipos de arquivos de donut.

Na verdade, existem duas maneiras de definir um tipo de arquivo no Vim. Uma é o que você acabou de usar `set filetype=chocodonut`. A outra maneira é executar `setfiletype chocodonut`. O primeiro comando `set filetype=chocodonut` *sempre* definirá o tipo de arquivo como tipo chocodonut, enquanto o último comando `setfiletype chocodonut` só definirá o tipo de arquivo se nenhum tipo de arquivo tiver sido definido ainda.

#### Arquivo de Tipo de Arquivo

O segundo método de detecção de arquivo exige que você crie um `filetype.vim` no diretório raiz (`~/.vim/filetype.vim`). Adicione isso dentro:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Crie um arquivo `hello.plaindonut`. Quando você o abre e executa `:set filetype?`, o Vim exibe o tipo de arquivo personalizado correto `filetype=plaindonut`.

Santo doce, funciona! A propósito, se você brincar com `filetype.vim`, pode notar que este arquivo está sendo executado várias vezes quando você abre `hello.plaindonut`. Para evitar isso, você pode adicionar uma proteção para que o script principal seja executado apenas uma vez. Atualize o `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` é um comando do Vim para parar de executar o restante do script. A expressão `"did_load_filetypes"` *não* é uma função interna do Vim. Na verdade, é uma variável global de dentro de `$VIMRUNTIME/filetype.vim`. Se você estiver curioso, execute `:e $VIMRUNTIME/filetype.vim`. Você encontrará essas linhas dentro:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Quando o Vim chama este arquivo, ele define a variável `did_load_filetypes` e a define como 1. 1 é verdadeiro no Vim. Você deve ler o restante do `filetype.vim` também. Veja se você consegue entender o que ele faz quando o Vim o chama.

### Script de Tipo de Arquivo

Vamos aprender como detectar e atribuir um tipo de arquivo com base no conteúdo do arquivo.

Suponha que você tenha uma coleção de arquivos sem uma extensão aceitável. A única coisa que esses arquivos têm em comum é que todos começam com a palavra "donutify" na primeira linha. Você quer atribuir esses arquivos a um tipo de arquivo `donut`. Crie novos arquivos chamados `sugardonut`, `glazeddonut` e `frieddonut` (sem extensão). Dentro de cada arquivo, adicione esta linha:

```shell
donutify
```

Quando você executa `:set filetype?` dentro de `sugardonut`, o Vim não sabe qual tipo de arquivo atribuir a este arquivo. Ele retorna `filetype=`.

Na raiz do tempo de execução, adicione um arquivo `scripts.vim` (`~/.vim/scripts.vim`). Dentro dele, adicione isto:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

A função `getline(1)` retorna o texto na primeira linha. Ela verifica se a primeira linha começa com a palavra "donutify". A função `did_filetype()` é uma função interna do Vim. Ela retornará verdadeiro quando um evento relacionado a tipo de arquivo for acionado pelo menos uma vez. É usada como uma proteção para parar de reexecutar o evento de tipo de arquivo.

Abra o arquivo `sugardonut` e execute `:set filetype?`, o Vim agora retorna `filetype=donut`. Se você abrir outros arquivos de donut (`glazeddonut` e `frieddonut`), o Vim também identifica seus tipos de arquivo como tipos `donut`.

Observe que `scripts.vim` é executado apenas quando o Vim abre um arquivo com um tipo de arquivo desconhecido. Se o Vim abrir um arquivo com um tipo de arquivo conhecido, `scripts.vim` não será executado.

## Plugin de Tipo de Arquivo

E se você quiser que o Vim execute scripts específicos de chocodonut quando abrir um arquivo de chocodonut e não execute esses scripts ao abrir um arquivo de plaindonut?

Você pode fazer isso com o caminho de tempo de execução de plugin de tipo de arquivo (`~/.vim/ftplugin/`). O Vim procura dentro deste diretório por um arquivo com o mesmo nome do tipo de arquivo que você acabou de abrir. Crie um `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Chamando do ftplugin chocodonut"
```

Crie outro arquivo ftplugin, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Chamando do ftplugin plaindonut"
```

Agora, cada vez que você abrir um tipo de arquivo chocodonut, o Vim executa os scripts de `~/.vim/ftplugin/chocodonut.vim`. Cada vez que você abrir um tipo de arquivo plaindonut, o Vim executa os scripts de `~/.vim/ftplugin/plaindonut.vim`.

Um aviso: esses arquivos são executados cada vez que um tipo de arquivo de buffer é definido (`set filetype=chocodonut`, por exemplo). Se você abrir 3 arquivos de chocodonut diferentes, os scripts serão executados um *total* de três vezes.

## Arquivos de Indentação

O Vim tem um caminho de tempo de execução de indentação que funciona de maneira semelhante ao ftplugin, onde o Vim procura um arquivo nomeado igual ao tipo de arquivo aberto. O propósito desses caminhos de tempo de execução de indentação é armazenar códigos relacionados à indentação. Se você tiver o arquivo `~/.vim/indent/chocodonut.vim`, ele será executado apenas quando você abrir um tipo de arquivo chocodonut. Você pode armazenar códigos relacionados à indentação para arquivos de chocodonut aqui.

## Cores

O Vim tem um caminho de tempo de execução de cores (`~/.vim/colors/`) para armazenar esquemas de cores. Qualquer arquivo que for para dentro do diretório será exibido no comando `:color`.

Se você tiver um arquivo `~/.vim/colors/beautifulprettycolors.vim`, quando você executar `:color` e pressionar Tab, verá `beautifulprettycolors` como uma das opções de cores. Se você preferir adicionar seu próprio esquema de cores, este é o lugar para ir.

Se você quiser conferir os esquemas de cores que outras pessoas fizeram, um bom lugar para visitar é [vimcolors](https://vimcolors.com/).

## Realce de Sintaxe

O Vim tem um caminho de tempo de execução de sintaxe (`~/.vim/syntax/`) para definir o realce de sintaxe.

Suponha que você tenha um arquivo `hello.chocodonut`, dentro dele você tenha as seguintes expressões:

```shell
(donut "saboroso")
(donut "salgado")
```

Embora o Vim agora conheça o tipo de arquivo correto, todos os textos têm a mesma cor. Vamos adicionar uma regra de realce de sintaxe para destacar a palavra-chave "donut". Crie um novo arquivo de sintaxe de chocodonut, `~/.vim/syntax/chocodonut.vim`. Dentro dele adicione:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Agora reabra o arquivo `hello.chocodonut`. As palavras-chave `donut` agora estão destacadas.

Este capítulo não abordará o realce de sintaxe em profundidade. É um tópico vasto. Se você estiver curioso, consulte `:h syntax.txt`.

O plugin [vim-polyglot](https://github.com/sheerun/vim-polyglot) é um ótimo plugin que fornece destaques para muitas linguagens de programação populares.

## Documentação

Se você criar um plugin, terá que criar sua própria documentação. Você usa o caminho de tempo de execução doc para isso.

Vamos criar uma documentação básica para as palavras-chave chocodonut e plaindonut. Crie um `donut.txt` (`~/.vim/doc/donut.txt`). Dentro, adicione estes textos:

```shell
*chocodonut* Donut de chocolate delicioso

*plaindonut* Sem bondade de chocolate, mas ainda delicioso
```

Se você tentar procurar por `chocodonut` e `plaindonut` (`:h chocodonut` e `:h plaindonut`), você não encontrará nada.

Primeiro, você precisa executar `:helptags` para gerar novas entradas de ajuda. Execute `:helptags ~/.vim/doc/`

Agora, se você executar `:h chocodonut` e `:h plaindonut`, encontrará essas novas entradas de ajuda. Observe que o arquivo agora é somente leitura e tem um tipo de arquivo "help".
## Carregamento Preguiçoso de Scripts

Todos os caminhos de tempo de execução que você aprendeu neste capítulo foram executados automaticamente. Se você quiser carregar um script manualmente, use o caminho de tempo de execução de autoload.

Crie um diretório de autoload (`~/.vim/autoload/`). Dentro desse diretório, crie um novo arquivo e nomeie-o como `tasty.vim` (`~/.vim/autoload/tasty.vim`). Dentro dele:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Observe que o nome da função é `tasty#donut`, não `donut()`. O sinal de número (`#`) é necessário ao usar o recurso de autoload. A convenção de nomenclatura de funções para o recurso de autoload é:

```shell
function fileName#functionName()
  ...
endfunction
```

Neste caso, o nome do arquivo é `tasty.vim` e o nome da função é (tecnicamente) `donut`.

Para invocar uma função, você precisa do comando `call`. Vamos chamar essa função com `:call tasty#donut()`.

Na primeira vez que você chamar a função, você deve ver *ambas* as mensagens de eco ("tasty.vim global" e "tasty#donut"). As chamadas subsequentes para a função `tasty#donut` exibirão apenas a mensagem de eco "testy#donut".

Quando você abre um arquivo no Vim, ao contrário dos caminhos de tempo de execução anteriores, os scripts de autoload não são carregados automaticamente. Apenas quando você chama explicitamente `tasty#donut()`, o Vim procura o arquivo `tasty.vim` e carrega tudo dentro dele, incluindo a função `tasty#donut()`. O autoload é o mecanismo perfeito para funções que usam recursos extensivos, mas que você não usa com frequência.

Você pode adicionar quantos diretórios aninhados com autoload quiser. Se você tiver o caminho de tempo de execução `~/.vim/autoload/one/two/three/tasty.vim`, você pode chamar a função com `:call one#two#three#tasty#donut()`.

## Scripts Após

O Vim tem um caminho de tempo de execução após (`~/.vim/after/`) que espelha a estrutura de `~/.vim/`. Qualquer coisa neste caminho é executada por último, então os desenvolvedores geralmente usam esses caminhos para sobrescritas de scripts.

Por exemplo, se você quiser sobrescrever os scripts de `plugin/chocolate.vim`, você pode criar `~/.vim/after/plugin/chocolate.vim` para colocar os scripts de sobrescrita. O Vim executará o `~/.vim/after/plugin/chocolate.vim` *após* o `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

O Vim tem uma variável de ambiente `$VIMRUNTIME` para scripts padrão e arquivos de suporte. Você pode verificá-la executando `:e $VIMRUNTIME`.

A estrutura deve parecer familiar. Ela contém muitos caminhos de tempo de execução que você aprendeu neste capítulo.

Lembre-se de que no Capítulo 21, você aprendeu que quando abre o Vim, ele procura arquivos vimrc em sete locais diferentes. Eu disse que o último local que o Vim verifica é `$VIMRUNTIME/defaults.vim`. Se o Vim não encontrar nenhum arquivo vimrc do usuário, ele usa um `defaults.vim` como vimrc.

Você já tentou executar o Vim sem um plugin de sintaxe como o vim-polyglot e mesmo assim seu arquivo ainda está destacado sintaticamente? Isso acontece porque quando o Vim não consegue encontrar um arquivo de sintaxe no caminho de tempo de execução, ele procura um arquivo de sintaxe no diretório de sintaxe de `$VIMRUNTIME`.

Para saber mais, confira `:h $VIMRUNTIME`.

## Opção Runtimepath

Para verificar seu runtimepath, execute `:set runtimepath?`

Se você usar o Vim-Plug ou gerenciadores de plugins externos populares, ele deve exibir uma lista de diretórios. Por exemplo, o meu mostra:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Uma das coisas que os gerenciadores de plugins fazem é adicionar cada plugin ao caminho de tempo de execução. Cada caminho de tempo de execução pode ter sua própria estrutura de diretório semelhante a `~/.vim/`.

Se você tiver um diretório `~/box/of/donuts/` e quiser adicionar esse diretório ao seu caminho de tempo de execução, você pode adicionar isso ao seu vimrc:

```shell
set rtp+=$HOME/box/of/donuts/
```

Se dentro de `~/box/of/donuts/`, você tiver um diretório de plugin (`~/box/of/donuts/plugin/hello.vim`) e um ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), o Vim executará todos os scripts de `plugin/hello.vim` quando você abrir o Vim. O Vim também executará `ftplugin/chocodonut.vim` quando você abrir um arquivo de chocodonut.

Tente isso você mesmo: crie um caminho arbitrário e adicione-o ao seu runtimepath. Adicione alguns dos caminhos de tempo de execução que você aprendeu neste capítulo. Certifique-se de que funcionem como esperado.

## Aprenda Runtime da Maneira Inteligente

Reserve um tempo para ler e brincar com esses caminhos de tempo de execução. Para ver como os caminhos de tempo de execução estão sendo usados na prática, vá ao repositório de um dos seus plugins favoritos do Vim e estude sua estrutura de diretório. Você deve ser capaz de entender a maioria deles agora. Tente acompanhar e discernir o quadro geral. Agora que você entende a estrutura de diretório do Vim, você está pronto para aprender Vimscript.