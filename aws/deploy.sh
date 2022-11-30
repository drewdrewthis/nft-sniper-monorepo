#!/bin/bash
set -ex

echo "Deploying to AWS ECS"

set -o allexport
source .env
set +o allexport

docker context use myecscontext
GIT_SHA=$(git rev-parse HEAD) docker-compose up
docker context use default