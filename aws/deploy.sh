#!/bin/bash
set -ex

echo "Deploying to AWS ECS"

set -o allexport
source .env
set +o allexport
docker-compose up