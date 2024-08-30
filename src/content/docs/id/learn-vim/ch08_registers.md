---
description: Pelajari jenis-jenis register Vim dan cara penggunaannya yang efisien
  untuk menghemat waktu dan menghindari pengetikan berulang.
title: Ch08. Registers
---

Belajar register Vim seperti belajar aljabar untuk pertama kalinya. Anda tidak berpikir Anda membutuhkannya sampai Anda membutuhkannya.

Anda mungkin telah menggunakan register Vim ketika Anda menyalin atau menghapus teks lalu menempelkannya dengan `p` atau `P`. Namun, apakah Anda tahu bahwa Vim memiliki 10 jenis register yang berbeda? Jika digunakan dengan benar, register Vim dapat menyelamatkan Anda dari pengetikan yang berulang.

Dalam bab ini, saya akan membahas semua jenis register Vim dan cara menggunakannya secara efisien.

## Sepuluh Jenis Register

Berikut adalah 10 jenis register Vim:

1. Register tanpa nama (`""`).
2. Register bernomor (`"0-9`).
3. Register hapus kecil (`"-`).
4. Register bernama (`"a-z`).
5. Register hanya-baca (`":`, `".`, dan `"%`).
6. Register file alternatif (`"#`).
7. Register ekspresi (`"=`).
8. Register pilihan (`"*` dan `"+`).
9. Register lubang hitam (`"_`).
10. Register pola pencarian terakhir (`"/`).

## Operator Register

Untuk menggunakan register, Anda perlu terlebih dahulu menyimpannya dengan operator. Berikut adalah beberapa operator yang menyimpan nilai ke register:

```shell
y    Yank (salin)
c    Hapus teks dan mulai mode sisip
d    Hapus teks
```

Ada lebih banyak operator (seperti `s` atau `x`), tetapi yang di atas adalah yang berguna. Aturan umumnya adalah, jika sebuah operator dapat menghapus teks, kemungkinan besar itu menyimpan teks ke register.

Untuk menempelkan teks dari register, Anda dapat menggunakan:

```shell
p    Tempelkan teks setelah kursor
P    Tempelkan teks sebelum kursor
```

Baik `p` maupun `P` menerima hitungan dan simbol register sebagai argumen. Misalnya, untuk menempelkan sepuluh kali, lakukan `10p`. Untuk menempelkan teks dari register a, lakukan `"ap`. Untuk menempelkan teks dari register a sepuluh kali, lakukan `10"ap`. Ngomong-ngomong, `p` sebenarnya secara teknis berarti "letakkan", bukan "tempel", tetapi saya rasa tempel adalah kata yang lebih konvensional.

Sintaks umum untuk mendapatkan konten dari register tertentu adalah `"a`, di mana `a` adalah simbol register.

## Memanggil Register Dari Mode Sisip

Semua yang Anda pelajari di bab ini juga dapat dieksekusi dalam mode sisip. Untuk mendapatkan teks dari register a, biasanya Anda melakukan `"ap`. Tetapi jika Anda berada dalam mode sisip, jalankan `Ctrl-R a`. Sintaks untuk memanggil register dari mode sisip adalah:

```shell
Ctrl-R a
```

Di mana `a` adalah simbol register. Sekarang Anda tahu cara menyimpan dan mengambil register, mari kita selami!

## Register Tanpa Nama

Untuk mendapatkan teks dari register tanpa nama, lakukan `""p`. Ini menyimpan teks terakhir yang Anda salin, ubah, atau hapus. Jika Anda melakukan yank, ubah, atau hapus lagi, Vim akan secara otomatis mengganti teks lama. Register tanpa nama seperti operasi salin / tempel standar komputer.

Secara default, `p` (atau `P`) terhubung ke register tanpa nama (mulai sekarang saya akan merujuk ke register tanpa nama dengan `p` alih-alih `""p`).

## Register Bernomor

Register bernomor secara otomatis mengisi dirinya sendiri dalam urutan menaik. Ada 2 jenis register bernomor yang berbeda: register yang disalin (`0`) dan register bernomor (`1-9`). Mari kita bahas register yang disalin terlebih dahulu.

### Register yang Disalin

Jika Anda menyalin satu baris teks (`yy`), Vim sebenarnya menyimpan teks itu di dua register:

1. Register tanpa nama (`p`).
2. Register yang disalin (`"0p`).

Ketika Anda menyalin teks yang berbeda, Vim akan memperbarui baik register yang disalin maupun register tanpa nama. Operasi lain (seperti hapus) tidak akan disimpan di register 0. Ini bisa digunakan untuk keuntungan Anda, karena kecuali Anda melakukan yank lagi, teks yang disalin akan selalu ada, tidak peduli berapa banyak perubahan dan penghapusan yang Anda lakukan.

Sebagai contoh, jika Anda:
1. Menyalin satu baris (`yy`)
2. Menghapus satu baris (`dd`)
3. Menghapus satu baris lagi (`dd`)

Register yang disalin akan memiliki teks dari langkah satu.

Jika Anda:
1. Menyalin satu baris (`yy`)
2. Menghapus satu baris (`dd`)
3. Menyalin satu baris lagi (`yy`)

Register yang disalin akan memiliki teks dari langkah tiga.

Satu tips terakhir, saat dalam mode sisip, Anda dapat dengan cepat menempelkan teks yang baru saja Anda salin menggunakan `Ctrl-R 0`.

### Register Bernomor Non-Zero

Ketika Anda mengubah atau menghapus teks yang panjangnya setidaknya satu baris, teks tersebut akan disimpan di register bernomor 1-9 yang diurutkan berdasarkan yang terbaru.

Sebagai contoh, jika Anda memiliki baris-baris ini:

```shell
baris tiga
baris dua
baris satu
```

Dengan kursor Anda di "baris tiga", hapus satu per satu dengan `dd`. Setelah semua baris dihapus, register 1 harus berisi "baris satu" (yang terbaru), register dua "baris dua" (kedua terbaru), dan register tiga "baris tiga" (tertua). Untuk mendapatkan konten dari register satu, lakukan `"1p`.

Sebagai catatan sampingan, register bernomor ini secara otomatis meningkat saat menggunakan perintah titik. Jika register bernomor satu (`"1`) berisi "baris satu", register dua (`"2`) "baris dua", dan register tiga (`"3`) "baris tiga", Anda dapat menempelkan mereka secara berurutan dengan trik ini:
- Lakukan `"1P` untuk menempelkan konten dari register bernomor satu ("1).
- Lakukan `.` untuk menempelkan konten dari register bernomor dua ("2).
- Lakukan `.` untuk menempelkan konten dari register bernomor tiga ("3).

Trik ini bekerja dengan register bernomor mana pun. Jika Anda mulai dengan `"5P`,  `.`  akan melakukan `"6P`, `.` lagi akan melakukan `"7P`, dan seterusnya.

Penghapusan kecil seperti penghapusan kata (`dw`) atau perubahan kata (`cw`) tidak disimpan di register bernomor. Mereka disimpan di register hapus kecil (`"-`), yang akan saya bahas selanjutnya.

## Register Hapus Kecil

Perubahan atau penghapusan kurang dari satu baris tidak disimpan di register bernomor 0-9, tetapi di register hapus kecil (`"-`).

Sebagai contoh:
1. Hapus sebuah kata (`diw`)
2. Hapus satu baris (`dd`)
3. Hapus satu baris (`dd`)

`"-p` memberi Anda kata yang dihapus dari langkah satu.

Contoh lain:
1. Saya menghapus sebuah kata (`diw`)
2. Saya menghapus satu baris (`dd`)
3. Saya menghapus sebuah kata (`diw`)

`"-p` memberi Anda kata yang dihapus dari langkah tiga. `"1p` memberi Anda baris yang dihapus dari langkah dua. Sayangnya, tidak ada cara untuk mengambil kembali kata yang dihapus dari langkah satu karena register hapus kecil hanya menyimpan satu item. Namun, jika Anda ingin mempertahankan teks dari langkah satu, Anda dapat melakukannya dengan register bernama.

## Register Bernama

Register bernama adalah register paling serbaguna di Vim. Ini dapat menyimpan teks yang disalin, diubah, dan dihapus ke dalam register a-z. Tidak seperti 3 jenis register sebelumnya yang Anda lihat yang secara otomatis menyimpan teks ke dalam register, Anda harus secara eksplisit memberi tahu Vim untuk menggunakan register bernama, memberi Anda kontrol penuh.

Untuk menyalin sebuah kata ke register a, Anda dapat melakukannya dengan `"ayiw`.
- `"a` memberi tahu Vim bahwa tindakan berikutnya (hapus / ubah / salin) akan disimpan di register a.
- `yiw` menyalin kata tersebut.

Untuk mendapatkan teks dari register a, jalankan `"ap`. Anda dapat menggunakan semua dua puluh enam karakter alfabet untuk menyimpan dua puluh enam teks berbeda dengan register bernama.

Terkadang Anda mungkin ingin menambahkan ke register bernama yang sudah ada. Dalam hal ini, Anda dapat menambahkan teks Anda alih-alih memulai dari awal. Untuk melakukannya, Anda dapat menggunakan versi huruf besar dari register tersebut. Sebagai contoh, misalkan Anda sudah menyimpan kata "Hello " di register a. Jika Anda ingin menambahkan "world" ke dalam register a, Anda dapat menemukan teks "world" dan menyalinnya menggunakan register A (`"Ayiw`).

## Register Hanya-Baca

Vim memiliki tiga register hanya-baca: `.`, `:`, dan `%`. Mereka cukup sederhana untuk digunakan:

```shell
.    Menyimpan teks terakhir yang dimasukkan
:    Menyimpan perintah terakhir yang dieksekusi
%    Menyimpan nama file saat ini
```

Jika teks terakhir yang Anda tulis adalah "Hello Vim", menjalankan `".p` akan mencetak teks "Hello Vim". Jika Anda ingin mendapatkan nama file saat ini, jalankan `"%p`. Jika Anda menjalankan perintah `:s/foo/bar/g`, menjalankan `":p` akan mencetak teks literal "s/foo/bar/g".

## Register File Alternatif

Di Vim, `#` biasanya mewakili file alternatif. File alternatif adalah file terakhir yang Anda buka. Untuk menyisipkan nama file alternatif, Anda dapat menggunakan `"#p`.

## Register Ekspresi

Vim memiliki register ekspresi, `"=`, untuk mengevaluasi ekspresi.

Untuk mengevaluasi ekspresi matematis `1 + 1`, jalankan:

```shell
"=1+1<Enter>p
```

Di sini, Anda memberi tahu Vim bahwa Anda menggunakan register ekspresi dengan `"=`. Ekspresi Anda adalah (`1 + 1`). Anda perlu mengetik `p` untuk mendapatkan hasilnya. Seperti yang disebutkan sebelumnya, Anda juga dapat mengakses register dari mode sisip. Untuk mengevaluasi ekspresi matematis dari mode sisip, Anda dapat melakukan:

```shell
Ctrl-R =1+1
```

Anda juga dapat mendapatkan nilai dari register mana pun melalui register ekspresi ketika ditambahkan dengan `@`. Jika Anda ingin mendapatkan teks dari register a:

```shell
"=@a
```

Kemudian tekan `<Enter>`, lalu `p`. Demikian pula, untuk mendapatkan nilai dari register a saat dalam mode sisip:

```shell
Ctrl-r =@a
```

Ekspresi adalah topik yang luas di Vim, jadi saya hanya akan membahas dasar-dasarnya di sini. Saya akan membahas ekspresi lebih detail di bab Vimscript selanjutnya.

## Register Pilihan

Tidakkah Anda kadang-kadang berharap bahwa Anda dapat menyalin teks dari program eksternal dan menempelkannya secara lokal di Vim, dan sebaliknya? Dengan register pilihan Vim, Anda bisa. Vim memiliki dua register pilihan: `quotestar` (`"*`) dan `quoteplus` (`"+`). Anda dapat menggunakannya untuk mengakses teks yang disalin dari program eksternal.

Jika Anda berada di program eksternal (seperti browser Chrome) dan Anda menyalin blok teks dengan `Ctrl-C` (atau `Cmd-C`, tergantung pada OS Anda), biasanya Anda tidak akan dapat menggunakan `p` untuk menempelkan teks di Vim. Namun, baik `"+` maupun `"*` di Vim terhubung ke clipboard Anda, sehingga Anda sebenarnya dapat menempelkan teks dengan `"+p` atau `"*p`. Sebaliknya, jika Anda menyalin sebuah kata dari Vim dengan `"+yiw` atau `"*yiw`, Anda dapat menempelkan teks tersebut di program eksternal dengan `Ctrl-V` (atau `Cmd-V`). Perhatikan bahwa ini hanya berfungsi jika program Vim Anda dilengkapi dengan opsi `+clipboard` (untuk memeriksanya, jalankan `:version`).

Anda mungkin bertanya-tanya jika `"*` dan `"+` melakukan hal yang sama, mengapa Vim memiliki dua register yang berbeda? Beberapa mesin menggunakan sistem jendela X11. Sistem ini memiliki 3 jenis pilihan: primer, sekunder, dan clipboard. Jika mesin Anda menggunakan X11, Vim menggunakan pilihan *primer* X11 dengan register `quotestar` (`"*`) dan pilihan *clipboard* X11 dengan register `quoteplus` (`"+`). Ini hanya berlaku jika Anda memiliki opsi `+xterm_clipboard` yang tersedia di build Vim Anda. Jika Vim Anda tidak memiliki `xterm_clipboard`, itu bukan masalah besar. Itu hanya berarti bahwa baik `quotestar` dan `quoteplus` dapat dipertukarkan (milik saya juga tidak).

Saya merasa melakukan `=*p` atau `=+p` (atau `"*p` atau `"+p`) merepotkan. Untuk membuat Vim menempelkan teks yang disalin dari program eksternal hanya dengan `p`, Anda dapat menambahkan ini di vimrc Anda:

```shell
set clipboard=unnamed
```

Sekarang ketika saya menyalin teks dari program eksternal, saya dapat menempelkannya dengan register tanpa nama, `p`. Saya juga dapat menyalin teks dari Vim dan menempelkannya ke program eksternal. Jika Anda memiliki `+xterm_clipboard` diaktifkan, Anda mungkin ingin menggunakan kedua opsi clipboard `unnamed` dan `unnamedplus`.

## Register Lubang Hitam

Setiap kali Anda menghapus atau mengubah teks, teks tersebut disimpan di register Vim secara otomatis. Akan ada saat-saat ketika Anda tidak ingin menyimpan apa pun ke dalam register. Bagaimana Anda bisa melakukannya?

Anda dapat menggunakan register lubang hitam (`"_`). Untuk menghapus satu baris dan tidak membuat Vim menyimpan baris yang dihapus ke dalam register mana pun, gunakan `"_dd`.

Register lubang hitam seperti `/dev/null` dari register.

## Register Pola Pencarian Terakhir

Untuk menempelkan pencarian terakhir Anda (`/` atau `?`), Anda dapat menggunakan register pola pencarian terakhir (`"/`). Untuk menempelkan istilah pencarian terakhir, gunakan `"/p`.

## Melihat Register

Untuk melihat semua register Anda, gunakan perintah `:register`. Untuk melihat hanya register "a, "1, dan "-, gunakan `:register a 1 -`.

Ada plugin bernama [vim-peekaboo](https://github.com/junegunn/vim-peekaboo) yang memungkinkan Anda melihat isi register ketika Anda menekan `"` atau `@` dalam mode normal dan `Ctrl-R` dalam mode sisip. Saya menemukan plugin ini sangat berguna karena sering kali, saya tidak dapat mengingat konten di register saya. Cobalah!

## Menjalankan Register

Register bernama tidak hanya untuk menyimpan teks. Mereka juga dapat mengeksekusi makro dengan `@`. Saya akan membahas makro di bab berikutnya.

Ingatlah bahwa karena makro disimpan di dalam register Vim, Anda dapat secara tidak sengaja menimpa teks yang disimpan dengan makro. Jika Anda menyimpan teks "Hello Vim" di register a dan Anda kemudian merekam makro di register yang sama (`qa{urutan-makro}q`), makro tersebut akan menimpa teks "Hello Vim" Anda yang disimpan sebelumnya.
## Menghapus Register

Secara teknis, tidak ada kebutuhan untuk menghapus register karena teks berikutnya yang Anda simpan di bawah nama register yang sama akan menimpanya. Namun, Anda dapat dengan cepat menghapus register bernama dengan merekam makro kosong. Misalnya, jika Anda menjalankan `qaq`, Vim akan merekam makro kosong di register a.

Alternatif lain adalah menjalankan perintah `:call setreg('a', 'hello register a')` di mana a adalah register a dan "hello register a" adalah teks yang ingin Anda simpan.

Satu cara lagi untuk menghapus register adalah dengan mengatur konten "register a" ke string kosong dengan ekspresi `:let @a = ''`.

## Menempatkan Konten Register

Anda dapat menggunakan perintah `:put` untuk menempelkan konten dari salah satu register. Misalnya, jika Anda menjalankan `:put a`, Vim akan mencetak konten dari register a di bawah baris saat ini. Ini berfungsi mirip dengan `"ap`, dengan perbedaan bahwa perintah mode normal `p` mencetak konten register setelah kursor dan perintah `:put` mencetak konten register pada baris baru.

Karena `:put` adalah perintah baris perintah, Anda dapat memberikannya alamat. `:10put a` akan menempelkan teks dari register a ke bawah baris 10.

Satu trik keren untuk menggunakan `:put` dengan register black hole (`"_`). Karena register black hole tidak menyimpan teks apa pun, `:put _` akan menyisipkan baris kosong sebagai gantinya. Anda dapat menggabungkannya dengan perintah global untuk menyisipkan beberapa baris kosong. Misalnya, untuk menyisipkan baris kosong di bawah semua baris yang mengandung teks "end", jalankan `:g/end/put _`. Anda akan belajar tentang perintah global nanti.

## Belajar Register dengan Cara Cerdas

Anda telah sampai di akhir. Selamat! Jika Anda merasa kewalahan dengan informasi yang begitu banyak, Anda tidak sendirian. Ketika saya pertama kali mulai belajar tentang register Vim, ada terlalu banyak informasi yang harus dipahami sekaligus.

Saya tidak berpikir Anda harus menghafal semua register sekaligus. Untuk menjadi produktif, Anda dapat mulai dengan menggunakan hanya 3 register ini:
1. Register tanpa nama (`""`).
2. Register bernama (`"a-z`).
3. Register bernomor (`"0-9`).

Karena register tanpa nama secara default menggunakan `p` dan `P`, Anda hanya perlu mempelajari dua register: register bernama dan register bernomor. Secara bertahap pelajari lebih banyak register saat Anda membutuhkannya. Luangkan waktu Anda.

Rata-rata manusia memiliki kapasitas memori jangka pendek yang terbatas, sekitar 5 - 7 item sekaligus. Itulah sebabnya dalam pengeditan sehari-hari saya, saya hanya menggunakan sekitar 5 - 7 register bernama. Tidak ada cara saya bisa mengingat semua dua puluh enam di kepala saya. Saya biasanya mulai dengan register a, kemudian b, naik sesuai urutan alfabet. Cobalah dan bereksperimen untuk melihat teknik mana yang paling cocok untuk Anda.

Register Vim sangat kuat. Digunakan secara strategis, ini dapat menyelamatkan Anda dari mengetik teks yang berulang kali. Selanjutnya, mari kita belajar tentang makro.