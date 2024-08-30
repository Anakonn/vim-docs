---
description: Tài liệu này hướng dẫn cách tìm kiếm và thay thế trong Vim, bao gồm việc
  sử dụng biểu thức chính quy và tùy chọn nhạy cảm với chữ hoa chữ thường.
title: Ch12. Search and Substitute
---

Chương này đề cập đến hai khái niệm riêng biệt nhưng liên quan: tìm kiếm và thay thế. Thường thì khi chỉnh sửa, bạn cần tìm kiếm nhiều văn bản dựa trên các mẫu chung nhất của chúng. Bằng cách học cách sử dụng biểu thức chính quy trong tìm kiếm và thay thế thay vì các chuỗi văn bản cụ thể, bạn sẽ có thể nhắm mục tiêu bất kỳ văn bản nào một cách nhanh chóng.

Lưu ý rằng trong chương này, tôi sẽ sử dụng `/` khi nói về tìm kiếm. Mọi thứ bạn có thể làm với `/` cũng có thể được thực hiện với `?`.

## Độ nhạy với chữ hoa chữ thường thông minh

Việc cố gắng khớp với chữ hoa chữ thường của từ tìm kiếm có thể gặp khó khăn. Nếu bạn đang tìm kiếm văn bản "Learn Vim", bạn có thể dễ dàng gõ sai chữ hoa của một chữ cái và nhận được kết quả tìm kiếm sai. Liệu có dễ dàng và an toàn hơn nếu bạn có thể khớp với bất kỳ chữ hoa nào không? Đây là lúc tùy chọn `ignorecase` tỏa sáng. Chỉ cần thêm `set ignorecase` vào vimrc của bạn và tất cả các từ tìm kiếm của bạn sẽ trở nên không phân biệt chữ hoa chữ thường. Bây giờ bạn không cần phải gõ `/Learn Vim` nữa, `/learn vim` sẽ hoạt động.

Tuy nhiên, có những lúc bạn cần tìm kiếm một cụm từ cụ thể về chữ hoa chữ thường. Một cách để làm điều đó là tắt tùy chọn `ignorecase` bằng cách chạy `set noignorecase`, nhưng điều đó là rất mất công khi phải bật và tắt mỗi khi bạn cần tìm kiếm một cụm từ phân biệt chữ hoa chữ thường.

Để tránh việc chuyển đổi `ignorecase`, Vim có tùy chọn `smartcase` để tìm kiếm chuỗi không phân biệt chữ hoa chữ thường nếu mẫu tìm kiếm *chứa ít nhất một ký tự chữ hoa*. Bạn có thể kết hợp cả `ignorecase` và `smartcase` để thực hiện tìm kiếm không phân biệt chữ hoa chữ thường khi bạn nhập tất cả các ký tự chữ thường và tìm kiếm phân biệt chữ hoa chữ thường khi bạn nhập một hoặc nhiều ký tự chữ hoa.

Trong vimrc của bạn, thêm:

```shell
set ignorecase smartcase
```

Nếu bạn có những văn bản này:

```shell
hello
HELLO
Hello
```

- `/hello` khớp với "hello", "HELLO", và "Hello".
- `/HELLO` chỉ khớp với "HELLO".
- `/Hello` chỉ khớp với "Hello".

Có một nhược điểm. Nếu bạn cần tìm kiếm chỉ một chuỗi chữ thường? Khi bạn làm `/hello`, Vim bây giờ thực hiện tìm kiếm không phân biệt chữ hoa chữ thường. Bạn có thể sử dụng mẫu `\C` ở bất kỳ đâu trong từ tìm kiếm của bạn để cho Vim biết rằng từ tìm kiếm tiếp theo sẽ phân biệt chữ hoa chữ thường. Nếu bạn làm `/\Chello`, nó sẽ khớp chính xác với "hello", không phải "HELLO" hay "Hello".

## Ký tự đầu tiên và cuối cùng trong một dòng

Bạn có thể sử dụng `^` để khớp với ký tự đầu tiên trong một dòng và `$` để khớp với ký tự cuối cùng trong một dòng.

Nếu bạn có văn bản này:

```shell
hello hello
```

Bạn có thể nhắm mục tiêu "hello" đầu tiên với `/^hello`. Ký tự theo sau `^` phải là ký tự đầu tiên trong một dòng. Để nhắm mục tiêu "hello" cuối cùng, chạy `/hello$`. Ký tự trước `$` phải là ký tự cuối cùng trong một dòng.

Nếu bạn có văn bản này:

```shell
hello hello friend
```

Chạy `/hello$` sẽ không khớp với bất kỳ điều gì vì "friend" là thuật ngữ cuối cùng trong dòng đó, không phải "hello".

## Tìm kiếm lặp lại

Bạn có thể lặp lại tìm kiếm trước đó với `//`. Nếu bạn vừa tìm kiếm `/hello`, chạy `//` tương đương với việc chạy `/hello`. Phím tắt này có thể tiết kiệm cho bạn một số lần gõ phím, đặc biệt nếu bạn vừa tìm kiếm một chuỗi dài. Cũng nhớ rằng bạn có thể sử dụng `n` và `N` để lặp lại tìm kiếm cuối cùng với cùng hướng và hướng ngược lại, tương ứng.

Nếu bạn muốn nhanh chóng gọi lại *n* từ tìm kiếm cuối cùng? Bạn có thể nhanh chóng duyệt qua lịch sử tìm kiếm bằng cách đầu tiên nhấn `/`, sau đó nhấn phím mũi tên `lên`/`xuống` (hoặc `Ctrl-N`/`Ctrl-P`) cho đến khi bạn tìm thấy từ tìm kiếm bạn cần. Để xem tất cả lịch sử tìm kiếm của bạn, bạn có thể chạy `:history /`.

Khi bạn đến cuối một tệp trong khi tìm kiếm, Vim sẽ báo lỗi: `"Search hit the BOTTOM without match for: {your-search}"`. Đôi khi điều này có thể là một biện pháp bảo vệ tốt để tránh tìm kiếm quá mức, nhưng đôi khi bạn muốn quay lại tìm kiếm từ đầu. Bạn có thể sử dụng tùy chọn `set wrapscan` để khiến Vim tìm kiếm lại từ đầu tệp khi bạn đến cuối tệp. Để tắt tính năng này, hãy làm `set nowrapscan`.

## Tìm kiếm các từ thay thế

Thường thì bạn cần tìm kiếm nhiều từ cùng một lúc. Nếu bạn cần tìm kiếm *hoặc* "hello vim" hoặc "hola vim", nhưng không phải "salve vim" hay "bonjour vim", bạn có thể sử dụng mẫu `|`.

Cho văn bản này:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Để khớp với cả "hello" và "hola", bạn có thể làm `/hello\|hola`. Bạn phải thoát (`\`) toán tử hoặc (`|`), nếu không Vim sẽ tìm kiếm chuỗi "|".

Nếu bạn không muốn gõ `\|` mỗi lần, bạn có thể sử dụng cú pháp `magic` (`\v`) ở đầu tìm kiếm: `/\vhello|hola`. Tôi sẽ không đề cập đến `magic` trong hướng dẫn này, nhưng với `\v`, bạn không cần phải thoát các ký tự đặc biệt nữa. Để tìm hiểu thêm về `\v`, bạn có thể kiểm tra `:h \v`.

## Đặt điểm bắt đầu và kết thúc của một phép khớp

Có thể bạn cần tìm kiếm một văn bản là một phần của một từ ghép. Nếu bạn có những văn bản này:

```shell
11vim22
vim22
11vim
vim
```

Nếu bạn cần chọn "vim" nhưng chỉ khi nó bắt đầu bằng "11" và kết thúc bằng "22", bạn có thể sử dụng các toán tử `\zs` (bắt đầu khớp) và `\ze` (kết thúc khớp). Chạy:

```shell
/11\zsvim\ze22
```

Vim vẫn phải khớp với toàn bộ mẫu "11vim22", nhưng chỉ làm nổi bật mẫu nằm giữa `\zs` và `\ze`. Một ví dụ khác:

```shell
foobar
foobaz
```

Nếu bạn cần khớp với "foo" trong "foobaz" nhưng không trong "foobar", hãy chạy:

```shell
/foo\zebaz
```

## Tìm kiếm các khoảng ký tự

Tất cả các từ tìm kiếm của bạn cho đến thời điểm này đều là tìm kiếm một từ cụ thể. Trong thực tế, bạn có thể phải sử dụng một mẫu tổng quát để tìm văn bản của bạn. Mẫu cơ bản nhất là khoảng ký tự, `[ ]`.

Nếu bạn cần tìm kiếm bất kỳ chữ số nào, bạn có thể không muốn gõ `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` mỗi lần. Thay vào đó, hãy sử dụng `/[0-9]` để khớp với một chữ số đơn. Biểu thức `0-9` đại diện cho một khoảng số từ 0-9 mà Vim sẽ cố gắng khớp, vì vậy nếu bạn đang tìm kiếm các chữ số từ 1 đến 5, hãy sử dụng `/[1-5]`.

Chữ số không phải là loại dữ liệu duy nhất mà Vim có thể tìm kiếm. Bạn cũng có thể làm `/[a-z]` để tìm kiếm các chữ cái chữ thường và `/[A-Z]` để tìm kiếm các chữ cái chữ hoa.

Bạn có thể kết hợp các khoảng này lại với nhau. Nếu bạn cần tìm kiếm các chữ số từ 0-9 và cả các chữ cái chữ thường và chữ hoa từ "a" đến "f" (như một số hex), bạn có thể làm `/[0-9a-fA-F]`.

Để thực hiện tìm kiếm phủ định, bạn có thể thêm `^` bên trong các dấu ngoặc của khoảng ký tự. Để tìm kiếm một ký tự không phải chữ số, hãy chạy `/[^0-9]`. Vim sẽ khớp với bất kỳ ký tự nào miễn là nó không phải là một chữ số. Hãy cẩn thận rằng dấu mũ (`^`) bên trong các dấu ngoặc khác với dấu mũ ở đầu dòng (ví dụ: `/^hello`). Nếu một dấu mũ nằm ngoài một cặp dấu ngoặc và là ký tự đầu tiên trong từ tìm kiếm, nó có nghĩa là "ký tự đầu tiên trong một dòng". Nếu một dấu mũ nằm bên trong một cặp dấu ngoặc và là ký tự đầu tiên bên trong các dấu ngoặc, nó có nghĩa là một toán tử tìm kiếm phủ định. `/^abc` khớp với "abc" đầu tiên trong một dòng và `/[^abc]` khớp với bất kỳ ký tự nào ngoại trừ "a", "b", hoặc "c".

## Tìm kiếm các ký tự lặp lại

Nếu bạn cần tìm kiếm các chữ số đôi trong văn bản này:

```shell
1aa
11a
111
```

Bạn có thể sử dụng `/[0-9][0-9]` để khớp với một ký tự hai chữ số, nhưng phương pháp này không mở rộng được. Thế nếu bạn cần khớp với hai mươi chữ số thì sao? Gõ `[0-9]` hai mươi lần không phải là một trải nghiệm thú vị. Đó là lý do bạn cần một tham số `count`.

Bạn có thể truyền `count` vào tìm kiếm của mình. Nó có cú pháp như sau:

```shell
{n,m}
```

Nhân tiện, các dấu ngoặc `count` này cần được thoát khi bạn sử dụng chúng trong Vim. Toán tử `count` được đặt sau một ký tự đơn mà bạn muốn tăng.

Dưới đây là bốn biến thể khác nhau của cú pháp `count`:
- `{n}` là một khớp chính xác. `/[0-9]\{2\}` khớp với các số hai chữ số: "11" và "11" trong "111".
- `{n,m}` là một khớp khoảng. `/[0-9]\{2,3\}` khớp với các số từ 2 đến 3 chữ số: "11" và "111".
- `{,m}` là một khớp tối đa. `/[0-9]\{,3\}` khớp với các số tối đa 3 chữ số: "1", "11", và "111".
- `{n,}` là một khớp tối thiểu. `/[0-9]\{2,\}` khớp với ít nhất 2 chữ số trở lên: "11" và "111".

Các tham số count `\{0,\}` (không hoặc nhiều hơn) và `\{1,\}` (một hoặc nhiều hơn) là các mẫu tìm kiếm phổ biến và Vim có các toán tử đặc biệt cho chúng: `*` và `+` (`+` cần được thoát trong khi `*` hoạt động tốt mà không cần thoát). Nếu bạn làm `/[0-9]*`, nó tương đương với `/[0-9]\{0,\}`. Nó tìm kiếm không hoặc nhiều hơn các chữ số. Nó sẽ khớp với "", "1", "123". Nhân tiện, nó cũng sẽ khớp với các ký tự không phải chữ số như "a", vì thực tế có không chữ số nào trong chữ cái "a". Hãy suy nghĩ cẩn thận trước khi sử dụng `*`. Nếu bạn làm `/[0-9]\+`, nó tương đương với `/[0-9]\{1,\}`. Nó tìm kiếm một hoặc nhiều chữ số. Nó sẽ khớp với "1" và "12".

## Các khoảng ký tự đã định nghĩa trước

Vim có các khoảng đã định nghĩa trước cho các ký tự phổ biến như chữ số và chữ cái. Tôi sẽ không đi qua từng cái ở đây, nhưng bạn có thể tìm thấy danh sách đầy đủ bên trong `:h /character-classes`. Dưới đây là những cái hữu ích:

```shell
\d    Chữ số [0-9]
\D    Không phải chữ số [^0-9]
\s    Ký tự khoảng trắng (dấu cách và tab)
\S    Ký tự không phải khoảng trắng (mọi thứ ngoại trừ dấu cách và tab)
\w    Ký tự từ [0-9A-Za-z_]
\l    Chữ cái chữ thường [a-z]
\u    Ký tự chữ hoa [A-Z]
```

Bạn có thể sử dụng chúng như bạn sẽ sử dụng các khoảng ký tự. Để tìm kiếm bất kỳ chữ số nào, thay vì sử dụng `/[0-9]`, bạn có thể sử dụng `/\d` cho cú pháp ngắn gọn hơn.

## Ví dụ tìm kiếm: Bắt một văn bản giữa một cặp ký tự tương tự

Nếu bạn muốn tìm kiếm một cụm từ được bao quanh bởi một cặp dấu ngoặc kép:

```shell
"Vim is awesome!"
```

Chạy lệnh này:

```shell
/"[^"]\+"
```

Hãy phân tích nó:
- `"` là một dấu ngoặc kép. Nó khớp với dấu ngoặc kép đầu tiên.
- `[^"]` có nghĩa là bất kỳ ký tự nào ngoại trừ dấu ngoặc kép. Nó khớp với bất kỳ ký tự chữ số và khoảng trắng nào miễn là nó không phải là dấu ngoặc kép.
- `\+` có nghĩa là một hoặc nhiều. Vì nó được theo sau bởi `[^"]`, Vim tìm kiếm một hoặc nhiều ký tự không phải dấu ngoặc kép.
- `"` là một dấu ngoặc kép. Nó khớp với dấu ngoặc kép đóng.

Khi Vim thấy dấu `"` đầu tiên, nó bắt đầu việc bắt mẫu. Ngay khi nó thấy dấu ngoặc kép thứ hai trong một dòng, nó khớp với mẫu thứ hai `"` và dừng việc bắt mẫu. Trong khi đó, tất cả các ký tự không phải dấu ngoặc kép ở giữa được bắt bởi mẫu `[^"]\+`, trong trường hợp này, cụm từ `Vim is awesome!`. Đây là một mẫu phổ biến để bắt một cụm từ được bao quanh bởi một cặp dấu phân cách tương tự.

- Để bắt một cụm từ được bao quanh bởi dấu nháy đơn, bạn có thể sử dụng `/'[^']\+'`.
- Để bắt một cụm từ được bao quanh bởi số không, bạn có thể sử dụng `/0[^0]\+0`.

## Ví dụ tìm kiếm: Bắt một số điện thoại

Nếu bạn muốn khớp với một số điện thoại của Mỹ được phân tách bằng dấu gạch ngang (`-`), như `123-456-7890`, bạn có thể sử dụng:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Số điện thoại của Mỹ bao gồm một tập hợp ba chữ số, tiếp theo là ba chữ số khác, và cuối cùng là bốn chữ số. Hãy phân tích nó:
- `\d\{3\}` khớp với một chữ số lặp lại chính xác ba lần
- `-` là một dấu gạch ngang

Bạn có thể tránh gõ các ký tự thoát với `\v`:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Mẫu này cũng hữu ích để bắt bất kỳ chữ số lặp lại nào, chẳng hạn như địa chỉ IP và mã bưu điện.

Đó là phần tìm kiếm của chương này. Bây giờ hãy chuyển sang thay thế.

## Thay thế cơ bản

Lệnh thay thế của Vim là một lệnh hữu ích để nhanh chóng tìm và thay thế bất kỳ mẫu nào. Cú pháp thay thế là:

```shell
:s/{old-pattern}/{new-pattern}/
```

Hãy bắt đầu với một cách sử dụng cơ bản. Nếu bạn có văn bản này:

```shell
vim is good
```

Hãy thay thế "good" bằng "awesome" vì Vim thật tuyệt vời. Chạy `:s/good/awesome/`. Bạn sẽ thấy:

```shell
vim is awesome
```
## Lặp lại Thay thế Cuối cùng

Bạn có thể lặp lại lệnh thay thế cuối cùng bằng cách sử dụng lệnh bình thường `&` hoặc bằng cách chạy `:s`. Nếu bạn vừa chạy `:s/good/awesome/`, việc chạy `&` hoặc `:s` sẽ lặp lại nó.

Ngoài ra, ở phần trước của chương này, tôi đã đề cập rằng bạn có thể sử dụng `//` để lặp lại mẫu tìm kiếm trước đó. Mẹo này hoạt động với lệnh thay thế. Nếu `/good` được thực hiện gần đây và bạn để đối số mẫu thay thế đầu tiên trống, như trong `:s//awesome/`, nó hoạt động giống như việc chạy `:s/good/awesome/`.

## Phạm vi Thay thế

Giống như nhiều lệnh Ex, bạn có thể truyền một đối số phạm vi vào lệnh thay thế. Cú pháp là:

```shell
:[range]s/old/new/
```

Nếu bạn có những biểu thức này:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Để thay thế "let" thành "const" trên các dòng ba đến năm, bạn có thể làm:

```shell
:3,5s/let/const/
```

Dưới đây là một số biến thể phạm vi bạn có thể truyền:

- `:,3s/let/const/` - nếu không có gì được đưa ra trước dấu phẩy, nó đại diện cho dòng hiện tại. Thay thế từ dòng hiện tại đến dòng 3.
- `:1,s/let/const/` - nếu không có gì được đưa ra sau dấu phẩy, nó cũng đại diện cho dòng hiện tại. Thay thế từ dòng 1 đến dòng hiện tại.
- `:3s/let/const/` - nếu chỉ có một giá trị được đưa ra như phạm vi (không có dấu phẩy), nó chỉ thực hiện thay thế trên dòng đó.

Trong Vim, `%` thường có nghĩa là toàn bộ tệp. Nếu bạn chạy `:%s/let/const/`, nó sẽ thực hiện thay thế trên tất cả các dòng. Hãy nhớ về cú pháp phạm vi này. Nhiều lệnh dòng lệnh mà bạn sẽ học trong các chương tới sẽ theo hình thức này.

## Khớp Mẫu

Một vài phần tiếp theo sẽ đề cập đến các biểu thức chính quy cơ bản. Kiến thức về mẫu mạnh mẽ là điều cần thiết để làm chủ lệnh thay thế.

Nếu bạn có các biểu thức sau:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

Để thêm một cặp dấu ngoặc kép xung quanh các chữ số:

```shell
:%s/\d/"\0"/
```

Kết quả:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Hãy phân tích lệnh:
- `:%s` nhắm đến toàn bộ tệp để thực hiện thay thế.
- `\d` là phạm vi đã được định nghĩa trước của Vim cho các chữ số (tương tự như việc sử dụng `[0-9]`).
- `"\0"` ở đây dấu ngoặc kép là dấu ngoặc kép nguyên. `\0` là một ký tự đặc biệt đại diện cho "toàn bộ mẫu đã khớp". Mẫu đã khớp ở đây là một số chữ số đơn, `\d`.

Ngoài ra, `&` cũng đại diện cho toàn bộ mẫu đã khớp như `\0`. `:s/\d/"&"/` cũng sẽ hoạt động.

Hãy xem xét một ví dụ khác. Giả sử bạn có các biểu thức này và bạn cần hoán đổi tất cả các "let" với các tên biến.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

Để làm điều đó, hãy chạy:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

Lệnh trên chứa quá nhiều dấu gạch chéo và khó đọc. Trong trường hợp này, việc sử dụng toán tử `\v` sẽ thuận tiện hơn:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Kết quả:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Tuyệt vời! Hãy phân tích lệnh đó:
- `:%s` nhắm đến tất cả các dòng trong tệp để thực hiện thay thế.
- `(\w+) (\w+)` là một nhóm khớp. `\w` là một trong những phạm vi đã được định nghĩa trước của Vim cho một ký tự từ (`[0-9A-Za-z_]`). Các dấu ngoặc `( )` bao quanh nó sẽ lưu trữ một khớp ký tự từ trong một nhóm. Lưu ý khoảng trắng giữa hai nhóm. `(\w+) (\w+)` lưu trữ hai nhóm. Nhóm đầu tiên lưu trữ "one" và nhóm thứ hai lưu trữ "two".
- `\2 \1` trả về nhóm đã lưu trữ theo thứ tự đảo ngược. `\2` chứa chuỗi đã lưu trữ "let" và `\1` là chuỗi "one". Việc có `\2 \1` trả về chuỗi "let one".

Nhớ rằng `\0` đại diện cho toàn bộ mẫu đã khớp. Bạn có thể chia nhỏ chuỗi đã khớp thành các nhóm nhỏ hơn với `( )`. Mỗi nhóm được đại diện bởi `\1`, `\2`, `\3`, v.v.

Hãy làm một ví dụ nữa để củng cố khái niệm nhóm khớp này. Nếu bạn có các số sau:

```shell
123
456
789
```

Để đảo ngược thứ tự, hãy chạy:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Kết quả là:

```shell
321
654
987
```

Mỗi `(\d)` khớp với mỗi chữ số và tạo ra một nhóm. Trên dòng đầu tiên, `(\d)` đầu tiên có giá trị là 1, `(\d)` thứ hai có giá trị là 2, và `(\d)` thứ ba có giá trị là 3. Chúng được lưu trữ trong các biến `\1`, `\2`, và `\3`. Trong nửa sau của thay thế của bạn, mẫu mới `\3\2\1` dẫn đến giá trị "321" trên dòng một.

Nếu bạn đã chạy điều này thay vào đó:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Bạn sẽ nhận được một kết quả khác:

```shell
312
645
978
```

Điều này là vì bây giờ bạn chỉ có hai nhóm. Nhóm đầu tiên, được lưu trữ bởi `(\d\d)`, được lưu trữ trong `\1` và có giá trị là 12. Nhóm thứ hai, được lưu trữ bởi `(\d)`, được lưu trữ trong `\2` và có giá trị là 3. `\2\1` sau đó, trả về 312.

## Cờ Thay thế

Nếu bạn có câu:

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

Để thay thế tất cả các bánh pancake thành bánh donut, bạn không thể chỉ chạy:

```shell
:s/pancake/donut
```

Lệnh trên chỉ thay thế lần khớp đầu tiên, cho bạn:

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Có hai cách để giải quyết điều này. Bạn có thể chạy lệnh thay thế thêm hai lần nữa hoặc bạn có thể truyền cho nó một cờ toàn cục (`g`) để thay thế tất cả các khớp trong một dòng.

Hãy nói về cờ toàn cục. Chạy:

```shell
:s/pancake/donut/g
```

Vim thay thế tất cả các bánh pancake bằng bánh donut trong một lệnh nhanh chóng. Lệnh toàn cục là một trong nhiều cờ mà lệnh thay thế chấp nhận. Bạn truyền cờ ở cuối lệnh thay thế. Dưới đây là danh sách các cờ hữu ích:

```shell
&    Tái sử dụng các cờ từ lệnh thay thế trước đó.
g    Thay thế tất cả các khớp trong dòng.
c    Yêu cầu xác nhận thay thế.
e    Ngăn thông báo lỗi hiển thị khi thay thế thất bại.
i    Thực hiện thay thế không phân biệt chữ hoa chữ thường.
I    Thực hiện thay thế phân biệt chữ hoa chữ thường.
```

Có nhiều cờ khác mà tôi không liệt kê ở trên. Để đọc về tất cả các cờ, hãy kiểm tra `:h s_flags`.

Nhân tiện, các lệnh lặp lại thay thế (`&` và `:s`) không giữ lại các cờ. Việc chạy `&` sẽ chỉ lặp lại `:s/pancake/donut/` mà không có `g`. Để nhanh chóng lặp lại lệnh thay thế cuối cùng với tất cả các cờ, hãy chạy `:&&`.

## Thay đổi Ký hiệu Phân cách

Nếu bạn cần thay thế một URL bằng một đường dẫn dài:

```shell
https://mysite.com/a/b/c/d/e
```

Để thay thế nó bằng từ "hello", hãy chạy:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

Tuy nhiên, thật khó để biết ký tự gạch chéo nào (`/`) là một phần của mẫu thay thế và ký tự nào là ký hiệu phân cách. Bạn có thể thay đổi ký hiệu phân cách bằng bất kỳ ký tự đơn byte nào (ngoại trừ chữ cái, số, hoặc `"`, `|`, và `\`). Hãy thay thế chúng bằng `+`. Lệnh thay thế ở trên có thể được viết lại như sau:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Bây giờ dễ dàng hơn để thấy nơi các ký hiệu phân cách nằm.

## Thay thế Đặc biệt

Bạn cũng có thể thay đổi chữ hoa của văn bản mà bạn đang thay thế. Với các biểu thức sau và nhiệm vụ của bạn là viết hoa các biến "one", "two", "three", v.v.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Chạy:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Bạn sẽ nhận được:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

Phân tích:
- `(\w+) (\w+)` lưu trữ hai nhóm khớp đầu tiên, chẳng hạn như "let" và "one".
- `\1` trả về giá trị của nhóm đầu tiên, "let".
- `\U\2` viết hoa (`\U`) nhóm thứ hai (`\2`).

Mẹo của lệnh này là biểu thức `\U\2`. `\U` chỉ định ký tự tiếp theo sẽ được viết hoa.

Hãy làm một ví dụ nữa. Giả sử bạn đang viết một hướng dẫn Vim và bạn cần viết hoa chữ cái đầu tiên của mỗi từ trong một dòng.

```shell
vim is the greatest text editor in the whole galaxy
```

Bạn có thể chạy:

```shell
:s/\<./\U&/g
```

Kết quả:

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Dưới đây là phân tích:
- `:s` thay thế dòng hiện tại.
- `\<.` bao gồm hai phần: `\<` để khớp với đầu dòng và `.` để khớp với bất kỳ ký tự nào. Toán tử `\<` làm cho ký tự tiếp theo trở thành ký tự đầu tiên của một từ. Vì `.` là ký tự tiếp theo, nó sẽ khớp với ký tự đầu tiên của bất kỳ từ nào.
- `\U&` viết hoa ký hiệu tiếp theo, `&`. Nhớ rằng `&` (hoặc `\0`) đại diện cho toàn bộ khớp. Nó khớp với ký tự đầu tiên của bất kỳ từ nào.
- `g` cờ toàn cục. Nếu không có nó, lệnh này chỉ thay thế lần khớp đầu tiên. Bạn cần thay thế mọi khớp trên dòng này.

Để tìm hiểu thêm về các ký hiệu thay thế đặc biệt của thay thế như `\U`, hãy kiểm tra `:h sub-replace-special`.

## Mẫu Thay thế Thay thế

Đôi khi bạn cần khớp nhiều mẫu đồng thời. Nếu bạn có các lời chào sau:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Bạn cần thay thế từ "vim" bằng "friend" nhưng chỉ trên các dòng chứa từ "hello" hoặc "hola". Nhớ từ phần trước của chương này, bạn có thể sử dụng `|` cho nhiều mẫu thay thế.

```shell
:%s/\v(hello|hola) vim/\1 friend/g
```

Kết quả:

```shell
hello friend
hola friend
salve vim
bonjour vim
```

Dưới đây là phân tích:
- `%s` chạy lệnh thay thế trên mỗi dòng trong một tệp.
- `(hello|hola)` khớp với *hoặc* "hello" hoặc "hola" và coi nó như một nhóm.
- `vim` là từ "vim" nguyên.
- `\1` là nhóm đầu tiên, có thể là văn bản "hello" hoặc "hola".
- `friend` là từ "friend" nguyên.

## Thay thế Bắt đầu và Kết thúc của một Mẫu

Nhớ rằng bạn có thể sử dụng `\zs` và `\ze` để xác định bắt đầu và kết thúc của một khớp. Kỹ thuật này cũng hoạt động trong thay thế. Nếu bạn có:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

Để thay thế "cake" trong "hotcake" bằng "dog" để có "hotdog":

```shell
:%s/hot\zscake/dog/g
```

Kết quả:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Tham Lam và Không Tham Lam

Bạn có thể thay thế lần thứ n trong một dòng bằng mẹo này:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

Để thay thế "Mississippi" thứ ba bằng "Arkansas", hãy chạy:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

Phân tích:
- `:s/` là lệnh thay thế.
- `\v` là từ khóa ma thuật để bạn không phải thoát các từ khóa đặc biệt.
- `.` khớp với bất kỳ ký tự đơn nào.
- `{-}` thực hiện khớp không tham lam của 0 hoặc nhiều nguyên tử trước đó.
- `\zsMississippi` làm cho "Mississippi" trở thành điểm bắt đầu của khớp.
- `(...){3}` tìm kiếm lần khớp thứ ba.

Bạn đã thấy cú pháp `{3}` ở phần trước trong chương này. Trong trường hợp này, `{3}` sẽ khớp chính xác lần khớp thứ ba. Mẹo mới ở đây là `{-}`. Đây là một khớp không tham lam. Nó tìm kiếm khớp ngắn nhất của mẫu đã cho. Trong trường hợp này, `(.{-}Mississippi)` khớp với số lượng "Mississippi" ít nhất được đứng trước bởi bất kỳ ký tự nào. So sánh điều này với `(.*Mississippi)` nơi nó tìm kiếm khớp dài nhất của mẫu đã cho.

Nếu bạn sử dụng `(.{-}Mississippi)`, bạn sẽ có năm khớp: "One Mississippi", "Two Mississippi", v.v. Nếu bạn sử dụng `(.*Mississippi)`, bạn sẽ có một khớp: "Mississippi" cuối cùng. `*` là một bộ khớp tham lam và `{-}` là một bộ khớp không tham lam. Để tìm hiểu thêm, hãy kiểm tra `:h /\{-` và `:h non-greedy`.

Hãy làm một ví dụ đơn giản hơn. Nếu bạn có chuỗi:

```shell
abc1de1
```

Bạn có thể khớp "abc1de1" (tham lam) với:

```shell
/a.*1
```

Bạn có thể khớp "abc1" (không tham lam) với:

```shell
/a.\{-}1
```

Vì vậy, nếu bạn cần viết hoa khớp dài nhất (tham lam), hãy chạy:

```shell
:s/a.*1/\U&/g
```

Để có:

```shell
ABC1DEFG1
```

Nếu bạn cần viết hoa khớp ngắn nhất (không tham lam), hãy chạy:

```shell
:s/a.\{-}1/\U&/g
```

Để có:

```shell
ABC1defg1
```

Nếu bạn mới làm quen với khái niệm tham lam và không tham lam, có thể sẽ khó để hiểu. Hãy thử nghiệm với các kết hợp khác nhau cho đến khi bạn hiểu.

## Thay Thế Qua Nhiều Tệp

Cuối cùng, hãy học cách thay thế các cụm từ qua nhiều tệp. Trong phần này, giả sử bạn có hai tệp: `food.txt` và `animal.txt`.

Trong `food.txt`:

```shell
corndog
hotdog
chilidog
```

Trong `animal.txt`:

```shell
large dog
medium dog
small dog
```

Giả sử cấu trúc thư mục của bạn trông như thế này:

```shell
- food.txt
- animal.txt
```

Đầu tiên, hãy lưu cả `food.txt` và `animal.txt` vào `:args`. Nhớ lại từ các chương trước rằng `:args` có thể được sử dụng để tạo danh sách tên tệp. Có nhiều cách để làm điều này từ bên trong Vim, một trong số đó là chạy lệnh này từ bên trong Vim:

```shell
:args *.txt                  lưu tất cả các tệp txt trong vị trí hiện tại
```

Để kiểm tra, khi bạn chạy `:args`, bạn sẽ thấy:

```shell
[food.txt] animal.txt
```

Bây giờ mà tất cả các tệp liên quan đã được lưu trong danh sách đối số, bạn có thể thực hiện một lệnh thay thế nhiều tệp với lệnh `:argdo`. Chạy:

```shell
:argdo %s/dog/chicken/
```

Điều này thực hiện thay thế trên tất cả các tệp trong danh sách `:args`. Cuối cùng, lưu các tệp đã thay đổi với:

```shell
:argdo update
```

`:args` và `:argdo` là các công cụ hữu ích để áp dụng các lệnh dòng lệnh qua nhiều tệp. Hãy thử với các lệnh khác!

## Thay Thế Qua Nhiều Tệp Với Macro

Ngoài ra, bạn cũng có thể chạy lệnh thay thế qua nhiều tệp bằng macro. Chạy:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

Phân tích:
- `:args *.txt` thêm tất cả các tệp văn bản vào danh sách `:args`.
- `qq` bắt đầu macro trong thanh ghi "q".
- `:%s/dog/chicken/g` thay thế "dog" bằng "chicken" trên tất cả các dòng trong tệp hiện tại.
- `:wnext` lưu tệp rồi chuyển đến tệp tiếp theo trong danh sách `args`.
- `q` dừng ghi macro.
- `99@q` thực thi macro chín mươi chín lần. Vim sẽ dừng thực thi macro sau khi gặp lỗi đầu tiên, vì vậy Vim sẽ không thực sự thực thi macro chín mươi chín lần.

## Học Tìm Kiếm và Thay Thế Một Cách Thông Minh

Khả năng tìm kiếm tốt là một kỹ năng cần thiết trong việc chỉnh sửa. Làm chủ tìm kiếm cho phép bạn tận dụng tính linh hoạt của biểu thức chính quy để tìm kiếm bất kỳ mẫu nào trong một tệp. Hãy dành thời gian để học những điều này. Để cải thiện kỹ năng biểu thức chính quy của bạn, bạn cần phải sử dụng chúng một cách chủ động. Tôi đã từng đọc một cuốn sách về biểu thức chính quy mà không thực sự làm theo và tôi đã quên hầu hết mọi thứ tôi đã đọc sau đó. Lập trình tích cực là cách tốt nhất để làm chủ bất kỳ kỹ năng nào.

Một cách tốt để cải thiện kỹ năng khớp mẫu của bạn là mỗi khi bạn cần tìm kiếm một mẫu (như "hello 123"), thay vì truy vấn cho cụm từ tìm kiếm chính xác (`/hello 123`), hãy cố gắng nghĩ ra một mẫu cho nó (một cái gì đó như `/\v(\l+) (\d+)`). Nhiều khái niệm biểu thức chính quy này cũng áp dụng trong lập trình chung, không chỉ khi sử dụng Vim.

Bây giờ bạn đã học về tìm kiếm nâng cao và thay thế trong Vim, hãy học một trong những lệnh đa năng nhất, lệnh toàn cục.