import { initSync, looksLikeSecret } from "./bindgen.js";
import wasm from "./wasm.js";

// The WebAssembly is inlined so that the package works in any bundler or test
// runner without loader configuration. It's compiled synchronously: browsers
// allow that on the main thread for modules under 8 MB, and this one is far
// smaller.
initSync({ module: Uint8Array.from(atob(wasm), (c) => c.charCodeAt(0)) });

export { looksLikeSecret };
