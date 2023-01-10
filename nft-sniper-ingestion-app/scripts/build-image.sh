#!/bin/bash
set -ex

GIT_TAG="docker-image-build"
DOCKER_TAG="drewdrewthis/alpha-sniper:ingestion-server"
echo "Building image for remote docker"
docker buildx build --platform=linux/amd64 . -t $DOCKER_TAG && docker push $DOCKER_TAG

echo "Tagging commit"
git tag -a ${GIT_TAG} -m "Docker image: $DOCKER_TAG"

echo "Pushing tag to origin"
git push origin ${GIT_TAG}