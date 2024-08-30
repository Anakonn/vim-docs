---
description: Este documento enseña cómo usar el comando global en Vim para ejecutar
  comandos de línea en múltiples líneas simultáneamente.
title: Ch13. the Global Command
---

Hasta ahora has aprendido cómo repetir el último cambio con el comando de punto (`.`), reproducir acciones con macros (`q`), y almacenar textos en los registros (`"`).

En este capítulo, aprenderás cómo repetir un comando de línea de comandos con el comando global.

## Resumen del Comando Global

El comando global de Vim se utiliza para ejecutar un comando de línea de comandos en múltiples líneas simultáneamente.

Por cierto, es posible que hayas oído el término "Comandos Ex" antes. En esta guía, me refiero a ellos como comandos de línea de comandos. Tanto los comandos Ex como los comandos de línea de comandos son lo mismo. Son los comandos que comienzan con dos puntos (`:`). El comando de sustitución en el último capítulo fue un ejemplo de un comando Ex. Se llaman Ex porque originalmente provienen del editor de texto Ex. Continuaré refiriéndome a ellos como comandos de línea de comandos en esta guía. Para una lista completa de comandos Ex, consulta `:h ex-cmd-index`.

El comando global tiene la siguiente sintaxis:

```shell
:g/patrón/comando
```

El `patrón` coincide con todas las líneas que contienen ese patrón, similar al patrón en el comando de sustitución. El `comando` puede ser cualquier comando de línea de comandos. El comando global funciona ejecutando `comando` contra cada línea que coincide con el `patrón`.

Si tienes las siguientes expresiones:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Para eliminar todas las líneas que contienen "console", puedes ejecutar:

```shell
:g/console/d
```

Resultado:

```shell
const one = 1;

const two = 2;

const three = 3;
```

El comando global ejecuta el comando de eliminación (`d`) en todas las líneas que coinciden con el patrón "console".

Al ejecutar el comando `g`, Vim realiza dos escaneos a través del archivo. En la primera ejecución, escanea cada línea y marca la línea que coincide con el patrón `/console/`. Una vez que todas las líneas coincidentes están marcadas, va por segunda vez y ejecuta el comando `d` en las líneas marcadas.

Si deseas eliminar todas las líneas que contienen "const" en su lugar, ejecuta:

```shell
:g/const/d
```

Resultado:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Coincidencia Inversa

Para ejecutar el comando global en líneas que no coinciden, puedes ejecutar:

```shell
:g!/patrón/comando
```

o

```shell
:v/patrón/comando
```

Si ejecutas `:v/console/d`, eliminará todas las líneas *que no* contienen "console".

## Patrón

El comando global utiliza el mismo sistema de patrones que el comando de sustitución, así que esta sección servirá como un repaso. ¡Siéntete libre de saltar a la siguiente sección o leer junto!

Si tienes estas expresiones:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Para eliminar las líneas que contienen "one" o "two", ejecuta:

```shell
:g/one\|two/d
```

Para eliminar las líneas que contienen cualquier dígito, ejecuta cualquiera de las siguientes:

```shell
:g/[0-9]/d
```

o

```shell
:g/\d/d
```

Si tienes la expresión:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Para coincidir con las líneas que contienen entre tres y seis ceros, ejecuta:

```shell
:g/0\{3,6\}/d
```

## Pasar un Rango

Puedes pasar un rango antes del comando `g`. Aquí hay algunas formas de hacerlo:
- `:1,5g/console/d` coincide con la cadena "console" entre las líneas 1 y 5 y las elimina.
- `:,5g/console/d` si no hay dirección antes de la coma, entonces comienza desde la línea actual. Busca la cadena "console" entre la línea actual y la línea 5 y las elimina.
- `:3,g/console/d` si no hay dirección después de la coma, entonces termina en la línea actual. Busca la cadena "console" entre la línea 3 y la línea actual y las elimina.
- `:3g/console/d` si solo pasas una dirección sin una coma, ejecuta el comando solo en la línea 3. Busca en la línea 3 y la elimina si tiene la cadena "console".

Además de números, también puedes usar estos símbolos como rango:
- `.` significa la línea actual. Un rango de `.,3` significa entre la línea actual y la línea 3.
- `$` significa la última línea en el archivo. El rango `3,$` significa entre la línea 3 y la última línea.
- `+n` significa n líneas después de la línea actual. Puedes usarlo con `.` o sin él. `3,+1` o `3,.+1` significa entre la línea 3 y la línea después de la línea actual.

Si no le das ningún rango, por defecto afecta a todo el archivo. Esto en realidad no es lo normal. La mayoría de los comandos de línea de comandos de Vim se ejecutan solo en la línea actual si no le pasas ningún rango. Las dos excepciones notables son los comandos globales (`:g`) y el de guardar (`:w`).

## Comando Normal

Puedes ejecutar un comando normal con el comando global con el comando de línea de comandos `:normal`.

Si tienes este texto:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Para agregar un ";" al final de cada línea, ejecuta:

```shell
:g/./normal A;
```

Desglosemos:
- `:g` es el comando global.
- `/./` es un patrón para "líneas no vacías". Coincide con las líneas que tienen al menos un carácter, por lo que coincide con las líneas que tienen "const" y "console" y no coincide con líneas vacías.
- `normal A;` ejecuta el comando de línea de comandos `:normal`. `A;` es el comando en modo normal para insertar un ";" al final de la línea.

## Ejecutando una Macro

También puedes ejecutar una macro con el comando global. Una macro se puede ejecutar con el comando `normal`. Si tienes las expresiones:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Observa que las líneas con "const" no tienen punto y coma. Vamos a crear una macro para agregar un punto y coma al final de esas líneas en el registro a:

```shell
qaA;<Esc>q
```

Si necesitas un repaso, consulta el capítulo sobre macros. Ahora ejecuta:

```shell
:g/const/normal @a
```

Ahora todas las líneas con "const" tendrán un ";" al final.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Si seguiste este paso a paso, tendrás dos punto y coma en la primera línea. Para evitar eso, ejecuta el comando global desde la línea dos en adelante, `:2,$g/const/normal @a`.

## Comando Global Recursivo

El comando global en sí es un tipo de comando de línea de comandos, por lo que técnicamente puedes ejecutar el comando global dentro de un comando global.

Dadas las siguientes expresiones, si deseas eliminar la segunda declaración `console.log`:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Si ejecutas:

```shell
:g/console/g/two/d
```

Primero, `g` buscará las líneas que contienen el patrón "console" y encontrará 3 coincidencias. Luego, el segundo `g` buscará la línea que contiene el patrón "two" de esas tres coincidencias. Finalmente, eliminará esa coincidencia.

También puedes combinar `g` con `v` para encontrar patrones positivos y negativos. Por ejemplo:

```shell
:g/console/v/two/d
```

En lugar de buscar la línea que contiene el patrón "two", buscará las líneas *que no* contienen el patrón "two".

## Cambiando el Delimitador

Puedes cambiar el delimitador del comando global como el comando de sustitución. Las reglas son las mismas: puedes usar cualquier carácter de un solo byte excepto letras, números, `"`, `|`, y `\`.

Para eliminar las líneas que contienen "console":

```shell
:g@console@d
```

Si estás usando el comando de sustitución con el comando global, puedes tener dos delimitadores diferentes:

```shell
g@one@s+const+let+g
```

Aquí el comando global buscará todas las líneas que contienen "one". El comando de sustitución sustituirá, de esas coincidencias, la cadena "const" por "let".

## El Comando Predeterminado

¿Qué sucede si no especificas ningún comando de línea de comandos en el comando global?

El comando global utilizará el comando de impresión (`:p`) para imprimir el texto de la línea actual. Si ejecutas:

```shell
:g/console
```

Imprimirá en la parte inferior de la pantalla todas las líneas que contienen "console".

Por cierto, aquí hay un dato interesante. Debido a que el comando predeterminado utilizado por el comando global es `p`, esto hace que la sintaxis `g` sea:

```shell
:g/re/p
```

- `g` = el comando global
- `re` = el patrón regex
- `p` = el comando de impresión

Se deletrea *"grep"*, el mismo `grep` de la línea de comandos. Esto **no** es una coincidencia. El comando `g/re/p` proviene originalmente del editor Ed, uno de los editores de texto en línea originales. El comando `grep` recibió su nombre de Ed.

Tu computadora probablemente todavía tiene el editor Ed. Ejecuta `ed` desde la terminal (pista: para salir, escribe `q`).

## Invirtiendo Todo el Búfer

Para invertir todo el archivo, ejecuta:

```shell
:g/^/m 0
```

`^` es un patrón para el comienzo de una línea. Usa `^` para coincidir con todas las líneas, incluidas las líneas vacías.

Si necesitas invertir solo algunas líneas, pasa un rango. Para invertir las líneas entre la línea cinco y la línea diez, ejecuta:

```shell
:5,10g/^/m 0
```

Para aprender más sobre el comando de mover, consulta `:h :move`.

## Agregando Todos los Todos

Al programar, a veces escribiría TODOs en el archivo que estoy editando:

```shell
const one = 1;
console.log("one: ", one);
// TODO: alimentar al cachorro

const two = 2;
// TODO: alimentar al cachorro automáticamente
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: crear una startup vendiendo un alimentador automático para cachorros
```

Puede ser difícil llevar un registro de todos los TODOs creados. Vim tiene un método `:t` (copiar) para copiar todas las coincidencias a una dirección. Para aprender más sobre el método de copia, consulta `:h :copy`.

Para copiar todos los TODOs al final del archivo para una inspección más fácil, ejecuta:

```shell
:g/TODO/t $
```

Resultado:

```shell
const one = 1;
console.log("one: ", one);
// TODO: alimentar al cachorro

const two = 2;
// TODO: alimentar al cachorro automáticamente
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: crear una startup vendiendo un alimentador automático para cachorros

// TODO: alimentar al cachorro
// TODO: alimentar al cachorro automáticamente
// TODO: crear una startup vendiendo un alimentador automático para cachorros
```

Ahora puedo revisar todos los TODOs que creé, encontrar un momento para hacerlos o delegarlos a alguien más, y continuar trabajando en mi próxima tarea.

Si en lugar de copiarlos deseas mover todos los TODOs al final, usa el comando de mover, `:m`:

```shell
:g/TODO/m $
```

Resultado:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: alimentar al cachorro
// TODO: alimentar al cachorro automáticamente
// TODO: crear una startup vendiendo un alimentador automático para cachorros
```

## Eliminación en Agujero Negro

Recuerda del capítulo de registros que los textos eliminados se almacenan dentro de los registros numerados (siempre que sean lo suficientemente grandes). Cada vez que ejecutas `:g/console/d`, Vim almacena las líneas eliminadas en los registros numerados. Si eliminas muchas líneas, puedes llenar rápidamente todos los registros numerados. Para evitar esto, siempre puedes usar el registro de agujero negro (`"_`) para *no* almacenar tus líneas eliminadas en los registros. Ejecuta:

```shell
:g/console/d_
```

Al pasar `_` después de `d`, Vim no usará tus registros de desecho.
## Reducir Múltiples Líneas Vacías a Una Línea Vacía

Si tienes un texto con múltiples líneas vacías:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Puedes reducir rápidamente las líneas vacías a una línea vacía con:

```shell
:g/^$/,/./-1j
```

Resultado:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Normalmente, el comando global acepta la siguiente forma: `:g/patrón/comando`. Sin embargo, también puedes ejecutar el comando global con la siguiente forma: `:g/patrón1/,/patrón2/comando`. Con esto, Vim aplicará el `comando` dentro de `patrón1` y `patrón2`.

Teniendo eso en cuenta, desglosamos el comando `:g/^$/,/./-1j` de acuerdo a `:g/patrón1/,/patrón2/comando`:
- `/patrón1/` es `/^$/`. Representa una línea vacía (una línea con cero caracteres).
- `/patrón2/` es `/./` con el modificador de línea `-1`. `/./` representa una línea no vacía (una línea con al menos un carácter). El `-1` significa la línea anterior a esa.
- `comando` es `j`, el comando de unir (`:j`). En este contexto, este comando global une todas las líneas dadas.

Por cierto, si deseas reducir múltiples líneas vacías a ninguna línea, ejecuta esto en su lugar:

```shell
:g/^$/,/./j
```

Una alternativa más simple:

```shell
:g/^$/-j
```

Tu texto ahora se ha reducido a:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Ordenamiento Avanzado

Vim tiene un comando `:sort` para ordenar las líneas dentro de un rango. Por ejemplo:

```shell
d
b
a
e
c
```

Puedes ordenarlas ejecutando `:sort`. Si le das un rango, solo ordenará las líneas dentro de ese rango. Por ejemplo, `:3,5sort` solo ordena las líneas tres y cinco.

Si tienes las siguientes expresiones:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Si necesitas ordenar los elementos dentro de los arreglos, pero no los arreglos en sí, puedes ejecutar esto:

```shell
:g/\[/+1,/\]/-1sort
```

Resultado:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

¡Esto es genial! Pero el comando parece complicado. Desglosémoslo. Este comando también sigue la forma `:g/patrón1/,/patrón2/comando`.

- `:g` es el patrón del comando global.
- `/\[/+1` es el primer patrón. Coincide con un corchete cuadrado izquierdo "[". El `+1` se refiere a la línea debajo de él.
- `/\]/-1` es el segundo patrón. Coincide con un corchete cuadrado derecho "]". El `-1` se refiere a la línea encima de él.
- `/\[/+1,/\]/-1` se refiere a cualquier línea entre "[" y "]".
- `sort` es un comando de línea de comandos para ordenar.

## Aprende el Comando Global de la Manera Inteligente

El comando global ejecuta el comando de línea de comandos contra todas las líneas que coinciden. Con él, solo necesitas ejecutar un comando una vez y Vim hará el resto por ti. Para volverte competente en el comando global, se requieren dos cosas: un buen vocabulario de comandos de línea de comandos y un conocimiento de expresiones regulares. A medida que pases más tiempo usando Vim, naturalmente aprenderás más comandos de línea de comandos. Un conocimiento de expresiones regulares requerirá un enfoque más activo. Pero una vez que te sientas cómodo con las expresiones regulares, estarás por delante de muchos.

Algunos de los ejemplos aquí son complicados. No te sientas intimidado. Tómate tu tiempo para entenderlos. Aprende a leer los patrones. No te rindas.

Siempre que necesites ejecutar múltiples comandos, pausa y ve si puedes usar el comando `g`. Identifica el mejor comando para el trabajo y escribe un patrón para dirigirte a tantas cosas como sea posible a la vez.

Ahora que sabes cuán poderoso es el comando global, aprendamos a usar los comandos externos para aumentar tus arsenales de herramientas.