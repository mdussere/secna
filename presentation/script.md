<!--
The talk, as spoken (French). One section per sequence: "## <id> · <title>".
Each sentence is one timing cue: the voice is rendered sentence by sentence and the animations start on
these cues. Lines starting with ">" are stage notes (not spoken). "# Part" headings: the recipe (night),
the code (a notebook, the cut), why it matters (night again, new scenes).
Numbers are written in words on purpose: they are read aloud.
-->

# Part 1 · The recipe

## title · Title
> Night sky. The title, the speaker, the evening.

Vos corpus grossissent. Pas votre budget de tokens.
Je suis Michaël Dussère, et ce soir, je vous apporte une recette.

## pile · The pile
> Text lines pour in from the depth of the sky and pile up. The four sources, one by one.

Nous avons tous une pile.
Des avis clients, des tickets de support, des messages de vendeurs, des journaux d'application.
Il en arrive tous les jours.
Personne ne lit tout.

## wall · Reflex one: give it all
> The pile snaps into a wall of a hundred blocks; two light up, the largest context window; then the wall grows.

Face à cette pile, on a trois réflexes.
Premier réflexe : tout donner au modèle.
Faisons le calcul : un million d'avis clients, à une centaine de tokens chacun, cent millions de tokens.
Les plus grandes fenêtres de contexte en acceptent quelques millions.
Ça ne rentre pas, et ce qui rentre est dilué.
Attendre des modèles plus grands n'y changera rien : plus ils sont puissants, plus ils écrivent, des résumés, des traces d'agents, des pull requests, et plus la pile grossit.

## dead · Reflexes two and three
> A one-percent sample misses a small cluster; then one LLM call per document stacks up into a block of descriptions.

Deuxième réflexe : prendre un échantillon.
Mais ce qui n'est pas tiré au sort n'existe pas : les signaux faibles disparaissent.
Troisième réflexe : un LLM par document.
C'est utile, c'est même ce que fait Pietro avec ses images.
Mais seul, ça donne un million de descriptions, et toujours pas de vue d'ensemble.

## clio · Clio
> A spiral galaxy of conversations rises; it blurs when the word "private" comes.

En décembre deux mille vingt-quatre, Anthropic, l'entreprise qui fait Claude, publie un article sur un outil interne : Clio.
Leur problème : des millions de conversations.
Trop nombreuses pour être lues.
Et elles ne doivent pas l'être : elles sont privées.
Leur objectif tient en une phrase : comprendre tout un corpus, sans le lire en entier.

## secna · The recipe
> The only clustering animation of the talk. SECNA written in particles; then the texts are shortened (S), turn into points (E), gather into clusters (C), receive names (N), stack into themes (A).

La recette de Clio tient en cinq étapes.
Je l'appelle SECNA : le nom est de moi, la recette est la leur.
S, comme Summarise : un petit LLM réduit chaque texte à ce qui porte le sens.
E, comme Embed : un petit modèle transforme chaque texte en un point, et deux textes qui disent la même chose atterrissent côte à côte.
C, comme Cluster : on repère les zones denses, par du calcul pur, sans un seul token.
N, comme Name : pour chaque cluster, le LLM lit quelques exemples typiques et lui donne un nom.
A, comme Aggregate : un dernier appel range les clusters en quelques grands thèmes.
On obtient une carte.
La data science trouve la structure ; le LLM lui donne du sens.

## bill · The bill
> Clio's published bill as a bar of light; the S part dissolves into dust; the figure falls from 48.81 to 3.81 dollars.

Clio a publié sa facture : quarante-huit dollars quatre-vingt-un pour cent mille conversations.
Quatre-vingt-douze pour cent de cette somme, c'est l'étape S : un appel de LLM par conversation.
Pour des textes courts, on peut s'en passer.
Un avis, un ticket, une description de pull request sont déjà courts et ciblés : le S devient du simple code.
Et la facture tombe à trois dollars quatre-vingt-un.

## curve · The curve
> Two curves of light from a thousand to a million documents: one shoots up, the other stays flat.

Faisons maintenant grossir le corpus.
Si le LLM lit chaque document, la facture suit le corpus : dix fois plus de documents, dix fois plus cher.
Si le LLM ne lit que les clusters, la facture reste presque plate.
La facture suit le nombre de clusters, pas le nombre de documents.

## others · Not an isolated case
> Three glass cards: Google Research · Urania; research · HERCULES; open source · Kura.

Et Anthropic n'est pas seul.
Google, avec Urania, reprend la même forme, avec des garanties de confidentialité.
Des chercheurs l'ont rendue récursive, avec HERCULES.
Et l'open source a reproduit Clio, avec Kura.
La même forme revient, encore et encore : c'est celle qui passe à l'échelle.

## turn · The turn
> The question alone on the night sky, then the cut.

Est-ce à la portée de tout le monde ?
Ouvrons le notebook.

# Part 2 · The code

## nb0 · The notebook
> Cut to a JupyterLab window. The whole notebook scrolls by once, top to bottom, then back up.

Voici le notebook.
Pas d'animation ici : du code, et les vraies sorties de l'exécution.
Je fais défiler le tout, pour que vous voyiez la taille : les cinq étapes tiennent en moins de cent trente lignes, commentaires compris.

## nb1 · Configuration
> The configuration cell; the REPOS line highlighted.

Première cellule : la configuration.
Le corpus, ce sont toutes les pull requests de l'organisation LangChain sur trois mois.
Une pull request, c'est une proposition de modification du code : un titre, une description, un auteur.
Pour lancer le notebook sur votre propre corpus, c'est cette ligne qu'il faut changer.

## nb2 · The corpus
> The extraction cell: one search per day; then it folds, runs, and prints the size of the corpus.

On récupère ensuite le corpus, jour par jour, par l'API publique.
Je replie le code : c'est de la pagination, rien de passionnant.
Résultat : quatorze mille neuf cent quarante-sept pull requests, dans cent trente-sept dépôts, par mille six cent sept auteurs.

## nb3 · S
> The S cell; the line that builds the text highlighted; it runs.

L'étape S, comme promis : du simple code.
On colle le titre, le dépôt, l'origine, les étiquettes et la description dans un texte court.
Deux cent quatre-vingt-onze tokens en médiane.

## nb4 · E
> The E cell runs: a progress bar fills (eleven minutes, fast-forwarded).

L'étape E tourne sur le processeur de mon portable, avec un modèle ouvert.
Onze minutes pour quatorze mille textes.
Chaque pull request devient sept cent soixante-huit nombres.
Pas de clé d'API, pas de facture.

## nb5 · C
> The C cell runs; its three core lines highlighted.

Le cœur de l'étape C tient en trois lignes.
On demande cent clusters, et chaque pull request rejoint le centre le plus proche.
C'est un réglage : assez fin pour voir les détails, assez peu pour tout pouvoir lire.
Ils vont de vingt-deux à trois cent dix pull requests.

## nb6 · N
> The N cell; the prompt highlighted, readable; it runs; the names arrive.

L'étape N : le premier appel au LLM.
Pour chaque cluster, un appel, avec quelques faits et les dix pull requests les plus proches du centre.
Le prompt est là, en anglais simple : un nom, et une description en cinquante mots.
Cent appels, environ un million de tokens : treize centimes.

## nb7 · A
> The A cell runs; the seven themes print.

L'étape A, c'est un seul appel.
Le modèle lit les cent noms et leurs descriptions, et les range en sept thèmes.
Treize mille tokens, deux centimes.

## nb8 · The picture
> The chart of the seven themes appears as the cell's output.

Et voici ce qui s'est passé chez LangChain en trois mois.
En tête, les produits d'agents, presque un tiers de l'activité.
Puis la maintenance automatique des dépendances, et la fiabilité du cœur, LangChain et LangGraph.
Le tout pour quinze centimes.
Avec le même petit modèle, faire lire chaque pull request coûterait quelques dollars : à cette échelle, le gain n'est pas sur la facture, il est dans ce qu'on voit.

## nb9 · Who writes
> A new cell counts who opens the pull requests, after the cluster descriptions kept naming one agent.

En lisant les descriptions des clusters, un nom revenait sans cesse : Open SWE, l'agent de code de LangChain.
Alors je compte : qui écrit les pull requests de LangChain ?
Vingt-huit pour cent sont ouvertes par des robots, et vingt-trois pour cent sont signées par un agent d'IA.
Leur propre agent, Open SWE, signe à lui seul vingt-sept pour cent des pull requests ouvertes par des humains.
Ma règle de l'étape S ne connaissait même pas sa signature : c'est la carte qui me l'a signalée.

## nb10 · The unexpected
> A new cell opens the largest cluster: its size, the sentence its pull requests share, its three months.

Et puis il y a ce que personne ne cherchait.
Le plus gros des cent clusters compte trois cent dix pull requests.
Un simple comptage le confirme : trois cent trois d'entre elles portent la même phrase.
Elles viennent de LangSmith Engine, un produit de LangChain qui lit les traces de production et propose des corrections, en brouillon, à leur propre assistant de documentation.
Et le cluster est apparu d'un coup : cinq le premier mois, deux cent trente le deuxième, soixante-quinze le troisième.
Je ne le cherchais pas : la carte m'a montré où compter.

## nb11 · The next day
> The last cell fetches the pull requests of the first day after the corpus and routes each one to its nearest cluster.

Dernière cellule : le lendemain de la période, deux cent quatre-vingt-six nouvelles pull requests arrivent.
On les transforme en points sur le portable, et chacune rejoint le cluster le plus proche.
Les mises à jour de dépendances rejoignent les dépendances, un correctif de LangGraph rejoint les correctifs de checkpoints.
Sans un seul appel de LLM.

## nb12 · Leaving the notebook
> The whole notebook at once; then it recedes into the night.

Voilà le notebook : cinq étapes en moins de cent trente lignes, et une carte de LangChain que personne n'avait dessinée.
Mais à quoi ça sert, au-delà de LangChain ?

# Part 3 · Why it matters

## factory · Use one: the agentic software factory
> A schematic cycle of agents around the code; streams of light go to the code and back, without end. The pile grows; a compact map appears in front of it, and the streams go to the map instead.

Premier usage : l'usine logicielle agentique, celle dont Matthieu vient de nous parler.
Vue de haut, c'est un cycle d'agents : l'un planifie, l'un code, l'un relit, l'un teste, l'un déploie, l'un surveille la production.
Et tous reviennent sans cesse au code : ils le lisent, le relisent, et le relisent encore.
Plus l'usine tourne, plus la pile grossit : pull requests, commits, fichiers, fonctions, logs, tests.
Alors on commence à leur donner une mémoire : GitLab Duo et Graphify transforment le code en graphe, DeepWiki en écrit un wiki.
Mais pour une question sur tout un corpus, comme « quels sont les grands thèmes ? », une recherche répond mal : Microsoft Research l'a montré avec GraphRAG.
C'est la pièce qu'apporte SECNA : la vue d'ensemble d'une pile entière, ce qui existe, en quelle quantité, et ce qui change.
Calculée une fois, pour quelques centimes, et gardée dans la mémoire de l'agent.
La distillation évite à vos agents de venir lire, relire et relire encore, au petit bonheur la chance, votre masse de données brutes.

## voices · Use two: the voice of your users
> Sources stream in from every edge; they merge into rivers of themes flowing through the months; one thin river swells.

Deuxième usage : la voix de vos utilisateurs.
Ce qu'ils vous écrivent, dans les avis et les tickets, mais aussi ce qu'ils disent ailleurs : sur X, sur les stores, sur les plateformes, dans les forums.
Personne ne lit tout, et un échantillon rate les signaux faibles.
La recette prend tout en compte, chaque mois, et vous montre ce qui monte.
Des outils de support le proposent déjà : Intercom range chaque jour les nouvelles conversations dans des sujets trouvés par clustering.

## assistants · Use three: your own AI products
> An assistant at the centre; conversations and agent traces fan out by the thousand; three lanes light up.

Troisième usage : vos propres produits d'IA.
Un assistant ou un agent en production, ce sont des milliers de conversations et de traces chaque jour.
Ce que les gens demandent vraiment, là où l'agent échoue, les usages que personne n'avait prévus : tout est dans cette pile.
C'est le problème de départ de Clio : comprendre l'usage d'un assistant, sans qu'aucun humain ne lise les conversations.

## limits · Where it stops
> Three limits, one line each.

Trois limites, pour être honnête.
C'est une carte du volume, pas une alarme : un cas rare mais grave peut se noyer dans un gros cluster, alors gardez une veille à part pour les signaux critiques.
Sur un petit corpus, ou un corpus très uniforme, il n'y a rien à trouver : faites tout lire au LLM.
Et les noms sont proposés par un modèle qui lit des exemples bruts : relisez-en un échantillon, et vérifiez ce que vous avez le droit de lui envoyer.

## end · End
> The two sentences; the repository and its QR code; the open question.

La data science trouve la structure, le LLM lui donne du sens, et la facture suit les clusters, pas les documents.
Le notebook est en ligne : essayez-le dès demain sur votre propre corpus.
Une dernière question, ouverte : la carte réduit-elle vraiment la facture de vos agents ?
Personne ne l'a encore mesuré ; je suis en train de le faire, alors dites-moi ce que vous trouvez.
Merci.
