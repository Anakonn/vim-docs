---
description: Aprende sobre Vimscript y sus tipos de datos primitivos, incluyendo números,
  cadenas y listas, mientras exploras el modo Ex para practicar.
title: Ch25. Vimscript Basic Data Types
---

En los próximos capítulos, aprenderás sobre Vimscript, el lenguaje de programación integrado de Vim.

Al aprender un nuevo lenguaje, hay tres elementos básicos a tener en cuenta:
- Primitivas
- Medios de Combinación
- Medios de Abstracción

En este capítulo, aprenderás sobre los tipos de datos primitivos de Vim.

## Tipos de Datos

Vim tiene 10 tipos de datos diferentes:
- Número
- Flotante
- Cadena
- Lista
- Diccionario
- Especial
- Funcref
- Trabajo
- Canal
- Blob

Cubriré los primeros seis tipos de datos aquí. En el Cap. 27, aprenderás sobre Funcref. Para más información sobre los tipos de datos de Vim, consulta `:h variables`.

## Siguiendo Con El Modo Ex

Vim técnicamente no tiene un REPL integrado, pero tiene un modo, el modo Ex, que se puede usar como uno. Puedes acceder al modo Ex con `Q` o `gQ`. El modo Ex es como un modo de línea de comandos extendido (es como escribir comandos de modo de línea de comandos sin parar). Para salir del modo Ex, escribe `:visual`.

Puedes usar `:echo` o `:echom` en este capítulo y en los capítulos posteriores de Vimscript para codificar junto. Son como `console.log` en JS o `print` en Python. El comando `:echo` imprime la expresión evaluada que proporcionas. El comando `:echom` hace lo mismo, pero además, almacena el resultado en el historial de mensajes.

```viml
:echom "mensaje de eco hello"
```

Puedes ver el historial de mensajes con:

```shell
:messages
```

Para limpiar tu historial de mensajes, ejecuta:

```shell
:messages clear
```

## Número

Vim tiene 4 tipos de números diferentes: decimal, hexadecimal, binario y octal. Por cierto, cuando digo tipo de dato número, a menudo esto significa un tipo de dato entero. En esta guía, usaré los términos número e entero de manera intercambiable.

### Decimal

Deberías estar familiarizado con el sistema decimal. Vim acepta decimales positivos y negativos. 1, -1, 10, etc. En la programación de Vimscript, probablemente estarás usando el tipo decimal la mayor parte del tiempo.

### Hexadecimal

Los hexadecimales comienzan con `0x` o `0X`. Mnemotécnico: He**x**adecimal.

### Binario

Los binarios comienzan con `0b` o `0B`. Mnemotécnico: **B**inario.

### Octal

Los octales comienzan con `0`, `0o` y `0O`. Mnemotécnico: **O**ctal.

### Imprimiendo Números

Si `echo` un número hexadecimal, binario o octal, Vim los convierte automáticamente a decimales.

```viml
:echo 42
" devuelve 42

:echo 052
" devuelve 42

:echo 0b101010
" devuelve 42

:echo 0x2A
" devuelve 42
```

### Verdadero y Falso

En Vim, un valor de 0 es falso y todos los valores no 0 son verdaderos.

Lo siguiente no imprimirá nada.

```viml
:if 0
:  echo "Nope"
:endif
```

Sin embargo, esto sí lo hará:

```viml
:if 1
:  echo "Yes"
:endif
```

Cualquier valor diferente de 0 es verdadero, incluidos los números negativos. 100 es verdadero. -1 es verdadero.

### Aritmética de Números

Los números se pueden usar para ejecutar expresiones aritméticas:

```viml
:echo 3 + 1
" devuelve 4

: echo 5 - 3
" devuelve 2

:echo 2 * 2
" devuelve 4

:echo 4 / 2
" devuelve 2
```

Al dividir un número con un residuo, Vim descarta el residuo.

```viml
:echo 5 / 2
" devuelve 2 en lugar de 2.5
```

Para obtener un resultado más preciso, necesitas usar un número flotante.

## Flotante

Los flotantes son números con decimales finales. Hay dos formas de representar números flotantes: notación de punto decimal (como 31.4) y exponente (3.14e01). Similar a los números, puedes usar signos positivos y negativos:

```viml
:echo +123.4
" devuelve 123.4

:echo -1.234e2
" devuelve -123.4

:echo 0.25
" devuelve 0.25

:echo 2.5e-1
" devuelve 0.25
```

Necesitas darle a un flotante un punto y dígitos finales. `25e-2` (sin punto) y `1234.` (tiene un punto, pero sin dígitos finales) son ambos números flotantes inválidos.

### Aritmética Flotante

Al hacer una expresión aritmética entre un número y un flotante, Vim convierte el resultado a un flotante.

```viml
:echo 5 / 2.0
" devuelve 2.5
```

La aritmética de flotante y flotante te da otro flotante.

```shell
:echo 1.0 + 1.0
" devuelve 2.0
```

## Cadena

Las cadenas son caracteres rodeados por comillas dobles (`""`) o comillas simples (`''`). "Hola", "123" y '123.4' son ejemplos de cadenas.

### Concatenación de Cadenas

Para concatenar una cadena en Vim, usa el operador `.`.

```viml
:echo "Hola" . " mundo"
" devuelve "Hola mundo"
```

### Aritmética de Cadenas

Cuando ejecutas operadores aritméticos (`+ - * /`) con un número y una cadena, Vim convierte la cadena en un número.

```viml
:echo "12 donuts" + 3
" devuelve 15
```

Cuando Vim ve "12 donuts", extrae el 12 de la cadena y lo convierte en el número 12. Luego realiza la suma, devolviendo 15. Para que esta conversión de cadena a número funcione, el carácter numérico debe ser el *primer carácter* en la cadena.

Lo siguiente no funcionará porque 12 no es el primer carácter en la cadena:

```viml
:echo "donuts 12" + 3
" devuelve 3
```

Esto tampoco funcionará porque un espacio vacío es el primer carácter de la cadena:

```viml
:echo " 12 donuts" + 3
" devuelve 3
```

Esta conversión funciona incluso con dos cadenas:

```shell
:echo "12 donuts" + "6 pastries"
" devuelve 18
```

Esto funciona con cualquier operador aritmético, no solo `+`:

```viml
:echo "12 donuts" * "5 boxes"
" devuelve 60

:echo "12 donuts" - 5
" devuelve 7

:echo "12 donuts" / "3 people"
" devuelve 4
```

Un truco ingenioso para forzar una conversión de cadena a número es simplemente sumar 0 o multiplicar por 1:

```viml
:echo "12" + 0
" devuelve 12

:echo "12" * 1
" devuelve 12
```

Cuando se realiza aritmética contra un flotante en una cadena, Vim lo trata como un entero, no como un flotante:

```shell
:echo "12.0 donuts" + 12
" devuelve 24, no 24.0
```

### Concatenación de Número y Cadena

Puedes convertir un número en una cadena con un operador de punto (`.`):

```viml
:echo 12 . "donuts"
" devuelve "12donuts"
```

La conversión solo funciona con el tipo de dato número, no flotante. Esto no funcionará:

```shell
:echo 12.0 . "donuts"
" no devuelve "12.0donuts" sino que lanza un error
```

### Condicionales de Cadenas

Recuerda que 0 es falso y todos los números no 0 son verdaderos. Esto también es cierto cuando se utilizan cadenas como condicionales.

En la siguiente declaración if, Vim convierte "12donuts" en 12, que es verdadero:

```viml
:if "12donuts"
:  echo "Yum"
:endif
" devuelve "Yum"
```

Por otro lado, esto es falso:

```viml
:if "donuts12"
:  echo "Nope"
:endif
" no devuelve nada
```

Vim convierte "donuts12" en 0, porque el primer carácter no es un número.

### Comillas Dobles vs Comillas Simples

Las comillas dobles se comportan de manera diferente a las comillas simples. Las comillas simples muestran los caracteres literalmente mientras que las comillas dobles aceptan caracteres especiales.

¿Cuáles son los caracteres especiales? Consulta la visualización de nueva línea y comillas dobles:

```viml
:echo "hola\nmundo"
" devuelve
" hola
" mundo

:echo "hola \"mundo\""
" devuelve "hola "mundo""
```

Compara eso con las comillas simples:

```shell
:echo 'hola\nmundo'
" devuelve 'hola\nmundo'

:echo 'hola \"mundo\"'
" devuelve 'hola \"mundo\"'
```

Los caracteres especiales son caracteres de cadena especiales que, cuando se escapan, se comportan de manera diferente. `\n` actúa como una nueva línea. `\"` se comporta como un literal `"`. Para una lista de otros caracteres especiales, consulta `:h expr-quote`.

### Procedimientos de Cadenas

Veamos algunos procedimientos de cadena integrados.

Puedes obtener la longitud de una cadena con `strlen()`.

```shell
:echo strlen("choco")
" devuelve 5
```

Puedes convertir una cadena en un número con `str2nr()`:

```shell
:echo str2nr("12donuts")
" devuelve 12

:echo str2nr("donuts12")
" devuelve 0
```

Similar a la conversión de cadena a número anterior, si el número no es el primer carácter, Vim no lo captará.

La buena noticia es que Vim tiene un método que transforma una cadena en un flotante, `str2float()`:

```shell
:echo str2float("12.5donuts")
" devuelve 12.5
```

Puedes sustituir un patrón en una cadena con el método `substitute()`:

```shell
:echo substitute("dulce", "e", "o", "g")
" devuelve "doolce"
```

El último parámetro, "g", es la bandera global. Con ella, Vim sustituirá todas las ocurrencias coincidentes. Sin ella, Vim solo sustituirá la primera coincidencia.

```shell
:echo substitute("dulce", "e", "o", "")
" devuelve "dulco"
```

El comando de sustitución se puede combinar con `getline()`. Recuerda que la función `getline()` obtiene el texto en el número de línea dado. Supongamos que tienes el texto "donut de chocolate" en la línea 5. Puedes usar el procedimiento:

```shell
:echo substitute(getline(5), "chocolate", "glaseado", "g")
" devuelve donut glaseado
```

Hay muchos otros procedimientos de cadena. Consulta `:h string-functions`.

## Lista

Una lista de Vimscript es como un Array en Javascript o una Lista en Python. Es una secuencia *ordenada* de elementos. Puedes mezclar y combinar el contenido con diferentes tipos de datos:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Sublistas

La lista de Vim es indexada desde cero. Puedes acceder a un elemento particular en una lista con `[n]`, donde n es el índice.

```shell
:echo ["a", "dulce", "postre"][0]
" devuelve "a"

:echo ["a", "dulce", "postre"][2]
" devuelve "postre"
```

Si superas el número máximo de índice, Vim lanzará un error diciendo que el índice está fuera de rango:

```shell
:echo ["a", "dulce", "postre"][999]
" devuelve un error
```

Cuando vas por debajo de cero, Vim comenzará el índice desde el último elemento. Pasar el número mínimo de índice también te lanzará un error:

```shell
:echo ["a", "dulce", "postre"][-1]
" devuelve "postre"

:echo ["a", "dulce", "postre"][-3]
" devuelve "a"

:echo ["a", "dulce", "postre"][-999]
" devuelve un error
```

Puedes "rebanar" varios elementos de una lista con `[n:m]`, donde `n` es el índice de inicio y `m` es el índice final.

```shell
:echo ["chocolate", "glaseado", "simple", "fresa", "limón", "azúcar", "crema"][2:4]
" devuelve ["simple", "fresa", "limón"]
```

Si no pasas `m` (`[n:]`), Vim devolverá el resto de los elementos comenzando desde el enésimo elemento. Si no pasas `n` (`[:m]`), Vim devolverá el primer elemento hasta el m-ésimo elemento.

```shell
:echo ["chocolate", "glaseado", "simple", "fresa", "limón", "azúcar", "crema"][2:]
" devuelve ['simple', 'fresa', 'limón', 'azúcar', 'crema']

:echo ["chocolate", "glaseado", "simple", "fresa", "limón", "azúcar", "crema"][:4]
" devuelve ['chocolate', 'glaseado', 'simple', 'fresa', 'limón']
```

Puedes pasar un índice que exceda el número máximo de elementos al rebanar un arreglo.

```viml
:echo ["chocolate", "glaseado", "simple", "fresa", "limón", "azúcar", "crema"][2:999]
" devuelve ['simple', 'fresa', 'limón', 'azúcar', 'crema']
```
### Cortando Cadenas

Puedes cortar y seleccionar cadenas como listas:

```viml
:echo "choco"[0]
" devuelve "c"

:echo "choco"[1:3]
" devuelve "hoc"

:echo "choco"[:3]
" devuelve choc

:echo "choco"[1:]
" devuelve hoco
```

### Aritmética de Listas

Puedes usar `+` para concatenar y mutar una lista:

```viml
:let sweetList = ["chocolate", "fresa"]
:let sweetList += ["azúcar"]
:echo sweetList
" devuelve ["chocolate", "fresa", "azúcar"]
```

### Funciones de Listas

Exploramos las funciones de listas integradas de Vim.

Para obtener la longitud de una lista, usa `len()`:

```shell
:echo len(["chocolate", "fresa"])
" devuelve 2
```

Para agregar un elemento al principio de una lista, puedes usar `insert()`:

```shell
:let sweetList = ["chocolate", "fresa"]
:call insert(sweetList, "glaseado")

:echo sweetList
" devuelve ["glaseado", "chocolate", "fresa"]
```

También puedes pasar a `insert()` el índice donde quieres agregar el elemento. Si deseas agregar un ítem antes del segundo elemento (índice 1):

```shell
:let sweeterList = ["glaseado", "chocolate", "fresa"]
:call insert(sweeterList, "crema", 1)

:echo sweeterList
" devuelve ['glaseado', 'crema', 'chocolate', 'fresa']
```

Para eliminar un ítem de la lista, usa `remove()`. Acepta una lista y el índice del elemento que deseas eliminar.

```shell
:let sweeterList = ["glaseado", "chocolate", "fresa"]
:call remove(sweeterList, 1)

:echo sweeterList
" devuelve ['glaseado', 'fresa']
```

Puedes usar `map()` y `filter()` en una lista. Para filtrar los elementos que contienen la frase "choco":

```shell
:let sweeterList = ["glaseado", "chocolate", "fresa"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" devuelve ["glaseado", "fresa"]

:let sweetestList = ["chocolate", "glaseado", "azúcar"]
:call map(sweetestList, 'v:val . " dona"')
:echo sweetestList
" devuelve ['chocolate dona', 'glaseado dona', 'azúcar dona']
```

La variable `v:val` es una variable especial de Vim. Está disponible al iterar sobre una lista o un diccionario usando `map()` o `filter()`. Representa cada ítem iterado.

Para más información, consulta `:h list-functions`.

### Desempaquetando Listas

Puedes desempaquetar una lista y asignar variables a los elementos de la lista:

```shell
:let favoriteFlavor = ["chocolate", "glaseado", "natural"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" devuelve "chocolate"

:echo flavor2
" devuelve "glaseado"
```

Para asignar el resto de los elementos de la lista, puedes usar `;` seguido de un nombre de variable:

```shell
:let favoriteFruits = ["manzana", "plátano", "limón", "arándano", "frambuesa"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" devuelve "manzana"

:echo restFruits
" devuelve ['limón', 'arándano', 'frambuesa']
```

### Modificando Listas

Puedes modificar un elemento de la lista directamente:

```shell
:let favoriteFlavor = ["chocolate", "glaseado", "natural"]
:let favoriteFlavor[0] = "azúcar"
:echo favoriteFlavor
" devuelve ['azúcar', 'glaseado', 'natural']
```

Puedes mutar múltiples elementos de la lista directamente:

```shell
:let favoriteFlavor = ["chocolate", "glaseado", "natural"]
:let favoriteFlavor[2:] = ["fresa", "chocolate"]
:echo favoriteFlavor
" devuelve ['chocolate', 'glaseado', 'fresa', 'chocolate']
```

## Diccionario

Un diccionario de Vimscript es una lista asociativa y desordenada. Un diccionario no vacío consiste en al menos un par clave-valor.

```shell
{"desayuno": "waffles", "almuerzo": "pancakes"}
{"comida": ["desayuno", "segundo desayuno", "tercer desayuno"]}
{"cena": 1, "postre": 2}
```

Un objeto de datos de diccionario de Vim usa cadenas como clave. Si intentas usar un número, Vim lo convertirá en una cadena.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" devuelve {'1': '7am', '2': '9am', '11ses': '11am'}
```

Si eres demasiado perezoso para poner comillas alrededor de cada clave, puedes usar la notación `#{}`:

```shell
:let mealPlans = #{desayuno: "waffles", almuerzo: "pancakes", cena: "donuts"}

:echo mealPlans
" devuelve {'almuerzo': 'pancakes', 'desayuno': 'waffles', 'cena': 'donuts'}
```

El único requisito para usar la sintaxis `#{}` es que cada clave debe ser:

- Un carácter ASCII.
- Un dígito.
- Un guion bajo (`_`).
- Un guion (`-`).

Al igual que en la lista, puedes usar cualquier tipo de dato como valores.

```shell
:let mealPlan = {"desayuno": ["pancake", "waffle", "hash brown"], "almuerzo": WhatsForLunch(), "cena": {"entrada": "gruel", "plato principal": "más gruel"}}
```

### Accediendo al Diccionario

Para acceder a un valor de un diccionario, puedes llamar a la clave con corchetes (`['clave']`) o con la notación de punto (`.clave`).

```shell
:let meal = {"desayuno": "gruel omelettes", "almuerzo": "gruel sandwiches", "cena": "más gruel"}

:let desayuno = meal['desayuno']
:let almuerzo = meal.almuerzo

:echo desayuno
" devuelve "gruel omelettes"

:echo almuerzo
" devuelve "gruel sandwiches"
```

### Modificando el Diccionario

Puedes modificar o incluso agregar contenido a un diccionario:

```shell
:let meal = {"desayuno": "gruel omelettes", "almuerzo": "gruel sandwiches"}

:let meal.desayuno = "tacos de desayuno"
:let meal["almuerzo"] = "tacos al pastor"
:let meal["cena"] = "quesadillas"

:echo meal
" devuelve {'almuerzo': 'tacos al pastor', 'desayuno': 'tacos de desayuno', 'cena': 'quesadillas'}
```

### Funciones de Diccionario

Exploramos algunas de las funciones integradas de Vim para manejar diccionarios.

Para verificar la longitud de un diccionario, usa `len()`.

```shell
:let mealPlans = #{desayuno: "waffles", almuerzo: "pancakes", cena: "donuts"}

:echo len(mealPlans)
" devuelve 3
```

Para ver si un diccionario contiene una clave específica, usa `has_key()`.

```shell
:let mealPlans = #{desayuno: "waffles", almuerzo: "pancakes", cena: "donuts"}

:echo has_key(mealPlans, "desayuno")
" devuelve 1

:echo has_key(mealPlans, "postre")
" devuelve 0
```

Para ver si un diccionario tiene algún ítem, usa `empty()`. El procedimiento `empty()` funciona con todos los tipos de datos: lista, diccionario, cadena, número, flotante, etc.

```shell
:let mealPlans = #{desayuno: "waffles", almuerzo: "pancakes", cena: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" devuelve 1

:echo empty(mealPlans)
" devuelve 0
```

Para eliminar una entrada de un diccionario, usa `remove()`.

```shell
:let mealPlans = #{desayuno: "waffles", almuerzo: "pancakes", cena: "donuts"}

:echo "eliminando desayuno: " . remove(mealPlans, "desayuno")
" devuelve "eliminando desayuno: 'waffles'"

:echo mealPlans
" devuelve {'almuerzo': 'pancakes', 'cena': 'donuts'}
```

Para convertir un diccionario en una lista de listas, usa `items()`:

```shell
:let mealPlans = #{desayuno: "waffles", almuerzo: "pancakes", cena: "donuts"}

:echo items(mealPlans)
" devuelve [['almuerzo', 'pancakes'], ['desayuno', 'waffles'], ['cena', 'donuts']]
```

`filter()` y `map()` también están disponibles.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" devuelve {'2': '9am', '11ses': '11am'}
```

Dado que un diccionario contiene pares clave-valor, Vim proporciona la variable especial `v:key` que funciona de manera similar a `v:val`. Al iterar a través de un diccionario, `v:key` contendrá el valor de la clave iterada actualmente.

Si tienes un diccionario `mealPlans`, puedes mapearlo usando `v:key`.

```shell
:let mealPlans = #{desayuno: "waffles", almuerzo: "pancakes", cena: "donuts"}
:call map(mealPlans, 'v:key . " y leche"')

:echo mealPlans
" devuelve {'almuerzo': 'almuerzo y leche', 'desayuno': 'desayuno y leche', 'cena': 'cena y leche'}
```

De manera similar, puedes mapearlo usando `v:val`:

```shell
:let mealPlans = #{desayuno: "waffles", almuerzo: "pancakes", cena: "donuts"}
:call map(mealPlans, 'v:val . " y leche"')

:echo mealPlans
" devuelve {'almuerzo': 'pancakes y leche', 'desayuno': 'waffles y leche', 'cena': 'donuts y leche'}
```

Para ver más funciones de diccionario, consulta `:h dict-functions`.

## Primitivos Especiales

Vim tiene primitivos especiales:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

Por cierto, `v:` es la variable incorporada de Vim. Se cubrirán más en un capítulo posterior.

En mi experiencia, no usarás estos primitivos especiales a menudo. Si necesitas un valor verdadero/falso, puedes simplemente usar 0 (falso) y no 0 (verdadero). Si necesitas una cadena vacía, solo usa `""`. Pero sigue siendo bueno saberlo, así que repasemos rápidamente.

### Verdadero

Esto es equivalente a `true`. Es equivalente a un número con valor diferente de 0. Al decodificar json con `json_encode()`, se interpreta como "true".

```shell
:echo json_encode({"test": v:true})
" devuelve {"test": true}
```

### Falso

Esto es equivalente a `false`. Es equivalente a un número con valor de 0. Al decodificar json con `json_encode()`, se interpreta como "false".

```shell
:echo json_encode({"test": v:false})
" devuelve {"test": false}
```

### Ninguno

Es equivalente a una cadena vacía. Al decodificar json con `json_encode()`, se interpreta como un ítem vacío (`null`).

```shell
:echo json_encode({"test": v:none})
" devuelve {"test": null}
```

### Nulo

Similar a `v:none`.

```shell
:echo json_encode({"test": v:null})
" devuelve {"test": null}
```

## Aprende Tipos de Datos de Manera Inteligente

En este capítulo, aprendiste sobre los tipos de datos básicos de Vimscript: número, flotante, cadena, lista, diccionario y especial. Aprender estos es el primer paso para comenzar a programar en Vimscript.

En el próximo capítulo, aprenderás cómo combinarlos para escribir expresiones como igualdades, condicionales y bucles.