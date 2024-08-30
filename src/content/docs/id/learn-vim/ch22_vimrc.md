---
description: Panduan ini menjelaskan cara mengorganisir dan mengonfigurasi vimrc,
  serta bagaimana Vim menemukan file vimrc di berbagai lokasi.
title: Ch22. Vimrc
---

Dalam bab-bab sebelumnya, Anda telah belajar cara menggunakan Vim. Dalam bab ini, Anda akan belajar cara mengatur dan mengonfigurasi vimrc.

## Bagaimana Vim Menemukan Vimrc

Kebijaksanaan konvensional untuk vimrc adalah menambahkan file dot `.vimrc` di direktori home `~/.vimrc` (ini mungkin berbeda tergantung pada OS Anda).

Di balik layar, Vim melihat ke beberapa tempat untuk file vimrc. Berikut adalah tempat-tempat yang diperiksa Vim:
- `$VIMINIT`
- `$HOME/.vimrc`
- `$HOME/.vim/vimrc`
- `$EXINIT`
- `$HOME/.exrc`
- `$VIMRUNTIME/defaults.vim`

Ketika Anda memulai Vim, ia akan memeriksa enam lokasi di atas dalam urutan itu untuk file vimrc. File vimrc yang ditemukan pertama akan digunakan dan sisanya diabaikan.

Pertama, Vim akan mencari `$VIMINIT`. Jika tidak ada di sana, Vim akan memeriksa `$HOME/.vimrc`. Jika tidak ada di sana, Vim akan memeriksa `$HOME/.vim/vimrc`. Jika Vim menemukannya, ia akan berhenti mencari dan menggunakan `$HOME/.vim/vimrc`.

Lokasi pertama, `$VIMINIT`, adalah variabel lingkungan. Secara default, ini tidak terdefinisi. Jika Anda ingin menggunakan `~/dotfiles/testvimrc` sebagai nilai `$VIMINIT` Anda, Anda dapat membuat variabel lingkungan yang berisi jalur dari vimrc tersebut. Setelah Anda menjalankan `export VIMINIT='let $MYVIMRC="$HOME/dotfiles/testvimrc" | source $MYVIMRC'`, Vim sekarang akan menggunakan `~/dotfiles/testvimrc` sebagai file vimrc Anda.

Lokasi kedua, `$HOME/.vimrc`, adalah jalur konvensional untuk banyak pengguna Vim. `$HOME` dalam banyak kasus adalah direktori home Anda (`~`). Jika Anda memiliki file `~/.vimrc`, Vim akan menggunakan ini sebagai file vimrc Anda.

Ketiga, `$HOME/.vim/vimrc`, terletak di dalam direktori `~/.vim`. Anda mungkin sudah memiliki direktori `~/.vim` untuk plugin, skrip kustom, atau file View. Perhatikan bahwa tidak ada titik dalam nama file vimrc (`$HOME/.vim/.vimrc` tidak akan berfungsi, tetapi `$HOME/.vim/vimrc` akan).

Keempat, `$EXINIT` berfungsi mirip dengan `$VIMINIT`.

Kelima, `$HOME/.exrc` berfungsi mirip dengan `$HOME/.vimrc`.

Keenam, `$VIMRUNTIME/defaults.vim` adalah vimrc default yang disertakan dengan build Vim Anda. Dalam kasus saya, saya memiliki Vim 8.2 yang diinstal menggunakan Homebrew, jadi jalur saya adalah (`/usr/local/share/vim/vim82`). Jika Vim tidak menemukan salah satu dari enam file vimrc sebelumnya, ia akan menggunakan file ini.

Untuk sisa bab ini, saya mengasumsikan bahwa vimrc menggunakan jalur `~/.vimrc`.

## Apa yang Harus Dimasukkan ke Dalam Vimrc Saya?

Sebuah pertanyaan yang saya ajukan ketika saya mulai adalah, "Apa yang harus saya masukkan ke dalam vimrc saya?"

Jawabannya adalah, "apa pun yang Anda inginkan". Godaan untuk menyalin-paste vimrc orang lain adalah nyata, tetapi Anda harus menahannya. Jika Anda bersikeras untuk menggunakan vimrc orang lain, pastikan Anda tahu apa yang dilakukannya, mengapa dan bagaimana dia menggunakannya, dan yang terpenting, apakah itu relevan untuk Anda. Hanya karena seseorang menggunakannya tidak berarti Anda juga akan menggunakannya.

## Konten Dasar Vimrc

Secara singkat, vimrc adalah kumpulan dari:
- Plugin
- Pengaturan
- Fungsi Kustom
- Perintah Kustom
- Pemetaan

Ada hal lain yang tidak disebutkan di atas, tetapi secara umum, ini mencakup sebagian besar kasus penggunaan.

### Plugin

Dalam bab-bab sebelumnya, saya telah menyebutkan berbagai plugin, seperti [fzf.vim](https://github.com/junegunn/fzf.vim), [vim-mundo](https://github.com/simnalamburt/vim-mundo), dan [vim-fugitive](https://github.com/tpope/vim-fugitive).

Sepuluh tahun yang lalu, mengelola plugin adalah mimpi buruk. Namun, dengan munculnya manajer plugin modern, menginstal plugin sekarang dapat dilakukan dalam hitungan detik. Saat ini saya menggunakan [vim-plug](https://github.com/junegunn/vim-plug) sebagai manajer plugin saya, jadi saya akan menggunakannya di bagian ini. Konsepnya harus mirip dengan manajer plugin populer lainnya. Saya sangat merekomendasikan Anda untuk memeriksa yang berbeda, seperti:
- [vundle.vim](https://github.com/VundleVim/Vundle.vim)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)
- [dein.vim](https://github.com/Shougo/dein.vim)

Ada lebih banyak manajer plugin daripada yang terdaftar di atas, silakan lihat-lihat. Untuk menginstal vim-plug, jika Anda memiliki mesin Unix, jalankan:

```shell
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

Untuk menambahkan plugin baru, letakkan nama plugin Anda (`Plug 'github-username/repository-name'`) di antara baris `call plug#begin()` dan `call plug#end()`. Jadi jika Anda ingin menginstal `emmet-vim` dan `nerdtree`, letakkan potongan berikut di vimrc Anda:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Simpan perubahan, sumber (`:source %`), dan jalankan `:PlugInstall` untuk menginstalnya.

Di masa depan jika Anda perlu menghapus plugin yang tidak terpakai, Anda hanya perlu menghapus nama plugin dari blok `call`, simpan dan sumber, dan jalankan perintah `:PlugClean` untuk menghapusnya dari mesin Anda.

Vim 8 memiliki manajer paket bawaan sendiri. Anda dapat memeriksa `:h packages` untuk informasi lebih lanjut. Di bab berikutnya, saya akan menunjukkan kepada Anda cara menggunakannya.

### Pengaturan

Adalah hal yang umum untuk melihat banyak opsi `set` di setiap vimrc. Jika Anda menjalankan perintah set dari mode command-line, itu tidak permanen. Anda akan kehilangannya ketika Anda menutup Vim. Misalnya, alih-alih menjalankan `:set relativenumber number` dari mode Command-line setiap kali Anda menjalankan Vim, Anda cukup menempatkan ini di dalam vimrc:

```shell
set relativenumber number
```

Beberapa pengaturan memerlukan Anda untuk memberikan nilai, seperti `set tabstop=2`. Periksa halaman bantuan untuk setiap pengaturan untuk mempelajari jenis nilai apa yang diterima.

Anda juga dapat menggunakan `let` sebagai pengganti `set` (pastikan untuk menambahkannya dengan `&`). Dengan `let`, Anda dapat menggunakan ekspresi sebagai nilai. Misalnya, untuk mengatur opsi `'dictionary'` ke jalur hanya jika jalur tersebut ada:

```shell
let s:english_dict = "/usr/share/dict/words"

if filereadable(s:english_dict)
  let &dictionary=s:english_dict
endif
```

Anda akan belajar tentang penugasan dan kondisi Vimscript di bab-bab selanjutnya.

Untuk daftar semua opsi yang mungkin di Vim, periksa `:h E355`.

### Fungsi Kustom

Vimrc adalah tempat yang baik untuk fungsi kustom. Anda akan belajar cara menulis fungsi Vimscript Anda sendiri di bab selanjutnya.

### Perintah Kustom

Anda dapat membuat perintah Command-line kustom dengan `command`.

Untuk membuat perintah dasar `GimmeDate` untuk menampilkan tanggal hari ini:

```shell
:command! GimmeDate echo call("strftime", ["%F"])
```

Ketika Anda menjalankan `:GimmeDate`, Vim akan menampilkan tanggal seperti "2021-01-1".

Untuk membuat perintah dasar dengan input, Anda dapat menggunakan `<args>`. Jika Anda ingin memberikan format waktu/tanggal tertentu ke `GimmeDate`:

```shell
:command! GimmeDate echo call("strftime", [<args>])

:GimmeDate "%F"
" 2020-01-01

:GimmeDate "%H:%M"
" 11:30
```

Jika Anda ingin membatasi jumlah argumen, Anda dapat memberikan flag `-nargs`. Gunakan `-nargs=0` untuk tidak memberikan argumen, `-nargs=1` untuk memberikan satu argumen, `-nargs=+` untuk memberikan setidaknya satu argumen, `-nargs=*` untuk memberikan jumlah argumen berapa pun, dan `-nargs=?` untuk memberikan 0 atau satu argumen. Jika Anda ingin memberikan argumen ke-n, gunakan `-nargs=n` (di mana `n` adalah bilangan bulat).

`<args>` memiliki dua varian: `<f-args>` dan `<q-args>`. Yang pertama digunakan untuk memberikan argumen ke fungsi Vimscript. Yang terakhir digunakan untuk secara otomatis mengonversi input pengguna menjadi string.

Menggunakan `args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <args>
:Hello "Iggy"
" mengembalikan 'Hello Iggy'

:Hello Iggy
" Kesalahan variabel tidak terdefinisi
```

Menggunakan `q-args`:

```shell
:command! -nargs=1 Hello echo "Hello " . <q-args>
:Hello Iggy
" mengembalikan 'Hello Iggy'
```

Menggunakan `f-args`:

```shell
:function! PrintHello(person1, person2)
:  echo "Hello " . a:person1 . " dan " . a:person2
:endfunction

:command! -nargs=* Hello call PrintHello(<f-args>)

:Hello Iggy1 Iggy2
" mengembalikan "Hello Iggy1 dan Iggy2"
```

Fungsi-fungsi di atas akan lebih masuk akal setelah Anda sampai di bab fungsi Vimscript.

Untuk mempelajari lebih lanjut tentang perintah dan argumen, periksa `:h command` dan `:args`.
### Peta

Jika Anda mendapati diri Anda berulang kali melakukan tugas kompleks yang sama, itu adalah indikator yang baik bahwa Anda harus membuat pemetaan untuk tugas tersebut.

Sebagai contoh, saya memiliki dua pemetaan ini di vimrc saya:

```shell
nnoremap <silent> <C-f> :GFiles<CR>

nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Pada yang pertama, saya memetakan `Ctrl-F` ke perintah `:Gfiles` dari plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (mencari file Git dengan cepat). Pada yang kedua, saya memetakan `<Leader>tn` untuk memanggil fungsi kustom `ToggleNumber` (mengalihkan opsi `norelativenumber` dan `relativenumber`). Pemetaan `Ctrl-F` menimpa scroll halaman asli Vim. Pemetaan Anda akan menimpa kontrol Vim jika terjadi tabrakan. Karena saya hampir tidak pernah menggunakan fitur itu, saya memutuskan bahwa aman untuk menimpanya.

Omong-omong, apa itu "tombol pemimpin" dalam `<Leader>tn`?

Vim memiliki tombol pemimpin untuk membantu dengan pemetaan. Misalnya, saya memetakan `<Leader>tn` untuk menjalankan fungsi `ToggleNumber()`. Tanpa tombol pemimpin, saya akan menggunakan `tn`, tetapi Vim sudah memiliki `t` (navigasi pencarian "till"). Dengan tombol pemimpin, saya sekarang dapat menekan tombol yang ditetapkan sebagai pemimpin, lalu `tn` tanpa mengganggu perintah yang ada. Tombol pemimpin adalah tombol yang dapat Anda atur untuk memulai kombinasi pemetaan Anda. Secara default, Vim menggunakan backslash sebagai tombol pemimpin (jadi `<Leader>tn` menjadi "backslash-t-n").

Saya pribadi suka menggunakan `<Space>` sebagai tombol pemimpin daripada default backslash. Untuk mengubah tombol pemimpin Anda, tambahkan ini di vimrc Anda:

```shell
let mapleader = "\<space>"
```

Perintah `nnoremap` yang digunakan di atas dapat dipecah menjadi tiga bagian:
- `n` mewakili mode normal.
- `nore` berarti non-rekursif.
- `map` adalah perintah pemetaan.

Setidaknya, Anda bisa menggunakan `nmap` sebagai pengganti `nnoremap` (`nmap <silent> <C-f> :Gfiles<CR>`). Namun, adalah praktik yang baik untuk menggunakan varian non-rekursif untuk menghindari potensi loop tak terbatas.

Berikut adalah apa yang bisa terjadi jika Anda tidak memetakan secara non-rekursif. Misalkan Anda ingin menambahkan pemetaan ke `B` untuk menambahkan titik koma di akhir baris, lalu kembali satu WORD (ingat bahwa `B` di Vim adalah kunci navigasi mode normal untuk kembali satu WORD).

```shell
nmap B A;<esc>B
```

Ketika Anda menekan `B`... oh tidak! Vim menambahkan `;` tanpa kendali (interupsi dengan `Ctrl-C`). Mengapa itu terjadi? Karena dalam pemetaan `A;<esc>B`, `B` tidak merujuk pada fungsi asli `B` di Vim (kembali satu WORD), tetapi merujuk pada fungsi yang dipetakan. Apa yang Anda miliki sebenarnya adalah ini:

```shell
A;<esc>A;<esc>A;<esc>A;esc>...
```

Untuk menyelesaikan masalah ini, Anda perlu menambahkan pemetaan non-rekursif:

```shell
nnoremap B A;<esc>B
```

Sekarang coba panggil `B` lagi. Kali ini berhasil menambahkan `;` di akhir baris dan kembali satu WORD. `B` dalam pemetaan ini mewakili fungsionalitas asli `B` di Vim.

Vim memiliki pemetaan yang berbeda untuk mode yang berbeda. Jika Anda ingin membuat pemetaan untuk mode sisip untuk keluar dari mode sisip ketika Anda menekan `jk`:

```shell
inoremap jk <esc>
```

Mode pemetaan lainnya adalah: `map` (Normal, Visual, Select, dan Operator-pending), `vmap` (Visual dan Select), `smap` (Select), `xmap` (Visual), `omap` (Operator-pending), `map!` (Insert dan Command-line), `lmap` (Insert, Command-line, Lang-arg), `cmap` (Command-line), dan `tmap` (terminal-job). Saya tidak akan membahasnya secara detail. Untuk belajar lebih lanjut, lihat `:h map.txt`.

Buat pemetaan yang paling intuitif, konsisten, dan mudah diingat.

## Mengorganisir Vimrc

Seiring waktu, vimrc Anda akan tumbuh besar dan menjadi rumit. Ada dua cara untuk menjaga vimrc Anda tetap bersih:
- Pisahkan vimrc Anda menjadi beberapa file.
- Lipat file vimrc Anda.

### Memisahkan Vimrc Anda

Anda dapat memisahkan vimrc Anda ke beberapa file menggunakan perintah `source` Vim. Perintah ini membaca perintah baris perintah dari argumen file yang diberikan.

Mari kita buat file di dalam direktori `~/.vim` dan menamakannya `/settings` (`~/.vim/settings`). Nama itu sendiri bersifat sewenang-wenang dan Anda dapat menamakannya sesuka hati.

Anda akan memisahkannya menjadi empat komponen:
- Plugin pihak ketiga (`~/.vim/settings/plugins.vim`).
- Pengaturan umum (`~/.vim/settings/configs.vim`).
- Fungsi kustom (`~/.vim/settings/functions.vim`).
- Pemetaan kunci (`~/.vim/settings/mappings.vim`).

Di dalam `~/.vimrc`:

```shell
source $HOME/.vim/settings/plugins.vim
source $HOME/.vim/settings/configs.vim
source $HOME/.vim/settings/functions.vim
source $HOME/.vim/settings/mappings.vim
```

Anda dapat mengedit file-file ini dengan menempatkan kursor Anda di bawah jalur dan menekan `gf`.

Di dalam `~/.vim/settings/plugins.vim`:

```shell
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
```

Di dalam `~/.vim/settings/configs.vim`:

```shell
set nocompatible
set relativenumber
set number
```

Di dalam `~/.vim/settings/functions.vim`:

```shell
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
```

Di dalam `~/.vim/settings/mappings.vim`:

```shell
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
```

Vimrc Anda seharusnya berfungsi seperti biasa, tetapi sekarang hanya sepanjang empat baris!

Dengan pengaturan ini, Anda dengan mudah tahu ke mana harus pergi. Jika Anda perlu menambahkan lebih banyak pemetaan, tambahkan ke file `/mappings.vim`. Di masa depan, Anda selalu dapat menambahkan lebih banyak direktori saat vimrc Anda tumbuh. Misalnya, jika Anda perlu membuat pengaturan untuk skema warna Anda, Anda dapat menambahkan `~/.vim/settings/themes.vim`.

### Menjaga Satu File Vimrc

Jika Anda lebih suka menjaga satu file vimrc agar tetap portabel, Anda dapat menggunakan lipatan penanda untuk menjaga keteraturan. Tambahkan ini di bagian atas vimrc Anda:

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}
```

Vim dapat mendeteksi jenis file apa yang dimiliki buffer saat ini (`:set filetype?`). Jika itu adalah jenis file `vim`, Anda dapat menggunakan metode lipatan penanda. Ingat bahwa lipatan penanda menggunakan `{{{` dan `}}}` untuk menunjukkan lipatan awal dan akhir.

Tambahkan lipatan `{{{` dan `}}}` ke sisa vimrc Anda (jangan lupa untuk memberi komentar dengan `"`):

```shell
" setup folds {{{
augroup filetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker
augroup END
" }}}

" plugins {{{
call plug#begin('~/.vim/plugged')
  Plug 'mattn/emmet-vim'
  Plug 'preservim/nerdtree'
call plug#end()
" }}}

" configs {{{
set nocompatible
set relativenumber
set number
" }}}

" functions {{{
function! ToggleNumber()
  if(&relativenumber == 1)
    set norelativenumber
  else
    set relativenumber
  endif
endfunc
" }}}

" mappings {{{
inoremap jk <esc>
nnoremap <silent> <C-f> :GFiles<CR>
nnoremap <Leader>tn :call ToggleNumber()<CR>
" }}}
```

Vimrc Anda seharusnya terlihat seperti ini:

```shell
+-- 6 baris: setup folds -----

+-- 6 baris: plugins ---------

+-- 5 baris: configs ---------

+-- 9 baris: functions -------

+-- 5 baris: mappings --------
```

## Menjalankan Vim Dengan atau Tanpa Vimrc dan Plugin

Jika Anda perlu menjalankan Vim tanpa vimrc dan plugin, jalankan:

```shell
vim -u NONE
```

Jika Anda perlu meluncurkan Vim tanpa vimrc tetapi dengan plugin, jalankan:

```shell
vim -u NORC
```

Jika Anda perlu menjalankan Vim dengan vimrc tetapi tanpa plugin, jalankan:

```shell
vim --noplugin
```

Jika Anda perlu menjalankan Vim dengan vimrc *yang berbeda*, katakanlah `~/.vimrc-backup`, jalankan:

```shell
vim -u ~/.vimrc-backup
```

Jika Anda perlu menjalankan Vim hanya dengan `defaults.vim` dan tanpa plugin, yang berguna untuk memperbaiki vimrc yang rusak, jalankan:

```shell
vim --clean
```

## Mengonfigurasi Vimrc dengan Cara Cerdas

Vimrc adalah komponen penting dari kustomisasi Vim. Cara yang baik untuk mulai membangun vimrc Anda adalah dengan membaca vimrc orang lain dan secara bertahap membangunnya seiring waktu. Vimrc terbaik bukanlah yang digunakan oleh pengembang X, tetapi yang disesuaikan tepat untuk memenuhi kerangka berpikir dan gaya pengeditan Anda.