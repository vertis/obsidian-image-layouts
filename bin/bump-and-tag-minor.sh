#!/bin/bash

current_version=$(jq -r '.version' package.json)
IFS='.' read -ra ADDR <<< "$current_version"
major=${ADDR[0]}
minor=${ADDR[1]}
patch=${ADDR[2]}

new_minor=$((minor+1))
new_version="$major.$new_minor.$patch"

jq ".version = \"$new_version\"" package.json > temp.json && mv temp.json package.json
git add package.json

# Update manifest.json with the new version
new_min_app_version=$(jq -r '.minAppVersion' manifest.json)
jq ".version = \"$new_version\" | .minAppVersion = \"$new_min_app_version\"" manifest.json > temp_manifest.json && mv temp_manifest.json manifest.json
git add manifest.json

# Update versions.json with the new version and its corresponding minAppVersion
jq ".[\"$new_version\"] = \"$new_min_app_version\"" versions.json > temp_versions.json && mv temp_versions.json versions.json
git add versions.json

git commit -m "chore: bump version to $new_version"
git tag -a "$new_version" -m "release $new_version"
git push origin main --tags

