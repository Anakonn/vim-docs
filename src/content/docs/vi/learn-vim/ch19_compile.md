---
description: Hướng dẫn biên dịch mã nguồn từ Vim, sử dụng lệnh `:make` để tận dụng
  file makefile cho việc biên dịch hiệu quả hơn.
title: Ch19. Compile
---

Biên dịch là một chủ đề quan trọng đối với nhiều ngôn ngữ. Trong chương này, bạn sẽ học cách biên dịch từ Vim. Bạn cũng sẽ xem xét các cách để tận dụng lệnh `:make` của Vim.

## Biên Dịch Từ Dòng Lệnh

Bạn có thể sử dụng toán tử bang (`!`) để biên dịch. Nếu bạn cần biên dịch tệp `.cpp` của mình với `g++`, hãy chạy:

```shell
:!g++ hello.cpp -o hello
```

Tuy nhiên, việc phải nhập thủ công tên tệp và tên tệp đầu ra mỗi lần là dễ mắc lỗi và tẻ nhạt. Một makefile là cách tốt nhất.

## Lệnh Make

Vim có lệnh `:make` để chạy một makefile. Khi bạn chạy nó, Vim sẽ tìm kiếm một makefile trong thư mục hiện tại để thực thi.

Tạo một tệp có tên `makefile` trong thư mục hiện tại và đặt những nội dung này vào trong:

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Chạy lệnh này từ Vim:

```shell
:make
```

Vim thực thi nó giống như khi bạn chạy từ terminal. Lệnh `:make` chấp nhận tham số giống như lệnh make trong terminal. Chạy:

```shell
:make foo
" Xuất "Hello foo"

:make list_pls
" Xuất kết quả lệnh ls
```

Lệnh `:make` sử dụng quickfix của Vim để lưu bất kỳ lỗi nào nếu bạn chạy một lệnh sai. Hãy chạy một mục không tồn tại:

```shell
:make dontexist
```

Bạn sẽ thấy một lỗi khi chạy lệnh đó. Để xem lỗi đó, hãy chạy lệnh quickfix `:copen` để xem cửa sổ quickfix:

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Biên Dịch Với Make

Hãy sử dụng makefile để biên dịch một chương trình `.cpp` cơ bản. Đầu tiên, hãy tạo một tệp `hello.cpp`:

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Cập nhật makefile của bạn để xây dựng và chạy một tệp `.cpp`:

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Bây giờ chạy:

```shell
:make build
```

Lệnh `g++` biên dịch `./hello.cpp` và tạo `./hello`. Sau đó chạy:

```shell
:make run
```

Bạn sẽ thấy `"Hello!"` được in ra trên terminal.

## Chương Trình Make Khác

Khi bạn chạy `:make`, Vim thực sự chạy bất kỳ lệnh nào được thiết lập dưới tùy chọn `makeprg`. Nếu bạn chạy `:set makeprg?`, bạn sẽ thấy:

```shell
makeprg=make
```

Lệnh `:make` mặc định là lệnh `make` bên ngoài. Để thay đổi lệnh `:make` để thực thi `g++ {tên-tệp-của-bạn}` mỗi lần bạn chạy nó, hãy chạy:

```shell
:set makeprg=g++\ %
```

Ký tự `\` được sử dụng để thoát khỏi khoảng trắng sau `g++`. Ký hiệu `%` trong Vim đại diện cho tệp hiện tại. Lệnh `g++\\ %` tương đương với việc chạy `g++ hello.cpp`.

Đi đến `./hello.cpp` sau đó chạy `:make`. Vim biên dịch `hello.cpp` và tạo `a.out` vì bạn không chỉ định đầu ra. Hãy cải tiến nó để nó sẽ đặt tên đầu ra biên dịch với tên của tệp gốc trừ phần mở rộng. Chạy hoặc thêm điều này vào vimrc:

```shell
set makeprg=g++\ %\ -o\ %<
```

Phân tích:
- `g++\ %` giống như trên. Nó tương đương với việc chạy `g++ <tệp-của-bạn>`.
- `-o` là tùy chọn đầu ra.
- `%<` trong Vim đại diện cho tên tệp hiện tại mà không có phần mở rộng (`hello.cpp` trở thành `hello`).

Khi bạn chạy `:make` từ trong `./hello.cpp`, nó được biên dịch thành `./hello`. Để nhanh chóng thực thi `./hello` từ trong `./hello.cpp`, hãy chạy `:!./%<`. Một lần nữa, điều này tương đương với việc chạy `:!./{tên-tệp-hiện-tại-trừ-phần-mở-rộng}`.

Để biết thêm, hãy kiểm tra `:h :compiler` và `:h write-compiler-plugin`.

## Tự Động Biên Dịch Khi Lưu

Bạn có thể làm cho cuộc sống dễ dàng hơn bằng cách tự động hóa việc biên dịch. Nhớ rằng bạn có thể sử dụng `autocmd` của Vim để kích hoạt các hành động tự động dựa trên các sự kiện nhất định. Để tự động biên dịch các tệp `.cpp` mỗi khi lưu, hãy thêm điều này vào vimrc của bạn:

```shell
autocmd BufWritePost *.cpp make
```

Mỗi lần bạn lưu trong một tệp `.cpp`, Vim sẽ thực thi lệnh `make`.

## Chuyển Đổi Biên Dịch

Vim có lệnh `:compiler` để nhanh chóng chuyển đổi các trình biên dịch. Phiên bản Vim của bạn có thể đi kèm với một số cấu hình trình biên dịch được xây dựng sẵn. Để kiểm tra các trình biên dịch bạn có, hãy chạy:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Bạn sẽ thấy một danh sách các trình biên dịch cho các ngôn ngữ lập trình khác nhau.

Để sử dụng lệnh `:compiler`, giả sử bạn có một tệp ruby, `hello.rb` và bên trong nó có:

```shell
puts "Hello ruby"
```

Nhớ rằng nếu bạn chạy `:make`, Vim sẽ thực thi bất kỳ lệnh nào được gán cho `makeprg` (mặc định là `make`). Nếu bạn chạy:

```shell
:compiler ruby
```

Vim sẽ chạy tập tin `$VIMRUNTIME/compiler/ruby.vim` và thay đổi `makeprg` để sử dụng lệnh `ruby`. Bây giờ nếu bạn chạy `:set makeprg?`, nó sẽ nói `makeprg=ruby` (điều này phụ thuộc vào những gì có trong tệp `$VIMRUNTIME/compiler/ruby.vim` của bạn hoặc nếu bạn có các trình biên dịch ruby tùy chỉnh khác. Của bạn có thể khác). Lệnh `:compiler {ngôn-ngữ-của-bạn}` cho phép bạn nhanh chóng chuyển đổi giữa các trình biên dịch khác nhau. Điều này rất hữu ích nếu dự án của bạn sử dụng nhiều ngôn ngữ.

Bạn không cần phải sử dụng `:compiler` và `makeprg` để biên dịch một chương trình. Bạn có thể chạy một tập tin thử nghiệm, lint một tệp, gửi tín hiệu, hoặc bất cứ điều gì bạn muốn.

## Tạo Một Trình Biên Dịch Tùy Chỉnh

Hãy tạo một trình biên dịch Typescript đơn giản. Cài đặt Typescript (`npm install -g typescript`) trên máy của bạn. Bây giờ bạn nên có lệnh `tsc`. Nếu bạn chưa từng làm việc với typescript trước đây, `tsc` biên dịch một tệp Typescript thành một tệp Javascript. Giả sử bạn có một tệp, `hello.ts`:

```shell
const hello = "hello";
console.log(hello);
```

Nếu bạn chạy `tsc hello.ts`, nó sẽ biên dịch thành `hello.js`. Tuy nhiên, nếu bạn có các biểu thức sau trong `hello.ts`:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Điều này sẽ gây ra lỗi vì bạn không thể thay đổi một biến `const`. Chạy `tsc hello.ts` sẽ ném ra một lỗi:

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

Để tạo một trình biên dịch Typescript đơn giản, trong thư mục `~/.vim/`, thêm một thư mục `compiler` (`~/.vim/compiler/`), sau đó tạo một tệp `typescript.vim` (`~/.vim/compiler/typescript.vim`). Đặt nội dung này vào trong:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

Dòng đầu tiên thiết lập `makeprg` để chạy lệnh `tsc`. Dòng thứ hai thiết lập định dạng lỗi để hiển thị tệp (`%f`), theo sau là một dấu hai chấm (`:`) và một khoảng trắng thoát (`\ `), theo sau là thông báo lỗi (`%m`). Để tìm hiểu thêm về định dạng lỗi, hãy kiểm tra `:h errorformat`.

Bạn cũng nên đọc một số trình biên dịch đã được tạo sẵn để xem cách người khác thực hiện. Kiểm tra `:e $VIMRUNTIME/compiler/<một-ngôn-ngữ-nào-đó>.vim`.

Vì một số plugin có thể gây cản trở với tệp Typescript, hãy mở `hello.ts` mà không có bất kỳ plugin nào, sử dụng cờ `--noplugin`:

```shell
vim --noplugin hello.ts
```

Kiểm tra `makeprg`:

```shell
:set makeprg?
```

Nó sẽ nói rằng chương trình `make` mặc định. Để sử dụng trình biên dịch Typescript mới, hãy chạy:

```shell
:compiler typescript
```

Khi bạn chạy `:set makeprg?`, nó sẽ nói `tsc` bây giờ. Hãy thử nghiệm. Chạy:

```shell
:make %
```

Nhớ rằng `%` có nghĩa là tệp hiện tại. Hãy xem trình biên dịch Typescript của bạn hoạt động như mong đợi! Để xem danh sách lỗi, hãy chạy `:copen`.

## Trình Biên Dịch Async

Đôi khi việc biên dịch có thể mất nhiều thời gian. Bạn không muốn phải nhìn vào một Vim bị đóng băng trong khi chờ đợi quá trình biên dịch của bạn hoàn tất. Liệu có tốt không nếu bạn có thể biên dịch không đồng bộ để bạn vẫn có thể sử dụng Vim trong quá trình biên dịch?

May mắn thay, có các plugin để chạy các quá trình không đồng bộ. Hai plugin lớn là:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

Trong phần còn lại của chương này, tôi sẽ nói về vim-dispatch, nhưng tôi rất khuyến khích bạn thử tất cả các plugin khác có sẵn.

*Vim và NeoVim thực sự hỗ trợ các tác vụ không đồng bộ, nhưng chúng nằm ngoài phạm vi của chương này. Nếu bạn tò mò, hãy kiểm tra `:h job-channel-overview.txt`.*

## Plugin: Vim-dispatch

Vim-dispatch có một số lệnh, nhưng hai lệnh chính là `:Make` và `:Dispatch`.

### Make Không Đồng Bộ

Lệnh `:Make` của Vim-dispatch tương tự như lệnh `:make` của Vim, nhưng nó chạy không đồng bộ. Nếu bạn đang ở trong một dự án Javascript và bạn cần chạy `npm t`, bạn có thể cố gắng thiết lập makeprg của mình thành:

```shell
:set makeprg=npm\\ t
```

Nếu bạn chạy:

```shell
:make
```

Vim sẽ thực thi `npm t`, nhưng bạn sẽ phải nhìn vào màn hình bị đóng băng trong khi bài kiểm tra JavaScript của bạn đang chạy. Với vim-dispatch, bạn chỉ cần chạy:

```shell
:Make
```

Vim sẽ chạy `npm t` không đồng bộ. Bằng cách này, trong khi `npm t` đang chạy trong một quá trình nền, bạn có thể tiếp tục làm bất cứ điều gì bạn đang làm. Thật tuyệt!

### Dispatch Không Đồng Bộ

Lệnh `:Dispatch` giống như lệnh `:compiler` và lệnh `:!`. Nó có thể chạy bất kỳ lệnh bên ngoài nào không đồng bộ trong Vim.

Giả sử bạn đang ở trong một tệp spec ruby và bạn cần chạy một bài kiểm tra. Chạy:

```shell
:Dispatch bundle exec rspec %
```

Vim sẽ chạy không đồng bộ lệnh `rspec` trên tệp hiện tại (`%`).

### Tự Động Dispatch

Vim-dispatch có biến bộ đệm `b:dispatch` mà bạn có thể cấu hình để đánh giá lệnh cụ thể tự động. Bạn có thể tận dụng nó với `autocmd`. Nếu bạn thêm điều này vào vimrc của bạn:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Bây giờ mỗi lần bạn vào một tệp (`BufEnter`) kết thúc bằng `_spec.rb`, chạy `:Dispatch` sẽ tự động thực thi `bundle exec rspec {tệp-spec-ruby-hiện-tại-của-bạn}`.

## Học Biên Dịch Một Cách Thông Minh

Trong chương này, bạn đã học rằng bạn có thể sử dụng các lệnh `make` và `compiler` để chạy *bất kỳ* quá trình nào từ bên trong Vim không đồng bộ để bổ sung cho quy trình làm việc lập trình của bạn. Khả năng mở rộng của Vim với các chương trình khác làm cho nó trở nên mạnh mẽ.