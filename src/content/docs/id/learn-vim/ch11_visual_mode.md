---
description: Dokumen ini menjelaskan cara menggunakan mode visual di Vim untuk memanipulasi
  teks secara efisien dengan tiga jenis mode visual yang berbeda.
title: Ch11. Visual Mode
---

Menyoroti dan menerapkan perubahan pada teks adalah fitur umum di banyak editor teks dan pengolah kata. Vim dapat melakukan ini menggunakan mode visual. Dalam bab ini, Anda akan belajar bagaimana menggunakan mode visual untuk memanipulasi teks dengan efisien.

## Tiga Jenis Mode Visual

Vim memiliki tiga mode visual yang berbeda. Mereka adalah:

```shell
v         Mode visual berdasarkan karakter
V         Mode visual berdasarkan baris
Ctrl-V    Mode visual berdasarkan blok
```

Jika Anda memiliki teks:

```shell
satu
dua
tiga
```

Mode visual berdasarkan karakter bekerja dengan karakter individu. Tekan `v` pada karakter pertama. Kemudian turun ke baris berikutnya dengan `j`. Ini menyoroti semua teks dari "satu" hingga lokasi kursor Anda. Jika Anda menekan `gU`, Vim mengubah huruf yang disorot menjadi huruf kapital.

Mode visual berdasarkan baris bekerja dengan baris. Tekan `V` dan lihat Vim memilih seluruh baris tempat kursor Anda berada. Sama seperti mode visual berdasarkan karakter, jika Anda menjalankan `gU`, Vim mengubah huruf yang disorot menjadi huruf kapital.

Mode visual berdasarkan blok bekerja dengan baris dan kolom. Ini memberi Anda lebih banyak kebebasan bergerak dibandingkan dengan dua mode lainnya. Jika Anda menekan `Ctrl-V`, Vim menyoroti karakter di bawah kursor sama seperti mode visual berdasarkan karakter, kecuali alih-alih menyoroti setiap karakter hingga akhir baris sebelum turun ke baris berikutnya, ia turun ke baris berikutnya dengan sorotan minimal. Cobalah bergerak dengan `h/j/k/l` dan lihat kursor bergerak.

Di bagian kiri bawah jendela Vim Anda, Anda akan melihat `-- VISUAL --`, `-- VISUAL LINE --`, atau `-- VISUAL BLOCK --` ditampilkan untuk menunjukkan mode visual mana yang Anda gunakan.

Saat Anda berada di dalam mode visual, Anda dapat beralih ke mode visual lain dengan menekan `v`, `V`, atau `Ctrl-V`. Misalnya, jika Anda berada di mode visual berdasarkan baris dan ingin beralih ke mode visual berdasarkan blok, jalankan `Ctrl-V`. Cobalah!

Ada tiga cara untuk keluar dari mode visual: `<Esc>`, `Ctrl-C`, dan tombol yang sama dengan mode visual Anda saat ini. Apa yang dimaksud dengan yang terakhir adalah jika Anda saat ini berada di mode visual berdasarkan baris (`V`), Anda dapat keluar dengan menekan `V` lagi. Jika Anda berada di mode visual berdasarkan karakter, Anda dapat keluar dengan menekan `v`.

Sebenarnya ada satu cara lagi untuk masuk ke mode visual:

```shell
gv    Kembali ke mode visual sebelumnya
```

Ini akan memulai mode visual yang sama pada blok teks yang disorot seperti yang Anda lakukan terakhir kali.

## Navigasi Mode Visual

Saat berada di mode visual, Anda dapat memperluas blok teks yang disorot dengan gerakan Vim.

Mari kita gunakan teks yang sama yang Anda gunakan sebelumnya:

```shell
satu
dua
tiga
```

Kali ini mari kita mulai dari baris "dua". Tekan `v` untuk masuk ke mode visual berdasarkan karakter (di sini tanda kurung siku `[]` mewakili sorotan karakter):

```shell
satu
[d]ua
tiga
```

Tekan `j` dan Vim akan menyoroti semua teks dari baris "dua" hingga karakter pertama dari baris "tiga".

```shell
satu
[dua
t]iga
```

Anggap dari posisi ini, Anda ingin menambahkan baris "satu" juga. Jika Anda menekan `k`, dengan kecewa, sorotan bergerak menjauh dari baris "tiga". 

```shell
satu
[d]ua
tiga
```

Apakah ada cara untuk memperluas pemilihan visual secara bebas untuk bergerak ke arah mana pun yang Anda inginkan? Tentu saja. Mari kita mundur sedikit ke tempat Anda memiliki baris "dua" dan "tiga" yang disorot.

```shell
satu
[dua
t]iga    <-- kursor
```

Sorotan visual mengikuti gerakan kursor. Jika Anda ingin memperluasnya ke atas ke baris "satu", Anda perlu memindahkan kursor ke atas ke baris "dua". Saat ini kursor berada di baris "tiga". Anda dapat mengubah lokasi kursor dengan `o` atau `O`.

```shell
satu
[dua     <-- kursor
t]iga
```

Sekarang ketika Anda menekan `k`, itu tidak lagi mengurangi pemilihan, tetapi memperluasnya ke atas.

```shell
[satu
dua
t]iga
```

Dengan `o` atau `O` di mode visual, kursor melompat dari awal hingga akhir blok yang disorot, memungkinkan Anda untuk memperluas area sorotan.

## Tata Bahasa Mode Visual

Mode visual berbagi banyak operasi dengan mode normal.

Misalnya, jika Anda memiliki teks berikut dan ingin menghapus dua baris pertama dari mode visual:

```shell
satu
dua
tiga
```

Sorot baris "satu" dan "dua" dengan mode visual berdasarkan baris (`V`):

```shell
[satu
dua]
tiga
```

Menekan `d` akan menghapus pemilihan, mirip dengan mode normal. Perhatikan bahwa aturan tata bahasa dari mode normal, kata kerja + kata benda, tidak berlaku. Kata kerja yang sama masih ada (`d`), tetapi tidak ada kata benda di mode visual. Aturan tata bahasa di mode visual adalah kata benda + kata kerja, di mana kata benda adalah teks yang disorot. Pilih blok teks terlebih dahulu, kemudian perintah mengikuti.

Di mode normal, ada beberapa perintah yang tidak memerlukan gerakan, seperti `x` untuk menghapus satu karakter di bawah kursor dan `r` untuk mengganti karakter di bawah kursor (`rx` mengganti karakter di bawah kursor dengan "x"). Di mode visual, perintah ini sekarang diterapkan pada seluruh teks yang disorot alih-alih satu karakter. Kembali ke teks yang disorot:

```shell
[satu
dua]
tiga
```

Menjalankan `x` menghapus semua teks yang disorot.

Anda dapat menggunakan perilaku ini untuk dengan cepat membuat header di teks markdown. Misalkan Anda perlu dengan cepat mengubah teks berikut menjadi header markdown tingkat pertama ("==="):

```shell
Bab Satu
```

Pertama, salin teks dengan `yy`, lalu tempel dengan `p`:

```shell
Bab Satu
Bab Satu
```

Sekarang, pergi ke baris kedua dan pilih dengan mode visual berdasarkan baris:

```shell
Bab Satu
[Bab Satu]
```

Header tingkat pertama adalah serangkaian "=" di bawah teks. Jalankan `r=`, voila! Ini menyelamatkan Anda dari mengetik "=" secara manual.

```shell
Bab Satu
===========
```

Untuk mempelajari lebih lanjut tentang operator di mode visual, lihat `:h visual-operators`.

## Mode Visual dan Perintah Baris Perintah

Anda dapat secara selektif menerapkan perintah baris perintah pada blok teks yang disorot. Jika Anda memiliki pernyataan ini dan ingin mengganti "const" dengan "let" hanya pada dua baris pertama:

```shell
const satu = "satu";
const dua = "dua";
const tiga = "tiga";
```

Sorot dua baris pertama dengan *mode visual mana pun* dan jalankan perintah substitusi `:s/const/let/g`:

```shell
let satu = "satu";
let dua = "dua";
const tiga = "tiga";
```

Perhatikan saya mengatakan Anda dapat melakukan ini dengan *mode visual mana pun*. Anda tidak perlu menyoroti seluruh baris untuk menjalankan perintah pada baris tersebut. Selama Anda memilih setidaknya satu karakter di setiap baris, perintah diterapkan.

## Menambahkan Teks di Beberapa Baris

Anda dapat menambahkan teks di beberapa baris di Vim menggunakan mode visual berdasarkan blok. Jika Anda perlu menambahkan titik koma di akhir setiap baris:

```shell
const satu = "satu"
const dua = "dua"
const tiga = "tiga"
```

Dengan kursor Anda di baris pertama:
- Jalankan mode visual berdasarkan blok dan turun dua baris (`Ctrl-V jj`).
- Sorot hingga akhir baris (`$`).
- Tambahkan (`A`) lalu ketik ";".
- Keluar dari mode visual (`<Esc>`).

Anda seharusnya melihat ";" yang ditambahkan di setiap baris sekarang. Sangat keren! Ada dua cara untuk masuk ke mode sisip dari mode visual berdasarkan blok: `A` untuk memasukkan teks setelah kursor atau `I` untuk memasukkan teks sebelum kursor. Jangan bingung dengan `A` (menambahkan teks di akhir baris) dan `I` (menyisipkan teks sebelum baris non-kosong pertama) dari mode normal.

Sebagai alternatif, Anda juga dapat menggunakan perintah `:normal` untuk menambahkan teks di beberapa baris:
- Sorot semua 3 baris (`vjj`).
- Ketik `:normal! A;`.

Ingat, perintah `:normal` mengeksekusi perintah mode normal. Anda dapat memintanya untuk menjalankan `A;` untuk menambahkan teks ";" di akhir baris.

## Meningkatkan Angka

Vim memiliki perintah `Ctrl-X` dan `Ctrl-A` untuk mengurangi dan meningkatkan angka. Ketika digunakan dengan mode visual, Anda dapat meningkatkan angka di beberapa baris.

Jika Anda memiliki elemen HTML ini:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

Ini adalah praktik buruk memiliki beberapa id dengan nama yang sama, jadi mari kita tingkatkan untuk membuatnya unik:
- Pindahkan kursor Anda ke "1" di baris kedua.
- Mulai mode visual berdasarkan blok dan turun 3 baris (`Ctrl-V 3j`). Ini menyoroti "1" yang tersisa. Sekarang semua "1" harus disorot (kecuali baris pertama).
- Jalankan `g Ctrl-A`.

Anda seharusnya melihat hasil ini:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` meningkatkan angka di beberapa baris. `Ctrl-X/Ctrl-A` juga dapat meningkatkan huruf, dengan opsi format angka:

```shell
set nrformats+=alpha
```

Opsi `nrformats` menginstruksikan Vim basis mana yang dianggap sebagai "angka" untuk `Ctrl-A` dan `Ctrl-X` untuk meningkatkan dan mengurangi. Dengan menambahkan `alpha`, karakter alfabet sekarang dianggap sebagai angka. Jika Anda memiliki elemen HTML berikut:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Letakkan kursor Anda di "app-a" kedua. Gunakan teknik yang sama seperti di atas (`Ctrl-V 3j` lalu `g Ctrl-A`) untuk meningkatkan id.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Memilih Area Mode Visual Terakhir

Sebelumnya di bab ini, saya menyebutkan bahwa `gv` dapat dengan cepat menyoroti sorotan mode visual terakhir. Anda juga dapat pergi ke lokasi awal dan akhir dari mode visual terakhir dengan dua tanda khusus ini:

```shell
`<    Pergi ke tempat pertama sorotan mode visual sebelumnya
`>    Pergi ke tempat terakhir sorotan mode visual sebelumnya
```

Sebelumnya, saya juga menyebutkan bahwa Anda dapat secara selektif mengeksekusi perintah baris perintah pada teks yang disorot, seperti `:s/const/let/g`. Ketika Anda melakukannya, Anda akan melihat ini di bawah:

```shell
:`<,`>s/const/let/g
```

Anda sebenarnya sedang mengeksekusi perintah `s/const/let/g` *berjangka* (dengan dua tanda sebagai alamat). Menarik!

Anda selalu dapat mengedit tanda ini kapan saja Anda mau. Jika sebaliknya Anda perlu mengganti dari awal teks yang disorot hingga akhir file, Anda cukup mengubah perintah menjadi:

```shell
:`<,$s/const/let/g
```

## Masuk ke Mode Visual Dari Mode Sisip

Anda juga dapat masuk ke mode visual dari mode sisip. Untuk masuk ke mode visual berdasarkan karakter saat Anda berada di mode sisip:

```shell
Ctrl-O v
```

Ingat bahwa menjalankan `Ctrl-O` saat dalam mode sisip memungkinkan Anda mengeksekusi perintah mode normal. Saat dalam mode ini yang menunggu perintah mode normal, jalankan `v` untuk masuk ke mode visual berdasarkan karakter. Perhatikan bahwa di bagian kiri bawah layar, tertulis `--(insert) VISUAL--`. Trik ini berfungsi dengan operator mode visual mana pun: `v`, `V`, dan `Ctrl-V`.

## Mode Pilih

Vim memiliki mode yang mirip dengan mode visual yang disebut mode pilih. Seperti mode visual, ia juga memiliki tiga mode berbeda:

```shell
gh         Mode pilih berdasarkan karakter
gH         Mode pilih berdasarkan baris
gCtrl-h    Mode pilih berdasarkan blok
```

Mode pilih meniru perilaku penyorotan teks editor biasa lebih dekat daripada mode visual Vim.

Di editor biasa, setelah Anda menyoroti blok teks dan mengetik huruf, katakanlah huruf "y", itu akan menghapus teks yang disorot dan menyisipkan huruf "y". Jika Anda menyoroti baris dengan mode pilih berdasarkan baris (`gH`) dan mengetik "y", itu akan menghapus teks yang disorot dan menyisipkan huruf "y".

Kontraskan mode pilih ini dengan mode visual: jika Anda menyoroti baris teks dengan mode visual berdasarkan baris (`V`) dan mengetik "y", teks yang disorot tidak akan dihapus dan diganti dengan huruf "y" secara literal, itu akan disalin. Anda tidak dapat mengeksekusi perintah mode normal pada teks yang disorot di mode pilih.

Saya pribadi tidak pernah menggunakan mode pilih, tetapi baik untuk diketahui bahwa itu ada.

## Pelajari Mode Visual dengan Cara Cerdas

Mode visual adalah representasi prosedur penyorotan teks di Vim.

Jika Anda mendapati diri Anda menggunakan operasi mode visual jauh lebih sering daripada operasi mode normal, berhati-hatilah. Ini adalah pola anti. Dibutuhkan lebih banyak ketukan untuk menjalankan operasi mode visual dibandingkan dengan rekan mode normalnya. Misalnya, jika Anda perlu menghapus sebuah kata dalam, mengapa menggunakan empat ketukan, `viwd` (menyoroti secara visual sebuah kata dalam lalu menghapus), jika Anda dapat mencapainya hanya dengan tiga ketukan (`diw`)? Yang terakhir lebih langsung dan ringkas. Tentu saja, akan ada saat-saat ketika mode visual sesuai, tetapi secara umum, utamakan pendekatan yang lebih langsung.