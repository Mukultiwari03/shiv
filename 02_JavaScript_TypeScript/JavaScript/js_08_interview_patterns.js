// ============================================================================
//  JAVASCRIPT — SHEET 8: INTERVIEW PATTERNS & COMMON PROBLEMS
//  Goal: The most-asked JS coding questions in technical interviews.
//        These patterns appear across companies — know all of them cold.
// ============================================================================
//
//  HOW TO RUN:
//    node js_08_interview_patterns.js
//
//  STRATEGY:
//    - Read the problem description carefully.
//    - Attempt the solution before reading the hints.
//    - Understand WHY the pattern works, not just how.
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: DEBOUNCE & THROTTLE
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Both limit how often a function runs, but differently.
//
//  DEBOUNCE — delays execution until the function STOPS being called for a period.
//  Use case: search input (don't hit API on every keystroke — wait until user pauses).
//
//    Timeline: calls at t=0, t=50, t=100, t=200ms, delay=150ms
//    Without debounce: fires 4 times
//    With debounce:    fires ONCE — at t=350ms (200 + 150)
//
//  THROTTLE — ensures function runs at most once per time window.
//  Use case: scroll event, resize event (run at most once every 100ms).
//
//    Timeline: calls at t=0,50,100,150,200ms, window=100ms
//    Without throttle: fires 5 times
//    With throttle:    fires at t=0, t=100, t=200 → 3 times

// EXERCISE 1.1 — Implement debounce.
// `debounce(fn, delay)` — returns a function that fires `fn` only if `delay`ms
// have passed since the last call.

function debounce(fn, delay) {
  // YOUR CODE HERE
  // Hint: use a timer variable and clearTimeout/setTimeout
}

// EXERCISE 1.2 — Implement throttle (leading edge).
// `throttle(fn, window)` — returns a function that fires at most once per `window`ms.
// Leading edge: fires on the FIRST call, then ignores calls until window expires.

function throttle(fn, window) {
  // YOUR CODE HERE
  // Hint: track the last time it was called
}

// Test (timing-based — run and verify manually):
let debounceCount = 0;
const debouncedFn = debounce(() => debounceCount++, 100);
debouncedFn(); debouncedFn(); debouncedFn(); // rapid calls
setTimeout(() => console.log("Debounce count (expect 1):", debounceCount), 250);

let throttleCount = 0;
const throttledFn = throttle(() => throttleCount++, 100);
throttledFn(); throttledFn(); throttledFn(); // rapid calls
setTimeout(() => console.log("Throttle count (expect 1):", throttleCount), 50);

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: DEEP CLONE
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Shallow copy shares references to nested objects.
//  Deep clone creates completely independent copies.
//
//  Methods & trade-offs:
//    JSON.parse(JSON.stringify(obj))
//      ✓ Simple, handles most cases
//      ✗ Loses: functions, undefined, Symbol, Date, Map, Set, circular refs
//
//    structuredClone(obj)   (modern browsers/Node 17+)
//      ✓ Handles more types (Date, Map, Set, circular)
//      ✗ Still drops functions
//
//    Custom recursive function
//      ✓ Full control
//      ✗ You have to handle everything yourself
//
//  INTERVIEW TIP: Know when shallow copy is enough (immutable data, no nesting)
//  vs when you need deep clone (nested mutable structures).

// EXERCISE 2.1 — Implement deepClone.
// Handle: primitives, arrays, plain objects, Date, null.
// (Don't worry about Map/Set/functions for this exercise.)

function deepClone(value) {
  // YOUR CODE HERE
  // Hint: check type, handle Date, Array, Object recursively
}

const original = {
  name: "Swastik",
  scores: [95, 87, 92],
  meta: { created: new Date("2024-01-01"), tags: ["js", "ts"] }
};

const clone = deepClone(original);
clone.scores.push(100);
clone.meta.tags.push("react");
clone.name = "Changed";

assert(original.name, "Swastik", "original name unchanged");
assert(original.scores.length, 3, "original scores unchanged");
assert(original.meta.tags.length, 2, "original tags unchanged");
assert(clone.scores.length, 4, "clone scores updated");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CURRYING
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Currying transforms a function that takes multiple arguments into
//  a sequence of functions each taking ONE argument.
//
//    add(2, 3)           // regular
//    curry(add)(2)(3)    // curried
//
//  Practical use:
//    const addTax = curry(add)(0.1);  // partially applied
//    addTax(100) → 10.1
//    addTax(200) → 20.1
//
//  Currying enables:
//    • Partial application (fix some args, supply the rest later)
//    • Point-free style: compose(double, addTax, format)
//    • Reusable specialised functions from generic ones

// EXERCISE 3.1 — Manual currying.
// Write `curry(fn)` that takes a function of any arity and returns a curried version.
// The curried function accumulates arguments until it has enough to call fn.

function curry(fn) {
  // YOUR CODE HERE
  // Hint: fn.length gives the number of expected parameters.
  // Check: if we have enough args, call fn. Otherwise return another function.
}

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

assert(curriedAdd(1)(2)(3), 6, "curry one at a time");
assert(curriedAdd(1, 2)(3), 6, "curry partial apply");
assert(curriedAdd(1)(2, 3), 6, "curry other split");
assert(curriedAdd(1, 2, 3), 6, "curry all at once");


// EXERCISE 3.2 — Practical curried utilities.
// Build these curried functions using your curry implementation:

const multiply = curry((a, b) => a * b);
const double   = multiply(2);
const triple   = multiply(3);

assert(double(5), 10, "curried double");
assert(triple(5), 15, "curried triple");

const filter = curry((pred, arr) => arr.filter(pred));
const isEven = x => x % 2 === 0;
const getEvens = filter(isEven);

assert(getEvens([1,2,3,4,5,6]), [2,4,6], "curried filter evens");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: COMPOSE & PIPE
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY:
//  compose(f, g, h)(x)  → f(g(h(x)))  — right to left
//  pipe(f, g, h)(x)     → h(g(f(x)))  — left to right (more readable)
//
//  Both are about function composition — chaining transformations clearly.
//  pipe is more popular in modern code (data flows left to right, easy to read).

// EXERCISE 4.1 — Implement compose and pipe.

function compose(...fns) {
  // YOUR CODE HERE: reduce right
}

function pipe(...fns) {
  // YOUR CODE HERE: reduce left
}

const transform = pipe(
  x => x.trim(),
  x => x.toLowerCase(),
  x => x.replace(/\s+/g, "-"),
);
assert(transform("  Hello World  "), "hello-world", "pipe transform");

const transformCompose = compose(
  x => x.replace(/\s+/g, "-"),
  x => x.toLowerCase(),
  x => x.trim(),
);
assert(transformCompose("  Hello World  "), "hello-world", "compose transform");

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: CLASSIC ARRAY/STRING PROBLEMS
// ════════════════════════════════════════════════════════════════════════════
//
//  These come up constantly. Know them by heart.

// EXERCISE 5.1 — Remove duplicates from an array (3 approaches).
// Approach 1: Set
// Approach 2: filter + indexOf
// Approach 3: reduce

function uniqueSet(arr) { /* YOUR CODE */ }
function uniqueFilter(arr) { /* YOUR CODE */ }
function uniqueReduce(arr) { /* YOUR CODE */ }

assert(uniqueSet([1,2,2,3,3,3]), [1,2,3], "uniqueSet");
assert(uniqueFilter([1,2,2,3,3,3]), [1,2,3], "uniqueFilter");
assert(uniqueReduce([1,2,2,3,3,3]), [1,2,3], "uniqueReduce");


// EXERCISE 5.2 — Flatten an array to any depth (already in Sheet 3, recap here).
function flatten(arr) { /* YOUR CODE: recursive */ }
assert(flatten([1, [2, [3, [4, [5]]]]]), [1,2,3,4,5], "flatten deep");


// EXERCISE 5.3 — Count character frequency in a string.
function charFrequency(str) {
  // YOUR CODE HERE: return an object { char: count }
}
assert(charFrequency("hello"), { h:1, e:1, l:2, o:1 }, "charFrequency");


// EXERCISE 5.4 — Check if two strings are anagrams.
function isAnagram(a, b) {
  // YOUR CODE HERE
}
assert(isAnagram("listen", "silent"), true, "anagram true");
assert(isAnagram("hello", "world"), false, "anagram false");
assert(isAnagram("Astronomer", "Moon starer"), true, "anagram case+space");


// EXERCISE 5.5 — Find the most common element.
function mostCommon(arr) {
  // YOUR CODE HERE
}
assert(mostCommon([1, 2, 2, 3, 3, 3, 1, 3]), 3, "mostCommon");


// EXERCISE 5.6 — Group consecutive equal items.
// [1, 1, 2, 3, 3, 1] → [[1,1], [2], [3,3], [1]]
function groupConsecutive(arr) {
  // YOUR CODE HERE
}
assert(groupConsecutive([1,1,2,3,3,1]), [[1,1],[2],[3,3],[1]], "groupConsecutive");

console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: CLASSIC JS GOTCHA QUESTIONS
// ════════════════════════════════════════════════════════════════════════════
//
//  These are "gotcha" questions interviewers love. Understand WHY, not just what.

// EXERCISE 6.1 — typeof null.
// Why does typeof null === "object"?
// YOUR ANSWER:

// EXERCISE 6.2 — [] + [] and [] + {}.
console.log([] + []);    // ""      — both convert to "" then concatenate
console.log([] + {});    // "[object Object]"
console.log({} + []);    // 0 (in some contexts) — {} treated as empty block!
// Explain in comments why each produces its result.


// EXERCISE 6.3 — The famous setTimeout in a loop (closure + var).
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log("var i:", i), 0);
}
// What prints? Fix it using let AND using an IIFE.


// EXERCISE 6.4 — Explain the output.
function outer() {
  let x = 10;
  function inner() { console.log(x); }
  x = 20;
  return inner;
}
const fn = outer();
fn(); // 10 or 20? Why?
// YOUR ANSWER:


// EXERCISE 6.5 — What does this print?
const obj = {
  name: "Outer",
  inner: {
    name: "Inner",
    getName: function() { return this.name; },
    getNameArrow: () => this?.name   // arrow — no own `this`
  }
};
console.log(obj.inner.getName());      // ?
console.log(obj.inner.getNameArrow()); // ?

console.log("=== Section 6 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: FINAL CHALLENGE — BUILD A MINI LODASH
// ════════════════════════════════════════════════════════════════════════════
//
//  Implement these Lodash-style utilities from scratch.
//  These are REAL interview questions at top companies.

// CHALLENGE 7.1 — chunk(array, size)
// Split array into chunks of `size`.
// chunk([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]
function chunk(array, size) {
  // YOUR CODE HERE
}
assert(chunk([1,2,3,4,5], 2), [[1,2],[3,4],[5]], "chunk");
assert(chunk([1,2,3], 1), [[1],[2],[3]], "chunk size 1");


// CHALLENGE 7.2 — zip(arr1, arr2)
// Combine two arrays element-by-element into pairs.
// zip([1,2,3], ["a","b","c"]) → [[1,"a"],[2,"b"],[3,"c"]]
function zip(arr1, arr2) {
  // YOUR CODE HERE
}
assert(zip([1,2,3], ["a","b","c"]), [[1,"a"],[2,"b"],[3,"c"]], "zip");


// CHALLENGE 7.3 — get(obj, path, defaultValue)
// Safely access a nested value by dot-notation path.
// get({ a: { b: { c: 42 } } }, "a.b.c") → 42
// get({ a: 1 }, "a.b.c", "default") → "default"
function get(obj, path, defaultValue = undefined) {
  // YOUR CODE HERE
}
assert(get({ a: { b: { c: 42 } } }, "a.b.c"), 42, "get deep");
assert(get({ a: 1 }, "a.b.c", "fallback"), "fallback", "get missing with default");
assert(get({ a: [1, 2, 3] }, "a.1"), 2, "get array index");


// CHALLENGE 7.4 — set(obj, path, value)
// Set a nested value by dot-notation path. Mutates the object.
// set({}, "a.b.c", 42) → { a: { b: { c: 42 } } }
function set(obj, path, value) {
  // YOUR CODE HERE
}
const target = {};
set(target, "a.b.c", 42);
assert(target, { a: { b: { c: 42 } } }, "set deep");


// CHALLENGE 7.5 — throttle with trailing edge.
// Standard throttle fires on the LEADING edge (first call).
// Write throttle that fires on BOTH leading and trailing edges
// (first call fires immediately, LAST call during cooldown fires after cooldown).
// This is how Lodash's default throttle works.

function throttleLeadTrail(fn, wait) {
  // YOUR CODE HERE
}

console.log("=== Sheet 8 complete! ===\n");
console.log("YOU'VE FINISHED ALL 8 JS SHEETS!");
console.log("Next step: TypeScript sheets (ts_level1_practice.ts, ts_level2_practice.ts)");
console.log("The TS concepts will map directly to everything you've practised here.");
