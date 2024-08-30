---
description: Ce guide pratique sur Vim présente les fonctionnalités essentielles pour
  devenir un utilisateur efficace, avec des exemples concrets et une approche structurée.
title: Ch00. Read This First
---

## Pourquoi ce guide a été écrit

Il existe de nombreux endroits pour apprendre Vim : le `vimtutor` est un excellent point de départ et le manuel `:help` contient toutes les références dont vous aurez jamais besoin.

Cependant, l'utilisateur moyen a besoin de quelque chose de plus que le `vimtutor` et de moins que le manuel `:help`. Ce guide tente de combler cette lacune en mettant en avant uniquement les fonctionnalités clés pour apprendre les parties les plus utiles de Vim dans le temps le plus court possible.

Il y a de fortes chances que vous n'ayez pas besoin de 100 % des fonctionnalités de Vim. Vous devez probablement seulement connaître environ 20 % d'entre elles pour devenir un Vimmer puissant. Ce guide vous montrera quelles fonctionnalités de Vim vous trouverez les plus utiles.

C'est un guide subjectif. Il couvre des techniques que j'utilise souvent lorsque j'utilise Vim. Les chapitres sont séquencés en fonction de ce qui, selon moi, aurait le plus de sens logique pour un débutant apprenant Vim.

Ce guide est riche en exemples. Lorsque vous apprenez une nouvelle compétence, les exemples sont indispensables ; en avoir de nombreux solidifiera ces concepts plus efficacement.

Certains d'entre vous se demandent peut-être pourquoi vous devez apprendre Vimscript ? Au cours de ma première année d'utilisation de Vim, j'étais content de savoir simplement comment utiliser Vim. Le temps a passé et j'ai commencé à avoir de plus en plus besoin de Vimscript pour écrire des commandes personnalisées pour mes besoins d'édition spécifiques. Au fur et à mesure que vous maîtrisez Vim, vous aurez tôt ou tard besoin d'apprendre Vimscript. Alors pourquoi pas plus tôt ? Vimscript est un petit langage. Vous pouvez en apprendre les bases en seulement quatre chapitres de ce guide.

Vous pouvez aller loin en utilisant Vim sans connaître Vimscript, mais le connaître vous aidera à exceller encore plus.

Ce guide est écrit pour les Vimmers débutants et avancés. Il commence par des concepts larges et simples et se termine par des concepts spécifiques et avancés. Si vous êtes déjà un utilisateur avancé, je vous encourage à lire ce guide de A à Z, car vous apprendrez quelque chose de nouveau !

## Comment passer à Vim depuis un autre éditeur de texte

Apprendre Vim est une expérience satisfaisante, bien que difficile. Il existe deux approches principales pour apprendre Vim :

1. Arrêt brutal
2. Progressif

L'arrêt brutal signifie arrêter d'utiliser l'éditeur / IDE que vous utilisiez et utiliser Vim exclusivement à partir de maintenant. L'inconvénient de cette méthode est que vous aurez une perte de productivité sérieuse pendant la première semaine ou deux. Si vous êtes un programmeur à plein temps, cette méthode peut ne pas être réalisable. C'est pourquoi, pour la plupart des gens, je pense que la meilleure façon de passer à Vim est de l'utiliser progressivement.

Pour utiliser Vim progressivement, pendant les deux premières semaines, passez une heure par jour à utiliser Vim comme éditeur, tandis que le reste du temps, vous pouvez utiliser d'autres éditeurs. De nombreux éditeurs modernes sont livrés avec des plugins Vim. Lorsque j'ai commencé, j'utilisais le populaire plugin Vim de VSCode pendant une heure par jour. J'ai progressivement augmenté le temps avec le plugin Vim jusqu'à ce que je l'utilise enfin toute la journée. Gardez à l'esprit que ces plugins ne peuvent émuler qu'une fraction des fonctionnalités de Vim. Pour expérimenter la pleine puissance de Vim, comme Vimscript, les commandes en ligne de commande (Ex) et l'intégration des commandes externes, vous devrez utiliser Vim lui-même.

Il y a eu deux moments décisifs qui m'ont fait commencer à utiliser Vim à 100 % : lorsque j'ai compris que Vim a une structure semblable à une grammaire (voir le chapitre 4) et le plugin [fzf.vim](https://github.com/junegunn/fzf.vim) (voir le chapitre 3).

Le premier, lorsque j'ai réalisé la structure semblable à une grammaire de Vim, a été le moment décisif où j'ai enfin compris de quoi parlaient ces utilisateurs de Vim. Je n'avais pas besoin d'apprendre des centaines de commandes uniques. Je devais seulement apprendre une petite poignée de commandes et je pouvais les enchaîner de manière très intuitive pour faire beaucoup de choses.

Le second, la capacité à effectuer rapidement une recherche floue de fichiers, était la fonctionnalité de l'IDE que j'utilisais le plus. Lorsque j'ai appris à faire cela dans Vim, j'ai gagné un gain de vitesse majeur et je n'ai jamais regardé en arrière depuis.

Tout le monde programme différemment. En introspection, vous constaterez qu'il y a une ou deux fonctionnalités de votre éditeur / IDE préféré que vous utilisez tout le temps. Peut-être que c'était la recherche floue, le saut à la définition ou la compilation rapide. Quelles qu'elles soient, identifiez-les rapidement et apprenez à les mettre en œuvre dans Vim (il y a de fortes chances que Vim puisse probablement le faire aussi). Votre vitesse d'édition recevra un énorme coup de pouce.

Une fois que vous pouvez éditer à 50 % de la vitesse d'origine, il est temps de passer à Vim à plein temps.

## Comment lire ce guide

C'est un guide pratique. Pour devenir bon dans Vim, vous devez développer votre mémoire musculaire, pas votre connaissance théorique.

Vous n'apprenez pas à faire du vélo en lisant un guide sur comment faire du vélo. Vous devez vraiment faire du vélo.

Vous devez taper chaque commande mentionnée dans ce guide. Non seulement cela, mais vous devez les répéter plusieurs fois et essayer différentes combinaisons. Regardez quelles autres fonctionnalités la commande que vous venez d'apprendre possède. La commande `:help` et les moteurs de recherche sont vos meilleurs amis. Votre objectif n'est pas de tout savoir sur une commande, mais d'être capable d'exécuter cette commande de manière naturelle et instinctive.

Autant j'essaie de rendre ce guide linéaire, certains concepts doivent être présentés hors d'ordre. Par exemple, dans le chapitre 1, je mentionne la commande de substitution (`:s`), même si elle ne sera pas couverte avant le chapitre 12. Pour remédier à cela, chaque fois qu'un nouveau concept qui n'a pas encore été couvert est mentionné tôt, je fournirai un rapide guide pratique sans explication détaillée. Donc, s'il vous plaît, soyez indulgent avec moi :).

## Plus d'aide

Voici un conseil supplémentaire pour utiliser le manuel d'aide : supposons que vous souhaitiez en savoir plus sur ce que fait `Ctrl-P` en mode insertion. Si vous recherchez simplement `:h CTRL-P`, vous serez dirigé vers `Ctrl-P` en mode normal. Ce n'est pas l'aide `Ctrl-P` que vous recherchez. Dans ce cas, recherchez plutôt `:h i_CTRL-P`. Le `i_` ajouté représente le mode insertion. Faites attention à quel mode cela appartient.

## Syntaxe

La plupart des phrases liées aux commandes ou au code sont en code-case (`comme ça`).

Les chaînes sont entourées d'une paire de guillemets doubles ("comme ça").

Les commandes Vim peuvent être abrégées. Par exemple, `:join` peut être abrégé en `:j`. Tout au long du guide, je mélangerai les descriptions abrégées et longues. Pour les commandes qui ne sont pas fréquemment utilisées dans ce guide, j'utiliserai la version longue. Pour les commandes qui sont fréquemment utilisées, j'utiliserai la version abrégée. Je m'excuse pour les incohérences. En général, chaque fois que vous repérez une nouvelle commande, vérifiez toujours sur `:help` pour voir ses abréviations.

## Vimrc

À divers moments dans le guide, je ferai référence aux options vimrc. Si vous êtes nouveau dans Vim, un vimrc est comme un fichier de configuration.

Le vimrc ne sera pas couvert avant le chapitre 21. Pour des raisons de clarté, je vais brièvement montrer ici comment le configurer.

Supposons que vous devez définir les options de numéro (`set number`). Si vous n'avez pas encore de vimrc, créez-en un. Il est généralement placé dans votre répertoire personnel et nommé `.vimrc`. Selon votre système d'exploitation, l'emplacement peut différer. Sur macOS, je l'ai sur `~/.vimrc`. Pour voir où vous devez mettre le vôtre, consultez `:h vimrc`.

À l'intérieur, ajoutez `set number`. Enregistrez-le (`:w`), puis sourcez-le (`:source %`). Vous devriez maintenant voir les numéros de ligne affichés sur le côté gauche.

Alternativement, si vous ne souhaitez pas effectuer un changement de paramètre permanent, vous pouvez toujours exécuter la commande `set` en ligne, en exécutant `:set number`. L'inconvénient de cette approche est que ce paramètre est temporaire. Lorsque vous fermez Vim, l'option disparaît.

Puisque nous apprenons Vim et non Vi, un paramètre que vous devez avoir est l'option `nocompatible`. Ajoutez `set nocompatible` dans votre vimrc. De nombreuses fonctionnalités spécifiques à Vim sont désactivées lorsqu'il fonctionne avec l'option `compatible`.

En général, chaque fois qu'un passage mentionne une option vimrc, ajoutez simplement cette option dans vimrc, enregistrez-la et sourcez-la.

## Futur, erreurs, questions

Attendez-vous à plus de mises à jour à l'avenir. Si vous trouvez des erreurs ou avez des questions, n'hésitez pas à me contacter.

J'ai également prévu quelques chapitres à venir, alors restez à l'écoute !

## Je veux plus d'astuces Vim

Pour en savoir plus sur Vim, veuillez suivre [@learnvim](https://twitter.com/learnvim).

## Remerciements

Ce guide n'aurait pas été possible sans Bram Moleenar pour avoir créé Vim, ma femme qui a été très patiente et supportive tout au long de ce parcours, tous les [contributeurs](https://github.com/iggredible/Learn-Vim/graphs/contributors) du projet learn-vim, la communauté Vim, et beaucoup, beaucoup d'autres qui n'ont pas été mentionnés.

Merci. Vous aidez tous à rendre l'édition de texte amusante :)