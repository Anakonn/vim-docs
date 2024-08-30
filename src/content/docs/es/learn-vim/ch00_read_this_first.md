---
description: Esta guía de Vim destaca las características clave para aprender rápidamente,
  enfocándose en lo más útil y práctico para convertirse en un Vimmer eficaz.
title: Ch00. Read This First
---

## Por Qué Se Escribió Esta Guía

Hay muchos lugares para aprender Vim: el `vimtutor` es un gran lugar para comenzar y el manual `:help` tiene todas las referencias que necesitarás.

Sin embargo, el usuario promedio necesita algo más que `vimtutor` y menos que el manual `:help`. Esta guía intenta cerrar esa brecha al resaltar solo las características clave para aprender las partes más útiles de Vim en el menor tiempo posible.

Es probable que no necesites el 100% de las características de Vim. Probablemente solo necesites conocer alrededor del 20% de ellas para convertirte en un poderoso Vimmer. Esta guía te mostrará qué características de Vim encontrarás más útiles.

Esta es una guía con opiniones. Cubre técnicas que a menudo uso al utilizar Vim. Los capítulos están secuenciados en función de lo que creo que tendría más sentido lógico para que un principiante aprenda Vim.

Esta guía está llena de ejemplos. Al aprender una nueva habilidad, los ejemplos son indispensables; tener numerosos ejemplos solidificará estos conceptos de manera más efectiva.

Algunos de ustedes pueden preguntarse, ¿por qué necesitan aprender Vimscript? En mi primer año usando Vim, estaba contento con solo saber cómo usar Vim. Pasó el tiempo y comencé a necesitar Vimscript cada vez más para escribir comandos personalizados para mis necesidades de edición específicas. A medida que dominas Vim, tarde o temprano necesitarás aprender Vimscript. Entonces, ¿por qué no antes? Vimscript es un lenguaje pequeño. Puedes aprender sus conceptos básicos en solo cuatro capítulos de esta guía.

Puedes avanzar mucho usando Vim sin conocer ningún Vimscript, pero saberlo te ayudará a sobresalir aún más.

Esta guía está escrita tanto para Vimmers principiantes como avanzados. Comienza con conceptos amplios y simples y termina con conceptos específicos y avanzados. Si ya eres un usuario avanzado, te animaría a leer esta guía de principio a fin de todos modos, ¡porque aprenderás algo nuevo!

## Cómo Hacer la Transición a Vim Desde Otro Editor de Texto

Aprender Vim es una experiencia satisfactoria, aunque difícil. Hay dos enfoques principales para aprender Vim:

1. De golpe
2. Gradual

Ir de golpe significa dejar de usar el editor / IDE que estabas usando y usar Vim exclusivamente a partir de ahora. La desventaja de este método es que tendrás una pérdida de productividad seria durante la primera semana o dos. Si eres un programador a tiempo completo, este método puede no ser factible. Por eso, para la mayoría de las personas, creo que la mejor manera de hacer la transición a Vim es usarlo gradualmente.

Para usar Vim gradualmente, durante las primeras dos semanas, pasa una hora al día usando Vim como tu editor, mientras que el resto del tiempo puedes usar otros editores. Muchos editores modernos vienen con complementos de Vim. Cuando comencé, usé el popular complemento de Vim de VSCode durante una hora al día. Aumenté gradualmente el tiempo con el complemento de Vim hasta que finalmente lo usé todo el día. Ten en cuenta que estos complementos solo pueden emular una fracción de las características de Vim. Para experimentar el poder completo de Vim, como Vimscript, comandos de línea de comandos (Ex) y la integración de comandos externos, necesitarás usar Vim en sí.

Hubo dos momentos cruciales que me hicieron comenzar a usar Vim al 100%: cuando comprendí que Vim tiene una estructura similar a la gramática (ver capítulo 4) y el complemento [fzf.vim](https://github.com/junegunn/fzf.vim) (ver capítulo 3).

El primero, cuando me di cuenta de la estructura similar a la gramática de Vim, fue el momento definitorio en el que finalmente entendí de qué hablaban estos usuarios de Vim. No necesitaba aprender cientos de comandos únicos. Solo tenía que aprender un pequeño puñado de comandos y podía encadenarlos de una manera muy intuitiva para hacer muchas cosas.

El segundo, la capacidad de ejecutar rápidamente una búsqueda de archivos difusa, fue la característica de IDE que más utilicé. Cuando aprendí a hacer eso en Vim, obtuve un gran aumento de velocidad y nunca miré atrás desde entonces.

Cada uno programa de manera diferente. Al hacer una introspección, descubrirás que hay una o dos características de tu editor / IDE favorito que usas todo el tiempo. Tal vez fue la búsqueda difusa, saltar a la definición o compilación rápida. Cualesquiera que sean, identifícalas rápidamente y aprende cómo implementarlas en Vim (es probable que Vim también pueda hacerlas). Tu velocidad de edición recibirá un gran impulso.

Una vez que puedas editar al 50% de la velocidad original, es hora de usar Vim a tiempo completo.

## Cómo Leer Esta Guía

Esta es una guía práctica. Para volverte bueno en Vim, necesitas desarrollar tu memoria muscular, no solo conocimiento teórico.

No aprendes a andar en bicicleta leyendo una guía sobre cómo andar en bicicleta. Necesitas realmente andar en bicicleta.

Necesitas escribir cada comando mencionado en esta guía. No solo eso, sino que necesitas repetirlos varias veces y probar diferentes combinaciones. Investiga qué otras características tiene el comando que acabas de aprender. El comando `:help` y los motores de búsqueda son tus mejores amigos. Tu objetivo no es conocer todo sobre un comando, sino poder ejecutar ese comando de manera natural e instintiva.

Por mucho que intente hacer que esta guía sea lineal, algunos conceptos en esta guía deben presentarse fuera de orden. Por ejemplo, en el capítulo 1, menciono el comando de sustitución (`:s`), aunque no se cubrirá hasta el capítulo 12. Para remediar esto, cada vez que se mencione un nuevo concepto que aún no se ha cubierto, proporcionaré una guía rápida de cómo hacerlo sin una explicación detallada. Así que, por favor, ten paciencia conmigo :).

## Más Ayuda

Aquí hay un consejo adicional para usar el manual de ayuda: supongamos que deseas aprender más sobre lo que hace `Ctrl-P` en modo de inserción. Si simplemente buscas `:h CTRL-P`, serás dirigido a `Ctrl-P` en modo normal. Esta no es la ayuda de `Ctrl-P` que estás buscando. En este caso, busca en su lugar `:h i_CTRL-P`. El `i_` añadido representa el modo de inserción. Presta atención a qué modo pertenece.

## Sintaxis

La mayoría de las frases relacionadas con comandos o código están en formato de código (`como esto`).

Las cadenas están rodeadas por un par de comillas dobles ("como esto").

Los comandos de Vim pueden ser abreviados. Por ejemplo, `:join` se puede abreviar como `:j`. A lo largo de la guía, mezclaré las descripciones abreviadas y largas. Para los comandos que no se usan con frecuencia en esta guía, usaré la versión larga. Para los comandos que se usan con frecuencia, usaré la versión abreviada. Pido disculpas por las inconsistencias. En general, cada vez que veas un nuevo comando, siempre revísalo en `:help` para ver sus abreviaturas.

## Vimrc

En varios puntos de la guía, me referiré a las opciones de vimrc. Si eres nuevo en Vim, un vimrc es como un archivo de configuración.

El vimrc no se cubrirá hasta el capítulo 21. Para mayor claridad, mostraré brevemente aquí cómo configurarlo.

Supongamos que necesitas establecer las opciones de número (`set number`). Si no tienes un vimrc ya, crea uno. Generalmente se coloca en tu directorio personal y se llama `.vimrc`. Dependiendo de tu sistema operativo, la ubicación puede diferir. En macOS, lo tengo en `~/.vimrc`. Para ver dónde deberías poner el tuyo, consulta `:h vimrc`.

Dentro de él, agrega `set number`. Guárdalo (`:w`), luego cárgalo (`:source %`). Ahora deberías ver los números de línea mostrados en el lado izquierdo.

Alternativamente, si no deseas hacer un cambio de configuración permanente, siempre puedes ejecutar el comando `set` en línea, ejecutando `:set number`. La desventaja de este enfoque es que esta configuración es temporal. Cuando cierras Vim, la opción desaparece.

Dado que estamos aprendiendo sobre Vim y no sobre Vi, una configuración que debes tener es la opción `nocompatible`. Agrega `set nocompatible` en tu vimrc. Muchas características específicas de Vim están deshabilitadas cuando se ejecuta con la opción `compatible`.

En general, cada vez que un pasaje mencione una opción de vimrc, simplemente agrega esa opción al vimrc, guárdala y cárgala.

## Futuro, Errores, Preguntas

Espera más actualizaciones en el futuro. Si encuentras algún error o tienes alguna pregunta, no dudes en comunicarte.

También tengo planeados algunos capítulos más, ¡así que mantente atento!

## Quiero Más Trucos de Vim

Para aprender más sobre Vim, sigue a [@learnvim](https://twitter.com/learnvim).

## Agradecimientos

Esta guía no sería posible sin Bram Moleenar por crear Vim, mi esposa que ha sido muy paciente y solidaria a lo largo del viaje, todos los [colaboradores](https://github.com/iggredible/Learn-Vim/graphs/contributors) del proyecto learn-vim, la comunidad de Vim y muchos, muchos otros que no fueron mencionados.

Gracias. Todos ustedes ayudan a hacer que la edición de texto sea divertida :)