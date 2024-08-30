---
description: Tài liệu này hướng dẫn cách sử dụng các kiểu dữ liệu trong Vimscript
  để viết các câu lệnh điều kiện và vòng lặp cơ bản.
title: Ch26. Vimscript Conditionals and Loops
---

Sau khi tìm hiểu các kiểu dữ liệu cơ bản, bước tiếp theo là học cách kết hợp chúng lại với nhau để bắt đầu viết một chương trình cơ bản. Một chương trình cơ bản bao gồm các câu lệnh điều kiện và vòng lặp.

Trong chương này, bạn sẽ học cách sử dụng các kiểu dữ liệu Vimscript để viết các câu lệnh điều kiện và vòng lặp.

## Toán Tử Quan Hệ

Các toán tử quan hệ trong Vimscript tương tự như nhiều ngôn ngữ lập trình khác:

```shell
a == b		bằng
a != b		không bằng
a >  b		lớn hơn
a >= b		lớn hơn hoặc bằng
a <  b		nhỏ hơn
a <= b		nhỏ hơn hoặc bằng
```

Ví dụ:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

Nhớ rằng các chuỗi được chuyển đổi thành số trong một biểu thức số học. Ở đây Vim cũng chuyển đổi các chuỗi thành số trong một biểu thức so sánh. "5foo" được chuyển thành 5 (đúng):

```shell
:echo 5 == "5foo"
" trả về true
```

Cũng nhớ rằng nếu bạn bắt đầu một chuỗi bằng một ký tự không phải số như "foo5", chuỗi sẽ được chuyển đổi thành số 0 (sai).

```shell
echo 5 == "foo5"
" trả về false
```

### Toán Tử Logic Chuỗi

Vim có nhiều toán tử quan hệ hơn để so sánh các chuỗi:

```shell
a =~ b
a !~ b
```

Ví dụ:

```shell
let str = "bữa sáng ngon lành"

echo str =~ "bữa sáng"
" trả về true

echo str =~ "bữa tối"
" trả về false

echo str !~ "bữa tối"
" trả về true
```

Toán tử `=~` thực hiện một phép so khớp regex với chuỗi đã cho. Trong ví dụ trên, `str =~ "bữa sáng"` trả về true vì `str` *chứa* mẫu "bữa sáng". Bạn luôn có thể sử dụng `==` và `!=`, nhưng việc sử dụng chúng sẽ so sánh biểu thức với toàn bộ chuỗi. `=~` và `!~` là những lựa chọn linh hoạt hơn.

```shell
echo str == "bữa sáng"
" trả về false

echo str == "bữa sáng ngon lành"
" trả về true
```

Hãy thử cái này. Lưu ý chữ "B" viết hoa:

```shell
echo str =~ "Bữa Sáng"
" true
```

Nó trả về true mặc dù "Bữa Sáng" được viết hoa. Thú vị... Hóa ra cài đặt Vim của tôi được thiết lập để bỏ qua chữ hoa (`set ignorecase`), vì vậy khi Vim kiểm tra sự bằng nhau, nó sử dụng cài đặt Vim của tôi và bỏ qua chữ hoa. Nếu tôi tắt bỏ qua chữ hoa (`set noignorecase`), phép so sánh giờ đây trả về false.

```shell
set noignorecase
echo str =~ "Bữa Sáng"
" trả về false vì chữ hoa có ý nghĩa

set ignorecase
echo str =~ "Bữa Sáng"
" trả về true vì chữ hoa không quan trọng
```

Nếu bạn đang viết một plugin cho người khác, đây là một tình huống khó khăn. Người dùng có sử dụng `ignorecase` hay `noignorecase`? Bạn chắc chắn không muốn buộc người dùng của mình phải thay đổi tùy chọn bỏ qua chữ hoa của họ. Vậy bạn phải làm gì?

May mắn thay, Vim có một toán tử có thể *luôn* bỏ qua hoặc so khớp chữ hoa. Để luôn so khớp chữ hoa, thêm một `#` ở cuối.

```shell
set ignorecase
echo str =~# "bữa sáng"
" trả về true

echo str =~# "Bữa Sáng"
" trả về false

set noignorecase
echo str =~# "bữa sáng"
" true

echo str =~# "Bữa Sáng"
" false

echo str !~# "Bữa Sáng"
" true
```

Để luôn bỏ qua chữ hoa khi so sánh, thêm nó với `?`:

```shell
set ignorecase
echo str =~? "bữa sáng"
" true

echo str =~? "Bữa Sáng"
" true

set noignorecase
echo str =~? "bữa sáng"
" true

echo str =~? "Bữa Sáng"
" true

echo str !~? "Bữa Sáng"
" false
```

Tôi thích sử dụng `#` để luôn so khớp chữ hoa và ở vị trí an toàn.

## Nếu

Bây giờ bạn đã thấy các biểu thức bằng nhau trong Vim, hãy đề cập đến một toán tử điều kiện cơ bản, câu lệnh `if`.

Tối thiểu, cú pháp là:

```shell
if {điều kiện}
  {một biểu thức nào đó}
endif
```

Bạn có thể mở rộng phân tích trường hợp với `elseif` và `else`.

```shell
if {điều kiện1}
  {biểu thức1}
elseif {điều kiện2}
  {biểu thức2}
elseif {điều kiện3}
  {biểu thức3}
else
  {biểu thức4}
endif
```

Ví dụ, plugin [vim-signify](https://github.com/mhinz/vim-signify) sử dụng một phương pháp cài đặt khác nhau tùy thuộc vào cài đặt Vim của bạn. Dưới đây là hướng dẫn cài đặt từ `readme` của họ, sử dụng câu lệnh `if`:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## Biểu Thức Ternary

Vim có một biểu thức ternary cho phân tích trường hợp một dòng:

```shell
{điều kiện} ? biểu_thức_true : biểu_thức_false
```

Ví dụ:

```shell
echo 1 ? "Tôi là đúng" : "Tôi là sai"
```

Vì 1 là đúng, Vim echo "Tôi là đúng". Giả sử bạn muốn điều kiện đặt `background` thành tối nếu bạn đang sử dụng Vim sau một giờ nhất định. Thêm điều này vào vimrc:

```shell
let &background = strftime("%H") < 18 ? "sáng" : "tối"
```

`&background` là tùy chọn `'background'` trong Vim. `strftime("%H")` trả về thời gian hiện tại theo giờ. Nếu chưa đến 6 giờ chiều, sử dụng nền sáng. Ngược lại, sử dụng nền tối.

## hoặc

"hoặc" logic (`||`) hoạt động giống như nhiều ngôn ngữ lập trình.

```shell
{Biểu thức sai}  || {Biểu thức sai}   false
{Biểu thức sai}  || {Biểu thức đúng}  true
{Biểu thức đúng} || {Biểu thức sai}   true
{Biểu thức đúng} || {Biểu thức đúng}  true
```

Vim đánh giá biểu thức và trả về 1 (đúng) hoặc 0 (sai).

```shell
echo 5 || 0
" trả về 1

echo 5 || 5
" trả về 1

echo 0 || 0
" trả về 0

echo "foo5" || "foo5"
" trả về 0

echo "5foo" || "foo5"
" trả về 1
```

Nếu biểu thức hiện tại đánh giá là đúng, biểu thức tiếp theo sẽ không được đánh giá.

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" trả về 1

echo two_dozen || one_dozen
" trả về lỗi
```

Lưu ý rằng `two_dozen` chưa bao giờ được định nghĩa. Biểu thức `one_dozen || two_dozen` không gây ra lỗi nào vì `one_dozen` được đánh giá trước và được tìm thấy là đúng, vì vậy Vim không đánh giá `two_dozen`.

## và

"và" logic (`&&`) là bổ sung của "hoặc" logic.

```shell
{Biểu thức sai}  && {Biểu thức sai}   false
{Biểu thức sai}  && {Biểu thức đúng}  false
{Biểu thức đúng} && {Biểu thức sai}   false
{Biểu thức đúng} && {Biểu thức đúng}  true
```

Ví dụ:

```shell
echo 0 && 0
" trả về 0

echo 0 && 10
" trả về 0
```

`&&` đánh giá một biểu thức cho đến khi nó thấy biểu thức sai đầu tiên. Ví dụ, nếu bạn có `true && true`, nó sẽ đánh giá cả hai và trả về `true`. Nếu bạn có `true && false && true`, nó sẽ đánh giá `true` đầu tiên và dừng lại ở `false` đầu tiên. Nó sẽ không đánh giá `true` thứ ba.

```shell
let one_dozen = 12
echo one_dozen && 10
" trả về 1

echo one_dozen && v:false
" trả về 0

echo one_dozen && two_dozen
" trả về lỗi

echo exists("one_dozen") && one_dozen == 12
" trả về 1
```

## for

Vòng lặp `for` thường được sử dụng với kiểu dữ liệu danh sách.

```shell
let breakfasts = ["bánh kếp", "waffles", "trứng"]

for breakfast in breakfasts
  echo breakfast
endfor
```

Nó hoạt động với danh sách lồng nhau:

```shell
let meals = [["bữa sáng", "bánh kếp"], ["bữa trưa", "cá"], ["bữa tối", "mì"]]

for [meal_type, food] in meals
  echo "Tôi đang ăn " . food . " cho " . meal_type
endfor
```

Bạn có thể sử dụng vòng lặp `for` với một từ điển bằng cách sử dụng phương thức `keys()`.

```shell
let beverages = #{bữa sáng: "sữa", bữa trưa: "nước cam", bữa tối: "nước"}
for beverage_type in keys(beverages)
  echo "Tôi đang uống " . beverages[beverage_type] . " cho " . beverage_type
endfor
```

## Trong khi

Một vòng lặp phổ biến khác là vòng lặp `while`.

```shell
let counter = 1
while counter < 5
  echo "Counter là: " . counter
  let counter += 1
endwhile
```

Để lấy nội dung của dòng hiện tại đến dòng cuối cùng:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## Xử Lý Lỗi

Thường thì chương trình của bạn không chạy theo cách bạn mong đợi. Kết quả là, nó khiến bạn cảm thấy bối rối (chơi chữ). Điều bạn cần là một cách xử lý lỗi thích hợp.

### Ngắt

Khi bạn sử dụng `break` bên trong một vòng lặp `while` hoặc `for`, nó dừng vòng lặp.

Để lấy văn bản từ đầu tệp đến dòng hiện tại, nhưng dừng lại khi bạn thấy từ "bánh donut":

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "bánh donut"
    break
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

Nếu bạn có văn bản:

```shell
một
hai
ba
bánh donut
bốn
năm
```

Chạy vòng lặp `while` trên sẽ cho "một hai ba" và không có phần còn lại của văn bản vì vòng lặp ngắt khi nó khớp với "bánh donut".

### Tiếp tục

Phương pháp `continue` tương tự như `break`, nơi nó được gọi trong một vòng lặp. Sự khác biệt là thay vì ngắt vòng lặp, nó chỉ bỏ qua vòng lặp hiện tại.

Giả sử bạn có cùng một văn bản nhưng thay vì `break`, bạn sử dụng `continue`:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "bánh donut"
    continue
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

Lần này nó trả về `một hai ba bốn năm`. Nó bỏ qua dòng có từ "bánh donut", nhưng vòng lặp vẫn tiếp tục.
### thử, cuối cùng và bắt

Vim có `try`, `finally`, và `catch` để xử lý lỗi. Để mô phỏng một lỗi, bạn có thể sử dụng lệnh `throw`.

```shell
try
  echo "Thử"
  throw "Không"
endtry
```

Chạy đoạn này. Vim sẽ báo lỗi với thông báo `"Exception not caught: Không`.

Bây giờ thêm một khối catch:

```shell
try
  echo "Thử"
  throw "Không"
catch
  echo "Đã bắt được"
endtry
```

Bây giờ không còn lỗi nào nữa. Bạn sẽ thấy "Thử" và "Đã bắt được" được hiển thị.

Hãy xóa `catch` và thêm `finally`:

```shell
try
  echo "Thử"
  throw "Không"
  echo "Bạn sẽ không thấy tôi"
finally
  echo "Cuối cùng"
endtry
```

Chạy đoạn này. Bây giờ Vim hiển thị lỗi và "Cuối cùng".

Hãy kết hợp tất cả lại với nhau:

```shell
try
  echo "Thử"
  throw "Không"
catch
  echo "Đã bắt được"
finally
  echo "Cuối cùng"
endtry
```

Lần này Vim hiển thị cả "Đã bắt được" và "Cuối cùng". Không có lỗi nào được hiển thị vì Vim đã bắt được nó.

Lỗi đến từ nhiều nơi khác nhau. Một nguồn lỗi khác là gọi một hàm không tồn tại, như `Nope()` bên dưới:

```shell
try
  echo "Thử"
  call Nope()
catch
  echo "Đã bắt được"
finally
  echo "Cuối cùng"
endtry
```

Sự khác biệt giữa `catch` và `finally` là `finally` luôn được chạy, có lỗi hay không, trong khi `catch` chỉ được chạy khi mã của bạn gặp lỗi.

Bạn có thể bắt lỗi cụ thể với `:catch`. Theo `:h :catch`:

```shell
catch /^Vim:Interrupt$/.             " bắt các ngắt (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " bắt tất cả các lỗi Vim
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " bắt lỗi và ngắt
catch /^Vim(write):/.                " bắt tất cả các lỗi trong :write
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " bắt lỗi E123
catch /my-exception/.                " bắt ngoại lệ người dùng
catch /.*/                           " bắt mọi thứ
catch.                               " giống như /.*/
```

Bên trong một khối `try`, một ngắt được coi là một lỗi có thể bắt được.

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

Trong vimrc của bạn, nếu bạn sử dụng một màu sắc tùy chỉnh, như [gruvbox](https://github.com/morhetz/gruvbox), và bạn vô tình xóa thư mục màu sắc nhưng vẫn có dòng `colorscheme gruvbox` trong vimrc của bạn, Vim sẽ ném ra một lỗi khi bạn `source` nó. Để sửa lỗi này, tôi đã thêm đoạn này vào vimrc của mình:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

Bây giờ nếu bạn `source` vimrc mà không có thư mục `gruvbox`, Vim sẽ sử dụng `colorscheme default`.

## Học Điều Kiện Một Cách Thông Minh

Trong chương trước, bạn đã học về các kiểu dữ liệu cơ bản của Vim. Trong chương này, bạn đã học cách kết hợp chúng để viết các chương trình cơ bản sử dụng điều kiện và vòng lặp. Đây là những khối xây dựng của lập trình.

Tiếp theo, hãy học về phạm vi biến.