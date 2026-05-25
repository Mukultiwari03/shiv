// ============================================================================
//  JAVASCRIPT — SHEET 2: FUNCTIONS
//  Goal: Master every way to define and use functions in JS.
//        Closures and higher-order functions are among the most tested topics.
// ============================================================================
//
//  HOW TO RUN:
//    node js_02_functions.js
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: FUNCTION DECLARATIONS vs EXPRESSIONS vs ARROW FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Three ways to create a function.
//
//  1. Function Declaration
//     function greet(name) { return `Hello, ${name}`; }
//     • Hoisted FULLY (declaration + body). You can call it BEFORE the line it's defined.
//
//  2. Function Expression
//     const greet = function(name) { return `Hello, ${name}`; };
//     • NOT hoisted (only the variable binding is hoisted, as undefined).
//     • Can be named (for recursion/stack traces) or anonymous.
//
//  3. Arrow Function
//     const greet = (name) => `Hello, ${name}`;
//     • Concise syntax, single-expression body needs no `return` or braces.
//     • CRITICAL DIFFERENCE: Arrow functions do NOT have their own `this`.
//       They inherit `this` from the surrounding lexical scope.
//       This matters for class methods and event handlers (covered in Sheet 7).
//
//  INTERVIEW TIP: "When do you use arrow vs regular functions?"
//  Use arrow when you don't need your own `this` (most callbacks, array methods).
//  Use regular/expression when you need `this` (object methods, constructors).

// EXERCISE 1.1 — Hoisting demo.
// Predict: does this call work? Why?
console.log(add(2, 3));     // Called BEFORE declaration — works or fails?

function add(a, b) {
  return a + b;
}
const newAdd = function (a, b) {return a + b;}
console.log(newAdd(2, 3));

// EXERCISE 1.2 — Rewrite as expression, then as arrow function.
// Start: function declaration
function square(n) {
  return n * n;
}

// YOUR CODE HERE:
// a) Rewrite as a function expression stored in `squareExpr`
const squareExpr = function(n) {return n*n;}
// b) Rewrite as an arrow function stored in `squareArrow`
const sqaureArrow = (n) => {return n*n};
// c) Rewrite squareArrow as a one-liner (no braces, implicit return)
const squareArrow = (n) => n*n;

// EXERCISE 1.3 — Arrow function with zero, one, and multiple params.
// YOUR CODE HERE:
// a) Arrow with no params that returns "hello"
const noParams = () => "hello";
// b) Arrow with one param `n` that doubles it (parentheses optional for 1 param)
const oneParam = n => n*2;
// c) Arrow with two params `a, b` that returns their sum
const twoParams = (a, b) => a + b;
// d) Arrow that returns an OBJECT literal { x: 1 }
//    HINT: You must wrap the object in () to avoid JS treating { as a function body.
const objectLiteral = () => ({ x: 1 });


console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: PARAMETERS IN DEPTH
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Default parameters
//  Provide a fallback value when an argument is undefined (or not passed).
//    function greet(name = "Guest") { return `Hello, ${name}`; }
//    greet()          → "Hello, Guest"
//    greet("Swastik") → "Hello, Swastik"
//    greet(null)      → "Hello, null"   ← null does NOT trigger the default!
//
//  💡 THEORY: Rest parameters (...)
//  Collect any number of remaining arguments into an ARRAY.
//  Must be the LAST parameter.
//    function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
//    sum(1, 2, 3, 4) → 10
//
//  vs. the legacy `arguments` object:
//    - `arguments` exists in regular functions (NOT arrow functions).
//    - It is array-LIKE but not a real array (no .map, .filter, etc.).
//    - Prefer rest parameters always in modern code.

// EXERCISE 2.1 — Default parameters.
// Write a function `createUser(name, role = "viewer", active = true)` that
// returns an object with those three properties.

function createUser(name, role = "viewer", active = true) {
  // YOUR CODE HERE
  return {name, role, active};
}

console.log(createUser("Swastik"));               // { name: "Swastik", role: "viewer", active: true }
console.log(createUser("Shiv", "admin"));         // { name: "Shiv", role: "admin", active: true }
console.log(createUser("Bot", "viewer", false));  // { name: "Bot", role: "viewer", active: false }


// EXERCISE 2.2 — Rest parameters.
// Write `sum(...nums)` that adds all numbers passed to it.

function sum(...nums) {
  // YOUR CODE HERE
  return nums.reduce((acc, curr) => {
    return curr + acc;
  }, 0);
}

console.log(sum(1, 2, 3));       // 6
console.log(sum(10, 20, 30, 40)); // 100
console.log(sum());               // 0


// EXERCISE 2.3 — Mix regular params with rest.
// Write `buildSentence(verb, ...nouns)` that returns:
// "I can verb: noun1, noun2, noun3"

function buildSentence(verb, ...nouns) {
  // YOUR CODE HERE
  return `I can ${verb}: ${nouns.map((noun) => {
    return " " + noun;
  })}`;
}

console.log(buildSentence("code", "JavaScript", "TypeScript", "Python"));
// "I can code: JavaScript, TypeScript, Python"


console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: FIRST-CLASS FUNCTIONS & HIGHER-ORDER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Functions are first-class citizens in JavaScript.
//  This means a function can be:
//    • Assigned to a variable
//    • Passed as an argument to another function
//    • Returned from another function
//    • Stored in data structures (arrays, objects)
//
//  A HIGHER-ORDER FUNCTION (HOF) is a function that:
//    • Takes a function as an argument, OR
//    • Returns a function
//
//  This is the foundation of functional programming and how .map(), .filter(),
//  and .reduce() work under the hood.

// EXERCISE 3.1 — Pass a function as an argument.
// Write `applyOperation(a, b, operation)` where `operation` is a function.

function applyOperation(a, b, operation) {
  return operation(a, b);
}

console.log(applyOperation(10, 5, (a, b) => a + b));  // 15
console.log(applyOperation(10, 5, (a, b) => a * b));  // 50
console.log(applyOperation(10, 5, (a, b) => a - b));  // 5


// EXERCISE 3.2 — Return a function from a function (factory pattern).
// Write `createMultiplier(factor)` that returns a function which multiplies
// any number by `factor`.

function createMultiplier(factor) {
  // YOUR CODE HERE: return a function
  return (num) => num * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));   // 10
console.log(triple(5));   // 15
console.log(double(21));  // 42


// EXERCISE 3.3 — Build your own `forEach`.
// Write `myForEach(arr, callback)` that calls callback(item, index) for each element.

function myForEach(arr, callback) {
  // YOUR CODE HERE: use a for loop, do NOT use array.forEach
  for (let i=0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

myForEach(["a", "b", "c"], (item, index) => {
  console.log(`${index}: ${item}`);
});
// 0: a
// 1: b
// 2: c


// EXERCISE 3.4 — Build your own `map`.
// Write `myMap(arr, transform)` that returns a NEW array with each element transformed.

function myMap(arr, transform) {
  // YOUR CODE HERE
  for (let i=0; i < arr.length; i++) {
    arr[i] = transform(arr[i]);
  }

  return arr;
}

console.log(myMap([1, 2, 3], x => x * 2));         // [2, 4, 6]
console.log(myMap(["a", "b"], s => s.toUpperCase())); // ["A", "B"]


console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: CLOSURES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Closures — one of the most asked JS interview topics.
//
//  A CLOSURE is a function that "remembers" the variables from its outer
//  (enclosing) scope even after that outer function has finished running.
//
//  How it works:
//    function outer() {
//      let count = 0;           // lives in outer's scope
//      function inner() {
//        count++;               // inner CLOSES OVER count
//        return count;
//      }
//      return inner;
//    }
//    const counter = outer();   // outer() finished, but count lives on!
//    counter(); // 1
//    counter(); // 2
//
//  Why closures are important:
//    • Data privacy (like private class fields, but for functions)
//    • Stateful functions (remember previous calls)
//    • Factory functions (createMultiplier was a closure!)
//    • Module pattern (encapsulation before ES6 modules)
//
//  INTERVIEW TIP: "Explain closures" — say "A closure gives a function access
//  to variables from its outer scope, even after the outer function has returned.
//  The inner function holds a live reference to those variables, not a copy."

// EXERCISE 4.1 — Build a counter using closures.
// Write `makeCounter(start = 0)` that returns an object with three methods:
//   increment() — adds 1
//   decrement() — subtracts 1
//   getCount()  — returns current count
// The internal count should NOT be accessible from outside.

function makeCounter(start = 0) {
  // YOUR CODE HERE
  const increment = () => start++;
  const decrement = () => start--;
  const getCount = () => start;
  return {increment, decrement, getCount};
}

const counter = makeCounter(10);
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getCount()); // 11


// EXERCISE 4.2 — Classic closure bug (interview favourite!).
// What does this code log? Fix it two ways.

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var loop:", i), 0);
}
// Expected: 0, 1, 2 — Actual: ???

// FIX 1: Change var to let. Why does this fix it?
// FIX 2: Use a closure with an IIFE to capture i each iteration.
//   YOUR CODE HERE (Fix 2 with IIFE):
for (var j = 0; j < 3; j++) {
  // Wrap setTimeout in an IIFE that takes j as a parameter
}


// EXERCISE 4.3 — Private state with closures.
// Write `createBankAccount(initialBalance)` using closures (no class).
// It should return an object with:
//   deposit(amount)   — adds to balance
//   withdraw(amount)  — subtracts if sufficient funds, returns success boolean
//   getBalance()      — returns current balance
// The balance variable must NOT be directly accessible.

function createBankAccount(initialBalance) {
  // YOUR CODE HERE
  const deposit = (amount) => {initialBalance += amount;}
  const withdraw = (amount) => {
    if (amount <= initialBalance) {
      initialBalance -= amount;
      return true;
    } else {
      return false;
    }
  }
  const getBalance = () => initialBalance;
  return {deposit, withdraw, getBalance};
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance());       // 150
console.log(account.withdraw(200));      // false (insufficient)
console.log(account.withdraw(30));       // true
console.log(account.getBalance());       // 120
// console.log(account.balance);         // undefined — private!


console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: CALLBACKS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: A CALLBACK is a function passed into another function to be called
//  at a later time or when an event occurs. It is the original async pattern in JS.
//
//  Synchronous callbacks (called immediately):
//    [1,2,3].map(x => x * 2)   — the arrow is a synchronous callback
//
//  Asynchronous callbacks (called later):
//    setTimeout(() => console.log("later"), 1000)
//    fs.readFile("data.txt", (err, data) => { ... })
//
//  CALLBACK HELL — deeply nested callbacks become hard to read:
//    getUser(id, (user) => {
//      getOrders(user, (orders) => {
//        getProducts(orders, (products) => {
//          // ... deeply nested, hard to maintain
//        });
//      });
//    });
//  This is why Promises and async/await were introduced (covered in Sheet 6).

// EXERCISE 5.1 — Write `repeat(n, action)` that calls action(i) n times (i from 0 to n-1).

function repeat(n, action) {
  // YOUR CODE HERE
  for (let i=0; i < n; i++) {
    action(i);
  }
}

repeat(3, i => console.log(`Iteration ${i}`));
// Iteration 0
// Iteration 1
// Iteration 2


// EXERCISE 5.2 — Error-first callback pattern.
// This is the Node.js convention: callback(error, result).
// Write `divide(a, b, callback)`:
//   - If b is 0, call callback(new Error("Division by zero"))
//   - Otherwise, call callback(null, a / b)

function divide(a, b, callback) {
  // YOUR CODE HERE
}

divide(10, 2, (err, result) => {
  if (err) console.log("Error:", err.message);
  else console.log("Result:", result); // Result: 5
});

divide(10, 0, (err, result) => {
  if (err) console.log("Error:", err.message); // Error: Division by zero
  else console.log("Result:", result);
});


// EXERCISE 5.3 — setTimeout chaining (mini callback hell).
// Log "First", then after 100ms log "Second", then after another 100ms log "Third".
// Use nested setTimeout callbacks to implement this.

// YOUR CODE HERE


console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSION)
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: An IIFE is a function that is defined and called immediately.
//  Syntax:
//    (function() {
//      // code runs immediately
//    })();
//
//  Or with an arrow function:
//    (() => {
//      // code runs immediately
//    })();
//
//  Why use it?
//    • Create a private scope (variables inside don't pollute global scope)
//    • Used in the Module Pattern before ES6 modules
//    • Avoid polluting the global namespace in scripts
//
//  INTERVIEW TIP: IIFEs are less common in modern code (ES6 modules solved this),
//  but they appear in legacy code and are sometimes used in interview questions
//  to test scope understanding.

// EXERCISE 6.1 — Write an IIFE that logs "IIFE ran!" immediately.
// YOUR CODE HERE


// EXERCISE 6.2 — IIFE with return value.
// Store the result of an IIFE that computes and returns the sum of 1 to 100.

const sumTo100 = /* YOUR IIFE HERE */ null;
console.log(sumTo100); // 5050


// EXERCISE 6.3 — IIFE for private scope (module pattern).
// Use an IIFE to create a counter module that exposes only increment and getCount.
// The count variable should be private.

const counterModule = (() => {
  // YOUR CODE HERE: declare count, return { increment, getCount }
})();

counterModule.increment();
counterModule.increment();
counterModule.increment();
console.log(counterModule.getCount()); // 3
// console.log(counterModule.count);   // undefined — private


console.log("=== Section 6 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: MINI CHALLENGE — FUNCTION COMPOSITION
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 7.1 — Memoisation.
// Write `memoize(fn)` that wraps a function and caches its results.
// If the function is called again with the same argument, return the cached result
// instead of recomputing.

function memoize(fn) {
  // YOUR CODE HERE: use a closure to store a cache object
}

let callCount = 0;
const slowSquare = memoize((n) => {
  callCount++;
  return n * n;
});

console.log(slowSquare(4));  // 16  (computed)
console.log(slowSquare(4));  // 16  (cached — callCount should NOT increase)
console.log(slowSquare(5));  // 25  (computed)
console.log("Actual computations:", callCount); // Should be 2, not 3


// CHALLENGE 7.2 — Once.
// Write `once(fn)` that returns a function which can only be called once.
// Subsequent calls return the result from the first call without re-running fn.

function once(fn) {
  // YOUR CODE HERE
}

const initialize = once(() => {
  console.log("Initialising...");
  return 42;
});

console.log(initialize()); // logs "Initialising..." and returns 42
console.log(initialize()); // returns 42, does NOT log again
console.log(initialize()); // returns 42, does NOT log again


// CHALLENGE 7.3 — Partial application.
// Write `partial(fn, ...presetArgs)` that fixes some arguments of a function,
// returning a new function waiting for the rest.

function partial(fn, ...presetArgs) {
  // YOUR CODE HERE
}

function fullGreet(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

const hello = partial(fullGreet, "Hello");
console.log(hello("Swastik", "!"));  // "Hello, Swastik!"
console.log(hello("Shiv", "."));     // "Hello, Shiv."

const helloSwastik = partial(fullGreet, "Hello", "Swastik");
console.log(helloSwastik("!"));      // "Hello, Swastik!"

console.log("=== Sheet 2 complete! Move on to js_03_arrays.js ===\n");
