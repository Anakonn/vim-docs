---
description: Denna dokumentation beskriver hur man använder kommandoradsläge i Vim,
  inklusive tips för att navigera och utföra kommandon effektivt.
title: Ch15. Command-line Mode
---

I de senaste tre kapitlen lärde du dig hur man använder sökkommandon (`/`, `?`), ersättningskommandot (`:s`), globala kommandot (`:g`) och externa kommandot (`!`). Dessa är exempel på kommandoradsmodens kommandon.

I detta kapitel kommer du att lära dig olika tips och tricks för kommandoradsmoden.

## Gå in i och ut ur kommandoradsmoden

Kommandoradsmoden är en egen läge, precis som normal läge, insättningsläge och visuell läge. När du är i detta läge går markören till botten av skärmen där du kan skriva in olika kommandon.

Det finns 4 olika kommandon du kan använda för att gå in i kommandoradsmoden:
- Sökmönster (`/`, `?`)
- Kommandorads kommandon (`:`)
- Externa kommandon (`!`)

Du kan gå in i kommandoradsmoden från normal läge eller visuell läge.

För att lämna kommandoradsmoden kan du använda `<Esc>`, `Ctrl-C` eller `Ctrl-[`.

*Andra litteraturer kan hänvisa till "Kommandorads kommando" som "Ex kommando" och "Extern kommando" som "filterkommando" eller "bang-operator".*

## Upprepa det föregående kommandot

Du kan upprepa det föregående kommandorads kommandot eller externa kommandot med `@:`.

Om du just körde `:s/foo/bar/g`, upprepar `@:` den ersättningen. Om du just körde `:.!tr '[a-z]' '[A-Z]'`, upprepar `@:` det senaste externa kommandots översättningsfilter.

## Kortkommandon för kommandoradsmoden

När du är i kommandoradsmoden kan du flytta till vänster eller höger, en tecken i taget, med `Vänster` eller `Höger` pil.

Om du behöver flytta ordvis, använd `Shift-Vänster` eller `Shift-Höger` (i vissa operativsystem kan du behöva använda `Ctrl` istället för `Shift`).

För att gå till början av raden, använd `Ctrl-B`. För att gå till slutet av raden, använd `Ctrl-E`.

Likt insättningsläget har du tre sätt att ta bort tecken i kommandoradsmoden:

```shell
Ctrl-H    Ta bort ett tecken
Ctrl-W    Ta bort ett ord
Ctrl-U    Ta bort hela raden
```
Slutligen, om du vill redigera kommandot som du skulle göra med en vanlig textfil, använd `Ctrl-F`.

Detta gör också att du kan söka igenom de tidigare kommandona, redigera dem och köra dem igen genom att trycka på `<Enter>` i "kommandoradsredigerings normal läge".

## Register och Autocomplete

När du är i kommandoradsmoden kan du infoga texter från Vim-register med `Ctrl-R` på samma sätt som i insättningsläget. Om du har strängen "foo" sparad i register a, kan du infoga den genom att köra `Ctrl-R a`. Allt du kan få från registret i insättningsläget kan du göra på samma sätt från kommandoradsmoden.

Dessutom kan du också få ordet under markören med `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` för WORD under markören). För att få raden under markören, använd `Ctrl-R Ctrl-L`. För att få filnamnet under markören, använd `Ctrl-R Ctrl-F`.

Du kan också autocompleta befintliga kommandon. För att autocompleta `echo` kommandot, medan du är i kommandoradsmoden, skriv "ec", tryck sedan på `<Tab>`. Du bör se i nedre vänstra hörnet Vim-kommandon som börjar med "ec" (exempel: `echo echoerr echohl echomsg econ`). För att gå till nästa alternativ, tryck antingen på `<Tab>` eller `Ctrl-N`. För att gå till föregående alternativ, tryck antingen på `<Shift-Tab>` eller `Ctrl-P`.

Vissa kommandorads kommandon accepterar filnamn som argument. Ett exempel är `edit`. Du kan autocompleta här också. Efter att ha skrivit kommandot, `:e ` (glöm inte mellanrummet), tryck på `<Tab>`. Vim kommer att lista alla relevanta filnamn som du kan välja från så att du inte behöver skriva det från början.

## Historikfönster och Kommandoradsfönster

Du kan se historiken av kommandorads kommandon och söktermer (detta kräver funktionen `+cmdline_hist`).

För att öppna kommandoradens historik, kör `:his :`. Du bör se något som följande:

```shell
## Cmd historik
2  e file1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim listar historiken av alla `:` kommandon du kör. Som standard lagrar Vim de senaste 50 kommandona. För att ändra antalet poster som Vim kommer ihåg till 100, kör `set history=100`.

Ett mer användbart sätt att använda kommandoradens historik är genom kommandoradsfönstret, `q:`. Detta öppnar ett sökbart, redigerbart historikfönster. Anta att du har dessa uttryck i historiken när du trycker `q:`:

```shell
51  s/verylongsubstitutionpattern/pancake/g
52  his :
53  wq
```

Om din nuvarande uppgift är att göra `s/verylongsubstitutionpattern/donut/g`, istället för att skriva kommandot från början, varför inte återanvända `s/verylongsubstitutionpattern/pancake/g`? Trots allt är det enda som är annorlunda ordet som ska ersättas, "donut" vs "pancake". Allt annat är detsamma.

Efter att du har kört `q:`, hitta `s/verylongsubstitutionpattern/pancake/g` i historiken (du kan använda Vim-navigeringen i denna miljö) och redigera det direkt! Ändra "pancake" till "donut" i historikfönstret, tryck sedan på `<Enter>`. Boom! Vim kör `s/verylongsubstitutionpattern/donut/g` åt dig. Superbekvämt!

På samma sätt, för att se sökhistoriken, kör `:his /` eller `:his ?`. För att öppna sökhistorikfönstret där du kan söka och redigera tidigare historik, kör `q/` eller `q?`.

För att avsluta detta fönster, tryck `Ctrl-C`, `Ctrl-W C`, eller skriv `:quit`.

## Fler Kommandorads Kommandon

Vim har hundratals inbyggda kommandon. För att se alla kommandon Vim har, kolla in `:h ex-cmd-index` eller `:h :index`.

## Lär dig Kommandoradsmoden på ett Smart Sätt

Jämfört med de andra tre lägena är kommandoradsmoden som en schweizisk armékniv för textredigering. Du kan redigera text, modifiera filer och köra kommandon, för att nämna några. Detta kapitel är en samling av olika aspekter av kommandoradsmoden. Det avslutar också Vim-lägena. Nu när du vet hur man använder normal, insättnings-, visuell och kommandoradsmoden kan du redigera text med Vim snabbare än någonsin.

Det är dags att gå bortom Vim-lägena och lära sig hur man gör en ännu snabbare navigering med Vim-taggar.