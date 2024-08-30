---
description: Este documento enseña cómo utilizar el comando punto en Vim para repetir
  cambios fácilmente, optimizando la edición y reduciendo repeticiones innecesarias.
title: Ch07. the Dot Command
---

En general, debes intentar evitar repetir lo que acabas de hacer siempre que sea posible. En este capítulo, aprenderás a usar el comando de punto para rehacer fácilmente el cambio anterior. Es un comando versátil para reducir repeticiones simples.

## Uso

Tal como su nombre indica, puedes usar el comando de punto presionando la tecla de punto (`.`).

Por ejemplo, si deseas reemplazar todas las "let" por "const" en las siguientes expresiones:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Busca con `/let` para ir a la coincidencia.
- Cambia con `cwconst<Esc>` para reemplazar "let" por "const".
- Navega con `n` para encontrar la siguiente coincidencia usando la búsqueda anterior.
- Repite lo que acabas de hacer con el comando de punto (`.`).
- Continúa presionando `n . n .` hasta que reemplaces cada palabra.

Aquí el comando de punto repitió la secuencia `cwconst<Esc>`. Te ahorró escribir ocho pulsaciones de teclas a cambio de solo una.

## ¿Qué es un Cambio?

Si miras la definición del comando de punto (`:h .`), dice que el comando de punto repite el último cambio. ¿Qué es un cambio?

Cada vez que actualizas (agregas, modificas o eliminas) el contenido del búfer actual, estás haciendo un cambio. Las excepciones son las actualizaciones realizadas por comandos de línea de comandos (los comandos que comienzan con `:`) que no cuentan como un cambio.

En el primer ejemplo, `cwconst<Esc>` fue el cambio. Ahora supongamos que tienes este texto:

```shell
pancake, potatoes, fruit-juice,
```

Para eliminar el texto desde el inicio de la línea hasta la siguiente ocurrencia de una coma, primero elimina hasta la coma, luego repite dos veces con `df,..`.

Intentemos otro ejemplo:

```shell
pancake, potatoes, fruit-juice,
```

Esta vez, tu tarea es eliminar la coma, no los elementos del desayuno. Con el cursor al principio de la línea, ve a la primera coma, elimínala, luego repite dos veces más con `f,x..` Fácil, ¿verdad? ¡Espera un momento, no funcionó! ¿Por qué?

Un cambio excluye movimientos porque no actualiza el contenido del búfer. El comando `f,x` consistió en dos acciones: el comando `f,` para mover el cursor a "," y `x` para eliminar un carácter. Solo el último, `x`, causó un cambio. Contrasta eso con `df,` del ejemplo anterior. En él, `f,` es una directiva para el operador de eliminación `d`, no un movimiento para mover el cursor. El `f,` en `df,` y `f,x` tienen dos roles muy diferentes.

Terminemos la última tarea. Después de ejecutar `f,` y luego `x`, ve a la siguiente coma con `;` para repetir el último `f`. Finalmente, usa `.` para eliminar el carácter bajo el cursor. Repite `; . ; .` hasta que todo esté eliminado. El comando completo es `f,x;.;.`.

Intentemos otro:

```shell
pancake
potatoes
fruit-juice
```

Agreguemos una coma al final de cada línea. Comenzando en la primera línea, haz `A,<Esc>j`. Para este momento, te das cuenta de que `j` no causa un cambio. El cambio aquí es solo `A,`. Puedes moverte y repetir el cambio con `j . j .`. El comando completo es `A,<Esc>j.j.`.

Cada acción desde el momento en que presionas el operador de comando de inserción (`A`) hasta que sales del comando de inserción (`<Esc>`) se considera un cambio.

## Repetición de Múltiples Líneas

Supongamos que tienes este texto:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Tu objetivo es eliminar todas las líneas excepto la línea "foo". Primero, elimina las primeras tres líneas con `d2j`, luego ve a la línea debajo de la línea "foo". En la siguiente línea, usa el comando de punto dos veces. El comando completo es `d2jj..`.

Aquí el cambio fue `d2j`. En este contexto, `2j` no fue un movimiento, sino parte del operador de eliminación.

Veamos otro ejemplo:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Eliminemos todas las z's. Comenzando desde el primer carácter en la primera línea, selecciona visualmente solo la primera z de las primeras tres líneas con el modo visual en bloque (`Ctrl-Vjj`). Si no estás familiarizado con el modo visual en bloque, lo cubriré en un capítulo posterior. Una vez que tengas las tres z's seleccionadas visualmente, elimínalas con el operador de eliminación (`d`). Luego muévete a la siguiente palabra (`w`) hacia la siguiente z. Repite el cambio dos veces más (`..`). El comando completo es `Ctrl-vjjdw..`.

Cuando eliminaste una columna de tres z's (`Ctrl-vjjd`), se contó como un cambio. La operación en modo visual se puede usar para apuntar a múltiples líneas como parte de un cambio.

## Incluir un Movimiento en un Cambio

Volvamos al primer ejemplo de este capítulo. Recuerda que el comando `/letcwconst<Esc>` seguido de `n . n .` reemplazó todas las "let" por "const" en las siguientes expresiones:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Hay una manera más rápida de lograr esto. Después de buscar `/let`, ejecuta `cgnconst<Esc>` y luego `. .`.

`gn` es un movimiento que busca hacia adelante el último patrón de búsqueda (en este caso, `/let`) y automáticamente hace un resaltado visual. Para reemplazar la siguiente ocurrencia, ya no tienes que moverte y repetir el cambio (`n . n .`), sino solo repetir (`. .`). ¡No tienes que usar movimientos de búsqueda más porque buscar la siguiente coincidencia ahora es parte del cambio!

Cuando estés editando, siempre mantente atento a movimientos que puedan hacer varias cosas a la vez como `gn` siempre que sea posible.

## Aprende el Comando de Punto de Manera Inteligente

El poder del comando de punto proviene de intercambiar varias pulsaciones de teclas por una. Probablemente no sea un intercambio rentable usar el comando de punto para operaciones de una sola tecla como `x`. Si tu último cambio requiere una operación compleja como `cgnconst<Esc>`, el comando de punto reduce nueve pulsaciones de teclas a una, un intercambio muy rentable.

Al editar, piensa en la repetibilidad. Por ejemplo, si necesito eliminar las siguientes tres palabras, ¿es más económico usar `d3w` o hacer `dw` y luego `.` dos veces? ¿Vas a eliminar una palabra de nuevo? Si es así, entonces tiene sentido usar `dw` y repetirlo varias veces en lugar de `d3w` porque `dw` es más reutilizable que `d3w`.

El comando de punto es un comando versátil para automatizar cambios simples. En un capítulo posterior, aprenderás a automatizar acciones más complejas con macros de Vim. Pero primero, aprendamos sobre registros para almacenar y recuperar texto.