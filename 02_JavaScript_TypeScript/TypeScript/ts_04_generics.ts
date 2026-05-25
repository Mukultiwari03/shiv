// ============================================================================
//  TYPESCRIPT — SHEET 4: GENERICS IN DEPTH
//  Goal: Master generics — the feature that makes TypeScript truly powerful.
//        Generics are in every library, every React component, every API type.
// ============================================================================
//
//  HOW TO RUN:
//    ts-node ts_04_generics.ts
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: GENERIC CONSTRAINTS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Without constraints, `<T>` is TOO flexible — you can't access
//  any property or method because TS doesn't know what T looks like.
//  Constraints narrow T to types that meet minimum requirements.
//
//  Syntax: `<T extends Constraint>`
//
//  Common constraint patterns:
//    T extends object             — T must be an object (not primitive)
//    T extends { id: string }     — T must have an `id: string` property
//    T extends keyof U            — T must be a key of U
//    T extends string | number    — T must be string or number
//    T extends new(...) => any    — T must be a constructor
//
//  Multiple constraints: Use intersection
//    T extends Serializable & Printable
//
//  INTERVIEW TIP: "What does `T extends K` mean in generic constraints?"
//  It means T must be ASSIGNABLE to K — T must have at least the shape of K.
//  This is structural typing applied to generic type parameters.

// EXERCISE 1.1 — Write constrained generics.

// a) Write `getLength<T extends { length: number }>(arg: T): number`
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
console.log(getLength("hello"));        // 5
console.log(getLength([1, 2, 3]));      // 3
console.log(getLength({ length: 7 }));  // 7
// getLength(42);  // Error! number has no `length`


// b) Write `merge<T extends object, U extends object>(obj1: T, obj2: U): T & U`
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}
const merged = merge({ name: "Alice" }, { age: 30, role: "admin" });
console.log(merged.name, merged.age, merged.role); // Alice 30 admin


// c) Write `findById<T extends { id: string | number }>(arr: T[], id: T["id"]): T | undefined`
function findById<T extends { id: string | number }>(arr: T[], id: T["id"]): T | undefined {
  return arr.find(item => item.id === id);
}

const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
const found = findById(users, 2);
console.log(found?.name); // Bob


// EXERCISE 1.2 — Constraint using keyof.
// `pluck<T, K extends keyof T>(arr: T[], key: K): T[K][]`
// Extract a specific property from every object in an array.

function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key]);
}

const products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Mouse",  price: 50   },
  { id: 3, name: "Keyboard", price: 80 },
];
console.log(pluck(products, "name"));   // ["Laptop", "Mouse", "Keyboard"]
console.log(pluck(products, "price"));  // [1200, 50, 80]
// pluck(products, "invalid");          // Error!


// EXERCISE 1.3 — Generic factory constraint.
// `createInstance<T>(Ctor: new () => T): T`
// Accepts a constructor (with no args) and returns a new instance.

function createInstance<T>(Ctor: new () => T): T {
  return new Ctor();
}

class Logger {
  log(msg: string) { console.log("[LOG]", msg); }
}

const logger = createInstance(Logger);
logger.log("Created via generic factory");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: GENERIC INTERFACES & CLASSES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Interfaces and classes can be generic too.
//
//  Generic interface:
//    interface Container<T> {
//      value: T;
//      transform<U>(fn: (val: T) => U): Container<U>;
//    }
//
//  Generic class:
//    class Box<T> {
//      constructor(private value: T) {}
//      get(): T { return this.value; }
//      map<U>(fn: (v: T) => U): Box<U> { return new Box(fn(this.value)); }
//    }
//
//  You can also constrain the class's type parameter:
//    class SortedList<T extends Comparable> { ... }

// EXERCISE 2.1 — Generic repository interface.
interface Repository<T, ID> {
  findById(id: ID): T | undefined;
  findAll(): T[];
  save(item: T): void;
  delete(id: ID): boolean;
}

// Implement a generic in-memory repository:
class InMemoryRepository<T extends { id: string }> implements Repository<T, string> {
  private store: Map<string, T> = new Map();

  findById(id: string): T | undefined {
    return this.store.get(id);
  }

  findAll(): T[] {
    return Array.from(this.store.values());
  }

  save(item: T): void {
    this.store.set(item.id, item);
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }
}

interface Product2 { id: string; name: string; price: number; }

const productRepo = new InMemoryRepository<Product2>();
productRepo.save({ id: "p1", name: "Laptop", price: 1200 });
productRepo.save({ id: "p2", name: "Mouse",  price: 50   });
console.log("All products:", productRepo.findAll().map(p => p.name));
console.log("Found p1:", productRepo.findById("p1")?.name);
productRepo.delete("p1");
console.log("After delete:", productRepo.findAll().length); // 1


// EXERCISE 2.2 — Generic Maybe/Option type (functional pattern).
// Represents a value that might or might not exist.

class Maybe<T> {
  private constructor(private readonly _value: T | null) {}

  static of<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  static empty<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  static fromNullable<T>(value: T | null | undefined): Maybe<T> {
    return value == null ? Maybe.empty<T>() : Maybe.of(value);
  }

  isPresent(): boolean {
    return this._value !== null;
  }

  get(): T {
    if (this._value === null) throw new Error("Maybe is empty");
    return this._value;
  }

  getOrElse(defaultValue: T): T {
    return this._value !== null ? this._value : defaultValue;
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    if (this._value === null) return Maybe.empty<U>();
    return Maybe.of(fn(this._value));
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    if (this._value === null) return Maybe.empty<U>();
    return fn(this._value);
  }
}

const user2 = Maybe.fromNullable({ name: "Swastik", address: { city: "Sydney" } });
const city = user2
  .map(u => u.address)
  .map(a => a.city)
  .getOrElse("Unknown");
console.log("City:", city); // "Sydney"

const noUser = Maybe.fromNullable<{ name: string; address: null }>(null);
console.log("No user city:", noUser.map(u => u.name).getOrElse("Anonymous")); // "Anonymous"

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: DEFAULT TYPE PARAMETERS & CONDITIONAL TYPES (INTRO)
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Default type parameters.
//  Like default function parameters, you can provide defaults for type params.
//    interface ApiResponse<T = unknown> { data: T; status: number }
//    type R1 = ApiResponse;          // T = unknown
//    type R2 = ApiResponse<User>;    // T = User
//
//  💡 THEORY: Conditional types (intro — deep dive in Sheet 7).
//  Conditional types let types BRANCH based on assignability checks.
//    type IsString<T> = T extends string ? true : false;
//    type A = IsString<string>;  // true
//    type B = IsString<number>;  // false
//
//  The `infer` keyword (intro):
//    Extract a type from WITHIN another type at the point where it appears.
//    type ElementType<T> = T extends (infer E)[] ? E : never;
//    type N = ElementType<number[]>;  // number
//
//  INTERVIEW TIP: Conditional types are advanced but common in library code.
//  Know the basic `T extends X ? Y : Z` syntax and what `infer` does.

// EXERCISE 3.1 — Default type parameters.
interface PaginatedResult<T = unknown, Meta = PaginationMeta2> {
  items: T[];
  meta: Meta;
}

interface PaginationMeta2 {
  page: number;
  total: number;
}

// Using defaults:
type UnknownPage   = PaginatedResult;              // T = unknown, Meta = PaginationMeta2
type UserPage      = PaginatedResult<{ id: string; name: string }>;
type CustomPage    = PaginatedResult<string, { cursor: string }>;

const userPage: UserPage = {
  items: [{ id: "u1", name: "Alice" }],
  meta: { page: 1, total: 1 },
};
console.log("User page:", userPage.items[0].name);


// EXERCISE 3.2 — Basic conditional types.
// Write these conditional type aliases:

// a) IsArray<T> — true if T is an array, false otherwise
type IsArray<T> = T extends any[] ? true : false;
type A1 = IsArray<number[]>;   // true
type A2 = IsArray<string>;     // false

// b) Flatten<T> — if T is an array, get the element type; otherwise T
type Flatten<T> = T extends Array<infer E> ? E : T;
type F1 = Flatten<number[]>;   // number
type F2 = Flatten<string>;     // string
type F3 = Flatten<string[][]>; // string[]  (one level)

// c) Awaited2<T> — manually implement Awaited (unwrap Promise)
type Awaited2<T> = T extends Promise<infer U> ? Awaited2<U> : T;
type P1 = Awaited2<Promise<string>>;           // string
type P2 = Awaited2<Promise<Promise<number>>>;  // number


// EXERCISE 3.3 — Conditional types with function types.

// Extract the return type of a function (reimplementing ReturnType):
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;

function getScore(): number { return 42; }
function getName(): string  { return "Alice"; }

type ScoreType = MyReturnType<typeof getScore>;  // number
type NameType  = MyReturnType<typeof getName>;   // string

// Extract the first parameter type:
type FirstParam<T extends (...args: any) => any> =
  T extends (first: infer P, ...rest: any) => any ? P : never;

function login(userId: string, password: string): boolean { return true; }
type LoginFirstParam = FirstParam<typeof login>;  // string

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: GENERIC PATTERNS IN PRACTICE
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 4.1 — Generic event emitter with typed events.

type EventHandler<T> = (payload: T) => void;

class TypedEventEmitter<Events extends Record<string, unknown>> {
  private handlers: Partial<{
    [K in keyof Events]: EventHandler<Events[K]>[];
  }> = {};

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    (this.handlers[event] as EventHandler<Events[K]>[]).push(handler);
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    const list = this.handlers[event] as EventHandler<Events[K]>[] | undefined;
    if (list) {
      this.handlers[event] = list.filter(h => h !== handler) as any;
    }
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const list = this.handlers[event] as EventHandler<Events[K]>[] | undefined;
    list?.forEach(h => h(payload));
  }
}

// Define the event map:
interface AppEvents {
  login:   { userId: string; timestamp: number };
  logout:  { userId: string };
  purchase: { orderId: string; amount: number };
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on("login", ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${new Date(timestamp).toISOString()}`);
});

emitter.on("purchase", ({ orderId, amount }) => {
  console.log(`Order ${orderId}: $${amount}`);
});

// Fully type-safe — wrong event names or payloads are compile errors:
emitter.emit("login", { userId: "u1", timestamp: Date.now() });
emitter.emit("purchase", { orderId: "o-123", amount: 99.99 });
// emitter.emit("unknown", {});              // Error!
// emitter.emit("login", { userId: "u1" });  // Error! missing timestamp


// EXERCISE 4.2 — Generic cache with TTL.
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TTLCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();

  set(key: string, value: T, ttlMs: number): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

const cache = new TTLCache<{ name: string }>();
cache.set("user:1", { name: "Alice" }, 5000); // expires in 5s
console.log("Cached:", cache.get("user:1")?.name); // "Alice"

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: MINI CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 5.1 — Implement a fully typed `pipe` function using generics.
// Already done in Sheet 2, but now appreciate the generic signatures.

// CHALLENGE 5.2 — Deep Partial<T>.
// The built-in Partial<T> only makes the TOP level optional.
// Write DeepPartial<T> that makes ALL nested properties optional too.

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface FullConfig {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
    pool: {
      min: number;
      max: number;
    };
  };
}

type PartialConfig = DeepPartial<FullConfig>;

// Now you can provide partial nested objects:
const partialConfig: PartialConfig = {
  server: {
    port: 3000,     // host is optional
    ssl: {
      enabled: true // cert is optional
    }
  }
  // database is optional entirely
};
console.log("Partial config server port:", partialConfig.server?.port);


// CHALLENGE 5.3 — Generic validation pipeline.
// Write `Validator<T>` — a composable validator that accumulates errors.

class Validator<T> {
  private rules: Array<{ check: (v: T) => boolean; message: string }> = [];

  addRule(check: (v: T) => boolean, message: string): this {
    this.rules.push({ check, message });
    return this;
  }

  validate(value: T): { valid: boolean; errors: string[] } {
    const errors = this.rules
      .filter(r => !r.check(value))
      .map(r => r.message);
    return { valid: errors.length === 0, errors };
  }
}

const ageValidator = new Validator<number>()
  .addRule(v => v >= 0,   "Age must be non-negative")
  .addRule(v => v <= 150, "Age must be realistic")
  .addRule(v => Number.isInteger(v), "Age must be a whole number");

console.log(ageValidator.validate(25));    // { valid: true, errors: [] }
console.log(ageValidator.validate(-1));    // { valid: false, errors: ["Age must be non-negative"] }
console.log(ageValidator.validate(200));   // { valid: false, errors: ["Age must be realistic"] }

const emailValidator = new Validator<string>()
  .addRule(v => v.length > 0,    "Email cannot be empty")
  .addRule(v => v.includes("@"), "Must contain @")
  .addRule(v => v.includes("."), "Must contain a domain");

console.log(emailValidator.validate("swastik@example.com")); // valid
console.log(emailValidator.validate("notanemail"));          // invalid

console.log("=== Sheet 4 complete! Move on to ts_05_utility_types.ts ===\n");

export {};
