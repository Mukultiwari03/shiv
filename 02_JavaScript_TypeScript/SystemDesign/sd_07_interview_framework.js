// ============================================================================
//  SYSTEM DESIGN — SHEET 7: HOW TO ACE THE INTERVIEW
//  Goal: A repeatable framework for any system design question.
//        Most candidates fail on PROCESS, not knowledge.
// ============================================================================

// ════════════════════════════════════════════════════════════════════════════
// THE 45-MINUTE FRAMEWORK
// ════════════════════════════════════════════════════════════════════════════

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  STEP 1: CLARIFY REQUIREMENTS (3-5 min)                                 │
  │  STEP 2: CAPACITY ESTIMATION (3-5 min)                                  │
  │  STEP 3: HIGH-LEVEL DESIGN (10-15 min)                                  │
  │  STEP 4: DEEP DIVE (15-20 min)                                          │
  │  STEP 5: WRAP UP (2-3 min)                                              │
  └─────────────────────────────────────────────────────────────────────────┘

  ─────────────────────────────────────────────────────────────────────────

  STEP 1: CLARIFY REQUIREMENTS
  ─────────────────────────────
  Never jump to designing without this. It shows seniority and prevents
  building the wrong thing.

  QUESTIONS TO ASK:

  Functional Requirements (what the system does):
    □ Who uses this? (end users, businesses, internal engineers?)
    □ What are the CORE features vs nice-to-have? (agree on scope)
    □ Read-heavy or write-heavy? Both?
    □ Mobile, web, or both?

  Non-Functional Requirements (how well it does it):
    □ What's the scale? (users, requests per second)
    □ What latency is acceptable? (p99 < 100ms? < 1s?)
    □ What's the availability requirement? (99.9%? 99.99%?)
    □ Is strong consistency required, or is eventual consistency acceptable?
    □ What's the data retention period?
    □ Any geographic constraints? (single region? global?)

  Constraints:
    □ Any specific technologies to use or avoid?
    □ Time-to-market constraints?
    □ Budget constraints (impacts tech choices)?

  ─────────────────────────────────────────────────────────────────────────

  STEP 2: CAPACITY ESTIMATION
  ──────────────────────────────────────────────────────────────────────────
  Show quantitative thinking. Justifies your design decisions.

  TEMPLATE:
    Users: "Assume 100M users, 10% DAU = 10M daily active users."
    Writes: "Each user posts once a day → 10M writes/day → ~115 writes/sec."
    Reads: "100:1 read/write ratio → 11,500 reads/sec."
    Peak: "10x peak → 115K reads/sec at peak."
    Storage: "Each record is ~1KB. 10M records/day * 365 days * 5 years = 18TB."
    Bandwidth: "115K reads/sec * 1KB = 115 MB/sec."

  DON'T get lost in precision. Round numbers. The goal is order of magnitude.

  ─────────────────────────────────────────────────────────────────────────

  STEP 3: HIGH-LEVEL DESIGN
  ──────────────────────────────────────────────────────────────────────────
  Draw a diagram. Always start simple, then evolve it.

  STANDARD COMPONENTS:
    Client (mobile/browser)
    → Load Balancer
    → API Servers / Web Servers
    → [Cache Layer (Redis)]
    → Database (SQL or NoSQL)
    → [CDN for static assets]
    → [Message Queue for async work]
    → [Worker Services]
    → [Object Storage (S3) for files/media]

  DRAW IT, then explain the FLOW:
    "A user submits a post:
     1. Request hits the load balancer.
     2. Routed to an API server.
     3. API validates and writes to the database.
     4. Returns 201 to the client.
     5. Separately, a Kafka event triggers the notification service to fan out."

  ─────────────────────────────────────────────────────────────────────────

  STEP 4: DEEP DIVE
  ──────────────────────────────────────────────────────────────────────────
  Interviewer will pick 1-2 components to go deep on. Or you identify bottlenecks.

  ALWAYS identify the bottleneck first:
    "The bottleneck here is the database — at 11,500 reads/sec, a single MySQL
     node will struggle. I'd add a read replica and a Redis cache in front."

  DEEP DIVE TOPICS (expect any of these):
    • Database schema design + indexes
    • Cache strategy (what to cache, invalidation, TTL)
    • How to handle failures (circuit breaker, retry, DLQ)
    • How to scale writes (sharding strategy)
    • Data consistency (what happens if service crashes mid-write)
    • Security (auth, encryption, rate limiting)
    • Monitoring (metrics, alerts, tracing)
    • Real-time features (WebSocket, Pub/Sub)

  ─────────────────────────────────────────────────────────────────────────

  STEP 5: WRAP UP
  ──────────────────────────────────────────────────────────────────────────
  Summarise the design. Proactively mention limitations.

  GOOD WRAP-UP includes:
    • What you built and why key decisions were made.
    • What you would do with more time.
    • Known limitations or trade-offs you consciously accepted.
    • How to monitor and operate it in production (metrics, alerts, on-call).

  Example:
    "To summarise: we have a load-balanced API tier, Redis cache for hot reads,
    PostgreSQL with read replicas for durability, and Kafka for async fanout.
    The main trade-off is eventual consistency on followers' feeds — a tweet
    may take a few seconds to appear for all followers. Given this is a social
    feed (not a financial transaction), that's acceptable.
    If I had more time, I'd add: rate limiting per user, a CDN for media,
    and distributed tracing with Jaeger across services."
*/


// ════════════════════════════════════════════════════════════════════════════
// COMMON FOLLOW-UP QUESTIONS & HOW TO ANSWER THEM
// ════════════════════════════════════════════════════════════════════════════

/*
  "How does it scale to 10x the load?"
  → Identify the bottleneck. Usually the database.
  → Add: read replicas (for read-heavy), sharding (for write-heavy), more cache.
  → Stateless API servers: just add more behind the load balancer.

  "What happens if a server goes down?"
  → Load balancer detects via health checks → stops sending traffic.
  → Stateless servers: requests redistributed automatically.
  → Database: replica promotes to primary (failover, ~30-60 sec).
  → Cache: requests fall back to DB. Add circuit breaker to prevent DB overload.

  "What happens if the database goes down?"
  → Circuit breaker opens → API returns 503 (Service Unavailable).
  → Writes can queue in Kafka until DB recovers.
  → Reads can serve stale cache data.

  "How do you handle a data centre failure?"
  → Multi-region deployment. Data replicated across regions.
  → Active-passive: one region primary, another on standby.
  → Active-active: both regions serve traffic. Conflict resolution needed.
  → DNS failover routes traffic to healthy region.

  "How do you ensure exactly-once delivery / no duplicate processing?"
  → Idempotency keys on all operations.
  → At-least-once delivery + idempotent consumers.
  → Track processed message IDs in a deduplication store (TTL = message expiry).

  "How do you debug this system in production?"
  → Distributed tracing (Jaeger, Zipkin, AWS X-Ray): trace requests across services.
  → Centralised logging (ELK stack, Datadog, Splunk): searchable logs from all services.
  → Metrics (Prometheus + Grafana): dashboards for RPS, latency p50/p99, error rates.
  → Alerts: PagerDuty/OpsGenie on p99 latency > threshold or error rate > 1%.
*/


// ════════════════════════════════════════════════════════════════════════════
// MISTAKES TO AVOID
// ════════════════════════════════════════════════════════════════════════════

/*
  ✗ Jumping to solutions before clarifying requirements.
    Fix: Always spend 3-5 min on requirements. It shows maturity.

  ✗ Designing for unrealistic scale.
    "I'll add 50 microservices" for a system with 1K users. Overkill.
    Fix: Let the scale requirements drive the architecture.

  ✗ Not justifying choices.
    "I'll use MongoDB." Why? Because it's NoSQL? That's not a reason.
    Fix: "I'll use MongoDB because the product catalog has variable fields per
    category — a document model fits better than a fixed SQL schema."

  ✗ Ignoring failure modes.
    Fix: Always ask "what happens if X fails?" for each component.

  ✗ Over-engineering from the start.
    Fix: Start with a simple design that works. Evolve it when you hit constraints.
    "Start with a monolith, split into services when teams/scale demand it."

  ✗ Silence.
    Fix: Think out loud. The interviewer values your thought process more than the
    final diagram. "I'm considering X vs Y... X has this trade-off... so I'll go with Y because..."

  ✗ Not asking the interviewer what to dive into.
    Fix: "I've covered the high-level design. I can go deeper on the database schema,
    the caching strategy, or the real-time notification system — which would you prefer?"
*/


// ════════════════════════════════════════════════════════════════════════════
// MOCK INTERVIEW PRACTICE PROBLEMS (TIME YOURSELF: 45 MINUTES EACH)
// ════════════════════════════════════════════════════════════════════════════

/*
  TIER 1 (most common — know these cold):
    □ Design a URL shortener (bit.ly)
    □ Design a social media feed (Twitter timeline)
    □ Design a chat application (WhatsApp)
    □ Design a rate limiter

  TIER 2 (common at senior levels):
    □ Design YouTube / Netflix
    □ Design Google Drive / Dropbox
    □ Design a notification system (push notifications at scale)
    □ Design a ride-sharing app (Uber)
    □ Design a web crawler

  TIER 3 (advanced / infrastructure):
    □ Design a distributed key-value store
    □ Design a search engine
    □ Design a distributed message queue
    □ Design a payment system

  PRACTICE ROUTINE:
  1. Pick a problem. Set a 45-minute timer.
  2. Work through the 5-step framework on paper/whiteboard.
  3. At 45 min: review what you missed. Note trade-offs you didn't consider.
  4. Read about the actual system (how Twitter, Netflix, Uber solved it).
  5. Repeat until you can flow through the framework naturally.
*/

console.log("System Design sheets complete!");
console.log("Study path:");
console.log("  1. Read each sheet. Close it. Explain the concepts out loud.");
console.log("  2. Practice 1 mock design per day (45 min, timed).");
console.log("  3. Read case studies: High Scalability blog, Netflix tech blog, Uber engineering.");
console.log("  4. Do DSA sheets 1-12 daily for coding rounds.");
console.log("  You are now equipped for any technical interview.\n");
