---
description: Tài liệu này giải thích cách sử dụng hàm trong Vimscript, bao gồm cú
  pháp, quy tắc đặt tên và ví dụ minh họa để hiểu rõ hơn về chức năng của chúng.
title: Ch28. Vimscript Functions
---

Functions là phương tiện trừu tượng, là yếu tố thứ ba trong việc học một ngôn ngữ mới.

Trong các chương trước, bạn đã thấy các hàm native của Vimscript (`len()`, `filter()`, `map()`, v.v.) và các hàm tùy chỉnh hoạt động. Trong chương này, bạn sẽ đi sâu hơn để tìm hiểu cách các hàm hoạt động.

## Quy tắc cú pháp hàm

Cốt lõi, một hàm Vimscript có cú pháp sau:

```shell
function {FunctionName}()
  {do-something}
endfunction
```

Một định nghĩa hàm phải bắt đầu bằng một chữ cái viết hoa. Nó bắt đầu với từ khóa `function` và kết thúc với `endfunction`. Dưới đây là một hàm hợp lệ:

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Dưới đây không phải là một hàm hợp lệ vì nó không bắt đầu bằng chữ cái viết hoa.

```shell
function tasty()
  echo "Tasty"
endfunction
```

Nếu bạn thêm một biến script (`s:`) trước hàm, bạn có thể sử dụng nó với chữ thường. `function s:tasty()` là một tên hợp lệ. Lý do Vim yêu cầu bạn sử dụng tên viết hoa là để tránh nhầm lẫn với các hàm tích hợp của Vim (tất cả đều viết thường).

Tên hàm không thể bắt đầu bằng một số. `1Tasty()` không phải là một tên hàm hợp lệ, nhưng `Tasty1()` thì có. Một hàm cũng không thể chứa các ký tự không phải chữ cái và số ngoài `_`. `Tasty-food()`, `Tasty&food()`, và `Tasty.food()` không phải là tên hàm hợp lệ. `Tasty_food()` *thì có*.

Nếu bạn định nghĩa hai hàm với cùng một tên, Vim sẽ ném ra lỗi thông báo rằng hàm `Tasty` đã tồn tại. Để ghi đè hàm trước đó với cùng một tên, thêm một `!` sau từ khóa `function`.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

## Liệt kê các hàm có sẵn

Để xem tất cả các hàm tích hợp và tùy chỉnh trong Vim, bạn có thể chạy lệnh `:function`. Để xem nội dung của hàm `Tasty`, bạn có thể chạy `:function Tasty`.

Bạn cũng có thể tìm kiếm các hàm với mẫu bằng `:function /pattern`, tương tự như điều hướng tìm kiếm của Vim (`/pattern`). Để tìm tất cả các hàm chứa cụm từ "map", chạy `:function /map`. Nếu bạn sử dụng các plugin bên ngoài, Vim sẽ hiển thị các hàm được định nghĩa trong các plugin đó.

Nếu bạn muốn xem nơi một hàm xuất phát, bạn có thể sử dụng lệnh `:verbose` với lệnh `:function`. Để xem nơi tất cả các hàm chứa từ "map" xuất phát, chạy:

```shell
:verbose function /map
```

Khi tôi chạy nó, tôi nhận được một số kết quả. Kết quả này cho tôi biết rằng hàm `fzf#vim#maps` là hàm autoload (để tóm tắt, tham khảo Ch. 23) được viết trong tệp `~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim`, ở dòng 1263. Điều này hữu ích cho việc gỡ lỗi.

```shell
function fzf#vim#maps(mode, ...)
        Last set from ~/.vim/plugged/fzf.vim/autoload/fzf/vim.vim line 1263
```

## Xóa một hàm

Để xóa một hàm đã tồn tại, sử dụng `:delfunction {Function_name}`. Để xóa `Tasty`, chạy `:delfunction Tasty`.

## Giá trị trả về của hàm

Để một hàm trả về một giá trị, bạn cần truyền cho nó một giá trị `return` rõ ràng. Nếu không, Vim tự động trả về một giá trị ngầm định là 0.

```shell
function! Tasty()
  echo "Tasty"
endfunction
```

Một `return` rỗng cũng tương đương với giá trị 0.

```shell
function! Tasty()
  echo "Tasty"
  return
endfunction
```

Nếu bạn chạy `:echo Tasty()` sử dụng hàm ở trên, sau khi Vim hiển thị "Tasty", nó trả về 0, giá trị trả về ngầm định. Để làm cho `Tasty()` trả về giá trị "Tasty", bạn có thể làm như sau:

```shell
function! Tasty()
  return "Tasty"
endfunction
```

Bây giờ khi bạn chạy `:echo Tasty()`, nó trả về chuỗi "Tasty".

Bạn có thể sử dụng một hàm bên trong một biểu thức. Vim sẽ sử dụng giá trị trả về của hàm đó. Biểu thức `:echo Tasty() . " Food!"` xuất ra "Tasty Food!"

## Tham số chính thức

Để truyền một tham số chính thức `food` vào hàm `Tasty` của bạn, bạn có thể làm như sau:

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

echo Tasty("pastry")
" trả về "Tasty pastry"
```

`a:` là một trong những phạm vi biến được đề cập trong chương trước. Nó là biến tham số chính thức. Đây là cách Vim lấy giá trị tham số chính thức trong một hàm. Nếu không có nó, Vim sẽ ném ra lỗi:

```shell
function! Tasty(food)
  return "Tasty " . food
endfunction

echo Tasty("pasta")
" trả về lỗi "tên biến không xác định"
```

## Biến cục bộ của hàm

Hãy đề cập đến biến khác mà bạn chưa học trong chương trước: biến cục bộ của hàm (`l:`).

Khi viết một hàm, bạn có thể định nghĩa một biến bên trong:

```shell
function! Yummy()
  let location = "tummy"
  return "Yummy in my " . location
endfunction

echo Yummy()
" trả về "Yummy in my tummy"
```

Trong ngữ cảnh này, biến `location` tương đương với `l:location`. Khi bạn định nghĩa một biến trong một hàm, biến đó là *cục bộ* cho hàm đó. Khi người dùng thấy `location`, họ có thể dễ dàng nhầm lẫn với một biến toàn cục. Tôi thích rõ ràng hơn là không, vì vậy tôi thích thêm `l:` để chỉ ra rằng đây là một biến của hàm.

Một lý do khác để sử dụng `l:count` là Vim có các biến đặc biệt với bí danh trông giống như các biến thông thường. `v:count` là một ví dụ. Nó có bí danh là `count`. Trong Vim, gọi `count` là giống như gọi `v:count`. Thật dễ dàng để vô tình gọi một trong những biến đặc biệt đó.

```shell
function! Calories()
  let count = "count"
  return "I do not " . count . " my calories"
endfunction

echo Calories()
" ném ra lỗi
```

Việc thực thi ở trên ném ra lỗi vì `let count = "Count"` cố gắng tái định nghĩa biến đặc biệt `v:count` của Vim một cách ngầm định. Nhớ rằng các biến đặc biệt (`v:`) là chỉ đọc. Bạn không thể thay đổi nó. Để sửa lỗi, sử dụng `l:count`:

```shell
function! Calories()
  let l:count = "count"
  return "I do not " . l:count . " my calories"
endfunction

echo Calories()
" trả về "I do not count my calories"
```

## Gọi một hàm

Vim có lệnh `:call` để gọi một hàm.

```shell
function! Tasty(food)
  return "Tasty " . a:food
endfunction

call Tasty("gravy")
```

Lệnh `call` không xuất giá trị trả về. Hãy gọi nó với `echo`.

```shell
echo call Tasty("gravy")
```

Ôi, bạn nhận được một lỗi. Lệnh `call` ở trên là một lệnh dòng lệnh (`:call`). Lệnh `echo` ở trên cũng là một lệnh dòng lệnh (`:echo`). Bạn không thể gọi một lệnh dòng lệnh bằng một lệnh dòng lệnh khác. Hãy thử một cách khác của lệnh `call`:

```shell
echo call("Tasty", ["gravy"])
" trả về "Tasty gravy"
```

Để làm rõ bất kỳ nhầm lẫn nào, bạn vừa sử dụng hai lệnh `call` khác nhau: lệnh dòng lệnh `:call` và hàm `call()`. Hàm `call()` chấp nhận đối số đầu tiên là tên hàm (chuỗi) và đối số thứ hai là các tham số chính thức (danh sách).

Để tìm hiểu thêm về `:call` và `call()`, hãy kiểm tra `:h call()` và `:h :call`.

## Tham số mặc định

Bạn có thể cung cấp một tham số hàm với giá trị mặc định bằng `=`. Nếu bạn gọi `Breakfast` với chỉ một tham số, tham số `beverage` sẽ sử dụng giá trị mặc định là "milk".

```shell
function! Breakfast(meal, beverage = "Milk")
  return "I had " . a:meal . " and " . a:beverage . " for breakfast"
endfunction

echo Breakfast("Hash Browns")
" trả về "I had hash browns and milk for breakfast"

echo Breakfast("Cereal", "Orange Juice")
" trả về "I had Cereal and Orange Juice for breakfast"
```

## Tham số biến

Bạn có thể truyền một tham số biến với ba dấu chấm (`...`). Tham số biến hữu ích khi bạn không biết có bao nhiêu biến mà người dùng sẽ cung cấp.

Giả sử bạn đang tạo một bữa tiệc buffet (bạn sẽ không bao giờ biết khách hàng của bạn sẽ ăn bao nhiêu thức ăn):

```shell
function! Buffet(...)
  return a:1
endfunction
```

Nếu bạn chạy `echo Buffet("Noodles")`, nó sẽ xuất ra "Noodles". Vim sử dụng `a:1` để in ra tham số *đầu tiên* được truyền vào `...`, lên đến 20 (`a:1` là tham số đầu tiên, `a:2` là tham số thứ hai, v.v.). Nếu bạn chạy `echo Buffet("Noodles", "Sushi")`, nó vẫn sẽ chỉ hiển thị "Noodles", hãy cập nhật nó:

```shell
function! Buffet(...)
  return a:1 . " " . a:2
endfunction

echo Buffet("Noodles", "Sushi")
" trả về "Noodles Sushi"
```

Vấn đề với cách tiếp cận này là nếu bạn bây giờ chạy `echo Buffet("Noodles")` (với chỉ một biến), Vim sẽ phàn nàn rằng nó có một biến không xác định `a:2`. Làm thế nào bạn có thể làm cho nó linh hoạt đủ để hiển thị chính xác những gì người dùng cung cấp?

May mắn thay, Vim có một biến đặc biệt `a:0` để hiển thị *số lượng* tham số được truyền vào `...`.

```shell
function! Buffet(...)
  return a:0
endfunction

echo Buffet("Noodles")
" trả về 1

echo Buffet("Noodles", "Sushi")
" trả về 2

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" trả về 5
```

Với điều này, bạn có thể lặp lại sử dụng độ dài của tham số.

```shell
function! Buffet(...)
  let l:food_counter = 1
  let l:foods = ""
  while l:food_counter <= a:0
    let l:foods .= a:{l:food_counter} . " "
    let l:food_counter += 1
  endwhile
  return l:foods
endfunction
```

Dấu ngoặc nhọn `a:{l:food_counter}` là một chuỗi nội suy, nó sử dụng giá trị của bộ đếm `food_counter` để gọi các tham số chính thức `a:1`, `a:2`, `a:3`, v.v.

```shell
echo Buffet("Noodles")
" trả về "Noodles"

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" trả về mọi thứ bạn đã truyền: "Noodles Sushi Ice cream Tofu Mochi"
```

Tham số biến còn có một biến đặc biệt nữa: `a:000`. Nó có giá trị của tất cả các tham số biến ở định dạng danh sách.

```shell
function! Buffet(...)
  return a:000
endfunction

echo Buffet("Noodles")
" trả về ["Noodles"]

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" trả về ["Noodles", "Sushi", "Ice cream", "Tofu", "Mochi"]
```

Hãy tái cấu trúc hàm để sử dụng vòng lặp `for`:

```shell
function! Buffet(...)
  let l:foods = ""
  for food_item in a:000
    let l:foods .= food_item . " "
  endfor
  return l:foods
endfunction

echo Buffet("Noodles", "Sushi", "Ice cream", "Tofu", "Mochi")
" trả về Noodles Sushi Ice cream Tofu Mochi
```
## Phạm vi

Bạn có thể định nghĩa một hàm Vimscript *có phạm vi* bằng cách thêm từ khóa `range` ở cuối định nghĩa hàm. Một hàm có phạm vi có hai biến đặc biệt sẵn có: `a:firstline` và `a:lastline`.

```shell
function! Breakfast() range
  echo a:firstline
  echo a:lastline
endfunction
```

Nếu bạn đang ở dòng 100 và bạn chạy `call Breakfast()`, nó sẽ hiển thị 100 cho cả `firstline` và `lastline`. Nếu bạn đánh dấu trực quan (`v`, `V`, hoặc `Ctrl-V`) các dòng từ 101 đến 105 và chạy `call Breakfast()`, `firstline` sẽ hiển thị 101 và `lastline` sẽ hiển thị 105. `firstline` và `lastline` hiển thị phạm vi tối thiểu và tối đa nơi hàm được gọi.

Bạn cũng có thể sử dụng `:call` và truyền cho nó một phạm vi. Nếu bạn chạy `:11,20call Breakfast()`, nó sẽ hiển thị 11 cho `firstline` và 20 cho `lastline`.

Bạn có thể hỏi, "Thật tốt khi hàm Vimscript chấp nhận phạm vi, nhưng tôi không thể lấy số dòng với `line(".")`? Nó không làm điều tương tự sao?"

Câu hỏi hay. Nếu đây là điều bạn muốn nói:

```shell
function! Breakfast()
  echo line(".")
endfunction
```

Gọi `:11,20call Breakfast()` thực thi hàm `Breakfast` 10 lần (một lần cho mỗi dòng trong phạm vi). So sánh điều đó nếu bạn đã truyền đối số `range`:

```shell
function! Breakfast() range
  echo line(".")
endfunction
```

Gọi `11,20call Breakfast()` thực thi hàm `Breakfast` *một lần*.

Nếu bạn truyền từ khóa `range` và bạn truyền một phạm vi số (như `11,20`) trên `call`, Vim chỉ thực thi hàm đó một lần. Nếu bạn không truyền từ khóa `range` và bạn truyền một phạm vi số (như `11,20`) trên `call`, Vim thực thi hàm đó N lần tùy thuộc vào phạm vi (trong trường hợp này, N = 10).

## Từ điển

Bạn có thể thêm một hàm như một mục từ điển bằng cách thêm từ khóa `dict` khi định nghĩa một hàm.

Nếu bạn có một hàm `SecondBreakfast` trả về bất kỳ mục `breakfast` nào bạn có:

```shell
function! SecondBreakfast() dict
  return self.breakfast
endfunction
```

Hãy thêm hàm này vào từ điển `meals`:

```shell
let meals = {"breakfast": "pancakes", "second_breakfast": function("SecondBreakfast"), "lunch": "pasta"}

echo meals.second_breakfast()
" trả về "pancakes"
```

Với từ khóa `dict`, biến khóa `self` tham chiếu đến từ điển nơi hàm được lưu trữ (trong trường hợp này, từ điển `meals`). Biểu thức `self.breakfast` bằng với `meals.breakfast`.

Một cách thay thế để thêm một hàm vào một đối tượng từ điển là sử dụng không gian tên.

```shell
function! meals.second_lunch()
  return self.lunch
endfunction

echo meals.second_lunch()
" trả về "pasta"
```

Với không gian tên, bạn không cần phải sử dụng từ khóa `dict`.

## Funcref

Một funcref là một tham chiếu đến một hàm. Nó là một trong những kiểu dữ liệu cơ bản của Vimscript được đề cập trong Ch. 24.

Biểu thức `function("SecondBreakfast")` ở trên là một ví dụ về funcref. Vim có một hàm tích hợp `function()` trả về một funcref khi bạn truyền cho nó một tên hàm (chuỗi).

```shell
function! Breakfast(item)
  return "Tôi đang ăn " . a:item . " cho bữa sáng"
endfunction

let Breakfastify = Breakfast
" trả về lỗi

let Breakfastify = function("Breakfast")

echo Breakfastify("oatmeal")
" trả về "Tôi đang ăn oatmeal cho bữa sáng"

echo Breakfastify("pancake")
" trả về "Tôi đang ăn pancake cho bữa sáng"
```

Trong Vim, nếu bạn muốn gán một hàm cho một biến, bạn không thể chỉ đơn giản gán nó trực tiếp như `let MyVar = MyFunc`. Bạn cần sử dụng hàm `function()`, như `let MyVar = function("MyFunc")`.

Bạn có thể sử dụng funcref với các bản đồ và bộ lọc. Lưu ý rằng các bản đồ và bộ lọc sẽ truyền một chỉ số như đối số đầu tiên và giá trị được lặp lại như đối số thứ hai.

```shell
function! Breakfast(index, item)
  return "Tôi đang ăn " . a:item . " cho bữa sáng"
endfunction

let breakfast_items = ["pancakes", "hash browns", "waffles"]
let first_meals = map(breakfast_items, function("Breakfast"))

for meal in first_meals
  echo meal
endfor
```

## Lambda

Một cách tốt hơn để sử dụng các hàm trong các bản đồ và bộ lọc là sử dụng biểu thức lambda (đôi khi được gọi là hàm không tên). Ví dụ:

```shell
let Plus = {x,y -> x + y}
echo Plus(1,2)
" trả về 3

let Tasty = { -> 'tasty'}
echo Tasty()
" trả về "tasty"
```

Bạn có thể gọi một hàm từ bên trong một biểu thức lambda:

```shell
function! Lunch(item)
  return "Tôi đang ăn " . a:item . " cho bữa trưa"
endfunction

let lunch_items = ["sushi", "ramen", "sashimi"]

let day_meals = map(lunch_items, {index, item -> Lunch(item)})

for meal in day_meals
  echo meal
endfor
```

Nếu bạn không muốn gọi hàm từ bên trong lambda, bạn có thể tái cấu trúc nó:

```shell
let day_meals = map(lunch_items, {index, item -> "Tôi đang ăn " . item . " cho bữa trưa"})
```

## Chuỗi phương thức

Bạn có thể nối nhiều hàm Vimscript và biểu thức lambda một cách tuần tự với `->`. Hãy nhớ rằng `->` phải được theo sau bởi một tên phương thức *không có khoảng trắng.*

```shell
Source->Method1()->Method2()->...->MethodN()
```

Để chuyển đổi một số thực thành một số bằng cách sử dụng chuỗi phương thức:

```shell
echo 3.14->float2nr()
" trả về 3
```

Hãy làm một ví dụ phức tạp hơn. Giả sử bạn cần viết hoa chữ cái đầu tiên của mỗi mục trong danh sách, sau đó sắp xếp danh sách, sau đó nối danh sách để tạo thành một chuỗi.

```shell
function! Capitalizer(word)
  return substitute(a:word, "\^\.", "\\u&", "g")
endfunction

function! CapitalizeList(word_list)
  return map(a:word_list, {index, word -> Capitalizer(word)})
endfunction

let dinner_items = ["bruschetta", "antipasto", "calzone"]

echo dinner_items->CapitalizeList()->sort()->join(", ")
" trả về "Antipasto, Bruschetta, Calzone"
```

Với chuỗi phương thức, trình tự dễ đọc và hiểu hơn. Tôi chỉ cần nhìn vào `dinner_items->CapitalizeList()->sort()->join(", ")` và biết chính xác điều gì đang diễn ra.

## Đóng gói

Khi bạn định nghĩa một biến bên trong một hàm, biến đó tồn tại trong phạm vi của hàm đó. Điều này được gọi là phạm vi từ vựng.

```shell
function! Lunch()
  let appetizer = "tôm"

  function! SecondLunch()
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

`appetizer` được định nghĩa bên trong hàm `Lunch`, hàm này trả về funcref `SecondLunch`. Lưu ý rằng `SecondLunch` sử dụng `appetizer`, nhưng trong Vimscript, nó không có quyền truy cập vào biến đó. Nếu bạn cố gắng chạy `echo Lunch()()`, Vim sẽ ném ra lỗi biến không xác định.

Để khắc phục vấn đề này, hãy sử dụng từ khóa `closure`. Hãy tái cấu trúc:

```shell
function! Lunch()
  let appetizer = "tôm"

  function! SecondLunch() closure
    return appetizer
  endfunction

  return funcref("SecondLunch")
endfunction
```

Bây giờ nếu bạn chạy `echo Lunch()()`, Vim sẽ trả về "tôm".

## Học các hàm Vimscript theo cách thông minh

Trong chương này, bạn đã học về cấu trúc của hàm Vim. Bạn đã học cách sử dụng các từ khóa đặc biệt khác nhau `range`, `dict`, và `closure` để sửa đổi hành vi của hàm. Bạn cũng đã học cách sử dụng lambda và nối nhiều hàm với nhau. Các hàm là công cụ quan trọng để tạo ra các trừu tượng phức tạp.

Tiếp theo, hãy cùng kết hợp mọi thứ bạn đã học để tạo ra plugin của riêng bạn.