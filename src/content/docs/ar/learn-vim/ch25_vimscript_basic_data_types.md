---
description: في هذا الفصل، ستتعلم عن أنواع البيانات الأساسية في Vimscript، بما في
  ذلك الأعداد، السلاسل، القوائم، والقواميس.
title: Ch25. Vimscript Basic Data Types
---

في الفصول القليلة القادمة، ستتعلم عن Vimscript، لغة البرمجة المدمجة في Vim.

عند تعلم لغة جديدة، هناك ثلاثة عناصر أساسية يجب البحث عنها:
- البدائيات
- وسائل الجمع
- وسائل التجريد

في هذا الفصل، ستتعلم أنواع البيانات البدائية في Vim.

## أنواع البيانات

يمتلك Vim 10 أنواع بيانات مختلفة:
- رقم
- عدد عشري
- سلسلة
- قائمة
- قاموس
- خاص
- مرجع دالة
- وظيفة
- قناة
- كتلة

سأغطي الأنواع الستة الأولى هنا. في الفصل 27، ستتعلم عن مرجع الدالة. لمزيد من المعلومات حول أنواع بيانات Vim، تحقق من `:h variables`.

## المتابعة مع وضع Ex

تقنيًا، لا يمتلك Vim REPL مدمج، لكنه يمتلك وضعًا، وضع Ex، يمكن استخدامه كواحد. يمكنك الانتقال إلى وضع Ex باستخدام `Q` أو `gQ`. وضع Ex يشبه وضع سطر الأوامر الممتد (يشبه كتابة أوامر وضع سطر الأوامر بلا توقف). للخروج من وضع Ex، اكتب `:visual`.

يمكنك استخدام إما `:echo` أو `:echom` في هذا الفصل والفصول التالية من Vimscript للبرمجة بالتوازي. إنها مثل `console.log` في JS أو `print` في Python. أمر `:echo` يطبع التعبير الذي تقدمه. أمر `:echom` يفعل نفس الشيء، ولكن بالإضافة إلى ذلك، يخزن النتيجة في تاريخ الرسائل.

```viml
:echom "hello echo message"
```

يمكنك عرض تاريخ الرسائل باستخدام:

```shell
:messages
```

لإزالة تاريخ الرسائل الخاص بك، قم بتشغيل:

```shell
:messages clear
```

## الرقم

يمتلك Vim 4 أنواع مختلفة من الأرقام: عشري، سداسي عشر، ثنائي، وثماني. بالمناسبة، عندما أقول نوع بيانات الرقم، غالبًا ما يعني هذا نوع بيانات صحيح. في هذا الدليل، سأستخدم مصطلحي الرقم والصحيح بالتبادل.

### عشري

يجب أن تكون على دراية بالنظام العشري. يقبل Vim الأعداد العشرية الموجبة والسالبة. 1، -1، 10، إلخ. في برمجة Vimscript، من المحتمل أنك ستستخدم النوع العشري معظم الوقت.

### سداسي عشر

تبدأ الأعداد السداسية عشر بـ `0x` أو `0X`. تذكير: هي**x**داسية عشر.

### ثنائي

تبدأ الأعداد الثنائية بـ `0b` أو `0B`. تذكير: **B**ثنائي.

### ثماني

تبدأ الأعداد الثمانية بـ `0`، `0o`، و `0O`. تذكير: **O**ثماني.

### طباعة الأرقام

إذا قمت بـ `echo` سواء كان عددًا سداسي عشر، ثنائي، أو ثماني، يقوم Vim تلقائيًا بتحويلها إلى أعداد عشرية.

```viml
:echo 42
" يرجع 42

:echo 052
" يرجع 42

:echo 0b101010
" يرجع 42

:echo 0x2A
" يرجع 42
```

### القيم الحقيقية وغير الحقيقية

في Vim، القيمة 0 تعتبر غير حقيقية وجميع القيم غير 0 تعتبر حقيقية.

لن يقوم ما يلي بطباعة أي شيء.

```viml
:if 0
:  echo "Nope"
:endif
```

ومع ذلك، هذا سيقوم بذلك:

```viml
:if 1
:  echo "Yes"
:endif
```

أي قيم أخرى غير 0 تعتبر حقيقية، بما في ذلك الأعداد السالبة. 100 تعتبر حقيقية. -1 تعتبر حقيقية.

### العمليات الحسابية على الأرقام

يمكن استخدام الأرقام لتشغيل التعبيرات الحسابية:

```viml
:echo 3 + 1
" يرجع 4

: echo 5 - 3
" يرجع 2

:echo 2 * 2
" يرجع 4

:echo 4 / 2
" يرجع 2
```

عند قسمة رقم مع باقي، يقوم Vim بإسقاط الباقي.

```viml
:echo 5 / 2
" يرجع 2 بدلاً من 2.5
```

للحصول على نتيجة أكثر دقة، تحتاج إلى استخدام رقم عشري.

## عدد عشري

الأعداد العشرية هي أعداد تحتوي على أرقام عشرية تالية. هناك طريقتان لتمثيل الأعداد العشرية: تدوين نقطة العشرية (مثل 31.4) والأس (3.14e01). مشابهة للأرقام، يمكنك استخدام علامات موجبة وسالبة:

```viml
:echo +123.4
" يرجع 123.4

:echo -1.234e2
" يرجع -123.4

:echo 0.25
" يرجع 0.25

:echo 2.5e-1
" يرجع 0.25
```

تحتاج إلى إعطاء العدد العشري نقطة وأرقام تالية. `25e-2` (بدون نقطة) و `1234.` (لها نقطة، ولكن لا توجد أرقام تالية) كلاهما أعداد عشرية غير صالحة.

### العمليات الحسابية على الأعداد العشرية

عند إجراء تعبير حسابي بين رقم وعدد عشري، يقوم Vim بتحويل النتيجة إلى عدد عشري.

```viml
:echo 5 / 2.0
" يرجع 2.5
```

العمليات الحسابية بين عدد عشري وعدد عشري تعطيك عددًا عشريًا آخر.

```shell
:echo 1.0 + 1.0
" يرجع 2.0
```

## سلسلة

السلاسل هي أحرف محاطة إما بعلامات اقتباس مزدوجة (`""`) أو علامات اقتباس مفردة (`''`). "Hello"، "123"، و '123.4' هي أمثلة على السلاسل.

### دمج السلاسل

لدمج سلسلة في Vim، استخدم عامل `.`.

```viml
:echo "Hello" . " world"
" يرجع "Hello world"
```

### العمليات الحسابية على السلاسل

عند تشغيل عوامل حسابية (`+ - * /`) مع رقم وسلسلة، يقوم Vim بتحويل السلسلة إلى رقم.

```viml
:echo "12 donuts" + 3
" يرجع 15
```

عندما يرى Vim "12 donuts"، يستخرج 12 من السلسلة ويحولها إلى الرقم 12. ثم يقوم بإجراء الجمع، مما يرجع 15. لكي تعمل هذه التحويلات من سلسلة إلى رقم، يجب أن يكون الرقم هو *أول حرف* في السلسلة.

لن تعمل ما يلي لأن 12 ليست أول حرف في السلسلة:

```viml
:echo "donuts 12" + 3
" يرجع 3
```

هذا أيضًا لن يعمل لأن فراغًا فارغًا هو أول حرف في السلسلة:

```viml
:echo " 12 donuts" + 3
" يرجع 3
```

تعمل هذه التحويلات حتى مع سلسلتين:

```shell
:echo "12 donuts" + "6 pastries"
" يرجع 18
```

تعمل هذه مع أي عامل حسابي، ليس فقط `+`:

```viml
:echo "12 donuts" * "5 boxes"
" يرجع 60

:echo "12 donuts" - 5
" يرجع 7

:echo "12 donuts" / "3 people"
" يرجع 4
```

خدعة رائعة لإجبار تحويل سلسلة إلى رقم هي ببساطة إضافة 0 أو الضرب في 1:

```viml
:echo "12" + 0
" يرجع 12

:echo "12" * 1
" يرجع 12
```

عند إجراء العمليات الحسابية ضد عدد عشري في سلسلة، يعامل Vim ذلك كعدد صحيح، وليس عددًا عشريًا:

```shell
:echo "12.0 donuts" + 12
" يرجع 24، وليس 24.0
```

### دمج الرقم والسلسلة

يمكنك تحويل رقم إلى سلسلة باستخدام عامل النقطة (`.`):

```viml
:echo 12 . "donuts"
" يرجع "12donuts"
```

تعمل هذه التحويلات فقط مع نوع بيانات الرقم، وليس العدد العشري. هذا لن يعمل:

```shell
:echo 12.0 . "donuts"
" لا يرجع "12.0donuts" بل يرمي خطأ
```

### الشروط على السلاسل

تذكر أن 0 غير حقيقية وجميع الأرقام غير 0 حقيقية. هذا صحيح أيضًا عند استخدام السلاسل كشرط.

في عبارة if التالية، يقوم Vim بتحويل "12donuts" إلى 12، وهو حقيقي:

```viml
:if "12donuts"
:  echo "Yum"
:endif
" يرجع "Yum"
```

من ناحية أخرى، هذا غير حقيقي:

```viml
:if "donuts12"
:  echo "Nope"
:endif
" لا يرجع شيئًا
```

يقوم Vim بتحويل "donuts12" إلى 0، لأن أول حرف ليس رقمًا.

### علامات الاقتباس المزدوجة مقابل المفردة

تتصرف علامات الاقتباس المزدوجة بشكل مختلف عن علامات الاقتباس المفردة. تعرض علامات الاقتباس المفردة الأحرف حرفيًا بينما تقبل علامات الاقتباس المزدوجة الأحرف الخاصة.

ما هي الأحرف الخاصة؟ تحقق من عرض السطر الجديد وعلامات الاقتباس المزدوجة:

```viml
:echo "hello\nworld"
" يرجع
" hello
" world

:echo "hello \"world\""
" يرجع "hello "world""
```

قارن ذلك مع علامات الاقتباس المفردة:

```shell
:echo 'hello\nworld'
" يرجع 'hello\nworld'

:echo 'hello \"world\"'
" يرجع 'hello \"world\"'
```

الأحرف الخاصة هي أحرف سلسلة خاصة عندما يتم الهروب منها، تتصرف بشكل مختلف. `\n` تعمل كسطر جديد. `\"` تتصرف كـ `"`. للحصول على قائمة بأحرف خاصة أخرى، تحقق من `:h expr-quote`.

### إجراءات السلسلة

لننظر إلى بعض إجراءات السلسلة المدمجة.

يمكنك الحصول على طول سلسلة باستخدام `strlen()`.

```shell
:echo strlen("choco")
" يرجع 5
```

يمكنك تحويل سلسلة إلى رقم باستخدام `str2nr()`:

```shell
:echo str2nr("12donuts")
" يرجع 12

:echo str2nr("donuts12")
" يرجع 0
```

مماثل لتحويل السلسلة إلى رقم سابقًا، إذا لم يكن الرقم هو أول حرف، فلن يلتقطه Vim.

الخبر السار هو أن Vim لديه طريقة تحول سلسلة إلى عدد عشري، `str2float()`:

```shell
:echo str2float("12.5donuts")
" يرجع 12.5
```

يمكنك استبدال نمط في سلسلة باستخدام طريقة `substitute()`:

```shell
:echo substitute("sweet", "e", "o", "g")
" يرجع "swoot"
```

المعلمة الأخيرة، "g"، هي علامة عالمية. معها، سيستبدل Vim جميع الحالات المطابقة. بدونها، سيستبدل Vim فقط المطابقة الأولى.

```shell
:echo substitute("sweet", "e", "o", "")
" يرجع "swoet"
```

يمكن دمج أمر الاستبدال مع `getline()`. تذكر أن الدالة `getline()` تحصل على النص في رقم السطر المعطى. افترض أن لديك النص "chocolate donut" في السطر 5. يمكنك استخدام الإجراء:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" يرجع glazed donut
```

هناك العديد من إجراءات السلسلة الأخرى. تحقق من `:h string-functions`.

## قائمة

قائمة Vimscript تشبه مصفوفة في Javascript أو قائمة في Python. إنها تسلسل *مرتّب* من العناصر. يمكنك مزج ومطابقة المحتوى مع أنواع بيانات مختلفة:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### القوائم الفرعية

قائمة Vim مؤشرة من الصفر. يمكنك الوصول إلى عنصر معين في القائمة باستخدام `[n]`، حيث n هو الفهرس.

```shell
:echo ["a", "sweet", "dessert"][0]
" يرجع "a"

:echo ["a", "sweet", "dessert"][2]
" يرجع "dessert"
```

إذا تجاوزت رقم الفهرس الأقصى، سيقوم Vim بإلقاء خطأ يقول إن الفهرس خارج النطاق:

```shell
:echo ["a", "sweet", "dessert"][999]
" يرجع خطأ
```

عندما تذهب تحت الصفر، سيبدأ Vim الفهرس من العنصر الأخير. الذهاب إلى ما بعد الحد الأدنى من رقم الفهرس سيؤدي أيضًا إلى إلقاء خطأ:

```shell
:echo ["a", "sweet", "dessert"][-1]
" يرجع "dessert"

:echo ["a", "sweet", "dessert"][-3]
" يرجع "a"

:echo ["a", "sweet", "dessert"][-999]
" يرجع خطأ
```

يمكنك "تقسيم" عدة عناصر من قائمة باستخدام `[n:m]`، حيث `n` هو الفهرس الابتدائي و `m` هو الفهرس النهائي.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" يرجع ["plain", "strawberry", "lemon"]
```

إذا لم تمرر `m` (`[n:]`)، سيعيد Vim بقية العناصر بدءًا من العنصر nth. إذا لم تمرر `n` (`[:m]`)، سيعيد Vim العنصر الأول حتى العنصر mth.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" يرجع ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" يرجع ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

يمكنك تمرير فهرس يتجاوز العناصر القصوى عند تقسيم مصفوفة.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" يرجع ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### تقسيم السلسلة

يمكنك تقسيم واستهداف السلاسل تمامًا مثل القوائم:

```viml
:echo "choco"[0]
" يرجع "c"

:echo "choco"[1:3]
" يرجع "hoc"

:echo "choco"[:3]
" يرجع choc

:echo "choco"[1:]
" يرجع hoco
```

### العمليات الحسابية على القوائم

يمكنك استخدام `+` لدمج وتغيير قائمة:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" يرجع ["chocolate", "strawberry", "sugar"]
```

### دوال القوائم

دعنا نستكشف دوال القائمة المدمجة في Vim.

للحصول على طول قائمة، استخدم `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" يرجع 2
```

لإضافة عنصر إلى قائمة، يمكنك استخدام `insert()`:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" يرجع ["glazed", "chocolate", "strawberry"]
```

يمكنك أيضًا تمرير `insert()` الفهرس حيث تريد إضافة العنصر. إذا كنت تريد إضافة عنصر قبل العنصر الثاني (الفهرس 1):

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" يرجع ['glazed', 'cream', 'chocolate', 'strawberry']
```

لإزالة عنصر من القائمة، استخدم `remove()`. يقبل قائمة وفهرس العنصر الذي تريد إزالته.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" يرجع ['glazed', 'strawberry']
```

يمكنك استخدام `map()` و `filter()` على قائمة. لتصفية العناصر التي تحتوي على العبارة "choco":

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" يرجع ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" يرجع ['chocolate donut', 'glazed donut', 'sugar donut']
```

متغير `v:val` هو متغير خاص في Vim. يتوفر عند تكرار قائمة أو قاموس باستخدام `map()` أو `filter()`. يمثل كل عنصر يتم تكراره.

للمزيد، تحقق من `:h list-functions`.

### تفكيك القائمة

يمكنك تفكيك قائمة وتعيين متغيرات لعناصر القائمة:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" يرجع "chocolate"

:echo flavor2
" يرجع "glazed"
```

لتعيين بقية عناصر القائمة، يمكنك استخدام `;` متبوعًا باسم متغير:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" يرجع "apple"

:echo restFruits
" يرجع ['lemon', 'blueberry', 'raspberry']
```

### تعديل القائمة

يمكنك تعديل عنصر في القائمة مباشرة:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" يرجع ['sugar', 'glazed', 'plain']
```

يمكنك تغيير عدة عناصر في القائمة مباشرة:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" يرجع ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## القاموس

قاموس Vimscript هو قائمة غير مرتبة مرتبطة. يتكون القاموس غير الفارغ من زوج مفتاح-قيمة على الأقل.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

يستخدم كائن بيانات قاموس Vim سلسلة كمفتاح. إذا حاولت استخدام رقم، سيقوم Vim بتحويله إلى سلسلة.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" يرجع {'1': '7am', '2': '9am', '11ses': '11am'}
```

إذا كنت كسولًا جدًا لوضع علامات اقتباس حول كل مفتاح، يمكنك استخدام تنسيق `#{}`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" يرجع {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

المتطلب الوحيد لاستخدام صيغة `#{}` هو أن يكون كل مفتاح إما:

- حرف ASCII.
- رقم.
- شرطة سفلية (`_`).
- شرطة (`-`).

تمامًا مثل القائمة، يمكنك استخدام أي نوع بيانات كقيم.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### الوصول إلى القاموس

للوصول إلى قيمة من قاموس، يمكنك استدعاء المفتاح باستخدام إما الأقواس المربعة (`['key']`) أو صيغة النقطة (`.key`).

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" يرجع "gruel omelettes"

:echo lunch
" يرجع "gruel sandwiches"
```

### تعديل القاموس

يمكنك تعديل أو حتى إضافة محتوى إلى القاموس:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" يرجع {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### دوال القاموس

دعنا نستكشف بعض الدوال المدمجة في Vim للتعامل مع القواميس.

للتحقق من طول القاموس، استخدم `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" يرجع 3
```

لرؤية ما إذا كان القاموس يحتوي على مفتاح معين، استخدم `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" يرجع 1

:echo has_key(mealPlans, "dessert")
" يرجع 0
```

لرؤية ما إذا كان القاموس يحتوي على أي عنصر، استخدم `empty()`. تعمل إجراء `empty()` مع جميع أنواع البيانات: قائمة، قاموس، سلسلة، رقم، عدد عشري، إلخ.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" يرجع 1

:echo empty(mealPlans)
" يرجع 0
```

لإزالة إدخال من قاموس، استخدم `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "إزالة الإفطار: " . remove(mealPlans, "breakfast")
" يرجع "إزالة الإفطار: 'waffles'""

:echo mealPlans
" يرجع {'lunch': 'pancakes', 'dinner': 'donuts'}
```

لتحويل قاموس إلى قائمة من القوائم، استخدم `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" يرجع [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` و `map()` متاحة أيضًا.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" يرجع {'2': '9am', '11ses': '11am'}
```

نظرًا لأن القاموس يحتوي على أزواج مفتاح-قيمة، يوفر Vim متغير `v:key` الخاص الذي يعمل بشكل مشابه لـ `v:val`. عند التكرار عبر قاموس، سيحتوي `v:key` على قيمة المفتاح الحالي الذي يتم تكراره.

إذا كان لديك قاموس `mealPlans`، يمكنك تطبيقه باستخدام `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " و الحليب"')

:echo mealPlans
" يرجع {'lunch': 'lunch و الحليب', 'breakfast': 'breakfast و الحليب', 'dinner': 'dinner و الحليب'}
```

بالمثل، يمكنك تطبيقه باستخدام `v:val`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " و الحليب"')

:echo mealPlans
" يرجع {'lunch': 'pancakes و الحليب', 'breakfast': 'waffles و الحليب', 'dinner': 'donuts و الحليب'}
```

لرؤية المزيد من دوال القاموس، تحقق من `:h dict-functions`.

## البدائيات الخاصة

يمتلك Vim بدائيات خاصة:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

بالمناسبة، `v:` هو متغير مدمج في Vim. سيتم تغطيته بمزيد من التفصيل في فصل لاحق.

من تجربتي، لن تستخدم هذه البدائيات الخاصة كثيرًا. إذا كنت بحاجة إلى قيمة صحيحة / خاطئة، يمكنك فقط استخدام 0 (خاطئة) وغير 0 (صحيحة). إذا كنت بحاجة إلى سلسلة فارغة، استخدم ببساطة `""`. لكن من الجيد معرفتها، لذا دعنا نمر عليها بسرعة.

### صحيح

هذا يعادل `true`. يعادل رقمًا بقيمة غير 0. عند فك تشفير json باستخدام `json_encode()`، يتم تفسيره على أنه "صحيح".

```shell
:echo json_encode({"test": v:true})
" يرجع {"test": true}
```

### خاطئ

هذا يعادل `false`. يعادل رقمًا بقيمة 0. عند فك تشفير json باستخدام `json_encode()`، يتم تفسيره على أنه "خاطئ".

```shell
:echo json_encode({"test": v:false})
" يرجع {"test": false}
```

### لا شيء

يعادل سلسلة فارغة. عند فك تشفير json باستخدام `json_encode()`، يتم تفسيره كعنصر فارغ (`null`).

```shell
:echo json_encode({"test": v:none})
" يرجع {"test": null}
```

### null

مماثل لـ `v:none`.

```shell
:echo json_encode({"test": v:null})
" يرجع {"test": null}
```

## تعلم أنواع البيانات بالطريقة الذكية

في هذا الفصل، تعلمت عن الأنواع الأساسية للبيانات في Vimscript: الرقم، العدد العشري، السلسلة، القائمة، القاموس، والخاصة. تعلم هذه هي الخطوة الأولى لبدء برمجة Vimscript.

في الفصل التالي، ستتعلم كيفية دمجها لكتابة تعبيرات مثل المساواة، الشروط، والحلقات.