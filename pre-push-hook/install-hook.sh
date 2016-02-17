#!/bin/bash

cd "$(dirname $0)/../"

if [ -f .git/hooks/pre-push ]; then
  mv -v .git/hooks/{pre-push,pre-push.bak}
fi

cp -v pre-push-hook/pre-push .git/hooks/
