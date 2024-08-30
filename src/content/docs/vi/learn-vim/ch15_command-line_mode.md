---
description: Tài liệu này hướng dẫn cách sử dụng chế độ dòng lệnh trong Vim, bao gồm
  các lệnh tìm kiếm, thay thế và mẹo hữu ích cho người dùng.
title: Ch15. Command-line Mode
---

Trong ba chương cuối cùng, bạn đã học cách sử dụng các lệnh tìm kiếm (`/`, `?`), lệnh thay thế (`:s`), lệnh toàn cục (`:g`), và lệnh bên ngoài (`!`). Đây là những ví dụ về các lệnh trong chế độ dòng lệnh.

Trong chương này, bạn sẽ học nhiều mẹo và thủ thuật cho chế độ dòng lệnh.

## Nhập và Thoát Chế Độ Dòng Lệnh

Chế độ dòng lệnh là một chế độ riêng biệt, giống như chế độ bình thường, chế độ chèn, và chế độ hình ảnh. Khi bạn ở trong chế độ này, con trỏ sẽ di chuyển đến dưới cùng của màn hình nơi bạn có thể nhập các lệnh khác nhau.

Có 4 lệnh khác nhau bạn có thể sử dụng để vào chế độ dòng lệnh:
- Mẫu tìm kiếm (`/`, `?`)
- Lệnh dòng lệnh (`:`)
- Lệnh bên ngoài (`!`)

Bạn có thể vào chế độ dòng lệnh từ chế độ bình thường hoặc chế độ hình ảnh.

Để thoát khỏi chế độ dòng lệnh, bạn có thể sử dụng `<Esc>`, `Ctrl-C`, hoặc `Ctrl-[`.

*Các tài liệu khác có thể gọi "lệnh dòng lệnh" là "lệnh Ex" và "lệnh bên ngoài" là "lệnh lọc" hoặc "toán tử bang".*

## Lặp Lại Lệnh Trước

Bạn có thể lặp lại lệnh dòng lệnh hoặc lệnh bên ngoài trước đó với `@:`.

Nếu bạn vừa chạy `:s/foo/bar/g`, chạy `@:` sẽ lặp lại sự thay thế đó. Nếu bạn vừa chạy `:.!tr '[a-z]' '[A-Z]'`, chạy `@:` sẽ lặp lại bộ lọc dịch lệnh bên ngoài cuối cùng.

## Phím Tắt Chế Độ Dòng Lệnh

Trong chế độ dòng lệnh, bạn có thể di chuyển sang trái hoặc phải, từng ký tự một, với phím mũi tên `Trái` hoặc `Phải`.

Nếu bạn cần di chuyển theo từ, hãy sử dụng `Shift-Trái` hoặc `Shift-Phải` (trong một số hệ điều hành, bạn có thể phải sử dụng `Ctrl` thay vì `Shift`).

Để đến đầu dòng, sử dụng `Ctrl-B`. Để đến cuối dòng, sử dụng `Ctrl-E`.

Tương tự như chế độ chèn, bên trong chế độ dòng lệnh, bạn có ba cách để xóa ký tự:

```shell
Ctrl-H    Xóa một ký tự
Ctrl-W    Xóa một từ
Ctrl-U    Xóa toàn bộ dòng
```
Cuối cùng, nếu bạn muốn chỉnh sửa lệnh như bạn làm với một tệp văn bản bình thường, hãy sử dụng `Ctrl-F`.

Điều này cũng cho phép bạn tìm kiếm qua các lệnh trước đó, chỉnh sửa chúng và chạy lại bằng cách nhấn `<Enter>` trong "chế độ chỉnh sửa dòng lệnh bình thường".

## Đăng Ký và Tự Động Hoàn Thành

Trong chế độ dòng lệnh, bạn có thể chèn văn bản từ đăng ký Vim với `Ctrl-R` giống như chế độ chèn. Nếu bạn đã lưu chuỗi "foo" trong đăng ký a, bạn có thể chèn nó bằng cách chạy `Ctrl-R a`. Mọi thứ mà bạn có thể lấy từ đăng ký trong chế độ chèn, bạn cũng có thể làm tương tự từ chế độ dòng lệnh.

Ngoài ra, bạn cũng có thể lấy từ dưới con trỏ với `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` cho WORD dưới con trỏ). Để lấy dòng dưới con trỏ, sử dụng `Ctrl-R Ctrl-L`. Để lấy tên tệp dưới con trỏ, sử dụng `Ctrl-R Ctrl-F`.

Bạn cũng có thể tự động hoàn thành các lệnh hiện có. Để tự động hoàn thành lệnh `echo`, trong chế độ dòng lệnh, hãy gõ "ec", sau đó nhấn `<Tab>`. Bạn sẽ thấy ở góc dưới bên trái các lệnh Vim bắt đầu bằng "ec" (ví dụ: `echo echoerr echohl echomsg econ`). Để đi đến tùy chọn tiếp theo, nhấn `<Tab>` hoặc `Ctrl-N`. Để quay lại tùy chọn trước, nhấn `<Shift-Tab>` hoặc `Ctrl-P`.

Một số lệnh dòng lệnh chấp nhận tên tệp làm đối số. Một ví dụ là `edit`. Bạn cũng có thể tự động hoàn thành ở đây. Sau khi gõ lệnh, `:e ` (đừng quên khoảng trắng), nhấn `<Tab>`. Vim sẽ liệt kê tất cả các tên tệp liên quan mà bạn có thể chọn từ đó để bạn không phải gõ lại từ đầu.

## Cửa Sổ Lịch Sử và Cửa Sổ Dòng Lệnh

Bạn có thể xem lịch sử của các lệnh dòng lệnh và các thuật ngữ tìm kiếm (điều này yêu cầu tính năng `+cmdline_hist`).

Để mở lịch sử dòng lệnh, chạy `:his :`. Bạn sẽ thấy một cái gì đó như sau:

```shell
## Lịch sử Cmd
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim liệt kê lịch sử của tất cả các lệnh `:` mà bạn đã chạy. Theo mặc định, Vim lưu trữ 50 lệnh cuối cùng. Để thay đổi số lượng mục mà Vim nhớ thành 100, bạn chạy `set history=100`.

Một cách sử dụng hữu ích hơn của lịch sử dòng lệnh là thông qua cửa sổ dòng lệnh, `q:`. Điều này sẽ mở một cửa sổ lịch sử có thể tìm kiếm và chỉnh sửa. Giả sử bạn có những biểu thức này trong lịch sử khi bạn nhấn `q:`:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Nếu nhiệm vụ hiện tại của bạn là thực hiện `s/verylongsubstitutionpattern/donut/g`, thay vì gõ lệnh từ đầu, tại sao bạn không tái sử dụng `s/verylongsubstitutionpattern/pancake/g`? Dù sao thì, điều duy nhất khác biệt là từ thay thế, "donut" so với "pancake". Mọi thứ khác đều giống nhau.

Sau khi bạn chạy `q:`, tìm `s/verylongsubstitutionpattern/pancake/g` trong lịch sử (bạn có thể sử dụng điều hướng Vim trong môi trường này) và chỉnh sửa trực tiếp! Thay đổi "pancake" thành "donut" trong cửa sổ lịch sử, sau đó nhấn `<Enter>`. Boom! Vim thực hiện `s/verylongsubstitutionpattern/donut/g` cho bạn. Thật tiện lợi!

Tương tự, để xem lịch sử tìm kiếm, chạy `:his /` hoặc `:his ?`. Để mở cửa sổ lịch sử tìm kiếm nơi bạn có thể tìm kiếm và chỉnh sửa lịch sử trước đó, chạy `q/` hoặc `q?`.

Để thoát khỏi cửa sổ này, nhấn `Ctrl-C`, `Ctrl-W C`, hoặc gõ `:quit`.

## Nhiều Lệnh Dòng Lệnh Hơn

Vim có hàng trăm lệnh tích hợp. Để xem tất cả các lệnh mà Vim có, hãy kiểm tra `:h ex-cmd-index` hoặc `:h :index`.

## Học Chế Độ Dòng Lệnh Một Cách Thông Minh

So với ba chế độ còn lại, chế độ dòng lệnh giống như con dao đa năng của việc chỉnh sửa văn bản. Bạn có thể chỉnh sửa văn bản, sửa đổi tệp, và thực hiện các lệnh, chỉ để nêu tên một vài. Chương này là một tập hợp các điều lặt vặt của chế độ dòng lệnh. Nó cũng kết thúc các chế độ Vim. Bây giờ bạn đã biết cách sử dụng chế độ bình thường, chế độ chèn, chế độ hình ảnh, và chế độ dòng lệnh, bạn có thể chỉnh sửa văn bản với Vim nhanh hơn bao giờ hết.

Đã đến lúc rời khỏi các chế độ Vim và học cách điều hướng nhanh hơn với các thẻ Vim.