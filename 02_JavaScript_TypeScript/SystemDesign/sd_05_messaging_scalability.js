// ============================================================================
//  SYSTEM DESIGN — SHEET 5: MESSAGING, MICROSERVICES & SCALABILITY PATTERNS
//  Goal: Know how to decouple services, handle async workflows, and
//        build systems that survive individual component failures.
// ============================================================================

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: MESSAGE QUEUES
// ════════════════════════════════════════════════════════════════════════════

/*
  WHY message queues?
  ───────────────────
  1. DECOUPLING: Producer and consumer don't need to know about each other.
  2. BUFFERING: Handle traffic spikes — queue absorbs burst, consumer processes at its pace.
  3. RELIABILITY: If consumer crashes, message stays in queue until successfully processed.
  4. ASYNC PROCESSING: Don't block the API response on slow work (email, PDF generation).

  WHEN NOT to use queues:
  ✗ When you need a synchronous response (user is waiting for the result).
  ✗ Simple request-response patterns with no fan-out.

  ─────────────────────────────────────────────────────────────────────────

  KEY CONCEPTS:
  ─────────────
  Producer:  Sends messages to the queue.
  Consumer:  Reads and processes messages from the queue.
  Queue:     Ordered buffer. Usually FIFO.
  Topic:     A named channel for pub/sub (Kafka term).
  Partition: Subset of a topic for parallelism.
  Offset:    Position of a message in a partition (Kafka). Consumers track their offset.
  Dead Letter Queue (DLQ): Messages that failed processing N times go here for inspection.

  ─────────────────────────────────────────────────────────────────────────

  RABBITMQ vs KAFKA:
  ─────────────────────────────────────────────────────────────────────────

  RabbitMQ (Traditional Message Broker):
    - Messages are PUSHED to consumers (broker tracks delivery).
    - Messages are DELETED after successful acknowledgement (ACK).
    - Flexible routing: exchanges, routing keys, fanout.
    - Best for: task queues, work distribution, RPC-over-messaging.
    - Use when: you need complex routing, individual message delivery guarantees,
      and messages should be consumed once.

  Kafka (Distributed Event Log):
    - Messages are PULLED by consumers. Consumer tracks its own offset.
    - Messages are RETAINED for a configurable period (default: 7 days).
    - Multiple consumer groups can read the same messages independently.
    - Extremely high throughput: millions of messages/second.
    - Ordered within a partition.
    - Best for: event streaming, audit logs, real-time analytics, event sourcing.
    - Use when: you need replay, multiple independent consumers, huge throughput.

  ─────────────────────────────────────────────────────────────────────────

  DELIVERY GUARANTEES:
  ────────────────────
  At Most Once:    Message delivered 0 or 1 times. May be lost. Fastest.
                   Use: Metrics, logs (loss OK).

  At Least Once:   Message delivered 1 or more times. No loss but may duplicate.
                   Use: Most business events. Handle duplicates at consumer (idempotency).

  Exactly Once:    Delivered exactly 1 time. Slowest. Complex.
                   Use: Financial transactions, inventory updates.
                   Kafka supports exactly-once with transactions.

  IDEMPOTENCY KEY: Include a unique ID in each message.
  Consumer: "Have I processed message ID X?" (check idempotency store before processing).
  If yes: skip. This makes at-least-once delivery safe.

  ─────────────────────────────────────────────────────────────────────────

  INTERVIEW SCENARIO: "How would you handle a slow email sending process?"

  BAD:  POST /register → send email synchronously → user waits 3 seconds.
  GOOD: POST /register → save user to DB → publish "user.registered" event to queue
        → respond 201 immediately → email service consumes event → sends email.
        If email fails → message retried. User already got their response.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: MICROSERVICES
// ════════════════════════════════════════════════════════════════════════════

/*
  MONOLITH vs MICROSERVICES:
  ─────────────────────────────────────────────────────────────────────────

  MONOLITH: Single deployable unit. All features in one codebase.
    ✓ Simple to develop, deploy, test initially.
    ✓ No network hops for internal calls.
    ✓ ACID transactions across all features.
    ✗ Hard to scale individual components.
    ✗ Teams step on each other (merge conflicts, shared deployments).
    ✗ A bug in one area can crash everything.
    Use: Early stage, small teams, undefined domain boundaries.

  MICROSERVICES: Each service owns one domain, deployed independently.
    ✓ Each service scales independently (user service needs more than payment service).
    ✓ Teams own their service end-to-end.
    ✓ Fault isolation (payment service crash doesn't break search).
    ✓ Can use different tech stacks per service.
    ✗ Distributed system complexity (network failures, latency, eventual consistency).
    ✗ Cross-service transactions are hard.
    ✗ Service discovery, observability, and deployment are complex.
    Use: Large teams, well-understood domains, need independent scaling.

  ─────────────────────────────────────────────────────────────────────────

  SERVICE COMMUNICATION PATTERNS:
  ─────────────────────────────────────────────────────────────────────────

  Synchronous (Request-Response):
    REST or gRPC. Service A calls Service B and waits.
    ✓ Simple. Immediate response.
    ✗ Coupling: if Service B is down, Service A fails.
    ✗ Latency adds up with deep chains (A→B→C→D).
    Use: When you need the result immediately.

  Asynchronous (Events/Messages):
    Service A publishes event. Service B consumes when ready.
    ✓ Decoupled. Service B can be down — events queue up.
    ✓ Natural buffering for spikes.
    ✗ More complex to trace and debug.
    ✗ Eventual consistency — data may not be immediately visible.
    Use: When the result isn't needed immediately (email, analytics, notifications).

  ─────────────────────────────────────────────────────────────────────────

  SAGA PATTERN (for distributed transactions):
  ─────────────────────────────────────────────
  No global ACID transaction across microservices. Instead: a SAGA.
  A saga is a sequence of local transactions, each publishing events.
  If a step fails, compensating transactions roll back previous steps.

  Example: Book flight + hotel + car.
    1. Reserve flight → publish "flight.reserved"
    2. Reserve hotel → publish "hotel.reserved"
    3. Reserve car → publish "car.reserved"
    4. If car fails → publish "car.failed"
       → Hotel saga handler: cancel hotel → publish "hotel.cancelled"
       → Flight saga handler: cancel flight → done.

  CHOREOGRAPHY: Each service publishes events and reacts to others' events. No central controller.
  ORCHESTRATION: Central saga orchestrator tells each service what to do.

  ─────────────────────────────────────────────────────────────────────────

  CIRCUIT BREAKER PATTERN:
  ─────────────────────────
  Prevent cascade failures: if Service B is failing, stop Service A from hammering it.

  States:
    CLOSED:   Normal. Requests pass through. Count failures.
    OPEN:     Too many failures. Short-circuit — fail immediately without calling B.
              After timeout: move to HALF_OPEN.
    HALF_OPEN:Test traffic. If success → CLOSED. If failure → OPEN.

  Libraries: Hystrix (Netflix), Resilience4j, Polly (.NET).

  RETRY with EXPONENTIAL BACKOFF + JITTER:
    First retry: wait 1s. Second: 2s. Third: 4s. Add random jitter (±30%).
    Prevents all retrying clients from hammering the server simultaneously.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: SCALABILITY PATTERNS
// ════════════════════════════════════════════════════════════════════════════

/*
  STATELESS vs STATEFUL SERVICES:
  ─────────────────────────────────────────────────────────────────────────
  Stateless: No session data stored on the server. Each request is independent.
    ✓ Horizontally scalable — any server can handle any request.
    ✓ Easy to add/remove servers.
    ✓ No sticky sessions needed.
    How: Store state in Redis/DB. Use JWTs (state in token, not server).

  Stateful: Server stores session data in memory.
    ✗ Sticky sessions required — client must hit same server.
    ✗ Can't easily scale horizontally.
    ✗ Server crash = lost session.
    Use: WebSockets (connection state). Solve with Redis for session sharing.

  ─────────────────────────────────────────────────────────────────────────

  FANOUT PATTERNS:
  ──────────────────────────────────────────────────────────────────────────
  Push Model (fanout-on-write):
    When user A posts → immediately write to all followers' feeds.
    ✓ Fast read: user B opens app, feed is already populated.
    ✗ Slow write: user A has 10M followers → 10M writes.
    Use: Users with moderate follower counts.

  Pull Model (fanout-on-read):
    When user B opens app → query all followees' recent posts.
    ✓ Write is fast: one write.
    ✗ Read is slow: must query N followees and merge.
    Use: Not recommended as primary strategy.

  Hybrid (Twitter's approach):
    Regular users → push model.
    Celebrity accounts (10M+ followers) → pull model for those accounts only.
    Blend celebrity posts into feeds at read time.

  ─────────────────────────────────────────────────────────────────────────

  CDN FOR DYNAMIC CONTENT:
  ──────────────────────────
  Modern CDNs can cache more than just static files.
  Edge computing (Cloudflare Workers, Lambda@Edge) runs code at the CDN edge.
  Use: Personalised but mostly-static content, A/B testing at the edge,
       geolocation-based responses.

  ─────────────────────────────────────────────────────────────────────────

  SELF-TEST:
  ──────────────────────────────────────────────────────────────────────────
  1. When would you choose Kafka over RabbitMQ?
  2. A user places an order. It involves: charging their card, deducting inventory,
     sending confirmation email. Design this as a saga. What compensating transactions exist?
  3. What is the circuit breaker pattern? Describe all three states.
  4. Your auth service is stateful (stores sessions in memory). A deployment requires
     rolling restart of 10 servers. Users get logged out. How do you fix this?
  5. Twitter celebrity problem: Explain the fanout-on-read vs fanout-on-write trade-off
     and how Twitter's hybrid approach works.
*/

console.log("Sheet 5 (Messaging & Scalability) loaded.");
console.log("Next: sd_06_common_designs.js\n");
