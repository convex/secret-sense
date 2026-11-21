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
