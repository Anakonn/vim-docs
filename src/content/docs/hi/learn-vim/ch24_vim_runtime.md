---
description: इस दस्तावेज़ में, Vim के रनटाइम पथों का उच्च-स्तरीय अवलोकन प्रस्तुत किया
  गया है, जो उपयोगकर्ताओं को कस्टमाइज़ेशन में मदद करता है।
title: Ch24. Vim Runtime
---

पिछले अध्यायों में, मैंने उल्लेख किया था कि Vim स्वचालित रूप से `~/.vim/` निर्देशिका के अंदर विशेष पथों जैसे `pack/` (अध्याय 22) और `compiler/` (अध्याय 19) की खोज करता है। ये Vim रनटाइम पथों के उदाहरण हैं।

Vim के पास इन दो पथों से अधिक रनटाइम पथ हैं। इस अध्याय में, आप इन रनटाइम पथों का एक उच्च-स्तरीय अवलोकन सीखेंगे। इस अध्याय का उद्देश्य आपको यह दिखाना है कि ये कब कॉल होते हैं। इसे जानने से आप Vim को और अधिक समझने और अनुकूलित करने में सक्षम होंगे।

## रनटाइम पथ

एक Unix मशीन में, आपके Vim रनटाइम पथों में से एक `$HOME/.vim/` है (यदि आपके पास Windows जैसे अलग OS है, तो आपका पथ अलग हो सकता है)। विभिन्न OS के लिए रनटाइम पथ देखने के लिए, `:h 'runtimepath'` देखें। इस अध्याय में, मैं `~/.vim/` को डिफ़ॉल्ट रनटाइम पथ के रूप में उपयोग करूंगा।

## प्लगइन स्क्रिप्ट्स

Vim के पास एक प्लगइन रनटाइम पथ है जो इस निर्देशिका में किसी भी स्क्रिप्ट को हर बार Vim शुरू होने पर एक बार निष्पादित करता है। "प्लगइन" नाम को Vim के बाहरी प्लगइनों (जैसे NERDTree, fzf.vim, आदि) के साथ भ्रमित न करें।

`~/.vim/` निर्देशिका में जाएं और एक `plugin/` निर्देशिका बनाएं। दो फ़ाइलें बनाएं: `donut.vim` और `chocolate.vim`।

`~/.vim/plugin/donut.vim` के अंदर:

```shell
echo "donut!"
```

`~/.vim/plugin/chocolate.vim` के अंदर:

```shell
echo "chocolate!"
```

अब Vim बंद करें। अगली बार जब आप Vim शुरू करेंगे, तो आप दोनों `"donut!"` और `"chocolate!"` को इको करते हुए देखेंगे। प्लगइन रनटाइम पथ का उपयोग प्रारंभिककरण स्क्रिप्ट के लिए किया जा सकता है।

## फ़ाइल प्रकार पहचान

शुरू करने से पहले, यह सुनिश्चित करने के लिए कि ये पहचानें काम करती हैं, सुनिश्चित करें कि आपकी vimrc में कम से कम निम्नलिखित पंक्ति है:

```shell
filetype plugin indent on
```

अधिक संदर्भ के लिए `:h filetype-overview` देखें। मूल रूप से, यह Vim की फ़ाइल प्रकार पहचान को चालू करता है।

जब आप एक नई फ़ाइल खोलते हैं, तो Vim आमतौर पर जानता है कि यह किस प्रकार की फ़ाइल है। यदि आपके पास एक फ़ाइल `hello.rb` है, तो `:set filetype?` चलाने पर सही प्रतिक्रिया `filetype=ruby` लौटती है।

Vim "सामान्य" फ़ाइल प्रकार (Ruby, Python, Javascript, आदि) का पता लगाने के लिए जानता है। लेकिन अगर आपके पास एक कस्टम फ़ाइल है? आपको Vim को इसे पहचानने और सही फ़ाइल प्रकार सौंपने के लिए सिखाना होगा।

पहचान के दो तरीके हैं: फ़ाइल नाम का उपयोग करना और फ़ाइल सामग्री का उपयोग करना।

### फ़ाइल नाम पहचान

फ़ाइल नाम पहचान एक फ़ाइल प्रकार का पता लगाने के लिए उस फ़ाइल के नाम का उपयोग करती है। जब आप `hello.rb` फ़ाइल खोलते हैं, तो Vim जानता है कि यह `.rb` एक्सटेंशन से एक Ruby फ़ाइल है।

आप फ़ाइल नाम पहचान करने के लिए दो तरीके अपना सकते हैं: `ftdetect/` रनटाइम निर्देशिका का उपयोग करना और `filetype.vim` रनटाइम फ़ाइल का उपयोग करना। आइए दोनों का अन्वेषण करें।

#### `ftdetect/`

आइए एक अस्पष्ट (फिर भी स्वादिष्ट) फ़ाइल बनाते हैं, `hello.chocodonut`। जब आप इसे खोलते हैं और `:set filetype?` चलाते हैं, तो चूंकि यह एक सामान्य फ़ाइल नाम एक्सटेंशन नहीं है, Vim नहीं जानता कि इसे क्या बनाना है। यह `filetype=` लौटाता है।

आपको Vim को निर्देशित करना होगा कि सभी फ़ाइलें जो `.chocodonut` पर समाप्त होती हैं, उन्हें "chocodonut" फ़ाइल प्रकार के रूप में सेट करें। रनटाइम रूट (`~/.vim/`) में `ftdetect/` नामक एक निर्देशिका बनाएं। इसके अंदर, एक फ़ाइल बनाएं और इसका नाम `chocodonut.vim` रखें (`~/.vim/ftdetect/chocodonut.vim`)। इस फ़ाइल के अंदर, जोड़ें:

```shell
autocmd BufNewFile,BufRead *.chocodonut set filetype=chocodonut
```

`BufNewFile` और `BufRead` तब सक्रिय होते हैं जब आप एक नया बफर बनाते हैं और एक नया बफर खोलते हैं। `*.chocodonut` का अर्थ है कि यह घटना केवल तब सक्रिय होगी जब खोला गया बफर `.chocodonut` फ़ाइल नाम एक्सटेंशन के साथ हो। अंत में, `set filetype=chocodonut` कमांड फ़ाइल प्रकार को chocodonut प्रकार के रूप में सेट करता है।

Vim को पुनः प्रारंभ करें। अब `hello.chocodonut` फ़ाइल खोलें और `:set filetype?` चलाएं। यह `filetype=chocodonut` लौटाता है।

स्वादिष्ट! आप `ftdetect/` के अंदर जितनी चाहें फ़ाइलें रख सकते हैं। भविष्य में, यदि आप कभी अपने डोनट फ़ाइल प्रकार का विस्तार करने का निर्णय लेते हैं, तो आप शायद `ftdetect/strawberrydonut.vim`, `ftdetect/plaindonut.vim`, आदि जोड़ सकते हैं।

वास्तव में, Vim में फ़ाइल प्रकार सेट करने के दो तरीके हैं। एक है जो आपने अभी उपयोग किया `set filetype=chocodonut`। दूसरा तरीका है `setfiletype chocodonut` चलाना। पहला कमांड `set filetype=chocodonut` हमेशा फ़ाइल प्रकार को chocodonut प्रकार पर सेट करेगा, जबकि दूसरा कमांड `setfiletype chocodonut` केवल फ़ाइल प्रकार को सेट करेगा यदि अभी तक कोई फ़ाइल प्रकार सेट नहीं किया गया है।

#### फ़ाइल प्रकार फ़ाइल

दूसरा फ़ाइल पहचान विधि आपको रूट निर्देशिका (`~/.vim/filetype.vim`) में एक `filetype.vim` बनाने की आवश्यकता है। इसके अंदर यह जोड़ें:

```shell
autocmd BufNewFile,BufRead *.plaindonut set filetype=plaindonut
```

एक `hello.plaindonut` फ़ाइल बनाएं। जब आप इसे खोलते हैं और `:set filetype?` चलाते हैं, तो Vim सही कस्टम फ़ाइल प्रकार `filetype=plaindonut` प्रदर्शित करता है।

हे भगवान, यह काम करता है! वैसे, यदि आप `filetype.vim` के साथ खेलते हैं, तो आप देख सकते हैं कि यह फ़ाइल `hello.plaindonut` खोलने पर कई बार चल रही है। इसे रोकने के लिए, आप एक गार्ड जोड़ सकते हैं ताकि मुख्य स्क्रिप्ट केवल एक बार चले। `filetype.vim` को अपडेट करें:

```shell
if exists("did_load_filetypes")
  finish
endif

augroup donutfiletypedetection
  autocmd! BufRead,BufNewFile *.plaindonut setfiletype plaindonut
augroup END
```

`finish` एक Vim कमांड है जो स्क्रिप्ट के बाकी हिस्से को चलाने से रोकता है। `"did_load_filetypes"` अभिव्यक्ति एक अंतर्निहित Vim फ़ंक्शन नहीं है। यह वास्तव में `$VIMRUNTIME/filetype.vim` के अंदर एक वैश्विक चर है। यदि आप जिज्ञासु हैं, तो `:e $VIMRUNTIME/filetype.vim` चलाएं। आप इन पंक्तियों को अंदर पाएंगे:

```shell
if exists("did_load_filetypes")
  finish
endif

let did_load_filetypes = 1
```

जब Vim इस फ़ाइल को कॉल करता है, तो यह `did_load_filetypes` चर को परिभाषित करता है और इसे 1 पर सेट करता है। 1 Vim में सत्य है। आपको `filetype.vim` के बाकी हिस्से को भी पढ़ना चाहिए। देखें कि जब Vim इसे कॉल करता है तो यह क्या करता है।

### फ़ाइल प्रकार स्क्रिप्ट

आइए सीखते हैं कि फ़ाइल सामग्री के आधार पर फ़ाइल प्रकार को कैसे पहचानें और असाइन करें।

मान लीजिए कि आपके पास बिना सहमति वाले एक्सटेंशन वाली फ़ाइलों का एक संग्रह है। इन फ़ाइलों में केवल एक ही चीज़ समान है कि वे सभी पहले पंक्ति में "donutify" शब्द से शुरू होती हैं। आप इन फ़ाइलों को `donut` फ़ाइल प्रकार सौंपना चाहते हैं। नए फ़ाइलें बनाएं जिनका नाम `sugardonut`, `glazeddonut`, और `frieddonut` (बिना एक्सटेंशन) हो। प्रत्येक फ़ाइल के अंदर, यह पंक्ति जोड़ें:

```shell
donutify
```

जब आप `sugardonut` के अंदर `:set filetype?` चलाते हैं, तो Vim नहीं जानता कि इस फ़ाइल को किस फ़ाइल प्रकार के साथ असाइन किया जाए। यह `filetype=` लौटाता है।

रनटाइम रूट पथ में, एक `scripts.vim` फ़ाइल जोड़ें (`~/.vim/scripts.vim`)। इसके अंदर, ये जोड़ें:

```shell
if did_filetype()
  finish
endif

if getline(1) =~ '^\\<donutify\\>'
  setfiletype donut
endif
```

फंक्शन `getline(1)` पहले पंक्ति पर पाठ लौटाता है। यह जांचता है कि क्या पहली पंक्ति "donutify" शब्द से शुरू होती है। फंक्शन `did_filetype()` एक Vim अंतर्निहित फ़ंक्शन है। यह तब सत्य लौटाएगा जब फ़ाइल प्रकार से संबंधित घटना कम से कम एक बार सक्रिय होती है। इसका उपयोग फ़ाइल प्रकार की घटना को फिर से चलाने से रोकने के लिए गार्ड के रूप में किया जाता है।

`sugardonut` फ़ाइल खोलें और `:set filetype?` चलाएं, अब Vim लौटाता है `filetype=donut`। यदि आप अन्य डोनट फ़ाइलें (`glazeddonut` और `frieddonut`) खोलते हैं, तो Vim भी उनके फ़ाइल प्रकार को `donut` प्रकार के रूप में पहचानता है।

ध्यान दें कि `scripts.vim` केवल तब चलती है जब Vim एक अज्ञात फ़ाइल प्रकार के साथ फ़ाइल खोलता है। यदि Vim एक ज्ञात फ़ाइल प्रकार के साथ फ़ाइल खोलता है, तो `scripts.vim` नहीं चलेगी।

## फ़ाइल प्रकार प्लगइन

क्या होगा यदि आप चाहते हैं कि Vim चॉकडोनट फ़ाइल खोलने पर चॉकडोनट-विशिष्ट स्क्रिप्ट चलाए और प्लेनडोनट फ़ाइल खोलने पर उन स्क्रिप्ट को न चलाए?

आप इसे फ़ाइल प्रकार प्लगइन रनटाइम पथ (`~/.vim/ftplugin/`) के साथ कर सकते हैं। Vim इस निर्देशिका के अंदर उस फ़ाइल के लिए एक फ़ाइल की खोज करता है जिसका नाम आपने अभी खोला है। एक `chocodonut.vim` बनाएं (`~/.vim/ftplugin/chocodonut.vim`):

```shell
echo "Calling from chocodonut ftplugin"
```

एक और ftplugin फ़ाइल बनाएं, `plaindonut.vim` (`~/.vim/ftplugin/plaindonut.vim`):

```shell
echo "Calling from plaindonut ftplugin"
```

अब हर बार जब आप एक चॉकडोनट फ़ाइल प्रकार खोलते हैं, तो Vim `~/.vim/ftplugin/chocodonut.vim` से स्क्रिप्ट चलाता है। हर बार जब आप एक प्लेनडोनट फ़ाइल प्रकार खोलते हैं, तो Vim `~/.vim/ftplugin/plaindonut.vim` से स्क्रिप्ट चलाता है।

एक चेतावनी: ये फ़ाइलें हर बार चलती हैं जब एक बफर फ़ाइल प्रकार सेट किया जाता है (`set filetype=chocodonut` उदाहरण के लिए)। यदि आप 3 विभिन्न चॉकडोनट फ़ाइलें खोलते हैं, तो स्क्रिप्ट कुल तीन बार चलेंगी।

## इंडेंट फ़ाइलें

Vim के पास एक इंडेंट रनटाइम पथ है जो ftplugin के समान काम करता है, जहां Vim खोले गए फ़ाइल प्रकार के समान नाम वाली फ़ाइल की खोज करता है। इन इंडेंट रनटाइम पथों का उद्देश्य इंडेंट से संबंधित कोड को संग्रहीत करना है। यदि आपके पास फ़ाइल `~/.vim/indent/chocodonut.vim` है, तो इसे केवल तब निष्पादित किया जाएगा जब आप एक चॉकडोनट फ़ाइल प्रकार खोलते हैं। आप यहाँ चॉकडोनट फ़ाइलों के लिए इंडेंट से संबंधित कोड संग्रहीत कर सकते हैं।

## रंग

Vim के पास रंग योजनाओं को संग्रहीत करने के लिए एक रंग रनटाइम पथ (`~/.vim/colors/`) है। कोई भी फ़ाइल जो इस निर्देशिका के अंदर जाती है, उसे `:color` कमांड-लाइन कमांड में प्रदर्शित किया जाएगा।

यदि आपके पास एक `~/.vim/colors/beautifulprettycolors.vim` फ़ाइल है, तो जब आप `:color` चलाते हैं और Tab दबाते हैं, तो आप `beautifulprettycolors` को रंग विकल्पों में से एक के रूप में देखेंगे। यदि आप अपनी स्वयं की रंग योजना जोड़ना चाहते हैं, तो यह जाने का स्थान है।

यदि आप अन्य लोगों द्वारा बनाई गई रंग योजनाओं की जांच करना चाहते हैं, तो एक अच्छी जगह है [vimcolors](https://vimcolors.com/)।

## सिंटैक्स हाइलाइटिंग

Vim के पास सिंटैक्स हाइलाइटिंग को परिभाषित करने के लिए एक सिंटैक्स रनटाइम पथ (`~/.vim/syntax/`) है।

मान लीजिए कि आपके पास एक `hello.chocodonut` फ़ाइल है, इसके अंदर आपके पास निम्नलिखित अभिव्यक्तियाँ हैं:

```shell
(donut "tasty")
(donut "savory")
```

हालांकि अब Vim सही फ़ाइल प्रकार जानता है, सभी पाठों का रंग समान है। आइए "donut" कीवर्ड को हाइलाइट करने के लिए एक सिंटैक्स हाइलाइटिंग नियम जोड़ते हैं। एक नया चॉकडोनट सिंटैक्स फ़ाइल बनाएं, `~/.vim/syntax/chocodonut.vim`। इसके अंदर जोड़ें:

```shell
syntax keyword donutKeyword donut

highlight link donutKeyword Keyword
```

अब `hello.chocodonut` फ़ाइल को फिर से खोलें। अब `donut` कीवर्ड हाइलाइटेड हैं।

यह अध्याय सिंटैक्स हाइलाइटिंग पर गहराई से नहीं जाएगा। यह एक विशाल विषय है। यदि आप जिज्ञासु हैं, तो `:h syntax.txt` देखें।

[vim-polyglot](https://github.com/sheerun/vim-polyglot) प्लगइन एक शानदार प्लगइन है जो कई लोकप्रिय प्रोग्रामिंग भाषाओं के लिए हाइलाइट प्रदान करता है।

## दस्तावेज़ीकरण

यदि आप एक प्लगइन बनाते हैं, तो आपको अपना स्वयं का दस्तावेज़ीकरण बनाना होगा। इसके लिए आप doc रनटाइम पथ का उपयोग करते हैं।

आइए चॉकडोनट और प्लेनडोनट कीवर्ड के लिए एक बुनियादी दस्तावेज़ीकरण बनाते हैं। एक `donut.txt` बनाएं (`~/.vim/doc/donut.txt`)। इसके अंदर, ये पाठ जोड़ें:

```shell
*chocodonut* Delicious chocolate donut

*plaindonut* No choco goodness but still delicious nonetheless
```

यदि आप `chocodonut` और `plaindonut` के लिए खोजने का प्रयास करते हैं (`:h chocodonut` और `:h plaindonut`), तो आप कुछ नहीं पाएंगे।

पहले, आपको नए सहायता प्रविष्टियाँ उत्पन्न करने के लिए `:helptags` चलाना होगा। `:helptags ~/.vim/doc/` चलाएं।

अब यदि आप `:h chocodonut` और `:h plaindonut` चलाते हैं, तो आप इन नई सहायता प्रविष्टियों को पाएंगे। ध्यान दें कि फ़ाइल अब केवल पढ़ने के लिए है और इसका "सहायता" फ़ाइल प्रकार है।
## आलसी लोडिंग स्क्रिप्ट

इस अध्याय में आपने जो रनटाइम पथ सीखे, वे स्वचालित रूप से चलाए गए। यदि आप मैन्युअल रूप से एक स्क्रिप्ट लोड करना चाहते हैं, तो ऑटोलोड रनटाइम पथ का उपयोग करें।

एक ऑटोलोड निर्देशिका बनाएं (`~/.vim/autoload/`)। उस निर्देशिका के अंदर, एक नई फ़ाइल बनाएं और इसका नाम `tasty.vim` रखें (`~/.vim/autoload/tasty.vim`)। इसके अंदर:

```shell
echo "tasty.vim global"

function tasty#donut()
  echo "tasty#donut"
endfunction
```

ध्यान दें कि फ़ंक्शन का नाम `tasty#donut` है, `donut()` नहीं। ऑटोलोड फ़ीचर का उपयोग करते समय पाउंड साइन (`#`) आवश्यक है। ऑटोलोड फ़ीचर के लिए फ़ंक्शन नामकरण सम्मेलन है:

```shell
function fileName#functionName()
  ...
endfunction
```

इस मामले में, फ़ाइल का नाम `tasty.vim` है और फ़ंक्शन का नाम (तकनीकी रूप से) `donut` है।

एक फ़ंक्शन को कॉल करने के लिए, आपको `call` कमांड की आवश्यकता होती है। आइए उस फ़ंक्शन को `:call tasty#donut()` के साथ कॉल करें।

जब आप पहली बार फ़ंक्शन को कॉल करते हैं, तो आपको *दोनों* इको संदेश ("tasty.vim global" और "tasty#donut") दिखाई देने चाहिए। `tasty#donut` फ़ंक्शन के बाद के कॉल केवल "testy#donut" इको प्रदर्शित करेंगे।

जब आप Vim में एक फ़ाइल खोलते हैं, तो पिछले रनटाइम पथों के विपरीत, ऑटोलोड स्क्रिप्ट स्वचालित रूप से लोड नहीं होती हैं। केवल जब आप स्पष्ट रूप से `tasty#donut()` को कॉल करते हैं, Vim `tasty.vim` फ़ाइल की तलाश करता है और इसके अंदर सब कुछ लोड करता है, जिसमें `tasty#donut()` फ़ंक्शन भी शामिल है। ऑटोलोड उन फ़ंक्शनों के लिए एकदम सही तंत्र है जो व्यापक संसाधनों का उपयोग करते हैं लेकिन आप अक्सर उपयोग नहीं करते।

आप ऑटोलोड के साथ जितने चाहें उतने नेस्टेड निर्देशिकाएँ जोड़ सकते हैं। यदि आपके पास रनटाइम पथ `~/.vim/autoload/one/two/three/tasty.vim` है, तो आप फ़ंक्शन को `:call one#two#three#tasty#donut()` के साथ कॉल कर सकते हैं।

## बाद की स्क्रिप्ट

Vim के पास एक बाद का रनटाइम पथ (`~/.vim/after/`) है जो `~/.vim/` की संरचना को दर्शाता है। इस पथ में कुछ भी अंतिम रूप से निष्पादित होता है, इसलिए डेवलपर्स आमतौर पर स्क्रिप्ट ओवरराइड के लिए इन पथों का उपयोग करते हैं।

उदाहरण के लिए, यदि आप `plugin/chocolate.vim` से स्क्रिप्ट को ओवरराइट करना चाहते हैं, तो आप ओवरराइड स्क्रिप्ट रखने के लिए `~/.vim/after/plugin/chocolate.vim` बना सकते हैं। Vim `~/.vim/after/plugin/chocolate.vim` को `~/.vim/plugin/chocolate.vim` के *बाद* चलाएगा।

## $VIMRUNTIME

Vim के पास डिफ़ॉल्ट स्क्रिप्ट और समर्थन फ़ाइलों के लिए एक पर्यावरण चर `$VIMRUNTIME` है। आप इसे `:e $VIMRUNTIME` चलाकर देख सकते हैं।

संरचना परिचित होनी चाहिए। इसमें कई रनटाइम पथ शामिल हैं जो आपने इस अध्याय में सीखे हैं।

याद करें कि अध्याय 21 में, आपने सीखा था कि जब आप Vim खोलते हैं, तो यह सात विभिन्न स्थानों में vimrc फ़ाइलों की तलाश करता है। मैंने कहा था कि अंतिम स्थान जहां Vim जांचता है वह `$VIMRUNTIME/defaults.vim` है। यदि Vim किसी उपयोगकर्ता vimrc फ़ाइल को खोजने में विफल रहता है, तो Vim `defaults.vim` को vimrc के रूप में उपयोग करता है।

क्या आपने कभी बिना किसी सिंटैक्स प्लगइन जैसे vim-polyglot के Vim चलाने की कोशिश की है और फिर भी आपकी फ़ाइल अभी भी सिंटैक्स रूप से हाइलाइट की गई है? इसका कारण यह है कि जब Vim रनटाइम पथ से एक सिंटैक्स फ़ाइल खोजने में विफल रहता है, तो Vim `$VIMRUNTIME` सिंटैक्स निर्देशिका से एक सिंटैक्स फ़ाइल की तलाश करता है।

अधिक जानने के लिए, `:h $VIMRUNTIME` देखें।

## रनटाइमपाथ विकल्प

अपने रनटाइमपाथ की जांच करने के लिए, `:set runtimepath?` चलाएँ।

यदि आप Vim-Plug या लोकप्रिय बाहरी प्लगइन प्रबंधकों का उपयोग करते हैं, तो यह निर्देशिकाओं की एक सूची प्रदर्शित करनी चाहिए। उदाहरण के लिए, मेरी सूची इस प्रकार है:

```shell
runtimepath=~/.vim,~/.vim/plugged/vim-signify,~/.vim/plugged/base16-vim,~/.vim/plugged/fzf.vim,~/.vim/plugged/fzf,~/.vim/plugged/vim-gutentags,~/.vim/plugged/tcomment_vim,~/.vim/plugged/emmet-vim,~/.vim/plugged/vim-fugitive,~/.vim/plugged/vim-sensible,~/.vim/plugged/lightline.vim, ...
```

प्लगइन प्रबंधकों में से एक चीज़ यह है कि यह प्रत्येक प्लगइन को रनटाइम पथ में जोड़ता है। प्रत्येक रनटाइम पथ की अपनी निर्देशिका संरचना हो सकती है जो `~/.vim/` के समान है।

यदि आपके पास एक निर्देशिका `~/box/of/donuts/` है और आप उस निर्देशिका को अपने रनटाइम पथ में जोड़ना चाहते हैं, तो आप इसे अपने vimrc में जोड़ सकते हैं:

```shell
set rtp+=$HOME/box/of/donuts/
```

यदि `~/box/of/donuts/` के अंदर, आपके पास एक प्लगइन निर्देशिका (`~/box/of/donuts/plugin/hello.vim`) और एक ftplugin (`~/box/of/donuts/ftplugin/chocodonut.vim`) है, तो Vim जब आप Vim खोलते हैं तो `plugin/hello.vim` से सभी स्क्रिप्ट चलाएगा। जब आप एक chocodonut फ़ाइल खोलते हैं, तो Vim `ftplugin/chocodonut.vim` भी चलाएगा।

यह खुद आजमाएँ: एक मनमाना पथ बनाएं और इसे अपने रनटाइमपाथ में जोड़ें। इस अध्याय से सीखे गए कुछ रनटाइम पथ जोड़ें। सुनिश्चित करें कि वे अपेक्षित रूप से काम करते हैं।

## स्मार्ट तरीके से रनटाइम सीखें

इसे पढ़ने में अपना समय लें और इन रनटाइम पथों के साथ खेलें। यह देखने के लिए कि रनटाइम पथ वास्तविक दुनिया में कैसे उपयोग किए जा रहे हैं, अपने पसंदीदा Vim प्लगइन के रिपॉजिटरी पर जाएं और इसकी निर्देशिका संरचना का अध्ययन करें। अब आपको उनमें से अधिकांश को समझना चाहिए। अनुसरण करने का प्रयास करें और बड़े चित्र को समझें। अब जब आप Vim निर्देशिका संरचना को समझते हैं, तो आप Vimscript सीखने के लिए तैयार हैं।