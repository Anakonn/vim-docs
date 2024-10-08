---
description: В этом документе вы узнаете, как использовать команду точки в Vim для
  быстрого повторения изменений и упрощения редактирования текста.
title: Ch07. the Dot Command
---

В общем, вам следует стараться избегать повторения того, что вы только что сделали, когда это возможно. В этой главе вы узнаете, как использовать команду точки для легкого повторения последнего изменения. Это универсальная команда для сокращения простых повторений.

## Использование

Как и следует из названия, вы можете использовать команду точки, нажав клавишу точки (`.`).

Например, если вы хотите заменить все "let" на "const" в следующих выражениях:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Найдите с помощью `/let`, чтобы перейти к совпадению.
- Измените с помощью `cwconst<Esc>`, чтобы заменить "let" на "const".
- Перейдите с помощью `n`, чтобы найти следующее совпадение, используя предыдущий поиск.
- Повторите то, что вы только что сделали, с помощью команды точки (`.`).
- Продолжайте нажимать `n . n .`, пока не замените каждое слово.

Здесь команда точки повторила последовательность `cwconst<Esc>`. Это избавило вас от необходимости набирать восемь нажатий клавиш в обмен на одно.

## Что такое изменение?

Если вы посмотрите на определение команды точки (`:h .`), то увидите, что команда точки повторяет последнее изменение. Что такое изменение?

Каждый раз, когда вы обновляете (добавляете, изменяете или удаляете) содержимое текущего буфера, вы вносите изменение. Исключения составляют обновления, выполненные с помощью команд командной строки (команды, начинающиеся с `:`), которые не считаются изменением.

В первом примере `cwconst<Esc>` было изменением. Теперь предположим, что у вас есть следующий текст:

```shell
pancake, potatoes, fruit-juice,
```

Чтобы удалить текст от начала строки до следующего вхождения запятой, сначала удалите до запятой, затем повторите дважды с помощью `df,..`.

Попробуем другой пример:

```shell
pancake, potatoes, fruit-juice,
```

На этот раз ваша задача — удалить запятую, а не предметы завтрака. С курсором в начале строки перейдите к первой запятой, удалите ее, затем повторите еще дважды с помощью `f,x..`. Легко, правда? Подождите минуту, это не сработало! Почему?

Изменение исключает движения, потому что оно не обновляет содержимое буфера. Команда `f,x` состояла из двух действий: команды `f,` для перемещения курсора к "," и `x` для удаления символа. Только последнее, `x`, вызвало изменение. В отличие от `df,` из предыдущего примера. В нем `f,` является директивой для оператора удаления `d`, а не движением для перемещения курсора. `f,` в `df,` и `f,x` имеют две совершенно разные роли.

Давайте завершим последнюю задачу. После того как вы выполните `f,`, затем `x`, перейдите к следующей запятой с помощью `;`, чтобы повторить последнее `f`. Наконец, используйте `.` для удаления символа под курсором. Повторяйте `; . ; .`, пока все не будет удалено. Полная команда — `f,x;.;.`.

Попробуем еще один пример:

```shell
pancake
potatoes
fruit-juice
```

Давайте добавим запятую в конце каждой строки. Начав с первой строки, выполните `A,<Esc>j`. Теперь вы понимаете, что `j` не вызывает изменения. Изменение здесь только `A,`. Вы можете перемещаться и повторять изменение с помощью `j . j .`. Полная команда — `A,<Esc>j.j.`.

Каждое действие с момента нажатия оператора команды вставки (`A`) до выхода из команды вставки (`<Esc>`) считается изменением.

## Многострочное повторение

Предположим, у вас есть следующий текст:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Ваша цель — удалить все строки, кроме строки "foo". Сначала удалите первые три строки с помощью `d2j`, затем перейдите к строке ниже строки "foo". На следующей строке используйте команду точки дважды. Полная команда — `d2jj..`.

Здесь изменение было `d2j`. В этом контексте `2j` не было движением, а частью оператора удаления.

Давайте посмотрим на другой пример:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Давайте удалим все z. Начав с первого символа на первой строке, визуально выберите только первый z из первых трех строк с помощью блочного визуального режима (`Ctrl-Vjj`). Если вы не знакомы с блочным визуальным режимом, я расскажу об этом в следующей главе. Как только вы визуально выберете три z, удалите их с помощью оператора удаления (`d`). Затем перейдите к следующему слову (`w`) к следующему z. Повторите изменение еще дважды (`..`). Полная команда — `Ctrl-vjjdw..`.

Когда вы удалили столбец из трех z (`Ctrl-vjjd`), это было засчитано как изменение. Операция в визуальном режиме может быть использована для нацеливания на несколько строк как часть изменения.

## Включение движения в изменение

Давайте вернемся к первому примеру в этой главе. Напомню, что команда `/letcwconst<Esc>`, за которой следовали `n . n .`, заменила все "let" на "const" в следующих выражениях:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Существует более быстрый способ сделать это. После того как вы выполнили поиск `/let`, выполните `cgnconst<Esc>`, затем `. .`.

`gn` — это движение, которое ищет вперед по последнему шаблону поиска (в данном случае `/let`) и автоматически выделяет его визуально. Чтобы заменить следующее вхождение, вам больше не нужно перемещаться и повторять изменение (`n . n .`), а только повторять (`. .`). Вам больше не нужно использовать поисковые движения, потому что поиск следующего совпадения теперь является частью изменения!

Когда вы редактируете, всегда следите за движениями, которые могут выполнять несколько действий одновременно, такими как `gn`, когда это возможно.

## Учите команду точки умным способом

Сила команды точки заключается в замене нескольких нажатий клавиш на одно. Вероятно, это невыгодная сделка использовать команду точки для операций с одной клавишей, таких как `x`. Если ваше последнее изменение требует сложной операции, такой как `cgnconst<Esc>`, команда точки сокращает девять нажатий клавиш до одного, что является очень выгодным обменом.

При редактировании думайте о повторяемости. Например, если мне нужно удалить следующие три слова, выгоднее использовать `d3w` или сделать `dw`, а затем `.` два раза? Будете ли вы снова удалять слово? Если да, то имеет смысл использовать `dw` и повторять его несколько раз, вместо `d3w`, потому что `dw` более универсально, чем `d3w`.

Команда точки — это универсальная команда для автоматизации одиночных изменений. В следующей главе вы узнаете, как автоматизировать более сложные действия с помощью макросов Vim. Но сначала давайте изучим регистры для хранения и извлечения текста.