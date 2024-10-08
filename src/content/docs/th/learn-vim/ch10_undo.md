---
description: เอกสารนี้สอนการใช้ฟีเจอร์ Undo และ Redo ใน Vim รวมถึงการนำทางในสาขา Undo
  และการจัดการสถานะข้อความที่เคยพิมพ์
title: Ch10. Undo
---

เราทุกคนทำผิดพลาดในการพิมพ์กันทั้งนั้น นั่นคือเหตุผลที่การย้อนกลับ (undo) เป็นฟีเจอร์ที่สำคัญในซอฟต์แวร์สมัยใหม่ทุกตัว ระบบการย้อนกลับของ Vim ไม่เพียงแต่สามารถย้อนกลับและทำซ้ำข้อผิดพลาดง่ายๆ ได้ แต่ยังสามารถเข้าถึงสถานะข้อความที่แตกต่างกัน ทำให้คุณควบคุมข้อความทั้งหมดที่คุณเคยพิมพ์ ในบทนี้ คุณจะได้เรียนรู้วิธีการย้อนกลับ ทำซ้ำ นำทางไปยังสาขาการย้อนกลับ ย้อนกลับอย่างถาวร และเดินทางข้ามเวลา

## ย้อนกลับ, ทำซ้ำ, และ UNDO

ในการทำการย้อนกลับพื้นฐาน คุณสามารถใช้ `u` หรือรัน `:undo` 

ถ้าคุณมีข้อความนี้ (สังเกตบรรทัดว่างด้านล่าง "one"):

```shell
one

```

จากนั้นคุณเพิ่มข้อความอีกหนึ่งข้อความ:

```shell
one
two
```

ถ้าคุณกด `u` Vim จะย้อนกลับข้อความ "two"

Vim รู้ได้อย่างไรว่าเราจะย้อนกลับมากแค่ไหน? Vim จะย้อนกลับการ "เปลี่ยนแปลง" หนึ่งครั้งในแต่ละครั้ง คล้ายกับการเปลี่ยนแปลงของคำสั่งจุด (dot command) (แตกต่างจากคำสั่งจุด คำสั่งในบรรทัดคำสั่งยังนับเป็นการเปลี่ยนแปลง)

ในการทำซ้ำการเปลี่ยนแปลงล่าสุด กด `Ctrl-R` หรือรัน `:redo` หลังจากที่คุณย้อนกลับข้อความด้านบนเพื่อลบ "two" การรัน `Ctrl-R` จะทำให้ข้อความที่ถูกลบกลับมา

Vim ยังมี UNDO ที่คุณสามารถรันด้วย `U` มันจะย้อนกลับการเปลี่ยนแปลงล่าสุดทั้งหมด

`U` แตกต่างจาก `u` อย่างไร? ก่อนอื่น `U` จะลบ *ทั้งหมด* การเปลี่ยนแปลงในบรรทัดที่มีการเปลี่ยนแปลงล่าสุด ในขณะที่ `u` จะลบเพียงการเปลี่ยนแปลงหนึ่งครั้งในแต่ละครั้ง ประการที่สอง ขณะที่การทำ `u` จะไม่นับเป็นการเปลี่ยนแปลง การทำ `U` จะนับเป็นการเปลี่ยนแปลง

กลับไปที่ตัวอย่างนี้:

```shell
one
two
```

เปลี่ยนบรรทัดที่สองเป็น "three":

```shell
one
three
```

เปลี่ยนบรรทัดที่สองอีกครั้งและแทนที่ด้วย "four":

```shell
one
four
```

ถ้าคุณกด `u` คุณจะเห็น "three" ถ้าคุณกด `u` อีกครั้ง คุณจะเห็น "two" ถ้าแทนที่จะกด `u` เมื่อคุณยังมีข้อความ "four" คุณได้กด `U` คุณจะเห็น:

```shell
one

```

`U` จะข้ามการเปลี่ยนแปลงทั้งหมดไปยังสถานะเดิมเมื่อคุณเริ่มต้น (บรรทัดว่าง) นอกจากนี้ เนื่องจาก UNDO จริงๆ แล้วสร้างการเปลี่ยนแปลงใหม่ใน Vim คุณสามารถย้อนกลับการย้อนกลับของคุณได้ `U` ตามด้วย `U` จะย้อนกลับตัวมันเอง คุณสามารถกด `U` แล้ว `U` แล้ว `U` เป็นต้น คุณจะเห็นสถานะข้อความสองสถานะสลับกันไปมา

ส่วนตัวแล้วฉันไม่ใช้ `U` เพราะมันยากที่จะจำสถานะเดิม (ฉันแทบไม่เคยต้องการมัน)

Vim ตั้งค่าจำนวนสูงสุดของจำนวนครั้งที่คุณสามารถย้อนกลับในตัวแปรตัวเลือก `undolevels` คุณสามารถตรวจสอบได้ด้วย `:echo &undolevels` ฉันตั้งค่าให้เป็น 1000 ของฉัน หากคุณต้องการเปลี่ยนของคุณให้เป็น 1000 ให้รัน `:set undolevels=1000` คุณสามารถตั้งค่าเป็นจำนวนใดก็ได้ที่คุณต้องการ

## การทำลายบล็อก

ฉันได้กล่าวไปแล้วว่า `u` จะย้อนกลับการ "เปลี่ยนแปลง" หนึ่งครั้งคล้ายกับการเปลี่ยนแปลงของคำสั่งจุด: ข้อความที่ถูกแทรกตั้งแต่เมื่อคุณเข้าสู่โหมดการแทรกจนถึงเมื่อคุณออกจากมันจะนับเป็นการเปลี่ยนแปลง

ถ้าคุณทำ `ione two three<Esc>` แล้วกด `u` Vim จะลบข้อความทั้งหมด "one two three" เพราะทั้งหมดจะนับเป็นการเปลี่ยนแปลง นี่ไม่ใช่เรื่องใหญ่ถ้าคุณเขียนข้อความสั้นๆ แต่ถ้าคุณเขียนหลายย่อหน้าในเซสชันโหมดการแทรกโดยไม่ออก และต่อมาคุณตระหนักว่าคุณทำผิดพลาด? ถ้าคุณกด `u` ทุกอย่างที่คุณเขียนจะถูกลบไป จะไม่เป็นประโยชน์หากคุณสามารถกด `u` เพื่อเอาเฉพาะส่วนหนึ่งของข้อความของคุณออก?

โชคดีที่คุณสามารถทำลายบล็อกการย้อนกลับได้ เมื่อคุณพิมพ์ในโหมดการแทรก การกด `Ctrl-G u` จะสร้างจุดหยุดการย้อนกลับ ตัวอย่างเช่น ถ้าคุณทำ `ione <Ctrl-G u>two <Ctrl-G u>three<Esc>` แล้วกด `u` คุณจะสูญเสียเพียงข้อความ "three" (กด `u` อีกครั้งเพื่อลบ "two") เมื่อคุณเขียนข้อความยาว ใช้ `Ctrl-G u` อย่างมีกลยุทธ์ จุดสิ้นสุดของแต่ละประโยค ระหว่างสองย่อหน้า หรือหลังจากแต่ละบรรทัดของโค้ดเป็นสถานที่ที่เหมาะสมในการเพิ่มจุดหยุดการย้อนกลับเพื่อทำให้การย้อนกลับข้อผิดพลาดของคุณง่ายขึ้นหากคุณเคยทำผิด

มันยังมีประโยชน์ในการสร้างจุดหยุดการย้อนกลับเมื่อคุณลบชิ้นส่วนในโหมดการแทรกด้วย `Ctrl-W` (ลบคำก่อนเคอร์เซอร์) และ `Ctrl-U` (ลบข้อความทั้งหมดก่อนเคอร์เซอร์) เพื่อนของฉันแนะนำให้ใช้แมพต่อไปนี้:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

ด้วยสิ่งเหล่านี้ คุณสามารถกู้คืนข้อความที่ถูกลบได้อย่างง่ายดาย

## ต้นไม้การย้อนกลับ

Vim เก็บการเปลี่ยนแปลงทุกครั้งที่เขียนไว้ในต้นไม้การย้อนกลับ เริ่มไฟล์ว่างใหม่ จากนั้นเพิ่มข้อความใหม่:

```shell
one

```

เพิ่มข้อความใหม่:

```shell
one
two
```

ย้อนกลับหนึ่งครั้ง:

```shell
one

```

เพิ่มข้อความที่แตกต่างออกไป:

```shell
one
three
```

ย้อนกลับอีกครั้ง:

```shell
one

```

และเพิ่มข้อความที่แตกต่างอีกหนึ่งข้อความ:

```shell
one
four
```

ตอนนี้ถ้าคุณย้อนกลับ คุณจะสูญเสียข้อความ "four" ที่คุณเพิ่งเพิ่ม:

```shell
one

```

ถ้าคุณย้อนกลับอีกครั้ง:

```shell

```

คุณจะสูญเสียข้อความ "one" ในโปรแกรมแก้ไขข้อความส่วนใหญ่ การนำข้อความ "two" และ "three" กลับมาอาจจะเป็นไปไม่ได้ แต่ไม่ใช่กับ Vim! กด `g+` และคุณจะได้ข้อความ "one" กลับมา:

```shell
one

```

พิมพ์ `g+` อีกครั้งและคุณจะเห็นเพื่อนเก่า:

```shell
one
two
```

เรามาต่อกัน กด `g+` อีกครั้ง:

```shell
one
three
```

กด `g+` อีกครั้ง:

```shell
one
four
```

ใน Vim ทุกครั้งที่คุณกด `u` และจากนั้นทำการเปลี่ยนแปลงที่แตกต่างกัน Vim จะเก็บข้อความจากสถานะก่อนหน้าโดยการสร้าง "สาขาการย้อนกลับ" ในตัวอย่างนี้ หลังจากที่คุณพิมพ์ "two" แล้วกด `u` จากนั้นพิมพ์ "three" คุณได้สร้างสาขาใบที่เก็บสถานะที่มีข้อความ "two" ในขณะนั้น ต้นไม้การย้อนกลับมีอย่างน้อยสองโหนดใบ: โหนดหลักที่มีข้อความ "three" (ล่าสุด) และโหนดสาขาการย้อนกลับที่มีข้อความ "two" หากคุณได้ทำการย้อนกลับอีกครั้งและพิมพ์ข้อความ "four" คุณจะมีสามโหนด: โหนดหลักที่มีข้อความ "four" และสองโหนดที่มีข้อความ "three" และ "two"

ในการเดินทางไปยังแต่ละโหนดของต้นไม้การย้อนกลับ คุณสามารถใช้ `g+` เพื่อไปยังสถานะใหม่กว่าและ `g-` เพื่อไปยังสถานะเก่ากว่า ความแตกต่างระหว่าง `u`, `Ctrl-R`, `g+`, และ `g-` คือทั้ง `u` และ `Ctrl-R` จะเดินทางเฉพาะโหนด *หลัก* ในต้นไม้การย้อนกลับ ในขณะที่ `g+` และ `g-` จะเดินทางไปยัง *ทุก* โหนดในต้นไม้การย้อนกลับ

ต้นไม้การย้อนกลับไม่ง่ายที่จะมองเห็น ฉันพบว่า [vim-mundo](https://github.com/simnalamburt/vim-mundo) ปลั๊กอินมีประโยชน์มากในการช่วยมองเห็นต้นไม้การย้อนกลับของ Vim ใช้เวลาสักครู่ในการเล่นกับมัน

## การย้อนกลับอย่างถาวร

ถ้าคุณเริ่ม Vim เปิดไฟล์ และกด `u` ทันที Vim อาจจะแสดงคำเตือน "*Already at oldest change*" ไม่มีอะไรให้ย้อนกลับเพราะคุณยังไม่ได้ทำการเปลี่ยนแปลงใดๆ 

เพื่อให้ประวัติการย้อนกลับจากเซสชันการแก้ไขล่าสุด Vim สามารถเก็บประวัติการย้อนกลับของคุณด้วยไฟล์ย้อนกลับด้วย `:wundo`

สร้างไฟล์ `mynumbers.txt` พิมพ์:

```shell
one
```

จากนั้นพิมพ์อีกหนึ่งบรรทัด (ตรวจสอบให้แน่ใจว่าทุกบรรทัดนับเป็นการเปลี่ยนแปลง):

```shell
one
two
```

พิมพ์อีกหนึ่งบรรทัด:

```shell
one
two
three
```

ตอนนี้สร้างไฟล์ย้อนกลับของคุณด้วย `:wundo {my-undo-file}` หากคุณต้องการเขียนทับไฟล์ย้อนกลับที่มีอยู่แล้ว คุณสามารถเพิ่ม `!` หลัง `wundo`

```shell
:wundo! mynumbers.undo
```

จากนั้นออกจาก Vim

ตอนนี้คุณควรมีไฟล์ `mynumbers.txt` และ `mynumbers.undo` ในไดเรกทอรีของคุณ เปิดไฟล์ `mynumbers.txt` อีกครั้งและลองกด `u` คุณไม่สามารถทำได้ คุณยังไม่ได้ทำการเปลี่ยนแปลงใดๆ ตั้งแต่คุณเปิดไฟล์ ตอนนี้โหลดประวัติการย้อนกลับของคุณโดยการอ่านไฟล์ย้อนกลับด้วย `:rundo`:

```shell
:rundo mynumbers.undo
```

ตอนนี้ถ้าคุณกด `u` Vim จะลบ "three" กด `u` อีกครั้งเพื่อลบ "two" มันเหมือนกับว่าคุณไม่เคยปิด Vim เลย!

ถ้าคุณต้องการให้การย้อนกลับอย่างถาวรเป็นอัตโนมัติ หนึ่งในวิธีการทำคือการเพิ่มสิ่งเหล่านี้ใน vimrc:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

การตั้งค่าข้างต้นจะวางไฟล์ย้อนกลับทั้งหมดในไดเรกทอรีศูนย์กลางเดียว ไดเรกทอรี `~/.vim` ชื่อ `undo_dir` เป็นชื่อที่ตั้งขึ้นเอง `set undofile` บอกให้ Vim เปิดใช้งานฟีเจอร์ `undofile` เพราะมันปิดอยู่ตามค่าเริ่มต้น ตอนนี้ทุกครั้งที่คุณบันทึก Vim จะสร้างและอัปเดตไฟล์ที่เกี่ยวข้องภายในไดเรกทอรี `undo_dir` โดยอัตโนมัติ (ตรวจสอบให้แน่ใจว่าคุณสร้างไดเรกทอรี `undo_dir` ที่แท้จริงภายในไดเรกทอรี `~/.vim` ก่อนที่จะรันสิ่งนี้)

## การเดินทางข้ามเวลา

ใครพูดว่าการเดินทางข้ามเวลาไม่มีอยู่จริง? Vim สามารถเดินทางไปยังสถานะข้อความในอดีตด้วยคำสั่ง `:earlier`

ถ้าคุณมีข้อความนี้:

```shell
one

```
จากนั้นต่อมาคุณเพิ่ม:

```shell
one
two
```

ถ้าคุณพิมพ์ "two" น้อยกว่า 10 วินาทีที่ผ่านมา คุณสามารถกลับไปยังสถานะที่ "two" ไม่ได้มีอยู่เมื่อ 10 วินาทีที่แล้วด้วย:

```shell
:earlier 10s
```

คุณสามารถใช้ `:undolist` เพื่อตรวจสอบว่าเมื่อไหร่การเปลี่ยนแปลงล่าสุดถูกทำขึ้น `:earlier` ยังรับพารามิเตอร์ที่แตกต่างกัน:

```shell
:earlier 10s    ไปยังสถานะ 10 วินาทีที่แล้ว
:earlier 10m    ไปยังสถานะ 10 นาทีที่แล้ว
:earlier 10h    ไปยังสถานะ 10 ชั่วโมงที่แล้ว
:earlier 10d    ไปยังสถานะ 10 วันที่แล้ว
```

นอกจากนี้ มันยังรับ `count` เป็นพารามิเตอร์เพื่อบอกให้ Vim ไปยังสถานะเก่ากว่า `count` ครั้ง ตัวอย่างเช่น ถ้าคุณทำ `:earlier 2` Vim จะกลับไปยังสถานะข้อความเก่ากว่าสองการเปลี่ยนแปลง มันเหมือนกับการทำ `g-` สองครั้ง คุณยังสามารถบอกให้มันไปยังสถานะข้อความเก่ากว่า 10 การบันทึกด้วย `:earlier 10f`

ชุดพารามิเตอร์เดียวกันนี้ทำงานร่วมกับคำสั่ง `:earlier` ที่ตรงกัน: `:later`

```shell
:later 10s    ไปยังสถานะ 10 วินาทีถัดไป
:later 10m    ไปยังสถานะ 10 นาทีถัดไป
:later 10h    ไปยังสถานะ 10 ชั่วโมงถัดไป
:later 10d    ไปยังสถานะ 10 วันที่ถัดไป
:later 10     ไปยังสถานะใหม่กว่า 10 ครั้ง
:later 10f    ไปยังสถานะ 10 การบันทึกถัดไป
```

## เรียนรู้การย้อนกลับอย่างชาญฉลาด

`u` และ `Ctrl-R` เป็นสองคำสั่ง Vim ที่ขาดไม่ได้สำหรับการแก้ไขข้อผิดพลาด เรียนรู้พวกมันก่อน จากนั้นเรียนรู้วิธีการใช้ `:earlier` และ `:later` โดยใช้พารามิเตอร์เวลาเป็นอันดับแรก หลังจากนั้น ใช้เวลาของคุณในการเข้าใจต้นไม้การย้อนกลับ ปลั๊กอิน [vim-mundo](https://github.com/simnalamburt/vim-mundo) ช่วยฉันได้มาก พิมพ์ตามข้อความในบทนี้และตรวจสอบต้นไม้การย้อนกลับเมื่อคุณทำการเปลี่ยนแปลงแต่ละครั้ง เมื่อคุณเข้าใจมันแล้ว คุณจะไม่เห็นระบบการย้อนกลับในแบบเดิมอีกต่อไป

ก่อนหน้านี้ในบทนี้ คุณได้เรียนรู้วิธีการค้นหาข้อความใดๆ ในพื้นที่โปรเจกต์ ด้วยการย้อนกลับ คุณสามารถค้นหาข้อความใดๆ ในมิติของเวลาได้แล้ว คุณสามารถค้นหาข้อความใดๆ ตามตำแหน่งและเวลาที่เขียน คุณได้บรรลุถึงการมีอยู่ของ Vim อย่างทั่วถึง