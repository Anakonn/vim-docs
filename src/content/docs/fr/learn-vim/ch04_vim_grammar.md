---
description: Ce chapitre explique la structure grammaticale des commandes Vim, facilitant
  l'apprentissage et la maîtrise du langage Vim pour les utilisateurs.
title: Ch04. Vim Grammar
---

Il est facile de se sentir intimidé par la complexité des commandes Vim. Si vous voyez un utilisateur Vim faire `gUfV` ou `1GdG`, vous ne saurez peut-être pas immédiatement ce que ces commandes font. Dans ce chapitre, je vais décomposer la structure générale des commandes Vim en une règle grammaticale simple.

C'est le chapitre le plus important de tout le guide. Une fois que vous comprenez la structure grammaticale sous-jacente, vous serez capable de "parler" à Vim. Au fait, quand je parle de *langage Vim* dans ce chapitre, je ne parle pas du langage Vimscript (le langage de programmation intégré de Vim, que vous apprendrez dans les chapitres suivants).

## Comment Apprendre une Langue

Je ne suis pas un locuteur natif anglais. J'ai appris l'anglais quand j'avais 13 ans, lorsque j'ai déménagé aux États-Unis. Il y a trois choses que vous devez faire pour apprendre à parler une nouvelle langue :

1. Apprendre les règles de grammaire.
2. Augmenter le vocabulaire.
3. Pratiquer, pratiquer, pratiquer.

De même, pour parler le langage Vim, vous devez apprendre les règles de grammaire, augmenter le vocabulaire et pratiquer jusqu'à ce que vous puissiez exécuter les commandes sans réfléchir.

## Règle de Grammaire

Il n'y a qu'une seule règle de grammaire dans le langage Vim :

```shell
verbe + nom
```

C'est tout !

C'est comme dire ces phrases en anglais :

- *"Manger (verbe) un donut (nom)"*
- *"Frapper (verbe) un ballon (nom)"*
- *"Apprendre (verbe) l'éditeur Vim (nom)"*

Maintenant, vous devez enrichir votre vocabulaire avec des verbes et des noms Vim de base.

## Noms (Mouvements)

Les noms sont des mouvements Vim. Les mouvements sont utilisés pour se déplacer dans Vim. Voici une liste de quelques mouvements Vim :

```shell
h    Gauche
j    Bas
k    Haut
l    Droite
w    Avancer jusqu'au début du mot suivant
}    Sauter au paragraphe suivant
$    Aller à la fin de la ligne
```

Vous en apprendrez davantage sur les mouvements dans le chapitre suivant, donc ne vous inquiétez pas trop si vous ne comprenez pas certains d'entre eux.

## Verbes (Opérateurs)

Selon `:h operator`, Vim a 16 opérateurs. Cependant, d'après mon expérience, apprendre ces 3 opérateurs est suffisant pour 80 % de mes besoins d'édition :

```shell
y    Copier du texte (yank)
d    Supprimer du texte et sauvegarder dans le registre
c    Supprimer du texte, sauvegarder dans le registre et commencer le mode insertion
```

Au fait, après avoir copié un texte, vous pouvez le coller avec `p` (après le curseur) ou `P` (avant le curseur).

## Verbe et Nom

Maintenant que vous connaissez les noms et les verbes de base, appliquons la règle grammaticale, verbe + nom ! Supposons que vous ayez cette expression :

```javascript
const learn = "vim";
```

- Pour copier tout depuis votre position actuelle jusqu'à la fin de la ligne : `y$`.
- Pour supprimer depuis votre position actuelle jusqu'au début du mot suivant : `dw`.
- Pour changer depuis votre position actuelle jusqu'à la fin du paragraphe actuel, dites `c}`.

Les mouvements acceptent également un nombre comme argument (je discuterai de cela dans le chapitre suivant). Si vous devez remonter de 3 lignes, au lieu d'appuyer sur `k` 3 fois, vous pouvez faire `3k`. Le compte fonctionne avec la grammaire Vim.
- Pour copier deux caractères vers la gauche : `y2h`.
- Pour supprimer les deux mots suivants : `d2w`.
- Pour changer les deux lignes suivantes : `c2j`.

En ce moment, vous devez peut-être réfléchir longuement et durement pour exécuter même une commande simple. Vous n'êtes pas seul. Quand j'ai commencé, j'ai eu des difficultés similaires, mais je suis devenu plus rapide avec le temps. Vous le serez aussi. Répétition, répétition, répétition.

En passant, les opérations ligne par ligne (opérations affectant toute la ligne) sont des opérations courantes dans l'édition de texte. En général, en tapant une commande opérateur deux fois, Vim effectue une opération ligne par ligne pour cette action. Par exemple, `dd`, `yy` et `cc` effectuent **suppression**, **copie** et **changement** sur toute la ligne. Essayez cela avec d'autres opérateurs !

C'est vraiment cool. Je vois un schéma ici. Mais je n'ai pas encore fini. Vim a un autre type de nom : les objets texte.

## Plus de Noms (Objets Texte)

Imaginez que vous êtes quelque part à l'intérieur d'une paire de parenthèses comme `(hello Vim)` et que vous devez supprimer toute la phrase à l'intérieur des parenthèses. Comment pouvez-vous le faire rapidement ? Y a-t-il un moyen de supprimer le "groupe" dans lequel vous êtes ?

La réponse est oui. Les textes viennent souvent structurés. Ils contiennent souvent des parenthèses, des guillemets, des crochets, des accolades, et plus encore. Vim a un moyen de capturer cette structure avec des objets texte.

Les objets texte sont utilisés avec des opérateurs. Il existe deux types d'objets texte : les objets texte intérieurs et extérieurs.

```shell
i + objet    Objet texte intérieur
a + objet    Objet texte extérieur
```

L'objet texte intérieur sélectionne l'objet à l'intérieur *sans* l'espace blanc ou les objets environnants. L'objet texte extérieur sélectionne l'objet à l'intérieur *en incluant* l'espace blanc ou les objets environnants. En général, un objet texte extérieur sélectionne toujours plus de texte qu'un objet texte intérieur. Si votre curseur est quelque part à l'intérieur des parenthèses dans l'expression `(hello Vim)` :
- Pour supprimer le texte à l'intérieur des parenthèses sans supprimer les parenthèses : `di(`.
- Pour supprimer les parenthèses et le texte à l'intérieur : `da(`.

Regardons un exemple différent. Supposons que vous ayez cette fonction Javascript et que votre curseur soit sur le "H" de "Hello" :

```javascript
const hello = function() {
  console.log("Hello Vim");
  return true;
}
```

- Pour supprimer tout "Hello Vim" : `di(`.
- Pour supprimer le contenu de la fonction (entouré par `{}`) : `di{`.
- Pour supprimer la chaîne "Hello" : `diw`.

Les objets texte sont puissants car vous pouvez cibler différents objets depuis un seul emplacement. Vous pouvez supprimer les objets à l'intérieur des parenthèses, le bloc de fonction, ou le mot actuel. Mnémotechniquement, lorsque vous voyez `di(`, `di{`, et `diw`, vous avez une assez bonne idée des objets texte qu'ils représentent : une paire de parenthèses, une paire d'accolades, et un mot.

Regardons un dernier exemple. Supposons que vous ayez ces balises HTML :

```html
<div>
  <h1>Header1</h1>
  <p>Paragraph1</p>
  <p>Paragraph2</p>
</div>
```

Si votre curseur est sur le texte "Header1" :
- Pour supprimer "Header1" : `dit`.
- Pour supprimer `<h1>Header1</h1>` : `dat`.

Si votre curseur est sur "div" :
- Pour supprimer `h1` et les deux lignes `p` : `dit`.
- Pour supprimer tout : `dat`.
- Pour supprimer "div" : `di<`.

Voici une liste d'objets texte courants :

```shell
w         Un mot
p         Un paragraphe
s         Une phrase
( ou )    Une paire de ( )
{ ou }    Une paire de { }
[ ou ]    Une paire de [ ]
< ou >    Une paire de < >
t         Balises XML
"         Une paire de " "
'         Une paire de ' '
`         Une paire de ` `
```

Pour en savoir plus, consultez `:h text-objects`.

## Composabilité et Grammaire

La grammaire Vim est un sous-ensemble de la fonctionnalité de composabilité de Vim. Discutons de la composabilité dans Vim et pourquoi c'est une excellente fonctionnalité à avoir dans un éditeur de texte.

La composabilité signifie avoir un ensemble de commandes générales qui peuvent être combinées (composées) pour effectuer des commandes plus complexes. Tout comme en programmation où vous pouvez créer des abstractions plus complexes à partir d'abstractions plus simples, dans Vim, vous pouvez exécuter des commandes complexes à partir de commandes plus simples. La grammaire Vim est la manifestation de la nature composable de Vim.

Le véritable pouvoir de la composabilité de Vim brille lorsqu'il s'intègre à des programmes externes. Vim a un opérateur de filtre (`!`) pour utiliser des programmes externes comme filtres pour nos textes. Supposons que vous ayez ce texte en désordre ci-dessous et que vous souhaitiez le tabuler :

```shell
Id|Name|Cuteness
01|Puppy|Very
02|Kitten|Ok
03|Bunny|Ok
```

Cela ne peut pas être facilement fait avec des commandes Vim, mais vous pouvez le faire rapidement avec la commande terminal `column` (en supposant que votre terminal dispose de la commande `column`). Avec votre curseur sur "Id", exécutez `!}column -t -s "|"`. Voilà ! Maintenant, vous avez ces données tabulaires jolies avec juste une commande rapide.

```shell
Id  Name    Cuteness
01  Puppy   Very
02  Kitten  Ok
03  Bunny   Ok
```

Décomposons la commande. Le verbe était `!` (opérateur de filtre) et le nom était `}` (aller au paragraphe suivant). L'opérateur de filtre `!` a accepté un autre argument, une commande terminale, donc je lui ai donné `column -t -s "|"`. Je ne vais pas expliquer comment `column` a fonctionné, mais en effet, il a tabulé le texte.

Supposons que vous souhaitiez non seulement tabuler votre texte, mais afficher uniquement les lignes avec "Ok". Vous savez que `awk` peut faire le travail facilement. Vous pouvez faire cela à la place :

```shell
!}column -t -s "|" | awk 'NR > 1 && /Ok/ {print $0}'
```

Résultat :

```shell
02  Kitten  Ok
03  Bunny   Ok
```

Super ! L'opérateur de commande externe peut également utiliser le pipe (`|`).

C'est le pouvoir de la composabilité de Vim. Plus vous connaissez vos opérateurs, mouvements et commandes terminales, votre capacité à composer des actions complexes est *multipliée*.

Supposons que vous ne connaissiez que quatre mouvements, `w, $, }, G` et un seul opérateur, `d`. Vous pouvez faire 8 actions : *déplacer* 4 façons différentes (`w, $, }, G`) et *supprimer* 4 cibles différentes (`dw, d$, d}, dG`). Puis un jour, vous apprenez à connaître l'opérateur majuscule (`gU`). Vous n'avez pas seulement ajouté une nouvelle capacité à votre ceinture à outils Vim, mais *quatre* : `gUw, gU$, gU}, gUG`. Cela fait 12 outils dans votre ceinture à outils Vim. Chaque nouvelle connaissance est un multiplicateur pour vos capacités actuelles. Si vous connaissez 10 mouvements et 5 opérateurs, vous avez 60 mouvements (50 opérations + 10 mouvements) dans votre arsenal. Vim a un mouvement de numéro de ligne (`nG`) qui vous donne `n` mouvements, où `n` est le nombre de lignes que vous avez dans votre fichier (pour aller à la ligne 5, exécutez `5G`). Le mouvement de recherche (`/`) vous donne pratiquement un nombre illimité de mouvements car vous pouvez rechercher n'importe quoi. L'opérateur de commande externe (`!`) vous donne autant d'outils de filtrage que le nombre de commandes terminales que vous connaissez. En utilisant un outil composable comme Vim, tout ce que vous savez peut être lié ensemble pour effectuer des opérations avec une complexité croissante. Plus vous en savez, plus vous devenez puissant.

Ce comportement composable fait écho à la philosophie Unix : *faire une chose bien*. Un opérateur a un seul travail : faire Y. Un mouvement a un seul travail : aller à X. En combinant un opérateur avec un mouvement, vous obtenez de manière prévisible YX : faire Y sur X.

Les mouvements et les opérateurs sont extensibles. Vous pouvez créer des mouvements et des opérateurs personnalisés à ajouter à votre ceinture à outils Vim. Le plugin [`vim-textobj-user`](https://github.com/kana/vim-textobj-user) vous permet de créer vos propres objets texte. Il contient également une [liste](https://github.com/kana/vim-textobj-user/wiki) d'objets texte personnalisés créés par les utilisateurs.

## Apprenez la Grammaire Vim de Manière Intelligente

Vous venez d'apprendre la règle de grammaire de Vim : `verbe + nom`. L'un de mes plus grands moments "AHA !" avec Vim a été lorsque j'ai juste appris à connaître l'opérateur majuscule (`gU`) et que je voulais mettre en majuscule le mot actuel, j'ai *instinctivement* exécuté `gUiw` et cela a fonctionné ! Le mot a été mis en majuscule. À ce moment-là, j'ai enfin commencé à comprendre Vim. Mon espoir est que vous aurez bientôt votre propre moment "AHA !" si ce n'est pas déjà fait.

L'objectif de ce chapitre est de vous montrer le modèle `verbe + nom` dans Vim afin que vous abordiez l'apprentissage de Vim comme l'apprentissage d'une nouvelle langue au lieu de mémoriser chaque combinaison de commandes.

Apprenez le modèle et comprenez les implications. C'est la manière intelligente d'apprendre.