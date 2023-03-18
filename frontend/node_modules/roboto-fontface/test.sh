#!/bin/bash -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "less mixins.less"
lessc "$DIR/css/mixins.less" >/dev/null

echo "sass mixins.scss"
node-sass "$DIR/css/mixins.scss" >/dev/null

for FILE in $DIR/css/*/less/*.less; do
  echo "less $FILE"
  lessc "$FILE" >/dev/null
done

for FILE in $DIR/css/*/sass/*.scss; do
  echo "sass $FILE"
  node-sass "$FILE" >/dev/null
done
