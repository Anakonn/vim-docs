---
description: เอกสารนี้สอนการใช้ประเภทข้อมูลใน Vimscript เพื่อเขียนโปรแกรมพื้นฐาน รวมถึงการใช้ตัวดำเนินการเปรียบเทียบและลูป.
title: Ch26. Vimscript Conditionals and Loops
---

หลังจากที่เรียนรู้เกี่ยวกับประเภทข้อมูลพื้นฐานแล้ว ขั้นตอนถัดไปคือการเรียนรู้วิธีการรวมประเภทข้อมูลเหล่านั้นเข้าด้วยกันเพื่อเริ่มเขียนโปรแกรมพื้นฐาน โปรแกรมพื้นฐานประกอบด้วยเงื่อนไขและลูป

ในบทนี้ คุณจะได้เรียนรู้วิธีการใช้ประเภทข้อมูล Vimscript เพื่อเขียนเงื่อนไขและลูป

## ตัวดำเนินการเชิงสัมพันธ์

ตัวดำเนินการเชิงสัมพันธ์ของ Vimscript มีความคล้ายคลึงกับหลายภาษาโปรแกรม:

```shell
a == b		equal to
a != b		not equal to
a >  b		greater than
a >= b		greater than or equal to
a <  b		less than
a <= b		less than or equal to
```

ตัวอย่างเช่น:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

จำไว้ว่าสตริงจะถูกบังคับให้เป็นตัวเลขในนิพจน์ทางคณิตศาสตร์ ที่นี่ Vim ก็จะบังคับให้สตริงเป็นตัวเลขในนิพจน์ความเท่าเทียม "5foo" จะถูกบังคับให้เป็น 5 (truthy):

```shell
:echo 5 == "5foo"
" returns true
```

นอกจากนี้ยังจำได้ว่าหากคุณเริ่มต้นสตริงด้วยอักขระที่ไม่ใช่ตัวเลข เช่น "foo5" สตริงจะถูกแปลงเป็นหมายเลข 0 (falsy):

```shell
echo 5 == "foo5"
" returns false
```

### ตัวดำเนินการตรรกะของสตริง

Vim มีตัวดำเนินการเชิงสัมพันธ์เพิ่มเติมสำหรับการเปรียบเทียบสตริง:

```shell
a =~ b
a !~ b
```

ตัวอย่างเช่น:

```shell
let str = "hearty breakfast"

echo str =~ "hearty"
" returns true

echo str =~ "dinner"
" returns false

echo str !~ "dinner"
" returns true
```

ตัวดำเนินการ `=~` จะทำการจับคู่ regex กับสตริงที่กำหนด ในตัวอย่างข้างต้น `str =~ "hearty"` คืนค่า true เพราะ `str` *มี* รูปแบบ "hearty" คุณสามารถใช้ `==` และ `!=` ได้เสมอ แต่การใช้พวกมันจะเปรียบเทียบนิพจน์กับสตริงทั้งหมด `=~` และ `!~` เป็นตัวเลือกที่ยืดหยุ่นมากกว่า

```shell
echo str == "hearty"
" returns false

echo str == "hearty breakfast"
" returns true
```

ลองทำสิ่งนี้ดู หมายเหตุตัว "H" ตัวพิมพ์ใหญ่:

```shell
echo str =~ "Hearty"
" true
```

มันคืนค่า true แม้ว่าจะมีการใช้ตัวพิมพ์ใหญ่ "Hearty" น่าสนใจ... ปรากฏว่าการตั้งค่า Vim ของฉันถูกตั้งค่าให้ไม่สนใจตัวพิมพ์ (`set ignorecase`) ดังนั้นเมื่อ Vim ตรวจสอบความเท่าเทียม มันจะใช้การตั้งค่า Vim ของฉันและไม่สนใจตัวพิมพ์ หากฉันปิดการไม่สนใจตัวพิมพ์ (`set noignorecase`) การเปรียบเทียบจะคืนค่า false

```shell
set noignorecase
echo str =~ "Hearty"
" returns false because case matters

set ignorecase
echo str =~ "Hearty"
" returns true because case doesn't matter
```

หากคุณกำลังเขียนปลั๊กอินสำหรับผู้อื่น นี่คือสถานการณ์ที่ยุ่งยาก ผู้ใช้ใช้ `ignorecase` หรือ `noignorecase`? คุณแน่นอนว่าไม่ต้องการบังคับให้ผู้ใช้ของคุณเปลี่ยนตัวเลือกการไม่สนใจตัวพิมพ์ของพวกเขา แล้วคุณจะทำอย่างไร?

โชคดีที่ Vim มีตัวดำเนินการที่สามารถ *ไม่สนใจ* หรือจับคู่ตัวพิมพ์ได้เสมอ เพื่อให้จับคู่ตัวพิมพ์เสมอ ให้เพิ่ม `#` ที่ท้าย

```shell
set ignorecase
echo str =~# "hearty"
" returns true

echo str =~# "HearTY"
" returns false

set noignorecase
echo str =~# "hearty"
" true

echo str =~# "HearTY"
" false

echo str !~# "HearTY"
" true
```

เพื่อไม่สนใจตัวพิมพ์เมื่อเปรียบเทียบ ให้เพิ่ม `?`:

```shell
set ignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

set noignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

echo str !~? "HearTY"
" false
```

ฉันชอบใช้ `#` เพื่อจับคู่ตัวพิมพ์เสมอและอยู่ในด้านที่ปลอดภัย

## If

ตอนนี้ที่คุณได้เห็นนิพจน์ความเท่าเทียมของ Vim แล้ว มาลองดูตัวดำเนินการเงื่อนไขพื้นฐานกัน นั่นคือ `if` statement

อย่างน้อย ไวยากรณ์คือ:

```shell
if {clause}
  {some expression}
endif
```

คุณสามารถขยายการวิเคราะห์กรณีด้วย `elseif` และ `else`

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

ตัวอย่างเช่น ปลั๊กอิน [vim-signify](https://github.com/mhinz/vim-signify) ใช้วิธีการติดตั้งที่แตกต่างกันขึ้นอยู่กับการตั้งค่า Vim ของคุณ ด้านล่างคือคำแนะนำการติดตั้งจาก `readme` ของพวกเขา โดยใช้ `if` statement:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## นิพจน์เทอร์นารี

Vim มีนิพจน์เทอร์นารีสำหรับการวิเคราะห์กรณีแบบบรรทัดเดียว:

```shell
{predicate} ? expressiontrue : expressionfalse
```

ตัวอย่างเช่น:

```shell
echo 1 ? "I am true" : "I am false"
```

เนื่องจาก 1 เป็น truthy Vim จึงแสดง "I am true" สมมติว่าคุณต้องการตั้งค่า `background` เป็นมืดหากคุณใช้ Vim หลังจากเวลาหนึ่ง เพิ่มสิ่งนี้ใน vimrc:

```shell
let &background = strftime("%H") < 18 ? "light" : "dark"
```

`&background` คือ `'background'` ตัวเลือกใน Vim `strftime("%H")` คืนค่าเวลาปัจจุบันเป็นชั่วโมง หากยังไม่ถึง 6 โมงเย็น ให้ใช้พื้นหลังสีอ่อน มิฉะนั้นให้ใช้พื้นหลังสีเข้ม

## or

"หรือ" เชิงตรรกะ (`||`) ทำงานเหมือนกับหลายภาษาโปรแกรม

```shell
{Falsy expression}  || {Falsy expression}   false
{Falsy expression}  || {Truthy expression}  true
{Truthy expression} || {Falsy expression}   true
{Truthy expression} || {Truthy expression}  true
```

Vim จะประเมินนิพจน์และคืนค่า 1 (truthy) หรือ 0 (falsy)

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

หากนิพจน์ปัจจุบันประเมินเป็น truthy นิพจน์ถัดไปจะไม่ถูกประเมิน

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" returns 1

echo two_dozen || one_dozen
" returns error
```

หมายเหตุว่า `two_dozen` ไม่เคยถูกกำหนด นิพจน์ `one_dozen || two_dozen` ไม่ทำให้เกิดข้อผิดพลาดเพราะ `one_dozen` ถูกประเมินก่อนและพบว่าเป็น truthy ดังนั้น Vim จึงไม่ประเมิน `two_dozen`

## and

"และ" เชิงตรรกะ (`&&`) เป็นส่วนเสริมของ "หรือ" เชิงตรรกะ

```shell
{Falsy Expression}  && {Falsy Expression}   false
{Falsy expression}  && {Truthy expression}  false
{Truthy Expression} && {Falsy Expression}   false
{Truthy expression} && {Truthy expression}  true
```

ตัวอย่างเช่น:

```shell
echo 0 && 0
" returns 0

echo 0 && 10
" returns 0
```

`&&` จะประเมินนิพจน์จนกว่าจะเห็นนิพจน์ที่เป็น falsy ตัวอย่างเช่น หากคุณมี `true && true` มันจะประเมินทั้งสองและคืนค่า `true` หากคุณมี `true && false && true` มันจะประเมิน `true` ตัวแรกและหยุดที่ `false` ตัวแรก มันจะไม่ประเมิน `true` ตัวที่สาม

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

## for

ลูป `for` มักใช้กับประเภทข้อมูลรายการ

```shell
let breakfasts = ["pancakes", "waffles", "eggs"]

for breakfast in breakfasts
  echo breakfast
endfor
```

มันทำงานกับรายการที่ซ้อนกัน:

```shell
let meals = [["breakfast", "pancakes"], ["lunch", "fish"], ["dinner", "pasta"]]

for [meal_type, food] in meals
  echo "I am having " . food . " for " . meal_type
endfor
```

คุณสามารถใช้ลูป `for` กับพจนานุกรมโดยใช้วิธี `keys()` ได้

```shell
let beverages = #{breakfast: "milk", lunch: "orange juice", dinner: "water"}
for beverage_type in keys(beverages)
  echo "I am drinking " . beverages[beverage_type] . " for " . beverage_type
endfor
```

## While

ลูปอีกประเภทหนึ่งคือลูป `while`

```shell
let counter = 1
while counter < 5
  echo "Counter is: " . counter
  let counter += 1
endwhile
```

เพื่อให้ได้เนื้อหาจากบรรทัดปัจจุบันไปยังบรรทัดสุดท้าย:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## การจัดการข้อผิดพลาด

บ่อยครั้งที่โปรแกรมของคุณไม่ทำงานตามที่คุณคาดหวัง ส่งผลให้เกิดความยุ่งเหยิง (เล่นคำ) สิ่งที่คุณต้องการคือการจัดการข้อผิดพลาดที่เหมาะสม

### Break

เมื่อคุณใช้ `break` ภายในลูป `while` หรือ `for` มันจะหยุดลูป

เพื่อให้ได้ข้อความจากจุดเริ่มต้นของไฟล์ไปยังบรรทัดปัจจุบัน แต่หยุดเมื่อคุณเห็นคำว่า "donut":

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    break
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

หากคุณมีข้อความ:

```shell
one
two
three
donut
four
five
```

การรันลูป `while` ข้างต้นจะให้ "one two three" และไม่เหลือข้อความที่เหลือเพราะลูปหยุดเมื่อมันตรงกับ "donut"

### Continue

วิธีการ `continue` จะคล้ายกับ `break` ซึ่งจะถูกเรียกใช้ระหว่างลูป ความแตกต่างคือแทนที่จะหยุดลูป มันจะข้ามการวนรอบปัจจุบัน

สมมติว่าคุณมีข้อความเดียวกัน แต่แทนที่จะใช้ `break` คุณใช้ `continue`:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    continue
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

ครั้งนี้มันคืนค่า `one two three four five` มันข้ามบรรทัดที่มีคำว่า "donut" แต่ลูปยังคงดำเนินต่อไป
### try, finally, and catch

Vim มี `try`, `finally`, และ `catch` เพื่อจัดการกับข้อผิดพลาด เพื่อจำลองข้อผิดพลาด คุณสามารถใช้คำสั่ง `throw` ได้

```shell
try
  echo "ลอง"
  throw "ไม่ใช่"
endtry
```

รันสิ่งนี้ Vim จะบ่นด้วยข้อผิดพลาด `"Exception not caught: ไม่ใช่`

ตอนนี้เพิ่มบล็อก catch:

```shell
try
  echo "ลอง"
  throw "ไม่ใช่"
catch
  echo "จับได้แล้ว"
endtry
```

ตอนนี้ไม่มีข้อผิดพลาดอีกต่อไป คุณควรเห็น "ลอง" และ "จับได้แล้ว" แสดงขึ้น

มาลบ `catch` และเพิ่ม `finally`:

```shell
try
  echo "ลอง"
  throw "ไม่ใช่"
  echo "คุณจะไม่เห็นฉัน"
finally
  echo "ในที่สุด"
endtry
```

รันสิ่งนี้ ตอนนี้ Vim แสดงข้อผิดพลาดและ "ในที่สุด"

มารวมทั้งหมดเข้าด้วยกัน:

```shell
try
  echo "ลอง"
  throw "ไม่ใช่"
catch
  echo "จับได้แล้ว"
finally
  echo "ในที่สุด"
endtry
```

ครั้งนี้ Vim แสดงทั้ง "จับได้แล้ว" และ "ในที่สุด" ไม่มีข้อผิดพลาดแสดงขึ้นเพราะ Vim จับมันได้

ข้อผิดพลาดมาจากแหล่งที่แตกต่างกัน แหล่งที่มาของข้อผิดพลาดอีกแห่งคือการเรียกฟังก์ชันที่ไม่มีอยู่ เช่น `Nope()` ด้านล่าง:

```shell
try
  echo "ลอง"
  call Nope()
catch
  echo "จับได้แล้ว"
finally
  echo "ในที่สุด"
endtry
```

ความแตกต่างระหว่าง `catch` และ `finally` คือ `finally` จะถูกเรียกใช้เสมอ ไม่ว่าจะมีข้อผิดพลาดหรือไม่ ในขณะที่ `catch` จะถูกเรียกใช้เฉพาะเมื่อโค้ดของคุณเกิดข้อผิดพลาด

คุณสามารถจับข้อผิดพลาดเฉพาะด้วย `:catch` ตามที่ `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " จับการหยุด (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " จับข้อผิดพลาดทั้งหมดของ Vim
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " จับข้อผิดพลาดและการหยุด
catch /^Vim(write):/.                " จับข้อผิดพลาดทั้งหมดใน :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " จับข้อผิดพลาด E123
catch /my-exception/.                " จับข้อยกเว้นของผู้ใช้
catch /.*/                           " จับทุกอย่าง
catch.                               " เหมือนกับ /.*/
```

ภายในบล็อก `try` การหยุดถือเป็นข้อผิดพลาดที่จับได้

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

ใน vimrc ของคุณ หากคุณใช้ธีมสีที่กำหนดเอง เช่น [gruvbox](https://github.com/morhetz/gruvbox) และคุณลบไดเรกทอรีธีมสีโดยไม่ตั้งใจ แต่ยังมีบรรทัด `colorscheme gruvbox` ใน vimrc ของคุณ Vim จะโยนข้อผิดพลาดเมื่อคุณ `source` มัน เพื่อแก้ไขสิ่งนี้ ฉันได้เพิ่มสิ่งนี้ใน vimrc ของฉัน:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

ตอนนี้ถ้าคุณ `source` vimrc โดยไม่มีไดเรกทอรี `gruvbox` Vim จะใช้ `colorscheme default`

## เรียนรู้เงื่อนไขอย่างชาญฉลาด

ในบทก่อนหน้านี้ คุณได้เรียนรู้เกี่ยวกับประเภทข้อมูลพื้นฐานของ Vim ในบทนี้ คุณได้เรียนรู้วิธีการรวมกันเพื่อเขียนโปรแกรมพื้นฐานโดยใช้เงื่อนไขและลูป นี่คือบล็อกพื้นฐานของการเขียนโปรแกรม

ถัดไป มาศึกษาเกี่ยวกับขอบเขตของตัวแปรกันเถอะ