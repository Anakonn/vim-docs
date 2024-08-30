---
description: Dokumen ini membahas konsep pencarian dan penggantian teks di Vim, serta
  cara menggunakan ekspresi reguler untuk meningkatkan efisiensi pengeditan.
title: Ch12. Search and Substitute
---

Bab ini mencakup dua konsep terpisah tetapi terkait: pencarian dan penggantian. Sering kali saat mengedit, Anda perlu mencari beberapa teks berdasarkan pola penyebut umum terkecil mereka. Dengan mempelajari cara menggunakan ekspresi reguler dalam pencarian dan penggantian alih-alih string literal, Anda akan dapat menargetkan teks apa pun dengan cepat.

Sebagai catatan, dalam bab ini, saya akan menggunakan `/` saat membicarakan pencarian. Segala sesuatu yang dapat Anda lakukan dengan `/` juga dapat dilakukan dengan `?`.

## Sensitivitas Kasus Cerdas

Mencocokkan kasus dari istilah pencarian bisa jadi rumit. Jika Anda mencari teks "Learn Vim", Anda mungkin dengan mudah salah mengetik kasus satu huruf dan mendapatkan hasil pencarian yang salah. Bukankah lebih mudah dan lebih aman jika Anda dapat mencocokkan kasus apa pun? Di sinilah opsi `ignorecase` bersinar. Cukup tambahkan `set ignorecase` di vimrc Anda dan semua istilah pencarian Anda menjadi tidak sensitif terhadap kasus. Sekarang Anda tidak perlu lagi melakukan `/Learn Vim`, `/learn vim` akan berfungsi.

Namun, ada kalanya Anda perlu mencari frasa yang spesifik terhadap kasus. Salah satu cara untuk melakukannya adalah dengan mematikan opsi `ignorecase` dengan menjalankan `set noignorecase`, tetapi itu adalah banyak pekerjaan untuk menghidupkan dan mematikan setiap kali Anda perlu mencari frasa yang sensitif terhadap kasus.

Untuk menghindari pengalihan `ignorecase`, Vim memiliki opsi `smartcase` untuk mencari string yang tidak sensitif terhadap kasus jika pola pencarian *mengandung setidaknya satu karakter huruf besar*. Anda dapat menggabungkan `ignorecase` dan `smartcase` untuk melakukan pencarian yang tidak sensitif terhadap kasus ketika Anda memasukkan semua karakter huruf kecil dan pencarian yang sensitif terhadap kasus ketika Anda memasukkan satu atau lebih karakter huruf besar.

Di dalam vimrc Anda, tambahkan:

```shell
set ignorecase smartcase
```

Jika Anda memiliki teks ini:

```shell
hello
HELLO
Hello
```

- `/hello` mencocokkan "hello", "HELLO", dan "Hello".
- `/HELLO` hanya mencocokkan "HELLO".
- `/Hello` hanya mencocokkan "Hello".

Ada satu kelemahan. Bagaimana jika Anda perlu mencari hanya string huruf kecil? Ketika Anda melakukan `/hello`, Vim sekarang melakukan pencarian yang tidak sensitif terhadap kasus. Anda dapat menggunakan pola `\C` di mana saja dalam istilah pencarian Anda untuk memberi tahu Vim bahwa istilah pencarian berikutnya akan sensitif terhadap kasus. Jika Anda melakukan `/\Chello`, itu akan mencocokkan secara ketat "hello", bukan "HELLO" atau "Hello".

## Karakter Pertama dan Terakhir dalam Sebuah Baris

Anda dapat menggunakan `^` untuk mencocokkan karakter pertama dalam sebuah baris dan `$` untuk mencocokkan karakter terakhir dalam sebuah baris.

Jika Anda memiliki teks ini:

```shell
hello hello
```

Anda dapat menargetkan "hello" pertama dengan `/^hello`. Karakter yang mengikuti `^` haruslah karakter pertama dalam sebuah baris. Untuk menargetkan "hello" terakhir, jalankan `/hello$`. Karakter sebelum `$` haruslah karakter terakhir dalam sebuah baris.

Jika Anda memiliki teks ini:

```shell
hello hello friend
```

Menjalankan `/hello$` tidak akan mencocokkan apa pun karena "friend" adalah istilah terakhir dalam baris itu, bukan "hello".

## Mengulangi Pencarian

Anda dapat mengulangi pencarian sebelumnya dengan `//`. Jika Anda baru saja mencari `/hello`, menjalankan `//` setara dengan menjalankan `/hello`. Pintasan ini dapat menghemat beberapa ketukan tombol terutama jika Anda baru saja mencari string panjang. Juga ingat bahwa Anda dapat menggunakan `n` dan `N` untuk mengulangi pencarian terakhir dengan arah yang sama dan arah yang berlawanan, masing-masing.

Bagaimana jika Anda ingin dengan cepat mengingat *n* istilah pencarian terakhir? Anda dapat dengan cepat menjelajahi riwayat pencarian dengan terlebih dahulu menekan `/`, kemudian tekan tombol panah `atas`/`bawah` (atau `Ctrl-N`/`Ctrl-P`) sampai Anda menemukan istilah pencarian yang Anda butuhkan. Untuk melihat semua riwayat pencarian Anda, Anda dapat menjalankan `:history /`.

Ketika Anda mencapai akhir file saat mencari, Vim mengeluarkan kesalahan: `"Search hit the BOTTOM without match for: {your-search}"`. Terkadang ini bisa menjadi perlindungan yang baik dari pencarian berlebihan, tetapi di lain waktu Anda ingin mengulang pencarian kembali ke atas lagi. Anda dapat menggunakan opsi `set wrapscan` untuk membuat Vim mencari kembali di atas file ketika Anda mencapai akhir file. Untuk mematikan fitur ini, lakukan `set nowrapscan`.

## Mencari Kata Alternatif

Adalah hal umum untuk mencari beberapa kata sekaligus. Jika Anda perlu mencari *baik* "hello vim" atau "hola vim", tetapi tidak "salve vim" atau "bonjour vim", Anda dapat menggunakan pola `|`.

Diberikan teks ini:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Untuk mencocokkan "hello" dan "hola", Anda dapat melakukan `/hello\|hola`. Anda harus melarikan diri (`\`) operator atau (`|`), jika tidak Vim akan mencari string "|".

Jika Anda tidak ingin mengetik `\|` setiap kali, Anda dapat menggunakan sintaks `magic` (`\v`) di awal pencarian: `/\vhello|hola`. Saya tidak akan membahas `magic` dalam panduan ini, tetapi dengan `\v`, Anda tidak perlu lagi melarikan diri dari karakter khusus. Untuk mempelajari lebih lanjut tentang `\v`, silakan periksa `:h \v`.

## Mengatur Awal dan Akhir Pencocokan

Mungkin Anda perlu mencari teks yang merupakan bagian dari kata majemuk. Jika Anda memiliki teks ini:

```shell
11vim22
vim22
11vim
vim
```

Jika Anda perlu memilih "vim" tetapi hanya ketika dimulai dengan "11" dan diakhiri dengan "22", Anda dapat menggunakan operator `\zs` (awal pencocokan) dan `\ze` (akhir pencocokan). Jalankan:

```shell
/11\zsvim\ze22
```

Vim masih harus mencocokkan pola lengkap "11vim22", tetapi hanya menyoroti pola yang terjepit antara `\zs` dan `\ze`. Contoh lain:

```shell
foobar
foobaz
```

Jika Anda perlu mencocokkan "foo" dalam "foobaz" tetapi tidak dalam "foobar", jalankan:

```shell
/foo\zebaz
```

## Mencari Rentang Karakter

Semua istilah pencarian Anda hingga saat ini telah menjadi pencarian kata literal. Dalam kehidupan nyata, Anda mungkin perlu menggunakan pola umum untuk menemukan teks Anda. Pola paling dasar adalah rentang karakter, `[ ]`.

Jika Anda perlu mencari digit apa pun, Anda mungkin tidak ingin mengetik `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` setiap kali. Sebagai gantinya, gunakan `/[0-9]` untuk mencocokkan satu digit. Ekspresi `0-9` mewakili rentang angka 0-9 yang akan dicocokkan oleh Vim, jadi jika Anda mencari digit antara 1 hingga 5, gunakan `/[1-5]`.

Digit bukan satu-satunya tipe data yang dapat dicari oleh Vim. Anda juga dapat melakukan `/[a-z]` untuk mencari huruf kecil dan `/[A-Z]` untuk mencari huruf besar.

Anda dapat menggabungkan rentang ini bersama-sama. Jika Anda perlu mencari digit 0-9 dan huruf kecil serta huruf besar dari "a" hingga "f" (seperti heksadesimal), Anda dapat melakukan `/[0-9a-fA-F]`.

Untuk melakukan pencarian negatif, Anda dapat menambahkan `^` di dalam tanda kurung rentang karakter. Untuk mencari karakter non-digit, jalankan `/[^0-9]`. Vim akan mencocokkan karakter apa pun selama itu bukan digit. Hati-hati bahwa tanda caret (`^`) di dalam tanda kurung rentang berbeda dari caret awal baris (mis: `/^hello`). Jika caret berada di luar sepasang tanda kurung dan merupakan karakter pertama dalam istilah pencarian, itu berarti "karakter pertama dalam sebuah baris". Jika caret berada di dalam sepasang tanda kurung dan merupakan karakter pertama di dalam tanda kurung, itu berarti operator pencarian negatif. `/^abc` mencocokkan "abc" pertama dalam sebuah baris dan `/[^abc]` mencocokkan karakter apa pun kecuali "a", "b", atau "c".

## Mencari Karakter yang Berulang

Jika Anda perlu mencari dua digit dalam teks ini:

```shell
1aa
11a
111
```

Anda dapat menggunakan `/[0-9][0-9]` untuk mencocokkan karakter dua digit, tetapi metode ini tidak dapat diskalakan. Bagaimana jika Anda perlu mencocokkan dua puluh digit? Mengetik `[0-9]` dua puluh kali bukanlah pengalaman yang menyenangkan. Itulah sebabnya Anda memerlukan argumen `count`.

Anda dapat melewatkan `count` ke pencarian Anda. Ini memiliki sintaks berikut:

```shell
{n,m}
```

Ngomong-ngomong, tanda kurung `count` ini perlu dilarikan saat Anda menggunakannya di Vim. Operator `count` ditempatkan setelah satu karakter yang ingin Anda tingkatkan.

Berikut adalah empat variasi berbeda dari sintaks `count`:
- `{n}` adalah pencocokan yang tepat. `/[0-9]\{2\}` mencocokkan angka dua digit: "11" dan "11" dalam "111".
- `{n,m}` adalah pencocokan rentang. `/[0-9]\{2,3\}` mencocokkan antara 2 dan 3 digit angka: "11" dan "111".
- `{,m}` adalah pencocokan hingga. `/[0-9]\{,3\}` mencocokkan hingga 3 digit angka: "1", "11", dan "111".
- `{n,}` adalah pencocokan setidaknya. `/[0-9]\{2,\}` mencocokkan setidaknya 2 atau lebih digit angka: "11" dan "111".

Argumen count `\{0,\}` (nol atau lebih) dan `\{1,\}` (satu atau lebih) adalah pola pencarian umum dan Vim memiliki operator khusus untuk mereka: `*` dan `+` (`+` perlu dilarikan sementara `*` berfungsi baik tanpa pelarian). Jika Anda melakukan `/[0-9]*`, itu sama dengan `/[0-9]\{0,\}`. Itu mencari nol atau lebih digit. Itu akan mencocokkan "", "1", "123". Ngomong-ngomong, itu juga akan mencocokkan non-digit seperti "a", karena secara teknis ada nol digit dalam huruf "a". Pikirkan dengan hati-hati sebelum menggunakan `*`. Jika Anda melakukan `/[0-9]\+`, itu sama dengan `/[0-9]\{1,\}`. Itu mencari satu atau lebih digit. Itu akan mencocokkan "1" dan "12".

## Rentang Karakter yang Sudah Ditentukan

Vim memiliki rentang yang sudah ditentukan untuk karakter umum seperti digit dan huruf. Saya tidak akan membahas setiap satu di sini, tetapi Anda dapat menemukan daftar lengkap di dalam `:h /character-classes`. Berikut adalah yang berguna:

```shell
\d    Digit [0-9]
\D    Non-digit [^0-9]
\s    Karakter spasi (spasi dan tab)
\S    Karakter non-spasi (segala sesuatu kecuali spasi dan tab)
\w    Karakter kata [0-9A-Za-z_]
\l    Huruf kecil [a-z]
\u    Karakter huruf besar [A-Z]
```

Anda dapat menggunakannya seperti Anda menggunakan rentang karakter. Untuk mencari satu digit, alih-alih menggunakan `/[0-9]`, Anda dapat menggunakan `/\d` untuk sintaks yang lebih ringkas.

## Contoh Pencarian: Menangkap Teks Antara Sepasang Karakter yang Sama

Jika Anda ingin mencari frasa yang dikelilingi oleh sepasang tanda kutip ganda:

```shell
"Vim is awesome!"
```

Jalankan ini:

```shell
/"[^"]\+"
```

Mari kita uraikan:
- `"` adalah tanda kutip ganda literal. Itu mencocokkan tanda kutip ganda pertama.
- `[^"]` berarti karakter apa pun kecuali tanda kutip ganda. Itu mencocokkan karakter alfanumerik dan karakter spasi selama itu bukan tanda kutip ganda.
- `\+` berarti satu atau lebih. Karena itu didahului oleh `[^"]`, Vim mencari satu atau lebih karakter yang bukan tanda kutip ganda.
- `"` adalah tanda kutip ganda literal. Itu mencocokkan tanda kutip ganda penutup.

Ketika Vim melihat yang pertama `"`, ia memulai penangkapan pola. Begitu ia melihat tanda kutip ganda kedua dalam sebuah baris, ia mencocokkan pola `"` kedua dan menghentikan penangkapan pola. Sementara itu, semua karakter non-tanda kutip ganda di antara keduanya ditangkap oleh pola `[^"]\+`, dalam hal ini, frasa `Vim is awesome!`. Ini adalah pola umum untuk menangkap frasa yang dikelilingi oleh sepasang pembatas yang sama.

- Untuk menangkap frasa yang dikelilingi oleh tanda kutip tunggal, Anda dapat menggunakan `/'[^']\+'`.
- Untuk menangkap frasa yang dikelilingi oleh nol, Anda dapat menggunakan `/0[^0]\+0`.

## Contoh Pencarian: Menangkap Nomor Telepon

Jika Anda ingin mencocokkan nomor telepon AS yang dipisahkan oleh tanda hubung (`-`), seperti `123-456-7890`, Anda dapat menggunakan:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Nomor telepon AS terdiri dari satu set angka tiga digit, diikuti oleh tiga digit lainnya, dan akhirnya oleh empat digit. Mari kita uraikan:
- `\d\{3\}` mencocokkan digit yang diulang tepat tiga kali
- `-` adalah tanda hubung literal

Anda dapat menghindari mengetik pelarian dengan `\v`:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Pola ini juga berguna untuk menangkap digit yang berulang, seperti alamat IP dan kode pos.

Itu mencakup bagian pencarian dari bab ini. Sekarang mari kita beralih ke penggantian.

## Penggantian Dasar

Perintah penggantian Vim adalah perintah berguna untuk dengan cepat menemukan dan mengganti pola apa pun. Sintaks penggantian adalah:

```shell
:s/{pola-lama}/{pola-baru}/
```

Mari kita mulai dengan penggunaan dasar. Jika Anda memiliki teks ini:

```shell
vim is good
```

Mari kita mengganti "good" dengan "awesome" karena Vim itu luar biasa. Jalankan `:s/good/awesome/`. Anda harus melihat:

```shell
vim is awesome
```
## Mengulangi Penggantian Terakhir

Anda dapat mengulangi perintah substitusi terakhir dengan menggunakan perintah normal `&` atau dengan menjalankan `:s`. Jika Anda baru saja menjalankan `:s/good/awesome/`, menjalankan `&` atau `:s` akan mengulanginya.

Selain itu, sebelumnya di bab ini saya menyebutkan bahwa Anda dapat menggunakan `//` untuk mengulangi pola pencarian sebelumnya. Trik ini bekerja dengan perintah substitusi. Jika `/good` baru saja dilakukan dan Anda meninggalkan argumen pola substitusi pertama kosong, seperti dalam `:s//awesome/`, itu bekerja sama seperti menjalankan `:s/good/awesome/`.

## Rentang Substitusi

Sama seperti banyak perintah Ex, Anda dapat memberikan argumen rentang ke dalam perintah substitusi. Sintaksnya adalah:

```shell
:[rentang]s/yang_lama/yang_baru/
```

Jika Anda memiliki ekspresi berikut:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Untuk mengganti "let" menjadi "const" pada baris tiga hingga lima, Anda dapat melakukan:

```shell
:3,5s/let/const/
```

Berikut adalah beberapa variasi rentang yang dapat Anda berikan:

- `:,3s/let/const/` - jika tidak ada yang diberikan sebelum koma, itu mewakili baris saat ini. Ganti dari baris saat ini hingga baris 3.
- `:1,s/let/const/` - jika tidak ada yang diberikan setelah koma, itu juga mewakili baris saat ini. Ganti dari baris 1 hingga baris saat ini.
- `:3s/let/const/` - jika hanya satu nilai yang diberikan sebagai rentang (tanpa koma), itu melakukan substitusi hanya pada baris tersebut.

Di Vim, `%` biasanya berarti seluruh file. Jika Anda menjalankan `:%s/let/const/`, itu akan melakukan substitusi pada semua baris. Ingatlah sintaks rentang ini. Banyak perintah baris perintah yang akan Anda pelajari di bab-bab mendatang akan mengikuti bentuk ini.

## Pencocokan Pola

Beberapa bagian berikutnya akan membahas ekspresi reguler dasar. Pengetahuan pola yang kuat sangat penting untuk menguasai perintah substitusi.

Jika Anda memiliki ekspresi berikut:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Untuk menambahkan sepasang tanda kutip ganda di sekitar angka:

```shell
:%s/\d/"\0"/
```

Hasilnya:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Mari kita uraikan perintah tersebut:
- `:%s` menargetkan seluruh file untuk melakukan substitusi.
- `\d` adalah rentang yang telah ditentukan oleh Vim untuk angka (mirip dengan menggunakan `[0-9]`).
- `"\0"` di sini tanda kutip ganda adalah tanda kutip ganda literal. `\0` adalah karakter khusus yang mewakili "pola yang cocok sepenuhnya". Pola yang cocok di sini adalah angka tunggal, `\d`.

Sebagai alternatif, `&` juga mewakili pola yang cocok sepenuhnya seperti `\0`. `:s/\d/"&"/` juga akan berfungsi.

Mari kita pertimbangkan contoh lain. Diberikan ekspresi ini dan Anda perlu menukar semua "let" dengan nama variabel.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Untuk melakukan itu, jalankan:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

Perintah di atas mengandung terlalu banyak backslash dan sulit dibaca. Dalam hal ini lebih nyaman menggunakan operator `\v`:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Hasilnya:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Bagus! Mari kita uraikan perintah itu:
- `:%s` menargetkan semua baris dalam file untuk melakukan substitusi.
- `(\w+) (\w+)` adalah pencocokan grup. `\w` adalah salah satu rentang yang telah ditentukan oleh Vim untuk karakter kata (`[0-9A-Za-z_]`). `( )` yang mengelilinginya menangkap pencocokan karakter kata dalam sebuah grup. Perhatikan spasi antara dua pengelompokan. `(\w+) (\w+)` menangkap dua grup. Grup pertama menangkap "one" dan grup kedua menangkap "two".
- `\2 \1` mengembalikan grup yang ditangkap dalam urutan terbalik. `\2` berisi string yang ditangkap "let" dan `\1` string "one". Memiliki `\2 \1` mengembalikan string "let one".

Ingat bahwa `\0` mewakili pola yang cocok sepenuhnya. Anda dapat memecah string yang cocok menjadi grup yang lebih kecil dengan `( )`. Setiap grup diwakili oleh `\1`, `\2`, `\3`, dll.

Mari kita lakukan satu contoh lagi untuk memperkuat konsep pencocokan grup ini. Jika Anda memiliki angka-angka ini:

```shell
123
456
789
```

Untuk membalik urutannya, jalankan:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Hasilnya adalah:

```shell
321
654
987
```

Setiap `(\d)` mencocokkan setiap digit dan membuat grup. Pada baris pertama, `(\d)` pertama memiliki nilai 1, `(\d)` kedua memiliki nilai 2, dan `(\d)` ketiga memiliki nilai 3. Mereka disimpan dalam variabel `\1`, `\2`, dan `\3`. Di bagian kedua dari substitusi Anda, pola baru `\3\2\1` menghasilkan nilai "321" pada baris satu.

Jika Anda menjalankan ini sebagai gantinya:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Anda akan mendapatkan hasil yang berbeda:

```shell
312
645
978
```

Ini karena sekarang Anda hanya memiliki dua grup. Grup pertama, yang ditangkap oleh `(\d\d)`, disimpan dalam `\1` dan memiliki nilai 12. Grup kedua, yang ditangkap oleh `(\d)`, disimpan dalam `\2` dan memiliki nilai 3. `\2\1` kemudian, mengembalikan 312.

## Flag Substitusi

Jika Anda memiliki kalimat:

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

Untuk mengganti semua pancake menjadi donut, Anda tidak dapat hanya menjalankan:

```shell
:s/pancake/donut
```

Perintah di atas hanya akan mengganti kecocokan pertama, memberi Anda:

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Ada dua cara untuk menyelesaikannya. Anda dapat menjalankan perintah substitusi dua kali lagi atau Anda dapat memberikan flag global (`g`) untuk mengganti semua kecocokan dalam satu baris.

Mari kita bicarakan tentang flag global. Jalankan:

```shell
:s/pancake/donut/g
```

Vim mengganti semua pancake dengan donut dalam satu perintah cepat. Perintah global adalah salah satu dari beberapa flag yang diterima perintah substitusi. Anda memberikan flag di akhir perintah substitusi. Berikut adalah daftar flag yang berguna:

```shell
&    Menggunakan kembali flag dari perintah substitusi sebelumnya.
g    Mengganti semua kecocokan dalam baris.
c    Meminta konfirmasi penggantian.
e    Mencegah pesan kesalahan ditampilkan saat penggantian gagal.
i    Melakukan penggantian tanpa memperhatikan huruf besar/kecil.
I    Melakukan penggantian dengan memperhatikan huruf besar/kecil.
```

Ada lebih banyak flag yang tidak saya cantumkan di atas. Untuk membaca tentang semua flag, lihat `:h s_flags`.

Omong-omong, perintah penggantian-ulang (`&` dan `:s`) tidak mempertahankan flag. Menjalankan `&` hanya akan mengulang `:s/pancake/donut/` tanpa `g`. Untuk dengan cepat mengulang perintah substitusi terakhir dengan semua flag, jalankan `:&&`.

## Mengubah Delimiter

Jika Anda perlu mengganti URL dengan jalur panjang:

```shell
https://mysite.com/a/b/c/d/e
```

Untuk menggantinya dengan kata "hello", jalankan:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

Namun, sulit untuk mengetahui mana yang merupakan garis miring maju (`/`) yang merupakan bagian dari pola substitusi dan mana yang merupakan delimiter. Anda dapat mengubah delimiter dengan karakter byte tunggal apa pun (kecuali untuk alfabet, angka, atau `"`, `|`, dan `\`). Mari kita ganti dengan `+`. Perintah substitusi di atas kemudian dapat ditulis ulang sebagai:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Sekarang lebih mudah untuk melihat di mana delimiter berada.

## Penggantian Khusus

Anda juga dapat memodifikasi huruf dari teks yang Anda substitusi. Diberikan ekspresi berikut dan tugas Anda adalah mengubah huruf besar variabel "one", "two", "three", dll.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Jalankan:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Anda akan mendapatkan:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

Uraian:
- `(\w+) (\w+)` menangkap dua grup yang cocok pertama, seperti "let" dan "one".
- `\1` mengembalikan nilai grup pertama, "let".
- `\U\2` mengubah huruf besar (`\U`) grup kedua (`\2`).

Trik dari perintah ini adalah ekspresi `\U\2`. `\U` menginstruksikan karakter berikutnya untuk diubah menjadi huruf besar.

Mari kita lakukan satu contoh lagi. Misalkan Anda sedang menulis panduan Vim dan Anda perlu mengkapitalisasi huruf pertama dari setiap kata dalam satu baris.

```shell
vim is the greatest text editor in the whole galaxy
```

Anda dapat menjalankan:

```shell
:s/\<./\U&/g
```

Hasilnya:

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Berikut adalah uraian:
- `:s` menggantikan baris saat ini.
- `\<.` terdiri dari dua bagian: `\<` untuk mencocokkan awal kata dan `.` untuk mencocokkan karakter apa pun. Operator `\<` membuat karakter berikutnya menjadi karakter pertama dari sebuah kata. Karena `.` adalah karakter berikutnya, itu akan mencocokkan karakter pertama dari kata mana pun.
- `\U&` mengubah huruf besar simbol berikutnya, `&`. Ingat bahwa `&` (atau `\0`) mewakili seluruh kecocokan. Itu mencocokkan karakter pertama dari setiap kata.
- `g` adalah flag global. Tanpa itu, perintah ini hanya menggantikan kecocokan pertama. Anda perlu mengganti setiap kecocokan di baris ini.

Untuk mempelajari lebih lanjut tentang simbol penggantian khusus substitusi seperti `\U`, lihat `:h sub-replace-special`.

## Pola Alternatif

Terkadang Anda perlu mencocokkan beberapa pola secara bersamaan. Jika Anda memiliki salam berikut:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Anda perlu mengganti kata "vim" dengan "friend" tetapi hanya pada baris yang mengandung kata "hello" atau "hola". Ingat dari sebelumnya di bab ini, Anda dapat menggunakan `|` untuk beberapa pola alternatif.

```shell
:%s/\v(hello|hola) vim/\1 friend/g
```

Hasilnya:

```shell
hello friend
hola friend
salve vim
bonjour vim
```

Berikut adalah uraian:
- `%s` menjalankan perintah substitusi pada setiap baris di file.
- `(hello|hola)` mencocokkan *baik* "hello" atau "hola" dan menganggapnya sebagai grup.
- `vim` adalah kata literal "vim".
- `\1` adalah grup pertama, yang merupakan teks "hello" atau "hola".
- `friend` adalah kata literal "friend".

## Menggantikan Awal dan Akhir Pola

Ingat bahwa Anda dapat menggunakan `\zs` dan `\ze` untuk mendefinisikan awal dan akhir dari sebuah kecocokan. Teknik ini juga bekerja dalam substitusi. Jika Anda memiliki:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

Untuk mengganti "cake" dalam "hotcake" dengan "dog" untuk mendapatkan "hotdog":

```shell
:%s/hot\zscake/dog/g
```

Hasilnya:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Serakah dan Tidak Serakah

Anda dapat mengganti kecocokan ke-n dalam satu baris dengan trik ini:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Untuk mengganti "Mississippi" yang ketiga dengan "Arkansas", jalankan:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

Rincian:
- `:s/` adalah perintah pengganti.
- `\v` adalah kata kunci ajaib sehingga Anda tidak perlu melarikan diri dari kata kunci khusus.
- `.` mencocokkan sembarang karakter tunggal.
- `{-}` melakukan pencocokan tidak serakah dari 0 atau lebih atom sebelumnya.
- `\zsMississippi` menjadikan "Mississippi" sebagai awal dari pencocokan.
- `(...){3}` mencari kecocokan ketiga.

Anda telah melihat sintaks `{3}` sebelumnya di bab ini. Dalam hal ini, `{3}` akan mencocokkan tepat kecocokan ketiga. Trik baru di sini adalah `{-}`. Ini adalah pencocokan tidak serakah. Ini menemukan pencocokan terpendek dari pola yang diberikan. Dalam hal ini, `(.{-}Mississippi)` mencocokkan jumlah "Mississippi" yang paling sedikit yang didahului oleh sembarang karakter. Bandingkan ini dengan `(.*Mississippi)` di mana ia menemukan pencocokan terpanjang dari pola yang diberikan.

Jika Anda menggunakan `(.{-}Mississippi)`, Anda mendapatkan lima kecocokan: "One Mississippi", "Two Mississippi", dll. Jika Anda menggunakan `(.*Mississippi)`, Anda mendapatkan satu kecocokan: "Mississippi" terakhir. `*` adalah pencocok serakah dan `{-}` adalah pencocok tidak serakah. Untuk mempelajari lebih lanjut, lihat `:h /\{-` dan `:h non-greedy`.

Mari kita lakukan contoh yang lebih sederhana. Jika Anda memiliki string:

```shell
abc1de1
```

Anda dapat mencocokkan "abc1de1" (serakah) dengan:

```shell
/a.*1
```

Anda dapat mencocokkan "abc1" (tidak serakah) dengan:

```shell
/a.\{-}1
```

Jadi jika Anda perlu mengubah huruf besar kecocokan terpanjang (serakah), jalankan:

```shell
:s/a.*1/\U&/g
```

Untuk mendapatkan:

```shell
ABC1DEFG1
```

Jika Anda perlu mengubah huruf besar kecocokan terpendek (tidak serakah), jalankan:

```shell
:s/a.\{-}1/\U&/g
```

Untuk mendapatkan:

```shell
ABC1defg1
```

Jika Anda baru mengenal konsep serakah vs tidak serakah, mungkin sulit untuk memahaminya. Bereksperimenlah dengan berbagai kombinasi sampai Anda memahaminya.

## Mengganti di Beberapa File

Akhirnya, mari kita pelajari cara mengganti frasa di beberapa file. Untuk bagian ini, anggaplah Anda memiliki dua file: `food.txt` dan `animal.txt`.

Di dalam `food.txt`:

```shell
corndog
hotdog
chilidog
```

Di dalam `animal.txt`:

```shell
large dog
medium dog
small dog
```

Anggaplah struktur direktori Anda terlihat seperti ini:

```shell
- food.txt
- animal.txt
```

Pertama, tangkap kedua `food.txt` dan `animal.txt` di dalam `:args`. Ingat dari bab sebelumnya bahwa `:args` dapat digunakan untuk membuat daftar nama file. Ada beberapa cara untuk melakukan ini dari dalam Vim, salah satunya adalah dengan menjalankan ini dari dalam Vim:

```shell
:args *.txt                  menangkap semua file txt di lokasi saat ini
```

Untuk mengujinya, ketika Anda menjalankan `:args`, Anda harus melihat:

```shell
[food.txt] animal.txt
```

Sekarang semua file yang relevan disimpan di dalam daftar argumen, Anda dapat melakukan penggantian multi-file dengan perintah `:argdo`. Jalankan:

```shell
:argdo %s/dog/chicken/
```

Ini melakukan penggantian terhadap semua file di dalam daftar `:args`. Akhirnya, simpan file yang telah diubah dengan:

```shell
:argdo update
```

`:args` dan `:argdo` adalah alat yang berguna untuk menerapkan perintah baris perintah di beberapa file. Cobalah dengan perintah lainnya!

## Mengganti di Beberapa File Dengan Makro

Sebagai alternatif, Anda juga dapat menjalankan perintah pengganti di beberapa file dengan makro. Jalankan:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

Rincian:
- `:args *.txt` menambahkan semua file teks ke dalam daftar `:args`.
- `qq` memulai makro di register "q".
- `:%s/dog/chicken/g` mengganti "dog" dengan "chicken" di semua baris dalam file saat ini.
- `:wnext` menyimpan file kemudian pergi ke file berikutnya di daftar `args`.
- `q` menghentikan perekaman makro.
- `99@q` mengeksekusi makro sembilan puluh sembilan kali. Vim akan menghentikan eksekusi makro setelah menemukan kesalahan pertama, jadi Vim tidak akan benar-benar mengeksekusi makro sembilan puluh sembilan kali.

## Mempelajari Pencarian dan Penggantian dengan Cara Cerdas

Kemampuan untuk melakukan pencarian dengan baik adalah keterampilan yang diperlukan dalam pengeditan. Menguasai pencarian memungkinkan Anda memanfaatkan fleksibilitas ekspresi reguler untuk mencari pola apa pun dalam file. Luangkan waktu Anda untuk mempelajari ini. Untuk menjadi lebih baik dengan ekspresi reguler, Anda perlu secara aktif menggunakan ekspresi reguler. Saya pernah membaca buku tentang ekspresi reguler tanpa benar-benar melakukannya dan saya hampir melupakan semua yang saya baca setelahnya. Pemrograman aktif adalah cara terbaik untuk menguasai keterampilan apa pun.

Cara yang baik untuk meningkatkan keterampilan pencocokan pola Anda adalah setiap kali Anda perlu mencari pola (seperti "hello 123"), alih-alih mencari istilah pencarian literal (`/hello 123`), cobalah untuk menemukan pola untuk itu (sesuatu seperti `/\v(\l+) (\d+)`). Banyak dari konsep ekspresi reguler ini juga berlaku dalam pemrograman umum, tidak hanya saat menggunakan Vim.

Sekarang Anda telah belajar tentang pencarian dan penggantian lanjutan di Vim, mari kita pelajari salah satu perintah yang paling serbaguna, perintah global.