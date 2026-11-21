#!/usr/bin/env node
// Builds the npm package into `dist/`: compiles the `wasm` crate, generates
// its JavaScript bindings with wasm-bindgen, and inlines the WebAssembly as
// base64 so that the package needs no loader configuration.
//
// `node scripts/build.mjs --print-wasm-bindgen-version` prints the
// wasm-bindgen version from Cargo.lock, which the CLI must match.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const bindgenOut = path.join(root, "build", "bindgen");
// Fail the build if the WebAssembly grows past this, so that size regressions
// are deliberate.
const MAX_WASM_BYTES = 100 * 1024;

const lock = fs.readFileSync(path.join(root, "Cargo.lock"), "utf8");
const match = /\nname = "wasm-bindgen"\nversion = "([^"]+)"/.exec(lock);
if (!match) throw new Error("wasm-bindgen isn't in Cargo.lock");
const wasmBindgenVersion = match[1];

if (process.argv.includes("--print-wasm-bindgen-version")) {
  console.log(wasmBindgenVersion);
  process.exit(0);
}

function run(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
}

let installed;
try {
  installed = run("wasm-bindgen", ["--version"]).trim();
} catch {
  installed = "nothing";
}
if (installed !== `wasm-bindgen ${wasmBindgenVersion}`) {
  console.error(
    `Found ${installed}, but Cargo.lock needs wasm-bindgen ${wasmBindgenVersion}. Install it with:\n` +
      `  cargo install --locked wasm-bindgen-cli --version ${wasmBindgenVersion}`,
  );
  process.exit(1);
}

run("cargo", ["build", "--locked", "--release", "--target", "wasm32-unknown-unknown", "--package", "secret-sense-wasm"]);
fs.rmSync(bindgenOut, { recursive: true, force: true });
run("wasm-bindgen", [
  path.join(root, "target", "wasm32-unknown-unknown", "release", "secret_sense_wasm.wasm"),
  "--out-dir", bindgenOut,
  "--out-name", "bindgen",
  "--target", "web",
  // Drops the default `new URL("…_bg.wasm", import.meta.url)`, which bundlers
  // would try to resolve: the module is always passed in.
  "--omit-default-module-path",
  "--no-typescript",
]);

const bindings = fs.readFileSync(path.join(bindgenOut, "bindgen.js"), "utf8");
if (bindings.includes("import.meta") || bindings.includes(".wasm")) {
  throw new Error("The bindings still refer to a separate .wasm file");
}
const wasm = fs.readFileSync(path.join(bindgenOut, "bindgen_bg.wasm"));
if (wasm.length > MAX_WASM_BYTES) {
  throw new Error(`The WebAssembly is ${wasm.length} bytes, over the ${MAX_WASM_BYTES}-byte budget`);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);
fs.writeFileSync(path.join(dist, "bindgen.js"), bindings);
fs.writeFileSync(path.join(dist, "wasm.js"), `export default "${wasm.toString("base64")}";\n`);
for (const file of ["index.js", "index.d.ts"]) {
  fs.copyFileSync(path.join(root, "js", file), path.join(dist, file));
}
console.log(`Built dist/ (WebAssembly: ${wasm.length} bytes)`);
