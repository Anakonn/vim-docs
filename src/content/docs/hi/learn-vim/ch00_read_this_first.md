---
description: यह गाइड शुरुआती उपयोगकर्ताओं के लिए है, जो Vim के मुख्य फीचर्स को सरलता
  से समझाने और सीखने में मदद करती है। उदाहरणों के साथ उपयोगी जानकारी प्रदान करती है।
title: Ch00. Read This First
---

## इस गाइड को क्यों लिखा गया

Vim सीखने के लिए कई स्थान हैं: `vimtutor` शुरू करने के लिए एक बेहतरीन जगह है और `:help` मैनुअल में सभी संदर्भ हैं जिनकी आपको कभी आवश्यकता होगी।

हालांकि, औसत उपयोगकर्ता को `vimtutor` से कुछ अधिक और `:help` मैनुअल से कम की आवश्यकता होती है। यह गाइड उस अंतर को पाटने का प्रयास करती है, केवल प्रमुख विशेषताओं को उजागर करके ताकि आप सबसे उपयोगी भागों को सबसे कम समय में सीख सकें।

संभावना है कि आपको Vim की 100% विशेषताओं की आवश्यकता नहीं होगी। आपको शायद केवल 20% के बारे में जानने की आवश्यकता है ताकि आप एक शक्तिशाली Vimmer बन सकें। यह गाइड आपको दिखाएगी कि कौन सी Vim विशेषताएँ आपके लिए सबसे उपयोगी होंगी।

यह एक राय आधारित गाइड है। इसमें तकनीकें शामिल हैं जो मैं अक्सर Vim का उपयोग करते समय उपयोग करता हूँ। अध्यायों को इस आधार पर क्रमबद्ध किया गया है कि मुझे क्या लगता है कि एक शुरुआती के लिए Vim सीखने के लिए सबसे तार्किक होगा।

यह गाइड उदाहरणों से भरी हुई है। जब आप एक नई कौशल सीखते हैं, तो उदाहरण अनिवार्य होते हैं, कई उदाहरण इन अवधारणाओं को अधिक प्रभावी ढंग से मजबूत करेंगे।

आप में से कुछ लोग सोच सकते हैं कि आपको Vimscript क्यों सीखने की आवश्यकता है? Vim का उपयोग करते हुए मेरे पहले वर्ष में, मैं केवल Vim का उपयोग करना जानकर संतुष्ट था। समय बीतने के साथ, मुझे अपनी विशिष्ट संपादन आवश्यकताओं के लिए कस्टम कमांड लिखने के लिए Vimscript की अधिक से अधिक आवश्यकता होने लगी। जैसे-जैसे आप Vim में महारत हासिल कर रहे हैं, आपको जल्द या बाद में Vimscript सीखने की आवश्यकता होगी। तो क्यों न जल्द? Vimscript एक छोटी भाषा है। आप इस गाइड के केवल चार अध्यायों में इसके मूल बातें सीख सकते हैं।

आप बिना किसी Vimscript को जाने Vim का उपयोग करके दूर जा सकते हैं, लेकिन इसे जानने से आपको और भी आगे बढ़ने में मदद मिलेगी।

यह गाइड शुरुआती और उन्नत Vimmers दोनों के लिए लिखी गई है। यह व्यापक और सरल अवधारणाओं से शुरू होती है और विशिष्ट और उन्नत अवधारणाओं के साथ समाप्त होती है। यदि आप पहले से ही एक उन्नत उपयोगकर्ता हैं, तो मैं आपको इस गाइड को शुरू से अंत तक पढ़ने के लिए प्रोत्साहित करूंगा, क्योंकि आप कुछ नया सीखेंगे!

## एक अलग टेक्स्ट संपादक से Vim में कैसे संक्रमण करें

Vim सीखना एक संतोषजनक अनुभव है, हालांकि यह कठिन है। Vim सीखने के दो मुख्य दृष्टिकोण हैं:

1. ठंडा टर्की
2. क्रमिक

ठंडा टर्की जाने का मतलब है कि आप जिस संपादक / IDE का उपयोग कर रहे थे, उसका उपयोग बंद कर दें और अब से केवल Vim का उपयोग करें। इस विधि का नकारात्मक पहलू यह है कि पहले एक या दो सप्ताह के दौरान आपकी उत्पादकता में गंभीर कमी आएगी। यदि आप एक पूर्णकालिक प्रोग्रामर हैं, तो यह विधि संभवतः व्यवहार्य नहीं हो सकती। इसलिए अधिकांश लोगों के लिए, मुझे लगता है कि Vim में संक्रमण करने का सबसे अच्छा तरीका इसे क्रमिक रूप से उपयोग करना है।

क्रमिक रूप से Vim का उपयोग करने के लिए, पहले दो सप्ताह के दौरान, दिन में एक घंटे तक Vim का उपयोग करें जबकि बाकी समय आप अन्य संपादकों का उपयोग कर सकते हैं। कई आधुनिक संपादकों में Vim प्लगइन्स होते हैं। जब मैंने पहली बार शुरुआत की, तो मैंने VSCode के लोकप्रिय Vim प्लगइन का एक घंटे तक उपयोग किया। मैंने धीरे-धीरे Vim प्लगइन के साथ समय बढ़ाया जब तक कि मैंने अंततः इसे पूरे दिन उपयोग नहीं किया। ध्यान रखें कि ये प्लगइन केवल Vim की विशेषताओं का एक अंश ही अनुकरण कर सकते हैं। Vimscript, कमांड-लाइन (Ex) कमांड, और बाहरी कमांड एकीकरण जैसी Vim की पूरी शक्ति का अनुभव करने के लिए, आपको स्वयं Vim का उपयोग करना होगा।

दो महत्वपूर्ण क्षण थे जिन्होंने मुझे 100% Vim का उपयोग करना शुरू करने के लिए प्रेरित किया: जब मैंने समझा कि Vim की एक व्याकरण-जैसी संरचना है (अध्याय 4 देखें) और [fzf.vim](https://github.com/junegunn/fzf.vim) प्लगइन (अध्याय 3 देखें)।

पहला, जब मैंने Vim की व्याकरण-जैसी संरचना को समझा, तो वह निर्णायक क्षण था जब मैंने अंततः समझा कि ये Vim उपयोगकर्ता किस बारे में बात कर रहे थे। मुझे सैकड़ों अद्वितीय कमांड सीखने की आवश्यकता नहीं थी। मुझे केवल कुछ कमांड सीखने थे और मैं बहुत सहज तरीके से कई चीजें करने के लिए उन्हें जोड़ सकता था।

दूसरा, फजी फ़ाइल-खोज को जल्दी से चलाने की क्षमता वह IDE विशेषता थी जिसका मैंने सबसे अधिक उपयोग किया। जब मैंने Vim में ऐसा करना सीखा, तो मुझे एक बड़ा गति लाभ मिला और तब से मैंने कभी पीछे मुड़कर नहीं देखा।

हर कोई अलग तरीके से प्रोग्राम करता है। आत्म-निरीक्षण करने पर, आप पाएंगे कि आपके पसंदीदा संपादक / IDE में एक या दो विशेषताएँ हैं जिनका आप हमेशा उपयोग करते हैं। शायद यह फजी-खोज, परिभाषा पर कूदना, या त्वरित संकलन था। जो भी हो, उन्हें जल्दी से पहचानें और सीखें कि उन्हें Vim में कैसे लागू किया जाए (संभावना है कि Vim शायद उन्हें भी कर सकता है)। आपकी संपादन गति को एक बड़ा बढ़ावा मिलेगा।

एक बार जब आप मूल गति के 50% पर संपादित कर सकते हैं, तो यह पूर्णकालिक Vim पर जाने का समय है।

## इस गाइड को कैसे पढ़ें

यह एक व्यावहारिक गाइड है। Vim में अच्छे बनने के लिए आपको अपनी मांसपेशियों की स्मृति विकसित करनी होगी, न कि सिर का ज्ञान।

आप एक बाइक चलाना सीखते हैं एक गाइड पढ़कर कि बाइक कैसे चलानी है। आपको वास्तव में बाइक चलानी होगी।

आपको इस गाइड में संदर्भित हर कमांड को टाइप करना होगा। न केवल यह, बल्कि आपको उन्हें कई बार दोहराना होगा और विभिन्न संयोजनों का प्रयास करना होगा। देखें कि जिस कमांड को आपने अभी सीखा है, उसमें और कौन सी विशेषताएँ हैं। `:help` कमांड और खोज इंजन आपके सबसे अच्छे दोस्त हैं। आपका लक्ष्य कमांड के बारे में सब कुछ जानना नहीं है, बल्कि उस कमांड को स्वाभाविक और सहज रूप से निष्पादित करने में सक्षम होना है।

जितना मैं इस गाइड को रैखिक बनाने की कोशिश करता हूँ, कुछ अवधारणाएँ इस गाइड में अव्यवस्थित रूप से प्रस्तुत की जानी चाहिए। उदाहरण के लिए, अध्याय 1 में, मैं प्रतिस्थापन कमांड (`:s`) का उल्लेख करता हूँ, भले ही इसे अध्याय 12 में कवर नहीं किया जाएगा। इसे सुधारने के लिए, जब भी कोई नई अवधारणा जो अभी तक कवर नहीं की गई है, जल्दी से उल्लेख की जाती है, मैं बिना विस्तृत स्पष्टीकरण के एक त्वरित कैसे-करें गाइड प्रदान करूंगा। तो कृपया मेरे साथ धैर्य रखें :).

## अधिक सहायता

यहाँ मदद मैनुअल का उपयोग करने के लिए एक अतिरिक्त टिप है: मान लीजिए कि आप जानना चाहते हैं कि `Ctrl-P` इनसर्ट मोड में क्या करता है। यदि आप केवल `:h CTRL-P` के लिए खोज करते हैं, तो आपको सामान्य मोड के `Ctrl-P` पर निर्देशित किया जाएगा। यह वह `Ctrl-P` मदद नहीं है जिसकी आप तलाश कर रहे हैं। इस मामले में, इसके बजाय `:h i_CTRL-P` के लिए खोजें। जोड़ा गया `i_` इनसर्ट मोड का प्रतिनिधित्व करता है। ध्यान दें कि यह किस मोड से संबंधित है।

## सिंटैक्स

कमांड या कोड से संबंधित अधिकांश वाक्यांश कोड-केस में होते हैं (`like this`)।

स्ट्रिंग्स को एक जोड़ी डबल-क्वोट्स ("like this") से घेर लिया जाता है।

Vim कमांड को संक्षिप्त किया जा सकता है। उदाहरण के लिए, `:join` को `:j` के रूप में संक्षिप्त किया जा सकता है। गाइड में, मैं संक्षिप्त और विस्तृत विवरणों को मिलाने जा रहा हूँ। उन कमांड के लिए जो इस गाइड में अक्सर उपयोग नहीं होते हैं, मैं विस्तृत संस्करण का उपयोग करूंगा। उन कमांड के लिए जो अक्सर उपयोग होते हैं, मैं संक्षिप्त संस्करण का उपयोग करूंगा। मैं असंगतताओं के लिए क्षमा चाहता हूँ। सामान्यत: जब भी आप एक नया कमांड देखें, तो हमेशा `:help` पर इसकी संक्षिप्तियों की जांच करें।

## Vimrc

गाइड में विभिन्न बिंदुओं पर, मैं vimrc विकल्पों का उल्लेख करूंगा। यदि आप Vim में नए हैं, तो vimrc एक कॉन्फ़िग फ़ाइल की तरह है।

Vimrc को अध्याय 21 तक कवर नहीं किया जाएगा। स्पष्टता के लिए, मैं यहाँ संक्षेप में दिखाऊंगा कि इसे कैसे सेटअप किया जाए।

मान लीजिए कि आपको संख्या विकल्प सेट करने की आवश्यकता है (`set number`)। यदि आपके पास पहले से एक vimrc नहीं है, तो एक बनाएं। यह आमतौर पर आपके होम डायरेक्टरी में स्थित होता है और इसका नाम `.vimrc` होता है। आपके OS के आधार पर, स्थान भिन्न हो सकता है। macOS में, मेरे पास यह `~/.vimrc` पर है। यह देखने के लिए कि आपको अपना कहाँ रखना चाहिए, `:h vimrc` देखें।

इसके अंदर, `set number` जोड़ें। इसे सहेजें (`:w`), फिर इसे स्रोत करें (`:source %`)। अब आपको बाईं ओर लाइन नंबर दिखाई देने चाहिए।

वैकल्पिक रूप से, यदि आप स्थायी सेटिंग परिवर्तन नहीं करना चाहते हैं, तो आप हमेशा `set` कमांड को इनलाइन चला सकते हैं, `:set number` चलाकर। इस दृष्टिकोण का नकारात्मक पहलू यह है कि यह सेटिंग अस्थायी है। जब आप Vim बंद करते हैं, तो यह विकल्प गायब हो जाता है।

चूंकि हम Vim के बारे में सीख रहे हैं और Vi के बारे में नहीं, एक सेटिंग जो आपके पास होनी चाहिए वह है `nocompatible` विकल्प। अपने vimrc में `set nocompatible` जोड़ें। जब यह `compatible` विकल्प पर चल रहा होता है, तो कई Vim-विशिष्ट विशेषताएँ अक्षम होती हैं।

सामान्यत: जब भी कोई अनुच्छेद vimrc विकल्प का उल्लेख करता है, तो बस उस विकल्प को vimrc में जोड़ें, इसे सहेजें, और स्रोत करें।

## भविष्य, त्रुटियाँ, प्रश्न

भविष्य में अधिक अपडेट की अपेक्षा करें। यदि आप कोई त्रुटियाँ पाते हैं या आपके कोई प्रश्न हैं, तो कृपया बेझिझक संपर्क करें।

मैंने कुछ और आगामी अध्यायों की योजना बनाई है, इसलिए जुड़े रहें!

## मुझे और Vim ट्रिक्स चाहिए

Vim के बारे में अधिक जानने के लिए, कृपया [@learnvim](https://twitter.com/learnvim) का अनुसरण करें।

## धन्यवाद

यह गाइड Bram Moleenar के बिना संभव नहीं होता, जिन्होंने Vim बनाया, मेरी पत्नी जिसने यात्रा के दौरान बहुत धैर्य और समर्थन दिया, सभी [योगदानकर्ताओं](https://github.com/iggredible/Learn-Vim/graphs/contributors) का learn-vim प्रोजेक्ट, Vim समुदाय, और कई, कई अन्य जो उल्लेख नहीं किए गए।

धन्यवाद। आप सभी ने टेक्स्ट संपादन को मजेदार बनाने में मदद की :)