---
description: Dokumen ini menjelaskan penggunaan tipe data Vimscript untuk menulis
  program dasar, termasuk operator relasional, kondisi, dan loop.
title: Ch26. Vimscript Conditionals and Loops
---

Setelah mempelajari apa itu tipe data dasar, langkah selanjutnya adalah mempelajari cara menggabungkannya untuk mulai menulis program dasar. Program dasar terdiri dari kondisi dan loop.

Dalam bab ini, Anda akan belajar bagaimana menggunakan tipe data Vimscript untuk menulis kondisi dan loop.

## Operator Relasional

Operator relasional Vimscript mirip dengan banyak bahasa pemrograman:

```shell
a == b		sama dengan
a != b		tidak sama dengan
a >  b		lebih besar dari
a >= b		lebih besar dari atau sama dengan
a <  b		kurang dari
a <= b		kurang dari atau sama dengan
```

Sebagai contoh:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Ingat bahwa string diubah menjadi angka dalam ekspresi aritmatika. Di sini Vim juga mengubah string menjadi angka dalam ekspresi kesetaraan. "5foo" diubah menjadi 5 (benar):

```shell
:echo 5 == "5foo"
" mengembalikan true
```

Ingat juga bahwa jika Anda memulai string dengan karakter non-numerik seperti "foo5", string tersebut diubah menjadi angka 0 (salah).

```shell
echo 5 == "foo5"
" mengembalikan false
```

### Operator Logika String

Vim memiliki lebih banyak operator relasional untuk membandingkan string:

```shell
a =~ b
a !~ b
```

Sebagai contoh:

```shell
let str = "sarapan yang lezat"

echo str =~ "sarapan"
" mengembalikan true

echo str =~ "makan malam"
" mengembalikan false

echo str !~ "makan malam"
" mengembalikan true
```

Operator `=~` melakukan pencocokan regex terhadap string yang diberikan. Dalam contoh di atas, `str =~ "sarapan"` mengembalikan true karena `str` *mengandung* pola "sarapan". Anda selalu dapat menggunakan `==` dan `!=`, tetapi menggunakan mereka akan membandingkan ekspresi terhadap seluruh string. `=~` dan `!~` adalah pilihan yang lebih fleksibel.

```shell
echo str == "sarapan"
" mengembalikan false

echo str == "sarapan yang lezat"
" mengembalikan true
```

Mari kita coba yang ini. Perhatikan huruf kapital "S":

```shell
echo str =~ "Sarapan"
" true
```

Ini mengembalikan true meskipun "Sarapan" ditulis dengan huruf kapital. Menarik... Ternyata pengaturan Vim saya diatur untuk mengabaikan huruf besar/kecil (`set ignorecase`), jadi ketika Vim memeriksa kesetaraan, ia menggunakan pengaturan Vim saya dan mengabaikan huruf besar/kecil. Jika saya mematikan pengabaian huruf besar/kecil (`set noignorecase`), perbandingan sekarang mengembalikan false.

```shell
set noignorecase
echo str =~ "Sarapan"
" mengembalikan false karena huruf besar/kecil penting

set ignorecase
echo str =~ "Sarapan"
" mengembalikan true karena huruf besar/kecil tidak penting
```

Jika Anda menulis plugin untuk orang lain, ini adalah situasi yang rumit. Apakah pengguna menggunakan `ignorecase` atau `noignorecase`? Anda pasti *tidak* ingin memaksa pengguna Anda untuk mengubah opsi pengabaian huruf besar/kecil mereka. Jadi, apa yang harus Anda lakukan?

Untungnya, Vim memiliki operator yang dapat *selalu* mengabaikan atau mencocokkan huruf besar/kecil. Untuk selalu mencocokkan huruf besar/kecil, tambahkan `#` di akhir.

```shell
set ignorecase
echo str =~# "sarapan"
" mengembalikan true

echo str =~# "SARApan"
" mengembalikan false

set noignorecase
echo str =~# "sarapan"
" true

echo str =~# "SARApan"
" false

echo str !~# "SARApan"
" true
```

Untuk selalu mengabaikan huruf besar/kecil saat membandingkan, tambahkan `?`:

```shell
set ignorecase
echo str =~? "sarapan"
" true

echo str =~? "SARApan"
" true

set noignorecase
echo str =~? "sarapan"
" true

echo str =~? "SARApan"
" true

echo str !~? "SARApan"
" false
```

Saya lebih suka menggunakan `#` untuk selalu mencocokkan huruf besar/kecil dan berada di sisi yang aman.

## If

Sekarang setelah Anda melihat ekspresi kesetaraan Vim, mari kita sentuh operator kondisional dasar, pernyataan `if`.

Setidaknya, sintaksnya adalah:

```shell
if {klausa}
  {beberapa ekspresi}
endif
```

Anda dapat memperluas analisis kasus dengan `elseif` dan `else`.

```shell
if {predikat1}
  {ekspresi1}
elseif {predikat2}
  {ekspresi2}
elseif {predikat3}
  {ekspresi3}
else
  {ekspresi4}
endif
```

Sebagai contoh, plugin [vim-signify](https://github.com/mhinz/vim-signify) menggunakan metode instalasi yang berbeda tergantung pada pengaturan Vim Anda. Berikut adalah instruksi instalasi dari `readme` mereka, menggunakan pernyataan `if`:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Ekspresi Ternary

Vim memiliki ekspresi ternary untuk analisis kasus satu baris:

```shell
{predikat} ? ekspresibenar : ekspresisalah
```

Sebagai contoh:

```shell
echo 1 ? "Saya benar" : "Saya salah"
```

Karena 1 adalah benar, Vim mencetak "Saya benar". Misalkan Anda ingin mengatur `background` menjadi gelap jika Anda menggunakan Vim setelah jam tertentu. Tambahkan ini ke vimrc:

```shell
let &background = strftime("%H") < 18 ? "terang" : "gelap"
```

`&background` adalah opsi `'background'` di Vim. `strftime("%H")` mengembalikan waktu saat ini dalam jam. Jika belum jam 6 sore, gunakan latar belakang terang. Jika tidak, gunakan latar belakang gelap.

## or

"Or" logika (`||`) bekerja seperti banyak bahasa pemrograman.

```shell
{Ekspresi Salah}  || {Ekspresi Salah}   false
{Ekspresi Salah}  || {Ekspresi Benar}  true
{Ekspresi Benar} || {Ekspresi Salah}   true
{Ekspresi Benar} || {Ekspresi Benar}  true
```

Vim mengevaluasi ekspresi dan mengembalikan 1 (benar) atau 0 (salah).

```shell
echo 5 || 0
" mengembalikan 1

echo 5 || 5
" mengembalikan 1

echo 0 || 0
" mengembalikan 0

echo "foo5" || "foo5"
" mengembalikan 0

echo "5foo" || "foo5"
" mengembalikan 1
```

Jika ekspresi saat ini dievaluasi sebagai benar, ekspresi berikutnya tidak akan dievaluasi.

```shell
let satu lusin = 12

echo satu_lusin || dua_lusin
" mengembalikan 1

echo dua_lusin || satu_lusin
" mengembalikan error
```

Perhatikan bahwa `dua_lusin` tidak pernah didefinisikan. Ekspresi `satu_lusin || dua_lusin` tidak menghasilkan error karena `satu_lusin` dievaluasi terlebih dahulu dan ditemukan sebagai benar, sehingga Vim tidak mengevaluasi `dua_lusin`.

## dan

"Dan" logika (`&&`) adalah komplemen dari logika or.

```shell
{Ekspresi Salah}  && {Ekspresi Salah}   false
{Ekspresi Salah}  && {Ekspresi Benar}  false
{Ekspresi Benar} && {Ekspresi Salah}   false
{Ekspresi Benar} && {Ekspresi Benar}  true
```

Sebagai contoh:

```shell
echo 0 && 0
" mengembalikan 0

echo 0 && 10
" mengembalikan 0
```

`&&` mengevaluasi ekspresi sampai melihat ekspresi salah pertama. Sebagai contoh, jika Anda memiliki `benar && benar`, itu akan mengevaluasi keduanya dan mengembalikan `benar`. Jika Anda memiliki `benar && salah && benar`, itu akan mengevaluasi `benar` pertama dan berhenti di `salah` pertama. Itu tidak akan mengevaluasi `benar` ketiga.

```shell
let satu_lusin = 12
echo satu_lusin && 10
" mengembalikan 1

echo satu_lusin && v:false
" mengembalikan 0

echo satu_lusin && dua_lusin
" mengembalikan error

echo exists("satu_lusin") && satu_lusin == 12
" mengembalikan 1
```

## untuk

Loop `for` biasanya digunakan dengan tipe data list.

```shell
let sarapan = ["pancake", "waffle", "telur"]

for sarapan in sarapan
  echo sarapan
endfor
```

Ini bekerja dengan list bersarang:

```shell
let makanan = [["sarapan", "pancake"], ["makan siang", "ikan"], ["makan malam", "pasta"]]

for [tipe_makanan, makanan] in makanan
  echo "Saya sedang makan " . makanan . " untuk " . tipe_makanan
endfor
```

Anda secara teknis dapat menggunakan loop `for` dengan kamus menggunakan metode `keys()`.

```shell
let minuman = #{sarapan: "susu", makan siang: "jus jeruk", makan malam: "air"}
for tipe_minuman in keys(minuman)
  echo "Saya sedang minum " . minuman[tipe_minuman] . " untuk " . tipe_minuman
endfor
```

## Sementara

Loop umum lainnya adalah loop `while`.

```shell
let penghitung = 1
while penghitung < 5
  echo "Penghitung adalah: " . penghitung
  let penghitung += 1
endwhile
```

Untuk mendapatkan konten dari baris saat ini hingga baris terakhir:

```shell
let baris_saat_ini = line(".")
let baris_terakhir = line("$")

while baris_saat_ini <= baris_terakhir
  echo getline(baris_saat_ini)
  let baris_saat_ini += 1
endwhile
```

## Penanganan Kesalahan

Seringkali program Anda tidak berjalan seperti yang Anda harapkan. Akibatnya, itu membuat Anda bingung (pun dimaksudkan). Apa yang Anda butuhkan adalah penanganan kesalahan yang tepat.

### Hentikan

Ketika Anda menggunakan `break` di dalam loop `while` atau `for`, itu menghentikan loop.

Untuk mendapatkan teks dari awal file hingga baris saat ini, tetapi berhenti ketika Anda melihat kata "donat":

```shell
let baris = 0
let baris_terakhir = line("$")
let total_kata = ""

while baris <= baris_terakhir
  let baris += 1
  let teks_barisan = getline(baris)
  if teks_barisan =~# "donat"
    break
  endif
  echo teks_barisan
  let total_kata .= teks_barisan . " "
endwhile

echo total_kata
```

Jika Anda memiliki teks:

```shell
satu
dua
tiga
donat
empat
lima
```

Menjalankan loop `while` di atas memberikan "satu dua tiga" dan bukan sisa teks karena loop berhenti setelah mencocokkan "donat".

### Lanjutkan

Metode `continue` mirip dengan `break`, di mana ia dipanggil selama loop. Perbedaannya adalah bahwa alih-alih keluar dari loop, ia hanya melewatkan iterasi saat ini.

Misalkan Anda memiliki teks yang sama tetapi alih-alih `break`, Anda menggunakan `continue`:

```shell
let baris = 0
let baris_terakhir = line("$")
let total_kata = ""

while baris <= baris_terakhir
  let baris += 1
  let teks_barisan = getline(baris)
  if teks_barisan =~# "donat"
    continue
  endif
  echo teks_barisan
  let total_kata .= teks_barisan . " "
endwhile

echo total_kata
```

Kali ini ia mengembalikan `satu dua tiga empat lima`. Ia melewatkan baris dengan kata "donat", tetapi loop terus berlanjut.
### coba, akhirnya, dan tangkap

Vim memiliki `coba`, `akhirnya`, dan `tangkap` untuk menangani kesalahan. Untuk mensimulasikan kesalahan, Anda dapat menggunakan perintah `lempar`.

```shell
coba
  echo "Coba"
  lempar "Tidak"
akhircoba
```

Jalankan ini. Vim akan mengeluh dengan kesalahan `"Pengecualian tidak ditangkap: Tidak`.

Sekarang tambahkan blok tangkap:

```shell
coba
  echo "Coba"
  lempar "Tidak"
tangkap
  echo "Ditangkap"
akhircoba
```

Sekarang tidak ada lagi kesalahan. Anda harus melihat "Coba" dan "Ditangkap" ditampilkan.

Mari kita hapus `tangkap` dan tambahkan `akhirnya`:

```shell
coba
  echo "Coba"
  lempar "Tidak"
  echo "Anda tidak akan melihat saya"
akhirnya
  echo "Akhirnya"
akhircoba
```

Jalankan ini. Sekarang Vim menampilkan kesalahan dan "Akhirnya".

Mari kita gabungkan semuanya:

```shell
coba
  echo "Coba"
  lempar "Tidak"
tangkap
  echo "Ditangkap"
akhirnya
  echo "Akhirnya"
akhircoba
```

Kali ini Vim menampilkan "Ditangkap" dan "Akhirnya". Tidak ada kesalahan yang ditampilkan karena Vim telah menangkapnya.

Kesalahan datang dari berbagai tempat. Sumber kesalahan lainnya adalah memanggil fungsi yang tidak ada, seperti `Tidak()` di bawah ini:

```shell
coba
  echo "Coba"
  panggil Tidak()
tangkap
  echo "Ditangkap"
akhirnya
  echo "Akhirnya"
akhircoba
```

Perbedaan antara `tangkap` dan `akhirnya` adalah bahwa `akhirnya` selalu dijalankan, baik ada kesalahan atau tidak, sedangkan `tangkap` hanya dijalankan ketika kode Anda mengalami kesalahan.

Anda dapat menangkap kesalahan tertentu dengan `:tangkap`. Menurut `:h :tangkap`:

```shell
tangkap /^Vim:Interupsi$/.             " tangkap interupsi (CTRL-C)
tangkap /^Vim\\%((\\a\\+)\\)\\=:E/.    " tangkap semua kesalahan Vim
tangkap /^Vim\\%((\\a\\+)\\)\\=:/.     " tangkap kesalahan dan interupsi
tangkap /^Vim(tulis):/.                " tangkap semua kesalahan dalam :tulis
tangkap /^Vim\\%((\\a\\+)\\)\\=:E123:/ " tangkap kesalahan E123
tangkap /my-exception/.                " tangkap pengecualian pengguna
tangkap /.*/                           " tangkap semuanya
tangkap.                               " sama dengan /.*/
```

Di dalam blok `coba`, interupsi dianggap sebagai kesalahan yang dapat ditangkap.

```shell
coba
  tangkap /^Vim:Interupsi$/
  tidur 100
akhircoba
```

Di vimrc Anda, jika Anda menggunakan skema warna kustom, seperti [gruvbox](https://github.com/morhetz/gruvbox), dan Anda secara tidak sengaja menghapus direktori skema warna tetapi masih memiliki baris `skema warna gruvbox` di vimrc Anda, Vim akan melempar kesalahan ketika Anda `sumber` itu. Untuk memperbaikinya, saya menambahkan ini di vimrc saya:

```shell
coba
  skema warna gruvbox
tangkap
  skema warna default
akhircoba
```

Sekarang jika Anda `sumber` vimrc tanpa direktori `gruvbox`, Vim akan menggunakan `skema warna default`.

## Pelajari Kondisional dengan Cara Cerdas

Di bab sebelumnya, Anda belajar tentang tipe data dasar Vim. Di bab ini, Anda belajar bagaimana menggabungkannya untuk menulis program dasar menggunakan kondisional dan loop. Ini adalah blok bangunan pemrograman.

Selanjutnya, mari kita pelajari tentang ruang lingkup variabel.