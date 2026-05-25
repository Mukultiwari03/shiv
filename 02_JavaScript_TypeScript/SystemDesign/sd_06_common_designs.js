// ============================================================================
//  SYSTEM DESIGN — SHEET 6: COMMON SYSTEM DESIGNS
//  Goal: Walk through the 8 most-asked design problems. For each one,
//        understand the key decisions, the bottleneck, and the solution.
// ============================================================================

// ════════════════════════════════════════════════════════════════════════════
// DESIGN 1: URL SHORTENER (bit.ly)
// ════════════════════════════════════════════════════════════════════════════

/*
  REQUIREMENTS:
    Functional: Given a long URL → return a short URL.
                Given a short URL → redirect to long URL.
    Non-functional: Low latency reads. 100:1 read/write ratio. 10 years retention.

  ESTIMATION:
    100M URLs shortened/day → ~1.16K writes/sec.
    10B redirects/day → ~116K reads/sec. (100x more reads than writes)
    Storage: 100M/day * 365 * 10 years = 365B URLs. Each ~500 bytes → ~180 TB.

  KEY DESIGN DECISIONS:

  1. URL ENCODING:
     Need to generate a unique short code (6-8 chars).
     Approach 1: Base62 encoding (a-z, A-Z, 0-9). 62^7 = 3.5 trillion.
     Approach 2: Hash the long URL (MD5, SHA-256), take first 7 chars.
       ✗ Collision risk (two URLs hash to same 7 chars). Use collision detection + retry.
     Approach 3: Auto-incrementing ID → convert to base62.
       ✓ No collisions. ✗ Predictable (easy to scrape sequentially). Use a counter service or UUID.

  2. REDIRECT:
     301 Permanent Redirect: Browser caches it. Future requests go direct (saves server load).
       ✗ Analytics: can't track individual clicks (browser doesn't hit your server again).
     302 Temporary Redirect: Every click goes through your server.
       ✓ Full analytics. ✗ Higher server load.
     Design choice: 302 if analytics needed; 301 if maximising server efficiency.

  3. DATABASE:
     NoSQL (DynamoDB, Cassandra): Better for key-value lookup at scale. No JOINs needed.
     Schema: { shortCode: PK, longUrl, userId, createdAt, expiresAt, clickCount }
     Read path: shortCode → Redis cache → DynamoDB → 302 redirect.

  4. CACHING:
     Hot URLs (Pareto principle: 20% of URLs = 80% of traffic) → cache in Redis.
     Key: shortCode → longUrl. TTL: same as URL expiry or 24 hours.

  FLOW:
    Create: POST /api/shorten { longUrl } → generate shortCode → store in DB + cache → return shortUrl.
    Redirect: GET /:shortCode → check Redis → if miss check DB → 302 redirect (or 404).

  FOLLOW-UP QUESTIONS:
    "How do you prevent abuse?" → Rate limit per user/IP. Require auth for API access.
    "How do you handle custom aliases?" → Store custom → longUrl in same DB. Collision check.
    "How do you expire URLs?" → Store expiresAt. Use DynamoDB TTL or a cleanup cron job.
*/


// ════════════════════════════════════════════════════════════════════════════
// DESIGN 2: TWITTER FEED / NEWS FEED
// ════════════════════════════════════════════════════════════════════════════

/*
  REQUIREMENTS:
    Post a tweet. Follow users. View a timeline (posts from followed users, reverse-chron).

  ESTIMATION:
    300M users, 50M DAU. Each user follows 200 people on average.
    300 tweets/second (writes). 150K reads/second (reads are dominant).

  KEY TABLES:
    Users: { userId, name, handle, ... }
    Tweets: { tweetId, userId, content, createdAt, mediaUrl }
    Follows: { followerId, followeeId }

  TIMELINE GENERATION:
  ─────────────────────
  OPTION A — PULL (fan-out on read):
    When user opens app: SELECT tweets FROM users WHERE userId IN (followees) ORDER BY createdAt DESC LIMIT 20.
    ✗ N+1 queries or expensive JOIN. Slow for users following 10,000 people.

  OPTION B — PUSH (fan-out on write):
    When user tweets: INSERT into each follower's "feed" table.
    Feed table: { userId, tweetId, createdAt }
    ✓ O(1) read: just read from your feed table.
    ✗ Celeb with 10M followers → 10M writes per tweet.

  HYBRID (Twitter's actual approach):
    Regular users → fan-out on write. Feed is precomputed in Redis.
    Celebrity accounts (> threshold) → NOT fanned out. Pulled at read time and merged.
    Timeline service merges celeb tweets into feed on read.

  REDIS FEED CACHE:
    Key: feed:{userId} → Sorted Set of tweetIds, scored by timestamp.
    Only keep last N (e.g., 800) tweets per user. Old content loaded from DB.

  MEDIA STORAGE:
    Images/videos → S3 (object storage). Tweet stores S3 URL.
    Serve via CDN (CloudFront) for low-latency global access.

  RETWEETS / LIKES:
    Likes: { tweetId, userId } — or use Redis counter for fast increment.
    Retweets: new Tweet with reference to original tweetId.
*/


// ════════════════════════════════════════════════════════════════════════════
// DESIGN 3: YOUTUBE / NETFLIX (Video Streaming)
// ════════════════════════════════════════════════════════════════════════════

/*
  VIDEO UPLOAD PIPELINE:
  ─────────────────────
  1. User uploads raw video → object storage (S3).
  2. Upload complete → message queued in Kafka/SQS.
  3. Transcoding workers consume queue:
     - Transcode to multiple resolutions: 360p, 720p, 1080p, 4K.
     - Split into small segments (2-10 seconds each) — HLS or DASH format.
     - Store segments in CDN-backed object storage.
  4. Metadata (title, description, duration, thumbnail) stored in DB.

  WHY transcode to multiple resolutions?
  Adaptive Bitrate Streaming (ABR): Player automatically switches resolution
  based on available bandwidth. If on slow 3G → 360p. On fiber → 1080p.

  VIDEO STREAMING:
  ─────────────────
  HLS (HTTP Live Streaming): Playlist (.m3u8) file lists segment URLs.
  Player downloads segments sequentially. Switches quality between segments.
  Segments served from CDN closest to user.

  CDN STRATEGY:
  Videos that are popular worldwide → global CDN push (Akamai, Cloudflare).
  Long-tail (rarely watched) → cache on demand (CDN pulls from origin on first request).
  Netflix uses its own CDN (Open Connect) placed directly inside ISPs.

  SEARCH:
  Full-text search on title/description → Elasticsearch.
  Indexed fields: title, tags, category, channel.

  RECOMMENDATIONS:
  Collaborative filtering (what users with similar taste watched) + content-based.
  Typically handled by a separate ML pipeline, not the core system design.
*/


// ════════════════════════════════════════════════════════════════════════════
// DESIGN 4: WHATSAPP / CHAT SYSTEM
// ════════════════════════════════════════════════════════════════════════════

/*
  KEY FEATURES: 1-1 messaging, group chat, online/offline status, delivery receipts.

  WEBSOCKETS vs HTTP Polling:
  ────────────────────────────
  HTTP Polling: Client asks "any new messages?" every N seconds.
    ✗ Inefficient. Latency = polling interval.

  Long Polling: Client asks, server holds connection open until message arrives (or timeout).
    Better but still repeated connections.

  WebSockets: Persistent bidirectional TCP connection.
    ✓ Real-time. ✓ Low overhead. Both client and server can push at any time.
    ✗ Stateful — each connection is held on a specific server. Need sticky sessions or
      a shared pub/sub (Redis Pub/Sub) to route messages across servers.

  ARCHITECTURE:
  User connects → WebSocket connection to a Chat Server.
  Multiple chat servers — each handles N concurrent connections.
  Redis Pub/Sub: When user A (on server 1) messages user B (on server 2):
    Server 1 publishes message to Redis channel.
    Server 2 subscribed to that channel → pushes to user B's WebSocket.

  MESSAGE STORAGE:
  NoSQL: Key-value or column-family (Cassandra) — optimised for write-heavy workloads.
  Schema: { chatId, messageId (UUID, time-ordered), senderId, content, timestamp, status }
  Query pattern: "Give me messages in chatId X newer than timestamp T" → Cassandra excels here.
  Message IDs: Use Snowflake IDs (time-ordered, globally unique) for sortability.

  DELIVERY RECEIPTS:
  Sent: Server received the message.
  Delivered: Recipient's device received it.
  Read: Recipient opened the conversation.
  Implementation: Ack messages sent back through WebSocket when each state occurs.

  OFFLINE MESSAGES:
  User is offline → store message in DB. When they reconnect → query for missed messages
  since their last_seen timestamp.

  GROUP CHAT:
  Message sent → fan out to all group members.
  For large groups, use a message queue (Kafka) to handle fanout asynchronously.
*/


// ════════════════════════════════════════════════════════════════════════════
// DESIGN 5: UBER / RIDE SHARING
// ════════════════════════════════════════════════════════════════════════════

/*
  KEY FEATURES: Request ride, match with nearby driver, track in real-time, payment.

  LOCATION TRACKING:
  Drivers send location every 5 seconds via WebSocket.
  Store in: Redis Geo (GEOADD, GEORADIUS). In-memory, super fast.
    GEOADD drivers 151.2093 -33.8688 "driver:456"
    GEORADIUS drivers 151.21 -33.87 5 km ASC COUNT 5  → nearest 5 drivers within 5km.

  MATCHING SERVICE:
  User requests ride → Matching Service queries nearby available drivers.
  Sends push notification (or WebSocket) to closest available driver.
  If no accept in 10s → offer to next driver.

  SURGE PRICING:
  Monitor supply (available drivers) vs demand (pending requests) in each geofence.
  surge_multiplier = demand / supply (capped and rounded to nice numbers).

  TRIP MANAGEMENT:
  State machine: REQUESTED → ACCEPTED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED.
  Store each trip in SQL (full ACID for payments).

  PAYMENT:
  Trigger payment after COMPLETED. Retry on failure with exponential backoff.
  Idempotency key = tripId to prevent double charges.
*/


// ════════════════════════════════════════════════════════════════════════════
// DESIGN 6: GOOGLE DRIVE / DROPBOX (File Storage)
// ════════════════════════════════════════════════════════════════════════════

/*
  FILE UPLOAD:
  ─────────────
  Client → Upload Service (direct to S3 using pre-signed URL is better than proxying).
  Chunked upload: Split large files into 4MB chunks.
    ✓ Resume interrupted uploads (only re-upload failed chunks).
    ✓ Parallel upload of chunks.
    ✓ Delta sync: only upload CHANGED chunks (Dropbox's approach).

  File deduplication: Hash each chunk (SHA-256). If hash exists in storage → don't re-upload.
  Multiple users upload same file → only stored once. Massive storage savings.

  SYNC ACROSS DEVICES:
  Long polling or WebSocket on desktop client → notified of changes → pull delta.
  Conflict resolution: Last-write-wins OR conflict copies (like Dropbox).

  METADATA:
  SQL: { fileId, userId, name, size, path, s3_url, version, createdAt, modifiedAt }
  File system structure: folder hierarchy → adjacency list or nested set in DB.

  STORAGE:
  Object storage (S3) for file content. CDN for shared/public files.
  Encryption at rest (server-side) and in transit (HTTPS).
*/


// ════════════════════════════════════════════════════════════════════════════
// DESIGN 7: DESIGN A KEY-VALUE STORE (Like Redis / DynamoDB)
// ════════════════════════════════════════════════════════════════════════════

/*
  This is a fundamentals question — tests if you understand distributed systems deeply.

  SINGLE SERVER: Hash map in memory. Simple. No durability, no scale.

  DISTRIBUTED:
  1. DATA PARTITIONING: Consistent hashing to distribute keys across nodes.
  2. REPLICATION: Each key stored on N nodes (replication factor = 3 for fault tolerance).
  3. READS/WRITES: Use quorum (W + R > N).
     If N=3, W=2, R=2: write to 2/3 nodes, read from 2/3. Strong consistency guaranteed.
     If W=1, R=1: eventual consistency, maximum availability.
  4. CONFLICT RESOLUTION: Vector clocks to track causality. Last-write-wins or merge.
  5. GOSSIP PROTOCOL: Nodes share membership info with a few random peers.
     Failure detected when heartbeat not received within timeout.
  6. DURABILITY: Write to WAL (Write-Ahead Log) before confirming.

  REAL EXAMPLES: Cassandra, DynamoDB, Riak all use consistent hashing + quorum.
*/


// ════════════════════════════════════════════════════════════════════════════
// DESIGN 8: WEB CRAWLER
// ════════════════════════════════════════════════════════════════════════════

/*
  PURPOSE: Discover and download web pages for indexing (Google), archiving (Wayback Machine).

  COMPONENTS:
  URL Frontier:  Queue of URLs to crawl. Priority queue (prioritise important pages).
  Fetcher:       Downloads HTML content. Respects robots.txt. Rate limits per domain.
  Parser:        Extracts links from HTML. Filters (valid HTTP URLs, not already seen).
  URL Filter:    Deduplication using a distributed bloom filter.
  Storage:       Store raw HTML in object storage. Store URLs in distributed DB (Cassandra).

  CHALLENGES:
  Spider trap: Infinite URL spaces (e.g., calendars). Detect by URL length limit or hashing URL path.
  Duplicate content: Same content, different URL. Simhash the content to detect near-duplicates.
  Politeness: Don't hammer a single server. Rate limit per domain. Respect Crawl-delay in robots.txt.
  Scale: Billions of URLs. Bloom filter for fast duplicate URL detection.
         Bloom filter: probabilistic, may have false positives (rare), no false negatives.
         Use: visited URL set. Tradeoff: small chance of skipping a URL, huge memory savings.

  BLOOM FILTER:
  ───────────────
  Space-efficient probabilistic set. Multiple hash functions → set bits in a bit array.
  Membership check: all bits set → PROBABLY in set. Any bit unset → DEFINITELY not in set.
  False positive rate controllable by size and number of hash functions.
  Cannot delete elements (use Counting Bloom Filter for deletions).
*/

console.log("Sheet 6 (Common Designs) loaded.");
console.log("For each design: cover requirements → estimation → components → deep-dive trade-offs.");
console.log("Next: sd_07_interview_framework.js\n");
