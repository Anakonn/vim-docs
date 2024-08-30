---
description: In dit hoofdstuk leer je verschillende manieren om Vim vanuit de terminal
  te starten, inclusief installatie-instructies en basiscommando's.
title: Ch01. Starting Vim
---

In dit hoofdstuk leer je verschillende manieren om Vim vanuit de terminal te starten. Ik gebruikte Vim 8.2 toen ik deze gids schreef. Als je Neovim of een oudere versie van Vim gebruikt, zou je grotendeels in orde moeten zijn, maar wees je ervan bewust dat sommige commando's mogelijk niet beschikbaar zijn.

## Installeren

Ik zal niet de gedetailleerde instructies doornemen over hoe je Vim op een specifieke machine installeert. Het goede nieuws is dat de meeste op Unix gebaseerde computers met Vim geïnstalleerd zouden moeten zijn. Zo niet, dan zouden de meeste distributies instructies moeten hebben om Vim te installeren.

Voor meer informatie over het installatieproces van Vim, kijk op de officiële downloadwebsite van Vim of de officiële GitHub-repository van Vim:
- [Vim website](https://www.vim.org/download.php)
- [Vim github](https://github.com/vim/vim)

## Het Vim Commando

Nu je Vim hebt geïnstalleerd, voer dit uit vanuit de terminal:

```bash
vim
```

Je zou een intro-scherm moeten zien. Dit is waar je aan je nieuwe bestand zult werken. In tegenstelling tot de meeste teksteditors en IDE's is Vim een modale editor. Als je "hello" wilt typen, moet je overschakelen naar de invoegmodus met `i`. Druk op `ihello<Esc>` om de tekst "hello" in te voegen.

## Vim Verlaten

Er zijn verschillende manieren om Vim te verlaten. De meest voorkomende is om te typen:

```shell
:quit
```

Je kunt ook `:q` typen voor kort. Dat commando is een commando-regelmoduscommando (een andere van de Vim-modi). Als je `:` typt in de normale modus, zal de cursor naar de onderkant van het scherm bewegen waar je enkele commando's kunt typen. Je leert later in hoofdstuk 15 over de commando-regelmodus. Als je in de invoegmodus bent, zal het typen van `:` letterlijk het teken ":" op het scherm produceren. In dit geval moet je terugschakelen naar de normale modus. Typ `<Esc>` om naar de normale modus te schakelen. Trouwens, je kunt ook terugkeren naar de normale modus vanuit de commando-regelmodus door op `<Esc>` te drukken. Je zult merken dat je uit verschillende Vim-modi terug naar de normale modus kunt "ontsnappen" door op `<Esc>` te drukken.

## Een Bestand Opslaan

Om je wijzigingen op te slaan, typ:

```shell
:write
```

Je kunt ook `:w` typen voor kort. Als dit een nieuw bestand is, moet je het een naam geven voordat je het kunt opslaan. Laten we het `file.txt` noemen. Voer uit:

```shell
:w file.txt
```

Om op te slaan en te verlaten, kun je de `:w` en `:q` commando's combineren:

```shell
:wq
```

Om te verlaten zonder wijzigingen op te slaan, voeg `!` toe na `:q` om geforceerd te verlaten:

```shell
:q!
```

Er zijn andere manieren om Vim te verlaten, maar dit zijn de manieren die je dagelijks zult gebruiken.

## Hulp

Gedurende deze gids zal ik je naar verschillende Vim-hulp pagina's verwijzen. Je kunt naar de hulppagina gaan door `:help {some-command}` te typen (`:h` voor kort). Je kunt het `:h` commando een onderwerp of een commando-naam als argument meegeven. Bijvoorbeeld, om te leren over verschillende manieren om Vim te verlaten, typ:

```shell
:h write-quit
```

Hoe wist ik te zoeken naar "write-quit"? Ik wist het eigenlijk niet. Ik typte gewoon `:h`, daarna "quit", en toen `<Tab>`. Vim toonde relevante trefwoorden om uit te kiezen. Als je ooit iets moet opzoeken ("Ik wou dat Vim dit kon doen..."), typ gewoon `:h` en probeer enkele trefwoorden, daarna `<Tab>`.

## Een Bestand Openen

Om een bestand (`hello1.txt`) op Vim vanuit de terminal te openen, voer uit:

```bash
vim hello1.txt
```

Je kunt ook meerdere bestanden tegelijk openen:

```bash
vim hello1.txt hello2.txt hello3.txt
```

Vim opent `hello1.txt`, `hello2.txt`, en `hello3.txt` in aparte buffers. Je leert over buffers in het volgende hoofdstuk.

## Argumenten

Je kunt het `vim` terminalcommando met verschillende vlaggen en opties doorgeven.

Om de huidige Vim-versie te controleren, voer uit:

```bash
vim --version
```

Dit vertelt je de huidige Vim-versie en alle beschikbare functies gemarkeerd met `+` of `-`. Sommige van deze functies in deze gids vereisen dat bepaalde functies beschikbaar zijn. Bijvoorbeeld, je zult de commandoregelgeschiedenis van Vim in een later hoofdstuk verkennen met het `:history` commando. Je Vim moet de `+cmdline_history` functie hebben om het commando te laten werken. Er is een grote kans dat de Vim die je net hebt geïnstalleerd alle noodzakelijke functies heeft, vooral als het van een populaire downloadbron is.

Veel dingen die je vanuit de terminal doet, kunnen ook vanuit Vim gedaan worden. Om de versie van *binnen* Vim te zien, kun je dit uitvoeren:

```shell
:version
```

Als je het bestand `hello.txt` wilt openen en onmiddellijk een Vim-commando wilt uitvoeren, kun je het `vim` commando de `+{cmd}` optie meegeven.

In Vim kun je strings vervangen met het `:s` commando (kort voor `:substitute`). Als je `hello.txt` wilt openen en alle "pancake" wilt vervangen door "bagel", voer uit:

```bash
vim +%s/pancake/bagel/g hello.txt
```

Deze Vim-commando's kunnen gestapeld worden:

```bash
vim +%s/pancake/bagel/g +%s/bagel/egg/g +%s/egg/donut/g hello.txt
```

Vim zal alle instanties van "pancake" vervangen door "bagel", dan "bagel" vervangen door "egg", en dan "egg" vervangen door "donut" (je leert vervangingen in een later hoofdstuk).

Je kunt ook de `-c` optie doorgeven gevolgd door een Vim-commando in plaats van de `+` syntaxis:

```bash
vim -c %s/pancake/bagel/g hello.txt
vim -c %s/pancake/bagel/g -c %s/bagel/egg/g -c %s/egg/donut/g hello.txt
```

## Meerdere Vensters Openen

Je kunt Vim starten met gesplitste horizontale en verticale vensters met de `-o` en `-O` opties, respectievelijk.

Om Vim met twee horizontale vensters te openen, voer uit:

```bash
vim -o2
```

Om Vim met 5 horizontale vensters te openen, voer uit:

```bash
vim -o5
```

Om Vim met 5 horizontale vensters te openen en de eerste twee te vullen met `hello1.txt` en `hello2.txt`, voer uit:

```bash
vim -o5 hello1.txt hello2.txt
```

Om Vim met twee verticale vensters, 5 verticale vensters, en 5 verticale vensters met 2 bestanden te openen:

```bash
vim -O2
vim -O5
vim -O5 hello1.txt hello2.txt
```

## Opschorten

Als je Vim moet opschorten terwijl je aan het bewerken bent, kun je `Ctrl-z` indrukken. Je kunt ook het `:stop` of `:suspend` commando uitvoeren. Om terug te keren naar de opgeschorte Vim, voer `fg` uit vanuit de terminal.

## Vim Slim Starten

Het `vim` commando kan veel verschillende opties aannemen, net als elk ander terminalcommando. Twee opties stellen je in staat om een Vim-commando als parameter door te geven: `+{cmd}` en `-c cmd`. Terwijl je meer commando's leert in deze gids, kijk of je het kunt toepassen bij het starten van Vim. Ook als een terminalcommando, kun je `vim` combineren met veel andere terminalcommando's. Bijvoorbeeld, je kunt de uitvoer van het `ls` commando omleiden om in Vim te worden bewerkt met `ls -l | vim -`.

Om meer te leren over het `vim` commando in de terminal, kijk naar `man vim`. Om meer te leren over de Vim-editor, blijf deze gids lezen samen met het `:help` commando.