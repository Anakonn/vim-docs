---
description: विम में एक साथ कई फ़ाइलों में संपादन करने के विभिन्न तरीकों के बारे में
  जानें, जैसे `argdo`, `bufdo`, और अन्य उपयोगी कमांड।
title: Ch21. Multiple File Operations
---

कई फ़ाइलों में अपडेट करने में सक्षम होना एक और उपयोगी संपादन उपकरण है। पहले आपने सीखा कि `cfdo` के साथ कई पाठों को कैसे अपडेट किया जाता है। इस अध्याय में, आप सीखेंगे कि आप Vim में कई फ़ाइलों को संपादित करने के विभिन्न तरीके क्या हैं।

## कई फ़ाइलों में एक कमांड निष्पादित करने के विभिन्न तरीके

Vim में कई फ़ाइलों में कमांड निष्पादित करने के आठ तरीके हैं:
- आर्ग सूची (`argdo`)
- बफर सूची (`bufdo`)
- विंडो सूची (`windo`)
- टैब सूची (`tabdo`)
- क्विकफिक्स सूची (`cdo`)
- क्विकफिक्स सूची फ़ाइल के अनुसार (`cfdo`)
- स्थान सूची (`ldo`)
- स्थान सूची फ़ाइल के अनुसार (`lfdo`)

व्यवहार में, आप शायद अधिकांश समय केवल एक या दो का उपयोग करेंगे (मैं व्यक्तिगत रूप से `cdo` और `argdo` का अधिक उपयोग करता हूँ), लेकिन सभी उपलब्ध विकल्पों के बारे में जानना अच्छा है और उन विकल्पों का उपयोग करना जो आपके संपादन शैली से मेल खाते हैं।

आठ कमांड सीखना कठिन लग सकता है। लेकिन वास्तव में, ये कमांड समान रूप से काम करते हैं। एक को सीखने के बाद, बाकी को सीखना आसान हो जाएगा। सभी का एक ही बड़ा विचार है: उनकी संबंधित श्रेणियों की एक सूची बनाएं और फिर उन्हें वह कमांड पास करें जिसे आप चलाना चाहते हैं।

## आर्ग्यूमेंट सूची

आर्ग्यूमेंट सूची सबसे बुनियादी सूची है। यह फ़ाइलों की एक सूची बनाती है। फ़ाइल1, फ़ाइल2, और फ़ाइल3 की सूची बनाने के लिए, आप चला सकते हैं:

```shell
:args file1 file2 file3
```

आप इसे एक वाइल्डकार्ड (`*`) भी पास कर सकते हैं, इसलिए यदि आप वर्तमान निर्देशिका में सभी `.js` फ़ाइलों की एक सूची बनाना चाहते हैं, तो चलाएं:

```shell
:args *.js
```

यदि आप वर्तमान निर्देशिका में "a" से शुरू होने वाली सभी Javascript फ़ाइलों की एक सूची बनाना चाहते हैं, तो चलाएं:

```shell
:args a*.js
```

वाइल्डकार्ड वर्तमान निर्देशिका में किसी भी फ़ाइल नाम के वर्ण के एक या अधिक से मेल खाता है, लेकिन यदि आपको किसी भी निर्देशिका में पुनरावृत्त रूप से खोजने की आवश्यकता है तो क्या करें? आप डबल वाइल्डकार्ड (`**`) का उपयोग कर सकते हैं। अपने वर्तमान स्थान के भीतर निर्देशिकाओं के अंदर सभी Javascript फ़ाइलों को प्राप्त करने के लिए, चलाएं:

```shell
:args **/*.js
```

एक बार जब आप `args` कमांड चलाते हैं, तो आपका वर्तमान बफर सूची में पहले आइटम पर स्विच हो जाएगा। आपने जो फ़ाइलों की सूची बनाई है, उसे देखने के लिए, चलाएं `:args`। एक बार जब आपने अपनी सूची बना ली, तो आप उन्हें पार कर सकते हैं। `:first` आपको सूची में पहले आइटम पर ले जाएगा। `:last` आपको अंतिम सूची पर ले जाएगा। सूची को एक समय में एक फ़ाइल आगे बढ़ाने के लिए, चलाएं `:next`। सूची को एक समय में एक फ़ाइल पीछे ले जाने के लिए, चलाएं `:prev`। एक समय में एक फ़ाइल आगे / पीछे ले जाने और परिवर्तनों को सहेजने के लिए, चलाएं `:wnext` और `:wprev`। नेविगेशन कमांड की बहुत सारी हैं। अधिक जानकारी के लिए `:h arglist` देखें।

आर्ग सूची उपयोगी है यदि आपको किसी विशेष प्रकार की फ़ाइल या कुछ फ़ाइलों को लक्षित करने की आवश्यकता है। शायद आपको सभी `yml` फ़ाइलों के अंदर "donut" को "pancake" में अपडेट करने की आवश्यकता है, आप कर सकते हैं:

```shell
:args **/*.yml
:argdo %s/donut/pancake/g | update
```

यदि आप `args` कमांड को फिर से चलाते हैं, तो यह पिछले सूची को बदल देगा। उदाहरण के लिए, यदि आपने पहले चलाया:

```shell
:args file1 file2 file3
```

मान लें कि ये फ़ाइलें मौजूद हैं, आपके पास अब `file1`, `file2`, और `file3` की एक सूची है। फिर आप यह चलाते हैं:

```shell
:args file4 file5
```

आपकी प्रारंभिक सूची `file1`, `file2`, और `file3` को `file4` और `file5` से बदल दिया गया है। यदि आपके पास आर्ग सूची में `file1`, `file2`, और `file3` हैं और आप अपनी प्रारंभिक फ़ाइलों की सूची में `file4` और `file5` *जोड़ना* चाहते हैं, तो `:arga` कमांड का उपयोग करें। चलाएं:

```shell
:arga file4 file5
```

अब आपके पास आर्ग सूची में `file1`, `file2`, `file3`, `file4`, और `file5` हैं।

यदि आप बिना किसी तर्क के `:arga` चलाते हैं, तो Vim आपके वर्तमान बफर को वर्तमान आर्ग सूची में जोड़ देगा। यदि आपके पास पहले से ही आर्ग सूची में `file1`, `file2`, और `file3` हैं और आपका वर्तमान बफर `file5` पर है, तो `:arga` चलाने से `file5` सूची में जोड़ दिया जाएगा।

एक बार जब आपके पास सूची हो, तो आप इसे अपनी पसंद के किसी भी कमांड-लाइन कमांड के साथ पास कर सकते हैं। आपने इसे प्रतिस्थापन के साथ होते हुए देखा है (`:argdo %s/donut/pancake/g`)। कुछ अन्य उदाहरण:
- आर्ग सूची में "dessert" वाले सभी पंक्तियों को हटाने के लिए, चलाएं `:argdo g/dessert/d`.
- आर्ग सूची में मैक्रो a (मान लें कि आपने मैक्रो a में कुछ रिकॉर्ड किया है) को निष्पादित करने के लिए, चलाएं `:argdo norm @a`.
- पहले पंक्ति पर फ़ाइल नाम के साथ "hello " लिखने के लिए, चलाएं `:argdo 0put='hello ' .. @:`.

एक बार जब आप समाप्त कर लें, तो उन्हें `:update` के साथ सहेजना न भूलें।

कभी-कभी आपको केवल आर्ग सूची के पहले n आइटम पर कमांड चलाने की आवश्यकता होती है। यदि ऐसा है, तो बस `argdo` कमांड को एक पता पास करें। उदाहरण के लिए, सूची से पहले 3 आइटम पर केवल प्रतिस्थापन कमांड चलाने के लिए, चलाएं `:1,3argdo %s/donut/pancake/g`।

## बफर सूची

जब आप नई फ़ाइलों को संपादित करते हैं, तो बफर सूची स्वाभाविक रूप से बनाई जाएगी क्योंकि हर बार जब आप एक नई फ़ाइल बनाते हैं / एक फ़ाइल खोलते हैं, तो Vim इसे एक बफर में सहेजता है (जब तक कि आप इसे स्पष्ट रूप से हटा न दें)। इसलिए यदि आपने पहले से 3 फ़ाइलें खोली हैं: `file1.rb file2.rb file3.rb`, तो आपके पास पहले से ही अपनी बफर सूची में 3 आइटम हैं। बफर सूची प्रदर्शित करने के लिए, चलाएं `:buffers` (वैकल्पिक: `:ls` या `:files`)। आगे और पीछे जाने के लिए, `:bnext` और `:bprev` का उपयोग करें। सूची से पहले और अंतिम बफर पर जाने के लिए, `:bfirst` और `:blast` का उपयोग करें (क्या आप अभी भी मज़े कर रहे हैं? :D)।

वैसे, यहाँ एक शानदार बफर ट्रिक है जो इस अध्याय से संबंधित नहीं है: यदि आपके पास अपनी बफर सूची में कई आइटम हैं, तो आप सभी को `:ball` (बफर सभी) के साथ दिखा सकते हैं। `ball` कमांड सभी बफर को क्षैतिज रूप से प्रदर्शित करता है। उन्हें लंबवत प्रदर्शित करने के लिए, चलाएं `:vertical ball`।

विषय पर वापस, सभी बफरों में संचालन चलाने की प्रक्रिया आर्ग सूची के समान है। एक बार जब आपने अपनी बफर सूची बना ली, तो आपको बस उन कमांडों को `:bufdo` के साथ जोड़ना है जो आप चलाना चाहते हैं, `:argdo` के बजाय। इसलिए यदि आप सभी बफरों में "donut" को "pancake" के साथ प्रतिस्थापित करना चाहते हैं और फिर परिवर्तनों को सहेजना चाहते हैं, तो चलाएं `:bufdo %s/donut/pancake/g | update`।

## विंडो और टैब सूची

विंडो और टैब सूची भी आर्ग और बफर सूची के समान हैं। केवल अंतर उनके संदर्भ और वाक्यविन्यास हैं।

विंडो संचालन प्रत्येक खुले विंडो पर किए जाते हैं और `:windo` के साथ किए जाते हैं। टैब संचालन प्रत्येक टैब पर किए जाते हैं जो आपने खोले हैं और `:tabdo` के साथ किए जाते हैं। अधिक जानकारी के लिए, `:h list-repeat`, `:h :windo`, और `:h :tabdo` देखें।

उदाहरण के लिए, यदि आपके पास तीन विंडो खुली हैं (आप `Ctrl-W v` के साथ एक ऊर्ध्वाधर विंडो और `Ctrl-W s` के साथ एक क्षैतिज विंडो खोल सकते हैं) और आप चलाते हैं `:windo 0put ='hello' . @%`, तो Vim सभी खुले विंडो में "hello" + फ़ाइल नाम आउटपुट करेगा।

## क्विकफिक्स सूची

पिछले अध्यायों (Ch3 और Ch19) में, मैंने क्विकफिक्स के बारे में बात की है। क्विकफिक्स के कई उपयोग हैं। कई लोकप्रिय प्लगइन्स क्विकफिक्स का उपयोग करते हैं, इसलिए उन्हें समझने के लिए अधिक समय बिताना अच्छा है।

यदि आप Vim में नए हैं, तो क्विकफिक्स एक नया अवधारणा हो सकता है। पुराने दिनों में जब आपको वास्तव में अपने कोड को स्पष्ट रूप से संकलित करना होता था, संकलन चरण के दौरान आपको त्रुटियों का सामना करना पड़ता था। इन त्रुटियों को प्रदर्शित करने के लिए, आपको एक विशेष विंडो की आवश्यकता होती थी। यहीं पर क्विकफिक्स आता है। जब आप अपने कोड को संकलित करते हैं, तो Vim त्रुटि संदेशों को क्विकफिक्स विंडो में प्रदर्शित करता है ताकि आप उन्हें बाद में ठीक कर सकें। कई आधुनिक भाषाओं को अब स्पष्ट संकलन की आवश्यकता नहीं होती है, लेकिन इससे क्विकफिक्स अप्रचलित नहीं होता। आजकल, लोग क्विकफिक्स का उपयोग विभिन्न चीजों के लिए करते हैं, जैसे कि एक आभासी टर्मिनल आउटपुट प्रदर्शित करना और खोज परिणामों को संग्रहीत करना। चलिए बाद वाले पर ध्यान केंद्रित करते हैं, खोज परिणामों को संग्रहीत करना।

संकलन कमांड के अलावा, कुछ Vim कमांड क्विकफिक्स इंटरफेस पर निर्भर करते हैं। एक प्रकार का कमांड जो क्विकफिक्स का भारी उपयोग करता है, वह है खोज कमांड। दोनों `:vimgrep` और `:grep` डिफ़ॉल्ट रूप से क्विकफिक्स का उपयोग करते हैं।

उदाहरण के लिए, यदि आपको सभी Javascript फ़ाइलों में "donut" की खोज करने की आवश्यकता है, तो आप चला सकते हैं:

```shell
:vimgrep /donut/ **/*.js
```

"donut" खोज के परिणाम क्विकफिक्स विंडो में संग्रहीत होते हैं। इन मेल परिणामों की क्विकफिक्स विंडो देखने के लिए, चलाएं:

```shell
:copen
```

इसे बंद करने के लिए, चलाएं:

```shell
:cclose
```

क्विकफिक्स सूची को आगे और पीछे पार करने के लिए, चलाएं:

```shell
:cnext
:cprev
```

मेल में पहले और अंतिम आइटम पर जाने के लिए, चलाएं:

```shell
:cfirst
:clast
```

पहले मैंने उल्लेख किया था कि दो क्विकफिक्स कमांड हैं: `cdo` और `cfdo`। वे कैसे भिन्न हैं? `cdo` क्विकफिक्स सूची में प्रत्येक आइटम के लिए कमांड निष्पादित करता है जबकि `cfdo` क्विकफिक्स सूची में प्रत्येक *फ़ाइल* के लिए कमांड निष्पादित करता है।

मुझे स्पष्ट करने दें। मान लीजिए कि ऊपर `vimgrep` कमांड चलाने के बाद, आपको मिला:
- `file1.js` में 1 परिणाम
- `file2.js` में 10 परिणाम

यदि आप चलाते हैं `:cfdo %s/donut/pancake/g`, तो यह प्रभावी रूप से `file1.js` में एक बार और `file2.js` में एक बार `%s/donut/pancake/g` चलाएगा। यह मेल में फ़ाइलों की संख्या के अनुसार *जितनी बार चलाता है*। चूंकि परिणामों में दो फ़ाइलें हैं, Vim `file1.js` पर एक बार और `file2.js` पर एक बार प्रतिस्थापन कमांड चलाता है, भले ही दूसरी फ़ाइल में 10 मेल हों। `cfdo` केवल इस बात की परवाह करता है कि क्विकफिक्स सूची में कुल कितनी फ़ाइलें हैं।

यदि आप चलाते हैं `:cdo %s/donut/pancake/g`, तो यह प्रभावी रूप से `file1.js` में एक बार और `file2.js` में *दस बार* `%s/donut/pancake/g` चलाएगा। यह क्विकफिक्स सूची में वास्तविक आइटम की संख्या के अनुसार जितनी बार चलाता है। चूंकि `file1.js` में केवल एक मेल पाया गया है और `file2.js` में 10 मेल पाए गए हैं, यह कुल 11 बार चलेगा।

चूंकि आपने `%s/donut/pancake/g` चलाया है, इसलिए `cfdo` का उपयोग करना समझ में आता है। `cdo` का उपयोग करना समझ में नहीं आता क्योंकि यह `file2.js` में `%s/donut/pancake/g` को दस बार चलाएगा (`%s` एक फ़ाइल-व्यापी प्रतिस्थापन है)। प्रत्येक फ़ाइल में `%s` को एक बार चलाना पर्याप्त है। यदि आपने `cdo` का उपयोग किया, तो इसे `s/donut/pancake/g` के साथ पास करना अधिक समझ में आता।

`cfdo` या `cdo` का उपयोग करने का निर्णय लेते समय, उस कमांड के दायरे के बारे में सोचें जिसे आप इसे पास कर रहे हैं। क्या यह एक फ़ाइल-व्यापी कमांड है (जैसे `:%s` या `:g`) या यह एक पंक्ति-वार कमांड है (जैसे `:s` या `:!`)?

## स्थान सूची

स्थान सूची क्विकफिक्स सूची के समान है इस अर्थ में कि Vim संदेश प्रदर्शित करने के लिए एक विशेष विंडो का उपयोग करता है। क्विकफिक्स सूची और स्थान सूची के बीच का अंतर यह है कि किसी भी समय, आपके पास केवल एक क्विकफिक्स सूची हो सकती है, जबकि आपके पास जितनी चाहें उतनी स्थान सूची हो सकती है।

मान लीजिए कि आपके पास दो विंडो खुली हैं, एक विंडो `food.txt` प्रदर्शित कर रही है और दूसरी `drinks.txt` प्रदर्शित कर रही है। `food.txt` के अंदर से, आप एक स्थान-सूची खोज कमांड `:lvimgrep` चलाते हैं (यह `:vimgrep` कमांड के लिए स्थान का रूप):

```shell
:lvim /bagel/ **/*.md
```

Vim उस `food.txt` *विंडो* के लिए सभी बैगेल खोज मेल के लिए एक स्थान सूची बनाएगा। आप स्थान सूची को `:lopen` के साथ देख सकते हैं। अब दूसरी विंडो `drinks.txt` पर जाएं और चलाएं:

```shell
:lvimgrep /milk/ **/*.md
```

Vim उस `drinks.txt` *विंडो* के लिए सभी दूध खोज परिणामों के साथ एक *अलग* स्थान सूची बनाएगा।

आप प्रत्येक विंडो में चलाए गए प्रत्येक स्थान-कमांड के लिए, Vim एक विशिष्ट स्थान सूची बनाता है। यदि आपके पास 10 विभिन्न विंडो हैं, तो आपके पास 10 अलग-अलग स्थान सूचियाँ हो सकती हैं। इसके विपरीत, क्विकफिक्स सूची में आपके पास केवल एक ही हो सकती है। यदि आपके पास 10 विभिन्न विंडो हैं, तो आपके पास अभी भी केवल एक क्विकफिक्स सूची होगी।

स्थान सूची के अधिकांश कमांड क्विकफिक्स कमांड के समान होते हैं, सिवाय इसके कि वे इसके बजाय `l-` से पूर्ववर्ती होते हैं। उदाहरण के लिए: `:lvimgrep`, `:lgrep`, और `:lmake` बनाम `:vimgrep`, `:grep`, और `:make`। स्थान सूची विंडो को संचालित करने के लिए, फिर से, कमांड क्विकफिक्स कमांड के समान दिखते हैं `:lopen`, `:lclose`, `:lfirst`, `:llast`, `:lnext`, और `:lprev` बनाम `:copen`, `:cclose`, `:cfirst`, `:clast`, `:cnext`, और `:cprev`।

दो स्थान सूची बहु-फ़ाइल कमांड भी क्विकफिक्स बहु-फ़ाइल कमांड के समान होते हैं: `:ldo` और `:lfdo`। `:ldo` प्रत्येक स्थान सूची में स्थान कमांड को निष्पादित करता है जबकि `:lfdo` स्थान सूची कमांड को स्थान सूची में प्रत्येक फ़ाइल के लिए निष्पादित करता है। अधिक जानकारी के लिए, `:h location-list` देखें।
## Vim में मल्टी-फाइल ऑपरेशंस चलाना

मल्टीपल फाइल ऑपरेशन करना एक उपयोगी कौशल है। जब भी आपको कई फाइलों में एक वेरिएबल का नाम बदलने की आवश्यकता होती है, तो आप उन्हें एक बार में निष्पादित करना चाहते हैं। Vim में इसे करने के लिए आठ अलग-अलग तरीके हैं।

व्यवहार में, आप शायद सभी आठ का समान रूप से उपयोग नहीं करेंगे। आप एक या दो की ओर झुकेंगे। जब आप शुरुआत कर रहे हैं, तो एक चुनें (मैं व्यक्तिगत रूप से `:argdo` के साथ शुरू करने की सलाह देता हूँ) और इसे मास्टर करें। जब आप एक के साथ सहज हो जाएं, तो फिर अगले को सीखें। आप पाएंगे कि दूसरे, तीसरे, चौथे को सीखना आसान हो जाता है। रचनात्मक बनें। इसे विभिन्न संयोजनों के साथ उपयोग करें। अभ्यास करते रहें जब तक कि आप इसे बिना किसी कठिनाई और अधिक सोचे समझे नहीं कर सकें। इसे अपने मांसपेशियों की याददाश्त का हिस्सा बनाएं।

यह कहते हुए, आपने Vim संपादन में महारत हासिल कर ली है। बधाई हो!