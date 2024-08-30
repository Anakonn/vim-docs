---
description: Dokumen ini menjelaskan cara menggunakan mode command-line di Vim, termasuk
  tips, trik, dan cara masuk serta keluar dari mode tersebut.
title: Ch15. Command-line Mode
---

Dalam tiga bab terakhir, Anda telah belajar bagaimana menggunakan perintah pencarian (`/`, `?`), perintah substitusi (`:s`), perintah global (`:g`), dan perintah eksternal (`!`). Ini adalah contoh perintah dalam mode baris perintah.

Dalam bab ini, Anda akan mempelajari berbagai tips dan trik untuk mode baris perintah.

## Masuk dan Keluar dari Mode Baris Perintah

Mode baris perintah adalah mode tersendiri, sama seperti mode normal, mode sisip, dan mode visual. Ketika Anda berada dalam mode ini, kursor akan bergerak ke bagian bawah layar di mana Anda dapat mengetik berbagai perintah.

Ada 4 perintah berbeda yang dapat Anda gunakan untuk masuk ke mode baris perintah:
- Pola pencarian (`/`, `?`)
- Perintah baris perintah (`:`)
- Perintah eksternal (`!`)

Anda dapat masuk ke mode baris perintah dari mode normal atau mode visual.

Untuk keluar dari mode baris perintah, Anda dapat menggunakan `<Esc>`, `Ctrl-C`, atau `Ctrl-[`.

*Literatur lain mungkin merujuk "Perintah baris perintah" sebagai "Perintah Ex" dan "Perintah eksternal" sebagai "perintah filter" atau "operator bang".*

## Mengulang Perintah Sebelumnya

Anda dapat mengulang perintah baris perintah atau perintah eksternal sebelumnya dengan `@:`.

Jika Anda baru saja menjalankan `:s/foo/bar/g`, menjalankan `@:` akan mengulang substitusi tersebut. Jika Anda baru saja menjalankan `:.!tr '[a-z]' '[A-Z]'`, menjalankan `@:` akan mengulang filter terjemahan perintah eksternal terakhir.

## Pintasan Mode Baris Perintah

Saat berada dalam mode baris perintah, Anda dapat bergerak ke kiri atau ke kanan, satu karakter pada satu waktu, dengan tombol panah `Kiri` atau `Kanan`.

Jika Anda perlu bergerak berdasarkan kata, gunakan `Shift-Kiri` atau `Shift-Kanan` (di beberapa OS, Anda mungkin harus menggunakan `Ctrl` sebagai pengganti `Shift`).

Untuk pergi ke awal baris, gunakan `Ctrl-B`. Untuk pergi ke akhir baris, gunakan `Ctrl-E`.

Mirip dengan mode sisip, di dalam mode baris perintah, Anda memiliki tiga cara untuk menghapus karakter:

```shell
Ctrl-H    Hapus satu karakter
Ctrl-W    Hapus satu kata
Ctrl-U    Hapus seluruh baris
```
Akhirnya, jika Anda ingin mengedit perintah seperti yang Anda lakukan pada file teks normal, gunakan `Ctrl-F`.

Ini juga memungkinkan Anda untuk mencari melalui perintah sebelumnya, mengeditnya, dan menjalankannya kembali dengan menekan `<Enter>` dalam "mode pengeditan baris perintah normal".

## Register dan Autocomplete

Saat berada dalam mode baris perintah, Anda dapat menyisipkan teks dari register Vim dengan `Ctrl-R` sama seperti di mode sisip. Jika Anda memiliki string "foo" yang disimpan di register a, Anda dapat menyisipkannya dengan menjalankan `Ctrl-R a`. Segala sesuatu yang dapat Anda ambil dari register di mode sisip, Anda dapat melakukan hal yang sama dari mode baris perintah.

Selain itu, Anda juga dapat mendapatkan kata di bawah kursor dengan `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` untuk WORD di bawah kursor). Untuk mendapatkan baris di bawah kursor, gunakan `Ctrl-R Ctrl-L`. Untuk mendapatkan nama file di bawah kursor, gunakan `Ctrl-R Ctrl-F`.

Anda juga dapat melengkapi perintah yang ada. Untuk melengkapi perintah `echo`, saat berada dalam mode baris perintah, ketik "ec", lalu tekan `<Tab>`. Anda harus melihat di bagian kiri bawah perintah Vim yang dimulai dengan "ec" (contoh: `echo echoerr echohl echomsg econ`). Untuk pergi ke opsi berikutnya, tekan `<Tab>` atau `Ctrl-N`. Untuk pergi ke opsi sebelumnya, tekan `<Shift-Tab>` atau `Ctrl-P`.

Beberapa perintah baris perintah menerima nama file sebagai argumen. Salah satu contohnya adalah `edit`. Anda juga dapat melengkapi di sini. Setelah mengetik perintah, `:e ` (jangan lupa spasi), tekan `<Tab>`. Vim akan mencantumkan semua nama file relevan yang dapat Anda pilih sehingga Anda tidak perlu mengetiknya dari awal.

## Jendela Riwayat dan Jendela Baris Perintah

Anda dapat melihat riwayat perintah baris perintah dan istilah pencarian (ini memerlukan fitur `+cmdline_hist`).

Untuk membuka riwayat baris perintah, jalankan `:his :`. Anda harus melihat sesuatu seperti berikut:

```shell
## Riwayat Cmd
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim mencantumkan riwayat semua perintah `:` yang Anda jalankan. Secara default, Vim menyimpan 50 perintah terakhir. Untuk mengubah jumlah entri yang diingat Vim menjadi 100, jalankan `set history=100`.

Penggunaan riwayat baris perintah yang lebih berguna adalah melalui jendela baris perintah, `q:`. Ini akan membuka jendela riwayat yang dapat dicari dan diedit. Misalkan Anda memiliki ekspresi ini dalam riwayat ketika Anda menekan `q:`:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Jika tugas Anda saat ini adalah melakukan `s/verylongsubstitutionpattern/donut/g`, alih-alih mengetik perintah dari awal, mengapa tidak menggunakan kembali `s/verylongsubstitutionpattern/pancake/g`? Setelah semua, satu-satunya yang berbeda adalah kata substitusi, "donut" vs "pancake". Segala sesuatu yang lain sama.

Setelah Anda menjalankan `q:`, temukan `s/verylongsubstitutionpattern/pancake/g` dalam riwayat (Anda dapat menggunakan navigasi Vim dalam lingkungan ini) dan edit langsung! Ubah "pancake" menjadi "donut" di dalam jendela riwayat, lalu tekan `<Enter>`. Boom! Vim menjalankan `s/verylongsubstitutionpattern/donut/g` untuk Anda. Sangat nyaman!

Demikian pula, untuk melihat riwayat pencarian, jalankan `:his /` atau `:his ?`. Untuk membuka jendela riwayat pencarian di mana Anda dapat mencari dan mengedit riwayat sebelumnya, jalankan `q/` atau `q?`.

Untuk keluar dari jendela ini, tekan `Ctrl-C`, `Ctrl-W C`, atau ketik `:quit`.

## Lebih Banyak Perintah Baris Perintah

Vim memiliki ratusan perintah bawaan. Untuk melihat semua perintah yang dimiliki Vim, lihat `:h ex-cmd-index` atau `:h :index`.

## Pelajari Mode Baris Perintah dengan Cara Cerdas

Dibandingkan dengan tiga mode lainnya, mode baris perintah seperti pisau Swiss Army untuk pengeditan teks. Anda dapat mengedit teks, memodifikasi file, dan menjalankan perintah, hanya untuk menyebutkan beberapa. Bab ini adalah kumpulan berbagai hal dari mode baris perintah. Ini juga membawa mode Vim ke penutupan. Sekarang Anda tahu cara menggunakan mode normal, sisip, visual, dan mode baris perintah, Anda dapat mengedit teks dengan Vim lebih cepat dari sebelumnya.

Saatnya untuk beralih dari mode Vim dan belajar bagaimana melakukan navigasi yang lebih cepat dengan tag Vim.