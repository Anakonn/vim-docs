---
description: Este capítulo enseña cómo utilizar el gestor de paquetes de Vim para
  instalar plugins, incluyendo la configuración de directorios y métodos de carga.
title: Ch23. Vim Packages
---

En el capítulo anterior, mencioné el uso de un administrador de complementos externo para instalar complementos. Desde la versión 8, Vim viene con su propio administrador de complementos integrado llamado *packages*. En este capítulo, aprenderás cómo usar los paquetes de Vim para instalar complementos.

Para ver si tu versión de Vim tiene la capacidad de usar paquetes, ejecuta `:version` y busca el atributo `+packages`. Alternativamente, también puedes ejecutar `:echo has('packages')` (si devuelve 1, entonces tiene la capacidad de paquetes).

## Directorio de Paquetes

Verifica si tienes un directorio `~/.vim/` en la ruta raíz. Si no lo tienes, crea uno. Dentro de él, crea un directorio llamado `pack` (`~/.vim/pack/`). Vim sabe automáticamente buscar dentro de este directorio para paquetes.

## Dos Tipos de Carga

El paquete de Vim tiene dos mecanismos de carga: carga automática y carga manual.

### Carga Automática

Para cargar complementos automáticamente cuando Vim se inicia, necesitas ponerlos en el directorio `start/`. La ruta se ve así:

```shell
~/.vim/pack/*/start/
```

Ahora puedes preguntar, "¿Qué es el `*` entre `pack/` y `start/`?" `*` es un nombre arbitrario y puede ser cualquier cosa que desees. Llamémoslo `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

Ten en cuenta que si lo omites y haces algo como esto en su lugar:

```shell
~/.vim/pack/start/
```

El sistema de paquetes no funcionará. Es imperativo poner un nombre entre `pack/` y `start/`.

Para esta demostración, intentemos instalar el complemento [NERDTree](https://github.com/preservim/nerdtree). Ve al directorio `start/` (`cd ~/.vim/pack/packdemo/start/`) y clona el repositorio de NERDTree:

```shell
git clone https://github.com/preservim/nerdtree.git
```

¡Eso es todo! Estás listo. La próxima vez que inicies Vim, podrás ejecutar inmediatamente comandos de NERDTree como `:NERDTreeToggle`.

Puedes clonar tantos repositorios de complementos como desees dentro de la ruta `~/.vim/pack/*/start/`. Vim cargará automáticamente cada uno. Si eliminas el repositorio clonado (`rm -rf nerdtree/`), ese complemento ya no estará disponible.

### Carga Manual

Para cargar complementos manualmente cuando Vim se inicia, necesitas ponerlos en el directorio `opt/`. Similar a la carga automática, la ruta se ve así:

```shell
~/.vim/pack/*/opt/
```

Utilicemos el mismo directorio `packdemo/` de antes:

```shell
~/.vim/pack/packdemo/opt/
```

Esta vez, instalemos el juego [killersheep](https://github.com/vim/killersheep) (esto requiere Vim 8.2). Ve al directorio `opt/` (`cd ~/.vim/pack/packdemo/opt/`) y clona el repositorio:

```shell
git clone https://github.com/vim/killersheep.git
```

Inicia Vim. El comando para ejecutar el juego es `:KillKillKill`. Intenta ejecutarlo. Vim se quejará de que no es un comando de editor válido. Necesitas *cargar manualmente* el complemento primero. Hagámoslo:

```shell
:packadd killersheep
```

Ahora intenta ejecutar el comando nuevamente `:KillKillKill`. El comando debería funcionar ahora.

Puedes preguntarte, "¿Por qué querría cargar manualmente los paquetes? ¿No es mejor cargar todo automáticamente al inicio?"

Gran pregunta. A veces hay complementos que no usarás todo el tiempo, como ese juego KillerSheep. Probablemente no necesites cargar 10 juegos diferentes y ralentizar el tiempo de inicio de Vim. Sin embargo, de vez en cuando, cuando estés aburrido, podrías querer jugar algunos juegos. Usa la carga manual para complementos no esenciales.

También puedes usar esto para agregar complementos de manera condicional. Tal vez uses tanto Neovim como Vim y hay complementos optimizados para Neovim. Puedes agregar algo como esto en tu vimrc:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Organizando Paquetes

Recuerda que el requisito para usar el sistema de paquetes de Vim es tener ya sea:

```shell
~/.vim/pack/*/start/
```

O:

```shell
~/.vim/pack/*/opt/
```

El hecho de que `*` pueda ser *cualquier* nombre se puede usar para organizar tus paquetes. Supongamos que deseas agrupar tus complementos según categorías (colores, sintaxis y juegos):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Aún puedes usar `start/` y `opt/` dentro de cada uno de los directorios.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Agregando Paquetes de Manera Inteligente

Puedes preguntarte si el paquete de Vim hará que administradores de complementos populares como vim-pathogen, vundle.vim, dein.vim y vim-plug sean obsoletos.

La respuesta es, como siempre, "depende".

Todavía uso vim-plug porque facilita agregar, eliminar o actualizar complementos. Si usas muchos complementos, puede ser más conveniente usar administradores de complementos porque es fácil actualizar muchos simultáneamente. Algunos administradores de complementos también ofrecen funcionalidades asincrónicas.

Si eres un minimalista, prueba los paquetes de Vim. Si eres un usuario intensivo de complementos, puede que quieras considerar usar un administrador de complementos.