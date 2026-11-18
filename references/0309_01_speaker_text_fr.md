# Le texte du talk, en français — environ 20 minutes

> Texte de travail pour l'orateur, écrit à partir de son monologue du 16 novembre
> ([`0308_03`](0308_03_live_talk_monologue.md)). Ce n'est pas un texte à lire mot à mot : il sert à caler
> les messages, l'ordre et le rythme, et à vérifier que l'écran porte bien ce qui est dit.
> **[clic]** = on avance ; entre crochets, ce qui apparaît à l'écran, en bref.
> Environ 2 650 mots dits, soit 19 à 20 minutes à un rythme posé (130 à 140 mots par minute).

---

## 1. Ouverture

[Titre : *Your corpora keep growing. Your token budget doesn't.* — le nom, le rôle]

Bonsoir à tous. Je suis Michaël Dussère, je suis Senior Solution Architect, et ce soir je voudrais vous
parler d'un problème qu'on a tous, même si on n'y pense pas tous les jours.

On a tous des données qui grossissent. Pas des données bien rangées dans une base, avec des colonnes et
des clés : des données en texte. **[clic]**

[La pile : *Customer reviews · Support tickets · Seller messages · Chat conversations*]

Des avis clients. Des tickets de support. Des messages de vendeurs, des conversations. Chacun de vous a
une pile comme ça quelque part. Et cette pile, elle grossit tous les jours.

Le problème, c'est que personne ne la lit. Personne ne peut la lire. On l'a depuis des années, on la
stocke, on la sauvegarde, et on n'a jamais vraiment pu la regarder. **[clic]**

[*Nobody reads it all.*]

Personne ne lit tout. Et pourtant, c'est une richesse. Ma conviction, c'est que dans les années qui
viennent, une bonne partie de ce qui va distinguer les acteurs d'une même industrie, ce sera leur capacité
à exploiter ces corpus-là. Pas à les stocker : à les comprendre.

Alors, face à cette pile, qu'est-ce qu'on fait ? On a en général trois réflexes. **[clic]**

## 2. Les trois réflexes

[*01 · Give the model everything* — le mur de blocs, le calcul]

Le premier réflexe, c'est de tout donner au modèle. On a des LLM puissants, on a des fenêtres de contexte
énormes : on met tout dedans et on pose la question.

Faisons le calcul. Un million d'avis clients, à une centaine de tokens l'avis, ça fait cent millions de
tokens. Les plus grandes fenêtres de contexte en acceptent quelques millions. Ça ne rentre pas.

Et même si ça rentrait, ce serait très dilué : on n'obtiendrait pas des réponses cohérentes sur un tel
volume. **[clic]**

[Les points, un par un : *Bigger models won't fix it · The stronger they get, the more they write · The pile grows faster*]

On pourrait se dire : attendons des modèles plus gros. Mais ça ne règle rien. Plus les modèles sont
puissants, plus ils écrivent : des résumés, des traces d'agents, des pull requests. Plus on les utilise,
plus la pile grossit, et plus vite qu'eux. **[clic]**

[Le premier réflexe se barre. *02 · Take a sample* — l'échantillon]

Deuxième réflexe : l'échantillonnage. On prend un sous-ensemble, un pour cent, et on le lit, ou on le donne
au modèle.

Le problème de l'échantillon, c'est qu'il ne voit que le tout-venant : les signaux principaux, ce qui
revient tout le temps. Et dans beaucoup de corpus, le tout-venant, ce n'est pas le plus intéressant. Ce qui n'est pas tiré au sort n'existe pas : les signaux faibles disparaissent. On passe à
côté de beaucoup de choses. **[clic]**

[Le deuxième se barre. *03 · One LLM call per document*]

Troisième réflexe : un appel de LLM par document. On prend chaque avis, chaque ticket, et on demande au
modèle de le résumer, de le décrire. C'est utile, c'est même une vraie brique, on va la retrouver tout à
l'heure.

Mais seul, ça ne mène nulle part. J'avais un million d'avis ; j'ai maintenant un million de descriptions.
Je ne vais pas plus lire un million de descriptions qu'un million d'avis. Ça ne rentre toujours pas dans
un contexte. Et je n'ai toujours aucune vue d'ensemble. **[clic]**

[Les trois réflexes côte à côte, tous barrés]

Voilà mon point de départ. J'ai un gros corpus. J'ai trois approches naïves. Et aucune ne marche.

Alors, est-ce que quelqu'un a résolu ce problème ? Oui. **[clic]**

## 3. Clio

[*Clio · December 2024 · Anthropic* — la galaxie]

En décembre 2024, Anthropic, l'entreprise qui fait Claude, publie un article de recherche sur un outil
interne qui s'appelle Clio.

Leur problème, c'est exactement le nôtre, en plus gros. Ils ont des millions de conversations avec Claude,
et ils veulent savoir à quoi les gens l'utilisent vraiment. Quelles tâches sont confiées au modèle ? Dans
quels domaines ? Ces conversations sont trop nombreuses pour être lues. Et surtout, elles ne doivent pas
l'être : ce sont des données privées. **[clic]**

[*Understand a whole corpus without reading all of it.*]

Ce que propose Clio, c'est une façon de comprendre tout un corpus sans le lire en entier. Et ils le font
avec une recette en cinq étapes, très simple, que je vais vous montrer une à une. Moi, je l'appelle SECNA,
pour les cinq initiales. **[clic]**

## 4. La recette, lettre par lettre

[S — *Summarise* — un avis, puis des milliers de textes qui raccourcissent]

S, comme Summarise. C'est en fait notre troisième réflexe : on prend chaque élément du corpus et on le
réduit à ce qui porte le sens. On l'homogénéise, on le rend plus digeste, et au passage on peut
l'anonymiser. Chez Clio, c'est fait par un petit modèle, un modèle léger. Une conversation de vingt
échanges devient deux ou trois lignes : « le colis n'est jamais arrivé, le support ne répond pas ».
**[clic]**

[E — *Embed* — chaque texte devient un point]

E, comme Embed. C'est exactement ce qu'on fait déjà quand on fait du RAG. Un petit modèle transforme
chaque texte en un vecteur, un point dans un espace à quelques centaines de dimensions. Et cette
projection a une propriété précieuse : elle crée une distance. Deux textes qui disent la même chose, même
avec des mots différents, atterrissent l'un à côté de l'autre. « Mon colis n'est jamais arrivé »,
« J'attends toujours mon paquet » : deux points voisins. **[clic]**

[C — *Cluster* — les régions denses s'allument]

C, comme Cluster. Une fois qu'on a nos points, on cherche les régions denses : les endroits où beaucoup
d'éléments disent à peu près la même chose. Et ça, c'est du calcul pur. Pas un seul appel de LLM.

C'est là que tout se joue. Un cluster, c'est une concentration d'information. Quand j'ai cent points, ou
mille points, qui disent la même chose, je n'ai pas besoin de les montrer tous au modèle. Il me suffit de
lui présenter le cluster : voilà un cluster de cette taille, avec ce sens-là. **[clic]**

[N — *Name* — chaque cluster reçoit un nom]

N, comme Name. Là, on remet du sens. Pour chaque cluster, le LLM lit quelques exemples typiques, ceux du
centre, et il lui donne un nom et une description. « Remboursement bloqué ». « Double débit ». « Impossible
de se connecter ». Il n'a pas besoin de relire tous les messages qui disent la même chose : il en lit dix,
et il nomme les mille. **[clic]**

[A — *Aggregate* — les clusters se rangent en thèmes]

A, comme Aggregate. Un dernier appel range les clusters en quelques grands thèmes : la livraison, le
paiement, l'application. On peut le faire sur un niveau, ou sur plusieurs ; Clio travaille sur plusieurs niveaux.

Si je résume les cinq lettres : S, E et C servent à concentrer l'information. N et A servent à la
structurer, à lui donner du sens et une forme hiérarchique, facile à parcourir, que ce soit par un humain
ou par un agent. Et dans notre version, c'est seulement là, dans N et A, qu'intervient le LLM. Chez Clio,
le S en est un aussi : retenez-le, on va le retrouver sur la facture.
**[clic]**

[*A map.* — à droite, l'arbre : thèmes → clusters → un exemple. Puis, face à S·E·C : *Data science finds the structure.* ; face à N·A : *The LLM gives it meaning.*]

À la fin, on a une carte hiérarchique de nos données : on part des grands thèmes, on descend dans les
clusters, jusqu'aux exemples eux-mêmes. Et c'est tout l'équilibre de l'approche SECNA : la data science trouve la structure,
le LLM lui donne du sens. Chacun fait ce qu'il fait le mieux. **[clic]**

## 5. La facture

[*Clio's published bill · 100,000 conversations · $48.81* — la barre]

Ce qui est bien avec l'article de Clio, c'est qu'ils publient leur facture : quarante-huit dollars et
quatre-vingt-un cents pour cent mille conversations.

Mais regardez d'où vient l'argent. Quatre-vingt-douze pour cent de cette somme, c'est l'étape S : un appel
de LLM par conversation. Pour eux, c'est indispensable. Leurs conversations sont longues, elles partent
dans tous les sens ; il faut les réduire à une petite pépite d'information avant de faire quoi que ce soit.
**[clic]**

[*Short texts: reviews, tickets, PR descriptions* · *S becomes plain code* — la barre se coupe : $3.81]

Mais nous, souvent, nos textes sont déjà courts. Un avis, un ticket, une description de pull request :
c'est déjà ciblé. Le S peut devenir du code simple : on colle le titre, deux ou trois champs, on coupe à
une longueur maximale, et c'est tout. Et la facture tombe à trois dollars quatre-vingt-un. **[clic]**

[La courbe : le corpus grandit]

Et c'est là que ça devient vraiment intéressant. Faisons grossir le corpus. Si le LLM lit chaque document,
la facture suit le corpus : dix fois plus de documents, dix fois la facture. Mais si le LLM ne lit que les
clusters, la facture reste presque plate. Elle dépend du nombre de clusters, pas du nombre de documents.
**[clic]**

[*The bill follows the clusters, not the documents.*]

C'est ça, le cœur du titre : vos corpus grossissent, pas votre budget de tokens. **[clic]**

## 6. Pas un cas isolé

[*Urania · LangSmith · Intercom*]

Et Clio n'est pas un cas isolé. Google Research a publié Urania : la même forme, avec des garanties de
confidentialité en plus. LangSmith, l'outil d'observabilité de LangChain, fait la même chose sur les traces
de vos agents : il les résume, les regroupe, et vous montre les grands usages. Et Intercom, un outil de
support client très répandu, l'applique aux conversations de support : il résume chaque conversation en
quelques questions, trouve les clusters, les nomme, et les range en grands sujets.

L'approche SECNA revient, encore et encore. Ce n'est pas un hasard : c'est la forme qui passe à l'échelle.
**[clic]**

[*Within everyone's reach? Yes.* — le pseudo-code en cinq lignes]

Alors la question, c'est : est-ce que c'est réservé à Anthropic, à Google ? Est-ce que c'est à notre
portée ?

Oui. Ça tient en quelques lignes : je résume, je projette, je regroupe, je nomme, j'agrège. Et pour vous
le prouver, je l'ai fait. **[clic]**

## 7. Le notebook

[Le notebook défile : *84 lines of Python* — le QR code en haut à droite]

Voici le notebook. Je le fais défiler en entier, pour que vous voyiez la taille : les cinq étapes, plus la
préparation, tiennent en quatre-vingts lignes de Python, dans la version simplifiée que je vous montre.
Le QR code est là, en haut à droite, pendant toute cette partie : vous pouvez ouvrir le vrai notebook et le
lancer chez vous.

Je ne vais pas vous expliquer le code ligne à ligne. Il est tard, et personne n'a envie de lire du Python
en live. Je vais juste le parcourir et vous dire ce que fait chaque bloc. **[clic]**

[Encart : la configuration]

D'abord, les données. Mon exemple, ce sont les pull requests de l'organisation LangChain sur GitHub,
pendant trois mois. Toutes. Si vous voulez le lancer sur votre propre code, c'est cette ligne-là qu'il
faut changer : vous mettez un dépôt public qui vous intéresse. **[clic]**

[Encart : l'extraction]

Ensuite, on récupère le corpus directement par l'API publique de GitHub. Quinze mille pull requests,
à peu près, dans cent trente-sept dépôts, par plus de mille six cents auteurs. **[clic]**

[Encart : S]

L'étape S, comme promis, je la fais à l'économie. Mes textes sont des pull requests, c'est déjà court : je
colle le titre, le dépôt, les étiquettes et la description dans un petit bloc de texte. Ça ne coûte rien.
**[clic]**

[Encart : E]

L'étape E tourne en local, sur le processeur de mon portable, avec un modèle ouvert. Onze minutes pour
quinze mille textes. Pas de clé d'API, pas de facture. **[clic]**

[Encart : C]

L'étape C, c'est une ligne : un k-means, un algorithme classique. Je demande une centaine de clusters ;
ils vont de vingt-deux à trois cent dix pull requests. **[clic]**

[Encart : N]

L'étape N, c'est le premier appel au LLM. Un appel par cluster, avec un petit prompt de quelques lignes
et les dix pull requests les plus typiques. Cent appels. **[clic]**

[Encart : A]

Et l'étape A, c'est un seul appel : le modèle lit les cent noms et les range en sept thèmes. **[clic]**

[Le graphique des thèmes]

Et voilà le résultat : ce qui s'est passé chez LangChain en trois mois. En tête, les produits d'agents,
presque un tiers de l'activité. Puis la maintenance automatique des dépendances, la fiabilité du cœur, la
documentation… Une organisation de quinze mille pull requests, dépouillée en quatre-vingts lignes.
**[clic]**

[La facture du notebook : *gpt-6-luna · ~1 million tokens · $0.15*]

Et combien ça m'a coûté ? J'ai utilisé un petit modèle, gpt-6-luna. Le nommage, c'est environ un million
de tokens, treize centimes. L'agrégation, deux centimes. Au total : quinze centimes pour quinze mille
pull requests.

Tout faire lire au LLM coûterait quelques dollars. Sur quinze mille pull requests, l'écart est petit ; sur
un corpus qui reçoit des centaines de milliers d'éléments par jour, il ne l'est plus. Et surtout, un appel
par document ne m'aurait toujours pas donné de carte. **[clic]**

[Le notebook vu d'ensemble, en colonnes]

Voilà le notebook, vu d'ensemble. Quatre-vingts lignes, une carte, quinze centimes. **[clic]**

## 8. En pratique, à quoi ça sert ?

[*In practice, what does it let us do?* — *Prepared data: faster, cheaper, sourced, so more reliable.*]

Maintenant, la vraie question : en pratique, qu'est-ce que ça nous permet de faire ?

Ce que ça permet, au fond, c'est de préparer la donnée. Et une donnée préparée, ça change tout pour un
LLM : les requêtes sont plus rapides, moins chères, et surtout bien plus fiables, parce que le modèle
s'appuie sur des éléments sourcés au lieu d'inventer. C'est comme nous : devant un fatras de documents, on
n'en tire rien ; devant une carte, on sait où chercher. **[clic]**

[La citation de Microsoft Research — GraphRAG. Puis : *Search finds what you know is there.* · *A map shows what you didn't know.*]

Et il y a une différence plus profonde. Microsoft Research l'a écrit : le RAG échoue sur les questions
globales, du type « quels sont les grands thèmes de ce corpus ? ».

Une recherche, c'est une approche focalisée : on va chercher ce qu'on sait être quelque part. On pose une
question, on trouve la réponse. Une carte, elle, fait émerger ce qu'on ne savait même pas être là.

Gardez cette idée en tête, parce qu'elle vaut pour les trois exemples que je vais vous donner. Trois
lecteurs pour cette carte : vous, votre équipe produit, et vos agents. **[clic]**

### Premier lecteur : vous — la voix de vos utilisateurs

[Les sources : avis, tickets, réseaux, stores, forums… — *What they write to you, and what they say everywhere else.*]

On revient à la pile du début : les retours de vos utilisateurs. Ce qu'ils vous écrivent, dans les avis
et les tickets, mais aussi ce qu'ils disent ailleurs : sur les réseaux, dans les stores, sur les forums.

On collecte tout ça parce qu'on sait qu'il y a de la valeur dedans. Mais on va surtout y chercher ce qu'on
sait déjà : on s'en sert pour confirmer des intuitions, pas pour découvrir. **[clic]**

[*Nobody reads it all. A sample misses the weak signals.*]

La question qu'on ne pose jamais, c'est : qu'est-ce qu'on ne voit pas ? Personne ne lit tout ; au mieux,
on échantillonne, et on passe à côté des petites pépites. **[clic]**

[*Everything counted, every month: what rises.* — un thème qui monte ; *Already shipping: Intercom…*]

Ce que donne la carte, c'est une vue d'ensemble cohérente, et chiffrée. Ce n'est plus un ressenti : on
peut dire que tant de pour cent des messages parlent de tel sujet, voir ce qui apparaît, ce qui disparaît,
ce qui monte d'un mois sur l'autre.

Un signal faible, ici, c'est un petit cluster : vingt messages qui disent la même chose, on les voit. Et
une fois la carte faite, chaque nouveau message se range dans son cluster par un simple calcul de
distance, sans appel de LLM.

Ce n'est pas de la science-fiction : c'est ce que fait Intercom, qu'on a vu tout à l'heure. Chaque
jour, les nouvelles conversations sont rangées dans les sujets trouvés par clustering. **[clic]**

### Deuxième lecteur : votre équipe produit — vos propres produits d'IA

[Les conversations partent d'un assistant — *Thousands of conversations and agent traces, every day.* · *What do people really do with them?*]

Deuxième pile : celle que fabriquent nos propres outils d'IA. Un assistant ou un agent en production, ce
sont des milliers de conversations et de traces chaque jour.

Et la question, là encore, n'est pas une question de recherche. C'est : qu'est-ce que les gens en font
vraiment ? **[clic]**

[*Find the recurring use cases* — les couloirs nommés ; *Clio's starting point…*]

La carte répond : les tâches qui reviennent, celles où l'agent échoue, celles que personne n'avait
prévues. Et quand on veut industrialiser, automatiser pour de bon, c'est exactement par là qu'il faut
commencer : savoir ce que les gens font.

C'est d'ailleurs le problème de départ de Clio : comprendre l'usage d'un assistant, sans qu'aucun humain
ne lise les conversations. Et c'est ce que LangSmith fait sur les traces de vos agents. **[clic]**

### Troisième lecteur : vos agents — l'usine logicielle agentique

[Le cycle d'agents autour du code — *A cycle of agents.* · *All of them keep coming back to the code.*]

Troisième pile : le code, et tout ce qui l'entoure. De plus en plus, on met des LLM au cœur du cycle de
développement : un agent planifie, un autre code, un autre relit, un autre teste. Et tous reviennent sans
cesse au code. Ils le lisent, le relisent, et le relisent encore. Et plus l'usine tourne, plus la pile
grossit : pull requests, commits, fichiers, tests. **[clic]**

[*“What happened in this repository in three months?”* — puis *SECNA: the overview of a whole pile.* · *15,000 pull requests · 100 clusters · 7 themes*]

Posez à un agent cette question : « Qu'est-ce qui s'est passé dans ce dépôt depuis trois mois ? » Il n'a
aucun endroit où chercher la réponse. Il va ouvrir des fichiers, des pull requests, un peu au hasard.

Cette réponse, vous l'avez vue tout à l'heure : c'est la carte du notebook. Quinze mille pull requests,
sept thèmes, cent clusters. **[clic]**

[*Computed once, for a few cents. Kept in the agent's memory.*]

C'est la pièce qu'apporte SECNA : la vue d'ensemble d'une pile entière. Calculée une fois, pour quelques
centimes, et gardée dans la mémoire de l'agent. **[clic]**

[*Distillation spares your agents from reading, re-reading and re-reading again, at random, your raw data.*]

La distillation évite à vos agents de lire, relire et relire encore, au petit bonheur la chance, vos
données brutes. Ils ne perdent plus leur temps, et vos tokens, à chercher on ne sait pas quoi. **[clic]**

## 9. Conclusion

[*Prepare the data your agents navigate.* — *SECNA · a graph, like Graphify · files they can grep and find*]

Pour finir. Je ne sais pas si vous utiliserez l'approche SECNA. Beaucoup attaquent ce problème
autrement : GitLab Duo et Graphify construisent un graphe du code, DeepWiki écrit un wiki pour chaque
dépôt. Peut-être que vous choisirez une taxonomie rigide, des fichiers bien structurés dans lesquels vos
agents feront des grep et des find.

Ce que je sais, c'est que si vous voulez des agents efficaces, il faut leur donner de la donnée, et il
faut la préparer, pour qu'ils puissent y naviguer facilement. **[clic]**

[*Data science finds the structure. The LLM gives it meaning. The bill follows the structure, not the number of documents.* — seul à l'écran]

Pour les corpus non structurés, l'approche SECNA existe, et elle marche. La data science trouve la
structure, le LLM lui donne du sens. Et la facture suit la structure, pas le nombre de documents.
**[clic]**

[*Thank you.* — le QR code du notebook]

Merci. Le notebook est en ligne, le QR code est là : essayez-le dès demain sur votre propre corpus.
