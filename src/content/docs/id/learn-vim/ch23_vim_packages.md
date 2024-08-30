---
description: Panduan ini menjelaskan cara menggunakan manajer paket bawaan Vim untuk
  menginstal plugin, termasuk direktori dan mekanisme pemuatan otomatis.
title: Ch23. Vim Packages
---

Pada bab sebelumnya, saya menyebutkan penggunaan manajer plugin eksternal untuk menginstal plugin. Sejak versi 8, Vim dilengkapi dengan manajer plugin bawaan yang disebut *packages*. Dalam bab ini, Anda akan belajar cara menggunakan paket Vim untuk menginstal plugin.

Untuk melihat apakah build Vim Anda memiliki kemampuan untuk menggunakan paket, jalankan `:version` dan cari atribut `+packages`. Sebagai alternatif, Anda juga dapat menjalankan `:echo has('packages')` (jika mengembalikan 1, maka ia memiliki kemampuan paket).

## Direktori Pack

Periksa apakah Anda memiliki direktori `~/.vim/` di jalur root. Jika tidak, buat satu. Di dalamnya, buat direktori bernama `pack` (`~/.vim/pack/`). Vim secara otomatis tahu untuk mencari di dalam direktori ini untuk paket.

## Dua Tipe Pemuatan

Paket Vim memiliki dua mekanisme pemuatan: pemuatan otomatis dan manual.

### Pemuatan Otomatis

Untuk memuat plugin secara otomatis saat Vim dimulai, Anda perlu menempatkannya di direktori `start/`. Jalurnya terlihat seperti ini:

```shell
~/.vim/pack/*/start/
```

Sekarang Anda mungkin bertanya, "Apa itu `*` antara `pack/` dan `start/`?" `*` adalah nama sembarang dan bisa berupa apa saja yang Anda inginkan. Mari kita namai `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

Ingatlah bahwa jika Anda melewatkannya dan melakukan sesuatu seperti ini sebagai gantinya:

```shell
~/.vim/pack/start/
```

Sistem paket tidak akan berfungsi. Sangat penting untuk menempatkan nama di antara `pack/` dan `start/`.

Untuk demo ini, mari kita coba menginstal plugin [NERDTree](https://github.com/preservim/nerdtree). Pergi ke direktori `start/` (`cd ~/.vim/pack/packdemo/start/`) dan clone repositori NERDTree:

```shell
git clone https://github.com/preservim/nerdtree.git
```

Itu saja! Anda sudah siap. Kali berikutnya Anda memulai Vim, Anda dapat segera mengeksekusi perintah NERDTree seperti `:NERDTreeToggle`.

Anda dapat meng-clone sebanyak mungkin repositori plugin yang Anda inginkan di dalam jalur `~/.vim/pack/*/start/`. Vim akan secara otomatis memuat masing-masing. Jika Anda menghapus repositori yang di-clone (`rm -rf nerdtree/`), plugin itu tidak akan tersedia lagi.

### Pemuatan Manual

Untuk memuat plugin secara manual saat Vim dimulai, Anda perlu menempatkannya di direktori `opt/`. Mirip dengan pemuatan otomatis, jalurnya terlihat seperti ini:

```shell
~/.vim/pack/*/opt/
```

Mari kita gunakan direktori `packdemo/` yang sama dari sebelumnya:

```shell
~/.vim/pack/packdemo/opt/
```

Kali ini, mari kita instal game [killersheep](https://github.com/vim/killersheep) (ini memerlukan Vim 8.2). Pergi ke direktori `opt/` (`cd ~/.vim/pack/packdemo/opt/`) dan clone repositorinya:

```shell
git clone https://github.com/vim/killersheep.git
```

Mulai Vim. Perintah untuk menjalankan game adalah `:KillKillKill`. Cobalah menjalankannya. Vim akan mengeluh bahwa itu bukan perintah editor yang valid. Anda perlu *memuat* plugin secara *manual* terlebih dahulu. Mari kita lakukan itu:

```shell
:packadd killersheep
```

Sekarang coba jalankan perintah lagi `:KillKillKill`. Perintah seharusnya berfungsi sekarang.

Anda mungkin bertanya, "Mengapa saya ingin memuat paket secara manual? Bukankah lebih baik memuat semuanya secara otomatis di awal?"

Pertanyaan yang bagus. Terkadang ada plugin yang tidak akan Anda gunakan sepanjang waktu, seperti game KillerSheep itu. Anda mungkin tidak perlu memuat 10 game berbeda dan memperlambat waktu startup Vim. Namun, sesekali, ketika Anda bosan, Anda mungkin ingin bermain beberapa game. Gunakan pemuatan manual untuk plugin yang tidak penting.

Anda juga dapat menggunakan ini untuk menambahkan plugin secara kondisional. Mungkin Anda menggunakan Neovim dan Vim dan ada plugin yang dioptimalkan untuk Neovim. Anda dapat menambahkan sesuatu seperti ini di vimrc Anda:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Mengorganisir Paket

Ingatlah bahwa syarat untuk menggunakan sistem paket Vim adalah memiliki salah satu dari:

```shell
~/.vim/pack/*/start/
```

Atau:

```shell
~/.vim/pack/*/opt/
```

Fakta bahwa `*` dapat berupa *nama* apa pun dapat digunakan untuk mengorganisir paket Anda. Misalkan Anda ingin mengelompokkan plugin Anda berdasarkan kategori (warna, sintaks, dan game):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Anda masih dapat menggunakan `start/` dan `opt/` di dalam masing-masing direktori.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Menambahkan Paket dengan Cara Cerdas

Anda mungkin bertanya-tanya apakah paket Vim akan membuat manajer plugin populer seperti vim-pathogen, vundle.vim, dein.vim, dan vim-plug menjadi usang.

Jawabannya, seperti biasa, "itu tergantung".

Saya masih menggunakan vim-plug karena memudahkan untuk menambahkan, menghapus, atau memperbarui plugin. Jika Anda menggunakan banyak plugin, mungkin lebih nyaman menggunakan manajer plugin karena mudah untuk memperbarui banyak sekaligus. Beberapa manajer plugin juga menawarkan fungsionalitas asinkron.

Jika Anda seorang minimalis, coba paket Vim. Jika Anda pengguna plugin berat, Anda mungkin ingin mempertimbangkan untuk menggunakan manajer plugin.