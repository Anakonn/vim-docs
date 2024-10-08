---
description: इस दस्तावेज़ में, आप सीखेंगे कि कैसे Vim को बाहरी कमांड्स के साथ seamlessly
  काम करने के लिए विस्तारित किया जा सकता है।
title: Ch14. External Commands
---

Unix प्रणाली के अंदर, आपको कई छोटे, अत्यधिक विशेषीकृत कमांड मिलेंगे जो एक काम करते हैं (और इसे अच्छी तरह से करते हैं)। आप इन कमांड को एक साथ जोड़ सकते हैं ताकि एक जटिल समस्या का समाधान किया जा सके। क्या यह अच्छा नहीं होगा यदि आप इन कमांड का उपयोग Vim के अंदर से कर सकें?

बिल्कुल। इस अध्याय में, आप सीखेंगे कि कैसे Vim को बाहरी कमांड के साथ निर्बाध रूप से काम करने के लिए विस्तारित किया जाए।

## बैंग कमांड

Vim में एक बैंग (`!`) कमांड है जो तीन चीजें कर सकता है:

1. एक बाहरी कमांड के STDOUT को वर्तमान बफर में पढ़ें।
2. अपने बफर की सामग्री को एक बाहरी कमांड के लिए STDIN के रूप में लिखें।
3. Vim के अंदर से एक बाहरी कमांड को निष्पादित करें।

आइए हम प्रत्येक को देखें।

## Vim में एक कमांड के STDOUT को पढ़ना

एक बाहरी कमांड के STDOUT को वर्तमान बफर में पढ़ने की सिंटैक्स है:

```shell
:r !cmd
```

`:r` Vim का पढ़ने का कमांड है। यदि आप इसे `!` के बिना उपयोग करते हैं, तो आप इसका उपयोग एक फ़ाइल की सामग्री प्राप्त करने के लिए कर सकते हैं। यदि आपके पास वर्तमान निर्देशिका में `file1.txt` नाम की एक फ़ाइल है और आप चलाते हैं:

```shell
:r file1.txt
```

Vim `file1.txt` की सामग्री को वर्तमान बफर में डाल देगा।

यदि आप `:r` कमांड को `!` और एक बाहरी कमांड के साथ चलाते हैं, तो उस कमांड का आउटपुट वर्तमान बफर में डाला जाएगा। `ls` कमांड का परिणाम प्राप्त करने के लिए, चलाएँ:

```shell
:r !ls
```

यह कुछ इस तरह लौटाता है:

```shell
file1.txt
file2.txt
file3.txt
```

आप `curl` कमांड से डेटा पढ़ सकते हैं:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

`r` कमांड एक पता भी स्वीकार करता है:

```shell
:10r !cat file1.txt
```

अब `cat file1.txt` चलाने से STDOUT लाइन 10 के बाद डाला जाएगा।

## बफर सामग्री को एक बाहरी कमांड में लिखना

`:w` कमांड, फ़ाइल को सहेजने के अलावा, वर्तमान बफर में पाठ को एक बाहरी कमांड के लिए STDIN के रूप में पास करने के लिए उपयोग किया जा सकता है। सिंटैक्स है:

```shell
:w !cmd
```

यदि आपके पास ये अभिव्यक्तियाँ हैं:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

सुनिश्चित करें कि आपके मशीन में [node](https://nodejs.org/en/) स्थापित है, फिर चलाएँ:

```shell
:w !node
```

Vim `node` का उपयोग करके JavaScript अभिव्यक्तियों को "Hello Vim" और "Vim is awesome" प्रिंट करने के लिए निष्पादित करेगा।

`:w` कमांड का उपयोग करते समय, Vim वर्तमान बफर में सभी पाठ का उपयोग करता है, जो वैश्विक कमांड के समान है (अधिकतर कमांड-लाइन कमांड, यदि आप इसे एक रेंज नहीं देते हैं, तो केवल वर्तमान लाइन के खिलाफ कमांड को निष्पादित करते हैं)। यदि आप `:w` को एक विशेष पता देते हैं:

```shell
:2w !node
```

तो Vim केवल दूसरे लाइन के पाठ का उपयोग `node` इंटरप्रेटर में करेगा।

`:w !node` और `:w! node` के बीच एक सूक्ष्म लेकिन महत्वपूर्ण अंतर है। `:w !node` के साथ, आप वर्तमान बफर में पाठ को बाहरी कमांड `node` में "लिख" रहे हैं। `:w! node` के साथ, आप एक फ़ाइल को बल-सेव कर रहे हैं और फ़ाइल का नाम "node" रख रहे हैं।

## एक बाहरी कमांड को निष्पादित करना

आप बैंग कमांड के साथ Vim के अंदर से एक बाहरी कमांड को निष्पादित कर सकते हैं। सिंटैक्स है:

```shell
:!cmd
```

वर्तमान निर्देशिका की सामग्री को लंबे प्रारूप में देखने के लिए, चलाएँ:

```shell
:!ls -ls
```

PID 3456 पर चल रहे एक प्रक्रिया को समाप्त करने के लिए, आप चला सकते हैं:

```shell
:!kill -9 3456
```

आप बिना Vim छोड़े किसी भी बाहरी कमांड को चला सकते हैं ताकि आप अपने कार्य पर ध्यान केंद्रित कर सकें।

## पाठ को फ़िल्टर करना

यदि आप `!` को एक रेंज देते हैं, तो इसका उपयोग पाठ को फ़िल्टर करने के लिए किया जा सकता है। मान लीजिए आपके पास निम्नलिखित पाठ हैं:

```shell
hello vim
hello vim
```

आइए `tr` (अनुवाद) कमांड का उपयोग करके वर्तमान लाइन को अपरकेस करें। चलाएँ:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

परिणाम:

```shell
HELLO VIM
hello vim
```

विवरण:
- `.!` वर्तमान लाइन पर फ़िल्टर कमांड को निष्पादित करता है।
- `tr '[:lower:]' '[:upper:]'` सभी छोटे अक्षरों को बड़े अक्षरों से बदलने के लिए `tr` कमांड को कॉल करता है।

बाहरी कमांड को फ़िल्टर के रूप में चलाने के लिए रेंज देना अनिवार्य है। यदि आप ऊपर दिए गए कमांड को बिना `.` के चलाने की कोशिश करते हैं (`:!tr '[:lower:]' '[:upper:]'`), तो आपको एक त्रुटि दिखाई देगी।

मान लीजिए कि आपको `awk` कमांड के साथ दोनों लाइनों पर दूसरे कॉलम को हटाना है:

```shell
:%!awk "{print $1}"
```

परिणाम:

```shell
hello
hello
```

विवरण:
- `:%!` सभी लाइनों पर फ़िल्टर कमांड को निष्पादित करता है (`%`).
- `awk "{print $1}"` केवल मिलान के पहले कॉलम को प्रिंट करता है।

आप टर्मिनल की तरह चेन ऑपरेटर (`|`) के साथ कई कमांड को जोड़ सकते हैं। मान लीजिए आपके पास इन स्वादिष्ट नाश्ते की वस्तुओं के साथ एक फ़ाइल है:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

यदि आपको इन्हें मूल्य के आधार पर क्रमबद्ध करना है और केवल मेनू को समान स्पेसिंग के साथ प्रदर्शित करना है, तो आप चला सकते हैं:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

परिणाम:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

विवरण:
- `:%!` सभी लाइनों पर फ़िल्टर लागू करता है (`%`).
- `awk 'NR > 1'` केवल दूसरी पंक्ति से आगे के पाठ को प्रदर्शित करता है।
- `|` अगले कमांड को जोड़ता है।
- `sort -nk 3` तीसरे कॉलम के मानों का उपयोग करके संख्यात्मक रूप से (`n`) क्रमबद्ध करता है (`k 3`).
- `column -t` समान स्पेसिंग के साथ पाठ को व्यवस्थित करता है।

## सामान्य मोड कमांड

Vim में सामान्य मोड में एक फ़िल्टर ऑपरेटर (`!`) है। यदि आपके पास निम्नलिखित अभिवादन हैं:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

वर्तमान लाइन और नीचे की लाइन को अपरकेस करने के लिए, आप चला सकते हैं:
```shell
!jtr '[a-z]' '[A-Z]'
```

विवरण:
- `!j` सामान्य कमांड फ़िल्टर ऑपरेटर (`!`) को वर्तमान लाइन और उसके नीचे की लाइन को लक्षित करता है। याद रखें कि यह सामान्य मोड ऑपरेटर है, इसलिए व्याकरण नियम `क्रिया + संज्ञा` लागू होता है। `!` क्रिया है और `j` संज्ञा है।
- `tr '[a-z]' '[A-Z]'` छोटे अक्षरों को बड़े अक्षरों से बदलता है।

फ़िल्टर सामान्य कमांड केवल उन गति / पाठ वस्तुओं पर काम करता है जो कम से कम एक लाइन या उससे लंबी होती हैं। यदि आपने `!iwtr '[a-z]' '[A-Z]'` (आंतरिक शब्द पर `tr` निष्पादित करें) चलाने की कोशिश की, तो आप पाएंगे कि यह `tr` कमांड को पूरी लाइन पर लागू करता है, न कि उस शब्द पर जिस पर आपका कर्सर है।

## स्मार्ट तरीके से बाहरी कमांड सीखें

Vim एक IDE नहीं है। यह एक हल्का मोडाल संपादक है जिसे डिज़ाइन द्वारा अत्यधिक विस्तारित किया जा सकता है। इस विस्तारणीयता के कारण, आपके पास अपने सिस्टम में किसी भी बाहरी कमांड तक आसान पहुँच है। इन बाहरी कमांड के साथ, Vim एक IDE बनने के एक कदम और करीब है। किसी ने कहा कि Unix प्रणाली पहला IDE है।

बैंग कमांड उतना ही उपयोगी है जितना कि आप कितने बाहरी कमांड जानते हैं। यदि आपकी बाहरी कमांड ज्ञान सीमित है तो चिंता न करें। मुझे भी बहुत कुछ सीखना है। इसे निरंतर सीखने के लिए प्रेरणा के रूप में लें। जब भी आपको किसी पाठ को संशोधित करने की आवश्यकता हो, देखें कि क्या कोई बाहरी कमांड है जो आपकी समस्या का समाधान कर सकता है। सब कुछ पर महारत हासिल करने की चिंता न करें, बस उन चीजों को सीखें जिनकी आपको वर्तमान कार्य को पूरा करने के लिए आवश्यकता है।