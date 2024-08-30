---
description: I denna kapitel lär du dig hur man kompilerar från Vim och utnyttjar
  kommandot `:make` för att effektivisera kompileringen av program.
title: Ch19. Compile
---

Compilering är ett viktigt ämne för många språk. I detta kapitel kommer du att lära dig hur man kompilerar från Vim. Du kommer också att titta på sätt att dra nytta av Vims `:make`-kommando.

## Kompilera Från Kommandoraden

Du kan använda bang-operatören (`!`) för att kompilera. Om du behöver kompilera din `.cpp`-fil med `g++`, kör:

```shell
:!g++ hello.cpp -o hello
```

Men att behöva skriva filnamnet och utdatafilnamnet manuellt varje gång är felbenäget och tråkigt. En makefil är vägen att gå.

## Make Kommandot

Vim har ett `:make`-kommando för att köra en makefil. När du kör det, letar Vim efter en makefil i den aktuella katalogen för att exekvera.

Skapa en fil med namnet `makefile` i den aktuella katalogen och lägg in detta:

```shell
all:
	echo "Hello all"
foo:
	echo "Hello foo"
list_pls:
	ls
```

Kör detta från Vim:

```shell
:make
```

Vim exekverar det på samma sätt som när du kör det från terminalen. `:make`-kommandot accepterar parametrar precis som terminalens make-kommando. Kör:

```shell
:make foo
" Skriver ut "Hello foo"

:make list_pls
" Skriver ut resultatet av ls-kommandot
```

`:make`-kommandot använder Vims quickfix för att lagra eventuella fel om du kör ett dåligt kommando. Låt oss köra ett icke-existerande mål:

```shell
:make dontexist
```

Du bör se ett fel när du kör det kommandot. För att se det felet, kör quickfix-kommandot `:copen` för att visa quickfix-fönstret:

```shell
|| make: *** No rule to make target `dontexist'.  Stop.
```

## Kompilera Med Make

Låt oss använda makefilen för att kompilera ett grundläggande `.cpp`-program. Först, låt oss skapa en `hello.cpp`-fil:

```shell
#include <iostream>

int main() {
    std::cout << "Hello!\n";
    return 0;
}
```

Uppdatera din makefil för att bygga och köra en `.cpp`-fil:

```shell
all:
	echo "build, run"
build:
	g++ hello.cpp -o hello
run:
	./hello
```

Kör nu:

```shell
:make build
```

`g++` kompilerar `./hello.cpp` och skapar `./hello`. Kör sedan:

```shell
:make run
```

Du bör se `"Hello!"` skrivas ut på terminalen.

## Olika Make Program

När du kör `:make`, kör Vim faktiskt vilket kommando som helst som är inställt under `makeprg`-alternativet. Om du kör `:set makeprg?`, kommer du att se:

```shell
makeprg=make
```

Det förvalda `:make`-kommandot är det externa kommandot `make`. För att ändra `:make`-kommandot till att köra `g++ {ditt-filnamn}` varje gång du kör det, kör:

```shell
:set makeprg=g++\ %
```

`\` används för att undkomma mellanrummet efter `g++`. `%`-symbolen i Vim representerar den aktuella filen. Kommandot `g++\\ %` är ekvivalent med att köra `g++ hello.cpp`.

Gå till `./hello.cpp` och kör sedan `:make`. Vim kompilerar `hello.cpp` och skapar `a.out` eftersom du inte specificerade utdata. Låt oss refaktorera det så att det namnger den kompilerade utdata med namnet på den ursprungliga filen minus tillägget. Kör eller lägg till detta i vimrc:

```shell
set makeprg=g++\ %\ -o\ %<
```

Uppdelningen:
- `g++\ %` är densamma som ovan. Det är ekvivalent med att köra `g++ <din-fil>`.
- `-o` är utdataalternativet.
- `%<` i Vim representerar det aktuella filnamnet utan tillägg (`hello.cpp` blir `hello`).

När du kör `:make` från `./hello.cpp`, kompileras det till `./hello`. För att snabbt köra `./hello` från `./hello.cpp`, kör `:!./%<`. Återigen, detta är detsamma som att köra `:!./{aktuella-filnamn-minus-tillägget}`.

För mer, kolla in `:h :compiler` och `:h write-compiler-plugin`.

## Automatisk Kompilering Vid Spara

Du kan göra livet ännu enklare genom att automatisera kompileringen. Kom ihåg att du kan använda Vims `autocmd` för att utlösa automatiska åtgärder baserat på vissa händelser. För att automatiskt kompilera `.cpp`-filer vid varje sparande, lägg till detta i din vimrc:

```shell
autocmd BufWritePost *.cpp make
```

Varje gång du sparar i en `.cpp`-fil, kör Vim `make`-kommandot.

## Byta Kompilator

Vim har ett `:compiler`-kommando för att snabbt byta kompilatorer. Din Vim-installation kommer förmodligen med flera förbyggda kompilatorinställningar. För att kontrollera vilka kompilatorer du har, kör:

```shell
:e $VIMRUNTIME/compiler/<Tab>
```

Du bör se en lista över kompilatorer för olika programmeringsspråk.

För att använda `:compiler`-kommandot, anta att du har en ruby-fil, `hello.rb` och inuti den har:

```shell
puts "Hello ruby"
```

Kom ihåg att om du kör `:make`, kör Vim vilket kommando som helst som är tilldelat `makeprg` (standard är `make`). Om du kör:

```shell
:compiler ruby
```

Vim kör `$VIMRUNTIME/compiler/ruby.vim`-skriptet och ändrar `makeprg` för att använda `ruby`-kommandot. Nu om du kör `:set makeprg?`, bör det säga `makeprg=ruby` (detta beror på vad som finns i din `$VIMRUNTIME/compiler/ruby.vim`-fil eller om du har andra anpassade ruby-kompilatorer. Ditt kan vara annorlunda). `:compiler {ditt-språk}`-kommandot gör att du snabbt kan byta till olika kompilatorer. Detta är användbart om ditt projekt använder flera språk.

Du behöver inte använda `:compiler` och `makeprg` för att kompilera ett program. Du kan köra ett testskript, lint en fil, skicka en signal, eller vad du vill.

## Skapa En Anpassad Kompilator

Låt oss skapa en enkel Typescript-kompilator. Installera Typescript (`npm install -g typescript`) på din maskin. Du bör nu ha `tsc`-kommandot. Om du inte har lekt med typescript tidigare, kompilerar `tsc` en Typescript-fil till en Javascript-fil. Anta att du har en fil, `hello.ts`:

```shell
const hello = "hello";
console.log(hello);
```

Om du kör `tsc hello.ts`, kommer det att kompileras till `hello.js`. Men om du har följande uttryck inuti `hello.ts`:

```shell
const hello = "hello";
hello = "hello again";
console.log(hello);
```

Detta kommer att kasta ett fel eftersom du inte kan mutera en `const`-variabel. Att köra `tsc hello.ts` kommer att kasta ett fel:

```shell
hello.ts:2:1 - error TS2588: Cannot assign to 'person' because it is a constant.

2 person = "hello again";
  ~~~~~~


Found 1 error.
```

För att skapa en enkel Typescript-kompilator, i din `~/.vim/`-katalog, lägg till en `compiler`-katalog (`~/.vim/compiler/`), skapa sedan en `typescript.vim`-fil (`~/.vim/compiler/typescript.vim`). Lägg in detta:

```shell
CompilerSet makeprg=tsc
CompilerSet errorformat=%f:\ %m
```

Den första raden ställer in `makeprg` för att köra `tsc`-kommandot. Den andra raden ställer in felformatet för att visa filen (`%f`), följt av ett bokstavligt kolon (`:`) och ett undkommet mellanrum (`\ `), följt av felmeddelandet (`%m`). För att lära dig mer om felformatering, kolla in `:h errorformat`.

Du bör också läsa några av de förgjorda kompilatorerna för att se hur andra gör det. Kolla in `:e $VIMRUNTIME/compiler/<något-språk>.vim`.

Eftersom vissa plugins kan störa Typescript-filen, låt oss öppna `hello.ts` utan några plugins, med hjälp av `--noplugin`-flaggan:

```shell
vim --noplugin hello.ts
```

Kontrollera `makeprg`:

```shell
:set makeprg?
```

Det bör säga det förvalda `make`-programmet. För att använda den nya Typescript-kompilatorn, kör:

```shell
:compiler typescript
```

När du kör `:set makeprg?`, bör det nu säga `tsc`. Låt oss sätta det på prov. Kör:

```shell
:make %
```

Kom ihåg att `%` betyder den aktuella filen. Se din Typescript-kompilator fungera som förväntat! För att se listan över fel, kör `:copen`.

## Async Kompilator

Ibland kan kompilering ta lång tid. Du vill inte sitta och stirra på en fryst Vim medan du väntar på att din kompilering ska bli klar. Skulle det inte vara trevligt om du kunde kompilera asynkront så att du fortfarande kan använda Vim under kompileringen?

Lyckligtvis finns det plugins för att köra asynkrona processer. De två stora är:

- [vim-dispatch](https://github.com/tpope/vim-dispatch)
- [asyncrun.vim](https://github.com/skywind3000/asyncrun.vim)

I resten av detta kapitel kommer jag att gå igenom vim-dispatch, men jag skulle starkt rekommendera att du provar alla de där ute.

*Vim och NeoVim stöder faktiskt asynkrona jobb, men de ligger utanför ramen för detta kapitel. Om du är nyfiken, kolla in `:h job-channel-overview.txt`.*

## Plugin: Vim-dispatch

Vim-dispatch har flera kommandon, men de två huvudkommandona är `:Make` och `:Dispatch` kommandon.

### Async Make

Vim-dispatchs `:Make`-kommando liknar Vims `:make`, men det körs asynkront. Om du är i ett Javascript-projekt och du behöver köra `npm t`, kan du försöka ställa in din makeprg till att vara:

```shell
:set makeprg=npm\\ t
```

Om du kör:

```shell
:make
```

Vim kommer att exekvera `npm t`, men du kommer att stirra på en fryst skärm medan ditt JavaScript-test körs. Med vim-dispatch kan du bara köra:

```shell
:Make
```

Vim kommer att köra `npm t` asynkront. På så sätt, medan `npm t` körs i en bakgrundsprocess, kan du fortsätta göra vad du höll på med. Fantastiskt!

### Async Dispatch

`:Dispatch`-kommandot är som `:compiler` och `:!`-kommandot. Det kan köra vilket externt kommando som helst asynkront i Vim.

Anta att du är inne i en ruby-specfil och du behöver köra ett test. Kör:

```shell
:Dispatch bundle exec rspec %
```

Vim kommer asynkront att köra `rspec`-kommandot mot den aktuella filen (`%`).

### Automatisera Dispatch

Vim-dispatch har `b:dispatch`-buffervariabeln som du kan konfigurera för att utvärdera specifika kommandon automatiskt. Du kan utnyttja det med `autocmd`. Om du lägger till detta i din vimrc:

```shell
autocmd BufEnter *_spec.rb let b:dispatch = 'bundle exec rspec %'
```

Nu varje gång du går in i en fil (`BufEnter`) som slutar med `_spec.rb`, kör `:Dispatch` automatiskt `bundle exec rspec {din-aktuella-ruby-spec-fil}`.

## Lär Dig Kompilera På Ett Smart Sätt

I detta kapitel lärde du dig att du kan använda `make` och `compiler`-kommandona för att köra *vilken* process som helst från inuti Vim asynkront för att komplettera din programmeringsarbetsflöde. Vims förmåga att utöka sig själv med andra program gör det kraftfullt.