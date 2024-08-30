---
description: En este capítulo, aprenderás a organizar y configurar tu archivo vimrc,
  así como los diferentes lugares donde Vim busca este archivo de configuración.
title: Ch22. Vimrc
---

En los capítulos anteriores, aprendiste cómo usar Vim. En este capítulo, aprenderás cómo organizar y configurar vimrc.

## Cómo Vim Encuentra Vimrc

La sabiduría convencional para vimrc es agregar un archivo oculto `.vimrc` en el directorio de inicio `~/.vimrc` (puede ser diferente dependiendo de tu sistema operativo).

Detrás de escena, Vim busca en múltiples lugares un archivo vimrc. Aquí están los lugares que Vim verifica:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Cuando inicias Vim, verificará las seis ubicaciones anteriores en ese orden para un archivo vimrc. El primer archivo vimrc encontrado será utilizado y el resto será ignorado.

Primero, Vim buscará un `$VIMINIT`. Si no hay nada allí, Vim verificará `$HOME/.vimrc`. Si no hay nada allí, Vim verificará `$HOME/.vim/vimrc`. Si Vim lo encuentra, dejará de buscar y usará `$HOME/.vim/vimrc`.

La primera ubicación, `$VIMINIT`, es una variable de entorno. Por defecto, está indefinida. Si deseas usar `~/dotfiles/testvimrc` como tu valor de `$VIMINIT`, puedes crear una variable de entorno que contenga la ruta de ese vimrc. Después de ejecutar `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`, Vim ahora usará `~/dotfiles/testvimrc` como tu archivo vimrc.

La segunda ubicación, `$HOME/.vimrc`, es la ruta convencional para muchos usuarios de Vim. `$HOME` en muchos casos es tu directorio de inicio (`~`). Si tienes un archivo `~/.vimrc`, Vim lo usará como tu archivo vimrc.

La tercera, `$HOME/.vim/vimrc`, se encuentra dentro del directorio `~/.vim`. Es posible que ya tengas el directorio `~/.vim` para tus plugins, scripts personalizados o archivos de vista. Ten en cuenta que no hay un punto en el nombre del archivo vimrc (`$HOME/.vim/.vimrc` no funcionará, pero `$HOME/.vim/vimrc` sí).

La cuarta, `$EXINIT`, funciona de manera similar a `$VIMINIT`.

La quinta, `$HOME/.exrc`, funciona de manera similar a `$HOME/.vimrc`.

La sexta, `$VIMRUNTIME/defaults.vim`, es el vimrc predeterminado que viene con tu compilación de Vim. En mi caso, tengo Vim 8.2 instalado usando Homebrew, así que mi ruta es (`/usr/local/share/vim/vim82`). Si Vim no encuentra ninguno de los seis archivos vimrc anteriores, usará este archivo.

Para el resto de este capítulo, asumo que el vimrc utiliza la ruta `~/.vimrc`.

## ¿Qué Poner en Mi Vimrc?

Una pregunta que hice cuando empecé fue: "¿Qué debería poner en mi vimrc?"

La respuesta es: "cualquier cosa que desees". La tentación de copiar y pegar el vimrc de otras personas es real, pero debes resistirla. Si insistes en usar el vimrc de alguien más, asegúrate de saber qué hace, por qué y cómo lo usa, y lo más importante, si es relevante para ti. Solo porque alguien lo use no significa que tú también lo harás.

## Contenido Básico de Vimrc

En resumen, un vimrc es una colección de:
- Plugins
- Configuraciones
- Funciones Personalizadas
- Comandos Personalizados
- Mapeos

Hay otras cosas no mencionadas anteriormente, pero en general, esto cubre la mayoría de los casos de uso.

### Plugins

En los capítulos anteriores, he mencionado diferentes plugins, como [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo) y [vim-fugitive](https://github.com/tpope/vim-fugitive).

Hace diez años, gestionar plugins era una pesadilla. Sin embargo, con el auge de los modernos gestores de plugins, instalar plugins ahora se puede hacer en segundos. Actualmente estoy usando [vim-plug](https://github.com/junegunn/vim-plug) como mi gestor de plugins, así que lo usaré en esta sección. El concepto debería ser similar con otros gestores de plugins populares. Te recomendaría encarecidamente que revises diferentes opciones, como:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Hay más gestores de plugins que los listados anteriormente, siéntete libre de investigar. Para instalar vim-plug, si tienes una máquina Unix, ejecuta:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Para agregar nuevos plugins, coloca los nombres de tus plugins (`Plug 'github-username/repository-name'`) entre las líneas `call plug#begin()` y `call plug#end()`. Así que si deseas instalar `emmet-vim` y `nerdtree`, coloca el siguiente fragmento en tu vimrc:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Guarda los cambios, cárgalo (`:source %`), y ejecuta `:PlugInstall` para instalarlos.

En el futuro, si necesitas eliminar plugins no utilizados, solo necesitas eliminar los nombres de los plugins del bloque `call`, guardar y cargar, y ejecutar el comando `:PlugClean` para eliminarlos de tu máquina.

Vim 8 tiene sus propios gestores de paquetes integrados. Puedes consultar `:h packages` para más información. En el próximo capítulo, te mostraré cómo usarlo.

### Configuraciones

Es común ver muchas opciones `set` en cualquier vimrc. Si ejecutas el comando set desde el modo de línea de comandos, no es permanente. Lo perderás cuando cierres Vim. Por ejemplo, en lugar de ejecutar `:set relativenumber number` desde el modo de línea de comandos cada vez que inicias Vim, podrías simplemente poner esto dentro del vimrc:

```shell
set relativenumber number
```

Algunas configuraciones requieren que le pases un valor, como `set tabstop=2`. Consulta la página de ayuda para cada configuración para aprender qué tipo de valores acepta.

También puedes usar `let` en lugar de `set` (asegúrate de anteponerlo con `&`). Con `let`, puedes usar una expresión como valor. Por ejemplo, para establecer la opción `'dictionary'` a una ruta solo si la ruta existe:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Aprenderás sobre asignaciones y condicionales de Vimscript en capítulos posteriores.

Para una lista de todas las opciones posibles en Vim, consulta `:h E355`.

### Funciones Personalizadas

Vimrc es un buen lugar para funciones personalizadas. Aprenderás cómo escribir tus propias funciones de Vimscript en un capítulo posterior.

### Comandos Personalizados

Puedes crear un comando de línea de comandos personalizado con `command`.

Para crear un comando básico `GimmeDate` para mostrar la fecha de hoy:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Cuando ejecutas `:GimmeDate`, Vim mostrará una fecha como "2021-01-1".

Para crear un comando básico con una entrada, puedes usar `<args>`. Si deseas pasar a `GimmeDate` un formato de tiempo/fecha específico:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Si deseas restringir el número de argumentos, puedes pasarle la bandera `-nargs`. Usa `-nargs=0` para no pasar ningún argumento, `-nargs=1` para pasar un argumento, `-nargs=+` para pasar al menos un argumento, `-nargs=*` para pasar cualquier número de argumentos, y `-nargs=?` para pasar 0 o un argumento. Si deseas pasar el enésimo argumento, usa `-nargs=n` (donde `n` es cualquier entero).

`<args>` tiene dos variantes: `<f-args>` y `<q-args>`. La primera se usa para pasar argumentos a funciones de Vimscript. La segunda se usa para convertir automáticamente la entrada del usuario a cadenas.

Usando `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" devuelve 'Hello Iggy'

:Hello Iggy
" Error de variable indefinida
```

Usando `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" devuelve 'Hello Iggy'
```

Usando `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" devuelve "Hello Iggy1 and Iggy2"
```

Las funciones anteriores tendrán mucho más sentido una vez que llegues al capítulo de funciones de Vimscript.

Para aprender más sobre comandos y args, consulta `:h command` y `:args`.
### Mapas

Si te encuentras realizando repetidamente la misma tarea compleja, es un buen indicador de que deberías crear un mapeo para esa tarea.

Por ejemplo, tengo estos dos mapeos en mi vimrc:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

En el primero, mapeo `Ctrl-F` al comando `:Gfiles` del plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (busca rápidamente archivos de Git). En el segundo, mapeo `<Leader>tn` para llamar a una función personalizada `ToggleNumber` (cambia entre las opciones `norelativenumber` y `relativenumber`). El mapeo `Ctrl-F` sobrescribe el desplazamiento de página nativo de Vim. Tu mapeo sobrescribirá los controles de Vim si colisionan. Como casi nunca usé esa función, decidí que era seguro sobrescribirla.

Por cierto, ¿qué es esta tecla "líder" en `<Leader>tn`?

Vim tiene una tecla líder para ayudar con los mapeos. Por ejemplo, mapeé `<Leader>tn` para ejecutar la función `ToggleNumber()`. Sin la tecla líder, estaría usando `tn`, pero Vim ya tiene `t` (la navegación de búsqueda "till"). Con la tecla líder, ahora puedo presionar la tecla asignada como líder, luego `tn` sin interferir con los comandos existentes. La tecla líder es una tecla que puedes configurar para iniciar tu combinación de mapeos. Por defecto, Vim usa la barra invertida como la tecla líder (así que `<Leader>tn` se convierte en "barra invertida-t-n").

Personalmente, me gusta usar `<Space>` como la tecla líder en lugar de la barra invertida por defecto. Para cambiar tu tecla líder, agrega esto en tu vimrc:

```shell
let mapleader = "\<space>"
```

El comando `nnoremap` utilizado arriba se puede desglosar en tres partes:
- `n` representa el modo normal.
- `nore` significa no recursivo.
- `map` es el comando de mapeo.

Como mínimo, podrías haber usado `nmap` en lugar de `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). Sin embargo, es una buena práctica usar la variante no recursiva para evitar posibles bucles infinitos.

Esto es lo que podría suceder si no mapeas de manera no recursiva. Supón que quieres agregar un mapeo a `B` para agregar un punto y coma al final de la línea, luego retroceder una PALABRA (recuerda que `B` en Vim es una tecla de navegación en modo normal para ir hacia atrás una PALABRA).

```shell
nmap B A;<esc>B
```

Cuando presionas `B`... ¡oh no! Vim agrega `;` incontrolablemente (interrúmpelo con `Ctrl-C`). ¿Por qué sucedió eso? Porque en el mapeo `A;<esc>B`, el `B` no se refiere a la función nativa de Vim `B` (ir hacia atrás una PALABRA), sino que se refiere a la función mapeada. Lo que tienes es en realidad esto:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Para resolver este problema, necesitas agregar un mapeo no recursivo:

```shell
nnoremap B A;<esc>B
```

Ahora intenta llamar a `B` nuevamente. Esta vez agrega exitosamente un `;` al final de la línea y retrocede una PALABRA. El `B` en este mapeo representa la funcionalidad original de `B` de Vim.

Vim tiene diferentes mapeos para diferentes modos. Si deseas crear un mapeo para el modo de inserción para salir del modo de inserción cuando presionas `jk`:

```shell
inoremap jk <esc>
```

Los otros modos de mapeo son: `map` (Normal, Visual, Select y Operator-pending), `vmap` (Visual y Select), `smap` (Select), `xmap` (Visual), `omap` (Operator-pending), `map!` (Insert y Command-line), `lmap` (Insert, Command-line, Lang-arg), `cmap` (Command-line) y `tmap` (trabajo en terminal). No los cubriré en detalle. Para aprender más, consulta `:h map.txt`.

Crea un mapeo que sea más intuitivo, consistente y fácil de recordar.

## Organizando Vimrc

Con el tiempo, tu vimrc crecerá y se volverá complicado. Hay dos maneras de mantener tu vimrc limpio:
- Divide tu vimrc en varios archivos.
- Pliega tu archivo vimrc.

### Dividiendo Tu Vimrc

Puedes dividir tu vimrc en múltiples archivos usando el comando `source` de Vim. Este comando lee comandos de línea de comandos del argumento de archivo dado.

Vamos a crear un archivo dentro del directorio `~/.vim` y nombrarlo `/settings` (`~/.vim/settings`). El nombre en sí es arbitrario y puedes nombrarlo como desees.

Vas a dividirlo en cuatro componentes:
- Plugins de terceros (`~/.vim/settings/plugins.vim`).
- Configuraciones generales (`~/.vim/settings/configs.vim`).
- Funciones personalizadas (`~/.vim/settings/functions.vim`).
- Mapeos de teclas (`~/.vim/settings/mappings.vim`).

Dentro de `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Puedes editar estos archivos poniendo el cursor debajo de la ruta y presionando `gf`.

Dentro de `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Dentro de `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

Dentro de `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

Dentro de `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Tu vimrc debería funcionar como de costumbre, ¡pero ahora tiene solo cuatro líneas!

Con esta configuración, sabes fácilmente a dónde ir. Si necesitas agregar más mapeos, agrégales al archivo `/mappings.vim`. En el futuro, siempre puedes agregar más directorios a medida que tu vimrc crezca. Por ejemplo, si necesitas crear una configuración para tus esquemas de colores, puedes agregar un `~/.vim/settings/themes.vim`.

### Manteniendo Un Solo Archivo Vimrc

Si prefieres mantener un solo archivo vimrc para que sea portátil, puedes usar los pliegues de marcador para mantenerlo organizado. Agrega esto en la parte superior de tu vimrc:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim puede detectar qué tipo de archivo tiene el búfer actual (`:set filetype?`). Si es un tipo de archivo `vim`, puedes usar un método de pliegue de marcador. Recuerda que un pliegue de marcador usa `{{{` y `}}}` para indicar los pliegues de inicio y fin.

Agrega pliegues `{{{` y `}}}` al resto de tu vimrc (no olvides comentarlos con `"`):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Tu vimrc debería verse así:

```shell
+-- 6 líneas: configuración de pliegues -----

+-- 6 líneas: plugins ---------

+-- 5 líneas: configuraciones ---------

+-- 9 líneas: funciones -------

+-- 5 líneas: mapeos --------
```

## Ejecutando Vim Con o Sin Vimrc y Plugins

Si necesitas ejecutar Vim sin vimrc y sin plugins, ejecuta:

```shell
vim -u NONE
```

Si necesitas lanzar Vim sin vimrc pero con plugins, ejecuta:

```shell
vim -u NORC
```

Si necesitas ejecutar Vim con vimrc pero sin plugins, ejecuta:

```shell
vim --noplugin
```

Si necesitas ejecutar Vim con un vimrc *diferente*, digamos `~/.vimrc-backup`, ejecuta:

```shell
vim -u ~/.vimrc-backup
```

Si necesitas ejecutar Vim solo con `defaults.vim` y sin plugins, lo cual es útil para arreglar un vimrc roto, ejecuta:

```shell
vim --clean
```

## Configura Vimrc de Manera Inteligente

Vimrc es un componente importante de la personalización de Vim. Una buena manera de comenzar a construir tu vimrc es leyendo los vimrc de otras personas y construirlo gradualmente con el tiempo. El mejor vimrc no es el que usa el desarrollador X, sino el que está hecho exactamente para adaptarse a tu marco de pensamiento y estilo de edición.