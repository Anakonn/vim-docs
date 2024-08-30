---
description: Este documento explora cómo integrar Vim y Git, centrándose en el uso
  de `vimdiff` para comparar y gestionar diferencias entre archivos.
title: Ch18. Git
---

Vim y git son dos grandes herramientas para dos cosas diferentes. Git es una herramienta de control de versiones. Vim es un editor de texto.

En este capítulo, aprenderás diferentes formas de integrar Vim y git juntos.

## Comparación

Recuerda que en el capítulo anterior, puedes ejecutar un comando `vimdiff` para mostrar las diferencias entre múltiples archivos.

Supón que tienes dos archivos, `file1.txt` y `file2.txt`.

Dentro de `file1.txt`:

```shell
pancakes
waffles
apples

milk
apple juice

yogurt
```

Dentro de `file2.txt`:

```shell
pancakes
waffles
oranges

milk
orange juice

yogurt
```

Para ver las diferencias entre ambos archivos, ejecuta:

```shell
vimdiff file1.txt file2.txt
```

Alternativamente, podrías ejecutar:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` muestra dos buffers uno al lado del otro. A la izquierda está `file1.txt` y a la derecha está `file2.txt`. Las primeras diferencias (manzanas y naranjas) están resaltadas en ambas líneas.

Supón que quieres que el segundo buffer tenga manzanas, no naranjas. Para transferir el contenido desde tu posición actual (actualmente estás en `file1.txt`) a `file2.txt`, primero ve a la siguiente diferencia con `]c` (para saltar a la ventana de diferencia anterior, usa `[c`). El cursor debería estar ahora sobre manzanas. Ejecuta `:diffput`. Ambos archivos deberían tener ahora manzanas.

Si necesitas transferir el texto del otro buffer (jugo de naranja, `file2.txt`) para reemplazar el texto en el buffer actual (jugo de manzana, `file1.txt`), con tu cursor aún en la ventana de `file1.txt`, primero ve a la siguiente diferencia con `]c`. Tu cursor ahora debería estar sobre jugo de manzana. Ejecuta `:diffget` para obtener el jugo de naranja de otro buffer y reemplazar el jugo de manzana en nuestro buffer.

`:diffput` *saca* el texto del buffer actual a otro buffer. `:diffget` *obtiene* el texto de otro buffer al buffer actual.

Si tienes múltiples buffers, puedes ejecutar `:diffput fileN.txt` y `:diffget fileN.txt` para dirigirte al buffer fileN.

## Vim Como Herramienta de Fusión

> "¡Me encanta resolver conflictos de fusión!" - Nadie

No conozco a nadie que le guste resolver conflictos de fusión. Sin embargo, son inevitables. En esta sección, aprenderás cómo aprovechar Vim como una herramienta de resolución de conflictos de fusión.

Primero, cambia la herramienta de fusión predeterminada para usar `vimdiff` ejecutando:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Alternativamente, puedes modificar directamente el `~/.gitconfig` (por defecto debería estar en root, pero el tuyo podría estar en un lugar diferente). Los comandos anteriores deberían modificar tu gitconfig para que se vea como la configuración a continuación, si no los has ejecutado ya, también puedes editar manualmente tu gitconfig.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Vamos a crear un conflicto de fusión falso para probar esto. Crea un directorio `/food` y hazlo un repositorio git:

```shell
git init
```

Agrega un archivo, `breakfast.txt`. Dentro:

```shell
pancakes
waffles
oranges
```

Agrega el archivo y haz un commit:

```shell
git add .
git commit -m "Commit inicial de desayuno"
```

A continuación, crea una nueva rama y llámala rama de manzanas:

```shell
git checkout -b apples
```

Cambia el `breakfast.txt`:

```shell
pancakes
waffles
apples
```

Guarda el archivo, luego agrega y haz commit del cambio:

```shell
git add .
git commit -m "Manzanas no naranjas"
```

Genial. Ahora tienes naranjas en la rama master y manzanas en la rama de manzanas. Volvamos a la rama master:

```shell
git checkout master
```

Dentro de `breakfast.txt`, deberías ver el texto base, naranjas. Cambiémoslo a uvas porque están de temporada ahora:

```shell
pancakes
waffles
grapes
```

Guarda, agrega y haz commit:

```shell
git add .
git commit -m "Uvas no naranjas"
```

Ahora estás listo para fusionar la rama de manzanas en la rama master:

```shell
git merge apples
```

Deberías ver un error:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Conflicto de fusión en breakfast.txt
La fusión automática falló; corrige los conflictos y luego haz commit del resultado.
```

¡Un conflicto, genial! Vamos a resolver el conflicto usando nuestra `mergetool` recién configurada. Ejecuta:

```shell
git mergetool
```

Vim muestra cuatro ventanas. Presta atención a las tres superiores:

- `LOCAL` contiene `grapes`. Este es el cambio en "local", lo que estás fusionando.
- `BASE` contiene `oranges`. Este es el ancestro común entre `LOCAL` y `REMOTE` para comparar cómo divergen.
- `REMOTE` contiene `apples`. Esto es lo que se está fusionando.

En la parte inferior (la cuarta ventana) ves:

```shell
pancakes
waffles
<<<<<<< HEAD
grapes
||||||| db63958
oranges
=======
apples
>>>>>>> apples
```

La cuarta ventana contiene los textos de conflicto de fusión. Con esta configuración, es más fácil ver qué cambio tiene cada entorno. Puedes ver el contenido de `LOCAL`, `BASE` y `REMOTE` al mismo tiempo.

Tu cursor debería estar en la cuarta ventana, en el área resaltada. Para obtener el cambio de `LOCAL` (uvas), ejecuta `:diffget LOCAL`. Para obtener el cambio de `BASE` (naranjas), ejecuta `:diffget BASE` y para obtener el cambio de `REMOTE` (manzanas), ejecuta `:diffget REMOTE`.

En este caso, vamos a obtener el cambio de `LOCAL`. Ejecuta `:diffget LOCAL`. La cuarta ventana ahora tendrá uvas. Guarda y sal de todos los archivos (`:wqall`) cuando hayas terminado. No estuvo mal, ¿verdad?

Si notas, ahora también tienes un archivo `breakfast.txt.orig`. Git crea un archivo de respaldo en caso de que las cosas no salgan bien. Si no deseas que git cree un respaldo durante una fusión, ejecuta:

```shell
git config --global mergetool.keepBackup false
```

## Git Dentro de Vim

Vim no tiene una función git nativa incorporada. Una forma de ejecutar comandos git desde Vim es usar el operador bang, `!`, en el modo de línea de comandos.

Cualquier comando git se puede ejecutar con `!`:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

También puedes usar las convenciones de Vim `%` (buffer actual) o `#` (otro buffer):

```shell
:!git add %         " git add archivo actual
:!git checkout #    " git checkout el otro archivo
```

Un truco de Vim que puedes usar para agregar múltiples archivos en diferentes ventanas de Vim es ejecutar:

```shell
:windo !git add %
```

Luego haz un commit:

```shell
:!git commit "Acabo de agregar todo en mi ventana de Vim, genial"
```

El comando `windo` es uno de los comandos "hacer" de Vim, similar a `argdo` que viste anteriormente. `windo` ejecuta el comando en cada ventana.

Alternativamente, también puedes usar `bufdo !git add %` para agregar todos los buffers o `argdo !git add %` para agregar todos los argumentos de archivo, dependiendo de tu flujo de trabajo.

## Plugins

Hay muchos plugins de Vim para soporte de git. A continuación se muestra una lista de algunos de los plugins relacionados con git más populares para Vim (probablemente haya más en el momento en que leas esto):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

Uno de los más populares es vim-fugitive. Para el resto del capítulo, revisaré varios flujos de trabajo de git usando este plugin.

## Vim-fugitive

El plugin vim-fugitive te permite ejecutar la CLI de git sin salir del editor Vim. Encontrarás que algunos comandos son mejores cuando se ejecutan desde dentro de Vim.

Para comenzar, instala vim-fugitive con un administrador de plugins de Vim ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim), etc).

## Estado de Git

Cuando ejecutas el comando `:Git` sin parámetros, vim-fugitive muestra una ventana de resumen de git. Muestra los archivos no rastreados, no preparados y preparados. Mientras estás en este modo "`git status`", puedes hacer varias cosas:
- `Ctrl-N` / `Ctrl-P` para subir o bajar en la lista de archivos.
- `-` para preparar o deshacer la preparación del nombre del archivo bajo el cursor.
- `s` para preparar el nombre del archivo bajo el cursor.
- `u` para deshacer la preparación del nombre del archivo bajo el cursor.
- `>` / `<` para mostrar u ocultar una diferencia en línea del nombre del archivo bajo el cursor.

Para más, consulta `:h fugitive-staging-maps`.

## Git Blame

Cuando ejecutas el comando `:Git blame` desde el archivo actual, vim-fugitive muestra una ventana de culpa dividida. Esto puede ser útil para encontrar a la persona responsable de escribir esa línea de código con errores para que puedas gritarle (es una broma).

Algunas cosas que puedes hacer mientras estás en este modo "git blame":
- `q` para cerrar la ventana de culpa.
- `A` para redimensionar la columna de autor.
- `C` para redimensionar la columna de commit.
- `D` para redimensionar la columna de fecha/hora.

Para más, consulta `:h :Git_blame`.

## Gdiffsplit

Cuando ejecutas el comando `:Gdiffsplit`, vim-fugitive ejecuta un `vimdiff` de los últimos cambios del archivo actual contra el índice o el árbol de trabajo. Si ejecutas `:Gdiffsplit <commit>`, vim-fugitive ejecuta un `vimdiff` contra ese archivo dentro de `<commit>`.

Debido a que estás en modo `vimdiff`, puedes *obtener* o *poner* la diferencia con `:diffput` y `:diffget`.

## Gwrite y Gread

Cuando ejecutas el comando `:Gwrite` en un archivo después de hacer cambios, vim-fugitive prepara los cambios. Es como ejecutar `git add <archivo-actual>`.

Cuando ejecutas el comando `:Gread` en un archivo después de hacer cambios, vim-fugitive restaura el archivo al estado anterior a los cambios. Es como ejecutar `git checkout <archivo-actual>`. Una ventaja de ejecutar `:Gread` es que la acción es deshacer. Si, después de ejecutar `:Gread`, cambias de opinión y quieres mantener el cambio antiguo, simplemente puedes ejecutar deshacer (`u`) y Vim deshará la acción `:Gread`. Esto no habría sido posible si hubieras ejecutado `git checkout <archivo-actual>` desde la CLI.

## Gclog

Cuando ejecutas el comando `:Gclog`, vim-fugitive muestra el historial de commits. Es como ejecutar el comando `git log`. Vim-fugitive utiliza el quickfix de Vim para lograr esto, por lo que puedes usar `:cnext` y `:cprevious` para navegar a la siguiente o anterior información de log. Puedes abrir y cerrar la lista de logs con `:copen` y `:cclose`.

Mientras estás en este modo "git log", puedes hacer dos cosas:
- Ver el árbol.
- Visitar el padre (el commit anterior).

Puedes pasar argumentos a `:Gclog` igual que al comando `git log`. Si tu proyecto tiene un largo historial de commits y solo necesitas ver los últimos tres commits, puedes ejecutar `:Gclog -3`. Si necesitas filtrarlo según la fecha del autor, puedes ejecutar algo como `:Gclog --after="1 de enero" --before="14 de marzo"`.

## Más Vim-fugitive

Estos son solo algunos ejemplos de lo que vim-fugitive puede hacer. Para aprender más sobre vim-fugitive, consulta `:h fugitive.txt`. La mayoría de los comandos git populares probablemente están optimizados con vim-fugitive. Solo tienes que buscarlos en la documentación.

Si estás dentro de uno de los "modos especiales" de vim-fugitive (por ejemplo, dentro del modo `:Git` o `:Git blame`) y quieres aprender qué atajos están disponibles, presiona `g?`. Vim-fugitive mostrará la ventana de `:help` apropiada para el modo en el que te encuentras. ¡Genial!
## Aprende Vim y Git de la Manera Inteligente

Puede que encuentres vim-fugitive como un buen complemento para tu flujo de trabajo (o no). Sin embargo, te animo encarecidamente a que revises todos los plugins listados arriba. Probablemente haya otros que no mencioné. ¡Ve a probarlos!

Una forma obvia de mejorar con la integración de Vim y git es leer más sobre git. Git, por sí solo, es un tema vasto y solo estoy mostrando una fracción de él. Con eso, ¡comencemos a *git* (perdona el juego de palabras) y hablemos sobre cómo usar Vim para compilar tu código!