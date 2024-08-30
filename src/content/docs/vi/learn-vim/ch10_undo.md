---
description: Hệ thống hoàn tác của Vim cho phép bạn hoàn tác, làm lại và truy cập
  các trạng thái văn bản khác nhau, mang lại quyền kiểm soát tối đa cho người dùng.
title: Ch10. Undo
---

Chúng ta đều mắc phải đủ loại lỗi gõ phím. Đó là lý do tại sao tính năng hoàn tác là một tính năng thiết yếu trong bất kỳ phần mềm hiện đại nào. Hệ thống hoàn tác của Vim không chỉ có khả năng hoàn tác và làm lại những lỗi đơn giản, mà còn truy cập vào các trạng thái văn bản khác nhau, cho bạn quyền kiểm soát tất cả các văn bản mà bạn đã từng gõ. Trong chương này, bạn sẽ học cách hoàn tác, làm lại, điều hướng một nhánh hoàn tác, duy trì hoàn tác và du hành qua thời gian.

## Hoàn tác, Làm lại và UNDO

Để thực hiện một hoàn tác cơ bản, bạn có thể sử dụng `u` hoặc chạy `:undo`.

Nếu bạn có văn bản này (lưu ý dòng trống bên dưới "one"):

```shell
one

```

Sau đó bạn thêm một văn bản khác:

```shell
one
two
```

Nếu bạn nhấn `u`, Vim sẽ hoàn tác văn bản "two".

Làm thế nào Vim biết được bao nhiêu để hoàn tác? Vim hoàn tác một "thay đổi" tại một thời điểm, tương tự như thay đổi của lệnh dấu chấm (không giống như lệnh dấu chấm, lệnh dòng lệnh cũng được tính là một thay đổi).

Để làm lại thay đổi cuối cùng, nhấn `Ctrl-R` hoặc chạy `:redo`. Sau khi bạn hoàn tác văn bản ở trên để xóa "two", chạy `Ctrl-R` sẽ khôi phục lại văn bản đã bị xóa.

Vim cũng có UNDO mà bạn có thể chạy với `U`. Nó hoàn tác tất cả các thay đổi gần nhất.

`U` khác với `u` như thế nào? Đầu tiên, `U` xóa *tất cả* các thay đổi trên dòng đã thay đổi gần nhất, trong khi `u` chỉ xóa một thay đổi tại một thời điểm. Thứ hai, trong khi thực hiện `u` không được tính là một thay đổi, thực hiện `U` lại được tính là một thay đổi.

Quay lại ví dụ này:

```shell
one
two
```

Thay đổi dòng thứ hai thành "three":

```shell
one
three
```

Thay đổi dòng thứ hai một lần nữa và thay thế nó bằng "four":

```shell
one
four
```

Nếu bạn nhấn `u`, bạn sẽ thấy "three". Nếu bạn nhấn `u` một lần nữa, bạn sẽ thấy "two". Nếu thay vì nhấn `u` khi bạn vẫn còn văn bản "four", bạn đã nhấn `U`, bạn sẽ thấy:

```shell
one

```

`U` bỏ qua tất cả các thay đổi trung gian và quay trở lại trạng thái ban đầu khi bạn bắt đầu (một dòng trống). Ngoài ra, vì UNDO thực sự tạo ra một thay đổi mới trong Vim, bạn có thể hoàn tác UNDO của mình. `U` theo sau bởi `U` sẽ hoàn tác chính nó. Bạn có thể nhấn `U`, sau đó `U`, sau đó `U`, v.v. Bạn sẽ thấy cùng hai trạng thái văn bản chuyển đổi qua lại.

Cá nhân tôi không sử dụng `U` vì khó nhớ trạng thái ban đầu (tôi hiếm khi cần đến nó).

Vim đặt một số lượng tối đa về số lần bạn có thể hoàn tác trong biến tùy chọn `undolevels`. Bạn có thể kiểm tra nó với `:echo &undolevels`. Tôi đã đặt của mình là 1000. Để thay đổi của bạn thành 1000, chạy `:set undolevels=1000`. Hãy thoải mái đặt nó thành bất kỳ số nào bạn thích.

## Phá vỡ các Khối

Tôi đã đề cập trước đó rằng `u` hoàn tác một "thay đổi" đơn lẻ tương tự như thay đổi của lệnh dấu chấm: các văn bản được chèn từ khi bạn vào chế độ chèn cho đến khi bạn thoát khỏi nó được tính là một thay đổi.

Nếu bạn thực hiện `ione two three<Esc>` sau đó nhấn `u`, Vim sẽ xóa toàn bộ văn bản "one two three" vì toàn bộ điều này được tính là một thay đổi. Điều này không phải là vấn đề lớn nếu bạn đã viết các văn bản ngắn, nhưng nếu bạn đã viết nhiều đoạn văn trong một phiên chế độ chèn mà không thoát ra và sau đó bạn nhận ra rằng bạn đã mắc lỗi? Nếu bạn nhấn `u`, mọi thứ bạn đã viết sẽ bị xóa. Liệu có hữu ích không nếu bạn có thể nhấn `u` để chỉ xóa một phần văn bản của mình?

May mắn thay, bạn có thể phá vỡ các khối hoàn tác. Khi bạn đang gõ trong chế độ chèn, nhấn `Ctrl-G u` sẽ tạo một điểm dừng hoàn tác. Ví dụ, nếu bạn thực hiện `ione <Ctrl-G u>two <Ctrl-G u>three<Esc>`, sau đó nhấn `u`, bạn chỉ mất văn bản "three" (nhấn `u` thêm một lần nữa để xóa "two"). Khi bạn viết một văn bản dài, hãy sử dụng `Ctrl-G u` một cách chiến lược. Cuối mỗi câu, giữa hai đoạn văn, hoặc sau mỗi dòng mã là những vị trí chính để thêm các điểm dừng hoàn tác nhằm dễ dàng hoàn tác các lỗi của bạn nếu bạn mắc phải.

Cũng rất hữu ích để tạo một điểm dừng hoàn tác khi xóa các khối trong chế độ chèn với `Ctrl-W` (xóa từ trước con trỏ) và `Ctrl-U` (xóa tất cả văn bản trước con trỏ). Một người bạn đã gợi ý sử dụng các bản đồ sau:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Với những điều này, bạn có thể dễ dàng khôi phục các văn bản đã xóa.

## Cây Hoàn Tác

Vim lưu trữ mọi thay đổi đã được viết trong một cây hoàn tác. Bắt đầu một tệp trống mới. Sau đó thêm một văn bản mới:

```shell
one

```

Thêm một văn bản mới:

```shell
one
two
```

Hoàn tác một lần:

```shell
one

```

Thêm một văn bản khác:

```shell
one
three
```

Hoàn tác một lần nữa:

```shell
one

```

Và thêm một văn bản khác nữa:

```shell
one
four
```

Bây giờ nếu bạn hoàn tác, bạn sẽ mất văn bản "four" mà bạn vừa thêm:

```shell
one

```

Nếu bạn hoàn tác thêm một lần nữa:

```shell

```

Bạn sẽ mất văn bản "one". Trong hầu hết các trình soạn thảo văn bản, việc khôi phục lại các văn bản "two" và "three" sẽ là điều không thể, nhưng không phải với Vim! Nhấn `g+` và bạn sẽ khôi phục lại văn bản "one":

```shell
one

```

Gõ `g+` một lần nữa và bạn sẽ thấy một người bạn cũ:

```shell
one
two
```

Hãy tiếp tục. Nhấn `g+` một lần nữa:

```shell
one
three
```

Nhấn `g+` thêm một lần nữa:

```shell
one
four
```

Trong Vim, mỗi khi bạn nhấn `u` và sau đó thực hiện một thay đổi khác, Vim lưu trữ văn bản của trạng thái trước đó bằng cách tạo một "nhánh hoàn tác". Trong ví dụ này, sau khi bạn gõ "two", sau đó nhấn `u`, rồi gõ "three", bạn đã tạo một nhánh lá lưu trữ trạng thái chứa văn bản "two". Vào thời điểm đó, cây hoàn tác chứa ít nhất hai nút lá: nút chính chứa văn bản "three" (mới nhất) và nút nhánh hoàn tác chứa văn bản "two". Nếu bạn đã thực hiện một hoàn tác khác và gõ văn bản "four", bạn sẽ có ba nút: một nút chính chứa văn bản "four" và hai nút chứa các văn bản "three" và "two".

Để duyệt qua từng nút cây hoàn tác, bạn có thể sử dụng `g+` để đi đến một trạng thái mới hơn và `g-` để đi đến một trạng thái cũ hơn. Sự khác biệt giữa `u`, `Ctrl-R`, `g+`, và `g-` là cả `u` và `Ctrl-R` chỉ duyệt qua các nút *chính* trong cây hoàn tác trong khi `g+` và `g-` duyệt qua *tất cả* các nút trong cây hoàn tác.

Cây hoàn tác không dễ để hình dung. Tôi thấy plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) rất hữu ích để giúp hình dung cây hoàn tác của Vim. Hãy dành một chút thời gian để chơi với nó.

## Hoàn Tác Bền Vững

Nếu bạn khởi động Vim, mở một tệp và ngay lập tức nhấn `u`, Vim có thể hiển thị cảnh báo "*Đã ở thay đổi cũ nhất*". Không có gì để hoàn tác vì bạn chưa thực hiện bất kỳ thay đổi nào.

Để chuyển đổi lịch sử hoàn tác từ phiên chỉnh sửa cuối cùng, Vim có thể bảo tồn lịch sử hoàn tác của bạn với một tệp hoàn tác bằng cách sử dụng `:wundo`.

Tạo một tệp `mynumbers.txt`. Gõ:

```shell
one
```

Sau đó gõ một dòng khác (đảm bảo mỗi dòng được tính là một thay đổi):

```shell
one
two
```

Gõ một dòng khác:

```shell
one
two
three
```

Bây giờ tạo tệp hoàn tác của bạn với `:wundo {my-undo-file}`. Nếu bạn cần ghi đè lên một tệp hoàn tác hiện có, bạn có thể thêm `!` sau `wundo`.

```shell
:wundo! mynumbers.undo
```

Sau đó thoát khỏi Vim.

Đến giờ bạn nên có các tệp `mynumbers.txt` và `mynumbers.undo` trong thư mục của bạn. Mở lại `mynumbers.txt` và thử nhấn `u`. Bạn không thể. Bạn chưa thực hiện bất kỳ thay đổi nào kể từ khi mở tệp. Bây giờ tải lịch sử hoàn tác của bạn bằng cách đọc tệp hoàn tác với `:rundo`:

```shell
:rundo mynumbers.undo
```

Bây giờ nếu bạn nhấn `u`, Vim sẽ xóa "three". Nhấn `u` một lần nữa để xóa "two". Giống như bạn chưa bao giờ đóng Vim!

Nếu bạn muốn có một sự bảo tồn hoàn tác tự động, một cách để thực hiện điều này là thêm những điều này vào vimrc:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

Cài đặt ở trên sẽ đặt tất cả các tệp hoàn tác vào một thư mục tập trung, thư mục `~/.vim`. Tên `undo_dir` là tùy ý. `set undofile` cho Vim biết bật tính năng `undofile` vì nó tắt theo mặc định. Bây giờ mỗi khi bạn lưu, Vim sẽ tự động tạo và cập nhật tệp liên quan bên trong thư mục `undo_dir` (đảm bảo rằng bạn tạo thư mục `undo_dir` thực tế bên trong thư mục `~/.vim` trước khi chạy điều này).

## Du Hành Thời Gian

Ai nói rằng du hành thời gian không tồn tại? Vim có thể quay lại một trạng thái văn bản trong quá khứ với lệnh dòng lệnh `:earlier`.

Nếu bạn có văn bản này:

```shell
one

```
Sau đó sau đó bạn thêm:

```shell
one
two
```

Nếu bạn đã gõ "two" chưa đầy mười giây trước, bạn có thể quay lại trạng thái mà "two" không tồn tại mười giây trước với:

```shell
:earlier 10s
```

Bạn có thể sử dụng `:undolist` để xem khi nào thay đổi cuối cùng được thực hiện. `:earlier` cũng chấp nhận các tham số khác nhau:

```shell
:earlier 10s    Quay lại trạng thái 10 giây trước
:earlier 10m    Quay lại trạng thái 10 phút trước
:earlier 10h    Quay lại trạng thái 10 giờ trước
:earlier 10d    Quay lại trạng thái 10 ngày trước
```

Ngoài ra, nó cũng chấp nhận một `count` thông thường như một tham số để cho Vim biết quay lại trạng thái cũ `count` lần. Ví dụ, nếu bạn thực hiện `:earlier 2`, Vim sẽ quay lại một trạng thái văn bản cũ hai thay đổi trước. Nó giống như thực hiện `g-` hai lần. Bạn cũng có thể yêu cầu nó quay lại trạng thái văn bản cũ 10 lần lưu với `:earlier 10f`.

Cùng một tập hợp các tham số hoạt động với lệnh tương ứng của `:earlier`: `:later`.

```shell
:later 10s    quay lại trạng thái 10 giây sau
:later 10m    quay lại trạng thái 10 phút sau
:later 10h    quay lại trạng thái 10 giờ sau
:later 10d    quay lại trạng thái 10 ngày sau
:later 10     quay lại trạng thái mới hơn 10 lần
:later 10f    quay lại trạng thái 10 lần lưu sau
```

## Học Hoàn Tác Một Cách Thông Minh

`u` và `Ctrl-R` là hai lệnh Vim không thể thiếu để sửa chữa lỗi. Hãy học chúng trước. Tiếp theo, học cách sử dụng `:earlier` và `:later` bằng cách sử dụng các tham số thời gian trước. Sau đó, hãy dành thời gian để hiểu cây hoàn tác. Plugin [vim-mundo](https://github.com/simnalamburt/vim-mundo) đã giúp tôi rất nhiều. Gõ theo các văn bản trong chương này và kiểm tra cây hoàn tác khi bạn thực hiện mỗi thay đổi. Khi bạn nắm bắt được nó, bạn sẽ không bao giờ nhìn thấy hệ thống hoàn tác theo cách khác nữa.

Trước khi đến chương này, bạn đã học cách tìm bất kỳ văn bản nào trong một không gian dự án, với hoàn tác, bây giờ bạn có thể tìm bất kỳ văn bản nào trong một chiều thời gian. Bạn giờ đây có khả năng tìm kiếm bất kỳ văn bản nào theo vị trí và thời gian viết. Bạn đã đạt được sự hiện diện toàn diện trong Vim.