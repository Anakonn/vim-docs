---
description: Este guia prático de Vim destaca os recursos essenciais para iniciantes,
  oferecendo exemplos para facilitar o aprendizado e maximizar a eficiência.
title: Ch00. Read This First
---

## Por Que Este Guia Foi Escrito

Existem muitos lugares para aprender Vim: o `vimtutor` é um ótimo ponto de partida e o manual `:help` tem todas as referências que você precisará.

No entanto, o usuário médio precisa de algo mais do que o `vimtutor` e menos do que o manual `:help`. Este guia tenta preencher essa lacuna, destacando apenas os recursos principais para aprender as partes mais úteis do Vim no menor tempo possível.

As chances são de que você não precisará de 100% dos recursos do Vim. Você provavelmente só precisa conhecer cerca de 20% deles para se tornar um Vimmer poderoso. Este guia mostrará quais recursos do Vim você achará mais úteis.

Este é um guia opinativo. Ele cobre técnicas que eu frequentemente uso ao utilizar o Vim. Os capítulos estão sequenciados com base no que eu acho que faria mais sentido lógico para um iniciante aprender Vim.

Este guia é rico em exemplos. Ao aprender uma nova habilidade, exemplos são indispensáveis; ter inúmeros exemplos solidificará esses conceitos de forma mais eficaz.

Alguns de vocês podem se perguntar por que precisam aprender Vimscript? No meu primeiro ano usando Vim, eu estava contente apenas em saber como usar o Vim. O tempo passou e eu comecei a precisar do Vimscript cada vez mais para escrever comandos personalizados para minhas necessidades específicas de edição. À medida que você dominar o Vim, mais cedo ou mais tarde precisará aprender Vimscript. Então, por que não mais cedo? Vimscript é uma linguagem pequena. Você pode aprender o básico em apenas quatro capítulos deste guia.

Você pode ir longe usando o Vim sem conhecer nenhum Vimscript, mas conhecê-lo ajudará você a se destacar ainda mais.

Este guia é escrito tanto para iniciantes quanto para Vimmers avançados. Ele começa com conceitos amplos e simples e termina com conceitos específicos e avançados. Se você já é um usuário avançado, eu o encorajaria a ler este guia do começo ao fim de qualquer maneira, porque você aprenderá algo novo!

## Como Fazer a Transição para o Vim a Partir de Outro Editor de Texto

Aprender Vim é uma experiência satisfatória, embora difícil. Existem duas abordagens principais para aprender Vim:

1. Parada abrupta
2. Gradual

Parar abruptamente significa parar de usar qualquer editor / IDE que você estava usando e usar o Vim exclusivamente a partir de agora. A desvantagem desse método é que você terá uma perda de produtividade séria durante a primeira semana ou duas. Se você é um programador em tempo integral, esse método pode não ser viável. É por isso que, para a maioria das pessoas, eu acredito que a melhor maneira de fazer a transição para o Vim é usá-lo gradualmente.

Para usar o Vim gradualmente, durante as primeiras duas semanas, passe uma hora por dia usando o Vim como seu editor, enquanto o restante do tempo você pode usar outros editores. Muitos editores modernos vêm com plugins do Vim. Quando comecei, usei o popular plugin do Vim para o VSCode por uma hora por dia. Gradualmente, aumentei o tempo com o plugin do Vim até que finalmente o usei o dia todo. Lembre-se de que esses plugins podem apenas emular uma fração dos recursos do Vim. Para experimentar todo o poder do Vim, como Vimscript, comandos de linha de comando (Ex) e integração de comandos externos, você precisará usar o próprio Vim.

Houve dois momentos cruciais que me fizeram começar a usar o Vim 100%: quando percebi que o Vim tem uma estrutura semelhante à gramática (veja o capítulo 4) e o plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (veja o capítulo 3).

O primeiro, quando percebi a estrutura semelhante à gramática do Vim, foi o momento decisivo em que finalmente entendi sobre o que esses usuários do Vim estavam falando. Eu não precisava aprender centenas de comandos únicos. Eu só precisava aprender um pequeno punhado de comandos e poderia encadeá-los de uma maneira muito intuitiva para fazer muitas coisas.

O segundo, a capacidade de executar rapidamente uma busca de arquivos difusa, foi o recurso de IDE que eu mais usei. Quando aprendi a fazer isso no Vim, ganhei um grande aumento de velocidade e nunca olhei para trás desde então.

Cada um programa de maneira diferente. Ao fazer uma introspecção, você descobrirá que há um ou dois recursos do seu editor / IDE favorito que você usa o tempo todo. Talvez tenha sido busca difusa, pular para definição ou compilação rápida. Quaisquer que sejam, identifique-os rapidamente e aprenda a implementá-los no Vim (as chances são de que o Vim provavelmente também possa fazê-los). Sua velocidade de edição receberá um grande impulso.

Uma vez que você consiga editar a 50% da velocidade original, é hora de ir para o Vim em tempo integral.

## Como Ler Este Guia

Este é um guia prático. Para se tornar bom no Vim, você precisa desenvolver sua memória muscular, não conhecimento teórico.

Você não aprende a andar de bicicleta lendo um guia sobre como andar de bicicleta. Você precisa realmente andar de bicicleta.

Você precisa digitar cada comando mencionado neste guia. Não só isso, mas você precisa repeti-los várias vezes e tentar diferentes combinações. Veja quais outros recursos o comando que você acabou de aprender possui. O comando `:help` e os motores de busca são seus melhores amigos. Seu objetivo não é saber tudo sobre um comando, mas ser capaz de executar esse comando de forma natural e instintiva.

Por mais que eu tente estruturar este guia de forma linear, alguns conceitos neste guia precisam ser apresentados fora de ordem. Por exemplo, no capítulo 1, menciono o comando de substituição (`:s`), mesmo que não seja abordado até o capítulo 12. Para remediar isso, sempre que um novo conceito que ainda não foi abordado for mencionado mais cedo, eu fornecerei um guia rápido de como fazer sem uma explicação detalhada. Então, por favor, tenha paciência comigo :).

## Mais Ajuda

Aqui está uma dica extra para usar o manual de ajuda: suponha que você queira aprender mais sobre o que `Ctrl-P` faz no modo de inserção. Se você apenas pesquisar por `:h CTRL-P`, você será direcionado para o `Ctrl-P` do modo normal. Esta não é a ajuda do `Ctrl-P` que você está procurando. Nesse caso, pesquise em vez disso por `:h i_CTRL-P`. O `i_` anexado representa o modo de inserção. Preste atenção a qual modo pertence.

## Sintaxe

A maioria das frases relacionadas a comandos ou código está em caixa de código (`como isto`).

Strings estão cercadas por um par de aspas duplas ("como isto").

Os comandos do Vim podem ser abreviados. Por exemplo, `:join` pode ser abreviado como `:j`. Ao longo do guia, eu misturarei as descrições abreviadas e longas. Para comandos que não são frequentemente usados neste guia, usarei a versão longa. Para comandos que são frequentemente usados, usarei a versão abreviada. Peço desculpas pelas inconsistências. Em geral, sempre que você encontrar um novo comando, verifique sempre no `:help` para ver suas abreviações.

## Vimrc

Em vários pontos do guia, eu me referirei a opções do vimrc. Se você é novo no Vim, um vimrc é como um arquivo de configuração.

O vimrc não será abordado até o capítulo 21. Para fins de clareza, mostrarei brevemente aqui como configurá-lo.

Suponha que você precise definir as opções de número (`set number`). Se você não tiver um vimrc ainda, crie um. Ele geralmente é colocado no seu diretório home e nomeado como `.vimrc`. Dependendo do seu sistema operacional, o local pode diferir. No macOS, eu o tenho em `~/.vimrc`. Para ver onde você deve colocar o seu, consulte `:h vimrc`.

Dentro dele, adicione `set number`. Salve (`:w`), e então faça o source (`:source %`). Agora você deve ver os números das linhas exibidos no lado esquerdo.

Alternativamente, se você não quiser fazer uma alteração permanente na configuração, você pode sempre executar o comando `set` inline, executando `:set number`. A desvantagem dessa abordagem é que essa configuração é temporária. Quando você fecha o Vim, a opção desaparece.

Como estamos aprendendo sobre o Vim e não sobre o Vi, uma configuração que você deve ter é a opção `nocompatible`. Adicione `set nocompatible` no seu vimrc. Muitos recursos específicos do Vim são desativados quando ele está rodando na opção `compatible`.

Em geral, sempre que um trecho mencionar uma opção do vimrc, basta adicionar essa opção ao vimrc, salvá-la e fazer o source.

## Futuro, Erros, Perguntas

Espere mais atualizações no futuro. Se você encontrar algum erro ou tiver alguma pergunta, sinta-se à vontade para entrar em contato.

Eu também planejei alguns capítulos futuros, então fique atento!

## Eu Quero Mais Truques do Vim

Para aprender mais sobre o Vim, siga [@learnvim](https://twitter.com/learnvim).

## Agradecimentos

Este guia não seria possível sem Bram Moleenar por criar o Vim, minha esposa que foi muito paciente e solidária durante toda a jornada, todos os [colaboradores](https://github.com/iggredible/Learn-Vim/graphs/contributors) do projeto learn-vim, a comunidade do Vim e muitos, muitos outros que não foram mencionados.

Obrigado. Todos vocês ajudam a tornar a edição de texto divertida :)