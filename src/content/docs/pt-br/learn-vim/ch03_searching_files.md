---
description: Este capítulo apresenta uma introdução sobre como pesquisar rapidamente
  no Vim, abordando métodos sem plugins e com o plugin fzf.vim para aumentar a produtividade.
title: Ch03. Searching Files
---

O objetivo deste capítulo é te dar uma introdução sobre como buscar rapidamente no Vim. Ser capaz de buscar rapidamente é uma ótima maneira de impulsionar sua produtividade no Vim. Quando descobri como buscar arquivos rapidamente, fiz a transição para usar o Vim em tempo integral.

Este capítulo está dividido em duas partes: como buscar sem plugins e como buscar com o plugin [fzf.vim](https://github.com/junegunn/fzf.vim). Vamos começar!

## Abrindo e Editando Arquivos

Para abrir um arquivo no Vim, você pode usar `:edit`.

```shell
:edit file.txt
```

Se `file.txt` existir, ele abre o buffer `file.txt`. Se `file.txt` não existir, ele cria um novo buffer para `file.txt`.

A autocompletação com `<Tab>` funciona com `:edit`. Por exemplo, se seu arquivo estiver dentro de um diretório de *controller* de usuários do [Rails](https://rubyonrails.org/) `./app/controllers/users_controllers.rb`, você pode usar `<Tab>` para expandir os termos rapidamente:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` aceita argumentos com caracteres curinga. `*` corresponde a qualquer arquivo no diretório atual. Se você está apenas procurando arquivos com a extensão `.yml` no diretório atual:

```shell
:edit *.yml<Tab>
```

O Vim lhe dará uma lista de todos os arquivos `.yml` no diretório atual para escolher.

Você pode usar `**` para buscar recursivamente. Se você quiser procurar todos os arquivos `*.md` no seu projeto, mas não tem certeza em quais diretórios, você pode fazer isso:

```shell
:edit **/*.md<Tab>
```

`:edit` pode ser usado para executar `netrw`, o explorador de arquivos embutido do Vim. Para fazer isso, dê a `:edit` um argumento de diretório em vez de um arquivo:

```shell
:edit .
:edit test/unit/
```

## Buscando Arquivos Com Find

Você pode encontrar arquivos com `:find`. Por exemplo:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

A autocompletação também funciona com `:find`:

```shell
:find p<Tab>                " para encontrar package.json
:find a<Tab>c<Tab>u<Tab>    " para encontrar app/controllers/users_controller.rb
```

Você pode notar que `:find` se parece com `:edit`. Qual é a diferença?

## Find e Path

A diferença é que `:find` encontra arquivos no `path`, enquanto `:edit` não. Vamos aprender um pouco sobre `path`. Uma vez que você aprenda a modificar seus paths, `:find` pode se tornar uma ferramenta de busca poderosa. Para verificar quais são seus paths, faça:

```shell
:set path?
```

Por padrão, os seus provavelmente se parecem com isso:

```shell
path=.,/usr/include,,
```

- `.` significa buscar no diretório do arquivo atualmente aberto.
- `,` significa buscar no diretório atual.
- `/usr/include` é o diretório típico para arquivos de cabeçalho de bibliotecas C.

Os dois primeiros são importantes em nosso contexto e o terceiro pode ser ignorado por enquanto. A lição aqui é que você pode modificar seus próprios paths, onde o Vim irá procurar arquivos. Vamos supor que esta é a estrutura do seu projeto:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Se você quiser ir para `users_controller.rb` a partir do diretório raiz, você terá que passar por vários diretórios (e pressionar uma quantidade considerável de tabs). Muitas vezes, ao trabalhar com um framework, você passa 90% do seu tempo em um diretório específico. Nessa situação, você só se importa em ir para o diretório `controllers/` com o menor número de toques no teclado. A configuração de `path` pode encurtar essa jornada.

Você precisa adicionar `app/controllers/` ao `path` atual. Aqui está como você pode fazer isso:

```shell
:set path+=app/controllers/
```

Agora que seu path está atualizado, quando você digitar `:find u<Tab>`, o Vim agora irá buscar dentro do diretório `app/controllers/` por arquivos que começam com "u".

Se você tiver um diretório `controllers/` aninhado, como `app/controllers/account/users_controller.rb`, o Vim não encontrará `users_controllers`. Em vez disso, você precisa adicionar `:set path+=app/controllers/**` para que a autocompletação encontre `users_controller.rb`. Isso é ótimo! Agora você pode encontrar o controller de usuários com 1 pressionar de tab em vez de 3.

Você pode estar pensando em adicionar todos os diretórios do projeto para que, ao pressionar `tab`, o Vim busque em todos os lugares por aquele arquivo, assim:

```shell
:set path+=$PWD/**
```

`$PWD` é o diretório de trabalho atual. Se você tentar adicionar todo o seu projeto ao `path` esperando tornar todos os arquivos acessíveis ao pressionar `tab`, embora isso possa funcionar para um projeto pequeno, fazer isso irá desacelerar significativamente sua busca se você tiver um grande número de arquivos em seu projeto. Eu recomendo adicionar apenas o `path` dos seus arquivos / diretórios mais visitados.

Você pode adicionar `set path+={seu-path-aqui}` no seu vimrc. Atualizar o `path` leva apenas alguns segundos e fazer isso pode te economizar muito tempo.

## Buscando em Arquivos Com Grep

Se você precisa buscar em arquivos (encontrar frases em arquivos), você pode usar grep. O Vim tem duas maneiras de fazer isso:

- Grep interno (`:vim`. Sim, está escrito `:vim`. É uma abreviação para `:vimgrep`).
- Grep externo (`:grep`).

Vamos passar pelo grep interno primeiro. `:vim` tem a seguinte sintaxe:

```shell
:vim /padrão/ arquivo
```

- `/padrão/` é um padrão regex do seu termo de busca.
- `arquivo` é o argumento do arquivo. Você pode passar múltiplos argumentos. O Vim irá buscar pelo padrão dentro do argumento do arquivo. Semelhante ao `:find`, você pode passar `*` e `**` como curingas.

Por exemplo, para procurar todas as ocorrências da string "breakfast" dentro de todos os arquivos ruby (`.rb`) dentro do diretório `app/controllers/`:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Após executar isso, você será redirecionado para o primeiro resultado. O comando de busca `vim` do Vim usa a operação `quickfix`. Para ver todos os resultados da busca, execute `:copen`. Isso abre uma janela `quickfix`. Aqui estão alguns comandos úteis de quickfix para te deixar produtivo imediatamente:

```shell
:copen        Abre a janela quickfix
:cclose       Fecha a janela quickfix
:cnext        Vai para o próximo erro
:cprevious    Vai para o erro anterior
:colder       Vai para a lista de erros mais antiga
:cnewer       Vai para a lista de erros mais nova
```

Para aprender mais sobre quickfix, confira `:h quickfix`.

Você pode notar que executar grep interno (`:vim`) pode ficar lento se você tiver um grande número de correspondências. Isso ocorre porque o Vim carrega cada arquivo correspondente na memória, como se estivesse sendo editado. Se o Vim encontrar um grande número de arquivos correspondendo à sua busca, ele irá carregá-los todos e, portanto, consumirá uma grande quantidade de memória.

Vamos falar sobre grep externo. Por padrão, ele usa o comando `grep` do terminal. Para buscar por "lunch" dentro de um arquivo ruby no diretório `app/controllers/`, você pode fazer isso:

```shell
:grep -R "lunch" app/controllers/
```

Note que, em vez de usar `/padrão/`, ele segue a sintaxe do grep do terminal `"padrão"`. Ele também exibe todas as correspondências usando `quickfix`.

O Vim define a variável `grepprg` para determinar qual programa externo executar ao rodar o comando `:grep` do Vim, para que você não precise fechar o Vim e invocar o comando `grep` do terminal. Mais tarde, eu vou te mostrar como mudar o programa padrão invocado ao usar o comando `:grep` do Vim.

## Navegando em Arquivos Com Netrw

`netrw` é o explorador de arquivos embutido do Vim. É útil para ver a hierarquia de um projeto. Para executar `netrw`, você precisa dessas duas configurações no seu `.vimrc`:

```shell
set nocp
filetype plugin on
```

Como `netrw` é um tópico vasto, eu vou cobrir apenas o uso básico, mas deve ser suficiente para te colocar em funcionamento. Você pode iniciar `netrw` quando lançar o Vim passando um diretório como parâmetro em vez de um arquivo. Por exemplo:

```shell
vim .
vim src/client/
vim app/controllers/
```

Para lançar `netrw` de dentro do Vim, você pode usar o comando `:edit` e passar um parâmetro de diretório em vez de um nome de arquivo:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Existem outras maneiras de abrir a janela `netrw` sem passar um diretório:

```shell
:Explore     Inicia netrw no arquivo atual
:Sexplore    Sem brincadeira. Inicia netrw na metade superior da tela
:Vexplore    Inicia netrw na metade esquerda da tela
```

Você pode navegar no `netrw` com os movimentos do Vim (os movimentos serão cobertos em profundidade em um capítulo posterior). Se você precisar criar, deletar ou renomear um arquivo ou diretório, aqui está uma lista de comandos úteis do `netrw`:

```shell
%    Cria um novo arquivo
d    Cria um novo diretório
R    Renomeia um arquivo ou diretório
D    Deleta um arquivo ou diretório
```

`:h netrw` é muito abrangente. Confira se você tiver tempo.

Se você achar o `netrw` muito sem graça e precisar de mais sabor, [vim-vinegar](https://github.com/tpope/vim-vinegar) é um bom plugin para melhorar o `netrw`. Se você está procurando um explorador de arquivos diferente, [NERDTree](https://github.com/preservim/nerdtree) é uma boa alternativa. Confira!

## Fzf

Agora que você aprendeu como buscar arquivos no Vim com ferramentas embutidas, vamos aprender como fazer isso com plugins.

Uma coisa que editores de texto modernos acertam e que o Vim não acertou é como é fácil encontrar arquivos, especialmente via busca difusa. Nesta segunda metade do capítulo, eu vou te mostrar como usar [fzf.vim](https://github.com/junegunn/fzf.vim) para tornar a busca no Vim fácil e poderosa.

## Configuração

Primeiro, certifique-se de que você tenha [fzf](https://github.com/junegunn/fzf) e [ripgrep](https://github.com/BurntSushi/ripgrep) baixados. Siga as instruções no repositório deles no github. Os comandos `fzf` e `rg` devem agora estar disponíveis após as instalações bem-sucedidas.

Ripgrep é uma ferramenta de busca muito semelhante ao grep (daí o nome). Geralmente, é mais rápido que o grep e possui muitos recursos úteis. Fzf é um buscador difuso de linha de comando de propósito geral. Você pode usá-lo com qualquer comando, incluindo ripgrep. Juntos, eles formam uma combinação poderosa de ferramentas de busca.

O Fzf não usa ripgrep por padrão, então precisamos dizer ao fzf para usar ripgrep definindo uma variável `FZF_DEFAULT_COMMAND`. No meu `.zshrc` (`.bashrc` se você usar bash), eu tenho isso:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Preste atenção em `-m` em `FZF_DEFAULT_OPTS`. Esta opção nos permite fazer múltiplas seleções com `<Tab>` ou `<Shift-Tab>`. Você não precisa desta linha para fazer o fzf funcionar com o Vim, mas eu acho que é uma opção útil de se ter. Isso será útil quando você quiser realizar busca e substituição em múltiplos arquivos, que eu vou cobrir em breve. O comando fzf aceita muitas outras opções, mas eu não vou cobri-las aqui. Para aprender mais, confira o [repositório do fzf](https://github.com/junegunn/fzf#usage) ou `man fzf`. No mínimo, você deve ter `export FZF_DEFAULT_COMMAND='rg'`.

Após instalar o fzf e o ripgrep, vamos configurar o plugin fzf. Estou usando o gerenciador de plugins [vim-plug](https://github.com/junegunn/vim-plug) neste exemplo, mas você pode usar qualquer gerenciador de plugins.

Adicione isso dentro dos plugins do seu `.vimrc`. Você precisa usar o plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (criado pelo mesmo autor do fzf).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Após adicionar essas linhas, você precisará abrir o `vim` e executar `:PlugInstall`. Isso instalará todos os plugins que estão definidos no seu arquivo `vimrc` e que não estão instalados. No nosso caso, ele instalará `fzf.vim` e `fzf`.

Para mais informações sobre este plugin, você pode conferir o [repositório do fzf.vim](https://github.com/junegunn/fzf/blob/master/README-VIM.md).
## Sintaxe do Fzf

Para usar o fzf de forma eficiente, você deve aprender algumas sintaxes básicas do fzf. Felizmente, a lista é curta:

- `^` é uma correspondência exata de prefixo. Para buscar uma frase que comece com "bem-vindo": `^bem-vindo`.
- `$` é uma correspondência exata de sufixo. Para buscar uma frase que termine com "meus amigos": `amigos$`.
- `'` é uma correspondência exata. Para buscar a frase "bem-vindo meus amigos": `'bem-vindo meus amigos`.
- `|` é uma correspondência "ou". Para buscar "amigos" ou "inimigos": `amigos | inimigos`.
- `!` é uma correspondência inversa. Para buscar uma frase contendo "bem-vindo" e não "amigos": `bem-vindo !amigos`

Você pode misturar e combinar essas opções. Por exemplo, `^olá | ^bem-vindo amigos$` buscará a frase que começa com "bem-vindo" ou "olá" e termina com "amigos".

## Encontrando Arquivos

Para buscar arquivos dentro do Vim usando o plugin fzf.vim, você pode usar o método `:Files`. Execute `:Files` a partir do Vim e você será solicitado com o prompt de busca do fzf.

Como você usará esse comando com frequência, é bom mapeá-lo para um atalho de teclado. Eu mapeio o meu para `Ctrl-f`. No meu vimrc, eu tenho isso:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Buscando em Arquivos

Para buscar dentro de arquivos, você pode usar o comando `:Rg`.

Novamente, como você provavelmente usará isso com frequência, vamos mapeá-lo para um atalho de teclado. Eu mapeio o meu para `<Leader>f`. A tecla `<Leader>` é mapeada para `\` por padrão.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Outras Buscas

O fzf.vim fornece muitos outros comandos de busca. Eu não vou passar por cada um deles aqui, mas você pode conferi-los [aqui](https://github.com/junegunn/fzf.vim#commands).

Aqui está como meus mapeamentos do fzf se parecem:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Substituindo Grep por Rg

Como mencionado anteriormente, o Vim tem duas maneiras de buscar em arquivos: `:vim` e `:grep`. `:grep` usa uma ferramenta de busca externa que você pode reassociar usando a palavra-chave `grepprg`. Eu vou mostrar como configurar o Vim para usar o ripgrep em vez do grep do terminal ao executar o comando `:grep`.

Agora vamos configurar `grepprg` para que o comando `:grep` do Vim use o ripgrep. Adicione isso no seu vimrc:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Sinta-se à vontade para modificar algumas das opções acima! Para mais informações sobre o que as opções acima significam, confira `man rg`.

Depois de atualizar `grepprg`, agora quando você executar `:grep`, ele executa `rg --vimgrep --smart-case --follow` em vez de `grep`. Se você quiser buscar por "donut" usando o ripgrep, agora pode executar um comando mais sucinto `:grep "donut"` em vez de `:grep "donut" . -R`.

Assim como o antigo `:grep`, este novo `:grep` também usa quickfix para exibir resultados.

Você pode se perguntar: "Bem, isso é legal, mas eu nunca usei `:grep` no Vim, além disso, não posso apenas usar `:Rg` para encontrar frases em arquivos? Quando eu precisaria usar `:grep`?"

Essa é uma pergunta muito boa. Você pode precisar usar `:grep` no Vim para fazer busca e substituição em múltiplos arquivos, o que eu vou cobrir a seguir.

## Buscar e Substituir em Múltiplos Arquivos

Editores de texto modernos como o VSCode tornam muito fácil buscar e substituir uma string em vários arquivos. Nesta seção, eu vou mostrar dois métodos diferentes para fazer isso facilmente no Vim.

O primeiro método é substituir *todas* as frases correspondentes em seu projeto. Você precisará usar `:grep`. Se você quiser substituir todas as instâncias de "pizza" por "donut", aqui está o que você deve fazer:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Vamos analisar os comandos:

1. `:grep pizza` usa ripgrep para buscar todas as instâncias de "pizza" (a propósito, isso ainda funcionaria mesmo que você não tivesse reassociado `grepprg` para usar ripgrep. Você teria que fazer `:grep "pizza" . -R` em vez de `:grep "pizza"`).
2. `:cfdo` executa qualquer comando que você passar para todos os arquivos na sua lista de quickfix. Neste caso, seu comando é o comando de substituição `%s/pizza/donut/g`. O pipe (`|`) é um operador de encadeamento. O comando `update` salva cada arquivo após a substituição. Eu vou cobrir o comando de substituição em mais detalhes em um capítulo posterior.

O segundo método é buscar e substituir em arquivos selecionados. Com este método, você pode escolher manualmente quais arquivos deseja realizar a seleção e substituição. Aqui está o que você deve fazer:

1. Limpe seus buffers primeiro. É imperativo que sua lista de buffers contenha apenas os arquivos nos quais você deseja aplicar a substituição. Você pode reiniciar o Vim ou executar o comando `:%bd | e#` (`%bd` exclui todos os buffers e `e#` abre o arquivo que você estava anteriormente).
2. Execute `:Files`.
3. Selecione todos os arquivos nos quais deseja realizar a busca e substituição. Para selecionar múltiplos arquivos, use `<Tab>` / `<Shift-Tab>`. Isso só é possível se você tiver a flag múltipla (`-m`) nas `FZF_DEFAULT_OPTS`.
4. Execute `:bufdo %s/pizza/donut/g | update`. O comando `:bufdo %s/pizza/donut/g | update` se parece com o comando anterior `:cfdo %s/pizza/donut/g | update`. A diferença é que, em vez de substituir todas as entradas do quickfix (`:cfdo`), você está substituindo todas as entradas do buffer (`:bufdo`).

## Aprenda a Buscar da Maneira Inteligente

Buscar é o pão com manteiga da edição de texto. Aprender a buscar bem no Vim melhorará significativamente seu fluxo de trabalho de edição de texto.

O fzf.vim é um divisor de águas. Eu não consigo imaginar usar o Vim sem ele. Eu acho muito importante ter uma boa ferramenta de busca ao começar com o Vim. Eu já vi pessoas lutando para fazer a transição para o Vim porque parece que falta recursos críticos que editores de texto modernos têm, como uma funcionalidade de busca fácil e poderosa. Eu espero que este capítulo ajude você a tornar a transição para o Vim mais fácil.

Você também acabou de ver a extensibilidade do Vim em ação - a capacidade de estender a funcionalidade de busca com um plugin e um programa externo. No futuro, tenha em mente quais outros recursos você deseja estender no Vim. As chances são de que já esteja no Vim, alguém criou um plugin ou já existe um programa para isso. A seguir, você aprenderá sobre um tópico muito importante no Vim: a gramática do Vim.