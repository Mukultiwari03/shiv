// ============================================================================
//  SYSTEM DESIGN — SHEET 2: DATABASES
//  Goal: Know SQL vs NoSQL, when to use which, and how to scale both.
//        Database choice drives the rest of your architecture.
// ============================================================================

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: SQL vs NoSQL
// ════════════════════════════════════════════════════════════════════════════

/*
  SQL (Relational):
  ─────────────────
  Data stored in TABLES with ROWS and COLUMNS. Schema is fixed.
  Relationships via FOREIGN KEYS and JOINS.
  ACID transactions. Strong consistency.

  Examples: PostgreSQL, MySQL, SQLite, SQL Server, Oracle.

  When to use SQL:
    ✓ Complex relationships (many-to-many joins)
    ✓ Need ACID transactions (payments, bookings, inventory)
    ✓ Data structure is well-defined and stable
    ✓ Need complex queries and aggregations
    ✓ Reporting, analytics with complex WHERE / GROUP BY

  ─────────────────────────────────────────────────────────────────────────

  NoSQL:
  ──────
  Non-relational. Schema-flexible. Horizontally scalable. BASE over ACID.
  Designed to handle massive scale that SQL struggles with.

  FOUR TYPES:

  1. KEY-VALUE STORE:
     Data: { key → value (blob) }
     Operations: get(key), set(key, value), delete(key)
     Examples: Redis, DynamoDB (also document), Memcached
     Use: Session storage, caching, real-time leaderboards, shopping carts.
     Not for: Complex queries, relationships.

  2. DOCUMENT STORE:
     Data: Nested JSON-like documents. Each document can have different fields.
     Examples: MongoDB, CouchDB, Firestore
     Use: Product catalogs (varying attributes), user profiles, content management.
     Not for: Multi-document ACID transactions (MongoDB 4+ supports some).

  3. COLUMN-FAMILY (Wide Column):
     Data: Tables but rows can have different columns. Each row has a row key.
     Good for: time-series data, write-heavy workloads, analytics.
     Examples: Cassandra, HBase, Google Bigtable
     Use: IoT sensor data, activity logs, time-series metrics.
     Not for: Complex queries across many columns (no flexible WHERE clauses).

  4. GRAPH DATABASE:
     Data: Nodes (entities) + Edges (relationships) with properties.
     Examples: Neo4j, Amazon Neptune
     Use: Social networks (friend-of-friend), recommendation engines,
          fraud detection (connected transactions), knowledge graphs.
     Not for: Simple CRUD, large volumes of non-relational data.

  ─────────────────────────────────────────────────────────────────────────

  DECISION FRAMEWORK:
  ──────────────────────────────────────────────────────────────────
  "Do I need complex transactions spanning multiple entities?" → SQL
  "Will my schema change frequently?" → NoSQL (Document)
  "Do I need to cache hot data at < 1ms?" → Redis (Key-Value)
  "Do I need to store billions of time-series events?" → Cassandra
  "Is my data a graph of relationships?" → Graph DB
  "Do I have complex many-to-many relationships?" → SQL
  "Do I need to scale writes horizontally without a schema?" → NoSQL
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: INDEXING
// ════════════════════════════════════════════════════════════════════════════

/*
  What is an index?
  ─────────────────
  A data structure (usually a B-Tree or Hash) that speeds up lookups at the
  cost of additional storage and slower writes.

  Without index: table scan — O(n)
  With index:    B-Tree lookup — O(log n)

  B-TREE INDEX (default in most SQL databases):
    Good for: equality (=), range (<, >, BETWEEN), ORDER BY, LIKE 'prefix%'
    Not for: LIKE '%suffix' (can't use index), full-text search.

  HASH INDEX:
    Good for: exact equality only (=). O(1) lookup.
    Not for: ranges, ORDER BY.
    Used by: PostgreSQL hash indexes, Redis, hash partitions.

  COMPOSITE INDEX (multiple columns):
    Index on (a, b, c) — useful for queries filtering on a, or a+b, or a+b+c.
    The LEFTMOST PREFIX RULE: (a) and (a,b) can use the index; (b) alone cannot.

  COVERING INDEX:
    Index includes all columns a query needs. Query satisfied from index alone —
    no need to touch the actual table rows. Very fast (eliminates "table hop").

  ─────────────────────────────────────────────────────────────────────────

  INTERVIEW TIPS:
    "Why are indexes bad?" → They slow down writes (INSERT/UPDATE/DELETE must
    update both the table and the index). Don't over-index write-heavy tables.

    "When would you add an index?"
    → When a query on that column is slow (full table scan on millions of rows).
    → EXPLAIN / EXPLAIN ANALYZE the query first to confirm it's a table scan.

    "What is a database deadlock?"
    → Two transactions each hold a lock the other needs.
    → Prevention: always acquire locks in the same order, or use deadlock detection
      and rollback one transaction.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: SHARDING (HORIZONTAL PARTITIONING)
// ════════════════════════════════════════════════════════════════════════════

/*
  SHARDING: Split data across multiple database nodes.
  ─────────────────────────────────────────────────────
  Each shard holds a SUBSET of the data. Queries that hit one shard are fast.
  Queries that span shards are expensive (must be coordinated).

  SHARDING STRATEGIES:

  1. RANGE SHARDING:
     Divide data by ranges of a key (user_id 0-1M on shard 1, 1M-2M on shard 2).
     ✓ Simple. Range queries stay on one shard.
     ✗ Hot spots: new users all go to the latest shard. Uneven distribution.

  2. HASH SHARDING:
     shard = hash(key) % number_of_shards
     ✓ Even distribution. No hot spots.
     ✗ Range queries must hit ALL shards. Adding/removing shards requires resharding.

  3. DIRECTORY-BASED SHARDING:
     A lookup table maps keys to shards.
     ✓ Flexible. Can move data between shards.
     ✗ Lookup table is a single point of failure / bottleneck.

  4. CONSISTENT HASHING:
     Keys and nodes on a circle (hash ring). Key maps to nearest node clockwise.
     ✓ Adding/removing nodes only moves ~K/N keys (K=total keys, N=nodes).
     ✓ Virtual nodes (vnodes) handle uneven distribution.
     Used by: Cassandra, Amazon DynamoDB, Memcached.

  ─────────────────────────────────────────────────────────────────────────

  PROBLEMS WITH SHARDING:
    Cross-shard JOINs:   Have to query multiple shards and merge in application.
    Cross-shard transactions: Very complex (distributed transactions, 2PC).
    Hot shards:          One shard gets all the traffic (celebrity problem).
    Resharding:          Adding shards requires moving data — painful at scale.

  ALTERNATIVES TO SHARDING:
    → Read replicas (for read-heavy loads)
    → Caching layer (Redis/Memcached in front of DB)
    → Denormalisation (store data in multiple formats to avoid JOINs)
    → Consider sharding only after these are exhausted.

  ─────────────────────────────────────────────────────────────────────────

  SELF-TEST:
  ──────────
  1. You have a PostgreSQL database with 10M users. Queries on email are slow.
     What do you add? (Answer: index on email column)

  2. You're designing a chat app. Messages table has 1B rows. Queries are slow.
     You decide to shard. What key do you use and why?
     (Answer: shard by user_id hash — conversations stay on same shard)

  3. What's the difference between vertical partitioning and horizontal partitioning?
     (Vertical = split by COLUMNS into multiple tables; Horizontal = split by ROWS = sharding)

  4. Why is consistent hashing better than naive hash sharding for a distributed cache?
     (Answer: adding/removing nodes only remaps 1/N of keys, not all keys)
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: SQL DEEP DIVE (patterns interviewers ask you to write)
// ════════════════════════════════════════════════════════════════════════════

/*
  KNOW THESE QUERY PATTERNS COLD:

  1. WINDOW FUNCTIONS (common in data-heavy interviews):
*/

// EXAMPLE: Rank users by score within each department:
// SELECT name, dept, score,
//   RANK() OVER (PARTITION BY dept ORDER BY score DESC) AS rank
// FROM users;

// EXAMPLE: Running total:
// SELECT date, amount,
//   SUM(amount) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING) AS running_total
// FROM sales;

// EXAMPLE: Find users who made a purchase in the last 7 days but not 30 days ago:
// SELECT DISTINCT user_id FROM orders
// WHERE created_at >= NOW() - INTERVAL '7 days'
// AND user_id NOT IN (
//   SELECT user_id FROM orders
//   WHERE created_at BETWEEN NOW() - INTERVAL '30 days' AND NOW() - INTERVAL '7 days'
// );

/*
  2. COMMON TABLE EXPRESSIONS (CTEs):
*/
// WITH active_users AS (
//   SELECT user_id, COUNT(*) as action_count
//   FROM events
//   WHERE event_date >= NOW() - INTERVAL '30 days'
//   GROUP BY user_id
//   HAVING COUNT(*) >= 5
// )
// SELECT u.name, a.action_count
// FROM users u
// JOIN active_users a ON u.id = a.user_id;

/*
  3. EXPLAIN / QUERY OPTIMISATION:
    EXPLAIN SELECT ... → shows the query plan. Look for:
      Seq Scan (full table scan) → needs an index
      Index Scan → good, using index
      Hash Join / Nested Loop / Merge Join → understand their trade-offs

  INDEX TRADE-OFFS TABLE:
  ──────────────────────────────────────────────────────────────
  Operation            With Index     Without Index
  Read (by key)        O(log n)       O(n)
  Range query          O(log n + k)   O(n)
  Write (insert)       O(log n) extra O(1) extra
  Write (update key)   O(log n) extra O(1) extra
  Storage              Extra ~20-30%  None
*/

console.log("Sheet 2 (Databases) loaded. Complete the self-test in Section 3 before moving on.");
console.log("Next: sd_03_caching.js\n");
