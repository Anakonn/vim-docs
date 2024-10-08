---
description: تعلم كيفية استخدام أمر النقطة في فيم لتكرار التغييرات بسهولة، مما يوفر
  الوقت والجهد في تحرير النصوص.
title: Ch07. the Dot Command
---

بشكل عام، يجب أن تحاول تجنب إعادة ما قمت به للتو كلما كان ذلك ممكنًا. في هذا الفصل، ستتعلم كيفية استخدام أمر النقطة لإعادة التغيير السابق بسهولة. إنه أمر متعدد الاستخدامات لتقليل التكرارات البسيطة.

## الاستخدام

تمامًا كما يشير اسمه، يمكنك استخدام أمر النقطة بالضغط على مفتاح النقطة (`.`).

على سبيل المثال، إذا كنت ترغب في استبدال جميع "let" بـ "const" في التعبيرات التالية:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- ابحث باستخدام `/let` للانتقال إلى المطابقة.
- غير باستخدام `cwconst<Esc>` لاستبدال "let" بـ "const".
- تنقل باستخدام `n` للعثور على المطابقة التالية باستخدام البحث السابق.
- كرر ما قمت به للتو باستخدام أمر النقطة (`.`).
- استمر في الضغط على `n . n .` حتى تستبدل كل كلمة.

هنا، قام أمر النقطة بتكرار تسلسل `cwconst<Esc>`. لقد أنقذك من كتابة ثمانية ضغطات مفاتيح مقابل واحدة فقط.

## ما هو التغيير؟

إذا نظرت إلى تعريف أمر النقطة (`:h .`)، فإنه يقول إن أمر النقطة يكرر آخر تغيير. ما هو التغيير؟

في أي وقت تقوم فيه بتحديث (إضافة، تعديل، أو حذف) محتوى المخزن المؤقت الحالي، فإنك تقوم بإجراء تغيير. الاستثناءات هي التحديثات التي تتم بواسطة أوامر سطر الأوامر (الأوامر التي تبدأ بـ `:`) لا تُعتبر تغييرًا.

في المثال الأول، كان `cwconst<Esc>` هو التغيير. الآن افترض أن لديك هذا النص:

```shell
pancake, potatoes, fruit-juice,
```

لحذف النص من بداية السطر إلى الظهور التالي لفاصلة، أولاً احذف إلى الفاصلة، ثم كرر ذلك مرتين باستخدام `df,..`. 

دعنا نجرب مثالًا آخر:

```shell
pancake, potatoes, fruit-juice,
```

هذه المرة، مهمتك هي حذف الفاصلة، وليس عناصر الإفطار. مع المؤشر في بداية السطر، انتقل إلى الفاصلة الأولى، احذفها، ثم كرر ذلك مرتين إضافيتين باستخدام `f,x..` سهل، أليس كذلك؟ انتظر لحظة، لم ينجح الأمر! لماذا؟

التغيير يستثني الحركات لأنه لا يحدث تحديثًا لمحتوى المخزن المؤقت. الأمر `f,x` يتكون من عمليتين: الأمر `f,` لتحريك المؤشر إلى "," و `x` لحذف حرف. فقط الأخير، `x`، تسبب في تغيير. قارن ذلك بـ `df,` من المثال السابق. في ذلك، `f,` هو توجيه لمشغل الحذف `d`، وليس حركة لتحريك المؤشر. الـ `f,` في `df,` و `f,x` لهما دورين مختلفين تمامًا.

دعنا ننهي المهمة الأخيرة. بعد تشغيل `f,` ثم `x`، انتقل إلى الفاصلة التالية باستخدام `;` لتكرار أحدث `f`. أخيرًا، استخدم `.` لحذف الحرف تحت المؤشر. كرر `; . ; .` حتى يتم حذف كل شيء. الأمر الكامل هو `f,x;.;.`.

دعنا نجرب أخرى:

```shell
pancake
potatoes
fruit-juice
```

دعنا نضيف فاصلة في نهاية كل سطر. بدءًا من السطر الأول، قم بـ `A,<Esc>j`. بحلول الآن، تدرك أن `j` لا يسبب تغييرًا. التغيير هنا هو فقط `A,`. يمكنك التحرك وتكرار التغيير باستخدام `j . j .`. الأمر الكامل هو `A,<Esc>j.j.`.

كل إجراء من اللحظة التي تضغط فيها على مشغل أمر الإدراج (`A`) حتى تخرج من أمر الإدراج (`<Esc>`) يُعتبر تغييرًا.

## التكرار عبر عدة أسطر

افترض أن لديك هذا النص:

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

هدفك هو حذف جميع الأسطر باستثناء سطر "foo". أولاً، احذف الأسطر الثلاثة الأولى باستخدام `d2j`، ثم إلى السطر أسفل سطر "foo". في السطر التالي، استخدم أمر النقطة مرتين. الأمر الكامل هو `d2jj..`.

هنا كان التغيير هو `d2j`. في هذا السياق، لم يكن `2j` حركة، بل جزءًا من مشغل الحذف.

دعنا ننظر إلى مثال آخر:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

دعنا نحذف جميع الـ z's. بدءًا من أول حرف في السطر الأول، اختر بصريًا فقط الـ z الأولى من الأسطر الثلاثة الأولى باستخدام وضع الاختيار البصري الكتلي (`Ctrl-Vjj`). إذا لم تكن معتادًا على وضع الاختيار البصري الكتلي، سأغطيها في فصل لاحق. بمجرد أن تكون قد اخترت الثلاثة z's بصريًا، احذفها باستخدام مشغل الحذف (`d`). ثم انتقل إلى الكلمة التالية (`w`) إلى الـ z التالية. كرر التغيير مرتين إضافيتين (`..`). الأمر الكامل هو `Ctrl-vjjdw..`.

عندما حذفت عمودًا من ثلاثة z's (`Ctrl-vjjd`)، تم احتسابه كتغيير. يمكن استخدام عملية الوضع البصري لاستهداف عدة أسطر كجزء من تغيير.

## تضمين حركة في تغيير

دعنا نعيد زيارة المثال الأول في هذا الفصل. تذكر أن الأمر `/letcwconst<Esc>` متبوعًا بـ `n . n .` استبدل جميع "let" بـ "const" في التعبيرات التالية:

```shell
let one = "1";
let two = "2";
let three = "3";
```

هناك طريقة أسرع لتحقيق ذلك. بعد أن بحثت باستخدام `/let`، قم بتشغيل `cgnconst<Esc>` ثم `. .`.

`gn` هي حركة تبحث للأمام عن نمط البحث الأخير (في هذه الحالة، `/let`) وتقوم تلقائيًا بتمييز بصري. لاستبدال الظهور التالي، لم تعد بحاجة للتحرك وتكرار التغيير (`n . n .`)، ولكن فقط تكرار (`. .`). لم تعد بحاجة لاستخدام حركات البحث لأن البحث عن المطابقة التالية أصبح الآن جزءًا من التغيير!

عند التحرير، كن دائمًا في حالة بحث عن الحركات التي يمكن أن تقوم بعدة أشياء في وقت واحد مثل `gn` كلما كان ذلك ممكنًا.

## تعلم أمر النقطة بطريقة ذكية

قوة أمر النقطة تأتي من تبادل عدة ضغطات مفاتيح مقابل واحدة. من المحتمل أن يكون من غير المجدي استخدام أمر النقطة لعمليات مفاتيح فردية مثل `x`. إذا كان آخر تغيير لك يتطلب عملية معقدة مثل `cgnconst<Esc>`، فإن أمر النقطة يقلل تسع ضغطات مفاتيح إلى واحدة، وهو تبادل مربح جدًا.

عند التحرير، فكر في إمكانية التكرار. على سبيل المثال، إذا كنت بحاجة إلى إزالة الكلمات الثلاث التالية، هل من الأكثر اقتصادية استخدام `d3w` أو القيام بـ `dw` ثم `.` مرتين؟ هل ستقوم بحذف كلمة مرة أخرى؟ إذا كان الأمر كذلك، فإن استخدام `dw` وتكراره عدة مرات بدلاً من `d3w` له معنى لأنه `dw` أكثر قابلية لإعادة الاستخدام من `d3w`.

أمر النقطة هو أمر متعدد الاستخدامات لأتمتة التغييرات الفردية. في فصل لاحق، ستتعلم كيفية أتمتة إجراءات أكثر تعقيدًا باستخدام ماكرو Vim. لكن أولاً، دعنا نتعلم عن السجلات لتخزين واسترجاع النص.