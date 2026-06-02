/**
 * API Key Pooling Utility
 * Round-robin fallback across Emergent + Stitch keys.
 * If a key is rate-limited/exhausted → automatically promote the next key.
 */

interface KeyEntry {
  key: string;
  provider: "emergent" | "stitch";
  exhausted: boolean;
  failCount: number;
  lastUsed: number;
}

const EMERGENT_KEYS = [
  "sk-emergent-5Ed294d8f78Da601a0",
  "sk-emergent-368Fe58C339Da068d3",
  "sk-emergent-7C454E8C099B96e640",
  "sk-emergent-cAcD0C4F94547Bc12B",
  "sk-emergent-608F41a3e63D53875F",
];

const STITCH_KEYS = [
  "AQ.Ab8RN6JfsV3b7SKVUc1OB2xPcJevsjhOrKstWvGSeS4IbVn6jA",
];

const keyPool: KeyEntry[] = [
  ...STITCH_KEYS.map((k) => ({
    key: k,
    provider: "stitch" as const,
    exhausted: false,
    failCount: 0,
    lastUsed: 0,
  })),
  ...EMERGENT_KEYS.map((k) => ({
    key: k,
    provider: "emergent" as const,
    exhausted: false,
    failCount: 0,
    lastUsed: 0,
  })),
];

let currentIndex = 0;

/** Returns the next available (non-exhausted) key entry */
export function getNextKey(provider?: "emergent" | "stitch"): KeyEntry | null {
  const pool = provider ? keyPool.filter((k) => k.provider === provider) : keyPool;
  const available = pool.filter((k) => !k.exhausted);

  if (available.length === 0) {
    // Reset all after 60 seconds cooldown
    const now = Date.now();
    pool.forEach((k) => {
      if (now - k.lastUsed > 60_000) {
        k.exhausted = false;
        k.failCount = 0;
      }
    });
    return pool.find((k) => !k.exhausted) ?? null;
  }

  // Least recently used selection
  available.sort((a, b) => a.lastUsed - b.lastUsed);
  const selected = available[0];
  selected.lastUsed = Date.now();
  return selected;
}

/** Mark a key as failed. After 3 failures → mark exhausted */
export function markKeyFailed(key: string): void {
  const entry = keyPool.find((k) => k.key === key);
  if (!entry) return;
  entry.failCount++;
  if (entry.failCount >= 3) {
    entry.exhausted = true;
    console.warn(`[APIPool] Key ...${key.slice(-8)} exhausted → switching to next`);
  }
}

/** Mark key as successful — reset fail count */
export function markKeySuccess(key: string): void {
  const entry = keyPool.find((k) => k.key === key);
  if (entry) entry.failCount = 0;
}

/**
 * Wrapper: calls your async fn with a key, retries with next key on failure
 * @example
 *   const result = await withKeyFallback("emergent", async (key) => {
 *     return fetch("https://api.emergent.sh/...", { headers: { Authorization: `Bearer ${key}` } })
 *   });
 */
export async function withKeyFallback<T>(
  provider: "emergent" | "stitch" | undefined,
  fn: (key: string) => Promise<T>,
  maxRetries = 6
): Promise<T> {
  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < maxRetries) {
    const entry = getNextKey(provider);
    if (!entry) throw new Error("[APIPool] All API keys exhausted");

    try {
      const result = await fn(entry.key);
      markKeySuccess(entry.key);
      return result;
    } catch (err: any) {
      lastError = err;
      const isRateLimit =
        err?.status === 429 ||
        err?.message?.includes("rate") ||
        err?.message?.includes("limit") ||
        err?.message?.includes("quota");

      if (isRateLimit) {
        markKeyFailed(entry.key);
      } else {
        throw err; // Non-rate-limit errors bubble up immediately
      }
      attempts++;
    }
  }

  throw lastError ?? new Error("[APIPool] All retries failed");
}

/** Get pool status snapshot for debugging */
export function getPoolStatus() {
  return keyPool.map((k) => ({
    provider: k.provider,
    key: `...${k.key.slice(-8)}`,
    exhausted: k.exhausted,
    failCount: k.failCount,
  }));
}
