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

######################## BUILD ###########################

echo "Building production images..."
docker-compose -p $PROJECT_NAME -f docker-compose.yml -f docker-compose.prod.yml build

echo "Running production client image to build static web files..."
docker-compose -p $PROJECT_NAME -f docker-compose.yml -f docker-compose.prod.yml up client

echo "Removing the client container that just finished the build..."
docker-compose -p $PROJECT_NAME -f docker-compose.yml -f docker-compose.prod.yml rm -f client

echo "Rebuild the nginx image to include the built static web files..."
docker-compose -p $PROJECT_NAME -f docker-compose.yml -f docker-compose.prod.yml build nginx
 
######################## PUSH ###########################

# only need to push custom images

docker login -e $REPO_EMAIL -u $REPO_NAME -p $REPO_PWD

echo "Pushing client image..."
docker tag ${PROJECT_NAME}_nginx $REPO_NAME/${PROJECT_NAME}_nginx 
docker push $REPO_NAME/${PROJECT_NAME}_nginx

echo "Pushing server image..."
docker tag ${PROJECT_NAME}_api $REPO_NAME/${PROJECT_NAME}_api
docker push $REPO_NAME/${PROJECT_NAME}_api

echo "Pushing log collector image..."
docker tag ${PROJECT_NAME}_sumologiccollector $REPO_NAME/${PROJECT_NAME}_sumologiccollector
docker push $REPO_NAME/${PROJECT_NAME}_sumologiccollector

######################## DEPLOY ###########################

echo "Try to create a new stack called $PROJECT_NAME in docker cloud if not present..."
docker-cloud stack create --name ${PROJECT_NAME}-stage -f docker-cloud.stage.yml

echo "Update said stack..."
docker-cloud stack update -f docker-cloud.stage.yml ${PROJECT_NAME}-stage

echo "Redeploy all the things..."
docker-cloud stack redeploy ${PROJECT_NAME}-stage