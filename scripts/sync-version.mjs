#!/usr/bin/env node
// Copies package.json's version into Cargo.toml and Cargo.lock. Changesets
// only bumps package.json, and the crate and the npm package share a version
// and a `v<version>` release tag.
//
// With `--check`, changes nothing and fails if the versions differ.

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const { version } = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const files = [
  // The first `version` line is the `[package]` one.
  { file: "Cargo.toml", pattern: /^version = "([^"]*)"$/m, prefix: "" },
  { file: "Cargo.lock", pattern: /^(name = "secret-sense"\n)version = "([^"]*)"$/m, prefix: "$1" },
];

let mismatched = false;
for (const { file, pattern, prefix } of files) {
  const filePath = path.join(root, file);
  const contents = fs.readFileSync(filePath, "utf8");
  const match = pattern.exec(contents);
  if (!match) throw new Error(`No secret-sense version in ${file}`);
  const current = match[match.length - 1];
  if (current === version) continue;
  if (check) {
    console.error(`${file} has version ${current}, but package.json has ${version}`);
    mismatched = true;
  } else {
    fs.writeFileSync(filePath, contents.replace(pattern, `${prefix}version = "${version}"`));
    console.log(`${file}: ${current} -> ${version}`);
  }
}
if (mismatched) {
  console.error("Run `node scripts/sync-version.mjs` and commit the result.");
  process.exit(1);
}
