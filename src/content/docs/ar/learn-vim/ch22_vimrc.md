---
description: في هذا الفصل، ستتعلم كيفية تنظيم وتكوين ملف vimrc، بالإضافة إلى كيفية
  تحديد أماكن بحث Vim عن ملف vimrc.
title: Ch22. Vimrc
---

في الفصول السابقة، تعلمت كيفية استخدام فيم. في هذا الفصل، ستتعلم كيفية تنظيم وتكوين vimrc.

## كيف يجد فيم vimrc

الحكمة التقليدية لـ vimrc هي إضافة ملف dotfile `.vimrc` في الدليل الرئيسي `~/.vimrc` (قد يكون مختلفًا حسب نظام التشغيل الخاص بك).

خلف الكواليس، يبحث فيم في أماكن متعددة عن ملف vimrc. إليك الأماكن التي يتحقق فيها فيم:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

عند بدء تشغيل فيم، سيتحقق من المواقع الستة أعلاه بهذا الترتيب للعثور على ملف vimrc. سيتم استخدام أول ملف vimrc يتم العثور عليه وتجاهل الباقي.

أولاً، سيبحث فيم عن `$VIMINIT`. إذا لم يكن هناك شيء هناك، سيتحقق فيم من `$HOME/.vimrc`. إذا لم يكن هناك شيء هناك، سيتحقق فيم من `$HOME/.vim/vimrc`. إذا وجد فيم الملف، سيتوقف عن البحث ويستخدم `$HOME/.vim/vimrc`.

الموقع الأول، `$VIMINIT`، هو متغير بيئة. بشكل افتراضي، يكون غير معرف. إذا كنت ترغب في استخدام `~/dotfiles/testvimrc` كقيمة لـ `$VIMINIT`، يمكنك إنشاء متغير بيئة يحتوي على مسار ذلك vimrc. بعد تشغيلك `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`، سيستخدم فيم الآن `~/dotfiles/testvimrc` كملف vimrc الخاص بك.

الموقع الثاني، `$HOME/.vimrc`، هو المسار التقليدي للعديد من مستخدمي فيم. `$HOME` في العديد من الحالات هو الدليل الرئيسي الخاص بك (`~`). إذا كان لديك ملف `~/.vimrc`، سيستخدم فيم هذا كملف vimrc الخاص بك.

الموقع الثالث، `$HOME/.vim/vimrc`، يقع داخل دليل `~/.vim`. قد يكون لديك دليل `~/.vim` بالفعل لملحقاتك، أو سكريبتاتك المخصصة، أو ملفات العرض. لاحظ أنه لا يوجد نقطة في اسم ملف vimrc (`$HOME/.vim/.vimrc` لن يعمل، لكن `$HOME/.vim/vimrc` سيعمل).

الموقع الرابع، `$EXINIT` يعمل بشكل مشابه لـ `$VIMINIT`.

الموقع الخامس، `$HOME/.exrc` يعمل بشكل مشابه لـ `$HOME/.vimrc`.

الموقع السادس، `$VIMRUNTIME/defaults.vim` هو ملف vimrc الافتراضي الذي يأتي مع بناء فيم الخاص بك. في حالتي، لدي فيم 8.2 مثبت باستخدام Homebrew، لذا فإن مساري هو (`/usr/local/share/vim/vim82`). إذا لم يجد فيم أيًا من ملفات vimrc الستة السابقة، سيستخدم هذا الملف.

بالنسبة لبقية هذا الفصل، أفترض أن vimrc يستخدم مسار `~/.vimrc`.

## ماذا أضع في vimrc الخاص بي؟

سؤال طرحته عندما بدأت هو، "ماذا يجب أن أضع في vimrc الخاص بي؟"

الإجابة هي، "أي شيء تريده". الإغراء لنسخ ولصق vimrc للآخرين حقيقي، لكن يجب عليك مقاومته. إذا كنت مصممًا على استخدام vimrc لشخص آخر، تأكد من أنك تعرف ما الذي يفعله، ولماذا وكيف يستخدمه، والأهم من ذلك، إذا كان له صلة بك. مجرد أن شخصًا ما يستخدمه لا يعني أنك ستستخدمه أيضًا.

## محتوى vimrc الأساسي

باختصار، vimrc هو مجموعة من:
- الملحقات
- الإعدادات
- الدوال المخصصة
- الأوامر المخصصة
- التعيينات

هناك أشياء أخرى لم يتم ذكرها أعلاه، لكن بشكل عام، هذا يغطي معظم حالات الاستخدام.

### الملحقات

في الفصول السابقة، ذكرت ملحقات مختلفة، مثل [fzf.vim](https://github.com/junegunn/fzf.vim)، [vim-mundo](https://github.com/simnalamburt/vim-mundo)، و [vim-fugitive](https://github.com/tpope/vim-fugitive).

قبل عشر سنوات، كانت إدارة الملحقات كابوسًا. ومع ذلك، مع ظهور مديري الملحقات الحديثة، يمكن الآن تثبيت الملحقات في ثوانٍ. أستخدم حاليًا [vim-plug](https://github.com/junegunn/vim-plug) كمدير ملحقات، لذا سأستخدمه في هذا القسم. يجب أن يكون المفهوم مشابهًا لمديري الملحقات الشائعين الآخرين. أوصي بشدة بالتحقق من مختلفهم، مثل:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

هناك المزيد من مديري الملحقات أكثر من المذكورين أعلاه، فلا تتردد في البحث. لتثبيت vim-plug، إذا كان لديك جهاز Unix، قم بتشغيل:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

لإضافة ملحقات جديدة، ضع أسماء ملحقاتك (`Plug 'github-username/repository-name'`) بين سطور `call plug#begin()` و `call plug#end()`. لذا إذا كنت ترغب في تثبيت `emmet-vim` و `nerdtree`، ضع الشيفرة التالية في vimrc الخاص بك:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

احفظ التغييرات، وقم بتشغيل `:source %`، ثم نفذ `:PlugInstall` لتثبيتها.

في المستقبل، إذا كنت بحاجة إلى إزالة الملحقات غير المستخدمة، كل ما عليك هو إزالة أسماء الملحقات من كتلة `call`، احفظ وقم بتشغيل، ثم نفذ الأمر `:PlugClean` لإزالتها من جهازك.

يمتلك فيم 8 مديري ملحقات مدمجين خاصين به. يمكنك التحقق من `:h packages` لمزيد من المعلومات. في الفصل التالي، سأريك كيفية استخدامه.

### الإعدادات

من الشائع رؤية الكثير من خيارات `set` في أي vimrc. إذا قمت بتشغيل أمر set من وضع سطر الأوامر، فلن يكون دائمًا. ستفقده عند إغلاق فيم. على سبيل المثال، بدلاً من تشغيل `:set relativenumber number` من وضع سطر الأوامر في كل مرة تقوم فيها بتشغيل فيم، يمكنك فقط وضع هذه داخل vimrc:

```shell
set relativenumber number
```

بعض الإعدادات تتطلب منك تمرير قيمة، مثل `set tabstop=2`. تحقق من صفحة المساعدة لكل إعداد لتتعلم ما نوع القيم التي يقبلها.

يمكنك أيضًا استخدام `let` بدلاً من `set` (تأكد من إضافة `&` قبله). مع `let`، يمكنك استخدام تعبير كقيمة. على سبيل المثال، لتعيين خيار `'dictionary'` إلى مسار فقط إذا كان المسار موجودًا:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

ستتعلم عن تعيينات Vimscript والشروط في الفصول اللاحقة.

للحصول على قائمة بجميع الخيارات الممكنة في فيم، تحقق من `:h E355`.

### الدوال المخصصة

vimrc هو مكان جيد للدوال المخصصة. ستتعلم كيفية كتابة دوال Vimscript الخاصة بك في فصل لاحق.

### الأوامر المخصصة

يمكنك إنشاء أمر مخصص باستخدام `command`.

لإنشاء أمر أساسي `GimmeDate` لعرض تاريخ اليوم:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

عند تشغيلك `:GimmeDate`، سيعرض فيم تاريخًا مثل "2021-01-1".

لإنشاء أمر أساسي مع إدخال، يمكنك استخدام `<args>`. إذا كنت ترغب في تمرير تنسيق وقت/تاريخ محدد إلى `GimmeDate`:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

إذا كنت ترغب في تقييد عدد المعاملات، يمكنك تمرير علامة `-nargs`. استخدم `-nargs=0` لتمرير لا شيء، `-nargs=1` لتمرير معامل واحد، `-nargs=+` لتمرير على الأقل معامل واحد، `-nargs=*` لتمرير أي عدد من المعاملات، و `-nargs=?` لتمرير 0 أو واحد من المعاملات. إذا كنت ترغب في تمرير المعامل nth، استخدم `-nargs=n` (حيث `n` هو أي عدد صحيح).

`<args>` له نوعان: `<f-args>` و `<q-args>`. يستخدم الأول لتمرير المعاملات إلى دوال Vimscript. يستخدم الثاني لتحويل إدخال المستخدم تلقائيًا إلى سلاسل نصية.

باستخدام `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" returns 'Hello Iggy'

:Hello Iggy
" Undefined variable error
```

باستخدام `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" returns 'Hello Iggy'
```

باستخدام `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " and " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" returns "Hello Iggy1 and Iggy2"
```

ستكون الدوال أعلاه أكثر منطقية بمجرد أن تصل إلى فصل دوال Vimscript.

لمعرفة المزيد عن الأوامر والمعاملات، تحقق من `:h command` و `:args`.
### الخرائط

إذا وجدت نفسك تقوم بنفس المهمة المعقدة بشكل متكرر، فهذا مؤشر جيد على أنه يجب عليك إنشاء خريطة لتلك المهمة.

على سبيل المثال، لدي هاتين الخريطتين في ملف vimrc الخاص بي:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

في الأولى، أستخدم `Ctrl-F` لأمر `:Gfiles` الخاص بإضافة [fzf.vim](https://github.com/junegunn/fzf.vim) (للبحث بسرعة عن ملفات Git). في الثانية، أستخدم `<Leader>tn` لاستدعاء دالة مخصصة `ToggleNumber` (تبديل خيارات `norelativenumber` و `relativenumber`). خريطة `Ctrl-F` تتجاوز التمرير الأصلي في Vim. ستتجاوز خريطتك عناصر التحكم في Vim إذا تداخلت. لأنني نادراً ما استخدمت تلك الميزة، قررت أنه من الآمن تجاوزها.

بالمناسبة، ما هو مفتاح "الزعيم" في `<Leader>tn`؟

يمتلك Vim مفتاح زعيم للمساعدة في الخرائط. على سبيل المثال، قمت بتعيين `<Leader>tn` لتشغيل دالة `ToggleNumber()`. بدون مفتاح الزعيم، كنت سأستخدم `tn`، لكن Vim لديه بالفعل `t` (للتنقل في البحث "حتى"). مع مفتاح الزعيم، يمكنني الآن الضغط على المفتاح المعين كزعيم، ثم `tn` دون التداخل مع الأوامر الموجودة. مفتاح الزعيم هو مفتاح يمكنك إعداده لبدء مجموعة الخرائط الخاصة بك. بشكل افتراضي، يستخدم Vim الشرطة المائلة كزعيم (لذا `<Leader>tn` يصبح "شرطة مائلة-t-n").

شخصياً، أحب استخدام `<Space>` كمفتاح زعيم بدلاً من الافتراضي. لتغيير مفتاح الزعيم الخاص بك، أضف هذا في ملف vimrc الخاص بك:

```shell
let mapleader = "\<space>"
```

يمكن تقسيم الأمر `nnoremap` المستخدم أعلاه إلى ثلاثة أجزاء:
- `n` تمثل وضعية العادي.
- `nore` تعني غير تكراري.
- `map` هو أمر الخريطة.

على الأقل، يمكنك استخدام `nmap` بدلاً من `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). ومع ذلك، من الجيد استخدام النسخة غير التكرارية لتجنب حلقات لا نهائية محتملة.

إليك ما يمكن أن يحدث إذا لم تقم بتعيين الخريطة بشكل غير تكراري. افترض أنك تريد إضافة خريطة لـ `B` لإضافة فاصلة منقوطة في نهاية السطر، ثم العودة إلى كلمة واحدة (تذكر أن `B` في Vim هو مفتاح تنقل في الوضع العادي للعودة إلى كلمة واحدة).

```shell
nmap B A;<esc>B
```

عندما تضغط على `B`... أوه لا! يضيف Vim `;` بشكل غير قابل للتحكم (قم بإيقافه باستخدام `Ctrl-C`). لماذا حدث ذلك؟ لأنه في الخريطة `A;<esc>B`، لا تشير `B` إلى وظيفة `B` الأصلية في Vim (للعودة إلى كلمة واحدة)، ولكنها تشير إلى الوظيفة المعينة. ما لديك هو في الواقع هذا:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

لحل هذه المشكلة، تحتاج إلى إضافة خريطة غير تكرارية:

```shell
nnoremap B A;<esc>B
```

الآن حاول استدعاء `B` مرة أخرى. هذه المرة يضيف `;` بنجاح في نهاية السطر ويعود إلى كلمة واحدة. تمثل `B` في هذه الخريطة وظيفة `B` الأصلية في Vim.

يمتلك Vim خرائط مختلفة لوضعيّات مختلفة. إذا كنت ترغب في إنشاء خريطة لوضع الإدخال للخروج من وضع الإدخال عند الضغط على `jk`:

```shell
inoremap jk <esc>
```

أنماط الخرائط الأخرى هي: `map` (عادي، بصري، تحديد، وعملي-معلق)، `vmap` (بصري وتحديد)، `smap` (تحديد)، `xmap` (بصري)، `omap` (عملي-معلق)، `map!` (إدخال وسطر الأوامر)، `lmap` (إدخال، سطر الأوامر، Lang-arg)، `cmap` (سطر الأوامر)، و`tmap` (وظيفة-الطرفية). لن أغطيها بالتفصيل. لمعرفة المزيد، تحقق من `:h map.txt`.

أنشئ خريطة تكون الأكثر بديهية، ومتسقة، وسهلة التذكر.

## تنظيم Vimrc

مع مرور الوقت، سيصبح ملف vimrc الخاص بك كبيرًا ومعقدًا. هناك طريقتان للحفاظ على مظهر ملف vimrc الخاص بك نظيفًا:
- تقسيم ملف vimrc إلى عدة ملفات.
- طي ملف vimrc الخاص بك.

### تقسيم ملف Vimrc الخاص بك

يمكنك تقسيم ملف vimrc إلى عدة ملفات باستخدام أمر `source` في Vim. يقرأ هذا الأمر أوامر سطر الأوامر من وسيط الملف المعطى.

دعنا ننشئ ملفًا داخل دليل `~/.vim` ونسميه `/settings` (`~/.vim/settings`). الاسم نفسه عشوائي ويمكنك تسميته كما تشاء.

ستقوم بتقسيمه إلى أربعة مكونات:
- الإضافات الخارجية (`~/.vim/settings/plugins.vim`).
- الإعدادات العامة (`~/.vim/settings/configs.vim`).
- الوظائف المخصصة (`~/.vim/settings/functions.vim`).
- خرائط المفاتيح (`~/.vim/settings/mappings.vim`).

داخل `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

يمكنك تحرير هذه الملفات بوضع المؤشر تحت المسار والضغط على `gf`.

داخل `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

داخل `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

داخل `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

داخل `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

يجب أن يعمل ملف vimrc الخاص بك كالمعتاد، ولكن الآن هو فقط أربعة أسطر طويلة!

مع هذا الإعداد، يمكنك بسهولة معرفة إلى أين تذهب. إذا كنت بحاجة إلى إضافة المزيد من الخرائط، أضفها إلى ملف `/mappings.vim`. في المستقبل، يمكنك دائمًا إضافة المزيد من الدلائل مع نمو ملف vimrc الخاص بك. على سبيل المثال، إذا كنت بحاجة إلى إنشاء إعداد لخطوط الألوان الخاصة بك، يمكنك إضافة `~/.vim/settings/themes.vim`.

### الاحتفاظ بملف Vimrc واحد

إذا كنت تفضل الاحتفاظ بملف vimrc واحد للحفاظ على قابليته للنقل، يمكنك استخدام طي العلامات للحفاظ على تنظيمه. أضف هذا في أعلى ملف vimrc الخاص بك:

```shell
" إعداد الطي {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

يمكن لـ Vim اكتشاف نوع ملف نوع الملف الحالي (`:set filetype?`). إذا كان نوع الملف هو `vim`، يمكنك استخدام طريقة طي العلامة. تذكر أن طي العلامة يستخدم `{{{` و `}}}` للإشارة إلى بداية ونهاية الطيات.

أضف طيات `{{{` و `}}}` إلى بقية ملف vimrc الخاص بك (لا تنسَ التعليق عليها بـ `"`):

```shell
" إعداد الطي {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" الإضافات {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" الإعدادات {{{
set nocompatible
set relativenumber
set number
" }}}

" الوظائف {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" الخرائط {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

يجب أن يبدو ملف vimrc الخاص بك هكذا:

```shell
+-- 6 أسطر: إعداد الطي -----

+-- 6 أسطر: الإضافات ---------

+-- 5 أسطر: الإعدادات ---------

+-- 9 أسطر: الوظائف -------

+-- 5 أسطر: الخرائط --------
```

## تشغيل Vim مع أو بدون Vimrc والإضافات

إذا كنت بحاجة إلى تشغيل Vim بدون كل من vimrc والإضافات، قم بتشغيل:

```shell
vim -u NONE
```

إذا كنت بحاجة إلى تشغيل Vim بدون vimrc ولكن مع الإضافات، قم بتشغيل:

```shell
vim -u NORC
```

إذا كنت بحاجة إلى تشغيل Vim مع vimrc ولكن بدون الإضافات، قم بتشغيل:

```shell
vim --noplugin
```

إذا كنت بحاجة إلى تشغيل Vim مع vimrc *مختلف*، مثل `~/.vimrc-backup`، قم بتشغيل:

```shell
vim -u ~/.vimrc-backup
```

إذا كنت بحاجة إلى تشغيل Vim مع `defaults.vim` فقط وبدون الإضافات، وهو مفيد لإصلاح vimrc المعطلة، قم بتشغيل:

```shell
vim --clean
```

## تكوين Vimrc بطريقة ذكية

يعتبر vimrc مكونًا مهمًا من تخصيص Vim. طريقة جيدة لبدء بناء vimrc الخاص بك هي قراءة vimrc الخاصة بالآخرين وبناءه تدريجيًا مع مرور الوقت. أفضل vimrc ليس هو الذي يستخدمه المطور X، ولكن الذي تم تصميمه بدقة ليناسب إطار تفكيرك وأسلوب تحريرك.