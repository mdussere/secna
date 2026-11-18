# The live talk, pause by pause: what I will say, what to change

## Summary

Michaël goes through the 52 numbered pauses of the live presentation, saying what he will say at each one and what he wants changed. The main lines: dense text becomes short bullets; the three reflexes appear one at a time, struck through only when he moves on, then a recap slide with all three struck through; the SECNA letters get explanatory content. The notebook becomes a static, arrow-navigated view of simplified code with call-outs, cut after the chart and with the cost equation back. Part 3 needs restructuring, the limits are dropped, and the talk ends on "the bill follows the structure, not the documents".

## Detailed summary

**Navigation (reported while presenting)**
- The arrows keep the presentation playing: "my pause stops", and it moves on from 12 to 13 by itself.
- He wants a pause between 4 and 5, and autoplay only through an explicit control, never set off by the arrows.

**Opening (1–3)**
- Speaker line: his job title and his employer under the title, to give it more weight.
- "Application logs" could be replaced: logs are not independent semantic items, and he will probably say at the end that SECNA does not fit them best.
- "Text that keeps coming in" is unreadable: make it a touch bigger.
- Message: the corpus grows every day, nobody can read it, and the ability to exploit it will be a competitive edge.

**The three reflexes (4–7)**
- Pause 5 ("Bigger models won't fix it…") is a block of text: turn it into bullets that appear one after another.
- The 01 / 02 / 03 numbers are too small.
- One reflex on screen at a time. A reflex is struck through at the end of its part, when he moves on, not while he is still talking.
- "Take a sample" needs about three points, at the same text size as reflex 1.
- Reflex 3: the animation is too fast, and "necessary, not enough" goes.
- The message for reflex 3: a million descriptions are no more readable than a million items, and still don't fit in a context.
- New slide between 7 and 8: the three approaches side by side, all struck through, as the starting point.

**Clio (8–9)**
- Kept as is: millions of private conversations, too many to read, and the goal of understanding the corpus without reading it.

**SECNA (10–16)**
- Remove "SECNA: the name is mine, the recipe is theirs"; find another sentence to introduce SECNA.
- The vertical outline lettering needs another treatment: the N and the A don't render well.
- These sequences are graphic but poor in content. Each letter needs explanatory bullets on the right, to hook the audience and his own speech.
- "0 tokens" means nothing.
- Framing:
  - S = the third reflex done with a small model;
  - E = a semantic distance (as in RAG);
  - C = dense regions, concentration of information;
  - N = meaning put back;
  - A = structuring, standardising, possibly on several levels.
- Don't explain the history of clustering in data science.

**The bill and the curve (17–19)**
- Clio's $48 is mostly the S step: needed for long, wandering conversations, not for short coherent texts.
- Pause 18 is too written out: the graphic design hurts the message.
- Message: the cost follows the clusters, and is decorrelated from the number of documents.

**Not an isolated case (20–21)**
- Cards: Urania, LangSmith, and a third, either HERCULES (named by its lab) or Kura. "Research" and "Open source" give way to LangSmith.
- Transition: he preferred the short video, which answered "yes, it's within our reach" directly with a few lines of pseudo-code.

**The notebook (22–39)**
- Keep the code sweep (22). Possibly a QR code to the notebook, permanently top right.
- **Navigation:**
  - no zooming in and out;
  - a static vertical view of `test_secna_langchain.py`, scrolled with up and down arrows, with call-out boxes on the right placed where there is little code;
  - a button revealed at the bottom to leave.
- **Code, step by step:**
  - Extraction is shown as already executed.
  - S: a cheap text block (title, repository…).
  - E: local only, the model hard-coded and visible in place, the API branch removed.
  - C: one line, k-means, about a hundred clusters of 22–300.
  - N: a simpler call syntax.
  - A: one call.
- **Pace:** the code shown can be simpler than the repository's, perhaps with a generic GitHub version in the repository. He goes fast and does not explain the code.
- **Cuts:** stop at the chart (34); remove 35–38; keep the overview (39).
- Bring back the cost equation from the short video: €0.15, a small model ("gpt-6-luna"), tokens used.

**What it is for (40–45)**
- Drop the "beyond LangChain" transition. Reframe as "in practice, what does it let us do?"; this part is still light.
- Prepared data makes LLM requests fast, cheap and more reliable (fewer hallucinations, sourced).
- Software factory: Graphify, DeepWiki and GitLab Duo structure the corpus as graphs. That is complementary to clustering, but costlier.
- The GraphRAG quote carries the point: discovering what you didn't know was there, which RAG can't.
- The message is messy and needs structure. The distillation line stays as the message.

**Voice of users (46–48)**
- Feedback is collected but used to confirm hunches, not to discover. Sampling misses weak signals.
- SECNA gives a quantified overview: shares, what appears or disappears, continuity over time.
- The Intercom line is unreadable: one or two bullets, or bubbles.

**Your own AI products (49)**
- Tools produce data at an industrial scale.
- The questions it answers: what users spend time and tokens on, why quotas blow up, whether usage is legitimate.

**End (50–52)**
- Remove the three limits: the 20 minutes will be filled anyway.
- Closing point: whatever you use (SECNA, a graph like Graphify, a rigid file structure agents can grep and find), prepare the data so agents can navigate it.
- Drop the open question. New tagline: "Data science finds the structure, the LLM gives it meaning, the bill follows the structure, not the number of documents."
- "Merci" becomes "Thank you", since everything on screen is in English.

**Asked of Claude**
- A short note on DeepWiki, which he does not know.

## Verbatim

> Translated from spoken French. French wording is kept in parentheses (*"…"*) only where it is ambiguous or a likely mistranscription, with a note on what is meant. The `§` section headers are added by the cleaner for readability. Numbers such as "17/52" are the numbered pauses of the live page.
> Two internal details are replaced by [brackets] for this public repository.
> Speaker: Michaël Dussère · 16 November 2026, 21:27 · 51 min · source: `monologue-20261116_222733` (meeting transcript).

### § 1. The exercise

Right, we're going to go back over the presentation. I'm going to dictate — well, explain it slide by slide, point by point. We have 52 pauses (*"52 postes"*). Each time I'll explain what I'm going to say, what I intend to say on it, so that we go back over all of it and I tell you every element I want to change. So we'll do it with the numbering.

### § 2. Pauses 1–3: the title and the pile

We start: pause 1, the title. "Your corpora keep growing. Your token budget doesn't." Michael Dussère. Probably the title — the title, and then my job title and the company: Senior Solution Architect, [employer]. That will give it a bit more weight (*"de corps"*).

Moving on. We all have data that grows, a pile of data that grows, a corpus of data that grows. Customer reviews, support tickets, seller messages, application logs — if we could change "application logs" to something else, that would suit me, because at the end I'll probably say that logs… We can leave it there. I'll probably say at the end that logs aren't necessarily where a SECNA-type solution fits best, because they're not an independent semantic item. But let's leave that aside.

Fine, so what I'm saying here is that we have our corpus of data that grows every day, nobody looks at it, we can't look at it, we've had it for years and we've never been able to look at it. Just on the form: "Text that keeps coming in" — it's not readable. It's not readable, I don't read it, so maybe a bit bigger. Maybe at the start it could be readable… yes, at the start maybe a touch bigger, but not much.

Every day we have more, and nobody [reads it]. So we have this mass of data, these corpora, which are a wealth, and we don't exploit them. And more and more, my conviction is that this data will be a competitive edge: it's the ability to exploit this data that will set the players of the industry apart.

### § 3. Pauses 4–5: reflex 1, give the model everything

Faced with these growing corpora, we have three reflexes. The first: we give everything to the model. The problem with this approach is that if we have a million reviews at a hundred tokens per review, that's 100,000,000. That doesn't match the context, it doesn't fit. With our context, we can't do it. And even if it fitted, we'd have something very diluted; we wouldn't get coherent results. Even if we go to bigger models, we won't get there anyway, because the bigger the models, the more we'll increase our time (*"on va augmenter notre temps"* — probably "our corpus": the stronger they get, the more they write).

I'd like a pause there. Here I have too much animation without a pause: between 4 and 5 I'd like a pause. I don't know why, but it keeps scrolling even when I navigate with the arrow — when I navigate with the arrow, my pause stops.

5. "Give the model everything", etc. I have a small problem on 5: "Bigger models won't fix it. The stronger they get, the more they write: summaries, agent traces", etc. It's a big block of text and we can't actually read it. It needs bullet points. What is said there needs some structure, with one item appearing after another.

And the 01 — the 01 that says we have three approaches that don't work — that 01 is too small, you can't see it. Same thing: it's good to have 01, 02, 03, but here you can't see it, it's too small.

### § 4. Pause 6: reflex 2, take a sample

So we go to 6. Here the animation isn't right. I'd have said "it doesn't work", I'd have struck it through at 5, and then we move to the second proposal. On 6 I shouldn't see "Give the model everything" any more. And the strike-through should come at the end of my animation. Here "Take a sample" is already struck. When my animation plays, "Take a sample" — I barely have time to talk and it's struck. It should be struck after I've finished talking, when I move on: it gets struck when I leave, when I unblock.

So, "Take a sample": here I don't have enough elements. The previous one had several things — "Bigger models won't fix it", "the stronger they get", etc. — one, two, three points. Here I'd want "Take a sample" the same, with three points. And the text size: the same text size as the 01. So 6/52 should be "02 Take a sample", and I shouldn't see the 01. I still have three reflexes; this is reflex 2, sampling.

We agree that my problem when I talk will be… here I'd need to trigger — well, I don't know. No, not the animation, it'll be fine. We'll leave the animations as they are.

Sampling means we take just a subset of the elements of our whole corpus. The problem with sampling is that we miss the weak signals. We only look at the background, the main signals, and in many corpora the main signals are the run-of-the-mill, what repeats often, etc., and that's not necessarily the most interesting. So sampling isn't very interesting: we miss a lot of things when we sample.

### § 5. Pause 7: reflex 3, and a recap of the three

I switch (*"je balade"*), and there I strike "Take a sample" and move to the third, so I shouldn't see "Take a sample" any more, since I'm on 7/52. "One LLM call per document. Alone: a million descriptions, still no overview." Yes. And "necessary, not enough" — I wouldn't put it. Same thing. I'd say it's good.

So, my animation is too fast. You don't understand the animation. But the two messages we'll make are: I have a million items, so I'll have a million descriptions, and a million descriptions are no more use to me than a million separate items. I won't read a million descriptions any more than I'd read a million items in my corpus. I still have no global view, and having a million summaries doesn't make it fit any better in an LLM context. So that's another dead end.

When I leave here — ah, I didn't get my animation where I strike "One LLM call per document", so we lose that consistency; I liked it.

Here, between 7/52 and 8/52 — Anthropic — I'd put back a slide where you see the three proposals side by side, all three struck through. That lets me set things down: "Here's my starting point: I have my big corpora, I have my three naive approaches, and none of them works."

### § 6. Pauses 8–9: Clio

Small animation, fine. In December 2024, Anthropic presented Clio, a research paper that explains their problem. Their problem: they have millions of conversations, and they want to know why people use Claude. What tasks are done, delegated to Claude? There are millions of conversations, too many, and above all it's private data too: we can't attack them, it's private data we can't just come and exploit like that. So what they propose with Clio is a way to understand the whole corpus without having to read all of it.

### § 7. Pauses 10–16: SECNA, letter by letter

How does it work? They applied a recipe that we can call SECNA. Now, I don't like the SECNA — we're on 10/52 — "SECNA: the name is mine, the recipe is theirs." I don't like it, get rid of it. Maybe — I don't know — something else, a sentence maybe, to say SECNA. Before, we have "Understand a whole corpus without reading all of it": that's their answer. I like it, it's the pause page. We see SECNA written, we see SECNA written vertically, no problem. Just from a presentation point of view, the vertical SECNA in outline lettering (*"le côté vectoriel pas dessiné"*): we need another way of doing it, because the N and the A don't come out well.

Then we take it letter by letter. Summarise. Summarisation is actually the third reflex we presented: taking each element of the corpus and reducing it, homogenising it, making it more digestible, and sometimes anonymising it too. Anthropic's Clio does it with a small LLM — an SLM, a light model.

Their second step is embedding. Embedding is exactly the same thing we use when we do RAG (*"du rail"*), i.e. a projection into… We're on 12, and it's going to move on to 13 by itself. I still have a problem when I navigate with the arrows: it then goes into autoplay. I need something to switch to autoplay that isn't triggered automatically by the arrows.

So here I'll explain that the embedding produces a distance. "Each text becomes a point. Same meaning, side by side." Let's say the embedding introduces a notion of distance: it's a mathematical projection that establishes a semantic distance. Roughly, each point is represented by a vector in a multidimensional space.

Then they do clustering. Clustering means we find — we're on 13 — the dense regions (*"régions de danse"*), and that by pure computation alone. There's a break, a break in meaning, i.e. — here, "Cluster", "0 tokens": "0 tokens" means nothing. It means nothing. Maybe, as we go through the SECNA letters, we could have explanatory elements on the right, bullets, one-two-three for each. These sequences are quite graphic but quite poor in content. I'll have to explain them a lot. It's the core, after all, and little content is shown: "Cluster", "0 tokens". Well, there you go: we find the dense regions, the regions where a large number of the elements of our corpus have exactly the same semantic meaning. I need a bit more — some bullet points to hook the audience, and to hook my own speech too.

Clustering is a concentration, a concentration of information. When we have a hundred points that are very close and say roughly the same thing, there's no point presenting those 100 points, or 1,000 points, to the LLM. It's enough to present the aggregate: tell it we have an aggregate with this semantic meaning, of this size, with this outline.

Then comes the N of SECNA, which is naming. Clio gives each of these clusters a meaning with an LLM. That's where we put meaning back into these aggregates: the LLM can identify that a certain number of items are about "refund stuck", "double charge", "can't log in", etc., and it doesn't need to see yet again all the messages that say the same thing each time.

A is for Aggregate. The secret is fine clustering; we've had a big problem in data science for a very long time… No, I won't explain that. I won't explain it. "We've had a big problem in data science for a very long time" — I especially mustn't explain that.

The aggregate lets us structure the information. Clustering and naming are for concentrating the information; the aggregate is for structuring it, giving it a hierarchical structure that is easier to use, whether by a human or by an agent. I'll explain it like that. Not explaining that before it was hard to tune a clustering, etc. — nobody cares about that, really. Here it's structuring, structuring the information. S, E, C, N: concentration of the information. [A:] structuring of the information. Is that my message? It'll be standardisation of the information — it's also for standardising. So the aggregate is the structuring of the information, and at that level we can have a simple aggregation, but we can also build a multi-level aggregation; in particular, I believe in Clio it was multi-level.

At the end, we have a map. Data science finds the structure, the LLM gives it meaning. And that's it: it's this balance between these technical building blocks that lets us exploit a large number of [documents] very efficiently.

### § 8. Pauses 17–19: the bill and the curve

The economic equation Anthropic gives me in its paper is $48 for 100,000 conversations. But in fact it's $48 — hop, I go back, I'm on 17, 17/52 — it's $48, mostly Summarise: the part where we standardise the context, standardise the items. In their case it's very important, because they can have very long conversations. Like when you compact, etc., they have long conversations that can wander off left and right, so they don't really have well-formed nuggets of information, and so this notion of Summarise matters for them, in the approach they presented in Clio. On the other hand, what we realise is that if we have texts, semantic elements that are short, that are — well, not concentrated, but fairly coherent — we don't necessarily need this first pass, or at least we can do it fully automatically.

So here we're on 18/52: we drop to $3. Imagine that if Clio had skipped this phase, it would go down to $3. Maybe on the form: "A review, a ticket, a pull request description: already short and focused", and "S becomes plain code" on the line below. Here it's too written out. Same thing: too written out, hard to read — hard to read in a presentation when someone is talking at the same time; it's hard for a speaker to pick out, to hang on to the different elements. You have to find the full stop, see the second part, etc. Here the graphic design hurts the message.

What we're saying here is that in a favourable case, the economic equation is even better. And when we put ourselves in those cases, when the corpus grows: in Anthropic's (*"de typique"*) economic equation, the cost is linear in the number of documents. In a SECNA case where we don't pay for — where we don't do — Summarise, the LLM cost depends on the number of clusters, the number of clusters and aggregates. It's completely decorrelated from the number of documents.

### § 9. Pauses 20–21: not an isolated case, and the turn to the code

In fact, this case isn't an isolated case. Clio isn't an isolated solution: Google Research, Urania, it's exactly the same thing. HERCULES, and Kura instead of HERCULES — no, HERCULES. I don't want "Research" and "Open source": I'll put LangSmith in their place — Urania, LangSmith, and the third either HERCULES or Kura. For HERCULES, maybe the research lab is a bit impressive — I don't remember, I think it's Japanese — maybe it has a name that sounds good, so instead of "Research" we could put the name of the research lab directly.

And there you go: this same recipe is taken up by Google, by LangSmith, by the research lab behind HERCULES, by open source. It's taken up in many cases. The question is: can we apply this recipe too, and benefit from it? That's my transition, 21. 21, "Let's open the notebook". I preferred the short video, where we gave the answer directly: is it within our reach? Yes, it's within our reach. And in the short video we had a little pseudo-code with the different… all the few typical lines of code that matched our segment (*"notre segment"* — probably "our SECNA"), and that spoke more.

### § 10. Pauses 22–39: the notebook

Next, 22. We'll go and look at the code. The 22 animation where we sweep the code is very good. It's 126 lines of code, no problem. We could keep the QR code permanently in the top right, maybe, so people can go and look, go and type it, and really realise — have the QR code going straight to the notebook.

The pass: we scroll down, we see there are 126 lines of code. Then the configuration — OK, configuration. Every time we go past something, I think we can put a panel (*"placard"*) with the messages on the right. There's no real need to zoom. Zooming will be hard. The zoom in / zoom out on the lines of code: I think it's not good. I'd prefer something a bit more static, that moves less — you see, that moves less — and that lets us see each of the elements. Maybe even something navigated with up arrow, down arrow: I'm the one who goes up and down. So, no animation at all. Just a vertical element, and up arrow / down arrow lets me navigate, with call-outs on the right — call-outs on the right that show the few message points. We can see it's not really… it's a pseudo-navigation, so you make it as if we were pseudo-navigating in test_secna_langchain.py. We go up and down with right arrow, left arrow (*sic* — up and down meant), and we'll leave with the right-arrow button to move on; for that we'll have to be at the very bottom. Be at the very bottom and either press a button — yes, maybe press a button to get out: at the very bottom of the thing we reveal a button, and we can leave. Have something a bit more interactive: here we're no longer on slides, we're really on something interactive. No zoom in, no zoom in / zoom out on the code: it doesn't look like "I'm looking at a piece of code". The messages in panels on the right — little boxes with a few lines on the right to explain, trying to place them where there isn't too much text.

I'll first explain what data we take, what we'll look at. S… We'll look at PRs. Our example: we took the PRs produced by LangChain over three months, all the PRs, and that's tens of thousands of PRs. Carry on, I scroll down, I show them the few sequences. So, if you wanted to reuse this notebook, you'd just need, for example, to change the repository, put in a public repository that interests you. That's it. No need to detail UNITS, etc. A few words.

Next, we do an extraction, roughly: we just went and fetched the data directly from GitHub. We won't do pseudo-executions, etc. — we won't do pseudo-executions, we'll act as if it had already been executed. Yes — or we do pseudo-executions the first time we go over it? But the zoom out doesn't work, though.

Here, on the S, Summarise part, we clearly say: we'll do it on the cheap; we're on PRs, on things that are fairly restricted, so rather than a summary we'll produce a small block of text with the title, the repository, etc. It costs nothing.

Then, on execution, we do the embedding. The embedding — simplify it for me: local only. Local only; we don't show the code for embedding through an API, etc. It's a simple example, it's local, we use sentence-transformers and the model. The embedding model has to be visible in the same place: we won't scroll back up to show which embedding model we use. So the embedding model is hard-coded; we won't change it. That's it. Same for "if not in df", etc., whatever. I'm not sure — I think it hurts a bit. Already, if we remove the API embedding — we're at 28/52 — if we remove the API embedding it'll be clearer. We do the embedding.

We avoid a zoom in / zoom out on the clustering. Clustering is one line; doing the clustering is one line of Python. So here we'll say: we make clusters, about a hundred clusters, we use a classic algorithm called [k-means], and in a few seconds we get clusters of sizes between 22 and 300 — about a hundred clusters.

Naming: simple, we make a call. A call to what? client.chat.completions.create, model name, blah blah blah. Simplify it a bit so this code is more readable — even if it's a little less generic, more readable. That wouldn't be bad. At least the code shown doesn't necessarily need to be exactly the one in our repository (*"database"*). Or maybe in our repository we'll have test_secna_langchain, which is really LangChain-specific, and a test_secna_github that's a bit more generic. But here we could simplify this code. The point is a presentation, so the code must be as simple as possible.

I'm at 31/52. What we want here is to understand that we just have to make one LLM call. completions.create — you see, I don't even see it. What's this? Why do I have [this chained] "create" — I should have only one create. Why is it like that: "r = client.chat" (*"Airchat"*)? Couldn't I have a slightly simpler syntax, to help readability? That would be a bit better. I want simple, actually: simple, simple, simple, simple. I want this code to be readable in a room that isn't specialists — that isn't specialists. And basically I don't need to — I won't even explain the code. I have to go through it and say: first I do this, so many lines; then this, so many lines; then this, so many lines, etc. I don't explain, I just show; I go into third gear. People are tired and certainly don't want to read code. I'll say clearly that I'm going through it very quickly, that I won't explain code live, that it's very simple code, there are about a hundred lines and that's all, and I should only see the preparation and SECNA.

Hop. Then Aggregate is the same: I'll say I prepare a prompt of a few lines — each time it's so much code, the prompt is so many lines — and that's it, and I move on. I make just one call. My aggregate — I mean, it's just one [call] to do my aggregate.

And I stop, actually — 34/52 — I'll stop on that, on the creation of the chart: that's the result. I did this, I have about a hundred lines, I managed to process (*"dépouiller"*) my dataset of 15,000 pull requests. I managed to process it. And I stop there, I don't continue. I don't continue with "Then count", etc. — that goes. 35/52 goes, 36/52 goes, 37 goes, 38 goes.

39, the overview: very good. The overview, why not — that's my code.

After that, though, what was good in the short presentation is that there was the economic equation — pull these things from the old one. The economic equation matters here, because it was €0.15 — the economic equation was €0.15. So that matters, and we can say clearly that we use a GPT, gpt-6-luna (*"1GPT Luna, 1GPT 6 Luna"*), that it costs nothing, and at the end show the economic equation: how many tokens we used, how much it cost us, etc.

### § 11. Pauses 40–45: what it is for — the agentic software factory

Ah, "What is it for, beyond LangChain?" I don't like this transition slide, 40/52. I don't like this transition slide. It's not "what comes after LangChain?". It's really: in practice, what does it let us do? And that's perhaps the part where we're still a bit light in the presentation.

The agentic factory (*"l'Atlantic Factory"*). Data preparation lets us be efficient. It lets us make LLM requests that are fast, cheap, and above all extremely effective, because they hallucinate much less and rely on sourced elements. It's like us: if we look at a jumble of documents, we get nothing out of it.

First use case: the agentic software factory. More and more, we use LLMs at the heart of the development cycle. And the corpus grows. You have more and more solutions that address this problem, and it's a recurring problem. We see it: you have Graphify, which came out; DeepWiki — you'll add a small note on the side for me, because I don't know DeepWiki — and GitLab Duo, which just came out. All of these are about preparing and structuring the data corpus. As it happens, all these solutions rely on a graph structure, which is quite complementary to what we do with clustered structures. On the other hand, they have a cost. The advantage of [our] approaches is that the costs are very low.

Microsoft Research: "RAG fails on global questions directed at an entire text corpus, such as 'What are the main themes in the dataset?'", etc. The huge advantage of these corpus-wide approaches is that they let things we don't know are there emerge. RAG approaches focus: we go and look for what we know is somewhere. Ask a question, find the answer to that question. [Here] we'll see things emerge that we didn't even know were there. What happened in this corpus? A RAG won't answer that (*"c'est pas un rat"*). There. We need to structure this part a bit — structure it a bit more; the message here is messy. I can see it as I say it.

Distillation: "Distillation spares your agents from reading, re-reading and re-reading again, at random, your raw data." That's the message: data preparation lets agents be efficient and not waste their time and your tokens reading and re-reading the data in search of who knows what.

### § 12. Pauses 46–48: the voice of users

User feedback: it's something we collect because we know there's value in it; but it's something we still struggle to exploit, and often, as with RAG, we look for what we know is in it, and risk missing what we don't know. In fact we use it to confirm hunches, but we don't really use it to discover new things. And that's where approaches like SECNA let us really capitalise fully on these data corpora. Again: nobody reads it in full; at best we subsample, and we miss the weak signals, the little gems.

What SECNA also gives us is a coherent and quantified overview. It's not a feeling (*"ressentiment"*): it's a quantified analysis of the elements; we can say so many percent concern this. We can say whether elements appear, disappear, etc. We can introduce continuity, so that we have a very firm grip on what's in our data corpora.

"Already shipping: Intercom files each day's new conversations into topics found by clustering." This message isn't understandable. This message is too long, not understandable, written the same way. [unclear: *"Plus de 6 mois"*] — it's hard to understand what's being said. It could be one or two bullet points; it could be a message in bubbles, I don't know, but here it's not understandable. The blue text — I'm at 48/52.

### § 13. Pause 49: your own AI products

And finally: the data produced by the tools. Tools produce data industrially (*"à la toque"* — a regionalism for "on an industrial scale"); we produce a phenomenal mass of it. [internal detail removed] We have logs. [unclear: *"savoir quand faire"*] It's impressive. It's the starting point of all these interactions with AI that bring out all this abundance of tool usage. What did your users spend their time and your tokens on? What do they do with the clients? Why did they blow through their quotas again? Those are all questions we ask ourselves, and they're very hard to answer. Was the users' token usage legitimate?

### § 14. Pauses 50–52: no limits, a conclusion

Then, the three limits, to be honest: do we really want to be honest? 50/52. "A map of volume, not an alarm. A rare but serious case can drown in a big cluster", etc. No — I don't have "Where it stops", this last point. I'll remove it, I'll remove it. No need: I think I'll already fill the 20 minutes. I need a conclusion, though.

So 51: "Data science finds the structure. The LLM gives it meaning. The bill follows the clusters, not the documents." And my "One open question: does the map really cut your agents' bill? Nobody has measured it" — nobody cares about that. I'm at 51/52.

My point, my closing point — maybe it's the 50 — is: I don't know if you'll use SECNA, I don't know if you'll use a graph base, I don't know if you'll use a structured approach, a rigid taxonomy, etc. What I know is that if you want effective agents, you have to give them data, and you have to prepare that data so they can navigate it easily. The example can be — yes — Graphify (*"win-win Graph base"*), a graph base. Yes, a rigid structuring as files, well structured as files, in which the agent can do greps and finds. But you have to structure this data. Agents must be able to navigate the data easily.

And that's our conclusion. SECNA is made for unstructured data corpora: data science finds the structures, and LLMs give them meaning. And the cost? The cost follows the structure, not the number of documents. Yes. "The bill follows the clusters, not the documents." "The bill follows the structure, not the documents." "Data science finds the structure, the LLM gives it meaning, the bill follows the structure, not the number of documents." OK — and there we have something I feel comfortable with.

"Merci": instead of a French word, we put "Thank you", because everything was written in English. And that'll do it.
