"""The same notebook on another corpus: every pull request of the `langchain-ai` organisation on
GitHub over three months, embedded on the CPU with a local model (LaBSE) — no embedding bill.

Run it on its own — not in the same pytest call as test_secna.py, whose cells it reuses:

  pytest -s test_secna_langchain.py
  pytest -s test_secna_langchain.py -k cluster
"""

import os
import sys

assert "test_secna" not in sys.modules, "run test_secna_langchain.py in its own pytest call"
os.environ.update(
    SECNA_REPOS="github.com/langchain-ai",           # the whole organisation
    SECNA_NAME="langchain", SECNA_TITLE="LangChain",
    SECNA_SINCE="2026-07-23", SECNA_UNTIL="2026-10-23",
    SECNA_EMBED_MODEL="sentence-transformers/LaBSE",  # the local default of many clustering tools
)

from test_secna import *  # noqa: E402,F401,F403 — the same cells, on this corpus


# ── Notebook cell: who writes the pull requests — bots, people, people signed by an AI agent ────────
# Counted here, not in S: S writes `origin` into the text it embeds, so changing S would move every
# cluster. LangChain's own coding agent signs "Made by Open SWE" — a signature S's rule does not know.
SIGNED = AGENT_SIGNATURES + r"|made by \[?open swe"


def test_who_writes():
    df = pd.read_parquet(CORPUS, columns=["author_bot", "description"])
    who = pd.Series(np.select([df["author_bot"], df["description"].str.contains(SIGNED, na=False)],
                              ["bot", "signed by an AI agent"], "person"))
    print(who.value_counts(normalize=True).map("{:.0%}".format).to_string())
    open_swe = df["description"].str.contains(r"(?i)made by \[?open swe", na=False)
    print(f"Open SWE signs {open_swe[who != 'bot'].mean():.0%} of the {UNITS} opened by people")


# ── Notebook cell: the unexpected — the largest cluster, and the sentence its pull requests share ───
def test_unexpected():
    df = pd.read_parquet(CORPUS, columns=["cluster", "cluster_name", "description", "createdAt"])
    c = df["cluster"].value_counts().idxmax()
    m = df[df["cluster"] == c]
    lines = (m["description"].fillna("").str.replace(r"\[([^\]]*)\]\([^)]*\)", r"\1", regex=True)
             .str.split("\n").explode().str.strip())
    top = lines[lines.str.len() > 40].value_counts()
    months = pd.date_range(SINCE, periods=4, freq=pd.DateOffset(months=1), tz="UTC")
    print(f"cluster {c} · {len(m)} {UNITS} · {m['cluster_name'].iloc[0]}")
    print(f"{top.iloc[0]} of them say: “{top.index[0]}”")
    print("per month:", pd.cut(m["createdAt"], months, right=False).value_counts(sort=False).tolist())


# ── Notebook cell: the next day — its new pull requests, routed to the map: an embedding and a distance, no LLM ─
def test_route():
    df = pd.read_parquet(CORPUS, columns=["cluster", "cluster_name", "embedding"])
    centres = pd.DataFrame(np.stack(df["embedding"].to_numpy())).groupby(df["cluster"]).mean()
    names = df.groupby("cluster")["cluster_name"].first()
    new = pd.DataFrame([from_github(s, pr) for s in (r.split("/", 1)[1] for r in REPOS)
                        for pr in extract_github(s, UNTIL)])       # UNTIL: the first day after the corpus
    bot = new["author"].map(lambda a: bool(a and a["bot"]))
    origin = np.select([bot, new["description"].str.contains(AGENT_SIGNATURES, na=False)], ["bot", "human + agent"], "human")
    text = ("# " + new["title"] + "\n\nrepository: " + new["repo"] + "\norigin: " + origin + "\nlabels: "
            + new["labels"].map(lambda l: ", ".join(n["title"] for n in l["nodes"])) + "\n\n" + new["description"].fillna(""))
    from sentence_transformers import SentenceTransformer
    V = SentenceTransformer(EMBED_MODEL, device="cpu").encode(text.tolist())
    nearest = centres.index[np.linalg.norm(V[:, None] - centres.to_numpy()[None], axis=2).argmin(axis=1)]
    print(f"\n{len(new)} new {UNITS} on {UNTIL}, routed without a single LLM call:")
    for title, c in zip(new["title"], nearest):
        print(f"{title[:58]:58s} → {c:>2} · {names[c][:56]}")
