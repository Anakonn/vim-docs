---
description: เอกสารนี้นำเสนอเกี่ยวกับ Vimscript ภาษาโปรแกรมใน Vim โดยเน้นที่ประเภทข้อมูลพื้นฐานและวิธีการใช้งานใน
  Ex mode.
title: Ch25. Vimscript Basic Data Types
---

ในบทต่อไปนี้ คุณจะได้เรียนรู้เกี่ยวกับ Vimscript ซึ่งเป็นภาษาการเขียนโปรแกรมที่มีอยู่ใน Vim

เมื่อเรียนรู้ภาษาใหม่ มีสามองค์ประกอบพื้นฐานที่ควรมองหา:
- พื้นฐาน
- วิธีการรวม
- วิธีการนามธรรม

ในบทนี้ คุณจะได้เรียนรู้เกี่ยวกับประเภทข้อมูลพื้นฐานของ Vim

## ประเภทข้อมูล

Vim มีประเภทข้อมูลที่แตกต่างกัน 10 ประเภท:
- หมายเลข
- ทศนิยม
- สตริง
- รายการ
- พจนานุกรม
- พิเศษ
- Funcref
- งาน
- ช่อง
- บล็อก

ฉันจะพูดถึงประเภทข้อมูลทั้งหกประเภทแรกที่นี่ ในบทที่ 27 คุณจะได้เรียนรู้เกี่ยวกับ Funcref สำหรับข้อมูลเพิ่มเติมเกี่ยวกับประเภทข้อมูลของ Vim ให้ตรวจสอบ `:h variables`

## การติดตามด้วยโหมด Ex

Vim โดยเทคนิคแล้วไม่มี REPL ที่มีอยู่ในตัว แต่มีโหมดหนึ่งคือโหมด Ex ที่สามารถใช้เหมือนกับ REPL ได้ คุณสามารถไปที่โหมด Ex ด้วย `Q` หรือ `gQ` โหมด Ex จะเหมือนกับโหมดบรรทัดคำสั่งที่ขยาย (มันเหมือนกับการพิมพ์คำสั่งในโหมดบรรทัดคำสั่งอย่างต่อเนื่อง) เพื่อออกจากโหมด Ex ให้พิมพ์ `:visual`

คุณสามารถใช้ `:echo` หรือ `:echom` ในบทนี้และบท Vimscript ถัดไปเพื่อเขียนโค้ดตามไปด้วย พวกมันเหมือนกับ `console.log` ใน JS หรือ `print` ใน Python คำสั่ง `:echo` จะแสดงผลการประเมินที่คุณให้มา คำสั่ง `:echom` ทำเช่นเดียวกัน แต่ยังเก็บผลลัพธ์ในประวัติข้อความ

```viml
:echom "hello echo message"
```

คุณสามารถดูประวัติข้อความได้ที่:

```shell
:messages
```

เพื่อเคลียร์ประวัติข้อความของคุณ ให้รัน:

```shell
:messages clear
```

## หมายเลข

Vim มีประเภทหมายเลขที่แตกต่างกัน 4 ประเภท: ทศนิยม, เฮกซาเดซิมัล, ไบนารี, และออกเทล โดยทั่วไปแล้ว เมื่อฉันพูดถึงประเภทข้อมูลหมายเลข มักจะหมายถึงประเภทข้อมูลจำนวนเต็ม ในคู่มือนี้ ฉันจะใช้คำว่า หมายเลข และ จำนวนเต็ม สลับกัน

### ทศนิยม

คุณควรคุ้นเคยกับระบบทศนิยม Vim ยอมรับทศนิยมบวกและลบ 1, -1, 10 เป็นต้น ในการเขียนโปรแกรม Vimscript คุณจะใช้ประเภททศนิยมเป็นส่วนใหญ่

### เฮกซาเดซิมัล

เฮกซาเดซิมัลเริ่มต้นด้วย `0x` หรือ `0X` คำช่วยจำ: เฮ**ก**ซาเดซิมัล

### ไบนารี

ไบนารีเริ่มต้นด้วย `0b` หรือ `0B` คำช่วยจำ: **บ**ายารี

### ออกเทล

ออกเทลเริ่มต้นด้วย `0`, `0o`, และ `0O` คำช่วยจำ: **อ**อกเทล

### การพิมพ์หมายเลข

หากคุณ `echo` หมายเลขเฮกซาเดซิมัล, ไบนารี, หรือออกเทล Vim จะเปลี่ยนเป็นทศนิยมโดยอัตโนมัติ

```viml
:echo 42
" คืนค่า 42

:echo 052
" คืนค่า 42

:echo 0b101010
" คืนค่า 42

:echo 0x2A
" คืนค่า 42
```

### ความจริงและความเท็จ

ใน Vim ค่า 0 เป็นความเท็จและค่าที่ไม่ใช่ 0 ทั้งหมดเป็นความจริง

สิ่งต่อไปนี้จะไม่แสดงอะไรเลย

```viml
:if 0
:  echo "Nope"
:endif
```

อย่างไรก็ตาม สิ่งนี้จะ:

```viml
:if 1
:  echo "Yes"
:endif
```

ค่าที่ไม่ใช่ 0 จะเป็นความจริง รวมถึงหมายเลขลบ 100 เป็นความจริง -1 เป็นความจริง

### คณิตศาสตร์หมายเลข

หมายเลขสามารถใช้ในการดำเนินการทางคณิตศาสตร์:

```viml
:echo 3 + 1
" คืนค่า 4

: echo 5 - 3
" คืนค่า 2

:echo 2 * 2
" คืนค่า 4

:echo 4 / 2
" คืนค่า 2
```

เมื่อหารหมายเลขที่มีเศษ Vim จะทิ้งเศษ

```viml
:echo 5 / 2
" คืนค่า 2 แทนที่จะเป็น 2.5
```

เพื่อให้ได้ผลลัพธ์ที่แม่นยำมากขึ้น คุณต้องใช้หมายเลขทศนิยม

## ทศนิยม

ทศนิยมคือหมายเลขที่มีจุดทศนิยมตามหลัง มีสองวิธีในการแสดงหมายเลขทศนิยม: การใช้จุด (เช่น 31.4) และการใช้เลขชี้กำลัง (3.14e01) คล้ายกับหมายเลข คุณสามารถใช้สัญลักษณ์บวกและลบ:

```viml
:echo +123.4
" คืนค่า 123.4

:echo -1.234e2
" คืนค่า -123.4

:echo 0.25
" คืนค่า 0.25

:echo 2.5e-1
" คืนค่า 0.25
```

คุณต้องให้ทศนิยมมีจุดและตัวเลขตามหลัง `25e-2` (ไม่มีจุด) และ `1234.` (มีจุด แต่ไม่มีตัวเลขตามหลัง) เป็นหมายเลขทศนิยมที่ไม่ถูกต้อง

### คณิตศาสตร์ทศนิยม

เมื่อทำการดำเนินการทางคณิตศาสตร์ระหว่างหมายเลขและทศนิยม Vim จะบังคับให้ผลลัพธ์เป็นทศนิยม

```viml
:echo 5 / 2.0
" คืนค่า 2.5
```

การดำเนินการทางคณิตศาสตร์ระหว่างทศนิยมกับทศนิยมจะให้ผลลัพธ์เป็นทศนิยมอีกตัว

```shell
:echo 1.0 + 1.0
" คืนค่า 2.0
```

## สตริง

สตริงคืออักขระที่ล้อมรอบด้วยเครื่องหมายคำพูดคู่ (`""`) หรือเครื่องหมายคำพูดเดี่ยว (`''`) "Hello", "123", และ '123.4' เป็นตัวอย่างของสตริง

### การเชื่อมสตริง

ในการเชื่อมสตริงใน Vim ให้ใช้ตัวดำเนินการ `.`

```viml
:echo "Hello" . " world"
" คืนค่า "Hello world"
```

### คณิตศาสตร์สตริง

เมื่อคุณรันตัวดำเนินการทางคณิตศาสตร์ (`+ - * /`) กับหมายเลขและสตริง Vim จะบังคับให้สตริงกลายเป็นหมายเลข

```viml
:echo "12 donuts" + 3
" คืนค่า 15
```

เมื่อ Vim เห็น "12 donuts" มันจะดึง 12 จากสตริงและแปลงเป็นหมายเลข 12 จากนั้นทำการบวก คืนค่า 15 สำหรับการบังคับแปลงจากสตริงเป็นหมายเลขนี้จะต้องมีตัวเลขเป็น *อักขระแรก* ในสตริง

สิ่งต่อไปนี้จะไม่ทำงานเพราะ 12 ไม่ใช่อักขระแรกในสตริง:

```viml
:echo "donuts 12" + 3
" คืนค่า 3
```

สิ่งนี้ก็จะไม่ทำงานเพราะช่องว่างเป็นอักขระแรกของสตริง:

```viml
:echo " 12 donuts" + 3
" คืนค่า 3
```

การบังคับนี้ทำงานแม้กับสองสตริง:

```shell
:echo "12 donuts" + "6 pastries"
" คืนค่า 18
```

สิ่งนี้ทำงานกับตัวดำเนินการทางคณิตศาสตร์ใด ๆ ไม่ใช่แค่ `+`:

```viml
:echo "12 donuts" * "5 boxes"
" คืนค่า 60

:echo "12 donuts" - 5
" คืนค่า 7

:echo "12 donuts" / "3 people"
" คืนค่า 4
```

กลเม็ดที่ดีในการบังคับการแปลงจากสตริงเป็นหมายเลขคือการเพียงแค่บวก 0 หรือคูณด้วย 1:

```viml
:echo "12" + 0
" คืนค่า 12

:echo "12" * 1
" คืนค่า 12
```

เมื่อดำเนินการทางคณิตศาสตร์กับทศนิยมในสตริง Vim จะถือว่ามันเป็นจำนวนเต็ม ไม่ใช่ทศนิยม:

```shell
:echo "12.0 donuts" + 12
" คืนค่า 24 ไม่ใช่ 24.0
```

### การเชื่อมหมายเลขและสตริง

คุณสามารถบังคับหมายเลขให้กลายเป็นสตริงด้วยตัวดำเนินการจุด (`.`):

```viml
:echo 12 . "donuts"
" คืนค่า "12donuts"
```

การบังคับนี้ใช้ได้เฉพาะกับประเภทข้อมูลหมายเลข ไม่ใช่ทศนิยม สิ่งนี้จะไม่ทำงาน:

```shell
:echo 12.0 . "donuts"
" ไม่คืนค่า "12.0donuts" แต่โยนข้อผิดพลาด
```

### เงื่อนไขสตริง

จำไว้ว่า 0 เป็นความเท็จและหมายเลขที่ไม่ใช่ 0 ทั้งหมดเป็นความจริง สิ่งนี้ยังเป็นจริงเมื่อใช้สตริงเป็นเงื่อนไข

ในคำสั่ง if ต่อไปนี้ Vim จะบังคับ "12donuts" ให้เป็น 12 ซึ่งเป็นความจริง:

```viml
:if "12donuts"
:  echo "Yum"
:endif
" คืนค่า "Yum"
```

ในทางกลับกัน สิ่งนี้เป็นความเท็จ:

```viml
:if "donuts12"
:  echo "Nope"
:endif
" คืนค่าไม่มีอะไร
```

Vim จะบังคับ "donuts12" ให้เป็น 0 เพราะอักขระแรกไม่ใช่หมายเลข

### เครื่องหมายคำพูดคู่กับเครื่องหมายคำพูดเดี่ยว

เครื่องหมายคำพูดคู่ทำงานแตกต่างจากเครื่องหมายคำพูดเดี่ยว เครื่องหมายคำพูดเดี่ยวจะแสดงอักขระตามตัวอักษรในขณะที่เครื่องหมายคำพูดคู่ยอมรับอักขระพิเศษ

อักขระพิเศษคืออะไร? ตรวจสอบการแสดงผลของการขึ้นบรรทัดใหม่และเครื่องหมายคำพูดคู่:

```viml
:echo "hello\nworld"
" คืนค่า
" hello
" world

:echo "hello \"world\""
" คืนค่า "hello "world""
```

เปรียบเทียบกับเครื่องหมายคำพูดเดี่ยว:

```shell
:echo 'hello\nworld'
" คืนค่า 'hello\nworld'

:echo 'hello \"world\"'
" คืนค่า 'hello \"world\"'
```

อักขระพิเศษคืออักขระสตริงพิเศษที่เมื่อถูกหลีกเลี่ยงจะทำงานแตกต่างกัน `\n` ทำงานเหมือนการขึ้นบรรทัดใหม่ `\"` ทำงานเหมือน `"`. สำหรับรายการอักขระพิเศษอื่น ๆ ให้ตรวจสอบ `:h expr-quote`

### ขั้นตอนการทำงานกับสตริง

มาดูขั้นตอนการทำงานกับสตริงที่มีอยู่ในตัวกัน

คุณสามารถหาความยาวของสตริงได้ด้วย `strlen()`:

```shell
:echo strlen("choco")
" คืนค่า 5
```

คุณสามารถแปลงสตริงเป็นหมายเลขได้ด้วย `str2nr()`:

```shell
:echo str2nr("12donuts")
" คืนค่า 12

:echo str2nr("donuts12")
" คืนค่า 0
```

คล้ายกับการบังคับแปลงจากสตริงเป็นหมายเลขก่อนหน้านี้ หากหมายเลขไม่ใช่อักขระแรก Vim จะไม่สามารถจับได้

ข่าวดีคือ Vim มีวิธีการที่แปลงสตริงเป็นทศนิยม `str2float()`:

```shell
:echo str2float("12.5donuts")
" คืนค่า 12.5
```

คุณสามารถแทนที่รูปแบบในสตริงด้วยวิธีการ `substitute()`:

```shell
:echo substitute("sweet", "e", "o", "g")
" คืนค่า "swoot"
```

พารามิเตอร์สุดท้าย "g" คือธงทั่วโลก ด้วยมัน Vim จะแทนที่ทุกการเกิดขึ้นที่ตรงกัน หากไม่มีมัน Vim จะแทนที่เฉพาะการจับคู่แรกเท่านั้น

```shell
:echo substitute("sweet", "e", "o", "")
" คืนค่า "swoet"
```

คำสั่งแทนที่สามารถรวมกับ `getline()` ได้ จำไว้ว่าฟังก์ชัน `getline()` จะดึงข้อความในหมายเลขบรรทัดที่กำหนด สมมติว่าคุณมีข้อความ "chocolate donut" ในบรรทัดที่ 5 คุณสามารถใช้ขั้นตอนนี้:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" คืนค่า glazed donut
```

มีขั้นตอนการทำงานกับสตริงอื่น ๆ อีกมากมาย ตรวจสอบที่ `:h string-functions`

## รายการ

รายการใน Vimscript คล้ายกับ Array ใน Javascript หรือ List ใน Python มันเป็นลำดับของรายการที่ *มีลำดับ* คุณสามารถผสมผสานเนื้อหาด้วยประเภทข้อมูลที่แตกต่างกัน:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### ซับลิสต์

รายการใน Vim ใช้ดัชนีเริ่มต้นที่ศูนย์ คุณสามารถเข้าถึงรายการเฉพาะในรายการได้ด้วย `[n]` โดยที่ n คือดัชนี

```shell
:echo ["a", "sweet", "dessert"][0]
" คืนค่า "a"

:echo ["a", "sweet", "dessert"][2]
" คืนค่า "dessert"
```

หากคุณเกินจำนวนดัชนีสูงสุด Vim จะโยนข้อผิดพลาดบอกว่าดัชนีอยู่นอกช่วง:

```shell
:echo ["a", "sweet", "dessert"][999]
" คืนค่าข้อผิดพลาด
```

เมื่อคุณไปต่ำกว่าศูนย์ Vim จะเริ่มดัชนีจากองค์ประกอบสุดท้าย การไปเกินจำนวนดัชนีขั้นต่ำก็จะโยนข้อผิดพลาดเช่นกัน:

```shell
:echo ["a", "sweet", "dessert"][-1]
" คืนค่า "dessert"

:echo ["a", "sweet", "dessert"][-3]
" คืนค่า "a"

:echo ["a", "sweet", "dessert"][-999]
" คืนค่าข้อผิดพลาด
```

คุณสามารถ "ตัด" หลายองค์ประกอบจากรายการด้วย `[n:m]` โดยที่ `n` คือดัชนีเริ่มต้นและ `m` คือดัชนีสิ้นสุด

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" คืนค่า ["plain", "strawberry", "lemon"]
```

หากคุณไม่ส่ง `m` (`[n:]`) Vim จะคืนค่าทุกองค์ประกอบที่เหลือเริ่มจากองค์ประกอบที่ n หากคุณไม่ส่ง `n` (`[:m]`) Vim จะคืนค่าองค์ประกอบแรกจนถึงองค์ประกอบที่ m

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" คืนค่า ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" คืนค่า ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

คุณสามารถส่งดัชนีที่เกินจำนวนสูงสุดเมื่อทำการตัดรายการ

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" คืนค่า ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### การตัดสตริง

คุณสามารถตัดและกำหนดเป้าหมายสตริงได้เหมือนกับรายการ:

```viml
:echo "choco"[0]
" คืนค่า "c"

:echo "choco"[1:3]
" คืนค่า "hoc"

:echo "choco"[:3]
" คืนค่า choc

:echo "choco"[1:]
" คืนค่า hoco
```

### คณิตศาสตร์ของรายการ

คุณสามารถใช้ `+` เพื่อเชื่อมต่อและเปลี่ยนแปลงรายการ:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" คืนค่า ["chocolate", "strawberry", "sugar"]
```

### ฟังก์ชันรายการ

มาสำรวจฟังก์ชันรายการในตัวของ Vim กันเถอะ

ในการหาความยาวของรายการ ให้ใช้ `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" คืนค่า 2
```

ในการเพิ่มองค์ประกอบไปยังรายการ คุณสามารถใช้ `insert()`:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" คืนค่า ["glazed", "chocolate", "strawberry"]
```

คุณยังสามารถส่ง `insert()` ไปยังดัชนีที่คุณต้องการเพิ่มองค์ประกอบได้ หากคุณต้องการเพิ่มรายการก่อนองค์ประกอบที่สอง (ดัชนี 1):

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" คืนค่า ['glazed', 'cream', 'chocolate', 'strawberry']
```

ในการลบรายการจากรายการ ให้ใช้ `remove()` ซึ่งจะรับรายการและดัชนีขององค์ประกอบที่คุณต้องการลบ

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" คืนค่า ['glazed', 'strawberry']
```

คุณสามารถใช้ `map()` และ `filter()` กับรายการได้ เพื่อกรององค์ประกอบที่มีวลี "choco":

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" คืนค่า ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" คืนค่า ['chocolate donut', 'glazed donut', 'sugar donut']
```

ตัวแปร `v:val` เป็นตัวแปรพิเศษของ Vim ซึ่งจะมีให้เมื่อทำการวนซ้ำรายการหรือพจนานุกรมโดยใช้ `map()` หรือ `filter()` มันแสดงถึงแต่ละรายการที่ถูกวนซ้ำ

สำหรับข้อมูลเพิ่มเติม ดูที่ `:h list-functions`.

### การแยกรายการ

คุณสามารถแยกรายการและกำหนดตัวแปรให้กับรายการได้:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" คืนค่า "chocolate"

:echo flavor2
" คืนค่า "glazed"
```

ในการกำหนดค่าของรายการที่เหลือ คุณสามารถใช้ `;` ตามด้วยชื่อตัวแปร:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" คืนค่า "apple"

:echo restFruits
" คืนค่า ['lemon', 'blueberry', 'raspberry']
```

### การแก้ไขรายการ

คุณสามารถแก้ไขรายการได้โดยตรง:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" คืนค่า ['sugar', 'glazed', 'plain']
```

คุณสามารถเปลี่ยนแปลงหลายรายการได้โดยตรง:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" คืนค่า ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## พจนานุกรม

พจนานุกรมของ Vimscript เป็นรายการที่ไม่เรียงลำดับและมีความสัมพันธ์กัน พจนานุกรมที่ไม่ว่างประกอบด้วยคู่กุญแจ-ค่าอย่างน้อยหนึ่งคู่

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

วัตถุข้อมูลพจนานุกรมของ Vim ใช้สตริงเป็นกุญแจ หากคุณพยายามใช้หมายเลข Vim จะบังคับให้มันเป็นสตริง

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" คืนค่า {'1': '7am', '2': '9am', '11ses': '11am'}
```

หากคุณขี้เกียจที่จะใส่เครื่องหมายคำพูดรอบ ๆ ทุกกุญแจ คุณสามารถใช้การเขียนแบบ `#{}`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" คืนค่า {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

ข้อกำหนดเดียวสำหรับการใช้ไวยากรณ์ `#{}` คือแต่ละกุญแจต้องเป็น:

- ตัวอักษร ASCII
- หมายเลข
- ขีดล่าง (`_`)
- ขีด (`-`)

เช่นเดียวกับรายการ คุณสามารถใช้ประเภทข้อมูลใด ๆ เป็นค่า

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### การเข้าถึงพจนานุกรม

ในการเข้าถึงค่าจากพจนานุกรม คุณสามารถเรียกกุญแจด้วยวงเล็บสี่เหลี่ยม (`['key']`) หรือการเขียนแบบจุด (`.key`)

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" คืนค่า "gruel omelettes"

:echo lunch
" คืนค่า "gruel sandwiches"
```

### การแก้ไขพจนานุกรม

คุณสามารถแก้ไขหรือแม้แต่เพิ่มเนื้อหาของพจนานุกรม:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" คืนค่า {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### ฟังก์ชันพจนานุกรม

มาสำรวจฟังก์ชันในตัวของ Vim บางส่วนที่ใช้จัดการพจนานุกรม

ในการตรวจสอบความยาวของพจนานุกรม ให้ใช้ `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" คืนค่า 3
```

ในการดูว่าพจนานุกรมมีคีย์เฉพาะหรือไม่ ให้ใช้ `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" คืนค่า 1

:echo has_key(mealPlans, "dessert")
" คืนค่า 0
```

ในการดูว่าพจนานุกรมมีรายการใด ๆ หรือไม่ ให้ใช้ `empty()` ฟังก์ชัน `empty()` ทำงานกับทุกประเภทข้อมูล: รายการ, พจนานุกรม, สตริง, หมายเลข, จำนวนทศนิยม เป็นต้น

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" คืนค่า 1

:echo empty(mealPlans)
" คืนค่า 0
```

ในการลบรายการจากพจนานุกรม ให้ใช้ `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "removing breakfast: " . remove(mealPlans, "breakfast")
" คืนค่า "removing breakfast: 'waffles'""

:echo mealPlans
" คืนค่า {'lunch': 'pancakes', 'dinner': 'donuts'}
```

ในการแปลงพจนานุกรมเป็นรายการของรายการ ให้ใช้ `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" คืนค่า [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` และ `map()` ก็มีให้ใช้เช่นกัน

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" คืนค่า {'2': '9am', '11ses': '11am'}
```

เนื่องจากพจนานุกรมมีคู่กุญแจ-ค่า Vim จึงให้ตัวแปรพิเศษ `v:key` ซึ่งทำงานคล้ายกับ `v:val` เมื่อวนซ้ำผ่านพจนานุกรม `v:key` จะถือค่าของกุญแจที่ถูกวนซ้ำในปัจจุบัน

หากคุณมีพจนานุกรม `mealPlans` คุณสามารถทำการแมพโดยใช้ `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " and milk"')

:echo mealPlans
" คืนค่า {'lunch': 'lunch and milk', 'breakfast': 'breakfast and milk', 'dinner': 'dinner and milk'}
```

ในทำนองเดียวกัน คุณสามารถทำการแมพโดยใช้ `v:val`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " and milk"')

:echo mealPlans
" คืนค่า {'lunch': 'pancakes and milk', 'breakfast': 'waffles and milk', 'dinner': 'donuts and milk'}
```

เพื่อดูฟังก์ชันพจนานุกรมเพิ่มเติม โปรดดูที่ `:h dict-functions`.

## พื้นฐานพิเศษ

Vim มีพื้นฐานพิเศษ:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

โดยทั่วไป `v:` เป็นตัวแปรในตัวของ Vim ซึ่งจะมีการอธิบายเพิ่มเติมในบทต่อไป

จากประสบการณ์ของฉัน คุณจะไม่ใช้พื้นฐานพิเศษเหล่านี้บ่อยนัก หากคุณต้องการค่าที่เป็นจริง / ไม่เป็นจริง คุณสามารถใช้ 0 (ไม่เป็นจริง) และไม่ใช่ 0 (เป็นจริง) หากคุณต้องการสตริงว่าง ให้ใช้ `""` แต่ก็ยังดีที่จะรู้ ดังนั้นเรามาดูพวกมันอย่างรวดเร็ว

### จริง

นี่เทียบเท่ากับ `true` มันเทียบเท่ากับหมายเลขที่มีค่าไม่เป็น 0 เมื่อทำการถอดรหัส json ด้วย `json_encode()` มันจะถูกตีความว่า "จริง"

```shell
:echo json_encode({"test": v:true})
" คืนค่า {"test": true}
```

### เท็จ

นี่เทียบเท่ากับ `false` มันเทียบเท่ากับหมายเลขที่มีค่า 0 เมื่อทำการถอดรหัส json ด้วย `json_encode()` มันจะถูกตีความว่า "เท็จ"

```shell
:echo json_encode({"test": v:false})
" คืนค่า {"test": false}
```

### ไม่มี

มันเทียบเท่ากับสตริงว่าง เมื่อทำการถอดรหัส json ด้วย `json_encode()` มันจะถูกตีความว่าเป็นรายการว่าง (`null`)

```shell
:echo json_encode({"test": v:none})
" คืนค่า {"test": null}
```

### Null

คล้ายกับ `v:none`.

```shell
:echo json_encode({"test": v:null})
" คืนค่า {"test": null}
```

## เรียนรู้ประเภทข้อมูลอย่างชาญฉลาด

ในบทนี้ คุณได้เรียนรู้เกี่ยวกับประเภทข้อมูลพื้นฐานของ Vimscript: หมายเลข, จำนวนทศนิยม, สตริง, รายการ, พจนานุกรม และพิเศษ การเรียนรู้เหล่านี้เป็นขั้นตอนแรกในการเริ่มต้นการเขียนโปรแกรม Vimscript

ในบทถัดไป คุณจะได้เรียนรู้วิธีการรวมพวกมันเพื่อเขียนนิพจน์เช่น ความเท่าเทียม, เงื่อนไข และลูป