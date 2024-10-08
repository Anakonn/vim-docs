---
description: เรียนรู้การใช้ Vim packages เพื่อจัดการติดตั้งปลั๊กอินใน Vim ตั้งแต่เวอร์ชัน
  8 โดยใช้การโหลดอัตโนมัติและแมนนวลในบทนี้
title: Ch23. Vim Packages
---

ในบทก่อนหน้า ฉันได้กล่าวถึงการใช้ผู้จัดการปลั๊กอินภายนอกเพื่อติดตั้งปลั๊กอิน ตั้งแต่เวอร์ชัน 8 เป็นต้นไป Vim มาพร้อมกับผู้จัดการปลั๊กอินในตัวที่เรียกว่า *packages* ในบทนี้ คุณจะได้เรียนรู้วิธีการใช้แพ็คเกจของ Vim เพื่อติดตั้งปลั๊กอิน

เพื่อตรวจสอบว่า Vim ของคุณมีความสามารถในการใช้แพ็คเกจหรือไม่ ให้รัน `:version` และมองหาคุณสมบัติ `+packages` นอกจากนี้คุณยังสามารถรัน `:echo has('packages')` (ถ้ามันคืนค่า 1 แสดงว่ามีความสามารถในการใช้แพ็คเกจ)

## โฟลเดอร์แพ็ค

ตรวจสอบว่าคุณมีโฟลเดอร์ `~/.vim/` ในเส้นทางหลักหรือไม่ ถ้าคุณไม่มี ให้สร้างขึ้นมา ภายในนั้นให้สร้างโฟลเดอร์ที่เรียกว่า `pack` (`~/.vim/pack/)` Vim จะรู้จักโดยอัตโนมัติว่าต้องค้นหาแพ็คเกจภายในโฟลเดอร์นี้

## วิธีการโหลดสองประเภท

แพ็คเกจของ Vim มีสองกลไกในการโหลด: การโหลดอัตโนมัติและการโหลดด้วยตนเอง

### การโหลดอัตโนมัติ

เพื่อโหลดปลั๊กอินโดยอัตโนมัติเมื่อ Vim เริ่มต้น คุณต้องใส่ปลั๊กอินในโฟลเดอร์ `start/` เส้นทางจะมีลักษณะดังนี้:

```shell
~/.vim/pack/*/start/
```

ตอนนี้คุณอาจจะถามว่า "แล้ว `*` ที่อยู่ระหว่าง `pack/` และ `start/` คืออะไร?" `*` เป็นชื่อที่เลือกได้ตามต้องการ มาตั้งชื่อมันว่า `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

โปรดจำไว้ว่าถ้าคุณข้ามมันและทำอะไรแบบนี้แทน:

```shell
~/.vim/pack/start/
```

ระบบแพ็คเกจจะไม่ทำงาน จำเป็นต้องใส่ชื่อระหว่าง `pack/` และ `start/`

สำหรับการสาธิตนี้ มาลองติดตั้งปลั๊กอิน [NERDTree](https://github.com/preservim/nerdtree) กันเถอะ ไปที่โฟลเดอร์ `start/` (`cd ~/.vim/pack/packdemo/start/`) และโคลนที่เก็บข้อมูล NERDTree:

```shell
git clone https://github.com/preservim/nerdtree.git
```

แค่นั้นแหละ! คุณพร้อมแล้ว ครั้งถัดไปที่คุณเริ่ม Vim คุณสามารถเรียกใช้คำสั่ง NERDTree ได้ทันที เช่น `:NERDTreeToggle`

คุณสามารถโคลนที่เก็บปลั๊กอินได้ตามต้องการภายในเส้นทาง `~/.vim/pack/*/start/` Vim จะโหลดแต่ละอันโดยอัตโนมัติ หากคุณลบที่เก็บที่โคลนมา (`rm -rf nerdtree/`) ปลั๊กอินนั้นจะไม่สามารถใช้งานได้อีกต่อไป

### การโหลดด้วยตนเอง

เพื่อโหลดปลั๊กอินด้วยตนเองเมื่อ Vim เริ่มต้น คุณต้องใส่ปลั๊กอินในโฟลเดอร์ `opt/` คล้ายกับการโหลดอัตโนมัติ เส้นทางจะมีลักษณะดังนี้:

```shell
~/.vim/pack/*/opt/
```

มาลองใช้โฟลเดอร์ `packdemo/` ที่เราสร้างขึ้นมาก่อนหน้านี้:

```shell
~/.vim/pack/packdemo/opt/
```

ครั้งนี้ มาติดตั้งเกม [killersheep](https://github.com/vim/killersheep) (ต้องใช้ Vim 8.2) ไปที่โฟลเดอร์ `opt/` (`cd ~/.vim/pack/packdemo/opt/`) และโคลนที่เก็บข้อมูล:

```shell
git clone https://github.com/vim/killersheep.git
```

เริ่ม Vim คำสั่งในการเล่นเกมคือ `:KillKillKill` ลองรันดู Vim จะบ่นว่ามันไม่ใช่คำสั่งที่ถูกต้อง คุณต้อง *โหลดปลั๊กอินด้วยตนเอง* ก่อน มาทำกัน:

```shell
:packadd killersheep
```

ตอนนี้ลองรันคำสั่งอีกครั้ง `:KillKillKill` คำสั่งควรทำงานได้แล้ว

คุณอาจสงสัยว่า "ทำไมฉันถึงต้องการโหลดแพ็คเกจด้วยตนเอง? มันไม่ดีกว่าหรือที่จะโหลดทุกอย่างโดยอัตโนมัติในตอนเริ่มต้น?"

คำถามที่ดี บางครั้งมีปลั๊กอินที่คุณจะไม่ใช้ตลอดเวลา เช่น เกม KillerSheep นั้น คุณอาจไม่จำเป็นต้องโหลดเกม 10 เกมที่แตกต่างกันและทำให้เวลาเริ่มต้นของ Vim ช้าลง อย่างไรก็ตาม บางครั้งเมื่อคุณรู้สึกเบื่อ คุณอาจต้องการเล่นเกมสักสองสามเกม ใช้การโหลดด้วยตนเองสำหรับปลั๊กอินที่ไม่จำเป็น

คุณยังสามารถใช้สิ่งนี้เพื่อเพิ่มปลั๊กอินตามเงื่อนไข บางทีคุณอาจใช้ทั้ง Neovim และ Vim และมีปลั๊กอินที่ปรับให้เหมาะสมสำหรับ Neovim คุณสามารถเพิ่มสิ่งนี้ใน vimrc ของคุณ:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## การจัดระเบียบแพ็คเกจ

จำไว้ว่าข้อกำหนดในการใช้ระบบแพ็คเกจของ Vim คือการมี:

```shell
~/.vim/pack/*/start/
```

หรือ:

```shell
~/.vim/pack/*/opt/
```

ข้อเท็จจริงที่ว่า `*` สามารถเป็น *ชื่อใดก็ได้* สามารถใช้เพื่อจัดระเบียบแพ็คเกจของคุณ สมมติว่าคุณต้องการจัดกลุ่มปลั๊กอินของคุณตามหมวดหมู่ (สี, ไวยากรณ์, และเกม):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

คุณยังสามารถใช้ `start/` และ `opt/` ภายในแต่ละโฟลเดอร์ได้

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## การเพิ่มแพ็คเกจอย่างชาญฉลาด

คุณอาจสงสัยว่าแพ็คเกจของ Vim จะทำให้ผู้จัดการปลั๊กอินยอดนิยม เช่น vim-pathogen, vundle.vim, dein.vim, และ vim-plug ล้าสมัยหรือไม่

คำตอบคือ "มันขึ้นอยู่กับ"

ฉันยังคงใช้ vim-plug เพราะมันทำให้การเพิ่ม ลบ หรืออัปเดตปลั๊กอินทำได้ง่าย หากคุณใช้ปลั๊กอินจำนวนมาก อาจสะดวกกว่าที่จะใช้ผู้จัดการปลั๊กอินเพราะมันง่ายต่อการอัปเดตหลายๆ ตัวพร้อมกัน ผู้จัดการปลั๊กอินบางตัวยังมีฟังก์ชันการทำงานแบบอะซิงโครนัส

หากคุณเป็นคนที่ชอบความเรียบง่าย ลองใช้แพ็คเกจของ Vim หากคุณเป็นผู้ใช้ปลั๊กอินหนัก คุณอาจต้องพิจารณาใช้ผู้จัดการปลั๊กอิน