---
description: Denna dokumentation beskriver hur man använder Vim:s visuella lägen för
  att effektivt markera och manipulera text. Lär dig de tre olika lägena.
title: Ch11. Visual Mode
---

Att markera och tillämpa ändringar på en text är en vanlig funktion i många textredigerare och ordbehandlare. Vim kan göra detta med hjälp av visuell läge. I detta kapitel kommer du att lära dig hur man använder det visuella läget för att manipulera texter effektivt.

## De Tre Typerna av Visuella Läge

Vim har tre olika visuella lägen. De är:

```shell
v         Teckenvisuellt läge
V         Radvisuellt läge
Ctrl-V    Blockvisuellt läge
```

Om du har texten:

```shell
one
two
three
```

Teckenvisuellt läge fungerar med individuella tecken. Tryck `v` på det första tecknet. Gå sedan ner till nästa rad med `j`. Det markerar all text från "one" upp till din markörs position. Om du trycker `gU`, kommer Vim att göra de markerade tecknen versaler.

Radvisuellt läge fungerar med rader. Tryck `V` och se hur Vim väljer hela raden där din markör är. Precis som i teckenvisuellt läge, om du kör `gU`, kommer Vim att göra de markerade tecknen versaler.

Blockvisuellt läge fungerar med rader och kolumner. Det ger dig mer rörelsefrihet än de andra två lägena. Om du trycker `Ctrl-V`, markerar Vim tecknet under markören precis som i teckenvisuellt läge, förutom att istället för att markera varje tecken till slutet av raden innan du går ner till nästa rad, går det till nästa rad med minimal markering. Försök att röra dig med `h/j/k/l` och se hur markören rör sig.

I det nedre vänstra hörnet av ditt Vim-fönster kommer du att se antingen `-- VISUAL --`, `-- VISUAL LINE --`, eller `-- VISUAL BLOCK --` visas för att indikera vilket visuellt läge du är i.

När du är i ett visuellt läge kan du byta till ett annat visuellt läge genom att trycka antingen `v`, `V`, eller `Ctrl-V`. Till exempel, om du är i radvisuellt läge och vill byta till blockvisuellt läge, kör `Ctrl-V`. Försök!

Det finns tre sätt att avsluta det visuella läget: `<Esc>`, `Ctrl-C`, och samma tangent som ditt aktuella visuella läge. Vad det senare betyder är att om du för närvarande är i radvisuellt läge (`V`), kan du avsluta det genom att trycka `V` igen. Om du är i teckenvisuellt läge kan du avsluta det genom att trycka `v`.

Det finns faktiskt ett sätt till att gå in i det visuella läget:

```shell
gv    Gå till det föregående visuella läget
```

Det kommer att starta samma visuella läge på samma markerade textblock som du gjorde sist.

## Navigering i Visuellt Läge

När du är i ett visuellt läge kan du utöka det markerade textblocket med Vim-rörelser.

Låt oss använda samma text som du använde tidigare:

```shell
one
two
three
```

Denna gång låt oss börja från raden "two". Tryck `v` för att gå till teckenvisuellt läge (här representerar de fyrkantiga parenteserna `[]` teckenmarkeringarna):

```shell
one
[t]wo
three
```

Tryck `j` och Vim kommer att markera all text från raden "two" ner till det första tecknet på raden "three".

```shell
one
[two
t]hree
```

Anta att du från denna position vill lägga till raden "one" också. Om du trycker `k`, till din besvikelse, flyttar markeringen bort från raden "three". 

```shell
one
[t]wo
three
```

Finns det ett sätt att fritt utöka visuell markering för att röra sig i vilken riktning du vill? Definitivt. Låt oss backa lite till där du har raden "two" och "three" markerad.

```shell
one
[two
t]hree    <-- markör
```

Visuell markering följer markörens rörelse. Om du vill utöka den uppåt till raden "one", behöver du flytta markören upp till raden "two". Just nu är markören på raden "three". Du kan växla markörens position med antingen `o` eller `O`.

```shell
one
[two     <-- markör
t]hree
```

Nu när du trycker `k`, minskar den inte längre markeringen, utan utökar den uppåt.

```shell
[one
two
t]hree
```

Med `o` eller `O` i visuellt läge hoppar markören från början till slutet av det markerade blocket, vilket gör att du kan utöka markeringsområdet.

## Visuellt Läge Grammatik

Det visuella läget delar många operationer med normalt läge.

Till exempel, om du har följande text och vill ta bort de första två raderna från det visuella läget:

```shell
one
two
three
```

Markera raderna "one" och "two" med radvisuellt läge (`V`):

```shell
[one
two]
three
```

Att trycka `d` kommer att ta bort markeringen, liknande normalt läge. Observera att grammatikregeln från normalt läge, verb + substantiv, inte gäller. Det samma verbet finns fortfarande där (`d`), men det finns inget substantiv i det visuella läget. Grammatikregeln i det visuella läget är substantiv + verb, där substantivet är den markerade texten. Välj textblocket först, sedan följer kommandot.

I normalt läge finns det vissa kommandon som inte kräver en rörelse, som `x` för att ta bort ett enda tecken under markören och `r` för att ersätta tecknet under markören (`rx` ersätter tecknet under markören med "x"). I det visuella läget tillämpas dessa kommandon nu på hela den markerade texten istället för ett enda tecken. Tillbaka till den markerade texten:

```shell
[one
two]
three
```

Att köra `x` tar bort all markerad text.

Du kan använda detta beteende för att snabbt skapa en rubrik i markdown-text. Anta att du snabbt behöver göra följande text till en rubrik av första nivån i markdown ("==="):

```shell
Chapter One
```

Först, kopiera texten med `yy`, och klistra in den med `p`:

```shell
Chapter One
Chapter One
```

Nu, gå till den andra raden och markera den med radvisuellt läge:

```shell
Chapter One
[Chapter One]
```

En rubrik av första nivån är en serie av "=" under en text. Kör `r=`, voila! Detta sparar dig från att skriva "=" manuellt.

```shell
Chapter One
===========
```

För att lära dig mer om operatörer i visuellt läge, kolla in `:h visual-operators`.

## Visuellt Läge och Kommandorads Kommandon

Du kan selektivt tillämpa kommandorads kommandon på ett markerat textblock. Om du har dessa satser och vill ersätta "const" med "let" endast på de första två raderna:

```shell
const one = "one";
const two = "two";
const three = "three";
```

Markera de första två raderna med *vilket som helst* visuellt läge och kör ersättningskommandot `:s/const/let/g`:

```shell
let one = "one";
let two = "two";
const three = "three";
```

Observera att jag sa att du kan göra detta med *vilket som helst* visuellt läge. Du behöver inte markera hela raden för att köra kommandot på den raden. Så länge du väljer minst ett tecken på varje rad, tillämpas kommandot.

## Lägga till Text på Flera Rader

Du kan lägga till text på flera rader i Vim med hjälp av blockvisuellt läge. Om du behöver lägga till ett semikolon i slutet av varje rad:

```shell
const one = "one"
const two = "two"
const three = "three"
```

Med din markör på den första raden:
- Kör blockvisuellt läge och gå ner två rader (`Ctrl-V jj`).
- Markera till slutet av raden (`$`).
- Lägg till (`A`) och skriv ";".
- Avsluta det visuella läget (`<Esc>`).

Du bör nu se det tillagda ";" på varje rad. Ganska coolt! Det finns två sätt att gå in i insättningsläget från blockvisuellt läge: `A` för att lägga till text efter markören eller `I` för att lägga till text före markören. Förväxla dem inte med `A` (lägga till text i slutet av raden) och `I` (infoga text före den första icke-vita raden) från normalt läge.

Alternativt kan du också använda kommandot `:normal` för att lägga till text på flera rader:
- Markera alla 3 rader (`vjj`).
- Skriv `:normal! A;`.

Kom ihåg, `:normal` kommandot utför kommandon i normalt läge. Du kan instruera det att köra `A;` för att lägga till text ";" i slutet av raden.

## Inkrementera Nummer

Vim har kommandon `Ctrl-X` och `Ctrl-A` för att minska och öka nummer. När de används med visuellt läge kan du öka nummer över flera rader.

Om du har dessa HTML-element:

```shell
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
<div id="app-1"></div>
```

Det är en dålig praxis att ha flera id:n med samma namn, så låt oss öka dem för att göra dem unika:
- Flytta din markör till "1" på den andra raden.
- Starta blockvisuellt läge och gå ner 3 rader (`Ctrl-V 3j`). Detta markerar de återstående "1":orna. Nu bör alla "1" vara markerade (utom den första raden).
- Kör `g Ctrl-A`.

Du bör se detta resultat:

```shell
<div id="app-1"></div>
<div id="app-2"></div>
<div id="app-3"></div>
<div id="app-4"></div>
<div id="app-5"></div>
```

`g Ctrl-A` ökar nummer på flera rader. `Ctrl-X/Ctrl-A` kan också öka bokstäver, med alternativet för nummerformat:

```shell
set nrformats+=alpha
```

Alternativet `nrformats` instruerar Vim vilka baser som betraktas som "nummer" för `Ctrl-A` och `Ctrl-X` att öka och minska. Genom att lägga till `alpha` betraktas ett alfabetiskt tecken nu som ett nummer. Om du har följande HTML-element:

```shell
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
<div id="app-a"></div>
```

Sätt din markör på den andra "app-a". Använd samma teknik som ovan (`Ctrl-V 3j` och sedan `g Ctrl-A`) för att öka id:n.

```shell
<div id="app-a"></div>
<div id="app-b"></div>
<div id="app-c"></div>
<div id="app-d"></div>
<div id="app-e"></div>
```

## Välja Det Senaste Visuella Lägeområdet

Tidigare i detta kapitel nämnde jag att `gv` snabbt kan markera den senaste visuella lägesmarkeringen. Du kan också gå till platsen för början och slutet av det senaste visuella läget med dessa två speciella markeringar:

```shell
`<    Gå till den första platsen för den föregående visuella lägesmarkeringen
`>    Gå till den sista platsen för den föregående visuella lägesmarkeringen
```

Tidigare nämnde jag också att du kan selektivt utföra kommandorads kommandon på en markerad text, som `:s/const/let/g`. När du gjorde det, skulle du se detta nedan:

```shell
:`<,`>s/const/let/g
```

Du utförde faktiskt ett *område* `s/const/let/g` kommando (med de två markeringarna som adresser). Intressant!

Du kan alltid redigera dessa markeringar när du vill. Om du istället behövde ersätta från början av den markerade texten till slutet av filen, ändrar du bara kommandot till:

```shell
:`<,$s/const/let/g
```

## Gå In i Visuellt Läge Från Insättningsläge

Du kan också gå in i visuellt läge från insättningsläge. För att gå till teckenvisuellt läge medan du är i insättningsläge:

```shell
Ctrl-O v
```

Kom ihåg att köra `Ctrl-O` medan du är i insättningsläge låter dig utföra ett kommando i normalt läge. Medan du är i detta normalt-läge-kommando-väntande läge, kör `v` för att gå in i teckenvisuellt läge. Observera att i det nedre vänstra hörnet av skärmen står det `--(insert) VISUAL--`. Detta trick fungerar med alla visuella lägeoperatörer: `v`, `V`, och `Ctrl-V`.

## Välj Läge

Vim har ett läge som liknar det visuella läget som kallas välj-läge. Precis som det visuella läget har det också tre olika lägen:

```shell
gh         Teckenvisuellt välj-läge
gH         Radvisuellt välj-läge
gCtrl-h    Blockvisuellt välj-läge
```

Välj-läge emulerar en vanlig editors textmarkering beteende närmare än Vims visuella läge gör.

I en vanlig editor, efter att du har markerat ett textblock och skriver en bokstav, säg bokstaven "y", kommer det att ta bort den markerade texten och infoga bokstaven "y". Om du markerar en rad med radvisuellt välj-läge (`gH`) och skriver "y", kommer det att ta bort den markerade texten och infoga bokstaven "y".

Kontrastera detta välj-läge med det visuella läget: om du markerar en rad text med radvisuellt visuellt läge (`V`) och skriver "y", kommer den markerade texten inte att tas bort och ersättas av den bokstavliga bokstaven "y", den kommer att kopieras. Du kan inte utföra kommandon i normalt läge på markerad text i välj-läge.

Jag har personligen aldrig använt välj-läge, men det är bra att veta att det finns.

## Lär Dig Visuellt Läge På Ett Smart Sätt

Det visuella läget är Vims representation av textmarkeringsproceduren.

Om du upptäcker att du använder operationer i visuellt läge mycket oftare än operationer i normalt läge, var försiktig. Detta är ett anti-mönster. Det tar fler tangenttryckningar att köra en operation i visuellt läge än dess motsvarighet i normalt läge. Till exempel, om du behöver ta bort ett inre ord, varför använda fyra tangenttryckningar, `viwd` (visuellt markera ett inre ord och sedan ta bort), om du kan åstadkomma det med bara tre tangenttryckningar (`diw`)? Det senare är mer direkt och koncist. Självklart kommer det att finnas tillfällen när visuella lägen är lämpliga, men i allmänhet, föredra en mer direkt metod.