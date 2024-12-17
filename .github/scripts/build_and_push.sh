#!/bin/bash
set -xe

# GIT_REF= #GITHUB_REF
# DOCKER_REGISTRY="your_registry_url" ${{ secrets.XXX }}
# DOCKER_USERNAME="your_docker_username"
# DOCKER_PASSWORD="your_docker_password"

# BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD | sed 's/[^a-zA-Z0-9]/-/g')  # should be the same as GIT_REF
BRANCH_NAME=$(echo "$GIT_REF" | sed 's/[^a-zA-Z0-9]/-/g')
CURRENT_DATE=$(date -u +"%Y%m%d")
CURRENT_TIME=$(date -u +"%H%M%S")
PR_SHA=$(echo "$1" | cut -c1-7)

# Get Git tag if exists
GIT_TAG=$(git describe --tags --exact-match 2>/dev/null || echo "")

DOCKER_TAG="${DOCKER_IMAGE_NAME}:${BRANCH_NAME}"
DOCKER_TAG_WITH_DATE="${DOCKER_IMAGE_NAME}:${BRANCH_NAME}-${CURRENT_DATE}-${CURRENT_TIME}"
DOCKER_TAG_WITH_PR_SHA="${DOCKER_IMAGE_NAME}:pr${PR_SHA}"

# Create additional tag if Git tag exists
if [ -n "$GIT_TAG" ]; then
  DOCKER_TAG_WITH_GIT_TAG="${DOCKER_IMAGE_NAME}:${GIT_TAG}"
fi

mkdir -p kaniko/.docker
echo "{\"auths\":{\"$DOCKER_REGISTRY\":{\"username\":\"$DOCKER_USERNAME\",\"password\":\"$DOCKER_PASSWORD\"}}}" > kaniko/.docker/config.json

docker run --rm -v $(pwd):/workspace -v $(pwd)/kaniko/.cache:/cache -v $(pwd)/kaniko/.docker:/kaniko/.docker \
  gcr.io/kaniko-project/executor:latest \
  --context . \
  --dockerfile "$DOCKERFILE" \
  --destination "$DOCKER_TAG" \
  --destination "$DOCKER_TAG_WITH_DATE" \
  --destination "$DOCKER_TAG_WITH_PR_SHA" \
  $( [ -n "$GIT_TAG" ] && echo "--destination $DOCKER_TAG_WITH_GIT_TAG" ) \
  --cache=true \
  --cache-dir=/cache \
  --use-new-run \
  --single-snapshot \
  --compressed-caching=false \
  --snapshot-mode=redo \
  --use-new-run \
  --cache-repo="$DOCKER_IMAGE_NAME"

echo "Image pushed to registry: $DOCKER_TAG"

if [ -n "$GIT_TAG" ]; then
  echo "Image also tagged with Git tag: $DOCKER_TAG_WITH_GIT_TAG"
fi
