#!/usr/bin/env bash

set -eu

. ./.env.deploy

INSTANCE=${1:-$npm_package_name}

export INSTANCE

IMAGE=$GCP_PRIMARY_REGION-docker.pkg.dev/$GCP_PROJECT_VAULT/cloud-run-source-deploy/$INSTANCE
for region in $GCP_PRIMARY_REGION; do 
  gcloud run deploy $INSTANCE --project $GCP_PROJECT_VAULT --region $region --image $IMAGE --set-env-vars "$(cat .env | sed -n -e 'H;${x;s/\n/,/g;s/^,//;p;}' | sed -r 's/,+/,/g;s/^,//;s/,$//')"
done