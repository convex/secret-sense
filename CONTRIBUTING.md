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

Once your PR is open, add its number in parentheses at the end of the first
paragraph of each changeset, for example `(#279)`.

On `main`, the [Update release PR workflow](./.github/workflows/version.yml)
opens a release PR that bumps `package.json` and writes `CHANGELOG.md`.
Changesets doesn't know about `Cargo.toml`, so the workflow then runs
`scripts/sync-version.mjs` on the release PR's branch, pushes the result, and
starts CI on it (pushes made by workflows don't trigger CI on their own).

When the release PR merges, CI tags the commit that set the new version as
`v<version>` and starts the [Release workflow](./.github/workflows/release.yml)
on that tag. To release a different commit, tag it yourself:

```sh
git tag v1.2.3 <commit> && git push origin v1.2.3
```

The tag must match the version. Stable releases must be on `main`. The
workflow builds and tests the tagged commit, stages the npm package, and then
publishes the crate to crates.io.

Review the npm package on npm's **Staged Packages** page and approve it with
2FA, or run:

```sh
npm stage approve <stage-id>
```

## Repository setup

Publishing uses trusted publishing (OIDC) on both registries, so the
repository stores no registry tokens. It needs:

- Two GitHub environments that only allow tags matching `v*`: `release-npm`
  for the npm job and `release-rust` for the crates.io job. Optionally, add
  required reviewers to `release-rust` to approve each crates.io publish (npm
  releases already wait for approval on npm).
- A [trusted publisher](https://crates.io/docs/trusted-publishing) for
  `secret-sense` on crates.io: repository `convex/secret-sense`, workflow
  `release.yml`, environment `release-rust`.
- A [trusted publisher](https://docs.npmjs.com/trusted-publishers) for
  `secret-sense` on npm: repository `convex/secret-sense`, workflow
  `release.yml`, environment `release-npm`.

Both registries only let you add a trusted publisher to a package that exists,
so the first version of each is published by hand.
