---
description: Este capítulo aborda la búsqueda y sustitución en Vim, destacando el
  uso de expresiones regulares y la sensibilidad a mayúsculas y minúsculas.
title: Ch12. Search and Substitute
---

Este capítulo cubre dos conceptos separados pero relacionados: buscar y sustituir. A menudo, al editar, necesitas buscar múltiples textos basados en sus patrones de menor común denominador. Al aprender a usar expresiones regulares en buscar y sustituir en lugar de cadenas literales, podrás dirigirte a cualquier texto rápidamente.

Como nota al margen, en este capítulo, usaré `/` al hablar de búsqueda. Todo lo que puedes hacer con `/` también se puede hacer con `?`.

## Sensibilidad de Mayúsculas Inteligente

Puede ser complicado intentar coincidir con el caso del término de búsqueda. Si estás buscando el texto "Learn Vim", puedes fácilmente escribir mal el caso de una letra y obtener un resultado de búsqueda falso. ¿No sería más fácil y seguro si pudieras coincidir con cualquier caso? Aquí es donde la opción `ignorecase` brilla. Solo agrega `set ignorecase` en tu vimrc y todos tus términos de búsqueda se vuelven insensibles a mayúsculas. Ahora no tienes que hacer `/Learn Vim` más, `/learn vim` funcionará.

Sin embargo, hay momentos en los que necesitas buscar una frase específica en cuanto a mayúsculas. Una forma de hacerlo es desactivar la opción `ignorecase` ejecutando `set noignorecase`, pero eso es mucho trabajo para activar y desactivar cada vez que necesitas buscar una frase sensible a mayúsculas.

Para evitar alternar `ignorecase`, Vim tiene una opción `smartcase` para buscar cadenas insensibles a mayúsculas si el patrón de búsqueda *contiene al menos un carácter en mayúscula*. Puedes combinar `ignorecase` y `smartcase` para realizar una búsqueda insensible a mayúsculas cuando ingresas todos los caracteres en minúscula y una búsqueda sensible a mayúsculas cuando ingresas uno o más caracteres en mayúscula.

Dentro de tu vimrc, agrega:

```shell
set ignorecase smartcase
```

Si tienes estos textos:

```shell
hello
HELLO
Hello
```

- `/hello` coincide con "hello", "HELLO" y "Hello".
- `/HELLO` coincide solo con "HELLO".
- `/Hello` coincide solo con "Hello".

Hay una desventaja. ¿Qué pasa si necesitas buscar solo una cadena en minúscula? Cuando haces `/hello`, Vim ahora realiza una búsqueda insensible a mayúsculas. Puedes usar el patrón `\C` en cualquier lugar de tu término de búsqueda para decirle a Vim que el término de búsqueda subsiguiente será sensible a mayúsculas. Si haces `/\Chello`, coincidirá estrictamente con "hello", no con "HELLO" o "Hello".

## Primer y Último Carácter en una Línea

Puedes usar `^` para coincidir con el primer carácter en una línea y `$` para coincidir con el último carácter en una línea.

Si tienes este texto:

```shell
hello hello
```

Puedes dirigirte al primer "hello" con `/^hello`. El carácter que sigue a `^` debe ser el primer carácter en una línea. Para dirigirte al último "hello", ejecuta `/hello$`. El carácter antes de `$` debe ser el último carácter en una línea.

Si tienes este texto:

```shell
hello hello friend
```

Ejecutar `/hello$` no coincidirá con nada porque "friend" es el último término en esa línea, no "hello".

## Repetir Búsqueda

Puedes repetir la búsqueda anterior con `//`. Si acabas de buscar `/hello`, ejecutar `//` es equivalente a ejecutar `/hello`. Este atajo puede ahorrarte algunas pulsaciones, especialmente si acabas de buscar una cadena larga. También recuerda que puedes usar `n` y `N` para repetir la última búsqueda en la misma dirección y en dirección opuesta, respectivamente.

¿Qué pasa si quieres recordar rápidamente *n* términos de búsqueda anteriores? Puedes recorrer rápidamente el historial de búsqueda presionando primero `/`, luego presiona las teclas de flecha `arriba`/`abajo` (o `Ctrl-N`/`Ctrl-P`) hasta que encuentres el término de búsqueda que necesitas. Para ver todo tu historial de búsqueda, puedes ejecutar `:history /`.

Cuando llegas al final de un archivo mientras buscas, Vim lanza un error: `"Search hit the BOTTOM without match for: {your-search}"`. A veces esto puede ser una buena salvaguarda contra la sobrebúsqueda, pero otras veces quieres ciclar la búsqueda de nuevo al principio. Puedes usar la opción `set wrapscan` para hacer que Vim busque de nuevo al principio del archivo cuando llegas al final del archivo. Para desactivar esta función, haz `set nowrapscan`.

## Buscar Palabras Alternativas

Es común buscar múltiples palabras a la vez. Si necesitas buscar *ya sea* "hello vim" o "hola vim", pero no "salve vim" o "bonjour vim", puedes usar el patrón `|`.

Dado este texto:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Para coincidir tanto "hello" como "hola", puedes hacer `/hello\|hola`. Tienes que escapar (`\`) el operador o (`|`), de lo contrario Vim buscará literalmente la cadena "|".

Si no quieres escribir `\|` cada vez, puedes usar la sintaxis `magic` (`\v`) al inicio de la búsqueda: `/\vhello|hola`. No cubriré `magic` en esta guía, pero con `\v`, ya no tienes que escapar caracteres especiales. Para aprender más sobre `\v`, siéntete libre de consultar `:h \v`.

## Establecer el Inicio y el Fin de una Coincidencia

Quizás necesites buscar un texto que sea parte de una palabra compuesta. Si tienes estos textos:

```shell
11vim22
vim22
11vim
vim
```

Si necesitas seleccionar "vim" pero solo cuando comienza con "11" y termina con "22", puedes usar los operadores `\zs` (inicio de coincidencia) y `\ze` (fin de coincidencia). Ejecuta:

```shell
/11\zsvim\ze22
```

Vim aún tiene que coincidir con todo el patrón "11vim22", pero solo resalta el patrón que está entre `\zs` y `\ze`. Otro ejemplo:

```shell
foobar
foobaz
```

Si necesitas coincidir con "foo" en "foobaz" pero no en "foobar", ejecuta:

```shell
/foo\zebaz
```

## Buscar Rangos de Caracteres

Todos tus términos de búsqueda hasta este punto han sido una búsqueda de palabras literales. En la vida real, puede que tengas que usar un patrón general para encontrar tu texto. El patrón más básico es el rango de caracteres, `[ ]`.

Si necesitas buscar cualquier dígito, probablemente no quieras escribir `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` cada vez. En su lugar, usa `/[0-9]` para coincidir con un solo dígito. La expresión `0-9` representa un rango de números del 0 al 9 que Vim intentará coincidir, así que si estás buscando dígitos entre 1 y 5, usa `/[1-5]`.

Los dígitos no son los únicos tipos de datos que Vim puede buscar. También puedes hacer `/[a-z]` para buscar letras minúsculas y `/[A-Z]` para buscar letras mayúsculas.

Puedes combinar estos rangos. Si necesitas buscar dígitos del 0 al 9 y tanto letras minúsculas como mayúsculas de "a" a "f" (como un hexadecimal), puedes hacer `/[0-9a-fA-F]`.

Para hacer una búsqueda negativa, puedes agregar `^` dentro de los corchetes del rango de caracteres. Para buscar un no-dígito, ejecuta `/[^0-9]`. Vim coincidirá con cualquier carácter siempre que no sea un dígito. Ten cuidado que el acento circunflejo (`^`) dentro de los corchetes es diferente del acento circunflejo al inicio de una línea (ej: `/^hello`). Si un acento circunflejo está fuera de un par de corchetes y es el primer carácter en el término de búsqueda, significa "el primer carácter en una línea". Si un acento circunflejo está dentro de un par de corchetes y es el primer carácter dentro de los corchetes, significa un operador de búsqueda negativa. `/^abc` coincide con el primer "abc" en una línea y `/[^abc]` coincide con cualquier carácter excepto "a", "b" o "c".

## Buscar Caracteres Repetidos

Si necesitas buscar dígitos dobles en este texto:

```shell
1aa
11a
111
```

Puedes usar `/[0-9][0-9]` para coincidir con un carácter de dos dígitos, pero este método no es escalable. ¿Qué pasa si necesitas coincidir con veinte dígitos? Escribir `[0-9]` veinte veces no es una experiencia divertida. Por eso necesitas un argumento de `count`.

Puedes pasar `count` a tu búsqueda. Tiene la siguiente sintaxis:

```shell
{n,m}
```

Por cierto, estos corchetes de `count` necesitan ser escapados cuando los usas en Vim. El operador `count` se coloca después de un solo carácter que deseas incrementar.

Aquí están las cuatro variaciones diferentes de la sintaxis de `count`:
- `{n}` es una coincidencia exacta. `/[0-9]\{2\}` coincide con los números de dos dígitos: "11" y el "11" en "111".
- `{n,m}` es una coincidencia de rango. `/[0-9]\{2,3\}` coincide con números de entre 2 y 3 dígitos: "11" y "111".
- `{,m}` es una coincidencia de hasta. `/[0-9]\{,3\}` coincide con números de hasta 3 dígitos: "1", "11" y "111".
- `{n,}` es una coincidencia de al menos. `/[0-9]\{2,\}` coincide con números de 2 o más dígitos: "11" y "111".

Los argumentos de count `\{0,\}` (cero o más) y `\{1,\}` (uno o más) son patrones de búsqueda comunes y Vim tiene operadores especiales para ellos: `*` y `+` (`+` necesita ser escapado mientras que `*` funciona bien sin el escape). Si haces `/[0-9]*`, es lo mismo que `/[0-9]\{0,\}`. Busca cero o más dígitos. Coincidirá con "", "1", "123". Por cierto, también coincidirá con no-dígitos como "a", porque técnicamente hay cero dígitos en la letra "a". Piensa cuidadosamente antes de usar `*`. Si haces `/[0-9]\+`, es lo mismo que `/[0-9]\{1,\}`. Busca uno o más dígitos. Coincidirá con "1" y "12".

## Rangos de Caracteres Predefinidos

Vim tiene rangos predefinidos para caracteres comunes como dígitos y letras. No cubriré cada uno aquí, pero puedes encontrar la lista completa dentro de `:h /character-classes`. Aquí están los útiles:

```shell
\d    Dígito [0-9]
\D    No dígito [^0-9]
\s    Carácter de espacio en blanco (espacio y tabulación)
\S    Carácter no espacio en blanco (todo excepto espacio y tabulación)
\w    Carácter de palabra [0-9A-Za-z_]
\l    Letras minúsculas [a-z]
\u    Carácter mayúscula [A-Z]
```

Puedes usarlos como usarías rangos de caracteres. Para buscar cualquier dígito único, en lugar de usar `/[0-9]`, puedes usar `/\d` para una sintaxis más concisa.

## Ejemplo de Búsqueda: Capturando un Texto Entre un Par de Caracteres Similares

Si deseas buscar una frase rodeada por un par de comillas dobles:

```shell
"Vim is awesome!"
```

Ejecuta esto:

```shell
/"[^"]\+"
```

Desglosemos:
- `"` es una comilla doble literal. Coincide con la primera comilla doble.
- `[^"]` significa cualquier carácter excepto una comilla doble. Coincide con cualquier carácter alfanumérico y de espacio en blanco siempre que no sea una comilla doble.
- `\+` significa uno o más. Dado que está precedido por `[^"]`, Vim busca uno o más caracteres que no sean una comilla doble.
- `"` es una comilla doble literal. Coincide con la comilla doble de cierre.

Cuando Vim ve la primera `"`, comienza la captura del patrón. En el momento en que ve la segunda comilla doble en una línea, coincide con el segundo patrón `"` y detiene la captura del patrón. Mientras tanto, todos los caracteres que no son comillas dobles en medio son capturados por el patrón `[^"]\+`, en este caso, la frase `Vim is awesome!`. Este es un patrón común para capturar una frase rodeada por un par de delimitadores similares.

- Para capturar una frase rodeada por comillas simples, puedes usar `/'[^']\+'`.
- Para capturar una frase rodeada por ceros, puedes usar `/0[^0]\+0`.

## Ejemplo de Búsqueda: Capturando un Número de Teléfono

Si deseas coincidir con un número de teléfono de EE. UU. separado por un guion (`-`), como `123-456-7890`, puedes usar:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Un número de teléfono de EE. UU. consiste en un conjunto de tres dígitos, seguido de otros tres dígitos, y finalmente cuatro dígitos. Desglosemos:
- `\d\{3\}` coincide con un dígito repetido exactamente tres veces
- `-` es un guion literal

Puedes evitar escribir escapes con `\v`:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Este patrón también es útil para capturar cualquier dígito repetido, como direcciones IP y códigos postales.

Eso cubre la parte de búsqueda de este capítulo. Ahora pasemos a la sustitución.

## Sustitución Básica

El comando de sustitución de Vim es un comando útil para encontrar y reemplazar rápidamente cualquier patrón. La sintaxis de sustitución es:

```shell
:s/{patrón-antiguo}/{patrón-nuevo}/
```

Comencemos con un uso básico. Si tienes este texto:

```shell
vim is good
```

Sustituyamos "good" por "awesome" porque Vim es asombroso. Ejecuta `:s/good/awesome/`. Deberías ver:

```shell
vim is awesome
```
## Repetir la Última Sustitución

Puedes repetir el último comando de sustitución con el comando normal `&` o ejecutando `:s`. Si acabas de ejecutar `:s/good/awesome/`, ejecutar `&` o `:s` lo repetirá.

Además, anteriormente en este capítulo mencioné que puedes usar `//` para repetir el patrón de búsqueda anterior. Este truco funciona con el comando de sustitución. Si `/good` se realizó recientemente y dejas el primer argumento del patrón de sustitución en blanco, como en `:s//awesome/`, funcionará igual que ejecutar `:s/good/awesome/`.

## Rango de Sustitución

Al igual que muchos comandos Ex, puedes pasar un argumento de rango al comando de sustitución. La sintaxis es:

```shell
:[rango]s/viejo/nuevo/
```

Si tienes estas expresiones:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Para sustituir "let" por "const" en las líneas tres a cinco, puedes hacer:

```shell
:3,5s/let/const/
```

Aquí hay algunas variaciones de rango que puedes pasar:

- `:,3s/let/const/` - si no se da nada antes de la coma, representa la línea actual. Sustituye desde la línea actual hasta la línea 3.
- `:1,s/let/const/` - si no se da nada después de la coma, también representa la línea actual. Sustituye desde la línea 1 hasta la línea actual.
- `:3s/let/const/` - si solo se da un valor como rango (sin coma), realiza la sustitución solo en esa línea.

En Vim, `%` generalmente significa el archivo completo. Si ejecutas `:%s/let/const/`, realizará la sustitución en todas las líneas. Ten en cuenta esta sintaxis de rango. Muchos comandos de línea de comandos que aprenderás en los próximos capítulos seguirán esta forma.

## Coincidencia de Patrones

Las próximas secciones cubrirán expresiones regulares básicas. Un sólido conocimiento de patrones es esencial para dominar el comando de sustitución.

Si tienes las siguientes expresiones:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Para agregar un par de comillas dobles alrededor de los dígitos:

```shell
:%s/\d/"\0"/
```

El resultado:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Desglosemos el comando:
- `:%s` apunta al archivo completo para realizar la sustitución.
- `\d` es el rango predefinido de Vim para dígitos (similar a usar `[0-9]`).
- `"\0"` aquí las comillas dobles son comillas dobles literales. `\0` es un carácter especial que representa "todo el patrón coincidente". El patrón coincidente aquí es un número de un solo dígito, `\d`.

Alternativamente, `&` también representa todo el patrón coincidente como `\0`. `:s/\d/"&"/` también habría funcionado.

Consideremos otro ejemplo. Dadas estas expresiones y necesitas intercambiar todos los "let" con los nombres de las variables.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Para hacerlo, ejecuta:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

El comando anterior contiene demasiadas barras invertidas y es difícil de leer. En este caso, es más conveniente usar el operador `\v`:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

El resultado:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

¡Genial! Desglosemos ese comando:
- `:%s` apunta a todas las líneas del archivo para realizar la sustitución.
- `(\w+) (\w+)` es una coincidencia de grupo. `\w` es uno de los rangos predefinidos de Vim para un carácter de palabra (`[0-9A-Za-z_]`). Los `( )` que lo rodean capturan una coincidencia de carácter de palabra en un grupo. Nota el espacio entre los dos agrupamientos. `(\w+) (\w+)` captura dos grupos. El primer grupo captura "one" y el segundo grupo captura "two".
- `\2 \1` devuelve el grupo capturado en un orden invertido. `\2` contiene la cadena capturada "let" y `\1` la cadena "one". Tener `\2 \1` devuelve la cadena "let one".

Recuerda que `\0` representa todo el patrón coincidente. Puedes dividir la cadena coincidente en grupos más pequeños con `( )`. Cada grupo está representado por `\1`, `\2`, `\3`, etc.

Hagamos un ejemplo más para solidificar este concepto de coincidencia de grupos. Si tienes estos números:

```shell
123
456
789
```

Para invertir el orden, ejecuta:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

El resultado es:

```shell
321
654
987
```

Cada `(\d)` coincide con cada dígito y crea un grupo. En la primera línea, el primer `(\d)` tiene un valor de 1, el segundo `(\d)` tiene un valor de 2, y el tercero `(\d)` tiene un valor de 3. Se almacenan en las variables `\1`, `\2`, y `\3`. En la segunda mitad de tu sustitución, el nuevo patrón `\3\2\1` resulta en el valor "321" en la línea uno.

Si hubieras ejecutado esto en su lugar:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Habrías obtenido un resultado diferente:

```shell
312
645
978
```

Esto se debe a que ahora solo tienes dos grupos. El primer grupo, capturado por `(\d\d)`, se almacena dentro de `\1` y tiene el valor de 12. El segundo grupo, capturado por `(\d)`, se almacena dentro de `\2` y tiene el valor de 3. `\2\1` entonces, devuelve 312.

## Flags de Sustitución

Si tienes la frase:

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

Para sustituir todos los pancakes por donuts, no puedes simplemente ejecutar:

```shell
:s/pancake/donut
```

El comando anterior solo sustituirá la primera coincidencia, dándote:

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Hay dos formas de resolver esto. Puedes ejecutar el comando de sustitución dos veces más o puedes pasarle una bandera global (`g`) para sustituir todas las coincidencias en una línea.

Hablemos de la bandera global. Ejecuta:

```shell
:s/pancake/donut/g
```

Vim sustituye todos los pancakes por donuts en un solo comando rápido. El comando global es una de las varias banderas que acepta el comando de sustitución. Pasas banderas al final del comando de sustitución. Aquí hay una lista de banderas útiles:

```shell
&    Reutiliza las banderas del comando de sustitución anterior.
g    Reemplaza todas las coincidencias en la línea.
c    Pide confirmación para la sustitución.
e    Evita que se muestre un mensaje de error cuando la sustitución falla.
i    Realiza una sustitución sin distinguir mayúsculas y minúsculas.
I    Realiza una sustitución sensible a mayúsculas y minúsculas.
```

Hay más banderas que no enumero arriba. Para leer sobre todas las banderas, consulta `:h s_flags`.

Por cierto, los comandos de repetición de sustitución (`&` y `:s`) no retienen las banderas. Ejecutar `&` solo repetirá `:s/pancake/donut/` sin `g`. Para repetir rápidamente el último comando de sustitución con todas las banderas, ejecuta `:&&`.

## Cambiando el Delimitador

Si necesitas reemplazar una URL con una ruta larga:

```shell
https://mysite.com/a/b/c/d/e
```

Para sustituirla por la palabra "hello", ejecuta:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

Sin embargo, es difícil distinguir qué barras inclinadas (`/`) son parte del patrón de sustitución y cuáles son los delimitadores. Puedes cambiar el delimitador por cualquier carácter de un solo byte (excepto por letras, números, o `"`, `|`, y `\`). Vamos a reemplazarlos con `+`. El comando de sustitución anterior se puede reescribir como:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Ahora es más fácil ver dónde están los delimitadores.

## Reemplazo Especial

También puedes modificar el caso del texto que estás sustituyendo. Dadas las siguientes expresiones y tu tarea es poner en mayúsculas las variables "one", "two", "three", etc.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Ejecuta:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Obtendrás:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

El desglose:
- `(\w+) (\w+)` captura los dos primeros grupos coincidentes, como "let" y "one".
- `\1` devuelve el valor del primer grupo, "let".
- `\U\2` convierte a mayúsculas (`\U`) el segundo grupo (`\2`).

El truco de este comando es la expresión `\U\2`. `\U` instruye a que el siguiente carácter sea convertido a mayúsculas.

Hagamos un ejemplo más. Supongamos que estás escribiendo una guía de Vim y necesitas capitalizar la primera letra de cada palabra en una línea.

```shell
vim is the greatest text editor in the whole galaxy
```

Puedes ejecutar:

```shell
:s/\<./\U&/g
```

El resultado:

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Aquí están los desglozes:
- `:s` sustituye la línea actual.
- `\<.` se compone de dos partes: `\<` para coincidir con el inicio de una palabra y `.` para coincidir con cualquier carácter. El operador `\<` hace que el siguiente carácter sea el primer carácter de una palabra. Dado que `.` es el siguiente carácter, coincidirá con el primer carácter de cualquier palabra.
- `\U&` convierte a mayúsculas el símbolo subsiguiente, `&`. Recuerda que `&` (o `\0`) representa toda la coincidencia. Coincide con el primer carácter de cualquier palabra.
- `g` la bandera global. Sin ella, este comando solo sustituye la primera coincidencia. Necesitas sustituir cada coincidencia en esta línea.

Para aprender más sobre los símbolos de reemplazo especial de la sustitución como `\U`, consulta `:h sub-replace-special`.

## Patrones Alternativos

A veces necesitas coincidir con múltiples patrones simultáneamente. Si tienes los siguientes saludos:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Necesitas sustituir la palabra "vim" por "friend" pero solo en las líneas que contienen la palabra "hello" o "hola". Recuerda de lo anterior en este capítulo, puedes usar `|` para múltiples patrones alternativos.

```shell
:%s/\v(hello|hola) vim/\1 friend/g
```

El resultado:

```shell
hello friend
hola friend
salve vim
bonjour vim
```

Aquí está el desglose:
- `%s` ejecuta el comando de sustitución en cada línea de un archivo.
- `(hello|hola)` coincide con *cualquiera* de "hello" o "hola" y lo considera como un grupo.
- `vim` es la palabra literal "vim".
- `\1` es el primer grupo, que es ya sea el texto "hello" o "hola".
- `friend` es la palabra literal "friend".

## Sustituyendo el Inicio y el Fin de un Patrón

Recuerda que puedes usar `\zs` y `\ze` para definir el inicio y el fin de una coincidencia. Esta técnica también funciona en sustitución. Si tienes:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

Para sustituir el "cake" en "hotcake" por "dog" para obtener un "hotdog":

```shell
:%s/hot\zscake/dog/g
```

Resultado:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Codicioso y No codicioso

Puedes sustituir la enésima coincidencia en una línea con este truco:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Para sustituir el tercer "Mississippi" por "Arkansas", ejecuta:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

El desglose:
- `:s/` el comando de sustitución.
- `\v` es la palabra clave mágica para que no tengas que escapar palabras clave especiales.
- `.` coincide con cualquier carácter único.
- `{-}` realiza una coincidencia no codiciosa de 0 o más del átomo anterior.
- `\zsMississippi` hace que "Mississippi" sea el inicio de la coincidencia.
- `(...){3}` busca la tercera coincidencia.

Has visto la sintaxis `{3}` anteriormente en este capítulo. En este caso, `{3}` coincidirá exactamente con la tercera coincidencia. El nuevo truco aquí es `{-}`. Es una coincidencia no codiciosa. Encuentra la coincidencia más corta del patrón dado. En este caso, `(.{-}Mississippi)` coincide con la menor cantidad de "Mississippi" precedida por cualquier carácter. Contrasta esto con `(.*Mississippi)` donde encuentra la coincidencia más larga del patrón dado.

Si usas `(.{-}Mississippi)`, obtienes cinco coincidencias: "One Mississippi", "Two Mississippi", etc. Si usas `(.*Mississippi)`, obtienes una coincidencia: el último "Mississippi". `*` es un coincididor codicioso y `{-}` es un coincididor no codicioso. Para aprender más, consulta `:h /\{-` y `:h non-greedy`.

Hagamos un ejemplo más simple. Si tienes la cadena:

```shell
abc1de1
```

Puedes coincidir "abc1de1" (codicioso) con:

```shell
/a.*1
```

Puedes coincidir "abc1" (no codicioso) con:

```shell
/a.\{-}1
```

Así que si necesitas poner en mayúsculas la coincidencia más larga (codiciosa), ejecuta:

```shell
:s/a.*1/\U&/g
```

Para obtener:

```shell
ABC1DEFG1
```

Si necesitas poner en mayúsculas la coincidencia más corta (no codiciosa), ejecuta:

```shell
:s/a.\{-}1/\U&/g
```

Para obtener:

```shell
ABC1defg1
```

Si eres nuevo en el concepto de codicioso vs no codicioso, puede ser difícil de entender. Experimenta con diferentes combinaciones hasta que lo comprendas.

## Sustituyendo a Través de Múltiples Archivos

Finalmente, aprendamos cómo sustituir frases a través de múltiples archivos. Para esta sección, asume que tienes dos archivos: `food.txt` y `animal.txt`.

Dentro de `food.txt`:

```shell
corndog
hotdog
chilidog
```

Dentro de `animal.txt`:

```shell
large dog
medium dog
small dog
```

Asume que tu estructura de directorios se ve así:

```shell
- food.txt
- animal.txt
```

Primero, captura ambos `food.txt` y `animal.txt` dentro de `:args`. Recuerda de capítulos anteriores que `:args` se puede usar para crear una lista de nombres de archivos. Hay varias formas de hacer esto desde dentro de Vim, una de ellas es ejecutando esto desde dentro de Vim:

```shell
:args *.txt                  captura todos los archivos txt en la ubicación actual
```

Para probarlo, cuando ejecutes `:args`, deberías ver:

```shell
[food.txt] animal.txt
```

Ahora que todos los archivos relevantes están almacenados dentro de la lista de argumentos, puedes realizar una sustitución en múltiples archivos con el comando `:argdo`. Ejecuta:

```shell
:argdo %s/dog/chicken/
```

Esto realiza la sustitución en todos los archivos dentro de la lista `:args`. Finalmente, guarda los archivos cambiados con:

```shell
:argdo update
```

`:args` y `:argdo` son herramientas útiles para aplicar comandos de línea de comandos a través de múltiples archivos. ¡Pruébalo con otros comandos!

## Sustituyendo a Través de Múltiples Archivos Con Macros

Alternativamente, también puedes ejecutar el comando de sustitución a través de múltiples archivos con macros. Ejecuta:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

El desglose:
- `:args *.txt` agrega todos los archivos de texto a la lista `:args`.
- `qq` inicia la macro en el registro "q".
- `:%s/dog/chicken/g` sustituye "dog" por "chicken" en todas las líneas del archivo actual.
- `:wnext` guarda el archivo y luego pasa al siguiente archivo en la lista `args`.
- `q` detiene la grabación de la macro.
- `99@q` ejecuta la macro noventa y nueve veces. Vim detendrá la ejecución de la macro después de encontrar el primer error, por lo que Vim no ejecutará realmente la macro noventa y nueve veces.

## Aprendiendo Búsqueda y Sustitución de Manera Inteligente

La habilidad de buscar bien es una habilidad necesaria en la edición. Dominar la búsqueda te permite utilizar la flexibilidad de las expresiones regulares para buscar cualquier patrón en un archivo. Tómate tu tiempo para aprender esto. Para mejorar con las expresiones regulares, necesitas estar usándolas activamente. Una vez leí un libro sobre expresiones regulares sin realmente practicarlo y olvidé casi todo lo que leí después. La codificación activa es la mejor manera de dominar cualquier habilidad.

Una buena manera de mejorar tu habilidad de coincidencia de patrones es cada vez que necesites buscar un patrón (como "hello 123"), en lugar de consultar el término de búsqueda literal (`/hello 123`), intenta idear un patrón para ello (algo como `/\v(\l+) (\d+)`). Muchos de estos conceptos de expresiones regulares también son aplicables en programación general, no solo al usar Vim.

Ahora que aprendiste sobre búsqueda y sustitución avanzadas en Vim, aprendamos uno de los comandos más versátiles, el comando global.