// ============================================================================
//  JAVASCRIPT — SHEET 4: OBJECTS
//  Goal: Deeply understand objects — creation, manipulation, iteration,
//        and the built-in Object utility methods used constantly in interviews.
// ============================================================================
//
//  HOW TO RUN:
//    node js_04_objects.js
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: CREATING OBJECTS & MODERN SHORTHAND SYNTAX
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Object creation patterns.
//
//  1. Object literal  — { key: value }   ← most common
//  2. new Object()    — almost never used
//  3. Object.create() — for manual prototype setup (advanced)
//  4. Factory function — a function that returns an object (no `new` needed)
//  5. Class (ES6)     — covered in Sheet 5
//
//  Modern shorthand syntax (ES6):
//
//  Property shorthand:
//    const name = "Swastik";
//    const user = { name };   // same as { name: name }
//
//  Method shorthand:
//    const obj = {
//      greet() { return "hi"; }     // same as greet: function() { ... }
//    };
//
//  Computed property names:
//    const key = "score";
//    const obj = { [key]: 100 };    // { score: 100 }
//    Useful when the key is dynamic (e.g. from a variable or expression).

// EXERCISE 1.1 — Property shorthand.
function createProfile(name, age, city) {
  // YOUR CODE HERE: use shorthand — return { name, age, city }

  return { name, age, city }
}

const profile = createProfile("Swastik", 21, "Sydney");
console.log(profile)
assert(profile, { name: "Swastik", age: 21, city: "Sydney" }, "createProfile");


// EXERCISE 1.2 — Method shorthand.
// Rewrite this object using method shorthand syntax:
const calculator = {
  value: 0,
  add: function (n) { this.value += n; return this; },
  subtract: function (n) { this.value -= n; return this; },
  result: function () { return this.value; }
};

// YOUR CODE HERE: Rewrite `calculator2` using method shorthand.
const calculator2 = {
  // ...
};


// EXERCISE 1.3 — Computed property names.
// Write `buildObject(key, value)` that returns an object using a computed key.
// function buildObject(key, value) {
//   // YOUR CODE HERE
//   return {key:key,value}
// }

// assert(buildObject("score", 100), { score: 100 }, "buildObject score");
// assert(buildObject("name", "Alice"), { name: "Alice" }, "buildObject name");


// EXERCISE 1.4 — Factory function.
// Write `createProduct(name, price, category)` as a factory function.
// Add a method `getLabel()` that returns `"name ($price)"`.
// function createProduct(name, price, category) {
//   // YOUR CODE HERE
// }

// const laptop = createProduct("Laptop", 1200, "electronics");
// console.log(laptop.getLabel()); // "Laptop ($1200)"
// assert(laptop.category, "electronics", "laptop category");

// console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: OBJECT UTILITY METHODS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Essential Object static methods.
//
//  Object.keys(obj)     — returns array of own enumerable KEYS
//  Object.values(obj)   — returns array of own enumerable VALUES
//  Object.entries(obj)  — returns array of [key, value] pairs
//  Object.assign(target, ...sources) — copies properties (SHALLOW, mutates target)
//  Object.freeze(obj)   — prevents any changes (SHALLOW freeze)
//  Object.fromEntries(entries) — opposite of entries; builds object from pairs

//  hasOwnProperty(key)  — checks if object has key as OWN property (not inherited)
//    Modern alternative: Object.hasOwn(obj, key)
// 7. hasOwnProperty(key)
// Checks whether property exists directly in object.
// Syntax
// obj.hasOwnProperty(key)
// Example
// const user = {
//   name: "Aman"
// };
// console.log(user.hasOwnProperty("name"));
// console.log(user.hasOwnProperty("age"));
// Output
// true
// false


//  INTERVIEW TIP: Object.assign does a SHALLOW copy. Nested objects are still
//  shared references. For deep copying see Sheet 8.

const person = {
  name: "Swastik",
  age: 21,
  city: "Sydney",
  role: "Engineer"
};


// EXERCISE 2.1 — keys, values, entries.
// YOUR CODE HERE:
// a) Log all keys of person.
Object.keys(person)
// b) Log all values of person.
Object.values(person)
// c) Log all entries as "key: value" strings using a loop.
let arr = Object.entries(person)
for (let i = 0; i < arr.length; i++) {
  console.log(`${arr[0]}:${arr[1]}`)
}
// d) Use entries + map to produce ["name=Swastik", "age=21", ...]
console.log(Object.entries(person).map((a) => `${a[0]}=${a[1]}`))

// EXERCISE 2.2 — Object.assign vs spread for merging.
const defaults = { theme: "light", lang: "en", notifications: true };
const overrides = { theme: "dark", fontSize: 14 };

// YOUR CODE HERE:
// a) Merge using Object.assign into a NEW object (don't mutate defaults).
//    Hint: Object.assign({}, defaults, overrides)
let obj = Object.assign({}, defaults, overrides)
console.log(obj);

// b) Merge using spread.
let spread = { ...defaults, ...overrides }
console.log(spread, "spreaaad")
// c) Verify defaults was not mutated.
console.log(defaults, overrides)
// d) What wins when there's a conflict? Verify.


// EXERCISE 2.3 — Object.fromEntries.
// a) Take the person object, double all numeric values, and rebuild the object.
//    Expected: { name: "Swastik", age: 42, city: "Sydney", role: "Engineer" }

function doubleNumbers(obj) {
  // YOUR CODE HERE: entries → map → fromEntries
  return Object.fromEntries(Object.entries(obj).map((a) => {
    if (Number.isInteger(a[1])) {
      a[1] = 2 * a[1]
    }
    return a
  }))
}

const doubled = doubleNumbers(person);
console.log("doubled", doubled)
assert(doubled.age, 42, "doubleNumbers age");
assert(doubled.name, "Swastik", "doubleNumbers name unchanged");


// EXERCISE 2.4 — Transform an object's keys.
// Write `mapKeys(obj, fn)` — apply fn to every key, keep values the same.
function mapKeys(obj, fn) {
  // YOUR CODE HERE
  return Object.fromEntries(Object.entries(obj).map((a) => [fn(a[0]), a[1]]))
}

const result = mapKeys({ firstName: "Swastik", lastName: "Lohchab" }, k => k.toUpperCase());
console.log(result)
assert(result, { FIRSTNAME: "Swastik", LASTNAME: "Lohchab" }, "mapKeys");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: DESTRUCTURING IN DEPTH
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Recap + advanced patterns.
//
//  Nested destructuring:
//    const { address: { city, zip } } = user;
//
//  Destructuring in function parameters:
//    function display({ name, age = 0 }) { ... }
//
//  Destructuring arrays from entries:
//    for (const [key, value] of Object.entries(obj)) { ... }
//
//  Renaming + default in one go:
//    const { n: name = "Guest" } = config;
//    // If config.n exists, rename it to `name`. If not, use "Guest".

// EXERCISE 3.1 — Nested object destructuring.
const company = {
  name: "TechCorp",
  location: {
    city: "Sydney",
    country: "Australia",
    coords: { lat: -33.8688, lng: 151.2093 }
  },
  employees: 500
};

// YOUR CODE HERE:
// Destructure in ONE statement to get: name, city, country, lat, lng, employees
const { name, location: { city, country, coords: { lat, lng } }, employees } = company
console.log(city)
// EXERCISE 3.2 — Destructuring function parameters.
// Rewrite this function to destructure the config object in the parameter list.
// function connectDB({host:config,port,db=5432}) {
//   // const host = config.host;
//   // const port = config.port || 5432;
//   // const db = config.database;
//   console.log(`Connecting to ${db} on ${host}:${port}`);
// }
// YOUR CODE HERE: Rewrite `connectDB2` with parameter destructuring + defaults.
// function connectDB2({ host, port = 5432, database: db }) {
//   // Already done as example — just log: `Connecting to ${db} on ${host}:${port}`
// }


// EXERCISE 3.3 — Destructuring in loops.
const inventory = [
  { sku: "A1", name: "Widget", qty: 100 },
  { sku: "B2", name: "Gadget", qty: 0 },
  { sku: "C3", name: "Doohickey", qty: 50 },
];

// YOUR CODE HERE:
// Use for...of with destructuring to log only items with qty > 0:
for (let [sku, name, qty] of Object.entries(inventory)) {
  console.log(`${name} (${sku}): ${qty} in stocks`)
}
// "Widget (A1): 100 in stock"
// "Doohickey (C3): 50 in stock"


// EXERCISE 3.4 — Swap values with destructuring.
let first = "hello";
let last = "world";
// YOUR CODE HERE: swap first and last using array destructuring.
[first, last] = [last, first]
console.log(first, last); // "world hello"

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: ITERATING OVER OBJECTS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Several ways to iterate over objects.
//
//  for...in loop   — iterates over ALL enumerable properties, INCLUDING inherited ones!
//                    Always pair with hasOwnProperty check for safety.
//
//  Object.keys().forEach() — iterates only OWN enumerable keys. Safer and more common.
//
//  Object.entries().forEach() — gives you [key, value] pairs. Most convenient.
//
//  for...of    — works on ARRAYS (and other iterables), NOT plain objects directly.
//                Use with Object.entries() to iterate objects with for...of.
//
//  INTERVIEW TIP: "What's the difference between for...in and for...of?"
//    for...in → iterates over KEYS of an object (enumerable properties)
//    for...of → iterates over VALUES of an ITERABLE (arrays, strings, Maps, Sets)
//    Objects are not iterable by default, so for...of throws on a plain object.

// EXERCISE 4.1 — Demonstrate for...in risk.
const child = { a: 1, b: 2 };
// Imagine child has an inherited property from a prototype (we'll simulate):
// for (const key in child) { log key } — would log inherited keys too.
// YOUR CODE HERE: Iterate child using for...in WITH a hasOwnProperty guard.
for (let key in child) {
  if (child.hasOwnProperty(key)) console.log(key)
}

// EXERCISE 4.2 — Write `pick(obj, keys)` that returns a new object with only
// the specified keys from obj.
function pick(obj, keys) {
  let newObj = {};
  for (let key of keys) {
    newObj[key] = obj[key]
  }
  return newObj
}

const full = { id: 1, name: "Alice", password: "secret", role: "admin" };
assert(pick(full, ["id", "name"]), { id: 1, name: "Alice" }, "pick");


// EXERCISE 4.3 — Write `omit(obj, keys)` that returns a new object WITHOUT
// the specified keys.
function omit(obj, keys) {
  // YOUR Code Here
  let newObj = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (!keys.includes(key)) {
      newObj[key] = value;
    }
  });

  return newObj;
}

assert(omit(full, ["password"]), { id: 1, name: "Alice", role: "admin" }, "omit");


// EXERCISE 4.4 — invert an object (swap keys and values).
function invert(obj) {
  // YOUR CODE HERE
}

assert(invert({ a: 1, b: 2, c: 3 }), { "1": "a", "2": "b", "3": "c" }, "invert");

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: PROPERTY DESCRIPTORS & Object.freeze / Object.seal
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Object immutability tools.
//
//  Object.freeze(obj)  — prevents adding, removing, OR changing properties.
//                        Returns the same object. SHALLOW — nested objects are NOT frozen.
//  Object.seal(obj)    — prevents adding OR removing properties, but allows CHANGING existing ones.
//  Object.isFrozen(obj) / Object.isSealed(obj) — checks the state.
//
//  Neither throws in non-strict mode — it just silently fails.
//  In strict mode ("use strict"), it throws a TypeError.
//
//  SHALLOW caveat:
//    const obj = Object.freeze({ nested: { val: 1 } });
//    obj.nested.val = 999;  // This WORKS! freeze doesn't go deep.

// EXERCISE 5.1 — Demonstrate Object.freeze shallow limitation.
const config = Object.freeze({
  host: "localhost",
  db: { name: "mydb", port: 5432 }
});

// YOUR CODE HERE:
// a) Try to change config.host. What happens?
config.host = "updated"
console.log(config)
// b) Try to change config.db.port. What happens? Why?
config.db.port = "3001"
console.log(config)
// c) Write a deepFreeze(obj) function that freezes recursively.

function deepFreeze(obj) {
  Object.freeze(obj)
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];

    if (value !== null && (typeof value === "object") && !Object.isFrozen(value)) {
      deepFreeze(value)
    }
  })
  return obj
}

console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: MINI CHALLENGE — OBJECT UTILITIES
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 6.1 — Deep equal.
// Write `deepEqual(a, b)` that returns true if two values are deeply equal.
// Handle: primitives, arrays, plain objects (don't worry about Date, Map, etc.)

function deepEqual(a, b) {
  // YOUR CODE HERE
  if (a == b) return true;

  let aIsArray = Array.isArray(a);
  let bIsArray = Array.isArray(b);
  if (aIsArray !== bIsArray) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

 
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;

    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

assert(deepEqual(1, 1), true, "deepEqual primitives");
assert(deepEqual([1, [2, 3]], [1, [2, 3]]), true, "deepEqual nested arrays");
assert(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }), true, "deepEqual nested objects");
assert(deepEqual({ a: 1 }, { a: 2 }), false, "deepEqual different values");


// CHALLENGE 6.2 — Flatten a nested object.
// Convert { a: { b: { c: 1 }, d: 2 }, e: 3 } → { "a.b.c": 1, "a.d": 2, "e": 3 }

function flattenObject(obj, prefix = "") {
  // YOUR CODE HERE: recursive
  
}

const nested = { a: { b: { c: 1 }, d: 2 }, e: 3 };
assert(flattenObject(nested), { "a.b.c": 1, "a.d": 2, "e": 3 }, "flattenObject");


// CHALLENGE 6.3 — Group array of objects by a key.
// Write `groupBy(arr, key)` that groups objects by the value of that key.

function groupBy(arr, key) {
  // YOUR CODE HERE
}

const people = [
  { name: "Alice", dept: "Engineering" },
  { name: "Bob", dept: "Design" },
  { name: "Eve", dept: "Engineering" },
  { name: "Frank", dept: "Design" },
];

const grouped = groupBy(people, "dept");
assert(grouped["Engineering"].length, 2, "groupBy Engineering count");
assert(grouped["Design"].length, 2, "groupBy Design count");
console.log(grouped);

console.log("=== Sheet 4 complete! Move on to js_05_classes.js ===\n");
