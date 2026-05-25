// ============================================================================
//  SYSTEM DESIGN — SHEET 4: API DESIGN
//  Goal: Know REST deeply, understand GraphQL and gRPC trade-offs,
//        and design APIs that are secure, scalable, and maintainable.
// ============================================================================

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: REST API DESIGN
// ════════════════════════════════════════════════════════════════════════════

/*
  REST (Representational State Transfer):
  ─────────────────────────────────────────────────────────────────────────
  Stateless, resource-oriented. Resources are nouns, HTTP methods are verbs.

  HTTP METHODS:
    GET    → Read. Idempotent. Safe (no side effects). Cacheable.
    POST   → Create. Not idempotent (call twice → two resources created).
    PUT    → Full update/replace. Idempotent (same result each call).
    PATCH  → Partial update. Not necessarily idempotent.
    DELETE → Delete. Idempotent.

  INTERVIEW TIP: "What is idempotency?"
  An operation is idempotent if calling it N times has the same effect as 1 time.
  GET, PUT, DELETE are idempotent. POST and PATCH are not.
  Why it matters: If a POST request times out, can you safely retry it?
  No — you might create two records. That's why payment APIs use idempotency keys.

  ─────────────────────────────────────────────────────────────────────────

  URL DESIGN:
  ────────────
  ✓ Use nouns, not verbs:
    Good:  GET /users/123/posts
    Bad:   GET /getUserPosts?id=123

  ✓ Use plural nouns:
    Good:  /users, /posts, /comments
    Bad:   /user, /post

  ✓ Nested resources for relationships:
    GET    /users/:userId/posts          — all posts by user
    GET    /users/:userId/posts/:postId  — specific post by user
    POST   /users/:userId/posts          — create post for user
    DELETE /users/:userId/posts/:postId  — delete user's post

  ✓ Query params for filtering, sorting, pagination:
    GET /posts?status=published&sort=createdAt&order=desc&limit=20&offset=40

  ✓ Versioning in the URL:
    /api/v1/users — clients pinned to a version, new versions don't break old clients.

  ─────────────────────────────────────────────────────────────────────────

  HTTP STATUS CODES (know the key ones):
  ──────────────────────────────────────
  2xx — Success:
    200 OK              — Standard success (GET, PUT, PATCH, DELETE)
    201 Created         — Resource created (POST)
    204 No Content      — Success but no body (DELETE)

  3xx — Redirection:
    301 Moved Permanently
    302 Found (temporary redirect)
    304 Not Modified    — Client cache is still valid (conditional GET)

  4xx — Client Error:
    400 Bad Request     — Malformed request body or invalid params
    401 Unauthorized    — Not authenticated (no token or expired)
    403 Forbidden       — Authenticated but not authorised for this resource
    404 Not Found       — Resource doesn't exist
    409 Conflict        — Conflict (e.g., duplicate email on registration)
    422 Unprocessable Entity — Validation errors
    429 Too Many Requests   — Rate limited

  5xx — Server Error:
    500 Internal Server Error — Unexpected server crash
    502 Bad Gateway     — Upstream server returned invalid response
    503 Service Unavailable — Server overloaded or down for maintenance
    504 Gateway Timeout — Upstream server didn't respond in time

  ─────────────────────────────────────────────────────────────────────────

  PAGINATION:
  ──────────────────────────────────────────────────────────────────────────
  Three common approaches:

  1. OFFSET-BASED:
     GET /posts?limit=20&offset=40
     ✓ Simple. Random access to any page.
     ✗ Inconsistent: if items are added/deleted, pages shift. "Page drift."
     ✗ Slow on deep pages: DB must scan offset rows to discard them.

  2. CURSOR-BASED (Keyset Pagination):
     GET /posts?limit=20&after=cursor_value
     Cursor is an encoded value (e.g., the created_at timestamp of last item).
     ✓ Stable: insertions/deletions don't affect your position.
     ✓ Fast: DB uses index on cursor column (no offset scan).
     ✗ Can't jump to arbitrary page (must scroll forward/back).
     Used by: Facebook, Twitter, Instagram (infinite scroll).

  3. PAGE-BASED:
     GET /posts?page=3&pageSize=20
     Similar problems to offset-based but friendlier URL.
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: GRAPHQL vs gRPC vs REST
// ════════════════════════════════════════════════════════════════════════════

/*
  REST:
  ─────
  ✓ Universal (every client understands HTTP).
  ✓ Simple to debug (curl, Postman, browser).
  ✓ Cacheable (GET responses cacheable by CDNs).
  ✗ Over-fetching: gets the whole user object even if you just need the name.
  ✗ Under-fetching: need multiple trips to get related data.
  Use: Public APIs, browser-to-server, mobile apps.

  ─────────────────────────────────────────────────────────────────────────

  GraphQL:
  ─────────
  Single endpoint. Client specifies exactly what data it needs in the query.

  query {
    user(id: "123") {
      name
      posts(limit: 5) { title createdAt }
      followers { count }
    }
  }

  ✓ No over-fetching or under-fetching.
  ✓ One trip to get related data (no N+1 trips).
  ✓ Self-documenting (introspection).
  ✗ Complex caching (no simple URL-based caching).
  ✗ N+1 problem at the server level (need DataLoader to batch).
  ✗ Harder to debug than REST.
  ✗ File uploads are awkward.
  Use: Complex data requirements, mobile (bandwidth-sensitive), frontend-driven APIs.
  Companies: Facebook, GitHub, Shopify, Twitter.

  ─────────────────────────────────────────────────────────────────────────

  gRPC:
  ──────
  Protocol Buffers (binary format) over HTTP/2. Define service in .proto files.
  Compiler generates client/server code in any language.

  service UserService {
    rpc GetUser (GetUserRequest) returns (User);
    rpc ListUsers (ListUsersRequest) returns (stream User);
  }

  ✓ Very fast: binary format (10x smaller than JSON), HTTP/2 multiplexing.
  ✓ Streaming: bidirectional streams (chat, real-time updates).
  ✓ Strongly typed contracts. Generated client code.
  ✗ Not browser-friendly (can't call from browser without gRPC-Web).
  ✗ Harder to debug than REST (binary format).
  Use: Microservice-to-microservice communication. Internal APIs. Low latency needed.
  Companies: Google, Netflix, Uber internal services.

  ─────────────────────────────────────────────────────────────────────────

  DECISION GUIDE:
  ────────────────────────────────────────────────────────
  "Public API consumed by external developers?"          → REST
  "Mobile app needing flexible, bandwidth-efficient API?" → GraphQL
  "Microservice internal communication?"                  → gRPC
  "Real-time bidirectional communication?"                → WebSockets / gRPC streaming
  "Simple CRUD with browser clients?"                     → REST
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: RATE LIMITING
// ════════════════════════════════════════════════════════════════════════════

/*
  WHY rate limit?
  ───────────────
  • Prevent abuse (DDoS, credential stuffing, scrapers).
  • Ensure fair usage (one user can't monopolise resources).
  • Protect downstream services (DB, APIs) from overload.

  ALGORITHMS:
  ────────────────────────────────────────────────────────────────────────

  1. TOKEN BUCKET:
     Bucket holds N tokens. Refilled at rate R tokens/second (up to capacity N).
     Each request consumes 1 token. If empty → reject (or queue).
     ✓ Allows bursts (bucket fills up during quiet periods, supports N burst requests).
     Use: API rate limiting where short bursts are OK.

  2. LEAKY BUCKET:
     Requests enter a queue. Processed at a fixed rate (like water leaking from bucket).
     If queue full → reject.
     ✓ Smooths out bursts. Output rate is constant.
     ✗ Recent requests can be delayed if queue is full of old requests.
     Use: Network traffic shaping, payment processing.

  3. FIXED WINDOW COUNTER:
     Count requests per time window (e.g., 100 requests per minute).
     Reset counter at start of each minute.
     ✗ Boundary problem: user can send 100 requests at 11:59 and 100 at 12:00 → 200 in 2 seconds.

  4. SLIDING WINDOW LOG:
     Store timestamp of each request. On new request: remove timestamps older than window.
     Count remaining. If < limit → allow, add timestamp.
     ✓ Precise. No boundary problem.
     ✗ Memory: must store each request timestamp.

  5. SLIDING WINDOW COUNTER:
     Hybrid: current window count + weighted previous window count.
     Formula: rate = prev_count * ((window_size - elapsed) / window_size) + current_count
     ✓ Memory efficient. More accurate than fixed window.

  ─────────────────────────────────────────────────────────────────────────

  IMPLEMENTATION:
  In a distributed system, use Redis for shared state across all servers:
    - INCR + EXPIRE for fixed window (see sd_03_caching.js for sliding window log).
    - Use Lua scripts for atomic check-and-increment.

  RETURNING RATE LIMIT INFO to clients:
    X-RateLimit-Limit: 100          (max requests per window)
    X-RateLimit-Remaining: 45       (remaining in current window)
    X-RateLimit-Reset: 1640000000   (Unix timestamp when window resets)
    Retry-After: 30                 (seconds until retry allowed, on 429)
*/


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: AUTHENTICATION & AUTHORIZATION
// ════════════════════════════════════════════════════════════════════════════

/*
  AUTHENTICATION: Who are you? (identity)
  AUTHORIZATION:  What can you do? (permissions)

  JWT (JSON Web Token):
  ─────────────────────
  Structure: header.payload.signature (Base64 encoded, dot-separated).

  Header:    { alg: "HS256", typ: "JWT" }
  Payload:   { sub: "user_123", role: "admin", exp: 1700000000 }
  Signature: HMAC_SHA256(base64(header) + "." + base64(payload), secret)

  ✓ Stateless: no DB lookup needed to verify. Scales horizontally.
  ✓ Can embed claims (role, permissions) in the token.
  ✗ Can't invalidate before expiry (unless you maintain a blacklist, defeating statelessness).
  ✗ Payload is readable (not encrypted) — don't store sensitive data.

  FLOW:
    Login → server issues JWT → client stores (httpOnly cookie or localStorage).
    Subsequent requests → client sends JWT → server verifies signature.

  ACCESS TOKEN + REFRESH TOKEN:
    Access token: short-lived (15 min). Used for API calls.
    Refresh token: long-lived (7 days). Stored securely. Used only to get new access token.
    On access token expiry → use refresh token to get new access token.
    Revoke refresh token → user is logged out.

  ─────────────────────────────────────────────────────────────────────────

  OAuth 2.0:
  ──────────
  Framework for third-party access delegation.
  "Sign in with Google" — Google acts as Authorization Server.
  Your app gets an access token to call Google APIs on the user's behalf.

  Key roles:
    Resource Owner:  The user (owns their data).
    Client:          Your application.
    Authorization Server: Issues tokens (Google, GitHub, Auth0).
    Resource Server: Hosts the protected data (Google APIs).

  PKCE (Proof Key for Code Exchange): Use for mobile/SPA apps instead of client secrets.

  ─────────────────────────────────────────────────────────────────────────

  SECURITY CHECKLIST:
  ────────────────────
  □ Use HTTPS everywhere (TLS 1.2+).
  □ Hash passwords with bcrypt/argon2 (NOT MD5, NOT SHA-256 alone).
  □ Store JWTs in httpOnly cookies (not localStorage — XSS vulnerable).
  □ Validate all input (SQL injection, XSS, command injection prevention).
  □ Use parameterised queries / prepared statements.
  □ CORS: whitelist specific origins, not *.
  □ Rate limit authentication endpoints (prevent brute force).
  □ Rotate secrets regularly.
  □ Principle of least privilege for service accounts.

  SELF-TEST:
  ──────────
  1. What's the difference between 401 and 403?
  2. Why use a refresh token instead of just making the access token long-lived?
  3. Where should you store JWTs in a browser? Why not localStorage?
  4. Design rate limiting for a login endpoint (max 5 attempts per minute per IP).
  5. A user changes their password. How do you invalidate their existing JWTs?
*/

console.log("Sheet 4 (API Design) loaded. Complete the self-test in Section 4.");
console.log("Next: sd_05_messaging_scalability.js\n");
