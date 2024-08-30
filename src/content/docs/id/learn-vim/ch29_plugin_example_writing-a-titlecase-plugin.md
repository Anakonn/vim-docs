---
description: Panduan ini membahas plugin Vim "totitle-vim" yang otomatis mengubah
  teks menjadi format title case, membantu penulisan judul yang lebih baik.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Ketika Anda mulai mahir menggunakan Vim, Anda mungkin ingin menulis plugin Anda sendiri. Saya baru-baru ini menulis plugin Vim pertama saya, [totitle-vim](https://github.com/iggredible/totitle-vim). Ini adalah plugin operator titlecase, mirip dengan operator huruf besar `gU`, huruf kecil `gu`, dan togglecase `g~` di Vim.

Dalam bab ini, saya akan mempresentasikan rincian dari plugin `totitle-vim`. Saya berharap dapat memberikan sedikit pencerahan tentang prosesnya dan mungkin menginspirasi Anda untuk membuat plugin unik Anda sendiri!

## Masalah

Saya menggunakan Vim untuk menulis artikel saya, termasuk panduan ini.

Salah satu masalah utama adalah membuat huruf besar yang tepat untuk judul. Salah satu cara untuk mengotomatiskan ini adalah dengan mengkapitalisasi setiap kata di header dengan `g/^#/ s/\<./\u\0/g`. Untuk penggunaan dasar, perintah ini sudah cukup baik, tetapi masih tidak sebaik memiliki huruf besar yang sebenarnya. Kata "The" dan "Of" dalam "Capitalize The First Letter Of Each Word" seharusnya dikapitalisasi. Tanpa kapitalisasi yang tepat, kalimat terlihat sedikit aneh.

Pada awalnya, saya tidak berencana untuk menulis plugin. Ternyata ada plugin titlecase yang sudah ada: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Namun, ada beberapa hal yang tidak berfungsi seperti yang saya inginkan. Yang utama adalah perilaku mode visual blok. Jika saya memiliki frasa:

```shell
test title one
test title two
test title three
```

Jika saya menggunakan sorotan visual blok pada "tle":

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Jika saya menekan `gt`, plugin tidak akan mengkapitalisasinya. Saya merasa ini tidak konsisten dengan perilaku `gu`, `gU`, dan `g~`. Jadi saya memutuskan untuk bekerja dari repositori plugin titlecase itu dan menggunakannya untuk membuat plugin titlecase saya sendiri yang konsisten dengan `gu`, `gU`, dan `g~`!. Sekali lagi, plugin vim-titlecase itu sendiri adalah plugin yang sangat baik dan layak digunakan sendiri (sebenarnya, mungkin di dalam hati saya hanya ingin menulis plugin Vim saya sendiri. Saya tidak benar-benar melihat fitur titlecasing blok digunakan begitu sering dalam kehidupan nyata selain dari kasus tepi).

### Perencanaan untuk Plugin

Sebelum menulis baris kode pertama, saya perlu memutuskan apa saja aturan titlecase. Saya menemukan tabel yang rapi tentang berbagai aturan kapitalisasi dari situs [titlecaseconverter](https://titlecaseconverter.com/rules/). Apakah Anda tahu bahwa ada setidaknya 8 aturan kapitalisasi yang berbeda dalam bahasa Inggris? *Gasp!*

Pada akhirnya, saya menggunakan penyebut umum dari daftar itu untuk menghasilkan aturan dasar yang cukup baik untuk plugin. Selain itu, saya ragu orang akan mengeluh, "Hei, kamu menggunakan AMA, mengapa kamu tidak menggunakan APA?". Berikut adalah aturan dasar:
- Kata pertama selalu dikapitalisasi.
- Beberapa kata keterangan, konjungsi, dan preposisi ditulis dengan huruf kecil.
- Jika kata input sepenuhnya dikapitalisasi, maka jangan lakukan apa-apa (itu bisa jadi singkatan).

Adapun kata-kata mana yang ditulis dengan huruf kecil, aturan yang berbeda memiliki daftar yang berbeda. Saya memutuskan untuk tetap menggunakan `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Perencanaan untuk Antarmuka Pengguna

Saya ingin plugin ini menjadi operator untuk melengkapi operator kasus yang ada di Vim: `gu`, `gU`, dan `g~`. Sebagai operator, ia harus menerima baik gerakan atau objek teks (`gtw` harus mengkapitalisasi kata berikutnya, `gtiw` harus mengkapitalisasi kata dalam, `gt$` harus mengkapitalisasi kata dari lokasi saat ini hingga akhir baris, `gtt` harus mengkapitalisasi baris saat ini, `gti(` harus mengkapitalisasi kata-kata di dalam tanda kurung, dll). Saya juga ingin agar itu dipetakan ke `gt` untuk memudahkan mnemonik. Selain itu, itu juga harus berfungsi dengan semua mode visual: `v`, `V`, dan `Ctrl-V`. Saya harus bisa menyorotnya dalam *mode* visual *apa pun*, menekan `gt`, maka semua teks yang disorot akan dikapitalisasi.

## Runtime Vim

Hal pertama yang Anda lihat ketika melihat repositori adalah bahwa ia memiliki dua direktori: `plugin/` dan `doc/`. Ketika Anda memulai Vim, ia mencari file dan direktori khusus di dalam direktori `~/.vim` dan menjalankan semua file skrip di dalam direktori itu. Untuk lebih jelasnya, tinjau bab Runtime Vim.

Plugin ini memanfaatkan dua direktori runtime Vim: `doc/` dan `plugin/`. `doc/` adalah tempat untuk menempatkan dokumentasi bantuan (sehingga Anda dapat mencari kata kunci nanti, seperti `:h totitle`). Saya akan membahas cara membuat halaman bantuan nanti. Untuk saat ini, mari kita fokus pada `plugin/`. Direktori `plugin/` dieksekusi sekali saat Vim dinyalakan. Ada satu file di dalam direktori ini: `totitle.vim`. Penamaan tidak masalah (saya bisa menamakannya `whatever.vim` dan itu tetap akan berfungsi). Semua kode yang bertanggung jawab agar plugin ini berfungsi ada di dalam file ini.

## Pemetaan

Mari kita lihat kode!

Di awal file, Anda memiliki:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Ketika Anda memulai Vim, `g:totitle_default_keys` belum ada, jadi `!exists(...)` mengembalikan true. Dalam hal ini, definisikan `g:totitle_default_keys` untuk sama dengan 1. Di Vim, 0 adalah falsy dan non-zero adalah truthy (gunakan 1 untuk menunjukkan truthy).

Mari kita lompat ke bagian bawah file. Anda akan melihat ini:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Di sinilah pemetaan utama `gt` didefinisikan. Dalam hal ini, pada saat Anda sampai pada kondisi `if` di bagian bawah file, `if g:totitle_default_keys` akan mengembalikan 1 (truthy), jadi Vim melakukan pemetaan berikut:
- `nnoremap <expr> gt ToTitle()` memetakan *operator* mode normal. Ini memungkinkan Anda menjalankan operator + gerakan/objek-teks seperti `gtw` untuk mengkapitalisasi kata berikutnya atau `gtiw` untuk mengkapitalisasi kata dalam. Saya akan membahas rincian tentang cara kerja pemetaan operator nanti.
- `xnoremap <expr> gt ToTitle()` memetakan operator mode visual. Ini memungkinkan Anda untuk mengkapitalisasi teks yang disorot secara visual.
- `nnoremap <expr> gtt ToTitle() .. '_'` memetakan operator baris mode normal (sebanding dengan `guu` dan `gUU`). Anda mungkin bertanya-tanya apa yang dilakukan `.. '_'` di akhir. `..` adalah operator interpolasi string di Vim. `_` digunakan sebagai gerakan dengan operator. Jika Anda melihat di `:help _`, dikatakan bahwa garis bawah digunakan untuk menghitung 1 baris ke bawah. Ini melakukan operator pada baris saat ini (cobalah dengan operator lain, coba jalankan `gU_` atau `d_`, perhatikan bahwa itu melakukan hal yang sama dengan `gUU` atau `dd`).
- Akhirnya, argumen `<expr>` memungkinkan Anda untuk menentukan hitungan, jadi Anda dapat melakukan `3gtw` untuk mengubah kasus tiga kata berikutnya.

Bagaimana jika Anda tidak ingin menggunakan pemetaan `gt` default? Lagipula, Anda sedang menimpa pemetaan default `gt` Vim (tab berikutnya). Bagaimana jika Anda ingin menggunakan `gz` sebagai pengganti `gt`? Ingat sebelumnya bagaimana Anda melalui kesulitan memeriksa `if !exists('g:totitle_default_keys')` dan `if g:totitle_default_keys`? Jika Anda menempatkan `let g:totitle_default_keys = 0` di vimrc Anda, maka `g:totitle_default_keys` sudah ada ketika plugin dijalankan (kode di vimrc Anda dieksekusi sebelum file runtime `plugin/`), jadi `!exists('g:totitle_default_keys')` mengembalikan false. Selain itu, `if g:totitle_default_keys` akan menjadi falsy (karena akan memiliki nilai 0), jadi itu juga tidak akan melakukan pemetaan `gt`! Ini secara efektif memungkinkan Anda untuk mendefinisikan pemetaan kustom Anda sendiri di Vimrc.

Untuk mendefinisikan pemetaan titlecase Anda sendiri ke `gz`, tambahkan ini di vimrc Anda:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Mudah sekali.

## Fungsi ToTitle

Fungsi `ToTitle()` adalah fungsi terpanjang di file ini.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " panggil ini saat memanggil fungsi ToTitle()
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " simpan pengaturan saat ini
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " ketika pengguna memanggil operasi blok
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " ketika pengguna memanggil operasi karakter atau baris
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " kembalikan pengaturan
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Ini sangat panjang, jadi mari kita bagi. 

*Saya bisa merombak ini menjadi bagian-bagian yang lebih kecil, tetapi demi menyelesaikan bab ini, saya biarkan seperti ini.*
## Fungsi Operator

Berikut adalah bagian pertama dari kode:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

Apa sih `opfunc` itu? Kenapa mengembalikan `g@`?

Vim memiliki operator khusus, fungsi operator, `g@`. Operator ini memungkinkan Anda untuk menggunakan *fungsi apa pun* yang ditetapkan pada opsi `opfunc`. Jika saya memiliki fungsi `Foo()` yang ditetapkan pada `opfunc`, maka ketika saya menjalankan `g@w`, saya menjalankan `Foo()` pada kata berikutnya. Jika saya menjalankan `g@i(`, maka saya menjalankan `Foo()` pada tanda kurung dalam. Fungsi operator ini sangat penting untuk membuat operator Vim Anda sendiri.

Baris berikut menetapkan `opfunc` ke fungsi `ToTitle`.

```shell
set opfunc=ToTitle
```

Baris berikutnya secara harfiah mengembalikan `g@`:

```shell
return g@
```

Jadi, bagaimana kedua baris ini bekerja dan mengapa mengembalikan `g@`?

Mari kita anggap Anda memiliki pemetaan berikut:

```shell
nnoremap <expr> gt ToTitle()`
```

Kemudian Anda menekan `gtw` (mengubah kata berikutnya menjadi huruf kapital). Pertama kali Anda menjalankan `gtw`, Vim memanggil metode `ToTitle()`. Tetapi saat ini `opfunc` masih kosong. Anda juga tidak memberikan argumen apa pun ke `ToTitle()`, jadi ia akan memiliki nilai `a:type` dari `''`. Ini menyebabkan ekspresi kondisional memeriksa argumen `a:type`, `if a:type ==# ''`, menjadi benar. Di dalamnya, Anda menetapkan `opfunc` ke fungsi `ToTitle` dengan `set opfunc=ToTitle`. Sekarang `opfunc` ditetapkan ke `ToTitle`. Akhirnya, setelah Anda menetapkan `opfunc` ke fungsi `ToTitle`, Anda mengembalikan `g@`. Saya akan menjelaskan mengapa itu mengembalikan `g@` di bawah ini.

Anda belum selesai. Ingat, Anda baru saja menekan `gtw`. Menekan `gt` melakukan semua hal di atas, tetapi Anda masih memiliki `w` untuk diproses. Dengan mengembalikan `g@`, pada titik ini, Anda sekarang secara teknis memiliki `g@w` (ini sebabnya Anda memiliki `return g@`). Karena `g@` adalah operator fungsi, Anda meneruskan gerakan `w` kepadanya. Jadi Vim, setelah menerima `g@w`, memanggil `ToTitle` *sekali lagi* (jangan khawatir, Anda tidak akan terjebak dalam loop tak terbatas seperti yang akan Anda lihat sebentar lagi).

Sebagai ringkasan, dengan menekan `gtw`, Vim memeriksa apakah `opfunc` kosong atau tidak. Jika kosong, maka Vim akan menetapkannya dengan `ToTitle`. Kemudian mengembalikan `g@`, pada dasarnya memanggil `ToTitle` sekali lagi sehingga Anda sekarang dapat menggunakannya sebagai operator. Ini adalah bagian tersulit dari membuat operator kustom dan Anda berhasil! Selanjutnya, Anda perlu membangun logika untuk `ToTitle()` agar benar-benar mengubah input menjadi huruf kapital.

## Memproses Input

Sekarang Anda memiliki `gt` berfungsi sebagai operator yang mengeksekusi `ToTitle()`. Tapi apa yang harus Anda lakukan selanjutnya? Bagaimana Anda benar-benar mengubah teks menjadi huruf kapital?

Setiap kali Anda menjalankan operator apa pun di Vim, ada tiga jenis gerakan aksi yang berbeda: karakter, baris, dan blok. `g@w` (kata) adalah contoh operasi karakter. `g@j` (satu baris di bawah) adalah contoh operasi baris. Operasi blok jarang terjadi, tetapi biasanya ketika Anda melakukan operasi `Ctrl-V` (blok visual), itu akan dihitung sebagai operasi blok. Operasi yang menargetkan beberapa karakter maju / mundur umumnya dianggap sebagai operasi karakter (`b`, `e`, `w`, `ge`, dll). Operasi yang menargetkan beberapa baris ke bawah / ke atas umumnya dianggap sebagai operasi baris (`j`, `k`). Operasi yang menargetkan kolom maju, mundur, ke atas, atau ke bawah umumnya dianggap sebagai operasi blok (biasanya mereka adalah gerakan paksa kolumnar atau mode visual blok; untuk lebih lanjut: `:h forced-motion`).

Ini berarti, jika Anda menekan `g@w`, `g@` akan meneruskan string literal `"char"` sebagai argumen ke `ToTitle()`. Jika Anda melakukan `g@j`, `g@` akan meneruskan string literal `"line"` sebagai argumen ke `ToTitle()`. String ini adalah yang akan diteruskan ke fungsi `ToTitle` sebagai argumen `type`.

## Membuat Operator Fungsi Kustom Anda Sendiri

Mari kita berhenti sejenak dan bermain dengan `g@` dengan menulis fungsi dummy:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Sekarang tetapkan fungsi itu ke `opfunc` dengan menjalankan:

```shell
:set opfunc=Test
```

Operator `g@` akan mengeksekusi `Test(some_arg)` dan meneruskannya dengan `"char"`, `"line"`, atau `"block"` tergantung pada operasi yang Anda lakukan. Jalankan berbagai operasi seperti `g@iw` (kata dalam), `g@j` (satu baris di bawah), `g@$` (hingga akhir baris), dll. Lihat nilai berbeda yang dipanggil. Untuk menguji operasi blok, Anda dapat menggunakan gerakan paksa Vim untuk operasi blok: `g@Ctrl-Vj` (operasi blok satu kolom di bawah).

Anda juga dapat menggunakannya dengan mode visual. Gunakan berbagai sorotan visual seperti `v`, `V`, dan `Ctrl-V` lalu tekan `g@` (peringatan, itu akan berkedip cepat output echo, jadi Anda perlu memiliki mata yang cepat - tetapi echo pasti ada. Juga, karena Anda menggunakan `echom`, Anda dapat memeriksa pesan echo yang direkam dengan `:messages`).

Sangat keren, bukan? Hal-hal yang dapat Anda program dengan Vim! Kenapa ini tidak diajarkan di sekolah? Mari kita lanjutkan dengan plugin kita.

## ToTitle Sebagai Fungsi

Melanjutkan ke beberapa baris berikutnya:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Baris ini sebenarnya tidak ada hubungannya dengan perilaku `ToTitle()` sebagai operator, tetapi untuk mengaktifkannya menjadi fungsi TitleCase yang dapat dipanggil (ya, saya tahu bahwa saya melanggar Prinsip Tanggung Jawab Tunggal). Motivasi di baliknya adalah, Vim memiliki fungsi bawaan `toupper()` dan `tolower()` yang akan mengubah huruf besar dan kecil dari string yang diberikan. Contoh: `:echo toupper('hello')` mengembalikan `'HELLO'` dan `:echo tolower('HELLO')` mengembalikan `'hello'`. Saya ingin plugin ini memiliki kemampuan untuk menjalankan `ToTitle` sehingga Anda dapat melakukan `:echo ToTitle('once upon a time')` dan mendapatkan nilai kembali `'Once Upon a Time'`.

Sekarang, Anda tahu bahwa ketika Anda memanggil `ToTitle(type)` dengan `g@`, argumen `type` akan memiliki nilai `'block'`, `'line'`, atau `'char'`. Jika argumen tersebut bukan `'block'`, `'line'`, atau `'char'`, Anda dapat dengan aman mengasumsikan bahwa `ToTitle()` dipanggil di luar `g@`. Dalam hal ini, Anda membaginya berdasarkan spasi (`\s\+`) dengan:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Kemudian mengkapitalisasi setiap elemen:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Sebelum menggabungkannya kembali:

```shell
l:wordsArr->join(' ')
```

Fungsi `capitalize()` akan dibahas nanti.

## Variabel Sementara

Beberapa baris berikutnya:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Baris-baris ini menyimpan berbagai keadaan saat ini ke dalam variabel sementara. Nanti dalam ini Anda akan menggunakan mode visual, tanda, dan register. Melakukan ini akan mengubah beberapa keadaan. Karena Anda tidak ingin merevisi sejarah, Anda perlu menyimpannya ke dalam variabel sementara sehingga Anda dapat mengembalikan keadaan tersebut nanti.
## Mengkapitalisasi Pilihan

Baris-baris berikut ini penting:

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
Mari kita bahas dalam potongan kecil. Baris ini:

```shell
set clipboard= selection=inclusive
```

Anda pertama-tama mengatur opsi `selection` menjadi inklusif dan `clipboard` menjadi kosong. Atribut pemilihan biasanya digunakan dengan mode visual dan ada tiga nilai yang mungkin: `old`, `inclusive`, dan `exclusive`. Mengaturnya menjadi inklusif berarti karakter terakhir dari pemilihan termasuk. Saya tidak akan membahasnya di sini, tetapi intinya adalah memilih untuk menjadi inklusif membuatnya berperilaku konsisten dalam mode visual. Secara default, Vim mengaturnya menjadi inklusif, tetapi Anda mengaturnya di sini juga untuk berjaga-jaga jika salah satu plugin Anda mengaturnya ke nilai yang berbeda. Lihat `:h 'clipboard'` dan `:h 'selection'` jika Anda penasaran apa yang sebenarnya mereka lakukan.

Selanjutnya, Anda memiliki hash yang terlihat aneh diikuti dengan perintah eksekusi:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Pertama, sintaks `#{}` adalah tipe data kamus di Vim. Variabel lokal `l:commands` adalah hash dengan 'lines', 'char', dan 'block' sebagai kuncinya. Perintah `silent exe '...'` mengeksekusi perintah apa pun di dalam string secara diam-diam (jika tidak, itu akan menampilkan notifikasi di bagian bawah layar Anda).

Kedua, perintah yang dieksekusi adalah `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. Yang pertama, `noautocmd`, akan mengeksekusi perintah berikutnya tanpa memicu perintah otomatis. Yang kedua, `keepjumps`, adalah untuk tidak mencatat pergerakan kursor saat bergerak. Di Vim, gerakan tertentu secara otomatis dicatat dalam daftar perubahan, daftar loncatan, dan daftar tanda. Ini mencegah hal itu. Tujuan memiliki `noautocmd` dan `keepjumps` adalah untuk mencegah efek samping. Akhirnya, perintah `normal` mengeksekusi string sebagai perintah normal. `..` adalah sintaks interpolasi string di Vim. `get()` adalah metode pengambil yang menerima baik daftar, blob, atau kamus. Dalam hal ini, Anda mengoper kamus `l:commands`. Kuncinya adalah `a:type`. Anda telah belajar sebelumnya bahwa `a:type` adalah salah satu dari tiga nilai string: 'char', 'line', atau 'block'. Jadi jika `a:type` adalah 'line', Anda akan mengeksekusi `"noautocmd keepjumps normal! '[V']y"` (untuk lebih lanjut, lihat `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal`, dan `:h get()`).

Mari kita lihat apa yang dilakukan `'[V']y`. Pertama, anggaplah Anda memiliki tubuh teks ini:

```shell
the second breakfast
is better than the first breakfast
```
Anggaplah kursor Anda berada di baris pertama. Kemudian Anda menekan `g@j` (menjalankan fungsi operator, `g@`, satu baris di bawah, dengan `j`). `'[` memindahkan kursor ke awal teks yang sebelumnya diubah atau disalin. Meskipun secara teknis Anda tidak mengubah atau menyalin teks apa pun dengan `g@j`, Vim mengingat lokasi awal dan akhir gerakan perintah `g@` dengan `'[` dan `']` (untuk lebih lanjut, lihat `:h g@`). Dalam kasus Anda, menekan `'[` memindahkan kursor Anda ke baris pertama karena di situlah Anda mulai saat menjalankan `g@`. `V` adalah perintah mode visual baris. Akhirnya, `']` memindahkan kursor Anda ke akhir teks yang sebelumnya diubah atau disalin, tetapi dalam hal ini, itu memindahkan kursor Anda ke akhir operasi `g@` terakhir Anda. Akhirnya, `y` menyalin teks yang dipilih.

Apa yang baru saja Anda lakukan adalah menyalin tubuh teks yang sama yang Anda lakukan `g@` pada.

Jika Anda melihat dua perintah lainnya di sini:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Semua melakukan tindakan serupa, kecuali alih-alih menggunakan aksi baris, Anda akan menggunakan aksi karakter atau blok. Saya akan terdengar berulang, tetapi dalam ketiga kasus Anda secara efektif menyalin tubuh teks yang sama yang Anda lakukan `g@` pada.

Mari kita lihat baris berikutnya:

```shell
let l:selected_phrase = getreg('"')
```

Baris ini mengambil konten dari register tanpa nama (`"`) dan menyimpannya di dalam variabel `l:selected_phrase`. Tunggu sebentar... bukankah Anda baru saja menyalin tubuh teks? Register tanpa nama saat ini berisi teks yang baru saja Anda salin. Inilah cara plugin ini dapat mendapatkan salinan teks tersebut.

Baris berikutnya adalah pola ekspresi reguler:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` dan `\>` adalah pola batas kata. Karakter yang mengikuti `\<` mencocokkan awal kata dan karakter yang mendahului `\>` mencocokkan akhir kata. `\k` adalah pola kata kunci. Anda dapat memeriksa karakter apa yang diterima Vim sebagai kata kunci dengan `:set iskeyword?`. Ingat bahwa gerakan `w` di Vim memindahkan kursor Anda secara kata. Vim datang dengan pemahaman yang sudah ada sebelumnya tentang apa itu "kata kunci" (Anda bahkan dapat mengeditnya dengan mengubah opsi `iskeyword`). Lihat `:h /\<`, `:h /\>`, dan `:h /\k`, serta `:h 'iskeyword'` untuk lebih lanjut. Akhirnya, `*` berarti nol atau lebih dari pola berikutnya.

Dalam gambaran besar, `'\<\k*\>'` mencocokkan sebuah kata. Jika Anda memiliki string:

```shell
one two three
```

Mencocokkannya dengan pola akan memberi Anda tiga kecocokan: "one", "two", dan "three".

Akhirnya, Anda memiliki pola lain:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Ingat bahwa perintah substitusi Vim dapat digunakan dengan ekspresi dengan `\={your-expression}`. Misalnya, jika Anda ingin mengubah huruf besar string "donut" di baris saat ini, Anda dapat menggunakan fungsi `toupper()` dari Vim. Anda dapat mencapainya dengan menjalankan `:%s/donut/\=toupper(submatch(0))/g`. `submatch(0)` adalah ekspresi khusus yang digunakan dalam perintah substitusi. Ini mengembalikan seluruh teks yang cocok.

Dua baris berikutnya:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

Ekspresi `line()` mengembalikan nomor baris. Di sini Anda mengoper dengan tanda `'<`, yang mewakili baris pertama dari area visual yang terakhir dipilih. Ingat bahwa Anda menggunakan mode visual untuk menyalin teks. `'<` mengembalikan nomor baris dari awal pemilihan area visual tersebut. Ekspresi `virtcol()` mengembalikan nomor kolom dari kursor saat ini. Anda akan memindahkan kursor Anda ke mana-mana sebentar lagi, jadi Anda perlu menyimpan lokasi kursor Anda agar Anda dapat kembali ke sini nanti.

Ambil jeda di sini dan tinjau semuanya sejauh ini. Pastikan Anda masih mengikuti. Ketika Anda siap, mari kita lanjutkan.
## Menangani Operasi Blok

Mari kita bahas bagian ini:

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Saatnya untuk benar-benar mengkapitalisasi teks Anda. Ingat bahwa Anda memiliki `a:type` yang bisa berupa 'char', 'line', atau 'block'. Dalam banyak kasus, Anda mungkin akan mendapatkan 'char' dan 'line'. Namun terkadang Anda mungkin mendapatkan blok. Ini jarang terjadi, tetapi tetap harus ditangani. Sayangnya, menangani blok tidak semudah menangani char dan line. Ini akan membutuhkan sedikit usaha ekstra, tetapi bisa dilakukan.

Sebelum Anda mulai, mari kita ambil contoh bagaimana Anda mungkin mendapatkan sebuah blok. Anggaplah Anda memiliki teks ini:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner
```

Anggaplah kursor Anda berada di "c" pada "pancake" di baris pertama. Anda kemudian menggunakan blok visual (`Ctrl-V`) untuk memilih ke bawah dan maju untuk memilih "cake" di ketiga baris:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner
```

Ketika Anda menekan `gt`, Anda ingin mendapatkan:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

```
Berikut adalah asumsi dasar Anda: ketika Anda menyoroti tiga "cake" dalam "pancakes", Anda memberi tahu Vim bahwa Anda memiliki tiga baris kata yang ingin Anda soroti. Kata-kata ini adalah "cake", "cake", dan "cake". Anda mengharapkan untuk mendapatkan "Cake", "Cake", dan "Cake".

Mari kita lanjutkan ke detail implementasi. Beberapa baris berikut memiliki:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

Baris pertama:

```shell
sil! keepj norm! gv"ad
```

Ingat bahwa `sil!` berjalan secara diam-diam dan `keepj` menjaga riwayat lompatan saat bergerak. Anda kemudian mengeksekusi perintah normal `gv"ad`. `gv` memilih teks yang terakhir disorot secara visual (dalam contoh pancake, ini akan menyoroti kembali ketiga 'cake'). `"ad` menghapus teks yang disorot secara visual dan menyimpannya di register a. Akibatnya, Anda sekarang memiliki:

```shell
pan for breakfast
pan for lunch
pan for dinner
```

Sekarang Anda memiliki 3 *blok* (bukan baris) 'cake' yang disimpan di register a. Perbedaan ini penting. Mengambil teks dengan mode visual baris berbeda dari mengambil teks dengan mode visual blok. Ingat ini karena Anda akan melihatnya lagi nanti.

Selanjutnya Anda memiliki:

```shell
keepj $
keepj pu_
```

`$` memindahkan Anda ke baris terakhir di file Anda. `pu_` menyisipkan satu baris di bawah tempat kursor Anda berada. Anda ingin menjalankannya dengan `keepj` sehingga Anda tidak mengubah riwayat lompatan.

Kemudian Anda menyimpan nomor baris dari baris terakhir Anda (`line("$")`) di variabel lokal `lastLine`.

```shell
let l:lastLine = line("$")
```

Kemudian tempel konten dari register dengan `norm "ap`.

```shell
sil! keepj norm "ap
```

Ingat bahwa ini terjadi di baris baru yang Anda buat di bawah baris terakhir file - Anda saat ini berada di bagian bawah file. Menempel memberi Anda teks *blok* ini:

```shell
cake
cake
cake
```

Selanjutnya, Anda menyimpan lokasi baris saat ini di mana kursor Anda berada.

```shell
let l:curLine = line(".")
```

Sekarang mari kita lihat beberapa baris berikut:

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Baris ini:

```shell
sil! keepj norm! VGg@
```

`VG` secara visual menyoroti mereka dengan mode visual baris dari baris saat ini hingga akhir file. Jadi di sini Anda menyoroti tiga blok teks 'cake' dengan sorotan baris (ingat perbedaan blok vs baris). Perhatikan bahwa saat pertama kali Anda menempelkan tiga teks "cake", Anda menempelkannya sebagai blok. Sekarang Anda menyorotnya sebagai baris. Mereka mungkin terlihat sama dari luar, tetapi secara internal, Vim tahu perbedaan antara menempelkan blok teks dan menempelkan baris teks.

```shell
cake
cake
cake
```

`g@` adalah operator fungsi, jadi Anda pada dasarnya melakukan panggilan rekursif ke dirinya sendiri. Tapi kenapa? Apa yang dicapai dengan ini?

Anda membuat panggilan rekursif ke `g@` dan memberikannya semua 3 baris (setelah menjalankannya dengan `V`, Anda sekarang memiliki baris, bukan blok) dari teks 'cake' sehingga akan ditangani oleh bagian lain dari kode (Anda akan membahas ini nanti). Hasil dari menjalankan `g@` adalah tiga baris teks yang telah dikapitalisasi dengan benar:

```shell
Cake
Cake
Cake
```

Baris berikutnya:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Ini menjalankan perintah mode normal untuk pergi ke awal baris (`0`), menggunakan sorotan visual blok untuk pergi ke baris terakhir dan karakter terakhir di baris itu (`<c-v>G$`). `h` adalah untuk menyesuaikan kursor (ketika melakukan `$` Vim bergerak satu baris ekstra ke kanan). Akhirnya, Anda menghapus teks yang disorot dan menyimpannya di register a (`"ad`).

Baris berikutnya:

```shell
exe "keepj " . l:startLine
```

Anda memindahkan kursor Anda kembali ke tempat `startLine` berada.

Selanjutnya:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

Berada di lokasi `startLine`, Anda sekarang melompat ke kolom yang ditandai oleh `startCol`. `\<bar>\` adalah gerakan bar `|`. Gerakan bar di Vim memindahkan kursor Anda ke kolom ke-n (katakanlah `startCol` adalah 4. Menjalankan `4|` akan membuat kursor Anda melompat ke posisi kolom 4). Ingat bahwa `startCol` adalah lokasi di mana Anda menyimpan posisi kolom dari teks yang ingin Anda kapitalisasi. Akhirnya, `"aP` menempelkan teks yang disimpan di register a. Ini menempatkan teks kembali ke tempatnya sebelum dihapus.

Mari kita lihat 4 baris berikutnya:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` memindahkan kursor Anda kembali ke lokasi `lastLine` dari sebelumnya. `sil! keepj norm! "_dG` menghapus ruang ekstra yang dibuat menggunakan register blackhole (`"_dG`) sehingga register tanpa nama Anda tetap bersih. `exe "keepj " . l:startLine` memindahkan kursor Anda kembali ke `startLine`. Akhirnya, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` memindahkan kursor Anda ke kolom `startCol`.

Ini adalah semua tindakan yang bisa Anda lakukan secara manual di Vim. Namun, manfaat mengubah tindakan ini menjadi fungsi yang dapat digunakan kembali adalah bahwa mereka akan menyelamatkan Anda dari menjalankan 30+ baris instruksi setiap kali Anda perlu mengkapitalisasi sesuatu. Yang perlu diingat di sini adalah, apa pun yang dapat Anda lakukan secara manual di Vim, Anda dapat mengubahnya menjadi fungsi yang dapat digunakan kembali, sehingga menjadi plugin!

Berikut adalah bagaimana tampilannya.

Diberikan beberapa teks:

```shell
pancake for breakfast
pancake for lunch
pancake for dinner

... beberapa teks
```

Pertama, Anda menyoroti secara visual dengan cara blok:

```shell
pan[cake] for breakfast
pan[cake] for lunch
pan[cake] for dinner

... beberapa teks
```

Kemudian Anda menghapusnya dan menyimpan teks itu di register a:

```shell
pan for breakfast
pan for lunch
pan for dinner

... beberapa teks
```

Kemudian Anda menempelkannya di bagian bawah file:

```shell
pan for breakfast
pan for lunch
pan for dinner

... beberapa teks
cake
cake
cake
```

Kemudian Anda mengkapitalisasinya:

```shell
pan for breakfast
pan for lunch
pan for dinner

... beberapa teks
Cake
Cake
Cake
```

Akhirnya, Anda menempatkan teks yang telah dikapitalisasi kembali:

```shell
panCake for breakfast
panCake for lunch
panCake for dinner

... beberapa teks
```

## Menangani Operasi Baris dan Karakter

Anda belum selesai. Anda baru saja menangani kasus tepi ketika Anda menjalankan `gt` pada teks blok. Anda masih perlu menangani operasi 'line' dan 'char'. Mari kita lihat kode `else` untuk melihat bagaimana ini dilakukan.

Berikut adalah kodenya:

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

Mari kita bahas mereka baris demi baris. Rahasia dari plugin ini sebenarnya ada di baris ini:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` berisi teks dari register tanpa nama yang akan dikapitalisasi. `l:WORD_PATTERN` adalah pencocokan kata individu. `l:UPCASE_REPLACEMENT` adalah panggilan ke perintah `capitalize()` (yang akan Anda lihat nanti). `'g'` adalah flag global yang menginstruksikan perintah substitusi untuk mengganti semua kata yang diberikan, bukan hanya kata pertama.

Baris berikutnya:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Ini menjamin bahwa kata pertama akan selalu dikapitalisasi. Jika Anda memiliki frasa seperti "an apple a day keeps the doctor away", karena kata pertama, "an", adalah kata khusus, perintah substitusi Anda tidak akan mengkapitalisasinya. Anda memerlukan metode yang selalu mengkapitalisasi karakter pertama tidak peduli apa pun. Fungsi ini melakukan hal itu (Anda akan melihat detail fungsi ini nanti). Hasil dari metode kapitalisasi ini disimpan di variabel lokal `l:titlecased`.

Baris berikutnya:

```shell
call setreg('"', l:titlecased)
```

Ini menempatkan string yang telah dikapitalisasi ke dalam register tanpa nama (`"`).

Selanjutnya, dua baris berikut:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Hei, itu terlihat akrab! Anda telah melihat pola serupa sebelumnya dengan `l:commands`. Alih-alih yank, di sini Anda menggunakan paste (`p`). Periksa bagian sebelumnya di mana saya membahas `l:commands` untuk penyegaran.

Akhirnya, dua baris berikut:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Anda memindahkan kursor Anda kembali ke baris dan kolom tempat Anda mulai. Itu saja!

Mari kita ringkas. Metode substitusi di atas cukup pintar untuk mengkapitalisasi teks yang diberikan dan melewati kata-kata khusus (lebih lanjut tentang ini nanti). Setelah Anda memiliki string yang telah dikapitalisasi, Anda menyimpannya di register tanpa nama. Kemudian Anda menyoroti secara visual teks yang sama persis yang Anda operasikan `g@` sebelumnya, lalu menempel dari register tanpa nama (ini secara efektif menggantikan teks yang tidak dikapitalisasi dengan versi yang telah dikapitalisasi). Akhirnya, Anda memindahkan kursor Anda kembali ke tempat Anda mulai.
## Pembersihan

Anda secara teknis sudah selesai. Teks sekarang sudah menggunakan huruf kapital di awal. Yang tersisa adalah mengembalikan register dan pengaturan.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Ini mengembalikan:
- register yang tidak bernama.
- tanda `<` dan `>`.
- opsi `'clipboard'` dan `'selection'`.

Wah, Anda sudah selesai. Itu adalah fungsi yang panjang. Saya bisa membuat fungsi tersebut lebih pendek dengan memecahnya menjadi yang lebih kecil, tetapi untuk saat ini, itu sudah cukup. Sekarang mari kita bahas secara singkat fungsi kapitalisasi.

## Fungsi Kapitalisasi

Di bagian ini, mari kita bahas fungsi `s:capitalize()`. Inilah tampilan fungsi tersebut:

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

Ingat bahwa argumen untuk fungsi `capitalize()`, `a:string`, adalah kata individu yang diteruskan oleh operator `g@`. Jadi jika saya menjalankan `gt` pada teks "pancake for breakfast", `ToTitle` akan memanggil `capitalize(string)` *tiga* kali, sekali untuk "pancake", sekali untuk "for", dan sekali untuk "breakfast".

Bagian pertama dari fungsi adalah:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

Kondisi pertama (`toupper(a:string) ==# a:string`) memeriksa apakah versi huruf besar dari argumen sama dengan string dan apakah string itu sendiri adalah "A". Jika ini benar, maka kembalikan string tersebut. Ini didasarkan pada asumsi bahwa jika sebuah kata sudah sepenuhnya dalam huruf besar, maka itu adalah singkatan. Misalnya, kata "CEO" sebaliknya akan diubah menjadi "Ceo". Hmm, CEO Anda tidak akan senang. Jadi sebaiknya biarkan kata yang sepenuhnya dalam huruf besar tetap seperti itu. Kondisi kedua, `a:string != 'A'`, menangani kasus tepi untuk karakter "A" yang dikapitalisasi. Jika `a:string` sudah merupakan "A" yang dikapitalisasi, itu akan secara tidak sengaja lolos dari tes `toupper(a:string) ==# a:string`. Karena "a" adalah artikel tak tentu dalam bahasa Inggris, itu perlu ditulis dengan huruf kecil.

Bagian berikutnya memaksa string untuk ditulis dengan huruf kecil:

```shell
let l:str = tolower(a:string)
```

Bagian berikutnya adalah regex dari daftar semua pengecualian kata. Saya mendapatkannya dari https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

Bagian berikutnya:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Pertama, periksa apakah string Anda adalah bagian dari daftar kata yang dikecualikan (`l:exclusions`). Jika iya, jangan kapitalisasi. Kemudian periksa apakah string Anda adalah bagian dari daftar pengecualian lokal (`s:local_exclusion_list`). Daftar pengecualian ini adalah daftar kustom yang dapat ditambahkan pengguna di vimrc (jika pengguna memiliki persyaratan tambahan untuk kata-kata khusus).

Bagian terakhir mengembalikan versi kata yang dikapitalisasi. Karakter pertama ditulis dengan huruf besar sementara sisanya tetap seperti semula.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Mari kita bahas fungsi kapitalisasi kedua. Fungsi ini terlihat seperti ini:

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

Fungsi ini dibuat untuk menangani kasus tepi jika Anda memiliki kalimat yang dimulai dengan kata yang dikecualikan, seperti "an apple a day keeps the doctor away". Berdasarkan aturan kapitalisasi bahasa Inggris, semua kata pertama dalam sebuah kalimat, terlepas dari apakah itu kata khusus atau tidak, harus dikapitalisasi. Dengan perintah `substitute()` Anda saja, "an" dalam kalimat Anda akan ditulis dengan huruf kecil. Anda perlu memaksa karakter pertama untuk ditulis dengan huruf besar.

Dalam fungsi `capitalizeFirstWord` ini, argumen `a:string` bukanlah kata individu seperti `a:string` di dalam fungsi `capitalize`, tetapi seluruh teks. Jadi jika Anda memiliki "pancake for breakfast", nilai `a:string` adalah "pancake for breakfast". Itu hanya menjalankan `capitalizeFirstWord` sekali untuk seluruh teks.

Satu skenario yang perlu Anda perhatikan adalah jika Anda memiliki string multi-baris seperti `"an apple a day\nkeeps the doctor away"`. Anda ingin menulis huruf besar pada karakter pertama dari semua baris. Jika Anda tidak memiliki newline, maka cukup tulis huruf besar pada karakter pertama.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Jika Anda memiliki newline, Anda perlu menulis huruf besar pada semua karakter pertama di setiap baris, jadi Anda memisahkan mereka menjadi array yang dipisahkan oleh newline:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Kemudian Anda memetakan setiap elemen dalam array dan menulis huruf besar pada kata pertama dari setiap elemen:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Akhirnya, Anda menggabungkan elemen-elemen array tersebut:

```shell
return l:lineArr->join("\n")
```

Dan Anda sudah selesai!

## Dokumen

Direktori kedua dalam repositori adalah direktori `docs/`. Sangat baik untuk menyediakan dokumentasi yang menyeluruh untuk plugin. Di bagian ini, saya akan membahas secara singkat cara membuat dokumen plugin Anda sendiri.

Direktori `docs/` adalah salah satu jalur runtime khusus Vim. Vim membaca semua file di dalam `docs/`, jadi ketika Anda mencari kata kunci khusus dan kata kunci itu ditemukan di salah satu file di direktori `docs/`, itu akan ditampilkan di halaman bantuan. Di sini Anda memiliki `totitle.txt`. Saya menamainya seperti itu karena itu adalah nama plugin, tetapi Anda dapat menamainya sesuka Anda.

File dokumen Vim pada dasarnya adalah file txt. Perbedaan antara file txt biasa dan file bantuan Vim adalah bahwa yang terakhir menggunakan sintaks "bantuan" khusus. Tetapi pertama-tama, Anda perlu memberi tahu Vim untuk memperlakukannya bukan sebagai jenis file teks, tetapi sebagai jenis file `help`. Untuk memberi tahu Vim untuk menginterpretasikan `totitle.txt` ini sebagai file *bantuan*, jalankan `:set ft=help` (`:h 'filetype'` untuk lebih lanjut). Ngomong-ngomong, jika Anda ingin memberi tahu Vim untuk menginterpretasikan `totitle.txt` ini sebagai file txt *biasa*, jalankan `:set ft=txt`.

### Sintaks Khusus File Bantuan

Untuk membuat kata kunci dapat ditemukan, kelilingi kata kunci tersebut dengan asterisk. Untuk membuat kata kunci `totitle` dapat ditemukan ketika pengguna mencari `:h totitle`, tulis sebagai `*totitle*` di file bantuan.

Sebagai contoh, saya memiliki baris-baris ini di atas daftar isi saya:

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

// lebih banyak stuff TOC
```

Perhatikan bahwa saya menggunakan dua kata kunci: `*totitle*` dan `*totitle-toc*` untuk menandai bagian daftar isi. Anda dapat menggunakan sebanyak mungkin kata kunci sesuai keinginan. Ini berarti bahwa setiap kali Anda mencari `:h totitle` atau `:h totitle-toc`, Vim akan membawa Anda ke lokasi ini.

Berikut adalah contoh lain, di suatu tempat di bawah file:

```shell
2. Penggunaan                                                       *totitle-usage*

// penggunaan
```

Jika Anda mencari `:h totitle-usage`, Vim akan membawa Anda ke bagian ini.

Anda juga dapat menggunakan tautan internal untuk merujuk ke bagian lain dalam file bantuan dengan mengelilingi kata kunci dengan sintaks bar `|`. Di bagian TOC, Anda melihat kata kunci yang dikelilingi oleh bar, seperti `|totitle-intro|`, `|totitle-usage|`, dll.

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

    1. Intro ........................... |totitle-intro|
    2. Penggunaan ........................... |totitle-usage|
    3. Kata yang akan dikapitalisasi ............. |totitle-words|
    4. Operator ........................ |totitle-operator|
    5. Ikatan Kunci ..................... |totitle-keybinding|
    6. Bug ............................ |totitle-bug-report|
    7. Kontribusi .................... |totitle-contributing|
    8. Kredit ......................... |totitle-credits|

```
Ini memungkinkan Anda melompat ke definisi. Jika Anda meletakkan kursor di suatu tempat pada `|totitle-intro|` dan menekan `Ctrl-]`, Vim akan melompat ke definisi kata tersebut. Dalam hal ini, itu akan melompat ke lokasi `*totitle-intro*`. Inilah cara Anda dapat menautkan ke kata kunci yang berbeda dalam dokumen bantuan.

Tidak ada cara yang benar atau salah untuk menulis file dokumen di Vim. Jika Anda melihat berbagai plugin oleh berbagai penulis, banyak dari mereka menggunakan format yang berbeda. Intinya adalah membuat dokumen bantuan yang mudah dipahami untuk pengguna Anda.

Akhirnya, jika Anda menulis plugin Anda sendiri secara lokal terlebih dahulu dan ingin menguji halaman dokumentasi, cukup menambahkan file txt di dalam `~/.vim/docs/` tidak akan secara otomatis membuat kata kunci Anda dapat dicari. Anda perlu memberi tahu Vim untuk menambahkan halaman dokumen Anda. Jalankan perintah helptags: `:helptags ~/.vim/doc` untuk membuat file tag baru. Sekarang Anda dapat mulai mencari kata kunci Anda.

## Kesimpulan

Anda telah sampai di akhir! Bab ini adalah penggabungan dari semua bab Vimscript. Di sini Anda akhirnya menerapkan apa yang telah Anda pelajari sejauh ini. Semoga setelah membaca ini, Anda tidak hanya memahami cara membuat plugin Vim, tetapi juga terinspirasi untuk menulis plugin Anda sendiri.

Setiap kali Anda menemukan diri Anda mengulangi urutan tindakan yang sama berkali-kali, Anda harus mencoba untuk membuatnya sendiri! Dikatakan bahwa Anda tidak boleh menciptakan kembali roda. Namun, saya pikir bisa bermanfaat untuk menciptakan kembali roda demi pembelajaran. Bacalah plugin orang lain. Buat ulang mereka. Pelajari dari mereka. Tulis milik Anda sendiri! Siapa tahu, mungkin Anda akan menulis plugin luar biasa dan super populer berikutnya setelah membaca ini. Mungkin Anda akan menjadi Tim Pope legendaris berikutnya. Ketika itu terjadi, beri tahu saya!