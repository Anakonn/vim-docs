---
description: Detta kapitel behandlar sökning och ersättning i Vim, med fokus på reguljära
  uttryck och smarta inställningar för att hantera versaler och gemener.
title: Ch12. Search and Substitute
---

Detta kapitel täcker två separata men relaterade koncept: sök och ersätt. Ofta när du redigerar behöver du söka i flera texter baserat på deras minsta gemensamma nämnare mönster. Genom att lära dig hur man använder reguljära uttryck i sök och ersätt istället för bokstavliga strängar, kommer du snabbt att kunna rikta in dig på vilken text som helst.

Som en sidoanteckning, i detta kapitel kommer jag att använda `/` när jag pratar om sök. Allt du kan göra med `/` kan också göras med `?`.

## Smart Skiftkänslighet

Det kan vara knepigt att försöka matcha skiftet av sökordet. Om du söker efter texten "Learn Vim", kan du lätt skriva fel på skiftet av en bokstav och få ett falskt sökresultat. Skulle det inte vara enklare och säkrare om du kan matcha vilket skift som helst? Det är här alternativet `ignorecase` kommer till sin rätt. Lägg bara till `set ignorecase` i din vimrc och alla dina sökord blir skiftkänsliga. Nu behöver du inte göra `/Learn Vim` längre, `/learn vim` kommer att fungera.

Det finns dock tillfällen då du behöver söka efter en skift-specifik fras. Ett sätt att göra det är att stänga av `ignorecase` alternativet genom att köra `set noignorecase`, men det är mycket arbete att slå på och av varje gång du behöver söka efter en skiftkänslig fras.

För att undvika att växla `ignorecase`, har Vim ett `smartcase` alternativ för att söka efter skiftokänsliga strängar om sökmönstret *innehåller minst en versal*. Du kan kombinera både `ignorecase` och `smartcase` för att utföra en skiftokänslig sökning när du anger alla gemener och en skiftkänslig sökning när du anger en eller flera versaler.

Inuti din vimrc, lägg till:

```shell
set ignorecase smartcase
```

Om du har dessa texter:

```shell
hello
HELLO
Hello
```

- `/hello` matchar "hello", "HELLO" och "Hello".
- `/HELLO` matchar endast "HELLO".
- `/Hello` matchar endast "Hello".

Det finns en nackdel. Vad händer om du behöver söka efter enbart en gemen sträng? När du gör `/hello`, gör Vim nu en skiftokänslig sökning. Du kan använda `\C` mönstret var som helst i ditt sökord för att tala om för Vim att den efterföljande sökningen kommer att vara skiftkänslig. Om du gör `/\Chello`, kommer det strikt att matcha "hello", inte "HELLO" eller "Hello".

## Första och Sista Tecken i en Rad

Du kan använda `^` för att matcha det första tecknet i en rad och `$` för att matcha det sista tecknet i en rad.

Om du har denna text:

```shell
hello hello
```

Du kan rikta in dig på det första "hello" med `/^hello`. Tecknet som följer efter `^` måste vara det första tecknet i en rad. För att rikta in dig på det sista "hello", kör `/hello$`. Tecknet före `$` måste vara det sista tecknet i en rad.

Om du har denna text:

```shell
hello hello friend
```

Att köra `/hello$` kommer inte att matcha något eftersom "friend" är den sista termen i den raden, inte "hello".

## Upprepa Sökning

Du kan upprepa den föregående sökningen med `//`. Om du just har sökt efter `/hello`, är det att köra `//` likvärdigt med att köra `/hello`. Denna genväg kan spara dig några tangenttryckningar, särskilt om du just har sökt efter en lång sträng. Kom också ihåg att du kan använda `n` och `N` för att upprepa den senaste sökningen med samma riktning och motsatt riktning, respektive.

Vad händer om du snabbt vill återkalla *n* senaste sökord? Du kan snabbt navigera i sökhistoriken genom att först trycka på `/`, och sedan trycka på `upp`/`ner` piltangenterna (eller `Ctrl-N`/`Ctrl-P`) tills du hittar det sökord du behöver. För att se hela din sökhistorik kan du köra `:history /`.

När du når slutet av en fil medan du söker, kastar Vim ett felmeddelande: `"Search hit the BOTTOM without match for: {your-search}"`. Ibland kan detta vara en bra säkerhetsåtgärd mot över-sökning, men andra gånger vill du cykla tillbaka sökningen till toppen igen. Du kan använda alternativet `set wrapscan` för att få Vim att söka tillbaka till toppen av filen när du når slutet av filen. För att stänga av denna funktion, gör `set nowrapscan`.

## Söka efter Alternativa Ord

Det är vanligt att söka efter flera ord samtidigt. Om du behöver söka efter *antingen* "hello vim" eller "hola vim", men inte "salve vim" eller "bonjour vim", kan du använda mönstret `|`.

Givet denna text:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

För att matcha både "hello" och "hola", kan du göra `/hello\|hola`. Du måste fly ( `\` ) eller (`|`) operatorn, annars kommer Vim bokstavligt att söka efter strängen "|".

Om du inte vill skriva `\|` varje gång, kan du använda `magic` syntaxen (`\v`) i början av sökningen: `/\vhello|hola`. Jag kommer inte att täcka `magic` i denna guide, men med `\v`, behöver du inte längre fly specialtecken. För att lära dig mer om `\v`, kolla gärna in `:h \v`.

## Ställa in Start och Slut av en Matchning

Kanske behöver du söka efter en text som är en del av ett sammansatt ord. Om du har dessa texter:

```shell
11vim22
vim22
11vim
vim
```

Om du behöver välja "vim" men endast när den börjar med "11" och slutar med "22", kan du använda `\zs` (startmatch) och `\ze` (slutmatch) operatorer. Kör:

```shell
/11\zsvim\ze22
```

Vim måste fortfarande matcha hela mönstret "11vim22", men markerar endast mönstret som är inneslutet mellan `\zs` och `\ze`. Ett annat exempel:

```shell
foobar
foobaz
```

Om du behöver matcha "foo" i "foobaz" men inte i "foobar", kör:

```shell
/foo\zebaz
```

## Söka efter Teckenintervall

Alla dina sökord fram till detta har varit en bokstavlig ordsökning. I verkliga livet kan du behöva använda ett allmänt mönster för att hitta din text. Det mest grundläggande mönstret är teckenintervallet, `[ ]`.

Om du behöver söka efter en siffra, vill du förmodligen inte skriva `/0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|0` varje gång. Istället, använd `/[0-9]` för att matcha en enda siffra. Uttrycket `0-9` representerar ett intervall av siffror 0-9 som Vim kommer att försöka matcha, så om du letar efter siffror mellan 1 till 5 istället, använd `/[1-5]`.

Siffror är inte de enda datatyperna som Vim kan söka efter. Du kan också göra `/[a-z]` för att söka efter gemena bokstäver och `/[A-Z]` för att söka efter versaler.

Du kan kombinera dessa intervall tillsammans. Om du behöver söka efter siffror 0-9 och både gemena och versaler från "a" till "f" (som en hex), kan du göra `/[0-9a-fA-F]`.

För att göra en negativ sökning kan du lägga till `^` inuti teckenintervallens hakparenteser. För att söka efter en icke-siffra, kör `/[^0-9]`. Vim kommer att matcha vilket tecken som helst så länge det inte är en siffra. Var medveten om att caret (`^`) inuti hakparenteser är annorlunda än caret i början av en rad (ex: `/^hello`). Om en caret är utanför ett par hakparenteser och är det första tecknet i sökordet, betyder det "det första tecknet i en rad". Om en caret är inuti ett par hakparenteser och är det första tecknet inuti hakparenteserna, betyder det en negativ sökningsoperator. `/^abc` matchar det första "abc" i en rad och `/[^abc]` matchar vilket tecken som helst utom "a", "b" eller "c".

## Söka efter Upprepade Tecken

Om du behöver söka efter dubbla siffror i denna text:

```shell
1aa
11a
111
```

Kan du använda `/[0-9][0-9]` för att matcha ett tvåsiffrigt tecken, men denna metod är inte skalbar. Vad händer om du behöver matcha tjugo siffror? Att skriva `[0-9]` tjugo gånger är ingen rolig upplevelse. Det är därför du behöver ett `count` argument.

Du kan skicka `count` till din sökning. Det har följande syntax:

```shell
{n,m}
```

Förresten, dessa `count` klamrar behöver fly när du använder dem i Vim. `count` operatorn placeras efter ett enda tecken som du vill öka.

Här är de fyra olika varianterna av `count` syntaxen:
- `{n}` är en exakt matchning. `/[0-9]\{2\}` matchar de tvåsiffriga talen: "11" och "11" i "111".
- `{n,m}` är en intervallmatchning. `/[0-9]\{2,3\}` matchar mellan 2 och 3 siffriga tal: "11" och "111".
- `{,m}` är en upp-till matchning. `/[0-9]\{,3\}` matchar upp till 3 siffriga tal: "1", "11" och "111".
- `{n,}` är en minst matchning. `/[0-9]\{2,\}` matchar minst 2 eller fler siffriga tal: "11" och "111".

Count-argumenten `\{0,\}` (noll eller fler) och `\{1,\}` (en eller fler) är vanliga sökmönster och Vim har speciella operatorer för dem: `*` och `+` (`+` behöver fly medan `*` fungerar bra utan fly). Om du gör `/[0-9]*`, är det samma som `/[0-9]\{0,\}`. Det söker efter noll eller fler siffror. Det kommer att matcha "", "1", "123". Förresten, det kommer också att matcha icke-siffror som "a", eftersom det tekniskt sett finns noll siffror i bokstaven "a". Tänk noga innan du använder `*`. Om du gör `/[0-9]\+`, är det samma som `/[0-9]\{1,\}`. Det söker efter en eller fler siffror. Det kommer att matcha "1" och "12".

## Fördefinierade Teckenintervall

Vim har fördefinierade intervall för vanliga tecken som siffror och bokstäver. Jag kommer inte att gå igenom varje enskild här, men du kan hitta hela listan inuti `:h /character-classes`. Här är de användbara:

```shell
\d    Siffra [0-9]
\D    Icke-siffra [^0-9]
\s    Vitrymdstecken (mellanslag och tab)
\S    Icke-vitrymdstecken (allt utom mellanslag och tab)
\w    Ordtecken [0-9A-Za-z_]
\l    Gemena bokstäver [a-z]
\u    Versaler [A-Z]
```

Du kan använda dem som du skulle använda teckenintervall. För att söka efter vilken enskild siffra som helst, istället för att använda `/[0-9]`, kan du använda `/\d` för en mer koncis syntax.

## Sökexempel: Fånga en Text Mellan ett Par Liknande Tecken

Om du vill söka efter en fras omgiven av ett par citattecken:

```shell
"Vim är fantastiskt!"
```

Kör detta:

```shell
/"[^"]\+"
```

Låt oss bryta ner det:
- `"` är ett bokstavligt citattecken. Det matchar det första citattecknet.
- `[^"]` betyder vilket tecken som helst utom ett citattecken. Det matchar vilket alfanumeriskt och vitrymdstecken som helst så länge det inte är ett citattecken.
- `\+` betyder en eller fler. Eftersom det föregås av `[^"]`, letar Vim efter ett eller fler tecken som inte är ett citattecken.
- `"` är ett bokstavligt citattecken. Det matchar det avslutande citattecknet.

När Vim ser det första `"`, börjar det mönsterfångsten. I det ögonblick det ser det andra citattecknet i en rad, matchar det det andra `"` mönstret och stoppar mönsterfångsten. Under tiden fångas alla icke-citattecken mellan av mönstret `[^"]\+`, i detta fall frasen `Vim är fantastiskt!`. Detta är ett vanligt mönster för att fånga en fras omgiven av ett par liknande avgränsare.

- För att fånga en fras omgiven av enkla citattecken kan du använda `/'[^']\+'`.
- För att fånga en fras omgiven av nollor kan du använda `/0[^0]\+0`.

## Sökexempel: Fånga ett Telefonnummer

Om du vill matcha ett amerikanskt telefonnummer separerat med ett bindestreck (`-`), som `123-456-7890`, kan du använda:

```shell
/\d\{3\}-\d\{3\}-\d\{4\}
```

Ett amerikanskt telefonnummer består av en uppsättning av tre siffror, följt av ytterligare tre siffror, och slutligen av fyra siffror. Låt oss bryta ner det:
- `\d\{3\}` matchar en siffra som upprepas exakt tre gånger
- `-` är ett bokstavligt bindestreck

Du kan undvika att skriva flyttningar med `\v`:

```shell
/\v\d{3}-\d{3}-\d{4}
```

Detta mönster är också användbart för att fånga alla upprepade siffror, såsom IP-adresser och postnummer.

Det täcker sökdelen av detta kapitel. Nu går vi vidare till ersättning.

## Grundläggande Ersättning

Vims ersättningskommando är ett användbart kommando för att snabbt hitta och ersätta vilket mönster som helst. Ersättningssyntaxen är:

```shell
:s/{gammalt-mönster}/{nytt-mönster}/
```

Låt oss börja med en grundläggande användning. Om du har denna text:

```shell
vim är bra
```

Låt oss ersätta "bra" med "fantastiskt" eftersom Vim är fantastiskt. Kör `:s/bra/fantastiskt/`. Du bör se:

```shell
vim är fantastiskt
```
## Upprepa den senaste substitutionen

Du kan upprepa den senaste substitueringskommandot med antingen det normala kommandot `&` eller genom att köra `:s`. Om du just har kört `:s/good/awesome/`, kommer antingen `&` eller `:s` att upprepa det.

Tidigare i detta kapitel nämnde jag också att du kan använda `//` för att upprepa det föregående sökmönstret. Denna trick fungerar med substitueringskommandot. Om `/good` nyligen har körts och du lämnar det första substitueringsmönsterargumentet tomt, som i `:s//awesome/`, fungerar det på samma sätt som att köra `:s/good/awesome/`.

## Substitutionsområde

Precis som många Ex-kommandon kan du skicka ett områdeargument till substitueringskommandot. Syntaxen är:

```shell
:[område]s/gammal/ny/
```

Om du har dessa uttryck:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

För att ersätta "let" med "const" på rader tre till fem kan du göra:

```shell
:3,5s/let/const/
```

Här är några variationsområden du kan skicka:

- `:,3s/let/const/` - om inget anges före kommatecknet, representerar det den aktuella raden. Ersätt från aktuell rad till rad 3.
- `:1,s/let/const/` - om inget anges efter kommatecknet, representerar det också den aktuella raden. Ersätt från rad 1 till aktuell rad.
- `:3s/let/const/` - om endast ett värde anges som område (inga kommatecken), gör det substitution på den raden endast.

I Vim betyder `%` vanligtvis hela filen. Om du kör `:%s/let/const/`, kommer det att göra substitution på alla rader. Tänk på denna områdessyntax. Många kommandorads kommandon som du kommer att lära dig i de kommande kapitlen kommer att följa denna form.

## Mönstermatchning

De kommande avsnitten kommer att täcka grundläggande reguljära uttryck. En stark mönsterkunskap är avgörande för att behärska substitueringskommandot.

Om du har följande uttryck:

```shell
let one = 1;
let two = 2;
let three = 3;
let four = 4;
let five = 5;
```

För att lägga till ett par dubbla citattecken runt siffrorna:

```shell
:%s/\d/"\0"/
```

Resultatet:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Låt oss bryta ner kommandot:
- `:%s` riktar sig mot hela filen för att utföra substitution.
- `\d` är Vims fördefinierade område för siffror (liknande att använda `[0-9]`).
- `"\0"` här är de dubbla citattecknen bokstavliga dubbla citattecken. `\0` är ett specialtecken som representerar "hela det matchade mönstret". Det matchade mönstret här är ett ensamt siffra, `\d`.

Alternativt representerar `&` också hela det matchade mönstret som `\0`. `:s/\d/"&"/` skulle också ha fungerat.

Låt oss överväga ett annat exempel. Givet dessa uttryck och du behöver byta alla "let" med variabelnamnen.

```shell
one let = "1";
two let = "2";
three let = "3";
four let = "4";
five let = "5";
```

För att göra det, kör:

```shell
:%s/\(\w\+\) \(\w\+\)/\2 \1/
```

Kommandot ovan innehåller för många bakåtslashar och är svårt att läsa. I det här fallet är det mer bekvämt att använda `\v`-operatören:

```shell
:%s/\v(\w+) (\w+)/\2 \1/
```

Resultatet:

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Bra! Låt oss bryta ner det kommandot:
- `:%s` riktar sig mot alla rader i filen för att utföra substitution.
- `(\w+) (\w+)` är en gruppmatchning. `\w` är en av Vims fördefinierade områden för ett ordtecken (`[0-9A-Za-z_]`). De `( )` som omger det fångar en ordteckenmatchning i en grupp. Observera att det finns ett mellanslag mellan de två grupperna. `(\w+) (\w+)` fångar två grupper. Den första gruppen fångar "one" och den andra gruppen fångar "two".
- `\2 \1` returnerar den fångade gruppen i omvänd ordning. `\2` innehåller den fångade strängen "let" och `\1` strängen "one". Att ha `\2 \1` returnerar strängen "let one".

Kom ihåg att `\0` representerar hela det matchade mönstret. Du kan bryta ner den matchade strängen i mindre grupper med `( )`. Varje grupp representeras av `\1`, `\2`, `\3`, etc.

Låt oss göra ett exempel till för att befästa detta gruppmatchningskoncept. Om du har dessa siffror:

```shell
123
456
789
```

För att vända ordningen, kör:

```shell
:%s/\v(\d)(\d)(\d)/\3\2\1/
```

Resultatet är:

```shell
321
654
987
```

Varje `(\d)` matchar varje siffra och skapar en grupp. På den första raden har den första `(\d)` ett värde av 1, den andra `(\d)` har ett värde av 2, och den tredje `(\d)` har ett värde av 3. De lagras i variablerna `\1`, `\2` och `\3`. I den andra halvan av din substitution resulterar det nya mönstret `\3\2\1` i värdet "321" på rad ett.

Om du istället hade kört detta:

```shell
:%s/\v(\d\d)(\d)/\2\1/
```
Skulle du ha fått ett annat resultat:

```shell
312
645
978
```

Detta beror på att du nu bara har två grupper. Den första gruppen, fångad av `(\d\d)`, lagras inom `\1` och har värdet 12. Den andra gruppen, fångad av `(\d)`, lagras inom `\2` och har värdet 3. `\2\1` returnerar då 312.

## Substitutionsflaggor

Om du har meningen:

```shell
chocolate pancake, strawberry pancake, blueberry pancake
```

För att ersätta alla pannkakor med donuts kan du inte bara köra:

```shell
:s/pancake/donut
```

Kommandot ovan kommer endast att ersätta den första matchningen, vilket ger dig:

```shell
chocolate donut, strawberry pancake, blueberry pancake
```

Det finns två sätt att lösa detta. Du kan antingen köra substitueringskommandot två gånger till eller så kan du skicka det en global (`g`) flagga för att ersätta alla matchningar i en rad.

Låt oss prata om den globala flaggan. Kör:

```shell
:s/pancake/donut/g
```

Vim ersätter alla pannkakor med donuts i ett svep. Den globala kommandot är en av flera flaggor som substitueringskommandot accepterar. Du skickar flaggor i slutet av substitueringskommandot. Här är en lista över användbara flaggor:

```shell
&    Återanvänd flaggorna från det föregående substitueringskommandot.
g    Ersätt alla matchningar i raden.
c    Fråga om bekräftelse för substitution.
e    Förhindra att felmeddelande visas när substitution misslyckas.
i    Utför skiftlägesokänslig substitution.
I    Utför skiftlägeskänslig substitution.
```

Det finns fler flaggor som jag inte listar ovan. För att läsa om alla flaggor, kolla in `:h s_flags`.

Förresten, repeat-substitutionskommandona (`&` och `:s`) behåller inte flaggorna. Att köra `&` kommer endast att upprepa `:s/pancake/donut/` utan `g`. För att snabbt upprepa det senaste substitueringskommandot med alla flaggor, kör `:&&`.

## Ändra avgränsaren

Om du behöver ersätta en URL med en lång sökväg:

```shell
https://mysite.com/a/b/c/d/e
```

För att ersätta den med ordet "hello", kör:

```shell
:s/https:\/\/mysite.com\/a\/b\/c\/d\/e/hello/
```

Det är dock svårt att avgöra vilka snedstreck (`/`) som är en del av substitutionsmönstret och vilka som är avgränsare. Du kan ändra avgränsaren med valfria enstaka byte-tecken (utom för alfabet, siffror, eller `"`, `|`, och `\`). Låt oss ersätta dem med `+`. Substitutionskommandot ovan kan då skrivas om som:

```shell
:s+https:\/\/mysite.com\/a\/b\/c\/d\/e+hello+
```

Det är nu lättare att se var avgränsarna är.

## Speciell ersättning

Du kan också ändra textens skiftläge som du ersätter. Givet följande uttryck och din uppgift är att göra variablerna "one", "two", "three", etc. till versaler.

```shell
let one = "1";
let two = "2";
let three = "3";
let four = "4";
let five = "5";
```

Kör:

```shell
:%s/\v(\w+) (\w+)/\1 \U\2/
```

Du får:

```shell
let ONE = "1";
let TWO = "2";
let THREE = "3";
let FOUR = "4";
let FIVE = "5";
```

Nedbrytningen:
- `(\w+) (\w+)` fångar de första två matchade grupperna, såsom "let" och "one".
- `\1` returnerar värdet av den första gruppen, "let".
- `\U\2` gör den andra gruppen (`\2`) till versaler.

Tricket med detta kommando är uttrycket `\U\2`. `\U` instruerar följande tecken att bli versaler.

Låt oss göra ett exempel till. Anta att du skriver en Vim-guide och du behöver kapitalisera den första bokstaven i varje ord i en rad.

```shell
vim is the greatest text editor in the whole galaxy
```

Du kan köra:

```shell
:s/\<./\U&/g
```

Resultatet:

```shell
Vim Is The Greatest Text Editor In The Whole Galaxy
```

Här är nedbrytningarna:
- `:s` ersätter den aktuella raden.
- `\<.` består av två delar: `\<` för att matcha början av ett ord och `.` för att matcha vilket tecken som helst. `\<`-operatören gör att följande tecken blir det första tecknet i ett ord. Eftersom `.` är det nästa tecknet, kommer det att matcha det första tecknet i vilket ord som helst.
- `\U&` gör det efterföljande tecknet, `&`, till versaler. Kom ihåg att `&` (eller `\0`) representerar hela matchen. Det matchar det första tecknet i vilket ord som helst.
- `g` den globala flaggan. Utan den kommer detta kommando endast att ersätta den första matchen. Du behöver ersätta varje match på denna rad.

För att lära dig mer om substitutions speciella ersättningssymboler som `\U`, kolla in `:h sub-replace-special`.

## Alternativa mönster

Ibland behöver du matcha flera mönster samtidigt. Om du har följande hälsningar:

```shell
hello vim
hola vim
salve vim
bonjour vim
```

Du behöver ersätta ordet "vim" med "vän" men endast på rader som innehåller ordet "hello" eller "hola". Kom ihåg från tidigare i detta kapitel, kan du använda `|` för flera alternativa mönster.

```shell
:%s/\v(hello|hola) vim/\1 vän/g
```

Resultatet:

```shell
hello vän
hola vän
salve vim
bonjour vim
```

Här är nedbrytningen:
- `%s` kör substitueringskommandot på varje rad i en fil.
- `(hello|hola)` matchar *antingen* "hello" eller "hola" och betraktar det som en grupp.
- `vim` är det bokstavliga ordet "vim".
- `\1` är den första gruppen, som antingen är texten "hello" eller "hola".
- `vän` är det bokstavliga ordet "vän".

## Ersätta början och slutet av ett mönster

Kom ihåg att du kan använda `\zs` och `\ze` för att definiera början och slutet av en match. Denna teknik fungerar också i substitution. Om du har:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotcake
```

För att ersätta "cake" i "hotcake" med "dog" för att få en "hotdog":

```shell
:%s/hot\zscake/dog/g
```

Resultat:

```shell
chocolate pancake
strawberry sweetcake
blueberry hotdog
```
## Girig och Icke-girig

Du kan ersätta det n-te matchningen i en rad med det här tricket:

```shell
One Mississippi, two Mississippi, three Mississippi, four Mississippi, five Mississippi.
```

För att ersätta den tredje "Mississippi" med "Arkansas", kör:

```shell
:s/\v(.{-}\zsMississippi){3}/Arkansas/g
```

Uppdelningen:
- `:s/` ersättningskommandot.
- `\v` är det magiska nyckelordet så att du inte behöver undkomma speciella nyckelord.
- `.` matchar vilket enskilt tecken som helst.
- `{-}` utför en icke-girig matchning av 0 eller fler av den föregående atomen.
- `\zsMississippi` gör "Mississippi" till början av matchningen.
- `(...){3}` letar efter den tredje matchningen.

Du har sett `{3}`-syntaxen tidigare i detta kapitel. I det här fallet kommer `{3}` att matcha exakt den tredje matchningen. Det nya tricket här är `{-}`. Det är en icke-girig matchning. Den hittar den kortaste matchningen av det givna mönstret. I det här fallet matchar `(.{-}Mississippi)` den minsta mängden av "Mississippi" som föregås av vilket tecken som helst. Jämför detta med `(.*Mississippi)` där den hittar den längsta matchningen av det givna mönstret.

Om du använder `(.{-}Mississippi)`, får du fem matchningar: "One Mississippi", "Two Mississippi", etc. Om du använder `(.*Mississippi)`, får du en matchning: den sista "Mississippi". `*` är en girig matchare och `{-}` är en icke-girig matchare. För att lära dig mer, kolla in `:h /\{-` och `:h non-greedy`.

Låt oss göra ett enklare exempel. Om du har strängen:

```shell
abc1de1
```

Du kan matcha "abc1de1" (girig) med:

```shell
/a.*1
```

Du kan matcha "abc1" (icke-girig) med:

```shell
/a.\{-}1
```

Så om du behöver göra den längsta matchningen (girig) till versaler, kör:

```shell
:s/a.*1/\U&/g
```

För att få:

```shell
ABC1DEFG1
```

Om du behöver göra den kortaste matchningen (icke-girig) till versaler, kör:

```shell
:s/a.\{-}1/\U&/g
```

För att få:

```shell
ABC1defg1
```

Om du är ny på konceptet girig vs icke-girig, kan det vara svårt att förstå. Experimentera med olika kombinationer tills du förstår det.

## Ersätta över flera filer

Slutligen, låt oss lära oss hur man ersätter fraser över flera filer. För den här sektionen, anta att du har två filer: `food.txt` och `animal.txt`.

Inuti `food.txt`:

```shell
corndog
hotdog
chilidog
```

Inuti `animal.txt`:

```shell
large dog
medium dog
small dog
```

Anta att din mappstruktur ser ut så här:

```shell
- food.txt
- animal.txt
```

Först, fånga både `food.txt` och `animal.txt` inuti `:args`. Kom ihåg från tidigare kapitel att `:args` kan användas för att skapa en lista med filnamn. Det finns flera sätt att göra detta inifrån Vim, ett av dem är att köra detta från inuti Vim:

```shell
:args *.txt                  fångar alla txt-filer i nuvarande plats
```

För att testa det, när du kör `:args`, bör du se:

```shell
[food.txt] animal.txt
```

Nu när alla relevanta filer är lagrade i argumentlistan, kan du utföra en flerfilsersättning med kommandot `:argdo`. Kör:

```shell
:argdo %s/dog/chicken/
```

Detta utför ersättning mot alla filer i `:args`-listan. Slutligen, spara de ändrade filerna med:

```shell
:argdo update
```

`:args` och `:argdo` är användbara verktyg för att tillämpa kommandorads-kommandon över flera filer. Prova det med andra kommandon!

## Ersätta över flera filer med makron

Alternativt kan du också köra ersättningskommandot över flera filer med makron. Kör:

```shell
:args *.txt
qq
:%s/dog/chicken/g
:wnext
q
99@q
```

Uppdelningen:
- `:args *.txt` lägger till alla textfiler i `:args`-listan.
- `qq` startar makrot i "q"-registret.
- `:%s/dog/chicken/g` ersätter "dog" med "chicken" på alla rader i den aktuella filen.
- `:wnext` sparar filen och går sedan till nästa fil i `args`-listan.
- `q` stoppar makroinspelningen.
- `99@q` kör makrot nittionio gånger. Vim kommer att stoppa makroexekveringen efter att den stöter på det första felet, så Vim kommer faktiskt inte att köra makrot nittionio gånger.

## Lära sig söka och ersätta på ett smart sätt

Förmågan att söka bra är en nödvändig färdighet i redigering. Att bemästra sökningen låter dig utnyttja flexibiliteten i reguljära uttryck för att söka efter vilket mönster som helst i en fil. Ta dig tid att lära dig dessa. För att bli bättre på reguljära uttryck behöver du aktivt använda reguljära uttryck. Jag läste en gång en bok om reguljära uttryck utan att faktiskt göra det och jag glömde nästan allt jag läste efteråt. Aktiv kodning är det bästa sättet att bemästra vilken färdighet som helst.

Ett bra sätt att förbättra din mönstermatchningsfärdighet är att när du behöver söka efter ett mönster (som "hello 123"), istället för att fråga efter den bokstavliga söktermen (`/hello 123`), försök att komma på ett mönster för det (något som `/\v(\l+) (\d+)`). Många av dessa koncept för reguljära uttryck är också tillämpliga inom allmän programmering, inte bara när du använder Vim.

Nu när du har lärt dig om avancerad sökning och ersättning i Vim, låt oss lära oss ett av de mest mångsidiga kommandona, det globala kommandot.