#!/bin/bash

bun version-bump.mjs # bump the minor version
new_version=$(bun -e "console.log(require('./package.json').version)")

git add package.json manifest.json versions.json
git commit -m "chore: bump version to $new_version"
git tag -a "$new_version" -m "release $new_version"
git push origin main --tags

