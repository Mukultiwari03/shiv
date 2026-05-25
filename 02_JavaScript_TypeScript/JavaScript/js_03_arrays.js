// ============================================================================
//  JAVASCRIPT — SHEET 3: ARRAYS & ARRAY METHODS
//  Goal: Master every array method used in interviews and real codebases.
//        You will use these methods constantly in React and Next.js.
// ============================================================================
//
//  HOW TO RUN:
//    node js_03_arrays.js
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: CREATING & MUTATING ARRAYS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: MUTATING methods change the original array.
//  Know which methods mutate and which don't — a classic interview question.
//
//  MUTATING:
//    .push(item)          — adds to end, returns new length
//    .pop()               — removes from end, returns removed item
//    .unshift(item)       — adds to start, returns new length
//    .shift()             — removes from start, returns removed item
//    .splice(start, n)    — removes n items at index start (can also insert)
//    .sort(compareFn)     — sorts IN PLACE
//    .reverse()           — reverses IN PLACE
//    .fill(val, s, e)     — fills range with value
//
//  NON-MUTATING (return a new array):
//    .slice(start, end)   — extracts a portion
//    .concat(...arrs)     — joins arrays
//    .map()               — transforms each element
//    .filter()            — keeps elements matching predicate
//    .reduce()            — accumulates to a single value
//    .flat(depth)         — flattens nested arrays
//    .flatMap(fn)         — map + flat(1) combined
//    [...arr]             — spread (copies)
//
//  INTERVIEW TIP: "Does sort mutate the array?"  YES. If you need to sort
//  without mutating: [...arr].sort(compareFn) — spread first, then sort.

// EXERCISE 1.1 — Demonstrate mutation.
const nums = [3, 1, 4, 1, 5];
let sorted = nums.sort((a, b) => a - b);
console.log(sorted);

// YOUR CODE HERE:
// a) Are `nums` and `sorted` the same array? Log both and compare.
// yes both nums and sorted are the same array/
// b) How would you sort WITHOUT mutating nums?
sorted = [...nums].sort((a, b) => a - b);


// EXERCISE 1.2 — splice vs slice.
const letters = ["a", "b", "c", "d", "e"];

// YOUR CODE HERE:
// a) Use splice to remove "c" and "d" from `letters`. Log the removed items and `letters`.
console.log(letters.splice(2, 2));
console.log(letters);
// b) Reset letters to ["a","b","c","d","e"] and use slice to extract ["b","c","d"] WITHOUT mutating.
letters.splice(2, 0, "c", "d");
let extractedLetters = letters.slice(1, 4);
console.log(`extracted stuff - ${extractedLetters}`);
console.log(letters);

// EXERCISE 1.3 — Build an array from a range.
// Write `range(start, end)` that returns [start, start+1, ..., end] inclusive.
// Do NOT use a for loop — use Array.from.

function range(start, end) {
  // YOUR CODE HERE
  // Hint: Array.from({ length: ... }, (_, i) => ...)
  console.log(end - start);
  let arrayLength = end - start + 1;
  return Array.from({ length: arrayLength }, (_, i) => start + i);
}
console.log(range(2, 5));
assert(range(1, 5), [1, 2, 3, 4, 5], "range(1,5)");
assert(range(0, 3), [0, 1, 2, 3], "range(0,3)");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: map, filter, reduce
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: The three core functional array methods. Master these.
//
//  .map(fn)
//    Transforms every element. Returns a NEW array of the SAME length.
//    [1, 2, 3].map(x => x * 2) → [2, 4, 6]
//
//  .filter(fn)
//    Keeps elements where fn returns truthy. Returns a NEW array (possibly shorter).
//    [1, 2, 3, 4].filter(x => x % 2 === 0) → [2, 4]
//
//  .reduce(fn, initialValue)
//    Accumulates all elements into a single value. Most flexible of the three.
//    fn receives (accumulator, currentValue, index, array).
//    [1, 2, 3, 4].reduce((sum, x) => sum + x, 0) → 10
//
//  CHAINING: These methods can be chained together:
//    [1, 2, 3, 4, 5]
//      .filter(x => x % 2 !== 0)   // [1, 3, 5]
//      .map(x => x * 10)            // [10, 30, 50]
//      .reduce((sum, x) => sum + x, 0) // 90
//
//  INTERVIEW TIP: Implement map/filter/reduce from scratch (Exercise 2.5).

const products = [
  { id: 1, name: "Laptop",   price: 1200, category: "electronics", inStock: true  },
  { id: 2, name: "Book",     price: 20,   category: "education",   inStock: true  },
  { id: 3, name: "Headphones", price: 150, category: "electronics", inStock: false },
  { id: 4, name: "Notebook", price: 5,    category: "education",   inStock: true  },
  { id: 5, name: "Monitor",  price: 800,  category: "electronics", inStock: true  },
];


// EXERCISE 2.1 — map.
// a) Get an array of all product names: ["Laptop", "Book", ...]
let productNames = products.map((product) => product.name);
// console.log(productNames);
// b) Get an array of objects with only { id, name } for each product.
let idName = products.map((product) => {
  id = product.id;
  name = product.name;
  return {id, name};
});
// console.log(idName);
// c) Add a `discountedPrice` field to each product (10% off).
let discountedProducts = products.map((product) => {
  discount = product.price - (product.price/10);
  // console.log(`discount - ${discount}`);
  return {...product, discountedPrice: discount};
})
console.log(discountedProducts);
// YOUR CODE HERE


// EXERCISE 2.2 — filter.
// a) Get only in-stock products.
// console.log(`filtered products - ${JSON.stringify(products.filter((product) => product.inStock === true))}`);
let inStockProducts = products.filter((product) => product.inStock === true);
// b) Get only electronics.
let onlyElectronics = products.filter((product) => product.category == "electronics");
// console.log(`only electronics - ${JSON.stringify(onlyElectronics)}`);
// c) Get products that cost less than $200.
let lessThan200 = products.filter((product) => product.price < 200);
// console.log(`less than 200 products - ${JSON.stringify(lessThan200)}`);
// d) Get in-stock electronics.
let inStockElectronics = products.filter((product) => product.category == "electronics" && product.inStock === true);
// console.log(`in stock electronics - ${JSON.stringify(inStockElectronics)}`);
// YOUR CODE HERE


// EXERCISE 2.3 — reduce.
// a) Calculate the total price of all in-stock products.
let totalPriceInStock = products.reduce((acc, curr) => {
  if (curr.inStock) {
    acc += curr.price;
  }
  return acc;
}, 0);
// console.log(`total price of in stock products - ${JSON.stringify(totalPriceInStock)}`);
// b) Build an object that counts products per category:
let electronicCount = products.reduce((acc, curr) => {
  if (curr.category == "electronics") {
    acc += 1;
  }
  return acc;
}, 0);

let educationCount = products.reduce((acc, curr) => {
  if (curr.category == "education") {
    acc += 1;
  }
  return acc;
}, 0);
let productsPerCategories = {"electronics": electronicCount, "education": educationCount};

// GEMINI's SOLUTION 

let productsPerCategoryGemini = products.reduce((acc, curr) => {
  if (!acc[curr.category]) {
    acc[curr.category] = 0;
  }
  acc[curr.category]++;
  return acc;
}, {});
// console.log(`count per category - ${JSON.stringify(productsPerCategories)}`);
// console.log(`count per category by gemini- ${JSON.stringify(productsPerCategoriesGemini)}`);
//    { electronics: 3, education: 2 }
// c) Find the most expensive product using reduce (return the full product object).
let sampleProduct = { id: 0, name: "sample",   price: 0, category: "someCategory", inStock: true };
let mostExpensiveItem = products.reduce((acc, curr) => {
  if (curr.price >= acc.price) {
    acc = curr;
  }
  return acc;
}, sampleProduct);
// console.log(`most expensive item - ${JSON.stringify(mostExpensiveItem)}`);
// YOUR CODE HERE


// EXERCISE 2.4 — Chaining.
// In ONE chain: get names of all in-stock electronics, sorted alphabetically.
// Expected: ["Laptop", "Monitor"]

const result = products
.filter((product) => product.category == "electronics" && product.inStock === true)
.map((product) => product.name)
.sort();
  // YOUR CODE HERE
  ;

assert(result, ["Laptop", "Monitor"], "in-stock electronics names sorted");


// EXERCISE 2.5 — Build your own reduce.
// Implement `myReduce(arr, fn, initialValue)` from scratch using a for loop.

function myReduce(arr, fn, initialValue) {
  // YOUR CODE HERE
  let acc = initialValue;
  for (let i=0; i < arr.length; i++) {
    acc = fn(acc, arr[i]);
  }
  return acc;
}

assert(myReduce([1, 2, 3, 4], (acc, x) => acc + x, 0), 10, "myReduce sum");
assert(myReduce(["a","b","c"], (acc, x) => acc + x, ""), "abc", "myReduce concat");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: SEARCHING & TESTING
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY:
//
//  .find(fn)          — returns the FIRST element where fn is truthy, or undefined.
//  .findIndex(fn)     — returns the index of the first match, or -1.
//  .some(fn)          — returns true if AT LEAST ONE element matches.
//  .every(fn)         — returns true if ALL elements match.
//  .includes(val)     — returns true if val is in the array (uses ===).
//  .indexOf(val)      — returns the index of the first occurrence, or -1.
//
//  KEY DIFFERENCES:
//    find    → returns the ITEM
//    findIndex → returns the INDEX
//    some    → returns BOOLEAN (short-circuits on first true)
//    every   → returns BOOLEAN (short-circuits on first false)

// EXERCISE 3.1 — Using find and findIndex.
const users = [
  { id: 1, name: "Alice",   role: "admin"  },
  { id: 2, name: "Bob",     role: "user"   },
  { id: 3, name: "Charlie", role: "user"   },
  { id: 4, name: "Diana",   role: "admin"  },
];

// YOUR CODE HERE:
// a) Find the first admin user (return the whole object).
let firstAdminUser = users.find((user) => {user.role === "admin"});
console.log(firstAdminUser);
// b) Find the index of the user with id 3.
// c) Find a user with name "Eve" — what is returned?


// EXERCISE 3.2 — some and every.

// YOUR CODE HERE:
// a) Are there any admin users in the array?
// b) Are ALL users admins?
// c) Does every user have a name?
// d) Are there any users with id > 10?


// EXERCISE 3.3 — Write `findAll(arr, predicate)` — like filter but returns
// the ITEMS and also their INDICES.
// Returns: [{ item, index }, ...]

function findAll(arr, predicate) {
  // YOUR CODE HERE
}

const adminResults = findAll(users, u => u.role === "admin");
console.log(adminResults);
// [{ item: {id:1,...}, index: 0 }, { item: {id:4,...}, index: 3 }]

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: SORTING
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: .sort() compares elements as STRINGS by default.
//  This means [10, 9, 2].sort() → [10, 2, 9] (wrong for numbers!)
//
//  Always provide a comparison function:
//    arr.sort((a, b) => a - b)   → ascending numbers
//    arr.sort((a, b) => b - a)   → descending numbers
//
//  For strings:
//    arr.sort((a, b) => a.localeCompare(b))  → alphabetical
//
//  For objects:
//    people.sort((a, b) => a.age - b.age)
//
//  INTERVIEW TIP: .sort() mutates. To preserve original:
//    const sorted = [...arr].sort(compareFn)
//
//  .sort() compareFn contract:
//    return negative → a comes BEFORE b
//    return positive → b comes BEFORE a
//    return 0        → order unchanged

// EXERCISE 4.1 — Sort numbers correctly.
const scrambled = [10, 3, 100, 1, 25, 7];

// YOUR CODE HERE:
// a) Sort ascending
// b) Sort descending
// c) Verify the original `scrambled` was NOT mutated in (a) and (b)


// EXERCISE 4.2 — Sort objects.
const employees = [
  { name: "Charlie", salary: 70000, yearsExp: 5 },
  { name: "Alice",   salary: 95000, yearsExp: 8 },
  { name: "Bob",     salary: 70000, yearsExp: 3 },
  { name: "Diana",   salary: 85000, yearsExp: 6 },
];

// YOUR CODE HERE:
// a) Sort by salary descending.
// b) Sort by salary ascending, and for ties sort by name alphabetically.
// c) Sort by years of experience, most experienced first.


// EXERCISE 4.3 — Sort by multiple criteria (generic).
// Write `sortBy(arr, ...fields)` where each field is a string (object key).
// Sort by the first field, then by the second as a tiebreaker, etc.

function sortBy(arr, ...fields) {
  // YOUR CODE HERE
}

const newSorted = sortBy(employees, "salary", "name");
console.log(newSorted.map(e => `${e.name}:${e.salary}`));
// ["Bob:70000", "Charlie:70000", "Diana:85000", "Alice:95000"]

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: flat, flatMap & WORKING WITH NESTED ARRAYS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY:
//  .flat(depth)    — flattens nested arrays by `depth` levels (default: 1)
//  .flatMap(fn)    — maps then flattens one level (more efficient than .map().flat())
//
//  Example:
//    [[1,2],[3,4]].flat()          → [1, 2, 3, 4]
//    [1,[2,[3,[4]]]].flat(Infinity) → [1, 2, 3, 4]
//    ["hi there"].flatMap(s => s.split(" ")) → ["hi", "there"]

// EXERCISE 5.1 — Flatten nested data.
const departments = [
  { name: "Engineering", members: ["Alice", "Bob", "Charlie"] },
  { name: "Design",      members: ["Diana", "Eve"] },
  { name: "Product",     members: ["Frank"] },
];

// YOUR CODE HERE:
// a) Get a flat list of ALL member names: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"]
//    Use flatMap.
// b) Get a flat list of "Name (Dept)" strings: ["Alice (Engineering)", ...]
//    Use flatMap.


// EXERCISE 5.2 — Group by and then flatten (common in data processing).
const orders = [
  { customer: "Alice", items: ["book", "pen"] },
  { customer: "Bob",   items: ["laptop"] },
  { customer: "Alice", items: ["notebook", "pencil", "ruler"] },
];

// YOUR CODE HERE:
// Get a flat array of ALL items across ALL orders:
// ["book", "pen", "laptop", "notebook", "pencil", "ruler"]


// EXERCISE 5.3 — Implement flatten from scratch.
// Write `deepFlatten(arr)` that flattens to any depth (without using .flat).

function deepFlatten(arr) {
  // YOUR CODE HERE: recursive solution
}

assert(deepFlatten([1, [2, [3, [4]], 5]]), [1, 2, 3, 4, 5], "deepFlatten");

console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: MINI CHALLENGE — DATA PIPELINE
// ════════════════════════════════════════════════════════════════════════════

const transactions = [
  { id: "T1", userId: "u1", amount: 250,  type: "purchase", date: "2024-01-15" },
  { id: "T2", userId: "u2", amount: 1200, type: "purchase", date: "2024-01-20" },
  { id: "T3", userId: "u1", amount: 75,   type: "refund",   date: "2024-02-01" },
  { id: "T4", userId: "u3", amount: 450,  type: "purchase", date: "2024-02-10" },
  { id: "T5", userId: "u2", amount: 300,  type: "purchase", date: "2024-02-15" },
  { id: "T6", userId: "u1", amount: 500,  type: "purchase", date: "2024-03-01" },
];

// CHALLENGE 6.1 — Total purchase amount (excluding refunds).
// Expected: 2700
function totalPurchases(txns) {
  // YOUR CODE HERE
}
assert(totalPurchases(transactions), 2700, "totalPurchases");


// CHALLENGE 6.2 — Spending per user (purchases only).
// Returns: { u1: 750, u2: 1500, u3: 450 }
function spendingByUser(txns) {
  // YOUR CODE HERE: use reduce with an object accumulator
}
assert(spendingByUser(transactions), { u1: 750, u2: 1500, u3: 450 }, "spendingByUser");


// CHALLENGE 6.3 — Top spender.
// Returns the userId with the highest total spend: "u2"
function topSpender(txns) {
  // YOUR CODE HERE: build on spendingByUser
}
assert(topSpender(transactions), "u2", "topSpender");


// CHALLENGE 6.4 — Group transactions by month.
// Returns: { "2024-01": [T1, T2], "2024-02": [T3, T4, T5], "2024-03": [T6] }
function groupByMonth(txns) {
  // YOUR CODE HERE: use reduce, slice the date string for the key
}

const grouped = groupByMonth(transactions);
assert(grouped["2024-01"].length, 2, "groupByMonth Jan count");
assert(grouped["2024-02"].length, 3, "groupByMonth Feb count");

console.log("=== Sheet 3 complete! Move on to js_04_objects.js ===\n");
