/**
 * Whether `value` looks like a secret (an API key, a token, a credential)
 * rather than plain configuration.
 *
 * Placeholder: always returns `false` until the detection rules land.
 */
export function looksLikeSecret(value: string): boolean;
