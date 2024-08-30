---
description: I detta kapitel lär du dig hur du använder Vims inbyggda pluginhanterare,
  *packages*, för att installera och hantera plugins effektivt.
title: Ch23. Vim Packages
---

I det föregående kapitlet nämnde jag att använda en extern pluginhanterare för att installera plugins. Sedan version 8 kommer Vim med sin egen inbyggda pluginhanterare som kallas *packages*. I det här kapitlet kommer du att lära dig hur man använder Vim-paket för att installera plugins.

För att se om din Vim-version har möjlighet att använda paket, kör `:version` och leta efter `+packages`-attributet. Alternativt kan du också köra `:echo has('packages')` (om det returnerar 1, då har det paketmöjligheten).

## Pack Directory

Kontrollera om du har en `~/.vim/`-katalog i rotvägen. Om du inte har det, skapa en. Inuti den, skapa en katalog som heter `pack` (`~/.vim/pack/`). Vim vet automatiskt att söka inuti denna katalog efter paket.

## Två typer av inläsning

Vim-paket har två inläsningsmekanismer: automatisk och manuell inläsning.

### Automatisk inläsning

För att ladda plugins automatiskt när Vim startar, behöver du lägga dem i `start/`-katalogen. Sökvägen ser ut så här:

```shell
~/.vim/pack/*/start/
```

Nu kanske du frågar, "Vad är `*` mellan `pack/` och `start/`?" `*` är ett godtyckligt namn och kan vara vad du vill. Låt oss kalla det `packdemo/`:

```shell
~/.vim/pack/packdemo/start/
```

Tänk på att om du hoppar över det och gör något som detta istället:

```shell
~/.vim/pack/start/
```

Kommer paketssystemet inte att fungera. Det är viktigt att sätta ett namn mellan `pack/` och `start/`.

För denna demo, låt oss försöka installera [NERDTree](https://github.com/preservim/nerdtree) plugin. Gå hela vägen till `start/`-katalogen (`cd ~/.vim/pack/packdemo/start/`) och klona NERDTree-repositoriet:

```shell
git clone https://github.com/preservim/nerdtree.git
```

Det är allt! Du är redo. Nästa gång du startar Vim kan du omedelbart köra NERDTree-kommandon som `:NERDTreeToggle`.

Du kan klona så många plugin-repositorier du vill inuti sökvägen `~/.vim/pack/*/start/`. Vim kommer automatiskt att ladda varje enskild. Om du tar bort det klonade repositoriet (`rm -rf nerdtree/`), kommer den pluginen inte längre att vara tillgänglig.

### Manuell inläsning

För att ladda plugins manuellt när Vim startar, behöver du lägga dem i `opt/`-katalogen. Likt den automatiska inläsningen, ser sökvägen ut så här:

```shell
~/.vim/pack/*/opt/
```

Låt oss använda samma `packdemo/`-katalog som tidigare:

```shell
~/.vim/pack/packdemo/opt/
```

Denna gång, låt oss installera [killersheep](https://github.com/vim/killersheep) spelet (detta kräver Vim 8.2). Gå till `opt/`-katalogen (`cd ~/.vim/pack/packdemo/opt/`) och klona repositoriet:

```shell
git clone https://github.com/vim/killersheep.git
```

Starta Vim. Kommandot för att köra spelet är `:KillKillKill`. Försök att köra det. Vim kommer att klaga på att det inte är ett giltigt redigeringskommando. Du behöver *manuellt* ladda pluginen först. Låt oss göra det:

```shell
:packadd killersheep
```

Försök nu att köra kommandot igen `:KillKillKill`. Kommandot bör fungera nu.

Du kanske undrar, "Varför skulle jag någonsin vilja ladda paket manuellt? Är det inte bättre att automatiskt ladda allt vid starten?"

Bra fråga. Ibland finns det plugins som du inte kommer att använda hela tiden, som det där KillerSheep-spelet. Du behöver förmodligen inte ladda 10 olika spel och sakta ner Vim-starttiden. Men, då och då, när du är uttråkad, kanske du vill spela några spel. Använd manuell inläsning för icke-väsentliga plugins.

Du kan också använda detta för att villkorligt lägga till plugins. Kanske använder du både Neovim och Vim och det finns plugins som är optimerade för Neovim. Du kan lägga till något som detta i din vimrc:

```shell
if has('nvim')
  packadd! neovim-only-plugin
else
  packadd! generic-vim-plugin
endif
```

## Organisera paket

Kom ihåg att kravet för att använda Vims paketssystem är att ha antingen:

```shell
~/.vim/pack/*/start/
```

Eller:

```shell
~/.vim/pack/*/opt/
```

Det faktum att `*` kan vara *vilket* namn som helst kan användas för att organisera dina paket. Anta att du vill gruppera dina plugins baserat på kategorier (färger, syntax och spel):

```shell
~/.vim/pack/colors/
~/.vim/pack/syntax/
~/.vim/pack/games/
```

Du kan fortfarande använda `start/` och `opt/` inuti varje av katalogerna.

```shell
~/.vim/pack/colors/start/
~/.vim/pack/colors/opt/

~/.vim/pack/syntax/start/
~/.vim/pack/syntax/opt/

~/.vim/pack/games/start/
~/.vim/pack/games/opt/
```

## Lägga till paket på det smarta sättet

Du kanske undrar om Vim-paket kommer att göra populära pluginhanterare som vim-pathogen, vundle.vim, dein.vim och vim-plug föråldrade.

Svaret är, som alltid, "det beror på".

Jag använder fortfarande vim-plug eftersom det gör det enkelt att lägga till, ta bort eller uppdatera plugins. Om du använder många plugins kan det vara mer bekvämt att använda pluginhanterare eftersom det är enkelt att uppdatera många samtidigt. Vissa pluginhanterare erbjuder också asynkrona funktioner.

Om du är en minimalist, prova Vim-paket. Om du är en tung pluginanvändare kanske du vill överväga att använda en pluginhanterare.