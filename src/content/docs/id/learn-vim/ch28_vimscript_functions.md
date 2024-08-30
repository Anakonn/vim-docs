---
description: Dokumen ini membahas fungsi dalam Vimscript, termasuk aturan sintaksis
  dan contoh penggunaan untuk membantu pemahaman lebih dalam tentang pemrograman di
  Vim.
title: Ch28. Vimscript Functions
---

Functions adalah sarana abstraksi, elemen ketiga dalam mempelajari bahasa baru.

Di bab sebelumnya, Anda telah melihat fungsi-fungsi native Vimscript (`len()`, `filter()`, `map()`, dll.) dan fungsi kustom dalam aksi. Di bab ini, Anda akan lebih dalam mempelajari bagaimana fungsi bekerja.

## Aturan Sintaks Fungsi

Pada dasarnya, fungsi Vimscript memiliki sintaks berikut:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Definisi fungsi harus dimulai dengan huruf kapital. Ini dimulai dengan kata kunci `function` dan diakhiri dengan `endfunction`. Berikut adalah fungsi yang valid:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Berikut ini bukan fungsi yang valid karena tidak dimulai dengan huruf kapital.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Jika Anda menambahkan variabel skrip (`s:`) di depan fungsi, Anda dapat menggunakannya dengan huruf kecil. `function s:tasty()` adalah nama yang valid. Alasan mengapa Vim mengharuskan Anda menggunakan nama dengan huruf besar adalah untuk mencegah kebingungan dengan fungsi bawaan Vim (semua huruf kecil).

Nama fungsi tidak boleh dimulai dengan angka. `1Tasty()` bukan nama fungsi yang valid, tetapi `Tasty1()` adalah. Sebuah fungsi juga tidak boleh mengandung karakter non-alfanumerik selain `_`. `Tasty-food()`, `Tasty&food()`, dan `Tasty.food()` bukan nama fungsi yang valid. `Tasty_food()` *adalah*.

Jika Anda mendefinisikan dua fungsi dengan nama yang sama, Vim akan mengeluarkan kesalahan yang mengeluhkan bahwa fungsi `Tasty` sudah ada. Untuk menimpa fungsi sebelumnya dengan nama yang sama, tambahkan `!` setelah kata kunci `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Menampilkan Fungsi yang Tersedia

Untuk melihat semua fungsi bawaan dan kustom di Vim, Anda dapat menjalankan perintah `:function`. Untuk melihat konten dari fungsi `Tasty`, Anda dapat menjalankan `:function Tasty`.

Anda juga dapat mencari fungsi dengan pola menggunakan `:function /pattern`, mirip dengan navigasi pencarian Vim (`/pattern`). Untuk mencari semua fungsi yang mengandung frasa "map", jalankan `:function /map`. Jika Anda menggunakan plugin eksternal, Vim akan menampilkan fungsi yang didefinisikan dalam plugin tersebut.

Jika Anda ingin melihat dari mana fungsi berasal, Anda dapat menggunakan perintah `:verbose` dengan perintah `:function`. Untuk melihat dari mana semua fungsi yang mengandung kata "map" berasal, jalankan:

```shell
:verbose function /map
```

Ketika saya menjalankannya, saya mendapatkan sejumlah hasil. Yang ini memberi tahu saya bahwa fungsi `fzf#vim#maps` adalah fungsi autoload (untuk mengulang, lihat Ch. 23) yang ditulis di dalam file `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, di baris 1263. Ini berguna untuk debugging.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Menghapus Fungsi

Untuk menghapus fungsi yang ada, gunakan `:delfunction {Function_name}`. Untuk menghapus `Tasty`, jalankan `:delfunction Tasty`.

## Nilai Kembali Fungsi

Agar sebuah fungsi mengembalikan nilai, Anda perlu memberinya nilai `return` yang eksplisit. Jika tidak, Vim secara otomatis mengembalikan nilai implisit 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

`return` yang kosong juga setara dengan nilai 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Jika Anda menjalankan `:echo Tasty()` menggunakan fungsi di atas, setelah Vim menampilkan "Tasty", ia mengembalikan 0, nilai kembali implisit. Untuk membuat `Tasty()` mengembalikan nilai "Tasty", Anda dapat melakukan ini:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Sekarang ketika Anda menjalankan `:echo Tasty()`, ia mengembalikan string "Tasty".

Anda dapat menggunakan fungsi di dalam ekspresi. Vim akan menggunakan nilai kembali dari fungsi tersebut. Ekspresi `:echo Tasty() . " Food!"` menghasilkan "Tasty Food!"

## Argumen Formal

Untuk meneruskan argumen formal `food` ke fungsi `Tasty` Anda, Anda dapat melakukan ini:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" mengembalikan "Tasty pastry"
```

`a:` adalah salah satu ruang lingkup variabel yang disebutkan di bab terakhir. Ini adalah variabel parameter formal. Ini adalah cara Vim untuk mendapatkan nilai parameter formal dalam sebuah fungsi. Tanpa itu, Vim akan mengeluarkan kesalahan:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" mengembalikan kesalahan "nama variabel tidak terdefinisi"
```

## Variabel Lokal Fungsi

Mari kita bahas variabel lain yang belum Anda pelajari di bab sebelumnya: variabel lokal fungsi (`l:`).

Saat menulis fungsi, Anda dapat mendefinisikan variabel di dalamnya:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" mengembalikan "Yummy in my tummy"
```

Dalam konteks ini, variabel `location` sama dengan `l:location`. Ketika Anda mendefinisikan variabel dalam sebuah fungsi, variabel itu adalah *lokal* untuk fungsi tersebut. Ketika pengguna melihat `location`, itu bisa dengan mudah disalahartikan sebagai variabel global. Saya lebih suka lebih eksplisit daripada tidak, jadi saya lebih suka menambahkan `l:` untuk menunjukkan bahwa ini adalah variabel fungsi.

Alasan lain untuk menggunakan `l:count` adalah bahwa Vim memiliki variabel khusus dengan alias yang terlihat seperti variabel biasa. `v:count` adalah salah satu contohnya. Ini memiliki alias `count`. Di Vim, memanggil `count` adalah sama dengan memanggil `v:count`. Sangat mudah untuk secara tidak sengaja memanggil salah satu variabel khusus tersebut.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" mengeluarkan kesalahan
```

Eksekusi di atas mengeluarkan kesalahan karena `let count = "Count"` secara implisit mencoba untuk mendefinisikan ulang variabel khusus Vim `v:count`. Ingat bahwa variabel khusus (`v:`) bersifat hanya-baca. Anda tidak dapat mengubahnya. Untuk memperbaikinya, gunakan `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" mengembalikan "I do not count my calories"
```

## Memanggil Fungsi

Vim memiliki perintah `:call` untuk memanggil sebuah fungsi.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

Perintah `call` tidak mengeluarkan nilai kembali. Mari kita panggil dengan `echo`.

```shell
echo call Tasty("gravy")
```

Ups, Anda mendapatkan kesalahan. Perintah `call` di atas adalah perintah baris perintah (`:call`). Perintah `echo` di atas juga merupakan perintah baris perintah (`:echo`). Anda tidak dapat memanggil perintah baris perintah dengan perintah baris perintah lainnya. Mari kita coba variasi lain dari perintah `call`:

```shell
echo call("Tasty", ["gravy"])
" mengembalikan "Tasty gravy"
```

Untuk menghilangkan kebingungan, Anda baru saja menggunakan dua perintah `call` yang berbeda: perintah baris perintah `:call` dan fungsi `call()`. Fungsi `call()` menerima sebagai argumen pertama nama fungsi (string) dan argumen kedua parameter formal (daftar).

Untuk mempelajari lebih lanjut tentang `:call` dan `call()`, lihat `:h call()` dan `:h :call`.

## Argumen Default

Anda dapat memberikan parameter fungsi dengan nilai default dengan `=`. Jika Anda memanggil `Breakfast` dengan hanya satu argumen, argumen `beverage` akan menggunakan nilai default "milk".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" mengembalikan I had hash browns and milk for breakfast

echo Breakfast("Cereal", "Orange Juice")
" mengembalikan I had Cereal and Orange Juice for breakfast
```

## Argumen Variabel

Anda dapat meneruskan argumen variabel dengan tiga titik (`...`). Argumen variabel berguna ketika Anda tidak tahu berapa banyak variabel yang akan diberikan pengguna.

Misalkan Anda sedang membuat buffet sepuasnya (Anda tidak akan pernah tahu seberapa banyak makanan yang akan dimakan pelanggan Anda):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Jika Anda menjalankan `echo Buffet("Noodles")`, itu akan mengeluarkan "Noodles". Vim menggunakan `a:1` untuk mencetak *argumen pertama* yang diteruskan ke `...`, hingga 20 (`a:1` adalah argumen pertama, `a:2` adalah argumen kedua, dll.). Jika Anda menjalankan `echo Buffet("Noodles", "Sushi")`, itu akan tetap menampilkan hanya "Noodles", mari kita perbarui:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" mengembalikan "Noodles Sushi"
```

Masalah dengan pendekatan ini adalah jika Anda sekarang menjalankan `echo Buffet("Noodles")` (dengan hanya satu variabel), Vim mengeluh bahwa ia memiliki variabel yang tidak terdefinisi `a:2`. Bagaimana Anda bisa membuatnya cukup fleksibel untuk menampilkan persis apa yang diberikan pengguna?

Untungnya, Vim memiliki variabel khusus `a:0` untuk menampilkan *jumlah* argumen yang diteruskan ke `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" mengembalikan 1

echo Buffet("Noodles", "Sushi")
" mengembalikan 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" mengembalikan 5
```

Dengan ini, Anda dapat melakukan iterasi menggunakan panjang argumen.

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

Kurung kurawal `a:{l:food_counter}` adalah interpolasi string, menggunakan nilai dari penghitung `food_counter` untuk memanggil argumen parameter formal `a:1`, `a:2`, `a:3`, dll.

```shell
echo Buffet("Noodles")
" mengembalikan "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" mengembalikan semua yang Anda berikan: "Noodles Sushi Ice cream Tofu Mochi"
```

Argumen variabel memiliki satu variabel khusus lagi: `a:000`. Ini memiliki nilai dari semua argumen variabel dalam format daftar.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" mengembalikan ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" mengembalikan ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

Mari kita refactor fungsi untuk menggunakan loop `for`:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" mengembalikan Noodles Sushi Ice cream Tofu Mochi
```
## Rentang

Anda dapat mendefinisikan fungsi Vimscript *ranged* dengan menambahkan kata kunci `range` di akhir definisi fungsi. Fungsi ranged memiliki dua variabel khusus yang tersedia: `a:firstline` dan `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Jika Anda berada di baris 100 dan menjalankan `call Breakfast()`, itu akan menampilkan 100 untuk `firstline` dan `lastline`. Jika Anda menyoroti secara visual (`v`, `V`, atau `Ctrl-V`) baris 101 hingga 105 dan menjalankan `call Breakfast()`, `firstline` menampilkan 101 dan `lastline` menampilkan 105. `firstline` dan `lastline` menampilkan rentang minimum dan maksimum tempat fungsi dipanggil.

Anda juga dapat menggunakan `:call` dan meneruskan rentang. Jika Anda menjalankan `:11,20call Breakfast()`, itu akan menampilkan 11 untuk `firstline` dan 20 untuk `lastline`.

Anda mungkin bertanya, "Bagus bahwa fungsi Vimscript menerima rentang, tetapi bukankah saya bisa mendapatkan nomor baris dengan `line(".")`? Bukankah itu melakukan hal yang sama?"

Pertanyaan yang bagus. Jika ini yang Anda maksud:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Memanggil `:11,20call Breakfast()` menjalankan fungsi `Breakfast` 10 kali (satu untuk setiap baris dalam rentang). Bandingkan jika Anda telah meneruskan argumen `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Memanggil `11,20call Breakfast()` menjalankan fungsi `Breakfast` *sekali*.

Jika Anda meneruskan kata kunci `range` dan Anda meneruskan rentang numerik (seperti `11,20`) pada `call`, Vim hanya menjalankan fungsi itu sekali. Jika Anda tidak meneruskan kata kunci `range` dan Anda meneruskan rentang numerik (seperti `11,20`) pada `call`, Vim menjalankan fungsi itu N kali tergantung pada rentang (dalam hal ini, N = 10).

## Kamus

Anda dapat menambahkan fungsi sebagai item kamus dengan menambahkan kata kunci `dict` saat mendefinisikan fungsi.

Jika Anda memiliki fungsi `SecondBreakfast` yang mengembalikan item `breakfast` yang Anda miliki:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Mari kita tambahkan fungsi ini ke dalam kamus `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" mengembalikan "pancakes"
```

Dengan kata kunci `dict`, variabel kunci `self` merujuk pada kamus tempat fungsi disimpan (dalam hal ini, kamus `meals`). Ekspresi `self.breakfast` sama dengan `meals.breakfast`.

Cara alternatif untuk menambahkan fungsi ke dalam objek kamus adalah dengan menggunakan namespace.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" mengembalikan "pasta"
```

Dengan namespace, Anda tidak perlu menggunakan kata kunci `dict`.

## Funcref

Funcref adalah referensi ke sebuah fungsi. Ini adalah salah satu tipe data dasar Vimscript yang disebutkan di Ch. 24.

Ekspresi `function("SecondBreakfast")` di atas adalah contoh funcref. Vim memiliki fungsi bawaan `function()` yang mengembalikan funcref ketika Anda meneruskan nama fungsi (string).

```shell
function! Breakfast(item)
  return "Saya sedang makan " . a:item . " untuk sarapan"
endfunction

let Breakfastify = Breakfast
" mengembalikan error

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" mengembalikan "Saya sedang makan oatmeal untuk sarapan"

echo Breakfastify("pancake")
" mengembalikan "Saya sedang makan pancake untuk sarapan"
```

Di Vim, jika Anda ingin menetapkan fungsi ke variabel, Anda tidak bisa langsung menjalankannya seperti `let MyVar = MyFunc`. Anda perlu menggunakan fungsi `function()`, seperti `let MyVar = function("MyFunc")`.

Anda dapat menggunakan funcref dengan peta dan filter. Perhatikan bahwa peta dan filter akan meneruskan indeks sebagai argumen pertama dan nilai yang diiterasi sebagai argumen kedua.

```shell
function! Breakfast(index, item)
  return "Saya sedang makan " . a:item . " untuk sarapan"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Cara yang lebih baik untuk menggunakan fungsi dalam peta dan filter adalah dengan menggunakan ekspresi lambda (kadang-kadang dikenal sebagai fungsi tanpa nama). Misalnya:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" mengembalikan 3

let Tasty = { -> 'lezat'}
echo Tasty()
" mengembalikan "lezat"
```

Anda dapat memanggil fungsi dari dalam ekspresi lambda:

```shell
function! Lunch(item)
  return "Saya sedang makan " . a:item . " untuk makan siang"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Jika Anda tidak ingin memanggil fungsi dari dalam lambda, Anda dapat merombaknya:

```shell
let day_meals = map(lunch_items, {index, item -> "Saya sedang makan " . item . " untuk makan siang"})
```

## Rantai Metode

Anda dapat merantai beberapa fungsi Vimscript dan ekspresi lambda secara berurutan dengan `->`. Ingatlah bahwa `->` harus diikuti oleh nama metode *tanpa spasi*.

```shell
Source->Method1()->Method2()->...->MethodN()
```

Untuk mengonversi float menjadi angka menggunakan rantai metode:

```shell
echo 3.14->float2nr()
" mengembalikan 3
```

Mari kita lakukan contoh yang lebih rumit. Misalkan Anda perlu mengkapitalisasi huruf pertama dari setiap item dalam daftar, kemudian mengurutkan daftar, kemudian menggabungkan daftar untuk membentuk string.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" mengembalikan "Antipasto, Bruschetta, Calzone"
```

Dengan rantai metode, urutannya lebih mudah dibaca dan dipahami. Saya bisa melihat sekilas `dinner_items->CapitalizeList()->sort()->join(", ")` dan tahu persis apa yang terjadi.

## Penutupan

Ketika Anda mendefinisikan variabel di dalam fungsi, variabel itu ada dalam batasan fungsi tersebut. Ini disebut sebagai lingkup leksikal.

```shell
function! Lunch()
  let appetizer = "udang"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` didefinisikan di dalam fungsi `Lunch`, yang mengembalikan funcref `SecondLunch`. Perhatikan bahwa `SecondLunch` menggunakan `appetizer`, tetapi dalam Vimscript, ia tidak memiliki akses ke variabel itu. Jika Anda mencoba menjalankan `echo Lunch()()`, Vim akan melemparkan kesalahan variabel tidak terdefinisi.

Untuk memperbaiki masalah ini, gunakan kata kunci `closure`. Mari kita rombak:

```shell
function! Lunch()
  let appetizer = "udang"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Sekarang jika Anda menjalankan `echo Lunch()()`, Vim akan mengembalikan "udang".

## Pelajari Fungsi Vimscript dengan Cara yang Cerdas

Dalam bab ini, Anda telah mempelajari anatomi fungsi Vim. Anda telah belajar bagaimana menggunakan berbagai kata kunci khusus `range`, `dict`, dan `closure` untuk memodifikasi perilaku fungsi. Anda juga telah belajar bagaimana menggunakan lambda dan merantai beberapa fungsi bersama. Fungsi adalah alat penting untuk membuat abstraksi yang kompleks.

Selanjutnya, mari kita gabungkan semua yang telah Anda pelajari untuk membuat plugin Anda sendiri.