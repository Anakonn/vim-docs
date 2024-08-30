---
description: Este documento explora o modo de inserção no Vim, apresentando comandos
  úteis para aumentar a eficiência na digitação e facilitar a edição de texto.
title: Ch06. Insert Mode
---

O modo de inserção é o modo padrão de muitos editores de texto. Nesse modo, o que você digita é o que você obtém.

No entanto, isso não significa que não há muito a aprender. O modo de inserção do Vim contém muitos recursos úteis. Neste capítulo, você aprenderá como usar esses recursos do modo de inserção no Vim para melhorar sua eficiência de digitação.

## Maneiras de Entrar no Modo de Inserção

Existem muitas maneiras de entrar no modo de inserção a partir do modo normal. Aqui estão algumas delas:

```shell
i    Inserir texto antes do cursor
I    Inserir texto antes do primeiro caractere não em branco da linha
a    Adicionar texto após o cursor
A    Adicionar texto no final da linha
o    Inicia uma nova linha abaixo do cursor e insere texto
O    Inicia uma nova linha acima do cursor e insere texto
s    Deletar o caractere sob o cursor e inserir texto
S    Deletar a linha atual e inserir texto, sinônimo de "cc"
gi   Inserir texto na mesma posição onde o último modo de inserção foi interrompido
gI   Inserir texto no início da linha (coluna 1)
```

Observe o padrão de letras minúsculas / maiúsculas. Para cada comando em minúsculas, há um correspondente em maiúsculas. Se você é novo, não se preocupe se não lembrar toda a lista acima. Comece com `i` e `o`. Eles devem ser suficientes para você começar. Gradualmente, aprenda mais ao longo do tempo.

## Diferentes Maneiras de Sair do Modo de Inserção

Existem algumas maneiras diferentes de retornar ao modo normal enquanto está no modo de inserção:

```shell
<Esc>     Sai do modo de inserção e vai para o modo normal
Ctrl-[    Sai do modo de inserção e vai para o modo normal
Ctrl-C    Como Ctrl-[ e <Esc>, mas não verifica abreviações
```

Eu acho a tecla `<Esc>` muito longe para alcançar, então eu mapeio meu `<Caps-Lock>` para se comportar como `<Esc>`. Se você procurar pelo teclado ADM-3A de Bill Joy (criador do Vi), verá que a tecla `<Esc>` não está localizada no canto superior esquerdo como os teclados modernos, mas à esquerda da tecla `q`. É por isso que eu acho que faz sentido mapear `<Caps lock>` para `<Esc>`.

Outra convenção comum que vi usuários do Vim fazerem é mapear `<Esc>` para `jj` ou `jk` no modo de inserção. Se você preferir essa opção, adicione uma dessas linhas (ou ambas) no seu arquivo vimrc.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Repetindo o Modo de Inserção

Você pode passar um parâmetro de contagem antes de entrar no modo de inserção. Por exemplo:

```shell
10i
```

Se você digitar "hello world!" e sair do modo de inserção, o Vim repetirá o texto 10 vezes. Isso funcionará com qualquer método do modo de inserção (ex: `10I`, `11a`, `12o`).

## Deletando Blocos no Modo de Inserção

Quando você comete um erro de digitação, pode ser incômodo digitar `<Backspace>` repetidamente. Pode fazer mais sentido ir para o modo normal e deletar seu erro. Você também pode deletar vários caracteres de uma vez enquanto está no modo de inserção.

```shell
Ctrl-h    Deletar um caractere
Ctrl-w    Deletar uma palavra
Ctrl-u    Deletar a linha inteira
```

## Inserir a Partir do Registro

Os registros do Vim podem armazenar textos para uso futuro. Para inserir um texto de qualquer registro nomeado enquanto estiver no modo de inserção, digite `Ctrl-R` mais o símbolo do registro. Existem muitos símbolos que você pode usar, mas para esta seção, vamos cobrir apenas os registros nomeados (a-z).

Para ver isso em ação, primeiro você precisa copiar uma palavra para o registro a. Mova o cursor sobre qualquer palavra. Em seguida, digite:

```shell
"ayiw
```

- `"a` diz ao Vim que o alvo da sua próxima ação irá para o registro a.
- `yiw` copia a palavra interna. Revise o capítulo sobre gramática do Vim para um refresco.

O registro a agora contém a palavra que você acabou de copiar. Enquanto estiver no modo de inserção, para colar o texto armazenado no registro a:

```shell
Ctrl-R a
```

Existem múltiplos tipos de registros no Vim. Eu abordarei isso em mais detalhes em um capítulo posterior.

## Rolagem

Você sabia que pode rolar enquanto está dentro do modo de inserção? Enquanto estiver no modo de inserção, se você for para o sub-modo `Ctrl-X`, pode realizar operações adicionais. Rolar é uma delas.

```shell
Ctrl-X Ctrl-Y    Rolar para cima
Ctrl-X Ctrl-E    Rolar para baixo
```

## Autocompletar

Como mencionado acima, se você pressionar `Ctrl-X` a partir do modo de inserção, o Vim entrará em um sub-modo. Você pode fazer autocompletar texto enquanto estiver neste sub-modo de inserção. Embora não seja tão bom quanto [intellisense](https://code.visualstudio.com/docs/editor/intellisense) ou qualquer outro Protocolo de Servidor de Linguagem (LSP), mas para algo que está disponível logo de cara, é um recurso muito capaz.

Aqui estão alguns comandos de autocompletar úteis para começar:

```shell
Ctrl-X Ctrl-L	   Inserir uma linha inteira
Ctrl-X Ctrl-N	   Inserir um texto do arquivo atual
Ctrl-X Ctrl-I	   Inserir um texto de arquivos incluídos
Ctrl-X Ctrl-F	   Inserir um nome de arquivo
```

Quando você aciona o autocompletar, o Vim exibirá uma janela pop-up. Para navegar para cima e para baixo na janela pop-up, use `Ctrl-N` e `Ctrl-P`.

O Vim também tem dois atalhos de autocompletar que não envolvem o sub-modo `Ctrl-X`:

```shell
Ctrl-N             Encontrar a próxima correspondência de palavra
Ctrl-P             Encontrar a correspondência de palavra anterior
```

Em geral, o Vim olha para o texto em todos os buffers disponíveis como fonte de autocompletar. Se você tiver um buffer aberto com uma linha que diz "Donuts de chocolate são os melhores":
- Quando você digita "Choco" e faz `Ctrl-X Ctrl-L`, ele irá corresponder e imprimir a linha inteira.
- Quando você digita "Choco" e faz `Ctrl-P`, ele irá corresponder e imprimir a palavra "Chocolate".

Autocompletar é um tópico vasto no Vim. Isso é apenas a ponta do iceberg. Para aprender mais, confira `:h ins-completion`.

## Executando um Comando do Modo Normal

Você sabia que o Vim pode executar um comando do modo normal enquanto está no modo de inserção?

Enquanto estiver no modo de inserção, se você pressionar `Ctrl-O`, você estará no sub-modo de inserção-normal. Se você olhar para o indicador de modo no canto inferior esquerdo, normalmente verá `-- INSERT --`, mas pressionar `Ctrl-O` muda para `-- (inserir) --`. Neste modo, você pode fazer *um* comando do modo normal. Algumas coisas que você pode fazer:

**Centralizando e pulando**

```shell
Ctrl-O zz       Centralizar a janela
Ctrl-O H/M/L    Pular para o topo/meio/fundo da janela
Ctrl-O 'a       Pular para a marca a
```

**Repetindo texto**

```shell
Ctrl-O 100ihello    Inserir "hello" 100 vezes
```

**Executando comandos de terminal**

```shell
Ctrl-O !! curl https://google.com    Executar curl
Ctrl-O !! pwd                        Executar pwd
```

**Deletando mais rápido**

```shell
Ctrl-O dtz    Deletar da localização atual até a letra "z"
Ctrl-O D      Deletar da localização atual até o final da linha
```

## Aprenda o Modo de Inserção da Maneira Certa

Se você é como eu e vem de outro editor de texto, pode ser tentador ficar no modo de inserção. No entanto, ficar no modo de inserção quando você não está digitando um texto é um anti-padrão. Desenvolva o hábito de ir para o modo normal quando seus dedos não estão digitando novo texto.

Quando você precisar inserir um texto, primeiro pergunte a si mesmo se esse texto já existe. Se existir, tente copiar ou mover esse texto em vez de digitá-lo. Se você tiver que usar o modo de inserção, veja se pode autocompletar esse texto sempre que possível. Evite digitar a mesma palavra mais de uma vez, se puder.