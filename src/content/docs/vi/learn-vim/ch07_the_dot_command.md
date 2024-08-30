---
description: Hướng dẫn sử dụng lệnh chấm (dot command) trong Vim để lặp lại thay đổi
  trước đó một cách dễ dàng và hiệu quả.
title: Ch07. the Dot Command
---

Nói chung, bạn nên cố gắng tránh làm lại những gì bạn vừa làm bất cứ khi nào có thể. Trong chương này, bạn sẽ học cách sử dụng lệnh chấm để dễ dàng làm lại thay đổi trước đó. Đây là một lệnh đa năng để giảm thiểu sự lặp lại đơn giản.

## Cách sử dụng

Giống như tên gọi của nó, bạn có thể sử dụng lệnh chấm bằng cách nhấn phím chấm (`.`).

Ví dụ, nếu bạn muốn thay thế tất cả "let" bằng "const" trong các biểu thức sau:

```shell
let one = "1";
let two = "2";
let three = "3";
```

- Tìm kiếm với `/let` để đến vị trí khớp.
- Thay đổi với `cwconst<Esc>` để thay thế "let" bằng "const".
- Điều hướng với `n` để tìm vị trí khớp tiếp theo bằng cách sử dụng tìm kiếm trước đó.
- Lặp lại những gì bạn vừa làm với lệnh chấm (`.`).
- Tiếp tục nhấn `n . n .` cho đến khi bạn thay thế mọi từ.

Ở đây, lệnh chấm đã lặp lại chuỗi `cwconst<Esc>`. Nó đã giúp bạn tiết kiệm được tám lần gõ phím chỉ với một lần.

## Thay đổi là gì?

Nếu bạn nhìn vào định nghĩa của lệnh chấm (`:h .`), nó nói rằng lệnh chấm lặp lại thay đổi cuối cùng. Thay đổi là gì?

Bất cứ khi nào bạn cập nhật (thêm, sửa đổi hoặc xóa) nội dung của bộ đệm hiện tại, bạn đang thực hiện một thay đổi. Các ngoại lệ là các cập nhật được thực hiện bởi các lệnh dòng lệnh (các lệnh bắt đầu bằng `:`) không được tính là một thay đổi.

Trong ví dụ đầu tiên, `cwconst<Esc>` là thay đổi. Bây giờ giả sử bạn có văn bản này:

```shell
pancake, potatoes, fruit-juice,
```

Để xóa văn bản từ đầu dòng đến lần xuất hiện tiếp theo của dấu phẩy, trước tiên hãy xóa đến dấu phẩy, sau đó lặp lại hai lần với `df,..`. 

Hãy thử một ví dụ khác:

```shell
pancake, potatoes, fruit-juice,
```

Lần này, nhiệm vụ của bạn là xóa dấu phẩy, không phải các món ăn sáng. Với con trỏ ở đầu dòng, đi đến dấu phẩy đầu tiên, xóa nó, sau đó lặp lại thêm hai lần với `f,x..` Dễ dàng, đúng không? Chờ một chút, nó không hoạt động! Tại sao?

Một thay đổi không bao gồm các động tác vì nó không cập nhật nội dung bộ đệm. Lệnh `f,x` bao gồm hai hành động: lệnh `f,` để di chuyển con trỏ đến "," và `x` để xóa một ký tự. Chỉ có cái sau, `x`, gây ra một thay đổi. Đối chiếu điều đó với `df,` từ ví dụ trước. Trong đó, `f,` là một chỉ thị cho toán tử xóa `d`, không phải là một động tác để di chuyển con trỏ. `f,` trong `df,` và `f,x` có hai vai trò rất khác nhau.

Hãy hoàn thành nhiệm vụ cuối cùng. Sau khi bạn chạy `f,` rồi `x`, đi đến dấu phẩy tiếp theo với `;` để lặp lại lệnh `f` cuối cùng. Cuối cùng, sử dụng `.` để xóa ký tự dưới con trỏ. Lặp lại `; . ; .` cho đến khi mọi thứ bị xóa. Lệnh đầy đủ là `f,x;.;.`.

Hãy thử một cái khác:

```shell
pancake
potatoes
fruit-juice
```

Hãy thêm một dấu phẩy ở cuối mỗi dòng. Bắt đầu từ dòng đầu tiên, thực hiện `A,<Esc>j`. Đến lúc này, bạn nhận ra rằng `j` không gây ra một thay đổi. Thay đổi ở đây chỉ là `A,`. Bạn có thể di chuyển và lặp lại thay đổi với `j . j .`. Lệnh đầy đủ là `A,<Esc>j.j.`.

Mọi hành động từ thời điểm bạn nhấn toán tử lệnh chèn (`A`) cho đến khi bạn thoát khỏi lệnh chèn (`<Esc>`) được coi là một thay đổi.

## Lặp nhiều dòng

Giả sử bạn có văn bản này:

```shell
let one = "1";
let two = "2";
let three = "3";
const foo = "bar';
let four = "4";
let five = "5";
let six = "6";
let seven = "7";
let eight = "8";
let nine = "9";
```

Mục tiêu của bạn là xóa tất cả các dòng ngoại trừ dòng "foo". Đầu tiên, xóa ba dòng đầu tiên với `d2j`, sau đó đến dòng bên dưới dòng "foo". Ở dòng tiếp theo, sử dụng lệnh chấm hai lần. Lệnh đầy đủ là `d2jj..`.

Ở đây, thay đổi là `d2j`. Trong ngữ cảnh này, `2j` không phải là một động tác, mà là một phần của toán tử xóa.

Hãy xem một ví dụ khác:

```shell
zlet zzone = "1";
zlet zztwo = "2";
zlet zzthree = "3";
let four = "4";
```

Hãy xóa tất cả các chữ z. Bắt đầu từ ký tự đầu tiên trên dòng đầu tiên, chọn trực quan chỉ chữ z đầu tiên từ ba dòng đầu tiên bằng chế độ chọn trực quan theo khối (`Ctrl-Vjj`). Nếu bạn không quen với chế độ chọn trực quan theo khối, tôi sẽ đề cập đến chúng trong một chương sau. Khi bạn đã chọn trực quan ba chữ z, hãy xóa chúng bằng toán tử xóa (`d`). Sau đó di chuyển đến từ tiếp theo (`w`) đến chữ z tiếp theo. Lặp lại thay đổi thêm hai lần (`..`). Lệnh đầy đủ là `Ctrl-vjjdw..`.

Khi bạn xóa một cột ba chữ z (`Ctrl-vjjd`), nó được tính là một thay đổi. Hoạt động chế độ trực quan có thể được sử dụng để nhắm mục tiêu nhiều dòng như một phần của một thay đổi.

## Bao gồm một động tác trong một thay đổi

Hãy quay lại ví dụ đầu tiên trong chương này. Nhớ rằng lệnh `/letcwconst<Esc>` theo sau bởi `n . n .` đã thay thế tất cả "let" bằng "const" trong các biểu thức sau:

```shell
let one = "1";
let two = "2";
let three = "3";
```

Có một cách nhanh hơn để thực hiện điều này. Sau khi bạn tìm kiếm `/let`, hãy chạy `cgnconst<Esc>` rồi `..`.

`gn` là một động tác tìm kiếm tiến về phía trước cho mẫu tìm kiếm cuối cùng (trong trường hợp này, `/let`) và tự động làm nổi bật trực quan. Để thay thế lần xuất hiện tiếp theo, bạn không còn phải di chuyển và lặp lại thay đổi (`n . n .`), mà chỉ cần lặp lại (`. .`). Bạn không cần phải sử dụng các động tác tìm kiếm nữa vì việc tìm kiếm lần khớp tiếp theo giờ đã là một phần của thay đổi!

Khi bạn đang chỉnh sửa, hãy luôn để ý đến các động tác có thể thực hiện nhiều việc cùng một lúc như `gn` bất cứ khi nào có thể.

## Học lệnh chấm theo cách thông minh

Sức mạnh của lệnh chấm đến từ việc trao đổi nhiều lần gõ phím cho một lần. Có lẽ không phải là một sự trao đổi có lợi khi sử dụng lệnh chấm cho các thao tác đơn giản như `x`. Nếu thay đổi cuối cùng của bạn yêu cầu một thao tác phức tạp như `cgnconst<Esc>`, lệnh chấm giảm chín lần gõ phím thành một, một sự trao đổi rất có lợi.

Khi chỉnh sửa, hãy nghĩ về khả năng lặp lại. Ví dụ, nếu tôi cần xóa ba từ tiếp theo, có phải sử dụng `d3w` hay thực hiện `dw` rồi `.` hai lần sẽ tiết kiệm hơn? Bạn có xóa một từ nữa không? Nếu có, thì việc sử dụng `dw` và lặp lại nhiều lần thay vì `d3w` là hợp lý hơn vì `dw` có thể tái sử dụng nhiều hơn `d3w`. 

Lệnh chấm là một lệnh đa năng để tự động hóa các thay đổi đơn lẻ. Trong một chương sau, bạn sẽ học cách tự động hóa các hành động phức tạp hơn với các macro Vim. Nhưng trước tiên, hãy học về các thanh ghi để lưu trữ và truy xuất văn bản.