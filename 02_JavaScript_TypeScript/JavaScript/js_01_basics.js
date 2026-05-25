// ============================================================================
//  JAVASCRIPT — SHEET 1: VARIABLES, TYPES & OPERATORS
//  Goal: Understand how JavaScript stores data and compares values.
//        These fundamentals trip up most candidates in interviews.
// ============================================================================
//
//  HOW TO RUN:
//    node js_01_basics.js
//
//  DO THIS IN ORDER. Every section builds on the last.
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: var vs let vs const
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Three ways to declare variables.
//
//  var   — function-scoped, hoisted (declared AND initialised to undefined
//          before the code runs), can be re-declared. Mostly avoid in modern JS.
//
//  let   — block-scoped {}, NOT initialised before reaching the line (Temporal
//          Dead Zone), cannot be re-declared in the same scope. Use when you
//          need to reassign.
//
//  const — same block-scoping as let. Cannot be re-assigned. Does NOT mean
//          immutable: objects/arrays declared with const can still be mutated.
//          Use by default.
//
//  INTERVIEW TIP: "What is hoisting?"
//  Hoisting is JavaScript's behaviour of moving DECLARATIONS (not initialisations)
//  to the top of their scope. var declarations are hoisted and initialised to
//  undefined. let/const are hoisted but NOT initialised — accessing them early
//  throws a ReferenceError (the "Temporal Dead Zone").

// EXERCISE 1.1 — Predict the output, then uncomment each console.log to verify.

console.log(a);        // What prints? Why?
var a = 10;
console.log(a);

// console.log(b);        // What happens? Why?
let b = 20;

// EXERCISE 1.2 — Demonstrate block scoping.
// Fix the code so that `result` is accessible outside the if block.

function blockScopeDemo() {
  let resultLet;
  if (true) {
    var resultVar = "I am var";
    resultLet = "I am let";
  }
  console.log(resultVar);   // Works or fails?
  console.log(resultLet);   // Works or fails?
}

blockScopeDemo();

// EXERCISE 1.3 — const with objects.
// Why does this work even though we used const?
const user = { name: "Swastik", age: 21 };
user.age = 22;              // This is FINE — we mutate the object, not the binding.
// user = { name: "New" };  // UNCOMMENT THIS — this fails. Why?
user.name = "shiv" // this is the correct way to do mutation when defined with const

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: PRIMITIVE TYPES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: JavaScript has 7 primitive types.
//  Primitives are immutable. When you assign a primitive to a variable, you
//  store the VALUE itself (not a reference).
//
//  1. string    — "hello", 'world', `template`
//  2. number    — 42, 3.14, Infinity, NaN (NaN is a number!)
//  3. boolean   — true / false
//  4. null      — intentional "no value" (you set this)
//  5. undefined — variable declared but not assigned (JS sets this)
//  6. bigint    — 9007199254740991n  (huge integers)
//  7. symbol    — Symbol("id")       (unique identifiers, advanced use)
//
//  Everything else (arrays, objects, functions) is an OBJECT (reference type).
//  When you assign an object, you store a REFERENCE to it in memory.
//
//  INTERVIEW TIP: "What is NaN?"
//  NaN stands for "Not a Number". It is the result of invalid math operations
//  like 0/0 or parseInt("hello"). Strangely, typeof NaN === "number" is true.
//  Also, NaN !== NaN — it is the only value not equal to itself.
//  Use Number.isNaN(value) to safely check for it.

// EXERCISE 2.1 — Use typeof to log the type of each value.
const values = [42, "hello", true, null, undefined, {}, [], function () {}];
values.map((value) => {console.log(typeof value)});

// YOUR CODE HERE: loop through values and log typeof each one.
// Expected: number, string, boolean, object, undefined, object, object, function
// Note: typeof null === "object" is a known JavaScript bug!


// EXERCISE 2.2 — NaN quirks.
const result1 = parseInt("abc");
const result2 = 0 / 0;

// YOUR CODE HERE:
// a) Log result1 and result2
// b) Check if result1 === result2 — what do you expect?
// c) Use Number.isNaN() to correctly detect both. Log the results.
console.log(result1);
console.log(result2);
console.log(result1 === result2)
console.log(Number.isNaN(result1) === Number.isNaN(result2));

// EXERCISE 2.3 — Primitive vs Reference types.
// Explain in a comment what the difference is, then verify with code.

let x = 5;
let y = x;
y = 100;
console.log(x);  // What is x? Why?

let obj1 = { score: 5 };
let obj2 = obj1;
obj2.score = 100;
console.log(obj1.score);  // What is obj1.score? Why?

// YOUR ANSWER:
// Primitives are copied by value. Objects are copied by reference.

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: TYPE COERCION & EQUALITY
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: JavaScript is dynamically typed and will often silently convert
//  one type to another. This is called type COERCION, and it causes many bugs.
//
//  Two types of equality:
//    == (loose)  — compares values AFTER coercing both sides to the same type.
//    === (strict) — compares value AND type. No coercion. ALWAYS use this.
//
//  Key coercion rules (loose equality):
//    null == undefined   → true  (they are ONLY equal to each other)
//    null == 0           → false
//    "" == false         → true  (both coerce to 0)
//    "5" == 5            → true  (string coerced to number)
//    [] == false         → true  ([] → "" → 0, false → 0)
//    [] == ![]           → true  (one of JS's most infamous quirks)
//
//  INTERVIEW TIP: Always use ===. Be ready to explain WHY == is dangerous.

// EXERCISE 3.1 — Predict the result of each comparison BEFORE running the code.
// Write your prediction as a comment, then uncomment the log.
console.log(0 == false);         // Your guess: true
console.log(0 === false);        // Your guess: false
console.log("" == false);        // Your guess: true
console.log(null == undefined);  // Your guess: true
console.log(null === undefined); // Your guess: false
console.log(NaN == NaN);         // Your guess: false
console.log([] == []);           // Your guess: false


// EXERCISE 3.2 — Explicit type conversion.
// Convert each value using Number(), String(), Boolean().

// YOUR CODE HERE:
// a) Convert the string "42" to a number.
// b) Convert the number 0 to a boolean. What do you get?
// c) Convert the string "" to a boolean. What do you get?
// d) Convert null to a number. What do you get?
// e) Convert undefined to a number. What do you get?
console.log(String(42));
console.log(Boolean(0));
console.log(Boolean(""));
console.log(Number(null));
console.log(Number(undefined));
console.log(typeof 0)


// EXERCISE 3.3 — Falsy values.
// There are exactly 6 falsy values in JavaScript:
//   false, 0, "" (empty string), null, undefined, NaN
// Everything else is truthy (including "0", [], {}).

// YOUR CODE HERE: Write a function `isTruthy(val)` that returns true if val is
// truthy and false otherwise. Test it against all 6 falsy values and some truthy ones.

function isTruthy(val) {
  switch (val) {
    case false:
      return false;
      break
    case 0:
      return false;
      break;
    case "":
      return false;
      break;
    case null:
      return false;
      break;
    case undefined:
      return false;
      break;
    case NaN:
      return false;
      break;
  }
  return true;
}
console.log(isTruthy(0));
console.log(isTruthy("0"));
console.log(isTruthy([]));

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: OPERATORS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Two modern operators you MUST know for interviews.
//
//  Nullish Coalescing (??)
//    Returns the RIGHT side only when the LEFT side is null or undefined.
//    Unlike ||, it does NOT trigger on 0, false, or "".
//    Example:
//      const port = userPort ?? 3000;
//      // If userPort is null/undefined → 3000. If it's 0 → 0 (not 3000!).
//
//  Optional Chaining (?.)
//    Safely accesses nested properties. Returns undefined instead of throwing
//    a TypeError if any part of the chain is null/undefined.
//    Example:
//      const city = user?.address?.city;
//      // If user or address is null/undefined → undefined. No crash.
//
//  Logical Assignment Operators (ES2021):
//    a ||= b  →  a = a || b   (assign b if a is falsy)
//    a &&= b  →  a = a && b   (assign b only if a is truthy)
//    a ??= b  →  a = a ?? b   (assign b only if a is null/undefined)

// EXERCISE 4.1 — ?? vs ||
function getConfig(userPort) {
  const portWithOR = userPort || 3000;
  const portWithNullish = userPort ?? 3000;
  return { portWithOR, portWithNullish };
}

// YOUR CODE HERE:
// Call getConfig with: 8080, 0, null, undefined, false
// Log the results. When do || and ?? behave differently?
console.log(getConfig(8080))
console.log(getConfig(0))
console.log(getConfig(null))
console.log(getConfig(undefined))
console.log(getConfig(false))

// EXERCISE 4.2 — Optional chaining on nested objects.
const data = {
  user: {
    profile: {
      address: {
        city: "Sydney"
      }
    }
  }
};

// YOUR CODE HERE:
// a) Safely access data.user.profile.address.city using ?.
console.log(data?.user?.profile?.address?.city);
// b) Safely access data.user.profile.phone.number using ?.
//    What does it return when the path doesn't exist?
// c) Safely call a method: data.user.profile.getFullName?.()
//    What happens when the method doesn't exist?


// EXERCISE 4.3 — Short-circuit evaluation.
// Explain what these expressions evaluate to and WHY.
console.log(true && "hello");     // ?
console.log(false && "hello");    // ?
console.log(null || "fallback");  // ?
console.log("value" || "fallback"); // ?
console.log(0 ?? "fallback");     // ?

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: TEMPLATE LITERALS & STRING METHODS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Template literals (backticks) allow:
//    - String interpolation:  `Hello, ${name}!`
//    - Multi-line strings:    no more \n needed
//    - Embedded expressions:  `${2 + 2}` evaluates to "4"
//
//  Key string methods to know for interviews:
//    .trim()         — removes whitespace from both ends
//    .split(sep)     — splits string into an array
//    .includes(str)  — returns boolean
//    .startsWith()   — returns boolean
//    .endsWith()     — returns boolean
//    .slice(s, e)    — extracts substring (does NOT mutate)
//    .replace(a, b)  — replaces FIRST match (use /regex/g for all)
//    .replaceAll()   — replaces ALL matches
//    .toUpperCase() / .toLowerCase()
//    .padStart(n, c) / .padEnd(n, c) — pad string to length n with character c

// EXERCISE 5.1 — Build a formatted user card string using template literals.
const userData = { name: "Swastik", role: "Engineer", yearsExp: 3 };

// YOUR CODE HERE: Return a multiline string:
// "Name: Swastik
//  Role: Engineer
//  Experience: 3 years"
console.log(`Name: ${userData.name}
Role: ${userData.role}
Experience: ${userData.yearsExp}`)

// EXERCISE 5.2 — String manipulation.
const rawInput = "   hello world   ";

// YOUR CODE HERE:
// a) Trim whitespace
console.log(rawInput.trim(" "));
// b) Capitalize the first letter of each word (result: "Hello World")
console.log(
  rawInput
    .trim()
    .split(" ")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ")
);
// c) Replace "world" with "JavaScript"
console.log(rawInput.replace("world", "JavaScript"));
// d) Split into an array of words
console.log(rawInput.split(" "))
// e) Check if it includes the word "hello" (after trimming)
console.log(rawInput.includes(rawInput.trim()), "hello");


// EXERCISE 5.3 — Format a number as a zero-padded string.
// e.g. formatId(7) → "007", formatId(42) → "042", formatId(100) → "100"
function formatId(num) {
  return String(num).padStart(3, "0");
}

console.log(formatId(7));   // "007"
console.log(formatId(42));  // "042"
console.log(formatId(100)); // "100"

console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: DESTRUCTURING & SPREAD / REST
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Destructuring
//  Extract values from arrays or properties from objects into variables.
//
//  Array destructuring
//    const [first, second, ...rest] = [1, 2, 3, 4, 5];
//    first = 1, second = 2, rest = [3, 4, 5]
//
//    Object destructuring
//    const { name, age, role = "user" } = person; person here could be {"shivam", 10} in which case the value for role would be set to user
//    Default value: if role doesn't exist, it's "user"
//
//    Rename while destructuring
//    const { name: fullName } = person; person = {name: "shivam"}
//    fullName contains the value of person.name
//
//  💡 THEORY: Spread (...)
//  Expand an iterable into individual elements.
//    const merged = { ...defaults, ...overrides };  // last one wins
//    const combined = [...arr1, ...arr2];


//
//  💡 THEORY: Rest (...)
//  Collect remaining elements into an array/object.
//  Looks the same as spread but used in PARAMETER position.
//    function sum(...nums) { ... }  // nums is an array

// EXERCISE 6.1 — Array destructuring with swap.
let p = 1, q = 2;
// YOUR CODE HERE: Swap p and q using array destructuring (no temp variable).
[p, q] = [2, 1]
console.log(p, q); // Expected: 2 1


// EXERCISE 6.2 — Object destructuring with defaults and renaming.
const config = { host: "localhost", port: 5432 };

// YOUR CODE HERE:
// Destructure config to get:
//   - `host` renamed to `dbHost`
//   - `port` as-is
//   - `timeout` with a default of 30
const {host: dbHost, port: port, timeout=30} = config;
console.log(`config - ${config}`);
let newConfig = {dbhost: dbHost, port: port, timeout: timeout}
console.log(`new config - ${JSON.stringify(newConfig)}`);

// testing the last one wins theory
const newdefaults = {name: "name", age: "age", school: "school"};
const sampleDefaults = [1, 2, 3];
const overrides = [3, 5, 6];
const newOverrides = {name: "something", age: "newAge", school: "newSchool"};
const merged = {...newdefaults, ...overrides};
const testDefaults = {something1: "something1", something2: "something2"};
const testDefaults2 = {6: 2, 7: 4}
const newMerged = {...newdefaults, ...overrides, ...testDefaults2};
// uncomment the following to understand how merging works (integers are ranked higher than string)
// console.log(typeof overrides);
// console.log(merged);
// console.log(newMerged);

// EXERCISE 6.3 — Function parameter destructuring.
// Rewrite this function to use object destructuring in the parameter list.
function displayUser(userObj) {
  console.log(`${userObj.name} (${userObj.role})`);
}
// YOUR CODE HERE: Rewrite displayUser to destructure { name, role } directly.
function displayUser({name, role}) {
  console.log(`${name} (${role})`);
}

// EXERCISE 6.4 — Merging objects with spread.
const defaults = { theme: "light", language: "en", notifications: true };
const userPrefs = { theme: "dark", fontSize: 14 };

// YOUR CODE HERE: Merge defaults and userPrefs into `finalConfig`.
// userPrefs should override defaults where keys overlap.
const finalConfig = {...defaults, ...userPrefs};
console.log(finalConfig);

// EXERCISE 6.5 — Rest parameters.
function logFirst(first, second, ...remaining) {
  // YOUR CODE HERE: Log first, second, and the count of remaining args.
  console.log(remaining);
  console.log(`${first}, ${second}, ${remaining.length}`);
}
logFirst(1, 2, 3, 4, 5); // first=1, second=2, remaining has 3 items

console.log("=== Section 6 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: MINI CHALLENGE — PUTTING IT TOGETHER
// ════════════════════════════════════════════════════════════════════════════
//
//  Use everything from this sheet. No hints — just the problem.

// CHALLENGE 7.1 — Write a function `normalise(input)` that:
//   - Accepts a string OR null OR undefined
//   - If null/undefined, return the string "N/A" (use ??)
//   - Trims whitespace
//   - Converts to lowercase
//   - Replaces all spaces with hyphens
//   Example: normalise("  Hello World  ") → "hello-world"
//   Example: normalise(null) → "N/A"

function normalise(input) {
  return input?.trim().toLowerCase().replace(" ", "-") ?? "N/A";
}

console.log(normalise("  Hello World  ")); // "hello-world"
console.log(normalise(null));              // "N/A"
console.log(normalise(undefined));         // "N/A"
console.log(normalise("  TypeScript  "));  // "typescript"


// CHALLENGE 7.2 — Write a function `parseUserInput(raw)` that:
//   - Takes an object that might have: { name, age, city }
//   - All fields might be missing
//   - Returns a formatted object with defaults:
//     { name: (trimmed or "Anonymous"), age: (number or 0), city: (or "Unknown") }

function parseUserInput(input) {
  // YOUR CODE HERE: Use destructuring with defaults, ??, optional chaining.
  let {name, age, city} = input ?? {};
  return {name: name?.trim() ?? "Anonymous", age: age ?? 0, city: city ?? "Unknown"};
}

console.log(parseUserInput({ name: "  Swastik ", age: "21", city: "Sydney" }));
// { name: "Swastik", age: 21, city: "Sydney" }
console.log(parseUserInput({}));
// { name: "Anonymous", age: 0, city: "Unknown" }
console.log(parseUserInput(null));
// { name: "Anonymous", age: 0, city: "Unknown" }

console.log("=== Sheet 1 complete! Move on to js_02_functions.js ===\n");
