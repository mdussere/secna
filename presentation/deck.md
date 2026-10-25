---
marp: true
theme: secna
paginate: true
lang: fr
footer: 'Generative AI Bordeaux · 19 novembre 2026'
style: "section { --parts: 7 }"
---

<!-- _class: cover -->
<!-- _paginate: false -->
<!-- _footer: 'Generative AI Bordeaux · 19 novembre 2026' -->

# Vos corpus grossissent.<br>*Pas votre budget de tokens.*

## Michaël Dussère — Advanced GenAI Solution Architect, GenAI Center of Excellence, Betclic

<!-- Nom, une ligne sur ce que je fais, puis directement la question. -->

---

<!-- header: '01 · La question' -->
<!-- _class: impact ch1 -->

<del>« Que ferais-je avec des tokens illimités ? »</del>

« Comment traiter des corpus qui grossissent, **avec le budget que j'ai ?** »

<p class="sub">token ≈ un morceau de mot — c'est ce qu'on paie</p>

<!-- Tout le monde rêve de la première question ; tout le monde vit la seconde. -->

---

<!-- class: ch1 -->

<!-- _class: mid ch1 -->

# Les piles qu'on ne lit jamais

<div class="grid2">
<div class="card"><span class="ico">⭐</span><div><b>Avis clients</b><p>Des milliers, notés de 1 à 5, lus en diagonale.</p></div></div>
<div class="card"><span class="ico">🎧</span><div><b>Tickets de support</b><p>Rangés dans une catégorie choisie il y a trois ans.</p></div></div>
<div class="card"><span class="ico">💬</span><div><b>Messages vendeurs</b><p>Ce que vos vendeurs vous écrivent, sans vue d'ensemble.</p></div></div>
<div class="card"><span class="ico">📝</span><div><b>Retours ouverts</b><p>Le champ libre des questionnaires.</p></div></div>
</div>

<!-- Vous avez tous une de ces piles. -->

---

<!-- _class: mid ch1 -->

# Pourquoi ne pas juste demander à un LLM ?

<div class="cols3">
<div class="card"><h3>① Un très gros LLM, tout d'un coup</h3><p><b>Bouché</b> : tout ne tient pas dans le contexte, ce qui rentre est dilué.</p><p class="note">« Tout d'un coup ? Facile. »</p></div>
<div class="card"><h3>② Un gros LLM, sur un échantillon</h3><p><b>Malin, mais aveugle</b> : ce qui n'est pas tiré au sort n'existe pas — les signaux faibles disparaissent.</p><p class="note">« Je vais prendre un échantillon représentatif. »</p></div>
<div class="card"><h3>③ Plein de petits LLM, un par document</h3><p><b>Pas de vue d'ensemble</b> : à la fin, 100 000 résumés, chacun dans ses mots.</p><p class="note">« Si un agent n'y arrive pas, ajoutez-en dix. »</p></div>
</div>

<p class="note">Il existe une quatrième voie : d'abord des petits modèles sur chaque document, puis un gros, sur les groupes.</p>

<!-- Version cartes en attendant l'illustration régénérée (trois colonnes). La colonne ② est ce que font la plupart des outils aujourd'hui. -->

---

<!-- header: '02 · Clio' -->
<!-- class: ch2 -->

<!-- _class: ch2 -->

# Anthropic, décembre 2024 : Clio

<div class="cols3">
<div class="card"><h3>Le problème</h3><p>Des millions de conversations avec Claude. Personne ne peut les lire — et personne ne doit les lire.</p></div>
<div class="card"><h3>Ce qu'ils ont construit</h3><p>Un outil qui dégage les grands usages sans qu'un humain lise les conversations.</p></div>
<div class="card"><h3>La facture</h3><p><b style="font-size:40px">48,81 $</b><br>pour 100 000 conversations</p></div>
</div>

<p class="ref">Tamkin et al., 2024 — Clio, arXiv:2412.13678 · Claude 3 Haiku et Claude 3.5 Sonnet, tarifs 2024</p>

---

<!-- _class: impact ch2 -->

Comprendre tout un corpus<br>**sans le lire en entier.**

<p class="sub">— la promesse de Clio :<br>« without the need for human reviewers to read raw conversations »</p>

---

<!-- _class: ch2 -->

# La recette, en cinq lettres

<div class="secna">
<div class="s cost"><span class="l">S</span><b>Summarise</b><small>préparer chaque document</small></div>
<div class="s"><span class="l">E</span><b>Embed</b><small>projeter le sens</small></div>
<div class="s"><span class="l">C</span><b>Cluster</b><small>regrouper</small></div>
<div class="s cost"><span class="l">N</span><b>Name</b><small>nommer chaque groupe</small></div>
<div class="s"><span class="l">A</span><b>Aggregate</b><small>ranger en niveaux</small></div>
</div>

<p class="note">En rouge, ce qui consomme des tokens (A aussi, un peu : 0,06 $). SECNA : un nom inventé pour ce talk — la recette est celle de Clio.</p>

---

<!-- header: '03 · Les cinq étapes' -->
<!-- class: ch3 -->

<!-- _class: letter ch3 -->

<div class="lt"><div class="big cost">S</div><div class="verb">Summarise<b>préparer la donnée</b></div><div class="mini"><span class="on cost">S</span><span class="">E</span><span class="">C</span><span class="">N</span><span class="">A</span></div></div>
<div class="pic stack"><div class="billbar"><div class="bar"><div class="seg s" style="width:92.2%">S · 45,00 $</div><div class="seg n" style="width:7.7%">N</div><div class="seg" style="width:0.6%"></div></div><div class="legend"><span>La facture de Clio : <b>48,81 $</b> pour 100 000 conversations</span><span>S = <b style="color:var(--red)">92 %</b> · N = 3,75 $ · A = 0,06 $</span></div></div><div class="ba"><div class="t raw">trop nul, colis tjrs pas arrivé apres 10j, et l'appli plante quand je veux suivre la commande. rembourser svp !!!</div><div class="arrow"><span>→</span>petit LLM</div><div class="t"><b>Sujet</b> livraison en retard<br><b>Aussi</b> bug du suivi de commande<br><b>Ton</b> agacé<br><b>Demande</b> remboursement</div></div></div>
<p class="say">Résumer, traduire, effacer la forme, faire ressortir ce qui porte le sens.<span class="ref">Clio, table 3 — 100 000 conversations, tarifs 2024</span></p>
<span class="badge cost">45 $ · 92 %</span>
<!-- Clio extrait quelques attributs par conversation, dont un résumé de la demande — pour la confidentialité et pour choisir l'angle. Optionnel pour vous : GitHub s'en passe. -->

---

<!-- _class: letter ch3 -->

<div class="lt"><div class="big">E</div><div class="verb">Embed<b>projeter le sens</b></div><div class="mini"><span class="">S</span><span class="on">E</span><span class="">C</span><span class="">N</span><span class="">A</span></div></div>
<div class="pic"><div style="width:620px"><svg viewBox="0 0 620 400" width="620" height="360" xmlns="http://www.w3.org/2000/svg" style="font-family:Inter,sans-serif"><defs><radialGradient id="sph" cx="38%" cy="32%" r="75%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#DDE3EC"/></radialGradient></defs><circle cx="310" cy="200" r="185" fill="url(#sph)" style="stroke:var(--frame)" stroke-width="1.5"/><ellipse cx="310" cy="200" rx="185" ry="65" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="65" ry="185" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="185" ry="130" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="130" ry="185" fill="none" style="stroke:var(--rule)" stroke-width="1"/><circle cx="206" cy="139" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="240" cy="129" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="204" cy="134" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="232" cy="148" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="205" cy="119" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="234" cy="140" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="250" cy="147" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="224" cy="134" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="260" cy="132" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="382" cy="126" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="395" cy="140" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="393" cy="140" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="398" cy="146" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="411" cy="142" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="367" cy="148" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="372" cy="138" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="371" cy="140" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="385" cy="142" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="416" cy="275" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="394" cy="259" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="377" cy="281" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="379" cy="277" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="381" cy="264" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="388" cy="266" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="409" cy="269" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="388" cy="275" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="394" cy="268" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="229" cy="269" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="235" cy="278" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="217" cy="263" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="225" cy="275" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="242" cy="265" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="222" cy="274" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="217" cy="271" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="217" cy="265" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="200" cy="266" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="300" cy="205" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="150" cy="200" r="6" style="fill:var(--muted)" opacity=".6"/><circle cx="470" cy="215" r="6" style="fill:var(--muted)" opacity=".6"/><line x1="206" y1="139" x2="120" y2="52" style="stroke:var(--gray)" stroke-width="1"/><circle cx="206" cy="139" r="8" style="fill:var(--accent)"/><text x="40" y="58" font-size="20" font-weight="600" style="fill:var(--ink)">« Colis jamais arrivé »</text><line x1="240" y1="129" x2="120" y2="224" style="stroke:var(--gray)" stroke-width="1"/><circle cx="240" cy="129" r="8" style="fill:var(--accent)"/><text x="40" y="230" font-size="20" font-weight="600" style="fill:var(--ink)">« Livraison en retard »</text><line x1="416" y1="275" x2="520" y2="374" style="stroke:var(--gray)" stroke-width="1"/><circle cx="416" cy="275" r="8" style="fill:var(--accent)"/><text x="440" y="380" font-size="20" font-weight="600" style="fill:var(--ink)">« Super appli ! »</text></svg><p class="line">&nbsp;</p></div></div>
<p class="say">Chaque texte devient un point. Plus deux points sont proches, plus leur sens est proche.</p>
<span class="badge free">quelques centimes — ou en local</span>


---

<!-- _class: letter ch3 -->

<div class="lt"><div class="big">C</div><div class="verb">Cluster<b>regrouper</b></div><div class="mini"><span class="">S</span><span class="">E</span><span class="on">C</span><span class="">N</span><span class="">A</span></div></div>
<div class="pic"><div style="width:620px"><svg viewBox="0 0 620 400" width="620" height="360" xmlns="http://www.w3.org/2000/svg" style="font-family:Inter,sans-serif"><defs><radialGradient id="sph" cx="38%" cy="32%" r="75%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#DDE3EC"/></radialGradient></defs><circle cx="310" cy="200" r="185" fill="url(#sph)" style="stroke:var(--frame)" stroke-width="1.5"/><ellipse cx="310" cy="200" rx="185" ry="65" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="65" ry="185" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="185" ry="130" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="130" ry="185" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="225" cy="135" rx="52" ry="40" fill="none" style="stroke:var(--g1)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="206" cy="139" r="6" style="fill:var(--g1)"/><circle cx="240" cy="129" r="6" style="fill:var(--g1)"/><circle cx="204" cy="134" r="6" style="fill:var(--g1)"/><circle cx="232" cy="148" r="6" style="fill:var(--g1)"/><circle cx="205" cy="119" r="6" style="fill:var(--g1)"/><circle cx="234" cy="140" r="6" style="fill:var(--g1)"/><circle cx="250" cy="147" r="6" style="fill:var(--g1)"/><circle cx="224" cy="134" r="6" style="fill:var(--g1)"/><circle cx="260" cy="132" r="6" style="fill:var(--g1)"/><ellipse cx="395" cy="140" rx="52" ry="40" fill="none" style="stroke:var(--g2)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="382" cy="126" r="6" style="fill:var(--g2)"/><circle cx="395" cy="140" r="6" style="fill:var(--g2)"/><circle cx="393" cy="140" r="6" style="fill:var(--g2)"/><circle cx="398" cy="146" r="6" style="fill:var(--g2)"/><circle cx="411" cy="142" r="6" style="fill:var(--g2)"/><circle cx="367" cy="148" r="6" style="fill:var(--g2)"/><circle cx="372" cy="138" r="6" style="fill:var(--g2)"/><circle cx="371" cy="140" r="6" style="fill:var(--g2)"/><circle cx="385" cy="142" r="6" style="fill:var(--g2)"/><ellipse cx="380" cy="275" rx="52" ry="40" fill="none" style="stroke:var(--g3)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="416" cy="275" r="6" style="fill:var(--g3)"/><circle cx="394" cy="259" r="6" style="fill:var(--g3)"/><circle cx="377" cy="281" r="6" style="fill:var(--g3)"/><circle cx="379" cy="277" r="6" style="fill:var(--g3)"/><circle cx="381" cy="264" r="6" style="fill:var(--g3)"/><circle cx="388" cy="266" r="6" style="fill:var(--g3)"/><circle cx="409" cy="269" r="6" style="fill:var(--g3)"/><circle cx="388" cy="275" r="6" style="fill:var(--g3)"/><circle cx="394" cy="268" r="6" style="fill:var(--g3)"/><ellipse cx="215" cy="270" rx="52" ry="40" fill="none" style="stroke:var(--g4)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="229" cy="269" r="6" style="fill:var(--g4)"/><circle cx="235" cy="278" r="6" style="fill:var(--g4)"/><circle cx="217" cy="263" r="6" style="fill:var(--g4)"/><circle cx="225" cy="275" r="6" style="fill:var(--g4)"/><circle cx="242" cy="265" r="6" style="fill:var(--g4)"/><circle cx="222" cy="274" r="6" style="fill:var(--g4)"/><circle cx="217" cy="271" r="6" style="fill:var(--g4)"/><circle cx="217" cy="265" r="6" style="fill:var(--g4)"/><circle cx="200" cy="266" r="6" style="fill:var(--g4)"/><circle cx="300" cy="205" r="6" style="fill:var(--muted)"/><circle cx="150" cy="200" r="6" style="fill:var(--muted)"/><circle cx="470" cy="215" r="6" style="fill:var(--muted)"/></svg><p class="line">&nbsp;</p></div></div>
<p class="say">Les points proches forment des groupes — sans LLM, du calcul pur.</p>
<span class="badge free">0 $ — sans LLM</span>


---

<!-- _class: letter ch3 -->

<div class="lt"><div class="big cost">N</div><div class="verb">Name<b>nommer chaque groupe</b></div><div class="mini"><span class="">S</span><span class="">E</span><span class="">C</span><span class="on cost">N</span><span class="">A</span></div></div>
<div class="pic"><div style="width:620px"><svg viewBox="0 0 620 400" width="620" height="360" xmlns="http://www.w3.org/2000/svg" style="font-family:Inter,sans-serif"><defs><radialGradient id="sph" cx="38%" cy="32%" r="75%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#DDE3EC"/></radialGradient></defs><circle cx="310" cy="200" r="185" fill="url(#sph)" style="stroke:var(--frame)" stroke-width="1.5"/><ellipse cx="310" cy="200" rx="185" ry="65" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="65" ry="185" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="185" ry="130" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="310" cy="200" rx="130" ry="185" fill="none" style="stroke:var(--rule)" stroke-width="1"/><ellipse cx="225" cy="135" rx="52" ry="40" fill="none" style="stroke:var(--g1)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="206" cy="139" r="6" style="fill:var(--g1)"/><circle cx="240" cy="129" r="6" style="fill:var(--g1)"/><circle cx="204" cy="134" r="6" style="fill:var(--g1)"/><circle cx="232" cy="148" r="6" style="fill:var(--g1)"/><circle cx="205" cy="119" r="6" style="fill:var(--g1)"/><circle cx="234" cy="140" r="6" style="fill:var(--g1)"/><circle cx="250" cy="147" r="6" style="fill:var(--g1)"/><circle cx="224" cy="134" r="6" style="fill:var(--g1)"/><circle cx="260" cy="132" r="6" style="fill:var(--g1)"/><text x="150" y="70" font-size="20" font-weight="800" paint-order="stroke" stroke="#fff" stroke-width="6" stroke-linejoin="round" style="fill:var(--g1)">Retards de livraison</text><ellipse cx="395" cy="140" rx="52" ry="40" fill="none" style="stroke:var(--g2)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="382" cy="126" r="6" style="fill:var(--g2)"/><circle cx="395" cy="140" r="6" style="fill:var(--g2)"/><circle cx="393" cy="140" r="6" style="fill:var(--g2)"/><circle cx="398" cy="146" r="6" style="fill:var(--g2)"/><circle cx="411" cy="142" r="6" style="fill:var(--g2)"/><circle cx="367" cy="148" r="6" style="fill:var(--g2)"/><circle cx="372" cy="138" r="6" style="fill:var(--g2)"/><circle cx="371" cy="140" r="6" style="fill:var(--g2)"/><circle cx="385" cy="142" r="6" style="fill:var(--g2)"/><text x="420" y="70" font-size="20" font-weight="800" paint-order="stroke" stroke="#fff" stroke-width="6" stroke-linejoin="round" style="fill:var(--g2)">Remboursements</text><ellipse cx="380" cy="275" rx="52" ry="40" fill="none" style="stroke:var(--g3)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="416" cy="275" r="6" style="fill:var(--g3)"/><circle cx="394" cy="259" r="6" style="fill:var(--g3)"/><circle cx="377" cy="281" r="6" style="fill:var(--g3)"/><circle cx="379" cy="277" r="6" style="fill:var(--g3)"/><circle cx="381" cy="264" r="6" style="fill:var(--g3)"/><circle cx="388" cy="266" r="6" style="fill:var(--g3)"/><circle cx="409" cy="269" r="6" style="fill:var(--g3)"/><circle cx="388" cy="275" r="6" style="fill:var(--g3)"/><circle cx="394" cy="268" r="6" style="fill:var(--g3)"/><text x="430" y="345" font-size="20" font-weight="800" paint-order="stroke" stroke="#fff" stroke-width="6" stroke-linejoin="round" style="fill:var(--g3)">Bugs de l'appli</text><ellipse cx="215" cy="270" rx="52" ry="40" fill="none" style="stroke:var(--g4)" stroke-width="1.5" stroke-dasharray="5 4"/><circle cx="229" cy="269" r="6" style="fill:var(--g4)"/><circle cx="235" cy="278" r="6" style="fill:var(--g4)"/><circle cx="217" cy="263" r="6" style="fill:var(--g4)"/><circle cx="225" cy="275" r="6" style="fill:var(--g4)"/><circle cx="242" cy="265" r="6" style="fill:var(--g4)"/><circle cx="222" cy="274" r="6" style="fill:var(--g4)"/><circle cx="217" cy="271" r="6" style="fill:var(--g4)"/><circle cx="217" cy="265" r="6" style="fill:var(--g4)"/><circle cx="200" cy="266" r="6" style="fill:var(--g4)"/><text x="120" y="350" font-size="20" font-weight="800" paint-order="stroke" stroke="#fff" stroke-width="6" stroke-linejoin="round" style="fill:var(--g4)">Compte et connexion</text><circle cx="300" cy="205" r="6" style="fill:var(--muted)"/><circle cx="150" cy="200" r="6" style="fill:var(--muted)"/><circle cx="470" cy="215" r="6" style="fill:var(--muted)"/></svg><p class="line"><del>100 000 appels</del> → <b style="color:var(--accent)">des milliers d'appels, un par groupe</b></p></div></div>
<p class="say">Le LLM lit quelques exemples par groupe et lui donne un nom.</p>
<span class="badge cost">3,75 $</span>


---

<!-- _class: letter ch3 -->

<div class="lt"><div class="big">A</div><div class="verb">Aggregate<b>ranger en niveaux</b></div><div class="mini"><span class="">S</span><span class="">E</span><span class="">C</span><span class="">N</span><span class="on">A</span></div></div>
<div class="pic"><svg viewBox="0 0 700 400" width="700" height="400" xmlns="http://www.w3.org/2000/svg" style="font-family:Inter,sans-serif"><rect x="2" y="2" width="376" height="236" rx="6" style="fill:var(--g1)" opacity=".16"/><rect x="2" y="2" width="376" height="236" rx="6" fill="none" style="stroke:var(--g1)" stroke-width="2"/><text x="14" y="24" font-size="20" font-weight="800" style="fill:var(--g1)">Livraison</text><rect x="8" y="34" width="196" height="196" rx="4" fill="#fff" style="stroke:var(--g1)" stroke-width="3" opacity=".95"/><text x="16" y="58" font-size="15" style="fill:var(--ink)">Retards</text><text x="18" y="84" font-size="14" style="fill:var(--gray)">→ 12 groupes fins</text><rect x="218" y="34" width="156" height="96" rx="4" fill="#fff" style="stroke:var(--g1)" stroke-width="1" opacity=".95"/><text x="226" y="58" font-size="15" style="fill:var(--ink)">Colis abîmés</text><rect x="218" y="144" width="156" height="86" rx="4" fill="#fff" style="stroke:var(--g1)" stroke-width="1" opacity=".95"/><text x="226" y="168" font-size="15" style="fill:var(--ink)">Mauvaise adresse</text><rect x="382" y="2" width="316" height="236" rx="6" style="fill:var(--g2)" opacity=".16"/><rect x="382" y="2" width="316" height="236" rx="6" fill="none" style="stroke:var(--g2)" stroke-width="2"/><text x="394" y="24" font-size="20" font-weight="800" style="fill:var(--g2)">Paiement</text><rect x="388" y="34" width="166" height="196" rx="4" fill="#fff" style="stroke:var(--g2)" stroke-width="1" opacity=".95"/><text x="396" y="58" font-size="15" style="fill:var(--ink)">Remboursements</text><rect x="568" y="34" width="126" height="196" rx="4" fill="#fff" style="stroke:var(--g2)" stroke-width="1" opacity=".95"/><text x="576" y="58" font-size="15" style="fill:var(--ink)">Double débit</text><rect x="2" y="242" width="296" height="156" rx="6" style="fill:var(--g3)" opacity=".16"/><rect x="2" y="242" width="296" height="156" rx="6" fill="none" style="stroke:var(--g3)" stroke-width="2"/><text x="14" y="264" font-size="20" font-weight="800" style="fill:var(--g3)">L'appli</text><rect x="8" y="274" width="116" height="116" rx="4" fill="#fff" style="stroke:var(--g3)" stroke-width="1" opacity=".95"/><text x="16" y="298" font-size="15" style="fill:var(--ink)">Plantages</text><rect x="138" y="274" width="156" height="116" rx="4" fill="#fff" style="stroke:var(--g3)" stroke-width="1" opacity=".95"/><text x="146" y="298" font-size="15" style="fill:var(--ink)">Suivi commande</text><rect x="302" y="242" width="266" height="156" rx="6" style="fill:var(--g4)" opacity=".16"/><rect x="302" y="242" width="266" height="156" rx="6" fill="none" style="stroke:var(--g4)" stroke-width="2"/><text x="314" y="264" font-size="20" font-weight="800" style="fill:var(--g4)">Compte</text><rect x="308" y="274" width="116" height="116" rx="4" fill="#fff" style="stroke:var(--g4)" stroke-width="1" opacity=".95"/><text x="316" y="298" font-size="15" style="fill:var(--ink)">Connexion</text><rect x="438" y="274" width="126" height="116" rx="4" fill="#fff" style="stroke:var(--g4)" stroke-width="1" opacity=".95"/><text x="446" y="298" font-size="15" style="fill:var(--ink)">Mot de passe</text><rect x="572" y="242" width="126" height="156" rx="6" style="fill:var(--muted)" opacity=".16"/><rect x="572" y="242" width="126" height="156" rx="6" fill="none" style="stroke:var(--muted)" stroke-width="2"/><text x="584" y="264" font-size="20" font-weight="800" style="fill:var(--muted)">Autres</text></svg></div>
<p class="say">Quelques grands thèmes, des milliers de groupes fins. On zoome, on dézoome.</p>
<span class="badge cost">0,06 $ — un peu de LLM pour nommer les niveaux</span>
<!-- Exemple de Clio : Écriture → rédaction de contenus → contenus pour le référencement. -->

---

<!-- _class: impact ch3 -->

La data science trouve la structure,
**le LLM lui donne du sens.**

---

<!-- header: '04 · Les autres' -->
<!-- class: ch4 -->

<!-- _class: ch4 -->

# Les autres font pareil — une lettre change

<table class="matrix">
<tr><th></th><th class="cost">S</th><th>E</th><th>C</th><th class="cost">N</th><th>A</th><th style="text-align:left">Ce que ça change</th></tr>
<tr><td><b>Clio</b> <small>Anthropic, 2024</small></td><td class="sym">●</td><td class="sym">●</td><td class="sym">●</td><td class="sym">●</td><td class="sym">●</td><td class="take">la référence</td></tr>
<tr><td><b>GitHub</b> <small>juillet 2024</small></td><td class="sym">—</td><td class="sym">●</td><td class="sym">●</td><td class="sym">●</td><td class="sym">◐</td><td class="take">pas de S → le moins cher</td></tr>
<tr><td><b>Google Urania</b> <small>2025</small></td><td class="sym">?</td><td class="sym">●</td><td class="sym">●</td><td class="sym">●</td><td class="sym">●</td><td class="take">+ confidentialité garantie</td></tr>
<tr class="hl"><td><b>LangSmith Insights</b> <small>2025</small></td><td class="sym">●</td><td class="sym">?</td><td class="sym">●</td><td class="sym">●</td><td class="sym">●</td><td class="take">un LLM résume et regroupe → 1 000 traces max</td></tr>
</table>

<p class="legend-line">● oui · — non · ◐ en partie · ? non documenté</p>

<p class="ref">Sources : Clio (arXiv:2412.13678) · GitHub blog, 30/07/2024 · Urania (arXiv:2506.04681) · docs LangSmith Insights</p>

<!-- GitHub, cinq mois avant Clio, sans le citer. LangSmith : un LLM résume chaque trace et un LLM fait le regroupement — d'où le plafond. -->

---

<!-- header: '05 · Le calcul' -->
<!-- class: ch5 -->

# La facture suit les groupes, pas les documents

<div style="display:flex;justify-content:center"><svg viewBox="0 0 980 400" width="980" height="360" xmlns="http://www.w3.org/2000/svg" style="font-family:Inter,sans-serif"><line x1="90" y1="340" x2="940" y2="340" style="stroke:var(--gray)" stroke-width="2"/><line x1="90" y1="340" x2="90" y2="20" style="stroke:var(--gray)" stroke-width="2"/><text x="74" y="180" font-size="17" text-anchor="middle" style="fill:var(--gray)" transform="rotate(-90 74 180)">coût</text><text x="940" y="400" font-size="16" text-anchor="end" style="fill:var(--gray)">documents</text><text x="940" y="30" font-size="15" font-style="italic" text-anchor="end" style="fill:var(--muted)">illustratif</text><line x1="170" y1="340" x2="170" y2="348" style="stroke:var(--gray)" stroke-width="2"/><text x="170" y="372" font-size="19" text-anchor="middle" style="fill:var(--ink)">1 000</text><line x1="390" y1="340" x2="390" y2="348" style="stroke:var(--gray)" stroke-width="2"/><text x="390" y="372" font-size="19" text-anchor="middle" style="fill:var(--ink)">10 000</text><line x1="610" y1="340" x2="610" y2="348" style="stroke:var(--gray)" stroke-width="2"/><text x="610" y="372" font-size="19" text-anchor="middle" style="fill:var(--ink)">100 000</text><line x1="830" y1="340" x2="830" y2="348" style="stroke:var(--gray)" stroke-width="2"/><text x="830" y="372" font-size="19" text-anchor="middle" style="fill:var(--ink)">1 000 000</text><polyline points="170,329 178,329 186,329 194,328 202,328 210,328 218,327 226,327 234,326 242,326 250,325 258,325 266,324 274,323 282,323 290,322 298,321 306,320 314,319 322,318 330,317 338,315 346,314 354,312 362,310 370,308 378,306 386,304 394,302 402,299 410,296 418,293 426,290 434,286 442,282 450,278 458,273 466,268 474,262 482,256 490,249 498,242 506,234 514,226 522,217 530,206 538,196 546,184 554,171 562,157 570,141 578,125 586,106 594,87 602,65 610,42" fill="none" style="stroke:var(--red)" stroke-width="5" stroke-linecap="round"/><polygon points="599,56 621,48 612,28" style="fill:var(--red)"/><text x="584" y="50" font-size="21" font-weight="700" text-anchor="end" style="fill:var(--red)">Le LLM lit chaque document</text><polyline points="170,318 580,314 610,296 890,292" fill="none" style="stroke:var(--accent)" stroke-width="5" stroke-linejoin="round"/><text x="890" y="278" font-size="21" font-weight="700" text-anchor="end" style="fill:var(--accent)">Le LLM lit les groupes</text><text x="618" y="326" font-size="15" style="fill:var(--gray)">+ un niveau de hiérarchie</text></svg></div>

---

# Réservé aux géants ?

<div style="display:flex;justify-content:center"><svg viewBox="0 0 980 400" width="980" height="360" xmlns="http://www.w3.org/2000/svg" style="font-family:Inter,sans-serif"><line x1="90" y1="340" x2="940" y2="340" style="stroke:var(--gray)" stroke-width="2"/><line x1="90" y1="340" x2="90" y2="20" style="stroke:var(--gray)" stroke-width="2"/><text x="74" y="180" font-size="17" text-anchor="middle" style="fill:var(--gray)" transform="rotate(-90 74 180)">coût</text><text x="940" y="400" font-size="16" text-anchor="end" style="fill:var(--gray)">documents</text><text x="940" y="30" font-size="15" font-style="italic" text-anchor="end" style="fill:var(--muted)">illustratif</text><line x1="170" y1="340" x2="170" y2="348" style="stroke:var(--gray)" stroke-width="2"/><text x="170" y="372" font-size="19" text-anchor="middle" style="fill:var(--ink)">1 000</text><line x1="390" y1="340" x2="390" y2="348" style="stroke:var(--gray)" stroke-width="2"/><text x="390" y="372" font-size="19" text-anchor="middle" style="fill:var(--ink)">10 000</text><line x1="610" y1="340" x2="610" y2="348" style="stroke:var(--gray)" stroke-width="2"/><text x="610" y="372" font-size="19" text-anchor="middle" style="fill:var(--ink)">100 000</text><line x1="830" y1="340" x2="830" y2="348" style="stroke:var(--gray)" stroke-width="2"/><text x="830" y="372" font-size="19" text-anchor="middle" style="fill:var(--ink)">1 000 000</text><rect x="130" y="30" width="520" height="310" style="fill:var(--accent)" opacity=".07"/><text x="146" y="100" font-size="20" font-weight="700" style="fill:var(--accent)">votre corpus</text><line x1="830" y1="30" x2="830" y2="340" style="stroke:var(--gray)" stroke-width="1.5" stroke-dasharray="6 5"/><text x="820" y="56" font-size="20" font-weight="700" text-anchor="end" style="fill:var(--gray)">Clio</text><polyline points="170,329 178,329 186,329 194,328 202,328 210,328 218,327 226,327 234,326 242,326 250,325 258,325 266,324 274,323 282,323 290,322 298,321 306,320 314,319 322,318 330,317 338,315 346,314 354,312 362,310 370,308 378,306 386,304 394,302 402,299 410,296 418,293 426,290 434,286 442,282 450,278 458,273 466,268 474,262 482,256 490,249 498,242 506,234 514,226 522,217 530,206 538,196 546,184 554,171 562,157 570,141 578,125 586,106 594,87 602,65 610,42" fill="none" style="stroke:var(--red)" stroke-width="5" stroke-linecap="round"/><polygon points="599,56 621,48 612,28" style="fill:var(--red)"/><text x="584" y="50" font-size="21" font-weight="700" text-anchor="end" style="fill:var(--red)">Le LLM lit chaque document</text><polyline points="170,318 580,314 610,296 890,292" fill="none" style="stroke:var(--accent)" stroke-width="5" stroke-linejoin="round"/><text x="890" y="278" font-size="21" font-weight="700" text-anchor="end" style="fill:var(--accent)">Le LLM lit les groupes</text><text x="618" y="326" font-size="15" style="fill:var(--gray)">+ un niveau de hiérarchie</text></svg></div>

<p class="note">À votre taille, tout lire coûte encore peu — mais ça ne tiendra pas. Le vrai gain : voir ce que vous ne cherchiez pas.</p>

---

<!-- _class: mid ch5 -->

# Chez vous, en moins de 200 lignes

<div class="cols" style="grid-template-columns: 2fr 1fr; align-items:center">
<div><div class="placeholder">Résultat du notebook : les groupes nommés et leur taille, sur un corpus public — à venir (étape 2)</div></div>
<div class="qr"><div class="code">QR code<br>du dépôt</div>github.com/mdussere/secna<br><span style="font-family:var(--text)">corpus public · une commande</span></div>
</div>

<!-- Parcours du notebook déjà exécuté : le résultat d'abord, le code en passant. -->

---

<!-- header: '06 · Ma recette' -->
<!-- class: ch6 -->

<!-- _class: ch6 -->

# Ma recette : sans le S

<p class="note" style="margin:-6px 0 14px">Pas mon invention — celle que j'utilise et que je défends.</p>

<div class="mini" style="margin:0 0 18px"><span class="off">S</span><span class="on">E</span><span class="on">C</span><span class="on cost">N</span><span class="on">A</span></div>

<div class="recipe">
<h3>Pour un corpus qui grossit</h3>
<dl>
<dt>Ingrédients</dt><dd>le texte brut, et son contexte : date, produit, note</dd>
<dt>Étapes</dt><dd>projeter · regrouper · nommer · ranger</dd>
<dt>Astuce</dt><dd>ne pas faire préparer chaque document par un LLM</dd>
<dt>Ce qu'on perd</dt><dd>un peu de finesse sur les textes longs et confus</dd>
<dt>Ce qu'on gagne</dt><dd>une table qu'on filtre par produit, par mois</dd>
</dl>
</div>

<!-- La pâte à crêpes : je ne l'ai pas inventée, je l'ai choisie parce qu'elle est équilibrée et qu'elle tient dans la poêle. -->

---

<!-- _class: mid ch6 -->

# Ces piles, vous pouvez maintenant les lire — sans les lire

<div class="grid2">
<div class="card"><span class="ico">⭐</span><div><b>Avis clients</b><p class="out">→ les vraies raisons des notes basses</p></div></div>
<div class="card"><span class="ico">🎧</span><div><b>Tickets de support</b><p class="out">→ les catégories qui existent vraiment</p></div></div>
<div class="card"><span class="ico">💬</span><div><b>Messages vendeurs</b><p class="out">→ ce qui bloque les vendeurs, regroupé</p></div></div>
<div class="card"><span class="ico">📝</span><div><b>Retours ouverts</b><p class="out">→ ce que les gens disent quand on ne leur demande rien</p></div></div>
</div>

<p class="note">Le RAG ne trouve que ce qu'on sait déjà chercher. Ici, les thèmes émergent.</p>

---

<!-- _class: ch6 -->

# Où ça s'arrête

<table class="matrix">
<tr><th>Limite</th><th style="text-align:left">Ce que j'en fais</th></tr>
<tr><td>La plainte rare se noie dans les grands groupes — Clio le dit lui-même</td><td class="take">une carte du volume, pas une alarme : une veille à part pour les signaux critiques</td></tr>
<tr><td>Petit corpus, ou corpus uniforme : rien à trouver</td><td class="take">sous quelques milliers de textes, demandez au LLM de tout lire</td></tr>
<tr><td>Les noms sont une proposition du LLM</td><td class="take">je relis un échantillon par groupe ; je vérifie qu'ils tiennent d'un passage à l'autre</td></tr>
</table>

---

<!-- header: '07 · Et demain' -->
<!-- class: ch7 -->

<!-- _class: mid ch7 -->

# Demain : les petits modèles

<div style="margin-top:30px"><div class="billbar"><div class="bar"><div class="seg s dim" style="width:92.2%">S · 45,00 $</div><div class="seg n" style="width:7.7%">N</div><div class="seg" style="width:0.6%"></div></div><div class="legend"><span>La facture de Clio : <b>48,81 $</b> pour 100 000 conversations</span><span>S = <b style="color:var(--red)">92 %</b> · N = 3,75 $ · A = 0,06 $</span></div></div></div>

<p style="font-size:28px;margin-top:40px">La seule étape LLM qui grossit avec le corpus — c'est là que chaque baisse de prix tombe en premier.</p>
<p class="note">Quand elle coûtera assez peu, elle reviendra dans ma recette.</p>

<p class="ref">Clio, table 3 — 100 000 conversations, tarifs 2024</p>

---

<!-- _class: impact ch7 -->

Et si on mettait **un agent** dessus ?

<p class="sub">un assistant qui parcourt la carte à votre place</p>

---

<!-- _class: clip ch7 -->

<div class="placeholder" style="width:900px;color:#fff;border-color:#fff">Vidéo, 30 s : une question, une réponse — à venir (étape 3.5)</div>

---

<!-- _class: impact ch7 -->

**Ce sera pour la prochaine fois.**

<p class="sub">La facture suit les groupes, pas les documents.</p>

<div class="qr" style="margin-top:24px"><div class="code">QR code<br>du dépôt</div>Merci · github.com/mdussere/secna</div>
