---
description: Ce document présente les fonctionnalités du mode insertion dans Vim,
  ainsi que les différentes façons d'y accéder pour améliorer l'efficacité de la saisie.
title: Ch06. Insert Mode
---

Le mode d'insertion est le mode par défaut de nombreux éditeurs de texte. Dans ce mode, ce que vous tapez est ce que vous obtenez.

Cependant, cela ne signifie pas qu'il n'y a pas beaucoup à apprendre. Le mode d'insertion de Vim contient de nombreuses fonctionnalités utiles. Dans ce chapitre, vous apprendrez comment utiliser ces fonctionnalités du mode d'insertion dans Vim pour améliorer votre efficacité de frappe.

## Façons d'entrer en mode d'insertion

Il existe plusieurs façons de passer en mode d'insertion depuis le mode normal. Voici quelques-unes d'entre elles :

```shell
i    Insérer du texte avant le curseur
I    Insérer du texte avant le premier caractère non vide de la ligne
a    Ajouter du texte après le curseur
A    Ajouter du texte à la fin de la ligne
o    Commencer une nouvelle ligne en dessous du curseur et insérer du texte
O    Commencer une nouvelle ligne au-dessus du curseur et insérer du texte
s    Supprimer le caractère sous le curseur et insérer du texte
S    Supprimer la ligne actuelle et insérer du texte, synonyme de "cc"
gi   Insérer du texte à la même position où le dernier mode d'insertion a été arrêté
gI   Insérer du texte au début de la ligne (colonne 1)
```

Remarquez le motif de minuscules / majuscules. Pour chaque commande en minuscules, il y a un équivalent en majuscules. Si vous êtes nouveau, ne vous inquiétez pas si vous ne vous souvenez pas de toute la liste ci-dessus. Commencez par `i` et `o`. Ils devraient suffire pour vous lancer. Apprenez progressivement plus au fil du temps.

## Différentes façons de sortir du mode d'insertion

Il existe quelques façons différentes de revenir au mode normal tout en étant en mode d'insertion :

```shell
<Esc>     Quitte le mode d'insertion et passe au mode normal
Ctrl-[    Quitte le mode d'insertion et passe au mode normal
Ctrl-C    Comme Ctrl-[ et <Esc>, mais ne vérifie pas les abréviations
```

Je trouve que la touche `<Esc>` est trop éloignée, donc je mappe ma touche `<Caps-Lock>` pour qu'elle se comporte comme `<Esc>`. Si vous recherchez le clavier ADM-3A de Bill Joy (le créateur de Vi), vous verrez que la touche `<Esc>` n'est pas située en haut à gauche comme sur les claviers modernes, mais à gauche de la touche `q`. C'est pourquoi je pense qu'il est logique de mapper `<Caps lock>` à `<Esc>`.

Une autre convention courante que j'ai vue chez les utilisateurs de Vim est de mapper `<Esc>` à `jj` ou `jk` en mode d'insertion. Si vous préférez cette option, ajoutez l'une de ces lignes (ou les deux) dans votre fichier vimrc.

```shell
inoremap jj <Esc>
inoremap jk <Esc>
```

## Répéter le mode d'insertion

Vous pouvez passer un paramètre de compte avant d'entrer en mode d'insertion. Par exemple :

```shell
10i
```

Si vous tapez "hello world!" et quittez le mode d'insertion, Vim répétera le texte 10 fois. Cela fonctionnera avec n'importe quelle méthode du mode d'insertion (ex : `10I`, `11a`, `12o`).

## Supprimer des morceaux en mode d'insertion

Lorsque vous faites une erreur de frappe, il peut être fastidieux de taper `<Backspace>` à plusieurs reprises. Il peut être plus judicieux de passer en mode normal et de supprimer votre erreur. Vous pouvez également supprimer plusieurs caractères à la fois tout en étant en mode d'insertion.

```shell
Ctrl-h    Supprimer un caractère
Ctrl-w    Supprimer un mot
Ctrl-u    Supprimer toute la ligne
```

## Insérer depuis un registre

Les registres Vim peuvent stocker des textes pour une utilisation future. Pour insérer un texte depuis n'importe quel registre nommé pendant le mode d'insertion, tapez `Ctrl-R` suivi du symbole du registre. Il existe de nombreux symboles que vous pouvez utiliser, mais pour cette section, couvrons uniquement les registres nommés (a-z).

Pour le voir en action, vous devez d'abord copier un mot dans le registre a. Déplacez votre curseur sur n'importe quel mot. Ensuite, tapez :

```shell
"ayiw
```

- `"a` indique à Vim que la cible de votre prochaine action ira dans le registre a.
- `yiw` copie le mot intérieur. Consultez le chapitre sur la grammaire Vim pour un rappel.

Le registre a contient maintenant le mot que vous venez de copier. Pendant le mode d'insertion, pour coller le texte stocké dans le registre a :

```shell
Ctrl-R a
```

Il existe plusieurs types de registres dans Vim. Je les couvrirais plus en détail dans un chapitre ultérieur.

## Défilement

Saviez-vous que vous pouvez faire défiler tout en étant en mode d'insertion ? En mode d'insertion, si vous allez dans le sous-mode `Ctrl-X`, vous pouvez effectuer des opérations supplémentaires. Le défilement en fait partie.

```shell
Ctrl-X Ctrl-Y    Faire défiler vers le haut
Ctrl-X Ctrl-E    Faire défiler vers le bas
```

## Autocomplétion

Comme mentionné ci-dessus, si vous appuyez sur `Ctrl-X` depuis le mode d'insertion, Vim entrera dans un sous-mode. Vous pouvez faire de l'autocomplétion de texte tout en étant dans ce sous-mode d'insertion. Bien que ce ne soit pas aussi bon que [intellisense](https://code.visualstudio.com/docs/editor/intellisense) ou tout autre protocole de serveur de langage (LSP), c'est une fonctionnalité très capable pour quelque chose qui est disponible dès la sortie de la boîte.

Voici quelques commandes d'autocomplétion utiles pour commencer :

```shell
Ctrl-X Ctrl-L	   Insérer une ligne entière
Ctrl-X Ctrl-N	   Insérer un texte du fichier actuel
Ctrl-X Ctrl-I	   Insérer un texte des fichiers inclus
Ctrl-X Ctrl-F	   Insérer un nom de fichier
```

Lorsque vous déclenchez l'autocomplétion, Vim affichera une fenêtre contextuelle. Pour naviguer vers le haut et vers le bas de la fenêtre contextuelle, utilisez `Ctrl-N` et `Ctrl-P`.

Vim dispose également de deux raccourcis d'autocomplétion qui n'impliquent pas le sous-mode `Ctrl-X` :

```shell
Ctrl-N             Trouver le mot suivant correspondant
Ctrl-P             Trouver le mot précédent correspondant
```

En général, Vim examine le texte dans tous les tampons disponibles pour la source d'autocomplétion. Si vous avez un tampon ouvert avec une ligne qui dit "Les donuts au chocolat sont les meilleurs" :
- Lorsque vous tapez "Choco" et faites `Ctrl-X Ctrl-L`, cela correspondra et affichera toute la ligne.
- Lorsque vous tapez "Choco" et faites `Ctrl-P`, cela correspondra et affichera le mot "Chocolate".

L'autocomplétion est un vaste sujet dans Vim. Ce n'est que la partie émergée de l'iceberg. Pour en savoir plus, consultez `:h ins-completion`.

## Exécuter une commande en mode normal

Saviez-vous que Vim peut exécuter une commande en mode normal tout en étant en mode d'insertion ?

En mode d'insertion, si vous appuyez sur `Ctrl-O`, vous serez dans le sous-mode insert-normal. Si vous regardez l'indicateur de mode en bas à gauche, vous verrez normalement `-- INSERT --`, mais en appuyant sur `Ctrl-O`, cela change en `-- (insert) --`. Dans ce mode, vous pouvez effectuer *une* commande en mode normal. Voici quelques actions que vous pouvez faire :

**Centrage et saut**

```shell
Ctrl-O zz       Centrer la fenêtre
Ctrl-O H/M/L    Sauter en haut/milieu/bas de la fenêtre
Ctrl-O 'a       Sauter au marqueur a
```

**Répéter du texte**

```shell
Ctrl-O 100ihello    Insérer "hello" 100 fois
```

**Exécuter des commandes terminal**

```shell
Ctrl-O !! curl https://google.com    Exécuter curl
Ctrl-O !! pwd                        Exécuter pwd
```

**Supprimer plus rapidement**

```shell
Ctrl-O dtz    Supprimer de l'emplacement actuel jusqu'à la lettre "z"
Ctrl-O D      Supprimer de l'emplacement actuel jusqu'à la fin de la ligne
```

## Apprendre le mode d'insertion de manière intelligente

Si vous êtes comme moi et que vous venez d'un autre éditeur de texte, il peut être tentant de rester en mode d'insertion. Cependant, rester en mode d'insertion lorsque vous n'entrez pas de texte est un anti-modèle. Développez l'habitude de passer en mode normal lorsque vos doigts ne tapent pas de nouveau texte.

Lorsque vous devez insérer un texte, demandez-vous d'abord si ce texte existe déjà. Si c'est le cas, essayez de copier ou de déplacer ce texte au lieu de le taper. Si vous devez utiliser le mode d'insertion, voyez si vous pouvez autocompléter ce texte chaque fois que cela est possible. Évitez de taper le même mot plus d'une fois si vous le pouvez.