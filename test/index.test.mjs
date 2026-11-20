// Tests the built package (`npm run build` first) through its public entry
// point, as a dependent would import it.
import assert from "node:assert/strict";
import test from "node:test";
import { looksLikeSecret } from "secret-sense";

test("plain values are not secrets", () => {
  assert.equal(looksLikeSecret(""), false);
  assert.equal(looksLikeSecret("true"), false);
  assert.equal(looksLikeSecret("https://example.com"), false);
});

test("handles non-ASCII input", () => {
  assert.equal(looksLikeSecret("héllo wörld 🔑"), false);
});
