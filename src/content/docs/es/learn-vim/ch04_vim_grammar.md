---
description: Este capítulo descompone la estructura gramatical de los comandos de
  Vim, facilitando el aprendizaje y uso del "lenguaje Vim" para los usuarios.
title: Ch04. Vim Grammar
---

Es fácil sentirse intimidado por la complejidad de los comandos de Vim. Si ves a un usuario de Vim haciendo `gUfV` o `1GdG`, puede que no sepas de inmediato qué hacen estos comandos. En este capítulo, desglosaré la estructura general de los comandos de Vim en una regla gramatical simple.

Este es el capítulo más importante de toda la guía. Una vez que entiendas la estructura gramatical subyacente, podrás "hablar" con Vim. Por cierto, cuando digo *lenguaje Vim* en este capítulo, no estoy hablando del lenguaje Vimscript (el lenguaje de programación incorporado de Vim, aprenderás eso en capítulos posteriores).

## Cómo Aprender un Idioma

No soy un hablante nativo de inglés. Aprendí inglés cuando tenía 13 años, cuando me mudé a EE. UU. Hay tres cosas que necesitas hacer para aprender a hablar un nuevo idioma:

1. Aprender reglas gramaticales.
2. Aumentar el vocabulario.
3. Practicar, practicar, practicar.

De igual manera, para hablar el lenguaje Vim, necesitas aprender las reglas gramaticales, aumentar el vocabulario y practicar hasta que puedas ejecutar los comandos sin pensar.

## Regla Gramatical

Solo hay una regla gramatical en el lenguaje Vim:

```shell
verbo + sustantivo
```

¡Eso es todo!

Esto es como decir estas frases en inglés:

- *"Comer (verbo) una dona (sustantivo)"*
- *"Patear (verbo) una pelota (sustantivo)"*
- *"Aprender (verbo) el editor Vim (sustantivo)"*

Ahora necesitas construir tu vocabulario con verbos y sustantivos básicos de Vim.

## Sustantivos (Movimientos)

Los sustantivos son movimientos de Vim. Los movimientos se utilizan para moverse en Vim. A continuación se muestra una lista de algunos movimientos de Vim:

```shell
h    Izquierda
j    Abajo
k    Arriba
l    Derecha
w    Moverse hacia adelante hasta el comienzo de la siguiente palabra
}    Saltar al siguiente párrafo
$    Ir al final de la línea
```

Aprenderás más sobre los movimientos en el próximo capítulo, así que no te preocupes demasiado si no entiendes algunos de ellos.

## Verbos (Operadores)

Según `:h operator`, Vim tiene 16 operadores. Sin embargo, en mi experiencia, aprender estos 3 operadores es suficiente para el 80% de mis necesidades de edición:

```shell
y    Copiar texto (yank)
d    Eliminar texto y guardar en el registro
c    Eliminar texto, guardar en el registro y comenzar el modo de inserción
```

Por cierto, después de que copies un texto, puedes pegarlo con `p` (después del cursor) o `P` (antes del cursor).

## Verbo y Sustantivo

Ahora que conoces los sustantivos y verbos básicos, ¡apliquemos la regla gramatical, verbo + sustantivo! Supongamos que tienes esta expresión:

```javascript
const learn = "vim";
```

- Para copiar todo desde tu ubicación actual hasta el final de la línea: `y$`.
- Para eliminar desde tu ubicación actual hasta el comienzo de la siguiente palabra: `dw`.
- Para cambiar desde tu ubicación actual hasta el final del párrafo actual, digamos `c}`.

Los movimientos también aceptan números como argumentos (discutiré esto en el próximo capítulo). Si necesitas subir 3 líneas, en lugar de presionar `k` 3 veces, puedes hacer `3k`. El conteo funciona con la gramática de Vim.
- Para copiar dos caracteres a la izquierda: `y2h`.
- Para eliminar las siguientes dos palabras: `d2w`.
- Para cambiar las siguientes dos líneas: `c2j`.

En este momento, puede que tengas que pensar mucho para ejecutar incluso un comando simple. No estás solo. Cuando comencé, tuve luchas similares, pero me volví más rápido con el tiempo. Tú también lo harás. Repetición, repetición, repetición.

Como nota al margen, las operaciones de línea (operaciones que afectan toda la línea) son operaciones comunes en la edición de texto. En general, al escribir un comando de operador dos veces, Vim realiza una operación de línea para esa acción. Por ejemplo, `dd`, `yy` y `cc` realizan **eliminación**, **copia** y **cambio** en toda la línea. ¡Prueba esto con otros operadores!

Esto es realmente genial. Estoy viendo un patrón aquí. Pero aún no he terminado. Vim tiene un tipo más de sustantivo: objetos de texto.

## Más Sustantivos (Objetos de Texto)

Imagina que estás en algún lugar dentro de un par de paréntesis como `(hola Vim)` y necesitas eliminar toda la frase dentro de los paréntesis. ¿Cómo puedes hacerlo rápidamente? ¿Hay alguna manera de eliminar el "grupo" en el que estás?

La respuesta es sí. Los textos a menudo vienen estructurados. A menudo contienen paréntesis, comillas, corchetes, llaves y más. Vim tiene una manera de capturar esta estructura con objetos de texto.

Los objetos de texto se utilizan con operadores. Hay dos tipos de objetos de texto: objetos de texto internos y externos.

```shell
i + objeto    Objeto de texto interno
a + objeto    Objeto de texto externo
```

El objeto de texto interno selecciona el objeto dentro *sin* el espacio en blanco o los objetos circundantes. El objeto de texto externo selecciona el objeto dentro *incluyendo* el espacio en blanco o los objetos circundantes. En general, un objeto de texto externo siempre selecciona más texto que un objeto de texto interno. Si tu cursor está en algún lugar dentro de los paréntesis en la expresión `(hola Vim)`:
- Para eliminar el texto dentro de los paréntesis sin eliminar los paréntesis: `di(`.
- Para eliminar los paréntesis y el texto dentro: `da(`.

Veamos un ejemplo diferente. Supongamos que tienes esta función de Javascript y tu cursor está en la "H" de "Hola":

```javascript
const hello = function() {
  console.log("Hola Vim");
  return true;
}
```

- Para eliminar todo "Hola Vim": `di(`.
- Para eliminar el contenido de la función (rodeado por `{}`): `di{`.
- Para eliminar la cadena "Hola": `diw`.

Los objetos de texto son poderosos porque puedes apuntar a diferentes objetos desde una ubicación. Puedes eliminar los objetos dentro de los paréntesis, el bloque de la función o la palabra actual. Mnemotécnicamente, cuando ves `di(`, `di{` y `diw`, tienes una buena idea de qué objetos de texto representan: un par de paréntesis, un par de llaves y una palabra.

Veamos un último ejemplo. Supongamos que tienes estas etiquetas HTML:

```html
<div>
  <h1>Encabezado1</h1>
  <p>Párrafo1</p>
  <p>Párrafo2</p>
</div>
```

Si tu cursor está en el texto "Encabezado1":
- Para eliminar "Encabezado1": `dit`.
- Para eliminar `<h1>Encabezado1</h1>`: `dat`.

Si tu cursor está en "div":
- Para eliminar `h1` y ambas líneas `p`: `dit`.
- Para eliminar todo: `dat`.
- Para eliminar "div": `di<`.

A continuación se muestra una lista de objetos de texto comunes:

```shell
w         Una palabra
p         Un párrafo
s         Una oración
( o )     Un par de ( )
{ o }     Un par de { }
[ o ]     Un par de [ ]
< o >     Un par de < >
t         Etiquetas XML
"         Un par de " "
'         Un par de ' '
`         Un par de ` `
```

Para aprender más, consulta `:h text-objects`.

## Composabilidad y Gramática

La gramática de Vim es un subconjunto de la característica de composabilidad de Vim. Hablemos de la composabilidad en Vim y por qué esta es una gran característica para tener en un editor de texto.

La composabilidad significa tener un conjunto de comandos generales que se pueden combinar (componer) para realizar comandos más complejos. Al igual que en la programación, donde puedes crear abstracciones más complejas a partir de abstracciones más simples, en Vim puedes ejecutar comandos complejos a partir de comandos más simples. La gramática de Vim es la manifestación de la naturaleza composable de Vim.

El verdadero poder de la composabilidad de Vim brilla cuando se integra con programas externos. Vim tiene un operador de filtro (`!`) para usar programas externos como filtros para nuestros textos. Supongamos que tienes este texto desordenado a continuación y deseas tabularlo:

```shell
Id|Nombre|Cuteness
01|Cachorro|Muy
02|Gatito|Ok
03|Conejo|Ok
```

Esto no se puede hacer fácilmente con comandos de Vim, pero puedes hacerlo rápidamente con el comando de terminal `column` (suponiendo que tu terminal tenga el comando `column`). Con tu cursor en "Id", ejecuta `!}column -t -s "|"`. ¡Voila! Ahora tienes estos bonitos datos tabulares con solo un comando rápido.

```shell
Id  Nombre  Cuteness
01  Cachorro  Muy
02  Gatito  Ok
03  Conejo  Ok
```

Desglosemos el comando. El verbo fue `!` (operador de filtro) y el sustantivo fue `}` (ir al siguiente párrafo). El operador de filtro `!` aceptó otro argumento, un comando de terminal, así que le di `column -t -s "|"`. No entraré en cómo funcionó `column`, pero en efecto, tabuló el texto.

Supongamos que deseas no solo tabular tu texto, sino mostrar solo las filas con "Ok". Sabes que `awk` puede hacer el trabajo fácilmente. Puedes hacer esto en su lugar:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Resultado:

```shell
02  Gatito  Ok
03  Conejo  Ok
```

¡Genial! El operador de comando externo también puede usar tuberías (`|`).

Este es el poder de la composabilidad de Vim. Cuanto más conozcas tus operadores, movimientos y comandos de terminal, tu capacidad para componer acciones complejas se *multiplica*.

Supongamos que solo conoces cuatro movimientos, `w, $, }, G` y solo un operador, `d`. Puedes hacer 8 acciones: *mover* 4 maneras diferentes (`w, $, }, G`) y *eliminar* 4 objetivos diferentes (`dw, d$, d}, dG`). Luego, un día aprendes sobre el operador en mayúsculas (`gU`). No solo has agregado una nueva habilidad a tu cinturón de herramientas de Vim, sino *cuatro*: `gUw, gU$, gU}, gUG`. Esto hace que tengas 12 herramientas en tu cinturón de herramientas de Vim. Cada nuevo conocimiento es un multiplicador para tus habilidades actuales. Si conoces 10 movimientos y 5 operadores, tienes 60 movimientos (50 operaciones + 10 movimientos) en tu arsenal. Vim tiene un movimiento de número de línea (`nG`) que te da `n` movimientos, donde `n` es cuántas líneas tienes en tu archivo (para ir a la línea 5, ejecuta `5G`). El movimiento de búsqueda (`/`) prácticamente te da un número ilimitado de movimientos porque puedes buscar cualquier cosa. El operador de comando externo (`!`) te da tantas herramientas de filtrado como el número de comandos de terminal que conoces. Usando una herramienta composable como Vim, todo lo que sabes se puede vincular para realizar operaciones con una complejidad creciente. Cuanto más sepas, más poderoso te vuelves.

Este comportamiento composable refleja la filosofía de Unix: *haz una cosa bien*. Un operador tiene un trabajo: hacer Y. Un movimiento tiene un trabajo: ir a X. Al combinar un operador con un movimiento, obtienes predeciblemente YX: hacer Y en X.

Los movimientos y operadores son extensibles. Puedes crear movimientos y operadores personalizados para agregar a tu cinturón de herramientas de Vim. El plugin [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) te permite crear tus propios objetos de texto. También contiene una [lista](https://github.com/kana/vim-textobj-user/wiki) de objetos de texto personalizados creados por usuarios.

## Aprende la Gramática de Vim de Manera Inteligente

Acabas de aprender sobre la regla de gramática de Vim: `verbo + sustantivo`. Uno de mis mayores momentos "AHA!" con Vim fue cuando acababa de aprender sobre el operador en mayúsculas (`gU`) y quería poner en mayúsculas la palabra actual, *instintivamente* ejecuté `gUiw` y funcionó. La palabra fue puesta en mayúsculas. En ese momento, finalmente comencé a entender Vim. Mi esperanza es que pronto tengas tu propio momento "AHA!", si es que no lo has tenido ya.

El objetivo de este capítulo es mostrarte el patrón `verbo + sustantivo` en Vim para que enfoques el aprendizaje de Vim como el aprendizaje de un nuevo idioma en lugar de memorizar cada combinación de comandos.

Aprende el patrón y entiende las implicaciones. Esa es la manera inteligente de aprender.