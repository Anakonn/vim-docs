---
description: Lär dig olika sätt att starta Vim från terminalen och få en grundläggande
  förståelse för dess installation och användning som en modal textredigerare.
title: Ch01. Starting Vim
---

I det här kapitlet kommer du att lära dig olika sätt att starta Vim från terminalen. Jag använde Vim 8.2 när jag skrev den här guiden. Om du använder Neovim eller en äldre version av Vim bör det mesta fungera, men var medveten om att vissa kommandon kanske inte är tillgängliga.

## Installation

Jag kommer inte att gå igenom detaljerade instruktioner om hur man installerar Vim på en specifik maskin. Den goda nyheten är att de flesta Unix-baserade datorer bör ha Vim installerat. Om inte, bör de flesta distributioner ha instruktioner för att installera Vim.

För att ladda ner mer information om Vim-installationsprocessen, kolla in Vims officiella nedladdningswebbplats eller Vims officiella github-repo:
- [Vim-webbplats](https://www.vim.org/download.php)
- [Vim github](https://github.com/vim/vim)

## Vim-kommandot

Nu när du har Vim installerat, kör detta från terminalen:

```bash
vim
```

Du bör se en introduktionsskärm. Det här är där du kommer att arbeta med din nya fil. Till skillnad från de flesta textredigerare och IDE:er är Vim en modal redigerare. Om du vill skriva "hello" måste du växla till insättningsläge med `i`. Tryck `ihello<Esc>` för att infoga texten "hello".

## Avsluta Vim

Det finns flera sätt att avsluta Vim. Det vanligaste är att skriva:

```shell
:quit
```

Du kan skriva `:q` för kort. Det kommandot är ett kommandoradsmoduskommando (ett annat av Vims lägen). Om du skriver `:` i normalt läge kommer markören att flytta sig till botten av skärmen där du kan skriva några kommandon. Du kommer att lära dig om kommandoradsmodet senare i kapitel 15. Om du är i insättningsläge kommer att skriva `:` bokstavligen att producera tecknet ":" på skärmen. I det här fallet måste du växla tillbaka till normalt läge. Skriv `<Esc>` för att växla till normalt läge. Förresten, du kan också återgå till normalt läge från kommandoradsmodet genom att trycka på `<Esc>`. Du kommer att märka att du kan "fly" från flera Vim-lägen tillbaka till normalt läge genom att trycka på `<Esc>`.

## Spara en fil

För att spara dina ändringar, skriv:

```shell
:write
```

Du kan också skriva `:w` för kort. Om detta är en ny fil måste du ge den ett namn innan du kan spara den. Låt oss kalla den `file.txt`. Kör:

```shell
:w file.txt
```

För att spara och avsluta kan du kombinera kommandona `:w` och `:q`:

```shell
:wq
```

För att avsluta utan att spara några ändringar, lägg till `!` efter `:q` för att tvinga avslutning:

```shell
:q!
```

Det finns andra sätt att avsluta Vim, men dessa är de du kommer att använda dagligen.

## Hjälp

Genom hela denna guide kommer jag att hänvisa dig till olika Vims hjälp-sidor. Du kan gå till hjälp-sidan genom att skriva `:help {some-command}` (`:h` för kort). Du kan skicka ett ämne eller ett kommandonamn som argument till `:h`-kommandot. Till exempel, för att lära dig om olika sätt att avsluta Vim, skriv:

```shell
:h write-quit
```

Hur visste jag att jag skulle söka efter "write-quit"? Jag visste faktiskt inte. Jag skrev bara `:h`, sedan "quit", sedan `<Tab>`. Vim visade relevanta nyckelord att välja mellan. Om du någonsin behöver slå upp något ("Jag önskar att Vim kunde göra detta..."), skriv bara `:h` och prova några nyckelord, sedan `<Tab>`.

## Öppna en fil

För att öppna en fil (`hello1.txt`) i Vim från terminalen, kör:

```bash
vim hello1.txt
```

Du kan också öppna flera filer samtidigt:

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim öppnar `hello1.txt`, `hello2.txt` och `hello3.txt` i separata buffertar. Du kommer att lära dig om buffertar i nästa kapitel.

## Argument

Du kan skicka `vim`-terminalkommandot med olika flaggor och alternativ.

För att kontrollera den aktuella Vim-versionen, kör:

```bash
vim --version
```

Detta berättar för dig den aktuella Vim-versionen och alla tillgängliga funktioner markerade med antingen `+` eller `-`. Vissa av dessa funktioner i denna guide kräver att vissa funktioner är tillgängliga. Till exempel kommer du att utforska Vims kommandoradshistorik i ett senare kapitel med kommandot `:history`. Din Vim behöver ha funktionen `+cmdline_history` för att kommandot ska fungera. Det finns en god chans att den Vim du just installerade har alla nödvändiga funktioner, särskilt om den kommer från en populär nedladdningskälla.

Många saker du gör från terminalen kan också göras från inuti Vim. För att se versionen från *inuti* Vim kan du köra detta:

```shell
:version
```

Om du vill öppna filen `hello.txt` och omedelbart köra ett Vim-kommando kan du skicka alternativet `+{cmd}` till `vim`-kommandot.

I Vim kan du ersätta strängar med kommandot `:s` (kort för `:substitute`). Om du vill öppna `hello.txt` och ersätta alla "pancake" med "bagel", kör:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Dessa Vim-kommandon kan staplas:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim kommer att ersätta alla instanser av "pancake" med "bagel", sedan ersätta "bagel" med "egg", sedan ersätta "egg" med "donut" (du kommer att lära dig om ersättning i ett senare kapitel).

Du kan också skicka alternativet `-c` följt av ett Vim-kommando istället för `+`-syntaxen:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Öppna flera fönster

Du kan starta Vim med delade horisontella och vertikala fönster med alternativen `-o` och `-O`, respektive.

För att öppna Vim med två horisontella fönster, kör:

```bash
vim -o2
```

För att öppna Vim med 5 horisontella fönster, kör:

```bash
vim -o5
```

För att öppna Vim med 5 horisontella fönster och fylla de första två med `hello1.txt` och `hello2.txt`, kör:

```bash
vim -o5 hello1.txt hello2.txt
```

För att öppna Vim med två vertikala fönster, 5 vertikala fönster och 5 vertikala fönster med 2 filer:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Pausa

Om du behöver pausa Vim medan du redigerar kan du trycka på `Ctrl-z`. Du kan också köra antingen kommandot `:stop` eller `:suspend`. För att återgå till den pausade Vim, kör `fg` från terminalen.

## Starta Vim på det smarta sättet

Kommandot `vim` kan ta många olika alternativ, precis som vilket annat terminalkommando som helst. Två alternativ gör att du kan skicka ett Vim-kommando som parameter: `+{cmd}` och `-c cmd`. När du lär dig fler kommandon genom hela denna guide, se om du kan tillämpa det när du startar Vim. Eftersom det också är ett terminalkommando kan du kombinera `vim` med många andra terminalkommandon. Till exempel kan du omdirigera utdata från kommandot `ls` för att redigeras i Vim med `ls -l | vim -`.

För att lära dig mer om `vim`-kommandot i terminalen, kolla in `man vim`. För att lära dig mer om Vim-redigeraren, fortsätt läsa den här guiden tillsammans med kommandot `:help`.