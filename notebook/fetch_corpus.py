"""Fetch every pull request of a GitHub organisation created over a period -> one parquet.

The corpus of the SECNA notebook: what happened in the `langchain-ai` organisation (all its
repositories, all PR states: merged, closed without merge, open) over three months.

  python3 fetch_corpus.py --org langchain-ai --since 2026-07-23 --until 2026-10-22

Needs the `gh` CLI logged in (any GitHub account: the data is public). Queries the GraphQL
search one day at a time (a search returns at most 1,000 results; pages of 50 —
100 PRs with their bodies makes the API time out with HTTP 502); each day is cached as raw
JSON under data/raw/ so a re-run only fetches the days it is missing (--refresh to re-fetch).
Output: data/prs_<org>_<since>_<until>.parquet.
"""

import argparse
import datetime as dt
import json
import pathlib
import subprocess
import sys
import time

import pandas as pd

DATA = pathlib.Path(__file__).resolve().parent / "data"

QUERY = """
query($q: String!, $after: String) {
  search(query: $q, type: ISSUE, first: 50, after: $after) {
    issueCount
    pageInfo { hasNextPage endCursor }
    nodes { ... on PullRequest {
      repository { name }
      number url title body state isDraft
      createdAt updatedAt closedAt mergedAt
      author { __typename login }
      authorAssociation
      labels(first: 20) { nodes { name } }
      additions deletions changedFiles
      commits { totalCount }
      comments { totalCount }
      reviews { totalCount }
      reviewDecision
      baseRefName
    } }
  }
}"""


def gql(q, after):
    args = ["gh", "api", "graphql", "-f", f"query={QUERY}", "-f", f"q={q}"]
    if after:
        args += ["-f", f"after={after}"]
    for attempt in range(6):
        r = subprocess.run(args, capture_output=True, text=True)
        if r.returncode == 0:
            return json.loads(r.stdout)["data"]["search"]
        time.sleep(15 * (attempt + 1))  # rate limit or transient error: back off
    sys.exit(f"gh api failed on {q!r}: {r.stderr.strip()}")


def fetch_day(org, day):
    q, after, nodes = f"org:{org} is:pr created:{day}..{day}", None, []
    while True:
        page = gql(q, after)
        if page["issueCount"] > 1000:
            sys.exit(f"{day}: {page['issueCount']} PRs, over the search cap — split the day")
        nodes += page["nodes"]
        if not page["pageInfo"]["hasNextPage"]:
            return page["issueCount"], nodes
        after = page["pageInfo"]["endCursor"]


def to_frame(nodes, until):
    df = pd.json_normalize(nodes)
    # A deleted account leaves `author: null`, which json_normalize keeps as its own column.
    df = df.drop(columns=["author"], errors="ignore").rename(columns={
        "repository.name": "repo", "author.login": "author", "author.__typename": "author_type",
        "commits.totalCount": "commits", "comments.totalCount": "comments",
        "reviews.totalCount": "reviews", "labels.nodes": "labels",
    })
    df["labels"] = df["labels"].map(lambda ls: [l["name"] for l in ls])
    for c in ["createdAt", "updatedAt", "closedAt", "mergedAt"]:
        df[c] = pd.to_datetime(df[c], utc=True)
    df["is_bot"] = df["author_type"].eq("Bot") | df["author"].fillna("").str.endswith("[bot]")
    # State as a PM reads it, and age: time to merge / close, or time open so far.
    df["status"] = df["state"].map({"MERGED": "merged", "CLOSED": "closed_unmerged", "OPEN": "open"})
    df.loc[df["status"].eq("open") & df["isDraft"], "status"] = "open_draft"
    end = df["closedAt"].fillna(pd.Timestamp(until + dt.timedelta(days=1), tz="UTC"))
    df["age_days"] = ((end - df["createdAt"]).dt.total_seconds() / 86400).round(2)
    df["body"] = df["body"].fillna("")
    first = ["repo", "number", "status", "title", "body", "createdAt", "age_days", "author", "is_bot"]
    return df[first + [c for c in df.columns if c not in first]].sort_values("createdAt")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--org", default="langchain-ai")
    p.add_argument("--since", type=dt.date.fromisoformat, required=True)
    p.add_argument("--until", type=dt.date.fromisoformat, required=True)
    p.add_argument("--refresh", action="store_true", help="re-fetch days already cached")
    a = p.parse_args()
    t0 = time.time()
    raw = DATA / "raw" / f"{a.org}_{a.since:%Y%m%d}_{a.until:%Y%m%d}"
    raw.mkdir(parents=True, exist_ok=True)
    nodes, day = [], a.since
    while day <= a.until:
        f = raw / f"{day}.json"
        if a.refresh or not f.exists():
            n, day_nodes = fetch_day(a.org, day)
            if len(day_nodes) != n:
                print(f"  warning: {day} expected {n}, got {len(day_nodes)}", file=sys.stderr)
            f.write_text(json.dumps(day_nodes))
            print(f"  {day}: {n} PRs", file=sys.stderr, flush=True)
        nodes += json.loads(f.read_text())
        day += dt.timedelta(days=1)
    df = to_frame(nodes, a.until).drop_duplicates(["repo", "number"])
    out = DATA / f"prs_{a.org}_{a.since:%Y%m%d}_{a.until:%Y%m%d}.parquet"
    df.to_parquet(out, index=False)
    print(f"{len(df):,} PRs · {df['repo'].nunique()} repos · "
          f"{(df['title'].str.len() + df['body'].str.len()).sum():,} characters · "
          f"{out.stat().st_size / 1e6:.1f} MB · {time.time() - t0:.0f} s -> {out}")


if __name__ == "__main__":
    main()
