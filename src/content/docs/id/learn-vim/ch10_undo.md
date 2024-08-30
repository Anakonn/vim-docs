---
description: Panduan ini menjelaskan cara menggunakan sistem undo dan redo di Vim,
  termasuk navigasi cabang undo dan cara menyimpan perubahan untuk kontrol teks yang
  lebih baik.
title: Ch10. Undo
---

Kita semua membuat berbagai kesalahan ketik. Itulah sebabnya undo adalah fitur penting dalam perangkat lunak modern. Sistem undo Vim tidak hanya mampu membatalkan dan mengulangi kesalahan sederhana, tetapi juga mengakses berbagai keadaan teks, memberi Anda kontrol atas semua teks yang pernah Anda ketik. Dalam bab ini, Anda akan belajar cara membatalkan, mengulangi, menavigasi cabang undo, mempertahankan undo, dan menjelajahi waktu.

## Undo, Redo, dan UNDO

Untuk melakukan undo dasar, Anda dapat menggunakan `u` atau menjalankan `:undo`.

Jika Anda memiliki teks ini (perhatikan baris kosong di bawah "one"):

```shell
one

```

Kemudian Anda menambahkan teks lain:

```shell
one
two
```

Jika Anda menekan `u`, Vim membatalkan teks "two".

Bagaimana Vim tahu seberapa banyak yang harus dibatalkan? Vim membatalkan satu "perubahan" pada satu waktu, mirip dengan perubahan perintah titik (berbeda dengan perintah titik, perintah baris perintah juga dihitung sebagai perubahan).

Untuk mengulangi perubahan terakhir, tekan `Ctrl-R` atau jalankan `:redo`. Setelah Anda membatalkan teks di atas untuk menghapus "two", menjalankan `Ctrl-R` akan mengembalikan teks yang dihapus.

Vim juga memiliki UNDO yang dapat Anda jalankan dengan `U`. Ini membatalkan semua perubahan terbaru.

Bagaimana `U` berbeda dari `u`? Pertama, `U` menghapus *semua* perubahan pada baris yang terakhir diubah, sementara `u` hanya menghapus satu perubahan pada satu waktu. Kedua, sementara melakukan `u` tidak dihitung sebagai perubahan, melakukan `U` dihitung sebagai perubahan.

Kembali ke contoh ini:

```shell
one
two
```

Ubah baris kedua menjadi "three":

```shell
one
three
```

Ubah baris kedua lagi dan ganti dengan "four":

```shell
one
four
```

Jika Anda menekan `u`, Anda akan melihat "three". Jika Anda menekan `u` lagi, Anda akan melihat "two". Jika alih-alih menekan `u` ketika Anda masih memiliki teks "four", Anda menekan `U`, Anda akan melihat:

```shell
one

```

`U` melewati semua perubahan perantara dan kembali ke keadaan asli saat Anda mulai (sebuah baris kosong). Selain itu, karena UNDO sebenarnya membuat perubahan baru di Vim, Anda dapat UNDO undo Anda. `U` diikuti oleh `U` akan membatalkan dirinya sendiri. Anda dapat menekan `U`, kemudian `U`, kemudian `U`, dll. Anda akan melihat dua keadaan teks yang sama beralih bolak-balik.

Saya pribadi tidak menggunakan `U` karena sulit untuk mengingat keadaan asli (saya jarang membutuhkannya).

Vim menetapkan jumlah maksimum berapa kali Anda dapat membatalkan dalam variabel opsi `undolevels`. Anda dapat memeriksanya dengan `:echo &undolevels`. Saya mengatur milik saya menjadi 1000. Untuk mengubah milik Anda menjadi 1000, jalankan `:set undolevels=1000`. Silakan atur ke angka berapa pun yang Anda suka.

## Memecahkan Blok

Saya telah menyebutkan sebelumnya bahwa `u` membatalkan satu "perubahan" mirip dengan perubahan perintah titik: teks yang dimasukkan dari saat Anda memasuki mode penyisipan hingga Anda keluar dari mode tersebut dihitung sebagai perubahan.

Jika Anda melakukan `ione two three<Esc>` kemudian tekan `u`, Vim menghapus seluruh teks "one two three" karena semuanya dihitung sebagai perubahan. Ini bukan masalah besar jika Anda telah menulis teks pendek, tetapi bagaimana jika Anda telah menulis beberapa paragraf dalam satu sesi mode penyisipan tanpa keluar dan kemudian Anda menyadari Anda telah membuat kesalahan? Jika Anda menekan `u`, semuanya yang telah Anda tulis akan dihapus. Bukankah akan berguna jika Anda dapat menekan `u` untuk menghapus hanya bagian dari teks Anda?

Untungnya, Anda dapat memecahkan blok undo. Ketika Anda mengetik dalam mode penyisipan, menekan `Ctrl-G u` membuat titik henti undo. Misalnya, jika Anda melakukan `ione <Ctrl-G u>two <Ctrl-G u>three<Esc>`, kemudian tekan `u`, Anda hanya akan kehilangan teks "three" (tekan `u` sekali lagi untuk menghapus "two"). Ketika Anda menulis teks panjang, gunakan `Ctrl-G u` secara strategis. Akhir setiap kalimat, antara dua paragraf, atau setelah setiap baris kode adalah lokasi utama untuk menambahkan titik henti undo agar lebih mudah membatalkan kesalahan Anda jika Anda pernah membuatnya.

Sangat berguna juga untuk membuat titik henti undo saat menghapus bagian dalam mode penyisipan dengan `Ctrl-W` (menghapus kata sebelum kursor) dan `Ctrl-U` (menghapus semua teks sebelum kursor). Seorang teman menyarankan untuk menggunakan peta berikut:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Dengan ini, Anda dapat dengan mudah memulihkan teks yang dihapus.

## Pohon Undo

Vim menyimpan setiap perubahan yang pernah ditulis dalam pohon undo. Mulailah file kosong baru. Kemudian tambahkan teks baru:

```shell
one

```

Tambahkan teks baru:

```shell
one
two
```

Undo sekali:

```shell
one

```

Tambahkan teks berbeda:

```shell
one
three
```

Undo lagi:

```shell
one

```

Dan tambahkan teks berbeda lainnya:

```shell
one
four
```

Sekarang jika Anda membatalkan, Anda akan kehilangan teks "four" yang baru saja Anda tambahkan:

```shell
one

```

Jika Anda membatalkan sekali lagi:

```shell

```

Anda akan kehilangan teks "one". Di sebagian besar editor teks, mendapatkan teks "two" dan "three" kembali akan menjadi tidak mungkin, tetapi tidak dengan Vim! Tekan `g+` dan Anda akan mendapatkan teks "one" kembali:

```shell
one

```

Ketik `g+` lagi dan Anda akan melihat teman lama:

```shell
one
two
```

Mari kita teruskan. Tekan `g+` lagi:

```shell
one
three
```

Tekan `g+` sekali lagi:

```shell
one
four
```

Di Vim, setiap kali Anda menekan `u` dan kemudian membuat perubahan berbeda, Vim menyimpan teks dari keadaan sebelumnya dengan membuat "cabang undo". Dalam contoh ini, setelah Anda mengetik "two", kemudian menekan `u`, kemudian mengetik "three", Anda membuat cabang daun yang menyimpan keadaan yang berisi teks "two". Pada saat itu, pohon undo memiliki setidaknya dua node daun: node utama yang berisi teks "three" (paling baru) dan node cabang undo yang berisi teks "two". Jika Anda melakukan undo lagi dan mengetik teks "four", Anda akan memiliki tiga node: satu node utama yang berisi teks "four" dan dua node yang berisi teks "three" dan "two".

Untuk menjelajahi setiap node pohon undo, Anda dapat menggunakan `g+` untuk pergi ke keadaan yang lebih baru dan `g-` untuk pergi ke keadaan yang lebih lama. Perbedaan antara `u`, `Ctrl-R`, `g+`, dan `g-` adalah bahwa baik `u` dan `Ctrl-R` hanya menjelajahi *node* utama dalam pohon undo sementara `g+` dan `g-` menjelajahi *semua* node dalam pohon undo.

Pohon undo tidak mudah divisualisasikan. Saya menemukan plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) sangat berguna untuk membantu memvisualisasikan pohon undo Vim. Luangkan waktu untuk bermain-main dengan itu.

## Undo Persisten

Jika Anda memulai Vim, membuka file, dan segera menekan `u`, Vim mungkin akan menampilkan peringatan "*Already at oldest change*". Tidak ada yang bisa dibatalkan karena Anda belum membuat perubahan apa pun.

Untuk menggulir sejarah undo dari sesi pengeditan terakhir, Vim dapat mempertahankan sejarah undo Anda dengan file undo menggunakan `:wundo`.

Buat file `mynumbers.txt`. Ketik:

```shell
one
```

Kemudian ketik baris lain (pastikan setiap baris dihitung sebagai perubahan):

```shell
one
two
```

Ketik baris lain:

```shell
one
two
three
```

Sekarang buat file undo Anda dengan `:wundo {my-undo-file}`. Jika Anda perlu menimpa file undo yang ada, Anda dapat menambahkan `!` setelah `wundo`.

```shell
:wundo! mynumbers.undo
```

Kemudian keluar dari Vim.

Saat ini Anda harus memiliki file `mynumbers.txt` dan `mynumbers.undo` di direktori Anda. Buka kembali `mynumbers.txt` dan coba tekan `u`. Anda tidak bisa. Anda belum membuat perubahan sejak Anda membuka file. Sekarang muat sejarah undo Anda dengan membaca file undo menggunakan `:rundo`:

```shell
:rundo mynumbers.undo
```

Sekarang jika Anda menekan `u`, Vim menghapus "three". Tekan `u` lagi untuk menghapus "two". Seolah-olah Anda bahkan tidak menutup Vim!

Jika Anda ingin memiliki persistensi undo otomatis, salah satu cara untuk melakukannya adalah dengan menambahkan ini di vimrc:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

Pengaturan di atas akan menempatkan semua undofile dalam satu direktori terpusat, direktori `~/.vim`. Nama `undo_dir` bersifat arbitrer. `set undofile` memberi tahu Vim untuk mengaktifkan fitur `undofile` karena secara default dimatikan. Sekarang setiap kali Anda menyimpan, Vim secara otomatis membuat dan memperbarui file yang relevan di dalam direktori `undo_dir` (pastikan Anda membuat direktori `undo_dir` yang sebenarnya di dalam direktori `~/.vim` sebelum menjalankan ini).

## Perjalanan Waktu

Siapa yang bilang bahwa perjalanan waktu tidak ada? Vim dapat kembali ke keadaan teks di masa lalu dengan perintah baris perintah `:earlier`.

Jika Anda memiliki teks ini:

```shell
one

```
Kemudian nanti Anda menambahkan:

```shell
one
two
```

Jika Anda telah mengetik "two" kurang dari sepuluh detik yang lalu, Anda dapat kembali ke keadaan di mana "two" tidak ada sepuluh detik yang lalu dengan:

```shell
:earlier 10s
```

Anda dapat menggunakan `:undolist` untuk melihat kapan perubahan terakhir dibuat. `:earlier` juga menerima argumen yang berbeda:

```shell
:earlier 10s    Kembali ke keadaan 10 detik sebelumnya
:earlier 10m    Kembali ke keadaan 10 menit sebelumnya
:earlier 10h    Kembali ke keadaan 10 jam sebelumnya
:earlier 10d    Kembali ke keadaan 10 hari sebelumnya
```

Selain itu, juga menerima `count` reguler sebagai argumen untuk memberi tahu Vim untuk kembali ke keadaan yang lebih lama `count` kali. Misalnya, jika Anda melakukan `:earlier 2`, Vim akan kembali ke keadaan teks yang lebih lama dua perubahan yang lalu. Ini sama dengan melakukan `g-` dua kali. Anda juga dapat memberitahunya untuk kembali ke keadaan teks yang lebih lama 10 simpanan yang lalu dengan `:earlier 10f`.

Serangkaian argumen yang sama bekerja dengan pasangan `:earlier`: `:later`.

```shell
:later 10s    pergi ke keadaan 10 detik kemudian
:later 10m    pergi ke keadaan 10 menit kemudian
:later 10h    pergi ke keadaan 10 jam kemudian
:later 10d    pergi ke keadaan 10 hari kemudian
:later 10     pergi ke keadaan yang lebih baru 10 kali
:later 10f    pergi ke keadaan 10 simpanan kemudian
```

## Pelajari Undo dengan Cara Cerdas

`u` dan `Ctrl-R` adalah dua perintah Vim yang tak tergantikan untuk memperbaiki kesalahan. Pelajari mereka terlebih dahulu. Selanjutnya, pelajari cara menggunakan `:earlier` dan `:later` menggunakan argumen waktu terlebih dahulu. Setelah itu, luangkan waktu Anda untuk memahami pohon undo. Plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) sangat membantu saya. Ketik bersama teks dalam bab ini dan periksa pohon undo saat Anda membuat setiap perubahan. Setelah Anda memahaminya, Anda tidak akan pernah melihat sistem undo dengan cara yang sama lagi.

Sebelum bab ini, Anda telah belajar bagaimana menemukan teks apa pun di ruang proyek, dengan undo, Anda sekarang dapat menemukan teks apa pun dalam dimensi waktu. Anda sekarang mampu mencari teks apa pun berdasarkan lokasi dan waktu penulisannya. Anda telah mencapai Vim-omnipresence.