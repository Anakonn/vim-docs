---
description: Panduan ini menjelaskan struktur dasar perintah Vim, membantu pengguna
  memahami dan berkomunikasi dengan Vim melalui aturan tata bahasa dan praktik.
title: Ch04. Vim Grammar
---

Mudah untuk merasa terintimidasi oleh kompleksitas perintah Vim. Jika Anda melihat pengguna Vim melakukan `gUfV` atau `1GdG`, Anda mungkin tidak langsung tahu apa yang dilakukan perintah ini. Di bab ini, saya akan membongkar struktur umum perintah Vim menjadi aturan tata bahasa yang sederhana.

Ini adalah bab terpenting dalam seluruh panduan. Setelah Anda memahami struktur tata bahasa yang mendasarinya, Anda akan dapat "berbicara" dengan Vim. Ngomong-ngomong, ketika saya mengatakan *bahasa Vim* di bab ini, saya tidak berbicara tentang bahasa Vimscript (bahasa pemrograman bawaan Vim, Anda akan mempelajarinya di bab-bab selanjutnya).

## Cara Belajar Bahasa

Saya bukan penutur asli bahasa Inggris. Saya belajar bahasa Inggris ketika saya berusia 13 tahun saat pindah ke AS. Ada tiga hal yang perlu Anda lakukan untuk belajar berbicara bahasa baru:

1. Pelajari aturan tata bahasa.
2. Tingkatkan kosakata.
3. Latihan, latihan, latihan.

Demikian pula, untuk berbicara bahasa Vim, Anda perlu mempelajari aturan tata bahasa, meningkatkan kosakata, dan berlatih hingga Anda dapat menjalankan perintah tanpa berpikir.

## Aturan Tata Bahasa

Hanya ada satu aturan tata bahasa dalam bahasa Vim:

```shell
kata kerja + kata benda
```

Itu saja!

Ini seperti mengatakan frasa bahasa Inggris ini:

- *"Makan (kata kerja) sebuah donat (kata benda)"*
- *"Tendang (kata kerja) sebuah bola (kata benda)"*
- *"Pelajari (kata kerja) editor Vim (kata benda)"*

Sekarang Anda perlu membangun kosakata Anda dengan kata kerja dan kata benda dasar Vim.

## Kata Benda (Gerakan)

Kata benda adalah gerakan Vim. Gerakan digunakan untuk bergerak di dalam Vim. Di bawah ini adalah daftar beberapa gerakan Vim:

```shell
h    Kiri
j    Bawah
k    Atas
l    Kanan
w    Bergerak maju ke awal kata berikutnya
}    Melompat ke paragraf berikutnya
$    Pergi ke akhir baris
```

Anda akan belajar lebih banyak tentang gerakan di bab berikutnya, jadi jangan khawatir terlalu banyak jika Anda tidak memahami beberapa di antaranya.

## Kata Kerja (Operator)

Menurut `:h operator`, Vim memiliki 16 operator. Namun, menurut pengalaman saya, mempelajari 3 operator ini sudah cukup untuk 80% kebutuhan pengeditan saya:

```shell
y    Yank teks (salin)
d    Hapus teks dan simpan ke register
c    Hapus teks, simpan ke register, dan mulai mode sisip
```

Ngomong-ngomong, setelah Anda yank teks, Anda dapat menempelkannya dengan `p` (setelah kursor) atau `P` (sebelum kursor).

## Kata Kerja dan Kata Benda

Sekarang Anda tahu kata benda dan kata kerja dasar, mari kita terapkan aturan tata bahasa, kata kerja + kata benda! Misalkan Anda memiliki ekspresi ini:

```javascript
const learn = "vim";
```

- Untuk yank semuanya dari lokasi Anda saat ini hingga akhir baris: `y$`.
- Untuk menghapus dari lokasi Anda saat ini hingga awal kata berikutnya: `dw`.
- Untuk mengubah dari lokasi Anda saat ini hingga akhir paragraf saat ini, katakan `c}`.

Gerakan juga menerima angka hitung sebagai argumen (saya akan membahas ini di bab berikutnya). Jika Anda perlu naik 3 baris, alih-alih menekan `k` 3 kali, Anda bisa melakukan `3k`. Hitungan bekerja dengan tata bahasa Vim.
- Untuk yank dua karakter ke kiri: `y2h`.
- Untuk menghapus dua kata berikutnya: `d2w`.
- Untuk mengubah dua baris berikutnya: `c2j`.

Saat ini, Anda mungkin harus berpikir lama dan keras untuk menjalankan bahkan perintah sederhana. Anda tidak sendirian. Ketika saya pertama kali mulai, saya mengalami kesulitan yang sama tetapi saya menjadi lebih cepat seiring waktu. Begitu juga Anda. Pengulangan, pengulangan, pengulangan.

Sebagai catatan, operasi baris (operasi yang mempengaruhi seluruh baris) adalah operasi umum dalam pengeditan teks. Secara umum, dengan mengetikkan perintah operator dua kali, Vim melakukan operasi baris untuk tindakan itu. Misalnya, `dd`, `yy`, dan `cc` melakukan **penghapusan**, **yank**, dan **perubahan** pada seluruh baris. Cobalah ini dengan operator lain!

Ini sangat keren. Saya melihat pola di sini. Tapi saya belum selesai. Vim memiliki satu jenis kata benda lagi: objek teks.

## Lebih Banyak Kata Benda (Objek Teks)

Bayangkan Anda berada di dalam sepasang tanda kurung seperti `(hello Vim)` dan Anda perlu menghapus seluruh frasa di dalam tanda kurung. Bagaimana Anda bisa melakukannya dengan cepat? Apakah ada cara untuk menghapus "grup" yang Anda masuki?

Jawabannya adalah ya. Teks sering datang terstruktur. Mereka sering mengandung tanda kurung, kutipan, tanda kurung siku, kurung kurawal, dan lainnya. Vim memiliki cara untuk menangkap struktur ini dengan objek teks.

Objek teks digunakan dengan operator. Ada dua jenis objek teks: objek teks dalam dan luar.

```shell
i + objek    Objek teks dalam
a + objek    Objek teks luar
```

Objek teks dalam memilih objek di dalam *tanpa* ruang kosong atau objek sekitarnya. Objek teks luar memilih objek di dalam *termasuk* ruang kosong atau objek sekitarnya. Secara umum, objek teks luar selalu memilih lebih banyak teks daripada objek teks dalam. Jika kursor Anda berada di dalam tanda kurung dalam ekspresi `(hello Vim)`:
- Untuk menghapus teks di dalam tanda kurung tanpa menghapus tanda kurung: `di(`.
- Untuk menghapus tanda kurung dan teks di dalamnya: `da(`.

Mari kita lihat contoh yang berbeda. Misalkan Anda memiliki fungsi Javascript ini dan kursor Anda berada di "H" dalam "Hello":

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Untuk menghapus seluruh "Hello Vim": `di(`.
- Untuk menghapus konten fungsi (dikelilingi oleh `{}`): `di{`.
- Untuk menghapus string "Hello": `diw`.

Objek teks sangat kuat karena Anda dapat menargetkan objek yang berbeda dari satu lokasi. Anda dapat menghapus objek di dalam tanda kurung, blok fungsi, atau kata saat ini. Secara mnemonik, ketika Anda melihat `di(`, `di{`, dan `diw`, Anda mendapatkan ide yang cukup baik objek teks mana yang mereka wakili: sepasang tanda kurung, sepasang kurung kurawal, dan sebuah kata.

Mari kita lihat satu contoh terakhir. Misalkan Anda memiliki tag HTML ini:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Jika kursor Anda berada di teks "Header1":
- Untuk menghapus "Header1": `dit`.
- Untuk menghapus `<h1>Header1</h1>`: `dat`.

Jika kursor Anda berada di "div":
- Untuk menghapus `h1` dan kedua baris `p`: `dit`.
- Untuk menghapus semuanya: `dat`.
- Untuk menghapus "div": `di<`.

Di bawah ini adalah daftar objek teks umum:

```shell
w         Sebuah kata
p         Sebuah paragraf
s         Sebuah kalimat
( atau )  Sepasang ( )
{ atau }  Sepasang { }
[ atau ]  Sepasang [ ]
< atau >  Sepasang < >
t         Tag XML
"         Sepasang " "
'         Sepasang ' '
`         Sepasang ` `
```

Untuk mempelajari lebih lanjut, lihat `:h text-objects`.

## Komposabilitas dan Tata Bahasa

Tata bahasa Vim adalah subset dari fitur komposabilitas Vim. Mari kita bahas komposabilitas di Vim dan mengapa ini adalah fitur hebat yang dimiliki dalam editor teks.

Komposabilitas berarti memiliki seperangkat perintah umum yang dapat digabungkan (dikomposisi) untuk melakukan perintah yang lebih kompleks. Sama seperti dalam pemrograman di mana Anda dapat membuat abstraksi yang lebih kompleks dari abstraksi yang lebih sederhana, di Vim Anda dapat mengeksekusi perintah kompleks dari perintah yang lebih sederhana. Tata bahasa Vim adalah manifestasi dari sifat komposabel Vim.

Kekuatan sejati dari komposabilitas Vim bersinar ketika terintegrasi dengan program eksternal. Vim memiliki operator filter (`!`) untuk menggunakan program eksternal sebagai filter untuk teks kita. Misalkan Anda memiliki teks berantakan di bawah ini dan Anda ingin membuatnya menjadi tabel:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Ini tidak dapat dilakukan dengan mudah menggunakan perintah Vim, tetapi Anda dapat melakukannya dengan cepat menggunakan perintah terminal `column` (asumsikan terminal Anda memiliki perintah `column`). Dengan kursor Anda di "Id", jalankan `!}column -t -s "|"`. Voila! Sekarang Anda memiliki data tabel yang rapi hanya dengan satu perintah cepat.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Mari kita uraikan perintah tersebut. Kata kerjanya adalah `!` (operator filter) dan kata bendanya adalah `}` (pergi ke paragraf berikutnya). Operator filter `!` menerima argumen lain, sebuah perintah terminal, jadi saya memberikannya `column -t -s "|"`. Saya tidak akan menjelaskan bagaimana `column` bekerja, tetapi pada dasarnya, itu membuat teks menjadi tabel.

Misalkan Anda tidak hanya ingin membuat teks Anda menjadi tabel, tetapi juga menampilkan hanya baris yang memiliki "Ok". Anda tahu bahwa `awk` dapat melakukan pekerjaan itu dengan mudah. Anda bisa melakukan ini sebagai gantinya:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Hasil:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Bagus! Operator perintah eksternal juga dapat menggunakan pipe (`|`).

Inilah kekuatan komposabilitas Vim. Semakin banyak Anda mengetahui operator, gerakan, dan perintah terminal Anda, kemampuan Anda untuk menyusun tindakan kompleks *berlipat ganda*.

Misalkan Anda hanya tahu empat gerakan, `w, $, }, G` dan hanya satu operator, `d`. Anda dapat melakukan 8 tindakan: *bergerak* 4 cara berbeda (`w, $, }, G`) dan *menghapus* 4 target berbeda (`dw, d$, d}, dG`). Kemudian suatu hari Anda belajar tentang operator huruf besar (`gU`). Anda tidak hanya menambahkan satu kemampuan baru ke dalam alat Vim Anda, tetapi *empat*: `gUw, gU$, gU}, gUG`. Ini menjadikan 12 alat di dalam alat Vim Anda. Setiap pengetahuan baru adalah pengganda untuk kemampuan Anda saat ini. Jika Anda tahu 10 gerakan dan 5 operator, Anda memiliki 60 gerakan (50 operasi + 10 gerakan) dalam arsenal Anda. Vim memiliki gerakan nomor baris (`nG`) yang memberi Anda `n` gerakan, di mana `n` adalah berapa banyak baris yang Anda miliki dalam file Anda (untuk pergi ke baris 5, jalankan `5G`). Gerakan pencarian (`/`) praktis memberi Anda jumlah gerakan yang hampir tidak terbatas karena Anda dapat mencari apa saja. Operator perintah eksternal (`!`) memberi Anda sebanyak mungkin alat penyaringan sebanyak jumlah perintah terminal yang Anda ketahui. Menggunakan alat komposabel seperti Vim, semua yang Anda ketahui dapat dihubungkan untuk melakukan operasi dengan kompleksitas yang meningkat. Semakin banyak yang Anda ketahui, semakin kuat Anda menjadi.

Perilaku komposabel ini mencerminkan filosofi Unix: *lakukan satu hal dengan baik*. Seorang operator memiliki satu tugas: lakukan Y. Sebuah gerakan memiliki satu tugas: pergi ke X. Dengan menggabungkan operator dengan gerakan, Anda secara prediktif mendapatkan YX: lakukan Y pada X.

Gerakan dan operator dapat diperluas. Anda dapat membuat gerakan dan operator kustom untuk ditambahkan ke alat Vim Anda. Plugin [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) memungkinkan Anda untuk membuat objek teks Anda sendiri. Ini juga berisi [daftar](https://github.com/kana/vim-textobj-user/wiki) objek teks kustom yang dibuat pengguna.

## Pelajari Tata Bahasa Vim dengan Cara Cerdas

Anda baru saja belajar tentang aturan tata bahasa Vim: `kata kerja + kata benda`. Salah satu momen "AHA!" terbesar saya dalam Vim adalah ketika saya baru saja belajar tentang operator huruf besar (`gU`) dan ingin mengubah kata saat ini menjadi huruf besar, saya *secara naluriah* menjalankan `gUiw` dan itu berhasil! Kata tersebut menjadi huruf besar. Pada saat itu, saya akhirnya mulai memahami Vim. Harapan saya adalah Anda akan memiliki momen "AHA!" Anda sendiri segera, jika belum.

Tujuan dari bab ini adalah untuk menunjukkan kepada Anda pola `kata kerja + kata benda` dalam Vim sehingga Anda akan mendekati pembelajaran Vim seperti belajar bahasa baru alih-alih menghafal setiap kombinasi perintah.

Pelajari pola tersebut dan pahami implikasinya. Itulah cara cerdas untuk belajar.