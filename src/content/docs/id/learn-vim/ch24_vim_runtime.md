---
description: Dokumen ini memberikan gambaran umum tentang jalur runtime Vim, termasuk
  cara mengonfigurasi dan memahami skrip plugin saat Vim dijalankan.
title: Ch24. Vim Runtime
---

Dalam bab sebelumnya, saya menyebutkan bahwa Vim secara otomatis mencari jalur khusus seperti `pack/` (Bab 22) dan `compiler/` (Bab 19) di dalam direktori `~/.vim/`. Ini adalah contoh jalur runtime Vim.

Vim memiliki lebih banyak jalur runtime daripada dua ini. Dalam bab ini, Anda akan mempelajari gambaran umum tingkat tinggi tentang jalur runtime ini. Tujuan dari bab ini adalah untuk menunjukkan kepada Anda kapan mereka dipanggil. Mengetahui ini akan memungkinkan Anda untuk memahami dan menyesuaikan Vim lebih lanjut.

## Jalur Runtime

Di mesin Unix, salah satu jalur runtime Vim Anda adalah `$HOME/.vim/` (jika Anda memiliki OS yang berbeda seperti Windows, jalur Anda mungkin berbeda). Untuk melihat apa jalur runtime untuk berbagai OS, lihat `:h 'runtimepath'`. Dalam bab ini, saya akan menggunakan `~/.vim/` sebagai jalur runtime default.

## Skrip Plugin

Vim memiliki jalur runtime plugin yang mengeksekusi skrip apa pun di direktori ini sekali setiap kali Vim dimulai. Jangan bingung dengan nama "plugin" dengan plugin eksternal Vim (seperti NERDTree, fzf.vim, dll).

Pergi ke direktori `~/.vim/` dan buat direktori `plugin/`. Buat dua file: `donut.vim` dan `chocolate.vim`.

Di dalam `~/.vim/plugin/donut.vim`:

```shell
echo "donut!"
```

Di dalam `~/.vim/plugin/chocolate.vim`:

```shell
echo "chocolate!"
```

Sekarang tutup Vim. Saat Anda memulai Vim lagi, Anda akan melihat kedua `"donut!"` dan `"chocolate!"` dicetak. Jalur runtime plugin dapat digunakan untuk skrip inisialisasi.

## Deteksi Tipe File

Sebelum Anda mulai, untuk memastikan bahwa deteksi ini bekerja, pastikan bahwa vimrc Anda berisi setidaknya baris berikut:

```shell
filetype plugin indent on
```

Lihat `:h filetype-overview` untuk konteks lebih lanjut. Pada dasarnya ini mengaktifkan deteksi tipe file Vim.

Ketika Anda membuka file baru, Vim biasanya tahu jenis file apa itu. Jika Anda memiliki file `hello.rb`, menjalankan `:set filetype?` mengembalikan respons yang benar `filetype=ruby`.

Vim tahu bagaimana mendeteksi tipe file "umum" (Ruby, Python, Javascript, dll). Tapi bagaimana jika Anda memiliki file kustom? Anda perlu mengajari Vim untuk mendeteksinya dan menetapkannya dengan tipe file yang benar.

Ada dua metode deteksi: menggunakan nama file dan konten file.

### Deteksi Nama File

Deteksi nama file mendeteksi tipe file menggunakan nama file tersebut. Ketika Anda membuka file `hello.rb`, Vim tahu itu adalah file Ruby dari ekstensi `.rb`.

Ada dua cara Anda dapat melakukan deteksi nama file: menggunakan direktori runtime `ftdetect/` dan menggunakan file runtime `filetype.vim`. Mari kita jelajahi keduanya.

#### `ftdetect/`

Mari kita buat file yang tidak biasa (namun lezat), `hello.chocodonut`. Ketika Anda membukanya dan menjalankan `:set filetype?`, karena itu bukan ekstensi nama file yang umum, Vim tidak tahu apa yang harus dibuat darinya. Itu mengembalikan `filetype=`.

Anda perlu menginstruksikan Vim untuk menetapkan semua file yang diakhiri dengan `.chocodonut` sebagai tipe file "chocodonut". Buat direktori bernama `ftdetect/` di root runtime (`~/.vim/`). Di dalamnya, buat file dan beri nama `chocodonut.vim` (`~/.vim/ftdetect/chocodonut.vim`). Di dalam file ini, tambahkan:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` dan `BufRead` dipicu setiap kali Anda membuat buffer baru dan membuka buffer baru. `*.chocodonut` berarti bahwa peristiwa ini hanya akan dipicu jika buffer yang dibuka memiliki ekstensi nama file `.chocodonut`. Akhirnya, perintah `set filetype=chocodonut` menetapkan tipe file menjadi tipe chocodonut.

Restart Vim. Sekarang buka file `hello.chocodonut` dan jalankan `:set filetype?`. Itu mengembalikan `filetype=chocodonut`.

Lezat! Anda dapat menempatkan sebanyak mungkin file yang Anda inginkan di dalam `ftdetect/`. Di masa depan, Anda mungkin menambahkan `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, dll., jika Anda pernah memutuskan untuk memperluas tipe file donut Anda.

Sebenarnya ada dua cara untuk menetapkan tipe file di Vim. Satu adalah yang baru saja Anda gunakan `set filetype=chocodonut`. Cara lainnya adalah menjalankan `setfiletype chocodonut`. Perintah pertama `set filetype=chocodonut` akan *selalu* menetapkan tipe file menjadi tipe chocodonut, sementara perintah terakhir `setfiletype chocodonut` hanya akan menetapkan tipe file jika belum ada tipe file yang ditetapkan.

#### File Tipe

Metode deteksi file kedua mengharuskan Anda untuk membuat `filetype.vim` di direktori root (`~/.vim/filetype.vim`). Tambahkan ini di dalamnya:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

Buat file `hello.plaindonut`. Ketika Anda membukanya dan menjalankan `:set filetype?`, Vim menampilkan tipe file kustom yang benar `filetype=plaindonut`.

Holy pastry, itu berhasil! Ngomong-ngomong, jika Anda bermain-main dengan `filetype.vim`, Anda mungkin memperhatikan bahwa file ini dijalankan beberapa kali ketika Anda membuka `hello.plaindonut`. Untuk mencegah ini, Anda dapat menambahkan penjaga sehingga skrip utama hanya dijalankan sekali. Perbarui `filetype.vim`:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` adalah perintah Vim untuk menghentikan eksekusi sisa skrip. Ekspresi `"did_load_filetypes"` *bukan* fungsi bawaan Vim. Itu sebenarnya adalah variabel global dari dalam `$VIMRUNTIME/filetype.vim`. Jika Anda penasaran, jalankan `:e $VIMRUNTIME/filetype.vim`. Anda akan menemukan baris-baris ini di dalamnya:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

Ketika Vim memanggil file ini, ia mendefinisikan variabel `did_load_filetypes` dan menetapkannya ke 1. 1 adalah nilai benar di Vim. Anda harus membaca sisa dari `filetype.vim` juga. Lihat apakah Anda bisa memahami apa yang dilakukannya ketika Vim memanggilnya.

### Skrip Tipe File

Mari kita pelajari bagaimana mendeteksi dan menetapkan tipe file berdasarkan konten file.

Misalkan Anda memiliki koleksi file tanpa ekstensi yang disepakati. Satu-satunya hal yang dimiliki file-file ini secara bersama-sama adalah bahwa semuanya dimulai dengan kata "donutify" di baris pertama. Anda ingin menetapkan file-file ini ke tipe file `donut`. Buat file baru bernama `sugardonut`, `glazeddonut`, dan `frieddonut` (tanpa ekstensi). Di dalam setiap file, tambahkan baris ini:

```shell
donutify
```

Ketika Anda menjalankan `:set filetype?` dari dalam `sugardonut`, Vim tidak tahu tipe file apa yang harus ditetapkan untuk file ini. Itu mengembalikan `filetype=`.

Di jalur root runtime, tambahkan file `scripts.vim` (`~/.vim/scripts.vim`). Di dalamnya, tambahkan ini:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

Fungsi `getline(1)` mengembalikan teks di baris pertama. Itu memeriksa apakah baris pertama dimulai dengan kata "donutify". Fungsi `did_filetype()` adalah fungsi bawaan Vim. Itu akan mengembalikan true ketika peristiwa terkait tipe file dipicu setidaknya sekali. Itu digunakan sebagai penjaga untuk menghentikan pemanggilan ulang peristiwa tipe file.

Buka file `sugardonut` dan jalankan `:set filetype?`, Vim sekarang mengembalikan `filetype=donut`. Jika Anda membuka file donut lainnya (`glazeddonut` dan `frieddonut`), Vim juga mengidentifikasi tipe file mereka sebagai tipe `donut`.

Perhatikan bahwa `scripts.vim` hanya dijalankan ketika Vim membuka file dengan tipe file yang tidak diketahui. Jika Vim membuka file dengan tipe file yang diketahui, `scripts.vim` tidak akan dijalankan.

## Plugin Tipe File

Bagaimana jika Anda ingin Vim menjalankan skrip khusus chocodonut ketika Anda membuka file chocodonut dan tidak menjalankan skrip tersebut saat membuka file plaindonut?

Anda dapat melakukan ini dengan jalur runtime plugin tipe file (`~/.vim/ftplugin/`). Vim mencari di dalam direktori ini untuk file dengan nama yang sama dengan tipe file yang baru saja Anda buka. Buat file `chocodonut.vim` (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

Buat file ftplugin lainnya, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

Sekarang setiap kali Anda membuka tipe file chocodonut, Vim menjalankan skrip dari `~/.vim/ftplugin/chocodonut.vim`. Setiap kali Anda membuka tipe file plaindonut, Vim menjalankan skrip dari `~/.vim/ftplugin/plaindonut.vim`.

Satu peringatan: file-file ini dijalankan setiap kali tipe file buffer diatur (`set filetype=chocodonut` misalnya). Jika Anda membuka 3 file chocodonut yang berbeda, skrip akan dijalankan *total* tiga kali.

## File Indent

Vim memiliki jalur runtime indent yang bekerja mirip dengan ftplugin, di mana Vim mencari file yang dinamai sama dengan tipe file yang dibuka. Tujuan dari jalur runtime indent ini adalah untuk menyimpan kode terkait indentasi. Jika Anda memiliki file `~/.vim/indent/chocodonut.vim`, itu hanya akan dieksekusi ketika Anda membuka tipe file chocodonut. Anda dapat menyimpan kode terkait indentasi untuk file chocodonut di sini.

## Warna

Vim memiliki jalur runtime warna (`~/.vim/colors/`) untuk menyimpan skema warna. Setiap file yang masuk ke dalam direktori akan ditampilkan dalam perintah baris perintah `:color`.

Jika Anda memiliki file `~/.vim/colors/beautifulprettycolors.vim`, ketika Anda menjalankan `:color` dan menekan Tab, Anda akan melihat `beautifulprettycolors` sebagai salah satu opsi warna. Jika Anda lebih suka menambahkan skema warna Anda sendiri, ini adalah tempatnya.

Jika Anda ingin memeriksa skema warna yang dibuat orang lain, tempat yang baik untuk dikunjungi adalah [vimcolors](https://vimcolors.com/).

## Penyorotan Sintaksis

Vim memiliki jalur runtime sintaksis (`~/.vim/syntax/`) untuk mendefinisikan penyorotan sintaksis.

Misalkan Anda memiliki file `hello.chocodonut`, di dalamnya Anda memiliki ekspresi berikut:

```shell
(donut "tasty")
(donut "savory")
```

Meskipun Vim sekarang tahu tipe file yang benar, semua teks memiliki warna yang sama. Mari kita tambahkan aturan penyorotan sintaksis untuk menyoroti kata kunci "donut". Buat file sintaksis chocodonut baru, `~/.vim/syntax/chocodonut.vim`. Di dalamnya tambahkan:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

Sekarang buka kembali file `hello.chocodonut`. Kata kunci `donut` sekarang disorot.

Bab ini tidak akan membahas penyorotan sintaksis secara mendalam. Ini adalah topik yang luas. Jika Anda penasaran, lihat `:h syntax.txt`.

Plugin [vim-polyglot](https://github.com/sheerun/vim-polyglot) adalah plugin hebat yang menyediakan penyorotan untuk banyak bahasa pemrograman populer.

## Dokumentasi

Jika Anda membuat plugin, Anda harus membuat dokumentasi Anda sendiri. Anda menggunakan jalur runtime doc untuk itu.

Mari kita buat dokumentasi dasar untuk kata kunci chocodonut dan plaindonut. Buat file `donut.txt` (`~/.vim/doc/donut.txt`). Di dalamnya, tambahkan teks-teks ini:

```shell
*chocodonut* Donat cokelat yang lezat

*plaindonut* Tidak ada kebaikan cokelat tetapi tetap lezat
```

Jika Anda mencoba mencari `chocodonut` dan `plaindonut` (`:h chocodonut` dan `:h plaindonut`), Anda tidak akan menemukan apa pun.

Pertama, Anda perlu menjalankan `:helptags` untuk menghasilkan entri bantuan baru. Jalankan `:helptags ~/.vim/doc/`

Sekarang jika Anda menjalankan `:h chocodonut` dan `:h plaindonut`, Anda akan menemukan entri bantuan baru ini. Perhatikan bahwa file sekarang bersifat read-only dan memiliki tipe file "help".
## Memuat Skrip Secara Malas

Semua jalur runtime yang Anda pelajari di bab ini dijalankan secara otomatis. Jika Anda ingin memuat skrip secara manual, gunakan jalur runtime autoload.

Buat direktori autoload (`~/.vim/autoload/`). Di dalam direktori tersebut, buat file baru dan beri nama `tasty.vim` (`~/.vim/autoload/tasty.vim`). Di dalamnya:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

Perhatikan bahwa nama fungsi adalah `tasty#donut`, bukan `donut()`. Tanda pagar (`#`) diperlukan saat menggunakan fitur autoload. Konvensi penamaan fungsi untuk fitur autoload adalah:

```shell
function fileName#functionName()
  ...
endfunction
```

Dalam hal ini, nama file adalah `tasty.vim` dan nama fungsi adalah (secara teknis) `donut`.

Untuk memanggil fungsi, Anda memerlukan perintah `call`. Mari kita panggil fungsi itu dengan `:call tasty#donut()`.

Pertama kali Anda memanggil fungsi, Anda harus melihat *kedua* pesan echo ("tasty.vim global" dan "tasty#donut"). Panggilan selanjutnya ke fungsi `tasty#donut` hanya akan menampilkan echo "testy#donut".

Saat Anda membuka file di Vim, tidak seperti jalur runtime sebelumnya, skrip autoload tidak dimuat secara otomatis. Hanya ketika Anda secara eksplisit memanggil `tasty#donut()`, Vim mencari file `tasty.vim` dan memuat semua yang ada di dalamnya, termasuk fungsi `tasty#donut()`. Autoload adalah mekanisme yang sempurna untuk fungsi yang menggunakan sumber daya yang luas tetapi tidak sering Anda gunakan.

Anda dapat menambahkan sebanyak mungkin direktori bersarang dengan autoload sesuai keinginan Anda. Jika Anda memiliki jalur runtime `~/.vim/autoload/one/two/three/tasty.vim`, Anda dapat memanggil fungsi dengan `:call one#two#three#tasty#donut()`.

## Setelah Skrip

Vim memiliki jalur runtime setelah (`~/.vim/after/`) yang mencerminkan struktur dari `~/.vim/`. Apa pun di jalur ini dieksekusi terakhir, jadi pengembang biasanya menggunakan jalur ini untuk menimpa skrip.

Sebagai contoh, jika Anda ingin menimpa skrip dari `plugin/chocolate.vim`, Anda dapat membuat `~/.vim/after/plugin/chocolate.vim` untuk menempatkan skrip penimpaan. Vim akan menjalankan `~/.vim/after/plugin/chocolate.vim` *setelah* `~/.vim/plugin/chocolate.vim`.

## $VIMRUNTIME

Vim memiliki variabel lingkungan `$VIMRUNTIME` untuk skrip default dan file dukungan. Anda dapat memeriksanya dengan menjalankan `:e $VIMRUNTIME`.

Strukturnya harus terlihat akrab. Ini berisi banyak jalur runtime yang Anda pelajari di bab ini.

Ingat di Bab 21, Anda belajar bahwa ketika Anda membuka Vim, ia mencari file vimrc di tujuh lokasi berbeda. Saya mengatakan bahwa lokasi terakhir yang diperiksa Vim adalah `$VIMRUNTIME/defaults.vim`. Jika Vim gagal menemukan file vimrc pengguna, Vim menggunakan `defaults.vim` sebagai vimrc.

Apakah Anda pernah mencoba menjalankan Vim tanpa plugin sintaksis seperti vim-polyglot dan file Anda masih disorot secara sintaksis? Itu karena ketika Vim gagal menemukan file sintaksis dari jalur runtime, Vim mencari file sintaksis dari direktori sintaksis `$VIMRUNTIME`.

Untuk belajar lebih lanjut, periksa `:h $VIMRUNTIME`.

## Opsi Runtimepath

Untuk memeriksa runtimepath Anda, jalankan `:set runtimepath?`

Jika Anda menggunakan Vim-Plug atau manajer plugin eksternal populer, itu harus menampilkan daftar direktori. Misalnya, milik saya menunjukkan:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

Salah satu hal yang dilakukan manajer plugin adalah menambahkan setiap plugin ke jalur runtime. Setiap jalur runtime dapat memiliki struktur direktori sendiri yang mirip dengan `~/.vim/`.

Jika Anda memiliki direktori `~/box/of/donuts/` dan Anda ingin menambahkan direktori itu ke jalur runtime Anda, Anda dapat menambahkan ini ke vimrc Anda:

```shell
set rtp+=$HOME/box/of/donuts/
```

Jika di dalam `~/box/of/donuts/`, Anda memiliki direktori plugin (`~/box/of/donuts/plugin/hello.vim`) dan ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`), Vim akan menjalankan semua skrip dari `plugin/hello.vim` saat Anda membuka Vim. Vim juga akan menjalankan `ftplugin/chocodonut.vim` saat Anda membuka file chocodonut.

Cobalah ini sendiri: buat jalur sembarang dan tambahkan ke runtimepath Anda. Tambahkan beberapa jalur runtime yang Anda pelajari dari bab ini. Pastikan mereka berfungsi seperti yang diharapkan.

## Pelajari Runtime dengan Cara Cerdas

Luangkan waktu Anda untuk membacanya dan bermain-main dengan jalur runtime ini. Untuk melihat bagaimana jalur runtime digunakan di dunia nyata, pergi ke repositori salah satu plugin Vim favorit Anda dan pelajari struktur direktori. Anda seharusnya dapat memahami sebagian besar dari mereka sekarang. Cobalah untuk mengikuti dan memahami gambaran besarnya. Sekarang Anda memahami struktur direktori Vim, Anda siap untuk belajar Vimscript.