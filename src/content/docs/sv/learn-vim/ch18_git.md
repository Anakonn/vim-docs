---
description: Detta kapitel handlar om hur man integrerar Vim och Git, med fokus på
  att visa skillnader mellan filer med kommandot `vimdiff`.
title: Ch18. Git
---

Vim och git är två fantastiska verktyg för två olika saker. Git är ett versionshanteringsverktyg. Vim är en textredigerare.

I detta kapitel kommer du att lära dig olika sätt att integrera Vim och git tillsammans.

## Diffing

Kom ihåg i det föregående kapitlet, du kan köra ett `vimdiff`-kommando för att visa skillnaderna mellan flera filer.

Anta att du har två filer, `file1.txt` och `file2.txt`.

Inuti `file1.txt`:

```shell
pannkakor
våfflor
äpplen

mjölk
äppeljuice

yoghurt
```

Inuti `file2.txt`:

```shell
pannkakor
våfflor
apelsiner

mjölk
apelsinjuice

yoghurt
```

För att se skillnaderna mellan båda filerna, kör:

```shell
vimdiff file1.txt file2.txt
```

Alternativt kan du köra:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` visar två buffertar sida vid sida. Till vänster är `file1.txt` och till höger är `file2.txt`. De första skillnaderna (äpplen och apelsiner) är markerade på båda raderna.

Anta att du vill göra den andra bufferten att ha äpplen, inte apelsiner. För att överföra innehållet från din nuvarande position (du är för närvarande på `file1.txt`) till `file2.txt`, gå först till nästa diff med `]c` (för att hoppa till den föregående diff-fönstret, använd `[c`). Markören ska nu vara på äpplen. Kör `:diffput`. Båda filerna bör nu ha äpplen.

Om du behöver överföra texten från den andra bufferten (apelsinjuice, `file2.txt`) för att ersätta texten i den aktuella bufferten (äppeljuice, `file1.txt`), med din markör fortfarande på `file1.txt`-fönstret, gå först till nästa diff med `]c`. Din markör ska nu vara på äppeljuice. Kör `:diffget` för att få apelsinjuicen från en annan buffert för att ersätta äppeljuicen i vår buffert.

`:diffput` *överför* texten från den aktuella bufferten till en annan buffert. `:diffget` *hämtar* texten från en annan buffert till den aktuella bufferten.

Om du har flera buffertar kan du köra `:diffput fileN.txt` och `:diffget fileN.txt` för att rikta in dig på fileN-bufferten.

## Vim Som Ett Sammanfogningsverktyg

> "Jag älskar att lösa sammanfogningskonflikter!" - Ingen

Jag känner ingen som gillar att lösa sammanfogningskonflikter. Men de är oundvikliga. I detta avsnitt kommer du att lära dig hur du kan använda Vim som ett verktyg för att lösa sammanfogningskonflikter.

Först, ändra standard sammanfogningsverktyget till att använda `vimdiff` genom att köra:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Alternativt kan du modifiera `~/.gitconfig` direkt (som standard bör den vara i root, men din kan vara på en annan plats). Kommandona ovan bör modifiera din gitconfig så att den ser ut som inställningen nedan, om du inte redan har kört dem, kan du också manuellt redigera din gitconfig.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Låt oss skapa en falsk sammanfogningskonflikt för att testa detta. Skapa en katalog `/food` och gör den till ett git-repo:

```shell
git init
```

Lägg till en fil, `breakfast.txt`. Inuti:

```shell
pannkakor
våfflor
apelsiner
```

Lägg till filen och gör en commit:

```shell
git add .
git commit -m "Initial breakfast commit"
```

Skapa nästa en ny gren och kalla den äpplen-gren:

```shell
git checkout -b äpplen
```

Ändra `breakfast.txt`:

```shell
pannkakor
våfflor
äpplen
```

Spara filen, lägg till och gör en commit:

```shell
git add .
git commit -m "Äpplen inte apelsiner"
```

Bra. Nu har du apelsiner i master-grenen och äpplen i äpplen-grenen. Låt oss återgå till master-grenen:

```shell
git checkout master
```

Inuti `breakfast.txt`, bör du se bastexten, apelsiner. Låt oss ändra den till druvor eftersom de är i säsong just nu:

```shell
pannkakor
våfflor
druvor
```

Spara, lägg till och gör en commit:

```shell
git add .
git commit -m "Druvor inte apelsiner"
```

Nu är du redo att sammanfoga äpplen-grenen till master-grenen:

```shell
git merge äpplen
```

Du bör se ett fel:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatic merge failed; fix conflicts and then commit the result.
```

En konflikt, bra! Låt oss lösa konflikten med vårt nykonfigurerade `mergetool`. Kör:

```shell
git mergetool
```

Vim visar fyra fönster. Var uppmärksam på de tre översta:

- `LOCAL` innehåller `druvor`. Detta är förändringen i "lokal", vad du sammanfogar in i.
- `BASE` innehåller `apelsiner`. Detta är den gemensamma förfadern mellan `LOCAL` och `REMOTE` för att jämföra hur de avviker.
- `REMOTE` innehåller `äpplen`. Detta är vad som sammanfogas in.

I botten (det fjärde fönstret) ser du:

```shell
pannkakor
våfflor
<<<<<<< HEAD
druvor
||||||| db63958
apelsiner
=======
äpplen
>>>>>>> äpplen
```

Det fjärde fönstret innehåller texterna för sammanfogningskonflikten. Med denna uppsättning är det lättare att se vilken förändring varje miljö har. Du kan se innehållet från `LOCAL`, `BASE` och `REMOTE` samtidigt.

Din markör ska vara på det fjärde fönstret, på det markerade området. För att få förändringen från `LOCAL` (druvor), kör `:diffget LOCAL`. För att få förändringen från `BASE` (apelsiner), kör `:diffget BASE` och för att få förändringen från `REMOTE` (äpplen), kör `:diffget REMOTE`.

I det här fallet, låt oss få förändringen från `LOCAL`. Kör `:diffget LOCAL`. Det fjärde fönstret kommer nu att ha druvor. Spara och avsluta alla filer (`:wqall`) när du är klar. Det var inte så illa, eller hur?

Om du märker, har du också en fil `breakfast.txt.orig` nu. Git skapar en backupfil ifall saker inte går bra. Om du inte vill att git ska skapa en backup under en sammanfogning, kör:

```shell
git config --global mergetool.keepBackup false
```

## Git Inuti Vim

Vim har ingen inbyggd git-funktion. Ett sätt att köra git-kommandon från Vim är att använda bang-operatören, `!`, i kommandorads-läget.

Vilket git-kommando som helst kan köras med `!`:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Du kan också använda Vims `%` (aktuell buffert) eller `#` (annan buffert) konventioner:

```shell
:!git add %         " git add aktuell fil
:!git checkout #    " git checkout den andra filen
```

Ett Vim-trick du kan använda för att lägga till flera filer i olika Vim-fönster är att köra:

```shell
:windo !git add %
```

Gör sedan en commit:

```shell
:!git commit "Just git-added everything in my Vim window, cool"
```

`windo`-kommandot är ett av Vims "gör"-kommandon, liknande `argdo` som du såg tidigare. `windo` kör kommandot i varje fönster.

Alternativt kan du också använda `bufdo !git add %` för att git add alla buffertar eller `argdo !git add %` för att git add alla filargument, beroende på ditt arbetsflöde.

## Plugins

Det finns många Vim-plugins för git-stöd. Nedan är en lista över några av de populära git-relaterade plugins för Vim (det finns förmodligen fler när du läser detta):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

En av de mest populära är vim-fugitive. För resten av kapitlet kommer jag att gå igenom flera git-arbetsflöden med hjälp av detta plugin.

## Vim-fugitive

Vim-fugitive-pluginet låter dig köra git CLI utan att lämna Vim-redigeraren. Du kommer att upptäcka att vissa kommandon är bättre när de körs från inuti Vim.

För att komma igång, installera vim-fugitive med en Vim-pluginhanterare ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim), etc).

## Git Status

När du kör kommandot `:Git` utan några parametrar, visar vim-fugitive ett git sammanfattningsfönster. Det visar de oövervakade, oinlagda och inlagda filerna. Medan du är i detta "`git status`" läge kan du göra flera saker:
- `Ctrl-N` / `Ctrl-P` för att gå upp eller ner i fil-listan.
- `-` för att ställa in eller avstänga filnamnet under markören.
- `s` för att ställa in filnamnet under markören.
- `u` för att avstänga filnamnet under markören.
- `>` / `<` för att visa eller dölja en inline diff av filnamnet under markören.

För mer, kolla in `:h fugitive-staging-maps`.

## Git Blame

När du kör kommandot `:Git blame` från den aktuella filen, visar vim-fugitive ett delat blame-fönster. Detta kan vara användbart för att hitta personen som är ansvarig för att skriva den buggiga raden av kod så att du kan skrika på honom / henne (skämt åsido).

Några saker du kan göra medan du är i detta `"git blame"` läge:
- `q` för att stänga blame-fönstret.
- `A` för att ändra storlek på författarkolumnen.
- `C` för att ändra storlek på commit-kolumnen.
- `D` för att ändra storlek på datum/tid-kolumnen.

För mer, kolla in `:h :Git_blame`.

## Gdiffsplit

När du kör kommandot `:Gdiffsplit`, kör vim-fugitive en `vimdiff` av den aktuella filens senaste ändringar mot indexet eller arbetsytan. Om du kör `:Gdiffsplit <commit>`, kör vim-fugitive en `vimdiff` mot den filen inuti `<commit>`.

Eftersom du är i ett `vimdiff`-läge kan du *få* eller *överföra* diffen med `:diffput` och `:diffget`.

## Gwrite och Gread

När du kör kommandot `:Gwrite` i en fil efter att du har gjort ändringar, ställer vim-fugitive in ändringarna. Det är som att köra `git add <current-file>`.

När du kör kommandot `:Gread` i en fil efter att du har gjort ändringar, återställer vim-fugitive filen till tillståndet före ändringarna. Det är som att köra `git checkout <current-file>`. En fördel med att köra `:Gread` är att åtgärden är ångringsbar. Om du, efter att ha kört `:Gread`, ändrar dig och vill behålla den gamla ändringen, kan du bara köra ångra (`u`) och Vim kommer att ångra `:Gread`-åtgärden. Detta skulle inte ha varit möjligt om du hade kört `git checkout <current-file>` från CLI.

## Gclog

När du kör kommandot `:Gclog`, visar vim-fugitive commit-historiken. Det är som att köra kommandot `git log`. Vim-fugitive använder Vims quickfix för att åstadkomma detta, så du kan använda `:cnext` och `:cprevious` för att navigera till nästa eller föregående logginformation. Du kan öppna och stänga logglistan med `:copen` och `:cclose`.

Medan du är i detta `"git log"` läge kan du göra två saker:
- Visa trädet.
- Besöka föräldern (den föregående commit).

Du kan skicka argument till `:Gclog` precis som kommandot `git log`. Om ditt projekt har en lång commit-historik och du bara behöver se de senaste tre commit, kan du köra `:Gclog -3`. Om du behöver filtrera det baserat på committernas datum, kan du köra något som `:Gclog --after="1 januari" --before="14 mars"`.

## Mer Vim-fugitive

Detta är bara några exempel på vad vim-fugitive kan göra. För att lära dig mer om vim-fugitive, kolla in `:h fugitive.txt`. De flesta av de populära git-kommandona är förmodligen optimerade med vim-fugitive. Du behöver bara leta efter dem i dokumentationen.

Om du är inne i ett av vim-fugitive's "speciallägen" (till exempel, inne i `:Git` eller `:Git blame` läge) och du vill lära dig vilka genvägar som är tillgängliga, tryck på `g?`. Vim-fugitive kommer att visa det lämpliga `:help`-fönstret för det läge du är i. Snyggt!
## Lär dig Vim och Git på det smarta sättet

Du kan tycka att vim-fugitive är ett bra komplement till ditt arbetsflöde (eller inte). Oavsett skulle jag starkt uppmuntra dig att kolla in alla plugins som listas ovan. Det finns förmodligen andra som jag inte listade. Gå och prova dem.

Ett uppenbart sätt att bli bättre på Vim-git-integration är att läsa mer om git. Git, i sig själv, är ett stort ämne och jag visar bara en bråkdel av det. Med det sagt, låt oss *git going* (ursäkta ordvitsen) och prata om hur man använder Vim för att kompilera din kod!