---
description: Dokumen ini menjelaskan cara menggunakan perintah global di Vim untuk
  menjalankan perintah baris perintah pada beberapa baris secara bersamaan.
title: Ch13. the Global Command
---

Sejauh ini Anda telah belajar bagaimana mengulangi perubahan terakhir dengan perintah titik (`.`), untuk memutar ulang tindakan dengan makro (`q`), dan untuk menyimpan teks di register (`"`).

Dalam bab ini, Anda akan belajar bagaimana mengulangi perintah baris perintah dengan perintah global.

## Ikhtisar Perintah Global

Perintah global Vim digunakan untuk menjalankan perintah baris perintah pada beberapa baris secara bersamaan.

Ngomong-ngomong, Anda mungkin pernah mendengar istilah "Perintah Ex" sebelumnya. Dalam panduan ini, saya menyebutnya sebagai perintah baris perintah. Baik perintah Ex maupun perintah baris perintah adalah sama. Mereka adalah perintah yang dimulai dengan titik dua (`:`). Perintah substitusi di bab terakhir adalah contoh dari perintah Ex. Mereka disebut Ex karena awalnya berasal dari editor teks Ex. Saya akan terus merujuknya sebagai perintah baris perintah dalam panduan ini. Untuk daftar lengkap perintah Ex, lihat `:h ex-cmd-index`.

Perintah global memiliki sintaksis sebagai berikut:

```shell
:g/pola/perintah
```

`pola` mencocokkan semua baris yang mengandung pola tersebut, mirip dengan pola dalam perintah substitusi. `perintah` dapat berupa perintah baris perintah apa pun. Perintah global bekerja dengan mengeksekusi `perintah` terhadap setiap baris yang cocok dengan `pola`.

Jika Anda memiliki ekspresi berikut:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Untuk menghapus semua baris yang mengandung "console", Anda dapat menjalankan:

```shell
:g/console/d
```

Hasil:

```shell
const one = 1;

const two = 2;

const three = 3;
```

Perintah global mengeksekusi perintah hapus (`d`) pada semua baris yang cocok dengan pola "console".

Saat menjalankan perintah `g`, Vim melakukan dua pemindaian di seluruh file. Pada pemindaian pertama, ia memindai setiap baris dan menandai baris yang cocok dengan pola `/console/`. Setelah semua baris yang cocok ditandai, ia melakukan pemindaian kedua dan mengeksekusi perintah `d` pada baris yang ditandai.

Jika Anda ingin menghapus semua baris yang mengandung "const" sebagai gantinya, jalankan:

```shell
:g/const/d
```

Hasil:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Pencocokan Invers

Untuk menjalankan perintah global pada baris yang tidak cocok, Anda dapat menjalankan:

```shell
:g!/pola/perintah
```

atau

```shell
:v/pola/perintah
```

Jika Anda menjalankan `:v/console/d`, itu akan menghapus semua baris *tidak* yang mengandung "console".

## Pola

Perintah global menggunakan sistem pola yang sama seperti perintah substitusi, jadi bagian ini akan berfungsi sebagai penyegaran. Silakan lewati ke bagian berikutnya atau baca terus!

Jika Anda memiliki ekspresi ini:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Untuk menghapus baris yang mengandung "one" atau "two", jalankan:

```shell
:g/one\|two/d
```

Untuk menghapus baris yang mengandung angka tunggal, jalankan salah satu:

```shell
:g/[0-9]/d
```

atau

```shell
:g/\d/d
```

Jika Anda memiliki ekspresi:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Untuk mencocokkan baris yang mengandung antara tiga hingga enam nol, jalankan:

```shell
:g/0\{3,6\}/d
```

## Mengoperasikan Rentang

Anda dapat mengoperasikan rentang sebelum perintah `g`. Berikut adalah beberapa cara Anda dapat melakukannya:
- `:1,5g/console/d` mencocokkan string "console" antara baris 1 dan 5 dan menghapusnya.
- `:,5g/console/d` jika tidak ada alamat sebelum koma, maka dimulai dari baris saat ini. Ini mencari string "console" antara baris saat ini dan baris 5 dan menghapusnya.
- `:3,g/console/d` jika tidak ada alamat setelah koma, maka diakhiri pada baris saat ini. Ini mencari string "console" antara baris 3 dan baris saat ini dan menghapusnya.
- `:3g/console/d` jika Anda hanya memberikan satu alamat tanpa koma, itu mengeksekusi perintah hanya pada baris 3. Ini mencari pada baris 3 dan menghapusnya jika memiliki string "console".

Selain angka, Anda juga dapat menggunakan simbol ini sebagai rentang:
- `.` berarti baris saat ini. Rentang `.,3` berarti antara baris saat ini dan baris 3.
- `$` berarti baris terakhir dalam file. Rentang `3,$` berarti antara baris 3 dan baris terakhir.
- `+n` berarti n baris setelah baris saat ini. Anda dapat menggunakannya dengan `.` atau tanpa. `3,+1` atau `3,.+1` berarti antara baris 3 dan baris setelah baris saat ini.

Jika Anda tidak memberikan rentang, secara default itu mempengaruhi seluruh file. Ini sebenarnya bukan norma. Sebagian besar perintah baris perintah Vim dijalankan hanya pada baris saat ini jika Anda tidak memberikan rentang. Dua pengecualian yang mencolok adalah perintah global (`:g`) dan perintah simpan (`:w`).

## Perintah Normal

Anda dapat menjalankan perintah normal dengan perintah global menggunakan perintah baris perintah `:normal`.

Jika Anda memiliki teks ini:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Untuk menambahkan ";" di akhir setiap baris, jalankan:

```shell
:g/./normal A;
```

Mari kita uraikan:
- `:g` adalah perintah global.
- `/./` adalah pola untuk "baris tidak kosong". Ini mencocokkan baris dengan setidaknya satu karakter, jadi itu mencocokkan baris dengan "const" dan "console" dan tidak mencocokkan baris kosong.
- `normal A;` menjalankan perintah baris perintah `:normal`. `A;` adalah perintah mode normal untuk menyisipkan ";" di akhir baris.

## Menjalankan Makro

Anda juga dapat menjalankan makro dengan perintah global. Sebuah makro dapat dijalankan dengan perintah `normal`. Jika Anda memiliki ekspresi:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Perhatikan bahwa baris dengan "const" tidak memiliki titik koma. Mari kita buat makro untuk menambahkan koma di akhir baris tersebut di register a:

```shell
qaA;<Esc>q
```

Jika Anda perlu penyegaran, lihat bab tentang makro. Sekarang jalankan:

```shell
:g/const/normal @a
```

Sekarang semua baris dengan "const" akan memiliki ";" di akhir.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Jika Anda mengikuti langkah ini langkah demi langkah, Anda akan memiliki dua titik koma di baris pertama. Untuk menghindari itu, jalankan perintah global dari baris dua dan seterusnya, `:2,$g/const/normal @a`.

## Perintah Global Rekursif

Perintah global itu sendiri adalah jenis perintah baris perintah, jadi secara teknis Anda dapat menjalankan perintah global di dalam perintah global.

Diberikan ekspresi berikut, jika Anda ingin menghapus pernyataan `console.log` kedua:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Jika Anda menjalankan:

```shell
:g/console/g/two/d
```

Pertama, `g` akan mencari baris yang mengandung pola "console" dan akan menemukan 3 kecocokan. Kemudian `g` kedua akan mencari baris yang mengandung pola "two" dari ketiga kecocokan tersebut. Akhirnya, itu akan menghapus kecocokan tersebut.

Anda juga dapat menggabungkan `g` dengan `v` untuk menemukan pola positif dan negatif. Misalnya:

```shell
:g/console/v/two/d
```

Alih-alih mencari baris yang mengandung pola "two", itu akan mencari baris *tidak* yang mengandung pola "two".

## Mengubah Pembatas

Anda dapat mengubah pembatas perintah global seperti perintah substitusi. Aturannya sama: Anda dapat menggunakan karakter byte tunggal apa pun kecuali huruf, angka, `"`, `|`, dan `\`.

Untuk menghapus baris yang mengandung "console":

```shell
:g@console@d
```

Jika Anda menggunakan perintah substitusi dengan perintah global, Anda dapat memiliki dua pembatas yang berbeda:

```shell
g@one@s+const+let+g
```

Di sini perintah global akan mencari semua baris yang mengandung "one". Perintah substitusi akan mengganti, dari kecocokan tersebut, string "const" dengan "let".

## Perintah Default

Apa yang terjadi jika Anda tidak menentukan perintah baris perintah apa pun dalam perintah global?

Perintah global akan menggunakan perintah cetak (`:p`) untuk mencetak teks baris saat ini. Jika Anda menjalankan:

```shell
:g/console
```

Ini akan mencetak di bagian bawah layar semua baris yang mengandung "console".

Ngomong-ngomong, berikut adalah satu fakta menarik. Karena perintah default yang digunakan oleh perintah global adalah `p`, ini membuat sintaks `g` menjadi:

```shell
:g/re/p
```

- `g` = perintah global
- `re` = pola regex
- `p` = perintah cetak

Ini mengeja *"grep"*, sama dengan `grep` dari baris perintah. Ini **bukan** kebetulan. Perintah `g/re/p` awalnya berasal dari Editor Ed, salah satu editor teks baris asli. Perintah `grep` mendapatkan namanya dari Ed.

Komputer Anda mungkin masih memiliki editor Ed. Jalankan `ed` dari terminal (petunjuk: untuk keluar, ketik `q`).

## Membalik Seluruh Buffer

Untuk membalik seluruh file, jalankan:

```shell
:g/^/m 0
```

`^` adalah pola untuk awal baris. Gunakan `^` untuk mencocokkan semua baris, termasuk baris kosong.

Jika Anda perlu membalik hanya beberapa baris, operasikan rentang. Untuk membalik baris antara baris lima hingga sepuluh, jalankan:

```shell
:5,10g/^/m 0
```

Untuk mempelajari lebih lanjut tentang perintah pindah, lihat `:h :move`.

## Mengumpulkan Semua TODO

Saat coding, terkadang saya menulis TODO di file yang saya edit:

```shell
const one = 1;
console.log("one: ", one);
// TODO: beri makan anak anjing

const two = 2;
// TODO: beri makan anak anjing secara otomatis
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: buat startup menjual pengumpan anak anjing otomatis
```

Sulit untuk melacak semua TODO yang dibuat. Vim memiliki metode `:t` (salin) untuk menyalin semua kecocokan ke alamat. Untuk mempelajari lebih lanjut tentang metode salin, lihat `:h :copy`.

Untuk menyalin semua TODO ke akhir file untuk introspeksi yang lebih mudah, jalankan:

```shell
:g/TODO/t $
```

Hasil:

```shell
const one = 1;
console.log("one: ", one);
// TODO: beri makan anak anjing

const two = 2;
// TODO: beri makan anak anjing secara otomatis
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: buat startup menjual pengumpan anak anjing otomatis

// TODO: beri makan anak anjing
// TODO: beri makan anak anjing secara otomatis
// TODO: buat startup menjual pengumpan anak anjing otomatis
```

Sekarang saya dapat meninjau semua TODO yang saya buat, menemukan waktu untuk melakukannya atau mendelegasikannya kepada orang lain, dan melanjutkan untuk mengerjakan tugas saya berikutnya.

Jika alih-alih menyalinnya Anda ingin memindahkan semua TODO ke akhir, gunakan perintah pindah, `:m`:

```shell
:g/TODO/m $
```

Hasil:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: beri makan anak anjing
// TODO: beri makan anak anjing secara otomatis
// TODO: buat startup menjual pengumpan anak anjing otomatis
```

## Hapus Lubang Hitam

Ingat dari bab register bahwa teks yang dihapus disimpan di dalam register bernomor (diberikan bahwa mereka cukup besar). Setiap kali Anda menjalankan `:g/console/d`, Vim menyimpan baris yang dihapus di register bernomor. Jika Anda menghapus banyak baris, Anda dapat dengan cepat mengisi semua register bernomor. Untuk menghindari ini, Anda selalu dapat menggunakan register lubang hitam (`"_`) untuk *tidak* menyimpan baris yang dihapus ke dalam register. Jalankan:

```shell
:g/console/d_
```

Dengan memberikan `_` setelah `d`, Vim tidak akan menggunakan register scratch Anda.
## Mengurangi Beberapa Baris Kosong Menjadi Satu Baris Kosong

Jika Anda memiliki teks dengan beberapa baris kosong:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Anda dapat dengan cepat mengurangi baris kosong menjadi satu baris kosong dengan:

```shell
:g/^$/,/./-1j
```

Hasil:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Biasanya perintah global menerima bentuk berikut: `:g/pattern/command`. Namun, Anda juga dapat menjalankan perintah global dengan bentuk berikut: `:g/pattern1/,/pattern2/command`. Dengan ini, Vim akan menerapkan `command` di dalam `pattern1` dan `pattern2`.

Dengan pemahaman itu, mari kita uraikan perintah `:g/^$/,/./-1j` sesuai dengan `:g/pattern1/,/pattern2/command`:
- `/pattern1/` adalah `/^$/`. Ini mewakili baris kosong (baris tanpa karakter).
- `/pattern2/` adalah `/./` dengan modifikasi baris `-1`. `/./` mewakili baris yang tidak kosong (baris dengan setidaknya satu karakter). `-1` berarti baris di atasnya.
- `command` adalah `j`, perintah gabung (`:j`). Dalam konteks ini, perintah global ini menggabungkan semua baris yang diberikan.

Ngomong-ngomong, jika Anda ingin mengurangi beberapa baris kosong menjadi tidak ada baris, jalankan ini sebagai gantinya:

```shell
:g/^$/,/./j
```

Alternatif yang lebih sederhana:

```shell
:g/^$/-j
```

Teks Anda sekarang telah dikurangi menjadi:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Pengurutan Lanjutan

Vim memiliki perintah `:sort` untuk mengurutkan baris dalam rentang. Misalnya:

```shell
d
b
a
e
c
```

Anda dapat mengurutkannya dengan menjalankan `:sort`. Jika Anda memberikan rentang, itu hanya akan mengurutkan baris dalam rentang tersebut. Misalnya, `:3,5sort` hanya mengurutkan baris tiga dan lima.

Jika Anda memiliki ekspresi berikut:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Jika Anda perlu mengurutkan elemen di dalam array, tetapi bukan array itu sendiri, Anda dapat menjalankan ini:

```shell
:g/\[/+1,/\]/-1sort
```

Hasil:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

Ini luar biasa! Tetapi perintahnya terlihat rumit. Mari kita uraikan. Perintah ini juga mengikuti bentuk `:g/pattern1/,/pattern2/command`.

- `:g` adalah pola perintah global.
- `/\[/+1` adalah pola pertama. Ini mencocokkan tanda kurung siku kiri "[". `+1` mengacu pada baris di bawahnya.
- `/\]/-1` adalah pola kedua. Ini mencocokkan tanda kurung siku kanan "]". `-1` mengacu pada baris di atasnya.
- `/\[/+1,/\]/-1` kemudian mengacu pada semua baris antara "[" dan "]".
- `sort` adalah perintah baris perintah untuk mengurutkan.

## Pelajari Perintah Global dengan Cara Cerdas

Perintah global mengeksekusi perintah baris perintah terhadap semua baris yang cocok. Dengan ini, Anda hanya perlu menjalankan perintah sekali dan Vim akan melakukan sisanya untuk Anda. Untuk menjadi mahir dalam perintah global, dua hal diperlukan: kosakata yang baik dari perintah baris perintah dan pengetahuan tentang ekspresi reguler. Saat Anda menghabiskan lebih banyak waktu menggunakan Vim, Anda akan secara alami belajar lebih banyak perintah baris perintah. Pengetahuan tentang ekspresi reguler akan memerlukan pendekatan yang lebih aktif. Tetapi setelah Anda merasa nyaman dengan ekspresi reguler, Anda akan lebih unggul dari banyak orang.

Beberapa contoh di sini rumit. Jangan merasa terintimidasi. Luangkan waktu Anda untuk memahaminya. Pelajari cara membaca pola. Jangan menyerah.

Setiap kali Anda perlu menjalankan beberapa perintah, berhenti sejenak dan lihat apakah Anda dapat menggunakan perintah `g`. Identifikasi perintah terbaik untuk pekerjaan tersebut dan tulis pola untuk menargetkan sebanyak mungkin hal sekaligus.

Sekarang Anda tahu seberapa kuat perintah global, mari kita pelajari cara menggunakan perintah eksternal untuk meningkatkan arsenal alat Anda.