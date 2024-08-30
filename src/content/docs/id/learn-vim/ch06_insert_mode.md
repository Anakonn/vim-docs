---
description: Dokumen ini menjelaskan cara menggunakan mode sisip di Vim untuk meningkatkan
  efisiensi mengetik, serta berbagai cara untuk masuk ke mode sisip.
title: Ch06. Insert Mode
---

Mode penyisipan adalah mode default dari banyak editor teks. Dalam mode ini, apa yang Anda ketik adalah apa yang Anda dapatkan.

Namun, itu tidak berarti tidak ada banyak yang bisa dipelajari. Mode penyisipan Vim mengandung banyak fitur berguna. Dalam bab ini, Anda akan belajar bagaimana menggunakan fitur mode penyisipan ini di Vim untuk meningkatkan efisiensi mengetik Anda.

## Cara Masuk ke Mode Penyisipan

Ada banyak cara untuk masuk ke mode penyisipan dari mode normal. Berikut adalah beberapa di antaranya:

```shell
i    Sisipkan teks sebelum kursor
I    Sisipkan teks sebelum karakter non-kosong pertama dari baris
a    Tambahkan teks setelah kursor
A    Tambahkan teks di akhir baris
o    Memulai baris baru di bawah kursor dan sisipkan teks
O    Memulai baris baru di atas kursor dan sisipkan teks
s    Hapus karakter di bawah kursor dan sisipkan teks
S    Hapus baris saat ini dan sisipkan teks, sinonim untuk "cc"
gi   Sisipkan teks di posisi yang sama di mana mode penyisipan terakhir dihentikan
gI   Sisipkan teks di awal baris (kolom 1)
```

Perhatikan pola huruf kecil / huruf besar. Untuk setiap perintah huruf kecil, ada pasangan huruf besar. Jika Anda baru, jangan khawatir jika Anda tidak mengingat seluruh daftar di atas. Mulailah dengan `i` dan `o`. Mereka seharusnya cukup untuk memulai Anda. Secara bertahap pelajari lebih banyak seiring waktu.

## Cara Berbeda untuk Keluar dari Mode Penyisipan

Ada beberapa cara berbeda untuk kembali ke mode normal saat berada di mode penyisipan:

```shell
<Esc>     Keluar dari mode penyisipan dan masuk ke mode normal
Ctrl-[    Keluar dari mode penyisipan dan masuk ke mode normal
Ctrl-C    Seperti Ctrl-[ dan <Esc>, tetapi tidak memeriksa singkatan
```

Saya menemukan tombol `<Esc>` terlalu jauh untuk dijangkau, jadi saya memetakan `<Caps-Lock>` komputer saya untuk berfungsi seperti `<Esc>`. Jika Anda mencari keyboard ADM-3A milik Bill Joy (pencipta Vi), Anda akan melihat bahwa tombol `<Esc>` tidak terletak di pojok kiri atas seperti keyboard modern, tetapi di sebelah kiri tombol `q`. Inilah sebabnya saya pikir masuk akal untuk memetakan `<Caps lock>` ke `<Esc>`.

Konvensi umum lainnya yang saya lihat dilakukan oleh pengguna Vim adalah memetakan `<Esc>` ke `jj` atau `jk` dalam mode penyisipan. Jika Anda lebih suka opsi ini, tambahkan salah satu dari baris tersebut (atau keduanya) di file vimrc Anda.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Mengulangi Mode Penyisipan

Anda dapat memberikan parameter hitung sebelum memasuki mode penyisipan. Misalnya:

```shell
10i
```

Jika Anda mengetik "hello world!" dan keluar dari mode penyisipan, Vim akan mengulangi teks tersebut 10 kali. Ini akan bekerja dengan metode mode penyisipan apa pun (mis: `10I`, `11a`, `12o`).

## Menghapus Bagian dalam Mode Penyisipan

Ketika Anda melakukan kesalahan ketik, bisa merepotkan untuk mengetik `<Backspace>` berulang kali. Mungkin lebih masuk akal untuk masuk ke mode normal dan menghapus kesalahan Anda. Anda juga dapat menghapus beberapa karakter sekaligus saat berada di mode penyisipan.

```shell
Ctrl-h    Hapus satu karakter
Ctrl-w    Hapus satu kata
Ctrl-u    Hapus seluruh baris
```

## Menyisipkan dari Register

Register Vim dapat menyimpan teks untuk digunakan di masa mendatang. Untuk menyisipkan teks dari register bernama saat berada di mode penyisipan, ketik `Ctrl-R` ditambah simbol register. Ada banyak simbol yang dapat Anda gunakan, tetapi untuk bagian ini, mari kita bahas hanya register bernama (a-z).

Untuk melihatnya dalam aksi, pertama Anda perlu mengambil sebuah kata ke register a. Pindahkan kursor Anda ke kata mana pun. Kemudian ketik:

```shell
"ayiw
```

- `"a` memberi tahu Vim bahwa target dari tindakan Anda berikutnya akan masuk ke register a.
- `yiw` mengambil kata dalam. Tinjau bab tentang tata bahasa Vim untuk penyegaran.

Register a sekarang berisi kata yang baru saja Anda ambil. Saat berada di mode penyisipan, untuk menempelkan teks yang disimpan di register a:

```shell
Ctrl-R a
```

Ada beberapa jenis register di Vim. Saya akan membahasnya dengan lebih rinci di bab selanjutnya.

## Menggulir

Tahukah Anda bahwa Anda dapat menggulir saat berada di mode penyisipan? Saat berada di mode penyisipan, jika Anda masuk ke sub-mode `Ctrl-X`, Anda dapat melakukan operasi tambahan. Menggulir adalah salah satunya.

```shell
Ctrl-X Ctrl-Y    Gulir ke atas
Ctrl-X Ctrl-E    Gulir ke bawah
```

## Autocompletion

Seperti yang disebutkan di atas, jika Anda menekan `Ctrl-X` dari mode penyisipan, Vim akan masuk ke sub-mode. Anda dapat melakukan autocompletion teks saat berada di sub-mode penyisipan ini. Meskipun tidak sebaik [intellisense](https://code.visualstudio.com/docs/editor/intellisense) atau protokol server bahasa lainnya (LSP), tetapi untuk sesuatu yang tersedia langsung dari kotak, ini adalah fitur yang sangat mampu.

Berikut adalah beberapa perintah autocomplete berguna untuk memulai:

```shell
Ctrl-X Ctrl-L	   Sisipkan satu baris penuh
Ctrl-X Ctrl-N	   Sisipkan teks dari file saat ini
Ctrl-X Ctrl-I	   Sisipkan teks dari file yang disertakan
Ctrl-X Ctrl-F	   Sisipkan nama file
```

Ketika Anda memicu autocompletion, Vim akan menampilkan jendela pop-up. Untuk bernavigasi ke atas dan ke bawah jendela pop-up, gunakan `Ctrl-N` dan `Ctrl-P`.

Vim juga memiliki dua pintasan autocompletion yang tidak melibatkan sub-mode `Ctrl-X`:

```shell
Ctrl-N             Temukan kecocokan kata berikutnya
Ctrl-P             Temukan kecocokan kata sebelumnya
```

Secara umum, Vim melihat teks di semua buffer yang tersedia untuk sumber autocompletion. Jika Anda memiliki buffer terbuka dengan baris yang mengatakan "Donat cokelat adalah yang terbaik":
- Ketika Anda mengetik "Choco" dan melakukan `Ctrl-X Ctrl-L`, itu akan mencocokkan dan mencetak seluruh baris.
- Ketika Anda mengetik "Choco" dan melakukan `Ctrl-P`, itu akan mencocokkan dan mencetak kata "Cokelat".

Autocomplete adalah topik yang luas di Vim. Ini hanya permulaan. Untuk mempelajari lebih lanjut, lihat `:h ins-completion`.

## Menjalankan Perintah Mode Normal

Tahukah Anda bahwa Vim dapat menjalankan perintah mode normal saat berada di mode penyisipan?

Saat berada di mode penyisipan, jika Anda menekan `Ctrl-O`, Anda akan berada di sub-mode insert-normal. Jika Anda melihat indikator mode di kiri bawah, biasanya Anda akan melihat `-- INSERT --`, tetapi menekan `Ctrl-O` mengubahnya menjadi `-- (insert) --`. Dalam mode ini, Anda dapat melakukan *satu* perintah mode normal. Beberapa hal yang dapat Anda lakukan:

**Memusatkan dan melompat**

```shell
Ctrl-O zz       Pusatkan jendela
Ctrl-O H/M/L    Lompat ke atas/tengah/bawah jendela
Ctrl-O 'a       Lompat ke tanda a
```

**Mengulangi teks**

```shell
Ctrl-O 100ihello    Sisipkan "hello" 100 kali
```

**Menjalankan perintah terminal**

```shell
Ctrl-O !! curl https://google.com    Jalankan curl
Ctrl-O !! pwd                        Jalankan pwd
```

**Menghapus lebih cepat**

```shell
Ctrl-O dtz    Hapus dari lokasi saat ini hingga huruf "z"
Ctrl-O D      Hapus dari lokasi saat ini hingga akhir baris
```

## Pelajari Mode Penyisipan dengan Cara Cerdas

Jika Anda seperti saya dan berasal dari editor teks lain, mungkin tergoda untuk tetap berada di mode penyisipan. Namun, tetap berada di mode penyisipan ketika Anda tidak memasukkan teks adalah pola yang buruk. Kembangkan kebiasaan untuk masuk ke mode normal ketika jari Anda tidak mengetik teks baru.

Ketika Anda perlu menyisipkan teks, pertama-tama tanyakan pada diri sendiri apakah teks itu sudah ada. Jika ada, coba ambil atau pindahkan teks itu daripada mengetiknya. Jika Anda harus menggunakan mode penyisipan, lihat apakah Anda dapat melengkapi teks itu kapan pun memungkinkan. Hindari mengetik kata yang sama lebih dari sekali jika Anda bisa.