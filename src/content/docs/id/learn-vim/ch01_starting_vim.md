---
description: Panduan ini menjelaskan cara memulai Vim dari terminal, termasuk instalasi
  dan perintah dasar untuk pengguna Vim 8.2 dan versi lainnya.
title: Ch01. Starting Vim
---

Dalam bab ini, Anda akan belajar berbagai cara untuk memulai Vim dari terminal. Saya menggunakan Vim 8.2 saat menulis panduan ini. Jika Anda menggunakan Neovim atau versi lama dari Vim, Anda seharusnya baik-baik saja, tetapi perlu diingat bahwa beberapa perintah mungkin tidak tersedia.

## Instalasi

Saya tidak akan menjelaskan instruksi terperinci tentang cara menginstal Vim di mesin tertentu. Kabar baiknya adalah, sebagian besar komputer berbasis Unix seharusnya sudah dilengkapi dengan Vim terinstal. Jika tidak, sebagian besar distro harus memiliki beberapa instruksi untuk menginstal Vim.

Untuk mengunduh informasi lebih lanjut tentang proses instalasi Vim, kunjungi situs web unduhan resmi Vim atau repositori github resmi Vim:
- [Situs web Vim](https://www.vim.org/download.php)
- [Vim github](https://github.com/vim/vim)

## Perintah Vim

Sekarang Anda telah menginstal Vim, jalankan ini dari terminal:

```bash
vim
```

Anda akan melihat layar intro. Ini adalah tempat Anda akan bekerja pada file baru Anda. Berbeda dengan sebagian besar editor teks dan IDE, Vim adalah editor modal. Jika Anda ingin mengetik "hello", Anda perlu beralih ke mode penyisipan dengan `i`. Tekan `ihello<Esc>` untuk menyisipkan teks "hello".

## Keluar dari Vim

Ada beberapa cara untuk keluar dari Vim. Cara yang paling umum adalah mengetik:

```shell
:quit
```

Anda juga bisa mengetik `:q` untuk singkat. Perintah itu adalah perintah mode baris perintah (salah satu mode Vim lainnya). Jika Anda mengetik `:` dalam mode normal, kursor akan bergerak ke bagian bawah layar di mana Anda dapat mengetik beberapa perintah. Anda akan belajar tentang mode baris perintah nanti di bab 15. Jika Anda berada dalam mode penyisipan, mengetik `:` akan secara harfiah menghasilkan karakter ":" di layar. Dalam hal ini, Anda perlu beralih kembali ke mode normal. Ketik `<Esc>` untuk beralih ke mode normal. Ngomong-ngomong, Anda juga bisa kembali ke mode normal dari mode baris perintah dengan menekan `<Esc>`. Anda akan menyadari bahwa Anda bisa "melarikan diri" dari beberapa mode Vim kembali ke mode normal dengan menekan `<Esc>`.

## Menyimpan File

Untuk menyimpan perubahan Anda, ketik:

```shell
:write
```

Anda juga bisa mengetik `:w` untuk singkat. Jika ini adalah file baru, Anda perlu memberinya nama sebelum Anda bisa menyimpannya. Mari kita namai `file.txt`. Jalankan:

```shell
:w file.txt
```

Untuk menyimpan dan keluar, Anda bisa menggabungkan perintah `:w` dan `:q`:

```shell
:wq
```

Untuk keluar tanpa menyimpan perubahan, tambahkan `!` setelah `:q` untuk memaksa keluar:

```shell
:q!
```

Ada cara lain untuk keluar dari Vim, tetapi ini adalah yang akan Anda gunakan setiap hari.

## Bantuan

Sepanjang panduan ini, saya akan merujuk Anda ke berbagai halaman bantuan Vim. Anda dapat pergi ke halaman bantuan dengan mengetik `:help {some-command}` (`:h` untuk singkat). Anda dapat meneruskan ke perintah `:h` topik atau nama perintah sebagai argumen. Misalnya, untuk belajar tentang berbagai cara untuk keluar dari Vim, ketik:

```shell
:h write-quit
```

Bagaimana saya tahu untuk mencari "write-quit"? Sebenarnya saya tidak tahu. Saya hanya mengetik `:h`, lalu "quit", lalu `<Tab>`. Vim menampilkan kata kunci yang relevan untuk dipilih. Jika Anda perlu mencari sesuatu ("Saya berharap Vim bisa melakukan ini..."), cukup ketik `:h` dan coba beberapa kata kunci, lalu `<Tab>`.

## Membuka File

Untuk membuka file (`hello1.txt`) di Vim dari terminal, jalankan:

```bash
vim hello1.txt
```

Anda juga bisa membuka beberapa file sekaligus:

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim membuka `hello1.txt`, `hello2.txt`, dan `hello3.txt` di buffer terpisah. Anda akan belajar tentang buffer di bab selanjutnya.

## Argumen

Anda dapat meneruskan perintah terminal `vim` dengan berbagai flag dan opsi.

Untuk memeriksa versi Vim saat ini, jalankan:

```bash
vim --version
```

Ini memberi tahu Anda versi Vim saat ini dan semua fitur yang tersedia ditandai dengan `+` atau `-`. Beberapa fitur dalam panduan ini memerlukan fitur tertentu untuk tersedia. Misalnya, Anda akan menjelajahi riwayat baris perintah Vim di bab selanjutnya dengan perintah `:history`. Vim Anda perlu memiliki fitur `+cmdline_history` agar perintah tersebut berfungsi. Ada kemungkinan besar bahwa Vim yang baru saja Anda instal memiliki semua fitur yang diperlukan, terutama jika berasal dari sumber unduhan yang populer.

Banyak hal yang Anda lakukan dari terminal juga dapat dilakukan dari dalam Vim. Untuk melihat versi dari *dalam* Vim, Anda dapat menjalankan ini:

```shell
:version
```

Jika Anda ingin membuka file `hello.txt` dan segera mengeksekusi perintah Vim, Anda dapat meneruskan ke perintah `vim` opsi `+{cmd}`.

Di Vim, Anda dapat mengganti string dengan perintah `:s` (singkatan dari `:substitute`). Jika Anda ingin membuka `hello.txt` dan mengganti semua "pancake" dengan "bagel", jalankan:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Perintah Vim ini dapat ditumpuk:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim akan mengganti semua instance "pancake" dengan "bagel", kemudian mengganti "bagel" dengan "egg", kemudian mengganti "egg" dengan "donut" (Anda akan belajar tentang penggantian di bab selanjutnya).

Anda juga dapat meneruskan opsi `-c` diikuti dengan perintah Vim sebagai pengganti sintaks `+`:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Membuka Beberapa Jendela

Anda dapat meluncurkan Vim di jendela horizontal dan vertikal terpisah dengan opsi `-o` dan `-O`, masing-masing.

Untuk membuka Vim dengan dua jendela horizontal, jalankan:

```bash
vim -o2
```

Untuk membuka Vim dengan 5 jendela horizontal, jalankan:

```bash
vim -o5
```

Untuk membuka Vim dengan 5 jendela horizontal dan mengisi dua pertama dengan `hello1.txt` dan `hello2.txt`, jalankan:

```bash
vim -o5 hello1.txt hello2.txt
```

Untuk membuka Vim dengan dua jendela vertikal, 5 jendela vertikal, dan 5 jendela vertikal dengan 2 file:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Menangguhkan

Jika Anda perlu menangguhkan Vim saat sedang mengedit, Anda dapat menekan `Ctrl-z`. Anda juga dapat menjalankan perintah `:stop` atau `:suspend`. Untuk kembali ke Vim yang ditangguhkan, jalankan `fg` dari terminal.

## Memulai Vim dengan Cara Cerdas

Perintah `vim` dapat menerima banyak opsi yang berbeda, seperti perintah terminal lainnya. Dua opsi memungkinkan Anda untuk meneruskan perintah Vim sebagai parameter: `+{cmd}` dan `-c cmd`. Saat Anda mempelajari lebih banyak perintah sepanjang panduan ini, lihat apakah Anda dapat menerapkannya saat memulai Vim. Juga sebagai perintah terminal, Anda dapat menggabungkan `vim` dengan banyak perintah terminal lainnya. Misalnya, Anda dapat mengalihkan output dari perintah `ls` untuk diedit di Vim dengan `ls -l | vim -`.

Untuk mempelajari lebih lanjut tentang perintah `vim` di terminal, periksa `man vim`. Untuk mempelajari lebih lanjut tentang editor Vim, lanjutkan membaca panduan ini bersama dengan perintah `:help`.