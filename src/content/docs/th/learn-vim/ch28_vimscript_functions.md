---
description: เอกสารนี้อธิบายเกี่ยวกับฟังก์ชันใน Vimscript รวมถึงกฎการเขียนซินแทกซ์และตัวอย่างการสร้างฟังก์ชันที่ถูกต้องและไม่ถูกต้อง
title: Ch28. Vimscript Functions
---

ฟังก์ชันเป็นวิธีการในการทำให้เป็นนามธรรม ซึ่งเป็นองค์ประกอบที่สามในการเรียนรู้ภาษาใหม่

ในบทก่อนหน้านี้ คุณได้เห็นฟังก์ชันพื้นฐานของ Vimscript (`len()`, `filter()`, `map()` เป็นต้น) และฟังก์ชันที่กำหนดเองในทางปฏิบัติ ในบทนี้ คุณจะได้เรียนรู้ลึกลงไปเกี่ยวกับการทำงานของฟังก์ชัน

## กฎไวยากรณ์ฟังก์ชัน

ที่แกนกลาง ฟังก์ชันใน Vimscript มีไวยากรณ์ดังนี้:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

การกำหนดฟังก์ชันต้องเริ่มต้นด้วยตัวอักษรตัวใหญ่ เริ่มต้นด้วยคีย์เวิร์ด `function` และสิ้นสุดด้วย `endfunction` ด้านล่างนี้คือตัวอย่างฟังก์ชันที่ถูกต้อง:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

ต่อไปนี้ไม่ใช่ฟังก์ชันที่ถูกต้องเพราะไม่เริ่มต้นด้วยตัวอักษรตัวใหญ่

```shell
function tasty()
  echo "Tasty"
endfunction
```

ถ้าคุณเพิ่มตัวแปรสคริปต์ (`s:`) ก่อนฟังก์ชัน คุณสามารถใช้ชื่อด้วยตัวพิมพ์เล็กได้ `function s:tasty()` เป็นชื่อที่ถูกต้อง เหตุผลที่ Vim ต้องการให้คุณใช้ชื่อที่มีตัวพิมพ์ใหญ่คือเพื่อป้องกันความสับสนกับฟังก์ชันในตัวของ Vim (ทั้งหมดเป็นตัวพิมพ์เล็ก)

ชื่อฟังก์ชันไม่สามารถเริ่มต้นด้วยตัวเลข `1Tasty()` ไม่ใช่ชื่อฟังก์ชันที่ถูกต้อง แต่ `Tasty1()` เป็นชื่อที่ถูกต้อง ฟังก์ชันยังไม่สามารถมีอักขระที่ไม่ใช่ตัวอักษรหรือตัวเลขนอกจาก `_` `Tasty-food()`, `Tasty&food()`, และ `Tasty.food()` ไม่ใช่ชื่อฟังก์ชันที่ถูกต้อง `Tasty_food()` *เป็น*.

ถ้าคุณกำหนดฟังก์ชันสองฟังก์ชันที่มีชื่อเดียวกัน Vim จะโยนข้อผิดพลาดบอกว่าฟังก์ชัน `Tasty` มีอยู่แล้ว เพื่อเขียนทับฟังก์ชันก่อนหน้าที่มีชื่อเดียวกัน ให้เพิ่ม `!` หลังคีย์เวิร์ด `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## การแสดงรายการฟังก์ชันที่มีอยู่

เพื่อดูฟังก์ชันในตัวและฟังก์ชันที่กำหนดเองทั้งหมดใน Vim คุณสามารถรันคำสั่ง `:function` เพื่อดูเนื้อหาของฟังก์ชัน `Tasty` คุณสามารถรัน `:function Tasty`.

คุณยังสามารถค้นหาฟังก์ชันด้วยรูปแบบด้วย `:function /pattern` คล้ายกับการนำทางการค้นหาของ Vim (`/pattern`). เพื่อค้นหาฟังก์ชันทั้งหมดที่มีวลี "map" ให้รัน `:function /map`. หากคุณใช้ปลั๊กอินภายนอก Vim จะแสดงฟังก์ชันที่กำหนดในปลั๊กอินเหล่านั้น

หากคุณต้องการดูว่าฟังก์ชันมาจากที่ใด คุณสามารถใช้คำสั่ง `:verbose` ร่วมกับคำสั่ง `:function`. เพื่อดูว่าฟังก์ชันทั้งหมดที่มีคำว่า "map" มาจากที่ใด ให้รัน:

```shell
:verbose function /map
```

เมื่อฉันรันมัน ฉันได้รับผลลัพธ์จำนวนมาก ตัวนี้บอกฉันว่าฟังก์ชัน `fzf#vim#maps` เป็นฟังก์ชัน autoload (เพื่อสรุปให้ดูในบทที่ 23) เขียนอยู่ในไฟล์ `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim` ที่บรรทัด 1263 นี่มีประโยชน์สำหรับการดีบัก

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## การลบฟังก์ชัน

เพื่อเอาฟังก์ชันที่มีอยู่แล้วออก ใช้ `:delfunction {Function_name}` เพื่อจะลบ `Tasty` ให้รัน `:delfunction Tasty`.

## ค่าที่ส่งกลับของฟังก์ชัน

เพื่อให้ฟังก์ชันส่งค่ากลับ คุณต้องส่งค่าที่ชัดเจน `return` มิฉะนั้น Vim จะส่งค่าที่ไม่ชัดเจนเป็น 0 โดยอัตโนมัติ

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

การ `return` ว่างๆ ก็เท่ากับค่าที่เป็น 0

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

ถ้าคุณรัน `:echo Tasty()` โดยใช้ฟังก์ชันด้านบน หลังจากที่ Vim แสดง "Tasty" มันจะส่งกลับ 0 ซึ่งเป็นค่าที่ไม่ชัดเจน เพื่อให้ `Tasty()` ส่งกลับค่าที่เป็น "Tasty" คุณสามารถทำได้ดังนี้:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

ตอนนี้เมื่อคุณรัน `:echo Tasty()` มันจะส่งกลับสตริง "Tasty".

คุณสามารถใช้ฟังก์ชันภายในนิพจน์ Vim จะใช้ค่าที่ส่งกลับจากฟังก์ชันนั้น นิพจน์ `:echo Tasty() . " Food!"` จะให้ผลลัพธ์เป็น "Tasty Food!"

## อาร์กิวเมนต์ทางการ

เพื่อส่งอาร์กิวเมนต์ทางการ `food` ไปยังฟังก์ชัน `Tasty` ของคุณ คุณสามารถทำได้ดังนี้:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" returns "Tasty pastry"
```

`a:` เป็นหนึ่งในขอบเขตตัวแปรที่กล่าวถึงในบทก่อนหน้านี้ มันคือตัวแปรพารามิเตอร์ทางการ เป็นวิธีของ Vim ในการรับค่าพารามิเตอร์ทางการในฟังก์ชัน หากไม่มีมัน Vim จะโยนข้อผิดพลาด:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" returns "undefined variable name" error
```

## ตัวแปรภายในฟังก์ชัน

มาพูดถึงตัวแปรอีกตัวที่คุณยังไม่ได้เรียนรู้ในบทก่อนหน้านี้: ตัวแปรภายในฟังก์ชัน (`l:`).

เมื่อเขียนฟังก์ชัน คุณสามารถกำหนดตัวแปรภายใน:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" returns "Yummy in my tummy"
```

ในบริบทนี้ ตัวแปร `location` เท่ากับ `l:location`. เมื่อคุณกำหนดตัวแปรในฟังก์ชัน ตัวแปรนั้นจะเป็น *ท้องถิ่น* สำหรับฟังก์ชันนั้น เมื่อผู้ใช้เห็น `location` มันอาจถูกเข้าใจผิดว่าเป็นตัวแปรทั่วโลก ฉันชอบที่จะใช้คำที่ชัดเจนมากกว่าที่จะไม่ชัดเจน ดังนั้นฉันจึงชอบที่จะใส่ `l:` เพื่อบ่งบอกว่านี่คือตัวแปรของฟังก์ชัน

อีกเหตุผลหนึ่งในการใช้ `l:count` คือว่า Vim มีตัวแปรพิเศษที่มีนามแฝงที่ดูเหมือนตัวแปรปกติ `v:count` เป็นตัวอย่างหนึ่ง มันมีนามแฝงว่า `count`. ใน Vim การเรียก `count` เท่ากับการเรียก `v:count`. มันง่ายที่จะเรียกตัวแปรพิเศษเหล่านั้นโดยไม่ตั้งใจ

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" throws an error
```

การดำเนินการข้างต้นโยนข้อผิดพลาดเพราะ `let count = "Count"` พยายามที่จะกำหนดค่าใหม่ให้กับตัวแปรพิเศษ `v:count`. จำไว้ว่า ตัวแปรพิเศษ (`v:`) เป็นแบบอ่านอย่างเดียว คุณไม่สามารถเปลี่ยนแปลงมันได้ เพื่อแก้ไขให้ใช้ `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" returns "I do not count my calories"
```

## การเรียกฟังก์ชัน

Vim มีคำสั่ง `:call` เพื่อเรียกฟังก์ชัน

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

คำสั่ง `call` จะไม่แสดงค่าที่ส่งกลับ ลองเรียกมันด้วย `echo`.

```shell
echo call Tasty("gravy")
```

โอ้ คุณจะได้รับข้อผิดพลาด คำสั่ง `call` ข้างต้นเป็นคำสั่งในบรรทัดคำสั่ง (`:call`). คำสั่ง `echo` ข้างต้นก็เป็นคำสั่งในบรรทัดคำสั่งเช่นกัน (`:echo`). คุณไม่สามารถเรียกคำสั่งในบรรทัดคำสั่งด้วยคำสั่งในบรรทัดคำสั่งอื่น ลองใช้รูปแบบที่แตกต่างของคำสั่ง `call`:

```shell
echo call("Tasty", ["gravy"])
" returns "Tasty gravy"
```

เพื่อให้ชัดเจน คุณเพิ่งใช้คำสั่ง `call` สองคำสั่งที่แตกต่างกัน: คำสั่ง `:call` ในบรรทัดคำสั่ง และฟังก์ชัน `call()`. ฟังก์ชัน `call()` รับพารามิเตอร์แรกเป็นชื่อฟังก์ชัน (สตริง) และพารามิเตอร์ที่สองเป็นพารามิเตอร์ทางการ (รายการ).

หากต้องการเรียนรู้เพิ่มเติมเกี่ยวกับ `:call` และ `call()` ให้ตรวจสอบ `:h call()` และ `:h :call`.

## อาร์กิวเมนต์เริ่มต้น

คุณสามารถกำหนดพารามิเตอร์ฟังก์ชันด้วยค่าดีฟอลต์ด้วย `=`. หากคุณเรียก `Breakfast` ด้วยอาร์กิวเมนต์เพียงหนึ่งตัว อาร์กิวเมนต์ `beverage` จะใช้ค่าดีฟอลต์ "นม".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" returns I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" returns I had Cereal and Orange Juice for breakfast
```

## อาร์กิวเมนต์ตัวแปร

คุณสามารถส่งอาร์กิวเมนต์ตัวแปรด้วยสามจุด (`...`). อาร์กิวเมนต์ตัวแปรมีประโยชน์เมื่อคุณไม่รู้ว่าผู้ใช้จะให้ตัวแปรกี่ตัว

สมมติว่าคุณกำลังสร้างบุฟเฟ่ต์แบบไม่จำกัด (คุณจะไม่มีวันรู้ว่าลูกค้าของคุณจะกินอาหารมากแค่ไหน):

```shell
function! Buffet(...)
  return a:1
endfunction
```

ถ้าคุณรัน `echo Buffet("Noodles")` มันจะให้ผลลัพธ์เป็น "Noodles". Vim ใช้ `a:1` เพื่อพิมพ์ *อาร์กิวเมนต์แรก* ที่ส่งไปยัง `...`, สูงสุด 20 (`a:1` เป็นอาร์กิวเมนต์แรก, `a:2` เป็นอาร์กิวเมนต์ที่สอง, เป็นต้น). ถ้าคุณรัน `echo Buffet("Noodles", "Sushi")` มันก็ยังจะแสดงเพียง "Noodles", มาปรับปรุงกัน:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" returns "Noodles Sushi"
```

ปัญหาของวิธีนี้คือถ้าคุณรัน `echo Buffet("Noodles")` (ด้วยตัวแปรเพียงตัวเดียว) Vim จะบ่นว่ามีตัวแปรที่ไม่ถูกต้อง `a:2`. คุณจะทำให้มันยืดหยุ่นพอที่จะแสดงสิ่งที่ผู้ใช้ให้ได้อย่างไร?

โชคดีที่ Vim มีตัวแปรพิเศษ `a:0` เพื่อแสดง *จำนวน* ของอาร์กิวเมนต์ที่ส่งไปยัง `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" returns 1

echo Buffet("Noodles", "Sushi")
" returns 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns 5
```

ด้วยสิ่งนี้ คุณสามารถวนซ้ำโดยใช้ความยาวของอาร์กิวเมนต์

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

วงเล็บปีกกา `a:{l:food_counter}` เป็นการแทรกสตริง ใช้ค่าของตัวนับ `food_counter` เพื่อเรียกอาร์กิวเมนต์พารามิเตอร์ทางการ `a:1`, `a:2`, `a:3`, เป็นต้น.

```shell
echo Buffet("Noodles")
" returns "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns everything you passed: "Noodles Sushi Ice cream Tofu Mochi"
```

อาร์กิวเมนต์ตัวแปรยังมีตัวแปรพิเศษอีกหนึ่งตัว: `a:000`. มันมีค่าของอาร์กิวเมนต์ตัวแปรทั้งหมดในรูปแบบรายการ.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" returns ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

มาปรับปรุงฟังก์ชันให้ใช้ลูป `for`:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" returns Noodles Sushi Ice cream Tofu Mochi
```
## ช่วง

คุณสามารถกำหนดฟังก์ชัน Vimscript แบบ *ช่วง* โดยการเพิ่มคำว่า `range` ที่ท้ายการกำหนดฟังก์ชัน ฟังก์ชันที่มีช่วงจะมีตัวแปรพิเศษสองตัวที่ใช้ได้: `a:firstline` และ `a:lastline` 

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

ถ้าคุณอยู่ที่บรรทัด 100 และคุณเรียกใช้ `call Breakfast()` มันจะแสดง 100 สำหรับทั้ง `firstline` และ `lastline` ถ้าคุณทำการไฮไลต์ด้วยวิธีมองเห็น (`v`, `V`, หรือ `Ctrl-V`) บรรทัด 101 ถึง 105 และเรียกใช้ `call Breakfast()` `firstline` จะแสดง 101 และ `lastline` จะแสดง 105 `firstline` และ `lastline` แสดงช่วงที่น้อยที่สุดและมากที่สุดที่ฟังก์ชันถูกเรียกใช้

คุณยังสามารถใช้ `:call` และส่งช่วงไปด้วย ถ้าคุณเรียกใช้ `:11,20call Breakfast()` มันจะแสดง 11 สำหรับ `firstline` และ 20 สำหรับ `lastline`

คุณอาจถามว่า "ดีจังที่ฟังก์ชัน Vimscript ยอมรับช่วง แต่ฉันไม่สามารถรับหมายเลขบรรทัดด้วย `line(".")` ได้เหรอ? มันจะไม่ทำสิ่งเดียวกันเหรอ?"

คำถามดี ถ้านี่คือสิ่งที่คุณหมายถึง:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

การเรียกใช้ `:11,20call Breakfast()` จะทำให้ฟังก์ชัน `Breakfast` ทำงาน 10 ครั้ง (หนึ่งครั้งสำหรับแต่ละบรรทัดในช่วง) เปรียบเทียบกับถ้าคุณได้ส่งอาร์กิวเมนต์ `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

การเรียกใช้ `11,20call Breakfast()` จะทำให้ฟังก์ชัน `Breakfast` ทำงาน *ครั้งเดียว*

ถ้าคุณส่งคำว่า `range` และคุณส่งช่วงตัวเลข (เช่น `11,20`) ใน `call`, Vim จะทำฟังก์ชันนั้นเพียงครั้งเดียว หากคุณไม่ส่งคำว่า `range` และคุณส่งช่วงตัวเลข (เช่น `11,20`) ใน `call`, Vim จะทำฟังก์ชันนั้น N ครั้งขึ้นอยู่กับช่วง (ในกรณีนี้ N = 10)

## พจนานุกรม

คุณสามารถเพิ่มฟังก์ชันเป็นรายการในพจนานุกรมโดยการเพิ่มคำว่า `dict` เมื่อกำหนดฟังก์ชัน

ถ้าคุณมีฟังก์ชัน `SecondBreakfast` ที่คืนค่ารายการ `breakfast` ที่คุณมี:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

มาลองเพิ่มฟังก์ชันนี้ไปยังพจนานุกรม `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" returns "pancakes"
```

ด้วยคำว่า `dict`, ตัวแปรคีย์ `self` จะอ้างถึงพจนานุกรมที่ฟังก์ชันถูกเก็บไว้ (ในกรณีนี้คือพจนานุกรม `meals`) นิพจน์ `self.breakfast` เท่ากับ `meals.breakfast`

วิธีทางเลือกในการเพิ่มฟังก์ชันเข้าไปในวัตถุพจนานุกรมคือการใช้ namespace

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" returns "pasta"
```

ด้วย namespace, คุณไม่จำเป็นต้องใช้คำว่า `dict`

## Funcref

Funcref คือการอ้างอิงถึงฟังก์ชัน มันเป็นหนึ่งในประเภทข้อมูลพื้นฐานของ Vimscript ที่กล่าวถึงในบทที่ 24

นิพจน์ `function("SecondBreakfast")` ข้างต้นเป็นตัวอย่างของ funcref Vim มีฟังก์ชันในตัว `function()` ที่คืนค่า funcref เมื่อคุณส่งชื่อฟังก์ชัน (สตริง)

```shell
function! Breakfast(item)
  return "I am having " . a:item . " for breakfast"
endfunction

let Breakfastify = Breakfast
" returns error

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" returns "I am having oatmeal for breakfast"

echo Breakfastify("pancake")
" returns "I am having pancake for breakfast"
```

ใน Vim, ถ้าคุณต้องการกำหนดฟังก์ชันให้กับตัวแปร, คุณไม่สามารถทำการกำหนดโดยตรงเช่น `let MyVar = MyFunc` คุณต้องใช้ฟังก์ชัน `function()`, เช่น `let MyVar = function("MyFunc")`

คุณสามารถใช้ funcref กับ map และ filter โปรดทราบว่า map และ filter จะส่งดัชนีเป็นอาร์กิวเมนต์แรกและค่าที่ถูกวนซ้ำเป็นอาร์กิวเมนต์ที่สอง

```shell
function! Breakfast(index, item)
  return "I am having " . a:item . " for breakfast"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

วิธีที่ดีกว่าในการใช้ฟังก์ชันใน map และ filter คือการใช้ lambda expression (บางครั้งเรียกว่าฟังก์ชันที่ไม่มีชื่อ) ตัวอย่างเช่น:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" returns 3

let Tasty = { -> 'tasty'}
echo Tasty()
" returns "tasty"
```

คุณสามารถเรียกฟังก์ชันจากภายใน lambda expression:

```shell
function! Lunch(item)
  return "I am having " . a:item . " for lunch"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

ถ้าคุณไม่ต้องการเรียกฟังก์ชันจากภายใน lambda, คุณสามารถปรับโครงสร้างมันได้:

```shell
let day_meals = map(lunch_items, {index, item -> "I am having " . item . " for lunch"})
```

## การเชื่อมโยงวิธีการ

คุณสามารถเชื่อมโยงฟังก์ชัน Vimscript และ lambda expression หลาย ๆ ฟังก์ชันตามลำดับด้วย `->` โปรดจำไว้ว่าต้องตามด้วยชื่อวิธีการ *โดยไม่มีช่องว่าง*

```shell
Source->Method1()->Method2()->...->MethodN()
```

เพื่อแปลง float เป็นหมายเลขโดยใช้การเชื่อมโยงวิธีการ:

```shell
echo 3.14->float2nr()
" returns 3
```

มาลองทำตัวอย่างที่ซับซ้อนมากขึ้น สมมติว่าคุณต้องการทำให้ตัวอักษรแรกของแต่ละรายการในรายการเป็นตัวพิมพ์ใหญ่ จากนั้นจัดเรียงรายการ และสุดท้ายรวมรายการเพื่อสร้างสตริง

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" returns "Antipasto, Bruschetta, Calzone"
```

ด้วยการเชื่อมโยงวิธีการ ลำดับจะอ่านและเข้าใจได้ง่ายขึ้น ฉันสามารถมองไปที่ `dinner_items->CapitalizeList()->sort()->join(", ")` และรู้ว่ากำลังเกิดอะไรขึ้น

## Closure

เมื่อคุณกำหนดตัวแปรภายในฟังก์ชัน ตัวแปรนั้นจะมีอยู่ภายในขอบเขตของฟังก์ชันนั้น นี่เรียกว่าขอบเขตทางเล็กซิคัล

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` ถูกกำหนดภายในฟังก์ชัน `Lunch` ซึ่งคืนค่า funcref ของ `SecondLunch` สังเกตว่า `SecondLunch` ใช้ `appetizer` แต่ใน Vimscript มันไม่มีการเข้าถึงตัวแปรนั้น หากคุณลองเรียกใช้ `echo Lunch()()`, Vim จะโยนข้อผิดพลาดตัวแปรที่ไม่ได้กำหนด

เพื่อแก้ไขปัญหานี้ ให้ใช้คำว่า `closure` มาปรับโครงสร้าง:

```shell
function! Lunch()
  let appetizer = "shrimp"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

ตอนนี้ถ้าคุณเรียกใช้ `echo Lunch()()`, Vim จะคืนค่า "shrimp"

## เรียนรู้ฟังก์ชัน Vimscript อย่างชาญฉลาด

ในบทนี้ คุณได้เรียนรู้เกี่ยวกับโครงสร้างของฟังก์ชัน Vim คุณได้เรียนรู้วิธีการใช้คำพิเศษต่าง ๆ `range`, `dict`, และ `closure` เพื่อปรับเปลี่ยนพฤติกรรมของฟังก์ชัน คุณยังได้เรียนรู้วิธีการใช้ lambda และการเชื่อมโยงฟังก์ชันหลาย ๆ ฟังก์ชันเข้าด้วยกัน ฟังก์ชันเป็นเครื่องมือที่สำคัญในการสร้างนามธรรมที่ซับซ้อน

ถัดไป มาลองรวมทุกสิ่งที่คุณได้เรียนรู้เข้าด้วยกันเพื่อสร้างปลั๊กอินของคุณเอง