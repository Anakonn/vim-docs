---
description: Panduan ini menjembatani antara `vimtutor` dan manual `:help`, menyoroti
  fitur kunci Vim untuk membantu pengguna belajar dengan cepat dan efektif.
title: Ch00. Read This First
---

## Mengapa Panduan Ini Ditulis

Ada banyak tempat untuk belajar Vim: `vimtutor` adalah tempat yang bagus untuk memulai dan manual `:help` memiliki semua referensi yang akan Anda butuhkan.

Namun, pengguna rata-rata membutuhkan sesuatu yang lebih dari `vimtutor` dan kurang dari manual `:help`. Panduan ini mencoba menjembatani kesenjangan itu dengan menyoroti hanya fitur kunci untuk mempelajari bagian-bagian paling berguna dari Vim dalam waktu yang paling sedikit.

Kemungkinan Anda tidak akan membutuhkan 100% fitur Vim. Anda mungkin hanya perlu mengetahui sekitar 20% dari mereka untuk menjadi Vimmer yang kuat. Panduan ini akan menunjukkan fitur Vim mana yang akan Anda temukan paling berguna.

Ini adalah panduan yang bersifat opini. Ini mencakup teknik yang sering saya gunakan saat menggunakan Vim. Bab-bab diurutkan berdasarkan apa yang saya pikir akan membuat paling logis bagi pemula untuk belajar Vim.

Panduan ini kaya akan contoh. Ketika mempelajari keterampilan baru, contoh sangat penting, memiliki banyak contoh akan memperkuat konsep-konsep ini dengan lebih efektif.

Beberapa dari Anda mungkin bertanya mengapa Anda perlu belajar Vimscript? Di tahun pertama saya menggunakan Vim, saya merasa puas hanya dengan mengetahui cara menggunakan Vim. Waktu berlalu dan saya mulai membutuhkan Vimscript lebih banyak untuk menulis perintah kustom untuk kebutuhan pengeditan spesifik saya. Saat Anda menguasai Vim, Anda sooner atau later akan perlu belajar Vimscript. Jadi mengapa tidak lebih cepat? Vimscript adalah bahasa kecil. Anda dapat mempelajari dasar-dasarnya hanya dalam empat bab panduan ini.

Anda dapat melangkah jauh menggunakan Vim tanpa mengetahui Vimscript, tetapi mengetahuinya akan membantu Anda unggul lebih jauh.

Panduan ini ditulis untuk Vimmer pemula dan lanjutan. Ini dimulai dengan konsep yang luas dan sederhana dan diakhiri dengan konsep yang spesifik dan lanjutan. Jika Anda sudah pengguna lanjutan, saya akan mendorong Anda untuk membaca panduan ini dari awal hingga akhir, karena Anda akan belajar sesuatu yang baru!

## Cara Beralih ke Vim Dari Menggunakan Editor Teks yang Berbeda

Belajar Vim adalah pengalaman yang memuaskan, meskipun sulit. Ada dua pendekatan utama untuk belajar Vim:

1. Cold turkey
2. Bertahap

Beralih secara langsung berarti berhenti menggunakan editor / IDE apa pun yang Anda gunakan dan mulai menggunakan Vim secara eksklusif mulai sekarang. Kekurangan dari metode ini adalah Anda akan mengalami kehilangan produktivitas yang serius selama satu atau dua minggu pertama. Jika Anda seorang programmer penuh waktu, metode ini mungkin tidak layak. Itulah sebabnya bagi kebanyakan orang, saya percaya cara terbaik untuk beralih ke Vim adalah menggunakannya secara bertahap.

Untuk menggunakan Vim secara bertahap, selama dua minggu pertama, luangkan satu jam sehari menggunakan Vim sebagai editor Anda sementara waktu yang tersisa Anda dapat menggunakan editor lain. Banyak editor modern dilengkapi dengan plugin Vim. Ketika saya pertama kali mulai, saya menggunakan plugin Vim populer di VSCode selama satu jam per hari. Saya secara bertahap meningkatkan waktu dengan plugin Vim sampai akhirnya saya menggunakannya sepanjang hari. Ingatlah bahwa plugin ini hanya dapat meniru sebagian kecil dari fitur Vim. Untuk merasakan kekuatan penuh Vim seperti Vimscript, Perintah Command-line (Ex), dan integrasi perintah eksternal, Anda perlu menggunakan Vim itu sendiri.

Ada dua momen penting yang membuat saya mulai menggunakan Vim 100%: ketika saya memahami bahwa Vim memiliki struktur seperti tata bahasa (lihat bab 4) dan plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (lihat bab 3).

Yang pertama, ketika saya menyadari struktur seperti tata bahasa Vim, adalah momen penentu ketika saya akhirnya mengerti apa yang dibicarakan oleh pengguna Vim ini. Saya tidak perlu belajar ratusan perintah unik. Saya hanya perlu belajar sedikit perintah dan saya bisa menghubungkannya dengan cara yang sangat intuitif untuk melakukan banyak hal.

Yang kedua, kemampuan untuk dengan cepat menjalankan pencarian file fuzzy adalah fitur IDE yang paling sering saya gunakan. Ketika saya belajar bagaimana melakukannya di Vim, saya mendapatkan peningkatan kecepatan yang besar dan tidak pernah melihat ke belakang sejak saat itu.

Setiap orang memprogram dengan cara yang berbeda. Setelah introspeksi, Anda akan menemukan bahwa ada satu atau dua fitur dari editor / IDE favorit Anda yang selalu Anda gunakan. Mungkin itu adalah pencarian fuzzy, loncat ke definisi, atau kompilasi cepat. Apa pun itu, identifikasi dengan cepat dan pelajari cara mengimplementasikannya di Vim (kemungkinan besar Vim juga bisa melakukannya). Kecepatan pengeditan Anda akan menerima dorongan besar.

Setelah Anda dapat mengedit dengan 50% dari kecepatan asli, saatnya untuk beralih sepenuhnya ke Vim.

## Cara Membaca Panduan Ini

Ini adalah panduan praktis. Untuk menjadi baik dalam Vim, Anda perlu mengembangkan memori otot Anda, bukan pengetahuan kepala.

Anda tidak belajar cara mengendarai sepeda dengan membaca panduan tentang cara mengendarai sepeda. Anda perlu benar-benar mengendarai sepeda.

Anda perlu mengetik setiap perintah yang disebutkan dalam panduan ini. Tidak hanya itu, tetapi Anda juga perlu mengulanginya beberapa kali dan mencoba kombinasi yang berbeda. Cari tahu fitur lain apa yang dimiliki perintah yang baru saja Anda pelajari. Perintah `:help` dan mesin pencari adalah teman terbaik Anda. Tujuan Anda bukan untuk mengetahui segala sesuatu tentang suatu perintah, tetapi untuk dapat mengeksekusi perintah itu secara alami dan naluriah.

Sebanyak saya berusaha membuat panduan ini linier, beberapa konsep dalam panduan ini harus disajikan di luar urutan. Misalnya, di bab 1, saya menyebutkan perintah pengganti (`:s`), meskipun itu tidak akan dibahas sampai bab 12. Untuk mengatasi ini, setiap kali konsep baru yang belum dibahas disebutkan lebih awal, saya akan memberikan panduan cepat tentang cara melakukannya tanpa penjelasan terperinci. Jadi harap bersabar dengan saya :).

## Bantuan Lebih Lanjut

Berikut adalah satu tips tambahan untuk menggunakan manual bantuan: misalkan Anda ingin belajar lebih banyak tentang apa yang dilakukan `Ctrl-P` dalam mode sisip. Jika Anda hanya mencari `:h CTRL-P`, Anda akan diarahkan ke `Ctrl-P` mode normal. Ini bukan bantuan `Ctrl-P` yang Anda cari. Dalam hal ini, cari saja `:h i_CTRL-P`. `i_` yang ditambahkan mewakili mode sisip. Perhatikan mode mana itu.

## Sintaks

Sebagian besar frasa yang terkait dengan perintah atau kode berada dalam format kode (`seperti ini`).

String dikelilingi oleh sepasang tanda kutip ganda ("seperti ini").

Perintah Vim dapat disingkat. Misalnya, `:join` dapat disingkat menjadi `:j`. Sepanjang panduan ini, saya akan mencampur deskripsi singkat dan panjang. Untuk perintah yang tidak sering digunakan dalam panduan ini, saya akan menggunakan versi panjang. Untuk perintah yang sering digunakan, saya akan menggunakan versi singkat. Saya mohon maaf atas ketidakkonsistenan ini. Secara umum, setiap kali Anda menemukan perintah baru, selalu periksa di `:help` untuk melihat singkatannya.

## Vimrc

Di berbagai titik dalam panduan, saya akan merujuk pada opsi vimrc. Jika Anda baru mengenal Vim, vimrc seperti file konfigurasi.

Vimrc tidak akan dibahas sampai bab 21. Untuk kejelasan, saya akan menunjukkan secara singkat di sini cara mengaturnya.

Misalkan Anda perlu mengatur opsi nomor (`set number`). Jika Anda belum memiliki vimrc, buatlah satu. Biasanya ditempatkan di direktori rumah Anda dan dinamai `.vimrc`. Tergantung pada OS Anda, lokasi dapat berbeda. Di macOS, saya menyimpannya di `~/.vimrc`. Untuk melihat di mana Anda harus menempatkan milik Anda, lihat `:h vimrc`.

Di dalamnya, tambahkan `set number`. Simpan (`:w`), lalu sumber (`:source %`). Anda sekarang harus melihat nomor baris ditampilkan di sisi kiri.

Sebagai alternatif, jika Anda tidak ingin membuat perubahan pengaturan permanen, Anda selalu dapat menjalankan perintah `set` secara inline, dengan menjalankan `:set number`. Kekurangan dari pendekatan ini adalah pengaturan ini bersifat sementara. Ketika Anda menutup Vim, opsi tersebut hilang.

Karena kita sedang belajar tentang Vim dan bukan Vi, pengaturan yang harus Anda miliki adalah opsi `nocompatible`. Tambahkan `set nocompatible` di vimrc Anda. Banyak fitur spesifik Vim dinonaktifkan ketika berjalan pada opsi `compatible`.

Secara umum, setiap kali sebuah bagian menyebutkan opsi vimrc, cukup tambahkan opsi itu ke vimrc, simpan, dan sumber.

## Masa Depan, Kesalahan, Pertanyaan

Harapkan lebih banyak pembaruan di masa depan. Jika Anda menemukan kesalahan atau memiliki pertanyaan, silakan hubungi.

Saya juga telah merencanakan beberapa bab mendatang, jadi tetaplah terhubung!

## Saya Ingin Lebih Banyak Trik Vim

Untuk belajar lebih banyak tentang Vim, silakan ikuti [@learnvim](https://twitter.com/learnvim).

## Terima Kasih

Panduan ini tidak akan mungkin ada tanpa Bram Moleenar yang menciptakan Vim, istri saya yang telah sangat sabar dan mendukung sepanjang perjalanan, semua [kontributor](https://github.com/iggredible/Learn-Vim/graphs/contributors) proyek learn-vim, komunitas Vim, dan banyak, banyak orang lain yang tidak disebutkan.

Terima kasih. Kalian semua membantu membuat pengeditan teks menjadi menyenangkan :)