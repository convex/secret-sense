//! WebAssembly bindings for the `secret-sense` npm package. `js/index.d.ts`
//! documents the JavaScript API, so keep it in sync with these exports.

use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = looksLikeSecret)]
#[must_use]
pub fn looks_like_secret(value: &str) -> bool {
    secret_sense::looks_like_secret(value)
}
