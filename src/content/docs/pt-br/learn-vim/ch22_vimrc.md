---
description: Neste capítulo, aprenda a organizar e configurar o vimrc, entendendo
  onde o Vim busca o arquivo de configuração e como personalizá-lo eficientemente.
title: Ch22. Vimrc
---

Nos capítulos anteriores, você aprendeu como usar o Vim. Neste capítulo, você aprenderá como organizar e configurar o vimrc.

## Como o Vim Encontra o Vimrc

A sabedoria convencional para o vimrc é adicionar um arquivo oculto `.vimrc` no diretório home `~/.vimrc` (pode ser diferente dependendo do seu sistema operacional).

Nos bastidores, o Vim procura em vários lugares por um arquivo vimrc. Aqui estão os locais que o Vim verifica:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Quando você inicia o Vim, ele verificará os seis locais acima nessa ordem em busca de um arquivo vimrc. O primeiro arquivo vimrc encontrado será usado e os demais serão ignorados.

Primeiro, o Vim procurará um `$VIMINIT`. Se não houver nada lá, o Vim verificará `$HOME/.vimrc`. Se não houver nada lá, o Vim verificará `$HOME/.vim/vimrc`. Se o Vim encontrá-lo, ele parará de procurar e usará `$HOME/.vim/vimrc`.

O primeiro local, `$VIMINIT`, é uma variável de ambiente. Por padrão, ela está indefinida. Se você quiser usar `~/dotfiles/testvimrc` como seu valor de `$VIMINIT`, você pode criar uma variável de ambiente contendo o caminho desse vimrc. Depois de executar `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`, o Vim agora usará `~/dotfiles/testvimrc` como seu arquivo vimrc.

O segundo local, `$HOME/.vimrc`, é o caminho convencional para muitos usuários do Vim. `$HOME` em muitos casos é seu diretório home (`~`). Se você tiver um arquivo `~/.vimrc`, o Vim usará isso como seu arquivo vimrc.

O terceiro, `$HOME/.vim/vimrc`, está localizado dentro do diretório `~/.vim`. Você pode já ter o diretório `~/.vim` para seus plugins, scripts personalizados ou arquivos de visualização. Observe que não há ponto no nome do arquivo vimrc (`$HOME/.vim/.vimrc` não funcionará, mas `$HOME/.vim/vimrc` funcionará).

O quarto, `$EXINIT`, funciona de maneira semelhante ao `$VIMINIT`.

O quinto, `$HOME/.exrc`, funciona de maneira semelhante ao `$HOME/.vimrc`.

O sexto, `$VIMRUNTIME/defaults.vim`, é o vimrc padrão que vem com sua compilação do Vim. No meu caso, tenho o Vim 8.2 instalado usando o Homebrew, então meu caminho é (`/usr/local/share/vim/vim82`). Se o Vim não encontrar nenhum dos seis arquivos vimrc anteriores, ele usará este arquivo.

Para o restante deste capítulo, estou assumindo que o vimrc usa o caminho `~/.vimrc`.

## O Que Colocar no Meu Vimrc?

Uma pergunta que fiz quando comecei foi: "O que devo colocar no meu vimrc?"

A resposta é: "qualquer coisa que você quiser". A tentação de copiar e colar o vimrc de outras pessoas é real, mas você deve resistir a isso. Se você insistir em usar o vimrc de outra pessoa, certifique-se de saber o que ele faz, por que e como ele/ela o usa, e, mais importante, se é relevante para você. Só porque alguém usa não significa que você também usará.

## Conteúdo Básico do Vimrc

Em resumo, um vimrc é uma coleção de:
- Plugins
- Configurações
- Funções Personalizadas
- Comandos Personalizados
- Mapeamentos

Existem outras coisas não mencionadas acima, mas, em geral, isso cobre a maioria dos casos de uso.

### Plugins

Nos capítulos anteriores, mencionei diferentes plugins, como [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo) e [vim-fugitive](https://github.com/tpope/vim-fugitive).

Dez anos atrás, gerenciar plugins era um pesadelo. No entanto, com o surgimento de gerenciadores de plugins modernos, a instalação de plugins agora pode ser feita em segundos. Atualmente, estou usando [vim-plug](https://github.com/junegunn/vim-plug) como meu gerenciador de plugins, então o usarei nesta seção. O conceito deve ser semelhante a outros gerenciadores de plugins populares. Eu recomendaria fortemente que você explorasse diferentes opções, como:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Existem mais gerenciadores de plugins do que os listados acima, fique à vontade para explorar. Para instalar o vim-plug, se você tiver uma máquina Unix, execute:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Para adicionar novos plugins, coloque os nomes dos seus plugins (`Plug 'github-username/repository-name'`) entre as linhas `call plug#begin()` e `call plug#end()`. Portanto, se você quiser instalar `emmet-vim` e `nerdtree`, coloque o seguinte trecho no seu vimrc:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Salve as alterações, faça o source (`:source %`) e execute `:PlugInstall` para instalá-los.

No futuro, se você precisar remover plugins não utilizados, basta remover os nomes dos plugins do bloco `call`, salvar e fazer o source, e executar o comando `:PlugClean` para removê-lo da sua máquina.

O Vim 8 possui seus próprios gerenciadores de pacotes integrados. Você pode conferir `:h packages` para mais informações. No próximo capítulo, mostrarei como usá-lo.

### Configurações

É comum ver muitas opções `set` em qualquer vimrc. Se você executar o comando set no modo de linha de comando, ele não será permanente. Você perderá isso quando fechar o Vim. Por exemplo, em vez de executar `:set relativenumber number` no modo de linha de comando toda vez que executar o Vim, você pode simplesmente colocar isso dentro do vimrc:

```shell
set relativenumber number
```

Algumas configurações exigem que você passe um valor, como `set tabstop=2`. Confira a página de ajuda para cada configuração para aprender que tipo de valores ela aceita.

Você também pode usar um `let` em vez de `set` (certifique-se de precedê-lo com `&`). Com `let`, você pode usar uma expressão como valor. Por exemplo, para definir a opção `'dictionary'` para um caminho somente se o caminho existir:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Você aprenderá sobre atribuições e condicionais do Vimscript em capítulos posteriores.

Para uma lista de todas as opções possíveis no Vim, confira `:h E355`.

### Funções Personalizadas

O vimrc é um bom lugar para funções personalizadas. Você aprenderá como escrever suas próprias funções Vimscript em um capítulo posterior.

### Comandos Personalizados

Você pode criar um comando de linha de comando personalizado com `command`.

Para criar um comando básico `GimmeDate` para exibir a data de hoje:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Quando você executar `:GimmeDate`, o Vim exibirá uma data como "2021-01-1".

Para criar um comando básico com uma entrada, você pode usar `<args>`. Se você quiser passar para `GimmeDate` um formato de data/hora específico:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Se você quiser restringir o número de argumentos, pode passar a flag `-nargs`. Use `-nargs=0` para passar nenhum argumento, `-nargs=1` para passar um argumento, `-nargs=+` para passar pelo menos um argumento, `-nargs=*` para passar qualquer número de argumentos e `-nargs=?` para passar 0 ou um argumento. Se você quiser passar o enésimo argumento, use `-nargs=n` (onde `n` é qualquer inteiro).

`<args>` tem duas variantes: `<f-args>` e `<q-args>`. A primeira é usada para passar argumentos para funções Vimscript. A última é usada para converter automaticamente a entrada do usuário em strings.

Usando `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" retorna 'Hello Iggy'

:Hello Iggy
" Erro de variável indefinida
```

Usando `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" retorna 'Hello Iggy'
```

Usando `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" retorna "Hello Iggy1 and Iggy2"
```

As funções acima farão muito mais sentido quando você chegar ao capítulo sobre funções Vimscript.

Para aprender mais sobre comandos e args, confira `:h command` e `:args`.
### Mapas

Se você se encontra repetidamente realizando a mesma tarefa complexa, é um bom indicativo de que você deve criar um mapeamento para essa tarefa.

Por exemplo, eu tenho esses dois mapeamentos no meu vimrc:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

No primeiro, eu mapeio `Ctrl-F` para o comando `:Gfiles` do plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (pesquisa rápida por arquivos Git). No segundo, eu mapeio `<Leader>tn` para chamar uma função personalizada `ToggleNumber` (alternar as opções `norelativenumber` e `relativenumber`). O mapeamento `Ctrl-F` sobrescreve a rolagem de página nativa do Vim. Seu mapeamento irá sobrescrever os controles do Vim se eles colidirem. Como eu quase nunca usei esse recurso, decidi que é seguro sobrescrevê-lo.

A propósito, o que é essa tecla "leader" em `<Leader>tn`?

O Vim tem uma tecla líder para ajudar com mapeamentos. Por exemplo, eu mapeei `<Leader>tn` para executar a função `ToggleNumber()`. Sem a tecla líder, eu estaria usando `tn`, mas o Vim já tem `t` (a navegação de pesquisa "till"). Com a tecla líder, agora posso pressionar a tecla designada como líder, e então `tn` sem interferir nos comandos existentes. A tecla líder é uma tecla que você pode configurar para iniciar sua combinação de mapeamento. Por padrão, o Vim usa a barra invertida como a tecla líder (então `<Leader>tn` se torna "barra invertida-t-n").

Eu pessoalmente gosto de usar `<Space>` como a tecla líder em vez do padrão de barra invertida. Para mudar sua tecla líder, adicione isso no seu vimrc:

```shell
let mapleader = "\<space>"
```

O comando `nnoremap` usado acima pode ser dividido em três partes:
- `n` representa o modo normal.
- `nore` significa não recursivo.
- `map` é o comando de mapeamento.

No mínimo, você poderia ter usado `nmap` em vez de `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). No entanto, é uma boa prática usar a variante não recursiva para evitar potenciais loops infinitos.

Aqui está o que poderia acontecer se você não mapear de forma não recursiva. Suponha que você queira adicionar um mapeamento para `B` para adicionar um ponto e vírgula no final da linha, e então voltar uma PALAVRA (lembre-se de que `B` no Vim é uma tecla de navegação em modo normal para voltar uma PALAVRA).

```shell
nmap B A;<esc>B
```

Quando você pressiona `B`... oh não! O Vim adiciona `;` incontrolavelmente (interrompa com `Ctrl-C`). Por que isso aconteceu? Porque no mapeamento `A;<esc>B`, o `B` não se refere à função nativa `B` do Vim (voltar uma PALAVRA), mas se refere à função mapeada. O que você tem é na verdade isso:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Para resolver esse problema, você precisa adicionar um mapeamento não recursivo:

```shell
nnoremap B A;<esc>B
```

Agora tente chamar `B` novamente. Desta vez, ele adiciona com sucesso um `;` no final da linha e volta uma PALAVRA. O `B` neste mapeamento representa a funcionalidade original do `B` do Vim.

O Vim tem diferentes mapeamentos para diferentes modos. Se você quiser criar um mapeamento para o modo de inserção para sair do modo de inserção quando você pressiona `jk`:

```shell
inoremap jk <esc>
```

Os outros modos de mapeamento são: `map` (Normal, Visual, Select e Operator-pending), `vmap` (Visual e Select), `smap` (Select), `xmap` (Visual), `omap` (Operator-pending), `map!` (Insert e Command-line), `lmap` (Insert, Command-line, Lang-arg), `cmap` (Command-line) e `tmap` (terminal-job). Eu não vou cobri-los em detalhes. Para saber mais, consulte `:h map.txt`.

Crie um mapeamento que seja mais intuitivo, consistente e fácil de lembrar.

## Organizando o Vimrc

Com o tempo, seu vimrc crescerá e se tornará complicado. Existem duas maneiras de manter seu vimrc com uma aparência limpa:
- Divida seu vimrc em vários arquivos.
- Dobre seu arquivo vimrc.

### Dividindo Seu Vimrc

Você pode dividir seu vimrc em vários arquivos usando o comando `source` do Vim. Este comando lê comandos de linha de comando do argumento de arquivo fornecido.

Vamos criar um arquivo dentro do diretório `~/.vim` e nomeá-lo de `/settings` (`~/.vim/settings`). O nome em si é arbitrário e você pode nomeá-lo como quiser.

Você vai dividi-lo em quatro componentes:
- Plugins de terceiros (`~/.vim/settings/plugins.vim`).
- Configurações gerais (`~/.vim/settings/configs.vim`).
- Funções personalizadas (`~/.vim/settings/functions.vim`).
- Mapeamentos de teclas (`~/.vim/settings/mappings.vim`).

Dentro de `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Você pode editar esses arquivos colocando o cursor sob o caminho e pressionando `gf`.

Dentro de `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Dentro de `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

Dentro de `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

Dentro de `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Seu vimrc deve funcionar como de costume, mas agora tem apenas quatro linhas!

Com essa configuração, você sabe facilmente onde ir. Se você precisar adicionar mais mapeamentos, adicione-os ao arquivo `/mappings.vim`. No futuro, você sempre pode adicionar mais diretórios à medida que seu vimrc cresce. Por exemplo, se você precisar criar uma configuração para seus esquemas de cores, pode adicionar um `~/.vim/settings/themes.vim`.

### Mantendo Um Arquivo Vimrc

Se você prefere manter um único arquivo vimrc para mantê-lo portátil, pode usar as dobras de marcador para mantê-lo organizado. Adicione isso no topo do seu vimrc:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

O Vim pode detectar que tipo de tipo de arquivo o buffer atual possui (`:set filetype?`). Se for um tipo de arquivo `vim`, você pode usar um método de dobra de marcador. Lembre-se de que uma dobra de marcador usa `{{{` e `}}}` para indicar o início e o fim das dobras.

Adicione dobras `{{{` e `}}}` ao restante do seu vimrc (não se esqueça de comentá-las com `"`):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Seu vimrc deve parecer assim:

```shell
+-- 6 linhas: setup folds -----

+-- 6 linhas: plugins ---------

+-- 5 linhas: configs ---------

+-- 9 linhas: functions -------

+-- 5 linhas: mappings --------
```

## Executando o Vim Com ou Sem Vimrc e Plugins

Se você precisar executar o Vim sem vimrc e plugins, execute:

```shell
vim -u NONE
```

Se você precisar iniciar o Vim sem vimrc, mas com plugins, execute:

```shell
vim -u NORC
```

Se você precisar executar o Vim com vimrc, mas sem plugins, execute:

```shell
vim --noplugin
```

Se você precisar executar o Vim com um vimrc *diferente*, digamos `~/.vimrc-backup`, execute:

```shell
vim -u ~/.vimrc-backup
```

Se você precisar executar o Vim apenas com `defaults.vim` e sem plugins, o que é útil para corrigir um vimrc quebrado, execute:

```shell
vim --clean
```

## Configure o Vimrc da Maneira Inteligente

O vimrc é um componente importante da personalização do Vim. Uma boa maneira de começar a construir seu vimrc é lendo os vimrcs de outras pessoas e construí-lo gradualmente ao longo do tempo. O melhor vimrc não é aquele que o desenvolvedor X usa, mas aquele que é ajustado exatamente para se adequar ao seu quadro de pensamento e estilo de edição.