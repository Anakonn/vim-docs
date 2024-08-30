---
description: Pelajari cara menggunakan makro di Vim untuk mengotomatiskan tugas berulang,
  membuat pengeditan file lebih efisien dan menarik.
title: Ch09. Macros
---

Saat mengedit file, Anda mungkin mendapati diri Anda mengulangi tindakan yang sama. Bukankah akan menyenangkan jika Anda dapat melakukan tindakan tersebut sekali dan memutarnya kembali kapan pun Anda membutuhkannya? Dengan makro Vim, Anda dapat merekam tindakan dan menyimpannya di dalam register Vim untuk dieksekusi kapan pun Anda membutuhkannya.

Dalam bab ini, Anda akan belajar bagaimana menggunakan makro untuk mengotomatiskan tugas-tugas yang membosankan (plus terlihat keren saat melihat file Anda mengedit dirinya sendiri).

## Makro Dasar

Berikut adalah sintaks dasar dari makro Vim:

```shell
qa                     Mulai merekam makro di register a
q (saat merekam)       Hentikan perekaman makro
```

Anda dapat memilih huruf kecil mana pun (a-z) untuk menyimpan makro. Berikut adalah cara Anda dapat mengeksekusi makro:

```shell
@a    Eksekusi makro dari register a
@@    Eksekusi makro yang terakhir dieksekusi
```

Misalkan Anda memiliki teks ini dan Anda ingin mengubah semua huruf di setiap baris menjadi huruf kapital:

```shell
hello
vim
macros
are
awesome
```

Dengan kursor Anda berada di awal baris "hello", jalankan:

```shell
qa0gU$jq
```

Rincian:
- `qa` mulai merekam makro di register a.
- `0` pergi ke awal baris.
- `gU$` mengubah teks dari lokasi Anda saat ini hingga akhir baris menjadi huruf kapital.
- `j` turun satu baris.
- `q` menghentikan perekaman.

Untuk memutarnya, jalankan `@a`. Seperti banyak perintah Vim lainnya, Anda dapat memberikan argumen hitungan pada makro. Misalnya, menjalankan `3@a` mengeksekusi makro tiga kali.

## Pengaman Keamanan

Eksekusi makro secara otomatis berakhir ketika menemui kesalahan. Misalkan Anda memiliki teks ini:

```shell
a. donut coklat
b. donut mochi
c. donut gula bubuk
d. donut polos
```

Jika Anda ingin mengubah huruf pertama di setiap baris menjadi huruf kapital, makro ini seharusnya berfungsi:

```shell
qa0W~jq
```

Berikut adalah rincian dari perintah di atas:
- `qa` mulai merekam makro di register a.
- `0` pergi ke awal baris.
- `W` pergi ke KATA berikutnya.
- `~` mengubah huruf karakter di bawah kursor.
- `j` turun satu baris.
- `q` menghentikan perekaman.

Saya lebih suka menghitung lebih banyak pada eksekusi makro saya daripada kurang, jadi saya biasanya memanggilnya sembilan puluh sembilan kali (`99@a`). Dengan perintah ini, Vim sebenarnya tidak menjalankan makro ini sembilan puluh sembilan kali. Ketika Vim mencapai baris terakhir dan menjalankan gerakan `j`, ia tidak menemukan baris lagi untuk dituruni, melempar kesalahan, dan menghentikan eksekusi makro.

Fakta bahwa eksekusi makro berhenti saat menemui kesalahan pertama adalah fitur yang baik, jika tidak, Vim akan terus menjalankan makro ini sembilan puluh sembilan kali meskipun sudah mencapai akhir baris.

## Makro Baris Perintah

Menjalankan `@a` dalam mode normal bukan satu-satunya cara Anda dapat mengeksekusi makro di Vim. Anda juga dapat menjalankan perintah baris perintah `:normal @a`. `:normal` memungkinkan pengguna untuk mengeksekusi perintah mode normal apa pun yang diberikan sebagai argumen. Dalam kasus di atas, ini sama dengan menjalankan `@a` dari mode normal.

Perintah `:normal` menerima rentang sebagai argumen. Anda dapat menggunakan ini untuk menjalankan makro dalam rentang yang dipilih. Jika Anda ingin mengeksekusi makro Anda antara baris 2 dan 3, Anda dapat menjalankan `:2,3 normal @a`.

## Menjalankan Makro di Beberapa File

Misalkan Anda memiliki beberapa file `.txt`, masing-masing berisi beberapa teks. Tugas Anda adalah mengubah huruf pertama hanya pada baris yang mengandung kata "donut". Anggap Anda memiliki `0W~j` di register a (makro yang sama seperti sebelumnya). Bagaimana Anda dapat dengan cepat menyelesaikannya?

File pertama:

```shell
## savory.txt
a. donut cheddar jalapeno
b. donut mac n cheese
c. dumpling goreng
```

File kedua:

```shell
## sweet.txt
a. donut coklat
b. pancake coklat
c. donut gula bubuk
```

File ketiga:

```shell
## plain.txt
a. roti gandum
b. donut polos
```

Berikut adalah cara Anda dapat melakukannya:
- `:args *.txt` untuk menemukan semua file `.txt` di direktori Anda saat ini.
- `:argdo g/donut/normal @a` mengeksekusi perintah global `g/donut/normal @a` di setiap file dalam `:args`.
- `:argdo update` mengeksekusi perintah `update` untuk menyimpan setiap file dalam `:args` ketika buffer telah dimodifikasi.

Jika Anda tidak familiar dengan perintah global `:g/donut/normal @a`, ini mengeksekusi perintah yang Anda berikan (`normal @a`) pada baris yang cocok dengan pola (`/donut/`). Saya akan membahas perintah global di bab selanjutnya.

## Makro Rekursif

Anda dapat mengeksekusi makro secara rekursif dengan memanggil register makro yang sama saat merekam makro tersebut. Misalkan Anda memiliki daftar ini lagi dan Anda perlu mengubah huruf pertama:

```shell
a. donut coklat
b. donut mochi
c. donut gula bubuk
d. donut polos
```

Kali ini, mari kita lakukan secara rekursif. Jalankan:

```shell
qaqqa0W~j@aq
```

Berikut adalah rincian langkah-langkahnya:
- `qaq` merekam makro kosong a. Penting untuk memulai dengan register kosong karena ketika Anda memanggil makro secara rekursif, ia akan menjalankan apa pun yang ada di register itu.
- `qa` mulai merekam di register a.
- `0` pergi ke karakter pertama di baris saat ini.
- `W` pergi ke KATA berikutnya.
- `~` mengubah huruf karakter di bawah kursor.
- `j` turun satu baris.
- `@a` mengeksekusi makro a.
- `q` menghentikan perekaman.

Sekarang Anda dapat menjalankan `@a` dan melihat Vim mengeksekusi makro secara rekursif.

Bagaimana makro tahu kapan harus berhenti? Ketika makro berada di baris terakhir, ia mencoba menjalankan `j`, karena tidak ada lagi baris untuk dituruni, ia menghentikan eksekusi makro.

## Menambahkan Makro

Jika Anda perlu menambahkan tindakan ke makro yang sudah ada, alih-alih membuat ulang makro dari awal, Anda dapat menambahkan tindakan ke yang sudah ada. Dalam bab register, Anda belajar bahwa Anda dapat menambahkan register bernama dengan menggunakan simbol huruf besar. Aturan yang sama berlaku. Untuk menambahkan tindakan ke makro register a, gunakan register A.

Rekam makro di register a: `qa0W~q` (urutan ini mengubah huruf KATA berikutnya di sebuah baris). Jika Anda ingin menambahkan urutan baru untuk juga menambahkan titik di akhir baris, jalankan:

```shell
qAA.<Esc>q
```

Rincian:
- `qA` mulai merekam makro di register A.
- `A.<Esc>` menyisipkan di akhir baris (di sini `A` adalah perintah mode sisip, tidak boleh bingung dengan makro A) sebuah titik, kemudian keluar dari mode sisip.
- `q` menghentikan perekaman makro.

Sekarang ketika Anda mengeksekusi `@a`, itu tidak hanya mengubah huruf KATA berikutnya, tetapi juga menambahkan titik di akhir baris.

## Mengubah Makro

Bagaimana jika Anda perlu menambahkan tindakan baru di tengah makro?

Anggaplah Anda memiliki makro yang mengubah huruf kata pertama yang sebenarnya dan menambahkan titik di akhir baris, `0W~A.<Esc>` di register a. Misalkan antara mengubah huruf pertama dan menambahkan titik di akhir baris, Anda perlu menambahkan kata "deep fried" tepat sebelum kata "donut" *(karena satu-satunya hal yang lebih baik daripada donut biasa adalah donut deep fried)*.

Saya akan menggunakan kembali teks dari bagian sebelumnya:
```shell
a. donut coklat
b. donut mochi
c. donut gula bubuk
d. donut polos
```

Pertama, mari kita panggil makro yang ada (anggap Anda telah menyimpan makro dari bagian sebelumnya di register a) dengan `:put a`:

```shell
0W~A.^[
```

Apa itu `^[` ini? Bukankah Anda melakukan `0W~A.<Esc>`? Di mana `<Esc>`? `^[` adalah representasi *kode internal* Vim dari `<Esc>`. Dengan beberapa kunci khusus, Vim mencetak representasi dari kunci-kunci tersebut dalam bentuk kode internal. Beberapa kunci umum yang memiliki representasi kode internal adalah `<Esc>`, `<Backspace>`, dan `<Enter>`. Ada lebih banyak kunci khusus, tetapi itu tidak dalam cakupan bab ini.

Kembali ke makro, tepat setelah operator pengubah huruf (`~`), mari kita tambahkan instruksi untuk pergi ke akhir baris (`$`), kembali satu kata (`b`), pergi ke mode sisip (`i`), ketik "deep fried " (jangan lupa spasi setelah "fried "), dan keluar dari mode sisip (`<Esc>`).

Berikut adalah apa yang akan Anda akhiri dengan:

```shell
0W~$bideep fried <Esc>A.^[
```

Ada sedikit masalah. Vim tidak memahami `<Esc>`. Anda tidak dapat mengetik `<Esc>` secara harfiah. Anda harus menulis representasi kode internal untuk kunci `<Esc>`. Saat dalam mode sisip, Anda tekan `Ctrl-V` diikuti dengan `<Esc>`. Vim akan mencetak `^[`. `Ctrl-V` adalah operator mode sisip untuk menyisipkan karakter non-digit berikutnya *secara harfiah*. Kode makro Anda sekarang harus terlihat seperti ini:

```shell
0W~$bideep fried ^[A.^[
```

Untuk menambahkan instruksi yang diubah ke dalam register a, Anda dapat melakukannya dengan cara yang sama seperti menambahkan entri baru ke dalam register bernama. Di awal baris, jalankan `"ay$` untuk menyimpan teks yang dicopy ke dalam register a.

Sekarang ketika Anda mengeksekusi `@a`, makro Anda akan mengubah huruf kata pertama, menambahkan "deep fried " sebelum "donut", dan menambahkan "." di akhir baris. Yum!

Cara alternatif untuk mengubah makro adalah dengan menggunakan ekspresi baris perintah. Lakukan `:let @a="`, kemudian lakukan `Ctrl-R a`, ini akan secara harfiah menempelkan konten dari register a. Akhirnya, jangan lupa untuk menutup tanda kutip ganda (`"`). Anda mungkin memiliki sesuatu seperti `:let @a="0W~$bideep fried ^[A.^["`.

## Redundansi Makro

Anda dapat dengan mudah menggandakan makro dari satu register ke register lainnya. Misalnya, untuk menggandakan makro di register a ke register z, Anda dapat melakukan `:let @z = @a`. `@a` mewakili konten dari register a. Sekarang jika Anda menjalankan `@z`, itu melakukan tindakan yang persis sama seperti `@a`.

Saya menemukan bahwa membuat redundansi berguna pada makro yang paling sering saya gunakan. Dalam alur kerja saya, saya biasanya merekam makro dalam tujuh huruf alfabet pertama (a-g) dan saya sering menggantinya tanpa banyak berpikir. Jika saya memindahkan makro yang berguna ke akhir alfabet, saya dapat mempertahankannya tanpa khawatir bahwa saya mungkin secara tidak sengaja menggantinya.

## Makro Seri vs Paralel

Vim dapat mengeksekusi makro secara seri dan paralel. Misalkan Anda memiliki teks ini:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Jika Anda ingin merekam makro untuk mengubah semua "FUNC" yang ditulis dengan huruf kapital menjadi huruf kecil, makro ini seharusnya berfungsi:

```shell
qa0f{gui{jq
```

Rincian:
- `qa` mulai merekam di register a.
- `0` pergi ke baris pertama.
- `f{` menemukan instance pertama dari "{".
- `gui{` mengubah huruf kecil (`gu`) teks di dalam objek teks kurung (`i{`).
- `j` turun satu baris.
- `q` menghentikan perekaman makro.

Sekarang Anda dapat menjalankan `99@a` untuk mengeksekusinya di baris yang tersisa. Namun, bagaimana jika Anda memiliki ekspresi impor ini di dalam file Anda?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Menjalankan `99@a`, hanya mengeksekusi makro tiga kali. Itu tidak mengeksekusi makro di dua baris terakhir karena eksekusi gagal menjalankan `f{` di baris "foo". Ini diharapkan ketika menjalankan makro secara seri. Anda selalu dapat pergi ke baris berikutnya di mana "FUNC4" berada dan memutar kembali makro itu lagi. Tapi bagaimana jika Anda ingin menyelesaikan semuanya dalam satu kali jalan?

Jalankan makro secara paralel.

Ingat dari bagian sebelumnya bahwa makro dapat dieksekusi menggunakan perintah baris perintah `:normal` (misalnya: `:3,5 normal @a` mengeksekusi makro a di baris 3-5). Jika Anda menjalankan `:1,$ normal @a`, Anda akan melihat bahwa makro dieksekusi di semua baris kecuali baris "foo". Itu berhasil!

Meskipun secara internal Vim tidak benar-benar menjalankan makro secara paralel, secara eksternal, ia berperilaku seperti itu. Vim mengeksekusi `@a` *secara independen* di setiap baris dari baris pertama hingga baris terakhir (`1,$`). Karena Vim mengeksekusi makro ini secara independen, setiap baris tidak tahu bahwa salah satu eksekusi makro telah gagal di baris "foo".
## Pelajari Makro dengan Cara Cerdas

Banyak hal yang Anda lakukan dalam pengeditan bersifat repetitif. Untuk menjadi lebih baik dalam pengeditan, biasakan diri Anda untuk mendeteksi tindakan yang berulang. Gunakan makro (atau perintah titik) sehingga Anda tidak perlu melakukan tindakan yang sama dua kali. Hampir semua yang dapat Anda lakukan di Vim dapat direplikasi dengan makro.

Pada awalnya, saya merasa sangat canggung untuk menulis makro, tetapi jangan menyerah. Dengan cukup latihan, Anda akan terbiasa mengotomatiskan segalanya.

Anda mungkin menemukan bahwa menggunakan mnemonik dapat membantu mengingat makro Anda. Jika Anda memiliki makro yang membuat fungsi, gunakan "f register (`qf`). Jika Anda memiliki makro untuk operasi numerik, "n register harus berfungsi (`qn`). Namai dengan *register bernama pertama* yang terlintas di pikiran Anda ketika Anda memikirkan operasi tersebut. Saya juga menemukan bahwa "q register adalah register makro default yang baik karena `qq` membutuhkan lebih sedikit daya otak untuk diingat. Terakhir, saya juga suka mengurutkan makro saya dalam urutan alfabet, seperti `qa`, kemudian `qb`, kemudian `qc`, dan seterusnya.

Temukan metode yang paling cocok untuk Anda.