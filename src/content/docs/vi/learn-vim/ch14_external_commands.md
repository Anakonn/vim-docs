---
description: Tài liệu này hướng dẫn cách mở rộng Vim để làm việc với các lệnh bên
  ngoài, bao gồm đọc, ghi và thực thi lệnh từ bên trong Vim.
title: Ch14. External Commands
---

Bên trong hệ thống Unix, bạn sẽ tìm thấy nhiều lệnh nhỏ, siêu chuyên biệt chỉ làm một việc (và làm tốt điều đó). Bạn có thể kết hợp những lệnh này để làm việc cùng nhau nhằm giải quyết một vấn đề phức tạp. Liệu có tuyệt vời không nếu bạn có thể sử dụng những lệnh này từ bên trong Vim?

Chắc chắn rồi. Trong chương này, bạn sẽ học cách mở rộng Vim để làm việc liền mạch với các lệnh bên ngoài.

## Lệnh Bang

Vim có một lệnh bang (`!`) có thể làm ba điều:

1. Đọc STDOUT của một lệnh bên ngoài vào bộ đệm hiện tại.
2. Ghi nội dung của bộ đệm của bạn như STDIN cho một lệnh bên ngoài.
3. Thực thi một lệnh bên ngoài từ bên trong Vim.

Hãy cùng đi qua từng điều một.

## Đọc STDOUT của một Lệnh Vào Vim

Cú pháp để đọc STDOUT của một lệnh bên ngoài vào bộ đệm hiện tại là:

```shell
:r !cmd
```

`:r` là lệnh đọc của Vim. Nếu bạn sử dụng nó mà không có `!`, bạn có thể sử dụng nó để lấy nội dung của một tệp. Nếu bạn có một tệp `file1.txt` trong thư mục hiện tại và bạn chạy:

```shell
:r file1.txt
```

Vim sẽ đưa nội dung của `file1.txt` vào bộ đệm hiện tại.

Nếu bạn chạy lệnh `:r` theo sau là `!` và một lệnh bên ngoài, đầu ra của lệnh đó sẽ được chèn vào bộ đệm hiện tại. Để lấy kết quả của lệnh `ls`, hãy chạy:

```shell
:r !ls
```

Nó trả về một cái gì đó như:

```shell
file1.txt
file2.txt
file3.txt
```

Bạn có thể đọc dữ liệu từ lệnh `curl`:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

Lệnh `r` cũng chấp nhận một địa chỉ:

```shell
:10r !cat file1.txt
```

Bây giờ STDOUT từ việc chạy `cat file1.txt` sẽ được chèn sau dòng 10.

## Ghi Nội Dung Bộ Đệm Vào Một Lệnh Bên Ngoài

Lệnh `:w`, ngoài việc lưu một tệp, có thể được sử dụng để truyền văn bản trong bộ đệm hiện tại như STDIN cho một lệnh bên ngoài. Cú pháp là:

```shell
:w !cmd
```

Nếu bạn có những biểu thức này:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Đảm bảo bạn đã cài đặt [node](https://nodejs.org/en/) trên máy của bạn, sau đó chạy:

```shell
:w !node
```

Vim sẽ sử dụng `node` để thực thi các biểu thức JavaScript để in "Hello Vim" và "Vim is awesome".

Khi sử dụng lệnh `:w`, Vim sử dụng tất cả văn bản trong bộ đệm hiện tại, tương tự như lệnh toàn cục (hầu hết các lệnh dòng lệnh, nếu bạn không truyền cho nó một khoảng, chỉ thực thi lệnh đối với dòng hiện tại). Nếu bạn truyền cho `:w` một địa chỉ cụ thể:

```shell
:2w !node
```

Vim chỉ sử dụng văn bản từ dòng thứ hai vào trình thông dịch `node`.

Có một sự khác biệt tinh tế nhưng quan trọng giữa `:w !node` và `:w! node`. Với `:w !node`, bạn đang "ghi" văn bản trong bộ đệm hiện tại vào lệnh bên ngoài `node`. Với `:w! node`, bạn đang buộc lưu một tệp và đặt tên cho tệp là "node".

## Thực Thi Một Lệnh Bên Ngoài

Bạn có thể thực thi một lệnh bên ngoài từ bên trong Vim với lệnh bang. Cú pháp là:

```shell
:!cmd
```

Để xem nội dung của thư mục hiện tại theo định dạng dài, hãy chạy:

```shell
:!ls -ls
```

Để giết một tiến trình đang chạy trên PID 3456, bạn có thể chạy:

```shell
:!kill -9 3456
```

Bạn có thể chạy bất kỳ lệnh bên ngoài nào mà không cần rời khỏi Vim để bạn có thể tập trung vào nhiệm vụ của mình.

## Lọc Văn Bản

Nếu bạn cung cấp `!` một khoảng, nó có thể được sử dụng để lọc văn bản. Giả sử bạn có những văn bản sau:

```shell
hello vim
hello vim
```

Hãy chuyển đổi chữ thường thành chữ hoa cho dòng hiện tại bằng lệnh `tr` (dịch). Chạy:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Kết quả:

```shell
HELLO VIM
hello vim
```

Phân tích:
- `.!` thực thi lệnh lọc trên dòng hiện tại.
- `tr '[:lower:]' '[:upper:]'` gọi lệnh `tr` để thay thế tất cả các ký tự chữ thường bằng chữ hoa.

Rất quan trọng để truyền một khoảng để chạy lệnh bên ngoài như một bộ lọc. Nếu bạn cố gắng chạy lệnh trên mà không có `.` (`:!tr '[:lower:]' '[:upper:]'`), bạn sẽ thấy một lỗi.

Giả sử bạn cần xóa cột thứ hai trên cả hai dòng bằng lệnh `awk`:

```shell
:%!awk "{print $1}"
```

Kết quả:

```shell
hello
hello
```

Phân tích:
- `:%!` thực thi lệnh lọc trên tất cả các dòng (`%`).
- `awk "{print $1}"` chỉ in cột đầu tiên của kết quả.

Bạn có thể kết hợp nhiều lệnh với toán tử chuỗi (`|`) giống như trong terminal. Giả sử bạn có một tệp với những món ăn sáng ngon lành này:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Nếu bạn cần sắp xếp chúng dựa trên giá và chỉ hiển thị thực đơn với khoảng cách đều, bạn có thể chạy:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Kết quả:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

Phân tích:
- `:%!` áp dụng bộ lọc cho tất cả các dòng (`%`).
- `awk 'NR > 1'` chỉ hiển thị văn bản từ dòng số hai trở đi.
- `|` kết hợp lệnh tiếp theo.
- `sort -nk 3` sắp xếp theo số (`n`) sử dụng giá trị từ cột 3 (`k 3`).
- `column -t` tổ chức văn bản với khoảng cách đều.

## Lệnh Chế Độ Bình Thường

Vim có một toán tử lọc (`!`) trong chế độ bình thường. Nếu bạn có những lời chào sau:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Để chuyển đổi chữ thường thành chữ hoa cho dòng hiện tại và dòng bên dưới, bạn có thể chạy:
```shell
!jtr '[a-z]' '[A-Z]'
```

Phân tích:
- `!j` chạy toán tử lọc lệnh bình thường (`!`) nhắm vào dòng hiện tại và dòng bên dưới. Nhớ rằng vì đây là một toán tử chế độ bình thường, quy tắc ngữ pháp `động từ + danh từ` áp dụng. `!` là động từ và `j` là danh từ.
- `tr '[a-z]' '[A-Z]'` thay thế các chữ cái thường bằng chữ hoa.

Lệnh lọc bình thường chỉ hoạt động trên các chuyển động / đối tượng văn bản có ít nhất một dòng hoặc dài hơn. Nếu bạn đã cố gắng chạy `!iwtr '[a-z]' '[A-Z]'` (thực thi `tr` trên từ bên trong), bạn sẽ thấy rằng nó áp dụng lệnh `tr` cho toàn bộ dòng, không phải từ mà con trỏ của bạn đang ở.

## Học Các Lệnh Bên Ngoài Một Cách Thông Minh

Vim không phải là một IDE. Nó là một trình soạn thảo modal nhẹ nhàng được thiết kế có khả năng mở rộng cao. Nhờ vào khả năng mở rộng này, bạn có thể dễ dàng truy cập bất kỳ lệnh bên ngoài nào trong hệ thống của bạn. Được trang bị những lệnh bên ngoài này, Vim tiến gần hơn một bước để trở thành một IDE. Ai đó đã nói rằng hệ thống Unix là IDE đầu tiên từng có.

Lệnh bang hữu ích như số lượng lệnh bên ngoài mà bạn biết. Đừng lo lắng nếu kiến thức lệnh bên ngoài của bạn còn hạn chế. Tôi cũng còn nhiều điều để học. Hãy coi đây là động lực cho việc học tập liên tục. Mỗi khi bạn cần sửa đổi một văn bản, hãy xem có lệnh bên ngoài nào có thể giải quyết vấn đề của bạn không. Đừng lo lắng về việc thành thạo mọi thứ, chỉ cần học những gì bạn cần để hoàn thành nhiệm vụ hiện tại.