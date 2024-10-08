---
description: เอกสารนี้ให้ภาพรวมเกี่ยวกับเส้นทางการทำงานของ Vim รวมถึงเส้นทางที่ใช้สำหรับปลั๊กอินและวิธีการปรับแต่งเพิ่มเติม
title: Ch24. Vim Runtime
---

ในบทก่อนหน้า ฉันได้กล่าวถึงว่า Vim จะค้นหาเส้นทางพิเศษโดยอัตโนมัติ เช่น `pack/` (บทที่ 22) และ `compiler/` (บทที่ 19) ภายในไดเรกทอรี `~/.vim/` นี่คือตัวอย่างของเส้นทางการทำงานของ Vim

Vim มีเส้นทางการทำงานมากกว่าสองเส้นทางนี้ ในบทนี้ คุณจะได้เรียนรู้ภาพรวมระดับสูงเกี่ยวกับเส้นทางการทำงานเหล่านี้ เป้าหมายของบทนี้คือการแสดงให้คุณเห็นว่าเมื่อใดที่พวกเขาถูกเรียกใช้ การรู้เช่นนี้จะช่วยให้คุณเข้าใจและปรับแต่ง Vim ได้มากขึ้น

## เส้นทางการทำงาน

ในเครื่อง Unix หนึ่งในเส้นทางการทำงานของ Vim คือ `$HOME/.vim/` (ถ้าคุณมีระบบปฏิบัติการที่แตกต่างออกไป เช่น Windows เส้นทางของคุณอาจแตกต่างกัน) เพื่อดูว่าเส้นทางการทำงานสำหรับระบบปฏิบัติการต่างๆ เป็นอย่างไร ให้ตรวจสอบ `:h 'runtimepath'` ในบทนี้ ฉันจะใช้ `~/.vim/` เป็นเส้นทางการทำงานเริ่มต้น

## สคริปต์ปลั๊กอิน

Vim มีเส้นทางการทำงานของปลั๊กอินที่เรียกใช้สคริปต์ใดๆ ในไดเรกทอรีนี้ครั้งละหนึ่งครั้งเมื่อ Vim เริ่มต้น อย่าสับสนชื่อ "ปลั๊กอิน" กับปลั๊กอินภายนอกของ Vim (เช่น NERDTree, fzf.vim เป็นต้น)

ไปที่ไดเรกทอรี `~/.vim/` และสร้างไดเรกทอรี `plugin/` สร้างไฟล์สองไฟล์: `donut.vim` และ `chocolate.vim`

ภายใน `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

ภายใน `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

ตอนนี้ปิด Vim ในครั้งถัดไปที่คุณเริ่ม Vim คุณจะเห็นทั้ง `"donut!"` และ `"chocolate!"` ถูกแสดงออกมา เส้นทางการทำงานของปลั๊กอินสามารถใช้สำหรับสคริปต์การเริ่มต้น

## การตรวจจับประเภทไฟล์

ก่อนที่คุณจะเริ่ม ให้แน่ใจว่าวิมร์ของคุณมีบรรทัดอย่างน้อยดังต่อไปนี้:

```shell
filetype plugin indent on
```

ตรวจสอบ `:h filetype-overview` เพื่อดูบริบทเพิ่มเติม โดยพื้นฐานแล้วจะเปิดการตรวจจับประเภทไฟล์ของ Vim

เมื่อคุณเปิดไฟล์ใหม่ Vim มักจะรู้ว่ามันเป็นไฟล์ประเภทใด หากคุณมีไฟล์ `hello.rb` การรัน `:set filetype?` จะส่งคืนคำตอบที่ถูกต้อง `filetype=ruby`

Vim รู้วิธีตรวจจับประเภทไฟล์ "ทั่วไป" (Ruby, Python, Javascript เป็นต้น) แต่ถ้าคุณมีไฟล์ที่กำหนดเองล่ะ? คุณต้องสอน Vim ให้ตรวจจับมันและกำหนดประเภทไฟล์ที่ถูกต้องให้กับมัน

มีสองวิธีในการตรวจจับ: ใช้ชื่อไฟล์และเนื้อหาไฟล์

### การตรวจจับชื่อไฟล์

การตรวจจับชื่อไฟล์จะตรวจจับประเภทไฟล์โดยใช้ชื่อของไฟล์นั้น เมื่อคุณเปิดไฟล์ `hello.rb` Vim รู้ว่าเป็นไฟล์ Ruby จากนามสกุล `.rb`

มีสองวิธีที่คุณสามารถทำการตรวจจับชื่อไฟล์ได้: ใช้ไดเรกทอรีการทำงาน `ftdetect/` และใช้ไฟล์การทำงาน `filetype.vim` มาสำรวจทั้งสองกัน

#### `ftdetect/`

มาสร้างไฟล์ที่แปลกประหลาด (แต่มีรสชาติ) ชื่อ `hello.chocodonut` เมื่อคุณเปิดมันและรัน `:set filetype?` เนื่องจากมันไม่ใช่นามสกุลไฟล์ทั่วไป Vim จึงไม่รู้ว่าจะทำอย่างไรกับมัน มันส่งคืน `filetype=`

คุณต้องสั่งให้ Vim ตั้งค่าไฟล์ทั้งหมดที่ลงท้ายด้วย `.chocodonut` เป็นประเภทไฟล์ "chocodonut" สร้างไดเรกทอรีชื่อ `ftdetect/` ในรากการทำงาน (`~/.vim/`) ภายในให้สร้างไฟล์และตั้งชื่อว่า `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`) ภายในไฟล์นี้ให้เพิ่ม:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` และ `BufRead` จะถูกเรียกใช้เมื่อใดก็ตามที่คุณสร้างบัฟเฟอร์ใหม่และเปิดบัฟเฟอร์ใหม่ `*.chocodonut` หมายความว่าเหตุการณ์นี้จะถูกเรียกใช้เฉพาะเมื่อบัฟเฟอร์ที่เปิดมีนามสกุลชื่อไฟล์ `.chocodonut` สุดท้ายคำสั่ง `set filetype=chocodonut` จะตั้งค่าประเภทไฟล์ให้เป็นประเภท chocodonut

รีสตาร์ท Vim ตอนนี้เปิดไฟล์ `hello.chocodonut` และรัน `:set filetype?` มันจะส่งคืน `filetype=chocodonut`

อร่อย! คุณสามารถใส่ไฟล์ได้ตามต้องการภายใน `ftdetect/` ในอนาคตคุณอาจเพิ่ม `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim` เป็นต้น หากคุณตัดสินใจขยายประเภทไฟล์โดนัทของคุณ

จริงๆ แล้วมีสองวิธีในการตั้งค่าประเภทไฟล์ใน Vim หนึ่งคือสิ่งที่คุณเพิ่งใช้ `set filetype=chocodonut` อีกวิธีคือการรัน `setfiletype chocodonut` คำสั่งแรก `set filetype=chocodonut` จะ *ตั้งค่า* ประเภทไฟล์เป็นประเภท chocodonut เสมอ ในขณะที่คำสั่งหลัง `setfiletype chocodonut` จะตั้งค่าประเภทไฟล์เฉพาะเมื่อยังไม่มีการตั้งค่าประเภทไฟล์

#### ไฟล์ประเภทไฟล์

วิธีการตรวจจับไฟล์ที่สองต้องการให้คุณสร้าง `filetype.vim` ในไดเรกทอรีราก (`~/.vim/filetype.vim`) เพิ่มสิ่งนี้ภายใน:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

สร้างไฟล์ `hello.plaindonut` เมื่อคุณเปิดมันและรัน `:set filetype?` Vim แสดงประเภทไฟล์ที่กำหนดเองที่ถูกต้อง `filetype=plaindonut`

ศักดิ์สิทธิ์! มันใช้ได้! โดยวิธีการ หากคุณเล่นกับ `filetype.vim` คุณอาจสังเกตเห็นว่าไฟล์นี้ถูกเรียกใช้หลายครั้งเมื่อคุณเปิด `hello.plaindonut` เพื่อป้องกันไม่ให้เกิดเหตุการณ์นี้ คุณสามารถเพิ่มการป้องกันเพื่อให้สคริปต์หลักถูกเรียกใช้เพียงครั้งเดียว อัปเดต `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` เป็นคำสั่งของ Vim เพื่อหยุดการทำงานของสคริปต์ที่เหลือ `"did_load_filetypes"` เป็น *ไม่* ฟังก์ชันในตัวของ Vim มันเป็นตัวแปรทั่วไประหว่าง `$VIMRUNTIME/filetype.vim` หากคุณสนใจให้รัน `:e $VIMRUNTIME/filetype.vim` คุณจะพบบรรทัดเหล่านี้ภายใน:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

เมื่อ Vim เรียกใช้ไฟล์นี้ มันจะกำหนดตัวแปร `did_load_filetypes` และตั้งค่าเป็น 1 ค่า 1 เป็นจริงใน Vim คุณควรอ่านส่วนที่เหลือของ `filetype.vim` ด้วย ดูว่าคุณสามารถเข้าใจสิ่งที่มันทำเมื่อ Vim เรียกใช้มันได้หรือไม่

### สคริปต์ประเภทไฟล์

มาศึกษาวิธีการตรวจจับและกำหนดประเภทไฟล์ตามเนื้อหาไฟล์กันเถอะ

สมมติว่าคุณมีไฟล์ที่ไม่มีนามสกุลที่เหมาะสม สิ่งเดียวที่ไฟล์เหล่านี้มีร่วมกันคือพวกมันทั้งหมดเริ่มต้นด้วยคำว่า "donutify" ในบรรทัดแรก คุณต้องการกำหนดประเภทไฟล์เหล่านี้เป็นประเภทไฟล์ `donut` สร้างไฟล์ใหม่ชื่อ `sugardonut`, `glazeddonut`, และ `frieddonut` (ไม่มีนามสกุล) ภายในแต่ละไฟล์ให้เพิ่มบรรทัดนี้:

```shell
donutify
```

เมื่อคุณรัน `:set filetype?` จากภายใน `sugardonut` Vim จะไม่รู้ว่าจะกำหนดประเภทไฟล์นี้เป็นประเภทใด มันส่งคืน `filetype=`

ในเส้นทางรากการทำงาน ให้เพิ่มไฟล์ `scripts.vim` (`~/.vim/scripts.vim`) ภายในให้เพิ่มสิ่งเหล่านี้:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

ฟังก์ชัน `getline(1)` จะส่งคืนข้อความในบรรทัดแรก มันจะตรวจสอบว่าบรรทัดแรกเริ่มต้นด้วยคำว่า "donutify" หรือไม่ ฟังก์ชัน `did_filetype()` เป็นฟังก์ชันในตัวของ Vim มันจะส่งคืนจริงเมื่อมีการเรียกใช้เหตุการณ์ที่เกี่ยวข้องกับประเภทไฟล์อย่างน้อยหนึ่งครั้ง มันถูกใช้เป็นการป้องกันเพื่อหยุดการเรียกใช้เหตุการณ์ประเภทไฟล์ซ้ำ

เปิดไฟล์ `sugardonut` และรัน `:set filetype?` ตอนนี้ Vim จะส่งคืน `filetype=donut` หากคุณเปิดไฟล์โดนัทอื่นๆ (`glazeddonut` และ `frieddonut`) Vim ก็จะระบุประเภทไฟล์ของพวกมันเป็นประเภท `donut` เช่นกัน

โปรดทราบว่า `scripts.vim` จะถูกเรียกใช้เฉพาะเมื่อ Vim เปิดไฟล์ที่มีประเภทไฟล์ที่ไม่รู้จัก หาก Vim เปิดไฟล์ที่มีประเภทไฟล์ที่รู้จัก `scripts.vim` จะไม่ถูกเรียกใช้

## ปลั๊กอินประเภทไฟล์

ถ้าคุณต้องการให้ Vim รันสคริปต์เฉพาะของ chocodonut เมื่อคุณเปิดไฟล์ chocodonut และไม่รันสคริปต์เหล่านั้นเมื่อเปิดไฟล์ plaindonut คุณสามารถทำได้ด้วยเส้นทางปลั๊กอินประเภทไฟล์ (`~/.vim/ftplugin/`) Vim จะมองหาไฟล์ที่มีชื่อเดียวกันกับประเภทไฟล์ที่คุณเพิ่งเปิด สร้างไฟล์ `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

สร้างไฟล์ ftplugin อีกไฟล์หนึ่งชื่อ `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

ตอนนี้ทุกครั้งที่คุณเปิดประเภทไฟล์ chocodonut Vim จะรันสคริปต์จาก `~/.vim/ftplugin/chocodonut.vim` ทุกครั้งที่คุณเปิดประเภทไฟล์ plaindonut Vim จะรันสคริปต์จาก `~/.vim/ftplugin/plaindonut.vim`

คำเตือน: ไฟล์เหล่านี้จะถูกเรียกใช้ทุกครั้งที่ตั้งค่าประเภทไฟล์บัฟเฟอร์ (`set filetype=chocodonut` เป็นต้น) หากคุณเปิดไฟล์ chocodonut ที่แตกต่างกัน 3 ไฟล์ สคริปต์จะถูกเรียกใช้ทั้งหมด *สามครั้ง*

## ไฟล์การเยื้อง

Vim มีเส้นทางการทำงานการเยื้องที่ทำงานคล้ายกับ ftplugin ซึ่ง Vim จะมองหาไฟล์ที่มีชื่อเดียวกันกับประเภทไฟล์ที่เปิด จุดประสงค์ของเส้นทางการทำงานการเยื้องเหล่านี้คือการเก็บรหัสที่เกี่ยวข้องกับการเยื้อง หากคุณมีไฟล์ `~/.vim/indent/chocodonut.vim` มันจะถูกเรียกใช้เฉพาะเมื่อคุณเปิดประเภทไฟล์ chocodonut คุณสามารถเก็บรหัสที่เกี่ยวข้องกับการเยื้องสำหรับไฟล์ chocodonut ที่นี่

## สี

Vim มีเส้นทางการทำงานสี (`~/.vim/colors/`) เพื่อเก็บธีมสี ไฟล์ใดๆ ที่อยู่ภายในไดเรกทอรีจะถูกแสดงในคำสั่ง `:color`

หากคุณมีไฟล์ `~/.vim/colors/beautifulprettycolors.vim` เมื่อคุณรัน `:color` และกด Tab คุณจะเห็น `beautifulprettycolors` เป็นหนึ่งในตัวเลือกสี หากคุณต้องการเพิ่มธีมสีของคุณเอง นี่คือที่ที่คุณควรไป

หากคุณต้องการตรวจสอบธีมสีที่คนอื่นสร้างขึ้น สถานที่ที่ดีในการเยี่ยมชมคือ [vimcolors](https://vimcolors.com/)

## การเน้นไวยากรณ์

Vim มีเส้นทางการทำงานไวยากรณ์ (`~/.vim/syntax/`) เพื่อกำหนดการเน้นไวยากรณ์

สมมติว่าคุณมีไฟล์ `hello.chocodonut` ภายในมีนิพจน์ต่อไปนี้:

```shell
(donut "tasty")
(donut "savory")
```

แม้ว่า Vim จะรู้ประเภทไฟล์ที่ถูกต้องแล้ว แต่ข้อความทั้งหมดก็มีสีเดียวกัน มาลองเพิ่มกฎการเน้นไวยากรณ์เพื่อเน้นคำว่า "donut" สร้างไฟล์ไวยากรณ์ chocodonut ใหม่ชื่อ `~/.vim/syntax/chocodonut.vim` ภายในให้เพิ่ม:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

ตอนนี้เปิดไฟล์ `hello.chocodonut` อีกครั้ง คำว่า `donut` จะถูกเน้นแล้ว

บทนี้จะไม่พูดถึงการเน้นไวยากรณ์อย่างละเอียด มันเป็นหัวข้อที่กว้างมาก หากคุณสนใจให้ตรวจสอบ `:h syntax.txt`

ปลั๊กอิน [vim-polyglot](https://github.com/sheerun/vim-polyglot) เป็นปลั๊กอินที่ยอดเยี่ยมที่ให้การเน้นสำหรับหลายภาษาโปรแกรมยอดนิยม

## เอกสาร

หากคุณสร้างปลั๊กอิน คุณจะต้องสร้างเอกสารของคุณเอง คุณใช้เส้นทางการทำงาน doc สำหรับสิ่งนั้น

มาสร้างเอกสารพื้นฐานสำหรับคำสำคัญ chocodonut และ plaindonut สร้างไฟล์ `donut.txt` (`~/.vim/doc/donut.txt`) ภายในให้เพิ่มข้อความเหล่านี้:

```shell
*chocodonut* Delicious chocolate donut

*plaindonut* No choco goodness but still delicious nonetheless
```

หากคุณลองค้นหา `chocodonut` และ `plaindonut` (`:h chocodonut` และ `:h plaindonut`) คุณจะไม่พบอะไร

ก่อนอื่นคุณต้องรัน `:helptags` เพื่อสร้างรายการช่วยเหลือใหม่ รัน `:helptags ~/.vim/doc/`

ตอนนี้หากคุณรัน `:h chocodonut` และ `:h plaindonut` คุณจะพบรายการช่วยเหลือใหม่เหล่านี้ สังเกตว่าไฟล์ตอนนี้เป็นแบบอ่านอย่างเดียวและมีประเภทไฟล์ "help"
## การโหลดสคริปต์แบบ Lazy

เส้นทางการทำงานทั้งหมดที่คุณได้เรียนรู้ในบทนี้จะถูกเรียกใช้งานโดยอัตโนมัติ หากคุณต้องการโหลดสคริปต์ด้วยตนเอง ให้ใช้เส้นทางการทำงานแบบ autoload

สร้างไดเรกทอรี autoload (`~/.vim/autoload/`). ภายในไดเรกทอรีนั้น ให้สร้างไฟล์ใหม่และตั้งชื่อว่า `tasty.vim` (`~/.vim/autoload/tasty.vim`). ภายในไฟล์:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

โปรดทราบว่าชื่อฟังก์ชันคือ `tasty#donut` ไม่ใช่ `donut()`. เครื่องหมายปอนด์ (`#`) เป็นสิ่งจำเป็นเมื่อใช้ฟีเจอร์ autoload. ข้อตกลงการตั้งชื่อฟังก์ชันสำหรับฟีเจอร์ autoload คือ:

```shell
function fileName#functionName()
  ...
endfunction
```

ในกรณีนี้ ชื่อไฟล์คือ `tasty.vim` และชื่อฟังก์ชันคือ (ตามเทคนิค) `donut`.

ในการเรียกใช้ฟังก์ชัน คุณต้องใช้คำสั่ง `call`. มาลองเรียกฟังก์ชันนั้นด้วย `:call tasty#donut()`.

ครั้งแรกที่คุณเรียกฟังก์ชัน คุณควรเห็นข้อความ echo *ทั้งสอง* ("tasty.vim global" และ "tasty#donut"). การเรียกใช้ฟังก์ชัน `tasty#donut` ในครั้งถัดไปจะจะแสดงเพียง "testy#donut" echo.

เมื่อคุณเปิดไฟล์ใน Vim แตกต่างจากเส้นทางการทำงานก่อนหน้านี้ สคริปต์ autoload จะไม่ถูกโหลดโดยอัตโนมัติ. จะถูกโหลดเฉพาะเมื่อคุณเรียก `tasty#donut()` อย่างชัดเจน Vim จะค้นหาไฟล์ `tasty.vim` และโหลดทุกอย่างภายใน รวมถึงฟังก์ชัน `tasty#donut()`. Autoload เป็นกลไกที่สมบูรณ์แบบสำหรับฟังก์ชันที่ใช้ทรัพยากรจำนวนมากแต่คุณไม่ใช้บ่อย.

คุณสามารถเพิ่มไดเรกทอรีซ้อนกันได้ตามต้องการด้วย autoload. หากคุณมีเส้นทางการทำงาน `~/.vim/autoload/one/two/three/tasty.vim`, คุณสามารถเรียกฟังก์ชันด้วย `:call one#two#three#tasty#donut()`.

## สคริปต์หลัง

Vim มีเส้นทางการทำงานหลัง (`~/.vim/after/`) ที่สะท้อนโครงสร้างของ `~/.vim/`. สิ่งใดในเส้นทางนี้จะถูกดำเนินการสุดท้าย ดังนั้นนักพัฒนามักจะใช้เส้นทางเหล่านี้สำหรับการเขียนทับสคริปต์.

ตัวอย่างเช่น หากคุณต้องการเขียนทับสคริปต์จาก `plugin/chocolate.vim`, คุณสามารถสร้าง `~/.vim/after/plugin/chocolate.vim` เพื่อใส่สคริปต์ที่เขียนทับ. Vim จะรัน `~/.vim/after/plugin/chocolate.vim` *หลังจาก* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

Vim มีตัวแปรสภาพแวดล้อม `$VIMRUNTIME` สำหรับสคริปต์และไฟล์สนับสนุนเริ่มต้น. คุณสามารถตรวจสอบได้โดยการรัน `:e $VIMRUNTIME`.

โครงสร้างควรดูคุ้นเคย. มันประกอบด้วยเส้นทางการทำงานมากมายที่คุณได้เรียนรู้ในบทนี้.

จำได้ว่าในบทที่ 21 คุณได้เรียนรู้ว่าเมื่อคุณเปิด Vim มันจะค้นหาไฟล์ vimrc ในเจ็ดตำแหน่งที่แตกต่างกัน. ฉันบอกว่าตำแหน่งสุดท้ายที่ Vim ตรวจสอบคือ `$VIMRUNTIME/defaults.vim`. หาก Vim ไม่พบไฟล์ vimrc ของผู้ใช้ใดๆ Vim จะใช้ `defaults.vim` เป็น vimrc.

คุณเคยลองรัน Vim โดยไม่มีปลั๊กอิน syntax เช่น vim-polyglot และไฟล์ของคุณยังคงมีการไฮไลต์ทางไวยากรณ์อยู่หรือไม่? นั่นเป็นเพราะเมื่อ Vim ไม่พบไฟล์ syntax จากเส้นทางการทำงาน Vim จะค้นหาไฟล์ syntax จากไดเรกทอรี syntax ของ `$VIMRUNTIME`.

หากต้องการเรียนรู้เพิ่มเติม ตรวจสอบ `:h $VIMRUNTIME`.

## ตัวเลือก Runtimepath

เพื่อตรวจสอบ runtimepath ของคุณ ให้รัน `:set runtimepath?`

หากคุณใช้ Vim-Plug หรือผู้จัดการปลั๊กอินภายนอกที่เป็นที่นิยม มันควรจะแสดงรายการไดเรกทอรี. ตัวอย่างเช่น ของฉันแสดง:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

หนึ่งในสิ่งที่ผู้จัดการปลั๊กอินทำคือการเพิ่มแต่ละปลั๊กอินเข้าไปใน runtime path. แต่ละ runtime path สามารถมีโครงสร้างไดเรกทอรีของตัวเองที่คล้ายกับ `~/.vim/`.

หากคุณมีไดเรกทอรี `~/box/of/donuts/` และคุณต้องการเพิ่มไดเรกทอรีนั้นเข้าไปใน runtime path ของคุณ คุณสามารถเพิ่มสิ่งนี้ใน vimrc ของคุณ:

```shell
set rtp+=$HOME/box/of/donuts/
```

หากภายใน `~/box/of/donuts/` คุณมีไดเรกทอรีปลั๊กอิน (`~/box/of/donuts/plugin/hello.vim`) และ ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), Vim จะรันสคริปต์ทั้งหมดจาก `plugin/hello.vim` เมื่อคุณเปิด Vim. Vim จะรัน `ftplugin/chocodonut.vim` เมื่อคุณเปิดไฟล์ chocodonut.

ลองทำด้วยตัวเอง: สร้างเส้นทางที่ไม่แน่นอนและเพิ่มมันเข้าไปใน runtimepath ของคุณ. เพิ่มเส้นทางการทำงานบางส่วนที่คุณได้เรียนรู้จากบทนี้. ตรวจสอบให้แน่ใจว่ามันทำงานตามที่คาดหวัง.

## เรียนรู้ Runtime อย่างชาญฉลาด

ใช้เวลาของคุณในการอ่านและเล่นกับเส้นทางการทำงานเหล่านี้. เพื่อดูว่าเส้นทางการทำงานถูกใช้ในชีวิตจริงอย่างไร ไปที่ที่เก็บของปลั๊กอิน Vim ที่คุณชื่นชอบและศึกษารูปแบบไดเรกทอรีของมัน. คุณควรจะสามารถเข้าใจส่วนใหญ่ของมันได้แล้ว. ลองติดตามและแยกแยะภาพรวม. ตอนนี้ที่คุณเข้าใจโครงสร้างไดเรกทอรีของ Vim แล้ว คุณก็พร้อมที่จะเรียนรู้ Vimscript.