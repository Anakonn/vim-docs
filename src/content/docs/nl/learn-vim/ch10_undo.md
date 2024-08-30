---
description: Deze gids behandelt het ongedaan maken en opnieuw uitvoeren in Vim, inclusief
  het navigeren door ongedaan maken takken en het beheren van teksttoestanden.
title: Ch10. Undo
---

We maken allemaal allerlei typefouten. Daarom is ongedaan maken een essentiële functie in elke moderne software. Het ongedaan maken systeem van Vim is niet alleen in staat om eenvoudige fouten ongedaan te maken en opnieuw te doen, maar ook om toegang te krijgen tot verschillende teksttoestanden, waardoor je controle hebt over alle teksten die je ooit hebt getypt. In dit hoofdstuk leer je hoe je ongedaan kunt maken, opnieuw kunt doen, door een ongedaan tak kunt navigeren, ongedaan kunt bewaren en door de tijd kunt reizen.

## Ongedaan maken, Opnieuw doen en ONGEDAAN

Om een basis ongedaan te maken, kun je `u` gebruiken of `:undo` uitvoeren.

Als je deze tekst hebt (let op de lege regel onder "een"):

```shell
een

```

Dan voeg je een andere tekst toe:

```shell
een
twee
```

Als je `u` indrukt, maakt Vim de tekst "twee" ongedaan.

Hoe weet Vim hoeveel het moet ongedaan maken? Vim maakt een enkele "wijziging" tegelijk ongedaan, vergelijkbaar met de wijziging van een puntcommando (in tegenstelling tot het puntcommando, tellen commandoregelcommando's ook als een wijziging).

Om de laatste wijziging opnieuw te doen, druk je op `Ctrl-R` of voer je `:redo` uit. Nadat je de bovenstaande tekst ongedaan hebt gemaakt om "twee" te verwijderen, zal het uitvoeren van `Ctrl-R` de verwijderde tekst terughalen.

Vim heeft ook ONGEDAAN dat je kunt uitvoeren met `U`. Het maakt alle laatste wijzigingen ongedaan.

Hoe verschilt `U` van `u`? Ten eerste, `U` verwijdert *alle* wijzigingen op de laatst gewijzigde regel, terwijl `u` slechts één wijziging tegelijk verwijdert. Ten tweede, terwijl het uitvoeren van `u` niet telt als een wijziging, telt het uitvoeren van `U` als een wijziging.

Terug naar dit voorbeeld:

```shell
een
twee
```

Verander de tweede regel in "drie":

```shell
een
drie
```

Verander de tweede regel opnieuw en vervang deze door "vier":

```shell
een
vier
```

Als je `u` indrukt, zie je "drie". Als je `u` nogmaals indrukt, zie je "twee". Als je in plaats van `u` in te drukken toen je nog de tekst "vier" had, `U` had ingedrukt, zie je:

```shell
een

```

`U` omzeilt alle tussenliggende wijzigingen en gaat naar de oorspronkelijke staat toen je begon (een lege regel). Bovendien, aangezien ONGEDAAN eigenlijk een nieuwe wijziging in Vim creëert, kun je je ONGEDAAN ongedaan maken. `U` gevolgd door `U` maakt zichzelf ongedaan. Je kunt `U` drukken, dan `U`, dan `U`, enzovoort. Je zult dezelfde twee teksttoestanden heen en weer zien schakelen.

Persoonlijk gebruik ik `U` niet omdat het moeilijk te onthouden is wat de oorspronkelijke staat was (ik heb het zelden nodig).

Vim stelt een maximum aantal in hoeveel keer je kunt ongedaan maken in de `undolevels` optievariabele. Je kunt het controleren met `:echo &undolevels`. Ik heb de mijne ingesteld op 1000. Om de jouwe op 1000 in te stellen, voer je `:set undolevels=1000` uit. Voel je vrij om het op elk gewenst nummer in te stellen.

## Blokken Doorbreken

Ik heb eerder vermeld dat `u` een enkele "wijziging" ongedaan maakt, vergelijkbaar met de wijziging van een puntcommando: de teksten die zijn ingevoegd vanaf het moment dat je de invoegmodus ingaat tot je deze verlaat, tellen als een wijziging.

Als je `ione twee drie<Esc>` doet en vervolgens `u` indrukt, verwijdert Vim de hele tekst "een twee drie" omdat het geheel als een wijziging telt. Dit is geen groot probleem als je korte teksten hebt geschreven, maar wat als je verschillende paragrafen hebt geschreven binnen één invoegmodus sessie zonder te verlaten en later realiseert dat je een fout hebt gemaakt? Als je `u` indrukt, zou alles wat je had geschreven worden verwijderd. Zou het niet handig zijn als je `u` kunt indrukken om alleen een sectie van je tekst te verwijderen?

Gelukkig kun je de ongedaan blokken doorbreken. Wanneer je typt in de invoegmodus, creëert het indrukken van `Ctrl-G u` een ongedaan breekpunt. Bijvoorbeeld, als je `ione <Ctrl-G u>twee <Ctrl-G u>drie<Esc>` doet, en vervolgens `u` indrukt, verlies je alleen de tekst "drie" (druk nogmaals op `u` om "twee" te verwijderen). Wanneer je een lange tekst schrijft, gebruik `Ctrl-G u` strategisch. Het einde van elke zin, tussen twee paragrafen, of na elke regel code zijn prime locaties om ongedaan breekpunten toe te voegen om het gemakkelijker te maken om je fouten ongedaan te maken als je ooit een maakt.

Het is ook nuttig om een ongedaan breekpunt te creëren bij het verwijderen van stukken in de invoegmodus met `Ctrl-W` (verwijder het woord vóór de cursor) en `Ctrl-U` (verwijder alle tekst vóór de cursor). Een vriend stelde voor om de volgende mappen te gebruiken:

```shell
inoremap <c-u> <c-g>u<c-u>
inoremap <c-w> <c-g>u<c-w>
```

Met deze kun je gemakkelijk de verwijderde teksten herstellen.

## Ongedaan Boom

Vim slaat elke wijziging die ooit is geschreven op in een ongedaan boom. Start een nieuw leeg bestand. Voeg dan een nieuwe tekst toe:

```shell
een

```

Voeg een nieuwe tekst toe:

```shell
een
twee
```

Maak één keer ongedaan:

```shell
een

```

Voeg een andere tekst toe:

```shell
een
drie
```

Maak opnieuw ongedaan:

```shell
een

```

En voeg nog een andere tekst toe:

```shell
een
vier
```

Nu, als je ongedaan maakt, verlies je de tekst "vier" die je net hebt toegevoegd:

```shell
een

```

Als je nog een keer ongedaan maakt:

```shell

```

Verlies je de tekst "een". In de meeste teksteditors zou het onmogelijk zijn om de teksten "twee" en "drie" terug te krijgen, maar niet met Vim! Druk op `g+` en je krijgt je tekst "een" terug:

```shell
een

```

Typ `g+` opnieuw en je zult een oude vriend zien:

```shell
een
twee
```

Laten we doorgaan. Druk opnieuw op `g+`:

```shell
een
drie
```

Druk nog een keer op `g+`:

```shell
een
vier
```

In Vim, elke keer dat je `u` indrukt en vervolgens een andere wijziging aanbrengt, slaat Vim de tekst van de vorige staat op door een "ongedaan tak" te creëren. In dit voorbeeld, nadat je "twee" had getypt, vervolgens `u` had ingedrukt, en toen "drie" had getypt, creëerde je een blad tak die de staat met de tekst "twee" opslaat. Op dat moment bevatte de ongedaan boom ten minste twee bladknopen: de hoofdknop met de tekst "drie" (meest recent) en de ongedaan takknop met de tekst "twee". Als je een andere ongedaan had gedaan en de tekst "vier" had getypt, zou je drie knopen hebben: een hoofdknop met de tekst "vier" en twee knopen met de teksten "drie" en "twee".

Om door elke ongedaan boom knopen te navigeren, kun je `g+` gebruiken om naar een nieuwere staat te gaan en `g-` om naar een oudere staat te gaan. Het verschil tussen `u`, `Ctrl-R`, `g+`, en `g-` is dat zowel `u` als `Ctrl-R` alleen de *hoofd* knopen in de ongedaan boom doorlopen, terwijl `g+` en `g-` *alle* knopen in de ongedaan boom doorlopen.

De ongedaan boom is niet gemakkelijk te visualiseren. Ik vind de [vim-mundo](https://github.com/simnalamburt/vim-mundo) plugin erg nuttig om de ongedaan boom van Vim te visualiseren. Neem de tijd om ermee te spelen.

## Persistente Ongedaan

Als je Vim start, een bestand opent en onmiddellijk `u` indrukt, zal Vim waarschijnlijk de waarschuwing "*Al op de oudste wijziging*" weergeven. Er is niets om ongedaan te maken omdat je geen wijzigingen hebt aangebracht.

Om de ongedaan geschiedenis van de laatste bewerkingssessie over te nemen, kan Vim je ongedaan geschiedenis behouden met een ongedaan bestand met `:wundo`.

Maak een bestand `mynumbers.txt`. Typ:

```shell
een
```

Typ dan een andere regel (zorg ervoor dat elke regel als een wijziging telt):

```shell
een
twee
```

Typ nog een regel:

```shell
een
twee
drie
```

Maak nu je ongedaan bestand met `:wundo {mijn-ongedaan-bestand}`. Als je een bestaand ongedaan bestand wilt overschrijven, kun je `!` toevoegen na `wundo`.

```shell
:wundo! mynumbers.undo
```

Verlaat vervolgens Vim.

Tegenwoordig zou je `mynumbers.txt` en `mynumbers.undo` bestanden in je map moeten hebben. Open `mynumbers.txt` opnieuw en probeer `u` in te drukken. Dat kan niet. Je hebt geen wijzigingen aangebracht sinds je het bestand opende. Laad nu je ongedaan geschiedenis door het ongedaan bestand te lezen met `:rundo`:

```shell
:rundo mynumbers.undo
```

Nu, als je `u` indrukt, verwijdert Vim "drie". Druk nogmaals op `u` om "twee" te verwijderen. Het is alsof je Vim nooit hebt gesloten!

Als je een automatische ongedaan persistentie wilt hebben, is een manier om dit te doen door het volgende in vimrc toe te voegen:

```shell
set undodir=~/.vim/undo_dir
set undofile
```

De bovenstaande instelling plaatst alle ongedaan bestanden in één gecentraliseerde map, de `~/.vim` map. De naam `undo_dir` is willekeurig. `set undofile` vertelt Vim om de `undofile` functie in te schakelen omdat deze standaard uit staat. Nu, wanneer je opslaat, maakt Vim automatisch het relevante bestand aan en werkt het bij in de `undo_dir` map (zorg ervoor dat je de daadwerkelijke `undo_dir` map in de `~/.vim` map aanmaakt voordat je dit uitvoert).

## Tijdreizen

Wie zegt dat tijdreizen niet bestaat? Vim kan naar een teksttoestand in het verleden reizen met het `:earlier` commandoregelcommando.

Als je deze tekst hebt:

```shell
een

```
Voeg later toe:

```shell
een
twee
```

Als je "twee" minder dan tien seconden geleden had getypt, kun je teruggaan naar de staat waarin "twee" niet bestond, tien seconden geleden met:

```shell
:earlier 10s
```

Je kunt `:undolist` gebruiken om te zien wanneer de laatste wijziging is aangebracht. `:earlier` accepteert ook verschillende argumenten:

```shell
:earlier 10s    Ga naar de staat 10 seconden geleden
:earlier 10m    Ga naar de staat 10 minuten geleden
:earlier 10h    Ga naar de staat 10 uur geleden
:earlier 10d    Ga naar de staat 10 dagen geleden
```

Bovendien accepteert het ook een reguliere `count` als argument om Vim te vertellen naar de oudere staat `count` keer te gaan. Bijvoorbeeld, als je `:earlier 2` doet, zal Vim teruggaan naar een oudere teksttoestand twee wijzigingen geleden. Het is hetzelfde als twee keer `g-` doen. Je kunt het ook vertellen om naar de oudere teksttoestand 10 opslagen geleden te gaan met `:earlier 10f`.

Dezelfde set argumenten werkt met de tegenhanger van `:earlier`: `:later`.

```shell
:later 10s    ga naar de staat 10 seconden later
:later 10m    ga naar de staat 10 minuten later
:later 10h    ga naar de staat 10 uur later
:later 10d    ga naar de staat 10 dagen later
:later 10     ga naar de nieuwere staat 10 keer
:later 10f    ga naar de staat 10 opslagen later
```

## Leer Ongedaan op de Slimme Manier

`u` en `Ctrl-R` zijn twee onmisbare Vim-commando's voor het corrigeren van fouten. Leer ze eerst. Leer vervolgens hoe je `:earlier` en `:later` kunt gebruiken met de tijdargumenten eerst. Neem daarna de tijd om de ongedaan boom te begrijpen. De [vim-mundo](https://github.com/simnalamburt/vim-mundo) plugin heeft me erg geholpen. Typ samen met de teksten in dit hoofdstuk en controleer de ongedaan boom terwijl je elke wijziging aanbrengt. Zodra je het begrijpt, zul je het ongedaan systeem nooit meer op dezelfde manier zien.

Voor dit hoofdstuk heb je geleerd hoe je elke tekst in een projectruimte kunt vinden, met ongedaan kun je nu elke tekst in een tijdsdimensie vinden. Je bent nu in staat om naar elke tekst te zoeken op basis van de locatie en de tijd waarop deze is geschreven. Je hebt Vim-omnipresentie bereikt.