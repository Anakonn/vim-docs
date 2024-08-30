---
description: Lär dig att använda Vim-fällor för att dölja irrelevant text och förbättra
  läsbarheten i filer genom olika metoder för att skapa och hantera fällor.
title: Ch17. Fold
---

När du läser en fil finns det ofta många irrelevanta texter som hindrar dig från att förstå vad filen gör. För att dölja det onödiga bruset, använd Vim fold.

I detta kapitel kommer du att lära dig olika sätt att fälla en fil.

## Manuell Fällning

Tänk dig att du viker ett ark papper för att täcka över viss text. Den faktiska texten försvinner inte, den är fortfarande där. Vim fold fungerar på samma sätt. Det viker ett textområde och döljer det från visning utan att faktiskt ta bort det.

Fälloperatorn är `z` (när ett papper är vikt, har det formen av bokstaven z).

Anta att du har denna text:

```shell
Fäll mig
Håll mig
```

Med markören på den första raden, skriv `zfj`. Vim viker båda raderna till en. Du bör se något som detta:

```shell
+-- 2 rader: Fäll mig -----
```

Här är uppdelningen:
- `zf` är fälloperatorn.
- `j` är rörelsen för fälloperatorn.

Du kan öppna en vikt text med `zo`. För att stänga fällningen, använd `zc`.

Fällning är en operator, så den följer grammatikregeln (`verb + substantiv`). Du kan använda fälloperatorn med en rörelse eller textobjekt. För att fälla ett inre stycke, kör `zfip`. För att fälla till slutet av en fil, kör `zfG`. För att fälla texterna mellan `{` och `}`, kör `zfa{`.

Du kan fälla från visuell läge. Markera området du vill fälla (`v`, `V` eller `Ctrl-v`), kör sedan `zf`.

Du kan utföra en fällning från kommandoradsläge med kommandot `:fold`. För att fälla den aktuella raden och raden efter den, kör:

```shell
:,+1fold
```

`,+1` är intervallet. Om du inte anger parametrar för intervallet, standardinställs det till den aktuella raden. `+1` är intervallindikatorn för nästa rad. För att fälla raderna 5 till 10, kör `:5,10fold`. För att fälla från den aktuella positionen till slutet av raden, kör `:,$fold`.

Det finns många andra fäll- och utfällningskommandon. Jag tycker att de är för många att komma ihåg när man börjar. De mest användbara är:
- `zR` för att öppna alla fällningar.
- `zM` för att stänga alla fällningar.
- `za` växlar en fällning.

Du kan köra `zR` och `zM` på vilken rad som helst, men `za` fungerar endast när du är på en vikt / utfälld rad. För att lära dig mer om fällningskommandon, kolla in `:h fold-commands`.

## Olika Fällmetoder

Avsnittet ovan täcker Vims manuella fällning. Det finns sex olika fällmetoder i Vim:
1. Manuell
2. Indent
3. Uttryck
4. Syntax
5. Diff
6. Markör

För att se vilken fällmetod du för närvarande använder, kör `:set foldmethod?`. Som standard använder Vim metoden `manuell`.

I resten av kapitlet kommer du att lära dig de andra fem fällmetoderna. Låt oss börja med indenterad fällning.

## Indent Fällning

För att använda en indenterad fällning, ändra `'foldmethod'` till indent:

```shell
:set foldmethod=indent
```

Anta att du har texten:

```shell
En
  Två
  Två igen
```

Om du kör `:set foldmethod=indent`, kommer du att se:

```shell
En
+-- 2 rader: Två -----
```

Med indenterad fällning, tittar Vim på hur många mellanslag varje rad har i början och jämför det med alternativet `'shiftwidth'` för att avgöra dess fällbarhet. `'shiftwidth'` returnerar antalet mellanslag som krävs för varje steg av indenteringen. Om du kör:

```shell
:set shiftwidth?
```

Vims standardvärde för `'shiftwidth'` är 2. På texten ovan finns det två mellanslag mellan början av raden och texten "Två" och "Två igen". När Vim ser antalet mellanslag och att värdet för `'shiftwidth'` är 2, anser Vim att den raden har en indenterad fällningsnivå av ett.

Anta att det denna gång bara finns ett mellanslag mellan början av raden och texten:

```shell
En
 Två
 Två igen
```

Just nu, om du kör `:set foldmethod=indent`, fäller inte Vim den indenterade raden eftersom det inte finns tillräckligt med utrymme på varje rad. Ett mellanslag anses inte vara en indentering. Men om du ändrar `'shiftwidth'` till 1:

```shell
:set shiftwidth=1
```

Texten är nu fällbar. Det anses nu vara en indentering.

Återställ `shiftwidth` tillbaka till 2 och mellanslagen mellan texterna till två igen. Dessutom, lägg till två ytterligare texter:

```shell
En
  Två
  Två igen
    Tre
    Tre igen
```

Kör fällning (`zM`), så kommer du att se:

```shell
En
+-- 4 rader: Två -----
```

Utfäll de vikta raderna (`zR`), sätt sedan markören på "Tre" och växla textens fällningstillstånd (`za`):

```shell
En
  Två
  Två igen
+-- 2 rader: Tre -----
```

Vad är detta? En fällning inom en fällning?

Nästlade fällningar är giltiga. Texten "Två" och "Två igen" har fällningsnivå av ett. Texten "Tre" och "Tre igen" har fällningsnivå av två. Om du har en fällbar text med en högre fällningsnivå inom en fällbar text, kommer du att ha flera fällningslager.

## Uttrycks Fällning

Uttrycks fällning tillåter dig att definiera ett uttryck för att matcha en fällning. Efter att du har definierat fällningsuttrycken, skannar Vim varje rad för värdet av `'foldexpr'`. Detta är variabeln som du måste konfigurera för att returnera rätt värde. Om `'foldexpr'` returnerar 0, så fälls inte raden. Om det returnerar 1, så har den raden en fällningsnivå av 1. Om det returnerar 2, så har den raden en fällningsnivå av 2. Det finns fler värden än heltal, men jag kommer inte att gå igenom dem. Om du är nyfiken, kolla in `:h fold-expr`.

Först, låt oss ändra fällmetoden:

```shell
:set foldmethod=expr
```

Anta att du har en lista med frukostmat och du vill fälla alla frukostobjekt som börjar med "p":

```shell
donut
pannkaka
pop-tarts
proteinstång
lax
scrambled eggs
```

Ändra sedan `foldexpr` för att fånga uttrycken som börjar med "p":

```shell
:set foldexpr=getline(v:lnum)[0]==\\"p\\"
```

Uttrycket ovan ser komplicerat ut. Låt oss bryta ner det:
- `:set foldexpr` ställer in alternativet `'foldexpr'` för att acceptera ett anpassat uttryck.
- `getline()` är en Vimscript-funktion som returnerar innehållet i en given rad. Om du kör `:echo getline(5)`, kommer det att returnera innehållet i rad 5.
- `v:lnum` är Vims specialvariabel för `'foldexpr'` uttrycket. Vim skannar varje rad och vid det tillfället lagrar varje radnummer i variabeln `v:lnum`. På rad 5 har `v:lnum` värdet 5. På rad 10 har `v:lnum` värdet 10.
- `[0]` i sammanhanget av `getline(v:lnum)[0]` är den första bokstaven i varje rad. När Vim skannar en rad, returnerar `getline(v:lnum)` innehållet i varje rad. `getline(v:lnum)[0]` returnerar den första bokstaven i varje rad. På den första raden i vår lista, "donut", returnerar `getline(v:lnum)[0]` "d". På den andra raden i vår lista, "pannkaka", returnerar `getline(v:lnum)[0]` "p".
- `==\\"p\\"` är den andra halvan av likhetsuttrycket. Det kontrollerar om det uttryck du just utvärderade är lika med "p". Om det är sant, returnerar det 1. Om det är falskt, returnerar det 0. I Vim är 1 sant och 0 falskt. Så på de rader som börjar med "p", returnerar det 1. Kom ihåg att om en `'foldexpr'` har ett värde av 1, så har den en fällningsnivå av 1.

Efter att ha kört detta uttryck, bör du se:

```shell
donut
+-- 3 rader: pannkaka -----
lax
scrambled eggs
```

## Syntax Fällning

Syntaxfällning bestäms av syntaxspråkets färgning. Om du använder ett språkssyntax-plugin som [vim-polyglot](https://github.com/sheerun/vim-polyglot), kommer syntaxfällningen att fungera direkt. Ändra bara fällmetoden till syntax:

```shell
:set foldmethod=syntax
```

Låt oss anta att du redigerar en JavaScript-fil och har vim-polyglot installerad. Om du har en array som följande:

```shell
const nums = [
  ett,
  två,
  tre,
  fyra
]
```

Det kommer att fällas med en syntaxfällning. När du definierar en syntaxfärgning för ett särskilt språk (vanligtvis inuti `syntax/`-katalogen), kan du lägga till en `fold`-attribut för att göra den fällbar. Nedan är ett utdrag från vim-polyglot JavaScript-syntaxfil. Lägg märke till `fold`-nyckelordet i slutet.

```shell
syntax region  jsBracket                      matchgroup=jsBrackets            start=/\[/ end=/\]/ contains=@jsExpression,jsSpreadExpression extend fold
```

Denna guide kommer inte att täcka `syntax`-funktionen. Om du är nyfiken, kolla in `:h syntax.txt`.

## Diff Fällning

Vim kan göra en diff-procedur för att jämföra två eller flera filer.

Om du har `file1.txt`:

```shell
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
```

Och `file2.txt`:

```shell
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
emacs är okej
```

Kör `vimdiff file1.txt file2.txt`:

```shell
+-- 3 rader: vim är fantastiskt -----
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
vim är fantastiskt
[vim är fantastiskt] / [emacs är okej]
```

Vim fäller automatiskt några av de identiska raderna. När du kör kommandot `vimdiff`, använder Vim automatiskt `foldmethod=diff`. Om du kör `:set foldmethod?`, kommer det att returnera `diff`.

## Markör Fällning

För att använda en markörfällning, kör:

```shell
:set foldmethod=marker
```

Anta att du har texten:

```shell
Hej

{{{
världen
vim
}}}
```

Kör `zM`, så kommer du att se:

```shell
hej

+-- 4 rader: -----
```

Vim ser `{{{` och `}}}` som fällindikatorer och viker texterna mellan dem. Med markörfällning letar Vim efter speciella markörer, definierade av alternativet `'foldmarker'`, för att markera fällområden. För att se vilka markörer Vim använder, kör:

```shell
:set foldmarker?
```

Som standard använder Vim `{{{` och `}}}` som indikatorer. Om du vill ändra indikatorn till andra texter, som "kaffe1" och "kaffe2":

```shell
:set foldmarker=kaffe1,kaffe2
```

Om du har texten:

```shell
hej

kaffe1
världen
vim
kaffe2
```

Nu använder Vim `kaffe1` och `kaffe2` som de nya fällmarkörerna. Som en sidoanteckning måste en indikator vara en bokstavlig sträng och kan inte vara en regex.

## Bevara Fällning

Du förlorar all fällinformation när du stänger Vim-sessionen. Om du har denna fil, `count.txt`:

```shell
ett
två
tre
fyra
fem
```

Gör då en manuell fällning från raden "tre" neråt (`:3,$fold`):

```shell
ett
två
+-- 3 rader: tre ---
```

När du avslutar Vim och öppnar `count.txt` igen, finns inte fällningarna kvar!

För att bevara fällningarna, kör efter fällningen:

```shell
:mkview
```

När du öppnar `count.txt`, kör:

```shell
:loadview
```

Dina fällningar återställs. Men du måste manuellt köra `mkview` och `loadview`. Jag vet att en av dessa dagar kommer jag att glömma att köra `mkview` innan jag stänger filen och jag kommer att förlora alla fällningar. Hur kan vi automatisera denna process?

För att automatiskt köra `mkview` när du stänger en `.txt`-fil och köra `loadview` när du öppnar en `.txt`-fil, lägg till detta i din vimrc:

```shell
autocmd BufWinLeave *.txt mkview
autocmd BufWinEnter *.txt silent loadview
```

Kom ihåg att `autocmd` används för att köra ett kommando vid en händelseutlösare. De två händelserna här är:
- `BufWinLeave` för när du tar bort en buffert från ett fönster.
- `BufWinEnter` för när du laddar en buffert i ett fönster.

Nu, efter att du har fält inuti en `.txt`-fil och avslutat Vim, kommer nästa gång du öppnar den filen, din fällningsinformation att återställas.

Som standard sparar Vim fällningsinformationen när du kör `mkview` inuti `~/.vim/view` för Unix-systemet. För mer information, kolla in `:h 'viewdir'`.
## Lär dig Fäll på det Smartaste Sättet

När jag först började använda Vim, försummade jag att lära mig fällning eftersom jag inte tyckte att det var användbart. Men ju längre jag kodar, desto mer användbar finner jag att fällning är. Strategiskt placerade fällningar kan ge dig en bättre översikt över textstrukturen, som en boks innehållsförteckning.

När du lär dig fällning, börja med den manuella fällningen eftersom den kan användas på språng. Lär dig sedan gradvis olika knep för att göra indenterings- och markeringsfällningar. Slutligen, lär dig hur man gör syntax- och uttrycksfällningar. Du kan till och med använda de två sistnämnda för att skriva dina egna Vim-plugins.