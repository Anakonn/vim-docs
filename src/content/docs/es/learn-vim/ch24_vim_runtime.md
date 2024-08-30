---
description: Este capítulo ofrece una visión general de las rutas de ejecución de
  Vim, explicando su importancia y cómo personalizarlas para mejorar la experiencia
  del usuario.
title: Ch24. Vim Runtime
---

En los capítulos anteriores, mencioné que Vim busca automáticamente rutas especiales como `pack/` (Cap. 22) y `compiler/` (Cap. 19) dentro del directorio `~/.vim/`. Estos son ejemplos de rutas de tiempo de ejecución de Vim.

Vim tiene más rutas de tiempo de ejecución que estas dos. En este capítulo, aprenderás una visión general de alto nivel de estas rutas de tiempo de ejecución. El objetivo de este capítulo es mostrarte cuándo se llaman. Saber esto te permitirá entender y personalizar Vim aún más.

## Ruta de Tiempo de Ejecución

En una máquina Unix, una de tus rutas de tiempo de ejecución de Vim es `$HOME/.vim/` (si tienes un sistema operativo diferente como Windows, tu ruta podría ser diferente). Para ver cuáles son las rutas de tiempo de ejecución para diferentes sistemas operativos, consulta `:h 'runtimepath'`. En este capítulo, usaré `~/.vim/` como la ruta de tiempo de ejecución predeterminada.

## Scripts de Plugin

Vim tiene una ruta de tiempo de ejecución de plugin que ejecuta cualquier script en este directorio una vez cada vez que se inicia Vim. No confundas el nombre "plugin" con los plugins externos de Vim (como NERDTree, fzf.vim, etc.).

Ve al directorio `~/.vim/` y crea un directorio `plugin/`. Crea dos archivos: `donut.vim` y `chocolate.vim`.

Dentro de `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

Dentro de `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Ahora cierra Vim. La próxima vez que inicies Vim, verás tanto `"donut!"` como `"chocolate!"` impresos. La ruta de tiempo de ejecución del plugin se puede usar para scripts de inicialización.

## Detección de Tipo de Archivo

Antes de comenzar, para asegurarte de que estas detecciones funcionen, asegúrate de que tu vimrc contenga al menos la siguiente línea:

```shell
filetype plugin indent on
```

Consulta `:h filetype-overview` para más contexto. Esencialmente, esto activa la detección de tipo de archivo de Vim.

Cuando abres un nuevo archivo, Vim generalmente sabe qué tipo de archivo es. Si tienes un archivo `hello.rb`, ejecutar `:set filetype?` devuelve la respuesta correcta `filetype=ruby`.

Vim sabe cómo detectar tipos de archivos "comunes" (Ruby, Python, Javascript, etc.). Pero, ¿qué pasa si tienes un archivo personalizado? Necesitas enseñarle a Vim a detectarlo y asignarle el tipo de archivo correcto.

Hay dos métodos de detección: usando el nombre del archivo y el contenido del archivo.

### Detección por Nombre de Archivo

La detección por nombre de archivo detecta un tipo de archivo usando el nombre de ese archivo. Cuando abres el archivo `hello.rb`, Vim sabe que es un archivo Ruby por la extensión `.rb`.

Hay dos formas en las que puedes hacer la detección por nombre de archivo: usando el directorio de tiempo de ejecución `ftdetect/` y usando el archivo de tiempo de ejecución `filetype.vim`. Exploremos ambas.

#### `ftdetect/`

Vamos a crear un archivo oscuro (pero delicioso), `hello.chocodonut`. Cuando lo abras y ejecutes `:set filetype?`, dado que no es una extensión de nombre de archivo común, Vim no sabe qué hacer con él. Devuelve `filetype=`.

Necesitas instruir a Vim para que establezca todos los archivos que terminan con `.chocodonut` como un tipo de archivo "chocodonut". Crea un directorio llamado `ftdetect/` en la raíz de tiempo de ejecución (`~/.vim/`). Dentro, crea un archivo y nómbralo `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). Dentro de este archivo, agrega:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` y `BufRead` se activan cada vez que creas un nuevo buffer y abres un nuevo buffer. `*.chocodonut` significa que este evento solo se activará si el buffer abierto tiene una extensión de nombre de archivo `.chocodonut`. Finalmente, el comando `set filetype=chocodonut` establece el tipo de archivo como un tipo de chocodonut.

Reinicia Vim. Ahora abre el archivo `hello.chocodonut` y ejecuta `:set filetype?`. Devuelve `filetype=chocodonut`.

¡Delicioso! Puedes poner tantos archivos como desees dentro de `ftdetect/`. En el futuro, quizás puedas agregar `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, etc., si alguna vez decides expandir tus tipos de archivos de donut.

De hecho, hay dos formas de establecer un tipo de archivo en Vim. Una es la que acabas de usar `set filetype=chocodonut`. La otra forma es ejecutar `setfiletype chocodonut`. El primer comando `set filetype=chocodonut` *siempre* establecerá el tipo de archivo como tipo chocodonut, mientras que el segundo comando `setfiletype chocodonut` solo establecerá el tipo de archivo si aún no se había establecido un tipo de archivo.

#### Archivo de Tipo de Archivo

El segundo método de detección de archivos requiere que crees un `filetype.vim` en el directorio raíz (`~/.vim/filetype.vim`). Agrega esto dentro:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Crea un archivo `hello.plaindonut`. Cuando lo abras y ejecutes `:set filetype?`, Vim muestra el tipo de archivo personalizado correcto `filetype=plaindonut`.

¡Santo postre, funciona! Por cierto, si juegas con `filetype.vim`, puede que notes que este archivo se ejecuta múltiples veces cuando abres `hello.plaindonut`. Para evitar esto, puedes agregar una guardia para que el script principal se ejecute solo una vez. Actualiza el `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` es un comando de Vim para detener la ejecución del resto del script. La expresión `"did_load_filetypes"` *no* es una función incorporada de Vim. En realidad, es una variable global desde dentro de `$VIMRUNTIME/filetype.vim`. Si tienes curiosidad, ejecuta `:e $VIMRUNTIME/filetype.vim`. Encontrarás estas líneas dentro:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Cuando Vim llama a este archivo, define la variable `did_load_filetypes` y la establece en 1. 1 es verdadero en Vim. También deberías leer el resto de `filetype.vim`. Ve si puedes entender qué hace cuando Vim lo llama.

### Script de Tipo de Archivo

Aprendamos cómo detectar y asignar un tipo de archivo basado en el contenido del archivo.

Supongamos que tienes una colección de archivos sin una extensión aceptable. Lo único que estos archivos tienen en común es que todos comienzan con la palabra "donutify" en la primera línea. Quieres asignar estos archivos a un tipo de archivo `donut`. Crea nuevos archivos llamados `sugardonut`, `glazeddonut` y `frieddonut` (sin extensión). Dentro de cada archivo, agrega esta línea:

```shell
donutify
```

Cuando ejecutas `:set filetype?` desde dentro de `sugardonut`, Vim no sabe qué tipo de archivo asignar a este archivo. Devuelve `filetype=`.

En la raíz de tiempo de ejecución, agrega un archivo `scripts.vim` (`~/.vim/scripts.vim`). Dentro de él, agrega esto:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

La función `getline(1)` devuelve el texto de la primera línea. Verifica si la primera línea comienza con la palabra "donutify". La función `did_filetype()` es una función incorporada de Vim. Devolverá verdadero cuando se active al menos una vez un evento relacionado con el tipo de archivo. Se usa como guardia para detener la reejecución del evento de tipo de archivo.

Abre el archivo `sugardonut` y ejecuta `:set filetype?`, Vim ahora devuelve `filetype=donut`. Si abres otros archivos de donut (`glazeddonut` y `frieddonut`), Vim también identifica sus tipos de archivo como tipos de `donut`.

Ten en cuenta que `scripts.vim` solo se ejecuta cuando Vim abre un archivo con un tipo de archivo desconocido. Si Vim abre un archivo con un tipo de archivo conocido, `scripts.vim` no se ejecutará.

## Plugin de Tipo de Archivo

¿Qué pasa si quieres que Vim ejecute scripts específicos de chocodonut cuando abres un archivo de chocodonut y que no ejecute esos scripts al abrir un archivo de plaindonut?

Puedes hacer esto con la ruta de tiempo de ejecución del plugin de tipo de archivo (`~/.vim/ftplugin/`). Vim busca dentro de este directorio un archivo con el mismo nombre que el tipo de archivo que acabas de abrir. Crea un `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Llamando desde el ftplugin de chocodonut"
```

Crea otro archivo de ftplugin, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Llamando desde el ftplugin de plaindonut"
```

Ahora, cada vez que abras un tipo de archivo de chocodonut, Vim ejecutará los scripts de `~/.vim/ftplugin/chocodonut.vim`. Cada vez que abras un tipo de archivo de plaindonut, Vim ejecutará los scripts de `~/.vim/ftplugin/plaindonut.vim`.

Una advertencia: estos archivos se ejecutan cada vez que se establece un tipo de archivo de buffer (`set filetype=chocodonut`, por ejemplo). Si abres 3 archivos diferentes de chocodonut, los scripts se ejecutarán un *total* de tres veces.

## Archivos de Sangrado

Vim tiene una ruta de tiempo de ejecución de sangrado que funciona de manera similar a ftplugin, donde Vim busca un archivo con el mismo nombre que el tipo de archivo abierto. El propósito de estas rutas de tiempo de ejecución de sangrado es almacenar códigos relacionados con el sangrado. Si tienes el archivo `~/.vim/indent/chocodonut.vim`, se ejecutará solo cuando abras un tipo de archivo de chocodonut. Puedes almacenar códigos relacionados con el sangrado para archivos de chocodonut aquí.

## Colores

Vim tiene una ruta de tiempo de ejecución de colores (`~/.vim/colors/`) para almacenar esquemas de color. Cualquier archivo que vaya dentro del directorio se mostrará en el comando de línea `:color`.

Si tienes un archivo `~/.vim/colors/beautifulprettycolors.vim`, cuando ejecutes `:color` y presiones Tab, verás `beautifulprettycolors` como una de las opciones de color. Si prefieres agregar tu propio esquema de color, este es el lugar para ir.

Si deseas ver los esquemas de color que otras personas han creado, un buen lugar para visitar es [vimcolors](https://vimcolors.com/).

## Resaltado de Sintaxis

Vim tiene una ruta de tiempo de ejecución de sintaxis (`~/.vim/syntax/`) para definir el resaltado de sintaxis.

Supongamos que tienes un archivo `hello.chocodonut`, dentro de él tienes las siguientes expresiones:

```shell
(donut "delicioso")
(donut "sabroso")
```

Aunque Vim ahora conoce el tipo de archivo correcto, todos los textos tienen el mismo color. Vamos a agregar una regla de resaltado de sintaxis para resaltar la palabra clave "donut". Crea un nuevo archivo de sintaxis de chocodonut, `~/.vim/syntax/chocodonut.vim`. Dentro de él agrega:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Ahora vuelve a abrir el archivo `hello.chocodonut`. Las palabras clave `donut` ahora están resaltadas.

Este capítulo no profundizará en el resaltado de sintaxis. Es un tema vasto. Si tienes curiosidad, consulta `:h syntax.txt`.

El plugin [vim-polyglot](https://github.com/sheerun/vim-polyglot) es un gran plugin que proporciona resaltados para muchos lenguajes de programación populares.

## Documentación

Si creas un plugin, tendrás que crear tu propia documentación. Usas la ruta de tiempo de ejecución doc para eso.

Vamos a crear una documentación básica para las palabras clave chocodonut y plaindonut. Crea un `donut.txt` (`~/.vim/doc/donut.txt`). Dentro, agrega estos textos:

```shell
*chocodonut* Delicioso donut de chocolate

*plaindonut* Sin bondad de chocolate pero aún delicioso
```

Si intentas buscar `chocodonut` y `plaindonut` (`:h chocodonut` y `:h plaindonut`), no encontrarás nada.

Primero, necesitas ejecutar `:helptags` para generar nuevas entradas de ayuda. Ejecuta `:helptags ~/.vim/doc/`

Ahora, si ejecutas `:h chocodonut` y `:h plaindonut`, encontrarás estas nuevas entradas de ayuda. Nota que el archivo ahora es de solo lectura y tiene un tipo de archivo "ayuda".
## Carga Perezosa de Scripts

Todos los caminos de tiempo de ejecución que aprendiste en este capítulo se ejecutaron automáticamente. Si deseas cargar un script manualmente, utiliza el camino de tiempo de ejecución de autoload.

Crea un directorio de autoload (`~/.vim/autoload/`). Dentro de ese directorio, crea un nuevo archivo y nómbralo `tasty.vim` (`~/.vim/autoload/tasty.vim`). Dentro de él:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Ten en cuenta que el nombre de la función es `tasty#donut`, no `donut()`. El signo de número (`#`) es necesario al usar la función de autoload. La convención de nomenclatura de funciones para la función de autoload es:

```shell
function fileName#functionName()
  ...
endfunction
```

En este caso, el nombre del archivo es `tasty.vim` y el nombre de la función es (técnicamente) `donut`.

Para invocar una función, necesitas el comando `call`. Llamemos a esa función con `:call tasty#donut()`.

La primera vez que llames a la función, deberías ver *ambos* mensajes de eco ("tasty.vim global" y "tasty#donut"). Las llamadas posteriores a la función `tasty#donut` solo mostrarán el eco "testy#donut".

Cuando abres un archivo en Vim, a diferencia de los caminos de tiempo de ejecución anteriores, los scripts de autoload no se cargan automáticamente. Solo cuando llamas explícitamente a `tasty#donut()`, Vim busca el archivo `tasty.vim` y carga todo lo que hay dentro, incluida la función `tasty#donut()`. Autoload es el mecanismo perfecto para funciones que utilizan recursos extensos pero que no usas a menudo.

Puedes agregar tantos directorios anidados con autoload como desees. Si tienes el camino de tiempo de ejecución `~/.vim/autoload/one/two/three/tasty.vim`, puedes llamar a la función con `:call one#two#three#tasty#donut()`.

## Scripts Después

Vim tiene un camino de tiempo de ejecución después (`~/.vim/after/`) que refleja la estructura de `~/.vim/`. Cualquier cosa en este camino se ejecuta al final, por lo que los desarrolladores suelen usar estos caminos para sobrescribir scripts.

Por ejemplo, si deseas sobrescribir los scripts de `plugin/chocolate.vim`, puedes crear `~/.vim/after/plugin/chocolate.vim` para poner los scripts de sobrescritura. Vim ejecutará `~/.vim/after/plugin/chocolate.vim` *después de* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

Vim tiene una variable de entorno `$VIMRUNTIME` para scripts predeterminados y archivos de soporte. Puedes revisarlo ejecutando `:e $VIMRUNTIME`.

La estructura debería parecer familiar. Contiene muchos caminos de tiempo de ejecución que aprendiste en este capítulo.

Recuerda que en el Capítulo 21, aprendiste que cuando abres Vim, busca archivos vimrc en siete ubicaciones diferentes. Dije que la última ubicación que verifica Vim es `$VIMRUNTIME/defaults.vim`. Si Vim no encuentra ningún archivo vimrc de usuario, utiliza un `defaults.vim` como vimrc.

¿Alguna vez has intentado ejecutar Vim sin un plugin de sintaxis como vim-polyglot y aún así tu archivo sigue resaltado sintácticamente? Eso es porque cuando Vim no encuentra un archivo de sintaxis en el camino de tiempo de ejecución, busca un archivo de sintaxis en el directorio de sintaxis de `$VIMRUNTIME`.

Para aprender más, consulta `:h $VIMRUNTIME`.

## Opción Runtimepath

Para verificar tu runtimepath, ejecuta `:set runtimepath?`

Si usas Vim-Plug o administradores de plugins externos populares, debería mostrar una lista de directorios. Por ejemplo, el mío muestra:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Una de las cosas que hacen los administradores de plugins es agregar cada plugin al camino de tiempo de ejecución. Cada camino de tiempo de ejecución puede tener su propia estructura de directorios similar a `~/.vim/`.

Si tienes un directorio `~/box/of/donuts/` y deseas agregar ese directorio a tu camino de tiempo de ejecución, puedes agregar esto a tu vimrc:

```shell
set rtp+=$HOME/box/of/donuts/
```

Si dentro de `~/box/of/donuts/`, tienes un directorio de plugin (`~/box/of/donuts/plugin/hello.vim`) y un ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), Vim ejecutará todos los scripts de `plugin/hello.vim` cuando abras Vim. Vim también ejecutará `ftplugin/chocodonut.vim` cuando abras un archivo de chocodonut.

Prueba esto tú mismo: crea un camino arbitrario y agrégalo a tu runtimepath. Agrega algunos de los caminos de tiempo de ejecución que aprendiste en este capítulo. Asegúrate de que funcionen como se espera.

## Aprende Runtime de la Manera Inteligente

Tómate tu tiempo para leerlo y juega con estos caminos de tiempo de ejecución. Para ver cómo se utilizan los caminos de tiempo de ejecución en el mundo real, ve al repositorio de uno de tus plugins de Vim favoritos y estudia su estructura de directorios. Deberías poder entender la mayoría de ellos ahora. Intenta seguir adelante y discernir la imagen general. Ahora que entiendes la estructura de directorios de Vim, estás listo para aprender Vimscript.