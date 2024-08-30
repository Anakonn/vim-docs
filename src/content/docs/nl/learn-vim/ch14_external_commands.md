---
description: Leer hoe je Vim kunt uitbreiden om naadloos samen te werken met externe
  Unix-commando's, inclusief het lezen, schrijven en uitvoeren van opdrachten.
title: Ch14. External Commands
---

Binnen het Unix-systeem vind je veel kleine, hypergespecialiseerde commando's die één ding doen (en dat goed doen). Je kunt deze commando's aan elkaar koppelen om samen een complex probleem op te lossen. Zou het niet geweldig zijn als je deze commando's vanuit Vim kunt gebruiken?

Zeker. In dit hoofdstuk leer je hoe je Vim kunt uitbreiden om naadloos samen te werken met externe commando's.

## Het Bang Commando

Vim heeft een bang (`!`) commando dat drie dingen kan doen:

1. Lees de STDOUT van een extern commando in de huidige buffer.
2. Schrijf de inhoud van je buffer als de STDIN naar een extern commando.
3. Voer een extern commando uit vanuit Vim.

Laten we elk van deze bekijken.

## De STDOUT van een Commando Lezen in Vim

De syntaxis om de STDOUT van een extern commando in de huidige buffer te lezen is:

```shell
:r !cmd
```

`:r` is het leescommando van Vim. Als je het zonder `!` gebruikt, kun je het gebruiken om de inhoud van een bestand te krijgen. Als je een bestand `file1.txt` in de huidige map hebt en je voert uit:

```shell
:r file1.txt
```

Zal Vim de inhoud van `file1.txt` in de huidige buffer plaatsen.

Als je het `:r` commando volgt met een `!` en een extern commando, zal de uitvoer van dat commando in de huidige buffer worden ingevoegd. Om het resultaat van het `ls` commando te krijgen, voer je uit:

```shell
:r !ls
```

Het retourneert iets als:

```shell
file1.txt
file2.txt
file3.txt
```

Je kunt de gegevens van het `curl` commando lezen:

```shell
:r !curl -s 'https://jsonplaceholder.typicode.com/todos/1'
```

Het `r` commando accepteert ook een adres:

```shell
:10r !cat file1.txt
```

Nu zal de STDOUT van het uitvoeren van `cat file1.txt` na regel 10 worden ingevoegd.

## De Bufferinhoud Schrijven naar een Extern Commando

Het commando `:w`, naast het opslaan van een bestand, kan worden gebruikt om de tekst in de huidige buffer als de STDIN voor een extern commando door te geven. De syntaxis is:

```shell
:w !cmd
```

Als je deze expressies hebt:

```shell
console.log("Hello Vim");
console.log("Vim is awesome");
```

Zorg ervoor dat je [node](https://nodejs.org/en/) op je machine hebt geïnstalleerd, en voer dan uit:

```shell
:w !node
```

Vim zal `node` gebruiken om de JavaScript-expressies uit te voeren om "Hello Vim" en "Vim is awesome" af te drukken.

Bij het gebruik van het `:w` commando gebruikt Vim alle teksten in de huidige buffer, vergelijkbaar met het globale commando (de meeste commandoregelcommando's, als je er geen bereik aan doorgeeft, voeren alleen het commando uit tegen de huidige regel). Als je `:w` een specifiek adres doorgeeft:

```shell
:2w !node
```

Gebruikt Vim alleen de tekst van de tweede regel in de `node` interpreter.

Er is een subtiel maar significant verschil tussen `:w !node` en `:w! node`. Met `:w !node` schrijf je de tekst in de huidige buffer naar het externe commando `node`. Met `:w! node` dwing je het opslaan van een bestand en noem je het bestand "node".

## Een Extern Commando Uitvoeren

Je kunt een extern commando vanuit Vim uitvoeren met het bang commando. De syntaxis is:

```shell
:!cmd
```

Om de inhoud van de huidige map in lange indeling te zien, voer je uit:

```shell
:!ls -ls
```

Om een proces dat draait op PID 3456 te beëindigen, kun je uitvoeren:

```shell
:!kill -9 3456
```

Je kunt elk extern commando uitvoeren zonder Vim te verlaten, zodat je gefocust kunt blijven op je taak.

## Teksten Filteren

Als je `!` een bereik geeft, kan het worden gebruikt om teksten te filteren. Stel dat je de volgende teksten hebt:

```shell
hello vim
hello vim
```

Laten we de huidige regel hoofdletters geven met het `tr` (translate) commando. Voer uit:

```shell
:.!tr '[:lower:]' '[:upper:]'
```

Het resultaat:

```shell
HELLO VIM
hello vim
```

De uitleg:
- `.!` voert het filtercommando uit op de huidige regel.
- `tr '[:lower:]' '[:upper:]'` roept het `tr` commando aan om alle kleine letters te vervangen door hoofdletters.

Het is noodzakelijk om een bereik door te geven om het externe commando als filter uit te voeren. Als je het bovenstaande commando zonder de `.` probeert uit te voeren (`:!tr '[:lower:]' '[:upper:]'`), zie je een foutmelding.

Laten we aannemen dat je de tweede kolom op beide regels wilt verwijderen met het `awk` commando:

```shell
:%!awk "{print $1}"
```

Het resultaat:

```shell
hello
hello
```

De uitleg:
- `:%!` voert het filtercommando uit op alle regels (`%`).
- `awk "{print $1}"` drukt alleen de eerste kolom van de match af.

Je kunt meerdere commando's aan elkaar koppelen met de ketenoperator (`|`) net zoals in de terminal. Stel dat je een bestand hebt met deze heerlijke ontbijtitems:

```shell
name price
chocolate pancake 10
buttermilk pancake 9
blueberry pancake 12
```

Als je ze op prijs wilt sorteren en alleen het menu met gelijke spatiëring wilt weergeven, kun je uitvoeren:

```shell
:%!awk 'NR > 1' | sort -nk 3 | column -t
```

Het resultaat:
```shell
buttermilk pancake 9
chocolate pancake 10
blueberry pancake 12
```

De uitleg:
- `:%!` past de filter toe op alle regels (`%`).
- `awk 'NR > 1'` toont de teksten alleen vanaf rij nummer twee.
- `|` koppelt het volgende commando.
- `sort -nk 3` sorteert numeriek (`n`) met de waarden uit kolom 3 (`k 3`).
- `column -t` organiseert de tekst met gelijke spatiëring.

## Normaal Modus Commando

Vim heeft een filteroperator (`!`) in de normale modus. Als je de volgende begroetingen hebt:

```shell
hello vim
hola vim
bonjour vim
salve vim
```

Om de huidige regel en de regel eronder hoofdletters te geven, kun je uitvoeren:
```shell
!jtr '[a-z]' '[A-Z]'
```

De uitleg:
- `!j` voert de normale commando filteroperator (`!`) uit gericht op de huidige regel en de regel eronder. Vergeet niet dat omdat het een normale modus operator is, de grammaticaregels `werkwoord + zelfstandig naamwoord` van toepassing zijn. `!` is het werkwoord en `j` is het zelfstandig naamwoord.
- `tr '[a-z]' '[A-Z]'` vervangt de kleine letters door de hoofdletters.

De filter normale commando werkt alleen op bewegingen / tekstobjecten die minstens één regel of langer zijn. Als je had geprobeerd `!iwtr '[a-z]' '[A-Z]'` uit te voeren (voert `tr` uit op het binnenste woord), zul je merken dat het `tr` commando op de hele regel wordt toegepast, niet op het woord waar je cursor zich bevindt.

## Leer Externe Commando's op de Slimme Manier

Vim is geen IDE. Het is een lichte modale editor die van nature zeer uitbreidbaar is. Vanwege deze uitbreidbaarheid heb je gemakkelijke toegang tot elk extern commando in je systeem. Gewapend met deze externe commando's is Vim een stap dichter bij het worden van een IDE. Iemand zei dat het Unix-systeem de eerste IDE ooit is.

Het bang commando is net zo nuttig als het aantal externe commando's dat je kent. Maak je geen zorgen als je kennis van externe commando's beperkt is. Ik heb ook nog veel te leren. Zie dit als een motivatie voor voortdurende educatie. Wanneer je een tekst moet aanpassen, kijk of er een extern commando is dat je probleem kan oplossen. Maak je geen zorgen over het beheersen van alles, leer gewoon de commando's die je nodig hebt om de huidige taak te voltooien.