// ============================================================================
//  TYPESCRIPT — SHEET 2: FUNCTIONS
//  Goal: Typing functions completely — signatures, overloads, generics,
//        and the utility types that extract info from function types.
// ============================================================================
//
//  HOW TO RUN:
//    ts-node ts_02_functions.ts
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: FUNCTION TYPE SIGNATURES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Functions can be typed multiple ways.
//
//  1. Inline annotation:
//     function add(a: number, b: number): number { return a + b; }
//
//  2. Type alias for a function type:
//     type Adder = (a: number, b: number) => number;
//     const add: Adder = (a, b) => a + b;  // params inferred from type!
//
//  3. Call signature in an interface (when the function also has properties):
//     interface Formatter {
//       (value: string): string;   // call signature
//       locale: string;            // property
//     }
//
//  Optional parameters: use `?` — they become `type | undefined` inside the body.
//  Default parameters: provide a value — type is inferred from the default.
//  Rest parameters:    `...items: string[]` — typed as an array.
//
//  INTERVIEW TIP: What's the difference between `param?: string` and
//  `param: string | undefined`?
//  `param?` makes the parameter OPTIONAL at the call site (can omit it entirely).
//  `param: string | undefined` is REQUIRED — must be passed, even if undefined.

// EXERCISE 1.1 — Define function types as type aliases.

// YOUR CODE HERE: Write type aliases for these:
// a) A function that takes a string and returns a number
type StringToNumber = (s: string) => number;

// b) A function that takes any number of numbers and returns a number
type Aggregator = (...nums: number[]) => number;

// c) A function that takes an object with `id: string` and returns void
type IdHandler = (obj: { id: string }) => void;

// d) A formatter: takes a value and optional locale, returns string
type Formatter = (value: number, locale?: string) => string;


// EXERCISE 1.2 — Optional vs default parameters.
function createUrl(
  base: string,
  path: string,
  protocol: string = "https",
  port?: number
): string {
  // YOUR CODE HERE:
  // Build URL: "https://base:port/path" (omit port if not provided)
  const portStr = port !== undefined ? `:${port}` : "";
  return `${protocol}://${base}${portStr}/${path}`;
}

console.log(createUrl("api.example.com", "users"));           // https://api.example.com/users
console.log(createUrl("localhost", "api", "http", 3000));     // http://localhost:3000/api


// EXERCISE 1.3 — Typing callbacks precisely.
// Don't type callbacks as `Function` — that loses all type info.

// BAD:
function badProcess(items: string[], callback: Function): void {
  items.forEach(callback);
}

// GOOD:
function goodProcess(
  items: string[],
  callback: (item: string, index: number) => void
): void {
  items.forEach(callback);
}

// YOUR CODE HERE: Rewrite `transform` to accept a typed transform callback.
// It should take an array of T, a mapper from T to U, and return U[].
// (Hint: this is just a typed version of .map — write it manually)
function transform<T, U>(arr: T[], mapper: (item: T, index: number) => U): U[] {
  // YOUR CODE HERE
  return arr.map(mapper);
}

console.log(transform([1, 2, 3], x => x * 2));          // [2, 4, 6]
console.log(transform(["a", "b"], (s, i) => `${i}:${s}`)); // ["0:a", "1:b"]

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: FUNCTION OVERLOADS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Overloads let you declare MULTIPLE signatures for one function.
//  TypeScript picks the matching signature based on the arguments you pass.
//  The actual implementation must be compatible with ALL overloads, but the
//  implementation signature itself is NOT visible to callers.
//
//  Syntax:
//    function fn(x: string): string;       // overload 1
//    function fn(x: number): number;       // overload 2
//    function fn(x: string | number): string | number { ... }  // implementation
//
//  Rules:
//    • At least 2 overload signatures (else just use a union)
//    • Implementation signature must handle ALL overload cases
//    • Implementation signature is NOT callable from outside
//
//  WHEN TO USE:
//    • Return type depends on input type (can't express with just unions)
//    • Different argument counts with different behaviour
//    • Better IDE auto-complete than a messy union signature
//
//  INTERVIEW TIP: Overloads are often over-used. If a union return type works,
//  prefer that. Use overloads only when the return type depends on input type.

// EXERCISE 2.1 — Overload for input-dependent return type.
// `parseInput(value: string): number`
// `parseInput(value: number): string`
// When given a string, return parsed number. When given a number, return string.

function parseInput(value: string): number;
function parseInput(value: number): string;
function parseInput(value: string | number): number | string {
  // YOUR CODE HERE
  if (typeof value === "string") return parseFloat(value);
  return String(value);
}

const n: number = parseInput("3.14");  // TS knows this is number
const s: string = parseInput(42);       // TS knows this is string
console.log(n, s);  // 3.14  "42"


// EXERCISE 2.2 — Overload for optional parameters that change behaviour.
// `createElement(tag: string): HTMLElement`
// `createElement(tag: string, content: string): HTMLElement`
// `createElement(tag: string, content: string, className: string): HTMLElement`

// (We'll simulate HTMLElement with a plain object since we're in Node)
interface MockElement { tag: string; content: string; className: string; }

function createElement(tag: string): MockElement;
function createElement(tag: string, content: string): MockElement;
function createElement(tag: string, content: string, className: string): MockElement;
function createElement(tag: string, content = "", className = ""): MockElement {
  // YOUR CODE HERE
  return { tag, content, className };
}

console.log(createElement("div"));
console.log(createElement("p", "Hello"));
console.log(createElement("span", "World", "highlight"));


// EXERCISE 2.3 — Overload vs conditional return type (know the difference).
// Sometimes a generic with a conditional type is cleaner than overloads.

// Overload approach (above).
// Generic conditional approach — note the different ergonomics:
function parseInputGeneric<T extends string | number>(
  value: T
): T extends string ? number : string {
  if (typeof value === "string") return parseFloat(value) as any;
  return String(value) as any;
}

// Both work — overloads are often simpler to read and maintain.

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: GENERIC FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Generics let you write functions that work with ANY type while
//  still preserving type information end-to-end.
//
//  Without generics, you either use `any` (unsafe) or write separate
//  functions for each type (repetitive).
//
//  `<T>` declares a type parameter — TS infers it at the call site.
//  You can have multiple type params: `<T, U>`, `<K, V>`, etc.
//
//  Constraints: use `extends` to restrict what types T can be.
//    function getLength<T extends { length: number }>(arg: T): number
//    // T must have a length property — works for string, array, etc.
//
//  Default type parameters (TS 2.3+):
//    function wrap<T = string>(value: T): T[] — T defaults to string if not specified.
//
//  INTERVIEW TIP: "When should a function be generic?"
//  When the function PRESERVES the relationship between input and output types.
//  If the return type is always the same regardless of input, don't use generics.

// EXERCISE 3.1 — Identity and basic generics.

function identity<T>(value: T): T {
  return value;
}

const n2 = identity(42);        // T inferred as number
const s2 = identity("hello");   // T inferred as string
const arr = identity([1,2,3]);  // T inferred as number[]


// EXERCISE 3.2 — Generic with constraints.
// Write `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const profile = { name: "Swastik", age: 21, city: "Sydney" };
const age = getProperty(profile, "age");        // type: number
const name = getProperty(profile, "name");      // type: string
// getProperty(profile, "invalid");             // Error: "invalid" not a key of profile

console.log(age, name);


// EXERCISE 3.3 — Generic data structures.
// Write `Stack<T>` — a generic stack class.

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numStack = new Stack<number>();
numStack.push(1); numStack.push(2); numStack.push(3);
console.log(numStack.pop());   // 3
console.log(numStack.peek());  // 2
console.log(numStack.size);    // 2

// numStack.push("string");  // Error! Stack<number> only accepts numbers


// EXERCISE 3.4 — Generic utilities.

// a) Write `first<T>(arr: T[]): T | undefined` — returns the first element.
function first<T>(arr: T[]): T | undefined {
  // YOUR CODE HERE
}

// b) Write `zip<T, U>(a: T[], b: U[]): [T, U][]` — pairs elements.
function zip<T, U>(a: T[], b: U[]): [T, U][] {
  // YOUR CODE HERE
  return a.map((item, i) => [item, b[i]]);
}

// c) Write `groupBy<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<K, T[]>`
function groupBy<T, K extends string | number>(
  arr: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

const people = [
  { name: "Alice", dept: "Eng" },
  { name: "Bob",   dept: "Design" },
  { name: "Eve",   dept: "Eng" },
];

const grouped = groupBy(people, p => p.dept);
console.log(grouped["Eng"].length);    // 2
console.log(grouped["Design"].length); // 1

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: FUNCTION TYPE UTILITY TYPES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: TypeScript provides built-in utility types that extract
//  type information FROM existing functions. Crucial for working with
//  third-party libraries where you don't control the types.
//
//  ReturnType<T>            — extracts the return type of function type T
//  Parameters<T>            — extracts parameter types as a tuple
//  ConstructorParameters<T> — same but for class constructors
//  InstanceType<T>          — type of instances created by constructor T
//  Awaited<T>               — unwraps Promise<T> to T (handles nested promises)
//
//  Example:
//    function fetchUser(id: string): Promise<{ name: string }> { ... }
//    type UserResult = Awaited<ReturnType<typeof fetchUser>>;
//    // UserResult = { name: string }

// EXERCISE 4.1 — Extract types from existing functions.

function createSession(userId: string, expiresIn: number, role: "admin" | "user") {
  return { userId, expiresIn, role, token: Math.random().toString(36) };
}

// YOUR CODE HERE: Use ReturnType and Parameters to derive types.
type SessionParams = Parameters<typeof createSession>;
type Session       = ReturnType<typeof createSession>;

// Verify:
const params: SessionParams = ["u1", 3600, "admin"];
const session: Session = createSession(...params);
console.log(session);


// EXERCISE 4.2 — Awaited for async functions.
async function fetchUserData(id: string) {
  return { id, name: "Swastik", email: "s@example.com" };
}

type UserData = Awaited<ReturnType<typeof fetchUserData>>;
// UserData = { id: string; name: string; email: string }

// YOUR CODE HERE: Write a function `processUser(user: UserData)` that logs the name.
function processUser(user: UserData): void {
  console.log(`Processing: ${user.name}`);
}


// EXERCISE 4.3 — ConstructorParameters and InstanceType.
class Connection {
  constructor(
    public host: string,
    public port: number,
    public database: string
  ) {}

  query(sql: string): string {
    return `[${this.database}] ${sql}`;
  }
}

type ConnectionArgs     = ConstructorParameters<typeof Connection>;
type ConnectionInstance = InstanceType<typeof Connection>;

function createConnection(...args: ConnectionArgs): ConnectionInstance {
  return new Connection(...args);
}

const conn = createConnection("localhost", 5432, "mydb");
console.log(conn.query("SELECT * FROM users"));


console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: MINI CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 5.1 — Type-safe pipe function.
// Write a `pipe` function that threads a value through a series of functions.
// The OUTPUT type of each function must match the INPUT type of the next.
// This is hard to type generically for arbitrary length — implement for 1-4 functions.

function pipe<A, B>(a: A, f1: (x: A) => B): B;
function pipe<A, B, C>(a: A, f1: (x: A) => B, f2: (x: B) => C): C;
function pipe<A, B, C, D>(a: A, f1: (x: A) => B, f2: (x: B) => C, f3: (x: C) => D): D;
function pipe(a: unknown, ...fns: Array<(x: unknown) => unknown>): unknown {
  return fns.reduce((val, fn) => fn(val), a);
}

const result = pipe(
  "  hello world  ",
  (s: string) => s.trim(),
  (s: string) => s.toUpperCase(),
  (s: string) => s.split(" "),
);
console.log(result); // ["HELLO", "WORLD"]


// CHALLENGE 5.2 — Async retry with typed result.
// Write `retry<T>(fn: () => Promise<T>, attempts: number): Promise<T>`

async function retry<T>(fn: () => Promise<T>, attempts: number): Promise<T> {
  // YOUR CODE HERE
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

// Test:
let count = 0;
retry(() => {
  count++;
  if (count < 3) return Promise.reject(new Error(`Attempt ${count} failed`));
  return Promise.resolve("success");
}, 5).then(v => console.log("Retry result:", v));


// CHALLENGE 5.3 — Builder pattern with method chaining.
// Implement a QueryBuilder that is fully typed at each step.

class QueryBuilder<T extends object = {}> {
  private conditions: string[] = [];
  private selectedFields: (keyof T)[] = [];
  private limitVal?: number;
  private tableName = "";

  from(table: string): this {
    this.tableName = table;
    return this;
  }

  select(...fields: (keyof T)[]): this {
    this.selectedFields = fields;
    return this;
  }

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  limit(n: number): this {
    this.limitVal = n;
    return this;
  }

  build(): string {
    const fields = this.selectedFields.length
      ? this.selectedFields.join(", ")
      : "*";
    let query = `SELECT ${fields} FROM ${this.tableName}`;
    if (this.conditions.length) query += ` WHERE ${this.conditions.join(" AND ")}`;
    if (this.limitVal !== undefined) query += ` LIMIT ${this.limitVal}`;
    return query;
  }
}

interface User { id: number; name: string; email: string; role: string; }

const query = new QueryBuilder<User>()
  .from("users")
  .select("id", "name", "email")
  .where("role = 'admin'")
  .where("active = true")
  .limit(10)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE role = 'admin' AND active = true LIMIT 10

console.log("=== Sheet 2 complete! Move on to ts_03_objects_and_unions.ts ===\n");

export {};
