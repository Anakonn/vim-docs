---
description: Pelajari cara menggunakan perintah titik (dot command) di Vim untuk mengulangi
  perubahan sebelumnya dengan mudah dan efisien dalam pengeditan teks.
title: Ch07. the Dot Command
---

Secara umum, Anda harus mencoba untuk menghindari mengulang apa yang baru saja Anda lakukan kapan pun memungkinkan. Dalam bab ini, Anda akan belajar bagaimana menggunakan perintah titik untuk dengan mudah mengulang perubahan sebelumnya. Ini adalah perintah serbaguna untuk mengurangi pengulangan sederhana.

## Penggunaan

Sama seperti namanya, Anda dapat menggunakan perintah titik dengan menekan tombol titik (`.`).

Sebagai contoh, jika Anda ingin mengganti semua "let" dengan "const" dalam ekspresi berikut:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Cari dengan `/let` untuk pergi ke kecocokan.
- Ubah dengan `cwconst<Esc>` untuk mengganti "let" dengan "const".
- Navigasi dengan `n` untuk menemukan kecocokan berikutnya menggunakan pencarian sebelumnya.
- Ulangi apa yang baru saja Anda lakukan dengan perintah titik (`.`).
- Terus tekan `n . n .` sampai Anda mengganti setiap kata.

Di sini perintah titik mengulang urutan `cwconst<Esc>`. Ini menghemat Anda dari mengetik delapan ketukan tombol sebagai imbalan hanya untuk satu.

## Apa Itu Perubahan?

Jika Anda melihat definisi perintah titik (`:h .`), itu mengatakan bahwa perintah titik mengulang perubahan terakhir. Apa itu perubahan?

Setiap kali Anda memperbarui (menambahkan, memodifikasi, atau menghapus) konten dari buffer saat ini, Anda sedang membuat perubahan. Pengecualian adalah pembaruan yang dilakukan oleh perintah baris perintah (perintah yang dimulai dengan `:`) tidak dihitung sebagai perubahan.

Dalam contoh pertama, `cwconst<Esc>` adalah perubahan. Sekarang anggap Anda memiliki teks ini:

```shell
pancake, potatoes, fruit-juice,
```

Untuk menghapus teks dari awal baris hingga kemunculan koma berikutnya, pertama hapus hingga koma, lalu ulangi dua kali dengan `df,..`. 

Mari kita coba contoh lain:

```shell
pancake, potatoes, fruit-juice,
```

Kali ini, tugas Anda adalah menghapus koma, bukan item sarapan. Dengan kursor di awal baris, pergi ke koma pertama, hapus, lalu ulangi dua kali lagi dengan `f,x..` Mudah, kan? Tunggu sebentar, itu tidak berhasil! Kenapa?

Sebuah perubahan mengecualikan gerakan karena tidak memperbarui konten buffer. Perintah `f,x` terdiri dari dua tindakan: perintah `f,` untuk memindahkan kursor ke "," dan `x` untuk menghapus karakter. Hanya yang terakhir, `x`, yang menyebabkan perubahan. Bandingkan itu dengan `df,` dari contoh sebelumnya. Di dalamnya, `f,` adalah arahan untuk operator hapus `d`, bukan gerakan untuk memindahkan kursor. `f,` dalam `df,` dan `f,x` memiliki dua peran yang sangat berbeda.

Mari kita selesaikan tugas terakhir. Setelah Anda menjalankan `f,` lalu `x`, pergi ke koma berikutnya dengan `;` untuk mengulang `f` terbaru. Akhirnya, gunakan `.` untuk menghapus karakter di bawah kursor. Ulangi `; . ; .` sampai semuanya terhapus. Perintah lengkapnya adalah `f,x;.;.`.

Mari kita coba satu lagi:

```shell
pancake
potatoes
fruit-juice
```

Mari kita tambahkan koma di akhir setiap baris. Dimulai dari baris pertama, lakukan `A,<Esc>j`. Sekarang, Anda menyadari bahwa `j` tidak menyebabkan perubahan. Perubahan di sini hanya `A,`. Anda dapat bergerak dan mengulang perubahan dengan `j . j .`. Perintah lengkapnya adalah `A,<Esc>j.j.`.

Setiap tindakan dari saat Anda menekan operator perintah sisip (`A`) hingga Anda keluar dari perintah sisip (`<Esc>`) dianggap sebagai perubahan.

## Pengulangan Multi-baris

Anggap Anda memiliki teks ini:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Tujuan Anda adalah menghapus semua baris kecuali baris "foo". Pertama, hapus tiga baris pertama dengan `d2j`, lalu ke baris di bawah baris "foo". Di baris berikutnya, gunakan perintah titik dua kali. Perintah lengkapnya adalah `d2jj..`.

Di sini perubahan adalah `d2j`. Dalam konteks ini, `2j` bukanlah gerakan, tetapi bagian dari operator hapus.

Mari kita lihat contoh lain:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Mari kita hapus semua z. Dimulai dari karakter pertama di baris pertama, pilih secara visual hanya z pertama dari tiga baris pertama dengan mode visual blok (`Ctrl-Vjj`). Jika Anda tidak familiar dengan mode visual blok, saya akan membahasnya di bab selanjutnya. Setelah Anda memiliki tiga z yang dipilih secara visual, hapus dengan operator hapus (`d`). Kemudian pindah ke kata berikutnya (`w`) ke z berikutnya. Ulangi perubahan dua kali lagi (`..`). Perintah lengkapnya adalah `Ctrl-vjjdw..`.

Ketika Anda menghapus kolom tiga z (`Ctrl-vjjd`), itu dihitung sebagai perubahan. Operasi mode visual dapat digunakan untuk menargetkan beberapa baris sebagai bagian dari perubahan.

## Menyertakan Gerakan dalam Perubahan

Mari kita kembali ke contoh pertama di bab ini. Ingatlah bahwa perintah `/letcwconst<Esc>` diikuti oleh `n . n .` mengganti semua "let" dengan "const" dalam ekspresi berikut:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Ada cara yang lebih cepat untuk mencapai ini. Setelah Anda mencari `/let`, jalankan `cgnconst<Esc>` lalu `. .`.

`gn` adalah gerakan yang mencari maju untuk pola pencarian terakhir (dalam hal ini, `/let`) dan secara otomatis melakukan sorotan visual. Untuk mengganti kemunculan berikutnya, Anda tidak perlu lagi bergerak dan mengulang perubahan (`n . n .`), tetapi hanya mengulang (`. .`). Anda tidak perlu lagi menggunakan gerakan pencarian karena mencari kecocokan berikutnya sekarang menjadi bagian dari perubahan!

Saat Anda mengedit, selalu waspadai gerakan yang dapat melakukan beberapa hal sekaligus seperti `gn` kapan pun memungkinkan.

## Pelajari Perintah Titik dengan Cara Cerdas

Kekuatan perintah titik berasal dari menukar beberapa ketukan tombol untuk satu. Ini mungkin bukan pertukaran yang menguntungkan untuk menggunakan perintah titik untuk operasi satu tombol seperti `x`. Jika perubahan terakhir Anda memerlukan operasi kompleks seperti `cgnconst<Esc>`, perintah titik mengurangi sembilan ketukan tombol menjadi satu, sebuah pertukaran yang sangat menguntungkan.

Saat mengedit, pikirkan tentang kemampuan untuk mengulang. Misalnya, jika saya perlu menghapus tiga kata berikutnya, apakah lebih ekonomis menggunakan `d3w` atau melakukan `dw` lalu `.` dua kali? Apakah Anda akan menghapus sebuah kata lagi? Jika ya, maka masuk akal untuk menggunakan `dw` dan mengulanginya beberapa kali daripada `d3w` karena `dw` lebih dapat digunakan kembali daripada `d3w`. 

Perintah titik adalah perintah serbaguna untuk mengotomatiskan perubahan tunggal. Di bab selanjutnya, Anda akan belajar bagaimana mengotomatiskan tindakan yang lebih kompleks dengan makro Vim. Tapi pertama, mari kita belajar tentang register untuk menyimpan dan mengambil teks.