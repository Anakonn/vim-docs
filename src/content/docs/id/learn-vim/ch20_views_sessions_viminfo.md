---
description: Pelajari cara menggunakan View, Session, dan Viminfo untuk menyimpan
  pengaturan dan perubahan proyek di Vim agar tampilan tetap konsisten saat dibuka
  kembali.
title: Ch20. Views, Sessions, and Viminfo
---

Setelah Anda bekerja pada sebuah proyek selama beberapa waktu, Anda mungkin menemukan proyek tersebut secara bertahap mengambil bentuk dengan pengaturan, lipatan, buffer, tata letak, dll. Ini seperti mendekorasi apartemen Anda setelah tinggal di dalamnya selama beberapa waktu. Masalahnya adalah, ketika Anda menutup Vim, Anda kehilangan perubahan tersebut. Bukankah akan menyenangkan jika Anda dapat menyimpan perubahan tersebut sehingga saat Anda membuka Vim berikutnya, tampilannya persis seperti saat Anda meninggalkannya?

Dalam bab ini, Anda akan belajar bagaimana menggunakan View, Session, dan Viminfo untuk mempertahankan "snapshot" dari proyek Anda.

## View

View adalah subset terkecil dari ketiga (View, Session, Viminfo). Ini adalah kumpulan pengaturan untuk satu jendela. Jika Anda menghabiskan waktu lama bekerja pada satu jendela dan ingin mempertahankan peta dan lipatan, Anda dapat menggunakan View.

Mari kita buat file bernama `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Dalam file ini, buat tiga perubahan:
1. Di baris 1, buat lipatan manual `zf4j` (lipat 4 baris berikutnya).
2. Ubah pengaturan `number`: `setlocal nonumber norelativenumber`. Ini akan menghapus indikator nomor di sisi kiri jendela.
3. Buat pemetaan lokal untuk turun dua baris setiap kali Anda menekan `j` alih-alih satu: `:nnoremap <buffer> j jj`.

File Anda harus terlihat seperti ini:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

### Mengonfigurasi Atribut View

Jalankan:

```shell
:set viewoptions?
```

Secara default, itu harus mengatakan (milik Anda mungkin terlihat berbeda tergantung pada vimrc Anda):

```shell
viewoptions=folds,cursor,curdir
```

Mari kita konfigurasi `viewoptions`. Tiga atribut yang ingin Anda simpan adalah lipatan, peta, dan opsi set lokal. Jika pengaturan Anda terlihat seperti milik saya, Anda sudah memiliki opsi `folds`. Anda perlu memberi tahu View untuk mengingat `localoptions`. Jalankan:

```shell
:set viewoptions+=localoptions
```

Untuk mengetahui opsi lain yang tersedia untuk `viewoptions`, lihat `:h viewoptions`. Sekarang jika Anda menjalankan `:set viewoptions?`, Anda harus melihat:

```shell
viewoptions=folds,cursor,curdir,localoptions
```

### Menyimpan View

Dengan jendela `foo.txt` yang sudah dilipat dengan opsi `nonumber norelativenumber`, mari kita simpan View. Jalankan:

```shell
:mkview
```

Vim membuat file View.

### File View

Anda mungkin bertanya, "Di mana Vim menyimpan file View ini?" Untuk melihat di mana Vim menyimpannya, jalankan:

```shell
:set viewdir?
```

Di OS berbasis Unix, defaultnya harus mengatakan `~/.vim/view` (jika Anda memiliki OS yang berbeda, itu mungkin menunjukkan jalur yang berbeda. Lihat `:h viewdir` untuk lebih lanjut). Jika Anda menjalankan OS berbasis Unix dan ingin mengubahnya ke jalur yang berbeda, tambahkan ini ke vimrc Anda:

```shell
set viewdir=$HOME/else/where
```

### Memuat File View

Tutup `foo.txt` jika Anda belum melakukannya, kemudian buka `foo.txt` lagi. **Anda harus melihat teks asli tanpa perubahan.** Itu diharapkan.

Untuk mengembalikan keadaan, Anda perlu memuat file View. Jalankan:

```shell
:loadview
```

Sekarang Anda harus melihat:

```shell
+-- 5 lines: foo1 -----
foo6
foo7
foo8
foo9
foo10
```

Lipatan, pengaturan lokal, dan pemetaan lokal telah dipulihkan. Jika Anda perhatikan, kursor Anda juga harus berada di baris tempat Anda meninggalkannya saat Anda menjalankan `:mkview`. Selama Anda memiliki opsi `cursor`, View juga mengingat posisi kursor Anda.

### Beberapa View

Vim memungkinkan Anda menyimpan 9 View bernomor (1-9).

Misalkan Anda ingin membuat lipatan tambahan (katakanlah Anda ingin melipat dua baris terakhir) dengan `:9,10 fold`. Mari kita simpan ini sebagai View 1. Jalankan:

```shell
:mkview 1
```

Jika Anda ingin membuat satu lipatan lagi dengan `:6,7 fold` dan menyimpannya sebagai View yang berbeda, jalankan:

```shell
:mkview 2
```

Tutup file. Ketika Anda membuka `foo.txt` dan ingin memuat View 1, jalankan:

```shell
:loadview 1
```

Untuk memuat View 2, jalankan:

```shell
:loadview 2
```

Untuk memuat View asli, jalankan:

```shell
:loadview
```

### Mengotomatiskan Pembuatan View

Salah satu hal terburuk yang bisa terjadi adalah, setelah menghabiskan berjam-jam mengatur file besar dengan lipatan, Anda secara tidak sengaja menutup jendela dan kehilangan semua informasi lipatan. Untuk mencegah ini, Anda mungkin ingin secara otomatis membuat View setiap kali Anda menutup buffer. Tambahkan ini ke vimrc Anda:

```shell
autocmd BufWinLeave *.txt mkview
```

Selain itu, mungkin akan menyenangkan untuk memuat View saat Anda membuka buffer:

```shell
autocmd BufWinEnter *.txt silent loadview
```

Sekarang Anda tidak perlu khawatir tentang membuat dan memuat View lagi saat Anda bekerja dengan file `txt`. Ingatlah bahwa seiring waktu, `~/.vim/view` Anda mungkin mulai mengumpulkan file View. Baik untuk membersihkannya sekali setiap beberapa bulan.

## Sesi

Jika View menyimpan pengaturan jendela, Sesi menyimpan informasi dari semua jendela (termasuk tata letak).

### Membuat Sesi Baru

Misalkan Anda sedang bekerja dengan 3 file ini dalam proyek `foobarbaz`:

Di dalam `foo.txt`:

```shell
foo1
foo2
foo3
foo4
foo5
foo6
foo7
foo8
foo9
foo10
```

Di dalam `bar.txt`:

```shell
bar1
bar2
bar3
bar4
bar5
bar6
bar7
bar8
bar9
bar10
```

Di dalam `baz.txt`:

```shell
baz1
baz2
baz3
baz4
baz5
baz6
baz7
baz8
baz9
baz10
```

Sekarang katakanlah Anda membagi jendela Anda dengan `:split` dan `:vsplit`. Untuk mempertahankan tampilan ini, Anda perlu menyimpan Sesi. Jalankan:

```shell
:mksession
```

Berbeda dengan `mkview` yang secara default menyimpan ke `~/.vim/view`, `mksession` menyimpan file Sesi (`Session.vim`) di direktori saat ini. Periksa file tersebut jika Anda penasaran apa isinya.

Jika Anda ingin menyimpan file Sesi di tempat lain, Anda dapat memberikan argumen ke `mksession`:

```shell
:mksession ~/some/where/else.vim
```

Jika Anda ingin menimpa file Sesi yang ada, panggil perintah dengan `!` (`:mksession! ~/some/where/else.vim`).

### Memuat Sesi

Untuk memuat Sesi, jalankan:

```shell
:source Session.vim
```

Sekarang Vim terlihat persis seperti saat Anda meninggalkannya, termasuk jendela yang terpisah! Sebagai alternatif, Anda juga dapat memuat file Sesi dari terminal:

```shell
vim -S Session.vim
```

### Mengonfigurasi Atribut Sesi

Anda dapat mengonfigurasi atribut yang disimpan Sesi. Untuk melihat apa yang saat ini disimpan, jalankan:

```shell
:set sessionoptions?
```

Milik saya mengatakan:

```shell
blank,buffers,curdir,folds,help,tabpages,winsize,terminal
```

Jika Anda tidak ingin menyimpan `terminal` saat menyimpan Sesi, hapus dari opsi sesi. Jalankan:

```shell
:set sessionoptions-=terminal
```

Jika Anda ingin menambahkan `options` saat menyimpan Sesi, jalankan:

```shell
:set sessionoptions+=options
```

Berikut adalah beberapa atribut yang dapat disimpan oleh `sessionoptions`:
- `blank` menyimpan jendela kosong
- `buffers` menyimpan buffer
- `folds` menyimpan lipatan
- `globals` menyimpan variabel global (harus dimulai dengan huruf kapital dan mengandung setidaknya satu huruf kecil)
- `options` menyimpan opsi dan pemetaan
- `resize` menyimpan baris dan kolom jendela
- `winpos` menyimpan posisi jendela
- `winsize` menyimpan ukuran jendela
- `tabpages` menyimpan tab
- `unix` menyimpan file dalam format Unix

Untuk daftar lengkap, lihat `:h 'sessionoptions'`.

Sesi adalah alat yang berguna untuk mempertahankan atribut eksternal proyek Anda. Namun, beberapa atribut internal tidak disimpan oleh Sesi, seperti tanda lokal, register, riwayat, dll. Untuk menyimpannya, Anda perlu menggunakan Viminfo!

## Viminfo

Jika Anda perhatikan, setelah menyalin sebuah kata ke dalam register a dan keluar dari Vim, kali berikutnya Anda membuka Vim, Anda masih memiliki teks tersebut tersimpan di register a. Ini sebenarnya adalah hasil kerja Viminfo. Tanpa itu, Vim tidak akan mengingat register setelah Anda menutup Vim.

Jika Anda menggunakan Vim 8 atau lebih tinggi, Vim mengaktifkan Viminfo secara default, jadi Anda mungkin telah menggunakan Viminfo selama ini tanpa menyadarinya!

Anda mungkin bertanya: "Apa yang disimpan Viminfo? Bagaimana cara kerjanya berbeda dari Sesi?"

Untuk menggunakan Viminfo, pertama Anda perlu memiliki fitur `+viminfo` yang tersedia (`:version`). Viminfo menyimpan:
- Riwayat baris perintah.
- Riwayat string pencarian.
- Riwayat baris input.
- Konten dari register yang tidak kosong.
- Tanda untuk beberapa file.
- Tanda file, yang menunjuk ke lokasi dalam file.
- Pola pencarian / pengganti terakhir (untuk 'n' dan '&').
- Daftar buffer.
- Variabel global.

Secara umum, Sesi menyimpan atribut "eksternal" dan Viminfo menyimpan atribut "internal".

Berbeda dengan Sesi di mana Anda dapat memiliki satu file Sesi per proyek, Anda biasanya akan menggunakan satu file Viminfo per komputer. Viminfo tidak terkait dengan proyek.

Lokasi default Viminfo untuk Unix adalah `$HOME/.viminfo` (`~/.viminfo`). Jika Anda menggunakan OS yang berbeda, lokasi Viminfo Anda mungkin berbeda. Lihat `:h viminfo-file-name`. Setiap kali Anda membuat perubahan "internal", seperti menyalin teks ke dalam register, Vim secara otomatis memperbarui file Viminfo.

*Pastikan bahwa Anda telah mengatur opsi `nocompatible` (`set nocompatible`), jika tidak, Viminfo Anda tidak akan berfungsi.*

### Menulis dan Membaca Viminfo

Meskipun Anda hanya akan menggunakan satu file Viminfo, Anda dapat membuat beberapa file Viminfo. Untuk menulis file Viminfo, gunakan perintah `:wviminfo` (`:wv` untuk singkat).

```shell
:wv ~/.viminfo_extra
```

Untuk menimpa file Viminfo yang ada, tambahkan tanda seru ke perintah `wv`:

```shell
:wv! ~/.viminfo_extra
```

Secara default, Vim akan membaca dari file `~/.viminfo`. Untuk membaca dari file Viminfo yang berbeda, jalankan `:rviminfo`, atau `:rv` untuk singkat:

```shell
:rv ~/.viminfo_extra
```

Untuk memulai Vim dengan file Viminfo yang berbeda dari terminal, gunakan flag `i`:

```shell
vim -i viminfo_extra
```

Jika Anda menggunakan Vim untuk berbagai tugas, seperti pengkodean dan penulisan, Anda dapat membuat Viminfo yang dioptimalkan untuk penulisan dan yang lain untuk pengkodean.

```shell
vim -i viminfo_writing

vim -i viminfo_coding
```

### Memulai Vim Tanpa Viminfo

Untuk memulai Vim tanpa Viminfo, Anda dapat menjalankan dari terminal:

```shell
vim -i NONE
```

Untuk membuatnya permanen, Anda dapat menambahkan ini ke file vimrc Anda:

```shell
set viminfo="NONE"
```

### Mengonfigurasi Atribut Viminfo

Mirip dengan `viewoptions` dan `sessionoptions`, Anda dapat menginstruksikan atribut apa yang akan disimpan dengan opsi `viminfo`. Jalankan:

```shell
:set viminfo?
```

Anda akan mendapatkan:

```shell
!,'100,<50,s10,h
```

Ini terlihat rumit. Mari kita uraikan:
- `!` menyimpan variabel global yang dimulai dengan huruf kapital dan tidak mengandung huruf kecil. Ingat bahwa `g:` menunjukkan variabel global. Misalnya, jika pada suatu saat Anda menulis penugasan `let g:FOO = "foo"`, Viminfo akan menyimpan variabel global `FOO`. Namun jika Anda melakukan `let g:Foo = "foo"`, Viminfo tidak akan menyimpan variabel global ini karena mengandung huruf kecil. Tanpa `!`, Vim tidak akan menyimpan variabel global tersebut.
- `'100` mewakili tanda. Dalam hal ini, Viminfo akan menyimpan tanda lokal (a-z) dari 100 file terakhir. Perhatikan bahwa jika Anda memberi tahu Viminfo untuk menyimpan terlalu banyak file, Vim dapat mulai melambat. 1000 adalah angka yang baik untuk dimiliki.
- `<50` memberi tahu Viminfo berapa banyak maksimum baris yang disimpan untuk setiap register (50 dalam hal ini). Jika saya menyalin 100 baris teks ke dalam register a (`"ay99j`) dan menutup Vim, kali berikutnya saya membuka Vim dan menempel dari register a (`"ap`), Vim hanya akan menempel maksimal 50 baris. Jika Anda tidak memberikan nomor baris maksimum, *semua* baris akan disimpan. Jika Anda memberikannya 0, tidak ada yang akan disimpan.
- `s10` menetapkan batas ukuran (dalam kb) untuk sebuah register. Dalam hal ini, register mana pun yang lebih besar dari 10kb akan dikecualikan.
- `h` menonaktifkan penyorotan (dari `hlsearch`) saat Vim dimulai.

Ada opsi lain yang dapat Anda berikan. Untuk mempelajari lebih lanjut, lihat `:h 'viminfo'`.
## Menggunakan Views, Sessions, dan Viminfo dengan Cerdas

Vim memiliki View, Session, dan Viminfo untuk mengambil snapshot lingkungan Vim Anda pada tingkat yang berbeda. Untuk proyek mikro, gunakan Views. Untuk proyek yang lebih besar, gunakan Sessions. Anda harus meluangkan waktu untuk memeriksa semua opsi yang ditawarkan oleh View, Session, dan Viminfo.

Buat View, Session, dan Viminfo Anda sendiri sesuai dengan gaya pengeditan Anda. Jika Anda perlu menggunakan Vim di luar komputer Anda, Anda hanya perlu memuat pengaturan Anda dan Anda akan segera merasa seperti di rumah!