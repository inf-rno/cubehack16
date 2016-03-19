#!/bin/sh

######################## VARS ###########################

# If you change these then you will also need to update docker-cloud.yml to point to 
# the new repo and images

# name for project, stack, image prefixes etc.
PROJECT_NAME="boilerangularloop"
# image repo to push to
REPO_NAME="m21lab"
REPO_EMAIL="m21lab@macadamian.com"
REPO_PWD="Mac#1234"

######################## DEPLOY ###########################

echo "Try to create a new stack called $PROJECT_NAME in docker cloud if not present..."
docker-cloud stack create --name ${PROJECT_NAME}-prod -f docker-cloud.prod.yml

echo "Update said stack..."
docker-cloud stack update -f docker-cloud.prod.yml ${PROJECT_NAME}-prod

echo "Redeploy all the things..."
docker-cloud stack redeploy ${PROJECT_NAME}-prod
