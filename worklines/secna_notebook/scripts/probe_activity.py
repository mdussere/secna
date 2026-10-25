"""Probe the pull-request activity of candidate repositories over a period (plan Step 1.1).

Two passes, both through the GitHub GraphQL search (via the `gh` CLI, which must be logged in):

  counts   one search per repo and metric -> merged PRs, opened PRs, merged PRs per month
  authors  every merged PR's author (login + bot flag), sharded by week (by day when a week
           exceeds the search cap of 1,000 results) -> distinct authors, bot share, top-10 share

Usage:
  python3 probe_activity.py counts  --since 2026-04-23 --until 2026-10-22 repo [repo ...]
  python3 probe_activity.py authors --since 2026-04-23 --until 2026-10-22 repo [repo ...]

Output: JSON under notebook/data/probe/ (gitignored) and a TSV table on stdout.
"""

import argparse
import collections
import datetime as dt
import json
import pathlib
import subprocess
import sys
import time

OUT = pathlib.Path(__file__).resolve().parents[3] / "notebook" / "data" / "probe"

COUNT_QUERY = "query($q: String!) { search(query: $q, type: ISSUE, first: 0) { issueCount } }"
PAGE_QUERY = """
query($q: String!, $after: String) {
  search(query: $q, type: ISSUE, first: 100, after: $after) {
    issueCount
    pageInfo { hasNextPage endCursor }
    nodes { ... on PullRequest { number author { __typename login } } }
  }
}"""


def gql(query, **variables):
    args = ["gh", "api", "graphql", "-f", f"query={query}"]
    for k, v in variables.items():
        if v is not None:
            args += ["-f", f"{k}={v}"]
    for attempt in range(5):
        r = subprocess.run(args, capture_output=True, text=True)
        if r.returncode == 0:
            return json.loads(r.stdout)["data"]["search"]
        time.sleep(10 * (attempt + 1))  # secondary rate limit: back off and retry
    sys.exit(f"gh api failed: {r.stderr.strip()}")


def count(q):
    return gql(COUNT_QUERY, q=q)["issueCount"]


def months(since, until):
    d = since.replace(day=1)
    while d <= until:
        nxt = (d + dt.timedelta(days=32)).replace(day=1)
        yield max(d, since), min(nxt - dt.timedelta(days=1), until)
        d = nxt


def windows(since, until, width):
    d = since
    while d <= until:
        yield d, min(d + dt.timedelta(days=width - 1), until)
        d += dt.timedelta(days=width)


def counts(repo, since, until):
    span = f"{since}..{until}"
    return {
        "repo": repo,
        "merged": count(f"repo:{repo} is:pr is:merged merged:{span}"),
        "opened": count(f"repo:{repo} is:pr created:{span}"),
        "merged_per_month": {
            f"{a:%Y-%m}": count(f"repo:{repo} is:pr is:merged merged:{a}..{b}")
            for a, b in months(since, until)
        },
    }


def fetch_window(repo, a, b, prs):
    q, after = f"repo:{repo} is:pr is:merged merged:{a}..{b}", None
    while True:
        page = gql(PAGE_QUERY, q=q, after=after)
        if page["issueCount"] > 1000 and a < b:  # over the search cap: split by day
            for d, _ in windows(a, b, 1):
                fetch_window(repo, d, d, prs)
            return
        for n in page["nodes"]:
            a_ = n.get("author") or {"__typename": "Ghost", "login": "ghost"}
            prs[n["number"]] = (a_["login"], a_["__typename"] == "Bot" or a_["login"].endswith("[bot]"))
        if not page["pageInfo"]["hasNextPage"]:
            return
        after = page["pageInfo"]["endCursor"]


def authors(repo, since, until):
    prs = {}
    for a, b in windows(since, until, 7):
        fetch_window(repo, a, b, prs)
    humans = collections.Counter(login for login, bot in prs.values() if not bot)
    n = len(prs)
    n_bot = sum(bot for _, bot in prs.values())
    top10 = sum(c for _, c in humans.most_common(10))
    return {
        "repo": repo,
        "merged_fetched": n,
        "bot_prs": n_bot,
        "bot_share": round(n_bot / n, 3) if n else None,
        "human_authors": len(humans),
        "top10_share_of_human_prs": round(top10 / (n - n_bot), 3) if n > n_bot else None,
        "one_pr_authors": sum(1 for c in humans.values() if c == 1),
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("mode", choices=["counts", "authors"])
    p.add_argument("--since", type=dt.date.fromisoformat, required=True)
    p.add_argument("--until", type=dt.date.fromisoformat, required=True)
    p.add_argument("repos", nargs="+")
    a = p.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    fn = counts if a.mode == "counts" else authors
    rows = []
    for repo in a.repos:
        row = fn(repo, a.since, a.until)
        rows.append(row)
        print("\t".join(str(v) for v in row.values()), flush=True)
    out = OUT / f"{a.mode}_{a.since:%Y%m%d}_{a.until:%Y%m%d}.json"
    out.write_text(json.dumps(rows, indent=2))
    print(f"-> {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
