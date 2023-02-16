#!/usr/bin/env bash

set -eu

. ./.env.deploy

INSTANCE=${1:-$npm_package_name}

export INSTANCE

gcloud run services describe $INSTANCE --region $GCP_PRIMARY_REGION --project $GCP_PROJECT_VAULT --format json | jq -r '.spec.template.spec.containers[0].env | map("\(.name)=\(.value)") | .[]'
