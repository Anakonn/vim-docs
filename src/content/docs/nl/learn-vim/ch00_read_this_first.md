---
description: Deze gids biedt een overzicht van de belangrijkste Vim-functies, gericht
  op beginners die snel en effectief willen leren werken met Vim.
title: Ch00. Read This First
---

## Waarom deze gids is geschreven

Er zijn veel plaatsen om Vim te leren: de `vimtutor` is een geweldige plek om te beginnen en de `:help` handleiding heeft alle referenties die je ooit nodig zult hebben.

Echter, de gemiddelde gebruiker heeft iets meer nodig dan `vimtutor` en minder dan de `:help` handleiding. Deze gids probeert die kloof te overbruggen door alleen de belangrijkste functies te benadrukken om de meest nuttige delen van Vim in de kortst mogelijke tijd te leren.

De kans is groot dat je niet 100% van de Vim-functies nodig hebt. Je moet waarschijnlijk alleen ongeveer 20% ervan kennen om een krachtige Vimmer te worden. Deze gids laat je zien welke Vim-functies je het nuttigst zult vinden.

Dit is een subjectieve gids. Het behandelt technieken die ik vaak gebruik bij het werken met Vim. De hoofdstukken zijn in volgorde gezet op basis van wat ik denk dat het meest logisch is voor een beginner om Vim te leren.

Deze gids is rijk aan voorbeelden. Bij het leren van een nieuwe vaardigheid zijn voorbeelden onmisbaar; het hebben van talrijke voorbeelden zal deze concepten effectiever verankeren.

Sommigen van jullie vragen zich misschien af waarom je Vimscript moet leren? In mijn eerste jaar met Vim was ik tevreden met alleen weten hoe ik Vim moest gebruiken. De tijd verstreek en ik begon Vimscript steeds meer nodig te hebben om aangepaste commando's te schrijven voor mijn specifieke bewerkingsbehoeften. Terwijl je Vim meester wordt, zul je vroeg of laat Vimscript moeten leren. Dus waarom niet eerder? Vimscript is een kleine taal. Je kunt de basis ervan leren in slechts vier hoofdstukken van deze gids.

Je kunt ver komen met Vim zonder enige Vimscript-kennis, maar het kennen ervan zal je helpen om nog verder te excelleren.

Deze gids is geschreven voor zowel beginners als gevorderde Vimmers. Het begint met brede en eenvoudige concepten en eindigt met specifieke en geavanceerde concepten. Als je al een gevorderde gebruiker bent, moedig ik je aan om deze gids van begin tot eind te lezen, want je zult iets nieuws leren!

## Hoe over te stappen naar Vim vanuit een andere teksteditor

Vim leren is een bevredigende ervaring, zij het moeilijk. Er zijn twee hoofdbenaderingen om Vim te leren:

1. Koud kalkoen
2. Geleidelijk

Koud kalkoen betekent dat je stopt met het gebruik van welke editor / IDE je ook gebruikte en vanaf nu uitsluitend Vim gebruikt. Het nadeel van deze methode is dat je een ernstige productiviteitsverlies zult ervaren tijdens de eerste week of twee. Als je een fulltime programmeur bent, is deze methode misschien niet haalbaar. Daarom geloof ik dat voor de meeste mensen de beste manier om over te stappen naar Vim is om het geleidelijk te gebruiken.

Om geleidelijk Vim te gebruiken, besteed je tijdens de eerste twee weken een uur per dag aan het gebruik van Vim als je editor, terwijl je de rest van de tijd andere editors kunt gebruiken. Veel moderne editors komen met Vim-plugins. Toen ik voor het eerst begon, gebruikte ik de populaire Vim-plugin van VSCode een uur per dag. Ik verhoogde geleidelijk de tijd met de Vim-plugin totdat ik het uiteindelijk de hele dag gebruikte. Houd er rekening mee dat deze plugins slechts een fractie van de Vim-functies kunnen emuleren. Om de volledige kracht van Vim te ervaren, zoals Vimscript, Command-line (Ex) Commando's en integratie van externe commando's, moet je Vim zelf gebruiken.

Er waren twee cruciale momenten die me deden besluiten om 100% Vim te gebruiken: toen ik begreep dat Vim een grammatica-achtige structuur heeft (zie hoofdstuk 4) en de [fzf.vim](https://github.com/junegunn/fzf.vim) plugin (zie hoofdstuk 3).

Het eerste moment, toen ik de grammatica-achtige structuur van Vim realiseerde, was het bepalende moment waarop ik eindelijk begreep waar deze Vim-gebruikers het over hadden. Ik hoefde geen honderden unieke commando's te leren. Ik hoefde alleen een klein aantal commando's te leren en ik kon ze op een zeer intuïtieve manier combineren om veel dingen te doen.

Het tweede moment, de mogelijkheid om snel een vage bestandszoekopdracht uit te voeren, was de IDE-functie die ik het meest gebruikte. Toen ik leerde hoe ik dat in Vim kon doen, kreeg ik een enorme snelheidstoename en heb ik sindsdien nooit meer teruggekeken.

Iedereen programmeert anders. Bij introspectie zul je ontdekken dat er een of twee functies zijn van je favoriete editor / IDE die je de hele tijd gebruikt. Misschien was het fuzzy-search, jump-to-definition of snelle compilatie. Wat het ook is, identificeer ze snel en leer hoe je die in Vim kunt implementeren (de kans is groot dat Vim ze ook kan doen). Je bewerkingsnelheid zal een enorme boost krijgen.

Zodra je op 50% van de oorspronkelijke snelheid kunt bewerken, is het tijd om volledig over te stappen op Vim.

## Hoe deze gids te lezen

Dit is een praktische gids. Om goed te worden in Vim moet je je spiergeheugen ontwikkelen, niet alleen hoofdkennis.

Je leert niet hoe je op een fiets moet rijden door een gids te lezen over hoe je op een fiets moet rijden. Je moet daadwerkelijk op een fiets rijden.

Je moet elk commando dat in deze gids wordt genoemd typen. Niet alleen dat, maar je moet ze meerdere keren herhalen en verschillende combinaties proberen. Kijk wat voor andere functies het commando dat je net hebt geleerd heeft. Het `:help` commando en zoekmachines zijn je beste vrienden. Je doel is niet om alles over een commando te weten, maar om dat commando natuurlijk en instinctief uit te kunnen voeren.

Zoveel als ik probeer deze gids lineair te maken, moeten sommige concepten in deze gids buiten volgorde worden gepresenteerd. Bijvoorbeeld in hoofdstuk 1 noem ik het vervangcommando (`:s`), ook al wordt het pas in hoofdstuk 12 behandeld. Om dit te verhelpen, zal ik telkens wanneer een nieuw concept dat nog niet is behandeld vroeg wordt genoemd, een snelle handleiding geven zonder een gedetailleerde uitleg. Dus heb geduld met me :).

## Meer hulp

Hier is een extra tip om de help-handleiding te gebruiken: stel dat je meer wilt leren over wat `Ctrl-P` doet in de invoegmodus. Als je alleen zoekt naar `:h CTRL-P`, word je doorverwezen naar de normale modus `Ctrl-P`. Dit is niet de `Ctrl-P` hulp waar je naar op zoek bent. In dit geval zoek je in plaats daarvan naar `:h i_CTRL-P`. De toegevoegde `i_` vertegenwoordigt de invoegmodus. Let op in welke modus het behoort.

## Syntax

De meeste commando- of codegerelateerde zinnen zijn in code-case (`zoals dit`).

Strings zijn omgeven door een paar dubbele aanhalingstekens ("zoals dit").

Vim-commando's kunnen worden afgekort. Bijvoorbeeld, `:join` kan worden afgekort als `:j`. Gedurende de gids zal ik de afkortingen en de lange beschrijvingen mixen. Voor commando's die niet vaak in deze gids worden gebruikt, zal ik de lange versie gebruiken. Voor commando's die vaak worden gebruikt, zal ik de afkorting gebruiken. Mijn excuses voor de inconsistenties. In het algemeen, wanneer je een nieuw commando tegenkomt, controleer het altijd op `:help` om de afkortingen te zien.

## Vimrc

Op verschillende momenten in de gids zal ik verwijzen naar vimrc-opties. Als je nieuw bent met Vim, is een vimrc als een configuratiebestand.

Vimrc wordt pas in hoofdstuk 21 behandeld. Voor de duidelijkheid zal ik hier kort laten zien hoe je het instelt.

Stel dat je de nummeropties moet instellen (`set number`). Als je nog geen vimrc hebt, maak er dan een aan. Het wordt meestal in je home-directory geplaatst en heet `.vimrc`. Afhankelijk van je besturingssysteem kan de locatie verschillen. In macOS heb ik het op `~/.vimrc`. Om te zien waar je de jouwe moet plaatsen, kijk je op `:h vimrc`.

Voeg er `set number` aan toe. Sla het op (`:w`), en source het (`:source %`). Je zou nu lijnnummers aan de linkerkant moeten zien.

Als je echter geen permanente instelling wilt maken, kun je altijd het `set` commando inline uitvoeren, door `:set number` uit te voeren. Het nadeel van deze benadering is dat deze instelling tijdelijk is. Wanneer je Vim sluit, verdwijnt de optie.

Aangezien we Vim leren en niet Vi, is een instelling die je moet hebben de `nocompatible` optie. Voeg `set nocompatible` toe in je vimrc. Veel Vim-specifieke functies zijn uitgeschakeld wanneer het draait op de `compatible` optie.

In het algemeen, wanneer een passage een vimrc-optie noemt, voeg die optie gewoon toe aan de vimrc, sla het op, en source het.

## Toekomst, Fouten, Vragen

Verwacht in de toekomst meer updates. Als je fouten vindt of vragen hebt, aarzel dan niet om contact op te nemen.

Ik heb ook een paar meer hoofdstukken gepland, dus blijf op de hoogte!

## Ik wil meer Vim-trucs

Om meer over Vim te leren, volg dan [@learnvim](https://twitter.com/learnvim).

## Bedankjes

Deze gids zou niet mogelijk zijn zonder Bram Moleenar voor het creëren van Vim, mijn vrouw die gedurende de reis zeer geduldig en ondersteunend is geweest, alle [bijdragers](https://github.com/iggredible/Learn-Vim/graphs/contributors) van het learn-vim project, de Vim-gemeenschap, en vele, vele anderen die niet zijn genoemd.

Dank je. Jullie helpen allemaal om tekstbewerking leuk te maken :)