// ============================================================================
//  SYSTEM DESIGN — SHEET 3: CACHING
//  Goal: Understand every layer of caching and the trade-offs of each strategy.
//        Cache is how you go from "handles 1K RPS" to "handles 1M RPS."
// ============================================================================

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: WHERE DO YOU CACHE?
// ════════════════════════════════════════════════════════════════════════════

/*
  CACHING LAYERS (from closest to furthest from the user):

  1. CLIENT-SIDE (Browser):
     HTTP headers (Cache-Control, ETag, Last-Modified) tell the browser
     to cache resources locally. No server hit on cache hit.
     Use: CSS, JS, images, fonts (long max-age).
     Not for: user-specific data, frequently changing data.

  2. CDN (Content Delivery Network):
     Geographically distributed cache servers.
     User gets content from the nearest edge server instead of your origin.
     Reduces: latency (geography), bandwidth cost, server load.
     Examples: Cloudflare, AWS CloudFront, Fastly, Akamai.
     Use: static assets, images, videos. Modern CDNs can also cache API responses.
     Key concepts: Origin pull, edge caching, cache purge/invalidation.

  3. LOAD BALANCER / REVERSE PROXY:
     Nginx / Varnish can cache responses. Serve repeated requests without hitting app.
     Use: High-traffic API responses that are the same for many users.

  4. APPLICATION-LEVEL (In-process):
     Variables / data structures in your app server's memory.
     Fastest (no network hop). Lost on server restart. Not shared across instances.
     Use: Configuration, rarely changing lookup tables.

  5. DISTRIBUTED CACHE:
     Shared cache across all app servers. The most important cache in interviews.
     Examples: Redis, Memcached.
     Use: Session storage, computed query results, rate limiting counters.

  6. DATABASE QUERY CACHE:
     Some DBs cache query results internally. Usually not recommended — invalidation
     is coarse-grained and it can consume significant DB memory.

  ─────────────────────────────────────────────────────────────────────────

  INTERVIEW TIP: "Where would you add caching in your design?"
  Answer with a SPECIFIC cache for a SPECIFIC problem, not "I'd add Redis everywhere."
  "The user profile query hits the DB on every page load. I'd cache user profiles
  in Redis with a 5-minute TTL, keyed by user_id."
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: REDIS — THE TOOL YOU NEED TO KNOW
// ════════════════════════════════════════════════════════════════════════════

/*
  REDIS: In-memory data store. Sub-millisecond latency. Persistent-optional.

  DATA STRUCTURES:
  ─────────────────────────────────────────────────────────────────────────
  String:   GET/SET. Most basic. Counters, session tokens, simple cache.
            SET user:123 "{"name":"Swastik"}" EX 3600  (expires in 1 hour)

  Hash:     Like a JS object. SET/GET individual fields.
            HSET user:123 name Swastik age 21
            HGET user:123 name
            Use: User profile (update individual fields without re-serialising).

  List:     Ordered list. LPUSH/RPUSH, LPOP/RPOP.
            Use: Activity feed (recent N items), message queue.
            LPUSH feed:user123 "tweet:456"
            LRANGE feed:user123 0 49   (get first 50)

  Set:      Unordered, unique values. SADD/SISMEMBER/SCARD/SINTER.
            Use: Unique visitors, "who liked this post", mutual friends (SINTER).

  Sorted Set (ZSet): Like Set but each member has a score. Auto-sorted by score.
            ZADD leaderboard 1500 "user:123"
            ZRANK leaderboard "user:123"   (rank)
            ZRANGE leaderboard 0 9         (top 10)
            Use: Leaderboards, rate limiting by time, priority queues.

  ─────────────────────────────────────────────────────────────────────────

  KEY REDIS FEATURES:

  TTL (Time To Live):
    SET key value EX seconds  → auto-delete after N seconds.
    SET key value PX ms       → auto-delete after N milliseconds.
    Critical for cache invalidation — data auto-expires.

  Atomic Operations:
    INCR key  → atomically increment counter. Safe for concurrent counters.
    Use: Rate limiting (INCR requests:user:123), view counts, inventory.

  Pub/Sub:
    PUBLISH channel message  → broadcast to all subscribers.
    SUBSCRIBE channel
    Use: Real-time notifications, chat, invalidating distributed caches.

  Lua Scripting:
    Execute atomic multi-step operations. Locks, conditional set, etc.
    EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then..."

  Persistence:
    RDB: Point-in-time snapshot. Fast recovery. May lose last N minutes.
    AOF: Log of every write command. Near-zero data loss. Slower recovery.
    Both: Recommended for production. Use RDB for cache (loss OK), AOF for critical data.

  ─────────────────────────────────────────────────────────────────────────

  MEMCACHED vs REDIS:
  ──────────────────────────────────────────────
  Memcached: Simpler, multi-threaded, only strings, no persistence.
  Redis:     More features, single-threaded (but very fast), persistence, Pub/Sub.
  Use Redis unless you have a specific reason for Memcached.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CACHE STRATEGIES
// ════════════════════════════════════════════════════════════════════════════

/*
  CACHE ASIDE (Lazy Loading) — MOST COMMON:
  ──────────────────────────────────────────
  App checks cache first. On miss → load from DB → store in cache → return.

  Pseudocode:
    function getUser(userId) {
      const cached = await redis.get(`user:${userId}`);
      if (cached) return JSON.parse(cached);
      const user = await db.findById(userId);
      await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600);
      return user;
    }

  ✓ Only caches data that's actually requested.
  ✓ Cache failure doesn't break the app (falls back to DB).
  ✗ Cache miss penalty: 3 operations (check cache, read DB, write cache).
  ✗ Cache stampede: many requests hit DB simultaneously on cold start.
      Fix: Add random jitter to TTL, or use "mutex/lock" to prevent thundering herd.

  ─────────────────────────────────────────────────────────────────────────

  WRITE-THROUGH:
  ──────────────
  Write to cache AND database synchronously on every write.

  Pseudocode:
    async function updateUser(userId, data) {
      await db.update(userId, data);
      await redis.set(`user:${userId}`, JSON.stringify(data), 'EX', 3600);
    }

  ✓ Cache always consistent with DB.
  ✓ Read performance same as cache-aside.
  ✗ Write penalty: every write hits both cache and DB.
  ✗ Cache may store data that's never read (cache churn).

  ─────────────────────────────────────────────────────────────────────────

  WRITE-BACK (Write-Behind):
  ──────────────────────────
  Write to cache only. Asynchronously flush to DB later (batched).

  ✓ Extremely fast writes (only cache).
  ✓ Batching reduces DB load.
  ✗ Data loss if cache dies before flush.
  ✗ Complex implementation.
  Use: Gaming scores, analytics counters, real-time bidding.

  ─────────────────────────────────────────────────────────────────────────

  READ-THROUGH:
  ─────────────
  Cache sits in front of DB. App only talks to cache. Cache fetches from DB on miss.
  Similar to cache-aside but the cache layer manages DB interaction automatically.
  Used by: Some ORM-level caches.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: CACHE INVALIDATION (the hard problem)
// ════════════════════════════════════════════════════════════════════════════

/*
  STRATEGIES:

  1. TTL (Time-To-Live):
     Simplest. Cache entry expires after N seconds.
     Trade-off: Lower TTL = fresher data, more DB load. Higher TTL = stale data, less DB load.
     Use: When slight staleness is acceptable (user profiles, product info).

  2. Event-Driven Invalidation:
     When data changes, explicitly delete/update cache entries.
     Publish update event → cache invalidation service deletes the key.
     ✓ Data is always fresh after the event propagates.
     ✗ More complex. Must track all cache keys affected by a change.

  3. Cache Versioning:
     Include version in cache key: `user:${userId}:v${version}`.
     On update, increment version. Old keys expire naturally via TTL.
     ✓ No explicit invalidation needed.
     ✗ Stale keys accumulate until TTL expires.

  ─────────────────────────────────────────────────────────────────────────

  THUNDERING HERD PROBLEM:
  ────────────────────────
  When a popular cache entry expires, thousands of requests simultaneously
  miss and all hit the DB, overwhelming it.

  Solutions:
    1. Cache locking: Only one request fetches from DB; others wait (mutex).
    2. Probabilistic Early Expiration: Randomly refresh cache slightly before TTL.
    3. Background refresh: Async job refreshes cache before expiry.
    4. Stale-while-revalidate: Serve stale data while refreshing in background.
*/

// CODE EXAMPLE — Rate Limiter using Redis:
// (Sliding window log pattern)
async function isRateLimited(userId, maxRequests, windowSeconds, redis) {
  const key = `ratelimit:${userId}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  // Remove timestamps older than window
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count requests in current window
  const count = await redis.zcard(key);

  if (count >= maxRequests) {
    return true; // rate limited
  }

  // Add current request timestamp
  await redis.zadd(key, now, `${now}`);
  await redis.expire(key, windowSeconds);
  return false;
}

/*
  SELF-TEST:
  ──────────────────────────────────────────────────────────────────────────
  1. When would you use a CDN vs a Redis cache? (Different data types & access patterns)
  2. What's the thundering herd problem and how do you prevent it?
  3. Describe cache-aside in pseudocode. What are its failure modes?
  4. You have a user profile that's read 10,000 times per second but written rarely.
     Design the caching strategy.
  5. How would you implement a rate limiter using Redis? (code it above)
  6. What Redis data structure would you use for a real-time leaderboard?
*/

console.log("Sheet 3 (Caching) loaded. Complete the self-test in Section 4.");
console.log("Next: sd_04_api_design.js\n");
