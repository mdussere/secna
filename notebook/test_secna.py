"""The SECNA notebook, one pytest test per notebook cell.

Everything lives in one table, `corpus.parquet`: the extraction creates it, then every step reads
it, drops the columns it is about to write (so a step can be re-run on its own), adds them, and
writes the same file back. Run in order:

  pytest -s test_secna.py                  # every step
  pytest -s test_secna.py -k summarise     # one step
"""

import json
import os
import pathlib
import subprocess

import numpy as np
import pandas as pd
import requests
import tiktoken
from openai import OpenAI
from sklearn.cluster import KMeans
from tqdm import tqdm

# ── Notebook cell: configuration — change REPOS to run it on your own code ───────────────────
# All on GitLab or all on GitHub (no mix). On GitHub, a source is a repository ("github.com/owner/repo")
# or a whole organisation ("github.com/owner").
REPOS = [
    "gitlab.com/gitlab-org/gitlab",                                          # the product
    "gitlab.com/gitlab-org/ops/artifact-registry",                           # package registry
    "gitlab.com/gitlab-org/modelops/applied-ml/code-suggestions/ai-assist",  # the AI assistant's backend
    "gitlab.com/gitlab-org/orbit/knowledge-graph",                           # Orbit, the knowledge graph
    "gitlab.com/gitlab-org/editor-extensions/gitlab-lsp",                    # editor integration
    "gitlab.com/gitlab-org/gitlab-runner",                                   # CI runner
    "gitlab.com/gitlab-org/cli",                                             # command line
]
NAME, TITLE = "gitlab", "GitLab"
SINCE, UNTIL = "2026-07-23", "2026-10-23"  # created in [SINCE, UNTIL)
# Another corpus without editing this file: see test_secna_langchain.py.
REPOS = os.getenv("SECNA_REPOS", ",".join(REPOS)).split(",")
NAME, TITLE = os.getenv("SECNA_NAME", NAME), os.getenv("SECNA_TITLE", TITLE)
SINCE, UNTIL = os.getenv("SECNA_SINCE", SINCE), os.getenv("SECNA_UNTIL", UNTIL)

HOSTS = {r.split("/")[0] for r in REPOS}
assert HOSTS in ({"gitlab.com"}, {"github.com"}), f"all on GitLab or all on GitHub, not {HOSTS}"
GITHUB = HOSTS == {"github.com"}
UNITS = "pull requests" if GITHUB else "merge requests"
DATA = pathlib.Path(__file__).parent / "data" / f"{NAME}_{SINCE}_{UNTIL}"
CORPUS = DATA / "corpus.parquet"
CONTEXT = (f"We are organising every {UNITS[:-1]} created between {SINCE} and {UNTIL} in these {TITLE} "
           f"repositories: {', '.join(REPOS)}, to understand what the organisation does and how it operates.\n")
EMBED_MODEL = os.getenv("SECNA_EMBED_MODEL", "text-embedding-3-large")  # or a local model: "sentence-transformers/LaBSE"
LOCAL_EMBED = EMBED_MODEL.startswith("sentence-transformers/")
NAME_MODEL = os.getenv("SECNA_NAME_MODEL", "gpt-6-luna")  # N — names each cluster
MAX_TOKENS = 8191  # text-embedding-3-large's input limit
BATCH = 32         # merge requests per embedding call (32 × 8,191 stays under 300k tokens per call)


# ── Check: the model endpoint answers (fails — never skips — when the configuration is missing) ──
def test_00_config():
    assert os.getenv("SECNA_API_KEY"), "no SECNA_API_KEY: fill .env (see env.template) or SECNA_SECRET_NAME + aws sso login"
    client = OpenAI(base_url=os.getenv("SECNA_BASE_URL") or None, api_key=os.environ["SECNA_API_KEY"])
    if LOCAL_EMBED:
        from sentence_transformers import SentenceTransformer
        v = SentenceTransformer(EMBED_MODEL, device="cpu").encode(["SECNA configuration check"])
        print(f"local · {EMBED_MODEL} · {v.shape[1]} dimensions · CPU")
    else:
        r = client.embeddings.create(model=EMBED_MODEL, input=["SECNA configuration check"])
        print(f"{'proxy' if os.getenv('SECNA_BASE_URL') else 'api.openai.com'} · {r.model} · {len(r.data[0].embedding)} dimensions · {r.usage.total_tokens} tokens")
        assert len(r.data[0].embedding) == 3072
    assert NAME_MODEL in {m.id for m in client.models.list()}, f"{NAME_MODEL} is not offered by the endpoint"
    r = client.chat.completions.create(model=NAME_MODEL, messages=[{"role": "user", "content": "Answer OK."}])
    info = {}  # a LiteLLM proxy also tells each model's limits; OpenAI itself does not
    if os.getenv("SECNA_BASE_URL"):
        url = os.environ["SECNA_BASE_URL"].rstrip("/").removesuffix("/v1") + "/model/info"
        models = requests.get(url, headers={"Authorization": f"Bearer {os.environ['SECNA_API_KEY']}"}, timeout=30).json()["data"]
        info = next((m["model_info"] for m in models if m["model_name"] == NAME_MODEL), {})
    print(f"{r.model} · answers {r.choices[0].message.content!r} · input limit {info.get('max_input_tokens', '?')} tokens")


# ── Notebook cell: the corpus — every merge or pull request, from GitLab's or GitHub's API ─────
GITLAB_QUERY = """query($repo: ID!, $after: String) { project(fullPath: $repo) {
  mergeRequests(createdAfter: "%s", createdBefore: "%s", first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes { iid webUrl title description state draft createdAt updatedAt mergedAt closedAt
            author { username bot } mergeUser { username } assignees { nodes { username } }
            reviewers { nodes { username } } approvedBy { nodes { username } }
            labels { nodes { title } } milestone { title } sourceBranch targetBranch
            commitCount diffStatsSummary { additions deletions fileCount }
            userNotesCount upvotes downvotes } } } }""" % (SINCE, UNTIL)

GITHUB_QUERY = """query($q: String!, $after: String) { search(query: $q, type: ISSUE, first: 50, after: $after) {
  pageInfo { hasNextPage endCursor }
  nodes { ... on PullRequest { repository { name } number url title body state isDraft
          createdAt updatedAt closedAt mergedAt author { __typename login } labels(first: 20) { nodes { name } }
          additions deletions changedFiles commits { totalCount } comments { totalCount } baseRefName } } } }"""


def extract_gitlab(repo):  # GitLab's public API: no account needed
    mrs, after = [], None
    while True:
        page = requests.post("https://gitlab.com/api/graphql", timeout=60,
                             json={"query": GITLAB_QUERY, "variables": {"repo": repo, "after": after}})
        page = page.json()["data"]["project"]["mergeRequests"]
        mrs += [{"repo": repo, **mr} for mr in page["nodes"]]
        print(f"\r{repo}: {len(mrs):,} merge requests", end="", flush=True)
        if not page["pageInfo"]["hasNextPage"]:
            print()
            return mrs
        after = page["pageInfo"]["endCursor"]


def extract_github(source, day):  # one day at a time: a GitHub search returns at most 1,000 results
    token = os.getenv("GITHUB_TOKEN") or subprocess.run(["gh", "auth", "token"], capture_output=True, text=True).stdout.strip()
    q = f"{'repo' if '/' in source else 'org'}:{source} is:pr created:{day}..{day}"
    prs, after = [], None
    while True:
        page = requests.post("https://api.github.com/graphql", timeout=60, headers={"Authorization": f"bearer {token}"},
                             json={"query": GITHUB_QUERY, "variables": {"q": q, "after": after}})
        page = page.json()["data"]["search"]
        prs += page["nodes"]
        print(f"\r{source} {day}: {len(prs):,} pull requests", end="", flush=True)
        if not page["pageInfo"]["hasNextPage"]:
            return prs
        after = page["pageInfo"]["endCursor"]


def from_github(source, pr):  # a GitHub pull request in the shape of a GitLab merge request
    a = pr["author"]
    return {"repo": source if "/" in source else f"{source}/{pr['repository']['name']}", "iid": pr["number"],
            "webUrl": pr["url"], "title": pr["title"], "description": pr["body"], "draft": pr["isDraft"],
            "state": {"MERGED": "merged", "CLOSED": "closed", "OPEN": "opened"}[pr["state"]],
            **{k: pr[k] for k in ["createdAt", "updatedAt", "mergedAt", "closedAt"]},
            "author": a and {"username": a["login"], "bot": a["__typename"] == "Bot" or a["login"].endswith("[bot]")},
            "labels": {"nodes": [{"title": label["name"]} for label in pr["labels"]["nodes"]]},
            "diffStatsSummary": {"additions": pr["additions"], "deletions": pr["deletions"], "fileCount": pr["changedFiles"]},
            "commitCount": pr["commits"]["totalCount"], "userNotesCount": pr["comments"]["totalCount"],
            "targetBranch": pr["baseRefName"]}


def test_0_extract():
    rows = []
    for source in REPOS:  # cached on disk: a re-run only fetches what is missing
        path = source.split("/", 1)[1]
        if GITHUB:
            print()
            for day in pd.date_range(SINCE, UNTIL, inclusive="left").strftime("%Y-%m-%d"):
                cache = DATA / path.replace("/", "__") / f"{day}.json"
                if not cache.exists():
                    cache.parent.mkdir(parents=True, exist_ok=True)
                    cache.write_text(json.dumps(extract_github(path, day)))
                rows += [from_github(path, pr) for pr in json.loads(cache.read_text())]
        else:
            cache = DATA / f"{path.replace('/', '__')}.json"
            if not cache.exists():
                DATA.mkdir(parents=True, exist_ok=True)
                cache.write_text(json.dumps(extract_gitlab(path)))
            rows += json.loads(cache.read_text())
    df = pd.DataFrame(rows)

    # Flatten: nested objects become plain columns, lists of people become lists of usernames.
    df["author_bot"] = df["author"].map(lambda a: bool(a and a["bot"]))
    for c in {"author", "mergeUser"} & set(df):
        df[c] = df[c].map(lambda a: a["username"] if a else None)
    for c in {"assignees", "reviewers", "approvedBy"} & set(df):  # GitLab only
        df[c] = df[c].map(lambda l: [n["username"] for n in l["nodes"]])
    df["labels"] = df["labels"].map(lambda l: [n["title"] for n in l["nodes"]])
    if "milestone" in df:
        df["milestone"] = df["milestone"].map(lambda m: m["title"] if m else None)
    for k in ["additions", "deletions", "fileCount"]:
        df[k] = df["diffStatsSummary"].map(lambda d: d[k] if d else None)
    df = df.drop(columns="diffStatsSummary")

    # GitLab's scoped labels ("devops::ai coding", "type::maintenance", ...) become one column each.
    scopes = {"type": "type::", "stage": "devops::", "group": "group::", "section": "section::",
              "priority": "priority::", "workflow": "workflow::", "category": "Category:"}
    for col, prefix in scopes.items():
        df[col] = df["labels"].map(lambda ls: next((l[len(prefix):] for l in ls if l.startswith(prefix)), None))
    df["subtype"] = df.apply(lambda r: next((l for l in r["labels"] if isinstance(r["type"], str)
                                             and l.startswith(r["type"] + "::")), None), axis=1)

    for c in ["createdAt", "updatedAt", "mergedAt", "closedAt"]:
        df[c] = pd.to_datetime(df[c], utc=True)
    end = df["mergedAt"].fillna(df["closedAt"]).fillna(pd.Timestamp(UNTIL, tz="UTC"))
    df["age_days"] = (end - df["createdAt"]).dt.total_seconds() / 86400
    df.to_parquet(CORPUS, index=False)
    print(f"{len(df):,} {UNITS} · {df['repo'].nunique()} repositories · {df['author'].nunique():,} authors · {df.shape[1]} columns")


# ── Notebook cell: S — Summarise ─────────────────────────────────────────────────────────────
# One short markdown text per merge request, from what carries meaning: title, repository, who
# made it (human, agent, both, bot), labels, description — cut to the embedding model's limit.
# No LLM here: the description already is a summary.
AGENT_SIGNATURES = (r"(?i)generated with \[?(?:claude|codex|cursor|gemini)|co-authored-by: (?:claude|codex|cursor|gemini)"
                    r"|ai-authored change|generated by gitlab duo|drafted by claude|\.claude/projects")


def test_s_summarise():
    df = pd.read_parquet(CORPUS).drop(columns=["origin", "summary", "summary_tokens"], errors="ignore")
    bot = df["author_bot"] | df["labels"].map(lambda ls: "automation:bot-authored" in ls)
    df["origin"] = np.select(
        [bot & df["author"].str.contains("agent", na=False), bot,
         df["description"].str.contains(AGENT_SIGNATURES, na=False)],
        ["agent", "bot", "human + agent"], "human")
    text = ("# " + df["title"] + "\n\nrepository: " + df["repo"] + "\norigin: " + df["origin"]
            + "\nlabels: " + df["labels"].map(", ".join) + "\n\n" + df["description"].fillna(""))
    enc = tiktoken.get_encoding("cl100k_base")  # OpenAI's embedding tokenizer; a local model also cuts on its own
    tokens = enc.encode_batch(text.tolist())
    df["summary_tokens"] = [len(t) for t in tokens]  # before the cut, to see what the cut removes
    df["summary"] = [enc.decode(t[:MAX_TOKENS]) for t in tokens]
    df.to_parquet(CORPUS, index=False)
    print(df["origin"].value_counts())
    print(df["summary_tokens"].describe(percentiles=[0.5, 0.9, 0.99]).round())
    print(f"{(df['summary_tokens'] > MAX_TOKENS).sum()} summaries cut to {MAX_TOKENS} tokens · "
          f"{df['summary_tokens'].clip(upper=MAX_TOKENS).sum():,} tokens to embed")


# ── Notebook cell: E — Embed ─────────────────────────────────────────────────────────────────
# Every summary becomes a vector, BATCH at a time; the bar shows progress and time remaining.
# Unlike the other steps, E resumes: it only embeds the rows that have no vector yet and saves
# every 50 batches (drop the `embedding` column to start over). A busy endpoint (HTTP 429) is
# retried with a growing wait.
def test_e_embed():
    df = pd.read_parquet(CORPUS)
    if "embedding" not in df:
        df["embedding"] = None
    todo = df.index[df["embedding"].isna()]
    if LOCAL_EMBED:  # a local model on the CPU: no key, no bill; its own bar shows progress and time left
        from sentence_transformers import SentenceTransformer
        vectors = SentenceTransformer(EMBED_MODEL, device="cpu").encode(
            df.loc[todo, "summary"].tolist(), batch_size=BATCH, show_progress_bar=True)
        df.loc[todo, "embedding"] = pd.Series(list(vectors.astype(np.float32)), index=todo)
        df.to_parquet(CORPUS, index=False)
        print(f"{df['embedding'].notna().sum():,} vectors of {vectors.shape[1]} dimensions · {EMBED_MODEL} on the CPU")
    else:  # an embedding API, billed per token
        client = OpenAI(base_url=os.getenv("SECNA_BASE_URL") or None, api_key=os.environ["SECNA_API_KEY"], max_retries=10)
        tokens = 0
        with tqdm(total=len(df), initial=len(df) - len(todo), unit="MR") as bar:
            for n, i in enumerate(range(0, len(todo), BATCH), 1):
                rows = todo[i:i + BATCH]
                r = client.embeddings.create(model=EMBED_MODEL, input=df.loc[rows, "summary"].tolist())
                df.loc[rows, "embedding"] = pd.Series([np.float32(d.embedding) for d in r.data], index=rows)
                tokens += r.usage.total_tokens
                bar.update(len(rows))
                if n % 50 == 0 or i + BATCH >= len(todo):
                    df.to_parquet(CORPUS, index=False)
        print(f"{df['embedding'].notna().sum():,} vectors of {len(df['embedding'].iloc[0])} dimensions · "
              f"{tokens:,} tokens billed this run")


# ── Notebook cell: C — Cluster ───────────────────────────────────────────────────────────────
# K clusters by k-means on the raw vectors — no reduction, one flat level. Each merge request gets
# its cluster and its distance to the cluster's centre: the closest ones are its best examples.
K = 100


def test_c_cluster():
    df = pd.read_parquet(CORPUS).drop(columns=["cluster", "centroid_distance"], errors="ignore")
    X = np.stack(df["embedding"].to_numpy())
    km = KMeans(n_clusters=K, random_state=0).fit(X)
    df["cluster"] = km.labels_
    df["centroid_distance"] = np.linalg.norm(X - km.cluster_centers_[km.labels_], axis=1)
    df.to_parquet(CORPUS, index=False)
    sizes = df["cluster"].value_counts()
    print(f"{K} clusters · sizes {sizes.min()}–{sizes.max()} (median {sizes.median():.0f}) · "
          f"{km.n_iter_} iterations")


# ── Notebook cell: N — Name ──────────────────────────────────────────────────────────────────
# One call per cluster: the model reads the summaries of the NB_SAMPLES merge requests closest to
# the cluster's centre (its most typical ones), after a line of facts about the cluster (size, authors,
# origin, months), and answers a name and a description — what, where, why, and how — in JSON.
NB_SAMPLES = 10
NAME_PROMPT = CONTEXT + f"""The {UNITS} below come from one cluster of that corpus: first the cluster's
facts, then its most typical {UNITS}. Answer in JSON with two fields:
- "name": a name for the cluster, 8 to 15 words;
- "description": 50 words at most, saying what the {UNITS} change, where and why, and how
  they are made: by people, with AI agents or by bots; as one-off changes or as a repeated campaign.
"""


def test_n_name():
    df = pd.read_parquet(CORPUS).drop(columns=["cluster_name", "cluster_description"], errors="ignore")
    client = OpenAI(base_url=os.getenv("SECNA_BASE_URL") or None, api_key=os.environ["SECNA_API_KEY"], max_retries=10)
    names, tokens = {}, 0
    for n, (c, members) in enumerate(df.groupby("cluster"), 1):
        origins = ", ".join(f"{o} {p:.0%}" for o, p in members["origin"].value_counts(normalize=True).items())
        months = ", ".join(f"{m} {k}" for m, k in members["createdAt"].dt.strftime("%Y-%m").value_counts().sort_index().items())
        message = (NAME_PROMPT + f"\nCluster facts: {len(members)} {UNITS} by {members['author'].nunique()} authors;"
                   f" origin: {origins}; created per month: {months}.")
        for summary in members.nsmallest(NB_SAMPLES, "centroid_distance")["summary"]:
            message += "\n\n" + summary
        r = client.chat.completions.create(model=NAME_MODEL, response_format={"type": "json_object"},
                                           messages=[{"role": "user", "content": message}])
        names[c] = json.loads(r.choices[0].message.content)
        tokens += r.usage.total_tokens
        if n % 10 == 0:
            print(f"{n}/{K} clusters named · {tokens:,} tokens · last: {names[c]['name']}", flush=True)
    df["cluster_name"] = df["cluster"].map(lambda c: names[c]["name"])
    df["cluster_description"] = df["cluster"].map(lambda c: names[c]["description"])
    df.to_parquet(CORPUS, index=False)
    print(f"{len(names)} clusters named · {tokens:,} tokens")


# ── Notebook cell: A — Aggregate ─────────────────────────────────────────────────────────────
# One call, the same model thinking harder: it reads every cluster (number, name, description)
# as JSON and gathers them into 5 to 7 themes, lettered A, B, C… so they never mix with the cluster
# numbers.
AGG_EFFORT = "high"
THEME_PROMPT = CONTEXT + f"Below, as JSON, are the clusters found in those {UNITS}. " + """Gather them into 5 to 7 themes:
the main themes of what happened. Every cluster belongs to exactly one theme.

Answer in JSON only, in this format:
{"themes": [{"id": "A", "name": "3 to 8 words", "description": "15 to 30 words",
             "clusters": "comma-separated cluster numbers, e.g. 3, 17, 42"}, ...]}
Letter the themes A, B, C… in order of importance.

Clusters:
"""


def test_a_themes():
    df = pd.read_parquet(CORPUS).drop(columns=["theme", "theme_name", "theme_description"], errors="ignore")
    clusters = df.groupby("cluster")[["cluster_name", "cluster_description"]].first().reset_index()
    clusters.columns = ["cluster", "name", "description"]
    client = OpenAI(base_url=os.getenv("SECNA_BASE_URL") or None, api_key=os.environ["SECNA_API_KEY"], max_retries=10)
    r = client.chat.completions.create(model=NAME_MODEL, reasoning_effort=AGG_EFFORT, response_format={"type": "json_object"},
                                       messages=[{"role": "user", "content": THEME_PROMPT + clusters.to_json(orient="records")}])
    themes = json.loads(r.choices[0].message.content)["themes"]
    of = {int(c): t for t in themes for c in t["clusters"].split(",")}
    df["theme"] = df["cluster"].map(lambda c: of[c]["id"])
    df["theme_name"] = df["cluster"].map(lambda c: of[c]["name"])
    df["theme_description"] = df["cluster"].map(lambda c: of[c]["description"])
    df.to_parquet(CORPUS, index=False)
    print(f"{len(themes)} themes · {r.usage.total_tokens:,} tokens ({r.usage.completion_tokens:,} out, reasoning included)")
    for t in themes:
        print(f"{t['id']} · {t['name']} · {(df['theme'] == t['id']).sum():,} {UNITS} · clusters {t['clusters']}")
    assert set(of) == set(clusters["cluster"]), f"clusters left out: {set(clusters['cluster']) - set(of)}"


# ── Notebook cell: the picture — themes by size, split by repository ──────────────────
COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6"]  # one per repository, largest first


def test_graph():
    import matplotlib.pyplot as plt

    df = pd.read_parquet(CORPUS, columns=["theme", "theme_name", "repo"])
    df["bar"] = df["theme"] + "  " + df["theme_name"]
    top = df["repo"].value_counts().index  # past 7 repositories, the smallest share one "other" colour
    df["repo"] = df["repo"].where(df["repo"].isin(top[:len(COLORS) - (len(top) > len(COLORS))]), "other")
    repos = df["repo"].value_counts().drop("other", errors="ignore").index.tolist() + (["other"] if "other" in set(df["repo"]) else [])
    counts = pd.crosstab(df["bar"], df["repo"])[repos]
    counts = counts.loc[counts.sum(axis=1).sort_values().index]
    fig, ax = plt.subplots(figsize=(11, 0.55 * len(counts) + 2), facecolor="#fcfcfb")
    ax.set_facecolor("#fcfcfb")
    left = np.zeros(len(counts))
    for repo, color in zip(repos, COLORS):
        ax.barh(counts.index, counts[repo], left=left, height=0.6, color=color, edgecolor="#fcfcfb", linewidth=2,
                label=repo.split("/")[-1])
        left += counts[repo]
    for y, total in enumerate(left):
        ax.text(total + left.max() * 0.01, y, f"{total:,.0f}  ({total / len(df):.0%})", va="center", color="#52514e")
    fig.suptitle(f"What happened in {TITLE} — {len(df):,} {UNITS}, {SINCE} → {UNTIL}",
                 x=0.01, ha="left", color="#0b0b0b", fontsize=12)
    ax.legend(loc="lower right", frameon=False, labelcolor="#52514e", title="repository", title_fontsize=9)
    ax.set_xlim(0, left.max() * 1.18)
    ax.tick_params(colors="#52514e", length=0)
    ax.spines[:].set_visible(False)
    ax.set_xticks([])
    fig.tight_layout()
    out = DATA / "themes.png"
    fig.savefig(out, dpi=150)
    print(f"-> {out}")
