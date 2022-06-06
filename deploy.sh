#!/usr/bin/env sh

set -e

rm -r -f build

npm run build

rm -r -f ../backend/public/

cp -r -f build/ ../backend/public

cd ../backend/

git add -A
git commit -m 'Build'

git push heroku master