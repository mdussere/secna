# The video's text, in English

> The voice of the presentation, played straight through, in English. It says what the French text says
> ([`video_fr.md`](video_fr.md)) and is written for a video, not translated line by line:
> - short sentences;
> - the verb first;
> - no hedging;
> - one idea, one beat.
>
> The video doesn't change. Voice and picture are not synchronised: each clip starts on its pause. **[clic]**
> marks the end of a clip, 47 in all, the same cuts as the French. Numbers that are read aloud are written in
> words. `python3 scripts/build_segments.py en` → `segments_video_en.json`.

---

## 1. Opening

[Title: *Your corpora keep growing. Your token budget doesn't.*]

We all have a problem we rarely think about: data that keeps growing. Not neat data in a database, with
columns and keys. Text. **[clic]**

[The pile: *Customer reviews · Support tickets · Seller messages · Chat conversations*]

Customer reviews. Support tickets. Seller messages. Conversations. Every one of you has a pile like this
somewhere. And it grows every day.

Nobody reads it. Nobody can. We've had it for years. We store it, we back it up, and we never really look
at it. **[clic]**

[*Nobody reads it all.*]

Nobody reads it all. Yet it's a goldmine. In the years ahead, what sets apart the players of one industry
will be what they get out of these corpora. Not storing them. Understanding them.

So what do we do with this pile? We have three reflexes. **[clic]**

## 2. The three reflexes

[*01 · Give the model everything* — the wall of blocks, the maths]

Reflex one: give the model everything. LLMs are powerful, context windows are huge. Put it all in, and ask.

Do the maths. A million customer reviews, about a hundred tokens each: a hundred million tokens. The largest
context windows take a few million. It doesn't fit.

And even if it did, it would be diluted. No coherent answer comes out of that much text. **[clic]**

[The points, one by one: *Bigger models won't fix it · The stronger they get, the more they write · The pile grows faster*]

Wait for bigger models? That fixes nothing. The stronger models get, the more they write: summaries, agent
traces, pull requests. The more we use them, the bigger the pile. And it grows faster than they do.
**[clic]**

[The first reflex is struck. *02 · Take a sample*]

Reflex two: take a sample. One percent. Read it, or hand it to the model.

A sample only sees the run-of-the-mill: the main signals, what keeps coming back. And the run-of-the-mill
is rarely the interesting part. What isn't drawn doesn't exist. Weak signals vanish. You miss a lot.
**[clic]**

[The second is struck. *03 · One LLM call per document*]

Reflex three: one LLM call per document. Take every review, every ticket, and have the model summarise it.
Useful. A real building block, in fact: we'll meet it again.

But on its own, it goes nowhere. I had a million reviews. Now I have a million descriptions. I won't read a
million descriptions any more than a million reviews. They still don't fit in a context. And I still have no
overview. **[clic]**

[The three reflexes side by side, all struck]

That's where we start. A big corpus. Three naive approaches. None of them works.

So, has anyone solved this? Yes. **[clic]**

## 3. Clio

[*Clio · December 2024 · Anthropic* — the galaxy]

December 2024. Anthropic, the company behind Claude, publishes a research paper on an internal tool called
Clio.

Their problem is ours, only bigger. Millions of conversations with Claude, and one question: what do people
really use it for? Which tasks? Which fields? Far too many conversations to read. And above all, they must
not be read: they're private. **[clic]**

[*Understand a whole corpus without reading all of it.*]

Clio's answer: understand a whole corpus without reading all of it. With a simple recipe in five steps.
Let's call it SECNA, for its five initials. **[clic]**

## 4. The recipe, letter by letter

[S — *Summarise*]

S, for Summarise. That's our third reflex: take each item and cut it down to what carries the meaning. Make
it uniform, easier to digest, and anonymise it on the way. In Clio, a small, light model does it. A
twenty-turn conversation becomes two or three lines: "parcel never arrived, support doesn't answer".
**[clic]**

[E — *Embed*]

E, for Embed. Exactly what we already do for RAG. A small model turns each text into a vector: a point in a
space of a few hundred dimensions. And that projection has one precious property: distance. Two texts that
say the same thing, even in different words, land side by side. "My parcel never arrived." "Still waiting
for my package." Two neighbours. **[clic]**

[C — *Cluster*]

C, for Cluster. With the points in place, we look for the dense regions: where many items say roughly the
same thing. Pure computation. Not a single LLM call.

This is where it all happens. A cluster is concentrated information. When a hundred points, or a thousand,
say the same thing, the model doesn't need to see them all. It needs the cluster: a cluster this big, with
this meaning. **[clic]**

[N — *Name*]

N, for Name. Now the meaning comes back. For each cluster, the LLM reads a few typical examples, the ones at
the centre, and gives it a name and a description. "Refund stuck." "Double charge." "Can't log in." It
doesn't read every message that says the same thing: it reads ten, and names a thousand. **[clic]**

[A — *Aggregate*]

A, for Aggregate. One last call sorts the clusters into a few big themes: delivery, payment, the app. One
level, or several; Clio uses several.

Five letters, two jobs. S, E and C concentrate the information. N and A structure it: they give it meaning,
and a hierarchy that's easy to browse, for a human or for an agent. In our version, the LLM works only
there, in N and A. In Clio, S is an LLM call too. Remember that: it shows up on the bill. **[clic]**

[*A map.* — then *Data science finds the structure.* · *The LLM gives it meaning.*]

What you get is a hierarchical map of your data: from the big themes, down into the clusters, all the way
to the examples themselves. That's the whole balance of SECNA: data science finds the structure, the LLM
gives it meaning. Each does what it does best. **[clic]**

## 5. The bill

[*Clio's published bill · 100,000 conversations · $48.81*]

Clio even publishes its bill: forty-eight dollars and eighty-one cents for a hundred thousand
conversations.

Look where the money goes. Ninety-two percent of it is the S step: one LLM call per conversation. For them,
it's essential. Their conversations are long and go everywhere; each must be boiled down to a nugget of
information before anything else. **[clic]**

[*Short texts: reviews, tickets, PR descriptions* · *S becomes plain code* — $3.81]

But our texts are often short already. A review, a ticket, a pull request description: already focused. S
becomes plain code: paste the title and two or three fields, cut at a maximum length, done. And the bill
drops to three dollars eighty-one. **[clic]**

[The curve: the corpus grows]

Now it gets interesting. Grow the corpus. If the LLM reads every document, the bill follows the corpus: ten
times the documents, ten times the bill. If the LLM reads only the clusters, the bill stays almost flat. It
follows the number of clusters, not the number of documents. **[clic]**

[*The bill follows the clusters, not the documents.*]

That's the title in one line: your corpora keep growing; your token budget doesn't. **[clic]**

## 6. Not an isolated case

[*Urania · LangSmith · Intercom*]

And Clio isn't alone. Google Research published Urania: the same shape, with privacy guarantees on top.
LangSmith, LangChain's observability tool, does it with your agents' traces: it summarises them, clusters
them, and shows you the main usage patterns. And Intercom, a widely used customer-support tool, does it with
support conversations: each one summarised into a few questions, then clustered, named, and sorted into big
topics.

The SECNA shape keeps coming back. That's no accident: it's the shape that scales. **[clic]**

[*Within everyone's reach? Yes.* — the five lines]

So: is this only for Anthropic and Google? Is it within our reach?

Yes. It fits in a few lines: summarise, embed, cluster, name, aggregate. And to prove it, I did it.
**[clic]**

## 7. The notebook

[The notebook scrolls: *84 lines of Python* — the QR code top right]

Here's the notebook. One scroll, top to bottom, so you see the size: the five steps, plus the preparation,
fit in eighty lines of Python, in the simplified version shown here. The QR code stays top right for this
whole part: open the real notebook and run it yourself.

No line-by-line walkthrough. I go through it and tell you what each block does. **[clic]**

[The configuration]

First, the data: every pull request of the LangChain organisation on GitHub, over three months. Every
single one. To run it on your own code, change this one line: put in a public repository you care about.
**[clic]**

[The extraction]

Then we fetch the corpus straight from GitHub's public API. Nearly fifteen thousand pull requests, across a
hundred and thirty-seven repositories, by more than sixteen hundred authors. **[clic]**

[S]

The S step, as promised, costs nothing. Pull requests are short already: I paste the title, the repository,
the labels and the description into a small block of text. Free. **[clic]**

[E]

The E step runs locally, on my laptop's CPU, with an open model. Eleven minutes for fifteen thousand texts.
No API key. No bill. **[clic]**

[C]

The C step is one line: k-means, a classic algorithm. I ask for a hundred clusters; they range from
twenty-two to three hundred and ten pull requests. **[clic]**

[N]

The N step is the first LLM call. One call per cluster, with a short prompt and the ten most typical pull
requests. A hundred calls. **[clic]**

[A]

And the A step is a single call: the model reads the hundred names and sorts them into seven themes.
**[clic]**

[The themes chart]

And here's the result: three months of LangChain, at a glance. Agent products lead, almost a third of the
activity. Then automated dependency upkeep, core reliability, documentation… An organisation of fifteen
thousand pull requests, mapped in eighty lines. **[clic]**

[The notebook's bill: *gpt-6-luna · ~1 million tokens · $0.15*]

The cost? A small model, gpt-6-luna. Naming: about a million tokens, thirteen cents. Aggregating: two cents.
Total: fifteen cents for fifteen thousand pull requests.

Having the LLM read everything would cost a few dollars. On fifteen thousand pull requests, the gap is
small. On a corpus that takes in hundreds of thousands of items a day, it isn't. And above all, one call per
document still wouldn't give me a map. **[clic]**

[The notebook at a glance, in columns]

The notebook at a glance. Eighty lines. One map. Fifteen cents. **[clic]**

## 8. In practice, what does it let us do?

[*In practice, what does it let us do?* — *Prepared data: faster, cheaper, sourced, so more reliable.*]

Now the real question: in practice, what does it let us do?

At heart, it prepares the data. And prepared data changes everything for an LLM: queries get faster,
cheaper, and above all far more reliable, because the model relies on sourced material instead of making
things up. Same as us: faced with a heap of documents, we get nothing out of it; faced with a map, we know
where to look. **[clic]**

[The Microsoft Research quote — GraphRAG. Then: *Search finds what you know is there.* · *A map shows what you didn't know.*]

And there's a deeper difference. Microsoft Research put it in writing: RAG fails on global questions, like
"what are the main themes in this corpus?"

Search is focused: you look for what you know is somewhere. Ask a question, find the answer. A map brings
out what you didn't even know was there.

Keep that in mind: it holds for the three examples that follow. Three readers for this map: you, your
product team, and your agents. **[clic]**

### First reader: you — the voice of your users

[The sources — *What they write to you, and what they say everywhere else.*]

Back to the pile we started with: what your users tell you. What they write to you, in reviews and tickets,
and what they say everywhere else: on social networks, in the app stores, on forums.

We collect all of it because we know there's value inside. But we mostly look for what we already know: we
use it to confirm hunches, not to discover. **[clic]**

[*Nobody reads it all. A sample misses the weak signals.*]

The question nobody asks: what aren't we seeing? Nobody reads it all. At best we sample, and miss the small
nuggets. **[clic]**

[*Everything counted, every month: what rises.* — *Already shipping: Intercom…*]

The map gives a coherent overview, with numbers. No more gut feeling: this share of the messages is about
this topic. You see what appears, what disappears, what rises from one month to the next.

A weak signal, here, is a small cluster: twenty messages that say the same thing, and you see them. And once
the map exists, every new message falls into its cluster by a simple distance calculation. No LLM call.

This isn't science fiction: it's what Intercom does, as we saw. Every day, new conversations are sorted into
topics found by clustering. **[clic]**

### Second reader: your product team — your own AI products

[*Thousands of conversations and agent traces, every day.* · *What do people really do with them?*]

The second pile is the one our own AI tools produce. An assistant or an agent in production means thousands
of conversations and traces, every day.

And again, the question isn't a search question. It's: what do people really do with it? **[clic]**

[*Find the recurring use cases* — *Clio's starting point…*]

The map answers: the tasks that keep coming back, the ones where the agent fails, the ones nobody planned
for. And to industrialise, to automate for real, that's exactly where to start: knowing what people do.

That's Clio's own starting point: understand how an assistant is used, without a single human reading the
conversations. And it's what LangSmith does with your agents' traces. **[clic]**

### Third reader: your agents — the agentic software factory

[*A cycle of agents.* · *All of them keep coming back to the code.*]

The third pile: the code, and everything around it. More and more, LLMs sit at the heart of the development
cycle: one agent plans, another codes, another reviews, another tests. And all of them keep coming back to
the code. They read it, re-read it, and re-read it again. And the more the factory runs, the bigger the
pile: pull requests, commits, files, tests. **[clic]**

[*"What happened in this repository in three months?"* — then *SECNA: the overview of a whole pile.*]

Ask an agent: "What happened in this repository over the last three months?" It has nowhere to look. It
opens files and pull requests, more or less at random.

You've already seen that answer: it's the notebook's map. Fifteen thousand pull requests, seven themes, a
hundred clusters. **[clic]**

[*Computed once, for a few cents. Kept in the agent's memory.*]

That's the piece SECNA brings: the overview of a whole pile. Computed once, for a few cents, and kept in the
agent's memory. **[clic]**

[*Distillation spares your agents from reading, re-reading and re-reading again, at random, your raw data.*]

Distillation spares your agents from reading, re-reading and re-reading again, at random, your raw data. No
more time, and no more tokens, wasted searching for who knows what. **[clic]**

## 9. Conclusion

[*Prepare the data your agents navigate.* — *a map, like SECNA · a graph, like Graphify · files they can grep and find*]

To wrap up. SECNA isn't the only way. GitLab Duo and Graphify build a graph of the code, DeepWiki writes a
wiki for every repository, others pick a rigid taxonomy: well-structured files, where their agents grep and
find.

One thing is certain: effective agents need data, and that data has to be prepared, so they can navigate it
easily. **[clic]**

[*Data science finds the structure. The LLM gives it meaning. The bill follows the structure, not the number of documents.*]

For unstructured corpora, SECNA exists, and it works. Data science finds the structure. The LLM gives it
meaning. And the bill follows the structure, not the number of documents. **[clic]**

[*Thank you.* — the notebook's QR code]

Thank you. The notebook is online, the QR code is right there: try it tomorrow on your own corpus.
