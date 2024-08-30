---
description: Tài liệu này giới thiệu về Vimscript, ngôn ngữ lập trình tích hợp của
  Vim, bao gồm các kiểu dữ liệu cơ bản và cách sử dụng chế độ Ex để thực hành.
title: Ch25. Vimscript Basic Data Types
---

Trong vài chương tiếp theo, bạn sẽ tìm hiểu về Vimscript, ngôn ngữ lập trình tích hợp sẵn của Vim.

Khi học một ngôn ngữ mới, có ba yếu tố cơ bản cần tìm:
- Nguyên thủy
- Phương tiện kết hợp
- Phương tiện trừu tượng

Trong chương này, bạn sẽ tìm hiểu về các kiểu dữ liệu nguyên thủy của Vim.

## Các Kiểu Dữ Liệu

Vim có 10 kiểu dữ liệu khác nhau:
- Số
- Số thực
- Chuỗi
- Danh sách
- Từ điển
- Đặc biệt
- Funcref
- Công việc
- Kênh
- Blob

Tôi sẽ đề cập đến sáu kiểu dữ liệu đầu tiên ở đây. Trong Ch. 27, bạn sẽ tìm hiểu về Funcref. Để biết thêm về các kiểu dữ liệu của Vim, hãy kiểm tra `:h variables`.

## Theo Dõi Với Chế Độ Ex

Vim về mặt kỹ thuật không có REPL tích hợp sẵn, nhưng nó có một chế độ, chế độ Ex, có thể được sử dụng như một cái. Bạn có thể vào chế độ Ex với `Q` hoặc `gQ`. Chế độ Ex giống như một chế độ dòng lệnh mở rộng (giống như gõ lệnh dòng lệnh không ngừng). Để thoát khỏi chế độ Ex, gõ `:visual`.

Bạn có thể sử dụng `:echo` hoặc `:echom` trong chương này và các chương Vimscript tiếp theo để lập trình cùng nhau. Chúng giống như `console.log` trong JS hoặc `print` trong Python. Lệnh `:echo` in ra biểu thức đã được đánh giá mà bạn cung cấp. Lệnh `:echom` làm điều tương tự, nhưng ngoài ra, nó lưu kết quả vào lịch sử thông điệp.

```viml
:echom "hello echo message"
```

Bạn có thể xem lịch sử thông điệp với:

```shell
:messages
```

Để xóa lịch sử thông điệp của bạn, hãy chạy:

```shell
:messages clear
```

## Số

Vim có 4 loại số khác nhau: thập phân, thập lục phân, nhị phân và bát phân. Nhân tiện, khi tôi nói kiểu dữ liệu số, thường điều này có nghĩa là kiểu dữ liệu nguyên. Trong hướng dẫn này, tôi sẽ sử dụng các thuật ngữ số và nguyên thay thế cho nhau.

### Thập Phân

Bạn nên quen thuộc với hệ thống thập phân. Vim chấp nhận các số thập phân dương và âm. 1, -1, 10, v.v. Trong lập trình Vimscript, bạn sẽ có thể sử dụng kiểu thập phân hầu hết thời gian.

### Thập Lục Phân

Các số thập lục phân bắt đầu bằng `0x` hoặc `0X`. Ghi nhớ: He**x**adecimal.

### Nhị Phân

Các số nhị phân bắt đầu bằng `0b` hoặc `0B`. Ghi nhớ: **B**inary.

### Bát Phân

Các số bát phân bắt đầu bằng `0`, `0o`, và `0O`. Ghi nhớ: **O**ctal.

### In Số

Nếu bạn `echo` một số thập lục phân, nhị phân, hoặc bát phân, Vim sẽ tự động chuyển đổi chúng thành thập phân.

```viml
:echo 42
" trả về 42

:echo 052
" trả về 42

:echo 0b101010
" trả về 42

:echo 0x2A
" trả về 42
```

### Giá Trị Đúng và Sai

Trong Vim, giá trị 0 là sai và tất cả các giá trị không phải 0 là đúng.

Điều sau sẽ không in ra bất cứ điều gì.

```viml
:if 0
:  echo "Nope"
:endif
```

Tuy nhiên, điều này sẽ:

```viml
:if 1
:  echo "Yes"
:endif
```

Bất kỳ giá trị nào khác ngoài 0 đều là đúng, bao gồm cả số âm. 100 là đúng. -1 là đúng.

### Số Học

Các số có thể được sử dụng để thực hiện các biểu thức toán học:

```viml
:echo 3 + 1
" trả về 4

: echo 5 - 3
" trả về 2

:echo 2 * 2
" trả về 4

:echo 4 / 2
" trả về 2
```

Khi chia một số với số dư, Vim sẽ bỏ qua số dư.

```viml
:echo 5 / 2
" trả về 2 thay vì 2.5
```

Để có kết quả chính xác hơn, bạn cần sử dụng một số thực.

## Số Thực

Số thực là các số có phần thập phân theo sau. Có hai cách để biểu diễn số thực: ký hiệu dấu chấm (như 31.4) và số mũ (3.14e01). Tương tự như các số, bạn có thể sử dụng dấu dương và âm:

```viml
:echo +123.4
" trả về 123.4

:echo -1.234e2
" trả về -123.4

:echo 0.25
" trả về 0.25

:echo 2.5e-1
" trả về 0.25
```

Bạn cần cung cấp cho một số thực một dấu chấm và các chữ số theo sau. `25e-2` (không có dấu chấm) và `1234.` (có dấu chấm nhưng không có chữ số theo sau) đều là các số thực không hợp lệ.

### Số Học Với Số Thực

Khi thực hiện một biểu thức toán học giữa một số và một số thực, Vim sẽ ép kiểu kết quả thành số thực.

```viml
:echo 5 / 2.0
" trả về 2.5
```

Số thực và số thực trong phép toán sẽ cho bạn một số thực khác.

```shell
:echo 1.0 + 1.0
" trả về 2.0
```

## Chuỗi

Chuỗi là các ký tự được bao quanh bởi dấu nháy đôi (`""`) hoặc dấu nháy đơn (`''`). "Hello", "123", và '123.4' là ví dụ về chuỗi.

### Nối Chuỗi

Để nối một chuỗi trong Vim, sử dụng toán tử `.`.

```viml
:echo "Hello" . " world"
" trả về "Hello world"
```

### Số Học Với Chuỗi

Khi bạn chạy các toán tử toán học (`+ - * /`) với một số và một chuỗi, Vim sẽ ép kiểu chuỗi thành một số.

```viml
:echo "12 donuts" + 3
" trả về 15
```

Khi Vim thấy "12 donuts", nó sẽ trích xuất 12 từ chuỗi và chuyển đổi nó thành số 12. Sau đó, nó thực hiện phép cộng, trả về 15. Để việc ép kiểu từ chuỗi sang số hoạt động, ký tự số cần phải là *ký tự đầu tiên* trong chuỗi.

Điều sau sẽ không hoạt động vì 12 không phải là ký tự đầu tiên trong chuỗi:

```viml
:echo "donuts 12" + 3
" trả về 3
```

Điều này cũng sẽ không hoạt động vì một khoảng trắng là ký tự đầu tiên của chuỗi:

```viml
:echo " 12 donuts" + 3
" trả về 3
```

Việc ép kiểu này hoạt động ngay cả với hai chuỗi:

```shell
:echo "12 donuts" + "6 pastries"
" trả về 18
```

Điều này hoạt động với bất kỳ toán tử toán học nào, không chỉ `+`:

```viml
:echo "12 donuts" * "5 boxes"
" trả về 60

:echo "12 donuts" - 5
" trả về 7

:echo "12 donuts" / "3 people"
" trả về 4
```

Một mẹo hay để ép kiểu chuyển đổi từ chuỗi sang số là chỉ cần cộng 0 hoặc nhân với 1:

```viml
:echo "12" + 0
" trả về 12

:echo "12" * 1
" trả về 12
```

Khi thực hiện phép toán với một số thực trong chuỗi, Vim sẽ xử lý nó như một số nguyên, không phải số thực:

```shell
:echo "12.0 donuts" + 12
" trả về 24, không phải 24.0
```

### Nối Số và Chuỗi

Bạn có thể ép kiểu một số thành chuỗi với toán tử dấu chấm (`.`):

```viml
:echo 12 . "donuts"
" trả về "12donuts"
```

Việc ép kiểu chỉ hoạt động với kiểu dữ liệu số, không phải số thực. Điều này sẽ không hoạt động:

```shell
:echo 12.0 . "donuts"
" không trả về "12.0donuts" mà ném ra lỗi
```

### Điều Kiện Với Chuỗi

Nhớ rằng 0 là sai và tất cả các số không phải 0 là đúng. Điều này cũng đúng khi sử dụng chuỗi làm điều kiện.

Trong câu lệnh if sau, Vim sẽ ép "12donuts" thành 12, điều này là đúng:

```viml
:if "12donuts"
:  echo "Yum"
:endif
" trả về "Yum"
```

Mặt khác, điều này là sai:

```viml
:if "donuts12"
:  echo "Nope"
:endif
" không trả về gì cả
```

Vim ép "donuts12" thành 0, vì ký tự đầu tiên không phải là số.

### Dấu Nháy Đôi So Với Dấu Nháy Đơn

Dấu nháy đôi hoạt động khác với dấu nháy đơn. Dấu nháy đơn hiển thị các ký tự một cách nguyên vẹn trong khi dấu nháy đôi chấp nhận các ký tự đặc biệt.

Các ký tự đặc biệt là gì? Kiểm tra hiển thị dòng mới và dấu nháy đôi:

```viml
:echo "hello\nworld"
" trả về
" hello
" world

:echo "hello \"world\""
" trả về "hello "world""
```

So sánh với dấu nháy đơn:

```shell
:echo 'hello\nworld'
" trả về 'hello\nworld'

:echo 'hello \"world\"'
" trả về 'hello \"world\"'
```

Các ký tự đặc biệt là các ký tự chuỗi đặc biệt mà khi được thoát, sẽ hoạt động khác. `\n` hoạt động như một dòng mới. `\"` hoạt động như một ký tự `"`. Để biết danh sách các ký tự đặc biệt khác, hãy kiểm tra `:h expr-quote`.

### Các Thủ Tục Chuỗi

Hãy xem một số thủ tục chuỗi tích hợp sẵn.

Bạn có thể lấy độ dài của một chuỗi với `strlen()`.

```shell
:echo strlen("choco")
" trả về 5
```

Bạn có thể chuyển đổi chuỗi thành số với `str2nr()`:

```shell
:echo str2nr("12donuts")
" trả về 12

:echo str2nr("donuts12")
" trả về 0
```

Tương tự như việc ép kiểu từ chuỗi sang số trước đó, nếu số không phải là ký tự đầu tiên, Vim sẽ không nhận ra nó.

Tin tốt là Vim có một phương thức biến đổi một chuỗi thành số thực, `str2float()`:

```shell
:echo str2float("12.5donuts")
" trả về 12.5
```

Bạn có thể thay thế một mẫu trong một chuỗi với phương thức `substitute()`:

```shell
:echo substitute("sweet", "e", "o", "g")
" trả về "swoot"
```

Tham số cuối cùng, "g", là cờ toàn cục. Với nó, Vim sẽ thay thế tất cả các trường hợp phù hợp. Nếu không có nó, Vim chỉ thay thế lần đầu tiên.

```shell
:echo substitute("sweet", "e", "o", "")
" trả về "swoet"
```

Lệnh thay thế có thể được kết hợp với `getline()`. Nhớ rằng hàm `getline()` lấy văn bản trên số dòng đã cho. Giả sử bạn có văn bản "chocolate donut" trên dòng 5. Bạn có thể sử dụng thủ tục:

```shell
:echo substitute(getline(5), "chocolate", "glazed", "g")
" trả về glazed donut
```

Có nhiều thủ tục chuỗi khác. Kiểm tra `:h string-functions`.

## Danh Sách

Một danh sách Vimscript giống như một Mảng trong Javascript hoặc Danh sách trong Python. Nó là một chuỗi các mục *có thứ tự*. Bạn có thể kết hợp nội dung với các kiểu dữ liệu khác nhau:

```shell
[1,2,3]
['a', 'b', 'c']
[1,'a', 3.14]
[1,2,[3,4]]
```

### Danh Sách Con

Danh sách Vim được đánh chỉ số từ 0. Bạn có thể truy cập một mục cụ thể trong danh sách với `[n]`, trong đó n là chỉ số.

```shell
:echo ["a", "sweet", "dessert"][0]
" trả về "a"

:echo ["a", "sweet", "dessert"][2]
" trả về "dessert"
```

Nếu bạn vượt quá số chỉ số tối đa, Vim sẽ ném ra lỗi nói rằng chỉ số nằm ngoài phạm vi:

```shell
:echo ["a", "sweet", "dessert"][999]
" trả về một lỗi
```

Khi bạn đi dưới 0, Vim sẽ bắt đầu chỉ số từ phần tử cuối cùng. Đi quá chỉ số tối thiểu cũng sẽ ném ra lỗi:

```shell
:echo ["a", "sweet", "dessert"][-1]
" trả về "dessert"

:echo ["a", "sweet", "dessert"][-3]
" trả về "a"

:echo ["a", "sweet", "dessert"][-999]
" trả về một lỗi
```

Bạn có thể "cắt" nhiều phần tử từ một danh sách với `[n:m]`, trong đó `n` là chỉ số bắt đầu và `m` là chỉ số kết thúc.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:4]
" trả về ["plain", "strawberry", "lemon"]
```

Nếu bạn không truyền `m` (`[n:]`), Vim sẽ trả về phần còn lại của các phần tử bắt đầu từ phần tử thứ n. Nếu bạn không truyền `n` (`[:m]`), Vim sẽ trả về phần tử đầu tiên cho đến phần tử thứ m.

```shell
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:]
" trả về ['plain', 'strawberry', 'lemon', 'sugar', 'cream']

:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][:4]
" trả về ['chocolate', 'glazed', 'plain', 'strawberry', 'lemon']
```

Bạn có thể truyền một chỉ số vượt quá số mục tối đa khi cắt một mảng.

```viml
:echo ["chocolate", "glazed", "plain", "strawberry", "lemon", "sugar", "cream"][2:999]
" trả về ['plain', 'strawberry', 'lemon', 'sugar', 'cream']
```
### Cắt Chuỗi

Bạn có thể cắt và nhắm mục tiêu chuỗi giống như danh sách:

```viml
:echo "choco"[0]
" trả về "c"

:echo "choco"[1:3]
" trả về "hoc"

:echo "choco"[:3]
" trả về choc

:echo "choco"[1:]
" trả về hoco
```

### Số Học Danh Sách

Bạn có thể sử dụng `+` để nối và biến đổi một danh sách:

```viml
:let sweetList = ["chocolate", "strawberry"]
:let sweetList += ["sugar"]
:echo sweetList
" trả về ["chocolate", "strawberry", "sugar"]
```

### Hàm Danh Sách

Hãy khám phá các hàm danh sách tích hợp sẵn của Vim.

Để lấy độ dài của một danh sách, sử dụng `len()`:

```shell
:echo len(["chocolate", "strawberry"])
" trả về 2
```

Để thêm một phần tử vào đầu danh sách, bạn có thể sử dụng `insert()`:

```shell
:let sweetList = ["chocolate", "strawberry"]
:call insert(sweetList, "glazed")

:echo sweetList
" trả về ["glazed", "chocolate", "strawberry"]
```

Bạn cũng có thể truyền cho `insert()` chỉ số mà bạn muốn thêm phần tử vào. Nếu bạn muốn thêm một mục trước phần tử thứ hai (chỉ số 1):

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call insert(sweeterList, "cream", 1)

:echo sweeterList
" trả về ['glazed', 'cream', 'chocolate', 'strawberry']
```

Để xóa một mục trong danh sách, sử dụng `remove()`. Nó chấp nhận một danh sách và chỉ số phần tử bạn muốn xóa.

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call remove(sweeterList, 1)

:echo sweeterList
" trả về ['glazed', 'strawberry']
```

Bạn có thể sử dụng `map()` và `filter()` trên một danh sách. Để lọc ra phần tử chứa cụm từ "choco":

```shell
:let sweeterList = ["glazed", "chocolate", "strawberry"]
:call filter(sweeterList, 'v:val !~ "choco"')
:echo sweeterList
" trả về ["glazed", "strawberry"]

:let sweetestList = ["chocolate", "glazed", "sugar"]
:call map(sweetestList, 'v:val . " donut"')
:echo sweetestList
" trả về ['chocolate donut', 'glazed donut', 'sugar donut']
```

Biến `v:val` là một biến đặc biệt của Vim. Nó có sẵn khi lặp qua một danh sách hoặc một từ điển bằng cách sử dụng `map()` hoặc `filter()`. Nó đại diện cho từng mục được lặp qua.

Để biết thêm, hãy kiểm tra `:h list-functions`.

### Giải Nén Danh Sách

Bạn có thể giải nén một danh sách và gán các biến cho các mục trong danh sách:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let [flavor1, flavor2, flavor3] = favoriteFlavor

:echo flavor1
" trả về "chocolate"

:echo flavor2
" trả về "glazed"
```

Để gán các mục còn lại trong danh sách, bạn có thể sử dụng `;` theo sau là tên biến:

```shell
:let favoriteFruits = ["apple", "banana", "lemon", "blueberry", "raspberry"]
:let [fruit1, fruit2; restFruits] = favoriteFruits

:echo fruit1
" trả về "apple"

:echo restFruits
" trả về ['lemon', 'blueberry', 'raspberry']
```

### Sửa Đổi Danh Sách

Bạn có thể sửa đổi một mục trong danh sách trực tiếp:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[0] = "sugar"
:echo favoriteFlavor
" trả về ['sugar', 'glazed', 'plain']
```

Bạn có thể biến đổi nhiều mục trong danh sách trực tiếp:

```shell
:let favoriteFlavor = ["chocolate", "glazed", "plain"]
:let favoriteFlavor[2:] = ["strawberry", "chocolate"]
:echo favoriteFlavor
" trả về ['chocolate', 'glazed', 'strawberry', 'chocolate']
```

## Từ Điển

Một từ điển Vimscript là một danh sách liên kết, không có thứ tự. Một từ điển không rỗng bao gồm ít nhất một cặp khóa-giá trị.

```shell
{"breakfast": "waffles", "lunch": "pancakes"}
{"meal": ["breakfast", "second breakfast", "third breakfast"]}
{"dinner": 1, "dessert": 2}
```

Một đối tượng dữ liệu từ điển Vim sử dụng chuỗi cho khóa. Nếu bạn cố gắng sử dụng một số, Vim sẽ chuyển đổi nó thành một chuỗi.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}

:echo breakfastNo
" trả về {'1': '7am', '2': '9am', '11ses': '11am'}
```

Nếu bạn quá lười để đặt dấu ngoặc kép quanh mỗi khóa, bạn có thể sử dụng cú pháp `#{}`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo mealPlans
" trả về {'lunch': 'pancakes', 'breakfast': 'waffles', 'dinner': 'donuts'}
```

Yêu cầu duy nhất để sử dụng cú pháp `#{}` là mỗi khóa phải là:

- Ký tự ASCII.
- Số.
- Một dấu gạch dưới (`_`).
- Một dấu gạch ngang (`-`).

Giống như danh sách, bạn có thể sử dụng bất kỳ kiểu dữ liệu nào làm giá trị.

```shell
:let mealPlan = {"breakfast": ["pancake", "waffle", "hash brown"], "lunch": WhatsForLunch(), "dinner": {"appetizer": "gruel", "entree": "more gruel"}}
```

### Truy Cập Từ Điển

Để truy cập một giá trị từ một từ điển, bạn có thể gọi khóa bằng cách sử dụng dấu ngoặc vuông (`['key']`) hoặc cú pháp dấu chấm (`.key`).

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches", "dinner": "more gruel"}

:let breakfast = meal['breakfast']
:let lunch = meal.lunch

:echo breakfast
" trả về "gruel omelettes"

:echo lunch
" trả về "gruel sandwiches"
```

### Sửa Đổi Từ Điển

Bạn có thể sửa đổi hoặc thậm chí thêm nội dung vào từ điển:

```shell
:let meal = {"breakfast": "gruel omelettes", "lunch": "gruel sandwiches"}

:let meal.breakfast = "breakfast tacos"
:let meal["lunch"] = "tacos al pastor"
:let meal["dinner"] = "quesadillas"

:echo meal
" trả về {'lunch': 'tacos al pastor', 'breakfast': 'breakfast tacos', 'dinner': 'quesadillas'}
```

### Hàm Từ Điển

Hãy khám phá một số hàm tích hợp sẵn của Vim để xử lý từ điển.

Để kiểm tra độ dài của một từ điển, sử dụng `len()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo len(mealPlans)
" trả về 3
```

Để xem một từ điển có chứa một khóa cụ thể hay không, sử dụng `has_key()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo has_key(mealPlans, "breakfast")
" trả về 1

:echo has_key(mealPlans, "dessert")
" trả về 0
```

Để xem một từ điển có bất kỳ mục nào hay không, sử dụng `empty()`. Thủ tục `empty()` hoạt động với tất cả các kiểu dữ liệu: danh sách, từ điển, chuỗi, số, số thực, v.v.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:let noMealPlan = {}

:echo empty(noMealPlan)
" trả về 1

:echo empty(mealPlans)
" trả về 0
```

Để xóa một mục khỏi một từ điển, sử dụng `remove()`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo "xóa bữa sáng: " . remove(mealPlans, "breakfast")
" trả về "xóa bữa sáng: 'waffles'""

:echo mealPlans
" trả về {'lunch': 'pancakes', 'dinner': 'donuts'}
```

Để chuyển đổi một từ điển thành danh sách các danh sách, sử dụng `items()`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}

:echo items(mealPlans)
" trả về [['lunch', 'pancakes'], ['breakfast', 'waffles'], ['dinner', 'donuts']]
```

`filter()` và `map()` cũng có sẵn.

```shell
:let breakfastNo = {1: "7am", 2: "9am", "11ses": "11am"}
:call filter(breakfastNo, 'v:key > 1')

:echo breakfastNo
" trả về {'2': '9am', '11ses': '11am'}
```

Vì một từ điển chứa các cặp khóa-giá trị, Vim cung cấp biến đặc biệt `v:key` hoạt động tương tự như `v:val`. Khi lặp qua một từ điển, `v:key` sẽ giữ giá trị của khóa hiện tại đang được lặp qua.

Nếu bạn có một từ điển `mealPlans`, bạn có thể ánh xạ nó bằng cách sử dụng `v:key`.

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:key . " và sữa"')

:echo mealPlans
" trả về {'lunch': 'lunch và sữa', 'breakfast': 'breakfast và sữa', 'dinner': 'dinner và sữa'}
```

Tương tự, bạn có thể ánh xạ nó bằng cách sử dụng `v:val`:

```shell
:let mealPlans = #{breakfast: "waffles", lunch: "pancakes", dinner: "donuts"}
:call map(mealPlans, 'v:val . " và sữa"')

:echo mealPlans
" trả về {'lunch': 'pancakes và sữa', 'breakfast': 'waffles và sữa', 'dinner': 'donuts và sữa'}
```

Để xem thêm các hàm từ điển, hãy kiểm tra `:h dict-functions`.

## Các Kiểu Dữ Liệu Đặc Biệt

Vim có các kiểu dữ liệu đặc biệt:

- `v:false`
- `v:true`
- `v:none`
- `v:null`

Nhân tiện, `v:` là biến tích hợp của Vim. Chúng sẽ được đề cập nhiều hơn trong một chương sau.

Theo kinh nghiệm của tôi, bạn sẽ không thường xuyên sử dụng những kiểu dữ liệu đặc biệt này. Nếu bạn cần một giá trị đúng/sai, bạn có thể chỉ cần sử dụng 0 (sai) và không phải 0 (đúng). Nếu bạn cần một chuỗi rỗng, chỉ cần sử dụng `""`. Nhưng vẫn tốt để biết, vì vậy hãy nhanh chóng xem qua chúng.

### Đúng

Điều này tương đương với `true`. Nó tương đương với một số có giá trị không phải 0. Khi giải mã json với `json_encode()`, nó được diễn giải là "true".

```shell
:echo json_encode({"test": v:true})
" trả về {"test": true}
```

### Sai

Điều này tương đương với `false`. Nó tương đương với một số có giá trị 0. Khi giải mã json với `json_encode()`, nó được diễn giải là "false".

```shell
:echo json_encode({"test": v:false})
" trả về {"test": false}
```

### Không có

Nó tương đương với một chuỗi rỗng. Khi giải mã json với `json_encode()`, nó được diễn giải là một mục rỗng (`null`).

```shell
:echo json_encode({"test": v:none})
" trả về {"test": null}
```

### Null

Tương tự như `v:none`.

```shell
:echo json_encode({"test": v:null})
" trả về {"test": null}
```

## Học Các Kiểu Dữ Liệu Một Cách Thông Minh

Trong chương này, bạn đã học về các kiểu dữ liệu cơ bản của Vimscript: số, số thực, chuỗi, danh sách, từ điển và đặc biệt. Học những điều này là bước đầu tiên để bắt đầu lập trình Vimscript.

Trong chương tiếp theo, bạn sẽ học cách kết hợp chúng để viết các biểu thức như sự bằng nhau, điều kiện và vòng lặp.