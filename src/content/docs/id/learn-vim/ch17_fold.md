---
description: Pelajari cara menggunakan fitur lipatan di Vim untuk menyembunyikan teks
  yang tidak relevan, sehingga memudahkan pemahaman isi file.
title: Ch17. Fold
---

Ketika Anda membaca sebuah file, seringkali ada banyak teks yang tidak relevan yang menghalangi Anda untuk memahami apa yang dilakukan file tersebut. Untuk menyembunyikan kebisingan yang tidak perlu, gunakan Vim fold.

Dalam bab ini, Anda akan belajar berbagai cara untuk melipat sebuah file.

## Lipatan Manual

Bayangkan Anda melipat selembar kertas untuk menutupi beberapa teks. Teks yang sebenarnya tidak hilang, itu masih ada. Vim fold bekerja dengan cara yang sama. Ini melipat rentang teks, menyembunyikannya dari tampilan tanpa benar-benar menghapusnya.

Operator lipatan adalah `z` (ketika kertas dilipat, bentuknya seperti huruf z).

Misalkan Anda memiliki teks ini:

```shell
Lipatan saya
Pegang saya
```

Dengan kursor di baris pertama, ketik `zfj`. Vim melipat kedua baris menjadi satu. Anda seharusnya melihat sesuatu seperti ini:

```shell
+-- 2 baris: Lipatan saya -----
```

Berikut adalah rincian:
- `zf` adalah operator lipatan.
- `j` adalah gerakan untuk operator lipatan.

Anda dapat membuka teks yang dilipat dengan `zo`. Untuk menutup lipatan, gunakan `zc`.

Lipatan adalah operator, jadi mengikuti aturan tata bahasa (`kata kerja + kata benda`). Anda dapat melewatkan operator lipatan dengan gerakan atau objek teks. Untuk melipat paragraf dalam, jalankan `zfip`. Untuk melipat hingga akhir file, jalankan `zfG`. Untuk melipat teks antara `{` dan `}`, jalankan `zfa{`.

Anda dapat melipat dari mode visual. Sorot area yang ingin Anda lipat (`v`, `V`, atau `Ctrl-v`), lalu jalankan `zf`.

Anda dapat mengeksekusi lipatan dari mode baris perintah dengan perintah `:fold`. Untuk melipat baris saat ini dan baris setelahnya, jalankan:

```shell
:,+1fold
```

`,+1` adalah rentang. Jika Anda tidak melewatkan parameter ke rentang, itu secara default ke baris saat ini. `+1` adalah indikator rentang untuk baris berikutnya. Untuk melipat baris 5 hingga 10, jalankan `:5,10fold`. Untuk melipat dari posisi saat ini hingga akhir baris, jalankan `:,$fold`.

Ada banyak perintah lipat dan buka lainnya. Saya merasa mereka terlalu banyak untuk diingat saat memulai. Yang paling berguna adalah:
- `zR` untuk membuka semua lipatan.
- `zM` untuk menutup semua lipatan.
- `za` untuk mengalihkan status lipatan.

Anda dapat menjalankan `zR` dan `zM` di baris mana pun, tetapi `za` hanya berfungsi ketika Anda berada di baris yang dilipat / tidak dilipat. Untuk mempelajari lebih lanjut tentang perintah lipatan, lihat `:h fold-commands`.

## Metode Lipatan yang Berbeda

Bagian di atas mencakup lipatan manual Vim. Ada enam metode lipatan yang berbeda di Vim:
1. Manual
2. Indentasi
3. Ekspresi
4. Sintaks
5. Diff
6. Penanda

Untuk melihat metode lipatan mana yang sedang Anda gunakan, jalankan `:set foldmethod?`. Secara default, Vim menggunakan metode `manual`.

Di sisa bab ini, Anda akan mempelajari lima metode lipatan lainnya. Mari kita mulai dengan lipatan indentasi.

## Lipatan Indentasi

Untuk menggunakan lipatan indentasi, ubah `'foldmethod'` menjadi indentasi:

```shell
:set foldmethod=indent
```

Misalkan Anda memiliki teks:

```shell
Satu
  Dua
  Dua lagi
```

Jika Anda menjalankan `:set foldmethod=indent`, Anda akan melihat:

```shell
Satu
+-- 2 baris: Dua -----
```

Dengan lipatan indentasi, Vim melihat berapa banyak spasi yang dimiliki setiap baris di awal dan membandingkannya dengan opsi `'shiftwidth'` untuk menentukan kelayakan lipatnya. `'shiftwidth'` mengembalikan jumlah spasi yang diperlukan untuk setiap langkah indentasi. Jika Anda menjalankan:

```shell
:set shiftwidth?
```

Nilai default `'shiftwidth'` Vim adalah 2. Pada teks di atas, ada dua spasi antara awal baris dan teks "Dua" dan "Dua lagi". Ketika Vim melihat jumlah spasi dan bahwa nilai `'shiftwidth'` adalah 2, Vim menganggap bahwa baris tersebut memiliki tingkat lipatan indentasi satu.

Misalkan kali ini Anda hanya memiliki satu spasi antara awal baris dan teks:

```shell
Satu
 Dua
 Dua lagi
```

Saat ini jika Anda menjalankan `:set foldmethod=indent`, Vim tidak melipat baris yang terindentasi karena tidak ada cukup spasi di setiap baris. Satu spasi tidak dianggap sebagai indentasi. Namun, jika Anda mengubah `'shiftwidth'` menjadi 1:

```shell
:set shiftwidth=1
```

Teks sekarang dapat dilipat. Sekarang dianggap sebagai indentasi.

Kembalikan `shiftwidth` ke 2 dan spasi antara teks menjadi dua lagi. Selain itu, tambahkan dua teks tambahan:

```shell
Satu
  Dua
  Dua lagi
    Tiga
    Tiga lagi
```

Jalankan lipatan (`zM`), Anda akan melihat:

```shell
Satu
+-- 4 baris: Dua -----
```

Buka lipatan yang dilipat (`zR`), lalu letakkan kursor Anda di "Tiga" dan alihkan status lipatan teks (`za`):

```shell
Satu
  Dua
  Dua lagi
+-- 2 baris: Tiga -----
```

Apa ini? Lipatan di dalam lipatan?

Lipatan bersarang adalah valid. Teks "Dua" dan "Dua lagi" memiliki tingkat lipatan satu. Teks "Tiga" dan "Tiga lagi" memiliki tingkat lipatan dua. Jika Anda memiliki teks yang dapat dilipat dengan tingkat lipatan yang lebih tinggi di dalam teks yang dapat dilipat, Anda akan memiliki beberapa lapisan lipatan.

## Lipatan Ekspresi

Lipatan ekspresi memungkinkan Anda untuk mendefinisikan ekspresi untuk dicocokkan untuk lipatan. Setelah Anda mendefinisikan ekspresi lipatan, Vim memindai setiap baris untuk nilai `'foldexpr'`. Ini adalah variabel yang harus Anda konfigurasi untuk mengembalikan nilai yang sesuai. Jika `'foldexpr'` mengembalikan 0, maka baris tersebut tidak dilipat. Jika mengembalikan 1, maka baris tersebut memiliki tingkat lipatan 1. Jika mengembalikan 2, maka baris tersebut memiliki tingkat lipatan 2. Ada lebih banyak nilai selain bilangan bulat, tetapi saya tidak akan membahasnya. Jika Anda penasaran, lihat `:h fold-expr`.

Pertama, mari kita ubah metode lipatan:

```shell
:set foldmethod=expr
```

Misalkan Anda memiliki daftar makanan sarapan dan Anda ingin melipat semua item sarapan yang dimulai dengan "p":

```shell
donat
pancake
pop-tarts
protein bar
salmon
telur orak-arik
```

Selanjutnya, ubah `foldexpr` untuk menangkap ekspresi yang dimulai dengan "p":

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

Ekspresi di atas terlihat rumit. Mari kita uraikan:
- `:set foldexpr` mengatur opsi `'foldexpr'` untuk menerima ekspresi kustom.
- `getline()` adalah fungsi Vimscript yang mengembalikan konten dari baris yang diberikan. Jika Anda menjalankan `:echo getline(5)`, itu akan mengembalikan konten baris 5.
- `v:lnum` adalah variabel khusus Vim untuk ekspresi `'foldexpr'`. Vim memindai setiap baris dan pada saat itu menyimpan nomor setiap baris dalam variabel `v:lnum`. Pada baris 5, `v:lnum` memiliki nilai 5. Pada baris 10, `v:lnum` memiliki nilai 10.
- `[0]` dalam konteks `getline(v:lnum)[0]` adalah karakter pertama dari setiap baris. Ketika Vim memindai sebuah baris, `getline(v:lnum)` mengembalikan konten dari setiap baris. `getline(v:lnum)[0]` mengembalikan karakter pertama dari setiap baris. Pada baris pertama dari daftar kita, "donat", `getline(v:lnum)[0]` mengembalikan "d". Pada baris kedua dari daftar kita, "pancake", `getline(v:lnum)[0]` mengembalikan "p".
- `==\\"p\\"` adalah setengah kedua dari ekspresi kesetaraan. Ini memeriksa apakah ekspresi yang baru saja Anda evaluasi sama dengan "p". Jika benar, itu mengembalikan 1. Jika salah, itu mengembalikan 0. Di Vim, 1 adalah benar dan 0 adalah salah. Jadi pada baris yang dimulai dengan "p", itu mengembalikan 1. Ingat jika `'foldexpr'` memiliki nilai 1, maka itu memiliki tingkat lipatan 1.

Setelah menjalankan ekspresi ini, Anda seharusnya melihat:

```shell
donat
+-- 3 baris: pancake -----
salmon
telur orak-arik
```

## Lipatan Sintaks

Lipatan sintaks ditentukan oleh penyorotan sintaks bahasa. Jika Anda menggunakan plugin sintaks bahasa seperti [vim-polyglot](https://github.com/sheerun/vim-polyglot), lipatan sintaks akan bekerja langsung tanpa konfigurasi. Cukup ubah metode lipatan menjadi sintaks:

```shell
:set foldmethod=syntax
```

Mari kita anggap Anda sedang mengedit file JavaScript dan Anda telah menginstal vim-polyglot. Jika Anda memiliki array seperti berikut:

```shell
const nums = [
  satu,
  dua,
  tiga,
  empat
]
```

Ini akan dilipat dengan lipatan sintaks. Ketika Anda mendefinisikan penyorotan sintaks untuk bahasa tertentu (biasanya di dalam direktori `syntax/`), Anda dapat menambahkan atribut `fold` untuk membuatnya dapat dilipat. Di bawah ini adalah cuplikan dari file sintaks JavaScript vim-polyglot. Perhatikan kata kunci `fold` di akhir.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Panduan ini tidak akan membahas fitur `sintaks`. Jika Anda penasaran, lihat `:h syntax.txt`.

## Lipatan Diff

Vim dapat melakukan prosedur diff untuk membandingkan dua atau lebih file.

Jika Anda memiliki `file1.txt`:

```shell
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
```

Dan `file2.txt`:

```shell
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
emacs itu oke
```

Jalankan `vimdiff file1.txt file2.txt`:

```shell
+-- 3 baris: vim itu luar biasa -----
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
vim itu luar biasa
[vim itu luar biasa] / [emacs itu oke]
```

Vim secara otomatis melipat beberapa baris identik. Ketika Anda menjalankan perintah `vimdiff`, Vim secara otomatis menggunakan `foldmethod=diff`. Jika Anda menjalankan `:set foldmethod?`, itu akan mengembalikan `diff`.

## Lipatan Penanda

Untuk menggunakan lipatan penanda, jalankan:

```shell
:set foldmethod=marker
```

Misalkan Anda memiliki teks:

```shell
Halo

{{{
dunia
vim
}}}
```

Jalankan `zM`, Anda akan melihat:

```shell
halo

+-- 4 baris: -----
```

Vim melihat `{{{` dan `}}}` sebagai indikator lipatan dan melipat teks di antara mereka. Dengan lipatan penanda, Vim mencari penanda khusus, yang didefinisikan oleh opsi `'foldmarker'`, untuk menandai area lipatan. Untuk melihat penanda apa yang digunakan Vim, jalankan:

```shell
:set foldmarker?
```

Secara default, Vim menggunakan `{{{` dan `}}}` sebagai indikator. Jika Anda ingin mengubah indikator menjadi teks lain, seperti "kopi1" dan "kopi2":

```shell
:set foldmarker=kopi1,kopi2
```

Jika Anda memiliki teks:

```shell
halo

kopi1
dunia
vim
kopi2
```

Sekarang Vim menggunakan `kopi1` dan `kopi2` sebagai penanda lipatan baru. Sebagai catatan, indikator harus berupa string literal dan tidak dapat berupa regex.

## Mempertahankan Lipatan

Anda kehilangan semua informasi lipatan ketika Anda menutup sesi Vim. Jika Anda memiliki file ini, `count.txt`:

```shell
satu
dua
tiga
empat
lima
```

Kemudian lakukan lipatan manual dari baris "tiga" ke bawah (`:3,$fold`):

```shell
satu
dua
+-- 3 baris: tiga ---
```

Ketika Anda keluar dari Vim dan membuka kembali `count.txt`, lipatan tidak lagi ada!

Untuk mempertahankan lipatan, setelah melipat, jalankan:

```shell
:mkview
```

Kemudian ketika Anda membuka `count.txt`, jalankan:

```shell
:loadview
```

Lipatan Anda akan dipulihkan. Namun, Anda harus secara manual menjalankan `mkview` dan `loadview`. Saya tahu bahwa suatu hari nanti, saya akan lupa menjalankan `mkview` sebelum menutup file dan saya akan kehilangan semua lipatan. Bagaimana kita bisa mengotomatiskan proses ini?

Untuk secara otomatis menjalankan `mkview` ketika Anda menutup file `.txt` dan menjalankan `loadview` ketika Anda membuka file `.txt`, tambahkan ini di vimrc Anda:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Ingat bahwa `autocmd` digunakan untuk mengeksekusi perintah pada pemicu peristiwa. Dua peristiwa di sini adalah:
- `BufWinLeave` untuk ketika Anda menghapus buffer dari jendela.
- `BufWinEnter` untuk ketika Anda memuat buffer di dalam jendela.

Sekarang setelah Anda melipat di dalam file `.txt` dan keluar dari Vim, lain kali Anda membuka file itu, informasi lipatan Anda akan dipulihkan.

Secara default, Vim menyimpan informasi lipatan ketika menjalankan `mkview` di dalam `~/.vim/view` untuk sistem Unix. Untuk informasi lebih lanjut, lihat `:h 'viewdir'`.
## Pelajari Melipat dengan Cara Cerdas

Ketika saya pertama kali mulai menggunakan Vim, saya mengabaikan untuk belajar melipat karena saya tidak menganggapnya berguna. Namun, semakin lama saya berkoding, semakin berguna saya menemukan bahwa melipat itu. Lipatan yang ditempatkan secara strategis dapat memberikan Anda gambaran yang lebih baik tentang struktur teks, seperti daftar isi sebuah buku.

Ketika Anda belajar melipat, mulailah dengan lipatan manual karena itu dapat digunakan saat bepergian. Kemudian secara bertahap pelajari berbagai trik untuk melakukan lipatan indentasi dan penanda. Akhirnya, pelajari cara melakukan lipatan sintaksis dan ekspresi. Anda bahkan dapat menggunakan dua yang terakhir untuk menulis plugin Vim Anda sendiri.