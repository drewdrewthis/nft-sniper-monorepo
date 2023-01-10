#!/bin/bash
set -ex

echo "Deploying to AWS ECS"

set -o allexport
source .env
set +o allexport

docker context use myecscontext
GIT_SHA=$(git rev-parse HEAD) docker-compose up
docker context use default

GIT_TAG="aws-deploy"

echo "Committing changes"
git add . && git commit -m "Deploying to AWS ECS"

echo "Committing changes"
git add . && git commit -m "Deploying to AWS ECS"

echo "Creating tag ${GIT_TAG}"
git tag -a ${GIT_TAG}

echo "Pushing tag to origin"
git push origin ${GIT_TAG}