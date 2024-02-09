#!/bin/bash

# Pass an argument to specify the version bump type: patch, minor, or major
version_bump_type=$1 # Accept version bump type as the first script argument

bun version-bump.mjs $version_bump_type
new_version=$(bun -e "console.log(require('./package.json').version)")

git add package.json manifest.json versions.json
git commit -m "chore: bump version to $new_version"
git tag -a "$new_version" -m "release $new_version"
git push origin main --tags
