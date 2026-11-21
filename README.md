# secret-sense

Guess whether a string is a secret (an API key, a token, a credential) or plain
configuration. Written in Rust, and available on npm as WebAssembly.

> [!WARNING]
> Work in progress: the detection rules aren't implemented yet, and the API
> will change before the first release.

## Rust

```toml
[dependencies]
secret-sense = "0.1"
```

```rust
assert!(!secret_sense::looks_like_secret("https://example.com"));
```

## JavaScript

```sh
npm install secret-sense
```

```js
import { looksLikeSecret } from "secret-sense";

looksLikeSecret("https://example.com"); // false
```

The package is ESM-only and has no dependencies. The WebAssembly is inlined,
so it works in browsers, Node.js and bundlers without configuration.

## License

MIT
