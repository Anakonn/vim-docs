---
description: Hướng dẫn sử dụng macro trong Vim để tự động hóa các tác vụ lặp lại,
  giúp chỉnh sửa tệp nhanh chóng và hiệu quả hơn.
title: Ch09. Macros
---

Khi chỉnh sửa tệp, bạn có thể thấy mình lặp lại các hành động giống nhau. Liệu có phải sẽ thật tuyệt nếu bạn có thể thực hiện những hành động đó một lần và phát lại chúng bất cứ khi nào bạn cần không? Với các macro của Vim, bạn có thể ghi lại các hành động và lưu trữ chúng trong các thanh ghi của Vim để thực hiện bất cứ khi nào bạn cần.

Trong chương này, bạn sẽ học cách sử dụng macro để tự động hóa các tác vụ nhàm chán (thêm vào đó, nó trông thật tuyệt khi xem tệp của bạn tự chỉnh sửa).

## Macro Cơ Bản

Đây là cú pháp cơ bản của một macro Vim:

```shell
qa                     Bắt đầu ghi lại một macro trong thanh ghi a
q (trong khi ghi)     Dừng ghi macro
```

Bạn có thể chọn bất kỳ chữ cái thường nào (a-z) để lưu trữ macro. Đây là cách bạn có thể thực hiện một macro:

```shell
@a    Thực hiện macro từ thanh ghi a
@@    Thực hiện macro đã thực hiện gần nhất
```

Giả sử bạn có đoạn văn bản này và bạn muốn viết hoa mọi thứ trên mỗi dòng:

```shell
hello
vim
macros
are
awesome
```

Với con trỏ của bạn ở đầu dòng "hello", chạy:

```shell
qa0gU$jq
```

Phân tích:
- `qa` bắt đầu ghi lại một macro trong thanh ghi a.
- `0` đi đến đầu dòng.
- `gU$` viết hoa văn bản từ vị trí hiện tại của bạn đến cuối dòng.
- `j` đi xuống một dòng.
- `q` dừng ghi.

Để phát lại, chạy `@a`. Giống như nhiều lệnh Vim khác, bạn có thể truyền một tham số đếm cho các macro. Ví dụ, chạy `3@a` sẽ thực hiện macro ba lần.

## Bảo Vệ An Toàn

Việc thực hiện macro sẽ tự động kết thúc khi gặp lỗi. Giả sử bạn có đoạn văn bản này:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Nếu bạn muốn viết hoa từ đầu tiên trên mỗi dòng, macro này sẽ hoạt động:

```shell
qa0W~jq
```

Dưới đây là phân tích của lệnh trên:
- `qa` bắt đầu ghi lại một macro trong thanh ghi a.
- `0` đi đến đầu dòng.
- `W` đi đến từ tiếp theo.
- `~` chuyển đổi trường hợp của ký tự dưới con trỏ.
- `j` đi xuống một dòng.
- `q` dừng ghi.

Tôi thích đếm quá số lần thực hiện macro của mình hơn là đếm thiếu, vì vậy tôi thường gọi nó chín mươi chín lần (`99@a`). Với lệnh này, Vim thực sự không chạy macro này chín mươi chín lần. Khi Vim đến dòng cuối cùng và chạy chuyển động `j`, nó không tìm thấy dòng nào để đi xuống, ném ra lỗi và dừng việc thực hiện macro.

Việc macro dừng lại khi gặp lỗi đầu tiên là một tính năng tốt, nếu không thì Vim sẽ tiếp tục thực hiện macro này chín mươi chín lần mặc dù nó đã đến cuối dòng.

## Macro Dòng Lệnh

Chạy `@a` trong chế độ bình thường không phải là cách duy nhất bạn có thể thực hiện macro trong Vim. Bạn cũng có thể chạy lệnh dòng lệnh `:normal @a`. `:normal` cho phép người dùng thực hiện bất kỳ lệnh nào trong chế độ bình thường được truyền dưới dạng tham số. Trong trường hợp trên, nó giống như chạy `@a` từ chế độ bình thường.

Lệnh `:normal` chấp nhận phạm vi dưới dạng tham số. Bạn có thể sử dụng điều này để chạy macro trong các phạm vi đã chọn. Nếu bạn muốn thực hiện macro của mình giữa các dòng 2 và 3, bạn có thể chạy `:2,3 normal @a`.

## Thực Hiện Một Macro Qua Nhiều Tệp

Giả sử bạn có nhiều tệp `.txt`, mỗi tệp chứa một số văn bản. Nhiệm vụ của bạn là viết hoa từ đầu tiên chỉ trên các dòng chứa từ "donut". Giả sử bạn có `0W~j` trong thanh ghi a (macro giống như trước). Làm thế nào bạn có thể nhanh chóng hoàn thành điều này?

Tệp đầu tiên:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

Tệp thứ hai:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

Tệp thứ ba:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

Đây là cách bạn có thể làm điều đó:
- `:args *.txt` để tìm tất cả các tệp `.txt` trong thư mục hiện tại của bạn.
- `:argdo g/donut/normal @a` thực hiện lệnh toàn cục `g/donut/normal @a` trên mỗi tệp trong `:args`.
- `:argdo update` thực hiện lệnh `update` để lưu mỗi tệp trong `:args` khi bộ đệm đã được sửa đổi.

Nếu bạn không quen với lệnh toàn cục `:g/donut/normal @a`, nó thực hiện lệnh bạn đưa ra (`normal @a`) trên các dòng khớp với mẫu (`/donut/`). Tôi sẽ nói về lệnh toàn cục trong một chương sau.

## Macro Đệ Quy

Bạn có thể thực hiện một macro một cách đệ quy bằng cách gọi lại cùng một thanh ghi macro trong khi ghi lại macro đó. Giả sử bạn có danh sách này một lần nữa và bạn cần chuyển đổi trường hợp của từ đầu tiên:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Lần này, hãy thực hiện nó một cách đệ quy. Chạy:

```shell
qaqqa0W~j@aq
```

Dưới đây là phân tích của các bước:
- `qaq` ghi lại một macro rỗng a. Cần thiết phải bắt đầu với một thanh ghi rỗng vì khi bạn gọi đệ quy macro, nó sẽ chạy bất cứ thứ gì có trong thanh ghi đó.
- `qa` bắt đầu ghi lại trên thanh ghi a.
- `0` đi đến ký tự đầu tiên trong dòng hiện tại.
- `W` đi đến từ tiếp theo.
- `~` chuyển đổi trường hợp của ký tự dưới con trỏ.
- `j` đi xuống một dòng.
- `@a` thực hiện macro a.
- `q` dừng ghi.

Bây giờ bạn chỉ cần chạy `@a` và xem Vim thực hiện macro một cách đệ quy.

Làm thế nào mà macro biết khi nào dừng lại? Khi macro ở dòng cuối cùng, nó cố gắng chạy `j`, vì không còn dòng nào để đi xuống, nó dừng việc thực hiện macro.

## Thêm Một Macro

Nếu bạn cần thêm các hành động vào một macro hiện có, thay vì tạo lại macro từ đầu, bạn có thể thêm các hành động vào một macro hiện có. Trong chương về thanh ghi, bạn đã học rằng bạn có thể thêm vào một thanh ghi có tên bằng cách sử dụng ký hiệu viết hoa của nó. Quy tắc tương tự áp dụng. Để thêm các hành động vào một macro trong thanh ghi a, hãy sử dụng thanh ghi A.

Ghi lại một macro trong thanh ghi a: `qa0W~q` (chuỗi này chuyển đổi trường hợp của từ tiếp theo trong một dòng). Nếu bạn muốn thêm một chuỗi mới để cũng thêm một dấu chấm ở cuối dòng, hãy chạy:

```shell
qAA.<Esc>q
```

Phân tích:
- `qA` bắt đầu ghi lại macro trong thanh ghi A.
- `A.<Esc>` chèn ở cuối dòng (ở đây `A` là lệnh chế độ chèn, không bị nhầm lẫn với macro A) một dấu chấm, sau đó thoát chế độ chèn.
- `q` dừng ghi macro.

Bây giờ khi bạn thực hiện `@a`, nó không chỉ chuyển đổi trường hợp của từ tiếp theo, mà còn thêm một dấu chấm ở cuối dòng.

## Sửa Đổi Một Macro

Điều gì sẽ xảy ra nếu bạn cần thêm các hành động mới vào giữa một macro?

Giả sử bạn có một macro chuyển đổi từ thực tế đầu tiên và thêm một dấu chấm ở cuối dòng, `0W~A.<Esc>` trong thanh ghi a. Giả sử rằng giữa việc viết hoa từ đầu tiên và thêm một dấu chấm ở cuối dòng, bạn cần thêm từ "deep fried" ngay trước từ "donut" *(bởi vì điều duy nhất tốt hơn những chiếc donut thông thường là những chiếc donut chiên sâu)*.

Tôi sẽ sử dụng lại văn bản từ phần trước:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

Đầu tiên, hãy gọi macro hiện có (giả sử bạn đã giữ macro từ phần trước trong thanh ghi a) với `:put a`:

```shell
0W~A.^[
```

Cái gì là `^[` này? Bạn không làm `0W~A.<Esc>` sao? `<Esc>` ở đâu? `^[` là đại diện mã nội bộ của Vim cho `<Esc>`. Với một số phím đặc biệt, Vim in ra đại diện của những phím đó dưới dạng mã nội bộ. Một số phím phổ biến có đại diện mã nội bộ là `<Esc>`, `<Backspace>`, và `<Enter>`. Còn nhiều phím đặc biệt khác, nhưng chúng không nằm trong phạm vi của chương này.

Quay lại macro, ngay sau toán tử chuyển đổi trường hợp (`~`), hãy thêm các hướng dẫn để đi đến cuối dòng (`$`), quay lại một từ (`b`), vào chế độ chèn (`i`), gõ "deep fried " (đừng quên khoảng trắng sau "fried "), và thoát chế độ chèn (`<Esc>`).

Đây là những gì bạn sẽ kết thúc với:

```shell
0W~$bideep fried <Esc>A.^[
```

Có một vấn đề nhỏ. Vim không hiểu `<Esc>`. Bạn không thể gõ trực tiếp `<Esc>`. Bạn sẽ phải viết đại diện mã nội bộ cho phím `<Esc>`. Khi ở chế độ chèn, bạn nhấn `Ctrl-V` theo sau là `<Esc>`. Vim sẽ in ra `^[`. `Ctrl-V` là một toán tử chế độ chèn để chèn ký tự không phải số tiếp theo *một cách chính xác*. Mã macro của bạn bây giờ nên trông như thế này:

```shell
0W~$bideep fried ^[A.^[
```

Để thêm hướng dẫn đã sửa đổi vào thanh ghi a, bạn có thể làm theo cách giống như thêm một mục mới vào một thanh ghi có tên. Ở đầu dòng, chạy `"ay$` để lưu trữ văn bản đã sao chép vào thanh ghi a.

Bây giờ khi bạn thực hiện `@a`, macro của bạn sẽ chuyển đổi trường hợp của từ đầu tiên, thêm "deep fried " trước "donut", và thêm một "." ở cuối dòng. Ngon quá!

Một cách thay thế để sửa đổi một macro là sử dụng một biểu thức dòng lệnh. Thực hiện `:let @a="`, sau đó thực hiện `Ctrl-R a`, điều này sẽ dán nội dung của thanh ghi a. Cuối cùng, đừng quên đóng dấu ngoặc kép (`"`). Bạn có thể có điều gì đó như `:let @a="0W~$bideep fried ^[A.^["`.

## Tính Đỏ Đệ Nhất Của Macro

Bạn có thể dễ dàng sao chép các macro từ một thanh ghi này sang thanh ghi khác. Ví dụ, để sao chép một macro trong thanh ghi a sang thanh ghi z, bạn có thể làm `:let @z = @a`. `@a` đại diện cho nội dung của thanh ghi a. Bây giờ nếu bạn chạy `@z`, nó thực hiện chính xác các hành động giống như `@a`.

Tôi thấy việc tạo ra sự dư thừa hữu ích cho các macro mà tôi sử dụng thường xuyên nhất. Trong quy trình làm việc của tôi, tôi thường ghi lại các macro trong bảy chữ cái đầu tiên (a-g) và tôi thường thay thế chúng mà không suy nghĩ nhiều. Nếu tôi di chuyển các macro hữu ích về phía cuối bảng chữ cái, tôi có thể bảo tồn chúng mà không lo lắng rằng tôi có thể vô tình thay thế chúng.

## Macro Dòng Chạy Liên Tiếp So Với Song Song

Vim có thể thực hiện các macro theo chuỗi và song song. Giả sử bạn có đoạn văn bản này:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Nếu bạn muốn ghi lại một macro để viết thường tất cả các "FUNC" đã viết hoa, macro này sẽ hoạt động:

```shell
qa0f{gui{jq
```

Phân tích:
- `qa` bắt đầu ghi lại trong thanh ghi a.
- `0` đi đến dòng đầu tiên.
- `f{` tìm kiếm trường hợp đầu tiên của "{".
- `gui{` viết thường (`gu`) văn bản bên trong đối tượng văn bản dấu ngoặc (`i{`).
- `j` đi xuống một dòng.
- `q` dừng ghi macro.

Bây giờ bạn có thể chạy `99@a` để thực hiện nó trên các dòng còn lại. Tuy nhiên, điều gì sẽ xảy ra nếu bạn có biểu thức nhập này trong tệp của mình?

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

Chạy `99@a`, chỉ thực hiện macro ba lần. Nó không thực hiện macro trên hai dòng cuối cùng vì việc thực hiện không thể chạy `f{` trên dòng "foo". Điều này là điều bình thường khi chạy macro theo chuỗi. Bạn luôn có thể đến dòng tiếp theo nơi có "FUNC4" và phát lại macro đó một lần nữa. Nhưng nếu bạn muốn hoàn thành mọi thứ trong một lần?

Chạy macro theo cách song song.

Nhớ lại từ phần trước rằng các macro có thể được thực hiện bằng cách sử dụng lệnh dòng lệnh `:normal` (ví dụ: `:3,5 normal @a` thực hiện macro a trên các dòng 3-5). Nếu bạn chạy `:1,$ normal @a`, bạn sẽ thấy rằng macro đang được thực hiện trên tất cả các dòng ngoại trừ dòng "foo". Nó hoạt động!

Mặc dù bên trong Vim không thực sự chạy các macro theo cách song song, nhưng bên ngoài, nó hoạt động như vậy. Vim thực hiện `@a` *độc lập* trên mỗi dòng từ dòng đầu tiên đến dòng cuối cùng (`1,$`). Vì Vim thực hiện các macro này một cách độc lập, mỗi dòng không biết rằng một trong các lần thực hiện macro đã thất bại trên dòng "foo".
## Học Macro một cách Thông Minh

Nhiều việc bạn làm trong việc chỉnh sửa là lặp đi lặp lại. Để cải thiện kỹ năng chỉnh sửa, hãy hình thành thói quen phát hiện các hành động lặp lại. Sử dụng macro (hoặc lệnh chấm) để bạn không phải thực hiện cùng một hành động hai lần. Hầu như mọi thứ bạn có thể làm trong Vim đều có thể được tái tạo bằng macro.

Ban đầu, tôi thấy rất khó khăn để viết macro, nhưng đừng từ bỏ. Với đủ thực hành, bạn sẽ hình thành thói quen tự động hóa mọi thứ.

Bạn có thể thấy hữu ích khi sử dụng các ký ức để giúp nhớ các macro của bạn. Nếu bạn có một macro tạo ra một hàm, hãy sử dụng "f register (`qf`). Nếu bạn có một macro cho các phép toán số, "n register sẽ hoạt động (`qn`). Đặt tên cho nó bằng *register được đặt tên đầu tiên* mà xuất hiện trong đầu bạn khi bạn nghĩ về hành động đó. Tôi cũng thấy rằng "q register là một register macro mặc định tốt vì `qq` yêu cầu ít sức lực trí óc hơn để nghĩ ra. Cuối cùng, tôi cũng thích tăng dần các macro của mình theo thứ tự chữ cái, như `qa`, sau đó là `qb`, rồi `qc`, và cứ thế tiếp tục.

Tìm một phương pháp phù hợp nhất với bạn.