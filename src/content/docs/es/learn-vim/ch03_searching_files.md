---
description: Este capítulo introduce cómo buscar rápidamente en Vim, mejorando tu
  productividad, tanto sin plugins como utilizando el plugin fzf.vim. ¡Comencemos!
title: Ch03. Searching Files
---

El objetivo de este capítulo es darte una introducción sobre cómo buscar rápidamente en Vim. Poder buscar rápidamente es una excelente manera de impulsar tu productividad en Vim. Cuando descubrí cómo buscar archivos rápidamente, hice el cambio para usar Vim a tiempo completo.

Este capítulo se divide en dos partes: cómo buscar sin plugins y cómo buscar con el plugin [fzf.vim](https://github.com/junegunn/fzf.vim). ¡Comencemos!

## Abrir y Editar Archivos

Para abrir un archivo en Vim, puedes usar `:edit`.

```shell
:edit file.txt
```

Si `file.txt` existe, se abre el buffer de `file.txt`. Si `file.txt` no existe, se crea un nuevo buffer para `file.txt`.

La autocompletación con `<Tab>` funciona con `:edit`. Por ejemplo, si tu archivo está dentro de un directorio de controlador de usuarios de [Rails](https://rubyonrails.org/) `./app/controllers/users_controllers.rb`, puedes usar `<Tab>` para expandir los términos rápidamente:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` acepta argumentos con comodines. `*` coincide con cualquier archivo en el directorio actual. Si solo estás buscando archivos con extensión `.yml` en el directorio actual:

```shell
:edit *.yml<Tab>
```

Vim te dará una lista de todos los archivos `.yml` en el directorio actual para elegir.

Puedes usar `**` para buscar recursivamente. Si deseas buscar todos los archivos `*.md` en tu proyecto, pero no estás seguro en qué directorios, puedes hacer esto:

```shell
:edit **/*.md<Tab>
```

`:edit` se puede usar para ejecutar `netrw`, el explorador de archivos integrado de Vim. Para hacerlo, da un argumento de directorio a `:edit` en lugar de un archivo:

```shell
:edit .
:edit test/unit/
```

## Buscar Archivos Con Find

Puedes encontrar archivos con `:find`. Por ejemplo:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

La autocompletación también funciona con `:find`:

```shell
:find p<Tab>                " para encontrar package.json
:find a<Tab>c<Tab>u<Tab>    " para encontrar app/controllers/users_controller.rb
```

Puede que notes que `:find` se parece a `:edit`. ¿Cuál es la diferencia?

## Find y Path

La diferencia es que `:find` encuentra archivos en `path`, `:edit` no. Aprendamos un poco sobre `path`. Una vez que aprendas a modificar tus rutas, `:find` puede convertirse en una herramienta de búsqueda poderosa. Para verificar cuáles son tus rutas, haz:

```shell
:set path?
```

Por defecto, probablemente se vean así:

```shell
path=.,/usr/include,,
```

- `.` significa buscar en el directorio del archivo actualmente abierto.
- `,` significa buscar en el directorio actual.
- `/usr/include` es el directorio típico para los archivos de encabezado de bibliotecas C.

Los dos primeros son importantes en nuestro contexto y el tercero se puede ignorar por ahora. La conclusión aquí es que puedes modificar tus propias rutas, donde Vim buscará archivos. Supongamos que esta es la estructura de tu proyecto:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Si deseas ir a `users_controller.rb` desde el directorio raíz, tienes que pasar por varios directorios (y presionar una cantidad considerable de tabulaciones). A menudo, al trabajar con un marco, pasas el 90% de tu tiempo en un directorio particular. En esta situación, solo te importa ir al directorio `controllers/` con la menor cantidad de pulsaciones de teclas. La configuración de `path` puede acortar ese viaje.

Necesitas agregar `app/controllers/` al `path` actual. Aquí te mostramos cómo hacerlo:

```shell
:set path+=app/controllers/
```

Ahora que tu ruta está actualizada, cuando escribas `:find u<Tab>`, Vim buscará dentro del directorio `app/controllers/` archivos que comiencen con "u".

Si tienes un directorio `controllers/` anidado, como `app/controllers/account/users_controller.rb`, Vim no encontrará `users_controllers`. En su lugar, necesitas agregar `:set path+=app/controllers/**` para que la autocompletación encuentre `users_controller.rb`. ¡Esto es genial! Ahora puedes encontrar el controlador de usuarios con 1 pulsación de tab en lugar de 3.

Podrías estar pensando en agregar todos los directorios del proyecto para que cuando presiones `tab`, Vim busque en todas partes ese archivo, así:

```shell
:set path+=$PWD/**
```

`$PWD` es el directorio de trabajo actual. Si intentas agregar todo tu proyecto a `path` con la esperanza de hacer que todos los archivos sean accesibles al presionar `tab`, aunque esto puede funcionar para un proyecto pequeño, hacerlo ralentizará significativamente tu búsqueda si tienes una gran cantidad de archivos en tu proyecto. Recomiendo agregar solo la `path` de tus archivos / directorios más visitados.

Puedes agregar `set path+={tu-ruta-aquí}` en tu vimrc. Actualizar `path` toma solo unos segundos y hacerlo puede ahorrarte mucho tiempo.

## Buscar en Archivos Con Grep

Si necesitas buscar en archivos (encontrar frases en archivos), puedes usar grep. Vim tiene dos formas de hacerlo:

- Grep interno (`:vim`. Sí, se escribe `:vim`. Es una abreviatura de `:vimgrep`).
- Grep externo (`:grep`).

Vamos a ver primero el grep interno. `:vim` tiene la siguiente sintaxis:

```shell
:vim /pattern/ file
```

- `/pattern/` es un patrón regex de tu término de búsqueda.
- `file` es el argumento del archivo. Puedes pasar múltiples argumentos. Vim buscará el patrón dentro del argumento del archivo. Similar a `:find`, puedes pasarle comodines `*` y `**`.

Por ejemplo, para buscar todas las ocurrencias de la cadena "breakfast" dentro de todos los archivos ruby (`.rb`) dentro del directorio `app/controllers/`:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Después de ejecutar eso, serás redirigido al primer resultado. El comando de búsqueda `vim` de Vim utiliza la operación `quickfix`. Para ver todos los resultados de búsqueda, ejecuta `:copen`. Esto abre una ventana de `quickfix`. Aquí hay algunos comandos útiles de quickfix para que te pongas productivo de inmediato:

```shell
:copen        Abre la ventana de quickfix
:cclose       Cierra la ventana de quickfix
:cnext        Ve al siguiente error
:cprevious    Ve al error anterior
:colder       Ve a la lista de errores más antigua
:cnewer       Ve a la lista de errores más reciente
```

Para aprender más sobre quickfix, consulta `:h quickfix`.

Puede que notes que ejecutar grep interno (`:vim`) puede volverse lento si tienes una gran cantidad de coincidencias. Esto se debe a que Vim carga cada archivo coincidente en la memoria, como si se estuviera editando. Si Vim encuentra una gran cantidad de archivos que coinciden con tu búsqueda, los cargará todos y, por lo tanto, consumirá una gran cantidad de memoria.

Hablemos sobre grep externo. Por defecto, utiliza el comando de terminal `grep`. Para buscar "lunch" dentro de un archivo ruby dentro del directorio `app/controllers/`, puedes hacer esto:

```shell
:grep -R "lunch" app/controllers/
```

Ten en cuenta que en lugar de usar `/pattern/`, sigue la sintaxis de grep de terminal `"pattern"`. También muestra todas las coincidencias usando `quickfix`.

Vim define la variable `grepprg` para determinar qué programa externo ejecutar al ejecutar el comando `:grep` de Vim, para que no tengas que cerrar Vim e invocar el comando de terminal `grep`. Más adelante, te mostraré cómo cambiar el programa predeterminado invocado al usar el comando `:grep` de Vim.

## Navegar Archivos Con Netrw

`netrw` es el explorador de archivos integrado de Vim. Es útil para ver la jerarquía de un proyecto. Para ejecutar `netrw`, necesitas estas dos configuraciones en tu `.vimrc`:

```shell
set nocp
filetype plugin on
```

Dado que `netrw` es un tema amplio, solo cubriré el uso básico, pero debería ser suficiente para que comiences. Puedes iniciar `netrw` cuando inicias Vim pasando un directorio como parámetro en lugar de un archivo. Por ejemplo:

```shell
vim .
vim src/client/
vim app/controllers/
```

Para lanzar `netrw` desde dentro de Vim, puedes usar el comando `:edit` y pasarle un parámetro de directorio en lugar de un nombre de archivo:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Hay otras formas de lanzar la ventana de `netrw` sin pasar un directorio:

```shell
:Explore     Inicia netrw en el archivo actual
:Sexplore    Sin bromas. Inicia netrw en la mitad superior de la pantalla
:Vexplore    Inicia netrw en la mitad izquierda de la pantalla
```

Puedes navegar por `netrw` con los movimientos de Vim (los movimientos se cubrirán en profundidad en un capítulo posterior). Si necesitas crear, eliminar o renombrar un archivo o directorio, aquí hay una lista de comandos útiles de `netrw`:

```shell
%    Crear un nuevo archivo
d    Crear un nuevo directorio
R    Renombrar un archivo o directorio
D    Eliminar un archivo o directorio
```

`:h netrw` es muy completo. Échale un vistazo si tienes tiempo.

Si encuentras que `netrw` es demasiado soso y necesitas más sabor, [vim-vinegar](https://github.com/tpope/vim-vinegar) es un buen plugin para mejorar `netrw`. Si buscas un explorador de archivos diferente, [NERDTree](https://github.com/preservim/nerdtree) es una buena alternativa. ¡Échales un vistazo!

## Fzf

Ahora que has aprendido cómo buscar archivos en Vim con herramientas integradas, aprendamos cómo hacerlo con plugins.

Una cosa que los editores de texto modernos hacen bien y que Vim no hizo es lo fácil que es encontrar archivos, especialmente a través de búsqueda difusa. En esta segunda mitad del capítulo, te mostraré cómo usar [fzf.vim](https://github.com/junegunn/fzf.vim) para hacer que buscar en Vim sea fácil y poderoso.

## Configuración

Primero, asegúrate de tener [fzf](https://github.com/junegunn/fzf) y [ripgrep](https://github.com/BurntSushi/ripgrep) descargados. Sigue las instrucciones en su repositorio de github. Los comandos `fzf` y `rg` deberían estar disponibles ahora después de las instalaciones exitosas.

Ripgrep es una herramienta de búsqueda muy parecida a grep (de ahí el nombre). Generalmente es más rápida que grep y tiene muchas características útiles. Fzf es un buscador difuso de línea de comandos de propósito general. Puedes usarlo con cualquier comando, incluido ripgrep. Juntos, forman una poderosa combinación de herramientas de búsqueda.

Fzf no utiliza ripgrep por defecto, así que necesitamos decirle a fzf que use ripgrep definiendo una variable `FZF_DEFAULT_COMMAND`. En mi `.zshrc` (`.bashrc` si usas bash), tengo estas líneas:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Presta atención a `-m` en `FZF_DEFAULT_OPTS`. Esta opción nos permite hacer selecciones múltiples con `<Tab>` o `<Shift-Tab>`. No necesitas esta línea para que fzf funcione con Vim, pero creo que es una opción útil de tener. Será útil cuando desees realizar búsqueda y reemplazo en múltiples archivos, que cubriré en un momento. El comando fzf acepta muchas más opciones, pero no las cubriré aquí. Para aprender más, consulta el [repositorio de fzf](https://github.com/junegunn/fzf#usage) o `man fzf`. Como mínimo, deberías tener `export FZF_DEFAULT_COMMAND='rg'`.

Después de instalar fzf y ripgrep, configuremos el plugin fzf. Estoy usando el administrador de plugins [vim-plug](https://github.com/junegunn/vim-plug) en este ejemplo, pero puedes usar cualquier administrador de plugins.

Agrega estas líneas dentro de tus plugins en `.vimrc`. Necesitas usar el plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (creado por el mismo autor de fzf).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Después de agregar estas líneas, necesitarás abrir `vim` y ejecutar `:PlugInstall`. Esto instalará todos los plugins que están definidos en tu archivo `vimrc` y que no están instalados. En nuestro caso, instalará `fzf.vim` y `fzf`.

Para más información sobre este plugin, puedes consultar el [repositorio de fzf.vim](https://github.com/junegunn/fzf/blob/master/README-VIM.md).
## Sintaxis de Fzf

Para usar fzf de manera eficiente, debes aprender algunas sintaxis básicas de fzf. Afortunadamente, la lista es corta:

- `^` es una coincidencia exacta de prefijo. Para buscar una frase que comience con "bienvenido": `^bienvenido`.
- `$` es una coincidencia exacta de sufijo. Para buscar una frase que termine con "mis amigos": `amigos$`.
- `'` es una coincidencia exacta. Para buscar la frase "bienvenido mis amigos": `'bienvenido mis amigos`.
- `|` es una coincidencia "o". Para buscar "amigos" o "enemigos": `amigos | enemigos`.
- `!` es una coincidencia inversa. Para buscar una frase que contenga "bienvenido" y no "amigos": `bienvenido !amigos`

Puedes mezclar y combinar estas opciones. Por ejemplo, `^hola | ^bienvenido amigos$` buscará la frase que comience con "bienvenido" o "hola" y termine con "amigos".

## Encontrar Archivos

Para buscar archivos dentro de Vim usando el plugin fzf.vim, puedes usar el método `:Files`. Ejecuta `:Files` desde Vim y se te presentará el aviso de búsqueda de fzf.

Dado que usarás este comando con frecuencia, es bueno tenerlo asignado a un atajo de teclado. Yo lo asigno a `Ctrl-f`. En mi vimrc, tengo esto:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Buscar en Archivos

Para buscar dentro de archivos, puedes usar el comando `:Rg`.

Nuevamente, dado que probablemente usarás esto con frecuencia, vamos a asignarlo a un atajo de teclado. Yo lo asigno a `<Leader>f`. La tecla `<Leader>` está asignada a `\` por defecto.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Otras Búsquedas

Fzf.vim proporciona muchos otros comandos de búsqueda. No voy a repasar cada uno de ellos aquí, pero puedes consultarlos [aquí](https://github.com/junegunn/fzf.vim#commands).

Así es como se ven mis asignaciones de fzf:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Reemplazar Grep con Rg

Como se mencionó anteriormente, Vim tiene dos formas de buscar en archivos: `:vim` y `:grep`. `:grep` utiliza una herramienta de búsqueda externa que puedes reasignar usando la palabra clave `grepprg`. Te mostraré cómo configurar Vim para usar ripgrep en lugar de grep de terminal al ejecutar el comando `:grep`.

Ahora configuramos `grepprg` para que el comando `:grep` de Vim use ripgrep. Agrega esto en tu vimrc:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

¡Siéntete libre de modificar algunas de las opciones anteriores! Para más información sobre lo que significan las opciones anteriores, consulta `man rg`.

Después de actualizar `grepprg`, ahora cuando ejecutes `:grep`, se ejecutará `rg --vimgrep --smart-case --follow` en lugar de `grep`. Si deseas buscar "donut" usando ripgrep, ahora puedes ejecutar un comando más sucinto `:grep "donut"` en lugar de `:grep "donut" . -R`.

Al igual que el antiguo `:grep`, este nuevo `:grep` también utiliza quickfix para mostrar resultados.

Puedes preguntarte: "Bueno, esto es agradable, pero nunca usé `:grep` en Vim, además, ¿no puedo simplemente usar `:Rg` para encontrar frases en archivos? ¿Cuándo necesitaré usar `:grep`?"

Esa es una muy buena pregunta. Puede que necesites usar `:grep` en Vim para hacer búsqueda y reemplazo en múltiples archivos, lo cual cubriré a continuación.

## Buscar y Reemplazar en Múltiples Archivos

Los editores de texto modernos como VSCode facilitan mucho la búsqueda y reemplazo de una cadena en múltiples archivos. En esta sección, te mostraré dos métodos diferentes para hacerlo fácilmente en Vim.

El primer método es reemplazar *todas* las frases coincidentes en tu proyecto. Necesitarás usar `:grep`. Si deseas reemplazar todas las instancias de "pizza" con "donut", esto es lo que debes hacer:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Desglosemos los comandos:

1. `:grep pizza` utiliza ripgrep para buscar todas las instancias de "pizza" (por cierto, esto seguiría funcionando incluso si no reasignaras `grepprg` para usar ripgrep. Tendrías que hacer `:grep "pizza" . -R` en lugar de `:grep "pizza"`).
2. `:cfdo` ejecuta cualquier comando que le pases a todos los archivos en tu lista de quickfix. En este caso, tu comando es el comando de sustitución `%s/pizza/donut/g`. La tubería (`|`) es un operador de cadena. El comando `update` guarda cada archivo después de la sustitución. Cubriré el comando de sustitución en más profundidad en un capítulo posterior.

El segundo método es buscar y reemplazar en archivos seleccionados. Con este método, puedes elegir manualmente qué archivos deseas modificar. Esto es lo que debes hacer:

1. Limpia tus buffers primero. Es imperativo que tu lista de buffers contenga solo los archivos en los que deseas aplicar el reemplazo. Puedes reiniciar Vim o ejecutar el comando `:%bd | e#` (`%bd` elimina todos los buffers y `e#` abre el archivo en el que estabas).
2. Ejecuta `:Files`.
3. Selecciona todos los archivos en los que deseas realizar la búsqueda y reemplazo. Para seleccionar múltiples archivos, usa `<Tab>` / `<Shift-Tab>`. Esto solo es posible si tienes la bandera múltiple (`-m`) en `FZF_DEFAULT_OPTS`.
4. Ejecuta `:bufdo %s/pizza/donut/g | update`. El comando `:bufdo %s/pizza/donut/g | update` se parece al anterior `:cfdo %s/pizza/donut/g | update`. La diferencia es que en lugar de sustituir todas las entradas de quickfix (`:cfdo`), estás sustituyendo todas las entradas de buffer (`:bufdo`).

## Aprende a Buscar de la Manera Inteligente

Buscar es el pan y la mantequilla de la edición de texto. Aprender a buscar bien en Vim mejorará significativamente tu flujo de trabajo de edición de texto.

Fzf.vim es un cambio de juego. No puedo imaginar usar Vim sin él. Creo que es muy importante tener una buena herramienta de búsqueda al comenzar con Vim. He visto a personas luchar para hacer la transición a Vim porque parece carecer de características críticas que tienen los editores de texto modernos, como una función de búsqueda fácil y poderosa. Espero que este capítulo te ayude a hacer la transición a Vim más fácil.

También acabas de ver la extensibilidad de Vim en acción: la capacidad de extender la funcionalidad de búsqueda con un plugin y un programa externo. En el futuro, ten en cuenta qué otras características deseas extender en Vim. Es probable que ya esté en Vim, alguien haya creado un plugin o ya exista un programa para ello. A continuación, aprenderás sobre un tema muy importante en Vim: la gramática de Vim.