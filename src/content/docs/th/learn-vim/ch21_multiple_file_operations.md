---
description: เรียนรู้วิธีการแก้ไขไฟล์หลายไฟล์ใน Vim ด้วยคำสั่งต่างๆ เช่น `argdo`,
  `bufdo`, `cdo` และอื่นๆ เพื่อเพิ่มประสิทธิภาพในการแก้ไข.
title: Ch21. Multiple File Operations
---

การสามารถอัปเดตในหลายไฟล์เป็นเครื่องมือการแก้ไขที่มีประโยชน์อีกอย่างหนึ่งที่ควรมี เมื่อก่อนคุณได้เรียนรู้วิธีการอัปเดตข้อความหลาย ๆ ข้อด้วย `cfdo` ในบทนี้ คุณจะได้เรียนรู้วิธีการที่แตกต่างกันในการแก้ไขหลายไฟล์ใน Vim

## วิธีการต่าง ๆ ในการดำเนินการคำสั่งในหลายไฟล์

Vim มีวิธีการในการดำเนินการคำสั่งในหลายไฟล์ทั้งหมดแปดวิธี:
- arg list (`argdo`)
- buffer list (`bufdo`)
- window list (`windo`)
- tab list (`tabdo`)
- quickfix list (`cdo`)
- quickfix list filewise (`cfdo`)
- location list (`ldo`)
- location list filewise (`lfdo`)

ในทางปฏิบัติ คุณอาจจะใช้เพียงหนึ่งหรือสองวิธีในส่วนใหญ่ (ส่วนตัวแล้วฉันใช้ `cdo` และ `argdo` มากกว่าวิธีอื่น ๆ) แต่ก็ดีที่จะเรียนรู้เกี่ยวกับตัวเลือกทั้งหมดที่มีอยู่และใช้ตัวเลือกที่ตรงกับสไตล์การแก้ไขของคุณ

การเรียนรู้คำสั่งแปดคำสั่งอาจฟังดูน่ากลัว แต่ในความเป็นจริง คำสั่งเหล่านี้ทำงานคล้ายกัน หลังจากเรียนรู้หนึ่งคำสั่ง การเรียนรู้คำสั่งที่เหลือจะง่ายขึ้น พวกเขาทั้งหมดมีแนวคิดใหญ่เหมือนกัน: สร้างรายการของหมวดหมู่ที่เกี่ยวข้องแล้วส่งคำสั่งที่คุณต้องการรัน

## รายการอาร์กิวเมนต์

รายการอาร์กิวเมนต์เป็นรายการพื้นฐานที่สุด มันสร้างรายการของไฟล์ เพื่อสร้างรายการของ file1, file2, และ file3 คุณสามารถรัน:

```shell
:args file1 file2 file3
```

คุณยังสามารถส่งมันด้วย wildcard (`*`), ดังนั้นถ้าคุณต้องการสร้างรายการของไฟล์ `.js` ทั้งหมดในไดเรกทอรีปัจจุบัน ให้รัน:

```shell
:args *.js
```

ถ้าคุณต้องการสร้างรายการของไฟล์ Javascript ทั้งหมดที่เริ่มต้นด้วย "a" ในไดเรกทอรีปัจจุบัน ให้รัน:

```shell
:args a*.js
```

wildcard จะตรงกับหนึ่งหรือมากกว่าตัวอักษรชื่อไฟล์ใด ๆ ในไดเรกทอรีปัจจุบัน แต่ถ้าคุณต้องการค้นหาแบบ recursive ในไดเรกทอรีใด ๆ คุณสามารถใช้ double wildcard (`**`). เพื่อให้ได้ไฟล์ Javascript ทั้งหมดภายในไดเรกทอรีในตำแหน่งปัจจุบันของคุณ ให้รัน:

```shell
:args **/*.js
```

เมื่อคุณรันคำสั่ง `args` buffer ปัจจุบันของคุณจะถูกเปลี่ยนไปยังรายการแรกในรายการนั้น เพื่อดูรายการไฟล์ที่คุณเพิ่งสร้าง ให้รัน `:args` เมื่อคุณสร้างรายการของคุณแล้ว คุณสามารถเดินทางผ่านพวกมันได้ `:first` จะนำคุณไปยังรายการแรกในรายการ `:last` จะนำคุณไปยังรายการสุดท้าย เพื่อเคลื่อนที่ในรายการไปข้างหน้าทีละไฟล์ ให้รัน `:next` เพื่อเคลื่อนที่ในรายการถอยหลังทีละไฟล์ ให้รัน `:prev` เพื่อเคลื่อนที่ไปข้างหน้า / ถอยหลังทีละไฟล์และบันทึกการเปลี่ยนแปลง ให้รัน `:wnext` และ `:wprev` ยังมีคำสั่งการนำทางอีกมากมาย ตรวจสอบ `:h arglist` สำหรับข้อมูลเพิ่มเติม

รายการอาร์กิวเมนต์มีประโยชน์หากคุณต้องการเป้าหมายไฟล์ประเภทเฉพาะหรือไฟล์ไม่กี่ไฟล์ บางทีคุณอาจต้องการอัปเดต "donut" ทั้งหมดเป็น "pancake" ภายในไฟล์ `yml` ทั้งหมด คุณสามารถทำได้:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

ถ้าคุณรันคำสั่ง `args` อีกครั้ง มันจะแทนที่รายการก่อนหน้า ตัวอย่างเช่น ถ้าคุณเคยรัน:

```shell
:args file1 file2 file3
```

สมมติว่าไฟล์เหล่านี้มีอยู่ ตอนนี้คุณมีรายการของ `file1`, `file2`, และ `file3` จากนั้นคุณรันคำสั่งนี้:

```shell
:args file4 file5
```

รายการเริ่มต้นของ `file1`, `file2`, และ `file3` จะถูกแทนที่ด้วย `file4` และ `file5` หากคุณมี `file1`, `file2`, และ `file3` ในรายการอาร์กิวเมนต์ของคุณและคุณต้องการ *เพิ่ม* `file4` และ `file5` ลงในรายการไฟล์เริ่มต้นของคุณ ให้ใช้คำสั่ง `:arga` รัน:

```shell
:arga file4 file5
```

ตอนนี้คุณมี `file1`, `file2`, `file3`, `file4`, และ `file5` ในรายการอาร์กิวเมนต์ของคุณ

หากคุณรัน `:arga` โดยไม่มีอาร์กิวเมนต์ใด ๆ Vim จะเพิ่ม buffer ปัจจุบันของคุณลงในรายการอาร์กิวเมนต์ปัจจุบัน หากคุณมี `file1`, `file2`, และ `file3` ในรายการอาร์กิวเมนต์ของคุณและ buffer ปัจจุบันของคุณอยู่ที่ `file5` การรัน `:arga` จะเพิ่ม `file5` ลงในรายการ

เมื่อคุณมีรายการแล้ว คุณสามารถส่งมันด้วยคำสั่งบรรทัดคำสั่งใด ๆ ที่คุณเลือก คุณได้เห็นการทำเช่นนี้ด้วยการแทนที่ (`:argdo %s/donut/pancake/g`). ตัวอย่างอื่น ๆ:
- เพื่อลบทุกบรรทัดที่มี "dessert" ในรายการอาร์กิวเมนต์ ให้รัน `:argdo g/dessert/d`.
- เพื่อดำเนินการ macro a (สมมติว่าคุณได้บันทึกบางอย่างใน macro a) ในรายการอาร์กิวเมนต์ ให้รัน `:argdo norm @a`.
- เพื่อเขียน "hello " ตามด้วยชื่อไฟล์ในบรรทัดแรก ให้รัน `:argdo 0put='hello ' .. @:`.

เมื่อคุณทำเสร็จแล้ว อย่าลืมบันทึกด้วย `:update`.

บางครั้งคุณต้องการรันคำสั่งเฉพาะในรายการอาร์กิวเมนต์ n รายการแรก หากเป็นกรณีนี้ เพียงส่งที่อยู่ไปยังคำสั่ง `argdo` ตัวอย่างเช่น เพื่อรันคำสั่งแทนที่เฉพาะใน 3 รายการแรกจากรายการ ให้รัน `:1,3argdo %s/donut/pancake/g`.

## รายการบัฟเฟอร์

รายการบัฟเฟอร์จะถูกสร้างขึ้นโดยธรรมชาติเมื่อคุณแก้ไขไฟล์ใหม่ เพราะทุกครั้งที่คุณสร้างไฟล์ใหม่ / เปิดไฟล์ Vim จะบันทึกมันในบัฟเฟอร์ (เว้นแต่คุณจะลบมันอย่างชัดเจน) ดังนั้นถ้าคุณเปิดไฟล์ 3 ไฟล์แล้ว: `file1.rb file2.rb file3.rb` คุณมี 3 รายการในรายการบัฟเฟอร์ของคุณแล้ว เพื่อแสดงรายการบัฟเฟอร์ ให้รัน `:buffers` (หรือ `:ls` หรือ `:files`). เพื่อเดินทางไปข้างหน้าและถอยหลัง ใช้ `:bnext` และ `:bprev`. เพื่อไปยังบัฟเฟอร์แรกและสุดท้ายจากรายการ ใช้ `:bfirst` และ `:blast` (สนุกกันอยู่หรือเปล่า? :D).

โดยวิธีการ นี่คือเคล็ดลับบัฟเฟอร์ที่เจ๋งซึ่งไม่เกี่ยวข้องกับบทนี้: หากคุณมีจำนวนรายการในรายการบัฟเฟอร์ของคุณ คุณสามารถแสดงทั้งหมดด้วย `:ball` (บัฟเฟอร์ทั้งหมด). คำสั่ง `ball` จะแสดงบัฟเฟอร์ทั้งหมดในแนวนอน เพื่อแสดงในแนวตั้ง ให้รัน `:vertical ball`.

กลับมาที่หัวข้อ กลไกในการดำเนินการข้ามบัฟเฟอร์ทั้งหมดนั้นคล้ายกับรายการอาร์กิวเมนต์ เมื่อคุณสร้างรายการบัฟเฟอร์ของคุณแล้ว คุณเพียงแค่ต้องนำหน้าคำสั่งที่คุณต้องการรันด้วย `:bufdo` แทนที่จะเป็น `:argdo`. ดังนั้นถ้าคุณต้องการแทนที่ "donut" ทั้งหมดด้วย "pancake" ข้ามบัฟเฟอร์ทั้งหมดและบันทึกการเปลี่ยนแปลง ให้รัน `:bufdo %s/donut/pancake/g | update`.

## รายการหน้าต่างและแท็บ

รายการหน้าต่างและแท็บก็คล้ายกับรายการอาร์กิวเมนต์และบัฟเฟอร์ ความแตกต่างเพียงอย่างเดียวคือบริบทและไวยากรณ์ของพวกเขา

การดำเนินการหน้าต่างจะดำเนินการในแต่ละหน้าต่างที่เปิดอยู่และดำเนินการด้วย `:windo`. การดำเนินการแท็บจะดำเนินการในแต่ละแท็บที่คุณเปิดอยู่และดำเนินการด้วย `:tabdo`. สำหรับข้อมูลเพิ่มเติม ตรวจสอบ `:h list-repeat`, `:h :windo`, และ `:h :tabdo`.

ตัวอย่างเช่น หากคุณมีหน้าต่างสามหน้าต่างเปิดอยู่ (คุณสามารถเปิดหน้าต่างใหม่ด้วย `Ctrl-W v` สำหรับหน้าต่างแนวตั้งและ `Ctrl-W s` สำหรับหน้าต่างแนวนอน) และคุณรัน `:windo 0put ='hello' . @%`, Vim จะส่งออก "hello" + ชื่อไฟล์ไปยังหน้าต่างที่เปิดอยู่ทั้งหมด

## รายการ Quickfix

ในบทก่อนหน้านี้ (Ch3 และ Ch19) ฉันได้พูดถึง quickfixes. Quickfix มีการใช้งานมากมาย ปลั๊กอินยอดนิยมหลายตัวใช้ quickfixes ดังนั้นจึงดีที่จะใช้เวลาเพิ่มเติมในการทำความเข้าใจพวกเขา

หากคุณเป็นมือใหม่ใน Vim quickfix อาจเป็นแนวคิดใหม่ ในสมัยก่อนเมื่อคุณต้องคอมไพล์โค้ดของคุณอย่างชัดเจน ในระหว่างขั้นตอนการคอมไพล์คุณจะพบข้อผิดพลาด เพื่อแสดงข้อผิดพลาดเหล่านี้ คุณต้องมีหน้าต่างพิเศษ นั่นคือที่มาของ quickfix เมื่อคุณคอมไพล์โค้ดของคุณ Vim จะแสดงข้อความข้อผิดพลาดในหน้าต่าง quickfix เพื่อให้คุณสามารถแก้ไขได้ในภายหลัง หลายภาษาสมัยใหม่ไม่ต้องการการคอมไพล์อย่างชัดเจนอีกต่อไป แต่ก็ไม่ได้ทำให้ quickfix ล้าสมัย ในปัจจุบันผู้คนใช้ quickfix สำหรับสิ่งต่าง ๆ มากมาย เช่น การแสดงผลลัพธ์ของเทอร์มินัลเสมือนและการเก็บผลลัพธ์การค้นหา มามุ่งเน้นไปที่สิ่งหลัง การเก็บผลลัพธ์การค้นหา

นอกจากคำสั่งคอมไพล์แล้ว คำสั่ง Vim บางคำสั่งยังอิงจากอินเทอร์เฟซ quickfix หนึ่งประเภทของคำสั่งที่ใช้ quickfixes อย่างหนักคือคำสั่งค้นหา ทั้ง `:vimgrep` และ `:grep` ใช้ quickfixes โดยค่าเริ่มต้น

ตัวอย่างเช่น หากคุณต้องการค้นหา "donut" ในไฟล์ Javascript ทั้งหมดแบบ recursive คุณสามารถรัน:

```shell
:vimgrep /donut/ **/*.js
```

ผลลัพธ์สำหรับการค้นหา "donut" จะถูกเก็บไว้ในหน้าต่าง quickfix เพื่อดูผลลัพธ์การจับคู่เหล่านี้ในหน้าต่าง quickfix ให้รัน:

```shell
:copen
```

เพื่อปิดมัน ให้รัน:

```shell
:cclose
```

เพื่อเดินทางในรายการ quickfix ไปข้างหน้าและถอยหลัง ให้รัน:

```shell
:cnext
:cprev
```

เพื่อไปยังรายการแรกและสุดท้ายในผลลัพธ์ ให้รัน:

```shell
:cfirst
:clast
```

เมื่อก่อนฉันได้กล่าวถึงว่ามีคำสั่ง quickfix สองคำสั่ง: `cdo` และ `cfdo`. พวกเขามีความแตกต่างกันอย่างไร? `cdo` จะดำเนินการคำสั่งสำหรับแต่ละรายการในรายการ quickfix ในขณะที่ `cfdo` จะดำเนินการคำสั่งสำหรับแต่ละ *ไฟล์* ในรายการ quickfix

ให้ฉันชี้แจง สมมติว่าหลังจากรันคำสั่ง `vimgrep` ข้างต้น คุณพบ:
- 1 ผลลัพธ์ใน `file1.js`
- 10 ผลลัพธ์ใน `file2.js`

หากคุณรัน `:cfdo %s/donut/pancake/g`, นี่จะทำให้ `%s/donut/pancake/g` รันเพียงครั้งเดียวใน `file1.js` และอีกครั้งใน `file2.js` มันจะรัน *ตามจำนวนไฟล์ในผลลัพธ์* เนื่องจากมีสองไฟล์ในผลลัพธ์ Vim จึงดำเนินการคำสั่งแทนที่ครั้งหนึ่งใน `file1.js` และอีกครั้งใน `file2.js` แม้ว่าจะมีการจับคู่ 10 ครั้งในไฟล์ที่สอง `cfdo` จะสนใจแค่จำนวนไฟล์ทั้งหมดในรายการ quickfix

หากคุณรัน `:cdo %s/donut/pancake/g`, นี่จะทำให้ `%s/donut/pancake/g` รันครั้งเดียวใน `file1.js` และ *สิบครั้ง* ใน `file2.js` มันจะรันตามจำนวนรายการจริงในรายการ quickfix เนื่องจากมีการจับคู่เพียงหนึ่งครั้งใน `file1.js` และ 10 ครั้งใน `file2.js` มันจะรันทั้งหมด 11 ครั้ง

เนื่องจากคุณรัน `%s/donut/pancake/g` มันจึงสมเหตุสมผลที่จะใช้ `cfdo`. มันไม่สมเหตุสมผลที่จะใช้ `cdo` เพราะมันจะรัน `%s/donut/pancake/g` สิบครั้งใน `file2.js` (`%s` เป็นการแทนที่ทั่วทั้งไฟล์) การรัน `%s` หนึ่งครั้งต่อไฟล์ก็เพียงพอ หากคุณใช้ `cdo` มันจะสมเหตุสมผลมากกว่าที่จะส่งมันด้วย `s/donut/pancake/g` แทน

เมื่อคุณตัดสินใจว่าจะใช้ `cfdo` หรือ `cdo` ให้คิดถึงขอบเขตของคำสั่งที่คุณกำลังส่งไป นี่เป็นคำสั่งทั่วทั้งไฟล์ (เช่น `:%s` หรือ `:g`) หรือคำสั่งตามบรรทัด (เช่น `:s` หรือ `:!`)?

## รายการตำแหน่ง

รายการตำแหน่งคล้ายกับรายการ quickfix ในแง่ที่ว่า Vim ยังใช้หน้าต่างพิเศษเพื่อแสดงข้อความ ความแตกต่างระหว่างรายการ quickfix และรายการตำแหน่งคือในทุกเวลา คุณอาจมีเพียงรายการ quickfix หนึ่งรายการ ในขณะที่คุณสามารถมีรายการตำแหน่งได้มากเท่าที่คุณมีหน้าต่าง

สมมติว่าคุณมีหน้าต่างสองหน้าต่างเปิดอยู่ หนึ่งหน้าต่างแสดง `food.txt` และอีกหน้าต่างแสดง `drinks.txt` จากภายใน `food.txt` คุณรันคำสั่งค้นหารายการตำแหน่ง `:lvimgrep` (ตัวแปรตำแหน่งสำหรับคำสั่ง `:vimgrep`):

```shell
:lvim /bagel/ **/*.md
```

Vim จะสร้างรายการตำแหน่งของการจับคู่การค้นหาทั้งหมดที่เกี่ยวข้องกับ bagel สำหรับ *หน้าต่าง food.txt* นั้น คุณสามารถดูรายการตำแหน่งด้วย `:lopen`. ตอนนี้ไปที่หน้าต่างอื่น `drinks.txt` และรัน:

```shell
:lvimgrep /milk/ **/*.md
```

Vim จะสร้างรายการตำแหน่ง *แยกต่างหาก* ที่มีผลลัพธ์การค้นหาทั้งหมดที่เกี่ยวข้องกับ milk สำหรับ *หน้าต่าง drinks.txt* นั้น

สำหรับแต่ละคำสั่งตำแหน่งที่คุณรันในแต่ละหน้าต่าง Vim จะสร้างรายการตำแหน่งที่แตกต่างกัน หากคุณมีหน้าต่าง 10 หน้าต่าง คุณสามารถมีรายการตำแหน่งได้สูงสุด 10 รายการ เปรียบเทียบกับรายการ quickfix ที่คุณสามารถมีเพียงหนึ่งรายการในเวลาใดเวลาหนึ่ง หากคุณมีหน้าต่าง 10 หน้าต่าง คุณยังคงมีเพียงรายการ quickfix หนึ่งรายการ

คำสั่งรายการตำแหน่งส่วนใหญ่คล้ายกับคำสั่ง quickfix ยกเว้นว่าพวกเขาจะมีคำว่า `l-` นำหน้า ตัวอย่างเช่น: `:lvimgrep`, `:lgrep`, และ `:lmake` เทียบกับ `:vimgrep`, `:grep`, และ `:make`. เพื่อจัดการกับหน้าต่างรายการตำแหน่ง คำสั่งก็มีลักษณะคล้ายกับคำสั่ง quickfix `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext`, และ `:lprev` เทียบกับ `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext`, และ `:cprev`.

สองคำสั่งหลายไฟล์ของรายการตำแหน่งก็คล้ายกับคำสั่งหลายไฟล์ของ quickfix: `:ldo` และ `:lfdo`. `:ldo` จะดำเนินการคำสั่งตำแหน่งในแต่ละรายการตำแหน่ง ในขณะที่ `:lfdo` จะดำเนินการคำสั่งรายการตำแหน่งสำหรับแต่ละไฟล์ในรายการตำแหน่ง สำหรับข้อมูลเพิ่มเติม ตรวจสอบ `:h location-list`.
## การดำเนินการหลายไฟล์ใน Vim

การรู้วิธีดำเนินการหลายไฟล์เป็นทักษะที่มีประโยชน์ในการแก้ไข เมื่อใดก็ตามที่คุณต้องการเปลี่ยนชื่อตัวแปรในหลายไฟล์ คุณต้องการดำเนินการทั้งหมดในครั้งเดียว Vim มีวิธีการที่แตกต่างกันแปดวิธีในการทำเช่นนี้

ในทางปฏิบัติ คุณอาจจะไม่ใช้ทั้งหมดแปดวิธีอย่างเท่าเทียมกัน คุณจะมีแนวโน้มไปสู่หนึ่งหรือสองวิธี เมื่อคุณเริ่มต้น ให้เลือกหนึ่งวิธี (ฉันแนะนำให้เริ่มต้นด้วยรายการ arg `:argdo`) และทำให้เชี่ยวชาญ เมื่อคุณรู้สึกสบายกับหนึ่งวิธีแล้ว ให้เรียนรู้วิธีถัดไป คุณจะพบว่าการเรียนรู้วิธีที่สอง ที่สาม ที่สี่จะง่ายขึ้น ใช้ความคิดสร้างสรรค์ ใช้มันกับการรวมกันที่แตกต่างกัน ฝึกฝนต่อไปจนกว่าคุณจะสามารถทำสิ่งนี้ได้อย่างง่ายดายและไม่ต้องคิดมาก ทำให้มันเป็นส่วนหนึ่งของความจำของกล้ามเนื้อของคุณ

เมื่อกล่าวเช่นนั้น คุณได้เชี่ยวชาญการแก้ไขใน Vim แล้ว ขอแสดงความยินดี!