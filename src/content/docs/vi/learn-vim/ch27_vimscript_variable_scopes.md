---
description: Tài liệu này giới thiệu về các biến trong Vim, bao gồm biến có thể thay
  đổi và không thể thay đổi, cùng với cách sử dụng chúng trong Vimscript.
title: Ch27. Vimscript Variable Scopes
---

Trước khi đi vào các hàm Vimscript, hãy cùng tìm hiểu về các nguồn và phạm vi khác nhau của biến Vim.

## Biến Có Thể Thay Đổi và Không Thể Thay Đổi

Bạn có thể gán giá trị cho một biến trong Vim bằng `let`:

```shell
let pancake = "pancake"
```

Sau đó, bạn có thể gọi biến đó bất kỳ lúc nào.

```shell
echo pancake
" trả về "pancake"
```

`let` là có thể thay đổi, có nghĩa là bạn có thể thay đổi giá trị bất kỳ lúc nào trong tương lai.

```shell
let pancake = "pancake"
let pancake = "not waffles"

echo pancake
" trả về "not waffles"
```

Lưu ý rằng khi bạn muốn thay đổi giá trị của một biến đã được thiết lập, bạn vẫn cần sử dụng `let`.

```shell
let beverage = "milk"

beverage = "orange juice"
" gây ra lỗi
```

Bạn có thể định nghĩa một biến không thể thay đổi bằng `const`. Khi là không thể thay đổi, một khi giá trị của biến được gán, bạn không thể gán lại nó với một giá trị khác.

```shell
const waffle = "waffle"
const waffle = "pancake"
" gây ra lỗi
```

## Nguồn Biến

Có ba nguồn cho các biến: biến môi trường, biến tùy chọn và biến đăng ký.

### Biến Môi Trường

Vim có thể truy cập biến môi trường của terminal của bạn. Ví dụ, nếu bạn có biến môi trường `SHELL` có sẵn trong terminal của bạn, bạn có thể truy cập nó từ Vim bằng:

```shell
echo $SHELL
" trả về giá trị $SHELL. Trong trường hợp của tôi, nó trả về /bin/bash
```

### Biến Tùy Chọn

Bạn có thể truy cập các tùy chọn Vim bằng `&` (đây là các cài đặt mà bạn truy cập bằng `set`).

Ví dụ, để xem nền mà Vim sử dụng, bạn có thể chạy:

```shell
echo &background
" trả về "light" hoặc "dark"
```

Ngoài ra, bạn luôn có thể chạy `set background?` để xem giá trị của tùy chọn `background`.

### Biến Đăng Ký

Bạn có thể truy cập các đăng ký Vim (Ch. 08) bằng `@`.

Giả sử giá trị "chocolate" đã được lưu trong đăng ký a. Để truy cập nó, bạn có thể sử dụng `@a`. Bạn cũng có thể cập nhật nó bằng `let`.

```shell
echo @a
" trả về chocolate

let @a .= " donut"

echo @a
" trả về "chocolate donut"
```

Bây giờ khi bạn dán từ đăng ký `a` (`"ap`), nó sẽ trả về "chocolate donut". Toán tử `.=` nối hai chuỗi lại với nhau. Biểu thức `let @a .= " donut"` tương đương với `let @a = @a . " donut"`

## Phạm Vi Biến

Có 9 phạm vi biến khác nhau trong Vim. Bạn có thể nhận ra chúng từ chữ cái được thêm vào trước:

```shell
g:           Biến toàn cục
{nothing}    Biến toàn cục
b:           Biến cục bộ bộ đệm
w:           Biến cục bộ cửa sổ
t:           Biến cục bộ tab
s:           Biến Vimscript được nguồn
l:           Biến cục bộ hàm
a:           Biến tham số chính thức của hàm
v:           Biến tích hợp sẵn của Vim
```

### Biến Toàn Cục

Khi bạn khai báo một biến "thông thường":

```shell
let pancake = "pancake"
```

`pancake` thực sự là một biến toàn cục. Khi bạn định nghĩa một biến toàn cục, bạn có thể gọi chúng từ bất kỳ đâu.

Thêm `g:` vào trước một biến cũng tạo ra một biến toàn cục.

```shell
let g:waffle = "waffle"
```

Trong trường hợp này, cả `pancake` và `g:waffle` đều có cùng phạm vi. Bạn có thể gọi từng cái với hoặc không có `g:`.

```shell
echo pancake
" trả về "pancake"

echo g:pancake
" trả về "pancake"

echo waffle
" trả về "waffle"

echo g:waffle
" trả về "waffle"
```

### Biến Bộ Đệm

Một biến được thêm `b:` là một biến bộ đệm. Một biến bộ đệm là một biến chỉ cục bộ cho bộ đệm hiện tại (Ch. 02). Nếu bạn có nhiều bộ đệm mở, mỗi bộ đệm sẽ có danh sách biến bộ đệm riêng biệt của nó.

Trong bộ đệm 1:

```shell
const b:donut = "chocolate donut"
```

Trong bộ đệm 2:

```shell
const b:donut = "blueberry donut"
```

Nếu bạn chạy `echo b:donut` từ bộ đệm 1, nó sẽ trả về "chocolate donut". Nếu bạn chạy từ bộ đệm 2, nó sẽ trả về "blueberry donut".

Lưu ý rằng, Vim có một biến bộ đệm *đặc biệt* `b:changedtick` theo dõi tất cả các thay đổi được thực hiện đối với bộ đệm hiện tại.

1. Chạy `echo b:changedtick` và ghi chú số mà nó trả về.
2. Thực hiện thay đổi trong Vim.
3. Chạy `echo b:changedtick` một lần nữa và ghi chú số mà nó bây giờ trả về.

### Biến Cửa Sổ

Một biến được thêm `w:` là một biến cửa sổ. Nó chỉ tồn tại trong cửa sổ đó.

Trong cửa sổ 1:

```shell
const w:donut = "chocolate donut"
```

Trong cửa sổ 2:

```shell
const w:donut = "raspberry donut"
```

Trong mỗi cửa sổ, bạn có thể gọi `echo w:donut` để nhận giá trị duy nhất.

### Biến Tab

Một biến được thêm `t:` là một biến tab. Nó chỉ tồn tại trong tab đó.

Trong tab 1:

```shell
const t:donut = "chocolate donut"
```

Trong tab 2:

```shell
const t:donut = "blackberry donut"
```

Trong mỗi tab, bạn có thể gọi `echo t:donut` để nhận giá trị duy nhất.

### Biến Kịch Bản

Một biến được thêm `s:` là một biến kịch bản. Những biến này chỉ có thể được truy cập từ bên trong kịch bản đó.

Nếu bạn có một tệp tùy ý `dozen.vim` và bên trong nó bạn có:

```shell
let s:dozen = 12

function Consume()
  let s:dozen -= 1
  echo s:dozen " còn lại"
endfunction
```

Nguồn tệp bằng `:source dozen.vim`. Bây giờ gọi hàm `Consume`:

```shell
:call Consume()
" trả về "11 còn lại"

:call Consume()
" trả về "10 còn lại"

:echo s:dozen
" Lỗi biến không xác định
```

Khi bạn gọi `Consume`, bạn thấy nó giảm giá trị `s:dozen` như mong đợi. Khi bạn cố gắng lấy giá trị `s:dozen` trực tiếp, Vim sẽ không tìm thấy nó vì bạn đang ra ngoài phạm vi. `s:dozen` chỉ có thể truy cập từ bên trong `dozen.vim`.

Mỗi lần bạn nguồn tệp `dozen.vim`, nó sẽ đặt lại bộ đếm `s:dozen`. Nếu bạn đang ở giữa việc giảm giá trị `s:dozen` và bạn chạy `:source dozen.vim`, bộ đếm sẽ được đặt lại về 12. Điều này có thể là một vấn đề cho những người dùng không nghi ngờ. Để khắc phục vấn đề này, hãy tái cấu trúc mã:

```shell
if !exists("s:dozen")
  let s:dozen = 12
endif

function Consume()
  let s:dozen -= 1
  echo s:dozen
endfunction
```

Bây giờ khi bạn nguồn `dozen.vim` trong khi đang ở giữa việc giảm, Vim đọc `!exists("s:dozen")`, tìm thấy rằng nó là đúng, và không đặt lại giá trị về 12.

### Biến Cục Bộ Hàm và Biến Tham Số Chính Thức của Hàm

Cả biến cục bộ hàm (`l:`) và biến chính thức của hàm (`a:`) sẽ được đề cập trong chương tiếp theo.

### Biến Tích Hợp Sẵn của Vim

Một biến được thêm `v:` là một biến tích hợp sẵn đặc biệt của Vim. Bạn không thể định nghĩa những biến này. Bạn đã thấy một số trong số chúng rồi.
- `v:version` cho bạn biết phiên bản Vim mà bạn đang sử dụng.
- `v:key` chứa giá trị mục hiện tại khi lặp qua một từ điển.
- `v:val` chứa giá trị mục hiện tại khi chạy một thao tác `map()` hoặc `filter()`.
- `v:true`, `v:false`, `v:null`, và `v:none` là các kiểu dữ liệu đặc biệt.

Có những biến khác. Để có danh sách các biến tích hợp sẵn của Vim, hãy kiểm tra `:h vim-variable` hoặc `:h v:`.

## Sử Dụng Phạm Vi Biến Vim Một Cách Thông Minh

Việc có thể nhanh chóng truy cập các biến môi trường, tùy chọn và đăng ký mang lại cho bạn sự linh hoạt rộng rãi để tùy chỉnh trình soạn thảo và môi trường terminal của bạn. Bạn cũng đã học rằng Vim có 9 phạm vi biến khác nhau, mỗi phạm vi tồn tại dưới một số ràng buộc nhất định. Bạn có thể tận dụng những loại biến độc đáo này để tách rời chương trình của bạn.

Bạn đã đi được đến đây. Bạn đã học về các kiểu dữ liệu, cách kết hợp, và phạm vi biến. Chỉ còn một điều nữa: các hàm.