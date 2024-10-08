---
description: В этом документе вы узнаете, как использовать теги Vim для быстрого перехода
  к определениям в коде, облегчая понимание новых кодовых баз.
title: Ch16. Tags
---

Одной из полезных функций в текстовом редакторе является возможность быстро переходить к любому определению. В этой главе вы научитесь использовать теги Vim для этого.

## Обзор тегов

Предположим, кто-то передал вам новый код:

```shell
one = One.new
one.donut
```

`One`? `donut`? Ну, это могло быть очевидно для разработчиков, писавших код тогда, но теперь этих разработчиков здесь нет, и вам предстоит разобраться с этими непонятными кодами. Один из способов помочь понять это — следовать исходному коду, где определены `One` и `donut`.

Вы можете искать их с помощью `fzf` или `grep` (или `vimgrep`), но в этом случае теги быстрее.

Думайте о тегах как о адресной книге:

```shell
Name    Address
Iggy1   1234 Cool St, 11111
Iggy2   9876 Awesome Ave, 2222
```

Вместо пары имя-адрес теги хранят определения, связанные с адресами.

Допустим, у вас есть два файла Ruby в одной директории:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "Bar"
  end
end
```

и

```shell
## two.rb
require './one'

one = One.new
one.donut
```

Чтобы перейти к определению, вы можете использовать `Ctrl-]` в нормальном режиме. Внутри `two.rb`, перейдите к строке, где `one.donut`, и переместите курсор на `donut`. Нажмите `Ctrl-]`.

Упс, Vim не смог найти файл тегов. Вам нужно сначала сгенерировать файл тегов.

## Генератор тегов

Современный Vim не поставляется с генератором тегов, поэтому вам придется скачать внешний генератор тегов. Есть несколько вариантов на выбор:

- ctags = только C. Доступен почти повсюду.
- exuberant ctags = один из самых популярных. Поддерживает множество языков.
- universal ctags = аналог exuberant ctags, но новее.
- etags = для Emacs. Хм...
- JTags = Java
- ptags.py = Python
- ptags = Perl
- gnatxref = Ada

Если вы посмотрите на учебники по Vim в интернете, многие будут рекомендовать [exuberant ctags](http://ctags.sourceforge.net/). Он поддерживает [41 язык программирования](http://ctags.sourceforge.net/languages.html). Я использовал его, и он отлично работал. Однако, поскольку он не поддерживается с 2009 года, Universal ctags будет лучшим выбором. Он работает аналогично exuberant ctags и в настоящее время поддерживается.

Я не буду углубляться в детали установки universal ctags. Ознакомьтесь с репозиторием [universal ctags](https://github.com/universal-ctags/ctags) для получения дополнительных инструкций.

Предположим, что у вас установлен universal ctags, давайте сгенерируем базовый файл тегов. Запустите:

```shell
ctags -R .
```

Опция `R` указывает ctags выполнить рекурсивный скан из вашего текущего местоположения (`.`). Вы должны увидеть файл `tags` в вашей текущей директории. Внутри вы увидите что-то вроде этого:

```shell
!_TAG_FILE_FORMAT	2	/extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED	1	/0=unsorted, 1=sorted, 2=foldcase/
!_TAG_OUTPUT_FILESEP	slash	/slash or backslash/
!_TAG_OUTPUT_MODE	u-ctags	/u-ctags or e-ctags/
!_TAG_PATTERN_LENGTH_LIMIT	96	/0 for no limit/
!_TAG_PROGRAM_AUTHOR	Universal Ctags Team	//
!_TAG_PROGRAM_NAME	Universal Ctags	/Derived from Exuberant Ctags/
!_TAG_PROGRAM_URL	<https://ctags.io/>	/official site/
!_TAG_PROGRAM_VERSION	0.0.0	/b43eb39/
One	one.rb	/^class One$/;"	c
donut	one.rb	/^  def donut$/;"	f	class:One
initialize	one.rb	/^  def initialize$/;"	f	class:One
```

Ваш файл может выглядеть немного иначе в зависимости от ваших настроек Vim и генератора тегов. Файл тегов состоит из двух частей: метаданных тегов и списка тегов. Эти метаданные (`!TAG_FILE...`) обычно контролируются генератором тегов. Я не буду обсуждать это здесь, но не стесняйтесь проверять их документацию для получения дополнительной информации! Список тегов — это список всех определений, индексированных ctags.

Теперь перейдите к `two.rb`, поставьте курсор на `donut` и введите `Ctrl-]`. Vim перенаправит вас в файл `one.rb` на строку, где `def donut`. Успех! Но как Vim это сделал?

## Анатомия тегов

Давайте посмотрим на элемент тега `donut`:

```shell
donut	one.rb	/^  def donut$/;"	f	class:One
```

Вышеуказанный элемент тега состоит из четырех компонентов: `tagname`, `tagfile`, `tagaddress` и опций тегов.
- `donut` — это `tagname`. Когда ваш курсор находится на "donut", Vim ищет в файле тегов строку, содержащую строку "donut".
- `one.rb` — это `tagfile`. Vim ищет файл `one.rb`.
- `/^ def donut$/` — это `tagaddress`. `/.../` — это индикатор шаблона. `^` — это шаблон для первого элемента в строке. За ним следуют два пробела, затем строка `def donut`. Наконец, `$` — это шаблон для последнего элемента в строке.
- `f class:One` — это опция тега, которая говорит Vim, что функция `donut` является функцией (`f`) и является частью класса `One`.

Давайте посмотрим на другой элемент в списке тегов:

```shell
One	one.rb	/^class One$/;"	c
```

Эта строка работает так же, как и шаблон `donut`:

- `One` — это `tagname`. Обратите внимание, что при работе с тегами первый поиск чувствителен к регистру. Если у вас есть `One` и `one` в списке, Vim будет отдавать предпочтение `One` над `one`.
- `one.rb` — это `tagfile`. Vim ищет файл `one.rb`.
- `/^class One$/` — это шаблон `tagaddress`. Vim ищет строку, которая начинается с (`^`) `class` и заканчивается (`$`) `One`.
- `c` — это одна из возможных опций тегов. Поскольку `One` является классом Ruby, а не процедурой, он отмечается как `c`.

В зависимости от того, какой генератор тегов вы используете, содержимое вашего файла тегов может выглядеть по-разному. Минимум, файл тегов должен иметь один из этих форматов:

```shell
1.  {tagname} {TAB} {tagfile} {TAB} {tagaddress}
2.  {tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
```

## Файл тегов

Вы узнали, что новый файл `tags` создается после выполнения `ctags -R .`. Как Vim знает, где искать файл тегов?

Если вы выполните `:set tags?`, вы можете увидеть `tags=./tags,tags` (в зависимости от ваших настроек Vim, это может быть иначе). Здесь Vim ищет все теги в пути текущего файла в случае `./tags` и в текущей директории (корне проекта) в случае `tags`.

Также в случае `./tags` Vim сначала будет искать файл тегов внутри пути вашего текущего файла, независимо от того, насколько он вложен, затем он будет искать файл тегов в текущей директории (корне проекта). Vim останавливается после того, как находит первое совпадение.

Если ваш файл `'tags'` говорил бы `tags=./tags,tags,/user/iggy/mytags/tags`, то Vim также будет искать файл тегов в директории `/user/iggy/mytags` после того, как закончит поиск в директориях `./tags` и `tags`. Вам не обязательно хранить файл тегов внутри вашего проекта, вы можете хранить их отдельно.

Чтобы добавить новое местоположение файла тегов, используйте следующее:

```shell
set tags+=path/to/my/tags/file
```

## Генерация тегов для большого проекта

Если вы попытаетесь запустить ctags в большом проекте, это может занять много времени, потому что Vim также смотрит во все вложенные директории. Если вы разработчик Javascript, вы знаете, что `node_modules` может быть очень большим. Представьте, если у вас есть пять подпроектов, и каждый из них содержит свою собственную директорию `node_modules`. Если вы запустите `ctags -R .`, ctags попытается просканировать все 5 `node_modules`. Вам, вероятно, не нужно запускать ctags на `node_modules`.

Чтобы запустить ctags, исключая `node_modules`, выполните:

```shell
ctags -R --exclude=node_modules .
```

На этот раз это должно занять менее секунды. Кстати, вы можете использовать опцию `exclude` несколько раз:

```shell
ctags -R --exclude=.git --exclude=vendor --exclude=node_modules --exclude=db --exclude=log .
```

Суть в том, что если вы хотите исключить директорию, `--exclude` — ваш лучший друг.

## Навигация по тегам

Вы можете получить хорошую отдачу, используя только `Ctrl-]`, но давайте изучим еще несколько трюков. Клавиша перехода по тегам `Ctrl-]` имеет альтернативу в командной строке: `:tag {tag-name}`. Если вы выполните:

```shell
:tag donut
```

Vim перейдет к методу `donut`, так же как и при нажатии `Ctrl-]` на строке "donut". Вы также можете автозаполнить аргумент с помощью `<Tab>`:

```shell
:tag d<Tab>
```

Vim перечислит все теги, которые начинаются с "d". В этом случае — "donut".

В реальном проекте вы можете столкнуться с несколькими методами с одинаковым именем. Давайте обновим два файла Ruby из предыдущего примера. Внутри `one.rb`:

```shell
## one.rb
class One
  def initialize
    puts "Initialized"
  end

  def donut
    puts "one donut"
  end

  def pancake
    puts "one pancake"
  end
end
```

Внутри `two.rb`:

```shell
## two.rb
require './one.rb'

def pancake
  "Two pancakes"
end

one = One.new
one.donut
puts pancake
```

Если вы кодируете вместе, не забудьте снова запустить `ctags -R .`, так как у вас теперь несколько новых процедур. У вас есть два экземпляра процедуры `pancake`. Если вы находитесь внутри `two.rb` и нажмете `Ctrl-]`, что произойдет?

Vim перейдет к `def pancake` внутри `two.rb`, а не к `def pancake` внутри `one.rb`. Это связано с тем, что Vim рассматривает процедуру `pancake` внутри `two.rb` как имеющую более высокий приоритет, чем другая процедура `pancake`.

## Приоритет тегов

Не все теги равны. Некоторые теги имеют более высокий приоритет. Если Vim сталкивается с дублирующимися именами элементов, он проверяет приоритет ключевого слова. Порядок таков:

1. Полностью совпадающий статический тег в текущем файле.
2. Полностью совпадающий глобальный тег в текущем файле.
3. Полностью совпадающий глобальный тег в другом файле.
4. Полностью совпадающий статический тег в другом файле.
5. Статический тег, совпадающий по регистронезависимому совпадению в текущем файле.
6. Глобальный тег, совпадающий по регистронезависимому совпадению в текущем файле.
7. Глобальный тег, совпадающий по регистронезависимому совпадению в другом файле.
8. Статический тег, совпадающий по регистронезависимому совпадению в текущем файле.

Согласно списку приоритетов, Vim отдает предпочтение точному совпадению, найденному в одном и том же файле. Вот почему Vim выбирает процедуру `pancake` внутри `two.rb` вместо процедуры `pancake` внутри `one.rb`. Есть некоторые исключения из списка приоритетов в зависимости от ваших настроек `'tagcase'`, `'ignorecase'` и `'smartcase'`, но я не буду обсуждать их здесь. Если вам интересно, ознакомьтесь с `:h tag-priority`.

## Выборочные переходы по тегам

Было бы неплохо, если бы вы могли выбирать, к каким элементам тегов переходить, вместо того чтобы всегда переходить к элементу с самым высоким приоритетом. Возможно, вам действительно нужно перейти к методу `pancake` в `one.rb`, а не к тому, что в `two.rb`. Для этого вы можете использовать `:tselect`. Запустите:

```shell
:tselect pancake
```

Вы увидите внизу экрана:
## pri kind tag               file
1 F C f    pancake           two.rb
             def pancake
2 F   f    pancake           one.rb
             class:One
             def pancake
```

Если вы наберете 2, Vim перейдет к процедуре в `one.rb`. Если вы наберете 1, Vim перейдет к процедуре в `two.rb`.

Обратите внимание на столбец `pri`. У вас есть `F C` в первом совпадении и `F` во втором совпадении. Это то, что Vim использует для определения приоритета тега. `F C` означает полностью совпадающий (`F`) глобальный тег в текущем (`C`) файле. `F` означает только полностью совпадающий (`F`) глобальный тег. `F C` всегда имеет более высокий приоритет, чем `F`.

Если вы выполните `:tselect donut`, Vim также предложит вам выбрать, к какому элементу тега перейти, даже если есть только один вариант на выбор. Есть ли способ для Vim предложить список тегов только в случае нескольких совпадений и немедленно перейти, если найден только один тег?

Конечно! У Vim есть метод `:tjump`. Выполните:

```shell
:tjump donut
```

Vim немедленно перейдет к процедуре `donut` в `one.rb`, как и при выполнении `:tag donut`. Теперь выполните:

```shell
:tjump pancake
```

Vim предложит вам варианты тегов для выбора, как при выполнении `:tselect pancake`. С помощью `tjump` вы получаете лучшее из обоих методов.

У Vim есть клавиша нормального режима для `tjump`: `g Ctrl-]`. Лично мне больше нравится `g Ctrl-]`, чем `Ctrl-]`.

## Автозаполнение с помощью тегов

Теги могут помочь в автозаполнении. Вспомните из главы 6, Режим вставки, что вы можете использовать подрежим `Ctrl-X` для выполнения различных автозаполнений. Один подрежим автозаполнения, который я не упоминал, это `Ctrl-]`. Если вы выполните `Ctrl-X Ctrl-]`, находясь в режиме вставки, Vim будет использовать файл тегов для автозаполнения.

Если вы перейдете в режим вставки и наберете `Ctrl-x Ctrl-]`, вы увидите:

```shell
One
donut
initialize
pancake
```

## Стек тегов

Vim хранит список всех тегов, к которым вы переходили, в стеке тегов. Вы можете увидеть этот стек с помощью `:tags`. Если вы сначала перешли к тегу `pancake`, затем к `donut`, и выполнили `:tags`, вы увидите:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  ch16_tags/two.rb
  2  1 donut               9  ch16_tags/two.rb
>
```

Обратите внимание на символ `>`, который показывает ваше текущее положение в стеке. Чтобы "извлечь" стек и вернуться к одному предыдущему элементу стека, вы можете выполнить `:pop`. Попробуйте это, затем выполните `:tags` снова:

```shell
  # TO tag         FROM line  in file/text
  1  1 pancake            10  puts pancake
> 2  1 donut               9  one.donut

```

Обратите внимание, что символ `>` теперь находится на второй строке, где `donut`. Извлеките еще раз, затем выполните `:tags` снова:

```shell
  # TO tag         FROM line  in file/text
> 1  1 pancake            10  puts pancake
  2  1 donut               9  one.donut
```

В нормальном режиме вы можете выполнить `Ctrl-t`, чтобы достичь того же эффекта, что и `:pop`.

## Автоматическая генерация тегов

Одним из самых больших недостатков тегов Vim является то, что каждый раз, когда вы вносите значительные изменения, вам нужно регенерировать файл тегов. Если вы недавно переименовали процедуру `pancake` в процедуру `waffle`, файл тегов не знал, что процедура `pancake` была переименована. Он все еще хранил `pancake` в списке тегов. Вам нужно выполнить `ctags -R .`, чтобы создать обновленный файл тегов. Воссоздание нового файла тегов таким образом может быть громоздким.

К счастью, есть несколько методов, которые вы можете использовать для автоматической генерации тегов.

## Генерация тега при сохранении

Vim имеет метод автокоманды (`autocmd`), чтобы выполнять любую команду при срабатывании события. Вы можете использовать это для генерации тегов при каждом сохранении. Выполните:

```shell
:autocmd BufWritePost *.rb silent !ctags -R .
```

Разбор:
- `autocmd` — это команда командной строки. Она принимает событие, шаблон файла и команду.
- `BufWritePost` — это событие для сохранения буфера. Каждый раз, когда вы сохраняете файл, вы вызываете событие `BufWritePost`.
- `.rb` — это шаблон файла для файлов ruby.
- `silent` на самом деле является частью команды, которую вы передаете. Без этого Vim будет отображать `нажмите ENTER или введите команду, чтобы продолжить` каждый раз, когда вы вызываете автокоманду.
- `!ctags -R .` — это команда для выполнения. Напомню, что `!cmd` изнутри Vim выполняет команду терминала.

Теперь каждый раз, когда вы сохраняете файл ruby, Vim будет выполнять `ctags -R .`.

## Использование плагинов

Существует несколько плагинов для автоматической генерации ctags:

- [vim-gutentags](https://github.com/ludovicchabant/vim-gutentags)
- [vim-tags](https://github.com/szw/vim-tags)
- [vim-easytags](https://github.com/xolox/vim-easytags)
- [vim-autotag](https://github.com/craigemery/vim-autotag)

Я использую vim-gutentags. Он прост в использовании и будет работать сразу после установки.

## Ctags и хуки Git

Тим Поуп, автор многих отличных плагинов Vim, написал в блоге о том, как использовать хуки git. [Проверьте это](https://tbaggery.com/2011/08/08/effortless-ctags-with-git.html).

## Учите теги умным способом

Тег полезен, когда он правильно настроен. Предположим, вы столкнулись с новым кодом и хотите понять, что делает `functionFood`, вы можете легко прочитать его, перейдя к его определению. Внутри вы узнаете, что он также вызывает `functionBreakfast`. Вы следуете за ним и узнаете, что он вызывает `functionPancake`. Ваша графическая схема вызовов функций выглядит примерно так:

```shell
functionFood -> functionBreakfast -> functionPancake
```

Это дает вам понимание того, что этот поток кода связан с тем, чтобы поесть блинчики на завтрак.

Чтобы узнать больше о тегах, ознакомьтесь с `:h tags`. Теперь, когда вы знаете, как использовать теги, давайте исследуем другую функцию: сворачивание.