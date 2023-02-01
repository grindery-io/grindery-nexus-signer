#!/usr/bin/env bash

set -eu

. ./.env

INSTANCE=${1:-$npm_package_name}

export INSTANCE

npm run build

gcloud run deploy $INSTANCE --project $GCP_PROJECT_VAULT --region us-central1 --source .
gcloud run deploy $INSTANCE-dev --project $GCP_PROJECT_DEV --region us-central1 --source .