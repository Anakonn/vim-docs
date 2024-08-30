---
description: Panduan ini menjelaskan berbagai cara untuk mengedit beberapa file sekaligus
  di Vim, termasuk perintah seperti `argdo`, `bufdo`, dan lainnya.
title: Ch21. Multiple File Operations
---

Mampu memperbarui di beberapa file adalah alat pengeditan yang berguna untuk dimiliki. Sebelumnya, Anda telah belajar bagaimana memperbarui beberapa teks dengan `cfdo`. Di bab ini, Anda akan belajar berbagai cara untuk mengedit beberapa file di Vim.

## Berbagai Cara Menjalankan Perintah di Beberapa File

Vim memiliki delapan cara untuk menjalankan perintah di beberapa file:
- daftar argumen (`argdo`)
- daftar buffer (`bufdo`)
- daftar jendela (`windo`)
- daftar tab (`tabdo`)
- daftar quickfix (`cdo`)
- daftar quickfix berdasarkan file (`cfdo`)
- daftar lokasi (`ldo`)
- daftar lokasi berdasarkan file (`lfdo`)

Secara praktis, Anda mungkin hanya akan menggunakan satu atau dua sebagian besar waktu (saya pribadi menggunakan `cdo` dan `argdo` lebih dari yang lain), tetapi baik untuk mempelajari semua opsi yang tersedia dan menggunakan yang sesuai dengan gaya pengeditan Anda.

Mempelajari delapan perintah mungkin terdengar menakutkan. Namun pada kenyataannya, perintah-perintah ini bekerja dengan cara yang mirip. Setelah mempelajari satu, mempelajari yang lainnya akan menjadi lebih mudah. Mereka semua memiliki ide besar yang sama: buat daftar dari kategori masing-masing lalu berikan perintah yang ingin Anda jalankan.

## Daftar Argumen

Daftar argumen adalah daftar yang paling dasar. Ini membuat daftar file. Untuk membuat daftar file1, file2, dan file3, Anda dapat menjalankan:

```shell
:args file1 file2 file3
```

Anda juga dapat memberikannya wildcard (`*`), jadi jika Anda ingin membuat daftar semua file `.js` di direktori saat ini, jalankan:

```shell
:args *.js
```

Jika Anda ingin membuat daftar semua file Javascript yang dimulai dengan "a" di direktori saat ini, jalankan:

```shell
:args a*.js
```

Wildcard mencocokkan satu atau lebih karakter nama file di direktori saat ini, tetapi bagaimana jika Anda perlu mencari secara rekursif di direktori mana pun? Anda dapat menggunakan double wildcard (`**`). Untuk mendapatkan semua file Javascript di dalam direktori dalam lokasi Anda saat ini, jalankan:

```shell
:args **/*.js
```

Setelah Anda menjalankan perintah `args`, buffer saat ini akan beralih ke item pertama dalam daftar. Untuk melihat daftar file yang baru saja Anda buat, jalankan `:args`. Setelah Anda membuat daftar Anda, Anda dapat menjelajahinya. `:first` akan menempatkan Anda di item pertama dalam daftar. `:last` akan menempatkan Anda di daftar terakhir. Untuk bergerak maju satu file pada satu waktu, jalankan `:next`. Untuk bergerak mundur satu file pada satu waktu, jalankan `:prev`. Untuk bergerak maju / mundur satu file pada satu waktu dan menyimpan perubahan, jalankan `:wnext` dan `:wprev`. Ada banyak lagi perintah navigasi. Periksa `:h arglist` untuk lebih lanjut.

Daftar argumen berguna jika Anda perlu menargetkan jenis file tertentu atau beberapa file. Mungkin Anda perlu memperbarui semua "donut" menjadi "pancake" di dalam semua file `yml`, Anda dapat melakukan:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```
Jika Anda menjalankan perintah `args` lagi, itu akan menggantikan daftar sebelumnya. Misalnya, jika Anda sebelumnya menjalankan:

```shell
:args file1 file2 file3
```

Dengan asumsi file-file ini ada, Anda sekarang memiliki daftar `file1`, `file2`, dan `file3`. Kemudian Anda menjalankan ini:

```shell
:args file4 file5
```

Daftar awal Anda dari `file1`, `file2`, dan `file3` digantikan dengan `file4` dan `file5`. Jika Anda memiliki `file1`, `file2`, dan `file3` dalam daftar argumen Anda dan Anda ingin *menambahkan* `file4` dan `file5` ke dalam daftar file awal Anda, gunakan perintah `:arga`. Jalankan:

```shell
:arga file4 file5
```

Sekarang Anda memiliki `file1`, `file2`, `file3`, `file4`, dan `file5` dalam daftar argumen Anda.

Jika Anda menjalankan `:arga` tanpa argumen, Vim akan menambahkan buffer saat ini ke dalam daftar argumen saat ini. Jika Anda sudah memiliki `file1`, `file2`, dan `file3` dalam daftar argumen Anda dan buffer saat ini berada di `file5`, menjalankan `:arga` akan menambahkan `file5` ke dalam daftar.

Setelah Anda memiliki daftar, Anda dapat mengoperasikannya dengan perintah baris perintah apa pun yang Anda pilih. Anda telah melihatnya dilakukan dengan substitusi (`:argdo %s/donut/pancake/g`). Beberapa contoh lainnya:
- Untuk menghapus semua baris yang mengandung "dessert" di seluruh daftar argumen, jalankan `:argdo g/dessert/d`.
- Untuk menjalankan makro a (dengan asumsi Anda telah merekam sesuatu di makro a) di seluruh daftar argumen, jalankan `:argdo norm @a`.
- Untuk menulis "hello " diikuti oleh nama file di baris pertama, jalankan `:argdo 0put='hello ' .. @:`.

Setelah Anda selesai, jangan lupa untuk menyimpannya dengan `:update`.

Terkadang Anda perlu menjalankan perintah hanya pada n item pertama dari daftar argumen. Jika itu yang terjadi, cukup berikan alamat ke perintah `argdo`. Misalnya, untuk menjalankan perintah substitusi hanya pada 3 item pertama dari daftar, jalankan `:1,3argdo %s/donut/pancake/g`.

## Daftar Buffer

Daftar buffer akan dibuat secara organik ketika Anda mengedit file baru karena setiap kali Anda membuat file baru / membuka file, Vim menyimpannya dalam buffer (kecuali Anda secara eksplisit menghapusnya). Jadi jika Anda sudah membuka 3 file: `file1.rb file2.rb file3.rb`, Anda sudah memiliki 3 item dalam daftar buffer Anda. Untuk menampilkan daftar buffer, jalankan `:buffers` (alternatif: `:ls` atau `:files`). Untuk menjelajah maju dan mundur, gunakan `:bnext` dan `:bprev`. Untuk pergi ke buffer pertama dan terakhir dari daftar, gunakan `:bfirst` dan `:blast` (masih bersenang-senang? :D).

Omong-omong, berikut adalah trik buffer yang keren yang tidak terkait dengan bab ini: jika Anda memiliki sejumlah item dalam daftar buffer Anda, Anda dapat menampilkan semuanya dengan `:ball` (buffer semua). Perintah `ball` menampilkan semua buffer secara horizontal. Untuk menampilkannya secara vertikal, jalankan `:vertical ball`.

Kembali ke topik, mekanisme untuk menjalankan operasi di semua buffer mirip dengan daftar argumen. Setelah Anda membuat daftar buffer Anda, Anda hanya perlu menambahkan perintah yang ingin Anda jalankan dengan `:bufdo` alih-alih `:argdo`. Jadi jika Anda ingin mengganti semua "donut" dengan "pancake" di semua buffer dan kemudian menyimpan perubahan, jalankan `:bufdo %s/donut/pancake/g | update`.

## Daftar Jendela dan Tab

Daftar jendela dan tab juga mirip dengan daftar argumen dan buffer. Satu-satunya perbedaan adalah konteks dan sintaksis mereka.

Operasi jendela dilakukan pada setiap jendela yang terbuka dan dilakukan dengan `:windo`. Operasi tab dilakukan pada setiap tab yang Anda buka dan dilakukan dengan `:tabdo`. Untuk lebih lanjut, periksa `:h list-repeat`, `:h :windo`, dan `:h :tabdo`.

Misalnya, jika Anda memiliki tiga jendela terbuka (Anda dapat membuka jendela baru dengan `Ctrl-W v` untuk jendela vertikal dan `Ctrl-W s` untuk jendela horizontal) dan Anda menjalankan `:windo 0put ='hello' . @%`, Vim akan mengeluarkan "hello" + nama file ke semua jendela yang terbuka.

## Daftar Quickfix

Di bab sebelumnya (Ch3 dan Ch19), saya telah berbicara tentang quickfix. Quickfix memiliki banyak kegunaan. Banyak plugin populer menggunakan quickfix, jadi baik untuk menghabiskan lebih banyak waktu untuk memahaminya.

Jika Anda baru mengenal Vim, quickfix mungkin merupakan konsep baru. Di masa lalu ketika Anda benar-benar harus secara eksplisit mengompilasi kode Anda, selama fase kompilasi Anda akan menemui kesalahan. Untuk menampilkan kesalahan ini, Anda memerlukan jendela khusus. Di sinilah quickfix berperan. Ketika Anda mengompilasi kode Anda, Vim menampilkan pesan kesalahan di jendela quickfix sehingga Anda dapat memperbaikinya nanti. Banyak bahasa modern tidak memerlukan kompilasi eksplisit lagi, tetapi itu tidak membuat quickfix menjadi usang. Saat ini, orang menggunakan quickfix untuk segala macam hal, seperti menampilkan output terminal virtual dan menyimpan hasil pencarian. Mari kita fokus pada yang terakhir, menyimpan hasil pencarian.

Selain perintah kompilasi, perintah Vim tertentu bergantung pada antarmuka quickfix. Salah satu jenis perintah yang banyak menggunakan quickfix adalah perintah pencarian. Baik `:vimgrep` dan `:grep` menggunakan quickfix secara default.

Misalnya, jika Anda perlu mencari "donut" di semua file Javascript secara rekursif, Anda dapat menjalankan:

```shell
:vimgrep /donut/ **/*.js
```

Hasil pencarian "donut" disimpan di jendela quickfix. Untuk melihat hasil pencocokan ini di jendela quickfix, jalankan:

```shell
:copen
```

Untuk menutupnya, jalankan:

```shell
:cclose
```

Untuk menjelajah daftar quickfix maju dan mundur, jalankan:

```shell
:cnext
:cprev
```

Untuk pergi ke item pertama dan terakhir dalam pencocokan, jalankan:

```shell
:cfirst
:clast
```

Sebelumnya saya menyebutkan bahwa ada dua perintah quickfix: `cdo` dan `cfdo`. Apa perbedaannya? `cdo` menjalankan perintah untuk setiap item dalam daftar quickfix sementara `cfdo` menjalankan perintah untuk setiap *file* dalam daftar quickfix.

Izinkan saya menjelaskan. Misalkan setelah menjalankan perintah `vimgrep` di atas, Anda menemukan:
- 1 hasil di `file1.js`
- 10 hasil di `file2.js`

Jika Anda menjalankan `:cfdo %s/donut/pancake/g`, ini secara efektif akan menjalankan `%s/donut/pancake/g` sekali di `file1.js` dan sekali di `file2.js`. Ini berjalan *sebanyak jumlah file yang ada dalam pencocokan.* Karena ada dua file dalam hasil, Vim menjalankan perintah substitusi sekali di `file1.js` dan sekali lagi di `file2.js`, meskipun ada 10 pencocokan di file kedua. `cfdo` hanya peduli tentang berapa banyak total file yang ada dalam daftar quickfix.

Jika Anda menjalankan `:cdo %s/donut/pancake/g`, ini secara efektif akan menjalankan `%s/donut/pancake/g` sekali di `file1.js` dan *sepuluh kali* di `file2.js`. Ini berjalan sebanyak jumlah item aktual dalam daftar quickfix. Karena hanya ada satu pencocokan yang ditemukan di `file1.js` dan 10 pencocokan yang ditemukan di `file2.js`, itu akan berjalan total 11 kali.

Karena Anda menjalankan `%s/donut/pancake/g`, masuk akal untuk menggunakan `cfdo`. Tidak masuk akal untuk menggunakan `cdo` karena itu akan menjalankan `%s/donut/pancake/g` sepuluh kali di `file2.js` (`%s` adalah substitusi di seluruh file). Menjalankan `%s` sekali per file sudah cukup. Jika Anda menggunakan `cdo`, akan lebih masuk akal untuk mengoperasikannya dengan `s/donut/pancake/g` sebagai gantinya.

Saat memutuskan apakah akan menggunakan `cfdo` atau `cdo`, pikirkan tentang cakupan perintah yang Anda berikan. Apakah ini adalah perintah di seluruh file (seperti `:%s` atau `:g`) atau apakah ini adalah perintah per baris (seperti `:s` atau `:!`)?

## Daftar Lokasi

Daftar lokasi mirip dengan daftar quickfix dalam arti bahwa Vim juga menggunakan jendela khusus untuk menampilkan pesan. Perbedaan antara daftar quickfix dan daftar lokasi adalah bahwa pada waktu tertentu, Anda hanya dapat memiliki satu daftar quickfix, sedangkan Anda dapat memiliki sebanyak mungkin daftar lokasi sesuai dengan jumlah jendela.

Misalkan Anda memiliki dua jendela terbuka, satu jendela menampilkan `food.txt` dan jendela lainnya menampilkan `drinks.txt`. Dari dalam `food.txt`, Anda menjalankan perintah pencarian daftar lokasi `:lvimgrep` (varian lokasi untuk perintah `:vimgrep`):

```shell
:lvim /bagel/ **/*.md
```

Vim akan membuat daftar lokasi dari semua pencocokan pencarian bagel untuk *jendela* `food.txt` tersebut. Anda dapat melihat daftar lokasi dengan `:lopen`. Sekarang pergi ke jendela lainnya `drinks.txt` dan jalankan:

```shell
:lvimgrep /milk/ **/*.md
```

Vim akan membuat daftar lokasi *terpisah* dengan semua hasil pencarian susu untuk *jendela* `drinks.txt`.

Untuk setiap perintah lokasi yang Anda jalankan di setiap jendela, Vim membuat daftar lokasi yang berbeda. Jika Anda memiliki 10 jendela yang berbeda, Anda dapat memiliki hingga 10 daftar lokasi yang berbeda. Bandingkan ini dengan daftar quickfix di mana Anda hanya dapat memiliki satu pada waktu tertentu. Jika Anda memiliki 10 jendela yang berbeda, Anda tetap hanya mendapatkan satu daftar quickfix.

Sebagian besar perintah daftar lokasi mirip dengan perintah quickfix kecuali bahwa mereka diawali dengan `l-` sebagai gantinya. Misalnya: `:lvimgrep`, `:lgrep`, dan `:lmake` vs `:vimgrep`, `:grep`, dan `:make`. Untuk memanipulasi jendela daftar lokasi, sekali lagi, perintahnya terlihat mirip dengan perintah quickfix `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext`, dan `:lprev` vs `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext`, dan `:cprev`.

Dua perintah multi-file daftar lokasi juga mirip dengan perintah multi-file quickfix: `:ldo` dan `:lfdo`. `:ldo` menjalankan perintah lokasi di setiap daftar lokasi sementara `:lfdo` menjalankan perintah daftar lokasi untuk setiap file dalam daftar lokasi. Untuk lebih lanjut, periksa `:h location-list`.
## Menjalankan Operasi Beberapa File di Vim

Mengetahui cara melakukan operasi beberapa file adalah keterampilan yang berguna dalam pengeditan. Setiap kali Anda perlu mengubah nama variabel di beberapa file, Anda ingin mengeksekusinya dalam satu langkah. Vim memiliki delapan cara berbeda untuk melakukan ini.

Secara praktis, Anda mungkin tidak akan menggunakan semua delapan dengan sama. Anda akan cenderung memilih satu atau dua. Ketika Anda mulai, pilih satu (saya pribadi menyarankan untuk memulai dengan daftar argumen `:argdo`) dan kuasai itu. Setelah Anda merasa nyaman dengan satu, pelajari yang berikutnya. Anda akan menemukan bahwa belajar yang kedua, ketiga, dan keempat menjadi lebih mudah. Jadilah kreatif. Gunakan dengan kombinasi yang berbeda. Terus berlatih sampai Anda dapat melakukan ini tanpa usaha dan tanpa banyak berpikir. Jadikan ini bagian dari memori otot Anda.

Dengan demikian, Anda telah menguasai pengeditan Vim. Selamat!