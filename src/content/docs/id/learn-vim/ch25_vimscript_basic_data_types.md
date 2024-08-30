---
description: Dokumen ini membahas tentang Vimscript, termasuk tipe data primitif dan
  cara menggunakan Ex mode untuk belajar dan berlatih secara interaktif.
title: Ch25. Vimscript Basic Data Types
---

Di beberapa bab berikutnya, Anda akan belajar tentang Vimscript, bahasa pemrograman bawaan Vim.

Saat mempelajari bahasa baru, ada tiga elemen dasar yang perlu dicari:
- Primitif
- Sarana Kombinasi
- Sarana Abstraksi

Dalam bab ini, Anda akan belajar tentang tipe data primitif Vim.

## Tipe Data

Vim memiliki 10 tipe data yang berbeda:
- Angka
- Float
- String
- List
- Dictionary
- Khusus
- Funcref
- Job
- Channel
- Blob

Saya akan membahas enam tipe data pertama di sini. Di Bab 27, Anda akan belajar tentang Funcref. Untuk lebih lanjut tentang tipe data Vim, lihat `:h variables`.

## Mengikuti Dengan Mode Ex

Vim secara teknis tidak memiliki REPL bawaan, tetapi memiliki mode, mode Ex, yang dapat digunakan seperti itu. Anda dapat masuk ke mode Ex dengan `Q` atau `gQ`. Mode Ex seperti mode command-line yang diperpanjang (seperti mengetik perintah mode command-line tanpa henti). Untuk keluar dari mode Ex, ketik `:visual`.

Anda dapat menggunakan baik `:echo` atau `:echom` di bab ini dan bab Vimscript berikutnya untuk kode bersama. Mereka seperti `console.log` di JS atau `print` di Python. Perintah `:echo` mencetak ekspresi yang dievaluasi yang Anda berikan. Perintah `:echom` melakukan hal yang sama, tetapi selain itu, menyimpan hasilnya dalam riwayat pesan.

```viml
:echom "hello echo message"
```

Anda dapat melihat riwayat pesan dengan:

```shell
:messages
```

Untuk menghapus riwayat pesan Anda, jalankan:

```shell
:messages clear
```

## Angka

Vim memiliki 4 tipe angka yang berbeda: desimal, heksadesimal, biner, dan oktal. Ngomong-ngomong, ketika saya mengatakan tipe data angka, sering kali ini berarti tipe data integer. Dalam panduan ini, saya akan menggunakan istilah angka dan integer secara bergantian.

### Desimal

Anda harus sudah familiar dengan sistem desimal. Vim menerima desimal positif dan negatif. 1, -1, 10, dll. Dalam pemrograman Vimscript, Anda mungkin akan menggunakan tipe desimal sebagian besar waktu.

### Heksadesimal

Heksadesimal dimulai dengan `0x` atau `0X`. Mnemonik: He**x**adecimal.

### Biner

Biner dimulai dengan `0b` atau `0B`. Mnemonik: **B**inary.

### Oktal

Oktal dimulai dengan `0`, `0o`, dan `0O`. Mnemonik: **O**ctal.

### Mencetak Angka

Jika Anda `echo` baik angka heksadesimal, biner, atau oktal, Vim secara otomatis mengonversinya menjadi desimal.

```viml
:echo 42
" mengembalikan 42

:echo 052
" mengembalikan 42

:echo 0b101010
" mengembalikan 42

:echo 0x2A
" mengembalikan 42
```

### Truthy dan Falsy

Di Vim, nilai 0 adalah falsy dan semua nilai non-0 adalah truthy.

Yang berikut tidak akan mencetak apa pun.

```viml
:if 0
:  echo "Nope"
:endif
```

Namun, ini akan:

```viml
:if 1
:  echo "Yes"
:endif
```

Nilai apa pun selain 0 adalah truthy, termasuk angka negatif. 100 adalah truthy. -1 adalah truthy.

### Aritmetika Angka

Angka dapat digunakan untuk menjalankan ekspresi aritmetika:

```viml
:echo 3 + 1
" mengembalikan 4

: echo 5 - 3
" mengembalikan 2

:echo 2 * 2
" mengembalikan 4

:echo 4 / 2
" mengembalikan 2
```

Saat membagi angka dengan sisa, Vim mengabaikan sisanya.

```viml
:echo 5 / 2
" mengembalikan 2 alih-alih 2.5
```

Untuk mendapatkan hasil yang lebih akurat, Anda perlu menggunakan angka float.

## Float

Float adalah angka dengan desimal yang mengikuti. Ada dua cara untuk merepresentasikan angka float: notasi titik desimal (seperti 31.4) dan eksponen (3.14e01). Mirip dengan angka, Anda dapat menggunakan tanda positif dan negatif:

```viml
:echo +123.4
" mengembalikan 123.4

:echo -1.234e2
" mengembalikan -123.4

:echo 0.25
" mengembalikan 0.25

:echo 2.5e-1
" mengembalikan 0.25
```

Anda perlu memberikan float sebuah titik dan digit yang mengikuti. `25e-2` (tanpa titik) dan `1234.` (memiliki titik, tetapi tanpa digit yang mengikuti) keduanya adalah angka float yang tidak valid.

### Aritmetika Float

Saat melakukan ekspresi aritmetika antara angka dan float, Vim memaksa hasilnya menjadi float.

```viml
:echo 5 / 2.0
" mengembalikan 2.5
```

Float dan aritmetika float memberi Anda float lain.

```shell
:echo 1.0 + 1.0
" mengembalikan 2.0
```

## String

String adalah karakter yang dikelilingi oleh tanda kutip ganda (`""`) atau tanda kutip tunggal (`''`). "Hello", "123", dan '123.4' adalah contoh string.

### Konkatenasi String

Untuk menggabungkan string di Vim, gunakan operator `.`.

```viml
:echo "Hello" . " world"
" mengembalikan "Hello world"
```

### Aritmetika String

Saat Anda menjalankan operator aritmetika (`+ - * /`) dengan angka dan string, Vim memaksa string menjadi angka.

```viml
:echo "12 donuts" + 3
" mengembalikan 15
```

Ketika Vim melihat "12 donuts", ia mengekstrak 12 dari string dan mengonversinya menjadi angka 12. Kemudian ia melakukan penjumlahan, mengembalikan 15. Untuk pemaksaan string-ke-angka ini bekerja, karakter angka perlu menjadi *karakter pertama* dalam string.

Yang berikut tidak akan bekerja karena 12 bukan karakter pertama dalam string:

```viml
:echo "donuts 12" + 3
" mengembalikan 3
```

Ini juga tidak akan bekerja karena spasi kosong adalah karakter pertama dari string:

```viml
:echo " 12 donuts" + 3
" mengembalikan 3
```

Pemaksaan ini bekerja bahkan dengan dua string:

```shell
:echo "12 donuts" + "6 pastries"
" mengembalikan 18
```

Ini bekerja dengan operator aritmetika apa pun, tidak hanya `+`:

```viml
:echo "12 donuts" * "5 boxes"
" mengembalikan 60

:echo "12 donuts" - 5
" mengembalikan 7

:echo "12 donuts" / "3 people"
" mengembalikan 4
```

Trik yang rapi untuk memaksa konversi string-ke-angka adalah dengan menambahkan 0 atau mengalikan dengan 1:

```viml
:echo "12" + 0
" mengembalikan 12

:echo "12" * 1
" mengembalikan 12
```

Ketika aritmetika dilakukan terhadap float dalam string, Vim memperlakukannya seperti integer, bukan float:

```shell
:echo "12.0 donuts" + 12
" mengembalikan 24, bukan 24.0
```

### Konkatenasi Angka dan String

Anda dapat memaksa angka menjadi string dengan operator titik (`.`):

```viml
:echo 12 . "donuts"
" mengembalikan "12donuts"
```

Pemaksaan ini hanya bekerja dengan tipe data angka, bukan float. Ini tidak akan bekerja:

```shell
:echo 12.0 . "donuts"
" tidak mengembalikan "12.0donuts" tetapi melemparkan kesalahan
```

### Kondisional String

Ingat bahwa 0 adalah falsy dan semua angka non-0 adalah truthy. Ini juga berlaku saat menggunakan string sebagai kondisional.

Dalam pernyataan if berikut, Vim memaksa "12donuts" menjadi 12, yang merupakan truthy:

```viml
:if "12donuts"
:  echo "Yum"
:endif
" mengembalikan "Yum"
```

Di sisi lain, ini adalah falsy:

```viml
:if "donuts12"
:  echo "Nope"
:endif
" tidak mengembalikan apa pun
```

Vim memaksa "donuts12" menjadi 0, karena karakter pertama bukan angka.

### Tanda Kutip Ganda vs Tunggal

Tanda kutip ganda berperilaku berbeda dari tanda kutip tunggal. Tanda kutip tunggal menampilkan karakter secara harfiah sementara tanda kutip ganda menerima karakter khusus.

Apa itu karakter khusus? Lihatlah tampilan newline dan tanda kutip ganda:

```viml
:echo "hello\nworld"
" mengembalikan
" hello
" world

:echo "hello \"world\""
" mengembalikan "hello "world""
```

Bandingkan itu dengan tanda kutip tunggal:

```shell
:echo 'hello\nworld'
" mengembalikan 'hello\nworld'

:echo 'hello \"world\"'
" mengembalikan 'hello \"world\"'
```

Karakter khusus adalah karakter string khusus yang ketika di-escape, berperilaku berbeda. `\n` bertindak seperti newline. `\"` berperilaku seperti `"`. Untuk daftar karakter khusus lainnya, lihat `:h expr-quote`.

### Prosedur String

Mari kita lihat beberapa prosedur string bawaan.

Anda dapat mendapatkan panjang string dengan `strlen()`.

```shell
:echo strlen("choco")
" mengembalikan 5
```

Anda dapat mengonversi string menjadi angka dengan `str2nr()`:

```shell
:echo str2nr("12donuts")
" mengembalikan 12

:echo str2nr("donuts12")
" mengembalikan 0
```

Mirip dengan pemaksaan string-ke-angka sebelumnya, jika angka bukan karakter pertama, Vim tidak akan menangkapnya.

Kabar baiknya adalah Vim memiliki metode yang mengubah string menjadi float, `str2float()`:

```shell
:echo str2float("12.5donuts")
" mengembalikan 12.5
```

Anda dapat mengganti pola dalam string dengan metode `substitute()`:

```shell
:echo substitute("sweet", "e", "o", "g")
" mengembalikan "swoot"
```

Parameter terakhir, "g", adalah flag global. Dengan itu, Vim akan mengganti semua kemunculan yang cocok. Tanpa itu, Vim hanya akan mengganti kecocokan pertama.

```shell
:echo substitute("sweet", "e", "o", "")
" mengembalikan "swoet"
```

Perintah substitusi dapat digabungkan dengan `getline()`. Ingat bahwa fungsi `getline()` mengambil teks pada nomor baris yang diberikan. Misalkan Anda memiliki teks "chocolate donut" di baris 5. Anda dapat menggunakan prosedur:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" mengembalikan glazed donut
```

Ada banyak prosedur string lainnya. Lihat `:h string-functions`.

## List

List Vimscript mirip dengan Array di Javascript atau List di Python. Ini adalah urutan item yang *terurut*. Anda dapat mencampur dan mencocokkan konten dengan tipe data yang berbeda:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Sublists

List Vim diindeks dari nol. Anda dapat mengakses item tertentu dalam list dengan `[n]`, di mana n adalah indeks.

```shell
:echo ["a", "sweet", "dessert"][0]
" mengembalikan "a"

:echo ["a", "sweet", "dessert"][2]
" mengembalikan "dessert"
```

Jika Anda melewati nomor indeks maksimum, Vim akan melemparkan kesalahan yang mengatakan bahwa indeks berada di luar jangkauan:

```shell
:echo ["a", "sweet", "dessert"][999]
" mengembalikan kesalahan
```

Ketika Anda pergi di bawah nol, Vim akan mulai menghitung indeks dari elemen terakhir. Melewati nomor indeks minimum juga akan melemparkan kesalahan:

```shell
:echo ["a", "sweet", "dessert"][-1]
" mengembalikan "dessert"

:echo ["a", "sweet", "dessert"][-3]
" mengembalikan "a"

:echo ["a", "sweet", "dessert"][-999]
" mengembalikan kesalahan
```

Anda dapat "memotong" beberapa elemen dari list dengan `[n:m]`, di mana `n` adalah indeks awal dan `m` adalah indeks akhir.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" mengembalikan ["plain", "strawberry", "lemon"]
```

Jika Anda tidak melewatkan `m` (`[n:]`), Vim akan mengembalikan sisa elemen mulai dari elemen ke-n. Jika Anda tidak melewatkan `n` (`[:m]`), Vim akan mengembalikan elemen pertama hingga elemen ke-m.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" mengembalikan ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" mengembalikan ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

Anda dapat melewatkan indeks yang melebihi jumlah item maksimum saat memotong array.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" mengembalikan ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### Memotong String

Anda dapat memotong dan menargetkan string seperti daftar:

```viml
:echo "choco"[0]
" mengembalikan "c"

:echo "choco"[1:3]
" mengembalikan "hoc"

:echo "choco"[:3]
" mengembalikan choc

:echo "choco"[1:]
" mengembalikan hoco
```

### Aritmatika Daftar

Anda dapat menggunakan `+` untuk menggabungkan dan memodifikasi daftar:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" mengembalikan ["chocolate", "strawberry", "sugar"]
```

### Fungsi Daftar

Mari kita eksplorasi fungsi daftar bawaan Vim.

Untuk mendapatkan panjang daftar, gunakan `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" mengembalikan 2
```

Untuk menambahkan elemen ke daftar, Anda dapat menggunakan `insert()`:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" mengembalikan ["glazed", "chocolate", "strawberry"]
```

Anda juga dapat memberikan `insert()` indeks di mana Anda ingin menambahkan elemen. Jika Anda ingin menambahkan item sebelum elemen kedua (indeks 1):

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" mengembalikan ['glazed', 'cream', 'chocolate', 'strawberry']
```

Untuk menghapus item dari daftar, gunakan `remove()`. Ini menerima daftar dan indeks elemen yang ingin Anda hapus.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" mengembalikan ['glazed', 'strawberry']
```

Anda dapat menggunakan `map()` dan `filter()` pada daftar. Untuk memfilter elemen yang mengandung frasa "choco":

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" mengembalikan ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" mengembalikan ['chocolate donut', 'glazed donut', 'sugar donut']
```

Variabel `v:val` adalah variabel khusus Vim. Ini tersedia saat mengiterasi daftar atau kamus menggunakan `map()` atau `filter()`. Ini mewakili setiap item yang diiterasi.

Untuk lebih lanjut, lihat `:h list-functions`.

### Membongkar Daftar

Anda dapat membongkar daftar dan menetapkan variabel ke item daftar:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" mengembalikan "chocolate"

:echo flavor2
" mengembalikan "glazed"
```

Untuk menetapkan sisa item daftar, Anda dapat menggunakan `;` diikuti dengan nama variabel:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" mengembalikan "apple"

:echo restFruits
" mengembalikan ['lemon', 'blueberry', 'raspberry']
```

### Memodifikasi Daftar

Anda dapat memodifikasi item daftar secara langsung:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" mengembalikan ['sugar', 'glazed', 'plain']
```

Anda dapat memodifikasi beberapa item daftar secara langsung:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" mengembalikan ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## Kamus

Kamus Vimscript adalah daftar asosiatif yang tidak terurut. Kamus yang tidak kosong terdiri dari setidaknya satu pasangan kunci-nilai.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Objek data kamus Vim menggunakan string untuk kunci. Jika Anda mencoba menggunakan angka, Vim akan mengubahnya menjadi string.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" mengembalikan {'1': '7am', '2': '9am', '11ses': '11am'}
```

Jika Anda terlalu malas untuk menempatkan tanda kutip di sekitar setiap kunci, Anda dapat menggunakan notasi `#{}`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" mengembalikan {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

Satu-satunya persyaratan untuk menggunakan sintaks `#{}` adalah bahwa setiap kunci harus berupa:

- Karakter ASCII.
- Digit.
- Sebuah garis bawah (`_`).
- Sebuah tanda hubung (`-`).

Sama seperti daftar, Anda dapat menggunakan tipe data apa pun sebagai nilai.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### Mengakses Kamus

Untuk mengakses nilai dari kamus, Anda dapat memanggil kunci dengan menggunakan tanda kurung siku (`['key']`) atau notasi titik (`.key`).

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" mengembalikan "gruel omelettes"

:echo lunch
" mengembalikan "gruel sandwiches"
```

### Memodifikasi Kamus

Anda dapat memodifikasi atau bahkan menambahkan konten kamus:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" mengembalikan {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### Fungsi Kamus

Mari kita eksplorasi beberapa fungsi bawaan Vim untuk menangani kamus.

Untuk memeriksa panjang kamus, gunakan `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" mengembalikan 3
```

Untuk melihat apakah kamus mengandung kunci tertentu, gunakan `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" mengembalikan 1

:echo has_key(mealPlans, "dessert")
" mengembalikan 0
```

Untuk melihat apakah kamus memiliki item, gunakan `empty()`. Prosedur `empty()` bekerja dengan semua tipe data: daftar, kamus, string, angka, float, dll.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" mengembalikan 1

:echo empty(mealPlans)
" mengembalikan 0
```

Untuk menghapus entri dari kamus, gunakan `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "menghapus sarapan: " . remove(mealPlans, "breakfast")
" mengembalikan "menghapus sarapan: 'waffles'"

:echo mealPlans
" mengembalikan {'lunch': 'pancakes', 'dinner': 'donuts'}
```

Untuk mengonversi kamus menjadi daftar daftar, gunakan `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" mengembalikan [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` dan `map()` juga tersedia.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" mengembalikan {'2': '9am', '11ses': '11am'}
```

Karena kamus berisi pasangan kunci-nilai, Vim menyediakan variabel khusus `v:key` yang bekerja mirip dengan `v:val`. Saat mengiterasi melalui kamus, `v:key` akan menyimpan nilai dari kunci yang sedang diiterasi.

Jika Anda memiliki kamus `mealPlans`, Anda dapat memetakannya menggunakan `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " dan susu"')

:echo mealPlans
" mengembalikan {'lunch': 'lunch dan susu', 'breakfast': 'breakfast dan susu', 'dinner': 'dinner dan susu'}
```

Demikian pula, Anda dapat memetakannya menggunakan `v:val`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " dan susu"')

:echo mealPlans
" mengembalikan {'lunch': 'pancakes dan susu', 'breakfast': 'waffles dan susu', 'dinner': 'donuts dan susu'}
```

Untuk melihat lebih banyak fungsi kamus, lihat `:h dict-functions`.

## Primitif Khusus

Vim memiliki primitif khusus:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

Ngomong-ngomong, `v:` adalah variabel bawaan Vim. Mereka akan dibahas lebih lanjut di bab berikutnya.

Dalam pengalaman saya, Anda tidak akan sering menggunakan primitif khusus ini. Jika Anda membutuhkan nilai yang benar / salah, Anda dapat menggunakan 0 (salah) dan non-0 (benar). Jika Anda membutuhkan string kosong, cukup gunakan `""`. Tetapi tetap baik untuk mengetahui, jadi mari kita cepat membahasnya.

### Benar

Ini setara dengan `true`. Ini setara dengan angka dengan nilai non-0. Saat mendekode json dengan `json_encode()`, ini diinterpretasikan sebagai "benar".

```shell
:echo json_encode({"test": v:true})
" mengembalikan {"test": true}
```

### Salah

Ini setara dengan `false`. Ini setara dengan angka dengan nilai 0. Saat mendekode json dengan `json_encode()`, ini diinterpretasikan sebagai "salah".

```shell
:echo json_encode({"test": v:false})
" mengembalikan {"test": false}
```

### Tidak Ada

Ini setara dengan string kosong. Saat mendekode json dengan `json_encode()`, ini diinterpretasikan sebagai item kosong (`null`).

```shell
:echo json_encode({"test": v:none})
" mengembalikan {"test": null}
```

### Null

Mirip dengan `v:none`.

```shell
:echo json_encode({"test": v:null})
" mengembalikan {"test": null}
```

## Pelajari Tipe Data dengan Cara Cerdas

Dalam bab ini, Anda telah mempelajari tentang tipe data dasar Vimscript: angka, float, string, daftar, kamus, dan khusus. Mempelajari ini adalah langkah pertama untuk memulai pemrograman Vimscript.

Di bab berikutnya, Anda akan belajar bagaimana menggabungkannya untuk menulis ekspresi seperti kesetaraan, kondisi, dan loop.