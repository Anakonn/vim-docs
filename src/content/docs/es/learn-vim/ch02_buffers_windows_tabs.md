---
description: Este documento explica cómo funcionan los buffers, ventanas y pestañas
  en Vim, y cómo configurarlos para una experiencia de edición más fluida.
title: Ch02. Buffers, Windows, and Tabs
---

Si has utilizado un editor de texto moderno antes, probablemente estés familiarizado con ventanas y pestañas. Vim utiliza tres abstracciones de visualización en lugar de dos: buffers, ventanas y pestañas. En este capítulo, explicaré qué son los buffers, ventanas y pestañas y cómo funcionan en Vim.

Antes de comenzar, asegúrate de tener la opción `set hidden` en vimrc. Sin ella, cada vez que cambies de buffer y tu buffer actual no esté guardado, Vim te pedirá que guardes el archivo (no querrás eso si deseas moverte rápidamente). Aún no he cubierto vimrc. Si no tienes un vimrc, crea uno. Generalmente se coloca en tu directorio personal y se llama `.vimrc`. Yo tengo el mío en `~/.vimrc`. Para ver dónde deberías crear tu vimrc, consulta `:h vimrc`. Dentro de él, añade:

```shell
set hidden
```

Guárdalo, luego cárgalo (ejecuta `:source %` desde dentro del vimrc).

## Buffers

¿Qué es un *buffer*?

Un buffer es un espacio en memoria donde puedes escribir y editar texto. Cuando abres un archivo en Vim, los datos están vinculados a un buffer. Cuando abres 3 archivos en Vim, tienes 3 buffers.

Ten dos archivos vacíos, `file1.js` y `file2.js` disponibles (si es posible, créalos con Vim). Ejecuta esto en la terminal:

```bash
vim file1.js
```

Lo que estás viendo es el *buffer* de `file1.js`. Cada vez que abres un nuevo archivo, Vim crea un nuevo buffer.

Sal de Vim. Esta vez, abre dos nuevos archivos:

```bash
vim file1.js file2.js
```

Vim actualmente muestra el buffer de `file1.js`, pero en realidad crea dos buffers: el buffer de `file1.js` y el buffer de `file2.js`. Ejecuta `:buffers` para ver todos los buffers (alternativamente, también puedes usar `:ls` o `:files`). Deberías ver *ambos* listados: `file1.js` y `file2.js`. Ejecutar `vim file1 file2 file3 ... filen` crea n cantidad de buffers. Cada vez que abres un nuevo archivo, Vim crea un nuevo buffer para ese archivo.

Hay varias formas en las que puedes navegar entre buffers:
- `:bnext` para ir al siguiente buffer (`:bprevious` para ir al buffer anterior).
- `:buffer` + nombre de archivo. Vim puede autocompletar el nombre del archivo con `<Tab>`.
- `:buffer` + `n`, donde `n` es el número del buffer. Por ejemplo, al escribir `:buffer 2` irás al buffer #2.
- Salta a la posición anterior en la lista de saltos con `Ctrl-O` y a la posición más reciente con `Ctrl-I`. Estos no son métodos específicos de buffer, pero pueden usarse para saltar entre diferentes buffers. Explicaré los saltos con más detalle en el Capítulo 5.
- Ve al buffer editado anteriormente con `Ctrl-^`.

Una vez que Vim crea un buffer, permanecerá en tu lista de buffers. Para eliminarlo, puedes escribir `:bdelete`. También puede aceptar un número de buffer como parámetro (`:bdelete 3` para eliminar el buffer #3) o un nombre de archivo (`:bdelete` y luego usa `<Tab>` para autocompletar).

Lo más difícil para mí al aprender sobre buffers fue visualizar cómo funcionaban porque mi mente estaba acostumbrada a las ventanas de un editor de texto convencional. Una buena analogía es una baraja de cartas. Si tengo 2 buffers, tengo una pila de 2 cartas. La carta en la parte superior es la única carta que veo, pero sé que hay cartas debajo de ella. Si veo el buffer de `file1.js` mostrado, entonces la carta de `file1.js` está en la parte superior de la baraja. No puedo ver la otra carta, `file2.js`, aquí, pero está ahí. Si cambio de buffer a `file2.js`, esa carta de `file2.js` está ahora en la parte superior de la baraja y la carta de `file1.js` está debajo de ella.

Si no has usado Vim antes, este es un concepto nuevo. Tómate tu tiempo para entenderlo.

## Salir de Vim

Por cierto, si tienes múltiples buffers abiertos, puedes cerrarlos todos con salir-todos:

```shell
:qall
```

Si deseas cerrar sin guardar tus cambios, solo añade `!` al final:

```shell
:qall!
```

Para guardar y salir de todos, ejecuta:

```shell
:wqall
```

## Ventanas

Una ventana es un área de visualización de un buffer. Si vienes de un editor convencional, este concepto puede ser familiar para ti. La mayoría de los editores de texto tienen la capacidad de mostrar múltiples ventanas. En Vim, también puedes tener múltiples ventanas.

Abramos `file1.js` desde la terminal nuevamente:

```bash
vim file1.js
```

Antes escribí que estás viendo el buffer de `file1.js`. Aunque eso era correcto, esa afirmación estaba incompleta. Estás viendo el buffer de `file1.js`, mostrado a través de **una ventana**. Una ventana es cómo estás visualizando un buffer.

No salgas de Vim todavía. Ejecuta:

```shell
:split file2.js
```

Ahora estás viendo dos buffers a través de **dos ventanas**. La ventana superior muestra el buffer de `file2.js`. La ventana inferior muestra el buffer de `file1.js`.

Si deseas navegar entre ventanas, usa estos atajos:

```shell
Ctrl-W H    Mueve el cursor a la ventana izquierda
Ctrl-W J    Mueve el cursor a la ventana de abajo
Ctrl-W K    Mueve el cursor a la ventana de arriba
Ctrl-W L    Mueve el cursor a la ventana derecha
```

Ahora ejecuta:

```shell
:vsplit file3.js
```

Ahora estás viendo tres ventanas que muestran tres buffers. Una ventana muestra el buffer de `file3.js`, otra ventana muestra el buffer de `file2.js`, y otra ventana muestra el buffer de `file1.js`.

Puedes tener múltiples ventanas mostrando el mismo buffer. Mientras estás en la ventana superior izquierda, escribe:

```shell
:buffer file2.js
```

Ahora ambas ventanas están mostrando el buffer de `file2.js`. Si comienzas a escribir en una ventana de `file2.js`, verás que ambas ventanas que muestran buffers de `file2.js` se actualizan en tiempo real.

Para cerrar la ventana actual, puedes ejecutar `Ctrl-W C` o escribir `:quit`. Cuando cierras una ventana, el buffer seguirá ahí (ejecuta `:buffers` para confirmar esto).

Aquí hay algunos comandos útiles de ventana en modo normal:

```shell
Ctrl-W V    Abre un nuevo split vertical
Ctrl-W S    Abre un nuevo split horizontal
Ctrl-W C    Cierra una ventana
Ctrl-W O    Hace que la ventana actual sea la única en pantalla y cierra otras ventanas
```

Y aquí hay una lista de comandos útiles de línea de comandos para ventanas:

```shell
:vsplit filename    Divide la ventana verticalmente
:split filename     Divide la ventana horizontalmente
:new filename       Crea una nueva ventana
```

Tómate tu tiempo para entenderlos. Para más información, consulta `:h window`.

## Pestañas

Una pestaña es una colección de ventanas. Piensa en ello como un diseño para ventanas. En la mayoría de los editores de texto modernos (y navegadores de internet modernos), una pestaña significa un archivo / página abierta y cuando la cierras, ese archivo / página desaparece. En Vim, una pestaña no representa un archivo abierto. Cuando cierras una pestaña en Vim, no estás cerrando un archivo. Solo estás cerrando el diseño. Los archivos abiertos en ese diseño aún no están cerrados, siguen abiertos en sus buffers.

Veamos las pestañas de Vim en acción. Abre `file1.js`:

```bash
vim file1.js
```

Para abrir `file2.js` en una nueva pestaña:

```shell
:tabnew file2.js
```

También puedes dejar que Vim autocomplete el archivo que deseas abrir en una *nueva pestaña* presionando `<Tab>` (sin doble sentido).

A continuación, se muestra una lista de navegaciones útiles de pestañas:

```shell
:tabnew file.txt    Abre file.txt en una nueva pestaña
:tabclose           Cierra la pestaña actual
:tabnext            Ve a la siguiente pestaña
:tabprevious        Ve a la pestaña anterior
:tablast            Ve a la última pestaña
:tabfirst           Ve a la primera pestaña
```

También puedes ejecutar `gt` para ir a la siguiente página de pestañas (puedes ir a la pestaña anterior con `gT`). Puedes pasar un número como argumento a `gt`, donde el número es el número de la pestaña. Para ir a la tercera pestaña, haz `3gt`.

Una ventaja de tener múltiples pestañas es que puedes tener diferentes disposiciones de ventanas en diferentes pestañas. Tal vez quieras que tu primera pestaña tenga 3 ventanas verticales y la segunda pestaña tenga una disposición mixta de ventanas horizontales y verticales. ¡La pestaña es la herramienta perfecta para el trabajo!

Para iniciar Vim con múltiples pestañas, puedes hacer esto desde la terminal:

```bash
vim -p file1.js file2.js file3.js
```

## Moviéndose en 3D

Moverse entre ventanas es como viajar en dos dimensiones a lo largo del eje X-Y en coordenadas cartesianas. Puedes moverte a la ventana superior, derecha, inferior e izquierda con `Ctrl-W H/J/K/L`.

Moverse entre buffers es como viajar a lo largo del eje Z en coordenadas cartesianas. Imagina tus archivos de buffer alineándose a lo largo del eje Z. Puedes atravesar el eje Z un buffer a la vez con `:bnext` y `:bprevious`. Puedes saltar a cualquier coordenada en el eje Z con `:buffer filename/buffernumber`.

Puedes moverte en *espacio tridimensional* combinando movimientos de ventana y buffer. Puedes moverte a la ventana superior, derecha, inferior o izquierda (navegaciones en X-Y) con movimientos de ventana. Dado que cada ventana contiene buffers, puedes moverte hacia adelante y hacia atrás (navegaciones en Z) con movimientos de buffer.

## Usando Buffers, Ventanas y Pestañas de Manera Inteligente

Has aprendido qué son los buffers, ventanas y pestañas y cómo funcionan en Vim. Ahora que los entiendes mejor, puedes usarlos en tu propio flujo de trabajo.

Todos tienen un flujo de trabajo diferente, aquí está el mío como ejemplo:
- Primero, uso buffers para almacenar todos los archivos necesarios para la tarea actual. Vim puede manejar muchos buffers abiertos antes de comenzar a ralentizarse. Además, tener muchos buffers abiertos no abarrotará mi pantalla. Solo estoy viendo un buffer (suponiendo que solo tengo una ventana) en cualquier momento, lo que me permite concentrarme en una pantalla. Cuando necesito ir a algún lugar, puedo volar rápidamente a cualquier buffer abierto en cualquier momento.
- Uso múltiples ventanas para ver múltiples buffers a la vez, generalmente al comparar archivos, leer documentos o seguir un flujo de código. Intento mantener el número de ventanas abiertas en no más de tres porque mi pantalla se abarrotará (uso un portátil pequeño). Cuando he terminado, cierro cualquier ventana extra. Menos ventanas significan menos distracciones.
- En lugar de pestañas, uso ventanas de [tmux](https://github.com/tmux/tmux/wiki). Generalmente uso múltiples ventanas de tmux a la vez. Por ejemplo, una ventana de tmux para códigos del lado del cliente y otra para códigos del backend.

Mi flujo de trabajo puede verse diferente al tuyo según tu estilo de edición y eso está bien. Experimenta para descubrir tu propio flujo, adaptado a tu estilo de codificación.