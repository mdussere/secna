"""Test-only setup: load the repo's `.env`, then fetch the API key from AWS Secrets Manager if it is
missing and `SECNA_SECRET_NAME` names the secret that holds it (after `aws sso login`).
The notebook itself only loads `.env`. See `env.template` at the repo root."""

import os
import pathlib

import pytest
from dotenv import load_dotenv


@pytest.fixture(scope="session", autouse=True)
def env():
    load_dotenv(pathlib.Path(__file__).resolve().parents[1] / ".env", override=False)
    secret = os.getenv("SECNA_SECRET_NAME")
    if not os.getenv("SECNA_API_KEY") and secret:
        import boto3

        profile = os.getenv("AWS_PROFILE") or None
        try:
            sm = boto3.Session(profile_name=profile, region_name=os.getenv("AWS_REGION") or None).client("secretsmanager")
            os.environ["SECNA_API_KEY"] = sm.get_secret_value(SecretId=secret)["SecretString"].strip()
        except Exception as e:  # only the steps that call a model need the key: they fail on their own
            print(f"\n⚠ no API key: cannot read it from AWS Secrets Manager ({type(e).__name__}) — "
                  f"run `aws sso login --profile {profile}`")
