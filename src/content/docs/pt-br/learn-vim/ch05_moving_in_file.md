---
description: Aprenda a navegar rapidamente no Vim com movimentos essenciais, utilizando
  as teclas `hjkl` para aumentar sua produtividade e eficiência na edição de texto.
title: Ch05. Moving in a File
---

No começo, mover-se com um teclado pode parecer lento e desajeitado, mas não desista! Assim que você se acostumar, pode ir a qualquer lugar em um arquivo mais rápido do que usando um mouse.

Neste capítulo, você aprenderá os movimentos essenciais e como usá-los de forma eficiente. Lembre-se de que este **não** é todo o movimento que o Vim possui. O objetivo aqui é introduzir movimentos úteis para se tornar produtivo rapidamente. Se você precisar aprender mais, consulte `:h motion.txt`.

## Navegação por Caracteres

A unidade de movimento mais básica é mover um caractere para a esquerda, para baixo, para cima e para a direita.

```shell
h   Esquerda
j   Para baixo
k   Para cima
l   Direita
gj  Para baixo em uma linha suavemente quebrada
gk  Para cima em uma linha suavemente quebrada
```

Você também pode se mover com as setas direcionais. Se você está apenas começando, sinta-se à vontade para usar qualquer método com o qual se sinta mais confortável.

Eu prefiro `hjkl` porque minha mão direita pode ficar na linha inicial. Fazer isso me dá um alcance mais curto para as teclas ao redor. Para me acostumar com `hjkl`, na verdade, desativei os botões de seta ao começar, adicionando isso em `~/.vimrc`:

```shell
noremap <Up> <NOP>
noremap <Down> <NOP>
noremap <Left> <NOP>
noremap <Right> <NOP>
```

Existem também plugins para ajudar a quebrar esse mau hábito. Um deles é [vim-hardtime](https://github.com/takac/vim-hardtime). Para minha surpresa, levei menos de uma semana para me acostumar com `hjkl`.

Se você se pergunta por que o Vim usa `hjkl` para se mover, isso se deve ao terminal Lear-Siegler ADM-3A onde Bill Joy escreveu o Vi, que não tinha teclas de seta e usava `hjkl` como esquerda/baixo/cima/direita.*

## Numeração Relativa

Acho útil ter `number` e `relativenumber configurados. Você pode fazer isso adicionando isso ao `.vimrc`:

```shell
set relativenumber number
```

Isso exibe meu número de linha atual e números de linha relativos.

É fácil entender por que ter um número na coluna da esquerda é útil, mas alguns de vocês podem perguntar como ter números relativos na coluna da esquerda pode ser útil. Ter um número relativo me permite ver rapidamente quantas linhas meu cursor está do texto alvo. Com isso, posso facilmente perceber que meu texto alvo está 12 linhas abaixo de mim, então posso fazer `d12j` para deletá-las. Caso contrário, se estou na linha 69 e meu alvo está na linha 81, tenho que fazer um cálculo mental (81 - 69 = 12). Fazer matemática enquanto edito consome muitos recursos mentais. Quanto menos eu tiver que pensar sobre onde preciso ir, melhor.

Isso é 100% preferência pessoal. Experimente `relativenumber` / `norelativenumber`, `number` / `nonumber` e use o que você achar mais útil!

## Conte Seus Movimentos

Vamos falar sobre o argumento "contagem". Os movimentos do Vim aceitam um argumento numérico anterior. Mencionei acima que você pode descer 12 linhas com `12j`. O 12 em `12j` é o número de contagem.

A sintaxe para usar a contagem com seu movimento é:

```shell
[count] + movimento
```

Você pode aplicar isso a todos os movimentos. Se você quiser mover 9 caracteres para a direita, em vez de pressionar `l` 9 vezes, você pode fazer `9l`.

## Navegação por Palavras

Vamos passar para uma unidade de movimento maior: *palavra*. Você pode mover-se para o início da próxima palavra (`w`), para o final da próxima palavra (`e`), para o início da palavra anterior (`b`) e para o final da palavra anterior (`ge`).

Além disso, existe *PALAVRA*, distinta de palavra. Você pode mover-se para o início da próxima PALAVRA (`W`), para o final da próxima PALAVRA (`E`), para o início da PALAVRA anterior (`B`) e para o final da PALAVRA anterior (`gE`). Para facilitar a memorização, PALAVRA usa as mesmas letras que palavra, apenas em maiúsculas.

```shell
w     Mover para frente até o início da próxima palavra
W     Mover para frente até o início da próxima PALAVRA
e     Mover para frente uma palavra até o final da próxima palavra
E     Mover para frente uma palavra até o final da próxima PALAVRA
b     Mover para trás até o início da palavra anterior
B     Mover para trás até o início da PALAVRA anterior
ge    Mover para trás até o final da palavra anterior
gE    Mover para trás até o final da PALAVRA anterior
```

Então, quais são as semelhanças e diferenças entre uma palavra e uma PALAVRA? Tanto palavra quanto PALAVRA são separadas por caracteres em branco. Uma palavra é uma sequência de caracteres contendo *apenas* `a-zA-Z0-9_`. Uma PALAVRA é uma sequência de todos os caracteres, exceto espaços em branco (um espaço em branco significa espaço, tabulação e EOL). Para aprender mais, consulte `:h word` e `:h WORD`.

Por exemplo, suponha que você tenha:

```shell
const hello = "world";
```

Com seu cursor no início da linha, para ir até o final da linha com `l`, levará 21 pressões de tecla. Usando `w`, levará 6. Usando `W`, levará apenas 4. Tanto palavra quanto PALAVRA são boas opções para viajar distâncias curtas.

No entanto, você pode ir de "c" a ";" em uma única tecla com a navegação na linha atual.

## Navegação na Linha Atual

Ao editar, você frequentemente precisa navegar horizontalmente em uma linha. Para pular para o primeiro caractere na linha atual, use `0`. Para ir até o último caractere na linha atual, use `$`. Além disso, você pode usar `^` para ir até o primeiro caractere não em branco na linha atual e `g_` para ir até o último caractere não em branco na linha atual. Se você quiser ir até a coluna `n` na linha atual, pode usar `n|`.

```shell
0     Ir para o primeiro caractere na linha atual
^     Ir para o primeiro caractere não em branco na linha atual
g_    Ir para o último caractere não em branco na linha atual
$     Ir para o último caractere na linha atual
n|    Ir para a coluna n na linha atual
```

Você pode fazer uma busca na linha atual com `f` e `t`. A diferença entre `f` e `t` é que `f` leva você até a primeira letra da correspondência e `t` leva você até (antes de) a primeira letra da correspondência. Então, se você quiser buscar por "h" e parar em "h", use `fh`. Se você quiser buscar pelo primeiro "h" e parar logo antes da correspondência, use `th`. Se você quiser ir para a *próxima* ocorrência da última busca na linha atual, use `;`. Para ir para a ocorrência anterior da última correspondência na linha atual, use `,`.

`F` e `T` são os correspondentes para trás de `f` e `t`. Para buscar para trás por "h", execute `Fh`. Para continuar buscando por "h" na mesma direção, use `;`. Note que `;` após um `Fh` busca para trás e `,` após `Fh` busca para frente. 

```shell
f    Buscar para frente por uma correspondência na mesma linha
F    Buscar para trás por uma correspondência na mesma linha
t    Buscar para frente por uma correspondência na mesma linha, parando antes da correspondência
T    Buscar para trás por uma correspondência na mesma linha, parando antes da correspondência
;    Repetir a última busca na mesma linha usando a mesma direção
,    Repetir a última busca na mesma linha usando a direção oposta
```

Voltando ao exemplo anterior:

```shell
const hello = "world";
```

Com seu cursor no início da linha, você pode ir até o último caractere na linha atual (";") com uma pressão de tecla: `$`. Se você quiser ir até "w" em "world", pode usar `fw`. Uma boa dica para ir a qualquer lugar em uma linha é procurar por letras menos comuns como "j", "x", "z" perto do seu alvo.

## Navegação por Sentenças e Parágrafos

As próximas duas unidades de navegação são sentença e parágrafo.

Vamos falar primeiro sobre o que é uma sentença. Uma sentença termina com `. ! ?` seguido de um EOL, um espaço ou uma tabulação. Você pode pular para a próxima sentença com `)` e a sentença anterior com `(`.

```shell
(    Pular para a sentença anterior
)    Pular para a próxima sentença
```

Vamos olhar alguns exemplos. Quais frases você acha que são sentenças e quais não são? Tente navegar com `(` e `)` no Vim!

```shell
Eu sou uma sentença. Eu sou outra sentença porque termino com um ponto. Eu ainda sou uma sentença quando termino com um ponto de exclamação! E quanto ao ponto de interrogação? Eu não sou exatamente uma sentença por causa do hífen - e nem ponto e vírgula ; nem dois pontos :

Há uma linha em branco acima de mim.
```

A propósito, se você estiver tendo problemas com o Vim não contando uma sentença para frases separadas por `.` seguido de uma única linha, você pode estar no modo `'compatible'`. Adicione `set nocompatible` ao vimrc. No Vi, uma sentença é um `.` seguido de **duas** espaços. Você deve ter `nocompatible` configurado o tempo todo.

Vamos falar sobre o que é um parágrafo. Um parágrafo começa após cada linha em branco e também em cada conjunto de uma macro de parágrafo especificada pelos pares de caracteres na opção de parágrafos.

```shell
{    Pular para o parágrafo anterior
}    Pular para o próximo parágrafo
```

Se você não tem certeza do que é uma macro de parágrafo, não se preocupe. O importante é que um parágrafo começa e termina após uma linha em branco. Isso deve ser verdade na maioria das vezes.

Vamos olhar este exemplo. Tente navegar com `}` e `{` (também, brinque com as navegações de sentença `( )` para se mover também!)

```shell
Olá. Como você está? Estou ótimo, obrigado!
Vim é incrível.
Pode não ser fácil aprendê-lo no começo...- mas estamos juntos nessa. Boa sorte!

Olá novamente.

Tente se mover com ), (, }, e {. Sinta como eles funcionam.
Você consegue.
```

Consulte `:h sentence` e `:h paragraph` para aprender mais.

## Navegação por Correspondências

Programadores escrevem e editam códigos. Os códigos geralmente usam parênteses, chaves e colchetes. Você pode facilmente se perder neles. Se você estiver dentro de um, pode pular para o outro par (se existir) com `%`. Você também pode usar isso para descobrir se você tem parênteses, chaves e colchetes correspondentes.

```shell
%    Navegar para outra correspondência, geralmente funciona para (), [], {}
```

Vamos olhar um exemplo de código Scheme porque ele usa parênteses extensivamente. Mova-se com `%` dentro de diferentes parênteses.

```shell
(define (fib n)
  (cond ((= n 0) 0)
        ((= n 1) 1)
        (else
          (+ (fib (- n 1)) (fib (- n 2)))
        )))
```

Pessoalmente, gosto de complementar `%` com plugins de indicadores visuais como [vim-rainbow](https://github.com/frazrepo/vim-rainbow). Para mais, consulte `:h %`.

## Navegação por Números de Linha

Você pode pular para o número da linha `n` com `nG`. Por exemplo, se você quiser pular para a linha 7, use `7G`. Para pular para a primeira linha, use `1G` ou `gg`. Para pular para a última linha, use `G`.

Frequentemente, você não sabe exatamente qual é o número da linha do seu alvo, mas sabe que está aproximadamente a 70% do arquivo inteiro. Nesse caso, você pode fazer `70%`. Para pular para o meio do arquivo, você pode fazer `50%`.

```shell
gg    Ir para a primeira linha
G     Ir para a última linha
nG    Ir para a linha n
n%    Ir para n% no arquivo
```

A propósito, se você quiser ver o total de linhas em um arquivo, pode usar `Ctrl-g`.

## Navegação por Janelas

Para ir rapidamente ao topo, meio ou fundo da sua *janela*, você pode usar `H`, `M` e `L`.

Você também pode passar uma contagem para `H` e `L`. Se você usar `10H`, irá para 10 linhas abaixo do topo da janela. Se você usar `3L`, irá para 3 linhas acima da última linha da janela.

```shell
H     Ir para o topo da tela
M     Ir para o meio da tela
L     Ir para a parte inferior da tela
nH    Ir n linhas do topo
nL    Ir n linhas da parte inferior
```

## Rolagem

Para rolar, você tem 3 incrementos de velocidade: tela cheia (`Ctrl-F/Ctrl-B`), meia tela (`Ctrl-D/Ctrl-U`) e linha (`Ctrl-E/Ctrl-Y`).

```shell
Ctrl-E    Rolar para baixo uma linha
Ctrl-D    Rolar para baixo meia tela
Ctrl-F    Rolar para baixo a tela inteira
Ctrl-Y    Rolar para cima uma linha
Ctrl-U    Rolar para cima meia tela
Ctrl-B    Rolar para cima a tela inteira
```

Você também pode rolar relativamente à linha atual (aumentar a visão da tela):

```shell
zt    Trazer a linha atual perto do topo da sua tela
zz    Trazer a linha atual para o meio da sua tela
zb    Trazer a linha atual perto da parte inferior da sua tela
```
## Navegação de Busca

Frequentemente, você sabe que uma frase existe dentro de um arquivo. Você pode usar a navegação de busca para chegar rapidamente ao seu alvo. Para buscar uma frase, você pode usar `/` para buscar para frente e `?` para buscar para trás. Para repetir a última busca, você pode usar `n`. Para repetir a última busca na direção oposta, você pode usar `N`.

```shell
/    Buscar para frente por uma correspondência
?    Buscar para trás por uma correspondência
n    Repetir a última busca na mesma direção da busca anterior
N    Repetir a última busca na direção oposta da busca anterior
```

Suponha que você tenha este texto:

```shell
let one = 1;
let two = 2;
one = "01";
one = "one";
let onetwo = 12;
```

Se você está buscando por "let", execute `/let`. Para buscar rapidamente por "let" novamente, você pode apenas fazer `n`. Para buscar por "let" novamente na direção oposta, execute `N`. Se você executar `?let`, ele buscará por "let" para trás. Se você usar `n`, agora ele buscará por "let" para trás (`N` buscará por "let" para frente agora).

Você pode habilitar o destaque de busca com `set hlsearch`. Agora, quando você buscar por `/let`, ele destacará *todas* as frases correspondentes no arquivo. Além disso, você pode definir a busca incremental com `set incsearch`. Isso destacará o padrão enquanto você digita. Por padrão, suas frases correspondentes permanecerão destacadas até que você busque por outra frase. Isso pode rapidamente se tornar uma irritação. Para desabilitar o destaque, você pode executar `:nohlsearch` ou simplesmente `:noh`. Como eu uso esse recurso de sem destaque com frequência, criei um mapeamento no vimrc:

```shell
nnoremap <esc><esc> :noh<return><esc>
```

Você pode buscar rapidamente pelo texto sob o cursor com `*` para buscar para frente e `#` para buscar para trás. Se o seu cursor estiver na string "one", pressionar `*` será o mesmo que se você tivesse feito `/\<one\>`.

Tanto `\<` quanto `\>` em `/\<one\>` significam busca de palavra inteira. Não corresponde a "one" se for parte de uma palavra maior. Ele corresponderá à palavra "one", mas não a "onetwo". Se o seu cursor estiver sobre "one" e você quiser buscar para frente para corresponder a palavras inteiras ou parciais como "one" e "onetwo", você precisa usar `g*` em vez de `*`.

```shell
*     Buscar palavra inteira sob o cursor para frente
#     Buscar palavra inteira sob o cursor para trás
g*    Buscar palavra sob o cursor para frente
g#    Buscar palavra sob o cursor para trás
```

## Marcação de Posição

Você pode usar marcas para salvar sua posição atual e retornar a essa posição mais tarde. É como um marcador para edição de texto. Você pode definir uma marca com `mx`, onde `x` pode ser qualquer letra do alfabeto `a-zA-Z`. Existem duas maneiras de retornar à marca: exata (linha e coluna) com `` `x `` e por linha (`'x`).

```shell
ma    Marcar posição com a marca "a"
`a    Ir para a linha e coluna "a"
'a    Ir para a linha "a"
```

Há uma diferença entre marcar com letras minúsculas (a-z) e letras maiúsculas (A-Z). As letras minúsculas são marcas locais e as letras maiúsculas são marcas globais (às vezes conhecidas como marcas de arquivo).

Vamos falar sobre marcas locais. Cada buffer pode ter seu próprio conjunto de marcas locais. Se eu tiver dois arquivos abertos, posso definir uma marca "a" (`ma`) no primeiro arquivo e outra marca "a" (`ma`) no segundo arquivo.

Ao contrário das marcas locais, onde você pode ter um conjunto de marcas em cada buffer, você só tem um conjunto de marcas globais. Se você definir `mA` dentro de `myFile.txt`, da próxima vez que você executar `mA` em um arquivo diferente, ele sobrescreverá a primeira marca "A". Uma vantagem das marcas globais é que você pode pular para qualquer marca global, mesmo que esteja dentro de um projeto completamente diferente. As marcas globais podem viajar entre arquivos.

Para visualizar todas as marcas, use `:marks`. Você pode notar na lista de marcas que existem mais marcas além de `a-zA-Z`. Algumas delas são:

```shell
''    Voltar para a última linha no buffer atual antes do salto
``    Voltar para a última posição no buffer atual antes do salto
`[    Ir para o início do texto alterado / copiado anteriormente
`]    Ir para o final do texto alterado / copiado anteriormente
`<    Ir para o início da última seleção visual
`>    Ir para o final da última seleção visual
`0    Voltar para o último arquivo editado ao sair do vim
```

Existem mais marcas do que as listadas acima. Não vou cobri-las aqui porque acho que são raramente usadas, mas se você estiver curioso, confira `:h marks`.

## Salto

No Vim, você pode "saltar" para um arquivo diferente ou para uma parte diferente de um arquivo com alguns movimentos. Nem todos os movimentos contam como um salto, no entanto. Ir para baixo com `j` não conta como um salto. Ir para a linha 10 com `10G` conta como um salto.

Aqui estão os comandos que o Vim considera como comandos de "salto":

```shell
'       Ir para a linha marcada
`       Ir para a posição marcada
G       Ir para a linha
/       Buscar para frente
?       Buscar para trás
n       Repetir a última busca, mesma direção
N       Repetir a última busca, direção oposta
%       Encontrar correspondência
(       Ir para a última frase
)       Ir para a próxima frase
{       Ir para o último parágrafo
}       Ir para o próximo parágrafo
L       Ir para a última linha da janela exibida
M       Ir para a linha do meio da janela exibida
H       Ir para a linha superior da janela exibida
[[      Ir para a seção anterior
]]      Ir para a próxima seção
:s      Substituir
:tag    Saltar para a definição da tag
```

Não recomendo memorizar esta lista. Uma boa regra prática é que qualquer movimento que se desloque mais do que uma palavra e navegação na linha atual provavelmente é um salto. O Vim mantém o controle de onde você esteve quando se move e você pode ver esta lista dentro de `:jumps`.

Para mais informações, confira `:h jump-motions`.

Por que os saltos são úteis? Porque você pode navegar pela lista de saltos com `Ctrl-O` para subir na lista de saltos e `Ctrl-I` para descer na lista de saltos. `hjkl` não são comandos de "salto", mas você pode adicionar manualmente a localização atual à lista de saltos com `m'` antes do movimento. Por exemplo, `m'5j` adiciona a localização atual à lista de saltos e desce 5 linhas, e você pode voltar com `Ctrl-O`. Você pode saltar entre diferentes arquivos, o que discutirei mais na próxima parte.

## Aprenda Navegação da Maneira Inteligente

Se você é novo no Vim, isso é muito para aprender. Não espero que ninguém lembre de tudo imediatamente. Leva tempo até que você possa executá-los sem pensar.

Acho que a melhor maneira de começar é memorizar alguns movimentos essenciais. Recomendo começar com esses 10 movimentos: `h, j, k, l, w, b, G, /, ?, n`. Repita-os o suficiente até que você possa usá-los sem pensar.

Para melhorar sua habilidade de navegação, aqui estão minhas sugestões:
1. Fique atento a ações repetidas. Se você se pegar fazendo `l` repetidamente, procure um movimento que o leve para frente mais rápido. Você descobrirá que pode usar `w`. Se você se pegar fazendo `w` repetidamente, veja se há um movimento que o levará rapidamente pela linha atual. Você descobrirá que pode usar `f`. Se você puder descrever sua necessidade de forma sucinta, há uma boa chance de que o Vim tenha uma maneira de fazê-lo.
2. Sempre que você aprender um novo movimento, passe algum tempo até que você possa fazê-lo sem pensar.

Finalmente, perceba que você não precisa conhecer cada comando do Vim para ser produtivo. A maioria dos usuários do Vim não conhece. Eu não conheço. Aprenda os comandos que o ajudarão a realizar sua tarefa naquele momento.

Leve seu tempo. A habilidade de navegação é uma habilidade muito importante no Vim. Aprenda uma pequena coisa a cada dia e aprenda bem.