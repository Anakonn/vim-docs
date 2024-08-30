---
description: هذا المستند يشرح كيفية استخدام أنواع البيانات في Vimscript لكتابة برامج
  أساسية تتضمن الشروط والحلقات، مع توضيح لمشغلات العلاقات.
title: Ch26. Vimscript Conditionals and Loops
---

بعد تعلم ما هي أنواع البيانات الأساسية، الخطوة التالية هي تعلم كيفية دمجها معًا لبدء كتابة برنامج أساسي. يتكون البرنامج الأساسي من الشروط والحلقات.

في هذا الفصل، ستتعلم كيفية استخدام أنواع بيانات Vimscript لكتابة الشروط والحلقات.

## العمليات العلائقية

تعتبر العمليات العلائقية في Vimscript مشابهة للعديد من لغات البرمجة:

```shell
a == b		equal to
a != b		not equal to
a >  b		greater than
a >= b		greater than or equal to
a <  b		less than
a <= b		less than or equal to
```

على سبيل المثال:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

تذكر أن السلاسل النصية يتم تحويلها إلى أرقام في تعبير حسابي. هنا أيضًا يقوم Vim بتحويل السلاسل النصية إلى أرقام في تعبير المساواة. "5foo" يتم تحويلها إلى 5 (صحيحة):

```shell
:echo 5 == "5foo"
" returns true
```

تذكر أيضًا أنه إذا بدأت سلسلة نصية بحرف غير رقمي مثل "foo5"، فإن السلسلة تتحول إلى الرقم 0 (خاطئة).

```shell
echo 5 == "foo5"
" returns false
```

### عمليات المنطق السلسلي

يمتلك Vim المزيد من العمليات العلائقية لمقارنة السلاسل النصية:

```shell
a =~ b
a !~ b
```

على سبيل المثال:

```shell
let str = "فطور شهي"

echo str =~ "فطور"
" returns true

echo str =~ "عشاء"
" returns false

echo str !~ "عشاء"
" returns true
```

العملية `=~` تقوم بإجراء مطابقة regex ضد السلسلة المعطاة. في المثال أعلاه، `str =~ "فطور"` تعيد true لأن `str` *تحتوي* على نمط "فطور". يمكنك دائمًا استخدام `==` و `!=`، ولكن استخدامهما سيقارن التعبير ضد السلسلة الكاملة. `=~` و `!~` هما خيارات أكثر مرونة.

```shell
echo str == "فطور"
" returns false

echo str == "فطور شهي"
" returns true
```

دعنا نجرب هذا. لاحظ الحرف الكبير "ف":

```shell
echo str =~ "فطور"
" true
```

إنها تعيد true على الرغم من أن "فطور" مكتوبة بحرف كبير. مثير للاهتمام... يبدو أن إعدادات Vim الخاصة بي مضبوطة لتجاهل الحالة (`set ignorecase`)، لذا عندما يتحقق Vim من المساواة، فإنه يستخدم إعداد Vim الخاص بي ويتجاهل الحالة. إذا قمت بإيقاف تجاهل الحالة (`set noignorecase`)، فإن المقارنة الآن تعيد false.

```shell
set noignorecase
echo str =~ "فطور"
" returns false because case matters

set ignorecase
echo str =~ "فطور"
" returns true because case doesn't matter
```

إذا كنت تكتب مكونًا إضافيًا للآخرين، فإن هذه حالة معقدة. هل يستخدم المستخدم `ignorecase` أم `noignorecase`؟ بالتأكيد لا تريد أن تضطر مستخدميك لتغيير خيار تجاهل الحالة لديهم. ماذا تفعل؟

لحسن الحظ، يحتوي Vim على عملية يمكن أن *تتجاهل* أو تطابق الحالة دائمًا. لمطابقة الحالة دائمًا، أضف `#` في النهاية.

```shell
set ignorecase
echo str =~# "فطور"
" returns true

echo str =~# "فطور"
" returns false

set noignorecase
echo str =~# "فطور"
" true

echo str =~# "فطور"
" false

echo str !~# "فطور"
" true
```

لتجاهل الحالة دائمًا عند المقارنة، أضف `?`:

```shell
set ignorecase
echo str =~? "فطور"
" true

echo str =~? "فطور"
" true

set noignorecase
echo str =~? "فطور"
" true

echo str =~? "فطور"
" true

echo str !~? "فطور"
" false
```

أفضل استخدام `#` لمطابقة الحالة دائمًا والبقاء في الجانب الآمن.

## إذا

الآن بعد أن رأيت تعبيرات المساواة في Vim، دعنا نتطرق إلى عملية شرطية أساسية، وهي جملة `if`.

على الأقل، تكون الصيغة:

```shell
if {clause}
  {some expression}
endif
```

يمكنك توسيع تحليل الحالة باستخدام `elseif` و `else`.

```shell
if {predicate1}
  {expression1}
elseif {predicate2}
  {expression2}
elseif {predicate3}
  {expression3}
else
  {expression4}
endif
```

على سبيل المثال، يستخدم المكون الإضافي [vim-signify](https://github.com/mhinz/vim-signify) طريقة تثبيت مختلفة اعتمادًا على إعدادات Vim الخاصة بك. أدناه تعليمات التثبيت من `readme` الخاصة بهم، باستخدام جملة `if`:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## التعبير الثلاثي

يمتلك Vim تعبيرًا ثلاثيًا لتحليل الحالة في سطر واحد:

```shell
{predicate} ? expressiontrue : expressionfalse
```

على سبيل المثال:

```shell
echo 1 ? "أنا صحيح" : "أنا خاطئ"
```

نظرًا لأن 1 صحيحة، يقوم Vim بإرجاع "أنا صحيح". افترض أنك تريد تعيين `background` إلى داكن إذا كنت تستخدم Vim بعد ساعة معينة. أضف هذا إلى vimrc:

```shell
let &background = strftime("%H") < 18 ? "light" : "dark"
```

`&background` هو خيار `'background'` في Vim. `strftime("%H")` تعيد الوقت الحالي بالساعات. إذا لم يكن قد مر السادسة مساءً، استخدم خلفية فاتحة. خلاف ذلك، استخدم خلفية داكنة.

## أو

يعمل "أو" المنطقي (`||`) مثل العديد من لغات البرمجة.

```shell
{تعبير خاطئ}  || {تعبير خاطئ}   false
{تعبير خاطئ}  || {تعبير صحيح}  true
{تعبير صحيح} || {تعبير خاطئ}   true
{تعبير صحيح} || {تعبير صحيح}  true
```

يقوم Vim بتقييم التعبير وإرجاع إما 1 (صحيح) أو 0 (خاطئ).

```shell
echo 5 || 0
" returns 1

echo 5 || 5
" returns 1

echo 0 || 0
" returns 0

echo "foo5" || "foo5"
" returns 0

echo "5foo" || "foo5"
" returns 1
```

إذا كان التعبير الحالي يقيم إلى صحيح، فلن يتم تقييم التعبير التالي.

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" returns 1

echo two_dozen || one_dozen
" returns error
```

لاحظ أن `two_dozen` لم يتم تعريفه أبدًا. التعبير `one_dozen || two_dozen` لا يثير أي خطأ لأن `one_dozen` يتم تقييمه أولاً ويجد أنه صحيح، لذا لا يقوم Vim بتقييم `two_dozen`.

## و

"و" المنطقي (`&&`) هو مكمل "أو" المنطقي.

```shell
{تعبير خاطئ}  && {تعبير خاطئ}   false
{تعبير خاطئ}  && {تعبير صحيح}  false
{تعبير صحيح} && {تعبير خاطئ}   false
{تعبير صحيح} && {تعبير صحيح}  true
```

على سبيل المثال:

```shell
echo 0 && 0
" returns 0

echo 0 && 10
" returns 0
```

تقوم `&&` بتقييم تعبير حتى ترى أول تعبير خاطئ. على سبيل المثال، إذا كان لديك `true && true`، فسيتم تقييم كلاهما وإرجاع `true`. إذا كان لديك `true && false && true`، فسيتم تقييم `true` الأول وسيتوقف عند أول `false`. لن يتم تقييم `true` الثالث.

```shell
let one_dozen = 12
echo one_dozen && 10
" returns 1

echo one_dozen && v:false
" returns 0

echo one_dozen && two_dozen
" returns error

echo exists("one_dozen") && one_dozen == 12
" returns 1
```

## لكل

تستخدم حلقة `for` عادةً مع نوع بيانات القائمة.

```shell
let breakfasts = ["فطائر", "وافل", "بيض"]

for breakfast in breakfasts
  echo breakfast
endfor
```

تعمل مع القوائم المتداخلة:

```shell
let meals = [["فطور", "فطائر"], ["غداء", "سمك"], ["عشاء", "مكرونة"]]

for [meal_type, food] in meals
  echo "أنا أتناول " . food . " من أجل " . meal_type
endfor
```

يمكنك من الناحية الفنية استخدام حلقة `for` مع قاموس باستخدام طريقة `keys()`.

```shell
let beverages = #{فطور: "حليب", غداء: "عصير برتقال", عشاء: "ماء"}
for beverage_type in keys(beverages)
  echo "أنا أشرب " . beverages[beverage_type] . " من أجل " . beverage_type
endfor
```

## بينما

حلقة أخرى شائعة هي حلقة `while`.

```shell
let counter = 1
while counter < 5
  echo "عداد هو: " . counter
  let counter += 1
endwhile
```

للحصول على محتوى السطر الحالي إلى السطر الأخير:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## معالجة الأخطاء

غالبًا ما لا يعمل برنامجك بالطريقة التي تتوقعها. ونتيجة لذلك، فإنه يسبب لك ارتباكًا (لعبة كلمات مقصودة). ما تحتاجه هو معالجة أخطاء مناسبة.

### كسر

عندما تستخدم `break` داخل حلقة `while` أو `for`، فإنها توقف الحلقة.

للحصول على النصوص من بداية الملف إلى السطر الحالي، ولكن توقف عندما ترى الكلمة "دونات":

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "دونات"
    break
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

إذا كان لديك النص:

```shell
واحد
اثنان
ثلاثة
دونات
أربعة
خمسة
```

تشغيل حلقة `while` أعلاه يعطي "واحد اثنان ثلاثة" وليس بقية النص لأن الحلقة تتوقف بمجرد أن تتطابق مع "دونات".

### متابعة

طريقة `continue` مشابهة لـ `break`، حيث يتم استدعاؤها أثناء الحلقة. الفرق هو أنه بدلاً من الخروج من الحلقة، فإنه يتخطى فقط تلك الدورة الحالية.

افترض أن لديك نفس النص ولكن بدلاً من `break`، تستخدم `continue`:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "دونات"
    continue
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

هذه المرة تعيد `واحد اثنان ثلاثة أربعة خمسة`. إنها تتخطى السطر الذي يحتوي على الكلمة "دونات"، لكن الحلقة تستمر.
### جرب، أخيرًا، وامسك

يمتلك Vim `try` و `finally` و `catch` للتعامل مع الأخطاء. لمحاكاة خطأ، يمكنك استخدام الأمر `throw`.

```shell
try
  echo "جرب"
  throw "لا"
endtry
```

قم بتشغيل هذا. سيشتكي Vim مع خطأ `"استثناء غير ملتقط: لا`.

الآن أضف كتلة catch:

```shell
try
  echo "جرب"
  throw "لا"
catch
  echo "تم الإمساك به"
endtry
```

الآن لم يعد هناك أي خطأ. يجب أن ترى "جرب" و "تم الإمساك به" معروضة.

دعنا نزيل `catch` ونضيف `finally`:

```shell
try
  echo "جرب"
  throw "لا"
  echo "لن تراني"
finally
  echo "أخيرًا"
endtry
```

قم بتشغيل هذا. الآن يعرض Vim الخطأ و "أخيرًا".

دعنا نجمع كل ذلك معًا:

```shell
try
  echo "جرب"
  throw "لا"
catch
  echo "تم الإمساك به"
finally
  echo "أخيرًا"
endtry
```

هذه المرة يعرض Vim كل من "تم الإمساك به" و "أخيرًا". لا يتم عرض أي خطأ لأن Vim أمسك به.

تأتي الأخطاء من أماكن مختلفة. مصدر آخر للخطأ هو استدعاء دالة غير موجودة، مثل `Nope()` أدناه:

```shell
try
  echo "جرب"
  call Nope()
catch
  echo "تم الإمساك به"
finally
  echo "أخيرًا"
endtry
```

الفرق بين `catch` و `finally` هو أن `finally` يتم تشغيله دائمًا، سواء كان هناك خطأ أم لا، بينما يتم تشغيل `catch` فقط عندما يحصل كودك على خطأ.

يمكنك الإمساك بخطأ محدد باستخدام `:catch`. وفقًا لـ `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " امسك المقاطعات (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " امسك جميع أخطاء Vim
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " امسك الأخطاء والمقاطعات
catch /^Vim(write):/.                " امسك جميع الأخطاء في :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " امسك الخطأ E123
catch /my-exception/.                " امسك استثناء المستخدم
catch /.*/                           " امسك كل شيء
catch.                               " نفس الشيء مثل /.*/
```

داخل كتلة `try`، تعتبر المقاطعة خطأ يمكن الإمساك به.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

في ملف vimrc الخاص بك، إذا كنت تستخدم نظام ألوان مخصص، مثل [gruvbox](https://github.com/morhetz/gruvbox)، وقمت عن طريق الخطأ بحذف دليل نظام الألوان ولكن لا تزال لديك السطر `colorscheme gruvbox` في ملف vimrc الخاص بك، سيقوم Vim بإلقاء خطأ عندما تقوم بـ `source` له. لإصلاح ذلك، أضفت هذا في ملف vimrc الخاص بي:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

الآن إذا قمت بـ `source` لملف vimrc بدون دليل `gruvbox`، سيستخدم Vim `colorscheme default`.

## تعلم الشروط بطريقة ذكية

في الفصل السابق، تعلمت عن أنواع البيانات الأساسية في Vim. في هذا الفصل، تعلمت كيفية دمجها لكتابة برامج أساسية باستخدام الشروط والحلقات. هذه هي اللبنات الأساسية للبرمجة.

التالي، دعنا نتعلم عن نطاقات المتغيرات.