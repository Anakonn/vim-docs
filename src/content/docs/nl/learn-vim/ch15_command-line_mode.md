---
description: In dit document leer je verschillende tips en trucs voor de commandoregelmodus
  in Vim, inclusief het invoeren en verlaten van deze modus.
title: Ch15. Command-line Mode
---

In de laatste drie hoofdstukken heb je geleerd hoe je de zoekopdrachten (`/`, `?`), vervangopdracht (`:s`), globale opdracht (`:g`) en externe opdracht (`!`) kunt gebruiken. Dit zijn voorbeelden van opdrachten in de opdrachtregelmodus.

In dit hoofdstuk leer je verschillende tips en trucs voor de opdrachtregelmodus.

## Invoeren en Verlaten van de Opdrachtregelmodus

De opdrachtregelmodus is een modus op zich, net als de normale modus, invoegmodus en visuele modus. Wanneer je in deze modus bent, gaat de cursor naar de onderkant van het scherm waar je verschillende opdrachten kunt typen.

Er zijn 4 verschillende opdrachten die je kunt gebruiken om de opdrachtregelmodus in te voeren:
- Zoekpatronen (`/`, `?`)
- Opdrachtregelopdrachten (`:`)
- Externe opdrachten (`!`)

Je kunt de opdrachtregelmodus betreden vanuit de normale modus of de visuele modus.

Om de opdrachtregelmodus te verlaten, kun je `<Esc>`, `Ctrl-C` of `Ctrl-[` gebruiken.

*Andere literatuur kan de "Opdrachtregelopdracht" verwijzen als "Ex-opdracht" en de "Externe opdracht" als "filteropdracht" of "bang-operator".*

## Herhalen van de Vorige Opdracht

Je kunt de vorige opdrachtregelopdracht of externe opdracht herhalen met `@:`.

Als je net `:s/foo/bar/g` hebt uitgevoerd, herhaalt het uitvoeren van `@:` die vervangingen. Als je net `:.!tr '[a-z]' '[A-Z]'` hebt uitgevoerd, herhaalt het uitvoeren van `@:` de laatste externe opdracht vertaalfilter.

## Sneltoetsen voor de Opdrachtregelmodus

Terwijl je in de opdrachtregelmodus bent, kun je naar links of naar rechts bewegen, één teken tegelijk, met de `Links` of `Rechts` pijl.

Als je woordgewijs wilt bewegen, gebruik dan `Shift-Links` of `Shift-Rechts` (in sommige besturingssystemen moet je mogelijk `Ctrl` in plaats van `Shift` gebruiken).

Om naar het begin van de regel te gaan, gebruik je `Ctrl-B`. Om naar het einde van de regel te gaan, gebruik je `Ctrl-E`.

Net als in de invoegmodus heb je binnen de opdrachtregelmodus drie manieren om tekens te verwijderen:

```shell
Ctrl-H    Verwijder één teken
Ctrl-W    Verwijder één woord
Ctrl-U    Verwijder de hele regel
```
Als je de opdracht wilt bewerken zoals je dat met een normaal tekstbestand zou doen, gebruik dan `Ctrl-F`.

Dit stelt je ook in staat om door de vorige opdrachten te zoeken, ze te bewerken en opnieuw uit te voeren door `<Enter>` in "opdrachtregel bewerkingsnormale modus" te drukken.

## Register en Autocompleteren

Terwijl je in de opdrachtregelmodus bent, kun je teksten uit het Vim-register invoegen met `Ctrl-R`, net zoals in de invoegmodus. Als je de string "foo" in het register a hebt opgeslagen, kun je deze invoegen door `Ctrl-R a` uit te voeren. Alles wat je uit het register in de invoegmodus kunt halen, kun je ook op dezelfde manier uit de opdrachtregelmodus doen.

Daarnaast kun je ook het woord onder de cursor krijgen met `Ctrl-R Ctrl-W` (`Ctrl-R Ctrl-A` voor het WOORD onder de cursor). Om de regel onder de cursor te krijgen, gebruik je `Ctrl-R Ctrl-L`. Om de bestandsnaam onder de cursor te krijgen, gebruik je `Ctrl-R Ctrl-F`.

Je kunt ook bestaande opdrachten autocompleteren. Om de `echo` opdracht te autocompleteren, typ je terwijl je in de opdrachtregelmodus bent "ec", en druk dan op `<Tab>`. Je zou aan de linkerkant onderaan Vim-opdrachten moeten zien die beginnen met "ec" (voorbeeld: `echo echoerr echohl echomsg econ`). Om naar de volgende optie te gaan, druk je op `<Tab>` of `Ctrl-N`. Om naar de vorige optie te gaan, druk je op `<Shift-Tab>` of `Ctrl-P`.

Sommige opdrachten in de opdrachtregel accepteren bestandsnamen als argumenten. Een voorbeeld is `edit`. Je kunt hier ook autocompleteren. Na het typen van de opdracht, `:e ` (vergeet de spatie niet), druk je op `<Tab>`. Vim zal alle relevante bestandsnamen opsommen waaruit je kunt kiezen, zodat je het niet vanaf nul hoeft te typen.

## Geschiedenisvenster en Opdrachtregelvenster

Je kunt de geschiedenis van opdrachtregelopdrachten en zoektermen bekijken (dit vereist de `+cmdline_hist` functie).

Om de opdrachtregelgeschiedenis te openen, voer je `:his :` uit. Je zou iets als het volgende moeten zien:

```shell
## Cmd geschiedenis
2  e bestand1.txt
3  g/foo/d
4  s/foo/bar/g
```

Vim somt de geschiedenis op van alle `:` opdrachten die je uitvoert. Standaard slaat Vim de laatste 50 opdrachten op. Om het aantal vermeldingen dat Vim onthoudt naar 100 te veranderen, voer je `set history=100` uit.

Een nuttigere manier om de opdrachtregelgeschiedenis te gebruiken is via het opdrachtregelvenster, `q:`. Dit opent een doorzoekbaar, bewerkbaar geschiedenisvenster. Stel dat je deze uitdrukkingen in de geschiedenis hebt wanneer je `q:` drukt:

```shell
51  s/zeerlangvervangpatroon/pannenkoek/g
52  his :
53  wq
```

Als je huidige taak is om `s/zeerlangvervangpatroon/donut/g` te doen, waarom typ je de opdracht dan niet opnieuw? Hergebruik `s/zeerlangvervangpatroon/pannenkoek/g`? Tenslotte is het enige dat anders is het woord dat vervangen moet worden, "donut" versus "pannenkoek". Alles is verder hetzelfde.

Nadat je `q:` hebt uitgevoerd, zoek je `s/zeerlangvervangpatroon/pannenkoek/g` in de geschiedenis (je kunt de Vim-navigatie in deze omgeving gebruiken) en bewerk het direct! Verander "pannenkoek" in "donut" in het geschiedenisvenster en druk vervolgens op `<Enter>`. Boom! Vim voert `s/zeerlangvervangpatroon/donut/g` voor je uit. Super handig!

Evenzo, om de zoekgeschiedenis te bekijken, voer je `:his /` of `:his ?` uit. Om het zoekgeschiedenisvenster te openen waar je door de vorige geschiedenis kunt zoeken en deze kunt bewerken, voer je `q/` of `q?` uit.

Om dit venster te verlaten, druk je op `Ctrl-C`, `Ctrl-W C`, of typ `:quit`.

## Meer Opdrachtregelopdrachten

Vim heeft honderden ingebouwde opdrachten. Om alle opdrachten die Vim heeft te zien, kijk je naar `:h ex-cmd-index` of `:h :index`.

## Leer de Opdrachtregelmodus op de Slimme Manier

In vergelijking met de andere drie modi is de opdrachtregelmodus als het Zwitserse zakmes van tekstbewerking. Je kunt tekst bewerken, bestanden wijzigen en opdrachten uitvoeren, om maar een paar dingen te noemen. Dit hoofdstuk is een verzameling van allerlei dingen in de opdrachtregelmodus. Het brengt ook de Vim-modi tot een einde. Nu je weet hoe je de normale, invoeg-, visuele en opdrachtregelmodus kunt gebruiken, kun je tekst sneller dan ooit met Vim bewerken.

Het is tijd om weg te bewegen van de Vim-modi en te leren hoe je nog sneller kunt navigeren met Vim-tags.