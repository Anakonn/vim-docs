---
description: Dokumen ini menjelaskan tentang variabel di Vim, termasuk variabel mutable
  dan immutable, serta cara mendefinisikan dan mengubah nilainya.
title: Ch27. Vimscript Variable Scopes
---

Sebelum menyelami fungsi Vimscript, mari kita pelajari tentang berbagai sumber dan cakupan variabel Vim.

## Variabel Mutable dan Immutable

Anda dapat menetapkan nilai ke variabel di Vim dengan `let`:

```shell
let pancake = "pancake"
```

Kemudian Anda dapat memanggil variabel itu kapan saja.

```shell
echo pancake
" mengembalikan "pancake"
```

`let` bersifat mutable, artinya Anda dapat mengubah nilai kapan saja di masa depan.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" mengembalikan "not waffles"
```

Perhatikan bahwa ketika Anda ingin mengubah nilai variabel yang telah ditetapkan, Anda tetap perlu menggunakan `let`.

```shell
let beverage = "milk"

beverage = "orange juice"
" menghasilkan kesalahan
```

Anda dapat mendefinisikan variabel immutable dengan `const`. Karena bersifat immutable, setelah nilai variabel ditetapkan, Anda tidak dapat menetapkannya kembali dengan nilai yang berbeda.

```shell
const waffle = "waffle"
const waffle = "pancake"
" menghasilkan kesalahan
```

## Sumber Variabel

Ada tiga sumber untuk variabel: variabel lingkungan, variabel opsi, dan variabel register.

### Variabel Lingkungan

Vim dapat mengakses variabel lingkungan terminal Anda. Misalnya, jika Anda memiliki variabel lingkungan `SHELL` yang tersedia di terminal Anda, Anda dapat mengaksesnya dari Vim dengan:

```shell
echo $SHELL
" mengembalikan nilai $SHELL. Dalam kasus saya, mengembalikan /bin/bash
```

### Variabel Opsi

Anda dapat mengakses opsi Vim dengan `&` (ini adalah pengaturan yang Anda akses dengan `set`).

Misalnya, untuk melihat latar belakang apa yang digunakan Vim, Anda dapat menjalankan:

```shell
echo &background
" mengembalikan "light" atau "dark"
```

Sebagai alternatif, Anda selalu dapat menjalankan `set background?` untuk melihat nilai opsi `background`.

### Variabel Register

Anda dapat mengakses register Vim (Ch. 08) dengan `@`.

Misalkan nilai "chocolate" sudah disimpan di register a. Untuk mengaksesnya, Anda dapat menggunakan `@a`. Anda juga dapat memperbaruinya dengan `let`.

```shell
echo @a
" mengembalikan chocolate

let @a .= " donut"

echo @a
" mengembalikan "chocolate donut"
```

Sekarang ketika Anda menempel dari register `a` (`"ap`), itu akan mengembalikan "chocolate donut". Operator `.=` menggabungkan dua string. Ekspresi `let @a .= " donut"` sama dengan `let @a = @a . " donut"`

## Cakupan Variabel

Ada 9 cakupan variabel yang berbeda di Vim. Anda dapat mengenalinya dari huruf yang diawali:

```shell
g:           Variabel global
{nothing}    Variabel global
b:           Variabel lokal buffer
w:           Variabel lokal jendela
t:           Variabel lokal tab
s:           Variabel Vimscript yang disumber
l:           Variabel lokal fungsi
a:           Variabel parameter formal fungsi
v:           Variabel built-in Vim
```

### Variabel Global

Ketika Anda mendeklarasikan variabel "reguler":

```shell
let pancake = "pancake"
```

`pancake` sebenarnya adalah variabel global. Ketika Anda mendefinisikan variabel global, Anda dapat memanggilnya dari mana saja.

Menambahkan `g:` ke variabel juga membuat variabel global.

```shell
let g:waffle = "waffle"
```

Dalam hal ini, baik `pancake` maupun `g:waffle` memiliki cakupan yang sama. Anda dapat memanggil masing-masing dengan atau tanpa `g:`.

```shell
echo pancake
" mengembalikan "pancake"

echo g:pancake
" mengembalikan "pancake"

echo waffle
" mengembalikan "waffle"

echo g:waffle
" mengembalikan "waffle"
```

### Variabel Buffer

Variabel yang diawali dengan `b:` adalah variabel buffer. Variabel buffer adalah variabel yang bersifat lokal untuk buffer saat ini (Ch. 02). Jika Anda memiliki beberapa buffer terbuka, setiap buffer akan memiliki daftar variabel buffer yang terpisah.

Di buffer 1:

```shell
const b:donut = "chocolate donut"
```

Di buffer 2:

```shell
const b:donut = "blueberry donut"
```

Jika Anda menjalankan `echo b:donut` dari buffer 1, itu akan mengembalikan "chocolate donut". Jika Anda menjalankannya dari buffer 2, itu akan mengembalikan "blueberry donut".

Sebagai catatan, Vim memiliki variabel buffer *khusus* `b:changedtick` yang melacak semua perubahan yang dilakukan pada buffer saat ini.

1. Jalankan `echo b:changedtick` dan catat angka yang dikembalikannya.
2. Lakukan perubahan di Vim.
3. Jalankan `echo b:changedtick` lagi dan catat angka yang sekarang dikembalikannya.

### Variabel Jendela

Variabel yang diawali dengan `w:` adalah variabel jendela. Ini hanya ada di jendela itu.

Di jendela 1:

```shell
const w:donut = "chocolate donut"
```

Di jendela 2:

```shell
const w:donut = "raspberry donut"
```

Di setiap jendela, Anda dapat memanggil `echo w:donut` untuk mendapatkan nilai yang unik.

### Variabel Tab

Variabel yang diawali dengan `t:` adalah variabel tab. Ini hanya ada di tab itu.

Di tab 1:

```shell
const t:donut = "chocolate donut"
```

Di tab 2:

```shell
const t:donut = "blackberry donut"
```

Di setiap tab, Anda dapat memanggil `echo t:donut` untuk mendapatkan nilai yang unik.

### Variabel Skrip

Variabel yang diawali dengan `s:` adalah variabel skrip. Variabel ini hanya dapat diakses dari dalam skrip itu.

Jika Anda memiliki file sembarang `dozen.vim` dan di dalamnya Anda memiliki:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " tersisa"
endfunction
```

Sumber file tersebut dengan `:source dozen.vim`. Sekarang panggil fungsi `Consume`:

```shell
:call Consume()
" mengembalikan "11 tersisa"

:call Consume()
" mengembalikan "10 tersisa"

:echo s:dozen
" Kesalahan variabel tidak terdefinisi
```

Ketika Anda memanggil `Consume`, Anda melihat bahwa nilainya berkurang seperti yang diharapkan. Ketika Anda mencoba mendapatkan nilai `s:dozen` secara langsung, Vim tidak akan menemukannya karena Anda berada di luar cakupan. `s:dozen` hanya dapat diakses dari dalam `dozen.vim`.

Setiap kali Anda menyumber file `dozen.vim`, itu mengatur ulang penghitung `s:dozen`. Jika Anda sedang mengurangi nilai `s:dozen` dan Anda menjalankan `:source dozen.vim`, penghitung akan diatur ulang kembali ke 12. Ini bisa menjadi masalah bagi pengguna yang tidak menyadari. Untuk memperbaiki masalah ini, refactor kode:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Sekarang ketika Anda menyumber `dozen.vim` saat sedang mengurangi, Vim membaca `!exists("s:dozen")`, menemukan bahwa itu benar, dan tidak mengatur ulang nilai kembali ke 12.

### Variabel Lokal Fungsi dan Variabel Parameter Formal Fungsi

Baik variabel lokal fungsi (`l:`) maupun variabel formal fungsi (`a:`) akan dibahas di bab berikutnya.

### Variabel Built-in Vim

Variabel yang diawali dengan `v:` adalah variabel built-in Vim khusus. Anda tidak dapat mendefinisikan variabel ini. Anda sudah melihat beberapa di antaranya.
- `v:version` memberi tahu Anda versi Vim yang Anda gunakan.
- `v:key` berisi nilai item saat ini saat iterasi melalui kamus.
- `v:val` berisi nilai item saat ini saat menjalankan operasi `map()` atau `filter()`.
- `v:true`, `v:false`, `v:null`, dan `v:none` adalah tipe data khusus.

Ada variabel lain. Untuk daftar variabel built-in Vim, lihat `:h vim-variable` atau `:h v:`.

## Menggunakan Cakupan Variabel Vim dengan Cara Cerdas

Kemampuan untuk dengan cepat mengakses variabel lingkungan, opsi, dan register memberi Anda fleksibilitas luas untuk menyesuaikan editor dan lingkungan terminal Anda. Anda juga telah belajar bahwa Vim memiliki 9 cakupan variabel yang berbeda, masing-masing ada di bawah batasan tertentu. Anda dapat memanfaatkan jenis variabel unik ini untuk memisahkan program Anda.

Anda telah sampai sejauh ini. Anda telah belajar tentang tipe data, cara kombinasi, dan cakupan variabel. Hanya satu hal yang tersisa: fungsi.