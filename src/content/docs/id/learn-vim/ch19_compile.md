---
description: Dokumen ini membahas cara mengompilasi kode menggunakan Vim, termasuk
  penggunaan perintah `:make` dan pembuatan makefile untuk mempermudah proses kompilasi.
title: Ch19. Compile
---

Compiling adalah subjek penting untuk banyak bahasa. Di bab ini, Anda akan belajar cara mengompilasi dari Vim. Anda juga akan melihat cara memanfaatkan perintah `:make` di Vim.

## Kompilasi Dari Command Line

Anda dapat menggunakan operator bang (`!`) untuk mengompilasi. Jika Anda perlu mengompilasi file `.cpp` Anda dengan `g++`, jalankan:

```shell
:!g++ hello.cpp -o hello
```

Namun, harus mengetikkan nama file dan nama file output secara manual setiap kali rentan terhadap kesalahan dan membosankan. Sebuah makefile adalah cara yang tepat.

## Perintah Make

Vim memiliki perintah `:make` untuk menjalankan makefile. Ketika Anda menjalankannya, Vim mencari makefile di direktori saat ini untuk dieksekusi.

Buat file bernama `makefile` di direktori saat ini dan masukkan ini di dalamnya:

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Jalankan ini dari Vim:

```shell
:make
```

Vim mengeksekusinya dengan cara yang sama seperti saat Anda menjalankannya dari terminal. Perintah `:make` menerima parameter sama seperti perintah make di terminal. Jalankan:

```shell
:make foo
" Mengeluarkan "Hello foo"

:make list_pls
" Mengeluarkan hasil perintah ls
```

Perintah `:make` menggunakan quickfix Vim untuk menyimpan kesalahan jika Anda menjalankan perintah yang salah. Mari kita jalankan target yang tidak ada:

```shell
:make dontexist
```

Anda harus melihat kesalahan saat menjalankan perintah itu. Untuk melihat kesalahan tersebut, jalankan perintah quickfix `:copen` untuk melihat jendela quickfix:

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Mengompilasi Dengan Make

Mari kita gunakan makefile untuk mengompilasi program `.cpp` dasar. Pertama, mari kita buat file `hello.cpp`:

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Perbarui makefile Anda untuk membangun dan menjalankan file `.cpp`:

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Sekarang jalankan:

```shell
:make build
```

`g++` mengompilasi `./hello.cpp` dan membuat `./hello`. Kemudian jalankan:

```shell
:make run
```

Anda harus melihat `"Hello!"` dicetak di terminal.

## Program Make Berbeda

Ketika Anda menjalankan `:make`, Vim sebenarnya menjalankan perintah apa pun yang diatur di bawah opsi `makeprg`. Jika Anda menjalankan `:set makeprg?`, Anda akan melihat:

```shell
makeprg=make
```

Perintah `:make` default adalah perintah eksternal `make`. Untuk mengubah perintah `:make` untuk mengeksekusi `g++ {nama-file-anda}` setiap kali Anda menjalankannya, jalankan:

```shell
:set makeprg=g++\ %
```

` \` digunakan untuk meloloskan spasi setelah `g++`. Simbol `%` di Vim mewakili file saat ini. Perintah `g++\\ %` setara dengan menjalankan `g++ hello.cpp`.

Pergi ke `./hello.cpp` kemudian jalankan `:make`. Vim mengompilasi `hello.cpp` dan membuat `a.out` karena Anda tidak menentukan output. Mari kita refactor agar nama output yang dikompilasi sesuai dengan nama file asli tanpa ekstensi. Jalankan atau tambahkan ini ke vimrc:

```shell
set makeprg=g++\ %\ -o\ %<
```

Rincian:
- `g++\ %` sama seperti di atas. Ini setara dengan menjalankan `g++ <file-anda>`.
- `-o` adalah opsi output.
- `%<` di Vim mewakili nama file saat ini tanpa ekstensi (`hello.cpp` menjadi `hello`).

Ketika Anda menjalankan `:make` dari dalam `./hello.cpp`, itu dikompilasi menjadi `./hello`. Untuk dengan cepat mengeksekusi `./hello` dari dalam `./hello.cpp`, jalankan `:!./%<`. Sekali lagi, ini sama dengan menjalankan `:!./{nama-file-saat-ini-tanpa-ekstensi}`.

Untuk lebih lanjut, lihat `:h :compiler` dan `:h write-compiler-plugin`.

## Auto-kompilasi Saat Simpan

Anda dapat membuat hidup lebih mudah dengan mengotomatiskan kompilasi. Ingat bahwa Anda dapat menggunakan `autocmd` Vim untuk memicu tindakan otomatis berdasarkan peristiwa tertentu. Untuk secara otomatis mengompilasi file `.cpp` pada setiap simpan, tambahkan ini di vimrc Anda:

```shell
autocmd BufWritePost *.cpp make
```

Setiap kali Anda menyimpan di dalam file `.cpp`, Vim mengeksekusi perintah `make`.

## Beralih Compiler

Vim memiliki perintah `:compiler` untuk dengan cepat beralih compiler. Build Vim Anda mungkin dilengkapi dengan beberapa konfigurasi compiler yang sudah dibangun sebelumnya. Untuk memeriksa compiler apa yang Anda miliki, jalankan:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Anda harus melihat daftar compiler untuk berbagai bahasa pemrograman.

Untuk menggunakan perintah `:compiler`, misalkan Anda memiliki file ruby, `hello.rb` dan di dalamnya memiliki:

```shell
puts "Hello ruby"
```

Ingat bahwa jika Anda menjalankan `:make`, Vim mengeksekusi perintah apa pun yang ditugaskan ke `makeprg` (default adalah `make`). Jika Anda menjalankan:

```shell
:compiler ruby
```

Vim menjalankan skrip `$VIMRUNTIME/compiler/ruby.vim` dan mengubah `makeprg` untuk menggunakan perintah `ruby`. Sekarang jika Anda menjalankan `:set makeprg?`, itu harus mengatakan `makeprg=ruby` (ini tergantung pada apa yang ada di dalam file `$VIMRUNTIME/compiler/ruby.vim` Anda atau jika Anda memiliki compiler ruby kustom lainnya. Milik Anda mungkin berbeda). Perintah `:compiler {bahasa-anda}` memungkinkan Anda untuk beralih ke compiler yang berbeda dengan cepat. Ini berguna jika proyek Anda menggunakan beberapa bahasa.

Anda tidak harus menggunakan `:compiler` dan `makeprg` untuk mengompilasi program. Anda dapat menjalankan skrip uji, lint file, mengirim sinyal, atau apa pun yang Anda inginkan.

## Membuat Compiler Kustom

Mari kita buat compiler Typescript sederhana. Instal Typescript (`npm install -g typescript`) ke mesin Anda. Anda sekarang harus memiliki perintah `tsc`. Jika Anda belum pernah bermain dengan typescript sebelumnya, `tsc` mengompilasi file Typescript menjadi file Javascript. Misalkan Anda memiliki file, `hello.ts`:

```shell
const hello = "hello";
console.log(hello);
```

Jika Anda menjalankan `tsc hello.ts`, itu akan dikompilasi menjadi `hello.js`. Namun, jika Anda memiliki ekspresi berikut di dalam `hello.ts`:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Ini akan menghasilkan kesalahan karena Anda tidak dapat memodifikasi variabel `const`. Menjalankan `tsc hello.ts` akan menghasilkan kesalahan:

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

Untuk membuat compiler Typescript sederhana, di direktori `~/.vim/`, tambahkan direktori `compiler` (`~/.vim/compiler/`), kemudian buat file `typescript.vim` (`~/.vim/compiler/typescript.vim`). Masukkan ini di dalamnya:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

Baris pertama mengatur `makeprg` untuk menjalankan perintah `tsc`. Baris kedua mengatur format kesalahan untuk menampilkan file (`%f`), diikuti dengan titik dua literal (`:`) dan spasi yang diloloskan (`\ `), diikuti dengan pesan kesalahan (`%m`). Untuk mempelajari lebih lanjut tentang format kesalahan, lihat `:h errorformat`.

Anda juga harus membaca beberapa compiler yang sudah dibuat untuk melihat bagaimana orang lain melakukannya. Lihat `:e $VIMRUNTIME/compiler/<beberapa-bahasa>.vim`.

Karena beberapa plugin mungkin mengganggu file Typescript, mari kita buka `hello.ts` tanpa plugin apa pun, menggunakan flag `--noplugin`:

```shell
vim --noplugin hello.ts
```

Periksa `makeprg`:

```shell
:set makeprg?
```

Ini harus mengatakan program `make` default. Untuk menggunakan compiler Typescript baru, jalankan:

```shell
:compiler typescript
```

Ketika Anda menjalankan `:set makeprg?`, itu harus mengatakan `tsc` sekarang. Mari kita uji. Jalankan:

```shell
:make %
```

Ingat bahwa `%` berarti file saat ini. Saksikan compiler Typescript Anda bekerja seperti yang diharapkan! Untuk melihat daftar kesalahan, jalankan `:copen`.

## Compiler Async

Terkadang mengompilasi bisa memakan waktu lama. Anda tidak ingin menatap Vim yang membeku sambil menunggu proses kompilasi Anda selesai. Bukankah akan menyenangkan jika Anda bisa mengompilasi secara asinkron sehingga Anda masih bisa menggunakan Vim selama kompilasi?

Untungnya ada plugin untuk menjalankan proses asinkron. Dua yang besar adalah:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

Di sisa bab ini, saya akan membahas vim-dispatch, tetapi saya sangat mendorong Anda untuk mencoba semua yang ada di luar sana.

*Vim dan NeoVim sebenarnya mendukung pekerjaan asinkron, tetapi itu di luar cakupan bab ini. Jika Anda penasaran, lihat `:h job-channel-overview.txt`.*

## Plugin: Vim-dispatch

Vim-dispatch memiliki beberapa perintah, tetapi dua yang utama adalah perintah `:Make` dan `:Dispatch`.

### Async Make

Perintah `:Make` dari Vim-dispatch mirip dengan `:make` di Vim, tetapi berjalan secara asinkron. Jika Anda berada di proyek Javascript dan Anda perlu menjalankan `npm t`, Anda mungkin mencoba mengatur makeprg Anda menjadi:

```shell
:set makeprg=npm\\ t
```

Jika Anda menjalankan:

```shell
:make
```

Vim akan mengeksekusi `npm t`, tetapi Anda akan menatap layar yang membeku sementara pengujian JavaScript Anda berjalan. Dengan vim-dispatch, Anda dapat langsung menjalankan:

```shell
:Make
```

Vim akan menjalankan `npm t` secara asinkron. Dengan cara ini, sementara `npm t` berjalan di proses latar belakang, Anda dapat melanjutkan melakukan apa pun yang Anda lakukan. Keren!

### Async Dispatch

Perintah `:Dispatch` seperti perintah `:compiler` dan perintah `:!`. Ini dapat menjalankan perintah eksternal apa pun secara asinkron di Vim.

Misalkan Anda berada di dalam file spesifikasi ruby dan Anda perlu menjalankan uji. Jalankan:

```shell
:Dispatch bundle exec rspec %
```

Vim akan menjalankan perintah `rspec` secara asinkron terhadap file saat ini (`%`).

### Mengotomatiskan Dispatch

Vim-dispatch memiliki variabel buffer `b:dispatch` yang dapat Anda konfigurasi untuk mengevaluasi perintah tertentu secara otomatis. Anda dapat memanfaatkannya dengan `autocmd`. Jika Anda menambahkan ini di vimrc Anda:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Sekarang setiap kali Anda memasuki file (`BufEnter`) yang diakhiri dengan `_spec.rb`, menjalankan `:Dispatch` secara otomatis mengeksekusi `bundle exec rspec {file-spesifikasi-ruby-saat-ini-anda}`.

## Pelajari Kompilasi Dengan Cara Cerdas

Di bab ini, Anda belajar bahwa Anda dapat menggunakan perintah `make` dan `compiler` untuk menjalankan *proses apa pun* dari dalam Vim secara asinkron untuk melengkapi alur kerja pemrograman Anda. Kemampuan Vim untuk memperluas dirinya dengan program lain membuatnya kuat.