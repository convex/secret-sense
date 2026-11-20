# Contributing

## Layout

- `src/`: the `secret-sense` crate, published to crates.io.
- `wasm/`: WebAssembly bindings for the npm package (`secret-sense-wasm`, not
  published).
- `js/`: the npm package's entry point and TypeScript types.
- `scripts/build.mjs`: builds the npm package into `dist/`, with the
  WebAssembly inlined as base64 so that it needs no loader configuration.
- `test/`: tests for the built npm package.

## Development

The toolchain is pinned in `rust-toolchain.toml`. The npm build also needs the
wasm-bindgen CLI at the version in `Cargo.lock`:

```sh
cargo install --locked wasm-bindgen-cli --version "$(node scripts/build.mjs --print-wasm-bindgen-version)"
```

```sh
cargo test --workspace
pnpm install
pnpm build
pnpm test
```

## Releases

The crate and the npm package share a version and a `v<version>` tag.

Include a changeset with changes that need a release:

```sh
pnpm changeset
```

Choose the version bump, describe the user-visible change, and commit the
generated file with your implementation. Docs-only and development-tooling
changes do not need a changeset.

On `main`, the [Update release PR workflow](./.github/workflows/version.yml)
opens a release PR that bumps `package.json` and writes `CHANGELOG.md`.
Changesets doesn't know about `Cargo.toml`, so the workflow then runs
`scripts/sync-version.mjs` on the release PR's branch, pushes the result, and
starts CI on it (pushes made by workflows don't trigger CI on their own).
