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
