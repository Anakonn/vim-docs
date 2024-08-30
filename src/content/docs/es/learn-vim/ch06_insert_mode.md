---
description: Este documento explora el modo de inserción en Vim, destacando sus características
  y métodos para mejorar la eficiencia al escribir.
title: Ch06. Insert Mode
---

El modo de inserción es el modo predeterminado de muchos editores de texto. En este modo, lo que escribes es lo que obtienes.

Sin embargo, eso no significa que no haya mucho que aprender. El modo de inserción de Vim contiene muchas características útiles. En este capítulo, aprenderás cómo usar estas características del modo de inserción en Vim para mejorar tu eficiencia al escribir.

## Formas de Ir al Modo de Inserción

Hay muchas formas de entrar en el modo de inserción desde el modo normal. Aquí hay algunas de ellas:

```shell
i    Inserta texto antes del cursor
I    Inserta texto antes del primer carácter no en blanco de la línea
a    Añade texto después del cursor
A    Añade texto al final de la línea
o    Comienza una nueva línea debajo del cursor e inserta texto
O    Comienza una nueva línea encima del cursor e inserta texto
s    Elimina el carácter bajo el cursor e inserta texto
S    Elimina la línea actual e inserta texto, sinónimo de "cc"
gi   Inserta texto en la misma posición donde se detuvo el último modo de inserción
gI   Inserta texto al inicio de la línea (columna 1)
```

Nota el patrón de minúsculas / mayúsculas. Para cada comando en minúsculas, hay un contraparte en mayúsculas. Si eres nuevo, no te preocupes si no recuerdas toda la lista anterior. Comienza con `i` y `o`. Deberían ser suficientes para empezar. Aprende gradualmente más con el tiempo.

## Diferentes Formas de Salir del Modo de Inserción

Hay algunas formas diferentes de regresar al modo normal mientras estás en el modo de inserción:

```shell
<Esc>     Sale del modo de inserción y va al modo normal
Ctrl-[    Sale del modo de inserción y va al modo normal
Ctrl-C    Como Ctrl-[ y <Esc>, pero no verifica abreviaturas
```

Encuentro que la tecla `<Esc>` está demasiado lejos para alcanzarla, así que mapeo mi `<Caps-Lock>` para que se comporte como `<Esc>`. Si buscas el teclado ADM-3A de Bill Joy (creador de Vi), verás que la tecla `<Esc>` no está ubicada en la esquina superior izquierda como en los teclados modernos, sino a la izquierda de la tecla `q`. Por eso creo que tiene sentido mapear `<Caps lock>` a `<Esc>`.

Otra convención común que he visto que hacen los usuarios de Vim es mapear `<Esc>` a `jj` o `jk` en el modo de inserción. Si prefieres esta opción, añade una de esas líneas (o ambas) en tu archivo vimrc.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Repitiendo el Modo de Inserción

Puedes pasar un parámetro de conteo antes de entrar en el modo de inserción. Por ejemplo:

```shell
10i
```

Si escribes "¡hola mundo!" y sales del modo de inserción, Vim repetirá el texto 10 veces. Esto funcionará con cualquier método del modo de inserción (ej: `10I`, `11a`, `12o`).

## Eliminando Fragmentos en el Modo de Inserción

Cuando cometes un error de escritura, puede ser engorroso presionar `<Backspace>` repetidamente. Puede tener más sentido ir al modo normal y eliminar tu error. También puedes eliminar varios caracteres a la vez mientras estás en el modo de inserción.

```shell
Ctrl-h    Elimina un carácter
Ctrl-w    Elimina una palabra
Ctrl-u    Elimina toda la línea
```

## Insertar Desde el Registro

Los registros de Vim pueden almacenar textos para uso futuro. Para insertar un texto desde cualquier registro nombrado mientras estás en el modo de inserción, escribe `Ctrl-R` más el símbolo del registro. Hay muchos símbolos que puedes usar, pero para esta sección, cubramos solo los registros nombrados (a-z).

Para verlo en acción, primero necesitas copiar una palabra al registro a. Mueve el cursor sobre cualquier palabra. Luego escribe:

```shell
"ayiw
```

- `"a` le dice a Vim que el objetivo de tu próxima acción irá al registro a.
- `yiw` copia la palabra interna. Revisa el capítulo sobre la gramática de Vim para un repaso.

El registro a ahora contiene la palabra que acabas de copiar. Mientras estás en el modo de inserción, para pegar el texto almacenado en el registro a:

```shell
Ctrl-R a
```

Hay múltiples tipos de registros en Vim. Los cubriré con más detalle en un capítulo posterior.

## Desplazamiento

¿Sabías que puedes desplazarte mientras estás en el modo de inserción? Mientras estás en el modo de inserción, si vas al sub-modo `Ctrl-X`, puedes realizar operaciones adicionales. Desplazarse es una de ellas.

```shell
Ctrl-X Ctrl-Y    Desplazar hacia arriba
Ctrl-X Ctrl-E    Desplazar hacia abajo
```

## Autocompletado

Como se mencionó anteriormente, si presionas `Ctrl-X` desde el modo de inserción, Vim ingresará a un sub-modo. Puedes hacer autocompletado de texto mientras estás en este sub-modo de inserción. Aunque no es tan bueno como [intellisense](https://code.visualstudio.com/docs/editor/intellisense) o cualquier otro Protocolo de Lenguaje de Servidor (LSP), para algo que está disponible directamente, es una característica muy capaz.

Aquí hay algunos comandos de autocompletado útiles para comenzar:

```shell
Ctrl-X Ctrl-L	   Inserta una línea completa
Ctrl-X Ctrl-N	   Inserta un texto del archivo actual
Ctrl-X Ctrl-I	   Inserta un texto de archivos incluidos
Ctrl-X Ctrl-F	   Inserta un nombre de archivo
```

Cuando activas el autocompletado, Vim mostrará una ventana emergente. Para navegar hacia arriba y hacia abajo en la ventana emergente, usa `Ctrl-N` y `Ctrl-P`.

Vim también tiene dos atajos de autocompletado que no involucran el sub-modo `Ctrl-X`:

```shell
Ctrl-N             Encuentra la siguiente coincidencia de palabra
Ctrl-P             Encuentra la coincidencia de palabra anterior
```

En general, Vim busca el texto en todos los búferes disponibles para la fuente de autocompletado. Si tienes un búfer abierto con una línea que dice "Los donuts de chocolate son los mejores":
- Cuando escribes "Choco" y haces `Ctrl-X Ctrl-L`, coincidirá e imprimirá toda la línea.
- Cuando escribes "Choco" y haces `Ctrl-P`, coincidirá e imprimirá la palabra "Chocolate".

El autocompletado es un tema vasto en Vim. Esto es solo la punta del iceberg. Para aprender más, revisa `:h ins-completion`.

## Ejecutando un Comando del Modo Normal

¿Sabías que Vim puede ejecutar un comando del modo normal mientras estás en el modo de inserción?

Mientras estás en el modo de inserción, si presionas `Ctrl-O`, estarás en el sub-modo de inserción-normal. Si miras el indicador de modo en la parte inferior izquierda, normalmente verás `-- INSERT --`, pero al presionar `Ctrl-O`, cambiará a `-- (insert) --`. En este modo, puedes hacer *un* comando del modo normal. Algunas cosas que puedes hacer:

**Centrar y saltar**

```shell
Ctrl-O zz       Centrar ventana
Ctrl-O H/M/L    Saltar a la parte superior/media/inferior de la ventana
Ctrl-O 'a       Saltar a la marca a
```

**Repetir texto**

```shell
Ctrl-O 100ihello    Insertar "hello" 100 veces
```

**Ejecutar comandos de terminal**

```shell
Ctrl-O !! curl https://google.com    Ejecutar curl
Ctrl-O !! pwd                        Ejecutar pwd
```

**Eliminar más rápido**

```shell
Ctrl-O dtz    Eliminar desde la ubicación actual hasta la letra "z"
Ctrl-O D      Eliminar desde la ubicación actual hasta el final de la línea
```

## Aprende el Modo de Inserción de Manera Inteligente

Si eres como yo y vienes de otro editor de texto, puede ser tentador permanecer en el modo de inserción. Sin embargo, quedarse en el modo de inserción cuando no estás ingresando texto es un anti-patrón. Desarrolla el hábito de ir al modo normal cuando tus dedos no están escribiendo nuevo texto.

Cuando necesites insertar un texto, primero pregúntate si ese texto ya existe. Si es así, intenta copiar o mover ese texto en lugar de escribirlo. Si tienes que usar el modo de inserción, ve si puedes autocompletar ese texto siempre que sea posible. Evita escribir la misma palabra más de una vez si puedes.