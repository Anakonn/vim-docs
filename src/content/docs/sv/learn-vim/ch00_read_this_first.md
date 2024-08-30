---
description: Denna guide hjälper nybörjare att snabbt lära sig de mest användbara
  funktionerna i Vim, med fokus på exempel och praktiska tekniker.
title: Ch00. Read This First
---

## Varför denna guide skrevs

Det finns många ställen att lära sig Vim: `vimtutor` är en bra plats att börja och `:help` manualen har alla referenser du någonsin kommer att behöva.

Men den genomsnittliga användaren behöver något mer än `vimtutor` och mindre än `:help` manualen. Denna guide försöker överbrygga det gapet genom att lyfta fram endast de viktigaste funktionerna för att lära sig de mest användbara delarna av Vim på så kort tid som möjligt.

Chansen är att du inte kommer att behöva 100% av Vims funktioner. Du behöver förmodligen bara veta om 20% av dem för att bli en kraftfull Vimmer. Denna guide kommer att visa dig vilka Vim-funktioner du kommer att finna mest användbara.

Detta är en åsiktsbaserad guide. Den täcker tekniker som jag ofta använder när jag använder Vim. KAPITLEN är sekvenserade baserat på vad jag tycker skulle vara mest logiskt för en nybörjare att lära sig Vim.

Denna guide är exempelrik. När du lär dig en ny färdighet är exempel oumbärliga, och att ha många exempel kommer att befästa dessa koncept mer effektivt.

Några av er kanske undrar varför ni behöver lära er Vimscript? Under mitt första år med Vim var jag nöjd med att bara veta hur man använder Vim. Tiden gick och jag började behöva Vimscript mer och mer för att skriva anpassade kommandon för mina specifika redigeringsbehov. När du behärskar Vim kommer du förr eller senare att behöva lära dig Vimscript. Så varför inte tidigare? Vimscript är ett litet språk. Du kan lära dig grunderna på bara fyra kapitel av denna guide.

Du kan komma långt med Vim utan att veta något om Vimscript, men att känna till det kommer att hjälpa dig att excelera ännu längre.

Denna guide är skriven för både nybörjare och avancerade Vimmers. Den börjar med breda och enkla koncept och avslutas med specifika och avancerade koncept. Om du redan är en avancerad användare skulle jag uppmuntra dig att läsa denna guide från början till slut ändå, för du kommer att lära dig något nytt!

## Hur man övergår till Vim från att använda en annan textredigerare

Att lära sig Vim är en tillfredsställande upplevelse, även om det är svårt. Det finns två huvudsakliga tillvägagångssätt för att lära sig Vim:

1. Kall kalkon
2. Gradvis

Att gå kall kalkon innebär att sluta använda den redigerare / IDE du använde och att använda Vim exklusivt från och med nu. Nackdelen med denna metod är att du kommer att ha en allvarlig produktivitetsförlust under den första veckan eller två. Om du är en heltidsprogrammerare kanske denna metod inte är genomförbar. Därför tror jag att det bästa sättet för de flesta att övergå till Vim är att använda det gradvis.

För att gradvis använda Vim, under de första två veckorna, spendera en timme om dagen med att använda Vim som din redigerare medan du under resten av tiden kan använda andra redigerare. Många moderna redigerare kommer med Vim-plugin. När jag först började använde jag VSCode's populära Vim-plugin i en timme per dag. Jag ökade gradvis tiden med Vim-plugin tills jag slutligen använde det hela dagen. Tänk på att dessa plugins endast kan efterlikna en bråkdel av Vims funktioner. För att uppleva den fulla kraften av Vim som Vimscript, kommandorads (Ex) kommandon och integration av externa kommandon, behöver du använda Vim själv.

Det fanns två avgörande ögonblick som fick mig att börja använda Vim 100%: när jag insåg att Vim har en grammatikliknande struktur (se kapitel 4) och [fzf.vim](https://github.com/junegunn/fzf.vim) plugin (se kapitel 3).

Det första, när jag insåg Vims grammatikliknande struktur, var det avgörande ögonblicket då jag äntligen förstod vad dessa Vim-användare pratade om. Jag behövde inte lära mig hundratals unika kommandon. Jag behövde bara lära mig en liten handfull kommandon och jag kunde kedja dem på ett mycket intuitivt sätt för att göra många saker.

Det andra, förmågan att snabbt köra en fuzzy fil-sökning var den IDE-funktion som jag använde mest. När jag lärde mig hur man gör det i Vim, fick jag en stor hastighetsökning och har aldrig sett tillbaka sedan dess.

Alla programmerar på olika sätt. Vid introspektion kommer du att upptäcka att det finns en eller två funktioner från din favoritredigerare / IDE som du använder hela tiden. Kanske var det fuzzy-sökning, hoppa till definition eller snabb kompilering. Vad de än må vara, identifiera dem snabbt och lär dig hur du implementerar dem i Vim (chansen är att Vim förmodligen också kan göra dem). Din redigeringshastighet kommer att få ett stort lyft.

När du kan redigera med 50% av den ursprungliga hastigheten är det dags att gå över till fulltid Vim.

## Hur man läser denna guide

Detta är en praktisk guide. För att bli bra på Vim behöver du utveckla ditt muskelminne, inte huvudkunskap.

Du lär dig inte att cykla genom att läsa en guide om hur man cyklar. Du behöver faktiskt cykla.

Du behöver skriva varje kommando som nämns i denna guide. Inte bara det, utan du behöver upprepa dem flera gånger och prova olika kombinationer. Se upp vad andra funktioner kommandot du just lärt dig har. Kommandot `:help` och sökmotorer är dina bästa vänner. Ditt mål är inte att veta allt om ett kommando, utan att kunna utföra det kommandot naturligt och instinktivt.

Så mycket som jag försöker forma denna guide för att vara linjär, måste vissa koncept i denna guide presenteras ur ordning. Till exempel i kapitel 1 nämner jag ersättningskommandot (`:s`), även om det inte kommer att täckas förrän kapitel 12. För att åtgärda detta, när ett nytt koncept som inte har täckts ännu nämns tidigt, kommer jag att ge en snabb hur-man-guide utan en detaljerad förklaring. Så vänligen ha tålamod med mig :).

## Mer hjälp

Här är ett extra tips för att använda hjälpmanualen: anta att du vill lära dig mer om vad `Ctrl-P` gör i insättningsläge. Om du bara söker efter `:h CTRL-P`, kommer du att dirigeras till normal läges `Ctrl-P`. Detta är inte den `Ctrl-P` hjälp som du letar efter. I detta fall, sök istället efter `:h i_CTRL-P`. Den tillagda `i_` representerar insättningsläget. Var uppmärksam på vilket läge det tillhör.

## Syntax

De flesta kommandon eller kodrelaterade fraser är i kodformat (`så här`).

Strängar är omgivna av ett par dubbla citattecken ("så här").

Vim-kommandon kan förkortas. Till exempel kan `:join` förkortas som `:j`. Genom hela guiden kommer jag att blanda korta och långa beskrivningar. För kommandon som inte används ofta i denna guide kommer jag att använda den långa versionen. För kommandon som används ofta kommer jag att använda den korta versionen. Jag ber om ursäkt för inkonsekvenserna. I allmänhet, när du ser ett nytt kommando, kontrollera alltid det på `:help` för att se dess förkortningar.

## Vimrc

Vid olika punkter i guiden kommer jag att hänvisa till vimrc-alternativ. Om du är ny på Vim är en vimrc som en konfigurationsfil.

Vimrc kommer inte att täckas förrän kapitel 21. För tydlighetens skull kommer jag kort att visa hur man ställer in det.

Anta att du behöver ställa in nummeralternativ (`set number`). Om du inte redan har en vimrc, skapa en. Den placeras vanligtvis i din hemkatalog och heter `.vimrc`. Beroende på ditt operativsystem kan platsen variera. I macOS har jag den på `~/.vimrc`. För att se var du ska placera din, kolla in `:h vimrc`.

Inuti den, lägg till `set number`. Spara den (`:w`), och källan den (`:source %`). Du bör nu se radnummer visas på vänster sida.

Alternativt, om du inte vill göra en permanent inställningsändring, kan du alltid köra `set` kommandot inline, genom att köra `:set number`. Nackdelen med detta tillvägagångssätt är att denna inställning är tillfällig. När du stänger Vim försvinner alternativet.

Eftersom vi lär oss om Vim och inte Vi, är en inställning som du måste ha `nocompatible` alternativet. Lägg till `set nocompatible` i din vimrc. Många Vim-specifika funktioner är inaktiverade när den körs med `compatible` alternativet.

I allmänhet, när ett stycke nämner ett vimrc-alternativ, lägg bara till det alternativet i vimrc, spara det och källan det.

## Framtid, Fel, Frågor

Förvänta dig fler uppdateringar i framtiden. Om du hittar några fel eller har några frågor, tveka inte att höra av dig.

Jag har också planerat några fler kommande kapitel, så håll utkik!

## Jag vill ha fler Vim-trick

För att lära dig mer om Vim, följ gärna [@learnvim](https://twitter.com/learnvim).

## Tack

Denna guide skulle inte vara möjlig utan Bram Moleenar för att skapa Vim, min fru som har varit mycket tålmodig och stödjande under hela resan, alla [bidragsgivare](https://github.com/iggredible/Learn-Vim/graphs/contributors) till learn-vim-projektet, Vim-gemenskapen, och många, många andra som inte nämndes.

Tack. Ni alla hjälper till att göra textredigering roligt :)