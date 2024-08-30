---
description: Aprenda a usar o gerenciador de pacotes do Vim para instalar plugins,
  incluindo como verificar a compatibilidade e os métodos de carregamento automático
  e manual.
title: Ch23. Vim Packages
---

No capítulo anterior, mencionei o uso de um gerenciador de plugins externo para instalar plugins. Desde a versão 8, o Vim vem com seu próprio gerenciador de plugins embutido chamado *packages*. Neste capítulo, você aprenderá como usar os pacotes do Vim para instalar plugins.

Para verificar se sua versão do Vim tem a capacidade de usar pacotes, execute `:version` e procure o atributo `+packages`. Alternativamente, você também pode executar `:echo has('packages')` (se retornar 1, então possui a capacidade de pacotes).

## Diretório de Pacotes

Verifique se você tem um diretório `~/.vim/` no caminho raiz. Se não tiver, crie um. Dentro dele, crie um diretório chamado `pack` (`~/.vim/pack/`). O Vim sabe automaticamente que deve procurar dentro deste diretório por pacotes.

## Dois Tipos de Carregamento

O pacote do Vim possui dois mecanismos de carregamento: carregamento automático e manual.

### Carregamento Automático

Para carregar plugins automaticamente quando o Vim inicia, você precisa colocá-los no diretório `start/`. O caminho fica assim:

```shell
~/.vim/pack/*/start/
```

Agora você pode perguntar: "O que é o `*` entre `pack/` e `start/`?" `*` é um nome arbitrário e pode ser qualquer coisa que você quiser. Vamos nomeá-lo de `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

Lembre-se de que se você pular isso e fizer algo assim em vez disso:

```shell
~/.vim/pack/start/
```

O sistema de pacotes não funcionará. É imperativo colocar um nome entre `pack/` e `start/`.

Para esta demonstração, vamos tentar instalar o plugin [NERDTree](https://github.com/preservim/nerdtree). Vá até o diretório `start/` (`cd ~/.vim/pack/packdemo/start/`) e clone o repositório do NERDTree:

```shell
git clone https://github.com/preservim/nerdtree.git
```

É isso! Você está pronto. Na próxima vez que iniciar o Vim, poderá executar imediatamente os comandos do NERDTree, como `:NERDTreeToggle`.

Você pode clonar quantos repositórios de plugins quiser dentro do caminho `~/.vim/pack/*/start/`. O Vim carregará automaticamente cada um deles. Se você remover o repositório clonado (`rm -rf nerdtree/`), esse plugin não estará mais disponível.

### Carregamento Manual

Para carregar plugins manualmente quando o Vim inicia, você precisa colocá-los no diretório `opt/`. Semelhante ao carregamento automático, o caminho fica assim:

```shell
~/.vim/pack/*/opt/
```

Vamos usar o mesmo diretório `packdemo/` de antes:

```shell
~/.vim/pack/packdemo/opt/
```

Desta vez, vamos instalar o jogo [killersheep](https://github.com/vim/killersheep) (isso requer Vim 8.2). Vá até o diretório `opt/` (`cd ~/.vim/pack/packdemo/opt/`) e clone o repositório:

```shell
git clone https://github.com/vim/killersheep.git
```

Inicie o Vim. O comando para executar o jogo é `:KillKillKill`. Tente executá-lo. O Vim reclamará que não é um comando de editor válido. Você precisa *carregar manualmente* o plugin primeiro. Vamos fazer isso:

```shell
:packadd killersheep
```

Agora tente executar o comando novamente `:KillKillKill`. O comando deve funcionar agora.

Você pode se perguntar: "Por que eu gostaria de carregar pacotes manualmente? Não é melhor carregar tudo automaticamente no início?"

Ótima pergunta. Às vezes, há plugins que você não usará o tempo todo, como aquele jogo KillerSheep. Provavelmente, você não precisa carregar 10 jogos diferentes e desacelerar o tempo de inicialização do Vim. No entanto, de vez em quando, quando você estiver entediado, pode querer jogar alguns jogos. Use o carregamento manual para plugins não essenciais.

Você também pode usar isso para adicionar plugins condicionalmente. Talvez você use tanto o Neovim quanto o Vim e haja plugins otimizados para o Neovim. Você pode adicionar algo assim no seu vimrc:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Organizando Pacotes

Lembre-se de que o requisito para usar o sistema de pacotes do Vim é ter:

```shell
~/.vim/pack/*/start/
```

Ou:

```shell
~/.vim/pack/*/opt/
```

O fato de que `*` pode ser *qualquer* nome pode ser usado para organizar seus pacotes. Suponha que você queira agrupar seus plugins com base em categorias (cores, sintaxe e jogos):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Você ainda pode usar `start/` e `opt/` dentro de cada um dos diretórios.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Adicionando Pacotes da Forma Inteligente

Você pode se perguntar se o pacote do Vim tornará gerenciadores de plugins populares como vim-pathogen, vundle.vim, dein.vim e vim-plug obsoletos.

A resposta é, como sempre, "depende".

Eu ainda uso o vim-plug porque facilita adicionar, remover ou atualizar plugins. Se você usa muitos plugins, pode ser mais conveniente usar gerenciadores de plugins porque é fácil atualizar muitos simultaneamente. Alguns gerenciadores de plugins também oferecem funcionalidades assíncronas.

Se você é um minimalista, experimente os pacotes do Vim. Se você é um usuário pesado de plugins, pode querer considerar usar um gerenciador de plugins.