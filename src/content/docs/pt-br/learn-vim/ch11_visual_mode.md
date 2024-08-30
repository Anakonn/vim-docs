---
description: 'Aprenda a usar o modo visual no Vim para manipular textos de forma eficiente,
  explorando os três tipos de modos disponíveis: caractere, linha e bloco.'
title: Ch11. Visual Mode
---

Destacar e aplicar alterações a um corpo de texto é um recurso comum em muitos editores de texto e processadores de texto. O Vim pode fazer isso usando o modo visual. Neste capítulo, você aprenderá a usar o modo visual para manipular textos de forma eficiente.

## Os Três Tipos de Modos Visuais

O Vim tem três modos visuais diferentes. Eles são:

```shell
v         Modo visual caracter a caracter
V         Modo visual linha a linha
Ctrl-V    Modo visual em bloco
```

Se você tiver o texto:

```shell
um
dois
três
```

O modo visual caracter a caracter funciona com caracteres individuais. Pressione `v` no primeiro caractere. Em seguida, desça para a próxima linha com `j`. Ele destaca todo o texto de "um" até a localização do seu cursor. Se você pressionar `gU`, o Vim transforma os caracteres destacados em maiúsculas.

O modo visual linha a linha funciona com linhas. Pressione `V` e veja o Vim selecionar a linha inteira em que seu cursor está. Assim como no modo visual caracter a caracter, se você executar `gU`, o Vim transforma os caracteres destacados em maiúsculas.

O modo visual em bloco funciona com linhas e colunas. Ele oferece mais liberdade de movimento do que os outros dois modos. Se você pressionar `Ctrl-V`, o Vim destaca o caractere sob o cursor, assim como no modo visual caracter a caracter, exceto que, em vez de destacar cada caractere até o final da linha antes de descer para a próxima linha, ele vai para a próxima linha com um destaque mínimo. Tente se mover com `h/j/k/l` e veja o cursor se mover.

No canto inferior esquerdo da sua janela do Vim, você verá `-- VISUAL --`, `-- VISUAL LINE --` ou `-- VISUAL BLOCK --` exibido para indicar em qual modo visual você está.

Enquanto estiver dentro de um modo visual, você pode alternar para outro modo visual pressionando `v`, `V` ou `Ctrl-V`. Por exemplo, se você estiver no modo visual linha a linha e quiser mudar para o modo visual em bloco, execute `Ctrl-V`. Tente!

Existem três maneiras de sair do modo visual: `<Esc>`, `Ctrl-C` e a mesma tecla do seu modo visual atual. O que isso significa é que, se você estiver atualmente no modo visual linha a linha (`V`), pode sair pressionando `V` novamente. Se você estiver no modo visual caracter a caracter, pode sair pressionando `v`.

Na verdade, há uma maneira a mais de entrar no modo visual:

```shell
gv    Voltar ao modo visual anterior
```

Isso iniciará o mesmo modo visual no mesmo bloco de texto destacado que você usou da última vez.

## Navegação no Modo Visual

Enquanto estiver em um modo visual, você pode expandir o bloco de texto destacado com os movimentos do Vim.

Vamos usar o mesmo texto que você usou anteriormente:

```shell
um
dois
três
```

Desta vez, vamos começar pela linha "dois". Pressione `v` para ir ao modo visual caracter a caracter (aqui os colchetes quadrados `[]` representam os destaques de caracteres):

```shell
um
[d]ois
três
```

Pressione `j` e o Vim destacará todo o texto da linha "dois" até o primeiro caractere da linha "três".

```shell
um
[dois
t]rês
```

Suponha que, a partir dessa posição, você queira adicionar a linha "um" também. Se você pressionar `k`, para sua decepção, o destaque se afasta da linha "três".

```shell
um
[d]ois
três
```

Há uma maneira de expandir livremente a seleção visual para se mover em qualquer direção que você quiser? Definitivamente. Vamos voltar um pouco para onde você tem a linha "dois" e "três" destacadas.

```shell
um
[dois
t]rês    <-- cursor
```

O destaque visual segue o movimento do cursor. Se você quiser expandi-lo para cima, até a linha "um", precisará mover o cursor para cima, até a linha "dois". Neste momento, o cursor está na linha "três". Você pode alternar a localização do cursor com `o` ou `O`.

```shell
um
[dois     <-- cursor
t]rês
```

Agora, quando você pressionar `k`, não reduz mais a seleção, mas a expande para cima.

```shell
[um
dois
t]rês
```

Com `o` ou `O` no modo visual, o cursor salta do início ao fim do bloco destacado, permitindo que você expanda a área de destaque.

## Gramática do Modo Visual

O modo visual compartilha muitas operações com o modo normal.

Por exemplo, se você tiver o seguinte texto e quiser excluir as duas primeiras linhas do modo visual:

```shell
um
dois
três
```

Destaque as linhas "um" e "dois" com o modo visual linha a linha (`V`):

```shell
[um
dois]
três
```

Pressionar `d` excluirá a seleção, semelhante ao modo normal. Note que a regra gramatical do modo normal, verbo + substantivo, não se aplica. O mesmo verbo ainda está lá (`d`), mas não há substantivo no modo visual. A regra gramatical no modo visual é substantivo + verbo, onde o substantivo é o texto destacado. Selecione o bloco de texto primeiro, depois o comando segue.

No modo normal, há alguns comandos que não requerem um movimento, como `x` para excluir um único caractere sob o cursor e `r` para substituir o caractere sob o cursor (`rx` substitui o caractere sob o cursor por "x"). No modo visual, esses comandos agora são aplicados a todo o texto destacado em vez de um único caractere. De volta ao texto destacado:

```shell
[um
dois]
três
```

Executar `x` exclui todos os textos destacados.

Você pode usar esse comportamento para criar rapidamente um cabeçalho em texto markdown. Suponha que você precise transformar rapidamente o seguinte texto em um cabeçalho markdown de primeiro nível ("==="):

```shell
Capítulo Um
```

Primeiro, copie o texto com `yy`, depois cole com `p`:

```shell
Capítulo Um
Capítulo Um
```

Agora, vá para a segunda linha e selecione-a com o modo visual linha a linha:

```shell
Capítulo Um
[Capítulo Um]
```

Um cabeçalho de primeiro nível é uma série de "=" abaixo de um texto. Execute `r=`, voilà! Isso evita que você digite "=" manualmente.

```shell
Capítulo Um
===========
```

Para saber mais sobre operadores no modo visual, confira `:h visual-operators`.

## Modo Visual e Comandos de Linha de Comando

Você pode aplicar comandos de linha de comando de forma seletiva em um bloco de texto destacado. Se você tiver estas instruções e quiser substituir "const" por "let" apenas nas duas primeiras linhas:

```shell
const um = "um";
const dois = "dois";
const três = "três";
```

Destaque as duas primeiras linhas com *qualquer* modo visual e execute o comando de substituição `:s/const/let/g`:

```shell
let um = "um";
let dois = "dois";
const três = "três";
```

Note que eu disse que você pode fazer isso com *qualquer* modo visual. Você não precisa destacar a linha inteira para executar o comando nessa linha. Desde que você selecione pelo menos um caractere em cada linha, o comando é aplicado.

## Adicionando Texto em Múltiplas Linhas

Você pode adicionar texto em várias linhas no Vim usando o modo visual em bloco. Se você precisar adicionar um ponto e vírgula no final de cada linha:

```shell
const um = "um"
const dois = "dois"
const três = "três"
```

Com seu cursor na primeira linha:
- Execute o modo visual em bloco e desça duas linhas (`Ctrl-V jj`).
- Destaque até o final da linha (`$`).
- Adicione (`A`) e digite ";".
- Saia do modo visual (`<Esc>`).

Agora você deve ver o ";" adicionado em cada linha. Muito legal! Existem duas maneiras de entrar no modo de inserção a partir do modo visual em bloco: `A` para entrar o texto após o cursor ou `I` para entrar o texto antes do cursor. Não os confunda com `A` (adicionar texto no final da linha) e `I` (inserir texto antes da primeira linha não em branco) do modo normal.

Alternativamente, você também pode usar o comando `:normal` para adicionar texto em várias linhas:
- Destaque todas as 3 linhas (`vjj`).
- Digite `:normal! A;`.

Lembre-se, o comando `:normal` executa comandos do modo normal. Você pode instruí-lo a executar `A;` para adicionar o texto ";" no final da linha.

## Incrementando Números

O Vim tem os comandos `Ctrl-X` e `Ctrl-A` para decrementar e incrementar números. Quando usados com o modo visual, você pode incrementar números em várias linhas.

Se você tiver estes elementos HTML:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

É uma má prática ter vários ids com o mesmo nome, então vamos incrementá-los para torná-los únicos:
- Mova seu cursor para o "1" na segunda linha.
- Inicie o modo visual em bloco e desça 3 linhas (`Ctrl-V 3j`). Isso destaca os "1" restantes. Agora todos os "1" devem estar destacados (exceto a primeira linha).
- Execute `g Ctrl-A`.

Você deve ver este resultado:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` incrementa números em várias linhas. `Ctrl-X/Ctrl-A` também pode incrementar letras, com a opção de formatos numéricos:

```shell
set nrformats+=alpha
```

A opção `nrformats` instrui o Vim sobre quais bases são consideradas "números" para `Ctrl-A` e `Ctrl-X` incrementarem e decrementarem. Ao adicionar `alpha`, um caractere alfabético agora é considerado um número. Se você tiver os seguintes elementos HTML:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Coloque seu cursor no segundo "app-a". Use a mesma técnica que acima (`Ctrl-V 3j` e depois `g Ctrl-A`) para incrementar os ids.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Selecionando a Última Área do Modo Visual

Mais cedo neste capítulo, mencionei que `gv` pode rapidamente destacar o último destaque do modo visual. Você também pode ir para a localização do início e do fim do último modo visual com estas duas marcas especiais:

```shell
`<    Vá para o primeiro lugar do destaque anterior do modo visual
`>    Vá para o último lugar do destaque anterior do modo visual
```

Mais cedo, também mencionei que você pode executar comandos de linha de comando de forma seletiva em um texto destacado, como `:s/const/let/g`. Quando você fez isso, você viu isto abaixo:

```shell
:`<,`>s/const/let/g
```

Você estava, na verdade, executando um comando `s/const/let/g` *com intervalo* (com as duas marcas como endereços). Interessante!

Você pode sempre editar essas marcas a qualquer momento que desejar. Se em vez disso você precisar substituir do início do texto destacado até o final do arquivo, basta mudar o comando para:

```shell
:`<,$s/const/let/g
```

## Entrando no Modo Visual a Partir do Modo de Inserção

Você também pode entrar no modo visual a partir do modo de inserção. Para ir ao modo visual caracter a caracter enquanto você está no modo de inserção:

```shell
Ctrl-O v
```

Lembre-se de que executar `Ctrl-O` enquanto está no modo de inserção permite que você execute um comando do modo normal. Enquanto estiver neste modo de comando do modo normal pendente, execute `v` para entrar no modo visual caracter a caracter. Note que no canto inferior esquerdo da tela, diz `--(inserir) VISUAL--`. Esse truque funciona com qualquer operador do modo visual: `v`, `V` e `Ctrl-V`.

## Modo de Seleção

O Vim tem um modo semelhante ao modo visual chamado modo de seleção. Assim como o modo visual, ele também tem três modos diferentes:

```shell
gh         Modo de seleção caracter a caracter
gH         Modo de seleção linha a linha
gCtrl-h    Modo de seleção em bloco
```

O modo de seleção emula o comportamento de destaque de texto de um editor comum mais próximo do que o modo visual do Vim.

Em um editor comum, após destacar um bloco de texto e digitar uma letra, digamos a letra "y", ele excluirá o texto destacado e inserirá a letra "y". Se você destacar uma linha com o modo de seleção linha a linha (`gH`) e digitar "y", ele excluirá o texto destacado e inserirá a letra "y".

Contraste este modo de seleção com o modo visual: se você destacar uma linha de texto com o modo visual linha a linha (`V`) e digitar "y", o texto destacado não será excluído e substituído pela letra literal "y", ele será copiado. Você não pode executar comandos do modo normal em texto destacado no modo de seleção.

Pessoalmente, nunca usei o modo de seleção, mas é bom saber que ele existe.

## Aprenda o Modo Visual da Maneira Inteligente

O modo visual é a representação do Vim do procedimento de destaque de texto.

Se você se encontrar usando operações do modo visual com muito mais frequência do que operações do modo normal, tenha cuidado. Isso é um anti-padrão. Leva mais teclas para executar uma operação do modo visual do que seu equivalente no modo normal. Por exemplo, se você precisar excluir uma palavra interna, por que usar quatro teclas, `viwd` (destacar visualmente uma palavra interna e depois excluir), se você pode fazer isso com apenas três teclas (`diw`)? Este último é mais direto e conciso. Claro, haverá momentos em que os modos visuais são apropriados, mas, em geral, prefira uma abordagem mais direta.