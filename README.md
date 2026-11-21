# secret-sense

Guess whether a string is a secret (an API key, a token, a credential) or plain
configuration.

> [!WARNING]
> Work in progress: the detection rules aren't implemented yet, and the API
> will change before the first release.

```toml
[dependencies]
secret-sense = "0.1"
```

```rust
assert!(!secret_sense::looks_like_secret("https://example.com"));
```

## License

MIT
