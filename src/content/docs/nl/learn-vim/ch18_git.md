---
description: Dit document behandelt de integratie van Vim en Git, met een focus op
  het vergelijken van bestanden met `vimdiff` en het beheren van versies.
title: Ch18. Git
---

Vim en git zijn twee geweldige tools voor twee verschillende dingen. Git is een versiebeheertool. Vim is een teksteditor.

In dit hoofdstuk leer je verschillende manieren om Vim en git samen te integreren.

## Diffen

Vergeet niet dat je in het vorige hoofdstuk een `vimdiff`-commando kunt uitvoeren om de verschillen tussen meerdere bestanden te tonen.

Stel dat je twee bestanden hebt, `file1.txt` en `file2.txt`.

In `file1.txt`:

```shell
pannenkoeken
wafels
appels

melk
appelsap

yoghurt
```

In `file2.txt`:

```shell
pannenkoeken
wafels
sinaasappels

melk
sinaasappelsap

yoghurt
```

Om de verschillen tussen beide bestanden te zien, voer je uit:

```shell
vimdiff file1.txt file2.txt
```

Alternatief kun je uitvoeren:

```shell
vim -d file1.txt file2.txt
```

`vimdiff` toont twee buffers naast elkaar. Aan de linkerkant is `file1.txt` en aan de rechterkant is `file2.txt`. De eerste verschillen (appels en sinaasappels) zijn gemarkeerd op beide regels.

Stel dat je de tweede buffer appels wilt laten hebben, niet sinaasappels. Om de inhoud van je huidige positie (je bevindt je momenteel op `file1.txt`) naar `file2.txt` over te brengen, ga je eerst naar de volgende diff met `]c` (om naar het vorige diff-venster te springen, gebruik je `[c`). De cursor zou nu op appels moeten staan. Voer `:diffput` uit. Beide bestanden zouden nu appels moeten hebben.

Als je de tekst van de andere buffer (sinaasappelsap, `file2.txt`) wilt overbrengen om de tekst in de huidige buffer (appelsap, `file1.txt`) te vervangen, blijf je met je cursor op het `file1.txt`-venster, ga je eerst naar de volgende diff met `]c`. Je cursor zou nu op appelsap moeten staan. Voer `:diffget` uit om de sinaasappelsap van de andere buffer te krijgen en appelsap in onze buffer te vervangen.

`:diffput` *plaatst* de tekst van de huidige buffer naar een andere buffer. `:diffget` *krijgt* de tekst van een andere buffer naar de huidige buffer.

Als je meerdere buffers hebt, kun je `:diffput fileN.txt` en `:diffget fileN.txt` uitvoeren om de fileN-buffer te targeten.

## Vim als een Merge Tool

> "Ik hou ervan om merge-conflicten op te lossen!" - Niemand

Ik ken niemand die het leuk vindt om merge-conflicten op te lossen. Echter, ze zijn onvermijdelijk. In deze sectie leer je hoe je Vim kunt gebruiken als een tool voor het oplossen van merge-conflicten.

Eerst verander je de standaard merge-tool naar `vimdiff` door uit te voeren:

```shell
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

Alternatief kun je de `~/.gitconfig` direct aanpassen (standaard zou deze in root moeten staan, maar die van jou kan op een andere plek staan). De bovenstaande commando's zouden je gitconfig moeten aanpassen zodat deze eruitziet als de onderstaande instelling. Als je ze nog niet hebt uitgevoerd, kun je ook handmatig je gitconfig bewerken.

```shell
[core]
  editor = vim
[merge]
  tool = vimdiff
  conflictstyle = diff3
[difftool]
  prompt = false
```

Laten we een nep merge-conflict creëren om dit uit te testen. Maak een directory `/food` en maak het een git-repository:

```shell
git init
```

Voeg een bestand toe, `breakfast.txt`. In:

```shell
pannenkoeken
wafels
sinaasappels
```

Voeg het bestand toe en commit het:

```shell
git add .
git commit -m "Initiële ontbijtcommit"
```

Maak vervolgens een nieuwe branch aan en noem deze appels branch:

```shell
git checkout -b appels
```

Verander `breakfast.txt`:

```shell
pannenkoeken
wafels
appels
```

Sla het bestand op, voeg de wijziging toe en commit:

```shell
git add .
git commit -m "Appels, geen sinaasappels"
```

Geweldig. Nu heb je sinaasappels in de master branch en appels in de appels branch. Laten we terugkeren naar de master branch:

```shell
git checkout master
```

In `breakfast.txt` zou je de basis tekst, sinaasappels, moeten zien. Laten we het veranderen in druiven omdat ze nu in het seizoen zijn:

```shell
pannenkoeken
wafels
druiven
```

Sla op, voeg toe en commit:

```shell
git add .
git commit -m "Druiven, geen sinaasappels"
```

Nu ben je klaar om de appels branch in de master branch te mergen:

```shell
git merge appels
```

Je zou een foutmelding moeten zien:

```shell
Auto-merging breakfast.txt
CONFLICT (content): Merge conflict in breakfast.txt
Automatische merge is mislukt; los conflicten op en commit het resultaat.
```

Een conflict, geweldig! Laten we het conflict oplossen met onze nieuw geconfigureerde `mergetool`. Voer uit:

```shell
git mergetool
```

Vim toont vier vensters. Let op de bovenste drie:

- `LOCAL` bevat `druiven`. Dit is de wijziging in "lokaal", waar je in merge.
- `BASE` bevat `sinaasappels`. Dit is de gemeenschappelijke voorouder tussen `LOCAL` en `REMOTE` om te vergelijken hoe ze divergeren.
- `REMOTE` bevat `appels`. Dit is wat wordt samengevoegd.

Onderaan (het vierde venster) zie je:

```shell
pannenkoeken
wafels
<<<<<<< HEAD
druiven
||||||| db63958
sinaasappels
=======
appels
>>>>>>> appels
```

Het vierde venster bevat de teksten van de merge-conflicten. Met deze opstelling is het gemakkelijker om te zien welke wijziging elke omgeving heeft. Je kunt de inhoud van `LOCAL`, `BASE` en `REMOTE` tegelijkertijd zien.

Je cursor zou op het vierde venster moeten staan, op het gemarkeerde gebied. Om de wijziging van `LOCAL` (druiven) te krijgen, voer je `:diffget LOCAL` uit. Om de wijziging van `BASE` (sinaasappels) te krijgen, voer je `:diffget BASE` uit en om de wijziging van `REMOTE` (appels) te krijgen, voer je `:diffget REMOTE` uit.

In dit geval, laten we de wijziging van `LOCAL` krijgen. Voer `:diffget LOCAL` uit. Het vierde venster zal nu druiven hebben. Sla op en verlaat alle bestanden (`:wqall`) wanneer je klaar bent. Dat was niet slecht, toch?

Als je opmerkt, heb je nu ook een bestand `breakfast.txt.orig`. Git maakt een back-upbestand aan voor het geval dingen niet goed gaan. Als je niet wilt dat git een back-up maakt tijdens een merge, voer je uit:

```shell
git config --global mergetool.keepBackup false
```

## Git Binnen Vim

Vim heeft geen ingebouwde git-functie. Een manier om git-commando's vanuit Vim uit te voeren, is door de bang-operator, `!`, in de commandoregelmodus te gebruiken.

Elk git-commando kan worden uitgevoerd met `!`:

```shell
:!git status
:!git commit
:!git diff
:!git push origin master
```

Je kunt ook de `%` (huidige buffer) of `#` (andere buffer) conventies van Vim gebruiken:

```shell
:!git add %         " git voeg huidig bestand toe
:!git checkout #    " git checkout het andere bestand
```

Een truc in Vim die je kunt gebruiken om meerdere bestanden in verschillende Vim-vensters toe te voegen, is om uit te voeren:

```shell
:windo !git add %
```

Voer vervolgens een commit uit:

```shell
:!git commit "Ik heb net alles in mijn Vim-venster toegevoegd, cool"
```

De `windo`-opdracht is een van de "do" opdrachten van Vim, vergelijkbaar met `argdo` die je eerder hebt gezien. `windo` voert de opdracht in elk venster uit.

Alternatief kun je ook `bufdo !git add %` gebruiken om alle buffers toe te voegen of `argdo !git add %` om alle bestandsargumenten toe te voegen, afhankelijk van je workflow.

## Plugins

Er zijn veel Vim-plugins voor git-ondersteuning. Hieronder staat een lijst van enkele populaire git-gerelateerde plugins voor Vim (er zijn waarschijnlijk meer op het moment dat je dit leest):

- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [vim-signify](https://github.com/mhinz/vim-signify)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [gv.vim](https://github.com/junegunn/gv.vim)
- [vimagit](https://github.com/jreybert/vimagit)
- [vim-twiggy](https://github.com/sodapopcan/vim-twiggy)
- [rhubarb](https://github.com/tpope/vim-rhubarb)

Een van de populairste is vim-fugitive. Voor de rest van het hoofdstuk zal ik verschillende git-workflows met deze plugin doornemen.

## Vim-fugitive

De vim-fugitive-plugin stelt je in staat om de git CLI uit te voeren zonder de Vim-editor te verlaten. Je zult merken dat sommige commando's beter zijn wanneer ze vanuit Vim worden uitgevoerd.

Om te beginnen, installeer de vim-fugitive met een Vim-pluginmanager ([vim-plug](https://github.com/junegunn/vim-plug), [vundle](https://github.com/VundleVim/Vundle.vim), [dein.vim](https://github.com/Shougo/dein.vim), enz.).

## Git Status

Wanneer je het `:Git`-commando zonder parameters uitvoert, toont vim-fugitive een git-samenvattingsvenster. Het toont de niet-gevolgde, niet-gestage en gestage bestand(en). Terwijl je in deze "`git status`" modus bent, kun je verschillende dingen doen:
- `Ctrl-N` / `Ctrl-P` om omhoog of omlaag in de bestandslijst te gaan.
- `-` om de bestandsnaam onder de cursor te stage of unstagen.
- `s` om de bestandsnaam onder de cursor te stage.
- `u` om de bestandsnaam onder de cursor te unstagen.
- `>` / `<` om een inline diff van de bestandsnaam onder de cursor weer te geven of te verbergen.

Voor meer, kijk naar `:h fugitive-staging-maps`.

## Git Blame

Wanneer je het `:Git blame`-commando vanuit het huidige bestand uitvoert, toont vim-fugitive een gesplitst blame-venster. Dit kan nuttig zijn om de persoon te vinden die verantwoordelijk is voor het schrijven van die foutieve regel code, zodat je hem/haar kunt uitschelden (geintje).

Enkele dingen die je kunt doen terwijl je in deze `"git blame"` modus bent:
- `q` om het blame-venster te sluiten.
- `A` om de auteur kolom te vergroten.
- `C` om de commit kolom te vergroten.
- `D` om de datum/tijd kolom te vergroten.

Voor meer, kijk naar `:h :Git_blame`.

## Gdiffsplit

Wanneer je het `:Gdiffsplit`-commando uitvoert, voert vim-fugitive een `vimdiff` uit van de laatste wijzigingen van het huidige bestand tegen de index of werkboom. Als je `:Gdiffsplit <commit>` uitvoert, voert vim-fugitive een `vimdiff` uit tegen dat bestand binnen `<commit>`.

Omdat je in een `vimdiff`-modus bent, kun je *krijgen* of *plaatsen* met `:diffput` en `:diffget`.

## Gwrite en Gread

Wanneer je het `:Gwrite`-commando in een bestand uitvoert nadat je wijzigingen hebt aangebracht, stageert vim-fugitive de wijzigingen. Het is alsof je `git add <huidig-bestand>` uitvoert.

Wanneer je het `:Gread`-commando in een bestand uitvoert nadat je wijzigingen hebt aangebracht, herstelt vim-fugitive het bestand naar de staat vóór de wijzigingen. Het is alsof je `git checkout <huidig-bestand>` uitvoert. Een voordeel van het uitvoeren van `:Gread` is dat de actie ongedaan kan worden gemaakt. Als je, nadat je `:Gread` hebt uitgevoerd, van gedachten verandert en de oude wijziging wilt behouden, kun je gewoon ongedaan maken (`u`) en Vim zal de `:Gread`-actie ongedaan maken. Dit zou niet mogelijk zijn geweest als je `git checkout <huidig-bestand>` vanuit de CLI had uitgevoerd.

## Gclog

Wanneer je het `:Gclog`-commando uitvoert, toont vim-fugitive de commitgeschiedenis. Het is alsof je het `git log`-commando uitvoert. Vim-fugitive gebruikt Vim's quickfix om dit te bereiken, zodat je `:cnext` en `:cprevious` kunt gebruiken om naar de volgende of vorige loginformatie te navigeren. Je kunt de loglijst openen en sluiten met `:copen` en `:cclose`.

Terwijl je in deze `"git log"` modus bent, kun je twee dingen doen:
- De boom bekijken.
- De ouder bezoeken (de vorige commit).

Je kunt argumenten aan `:Gclog` doorgeven, net zoals bij het `git log`-commando. Als je project een lange commitgeschiedenis heeft en je alleen de laatste drie commits wilt bekijken, kun je `:Gclog -3` uitvoeren. Als je het wilt filteren op basis van de datum van de commit, kun je iets doen als `:Gclog --after="1 januari" --before="14 maart"`.

## Meer Vim-fugitive

Dit zijn slechts enkele voorbeelden van wat vim-fugitive kan doen. Om meer te leren over vim-fugitive, kijk naar `:h fugitive.txt`. De meeste populaire git-commando's zijn waarschijnlijk geoptimaliseerd met vim-fugitive. Je hoeft alleen maar in de documentatie te zoeken.

Als je in een van de "speciale modus" van vim-fugitive bent (bijvoorbeeld in `:Git` of `:Git blame` modus) en je wilt leren welke sneltoetsen beschikbaar zijn, druk dan op `g?`. Vim-fugitive toont het bijbehorende `:help`-venster voor de modus waarin je je bevindt. Leuk!
## Leer Vim en Git op de Slimme Manier

Je zult misschien ontdekken dat vim-fugitive een goede aanvulling op je workflow is (of niet). Hoe dan ook, ik moedig je sterk aan om alle hierboven vermelde plugins te bekijken. Er zijn waarschijnlijk andere die ik niet heb vermeld. Ga ze uitproberen.

Een voor de hand liggende manier om beter te worden in Vim-git integratie is om meer te lezen over git. Git, op zichzelf, is een uitgestrekt onderwerp en ik laat slechts een fractie ervan zien. Laten we *git gaan* (excuseer de woordspeling) en praten over hoe je Vim kunt gebruiken om je code te compileren!