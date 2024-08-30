---
description: Dokumen ini menjelaskan konsep buffer, jendela, dan tab di Vim, serta
  cara mengonfigurasi vimrc untuk pengalaman pengeditan yang lebih efisien.
title: Ch02. Buffers, Windows, and Tabs
---

Jika Anda pernah menggunakan editor teks modern sebelumnya, Anda mungkin sudah familiar dengan jendela dan tab. Vim menggunakan tiga abstraksi tampilan alih-alih dua: buffer, jendela, dan tab. Dalam bab ini, saya akan menjelaskan apa itu buffer, jendela, dan tab serta bagaimana cara kerjanya di Vim.

Sebelum Anda mulai, pastikan Anda memiliki opsi `set hidden` di vimrc. Tanpa itu, setiap kali Anda beralih buffer dan buffer saat ini tidak disimpan, Vim akan meminta Anda untuk menyimpan file (Anda tidak ingin itu jika Anda ingin bergerak cepat). Saya belum membahas vimrc. Jika Anda tidak memiliki vimrc, buatlah satu. Biasanya terletak di direktori home Anda dan dinamai `.vimrc`. Saya memiliki milik saya di `~/.vimrc`. Untuk melihat di mana Anda harus membuat vimrc, lihat `:h vimrc`. Di dalamnya, tambahkan:

```shell
set hidden
```

Simpan, lalu sumberkan (jalankan `:source %` dari dalam vimrc).

## Buffer

Apa itu *buffer*?

Buffer adalah ruang dalam memori di mana Anda dapat menulis dan mengedit beberapa teks. Ketika Anda membuka file di Vim, data terikat pada buffer. Ketika Anda membuka 3 file di Vim, Anda memiliki 3 buffer.

Siapkan dua file kosong, `file1.js` dan `file2.js` (jika memungkinkan, buatlah dengan Vim). Jalankan ini di terminal:

```bash
vim file1.js
```

Apa yang Anda lihat adalah *buffer* `file1.js`. Setiap kali Anda membuka file baru, Vim membuat buffer baru.

Keluar dari Vim. Kali ini, buka dua file baru:

```bash
vim file1.js file2.js
```

Vim saat ini menampilkan buffer `file1.js`, tetapi sebenarnya membuat dua buffer: buffer `file1.js` dan buffer `file2.js`. Jalankan `:buffers` untuk melihat semua buffer (sebagai alternatif, Anda juga bisa menggunakan `:ls` atau `:files`). Anda harus melihat *keduanya* `file1.js` dan `file2.js` terdaftar. Menjalankan `vim file1 file2 file3 ... filen` membuat n jumlah buffer. Setiap kali Anda membuka file baru, Vim membuat buffer baru untuk file tersebut.

Ada beberapa cara untuk menjelajahi buffer:
- `:bnext` untuk pergi ke buffer berikutnya (`:bprevious` untuk pergi ke buffer sebelumnya).
- `:buffer` + nama file. Vim dapat menyelesaikan nama file dengan `<Tab>`.
- `:buffer` + `n`, di mana `n` adalah nomor buffer. Misalnya, mengetik `:buffer 2` akan membawa Anda ke buffer #2.
- Melompat ke posisi yang lebih lama dalam daftar lompatan dengan `Ctrl-O` dan ke posisi yang lebih baru dengan `Ctrl-I`. Ini bukan metode spesifik buffer, tetapi dapat digunakan untuk melompat antara buffer yang berbeda. Saya akan menjelaskan lompatan lebih detail di Bab 5.
- Pergi ke buffer yang diedit sebelumnya dengan `Ctrl-^`.

Setelah Vim membuat buffer, ia akan tetap ada dalam daftar buffer Anda. Untuk menghapusnya, Anda dapat mengetik `:bdelete`. Ini juga dapat menerima nomor buffer sebagai parameter (`:bdelete 3` untuk menghapus buffer #3) atau nama file (`:bdelete` kemudian gunakan `<Tab>` untuk menyelesaikan).

Hal tersulit bagi saya saat belajar tentang buffer adalah memvisualisasikan bagaimana cara kerjanya karena pikiran saya terbiasa dengan jendela dari saat menggunakan editor teks mainstream. Analogi yang baik adalah dek kartu bermain. Jika saya memiliki 2 buffer, saya memiliki tumpukan 2 kartu. Kartu di atas adalah satu-satunya kartu yang saya lihat, tetapi saya tahu ada kartu di bawahnya. Jika saya melihat buffer `file1.js` ditampilkan, maka kartu `file1.js` ada di atas dek. Saya tidak bisa melihat kartu lainnya, `file2.js` di sini, tetapi itu ada. Jika saya beralih buffer ke `file2.js`, kartu `file2.js` sekarang ada di atas dek dan kartu `file1.js` ada di bawahnya.

Jika Anda belum pernah menggunakan Vim sebelumnya, ini adalah konsep baru. Luangkan waktu Anda untuk memahaminya.

## Keluar dari Vim

Omong-omong, jika Anda memiliki beberapa buffer terbuka, Anda dapat menutup semuanya dengan quit-all:

```shell
:qall
```

Jika Anda ingin menutup tanpa menyimpan perubahan Anda, cukup tambahkan `!` di akhir:

```shell
:qall!
```

Untuk menyimpan dan keluar dari semua, jalankan:

```shell
:wqall
```

## Jendela

Sebuah jendela adalah tampilan pada sebuah buffer. Jika Anda berasal dari editor mainstream, konsep ini mungkin sudah familiar bagi Anda. Kebanyakan editor teks memiliki kemampuan untuk menampilkan beberapa jendela. Di Vim, Anda juga dapat memiliki beberapa jendela.

Mari buka `file1.js` dari terminal lagi:

```bash
vim file1.js
```

Sebelumnya saya menulis bahwa Anda melihat buffer `file1.js`. Meskipun itu benar, pernyataan itu tidak lengkap. Anda melihat buffer `file1.js`, ditampilkan melalui **sebuah jendela**. Jendela adalah cara Anda melihat buffer.

Jangan keluar dari Vim dulu. Jalankan:

```shell
:split file2.js
```

Sekarang Anda melihat dua buffer melalui **dua jendela**. Jendela atas menampilkan buffer `file2.js`. Jendela bawah menampilkan buffer `file1.js`.

Jika Anda ingin bernavigasi antara jendela, gunakan pintasan ini:

```shell
Ctrl-W H    Memindahkan kursor ke jendela kiri
Ctrl-W J    Memindahkan kursor ke jendela di bawah
Ctrl-W K    Memindahkan kursor ke jendela di atas
Ctrl-W L    Memindahkan kursor ke jendela kanan
```

Sekarang jalankan:

```shell
:vsplit file3.js
```

Anda sekarang melihat tiga jendela yang menampilkan tiga buffer. Satu jendela menampilkan buffer `file3.js`, jendela lainnya menampilkan buffer `file2.js`, dan jendela lainnya menampilkan buffer `file1.js`.

Anda dapat memiliki beberapa jendela yang menampilkan buffer yang sama. Saat Anda berada di jendela kiri atas, ketik:

```shell
:buffer file2.js
```

Sekarang kedua jendela menampilkan buffer `file2.js`. Jika Anda mulai mengetik di jendela `file2.js`, Anda akan melihat bahwa kedua jendela yang menampilkan buffer `file2.js` diperbarui secara real-time.

Untuk menutup jendela saat ini, Anda dapat menjalankan `Ctrl-W C` atau mengetik `:quit`. Ketika Anda menutup jendela, buffer akan tetap ada (jalankan `:buffers` untuk mengonfirmasi ini).

Berikut adalah beberapa perintah jendela mode normal yang berguna:

```shell
Ctrl-W V    Membuka split baru secara vertikal
Ctrl-W S    Membuka split baru secara horizontal
Ctrl-W C    Menutup sebuah jendela
Ctrl-W O    Membuat jendela saat ini menjadi satu-satunya di layar dan menutup jendela lainnya
```

Dan berikut adalah daftar perintah baris perintah jendela yang berguna:

```shell
:vsplit filename    Membagi jendela secara vertikal
:split filename     Membagi jendela secara horizontal
:new filename       Membuat jendela baru
```

Luangkan waktu Anda untuk memahaminya. Untuk informasi lebih lanjut, lihat `:h window`.

## Tab

Sebuah tab adalah kumpulan jendela. Anggap saja seperti tata letak untuk jendela. Di sebagian besar editor teks modern (dan browser internet modern), sebuah tab berarti sebuah file / halaman yang terbuka dan ketika Anda menutupnya, file / halaman itu menghilang. Di Vim, sebuah tab tidak mewakili sebuah file yang dibuka. Ketika Anda menutup sebuah tab di Vim, Anda tidak menutup sebuah file. Anda hanya menutup tata letak. File-file yang dibuka dalam tata letak itu masih belum ditutup, mereka masih terbuka di buffer mereka.

Mari kita lihat tab Vim dalam aksi. Buka `file1.js`:

```bash
vim file1.js
```

Untuk membuka `file2.js` di tab baru:

```shell
:tabnew file2.js
```

Anda juga dapat membiarkan Vim menyelesaikan file yang ingin Anda buka di *tab baru* dengan menekan `<Tab>` (tanpa maksud lain).

Berikut adalah daftar navigasi tab yang berguna:

```shell
:tabnew file.txt    Buka file.txt di tab baru
:tabclose           Tutup tab saat ini
:tabnext            Pergi ke tab berikutnya
:tabprevious        Pergi ke tab sebelumnya
:tablast            Pergi ke tab terakhir
:tabfirst           Pergi ke tab pertama
```

Anda juga dapat menjalankan `gt` untuk pergi ke halaman tab berikutnya (Anda dapat pergi ke tab sebelumnya dengan `gT`). Anda dapat memberikan hitungan sebagai argumen untuk `gt`, di mana hitungan adalah nomor tab. Untuk pergi ke tab ketiga, lakukan `3gt`.

Salah satu keuntungan memiliki beberapa tab adalah Anda dapat memiliki pengaturan jendela yang berbeda di tab yang berbeda. Mungkin Anda ingin tab pertama Anda memiliki 3 jendela vertikal dan tab kedua memiliki tata letak jendela horizontal dan vertikal campuran. Tab adalah alat yang sempurna untuk pekerjaan ini!

Untuk memulai Vim dengan beberapa tab, Anda dapat melakukan ini dari terminal:

```bash
vim -p file1.js file2.js file3.js
```

## Bergerak dalam 3D

Bergerak antara jendela seperti bepergian secara dua dimensi di sepanjang sumbu X-Y dalam koordinat Kartesius. Anda dapat bergerak ke jendela atas, kanan, bawah, dan kiri dengan `Ctrl-W H/J/K/L`.

Bergerak antara buffer seperti bepergian di sepanjang sumbu Z dalam koordinat Kartesius. Bayangkan file buffer Anda berbaris di sepanjang sumbu Z. Anda dapat menjelajahi sumbu Z satu buffer pada satu waktu dengan `:bnext` dan `:bprevious`. Anda dapat melompat ke koordinat mana pun di sumbu Z dengan `:buffer filename/buffernumber`.

Anda dapat bergerak di *ruang tiga dimensi* dengan menggabungkan pergerakan jendela dan buffer. Anda dapat bergerak ke jendela atas, kanan, bawah, atau kiri (navigasi X-Y) dengan pergerakan jendela. Karena setiap jendela berisi buffer, Anda dapat bergerak maju dan mundur (navigasi Z) dengan pergerakan buffer.

## Menggunakan Buffer, Jendela, dan Tab dengan Cara yang Cerdas

Anda telah belajar apa itu buffer, jendela, dan tab serta bagaimana cara kerjanya di Vim. Sekarang Anda lebih memahaminya, Anda dapat menggunakannya dalam alur kerja Anda sendiri.

Setiap orang memiliki alur kerja yang berbeda, berikut adalah milik saya sebagai contoh:
- Pertama, saya menggunakan buffer untuk menyimpan semua file yang diperlukan untuk tugas saat ini. Vim dapat menangani banyak buffer terbuka sebelum mulai melambat. Selain itu, memiliki banyak buffer terbuka tidak akan membuat layar saya sesak. Saya hanya melihat satu buffer (asumsikan saya hanya memiliki satu jendela) pada satu waktu, memungkinkan saya untuk fokus pada satu layar. Ketika saya perlu pergi ke suatu tempat, saya dapat dengan cepat terbang ke buffer terbuka kapan saja.
- Saya menggunakan beberapa jendela untuk melihat beberapa buffer sekaligus, biasanya saat membandingkan file, membaca dokumen, atau mengikuti alur kode. Saya berusaha menjaga jumlah jendela yang terbuka tidak lebih dari tiga karena layar saya akan menjadi sesak (saya menggunakan laptop kecil). Ketika saya selesai, saya menutup jendela tambahan. Semakin sedikit jendela berarti semakin sedikit gangguan.
- Alih-alih tab, saya menggunakan jendela [tmux](https://github.com/tmux/tmux/wiki). Saya biasanya menggunakan beberapa jendela tmux sekaligus. Misalnya, satu jendela tmux untuk kode sisi klien dan satu lagi untuk kode backend.

Alur kerja saya mungkin terlihat berbeda dari Anda berdasarkan gaya pengeditan Anda dan itu tidak masalah. Bereksperimenlah untuk menemukan alur Anda sendiri, sesuai dengan gaya pengkodean Anda.