---
description: Hướng dẫn này giới thiệu cách khởi động Vim từ terminal, cài đặt và các
  tính năng cơ bản của trình soạn thảo văn bản modal Vim.
title: Ch01. Starting Vim
---

Trong chương này, bạn sẽ học các cách khác nhau để khởi động Vim từ terminal. Tôi đã sử dụng Vim 8.2 khi viết hướng dẫn này. Nếu bạn sử dụng Neovim hoặc một phiên bản cũ hơn của Vim, bạn sẽ hầu như không gặp vấn đề gì, nhưng hãy lưu ý rằng một số lệnh có thể không khả dụng.

## Cài đặt

Tôi sẽ không đi qua hướng dẫn chi tiết cách cài đặt Vim trên một máy cụ thể. Tin tốt là, hầu hết các máy tính dựa trên Unix nên đã có Vim được cài đặt sẵn. Nếu không, hầu hết các bản phân phối nên có một số hướng dẫn để cài đặt Vim.

Để tải thêm thông tin về quy trình cài đặt Vim, hãy kiểm tra trang web tải xuống chính thức của Vim hoặc kho github chính thức của Vim:
- [Trang web Vim](https://www.vim.org/download.php)
- [Vim github](https://github.com/vim/vim)

## Lệnh Vim

Bây giờ bạn đã cài đặt Vim, hãy chạy lệnh này từ terminal:

```bash
vim
```

Bạn sẽ thấy một màn hình giới thiệu. Đây là nơi bạn sẽ làm việc trên tệp mới của mình. Khác với hầu hết các trình soạn thảo văn bản và IDE, Vim là một trình soạn thảo theo chế độ. Nếu bạn muốn gõ "hello", bạn cần chuyển sang chế độ chèn bằng cách nhấn `i`. Nhấn `ihello<Esc>` để chèn văn bản "hello".

## Thoát khỏi Vim

Có nhiều cách để thoát khỏi Vim. Cách phổ biến nhất là gõ:

```shell
:quit
```

Bạn có thể gõ `:q` cho ngắn gọn. Lệnh đó là một lệnh trong chế độ dòng lệnh (một chế độ khác của Vim). Nếu bạn gõ `:` trong chế độ bình thường, con trỏ sẽ di chuyển xuống dưới màn hình nơi bạn có thể gõ một số lệnh. Bạn sẽ học về chế độ dòng lệnh sau trong chương 15. Nếu bạn đang ở chế độ chèn, gõ `:` sẽ tạo ra ký tự ":" trên màn hình. Trong trường hợp này, bạn cần quay lại chế độ bình thường. Gõ `<Esc>` để chuyển sang chế độ bình thường. Nhân tiện, bạn cũng có thể quay lại chế độ bình thường từ chế độ dòng lệnh bằng cách nhấn `<Esc>`. Bạn sẽ nhận thấy rằng bạn có thể "thoát" khỏi nhiều chế độ Vim trở lại chế độ bình thường bằng cách nhấn `<Esc>`.

## Lưu tệp

Để lưu thay đổi của bạn, gõ:

```shell
:write
```

Bạn cũng có thể gõ `:w` cho ngắn gọn. Nếu đây là một tệp mới, bạn cần đặt tên cho nó trước khi có thể lưu. Hãy đặt tên cho nó là `file.txt`. Chạy:

```shell
:w file.txt
```

Để lưu và thoát, bạn có thể kết hợp các lệnh `:w` và `:q`:

```shell
:wq
```

Để thoát mà không lưu bất kỳ thay đổi nào, thêm `!` sau `:q` để buộc thoát:

```shell
:q!
```

Có những cách khác để thoát khỏi Vim, nhưng đây là những cách bạn sẽ sử dụng hàng ngày.

## Trợ giúp

Trong suốt hướng dẫn này, tôi sẽ giới thiệu cho bạn các trang trợ giúp khác nhau của Vim. Bạn có thể vào trang trợ giúp bằng cách gõ `:help {some-command}` (`:h` cho ngắn gọn). Bạn có thể truyền cho lệnh `:h` một chủ đề hoặc tên lệnh làm đối số. Ví dụ, để tìm hiểu về các cách khác nhau để thoát khỏi Vim, gõ:

```shell
:h write-quit
```

Làm thế nào tôi biết để tìm kiếm "write-quit"? Thực ra tôi không biết. Tôi chỉ gõ `:h`, sau đó "quit", rồi `<Tab>`. Vim hiển thị các từ khóa liên quan để chọn từ. Nếu bạn cần tra cứu điều gì đó ("Tôi ước Vim có thể làm điều này..."), chỉ cần gõ `:h` và thử một số từ khóa, sau đó `<Tab>`.

## Mở tệp

Để mở một tệp (`hello1.txt`) trên Vim từ terminal, chạy:

```bash
vim hello1.txt
```

Bạn cũng có thể mở nhiều tệp cùng một lúc:

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim mở `hello1.txt`, `hello2.txt`, và `hello3.txt` trong các bộ đệm riêng biệt. Bạn sẽ tìm hiểu về bộ đệm trong chương tiếp theo.

## Đối số

Bạn có thể truyền lệnh terminal `vim` với các cờ và tùy chọn khác nhau.

Để kiểm tra phiên bản Vim hiện tại, chạy:

```bash
vim --version
```

Điều này cho bạn biết phiên bản Vim hiện tại và tất cả các tính năng khả dụng được đánh dấu bằng `+` hoặc `-`. Một số tính năng trong hướng dẫn này yêu cầu một số tính năng nhất định phải khả dụng. Ví dụ, bạn sẽ khám phá lịch sử dòng lệnh của Vim trong một chương sau với lệnh `:history`. Vim của bạn cần có tính năng `+cmdline_history` để lệnh hoạt động. Có khả năng lớn rằng Vim bạn vừa cài đặt có tất cả các tính năng cần thiết, đặc biệt nếu nó đến từ một nguồn tải xuống phổ biến.

Nhiều điều bạn làm từ terminal cũng có thể được thực hiện từ bên trong Vim. Để xem phiên bản từ *bên trong* Vim, bạn có thể chạy lệnh này:

```shell
:version
```

Nếu bạn muốn mở tệp `hello.txt` và ngay lập tức thực hiện một lệnh Vim, bạn có thể truyền cho lệnh `vim` tùy chọn `+{cmd}`.

Trong Vim, bạn có thể thay thế chuỗi bằng lệnh `:s` (viết tắt cho `:substitute`). Nếu bạn muốn mở `hello.txt` và thay thế tất cả "pancake" bằng "bagel", chạy:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Các lệnh Vim này có thể được xếp chồng lên nhau:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim sẽ thay thế tất cả các trường hợp của "pancake" bằng "bagel", sau đó thay thế "bagel" bằng "egg", sau đó thay thế "egg" bằng "donut" (bạn sẽ học về thay thế trong một chương sau).

Bạn cũng có thể truyền tùy chọn `-c` theo sau là một lệnh Vim thay vì cú pháp `+`:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Mở nhiều cửa sổ

Bạn có thể khởi động Vim trên các cửa sổ chia theo chiều ngang và chiều dọc với các tùy chọn `-o` và `-O`, tương ứng.

Để mở Vim với hai cửa sổ ngang, chạy:

```bash
vim -o2
```

Để mở Vim với 5 cửa sổ ngang, chạy:

```bash
vim -o5
```

Để mở Vim với 5 cửa sổ ngang và lấp đầy hai cửa sổ đầu tiên bằng `hello1.txt` và `hello2.txt`, chạy:

```bash
vim -o5 hello1.txt hello2.txt
```

Để mở Vim với hai cửa sổ dọc, 5 cửa sổ dọc, và 5 cửa sổ dọc với 2 tệp:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Tạm dừng

Nếu bạn cần tạm dừng Vim trong khi đang chỉnh sửa, bạn có thể nhấn `Ctrl-z`. Bạn cũng có thể chạy lệnh `:stop` hoặc `:suspend`. Để quay lại Vim đã tạm dừng, chạy `fg` từ terminal.

## Khởi động Vim theo cách thông minh

Lệnh `vim` có thể nhận nhiều tùy chọn khác nhau, giống như bất kỳ lệnh terminal nào khác. Hai tùy chọn cho phép bạn truyền một lệnh Vim như một tham số: `+{cmd}` và `-c cmd`. Khi bạn học thêm nhiều lệnh trong suốt hướng dẫn này, hãy xem liệu bạn có thể áp dụng chúng khi khởi động Vim. Cũng là một lệnh terminal, bạn có thể kết hợp `vim` với nhiều lệnh terminal khác. Ví dụ, bạn có thể chuyển hướng đầu ra của lệnh `ls` để được chỉnh sửa trong Vim với `ls -l | vim -`.

Để tìm hiểu thêm về lệnh `vim` trong terminal, hãy kiểm tra `man vim`. Để tìm hiểu thêm về trình soạn thảo Vim, hãy tiếp tục đọc hướng dẫn này cùng với lệnh `:help`.