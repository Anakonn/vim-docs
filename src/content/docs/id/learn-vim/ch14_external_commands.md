---
description: Dokumen ini menjelaskan cara memperluas Vim untuk bekerja dengan perintah
  eksternal menggunakan perintah bang (`!`) untuk membaca, menulis, dan mengeksekusi.
title: Ch14. External Commands
---

Di dalam sistem Unix, Anda akan menemukan banyak perintah kecil yang sangat khusus yang melakukan satu hal (dan melakukannya dengan baik). Anda dapat menggabungkan perintah-perintah ini untuk bekerja sama menyelesaikan masalah yang kompleks. Bukankah akan sangat bagus jika Anda dapat menggunakan perintah-perintah ini dari dalam Vim?

Tentu saja. Dalam bab ini, Anda akan belajar bagaimana memperluas Vim untuk bekerja dengan lancar dengan perintah eksternal.

## Perintah Bang

Vim memiliki perintah bang (`!`) yang dapat melakukan tiga hal:

1. Membaca STDOUT dari perintah eksternal ke dalam buffer saat ini.
2. Menulis konten buffer Anda sebagai STDIN ke perintah eksternal.
3. Menjalankan perintah eksternal dari dalam Vim.

Mari kita bahas masing-masing.

## Membaca STDOUT dari Perintah ke Dalam Vim

Sintaks untuk membaca STDOUT dari perintah eksternal ke dalam buffer saat ini adalah:

```shell
:r !cmd
```

`:r` adalah perintah baca Vim. Jika Anda menggunakannya tanpa `!`, Anda dapat menggunakannya untuk mendapatkan konten dari sebuah file. Jika Anda memiliki file `file1.txt` di direktori saat ini dan Anda menjalankan:

```shell
:r file1.txt
```

Vim akan memasukkan konten dari `file1.txt` ke dalam buffer saat ini.

Jika Anda menjalankan perintah `:r` diikuti dengan `!` dan perintah eksternal, output dari perintah tersebut akan disisipkan ke dalam buffer saat ini. Untuk mendapatkan hasil dari perintah `ls`, jalankan:

```shell
:r !ls
```

Ini mengembalikan sesuatu seperti:

```shell
file1.txt
file2.txt
file3.txt
```

Anda dapat membaca data dari perintah `curl`:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

Perintah `r` juga menerima alamat:

```shell
:10r !cat file1.txt
```

Sekarang STDOUT dari menjalankan `cat file1.txt` akan disisipkan setelah baris 10.

## Menulis Konten Buffer ke Perintah Eksternal

Perintah `:w`, selain untuk menyimpan file, dapat digunakan untuk mengirim teks dalam buffer saat ini sebagai STDIN untuk perintah eksternal. Sintaksnya adalah:

```shell
:w !cmd
```

Jika Anda memiliki ekspresi berikut:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Pastikan Anda telah menginstal [node](https://nodejs.org/en/) di mesin Anda, lalu jalankan:

```shell
:w !node
```

Vim akan menggunakan `node` untuk mengeksekusi ekspresi JavaScript untuk mencetak "Hello Vim" dan "Vim is awesome".

Saat menggunakan perintah `:w`, Vim menggunakan semua teks dalam buffer saat ini, mirip dengan perintah global (kebanyakan perintah baris perintah, jika Anda tidak memberikan rentang, hanya mengeksekusi perintah terhadap baris saat ini). Jika Anda memberikan `:w` alamat tertentu:

```shell
:2w !node
```

Vim hanya menggunakan teks dari baris kedua ke dalam interpreter `node`.

Ada perbedaan halus tetapi signifikan antara `:w !node` dan `:w! node`. Dengan `:w !node`, Anda "menulis" teks dalam buffer saat ini ke perintah eksternal `node`. Dengan `:w! node`, Anda memaksa menyimpan file dan memberi nama file "node".

## Menjalankan Perintah Eksternal

Anda dapat menjalankan perintah eksternal dari dalam Vim dengan perintah bang. Sintaksnya adalah:

```shell
:!cmd
```

Untuk melihat konten direktori saat ini dalam format panjang, jalankan:

```shell
:!ls -ls
```

Untuk menghentikan proses yang sedang berjalan pada PID 3456, Anda dapat menjalankan:

```shell
:!kill -9 3456
```

Anda dapat menjalankan perintah eksternal tanpa meninggalkan Vim sehingga Anda dapat tetap fokus pada tugas Anda.

## Memfilter Teks

Jika Anda memberikan `!` sebuah rentang, itu dapat digunakan untuk memfilter teks. Misalkan Anda memiliki teks berikut:

```shell
hello vim
hello vim
```

Mari kita ubah huruf besar pada baris saat ini menggunakan perintah `tr` (translate). Jalankan:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Hasilnya:

```shell
HELLO VIM
hello vim
```

Rincian:
- `.!` menjalankan perintah filter pada baris saat ini.
- `tr '[:lower:]' '[:upper:]'` memanggil perintah `tr` untuk mengganti semua karakter huruf kecil dengan huruf besar.

Sangat penting untuk memberikan rentang untuk menjalankan perintah eksternal sebagai filter. Jika Anda mencoba menjalankan perintah di atas tanpa `.` (`:!tr '[:lower:]' '[:upper:]'`), Anda akan melihat kesalahan.

Mari kita anggap Anda perlu menghapus kolom kedua pada kedua baris dengan perintah `awk`:

```shell
:%!awk "{print $1}"
```

Hasilnya:

```shell
hello
hello
```

Rincian:
- `:%!` menjalankan perintah filter pada semua baris (`%`).
- `awk "{print $1}"` hanya mencetak kolom pertama dari hasil yang cocok.

Anda dapat menggabungkan beberapa perintah dengan operator rantai (`|`) sama seperti di terminal. Misalkan Anda memiliki file dengan item sarapan yang lezat ini:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Jika Anda perlu mengurutkannya berdasarkan harga dan menampilkan hanya menu dengan jarak yang merata, Anda dapat menjalankan:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Hasilnya:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

Rincian:
- `:%!` menerapkan filter ke semua baris (`%`).
- `awk 'NR > 1'` menampilkan teks hanya dari nomor baris dua ke atas.
- `|` menggabungkan perintah berikutnya.
- `sort -nk 3` mengurutkan secara numerik (`n`) menggunakan nilai dari kolom 3 (`k 3`).
- `column -t` mengatur teks dengan jarak yang merata.

## Perintah Mode Normal

Vim memiliki operator filter (`!`) dalam mode normal. Jika Anda memiliki salam berikut:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Untuk mengubah huruf besar pada baris saat ini dan baris di bawahnya, Anda dapat menjalankan:
```shell
!jtr '[a-z]' '[A-Z]'
```

Rincian:
- `!j` menjalankan operator filter perintah normal (`!`) yang menargetkan baris saat ini dan baris di bawahnya. Ingat bahwa karena ini adalah operator mode normal, aturan tata bahasa `kata kerja + kata benda` berlaku. `!` adalah kata kerja dan `j` adalah kata benda.
- `tr '[a-z]' '[A-Z]'` mengganti huruf kecil dengan huruf besar.

Perintah filter normal hanya berfungsi pada gerakan / objek teks yang panjangnya setidaknya satu baris atau lebih. Jika Anda mencoba menjalankan `!iwtr '[a-z]' '[A-Z]'` (menjalankan `tr` pada kata dalam), Anda akan menemukan bahwa itu menerapkan perintah `tr` pada seluruh baris, bukan pada kata yang sedang Anda kursor.

## Pelajari Perintah Eksternal dengan Cara Cerdas

Vim bukanlah IDE. Ini adalah editor modal ringan yang sangat dapat diperluas secara desain. Karena kemampuan perluasannya, Anda memiliki akses mudah ke perintah eksternal di sistem Anda. Dilengkapi dengan perintah eksternal ini, Vim semakin dekat untuk menjadi IDE. Seseorang mengatakan bahwa sistem Unix adalah IDE pertama yang pernah ada.

Perintah bang sama bergunanya dengan banyaknya perintah eksternal yang Anda ketahui. Jangan khawatir jika pengetahuan perintah eksternal Anda terbatas. Saya juga masih banyak yang perlu dipelajari. Anggap ini sebagai motivasi untuk pembelajaran berkelanjutan. Setiap kali Anda perlu memodifikasi teks, lihat apakah ada perintah eksternal yang dapat menyelesaikan masalah Anda. Jangan khawatir tentang menguasai semuanya, cukup pelajari yang Anda butuhkan untuk menyelesaikan tugas saat ini.