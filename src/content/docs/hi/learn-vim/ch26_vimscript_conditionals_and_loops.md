---
description: इस दस्तावेज़ में आप Vimscript डेटा प्रकारों का उपयोग करके शर्तों और लूप्स
  को लिखना सीखेंगे, साथ ही संबंधी ऑपरेटरों की जानकारी मिलेगी।
title: Ch26. Vimscript Conditionals and Loops
---

बुनियादी डेटा प्रकारों के बारे में जानने के बाद, अगला कदम उन्हें एक साथ मिलाकर एक बुनियादी प्रोग्राम लिखना सीखना है। एक बुनियादी प्रोग्राम में शर्तें और लूप होते हैं।

इस अध्याय में, आप शर्तें और लूप लिखने के लिए Vimscript डेटा प्रकारों का उपयोग करना सीखेंगे।

## संबंधी ऑपरेटर

Vimscript संबंधी ऑपरेटर कई प्रोग्रामिंग भाषाओं के समान हैं:

```shell
a == b		equal to
a != b		not equal to
a >  b		greater than
a >= b		greater than or equal to
a <  b		less than
a <= b		less than or equal to
```

उदाहरण के लिए:

```shell
:echo 5 == 5
:echo 5 != 5
:echo 10 > 5
:echo 10 >= 5
:echo 10 < 5
:echo 5 <= 5
```

याद रखें कि स्ट्रिंग्स को अंक में परिवर्तित किया जाता है एक अंकगणितीय अभिव्यक्ति में। यहां Vim भी समानता अभिव्यक्ति में स्ट्रिंग्स को अंकों में परिवर्तित करता है। "5foo" को 5 (सत्य) में परिवर्तित किया गया है:

```shell
:echo 5 == "5foo"
" returns true
```

यह भी याद रखें कि यदि आप एक स्ट्रिंग को एक गैर-आंकिक वर्ण से शुरू करते हैं जैसे "foo5", तो स्ट्रिंग को संख्या 0 (असत्य) में परिवर्तित किया जाता है।

```shell
echo 5 == "foo5"
" returns false
```

### स्ट्रिंग लॉजिक ऑपरेटर

Vim में स्ट्रिंग्स की तुलना के लिए अधिक संबंधी ऑपरेटर हैं:

```shell
a =~ b
a !~ b
```

उदाहरण के लिए:

```shell
let str = "hearty breakfast"

echo str =~ "hearty"
" returns true

echo str =~ "dinner"
" returns false

echo str !~ "dinner"
" returns true
```

`=~` ऑपरेटर दिए गए स्ट्रिंग के खिलाफ एक regex मिलान करता है। ऊपर के उदाहरण में, `str =~ "hearty"` सत्य लौटाता है क्योंकि `str` *में* "hearty" पैटर्न है। आप हमेशा `==` और `!=` का उपयोग कर सकते हैं, लेकिन उनका उपयोग करने से अभिव्यक्ति पूरी स्ट्रिंग के खिलाफ तुलना की जाएगी। `=~` और `!~` अधिक लचीले विकल्प हैं।

```shell
echo str == "hearty"
" returns false

echo str == "hearty breakfast"
" returns true
```

आइए इसे आजमाते हैं। बड़े "H" पर ध्यान दें:

```shell
echo str =~ "Hearty"
" true
```

यह सत्य लौटाता है भले ही "Hearty" बड़े अक्षर में हो। दिलचस्प... यह पता चलता है कि मेरी Vim सेटिंग केस को अनदेखा करने के लिए सेट की गई है (`set ignorecase`), इसलिए जब Vim समानता की जांच करता है, तो यह मेरी Vim सेटिंग का उपयोग करता है और केस को अनदेखा करता है। यदि मैं केस को अनदेखा करना बंद कर दूं (`set noignorecase`), तो तुलना अब असत्य लौटाती है।

```shell
set noignorecase
echo str =~ "Hearty"
" returns false because case matters

set ignorecase
echo str =~ "Hearty"
" returns true because case doesn't matter
```

यदि आप दूसरों के लिए एक प्लगइन लिख रहे हैं, तो यह एक पेचीदा स्थिति है। क्या उपयोगकर्ता `ignorecase` या `noignorecase` का उपयोग करता है? आप निश्चित रूप से अपने उपयोगकर्ताओं को उनके केस विकल्प को बदलने के लिए मजबूर नहीं करना चाहते हैं। तो आप क्या करते हैं?

सौभाग्य से, Vim में एक ऑपरेटर है जो *हमेशा* केस को अनदेखा या मेल कर सकता है। हमेशा केस से मेल खाने के लिए, अंत में `#` जोड़ें।

```shell
set ignorecase
echo str =~# "hearty"
" returns true

echo str =~# "HearTY"
" returns false

set noignorecase
echo str =~# "hearty"
" true

echo str =~# "HearTY"
" false

echo str !~# "HearTY"
" true
```

तुलना करते समय हमेशा केस को अनदेखा करने के लिए, इसे `?` के साथ जोड़ें:

```shell
set ignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

set noignorecase
echo str =~? "hearty"
" true

echo str =~? "HearTY"
" true

echo str !~? "HearTY"
" false
```

मैं हमेशा केस से मेल खाने के लिए `#` का उपयोग करना पसंद करता हूं और सुरक्षित रहने के लिए।

## यदि

अब जब आपने Vim की समानता अभिव्यक्तियों को देखा है, तो आइए एक मौलिक शर्तीय ऑपरेटर, `if` कथन पर चर्चा करें।

न्यूनतम, वाक्यविन्यास है:

```shell
if {clause}
  {some expression}
endif
```

आप `elseif` और `else` के साथ केस विश्लेषण को बढ़ा सकते हैं।

```shell
if {predicate1}
  {expression1}
elseif {predicate2}
  {expression2}
elseif {predicate3}
  {expression3}
else
  {expression4}
endif
```

उदाहरण के लिए, प्लगइन [vim-signify](https://github.com/mhinz/vim-signify) आपके Vim सेटिंग्स के आधार पर एक अलग स्थापना विधि का उपयोग करता है। नीचे उनके `readme` से स्थापना निर्देश है, `if` कथन का उपयोग करते हुए:

```shell
if has('nvim') || has('patch-8.0.902')
  Plug 'mhinz/vim-signify'
else
  Plug 'mhinz/vim-signify', { 'branch': 'legacy' }
endif
```

## टर्नरी अभिव्यक्ति

Vim में एक टर्नरी अभिव्यक्ति है जो एक-लाइनर केस विश्लेषण के लिए है:

```shell
{predicate} ? expressiontrue : expressionfalse
```

उदाहरण के लिए:

```shell
echo 1 ? "I am true" : "I am false"
```

चूंकि 1 सत्य है, Vim "I am true" को इको करता है। मान लीजिए कि आप शर्तीय रूप से `background` को गहरा सेट करना चाहते हैं यदि आप एक निश्चित घंटे के बाद Vim का उपयोग कर रहे हैं। इसे vimrc में जोड़ें:

```shell
let &background = strftime("%H") < 18 ? "light" : "dark"
```

`&background` Vim में `'background'` विकल्प है। `strftime("%H")` वर्तमान समय को घंटों में लौटाता है। यदि यह अभी तक शाम 6 बजे नहीं है, तो हल्का बैकग्राउंड का उपयोग करें। अन्यथा, गहरे बैकग्राउंड का उपयोग करें।

## या

तार्किक "या" (`||`) कई प्रोग्रामिंग भाषाओं की तरह काम करता है।

```shell
{Falsy expression}  || {Falsy expression}   false
{Falsy expression}  || {Truthy expression}  true
{Truthy expression} || {Falsy expression}   true
{Truthy expression} || {Truthy expression}  true
```

Vim अभिव्यक्ति का मूल्यांकन करता है और या तो 1 (सत्य) या 0 (असत्य) लौटाता है।

```shell
echo 5 || 0
" returns 1

echo 5 || 5
" returns 1

echo 0 || 0
" returns 0

echo "foo5" || "foo5"
" returns 0

echo "5foo" || "foo5"
" returns 1
```

यदि वर्तमान अभिव्यक्ति सत्य के रूप में मूल्यांकित होती है, तो अगली अभिव्यक्ति का मूल्यांकन नहीं किया जाएगा।

```shell
let one_dozen = 12

echo one_dozen || two_dozen
" returns 1

echo two_dozen || one_dozen
" returns error
```

ध्यान दें कि `two_dozen` कभी परिभाषित नहीं होता है। अभिव्यक्ति `one_dozen || two_dozen` कोई त्रुटि नहीं फेंकती है क्योंकि `one_dozen` पहले मूल्यांकित होता है और सत्य पाया जाता है, इसलिए Vim `two_dozen` का मूल्यांकन नहीं करता है।

## और

तार्किक "और" (`&&`) तार्किक या का पूरक है।

```shell
{Falsy Expression}  && {Falsy Expression}   false
{Falsy expression}  && {Truthy expression}  false
{Truthy Expression} && {Falsy Expression}   false
{Truthy expression} && {Truthy expression}  true
```

उदाहरण के लिए:

```shell
echo 0 && 0
" returns 0

echo 0 && 10
" returns 0
```

`&&` एक अभिव्यक्ति का मूल्यांकन करता है जब तक कि यह पहले असत्य अभिव्यक्ति को नहीं देखता। उदाहरण के लिए, यदि आपके पास `true && true` है, तो यह दोनों का मूल्यांकन करेगा और `true` लौटाएगा। यदि आपके पास `true && false && true` है, तो यह पहले `true` का मूल्यांकन करेगा और पहले `false` पर रुक जाएगा। यह तीसरे `true` का मूल्यांकन नहीं करेगा।

```shell
let one_dozen = 12
echo one_dozen && 10
" returns 1

echo one_dozen && v:false
" returns 0

echo one_dozen && two_dozen
" returns error

echo exists("one_dozen") && one_dozen == 12
" returns 1
```

## के लिए

`for` लूप आमतौर पर सूची डेटा प्रकार के साथ उपयोग किया जाता है।

```shell
let breakfasts = ["pancakes", "waffles", "eggs"]

for breakfast in breakfasts
  echo breakfast
endfor
```

यह नेस्टेड सूची के साथ काम करता है:

```shell
let meals = [["breakfast", "pancakes"], ["lunch", "fish"], ["dinner", "pasta"]]

for [meal_type, food] in meals
  echo "I am having " . food . " for " . meal_type
endfor
```

आप तकनीकी रूप से `keys()` विधि का उपयोग करके एक शब्दकोश के साथ `for` लूप का उपयोग कर सकते हैं।

```shell
let beverages = #{breakfast: "milk", lunch: "orange juice", dinner: "water"}
for beverage_type in keys(beverages)
  echo "I am drinking " . beverages[beverage_type] . " for " . beverage_type
endfor
```

## जबकि

एक अन्य सामान्य लूप `while` लूप है।

```shell
let counter = 1
while counter < 5
  echo "Counter is: " . counter
  let counter += 1
endwhile
```

वर्तमान पंक्ति से अंतिम पंक्ति तक की सामग्री प्राप्त करने के लिए:

```shell
let current_line = line(".")
let last_line = line("$")

while current_line <= last_line
  echo getline(current_line)
  let current_line += 1
endwhile
```

## त्रुटि प्रबंधन

अक्सर आपका प्रोग्राम उस तरह से नहीं चलता जैसा आप अपेक्षा करते हैं। परिणामस्वरूप, यह आपको एक लूप में डाल देता है (शब्द खेल के लिए)। आपको एक उचित त्रुटि प्रबंधन की आवश्यकता है।

### ब्रेक

जब आप `while` या `for` लूप के अंदर `break` का उपयोग करते हैं, तो यह लूप को रोक देता है।

फाइल की शुरुआत से लेकर वर्तमान पंक्ति तक के टेक्स्ट प्राप्त करने के लिए, लेकिन जब आप "donut" शब्द देखते हैं तो रुकें:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    break
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

यदि आपके पास टेक्स्ट है:

```shell
one
two
three
donut
four
five
```

उपरोक्त `while` लूप चलाने पर "one two three" मिलता है और बाकी टेक्स्ट नहीं क्योंकि लूप "donut" से मेल खाने पर ब्रेक होता है।

### जारी रखें

`continue` विधि `break` के समान है, जहां इसे एक लूप के दौरान लागू किया जाता है। अंतर यह है कि लूप से बाहर निकलने के बजाय, यह केवल उस वर्तमान पुनरावृत्ति को छोड़ देता है।

मान लीजिए कि आपके पास वही टेक्स्ट है लेकिन `break` के बजाय, आप `continue` का उपयोग करते हैं:

```shell
let line = 0
let last_line = line("$")
let total_word = ""

while line <= last_line
  let line += 1
  let line_text = getline(line)
  if line_text =~# "donut"
    continue
  endif
  echo line_text
  let total_word .= line_text . " "
endwhile

echo total_word
```

इस बार यह `one two three four five` लौटाता है। यह "donut" वाले पंक्ति को छोड़ देता है, लेकिन लूप जारी रहता है।
### कोशिश, अंततः, और पकड़ें

Vim में त्रुटियों को संभालने के लिए `try`, `finally`, और `catch` होता है। एक त्रुटि का अनुकरण करने के लिए, आप `throw` कमांड का उपयोग कर सकते हैं।

```shell
try
  echo "कोशिश करें"
  throw "नहीं"
endtry
```

इसे चलाएँ। Vim `"Exception not caught: Nope` त्रुटि के साथ शिकायत करेगा।

अब एक पकड़ने का ब्लॉक जोड़ें:

```shell
try
  echo "कोशिश करें"
  throw "नहीं"
catch
  echo "पकड़ लिया"
endtry
```

अब कोई त्रुटि नहीं है। आपको "कोशिश करें" और "पकड़ लिया" प्रदर्शित होना चाहिए।

आइए `catch` को हटा दें और एक `finally` जोड़ें:

```shell
try
  echo "कोशिश करें"
  throw "नहीं"
  echo "आप मुझे नहीं देखेंगे"
finally
  echo "आखिरकार"
endtry
```

इसे चलाएँ। अब Vim त्रुटि और "आखिरकार" प्रदर्शित करता है।

आइए सभी को एक साथ रखें:

```shell
try
  echo "कोशिश करें"
  throw "नहीं"
catch
  echo "पकड़ लिया"
finally
  echo "आखिरकार"
endtry
```

इस बार Vim "पकड़ लिया" और "आखिरकार" दोनों प्रदर्शित करता है। कोई त्रुटि प्रदर्शित नहीं होती क्योंकि Vim ने इसे पकड़ लिया।

त्रुटियाँ विभिन्न स्थानों से आती हैं। त्रुटि का एक और स्रोत एक गैर-मौजूद फ़ंक्शन को कॉल करना है, जैसे `Nope()` नीचे:

```shell
try
  echo "कोशिश करें"
  call Nope()
catch
  echo "पकड़ लिया"
finally
  echo "आखिरकार"
endtry
```

`catch` और `finally` के बीच का अंतर यह है कि `finally` हमेशा चलता है, त्रुटि हो या न हो, जबकि एक पकड़ केवल तब चलती है जब आपका कोड एक त्रुटि प्राप्त करता है।

आप `:catch` के साथ विशिष्ट त्रुटियों को पकड़ सकते हैं। `:h :catch` के अनुसार:

```shell
catch /^Vim:Interrupt$/.             " इंटरप्ट को पकड़ें (CTRL-C)
catch /^Vim\\%((\\a\\+)\\)\\=:E/.    " सभी Vim त्रुटियों को पकड़ें
catch /^Vim\\%((\\a\\+)\\)\\=:/.     " त्रुटियों और इंटरप्ट को पकड़ें
catch /^Vim(write):/.                " :write में सभी त्रुटियों को पकड़ें
catch /^Vim\\%((\\a\\+)\\)\\=:E123:/ " त्रुटि E123 को पकड़ें
catch /my-exception/.                " उपयोगकर्ता त्रुटि को पकड़ें
catch /.*/                           " सब कुछ पकड़ें
catch.                               " /.*/ के समान
```

एक `try` ब्लॉक के अंदर, एक इंटरप्ट को पकड़ने योग्य त्रुटि माना जाता है।

```shell
try
  catch /^Vim:Interrupt$/
  sleep 100
endtry
```

आपके vimrc में, यदि आप एक कस्टम रंग योजना का उपयोग करते हैं, जैसे [gruvbox](https://github.com/morhetz/gruvbox), और आप गलती से रंग योजना निर्देशिका को हटा देते हैं लेकिन फिर भी आपके vimrc में `colorscheme gruvbox` लाइन है, तो Vim जब आप इसे `source` करते हैं तो त्रुटि फेंकेगा। इसे ठीक करने के लिए, मैंने अपने vimrc में यह जोड़ा:

```shell
try
  colorscheme gruvbox
catch
  colorscheme default
endtry
```

अब यदि आप `gruvbox` निर्देशिका के बिना vimrc को `source` करते हैं, तो Vim `colorscheme default` का उपयोग करेगा।

## स्मार्ट तरीके से शर्तें सीखें

पिछले अध्याय में, आपने Vim के मूल डेटा प्रकारों के बारे में सीखा। इस अध्याय में, आपने शर्तों और लूप का उपयोग करके मूल कार्यक्रम लिखने के लिए उन्हें संयोजित करना सीखा। ये प्रोग्रामिंग के निर्माण खंड हैं।

अगले, आइए हम चर के दायरे के बारे में सीखें।