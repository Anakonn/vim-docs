---
description: Aprende a editar múltiples archivos en Vim utilizando comandos como `argdo`,
  `bufdo` y `cdo`, y descubre cómo optimizar tu flujo de trabajo.
title: Ch21. Multiple File Operations
---

Poder actualizar en múltiples archivos es otra herramienta de edición útil. Anteriormente aprendiste cómo actualizar múltiples textos con `cfdo`. En este capítulo, aprenderás las diferentes formas en que puedes editar múltiples archivos en Vim.

## Diferentes Formas de Ejecutar un Comando en Múltiples Archivos

Vim tiene ocho formas de ejecutar comandos en múltiples archivos:
- lista de argumentos (`argdo`)
- lista de buffers (`bufdo`)
- lista de ventanas (`windo`)
- lista de pestañas (`tabdo`)
- lista de quickfix (`cdo`)
- lista de quickfix por archivo (`cfdo`)
- lista de ubicación (`ldo`)
- lista de ubicación por archivo (`lfdo`)

Prácticamente hablando, probablemente solo usarás uno o dos la mayor parte del tiempo (personalmente uso `cdo` y `argdo` más que otros), pero es bueno aprender sobre todas las opciones disponibles y usar las que coincidan con tu estilo de edición.

Aprender ocho comandos puede sonar desalentador. Pero en realidad, estos comandos funcionan de manera similar. Después de aprender uno, aprender el resto se volverá más fácil. Todos comparten la misma gran idea: hacer una lista de sus respectivas categorías y luego pasarles el comando que deseas ejecutar.

## Lista de Argumentos

La lista de argumentos es la lista más básica. Crea una lista de archivos. Para crear una lista de file1, file2 y file3, puedes ejecutar:

```shell
:args file1 file2 file3
```

También puedes pasarle un comodín (`*`), así que si deseas hacer una lista de todos los archivos `.js` en el directorio actual, ejecuta:

```shell
:args *.js
```

Si deseas hacer una lista de todos los archivos Javascript que comienzan con "a" en el directorio actual, ejecuta:

```shell
:args a*.js
```

El comodín coincide con uno o más caracteres de nombre de archivo en el directorio actual, pero ¿qué pasa si necesitas buscar recursivamente en cualquier directorio? Puedes usar el doble comodín (`**`). Para obtener todos los archivos Javascript dentro de los directorios en tu ubicación actual, ejecuta:

```shell
:args **/*.js
```

Una vez que ejecutas el comando `args`, tu buffer actual se cambiará al primer elemento de la lista. Para ver la lista de archivos que acabas de crear, ejecuta `:args`. Una vez que hayas creado tu lista, puedes recorrerla. `:first` te llevará al primer elemento de la lista. `:last` te llevará al último de la lista. Para mover la lista hacia adelante un archivo a la vez, ejecuta `:next`. Para mover la lista hacia atrás un archivo a la vez, ejecuta `:prev`. Para avanzar / retroceder un archivo a la vez y guardar los cambios, ejecuta `:wnext` y `:wprev`. Hay muchos más comandos de navegación. Consulta `:h arglist` para más.

La lista de argumentos es útil si necesitas dirigirte a un tipo específico de archivo o a unos pocos archivos. Tal vez necesites actualizar todos los "donut" a "pancake" dentro de todos los archivos `yml`, puedes hacer:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

Si ejecutas el comando `args` nuevamente, reemplazará la lista anterior. Por ejemplo, si previamente ejecutaste:

```shell
:args file1 file2 file3
```

Suponiendo que estos archivos existan, ahora tienes una lista de `file1`, `file2` y `file3`. Luego ejecutas esto:

```shell
:args file4 file5
```

Tu lista inicial de `file1`, `file2` y `file3` es reemplazada por `file4` y `file5`. Si tienes `file1`, `file2` y `file3` en tu lista de argumentos y deseas *agregar* `file4` y `file5` a tu lista inicial de archivos, usa el comando `:arga`. Ejecuta:

```shell
:arga file4 file5
```

Ahora tienes `file1`, `file2`, `file3`, `file4` y `file5` en tu lista de argumentos.

Si ejecutas `:arga` sin ningún argumento, Vim añadirá tu buffer actual a la lista de argumentos actual. Si ya tienes `file1`, `file2` y `file3` en tu lista de argumentos y tu buffer actual está en `file5`, al ejecutar `:arga` se añadirá `file5` a la lista.

Una vez que tengas la lista, puedes pasarla con cualquier comando de línea de comandos de tu elección. Has visto que se hace con sustitución (`:argdo %s/donut/pancake/g`). Algunos otros ejemplos:
- Para eliminar todas las líneas que contienen "dessert" en la lista de argumentos, ejecuta `:argdo g/dessert/d`.
- Para ejecutar la macro a (suponiendo que has grabado algo en la macro a) en la lista de argumentos, ejecuta `:argdo norm @a`.
- Para escribir "hello " seguido del nombre del archivo en la primera línea, ejecuta `:argdo 0put='hello ' .. @:`.

Una vez que hayas terminado, no olvides guardarlos con `:update`.

A veces necesitas ejecutar los comandos solo en los primeros n elementos de la lista de argumentos. Si ese es el caso, simplemente pasa a la comando `argdo` una dirección. Por ejemplo, para ejecutar el comando de sustitución solo en los primeros 3 elementos de la lista, ejecuta `:1,3argdo %s/donut/pancake/g`.

## Lista de Buffers

La lista de buffers se creará orgánicamente cuando edites nuevos archivos porque cada vez que creas un nuevo archivo / abres un archivo, Vim lo guarda en un buffer (a menos que lo elimines explícitamente). Así que si ya abriste 3 archivos: `file1.rb file2.rb file3.rb`, ya tienes 3 elementos en tu lista de buffers. Para mostrar la lista de buffers, ejecuta `:buffers` (alternativamente: `:ls` o `:files`). Para recorrer hacia adelante y hacia atrás, usa `:bnext` y `:bprev`. Para ir al primer y último buffer de la lista, usa `:bfirst` y `:blast` (¿te estás divirtiendo? :D).

Por cierto, aquí hay un truco genial de buffers no relacionado con este capítulo: si tienes un número de elementos en tu lista de buffers, puedes mostrar todos ellos con `:ball` (buffer all). El comando `ball` muestra todos los buffers horizontalmente. Para mostrarlos verticalmente, ejecuta `:vertical ball`.

Volviendo al tema, la mecánica para ejecutar operaciones en todos los buffers es similar a la lista de argumentos. Una vez que hayas creado tu lista de buffers, solo necesitas anteponer el/los comando(s) que deseas ejecutar con `:bufdo` en lugar de `:argdo`. Así que si deseas sustituir todos los "donut" por "pancake" en todos los buffers y luego guardar los cambios, ejecuta `:bufdo %s/donut/pancake/g | update`.

## Lista de Ventanas y Pestañas

La lista de ventanas y pestañas también es similar a la lista de argumentos y buffers. Las únicas diferencias son su contexto y sintaxis.

Las operaciones de ventana se realizan en cada ventana abierta y se realizan con `:windo`. Las operaciones de pestaña se realizan en cada pestaña que has abierto y se realizan con `:tabdo`. Para más, consulta `:h list-repeat`, `:h :windo` y `:h :tabdo`.

Por ejemplo, si tienes tres ventanas abiertas (puedes abrir nuevas ventanas con `Ctrl-W v` para una ventana vertical y `Ctrl-W s` para una ventana horizontal) y ejecutas `:windo 0put ='hello' . @%`, Vim mostrará "hello" + nombre de archivo en todas las ventanas abiertas.

## Lista de Quickfix

En los capítulos anteriores (Ch3 y Ch19), he hablado sobre quickfixes. Quickfix tiene muchos usos. Muchos plugins populares utilizan quickfixes, así que es bueno dedicar más tiempo a entenderlos.

Si eres nuevo en Vim, quickfix puede ser un concepto nuevo. En los viejos tiempos, cuando realmente tenías que compilar tu código explícitamente, durante la fase de compilación te encontrarías con errores. Para mostrar estos errores, necesitas una ventana especial. Ahí es donde entra quickfix. Cuando compilas tu código, Vim muestra mensajes de error en la ventana de quickfix para que puedas corregirlos más tarde. Muchos lenguajes modernos ya no requieren una compilación explícita, pero eso no hace que quickfix sea obsoleto. Hoy en día, la gente usa quickfix para todo tipo de cosas, como mostrar la salida de un terminal virtual y almacenar resultados de búsqueda. Centrémonos en este último, almacenar resultados de búsqueda.

Además de los comandos de compilación, ciertos comandos de Vim dependen de las interfaces de quickfix. Un tipo de comando que utiliza mucho quickfixes son los comandos de búsqueda. Tanto `:vimgrep` como `:grep` utilizan quickfixes por defecto.

Por ejemplo, si necesitas buscar "donut" en todos los archivos Javascript recursivamente, puedes ejecutar:

```shell
:vimgrep /donut/ **/*.js
```

El resultado de la búsqueda de "donut" se almacena en la ventana de quickfix. Para ver los resultados de coincidencia en la ventana de quickfix, ejecuta:

```shell
:copen
```

Para cerrarla, ejecuta:

```shell
:cclose
```

Para recorrer la lista de quickfix hacia adelante y hacia atrás, ejecuta:

```shell
:cnext
:cprev
```

Para ir al primer y último elemento en la coincidencia, ejecuta:

```shell
:cfirst
:clast
```

Antes mencioné que había dos comandos de quickfix: `cdo` y `cfdo`. ¿Cómo se diferencian? `cdo` ejecuta el comando para cada elemento en la lista de quickfix, mientras que `cfdo` ejecuta el comando para cada *archivo* en la lista de quickfix.

Déjame aclarar. Supongamos que después de ejecutar el comando `vimgrep` anterior, encontraste:
- 1 resultado en `file1.js`
- 10 resultados en `file2.js`

Si ejecutas `:cfdo %s/donut/pancake/g`, esto ejecutará efectivamente `%s/donut/pancake/g` una vez en `file1.js` y una vez en `file2.js`. Se ejecuta *tantas veces como archivos haya en la coincidencia.* Dado que hay dos archivos en los resultados, Vim ejecuta el comando de sustitución una vez en `file1.js` y una vez más en `file2.js`, a pesar de que hay 10 coincidencias en el segundo archivo. `cfdo` solo se preocupa por cuántos archivos hay en la lista de quickfix.

Si ejecutas `:cdo %s/donut/pancake/g`, esto ejecutará efectivamente `%s/donut/pancake/g` una vez en `file1.js` y *diez veces* en `file2.js`. Se ejecuta tantas veces como elementos haya en la lista de quickfix. Dado que solo hay una coincidencia encontrada en `file1.js` y 10 coincidencias encontradas en `file2.js`, se ejecutará un total de 11 veces.

Dado que ejecutaste `%s/donut/pancake/g`, tendría sentido usar `cfdo`. No tendría sentido usar `cdo` porque ejecutaría `%s/donut/pancake/g` diez veces en `file2.js` (`%s` es una sustitución a nivel de archivo). Ejecutar `%s` una vez por archivo es suficiente. Si usaste `cdo`, tendría más sentido pasarlo con `s/donut/pancake/g` en su lugar.

Al decidir si usar `cfdo` o `cdo`, piensa en el alcance del comando que estás pasando. ¿Es este un comando a nivel de archivo (como `:%s` o `:g`) o es un comando a nivel de línea (como `:s` o `:!`)?

## Lista de Ubicación

La lista de ubicación es similar a la lista de quickfix en el sentido de que Vim también utiliza una ventana especial para mostrar mensajes. La diferencia entre una lista de quickfix y una lista de ubicación es que en cualquier momento, solo puedes tener una lista de quickfix, mientras que puedes tener tantas listas de ubicación como ventanas.

Supón que tienes dos ventanas abiertas, una ventana mostrando `food.txt` y otra mostrando `drinks.txt`. Desde dentro de `food.txt`, ejecutas un comando de búsqueda de lista de ubicación `:lvimgrep` (la variante de ubicación para el comando `:vimgrep`):

```shell
:lvim /bagel/ **/*.md
```

Vim creará una lista de ubicación de todas las coincidencias de búsqueda de bagel para esa ventana de `food.txt`. Puedes ver la lista de ubicación con `:lopen`. Ahora ve a la otra ventana `drinks.txt` y ejecuta:

```shell
:lvimgrep /milk/ **/*.md
```

Vim creará una *lista de ubicación separada* con todos los resultados de búsqueda de leche para esa ventana de `drinks.txt`.

Por cada comando de ubicación que ejecutas en cada ventana, Vim crea una lista de ubicación distinta. Si tienes 10 ventanas diferentes, puedes tener hasta 10 listas de ubicación diferentes. Contrasta esto con la lista de quickfix donde solo puedes tener una en cualquier momento. Si tienes 10 ventanas diferentes, aún obtienes solo una lista de quickfix.

La mayoría de los comandos de lista de ubicación son similares a los comandos de quickfix, excepto que están prefijados con `l-` en su lugar. Por ejemplo: `:lvimgrep`, `:lgrep` y `:lmake` vs `:vimgrep`, `:grep` y `:make`. Para manipular la ventana de la lista de ubicación, nuevamente, los comandos se ven similares a los comandos de quickfix `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext` y `:lprev` vs `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext` y `:cprev`.

Los dos comandos de múltiples archivos de la lista de ubicación también son similares a los comandos de múltiples archivos de quickfix: `:ldo` y `:lfdo`. `:ldo` ejecuta el comando de ubicación en cada lista de ubicación, mientras que `:lfdo` ejecuta el comando de la lista de ubicación para cada archivo en la lista de ubicación. Para más, consulta `:h location-list`.
## Ejecutando Operaciones en Múltiples Archivos en Vim

Saber cómo realizar una operación en múltiples archivos es una habilidad útil en la edición. Siempre que necesites cambiar el nombre de una variable en varios archivos, querrás ejecutarlos de una sola vez. Vim tiene ocho formas diferentes de hacer esto.

Hablando prácticamente, probablemente no usarás las ocho por igual. Te inclinarás hacia una o dos. Cuando estés comenzando, elige una (personalmente sugiero comenzar con la lista de argumentos `:argdo`) y domínala. Una vez que te sientas cómodo con una, aprende la siguiente. Descubrirás que aprender la segunda, tercera, cuarta se vuelve más fácil. Sé creativo. Úsalo con diferentes combinaciones. Sigue practicando hasta que puedas hacerlo sin esfuerzo y sin pensar mucho. Hazlo parte de tu memoria muscular.

Dicho esto, has dominado la edición en Vim. ¡Felicidades!