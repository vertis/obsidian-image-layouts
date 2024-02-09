import { readFileSync, writeFileSync } from "fs";

// Function to bump version based on type
function bumpVersion(version, type) {
  const parts = version.split(".").map(Number);
  switch (type) {
    case "MAJOR":
      parts[0] += 1;
      parts[1] = 0; // reset minor
      parts[2] = 0; // reset patch
      break;
    case "MINOR":
      parts[1] += 1;
      parts[2] = 0; // reset patch
      break;
    case "PATCH":
      parts[2] += 1;
      break;
    default:
      throw new Error(`Unknown version type: ${type}`);
  }
  return parts.join(".");
}

// Assuming versionType is passed as an argument to the script
const versionType = process.argv[2].toUpperCase();

// Bump the version in package.json and get the new version
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const bumpedVersion = bumpVersion(packageJson.version, versionType);
packageJson.version = bumpedVersion;
writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

// read minAppVersion from manifest.json and bump version
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = bumpedVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));

// update versions.json with bumped version and minAppVersion from manifest.json
const versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[bumpedVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, 2));
