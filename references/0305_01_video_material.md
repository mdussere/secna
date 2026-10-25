# SECNA — le matériel de la vidéo

Contenu brut : l'histoire, les explications, les faits et leurs sources. Langue de la vidéo : français.

---

## Le sujet

**Titre** : *Vos corpus grossissent. Pas votre budget de tokens.*

**Intervenant** : Michaël Dussère — GenAI Center of Excellence, Betclic.

**Public** : un meetup d'IA générative à Bordeaux (*Generative AI Bordeaux*, 19 novembre 2026). Moitié
product managers et métiers, moitié développeurs. Ils connaissent les LLM, pas le clustering.

**Durée** : environ 20 minutes, dont plus de 5 minutes sur le notebook (séquence 4).

**Ce que le spectateur doit retenir**
- La promesse : **comprendre tout un corpus sans le lire en entier.**
- Le moyen : **la data science trouve la structure, le LLM lui donne du sens.**
- L'économie : **la facture suit le nombre de groupes, pas le nombre de documents.**
- La recette en cinq étapes : **S**ummarise · **E**mbed · **C**luster · **N**ame · **A**ggregate — SECNA.
- Qu'il peut le faire chez lui, avec le notebook.
- Une question ouverte pour la suite : et si on mettait des agents dessus ?

---

## Séquence 1 — L'impasse

Toutes les entreprises accumulent du texte : avis clients, tickets de support, messages de vendeurs
ou de partenaires, réponses libres aux questionnaires, journaux d'applications, traces d'agents. Ce
texte arrive en continu. Personne ne le lit en entier : on survole, on prend un échantillon, on range
à la main dans des catégories décidées il y a longtemps — et une bonne partie finit dans « Autre ».

Le réflexe aujourd'hui : « demandons à un LLM ». Mais un corpus ne tient pas dans un LLM.
- Ordre de grandeur : un million d'avis d'environ 100 tokens, c'est environ **100 millions de
  tokens**. La fenêtre de contexte des plus grands modèles est passée de quelques milliers de tokens
  (2023) à environ **un million** (2025–2026). Le corpus reste plusieurs ordres de grandeur au-dessus.
- Un *token*, c'est à peu près un morceau de mot — c'est l'unité de ce qu'on paie.

Et ça ne s'arrangera pas tout seul : plus les LLM sont puissants, plus on produit de texte avec eux
(résumés, réponses, logs, traces d'agents) ; plus on produit de texte, plus il faudrait de gros LLM
pour le traiter. Ce n'est pas une course qu'on finira par gagner : **ce n'est pas la même échelle.**

Les trois façons naïves d'appliquer un LLM à un gros corpus échouent chacune à leur manière :
1. **Tout donner à un très gros modèle** : ça ne tient pas dans le contexte, et ce qui rentre est
   dilué.
2. **Le faire travailler sur un échantillon** (ce que font beaucoup d'outils et d'agents : quelques
   lignes de code tirent quelques centaines de documents qui tiennent dans le contexte) : malin, mais
   ce qui n'est pas tiré au sort n'existe pas — les signaux faibles disparaissent.
3. **Un petit modèle par document** : chaque document est traité, mais à la fin on a 100 000 résumés,
   chacun dans ses mots, et toujours aucune vue d'ensemble.

La vraie question n'est donc pas *« que ferais-je avec des tokens illimités ? »* mais **« comment
traiter des corpus qui grossissent, avec le budget que j'ai ? »**

---

## Séquence 2 — Clio

**Décembre 2024.** Anthropic, l'un des quelques laboratoires qui construisent des modèles de pointe
(Claude, utilisé par des millions de personnes), publie un article sur un outil interne : **Clio**.

Leur problème est le cas réel de l'impossibilité technique : des millions de conversations entre
Claude et ses utilisateurs. Ce sont des objets complexes — longs, désordonnés, souvent sur plusieurs
sujets à la fois. Trop nombreuses pour être lues. Et elles **ne doivent pas** être lues : ce sont des
conversations privées. Pourtant, l'entreprise doit comprendre à quoi sert son modèle, ce qui marche,
ce qui pose problème.

Ce que propose Clio : faire le lien entre la **data science** et le **LLM**. La data science trouve la
structure du corpus (quels textes se ressemblent, quels groupes se forment) ; le LLM donne du sens à
cette structure (il nomme et décrit les groupes). L'objectif, dans les mots de l'article :
*« without the need for human reviewers to read raw conversations »* — sans que des relecteurs humains
aient besoin de lire les conversations brutes.

**La facture publiée** : un passage complet sur **100 000 conversations** coûte **48,81 $**
(≈ 500 $ pour un million).

La promesse, résumée : **comprendre tout un corpus sans le lire en entier.**

---

## Séquence 3 — SECNA

La recette de Clio tient en cinq étapes. Le domaine n'a pas de nom canonique pour cette recette ;
le nom **SECNA** est inventé pour ce talk, et la recette n'est pas celle de l'intervenant : c'est
celle de Clio.

| Lettre | Étape | Ce qui se passe | Coût chez Clio (100 000 conversations) |
|---|---|---|---|
| **S** | Summarise — préparer | Un LLM relit **chaque document** et en extrait l'essentiel : il résume, traduit, efface la forme, fait ressortir les éléments porteurs de sens (Clio extrait quelques attributs par conversation, dont un résumé de la demande). Chez Clio, cette étape sert aussi à protéger la confidentialité et à choisir l'angle d'analyse. | **45,00 $** — avec le plus petit modèle de l'époque (Claude 3 Haiku). **92 % de la facture.** Une fois par document. |
| **E** | Embed — projeter | Un petit modèle de langage (un modèle d'*embedding*) transforme chaque texte en un point dans un espace : deux textes qui veulent dire la même chose atterrissent tout près l'un de l'autre (« colis jamais arrivé » et « livraison en retard » : des mots différents, le même sens). Le sens devient de la géométrie. | ≈ 0 — quelques centimes, peut tourner en local. |
| **C** | Cluster — regrouper | Les points proches forment des groupes. Quelques points restent isolés. Pas de LLM : du calcul pur. C'est ici que la structure est trouvée. | 0 $ — aucun token. |
| **N** | Name — nommer | Pour chaque groupe, un LLM lit quelques exemples et donne au groupe un nom et une description. Le LLM n'est plus appelé une fois par document, mais une fois par groupe : au lieu de 100 000 appels, quelques milliers. | **3,75 $** — avec un modèle plus gros (Claude 3.5 Sonnet). |
| **A** | Aggregate — ranger | On compte les groupes et on les range en niveaux : quelques grands thèmes, des milliers de groupes fins. Le résultat n'est pas une liste, c'est une carte qu'on peut parcourir du général au détail. Exemple de Clio : *Écriture → rédaction de contenus → contenus pour le référencement*. | 0,06 $ |

**Total : 48,81 $.** Deux étapes consomment des tokens (S et N) ; les trois autres ne coûtent
presque rien. S représente 92 % de la facture et il est optionnel quand les textes sont courts.

La phrase à retenir : **la data science trouve la structure, le LLM lui donne du sens.** Le LLM n'est
pas un figurant : c'est là que le sens se fabrique. Il est simplement utilisé avec parcimonie.

---

## Séquence 4 — Les gros, et nous

**Anthropic n'est pas seul.** D'autres grands acteurs ont publié des approches de la même forme,
chacun avec sa variante :
- **Google — Urania (2025)** : la même idée, avec des garanties formelles de confidentialité
  (confidentialité différentielle) sur le regroupement et le comptage. L'article se compare
  explicitement à Clio, qu'il prend comme référence.
- **LangChain — LangSmith Insights (2025)** : l'outil d'analyse des traces d'agents. D'après sa
  documentation publique, un LLM résume **chaque trace**, puis un LLM fait le regroupement — un LLM
  à chaque étape. Résultat : l'analyse est **plafonnée à 1 000 traces**.

Le point commun : **quand le LLM fait tout, il faut échantillonner ; quand la data science fait la
structure, on peut tout lire.**

**La courbe de coût** (illustrative, ordres de grandeur) : en abscisse, la taille du corpus — 1 000,
10 000, 100 000, 1 000 000 de documents. Si le LLM lit chaque document, la facture suit le corpus :
dix fois plus de documents, dix fois plus cher. Si le LLM ne lit que les groupes, la facture reste
presque plate : elle monte un peu quand le corpus devient assez gros pour un niveau de hiérarchie de
plus, mais les groupes grossissent beaucoup moins vite que les documents. **La facture suit les
groupes, pas les documents.**

**Réservé aux géants ?** À l'échelle d'une entreprise ordinaire (quelques dizaines de milliers de
textes), tout faire lire au LLM coûte encore peu. Ça ne durera pas — les piles grossissent. Et
surtout, le vrai gain n'est pas là : c'est **voir ce qu'on ne cherchait pas** — les thèmes qui
émergent tout seuls, que personne n'avait mis dans le formulaire.

**Est-ce que je peux le faire moi aussi ? Oui : le notebook** (plus de 5 minutes de la vidéo).
- Un notebook Jupyter de moins de 200 lignes, dans un dépôt public : **github.com/mdussere/secna**
  (un QR code renvoie vers ce dépôt). Une commande pour le lancer. Le fournisseur de modèles se règle
  sur une ligne de configuration.
- Le corpus : **le noyau Linux, les six derniers mois** — les commits et les *pull requests*
  fusionnées. La question posée : *qu'est-ce qui s'est passé dans le noyau Linux ces six derniers
  mois ?* (plusieurs dizaines de milliers de commits ; chiffres exacts à venir quand le notebook
  aura tourné).
- Le déroulé, cellule par cellule :
  1. Récupérer le corpus (les six derniers mois de l'historique du noyau) et afficher sa taille.
  2. **E** — projeter chaque message de commit avec un modèle d'embedding ; on voit le nuage de
     points se remplir.
  3. **C** — regrouper ; on compte les groupes, on montre les points restés isolés.
  4. **N** — un appel au LLM par groupe, avec quelques exemples ; les noms arrivent un par un.
  5. **A** — ranger les groupes en thèmes et sous-thèmes ; un tableau des grands thèmes du semestre.
  6. **La facture** : le notebook affiche ce que ce passage a coûté en tokens, et ce qu'aurait coûté
     un LLM sur chaque document.
  7. **Votre corpus** : la seule ligne à changer pour l'appliquer à vos propres textes.
- Exemples de thèmes possibles (illustratifs, en attendant le vrai résultat) : *Rust dans le noyau*,
  *pilotes GPU*, *réseau : correctifs*, *gestion mémoire*, *systèmes de fichiers*, *ordonnanceur*.
  Exemple de message de commit (illustratif) : `net: fix use-after-free in tcp_ack() when socket is
  closed during retransmit` → préparé : *sous-système : réseau · nature : correctif · risque : mémoire*.

---

## Séquence 5 — Ma recette

**Ma recette — pas mon invention, celle que j'utilise et que je défends.** Comme la pâte à crêpes :
je ne l'ai pas inventée, mais quand je fais des crêpes, c'est celle-là que je prends, parce qu'elle
est équilibrée et qu'elle tient bien dans la poêle.

- Ma recette, c'est **SECNA sans le S** : pas de LLM pour préparer chaque document — c'est 92 % de la
  facture et l'essentiel du temps. À la place, une préparation légère, sans LLM : le texte brut, et
  son contexte (la date, le produit, la note…).
- Ce que je perds : un peu de finesse sur les textes longs et multi-sujets.
- Ce que je gagne : le coût et la vitesse.
- **Pourquoi une table** : le résultat n'est pas un rapport mais une table. Chaque texte garde son
  groupe, son niveau, sa date, son produit. On la filtre et on la croise : quels thèmes montent ce
  mois-ci ? Quels thèmes reviennent sur tel produit ? C'est ce qui rend la carte utile au quotidien.

**Où ça rapporte** : les avis clients (les vraies raisons des notes basses), les tickets de support
(les catégories qui existent vraiment, pas celles du formulaire — et la catégorie « Autre » qui se
découpe enfin), les messages vendeurs (ce qui les bloque), les retours ouverts (ce que les gens disent
quand on ne leur demande rien). Un mot sur le RAG : il répond à une question qu'on pose ; il ne trouve
que ce qu'on sait déjà chercher. Ici, ce sont les thèmes qui viennent à vous.

**Où ça s'arrête** — les limites, chacune avec sa réponse :
1. La plainte rare, grave mais unique, peut se noyer dans un grand groupe — Clio le dit lui-même
  (*« not useful for identifying rare … patterns »*). C'est une carte du volume, pas une alarme :
  pour les signaux critiques, une veille à part.
2. Sur un petit corpus, ou un corpus très uniforme, il n'y a rien à trouver : sous quelques milliers
  de textes, demander au LLM de tout lire.
3. Les noms des groupes sont une proposition du LLM, pas une vérité : relire un échantillon par
  groupe, vérifier qu'ils tiennent d'un passage à l'autre.

**Demain** : la préparation de chaque document (S) est la seule étape LLM qui grossit avec le corpus ;
c'est donc là que chaque baisse de prix des petits modèles spécialisés tombe en premier. Quand elle
coûtera assez peu, le S reviendra dans ma recette. L'avenir de ces méthodes n'est pas le LLM
partout, c'est le mélange : **la data science pour la structure, des petits modèles pour chaque
document, un grand modèle là où le sens se fabrique.**

**La fin — une question ouverte** : une fois qu'on a cette carte, ces groupes nommés et rangés en
niveaux, que se passe-t-il si on met **des agents** dessus ? Un assistant qui parcourt la carte à
notre place, descend dans les groupes, va chercher des exemples et répond — par exemple : *« quel
problème monte le plus ce mois-ci ? »*. **Ce sera pour la prochaine fois.**

Dernière phrase : la facture suit les groupes, pas les documents ; la data science trouve la
structure, le LLM lui donne du sens ; le code est en ligne — prenez votre pile, un après-midi, et
essayez.

---

## Faits — à respecter

- Tous les chiffres viennent des sources ci-dessous, ou sont marqués comme illustratifs / ordres de
  grandeur.
- Ne pas dire que « tout le monde a copié Clio » ; ne pas dire que la technique est secrète (elle est
  publiée, simplement peu connue).
- Ne pas citer GitHub ni OpenAI parmi ceux qui font SECNA.
- Les résultats du notebook sur le noyau Linux ne sont pas encore disponibles : tout résultat montré
  est illustratif.

## Sources

- Tamkin et al., *Clio: Privacy-Preserving Insights into Real-World AI Use*, Anthropic, déc. 2024 —
  arXiv:2412.13678 (coût : table 3 ; limite sur les motifs rares).
- Liu et al., *Urania: Differentially Private Insights into AI Use*, Google Research, COLM 2025 —
  arXiv:2506.04681.
- LangSmith Insights — documentation publique (docs.langchain.com/langsmith/insights) : résumé de
  chaque trace, regroupement par un modèle, plafond de 1 000 traces.
- Le dépôt du talk : github.com/mdussere/secna.
