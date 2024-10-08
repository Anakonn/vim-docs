---
description: هذا الفصل يقدم لمحة عامة عن مسارات وقت التشغيل في Vim، وكيفية استخدامها
  لتخصيص وتحسين تجربة المستخدم.
title: Ch24. Vim Runtime
---

في الفصول السابقة، ذكرت أن فيم يبحث تلقائيًا عن مسارات خاصة مثل `pack/` (الفصل 22) و `compiler/` (الفصل 19) داخل دليل `~/.vim/`. هذه أمثلة على مسارات وقت تشغيل فيم.

يمتلك فيم المزيد من مسارات وقت التشغيل غير هذين. في هذا الفصل، ستتعلم نظرة عامة عالية المستوى عن هذه المسارات. الهدف من هذا الفصل هو إظهار متى يتم استدعاؤها. معرفة ذلك سيمكنك من فهم وتخصيص فيم بشكل أكبر.

## مسار وقت التشغيل

في جهاز يونكس، أحد مسارات وقت تشغيل فيم هو `$HOME/.vim/` (إذا كان لديك نظام تشغيل مختلف مثل ويندوز، قد يكون مسارك مختلفًا). لرؤية ما هي مسارات وقت التشغيل لأنظمة التشغيل المختلفة، تحقق من `:h 'runtimepath'`. في هذا الفصل، سأستخدم `~/.vim/` كمسار وقت التشغيل الافتراضي.

## سكريبتات الإضافات

يمتلك فيم مسار وقت تشغيل للإضافات يقوم بتنفيذ أي سكريبتات في هذا الدليل مرة واحدة في كل مرة يبدأ فيها فيم. لا تخلط بين اسم "الإضافة" وإضافات فيم الخارجية (مثل NERDTree، fzf.vim، إلخ).

اذهب إلى دليل `~/.vim/` وأنشئ دليل `plugin/`. أنشئ ملفين: `donut.vim` و `chocolate.vim`.

داخل `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

داخل `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

الآن أغلق فيم. في المرة القادمة التي تبدأ فيها فيم، سترى كل من `"donut!"` و `"chocolate!"` مطبوعتين. يمكن استخدام مسار وقت تشغيل الإضافات لسكريبتات التهيئة.

## كشف نوع الملف

قبل أن تبدأ، لضمان أن هذه الاكتشافات تعمل، تأكد من أن ملف vimrc الخاص بك يحتوي على الأقل على السطر التالي:

```shell
filetype plugin indent on
```

تحقق من `:h filetype-overview` لمزيد من السياق. بشكل أساسي، هذا يشغل كشف نوع الملف في فيم.

عندما تفتح ملفًا جديدًا، يعرف فيم عادةً نوع الملف. إذا كان لديك ملف `hello.rb`، فإن تشغيل `:set filetype?` سيعيد الاستجابة الصحيحة `filetype=ruby`.

يعرف فيم كيفية اكتشاف أنواع الملفات "الشائعة" (روبي، بايثون، جافا سكريبت، إلخ). لكن ماذا لو كان لديك ملف مخصص؟ تحتاج إلى تعليم فيم كيفية اكتشافه وتعيينه مع نوع الملف الصحيح.

هناك طريقتان للاكتشاف: باستخدام اسم الملف ومحتوى الملف.

### كشف اسم الملف

يكشف كشف اسم الملف عن نوع الملف باستخدام اسم ذلك الملف. عندما تفتح ملف `hello.rb`، يعرف فيم أنه ملف روبي من امتداد `.rb`.

هناك طريقتان يمكنك من خلالهما القيام بكشف اسم الملف: باستخدام دليل وقت التشغيل `ftdetect/` واستخدام ملف وقت التشغيل `filetype.vim`. دعنا نستكشف كلاهما.

#### `ftdetect/`

لنقم بإنشاء ملف غامض (لكن لذيذ) ، `hello.chocodonut`. عندما تفتحه وتقوم بتشغيل `:set filetype?`، نظرًا لأنه ليس امتداد اسم ملف شائع، لا يعرف فيم ماذا يفعل به. يعيد `filetype=`.

تحتاج إلى إرشاد فيم لتعيين جميع الملفات التي تنتهي بـ `.chocodonut` كنوع ملف "chocodonut". أنشئ دليلًا باسم `ftdetect/` في الجذر وقت التشغيل (`~/.vim/`). داخل ذلك، أنشئ ملفًا وسمه `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). داخل هذا الملف، أضف:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

يتم تفعيل `BufNewFile` و `BufRead` كلما أنشأت مخزنًا جديدًا وفتحت مخزنًا جديدًا. `*.chocodonut` تعني أن هذا الحدث سيتم تفعيله فقط إذا كان المخزن المفتوح له امتداد اسم ملف `.chocodonut`. أخيرًا، يقوم الأمر `set filetype=chocodonut` بتعيين نوع الملف ليكون من نوع chocodonut.

أعد تشغيل فيم. الآن افتح ملف `hello.chocodonut` وقم بتشغيل `:set filetype?`. سيعيد `filetype=chocodonut`.

لذيذ! يمكنك وضع أي عدد من الملفات التي تريدها داخل `ftdetect/`. في المستقبل، يمكنك ربما إضافة `ftdetect/strawberrydonut.vim`، `ftdetect/plaindonut.vim`، إلخ، إذا قررت يومًا ما توسيع أنواع ملفات الدونات الخاصة بك.

هناك في الواقع طريقتان لتعيين نوع ملف في فيم. واحدة هي ما استخدمته للتو `set filetype=chocodonut`. الطريقة الأخرى هي تشغيل `setfiletype chocodonut`. الأمر الأول `set filetype=chocodonut` سيقوم *دائمًا* بتعيين نوع الملف إلى نوع chocodonut، بينما الأمر الأخير `setfiletype chocodonut` سيقوم بتعيين نوع الملف فقط إذا لم يتم تعيين نوع ملف بعد.

#### ملف نوع الملف

تتطلب طريقة الكشف الثانية أن تقوم بإنشاء `filetype.vim` في الدليل الجذر (`~/.vim/filetype.vim`). أضف هذا داخل:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

أنشئ ملف `hello.plaindonut`. عندما تفتحه وتقوم بتشغيل `:set filetype?`، يعرض فيم نوع الملف المخصص الصحيح `filetype=plaindonut`.

يا له من معجنات، لقد نجح الأمر! بالمناسبة، إذا كنت تلعب حول `filetype.vim`، قد تلاحظ أن هذا الملف يتم تشغيله عدة مرات عندما تفتح `hello.plaindonut`. لمنع ذلك، يمكنك إضافة حارس حتى يتم تشغيل السكريبت الرئيسي مرة واحدة فقط. قم بتحديث `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` هو أمر فيم لإيقاف تشغيل بقية السكريبت. التعبير `"did_load_filetypes"` *ليس* دالة مدمجة في فيم. إنه في الواقع متغير عالمي من داخل `$VIMRUNTIME/filetype.vim`. إذا كنت فضولياً، قم بتشغيل `:e $VIMRUNTIME/filetype.vim`. ستجد هذه الأسطر داخل:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

عندما يستدعي فيم هذا الملف، فإنه يعرف المتغير `did_load_filetypes` ويعينه إلى 1. 1 هو قيمة صحيحة في فيم. يجب عليك قراءة بقية `filetype.vim` أيضًا. انظر إذا كنت تستطيع فهم ما يفعله عندما يستدعيه فيم.

### سكريبت نوع الملف

دعنا نتعلم كيفية اكتشاف وتعيين نوع ملف بناءً على محتوى الملف.

افترض أن لديك مجموعة من الملفات بدون امتداد مقبول. الشيء الوحيد الذي تشترك فيه هذه الملفات هو أنها جميعًا تبدأ بكلمة "donutify" في السطر الأول. تريد تعيين هذه الملفات إلى نوع ملف `donut`. أنشئ ملفات جديدة باسم `sugardonut` و `glazeddonut` و `frieddonut` (بدون امتداد). داخل كل ملف، أضف هذا السطر:

```shell
donutify
```

عندما تقوم بتشغيل `:set filetype?` من داخل `sugardonut`، لا يعرف فيم نوع الملف الذي يجب تعيينه لهذا الملف. يعيد `filetype=`.

في مسار الجذر وقت التشغيل، أضف ملف `scripts.vim` (`~/.vim/scripts.vim`). داخل ذلك، أضف هذه:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

تقوم الدالة `getline(1)` بإرجاع النص في السطر الأول. تتحقق مما إذا كان السطر الأول يبدأ بكلمة "donutify". الدالة `did_filetype()` هي دالة مدمجة في فيم. ستعيد القيمة الصحيحة عندما يتم استدعاء حدث متعلق بنوع الملف مرة واحدة على الأقل. تُستخدم كحارس لمنع إعادة تشغيل حدث نوع الملف.

افتح ملف `sugardonut` وقم بتشغيل `:set filetype?`، سيعيد فيم الآن `filetype=donut`. إذا فتحت ملفات دونات أخرى (`glazeddonut` و `frieddonut`)، سيحدد فيم أيضًا أنواع ملفاتها كنوع `donut`.

لاحظ أن `scripts.vim` يتم تشغيله فقط عندما يفتح فيم ملفًا بنوع ملف غير معروف. إذا فتح فيم ملفًا بنوع ملف معروف، فلن يتم تشغيل `scripts.vim`.

## إضافة نوع الملف

ماذا لو كنت تريد من فيم تشغيل سكريبتات محددة بنوع chocodonut عند فتح ملف chocodonut وعدم تشغيل تلك السكريبتات عند فتح ملف plaindonut؟

يمكنك القيام بذلك باستخدام مسار وقت تشغيل إضافة نوع الملف (`~/.vim/ftplugin/`). يبحث فيم داخل هذا الدليل عن ملف بنفس اسم نوع الملف الذي فتحته للتو. أنشئ ملف `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

أنشئ ملف ftplugin آخر، `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

الآن في كل مرة تفتح فيها نوع ملف chocodonut، يقوم فيم بتشغيل السكريبتات من `~/.vim/ftplugin/chocodonut.vim`. في كل مرة تفتح فيها نوع ملف plaindonut، يقوم فيم بتشغيل السكريبتات من `~/.vim/ftplugin/plaindonut.vim`.

تحذير واحد: يتم تشغيل هذه الملفات في كل مرة يتم فيها تعيين نوع ملف المخزن (`set filetype=chocodonut` على سبيل المثال). إذا فتحت 3 ملفات مختلفة من نوع chocodonut، سيتم تشغيل السكريبتات *إجمالاً* ثلاث مرات.

## ملفات التهيئة

يمتلك فيم مسار وقت تشغيل للتهيئة يعمل بشكل مشابه لـ ftplugin، حيث يبحث فيم عن ملف بنفس اسم نوع الملف المفتوح. الغرض من هذه المسارات هو تخزين الأكواد المتعلقة بالتهيئة. إذا كان لديك ملف `~/.vim/indent/chocodonut.vim`، فسيتم تنفيذه فقط عند فتح نوع ملف chocodonut. يمكنك تخزين الأكواد المتعلقة بالتهيئة لملفات chocodonut هنا.

## الألوان

يمتلك فيم مسار وقت تشغيل للألوان (`~/.vim/colors/`) لتخزين أنظمة الألوان. أي ملف يدخل داخل الدليل سيتم عرضه في أمر سطر الأوامر `:color`.

إذا كان لديك ملف `~/.vim/colors/beautifulprettycolors.vim`، عندما تقوم بتشغيل `:color` وتضغط على Tab، سترى `beautifulprettycolors` كواحد من خيارات الألوان. إذا كنت تفضل إضافة نظام ألوان خاص بك، فهذا هو المكان المناسب.

إذا كنت ترغب في الاطلاع على أنظمة الألوان التي صنعها الآخرون، فإن مكانًا جيدًا للزيارة هو [vimcolors](https://vimcolors.com/).

## تمييز الصيغة

يمتلك فيم مسار وقت تشغيل للتمييز (`~/.vim/syntax/`) لتعريف تمييز الصيغة.

افترض أن لديك ملف `hello.chocodonut`، بداخله لديك التعبيرات التالية:

```shell
(donut "tasty")
(donut "savory")
```

على الرغم من أن فيم يعرف الآن نوع الملف الصحيح، إلا أن جميع النصوص لها نفس اللون. دعنا نضيف قاعدة تمييز صيغة لتسليط الضوء على كلمة "donut". أنشئ ملف تمييز صيغة جديد لـ chocodonut، `~/.vim/syntax/chocodonut.vim`. داخل ذلك، أضف:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

الآن أعد فتح ملف `hello.chocodonut`. أصبحت كلمات `donut` الآن مميزة.

لن يتناول هذا الفصل تمييز الصيغة بعمق. إنه موضوع واسع. إذا كنت فضولياً، تحقق من `:h syntax.txt`.

الإضافة [vim-polyglot](https://github.com/sheerun/vim-polyglot) هي إضافة رائعة توفر تمييزات للعديد من لغات البرمجة الشائعة.

## الوثائق

إذا قمت بإنشاء إضافة، سيتعين عليك إنشاء وثائق خاصة بك. تستخدم مسار وقت تشغيل doc لذلك.

دعنا ننشئ وثائق أساسية لكلمات chocodonut و plaindonut. أنشئ ملف `donut.txt` (`~/.vim/doc/donut.txt`). داخل، أضف هذه النصوص:

```shell
*chocodonut* Delicious chocolate donut

*plaindonut* No choco goodness but still delicious nonetheless
```

إذا حاولت البحث عن `chocodonut` و `plaindonut` (`:h chocodonut` و `:h plaindonut`)، فلن تجد شيئًا.

أولاً، تحتاج إلى تشغيل `:helptags` لإنشاء إدخالات مساعدة جديدة. قم بتشغيل `:helptags ~/.vim/doc/`

الآن إذا قمت بتشغيل `:h chocodonut` و `:h plaindonut`، ستجد هذه الإدخالات الجديدة. لاحظ أن الملف الآن للقراءة فقط وله نوع ملف "مساعدة".
## تحميل البرامج بشكل كسول

جميع مسارات وقت التشغيل التي تعلمتها في هذا الفصل تم تشغيلها تلقائيًا. إذا كنت تريد تحميل برنامج نصي يدويًا، استخدم مسار وقت التشغيل التلقائي.

قم بإنشاء دليل تحميل تلقائي (`~/.vim/autoload/`). داخل هذا الدليل، أنشئ ملفًا جديدًا وسمه `tasty.vim` (`~/.vim/autoload/tasty.vim`). بداخله:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

لاحظ أن اسم الدالة هو `tasty#donut`، وليس `donut()`. علامة الجنيه (`#`) مطلوبة عند استخدام ميزة التحميل التلقائي. قاعدة تسمية الدوال لميزة التحميل التلقائي هي:

```shell
function fileName#functionName()
  ...
endfunction
```

في هذه الحالة، اسم الملف هو `tasty.vim` واسم الدالة هو (تقنيًا) `donut`.

لاستدعاء دالة، تحتاج إلى أمر `call`. دعنا نستدعي تلك الدالة باستخدام `:call tasty#donut()`.

في المرة الأولى التي تستدعي فيها الدالة، يجب أن ترى *كلا* رسالتي الإخراج ("tasty.vim global" و "tasty#donut"). الاستدعاءات اللاحقة لدالة `tasty#donut` ستعرض فقط رسالة الإخراج "testy#donut".

عند فتح ملف في Vim، على عكس مسارات وقت التشغيل السابقة، لا يتم تحميل البرامج النصية التلقائية تلقائيًا. فقط عندما تستدعي صراحةً `tasty#donut()`، يبحث Vim عن ملف `tasty.vim` ويقوم بتحميل كل ما بداخله، بما في ذلك دالة `tasty#donut()`. التحميل التلقائي هو الآلية المثالية للدوال التي تستخدم موارد كبيرة ولكنك لا تستخدمها كثيرًا.

يمكنك إضافة العديد من الأدلة المتداخلة مع التحميل التلقائي كما تريد. إذا كان لديك مسار وقت التشغيل `~/.vim/autoload/one/two/three/tasty.vim`، يمكنك استدعاء الدالة باستخدام `:call one#two#three#tasty#donut()`.

## بعد البرامج النصية

يمتلك Vim مسار وقت تشغيل بعدي (`~/.vim/after/`) يعكس هيكل `~/.vim/`. أي شيء في هذا المسار يتم تنفيذه في النهاية، لذا عادةً ما يستخدم المطورون هذه المسارات لتجاوز البرامج النصية.

على سبيل المثال، إذا كنت تريد تجاوز البرامج النصية من `plugin/chocolate.vim`، يمكنك إنشاء `~/.vim/after/plugin/chocolate.vim` لوضع برامج النصية البديلة. سيقوم Vim بتشغيل `~/.vim/after/plugin/chocolate.vim` *بعد* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

يمتلك Vim متغير بيئة `$VIMRUNTIME` للبرامج النصية الافتراضية وملفات الدعم. يمكنك التحقق منه عن طريق تشغيل `:e $VIMRUNTIME`.

يجب أن يبدو الهيكل مألوفًا. يحتوي على العديد من مسارات وقت التشغيل التي تعلمتها في هذا الفصل.

تذكر في الفصل 21، أنك تعلمت أنه عند فتح Vim، يبحث عن ملفات vimrc في سبع مواقع مختلفة. قلت إن آخر موقع يتحقق منه Vim هو `$VIMRUNTIME/defaults.vim`. إذا فشل Vim في العثور على أي ملفات vimrc للمستخدم، يستخدم `defaults.vim` كـ vimrc.

هل جربت يومًا تشغيل Vim بدون مكون إضافي للترميز مثل vim-polyglot ومع ذلك لا يزال ملفك مميزًا نحويًا؟ ذلك لأن عندما يفشل Vim في العثور على ملف ترميز من مسار وقت التشغيل، يبحث Vim عن ملف ترميز من دليل ترميز `$VIMRUNTIME`.

للتعرف على المزيد، تحقق من `:h $VIMRUNTIME`.

## خيار Runtimepath

للتحقق من مسار وقت التشغيل الخاص بك، قم بتشغيل `:set runtimepath?`

إذا كنت تستخدم Vim-Plug أو مديري المكونات الإضافية الخارجيين الشائعين، يجب أن يعرض قائمة بالأدلة. على سبيل المثال، تظهر قائمتي:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

إحدى الأشياء التي يقوم بها مدراء المكونات الإضافية هي إضافة كل مكون إضافي إلى مسار وقت التشغيل. يمكن أن يحتوي كل مسار وقت تشغيل على هيكل دليل خاص به مشابه لـ `~/.vim/`.

إذا كان لديك دليل `~/box/of/donuts/` وترغب في إضافة هذا الدليل إلى مسار وقت التشغيل الخاص بك، يمكنك إضافة هذا إلى vimrc الخاص بك:

```shell
set rtp+=$HOME/box/of/donuts/
```

إذا كان داخل `~/box/of/donuts/`، لديك دليل مكون إضافي (`~/box/of/donuts/plugin/hello.vim`) وملف ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`)، سيقوم Vim بتشغيل جميع البرامج النصية من `plugin/hello.vim` عند فتح Vim. سيقوم Vim أيضًا بتشغيل `ftplugin/chocodonut.vim` عند فتح ملف chocodonut.

جرب ذلك بنفسك: أنشئ مسارًا عشوائيًا وأضفه إلى مسار وقت التشغيل الخاص بك. أضف بعض مسارات وقت التشغيل التي تعلمتها من هذا الفصل. تأكد من أنها تعمل كما هو متوقع.

## تعلم Runtime بطريقة ذكية

خذ وقتك في قراءة ذلك واللعب مع هذه المسارات. لرؤية كيفية استخدام مسارات وقت التشغيل في العالم الحقيقي، انتقل إلى مستودع أحد مكونات Vim المفضلة لديك وادرس هيكل دليلها. يجب أن تكون قادرًا على فهم معظمها الآن. حاول متابعة الأمر واستنباط الصورة الكبيرة. الآن بعد أن فهمت هيكل دليل Vim، أنت مستعد لتعلم Vimscript.