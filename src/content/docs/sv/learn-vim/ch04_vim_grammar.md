---
description: Denna guide hjälper dig att förstå Vim-kommandon genom att bryta ner
  deras grammatiska struktur, vilket gör det enklare att "tala" Vim-språket.
title: Ch04. Vim Grammar
---

Det är lätt att bli skrämd av komplexiteten i Vim-kommandon. Om du ser en Vim-användare göra `gUfV` eller `1GdG`, kanske du inte omedelbart vet vad dessa kommandon gör. I detta kapitel kommer jag att bryta ner den allmänna strukturen av Vim-kommandon till en enkel grammatikregel.

Detta är det viktigaste kapitlet i hela guiden. När du förstår den underliggande grammatiska strukturen kommer du att kunna "prata" med Vim. Förresten, när jag säger *Vim-språk* i detta kapitel, pratar jag inte om Vimscript-språket (Vims inbyggda programmeringsspråk, som du kommer att lära dig om i senare kapitel).

## Hur man lär sig ett språk

Jag är inte en infödd engelsktalande. Jag lärde mig engelska när jag var 13 år och flyttade till USA. Det finns tre saker du behöver göra för att lära dig att tala ett nytt språk:

1. Lär dig grammatikregler.
2. Öka ordförrådet.
3. Öva, öva, öva.

På samma sätt, för att tala Vim-språk, behöver du lära dig grammatikregler, öka ordförrådet och öva tills du kan köra kommandona utan att tänka.

## Grammatikregel

Det finns bara en grammatikregel i Vim-språk:

```shell
verb + noun
```

Det är allt!

Detta är som att säga dessa engelska fraser:

- *"Ät (verb) en donut (noun)"*
- *"Sparka (verb) en boll (noun)"*
- *"Lär dig (verb) Vim-redigeraren (noun)"*

Nu behöver du bygga upp ditt ordförråd med grundläggande Vim-verb och substantiv.

## Substantiv (Rörelser)

Substantiv är Vim-rörelser. Rörelser används för att navigera i Vim. Nedan är en lista över några av Vim-rörelserna:

```shell
h    Vänster
j    Ner
k    Upp
l    Höger
w    Flytta fram till början av nästa ord
}    Hoppa till nästa stycke
$    Gå till slutet av raden
```

Du kommer att lära dig mer om rörelser i nästa kapitel, så oroa dig inte för mycket om du inte förstår några av dem.

## Verb (Operatorer)

Enligt `:h operator` har Vim 16 operatorer. Men enligt min erfarenhet är det tillräckligt att lära sig dessa 3 operatorer för 80% av mina redigeringsbehov:

```shell
y    Yank text (kopiera)
d    Ta bort text och spara till register
c    Ta bort text, spara till register och starta insättningsläge
```

Förresten, efter att du har yankat en text kan du klistra in den med `p` (efter markören) eller `P` (före markören).

## Verb och Substantiv

Nu när du känner till grundläggande substantiv och verb, låt oss tillämpa grammatikregeln, verb + substantiv! Anta att du har detta uttryck:

```javascript
const learn = "vim";
```

- För att yank allt från din nuvarande plats till slutet av raden: `y$`.
- För att ta bort från din nuvarande plats till början av nästa ord: `dw`.
- För att ändra från din nuvarande plats till slutet av det aktuella stycket, säg `c}`.

Rörelser accepterar också antal som argument (jag kommer att diskutera detta i nästa kapitel). Om du behöver gå upp 3 rader, istället för att trycka på `k` 3 gånger, kan du göra `3k`. Antal fungerar med Vim-grammatik.
- För att yank två tecken till vänster: `y2h`.
- För att ta bort de nästa två orden: `d2w`.
- För att ändra de nästa två raderna: `c2j`.

Just nu kanske du måste tänka länge och hårt för att utföra även ett enkelt kommando. Du är inte ensam. När jag först började hade jag liknande svårigheter men jag blev snabbare med tiden. Så kommer du också att bli. Upprepning, upprepning, upprepning.

Som en sidokommentar är radoperationer (operationer som påverkar hela raden) vanliga operationer i textredigering. Generellt, genom att skriva ett operator-kommando två gånger, utför Vim en radoperation för den åtgärden. Till exempel, `dd`, `yy`, och `cc` utför **borttagning**, **yank** och **ändring** på hela raden. Prova detta med andra operatorer!

Detta är verkligen coolt. Jag ser ett mönster här. Men jag är inte riktigt klar än. Vim har en typ av substantiv till: textobjekt.

## Fler Substantiv (Textobjekt)

Föreställ dig att du är någonstans inne i ett par parenteser som `(hello Vim)` och du behöver ta bort hela frasen inuti parenteserna. Hur kan du snabbt göra det? Finns det ett sätt att ta bort "gruppen" du är inne i?

Svaret är ja. Texter kommer ofta strukturerade. De innehåller ofta parenteser, citat, hakparenteser, klamrar och mer. Vim har ett sätt att fånga denna struktur med textobjekt.

Textobjekt används med operatorer. Det finns två typer av textobjekt: inre och yttre textobjekt.

```shell
i + object    Inre textobjekt
a + object    Yttre textobjekt
```

Inre textobjekt väljer objektet inuti *utan* det vita utrymmet eller de omgivande objekten. Yttre textobjekt väljer objektet inuti *inklusive* det vita utrymmet eller de omgivande objekten. Generellt väljer ett yttre textobjekt alltid mer text än ett inre textobjekt. Om din markör är någonstans inne i parenteserna i uttrycket `(hello Vim)`:
- För att ta bort texten inuti parenteserna utan att ta bort parenteserna: `di(`.
- För att ta bort parenteserna och texten inuti: `da(`.

Låt oss titta på ett annat exempel. Anta att du har denna Javascript-funktion och din markör är på "H" i "Hello":

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- För att ta bort hela "Hello Vim": `di(`.
- För att ta bort innehållet i funktionen (omgivet av `{}`): `di{`.
- För att ta bort strängen "Hello": `diw`.

Textobjekt är kraftfulla eftersom du kan rikta in dig på olika objekt från en plats. Du kan ta bort objekten inuti parenteserna, funktionsblocket eller det aktuella ordet. Mnemoniskt, när du ser `di(`, `di{`, och `diw`, får du en ganska bra uppfattning om vilka textobjekt de representerar: ett par parenteser, ett par klamrar och ett ord.

Låt oss titta på ett sista exempel. Anta att du har dessa HTML-taggar:

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Om din markör är på texten "Header1":
- För att ta bort "Header1": `dit`.
- För att ta bort `<h1>Header1</h1>`: `dat`.

Om din markör är på "div":
- För att ta bort `h1` och båda `p`-raderna: `dit`.
- För att ta bort allt: `dat`.
- För att ta bort "div": `di<`.

Nedan är en lista över vanliga textobjekt:

```shell
w         Ett ord
p         Ett stycke
s         En mening
( eller ) En par av ( )
{ eller } En par av { }
[ eller ] En par av [ ]
< eller > En par av < >
t         XML-taggar
"         En par av " "
'         En par av ' '
`         En par av ` `
```

För att lära dig mer, kolla in `:h text-objects`.

## Komponerbarhet och Grammatik

Vim-grammatik är en delmängd av Vims komponerbarhetsfunktion. Låt oss diskutera komponerbarhet i Vim och varför detta är en fantastisk funktion att ha i en textredigerare.

Komponerbarhet betyder att ha en uppsättning allmänna kommandon som kan kombineras (komponeras) för att utföra mer komplexa kommandon. Precis som i programmering där du kan skapa mer komplexa abstraktioner från enklare abstraktioner, kan du i Vim utföra komplexa kommandon från enklare kommandon. Vim-grammatik är manifestation av Vims komponerbara natur.

Den verkliga kraften i Vims komponerbarhet lyser när den integreras med externa program. Vim har en filteroperator (`!`) för att använda externa program som filter för våra texter. Anta att du har denna röriga text nedan och du vill tabulera den:

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Detta kan inte enkelt göras med Vim-kommandon, men du kan snabbt få det gjort med `column` terminalkommando (förutsatt att din terminal har `column` kommando). Med din markör på "Id", kör `!}column -t -s "|"`. Voila! Nu har du dessa fina tabulära data med bara ett snabbt kommando.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Låt oss bryta ner kommandot. Verb var `!` (filteroperator) och substantiv var `}` (gå till nästa stycke). Filteroperatorn `!` accepterade ett annat argument, ett terminalkommando, så jag gav det `column -t -s "|"`. Jag kommer inte att gå igenom hur `column` fungerade, men i praktiken tabulerade det texten.

Anta att du vill inte bara tabulera din text, utan att visa endast raderna med "Ok". Du vet att `awk` kan göra jobbet enkelt. Du kan göra detta istället:

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Resultat:

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Bra! Den externa kommandotoperatorn kan också använda pipe (`|`).

Detta är kraften i Vims komponerbarhet. Ju mer du känner till dina operatorer, rörelser och terminalkommandon, desto mer *multipliceras* din förmåga att komponera komplexa åtgärder.

Anta att du bara känner till fyra rörelser, `w, $, }, G` och bara en operator, `d`. Du kan göra 8 åtgärder: *flytta* 4 olika sätt (`w, $, }, G`) och *ta bort* 4 olika mål (`dw, d$, d}, dG`). Då en dag lär du dig om den stora (`gU`) operatorn. Du har lagt till inte bara en ny förmåga till din Vim-verktygslåda, utan *fyra*: `gUw, gU$, gU}, gUG`. Detta gör att du har 12 verktyg i din Vim-verktygslåda. Varje ny kunskap är en multiplikator till dina nuvarande förmågor. Om du känner till 10 rörelser och 5 operatorer har du 60 rörelser (50 operationer + 10 rörelser) i din arsenal. Vim har en radnummer-rörelse (`nG`) som ger dig `n` rörelser, där `n` är hur många rader du har i din fil (för att gå till rad 5, kör `5G`). Sök-rörelsen (`/`) ger praktiskt taget ett obegränsat antal rörelser eftersom du kan söka efter vad som helst. Den externa kommandotoperatorn (`!`) ger dig så många filtreringsverktyg som antalet terminalkommandon du känner. Genom att använda ett komponerbart verktyg som Vim kan allt du vet kopplas samman för att utföra operationer med ökande komplexitet. Ju mer du vet, desto mer kraftfull blir du.

Detta komponerbara beteende ekar Unix-filosofin: *gör en sak bra*. En operator har ett jobb: gör Y. En rörelse har ett jobb: gå till X. Genom att kombinera en operator med en rörelse får du förutsägbart YX: gör Y på X.

Rörelser och operatorer är utbyggbara. Du kan skapa anpassade rörelser och operatorer för att lägga till i din Vim-verktygslåda. Pluginen [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) låter dig skapa dina egna textobjekt. Den innehåller också en [lista](https://github.com/kana/vim-textobj-user/wiki) över användarskapade anpassade textobjekt.

## Lär dig Vim Grammatik på ett smart sätt

Du har just lärt dig om Vim-grammatikens regel: `verb + noun`. En av mina största Vim "AHA!" ögonblick var när jag just hade lärt mig om den stora (`gU`) operatorn och ville göra det aktuella ordet stort, jag *instinktivt* körde `gUiw` och det fungerade! Ordet blev stort. I det ögonblicket började jag äntligen förstå Vim. Min förhoppning är att du snart kommer att få ditt eget "AHA!" ögonblick, om du inte redan har det.

Målet med detta kapitel är att visa dig mönstret `verb + noun` i Vim så att du närmar dig att lära dig Vim som att lära dig ett nytt språk istället för att memorera varje kommandokombination.

Lär dig mönstret och förstå konsekvenserna. Det är det smarta sättet att lära sig.