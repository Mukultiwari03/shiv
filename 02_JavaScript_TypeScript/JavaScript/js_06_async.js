// ============================================================================
//  JAVASCRIPT — SHEET 6: ASYNCHRONOUS JAVASCRIPT
//  Goal: Master the event loop, callbacks, Promises, and async/await.
//        Async is tested in EVERY senior-level JS interview.
// ============================================================================
//
//  HOW TO RUN:
//    node js_06_async.js
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: THE EVENT LOOP (THEORY — MOST IMPORTANT)
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: JavaScript is single-threaded. It can only do one thing at a time.
//  Yet it handles timers, network requests, and user events without blocking.
//  This is possible because of the EVENT LOOP.
//
//  The key components:
//
//    CALL STACK     — where synchronous code runs. When a function is called, it
//                     is pushed onto the stack. When it returns, it is popped off.
//
//    WEB APIs       — browser (or Node.js) handles async work here:
//                     setTimeout, fetch, DOM events, file system, etc.
//                     These run OUTSIDE the JS engine.
//
//    CALLBACK QUEUE (macrotask queue)
//                   — when async work completes (e.g. timer fires), the callback
//                     is placed HERE to wait.
//
//    MICROTASK QUEUE
//                   — higher priority than the callback queue.
//                     Promise .then() handlers and queueMicrotask() go here.
//                     ALL microtasks run to completion before the next macrotask.
//
//    EVENT LOOP     — continuously checks: if the call stack is EMPTY, grab the
//                     next task from microtask queue (drain it fully first), then
//                     grab one from the callback queue.
//
//  EXECUTION ORDER:
//    1. Synchronous code (call stack)
//    2. Microtasks (Promise callbacks, queueMicrotask)   ← runs BEFORE...
//    3. Macrotasks (setTimeout, setInterval, I/O)
//
//  INTERVIEW TIP: "What is the event loop?" is one of the most common JS questions.
//  Explain the three queues and the priority order.

// EXERCISE 1.1 — Predict the exact output ORDER before running.
// Write your prediction as a comment, then run to verify.

console.log("1 - start");

setTimeout(() => console.log("2 - setTimeout"), 0);

Promise.resolve().then(() => console.log("3 - Promise 1"));

Promise.resolve().then(() => {
  console.log("4 - Promise 2");
  Promise.resolve().then(() => console.log("5 - nested Promise"));
});

console.log("6 - end");
// 1 6  3 4 5 2
// Your predicted order: ?, ?, ?, ?, ?, ?
// Actual order:         1, 6, 3, 4, 5, 2
// Key insight: setTimeout(fn, 0) is STILL a macrotask — Promise callbacks run first.


// EXERCISE 1.2 — More complex prediction.
console.log("\n--- Exercise 1.2 ---");

setTimeout(() => console.log("timeout A"), 0);
setTimeout(() => console.log("timeout B"), 0);

Promise.resolve().then(() => {
    console.log("promise A"); 
    setTimeout(() => console.log("timeout C (from promise)"), 0);
  }).then(() => console.log("promise B"));

console.log("sync end");

// YOUR PREDICTION (write before running):
// 1.2 sync end promise c a b 

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: PROMISES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: A Promise represents a value that will be available in the future.
//  It can be in one of three states:
//    pending    — initial state, neither fulfilled nor rejected
//    fulfilled  — operation completed successfully, has a value
//    rejected   — operation failed, has a reason (error)
//  Once settled (fulfilled or rejected), a Promise is immutable — state never changes again.
//
//  Creating a Promise:
//    new Promise((resolve, reject) => {
//      // async work here
//      if (success) resolve(value);
//      else reject(new Error("something went wrong"));
//    });
//
//  Consuming:
//    promise
//      .then(value => ...)   // runs on fulfil
//      .catch(err => ...)    // runs on rejection
//      .finally(() => ...)   // ALWAYS runs (cleanup)
//
//  Chaining: .then() returns a NEW Promise, allowing chaining.
//  If you return a value from .then(), the next .then() receives it.
//  If you return a Promise, the chain waits for it.
//
//  INTERVIEW TIP: "What happens if you forget to return inside .then()?"
//  The next .then() gets undefined. Always be deliberate about returns in chains.

// EXERCISE 2.1 — Promisify a callback function.
// Convert this callback-based function to return a Promise.

function fetchUserCallback(id, callback) {
  setTimeout(() => {
    if (id <= 0) callback(new Error("Invalid ID"), null);
    else callback(null, { id, name: `User ${id}`, email: `user${id}@test.com` });
  }, 50);
}

function fetchUser(id) {
  // YOUR CODE HERE: return new Promise(...)
}

fetchUser(1)
  .then(user => console.log("Fetched:", user.name))
  .catch(err => console.log("Error:", err.message));

fetchUser(-1)
  .then(user => console.log("Should not run"))
  .catch(err => console.log("Caught:", err.message)); // "Invalid ID"


// EXERCISE 2.2 — Promise chaining.
// Simulate a pipeline: fetch user → fetch their orders → calculate total.
// Each step returns a Promise. Chain them with .then().

function getUser(id) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ id, name: "Swastik" }), 30)
  );
}
function getOrders(user) {
  return new Promise(resolve =>
    setTimeout(() => resolve([{ item: "Laptop", price: 1200 }, { item: "Mouse", price: 50 }]), 30)
  );
}
function calcTotal(orders) {
  return orders.reduce((sum, o) => sum + o.price, 0);
}

// YOUR CODE HERE: Chain getUser(1) → getOrders → calcTotal → log total
// Expected: Total: 1250


// EXERCISE 2.3 — Error handling in chains.
function riskyOperation(value) {
  return new Promise((resolve, reject) => {
    if (value < 0) reject(new Error(`Negative value: ${value}`));
    else resolve(value * 2);
  });
}

// YOUR CODE HERE: Chain three calls to riskyOperation: 5 → 3 → -1
// Catch the error and log it gracefully.
// Use .finally() to log "Pipeline complete" regardless.


console.log("=== Section 2 done (check async output above) ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: PROMISE COMBINATORS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Running multiple promises in parallel.
//
//  Promise.all([p1, p2, p3])
//    → Waits for ALL to fulfil. Returns array of results in same order.
//    → If ANY rejects, immediately rejects with that error (fail-fast).
//    → Use when you need all results and any failure should abort.
//
//  Promise.allSettled([p1, p2, p3])
//    → Waits for ALL to settle (fulfil OR reject). NEVER rejects itself.
//    → Returns array of { status: "fulfilled", value } or { status: "rejected", reason }
//    → Use when you want results of all, even if some fail.
//
//  Promise.race([p1, p2, p3])
//    → Settles as soon as the FIRST one settles (fulfil or reject).
//    → Use for timeouts or taking the fastest of multiple sources.
//
//  Promise.any([p1, p2, p3])
//    → Fulfils as soon as the FIRST one FULFILS. Ignores rejections.
//    → Rejects only if ALL reject (AggregateError).
//    → Use when you want the first success.

function delay(ms, value, shouldFail = false) {
  return new Promise((resolve, reject) =>
    setTimeout(() => shouldFail ? reject(new Error(`Failed: ${value}`)) : resolve(value), ms)
  );
}

// EXERCISE 3.1 — Promise.all.
// Fetch three resources in parallel and log all results.

async function parallelAll() {
  // YOUR CODE HERE: Promise.all([delay(30,"A"), delay(20,"B"), delay(40,"C")])
  // Log the results array
}
parallelAll();


// EXERCISE 3.2 — Promise.allSettled.
// Run promises where one will fail. Log each result's status.

async function handleMixed() {
  const results = await Promise.allSettled([
    delay(20, "ok1"),
    delay(30, "fail", true),  // this one rejects
    delay(10, "ok2"),
  ]);
  // YOUR CODE HERE: iterate results and log "✓ value" or "✗ reason"
}
handleMixed();


// EXERCISE 3.3 — Implement a timeout wrapper.
// Write `withTimeout(promise, ms)` that races a promise against a timer.
// If the timer fires first, reject with Error("Timeout after Xms").

function withTimeout(promise, ms) {
  // YOUR CODE HERE: Promise.race([promise, new Promise(reject after ms)])
}

// Test:
withTimeout(delay(50, "data"), 100).then(v => console.log("Got:", v));
withTimeout(delay(200, "data"), 100).catch(e => console.log("Timed out:", e.message));

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: async / await
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: async/await is syntactic sugar over Promises.
//  It makes async code look and behave like synchronous code.
//
//    async function fetchData() {
//      const user = await getUser(1);       // pauses here until resolved
//      const orders = await getOrders(user);
//      return orders;
//    }
//
//  Rules:
//    • `await` can ONLY be used inside an `async` function.
//    • `await` pauses execution of the CURRENT function — it does NOT block the thread.
//      Other code (event loop) continues running while waiting.
//    • An `async` function always returns a Promise.
//      If you return a value, it's wrapped in Promise.resolve(value).
//
//  Error handling: use try/catch (much cleaner than .catch() chains).
//
//    async function fetchData(id) {
//      try {
//        const user = await getUser(id);
//        return user;
//      } catch (err) {
//        console.error("Failed:", err.message);
//      }
//    }
//
//  COMMON MISTAKE — Sequential when you mean parallel:
//    // SLOW — each awaits before the next starts:
//    const a = await fetchA();
//    const b = await fetchB();
//
//    // FAST — both start at the same time:
//    const [a, b] = await Promise.all([fetchA(), fetchB()]);

// EXERCISE 4.1 — Rewrite the chain from 2.2 using async/await.

async function loadUserTotal() {
  // YOUR CODE HERE: await getUser(1), then getOrders, then calcTotal, log result
}
loadUserTotal();


// EXERCISE 4.2 — Error handling with try/catch.
async function safeLoad(userId) {
  try {
    // YOUR CODE HERE: await fetchUser(userId), log the user
  } catch (err) {
    // YOUR CODE HERE: log "Error loading user: " + err.message
  } finally {
    // YOUR CODE HERE: log "Load attempt finished"
  }
}
safeLoad(1);
safeLoad(-5);


// EXERCISE 4.3 — Sequential vs Parallel (IMPORTANT interview topic).
function slowFetch(label, ms) {
  return new Promise(resolve => setTimeout(() => resolve(label), ms));
}

async function sequential() {
  const start = Date.now();
  const a = await slowFetch("A", 100);
  const b = await slowFetch("B", 100);
  const c = await slowFetch("C", 100);
  console.log(`Sequential: ${Date.now() - start}ms`, [a, b, c]); // ~300ms
}

async function parallel() {
  const start = Date.now();
  const [a, b, c] = await Promise.all([
    slowFetch("A", 100),
    slowFetch("B", 100),
    slowFetch("C", 100),
  ]);
  console.log(`Parallel: ${Date.now() - start}ms`, [a, b, c]); // ~100ms
}

sequential();
parallel();


// EXERCISE 4.4 — async iteration (common in real apps).
// Write an async function `processItems(ids)` that:
//   - Processes each id ONE AT A TIME (sequential — order matters)
//   - Fetches each user with fetchUser(id)
//   - Returns array of user names

async function processItems(ids) {
  // YOUR CODE HERE: use for...of + await
}

processItems([1, 2, 3]).then(names => console.log("Processed:", names));

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: MINI CHALLENGE — ASYNC PATTERNS
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 5.1 — Retry logic.
// Write `retry(fn, maxAttempts)` that retries a failing async function
// up to maxAttempts times. Throw the last error if all attempts fail.

async function retry(fn, maxAttempts) {
  // YOUR CODE HERE
}

let callCount = 0;
const flaky = () => new Promise((resolve, reject) => {
  callCount++;
  if (callCount < 3) reject(new Error(`Attempt ${callCount} failed`));
  else resolve("Success!");
});

async function testRetry() {
  callCount = 0;
  const result = await retry(flaky, 5);
  console.log("Retry result:", result); // "Success!" on 3rd try
}
testRetry();


// CHALLENGE 5.2 — Concurrent pool.
// Run promises with a maximum concurrency of N at a time.
// `pooledMap(items, asyncFn, limit)` — process items with at most `limit` in parallel.

async function pooledMap(items, asyncFn, limit) {
  // YOUR CODE HERE
  // Hint: Use a queue approach — start `limit` promises, each time one finishes, start the next.
}

async function testPool() {
  const start = Date.now();
  const ids = [1, 2, 3, 4, 5];
  const results = await pooledMap(ids, id => slowFetch(`user${id}`, 100), 2);
  // With 5 items, concurrency 2: batches [1,2], [3,4], [5] → ~300ms
  console.log(`Pool (limit 2): ${Date.now() - start}ms, results:`, results);
}
testPool();


// CHALLENGE 5.3 — Cache async results.
// Write `createAsyncCache(asyncFn)` that wraps an async function.
// First call for a given argument executes the function.
// Subsequent calls with the same argument return the CACHED Promise (not re-executed).

function createAsyncCache(asyncFn) {
  // YOUR CODE HERE
}

let fetchCount = 0;
const cachedFetch = createAsyncCache((id) => {
  fetchCount++;
  return delay(50, { id, name: `User ${id}` });
});

async function testCache() {
  fetchCount = 0;
  await Promise.all([cachedFetch(1), cachedFetch(1), cachedFetch(1)]);
  console.log("Cache: fetch count should be 1:", fetchCount); // 1
  await cachedFetch(2);
  console.log("Cache: after fetching id 2, count should be 2:", fetchCount); // 2
}
testCache();

console.log("=== Sheet 6 complete! Move on to js_07_advanced.js ===\n");
