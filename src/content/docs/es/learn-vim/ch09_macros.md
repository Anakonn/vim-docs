---
description: Aprende a usar macros en Vim para automatizar tareas repetitivas, grabando
  acciones y ejecutándolas fácilmente cuando las necesites.
title: Ch09. Macros
---

Al editar archivos, es posible que te encuentres repitiendo las mismas acciones. ¿No sería genial si pudieras hacer esas acciones una vez y reproducirlas siempre que las necesites? Con los macros de Vim, puedes grabar acciones y almacenarlas dentro de los registros de Vim para ser ejecutadas cuando las necesites.

En este capítulo, aprenderás cómo usar macros para automatizar tareas mundanas (además, se ve genial ver cómo tu archivo se edita solo).

## Macros Básicos

Aquí está la sintaxis básica de un macro de Vim:

```shell
qa                     Comienza a grabar un macro en el registro a
q (mientras grabas)    Detiene la grabación del macro
```

Puedes elegir cualquier letra minúscula (a-z) para almacenar macros. Aquí está cómo puedes ejecutar un macro:

```shell
@a    Ejecuta el macro del registro a
@@    Ejecuta los últimos macros ejecutados
```

Supongamos que tienes este texto y quieres poner en mayúsculas todo en cada línea:

```shell
hello
vim
macros
are
awesome
```

Con el cursor al inicio de la línea "hello", ejecuta:

```shell
qa0gU$jq
```

El desglose:
- `qa` comienza a grabar un macro en el registro a.
- `0` va al inicio de la línea.
- `gU$` convierte en mayúsculas el texto desde tu ubicación actual hasta el final de la línea.
- `j` baja una línea.
- `q` detiene la grabación.

Para reproducirlo, ejecuta `@a`. Al igual que muchos otros comandos de Vim, puedes pasar un argumento de conteo a los macros. Por ejemplo, ejecutar `3@a` ejecuta el macro tres veces.

## Protección de Seguridad

La ejecución de macros se detiene automáticamente cuando encuentra un error. Supongamos que tienes este texto:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Si deseas poner en mayúsculas la primera palabra en cada línea, este macro debería funcionar:

```shell
qa0W~jq
```

Aquí está el desglose del comando anterior:
- `qa` comienza a grabar un macro en el registro a.
- `0` va al inicio de la línea.
- `W` va a la siguiente PALABRA.
- `~` alterna el caso del carácter bajo el cursor.
- `j` baja una línea.
- `q` detiene la grabación.

Prefiero contar en exceso la ejecución de mi macro que subestimar, así que generalmente lo llamo noventa y nueve veces (`99@a`). Con este comando, Vim no ejecuta realmente este macro noventa y nueve veces. Cuando Vim llega a la última línea y ejecuta el movimiento `j`, no encuentra más líneas para bajar, lanza un error y detiene la ejecución del macro.

El hecho de que la ejecución del macro se detenga al primer encuentro de error es una buena característica, de lo contrario, Vim continuaría ejecutando este macro noventa y nueve veces aunque ya haya alcanzado el final de la línea.

## Macro de Línea de Comando

Ejecutar `@a` en modo normal no es la única forma en que puedes ejecutar macros en Vim. También puedes ejecutar el comando de línea de comando `:normal @a`. `:normal` permite al usuario ejecutar cualquier comando de modo normal pasado como argumento. En el caso anterior, es lo mismo que ejecutar `@a` desde el modo normal.

El comando `:normal` acepta rangos como argumentos. Puedes usar esto para ejecutar un macro en rangos seleccionados. Si deseas ejecutar tu macro entre las líneas 2 y 3, puedes ejecutar `:2,3 normal @a`.

## Ejecutando un Macro en Múltiples Archivos

Supongamos que tienes múltiples archivos `.txt`, cada uno contiene algunos textos. Tu tarea es poner en mayúsculas la primera palabra solo en las líneas que contienen la palabra "donut". Supón que tienes `0W~j` en el registro a (el mismo macro que antes). ¿Cómo puedes lograr esto rápidamente?

Primer archivo:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

Segundo archivo:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

Tercer archivo:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

Aquí está cómo puedes hacerlo:
- `:args *.txt` para encontrar todos los archivos `.txt` en tu directorio actual.
- `:argdo g/donut/normal @a` ejecuta el comando global `g/donut/normal @a` en cada archivo dentro de `:args`.
- `:argdo update` ejecuta el comando `update` para guardar cada archivo dentro de `:args` cuando el buffer ha sido modificado.

Si no estás familiarizado con el comando global `:g/donut/normal @a`, ejecuta el comando que das (`normal @a`) en líneas que coinciden con el patrón (`/donut/`). Revisaré el comando global en un capítulo posterior.

## Macro Recursivo

Puedes ejecutar un macro recursivamente llamando al mismo registro de macro mientras grabas ese macro. Supongamos que tienes esta lista nuevamente y necesitas alternar el caso de la primera palabra:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Esta vez, hagámoslo recursivamente. Ejecuta:

```shell
qaqqa0W~j@aq
```

Aquí está el desglose de los pasos:
- `qaq` graba un macro vacío a. Es necesario comenzar con un registro vacío porque cuando llamas recursivamente al macro, ejecutará lo que esté en ese registro.
- `qa` comienza a grabar en el registro a.
- `0` va al primer carácter en la línea actual.
- `W` va a la siguiente PALABRA.
- `~` alterna el caso del carácter bajo el cursor.
- `j` baja una línea.
- `@a` ejecuta el macro a.
- `q` detiene la grabación.

Ahora solo puedes ejecutar `@a` y ver cómo Vim ejecuta el macro recursivamente.

¿Cómo supo el macro cuándo detenerse? Cuando el macro estaba en la última línea, intentó ejecutar `j`, y como no había más líneas a las que ir, detuvo la ejecución del macro.

## Agregando un Macro

Si necesitas agregar acciones a un macro existente, en lugar de recrear el macro desde cero, puedes agregar acciones a uno existente. En el capítulo de registros, aprendiste que puedes agregar a un registro nombrado usando su símbolo en mayúsculas. La misma regla se aplica. Para agregar acciones a un macro de registro, usa el registro A.

Graba un macro en el registro a: `qa0W~q` (esta secuencia alterna el caso de la siguiente PALABRA en una línea). Si deseas agregar una nueva secuencia para también añadir un punto al final de la línea, ejecuta:

```shell
qAA.<Esc>q
```

El desglose:
- `qA` comienza a grabar el macro en el registro A.
- `A.<Esc>` inserta al final de la línea (aquí `A` es el comando de modo de inserción, no debe confundirse con el macro A) un punto, luego sale del modo de inserción.
- `q` detiene la grabación del macro.

Ahora, cuando ejecutes `@a`, no solo alterna el caso de la siguiente PALABRA, sino que también añade un punto al final de la línea.

## Enmendando un Macro

¿Qué pasa si necesitas agregar nuevas acciones en medio de un macro?

Supón que tienes un macro que alterna la primera palabra real y agrega un punto al final de la línea, `0W~A.<Esc>` en el registro a. Supón que entre poner en mayúsculas la primera palabra y agregar un punto al final de la línea, necesitas agregar la palabra "deep fried" justo antes de la palabra "donut" *(porque lo único mejor que los donuts regulares son los donuts fritos)*.

Reutilizaré el texto de la sección anterior:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Primero, llamemos al macro existente (supón que has mantenido el macro de la sección anterior en el registro a) con `:put a`:

```shell
0W~A.^[
```

¿Qué es este `^[`? ¿No hiciste `0W~A.<Esc>`? ¿Dónde está el `<Esc>`? `^[` es la representación *interna* de Vim de `<Esc>`. Con ciertas teclas especiales, Vim imprime la representación de esas teclas en forma de códigos internos. Algunas teclas comunes que tienen representaciones de códigos internos son `<Esc>`, `<Backspace>` y `<Enter>`. Hay más teclas especiales, pero no están dentro del alcance de este capítulo.

Volviendo al macro, justo después del operador de alternancia de caso (`~`), agreguemos las instrucciones para ir al final de la línea (`$`), retroceder una palabra (`b`), ir al modo de inserción (`i`), escribir "deep fried " (no olvides el espacio después de "fried "), y salir del modo de inserción (`<Esc>`).

Aquí está lo que terminarás teniendo:

```shell
0W~$bideep fried <Esc>A.^[
```

Hay un pequeño problema. Vim no entiende `<Esc>`. No puedes escribir literalmente `<Esc>`. Tendrás que escribir la representación del código interno para la tecla `<Esc>`. Mientras estás en modo de inserción, presionas `Ctrl-V` seguido de `<Esc>`. Vim imprimirá `^[`. `Ctrl-V` es un operador de modo de inserción para insertar el siguiente carácter no numérico *literalmente*. Tu código de macro debería verse así ahora:

```shell
0W~$bideep fried ^[A.^[
```

Para agregar la instrucción enmendada al registro a, puedes hacerlo de la misma manera que agregar una nueva entrada a un registro nombrado. Al inicio de la línea, ejecuta `"ay$` para almacenar el texto copiado en el registro a.

Ahora, cuando ejecutes `@a`, tu macro alternará el caso de la primera palabra, agregará "deep fried " antes de "donut", y añadirá un "." al final de la línea. ¡Delicioso!

Una forma alternativa de enmendar un macro es usar una expresión de línea de comando. Haz `:let @a="`, luego haz `Ctrl-R a`, esto pegará literalmente el contenido del registro a. Finalmente, no olvides cerrar las comillas dobles (`"`). Podrías tener algo como `:let @a="0W~$bideep fried ^[A.^["`.

## Redundancia de Macros

Puedes duplicar fácilmente macros de un registro a otro. Por ejemplo, para duplicar un macro en el registro a al registro z, puedes hacer `:let @z = @a`. `@a` representa el contenido del registro a. Ahora, si ejecutas `@z`, realiza exactamente las mismas acciones que `@a`.

Encuentro útil crear una redundancia en mis macros más utilizados. En mi flujo de trabajo, generalmente grabo macros en las primeras siete letras del alfabeto (a-g) y a menudo las reemplazo sin pensarlo mucho. Si muevo los macros útiles hacia el final del alfabeto, puedo preservarlos sin preocuparme de que accidentalmente los reemplace.

## Macros en Serie vs Paralelo

Vim puede ejecutar macros en serie y en paralelo. Supongamos que tienes este texto:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Si deseas grabar un macro para poner en minúsculas todos los "FUNC" en mayúsculas, este macro debería funcionar:

```shell
qa0f{gui{jq
```

El desglose:
- `qa` comienza a grabar en el registro a.
- `0` va a la primera línea.
- `f{` encuentra la primera instancia de "{".
- `gui{` convierte en minúsculas (`gu`) el texto dentro del objeto de texto entre corchetes (`i{`).
- `j` baja una línea.
- `q` detiene la grabación del macro.

Ahora puedes ejecutar `99@a` para ejecutarlo en las líneas restantes. Sin embargo, ¿qué pasa si tienes esta expresión de importación dentro de tu archivo?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Al ejecutar `99@a`, solo ejecuta el macro tres veces. No ejecuta el macro en las últimas dos líneas porque la ejecución falla al intentar ejecutar `f{` en la línea "foo". Esto es esperado al ejecutar el macro en serie. Siempre puedes ir a la siguiente línea donde está "FUNC4" y reproducir ese macro nuevamente. Pero, ¿qué pasa si quieres hacer todo de una vez?

Ejecuta el macro en paralelo.

Recuerda de la sección anterior que los macros pueden ser ejecutados usando el comando de línea de comando `:normal` (ej: `:3,5 normal @a` ejecuta el macro a en las líneas 3-5). Si ejecutas `:1,$ normal @a`, verás que el macro se está ejecutando en todas las líneas excepto en la línea "foo". ¡Funciona!

Aunque internamente Vim no ejecuta realmente los macros en paralelo, externamente, se comporta como tal. Vim ejecuta `@a` *independientemente* en cada línea desde la primera hasta la última línea (`1,$`). Dado que Vim ejecuta estos macros de manera independiente, cada línea no sabe que una de las ejecuciones del macro falló en la línea "foo".
## Aprende Macros de la Manera Inteligente

Muchas cosas que haces al editar son repetitivas. Para mejorar en la edición, adquiere el hábito de detectar acciones repetitivas. Usa macros (o el comando de punto) para no tener que realizar la misma acción dos veces. Casi todo lo que puedes hacer en Vim se puede replicar con macros.

Al principio, me resulta muy incómodo escribir macros, pero no te rindas. Con suficiente práctica, adquirirás el hábito de automatizar todo.

Puede que te resulte útil usar mnemotécnicas para ayudar a recordar tus macros. Si tienes una macro que crea una función, usa el "f register (`qf`). Si tienes una macro para operaciones numéricas, el "n register debería funcionar (`qn`). Nómbrala con el *primer registro nombrado* que te venga a la mente cuando pienses en esa operación. También encuentro que el "q register es un buen registro de macro predeterminado porque `qq` requiere menos esfuerzo mental para pensar en ello. Por último, también me gusta incrementar mis macros en orden alfabético, como `qa`, luego `qb`, luego `qc`, y así sucesivamente.

Encuentra un método que funcione mejor para ti.