import { readFileSync, writeFileSync } from "fs";

// Bump the version in package.json and get the new version
let packageJson = JSON.parse(readFileSync("package.json", "utf8"));
let versionParts = packageJson.version.split(".");
versionParts[1] = parseInt(versionParts[1]) + 1; // increment patch version
const bumpedVersion = versionParts.join(".");
packageJson.version = bumpedVersion;
writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

// read minAppVersion from manifest.json and bump version
let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = bumpedVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));

// update versions.json with bumped version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[bumpedVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, 2));
