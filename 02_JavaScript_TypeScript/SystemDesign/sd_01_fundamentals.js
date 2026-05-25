// ============================================================================
//  SYSTEM DESIGN — SHEET 1: FUNDAMENTALS
//  Goal: Know the vocabulary cold. Every system design interview starts with
//        these concepts. Vague answers here → fail regardless of architecture.
// ============================================================================
//
//  HOW TO USE THIS FILE:
//    Read each concept. Close the file. Explain it out loud without looking.
//    If you can't — re-read and try again. Self-testing is the only way.
//
//  SHEETS IN THIS FOLDER:
//    sd_01_fundamentals.js       ← You are here
//    sd_02_databases.js          ← SQL vs NoSQL, indexing, sharding
//    sd_03_caching.js            ← Redis, CDN, cache strategies
//    sd_04_api_design.js         ← REST, GraphQL, rate limiting
//    sd_05_messaging_scalability.js  ← Queues, microservices, load balancing
//    sd_06_common_designs.js     ← URL shortener, Twitter feed, Netflix, etc.
//    sd_07_interview_framework.js← How to ANSWER any design question
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: SCALABILITY CONCEPTS
// ════════════════════════════════════════════════════════════════════════════

/*
  LATENCY vs THROUGHPUT:
  ─────────────────────
  Latency:    Time to complete ONE request. (How fast?)
              e.g., 50ms to fetch a user profile.
  Throughput: Number of requests processed per unit time. (How many?)
              e.g., 10,000 requests/second.

  You usually can't maximise both simultaneously.
  A cache improves latency. A load balancer improves throughput.

  COMMON LATENCY NUMBERS (memorise these):
    L1 cache:         0.5 ns
    L2 cache:         7 ns
    RAM:              100 ns
    SSD read:         150 μs
    Network (same DC): 0.5 ms
    Network (US→EU):   150 ms
    HDD seek:          10 ms

  INTERVIEW TIP: "Why not always cache everything?"
  Cache is RAM — expensive and limited. Also cache invalidation is hard.
  "There are only two hard things in CS: cache invalidation and naming things."

  ─────────────────────────────────────────────────────────────────────────

  VERTICAL SCALING vs HORIZONTAL SCALING:
  ────────────────────────────────────────
  Vertical (Scale Up):   Add more RAM/CPU to the same machine.
    ✓ Simple — no code changes needed.
    ✗ Physical limit. Single point of failure. Expensive.

  Horizontal (Scale Out): Add more machines. Distribute load.
    ✓ Theoretically unlimited. Fault tolerant.
    ✗ Complex — need load balancers, consistent state, distributed coordination.

  INTERVIEW TIP: Always ask "what's the scale?" before designing.
  1K users/day → vertical is fine.
  1B users/day → horizontal is mandatory.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: CAP THEOREM
// ════════════════════════════════════════════════════════════════════════════

/*
  CAP THEOREM: A distributed system can guarantee only 2 of 3:
  ─────────────────────────────────────────────────────────────
  C — Consistency:   Every read receives the most recent write (or an error).
  A — Availability:  Every request receives a response (no errors), but may not
                     be the latest data.
  P — Partition Tolerance: System continues operating if network splits
                            (some nodes can't reach others).

  In reality: Network partitions WILL happen. So you choose CA or CP.

  CP (Consistent + Partition Tolerant): Returns error/timeout rather than stale data.
    Examples: HBase, MongoDB (with certain settings), Zookeeper, etcd.
    Use when: Banking, financial transactions. Stale data = wrong balance.

  AP (Available + Partition Tolerant): Returns stale data rather than failing.
    Examples: Cassandra, CouchDB, DynamoDB (eventually consistent mode).
    Use when: Social media, DNS. Eventual consistency is acceptable.

  INTERVIEW TIP: CAP is binary but systems often have dials.
  DynamoDB lets you choose between "strong consistency" (CP) and
  "eventual consistency" (AP) per request.

  ─────────────────────────────────────────────────────────────────────────

  ACID vs BASE:
  ─────────────
  ACID (traditional SQL databases):
    Atomic:    Transaction either fully completes or fully rolls back.
    Consistent:Data is always in a valid state.
    Isolated:  Concurrent transactions don't interfere.
    Durable:   Committed data survives crashes (written to disk).

  BASE (modern NoSQL / distributed systems):
    Basically Available: System is usually available.
    Soft State:          State may change without input (as consistency propagates).
    Eventual Consistent: All nodes will eventually agree on the same data.

  INTERVIEW TIP: ACID is about correctness. BASE is about availability.
  Use ACID for: payments, inventory, reservations.
  Use BASE for: social feeds, view counts, analytics.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: LOAD BALANCING
// ════════════════════════════════════════════════════════════════════════════

/*
  LOAD BALANCER: Distributes incoming requests across multiple servers.
  ─────────────────────────────────────────────────────────────────────

  ALGORITHMS:

  Round Robin:         Requests go to servers in rotation: 1,2,3,1,2,3...
                       Simple. Works when requests are uniform.

  Weighted Round Robin:Same but servers with higher capacity get more traffic.
                       Server A (4 cores) gets 2x traffic of Server B (2 cores).

  Least Connections:   Next request goes to server with fewest active connections.
                       Better for long-running requests (WebSockets, file uploads).

  IP Hash:             Hash the client's IP to always route to the same server.
                       Useful for session persistence (stateful apps).

  Random:              Pick a random server. Surprisingly effective with many servers.

  LAYER 4 vs LAYER 7:
  Layer 4 (Transport): Routes based on IP/TCP. Faster. Can't inspect content.
  Layer 7 (Application): Routes based on HTTP headers, URL, cookies. More flexible.
    e.g., /api/* → API servers, /static/* → CDN, /admin/* → admin servers.

  INTERVIEW TIP: "How do load balancers avoid becoming a single point of failure?"
    → Multiple load balancers in active-passive or active-active configuration.
    → DNS-level load balancing: multiple IPs for the same domain.
    → Anycast routing for global distribution.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: REPLICATION & CONSISTENCY
// ════════════════════════════════════════════════════════════════════════════

/*
  DATABASE REPLICATION:
  ─────────────────────
  Primary-Replica (Master-Slave):
    Writes go to Primary. Primary replicates to Replicas. Reads can go to Replicas.
    ✓ Read scaling. ✓ Redundancy (Replica can promote if Primary fails).
    ✗ Replication lag — Replicas might serve stale data.
    ✗ If Primary fails before replication → data loss (async replication).

  Multi-Primary (Multi-Master):
    Multiple nodes accept writes.
    ✓ Write scaling. ✓ Higher availability.
    ✗ Conflict resolution needed (two primaries updated same row simultaneously).
    Used by: Google Spanner, CockroachDB (solve conflicts with distributed transactions).

  SYNCHRONOUS vs ASYNCHRONOUS REPLICATION:
  Synchronous: Write acknowledged only after all replicas confirm.
    ✓ No data loss. ✗ Higher latency (wait for all replicas).
  Asynchronous: Write acknowledged when Primary writes. Replicas update eventually.
    ✓ Lower latency. ✗ Replica may lag. If Primary crashes before sync → data loss.

  REPLICATION FACTOR: How many copies of data? Typically 3.
  Even if 2 nodes fail, data still available on 1. (Kafka, HDFS, Cassandra all use 3+)

  ─────────────────────────────────────────────────────────────────────────

  CONSISTENCY MODELS (from strongest to weakest):
  ──────────────────────────────────────────────────
  Linearisability (Strong): All operations appear instantaneous and ordered.
    Slowest. Used for: coordination (leader election), locking.

  Sequential Consistency: Operations appear in some consistent global order.
    All nodes agree on order, even if not real-time.

  Causal Consistency: If A causes B, all nodes see A before B.
    Good balance of performance and correctness.

  Eventual Consistency: All nodes WILL agree eventually, given no new writes.
    Fastest. Used for: DNS, social media likes, read-heavy analytics.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: NUMBERS TO KNOW
// ════════════════════════════════════════════════════════════════════════════

/*
  BACK-OF-ENVELOPE ESTIMATES:
  ─────────────────────────────────────────────────────────────────────────
  These help you justify design choices in interviews. Practice until instant.

  STORAGE:
    1 char = 1 byte         1 KB = 10^3 bytes     1 MB = 10^6 bytes
    1 GB = 10^9 bytes       1 TB = 10^12 bytes    1 PB = 10^15 bytes

    Photo (compressed):  ~300 KB
    Video (1 min, HD):   ~100 MB
    Tweet:               ~280 bytes
    User profile:        ~1 KB

  THROUGHPUT:
    SSD sequential read:  500 MB/s
    Network (1 GbE NIC):  125 MB/s
    MySQL inserts:        ~5,000-10,000/s per node
    Redis ops:            ~100,000-1,000,000/s

  TIME:
    DAU (daily active users) of Twitter: ~250M
    Requests/day of Google: ~5.6 billion

    TRICK: 1M requests/day ÷ 86,400 sec/day ≈ 12 requests/second
           1B requests/day ≈ 11,600 requests/second ≈ ~12K RPS

  PERCENTILES:
    p50 = median. p99 = 99th percentile (worst 1% of requests).
    SLAs are usually based on p99 or p999 (not average — averages hide outliers).

  ─────────────────────────────────────────────────────────────────────────

  QUICK CALCULATIONS TEMPLATE:
    Given: X million users, Y% active daily, Z actions/day/user.

    Daily writes = X * 1_000_000 * (Y/100) * Z
    QPS = Daily writes / 86,400
    Peak QPS = QPS * 3 to 5 (traffic spikes)

    Storage/year = QPS * seconds_per_year * bytes_per_record
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: SELF-TEST QUESTIONS
// ════════════════════════════════════════════════════════════════════════════

/*
  Answer these out loud without looking. If you can't → re-read the section.

  1. What's the difference between latency and throughput? Give an example of each.
  2. When would you choose vertical over horizontal scaling?
  3. Explain CAP theorem. Give a real database example of CP and AP.
  4. What's the difference between ACID and BASE? When to use each?
  5. Name four load balancing algorithms. Which is best for WebSocket connections?
  6. What's primary-replica replication? What's the tradeoff between sync and async?
  7. Twitter has 500M users, 20% DAU, 5 tweets/day each. Estimate tweets/second.
  8. What does p99 latency mean? Why is it more useful than average latency?
*/

console.log("Sheet 1 (Fundamentals) loaded. Answer the self-test questions in Section 6 before moving on.");
console.log("Next: sd_02_databases.js\n");
