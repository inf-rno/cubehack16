#!/bin/bash

# http://jimhoskins.com/2013/07/27/remove-untagged-docker-images.html
# Remove all untagged images
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")
