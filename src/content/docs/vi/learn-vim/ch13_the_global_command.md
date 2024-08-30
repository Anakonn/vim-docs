---
description: Tài liệu này hướng dẫn cách sử dụng lệnh toàn cục trong Vim để thực hiện
  các lệnh dòng lệnh trên nhiều dòng cùng lúc.
title: Ch13. the Global Command
---

Cho đến nay, bạn đã học cách lặp lại thay đổi cuối cùng với lệnh chấm (`.`), phát lại các hành động với macro (`q`), và lưu trữ văn bản trong các thanh ghi (`"`).

Trong chương này, bạn sẽ học cách lặp lại một lệnh dòng lệnh với lệnh toàn cục.

## Tổng Quan Về Lệnh Toàn Cục

Lệnh toàn cục của Vim được sử dụng để chạy một lệnh dòng lệnh trên nhiều dòng cùng một lúc.

Nhân tiện, bạn có thể đã nghe đến thuật ngữ "Lệnh Ex" trước đây. Trong hướng dẫn này, tôi gọi chúng là lệnh dòng lệnh. Cả lệnh Ex và lệnh dòng lệnh đều giống nhau. Chúng là các lệnh bắt đầu bằng dấu hai chấm (`:`). Lệnh thay thế trong chương trước là một ví dụ của lệnh Ex. Chúng được gọi là Ex vì chúng ban đầu xuất phát từ trình soạn thảo văn bản Ex. Tôi sẽ tiếp tục gọi chúng là lệnh dòng lệnh trong hướng dẫn này. Để có danh sách đầy đủ các lệnh Ex, hãy kiểm tra `:h ex-cmd-index`.

Lệnh toàn cục có cú pháp sau:

```shell
:g/pattern/command
```

`pattern` khớp với tất cả các dòng chứa mẫu đó, tương tự như mẫu trong lệnh thay thế. `command` có thể là bất kỳ lệnh dòng lệnh nào. Lệnh toàn cục hoạt động bằng cách thực thi `command` trên mỗi dòng khớp với `pattern`.

Nếu bạn có các biểu thức sau:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Để xóa tất cả các dòng chứa "console", bạn có thể chạy:

```shell
:g/console/d
```

Kết quả:

```shell
const one = 1;

const two = 2;

const three = 3;
```

Lệnh toàn cục thực thi lệnh xóa (`d`) trên tất cả các dòng khớp với mẫu "console".

Khi chạy lệnh `g`, Vim thực hiện hai lần quét qua tệp. Trong lần chạy đầu tiên, nó quét từng dòng và đánh dấu dòng khớp với mẫu `/console/`. Khi tất cả các dòng khớp đã được đánh dấu, nó sẽ thực hiện lần thứ hai và thực thi lệnh `d` trên các dòng đã đánh dấu.

Nếu bạn muốn xóa tất cả các dòng chứa "const" thay vào đó, hãy chạy:

```shell
:g/const/d
```

Kết quả:

```shell
console.log("one: ", one);

console.log("two: ", two);

console.log("three: ", three);
```

## Khớp Ngược

Để chạy lệnh toàn cục trên các dòng không khớp, bạn có thể chạy:

```shell
:g!/pattern/command
```

hoặc

```shell
:v/pattern/command
```

Nếu bạn chạy `:v/console/d`, nó sẽ xóa tất cả các dòng *không* chứa "console".

## Mẫu

Lệnh toàn cục sử dụng cùng một hệ thống mẫu như lệnh thay thế, vì vậy phần này sẽ phục vụ như một sự ôn tập. Hãy thoải mái bỏ qua phần tiếp theo hoặc đọc tiếp!

Nếu bạn có những biểu thức này:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Để xóa các dòng chứa "one" hoặc "two", hãy chạy:

```shell
:g/one\|two/d
```

Để xóa các dòng chứa bất kỳ chữ số đơn nào, hãy chạy:

```shell
:g/[0-9]/d
```

hoặc

```shell
:g/\d/d
```

Nếu bạn có biểu thức:

```shell
const oneMillion = 1000000;
const oneThousand = 1000;
const one = 1;
```

Để khớp với các dòng chứa từ ba đến sáu số không, hãy chạy:

```shell
:g/0\{3,6\}/d
```

## Truyền Một Phạm Vi

Bạn có thể truyền một phạm vi trước lệnh `g`. Dưới đây là một số cách bạn có thể làm điều đó:
- `:1,5g/console/d` khớp với chuỗi "console" giữa các dòng 1 và 5 và xóa chúng.
- `:,5g/console/d` nếu không có địa chỉ trước dấu phẩy, thì nó bắt đầu từ dòng hiện tại. Nó tìm kiếm chuỗi "console" giữa dòng hiện tại và dòng 5 và xóa chúng.
- `:3,g/console/d` nếu không có địa chỉ sau dấu phẩy, thì nó kết thúc ở dòng hiện tại. Nó tìm kiếm chuỗi "console" giữa dòng 3 và dòng hiện tại và xóa chúng.
- `:3g/console/d` nếu bạn chỉ truyền một địa chỉ mà không có dấu phẩy, nó chỉ thực thi lệnh trên dòng 3. Nó tìm kiếm trên dòng 3 và xóa nếu có chuỗi "console".

Ngoài các số, bạn cũng có thể sử dụng các ký hiệu này như phạm vi:
- `.` có nghĩa là dòng hiện tại. Một phạm vi `.,3` có nghĩa là giữa dòng hiện tại và dòng 3.
- `$` có nghĩa là dòng cuối cùng trong tệp. Phạm vi `3,$` có nghĩa là giữa dòng 3 và dòng cuối cùng.
- `+n` có nghĩa là n dòng sau dòng hiện tại. Bạn có thể sử dụng nó với `.` hoặc không. `3,+1` hoặc `3,.+1` có nghĩa là giữa dòng 3 và dòng sau dòng hiện tại.

Nếu bạn không cung cấp bất kỳ phạm vi nào, theo mặc định nó ảnh hưởng đến toàn bộ tệp. Điều này thực sự không phải là quy tắc. Hầu hết các lệnh dòng lệnh của Vim chỉ chạy trên dòng hiện tại nếu bạn không truyền cho nó bất kỳ phạm vi nào. Hai ngoại lệ đáng chú ý là lệnh toàn cục (`:g`) và lệnh lưu (`:w`).

## Lệnh Bình Thường

Bạn có thể chạy một lệnh bình thường với lệnh toàn cục bằng lệnh dòng lệnh `:normal`.

Nếu bạn có văn bản này:
```shell
const one = 1
console.log("one: ", one)

const two = 2
console.log("two: ", two)

const three = 3
console.log("three: ", three)
```

Để thêm một ";" vào cuối mỗi dòng, hãy chạy:

```shell
:g/./normal A;
```

Hãy phân tích nó:
- `:g` là lệnh toàn cục.
- `/./` là một mẫu cho "các dòng không rỗng". Nó khớp với các dòng có ít nhất một ký tự, vì vậy nó khớp với các dòng có "const" và "console" và nó không khớp với các dòng rỗng.
- `normal A;` chạy lệnh dòng lệnh `:normal`. `A;` là lệnh chế độ bình thường để chèn một ";" vào cuối dòng.

## Thực Thi Một Macro

Bạn cũng có thể thực thi một macro với lệnh toàn cục. Một macro có thể được thực thi với lệnh `normal`. Nếu bạn có các biểu thức:

```shell
const one = 1
console.log("one: ", one);

const two = 2
console.log("two: ", two);

const three = 3
console.log("three: ", three);
```

Lưu ý rằng các dòng có "const" không có dấu chấm phẩy. Hãy tạo một macro để thêm dấu phẩy vào cuối các dòng đó trong thanh ghi a:

```shell
qaA;<Esc>q
```

Nếu bạn cần ôn tập, hãy kiểm tra chương về macro. Bây giờ chạy:

```shell
:g/const/normal @a
```

Bây giờ tất cả các dòng có "const" sẽ có một ";" ở cuối.

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Nếu bạn làm theo từng bước này, bạn sẽ có hai dấu chấm phẩy ở dòng đầu tiên. Để tránh điều đó, hãy chạy lệnh toàn cục từ dòng hai trở đi, `:2,$g/const/normal @a`.

## Lệnh Toàn Cục Đệ Quy

Lệnh toàn cục tự nó là một loại lệnh dòng lệnh, vì vậy bạn có thể chạy lệnh toàn cục bên trong một lệnh toàn cục.

Với các biểu thức sau, nếu bạn muốn xóa lệnh `console.log` thứ hai:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Nếu bạn chạy:

```shell
:g/console/g/two/d
```

Đầu tiên, `g` sẽ tìm kiếm các dòng chứa mẫu "console" và sẽ tìm thấy 3 khớp. Sau đó, `g` thứ hai sẽ tìm kiếm dòng chứa mẫu "two" từ ba khớp đó. Cuối cùng, nó sẽ xóa khớp đó.

Bạn cũng có thể kết hợp `g` với `v` để tìm các mẫu tích cực và tiêu cực. Ví dụ:

```shell
:g/console/v/two/d
```

Thay vì tìm kiếm dòng chứa mẫu "two", nó sẽ tìm kiếm các dòng *không* chứa mẫu "two".

## Thay Đổi Ký Tự Phân Cách

Bạn có thể thay đổi ký tự phân cách của lệnh toàn cục giống như lệnh thay thế. Các quy tắc là giống nhau: bạn có thể sử dụng bất kỳ ký tự byte đơn nào ngoại trừ chữ cái, số, `"`, `|`, và `\`.

Để xóa các dòng chứa "console":

```shell
:g@console@d
```

Nếu bạn đang sử dụng lệnh thay thế với lệnh toàn cục, bạn có thể có hai ký tự phân cách khác nhau:

```shell
g@one@s+const+let+g
```

Ở đây lệnh toàn cục sẽ tìm kiếm tất cả các dòng chứa "one". Lệnh thay thế sẽ thay thế, từ những khớp đó, chuỗi "const" bằng "let".

## Lệnh Mặc Định

Điều gì sẽ xảy ra nếu bạn không chỉ định bất kỳ lệnh dòng lệnh nào trong lệnh toàn cục?

Lệnh toàn cục sẽ sử dụng lệnh in (`:p`) để in văn bản của dòng hiện tại. Nếu bạn chạy:

```shell
:g/console
```

Nó sẽ in ở dưới cùng của màn hình tất cả các dòng chứa "console".

Nhân tiện, đây là một sự thật thú vị. Bởi vì lệnh mặc định được sử dụng bởi lệnh toàn cục là `p`, điều này làm cho cú pháp `g` trở thành:

```shell
:g/re/p
```

- `g` = lệnh toàn cục
- `re` = mẫu regex
- `p` = lệnh in

Nó đánh vần *"grep"*, cùng một `grep` từ dòng lệnh. Đây **không** phải là một sự trùng hợp. Lệnh `g/re/p` ban đầu xuất phát từ Ed Editor, một trong những trình soạn thảo văn bản dòng đầu tiên. Lệnh `grep` có tên từ Ed.

Máy tính của bạn có thể vẫn có trình soạn thảo Ed. Chạy `ed` từ terminal (gợi ý: để thoát, gõ `q`).

## Đảo Ngược Toàn Bộ Bộ Đệm

Để đảo ngược toàn bộ tệp, hãy chạy:

```shell
:g/^/m 0
```

`^` là một mẫu cho đầu dòng. Sử dụng `^` để khớp với tất cả các dòng, bao gồm cả các dòng rỗng.

Nếu bạn cần đảo ngược chỉ một vài dòng, hãy truyền cho nó một phạm vi. Để đảo ngược các dòng giữa dòng năm đến dòng mười, hãy chạy:

```shell
:5,10g/^/m 0
```

Để tìm hiểu thêm về lệnh di chuyển, hãy kiểm tra `:h :move`.

## Tập Hợp Tất Cả Todos

Khi lập trình, đôi khi tôi sẽ viết TODO trong tệp tôi đang chỉnh sửa:

```shell
const one = 1;
console.log("one: ", one);
// TODO: cho chó con ăn

const two = 2;
// TODO: cho chó con ăn tự động
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: tạo một startup bán máy cho chó con ăn tự động
```

Thật khó để theo dõi tất cả các TODO đã tạo. Vim có phương pháp `:t` (sao chép) để sao chép tất cả các khớp đến một địa chỉ. Để tìm hiểu thêm về phương pháp sao chép, hãy kiểm tra `:h :copy`.

Để sao chép tất cả các TODO đến cuối tệp để dễ dàng kiểm tra, hãy chạy:

```shell
:g/TODO/t $
```

Kết quả:

```shell
const one = 1;
console.log("one: ", one);
// TODO: cho chó con ăn

const two = 2;
// TODO: cho chó con ăn tự động
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
// TODO: tạo một startup bán máy cho chó con ăn tự động

// TODO: cho chó con ăn
// TODO: cho chó con ăn tự động
// TODO: tạo một startup bán máy cho chó con ăn tự động
```

Bây giờ tôi có thể xem lại tất cả các TODO mà tôi đã tạo, tìm thời gian để làm chúng hoặc giao cho người khác, và tiếp tục làm việc với nhiệm vụ tiếp theo của mình.

Nếu thay vì sao chép chúng bạn muốn di chuyển tất cả các TODO đến cuối, hãy sử dụng lệnh di chuyển, `:m`:

```shell
:g/TODO/m $
```

Kết quả:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);

// TODO: cho chó con ăn
// TODO: cho chó con ăn tự động
// TODO: tạo một startup bán máy cho chó con ăn tự động
```

## Xóa Lỗ Đen

Nhớ lại từ chương về thanh ghi rằng các văn bản đã xóa được lưu trữ trong các thanh ghi số (miễn là chúng đủ lớn). Mỗi khi bạn chạy `:g/console/d`, Vim lưu trữ các dòng đã xóa trong các thanh ghi số. Nếu bạn xóa nhiều dòng, bạn có thể nhanh chóng làm đầy tất cả các thanh ghi số. Để tránh điều này, bạn có thể luôn sử dụng thanh ghi lỗ đen (`"_`) để *không* lưu các dòng đã xóa của bạn vào các thanh ghi. Chạy:

```shell
:g/console/d_
```

Bằng cách truyền `_` sau `d`, Vim sẽ không sử dụng các thanh ghi tạm của bạn.
## Giảm Nhiều Dòng Trống Xuống Một Dòng Trống

Nếu bạn có một văn bản với nhiều dòng trống:

```shell
const one = 1;
console.log("one: ", one);


const two = 2;
console.log("two: ", two);





const three = 3;
console.log("three: ", three);
```

Bạn có thể nhanh chóng giảm các dòng trống xuống còn một dòng trống với:

```shell
:g/^$/,/./-1j
```

Kết quả:

```shell
const one = 1;
console.log("one: ", one);

const two = 2;
console.log("two: ", two);

const three = 3;
console.log("three: ", three);
```

Thông thường, lệnh toàn cục chấp nhận dạng sau: `:g/pattern/command`. Tuy nhiên, bạn cũng có thể chạy lệnh toàn cục với dạng sau: `:g/pattern1/,/pattern2/command`. Với điều này, Vim sẽ áp dụng `command` trong `pattern1` và `pattern2`.

Với điều đó trong tâm trí, hãy phân tích lệnh `:g/^$/,/./-1j` theo `:g/pattern1/,/pattern2/command`:
- `/pattern1/` là `/^$/`. Nó đại diện cho một dòng trống (một dòng không có ký tự).
- `/pattern2/` là `/./` với bộ điều chỉnh dòng `-1`. `/./` đại diện cho một dòng không trống (một dòng có ít nhất một ký tự). `-1` có nghĩa là dòng trên dòng đó.
- `command` là `j`, lệnh nối (`:j`). Trong bối cảnh này, lệnh toàn cục này nối tất cả các dòng đã cho.

Nhân tiện, nếu bạn muốn giảm nhiều dòng trống xuống không còn dòng nào, hãy chạy lệnh này thay vào đó:

```shell
:g/^$/,/./j
```

Một lựa chọn đơn giản hơn:

```shell
:g/^$/-j
```

Văn bản của bạn bây giờ đã giảm xuống:

```shell
const one = 1;
console.log("one: ", one);
const two = 2;
console.log("two: ", two);
const three = 3;
console.log("three: ", three);
```

## Sắp Xếp Nâng Cao

Vim có lệnh `:sort` để sắp xếp các dòng trong một khoảng. Ví dụ:

```shell
d
b
a
e
c
```

Bạn có thể sắp xếp chúng bằng cách chạy `:sort`. Nếu bạn cung cấp một khoảng, nó sẽ chỉ sắp xếp các dòng trong khoảng đó. Ví dụ, `:3,5sort` chỉ sắp xếp các dòng ba và năm.

Nếu bạn có các biểu thức sau:

```shell
const arrayB = [
  "i",
  "g",
  "h",
  "b",
  "f",
  "d",
  "e",
  "c",
  "a",
]

const arrayA = [
  "h",
  "b",
  "f",
  "d",
  "e",
  "a",
  "c",
]
```

Nếu bạn cần sắp xếp các phần tử bên trong các mảng, nhưng không phải các mảng tự thân, bạn có thể chạy lệnh này:

```shell
:g/\[/+1,/\]/-1sort
```

Kết quả:

```shell
const arrayB = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
]

const arrayA = [
  "a"
  "b",
  "c",
  "d",
  "e",
  "f",
  "h",
]
```

Điều này thật tuyệt! Nhưng lệnh có vẻ phức tạp. Hãy phân tích nó. Lệnh này cũng tuân theo dạng `:g/pattern1/,/pattern2/command`.

- `:g` là mẫu lệnh toàn cục.
- `/\[/+1` là mẫu đầu tiên. Nó khớp với một dấu ngoặc vuông trái "[". `+1` đề cập đến dòng bên dưới nó.
- `/\]/-1` là mẫu thứ hai. Nó khớp với một dấu ngoặc vuông phải "]". `-1` đề cập đến dòng bên trên nó.
- `/\[/+1,/\]/-1` sau đó đề cập đến bất kỳ dòng nào giữa "[" và "]".
- `sort` là một lệnh dòng lệnh để sắp xếp.

## Học Lệnh Toàn Cục Một Cách Thông Minh

Lệnh toàn cục thực hiện lệnh dòng lệnh đối với tất cả các dòng khớp. Với nó, bạn chỉ cần chạy một lệnh một lần và Vim sẽ làm phần còn lại cho bạn. Để trở nên thành thạo với lệnh toàn cục, cần hai điều: một vốn từ vựng tốt về các lệnh dòng lệnh và kiến thức về biểu thức chính quy. Khi bạn dành nhiều thời gian hơn để sử dụng Vim, bạn sẽ tự nhiên học được nhiều lệnh dòng lệnh hơn. Kiến thức về biểu thức chính quy sẽ yêu cầu một cách tiếp cận chủ động hơn. Nhưng một khi bạn cảm thấy thoải mái với các biểu thức chính quy, bạn sẽ vượt trội hơn nhiều người.

Một số ví dụ ở đây có phần phức tạp. Đừng để bị áp lực. Hãy thật sự dành thời gian để hiểu chúng. Học cách đọc các mẫu. Đừng từ bỏ.

Mỗi khi bạn cần chạy nhiều lệnh, hãy dừng lại và xem liệu bạn có thể sử dụng lệnh `g`. Xác định lệnh tốt nhất cho công việc và viết một mẫu để nhắm đến nhiều thứ cùng một lúc.

Bây giờ bạn đã biết lệnh toàn cục mạnh mẽ như thế nào, hãy học cách sử dụng các lệnh bên ngoài để tăng cường kho công cụ của bạn.