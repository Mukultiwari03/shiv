// ============================================================================
//  JAVASCRIPT — SHEET 7: ADVANCED CONCEPTS
//  Goal: Master `this`, call/apply/bind, prototypes, iterators, generators,
//        and modules. These are the deep-cut topics that separate junior
//        from senior/mid-level candidates.
// ============================================================================
//
//  HOW TO RUN:
//    node js_07_advanced.js
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: `this` — THE MOST CONFUSING KEYWORD IN JAVASCRIPT
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: `this` is determined by HOW a function is CALLED, not where it's defined.
//  (Exception: arrow functions — they capture `this` from where they are DEFINED.)
//
//  5 rules for `this` (in priority order):
//
//  1. new binding
//     When a function is called with `new`, `this` = the newly created object.
//       function User(name) { this.name = name; }
//       const u = new User("Alice");   // u.name === "Alice"
//
//  2. Explicit binding (call / apply / bind)
//     You manually set `this`.
//       fn.call(obj, arg1, arg2)
//       fn.apply(obj, [arg1, arg2])
//       const bound = fn.bind(obj)   // returns a NEW function with `this` locked
//
//  3. Implicit binding (method call)
//     The object to the LEFT of the dot is `this`.
//       obj.method()   // `this` inside method = obj
//
//  4. Default binding
//     If no other rule applies, `this` = global (or undefined in strict mode).
//       function greet() { console.log(this); }
//       greet()  // global / undefined (strict)
//
//  5. Arrow function (lexical `this`)
//     Arrow functions DO NOT have their own `this`.
//     They capture `this` from the surrounding lexical scope at DEFINITION time.
//     Cannot be overridden by call/apply/bind.
//
//  INTERVIEW TIP: The most common `this` bug — losing context when passing
//  a method as a callback:
//    const obj = { name: "Alice", greet() { console.log(this.name); } };
//    setTimeout(obj.greet, 100);  // `this` is undefined/global — context lost!
//    Fix: setTimeout(() => obj.greet(), 100)  — arrow keeps outer this
//    Or:  setTimeout(obj.greet.bind(obj), 100)

// EXERCISE 1.1 — Predict `this`.

const timer = {
  seconds: 0,
  start() {
    // Broken: setInterval loses `this`
    // setInterval(function() { this.seconds++; }, 1000); // `this` is global!

    // Fixed: use arrow function
    setInterval(() => { this.seconds++; }, 1000);
  }
};

// Question: Why does the arrow function fix the problem?
// YOUR ANSWER as a comment:


// EXERCISE 1.2 — call, apply, bind.
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const alice = { name: "Alice" };
const bob   = { name: "Bob"   };

// YOUR CODE HERE:
// a) Call introduce with alice as `this`, greeting="Hello", punctuation="!"
// b) Apply introduce with bob as `this`, same args (pass as array)
// c) Create a function `aliceIntro` using bind that permanently binds alice as `this`
//    Then call aliceIntro("Hi", ".")

// Expected:
// "Hello, I'm Alice!"
// "Hello, I'm Bob!"
// "Hi, I'm Alice."


// EXERCISE 1.3 — Implement your own `bind`.
// Write `myBind(fn, context, ...args)` that behaves like Function.prototype.bind.

Function.prototype.myBind = function(context, ...preArgs) {
  // YOUR CODE HERE
  // `this` inside here is the function being bound
};

function multiply(a, b) { return a * b; }
const double = multiply.myBind(null, 2);
assert(double(5), 10, "myBind double(5)");
assert(double(10), 20, "myBind double(10)");


// EXERCISE 1.4 — Losing and restoring context (common pattern).
class Button {
  constructor(label) {
    this.label = label;
    this.clickCount = 0;
  }

  // Broken version (would lose `this` when passed as callback):
  handleClickBroken() {
    this.clickCount++;
    console.log(`${this.label} clicked ${this.clickCount} times`);
  }

  // YOUR CODE HERE: Rewrite handleClick as an arrow function property
  // so it correctly captures `this` regardless of how it's called.
  handleClick = () => {
    // YOUR CODE HERE
  };
}

const btn = new Button("Submit");
const onClick = btn.handleClick;   // context stripped — would fail with regular method
onClick();                         // Should still work with arrow function
onClick();
// "Submit clicked 1 times"
// "Submit clicked 2 times"

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: PROTOTYPES & THE PROTOTYPE CHAIN
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: JavaScript's inheritance model is PROTOTYPE-BASED.
//  Every object has a hidden [[Prototype]] link to another object.
//  Property lookup walks up this chain until it finds the property or hits null.
//
//  Key points:
//    Object.getPrototypeOf(obj)   — get the prototype of an object
//    Object.create(proto)         — create object with a specific prototype
//    obj.__proto__                — direct access (avoid — use getPrototypeOf)
//    hasOwnProperty(key)          — is key on THIS object, not inherited?
//    Object.hasOwn(obj, key)      — modern equivalent of hasOwnProperty
//
//  Classes use prototypes under the hood:
//    class Dog extends Animal { speak() {...} }
//    // dog.speak → looks on dog → not found → looks on Dog.prototype → found!
//    // Dog.prototype.__proto__ === Animal.prototype  → true
//
//  INTERVIEW TIP: "What is prototypal inheritance?"
//  In JS, objects inherit directly from other objects (not from classes).
//  The `class` keyword is syntactic sugar — it builds the prototype chain for you.
//  When you access obj.method, JS walks the [[Prototype]] chain to find it.

// EXERCISE 2.1 — Manual prototype chain (pre-class style).
// Build a prototype chain without using the `class` keyword.

function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);   // call parent constructor
  this.breed = breed;
}
// YOUR CODE HERE:
// a) Set Dog.prototype to inherit from Animal.prototype
//    (Use Object.create — don't just assign directly)
// b) Fix Dog.prototype.constructor to point back to Dog
// c) Add Dog.prototype.bark that returns "${name} barks!"

const dog = new Dog("Rex", "Labrador");
assert(dog.speak(), "Rex makes a sound", "dog inherits speak");
// assert(dog.bark(), "Rex barks!", "dog.bark");
assert(dog instanceof Dog, true, "instanceof Dog");
assert(dog instanceof Animal, true, "instanceof Animal");
assert(Object.hasOwn(dog, "name"), true, "name is own property");
assert(Object.hasOwn(dog, "speak"), false, "speak is NOT own (on prototype)");


// EXERCISE 2.2 — Polluting vs extending prototypes.
// NEVER modify built-in prototypes (Array.prototype, Object.prototype) in real code!
// Understanding why is important for interviews.

// Instead of: Array.prototype.sum = function() { ... }  — BAD
// Do this:
function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
assert(sum([1, 2, 3, 4]), 10, "sum function");


// EXERCISE 2.3 — Object.create for clean prototype chains.
const vehicle = {
  start() { return `${this.type} starting...`; },
  stop()  { return `${this.type} stopping`; },
};

// YOUR CODE HERE:
// Use Object.create(vehicle) to create `car` and `truck`.
// Set their `type` properties to "Car" and "Truck".
// Both should inherit start() and stop() from vehicle.

// assert(car.start(), "Car starting...", "car inherits start");
// assert(truck.stop(), "Truck stopping", "truck inherits stop");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: SYMBOLS, ITERATORS & GENERATORS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Symbols
//  Symbol() creates a UNIQUE, immutable primitive. Two Symbols are never equal.
//    const s1 = Symbol("id");
//    const s2 = Symbol("id");
//    s1 === s2 → false
//  Use case: unique object keys that won't conflict with other code.
//  Well-known symbols: Symbol.iterator, Symbol.toPrimitive, Symbol.toStringTag.
//
//  💡 THEORY: Iterators & the Iteration Protocol
//  An object is ITERABLE if it has a [Symbol.iterator]() method that returns an ITERATOR.
//  An ITERATOR is an object with a next() method that returns { value, done }.
//    { value: <next value>, done: false }  — more values to come
//    { value: undefined,    done: true  }  — exhausted
//
//  Built-in iterables: Array, String, Map, Set, arguments, NodeList.
//  for...of loops, spread [...], and destructuring all use the iterator protocol.
//
//  💡 THEORY: Generators
//  A generator function (function*) returns a Generator object.
//  `yield` pauses execution and returns a value. `next()` resumes it.
//  Generators are lazy — they compute values on demand.

// EXERCISE 3.1 — Custom iterator.
// Make a `Range` class iterable using Symbol.iterator.
// Usage: for (const n of new Range(1, 5)) logs 1, 2, 3, 4, 5

class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    // YOUR CODE HERE: return an iterator object with next()
    let current = this.start;
    const end = this.end;
    return {
      next() {
        // YOUR CODE HERE
      }
    };
  }
}

const range = new Range(1, 5);
const rangeArr = [...range];
assert(rangeArr, [1, 2, 3, 4, 5], "Range iterator");
for (const n of new Range(10, 12)) {
  process.stdout.write(n + " "); // 10 11 12
}
console.log();


// EXERCISE 3.2 — Generator function.
// Write a generator `infiniteCounter(start = 0)` that yields start, start+1, start+2, ...
// It never returns — it generates values on demand (lazy infinite sequence).

function* infiniteCounter(start = 0) {
  // YOUR CODE HERE: while(true) { yield ... }
}

const gen = infiniteCounter(5);
assert(gen.next().value, 5, "gen first value");
assert(gen.next().value, 6, "gen second value");
assert(gen.next().value, 7, "gen third value");


// EXERCISE 3.3 — Generator for finite sequences.
// Write a generator `take(iterable, n)` that yields the first n values from any iterable.

function* take(iterable, n) {
  // YOUR CODE HERE
}

assert([...take([10, 20, 30, 40, 50], 3)], [10, 20, 30], "take 3");
assert([...take(new Range(1, 100), 5)], [1, 2, 3, 4, 5], "take 5 from Range");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: MAP, SET, WEAKMAP, WEAKSET
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Better data structures than plain objects/arrays in some cases.
//
//  Map    — key-value store where keys can be ANY type (objects, functions, etc.)
//           Maintains INSERTION ORDER. Has .size property.
//           Better than objects when keys are not strings, or when order matters.
//
//  Set    — collection of UNIQUE values. No duplicates.
//           Has .size, .has(), .add(), .delete(). Iterable.
//           Great for deduplication.
//
//  WeakMap — like Map but keys must be OBJECTS, and holds weak references.
//            Not iterable, no .size. Keys can be garbage-collected if no other reference.
//            Use case: caching data tied to object lifetime (e.g. DOM node metadata).
//
//  WeakSet — like Set but holds objects as weak references.
//            Not iterable. Use case: tracking visited objects without memory leaks.

// EXERCISE 4.1 — Map vs Object.
// When should you use Map instead of a plain object?
// Use Map when: keys are not strings, order matters, or you need .size.

const wordCount = new Map();
const text = "the quick brown fox jumps over the lazy dog the fox";

// YOUR CODE HERE: Count word frequencies using a Map.
text.split(" ").forEach(word => {
  // ...
});

assert(wordCount.get("the"), 3, "wordCount the");
assert(wordCount.get("fox"), 2, "wordCount fox");


// EXERCISE 4.2 — Set for deduplication.
const arr = [1, 2, 3, 2, 4, 1, 5, 3];

// YOUR CODE HERE: Remove duplicates from arr using Set.
const unique = /* YOUR CODE */ arr;
assert(unique, [1, 2, 3, 4, 5], "unique with Set");


// EXERCISE 4.3 — Set operations.
// Write functions for union, intersection, and difference of two sets.

function union(setA, setB) {
  // YOUR CODE HERE
}
function intersection(setA, setB) {
  // YOUR CODE HERE
}
function difference(setA, setB) {
  // Values in setA but NOT in setB
  // YOUR CODE HERE
}

const s1 = new Set([1, 2, 3, 4]);
const s2 = new Set([3, 4, 5, 6]);

assert([...union(s1, s2)].sort((a,b)=>a-b), [1,2,3,4,5,6], "union");
assert([...intersection(s1, s2)].sort((a,b)=>a-b), [3, 4], "intersection");
assert([...difference(s1, s2)].sort((a,b)=>a-b), [1, 2], "difference");

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: PROXY & REFLECT (ADVANCED)
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Proxy lets you intercept and customise fundamental object operations.
//
//    const proxy = new Proxy(target, handler);
//
//  Handler traps (most common):
//    get(target, key)            — intercept property read
//    set(target, key, value)     — intercept property write (return true if success)
//    has(target, key)            — intercept `in` operator
//    deleteProperty(target, key) — intercept `delete`
//    apply(target, ctx, args)    — intercept function calls
//
//  Reflect mirrors every Proxy trap. It's best practice to call Reflect inside
//  traps to perform the default operation:
//    get(target, key) { return Reflect.get(target, key); }

// EXERCISE 5.1 — Validation proxy.
// Create a proxy for a user object that:
//   - Throws if you try to set `age` to a non-number or negative value
//   - Logs every property access: "Getting: <key>"
//   - Prevents deletion of `id`

function createValidatedUser(data) {
  return new Proxy(data, {
    get(target, key) {
      // YOUR CODE HERE: log and return
    },
    set(target, key, value) {
      // YOUR CODE HERE: validate age
    },
    deleteProperty(target, key) {
      // YOUR CODE HERE: protect id
    }
  });
}

const vUser = createValidatedUser({ id: 1, name: "Swastik", age: 21 });
console.log(vUser.name); // "Getting: name", then "Swastik"

try {
  vUser.age = -5;
} catch (e) {
  console.log("✓ Age validation:", e.message);
}

try {
  delete vUser.id;
} catch (e) {
  console.log("✓ Delete protection:", e.message);
}

console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: MINI CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 6.1 — Implement a pipeline operator using reduce.
// `pipe(...fns)` returns a function that passes a value through each fn in order.

function pipe(...fns) {
  // YOUR CODE HERE
}

const process = pipe(
  x => x * 2,
  x => x + 10,
  x => `Result: ${x}`
);
assert(process(5), "Result: 20", "pipe");


// CHALLENGE 6.2 — Observable (simplified reactive pattern).
// Create an `Observable` class that:
//   - Takes a subscriber function in the constructor
//   - Has a `subscribe(observer)` method
//     - observer = { next(val), error(err), complete() }
//   - Calling subscribe triggers the subscriber function

class Observable {
  constructor(subscriberFn) {
    this._subscriberFn = subscriberFn;
  }

  subscribe(observer) {
    // YOUR CODE HERE
  }
}

const obs = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

const received = [];
obs.subscribe({
  next: (val) => received.push(val),
  error: (err) => console.error(err),
  complete: () => console.log("Complete! Received:", received),
});
assert(received, [1, 2, 3], "Observable received values");

console.log("=== Sheet 7 complete! Move on to js_08_interview_patterns.js ===\n");
