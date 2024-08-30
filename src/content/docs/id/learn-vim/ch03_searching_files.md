---
description: Panduan ini memperkenalkan cara cepat mencari di Vim, mencakup pencarian
  tanpa plugin dan menggunakan plugin fzf.vim untuk meningkatkan produktivitas.
title: Ch03. Searching Files
---

Tujuan dari bab ini adalah memberikan pengantar tentang cara mencari dengan cepat di Vim. Mampu mencari dengan cepat adalah cara yang bagus untuk meningkatkan produktivitas Vim Anda. Ketika saya menemukan cara untuk mencari file dengan cepat, saya beralih untuk menggunakan Vim secara penuh waktu.

Bab ini dibagi menjadi dua bagian: cara mencari tanpa plugin dan cara mencari dengan plugin [fzf.vim](https://github.com/junegunn/fzf.vim). Mari kita mulai!

## Membuka dan Mengedit File

Untuk membuka file di Vim, Anda dapat menggunakan `:edit`.

```shell
:edit file.txt
```

Jika `file.txt` ada, itu akan membuka buffer `file.txt`. Jika `file.txt` tidak ada, itu akan membuat buffer baru untuk `file.txt`.

Autocomplete dengan `<Tab>` berfungsi dengan `:edit`. Misalnya, jika file Anda berada di dalam direktori *a*pp *c*ontroller *u*sers controller `./app/controllers/users_controllers.rb`, Anda dapat menggunakan `<Tab>` untuk memperluas istilah dengan cepat:

```shell
:edit a<Tab>c<Tab>u<Tab>
```

`:edit` menerima argumen wildcard. `*` mencocokkan file apa pun di direktori saat ini. Jika Anda hanya mencari file dengan ekstensi `.yml` di direktori saat ini:

```shell
:edit *.yml<Tab>
```

Vim akan memberikan daftar semua file `.yml` di direktori saat ini untuk dipilih.

Anda dapat menggunakan `**` untuk mencari secara rekursif. Jika Anda ingin mencari semua file `*.md` di proyek Anda, tetapi Anda tidak yakin di direktori mana, Anda dapat melakukan ini:

```shell
:edit **/*.md<Tab>
```

`:edit` dapat digunakan untuk menjalankan `netrw`, penjelajah file bawaan Vim. Untuk melakukan itu, berikan argumen direktori ke `:edit` alih-alih file:

```shell
:edit .
:edit test/unit/
```

## Mencari File Dengan Find

Anda dapat menemukan file dengan `:find`. Misalnya:

```shell
:find package.json
:find app/controllers/users_controller.rb
```

Autocomplete juga berfungsi dengan `:find`:

```shell
:find p<Tab>                " untuk menemukan package.json
:find a<Tab>c<Tab>u<Tab>    " untuk menemukan app/controllers/users_controller.rb
```

Anda mungkin memperhatikan bahwa `:find` terlihat seperti `:edit`. Apa perbedaannya?

## Find dan Path

Perbedaannya adalah bahwa `:find` menemukan file di `path`, `:edit` tidak. Mari kita pelajari sedikit tentang `path`. Setelah Anda belajar bagaimana memodifikasi path Anda, `:find` dapat menjadi alat pencarian yang kuat. Untuk memeriksa apa path Anda, lakukan:

```shell
:set path?
```

Secara default, milik Anda mungkin terlihat seperti ini:

```shell
path=.,/usr/include,,
```

- `.` berarti mencari di direktori file yang sedang dibuka.
- `,` berarti mencari di direktori saat ini.
- `/usr/include` adalah direktori tipikal untuk file header pustaka C.

Dua yang pertama penting dalam konteks kita dan yang ketiga dapat diabaikan untuk saat ini. Yang perlu diingat di sini adalah bahwa Anda dapat memodifikasi path Anda sendiri, di mana Vim akan mencari file. Mari kita anggap ini adalah struktur proyek Anda:

```shell
app/
  assets/
  controllers/
    application_controller.rb
    comments_controller.rb
    users_controller.rb
    ...
```

Jika Anda ingin pergi ke `users_controller.rb` dari direktori root, Anda harus melewati beberapa direktori (dan menekan sejumlah besar tab). Seringkali saat bekerja dengan framework, Anda menghabiskan 90% waktu Anda di direktori tertentu. Dalam situasi ini, Anda hanya peduli untuk pergi ke direktori `controllers/` dengan jumlah ketukan tombol yang paling sedikit. Pengaturan `path` dapat memperpendek perjalanan itu.

Anda perlu menambahkan `app/controllers/` ke `path` saat ini. Berikut adalah cara Anda dapat melakukannya:

```shell
:set path+=app/controllers/
```

Sekarang bahwa path Anda telah diperbarui, ketika Anda mengetik `:find u<Tab>`, Vim sekarang akan mencari di dalam direktori `app/controllers/` untuk file yang dimulai dengan "u".

Jika Anda memiliki direktori `controllers/` yang bersarang, seperti `app/controllers/account/users_controller.rb`, Vim tidak akan menemukan `users_controllers`. Sebagai gantinya, Anda perlu menambahkan `:set path+=app/controllers/**` agar autocompletion dapat menemukan `users_controller.rb`. Ini luar biasa! Sekarang Anda dapat menemukan controller pengguna dengan 1 tekan tab alih-alih 3.

Anda mungkin berpikir untuk menambahkan seluruh direktori proyek sehingga ketika Anda menekan `tab`, Vim akan mencari di mana-mana untuk file itu, seperti ini:

```shell
:set path+=$PWD/**
```

`$PWD` adalah direktori kerja saat ini. Jika Anda mencoba menambahkan seluruh proyek Anda ke `path` berharap untuk membuat semua file dapat diakses dengan menekan `tab`, meskipun ini mungkin berhasil untuk proyek kecil, melakukan ini akan memperlambat pencarian Anda secara signifikan jika Anda memiliki sejumlah besar file di proyek Anda. Saya merekomendasikan untuk menambahkan hanya `path` dari file / direktori yang paling sering Anda kunjungi.

Anda dapat menambahkan `set path+={your-path-here}` di vimrc Anda. Memperbarui `path` hanya memerlukan beberapa detik dan melakukannya dapat menghemat banyak waktu Anda.

## Mencari di File Dengan Grep

Jika Anda perlu mencari di dalam file (mencari frasa dalam file), Anda dapat menggunakan grep. Vim memiliki dua cara untuk melakukannya:

- Grep internal (`:vim`. Ya, itu dieja `:vim`. Ini adalah singkatan dari `:vimgrep`).
- Grep eksternal (`:grep`).

Mari kita bahas grep internal terlebih dahulu. `:vim` memiliki sintaks berikut:

```shell
:vim /pattern/ file
```

- `/pattern/` adalah pola regex dari istilah pencarian Anda.
- `file` adalah argumen file. Anda dapat melewatkan beberapa argumen. Vim akan mencari pola di dalam argumen file. Mirip dengan `:find`, Anda dapat melewatkan wildcard `*` dan `**`.

Misalnya, untuk mencari semua kemunculan string "breakfast" di dalam semua file ruby (`.rb`) di dalam direktori `app/controllers/`:

```shell
:vim /breakfast/ app/controllers/**/*.rb
```

Setelah menjalankan itu, Anda akan diarahkan ke hasil pertama. Perintah pencarian `vim` dari Vim menggunakan operasi `quickfix`. Untuk melihat semua hasil pencarian, jalankan `:copen`. Ini membuka jendela `quickfix`. Berikut adalah beberapa perintah quickfix yang berguna untuk membuat Anda produktif segera:

```shell
:copen        Buka jendela quickfix
:cclose       Tutup jendela quickfix
:cnext        Pergi ke kesalahan berikutnya
:cprevious    Pergi ke kesalahan sebelumnya
:colder       Pergi ke daftar kesalahan yang lebih lama
:cnewer       Pergi ke daftar kesalahan yang lebih baru
```

Untuk mempelajari lebih lanjut tentang quickfix, lihat `:h quickfix`.

Anda mungkin memperhatikan bahwa menjalankan grep internal (`:vim`) dapat menjadi lambat jika Anda memiliki banyak kecocokan. Ini karena Vim memuat setiap file yang cocok ke dalam memori, seolah-olah sedang diedit. Jika Vim menemukan sejumlah besar file yang cocok dengan pencarian Anda, ia akan memuat semuanya dan oleh karena itu mengkonsumsi banyak memori.

Mari kita bicarakan tentang grep eksternal. Secara default, ia menggunakan perintah terminal `grep`. Untuk mencari "lunch" di dalam file ruby di dalam direktori `app/controllers/`, Anda dapat melakukan ini:

```shell
:grep -R "lunch" app/controllers/
```

Perhatikan bahwa alih-alih menggunakan `/pattern/`, ia mengikuti sintaks grep terminal `"pattern"`. Ini juga menampilkan semua kecocokan menggunakan `quickfix`.

Vim mendefinisikan variabel `grepprg` untuk menentukan program eksternal mana yang akan dijalankan saat menjalankan perintah Vim `:grep` sehingga Anda tidak perlu menutup Vim dan memanggil perintah terminal `grep`. Nanti, saya akan menunjukkan kepada Anda bagaimana mengubah program default yang dipanggil saat menggunakan perintah Vim `:grep`.

## Menjelajahi File Dengan Netrw

`netrw` adalah penjelajah file bawaan Vim. Ini berguna untuk melihat hierarki proyek. Untuk menjalankan `netrw`, Anda memerlukan dua pengaturan ini di `.vimrc` Anda:

```shell
set nocp
filetype plugin on
```

Karena `netrw` adalah topik yang luas, saya hanya akan membahas penggunaan dasar, tetapi itu seharusnya cukup untuk memulai Anda. Anda dapat memulai `netrw` saat Anda meluncurkan Vim dengan memberikannya direktori sebagai parameter alih-alih file. Misalnya:

```shell
vim .
vim src/client/
vim app/controllers/
```

Untuk meluncurkan `netrw` dari dalam Vim, Anda dapat menggunakan perintah `:edit` dan memberikannya parameter direktori alih-alih nama file:

```shell
:edit .
:edit src/client/
:edit app/controllers/
```

Ada cara lain untuk meluncurkan jendela `netrw` tanpa memberikan direktori:

```shell
:Explore     Memulai netrw pada file saat ini
:Sexplore    Tidak bercanda. Memulai netrw pada setengah atas layar
:Vexplore    Memulai netrw pada setengah kiri layar
```

Anda dapat menavigasi `netrw` dengan gerakan Vim (gerakan akan dibahas secara mendalam di bab selanjutnya). Jika Anda perlu membuat, menghapus, atau mengganti nama file atau direktori, berikut adalah daftar perintah `netrw` yang berguna:

```shell
%    Membuat file baru
d    Membuat direktori baru
R    Mengganti nama file atau direktori
D    Menghapus file atau direktori
```

`:h netrw` sangat komprehensif. Periksa jika Anda memiliki waktu.

Jika Anda menemukan `netrw` terlalu membosankan dan membutuhkan lebih banyak variasi, [vim-vinegar](https://github.com/tpope/vim-vinegar) adalah plugin yang baik untuk meningkatkan `netrw`. Jika Anda mencari penjelajah file yang berbeda, [NERDTree](https://github.com/preservim/nerdtree) adalah alternatif yang baik. Periksa mereka!

## Fzf

Sekarang Anda telah belajar cara mencari file di Vim dengan alat bawaan, mari kita pelajari cara melakukannya dengan plugin.

Satu hal yang benar tentang editor teks modern dan yang tidak dilakukan Vim adalah betapa mudahnya menemukan file, terutama melalui pencarian fuzzy. Di bagian kedua bab ini, saya akan menunjukkan kepada Anda cara menggunakan [fzf.vim](https://github.com/junegunn/fzf.vim) untuk membuat pencarian di Vim menjadi mudah dan kuat.

## Setup

Pertama, pastikan Anda telah mengunduh [fzf](https://github.com/junegunn/fzf) dan [ripgrep](https://github.com/BurntSushi/ripgrep). Ikuti instruksi di repositori github mereka. Perintah `fzf` dan `rg` sekarang harus tersedia setelah instalasi berhasil.

Ripgrep adalah alat pencarian yang mirip dengan grep (itulah sebabnya namanya). Ini umumnya lebih cepat daripada grep dan memiliki banyak fitur berguna. Fzf adalah pencari fuzzy baris perintah serbaguna. Anda dapat menggunakannya dengan perintah apa pun, termasuk ripgrep. Bersama-sama, mereka membuat kombinasi alat pencarian yang kuat.

Fzf tidak menggunakan ripgrep secara default, jadi kita perlu memberi tahu fzf untuk menggunakan ripgrep dengan mendefinisikan variabel `FZF_DEFAULT_COMMAND`. Di `.zshrc` saya (`.bashrc` jika Anda menggunakan bash), saya memiliki ini:

```shell
if type rg &> /dev/null; then
  export FZF_DEFAULT_COMMAND='rg --files'
  export FZF_DEFAULT_OPTS='-m'
fi
```

Perhatikan `-m` di `FZF_DEFAULT_OPTS`. Opsi ini memungkinkan kita untuk melakukan beberapa pilihan dengan `<Tab>` atau `<Shift-Tab>`. Anda tidak memerlukan baris ini untuk membuat fzf bekerja dengan Vim, tetapi saya pikir ini adalah opsi yang berguna untuk dimiliki. Ini akan berguna ketika Anda ingin melakukan pencarian dan penggantian di beberapa file yang akan saya bahas sebentar lagi. Perintah fzf menerima banyak opsi lainnya, tetapi saya tidak akan membahasnya di sini. Untuk mempelajari lebih lanjut, lihat repositori [fzf](https://github.com/junegunn/fzf#usage) atau `man fzf`. Setidaknya Anda harus memiliki `export FZF_DEFAULT_COMMAND='rg'`.

Setelah menginstal fzf dan ripgrep, mari kita atur plugin fzf. Saya menggunakan manajer plugin [vim-plug](https://github.com/junegunn/vim-plug) dalam contoh ini, tetapi Anda dapat menggunakan manajer plugin lainnya.

Tambahkan ini di dalam plugin `.vimrc` Anda. Anda perlu menggunakan plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (dibuat oleh penulis fzf yang sama).

```shell
call plug#begin()
Plug 'junegunn/fzf.vim'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
call plug#end()
```

Setelah menambahkan baris-baris ini, Anda perlu membuka `vim` dan menjalankan `:PlugInstall`. Ini akan menginstal semua plugin yang didefinisikan dalam file `vimrc` Anda dan yang belum diinstal. Dalam kasus kita, ini akan menginstal `fzf.vim` dan `fzf`.

Untuk info lebih lanjut tentang plugin ini, Anda dapat memeriksa repositori [fzf.vim](https://github.com/junegunn/fzf/blob/master/README-VIM.md).
## Sintaks Fzf

Untuk menggunakan fzf secara efisien, Anda harus mempelajari beberapa sintaks dasar fzf. Untungnya, daftarnya singkat:

- `^` adalah pencocokan tepat awalan. Untuk mencari frasa yang dimulai dengan "selamat datang": `^selamat datang`.
- `$` adalah pencocokan tepat akhiran. Untuk mencari frasa yang diakhiri dengan "teman-temanku": `teman-temanku$`.
- `'` adalah pencocokan tepat. Untuk mencari frasa "selamat datang teman-temanku": `'selamat datang teman-temanku`.
- `|` adalah pencocokan "atau". Untuk mencari "teman" atau "musuh": `teman | musuh`.
- `!` adalah pencocokan invers. Untuk mencari frasa yang mengandung "selamat datang" dan tidak "teman": `selamat datang !teman`

Anda dapat mencampur dan mencocokkan opsi ini. Misalnya, `^halo | ^selamat datang teman$` akan mencari frasa yang dimulai dengan "selamat datang" atau "halo" dan diakhiri dengan "teman".

## Mencari File

Untuk mencari file di dalam Vim menggunakan plugin fzf.vim, Anda dapat menggunakan metode `:Files`. Jalankan `:Files` dari Vim dan Anda akan diminta dengan prompt pencarian fzf.

Karena Anda akan sering menggunakan perintah ini, baik untuk memetakan ini ke pintasan keyboard. Saya memetakan saya ke `Ctrl-f`. Di vimrc saya, saya memiliki ini:

```shell
nnoremap <silent> <C-f> :Files<CR>
```

## Mencari di Dalam File

Untuk mencari di dalam file, Anda dapat menggunakan perintah `:Rg`.

Sekali lagi, karena Anda mungkin akan sering menggunakan ini, mari kita petakan ke pintasan keyboard. Saya memetakan saya ke `<Leader>f`. Kunci `<Leader>` secara default dipetakan ke `\`.

```shell
nnoremap <silent> <Leader>f :Rg<CR>
```

## Pencarian Lainnya

Fzf.vim menyediakan banyak perintah pencarian lainnya. Saya tidak akan menjelaskan masing-masing di sini, tetapi Anda dapat memeriksanya [di sini](https://github.com/junegunn/fzf.vim#commands).

Berikut adalah tampilan peta fzf saya:

```shell
nnoremap <silent> <Leader>b :Buffers<CR>
nnoremap <silent> <C-f> :Files<CR>
nnoremap <silent> <Leader>f :Rg<CR>
nnoremap <silent> <Leader>/ :BLines<CR>
nnoremap <silent> <Leader>' :Marks<CR>
nnoremap <silent> <Leader>g :Commits<CR>
nnoremap <silent> <Leader>H :Helptags<CR>
nnoremap <silent> <Leader>hh :History<CR>
nnoremap <silent> <Leader>h: :History:<CR>
nnoremap <silent> <Leader>h/ :History/<CR>
```

## Mengganti Grep Dengan Rg

Seperti yang disebutkan sebelumnya, Vim memiliki dua cara untuk mencari di dalam file: `:vim` dan `:grep`. `:grep` menggunakan alat pencarian eksternal yang dapat Anda tetapkan ulang menggunakan kata kunci `grepprg`. Saya akan menunjukkan kepada Anda bagaimana mengonfigurasi Vim untuk menggunakan ripgrep alih-alih grep terminal saat menjalankan perintah `:grep`.

Sekarang mari kita atur `grepprg` sehingga perintah `:grep` di Vim menggunakan ripgrep. Tambahkan ini di vimrc Anda:

```shell
set grepprg=rg\ --vimgrep\ --smart-case\ --follow
```

Silakan modifikasi beberapa opsi di atas! Untuk informasi lebih lanjut tentang apa arti opsi di atas, periksa `man rg`.

Setelah Anda memperbarui `grepprg`, sekarang ketika Anda menjalankan `:grep`, ia menjalankan `rg --vimgrep --smart-case --follow` alih-alih `grep`. Jika Anda ingin mencari "donat" menggunakan ripgrep, Anda sekarang dapat menjalankan perintah yang lebih singkat `:grep "donat"` alih-alih `:grep "donat" . -R`

Sama seperti `:grep` yang lama, `:grep` baru ini juga menggunakan quickfix untuk menampilkan hasil.

Anda mungkin bertanya, "Baiklah, ini bagus tetapi saya tidak pernah menggunakan `:grep` di Vim, ditambah lagi tidak bisakah saya hanya menggunakan `:Rg` untuk menemukan frasa di dalam file? Kapan saya akan perlu menggunakan `:grep`?

Itu adalah pertanyaan yang sangat baik. Anda mungkin perlu menggunakan `:grep` di Vim untuk melakukan pencarian dan penggantian di beberapa file, yang akan saya bahas selanjutnya.

## Pencarian dan Penggantian di Beberapa File

Editor teks modern seperti VSCode sangat memudahkan untuk mencari dan mengganti string di beberapa file. Di bagian ini, saya akan menunjukkan kepada Anda dua metode berbeda untuk melakukannya dengan mudah di Vim.

Metode pertama adalah mengganti *semua* frasa yang cocok di proyek Anda. Anda perlu menggunakan `:grep`. Jika Anda ingin mengganti semua instance "pizza" dengan "donat", berikut yang harus Anda lakukan:

```shell
:grep "pizza"
:cfdo %s/pizza/donut/g | update
```

Mari kita uraikan perintahnya:

1. `:grep pizza` menggunakan ripgrep untuk mencari semua instance "pizza" (omong-omong, ini tetap akan bekerja bahkan jika Anda tidak menetapkan ulang `grepprg` untuk menggunakan ripgrep. Anda harus melakukan `:grep "pizza" . -R` alih-alih `:grep "pizza"`).
2. `:cfdo` mengeksekusi perintah apa pun yang Anda berikan ke semua file dalam daftar quickfix Anda. Dalam hal ini, perintah Anda adalah perintah substitusi `%s/pizza/donut/g`. Pipa (`|`) adalah operator rantai. Perintah `update` menyimpan setiap file setelah substitusi. Saya akan membahas perintah substitusi lebih dalam di bab selanjutnya.

Metode kedua adalah mencari dan mengganti di file yang dipilih. Dengan metode ini, Anda dapat memilih secara manual file mana yang ingin Anda lakukan pilih-dan-ganti. Berikut adalah yang harus Anda lakukan:

1. Kosongkan buffer Anda terlebih dahulu. Sangat penting bahwa daftar buffer Anda hanya berisi file yang ingin Anda terapkan penggantian. Anda dapat memulai ulang Vim atau menjalankan perintah `:%bd | e#` (`%bd` menghapus semua buffer dan `e#` membuka file yang baru saja Anda buka).
2. Jalankan `:Files`.
3. Pilih semua file yang ingin Anda lakukan pencarian dan penggantian. Untuk memilih beberapa file, gunakan `<Tab>` / `<Shift-Tab>`. Ini hanya mungkin jika Anda memiliki flag multiple (`-m`) di `FZF_DEFAULT_OPTS`.
4. Jalankan `:bufdo %s/pizza/donut/g | update`. Perintah `:bufdo %s/pizza/donut/g | update` terlihat mirip dengan perintah sebelumnya `:cfdo %s/pizza/donut/g | update`. Perbedaannya adalah alih-alih mengganti semua entri quickfix (`:cfdo`), Anda mengganti semua entri buffer (`:bufdo`).

## Pelajari Pencarian Dengan Cara Cerdas

Mencari adalah inti dari pengeditan teks. Mempelajari cara mencari dengan baik di Vim akan meningkatkan alur kerja pengeditan teks Anda secara signifikan.

Fzf.vim adalah pengubah permainan. Saya tidak bisa membayangkan menggunakan Vim tanpanya. Saya pikir sangat penting untuk memiliki alat pencarian yang baik saat memulai Vim. Saya telah melihat orang berjuang untuk beralih ke Vim karena tampaknya kehilangan fitur penting yang dimiliki editor teks modern, seperti fitur pencarian yang mudah dan kuat. Saya harap bab ini akan membantu Anda membuat transisi ke Vim lebih mudah.

Anda juga baru saja melihat kemampuan ekstensi Vim dalam aksi - kemampuan untuk memperluas fungsionalitas pencarian dengan plugin dan program eksternal. Di masa depan, ingatlah fitur lain apa yang ingin Anda perluas di Vim. Kemungkinan besar, itu sudah ada di Vim, seseorang telah membuat plugin atau sudah ada program untuk itu. Selanjutnya, Anda akan belajar tentang topik yang sangat penting di Vim: tata bahasa Vim.