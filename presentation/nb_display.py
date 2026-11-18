"""SECNA on three months of LangChain pull requests: the copy shown on screen during the talk.

A simplified copy of notebook/test_secna.py + test_secna_langchain.py for a room of non-specialists:
GitHub only, the embedding local only, plain LLM calls, no resuming, no checks. The repository's
notebook is the one that ran (25 October 2026) and stays unchanged; the outputs shown on screen are
that run's. tools/build_cells.py cuts this file at its "# ── Notebook cell:" markers into nb_cells.js.
"""

# ── Notebook cell: imports ─────────────────────────────────────────────────────────────────────────
import os

import pandas as pd
import requests
from openai import OpenAI
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans

# ── Notebook cell: config ──────────────────────────────────────────────────────────────────────────
# Configuration: change REPOS to run it on your own code
REPOS = ["langchain-ai"]                   # a GitHub organisation, or "owner/repository"
SINCE, UNTIL = "2026-07-23", "2026-10-23"  # three months
MODEL = "gpt-6-luna"                       # a small LLM, for N and A
llm = OpenAI()                             # reads OPENAI_API_KEY

# ── Notebook cell: extract ─────────────────────────────────────────────────────────────────────────
# The corpus: every pull request, from GitHub's public API
QUERY = """query($q: String!, $after: String) { search(query: $q, type: ISSUE, first: 50, after: $after) {
  pageInfo { hasNextPage endCursor }
  nodes { ... on PullRequest { repository { name } title body author { login } labels(first: 20) { nodes { name } } } } } }"""


def fetch(source, day):  # one day at a time: a GitHub search returns at most 1,000 results
    q = f"{'repo' if '/' in source else 'org'}:{source} is:pr created:{day}"
    prs, after = [], None
    while True:
        page = requests.post("https://api.github.com/graphql", timeout=60,
                             headers={"Authorization": f"bearer {os.environ['GITHUB_TOKEN']}"},
                             json={"query": QUERY, "variables": {"q": q, "after": after}}).json()["data"]["search"]
        prs += page["nodes"]
        if not page["pageInfo"]["hasNextPage"]:
            return prs
        after = page["pageInfo"]["endCursor"]


days = pd.date_range(SINCE, UNTIL, inclusive="left").strftime("%Y-%m-%d")
prs = [pr for source in REPOS for day in days for pr in fetch(source, day)]
df = pd.DataFrame({"title": [pr["title"] for pr in prs],
                   "repo": [pr["repository"]["name"] for pr in prs],
                   "labels": [", ".join(label["name"] for label in pr["labels"]["nodes"]) for pr in prs],
                   "description": [pr["body"] or "" for pr in prs],
                   "author": [(pr["author"] or {}).get("login") for pr in prs]})
print(f"{len(df):,} pull requests · {df['repo'].nunique()} repositories"
      f" · {df['author'].nunique():,} authors")

# ── Notebook cell: s ───────────────────────────────────────────────────────────────────────────────
# S · Summarise: no LLM, a short text per pull request
df["text"] = ("# " + df["title"] + "\nrepository: " + df["repo"]
              + "\nlabels: " + df["labels"] + "\n\n" + df["description"])

# ── Notebook cell: e ───────────────────────────────────────────────────────────────────────────────
# E · Embed: a small open model, on the laptop's CPU
model = SentenceTransformer("sentence-transformers/LaBSE", device="cpu")
vectors = model.encode(df["text"].tolist(), show_progress_bar=True)
print(f"{len(vectors):,} vectors of {vectors.shape[1]} dimensions")

# ── Notebook cell: c ───────────────────────────────────────────────────────────────────────────────
# C · Cluster: k-means, a classic algorithm
kmeans = KMeans(n_clusters=100, random_state=0).fit(vectors)
df["cluster"] = kmeans.labels_
df["distance"] = kmeans.transform(vectors).min(axis=1)   # to the centre of its cluster
sizes = df["cluster"].value_counts()
print(len(sizes), "clusters · sizes", sizes.min(), "to", sizes.max())

# ── Notebook cell: n ───────────────────────────────────────────────────────────────────────────────
# N · Name: one LLM call per cluster


def ask(prompt):
    return llm.responses.create(model=MODEL, input=prompt).output_text


PROMPT = """Here are the most typical pull requests of one cluster. Give the cluster a name
of 8 to 15 words, then a colon, then what they change, where and why (50 words at most).

"""
names = {}
for c, members in df.groupby("cluster"):
    typical = members.nsmallest(10, "distance")["text"]
    names[c] = ask(PROMPT + "\n\n".join(typical))
    if (c + 1) % 10 == 0:
        print(f"{c + 1}/100 · {names[c].split(':')[0]}")

# ── Notebook cell: a ───────────────────────────────────────────────────────────────────────────────
# A · Aggregate: one single LLM call
PROMPT = """Here are the clusters found in those pull requests. Gather them into
5 to 7 themes, lettered A, B, C… One line per theme: letter | name | its clusters.

"""
answer = ask(PROMPT + "\n".join(f"{c}: {name}" for c, name in names.items()))
theme = {}
for line in answer.splitlines():
    letter, name, clusters = line.split(" | ")
    theme |= {int(c): f"{letter}  {name}" for c in clusters.split(",")}
df["theme"] = df["cluster"].map(theme)
print(df["theme"].value_counts())

# ── Notebook cell: graph ───────────────────────────────────────────────────────────────────────────
# The picture: the themes by size, split by repository
import matplotlib.pyplot as plt  # noqa: E402

top = df["repo"].value_counts().index[:6]
counts = pd.crosstab(df["theme"], df["repo"].where(df["repo"].isin(top), "other"))
counts = counts[[*top, "other"]].loc[counts.sum(axis=1).sort_values().index]
ax = counts.plot.barh(stacked=True, figsize=(11, 6), width=0.6, edgecolor="white")
for y, total in enumerate(counts.sum(axis=1)):
    ax.text(total + 30, y, f"{total:,}  ({total / len(df):.0%})", va="center")
ax.set_title(f"What happened in LangChain: {len(df):,} pull requests, {SINCE} → {UNTIL}", loc="left")
ax.spines[:].set_visible(False)
ax.set_xticks([])
ax.set_ylabel("")
plt.show()
