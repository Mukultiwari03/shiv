// ============================================================================
//  TYPESCRIPT — SHEET 1: THE TYPE SYSTEM
//  Goal: Understand how TypeScript thinks about types — inference, widening,
//        narrowing, and the special types that trip everyone up.
// ============================================================================
//
//  HOW TO RUN:
//    ts-node ts_01_type_system.ts
//  OR compile first:
//    tsc ts_01_type_system.ts && node ts_01_type_system.js
//
//  DO THESE IN ORDER — each section builds on the last.
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: TYPE INFERENCE & ANNOTATIONS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: TypeScript infers types automatically. You only need to annotate
//  when inference isn't enough (function params, ambiguous cases, API boundaries).
//
//  RULES OF THUMB:
//    • Let TS infer wherever it can — less noise, same safety.
//    • Annotate function parameters ALWAYS (TS can't infer from callers).
//    • Annotate return types on public/exported functions (makes contracts explicit).
//    • Annotate variables only when the inferred type is too wide or wrong.
//
//  Type widening: when you use `let`, TS infers the WIDEST compatible type.
//    let x = "hello"  → type is `string`  (not `"hello"`)
//  Type narrowing from const: `const` gives a LITERAL type.
//    const x = "hello"  → type is `"hello"` (literal, not `string`)
//
//  INTERVIEW TIP: "When should you add type annotations?"
//  At system boundaries (function signatures, exported values, API responses).
//  Let inference handle local variables — over-annotating is noise.

// EXERCISE 1.1 — Predict the inferred type of each variable.
// Hover over them in your editor to verify.

let a = 42;              // inferred: ______
let b = "typescript";    // inferred: ______
let c = true;            // inferred: ______
const d = 42;            // inferred: ______ (different from `let`!)
const e = "typescript";  // inferred: ______

let arr = [1, 2, 3];     // inferred: ______
let mixed = [1, "two"];  // inferred: ______


// EXERCISE 1.2 — When inference goes wrong. Fix each case.

// Case A: TS infers `never[]` for an empty array — it can't know what you'll push.
// Fix: add a type annotation.
const names = [];             // Error: names.push("Alice") would fail. Fix this.
// names.push("Alice");

// Case B: The variable needs to hold two different types at different times.
let id;                       // Don't just assign a value — give it a union type annotation.
id = "user-123";
id = 456;


// EXERCISE 1.3 — Explicit vs inferred return type.
// TypeScript can infer return types, but explicit annotations catch bugs early.

// Without annotation: TS infers return type from the body.
function addNumbers(a: number, b: number) {
  return a + b;  // inferred: number ✓
}

// With annotation: TS enforces the contract — helpful for complex functions.
function formatCurrency(amount: number, currency: string): string {
  return `${currency}${amount.toFixed(2)}`;
}

// EXERCISE: Write a function `divide` with explicit return type annotation.
// It takes two numbers and returns their quotient, or null if divisor is 0.
function divide(a: number, b: number): number | null {
  // YOUR CODE HERE
}

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: any, unknown, never, void
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: The four "special" types. Understanding these separates
//  TypeScript beginners from confident practitioners.
//
//  any
//    Opts OUT of type checking entirely. TypeScript trusts you completely.
//    ✗ Dangerous — errors hide until runtime. Avoid in production code.
//    ✓ Escape hatch when migrating JS → TS or working with untyped libraries.
//    Contagious: once you use `any`, it spreads to related variables.
//
//  unknown
//    The TYPE-SAFE version of `any`. You can assign anything TO it,
//    but you CANNOT use it without first narrowing its type.
//    ✓ Use for: function params you don't know in advance, JSON.parse results,
//      catch clause errors, API responses before validation.
//
//  never
//    A type that represents something that NEVER happens.
//    • Return type of functions that throw or loop forever.
//    • The empty type — no value can be assigned to `never`.
//    • Appears in exhaustive checks (if TS narrows to `never`, all cases are handled).
//
//  void
//    The return type of functions that don't return a meaningful value.
//    Not the same as `undefined` — void says "don't use this return value".

// EXERCISE 2.1 — any vs unknown.

function processAny(input: any) {
  // This compiles fine — but might blow up at runtime:
  console.log(input.toUpperCase()); // No error! But fails if input is a number.
  return input.length;
}

function processUnknown(input: unknown) {
  // YOUR CODE HERE: Try to call input.toUpperCase() — what error do you get?
  // Then FIX it by narrowing the type first.
  // a) Use typeof to check if input is a string, then call toUpperCase.
  // b) Return the length if it's an array, undefined otherwise.
}


// EXERCISE 2.2 — never for exhaustive checks.
// This is one of TypeScript's most powerful patterns.

type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape, size: number): number {
  switch (shape) {
    case "circle":   return Math.PI * size ** 2;
    case "square":   return size ** 2;
    case "triangle": return (Math.sqrt(3) / 4) * size ** 2;
    default:
      // If you add a new shape to the union and forget to handle it here,
      // TypeScript will give you a compile error on this line.
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// EXERCISE: Add "hexagon" to the Shape union above. What error appears? Where?
// Then add the hexagon case to make it compile.


// EXERCISE 2.3 — void vs undefined.

function logMessage(msg: string): void {
  console.log(msg);
  // return undefined;  // this is allowed
  // return 42;         // Error! Can't return a value from void
}

// void in a callback type means "we don't care about the return value"
type Callback = () => void;
const cb: Callback = () => 42;   // This is allowed! void callback allows any return.
// void as a return type means "don't use the return value",
// not "you must return undefined".


// EXERCISE 2.4 — Typing catch blocks.
// Before TS 4.0: catch variables were `any` — dangerous.
// Since TS 4.0: use `unknown` and narrow.

function riskyParse(json: string) {
  try {
    return JSON.parse(json);
  } catch (err) {
    // YOUR CODE HERE:
    // `err` is `unknown`. Narrow it to check if it's an Error object.
    // If yes, log err.message. If no, log "Unknown error".
    // Hint: `err instanceof Error`
  }
}

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: TYPE NARROWING IN DEPTH
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: TypeScript tracks types through control flow.
//  After each conditional check, TS NARROWS the type in that branch.
//  This is called "control flow analysis" and it's very powerful.
//
//  Narrowing techniques:
//    typeof x === "string"        — primitive type check
//    x instanceof Date            — class/constructor check
//    "property" in x              — property existence check
//    Array.isArray(x)             — array check
//    x != null                    — null/undefined check (removes both)
//    Type predicates: `x is Type` — custom narrowing functions
//    Discriminated unions          — covered in Sheet 3
//
//  After `if (x === null) return`, TS knows x is NOT null below that line.

// EXERCISE 3.1 — typeof narrowing.
function format(value: string | number | boolean): string {
  // YOUR CODE HERE:
  // - If string: return it trimmed and lowercased
  // - If number: return it formatted to 2 decimal places
  // - If boolean: return "yes" or "no"
}

console.log(format("  Hello  "));  // "hello"
console.log(format(3.14159));      // "3.14"
console.log(format(true));         // "yes"


// EXERCISE 3.2 — instanceof narrowing.
function describeError(err: unknown): string {
  // YOUR CODE HERE:
  // - If it's a TypeError: return "Type Error: " + err.message
  // - If it's a RangeError: return "Range Error: " + err.message
  // - If it's any Error: return "Error: " + err.message
  // - Otherwise: return "Unknown problem"
  return "";
}


// EXERCISE 3.3 — `in` operator narrowing for duck typing.
interface Cat { meow(): void; fur: string; }
interface Fish { swim(): void; scales: number; }

function makeSound(animal: Cat | Fish): void {
  // YOUR CODE HERE:
  // Use `"meow" in animal` to check type, then call the right method.
}


// EXERCISE 3.4 — Type predicate (user-defined type guard).
// Write a type guard `isString(val: unknown): val is string`.

function isString(val: unknown): val is string {
  // YOUR CODE HERE
}

function processInput(input: unknown) {
  if (isString(input)) {
    // TypeScript now knows input is a string here:
    console.log(input.toUpperCase()); // no error
  }
}


// EXERCISE 3.5 — Truthiness narrowing.
// TypeScript narrows falsy types (null, undefined, "") out of unions.

function greet(name: string | null | undefined): string {
  // YOUR CODE HERE:
  // If name is truthy: return "Hello, <name>!"
  // Otherwise: return "Hello, stranger!"
}

console.log(greet("Swastik"));  // "Hello, Swastik!"
console.log(greet(null));       // "Hello, stranger!"
console.log(greet(""));         // "Hello, stranger!"

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: TYPE COMPATIBILITY & STRUCTURAL TYPING
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: TypeScript uses STRUCTURAL typing (duck typing).
//  A type is compatible with another if it has at least the same structure.
//  It does NOT matter what the type is CALLED — only what shape it has.
//
//  This is different from Java/C# where types must explicitly declare compatibility.
//
//  Example:
//    interface Point2D { x: number; y: number; }
//    interface Point3D { x: number; y: number; z: number; }
//    const p3: Point3D = { x: 1, y: 2, z: 3 };
//    const p2: Point2D = p3;   // OK! Point3D has everything Point2D needs.
//    const p3b: Point3D = p2;  // Error! p2 missing `z`.
//
//  Excess property checking:
//  When you use an OBJECT LITERAL directly (not a variable), TS performs
//  "excess property checking" and will error on extra keys.
//    const p: Point2D = { x: 1, y: 2, z: 3 };  // Error: 'z' not in Point2D
//    const p: Point2D = p3;  // OK (assigned via variable — no excess check)
//
//  INTERVIEW TIP: "What is structural typing?"
//  TypeScript checks that a value has the required SHAPE, not that it was
//  declared as a specific type. Two types with the same properties are
//  interchangeable, even if they have different names.

// EXERCISE 4.1 — Demonstrate structural typing.
interface Named { name: string; }
interface Aged  { age: number; }

function greetPerson(person: Named): string {
  return `Hello, ${person.name}`;
}

const employee = { name: "Alice", department: "Engineering", age: 30 };
// YOUR CODE: Can you pass `employee` to greetPerson? Try it. Why does it work?


// EXERCISE 4.2 — Excess property checking.
interface Config {
  host: string;
  port: number;
}

// YOUR CODE: Try both of these — which one errors? Why?
// const c1: Config = { host: "localhost", port: 3000, debug: true }; // excess property literal
// const opts = { host: "localhost", port: 3000, debug: true };
// const c2: Config = opts;  // via variable — no excess check


// EXERCISE 4.3 — Function type compatibility.
// In TypeScript, a function with FEWER parameters is assignable to a function type
// with MORE parameters (but not vice versa). This is why array callbacks work.
//
// [1,2,3].forEach((item, index, arr) => ...)
// [1,2,3].forEach(item => ...)   ← also works! You can ignore extra params.

type Transformer = (value: string, index: number) => string;

const withBoth: Transformer = (v, i) => `${i}:${v}`;
const withOne:  Transformer = (v) => v.toUpperCase();  // fewer params — allowed!
// const withMore: Transformer = (v, i, extra: boolean) => v; // Error: too many

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: LITERAL TYPES, CONST ASSERTIONS & ENUMS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Literal types narrow a type to a specific VALUE.
//
//  String literal:  type Direction = "north" | "south" | "east" | "west"
//  Number literal:  type Dice = 1 | 2 | 3 | 4 | 5 | 6
//  Boolean literal: type AlwaysTrue = true
//
//  `as const` — const assertion.
//  Turns every value in an object or array into its LITERAL type, and marks
//  everything readonly. Prevents widening.
//    const palette = { primary: "blue", secondary: "red" } as const;
//    // palette.primary is "blue" (literal), NOT string
//    // palette.primary = "green"; // Error — readonly!
//
//  `as const` is preferred over `enum` in modern TS because:
//    • It's just a JS object — no runtime overhead (enums generate JS code)
//    • Better tree-shaking
//    • Works with string literal unions naturally
//
//  INTERVIEW TIP: Know the difference between `enum` and `as const` objects.
//  Prefer `as const` + union types in new code unless you specifically need
//  the reverse mapping that numeric enums provide.

// EXERCISE 5.1 — Template the as const pattern.
// Define a DIRECTIONS constant object and derive its value type.

const DIRECTIONS = {
  NORTH: "north",
  SOUTH: "south",
  EAST:  "east",
  WEST:  "west",
} as const;

// Derive the union type from the object values:
type Direction = typeof DIRECTIONS[keyof typeof DIRECTIONS];
// Direction is now: "north" | "south" | "east" | "west"

function move(dir: Direction, steps: number): string {
  return `Moving ${dir} by ${steps} steps`;
}

console.log(move("north", 3));
// move("up", 3);  // Error! "up" is not a Direction


// EXERCISE 5.2 — `as const` on arrays (tuple inference).
const RGB = ["red", "green", "blue"] as const;
type RGBColor = typeof RGB[number];  // "red" | "green" | "blue"

// YOUR CODE: Create an HTTP_METHODS constant array and derive its type.
// const HTTP_METHODS = [...] as const;
// type HttpMethod = typeof HTTP_METHODS[number];


// EXERCISE 5.3 — Numeric enum vs string enum vs as const.
// When would you still use an enum? Numeric enums give you a reverse mapping:
//   enum Dir { Up, Down }
//   Dir[0]     → "Up"   (reverse mapping)
//   Dir["Up"]  → 0
// String enums do NOT have reverse mapping.

enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500,
}

function isSuccess(status: HttpStatus): boolean {
  // YOUR CODE HERE: return true if status is 2xx
}

console.log(isSuccess(HttpStatus.OK));         // true
console.log(isSuccess(HttpStatus.NotFound));   // false

console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: TYPE ASSERTIONS & SATISFIES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY:
//
//  Type assertion (`as Type`):
//    Tells the compiler "I know better than you — treat this as Type."
//    Does NOT convert the value at runtime — purely compile-time.
//    Can be WRONG — if you assert incorrectly, you'll get a runtime crash.
//    Two assertions needed for "impossible" casts: `value as unknown as Target`
//
//  Non-null assertion (`!`):
//    Tells TS "this value is NOT null or undefined — trust me."
//    Use sparingly — if you're wrong, runtime crash.
//    const el = document.getElementById("app")!;
//
//  `satisfies` operator (TS 4.9+):
//    Validates that a value satisfies a type WITHOUT widening its type.
//    Great for config objects where you want both type safety AND literal types.
//
//    // Problem with `as`:
//    const config = { port: 3000 } as Config;  // widened, lose literal "3000"
//
//    // Problem with annotation:
//    const config: Config = { port: 3000 };    // port widened to `number`
//
//    // `satisfies` — best of both:
//    const config = { port: 3000 } satisfies Config;
//    // TS checks Config shape AND keeps port as literal `3000`

// EXERCISE 6.1 — When `as` is appropriate.
// Casting from unknown (API response, JSON.parse, DOM)
const apiResponse: unknown = { userId: 1, name: "Swastik" };

interface UserResponse {
  userId: number;
  name: string;
}

// YOUR CODE HERE: safely cast apiResponse to UserResponse using `as`
const user = apiResponse as UserResponse;
console.log(user.name);


// EXERCISE 6.2 — Non-null assertion.
// Use sparingly — only when YOU are certain it won't be null.

// Simulating a DOM environment:
const maybeElement: HTMLElement | null = null;

// YOUR CODE HERE:
// a) Access maybeElement.textContent — what error do you get?
// b) Use ! to tell TS it's not null. What's the risk?
// c) The safer alternative: optional chaining (maybeElement?.textContent)


// EXERCISE 6.3 — `satisfies` operator.
type Palette = {
  [key: string]: [number, number, number] | string;
};

// Using `satisfies` — palette keeps literal types while being validated:
const palette = {
  red:   [255, 0, 0],
  green: "#00ff00",
  blue:  [0, 0, 255],
} satisfies Palette;

// These work because TS preserved the literal types:
const [r, g, b] = palette.red;           // TS knows this is a tuple, not just an array!
const greenHex = palette.green.toUpperCase();  // TS knows this is a string!

// YOUR CODE HERE: Create a `CONFIG` object with `satisfies` that has:
// host: string, port: number, ssl: boolean
// Then access `CONFIG.port.toFixed(0)` — TS should know it's a number.

console.log("=== Section 6 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: MINI CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 7.1 — Type-safe event registry.
// Define a type `EventMap` that maps event name strings to their payload types.
// Then create a type-safe `emit` and `on` function.

type AppEventMap = {
  "user:login":  { userId: string; timestamp: Date };
  "user:logout": { userId: string };
  "order:placed": { orderId: string; total: number };
};

// Write overloaded/generic emit and on:
function emit<K extends keyof AppEventMap>(event: K, payload: AppEventMap[K]): void {
  console.log(`Event: ${event}`, payload);
}

function on<K extends keyof AppEventMap>(
  event: K,
  handler: (payload: AppEventMap[K]) => void
): void {
  // In a real system you'd register the handler
  console.log(`Registered handler for: ${event}`);
}

// These should be fully type-safe — wrong keys or payloads cause errors:
emit("user:login", { userId: "u1", timestamp: new Date() });
// emit("user:login", { userId: "u1" }); // Error: missing timestamp
// emit("unknown:event", {});            // Error: unknown event


// CHALLENGE 7.2 — Branded types (type safety for primitive IDs).
// Without branding, UserId and OrderId are both `string` and are interchangeable.
// With branding, TS prevents you from using one where the other is expected.

type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId  = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function makeUserId(id: string): UserId {
  return id as UserId;
}
function makeOrderId(id: string): OrderId {
  return id as OrderId;
}

function getUser(id: UserId): string {
  return `User: ${id}`;
}

const uid = makeUserId("u-123");
const oid = makeOrderId("o-456");

console.log(getUser(uid));
// getUser(oid);  // Error! Can't pass OrderId where UserId expected.
// getUser("u-123");  // Error! Raw string is not a UserId.

console.log("=== Sheet 1 complete! Move on to ts_02_functions.ts ===\n");

export {};
