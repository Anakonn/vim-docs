---
description: Hướng dẫn viết plugin Vim đầu tiên của bạn với `totitle-vim`, một plugin
  giúp chuyển đổi tiêu đề thành chữ hoa đúng cách cho các tiêu đề trong văn bản.
title: 'Ch29. Write a Plugin: Creating a Titlecase Operator'
---

Khi bạn bắt đầu trở nên giỏi với Vim, bạn có thể muốn viết các plugin của riêng mình. Gần đây, tôi đã viết plugin Vim đầu tiên của mình, [totitle-vim](https://github.com/iggredible/totitle-vim). Đây là một plugin operator titlecase, tương tự như các operator chữ hoa `gU`, chữ thường `gu`, và chuyển đổi chữ hoa chữ thường `g~` của Vim.

Trong chương này, tôi sẽ trình bày sự phân tích của plugin `totitle-vim`. Tôi hy vọng sẽ làm sáng tỏ quy trình và có thể truyền cảm hứng cho bạn để tạo ra plugin độc đáo của riêng mình!

## Vấn Đề

Tôi sử dụng Vim để viết các bài viết của mình, bao gồm cả hướng dẫn này.

Một vấn đề chính là tạo ra một title case phù hợp cho các tiêu đề. Một cách để tự động hóa điều này là viết hoa mỗi từ trong tiêu đề với `g/^#/ s/\<./\u\0/g`. Đối với việc sử dụng cơ bản, lệnh này đủ tốt, nhưng vẫn không tốt bằng việc có một title case thực sự. Các từ "The" và "Of" trong "Capitalize The First Letter Of Each Word" nên được viết hoa. Nếu không có sự viết hoa đúng cách, câu nhìn có vẻ hơi sai.

Ban đầu, tôi không có kế hoạch viết một plugin. Ngoài ra, hóa ra đã có một plugin titlecase: [vim-titlecase](https://github.com/christoomey/vim-titlecase). Tuy nhiên, có một vài điều không hoạt động đúng như tôi mong muốn. Điều chính là hành vi của chế độ visual block. Nếu tôi có cụm từ:

```shell
test title one
test title two
test title three
```

Nếu tôi sử dụng một highlight visual block trên "tle":

```shell
test ti[tle] one
test ti[tle] two
test ti[tle] three
```

Nếu tôi nhấn `gt`, plugin sẽ không viết hoa nó. Tôi thấy điều này không nhất quán với hành vi của `gu`, `gU`, và `g~`. Vì vậy, tôi quyết định làm việc từ kho plugin titlecase đó và sử dụng nó để tạo ra một plugin titlecase của riêng mình mà nhất quán với `gu`, `gU`, và `g~`!. Một lần nữa, plugin vim-titlecase tự nó là một plugin xuất sắc và xứng đáng được sử dụng độc lập (sự thật là, có thể sâu thẳm bên trong, tôi chỉ muốn viết plugin Vim của riêng mình. Tôi không thực sự thấy tính năng titlecasing blockwise được sử dụng thường xuyên trong đời thực ngoài các trường hợp đặc biệt).

### Lập Kế Hoạch cho Plugin

Trước khi viết dòng mã đầu tiên, tôi cần quyết định các quy tắc titlecase là gì. Tôi đã tìm thấy một bảng quy tắc viết hoa khác nhau từ trang [titlecaseconverter](https://titlecaseconverter.com/rules/). Bạn có biết rằng có ít nhất 8 quy tắc viết hoa khác nhau trong tiếng Anh không? *Gasp!*

Cuối cùng, tôi đã sử dụng các số chung từ danh sách đó để đưa ra một quy tắc cơ bản đủ tốt cho plugin. Hơn nữa, tôi nghi ngờ rằng mọi người sẽ phàn nàn, "Này, bạn đang sử dụng AMA, tại sao bạn không sử dụng APA?". Đây là các quy tắc cơ bản:
- Từ đầu tiên luôn được viết hoa.
- Một số trạng từ, liên từ và giới từ được viết thường.
- Nếu từ đầu vào hoàn toàn được viết hoa, thì không làm gì cả (nó có thể là một từ viết tắt).

Còn về các từ nào được viết thường, các quy tắc khác nhau có các danh sách khác nhau. Tôi quyết định giữ lại `a an and at but by en for in nor of off on or out per so the to up yet vs via`.

### Lập Kế Hoạch cho Giao Diện Người Dùng

Tôi muốn plugin trở thành một operator để bổ sung cho các operator case hiện có của Vim: `gu`, `gU`, và `g~`. Là một operator, nó phải chấp nhận một chuyển động hoặc một đối tượng văn bản (`gtw` nên titlecase từ tiếp theo, `gtiw` nên titlecase từ bên trong, `gt$` nên titlecase các từ từ vị trí hiện tại đến cuối dòng, `gtt` nên titlecase dòng hiện tại, `gti(` nên titlecase các từ bên trong dấu ngoặc, v.v). Tôi cũng muốn nó được ánh xạ đến `gt` để dễ nhớ. Hơn nữa, nó cũng nên hoạt động với tất cả các chế độ visual: `v`, `V`, và `Ctrl-V`. Tôi nên có thể highlight nó trong *bất kỳ* chế độ visual nào, nhấn `gt`, sau đó tất cả các văn bản được highlight sẽ được titlecased.

## Thời Gian Chạy Vim

Điều đầu tiên bạn thấy khi nhìn vào kho là nó có hai thư mục: `plugin/` và `doc/`. Khi bạn khởi động Vim, nó tìm kiếm các tệp và thư mục đặc biệt bên trong thư mục `~/.vim` và chạy tất cả các tệp script bên trong thư mục đó. Để biết thêm, hãy xem chương Thời Gian Chạy Vim.

Plugin sử dụng hai thư mục thời gian chạy Vim: `doc/` và `plugin/`. `doc/` là nơi để đặt tài liệu trợ giúp (để bạn có thể tìm kiếm từ khóa sau này, như `:h totitle`). Tôi sẽ giải thích cách tạo một trang trợ giúp sau. Hiện tại, hãy tập trung vào `plugin/`. Thư mục `plugin/` được thực thi một lần khi Vim khởi động. Có một tệp bên trong thư mục này: `totitle.vim`. Tên không quan trọng (tôi có thể đã đặt tên nó là `whatever.vim` và nó vẫn hoạt động). Tất cả mã chịu trách nhiệm cho việc plugin hoạt động nằm trong tệp này.

## Ánh Xạ

Hãy cùng xem qua mã nhé! 

Ở đầu tệp, bạn có:

```shell
if !exists('g:totitle_default_keys')
  let g:totitle_default_keys = 1
endif
```

Khi bạn khởi động Vim, `g:totitle_default_keys` chưa tồn tại, vì vậy `!exists(...)` trả về true. Trong trường hợp đó, định nghĩa `g:totitle_default_keys` bằng 1. Trong Vim, 0 là falsy và số không bằng 0 là truthy (sử dụng 1 để chỉ ra truthy).

Hãy nhảy xuống dưới cùng của tệp. Bạn sẽ thấy điều này:

```shell
if g:totitle_default_keys
  nnoremap <expr> gt ToTitle()
  xnoremap <expr> gt ToTitle()
  nnoremap <expr> gtt ToTitle() .. '_'
endif
```

Đây là nơi ánh xạ chính `gt` được định nghĩa. Trong trường hợp này, khi bạn đến các điều kiện `if` ở dưới cùng của tệp, `if g:totitle_default_keys` sẽ trả về 1 (truthy), vì vậy Vim thực hiện các ánh xạ sau:
- `nnoremap <expr> gt ToTitle()` ánh xạ operator chế độ bình thường. Điều này cho phép bạn chạy operator + chuyển động/đối tượng văn bản như `gtw` để titlecase từ tiếp theo hoặc `gtiw` để titlecase từ bên trong. Tôi sẽ giải thích chi tiết cách hoạt động của ánh xạ operator sau.
- `xnoremap <expr> gt ToTitle()` ánh xạ các operator chế độ visual. Điều này cho phép bạn titlecase các văn bản được highlight một cách trực quan.
- `nnoremap <expr> gtt ToTitle() .. '_'` ánh xạ operator chế độ bình thường theo dòng (tương tự như `guu` và `gUU`). Bạn có thể tự hỏi `.. '_'` có tác dụng gì ở cuối. `..` là toán tử nội suy chuỗi của Vim. `_` được sử dụng như một chuyển động với một operator. Nếu bạn nhìn vào `:help _`, nó nói rằng dấu gạch dưới được sử dụng để đếm 1 dòng xuống dưới. Nó thực hiện một operator trên dòng hiện tại (hãy thử với các operator khác, hãy thử chạy `gU_` hoặc `d_`, nhận thấy rằng nó thực hiện giống như `gUU` hoặc `dd`).
- Cuối cùng, tham số `<expr>` cho phép bạn chỉ định số đếm, vì vậy bạn có thể thực hiện `3gtw` để togglecase 3 từ tiếp theo.

Thế còn nếu bạn không muốn sử dụng ánh xạ mặc định `gt`? Dù sao, bạn đang ghi đè ánh xạ mặc định `gt` (tab tiếp theo) của Vim. Thế nếu bạn muốn sử dụng `gz` thay vì `gt`? Hãy nhớ trước đó bạn đã phải kiểm tra `if !exists('g:totitle_default_keys')` và `if g:totitle_default_keys`? Nếu bạn đặt `let g:totitle_default_keys = 0` trong vimrc của bạn, thì `g:totitle_default_keys` đã tồn tại khi plugin được chạy (các mã trong vimrc của bạn được thực thi trước các tệp thời gian chạy `plugin/`), vì vậy `!exists('g:totitle_default_keys')` trả về false. Hơn nữa, `if g:totitle_default_keys` sẽ là falsy (bởi vì nó sẽ có giá trị 0), vì vậy nó cũng sẽ không thực hiện ánh xạ `gt`! Điều này cho phép bạn định nghĩa ánh xạ tùy chỉnh của riêng bạn trong Vimrc.

Để định nghĩa ánh xạ titlecase của riêng bạn cho `gz`, hãy thêm điều này vào vimrc của bạn:

```shell
let g:totitle_default_keys = 0

nnoremap <expr> gz ToTitle()
xnoremap <expr> gz ToTitle()
nnoremap <expr> gzz ToTitle() .. '_'
```

Dễ dàng thôi.

## Hàm ToTitle

Hàm `ToTitle()` dễ dàng là hàm dài nhất trong tệp này.

```shell
 function! ToTitle(type = '')
  if a:type ==# ''
    set opfunc=ToTitle
    return 'g@'
  endif

  " invoke this when calling the ToTitle() function
  if a:type != 'block' && a:type != 'line' && a:type != 'char'
    let l:words = a:type
    let l:wordsArr = trim(l:words)->split('\s\+')
    call map(l:wordsArr, 's:capitalize(v:val)')
    return l:wordsArr->join(' ')
  endif

  " save the current settings
  let l:sel_save = &selection
  let l:reg_save = getreginfo('"')
  let l:cb_save = &clipboard
  let l:visual_marks_save = [getpos("'<"), getpos("'>")]

  try
    set clipboard= selection=inclusive
    let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

    silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
    let l:selected_phrase = getreg('"')
    let l:WORD_PATTERN = '\<\k*\>'
    let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

    let l:startLine = line("'<")
    let l:startCol = virtcol(".")

    " when user calls a block operation
    if a:type ==# "block"
      sil! keepj norm! gv"ad
      keepj $
      keepj pu_

      let l:lastLine = line("$")

      sil! keepj norm "ap

      let l:curLine = line(".")

      sil! keepj norm! VGg@
      exe "keepj norm! 0\<c-v>G$h\"ad"
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
      exe "keepj " . l:lastLine
      sil! keepj norm! "_dG
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"

    " when user calls a char or line operation
    else
      let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
      let l:titlecased = s:capitalizeFirstWord(l:titlecased)
      call setreg('"', l:titlecased)
      let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
      silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
      exe "keepj " . l:startLine
      exe "sil! keepj norm! " . l:startCol . "\<bar>"
    endif
  finally

    " restore the settings
    call setreg('"', l:reg_save)
    call setpos("'<", l:visual_marks_save[0])
    call setpos("'>", l:visual_marks_save[1])
    let &clipboard = l:cb_save
    let &selection = l:sel_save
  endtry
  return
endfunction
```

Đây là một hàm rất dài, vì vậy hãy phân tích nó.

*Tôi có thể tái cấu trúc nó thành các phần nhỏ hơn, nhưng vì lợi ích của việc hoàn thành chương này, tôi chỉ để nguyên như vậy.*
## Hàm Toán Tử

Đây là phần đầu tiên của mã:

```shell
if a:type ==# ''
  set opfunc=ToTitle
  return 'g@'
endif
```

`opfunc` là gì? Tại sao nó lại trả về `g@`?

Vim có một toán tử đặc biệt, hàm toán tử, `g@`. Toán tử này cho phép bạn sử dụng *bất kỳ* hàm nào được gán cho tùy chọn `opfunc`. Nếu tôi có hàm `Foo()` được gán cho `opfunc`, thì khi tôi chạy `g@w`, tôi đang chạy `Foo()` trên từ tiếp theo. Nếu tôi chạy `g@i(`, thì tôi đang chạy `Foo()` trên dấu ngoặc đơn bên trong. Hàm toán tử này rất quan trọng để tạo toán tử Vim của riêng bạn.

Dòng tiếp theo gán `opfunc` cho hàm `ToTitle`.

```shell
set opfunc=ToTitle
```

Dòng tiếp theo thực sự trả về `g@`:

```shell
return g@
```

Vậy hai dòng này hoạt động như thế nào và tại sao nó lại trả về `g@`?

Giả sử bạn có bản đồ sau:

```shell
nnoremap <expr> gt ToTitle()`
```

Sau đó bạn nhấn `gtw` (chuyển từ tiếp theo thành chữ hoa). Lần đầu tiên bạn chạy `gtw`, Vim gọi phương thức `ToTitle()`. Nhưng lúc này `opfunc` vẫn còn trống. Bạn cũng không truyền bất kỳ tham số nào cho `ToTitle()`, vì vậy nó sẽ có giá trị `a:type` là `''`. Điều này khiến biểu thức điều kiện kiểm tra tham số `a:type`, `if a:type ==# ''`, trở thành đúng. Bên trong, bạn gán `opfunc` cho hàm `ToTitle` với `set opfunc=ToTitle`. Bây giờ `opfunc` đã được gán cho `ToTitle`. Cuối cùng, sau khi bạn gán `opfunc` cho hàm `ToTitle`, bạn trả về `g@`. Tôi sẽ giải thích tại sao nó trả về `g@` bên dưới.

Bạn chưa xong đâu. Hãy nhớ, bạn vừa nhấn `gtw`. Nhấn `gt` đã thực hiện tất cả các điều trên, nhưng bạn vẫn còn `w` để xử lý. Bằng cách trả về `g@`, vào thời điểm này, bạn thực sự có `g@w` (đây là lý do bạn có `return g@`). Vì `g@` là hàm toán tử, bạn đang truyền cho nó chuyển động `w`. Vì vậy, Vim, khi nhận được `g@w`, sẽ gọi `ToTitle` *một lần nữa* (đừng lo, bạn sẽ không rơi vào vòng lặp vô hạn như bạn sẽ thấy trong một chút nữa).

Tóm lại, bằng cách nhấn `gtw`, Vim kiểm tra xem `opfunc` có trống hay không. Nếu nó trống, thì Vim sẽ gán nó với `ToTitle`. Sau đó, nó trả về `g@`, về cơ bản gọi lại `ToTitle` một lần nữa để bạn có thể sử dụng nó như một toán tử. Đây là phần khó nhất trong việc tạo toán tử tùy chỉnh và bạn đã làm được! Tiếp theo, bạn cần xây dựng logic cho `ToTitle()` để thực sự chuyển đổi chữ hoa cho đầu vào.

## Xử Lý Đầu Vào

Bây giờ bạn có `gt` hoạt động như một toán tử thực thi `ToTitle()`. Nhưng bạn sẽ làm gì tiếp theo? Làm thế nào để bạn thực sự chuyển đổi chữ hoa cho văn bản?

Bất cứ khi nào bạn chạy bất kỳ toán tử nào trong Vim, có ba loại chuyển động hành động khác nhau: ký tự, dòng và khối. `g@w` (từ) là một ví dụ về thao tác ký tự. `g@j` (một dòng bên dưới) là một ví dụ về thao tác dòng. Thao tác khối là hiếm, nhưng thường thì khi bạn thực hiện thao tác `Ctrl-V` (khối hình ảnh), nó sẽ được tính là thao tác khối. Các thao tác nhắm vào một vài ký tự phía trước / phía sau thường được coi là thao tác ký tự (`b`, `e`, `w`, `ge`, v.v.). Các thao tác nhắm vào một vài dòng phía dưới / phía trên thường được coi là thao tác dòng (`j`, `k`). Các thao tác nhắm vào các cột phía trước, phía sau, phía trên hoặc phía dưới thường được coi là thao tác khối (chúng thường là một chuyển động cột bắt buộc hoặc chế độ hình ảnh khối; để biết thêm: `:h forced-motion`).

Điều này có nghĩa là, nếu bạn nhấn `g@w`, `g@` sẽ truyền một chuỗi ký tự `"char"` làm tham số cho `ToTitle()`. Nếu bạn làm `g@j`, `g@` sẽ truyền một chuỗi ký tự `"line"` làm tham số cho `ToTitle()`. Chuỗi này sẽ được truyền vào hàm `ToTitle` như tham số `type`.

## Tạo Hàm Toán Tử Tùy Chỉnh Của Bạn

Hãy tạm dừng và chơi với `g@` bằng cách viết một hàm giả:

```shell
function! Test(some_arg)
  echom a:some_arg 
endfunction
```

Bây giờ gán hàm đó cho `opfunc` bằng cách chạy:

```shell
:set opfunc=Test
```

Toán tử `g@` sẽ thực thi `Test(some_arg)` và truyền cho nó `"char"`, `"line"`, hoặc `"block"` tùy thuộc vào thao tác bạn thực hiện. Chạy các thao tác khác nhau như `g@iw` (từ bên trong), `g@j` (một dòng bên dưới), `g@$` (đến cuối dòng), v.v. Xem các giá trị khác nhau được hiển thị. Để kiểm tra thao tác khối, bạn có thể sử dụng chuyển động bắt buộc của Vim cho các thao tác khối: `g@Ctrl-Vj` (thao tác khối một cột bên dưới).

Bạn cũng có thể sử dụng nó với chế độ hình ảnh. Sử dụng các đánh dấu hình ảnh khác nhau như `v`, `V`, và `Ctrl-V` sau đó nhấn `g@` (hãy cẩn thận, nó sẽ nhấp nháy đầu ra rất nhanh, vì vậy bạn cần phải nhanh mắt - nhưng đầu ra chắc chắn có. Ngoài ra, vì bạn đang sử dụng `echom`, bạn có thể kiểm tra các thông điệp đầu ra đã ghi lại với `:messages`).

Khá tuyệt phải không? Những điều bạn có thể lập trình với Vim! Tại sao họ không dạy điều này ở trường? Hãy tiếp tục với plugin của chúng ta.

## ToTitle Như Một Hàm

Tiến đến vài dòng tiếp theo:

```shell
if a:type != 'block' && a:type != 'line' && a:type != 'char'
  let l:words = a:type
  let l:wordsArr = trim(l:words)->split('\s\+')
  call map(l:wordsArr, 's:capitalize(v:val)')
  return l:wordsArr->join(' ')
endif
```

Dòng này thực sự không liên quan đến hành vi của `ToTitle()` như một toán tử, mà để cho phép nó trở thành một hàm TitleCase có thể gọi được (vâng, tôi biết rằng tôi đang vi phạm Nguyên Tắc Trách Nhiệm Đơn). Động lực là, Vim có các hàm `toupper()` và `tolower()` gốc sẽ chuyển đổi chữ hoa và chữ thường cho bất kỳ chuỗi nào. Ví dụ: `:echo toupper('hello')` trả về `'HELLO'` và `:echo tolower('HELLO')` trả về `'hello'`. Tôi muốn plugin này có khả năng chạy `ToTitle` để bạn có thể làm `:echo ToTitle('once upon a time')` và nhận được giá trị trả về là `'Once Upon a Time'`.

Bây giờ, bạn biết rằng khi bạn gọi `ToTitle(type)` với `g@`, tham số `type` sẽ có giá trị là `'block'`, `'line'`, hoặc `'char'`. Nếu tham số không phải là `'block'`, `'line'`, hoặc `'char'`, bạn có thể an tâm rằng `ToTitle()` đang được gọi bên ngoài `g@`. Trong trường hợp đó, bạn tách chúng theo khoảng trắng (`\s\+`) với:

```shell
let l:wordsArr = trim(l:words)->split('\s\+')
```

Sau đó viết hoa từng phần tử:

```shell
call map(l:wordsArr, 's:capitalize(v:val)')
```

Trước khi nối chúng lại với nhau:

```shell
l:wordsArr->join(' ')
```

Hàm `capitalize()` sẽ được đề cập sau.

## Biến Tạm Thời

Vài dòng tiếp theo:

```shell
let l:sel_save = &selection
let l:reg_save = getreginfo('"')
let l:cb_save = &clipboard
let l:visual_marks_save = [getpos("'<"), getpos("'>")]
```

Các dòng này lưu trữ nhiều trạng thái hiện tại vào các biến tạm thời. Sau này trong bạn sẽ sử dụng các chế độ hình ảnh, đánh dấu và thanh ghi. Việc làm này sẽ làm thay đổi một vài trạng thái. Vì bạn không muốn sửa đổi lịch sử, bạn cần lưu chúng vào các biến tạm thời để có thể khôi phục các trạng thái sau.
## Việc Viết Hoa Các Lựa Chọn

Các dòng tiếp theo là quan trọng:

```shell
try
  set clipboard= selection=inclusive
  let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}

  silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
  let l:selected_phrase = getreg('"')
  let l:WORD_PATTERN = '\<\k*\>'
  let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'

  let l:startLine = line("'<")
  let l:startCol = virtcol(".")
```
Hãy đi qua chúng từng phần nhỏ. Dòng này:

```shell
set clipboard= selection=inclusive
```

Bạn đầu tiên thiết lập tùy chọn `selection` là inclusive và `clipboard` là trống. Thuộc tính selection thường được sử dụng với chế độ trực quan và có ba giá trị có thể: `old`, `inclusive`, và `exclusive`. Thiết lập nó là inclusive có nghĩa là ký tự cuối cùng của lựa chọn được bao gồm. Tôi sẽ không đề cập đến chúng ở đây, nhưng điểm mấu chốt là việc chọn nó là inclusive khiến nó hoạt động nhất quán trong chế độ trực quan. Theo mặc định, Vim thiết lập nó là inclusive, nhưng bạn thiết lập nó ở đây để phòng trường hợp một trong các plugin của bạn thiết lập nó thành giá trị khác. Kiểm tra `:h 'clipboard'` và `:h 'selection'` nếu bạn tò mò về những gì chúng thực sự làm.

Tiếp theo bạn có một hash trông kỳ lạ theo sau là một lệnh thực thi:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
silent exe 'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')
```

Đầu tiên, cú pháp `#{}` là kiểu dữ liệu từ điển của Vim. Biến cục bộ `l:commands` là một hash với 'lines', 'char', và 'block' là các khóa của nó. Lệnh `silent exe '...'` thực thi bất kỳ lệnh nào bên trong chuỗi một cách im lặng (nếu không, nó sẽ hiển thị thông báo ở dưới cùng màn hình của bạn).

Thứ hai, các lệnh được thực thi là `'noautocmd keepjumps normal! ' .. get(l:commands, a:type, '')`. Lệnh đầu tiên, `noautocmd`, sẽ thực thi lệnh tiếp theo mà không kích hoạt bất kỳ autocommand nào. Lệnh thứ hai, `keepjumps`, là để không ghi lại chuyển động của con trỏ trong khi di chuyển. Trong Vim, một số chuyển động được ghi lại tự động trong danh sách thay đổi, danh sách nhảy, và danh sách đánh dấu. Điều này ngăn chặn điều đó. Mục đích của việc có `noautocmd` và `keepjumps` là để ngăn chặn các tác dụng phụ. Cuối cùng, lệnh `normal` thực thi các chuỗi như các lệnh bình thường. `..` là cú pháp nối chuỗi của Vim. `get()` là một phương thức getter chấp nhận một danh sách, blob, hoặc từ điển. Trong trường hợp này, bạn đang truyền vào từ điển `l:commands`. Khóa là `a:type`. Bạn đã học trước đó rằng `a:type` là một trong ba giá trị chuỗi: 'char', 'line', hoặc 'block'. Vì vậy, nếu `a:type` là 'line', bạn sẽ thực thi `"noautocmd keepjumps normal! '[V']y"` (để biết thêm, hãy kiểm tra `:h silent`, `:h :exe`, `:h :noautocmd`, `:h :keepjumps`, `:h :normal`, và `:h get()`).

Hãy xem `'[V']y` làm gì. Đầu tiên giả sử bạn có đoạn văn bản này:

```shell
bữa sáng thứ hai
tốt hơn bữa sáng thứ nhất
```
Giả sử con trỏ của bạn đang ở dòng đầu tiên. Sau đó bạn nhấn `g@j` (chạy chức năng toán tử, `g@`, một dòng bên dưới, với `j`). `'[` di chuyển con trỏ đến đầu của văn bản đã thay đổi hoặc đã yank trước đó. Mặc dù bạn về mặt kỹ thuật không thay đổi hoặc yank bất kỳ văn bản nào với `g@j`, Vim nhớ các vị trí của các chuyển động bắt đầu và kết thúc của lệnh `g@` với `'[` và `']` (để biết thêm, hãy kiểm tra `:h g@`). Trong trường hợp của bạn, nhấn `'[` di chuyển con trỏ của bạn đến dòng đầu tiên vì đó là nơi bạn bắt đầu khi bạn chạy `g@`. `V` là một lệnh chế độ trực quan theo dòng. Cuối cùng, `']` di chuyển con trỏ của bạn đến cuối văn bản đã thay đổi hoặc đã yank trước đó, nhưng trong trường hợp này, nó di chuyển con trỏ của bạn đến cuối thao tác `g@` cuối cùng của bạn. Cuối cùng, `y` yank văn bản đã chọn.

Những gì bạn vừa làm là yank cùng một đoạn văn bản mà bạn đã thực hiện `g@` trên đó.

Nếu bạn nhìn vào hai lệnh khác trong đây:

```shell
let l:commands = #{line: "'[V']y", char: "`[v`]y", block: "`[\<c-v>`]y"}
```

Chúng đều thực hiện các hành động tương tự, ngoại trừ việc thay vì sử dụng các hành động theo dòng, bạn sẽ sử dụng các hành động theo ký tự hoặc theo khối. Tôi sẽ nghe có vẻ lặp lại, nhưng trong cả ba trường hợp bạn thực sự yank cùng một đoạn văn bản mà bạn đã thực hiện `g@` trên đó.

Hãy nhìn vào dòng tiếp theo:

```shell
let l:selected_phrase = getreg('"')
```

Dòng này lấy nội dung của thanh ghi không tên (`"`) và lưu trữ nó trong biến `l:selected_phrase`. Chờ một chút... bạn không vừa yank một đoạn văn bản sao? Thanh ghi không tên hiện tại chứa văn bản mà bạn vừa yank. Đây là cách mà plugin này có thể lấy bản sao của văn bản.

Dòng tiếp theo là một mẫu biểu thức chính quy:

```shell
let l:WORD_PATTERN = '\<\k*\>'
```

`\<` và `\>` là các mẫu ranh giới từ. Ký tự theo sau `\<` khớp với đầu của một từ và ký tự đứng trước `\>` khớp với cuối của một từ. `\k` là mẫu từ khóa. Bạn có thể kiểm tra các ký tự nào Vim chấp nhận là từ khóa với `:set iskeyword?`. Nhớ rằng chuyển động `w` trong Vim di chuyển con trỏ của bạn theo từ. Vim đi kèm với một khái niệm trước về những gì là một "từ khóa" (bạn thậm chí có thể chỉnh sửa chúng bằng cách thay đổi tùy chọn `iskeyword`). Kiểm tra `:h /\<`, `:h /\>`, và `:h /\k`, và `:h 'iskeyword'` để biết thêm. Cuối cùng, `*` có nghĩa là không hoặc nhiều hơn mẫu tiếp theo.

Trong bức tranh lớn, `'\<\k*\>'` khớp với một từ. Nếu bạn có một chuỗi:

```shell
một hai ba
```

Khớp nó với mẫu sẽ cho bạn ba kết quả: "một", "hai", và "ba".

Cuối cùng, bạn có một mẫu khác:

```shell
let l:UPCASE_REPLACEMENT = '\=s:capitalize(submatch(0))'
```

Nhớ rằng lệnh thay thế của Vim có thể được sử dụng với một biểu thức với `\={your-expression}`. Ví dụ, nếu bạn muốn viết hoa chuỗi "bánh donut" trong dòng hiện tại, bạn có thể sử dụng hàm `toupper()` của Vim. Bạn có thể đạt được điều này bằng cách chạy `:%s/donut/\=toupper(submatch(0))/g`. `submatch(0)` là một biểu thức đặc biệt được sử dụng trong lệnh thay thế. Nó trả về toàn bộ văn bản đã khớp.

Hai dòng tiếp theo:

```shell
let l:startLine = line("'<")
let l:startCol = virtcol(".")
```

Biểu thức `line()` trả về một số dòng. Ở đây bạn truyền nó với dấu đánh dấu `'<`, đại diện cho dòng đầu tiên của khu vực trực quan đã chọn cuối cùng. Nhớ rằng bạn đã sử dụng chế độ trực quan để yank văn bản. `'<` trả về số dòng của đầu của lựa chọn khu vực trực quan đó. Biểu thức `virtcol()` trả về một số cột của con trỏ hiện tại. Bạn sẽ di chuyển con trỏ của mình khắp nơi trong một chút, vì vậy bạn cần lưu trữ vị trí con trỏ của mình để có thể quay lại đây sau.

Hãy nghỉ ngơi ở đây và xem xét mọi thứ cho đến nay. Đảm bảo rằng bạn vẫn đang theo dõi. Khi bạn đã sẵn sàng, hãy tiếp tục.
## Xử Lý Một Hoạt Động Khối

Hãy cùng đi qua phần này:

```shell
if a:type ==# "block"
  sil! keepj norm! gv"ad
  keepj $
  keepj pu_

  let l:lastLine = line("$")

  sil! keepj norm "ap

  let l:curLine = line(".")

  sil! keepj norm! VGg@
  exe "keepj norm! 0\<c-v>G$h\"ad" 
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
  exe "keepj " . l:lastLine
  sil! keepj norm! "_dG
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Đã đến lúc thực sự viết hoa văn bản của bạn. Hãy nhớ rằng bạn có `a:type` có thể là 'char', 'line', hoặc 'block'. Trong hầu hết các trường hợp, bạn sẽ nhận được 'char' và 'line'. Nhưng thỉnh thoảng bạn có thể nhận được một khối. Điều này hiếm nhưng vẫn cần phải xử lý. Thật không may, việc xử lý một khối không đơn giản như xử lý ký tự và dòng. Nó sẽ cần một chút nỗ lực thêm, nhưng có thể thực hiện được.

Trước khi bạn bắt đầu, hãy lấy một ví dụ về cách bạn có thể nhận được một khối. Giả sử bạn có văn bản này:

```shell
bánh kếp cho bữa sáng
bánh kếp cho bữa trưa
bánh kếp cho bữa tối
```

Giả sử con trỏ của bạn đang ở "c" trong "bánh kếp" trên dòng đầu tiên. Bạn sau đó sử dụng khối hình ảnh (`Ctrl-V`) để chọn xuống và tiến tới để chọn "kếp" trong cả ba dòng:

```shell
ban[kếp] cho bữa sáng
ban[kếp] cho bữa trưa
ban[kếp] cho bữa tối
```

Khi bạn nhấn `gt`, bạn muốn nhận được:

```shell
banKếp cho bữa sáng
banKếp cho bữa trưa
banKếp cho bữa tối

```
Dưới đây là những giả định cơ bản của bạn: khi bạn làm nổi bật ba "kếp" trong "bánh kếp", bạn đang nói với Vim rằng bạn có ba dòng từ mà bạn muốn làm nổi bật. Những từ này là "kếp", "kếp", và "kếp". Bạn mong đợi nhận được "Kếp", "Kếp", và "Kếp".

Hãy chuyển sang chi tiết thực hiện. Một vài dòng tiếp theo có:

```shell
sil! keepj norm! gv"ad
keepj $
keepj pu_
let l:lastLine = line("$")
sil! keepj norm "ap
let l:curLine = line(".")
```

Dòng đầu tiên:

```shell
sil! keepj norm! gv"ad
```

Nhớ rằng `sil!` chạy một cách im lặng và `keepj` giữ lại lịch sử nhảy khi di chuyển. Bạn sau đó thực hiện lệnh bình thường `gv"ad`. `gv` chọn lại văn bản đã được làm nổi bật lần cuối (trong ví dụ về bánh kếp, nó sẽ làm nổi bật lại cả ba 'kếp'). `"ad` xóa các văn bản đã được làm nổi bật và lưu trữ chúng trong thanh ghi a. Kết quả là, bạn hiện có:

```shell
ban cho bữa sáng
ban cho bữa trưa
ban cho bữa tối
```

Bây giờ bạn có 3 *khối* (không phải dòng) 'kếp' được lưu trữ trong thanh ghi a. Sự phân biệt này là quan trọng. Việc sao chép một văn bản với chế độ hình ảnh theo dòng khác với việc sao chép một văn bản với chế độ hình ảnh theo khối. Hãy nhớ điều này vì bạn sẽ thấy điều này một lần nữa sau này.

Tiếp theo bạn có:

```shell
keepj $
keepj pu_
```

`$` di chuyển bạn đến dòng cuối cùng trong tệp của bạn. `pu_` chèn một dòng bên dưới nơi con trỏ của bạn đang ở. Bạn muốn chạy chúng với `keepj` để không làm thay đổi lịch sử nhảy.

Sau đó, bạn lưu trữ số dòng của dòng cuối cùng của bạn (`line("$")`) trong biến cục bộ `lastLine`.

```shell
let l:lastLine = line("$")
```

Sau đó dán nội dung từ thanh ghi với `norm "ap`.

```shell
sil! keepj norm "ap
```

Hãy nhớ rằng điều này đang xảy ra trên dòng mới mà bạn đã tạo bên dưới dòng cuối cùng của tệp - bạn hiện đang ở cuối tệp. Dán sẽ cho bạn những văn bản *khối* này:

```shell
kếp
kếp
kếp
```

Tiếp theo, bạn lưu trữ vị trí của dòng hiện tại nơi con trỏ của bạn đang ở.

```shell
let l:curLine = line(".")
```

Bây giờ hãy đi đến vài dòng tiếp theo:

```shell
sil! keepj norm! VGg@
exe "keepj norm! 0\<c-v>G$h\"ad"
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Dòng này:

```shell
sil! keepj norm! VGg@
```

`VG` làm nổi bật chúng với chế độ hình ảnh theo dòng từ dòng hiện tại đến cuối tệp. Vì vậy, ở đây bạn đang làm nổi bật ba khối văn bản 'kếp' với chế độ làm nổi bật theo dòng (nhớ sự phân biệt giữa khối và dòng). Lưu ý rằng lần đầu tiên bạn dán ba văn bản "kếp", bạn đã dán chúng dưới dạng khối. Bây giờ bạn đang làm nổi bật chúng dưới dạng dòng. Chúng có thể trông giống nhau từ bên ngoài, nhưng bên trong, Vim biết sự khác biệt giữa việc dán các khối văn bản và dán các dòng văn bản.

```shell
kếp
kếp
kếp
```

`g@` là toán tử hàm, vì vậy bạn thực sự đang thực hiện một cuộc gọi đệ quy đến chính nó. Nhưng tại sao? Điều này đạt được điều gì?

Bạn đang thực hiện một cuộc gọi đệ quy đến `g@` và truyền cho nó tất cả 3 dòng (sau khi chạy nó với `V`, bạn hiện có các dòng, không phải khối) của văn bản 'kếp' để nó sẽ được xử lý bởi phần khác của mã (bạn sẽ xem xét điều này sau). Kết quả của việc chạy `g@` là ba dòng văn bản được viết hoa đúng cách:

```shell
Kếp
Kếp
Kếp
```

Dòng tiếp theo:

```shell
exe "keepj norm! 0\<c-v>G$h\"ad"
```

Dòng này chạy lệnh chế độ bình thường để đi đến đầu dòng (`0`), sử dụng chế độ hình ảnh khối để đi đến dòng cuối cùng và ký tự cuối cùng trên dòng đó (`<c-v>G$`). `h` là để điều chỉnh con trỏ (khi làm `$` Vim di chuyển một dòng thêm sang bên phải). Cuối cùng, bạn xóa văn bản đã được làm nổi bật và lưu trữ nó trong thanh ghi a (`"ad`).

Dòng tiếp theo:

```shell
exe "keepj " . l:startLine
```

Bạn di chuyển con trỏ của bạn trở lại nơi `startLine` đã ở.

Tiếp theo:

```shell
exe "sil! keepj norm! " . l:startCol . "\<bar>\"aP"
```

Ở vị trí `startLine`, bạn bây giờ nhảy đến cột được đánh dấu bởi `startCol`. `\<bar>\` là chuyển động thanh `|`. Chuyển động thanh trong Vim di chuyển con trỏ của bạn đến cột thứ n (giả sử `startCol` là 4. Chạy `4|` sẽ làm cho con trỏ của bạn nhảy đến vị trí cột 4). Nhớ rằng bạn đã lưu `startCol` là vị trí nơi bạn đã lưu trữ vị trí cột của văn bản mà bạn muốn viết hoa. Cuối cùng, `"aP` dán các văn bản được lưu trữ trong thanh ghi a. Điều này đưa văn bản trở lại vị trí mà nó đã bị xóa trước đó.

Hãy xem 4 dòng tiếp theo:

```shell
exe "keepj " . l:lastLine
sil! keepj norm! "_dG
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

`exe "keepj " . l:lastLine` di chuyển con trỏ của bạn trở lại vị trí `lastLine` từ trước. `sil! keepj norm! "_dG` xóa các khoảng trống bổ sung đã được tạo ra bằng cách sử dụng thanh ghi blackhole (`"_dG`) để thanh ghi không tên của bạn giữ sạch. `exe "keepj " . l:startLine` di chuyển con trỏ của bạn trở lại `startLine`. Cuối cùng, `exe "sil! keepj norm! " . l:startCol . "\<bar>"` di chuyển con trỏ của bạn đến cột `startCol`.

Đây là tất cả các hành động mà bạn có thể đã thực hiện thủ công trong Vim. Tuy nhiên, lợi ích của việc biến những hành động này thành các hàm tái sử dụng là chúng sẽ giúp bạn tránh việc chạy hơn 30 dòng lệnh mỗi khi bạn cần viết hoa bất kỳ điều gì. Điều cần nhớ ở đây là, bất cứ điều gì bạn có thể làm thủ công trong Vim, bạn có thể biến nó thành một hàm tái sử dụng, do đó là một plugin!

Đây là cách nó sẽ trông như thế nào.

Giả sử một số văn bản:

```shell
bánh kếp cho bữa sáng
bánh kếp cho bữa trưa
bánh kếp cho bữa tối

... một số văn bản
```

Đầu tiên, bạn làm nổi bật nó theo khối:

```shell
ban[kếp] cho bữa sáng
ban[kếp] cho bữa trưa
ban[kếp] cho bữa tối

... một số văn bản
```

Sau đó, bạn xóa nó và lưu trữ văn bản đó trong thanh ghi a:

```shell
ban cho bữa sáng
ban cho bữa trưa
ban cho bữa tối

... một số văn bản
```

Sau đó, bạn dán nó ở cuối tệp:

```shell
ban cho bữa sáng
ban cho bữa trưa
ban cho bữa tối

... một số văn bản
kếp
kếp
kếp
```

Sau đó, bạn viết hoa nó:

```shell
ban cho bữa sáng
ban cho bữa trưa
ban cho bữa tối

... một số văn bản
Kếp
Kếp
Kếp
```

Cuối cùng, bạn đặt văn bản đã viết hoa trở lại:

```shell
banKếp cho bữa sáng
banKếp cho bữa trưa
banKếp cho bữa tối

... một số văn bản
```

## Xử Lý Các Hoạt Động Dòng và Ký Tự

Bạn vẫn chưa xong. Bạn chỉ mới giải quyết trường hợp đặc biệt khi bạn chạy `gt` trên các văn bản khối. Bạn vẫn cần xử lý các hoạt động 'dòng' và 'ký tự'. Hãy xem mã `else` để xem cách thực hiện điều này.

Dưới đây là các mã:

```shell
if a:type ==# "block"
  # ... 
else
  let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
  let l:titlecased = s:capitalizeFirstWord(l:titlecased)
  call setreg('"', l:titlecased)
  let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
  silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
  exe "keepj " . l:startLine
  exe "sil! keepj norm! " . l:startCol . "\<bar>"
endif
```

Hãy cùng đi qua chúng theo dòng. Bí quyết của plugin này thực sự nằm ở dòng này:

```shell
let l:titlecased = substitute(@@, l:WORD_PATTERN, l:UPCASE_REPLACEMENT, 'g')
```

`@@` chứa văn bản từ thanh ghi không tên để được viết hoa. `l:WORD_PATTERN` là mẫu từ khóa cá nhân. `l:UPCASE_REPLACEMENT` là lệnh gọi đến lệnh `capitalize()` (mà bạn sẽ thấy sau). Cờ `'g'` là cờ toàn cục chỉ định lệnh thay thế để thay thế tất cả các từ đã cho, không chỉ từ đầu tiên.

Dòng tiếp theo:

```shell
let l:titlecased = s:capitalizeFirstWord(l:titlecased)
```

Điều này đảm bảo rằng từ đầu tiên sẽ luôn được viết hoa. Nếu bạn có một cụm từ như "một quả táo mỗi ngày giữ cho bác sĩ xa", vì từ đầu tiên, "một", là một từ đặc biệt, lệnh thay thế của bạn sẽ không viết hoa nó. Bạn cần một phương pháp luôn viết hoa ký tự đầu tiên bất kể điều gì. Hàm này thực hiện điều đó (bạn sẽ thấy chi tiết hàm này sau). Kết quả của các phương pháp viết hoa này được lưu trữ trong biến cục bộ `l:titlecased`.

Dòng tiếp theo:

```shell
call setreg('"', l:titlecased)
```

Điều này đưa chuỗi đã viết hoa vào thanh ghi không tên (`"`).

Tiếp theo, hai dòng tiếp theo:

```shell
let l:subcommands = #{line: "'[V']p", char: "`[v`]p", block: "`[\<c-v>`]p"}
silent execute "noautocmd keepjumps normal! " .. get(l:subcommands, a:type, "")
```

Này, điều đó có vẻ quen thuộc! Bạn đã thấy một mẫu tương tự trước đây với `l:commands`. Thay vì sao chép, ở đây bạn sử dụng dán (`p`). Hãy kiểm tra phần trước đó nơi tôi đã đi qua `l:commands` để làm mới trí nhớ.

Cuối cùng, hai dòng này:

```shell
exe "keepj " . l:startLine
exe "sil! keepj norm! " . l:startCol . "\<bar>"
```

Bạn đang di chuyển con trỏ của bạn trở lại dòng và cột nơi bạn bắt đầu. Đó là tất cả!

Hãy tóm tắt lại. Phương pháp thay thế ở trên đủ thông minh để viết hoa các văn bản đã cho và bỏ qua các từ đặc biệt (thêm chi tiết về điều này sau). Sau khi bạn có một chuỗi đã viết hoa, bạn lưu trữ chúng trong thanh ghi không tên. Sau đó, bạn làm nổi bật chính xác cùng một văn bản mà bạn đã thực hiện `g@` trước đó, sau đó dán từ thanh ghi không tên (điều này thực sự thay thế các văn bản không được viết hoa bằng phiên bản đã viết hoa). Cuối cùng, bạn di chuyển con trỏ của bạn trở lại nơi bạn bắt đầu.
## Dọn Dẹp

Bạn đã hoàn thành về mặt kỹ thuật. Các văn bản giờ đã được viết hoa tiêu đề. Tất cả những gì còn lại là khôi phục các thanh ghi và cài đặt.

```shell
call setreg('"', l:reg_save)
call setpos("'<", l:visual_marks_save[0])
call setpos("'>", l:visual_marks_save[1])
let &clipboard = l:cb_save
let &selection = l:sel_save
```

Những điều này khôi phục:
- thanh ghi không tên.
- các dấu `<` và `>`.
- các tùy chọn `'clipboard'` và `'selection'`.

Ôi, bạn đã xong. Đó là một hàm dài. Tôi có thể đã làm cho hàm ngắn hơn bằng cách chia nó thành các hàm nhỏ hơn, nhưng bây giờ, điều đó sẽ phải đủ. Bây giờ hãy cùng điểm qua các hàm viết hoa.

## Hàm Viết Hoa

Trong phần này, hãy cùng xem qua hàm `s:capitalize()`. Đây là hình dạng của hàm:

```shell
function! s:capitalize(string)
    if(toupper(a:string) ==# a:string && a:string != 'A')
        return a:string
    endif

    let l:str = tolower(a:string)
    let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
    if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
      return l:str
    endif

    return toupper(l:str[0]) . l:str[1:]
endfunction
```

Hãy nhớ rằng tham số cho hàm `capitalize()`, `a:string`, là từ riêng lẻ được truyền qua toán tử `g@`. Vì vậy, nếu tôi đang chạy `gt` trên văn bản "pancake for breakfast", `ToTitle` sẽ gọi `capitalize(string)` *ba* lần, một lần cho "pancake", một lần cho "for", và một lần cho "breakfast".

Phần đầu tiên của hàm là:

```shell
if(toupper(a:string) ==# a:string && a:string != 'A')
  return a:string
endif
```

Điều kiện đầu tiên (`toupper(a:string) ==# a:string`) kiểm tra xem phiên bản viết hoa của tham số có giống như chuỗi không và liệu chuỗi đó có phải là "A" không. Nếu điều này đúng, thì trả về chuỗi đó. Điều này dựa trên giả định rằng nếu một từ đã được viết hoa hoàn toàn, thì đó là một từ viết tắt. Ví dụ, từ "CEO" sẽ bị chuyển thành "Ceo". Hmm, giám đốc điều hành của bạn sẽ không vui đâu. Vì vậy, tốt nhất là để lại bất kỳ từ nào đã được viết hoa hoàn toàn. Điều kiện thứ hai, `a:string != 'A'`, giải quyết một trường hợp đặc biệt cho ký tự "A" viết hoa. Nếu `a:string` đã là một "A" viết hoa, nó sẽ vô tình vượt qua bài kiểm tra `toupper(a:string) ==# a:string`. Bởi vì "a" là một mạo từ không xác định trong tiếng Anh, nó cần phải được viết thường.

Phần tiếp theo buộc chuỗi phải được viết thường:

```shell
let l:str = tolower(a:string)
```

Phần tiếp theo là một regex của danh sách tất cả các từ loại trừ. Tôi đã lấy chúng từ https://titlecaseconverter.com/rules/ :

```shell
let l:exclusions = '^\(a\|an\|and\|at\|but\|by\|en\|for\|in\|nor\|of\|off\|on\|or\|out\|per\|so\|the\|to\|up\|yet\|v\.?\|vs\.?\|via\)$'
```

Phần tiếp theo:

```shell
if (match(l:str, l:exclusions) >= 0) || (index(s:local_exclusion_list, l:str) >= 0)
  return l:str
endif
```

Đầu tiên, kiểm tra xem chuỗi của bạn có nằm trong danh sách từ loại trừ (`l:exclusions`) không. Nếu có, đừng viết hoa nó. Sau đó kiểm tra xem chuỗi của bạn có nằm trong danh sách loại trừ cục bộ (`s:local_exclusion_list`) không. Danh sách loại trừ này là một danh sách tùy chỉnh mà người dùng có thể thêm vào vimrc (trong trường hợp người dùng có yêu cầu bổ sung cho các từ đặc biệt).

Phần cuối cùng trả về phiên bản viết hoa của từ. Ký tự đầu tiên được viết hoa trong khi phần còn lại giữ nguyên.

```shell
return toupper(l:str[0]) . l:str[1:]
```

Hãy cùng xem qua hàm viết hoa thứ hai. Hàm trông như thế này:

```shell
function! s:capitalizeFirstWord(string)
  if (a:string =~ "\n")
    let l:lineArr = trim(a:string)->split('\n')
    let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
    return l:lineArr->join("\n")
  endif
  return toupper(a:string[0]) . a:string[1:]
endfunction
```

Hàm này được tạo ra để xử lý một trường hợp đặc biệt nếu bạn có một câu bắt đầu bằng một từ loại trừ, như "an apple a day keeps the doctor away". Dựa trên quy tắc viết hoa của tiếng Anh, tất cả các từ đầu tiên trong một câu, bất kể đó có phải là từ đặc biệt hay không, đều phải được viết hoa. Với lệnh `substitute()` của bạn một mình, "an" trong câu của bạn sẽ được viết thường. Bạn cần phải buộc ký tự đầu tiên được viết hoa.

Trong hàm `capitalizeFirstWord` này, tham số `a:string` không phải là một từ riêng lẻ như `a:string` bên trong hàm `capitalize`, mà là toàn bộ văn bản. Vì vậy, nếu bạn có "pancake for breakfast", giá trị của `a:string` là "pancake for breakfast". Nó chỉ chạy `capitalizeFirstWord` một lần cho toàn bộ văn bản.

Một kịch bản bạn cần phải chú ý là nếu bạn có một chuỗi nhiều dòng như `"an apple a day\nkeeps the doctor away"`. Bạn muốn viết hoa ký tự đầu tiên của tất cả các dòng. Nếu bạn không có dòng mới, thì chỉ cần viết hoa ký tự đầu tiên.

```shell
return toupper(a:string[0]) . a:string[1:]
```

Nếu bạn có các dòng mới, bạn cần viết hoa tất cả các ký tự đầu tiên trong mỗi dòng, vì vậy bạn chia chúng thành một mảng được phân tách bởi các dòng mới:

```shell
let l:lineArr = trim(a:string)->split('\n')
```

Sau đó, bạn ánh xạ từng phần tử trong mảng và viết hoa từ đầu tiên của mỗi phần tử:

```shell
let l:lineArr = map(l:lineArr, 'toupper(v:val[0]) . v:val[1:]')
```

Cuối cùng, bạn ghép các phần tử của mảng lại với nhau:

```shell
return l:lineArr->join("\n")
```

Và bạn đã xong!

## Tài Liệu

Thư mục thứ hai trong kho lưu trữ là thư mục `docs/`. Việc cung cấp cho plugin một tài liệu đầy đủ là rất tốt. Trong phần này, tôi sẽ điểm qua cách tạo tài liệu cho plugin của riêng bạn.

Thư mục `docs/` là một trong những đường dẫn thời gian chạy đặc biệt của Vim. Vim đọc tất cả các tệp bên trong `docs/`, vì vậy khi bạn tìm kiếm một từ khóa đặc biệt và từ khóa đó được tìm thấy trong một trong các tệp trong thư mục `docs/`, nó sẽ hiển thị trên trang trợ giúp. Ở đây bạn có một tệp `totitle.txt`. Tôi đặt tên như vậy vì đó là tên plugin, nhưng bạn có thể đặt tên bất kỳ điều gì bạn muốn.

Một tệp tài liệu Vim về cơ bản là một tệp txt. Sự khác biệt giữa một tệp txt thông thường và một tệp trợ giúp Vim là tệp sau sử dụng các cú pháp "trợ giúp" đặc biệt. Nhưng trước tiên, bạn cần cho Vim biết để xử lý nó không phải là loại tệp văn bản, mà là loại tệp `help`. Để cho Vim hiểu rằng `totitle.txt` này là một tệp *trợ giúp*, hãy chạy `:set ft=help` (`:h 'filetype'` để biết thêm). Nhân tiện, nếu bạn muốn cho Vim hiểu rằng `totitle.txt` này là một tệp txt *thông thường*, hãy chạy `:set ft=txt`.

### Cú Pháp Đặc Biệt Của Tệp Trợ Giúp

Để làm cho một từ khóa có thể tìm thấy, hãy bao quanh từ khóa đó bằng dấu hoa thị. Để làm cho từ khóa `totitle` có thể tìm thấy khi người dùng tìm kiếm `:h totitle`, hãy viết nó là `*totitle*` trong tệp trợ giúp.

Ví dụ, tôi có những dòng này ở đầu mục lục của mình:

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

// thêm nội dung TOC
```

Lưu ý rằng tôi đã sử dụng hai từ khóa: `*totitle*` và `*totitle-toc*` để đánh dấu phần mục lục. Bạn có thể sử dụng bao nhiêu từ khóa tùy thích. Điều này có nghĩa là bất cứ khi nào bạn tìm kiếm `:h totitle` hoặc `:h totitle-toc`, Vim sẽ đưa bạn đến vị trí này.

Dưới đây là một ví dụ khác, ở đâu đó trong tệp:

```shell
2. Usage                                                       *totitle-usage*

// cách sử dụng
```

Nếu bạn tìm kiếm `:h totitle-usage`, Vim sẽ đưa bạn đến phần này.

Bạn cũng có thể sử dụng các liên kết nội bộ để tham chiếu đến một phần khác trong tệp trợ giúp bằng cách bao quanh một từ khóa bằng cú pháp dấu gạch đứng `|`. Trong phần TOC, bạn thấy các từ khóa được bao quanh bởi các dấu gạch đứng, như `|totitle-intro|`, `|totitle-usage|`, v.v.

```shell
TABLE OF CONTENTS                                     *totitle*  *totitle-toc*

    1. Intro ........................... |totitle-intro|
    2. Usage ........................... |totitle-usage|
    3. Words to capitalize ............. |totitle-words|
    4. Operator ........................ |totitle-operator|
    5. Key-binding ..................... |totitle-keybinding|
    6. Bugs ............................ |totitle-bug-report|
    7. Contributing .................... |totitle-contributing|
    8. Credits ......................... |totitle-credits|

```
Điều này cho phép bạn nhảy đến định nghĩa. Nếu bạn đặt con trỏ của mình ở đâu đó trên `|totitle-intro|` và nhấn `Ctrl-]`, Vim sẽ nhảy đến định nghĩa của từ đó. Trong trường hợp này, nó sẽ nhảy đến vị trí `*totitle-intro*`. Đây là cách bạn có thể liên kết đến các từ khóa khác nhau trong một tài liệu trợ giúp.

Không có cách viết đúng hay sai cho một tệp tài liệu trong Vim. Nếu bạn nhìn vào các plugin khác nhau của các tác giả khác nhau, nhiều người trong số họ sử dụng các định dạng khác nhau. Điểm quan trọng là tạo ra một tài liệu trợ giúp dễ hiểu cho người dùng của bạn.

Cuối cùng, nếu bạn đang viết plugin của riêng bạn tại chỗ và bạn muốn thử nghiệm trang tài liệu, chỉ cần thêm một tệp txt vào bên trong `~/.vim/docs/` sẽ không tự động làm cho các từ khóa của bạn có thể tìm kiếm được. Bạn cần hướng dẫn Vim thêm trang tài liệu của bạn. Chạy lệnh helptags: `:helptags ~/.vim/doc` để tạo các tệp thẻ mới. Bây giờ bạn có thể bắt đầu tìm kiếm các từ khóa của mình.

## Kết Luận

Bạn đã đến cuối! Chương này là sự tổng hợp của tất cả các chương Vimscript. Ở đây, bạn cuối cùng đã thực hành những gì bạn đã học cho đến nay. Hy vọng rằng sau khi đọc điều này, bạn không chỉ hiểu cách tạo các plugin Vim, mà còn được khuyến khích viết plugin của riêng bạn.

Mỗi khi bạn thấy mình lặp lại cùng một chuỗi hành động nhiều lần, bạn nên cố gắng tạo ra của riêng mình! Người ta đã nói rằng bạn không nên phát minh lại bánh xe. Tuy nhiên, tôi nghĩ rằng việc phát minh lại bánh xe vì mục đích học hỏi có thể có lợi. Đọc các plugin của người khác. Tái tạo chúng. Học hỏi từ chúng. Viết của riêng bạn! Ai biết, có thể bạn sẽ viết plugin tuyệt vời, siêu phổ biến tiếp theo sau khi đọc điều này. Có thể bạn sẽ trở thành Tim Pope huyền thoại tiếp theo. Khi điều đó xảy ra, hãy cho tôi biết!