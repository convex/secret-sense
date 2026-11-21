//! Guess whether a string is a secret (an API key, a token, a credential) or
//! plain configuration.
//!
//! ```
//! assert!(!secret_sense::looks_like_secret("https://example.com"));
//! ```
//!
//! This is a placeholder: the detection rules aren't implemented yet, and the
//! API will change before the first release.

#![forbid(unsafe_code)]

/// Whether `value` looks like a secret.
///
/// Placeholder: always returns `false` until the detection rules land.
#[must_use]
pub fn looks_like_secret(value: &str) -> bool {
    let _ = value;
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plain_values_are_not_secrets() {
        assert!(!looks_like_secret(""));
        assert!(!looks_like_secret("true"));
        assert!(!looks_like_secret("https://example.com"));
    }
}
