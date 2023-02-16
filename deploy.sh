#!/usr/bin/env bash

set -eu

. ./.env.deploy

INSTANCE=${1:-$npm_package_name}

export INSTANCE

npm run build

IMAGE=$GCP_PRIMARY_REGION-docker.pkg.dev/$GCP_PROJECT_VAULT/cloud-run-source-deploy/$INSTANCE
gcloud builds submit --pack image=$IMAGE . --project $GCP_PROJECT_VAULT
for region in $GCP_PRIMARY_REGION; do 
  gcloud run deploy $INSTANCE --project $GCP_PROJECT_VAULT --region $region --image $IMAGE
done
gcloud run deploy $INSTANCE-dev --project $GCP_PROJECT_DEV --region $GCP_PRIMARY_REGION --image $IMAGE