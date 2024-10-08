---
description: इस दस्तावेज़ में, आप वीम मैक्रोज़ का उपयोग करके कार्यों को स्वचालित करने
  और दोहराने की प्रक्रिया सीखेंगे, जिससे फ़ाइल संपादन आसान हो जाएगा।
title: Ch09. Macros
---

जब आप फ़ाइलों को संपादित कर रहे होते हैं, तो आप एक ही क्रियाओं को दोहराते हुए पाएंगे। क्या यह अच्छा नहीं होगा यदि आप उन क्रियाओं को एक बार कर सकें और जब भी आपको इसकी आवश्यकता हो, उन्हें फिर से चला सकें? Vim मैक्रोज़ के साथ, आप क्रियाओं को रिकॉर्ड कर सकते हैं और उन्हें Vim रजिस्टर में स्टोर कर सकते हैं ताकि जब भी आपको इसकी आवश्यकता हो, उन्हें निष्पादित किया जा सके।

इस अध्याय में, आप सीखेंगे कि कैसे मैक्रोज़ का उपयोग करके नीरस कार्यों को स्वचालित किया जा सकता है (इसके अलावा, यह देखना कूल लगता है कि आपकी फ़ाइल स्वयं को संपादित कर रही है)।

## बुनियादी मैक्रोज़

यहां एक Vim मैक्रो का बुनियादी सिंटैक्स है:

```shell
qa                     रजिस्टर a में एक मैक्रो रिकॉर्ड करना शुरू करें
q (रिकॉर्ड करते समय)    मैक्रो रिकॉर्ड करना बंद करें
```

आप मैक्रोज़ को स्टोर करने के लिए कोई भी छोटे अक्षर (a-z) चुन सकते हैं। यहां बताया गया है कि आप एक मैक्रो को कैसे निष्पादित कर सकते हैं:

```shell
@a    रजिस्टर a से मैक्रो निष्पादित करें
@@    अंतिम निष्पादित मैक्रोज़ को निष्पादित करें
```

मान लीजिए कि आपके पास यह पाठ है और आप प्रत्येक पंक्ति में सब कुछ बड़े अक्षरों में करना चाहते हैं:

```shell
hello
vim
macros
are
awesome
```

जब आपका कर्सर "hello" पंक्ति के शुरू में हो, तो चलाएँ:

```shell
qa0gU$jq
```

विवरण:
- `qa` रजिस्टर a में एक मैक्रो रिकॉर्ड करना शुरू करता है।
- `0` पंक्ति के शुरू में जाता है।
- `gU$` आपके वर्तमान स्थान से लेकर पंक्ति के अंत तक के पाठ को बड़े अक्षरों में बदलता है।
- `j` एक पंक्ति नीचे जाता है।
- `q` रिकॉर्डिंग को रोकता है।

इसे फिर से चलाने के लिए, `@a` चलाएँ। कई अन्य Vim कमांड की तरह, आप मैक्रोज़ को काउंट आर्गुमेंट पास कर सकते हैं। उदाहरण के लिए, `3@a` चलाने से मैक्रो तीन बार निष्पादित होता है।

## सुरक्षा गार्ड

जब मैक्रो निष्पादन किसी त्रुटि का सामना करता है, तो यह स्वचालित रूप से समाप्त हो जाता है। मान लीजिए कि आपके पास यह पाठ है:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

यदि आप प्रत्येक पंक्ति में पहले शब्द को बड़े अक्षरों में करना चाहते हैं, तो यह मैक्रो काम करना चाहिए:

```shell
qa0W~jq
```

उपरोक्त कमांड का विवरण:
- `qa` रजिस्टर a में एक मैक्रो रिकॉर्ड करना शुरू करता है।
- `0` पंक्ति के शुरू में जाता है।
- `W` अगले WORD पर जाता है।
- `~` कर्सर के नीचे के अक्षर के केस को टॉगल करता है।
- `j` एक पंक्ति नीचे जाता है।
- `q` रिकॉर्डिंग को रोकता है।

मैं अपने मैक्रो निष्पादन को कम गिनने की बजाय अधिक गिनना पसंद करता हूँ, इसलिए मैं आमतौर पर इसे निन्यानवे बार (`99@a`) कहता हूँ। इस कमांड के साथ, Vim वास्तव में इस मैक्रो को निन्यानवे बार नहीं चलाता। जब Vim अंतिम पंक्ति पर पहुँचता है और `j` मोशन चलाता है, तो यह नीचे जाने के लिए कोई और पंक्ति नहीं पाता, एक त्रुटि फेंकता है, और मैक्रो निष्पादन को रोकता है।

यह तथ्य कि मैक्रो निष्पादन पहले त्रुटि का सामना करने पर रुक जाता है, एक अच्छी विशेषता है, अन्यथा Vim इस मैक्रो को निन्यानवे बार चलाना जारी रखेगा, भले ही यह पहले ही पंक्ति के अंत तक पहुँच चुका हो।

## कमांड लाइन मैक्रो

सामान्य मोड में `@a` चलाना ही एकमात्र तरीका नहीं है जिससे आप Vim में मैक्रोज़ को निष्पादित कर सकते हैं। आप `:normal @a` कमांड लाइन भी चला सकते हैं। `:normal` उपयोगकर्ता को किसी भी सामान्य मोड कमांड को आर्गुमेंट के रूप में निष्पादित करने की अनुमति देता है। ऊपर के मामले में, यह सामान्य मोड से `@a` चलाने के समान है।

`:normal` कमांड रेंज को आर्गुमेंट के रूप में स्वीकार करता है। आप इसका उपयोग चयनित रेंज में मैक्रो चलाने के लिए कर सकते हैं। यदि आप पंक्तियों 2 और 3 के बीच अपने मैक्रो को निष्पादित करना चाहते हैं, तो आप `:2,3 normal @a` चला सकते हैं।

## कई फ़ाइलों में मैक्रो निष्पादित करना

मान लीजिए कि आपके पास कई `.txt` फ़ाइलें हैं, प्रत्येक में कुछ पाठ हैं। आपका कार्य केवल उन पंक्तियों में पहले शब्द को बड़े अक्षरों में करना है जिनमें "donut" शब्द है। मान लीजिए कि आपके पास रजिस्टर a में `0W~j` है (पहले जैसा ही मैक्रो)। आप इसे जल्दी से कैसे पूरा कर सकते हैं?

पहली फ़ाइल:

```shell
## savory.txt
a. cheddar jalapeno donut
b. mac n cheese donut
c. fried dumpling
```

दूसरी फ़ाइल:

```shell
## sweet.txt
a. chocolate donut
b. chocolate pancake
c. powdered sugar donut
```

तीसरी फ़ाइल:

```shell
## plain.txt
a. wheat bread
b. plain donut
```

यहाँ बताया गया है कि आप इसे कैसे कर सकते हैं:
- `:args *.txt` आपके वर्तमान निर्देशिका में सभी `.txt` फ़ाइलों को खोजने के लिए।
- `:argdo g/donut/normal @a` प्रत्येक फ़ाइल के अंदर `:args` पर वैश्विक कमांड `g/donut/normal @a` को निष्पादित करता है।
- `:argdo update` प्रत्येक फ़ाइल को `:args` के अंदर सहेजने के लिए `update` कमांड को निष्पादित करता है जब बफर में संशोधन किया गया हो।

यदि आप वैश्विक कमांड `:g/donut/normal @a` से परिचित नहीं हैं, तो यह उस पंक्ति पर कमांड को निष्पादित करता है जो पैटर्न (`/donut/`) से मेल खाती है। मैं एक बाद के अध्याय में वैश्विक कमांड पर चर्चा करूंगा।

## पुनरावृत्त मैक्रो

आप एक ही मैक्रो रजिस्टर को रिकॉर्ड करते समय पुनरावृत्त रूप से मैक्रो को निष्पादित कर सकते हैं। मान लीजिए कि आपके पास यह सूची फिर से है और आपको पहले शब्द के केस को टॉगल करना है:

```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

इस बार, चलाएँ:

```shell
qaqqa0W~j@aq
```

यहाँ कदमों का विवरण है:
- `qaq` एक खाली मैक्रो a को रिकॉर्ड करता है। यह एक खाली रजिस्टर से शुरू करना आवश्यक है क्योंकि जब आप पुनरावृत्त रूप से मैक्रो को कॉल करते हैं, तो यह उस रजिस्टर में जो भी है उसे चलाएगा।
- `qa` रजिस्टर a पर रिकॉर्डिंग शुरू करता है।
- `0` वर्तमान पंक्ति में पहले अक्षर पर जाता है।
- `W` अगले WORD पर जाता है।
- `~` कर्सर के नीचे के अक्षर के केस को टॉगल करता है।
- `j` एक पंक्ति नीचे जाता है।
- `@a` मैक्रो a को निष्पादित करता है।
- `q` रिकॉर्डिंग को रोकता है।

अब आप बस `@a` चला सकते हैं और देख सकते हैं कि Vim मैक्रो को पुनरावृत्त रूप से निष्पादित करता है।

मैक्रो को रोकने का उसे कैसे पता चला? जब मैक्रो अंतिम पंक्ति पर था, तो उसने `j` चलाने की कोशिश की, चूंकि नीचे जाने के लिए कोई और पंक्ति नहीं थी, इसने मैक्रो निष्पादन को रोक दिया।

## एक मैक्रो को जोड़ना

यदि आपको एक मौजूदा मैक्रो में क्रियाएँ जोड़ने की आवश्यकता है, तो आप मैक्रो को फिर से बनाने के बजाय मौजूदा में क्रियाएँ जोड़ सकते हैं। रजिस्टर अध्याय में, आपने सीखा कि आप इसके अपरकेस प्रतीक का उपयोग करके एक नामित रजिस्टर में जोड़ सकते हैं। वही नियम लागू होता है। रजिस्टर a मैक्रो में क्रियाएँ जोड़ने के लिए, रजिस्टर A का उपयोग करें।

रजिस्टर a में एक मैक्रो रिकॉर्ड करें: `qa0W~q` (यह अनुक्रम एक पंक्ति में अगले WORD के केस को टॉगल करता है)। यदि आप एक नई अनुक्रम जोड़ना चाहते हैं ताकि पंक्ति के अंत में एक बिंदु भी जोड़ा जा सके, तो चलाएँ:

```shell
qAA.<Esc>q
```

विवरण:
- `qA` रजिस्टर A में मैक्रो रिकॉर्ड करना शुरू करता है।
- `A.<Esc>` पंक्ति के अंत में (यहाँ `A` इनसर्ट मोड कमांड है, इसे मैक्रो A के साथ भ्रमित न करें) एक बिंदु जोड़ता है, फिर इनसर्ट मोड से बाहर निकलता है।
- `q` मैक्रो रिकॉर्डिंग को रोकता है।

अब जब आप `@a` निष्पादित करते हैं, तो यह न केवल अगले WORD के केस को टॉगल करता है, बल्कि यह पंक्ति के अंत में एक बिंदु भी जोड़ता है।

## एक मैक्रो को संशोधित करना

यदि आपको एक मैक्रो के मध्य में नई क्रियाएँ जोड़ने की आवश्यकता है तो क्या होगा?

मान लीजिए कि आपके पास एक मैक्रो है जो पहले वास्तविक शब्द का केस टॉगल करता है और पंक्ति के अंत में एक अवधि जोड़ता है, `0W~A.<Esc>` रजिस्टर a में। मान लीजिए कि पहले शब्द को बड़े अक्षरों में करने और पंक्ति के अंत में एक अवधि जोड़ने के बीच, आपको "deep fried" शब्द को "donut" शब्द के ठीक पहले जोड़ने की आवश्यकता है *(क्योंकि नियमित डोनट्स से बेहतर केवल गहरे तले हुए डोनट्स होते हैं)*।

मैं पहले के अनुभाग से पाठ को फिर से उपयोग करूंगा:
```shell
a. chocolate donut
b. mochi donut
c. powdered sugar donut
d. plain donut
```

पहले, चलिए मौजूदा मैक्रो को कॉल करते हैं (मान लीजिए कि आपने पिछले अनुभाग से मैक्रो को रजिस्टर a में रखा है) `:put a` के साथ:

```shell
0W~A.^[
```

यह `^[` क्या है? क्या आपने `0W~A.<Esc>` नहीं किया? `<Esc>` कहाँ है? `^[` Vim का *आंतरिक कोड* प्रतिनिधित्व है `<Esc>` का। कुछ विशेष कुंजियों के साथ, Vim उन कुंजियों के प्रतिनिधित्व को आंतरिक कोड के रूप में प्रिंट करता है। कुछ सामान्य कुंजियाँ जिनके आंतरिक कोड प्रतिनिधित्व होते हैं, वे हैं `<Esc>`, `<Backspace>`, और `<Enter>`। और भी विशेष कुंजियाँ हैं, लेकिन वे इस अध्याय के दायरे में नहीं हैं।

मैक्रो पर वापस, केस टॉगल ऑपरेटर (`~`) के ठीक बाद, चलिए पंक्ति के अंत में जाने के लिए (`$`), एक शब्द पीछे जाने के लिए (`b`), इनसर्ट मोड में जाने के लिए (`i`), "deep fried " टाइप करने के लिए ( "fried " के बाद स्पेस न भूलें), और इनसर्ट मोड से बाहर निकलने के लिए (`<Esc>`) निर्देश जोड़ते हैं।

यहाँ आप क्या समाप्त करेंगे:

```shell
0W~$bideep fried <Esc>A.^[
```

एक छोटी समस्या है। Vim `<Esc>` को नहीं समझता। आप `<Esc>` को शाब्दिक रूप से टाइप नहीं कर सकते। आपको `<Esc>` कुंजी के लिए आंतरिक कोड प्रतिनिधित्व लिखना होगा। जब आप इनसर्ट मोड में होते हैं, तो आप `Ctrl-V` दबाते हैं और फिर `<Esc>`। Vim `^[` प्रिंट करेगा। `Ctrl-V` एक इनसर्ट मोड ऑपरेटर है जो अगले गैर-अंक चरित्र को *शाब्दिक रूप से* सम्मिलित करता है। आपका मैक्रो कोड अब इस तरह दिखना चाहिए:

```shell
0W~$bideep fried ^[A.^[
```

रजिस्टर a में संशोधित निर्देश जोड़ने के लिए, आप इसे एक नामित रजिस्टर में एक नई प्रविष्टि जोड़ने के समान तरीके से कर सकते हैं। पंक्ति के शुरू में, चलाएँ `"ay$` ताकि यांकेड टेक्स्ट रजिस्टर a में स्टोर हो सके।

अब जब आप `@a` निष्पादित करते हैं, तो आपका मैक्रो पहले शब्द का केस टॉगल करेगा, "donut" के पहले "deep fried " जोड़ देगा, और पंक्ति के अंत में एक "." जोड़ देगा। यम!

एक मैक्रो को संशोधित करने का एक वैकल्पिक तरीका कमांड लाइन अभिव्यक्ति का उपयोग करना है। करें `:let @a="`, फिर `Ctrl-R a` करें, यह वास्तव में रजिस्टर a की सामग्री को पेस्ट करेगा। अंत में, डबल कोट्स (`"`) बंद करना न भूलें। आपके पास कुछ इस तरह हो सकता है `:let @a="0W~$bideep fried ^[A.^["`।

## मैक्रो की पुनरावृत्ति

आप एक रजिस्टर से दूसरे रजिस्टर में मैक्रोज़ को आसानी से डुप्लिकेट कर सकते हैं। उदाहरण के लिए, रजिस्टर a में एक मैक्रो को रजिस्टर z में डुप्लिकेट करने के लिए, आप `:let @z = @a` कर सकते हैं। `@a` रजिस्टर a की सामग्री का प्रतिनिधित्व करता है। अब यदि आप `@z` चलाते हैं, तो यह `@a` के समान ही क्रियाएँ करेगा।

मैं अपने सबसे अधिक उपयोग किए जाने वाले मैक्रोज़ पर पुनरावृत्ति बनाना उपयोगी पाता हूँ। अपने कार्यप्रवाह में, मैं आमतौर पर पहले सात वर्णमाला के अक्षरों (a-g) में मैक्रोज़ रिकॉर्ड करता हूँ और मैं अक्सर बिना किसी विचार के उन्हें बदलता हूँ। यदि मैं उपयोगी मैक्रोज़ को वर्णमाला के अंत की ओर ले जाता हूँ, तो मैं उन्हें बिना चिंता के संरक्षित कर सकता हूँ कि मैं उन्हें गलती से बदल सकता हूँ।

## श्रृंखला बनाम समानांतर मैक्रो

Vim श्रृंखला और समानांतर में मैक्रोज़ को निष्पादित कर सकता है। मान लीजिए कि आपके पास यह पाठ है:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

यदि आप सभी बड़े अक्षरों वाले "FUNC" को छोटे अक्षरों में करने के लिए एक मैक्रो रिकॉर्ड करना चाहते हैं, तो यह मैक्रो काम करना चाहिए:

```shell
qa0f{gui{jq
```

विवरण:
- `qa` रजिस्टर a में रिकॉर्डिंग शुरू करता है।
- `0` पहले पंक्ति पर जाता है।
- `f{` "{" का पहला उदाहरण खोजता है।
- `gui{` ब्रैकेट टेक्स्ट-ऑब्जेक्ट (`i{`) के अंदर के पाठ को छोटे अक्षरों में बदलता है।
- `j` एक पंक्ति नीचे जाता है।
- `q` मैक्रो रिकॉर्डिंग को रोकता है।

अब आप `99@a` चला सकते हैं ताकि इसे शेष पंक्तियों पर निष्पादित किया जा सके। हालाँकि, यदि आपके फ़ाइल में यह आयात अभिव्यक्ति है:

```shell
import { FUNC1 } from "library1";
import { FUNC2 } from "library2";
import { FUNC3 } from "library3";
import foo from "bar";
import { FUNC4 } from "library4";
import { FUNC5 } from "library5";
```

`99@a` चलाने पर, केवल मैक्रो तीन बार निष्पादित होता है। यह अंतिम दो पंक्तियों पर मैक्रो को निष्पादित नहीं करता है क्योंकि "foo" पंक्ति पर `f{` चलाने में निष्पादन विफल हो जाता है। यह श्रृंखला में मैक्रो चलाने पर अपेक्षित है। आप हमेशा उस अगली पंक्ति पर जा सकते हैं जहाँ "FUNC4" है और उस मैक्रो को फिर से चला सकते हैं। लेकिन यदि आप सब कुछ एक बार में करना चाहते हैं तो क्या करें?

समानांतर में मैक्रो चलाएँ।

पहले के अनुभाग से याद करें कि मैक्रोज़ को कमांड लाइन कमांड `:normal` का उपयोग करके निष्पादित किया जा सकता है (उदाहरण: `:3,5 normal @a` पंक्तियों 3-5 पर मैक्रो a को निष्पादित करता है)। यदि आप `:1,$ normal @a` चलाते हैं, तो आप देखेंगे कि मैक्रो सभी पंक्तियों पर निष्पादित हो रहा है सिवाय "foo" पंक्ति के। यह काम करता है!

हालांकि आंतरिक रूप से Vim वास्तव में मैक्रोज़ को समानांतर में नहीं चलाता है, बाहरी रूप से, यह ऐसा व्यवहार करता है। Vim `@a` को पहले से अंतिम पंक्ति (`1,$`) तक प्रत्येक पंक्ति पर *स्वतंत्र रूप से* निष्पादित करता है। चूंकि Vim इन मैक्रोज़ को स्वतंत्र रूप से निष्पादित करता है, प्रत्येक पंक्ति को यह नहीं पता होता कि एक मैक्रो निष्पादन "foo" पंक्ति पर विफल हो गया है।
## स्मार्ट तरीके से मैक्रोज़ सीखें

आप संपादन में जो कई चीजें करते हैं, वे दोहरावदार होती हैं। संपादन में बेहतर बनने के लिए, दोहरावदार क्रियाओं का पता लगाने की आदत डालें। मैक्रोज़ (या डॉट कमांड) का उपयोग करें ताकि आपको एक ही क्रिया को दो बार करने की आवश्यकता न हो। लगभग हर चीज जो आप Vim में कर सकते हैं, उसे मैक्रोज़ के साथ दोहराया जा सकता है।

शुरुआत में, मुझे मैक्रोज़ लिखना बहुत अजीब लगता था, लेकिन हार मत मानो। पर्याप्त अभ्यास के साथ, आप सब कुछ स्वचालित करने की आदत डाल लेंगे।

आपको अपने मैक्रोज़ को याद रखने में मदद करने के लिए म्नेमोनिक्स का उपयोग करना सहायक लग सकता है। यदि आपके पास एक मैक्रो है जो एक फ़ंक्शन बनाता है, तो "f रजिस्टर (`qf`) का उपयोग करें। यदि आपके पास संख्यात्मक संचालन के लिए एक मैक्रो है, तो "n रजिस्टर काम करना चाहिए (`qn`)। इसे उस *पहले नामित रजिस्टर* के साथ नाम दें जो आपके मन में उस संचालन के बारे में सोचते समय आता है। मुझे यह भी लगता है कि "q रजिस्टर एक अच्छा डिफ़ॉल्ट मैक्रो रजिस्टर बनाता है क्योंकि `qq` को सोचने के लिए कम मस्तिष्क शक्ति की आवश्यकता होती है। अंत में, मुझे अपने मैक्रोज़ को वर्णानुक्रम में बढ़ाना भी पसंद है, जैसे `qa`, फिर `qb`, फिर `qc`, और इसी तरह।

एक ऐसा तरीका खोजें जो आपके लिए सबसे अच्छा काम करे।